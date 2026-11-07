(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Ai=["sword-shield","dual-swords","greatsword","staff","bow"],fo=["wander","follow","keep-distance","attack","idle"],Kh={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Na=1e-6;function Is(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Na?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Na?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Xu(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Na){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Na)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const pn=1e-6,ar=Math.PI/180,hc=-1e9;function Jh(){return{type:"none",lastAt:hc,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function or(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function sl(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function dc(n,t,e){const i=e.duration>0?e.duration:fc(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if(sl(a,e.type,i,e.dirX,e.dirZ),a.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>pn){const o=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*o,a.knockZ=e.dirZ*o}or(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if(sl(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>pn){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,or(n,"hit",s.id,s.position)}}function uc(n,t,e){dc(n,{kind:"dummy",index:t},e)}function Wu(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function fc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function $u(n){const t=n.combat,e=n.config.hits,i=n.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*ar),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),c=n.config.dummies.radius,l=n.config.targeting.idealRange;for(const h of n.dummies){const f=h.position.x-i.x,d=h.position.z-i.z,u=Math.hypot(f,d);if(u>s+c)continue;const g=u>pn?f/u:o,v=u>pn?d/u:r;if(u>pn&&(f*o+d*r)/u<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,l));const _=Math.max(0,x-u);uc(n,n.dummies.indexOf(h),{type:m,duration:fc(n,m),dirX:g,dirZ:v,knockback:_})}}function Yu(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,h=o.z,f=l-r,d=h-c,u=f*f+d*d,g=Math.sin(i.facing),v=Math.cos(i.facing),m=Math.cos(al(a.arcDeg,0,180)*ar),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const _=n.dummies[x];if(i.hitIds.indexOf(_.id)>=0)continue;const y=u>pn?al(((_.position.x-r)*f+(_.position.z-c)*d)/u,0,1):0,D=r+f*y,b=c+d*y,w=Math.hypot(_.position.x-D,_.position.z-b);let A=!1;if(a.shape==="circle")A=w<=a.radius+p;else if(a.shape==="capsule")A=w<=Math.max(a.radius,a.width)+p;else{const X=_.position.x-l,L=_.position.z-h,C=Math.hypot(X,L),W=C>pn?(X*g+L*v)/C>=m:!0;A=C<=a.radius+p&&W||w<=a.width+p}if(!A)continue;const E=_.position.x-r,M=_.position.z-c,R=Math.hypot(E,M);if(R>pn&&(E*g+M*v)/R<Math.cos(Math.max(a.arcDeg,90)*ar))continue;const F=R>pn?E/R:g,U=R>pn?M/R:v;dc(n,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:F,dirZ:U,knockback:a.knockback}),i.hitIds.push(_.id),or(n,"link-hit",_.id,_.position)}}function Zu(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,o=e.z-s.position.z,r=Math.hypot(a,o);if(r>t.dummyReach)continue;const c=r>pn?a/r:0,l=r>pn?o/r:1;dc(n,{kind:"player"},{type:"light",duration:fc(n,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function qu(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&$u(n),Yu(n,t),Zu(n)}function al(n,t,e){return n<t?t:n>e?e:n}const Ta=1e-6;function ks(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ju(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function Qh(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function Ku(n){const t=n.abilities,e=n.config.abilities.arcane,i=n.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),o=.55,r={id:++t.nextId,x:i.x+s*o,y:i.y+1,z:i.z+a*o,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(r),t.volleyId+=1,ks(n,"projectile-fire",t.volleyId,r)}function Ju(n,t,e){const i=n.abilities,s=n.config.abilities.arcane,a=n.dash.phase==="active",o=n.playerLink;if(n.combat.weapon==="staff"&&e.attackHeld&&!a&&o.phase==="idle"&&!o.consumedAttack){i.channeling||(i.channeling=!0,i.fireTimer=0,ks(n,"channel-start",0,n.character.position)),i.channelYaw=Is(n,e),i.fireTimer-=t;let c=0;for(;i.fireTimer<=0&&c++<8;)i.fireTimer+=Math.max(s.fireInterval,Ta),Ku(n)}else i.channeling&&(i.channeling=!1,ks(n,"channel-end",0,n.character.position))}function Qu(n,t){const e=n.config.abilities.ring,i=n.dash.phase==="active";if(n.combat.weapon!=="staff"||!t.skill2Pressed||i)return;const s=n.character.position,a={id:++n.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};n.abilities.rings.push(a),ks(n,"ring-place",a.id,s)}function tf(n,t){const e=n.abilities,i=n.config.abilities.arcane,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of e.projectiles){if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(a)for(let l=0;l<n.dummies.length;l++){const h=n.dummies[l],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(!(f*f+d*d>u*u)){uc(n,l,{type:i.hurtType,duration:i.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:i.knockback}),c=!0;break}}c||o.push(r)}e.projectiles=o}function ef(n,t){const e=n.abilities,i=n.config.abilities.ring,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of e.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(i.pulseInterval,Ta),a)for(let l=0;l<n.dummies.length;l++){const h=n.dummies[l],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(f*f+d*d>u*u)continue;const g=Math.hypot(f,d),v=g>Ta?f/g:0,m=g>Ta?d/g:1;uc(n,l,{type:"heavy",duration:i.stun,dirX:v,dirZ:m,knockback:i.knockback})}ks(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}e.rings=o}function nf(n,t,e){Ju(n,t,e),Qu(n,e),tf(n,t),ef(n,t)}function po(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const ol=1e-6;function rl(n,t,e){return n<t?t:n>e?e:n}function td(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function ed(n){const t=n.camera,e=td();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function sf(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,o=0,r=0;for(const l of n.dummies){const h=l.position.x-i.x,f=l.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=rl((e.radius-d)/Math.max(ol,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*u),s+=g,a+=l.position.x*g,o+=l.position.z*g,r+=1}const c=s<=0?0:rl(s/(s+Math.max(ol,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,h=o/s;t.centroidX=l,t.centroidZ=h;let f=(l-i.x)*e.framingBias*c,d=(h-i.z)*e.framingBias*c;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function af(n){const t=[],e=n.ground.size;t.push(Ii("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Ii(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(Ii(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ii(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ii(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Ii(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Ii(n,t,e,i,s,a,o,r){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:o,maxY:r,minZ:i-a/2,maxZ:i+a/2}}const Hn=1e-6;function za(n,t,e){return n<t?t:n>e?e:n}function Oa(n,t,e,i,s,a,o){const r=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+a+Hn||l.maxY<i-o-Hn||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function pc(n,t,e,i,s){let a=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+s+Hn||c.minY>=o-Hn)continue;const l=za(t.x,c.minX,c.maxX),h=za(t.z,c.minZ,c.maxZ),f=t.x-l,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(a=!0,u>Hn*Hn){const g=Math.sqrt(u),v=(e-g)/g;t.x+=f*v,t.z+=d*v}else{const g=t.x-c.minX,v=c.maxX-t.x,m=t.z-c.minZ,p=c.maxZ-t.z,x=Math.min(g,v,m,p);x===g?t.x=c.minX-e:x===v?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function mc(n,t,e,i,s){const a=t.y+i;for(const o of n){if(o.maxY<=t.y+s+Hn||o.minY>=a-Hn)continue;const r=za(t.x,o.minX,o.maxX),c=za(t.z,o.minZ,o.maxZ),l=t.x-r,h=t.z-c;if(l*l+h*h<e*e-Hn)return!0}return!1}const rr=Math.PI/180,gc=1e-6;function of(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Ba(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function nd(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>gc?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function id(n,t,e){const i=n.character,s=Math.hypot(i.velocity.x,i.velocity.z),a=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&s<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,gc)&&a<=Math.max(0,e.inputDeadZone)&&!o}function rf(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function cf(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!id(n,t,e))return!1;const i=nd(n,t,e.lookRange);if(i===null)return!1;const s=Ge(i-n.character.bodyYaw);return Math.abs(s)>Math.max(0,e.triggerDeg)*rr}function lf(n,t,e){const i=n.turnInPlace,s=n.config.turnInPlace;if(!s.enabled||!n.modules.turnInPlace||!id(n,e,s)){Ba(n);return}const a=nd(n,e,s.lookRange);if(a===null){Ba(n);return}const o=n.character,r=Ge(a-o.bodyYaw),c=Math.abs(r),l=Math.max(0,s.triggerDeg)*rr,h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>gc;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,s.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(c,Math.max(0,s.settleDeg)*rr);i.targetYaw=Ge(o.bodyYaw+i.dir*(c-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(s.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Ge(i.targetYaw-i.fromYaw);o.bodyYaw=Ge(i.fromYaw+d*rf(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const cr=1e-6;function Ge(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ys(n,t,e,i){const s=Ge(t-n);return n+s*(1-Math.exp(-Math.max(e,cr)*i))}function cl(n,t,e,i){const s=Ge(t-n),a=Math.abs(s);return a<=i||a<=e?t:Ge(n+Math.sign(s)*Math.max(e,0))}function hf(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=a.phase!=="idle"||a.charging||r||n.dash.phase!=="idle",l=o&&!c,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>cr,d=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(r)i.facing=Is(n,e);else if(l)i.facing=Ys(i.facing,n.gaze.centroidYaw,s.bodyTurnRate,t);else if(f)i.facing=Is(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(s.facingDeadZone,cr)){const D=Math.atan2(e.moveX,e.moveZ),b=s.facingTurnRate*Math.PI/180*t,w=s.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=cl(i.facing,D,b,w);else if(h>=s.facingMinMagnitude&&Math.abs(Ge(D-i.facing))>s.facingDeadbandDeg*Math.PI/180){const E=Ys(i.facing,D,s.facingSmoothRate,t);i.facing=cl(i.facing,E,b,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||cf(n,e)||(i.bodyYaw=Ys(i.bodyYaw,g,s.bodyTurnRate,t));let m=i.facing;if(o?m=l?n.gaze.mainYaw:i.facing:f?m=Math.atan2(e.aimX,e.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget&&(m=n.targeting.targetYaw),!o){const D=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ge(m-i.bodyYaw))>D&&(m=i.moveYaw)}const p=l?n.config.gaze.headTurnRate:s.headTurnRate;let x=Ys(i.headYaw,m,p,t);const _=s.maxHeadTurnDeg*Math.PI/180,y=Ge(x-i.bodyYaw);y>_?x=i.bodyYaw+_:y<-_&&(x=i.bodyYaw-_),i.headYaw=x}const lr=1e-6,df=Math.PI/180;function hr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function xc(n,t,e){return n<t?t:n>e?e:n}function Ja(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function dr(n){const t=n.id,e=n.windowId;Object.assign(n,Ja()),n.id=t,n.windowId=e}function uf(n){dr(n)}function sd(n){dr(n.playerLink);for(const t of n.dummies)dr(t.link)}function ff(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function ur(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Ha(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Ja()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function pf(n,t){const e=n.config.links.search,i=n.character.position,s=xc(e.maxAngleDeg,0,180)*df;let a=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,h=c.position.z-i.z,f=Math.hypot(l,h);if(f<lr||f>e.range)continue;const d=Math.atan2(l,h);Math.abs(Ge(d-t))>s||f<r&&(r=f,a=c.id,o=d)}return{id:a,yaw:o,dist:a>0?r:0}}function mf(n,t,e,i){const s=n.config.links,a=n.playerLink,o=n.character.position,r=Is(n,t),c=pf(n,r),l=c.id>0?c.yaw:r,h=c.id>0?xc(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=h,a.travelled=0,a.fromX=o.x,a.fromZ=o.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),hr(n,"link-start",a.id)}function gf(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Ha(n);return}if(e.weapon!==n.combat.weapon){Ha(n);return}e.timer+=t;const s=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,hr(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,hr(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?xc(r/o,0,1):1,e.phase==="active"&&i.active>lr){const c=Math.max(0,e.travel-e.travelled),l=Math.max(lr,i.active-e.timer),h=c/l;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function xf(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&Ha(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!r&&ur(n,"sprint"),s.prevSprinting=r,gf(n,t);const c=i.moves[o.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&mf(n,e,c,o.weapon)}const fr=1e-6;function ei(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ad(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function vc(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=ad()}function vf(n){return{weapon:Ai[Math.max(0,n-1)]??Ai[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:ad()}}function _f(n,t){return Is(n,t)}function yf(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function od(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=_f(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,ei(n,"attack-start",i)}function rd(n){return Math.max(0,n.config.combat.settle)}function pr(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];od(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:rd(n),lunge:yf(n,i.lunge[e-1]??0)},e)}function Mf(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,od(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:rd(n),lunge:i.lunge},0),ei(n,"charge-release",e)}function Sf(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const c=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<c)break;if(i.phaseTimer-=c,i.phase==="windup")i.phase="active",ei(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",ei(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&pr(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const c=i.timings.recovery;if(c>fr&&i.phaseTimer>=c*n.config.combat.cancelWindow){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&pr(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}const o=s.windup+s.active+s.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=s.windup+i.phaseTimer:i.phase==="recovery"?r=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function bf(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Ai.length){const c=Ai[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,vc(n),Ha(n),ei(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,ei(n,"combo-reset",0))),Sf(n,t,e);const a=s.weapons[i.weapon],o=n.dash.phase==="active";if(a.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;pr(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&(!o&&!n.playerLink.consumedAttack&&e.attackPressed&&i.phase==="idle"&&!i.charging&&(i.charging=!0,i.charge=0,ei(n,"charge-start",0)),i.charging&&e.attackHeld&&(i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,fr))),i.charging&&!o&&(e.attackReleased||!e.attackHeld))){i.charging=!1;const c=i.charge;i.charge=0,c>=s.bow.minChargeToFire&&i.phase==="idle"?Mf(n,e,c):ei(n,"charge-release",0)}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>fr)){const c=i.timings.lunge/i.timings.active;n.impulse.x=Math.sin(i.attackFacing)*c,n.impulse.z=Math.cos(i.attackFacing)*c}}const mr=1e-6;function mo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ef(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function cd(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function ll(n,t,e){return n<t?t:n>e?e:n}function wf(n,t,e){const i=n.config.dash,a=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,h=a.x,f=a.z;for(;l<c-mr;){const d=Math.min(c,l+r),u=a.x+t*d,g=a.z+e*d,v=ll(u,o.minX,o.maxX),m=ll(g,o.minZ,o.maxZ),p={x:v,y:a.y,z:m};if(mc(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=v,f=m,l=d,v!==u||m!==g))break}return{x:h,z:f}}function Af(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,ur(n,"roll")),i.cooldown>0){const r=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),r>0&&i.cooldown===0&&mo(n,"dash-ready",0)}const a=n.combat;if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&a.phase==="idle"&&!a.charging&&n.playerLink.phase==="idle"){const r=Xu(n,e),c=r.x,l=r.z,h=n.combat.weapon==="staff";if(i.kind=h?"blink":"roll",i.dirX=c,i.dirZ=l,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=h?s.blinkCooldown:s.rollCooldown,h){const f=wf(n,c,l);n.character.position.x=f.x,n.character.position.z=f.z,i.toX=f.x,i.toZ=f.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),ur(n,"blink"),mo(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(mr,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+l*s.rollDistance,mo(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const r=Math.max(mr,i.timer),c=n.character.position.x,l=n.character.position.z;n.impulse.x=(i.toX-c)/r,n.impulse.z=(i.toZ-l)/r}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const Ke=1e-6,gr=Math.PI*2,Tf=7,Rf=18;function hl(n,t,e){return n<t?t:n>e?e:n}function Cf(n){return Math.atan2(Math.sin(n),Math.cos(n))}function dl(n,t,e,i){return n+Cf(t-n)*(1-Math.exp(-Math.max(e,Ke)*i))}function _c(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Pf(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Jh(),link:Ja()})}return t}function Lf(n){const t=fo.indexOf(n);return fo[(t+1)%fo.length]}function ld(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,uf(i.link)}n.dummyAttackCount=0}function Df(n,t,e){const i=po(n)*gr,s=Math.sqrt(po(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+po(n)*.8)}function If(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function kf(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const r=Math.max(If(t,i),Ke);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",_c(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,o/a)}function Uf(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,o=Math.hypot(s,a),r=o>Ke?s/o:0,c=o>Ke?a/o:0;let l=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(d,u);(t.wanderTimer<=0||g<.3)&&Df(n,t,e);const v=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(v,m);p>Ke&&(l=v/p,h=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,h=c);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(l=r,h=c):d<-e.keepDeadZone?(l=-r,h=-c):(l=-c*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(l=r,h=c);let f=t.facing;if(t.mode==="wander"?Math.hypot(l,h)>Ke&&(f=Math.atan2(l,h)):o>Ke&&(f=Math.atan2(r,c)),e.leashRadius>Ke&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,g=Math.hypot(d,u);if(g>e.leashRadius){const v=Math.min(1,(g-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),m=-d/g,p=-u/g;l=l*(1-v)+m*v,h=h*(1-v)+p*v;const x=Math.hypot(l,h);x>Ke&&(l/=x,h/=x)}}return{x:l,z:h,facing:f}}function Ff(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=n.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=i.attackRange+Ke&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,_c(n,"dummy-attack",e))}kf(n,e,t,i);const s=Uf(n,e,i),a=1-Math.exp(-Math.max(i.acceleration,Ke)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=dl(e.bodyYaw,e.facing,Tf,t),e.headYaw=dl(e.headYaw,e.facing,Rf,t);const o=e.position.x,r=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;pc(n.boxes,e.position,i.radius,i.height,c)&&mc(n.boxes,e.position,i.radius,i.height,c)&&(e.position.x=o,e.position.z=r,e.velocity.x=0,e.velocity.z=0);const h=n.config.worldBounds;e.position.x=hl(e.position.x,h.minX,h.maxX),e.position.z=hl(e.position.z,h.minZ,h.maxZ);const f=Oa(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+Ke&&(e.position.y=f);const d=Math.hypot(e.position.x-o,e.position.z-r);e.distance+=d;const u=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,u/Math.max(n.config.moveSpeed,Ke)),v=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),Ke);e.stride=v,e.gaitPhase=(e.gaitPhase+d/v*gr)%gr}function Nf(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=Lf(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,_c(n,"dummy-mode",s)}for(const s of n.dummies)Ff(n,t,s,i)}const ki=1e-6,ul=Math.PI*2;function go(n,t){return Math.sqrt(n*n+t*t)}function Zs(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function zf(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,vc(n)}function Of(n,t,e){const i=n.character,s=n.config,a=Oa(n.boxes,t,e,s.characterHeight,s.characterRadius,s.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=a>Number.NEGATIVE_INFINITY?a:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=s.strideLength,i.distance=0,i.coyoteTime=s.coyoteTime,i.jumpBuffer=0,vc(n),sd(n),cd(n),Qh(n),Ba(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=hc,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Bf(n,t,e){const i=n.config,s=n.character,a=s.position,o=s.velocity;let r=e.moveX,c=e.moveZ;const l=go(r,c);l>1&&(r/=l,c/=l);const h=n.combat.phase!=="idle",f=n.playerLink.phase!=="idle",d=h||n.dash.phase==="active"||f;s.sprinting=!d&&e.sprintHeld&&l>ki;const u=i.combat.weapons[n.combat.weapon];let g=u?u.moveMultiplier:1;d?g*=n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=i.abilities.arcane.moveScale);const v=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*g;if(d)o.x=r*v,o.z=c*v;else{const F=l>ki?i.acceleration:i.friction,U=1-Math.exp(-F*t);o.x+=(r*v-o.x)*U,o.z+=(c*v-o.z)*U}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(o.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,Zs(n,"jumped",i.jumpSpeed)),n.events.some(F=>F.type==="blink"&&F.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const p=a.x,x=a.z;if(a.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,a.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,pc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if(mc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=p,a.z=x,o.x=0,o.z=0;else{const F=a.x-p,U=a.z-x;Math.abs(F)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(U)<Math.abs(o.z*t)*.5&&(o.z=0)}Zs(n,"blocked",1)}const y=i.worldBounds;a.x=fl(a.x,y.minX,y.maxX),a.z=fl(a.z,y.minZ,y.maxZ);const D=Oa(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&D>a.y+ki&&D-a.y<=i.stepHeight+ki&&(a.y=D,o.y=0,Zs(n,"stepUp",D));const b=a.y;o.y-=i.gravity*t,a.y+=o.y*t;const w=Oa(n.boxes,a.x,a.z,b,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);w>Number.NEGATIVE_INFINITY&&a.y<=w&&o.y<=0?(a.y=w,o.y=0,s.grounded||Zs(n,"landed",w),s.grounded=!0):s.grounded=!1;const A=go(a.x-p,a.z-x);s.distance+=A;const E=go(o.x,o.z),M=Math.min(i.strideSpeedCap,E/Math.max(i.moveSpeed,ki)),R=Math.max(i.strideLength*(1+M*i.strideSpeedGain),ki);s.stride=R,s.gaitPhase=(s.gaitPhase+A/R*ul)%ul}function fl(n,t,e){return n<t?t:n>e?e:n}const xr=1e-6,pl=2.399963229728653;function yi(n,t,e){return n<t?t:n>e?e:n}function ml(n,t,e,i,s,a,o,r,c){const l=t.x-n.x,h=t.z-n.z,f=Math.hypot(l,h),d=e+i;if(f>=d)return;let u,g,v;f<xr?(u=r,g=c,v=d):(u=l/f,g=h/f,v=d-f);const m=v+o;n.x-=u*m*s,n.z-=g*m*s,t.x+=u*m*a,t.z+=g*m*a}function Hf(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*pl;ml(e[f].position,e[d].position,a,a,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*pl;ml(i,e[f].position,s,a,0,1,r,Math.cos(d),Math.sin(d))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const h of e)pc(n.boxes,h.position,a,n.config.dummies.height,c),h.position.x=yi(h.position.x,l.minX,l.maxX),h.position.z=yi(h.position.z,l.minZ,l.maxZ)}function Gf(n,t,e,i,s,a,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),h=yi(r.minScale,0,1);if(c<xr||l<=0||h>=1)return 1;const f=s+o,d=yi(r.approachDot,0,.99);let u=0;for(const g of a){const v=g.position.x-n,m=g.position.z-t,p=Math.hypot(v,m);if(p>=f+l)continue;if(p<xr){u=1;continue}const x=(e*v+i*m)/(c*p);if(x<=d)continue;const _=yi(1-(p-f)/l,0,1),y=yi((x-d)/(1-d),0,1);u=Math.max(u,_*y)}return 1-(1-h)*yi(u,0,1)}function Vf(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Gf(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const gl=1e-6,Xf=Math.PI/180;function Wf(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function $f(n,t,e){return n<t?t:n>e?e:n}function Yf(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let o=n.character.facing;Math.hypot(e.moveX,e.moveZ)>gl&&(o=Math.atan2(e.moveX,e.moveZ));const c=$f(i.maxAngleDeg,0,180)*Xf;let l=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const g=u.position.x-a.x,v=u.position.z-a.z,m=Math.hypot(g,v);if(m<gl||m>i.range)continue;const p=Math.atan2(g,v),x=Math.abs(Ge(p-o));if(x>c)continue;const _=m-i.frontBias*Math.cos(x);_<l&&(l=_,h=u.id,f=p,d=m)}s.targetId=h,s.targetYaw=f,s.targetDist=d,s.hasTarget=h>0}const Bn=1e-6;function Ga(n,t,e){return n<t?t:n>e?e:n}function xl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Zf(n,t,e){const i=n.config.gaze,s=n.gaze;if(!i.enabled||!n.modules.gaze){s.active=!1,s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}const a=n.character.position,o=(M,R)=>{const F=M.position.x-a.x,U=M.position.z-a.z,X=Math.hypot(F,U);if(X<Bn||X>R)return 0;const L=Ga((R-X)/Math.max(Bn,R-i.nearDistance),0,1);let C=L*(i.modeWeight[M.mode]??.5);return M.attackPhase==="active"&&(C+=i.attackBoost*L),C},r=[];let c=0,l=!1,h=!1,f=!1;for(const M of n.dummies){const R=o(M,i.threatRange),F=M.position.x-a.x,U=M.position.z-a.z,X=Math.hypot(F,U);R>0&&(r.push({id:M.id,x:M.position.x,z:M.position.z,dx:F,dz:U,yaw:Math.atan2(F,U),w:R}),c+=R,X<=i.approachDist&&(i.modeWeight[M.mode]??.5)>=i.hostileModeWeight&&(f=!0)),X>Bn&&X<=i.recoveryDist&&(l=!0),(M.attackPhase==="windup"||M.attackPhase==="active")&&X<=i.threatRange&&(h=!0)}const d=c<=0?0:Ga(c/(c+Math.max(Bn,i.saturation)),0,1),u=r.length>0,g=s.active,v=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>Bn&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(l||m);if(s.active=v||p,!s.active){s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}if(r.length===0)return;r.sort((M,R)=>R.w-M.w);const x=r.slice(0,Math.max(1,i.maxThreats)),_=r[0],y=Math.atan2(_.dx,_.dz),D=i.behindAngleDeg*Math.PI/180,b=n.character.bodyYaw;let w=0,A=0,E=0;for(const M of x){const R=Math.abs(xl(M.yaw-y))/Math.PI;let F=M.w/(1+Math.max(i.spreadFalloff,0)*R*R);M!==_&&i.behindFalloff<1&&Math.abs(xl(M.yaw-b))>D&&(F*=Math.max(i.behindFalloff,0)),w+=M.x*F,A+=M.z*F,E+=F}s.mainId=_.id,s.mainYaw=y,s.centroidYaw=E>Bn?Math.atan2(w/E-a.x,A/E-a.z):y,s.threatCount=r.length,s.threat=d}function qf(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function jf(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,s=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(s<Bn||s>e.threatRange)return 0;const a=Math.max(Bn,e.threatRange-e.nearDistance),o=Ga((e.threatRange-s)/a,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(Bn,e.modeWeight.attack??1.5);return Ga(r/c,0,1)}function Kf(){return{active:!1,mainId:0,mainYaw:0,centroidYaw:0,threatCount:0,threat:0}}function Jf(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:af(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:vf(1),playerLink:Ja(),abilities:ju(),impulse:{x:0,z:0},targeting:Wf(),turnInPlace:of(),playerHurt:Jh(),hitCount:0,dash:{...Ef(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...td(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Kf(),dummies:Pf(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function Qf(n){zf(n),ld(n),sd(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=hc,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Qh(n),cd(n),ed(n),Ba(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function vl(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){Qf(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Yf(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),xf(n,t,e),n.modules.combat&&bf(n,t,e),n.modules.dash&&Af(n,t,e),n.modules.movement&&Bf(n,t,e),n.modules.gaze&&Zf(n,t,e),n.modules.orientation&&hf(n,t,e),lf(n,t,e),n.modules.dummies&&Nf(n,t,e),Wu(n,t),ff(n,t),n.modules.abilities&&nf(n,t,e),n.modules.dummies&&(qu(n,t),n.modules.separation&&(Hf(n),Vf(n))),n.modules.camera?sf(n):ed(n),n}function tp(n){let t=0;return{frame(e,i,s,a,o){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const h=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};vl(n,r,h),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){vl(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const hd={slopPx:12,longPressMs:450,doubleTapMs:280};function ep(n,t,e=hd.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,o=t.rightZ*i+t.forwardZ*-s,r=Math.hypot(a,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/r,worldZ:o/r}}function ci(n,t,e,i,s,a){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function np(n=hd){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,o,r,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),ci(s,"press",0,0,0,1)},move(s,a,o,r){const c=i(s);if(!c)return null;c.x=a,c.y=o;const l=a-c.startX,h=o-c.startY;return!c.dragging&&Math.hypot(l,h)>=n.slopPx?(c.dragging=!0,ci(c.button,"drag",l,h,r-c.startedAt,1)):null},end(s,a,o,r){const c=i(s);if(!c)return null;t.delete(s),c.x=a,c.y=o;const l=a-c.startX,h=o-c.startY,f=r-c.startedAt,d=Math.hypot(l,h);if(c.dragging||c.longFired||d>=n.slopPx)return ci(c.button,"release",l,h,f,1);const u=e.get(c.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,o-u.y)<=n.slopPx*2?(e.delete(c.button),ci(c.button,"doubleTap",l,h,f,2)):(e.set(c.button,{at:r,x:a,y:o}),ci(c.button,"tap",l,h,f,1))},cancel(s,a){const o=i(s);return o?(t.delete(s),ci(o.button,"cancel",o.x-o.startX,o.y-o.startY,a-o.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,ci(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const xo=.001,ip=18;function vr(n,t,e){return n<t?t:n>e?e:n}function _r(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function sp(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function ap(n,t,e,i,s=ip){const a=sp(t);if(!a)return{state:_r(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),r=s,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,h=c;if(!Number.isFinite(o)||o<xo)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<xo?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<xo)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:vr(Number.isFinite(u)?u:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function op(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?vr(r,s,a):vr(n,s,a)}function rp(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function cp(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const vo=["jump","sprint","reset","attack","skill2"],lp=8,hp=16,_o=10,_l=14,yl=140,dp=18,up=16,fp=400,pp=1.0001;function Ra(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function mp(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Ra(e)}function gp(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,h=0,f=0,d=0,u=-1,g=0,v=null,m=-1,p=0,x=0,_=0,y=0,D=!1,b=0,w=1,A=0,E=null,M=0,R=0,F=!1,U=null,X=null,L=0,C=0,W=0,H=0,K=!1,J=!0,ot=-1;const ft=np({slopPx:_l,longPressMs:450,doubleTapMs:350});let vt=[],j=null;const tt=new Set;function pt(B){B&&vt.push(B)}const Q=new Map;let mt=_r(),It=!1,At=1;function Ot(){const B=Array.from(Q.values()),it=s(),ut=ap(mt,B,it.pinchGain,it.maxStepRatio,dp);if(mt=ut.state,It=ut.pinching,ut.scale!==1&&(At*=ut.scale),ut.started||ut.armedNow)E=null,F=!0,U=null;else if(ut.ended&&o===null&&B.length===1){const Et=B[0];o=Et.id,r=Et.x,c=Et.y,l=0,h=0,f=Et.x,d=Et.y,D=!1,b=0,w=1,A=0,performance.now(),E=null,F=!0,U=null}}const St={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Mt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let G=0,qt=0;const Ut={},Ft=new Set,bt=[];function yt(){for(const B of vo)Ut[B]!==void 0&&(Ut[B]=void 0),Y(B);ft.reset(),tt.clear(),Q.clear(),mt=_r(),It=!1,o=null,l=0,h=0,f=0,d=0,D=!1,b=0,w=1,A=0,p=0,x=0,_=0,y=0,v=null,m=-1,E=null,F=!1,U=null,X=null,ot=-1,W=0,H=0,K=!1,J=!0}const Tt=()=>{document.hidden&&yt()},P=B=>{if(B.clientX===0&&B.clientY===0){g++;return}if(Ra(B.target)||mp(B.clientX,B.clientY)){tt.add(B.pointerId);return}if(tt.delete(B.pointerId),Q.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),o===null&&!It){v=null,m=-1,o=B.pointerId,r=B.clientX,c=B.clientY,l=0,h=0,f=B.clientX,d=B.clientY,performance.now();const it=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY)&&(B.screenX!==0||B.screenY!==0);D=it,b=0,w=1,A=0,p=it?B.screenX:0,x=it?B.screenY:0,_=p,y=x,E=B.pointerId,M=B.clientX,R=B.clientY,F=!1}Ot()},S=B=>{if(B.pointerId===X&&(B.pointerType==="mouse"&&B.buttons===0||B.clientX===0&&B.clientY===0&&(L!==0||C!==0)||(J?(W=B.clientX-L,H=B.clientY-C):(L=B.clientX,C=B.clientY,J=!0,W=0,H=0))),pt(ft.move(B.pointerId,B.clientX,B.clientY,performance.now())),!tt.has(B.pointerId)&&Q.has(B.pointerId)&&(Q.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),Ot()),tt.has(B.pointerId)||B.pointerId!==o)return;const it=performance.now();if(v===B.pointerId&&it-m<150){g++;return}const ut=B.clientX,Et=B.clientY;if(ut===0&&Et===0&&(r!==0||c!==0)){g++;return}const Xt=ut-f,z=Et-d,O=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY),V=O?B.screenX:0,q=O?B.screenY:0,lt=O&&(V!==0||q!==0),ht=V-_,Rt=q-y;if(D&&lt){const ne=Math.hypot(ht,Rt),re=Math.hypot(Xt,z);if(ne>3){if(b=0,A<30&&re>6&&ht*Xt+Rt*z>.7*ne*re){const _e=ne/re;_e>.2&&_e<5&&(w+=(_e-w)*.3,A++)}}else re>12&&(b++,b>=2&&(D=!1))}const Vt=Math.hypot(Xt,z);if(!D){const ne=u<0?Number.POSITIVE_INFINITY:it-u,re=lt?Math.hypot(ht,Rt):1/0;Vt>28&&(ne<200||re<Vt*.4)&&(r+=Xt,c+=z,g++)}f=ut,d=Et,_=V,y=q,B.pointerId===E&&Math.hypot(B.clientX-M,B.clientY-R)>lp&&(F=!0);let Jt,Yt;D&&lt?(Jt=(V-p)/w,Yt=(q-x)/w):(Jt=ut-r,Yt=Et-c);const oe=Math.hypot(Jt,Yt),ve=a();oe>ve&&(Jt*=ve/oe,Yt*=ve/oe);const Ee=Math.hypot(l,h),be=Math.hypot(Jt,Yt);if(Ee>10&&be>10){const ne=Math.abs(Math.atan2(l*Yt-h*Jt,l*Jt+h*Yt)),re=Math.max(Ee,be)*ne,_e=Math.max(Math.hypot(Xt,z),Math.hypot(ht,Rt)/Math.max(.2,w));if(ne>.6&&_e<Math.max(6,re*.5)){g++;return}}l=Jt,h=Yt};function Y(B){if(!St[B])return;St[B]=!1,B==="attack"&&(Mt.attackReleased=!0);const it=document.getElementById(`btn-${B}`);it==null||it.classList.remove("is-down")}function rt(){o!==null&&(v=o,m=performance.now(),o=null,l=0,h=0,f=0,d=0,D=!1,b=0,w=1,A=0,p=0,x=0,_=0,y=0)}const ct=B=>{const it=Q.delete(B.pointerId),ut=tt.delete(B.pointerId);it&&Ot(),B.pointerId===X&&(X=null,K?ot=performance.now():(W=0,H=0,ot=-1)),pt(ft.end(B.pointerId,B.clientX,B.clientY,performance.now()));for(const zt of vo)Ut[zt]===B.pointerId&&(Ut[zt]=void 0,Y(zt));const Et=!it&&!ut&&Q.size<=1&&o!==null;(B.pointerId===o||Q.size===0||Et)&&rt(),!ut&&B.pointerId===E&&(!F&&!Ra(B.target)&&(U={x:B.clientX,y:B.clientY}),E=null)};for(const B of vo){const it=document.getElementById(`btn-${B}`);if(!it)continue;const ut=B==="attack"||B==="skill2",Et=z=>{if(z.preventDefault(),Ut[B]===void 0){Ut[B]=z.pointerId,St[B]=!0,B==="jump"&&(Mt.jump=!0),B==="reset"&&(Mt.reset=!0),B==="sprint"&&(Mt.sprintPressed=!0),B==="attack"&&(Mt.attackPressed=!0),B==="skill2"&&(Mt.skill2=!0),it.classList.add("is-down"),pt(ft.begin(B,z.pointerId,z.clientX,z.clientY,performance.now()));try{it.setPointerCapture(z.pointerId)}catch{}ut&&(X=z.pointerId,L=z.clientX,C=z.clientY,J=!(z.clientX===0&&z.clientY===0),W=0,H=0,K=!1,ot=-1)}},zt=z=>{Ut[B]===z.pointerId&&(Ut[B]=void 0,Y(B),pt(ft.end(z.pointerId,z.clientX,z.clientY,performance.now())))},Xt=z=>{Ut[B]===z.pointerId&&(Ut[B]=void 0,Y(B),pt(ft.cancel(z.pointerId,performance.now())))};it.addEventListener("pointerdown",Et),it.addEventListener("pointerup",zt),it.addEventListener("pointercancel",Xt),bt.push(()=>{it.removeEventListener("pointerdown",Et),it.removeEventListener("pointerup",zt),it.removeEventListener("pointercancel",Xt)})}const at=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const B of at){const it=ut=>{ut.preventDefault(),G=Number(B.dataset.weapon)||0};B.addEventListener("pointerdown",it),bt.push(()=>B.removeEventListener("pointerdown",it))}const Nt=B=>{const it=B.key.toLowerCase();if((it===" "||it.startsWith("arrow"))&&B.preventDefault(),Ft.has(it))return;Ft.add(it),it===" "&&(Mt.jump=!0),it==="r"&&(Mt.reset=!0),it==="shift"&&(Mt.sprintPressed=!0),it==="j"&&(Mt.attackPressed=!0),it==="k"&&(Mt.skill2=!0),it>="1"&&it<="5"&&(G=Number(it)),it>="6"&&it<="9"&&(qt=Number(it)-5);const ut=Math.max(pp,s().keyStep||1.12);(it==="="||it==="+")&&(At*=ut),(it==="-"||it==="_")&&(At/=ut)},et=B=>{const it=B.key.toLowerCase();Ft.has(it)&&(Ft.delete(it),it==="j"&&(Mt.attackReleased=!0))},gt=B=>{if(Ra(B.target))return;B.preventDefault();const it=B.deltaMode===1?B.deltaY*up:B.deltaMode===2?B.deltaY*fp:B.deltaY;At*=rp(it,s().wheelStep)},Gt=B=>{B.preventDefault()},nt=()=>{u=performance.now()};window.addEventListener("resize",nt),window.addEventListener("orientationchange",nt);const _t=typeof window<"u"?window.visualViewport:null;return _t&&(_t.addEventListener("resize",nt),_t.addEventListener("scroll",nt)),window.addEventListener("pointerdown",P),window.addEventListener("pointermove",S),window.addEventListener("pointerup",ct),window.addEventListener("pointercancel",ct),window.addEventListener("blur",yt),document.addEventListener("visibilitychange",Tt),window.addEventListener("keydown",Nt),window.addEventListener("keyup",et),window.addEventListener("wheel",gt,{passive:!1}),window.addEventListener("gesturestart",Gt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:f,y:d,dx:f-r,dy:d-c,radius:a(),badMoves:g,screenOk:D,originSX:p,originSY:x,screenX:_,screenY:y,scale:w}},peekAim(){const B=performance.now(),it=Math.hypot(W,H),ut=X!==null||ot>=0&&B-ot<yl;if(!(ut&&K&&it>=_o))return{active:!1,holding:ut,x:0,z:0,dx:W,dy:H};const zt=i(),Xt=W/it,z=H/it,O=zt.rightX*Xt+zt.forwardX*-z,V=zt.rightZ*Xt+zt.forwardZ*-z,q=Math.hypot(O,V)||1;return{active:!0,holding:ut,x:O/q,z:V/q,dx:W,dy:H}},sample(){var Re;const B=a();let it=o!==null?Math.max(-1,Math.min(1,l/B)):0,ut=o!==null?Math.max(-1,Math.min(1,h/B)):0,Et=0,zt=0;(Ft.has("a")||Ft.has("arrowleft"))&&(Et-=1),(Ft.has("d")||Ft.has("arrowright"))&&(Et+=1),(Ft.has("w")||Ft.has("arrowup"))&&(zt-=1),(Ft.has("s")||Ft.has("arrowdown"))&&(zt+=1),it+=Et,ut+=zt;let Xt=Math.hypot(it,ut);Xt>1&&(it/=Xt,ut/=Xt,Xt=1);const z=it,O=ut;Xt<e&&(it=0,ut=0);const V=i();let q=V.rightX*it+V.forwardX*-ut,lt=V.rightZ*it+V.forwardZ*-ut;const ht=Math.hypot(q,lt);ht>1&&(q/=ht,lt/=ht);const Rt=performance.now();pt(ft.poll(Rt));const Vt=Math.hypot(W,H);X!==null&&(Vt>=hp?K=!0:Vt<_o&&(K=!1));const Jt=X!==null||ot>=0&&Rt-ot<yl,Yt=Jt&&K&&Vt>=_o;let oe=0,ve=0;if(Yt){const Fe=W/Vt,Dt=H/Vt,$t=V.rightX*Fe+V.forwardX*-Dt,ue=V.rightZ*Fe+V.forwardZ*-Dt,Oe=Math.hypot($t,ue)||1;oe=$t/Oe,ve=ue/Oe}!Jt&&X===null&&(W=0,H=0,ot=-1,K=!1);const Ee=U;U=null;const be=At;At=1;const ne={moveX:q,moveZ:lt,jumpPressed:Mt.jump,sprintHeld:St.sprint||Ft.has("shift"),sprintPressed:Mt.sprintPressed,resetPressed:Mt.reset,attackPressed:Mt.attackPressed,attackHeld:St.attack||Ft.has("j"),attackReleased:Mt.attackReleased,skill2Pressed:Mt.skill2,weaponSlot:G,dummyClickId:qt,aimX:oe,aimZ:ve,aimActive:Yt};Mt.jump=!1,Mt.reset=!1,Mt.sprintPressed=!1,Mt.attackPressed=!1,Mt.attackReleased=!1,Mt.skill2=!1,G=0,qt=0;const re=vt.map(Fe=>ep(Fe,V,_l));vt=[],re.length>0&&(j=re[re.length-1]);const _e=o!==null?"pointer":Ft.size>0?"keyboard":"idle";return{intents:ne,stickX:it,stickY:ut,stickRawX:z,stickRawY:O,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:f,stickPxY:d,stickBad:g,stickScreenOk:D,stickOriginSX:p,stickOriginSY:x,stickScreenX:_,stickScreenY:y,stickScale:w,stickVpTop:((Re=cp())==null?void 0:Re.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:W,aimDY:H,source:_e,tap:Ee,zoomScale:be,gestures:re,lastGesture:j}},dispose(){window.removeEventListener("pointerdown",P),window.removeEventListener("pointermove",S),window.removeEventListener("pointerup",ct),window.removeEventListener("pointercancel",ct),window.removeEventListener("blur",yt),document.removeEventListener("visibilitychange",Tt),window.removeEventListener("keydown",Nt),window.removeEventListener("keyup",et),window.removeEventListener("wheel",gt),window.removeEventListener("resize",nt),window.removeEventListener("orientationchange",nt),_t&&(_t.removeEventListener("resize",nt),_t.removeEventListener("scroll",nt)),window.removeEventListener("gesturestart",Gt),ft.reset();for(const B of bt)B()}}}const Va=1,Xa=2,Wa=4,dd=8,$a=16,Ts=32,ud=64,fd=128,xp=[[Va,"atk"],[Xa,"dash"],[Wa,"link"],[dd,"air"],[$a,"hurt"],[Ts,"aim"],[ud,"spr"],[fd,"chan"]];function Ui(n){if(n===0)return"-";const t=xp.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const vp=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],_p=0,yp=15,yo=19,Mp=21,Sp=22,bp=23,Ep=24,wn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},je=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,xn=n=>Math.round(n*180/Math.PI*10)/10,Mo=Math.PI*2;function vs(n){let t=n%Mo;return t>Math.PI&&(t-=Mo),t<-Math.PI&&(t+=Mo),t}function wp(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Va),n.dash.phase!=="idle"&&(e|=Xa),n.playerLink.phase!=="idle"&&(e|=Wa),n.character.grounded||(e|=dd),n.playerHurt.type!=="none"&&(e|=$a),t.intents.aimActive&&(e|=Ts),n.character.sprinting&&(e|=ud),n.abilities.channeling&&(e|=fd),e}function Ap(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Tp(n){const t={sampleHz:n.sampleHz??wn.sampleHz,sampleCapacity:n.sampleCapacity??wn.sampleCapacity,eventCapacity:n.eventCapacity??wn.eventCapacity,anomalyCapacity:n.anomalyCapacity??wn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??wn.dirJumpDeg,aimDropDeg:n.aimDropDeg??wn.aimDropDeg,freezeMs:n.freezeMs??wn.freezeMs,freezeSpeed:n.freezeSpeed??wn.freezeSpeed,stickLostMs:n.stickLostMs??wn.stickLostMs,spikeMs:n.spikeMs??wn.spikeMs},e=n.meta,i=[],s=[],a=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,h=null,f=0,d=0,u="",g=-1,v=-1,m=-1,p=0,x=-1e9,_=-1,y={},D=null,b=0,w=0,A=0,E=0;function M(L,C){const W=1/t.sampleHz,H=L[_p];H-l<W-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),l=H)}function R(L,C,W,H,K,J){const ot=y[L]??-1e9;if(C-ot<1.2)return;if(y[L]=C,L==="frameSpike"){let vt=0;for(const j of a)j.kind==="frameSpike"&&vt++;if(vt>=6)return}a.length>=t.anomalyCapacity&&a.shift();let ft=i.slice(-7);J&&(ft.length===0||ft[ft.length-1]!==J)&&(ft=[...ft.slice(-6),J]),a.push({kind:L,t:je(C),tick:W,ms:Math.round(H),detail:K,ctx:ft}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function F(L,C,W,H){s.length>=t.eventCapacity&&s.shift(),s.push({t:je(W),tick:H,k:L,d:C})}function U(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":x=L.tick;break}}function X(){const L=o,C=L.wallMs/1e3,W=L.gestures,H=ft=>Object.entries(W).filter(([vt])=>vt.endsWith(`.${ft}`)).reduce((vt,[,j])=>vt+j,0),K=[];if(K.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),K.push(`运行 ${C.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),K.push(`摇杆活跃 ${C>0?Math.round(L.stickActiveMs/1e3/C*100):0}% · 手势 按下 ${H("press")}（单击 ${H("tap")} / 双击 ${H("doubleTap")} / 拖拽 ${H("drag")} / 长按 ${H("longPress")} / 打断 ${H("cancel")} / 拖放 ${H("release")}）`),K.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),K.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${u||"-"}`),K.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const ft of a.slice(-6)){K.push(`· ${ft.kind} @t${ft.t.toFixed(2)} tick${ft.tick} ${ft.ms>0?`${ft.ms}ms `:""}${ft.detail}`);const vt=ft.ctx.map(tt=>String(tt[yp])).join(" "),j=ft.ctx.map(tt=>tt[yo]===""||tt[yo]==null?".":String(tt[yo])).join(" ");if(K.push(`  yaw ${vt}`),K.push(`  in  ${j}`),ft.kind==="stickJump"||ft.kind==="stickBad"||ft.kind==="stickLost"){const tt=ft.ctx.map(Q=>`${Q[Mp]},${Q[Sp]}`).join(" "),pt=ft.ctx.map(Q=>`${Q[bp]},${Q[Ep]}`).join(" ");K.push(`  o   ${tt}`),K.push(`  p   ${pt}`)}}if(s.length>0){K.push("最近事件：");for(const ft of s.slice(-12))K.push(`  ${ft.t.toFixed(2)} ${ft.k} ${ft.d}`.trimEnd())}const J=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ot=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return K.push(`摇杆坐标源 ${J}${ot}`),K.push(`UA ${e.ua}`),K.join(`
`)}return{sample(L,C,W,H=0){o.frames++,C.stickHeld&&(C.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=H,o.wallMs+=W,W>o.dtMax&&(o.dtMax=W),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const K=L.time;if(c<0&&(c=K),A=K,E=L.tick,!r)return;const J=L.character,ot=Math.hypot(C.stickX,C.stickY),ft=Math.hypot(J.velocity.x,J.velocity.z);u=L.combat.weapon;const vt=wp(L,C),j=J.facing,pt=Math.hypot(C.intents.moveX,C.intents.moveZ)>.05?Math.atan2(C.intents.moveX,C.intents.moveZ):null;ot>.2&&(o.stickActiveMs+=W);const Q=[je(K),L.tick,Math.round(W*10)/10,je(C.stickX),je(C.stickY),je(C.stickRawX),je(C.stickRawY),C.stickHeld?1:0,C.source.slice(0,8),je(C.intents.moveX),je(C.intents.moveZ),je(J.position.x),je(J.position.z),je(J.velocity.x),je(J.velocity.z),xn(j),xn(J.bodyYaw),vt,je(J.stride),pt===null?"":xn(pt),C.stickId===null?"":C.stickId,Math.round(C.stickOriginX),Math.round(C.stickOriginY),Math.round(C.stickPxX),Math.round(C.stickPxY),C.stickBad,Math.round(C.stickVpTop),Math.round(C.stickOriginSX),Math.round(C.stickOriginSY),Math.round(C.stickScreenX),Math.round(C.stickScreenY),C.stickScreenOk?1:0,Math.round(C.stickScale*100)/100];M(Q);const mt=K*1e3<_;if(W>t.spikeMs&&!mt&&K-c>.6&&(o.spikes++,R("frameSpike",K,L.tick,W,`dt ${W.toFixed(0)}ms fl=${Ui(vt)}`,Q)),h!==null&&!mt){const yt=Math.abs(xn(vs(j-h))),Tt=Math.abs(xn(vs(J.moveYaw-f))),P=(d|vt)&(Va|Xa|Wa|$a)|vt&Ts,S=pt===null?null:Math.abs(xn(vs(j-pt))),Y=pt===null||h===null?null:Math.abs(xn(vs(h-pt))),rt=S!==null&&Y!==null&&S<Y-.5,ct=(d&Ts)!==0&&(vt&Ts)===0&&pt===null,at=S!==null&&(S<=12||rt);yt>t.aimDropDeg&&ct?R("aimDrop",K,L.tick,0,`${yt.toFixed(0)}° @aim→none stick(${C.stickX.toFixed(2)},${C.stickY.toFixed(2)}) aim(${C.aimDX.toFixed(0)},${C.aimDY.toFixed(0)}) fl=${Ui(vt)}`,Q):yt>t.dirJumpDeg&&P===0&&!ct&&(at?(o.inTurns++,yt>o.inTurnMax&&(o.inTurnMax=yt)):R("dirJump",K,L.tick,0,`${yt.toFixed(0)}° res${S===null?" 无输入":`${S.toFixed(0)}°`} yaw ${xn(h)}→${xn(j)} in ${pt===null?".":xn(pt)}° mvΔ${Tt.toFixed(0)}° aim(${C.aimDX.toFixed(0)},${C.aimDY.toFixed(0)}) fl=${Ui(d)}→${Ui(vt)}`,Q))}const It=(vt&(Va|Xa|Wa|$a))!==0,At=L.tick-x<30;ot>.35&&ft<t.freezeSpeed&&!It&&!At?(g<0&&(g=K),K-g>=t.freezeMs/1e3&&K>=v&&(R("moveFreeze",K,L.tick,(K-g)*1e3,`stick(${C.stickX.toFixed(2)},${C.stickY.toFixed(2)}) v${ft.toFixed(2)} ${C.source} fl=${Ui(vt)}`,Q),v=K+1.5,g=-1)):g=-1,C.stickHeld?(ot>p&&(p=ot),p>.35&&ot<.06?(m<0&&(m=K),K-m>=t.stickLostMs/1e3&&(R("stickLost",K,L.tick,(K-m)*1e3,`raw(${C.stickRawX.toFixed(2)},${C.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ui(vt)}`,Q),m=-1,p=0)):m=-1):(p=0,m=-1);const Ot=C.stickScale>.2&&C.stickScale<5?C.stickScale:1,St=C.stickScreenOk,Mt=St?C.stickScreenX/Ot:C.stickPxX,G=St?C.stickScreenY/Ot:C.stickPxY,qt=St?C.stickOriginSX/Ot:C.stickOriginX,Ut=St?C.stickOriginSY/Ot:C.stickOriginY,Ft=Mt-qt,bt=G-Ut;if(C.stickHeld&&C.stickId!==null){const yt=D;if(yt&&yt.held&&yt.id===C.stickId){const Tt=Math.hypot(yt.dx,yt.dy),P=Math.hypot(Ft,bt),S=Math.max(Tt,P),Y=Math.hypot(Mt-yt.cx,G-yt.cy),rt=Math.abs(xn(vs(Math.atan2(bt,Ft)-Math.atan2(yt.dy,yt.dx)))),ct=S*rt*Math.PI/180,at=Math.hypot(qt-yt.ox,Ut-yt.oy);if(S>18&&rt>35&&Y<Math.max(5,ct*.35)&&R("stickJump",K,L.tick,0,`Δ${rt.toFixed(0)}° 手指只动${Y.toFixed(0)}px(弧长应${ct.toFixed(0)}px) o(${Math.round(yt.ox)},${Math.round(yt.oy)})→(${Math.round(qt)},${Math.round(Ut)}) 原点位移${at.toFixed(0)}px p(${Math.round(Mt)},${Math.round(G)}) raw(${Math.round(Ft)},${Math.round(bt)}) id${C.stickId} ${St?"src=屏幕":"src=client"}`,Q),St&&yt.screenOk){const Nt=Math.hypot(C.stickPxX-yt.x,C.stickPxY-yt.y),et=Math.hypot((C.stickScreenX-yt.sx)/Ot,(C.stickScreenY-yt.sy)/Ot);b+=Nt-et,Math.abs(b)>20&&(R("stickDrift",K,L.tick,0,`client 相对屏幕漂移 ${b>0?"+":""}${b.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(C.stickPxX)},${Math.round(C.stickPxY)}) screen(${Math.round(C.stickScreenX)},${Math.round(C.stickScreenY)})`,Q),b=0)}}D={id:C.stickId,ox:qt,oy:Ut,cx:Mt,cy:G,x:C.stickPxX,y:C.stickPxY,sx:C.stickScreenX,sy:C.stickScreenY,dx:Ft,dy:bt,held:!0,screenOk:St}}else D=null,b=0;if(C.stickBad>w){const yt=C.stickBad-w;R("stickBad",K,L.tick,0,`拦截 ${yt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${C.stickBad}）o(${Math.round(C.stickOriginX)},${Math.round(C.stickOriginY)}) p(${Math.round(C.stickPxX)},${Math.round(C.stickPxY)}) id${C.stickId??"-"}`,Q)}w=C.stickBad,h=j,f=J.moveYaw,d=vt},event(L,C){const W=Ap(L);U(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||F(L.type,W,C,L.tick))},gesture(L){const C=`${L.button}.${L.kind}`;o.gestures[C]=(o.gestures[C]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&F(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,A,E)},suspend(L){_=A*1e3+L,g=-1,m=-1},setEnabled(L){r=L,L||(h=null,D=null,g=-1,m=-1)},clear(){i.length=0,s.length=0,a.length=0,y={},l=-1e9,h=null,d=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,b=0,D=null,w=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,C=a.some(W=>L-W.t<8&&(W.kind==="dirJump"||W.kind==="aimDrop"||W.kind==="moveFreeze"||W.kind==="stickLost"||W.kind==="stickJump"||W.kind==="stickBad"||W.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:s.length,anomalies:a.length,alert:C,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:vp,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:X}}const Rp={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:7,headTurnRate:30,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Cp={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},Pp={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},Lp={core:Rp,scene:Cp,view:Pp};function yc(n){return JSON.parse(JSON.stringify(n))}const Mc=Lp,Dp=yc(Mc.core),qs=yc(Mc.scene),nn=yc(Mc.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Cn{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),Cn.nextNameID=Cn.nextNameID||0,this.$name.id=`lil-gui-name-${++Cn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Ip extends Cn{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function yr(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const kp={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:yr,toHexString:yr},Us={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Up={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Us.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Us.toHexString(s)}},Fp={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Us.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Us.toHexString(s)}},Np=[kp,Us,Up,Fp];function zp(n){return Np.find(t=>t.match(n))}class Op extends Cn{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=zp(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=yr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class So extends Cn{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Bp extends Cn{constructor(t,e,i,s,a,o){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const _=parseFloat(this.$input.value);isNaN(_)||(this._snapClampSetValue(_+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let o=!1,r,c,l,h,f;const d=5,u=x=>{r=x.clientX,c=l=x.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",v)},g=x=>{if(o){const _=x.clientX-r,y=x.clientY-c;Math.abs(y)>d?(x.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(_)>d&&v()}if(!o){const _=x.clientY-l;f-=_*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}l=x.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",v)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,_,y,D)=>(p-x)/(_-x)*(D-y)+y,e=p=>{const x=this.$slider.getBoundingClientRect();let _=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(_)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const x=p.touches[0].clientX-r,_=p.touches[0].clientY-c;Math.abs(x)>Math.abs(_)?l(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),g=400;let v;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const _=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+_),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Hp extends Cn{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Gp extends Cn{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Vp=`.lil-gui {
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
}`;function Xp(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Ml=!1;class Ya{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Ml&&r&&(Xp(Vp),Ml=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,i,s,a){if(Object(i)===i)return new Hp(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Bp(this,t,e,i,s,a);case"boolean":return new Ip(this,t,e);case"string":return new Gp(this,t,e);case"function":return new So(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new Op(this,t,e,i)}addFolder(t){const e=new Ya({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof So||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof So)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Wp(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new Ya({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new Ya({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=P=>{const S=a.addFolder(P);return c.push(S),S},h=(P,S)=>{const Y=P.addFolder(S);return r.push(Y),Y},f=l("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=l("移动 / 输入"),g=h(u,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=h(u,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=h(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=o.separation,_=h(u,"角色间分离 / 挤压阻力");_.add(x,"iterations",1,8,1).name("迭代次数"),_.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),_.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),_.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),_.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=o.dummies,D=h(u,"假人 AI");D.add(y,"moveSpeed",.5,8,.1).name("移动速度"),D.add(y,"wanderRadius",.5,8,.1).name("游走半径"),D.add(y,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),D.add(y,"followStopDistance",.3,5,.1).name("跟随停距"),D.add(y,"keepDistance",1,10,.1).name("保持距离"),D.add(y,"keepDeadZone",.1,2,.05).name("保持死区"),D.add(y,"attackRange",.5,5,.1).name("攻击距离"),D.add(y,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),D.add(y,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const b=l("步态 / 停步"),w=h(b,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const A=h(b,"停步收相 / 胸朝向");A.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),A.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),A.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),A.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),A.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=h(b,"停步惯性");E.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),E.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),E.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),E.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),E.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),E.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),E.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(b,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const R=h(b,"足部 IK"),F=t.ik;R.add(F,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),R.add(F,"weight",0,1,.01).name("钉地权重"),R.add(F,"attackScale",0,1,.01).name("攻击时权重倍率"),R.add(F,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const U=h(b,"惯性倾斜 / 盆骨"),X=t.lean;U.add(X,"accelGain",0,.1,.002).name("前后加速度增益"),U.add(X,"turnGain",0,.2,.005).name("绕圈侧倾增益"),U.add(X,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),U.add(X,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),U.add(X,"smoothing",1,30,1).name("倾斜平滑速率"),U.add(X,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),U.add(X,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),U.add(X,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),U.add(X,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=o.orientation,C=h(b,"朝向 / 下盘带转");C.add(L,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),C.add(L,"headTurnRate",.5,40,.5).name("头部转向速率"),C.add(L,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),C.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),C.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),C.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const W=h(b,"原地转身 / 停步偏差 (v9s)"),H=o.turnInPlace;W.add(H,"enabled").name("启用原地转身 (关=纯插值)"),W.add(H,"triggerDeg",20,180,5).name("触发夹角 (°)"),W.add(H,"settleDeg",0,60,1).name("转身保留余角 (°)"),W.add(H,"durationSec",.1,1.5,.02).name("转身时长 (s)"),W.add(H,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),W.add(H,"inputDeadZone",0,.5,.01).name("起步输入死区"),W.add(H,"armSec",0,.5,.01).name("触发防抖 (s)"),W.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),W.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),W.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),W.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),W.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),W.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const K=l("战斗 / 受击"),J=o.combat,ot=h(K,"连击 / 武器"),ft=ot.add(n.combat,"weapon",Ai).name("当前武器");ot.add(J,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ot.add(J,"settle",0,.8,.01).name("段间停顿 (s)"),ot.add(J,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ot.add(J,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ot.add(J,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ot.add(J,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ot.add(J,"autoCombo").name("按住自动连击"),ot.add(J.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),ot.add(J.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ot.add(J.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ot.add(J.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ot.add(J.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ot.add(J.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const vt=o.abilities;ot.add(vt.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),ot.add(vt.arcane,"speed",3,24,.5).name("飞弹速度"),ot.add(vt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ot.add(vt.ring,"radius",.5,5,.1).name("电环半径"),ot.add(vt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ot.add(vt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const j=h(K,"攻击动作 / 跨步 / 落地");j.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),j.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),j.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const tt=t.animation.stride;j.add(tt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),j.add(tt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),j.add(tt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),j.add(tt,"cycles",1,3,1).name("每段跨步周期数"),j.add(tt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),j.add(tt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),j.add(tt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),j.add(tt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),j.add(tt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),j.add(tt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),j.add(tt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),j.add(tt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),j.add(tt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),j.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),j.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),j.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),j.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),j.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),j.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),j.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),j.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),j.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),j.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),j.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),j.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const pt=h(K,"武器握持");pt.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),pt.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),pt.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),pt.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const Q=o.hits,mt=h(K,"命中 / 受击 / 击退");mt.add(Q,"arcDeg",10,120,5).name("命中扇区半角 (°)"),mt.add(Q,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),mt.add(Q,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),mt.add(Q,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),mt.add(Q.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),mt.add(Q.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),mt.add(Q,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),mt.add(Q,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const It=o.targeting,At=h(K,"目标辅助");At.add(It,"targetAssist").name("启用目标辅助"),At.add(It,"range",1,14,.5).name("锁定范围 (m)"),At.add(It,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),At.add(It,"frontBias",0,4,.1).name("朝向加权"),At.add(It,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),At.add(It,"maxLungeScale",1,3,.1).name("前冲最大放大");const Ot=h(K,"受击分层"),St=t.hurt;Ot.add(St,"enabled").name("启用分层受击 (关=旧版对照)"),Ot.add(St,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Ot.add(St,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Ot.add(St,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Ot.add(St,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Ot.add(St,"upperShiftScale",0,1,.01).name("上身位移缩放"),Ot.add(St,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Ot.add(St.hitHeight,"light",0,1,.01).name("轻击命中部位"),Ot.add(St.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Ot.add(St.hitHeight,"knock",0,1,.01).name("击退命中部位"),Ot.add(St,"leanLight",0,1.5,.01).name("轻击力度"),Ot.add(St,"leanHeavy",0,1.5,.01).name("重击力度"),Ot.add(St,"leanKnock",0,1.5,.01).name("击退力度"),Ot.add(St,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:St.abdomen},{name:"打肩 (shoulder)",p:St.shoulder}].map(({name:P,p:S})=>{const Y=h(Ot,P);return Y.add(S,"upperPitch",0,2,.01).name("上身前后倾斜"),Y.add(S,"upperRoll",0,2,.01).name("上身侧倾"),Y.add(S,"upperYaw",0,1.5,.01).name("肩部扭转"),Y.add(S,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),Y.add(S,"shift",0,.8,.01).name("身体反应位移"),Y.add(S,"drop",0,.4,.01).name("整体下沉"),Y.add(S,"back",0,.4,.01).name("屁股向后"),Y.add(S,"knee",0,1.6,.01).name("屈膝"),Y.add(S,"hip",0,1,.01).name("髋前倾"),Y.add(S,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),Y});const Mt=h(K,"派生招"),G=o.links;Mt.add(G,"enabled").name("总开关 (false=旧连击)"),Mt.add(G.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Mt.add(G.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Mt.add(G.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Mt.add(G,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Mt.add(G,"triggerWhileSprinting").name("长跑中可直接触发"),Mt.add(G.search,"range",1,14,.1).name("索敌距离 (m)"),Mt.add(G.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Mt.add(G.search,"stopDistance",0,3,.05).name("停住距离 (m)");const qt=G.moves["sword-shield"];qt&&(Mt.add(qt,"enabled").name("剑盾盾击"),Mt.add(qt,"distance",0,8,.1).name("冲锋极限 (m)"),Mt.add(qt,"windup",0,.5,.01).name("前摇 (s)"),Mt.add(qt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Mt.add(qt,"recovery",0,.8,.01).name("收势 (s)"),Mt.add(qt.hit,"radius",0,4,.05).name("命中半径 (m)"),Mt.add(qt.hit,"width",0,2,.05).name("扫掠半径 (m)"),Mt.add(qt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Mt.add(qt.hit,"duration",0,1.5,.01).name("僵直 (s)")),Mt.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Ut=l("相机"),Ft=h(Ut,"基础");Ft.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Ft.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Ft.add(t.camera,"distance",6,35,.5).name("距离"),Ft.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Ft.add(t.camera,"fov",25,90,1).name("FOV");const bt=o.camera,yt=h(Ut,"智能构图");yt.add(bt,"radius",2,18,.5).name("威胁评估半径 (m)"),yt.add(bt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),yt.add(bt,"saturation",.5,8,.1).name("威胁归一化饱和"),yt.add(bt,"pushIn",0,.5,.01).name("无威胁推进比例"),yt.add(bt,"maxPullback",0,1,.02).name("最大拉远比例"),yt.add(bt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),yt.add(bt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),yt.add(bt,"framingBias",0,1,.05).name("威胁质心平移系数"),yt.add(bt,"attackBoost",0,2,.05).name("挥砍中额外加权"),yt.add(bt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),yt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Tt=h(Ut,"缩放");return Tt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Tt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),Tt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Tt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Tt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Tt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Tt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Tt.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(P=>P.close()),c.forEach(P=>P.close()),a.close(),{gui:a,refreshWeapon:()=>ft.updateDisplay()}}function $p(n,t,e){let i=null,s=Number.POSITIVE_INFINITY;for(const a of n){const o=Math.hypot(t-a.x,e-a.z);o<=a.radius&&o<s&&(i=a,s=o)}return i}function Yp(n,t){return n.find(e=>e.id===t)??null}function Sl(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,c)=>r.index-c.index),s=i.findIndex(r=>r.id===t),a=e<0?-1:1,o=s<0?a>0?0:i.length-1:(s+a+i.length)%i.length;return i[o]??null}function Zp({stations:n,world:t,view:e,container:i,onResetZoom:s}){const a=i??document.getElementById("lab-panel");let o=null,r=null;const c=new Map,l=document.createElement("div");l.id="lab-toast",l.setAttribute("aria-live","polite"),document.body.appendChild(l);let h=0;function f(m){l.textContent=`${m.index} · ${m.name} — ${m.hint}`,l.style.borderColor=m.color,l.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>l.classList.remove("is-on"),5e3)}function d(){return $p(n,t.character.position.x,t.character.position.z)}function u(){const m=d(),p=(m==null?void 0:m.id)??null;if(p===o)return;const x=o!==null;o=p;for(const[_,y]of c)y.classList.toggle("is-active",_===p);r&&(r.textContent=m?`${m.index} · ${m.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=m?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),m?f(m):x&&l.classList.remove("is-on")}function g(m){const p=typeof m=="number"?n.find(x=>x.index===m)??null:Yp(n,m);return p?(Of(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function v(){ld(t)}if(a){a.textContent="";const m=document.createElement("div");m.className="lab-head",m.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",m.appendChild(p),a.appendChild(m);for(const y of[...n].sort((D,b)=>D.index-b.index)){const D=document.createElement("button");D.type="button",D.className="lab-row",D.dataset.station=y.id,D.dataset.uiButton="",D.style.setProperty("--lab-color",y.color),D.setAttribute("aria-label",`传送到工位 ${y.index}：${y.name}`);const b=document.createElement("span");b.className="lab-idx",b.textContent=String(y.index);const w=document.createElement("span");w.className="lab-name",w.textContent=y.name,D.append(b,w),D.addEventListener("pointerdown",A=>{A.preventDefault(),A.stopPropagation(),g(y.id)}),a.appendChild(D),c.set(y.id,D)}r=document.createElement("div"),r.className="lab-hint",a.appendChild(r);const x=document.createElement("div");x.className="lab-foot";const _=document.createElement("button");if(_.type="button",_.className="lab-btn",_.dataset.uiButton="",_.textContent="召回假人",_.setAttribute("aria-label","召回全部假人回到各自工位"),_.addEventListener("pointerdown",y=>{y.preventDefault(),y.stopPropagation(),v()}),x.appendChild(_),s){const y=document.createElement("button");y.type="button",y.className="lab-btn",y.dataset.uiButton="",y.textContent="镜头归位",y.setAttribute("aria-label","把镜头缩放恢复到默认"),y.addEventListener("pointerdown",D=>{D.preventDefault(),D.stopPropagation(),s()}),x.appendChild(y)}a.appendChild(x)}return window.addEventListener("keydown",m=>{var p,x;if(!(m.metaKey||m.ctrlKey||m.altKey))if(m.key==="["){const _=Sl(n,((p=d())==null?void 0:p.id)??o,-1);_&&g(_.id)}else if(m.key==="]"){const _=Sl(n,((x=d())==null?void 0:x.id)??o,1);_&&g(_.id)}else m.key==="\\"&&v()}),u(),{goto:g,current:d,tick:u,recall:v,element:a}}const bo=Math.PI*2,An={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},qp=45,jp=50;function Kp(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function _s(n,t,e){const i=Kp(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function Jp(n,t){return Math.atan2(n,-t)*180/Math.PI}function bl(n,t){return Math.abs(((n-t)%360+540)%360-180)}function js(n){return(n%360+360)%360}const Qp={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function tm(n,t,e,i=8){const s=n.character,a=t.intents,o=Math.hypot(a.moveX,a.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),h=o>.001?_s(a.moveX,a.moveZ,e):null,f=l>.15?_s(c.x,c.z,e):null,d=_s(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?_s(a.aimX,a.aimZ,e):null,g=n.targeting,v=g.hasTarget?_s(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&f!==null?bl(h,f):null,p=h!==null?bl(h,d):null,x=m!==null&&m>qp&&o>=.35&&l>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?Jp(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:d,lockDeg:v,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:x}}function El(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>jp&&(n.inLen>=.35||n.speed>=.4)}const wl="harness.dirDebug";function em(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=s.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(wl)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),a&&(a.textContent=c?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(c)))}l();function h(_){if(c=_,!t)try{window.localStorage.setItem(wl,_?"1":"0")}catch{}l()}a==null||a.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),h(!c)}),t||window.addEventListener("keydown",_=>{_.key.toLowerCase()==="v"&&!_.metaKey&&!_.ctrlKey&&h(!c)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;s.width=Math.round(d*f),s.height=Math.round(d*f);let u=Qp,g=0,v="",m=8;function p(_){if(!r)return;const y=d,D=d,b=y/2,w=D/2,A=Math.min(y,D)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,y,D),r.beginPath(),r.arc(b,w,A,0,bo),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=_.warnMove?"rgba(251, 191, 36, 0.85)":An.ring,r.stroke(),r.strokeStyle=An.grid,r.beginPath(),r.moveTo(b-A,w),r.lineTo(b+A,w),r.moveTo(b,w-A),r.lineTo(b,w+A),r.stroke();for(let F=0;F<8;F++){const U=F*Math.PI/4,X=b+Math.sin(U)*(A-3),L=w-Math.cos(U)*(A-3),C=b+Math.sin(U)*A,W=w-Math.cos(U)*A;r.beginPath(),r.moveTo(X,L),r.lineTo(C,W),r.stroke()}const E=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;E>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=An.dead,r.beginPath(),r.arc(b,w,A*E,0,bo),r.stroke(),r.restore());const M=(F,U,X,L,C=!1,W=1)=>{const H=F*Math.PI/180,K=Math.sin(H),J=-Math.cos(H),ot=A*Math.max(.14,Math.min(1,U)),ft=b+K*A*.14,vt=w+J*A*.14,j=b+K*ot,tt=w+J*ot;if(r.save(),r.globalAlpha=W,r.strokeStyle=X,r.fillStyle=X,r.lineWidth=L,r.lineCap="round",C&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ft,vt),r.lineTo(j,tt),r.stroke(),!C&&ot>A*.3){const pt=-J,Q=K,mt=5.2;r.beginPath(),r.moveTo(j+K*1.5,tt+J*1.5),r.lineTo(j-K*mt+pt*mt*.72,tt-J*mt+Q*mt*.72),r.lineTo(j-K*mt-pt*mt*.72,tt-J*mt-Q*mt*.72),r.closePath(),r.fill()}r.restore()},R=(F,U)=>{const X=F*Math.PI/180,L=Math.sin(X),C=-Math.cos(X),W=-C,H=L,K=A+1.5,J=K+6.5;r.save(),r.fillStyle=U,r.strokeStyle=U,r.lineWidth=1,r.beginPath(),r.moveTo(b+L*J,w+C*J),r.lineTo(b+L*K+W*4,w+C*K+H*4),r.lineTo(b+L*K-W*4,w+C*K-H*4),r.closePath(),r.fill(),r.restore()};_.lockDeg!==null&&M(_.lockDeg,1,An.lock,1,!0,.7),_.rawDeg!==null&&_.stickHeld&&M(_.rawDeg,_.rawLen,An.raw,1,!0,.9),_.aimDeg!==null&&M(_.aimDeg,1,An.aim,1.6,!0,.95),M(_.faceDeg,1,An.face,1.1,!0,.55),_.moveDeg!==null&&M(_.moveDeg,_.speed/Math.max(1,m),An.move,5.5,!1,.8),_.inDeg!==null&&M(_.inDeg,_.inLen,An.input,2.2),R(_.faceDeg,An.face),r.beginPath(),r.arc(b,w,2.2,0,bo),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function x(_,y){const D=A=>A===null?"-":String(Math.round(js(A)));o.in.textContent=`入 ${D(_.inDeg)}`,o.mv.textContent=`移 ${D(_.moveDeg)}`,o.fc.textContent=`面 ${D(_.faceDeg)}`;const b=A=>A===null?"-":`${Math.round(A)}°`,w=[`Δ入→移 ${b(_.gapMove)}`,`Δ入→面 ${b(_.gapFace)}`];_.speed>.05&&w.push(`v${_.speed.toFixed(1)}`),_.lockDeg!==null&&w.push(`锁#${_.lockId} ${_.lockDist.toFixed(1)}m`),_.aimDeg!==null&&w.push("拖拽瞄准"),o.gap.textContent=w.join("  "),e.classList.toggle("is-warn",_.warnMove||El(_,y))}return{update(_,y,D){if(!c)return;m=Math.max(1,_.config.moveSpeed*Math.max(1,_.config.sprintMultiplier));const b=tm(_,y,D,m);u=b;const w=_.combat.phase!=="idle";p(b);const A=performance.now(),E=`${b.inDeg}|${b.moveDeg}|${b.faceDeg}|${b.lockId}|${b.aimDeg}|${b.warnMove}|${b.speed.toFixed(1)}`;(A-g>90||E!==v)&&(g=A,v=E,x(b,w),e.dataset.in=b.inDeg===null?"":js(b.inDeg).toFixed(1),e.dataset.mv=b.moveDeg===null?"":js(b.moveDeg).toFixed(1),e.dataset.fc=js(b.faceDeg).toFixed(1),e.dataset.warn=b.warnMove||El(b,w)?"1":"0")},setEnabled:h,toggle(){return h(!c),c},enabled:()=>c,last:()=>u}}const nm=6,im=480,Al=240,Tl=92,sm=18;function am(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function om(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function rm(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function cm(n={}){const t=Math.max(1,n.windowS??nm),e=Math.max(60,n.capacity??im),i=Math.max(1,n.speedCap??sm),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??a.querySelector("#motiondbg-toggle"),c=a.querySelector("#motiondbg-graph"),l=a.querySelector("#motiondbg-read"),h=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=c.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Al*u),c.height=Math.round(Tl*u);const g=em({deadZone:n.deadZone,container:f,embedded:!0});let v=!1;function m(A){v=A,a.classList.toggle("is-off",!A),!s&&r&&(r.textContent=A?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(A)),r.setAttribute("aria-label",A?"收起手感调试面板":"展开手感调试面板"))}m(!1),s||(r==null||r.addEventListener("pointerdown",A=>{A.preventDefault(),A.stopPropagation(),m(!v)}),window.addEventListener("keydown",A=>{A.key.toLowerCase()==="v"&&!A.metaKey&&!A.ctrlKey&&m(!v)}));const p=[];let x=0,_=null,y=-1,D={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function b(A){const E=A-t;let M=0;for(;M<p.length&&p[M].t<E;)M++;return p.slice(M)}function w(A,E){if(!d)return;const M=Al,R=Tl;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,R),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,R);const F=4,U=4,X=M-F-U,L=9,C=46,W=62,H=22,K=E-t,J=Q=>F+Math.max(0,Math.min(1,(Q-K)/t))*X;for(let Q=0;Q<A.length;Q++){if(!A[Q].busy)continue;const mt=J(A[Q].t),It=Q+1<A.length?J(A[Q+1].t):mt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(mt,L,Math.max(2,It-mt),C)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const Q of[L,L+C/2,L+C])d.moveTo(F,Q),d.lineTo(M-U,Q);d.moveTo(F,W+H/2),d.lineTo(M-U,W+H/2),d.stroke();const ft=Math.max(1,...A.map(Q=>Q.speed),...A.map(Q=>Q.drive))*1.15,vt=Q=>L+C-Q/ft*C;if(A.length>1){d.beginPath(),d.moveTo(J(A[0].t),vt(A[0].speed));for(let Q=1;Q<A.length;Q++)d.lineTo(J(A[Q].t),vt(A[Q].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(J(A[A.length-1].t),L+C),d.lineTo(J(A[0].t),L+C),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(J(A[0].t),vt(A[0].drive));for(let Q=1;Q<A.length;Q++)d.lineTo(J(A[Q].t),vt(A[Q].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let j=.02;for(const Q of A)j=Math.max(j,Math.abs(Q.dv));j*=1.1;const tt=W+H/2,pt=H/2;for(const Q of A){const mt=Math.min(pt,Math.abs(Q.dv)/j*pt);d.fillStyle=Q.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(J(Q.t)-.7,Q.dv>=0?tt-mt:tt,1.4,Math.max(.5,mt))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(ft.toFixed(1),F+2,L+8),d.fillText("v",F+2,L+C-2),d.fillText("Δv",F+2,W+9),d.textAlign="right",d.fillText("0",M-U-2,L+C-2),d.textAlign="left"}return{dirDebug:g,update(A,E,M){const R=performance.now()/1e3,F=y<0?1/60:Math.max(1e-4,Math.min(.25,R-y));y=R;const U=A.character,X={x:U.position.x,z:U.position.z},L=Math.hypot(U.velocity.x,U.velocity.z),{speed:C,raw:W}=_?om(_,X,F,i):{speed:0,raw:0},H=am(x,C,F,R);H.drive=L,H.raw=W,H.busy=rm(A),_=X,x=C,p.push(H),p.length>e&&p.shift();const K=b(R);let J=0;for(const ot of K)J=Math.max(J,ot.speed);if(D={speed:C,drive:L,raw:W,dv:H.dv,accel:H.accel,peak:J,samples:K.length,windowS:t,busy:H.busy},g.update(A,E,M),v){w(K,R);const ot=H.dv>=0?"+":"";l.textContent=`v ${C.toFixed(2)} · 驱 ${L.toFixed(2)} · 峰 ${J.toFixed(2)} · Δv ${ot}${H.dv.toFixed(3)} · ${K.length} 帧`}},setEnabled:m,toggle(){return m(!v),v},enabled:()=>v,last:()=>({...D}),samples:()=>b(performance.now()/1e3).map(A=>({...A}))}}const lm=["剑盾","双剑","大剑","法杖","弓"],hm={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function dm(n){return{update(t,e,i,s,a,o,r=!1){const c=t.character,l=c.position,h=c.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=St=>St.toFixed(2),g=St=>(St*180/Math.PI).toFixed(0),v=lm[Ai.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,_=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,y=x.phase==="active"?`${x.kind}@${_.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,D=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",b=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),w=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),A=Math.abs(b)+Math.abs(w)+1e-6,E=Math.round(Math.abs(w)/A*100),M=`strafe ${E}%${b<-.05?" back":""}`,R=t.camera,F=`threat ${(R.threat*100).toFixed(0)}%  dist×${u(R.distanceScale)}  off (${u(R.offsetX)},${u(R.offsetZ)})  pitch +${u(R.pitchDelta)}°  n=${R.threatCount}`,U=o?u(o.attackBlend):"-",X=o==null?void 0:o.attackWeights,L=X?`gw ${u(X.gaitScale)}  lw ${u(X.attackLegWeight)}  spd ${u(X.driveSpeed)}`:"-",C=X?`${u(X.gaitScale)}/${u(X.attackLegWeight)}`:"-",W=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",H=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",K=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",J=o==null?void 0:o.hurt,ot=J?`hurt ${t.playerHurt.type}  部位h${u(J.hitHeight)}  脉冲p${u(J.pulse)}  上身${u(J.upperShift)}  重心${u(J.comShift)}  后坐${u(J.pelvisBack)}  屈膝${u(J.knee)}`:"-",ft=J?`${u(J.hitHeight)}/${u(J.pulse)}/${u(J.knee)}`:"-",vt=o==null?void 0:o.ik,j=vt?`${vt.active?"on":"off"} w${u(vt.weight)} e${u(vt.maxError)}`:"-",tt=t.playerLink,pt=`link ${tt.kind||"-"}  ${tt.phase}  prog ${u(tt.progress)}  win ${u(tt.linkWindow)}s  cd ${u(tt.cooldown)}s  hits ${tt.hitIds.length}  travel ${u(tt.travelled)}/${u(tt.travel)}m  id ${tt.id}`,Q=`${tt.phase}/${tt.kind||"-"}/w${u(tt.linkWindow)}`,mt=s.lastGesture,It=mt?`${mt.button} ${mt.kind} ${mt.heldMs.toFixed(0)}ms d${mt.distance.toFixed(0)}px ${mt.angleDeg.toFixed(0)}° taps${mt.taps}`:"-",At=t.dummies.map(St=>`${St.id}:${hm[St.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${f.phase} · lk ${tt.phase}${tt.kind?`/${tt.kind}`:""} w${u(tt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(l.x)},${u(l.y)},${u(l.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${E}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(c.stride)}`,`weapon ${v}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${y}  ab ${U}  gw/lw ${C}  land ${H}  ik ${j}`,`aim ${D}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ft}`,`dummies ${At}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${u(R.distanceScale)}  ${K}  lk ${Q}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${It}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(l.x)}, ${u(l.y)}, ${u(l.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${U}   ${L}   land ${W}`,ot,`ik ${j}  clamped ${vt?vt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${M}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${D}`,`weapon ${v}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${_.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,pt,`camera ${F}  ${K}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${At}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${It}`].join(`
`)}}}const Ks=["lab","hud","motion","debug"],Rl={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Cl={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function um(n){var c;const t=Object.fromEntries(Ks.map(l=>[l,document.getElementById(Cl[l].toggle)])),e=Object.fromEntries(Ks.map(l=>[l,document.getElementById(Cl[l].panel)]));let i={},s=null;function a(){var l,h,f;for(const d of Ks){const u=s===d,g=t[d],v=e[d];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${Rl[d].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${Rl[d].full}`)),v&&v.classList.toggle("is-open",u)}n.classList.toggle("is-compact",s!=="hud"),(l=i.motion)==null||l.setEnabled(s==="motion"),s==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(l){s=s===l?null:l,a()}function r(){s!==null&&(s=null,a())}for(const l of Ks)(c=t[l])==null||c.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),a(),{hudCompact:()=>s!=="hud",register(l){i=l,a()},toggle:o,closeAll:r,isOpen:l=>s===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Sc="170",fm=0,Pl=1,pm=2,pd=1,md=2,On=3,si=0,Qe=1,Le=2,ni=0,ts=1,Ll=2,Dl=3,Il=4,mm=5,Mi=100,gm=101,xm=102,vm=103,_m=104,ym=200,Mm=201,Sm=202,bm=203,Mr=204,Sr=205,Em=206,wm=207,Am=208,Tm=209,Rm=210,Cm=211,Pm=212,Lm=213,Dm=214,br=0,Er=1,wr=2,ss=3,Ar=4,Tr=5,Rr=6,Cr=7,bc=0,Im=1,km=2,ii=0,Um=1,Fm=2,Nm=3,zm=4,Om=5,Bm=6,Hm=7,gd=300,as=301,os=302,Pr=303,Lr=304,Qa=306,Dr=1e3,bi=1001,Ir=1002,Sn=1003,Gm=1004,Js=1005,Rn=1006,Eo=1007,Ei=1008,Wn=1009,xd=1010,vd=1011,Fs=1012,Ec=1013,Ti=1014,Gn=1015,Vs=1016,wc=1017,Ac=1018,rs=1020,_d=35902,yd=1021,Md=1022,Mn=1023,Sd=1024,bd=1025,es=1026,cs=1027,Ed=1028,Tc=1029,wd=1030,Rc=1031,Cc=1033,Ca=33776,Pa=33777,La=33778,Da=33779,kr=35840,Ur=35841,Fr=35842,Nr=35843,zr=36196,Or=37492,Br=37496,Hr=37808,Gr=37809,Vr=37810,Xr=37811,Wr=37812,$r=37813,Yr=37814,Zr=37815,qr=37816,jr=37817,Kr=37818,Jr=37819,Qr=37820,tc=37821,Ia=36492,ec=36494,nc=36495,Ad=36283,ic=36284,sc=36285,ac=36286,Vm=3200,Xm=3201,Td=0,Wm=1,ti="",rn="srgb",hs="srgb-linear",to="linear",de="srgb",Fi=7680,kl=519,$m=512,Ym=513,Zm=514,Rd=515,qm=516,jm=517,Km=518,Jm=519,Ul=35044,Fl="300 es",Vn=2e3,Za=2001;class ds{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,o=s.length;a<o;a++)s[a].call(this,t);t.target=null}}}const Be=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nl=1234567;const ns=Math.PI/180,Ns=180/Math.PI;function Pi(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Be[n&255]+Be[n>>8&255]+Be[n>>16&255]+Be[n>>24&255]+"-"+Be[t&255]+Be[t>>8&255]+"-"+Be[t>>16&15|64]+Be[t>>24&255]+"-"+Be[e&63|128]+Be[e>>8&255]+"-"+Be[e>>16&255]+Be[e>>24&255]+Be[i&255]+Be[i>>8&255]+Be[i>>16&255]+Be[i>>24&255]).toLowerCase()}function Ne(n,t,e){return Math.max(t,Math.min(e,n))}function Pc(n,t){return(n%t+t)%t}function Qm(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function tg(n,t,e){return n!==t?(e-n)/(t-n):0}function Rs(n,t,e){return(1-e)*n+e*t}function eg(n,t,e,i){return Rs(n,t,1-Math.exp(-e*i))}function ng(n,t=1){return t-Math.abs(Pc(n,t*2)-t)}function ig(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function sg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function ag(n,t){return n+Math.floor(Math.random()*(t-n+1))}function og(n,t){return n+Math.random()*(t-n)}function rg(n){return n*(.5-Math.random())}function cg(n){n!==void 0&&(Nl=n);let t=Nl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function lg(n){return n*ns}function hg(n){return n*Ns}function dg(n){return(n&n-1)===0&&n!==0}function ug(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function fg(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function pg(n,t,e,i,s){const a=Math.cos,o=Math.sin,r=a(e/2),c=o(e/2),l=a((t+i)/2),h=o((t+i)/2),f=a((t-i)/2),d=o((t-i)/2),u=a((i-t)/2),g=o((i-t)/2);switch(s){case"XYX":n.set(r*h,c*f,c*d,r*l);break;case"YZY":n.set(c*d,r*h,c*f,r*l);break;case"ZXZ":n.set(c*f,c*d,r*h,r*l);break;case"XZX":n.set(r*h,c*g,c*u,r*l);break;case"YXY":n.set(c*u,r*h,c*g,r*l);break;case"ZYZ":n.set(c*g,c*u,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ki(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function $e(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const zl={DEG2RAD:ns,RAD2DEG:Ns,generateUUID:Pi,clamp:Ne,euclideanModulo:Pc,mapLinear:Qm,inverseLerp:tg,lerp:Rs,damp:eg,pingpong:ng,smoothstep:ig,smootherstep:sg,randInt:ag,randFloat:og,randFloatSpread:rg,seededRandom:cg,degToRad:lg,radToDeg:hg,isPowerOfTwo:dg,ceilPowerOfTwo:ug,floorPowerOfTwo:fg,setQuaternionFromProperEuler:pg,normalize:$e,denormalize:Ki};class Bt{constructor(t=0,e=0){Bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,o=this.y-t.y;return this.x=a*i-o*s+t.x,this.y=a*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class jt{constructor(t,e,i,s,a,o,r,c,l){jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,c,l)}set(t,e,i,s,a,o,r,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=a,h[5]=c,h[6]=i,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],h=i[4],f=i[7],d=i[2],u=i[5],g=i[8],v=s[0],m=s[3],p=s[6],x=s[1],_=s[4],y=s[7],D=s[2],b=s[5],w=s[8];return a[0]=o*v+r*x+c*D,a[3]=o*m+r*_+c*b,a[6]=o*p+r*y+c*w,a[1]=l*v+h*x+f*D,a[4]=l*m+h*_+f*b,a[7]=l*p+h*y+f*w,a[2]=d*v+u*x+g*D,a[5]=d*m+u*_+g*b,a[8]=d*p+u*y+g*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*r*l-i*a*h+i*r*c+s*a*l-s*o*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],c=t[6],l=t[7],h=t[8],f=h*o-r*l,d=r*c-h*a,u=l*a-o*c,g=e*f+i*d+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=f*v,t[1]=(s*l-h*i)*v,t[2]=(r*i-s*o)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*a-r*e)*v,t[6]=u*v,t[7]=(i*c-l*e)*v,t[8]=(o*e-i*a)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,o,r){const c=Math.cos(a),l=Math.sin(a);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-s*l,s*c,-s*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(wo.makeScale(t,e)),this}rotate(t){return this.premultiply(wo.makeRotation(-t)),this}translate(t,e){return this.premultiply(wo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const wo=new jt;function Cd(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function qa(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function mg(){const n=qa("canvas");return n.style.display="block",n}const Ol={};function ws(n){n in Ol||(Ol[n]=!0,console.warn(n))}function gg(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function xg(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function vg(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ae={enabled:!0,workingColorSpace:hs,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===de&&(n.r=Xn(n.r),n.g=Xn(n.g),n.b=Xn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===de&&(n.r=is(n.r),n.g=is(n.g),n.b=is(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ti?to:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Xn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function is(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Bl=[.64,.33,.3,.6,.15,.06],Hl=[.2126,.7152,.0722],Gl=[.3127,.329],Vl=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xl=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ae.define({[hs]:{primaries:Bl,whitePoint:Gl,transfer:to,toXYZ:Vl,fromXYZ:Xl,luminanceCoefficients:Hl,workingColorSpaceConfig:{unpackColorSpace:rn},outputColorSpaceConfig:{drawingBufferColorSpace:rn}},[rn]:{primaries:Bl,whitePoint:Gl,transfer:de,toXYZ:Vl,fromXYZ:Xl,luminanceCoefficients:Hl,outputColorSpaceConfig:{drawingBufferColorSpace:rn}}});let Ni;class _g{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ni===void 0&&(Ni=qa("canvas")),Ni.width=t.width,Ni.height=t.height;const i=Ni.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ni}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=qa("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let o=0;o<a.length;o++)a[o]=Xn(a[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Xn(e[i]/255)*255):e[i]=Xn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let yg=0;class Pd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:yg++}),this.uuid=Pi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?a.push(Ao(s[o].image)):a.push(Ao(s[o]))}else a=Ao(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function Ao(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?_g.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Mg=0;class qe extends ds{constructor(t=qe.DEFAULT_IMAGE,e=qe.DEFAULT_MAPPING,i=bi,s=bi,a=Rn,o=Ei,r=Mn,c=Wn,l=qe.DEFAULT_ANISOTROPY,h=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Mg++}),this.uuid=Pi(),this.name="",this.source=new Pd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Bt(0,0),this.repeat=new Bt(1,1),this.center=new Bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==gd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Dr:t.x=t.x-Math.floor(t.x);break;case bi:t.x=t.x<0?0:1;break;case Ir:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Dr:t.y=t.y-Math.floor(t.y);break;case bi:t.y=t.y<0?0:1;break;case Ir:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}qe.DEFAULT_IMAGE=null;qe.DEFAULT_MAPPING=gd;qe.DEFAULT_ANISOTROPY=1;class Se{constructor(t=0,e=0,i=0,s=1){Se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*a,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*a,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*a,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const c=t.elements,l=c[0],h=c[4],f=c[8],d=c[1],u=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(f-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(l+1)/2,y=(u+1)/2,D=(p+1)/2,b=(h+d)/4,w=(f+v)/4,A=(g+m)/4;return _>y&&_>D?_<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(_),s=b/i,a=w/i):y>D?y<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(y),i=b/s,a=A/s):D<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(D),i=w/a,s=A/a),this.set(i,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-v)*(f-v)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-v)/x,this.z=(d-h)/x,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Sg extends ds{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Se(0,0,t,e),this.scissorTest=!1,this.viewport=new Se(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Rn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new qe(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=a.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Pd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ri extends Sg{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Ld extends qe{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Sn,this.minFilter=Sn,this.wrapR=bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class bg extends qe{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Sn,this.minFilter=Sn,this.wrapR=bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xs{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,o,r){let c=i[s+0],l=i[s+1],h=i[s+2],f=i[s+3];const d=a[o+0],u=a[o+1],g=a[o+2],v=a[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=g,t[e+3]=v;return}if(f!==v||c!==d||l!==u||h!==g){let m=1-r;const p=c*d+l*u+h*g+f*v,x=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){const D=Math.sqrt(_),b=Math.atan2(D,p*x);m=Math.sin(m*b)/D,r=Math.sin(r*b)/D}const y=r*x;if(c=c*m+d*y,l=l*m+u*y,h=h*m+g*y,f=f*m+v*y,m===1-r){const D=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=D,l*=D,h*=D,f*=D}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,o){const r=i[s],c=i[s+1],l=i[s+2],h=i[s+3],f=a[o],d=a[o+1],u=a[o+2],g=a[o+3];return t[e]=r*g+h*f+c*u-l*d,t[e+1]=c*g+h*d+l*f-r*u,t[e+2]=l*g+h*u+r*d-c*f,t[e+3]=h*g-r*f-c*d-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),h=r(s/2),f=r(a/2),d=c(i/2),u=c(s/2),g=c(a/2);switch(o){case"XYZ":this._x=d*h*f+l*u*g,this._y=l*u*f-d*h*g,this._z=l*h*g+d*u*f,this._w=l*h*f-d*u*g;break;case"YXZ":this._x=d*h*f+l*u*g,this._y=l*u*f-d*h*g,this._z=l*h*g-d*u*f,this._w=l*h*f+d*u*g;break;case"ZXY":this._x=d*h*f-l*u*g,this._y=l*u*f+d*h*g,this._z=l*h*g+d*u*f,this._w=l*h*f-d*u*g;break;case"ZYX":this._x=d*h*f-l*u*g,this._y=l*u*f+d*h*g,this._z=l*h*g-d*u*f,this._w=l*h*f+d*u*g;break;case"YZX":this._x=d*h*f+l*u*g,this._y=l*u*f+d*h*g,this._z=l*h*g-d*u*f,this._w=l*h*f-d*u*g;break;case"XZY":this._x=d*h*f-l*u*g,this._y=l*u*f-d*h*g,this._z=l*h*g+d*u*f,this._w=l*h*f+d*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],o=e[1],r=e[5],c=e[9],l=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-c)*u,this._y=(a-l)*u,this._z=(o-s)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-c)/u,this._x=.25*u,this._y=(s+o)/u,this._z=(a+l)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(a-l)/u,this._x=(s+o)/u,this._y=.25*u,this._z=(c+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-s)/u,this._x=(a+l)/u,this._y=(c+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ne(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,o=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+o*r+s*l-a*c,this._y=s*h+o*c+a*r-i*l,this._z=a*h+o*l+i*c-s*r,this._w=o*h-i*r-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,o=this._w;let r=o*t._w+i*t._x+s*t._y+a*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=s,this._z=a,this;const c=1-r*r;if(c<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),f=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=s*f+this._y*d,this._z=a*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ${constructor(t=0,e=0,i=0){$.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Wl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Wl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,o=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*o,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*o,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*s-r*i),h=2*(r*e-a*s),f=2*(a*i-o*e);return this.x=e+c*l+o*f-r*h,this.y=i+c*h+r*l-a*f,this.z=s+c*f+a*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,o=e.x,r=e.y,c=e.z;return this.x=s*c-a*r,this.y=a*o-i*c,this.z=i*r-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return To.copy(this).projectOnVector(t),this.sub(To)}reflect(t){return this.sub(To.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const To=new $,Wl=new Xs;class Ws{constructor(t=new $(1/0,1/0,1/0),e=new $(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(vn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(vn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=vn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=a.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,vn):vn.fromBufferAttribute(a,o),vn.applyMatrix4(t.matrixWorld),this.expandByPoint(vn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Qs.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Qs.copy(i.boundingBox)),Qs.applyMatrix4(t.matrixWorld),this.union(Qs)}const s=t.children;for(let a=0,o=s.length;a<o;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,vn),vn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ys),ta.subVectors(this.max,ys),zi.subVectors(t.a,ys),Oi.subVectors(t.b,ys),Bi.subVectors(t.c,ys),Zn.subVectors(Oi,zi),qn.subVectors(Bi,Oi),li.subVectors(zi,Bi);let e=[0,-Zn.z,Zn.y,0,-qn.z,qn.y,0,-li.z,li.y,Zn.z,0,-Zn.x,qn.z,0,-qn.x,li.z,0,-li.x,-Zn.y,Zn.x,0,-qn.y,qn.x,0,-li.y,li.x,0];return!Ro(e,zi,Oi,Bi,ta)||(e=[1,0,0,0,1,0,0,0,1],!Ro(e,zi,Oi,Bi,ta))?!1:(ea.crossVectors(Zn,qn),e=[ea.x,ea.y,ea.z],Ro(e,zi,Oi,Bi,ta))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,vn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(vn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(kn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const kn=[new $,new $,new $,new $,new $,new $,new $,new $],vn=new $,Qs=new Ws,zi=new $,Oi=new $,Bi=new $,Zn=new $,qn=new $,li=new $,ys=new $,ta=new $,ea=new $,hi=new $;function Ro(n,t,e,i,s){for(let a=0,o=n.length-3;a<=o;a+=3){hi.fromArray(n,a);const r=s.x*Math.abs(hi.x)+s.y*Math.abs(hi.y)+s.z*Math.abs(hi.z),c=t.dot(hi),l=e.dot(hi),h=i.dot(hi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const Eg=new Ws,Ms=new $,Co=new $;class eo{constructor(t=new $,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Eg.setFromPoints(t).getCenter(i);let s=0;for(let a=0,o=t.length;a<o;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ms.subVectors(t,this.center);const e=Ms.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Ms,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Co.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ms.copy(t.center).add(Co)),this.expandByPoint(Ms.copy(t.center).sub(Co))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Un=new $,Po=new $,na=new $,jn=new $,Lo=new $,ia=new $,Do=new $;class Lc{constructor(t=new $,e=new $(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Un.copy(this.origin).addScaledVector(this.direction,e),Un.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Po.copy(t).add(e).multiplyScalar(.5),na.copy(e).sub(t).normalize(),jn.copy(this.origin).sub(Po);const a=t.distanceTo(e)*.5,o=-this.direction.dot(na),r=jn.dot(this.direction),c=-jn.dot(na),l=jn.lengthSq(),h=Math.abs(1-o*o);let f,d,u,g;if(h>0)if(f=o*c-r,d=o*r-c,g=a*h,f>=0)if(d>=-g)if(d<=g){const v=1/h;f*=v,d*=v,u=f*(f+o*d+2*r)+d*(o*f+d+2*c)+l}else d=a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*c)+l;else d=-a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*c)+l;else d<=-g?(f=Math.max(0,-(-o*a+r)),d=f>0?-a:Math.min(Math.max(-a,-c),a),u=-f*f+d*(d+2*c)+l):d<=g?(f=0,d=Math.min(Math.max(-a,-c),a),u=d*(d+2*c)+l):(f=Math.max(0,-(o*a+r)),d=f>0?a:Math.min(Math.max(-a,-c),a),u=-f*f+d*(d+2*c)+l);else d=o>0?-a:a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Po).addScaledVector(na,d),u}intersectSphere(t,e){Un.subVectors(t.center,this.origin);const i=Un.dot(this.direction),s=Un.dot(Un)-i*i,a=t.radius*t.radius;if(s>a)return null;const o=Math.sqrt(a-s),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,o,r,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(a=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||a>s||((a>i||isNaN(i))&&(i=a),(o<s||isNaN(s))&&(s=o),f>=0?(r=(t.min.z-d.z)*f,c=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,c=(t.min.z-d.z)*f),i>c||r>s)||((r>i||i!==i)&&(i=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Un)!==null}intersectTriangle(t,e,i,s,a){Lo.subVectors(e,t),ia.subVectors(i,t),Do.crossVectors(Lo,ia);let o=this.direction.dot(Do),r;if(o>0){if(s)return null;r=1}else if(o<0)r=-1,o=-o;else return null;jn.subVectors(this.origin,t);const c=r*this.direction.dot(ia.crossVectors(jn,ia));if(c<0)return null;const l=r*this.direction.dot(Lo.cross(jn));if(l<0||c+l>o)return null;const h=-r*jn.dot(Do);return h<0?null:this.at(h/o,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class xe{constructor(t,e,i,s,a,o,r,c,l,h,f,d,u,g,v,m){xe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,c,l,h,f,d,u,g,v,m)}set(t,e,i,s,a,o,r,c,l,h,f,d,u,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=a,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new xe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Hi.setFromMatrixColumn(t,0).length(),a=1/Hi.setFromMatrixColumn(t,1).length(),o=1/Hi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const d=o*h,u=o*f,g=r*h,v=r*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=u+g*l,e[5]=d-v*l,e[9]=-r*c,e[2]=v-d*l,e[6]=g+u*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,u=c*f,g=l*h,v=l*f;e[0]=d+v*r,e[4]=g*r-u,e[8]=o*l,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-g,e[6]=v+d*r,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,u=c*f,g=l*h,v=l*f;e[0]=d-v*r,e[4]=-o*f,e[8]=g+u*r,e[1]=u+g*r,e[5]=o*h,e[9]=v-d*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,u=o*f,g=r*h,v=r*f;e[0]=c*h,e[4]=g*l-u,e[8]=d*l+v,e[1]=c*f,e[5]=v*l+d,e[9]=u*l-g,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,u=o*l,g=r*c,v=r*l;e[0]=c*h,e[4]=v-d*f,e[8]=g*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-l*h,e[6]=u*f+g,e[10]=d-v*f}else if(t.order==="XZY"){const d=o*c,u=o*l,g=r*c,v=r*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=d*f+v,e[5]=o*h,e[9]=u*f-g,e[2]=g*f-u,e[6]=r*h,e[10]=v*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(wg,t,Ag)}lookAt(t,e,i){const s=this.elements;return sn.subVectors(t,e),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),Kn.crossVectors(i,sn),Kn.lengthSq()===0&&(Math.abs(i.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),Kn.crossVectors(i,sn)),Kn.normalize(),sa.crossVectors(sn,Kn),s[0]=Kn.x,s[4]=sa.x,s[8]=sn.x,s[1]=Kn.y,s[5]=sa.y,s[9]=sn.y,s[2]=Kn.z,s[6]=sa.z,s[10]=sn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],h=i[1],f=i[5],d=i[9],u=i[13],g=i[2],v=i[6],m=i[10],p=i[14],x=i[3],_=i[7],y=i[11],D=i[15],b=s[0],w=s[4],A=s[8],E=s[12],M=s[1],R=s[5],F=s[9],U=s[13],X=s[2],L=s[6],C=s[10],W=s[14],H=s[3],K=s[7],J=s[11],ot=s[15];return a[0]=o*b+r*M+c*X+l*H,a[4]=o*w+r*R+c*L+l*K,a[8]=o*A+r*F+c*C+l*J,a[12]=o*E+r*U+c*W+l*ot,a[1]=h*b+f*M+d*X+u*H,a[5]=h*w+f*R+d*L+u*K,a[9]=h*A+f*F+d*C+u*J,a[13]=h*E+f*U+d*W+u*ot,a[2]=g*b+v*M+m*X+p*H,a[6]=g*w+v*R+m*L+p*K,a[10]=g*A+v*F+m*C+p*J,a[14]=g*E+v*U+m*W+p*ot,a[3]=x*b+_*M+y*X+D*H,a[7]=x*w+_*R+y*L+D*K,a[11]=x*A+_*F+y*C+D*J,a[15]=x*E+_*U+y*W+D*ot,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],o=t[1],r=t[5],c=t[9],l=t[13],h=t[2],f=t[6],d=t[10],u=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+a*c*f-s*l*f-a*r*d+i*l*d+s*r*u-i*c*u)+v*(+e*c*u-e*l*d+a*o*d-s*o*u+s*l*h-a*c*h)+m*(+e*l*f-e*r*u-a*o*f+i*o*u+a*r*h-i*l*h)+p*(-s*r*h-e*c*f+e*r*d+s*o*f-i*o*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],c=t[6],l=t[7],h=t[8],f=t[9],d=t[10],u=t[11],g=t[12],v=t[13],m=t[14],p=t[15],x=f*m*l-v*d*l+v*c*u-r*m*u-f*c*p+r*d*p,_=g*d*l-h*m*l-g*c*u+o*m*u+h*c*p-o*d*p,y=h*v*l-g*f*l+g*r*u-o*v*u-h*r*p+o*f*p,D=g*f*c-h*v*c-g*r*d+o*v*d+h*r*m-o*f*m,b=e*x+i*_+s*y+a*D;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/b;return t[0]=x*w,t[1]=(v*d*a-f*m*a-v*s*u+i*m*u+f*s*p-i*d*p)*w,t[2]=(r*m*a-v*c*a+v*s*l-i*m*l-r*s*p+i*c*p)*w,t[3]=(f*c*a-r*d*a-f*s*l+i*d*l+r*s*u-i*c*u)*w,t[4]=_*w,t[5]=(h*m*a-g*d*a+g*s*u-e*m*u-h*s*p+e*d*p)*w,t[6]=(g*c*a-o*m*a-g*s*l+e*m*l+o*s*p-e*c*p)*w,t[7]=(o*d*a-h*c*a+h*s*l-e*d*l-o*s*u+e*c*u)*w,t[8]=y*w,t[9]=(g*f*a-h*v*a-g*i*u+e*v*u+h*i*p-e*f*p)*w,t[10]=(o*v*a-g*r*a+g*i*l-e*v*l-o*i*p+e*r*p)*w,t[11]=(h*r*a-o*f*a-h*i*l+e*f*l+o*i*u-e*r*u)*w,t[12]=D*w,t[13]=(h*v*s-g*f*s+g*i*d-e*v*d-h*i*m+e*f*m)*w,t[14]=(g*r*s-o*v*s-g*i*c+e*v*c+o*i*m-e*r*m)*w,t[15]=(o*f*s-h*r*s+h*i*c-e*f*c-o*i*d+e*r*d)*w,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,o=t.x,r=t.y,c=t.z,l=a*o,h=a*r;return this.set(l*o+i,l*r-s*c,l*c+s*r,0,l*r+s*c,h*r+i,h*c-s*o,0,l*c-s*r,h*c+s*o,a*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,o){return this.set(1,i,a,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,o=e._y,r=e._z,c=e._w,l=a+a,h=o+o,f=r+r,d=a*l,u=a*h,g=a*f,v=o*h,m=o*f,p=r*f,x=c*l,_=c*h,y=c*f,D=i.x,b=i.y,w=i.z;return s[0]=(1-(v+p))*D,s[1]=(u+y)*D,s[2]=(g-_)*D,s[3]=0,s[4]=(u-y)*b,s[5]=(1-(d+p))*b,s[6]=(m+x)*b,s[7]=0,s[8]=(g+_)*w,s[9]=(m-x)*w,s[10]=(1-(d+v))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=Hi.set(s[0],s[1],s[2]).length();const o=Hi.set(s[4],s[5],s[6]).length(),r=Hi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],_n.copy(this);const l=1/a,h=1/o,f=1/r;return _n.elements[0]*=l,_n.elements[1]*=l,_n.elements[2]*=l,_n.elements[4]*=h,_n.elements[5]*=h,_n.elements[6]*=h,_n.elements[8]*=f,_n.elements[9]*=f,_n.elements[10]*=f,e.setFromRotationMatrix(_n),i.x=a,i.y=o,i.z=r,this}makePerspective(t,e,i,s,a,o,r=Vn){const c=this.elements,l=2*a/(e-t),h=2*a/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let u,g;if(r===Vn)u=-(o+a)/(o-a),g=-2*o*a/(o-a);else if(r===Za)u=-o/(o-a),g=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=u,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,a,o,r=Vn){const c=this.elements,l=1/(e-t),h=1/(i-s),f=1/(o-a),d=(e+t)*l,u=(i+s)*h;let g,v;if(r===Vn)g=(o+a)*f,v=-2*f;else if(r===Za)g=a*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-u,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Hi=new $,_n=new xe,wg=new $(0,0,0),Ag=new $(1,1,1),Kn=new $,sa=new $,sn=new $,$l=new xe,Yl=new Xs;class Pn{constructor(t=0,e=0,i=0,s=Pn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],o=s[4],r=s[8],c=s[1],l=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(Ne(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Ne(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(r,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return $l.makeRotationFromQuaternion(t),this.setFromRotationMatrix($l,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Yl.setFromEuler(this),this.setFromQuaternion(Yl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Pn.DEFAULT_ORDER="XYZ";class Dc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Tg=0;const Zl=new $,Gi=new Xs,Fn=new xe,aa=new $,Ss=new $,Rg=new $,Cg=new Xs,ql=new $(1,0,0),jl=new $(0,1,0),Kl=new $(0,0,1),Jl={type:"added"},Pg={type:"removed"},Vi={type:"childadded",child:null},Io={type:"childremoved",child:null};class Te extends ds{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Tg++}),this.uuid=Pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Te.DEFAULT_UP.clone();const t=new $,e=new Pn,i=new Xs,s=new $(1,1,1);function a(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new xe},normalMatrix:{value:new jt}}),this.matrix=new xe,this.matrixWorld=new xe,this.matrixAutoUpdate=Te.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Gi.setFromAxisAngle(t,e),this.quaternion.multiply(Gi),this}rotateOnWorldAxis(t,e){return Gi.setFromAxisAngle(t,e),this.quaternion.premultiply(Gi),this}rotateX(t){return this.rotateOnAxis(ql,t)}rotateY(t){return this.rotateOnAxis(jl,t)}rotateZ(t){return this.rotateOnAxis(Kl,t)}translateOnAxis(t,e){return Zl.copy(t).applyQuaternion(this.quaternion),this.position.add(Zl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ql,t)}translateY(t){return this.translateOnAxis(jl,t)}translateZ(t){return this.translateOnAxis(Kl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?aa.copy(t):aa.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(Ss,aa,this.up):Fn.lookAt(aa,Ss,this.up),this.quaternion.setFromRotationMatrix(Fn),s&&(Fn.extractRotation(s.matrixWorld),Gi.setFromRotationMatrix(Fn),this.quaternion.premultiply(Gi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Jl),Vi.child=t,this.dispatchEvent(Vi),Vi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Pg),Io.child=t,this.dispatchEvent(Io),Io.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Fn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Jl),Vi.child=t,this.dispatchEvent(Vi),Vi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ss,t,Rg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ss,Cg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(a(t.materials,this.material[c]));s.material=r}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];s.animations.push(a(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Te.DEFAULT_UP=new $(0,1,0);Te.DEFAULT_MATRIX_AUTO_UPDATE=!0;Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const yn=new $,Nn=new $,ko=new $,zn=new $,Xi=new $,Wi=new $,Ql=new $,Uo=new $,Fo=new $,No=new $,zo=new Se,Oo=new Se,Bo=new Se;class mn{constructor(t=new $,e=new $,i=new $){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),yn.subVectors(t,e),s.cross(yn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){yn.subVectors(s,e),Nn.subVectors(i,e),ko.subVectors(t,e);const o=yn.dot(yn),r=yn.dot(Nn),c=yn.dot(ko),l=Nn.dot(Nn),h=Nn.dot(ko),f=o*l-r*r;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(l*c-r*h)*d,g=(o*h-r*c)*d;return a.set(1-u-g,g,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,zn)===null?!1:zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getInterpolation(t,e,i,s,a,o,r,c){return this.getBarycoord(t,e,i,s,zn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,zn.x),c.addScaledVector(o,zn.y),c.addScaledVector(r,zn.z),c)}static getInterpolatedAttribute(t,e,i,s,a,o){return zo.setScalar(0),Oo.setScalar(0),Bo.setScalar(0),zo.fromBufferAttribute(t,e),Oo.fromBufferAttribute(t,i),Bo.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(zo,a.x),o.addScaledVector(Oo,a.y),o.addScaledVector(Bo,a.z),o}static isFrontFacing(t,e,i,s){return yn.subVectors(i,e),Nn.subVectors(t,e),yn.cross(Nn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return yn.subVectors(this.c,this.b),Nn.subVectors(this.a,this.b),yn.cross(Nn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return mn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return mn.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let o,r;Xi.subVectors(s,i),Wi.subVectors(a,i),Uo.subVectors(t,i);const c=Xi.dot(Uo),l=Wi.dot(Uo);if(c<=0&&l<=0)return e.copy(i);Fo.subVectors(t,s);const h=Xi.dot(Fo),f=Wi.dot(Fo);if(h>=0&&f<=h)return e.copy(s);const d=c*f-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(i).addScaledVector(Xi,o);No.subVectors(t,a);const u=Xi.dot(No),g=Wi.dot(No);if(g>=0&&u<=g)return e.copy(a);const v=u*l-c*g;if(v<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(i).addScaledVector(Wi,r);const m=h*g-u*f;if(m<=0&&f-h>=0&&u-g>=0)return Ql.subVectors(a,s),r=(f-h)/(f-h+(u-g)),e.copy(s).addScaledVector(Ql,r);const p=1/(m+v+d);return o=v*p,r=d*p,e.copy(i).addScaledVector(Xi,o).addScaledVector(Wi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Dd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jn={h:0,s:0,l:0},oa={h:0,s:0,l:0};function Ho(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Zt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=rn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ae.workingColorSpace){return this.r=t,this.g=e,this.b=i,ae.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ae.workingColorSpace){if(t=Pc(t,1),e=Ne(e,0,1),i=Ne(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,o=2*i-a;this.r=Ho(o,a,t+1/3),this.g=Ho(o,a,t),this.b=Ho(o,a,t-1/3)}return ae.toWorkingColorSpace(this,s),this}setStyle(t,e=rn){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=rn){const i=Dd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Xn(t.r),this.g=Xn(t.g),this.b=Xn(t.b),this}copyLinearToSRGB(t){return this.r=is(t.r),this.g=is(t.g),this.b=is(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=rn){return ae.fromWorkingColorSpace(He.copy(this),t),Math.round(Ne(He.r*255,0,255))*65536+Math.round(Ne(He.g*255,0,255))*256+Math.round(Ne(He.b*255,0,255))}getHexString(t=rn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.fromWorkingColorSpace(He.copy(this),e);const i=He.r,s=He.g,a=He.b,o=Math.max(i,s,a),r=Math.min(i,s,a);let c,l;const h=(r+o)/2;if(r===o)c=0,l=0;else{const f=o-r;switch(l=h<=.5?f/(o+r):f/(2-o-r),o){case i:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-i)/f+2;break;case a:c=(i-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ae.workingColorSpace){return ae.fromWorkingColorSpace(He.copy(this),e),t.r=He.r,t.g=He.g,t.b=He.b,t}getStyle(t=rn){ae.fromWorkingColorSpace(He.copy(this),t);const e=He.r,i=He.g,s=He.b;return t!==rn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Jn),this.setHSL(Jn.h+t,Jn.s+e,Jn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Jn),t.getHSL(oa);const i=Rs(Jn.h,oa.h,e),s=Rs(Jn.s,oa.s,e),a=Rs(Jn.l,oa.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const He=new Zt;Zt.NAMES=Dd;let Lg=0;class us extends ds{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Lg++}),this.uuid=Pi(),this.name="",this.blending=ts,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mr,this.blendDst=Sr,this.blendEquation=Mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=ss,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fi,this.stencilZFail=Fi,this.stencilZPass=Fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ts&&(i.blending=this.blending),this.side!==si&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Mr&&(i.blendSrc=this.blendSrc),this.blendDst!==Sr&&(i.blendDst=this.blendDst),this.blendEquation!==Mi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ss&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==kl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Fi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Fi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Fi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const o=[];for(const r in a){const c=a[r];delete c.metadata,o.push(c)}return o}if(e){const a=s(t.textures),o=s(t.images);a.length>0&&(i.textures=a),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Je extends us{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=bc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new $,ra=new Bt;class tn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Ul,this.updateRanges=[],this.gpuType=Gn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ra.fromBufferAttribute(this,e),ra.applyMatrix3(t),this.setXY(e,ra.x,ra.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ki(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=$e(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ki(e,this.array)),e}setX(t,e){return this.normalized&&(e=$e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ki(e,this.array)),e}setY(t,e){return this.normalized&&(e=$e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ki(e,this.array)),e}setZ(t,e){return this.normalized&&(e=$e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ki(e,this.array)),e}setW(t,e){return this.normalized&&(e=$e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=$e(e,this.array),i=$e(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=$e(e,this.array),i=$e(i,this.array),s=$e(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=$e(e,this.array),i=$e(i,this.array),s=$e(s,this.array),a=$e(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ul&&(t.usage=this.usage),t}}class Id extends tn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class kd extends tn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class pe extends tn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Dg=0;const hn=new xe,Go=new Te,$i=new $,an=new Ws,bs=new Ws,ke=new $;class ze extends ds{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dg++}),this.uuid=Pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Cd(t)?kd:Id)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new jt().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return hn.makeRotationFromQuaternion(t),this.applyMatrix4(hn),this}rotateX(t){return hn.makeRotationX(t),this.applyMatrix4(hn),this}rotateY(t){return hn.makeRotationY(t),this.applyMatrix4(hn),this}rotateZ(t){return hn.makeRotationZ(t),this.applyMatrix4(hn),this}translate(t,e,i){return hn.makeTranslation(t,e,i),this.applyMatrix4(hn),this}scale(t,e,i){return hn.makeScale(t,e,i),this.applyMatrix4(hn),this}lookAt(t){return Go.lookAt(t),Go.updateMatrix(),this.applyMatrix4(Go.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($i).negate(),this.translate($i.x,$i.y,$i.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new pe(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ws);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new $(-1/0,-1/0,-1/0),new $(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];an.setFromBufferAttribute(a),this.morphTargetsRelative?(ke.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(ke),ke.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(ke)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new eo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new $,1/0);return}if(t){const i=this.boundingSphere.center;if(an.setFromBufferAttribute(t),e)for(let a=0,o=e.length;a<o;a++){const r=e[a];bs.setFromBufferAttribute(r),this.morphTargetsRelative?(ke.addVectors(an.min,bs.min),an.expandByPoint(ke),ke.addVectors(an.max,bs.max),an.expandByPoint(ke)):(an.expandByPoint(bs.min),an.expandByPoint(bs.max))}an.getCenter(i);let s=0;for(let a=0,o=t.count;a<o;a++)ke.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(ke));if(e)for(let a=0,o=e.length;a<o;a++){const r=e[a],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)ke.fromBufferAttribute(r,l),c&&($i.fromBufferAttribute(t,l),ke.add($i)),s=Math.max(s,i.distanceToSquared(ke))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new tn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let A=0;A<i.count;A++)r[A]=new $,c[A]=new $;const l=new $,h=new $,f=new $,d=new Bt,u=new Bt,g=new Bt,v=new $,m=new $;function p(A,E,M){l.fromBufferAttribute(i,A),h.fromBufferAttribute(i,E),f.fromBufferAttribute(i,M),d.fromBufferAttribute(a,A),u.fromBufferAttribute(a,E),g.fromBufferAttribute(a,M),h.sub(l),f.sub(l),u.sub(d),g.sub(d);const R=1/(u.x*g.y-g.x*u.y);isFinite(R)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(R),m.copy(f).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(R),r[A].add(v),r[E].add(v),r[M].add(v),c[A].add(m),c[E].add(m),c[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let A=0,E=x.length;A<E;++A){const M=x[A],R=M.start,F=M.count;for(let U=R,X=R+F;U<X;U+=3)p(t.getX(U+0),t.getX(U+1),t.getX(U+2))}const _=new $,y=new $,D=new $,b=new $;function w(A){D.fromBufferAttribute(s,A),b.copy(D);const E=r[A];_.copy(E),_.sub(D.multiplyScalar(D.dot(E))).normalize(),y.crossVectors(b,E);const R=y.dot(c[A])<0?-1:1;o.setXYZW(A,_.x,_.y,_.z,R)}for(let A=0,E=x.length;A<E;++A){const M=x[A],R=M.start,F=M.count;for(let U=R,X=R+F;U<X;U+=3)w(t.getX(U+0)),w(t.getX(U+1)),w(t.getX(U+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new tn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new $,a=new $,o=new $,r=new $,c=new $,l=new $,h=new $,f=new $;if(t)for(let d=0,u=t.count;d<u;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,m),r.add(h),c.add(h),l.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,u=e.count;d<u;d+=3)s.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)ke.fromBufferAttribute(t,e),ke.normalize(),t.setXYZ(e,ke.x,ke.y,ke.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,f=r.normalized,d=new l.constructor(c.length*h);let u=0,g=0;for(let v=0,m=c.length;v<m;v++){r.isInterleavedBufferAttribute?u=c[v]*r.data.stride+r.offset:u=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[u++]}return new tn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ze,i=this.index.array,s=this.attributes;for(const r in s){const c=s[r],l=t(c,i);e.setAttribute(r,l)}const a=this.morphAttributes;for(const r in a){const c=[],l=a[r];for(let h=0,f=l.length;h<f;h++){const d=l[h],u=t(d,i);c.push(u)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,d=l.length;f<d;f++){const u=l[f];h.push(u.toJSON(t.data))}h.length>0&&(s[c]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const a=t.morphAttributes;for(const l in a){const h=[],f=a[l];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const th=new xe,di=new Lc,ca=new eo,eh=new $,la=new $,ha=new $,da=new $,Vo=new $,ua=new $,nh=new $,fa=new $;class he extends Te{constructor(t=new ze,e=new Je){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(a&&r){ua.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=r[c],f=a[c];h!==0&&(Vo.fromBufferAttribute(f,t),o?ua.addScaledVector(Vo,h):ua.addScaledVector(Vo.sub(e),h))}e.add(ua)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ca.copy(i.boundingSphere),ca.applyMatrix4(a),di.copy(t.ray).recast(t.near),!(ca.containsPoint(di.origin)===!1&&(di.intersectSphere(ca,eh)===null||di.origin.distanceToSquared(eh)>(t.far-t.near)**2))&&(th.copy(a).invert(),di.copy(t.ray).applyMatrix4(th),!(i.boundingBox!==null&&di.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,di)))}_computeIntersections(t,e,i){let s;const a=this.geometry,o=this.material,r=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),_=Math.min(r.count,Math.min(m.start+m.count,u.start+u.count));for(let y=x,D=_;y<D;y+=3){const b=r.getX(y),w=r.getX(y+1),A=r.getX(y+2);s=pa(this,p,t,i,l,h,f,b,w,A),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),v=Math.min(r.count,u.start+u.count);for(let m=g,p=v;m<p;m+=3){const x=r.getX(m),_=r.getX(m+1),y=r.getX(m+2);s=pa(this,o,t,i,l,h,f,x,_,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),_=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let y=x,D=_;y<D;y+=3){const b=y,w=y+1,A=y+2;s=pa(this,p,t,i,l,h,f,b,w,A),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),v=Math.min(c.count,u.start+u.count);for(let m=g,p=v;m<p;m+=3){const x=m,_=m+1,y=m+2;s=pa(this,o,t,i,l,h,f,x,_,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Ig(n,t,e,i,s,a,o,r){let c;if(t.side===Qe?c=i.intersectTriangle(o,a,s,!0,r):c=i.intersectTriangle(s,a,o,t.side===si,r),c===null)return null;fa.copy(r),fa.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(fa);return l<e.near||l>e.far?null:{distance:l,point:fa.clone(),object:n}}function pa(n,t,e,i,s,a,o,r,c,l){n.getVertexPosition(r,la),n.getVertexPosition(c,ha),n.getVertexPosition(l,da);const h=Ig(n,t,e,i,la,ha,da,nh);if(h){const f=new $;mn.getBarycoord(nh,la,ha,da,f),s&&(h.uv=mn.getInterpolatedAttribute(s,r,c,l,f,new Bt)),a&&(h.uv1=mn.getInterpolatedAttribute(a,r,c,l,f,new Bt)),o&&(h.normal=mn.getInterpolatedAttribute(o,r,c,l,f,new $),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:c,c:l,normal:new $,materialIndex:0};mn.getNormal(la,ha,da,d.normal),h.face=d,h.barycoord=f}return h}class Ln extends ze{constructor(t=1,e=1,i=1,s=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:o};const r=this;s=Math.floor(s),a=Math.floor(a),o=Math.floor(o);const c=[],l=[],h=[],f=[];let d=0,u=0;g("z","y","x",-1,-1,i,e,t,o,a,0),g("z","y","x",1,-1,i,e,-t,o,a,1),g("x","z","y",1,1,t,i,e,s,o,2),g("x","z","y",1,-1,t,i,-e,s,o,3),g("x","y","z",1,-1,t,e,i,s,a,4),g("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new pe(l,3)),this.setAttribute("normal",new pe(h,3)),this.setAttribute("uv",new pe(f,2));function g(v,m,p,x,_,y,D,b,w,A,E){const M=y/w,R=D/A,F=y/2,U=D/2,X=b/2,L=w+1,C=A+1;let W=0,H=0;const K=new $;for(let J=0;J<C;J++){const ot=J*R-U;for(let ft=0;ft<L;ft++){const vt=ft*M-F;K[v]=vt*x,K[m]=ot*_,K[p]=X,l.push(K.x,K.y,K.z),K[v]=0,K[m]=0,K[p]=b>0?1:-1,h.push(K.x,K.y,K.z),f.push(ft/w),f.push(1-J/A),W+=1}}for(let J=0;J<A;J++)for(let ot=0;ot<w;ot++){const ft=d+ot+L*J,vt=d+ot+L*(J+1),j=d+(ot+1)+L*(J+1),tt=d+(ot+1)+L*J;c.push(ft,vt,tt),c.push(vt,j,tt),H+=6}r.addGroup(u,H,E),u+=H,d+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ln(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ls(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Ye(n){const t={};for(let e=0;e<n.length;e++){const i=ls(n[e]);for(const s in i)t[s]=i[s]}return t}function kg(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Ud(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ae.workingColorSpace}const Ug={clone:ls,merge:Ye};var Fg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ng=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ai extends us{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Fg,this.fragmentShader=Ng,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ls(t.uniforms),this.uniformsGroups=kg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Fd extends Te{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new xe,this.projectionMatrix=new xe,this.projectionMatrixInverse=new xe,this.coordinateSystem=Vn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new $,ih=new Bt,sh=new Bt;class un extends Fd{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ns*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ns*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ns*2*Math.atan(Math.tan(ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Qn.x,Qn.y).multiplyScalar(-t/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Qn.x,Qn.y).multiplyScalar(-t/Qn.z)}getViewSize(t,e){return this.getViewBounds(t,ih,sh),e.subVectors(sh,ih)}setViewOffset(t,e,i,s,a,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ns*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;a+=o.offsetX*s/c,e-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(a+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Yi=-90,Zi=1;class zg extends Te{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new un(Yi,Zi,t,e);s.layers=this.layers,this.add(s);const a=new un(Yi,Zi,t,e);a.layers=this.layers,this.add(a);const o=new un(Yi,Zi,t,e);o.layers=this.layers,this.add(o);const r=new un(Yi,Zi,t,e);r.layers=this.layers,this.add(r);const c=new un(Yi,Zi,t,e);c.layers=this.layers,this.add(c);const l=new un(Yi,Zi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,o,r,c]=e;for(const l of e)this.remove(l);if(t===Vn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Za)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,o,r,c,l,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Nd extends qe{constructor(t,e,i,s,a,o,r,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:as,super(t,e,i,s,a,o,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Og extends Ri{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Nd(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Rn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ln(5,5,5),a=new ai({name:"CubemapFromEquirect",uniforms:ls(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Qe,blending:ni});a.uniforms.tEquirect.value=e;const o=new he(s,a),r=e.minFilter;return e.minFilter===Ei&&(e.minFilter=Rn),new zg(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(a)}}const Xo=new $,Bg=new $,Hg=new jt;class vi{constructor(t=new $(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Xo.subVectors(i,e).cross(Bg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Xo),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Hg.getNormalMatrix(t),s=this.coplanarPoint(Xo).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new eo,ma=new $;class Ic{constructor(t=new vi,e=new vi,i=new vi,s=new vi,a=new vi,o=new vi){this.planes=[t,e,i,s,a,o]}set(t,e,i,s,a,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(a),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Vn){const i=this.planes,s=t.elements,a=s[0],o=s[1],r=s[2],c=s[3],l=s[4],h=s[5],f=s[6],d=s[7],u=s[8],g=s[9],v=s[10],m=s[11],p=s[12],x=s[13],_=s[14],y=s[15];if(i[0].setComponents(c-a,d-l,m-u,y-p).normalize(),i[1].setComponents(c+a,d+l,m+u,y+p).normalize(),i[2].setComponents(c+o,d+h,m+g,y+x).normalize(),i[3].setComponents(c-o,d-h,m-g,y-x).normalize(),i[4].setComponents(c-r,d-f,m-v,y-_).normalize(),e===Vn)i[5].setComponents(c+r,d+f,m+v,y+_).normalize();else if(e===Za)i[5].setComponents(r,f,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(t){return ui.center.set(0,0,0),ui.radius=.7071067811865476,ui.applyMatrix4(t.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(ma.x=s.normal.x>0?t.max.x:t.min.x,ma.y=s.normal.y>0?t.max.y:t.min.y,ma.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ma)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function zd(){let n=null,t=!1,e=null,i=null;function s(a,o){e(a,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function Gg(n){const t=new WeakMap;function e(r,c){const l=r.array,h=r.usage,f=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),r.onUploadCallback();let u;if(l instanceof Float32Array)u=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=n.SHORT;else if(l instanceof Uint32Array)u=n.UNSIGNED_INT;else if(l instanceof Int32Array)u=n.INT;else if(l instanceof Int8Array)u=n.BYTE;else if(l instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,c,l){const h=c.array,f=c.updateRanges;if(n.bindBuffer(l,r),f.length===0)n.bufferSubData(l,0,h);else{f.sort((u,g)=>u.start-g.start);let d=0;for(let u=1;u<f.length;u++){const g=f[d],v=f[u];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,f[d]=v)}f.length=d+1;for(let u=0,g=f.length;u<g;u++){const v=f[u];n.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function a(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:s,remove:a,update:o}}class dn extends ze{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,o=e/2,r=Math.floor(i),c=Math.floor(s),l=r+1,h=c+1,f=t/r,d=e/c,u=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*d-o;for(let _=0;_<l;_++){const y=_*f-a;g.push(y,-x,0),v.push(0,0,1),m.push(_/r),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<r;x++){const _=x+l*p,y=x+l*(p+1),D=x+1+l*(p+1),b=x+1+l*p;u.push(_,y,b),u.push(y,D,b)}this.setIndex(u),this.setAttribute("position",new pe(g,3)),this.setAttribute("normal",new pe(v,3)),this.setAttribute("uv",new pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Vg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Xg=`#ifdef USE_ALPHAHASH
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
#endif`,Wg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$g=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qg=`#ifdef USE_AOMAP
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
#endif`,jg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Kg=`#ifdef USE_BATCHING
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
#endif`,Jg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,t0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,e0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,n0=`#ifdef USE_IRIDESCENCE
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
#endif`,i0=`#ifdef USE_BUMPMAP
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
#endif`,s0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,a0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,o0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,r0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,c0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,l0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,h0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,d0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,u0=`#define PI 3.141592653589793
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
} // validated`,f0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,p0=`vec3 transformedNormal = objectNormal;
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
#endif`,m0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,g0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,x0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,v0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_0="gl_FragColor = linearToOutputTexel( gl_FragColor );",y0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,M0=`#ifdef USE_ENVMAP
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
#endif`,S0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,b0=`#ifdef USE_ENVMAP
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
#endif`,E0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,w0=`#ifdef USE_ENVMAP
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
#endif`,A0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,T0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,R0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,C0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,P0=`#ifdef USE_GRADIENTMAP
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
}`,L0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,D0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,I0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,k0=`uniform bool receiveShadow;
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
#endif`,U0=`#ifdef USE_ENVMAP
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
#endif`,F0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,N0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,z0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,O0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,B0=`PhysicalMaterial material;
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
#endif`,H0=`struct PhysicalMaterial {
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
}`,G0=`
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
#endif`,V0=`#if defined( RE_IndirectDiffuse )
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
#endif`,X0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,W0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Y0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Z0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,q0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,j0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,K0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,J0=`#if defined( USE_POINTS_UV )
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
#endif`,Q0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,tx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ex=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ix=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sx=`#ifdef USE_MORPHTARGETS
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
#endif`,ax=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ox=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,rx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,cx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dx=`#ifdef USE_NORMALMAP
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
#endif`,ux=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,px=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,vx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_x=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,yx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ex=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,wx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ax=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Tx=`float getShadowMask() {
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
}`,Rx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cx=`#ifdef USE_SKINNING
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
#endif`,Px=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lx=`#ifdef USE_SKINNING
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
#endif`,Dx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ix=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ux=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fx=`#ifdef USE_TRANSMISSION
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
#endif`,Nx=`#ifdef USE_TRANSMISSION
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
#endif`,zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ox=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Hx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Gx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vx=`uniform sampler2D t2D;
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
}`,Xx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,$x=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zx=`#include <common>
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
}`,qx=`#if DEPTH_PACKING == 3200
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
}`,jx=`#define DISTANCE
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
}`,Kx=`#define DISTANCE
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
}`,Jx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tv=`uniform float scale;
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
}`,ev=`uniform vec3 diffuse;
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
}`,nv=`#include <common>
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
}`,iv=`uniform vec3 diffuse;
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
}`,sv=`#define LAMBERT
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
}`,av=`#define LAMBERT
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
}`,ov=`#define MATCAP
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
}`,rv=`#define MATCAP
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
}`,cv=`#define NORMAL
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
}`,lv=`#define NORMAL
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
}`,hv=`#define PHONG
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
}`,dv=`#define PHONG
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
}`,uv=`#define STANDARD
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
}`,fv=`#define STANDARD
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
}`,pv=`#define TOON
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
}`,mv=`#define TOON
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
}`,gv=`uniform float size;
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
}`,xv=`uniform vec3 diffuse;
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
}`,vv=`#include <common>
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
}`,_v=`uniform vec3 color;
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
}`,yv=`uniform float rotation;
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
}`,Mv=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:Vg,alphahash_pars_fragment:Xg,alphamap_fragment:Wg,alphamap_pars_fragment:$g,alphatest_fragment:Yg,alphatest_pars_fragment:Zg,aomap_fragment:qg,aomap_pars_fragment:jg,batching_pars_vertex:Kg,batching_vertex:Jg,begin_vertex:Qg,beginnormal_vertex:t0,bsdfs:e0,iridescence_fragment:n0,bumpmap_pars_fragment:i0,clipping_planes_fragment:s0,clipping_planes_pars_fragment:a0,clipping_planes_pars_vertex:o0,clipping_planes_vertex:r0,color_fragment:c0,color_pars_fragment:l0,color_pars_vertex:h0,color_vertex:d0,common:u0,cube_uv_reflection_fragment:f0,defaultnormal_vertex:p0,displacementmap_pars_vertex:m0,displacementmap_vertex:g0,emissivemap_fragment:x0,emissivemap_pars_fragment:v0,colorspace_fragment:_0,colorspace_pars_fragment:y0,envmap_fragment:M0,envmap_common_pars_fragment:S0,envmap_pars_fragment:b0,envmap_pars_vertex:E0,envmap_physical_pars_fragment:U0,envmap_vertex:w0,fog_vertex:A0,fog_pars_vertex:T0,fog_fragment:R0,fog_pars_fragment:C0,gradientmap_pars_fragment:P0,lightmap_pars_fragment:L0,lights_lambert_fragment:D0,lights_lambert_pars_fragment:I0,lights_pars_begin:k0,lights_toon_fragment:F0,lights_toon_pars_fragment:N0,lights_phong_fragment:z0,lights_phong_pars_fragment:O0,lights_physical_fragment:B0,lights_physical_pars_fragment:H0,lights_fragment_begin:G0,lights_fragment_maps:V0,lights_fragment_end:X0,logdepthbuf_fragment:W0,logdepthbuf_pars_fragment:$0,logdepthbuf_pars_vertex:Y0,logdepthbuf_vertex:Z0,map_fragment:q0,map_pars_fragment:j0,map_particle_fragment:K0,map_particle_pars_fragment:J0,metalnessmap_fragment:Q0,metalnessmap_pars_fragment:tx,morphinstance_vertex:ex,morphcolor_vertex:nx,morphnormal_vertex:ix,morphtarget_pars_vertex:sx,morphtarget_vertex:ax,normal_fragment_begin:ox,normal_fragment_maps:rx,normal_pars_fragment:cx,normal_pars_vertex:lx,normal_vertex:hx,normalmap_pars_fragment:dx,clearcoat_normal_fragment_begin:ux,clearcoat_normal_fragment_maps:fx,clearcoat_pars_fragment:px,iridescence_pars_fragment:mx,opaque_fragment:gx,packing:xx,premultiplied_alpha_fragment:vx,project_vertex:_x,dithering_fragment:yx,dithering_pars_fragment:Mx,roughnessmap_fragment:Sx,roughnessmap_pars_fragment:bx,shadowmap_pars_fragment:Ex,shadowmap_pars_vertex:wx,shadowmap_vertex:Ax,shadowmask_pars_fragment:Tx,skinbase_vertex:Rx,skinning_pars_vertex:Cx,skinning_vertex:Px,skinnormal_vertex:Lx,specularmap_fragment:Dx,specularmap_pars_fragment:Ix,tonemapping_fragment:kx,tonemapping_pars_fragment:Ux,transmission_fragment:Fx,transmission_pars_fragment:Nx,uv_pars_fragment:zx,uv_pars_vertex:Ox,uv_vertex:Bx,worldpos_vertex:Hx,background_vert:Gx,background_frag:Vx,backgroundCube_vert:Xx,backgroundCube_frag:Wx,cube_vert:$x,cube_frag:Yx,depth_vert:Zx,depth_frag:qx,distanceRGBA_vert:jx,distanceRGBA_frag:Kx,equirect_vert:Jx,equirect_frag:Qx,linedashed_vert:tv,linedashed_frag:ev,meshbasic_vert:nv,meshbasic_frag:iv,meshlambert_vert:sv,meshlambert_frag:av,meshmatcap_vert:ov,meshmatcap_frag:rv,meshnormal_vert:cv,meshnormal_frag:lv,meshphong_vert:hv,meshphong_frag:dv,meshphysical_vert:uv,meshphysical_frag:fv,meshtoon_vert:pv,meshtoon_frag:mv,points_vert:gv,points_frag:xv,shadow_vert:vv,shadow_frag:_v,sprite_vert:yv,sprite_frag:Mv},Lt={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new Bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new Bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},Tn={basic:{uniforms:Ye([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Ye([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Ye([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Ye([Lt.common,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.roughnessmap,Lt.metalnessmap,Lt.fog,Lt.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Ye([Lt.common,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.gradientmap,Lt.fog,Lt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Ye([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Ye([Lt.points,Lt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Ye([Lt.common,Lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Ye([Lt.common,Lt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Ye([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Ye([Lt.sprite,Lt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Ye([Lt.common,Lt.displacementmap,{referencePosition:{value:new $},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Ye([Lt.lights,Lt.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};Tn.physical={uniforms:Ye([Tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new Bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new Bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new Bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const ga={r:0,b:0,g:0},fi=new Pn,Sv=new xe;function bv(n,t,e,i,s,a,o){const r=new Zt(0);let c=a===!0?0:1,l,h,f=null,d=0,u=null;function g(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function v(x){let _=!1;const y=g(x);y===null?p(r,c):y&&y.isColor&&(p(y,1),_=!0);const D=n.xr.getEnvironmentBlendMode();D==="additive"?i.buffers.color.setClear(0,0,0,1,o):D==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,_){const y=g(_);y&&(y.isCubeTexture||y.mapping===Qa)?(h===void 0&&(h=new he(new Ln(1,1,1),new ai({name:"BackgroundCubeMaterial",uniforms:ls(Tn.backgroundCube.uniforms),vertexShader:Tn.backgroundCube.vertexShader,fragmentShader:Tn.backgroundCube.fragmentShader,side:Qe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),fi.copy(_.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Sv.makeRotationFromEuler(fi)),h.material.toneMapped=ae.getTransfer(y.colorSpace)!==de,(f!==y||d!==y.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=y,d=y.version,u=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new he(new dn(2,2),new ai({name:"BackgroundMaterial",uniforms:ls(Tn.background.uniforms),vertexShader:Tn.background.vertexShader,fragmentShader:Tn.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=ae.getTransfer(y.colorSpace)!==de,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||d!==y.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=y,d=y.version,u=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,_){x.getRGB(ga,Ud(n)),i.buffers.color.setClear(ga.r,ga.g,ga.b,_,o)}return{getClearColor:function(){return r},setClearColor:function(x,_=1){r.set(x),c=_,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(r,c)},render:v,addToRenderList:m}}function Ev(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,o=!1;function r(M,R,F,U,X){let L=!1;const C=f(U,F,R);a!==C&&(a=C,l(a.object)),L=u(M,U,F,X),L&&g(M,U,F,X),X!==null&&t.update(X,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,y(M,R,F,U),X!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function c(){return n.createVertexArray()}function l(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,R,F){const U=F.wireframe===!0;let X=i[M.id];X===void 0&&(X={},i[M.id]=X);let L=X[R.id];L===void 0&&(L={},X[R.id]=L);let C=L[U];return C===void 0&&(C=d(c()),L[U]=C),C}function d(M){const R=[],F=[],U=[];for(let X=0;X<e;X++)R[X]=0,F[X]=0,U[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:F,attributeDivisors:U,object:M,attributes:{},index:null}}function u(M,R,F,U){const X=a.attributes,L=R.attributes;let C=0;const W=F.getAttributes();for(const H in W)if(W[H].location>=0){const J=X[H];let ot=L[H];if(ot===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(ot=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(ot=M.instanceColor)),J===void 0||J.attribute!==ot||ot&&J.data!==ot.data)return!0;C++}return a.attributesNum!==C||a.index!==U}function g(M,R,F,U){const X={},L=R.attributes;let C=0;const W=F.getAttributes();for(const H in W)if(W[H].location>=0){let J=L[H];J===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(J=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(J=M.instanceColor));const ot={};ot.attribute=J,J&&J.data&&(ot.data=J.data),X[H]=ot,C++}a.attributes=X,a.attributesNum=C,a.index=U}function v(){const M=a.newAttributes;for(let R=0,F=M.length;R<F;R++)M[R]=0}function m(M){p(M,0)}function p(M,R){const F=a.newAttributes,U=a.enabledAttributes,X=a.attributeDivisors;F[M]=1,U[M]===0&&(n.enableVertexAttribArray(M),U[M]=1),X[M]!==R&&(n.vertexAttribDivisor(M,R),X[M]=R)}function x(){const M=a.newAttributes,R=a.enabledAttributes;for(let F=0,U=R.length;F<U;F++)R[F]!==M[F]&&(n.disableVertexAttribArray(F),R[F]=0)}function _(M,R,F,U,X,L,C){C===!0?n.vertexAttribIPointer(M,R,F,X,L):n.vertexAttribPointer(M,R,F,U,X,L)}function y(M,R,F,U){v();const X=U.attributes,L=F.getAttributes(),C=R.defaultAttributeValues;for(const W in L){const H=L[W];if(H.location>=0){let K=X[W];if(K===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(K=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(K=M.instanceColor)),K!==void 0){const J=K.normalized,ot=K.itemSize,ft=t.get(K);if(ft===void 0)continue;const vt=ft.buffer,j=ft.type,tt=ft.bytesPerElement,pt=j===n.INT||j===n.UNSIGNED_INT||K.gpuType===Ec;if(K.isInterleavedBufferAttribute){const Q=K.data,mt=Q.stride,It=K.offset;if(Q.isInstancedInterleavedBuffer){for(let At=0;At<H.locationSize;At++)p(H.location+At,Q.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let At=0;At<H.locationSize;At++)m(H.location+At);n.bindBuffer(n.ARRAY_BUFFER,vt);for(let At=0;At<H.locationSize;At++)_(H.location+At,ot/H.locationSize,j,J,mt*tt,(It+ot/H.locationSize*At)*tt,pt)}else{if(K.isInstancedBufferAttribute){for(let Q=0;Q<H.locationSize;Q++)p(H.location+Q,K.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Q=0;Q<H.locationSize;Q++)m(H.location+Q);n.bindBuffer(n.ARRAY_BUFFER,vt);for(let Q=0;Q<H.locationSize;Q++)_(H.location+Q,ot/H.locationSize,j,J,ot*tt,ot/H.locationSize*Q*tt,pt)}}else if(C!==void 0){const J=C[W];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(H.location,J);break;case 3:n.vertexAttrib3fv(H.location,J);break;case 4:n.vertexAttrib4fv(H.location,J);break;default:n.vertexAttrib1fv(H.location,J)}}}}x()}function D(){A();for(const M in i){const R=i[M];for(const F in R){const U=R[F];for(const X in U)h(U[X].object),delete U[X];delete R[F]}delete i[M]}}function b(M){if(i[M.id]===void 0)return;const R=i[M.id];for(const F in R){const U=R[F];for(const X in U)h(U[X].object),delete U[X];delete R[F]}delete i[M.id]}function w(M){for(const R in i){const F=i[R];if(F[M.id]===void 0)continue;const U=F[M.id];for(const X in U)h(U[X].object),delete U[X];delete F[M.id]}}function A(){E(),o=!0,a!==s&&(a=s,l(a.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:A,resetDefaultState:E,dispose:D,releaseStatesOfGeometry:b,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function wv(n,t,e){let i;function s(l){i=l}function a(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function o(l,h,f){f!==0&&(n.drawArraysInstanced(i,l,h,f),e.update(h,i,f))}function r(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,f);let u=0;for(let g=0;g<f;g++)u+=h[g];e.update(u,i,1)}function c(l,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{u.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,f);let g=0;for(let v=0;v<f;v++)g+=h[v]*d[v];e.update(g,i,1)}}this.setMode=s,this.render=a,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function Av(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(w){return!(w!==Mn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(w){const A=w===Vs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==Wn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==Gn&&!A)}function c(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:y,vertexTextures:D,maxSamples:b}}function Tv(n){const t=this;let e=null,i=0,s=!1,a=!1;const o=new vi,r=new jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const g=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!s||g===null||g.length===0||a&&!m)a?h(null):l();else{const x=a?0:i,_=x*4;let y=p.clippingState||null;c.value=y,y=h(g,d,_,u);for(let D=0;D!==_;++D)y[D]=e[D];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,g){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=u+v*4,x=d.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let _=0,y=u;_!==v;++_,y+=4)o.copy(f[_]).applyMatrix4(x,r),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function Rv(n){let t=new WeakMap;function e(o,r){return r===Pr?o.mapping=as:r===Lr&&(o.mapping=os),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Pr||r===Lr)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Og(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const r=o.target;r.removeEventListener("dispose",s);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class Od extends Fd{constructor(t=-1,e=1,i=1,s=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,o=i+t,r=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,o=a+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(a,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ji=4,ah=[.125,.215,.35,.446,.526,.582],Si=20,Wo=new Od,oh=new Zt;let $o=null,Yo=0,Zo=0,qo=!1;const _i=(1+Math.sqrt(5))/2,qi=1/_i,rh=[new $(-_i,qi,0),new $(_i,qi,0),new $(-qi,0,_i),new $(qi,0,_i),new $(0,_i,-qi),new $(0,_i,qi),new $(-1,1,-1),new $(1,1,-1),new $(-1,1,1),new $(1,1,1)];class ch{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){$o=this._renderer.getRenderTarget(),Yo=this._renderer.getActiveCubeFace(),Zo=this._renderer.getActiveMipmapLevel(),qo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget($o,Yo,Zo),this._renderer.xr.enabled=qo,t.scissorTest=!1,xa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===as||t.mapping===os?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),$o=this._renderer.getRenderTarget(),Yo=this._renderer.getActiveCubeFace(),Zo=this._renderer.getActiveMipmapLevel(),qo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Rn,minFilter:Rn,generateMipmaps:!1,type:Vs,format:Mn,colorSpace:hs,depthBuffer:!1},s=lh(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lh(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Cv(a)),this._blurMaterial=Pv(a,t,e)}return s}_compileMaterial(t){const e=new he(this._lodPlanes[0],t);this._renderer.compile(e,Wo)}_sceneToCubeUV(t,e,i,s){const r=new un(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(oh),h.toneMapping=ii,h.autoClear=!1;const u=new Je({name:"PMREM.Background",side:Qe,depthWrite:!1,depthTest:!1}),g=new he(new Ln,u);let v=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,v=!0):(u.color.copy(oh),v=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):x===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const _=this._cubeSize;xa(s,x*_,p>2?_:0,_,_),h.setRenderTarget(s),v&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===as||t.mapping===os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=dh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hh());const a=s?this._cubemapMaterial:this._equirectMaterial,o=new he(this._lodPlanes[0],a),r=a.uniforms;r.envMap.value=t;const c=this._cubeSize;xa(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,Wo)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const o=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),r=rh[(s-a-1)%rh.length];this._blur(t,a-1,a,o,r)}e.autoClear=i}_blur(t,e,i,s,a){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",a),this._halfBlur(o,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new he(this._lodPlanes[s],l),d=l.uniforms,u=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Si-1),v=a/g,m=isFinite(a)?1+Math.floor(h*v):Si;m>Si&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Si}`);const p=[];let x=0;for(let w=0;w<Si;++w){const A=w/v,E=Math.exp(-A*A/2);p.push(E),w===0?x+=E:w<m&&(x+=2*E)}for(let w=0;w<p.length;w++)p[w]=p[w]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:_}=this;d.dTheta.value=g,d.mipInt.value=_-i;const y=this._sizeLods[s],D=3*y*(s>_-Ji?s-_+Ji:0),b=4*(this._cubeSize-y);xa(e,D,b,3*y,2*y),c.setRenderTarget(e),c.render(f,Wo)}}function Cv(n){const t=[],e=[],i=[];let s=n;const a=n-Ji+1+ah.length;for(let o=0;o<a;o++){const r=Math.pow(2,s);e.push(r);let c=1/r;o>n-Ji?c=ah[o-n+Ji-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),h=-l,f=1+l,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,g=6,v=3,m=2,p=1,x=new Float32Array(v*g*u),_=new Float32Array(m*g*u),y=new Float32Array(p*g*u);for(let b=0;b<u;b++){const w=b%3*2/3-1,A=b>2?0:-1,E=[w,A,0,w+2/3,A,0,w+2/3,A+1,0,w,A,0,w+2/3,A+1,0,w,A+1,0];x.set(E,v*g*b),_.set(d,m*g*b);const M=[b,b,b,b,b,b];y.set(M,p*g*b)}const D=new ze;D.setAttribute("position",new tn(x,v)),D.setAttribute("uv",new tn(_,m)),D.setAttribute("faceIndex",new tn(y,p)),t.push(D),s>Ji&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function lh(n,t,e){const i=new Ri(n,t,e);return i.texture.mapping=Qa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function xa(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Pv(n,t,e){const i=new Float32Array(Si),s=new $(0,1,0);return new ai({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:kc(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function hh(){return new ai({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:kc(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function dh(){return new ai({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:kc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function kc(){return`

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
	`}function Lv(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===Pr||c===Lr,h=c===as||c===os;if(l||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new ch(n)),f=l?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return l&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new ch(n)),f=l?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",a),f.texture):null}}}return r}function s(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function a(r){const c=r.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function Dv(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&ws("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Iv(n,t,e,i){const s={},a=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}d.removeEventListener("dispose",o),delete s[d.id];const u=a.get(d);u&&(t.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(f){const d=f.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const v=u[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],n.ARRAY_BUFFER)}}function l(f){const d=[],u=f.index,g=f.attributes.position;let v=0;if(u!==null){const x=u.array;v=u.version;for(let _=0,y=x.length;_<y;_+=3){const D=x[_+0],b=x[_+1],w=x[_+2];d.push(D,b,b,w,w,D)}}else if(g!==void 0){const x=g.array;v=g.version;for(let _=0,y=x.length/3-1;_<y;_+=3){const D=_+0,b=_+1,w=_+2;d.push(D,b,b,w,w,D)}}else return;const m=new(Cd(d)?kd:Id)(d,1);m.version=v;const p=a.get(f);p&&t.remove(p),a.set(f,m)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&l(f)}else l(f);return a.get(f)}return{get:r,update:c,getWireframeAttribute:h}}function kv(n,t,e){let i;function s(d){i=d}let a,o;function r(d){a=d.type,o=d.bytesPerElement}function c(d,u){n.drawElements(i,u,a,d*o),e.update(u,i,1)}function l(d,u,g){g!==0&&(n.drawElementsInstanced(i,u,a,d*o,g),e.update(u,i,g))}function h(d,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,d,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(d,u,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,u[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,a,d,0,v,0,g);let p=0;for(let x=0;x<g;x++)p+=u[x]*v[x];e.update(p,i,1)}}this.setMode=s,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Uv(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(a/3);break;case n.LINES:e.lines+=r*(a/2);break;case n.LINE_STRIP:e.lines+=r*(a-1);break;case n.LINE_LOOP:e.lines+=r*a;break;case n.POINTS:e.points+=r*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Fv(n,t,e){const i=new WeakMap,s=new Se;function a(o,r,c){const l=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let M=function(){A.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],x=r.morphAttributes.normal||[],_=r.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),m===!0&&(y=3);let D=r.attributes.position.count*y,b=1;D>t.maxTextureSize&&(b=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const w=new Float32Array(D*b*4*f),A=new Ld(w,D,b,f);A.type=Gn,A.needsUpdate=!0;const E=y*4;for(let R=0;R<f;R++){const F=p[R],U=x[R],X=_[R],L=D*b*4*R;for(let C=0;C<F.count;C++){const W=C*E;g===!0&&(s.fromBufferAttribute(F,C),w[L+W+0]=s.x,w[L+W+1]=s.y,w[L+W+2]=s.z,w[L+W+3]=0),v===!0&&(s.fromBufferAttribute(U,C),w[L+W+4]=s.x,w[L+W+5]=s.y,w[L+W+6]=s.z,w[L+W+7]=0),m===!0&&(s.fromBufferAttribute(X,C),w[L+W+8]=s.x,w[L+W+9]=s.y,w[L+W+10]=s.z,w[L+W+11]=X.itemSize===4?s.w:1)}}d={count:f,texture:A,size:new Bt(D,b)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const v=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function Nv(n,t,e,i){let s=new WeakMap;function a(c){const l=i.render.frame,h=c.geometry,f=t.get(c,h);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return f}function o(){s=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:o}}class Bd extends qe{constructor(t,e,i,s,a,o,r,c,l,h=es){if(h!==es&&h!==cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===es&&(i=Ti),i===void 0&&h===cs&&(i=rs),super(null,s,a,o,r,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Sn,this.minFilter=c!==void 0?c:Sn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Hd=new qe,uh=new Bd(1,1),Gd=new Ld,Vd=new bg,Xd=new Nd,fh=[],ph=[],mh=new Float32Array(16),gh=new Float32Array(9),xh=new Float32Array(4);function fs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=fh[s];if(a===void 0&&(a=new Float32Array(s),fh[s]=a),t!==0){i.toArray(a,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(a,r)}return a}function De(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ie(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function no(n,t){let e=ph[t];e===void 0&&(e=new Int32Array(t),ph[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function zv(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Ov(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;n.uniform2fv(this.addr,t),Ie(e,t)}}function Bv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(De(e,t))return;n.uniform3fv(this.addr,t),Ie(e,t)}}function Hv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;n.uniform4fv(this.addr,t),Ie(e,t)}}function Gv(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(De(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,i))return;xh.set(i),n.uniformMatrix2fv(this.addr,!1,xh),Ie(e,i)}}function Vv(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(De(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,i))return;gh.set(i),n.uniformMatrix3fv(this.addr,!1,gh),Ie(e,i)}}function Xv(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(De(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(De(e,i))return;mh.set(i),n.uniformMatrix4fv(this.addr,!1,mh),Ie(e,i)}}function Wv(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function $v(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;n.uniform2iv(this.addr,t),Ie(e,t)}}function Yv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;n.uniform3iv(this.addr,t),Ie(e,t)}}function Zv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;n.uniform4iv(this.addr,t),Ie(e,t)}}function qv(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function jv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(De(e,t))return;n.uniform2uiv(this.addr,t),Ie(e,t)}}function Kv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(De(e,t))return;n.uniform3uiv(this.addr,t),Ie(e,t)}}function Jv(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(De(e,t))return;n.uniform4uiv(this.addr,t),Ie(e,t)}}function Qv(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(uh.compareFunction=Rd,a=uh):a=Hd,e.setTexture2D(t||a,s)}function t_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Vd,s)}function e_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Xd,s)}function n_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Gd,s)}function i_(n){switch(n){case 5126:return zv;case 35664:return Ov;case 35665:return Bv;case 35666:return Hv;case 35674:return Gv;case 35675:return Vv;case 35676:return Xv;case 5124:case 35670:return Wv;case 35667:case 35671:return $v;case 35668:case 35672:return Yv;case 35669:case 35673:return Zv;case 5125:return qv;case 36294:return jv;case 36295:return Kv;case 36296:return Jv;case 35678:case 36198:case 36298:case 36306:case 35682:return Qv;case 35679:case 36299:case 36307:return t_;case 35680:case 36300:case 36308:case 36293:return e_;case 36289:case 36303:case 36311:case 36292:return n_}}function s_(n,t){n.uniform1fv(this.addr,t)}function a_(n,t){const e=fs(t,this.size,2);n.uniform2fv(this.addr,e)}function o_(n,t){const e=fs(t,this.size,3);n.uniform3fv(this.addr,e)}function r_(n,t){const e=fs(t,this.size,4);n.uniform4fv(this.addr,e)}function c_(n,t){const e=fs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function l_(n,t){const e=fs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function h_(n,t){const e=fs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function d_(n,t){n.uniform1iv(this.addr,t)}function u_(n,t){n.uniform2iv(this.addr,t)}function f_(n,t){n.uniform3iv(this.addr,t)}function p_(n,t){n.uniform4iv(this.addr,t)}function m_(n,t){n.uniform1uiv(this.addr,t)}function g_(n,t){n.uniform2uiv(this.addr,t)}function x_(n,t){n.uniform3uiv(this.addr,t)}function v_(n,t){n.uniform4uiv(this.addr,t)}function __(n,t,e){const i=this.cache,s=t.length,a=no(e,s);De(i,a)||(n.uniform1iv(this.addr,a),Ie(i,a));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Hd,a[o])}function y_(n,t,e){const i=this.cache,s=t.length,a=no(e,s);De(i,a)||(n.uniform1iv(this.addr,a),Ie(i,a));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Vd,a[o])}function M_(n,t,e){const i=this.cache,s=t.length,a=no(e,s);De(i,a)||(n.uniform1iv(this.addr,a),Ie(i,a));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Xd,a[o])}function S_(n,t,e){const i=this.cache,s=t.length,a=no(e,s);De(i,a)||(n.uniform1iv(this.addr,a),Ie(i,a));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Gd,a[o])}function b_(n){switch(n){case 5126:return s_;case 35664:return a_;case 35665:return o_;case 35666:return r_;case 35674:return c_;case 35675:return l_;case 35676:return h_;case 5124:case 35670:return d_;case 35667:case 35671:return u_;case 35668:case 35672:return f_;case 35669:case 35673:return p_;case 5125:return m_;case 36294:return g_;case 36295:return x_;case 36296:return v_;case 35678:case 36198:case 36298:case 36306:case 35682:return __;case 35679:case 36299:case 36307:return y_;case 35680:case 36300:case 36308:case 36293:return M_;case 36289:case 36303:case 36311:case 36292:return S_}}class E_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=i_(e.type)}}class w_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=b_(e.type)}}class A_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,o=s.length;a!==o;++a){const r=s[a];r.setValue(t,e[r.id],i)}}}const jo=/(\w+)(\])?(\[|\.)?/g;function vh(n,t){n.seq.push(t),n.map[t.id]=t}function T_(n,t,e){const i=n.name,s=i.length;for(jo.lastIndex=0;;){const a=jo.exec(i),o=jo.lastIndex;let r=a[1];const c=a[2]==="]",l=a[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===s){vh(e,l===void 0?new E_(r,n,t):new w_(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new A_(r),vh(e,f)),e=f}}}class ka{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),o=t.getUniformLocation(e,a.name);T_(a,o,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,o=e.length;a!==o;++a){const r=e[a],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const o=t[s];o.id in e&&i.push(o)}return i}}function _h(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const R_=37297;let C_=0;function P_(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let o=s;o<a;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const yh=new jt;function L_(n){ae._getMatrix(yh,ae.workingColorSpace,n);const t=`mat3( ${yh.elements.map(e=>e.toFixed(4))} )`;switch(ae.getTransfer(n)){case to:return[t,"LinearTransferOETF"];case de:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Mh(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+P_(n.getShaderSource(t),o)}else return s}function D_(n,t){const e=L_(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function I_(n,t){let e;switch(t){case Um:e="Linear";break;case Fm:e="Reinhard";break;case Nm:e="Cineon";break;case zm:e="ACESFilmic";break;case Bm:e="AgX";break;case Hm:e="Neutral";break;case Om:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const va=new $;function k_(){ae.getLuminanceCoefficients(va);const n=va.x.toFixed(4),t=va.y.toFixed(4),e=va.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function U_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(As).join(`
`)}function F_(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function N_(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),o=a.name;let r=1;a.type===n.FLOAT_MAT2&&(r=2),a.type===n.FLOAT_MAT3&&(r=3),a.type===n.FLOAT_MAT4&&(r=4),e[o]={type:a.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function As(n){return n!==""}function Sh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function bh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const z_=/^[ \t]*#include +<([\w\d./]+)>/gm;function oc(n){return n.replace(z_,B_)}const O_=new Map;function B_(n,t){let e=Kt[t];if(e===void 0){const i=O_.get(t);if(i!==void 0)e=Kt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return oc(e)}const H_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Eh(n){return n.replace(H_,G_)}function G_(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function wh(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function V_(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===pd?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===md?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===On&&(t="SHADOWMAP_TYPE_VSM"),t}function X_(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case as:case os:t="ENVMAP_TYPE_CUBE";break;case Qa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function W_(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case os:t="ENVMAP_MODE_REFRACTION";break}return t}function $_(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case bc:t="ENVMAP_BLENDING_MULTIPLY";break;case Im:t="ENVMAP_BLENDING_MIX";break;case km:t="ENVMAP_BLENDING_ADD";break}return t}function Y_(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Z_(n,t,e,i){const s=n.getContext(),a=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=V_(e),l=X_(e),h=W_(e),f=$_(e),d=Y_(e),u=U_(e),g=F_(a),v=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(As).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(As).join(`
`),p.length>0&&(p+=`
`)):(m=[wh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(As).join(`
`),p=[wh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ii?"#define TONE_MAPPING":"",e.toneMapping!==ii?Kt.tonemapping_pars_fragment:"",e.toneMapping!==ii?I_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,D_("linearToOutputTexel",e.outputColorSpace),k_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(As).join(`
`)),o=oc(o),o=Sh(o,e),o=bh(o,e),r=oc(r),r=Sh(r,e),r=bh(r,e),o=Eh(o),r=Eh(r),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Fl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Fl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=x+m+o,y=x+p+r,D=_h(s,s.VERTEX_SHADER,_),b=_h(s,s.FRAGMENT_SHADER,y);s.attachShader(v,D),s.attachShader(v,b),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function w(R){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(v).trim(),U=s.getShaderInfoLog(D).trim(),X=s.getShaderInfoLog(b).trim();let L=!0,C=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,D,b);else{const W=Mh(s,D,"vertex"),H=Mh(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+F+`
`+W+`
`+H)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(U===""||X==="")&&(C=!1);C&&(R.diagnostics={runnable:L,programLog:F,vertexShader:{log:U,prefix:m},fragmentShader:{log:X,prefix:p}})}s.deleteShader(D),s.deleteShader(b),A=new ka(s,v),E=N_(s,v)}let A;this.getUniforms=function(){return A===void 0&&w(this),A};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,R_)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=C_++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=D,this.fragmentShader=b,this}let q_=0;class j_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new K_(t),e.set(t,i)),i}}class K_{constructor(t){this.id=q_++,this.code=t,this.usedTimes=0}}function J_(n,t,e,i,s,a,o){const r=new Dc,c=new j_,l=new Set,h=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let u=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(E){return l.add(E),E===0?"uv":`uv${E}`}function m(E,M,R,F,U){const X=F.fog,L=U.geometry,C=E.isMeshStandardMaterial?F.environment:null,W=(E.isMeshStandardMaterial?e:t).get(E.envMap||C),H=W&&W.mapping===Qa?W.image.height:null,K=g[E.type];E.precision!==null&&(u=s.getMaxPrecision(E.precision),u!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",u,"instead."));const J=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,ot=J!==void 0?J.length:0;let ft=0;L.morphAttributes.position!==void 0&&(ft=1),L.morphAttributes.normal!==void 0&&(ft=2),L.morphAttributes.color!==void 0&&(ft=3);let vt,j,tt,pt;if(K){const Yt=Tn[K];vt=Yt.vertexShader,j=Yt.fragmentShader}else vt=E.vertexShader,j=E.fragmentShader,c.update(E),tt=c.getVertexShaderID(E),pt=c.getFragmentShaderID(E);const Q=n.getRenderTarget(),mt=n.state.buffers.depth.getReversed(),It=U.isInstancedMesh===!0,At=U.isBatchedMesh===!0,Ot=!!E.map,St=!!E.matcap,Mt=!!W,G=!!E.aoMap,qt=!!E.lightMap,Ut=!!E.bumpMap,Ft=!!E.normalMap,bt=!!E.displacementMap,yt=!!E.emissiveMap,Tt=!!E.metalnessMap,P=!!E.roughnessMap,S=E.anisotropy>0,Y=E.clearcoat>0,rt=E.dispersion>0,ct=E.iridescence>0,at=E.sheen>0,Nt=E.transmission>0,et=S&&!!E.anisotropyMap,gt=Y&&!!E.clearcoatMap,Gt=Y&&!!E.clearcoatNormalMap,nt=Y&&!!E.clearcoatRoughnessMap,_t=ct&&!!E.iridescenceMap,B=ct&&!!E.iridescenceThicknessMap,it=at&&!!E.sheenColorMap,ut=at&&!!E.sheenRoughnessMap,Et=!!E.specularMap,zt=!!E.specularColorMap,Xt=!!E.specularIntensityMap,z=Nt&&!!E.transmissionMap,O=Nt&&!!E.thicknessMap,V=!!E.gradientMap,q=!!E.alphaMap,lt=E.alphaTest>0,ht=!!E.alphaHash,Rt=!!E.extensions;let Vt=ii;E.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Vt=n.toneMapping);const Jt={shaderID:K,shaderType:E.type,shaderName:E.name,vertexShader:vt,fragmentShader:j,defines:E.defines,customVertexShaderID:tt,customFragmentShaderID:pt,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:u,batching:At,batchingColor:At&&U._colorsTexture!==null,instancing:It,instancingColor:It&&U.instanceColor!==null,instancingMorph:It&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:hs,alphaToCoverage:!!E.alphaToCoverage,map:Ot,matcap:St,envMap:Mt,envMapMode:Mt&&W.mapping,envMapCubeUVHeight:H,aoMap:G,lightMap:qt,bumpMap:Ut,normalMap:Ft,displacementMap:d&&bt,emissiveMap:yt,normalMapObjectSpace:Ft&&E.normalMapType===Wm,normalMapTangentSpace:Ft&&E.normalMapType===Td,metalnessMap:Tt,roughnessMap:P,anisotropy:S,anisotropyMap:et,clearcoat:Y,clearcoatMap:gt,clearcoatNormalMap:Gt,clearcoatRoughnessMap:nt,dispersion:rt,iridescence:ct,iridescenceMap:_t,iridescenceThicknessMap:B,sheen:at,sheenColorMap:it,sheenRoughnessMap:ut,specularMap:Et,specularColorMap:zt,specularIntensityMap:Xt,transmission:Nt,transmissionMap:z,thicknessMap:O,gradientMap:V,opaque:E.transparent===!1&&E.blending===ts&&E.alphaToCoverage===!1,alphaMap:q,alphaTest:lt,alphaHash:ht,combine:E.combine,mapUv:Ot&&v(E.map.channel),aoMapUv:G&&v(E.aoMap.channel),lightMapUv:qt&&v(E.lightMap.channel),bumpMapUv:Ut&&v(E.bumpMap.channel),normalMapUv:Ft&&v(E.normalMap.channel),displacementMapUv:bt&&v(E.displacementMap.channel),emissiveMapUv:yt&&v(E.emissiveMap.channel),metalnessMapUv:Tt&&v(E.metalnessMap.channel),roughnessMapUv:P&&v(E.roughnessMap.channel),anisotropyMapUv:et&&v(E.anisotropyMap.channel),clearcoatMapUv:gt&&v(E.clearcoatMap.channel),clearcoatNormalMapUv:Gt&&v(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&v(E.clearcoatRoughnessMap.channel),iridescenceMapUv:_t&&v(E.iridescenceMap.channel),iridescenceThicknessMapUv:B&&v(E.iridescenceThicknessMap.channel),sheenColorMapUv:it&&v(E.sheenColorMap.channel),sheenRoughnessMapUv:ut&&v(E.sheenRoughnessMap.channel),specularMapUv:Et&&v(E.specularMap.channel),specularColorMapUv:zt&&v(E.specularColorMap.channel),specularIntensityMapUv:Xt&&v(E.specularIntensityMap.channel),transmissionMapUv:z&&v(E.transmissionMap.channel),thicknessMapUv:O&&v(E.thicknessMap.channel),alphaMapUv:q&&v(E.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Ft||S),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!L.attributes.uv&&(Ot||q),fog:!!X,useFog:E.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:mt,skinning:U.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:ot,morphTextureStride:ft,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:Vt,decodeVideoTexture:Ot&&E.map.isVideoTexture===!0&&ae.getTransfer(E.map.colorSpace)===de,decodeVideoTextureEmissive:yt&&E.emissiveMap.isVideoTexture===!0&&ae.getTransfer(E.emissiveMap.colorSpace)===de,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Le,flipSided:E.side===Qe,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Rt&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Rt&&E.extensions.multiDraw===!0||At)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Jt.vertexUv1s=l.has(1),Jt.vertexUv2s=l.has(2),Jt.vertexUv3s=l.has(3),l.clear(),Jt}function p(E){const M=[];if(E.shaderID?M.push(E.shaderID):(M.push(E.customVertexShaderID),M.push(E.customFragmentShaderID)),E.defines!==void 0)for(const R in E.defines)M.push(R),M.push(E.defines[R]);return E.isRawShaderMaterial===!1&&(x(M,E),_(M,E),M.push(n.outputColorSpace)),M.push(E.customProgramCacheKey),M.join()}function x(E,M){E.push(M.precision),E.push(M.outputColorSpace),E.push(M.envMapMode),E.push(M.envMapCubeUVHeight),E.push(M.mapUv),E.push(M.alphaMapUv),E.push(M.lightMapUv),E.push(M.aoMapUv),E.push(M.bumpMapUv),E.push(M.normalMapUv),E.push(M.displacementMapUv),E.push(M.emissiveMapUv),E.push(M.metalnessMapUv),E.push(M.roughnessMapUv),E.push(M.anisotropyMapUv),E.push(M.clearcoatMapUv),E.push(M.clearcoatNormalMapUv),E.push(M.clearcoatRoughnessMapUv),E.push(M.iridescenceMapUv),E.push(M.iridescenceThicknessMapUv),E.push(M.sheenColorMapUv),E.push(M.sheenRoughnessMapUv),E.push(M.specularMapUv),E.push(M.specularColorMapUv),E.push(M.specularIntensityMapUv),E.push(M.transmissionMapUv),E.push(M.thicknessMapUv),E.push(M.combine),E.push(M.fogExp2),E.push(M.sizeAttenuation),E.push(M.morphTargetsCount),E.push(M.morphAttributeCount),E.push(M.numDirLights),E.push(M.numPointLights),E.push(M.numSpotLights),E.push(M.numSpotLightMaps),E.push(M.numHemiLights),E.push(M.numRectAreaLights),E.push(M.numDirLightShadows),E.push(M.numPointLightShadows),E.push(M.numSpotLightShadows),E.push(M.numSpotLightShadowsWithMaps),E.push(M.numLightProbes),E.push(M.shadowMapType),E.push(M.toneMapping),E.push(M.numClippingPlanes),E.push(M.numClipIntersection),E.push(M.depthPacking)}function _(E,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),E.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),E.push(r.mask)}function y(E){const M=g[E.type];let R;if(M){const F=Tn[M];R=Ug.clone(F.uniforms)}else R=E.uniforms;return R}function D(E,M){let R;for(let F=0,U=h.length;F<U;F++){const X=h[F];if(X.cacheKey===M){R=X,++R.usedTimes;break}}return R===void 0&&(R=new Z_(n,M,E,a),h.push(R)),R}function b(E){if(--E.usedTimes===0){const M=h.indexOf(E);h[M]=h[h.length-1],h.pop(),E.destroy()}}function w(E){c.remove(E)}function A(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:D,releaseProgram:b,releaseShaderCache:w,programs:h,dispose:A}}function Q_(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function s(o,r,c){n.get(o)[r]=c}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function ty(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Ah(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Th(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function o(f,d,u,g,v,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:g,renderOrder:f.renderOrder,z:v,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=v,p.group=m),t++,p}function r(f,d,u,g,v,m){const p=o(f,d,u,g,v,m);u.transmission>0?i.push(p):u.transparent===!0?s.push(p):e.push(p)}function c(f,d,u,g,v,m){const p=o(f,d,u,g,v,m);u.transmission>0?i.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function l(f,d){e.length>1&&e.sort(f||ty),i.length>1&&i.sort(d||Ah),s.length>1&&s.sort(d||Ah)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:r,unshift:c,finish:h,sort:l}}function ey(){let n=new WeakMap;function t(i,s){const a=n.get(i);let o;return a===void 0?(o=new Th,n.set(i,[o])):s>=a.length?(o=new Th,a.push(o)):o=a[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function ny(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new $,color:new Zt};break;case"SpotLight":e={position:new $,direction:new $,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new $,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new $,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new $,halfWidth:new $,halfHeight:new $};break}return n[t.id]=e,e}}}function iy(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let sy=0;function ay(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function oy(n){const t=new ny,e=iy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new $);const s=new $,a=new xe,o=new xe;function r(l){let h=0,f=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let u=0,g=0,v=0,m=0,p=0,x=0,_=0,y=0,D=0,b=0,w=0;l.sort(ay);for(let E=0,M=l.length;E<M;E++){const R=l[E],F=R.color,U=R.intensity,X=R.distance,L=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=F.r*U,f+=F.g*U,d+=F.b*U;else if(R.isLightProbe){for(let C=0;C<9;C++)i.probe[C].addScaledVector(R.sh.coefficients[C],U);w++}else if(R.isDirectionalLight){const C=t.get(R);if(C.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const W=R.shadow,H=e.get(R);H.shadowIntensity=W.intensity,H.shadowBias=W.bias,H.shadowNormalBias=W.normalBias,H.shadowRadius=W.radius,H.shadowMapSize=W.mapSize,i.directionalShadow[u]=H,i.directionalShadowMap[u]=L,i.directionalShadowMatrix[u]=R.shadow.matrix,x++}i.directional[u]=C,u++}else if(R.isSpotLight){const C=t.get(R);C.position.setFromMatrixPosition(R.matrixWorld),C.color.copy(F).multiplyScalar(U),C.distance=X,C.coneCos=Math.cos(R.angle),C.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),C.decay=R.decay,i.spot[v]=C;const W=R.shadow;if(R.map&&(i.spotLightMap[D]=R.map,D++,W.updateMatrices(R),R.castShadow&&b++),i.spotLightMatrix[v]=W.matrix,R.castShadow){const H=e.get(R);H.shadowIntensity=W.intensity,H.shadowBias=W.bias,H.shadowNormalBias=W.normalBias,H.shadowRadius=W.radius,H.shadowMapSize=W.mapSize,i.spotShadow[v]=H,i.spotShadowMap[v]=L,y++}v++}else if(R.isRectAreaLight){const C=t.get(R);C.color.copy(F).multiplyScalar(U),C.halfWidth.set(R.width*.5,0,0),C.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=C,m++}else if(R.isPointLight){const C=t.get(R);if(C.color.copy(R.color).multiplyScalar(R.intensity),C.distance=R.distance,C.decay=R.decay,R.castShadow){const W=R.shadow,H=e.get(R);H.shadowIntensity=W.intensity,H.shadowBias=W.bias,H.shadowNormalBias=W.normalBias,H.shadowRadius=W.radius,H.shadowMapSize=W.mapSize,H.shadowCameraNear=W.camera.near,H.shadowCameraFar=W.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=L,i.pointShadowMatrix[g]=R.shadow.matrix,_++}i.point[g]=C,g++}else if(R.isHemisphereLight){const C=t.get(R);C.skyColor.copy(R.color).multiplyScalar(U),C.groundColor.copy(R.groundColor).multiplyScalar(U),i.hemi[p]=C,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Lt.LTC_FLOAT_1,i.rectAreaLTC2=Lt.LTC_FLOAT_2):(i.rectAreaLTC1=Lt.LTC_HALF_1,i.rectAreaLTC2=Lt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const A=i.hash;(A.directionalLength!==u||A.pointLength!==g||A.spotLength!==v||A.rectAreaLength!==m||A.hemiLength!==p||A.numDirectionalShadows!==x||A.numPointShadows!==_||A.numSpotShadows!==y||A.numSpotMaps!==D||A.numLightProbes!==w)&&(i.directional.length=u,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=y+D-b,i.spotLightMap.length=D,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=w,A.directionalLength=u,A.pointLength=g,A.spotLength=v,A.rectAreaLength=m,A.hemiLength=p,A.numDirectionalShadows=x,A.numPointShadows=_,A.numSpotShadows=y,A.numSpotMaps=D,A.numLightProbes=w,i.version=sy++)}function c(l,h){let f=0,d=0,u=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const _=l[p];if(_.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),f++}else if(_.isSpotLight){const y=i.spot[u];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(_.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(m),o.identity(),a.copy(_.matrixWorld),a.premultiply(m),o.extractRotation(a),y.halfWidth.set(_.width*.5,0,0),y.halfHeight.set(0,_.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(_.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(_.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:r,setupView:c,state:i}}function Rh(n){const t=new oy(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function a(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:r,setupLightsView:c,pushLight:a,pushShadow:o}}function ry(n){let t=new WeakMap;function e(s,a=0){const o=t.get(s);let r;return o===void 0?(r=new Rh(n),t.set(s,[r])):a>=o.length?(r=new Rh(n),o.push(r)):r=o[a],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class cy extends us{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Vm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ly extends us{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const hy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dy=`uniform sampler2D shadow_pass;
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
}`;function uy(n,t,e){let i=new Ic;const s=new Bt,a=new Bt,o=new Se,r=new cy({depthPacking:Xm}),c=new ly,l={},h=e.maxTextureSize,f={[si]:Qe,[Qe]:si,[Le]:Le},d=new ai({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Bt},radius:{value:4}},vertexShader:hy,fragmentShader:dy}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const g=new ze;g.setAttribute("position",new tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new he(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pd;let p=this.type;this.render=function(b,w,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const E=n.getRenderTarget(),M=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),F=n.state;F.setBlending(ni),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const U=p!==On&&this.type===On,X=p===On&&this.type!==On;for(let L=0,C=b.length;L<C;L++){const W=b[L],H=W.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const K=H.getFrameExtents();if(s.multiply(K),a.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/K.x),s.x=a.x*K.x,H.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/K.y),s.y=a.y*K.y,H.mapSize.y=a.y)),H.map===null||U===!0||X===!0){const ot=this.type!==On?{minFilter:Sn,magFilter:Sn}:{};H.map!==null&&H.map.dispose(),H.map=new Ri(s.x,s.y,ot),H.map.texture.name=W.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const J=H.getViewportCount();for(let ot=0;ot<J;ot++){const ft=H.getViewport(ot);o.set(a.x*ft.x,a.y*ft.y,a.x*ft.z,a.y*ft.w),F.viewport(o),H.updateMatrices(W,ot),i=H.getFrustum(),y(w,A,H.camera,W,this.type)}H.isPointLightShadow!==!0&&this.type===On&&x(H,A),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(E,M,R)};function x(b,w){const A=t.update(v);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Ri(s.x,s.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(w,null,A,d,v,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(w,null,A,u,v,null)}function _(b,w,A,E){let M=null;const R=A.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)M=R;else if(M=A.isPointLight===!0?c:r,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const F=M.uuid,U=w.uuid;let X=l[F];X===void 0&&(X={},l[F]=X);let L=X[U];L===void 0&&(L=M.clone(),X[U]=L,w.addEventListener("dispose",D)),M=L}if(M.visible=w.visible,M.wireframe=w.wireframe,E===On?M.side=w.shadowSide!==null?w.shadowSide:w.side:M.side=w.shadowSide!==null?w.shadowSide:f[w.side],M.alphaMap=w.alphaMap,M.alphaTest=w.alphaTest,M.map=w.map,M.clipShadows=w.clipShadows,M.clippingPlanes=w.clippingPlanes,M.clipIntersection=w.clipIntersection,M.displacementMap=w.displacementMap,M.displacementScale=w.displacementScale,M.displacementBias=w.displacementBias,M.wireframeLinewidth=w.wireframeLinewidth,M.linewidth=w.linewidth,A.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=n.properties.get(M);F.light=A}return M}function y(b,w,A,E,M){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===On)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,b.matrixWorld);const U=t.update(b),X=b.material;if(Array.isArray(X)){const L=U.groups;for(let C=0,W=L.length;C<W;C++){const H=L[C],K=X[H.materialIndex];if(K&&K.visible){const J=_(b,K,E,M);b.onBeforeShadow(n,b,w,A,U,J,H),n.renderBufferDirect(A,null,U,J,b,H),b.onAfterShadow(n,b,w,A,U,J,H)}}}else if(X.visible){const L=_(b,X,E,M);b.onBeforeShadow(n,b,w,A,U,L,null),n.renderBufferDirect(A,null,U,L,b,null),b.onAfterShadow(n,b,w,A,U,L,null)}}const F=b.children;for(let U=0,X=F.length;U<X;U++)y(F[U],w,A,E,M)}function D(b){b.target.removeEventListener("dispose",D);for(const A in l){const E=l[A],M=b.target.uuid;M in E&&(E[M].dispose(),delete E[M])}}}const fy={[br]:Er,[wr]:Rr,[Ar]:Cr,[ss]:Tr,[Er]:br,[Rr]:wr,[Cr]:Ar,[Tr]:ss};function py(n,t){function e(){let z=!1;const O=new Se;let V=null;const q=new Se(0,0,0,0);return{setMask:function(lt){V!==lt&&!z&&(n.colorMask(lt,lt,lt,lt),V=lt)},setLocked:function(lt){z=lt},setClear:function(lt,ht,Rt,Vt,Jt){Jt===!0&&(lt*=Vt,ht*=Vt,Rt*=Vt),O.set(lt,ht,Rt,Vt),q.equals(O)===!1&&(n.clearColor(lt,ht,Rt,Vt),q.copy(O))},reset:function(){z=!1,V=null,q.set(-1,0,0,0)}}}function i(){let z=!1,O=!1,V=null,q=null,lt=null;return{setReversed:function(ht){if(O!==ht){const Rt=t.get("EXT_clip_control");O?Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.ZERO_TO_ONE_EXT):Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.NEGATIVE_ONE_TO_ONE_EXT);const Vt=lt;lt=null,this.setClear(Vt)}O=ht},getReversed:function(){return O},setTest:function(ht){ht?Q(n.DEPTH_TEST):mt(n.DEPTH_TEST)},setMask:function(ht){V!==ht&&!z&&(n.depthMask(ht),V=ht)},setFunc:function(ht){if(O&&(ht=fy[ht]),q!==ht){switch(ht){case br:n.depthFunc(n.NEVER);break;case Er:n.depthFunc(n.ALWAYS);break;case wr:n.depthFunc(n.LESS);break;case ss:n.depthFunc(n.LEQUAL);break;case Ar:n.depthFunc(n.EQUAL);break;case Tr:n.depthFunc(n.GEQUAL);break;case Rr:n.depthFunc(n.GREATER);break;case Cr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}q=ht}},setLocked:function(ht){z=ht},setClear:function(ht){lt!==ht&&(O&&(ht=1-ht),n.clearDepth(ht),lt=ht)},reset:function(){z=!1,V=null,q=null,lt=null,O=!1}}}function s(){let z=!1,O=null,V=null,q=null,lt=null,ht=null,Rt=null,Vt=null,Jt=null;return{setTest:function(Yt){z||(Yt?Q(n.STENCIL_TEST):mt(n.STENCIL_TEST))},setMask:function(Yt){O!==Yt&&!z&&(n.stencilMask(Yt),O=Yt)},setFunc:function(Yt,oe,ve){(V!==Yt||q!==oe||lt!==ve)&&(n.stencilFunc(Yt,oe,ve),V=Yt,q=oe,lt=ve)},setOp:function(Yt,oe,ve){(ht!==Yt||Rt!==oe||Vt!==ve)&&(n.stencilOp(Yt,oe,ve),ht=Yt,Rt=oe,Vt=ve)},setLocked:function(Yt){z=Yt},setClear:function(Yt){Jt!==Yt&&(n.clearStencil(Yt),Jt=Yt)},reset:function(){z=!1,O=null,V=null,q=null,lt=null,ht=null,Rt=null,Vt=null,Jt=null}}}const a=new e,o=new i,r=new s,c=new WeakMap,l=new WeakMap;let h={},f={},d=new WeakMap,u=[],g=null,v=!1,m=null,p=null,x=null,_=null,y=null,D=null,b=null,w=new Zt(0,0,0),A=0,E=!1,M=null,R=null,F=null,U=null,X=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let C=!1,W=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(H)[1]),C=W>=1):H.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),C=W>=2);let K=null,J={};const ot=n.getParameter(n.SCISSOR_BOX),ft=n.getParameter(n.VIEWPORT),vt=new Se().fromArray(ot),j=new Se().fromArray(ft);function tt(z,O,V,q){const lt=new Uint8Array(4),ht=n.createTexture();n.bindTexture(z,ht),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Rt=0;Rt<V;Rt++)z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?n.texImage3D(O,0,n.RGBA,1,1,q,0,n.RGBA,n.UNSIGNED_BYTE,lt):n.texImage2D(O+Rt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,lt);return ht}const pt={};pt[n.TEXTURE_2D]=tt(n.TEXTURE_2D,n.TEXTURE_2D,1),pt[n.TEXTURE_CUBE_MAP]=tt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[n.TEXTURE_2D_ARRAY]=tt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),pt[n.TEXTURE_3D]=tt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),r.setClear(0),Q(n.DEPTH_TEST),o.setFunc(ss),Ut(!1),Ft(Pl),Q(n.CULL_FACE),G(ni);function Q(z){h[z]!==!0&&(n.enable(z),h[z]=!0)}function mt(z){h[z]!==!1&&(n.disable(z),h[z]=!1)}function It(z,O){return f[z]!==O?(n.bindFramebuffer(z,O),f[z]=O,z===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=O),z===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=O),!0):!1}function At(z,O){let V=u,q=!1;if(z){V=d.get(O),V===void 0&&(V=[],d.set(O,V));const lt=z.textures;if(V.length!==lt.length||V[0]!==n.COLOR_ATTACHMENT0){for(let ht=0,Rt=lt.length;ht<Rt;ht++)V[ht]=n.COLOR_ATTACHMENT0+ht;V.length=lt.length,q=!0}}else V[0]!==n.BACK&&(V[0]=n.BACK,q=!0);q&&n.drawBuffers(V)}function Ot(z){return g!==z?(n.useProgram(z),g=z,!0):!1}const St={[Mi]:n.FUNC_ADD,[gm]:n.FUNC_SUBTRACT,[xm]:n.FUNC_REVERSE_SUBTRACT};St[vm]=n.MIN,St[_m]=n.MAX;const Mt={[ym]:n.ZERO,[Mm]:n.ONE,[Sm]:n.SRC_COLOR,[Mr]:n.SRC_ALPHA,[Rm]:n.SRC_ALPHA_SATURATE,[Am]:n.DST_COLOR,[Em]:n.DST_ALPHA,[bm]:n.ONE_MINUS_SRC_COLOR,[Sr]:n.ONE_MINUS_SRC_ALPHA,[Tm]:n.ONE_MINUS_DST_COLOR,[wm]:n.ONE_MINUS_DST_ALPHA,[Cm]:n.CONSTANT_COLOR,[Pm]:n.ONE_MINUS_CONSTANT_COLOR,[Lm]:n.CONSTANT_ALPHA,[Dm]:n.ONE_MINUS_CONSTANT_ALPHA};function G(z,O,V,q,lt,ht,Rt,Vt,Jt,Yt){if(z===ni){v===!0&&(mt(n.BLEND),v=!1);return}if(v===!1&&(Q(n.BLEND),v=!0),z!==mm){if(z!==m||Yt!==E){if((p!==Mi||y!==Mi)&&(n.blendEquation(n.FUNC_ADD),p=Mi,y=Mi),Yt)switch(z){case ts:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ll:n.blendFunc(n.ONE,n.ONE);break;case Dl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Il:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case ts:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ll:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Dl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Il:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}x=null,_=null,D=null,b=null,w.set(0,0,0),A=0,m=z,E=Yt}return}lt=lt||O,ht=ht||V,Rt=Rt||q,(O!==p||lt!==y)&&(n.blendEquationSeparate(St[O],St[lt]),p=O,y=lt),(V!==x||q!==_||ht!==D||Rt!==b)&&(n.blendFuncSeparate(Mt[V],Mt[q],Mt[ht],Mt[Rt]),x=V,_=q,D=ht,b=Rt),(Vt.equals(w)===!1||Jt!==A)&&(n.blendColor(Vt.r,Vt.g,Vt.b,Jt),w.copy(Vt),A=Jt),m=z,E=!1}function qt(z,O){z.side===Le?mt(n.CULL_FACE):Q(n.CULL_FACE);let V=z.side===Qe;O&&(V=!V),Ut(V),z.blending===ts&&z.transparent===!1?G(ni):G(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),a.setMask(z.colorWrite);const q=z.stencilWrite;r.setTest(q),q&&(r.setMask(z.stencilWriteMask),r.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),r.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),yt(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?Q(n.SAMPLE_ALPHA_TO_COVERAGE):mt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ut(z){M!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),M=z)}function Ft(z){z!==fm?(Q(n.CULL_FACE),z!==R&&(z===Pl?n.cullFace(n.BACK):z===pm?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):mt(n.CULL_FACE),R=z}function bt(z){z!==F&&(C&&n.lineWidth(z),F=z)}function yt(z,O,V){z?(Q(n.POLYGON_OFFSET_FILL),(U!==O||X!==V)&&(n.polygonOffset(O,V),U=O,X=V)):mt(n.POLYGON_OFFSET_FILL)}function Tt(z){z?Q(n.SCISSOR_TEST):mt(n.SCISSOR_TEST)}function P(z){z===void 0&&(z=n.TEXTURE0+L-1),K!==z&&(n.activeTexture(z),K=z)}function S(z,O,V){V===void 0&&(K===null?V=n.TEXTURE0+L-1:V=K);let q=J[V];q===void 0&&(q={type:void 0,texture:void 0},J[V]=q),(q.type!==z||q.texture!==O)&&(K!==V&&(n.activeTexture(V),K=V),n.bindTexture(z,O||pt[z]),q.type=z,q.texture=O)}function Y(){const z=J[K];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function rt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ct(){try{n.compressedTexImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function at(){try{n.texSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Nt(){try{n.texSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function et(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function gt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Gt(){try{n.texStorage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function nt(){try{n.texStorage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function _t(){try{n.texImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function B(){try{n.texImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function it(z){vt.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),vt.copy(z))}function ut(z){j.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),j.copy(z))}function Et(z,O){let V=l.get(O);V===void 0&&(V=new WeakMap,l.set(O,V));let q=V.get(z);q===void 0&&(q=n.getUniformBlockIndex(O,z.name),V.set(z,q))}function zt(z,O){const q=l.get(O).get(z);c.get(O)!==q&&(n.uniformBlockBinding(O,q,z.__bindingPointIndex),c.set(O,q))}function Xt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},K=null,J={},f={},d=new WeakMap,u=[],g=null,v=!1,m=null,p=null,x=null,_=null,y=null,D=null,b=null,w=new Zt(0,0,0),A=0,E=!1,M=null,R=null,F=null,U=null,X=null,vt.set(0,0,n.canvas.width,n.canvas.height),j.set(0,0,n.canvas.width,n.canvas.height),a.reset(),o.reset(),r.reset()}return{buffers:{color:a,depth:o,stencil:r},enable:Q,disable:mt,bindFramebuffer:It,drawBuffers:At,useProgram:Ot,setBlending:G,setMaterial:qt,setFlipSided:Ut,setCullFace:Ft,setLineWidth:bt,setPolygonOffset:yt,setScissorTest:Tt,activeTexture:P,bindTexture:S,unbindTexture:Y,compressedTexImage2D:rt,compressedTexImage3D:ct,texImage2D:_t,texImage3D:B,updateUBOMapping:Et,uniformBlockBinding:zt,texStorage2D:Gt,texStorage3D:nt,texSubImage2D:at,texSubImage3D:Nt,compressedTexSubImage2D:et,compressedTexSubImage3D:gt,scissor:it,viewport:ut,reset:Xt}}function Ch(n,t,e,i){const s=my(i);switch(e){case yd:return n*t;case Sd:return n*t;case bd:return n*t*2;case Ed:return n*t/s.components*s.byteLength;case Tc:return n*t/s.components*s.byteLength;case wd:return n*t*2/s.components*s.byteLength;case Rc:return n*t*2/s.components*s.byteLength;case Md:return n*t*3/s.components*s.byteLength;case Mn:return n*t*4/s.components*s.byteLength;case Cc:return n*t*4/s.components*s.byteLength;case Ca:case Pa:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case La:case Da:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ur:case Nr:return Math.max(n,16)*Math.max(t,8)/4;case kr:case Fr:return Math.max(n,8)*Math.max(t,8)/2;case zr:case Or:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Br:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Hr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Gr:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Vr:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Xr:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Wr:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case $r:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Yr:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Zr:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case qr:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case jr:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Kr:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Jr:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Qr:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case tc:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ia:case ec:case nc:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Ad:case ic:return Math.ceil(n/4)*Math.ceil(t/4)*8;case sc:case ac:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function my(n){switch(n){case Wn:case xd:return{byteLength:1,components:1};case Fs:case vd:case Vs:return{byteLength:2,components:1};case wc:case Ac:return{byteLength:2,components:4};case Ti:case Ec:case Gn:return{byteLength:4,components:1};case _d:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function gy(n,t,e,i,s,a,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Bt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,S){return u?new OffscreenCanvas(P,S):qa("canvas")}function v(P,S,Y){let rt=1;const ct=Tt(P);if((ct.width>Y||ct.height>Y)&&(rt=Y/Math.max(ct.width,ct.height)),rt<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const at=Math.floor(rt*ct.width),Nt=Math.floor(rt*ct.height);f===void 0&&(f=g(at,Nt));const et=S?g(at,Nt):f;return et.width=at,et.height=Nt,et.getContext("2d").drawImage(P,0,0,at,Nt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ct.width+"x"+ct.height+") to ("+at+"x"+Nt+")."),et}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ct.width+"x"+ct.height+")."),P;return P}function m(P){return P.generateMipmaps}function p(P){n.generateMipmap(P)}function x(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(P,S,Y,rt,ct=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let at=S;if(S===n.RED&&(Y===n.FLOAT&&(at=n.R32F),Y===n.HALF_FLOAT&&(at=n.R16F),Y===n.UNSIGNED_BYTE&&(at=n.R8)),S===n.RED_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.R8UI),Y===n.UNSIGNED_SHORT&&(at=n.R16UI),Y===n.UNSIGNED_INT&&(at=n.R32UI),Y===n.BYTE&&(at=n.R8I),Y===n.SHORT&&(at=n.R16I),Y===n.INT&&(at=n.R32I)),S===n.RG&&(Y===n.FLOAT&&(at=n.RG32F),Y===n.HALF_FLOAT&&(at=n.RG16F),Y===n.UNSIGNED_BYTE&&(at=n.RG8)),S===n.RG_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.RG8UI),Y===n.UNSIGNED_SHORT&&(at=n.RG16UI),Y===n.UNSIGNED_INT&&(at=n.RG32UI),Y===n.BYTE&&(at=n.RG8I),Y===n.SHORT&&(at=n.RG16I),Y===n.INT&&(at=n.RG32I)),S===n.RGB_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.RGB8UI),Y===n.UNSIGNED_SHORT&&(at=n.RGB16UI),Y===n.UNSIGNED_INT&&(at=n.RGB32UI),Y===n.BYTE&&(at=n.RGB8I),Y===n.SHORT&&(at=n.RGB16I),Y===n.INT&&(at=n.RGB32I)),S===n.RGBA_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.RGBA8UI),Y===n.UNSIGNED_SHORT&&(at=n.RGBA16UI),Y===n.UNSIGNED_INT&&(at=n.RGBA32UI),Y===n.BYTE&&(at=n.RGBA8I),Y===n.SHORT&&(at=n.RGBA16I),Y===n.INT&&(at=n.RGBA32I)),S===n.RGB&&Y===n.UNSIGNED_INT_5_9_9_9_REV&&(at=n.RGB9_E5),S===n.RGBA){const Nt=ct?to:ae.getTransfer(rt);Y===n.FLOAT&&(at=n.RGBA32F),Y===n.HALF_FLOAT&&(at=n.RGBA16F),Y===n.UNSIGNED_BYTE&&(at=Nt===de?n.SRGB8_ALPHA8:n.RGBA8),Y===n.UNSIGNED_SHORT_4_4_4_4&&(at=n.RGBA4),Y===n.UNSIGNED_SHORT_5_5_5_1&&(at=n.RGB5_A1)}return(at===n.R16F||at===n.R32F||at===n.RG16F||at===n.RG32F||at===n.RGBA16F||at===n.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function y(P,S){let Y;return P?S===null||S===Ti||S===rs?Y=n.DEPTH24_STENCIL8:S===Gn?Y=n.DEPTH32F_STENCIL8:S===Fs&&(Y=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Ti||S===rs?Y=n.DEPTH_COMPONENT24:S===Gn?Y=n.DEPTH_COMPONENT32F:S===Fs&&(Y=n.DEPTH_COMPONENT16),Y}function D(P,S){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==Sn&&P.minFilter!==Rn?Math.log2(Math.max(S.width,S.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?S.mipmaps.length:1}function b(P){const S=P.target;S.removeEventListener("dispose",b),A(S),S.isVideoTexture&&h.delete(S)}function w(P){const S=P.target;S.removeEventListener("dispose",w),M(S)}function A(P){const S=i.get(P);if(S.__webglInit===void 0)return;const Y=P.source,rt=d.get(Y);if(rt){const ct=rt[S.__cacheKey];ct.usedTimes--,ct.usedTimes===0&&E(P),Object.keys(rt).length===0&&d.delete(Y)}i.remove(P)}function E(P){const S=i.get(P);n.deleteTexture(S.__webglTexture);const Y=P.source,rt=d.get(Y);delete rt[S.__cacheKey],o.memory.textures--}function M(P){const S=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(S.__webglFramebuffer[rt]))for(let ct=0;ct<S.__webglFramebuffer[rt].length;ct++)n.deleteFramebuffer(S.__webglFramebuffer[rt][ct]);else n.deleteFramebuffer(S.__webglFramebuffer[rt]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[rt])}else{if(Array.isArray(S.__webglFramebuffer))for(let rt=0;rt<S.__webglFramebuffer.length;rt++)n.deleteFramebuffer(S.__webglFramebuffer[rt]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let rt=0;rt<S.__webglColorRenderbuffer.length;rt++)S.__webglColorRenderbuffer[rt]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[rt]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const Y=P.textures;for(let rt=0,ct=Y.length;rt<ct;rt++){const at=i.get(Y[rt]);at.__webglTexture&&(n.deleteTexture(at.__webglTexture),o.memory.textures--),i.remove(Y[rt])}i.remove(P)}let R=0;function F(){R=0}function U(){const P=R;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),R+=1,P}function X(P){const S=[];return S.push(P.wrapS),S.push(P.wrapT),S.push(P.wrapR||0),S.push(P.magFilter),S.push(P.minFilter),S.push(P.anisotropy),S.push(P.internalFormat),S.push(P.format),S.push(P.type),S.push(P.generateMipmaps),S.push(P.premultiplyAlpha),S.push(P.flipY),S.push(P.unpackAlignment),S.push(P.colorSpace),S.join()}function L(P,S){const Y=i.get(P);if(P.isVideoTexture&&bt(P),P.isRenderTargetTexture===!1&&P.version>0&&Y.__version!==P.version){const rt=P.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(Y,P,S);return}}e.bindTexture(n.TEXTURE_2D,Y.__webglTexture,n.TEXTURE0+S)}function C(P,S){const Y=i.get(P);if(P.version>0&&Y.__version!==P.version){j(Y,P,S);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Y.__webglTexture,n.TEXTURE0+S)}function W(P,S){const Y=i.get(P);if(P.version>0&&Y.__version!==P.version){j(Y,P,S);return}e.bindTexture(n.TEXTURE_3D,Y.__webglTexture,n.TEXTURE0+S)}function H(P,S){const Y=i.get(P);if(P.version>0&&Y.__version!==P.version){tt(Y,P,S);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture,n.TEXTURE0+S)}const K={[Dr]:n.REPEAT,[bi]:n.CLAMP_TO_EDGE,[Ir]:n.MIRRORED_REPEAT},J={[Sn]:n.NEAREST,[Gm]:n.NEAREST_MIPMAP_NEAREST,[Js]:n.NEAREST_MIPMAP_LINEAR,[Rn]:n.LINEAR,[Eo]:n.LINEAR_MIPMAP_NEAREST,[Ei]:n.LINEAR_MIPMAP_LINEAR},ot={[$m]:n.NEVER,[Jm]:n.ALWAYS,[Ym]:n.LESS,[Rd]:n.LEQUAL,[Zm]:n.EQUAL,[Km]:n.GEQUAL,[qm]:n.GREATER,[jm]:n.NOTEQUAL};function ft(P,S){if(S.type===Gn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===Rn||S.magFilter===Eo||S.magFilter===Js||S.magFilter===Ei||S.minFilter===Rn||S.minFilter===Eo||S.minFilter===Js||S.minFilter===Ei)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,K[S.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,K[S.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,K[S.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,J[S.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,J[S.minFilter]),S.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,ot[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Sn||S.minFilter!==Js&&S.minFilter!==Ei||S.type===Gn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const Y=t.get("EXT_texture_filter_anisotropic");n.texParameterf(P,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function vt(P,S){let Y=!1;P.__webglInit===void 0&&(P.__webglInit=!0,S.addEventListener("dispose",b));const rt=S.source;let ct=d.get(rt);ct===void 0&&(ct={},d.set(rt,ct));const at=X(S);if(at!==P.__cacheKey){ct[at]===void 0&&(ct[at]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),ct[at].usedTimes++;const Nt=ct[P.__cacheKey];Nt!==void 0&&(ct[P.__cacheKey].usedTimes--,Nt.usedTimes===0&&E(S)),P.__cacheKey=at,P.__webglTexture=ct[at].texture}return Y}function j(P,S,Y){let rt=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(rt=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(rt=n.TEXTURE_3D);const ct=vt(P,S),at=S.source;e.bindTexture(rt,P.__webglTexture,n.TEXTURE0+Y);const Nt=i.get(at);if(at.version!==Nt.__version||ct===!0){e.activeTexture(n.TEXTURE0+Y);const et=ae.getPrimaries(ae.workingColorSpace),gt=S.colorSpace===ti?null:ae.getPrimaries(S.colorSpace),Gt=S.colorSpace===ti||et===gt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Gt);let nt=v(S.image,!1,s.maxTextureSize);nt=yt(S,nt);const _t=a.convert(S.format,S.colorSpace),B=a.convert(S.type);let it=_(S.internalFormat,_t,B,S.colorSpace,S.isVideoTexture);ft(rt,S);let ut;const Et=S.mipmaps,zt=S.isVideoTexture!==!0,Xt=Nt.__version===void 0||ct===!0,z=at.dataReady,O=D(S,nt);if(S.isDepthTexture)it=y(S.format===cs,S.type),Xt&&(zt?e.texStorage2D(n.TEXTURE_2D,1,it,nt.width,nt.height):e.texImage2D(n.TEXTURE_2D,0,it,nt.width,nt.height,0,_t,B,null));else if(S.isDataTexture)if(Et.length>0){zt&&Xt&&e.texStorage2D(n.TEXTURE_2D,O,it,Et[0].width,Et[0].height);for(let V=0,q=Et.length;V<q;V++)ut=Et[V],zt?z&&e.texSubImage2D(n.TEXTURE_2D,V,0,0,ut.width,ut.height,_t,B,ut.data):e.texImage2D(n.TEXTURE_2D,V,it,ut.width,ut.height,0,_t,B,ut.data);S.generateMipmaps=!1}else zt?(Xt&&e.texStorage2D(n.TEXTURE_2D,O,it,nt.width,nt.height),z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,nt.width,nt.height,_t,B,nt.data)):e.texImage2D(n.TEXTURE_2D,0,it,nt.width,nt.height,0,_t,B,nt.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){zt&&Xt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,O,it,Et[0].width,Et[0].height,nt.depth);for(let V=0,q=Et.length;V<q;V++)if(ut=Et[V],S.format!==Mn)if(_t!==null)if(zt){if(z)if(S.layerUpdates.size>0){const lt=Ch(ut.width,ut.height,S.format,S.type);for(const ht of S.layerUpdates){const Rt=ut.data.subarray(ht*lt/ut.data.BYTES_PER_ELEMENT,(ht+1)*lt/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,V,0,0,ht,ut.width,ut.height,1,_t,Rt)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,V,0,0,0,ut.width,ut.height,nt.depth,_t,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,V,it,ut.width,ut.height,nt.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else zt?z&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,V,0,0,0,ut.width,ut.height,nt.depth,_t,B,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,V,it,ut.width,ut.height,nt.depth,0,_t,B,ut.data)}else{zt&&Xt&&e.texStorage2D(n.TEXTURE_2D,O,it,Et[0].width,Et[0].height);for(let V=0,q=Et.length;V<q;V++)ut=Et[V],S.format!==Mn?_t!==null?zt?z&&e.compressedTexSubImage2D(n.TEXTURE_2D,V,0,0,ut.width,ut.height,_t,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,V,it,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):zt?z&&e.texSubImage2D(n.TEXTURE_2D,V,0,0,ut.width,ut.height,_t,B,ut.data):e.texImage2D(n.TEXTURE_2D,V,it,ut.width,ut.height,0,_t,B,ut.data)}else if(S.isDataArrayTexture)if(zt){if(Xt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,O,it,nt.width,nt.height,nt.depth),z)if(S.layerUpdates.size>0){const V=Ch(nt.width,nt.height,S.format,S.type);for(const q of S.layerUpdates){const lt=nt.data.subarray(q*V/nt.data.BYTES_PER_ELEMENT,(q+1)*V/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,q,nt.width,nt.height,1,_t,B,lt)}S.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,_t,B,nt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,it,nt.width,nt.height,nt.depth,0,_t,B,nt.data);else if(S.isData3DTexture)zt?(Xt&&e.texStorage3D(n.TEXTURE_3D,O,it,nt.width,nt.height,nt.depth),z&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,_t,B,nt.data)):e.texImage3D(n.TEXTURE_3D,0,it,nt.width,nt.height,nt.depth,0,_t,B,nt.data);else if(S.isFramebufferTexture){if(Xt)if(zt)e.texStorage2D(n.TEXTURE_2D,O,it,nt.width,nt.height);else{let V=nt.width,q=nt.height;for(let lt=0;lt<O;lt++)e.texImage2D(n.TEXTURE_2D,lt,it,V,q,0,_t,B,null),V>>=1,q>>=1}}else if(Et.length>0){if(zt&&Xt){const V=Tt(Et[0]);e.texStorage2D(n.TEXTURE_2D,O,it,V.width,V.height)}for(let V=0,q=Et.length;V<q;V++)ut=Et[V],zt?z&&e.texSubImage2D(n.TEXTURE_2D,V,0,0,_t,B,ut):e.texImage2D(n.TEXTURE_2D,V,it,_t,B,ut);S.generateMipmaps=!1}else if(zt){if(Xt){const V=Tt(nt);e.texStorage2D(n.TEXTURE_2D,O,it,V.width,V.height)}z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,_t,B,nt)}else e.texImage2D(n.TEXTURE_2D,0,it,_t,B,nt);m(S)&&p(rt),Nt.__version=at.version,S.onUpdate&&S.onUpdate(S)}P.__version=S.version}function tt(P,S,Y){if(S.image.length!==6)return;const rt=vt(P,S),ct=S.source;e.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+Y);const at=i.get(ct);if(ct.version!==at.__version||rt===!0){e.activeTexture(n.TEXTURE0+Y);const Nt=ae.getPrimaries(ae.workingColorSpace),et=S.colorSpace===ti?null:ae.getPrimaries(S.colorSpace),gt=S.colorSpace===ti||Nt===et?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const Gt=S.isCompressedTexture||S.image[0].isCompressedTexture,nt=S.image[0]&&S.image[0].isDataTexture,_t=[];for(let q=0;q<6;q++)!Gt&&!nt?_t[q]=v(S.image[q],!0,s.maxCubemapSize):_t[q]=nt?S.image[q].image:S.image[q],_t[q]=yt(S,_t[q]);const B=_t[0],it=a.convert(S.format,S.colorSpace),ut=a.convert(S.type),Et=_(S.internalFormat,it,ut,S.colorSpace),zt=S.isVideoTexture!==!0,Xt=at.__version===void 0||rt===!0,z=ct.dataReady;let O=D(S,B);ft(n.TEXTURE_CUBE_MAP,S);let V;if(Gt){zt&&Xt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,O,Et,B.width,B.height);for(let q=0;q<6;q++){V=_t[q].mipmaps;for(let lt=0;lt<V.length;lt++){const ht=V[lt];S.format!==Mn?it!==null?zt?z&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,lt,0,0,ht.width,ht.height,it,ht.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,lt,Et,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):zt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,lt,0,0,ht.width,ht.height,it,ut,ht.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,lt,Et,ht.width,ht.height,0,it,ut,ht.data)}}}else{if(V=S.mipmaps,zt&&Xt){V.length>0&&O++;const q=Tt(_t[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,O,Et,q.width,q.height)}for(let q=0;q<6;q++)if(nt){zt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,_t[q].width,_t[q].height,it,ut,_t[q].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Et,_t[q].width,_t[q].height,0,it,ut,_t[q].data);for(let lt=0;lt<V.length;lt++){const Rt=V[lt].image[q].image;zt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,lt+1,0,0,Rt.width,Rt.height,it,ut,Rt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,lt+1,Et,Rt.width,Rt.height,0,it,ut,Rt.data)}}else{zt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,it,ut,_t[q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Et,it,ut,_t[q]);for(let lt=0;lt<V.length;lt++){const ht=V[lt];zt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,lt+1,0,0,it,ut,ht.image[q]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+q,lt+1,Et,it,ut,ht.image[q])}}}m(S)&&p(n.TEXTURE_CUBE_MAP),at.__version=ct.version,S.onUpdate&&S.onUpdate(S)}P.__version=S.version}function pt(P,S,Y,rt,ct,at){const Nt=a.convert(Y.format,Y.colorSpace),et=a.convert(Y.type),gt=_(Y.internalFormat,Nt,et,Y.colorSpace),Gt=i.get(S),nt=i.get(Y);if(nt.__renderTarget=S,!Gt.__hasExternalTextures){const _t=Math.max(1,S.width>>at),B=Math.max(1,S.height>>at);ct===n.TEXTURE_3D||ct===n.TEXTURE_2D_ARRAY?e.texImage3D(ct,at,gt,_t,B,S.depth,0,Nt,et,null):e.texImage2D(ct,at,gt,_t,B,0,Nt,et,null)}e.bindFramebuffer(n.FRAMEBUFFER,P),Ft(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,rt,ct,nt.__webglTexture,0,Ut(S)):(ct===n.TEXTURE_2D||ct>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ct<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,rt,ct,nt.__webglTexture,at),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Q(P,S,Y){if(n.bindRenderbuffer(n.RENDERBUFFER,P),S.depthBuffer){const rt=S.depthTexture,ct=rt&&rt.isDepthTexture?rt.type:null,at=y(S.stencilBuffer,ct),Nt=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,et=Ut(S);Ft(S)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,et,at,S.width,S.height):Y?n.renderbufferStorageMultisample(n.RENDERBUFFER,et,at,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,at,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Nt,n.RENDERBUFFER,P)}else{const rt=S.textures;for(let ct=0;ct<rt.length;ct++){const at=rt[ct],Nt=a.convert(at.format,at.colorSpace),et=a.convert(at.type),gt=_(at.internalFormat,Nt,et,at.colorSpace),Gt=Ut(S);Y&&Ft(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Gt,gt,S.width,S.height):Ft(S)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Gt,gt,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,gt,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function mt(P,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,P),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const rt=i.get(S.depthTexture);rt.__renderTarget=S,(!rt.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),L(S.depthTexture,0);const ct=rt.__webglTexture,at=Ut(S);if(S.depthTexture.format===es)Ft(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ct,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ct,0);else if(S.depthTexture.format===cs)Ft(S)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ct,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ct,0);else throw new Error("Unknown depthTexture format")}function It(P){const S=i.get(P),Y=P.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==P.depthTexture){const rt=P.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),rt){const ct=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,rt.removeEventListener("dispose",ct)};rt.addEventListener("dispose",ct),S.__depthDisposeCallback=ct}S.__boundDepthTexture=rt}if(P.depthTexture&&!S.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");mt(S.__webglFramebuffer,P)}else if(Y){S.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[rt]),S.__webglDepthbuffer[rt]===void 0)S.__webglDepthbuffer[rt]=n.createRenderbuffer(),Q(S.__webglDepthbuffer[rt],P,!1);else{const ct=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,at=S.__webglDepthbuffer[rt];n.bindRenderbuffer(n.RENDERBUFFER,at),n.framebufferRenderbuffer(n.FRAMEBUFFER,ct,n.RENDERBUFFER,at)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),Q(S.__webglDepthbuffer,P,!1);else{const rt=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ct),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,ct)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function At(P,S,Y){const rt=i.get(P);S!==void 0&&pt(rt.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Y!==void 0&&It(P)}function Ot(P){const S=P.texture,Y=i.get(P),rt=i.get(S);P.addEventListener("dispose",w);const ct=P.textures,at=P.isWebGLCubeRenderTarget===!0,Nt=ct.length>1;if(Nt||(rt.__webglTexture===void 0&&(rt.__webglTexture=n.createTexture()),rt.__version=S.version,o.memory.textures++),at){Y.__webglFramebuffer=[];for(let et=0;et<6;et++)if(S.mipmaps&&S.mipmaps.length>0){Y.__webglFramebuffer[et]=[];for(let gt=0;gt<S.mipmaps.length;gt++)Y.__webglFramebuffer[et][gt]=n.createFramebuffer()}else Y.__webglFramebuffer[et]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){Y.__webglFramebuffer=[];for(let et=0;et<S.mipmaps.length;et++)Y.__webglFramebuffer[et]=n.createFramebuffer()}else Y.__webglFramebuffer=n.createFramebuffer();if(Nt)for(let et=0,gt=ct.length;et<gt;et++){const Gt=i.get(ct[et]);Gt.__webglTexture===void 0&&(Gt.__webglTexture=n.createTexture(),o.memory.textures++)}if(P.samples>0&&Ft(P)===!1){Y.__webglMultisampledFramebuffer=n.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let et=0;et<ct.length;et++){const gt=ct[et];Y.__webglColorRenderbuffer[et]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Y.__webglColorRenderbuffer[et]);const Gt=a.convert(gt.format,gt.colorSpace),nt=a.convert(gt.type),_t=_(gt.internalFormat,Gt,nt,gt.colorSpace,P.isXRRenderTarget===!0),B=Ut(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,B,_t,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+et,n.RENDERBUFFER,Y.__webglColorRenderbuffer[et])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(Y.__webglDepthRenderbuffer=n.createRenderbuffer(),Q(Y.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(at){e.bindTexture(n.TEXTURE_CUBE_MAP,rt.__webglTexture),ft(n.TEXTURE_CUBE_MAP,S);for(let et=0;et<6;et++)if(S.mipmaps&&S.mipmaps.length>0)for(let gt=0;gt<S.mipmaps.length;gt++)pt(Y.__webglFramebuffer[et][gt],P,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+et,gt);else pt(Y.__webglFramebuffer[et],P,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+et,0);m(S)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Nt){for(let et=0,gt=ct.length;et<gt;et++){const Gt=ct[et],nt=i.get(Gt);e.bindTexture(n.TEXTURE_2D,nt.__webglTexture),ft(n.TEXTURE_2D,Gt),pt(Y.__webglFramebuffer,P,Gt,n.COLOR_ATTACHMENT0+et,n.TEXTURE_2D,0),m(Gt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let et=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(et=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(et,rt.__webglTexture),ft(et,S),S.mipmaps&&S.mipmaps.length>0)for(let gt=0;gt<S.mipmaps.length;gt++)pt(Y.__webglFramebuffer[gt],P,S,n.COLOR_ATTACHMENT0,et,gt);else pt(Y.__webglFramebuffer,P,S,n.COLOR_ATTACHMENT0,et,0);m(S)&&p(et),e.unbindTexture()}P.depthBuffer&&It(P)}function St(P){const S=P.textures;for(let Y=0,rt=S.length;Y<rt;Y++){const ct=S[Y];if(m(ct)){const at=x(P),Nt=i.get(ct).__webglTexture;e.bindTexture(at,Nt),p(at),e.unbindTexture()}}}const Mt=[],G=[];function qt(P){if(P.samples>0){if(Ft(P)===!1){const S=P.textures,Y=P.width,rt=P.height;let ct=n.COLOR_BUFFER_BIT;const at=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Nt=i.get(P),et=S.length>1;if(et)for(let gt=0;gt<S.length;gt++)e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let gt=0;gt<S.length;gt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ct|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ct|=n.STENCIL_BUFFER_BIT)),et){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Nt.__webglColorRenderbuffer[gt]);const Gt=i.get(S[gt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Gt,0)}n.blitFramebuffer(0,0,Y,rt,0,0,Y,rt,ct,n.NEAREST),c===!0&&(Mt.length=0,G.length=0,Mt.push(n.COLOR_ATTACHMENT0+gt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Mt.push(at),G.push(at),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,G)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Mt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),et)for(let gt=0;gt<S.length;gt++){e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.RENDERBUFFER,Nt.__webglColorRenderbuffer[gt]);const Gt=i.get(S[gt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Nt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.TEXTURE_2D,Gt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Nt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&c){const S=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function Ut(P){return Math.min(s.maxSamples,P.samples)}function Ft(P){const S=i.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function bt(P){const S=o.render.frame;h.get(P)!==S&&(h.set(P,S),P.update())}function yt(P,S){const Y=P.colorSpace,rt=P.format,ct=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||Y!==hs&&Y!==ti&&(ae.getTransfer(Y)===de?(rt!==Mn||ct!==Wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),S}function Tt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(l.width=P.naturalWidth||P.width,l.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(l.width=P.displayWidth,l.height=P.displayHeight):(l.width=P.width,l.height=P.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=F,this.setTexture2D=L,this.setTexture2DArray=C,this.setTexture3D=W,this.setTextureCube=H,this.rebindTextures=At,this.setupRenderTarget=Ot,this.updateRenderTargetMipmap=St,this.updateMultisampleRenderTarget=qt,this.setupDepthRenderbuffer=It,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Ft}function xy(n,t){function e(i,s=ti){let a;const o=ae.getTransfer(s);if(i===Wn)return n.UNSIGNED_BYTE;if(i===wc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ac)return n.UNSIGNED_SHORT_5_5_5_1;if(i===_d)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===xd)return n.BYTE;if(i===vd)return n.SHORT;if(i===Fs)return n.UNSIGNED_SHORT;if(i===Ec)return n.INT;if(i===Ti)return n.UNSIGNED_INT;if(i===Gn)return n.FLOAT;if(i===Vs)return n.HALF_FLOAT;if(i===yd)return n.ALPHA;if(i===Md)return n.RGB;if(i===Mn)return n.RGBA;if(i===Sd)return n.LUMINANCE;if(i===bd)return n.LUMINANCE_ALPHA;if(i===es)return n.DEPTH_COMPONENT;if(i===cs)return n.DEPTH_STENCIL;if(i===Ed)return n.RED;if(i===Tc)return n.RED_INTEGER;if(i===wd)return n.RG;if(i===Rc)return n.RG_INTEGER;if(i===Cc)return n.RGBA_INTEGER;if(i===Ca||i===Pa||i===La||i===Da)if(o===de)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Ca)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Pa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===La)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Da)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Ca)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Pa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===La)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Da)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===kr||i===Ur||i===Fr||i===Nr)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===kr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ur)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Fr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Nr)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===zr||i===Or||i===Br)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===zr||i===Or)return o===de?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Br)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Hr||i===Gr||i===Vr||i===Xr||i===Wr||i===$r||i===Yr||i===Zr||i===qr||i===jr||i===Kr||i===Jr||i===Qr||i===tc)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Hr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Gr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Vr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Xr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Wr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===$r)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Yr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Zr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===qr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===jr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Kr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Jr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Qr)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===tc)return o===de?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ia||i===ec||i===nc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Ia)return o===de?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ec)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===nc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ad||i===ic||i===sc||i===ac)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Ia)return a.COMPRESSED_RED_RGTC1_EXT;if(i===ic)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===sc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ac)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===rs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class vy extends un{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ge extends Te{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _y={type:"move"};class Ko{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ge,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ge,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new $,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new $),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ge,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new $,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new $),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,i),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,g=.005;l.inputState.pinching&&d>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(_y)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ge;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const yy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,My=`
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

}`;class Sy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new qe,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ai({vertexShader:yy,fragmentShader:My,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new he(new dn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class by extends ds{constructor(t,e){super();const i=this;let s=null,a=1,o=null,r="local-floor",c=1,l=null,h=null,f=null,d=null,u=null,g=null;const v=new Sy,m=e.getContextAttributes();let p=null,x=null;const _=[],y=[],D=new Bt;let b=null;const w=new un;w.viewport=new Se;const A=new un;A.viewport=new Se;const E=[w,A],M=new vy;let R=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let tt=_[j];return tt===void 0&&(tt=new Ko,_[j]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(j){let tt=_[j];return tt===void 0&&(tt=new Ko,_[j]=tt),tt.getGripSpace()},this.getHand=function(j){let tt=_[j];return tt===void 0&&(tt=new Ko,_[j]=tt),tt.getHandSpace()};function U(j){const tt=y.indexOf(j.inputSource);if(tt===-1)return;const pt=_[tt];pt!==void 0&&(pt.update(j.inputSource,j.frame,l||o),pt.dispatchEvent({type:j.type,data:j.inputSource}))}function X(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",L);for(let j=0;j<_.length;j++){const tt=y[j];tt!==null&&(y[j]=null,_[j].disconnect(tt))}R=null,F=null,v.reset(),t.setRenderTarget(p),u=null,d=null,f=null,s=null,x=null,vt.stop(),i.isPresenting=!1,t.setPixelRatio(b),t.setSize(D.width,D.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){a=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){r=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",X),s.addEventListener("inputsourceschange",L),m.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(D),s.renderState.layers===void 0){const tt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,tt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new Ri(u.framebufferWidth,u.framebufferHeight,{format:Mn,type:Wn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let tt=null,pt=null,Q=null;m.depth&&(Q=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=m.stencil?cs:es,pt=m.stencil?rs:Ti);const mt={colorFormat:e.RGBA8,depthFormat:Q,scaleFactor:a};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(mt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new Ri(d.textureWidth,d.textureHeight,{format:Mn,type:Wn,depthTexture:new Bd(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(r),vt.setContext(s),vt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function L(j){for(let tt=0;tt<j.removed.length;tt++){const pt=j.removed[tt],Q=y.indexOf(pt);Q>=0&&(y[Q]=null,_[Q].disconnect(pt))}for(let tt=0;tt<j.added.length;tt++){const pt=j.added[tt];let Q=y.indexOf(pt);if(Q===-1){for(let It=0;It<_.length;It++)if(It>=y.length){y.push(pt),Q=It;break}else if(y[It]===null){y[It]=pt,Q=It;break}if(Q===-1)break}const mt=_[Q];mt&&mt.connect(pt)}}const C=new $,W=new $;function H(j,tt,pt){C.setFromMatrixPosition(tt.matrixWorld),W.setFromMatrixPosition(pt.matrixWorld);const Q=C.distanceTo(W),mt=tt.projectionMatrix.elements,It=pt.projectionMatrix.elements,At=mt[14]/(mt[10]-1),Ot=mt[14]/(mt[10]+1),St=(mt[9]+1)/mt[5],Mt=(mt[9]-1)/mt[5],G=(mt[8]-1)/mt[0],qt=(It[8]+1)/It[0],Ut=At*G,Ft=At*qt,bt=Q/(-G+qt),yt=bt*-G;if(tt.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(yt),j.translateZ(bt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),mt[10]===-1)j.projectionMatrix.copy(tt.projectionMatrix),j.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const Tt=At+bt,P=Ot+bt,S=Ut-yt,Y=Ft+(Q-yt),rt=St*Ot/P*Tt,ct=Mt*Ot/P*Tt;j.projectionMatrix.makePerspective(S,Y,rt,ct,Tt,P),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function K(j,tt){tt===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(tt.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let tt=j.near,pt=j.far;v.texture!==null&&(v.depthNear>0&&(tt=v.depthNear),v.depthFar>0&&(pt=v.depthFar)),M.near=A.near=w.near=tt,M.far=A.far=w.far=pt,(R!==M.near||F!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,F=M.far),w.layers.mask=j.layers.mask|2,A.layers.mask=j.layers.mask|4,M.layers.mask=w.layers.mask|A.layers.mask;const Q=j.parent,mt=M.cameras;K(M,Q);for(let It=0;It<mt.length;It++)K(mt[It],Q);mt.length===2?H(M,w,A):M.projectionMatrix.copy(w.projectionMatrix),J(j,M,Q)};function J(j,tt,pt){pt===null?j.matrix.copy(tt.matrixWorld):(j.matrix.copy(pt.matrixWorld),j.matrix.invert(),j.matrix.multiply(tt.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(tt.projectionMatrix),j.projectionMatrixInverse.copy(tt.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Ns*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return c},this.setFoveation=function(j){c=j,d!==null&&(d.fixedFoveation=j),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=j)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let ot=null;function ft(j,tt){if(h=tt.getViewerPose(l||o),g=tt,h!==null){const pt=h.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let Q=!1;pt.length!==M.cameras.length&&(M.cameras.length=0,Q=!0);for(let It=0;It<pt.length;It++){const At=pt[It];let Ot=null;if(u!==null)Ot=u.getViewport(At);else{const Mt=f.getViewSubImage(d,At);Ot=Mt.viewport,It===0&&(t.setRenderTargetTextures(x,Mt.colorTexture,d.ignoreDepthValues?void 0:Mt.depthStencilTexture),t.setRenderTarget(x))}let St=E[It];St===void 0&&(St=new un,St.layers.enable(It),St.viewport=new Se,E[It]=St),St.matrix.fromArray(At.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(At.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),It===0&&(M.matrix.copy(St.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),Q===!0&&M.cameras.push(St)}const mt=s.enabledFeatures;if(mt&&mt.includes("depth-sensing")){const It=f.getDepthInformation(pt[0]);It&&It.isValid&&It.texture&&v.init(t,It,s.renderState)}}for(let pt=0;pt<_.length;pt++){const Q=y[pt],mt=_[pt];Q!==null&&mt!==void 0&&mt.update(Q,tt,l||o)}ot&&ot(j,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),g=null}const vt=new zd;vt.setAnimationLoop(ft),this.setAnimationLoop=function(j){ot=j},this.dispose=function(){}}}const pi=new Pn,Ey=new xe;function wy(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Ud(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,_,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p)):p.isMeshStandardMaterial?(a(m,p),d(m,p),p.isMeshPhysicalMaterial&&u(m,p,y)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),v(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?c(m,p,x,_):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Qe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Qe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),_=x.envMap,y=x.envMapRotation;_&&(m.envMap.value=_,pi.copy(y),pi.x*=-1,pi.y*=-1,pi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),m.envMapRotation.value.setFromMatrix4(Ey.makeRotationFromEuler(pi)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,_){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=_*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Qe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Ay(n,t,e,i){let s={},a={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,_){const y=_.program;i.uniformBlockBinding(x,y)}function l(x,_){let y=s[x.id];y===void 0&&(g(x),y=h(x),s[x.id]=y,x.addEventListener("dispose",m));const D=_.program;i.updateUBOMapping(x,D);const b=t.render.frame;a[x.id]!==b&&(d(x),a[x.id]=b)}function h(x){const _=f();x.__bindingPointIndex=_;const y=n.createBuffer(),D=x.__size,b=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,D,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,y),y}function f(){for(let x=0;x<r;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const _=s[x.id],y=x.uniforms,D=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let b=0,w=y.length;b<w;b++){const A=Array.isArray(y[b])?y[b]:[y[b]];for(let E=0,M=A.length;E<M;E++){const R=A[E];if(u(R,b,E,D)===!0){const F=R.__offset,U=Array.isArray(R.value)?R.value:[R.value];let X=0;for(let L=0;L<U.length;L++){const C=U[L],W=v(C);typeof C=="number"||typeof C=="boolean"?(R.__data[0]=C,n.bufferSubData(n.UNIFORM_BUFFER,F+X,R.__data)):C.isMatrix3?(R.__data[0]=C.elements[0],R.__data[1]=C.elements[1],R.__data[2]=C.elements[2],R.__data[3]=0,R.__data[4]=C.elements[3],R.__data[5]=C.elements[4],R.__data[6]=C.elements[5],R.__data[7]=0,R.__data[8]=C.elements[6],R.__data[9]=C.elements[7],R.__data[10]=C.elements[8],R.__data[11]=0):(C.toArray(R.__data,X),X+=W.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,_,y,D){const b=x.value,w=_+"_"+y;if(D[w]===void 0)return typeof b=="number"||typeof b=="boolean"?D[w]=b:D[w]=b.clone(),!0;{const A=D[w];if(typeof b=="number"||typeof b=="boolean"){if(A!==b)return D[w]=b,!0}else if(A.equals(b)===!1)return A.copy(b),!0}return!1}function g(x){const _=x.uniforms;let y=0;const D=16;for(let w=0,A=_.length;w<A;w++){const E=Array.isArray(_[w])?_[w]:[_[w]];for(let M=0,R=E.length;M<R;M++){const F=E[M],U=Array.isArray(F.value)?F.value:[F.value];for(let X=0,L=U.length;X<L;X++){const C=U[X],W=v(C),H=y%D,K=H%W.boundary,J=H+K;y+=K,J!==0&&D-J<W.storage&&(y+=D-J),F.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=W.storage}}}const b=y%D;return b>0&&(y+=D-b),x.__size=y,x.__cache={},this}function v(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function m(x){const _=x.target;_.removeEventListener("dispose",m);const y=o.indexOf(_.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete a[_.id]}function p(){for(const x in s)n.deleteBuffer(s[x]);o=[],s={},a={}}return{bind:c,update:l,dispose:p}}class Ty{constructor(t={}){const{canvas:e=mg(),context:i=null,depth:s=!0,stencil:a=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const x=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=rn,this.toneMapping=ii,this.toneMappingExposure=1;const y=this;let D=!1,b=0,w=0,A=null,E=-1,M=null;const R=new Se,F=new Se;let U=null;const X=new Zt(0);let L=0,C=e.width,W=e.height,H=1,K=null,J=null;const ot=new Se(0,0,C,W),ft=new Se(0,0,C,W);let vt=!1;const j=new Ic;let tt=!1,pt=!1;const Q=new xe,mt=new xe,It=new $,At=new Se,Ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let St=!1;function Mt(){return A===null?H:1}let G=i;function qt(T,Z){return e.getContext(T,Z)}try{const T={alpha:!0,depth:s,stencil:a,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Sc}`),e.addEventListener("webglcontextlost",q,!1),e.addEventListener("webglcontextrestored",lt,!1),e.addEventListener("webglcontextcreationerror",ht,!1),G===null){const Z="webgl2";if(G=qt(Z,T),G===null)throw qt(Z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ut,Ft,bt,yt,Tt,P,S,Y,rt,ct,at,Nt,et,gt,Gt,nt,_t,B,it,ut,Et,zt,Xt,z;function O(){Ut=new Dv(G),Ut.init(),zt=new xy(G,Ut),Ft=new Av(G,Ut,t,zt),bt=new py(G,Ut),Ft.reverseDepthBuffer&&d&&bt.buffers.depth.setReversed(!0),yt=new Uv(G),Tt=new Q_,P=new gy(G,Ut,bt,Tt,Ft,zt,yt),S=new Rv(y),Y=new Lv(y),rt=new Gg(G),Xt=new Ev(G,rt),ct=new Iv(G,rt,yt,Xt),at=new Nv(G,ct,rt,yt),it=new Fv(G,Ft,P),nt=new Tv(Tt),Nt=new J_(y,S,Y,Ut,Ft,Xt,nt),et=new wy(y,Tt),gt=new ey,Gt=new ry(Ut),B=new bv(y,S,Y,bt,at,u,c),_t=new uy(y,at,Ft),z=new Ay(G,yt,Ft,bt),ut=new wv(G,Ut,yt),Et=new kv(G,Ut,yt),yt.programs=Nt.programs,y.capabilities=Ft,y.extensions=Ut,y.properties=Tt,y.renderLists=gt,y.shadowMap=_t,y.state=bt,y.info=yt}O();const V=new by(y,G);this.xr=V,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const T=Ut.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ut.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(T){T!==void 0&&(H=T,this.setSize(C,W,!1))},this.getSize=function(T){return T.set(C,W)},this.setSize=function(T,Z,I=!0){if(V.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}C=T,W=Z,e.width=Math.floor(T*H),e.height=Math.floor(Z*H),I===!0&&(e.style.width=T+"px",e.style.height=Z+"px"),this.setViewport(0,0,T,Z)},this.getDrawingBufferSize=function(T){return T.set(C*H,W*H).floor()},this.setDrawingBufferSize=function(T,Z,I){C=T,W=Z,H=I,e.width=Math.floor(T*I),e.height=Math.floor(Z*I),this.setViewport(0,0,T,Z)},this.getCurrentViewport=function(T){return T.copy(R)},this.getViewport=function(T){return T.copy(ot)},this.setViewport=function(T,Z,I,N){T.isVector4?ot.set(T.x,T.y,T.z,T.w):ot.set(T,Z,I,N),bt.viewport(R.copy(ot).multiplyScalar(H).round())},this.getScissor=function(T){return T.copy(ft)},this.setScissor=function(T,Z,I,N){T.isVector4?ft.set(T.x,T.y,T.z,T.w):ft.set(T,Z,I,N),bt.scissor(F.copy(ft).multiplyScalar(H).round())},this.getScissorTest=function(){return vt},this.setScissorTest=function(T){bt.setScissorTest(vt=T)},this.setOpaqueSort=function(T){K=T},this.setTransparentSort=function(T){J=T},this.getClearColor=function(T){return T.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor.apply(B,arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha.apply(B,arguments)},this.clear=function(T=!0,Z=!0,I=!0){let N=0;if(T){let k=!1;if(A!==null){const st=A.texture.format;k=st===Cc||st===Rc||st===Tc}if(k){const st=A.texture.type,dt=st===Wn||st===Ti||st===Fs||st===rs||st===wc||st===Ac,xt=B.getClearColor(),wt=B.getClearAlpha(),Ct=xt.r,Pt=xt.g,kt=xt.b;dt?(g[0]=Ct,g[1]=Pt,g[2]=kt,g[3]=wt,G.clearBufferuiv(G.COLOR,0,g)):(v[0]=Ct,v[1]=Pt,v[2]=kt,v[3]=wt,G.clearBufferiv(G.COLOR,0,v))}else N|=G.COLOR_BUFFER_BIT}Z&&(N|=G.DEPTH_BUFFER_BIT),I&&(N|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",q,!1),e.removeEventListener("webglcontextrestored",lt,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),gt.dispose(),Gt.dispose(),Tt.dispose(),S.dispose(),Y.dispose(),at.dispose(),Xt.dispose(),z.dispose(),Nt.dispose(),V.dispose(),V.removeEventListener("sessionstart",Ee),V.removeEventListener("sessionend",be),ne.stop()};function q(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function lt(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const T=yt.autoReset,Z=_t.enabled,I=_t.autoUpdate,N=_t.needsUpdate,k=_t.type;O(),yt.autoReset=T,_t.enabled=Z,_t.autoUpdate=I,_t.needsUpdate=N,_t.type=k}function ht(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Rt(T){const Z=T.target;Z.removeEventListener("dispose",Rt),Vt(Z)}function Vt(T){Jt(T),Tt.remove(T)}function Jt(T){const Z=Tt.get(T).programs;Z!==void 0&&(Z.forEach(function(I){Nt.releaseProgram(I)}),T.isShaderMaterial&&Nt.releaseShaderCache(T))}this.renderBufferDirect=function(T,Z,I,N,k,st){Z===null&&(Z=Ot);const dt=k.isMesh&&k.matrixWorld.determinant()<0,xt=ce(T,Z,I,N,k);bt.setMaterial(N,dt);let wt=I.index,Ct=1;if(N.wireframe===!0){if(wt=ct.getWireframeAttribute(I),wt===void 0)return;Ct=2}const Pt=I.drawRange,kt=I.attributes.position;let Wt=Pt.start*Ct,Qt=(Pt.start+Pt.count)*Ct;st!==null&&(Wt=Math.max(Wt,st.start*Ct),Qt=Math.min(Qt,(st.start+st.count)*Ct)),wt!==null?(Wt=Math.max(Wt,0),Qt=Math.min(Qt,wt.count)):kt!=null&&(Wt=Math.max(Wt,0),Qt=Math.min(Qt,kt.count));const ie=Qt-Wt;if(ie<0||ie===1/0)return;Xt.setup(k,N,xt,I,wt);let Ce,te=ut;if(wt!==null&&(Ce=rt.get(wt),te=Et,te.setIndex(Ce)),k.isMesh)N.wireframe===!0?(bt.setLineWidth(N.wireframeLinewidth*Mt()),te.setMode(G.LINES)):te.setMode(G.TRIANGLES);else if(k.isLine){let Ht=N.linewidth;Ht===void 0&&(Ht=1),bt.setLineWidth(Ht*Mt()),k.isLineSegments?te.setMode(G.LINES):k.isLineLoop?te.setMode(G.LINE_LOOP):te.setMode(G.LINE_STRIP)}else k.isPoints?te.setMode(G.POINTS):k.isSprite&&te.setMode(G.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)te.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Ut.get("WEBGL_multi_draw"))te.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Ht=k._multiDrawStarts,Ve=k._multiDrawCounts,se=k._multiDrawCount,we=wt?rt.get(wt).bytesPerElement:1,$n=Tt.get(N).currentProgram.getUniforms();for(let Xe=0;Xe<se;Xe++)$n.setValue(G,"_gl_DrawID",Xe),te.render(Ht[Xe]/we,Ve[Xe])}else if(k.isInstancedMesh)te.renderInstances(Wt,ie,k.count);else if(I.isInstancedBufferGeometry){const Ht=I._maxInstanceCount!==void 0?I._maxInstanceCount:1/0,Ve=Math.min(I.instanceCount,Ht);te.renderInstances(Wt,ie,Ve)}else te.render(Wt,ie)};function Yt(T,Z,I){T.transparent===!0&&T.side===Le&&T.forceSinglePass===!1?(T.side=Qe,T.needsUpdate=!0,$t(T,Z,I),T.side=si,T.needsUpdate=!0,$t(T,Z,I),T.side=Le):$t(T,Z,I)}this.compile=function(T,Z,I=null){I===null&&(I=T),p=Gt.get(I),p.init(Z),_.push(p),I.traverseVisible(function(k){k.isLight&&k.layers.test(Z.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),T!==I&&T.traverseVisible(function(k){k.isLight&&k.layers.test(Z.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();const N=new Set;return T.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const st=k.material;if(st)if(Array.isArray(st))for(let dt=0;dt<st.length;dt++){const xt=st[dt];Yt(xt,I,k),N.add(xt)}else Yt(st,I,k),N.add(st)}),_.pop(),p=null,N},this.compileAsync=function(T,Z,I=null){const N=this.compile(T,Z,I);return new Promise(k=>{function st(){if(N.forEach(function(dt){Tt.get(dt).currentProgram.isReady()&&N.delete(dt)}),N.size===0){k(T);return}setTimeout(st,10)}Ut.get("KHR_parallel_shader_compile")!==null?st():setTimeout(st,10)})};let oe=null;function ve(T){oe&&oe(T)}function Ee(){ne.stop()}function be(){ne.start()}const ne=new zd;ne.setAnimationLoop(ve),typeof self<"u"&&ne.setContext(self),this.setAnimationLoop=function(T){oe=T,V.setAnimationLoop(T),T===null?ne.stop():ne.start()},V.addEventListener("sessionstart",Ee),V.addEventListener("sessionend",be),this.render=function(T,Z){if(Z!==void 0&&Z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),Z.parent===null&&Z.matrixWorldAutoUpdate===!0&&Z.updateMatrixWorld(),V.enabled===!0&&V.isPresenting===!0&&(V.cameraAutoUpdate===!0&&V.updateCamera(Z),Z=V.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,Z,A),p=Gt.get(T,_.length),p.init(Z),_.push(p),mt.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),j.setFromProjectionMatrix(mt),pt=this.localClippingEnabled,tt=nt.init(this.clippingPlanes,pt),m=gt.get(T,x.length),m.init(),x.push(m),V.enabled===!0&&V.isPresenting===!0){const st=y.xr.getDepthSensingMesh();st!==null&&re(st,Z,-1/0,y.sortObjects)}re(T,Z,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(K,J),St=V.enabled===!1||V.isPresenting===!1||V.hasDepthSensing()===!1,St&&B.addToRenderList(m,T),this.info.render.frame++,tt===!0&&nt.beginShadows();const I=p.state.shadowsArray;_t.render(I,T,Z),tt===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const N=m.opaque,k=m.transmissive;if(p.setupLights(),Z.isArrayCamera){const st=Z.cameras;if(k.length>0)for(let dt=0,xt=st.length;dt<xt;dt++){const wt=st[dt];Re(N,k,T,wt)}St&&B.render(T);for(let dt=0,xt=st.length;dt<xt;dt++){const wt=st[dt];_e(m,T,wt,wt.viewport)}}else k.length>0&&Re(N,k,T,Z),St&&B.render(T),_e(m,T,Z);A!==null&&(P.updateMultisampleRenderTarget(A),P.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(y,T,Z),Xt.resetDefaultState(),E=-1,M=null,_.pop(),_.length>0?(p=_[_.length-1],tt===!0&&nt.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function re(T,Z,I,N){if(T.visible===!1)return;if(T.layers.test(Z.layers)){if(T.isGroup)I=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(Z);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||j.intersectsSprite(T)){N&&At.setFromMatrixPosition(T.matrixWorld).applyMatrix4(mt);const dt=at.update(T),xt=T.material;xt.visible&&m.push(T,dt,xt,I,At.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||j.intersectsObject(T))){const dt=at.update(T),xt=T.material;if(N&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),At.copy(T.boundingSphere.center)):(dt.boundingSphere===null&&dt.computeBoundingSphere(),At.copy(dt.boundingSphere.center)),At.applyMatrix4(T.matrixWorld).applyMatrix4(mt)),Array.isArray(xt)){const wt=dt.groups;for(let Ct=0,Pt=wt.length;Ct<Pt;Ct++){const kt=wt[Ct],Wt=xt[kt.materialIndex];Wt&&Wt.visible&&m.push(T,dt,Wt,I,At.z,kt)}}else xt.visible&&m.push(T,dt,xt,I,At.z,null)}}const st=T.children;for(let dt=0,xt=st.length;dt<xt;dt++)re(st[dt],Z,I,N)}function _e(T,Z,I,N){const k=T.opaque,st=T.transmissive,dt=T.transparent;p.setupLightsView(I),tt===!0&&nt.setGlobalState(y.clippingPlanes,I),N&&bt.viewport(R.copy(N)),k.length>0&&Fe(k,Z,I),st.length>0&&Fe(st,Z,I),dt.length>0&&Fe(dt,Z,I),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function Re(T,Z,I,N){if((I.isScene===!0?I.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[N.id]===void 0&&(p.state.transmissionRenderTarget[N.id]=new Ri(1,1,{generateMipmaps:!0,type:Ut.has("EXT_color_buffer_half_float")||Ut.has("EXT_color_buffer_float")?Vs:Wn,minFilter:Ei,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ae.workingColorSpace}));const st=p.state.transmissionRenderTarget[N.id],dt=N.viewport||R;st.setSize(dt.z,dt.w);const xt=y.getRenderTarget();y.setRenderTarget(st),y.getClearColor(X),L=y.getClearAlpha(),L<1&&y.setClearColor(16777215,.5),y.clear(),St&&B.render(I);const wt=y.toneMapping;y.toneMapping=ii;const Ct=N.viewport;if(N.viewport!==void 0&&(N.viewport=void 0),p.setupLightsView(N),tt===!0&&nt.setGlobalState(y.clippingPlanes,N),Fe(T,I,N),P.updateMultisampleRenderTarget(st),P.updateRenderTargetMipmap(st),Ut.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let kt=0,Wt=Z.length;kt<Wt;kt++){const Qt=Z[kt],ie=Qt.object,Ce=Qt.geometry,te=Qt.material,Ht=Qt.group;if(te.side===Le&&ie.layers.test(N.layers)){const Ve=te.side;te.side=Qe,te.needsUpdate=!0,Dt(ie,I,N,Ce,te,Ht),te.side=Ve,te.needsUpdate=!0,Pt=!0}}Pt===!0&&(P.updateMultisampleRenderTarget(st),P.updateRenderTargetMipmap(st))}y.setRenderTarget(xt),y.setClearColor(X,L),Ct!==void 0&&(N.viewport=Ct),y.toneMapping=wt}function Fe(T,Z,I){const N=Z.isScene===!0?Z.overrideMaterial:null;for(let k=0,st=T.length;k<st;k++){const dt=T[k],xt=dt.object,wt=dt.geometry,Ct=N===null?dt.material:N,Pt=dt.group;xt.layers.test(I.layers)&&Dt(xt,Z,I,wt,Ct,Pt)}}function Dt(T,Z,I,N,k,st){T.onBeforeRender(y,Z,I,N,k,st),T.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),k.onBeforeRender(y,Z,I,N,T,st),k.transparent===!0&&k.side===Le&&k.forceSinglePass===!1?(k.side=Qe,k.needsUpdate=!0,y.renderBufferDirect(I,Z,N,k,T,st),k.side=si,k.needsUpdate=!0,y.renderBufferDirect(I,Z,N,k,T,st),k.side=Le):y.renderBufferDirect(I,Z,N,k,T,st),T.onAfterRender(y,Z,I,N,k,st)}function $t(T,Z,I){Z.isScene!==!0&&(Z=Ot);const N=Tt.get(T),k=p.state.lights,st=p.state.shadowsArray,dt=k.state.version,xt=Nt.getParameters(T,k.state,st,Z,I),wt=Nt.getProgramCacheKey(xt);let Ct=N.programs;N.environment=T.isMeshStandardMaterial?Z.environment:null,N.fog=Z.fog,N.envMap=(T.isMeshStandardMaterial?Y:S).get(T.envMap||N.environment),N.envMapRotation=N.environment!==null&&T.envMap===null?Z.environmentRotation:T.envMapRotation,Ct===void 0&&(T.addEventListener("dispose",Rt),Ct=new Map,N.programs=Ct);let Pt=Ct.get(wt);if(Pt!==void 0){if(N.currentProgram===Pt&&N.lightsStateVersion===dt)return Oe(T,xt),Pt}else xt.uniforms=Nt.getUniforms(T),T.onBeforeCompile(xt,y),Pt=Nt.acquireProgram(xt,wt),Ct.set(wt,Pt),N.uniforms=xt.uniforms;const kt=N.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(kt.clippingPlanes=nt.uniform),Oe(T,xt),N.needsLights=cn(T),N.lightsStateVersion=dt,N.needsLights&&(kt.ambientLightColor.value=k.state.ambient,kt.lightProbe.value=k.state.probe,kt.directionalLights.value=k.state.directional,kt.directionalLightShadows.value=k.state.directionalShadow,kt.spotLights.value=k.state.spot,kt.spotLightShadows.value=k.state.spotShadow,kt.rectAreaLights.value=k.state.rectArea,kt.ltc_1.value=k.state.rectAreaLTC1,kt.ltc_2.value=k.state.rectAreaLTC2,kt.pointLights.value=k.state.point,kt.pointLightShadows.value=k.state.pointShadow,kt.hemisphereLights.value=k.state.hemi,kt.directionalShadowMap.value=k.state.directionalShadowMap,kt.directionalShadowMatrix.value=k.state.directionalShadowMatrix,kt.spotShadowMap.value=k.state.spotShadowMap,kt.spotLightMatrix.value=k.state.spotLightMatrix,kt.spotLightMap.value=k.state.spotLightMap,kt.pointShadowMap.value=k.state.pointShadowMap,kt.pointShadowMatrix.value=k.state.pointShadowMatrix),N.currentProgram=Pt,N.uniformsList=null,Pt}function ue(T){if(T.uniformsList===null){const Z=T.currentProgram.getUniforms();T.uniformsList=ka.seqWithValue(Z.seq,T.uniforms)}return T.uniformsList}function Oe(T,Z){const I=Tt.get(T);I.outputColorSpace=Z.outputColorSpace,I.batching=Z.batching,I.batchingColor=Z.batchingColor,I.instancing=Z.instancing,I.instancingColor=Z.instancingColor,I.instancingMorph=Z.instancingMorph,I.skinning=Z.skinning,I.morphTargets=Z.morphTargets,I.morphNormals=Z.morphNormals,I.morphColors=Z.morphColors,I.morphTargetsCount=Z.morphTargetsCount,I.numClippingPlanes=Z.numClippingPlanes,I.numIntersection=Z.numClipIntersection,I.vertexAlphas=Z.vertexAlphas,I.vertexTangents=Z.vertexTangents,I.toneMapping=Z.toneMapping}function ce(T,Z,I,N,k){Z.isScene!==!0&&(Z=Ot),P.resetTextureUnits();const st=Z.fog,dt=N.isMeshStandardMaterial?Z.environment:null,xt=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:hs,wt=(N.isMeshStandardMaterial?Y:S).get(N.envMap||dt),Ct=N.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,Pt=!!I.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),kt=!!I.morphAttributes.position,Wt=!!I.morphAttributes.normal,Qt=!!I.morphAttributes.color;let ie=ii;N.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ie=y.toneMapping);const Ce=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,te=Ce!==void 0?Ce.length:0,Ht=Tt.get(N),Ve=p.state.lights;if(tt===!0&&(pt===!0||T!==M)){const We=T===M&&N.id===E;nt.setState(N,T,We)}let se=!1;N.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==Ve.state.version||Ht.outputColorSpace!==xt||k.isBatchedMesh&&Ht.batching===!1||!k.isBatchedMesh&&Ht.batching===!0||k.isBatchedMesh&&Ht.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Ht.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Ht.instancing===!1||!k.isInstancedMesh&&Ht.instancing===!0||k.isSkinnedMesh&&Ht.skinning===!1||!k.isSkinnedMesh&&Ht.skinning===!0||k.isInstancedMesh&&Ht.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Ht.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Ht.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Ht.instancingMorph===!1&&k.morphTexture!==null||Ht.envMap!==wt||N.fog===!0&&Ht.fog!==st||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==nt.numPlanes||Ht.numIntersection!==nt.numIntersection)||Ht.vertexAlphas!==Ct||Ht.vertexTangents!==Pt||Ht.morphTargets!==kt||Ht.morphNormals!==Wt||Ht.morphColors!==Qt||Ht.toneMapping!==ie||Ht.morphTargetsCount!==te)&&(se=!0):(se=!0,Ht.__version=N.version);let we=Ht.currentProgram;se===!0&&(we=$t(N,Z,k));let $n=!1,Xe=!1,oi=!1;const fe=we.getUniforms(),ln=Ht.uniforms;if(bt.useProgram(we.program)&&($n=!0,Xe=!0,oi=!0),N.id!==E&&(E=N.id,Xe=!0),$n||M!==T){bt.buffers.depth.getReversed()?(Q.copy(T.projectionMatrix),xg(Q),vg(Q),fe.setValue(G,"projectionMatrix",Q)):fe.setValue(G,"projectionMatrix",T.projectionMatrix),fe.setValue(G,"viewMatrix",T.matrixWorldInverse);const bn=fe.map.cameraPosition;bn!==void 0&&bn.setValue(G,It.setFromMatrixPosition(T.matrixWorld)),Ft.logarithmicDepthBuffer&&fe.setValue(G,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&fe.setValue(G,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,Xe=!0,oi=!0)}if(k.isSkinnedMesh){fe.setOptional(G,k,"bindMatrix"),fe.setOptional(G,k,"bindMatrixInverse");const We=k.skeleton;We&&(We.boneTexture===null&&We.computeBoneTexture(),fe.setValue(G,"boneTexture",We.boneTexture,P))}k.isBatchedMesh&&(fe.setOptional(G,k,"batchingTexture"),fe.setValue(G,"batchingTexture",k._matricesTexture,P),fe.setOptional(G,k,"batchingIdTexture"),fe.setValue(G,"batchingIdTexture",k._indirectTexture,P),fe.setOptional(G,k,"batchingColorTexture"),k._colorsTexture!==null&&fe.setValue(G,"batchingColorTexture",k._colorsTexture,P));const Yn=I.morphAttributes;if((Yn.position!==void 0||Yn.normal!==void 0||Yn.color!==void 0)&&it.update(k,I,we),(Xe||Ht.receiveShadow!==k.receiveShadow)&&(Ht.receiveShadow=k.receiveShadow,fe.setValue(G,"receiveShadow",k.receiveShadow)),N.isMeshGouraudMaterial&&N.envMap!==null&&(ln.envMap.value=wt,ln.flipEnvMap.value=wt.isCubeTexture&&wt.isRenderTargetTexture===!1?-1:1),N.isMeshStandardMaterial&&N.envMap===null&&Z.environment!==null&&(ln.envMapIntensity.value=Z.environmentIntensity),Xe&&(fe.setValue(G,"toneMappingExposure",y.toneMappingExposure),Ht.needsLights&&In(ln,oi),st&&N.fog===!0&&et.refreshFogUniforms(ln,st),et.refreshMaterialUniforms(ln,N,H,W,p.state.transmissionRenderTarget[T.id]),ka.upload(G,ue(Ht),ln,P)),N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&(ka.upload(G,ue(Ht),ln,P),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&fe.setValue(G,"center",k.center),fe.setValue(G,"modelViewMatrix",k.modelViewMatrix),fe.setValue(G,"normalMatrix",k.normalMatrix),fe.setValue(G,"modelMatrix",k.matrixWorld),N.isShaderMaterial||N.isRawShaderMaterial){const We=N.uniformsGroups;for(let bn=0,En=We.length;bn<En;bn++){const ps=We[bn];z.update(ps,we),z.bind(ps,we)}}return we}function In(T,Z){T.ambientLightColor.needsUpdate=Z,T.lightProbe.needsUpdate=Z,T.directionalLights.needsUpdate=Z,T.directionalLightShadows.needsUpdate=Z,T.pointLights.needsUpdate=Z,T.pointLightShadows.needsUpdate=Z,T.spotLights.needsUpdate=Z,T.spotLightShadows.needsUpdate=Z,T.rectAreaLights.needsUpdate=Z,T.hemisphereLights.needsUpdate=Z}function cn(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,Z,I){Tt.get(T.texture).__webglTexture=Z,Tt.get(T.depthTexture).__webglTexture=I;const N=Tt.get(T);N.__hasExternalTextures=!0,N.__autoAllocateDepthBuffer=I===void 0,N.__autoAllocateDepthBuffer||Ut.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),N.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,Z){const I=Tt.get(T);I.__webglFramebuffer=Z,I.__useDefaultFramebuffer=Z===void 0},this.setRenderTarget=function(T,Z=0,I=0){A=T,b=Z,w=I;let N=!0,k=null,st=!1,dt=!1;if(T){const wt=Tt.get(T);if(wt.__useDefaultFramebuffer!==void 0)bt.bindFramebuffer(G.FRAMEBUFFER,null),N=!1;else if(wt.__webglFramebuffer===void 0)P.setupRenderTarget(T);else if(wt.__hasExternalTextures)P.rebindTextures(T,Tt.get(T.texture).__webglTexture,Tt.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const kt=T.depthTexture;if(wt.__boundDepthTexture!==kt){if(kt!==null&&Tt.has(kt)&&(T.width!==kt.image.width||T.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(T)}}const Ct=T.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(dt=!0);const Pt=Tt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Pt[Z])?k=Pt[Z][I]:k=Pt[Z],st=!0):T.samples>0&&P.useMultisampledRTT(T)===!1?k=Tt.get(T).__webglMultisampledFramebuffer:Array.isArray(Pt)?k=Pt[I]:k=Pt,R.copy(T.viewport),F.copy(T.scissor),U=T.scissorTest}else R.copy(ot).multiplyScalar(H).floor(),F.copy(ft).multiplyScalar(H).floor(),U=vt;if(bt.bindFramebuffer(G.FRAMEBUFFER,k)&&N&&bt.drawBuffers(T,k),bt.viewport(R),bt.scissor(F),bt.setScissorTest(U),st){const wt=Tt.get(T.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+Z,wt.__webglTexture,I)}else if(dt){const wt=Tt.get(T.texture),Ct=Z||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,wt.__webglTexture,I||0,Ct)}E=-1},this.readRenderTargetPixels=function(T,Z,I,N,k,st,dt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=Tt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&dt!==void 0&&(xt=xt[dt]),xt){bt.bindFramebuffer(G.FRAMEBUFFER,xt);try{const wt=T.texture,Ct=wt.format,Pt=wt.type;if(!Ft.textureFormatReadable(Ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ft.textureTypeReadable(Pt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Z>=0&&Z<=T.width-N&&I>=0&&I<=T.height-k&&G.readPixels(Z,I,N,k,zt.convert(Ct),zt.convert(Pt),st)}finally{const wt=A!==null?Tt.get(A).__webglFramebuffer:null;bt.bindFramebuffer(G.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(T,Z,I,N,k,st,dt){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xt=Tt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&dt!==void 0&&(xt=xt[dt]),xt){const wt=T.texture,Ct=wt.format,Pt=wt.type;if(!Ft.textureFormatReadable(Ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ft.textureTypeReadable(Pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Z>=0&&Z<=T.width-N&&I>=0&&I<=T.height-k){bt.bindFramebuffer(G.FRAMEBUFFER,xt);const kt=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,kt),G.bufferData(G.PIXEL_PACK_BUFFER,st.byteLength,G.STREAM_READ),G.readPixels(Z,I,N,k,zt.convert(Ct),zt.convert(Pt),0);const Wt=A!==null?Tt.get(A).__webglFramebuffer:null;bt.bindFramebuffer(G.FRAMEBUFFER,Wt);const Qt=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await gg(G,Qt,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,kt),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,st),G.deleteBuffer(kt),G.deleteSync(Qt),st}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,Z=null,I=0){T.isTexture!==!0&&(ws("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Z=arguments[0]||null,T=arguments[1]);const N=Math.pow(2,-I),k=Math.floor(T.image.width*N),st=Math.floor(T.image.height*N),dt=Z!==null?Z.x:0,xt=Z!==null?Z.y:0;P.setTexture2D(T,0),G.copyTexSubImage2D(G.TEXTURE_2D,I,0,0,dt,xt,k,st),bt.unbindTexture()},this.copyTextureToTexture=function(T,Z,I=null,N=null,k=0){T.isTexture!==!0&&(ws("WebGLRenderer: copyTextureToTexture function signature has changed."),N=arguments[0]||null,T=arguments[1],Z=arguments[2],k=arguments[3]||0,I=null);let st,dt,xt,wt,Ct,Pt,kt,Wt,Qt;const ie=T.isCompressedTexture?T.mipmaps[k]:T.image;I!==null?(st=I.max.x-I.min.x,dt=I.max.y-I.min.y,xt=I.isBox3?I.max.z-I.min.z:1,wt=I.min.x,Ct=I.min.y,Pt=I.isBox3?I.min.z:0):(st=ie.width,dt=ie.height,xt=ie.depth||1,wt=0,Ct=0,Pt=0),N!==null?(kt=N.x,Wt=N.y,Qt=N.z):(kt=0,Wt=0,Qt=0);const Ce=zt.convert(Z.format),te=zt.convert(Z.type);let Ht;Z.isData3DTexture?(P.setTexture3D(Z,0),Ht=G.TEXTURE_3D):Z.isDataArrayTexture||Z.isCompressedArrayTexture?(P.setTexture2DArray(Z,0),Ht=G.TEXTURE_2D_ARRAY):(P.setTexture2D(Z,0),Ht=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,Z.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,Z.unpackAlignment);const Ve=G.getParameter(G.UNPACK_ROW_LENGTH),se=G.getParameter(G.UNPACK_IMAGE_HEIGHT),we=G.getParameter(G.UNPACK_SKIP_PIXELS),$n=G.getParameter(G.UNPACK_SKIP_ROWS),Xe=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,ie.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ie.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,wt),G.pixelStorei(G.UNPACK_SKIP_ROWS,Ct),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Pt);const oi=T.isDataArrayTexture||T.isData3DTexture,fe=Z.isDataArrayTexture||Z.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const ln=Tt.get(T),Yn=Tt.get(Z),We=Tt.get(ln.__renderTarget),bn=Tt.get(Yn.__renderTarget);bt.bindFramebuffer(G.READ_FRAMEBUFFER,We.__webglFramebuffer),bt.bindFramebuffer(G.DRAW_FRAMEBUFFER,bn.__webglFramebuffer);for(let En=0;En<xt;En++)oi&&G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Tt.get(T).__webglTexture,k,Pt+En),T.isDepthTexture?(fe&&G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Tt.get(Z).__webglTexture,k,Qt+En),G.blitFramebuffer(wt,Ct,st,dt,kt,Wt,st,dt,G.DEPTH_BUFFER_BIT,G.NEAREST)):fe?G.copyTexSubImage3D(Ht,k,kt,Wt,Qt+En,wt,Ct,st,dt):G.copyTexSubImage2D(Ht,k,kt,Wt,Qt+En,wt,Ct,st,dt);bt.bindFramebuffer(G.READ_FRAMEBUFFER,null),bt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else fe?T.isDataTexture||T.isData3DTexture?G.texSubImage3D(Ht,k,kt,Wt,Qt,st,dt,xt,Ce,te,ie.data):Z.isCompressedArrayTexture?G.compressedTexSubImage3D(Ht,k,kt,Wt,Qt,st,dt,xt,Ce,ie.data):G.texSubImage3D(Ht,k,kt,Wt,Qt,st,dt,xt,Ce,te,ie):T.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,k,kt,Wt,st,dt,Ce,te,ie.data):T.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,k,kt,Wt,ie.width,ie.height,Ce,ie.data):G.texSubImage2D(G.TEXTURE_2D,k,kt,Wt,st,dt,Ce,te,ie);G.pixelStorei(G.UNPACK_ROW_LENGTH,Ve),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,se),G.pixelStorei(G.UNPACK_SKIP_PIXELS,we),G.pixelStorei(G.UNPACK_SKIP_ROWS,$n),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Xe),k===0&&Z.generateMipmaps&&G.generateMipmap(Ht),bt.unbindTexture()},this.copyTextureToTexture3D=function(T,Z,I=null,N=null,k=0){return T.isTexture!==!0&&(ws("WebGLRenderer: copyTextureToTexture3D function signature has changed."),I=arguments[0]||null,N=arguments[1]||null,T=arguments[2],Z=arguments[3],k=arguments[4]||0),ws('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,Z,I,N,k)},this.initRenderTarget=function(T){Tt.get(T).__webglFramebuffer===void 0&&P.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?P.setTextureCube(T,0):T.isData3DTexture?P.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?P.setTexture2DArray(T,0):P.setTexture2D(T,0),bt.unbindTexture()},this.resetState=function(){b=0,w=0,A=null,bt.reset(),Xt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=ae._getUnpackColorSpace()}}class Ry extends Te{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Pn,this.environmentIntensity=1,this.environmentRotation=new Pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Uc extends us{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ja=new $,Ka=new $,Ph=new xe,Es=new Lc,_a=new eo,Jo=new $,Lh=new $;class Cy extends Te{constructor(t=new ze,e=new Uc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)ja.fromBufferAttribute(e,s-1),Ka.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=ja.distanceTo(Ka);t.setAttribute("lineDistance",new pe(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),_a.copy(i.boundingSphere),_a.applyMatrix4(s),_a.radius+=a,t.ray.intersectsSphere(_a)===!1)return;Ph.copy(s).invert(),Es.copy(t.ray).applyMatrix4(Ph);const r=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=u,m=g-1;v<m;v+=l){const p=h.getX(v),x=h.getX(v+1),_=ya(this,t,Es,c,p,x);_&&e.push(_)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(u),p=ya(this,t,Es,c,v,m);p&&e.push(p)}}else{const u=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=u,m=g-1;v<m;v+=l){const p=ya(this,t,Es,c,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=ya(this,t,Es,c,g-1,u);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}}function ya(n,t,e,i,s,a){const o=n.geometry.attributes.position;if(ja.fromBufferAttribute(o,s),Ka.fromBufferAttribute(o,a),e.distanceSqToSegment(ja,Ka,Jo,Lh)>i)return;Jo.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Jo);if(!(c<t.near||c>t.far))return{distance:c,point:Lh.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const Dh=new $,Ih=new $;class Wd extends Cy{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)Dh.fromBufferAttribute(e,s),Ih.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Dh.distanceTo(Ih);t.setAttribute("lineDistance",new pe(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Py extends qe{constructor(t,e,i,s,a,o,r,c,l){super(t,e,i,s,a,o,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Dn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),a=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),a+=i.distanceTo(s),e.push(a),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const a=i.length;let o;e?o=e:o=t*i[a-1];let r=0,c=a-1,l;for(;r<=c;)if(s=Math.floor(r+(c-r)/2),l=i[s]-o,l<0)r=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(a-1);const h=i[s],d=i[s+1]-h,u=(o-h)/d;return(s+u)/(a-1)}getTangent(t,e){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);const o=this.getPoint(s),r=this.getPoint(a),c=e||(o.isVector2?new Bt:new $);return c.copy(r).sub(o).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new $,s=[],a=[],o=[],r=new $,c=new xe;for(let u=0;u<=t;u++){const g=u/t;s[u]=this.getTangentAt(g,new $)}a[0]=new $,o[0]=new $;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),f<=l&&(l=f,i.set(0,1,0)),d<=l&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],r),o[0].crossVectors(s[0],a[0]);for(let u=1;u<=t;u++){if(a[u]=a[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(s[u-1],s[u]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(Ne(s[u-1].dot(s[u]),-1,1));a[u].applyMatrix4(c.makeRotationAxis(r,g))}o[u].crossVectors(s[u],a[u])}if(e===!0){let u=Math.acos(Ne(a[0].dot(a[t]),-1,1));u/=t,s[0].dot(r.crossVectors(a[0],a[t]))>0&&(u=-u);for(let g=1;g<=t;g++)a[g].applyMatrix4(c.makeRotationAxis(s[g],u*g)),o[g].crossVectors(s[g],a[g])}return{tangents:s,normals:a,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Fc extends Dn{constructor(t=0,e=0,i=1,s=1,a=0,o=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=o,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Bt){const i=e,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const o=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(o?a=0:a=s),this.aClockwise===!0&&!o&&(a===s?a=-s:a=a-s);const r=this.aStartAngle+t*a;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=c-this.aX,u=l-this.aY;c=d*h-u*f+this.aX,l=d*f+u*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Ly extends Fc{constructor(t,e,i,s,a,o){super(t,e,i,i,s,a,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Nc(){let n=0,t=0,e=0,i=0;function s(a,o,r,c){n=a,t=r,e=-3*a+3*o-2*r-c,i=2*a-2*o+r+c}return{initCatmullRom:function(a,o,r,c,l){s(o,r,l*(r-a),l*(c-o))},initNonuniformCatmullRom:function(a,o,r,c,l,h,f){let d=(o-a)/l-(r-a)/(l+h)+(r-o)/h,u=(r-o)/h-(c-o)/(h+f)+(c-r)/f;d*=h,u*=h,s(o,r,d,u)},calc:function(a){const o=a*a,r=o*a;return n+t*a+e*o+i*r}}}const Ma=new $,Qo=new Nc,tr=new Nc,er=new Nc;class Dy extends Dn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new $){const i=e,s=this.points,a=s.length,o=(a-(this.closed?0:1))*t;let r=Math.floor(o),c=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/a)+1)*a:c===0&&r===a-1&&(r=a-2,c=1);let l,h;this.closed||r>0?l=s[(r-1)%a]:(Ma.subVectors(s[0],s[1]).add(s[0]),l=Ma);const f=s[r%a],d=s[(r+1)%a];if(this.closed||r+2<a?h=s[(r+2)%a]:(Ma.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=Ma),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(f),u),v=Math.pow(f.distanceToSquared(d),u),m=Math.pow(d.distanceToSquared(h),u);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Qo.initNonuniformCatmullRom(l.x,f.x,d.x,h.x,g,v,m),tr.initNonuniformCatmullRom(l.y,f.y,d.y,h.y,g,v,m),er.initNonuniformCatmullRom(l.z,f.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Qo.initCatmullRom(l.x,f.x,d.x,h.x,this.tension),tr.initCatmullRom(l.y,f.y,d.y,h.y,this.tension),er.initCatmullRom(l.z,f.z,d.z,h.z,this.tension));return i.set(Qo.calc(c),tr.calc(c),er.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new $().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function kh(n,t,e,i,s){const a=(i-t)*.5,o=(s-e)*.5,r=n*n,c=n*r;return(2*e-2*i+a+o)*c+(-3*e+3*i-2*a-o)*r+a*n+e}function Iy(n,t){const e=1-n;return e*e*t}function ky(n,t){return 2*(1-n)*n*t}function Uy(n,t){return n*n*t}function Cs(n,t,e,i){return Iy(n,t)+ky(n,e)+Uy(n,i)}function Fy(n,t){const e=1-n;return e*e*e*t}function Ny(n,t){const e=1-n;return 3*e*e*n*t}function zy(n,t){return 3*(1-n)*n*n*t}function Oy(n,t){return n*n*n*t}function Ps(n,t,e,i,s){return Fy(n,t)+Ny(n,e)+zy(n,i)+Oy(n,s)}class $d extends Dn{constructor(t=new Bt,e=new Bt,i=new Bt,s=new Bt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Bt){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(Ps(t,s.x,a.x,o.x,r.x),Ps(t,s.y,a.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class By extends Dn{constructor(t=new $,e=new $,i=new $,s=new $){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new $){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(Ps(t,s.x,a.x,o.x,r.x),Ps(t,s.y,a.y,o.y,r.y),Ps(t,s.z,a.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Yd extends Dn{constructor(t=new Bt,e=new Bt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Bt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Bt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Hy extends Dn{constructor(t=new $,e=new $){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new $){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new $){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Zd extends Dn{constructor(t=new Bt,e=new Bt,i=new Bt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Bt){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(Cs(t,s.x,a.x,o.x),Cs(t,s.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Gy extends Dn{constructor(t=new $,e=new $,i=new $){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new $){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(Cs(t,s.x,a.x,o.x),Cs(t,s.y,a.y,o.y),Cs(t,s.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class qd extends Dn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Bt){const i=e,s=this.points,a=(s.length-1)*t,o=Math.floor(a),r=a-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],f=s[o>s.length-3?s.length-1:o+2];return i.set(kh(r,c.x,l.x,h.x,f.x),kh(r,c.y,l.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Bt().fromArray(s))}return this}}var Uh=Object.freeze({__proto__:null,ArcCurve:Ly,CatmullRomCurve3:Dy,CubicBezierCurve:$d,CubicBezierCurve3:By,EllipseCurve:Fc,LineCurve:Yd,LineCurve3:Hy,QuadraticBezierCurve:Zd,QuadraticBezierCurve3:Gy,SplineCurve:qd});class Vy extends Dn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Uh[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const o=s[a]-i,r=this.curves[a],c=r.getLength(),l=c===0?0:1-o/c;return r.getPointAt(l,e)}a++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const o=a[s],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(r);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new Uh[s.type]().fromJSON(s))}return this}}class Fh extends Vy{constructor(t){super(),this.type="Path",this.currentPoint=new Bt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Yd(this.currentPoint.clone(),new Bt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const a=new Zd(this.currentPoint.clone(),new Bt(t,e),new Bt(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,a,o){const r=new $d(this.currentPoint.clone(),new Bt(t,e),new Bt(i,s),new Bt(a,o));return this.curves.push(r),this.currentPoint.set(a,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new qd(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,a,o){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,s,a,o),this}absarc(t,e,i,s,a,o){return this.absellipse(t,e,i,i,s,a,o),this}ellipse(t,e,i,s,a,o,r,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,a,o,r,c),this}absellipse(t,e,i,s,a,o,r,c){const l=new Fc(t,e,i,s,a,o,r,c);if(this.curves.length>0){const f=l.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class zc extends ze{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const a=[],o=[],r=[],c=[],l=new $,h=new Bt;o.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*s;l.x=t*Math.cos(u),l.y=t*Math.sin(u),o.push(l.x,l.y,l.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let f=1;f<=e;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new pe(o,3)),this.setAttribute("normal",new pe(r,3)),this.setAttribute("uv",new pe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zc(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Oc extends ze{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],o=[];r(s),l(i),h(),this.setAttribute("position",new pe(a,3)),this.setAttribute("normal",new pe(a.slice(),3)),this.setAttribute("uv",new pe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const _=new $,y=new $,D=new $;for(let b=0;b<e.length;b+=3)u(e[b+0],_),u(e[b+1],y),u(e[b+2],D),c(_,y,D,x)}function c(x,_,y,D){const b=D+1,w=[];for(let A=0;A<=b;A++){w[A]=[];const E=x.clone().lerp(y,A/b),M=_.clone().lerp(y,A/b),R=b-A;for(let F=0;F<=R;F++)F===0&&A===b?w[A][F]=E:w[A][F]=E.clone().lerp(M,F/R)}for(let A=0;A<b;A++)for(let E=0;E<2*(b-A)-1;E++){const M=Math.floor(E/2);E%2===0?(d(w[A][M+1]),d(w[A+1][M]),d(w[A][M])):(d(w[A][M+1]),d(w[A+1][M+1]),d(w[A+1][M]))}}function l(x){const _=new $;for(let y=0;y<a.length;y+=3)_.x=a[y+0],_.y=a[y+1],_.z=a[y+2],_.normalize().multiplyScalar(x),a[y+0]=_.x,a[y+1]=_.y,a[y+2]=_.z}function h(){const x=new $;for(let _=0;_<a.length;_+=3){x.x=a[_+0],x.y=a[_+1],x.z=a[_+2];const y=m(x)/2/Math.PI+.5,D=p(x)/Math.PI+.5;o.push(y,1-D)}g(),f()}function f(){for(let x=0;x<o.length;x+=6){const _=o[x+0],y=o[x+2],D=o[x+4],b=Math.max(_,y,D),w=Math.min(_,y,D);b>.9&&w<.1&&(_<.2&&(o[x+0]+=1),y<.2&&(o[x+2]+=1),D<.2&&(o[x+4]+=1))}}function d(x){a.push(x.x,x.y,x.z)}function u(x,_){const y=x*3;_.x=t[y+0],_.y=t[y+1],_.z=t[y+2]}function g(){const x=new $,_=new $,y=new $,D=new $,b=new Bt,w=new Bt,A=new Bt;for(let E=0,M=0;E<a.length;E+=9,M+=6){x.set(a[E+0],a[E+1],a[E+2]),_.set(a[E+3],a[E+4],a[E+5]),y.set(a[E+6],a[E+7],a[E+8]),b.set(o[M+0],o[M+1]),w.set(o[M+2],o[M+3]),A.set(o[M+4],o[M+5]),D.copy(x).add(_).add(y).divideScalar(3);const R=m(D);v(b,M+0,x,R),v(w,M+2,_,R),v(A,M+4,y,R)}}function v(x,_,y,D){D<0&&x.x===1&&(o[_]=x.x-1),y.x===0&&y.z===0&&(o[_]=D/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oc(t.vertices,t.indices,t.radius,t.details)}}const Sa=new $,ba=new $,nr=new $,Ea=new mn;class Xy extends ze{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(ns*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:v,b:m,c:p}=Ea;if(v.fromBufferAttribute(r,l[0]),m.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),Ea.getNormal(nr),f[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const _=(x+1)%3,y=f[x],D=f[_],b=Ea[h[x]],w=Ea[h[_]],A=`${y}_${D}`,E=`${D}_${y}`;E in d&&d[E]?(nr.dot(d[E].normal)<=a&&(u.push(b.x,b.y,b.z),u.push(w.x,w.y,w.z)),d[E]=null):A in d||(d[A]={index0:l[x],index1:l[_],normal:nr.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];Sa.fromBufferAttribute(r,v),ba.fromBufferAttribute(r,m),u.push(Sa.x,Sa.y,Sa.z),u.push(ba.x,ba.y,ba.z)}this.setAttribute("position",new pe(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class jd extends Fh{constructor(t){super(t),this.uuid=Pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Fh().fromJSON(s))}return this}}const Wy={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let a=Kd(n,0,s,e,!0);const o=[];if(!a||a.next===a.prev)return o;let r,c,l,h,f,d,u;if(i&&(a=jy(n,t,a,e)),n.length>80*e){r=l=n[0],c=h=n[1];for(let g=e;g<s;g+=e)f=n[g],d=n[g+1],f<r&&(r=f),d<c&&(c=d),f>l&&(l=f),d>h&&(h=d);u=Math.max(l-r,h-c),u=u!==0?32767/u:0}return zs(a,o,e,r,c,u,0),o}};function Kd(n,t,e,i,s){let a,o;if(s===rM(n,t,e,i)>0)for(a=t;a<e;a+=i)o=Nh(a,n[a],n[a+1],o);else for(a=e-i;a>=t;a-=i)o=Nh(a,n[a],n[a+1],o);return o&&io(o,o.next)&&(Bs(o),o=o.next),o}function Ci(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(io(e,e.next)||Me(e.prev,e,e.next)===0)){if(Bs(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function zs(n,t,e,i,s,a,o){if(!n)return;!o&&a&&eM(n,i,s,a);let r=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,a?Yy(n,i,s,a):$y(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Bs(n),n=l.next,r=l.next;continue}if(n=l,n===r){o?o===1?(n=Zy(Ci(n),t,e),zs(n,t,e,i,s,a,2)):o===2&&qy(n,t,e,i,s,a):zs(Ci(n),t,e,i,s,a,1);break}}}function $y(n){const t=n.prev,e=n,i=n.next;if(Me(t,e,i)>=0)return!1;const s=t.x,a=e.x,o=i.x,r=t.y,c=e.y,l=i.y,h=s<a?s<o?s:o:a<o?a:o,f=r<c?r<l?r:l:c<l?c:l,d=s>a?s>o?s:o:a>o?a:o,u=r>c?r>l?r:l:c>l?c:l;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=f&&g.y<=u&&Qi(s,r,a,c,o,l,g.x,g.y)&&Me(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Yy(n,t,e,i){const s=n.prev,a=n,o=n.next;if(Me(s,a,o)>=0)return!1;const r=s.x,c=a.x,l=o.x,h=s.y,f=a.y,d=o.y,u=r<c?r<l?r:l:c<l?c:l,g=h<f?h<d?h:d:f<d?f:d,v=r>c?r>l?r:l:c>l?c:l,m=h>f?h>d?h:d:f>d?f:d,p=rc(u,g,t,e,i),x=rc(v,m,t,e,i);let _=n.prevZ,y=n.nextZ;for(;_&&_.z>=p&&y&&y.z<=x;){if(_.x>=u&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&Qi(r,h,c,f,l,d,_.x,_.y)&&Me(_.prev,_,_.next)>=0||(_=_.prevZ,y.x>=u&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Qi(r,h,c,f,l,d,y.x,y.y)&&Me(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;_&&_.z>=p;){if(_.x>=u&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&Qi(r,h,c,f,l,d,_.x,_.y)&&Me(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;y&&y.z<=x;){if(y.x>=u&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Qi(r,h,c,f,l,d,y.x,y.y)&&Me(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Zy(n,t,e){let i=n;do{const s=i.prev,a=i.next.next;!io(s,a)&&Jd(s,i,i.next,a)&&Os(s,a)&&Os(a,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(a.i/e|0),Bs(i),Bs(i.next),i=n=a),i=i.next}while(i!==n);return Ci(i)}function qy(n,t,e,i,s,a){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&sM(o,r)){let c=Qd(o,r);o=Ci(o,o.next),c=Ci(c,c.next),zs(o,t,e,i,s,a,0),zs(c,t,e,i,s,a,0);return}r=r.next}o=o.next}while(o!==n)}function jy(n,t,e,i){const s=[];let a,o,r,c,l;for(a=0,o=t.length;a<o;a++)r=t[a]*i,c=a<o-1?t[a+1]*i:n.length,l=Kd(n,r,c,i,!1),l===l.next&&(l.steiner=!0),s.push(iM(l));for(s.sort(Ky),a=0;a<s.length;a++)e=Jy(s[a],e);return e}function Ky(n,t){return n.x-t.x}function Jy(n,t){const e=Qy(n,t);if(!e)return t;const i=Qd(e,n);return Ci(i,i.next),Ci(e,e.next)}function Qy(n,t){let e=t,i=-1/0,s;const a=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=a&&d>i&&(i=d,s=e.x<e.next.x?e:e.next,d===a))return s}e=e.next}while(e!==t);if(!s)return null;const r=s,c=s.x,l=s.y;let h=1/0,f;e=s;do a>=e.x&&e.x>=c&&a!==e.x&&Qi(o<l?a:i,o,c,l,o<l?i:a,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(a-e.x),Os(e,n)&&(f<h||f===h&&(e.x>s.x||e.x===s.x&&tM(s,e)))&&(s=e,h=f)),e=e.next;while(e!==r);return s}function tM(n,t){return Me(n.prev,n,t.prev)<0&&Me(t.next,n,n.next)<0}function eM(n,t,e,i){let s=n;do s.z===0&&(s.z=rc(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,nM(s)}function nM(n){let t,e,i,s,a,o,r,c,l=1;do{for(e=n,n=null,a=null,o=0;e;){for(o++,i=e,r=0,t=0;t<l&&(r++,i=i.nextZ,!!i);t++);for(c=l;r>0||c>0&&i;)r!==0&&(c===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,r--):(s=i,i=i.nextZ,c--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;e=i}a.nextZ=null,l*=2}while(o>1);return n}function rc(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function iM(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Qi(n,t,e,i,s,a,o,r){return(s-o)*(t-r)>=(n-o)*(a-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(a-r)>=(s-o)*(i-r)}function sM(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!aM(n,t)&&(Os(n,t)&&Os(t,n)&&oM(n,t)&&(Me(n.prev,n,t.prev)||Me(n,t.prev,t))||io(n,t)&&Me(n.prev,n,n.next)>0&&Me(t.prev,t,t.next)>0)}function Me(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function io(n,t){return n.x===t.x&&n.y===t.y}function Jd(n,t,e,i){const s=Aa(Me(n,t,e)),a=Aa(Me(n,t,i)),o=Aa(Me(e,i,n)),r=Aa(Me(e,i,t));return!!(s!==a&&o!==r||s===0&&wa(n,e,t)||a===0&&wa(n,i,t)||o===0&&wa(e,n,i)||r===0&&wa(e,t,i))}function wa(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Aa(n){return n>0?1:n<0?-1:0}function aM(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Jd(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Os(n,t){return Me(n.prev,n,n.next)<0?Me(n,t,n.next)>=0&&Me(n,n.prev,t)>=0:Me(n,t,n.prev)<0||Me(n,n.next,t)<0}function oM(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,a=(n.y+t.y)/2;do e.y>a!=e.next.y>a&&e.next.y!==e.y&&s<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Qd(n,t){const e=new cc(n.i,n.x,n.y),i=new cc(t.i,t.x,t.y),s=n.next,a=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,a.next=i,i.prev=a,i}function Nh(n,t,e,i){const s=new cc(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Bs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function cc(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function rM(n,t,e,i){let s=0;for(let a=t,o=e-i;a<e;a+=i)s+=(n[o]-n[a])*(n[a+1]+n[o+1]),o=a;return s}class Ls{static area(t){const e=t.length;let i=0;for(let s=e-1,a=0;a<e;s=a++)i+=t[s].x*t[a].y-t[a].x*t[s].y;return i*.5}static isClockWise(t){return Ls.area(t)<0}static triangulateShape(t,e){const i=[],s=[],a=[];zh(t),Oh(i,t);let o=t.length;e.forEach(zh);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,Oh(i,e[c]);const r=Wy.triangulate(i,s);for(let c=0;c<r.length;c+=3)a.push(r.slice(c,c+3));return a}}function zh(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Oh(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Bc extends Oc{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Bc(t.radius,t.detail)}}class Hs extends ze{constructor(t=.5,e=1,i=32,s=1,a=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const r=[],c=[],l=[],h=[];let f=t;const d=(e-t)/s,u=new $,g=new Bt;for(let v=0;v<=s;v++){for(let m=0;m<=i;m++){const p=a+m/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),c.push(u.x,u.y,u.z),l.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,h.push(g.x,g.y)}f+=d}for(let v=0;v<s;v++){const m=v*(i+1);for(let p=0;p<i;p++){const x=p+m,_=x,y=x+i+1,D=x+i+2,b=x+1;r.push(_,y,b),r.push(y,D,b)}}this.setIndex(r),this.setAttribute("position",new pe(c,3)),this.setAttribute("normal",new pe(l,3)),this.setAttribute("uv",new pe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Hc extends ze{constructor(t=new jd([new Bt(0,.5),new Bt(-.5,-.5),new Bt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],a=[],o=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(r,c,h),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new pe(s,3)),this.setAttribute("normal",new pe(a,3)),this.setAttribute("uv",new pe(o,2));function l(h){const f=s.length/3,d=h.extractPoints(e);let u=d.shape;const g=d.holes;Ls.isClockWise(u)===!1&&(u=u.reverse());for(let m=0,p=g.length;m<p;m++){const x=g[m];Ls.isClockWise(x)===!0&&(g[m]=x.reverse())}const v=Ls.triangulateShape(u,g);for(let m=0,p=g.length;m<p;m++){const x=g[m];u=u.concat(x)}for(let m=0,p=u.length;m<p;m++){const x=u[m];s.push(x.x,x.y,0),a.push(0,0,1),o.push(x.x,x.y)}for(let m=0,p=v.length;m<p;m++){const x=v[m],_=x[0]+f,y=x[1]+f,D=x[2]+f;i.push(_,y,D),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return cM(e,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];i.push(o)}return new Hc(i,t.curveSegments)}}function cM(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class so extends ze{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const o=[],r=[],c=[],l=[],h=new $,f=new $,d=new $;for(let u=0;u<=i;u++)for(let g=0;g<=s;g++){const v=g/s*a,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(v),f.y=(t+e*Math.cos(m))*Math.sin(v),f.z=e*Math.sin(m),r.push(f.x,f.y,f.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(f,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=s;g++){const v=(s+1)*u+g-1,m=(s+1)*(u-1)+g-1,p=(s+1)*(u-1)+g,x=(s+1)*u+g;o.push(v,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new pe(r,3)),this.setAttribute("normal",new pe(c,3)),this.setAttribute("uv",new pe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new so(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Gs extends us{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Td,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=bc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class tu extends Te{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class lM extends tu{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ir=new xe,Bh=new $,Hh=new $;class hM{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Bt(512,512),this.map=null,this.mapPass=null,this.matrix=new xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ic,this._frameExtents=new Bt(1,1),this._viewportCount=1,this._viewports=[new Se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Bh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Bh),Hh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Hh),e.updateMatrixWorld(),ir.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ir),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ir)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class dM extends hM{constructor(){super(new Od(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class uM extends tu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.shadow=new dM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Gh=new xe;class fM{constructor(t,e,i=0,s=1/0){this.ray=new Lc(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Dc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Gh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Gh),this}intersectObject(t,e=!0,i=[]){return lc(t,this,i,e),i.sort(Vh),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)lc(t[s],this,i,e);return i.sort(Vh),i}}function Vh(n,t){return n.distance-t.distance}function lc(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let o=0,r=a.length;o<r;o++)lc(a[o],t,e,!0)}}class pM extends Wd{constructor(t=10,e=10,i=4473924,s=8947848){i=new Zt(i),s=new Zt(s);const a=e/2,o=t/e,r=t/2,c=[],l=[];for(let d=0,u=0,g=-r;d<=e;d++,g+=o){c.push(-r,0,g,r,0,g),c.push(g,0,-r,g,0,r);const v=d===a?i:s;v.toArray(l,u),u+=3,v.toArray(l,u),u+=3,v.toArray(l,u),u+=3,v.toArray(l,u),u+=3}const h=new ze;h.setAttribute("position",new pe(c,3)),h.setAttribute("color",new pe(l,3));const f=new Uc({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Sc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Sc);const mM={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function gM(n,t,e,i){const s=new un(n.fov,i,.1,200),a=new $,o=new $,r=new $;let c=!1,l=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function d(){const u=(n.pitchDeg+h.pitchDelta)*Math.PI/180,g=n.yawDeg*Math.PI/180;r.set(Math.sin(g)*Math.cos(u),Math.sin(u),Math.cos(g)*Math.cos(u)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return d(),{camera:s,update(u,g,v,m,p=mM){const x=g+.6;if(!c)a.set(u,x,v),c=!0;else{const D=1-Math.exp(-Math.max(n.smoothing,.001)*m);a.x+=(u-a.x)*D,a.y+=(x-a.y)*D,a.z+=(v-a.z)*D}const _=1-Math.exp(-Math.max(t.smoothing,.001)*m);h.distanceScale+=(p.distanceScale-h.distanceScale)*_,h.offsetX+=(p.offsetX-h.offsetX)*_,h.offsetZ+=(p.offsetZ-h.offsetZ)*_,h.pitchDelta+=(p.pitchDelta-h.pitchDelta)*_;const y=1-Math.exp(-Math.max(e.smoothing,.001)*m);h.zoom+=(f-h.zoom)*y,d(),(s.fov!==l||s.fov!==n.fov)&&(s.fov=n.fov,l=n.fov,s.updateProjectionMatrix()),o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},snap(u,g,v){a.set(u,g+.6,v),c=!0,o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),d(),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new $().setFromMatrixColumn(s.matrixWorld,0),g=new $().setFromMatrixColumn(s.matrixWorld,2).negate(),v=Math.hypot(u.x,u.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:u.x/v,rightZ:u.z/v,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...h}}}}const wi=Math.PI*2,fn=1e-6;function en(n,t,e){return n<t?t:n>e?e:n}function eu(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function xM(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function nu(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=xM(n);return i===1?s:e+(s-e)*i}function Xh(n){return(1-Math.sin(n))/2}function Gc(n,t,e){const i=Math.PI/180,s=en(Number.isFinite(t)?t:100,0,180),a=en(Number.isFinite(e)?e:132,0,180);if(a<=s)return n>=Math.cos(s*i)?1:0;const o=Math.cos(s*i),r=Math.cos(a*i);if(n>=o)return 1;const c=en((o-n)/(o-r),0,1);return 1-c*c*(3-2*c)}function Vc(n,t){if(!n.grounded||n.speed<fn)return eu();const e=n.speed/Math.max(n.moveSpeed,fn),i=Math.max(n.legLength,fn),s=n.stride>fn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+fn,h=Gc(n.localForward/Math.max(n.speed,fn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=c/l*h,d=r/l+c/l*(1-h),u=n.localForward>=0?1:-1,g=n.localRight>=0?1:-1,v=s,m=X=>Math.asin(en(X,-o,o)/i);function p(X,L){const C=nu(X,t.plantLock),W=Xh(X),H=u*d*v*C,K=-m(H),J=L*g>0?1:-1,ot=1+J*t.crossStep*.45,ft=g*J*t.crossStep*v*.4*W,vt=g*f*v*t.sideWeight*ot*C+ft*f,j=m(vt),tt=t.kneeLift*W*a*(.55+.25*d+(J>0?.2*f:0));return{pitchX:K,rollZ:j,kneeX:tt}}const x=(n.phase%wi+wi)%wi,_=p(x,-1),y=p((x+Math.PI)%wi,1),D=Math.cos(x),b=Xh(x),w=-t.comSway*a*D*(.6*d+.8*f)-g*t.comSway*a*f*.45,A=t.comBob*b*a,E=g*t.hipLean*a*f*D*.6,M=g*t.hipLean*a*f*(.45+.25*D),R=t.armSwing*a*D*(d*u+.3*f),F=R,U=-R;return{legL:_,legR:y,pelvisX:w,pelvisY:A,pelvisRoll:E,sideLean:M,armL:F,armR:U,strafe:f,backward:u<0?d:0}}function iu(n){const t=(n%wi+wi)%wi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function su(n,t,e){const i=en(e.progress,0,1);if(i>=1||n.speed<fn)return eu();const s=i*i*(3-2*i),a=1-s;return Vc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function au(n,t,e,i){const s=en(n,-1,1),a=Math.abs(s),o=Math.min(1,t*(1+Math.max(0,i)*a*a));return en(o*s,-1,1)*(e*Math.PI/180)}function ou(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const a=Math.atan2(t,n)*180/Math.PI;if(Math.abs(a)<=90)return e;const r=(a-Math.sign(a)*180)*Math.PI/180,c=en(i,0,1),l=c*c;return e*l+r*(1-l)}function ru(n,t,e,i,s){const a=Math.max(e,fn),o=Math.max(0,i)*a,r=Math.max(0,s)*a,c=t>fn?(t-n)/t:0,l=c>.02,h=c<-.015,f=n<=o*.15,d=!h&&n<r&&(l||f);return{enter:n>fn&&n<=o&&l,resume:!d}}function cu(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return en(n*en(t,0,2),-i,i)}function lu(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*o}}function hu(n,t,e){const i=en(n,0,1),s=i*i*(3-2*i);return e?t==="inStop"?1-s:1:t==="afterStop"?1-s:0}function vM(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const s=en(n,0,1),a=Math.sin(Math.PI*s),o=a*a;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*c,rollZ:u*d*c,kneeX:f*c},legR:{pitchX:-h*l,rollZ:-u*d*l,kneeX:f*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function du(n,t,e,i,s){const a=en(n,0,1),o=en(s.stopPeakRatio,.05,.95),r=a<=o?a/o:(a-o)/(1-o),c=r*r*(3-2*r),l=a<=o?c:1-c,h=Math.hypot(e,i),f=h>fn?e/h:1,d=h>fn?i/h:0,u=nu(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*l,trailPitch:Math.max(0,s.stopTrailPitch)*l,leadKnee:Math.max(0,s.stopStepKnee)*l,bodyShift:Math.max(0,s.stopBodyShift)*l,bodyDip:Math.max(0,s.stopBodyDip)*l,chestPitch:Math.max(0,s.stopChestPitch)*l,leadLeft:u,fwdN:f,rightN:d,env:l}}function Ze(n){return n<0?0:n>1?1:n}const Ua=Math.PI*2;function _M(n){return((n+Math.PI)%Ua+Ua)%Ua-Math.PI}function yM(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function MM(n,t,e,i,s,a=n.phase){const o=Ze(i);if(o<=0)return n;const r=Ze(t),c=Math.max(1,Math.round(s.cycles)),l=Math.max(0,s.strideSpeed),h=e%2===0?1:-1,f=Ze(s.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*d,g=r<=.5?r*2:(r-.5)*2,v=g*g*(3-2*g),m=r<=.5?v:1-v,p={speed:l,phase:a+Ua*c/2*m,localForward:l*f,localRight:l*(1-f)*h},x=_M(p.phase-n.phase),_=o*o*(3-2*o),y=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+x*_,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:y+(u-y)*o*o}}function SM(n,t,e){const i=yM(),s=Ze(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=c?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*a*o,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*o,i}function uu(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function Wh(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*uu(a,s)}function bM(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(s-n)*a;return t&&o>.999?1:!t&&o<.001?0:o}function EM(n,t,e){const i=Ze(n);return{gaitScale:1-i*(1-Ze(t)),attackLegWeight:Ze(e)*i}}function wM(n,t){const e=Ze(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function AM(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Ze(t.minScale+(1-t.minScale)*e)}function TM(){return fu()}function fu(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function RM(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function CM(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Ze(t.forceHitHeight):n.type==="light"?Ze(t.hitHeight.light):n.type==="heavy"?Ze(t.hitHeight.heavy):n.type==="knock"?Ze(t.hitHeight.knock):0}function PM(n,t,e){const i=Ze(e),s=(a,o)=>a+(o-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function pu(n,t,e){const i=fu(),s=RM(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=Ze(1-n.timer/n.duration),o=uu(a,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=CM(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*c,d=n.dirX*l+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*a);return i.upperPitch=s*v*f,i.upperRoll=-s*v*d*.7,i.drop=(s>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const u=s*o,g=PM(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*d,i.upperYaw=u*g.upperYaw*d,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*o,i}function mu(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*o}}const mi=1e-6;function Ds(n,t,e){return n<t?t:n>e?e:n}function LM(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=mi||a<=mi||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=s+a,c=Math.abs(s-a)+mi,l=Math.hypot(n.x,n.y,n.z);if(l<=mi)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),g=Ds(u,c,r),v=u>r+mi||u<c-mi,m=Math.atan2(-d,Math.max(f,mi)),p=Ds((s*s+g*g-a*a)/(2*s*g),-1,1),x=Ds((a*a+g*g-s*s)/(2*a*g),-1,1),_=Math.acos(p),y=Math.acos(x),D=i>=0?1:-1;return{rootPitch:m-D*_,rootRoll:h,jointPitch:D*(_+y),clamped:v,reach:l/r}}function DM(n,t,e,i){const s=Ds(e,0,1),a=Math.max(0,i),o=(r,c)=>{const l=Ds((c-r)*s,-a,a);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function gu(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Xc={active:!1,weight:0,clamped:0,maxError:0};function xu(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||s.length===0)return{...Xc};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(u=>u.tip.getWorldPosition(new $));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const g=s[u],v=i.worldToLocal(c[u].clone()),m={x:v.x-g.root.position.x,y:v.y-g.root.position.y,z:v.z-g.root.position.z},p=LM(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const x=DM({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,l,h);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<s.length;u++){const g=s[u].tip.getWorldPosition(new $);d=Math.max(d,g.distanceTo(c[u]))}return{active:!0,weight:l,clamped:f,maxError:d}}function on(n,t,e){return n<t?t:n>e?e:n}function IM(n,t,e,i,s,a,o,r,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new ge,d=new ge;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new ge;u.name="lower";const g=new ge;g.name="upper",d.add(u),d.add(g);const v=[],m=(et,gt,Gt,nt)=>{const _t=new Gs({color:nt}),B=new he(new Ln(et,gt,Gt),_t);return B.castShadow=!0,B.receiveShadow=!0,v.push(_t),B},p=n.headSize,x=n.legLength,_=n.armLength,y=n.limbThickness,D=n.bodyHeight,b=n.bodyWidth,w=m(b,D,.28,e);w.position.y=D/2,g.add(w);const A=new ge;A.name="headPivot",A.position.y=D,g.add(A);const E=m(p,p,p,e);E.position.y=p/2,A.add(E);for(const et of[-1,1]){const gt=m(.06,.07,.02,t.shoe);gt.position.set(et*.09,p/2+.03,p/2+.011),A.add(gt)}const M=(et,gt)=>{const Gt=gt?_:x,nt=new ge;nt.name=gt?et<0?"shoulderL":"shoulderR":et<0?"hipL":"hipR",gt||(nt.rotation.order="ZYX"),nt.position.set(et*(gt?b/2+y/2:b/2-y/2),gt?D-.04:0,0),(gt?g:u).add(nt);const _t=m(y,Gt/2,y,t.limb);_t.position.y=-Gt/4,nt.add(_t);const B=new ge;B.name=gt?"elbow":"knee",B.position.y=-Gt/2,nt.add(B);const it=m(y,Gt/2,y,t.limb);if(it.position.y=-Gt/4,B.add(it),!gt){const ut=m(y*1.15,.07,y*1.7,t.shoe);ut.position.set(0,-Gt/2+.035,.045),B.add(ut);const Et=new Te;return Et.name="footTip",Et.position.y=-Gt/2,B.add(Et),{root:nt,joint:B,tip:Et}}return{root:nt,joint:B}},R=M(-1,!1),F=M(1,!1),U=M(-1,!0),X=M(1,!0),L=[R,F].map(et=>({root:et.root,joint:et.joint,tip:et.tip,upperLen:x/2,lowerLen:x/2,bend:1})),C=new Je({color:s.attackArcColor,transparent:!0,opacity:0,side:Le,depthWrite:!1}),W=new he(new so(.62,.042,6,20,Math.PI*1.1),C);W.position.set(0,.78-x,.56),g.add(W);const H=new Zt(e),K=new Zt(r.flashColor),J=new Zt;let ot=null,ft=0,vt=0,j=0,tt=0,pt=0,Q=0,mt=0,It={...Xc},At=-1,Ot=0,St=0,Mt=0,G=0,qt=0,Ut=0,Ft=0,bt=1,yt=0,Tt=0,P="none",S=0,Y=!1,rt=-1,ct=!1,at=0,Nt=0;return{group:f,update(et,gt){f.position.set(et.position.x,et.position.y,et.position.z),f.rotation.y=et.bodyYaw,A.rotation.y=(et.headYaw-et.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,et.mode!==ot&&(ot=et.mode,ft=1),ft=Math.max(0,ft-gt*2.2);const Gt=et.hurt,nt=pu(Gt,et.bodyYaw,r),_t=nt.flash;J.copy(K).multiplyScalar(_t);for(const Ct of v)Ct.emissive.copy(H).multiplyScalar(ft*.5),_t>0&&Ct.emissive.add(J);d.position.set(0,x,0),d.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const B=Math.hypot(et.velocity.x,et.velocity.z),it=on(o.knockGaitScale??0,0,1),ut=et.hurt.knockX*it,Et=et.hurt.knockZ*it,zt=it>0&&Math.hypot(et.hurt.knockX,et.hurt.knockZ)>.001,Xt=et.velocity.x+ut,z=et.velocity.z+Et,O=Math.hypot(Xt,z),V=Math.cos(et.bodyYaw),q=-Math.sin(et.bodyYaw),lt=B>1e-6?on((et.velocity.x*V+et.velocity.z*q)/B,-1,1):0,ht=B>1e-6?on((et.velocity.x*Math.sin(et.bodyYaw)+et.velocity.z*Math.cos(et.bodyYaw))/B,-1,1):1,Rt=Gc(ht,o.backStrafeStartDeg,o.backStrafeFullDeg);P==="settled"&&ct&&at>Nt*1.02+1e-4&&(P="none");let Vt=1;P==="blend"?(Vt=hu(Y?rt:S,o.stopYawBlendMode,Y),Y||(S=Math.min(1,S+gt/Math.max(.01,o.stopYawAfterSec)),(S>=1||o.stopYawBlendMode==="inStop"||ct)&&(P="settled",Vt=0))):P==="settled"&&(Vt=on(B/Math.max(1e-6,o.stopEnterRatio*a),0,1));const Jt=au(lt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Yt=ou(ht,lt,Jt,Rt)*Vt;yt+=(Yt-yt)*(1-Math.exp(-12*Math.max(0,gt))),u.rotation.y=yt;const oe=et.bodyYaw+yt,ve=Math.sin(oe),Ee=Math.cos(oe),be=Math.cos(oe),ne=-Math.sin(oe),re=Xt*ve+z*Ee,_e=Xt*be+z*ne,Re=Math.max(0,o.stopBlendSec||0),Fe=Re>0&&!zt,Dt=ru(B,Tt,a,o.stopEnterRatio,o.stopExitRatio);if(!Fe||Dt.resume)At=-1;else if(At<0&&Dt.enter){At=0,Ot=et.gaitPhase,St=iu(et.gaitPhase),Mt=B,G=Math.max(et.stride,1e-6),qt=re,Ut=_e;const Ct=1/Math.max(1e-6,B);Ft=et.velocity.x*Ct,bt=et.velocity.z*Ct}const $t=Tt;Tt=B;const ue=Fe&&At>=0;ue&&(At=Math.min(1,At+gt/Re)),ue&&P!=="blend"&&(P="blend",S=0),Y=ue&&At<1,rt=At,ct=Dt.resume,at=B,Nt=$t;const Oe=ue?{phase:Ot,speed:Mt,moveSpeed:a,localForward:qt,localRight:Ut,legLength:n.legLength,stride:G,grounded:!0}:{phase:et.gaitPhase,speed:O,moveSpeed:a,localForward:re,localRight:_e,legLength:n.legLength,stride:et.stride,grounded:!0},ce=ue?su(Oe,o,{progress:At,phase0:Ot,phaseEnd:St}):Vc(Oe,o);let In=0,cn=0,T=0,Z=0;if(ue){const Ct=lu(et.bodyYaw,Ft,bt),Pt=du(At,Ot,Ct.forward,Ct.right,o);Pt.leadLeft?(ce.legL.pitchX-=Pt.leadPitch,ce.legL.kneeX+=Pt.leadKnee,ce.legR.pitchX+=Pt.trailPitch):(ce.legR.pitchX-=Pt.leadPitch,ce.legR.kneeX+=Pt.leadKnee,ce.legL.pitchX+=Pt.trailPitch),cn=Pt.bodyShift*Pt.fwdN,In=Pt.bodyShift*Pt.rightN,T=Pt.bodyDip,Z=Pt.chestPitch}R.root.rotation.x=ce.legL.pitchX,F.root.rotation.x=ce.legR.pitchX,R.root.rotation.z=ce.legL.rollZ,F.root.rotation.z=ce.legR.rollZ,R.joint.rotation.x=ce.legL.kneeX,F.joint.rotation.x=ce.legR.kneeX,U.root.rotation.x=ce.armL,X.root.rotation.x=ce.armR,U.joint.rotation.x=-.18,X.joint.rotation.x=-.18,d.position.x=ce.pelvisX,d.position.y=x+ce.pelvisY,d.position.z=0,d.rotation.z=ce.pelvisRoll,g.rotation.z=ce.sideLean*(nt.intensity>0?.4:1);const I=gu(d,u),N=ue&&h.enabled?{...h,weight:1}:h,k=N.enabled&&N.weight>0?on(N.weight,0,1):0;if(d.position.x+=In,d.position.z+=cn,d.position.y-=T,u.position.y+=T,k<=0&&(u.position.x-=In,u.position.z-=cn),c){const Ct=Math.max(.004166666666666667,Math.min(gt,.1)),Pt=Math.sin(et.bodyYaw),kt=Math.cos(et.bodyYaw),Wt=on((et.velocity.x-vt)/Ct,-60,60),Qt=on((et.velocity.z-j)/Ct,-60,60),ie=Wt*Pt+Qt*kt,Ce=Ge(et.bodyYaw-tt)/Ct,te=c.maxForwardDeg*Math.PI/180,Ht=c.maxSideDeg*Math.PI/180,Ve=1-Math.exp(-Math.max(0,c.smoothing)*Ct);pt+=(on(ie*c.accelGain,-te,te)-pt)*Ve,Q+=(on(-Ce*B*c.turnGain,-Ht,Ht)-Q)*Ve;const se=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;mt+=(on(B/Math.max(a,1e-6),0,1)-mt)*(1-Math.exp(-Math.max(0,se)*Ct));const we=mu({leanForward:pt,leanSide:Q,speedRatio:mt},c);g.rotation.x+=pt+Z,g.rotation.z+=Q,d.rotation.x+=we.pelvisPitch,d.rotation.z+=we.pelvisRoll,d.position.x+=we.pelvisX,d.position.z+=we.pelvisZ,d.position.y-=we.crouch,u.position.y+=we.crouch*(1-k)}vt=et.velocity.x,j=et.velocity.z,tt=et.bodyYaw,g.rotation.x+=nt.upperPitch,g.rotation.z+=nt.upperRoll,g.rotation.y+=nt.upperYaw;const st=on(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),dt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=on(nt.upperShiftX*st,-dt,dt),g.position.z+=on(nt.upperShiftZ*st,-dt,dt),d.position.x+=nt.comX,d.position.z+=nt.comZ-nt.pelvisBack,d.position.y-=nt.drop;const xt=nt.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=nt.pelvisBack*(1-xt),u.position.y+=nt.drop*(1-xt),R.joint.rotation.x+=nt.knee,F.joint.rotation.x+=nt.knee,R.root.rotation.x-=nt.hip,F.root.rotation.x-=nt.hip,U.root.rotation.x+=nt.arm,X.root.rotation.x+=nt.arm*.8,et.attackPhase!=="idle"&&nt.intensity===0){const Ct=et.attackProgress,Pt=Ct<.34?-1:Ct<.68?-1+(Ct-.34)/.34*2:Math.max(0,1-(Ct-.68)/.32),kt=Math.max(0,-Pt),Wt=Math.max(0,Pt);X.root.rotation.x=-1.7*kt+1.25*Wt,X.joint.rotation.x=-(.25+kt*.45),g.rotation.y=-.28*Pt,C.opacity=et.attackPhase==="active"?.85:0,et.attackPhase==="active"&&(W.rotation.z=-1.1+Ct*3)}else C.opacity=0;const wt=cu(yt,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=wt,A.rotation.y=(et.headYaw-et.bodyYaw-wt+Math.PI*3)%(Math.PI*2)-Math.PI,It=xu({root:f,pelvis:d,lower:u,limbs:L,base:I,cfg:N,grounded:!0,attacking:et.attackPhase!=="idle"})},ik(){return It},dispose(){f.traverse(et=>{if(et instanceof he){et.geometry.dispose();const gt=et.material;Array.isArray(gt)?gt.forEach(Gt=>Gt.dispose()):gt.dispose()}})}}}const gi=.012,xi=.016;function kM(n,t){const e=t.lab,i=new ge;i.name="test-lab";const s=[],a=[],o=[],r=[];function c(x){return o.push(x),x}function l(x){return r.push(x),x}function h(x,_,y,D=gi){const b=c(new Je({color:_,transparent:!0,opacity:y,depthWrite:!1,side:Le,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),w=new he(x,b);return w.rotation.x=-Math.PI/2,w.position.y=D,w.renderOrder=2,w}function f(x,_){return l(new Hs(Math.max(x,.001),_,72))}function d(x,_,y,D=xi){const w=document.createElement("canvas"),A=w.getContext("2d");if(!A)return new he;const E='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';A.font=E,w.width=zl.ceilPowerOfTwo(Math.ceil(A.measureText(x).width)+32),w.height=zl.ceilPowerOfTwo(96*1.4);const M=w.getContext("2d");if(!M)return new he;M.font=E,M.textAlign="center",M.textBaseline="middle",M.fillStyle=y,M.fillText(x,w.width/2,w.height/2);const R=new Py(w);R.colorSpace=rn,a.push(R);const F=w.width/w.height,U=l(new dn(_*F,_)),X=c(new Je({map:R,transparent:!0,depthWrite:!1,side:Le,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new he(U,X);return L.rotation.x=-Math.PI/2,L.position.y=D,L.renderOrder=3,L}function u(x,_,y,D,b,w){const A=y-_,E=l(new dn(A,D)),M=h(E,b,w,gi);M.position.set(A/2+_,gi,0);const R=new ge;return R.add(M),R.rotation.y=x-Math.PI/2,R}function g(x,_,y,D,b){const w=new jd;w.moveTo(0,_*.5),w.lineTo(-y*.5,_*.5-y*.9),w.lineTo(-y*.18,_*.5-y*.9),w.lineTo(-y*.18,-_*.5),w.lineTo(y*.18,-_*.5),w.lineTo(y*.18,_*.5-y*.9),w.lineTo(y*.5,_*.5-y*.9),w.closePath();const A=l(new Hc(w)),E=h(A,D,b,gi+.002),M=new ge;return M.add(E),M.rotation.y=x+Math.PI,M}function v(x){var A;const _=new ge,y=d(`${x.index} · ${x.name}`,t.lab.labelTextHeight,"#eaf4ff"),b=((A=y.geometry.parameters)==null?void 0:A.width)??3;_.add(y);const w=h(l(new dn(b*.98,.08)),x.color,.7,xi);return w.position.set(0,xi,t.lab.labelTextHeight*.66),_.add(w),_.position.set(x.labelX,0,x.labelZ),_}const m=new ge;for(const x of n??[]){const _=new ge;if(_.position.set(x.x,0,x.z),x.shape==="square"){const y=x.radius,D=h(l(new dn(y*2,y*2)),x.color,e.padOpacity*.09);_.add(D);const b=.07,w=[[0,y,y*2+b,b],[0,-y,y*2+b,b],[-y,0,b,y*2+b],[y,0,b,y*2+b]];for(const[A,E,M,R]of w){const F=h(l(new dn(M,R)),x.color,e.padOpacity);F.position.x=A,F.position.z=E,_.add(F)}}else _.add(h(l(new zc(x.radius,72)),x.color,e.padOpacity*.075)),_.add(h(f(x.radius-.075,x.radius),x.color,e.padOpacity));if(x.id==="hub"){for(let y=0;y<4;y++){const D=y*Math.PI/4,b=y%2===0;for(const w of[0,Math.PI])_.add(u(D+w,x.radius*.12,x.radius*.94,b?.09:.055,x.color,b?.5:.32))}_.add(h(f(.5,.56),x.color,.4))}else if(x.id==="dash"){const y=x.spawnZ-x.z,D=-x.radius+.5,b=y-D,w=h(l(new dn(.06,b)),x.color,.36);w.position.set(0,gi,(y+D)/2),_.add(w);let A=0;for(let M=y;M>=D-.01;M-=1,A++){const R=A%5===0,F=h(l(new dn(R?2.4:1.3,R?.1:.07)),x.color,R?.72:.42);F.position.set(0,gi,M),_.add(F);const U=d(String(A),.52,R?"#eaf4ff":"rgba(200,225,245,0.8)");U.position.set(1.6,xi,M),_.add(U)}const E=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,R]of E){const F=y-M,U=h(l(new dn(1.9,.09)),"#ffffff",.5);U.position.set(-1.5,gi,F),_.add(U);const X=d(R,.42,"rgba(220, 236, 250, 0.86)");X.position.set(-3,xi,F),_.add(X)}}else if(x.id==="gait"){_.add(h(f(1.44,1.5),x.color,.5)),_.add(h(f(1.14,1.2),x.color,.22));const y=1.55,D=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[b,w,A]of D){const M=Math.sin(b),R=Math.cos(b),F=g(b,1.7,.34,A,.75);F.position.set(M*1.7*.5,0,y+R*1.7*.5),_.add(F);const U=d(w,.44,A);U.position.set(M*(1.7+.7),xi,y+R*(1.7+.7)),_.add(U)}}if(m.add(_),e.showLabels){const y=v(x);s.push(y),m.add(y)}}i.add(m);const p=n==null?void 0:n.find(x=>x.id==="hub");if(p&&e.showLabels){const x=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[_,y,D]of x){const b=d(D,.4,"rgba(190, 224, 248, 0.8)");b.position.set(p.x+_*(p.radius+.7),xi,p.z+y*(p.radius+.7)),i.add(b),s.push(b)}}return i.visible=e.enabled,{group:i,setVisible(x){i.visible=x},setLabelsVisible(x){for(const _ of s)_.visible=x},dispose(){for(const x of r)x.dispose();for(const x of o)x.dispose();for(const x of a)x.dispose();i.clear()}}}const Wc=64,vu=[0,.24,.76,1],UM=[0,1,1,0],_u=[0,.12,.28,.5,.72,.88,1],FM=[0,.16,.5,1,.5,.16,0];function $h(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function $c(n,t,e,i,s=Wc,a="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),c=a==="glow"?_u:vu,l=a==="glow"?FM:UM,h=c.length,f=s+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),g=[];for(let m=0;m<f;m++){const p=m/s,x=(p-.5)*e,_=$h(p,i)*$h(1-p,i),y=Math.sin(x),D=Math.cos(x);for(let b=0;b<h;b++){const w=o+(r-o)*c[b],A=m*h+b;d[A*3]=y*w,d[A*3+1]=0,d[A*3+2]=D*w;const E=_*l[b];u[A*4]=1,u[A*4+1]=1,u[A*4+2]=1,u[A*4+3]=E}}for(let m=0;m<s;m++)for(let p=0;p<h-1;p++){const x=m*h+p,_=x+h;g.push(x,_,x+1,x+1,_,_+1)}const v=new ze;return v.setAttribute("position",new tn(d,3)),v.setAttribute("color",new tn(u,4)),v.setIndex(g),v.computeBoundingSphere(),v}function sr(n){const t=new Je({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Le,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const s=(c,l)=>{const h=Math.round(c*32)/32,f=Math.max(.05,Math.round(l*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const g=$c(n.radius,n.thickness*f,h,n.edgeFade,Wc,n.profile??"band");if(e.set(d,g),e.size>64){for(const[v,m]of e)if(v!==d&&m!==i){m.dispose(),e.delete(v);break}}return g};i=s(n.arcRad,1);const a=new he(i,t);a.position.y=n.y,a.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:a,update(c,l,h,f,d,u=1){const g=Math.max(.05,u);(Math.abs(c-o)>.01||Math.abs(g-r)>.01)&&(i=s(c,g),a.geometry=i,o=c,r=g),t.opacity=l,t.color.copy(f),a.scale.set(h,1,h),a.rotation.y=d,a.visible=l>.002},arcRad(){return o},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function Yh(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function NM(n,t,e,i,s){const a=s.arcDeg*Math.PI/180,o=s.playerOpacity;if(!n)return{arcRad:a,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=s.selectedArcDeg*Math.PI/180,h=a+(l-a)*(.35+.65*r),f=4+4*r+6*c,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*c)*r+.04*d),g=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:g,level:r}}function zM(n,t,e,i,s){const a=Math.min(1,Math.max(0,s));return a<=.001?n.copy(t):a<.5?n.copy(t).lerp(e,a*2):n.copy(e).lerp(i,(a-.5)*2)}function OM(n=64,t=.06,e=5){const i=n+1,s=e+1,a=new Float32Array(i*s*3),o=new Float32Array(i*s*4),r=[];for(let l=0;l<i;l++){const h=l/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<s;u++){const g=u/e,v=t+(1-t)*g,m=l*s+u;a[m*3]=f*v,a[m*3+1]=0,a[m*3+2]=d*v;const p=Math.pow(1-g,1.8)*.9+(u===0?.1:0);o[m*4]=1,o[m*4+1]=1,o[m*4+2]=1,o[m*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let h=0;h<e;h++){const f=l*s+h,d=f+s;r.push(f,d,f+1,f+1,d,d+1)}const c=new ze;return c.setAttribute("position",new tn(a,3)),c.setAttribute("color",new tn(o,4)),c.setIndex(r),c.computeBoundingSphere(),c}function Zh(n){const t=n.segments??Wc,e=n.profile??"band",s=((e==="glow"?_u.length:vu.length)-1)*6,a=$c(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new Je({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Le,vertexColors:!0,toneMapped:!1}),r=new he(a,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,a.setDrawRange(0,0);let c=0;return{mesh:r,set(l,h,f,d,u=1){const g=Math.min(1,Math.max(0,l)),v=Math.round(g*t),m=g>.001?Math.max(1,v)*s:0;m!==a.drawRange.count&&a.setDrawRange(0,m),c=v,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&g>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){a.dispose(),o.dispose()}}}function qh(n){const t=new ge,e=OM(48),i=new Je({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Le,vertexColors:!0,toneMapped:!1}),s=new he(e,i);s.renderOrder=n.renderOrder??2,t.add(s);const a=Math.max(.01,n.edgeWidthRatio??.045),o=$c(1-a*.5,a,Math.PI*2,0,64,"band"),r=new Je({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Le,vertexColors:!0,toneMapped:!1}),c=new he(o,r);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,h,f,d,u,g){const v=Math.min(1,Math.max(0,u));t.position.set(l,f,h),s.scale.set(d,1,d),c.scale.set(d,1,d),i.opacity=v*.26,r.opacity=v*(.72+.18*Math.sin(g*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function jh(n,t,e,i){if(i<=1e-4||e<=0)return t;const s=1-Math.exp(-e/i);return n+(t-n)*s}function BM(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),s=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:s,urgency:.35+.65*s}}function HM(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){const t=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/t))}}return n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function GM(n,t,e,i,s,a){return n!=="windup"||s<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*s,z:e+Math.cos(i)*s,radius:Math.max(.3,a)}}function VM(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function XM(n,t,e){return n?t:e}function yu(n){return{x:0,y:0,z:1}}function WM(n){return Math.asin(yu().y)}function $M(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}function Ue(n,t,e){return n<t?t:n>e?e:n}const ji=1e-6;function ye(n,t,e,i){const s=new he(new Ln(n,t,e),new Gs({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function Pe(){return new ge}function Fa(n,t,e){const i=Pe(),s=ye(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=ye(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const o=ye(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=ye(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=ye(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function YM(n){const t=Fa(.72,.15,n),e=ye(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function ZM(n){const t=Pe(),e=ye(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=ye(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function qM(n){const t=Pe(),e=ye(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=ye(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new Zt(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function jM(n){const t=Pe();for(let i=0;i<5;i++){const s=(i-2)*.15,a=ye(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ye(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function KM(n){const t=Pe(),e=ye(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=ye(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function JM(n,t,e,i,s,a,o,r,c,l,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},d=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=Pe(),g=Pe();g.name="pelvis",g.position.y=n.legLength,u.add(g);const v=Pe();v.name="lower";const m=Pe();m.name="upper",g.add(v),g.add(m);const p=n.headSize,x=n.legLength,_=n.armLength,y=n.limbThickness,D=n.bodyHeight,b=n.bodyWidth,w=ye(b,D,.28,t.body);w.position.y=D/2,m.add(w);const A=Pe();A.name="headPivot",A.position.y=i.headPivotHeight,m.add(A);const E=ye(p,p,p,t.head);E.position.y=p/2,A.add(E);const M=new Gs({color:"#1b2733"});for(const I of[-1,1]){const N=new he(new Ln(.06,.07,.02),M);N.position.set(I*.09,p/2+.03,p/2+.011),A.add(N)}const R=I=>{const N=Pe();N.name=I<0?"hipL":"hipR",N.rotation.order="ZYX",N.position.set(I*(b/2-y/2),0,0),v.add(N);const k=ye(y,x/2,y,t.limb);k.position.y=-x/4,N.add(k);const st=Pe();st.name="knee",st.position.y=-x/2,N.add(st);const dt=ye(y,x/2,y,t.limb);dt.position.y=-x/4,st.add(dt);const xt=ye(y*1.15,.07,y*1.7,t.shoe);xt.position.set(0,-x/2+.035,.045),st.add(xt);const wt=new Te;return wt.name="footTip",wt.position.y=-x/2,st.add(wt),{root:N,joint:st,hand:Pe(),tip:wt}},F=I=>{const N=Pe();N.name=I<0?"shoulderL":"shoulderR",N.position.set(I*(b/2+y/2),D-.04,0),m.add(N);const k=ye(y,_/2,y,t.limb);k.position.y=-_/4,N.add(k);const st=Pe();st.name="elbow",st.position.y=-_/2,N.add(st);const dt=ye(y,_/2,y,t.limb);dt.position.y=-_/4,st.add(dt);const xt=Pe();xt.position.y=-_/2,st.add(xt);const wt=ye(y*1.1,.09,y*1.1,t.head);return wt.position.y=.045,xt.add(wt),{root:N,joint:st,hand:xt}},U=R(-1),X=R(1),L=F(-1),C=F(1),W=[U,X].map(I=>({root:I.root,joint:I.joint,tip:I.tip,upperLen:x/2,lowerLen:x/2,bend:1})),H=Pe(),K=Pe();C.hand.add(H),L.hand.add(K);const J=qM(t),ot=jM(t),ft=KM(t),vt={"sword-shield":{right:Fa(.42,.075,t),left:ZM(t)},"dual-swords":{right:Fa(.42,.075,t),left:Fa(.42,.075,t)},greatsword:{right:YM(t),left:ye(.12,.2,.12,t.wood)},staff:{right:J.g,left:Pe(),orb:J.orb},bow:{right:ft,left:ot.g,arrow:ft,drawString:ot.drawString}};for(const I of Object.keys(vt))H.add(vt[I].right),K.add(vt[I].left),vt[I].right.visible=!1,vt[I].left.visible=!1;let j=null,tt=0,pt=0,Q=0,mt=0,It=0,At=0,Ot=TM(),St={...Xc},Mt=0,G=0,qt=0,Ut=-1,Ft=0,bt=0,yt=0,Tt=0,P=0,S=0,Y=0,rt=1,ct=0,at=0,Nt=0,et=!1,gt=0,Gt=0,nt=0,_t=0,B="none",it=0,ut=1,Et=!1,zt=-1,Xt=!1,z=0,O=0,V=0,q=0,lt=0,ht=1,Rt={speed:0,phase:0},Vt={lp:0,lr:0,rp:0,rr:0},Jt=0,Yt=0,oe=!0,ve=0,Ee="none",be=0,ne=0,re=0,_e=.3,Re=0;function Fe(I){const N=Math.PI/180,k=a;let st=0,dt=0,xt=0,wt=0;I==="sword-shield"?(st=k.swordPitchDeg*N,dt=-k.swordYawDeg*N,xt=k.shieldPitchDeg*N):I==="dual-swords"?(st=k.swordPitchDeg*N,dt=-k.swordYawDeg*N,xt=k.swordPitchDeg*N,wt=k.swordYawDeg*N):I==="greatsword"?(st=k.greatswordPitchDeg*N,dt=-k.greatswordYawDeg*N,xt=k.greatswordPitchDeg*N,wt=k.greatswordYawDeg*N):I==="staff"?st=k.staffPitchDeg*N:xt=k.bowPitchDeg*N,H.rotation.set(st,0,dt),K.rotation.set(xt,0,wt)}function Dt(I){if(I!==j){j=I;for(const N of Object.keys(vt))vt[N].right.visible=N===I,vt[N].left.visible=N===I;Fe(I),ot.drawString.position.z=-.06,ft.position.z=0,J.orb.scale.setScalar(1),m.rotation.y=0}}Dt("sword-shield");const $t=[];u.traverse(I=>{I instanceof he&&I.material instanceof Gs&&$t.push(I.material)});const ue=new Zt(r.flashColor);function Oe(I,N){const k=pu(I,N,r);Ot=k,m.rotation.x+=k.upperPitch,m.rotation.z+=k.upperRoll,m.rotation.y+=k.upperYaw;const st=Ue(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),dt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Ue(k.upperShiftX*st,-dt,dt),m.position.z+=Ue(k.upperShiftZ*st,-dt,dt),g.position.x+=k.comX,g.position.z+=k.comZ-k.pelvisBack,g.position.y-=k.drop;const xt=k.legacy?0:Ue(r.lowerScale,0,1);v.position.z+=k.pelvisBack*(1-xt),v.position.y+=k.drop*(1-xt),U.joint.rotation.x+=k.knee,X.joint.rotation.x+=k.knee,U.root.rotation.x-=k.hip,X.root.rotation.x-=k.hip,L.root.rotation.x+=k.arm,C.root.rotation.x+=k.arm*.8;for(const wt of $t)wt.emissive.copy(ue).multiplyScalar(k.flash)}function ce(I){return I<.3?-1:I<.62?-1+(I-.3)/.32*2:Math.max(0,1-(I-.62)/.38)}function In(I){if(I.phase==="idle"||I.charging)return;const N=I.attackProgress,k=ce(N),st=Math.max(0,k),dt=I.comboIndex%2===0?1:-1,xt=c.stride,wt=Number.isFinite(xt.stepReach)?xt.stepReach:.17,Ct=Number.isFinite(xt.stepSideReach)?xt.stepSideReach:.14,Pt=Number.isFinite(xt.stepDipReach)?xt.stepDipReach:.05,kt=I.weapon==="greatsword"?Ue(Number.isFinite(xt.heavyScale)?xt.heavyScale:1,0,1):1;g.position.z+=wt*st*kt,g.position.x+=dt*Ct*st*kt,g.position.y-=Pt*Math.sin(Math.PI*N)*kt}function cn(I){if(ot.drawString.position.z=-.06,ft.position.z=0,J.orb.scale.setScalar(1),m.rotation.y=0,I.charging&&I.weapon==="bow"){const dt=I.charge;L.root.rotation.x=-1.25,L.joint.rotation.x=-.15,C.root.rotation.x=.35+dt*.3,C.joint.rotation.x=-1.15,ot.drawString.position.z=-.06-dt*.22,ft.position.z=-dt*.3,m.rotation.y=-.22;return}if(I.phase==="idle")return;const N=ce(I.attackProgress),k=Math.max(0,-N),st=Math.max(0,N);if(I.weapon==="bow")L.root.rotation.x=-1.2,L.joint.rotation.x=-.15,C.root.rotation.x=.9-st*.8,C.joint.rotation.x=-.3;else if(I.weapon==="greatsword"){const dt=-1.6*k+1.25*st,xt=Ue(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);C.root.rotation.x=dt,C.joint.rotation.x=-(.25+k*.4),L.root.rotation.x=dt+.06,L.joint.rotation.x=-(.32+k*.4),L.root.rotation.z=.38,m.rotation.y=-.2*N*xt}else{const dt=I.comboIndex;if(dt===1)C.root.rotation.x=-1.7*k+1.1*st,C.joint.rotation.x=-(.2+k*.5),L.root.rotation.x=.1,m.rotation.y=-.18*N;else if(dt===2)L.root.rotation.x=-1.5*k+1*st,L.joint.rotation.x=-(.2+k*.5),C.root.rotation.x=.2,m.rotation.y=.45*-N;else{const xt=-1.9*k+1.2*st;L.root.rotation.x=xt,C.root.rotation.x=xt,L.joint.rotation.x=-(.15+k*.4),C.joint.rotation.x=-(.15+k*.4),m.rotation.y=-.3*N}}In(I)}function T(I,N){I&&(C.root.rotation.x=-1.05,C.joint.rotation.x=-.35,L.root.rotation.x=-.45,L.joint.rotation.x=-.2,m.rotation.y=-.12,J.orb.scale.setScalar(1.25+.12*Math.sin(N*2)))}function Z(I){if(!I||I.phase==="idle")return;const N=I.progress,k=N<.3?-.35+N/.3*1.35:N<.7?1:Math.max(0,1-(N-.7)/.3),st=Math.PI/180;m.rotation.x+=d.leanDeg*st*k,L.root.rotation.x-=d.shieldPitchDeg*st*k,L.joint.rotation.x-=.22*k,C.root.rotation.x-=.3*k,g.position.z+=d.pelvisReach*Math.max(0,k)}return{group:u,update(I,N,k,st,dt=!1,xt,wt,Ct){Dt(N.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const Pt=Math.max(1/240,Math.min(st,.1)),kt=xt===void 0?Jt+=st:xt;Yt=kt;const Wt=c.landing;Wt.enabled?oe&&!I.grounded?(Ee="jump",be=kt,ne=Wt.anticipationDuration,re=Math.max(0,Wt.jumpAnticipation),_e=.32):!oe&&I.grounded&&(Ee="land",be=kt,ne=Wt.duration,re=AM(ve,Wt),_e=Wt.compressRatio,Re=ve):(Ee="none",re=0),kt<be&&(Ee="none",re=0),oe=I.grounded,ve=I.velocity.y;const Qt=Wh(kt,be,ne,re,_e),ie=N.phase!=="idle",Ce=(Ct==null?void 0:Ct.phase)==="active";q=bM(q,ie,Pt,c.attack.blendRate);const te=EM(q,c.attack.gaitWeight,c.attack.lowerBodyWeight);lt=te.attackLegWeight,ht=te.gaitScale;const Ht=Math.sin(I.bodyYaw),Ve=Math.cos(I.bodyYaw),se=(I.velocity.x-tt)/Pt,we=(I.velocity.z-pt)/Pt,$n=Ue(se,-60,60),Xe=Ue(we,-60,60),oi=$n*Ht+Xe*Ve,fe=Ge(I.bodyYaw-Q)/Pt,ln=Math.hypot(I.velocity.x,I.velocity.z),Yn=o.maxForwardDeg*Math.PI/180,We=o.maxSideDeg*Math.PI/180,bn=Ue(oi*o.accelGain,-Yn,Yn),En=Ue(-fe*ln*o.turnGain,-We,We),ps=1-Math.exp(-o.smoothing*Pt);mt+=(bn-mt)*ps,It+=(En-It)*ps,tt=I.velocity.x,pt=I.velocity.z,Q=I.bodyYaw;const gn=Math.hypot(I.velocity.x,I.velocity.z),ao=Ue(s.knockGaitScale??0,0,1),Mu=k.knockX*ao,Su=k.knockZ*ao,bu=ao>0&&Math.hypot(k.knockX,k.knockZ)>.001,oo=I.velocity.x+Mu,ro=I.velocity.z+Su,Yc=Math.hypot(oo,ro);_t=Yc;const Eu=Math.cos(I.bodyYaw),wu=-Math.sin(I.bodyYaw),Au=I.velocity.x*Eu+I.velocity.z*wu,Zc=gn>ji?Ue(Au/gn,-1,1):0,qc=gn>ji?Ue((I.velocity.x*Ht+I.velocity.z*Ve)/gn,-1,1):1,Tu=Gc(qc,s.backStrafeStartDeg,s.backStrafeFullDeg);B==="settled"&&Xt&&z>O*1.02+1e-4&&(B="none");let ms=1;B==="blend"?(ms=hu(Et?zt:it,s.stopYawBlendMode,Et),Et||(it=Math.min(1,it+Pt/Math.max(.01,s.stopYawAfterSec)),(it>=1||s.stopYawBlendMode==="inStop"||Xt)&&(B="settled",ms=0))):B==="settled"&&(ms=Ue(gn/Math.max(ji,s.stopEnterRatio*e),0,1)),ut=ms;const Ru=au(Zc,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost),Cu=ou(qc,Zc,Ru,Tu)*ms;G+=(Cu-G)*(1-Math.exp(-i.hipYawSmoothing*Pt));const gs=I.bodyYaw+G;qt=gs;const Pu=Math.sin(gs),Lu=Math.cos(gs),Du=Math.cos(gs),Iu=-Math.sin(gs),$s={speed:Yc,phase:I.gaitPhase,localForward:oo*Pu+ro*Lu,localRight:oo*Du+ro*Iu,stride:I.stride};ie&&!et&&(Nt=I.gaitPhase),et=ie;const Li=q>0?MM($s,N.attackProgress,N.comboIndex,q,c.stride,Nt):$s;Rt=Li;const jc=Math.max(0,s.stopBlendSec||0),Kc=jc>0&&!ie&&!bu&&I.grounded,co=ru(gn,ct,e,s.stopEnterRatio,s.stopExitRatio);if(!Kc||co.resume)Ut=-1;else if(Ut<0&&co.enter){Ut=0,Ft=I.gaitPhase,bt=iu(I.gaitPhase),yt=gn,Tt=Math.max(I.stride,ji),P=$s.localForward,S=$s.localRight;const me=1/Math.max(ji,gn);Y=I.velocity.x*me,rt=I.velocity.z*me}const ku=ct;ct=gn;const ri=Kc&&Ut>=0;ri&&(Ut=Math.min(1,Ut+Pt/jc)),ri&&B!=="blend"&&(B="blend",it=0),Et=ri&&Ut<1,zt=Ut,Xt=co.resume,z=gn,O=ku;const Jc=ri?{phase:Ft,speed:yt,moveSpeed:e,localForward:P,localRight:S,legLength:n.legLength,stride:Tt,grounded:!0}:{phase:Li.phase,speed:Li.speed,moveSpeed:e,localForward:Li.localForward,localRight:Li.localRight,legLength:n.legLength,stride:Li.stride??0,grounded:I.grounded},Uu=ri?su(Jc,s,{progress:Ut,phase0:Ft,phaseEnd:bt}):Vc(Jc,s),le=wM(Uu,te.gaitScale);if(V=0,Ce&&Ct){const me=vM(Ct.progress,Ct.dir,s),ee=te.gaitScale;le.legL.pitchX+=me.legL.pitchX*ee,le.legL.rollZ+=me.legL.rollZ*ee,le.legL.kneeX+=me.legL.kneeX*ee,le.legR.pitchX+=me.legR.pitchX*ee,le.legR.rollZ+=me.legR.rollZ*ee,le.legR.kneeX+=me.legR.kneeX*ee,le.pelvisY+=me.pelvisY*ee,V=me.env}let lo=0,ho=0,uo=0,Qc=0;if(ri){const me=lu(I.bodyYaw,Y,rt),ee=du(Ut,Ft,me.forward,me.right,s);ee.leadLeft?(le.legL.pitchX-=ee.leadPitch,le.legL.kneeX+=ee.leadKnee,le.legR.pitchX+=ee.trailPitch):(le.legR.pitchX-=ee.leadPitch,le.legR.kneeX+=ee.leadKnee,le.legL.pitchX+=ee.trailPitch),ho=ee.bodyShift*ee.fwdN,lo=ee.bodyShift*ee.rightN,uo=ee.bodyDip,Qc=ee.chestPitch,gt=ee.leadPitch,Gt=ee.bodyShift,nt=ee.bodyDip}else gt=0,Gt=0,nt=0;Vt={lp:le.legL.pitchX,lr:le.legL.rollZ,rp:le.legR.pitchX,rr:le.legR.rollZ},I.grounded?(U.root.rotation.x=le.legL.pitchX,X.root.rotation.x=le.legR.pitchX,U.root.rotation.z=le.legL.rollZ,X.root.rotation.z=le.legR.rollZ,U.joint.rotation.x=le.legL.kneeX,X.joint.rotation.x=le.legR.kneeX,L.root.rotation.x=le.armL,C.root.rotation.x=le.armR,L.joint.rotation.x=-(.18+le.armL*.2),C.joint.rotation.x=-(.18+le.armR*.2),L.root.rotation.z=0,C.root.rotation.z=0,g.position.x=le.pelvisX,g.position.y=x+le.pelvisY,g.position.z=0,g.rotation.z=le.pelvisRoll):(U.root.rotation.x=-.55,X.root.rotation.x=-.25,U.joint.rotation.x=.75,X.joint.rotation.x=.55,L.root.rotation.x=-.9,C.root.rotation.x=-.7,L.joint.rotation.x=-.6,C.joint.rotation.x=-.6,U.root.rotation.z=0,X.root.rotation.z=0);const Fu=gu(g,v),xs=Ce?{...f,weight:0}:ri&&f.enabled?{...f,weight:1}:f,tl=xs.enabled&&I.grounded&&xs.weight>0?Ue(xs.weight,0,1)*(ie?Ue(xs.attackScale,0,1):1):0;g.position.x+=lo,g.position.z+=ho,g.position.y-=uo,v.position.y+=uo,tl<=0&&(v.position.x-=lo,v.position.z-=ho);const Nu=gn/Math.max(e,ji),zu=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Ou=1-Math.exp(-Math.max(0,zu)*Pt);Mt+=(Ue(Nu,0,1)-Mt)*Ou;const Di=mu({leanForward:mt,leanSide:It,speedRatio:Mt},o);g.rotation.x+=Di.pelvisPitch,g.rotation.z+=Di.pelvisRoll,g.position.x+=Di.pelvisX,g.position.z+=Di.pelvisZ,g.position.y-=Di.crouch,v.position.y+=Di.crouch*(1-Ue(tl,0,1)),cn(N),T(dt,I.gaitPhase),Z(wt);const Bu=a.greatswordPitchDeg*Math.PI/180,el=N.weapon==="greatsword",nl=Math.hypot(I.velocity.x,I.velocity.z),Hu=el&&N.phase==="idle"&&nl>.5?Math.min(1.15,nl/Math.max(e,.001)*.9):0;At+=(Hu-At)*(1-Math.exp(-6*Pt)),el&&(H.rotation.x=Bu+At),N.weapon==="bow"&&(ot.g.rotation.x=-(L.root.rotation.x+L.joint.rotation.x),ft.rotation.x=-(C.root.rotation.x+C.joint.rotation.x));const Gu=m.rotation.y;Oe(k,I.bodyYaw);const il=k.type==="none"?1:.4;if(m.rotation.x+=mt*il+Qc,m.rotation.z+=(It+le.sideLean)*il,Qt>0&&(U.root.rotation.x-=Wt.hipPitch*Qt,X.root.rotation.x-=Wt.hipPitch*Qt,U.joint.rotation.x+=Wt.kneeBend*Qt,X.joint.rotation.x+=Wt.kneeBend*Qt,g.position.y-=Wt.crouchDepth*Qt,v.position.y+=Wt.crouchDepth*(1-Wt.lowerScale)*Qt,m.rotation.x+=Wt.upperPitch*Qt,L.root.rotation.x-=Wt.armTuck*Qt,C.root.rotation.x-=Wt.armTuck*Qt),lt>0&&I.grounded){const me=SM(N.attackProgress,N.comboIndex,c.stride),ee=lt;U.root.rotation.x+=me.legL.pitchX*ee,X.root.rotation.x+=me.legR.pitchX*ee,U.root.rotation.z+=me.legL.rollZ*ee,X.root.rotation.z+=me.legR.rollZ*ee,U.joint.rotation.x+=me.legL.kneeX*ee,X.joint.rotation.x+=me.legR.kneeX*ee,g.position.x+=me.pelvisX*ee,g.position.y+=me.pelvisY*ee,g.rotation.z+=me.pelvisRoll*ee}v.rotation.y=G,at=cu(G,s.chestYawScale,s.chestYawMaxDeg),m.rotation.y+=at;const Vu=Gu;A.rotation.y=Ge(I.headYaw-I.bodyYaw-Vu-at),St=xu({root:u,pelvis:g,lower:v,limbs:W,base:Fu,cfg:xs,grounded:I.grounded,attacking:ie})},lean(){return{forward:mt,side:It}},landing(){const I=Wh(Yt,be,ne,re,_e),N=ne>0?Math.max(0,ne-Math.max(0,Yt-be)):0;return{pulse:I,remaining:N,kind:I>0?Ee:"none",impactVy:Re}},hurt(){return Ot},ik(){return St},attackBlend(){return q},attackWeights(){return{gaitScale:ht,attackLegWeight:lt,driveSpeed:Rt.speed,stridePhase:Rt.phase}},hipYaw(){return G},gaitDebug(){return{stopT:Ut,hipYaw:G,chestYaw:at,speed:ct,gaitSpeed:_t,stopStep:gt,stopShift:Gt,stopDip:nt,stopYawFade:ut,turnStep:V,legLPitch:Vt.lp,legLRoll:Vt.lr,legRPitch:Vt.rp,legRRoll:Vt.rr}},gaitYaw(){return qt},arrowDirection(){ft.updateWorldMatrix(!0,!1);const I=ft.matrixWorld.elements,N=I[8],k=I[9],st=I[10],dt=Math.hypot(N,k,st)||1;return{x:N/dt,y:k/dt,z:st/dt}},dispose(){u.traverse(I=>{if(I instanceof he){I.geometry.dispose();const N=I.material;Array.isArray(N)?N.forEach(k=>k.dispose()):N.dispose()}})}}}function QM(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function tS(n,t,e,i){const s=Math.max(1,n.clientWidth),a=Math.max(1,n.clientHeight),o=new Ty({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=md,o.setSize(s,a,!1),n.appendChild(o.domElement);const r=new Ry;r.background=new Zt("#12161d"),r.add(new lM(11061486,2764600,1.15));const c=new uM(16773852,1.5);c.position.set(9,18,11),c.castShadow=!0,c.shadow.mapSize.set(1024,1024);const l=c.shadow.camera;l.left=-20,l.right=20,l.top=20,l.bottom=-20,l.near=1,l.far=60,r.add(c);const h=[],f=new ge;for(const O of t.boxes){const V=O.maxX-O.minX,q=O.maxY-O.minY,lt=O.maxZ-O.minZ;let ht=QM(O.kind,e);O.kind==="step"&&(ht=new Zt(ht).offsetHSL(0,0,O.maxY*.09).getStyle());const Rt=new Gs({color:ht,transparent:!0,opacity:1}),Vt=new he(new Ln(V,q,lt),Rt);Vt.position.set((O.minX+O.maxX)/2,(O.minY+O.maxY)/2,(O.minZ+O.maxZ)/2),Vt.castShadow=O.kind!=="ground",Vt.receiveShadow=!0,Vt.add(new Wd(new Xy(Vt.geometry),new Uc({color:10467020,transparent:!0,opacity:.32}))),f.add(Vt),h.push(Rt)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new pM(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const g=kM(i,e);r.add(g.group);const v=JM(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),m=new ge,p=.9,x=new ge;x.position.y=p,v.group.position.y=-p,x.add(v.group),m.add(x),r.add(m);const _=t.dummies.map((O,V)=>{const q=e.dummies.colors,lt=q[V%q.length]??"#cccccc",ht=IM(e.voxel,e.colors,lt,O.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return ht.group.traverse(Rt=>{Rt.userData.dummyId=O.id}),r.add(ht.group),ht}),y=_.map(O=>O.group),D=new fM,b=e.groundRing,w=e.voxel.bodyWidth,A=Yh(w,b.playerRadiusFactor),E=Yh(w,b.dummyRadiusFactor),M=w*b.thicknessFactor,R=b.arcDeg*Math.PI/180;let F=0;const U=sr({radius:A,thickness:M,arcRad:R,edgeFade:b.edgeFade,color:b.playerColor,opacity:b.playerOpacity,y:.028,renderOrder:6});U.mesh.name="player-ground-ring",r.add(U.mesh);const X=t.dummies.map(O=>{const V=sr({radius:E,thickness:M,arcRad:R,edgeFade:b.edgeFade,color:b.neutralColor,opacity:b.opacity,y:.022,renderOrder:5});return V.mesh.name=`dummy-ground-ring-${O.id}`,r.add(V.mesh),V}),L=t.dummies.map(O=>{const V=sr({radius:E*b.haloRadiusFactor,thickness:M*b.haloThicknessFactor,arcRad:R,edgeFade:b.edgeFade,color:b.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return V.mesh.name=`dummy-ground-halo-${O.id}`,r.add(V.mesh),V}),C=t.dummies.map(()=>0),W=t.dummies.map(()=>0),H=Zh({radius:A*b.meterRadiusFactor,thickness:M*b.meterThicknessFactor,arcRad:R,edgeFade:.06,color:b.meterColorCharge,y:.03,renderOrder:8});H.mesh.name="player-ground-meter",r.add(H.mesh);const K=t.dummies.map(O=>{const V=Zh({radius:E*b.warnRadiusFactor,thickness:M*b.warnThicknessFactor,arcRad:R,edgeFade:.02,color:b.warnColor,y:.031,renderOrder:9});return V.mesh.name=`dummy-ground-warn-${O.id}`,r.add(V.mesh),V}),J=qh({color:b.playerColor,y:.042,renderOrder:3});J.group.name="player-landing-preview",r.add(J.group);const ot=new Zt,ft=new Zt(b.playerColor),vt=new Zt(b.neutralColor),j=new Zt(b.lowThreatColor),tt=new Zt(b.highThreatColor),pt=new Zt(b.meterColorCharge),Q=new Zt(b.meterColorChannel),mt=new Zt(b.meterColorCooldown),It=new Zt(b.warnColor),At=new ge;r.add(At);const Ot=new Je({color:12577023,transparent:!0,opacity:0,side:Le,depthWrite:!1}),St=new ge;St.position.set(0,.95,.72),At.add(St);const Mt=new ge;Mt.rotation.x=WM(e.camera.pitchDeg),St.add(Mt);const G=new he(new so(.78,.045,6,24,Math.PI*1.15),Ot);Mt.add(G);const qt=new Bc(1,0),Ut=new Je({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),Ft=Array.from({length:16},()=>{const O=new he(qt,Ut);return O.visible=!1,r.add(O),O}),bt=Array.from({length:6},()=>{const O=qh({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return O.group.visible=!1,r.add(O.group),O}),yt=new Je({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),Tt=new he(new Ln(.035,.035,.5),yt);At.add(Tt);const P=e.dash,S=new Hs(P.ringRadius-.06,P.ringRadius,28),Y=Array.from({length:6},()=>{const O=new Je({color:16777215,transparent:!0,opacity:0,side:Le,depthWrite:!1}),V=new he(S,O);return V.rotation.x=-Math.PI/2,V.visible=!1,r.add(V),{mesh:V,mat:O,life:0,base:1}});function rt(O,V,q,lt,ht){const Rt=Y.find(Vt=>Vt.life<=0)??Y[0];Rt.mat.color.set(lt),Rt.mesh.position.set(O,q+.04,V),Rt.base=ht,Rt.mesh.scale.setScalar(ht*.6),Rt.mesh.visible=!0,Rt.mat.opacity=.9,Rt.life=P.fxDuration}const ct=e.links,at=new Hs(ct.ringRadius-.07,ct.ringRadius,28),Nt=Array.from({length:5},()=>{const O=new Je({color:ct.chargeColor,transparent:!0,opacity:0,side:Le,depthWrite:!1}),V=new he(at,O);return V.rotation.x=-Math.PI/2,V.visible=!1,r.add(V),{mesh:V,mat:O,life:0,base:1}});function et(O,V,q,lt){const ht=Nt.find(Rt=>Rt.life<=0)??Nt[0];ht.mesh.position.set(O,q+.05,V),ht.base=lt,ht.mesh.scale.setScalar(lt*.55),ht.mesh.visible=!0,ht.mat.opacity=.85,ht.life=ct.fxDuration}let gt=t.playerLink.id,Gt=t.playerLink.hitIds.length,nt=t.dash.id,_t="none",B=0,it=-1,ut=1;const Et=gM(e.camera,e.smartCamera,e.zoom,s/a),zt=t.character.position;Et.update(zt.x,zt.y,zt.z,1,t.camera);function Xt(O,V){if(y.length===0)return 0;const q=o.domElement.getBoundingClientRect(),lt=new Bt((O-q.left)/q.width*2-1,-((V-q.top)/q.height)*2+1);D.setFromCamera(lt,Et.camera);const ht=D.intersectObjects(y,!0);for(const Rt of ht){const Vt=Rt.object.userData.dummyId;if(Vt&&Vt>0)return Vt}return 0}function z(O,V,q){const lt=o.domElement.getBoundingClientRect(),ht=new $(O,V,q).project(Et.camera);return{x:lt.left+(ht.x*.5+.5)*lt.width,y:lt.top+(-ht.y*.5+.5)*lt.height}}return{gaitDebug(){return v.gaitDebug()},render(O,V){const q=O.character,lt=O.combat;m.position.set(q.position.x,q.position.y,q.position.z),m.rotation.y=q.bodyYaw;const ht=O.dash.phase==="active"&&O.dash.kind==="roll",Rt=ht&&O.dash.duration>0?Math.min(1,1-O.dash.timer/O.dash.duration):0;x.rotation.x=ht?Rt*Math.PI*2:0,x.position.y=p-(ht?.2*Math.sin(Math.PI*Rt):0),v.update(q,lt,O.playerHurt,V,O.abilities.channeling,O.time,O.playerLink,O.turnInPlace);for(let Dt=0;Dt<_.length;Dt++)O.dummies[Dt]&&_[Dt].update(O.dummies[Dt],V);const Vt=Et.camera.position,Jt=Math.atan2(Vt.x-q.position.x,Vt.z-q.position.z),Yt=O.config.gaze.hurtHoldSec,oe=O.time-O.playerHurt.lastAt,ve=Yt>0&&oe>=0&&oe<Yt?1-oe/Yt:0,Ee=NM(O.gaze.active,O.gaze.threat,ve,O.time,b);zM(ot,ft,j,tt,Ee.level),F=XM(q.grounded,q.position.y,F),U.mesh.position.set(q.position.x,F+.028,q.position.z),U.update(Ee.arcRad,Ee.opacity,Ee.scale,ot,Jt);const be=HM({charging:lt.charging,charge:lt.charge,channeling:O.abilities.channeling,fireTimer:O.abilities.fireTimer,fireInterval:O.config.abilities.arcane.fireInterval,dashCooldown:O.dash.cooldown,dashCooldownMax:O.dash.kind==="blink"?O.config.dash.blinkCooldown:O.config.dash.rollCooldown});H.mesh.position.set(q.position.x,q.position.y+.03,q.position.z),H.set(be.ratio,be.source==="none"?0:b.meterOpacity,be.source==="charge"?pt:be.source==="channel"?Q:mt,Jt);const ne=O.playerLink,re=ne.weapon?O.config.links.moves[ne.weapon]:void 0,_e=GM(ne.phase,q.position.x,q.position.z,ne.facing,ne.travel,(re==null?void 0:re.hit.radius)??.9);J.set(_e.x,_e.z,.042,_e.radius,_e.active?b.landingOpacity:0,O.time);for(let Dt=0;Dt<X.length;Dt++){const $t=O.dummies[Dt],ue=X[Dt],Oe=L[Dt],ce=K[Dt];if(!$t){ue.mesh.visible=!1,Oe.mesh.visible=!1,ce.mesh.visible=!1;continue}const In=O.targeting.hasTarget&&O.targeting.targetId===$t.id;if(qf(O,$t)){const dt=jf(O,$t);ot.copy(j).lerp(tt,dt)}else ot.copy(vt);const cn=BM($t.attackPhase,$t.attackPhaseTimer,O.config.dummies.attackWindup);cn.active?(ot.lerp(It,.5*cn.urgency),ce.mesh.position.set($t.position.x,$t.position.y+.031,$t.position.z),ce.set(cn.ratio,b.warnOpacity*(.65+.35*cn.urgency),It,Jt)):ce.set(0,0,It,Jt);const T=In?1:0,Z=T>C[Dt]?b.haloFadeInSec:b.haloFadeOutSec;C[Dt]=jh(C[Dt],T,V,Z);const I=C[Dt],N=1+.02*I*Math.sin(O.time*2.2+$t.id),k=b.arcDeg+(b.selectedArcDeg-b.arcDeg)*I;ue.mesh.position.set($t.position.x,$t.position.y+.022,$t.position.z),ue.update(k*Math.PI/180,b.opacity+(b.selectedOpacity-b.opacity)*I,1+(b.selectedScale-1)*I*N,ot,Jt,1+(b.selectedThicknessScale-1)*I),W[Dt]=jh(W[Dt],T,V,T>W[Dt]?b.haloFadeInSec:b.haloFadeOutSec);const st=W[Dt];Oe.mesh.position.set($t.position.x,$t.position.y+.019,$t.position.z),Oe.update(k*Math.PI/180,b.haloOpacity*st*(.88+.12*Math.sin(O.time*2.2+$t.id)),b.selectedScale*(.94+.06*st)*N,ot,Jt)}if(At.position.set(q.position.x,q.position.y,q.position.z),At.rotation.y=lt.phase!=="idle"?lt.attackFacing:q.bodyYaw,O.dash.id!==nt){nt=O.dash.id;const Dt=O.dash;_t=Dt.kind,Dt.kind==="blink"?(rt(Dt.fromX,Dt.fromZ,q.position.y,P.blinkColor,.9),rt(Dt.toX,Dt.toZ,q.position.y,P.blinkColor,1.35)):rt(Dt.fromX,Dt.fromZ,q.position.y,P.rollColor,1.1)}for(const Dt of Y){if(Dt.life<=0)continue;Dt.life-=V;const $t=Math.max(0,Dt.life/P.fxDuration);Dt.mat.opacity=.9*$t,Dt.mesh.scale.setScalar(Dt.base*(.6+(1-$t)*1.2)),Dt.life<=0&&(Dt.mesh.visible=!1)}const Re=O.playerLink;Re.id!==gt&&(gt=Re.id,Gt=Re.hitIds.length,et(q.position.x,q.position.z,q.position.y,1)),Re.hitIds.length>Gt?(Gt=Re.hitIds.length,et(q.position.x,q.position.z,q.position.y,1.35)):Re.hitIds.length<Gt&&(Gt=Re.hitIds.length);for(const Dt of Nt){if(Dt.life<=0)continue;Dt.life-=V;const $t=Math.max(0,Dt.life/Math.max(ct.fxDuration,1e-6));Dt.mat.opacity=.85*$t,Dt.mesh.scale.setScalar(Dt.base*(.55+(1-$t)*1.1)),Dt.life<=0&&(Dt.mesh.visible=!1)}lt.attackId!==B&&(B=lt.attackId,lt.weapon==="bow"&&lt.phase!=="idle"&&(it=0,ut=.6+lt.lastCharge*.9));const Fe=lt.phase==="active"&&lt.comboIndex>0;Ot.opacity=Fe?.78:0,Fe&&(G.rotation.z=-1.2+lt.attackProgress*3.2,G.scale.setScalar(.9+lt.comboIndex*.13));for(let Dt=0;Dt<Ft.length;Dt++){const $t=O.abilities.projectiles[Dt],ue=Ft[Dt];ue.visible=!!$t,$t&&(ue.position.set($t.x,$t.y,$t.z),ue.scale.setScalar($t.radius),ue.rotation.y+=V*6)}for(let Dt=0;Dt<bt.length;Dt++){const $t=O.abilities.rings[Dt],ue=bt[Dt];if(!$t){ue.group.visible=!1;continue}const Oe=Math.max(0,Math.min(1,$t.life/Math.max($t.duration,1e-6))),ce=VM(Math.max(0,$t.duration-$t.life),b.areaExpandSec);ue.set($t.x,$t.z,.045,$t.radius*ce.scale,b.areaOpacity*(.35+.65*Oe)*ce.alpha,O.time)}if(it>=0){it+=V;const Dt=it*14*ut;Tt.position.set(0,.85,.6+Dt),yt.opacity=Dt<9?.95:0,Dt>=9&&(it=-1)}else yt.opacity=0;Et.update(q.position.x,q.position.y,q.position.z,V,O.camera),o.render(r,Et.camera)},resize(){const O=Math.max(1,n.clientWidth),V=Math.max(1,n.clientHeight);o.setSize(O,V,!1),Et.resize(O/V)},getGroundBasis(){return Et.getGroundBasis()},setCollidersVisible(O){for(const V of h)V.opacity=O?.3:1,V.wireframe=O,V.needsUpdate=!0},setGridVisible(O){u.visible=O},setLabVisible(O){g.setVisible(O)},setLabLabelsVisible(O){g.setLabelsVisible(O)},snapCamera(O,V,q){Et.snap(O,V,q)},setZoom(O){Et.setZoom(O)},pickDummy:Xt,projectToScreen:z,diagnostics(){const O=yu(e.camera.pitchDeg),V=$M(O,At.rotation.y);return{lean:v.lean(),slashNormal:V,arrowForward:v.arrowDirection(),gait:{hipYaw:v.hipYaw(),gaitYaw:v.gaitYaw()},attackBlend:v.attackBlend(),attackWeights:v.attackWeights(),landing:v.landing(),hurt:v.hurt(),ik:v.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:x.rotation.x,activeRings:Y.filter(q=>q.life>0).length,lastKind:_t},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...Et.smart()}}},dispose(){v.dispose(),g.dispose();for(const O of _)O.dispose();U.dispose();for(const O of X)O.dispose();for(const O of L)O.dispose();H.dispose();for(const O of K)O.dispose();J.dispose(),G.geometry.dispose(),Ot.dispose(),qt.dispose(),Ut.dispose();for(const O of bt)O.dispose();Tt.geometry.dispose(),yt.dispose();for(const O of Y)O.mat.dispose();S.dispose();for(const O of Nt)O.mat.dispose();at.dispose(),f.traverse(O=>{O instanceof he&&O.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function eS(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function nS(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function iS(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),s=i("diag-status"),a=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,g=0;function v(){const x=n.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){d=x,e.hidden=!x,x?v():a.hidden=!0}function p(x){o.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!d)}),h.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const x=n.summary();eS(x).then(_=>{_?(p("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const x=n.dump(),_=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);nS(`harness-${x.meta.version}-${_}.json`,JSON.stringify(x)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),a.hidden=!0,v(),p("已清空")}),l.addEventListener("click",()=>{u=!u,n.setEnabled(u),v()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),d&&v()},isOpen:()=>d,close:()=>m(!1)}}const sS={intents:{...Kh},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function aS(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Jf(Dp,qs),i=tS(n,e,nn,qs.stations),s=tp(e),a=dm(t),o=um(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.36 · 11-07 17:43 · 诊断");const c=F=>String(F).padStart(2,"0"),l=new Date,h=Tp({meta:{version:"v0.9.36",buildTime:"11-07 17:43",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=iS(h,r),d=cm({deadZone:()=>nn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:nn.showColliders,showGrid:nn.showGrid,showLab:nn.lab.enabled,showLabLabels:nn.lab.showLabels};let g=1;const v=gp({maxRadiusPx:()=>nn.joystick.maxRadiusPx,deadZone:nn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>nn.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function x(F){if(F===p)return;p=F;const U=Ai.indexOf(F)+1;for(const X of m)X.classList.toggle("is-active",Number(X.dataset.weapon)===U);b.refreshWeapon()}let _=sS,y=0;const D=()=>{g=1,i.setZoom(1)},b=Wp(e,nn,u,{singleStep:()=>s.singleStep(_.intents),reset:()=>{g=1,s.singleStep({...Kh,resetPressed:!0})},resetZoom:D,onToggleColliders:F=>i.setCollidersVisible(F),onToggleGrid:F=>i.setGridVisible(F),onToggleLab:F=>i.setLabVisible(F),onToggleLabLabels:F=>i.setLabLabelsVisible(F)}),w=Zp({stations:qs.stations??[],world:e,view:i,onResetZoom:D});o.register({motion:d,debug:b.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:v,viewConfig:nn,debug:u,getUserZoom:()=>g,getGestures:()=>_.gestures,getLastGesture:()=>_.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),lab:{stations:qs.stations??[],goto:F=>w.goto(F),current:()=>w.current(),recall:()=>w.recall()}};let A=performance.now(),E=60,M=0;function R(F){const U=Math.min((F-A)/1e3,.1);A=F,U>0&&(E=E*.9+1/U*.1);const X=v.sample();X.intents.resetPressed&&(g=1),g=op(g,X.zoomScale,nn.zoom.min,nn.zoom.max),i.setZoom(g);let L=X.intents.dummyClickId;if(X.tap){const H=i.pickDummy(X.tap.x,X.tap.y);H>0&&(L=H)}L>0&&(y=L),_={...X,intents:{...X.intents,dummyClickId:y}};const C=s.frame(U,_.intents,u.timeScale,u.paused,()=>{const H=e.events;for(let K=0;K<H.length;K++)h.event(H[K],e.time)});C>0&&(y=0),h.sample(e,_,U*1e3,C);for(const H of _.gestures)h.gesture(H);F-M>250&&(M=F,f.tick()),x(e.combat.weapon),i.render(e,U),w.tick(),d.update(e,_,i.getGroundBasis());const W=i.diagnostics();a.update(e,E,C,_,u,{attackBlend:W.attackBlend,attackWeights:W.attackWeights,landing:W.landing,hurt:W.hurt,ik:W.ik,zoom:W.camera.zoom},o.hudCompact()),requestAnimationFrame(R)}requestAnimationFrame(R)}aS();

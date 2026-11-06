(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Qn=["sword-shield","dual-swords","greatsword","staff","bow"],ya=["wander","follow","keep-distance","attack","idle"],hl={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},ia=1e-6;function ua(i,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ia?Math.atan2(t.aimX,t.aimZ):i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget?i.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>ia?Math.atan2(t.moveX,t.moveZ):i.character.facing}function lh(i,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ia){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>ia)return{x:t.moveX/e,z:t.moveZ/e};const n=i.character.facing;return{x:Math.sin(n),z:Math.cos(n)}}const He=1e-6,rr=Math.PI/180;function dl(){return{type:"none",timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function or(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Fo(i,t,e,n,s){i.type=t,i.duration=e,i.timer=e,i.dirX=n,i.dirZ=s,i.knockX=0,i.knockZ=0}function ho(i,t,e){const n=e.duration>0?e.duration:fo(i,e.type);if(t.kind==="player"){const a=i.playerHurt;if(Fo(a,e.type,n,e.dirX,e.dirZ),!i.config.hits.noDamageToPlayer&&e.knockback>He){const r=e.knockback*i.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}or(i,"player-hurt",e.sourceId??0,i.character.position);return}const s=i.dummies[t.index];if(s){if(Fo(s.hurt,e.type,n,e.dirX,e.dirZ),e.knockback>He){const a=e.knockback*i.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}i.hitCount+=1,or(i,"hit",s.id,s.position)}}function uo(i,t,e){ho(i,{kind:"dummy",index:t},e)}function hh(i,t){const e=[i.playerHurt];for(const s of i.dummies)e.push(s.hurt);const n=Math.exp(-i.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=n,s.knockZ*=n,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function fo(i,t){const e=i.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function dh(i){const t=i.combat,e=i.config.hits,n=i.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*rr),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=i.config.dummies.radius,l=i.config.targeting.idealRange;for(const d of i.dummies){const u=d.position.x-n.x,f=d.position.z-n.z,h=Math.hypot(u,f);if(h>s+c)continue;const g=h>He?u/h:r,_=h>He?f/h:o;if(h>He&&(u*r+f*o)/h<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=h;p>0&&(x=Math.max(h+p,l));const y=Math.max(0,x-h);uo(i,i.dummies.indexOf(d),{type:m,duration:fo(i,m),dirX:g,dirZ:_,knockback:y})}}function uh(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="active")return;const s=n.weapon===""?void 0:e.moves[n.weapon];if(!s||!s.enabled||!i.modules.hits||!i.modules.dummies)return;const a=s.hit;if(n.pulseTimer-=t,n.pulseTimer>0)return;n.pulseTimer=Math.max(a.pulseInterval,0);const r=i.character.position,o=n.fromX,c=n.fromZ,l=r.x,d=r.z,u=l-o,f=d-c,h=u*u+f*f,g=Math.sin(n.facing),_=Math.cos(n.facing),m=Math.cos(ko(a.arcDeg,0,180)*rr),p=i.config.dummies.radius;for(let x=0;x<i.dummies.length;x++){const y=i.dummies[x];if(n.hitIds.indexOf(y.id)>=0)continue;const M=h>He?ko(((y.position.x-o)*u+(y.position.z-c)*f)/h,0,1):0,L=o+u*M,C=c+f*M,w=Math.hypot(y.position.x-L,y.position.z-C);let P=!1;if(a.shape==="circle")P=w<=a.radius+p;else if(a.shape==="capsule")P=w<=Math.max(a.radius,a.width)+p;else{const X=y.position.x-l,G=y.position.z-d,V=Math.hypot(X,G),$=V>He?(X*g+G*_)/V>=m:!0;P=V<=a.radius+p&&$||w<=a.width+p}if(!P)continue;const b=y.position.x-o,S=y.position.z-c,R=Math.hypot(b,S);if(R>He&&(b*g+S*_)/R<Math.cos(Math.max(a.arcDeg,90)*rr))continue;const W=R>He?b/R:g,H=R>He?S/R:_;ho(i,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:W,dirZ:H,knockback:a.knockback}),n.hitIds.push(y.id),or(i,"link-hit",y.id,y.position)}}function fh(i){const t=i.config.hits,e=i.character.position;for(const n of i.events){if(n.type!=="dummy-hit")continue;const s=i.dummies[n.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>He?a/o:0,l=o>He?r/o:1;ho(i,{kind:"player"},{type:"light",duration:fo(i,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function ph(i,t){if(!i.modules.hits)return;i.events.some(n=>n.type==="attack-active")&&dh(i),uh(i,t),fh(i)}function ko(i,t,e){return i<t?t:i>e?e:i}const Zs=1e-6;function ts(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function mh(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function gh(i){const t=i.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function _h(i){const t=i.abilities,e=i.config.abilities.arcane,n=i.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:n.x+s*r,y:n.y+1,z:n.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,ts(i,"projectile-fire",t.volleyId,o)}function xh(i,t,e){const n=i.abilities,s=i.config.abilities.arcane,a=i.dash.phase==="active",r=i.playerLink;if(i.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){n.channeling||(n.channeling=!0,n.fireTimer=0,ts(i,"channel-start",0,i.character.position)),n.channelYaw=ua(i,e),n.fireTimer-=t;let c=0;for(;n.fireTimer<=0&&c++<8;)n.fireTimer+=Math.max(s.fireInterval,Zs),_h(i)}else n.channeling&&(n.channeling=!1,ts(i,"channel-end",0,i.character.position))}function vh(i,t){const e=i.config.abilities.ring,n=i.dash.phase==="active";if(i.combat.weapon!=="staff"||!t.skill2Pressed||n)return;const s=i.character.position,a={id:++i.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};i.abilities.rings.push(a),ts(i,"ring-place",a.id,s)}function Mh(i,t){const e=i.abilities,n=i.config.abilities.arcane,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<i.dummies.length;l++){const d=i.dummies[l],u=d.position.x-o.x,f=d.position.z-o.z,h=o.radius+s;if(!(u*u+f*f>h*h)){uo(i,l,{type:n.hurtType,duration:n.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:n.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function yh(i,t){const e=i.abilities,n=i.config.abilities.ring,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(n.pulseInterval,Zs),a)for(let l=0;l<i.dummies.length;l++){const d=i.dummies[l],u=d.position.x-o.x,f=d.position.z-o.z,h=o.radius+s;if(u*u+f*f>h*h)continue;const g=Math.hypot(u,f),_=g>Zs?u/g:0,m=g>Zs?f/g:1;uo(i,l,{type:"heavy",duration:n.stun,dirX:_,dirZ:m,knockback:n.knockback})}ts(i,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function Sh(i,t,e){xh(i,t,e),vh(i,e),Mh(i,t),yh(i,t)}function Sa(i){i.rngState=i.rngState+1831565813>>>0;let t=i.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const zo=1e-6;function Oo(i,t,e){return i<t?t:i>e?e:i}function ul(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function fl(i){const t=i.camera,e=ul();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=i.character.position.x,t.centroidZ=i.character.position.z}function bh(i){const t=i.camera,e=i.config.camera,n=i.character.position;let s=0,a=0,r=0,o=0;for(const l of i.dummies){const d=l.position.x-n.x,u=l.position.z-n.z,f=Math.hypot(d,u);if(f>e.radius)continue;const h=Oo((e.radius-f)/Math.max(zo,e.radius-e.nearDistance),0,1);let g=h*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*h),s+=g,a+=l.position.x*g,r+=l.position.z*g,o+=1}const c=s<=0?0:Oo(s/(s+Math.max(zo,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=n.x,t.centroidZ=n.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,d=r/s;t.centroidX=l,t.centroidZ=d;let u=(l-n.x)*e.framingBias*c,f=(d-n.z)*e.framingBias*c;const h=Math.hypot(u,f);h>e.maxOffset&&(u=u/h*e.maxOffset,f=f/h*e.maxOffset),t.offsetX=u,t.offsetZ=f}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Eh(i){const t=[],e=i.ground.size;t.push(oi("ground","ground",0,0,e,e,-i.ground.thickness,0));for(const n of i.steps)t.push(oi(n.id,"step",n.x,n.z,n.width,n.depth,0,n.height));for(const n of i.doorways){const s=n.openingWidth/2,a=n.wallThickness;t.push(oi(`${n.id}-left`,"wall",n.x-s-n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(oi(`${n.id}-right`,"wall",n.x+s+n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(oi(`${n.id}-lintel`,"lintel",n.x,n.z,n.openingWidth,a,n.openingHeight,n.wallHeight))}for(const n of i.obstacles)t.push(oi(n.id,"obstacle",n.x,n.z,n.width,n.depth,0,n.height));return t}function oi(i,t,e,n,s,a,r,o){return{id:i,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:n-a/2,maxZ:n+a/2}}const _n=1e-6;function sa(i,t,e){return i<t?t:i>e?e:i}function cr(i,t,e,n,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of i)l.maxY>n+a+_n||l.maxY<n-r-_n||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function po(i,t,e,n,s){let a=!1;const r=t.y+n;for(let o=0;o<2;o++)for(const c of i){if(c.maxY<=t.y+s+_n||c.minY>=r-_n)continue;const l=sa(t.x,c.minX,c.maxX),d=sa(t.z,c.minZ,c.maxZ),u=t.x-l,f=t.z-d,h=u*u+f*f;if(!(h>=e*e))if(a=!0,h>_n*_n){const g=Math.sqrt(h),_=(e-g)/g;t.x+=u*_,t.z+=f*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,p=c.maxZ-t.z,x=Math.min(g,_,m,p);x===g?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function mo(i,t,e,n,s){const a=t.y+n;for(const r of i){if(r.maxY<=t.y+s+_n||r.minY>=a-_n)continue;const o=sa(t.x,r.minX,r.maxX),c=sa(t.z,r.minZ,r.maxZ),l=t.x-o,d=t.z-c;if(l*l+d*d<e*e-_n)return!0}return!1}const lr=1e-6;function ti(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Bo(i,t,e,n){const s=ti(t-i);return i+s*(1-Math.exp(-Math.max(e,lr)*n))}function Ah(i,t,e){const n=i.character,s=i.config.orientation,a=i.combat,r=Math.hypot(e.moveX,e.moveZ),o=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>lr,c=i.abilities.channeling,l=a.charging&&a.weapon==="bow"&&i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget;a.phase!=="idle"?n.facing=a.attackFacing:o||c?n.facing=ua(i,e):l?n.facing=i.targeting.targetYaw:r>lr&&(n.facing=Math.atan2(e.moveX,e.moveZ));const d=n.velocity;Math.hypot(d.x,d.z)>.15&&(n.moveYaw=Math.atan2(d.x,d.z)),n.bodyYaw=Bo(n.bodyYaw,n.facing,s.bodyTurnRate,t);let u=Bo(n.headYaw,n.facing,s.headTurnRate,t);const f=s.maxHeadTurnDeg*Math.PI/180,h=ti(u-n.bodyYaw);h>f?u=n.bodyYaw+f:h<-f&&(u=n.bodyYaw-f),n.headYaw=u}const hr=1e-6,Th=Math.PI/180;function dr(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function go(i,t,e){return i<t?t:i>e?e:i}function fa(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function ur(i){const t=i.id,e=i.windowId;Object.assign(i,fa()),i.id=t,i.windowId=e}function wh(i){ur(i)}function Rh(i){ur(i.playerLink);for(const t of i.dummies)ur(t.link)}function Ch(i,t){const e=[i.playerLink];for(const n of i.dummies)e.push(n.link);for(const n of e)n.linkWindow=Math.max(0,n.linkWindow-t),n.cooldown=Math.max(0,n.cooldown-t),n.linkWindow===0&&n.phase==="idle"&&n.source!=="none"&&(n.source="none",n.usedWindowId=-1)}function fr(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(n.linkWindow=Math.max(n.linkWindow,s),n.source=t,n.windowId+=1,n.usedWindowId=-1,n.prevSprinting=!1)}function aa(i){const t=i.playerLink;if(t.phase==="idle")return;const e=t.id,n=t.windowId;Object.assign(t,fa()),t.id=e,t.windowId=n,t.fromX=i.character.position.x,t.fromZ=i.character.position.z}function Ph(i,t){const e=i.config.links.search,n=i.character.position,s=go(e.maxAngleDeg,0,180)*Th;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of i.dummies){const l=c.position.x-n.x,d=c.position.z-n.z,u=Math.hypot(l,d);if(u<hr||u>e.range)continue;const f=Math.atan2(l,d);Math.abs(ti(f-t))>s||u<o&&(o=u,a=c.id,r=f)}return{id:a,yaw:r,dist:a>0?o:0}}function Lh(i,t,e,n){const s=i.config.links,a=i.playerLink,r=i.character.position,o=ua(i,t),c=Ph(i,o),l=c.id>0?c.yaw:o,d=c.id>0?go(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=n,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=d,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,i.dash.cooldown=Math.max(i.dash.cooldown,s.sharedCooldown),dr(i,"link-start",a.id)}function Dh(i,t){const e=i.playerLink;if(e.phase==="idle")return;const n=e.weapon===""?void 0:i.config.links.moves[e.weapon];if(!n){aa(i);return}if(e.weapon!==i.combat.weapon){aa(i);return}e.timer+=t;const s=c=>c==="windup"?n.windup:c==="active"?n.active:n.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,dr(i,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,dr(i,"link-end",e.id))}const r=n.windup+n.active+n.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=n.windup+e.timer:e.phase==="recovery"?o=n.windup+n.active+e.timer:o=r,e.progress=r>0?go(o/r,0,1):1,e.phase==="active"&&n.active>hr){const c=Math.max(0,e.travel-e.travelled),l=Math.max(hr,n.active-e.timer),d=c/l;i.impulse.x=Math.sin(e.facing)*d,i.impulse.z=Math.cos(e.facing)*d}}function Ih(i,t,e){const n=i.config.links,s=i.playerLink,a=i.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!n.enabled||!i.modules.links){s.phase!=="idle"&&aa(i);return}const r=i.combat,o=i.character.sprinting;o&&n.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&n.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,n.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&fr(i,"sprint"),s.prevSprinting=o,Dh(i,t);const c=n.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&i.dash.phase==="idle"&&!!c&&c.enabled&&Lh(i,e,c,r.weapon)}const pr=1e-6;function Ln(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function pl(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function ml(i){const t=i.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=pl()}function Uh(i){return{weapon:Qn[Math.max(0,i-1)]??Qn[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:pl()}}function Nh(i,t){return ua(i,t)}function Fh(i,t){const e=i.config.targeting;if(!e.targetAssist||!i.modules.targeting||!i.targeting.hasTarget)return t;const n=i.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*i.config.combat.minLungeScale;return Math.min(Math.max(n,0)+a,s)}function gl(i,t,e,n){const s=i.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=n,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=Nh(i,t),s.attackProgress=0,s.timings=e,s.attackId+=1,Ln(i,"attack-start",n)}function _l(i){return Math.max(0,i.config.combat.settle)}function mr(i,t,e){const n=i.config.combat.weapons[i.combat.weapon];gl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:_l(i),lunge:Fh(i,n.lunge[e-1]??0)},e)}function kh(i,t,e){const n=i.config.combat.bow.release;i.combat.lastCharge=e,gl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:_l(i),lunge:n.lunge},0),Ln(i,"charge-release",e)}function zh(i,t,e){const n=i.combat;if(n.phase==="idle")return;const s=n.timings;n.phaseTimer+=t;let a=0;for(;n.phase!=="idle"&&a++<8;){const c=n.phase==="windup"?s.windup:n.phase==="active"?s.active:n.phase==="recovery"?s.recovery:s.settle;if(n.phaseTimer<c)break;if(n.phaseTimer-=c,n.phase==="windup")n.phase="active",Ln(i,"attack-active",n.comboIndex);else if(n.phase==="active")n.phase="recovery";else if(n.phase==="recovery")n.phase="settle",Ln(i,"attack-end",n.comboIndex);else if(n.phase="idle",n.phaseTimer=0,n.comboWindow=i.config.combat.comboWindow,n.queued){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&mr(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}if(n.queued&&n.phase==="recovery"){const c=n.timings.recovery;if(c>pr&&n.phaseTimer>=c*i.config.combat.cancelWindow){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&mr(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;n.phase==="windup"?o=n.phaseTimer:n.phase==="active"?o=s.windup+n.phaseTimer:n.phase==="recovery"?o=s.windup+s.active+n.phaseTimer:n.phase==="settle"&&(o=r),n.phase!=="idle"&&(n.attackProgress=r>0?Math.min(1,o/r):1)}function Oh(i,t,e){const n=i.combat,s=i.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Qn.length){const c=Qn[e.weaponSlot-1];c!==n.weapon&&(n.weapon=c,ml(i),aa(i),Ln(i,"weapon-change",e.weaponSlot))}n.phase==="idle"&&n.comboWindow>0&&(n.comboWindow=Math.max(0,n.comboWindow-t),n.comboWindow===0&&n.comboIndex>0&&(n.comboIndex=0,Ln(i,"combo-reset",0))),zh(i,t,e);const a=s.weapons[n.weapon],r=i.dash.phase==="active";if(a.comboCount>0){const c=i.playerLink.phase!=="idle"||i.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(n.phase==="idle"){const d=n.comboWindow>0&&n.comboIndex<a.comboCount?n.comboIndex+1:1;mr(i,e,d)}else n.queued=!0}else if(n.weapon!=="staff"){if(n.weapon==="bow"&&(!r&&!i.playerLink.consumedAttack&&e.attackPressed&&n.phase==="idle"&&!n.charging&&(n.charging=!0,n.charge=0,Ln(i,"charge-start",0)),n.charging&&e.attackHeld&&(n.charge=Math.min(1,n.charge+t/Math.max(s.bow.maxChargeTime,pr))),n.charging&&!r&&(e.attackReleased||!e.attackHeld))){n.charging=!1;const c=n.charge;n.charge=0,c>=s.bow.minChargeToFire&&n.phase==="idle"?kh(i,e,c):Ln(i,"charge-release",0)}}if(!(i.playerLink.phase==="active")&&(i.impulse.x=0,i.impulse.z=0,n.phase==="active"&&n.timings.active>pr)){const c=n.timings.lunge/n.timings.active;i.impulse.x=Math.sin(n.attackFacing)*c,i.impulse.z=Math.cos(n.attackFacing)*c}}const gr=1e-6;function ba(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Bh(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Hh(i){const t=i.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=i.character.position.x,t.fromZ=i.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Ho(i,t,e){return i<t?t:i>e?e:i}function Vh(i,t,e){const n=i.config.dash,a=i.character.position,r=i.config.worldBounds,o=Math.max(.05,n.blinkStep),c=Math.max(0,n.blinkDistance);let l=0,d=a.x,u=a.z;for(;l<c-gr;){const f=Math.min(c,l+o),h=a.x+t*f,g=a.z+e*f,_=Ho(h,r.minX,r.maxX),m=Ho(g,r.minZ,r.maxZ),p={x:_,y:a.y,z:m};if(mo(i.boxes,p,i.config.characterRadius,i.config.characterHeight,i.config.stepHeight)||(d=_,u=m,l=f,_!==h||m!==g))break}return{x:d,z:u}}function Gh(i,t,e){const n=i.dash,s=i.config.dash;if(n.phase==="active"&&n.timer<=0&&(n.phase="idle",n.timer=0,fr(i,"roll")),n.cooldown>0){const o=n.cooldown;n.cooldown=Math.max(0,n.cooldown-t),o>0&&n.cooldown===0&&ba(i,"dash-ready",0)}const a=i.combat;if(e.sprintPressed&&n.cooldown<=0&&n.phase==="idle"&&a.phase==="idle"&&!a.charging&&i.playerLink.phase==="idle"){const o=lh(i,e),c=o.x,l=o.z,d=i.combat.weapon==="staff";if(n.kind=d?"blink":"roll",n.dirX=c,n.dirZ=l,n.fromX=i.character.position.x,n.fromZ=i.character.position.z,n.id+=1,n.cooldown=d?s.blinkCooldown:s.rollCooldown,d){const u=Vh(i,c,l);i.character.position.x=u.x,i.character.position.z=u.z,n.toX=u.x,n.toZ=u.z,n.duration=0,n.timer=0,n.phase="idle",s.blinkClearVelocity&&(i.character.velocity.x=0,i.character.velocity.z=0),fr(i,"blink"),ba(i,"blink",n.id)}else n.phase="active",n.duration=Math.max(gr,s.rollDuration),n.timer=n.duration,n.toX=n.fromX+c*s.rollDistance,n.toZ=n.fromZ+l*s.rollDistance,ba(i,"roll",n.id)}if(n.phase==="active"&&n.kind==="roll"){const o=Math.max(gr,n.timer),c=i.character.position.x,l=i.character.position.z;i.impulse.x=(n.toX-c)/o,i.impulse.z=(n.toZ-l)/o}n.phase==="active"&&(n.timer=Math.max(0,n.timer-t))}const Ve=1e-6,_r=Math.PI*2,Wh=7,Xh=18;function Vo(i,t,e){return i<t?t:i>e?e:i}function $h(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Go(i,t,e,n){return i+$h(t-i)*(1-Math.exp(-Math.max(e,Ve)*n))}function _o(i,t,e){i.events.push({type:t,tick:i.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Yh(i){const t=[];for(let e=0;e<i.count;e++){const n=i.spawn[e]??{x:0,z:0},s=i.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:n.x,homeZ:n.z,position:{x:n.x,y:0,z:n.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,distance:0,targetX:n.x,targetZ:n.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:dl(),link:fa()})}return t}function Zh(i){const t=ya.indexOf(i);return ya[(t+1)%ya.length]}function qh(i){const t=i.config.dummies;for(let e=0;e<i.dummies.length;e++){const n=i.dummies[e],s=t.spawn[e]??{x:n.homeX,z:n.homeZ},a=t.initialModes[e]??n.initialMode;n.mode=a,n.initialMode=a,n.homeX=s.x,n.homeZ=s.z,n.position.x=s.x,n.position.y=0,n.position.z=s.z,n.velocity.x=0,n.velocity.y=0,n.velocity.z=0,n.facing=0,n.bodyYaw=0,n.headYaw=0,n.gaitPhase=0,n.distance=0,n.targetX=s.x,n.targetZ=s.z,n.wanderTimer=0,n.attackCooldown=0,n.attackPhase="idle",n.attackPhaseTimer=0,n.attackProgress=0;const r=n.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,wh(n.link)}i.dummyAttackCount=0}function jh(i,t,e){const n=Sa(i)*_r,s=Math.sqrt(Sa(i))*e.wanderRadius;t.targetX=t.homeX+Math.cos(n)*s,t.targetZ=t.homeZ+Math.sin(n)*s,t.wanderTimer=e.wanderInterval*(.6+Sa(i)*.8)}function Kh(i,t){return i.attackPhase==="windup"?t.attackWindup:i.attackPhase==="active"?t.attackActive:i.attackPhase==="recovery"?t.attackRecovery:0}function Jh(i,t,e,n){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(Kh(t,n),Ve);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",_o(i,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=n.attackWindup+n.attackActive+n.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=n.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=n.attackWindup+n.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function Qh(i,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const n=i.character.position,s=n.x-t.position.x,a=n.z-t.position.z,r=Math.hypot(s,a),o=r>Ve?s/r:0,c=r>Ve?a/r:0;let l=0,d=0;if(t.mode==="wander"){const f=t.targetX-t.position.x,h=t.targetZ-t.position.z,g=Math.hypot(f,h);(t.wanderTimer<=0||g<.3)&&jh(i,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>Ve&&(l=_/p,d=m/p)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,d=c);else if(t.mode==="keep-distance"){const f=r-e.keepDistance;f>e.keepDeadZone?(l=o,d=c):f<-e.keepDeadZone?(l=-o,d=-c):(l=-c*e.keepStrafe,d=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,d=c);let u=t.facing;return t.mode==="wander"?Math.hypot(l,d)>Ve&&(u=Math.atan2(l,d)):r>Ve&&(u=Math.atan2(o,c)),{x:l,z:d,facing:u}}function td(i,t,e,n){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=i.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=n.attackRange+Ve&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=n.attackInterval,i.dummyAttackCount+=1,_o(i,"dummy-attack",e))}Jh(i,e,t,n);const s=Qh(i,e,n),a=1-Math.exp(-Math.max(n.acceleration,Ve)*t);e.velocity.x+=(s.x*n.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*n.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=Go(e.bodyYaw,e.facing,Wh,t),e.headYaw=Go(e.headYaw,e.facing,Xh,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=i.config.stepHeight;po(i.boxes,e.position,n.radius,n.height,c)&&mo(i.boxes,e.position,n.radius,n.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const d=i.config.worldBounds;e.position.x=Vo(e.position.x,d.minX,d.maxX),e.position.z=Vo(e.position.z,d.minZ,d.maxZ);const u=cr(i.boxes,e.position.x,e.position.z,e.position.y,n.radius,c,Number.POSITIVE_INFINITY);u>Number.NEGATIVE_INFINITY&&u<=e.position.y+c+Ve&&(e.position.y=u);const f=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=f;const h=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(i.config.strideSpeedCap,h/Math.max(i.config.moveSpeed,Ve)),_=Math.max(i.config.strideLength*(1+g*i.config.strideSpeedGain),Ve);e.gaitPhase=(e.gaitPhase+f/_*_r)%_r}function ed(i,t,e){const n=i.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=i.dummies.length){const s=i.dummies[e.dummyClickId-1];s.mode=Zh(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,_o(i,"dummy-mode",s)}for(const s of i.dummies)td(i,t,s,n)}const ci=1e-6,Wo=Math.PI*2;function Ea(i,t){return Math.sqrt(i*i+t*t)}function ps(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function nd(i){const t=i.character,e=i.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.distance=0,t.coyoteTime=i.config.coyoteTime,t.jumpBuffer=0,ml(i)}function id(i,t,e){const n=i.config,s=i.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Ea(o,c);l>1&&(o/=l,c/=l);const d=i.combat.phase!=="idle",u=i.playerLink.phase!=="idle",f=d||i.dash.phase==="active"||u;s.sprinting=!f&&e.sprintHeld&&l>ci;const h=n.combat.weapons[i.combat.weapon];let g=h?h.moveMultiplier:1;f?g*=i.combat.phase==="settle"?n.combat.settleMoveScale:n.combat.attackMoveScale:i.combat.charging?g*=n.combat.bow.chargeMoveMultiplier:i.abilities.channeling&&(g*=n.abilities.arcane.moveScale);const _=n.moveSpeed*(s.sprinting?n.sprintMultiplier:1)*g;if(f)r.x=o*_,r.z=c*_;else{const W=l>ci?n.acceleration:n.friction,H=1-Math.exp(-W*t);r.x+=(o*_-r.x)*H,r.z+=(c*_-r.z)*H}e.jumpPressed?s.jumpBuffer=n.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?n.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=n.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,ps(i,"jumped",n.jumpSpeed)),i.events.some(W=>W.type==="blink"&&W.tick===i.tick)&&(r.x=0,r.z=0,i.impulse.x=0,i.impulse.z=0);const p=a.x,x=a.z;if(a.x+=(r.x+i.impulse.x+i.playerHurt.knockX)*t,a.z+=(r.z+i.impulse.z+i.playerHurt.knockZ)*t,po(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight)){if(mo(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight))a.x=p,a.z=x,r.x=0,r.z=0;else{const W=a.x-p,H=a.z-x;Math.abs(W)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(H)<Math.abs(r.z*t)*.5&&(r.z=0)}ps(i,"blocked",1)}const M=n.worldBounds;a.x=Xo(a.x,M.minX,M.maxX),a.z=Xo(a.z,M.minZ,M.maxZ);const L=cr(i.boxes,a.x,a.z,a.y,n.characterRadius,n.stepHeight,n.fallTolerance);s.grounded&&L>a.y+ci&&L-a.y<=n.stepHeight+ci&&(a.y=L,r.y=0,ps(i,"stepUp",L));const C=a.y;r.y-=n.gravity*t,a.y+=r.y*t;const w=cr(i.boxes,a.x,a.z,C,n.characterRadius,n.stepHeight,Number.POSITIVE_INFINITY);w>Number.NEGATIVE_INFINITY&&a.y<=w&&r.y<=0?(a.y=w,r.y=0,s.grounded||ps(i,"landed",w),s.grounded=!0):s.grounded=!1;const P=Ea(a.x-p,a.z-x);s.distance+=P;const b=Ea(r.x,r.z),S=Math.min(n.strideSpeedCap,b/Math.max(n.moveSpeed,ci)),R=Math.max(n.strideLength*(1+S*n.strideSpeedGain),ci);s.gaitPhase=(s.gaitPhase+P/R*Wo)%Wo}function Xo(i,t,e){return i<t?t:i>e?e:i}const sd=1e-6,$o=2.399963229728653;function Yo(i,t,e){return i<t?t:i>e?e:i}function Zo(i,t,e,n,s,a,r,o,c){const l=t.x-i.x,d=t.z-i.z,u=Math.hypot(l,d),f=e+n;if(u>=f)return;let h,g,_;u<sd?(h=o,g=c,_=f):(h=l/u,g=d/u,_=f-u);const m=_+r;i.x-=h*m*s,i.z-=g*m*s,t.x+=h*m*a,t.z+=g*m*a}function ad(i){const t=i.config.separation,e=i.dummies,n=i.character.position,s=i.config.characterRadius,a=i.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let d=0;d<r;d++){for(let u=0;u<e.length;u++)for(let f=u+1;f<e.length;f++){const h=(u*3+f)*$o;Zo(e[u].position,e[f].position,a,a,.5,.5,o,Math.cos(h),Math.sin(h))}for(let u=0;u<e.length;u++){const f=(u+1)*$o;Zo(n,e[u].position,s,a,0,1,o,Math.cos(f),Math.sin(f))}}const c=i.config.stepHeight,l=i.config.worldBounds;for(const d of e)po(i.boxes,d.position,a,i.config.dummies.height,c),d.position.x=Yo(d.position.x,l.minX,l.maxX),d.position.z=Yo(d.position.z,l.minZ,l.maxZ)}const qo=1e-6,rd=Math.PI/180;function od(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function cd(i,t,e){return i<t?t:i>e?e:i}function ld(i,t,e){const n=i.config.targeting,s=i.targeting,a=i.character.position;let r=i.character.facing;Math.hypot(e.moveX,e.moveZ)>qo&&(r=Math.atan2(e.moveX,e.moveZ));const c=cd(n.maxAngleDeg,0,180)*rd;let l=Number.POSITIVE_INFINITY,d=0,u=0,f=0;for(const h of i.dummies){const g=h.position.x-a.x,_=h.position.z-a.z,m=Math.hypot(g,_);if(m<qo||m>n.range)continue;const p=Math.atan2(g,_),x=Math.abs(ti(p-r));if(x>c)continue;const y=m-n.frontBias*Math.cos(x);y<l&&(l=y,d=h.id,u=p,f=m)}s.targetId=d,s.targetYaw=u,s.targetDist=f,s.hasTarget=d>0}function hd(i,t){return{tick:0,time:0,rngState:2654435769,config:i,boxes:Eh(t),gridMeta:t.grid,character:{position:{x:i.spawn.x,y:i.spawn.y,z:i.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,distance:0,coyoteTime:i.coyoteTime,jumpBuffer:0},combat:Uh(1),playerLink:fa(),abilities:mh(),impulse:{x:0,z:0},targeting:od(),playerHurt:dl(),hitCount:0,dash:{...Bh(),fromX:i.spawn.x,fromZ:i.spawn.z,toX:i.spawn.x,toZ:i.spawn.z},camera:{...ul(),centroidX:i.spawn.x,centroidZ:i.spawn.z},dummies:Yh(i.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,dummies:!0}}}function dd(i){nd(i),qh(i),Rh(i);const t=i.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=i.playerHurt;e.type="none",e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,i.hitCount=0,gh(i),Hh(i),fl(i),i.events.length=0}function jo(i,t,e){if(i.events.length=0,i.tick+=1,i.time+=t,i.impulse.x=0,i.impulse.z=0,e.resetPressed){dd(i);const n=i.config.spawn;return i.events.push({type:"reset",tick:i.tick,x:n.x,y:n.y,z:n.z,value:0}),i}return i.modules.dummies&&i.modules.targeting?ld(i,t,e):(i.targeting.targetId=0,i.targeting.targetYaw=0,i.targeting.targetDist=0,i.targeting.hasTarget=!1),Ih(i,t,e),i.modules.combat&&Oh(i,t,e),i.modules.dash&&Gh(i,t,e),i.modules.movement&&id(i,t,e),i.modules.orientation&&Ah(i,t,e),i.modules.dummies&&ed(i,t,e),hh(i,t),Ch(i,t),i.modules.abilities&&Sh(i,t,e),i.modules.dummies&&(ph(i,t),i.modules.separation&&ad(i)),i.modules.camera?bh(i):fl(i),i}function ud(i){let t=0;return{frame(e,n,s,a){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const r=i.config.fixedDt,o=i.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<o;){const l=c===0?n:{...n,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};jo(i,r,l),t-=r,c++}return c>=o&&(t=0),c},singleStep(e){jo(i,i.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const xl={slopPx:12,longPressMs:450,doubleTapMs:280};function fd(i,t,e=xl.slopPx){if(i.distance<e)return{...i,worldX:0,worldZ:0};const n=i.dx/i.distance,s=i.dy/i.distance,a=t.rightX*n+t.forwardX*-s,r=t.rightZ*n+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...i,worldX:0,worldZ:0}:{...i,worldX:a/o,worldZ:r/o}}function On(i,t,e,n,s,a){const r=Math.hypot(e,n);return{button:i,kind:t,dx:e,dy:n,distance:r,angleDeg:r>.001?Math.atan2(n,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function pd(i=xl){const t=new Map,e=new Map,n=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),On(s,"press",0,0,0,1)},move(s,a,r,o){const c=n(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,d=r-c.startY;return!c.dragging&&Math.hypot(l,d)>=i.slopPx?(c.dragging=!0,On(c.button,"drag",l,d,o-c.startedAt,1)):null},end(s,a,r,o){const c=n(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,d=r-c.startY,u=o-c.startedAt,f=Math.hypot(l,d);if(c.dragging||c.longFired||f>=i.slopPx)return On(c.button,"release",l,d,u,1);const h=e.get(c.button);return h!==void 0&&o-h.at<=i.doubleTapMs&&Math.hypot(a-h.x,r-h.y)<=i.slopPx*2?(e.delete(c.button),On(c.button,"doubleTap",l,d,u,2)):(e.set(c.button,{at:o,x:a,y:r}),On(c.button,"tap",l,d,u,1))},cancel(s,a){const r=n(s);return r?(t.delete(s),On(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=i.longPressMs)return a.longFired=!0,On(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const Ko=.001;function xr(i,t,e){return i<t?t:i>e?e:i}function vr(){return{active:!1,lastDist:0}}function md(i){const t=i.length;if(t<2)return null;const e=i[t-2],n=i[t-1];return e.id===n.id?null:[e,n]}function gd(i,t,e,n){const s=md(t);if(!s)return{state:vr(),scale:1,started:!1,ended:i.active,pinching:!1};const a=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=Math.max(1.0001,Number.isFinite(n)?n:1.25),o=1/r,c=r;if(!Number.isFinite(a)||a<Ko)return{state:{active:!0,lastDist:0},scale:1,started:!i.active,ended:!1,pinching:!0};if(!i.active||i.lastDist<Ko)return{state:{active:!0,lastDist:a},scale:1,started:!i.active,ended:!1,pinching:!0};const l=a/i.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(l)&&l>0?Math.pow(l,d):1;return{state:{active:!0,lastDist:a},scale:xr(Number.isFinite(u)?u:1,o,c),started:!1,ended:!1,pinching:!0}}function _d(i,t,e,n){const s=Math.min(e,n),a=Math.max(e,n),r=Number.isFinite(t)&&t>0?t:1,o=i*r;return Number.isFinite(o)?xr(o,s,a):xr(i,s,a)}function xd(i,t){const e=Number.isFinite(t)&&t>0?t:1,n=Number.isFinite(i)?i:0;return Math.pow(e,n/100)}const Aa=["jump","sprint","reset","attack","skill2"],vd=8,ms=12,Jo=140,Md=16,yd=400,Sd=1.0001;function gs(i){return i instanceof Element&&i.closest("[data-ui-button], [data-ui-region], #debug-panel, #hud, #weapon-bar, #hint")!==null}function bd(i){const{maxRadiusPx:t,deadZone:e,getBasis:n,zoom:s}=i,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,d=0,u=null,f=0,h=0,g=!1,_=null,m=null,p=0,x=0,y=0,M=0,L=-1;const C=pd({slopPx:ms,longPressMs:450,doubleTapMs:350});let w=[],P=null;const b=new Set;function S(T){T&&w.push(T)}const R=new Map;let W=vr(),H=!1,X=1;function G(){const T=Array.from(R.values()),gt=s(),tt=gd(W,T,gt.pinchGain,gt.maxStepRatio);if(W=tt.state,H=tt.pinching,tt.scale!==1&&(X*=tt.scale),tt.started)r=null,l=0,d=0,u=null,g=!0,_=null;else if(tt.ended)if(T.length===1){const xt=T[0];r=xt.id,o=xt.x,c=xt.y,l=0,d=0,u=null,g=!0,_=null}else r=null,l=0,d=0,u=null}const V={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},$={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let Y=0,at=0;const ot={},ut=new Set,At=[];function bt(){for(const T of Aa)ot[T]!==void 0&&(ot[T]=void 0),dt(T);C.reset(),b.clear(),R.clear(),W=vr(),H=!1,r=null,l=0,d=0,u=null,g=!1,_=null,m=null,L=-1,y=0,M=0}const j=()=>{document.hidden&&bt()},it=T=>{if(gs(T.target)){b.add(T.pointerId);return}b.delete(T.pointerId),R.set(T.pointerId,{id:T.pointerId,x:T.clientX,y:T.clientY}),r===null&&!H&&(r=T.pointerId,o=T.clientX,c=T.clientY,l=0,d=0,u=T.pointerId,f=T.clientX,h=T.clientY,g=!1),G()},ft=T=>{if(T.pointerId===m&&(T.pointerType==="mouse"&&T.buttons===0||T.clientX===0&&T.clientY===0&&(p!==0||x!==0)||(y=T.clientX-p,M=T.clientY-x)),S(C.move(T.pointerId,T.clientX,T.clientY,performance.now())),!b.has(T.pointerId)&&R.has(T.pointerId)&&(R.set(T.pointerId,{id:T.pointerId,x:T.clientX,y:T.clientY}),G()),b.has(T.pointerId)||T.pointerId!==r)return;T.pointerId===u&&Math.hypot(T.clientX-f,T.clientY-h)>vd&&(g=!0);let gt=T.clientX-o,tt=T.clientY-c;const xt=Math.hypot(gt,tt),B=a();xt>B&&(gt*=B/xt,tt*=B/xt),l=gt,d=tt};function dt(T){if(!V[T])return;V[T]=!1,T==="attack"&&($.attackReleased=!0);const gt=document.getElementById(`btn-${T}`);gt==null||gt.classList.remove("is-down")}const pt=T=>{const gt=R.delete(T.pointerId),tt=b.delete(T.pointerId);gt&&G(),T.pointerId===m&&(m=null,L=performance.now()),S(C.end(T.pointerId,T.clientX,T.clientY,performance.now()));for(const xt of Aa)ot[xt]===T.pointerId&&(ot[xt]=void 0,dt(xt));tt||(T.pointerId===u&&(!g&&!gs(T.target)&&(_={x:T.clientX,y:T.clientY}),u=null),T.pointerId===r&&(r=null,l=0,d=0))};for(const T of Aa){const gt=document.getElementById(`btn-${T}`);if(!gt)continue;const tt=T==="attack"||T==="skill2",xt=Q=>{if(Q.preventDefault(),ot[T]===void 0){ot[T]=Q.pointerId,V[T]=!0,T==="jump"&&($.jump=!0),T==="reset"&&($.reset=!0),T==="sprint"&&($.sprintPressed=!0),T==="attack"&&($.attackPressed=!0),T==="skill2"&&($.skill2=!0),gt.classList.add("is-down"),S(C.begin(T,Q.pointerId,Q.clientX,Q.clientY,performance.now()));try{gt.setPointerCapture(Q.pointerId)}catch{}tt&&(m=Q.pointerId,p=Q.clientX,x=Q.clientY,y=0,M=0,L=-1)}},B=Q=>{ot[T]===Q.pointerId&&(ot[T]=void 0,dt(T),S(C.end(Q.pointerId,Q.clientX,Q.clientY,performance.now())))},et=Q=>{ot[T]===Q.pointerId&&(ot[T]=void 0,dt(T),S(C.cancel(Q.pointerId,performance.now())))};gt.addEventListener("pointerdown",xt),gt.addEventListener("pointerup",B),gt.addEventListener("pointercancel",et),At.push(()=>{gt.removeEventListener("pointerdown",xt),gt.removeEventListener("pointerup",B),gt.removeEventListener("pointercancel",et)})}const Rt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const T of Rt){const gt=tt=>{tt.preventDefault(),Y=Number(T.dataset.weapon)||0};T.addEventListener("pointerdown",gt),At.push(()=>T.removeEventListener("pointerdown",gt))}const It=T=>{const gt=T.key.toLowerCase();if((gt===" "||gt.startsWith("arrow"))&&T.preventDefault(),ut.has(gt))return;ut.add(gt),gt===" "&&($.jump=!0),gt==="r"&&($.reset=!0),gt==="shift"&&($.sprintPressed=!0),gt==="j"&&($.attackPressed=!0),gt==="k"&&($.skill2=!0),gt>="1"&&gt<="5"&&(Y=Number(gt)),gt>="6"&&gt<="9"&&(at=Number(gt)-5);const tt=Math.max(Sd,s().keyStep||1.12);(gt==="="||gt==="+")&&(X*=tt),(gt==="-"||gt==="_")&&(X/=tt)},Ft=T=>{const gt=T.key.toLowerCase();ut.has(gt)&&(ut.delete(gt),gt==="j"&&($.attackReleased=!0))},wt=T=>{if(gs(T.target))return;T.preventDefault();const gt=T.deltaMode===1?T.deltaY*Md:T.deltaMode===2?T.deltaY*yd:T.deltaY;X*=xd(gt,s().wheelStep)},Yt=T=>{gs(T.target)||T.preventDefault()};return window.addEventListener("pointerdown",it),window.addEventListener("pointermove",ft),window.addEventListener("pointerup",pt),window.addEventListener("pointercancel",pt),window.addEventListener("blur",bt),document.addEventListener("visibilitychange",j),window.addEventListener("keydown",It),window.addEventListener("keyup",Ft),window.addEventListener("wheel",wt,{passive:!1}),window.addEventListener("gesturestart",Yt),{peekAim(){const T=performance.now(),gt=Math.hypot(y,M),tt=m!==null||L>=0&&T-L<Jo;if(!(tt&&gt>ms))return{active:!1,holding:tt,x:0,z:0,dx:y,dy:M};const B=n(),et=y/gt,Q=M/gt,A=B.rightX*et+B.forwardX*-Q,v=B.rightZ*et+B.forwardZ*-Q,U=Math.hypot(A,v)||1;return{active:!0,holding:tt,x:A/U,z:v/U,dx:y,dy:M}},sample(){const T=a();let gt=r!==null?Math.max(-1,Math.min(1,l/T)):0,tt=r!==null?Math.max(-1,Math.min(1,d/T)):0,xt=0,B=0;(ut.has("a")||ut.has("arrowleft"))&&(xt-=1),(ut.has("d")||ut.has("arrowright"))&&(xt+=1),(ut.has("w")||ut.has("arrowup"))&&(B-=1),(ut.has("s")||ut.has("arrowdown"))&&(B+=1),gt+=xt,tt+=B;let et=Math.hypot(gt,tt);et>1&&(gt/=et,tt/=et,et=1),et<e&&(gt=0,tt=0);const Q=n();let A=Q.rightX*gt+Q.forwardX*-tt,v=Q.rightZ*gt+Q.forwardZ*-tt;const U=Math.hypot(A,v);U>1&&(A/=U,v/=U);const K=performance.now();S(C.poll(K));const nt=Math.hypot(y,M),J=m!==null||L>=0&&K-L<Jo,st=J&&nt>ms;let ht=0,_t=0;if(st){const St=y/nt,Vt=M/nt,kt=Q.rightX*St+Q.forwardX*-Vt,Zt=Q.rightZ*St+Q.forwardZ*-Vt,I=Math.hypot(kt,Zt)||1;ht=kt/I,_t=Zt/I}!J&&m===null&&(y=0,M=0,L=-1);const Bt=_;_=null;const ct=X;X=1;const yt={moveX:A,moveZ:v,jumpPressed:$.jump,sprintHeld:V.sprint||ut.has("shift"),sprintPressed:$.sprintPressed,resetPressed:$.reset,attackPressed:$.attackPressed,attackHeld:V.attack||ut.has("j"),attackReleased:$.attackReleased,skill2Pressed:$.skill2,weaponSlot:Y,dummyClickId:at,aimX:ht,aimZ:_t,aimActive:st};$.jump=!1,$.reset=!1,$.sprintPressed=!1,$.attackPressed=!1,$.attackReleased=!1,$.skill2=!1,Y=0,at=0;const Ct=w.map(St=>fd(St,Q,ms));w=[],Ct.length>0&&(P=Ct[Ct.length-1]);const Ut=r!==null?"pointer":ut.size>0?"keyboard":"idle";return{intents:yt,stickX:gt,stickY:tt,source:Ut,tap:Bt,zoomScale:ct,gestures:Ct,lastGesture:P}},dispose(){window.removeEventListener("pointerdown",it),window.removeEventListener("pointermove",ft),window.removeEventListener("pointerup",pt),window.removeEventListener("pointercancel",pt),window.removeEventListener("blur",bt),document.removeEventListener("visibilitychange",j),window.removeEventListener("keydown",It),window.removeEventListener("keyup",Ft),window.removeEventListener("wheel",wt),window.removeEventListener("gesturestart",Yt),C.reset();for(const T of At)T()}}}const Ed={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Ad={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},Td={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:.7,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},wd={core:Ed,scene:Ad,view:Td};function xo(i){return JSON.parse(JSON.stringify(i))}const vo=wd,Rd=xo(vo.core),Cd=xo(vo.scene),Je=xo(vo.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class sn{constructor(t,e,n,s,a="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),sn.nextNameID=sn.nextNameID||0,this.$name.id=`lil-gui-name-${++sn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Pd extends sn{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Mr(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Ld={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Mr,toHexString:Mr},es={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},Dd={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=es.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return es.toHexString(s)}},Id={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=es.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return es.toHexString(s)}},Ud=[Ld,es,Dd,Id];function Nd(i){return Ud.find(t=>t.match(i))}class Fd extends sn{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Nd(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Mr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Ta extends sn{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class kd extends sn{constructor(t,e,n,s,a,r){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},n=x=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),n(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,d,u;const f=5,h=x=>{o=x.clientX,c=l=x.clientY,r=!0,d=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(r){const y=x.clientX-o,M=x.clientY-c;Math.abs(M)>f?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>f&&_()}if(!r){const y=x.clientY-l;u-=y*this._step*this._arrowKeyMultiplier(x),d+u>this._max?u=this._max-d:d+u<this._min&&(u=this._min-d),this._snapClampSetValue(d+u)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",h),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,y,M,L)=>(p-x)/(y-x)*(L-M)+M,e=p=>{const x=this.$slider.getBoundingClientRect();let y=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(y)},n=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),r=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(o=p.touches[0].clientX,c=p.touches[0].clientY,r=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",f))},u=p=>{if(r){const x=p.touches[0].clientX-o,y=p.touches[0].clientY-c;Math.abs(x)>Math.abs(y)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f))}else p.preventDefault(),e(p.touches[0].clientX)},f=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f)},h=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const y=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(h,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class zd extends sn{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Od extends sn{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Bd=`.lil-gui {
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
}`;function Hd(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Qo=!1;class ra{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Qo&&o&&(Hd(Bd),Qo=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,a){if(Object(n)===n)return new zd(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new kd(this,t,e,n,s,a);case"boolean":return new Pd(this,t,e);case"string":return new Od(this,t,e);case"function":return new Ta(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new Fd(this,t,e,n)}addFolder(t){const e=new ra({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Ta||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Ta)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Vd(i,t,e,n){const s=document.getElementById("debug-panel"),a=s?new ra({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new ra({title:"实验台 · 调试面板"}),r=a.addFolder("模拟");r.add(e,"timeScale",0,3,.05).name("时间缩放"),r.add(e,"paused").name("暂停"),r.add({step:n.singleStep},"step").name("单步 (1 tick)"),r.add({reset:n.reset},"reset").name("复位全部");const o=a.addFolder("模块");o.add(i.modules,"movement").name("movement"),o.add(i.modules,"combat").name("combat"),o.add(i.modules,"links").name("links"),o.add(i.modules,"orientation").name("orientation"),o.add(i.modules,"targeting").name("targeting"),o.add(i.modules,"hits").name("hits"),o.add(i.modules,"separation").name("separation"),o.add(i.modules,"dash").name("dash"),o.add(i.modules,"camera").name("camera"),o.add(i.modules,"dummies").name("dummies"),o.add(i.modules,"abilities").name("abilities");const c=i.config,l=a.addFolder("移动参数");l.add(c,"moveSpeed",1,10,.1).name("移动速度"),l.add(c,"sprintMultiplier",1,3,.05).name("冲刺倍率"),l.add(c,"acceleration",1,40,.5).name("加速度"),l.add(c,"friction",1,40,.5).name("摩擦"),l.add(c,"gravity",5,60,.5).name("重力"),l.add(c,"jumpSpeed",2,16,.2).name("起跳速度"),l.add(c,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),l.add(c,"characterRadius",.1,.8,.01).name("角色半径"),l.add(c,"characterHeight",.6,2.2,.05).name("角色身高"),l.add(c,"strideLength",.3,3,.05).name("基础步幅"),l.add(c,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),l.add(c,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const d=a.addFolder("程序化步态 (v8)");d.add(t.gait,"strideGain",.1,2,.05).name("摆幅随速度增益"),d.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),d.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),d.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),d.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),d.add(t.gait,"plantLock",0,1,.05).name("脚落地锁定"),d.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),d.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),d.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),d.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆");const u=a.addFolder("程序动画 (v8c/v8d)");u.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),u.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),u.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const f=t.animation.stride;u.add(f,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),u.add(f,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),u.add(f,"cycles",1,3,1).name("每段跨步周期数"),u.add(f,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),u.add(f,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),u.add(f,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),u.add(f,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),u.add(f,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),u.add(f,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),u.add(f,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),u.add(f,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),u.add(f,"heavyScale",0,1,.01).name("大剑重击收敛系数"),u.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),u.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),u.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),u.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),u.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),u.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),u.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),u.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),u.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),u.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),u.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),u.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const h=c.combat,g=a.addFolder("战斗参数"),_=g.add(i.combat,"weapon",Qn).name("当前武器");g.add(h,"comboWindow",.1,2,.05).name("连击窗口 (s)"),g.add(h,"settle",0,.8,.01).name("段间停顿 (s)"),g.add(h,"attackMoveScale",0,1,.01).name("攻击时移动比例"),g.add(h,"autoCombo").name("按住自动连击"),g.add(h.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),g.add(h.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),g.add(h.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),g.add(h.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),g.add(h.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),g.add(h.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const m=c.abilities;g.add(m.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),g.add(m.arcane,"speed",3,24,.5).name("飞弹速度"),g.add(m.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),g.add(m.ring,"radius",.5,5,.1).name("电环半径"),g.add(m.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),g.add(m.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const p=c.orientation,x=a.addFolder("朝向参数");x.add(p,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),x.add(p,"headTurnRate",.5,40,.5).name("头部转向速率"),x.add(p,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),x.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),x.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),x.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const y=a.addFolder("惯性倾斜 / 盆骨 (v8g)"),M=t.lean;y.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),y.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),y.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),y.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),y.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),y.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),y.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),y.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),y.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=a.addFolder("足部 IK (v8g)"),C=t.ik;L.add(C,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),L.add(C,"weight",0,1,.01).name("钉地权重"),L.add(C,"attackScale",0,1,.01).name("攻击时权重倍率"),L.add(C,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const w=a.addFolder("程序动画 / 武器握持");w.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),w.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),w.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),w.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const P=c.targeting,b=a.addFolder("目标辅助");b.add(P,"targetAssist").name("启用目标辅助"),b.add(P,"range",1,14,.5).name("锁定范围 (m)"),b.add(P,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),b.add(P,"frontBias",0,4,.1).name("朝向加权"),b.add(P,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),b.add(P,"maxLungeScale",1,3,.1).name("前冲最大放大");const S=c.hits,R=a.addFolder("命中 / 受击 / 击退");R.add(S,"arcDeg",10,120,5).name("命中扇区半角 (°)"),R.add(S,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),R.add(S,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),R.add(S,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),R.add(S.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),R.add(S.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),R.add(S,"dummyReach",.5,4,.1).name("假人命中距离 (m)");const W=c.separation,H=a.addFolder("角色间分离");H.add(W,"iterations",1,8,1).name("迭代次数"),H.add(W,"slop",0,.05,.002).name("额外分离量 (m)");const X=c.dash,G=a.addFolder("冲刺 / 闪避");G.add(X,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),G.add(X,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),G.add(X,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),G.add(X,"blinkDistance",1,12,.25).name("闪现距离 (m)"),G.add(X,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),G.add(X,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),G.add(X,"blinkClearVelocity").name("闪现清空速度"),G.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),G.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const V=c.camera,$=a.addFolder("智能相机");$.add(V,"radius",2,18,.5).name("威胁评估半径 (m)"),$.add(V,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),$.add(V,"saturation",.5,8,.1).name("威胁归一化饱和"),$.add(V,"pushIn",0,.5,.01).name("无威胁推进比例"),$.add(V,"maxPullback",0,1,.02).name("最大拉远比例"),$.add(V,"maxOffset",0,6,.1).name("最大构图平移 (m)"),$.add(V,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),$.add(V,"framingBias",0,1,.05).name("威胁质心平移系数"),$.add(V,"attackBoost",0,2,.05).name("挥砍中额外加权"),$.add(V.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),$.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Y=a.addFolder("输入");Y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),Y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const at=c.dummies,ot=a.addFolder("假人参数");ot.add(at,"moveSpeed",.5,8,.1).name("移动速度"),ot.add(at,"wanderRadius",.5,8,.1).name("游走半径"),ot.add(at,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),ot.add(at,"followStopDistance",.3,5,.1).name("跟随停距"),ot.add(at,"keepDistance",1,10,.1).name("保持距离"),ot.add(at,"keepDeadZone",.1,2,.05).name("保持死区"),ot.add(at,"attackRange",.5,5,.1).name("攻击距离"),ot.add(at,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const ut=a.addFolder("相机");ut.add(t.camera,"pitchDeg",20,80,1).name("俯角"),ut.add(t.camera,"yawDeg",-180,180,1).name("方位角"),ut.add(t.camera,"distance",6,35,.5).name("距离"),ut.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),ut.add(t.camera,"fov",25,90,1).name("FOV");const At=a.addFolder("相机缩放 (v8e)");At.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),At.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),At.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),At.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),At.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),At.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),At.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),At.add({reset:n.resetZoom},"reset").name("缩放归 1");const bt=a.addFolder("受击分层 (v8f)"),j=t.hurt;bt.add(j,"enabled").name("启用分层受击 (关=旧版对照)"),bt.add(j,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),bt.add(j,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),bt.add(j,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),bt.add(j,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),bt.add(j,"upperShiftScale",0,1,.01).name("上身位移缩放"),bt.add(j,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),bt.add(j.hitHeight,"light",0,1,.01).name("轻击命中部位"),bt.add(j.hitHeight,"heavy",0,1,.01).name("重击命中部位"),bt.add(j.hitHeight,"knock",0,1,.01).name("击退命中部位"),bt.add(j,"leanLight",0,1.5,.01).name("轻击力度"),bt.add(j,"leanHeavy",0,1.5,.01).name("重击力度"),bt.add(j,"leanKnock",0,1.5,.01).name("击退力度"),bt.add(j,"flashStrength",0,2,.05).name("受击闪光强度");const it=[{name:"打腹 (abdomen)",p:j.abdomen},{name:"打肩 (shoulder)",p:j.shoulder}].map(({name:It,p:Ft})=>{const wt=bt.addFolder(It);return wt.add(Ft,"upperPitch",0,2,.01).name("上身前后倾斜"),wt.add(Ft,"upperRoll",0,2,.01).name("上身侧倾"),wt.add(Ft,"upperYaw",0,1.5,.01).name("肩部扭转"),wt.add(Ft,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),wt.add(Ft,"shift",0,.8,.01).name("身体反应位移"),wt.add(Ft,"drop",0,.4,.01).name("整体下沉"),wt.add(Ft,"back",0,.4,.01).name("屁股向后"),wt.add(Ft,"knee",0,1.6,.01).name("屈膝"),wt.add(Ft,"hip",0,1,.01).name("髋前倾"),wt.add(Ft,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),wt}),ft=a.addFolder("派生招 (v9a)"),dt=i.config.links;ft.add(dt,"enabled").name("总开关 (false=旧连击)"),ft.add(dt.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),ft.add(dt.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),ft.add(dt.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),ft.add(dt,"sharedCooldown",0,3,.05).name("共享 CD (s)"),ft.add(dt,"triggerWhileSprinting").name("长跑中可直接触发"),ft.add(dt.search,"range",1,14,.1).name("索敌距离 (m)"),ft.add(dt.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),ft.add(dt.search,"stopDistance",0,3,.05).name("停住距离 (m)");const pt=dt.moves["sword-shield"];pt&&(ft.add(pt,"enabled").name("剑盾盾击"),ft.add(pt,"distance",0,8,.1).name("冲锋极限 (m)"),ft.add(pt,"windup",0,.5,.01).name("前摇 (s)"),ft.add(pt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),ft.add(pt,"recovery",0,.8,.01).name("收势 (s)"),ft.add(pt.hit,"radius",0,4,.05).name("命中半径 (m)"),ft.add(pt.hit,"width",0,2,.05).name("扫掠半径 (m)"),ft.add(pt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),ft.add(pt.hit,"duration",0,1.5,.01).name("僵直 (s)")),ft.add(i.config.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Rt=a.addFolder("显示");return Rt.add(e,"showColliders").name("碰撞盒线框").onChange(n.onToggleColliders),Rt.add(e,"showGrid").name("地面网格").onChange(n.onToggleGrid),l.close(),u.close(),g.close(),x.close(),w.close(),y.close(),L.close(),b.close(),R.close(),H.close(),G.close(),$.close(),Y.close(),o.close(),ot.close(),ut.close(),At.close(),bt.close(),ft.close(),it.forEach(It=>It.close()),Rt.close(),a.close(),{gui:a,refreshWeapon:()=>_.updateDisplay()}}const Gd=["剑盾","双剑","大剑","法杖","弓"],Wd={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function Xd(i){return{update(t,e,n,s,a,r,o=!1){const c=t.character,l=c.position,d=c.velocity,u=t.combat,f=t.events.length>0?t.events[t.events.length-1]:null,h=wt=>wt.toFixed(2),g=wt=>(wt*180/Math.PI).toFixed(0),_=Gd[Qn.indexOf(u.weapon)]??u.weapon,m=Math.round(u.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,y=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,M=x.phase==="active"?`${x.kind}@${y.toFixed(0)}%`:`${x.kind} cd${h(x.cooldown)}`,L=s.intents.aimActive?`(${h(s.intents.aimX)},${h(s.intents.aimZ)})`:"-",C=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),w=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),P=Math.abs(C)+Math.abs(w)+1e-6,b=Math.round(Math.abs(w)/P*100),S=`strafe ${b}%${C<-.05?" back":""}`,R=t.camera,W=`threat ${(R.threat*100).toFixed(0)}%  dist×${h(R.distanceScale)}  off (${h(R.offsetX)},${h(R.offsetZ)})  pitch +${h(R.pitchDelta)}°  n=${R.threatCount}`,H=r?h(r.attackBlend):"-",X=r==null?void 0:r.attackWeights,G=X?`gw ${h(X.gaitScale)}  lw ${h(X.attackLegWeight)}  spd ${h(X.driveSpeed)}`:"-",V=X?`${h(X.gaitScale)}/${h(X.attackLegWeight)}`:"-",$=r?`${r.landing.kind} ${h(r.landing.pulse)} t${h(r.landing.remaining)} vy${h(r.landing.impactVy)}`:"-",Y=r?`${r.landing.kind}/${h(r.landing.pulse)}`:"-",at=(r==null?void 0:r.zoom)!==void 0?`zoom ×${h(r.zoom)}`:"-",ot=r==null?void 0:r.hurt,ut=ot?`hurt ${t.playerHurt.type}  部位h${h(ot.hitHeight)}  脉冲p${h(ot.pulse)}  上身${h(ot.upperShift)}  重心${h(ot.comShift)}  后坐${h(ot.pelvisBack)}  屈膝${h(ot.knee)}`:"-",At=ot?`${h(ot.hitHeight)}/${h(ot.pulse)}/${h(ot.knee)}`:"-",bt=r==null?void 0:r.ik,j=bt?`${bt.active?"on":"off"} w${h(bt.weight)} e${h(bt.maxError)}`:"-",it=t.playerLink,ft=`link ${it.kind||"-"}  ${it.phase}  prog ${h(it.progress)}  win ${h(it.linkWindow)}s  cd ${h(it.cooldown)}s  hits ${it.hitIds.length}  travel ${h(it.travelled)}/${h(it.travel)}m  id ${it.id}`,dt=`${it.phase}/${it.kind||"-"}/w${h(it.linkWindow)}`,pt=s.lastGesture,Rt=pt?`${pt.button} ${pt.kind} ${pt.heldMs.toFixed(0)}ms d${pt.distance.toFixed(0)}px ${pt.angleDeg.toFixed(0)}° taps${pt.taps}`:"-",It=t.dummies.map(wt=>`${wt.id}:${Wd[wt.mode]}`).join("  ");if(o){i.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${u.phase} · lk ${it.phase}${it.kind?`/${it.kind}`:""} w${h(it.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?i.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${n}`,`pos (${h(l.x)},${h(l.y)},${h(l.z)})  vel (${h(d.x)},${h(d.y)},${h(d.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${b}%`,`weapon ${_}  ${u.phase}  combo ${u.comboIndex}/3  atk ${h(u.attackProgress)}  dash ${M}  ab ${H}  gw/lw ${V}  land ${Y}  ik ${j}`,`aim ${L}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${h(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${At}`,`dummies ${It}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${h(R.distanceScale)}  ${at}  lk ${dt}`,`event ${f?`${f.type} ${h(f.value)}`:"-"}  scale ${h(a.timeScale)}${a.paused?" [P]":""}  g ${Rt}`].join(`
`):i.textContent=[`tick ${t.tick}   t ${h(t.time)}s   fps ${e.toFixed(0)}   steps ${n}`,`pos  (${h(l.x)}, ${h(l.y)}, ${h(l.z)})`,`vel  (${h(d.x)}, ${h(d.y)}, ${h(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${H}   ${G}   land ${$}`,ut,`ik ${j}  clamped ${bt?bt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${S}`,`move (${h(s.intents.moveX)}, ${h(s.intents.moveZ)})  stick (${h(s.stickX)}, ${h(s.stickY)})  ${s.source}  aim ${L}`,`weapon ${_}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${h(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${y.toFixed(0)}%  cd ${h(x.cooldown)}s  id ${x.id}  from (${h(x.fromX)},${h(x.fromZ)}) → to (${h(x.toX)},${h(x.toZ)})`,ft,`camera ${W}  ${at}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${h(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${It}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${h(t.impulse.x)}, ${h(t.impulse.z)})`,`event ${f?`${f.type} ${h(f.value)}`:"-"}   scale ${h(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${Rt}`].join(`
`)}}}const $d=8e3;function Yd(i,t){const e=document.getElementById("hud-toggle"),n=document.getElementById("hint-toggle");let s=!1,a=!1,r=0;function o(){i.classList.toggle("is-compact",!s),e==null||e.setAttribute("aria-expanded",String(s)),e&&(e.textContent=s?"状态 ▾":"状态 ▸",e.setAttribute("aria-label",s?"收起状态读数":"展开状态读数")),t&&(t.hidden=!a),n==null||n.setAttribute("aria-expanded",String(a)),n&&(n.textContent=a?"操作说明 ▾":"操作说明 ▸",n.setAttribute("aria-label",a?"收起操作说明":"展开操作说明"))}function c(){a&&(a=!1,window.clearTimeout(r),r=0,o())}function l(){s&&(s=!1,o())}function d(h){h.preventDefault(),h.stopPropagation(),s=!s,o()}function u(h){h.preventDefault(),h.stopPropagation(),a=!a,window.clearTimeout(r),r=0,a&&(r=window.setTimeout(c,$d)),o()}e==null||e.addEventListener("pointerdown",d),n==null||n.addEventListener("pointerdown",u);function f(h){const g=h.target;g instanceof Element&&g.closest("#fold-row, #hint")||(c(),l())}return window.addEventListener("pointerdown",f,{capture:!0,passive:!0}),o(),{hudCompact:()=>!s}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Mo="170",Zd=0,tc=1,qd=2,vl=1,Ml=2,gn=3,Nn=0,Pe=1,Te=2,Dn=0,Ci=1,ec=2,nc=3,ic=4,jd=5,qn=100,Kd=101,Jd=102,Qd=103,tu=104,eu=200,nu=201,iu=202,su=203,yr=204,Sr=205,au=206,ru=207,ou=208,cu=209,lu=210,hu=211,du=212,uu=213,fu=214,br=0,Er=1,Ar=2,Di=3,Tr=4,wr=5,Rr=6,Cr=7,yo=0,pu=1,mu=2,In=0,gu=1,_u=2,xu=3,vu=4,Mu=5,yu=6,Su=7,yl=300,Ii=301,Ui=302,Pr=303,Lr=304,pa=306,Dr=1e3,Kn=1001,Ir=1002,Ze=1003,bu=1004,_s=1005,nn=1006,wa=1007,Jn=1008,yn=1009,Sl=1010,bl=1011,ns=1012,So=1013,ei=1014,xn=1015,ss=1016,bo=1017,Eo=1018,Ni=1020,El=35902,Al=1021,Tl=1022,Ye=1023,wl=1024,Rl=1025,Pi=1026,Fi=1027,Cl=1028,Ao=1029,Pl=1030,To=1031,wo=1033,qs=33776,js=33777,Ks=33778,Js=33779,Ur=35840,Nr=35841,Fr=35842,kr=35843,zr=36196,Or=37492,Br=37496,Hr=37808,Vr=37809,Gr=37810,Wr=37811,Xr=37812,$r=37813,Yr=37814,Zr=37815,qr=37816,jr=37817,Kr=37818,Jr=37819,Qr=37820,to=37821,Qs=36492,eo=36494,no=36495,Ll=36283,io=36284,so=36285,ao=36286,Eu=3200,Au=3201,Dl=0,Tu=1,Pn="",Oe="srgb",zi="srgb-linear",ma="linear",ne="srgb",li=7680,sc=519,wu=512,Ru=513,Cu=514,Il=515,Pu=516,Lu=517,Du=518,Iu=519,ro=35044,ac="300 es",vn=2e3,oa=2001;class Oi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ta=Math.PI/180,oo=180/Math.PI;function Un(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ye[i&255]+ye[i>>8&255]+ye[i>>16&255]+ye[i>>24&255]+"-"+ye[t&255]+ye[t>>8&255]+"-"+ye[t>>16&15|64]+ye[t>>24&255]+"-"+ye[e&63|128]+ye[e>>8&255]+"-"+ye[e>>16&255]+ye[e>>24&255]+ye[n&255]+ye[n>>8&255]+ye[n>>16&255]+ye[n>>24&255]).toLowerCase()}function Ce(i,t,e){return Math.max(t,Math.min(e,i))}function Uu(i,t){return(i%t+t)%t}function Ra(i,t,e){return(1-e)*i+e*t}function en(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ie(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Ht{constructor(t=0,e=0){Ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*s+t.x,this.y=a*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gt{constructor(t,e,n,s,a,r,o,c,l){Gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l)}set(t,e,n,s,a,r,o,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=a,d[5]=c,d[6]=n,d[7]=r,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],f=n[2],h=n[5],g=n[8],_=s[0],m=s[3],p=s[6],x=s[1],y=s[4],M=s[7],L=s[2],C=s[5],w=s[8];return a[0]=r*_+o*x+c*L,a[3]=r*m+o*y+c*C,a[6]=r*p+o*M+c*w,a[1]=l*_+d*x+u*L,a[4]=l*m+d*y+u*C,a[7]=l*p+d*M+u*w,a[2]=f*_+h*x+g*L,a[5]=f*m+h*y+g*C,a[8]=f*p+h*M+g*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*r*d-e*o*l-n*a*d+n*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=d*r-o*l,f=o*c-d*a,h=l*a-r*c,g=e*u+n*f+s*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-d*n)*_,t[2]=(o*n-s*r)*_,t[3]=f*_,t[4]=(d*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=h*_,t[7]=(n*c-l*e)*_,t[8]=(r*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ca.makeScale(t,e)),this}rotate(t){return this.premultiply(Ca.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ca.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ca=new Gt;function Ul(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ca(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Nu(){const i=ca("canvas");return i.style.display="block",i}const rc={};function Ki(i){i in rc||(rc[i]=!0,console.warn(i))}function Fu(i,t,e){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}function ku(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function zu(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const jt={enabled:!0,workingColorSpace:zi,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ne&&(i.r=Mn(i.r),i.g=Mn(i.g),i.b=Mn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ne&&(i.r=Li(i.r),i.g=Li(i.g),i.b=Li(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Pn?ma:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Mn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Li(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const oc=[.64,.33,.3,.6,.15,.06],cc=[.2126,.7152,.0722],lc=[.3127,.329],hc=new Gt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),dc=new Gt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);jt.define({[zi]:{primaries:oc,whitePoint:lc,transfer:ma,toXYZ:hc,fromXYZ:dc,luminanceCoefficients:cc,workingColorSpaceConfig:{unpackColorSpace:Oe},outputColorSpaceConfig:{drawingBufferColorSpace:Oe}},[Oe]:{primaries:oc,whitePoint:lc,transfer:ne,toXYZ:hc,fromXYZ:dc,luminanceCoefficients:cc,outputColorSpaceConfig:{drawingBufferColorSpace:Oe}}});let hi;class Ou{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{hi===void 0&&(hi=ca("canvas")),hi.width=t.width,hi.height=t.height;const n=hi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=hi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ca("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Mn(a[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Mn(e[n]/255)*255):e[n]=Mn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Bu=0;class Nl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Bu++}),this.uuid=Un(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Pa(s[r].image)):a.push(Pa(s[r]))}else a=Pa(s);n.url=a}return e||(t.images[this.uuid]=n),n}}function Pa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ou.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Hu=0;class Re extends Oi{constructor(t=Re.DEFAULT_IMAGE,e=Re.DEFAULT_MAPPING,n=Kn,s=Kn,a=nn,r=Jn,o=Ye,c=yn,l=Re.DEFAULT_ANISOTROPY,d=Pn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hu++}),this.uuid=Un(),this.name="",this.source=new Nl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ht(0,0),this.repeat=new Ht(1,1),this.center=new Ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==yl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Dr:t.x=t.x-Math.floor(t.x);break;case Kn:t.x=t.x<0?0:1;break;case Ir:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Dr:t.y=t.y-Math.floor(t.y);break;case Kn:t.y=t.y<0?0:1;break;case Ir:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Re.DEFAULT_IMAGE=null;Re.DEFAULT_MAPPING=yl;Re.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a;const c=t.elements,l=c[0],d=c[4],u=c[8],f=c[1],h=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(d-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+h+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,M=(h+1)/2,L=(p+1)/2,C=(d+f)/4,w=(u+_)/4,P=(g+m)/4;return y>M&&y>L?y<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(y),s=C/n,a=w/n):M>L?M<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(M),n=C/s,a=P/s):L<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(L),n=w/a,s=P/a),this.set(n,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-d)*(f-d));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-_)/x,this.z=(f-d)/x,this.w=Math.acos((l+h+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Vu extends Oi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new Re(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Nl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ni extends Vu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Fl extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Gu extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class as{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,r,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3];const f=a[r+0],h=a[r+1],g=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=h,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==f||l!==h||d!==g){let m=1-o;const p=c*f+l*h+d*g+u*_,x=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const L=Math.sqrt(y),C=Math.atan2(L,p*x);m=Math.sin(m*C)/L,o=Math.sin(o*C)/L}const M=o*x;if(c=c*m+f*M,l=l*m+h*M,d=d*m+g*M,u=u*m+_*M,m===1-o){const L=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=L,l*=L,d*=L,u*=L}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,a,r){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=a[r],f=a[r+1],h=a[r+2],g=a[r+3];return t[e]=o*g+d*u+c*h-l*f,t[e+1]=c*g+d*f+l*u-o*h,t[e+2]=l*g+d*h+o*f-c*u,t[e+3]=d*g-o*u-c*f-l*h,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(a/2),f=c(n/2),h=c(s/2),g=c(a/2);switch(r){case"XYZ":this._x=f*d*u+l*h*g,this._y=l*h*u-f*d*g,this._z=l*d*g+f*h*u,this._w=l*d*u-f*h*g;break;case"YXZ":this._x=f*d*u+l*h*g,this._y=l*h*u-f*d*g,this._z=l*d*g-f*h*u,this._w=l*d*u+f*h*g;break;case"ZXY":this._x=f*d*u-l*h*g,this._y=l*h*u+f*d*g,this._z=l*d*g+f*h*u,this._w=l*d*u-f*h*g;break;case"ZYX":this._x=f*d*u-l*h*g,this._y=l*h*u+f*d*g,this._z=l*d*g-f*h*u,this._w=l*d*u+f*h*g;break;case"YZX":this._x=f*d*u+l*h*g,this._y=l*h*u+f*d*g,this._z=l*d*g-f*h*u,this._w=l*d*u-f*h*g;break;case"XZY":this._x=f*d*u-l*h*g,this._y=l*h*u-f*d*g,this._z=l*d*g+f*h*u,this._w=l*d*u+f*h*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],d=e[6],u=e[10],f=n+o+u;if(f>0){const h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(d-c)*h,this._y=(a-l)*h,this._z=(r-s)*h}else if(n>o&&n>u){const h=2*Math.sqrt(1+n-o-u);this._w=(d-c)/h,this._x=.25*h,this._y=(s+r)/h,this._z=(a+l)/h}else if(o>u){const h=2*Math.sqrt(1+o-n-u);this._w=(a-l)/h,this._x=(s+r)/h,this._y=.25*h,this._z=(c+d)/h}else{const h=2*Math.sqrt(1+u-n-o);this._w=(r-s)/h,this._x=(a+l)/h,this._y=(c+d)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ce(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+r*o+s*l-a*c,this._y=s*d+r*c+a*o-n*l,this._z=a*d+r*l+n*c-s*o,this._w=r*d-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const h=1-e;return this._w=h*r+e*this._w,this._x=h*n+e*this._x,this._y=h*s+e*this._y,this._z=h*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,o),u=Math.sin((1-e)*d)/l,f=Math.sin(e*d)/l;return this._w=r*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=a*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(t=0,e=0,n=0){O.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(uc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(uc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*n),d=2*(o*e-a*s),u=2*(a*n-r*e);return this.x=e+c*l+r*u-o*d,this.y=n+c*d+o*l-a*u,this.z=s+c*u+a*d-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return La.copy(this).projectOnVector(t),this.sub(La)}reflect(t){return this.sub(La.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const La=new O,uc=new as;class rs{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(We.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(We.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=We.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,We):We.fromBufferAttribute(a,r),We.applyMatrix4(t.matrixWorld),this.expandByPoint(We);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xs.copy(n.boundingBox)),xs.applyMatrix4(t.matrixWorld),this.union(xs)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,We),We.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Gi),vs.subVectors(this.max,Gi),di.subVectors(t.a,Gi),ui.subVectors(t.b,Gi),fi.subVectors(t.c,Gi),En.subVectors(ui,di),An.subVectors(fi,ui),Bn.subVectors(di,fi);let e=[0,-En.z,En.y,0,-An.z,An.y,0,-Bn.z,Bn.y,En.z,0,-En.x,An.z,0,-An.x,Bn.z,0,-Bn.x,-En.y,En.x,0,-An.y,An.x,0,-Bn.y,Bn.x,0];return!Da(e,di,ui,fi,vs)||(e=[1,0,0,0,1,0,0,0,1],!Da(e,di,ui,fi,vs))?!1:(Ms.crossVectors(En,An),e=[Ms.x,Ms.y,Ms.z],Da(e,di,ui,fi,vs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,We).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(We).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const hn=[new O,new O,new O,new O,new O,new O,new O,new O],We=new O,xs=new rs,di=new O,ui=new O,fi=new O,En=new O,An=new O,Bn=new O,Gi=new O,vs=new O,Ms=new O,Hn=new O;function Da(i,t,e,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){Hn.fromArray(i,a);const o=s.x*Math.abs(Hn.x)+s.y*Math.abs(Hn.y)+s.z*Math.abs(Hn.z),c=t.dot(Hn),l=e.dot(Hn),d=n.dot(Hn);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const Wu=new rs,Wi=new O,Ia=new O;class ga{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Wu.setFromPoints(t).getCenter(n);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Wi.subVectors(t,this.center);const e=Wi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Wi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ia.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Wi.copy(t.center).add(Ia)),this.expandByPoint(Wi.copy(t.center).sub(Ia))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const dn=new O,Ua=new O,ys=new O,Tn=new O,Na=new O,Ss=new O,Fa=new O;class Ro{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(dn.copy(this.origin).addScaledVector(this.direction,e),dn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ua.copy(t).add(e).multiplyScalar(.5),ys.copy(e).sub(t).normalize(),Tn.copy(this.origin).sub(Ua);const a=t.distanceTo(e)*.5,r=-this.direction.dot(ys),o=Tn.dot(this.direction),c=-Tn.dot(ys),l=Tn.lengthSq(),d=Math.abs(1-r*r);let u,f,h,g;if(d>0)if(u=r*c-o,f=r*o-c,g=a*d,u>=0)if(f>=-g)if(f<=g){const _=1/d;u*=_,f*=_,h=u*(u+r*f+2*o)+f*(r*u+f+2*c)+l}else f=a,u=Math.max(0,-(r*f+o)),h=-u*u+f*(f+2*c)+l;else f=-a,u=Math.max(0,-(r*f+o)),h=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-r*a+o)),f=u>0?-a:Math.min(Math.max(-a,-c),a),h=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-a,-c),a),h=f*(f+2*c)+l):(u=Math.max(0,-(r*a+o)),f=u>0?a:Math.min(Math.max(-a,-c),a),h=-u*u+f*(f+2*c)+l);else f=r>0?-a:a,u=Math.max(0,-(r*f+o)),h=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ua).addScaledVector(ys,f),h}intersectSphere(t,e){dn.subVectors(t.center,this.origin);const n=dn.dot(this.direction),s=dn.dot(dn)-n*n,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,r,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),d>=0?(a=(t.min.y-f.y)*d,r=(t.max.y-f.y)*d):(a=(t.max.y-f.y)*d,r=(t.min.y-f.y)*d),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,dn)!==null}intersectTriangle(t,e,n,s,a){Na.subVectors(e,t),Ss.subVectors(n,t),Fa.crossVectors(Na,Ss);let r=this.direction.dot(Fa),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Tn.subVectors(this.origin,t);const c=o*this.direction.dot(Ss.crossVectors(Tn,Ss));if(c<0)return null;const l=o*this.direction.dot(Na.cross(Tn));if(l<0||c+l>r)return null;const d=-o*Tn.dot(Fa);return d<0?null:this.at(d/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,s,a,r,o,c,l,d,u,f,h,g,_,m){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l,d,u,f,h,g,_,m)}set(t,e,n,s,a,r,o,c,l,d,u,f,h,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=c,p[2]=l,p[6]=d,p[10]=u,p[14]=f,p[3]=h,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/pi.setFromMatrixColumn(t,0).length(),a=1/pi.setFromMatrixColumn(t,1).length(),r=1/pi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(a),u=Math.sin(a);if(t.order==="XYZ"){const f=r*d,h=r*u,g=o*d,_=o*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=h+g*l,e[5]=f-_*l,e[9]=-o*c,e[2]=_-f*l,e[6]=g+h*l,e[10]=r*c}else if(t.order==="YXZ"){const f=c*d,h=c*u,g=l*d,_=l*u;e[0]=f+_*o,e[4]=g*o-h,e[8]=r*l,e[1]=r*u,e[5]=r*d,e[9]=-o,e[2]=h*o-g,e[6]=_+f*o,e[10]=r*c}else if(t.order==="ZXY"){const f=c*d,h=c*u,g=l*d,_=l*u;e[0]=f-_*o,e[4]=-r*u,e[8]=g+h*o,e[1]=h+g*o,e[5]=r*d,e[9]=_-f*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const f=r*d,h=r*u,g=o*d,_=o*u;e[0]=c*d,e[4]=g*l-h,e[8]=f*l+_,e[1]=c*u,e[5]=_*l+f,e[9]=h*l-g,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const f=r*c,h=r*l,g=o*c,_=o*l;e[0]=c*d,e[4]=_-f*u,e[8]=g*u+h,e[1]=u,e[5]=r*d,e[9]=-o*d,e[2]=-l*d,e[6]=h*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=r*c,h=r*l,g=o*c,_=o*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=f*u+_,e[5]=r*d,e[9]=h*u-g,e[2]=g*u-h,e[6]=o*d,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Xu,t,$u)}lookAt(t,e,n){const s=this.elements;return Ne.subVectors(t,e),Ne.lengthSq()===0&&(Ne.z=1),Ne.normalize(),wn.crossVectors(n,Ne),wn.lengthSq()===0&&(Math.abs(n.z)===1?Ne.x+=1e-4:Ne.z+=1e-4,Ne.normalize(),wn.crossVectors(n,Ne)),wn.normalize(),bs.crossVectors(Ne,wn),s[0]=wn.x,s[4]=bs.x,s[8]=Ne.x,s[1]=wn.y,s[5]=bs.y,s[9]=Ne.y,s[2]=wn.z,s[6]=bs.z,s[10]=Ne.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],f=n[9],h=n[13],g=n[2],_=n[6],m=n[10],p=n[14],x=n[3],y=n[7],M=n[11],L=n[15],C=s[0],w=s[4],P=s[8],b=s[12],S=s[1],R=s[5],W=s[9],H=s[13],X=s[2],G=s[6],V=s[10],$=s[14],Y=s[3],at=s[7],ot=s[11],ut=s[15];return a[0]=r*C+o*S+c*X+l*Y,a[4]=r*w+o*R+c*G+l*at,a[8]=r*P+o*W+c*V+l*ot,a[12]=r*b+o*H+c*$+l*ut,a[1]=d*C+u*S+f*X+h*Y,a[5]=d*w+u*R+f*G+h*at,a[9]=d*P+u*W+f*V+h*ot,a[13]=d*b+u*H+f*$+h*ut,a[2]=g*C+_*S+m*X+p*Y,a[6]=g*w+_*R+m*G+p*at,a[10]=g*P+_*W+m*V+p*ot,a[14]=g*b+_*H+m*$+p*ut,a[3]=x*C+y*S+M*X+L*Y,a[7]=x*w+y*R+M*G+L*at,a[11]=x*P+y*W+M*V+L*ot,a[15]=x*b+y*H+M*$+L*ut,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],d=t[2],u=t[6],f=t[10],h=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+a*c*u-s*l*u-a*o*f+n*l*f+s*o*h-n*c*h)+_*(+e*c*h-e*l*f+a*r*f-s*r*h+s*l*d-a*c*d)+m*(+e*l*u-e*o*h-a*r*u+n*r*h+a*o*d-n*l*d)+p*(-s*o*d-e*c*u+e*o*f+s*r*u-n*r*f+n*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=t[9],f=t[10],h=t[11],g=t[12],_=t[13],m=t[14],p=t[15],x=u*m*l-_*f*l+_*c*h-o*m*h-u*c*p+o*f*p,y=g*f*l-d*m*l-g*c*h+r*m*h+d*c*p-r*f*p,M=d*_*l-g*u*l+g*o*h-r*_*h-d*o*p+r*u*p,L=g*u*c-d*_*c-g*o*f+r*_*f+d*o*m-r*u*m,C=e*x+n*y+s*M+a*L;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/C;return t[0]=x*w,t[1]=(_*f*a-u*m*a-_*s*h+n*m*h+u*s*p-n*f*p)*w,t[2]=(o*m*a-_*c*a+_*s*l-n*m*l-o*s*p+n*c*p)*w,t[3]=(u*c*a-o*f*a-u*s*l+n*f*l+o*s*h-n*c*h)*w,t[4]=y*w,t[5]=(d*m*a-g*f*a+g*s*h-e*m*h-d*s*p+e*f*p)*w,t[6]=(g*c*a-r*m*a-g*s*l+e*m*l+r*s*p-e*c*p)*w,t[7]=(r*f*a-d*c*a+d*s*l-e*f*l-r*s*h+e*c*h)*w,t[8]=M*w,t[9]=(g*u*a-d*_*a-g*n*h+e*_*h+d*n*p-e*u*p)*w,t[10]=(r*_*a-g*o*a+g*n*l-e*_*l-r*n*p+e*o*p)*w,t[11]=(d*o*a-r*u*a-d*n*l+e*u*l+r*n*h-e*o*h)*w,t[12]=L*w,t[13]=(d*_*s-g*u*s+g*n*f-e*_*f-d*n*m+e*u*m)*w,t[14]=(g*o*s-r*_*s-g*n*c+e*_*c+r*n*m-e*o*m)*w,t[15]=(r*u*s-d*o*s+d*n*c-e*u*c-r*n*f+e*o*f)*w,this}scale(t){const e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),a=1-n,r=t.x,o=t.y,c=t.z,l=a*r,d=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*r,0,l*c-s*o,d*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,r){return this.set(1,n,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,d=r+r,u=o+o,f=a*l,h=a*d,g=a*u,_=r*d,m=r*u,p=o*u,x=c*l,y=c*d,M=c*u,L=n.x,C=n.y,w=n.z;return s[0]=(1-(_+p))*L,s[1]=(h+M)*L,s[2]=(g-y)*L,s[3]=0,s[4]=(h-M)*C,s[5]=(1-(f+p))*C,s[6]=(m+x)*C,s[7]=0,s[8]=(g+y)*w,s[9]=(m-x)*w,s[10]=(1-(f+_))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let a=pi.set(s[0],s[1],s[2]).length();const r=pi.set(s[4],s[5],s[6]).length(),o=pi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],Xe.copy(this);const l=1/a,d=1/r,u=1/o;return Xe.elements[0]*=l,Xe.elements[1]*=l,Xe.elements[2]*=l,Xe.elements[4]*=d,Xe.elements[5]*=d,Xe.elements[6]*=d,Xe.elements[8]*=u,Xe.elements[9]*=u,Xe.elements[10]*=u,e.setFromRotationMatrix(Xe),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,s,a,r,o=vn){const c=this.elements,l=2*a/(e-t),d=2*a/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let h,g;if(o===vn)h=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===oa)h=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=h,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,a,r,o=vn){const c=this.elements,l=1/(e-t),d=1/(n-s),u=1/(r-a),f=(e+t)*l,h=(n+s)*d;let g,_;if(o===vn)g=(r+a)*u,_=-2*u;else if(o===oa)g=a*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-h,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const pi=new O,Xe=new oe,Xu=new O(0,0,0),$u=new O(1,1,1),wn=new O,bs=new O,Ne=new O,fc=new oe,pc=new as;class an{constructor(t=0,e=0,n=0,s=an.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],f=s[6],h=s[10];switch(e){case"XYZ":this._y=Math.asin(Ce(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,h),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ce(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ce(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,h),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Ce(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Ce(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-Ce(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,h),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return fc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(fc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return pc.setFromEuler(this),this.setFromQuaternion(pc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}an.DEFAULT_ORDER="XYZ";class Co{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Yu=0;const mc=new O,mi=new as,un=new oe,Es=new O,Xi=new O,Zu=new O,qu=new as,gc=new O(1,0,0),_c=new O(0,1,0),xc=new O(0,0,1),vc={type:"added"},ju={type:"removed"},gi={type:"childadded",child:null},ka={type:"childremoved",child:null};class he extends Oi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yu++}),this.uuid=Un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=he.DEFAULT_UP.clone();const t=new O,e=new an,n=new as,s=new O(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new oe},normalMatrix:{value:new Gt}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=he.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Co,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return mi.setFromAxisAngle(t,e),this.quaternion.multiply(mi),this}rotateOnWorldAxis(t,e){return mi.setFromAxisAngle(t,e),this.quaternion.premultiply(mi),this}rotateX(t){return this.rotateOnAxis(gc,t)}rotateY(t){return this.rotateOnAxis(_c,t)}rotateZ(t){return this.rotateOnAxis(xc,t)}translateOnAxis(t,e){return mc.copy(t).applyQuaternion(this.quaternion),this.position.add(mc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(gc,t)}translateY(t){return this.translateOnAxis(_c,t)}translateZ(t){return this.translateOnAxis(xc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(un.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Es.copy(t):Es.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Xi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?un.lookAt(Xi,Es,this.up):un.lookAt(Es,Xi,this.up),this.quaternion.setFromRotationMatrix(un),s&&(un.extractRotation(s.matrixWorld),mi.setFromRotationMatrix(un),this.quaternion.premultiply(mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(vc),gi.child=t,this.dispatchEvent(gi),gi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ju),ka.child=t,this.dispatchEvent(ka),ka.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),un.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),un.multiply(t.parent.matrixWorld)),t.applyMatrix4(un),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(vc),gi.child=t,this.dispatchEvent(gi),gi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xi,t,Zu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xi,qu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];a(t.shapes,u)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),d=r(t.images),u=r(t.shapes),f=r(t.skeletons),h=r(t.animations),g=r(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),h.length>0&&(n.animations=h),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}he.DEFAULT_UP=new O(0,1,0);he.DEFAULT_MATRIX_AUTO_UPDATE=!0;he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const $e=new O,fn=new O,za=new O,pn=new O,_i=new O,xi=new O,Mc=new O,Oa=new O,Ba=new O,Ha=new O,Va=new le,Ga=new le,Wa=new le;class ke{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),$e.subVectors(t,e),s.cross($e);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){$e.subVectors(s,e),fn.subVectors(n,e),za.subVectors(t,e);const r=$e.dot($e),o=$e.dot(fn),c=$e.dot(za),l=fn.dot(fn),d=fn.dot(za),u=r*l-o*o;if(u===0)return a.set(0,0,0),null;const f=1/u,h=(l*c-o*d)*f,g=(r*d-o*c)*f;return a.set(1-h-g,g,h)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,pn)===null?!1:pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getInterpolation(t,e,n,s,a,r,o,c){return this.getBarycoord(t,e,n,s,pn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,pn.x),c.addScaledVector(r,pn.y),c.addScaledVector(o,pn.z),c)}static getInterpolatedAttribute(t,e,n,s,a,r){return Va.setScalar(0),Ga.setScalar(0),Wa.setScalar(0),Va.fromBufferAttribute(t,e),Ga.fromBufferAttribute(t,n),Wa.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Va,a.x),r.addScaledVector(Ga,a.y),r.addScaledVector(Wa,a.z),r}static isFrontFacing(t,e,n,s){return $e.subVectors(n,e),fn.subVectors(t,e),$e.cross(fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return $e.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),$e.cross(fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ke.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ke.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,a){return ke.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return ke.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ke.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,a=this.c;let r,o;_i.subVectors(s,n),xi.subVectors(a,n),Oa.subVectors(t,n);const c=_i.dot(Oa),l=xi.dot(Oa);if(c<=0&&l<=0)return e.copy(n);Ba.subVectors(t,s);const d=_i.dot(Ba),u=xi.dot(Ba);if(d>=0&&u<=d)return e.copy(s);const f=c*u-d*l;if(f<=0&&c>=0&&d<=0)return r=c/(c-d),e.copy(n).addScaledVector(_i,r);Ha.subVectors(t,a);const h=_i.dot(Ha),g=xi.dot(Ha);if(g>=0&&h<=g)return e.copy(a);const _=h*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(xi,o);const m=d*g-h*u;if(m<=0&&u-d>=0&&h-g>=0)return Mc.subVectors(a,s),o=(u-d)/(u-d+(h-g)),e.copy(s).addScaledVector(Mc,o);const p=1/(m+_+f);return r=_*p,o=f*p,e.copy(n).addScaledVector(_i,r).addScaledVector(xi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const kl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rn={h:0,s:0,l:0},As={h:0,s:0,l:0};function Xa(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ot{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,jt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,jt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=jt.workingColorSpace){if(t=Uu(t,1),e=Ce(e,0,1),n=Ce(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=Xa(r,a,t+1/3),this.g=Xa(r,a,t),this.b=Xa(r,a,t-1/3)}return jt.toWorkingColorSpace(this,s),this}setStyle(t,e=Oe){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Oe){const n=kl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Mn(t.r),this.g=Mn(t.g),this.b=Mn(t.b),this}copyLinearToSRGB(t){return this.r=Li(t.r),this.g=Li(t.g),this.b=Li(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Oe){return jt.fromWorkingColorSpace(Se.copy(this),t),Math.round(Ce(Se.r*255,0,255))*65536+Math.round(Ce(Se.g*255,0,255))*256+Math.round(Ce(Se.b*255,0,255))}getHexString(t=Oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=jt.workingColorSpace){jt.fromWorkingColorSpace(Se.copy(this),e);const n=Se.r,s=Se.g,a=Se.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let c,l;const d=(o+r)/2;if(o===r)c=0,l=0;else{const u=r-o;switch(l=d<=.5?u/(r+o):u/(2-r-o),r){case n:c=(s-a)/u+(s<a?6:0);break;case s:c=(a-n)/u+2;break;case a:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=jt.workingColorSpace){return jt.fromWorkingColorSpace(Se.copy(this),e),t.r=Se.r,t.g=Se.g,t.b=Se.b,t}getStyle(t=Oe){jt.fromWorkingColorSpace(Se.copy(this),t);const e=Se.r,n=Se.g,s=Se.b;return t!==Oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Rn),this.setHSL(Rn.h+t,Rn.s+e,Rn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Rn),t.getHSL(As);const n=Ra(Rn.h,As.h,e),s=Ra(Rn.s,As.s,e),a=Ra(Rn.l,As.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Se=new Ot;Ot.NAMES=kl;let Ku=0;class ii extends Oi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=Un(),this.name="",this.blending=Ci,this.side=Nn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yr,this.blendDst=Sr,this.blendEquation=qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ot(0,0,0),this.blendAlpha=0,this.depthFunc=Di,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=li,this.stencilZFail=li,this.stencilZPass=li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ci&&(n.blending=this.blending),this.side!==Nn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==yr&&(n.blendSrc=this.blendSrc),this.blendDst!==Sr&&(n.blendDst=this.blendDst),this.blendEquation!==qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Di&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Qe extends ii{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new an,this.combine=yo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const me=new O,Ts=new Ht;class qe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ro,this.updateRanges=[],this.gpuType=xn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ts.fromBufferAttribute(this,e),Ts.applyMatrix3(t),this.setXY(e,Ts.x,Ts.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=en(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=en(e,this.array)),e}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=en(e,this.array)),e}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=en(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=en(e,this.array)),e}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),a=ie(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ro&&(t.usage=this.usage),t}}class zl extends qe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Ol extends qe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class de extends qe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Ju=0;const ze=new oe,$a=new he,vi=new O,Fe=new rs,$i=new rs,ve=new O;class Le extends Oi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ju++}),this.uuid=Un(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ul(t)?Ol:zl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Gt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ze.makeRotationFromQuaternion(t),this.applyMatrix4(ze),this}rotateX(t){return ze.makeRotationX(t),this.applyMatrix4(ze),this}rotateY(t){return ze.makeRotationY(t),this.applyMatrix4(ze),this}rotateZ(t){return ze.makeRotationZ(t),this.applyMatrix4(ze),this}translate(t,e,n){return ze.makeTranslation(t,e,n),this.applyMatrix4(ze),this}scale(t,e,n){return ze.makeScale(t,e,n),this.applyMatrix4(ze),this}lookAt(t){return $a.lookAt(t),$a.updateMatrix(),this.applyMatrix4($a.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vi).negate(),this.translate(vi.x,vi.y,vi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new de(n,3))}else{for(let n=0,s=e.count;n<s;n++){const a=t[n];e.setXYZ(n,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const a=e[n];Fe.setFromBufferAttribute(a),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,Fe.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,Fe.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(Fe.min),this.boundingBox.expandByPoint(Fe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ga);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){const n=this.boundingSphere.center;if(Fe.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];$i.setFromBufferAttribute(o),this.morphTargetsRelative?(ve.addVectors(Fe.min,$i.min),Fe.expandByPoint(ve),ve.addVectors(Fe.max,$i.max),Fe.expandByPoint(ve)):(Fe.expandByPoint($i.min),Fe.expandByPoint($i.max))}Fe.getCenter(n);let s=0;for(let a=0,r=t.count;a<r;a++)ve.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(ve));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)ve.fromBufferAttribute(o,l),c&&(vi.fromBufferAttribute(t,l),ve.add(vi)),s=Math.max(s,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qe(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<n.count;P++)o[P]=new O,c[P]=new O;const l=new O,d=new O,u=new O,f=new Ht,h=new Ht,g=new Ht,_=new O,m=new O;function p(P,b,S){l.fromBufferAttribute(n,P),d.fromBufferAttribute(n,b),u.fromBufferAttribute(n,S),f.fromBufferAttribute(a,P),h.fromBufferAttribute(a,b),g.fromBufferAttribute(a,S),d.sub(l),u.sub(l),h.sub(f),g.sub(f);const R=1/(h.x*g.y-g.x*h.y);isFinite(R)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(u,-h.y).multiplyScalar(R),m.copy(u).multiplyScalar(h.x).addScaledVector(d,-g.x).multiplyScalar(R),o[P].add(_),o[b].add(_),o[S].add(_),c[P].add(m),c[b].add(m),c[S].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let P=0,b=x.length;P<b;++P){const S=x[P],R=S.start,W=S.count;for(let H=R,X=R+W;H<X;H+=3)p(t.getX(H+0),t.getX(H+1),t.getX(H+2))}const y=new O,M=new O,L=new O,C=new O;function w(P){L.fromBufferAttribute(s,P),C.copy(L);const b=o[P];y.copy(b),y.sub(L.multiplyScalar(L.dot(b))).normalize(),M.crossVectors(C,b);const R=M.dot(c[P])<0?-1:1;r.setXYZW(P,y.x,y.y,y.z,R)}for(let P=0,b=x.length;P<b;++P){const S=x[P],R=S.start,W=S.count;for(let H=R,X=R+W;H<X;H+=3)w(t.getX(H+0)),w(t.getX(H+1)),w(t.getX(H+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new qe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,h=n.count;f<h;f++)n.setXYZ(f,0,0,0);const s=new O,a=new O,r=new O,o=new O,c=new O,l=new O,d=new O,u=new O;if(t)for(let f=0,h=t.count;f<h;f+=3){const g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,m),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,h=e.count;f<h;f+=3)s.fromBufferAttribute(e,f+0),a.fromBufferAttribute(e,f+1),r.fromBufferAttribute(e,f+2),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(o,c){const l=o.array,d=o.itemSize,u=o.normalized,f=new l.constructor(c.length*d);let h=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?h=c[_]*o.data.stride+o.offset:h=c[_]*d;for(let p=0;p<d;p++)f[g++]=l[h++]}return new qe(f,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let d=0,u=l.length;d<u;d++){const f=l[d],h=t(f,n);c.push(h)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,f=l.length;u<f;u++){const h=l[u];d.push(h.toJSON(t.data))}d.length>0&&(s[c]=d,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const a=t.morphAttributes;for(const l in a){const d=[],u=a[l];for(let f=0,h=u.length;f<h;f++)d.push(u[f].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,d=r.length;l<d;l++){const u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const yc=new oe,Vn=new Ro,ws=new ga,Sc=new O,Rs=new O,Cs=new O,Ps=new O,Ya=new O,Ls=new O,bc=new O,Ds=new O;class re extends he{constructor(t=new Le,e=new Qe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){Ls.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const d=o[c],u=a[c];d!==0&&(Ya.fromBufferAttribute(u,t),r?Ls.addScaledVector(Ya,d):Ls.addScaledVector(Ya.sub(e),d))}e.add(Ls)}return e}raycast(t,e){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ws.copy(n.boundingSphere),ws.applyMatrix4(a),Vn.copy(t.ray).recast(t.near),!(ws.containsPoint(Vn.origin)===!1&&(Vn.intersectSphere(ws,Sc)===null||Vn.origin.distanceToSquared(Sc)>(t.far-t.near)**2))&&(yc.copy(a).invert(),Vn.copy(t.ray).applyMatrix4(yc),!(n.boundingBox!==null&&Vn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Vn)))}_computeIntersections(t,e,n){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,f=a.groups,h=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=r[m.materialIndex],x=Math.max(m.start,h.start),y=Math.min(o.count,Math.min(m.start+m.count,h.start+h.count));for(let M=x,L=y;M<L;M+=3){const C=o.getX(M),w=o.getX(M+1),P=o.getX(M+2);s=Is(this,p,t,n,l,d,u,C,w,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,h.start),_=Math.min(o.count,h.start+h.count);for(let m=g,p=_;m<p;m+=3){const x=o.getX(m),y=o.getX(m+1),M=o.getX(m+2);s=Is(this,r,t,n,l,d,u,x,y,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=r[m.materialIndex],x=Math.max(m.start,h.start),y=Math.min(c.count,Math.min(m.start+m.count,h.start+h.count));for(let M=x,L=y;M<L;M+=3){const C=M,w=M+1,P=M+2;s=Is(this,p,t,n,l,d,u,C,w,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,h.start),_=Math.min(c.count,h.start+h.count);for(let m=g,p=_;m<p;m+=3){const x=m,y=m+1,M=m+2;s=Is(this,r,t,n,l,d,u,x,y,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Qu(i,t,e,n,s,a,r,o){let c;if(t.side===Pe?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,t.side===Nn,o),c===null)return null;Ds.copy(o),Ds.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ds);return l<e.near||l>e.far?null:{distance:l,point:Ds.clone(),object:i}}function Is(i,t,e,n,s,a,r,o,c,l){i.getVertexPosition(o,Rs),i.getVertexPosition(c,Cs),i.getVertexPosition(l,Ps);const d=Qu(i,t,e,n,Rs,Cs,Ps,bc);if(d){const u=new O;ke.getBarycoord(bc,Rs,Cs,Ps,u),s&&(d.uv=ke.getInterpolatedAttribute(s,o,c,l,u,new Ht)),a&&(d.uv1=ke.getInterpolatedAttribute(a,o,c,l,u,new Ht)),r&&(d.normal=ke.getInterpolatedAttribute(r,o,c,l,u,new O),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new O,materialIndex:0};ke.getNormal(Rs,Cs,Ps,f.normal),d.face=f,d.barycoord=u}return d}class rn extends Le{constructor(t=1,e=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],d=[],u=[];let f=0,h=0;g("z","y","x",-1,-1,n,e,t,r,a,0),g("z","y","x",1,-1,n,e,-t,r,a,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,a,4),g("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new de(l,3)),this.setAttribute("normal",new de(d,3)),this.setAttribute("uv",new de(u,2));function g(_,m,p,x,y,M,L,C,w,P,b){const S=M/w,R=L/P,W=M/2,H=L/2,X=C/2,G=w+1,V=P+1;let $=0,Y=0;const at=new O;for(let ot=0;ot<V;ot++){const ut=ot*R-H;for(let At=0;At<G;At++){const bt=At*S-W;at[_]=bt*x,at[m]=ut*y,at[p]=X,l.push(at.x,at.y,at.z),at[_]=0,at[m]=0,at[p]=C>0?1:-1,d.push(at.x,at.y,at.z),u.push(At/w),u.push(1-ot/P),$+=1}}for(let ot=0;ot<P;ot++)for(let ut=0;ut<w;ut++){const At=f+ut+G*ot,bt=f+ut+G*(ot+1),j=f+(ut+1)+G*(ot+1),it=f+(ut+1)+G*ot;c.push(At,bt,it),c.push(bt,j,it),Y+=6}o.addGroup(h,Y,b),h+=Y,f+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ki(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ae(i){const t={};for(let e=0;e<i.length;e++){const n=ki(i[e]);for(const s in n)t[s]=n[s]}return t}function tf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Bl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:jt.workingColorSpace}const ef={clone:ki,merge:Ae};var nf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fn extends ii{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nf,this.fragmentShader=sf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ki(t.uniforms),this.uniformsGroups=tf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Hl extends he{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=vn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Cn=new O,Ec=new Ht,Ac=new Ht;class Be extends Hl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=oo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ta*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return oo*2*Math.atan(Math.tan(ta*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Cn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Cn.x,Cn.y).multiplyScalar(-t/Cn.z),Cn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Cn.x,Cn.y).multiplyScalar(-t/Cn.z)}getViewSize(t,e){return this.getViewBounds(t,Ec,Ac),e.subVectors(Ac,Ec)}setViewOffset(t,e,n,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ta*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Mi=-90,yi=1;class af extends he{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Be(Mi,yi,t,e);s.layers=this.layers,this.add(s);const a=new Be(Mi,yi,t,e);a.layers=this.layers,this.add(a);const r=new Be(Mi,yi,t,e);r.layers=this.layers,this.add(r);const o=new Be(Mi,yi,t,e);o.layers=this.layers,this.add(o);const c=new Be(Mi,yi,t,e);c.layers=this.layers,this.add(c);const l=new Be(Mi,yi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===oa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,d]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),h=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,a),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,d),t.setRenderTarget(u,f,h),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Vl extends Re{constructor(t,e,n,s,a,r,o,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:Ii,super(t,e,n,s,a,r,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class rf extends ni{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Vl(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:nn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new rn(5,5,5),a=new Fn({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Pe,blending:Dn});a.uniforms.tEquirect.value=e;const r=new re(s,a),o=e.minFilter;return e.minFilter===Jn&&(e.minFilter=nn),new af(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(a)}}const Za=new O,of=new O,cf=new Gt;class Yn{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Za.subVectors(n,e).cross(of.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Za),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||cf.getNormalMatrix(t),s=this.coplanarPoint(Za).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gn=new ga,Us=new O;class Po{constructor(t=new Yn,e=new Yn,n=new Yn,s=new Yn,a=new Yn,r=new Yn){this.planes=[t,e,n,s,a,r]}set(t,e,n,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=vn){const n=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],d=s[5],u=s[6],f=s[7],h=s[8],g=s[9],_=s[10],m=s[11],p=s[12],x=s[13],y=s[14],M=s[15];if(n[0].setComponents(c-a,f-l,m-h,M-p).normalize(),n[1].setComponents(c+a,f+l,m+h,M+p).normalize(),n[2].setComponents(c+r,f+d,m+g,M+x).normalize(),n[3].setComponents(c-r,f-d,m-g,M-x).normalize(),n[4].setComponents(c-o,f-u,m-_,M-y).normalize(),e===vn)n[5].setComponents(c+o,f+u,m+_,M+y).normalize();else if(e===oa)n[5].setComponents(o,u,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Gn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Gn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Gn)}intersectsSprite(t){return Gn.center.set(0,0,0),Gn.radius=.7071067811865476,Gn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Gn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Us.x=s.normal.x>0?t.max.x:t.min.x,Us.y=s.normal.y>0?t.max.y:t.min.y,Us.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Us)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Gl(){let i=null,t=!1,e=null,n=null;function s(a,r){e(a,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function lf(i){const t=new WeakMap;function e(o,c){const l=o.array,d=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let h;if(l instanceof Float32Array)h=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?h=i.HALF_FLOAT:h=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)h=i.SHORT;else if(l instanceof Uint32Array)h=i.UNSIGNED_INT;else if(l instanceof Int32Array)h=i.INT;else if(l instanceof Int8Array)h=i.BYTE;else if(l instanceof Uint8Array)h=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)h=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:h,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((h,g)=>h.start-g.start);let f=0;for(let h=1;h<u.length;h++){const g=u[f],_=u[h];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let h=0,g=u.length;h<g;h++){const _=u[h];i.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class _a extends Le{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=t/o,f=e/c,h=[],g=[],_=[],m=[];for(let p=0;p<d;p++){const x=p*f-r;for(let y=0;y<l;y++){const M=y*u-a;g.push(M,-x,0),_.push(0,0,1),m.push(y/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<o;x++){const y=x+l*p,M=x+l*(p+1),L=x+1+l*(p+1),C=x+1+l*p;h.push(y,M,C),h.push(M,L,C)}this.setIndex(h),this.setAttribute("position",new de(g,3)),this.setAttribute("normal",new de(_,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _a(t.width,t.height,t.widthSegments,t.heightSegments)}}var hf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,df=`#ifdef USE_ALPHAHASH
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
#endif`,uf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ff=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gf=`#ifdef USE_AOMAP
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
#endif`,_f=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xf=`#ifdef USE_BATCHING
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
#endif`,vf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Mf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,bf=`#ifdef USE_IRIDESCENCE
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
#endif`,Ef=`#ifdef USE_BUMPMAP
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
#endif`,Af=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Df=`#if defined( USE_COLOR_ALPHA )
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
#endif`,If=`#define PI 3.141592653589793
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
} // validated`,Uf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Nf=`vec3 transformedNormal = objectNormal;
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
#endif`,Ff=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Of=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vf=`#ifdef USE_ENVMAP
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
#endif`,Gf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Wf=`#ifdef USE_ENVMAP
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
#endif`,Xf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$f=`#ifdef USE_ENVMAP
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
#endif`,Yf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,jf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Kf=`#ifdef USE_GRADIENTMAP
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
}`,Jf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ep=`uniform bool receiveShadow;
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
#endif`,np=`#ifdef USE_ENVMAP
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
#endif`,ip=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,sp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ap=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,op=`PhysicalMaterial material;
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
#endif`,cp=`struct PhysicalMaterial {
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
}`,lp=`
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
#endif`,hp=`#if defined( RE_IndirectDiffuse )
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
#endif`,dp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,up=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_p=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vp=`#if defined( USE_POINTS_UV )
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
#endif`,Mp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ep=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ap=`#ifdef USE_MORPHTARGETS
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
#endif`,Tp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Rp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Dp=`#ifdef USE_NORMALMAP
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
#endif`,Ip=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Up=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Np=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Op=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$p=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Zp=`float getShadowMask() {
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
}`,qp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jp=`#ifdef USE_SKINNING
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
#endif`,Kp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jp=`#ifdef USE_SKINNING
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
#endif`,Qp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,em=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,nm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,im=`#ifdef USE_TRANSMISSION
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
#endif`,sm=`#ifdef USE_TRANSMISSION
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
#endif`,am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,om=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hm=`uniform sampler2D t2D;
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
}`,dm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,um=`#ifdef ENVMAP_TYPE_CUBE
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
}`,fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mm=`#include <common>
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
}`,gm=`#if DEPTH_PACKING == 3200
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
}`,_m=`#define DISTANCE
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
}`,xm=`#define DISTANCE
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
}`,vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ym=`uniform float scale;
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
}`,Sm=`uniform vec3 diffuse;
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
}`,bm=`#include <common>
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
}`,Em=`uniform vec3 diffuse;
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
}`,Am=`#define LAMBERT
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
}`,Tm=`#define LAMBERT
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
}`,wm=`#define MATCAP
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
}`,Rm=`#define MATCAP
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
}`,Cm=`#define NORMAL
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
}`,Pm=`#define NORMAL
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
}`,Lm=`#define PHONG
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
}`,Dm=`#define PHONG
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
}`,Im=`#define STANDARD
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
}`,Um=`#define STANDARD
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
}`,Nm=`#define TOON
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
}`,Fm=`#define TOON
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
}`,km=`uniform float size;
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
}`,zm=`uniform vec3 diffuse;
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
}`,Om=`#include <common>
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
}`,Bm=`uniform vec3 color;
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
}`,Hm=`uniform float rotation;
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
}`,Vm=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:hf,alphahash_pars_fragment:df,alphamap_fragment:uf,alphamap_pars_fragment:ff,alphatest_fragment:pf,alphatest_pars_fragment:mf,aomap_fragment:gf,aomap_pars_fragment:_f,batching_pars_vertex:xf,batching_vertex:vf,begin_vertex:Mf,beginnormal_vertex:yf,bsdfs:Sf,iridescence_fragment:bf,bumpmap_pars_fragment:Ef,clipping_planes_fragment:Af,clipping_planes_pars_fragment:Tf,clipping_planes_pars_vertex:wf,clipping_planes_vertex:Rf,color_fragment:Cf,color_pars_fragment:Pf,color_pars_vertex:Lf,color_vertex:Df,common:If,cube_uv_reflection_fragment:Uf,defaultnormal_vertex:Nf,displacementmap_pars_vertex:Ff,displacementmap_vertex:kf,emissivemap_fragment:zf,emissivemap_pars_fragment:Of,colorspace_fragment:Bf,colorspace_pars_fragment:Hf,envmap_fragment:Vf,envmap_common_pars_fragment:Gf,envmap_pars_fragment:Wf,envmap_pars_vertex:Xf,envmap_physical_pars_fragment:np,envmap_vertex:$f,fog_vertex:Yf,fog_pars_vertex:Zf,fog_fragment:qf,fog_pars_fragment:jf,gradientmap_pars_fragment:Kf,lightmap_pars_fragment:Jf,lights_lambert_fragment:Qf,lights_lambert_pars_fragment:tp,lights_pars_begin:ep,lights_toon_fragment:ip,lights_toon_pars_fragment:sp,lights_phong_fragment:ap,lights_phong_pars_fragment:rp,lights_physical_fragment:op,lights_physical_pars_fragment:cp,lights_fragment_begin:lp,lights_fragment_maps:hp,lights_fragment_end:dp,logdepthbuf_fragment:up,logdepthbuf_pars_fragment:fp,logdepthbuf_pars_vertex:pp,logdepthbuf_vertex:mp,map_fragment:gp,map_pars_fragment:_p,map_particle_fragment:xp,map_particle_pars_fragment:vp,metalnessmap_fragment:Mp,metalnessmap_pars_fragment:yp,morphinstance_vertex:Sp,morphcolor_vertex:bp,morphnormal_vertex:Ep,morphtarget_pars_vertex:Ap,morphtarget_vertex:Tp,normal_fragment_begin:wp,normal_fragment_maps:Rp,normal_pars_fragment:Cp,normal_pars_vertex:Pp,normal_vertex:Lp,normalmap_pars_fragment:Dp,clearcoat_normal_fragment_begin:Ip,clearcoat_normal_fragment_maps:Up,clearcoat_pars_fragment:Np,iridescence_pars_fragment:Fp,opaque_fragment:kp,packing:zp,premultiplied_alpha_fragment:Op,project_vertex:Bp,dithering_fragment:Hp,dithering_pars_fragment:Vp,roughnessmap_fragment:Gp,roughnessmap_pars_fragment:Wp,shadowmap_pars_fragment:Xp,shadowmap_pars_vertex:$p,shadowmap_vertex:Yp,shadowmask_pars_fragment:Zp,skinbase_vertex:qp,skinning_pars_vertex:jp,skinning_vertex:Kp,skinnormal_vertex:Jp,specularmap_fragment:Qp,specularmap_pars_fragment:tm,tonemapping_fragment:em,tonemapping_pars_fragment:nm,transmission_fragment:im,transmission_pars_fragment:sm,uv_pars_fragment:am,uv_pars_vertex:rm,uv_vertex:om,worldpos_vertex:cm,background_vert:lm,background_frag:hm,backgroundCube_vert:dm,backgroundCube_frag:um,cube_vert:fm,cube_frag:pm,depth_vert:mm,depth_frag:gm,distanceRGBA_vert:_m,distanceRGBA_frag:xm,equirect_vert:vm,equirect_frag:Mm,linedashed_vert:ym,linedashed_frag:Sm,meshbasic_vert:bm,meshbasic_frag:Em,meshlambert_vert:Am,meshlambert_frag:Tm,meshmatcap_vert:wm,meshmatcap_frag:Rm,meshnormal_vert:Cm,meshnormal_frag:Pm,meshphong_vert:Lm,meshphong_frag:Dm,meshphysical_vert:Im,meshphysical_frag:Um,meshtoon_vert:Nm,meshtoon_frag:Fm,points_vert:km,points_frag:zm,shadow_vert:Om,shadow_frag:Bm,sprite_vert:Hm,sprite_frag:Vm},Mt={common:{diffuse:{value:new Ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gt}},envmap:{envMap:{value:null},envMapRotation:{value:new Gt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gt},normalScale:{value:new Ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0},uvTransform:{value:new Gt}},sprite:{diffuse:{value:new Ot(16777215)},opacity:{value:1},center:{value:new Ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}}},tn={basic:{uniforms:Ae([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ae([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new Ot(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ae([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new Ot(0)},specular:{value:new Ot(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ae([Mt.common,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.roughnessmap,Mt.metalnessmap,Mt.fog,Mt.lights,{emissive:{value:new Ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ae([Mt.common,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.gradientmap,Mt.fog,Mt.lights,{emissive:{value:new Ot(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ae([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ae([Mt.points,Mt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ae([Mt.common,Mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ae([Mt.common,Mt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ae([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ae([Mt.sprite,Mt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Gt}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ae([Mt.common,Mt.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ae([Mt.lights,Mt.fog,{color:{value:new Ot(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};tn.physical={uniforms:Ae([tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gt},clearcoatNormalScale:{value:new Ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gt},sheen:{value:0},sheenColor:{value:new Ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gt},transmissionSamplerSize:{value:new Ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gt},attenuationDistance:{value:0},attenuationColor:{value:new Ot(0)},specularColor:{value:new Ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gt},anisotropyVector:{value:new Ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const Ns={r:0,b:0,g:0},Wn=new an,Gm=new oe;function Wm(i,t,e,n,s,a,r){const o=new Ot(0);let c=a===!0?0:1,l,d,u=null,f=0,h=null;function g(x){let y=x.isScene===!0?x.background:null;return y&&y.isTexture&&(y=(x.backgroundBlurriness>0?e:t).get(y)),y}function _(x){let y=!1;const M=g(x);M===null?p(o,c):M&&M.isColor&&(p(M,1),y=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,r):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,y){const M=g(y);M&&(M.isCubeTexture||M.mapping===pa)?(d===void 0&&(d=new re(new rn(1,1,1),new Fn({name:"BackgroundCubeMaterial",uniforms:ki(tn.backgroundCube.uniforms),vertexShader:tn.backgroundCube.vertexShader,fragmentShader:tn.backgroundCube.fragmentShader,side:Pe,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(L,C,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Wn.copy(y.backgroundRotation),Wn.x*=-1,Wn.y*=-1,Wn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Wn.y*=-1,Wn.z*=-1),d.material.uniforms.envMap.value=M,d.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Gm.makeRotationFromEuler(Wn)),d.material.toneMapped=jt.getTransfer(M.colorSpace)!==ne,(u!==M||f!==M.version||h!==i.toneMapping)&&(d.material.needsUpdate=!0,u=M,f=M.version,h=i.toneMapping),d.layers.enableAll(),x.unshift(d,d.geometry,d.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new re(new _a(2,2),new Fn({name:"BackgroundMaterial",uniforms:ki(tn.background.uniforms),vertexShader:tn.background.vertexShader,fragmentShader:tn.background.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=jt.getTransfer(M.colorSpace)!==ne,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,h=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,y){x.getRGB(Ns,Bl(i)),n.buffers.color.setClear(Ns.r,Ns.g,Ns.b,y,r)}return{getClearColor:function(){return o},setClearColor:function(x,y=1){o.set(x),c=y,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(o,c)},render:_,addToRenderList:m}}function Xm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let a=s,r=!1;function o(S,R,W,H,X){let G=!1;const V=u(H,W,R);a!==V&&(a=V,l(a.object)),G=h(S,H,W,X),G&&g(S,H,W,X),X!==null&&t.update(X,i.ELEMENT_ARRAY_BUFFER),(G||r)&&(r=!1,M(S,R,W,H),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function d(S){return i.deleteVertexArray(S)}function u(S,R,W){const H=W.wireframe===!0;let X=n[S.id];X===void 0&&(X={},n[S.id]=X);let G=X[R.id];G===void 0&&(G={},X[R.id]=G);let V=G[H];return V===void 0&&(V=f(c()),G[H]=V),V}function f(S){const R=[],W=[],H=[];for(let X=0;X<e;X++)R[X]=0,W[X]=0,H[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:W,attributeDivisors:H,object:S,attributes:{},index:null}}function h(S,R,W,H){const X=a.attributes,G=R.attributes;let V=0;const $=W.getAttributes();for(const Y in $)if($[Y].location>=0){const ot=X[Y];let ut=G[Y];if(ut===void 0&&(Y==="instanceMatrix"&&S.instanceMatrix&&(ut=S.instanceMatrix),Y==="instanceColor"&&S.instanceColor&&(ut=S.instanceColor)),ot===void 0||ot.attribute!==ut||ut&&ot.data!==ut.data)return!0;V++}return a.attributesNum!==V||a.index!==H}function g(S,R,W,H){const X={},G=R.attributes;let V=0;const $=W.getAttributes();for(const Y in $)if($[Y].location>=0){let ot=G[Y];ot===void 0&&(Y==="instanceMatrix"&&S.instanceMatrix&&(ot=S.instanceMatrix),Y==="instanceColor"&&S.instanceColor&&(ot=S.instanceColor));const ut={};ut.attribute=ot,ot&&ot.data&&(ut.data=ot.data),X[Y]=ut,V++}a.attributes=X,a.attributesNum=V,a.index=H}function _(){const S=a.newAttributes;for(let R=0,W=S.length;R<W;R++)S[R]=0}function m(S){p(S,0)}function p(S,R){const W=a.newAttributes,H=a.enabledAttributes,X=a.attributeDivisors;W[S]=1,H[S]===0&&(i.enableVertexAttribArray(S),H[S]=1),X[S]!==R&&(i.vertexAttribDivisor(S,R),X[S]=R)}function x(){const S=a.newAttributes,R=a.enabledAttributes;for(let W=0,H=R.length;W<H;W++)R[W]!==S[W]&&(i.disableVertexAttribArray(W),R[W]=0)}function y(S,R,W,H,X,G,V){V===!0?i.vertexAttribIPointer(S,R,W,X,G):i.vertexAttribPointer(S,R,W,H,X,G)}function M(S,R,W,H){_();const X=H.attributes,G=W.getAttributes(),V=R.defaultAttributeValues;for(const $ in G){const Y=G[$];if(Y.location>=0){let at=X[$];if(at===void 0&&($==="instanceMatrix"&&S.instanceMatrix&&(at=S.instanceMatrix),$==="instanceColor"&&S.instanceColor&&(at=S.instanceColor)),at!==void 0){const ot=at.normalized,ut=at.itemSize,At=t.get(at);if(At===void 0)continue;const bt=At.buffer,j=At.type,it=At.bytesPerElement,ft=j===i.INT||j===i.UNSIGNED_INT||at.gpuType===So;if(at.isInterleavedBufferAttribute){const dt=at.data,pt=dt.stride,Rt=at.offset;if(dt.isInstancedInterleavedBuffer){for(let It=0;It<Y.locationSize;It++)p(Y.location+It,dt.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let It=0;It<Y.locationSize;It++)m(Y.location+It);i.bindBuffer(i.ARRAY_BUFFER,bt);for(let It=0;It<Y.locationSize;It++)y(Y.location+It,ut/Y.locationSize,j,ot,pt*it,(Rt+ut/Y.locationSize*It)*it,ft)}else{if(at.isInstancedBufferAttribute){for(let dt=0;dt<Y.locationSize;dt++)p(Y.location+dt,at.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let dt=0;dt<Y.locationSize;dt++)m(Y.location+dt);i.bindBuffer(i.ARRAY_BUFFER,bt);for(let dt=0;dt<Y.locationSize;dt++)y(Y.location+dt,ut/Y.locationSize,j,ot,ut*it,ut/Y.locationSize*dt*it,ft)}}else if(V!==void 0){const ot=V[$];if(ot!==void 0)switch(ot.length){case 2:i.vertexAttrib2fv(Y.location,ot);break;case 3:i.vertexAttrib3fv(Y.location,ot);break;case 4:i.vertexAttrib4fv(Y.location,ot);break;default:i.vertexAttrib1fv(Y.location,ot)}}}}x()}function L(){P();for(const S in n){const R=n[S];for(const W in R){const H=R[W];for(const X in H)d(H[X].object),delete H[X];delete R[W]}delete n[S]}}function C(S){if(n[S.id]===void 0)return;const R=n[S.id];for(const W in R){const H=R[W];for(const X in H)d(H[X].object),delete H[X];delete R[W]}delete n[S.id]}function w(S){for(const R in n){const W=n[R];if(W[S.id]===void 0)continue;const H=W[S.id];for(const X in H)d(H[X].object),delete H[X];delete W[S.id]}}function P(){b(),r=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:b,dispose:L,releaseStatesOfGeometry:C,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function $m(i,t,e){let n;function s(l){n=l}function a(l,d){i.drawArrays(n,l,d),e.update(d,n,1)}function r(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),e.update(d,n,u))}function o(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let h=0;for(let g=0;g<u;g++)h+=d[g];e.update(h,n,1)}function c(l,d,u,f){if(u===0)return;const h=t.get("WEBGL_multi_draw");if(h===null)for(let g=0;g<l.length;g++)r(l[g],d[g],f[g]);else{h.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=d[_]*f[_];e.update(g,n,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Ym(i,t,e,n){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(w){return!(w!==Ye&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const P=w===ss&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==yn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==xn&&!P)}function c(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:h,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:M,vertexTextures:L,maxSamples:C}}function Zm(i){const t=this;let e=null,n=0,s=!1,a=!1;const r=new Yn,o=new Gt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const h=u.length!==0||f||n!==0||s;return s=f,n=u.length,h},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,f){e=d(u,f,0)},this.setState=function(u,f,h){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||a&&!m)a?d(null):l();else{const x=a?0:n,y=x*4;let M=p.clippingState||null;c.value=M,M=d(g,f,y,h);for(let L=0;L!==y;++L)M[L]=e[L];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(u,f,h,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=h+_*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,M=h;y!==_;++y,M+=4)r.copy(u[y]).applyMatrix4(x,o),r.normal.toArray(m,M),m[M+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function qm(i){let t=new WeakMap;function e(r,o){return o===Pr?r.mapping=Ii:o===Lr&&(r.mapping=Ui),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===Pr||o===Lr)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new rf(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class Wl extends Hl{constructor(t=-1,e=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const wi=4,Tc=[.125,.215,.35,.446,.526,.582],jn=20,qa=new Wl,wc=new Ot;let ja=null,Ka=0,Ja=0,Qa=!1;const Zn=(1+Math.sqrt(5))/2,Si=1/Zn,Rc=[new O(-Zn,Si,0),new O(Zn,Si,0),new O(-Si,0,Zn),new O(Si,0,Zn),new O(0,Zn,-Si),new O(0,Zn,Si),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)];class Cc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ja=this._renderer.getRenderTarget(),Ka=this._renderer.getActiveCubeFace(),Ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Dc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ja,Ka,Ja),this._renderer.xr.enabled=Qa,t.scissorTest=!1,Fs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ii||t.mapping===Ui?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ja=this._renderer.getRenderTarget(),Ka=this._renderer.getActiveCubeFace(),Ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:ss,format:Ye,colorSpace:zi,depthBuffer:!1},s=Pc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Pc(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=jm(a)),this._blurMaterial=Km(a,t,e)}return s}_compileMaterial(t){const e=new re(this._lodPlanes[0],t);this._renderer.compile(e,qa)}_sceneToCubeUV(t,e,n,s){const o=new Be(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(wc),d.toneMapping=In,d.autoClear=!1;const h=new Qe({name:"PMREM.Background",side:Pe,depthWrite:!1,depthTest:!1}),g=new re(new rn,h);let _=!1;const m=t.background;m?m.isColor&&(h.color.copy(m),t.background=null,_=!0):(h.color.copy(wc),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):x===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const y=this._cubeSize;Fs(s,x*y,p>2?y:0,y,y),d.setRenderTarget(s),_&&d.render(g,o),d.render(t,o)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=f,d.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ii||t.mapping===Ui;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Dc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lc());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new re(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;Fs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,qa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Rc[(s-a-1)%Rc.length];this._blur(t,a-1,a,r,o)}e.autoClear=n}_blur(t,e,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",a),this._halfBlur(r,t,n,n,s,"longitudinal",a)}_halfBlur(t,e,n,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new re(this._lodPlanes[s],l),f=l.uniforms,h=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*h):2*Math.PI/(2*jn-1),_=a/g,m=isFinite(a)?1+Math.floor(d*_):jn;m>jn&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${jn}`);const p=[];let x=0;for(let w=0;w<jn;++w){const P=w/_,b=Math.exp(-P*P/2);p.push(b),w===0?x+=b:w<m&&(x+=2*b)}for(let w=0;w<p.length;w++)p[w]=p[w]/x;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=r==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:y}=this;f.dTheta.value=g,f.mipInt.value=y-n;const M=this._sizeLods[s],L=3*M*(s>y-wi?s-y+wi:0),C=4*(this._cubeSize-M);Fs(e,L,C,3*M,2*M),c.setRenderTarget(e),c.render(u,qa)}}function jm(i){const t=[],e=[],n=[];let s=i;const a=i-wi+1+Tc.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>i-wi?c=Tc[r-i+wi-1]:r===0&&(c=0),n.push(c);const l=1/(o-2),d=-l,u=1+l,f=[d,d,u,d,u,u,d,d,u,u,d,u],h=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*h),y=new Float32Array(m*g*h),M=new Float32Array(p*g*h);for(let C=0;C<h;C++){const w=C%3*2/3-1,P=C>2?0:-1,b=[w,P,0,w+2/3,P,0,w+2/3,P+1,0,w,P,0,w+2/3,P+1,0,w,P+1,0];x.set(b,_*g*C),y.set(f,m*g*C);const S=[C,C,C,C,C,C];M.set(S,p*g*C)}const L=new Le;L.setAttribute("position",new qe(x,_)),L.setAttribute("uv",new qe(y,m)),L.setAttribute("faceIndex",new qe(M,p)),t.push(L),s>wi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Pc(i,t,e){const n=new ni(i,t,e);return n.texture.mapping=pa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Fs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Km(i,t,e){const n=new Float32Array(jn),s=new O(0,1,0);return new Fn({name:"SphericalGaussianBlur",defines:{n:jn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Lo(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Lc(){return new Fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Lo(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Dc(){return new Fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Lo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Lo(){return`

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
	`}function Jm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Pr||c===Lr,d=c===Ii||c===Ui;if(l||d){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new Cc(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const h=o.image;return l&&h&&h.height>0||d&&h&&s(h)?(e===null&&(e=new Cc(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function Qm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ki("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function tg(i,t,e,n){const s={},a=new WeakMap;function r(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}f.removeEventListener("dispose",r),delete s[f.id];const h=a.get(f);h&&(t.remove(h),a.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",r),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const h=u.morphAttributes;for(const g in h){const _=h[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(u){const f=[],h=u.index,g=u.attributes.position;let _=0;if(h!==null){const x=h.array;_=h.version;for(let y=0,M=x.length;y<M;y+=3){const L=x[y+0],C=x[y+1],w=x[y+2];f.push(L,C,C,w,w,L)}}else if(g!==void 0){const x=g.array;_=g.version;for(let y=0,M=x.length/3-1;y<M;y+=3){const L=y+0,C=y+1,w=y+2;f.push(L,C,C,w,w,L)}}else return;const m=new(Ul(f)?Ol:zl)(f,1);m.version=_;const p=a.get(u);p&&t.remove(p),a.set(u,m)}function d(u){const f=a.get(u);if(f){const h=u.index;h!==null&&f.version<h.version&&l(u)}else l(u);return a.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function eg(i,t,e){let n;function s(f){n=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function c(f,h){i.drawElements(n,h,a,f*r),e.update(h,n,1)}function l(f,h,g){g!==0&&(i.drawElementsInstanced(n,h,a,f*r,g),e.update(h,n,g))}function d(f,h,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,a,f,0,g);let m=0;for(let p=0;p<g;p++)m+=h[p];e.update(m,n,1)}function u(f,h,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/r,h[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,h,0,a,f,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=h[x]*_[x];e.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function ng(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function ig(i,t,e){const n=new WeakMap,s=new le;function a(r,o,c){const l=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let S=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var h=S;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let L=o.attributes.position.count*M,C=1;L>t.maxTextureSize&&(C=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const w=new Float32Array(L*C*4*u),P=new Fl(w,L,C,u);P.type=xn,P.needsUpdate=!0;const b=M*4;for(let R=0;R<u;R++){const W=p[R],H=x[R],X=y[R],G=L*C*4*R;for(let V=0;V<W.count;V++){const $=V*b;g===!0&&(s.fromBufferAttribute(W,V),w[G+$+0]=s.x,w[G+$+1]=s.y,w[G+$+2]=s.z,w[G+$+3]=0),_===!0&&(s.fromBufferAttribute(H,V),w[G+$+4]=s.x,w[G+$+5]=s.y,w[G+$+6]=s.z,w[G+$+7]=0),m===!0&&(s.fromBufferAttribute(X,V),w[G+$+8]=s.x,w[G+$+9]=s.y,w[G+$+10]=s.z,w[G+$+11]=X.itemSize===4?s.w:1)}}f={count:u,texture:P,size:new Ht(L,C)},n.set(o,f),o.addEventListener("dispose",S)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:a}}function sg(i,t,e,n){let s=new WeakMap;function a(c){const l=n.render.frame,d=c.geometry,u=t.get(c,d);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class Xl extends Re{constructor(t,e,n,s,a,r,o,c,l,d=Pi){if(d!==Pi&&d!==Fi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===Pi&&(n=ei),n===void 0&&d===Fi&&(n=Ni),super(null,s,a,r,o,c,d,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Ze,this.minFilter=c!==void 0?c:Ze,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const $l=new Re,Ic=new Xl(1,1),Yl=new Fl,Zl=new Gu,ql=new Vl,Uc=[],Nc=[],Fc=new Float32Array(16),kc=new Float32Array(9),zc=new Float32Array(4);function Bi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let a=Uc[s];if(a===void 0&&(a=new Float32Array(s),Uc[s]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,i[r].toArray(a,o)}return a}function _e(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function xa(i,t){let e=Nc[t];e===void 0&&(e=new Int32Array(t),Nc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function ag(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function rg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2fv(this.addr,t),xe(e,t)}}function og(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;i.uniform3fv(this.addr,t),xe(e,t)}}function cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4fv(this.addr,t),xe(e,t)}}function lg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;zc.set(n),i.uniformMatrix2fv(this.addr,!1,zc),xe(e,n)}}function hg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;kc.set(n),i.uniformMatrix3fv(this.addr,!1,kc),xe(e,n)}}function dg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Fc.set(n),i.uniformMatrix4fv(this.addr,!1,Fc),xe(e,n)}}function ug(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function fg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2iv(this.addr,t),xe(e,t)}}function pg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3iv(this.addr,t),xe(e,t)}}function mg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4iv(this.addr,t),xe(e,t)}}function gg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function _g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2uiv(this.addr,t),xe(e,t)}}function xg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3uiv(this.addr,t),xe(e,t)}}function vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4uiv(this.addr,t),xe(e,t)}}function Mg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(Ic.compareFunction=Il,a=Ic):a=$l,e.setTexture2D(t||a,s)}function yg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Zl,s)}function Sg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ql,s)}function bg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Yl,s)}function Eg(i){switch(i){case 5126:return ag;case 35664:return rg;case 35665:return og;case 35666:return cg;case 35674:return lg;case 35675:return hg;case 35676:return dg;case 5124:case 35670:return ug;case 35667:case 35671:return fg;case 35668:case 35672:return pg;case 35669:case 35673:return mg;case 5125:return gg;case 36294:return _g;case 36295:return xg;case 36296:return vg;case 35678:case 36198:case 36298:case 36306:case 35682:return Mg;case 35679:case 36299:case 36307:return yg;case 35680:case 36300:case 36308:case 36293:return Sg;case 36289:case 36303:case 36311:case 36292:return bg}}function Ag(i,t){i.uniform1fv(this.addr,t)}function Tg(i,t){const e=Bi(t,this.size,2);i.uniform2fv(this.addr,e)}function wg(i,t){const e=Bi(t,this.size,3);i.uniform3fv(this.addr,e)}function Rg(i,t){const e=Bi(t,this.size,4);i.uniform4fv(this.addr,e)}function Cg(i,t){const e=Bi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Pg(i,t){const e=Bi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Lg(i,t){const e=Bi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Dg(i,t){i.uniform1iv(this.addr,t)}function Ig(i,t){i.uniform2iv(this.addr,t)}function Ug(i,t){i.uniform3iv(this.addr,t)}function Ng(i,t){i.uniform4iv(this.addr,t)}function Fg(i,t){i.uniform1uiv(this.addr,t)}function kg(i,t){i.uniform2uiv(this.addr,t)}function zg(i,t){i.uniform3uiv(this.addr,t)}function Og(i,t){i.uniform4uiv(this.addr,t)}function Bg(i,t,e){const n=this.cache,s=t.length,a=xa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||$l,a[r])}function Hg(i,t,e){const n=this.cache,s=t.length,a=xa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||Zl,a[r])}function Vg(i,t,e){const n=this.cache,s=t.length,a=xa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||ql,a[r])}function Gg(i,t,e){const n=this.cache,s=t.length,a=xa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||Yl,a[r])}function Wg(i){switch(i){case 5126:return Ag;case 35664:return Tg;case 35665:return wg;case 35666:return Rg;case 35674:return Cg;case 35675:return Pg;case 35676:return Lg;case 5124:case 35670:return Dg;case 35667:case 35671:return Ig;case 35668:case 35672:return Ug;case 35669:case 35673:return Ng;case 5125:return Fg;case 36294:return kg;case 36295:return zg;case 36296:return Og;case 35678:case 36198:case 36298:case 36306:case 35682:return Bg;case 35679:case 36299:case 36307:return Hg;case 35680:case 36300:case 36308:case 36293:return Vg;case 36289:case 36303:case 36311:case 36292:return Gg}}class Xg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Eg(e.type)}}class $g{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Wg(e.type)}}class Yg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],n)}}}const tr=/(\w+)(\])?(\[|\.)?/g;function Oc(i,t){i.seq.push(t),i.map[t.id]=t}function Zg(i,t,e){const n=i.name,s=n.length;for(tr.lastIndex=0;;){const a=tr.exec(n),r=tr.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Oc(e,l===void 0?new Xg(o,i,t):new $g(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Yg(o),Oc(e,u)),e=u}}}class ea{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);Zg(a,r,this)}}setValue(t,e,n,s){const a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function Bc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const qg=37297;let jg=0;function Kg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}const Hc=new Gt;function Jg(i){jt._getMatrix(Hc,jt.workingColorSpace,i);const t=`mat3( ${Hc.elements.map(e=>e.toFixed(4))} )`;switch(jt.getTransfer(i)){case ma:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Vc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Kg(i.getShaderSource(t),r)}else return s}function Qg(i,t){const e=Jg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function t0(i,t){let e;switch(t){case gu:e="Linear";break;case _u:e="Reinhard";break;case xu:e="Cineon";break;case vu:e="ACESFilmic";break;case yu:e="AgX";break;case Su:e="Neutral";break;case Mu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ks=new O;function e0(){jt.getLuminanceCoefficients(ks);const i=ks.x.toFixed(4),t=ks.y.toFixed(4),e=ks.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function n0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ji).join(`
`)}function i0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function s0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(t,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:i.getAttribLocation(t,r),locationSize:o}}return e}function Ji(i){return i!==""}function Gc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Wc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const a0=/^[ \t]*#include +<([\w\d./]+)>/gm;function co(i){return i.replace(a0,o0)}const r0=new Map;function o0(i,t){let e=Xt[t];if(e===void 0){const n=r0.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return co(e)}const c0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xc(i){return i.replace(c0,l0)}function l0(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function $c(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function h0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===vl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ml?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===gn&&(t="SHADOWMAP_TYPE_VSM"),t}function d0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ii:case Ui:t="ENVMAP_TYPE_CUBE";break;case pa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function u0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ui:t="ENVMAP_MODE_REFRACTION";break}return t}function f0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case yo:t="ENVMAP_BLENDING_MULTIPLY";break;case pu:t="ENVMAP_BLENDING_MIX";break;case mu:t="ENVMAP_BLENDING_ADD";break}return t}function p0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function m0(i,t,e,n){const s=i.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=h0(e),l=d0(e),d=u0(e),u=f0(e),f=p0(e),h=n0(e),g=i0(a),_=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ji).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ji).join(`
`),p.length>0&&(p+=`
`)):(m=[$c(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ji).join(`
`),p=[$c(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==In?"#define TONE_MAPPING":"",e.toneMapping!==In?Xt.tonemapping_pars_fragment:"",e.toneMapping!==In?t0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,Qg("linearToOutputTexel",e.outputColorSpace),e0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ji).join(`
`)),r=co(r),r=Gc(r,e),r=Wc(r,e),o=co(o),o=Gc(o,e),o=Wc(o,e),r=Xc(r),o=Xc(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===ac?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ac?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=x+m+r,M=x+p+o,L=Bc(s,s.VERTEX_SHADER,y),C=Bc(s,s.FRAGMENT_SHADER,M);s.attachShader(_,L),s.attachShader(_,C),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function w(R){if(i.debug.checkShaderErrors){const W=s.getProgramInfoLog(_).trim(),H=s.getShaderInfoLog(L).trim(),X=s.getShaderInfoLog(C).trim();let G=!0,V=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,L,C);else{const $=Vc(s,L,"vertex"),Y=Vc(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+W+`
`+$+`
`+Y)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(H===""||X==="")&&(V=!1);V&&(R.diagnostics={runnable:G,programLog:W,vertexShader:{log:H,prefix:m},fragmentShader:{log:X,prefix:p}})}s.deleteShader(L),s.deleteShader(C),P=new ea(s,_),b=s0(s,_)}let P;this.getUniforms=function(){return P===void 0&&w(this),P};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,qg)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=jg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=C,this}let g0=0;class _0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new x0(t),e.set(t,n)),n}}class x0{constructor(t){this.id=g0++,this.code=t,this.usedTimes=0}}function v0(i,t,e,n,s,a,r){const o=new Co,c=new _0,l=new Set,d=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let h=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,S,R,W,H){const X=W.fog,G=H.geometry,V=b.isMeshStandardMaterial?W.environment:null,$=(b.isMeshStandardMaterial?e:t).get(b.envMap||V),Y=$&&$.mapping===pa?$.image.height:null,at=g[b.type];b.precision!==null&&(h=s.getMaxPrecision(b.precision),h!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",h,"instead."));const ot=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ut=ot!==void 0?ot.length:0;let At=0;G.morphAttributes.position!==void 0&&(At=1),G.morphAttributes.normal!==void 0&&(At=2),G.morphAttributes.color!==void 0&&(At=3);let bt,j,it,ft;if(at){const $t=tn[at];bt=$t.vertexShader,j=$t.fragmentShader}else bt=b.vertexShader,j=b.fragmentShader,c.update(b),it=c.getVertexShaderID(b),ft=c.getFragmentShaderID(b);const dt=i.getRenderTarget(),pt=i.state.buffers.depth.getReversed(),Rt=H.isInstancedMesh===!0,It=H.isBatchedMesh===!0,Ft=!!b.map,wt=!!b.matcap,Yt=!!$,T=!!b.aoMap,gt=!!b.lightMap,tt=!!b.bumpMap,xt=!!b.normalMap,B=!!b.displacementMap,et=!!b.emissiveMap,Q=!!b.metalnessMap,A=!!b.roughnessMap,v=b.anisotropy>0,U=b.clearcoat>0,K=b.dispersion>0,nt=b.iridescence>0,J=b.sheen>0,st=b.transmission>0,ht=v&&!!b.anisotropyMap,_t=U&&!!b.clearcoatMap,Bt=U&&!!b.clearcoatNormalMap,ct=U&&!!b.clearcoatRoughnessMap,yt=nt&&!!b.iridescenceMap,Ct=nt&&!!b.iridescenceThicknessMap,Ut=J&&!!b.sheenColorMap,St=J&&!!b.sheenRoughnessMap,Vt=!!b.specularMap,kt=!!b.specularColorMap,Zt=!!b.specularIntensityMap,I=st&&!!b.transmissionMap,N=st&&!!b.thicknessMap,D=!!b.gradientMap,F=!!b.alphaMap,rt=b.alphaTest>0,lt=!!b.alphaHash,vt=!!b.extensions;let Wt=In;b.toneMapped&&(dt===null||dt.isXRRenderTarget===!0)&&(Wt=i.toneMapping);const se={shaderID:at,shaderType:b.type,shaderName:b.name,vertexShader:bt,fragmentShader:j,defines:b.defines,customVertexShaderID:it,customFragmentShaderID:ft,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:h,batching:It,batchingColor:It&&H._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&H.instanceColor!==null,instancingMorph:Rt&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:dt===null?i.outputColorSpace:dt.isXRRenderTarget===!0?dt.texture.colorSpace:zi,alphaToCoverage:!!b.alphaToCoverage,map:Ft,matcap:wt,envMap:Yt,envMapMode:Yt&&$.mapping,envMapCubeUVHeight:Y,aoMap:T,lightMap:gt,bumpMap:tt,normalMap:xt,displacementMap:f&&B,emissiveMap:et,normalMapObjectSpace:xt&&b.normalMapType===Tu,normalMapTangentSpace:xt&&b.normalMapType===Dl,metalnessMap:Q,roughnessMap:A,anisotropy:v,anisotropyMap:ht,clearcoat:U,clearcoatMap:_t,clearcoatNormalMap:Bt,clearcoatRoughnessMap:ct,dispersion:K,iridescence:nt,iridescenceMap:yt,iridescenceThicknessMap:Ct,sheen:J,sheenColorMap:Ut,sheenRoughnessMap:St,specularMap:Vt,specularColorMap:kt,specularIntensityMap:Zt,transmission:st,transmissionMap:I,thicknessMap:N,gradientMap:D,opaque:b.transparent===!1&&b.blending===Ci&&b.alphaToCoverage===!1,alphaMap:F,alphaTest:rt,alphaHash:lt,combine:b.combine,mapUv:Ft&&_(b.map.channel),aoMapUv:T&&_(b.aoMap.channel),lightMapUv:gt&&_(b.lightMap.channel),bumpMapUv:tt&&_(b.bumpMap.channel),normalMapUv:xt&&_(b.normalMap.channel),displacementMapUv:B&&_(b.displacementMap.channel),emissiveMapUv:et&&_(b.emissiveMap.channel),metalnessMapUv:Q&&_(b.metalnessMap.channel),roughnessMapUv:A&&_(b.roughnessMap.channel),anisotropyMapUv:ht&&_(b.anisotropyMap.channel),clearcoatMapUv:_t&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Bt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ct&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:yt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ct&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:St&&_(b.sheenRoughnessMap.channel),specularMapUv:Vt&&_(b.specularMap.channel),specularColorMapUv:kt&&_(b.specularColorMap.channel),specularIntensityMapUv:Zt&&_(b.specularIntensityMap.channel),transmissionMapUv:I&&_(b.transmissionMap.channel),thicknessMapUv:N&&_(b.thicknessMap.channel),alphaMapUv:F&&_(b.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(xt||v),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!G.attributes.uv&&(Ft||F),fog:!!X,useFog:b.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:pt,skinning:H.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:At,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Wt,decodeVideoTexture:Ft&&b.map.isVideoTexture===!0&&jt.getTransfer(b.map.colorSpace)===ne,decodeVideoTextureEmissive:et&&b.emissiveMap.isVideoTexture===!0&&jt.getTransfer(b.emissiveMap.colorSpace)===ne,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Te,flipSided:b.side===Pe,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:vt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&b.extensions.multiDraw===!0||It)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return se.vertexUv1s=l.has(1),se.vertexUv2s=l.has(2),se.vertexUv3s=l.has(3),l.clear(),se}function p(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)S.push(R),S.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(x(S,b),y(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function x(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function y(b,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),b.push(o.mask)}function M(b){const S=g[b.type];let R;if(S){const W=tn[S];R=ef.clone(W.uniforms)}else R=b.uniforms;return R}function L(b,S){let R;for(let W=0,H=d.length;W<H;W++){const X=d[W];if(X.cacheKey===S){R=X,++R.usedTimes;break}}return R===void 0&&(R=new m0(i,S,b,a),d.push(R)),R}function C(b){if(--b.usedTimes===0){const S=d.indexOf(b);d[S]=d[d.length-1],d.pop(),b.destroy()}}function w(b){c.remove(b)}function P(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:L,releaseProgram:C,releaseShaderCache:w,programs:d,dispose:P}}function M0(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:a}}function y0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Yc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Zc(){const i=[];let t=0;const e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function r(u,f,h,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:h,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=h,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,f,h,g,_,m){const p=r(u,f,h,g,_,m);h.transmission>0?n.push(p):h.transparent===!0?s.push(p):e.push(p)}function c(u,f,h,g,_,m){const p=r(u,f,h,g,_,m);h.transmission>0?n.unshift(p):h.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||y0),n.length>1&&n.sort(f||Yc),s.length>1&&s.sort(f||Yc)}function d(){for(let u=t,f=i.length;u<f;u++){const h=i[u];if(h.id===null)break;h.id=null,h.object=null,h.geometry=null,h.material=null,h.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:o,unshift:c,finish:d,sort:l}}function S0(){let i=new WeakMap;function t(n,s){const a=i.get(n);let r;return a===void 0?(r=new Zc,i.set(n,[r])):s>=a.length?(r=new Zc,a.push(r)):r=a[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function b0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new Ot};break;case"SpotLight":e={position:new O,direction:new O,color:new Ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new Ot,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new Ot,groundColor:new Ot};break;case"RectAreaLight":e={color:new Ot,position:new O,halfWidth:new O,halfHeight:new O};break}return i[t.id]=e,e}}}function E0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let A0=0;function T0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function w0(i){const t=new b0,e=E0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new O);const s=new O,a=new oe,r=new oe;function o(l){let d=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let h=0,g=0,_=0,m=0,p=0,x=0,y=0,M=0,L=0,C=0,w=0;l.sort(T0);for(let b=0,S=l.length;b<S;b++){const R=l[b],W=R.color,H=R.intensity,X=R.distance,G=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=W.r*H,u+=W.g*H,f+=W.b*H;else if(R.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(R.sh.coefficients[V],H);w++}else if(R.isDirectionalLight){const V=t.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const $=R.shadow,Y=e.get(R);Y.shadowIntensity=$.intensity,Y.shadowBias=$.bias,Y.shadowNormalBias=$.normalBias,Y.shadowRadius=$.radius,Y.shadowMapSize=$.mapSize,n.directionalShadow[h]=Y,n.directionalShadowMap[h]=G,n.directionalShadowMatrix[h]=R.shadow.matrix,x++}n.directional[h]=V,h++}else if(R.isSpotLight){const V=t.get(R);V.position.setFromMatrixPosition(R.matrixWorld),V.color.copy(W).multiplyScalar(H),V.distance=X,V.coneCos=Math.cos(R.angle),V.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),V.decay=R.decay,n.spot[_]=V;const $=R.shadow;if(R.map&&(n.spotLightMap[L]=R.map,L++,$.updateMatrices(R),R.castShadow&&C++),n.spotLightMatrix[_]=$.matrix,R.castShadow){const Y=e.get(R);Y.shadowIntensity=$.intensity,Y.shadowBias=$.bias,Y.shadowNormalBias=$.normalBias,Y.shadowRadius=$.radius,Y.shadowMapSize=$.mapSize,n.spotShadow[_]=Y,n.spotShadowMap[_]=G,M++}_++}else if(R.isRectAreaLight){const V=t.get(R);V.color.copy(W).multiplyScalar(H),V.halfWidth.set(R.width*.5,0,0),V.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=V,m++}else if(R.isPointLight){const V=t.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),V.distance=R.distance,V.decay=R.decay,R.castShadow){const $=R.shadow,Y=e.get(R);Y.shadowIntensity=$.intensity,Y.shadowBias=$.bias,Y.shadowNormalBias=$.normalBias,Y.shadowRadius=$.radius,Y.shadowMapSize=$.mapSize,Y.shadowCameraNear=$.camera.near,Y.shadowCameraFar=$.camera.far,n.pointShadow[g]=Y,n.pointShadowMap[g]=G,n.pointShadowMatrix[g]=R.shadow.matrix,y++}n.point[g]=V,g++}else if(R.isHemisphereLight){const V=t.get(R);V.skyColor.copy(R.color).multiplyScalar(H),V.groundColor.copy(R.groundColor).multiplyScalar(H),n.hemi[p]=V,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Mt.LTC_FLOAT_1,n.rectAreaLTC2=Mt.LTC_FLOAT_2):(n.rectAreaLTC1=Mt.LTC_HALF_1,n.rectAreaLTC2=Mt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=f;const P=n.hash;(P.directionalLength!==h||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==x||P.numPointShadows!==y||P.numSpotShadows!==M||P.numSpotMaps!==L||P.numLightProbes!==w)&&(n.directional.length=h,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=M+L-C,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=w,P.directionalLength=h,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=x,P.numPointShadows=y,P.numSpotShadows=M,P.numSpotMaps=L,P.numLightProbes=w,n.version=A0++)}function c(l,d){let u=0,f=0,h=0,g=0,_=0;const m=d.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const y=l[p];if(y.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(y.isSpotLight){const M=n.spot[h];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),h++}else if(y.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),r.identity(),a.copy(y.matrixWorld),a.premultiply(m),r.extractRotation(a),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(r),M.halfHeight.applyMatrix4(r),g++}else if(y.isPointLight){const M=n.point[f];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),f++}else if(y.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function qc(i){const t=new w0(i),e=[],n=[];function s(d){l.camera=d,e.length=0,n.length=0}function a(d){e.push(d)}function r(d){n.push(d)}function o(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function R0(i){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new qc(i),t.set(s,[o])):a>=r.length?(o=new qc(i),r.push(o)):o=r[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class C0 extends ii{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Eu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class P0 extends ii{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const L0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D0=`uniform sampler2D shadow_pass;
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
}`;function I0(i,t,e){let n=new Po;const s=new Ht,a=new Ht,r=new le,o=new C0({depthPacking:Au}),c=new P0,l={},d=e.maxTextureSize,u={[Nn]:Pe,[Pe]:Nn,[Te]:Te},f=new Fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ht},radius:{value:4}},vertexShader:L0,fragmentShader:D0}),h=f.clone();h.defines.HORIZONTAL_PASS=1;const g=new Le;g.setAttribute("position",new qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new re(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=vl;let p=this.type;this.render=function(C,w,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const b=i.getRenderTarget(),S=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),W=i.state;W.setBlending(Dn),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const H=p!==gn&&this.type===gn,X=p===gn&&this.type!==gn;for(let G=0,V=C.length;G<V;G++){const $=C[G],Y=$.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const at=Y.getFrameExtents();if(s.multiply(at),a.copy(Y.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/at.x),s.x=a.x*at.x,Y.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/at.y),s.y=a.y*at.y,Y.mapSize.y=a.y)),Y.map===null||H===!0||X===!0){const ut=this.type!==gn?{minFilter:Ze,magFilter:Ze}:{};Y.map!==null&&Y.map.dispose(),Y.map=new ni(s.x,s.y,ut),Y.map.texture.name=$.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const ot=Y.getViewportCount();for(let ut=0;ut<ot;ut++){const At=Y.getViewport(ut);r.set(a.x*At.x,a.y*At.y,a.x*At.z,a.y*At.w),W.viewport(r),Y.updateMatrices($,ut),n=Y.getFrustum(),M(w,P,Y.camera,$,this.type)}Y.isPointLightShadow!==!0&&this.type===gn&&x(Y,P),Y.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,S,R)};function x(C,w){const P=t.update(_);f.defines.VSM_SAMPLES!==C.blurSamples&&(f.defines.VSM_SAMPLES=C.blurSamples,h.defines.VSM_SAMPLES=C.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new ni(s.x,s.y)),f.uniforms.shadow_pass.value=C.map.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(w,null,P,f,_,null),h.uniforms.shadow_pass.value=C.mapPass.texture,h.uniforms.resolution.value=C.mapSize,h.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(w,null,P,h,_,null)}function y(C,w,P,b){let S=null;const R=P.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(R!==void 0)S=R;else if(S=P.isPointLight===!0?c:o,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const W=S.uuid,H=w.uuid;let X=l[W];X===void 0&&(X={},l[W]=X);let G=X[H];G===void 0&&(G=S.clone(),X[H]=G,w.addEventListener("dispose",L)),S=G}if(S.visible=w.visible,S.wireframe=w.wireframe,b===gn?S.side=w.shadowSide!==null?w.shadowSide:w.side:S.side=w.shadowSide!==null?w.shadowSide:u[w.side],S.alphaMap=w.alphaMap,S.alphaTest=w.alphaTest,S.map=w.map,S.clipShadows=w.clipShadows,S.clippingPlanes=w.clippingPlanes,S.clipIntersection=w.clipIntersection,S.displacementMap=w.displacementMap,S.displacementScale=w.displacementScale,S.displacementBias=w.displacementBias,S.wireframeLinewidth=w.wireframeLinewidth,S.linewidth=w.linewidth,P.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const W=i.properties.get(S);W.light=P}return S}function M(C,w,P,b,S){if(C.visible===!1)return;if(C.layers.test(w.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&S===gn)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,C.matrixWorld);const H=t.update(C),X=C.material;if(Array.isArray(X)){const G=H.groups;for(let V=0,$=G.length;V<$;V++){const Y=G[V],at=X[Y.materialIndex];if(at&&at.visible){const ot=y(C,at,b,S);C.onBeforeShadow(i,C,w,P,H,ot,Y),i.renderBufferDirect(P,null,H,ot,C,Y),C.onAfterShadow(i,C,w,P,H,ot,Y)}}}else if(X.visible){const G=y(C,X,b,S);C.onBeforeShadow(i,C,w,P,H,G,null),i.renderBufferDirect(P,null,H,G,C,null),C.onAfterShadow(i,C,w,P,H,G,null)}}const W=C.children;for(let H=0,X=W.length;H<X;H++)M(W[H],w,P,b,S)}function L(C){C.target.removeEventListener("dispose",L);for(const P in l){const b=l[P],S=C.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const U0={[br]:Er,[Ar]:Rr,[Tr]:Cr,[Di]:wr,[Er]:br,[Rr]:Ar,[Cr]:Tr,[wr]:Di};function N0(i,t){function e(){let I=!1;const N=new le;let D=null;const F=new le(0,0,0,0);return{setMask:function(rt){D!==rt&&!I&&(i.colorMask(rt,rt,rt,rt),D=rt)},setLocked:function(rt){I=rt},setClear:function(rt,lt,vt,Wt,se){se===!0&&(rt*=Wt,lt*=Wt,vt*=Wt),N.set(rt,lt,vt,Wt),F.equals(N)===!1&&(i.clearColor(rt,lt,vt,Wt),F.copy(N))},reset:function(){I=!1,D=null,F.set(-1,0,0,0)}}}function n(){let I=!1,N=!1,D=null,F=null,rt=null;return{setReversed:function(lt){if(N!==lt){const vt=t.get("EXT_clip_control");N?vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.ZERO_TO_ONE_EXT):vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.NEGATIVE_ONE_TO_ONE_EXT);const Wt=rt;rt=null,this.setClear(Wt)}N=lt},getReversed:function(){return N},setTest:function(lt){lt?dt(i.DEPTH_TEST):pt(i.DEPTH_TEST)},setMask:function(lt){D!==lt&&!I&&(i.depthMask(lt),D=lt)},setFunc:function(lt){if(N&&(lt=U0[lt]),F!==lt){switch(lt){case br:i.depthFunc(i.NEVER);break;case Er:i.depthFunc(i.ALWAYS);break;case Ar:i.depthFunc(i.LESS);break;case Di:i.depthFunc(i.LEQUAL);break;case Tr:i.depthFunc(i.EQUAL);break;case wr:i.depthFunc(i.GEQUAL);break;case Rr:i.depthFunc(i.GREATER);break;case Cr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}F=lt}},setLocked:function(lt){I=lt},setClear:function(lt){rt!==lt&&(N&&(lt=1-lt),i.clearDepth(lt),rt=lt)},reset:function(){I=!1,D=null,F=null,rt=null,N=!1}}}function s(){let I=!1,N=null,D=null,F=null,rt=null,lt=null,vt=null,Wt=null,se=null;return{setTest:function($t){I||($t?dt(i.STENCIL_TEST):pt(i.STENCIL_TEST))},setMask:function($t){N!==$t&&!I&&(i.stencilMask($t),N=$t)},setFunc:function($t,Kt,ue){(D!==$t||F!==Kt||rt!==ue)&&(i.stencilFunc($t,Kt,ue),D=$t,F=Kt,rt=ue)},setOp:function($t,Kt,ue){(lt!==$t||vt!==Kt||Wt!==ue)&&(i.stencilOp($t,Kt,ue),lt=$t,vt=Kt,Wt=ue)},setLocked:function($t){I=$t},setClear:function($t){se!==$t&&(i.clearStencil($t),se=$t)},reset:function(){I=!1,N=null,D=null,F=null,rt=null,lt=null,vt=null,Wt=null,se=null}}}const a=new e,r=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},f=new WeakMap,h=[],g=null,_=!1,m=null,p=null,x=null,y=null,M=null,L=null,C=null,w=new Ot(0,0,0),P=0,b=!1,S=null,R=null,W=null,H=null,X=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,$=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(Y)[1]),V=$>=1):Y.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),V=$>=2);let at=null,ot={};const ut=i.getParameter(i.SCISSOR_BOX),At=i.getParameter(i.VIEWPORT),bt=new le().fromArray(ut),j=new le().fromArray(At);function it(I,N,D,F){const rt=new Uint8Array(4),lt=i.createTexture();i.bindTexture(I,lt),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let vt=0;vt<D;vt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(N,0,i.RGBA,1,1,F,0,i.RGBA,i.UNSIGNED_BYTE,rt):i.texImage2D(N+vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,rt);return lt}const ft={};ft[i.TEXTURE_2D]=it(i.TEXTURE_2D,i.TEXTURE_2D,1),ft[i.TEXTURE_CUBE_MAP]=it(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ft[i.TEXTURE_2D_ARRAY]=it(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ft[i.TEXTURE_3D]=it(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),dt(i.DEPTH_TEST),r.setFunc(Di),tt(!1),xt(tc),dt(i.CULL_FACE),T(Dn);function dt(I){d[I]!==!0&&(i.enable(I),d[I]=!0)}function pt(I){d[I]!==!1&&(i.disable(I),d[I]=!1)}function Rt(I,N){return u[I]!==N?(i.bindFramebuffer(I,N),u[I]=N,I===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=N),I===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=N),!0):!1}function It(I,N){let D=h,F=!1;if(I){D=f.get(N),D===void 0&&(D=[],f.set(N,D));const rt=I.textures;if(D.length!==rt.length||D[0]!==i.COLOR_ATTACHMENT0){for(let lt=0,vt=rt.length;lt<vt;lt++)D[lt]=i.COLOR_ATTACHMENT0+lt;D.length=rt.length,F=!0}}else D[0]!==i.BACK&&(D[0]=i.BACK,F=!0);F&&i.drawBuffers(D)}function Ft(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const wt={[qn]:i.FUNC_ADD,[Kd]:i.FUNC_SUBTRACT,[Jd]:i.FUNC_REVERSE_SUBTRACT};wt[Qd]=i.MIN,wt[tu]=i.MAX;const Yt={[eu]:i.ZERO,[nu]:i.ONE,[iu]:i.SRC_COLOR,[yr]:i.SRC_ALPHA,[lu]:i.SRC_ALPHA_SATURATE,[ou]:i.DST_COLOR,[au]:i.DST_ALPHA,[su]:i.ONE_MINUS_SRC_COLOR,[Sr]:i.ONE_MINUS_SRC_ALPHA,[cu]:i.ONE_MINUS_DST_COLOR,[ru]:i.ONE_MINUS_DST_ALPHA,[hu]:i.CONSTANT_COLOR,[du]:i.ONE_MINUS_CONSTANT_COLOR,[uu]:i.CONSTANT_ALPHA,[fu]:i.ONE_MINUS_CONSTANT_ALPHA};function T(I,N,D,F,rt,lt,vt,Wt,se,$t){if(I===Dn){_===!0&&(pt(i.BLEND),_=!1);return}if(_===!1&&(dt(i.BLEND),_=!0),I!==jd){if(I!==m||$t!==b){if((p!==qn||M!==qn)&&(i.blendEquation(i.FUNC_ADD),p=qn,M=qn),$t)switch(I){case Ci:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ec:i.blendFunc(i.ONE,i.ONE);break;case nc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ic:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ci:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ec:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case nc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ic:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}x=null,y=null,L=null,C=null,w.set(0,0,0),P=0,m=I,b=$t}return}rt=rt||N,lt=lt||D,vt=vt||F,(N!==p||rt!==M)&&(i.blendEquationSeparate(wt[N],wt[rt]),p=N,M=rt),(D!==x||F!==y||lt!==L||vt!==C)&&(i.blendFuncSeparate(Yt[D],Yt[F],Yt[lt],Yt[vt]),x=D,y=F,L=lt,C=vt),(Wt.equals(w)===!1||se!==P)&&(i.blendColor(Wt.r,Wt.g,Wt.b,se),w.copy(Wt),P=se),m=I,b=!1}function gt(I,N){I.side===Te?pt(i.CULL_FACE):dt(i.CULL_FACE);let D=I.side===Pe;N&&(D=!D),tt(D),I.blending===Ci&&I.transparent===!1?T(Dn):T(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),r.setFunc(I.depthFunc),r.setTest(I.depthTest),r.setMask(I.depthWrite),a.setMask(I.colorWrite);const F=I.stencilWrite;o.setTest(F),F&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),et(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?dt(i.SAMPLE_ALPHA_TO_COVERAGE):pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function tt(I){S!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),S=I)}function xt(I){I!==Zd?(dt(i.CULL_FACE),I!==R&&(I===tc?i.cullFace(i.BACK):I===qd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pt(i.CULL_FACE),R=I}function B(I){I!==W&&(V&&i.lineWidth(I),W=I)}function et(I,N,D){I?(dt(i.POLYGON_OFFSET_FILL),(H!==N||X!==D)&&(i.polygonOffset(N,D),H=N,X=D)):pt(i.POLYGON_OFFSET_FILL)}function Q(I){I?dt(i.SCISSOR_TEST):pt(i.SCISSOR_TEST)}function A(I){I===void 0&&(I=i.TEXTURE0+G-1),at!==I&&(i.activeTexture(I),at=I)}function v(I,N,D){D===void 0&&(at===null?D=i.TEXTURE0+G-1:D=at);let F=ot[D];F===void 0&&(F={type:void 0,texture:void 0},ot[D]=F),(F.type!==I||F.texture!==N)&&(at!==D&&(i.activeTexture(D),at=D),i.bindTexture(I,N||ft[I]),F.type=I,F.texture=N)}function U(){const I=ot[at];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function K(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function nt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function st(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ht(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _t(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Bt(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ct(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function yt(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ct(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ut(I){bt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),bt.copy(I))}function St(I){j.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),j.copy(I))}function Vt(I,N){let D=l.get(N);D===void 0&&(D=new WeakMap,l.set(N,D));let F=D.get(I);F===void 0&&(F=i.getUniformBlockIndex(N,I.name),D.set(I,F))}function kt(I,N){const F=l.get(N).get(I);c.get(N)!==F&&(i.uniformBlockBinding(N,F,I.__bindingPointIndex),c.set(N,F))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},at=null,ot={},u={},f=new WeakMap,h=[],g=null,_=!1,m=null,p=null,x=null,y=null,M=null,L=null,C=null,w=new Ot(0,0,0),P=0,b=!1,S=null,R=null,W=null,H=null,X=null,bt.set(0,0,i.canvas.width,i.canvas.height),j.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:dt,disable:pt,bindFramebuffer:Rt,drawBuffers:It,useProgram:Ft,setBlending:T,setMaterial:gt,setFlipSided:tt,setCullFace:xt,setLineWidth:B,setPolygonOffset:et,setScissorTest:Q,activeTexture:A,bindTexture:v,unbindTexture:U,compressedTexImage2D:K,compressedTexImage3D:nt,texImage2D:yt,texImage3D:Ct,updateUBOMapping:Vt,uniformBlockBinding:kt,texStorage2D:Bt,texStorage3D:ct,texSubImage2D:J,texSubImage3D:st,compressedTexSubImage2D:ht,compressedTexSubImage3D:_t,scissor:Ut,viewport:St,reset:Zt}}function jc(i,t,e,n){const s=F0(n);switch(e){case Al:return i*t;case wl:return i*t;case Rl:return i*t*2;case Cl:return i*t/s.components*s.byteLength;case Ao:return i*t/s.components*s.byteLength;case Pl:return i*t*2/s.components*s.byteLength;case To:return i*t*2/s.components*s.byteLength;case Tl:return i*t*3/s.components*s.byteLength;case Ye:return i*t*4/s.components*s.byteLength;case wo:return i*t*4/s.components*s.byteLength;case qs:case js:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ks:case Js:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Nr:case kr:return Math.max(i,16)*Math.max(t,8)/4;case Ur:case Fr:return Math.max(i,8)*Math.max(t,8)/2;case zr:case Or:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Br:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Hr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Vr:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Gr:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Wr:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Xr:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case $r:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Yr:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Zr:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case qr:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case jr:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Kr:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Jr:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Qr:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case to:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Qs:case eo:case no:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ll:case io:return Math.ceil(i/4)*Math.ceil(t/4)*8;case so:case ao:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function F0(i){switch(i){case yn:case Sl:return{byteLength:1,components:1};case ns:case bl:case ss:return{byteLength:2,components:1};case bo:case Eo:return{byteLength:2,components:4};case ei:case So:case xn:return{byteLength:4,components:1};case El:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function k0(i,t,e,n,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ht,d=new WeakMap;let u;const f=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,v){return h?new OffscreenCanvas(A,v):ca("canvas")}function _(A,v,U){let K=1;const nt=Q(A);if((nt.width>U||nt.height>U)&&(K=U/Math.max(nt.width,nt.height)),K<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const J=Math.floor(K*nt.width),st=Math.floor(K*nt.height);u===void 0&&(u=g(J,st));const ht=v?g(J,st):u;return ht.width=J,ht.height=st,ht.getContext("2d").drawImage(A,0,0,J,st),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+J+"x"+st+")."),ht}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){i.generateMipmap(A)}function x(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(A,v,U,K,nt=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let J=v;if(v===i.RED&&(U===i.FLOAT&&(J=i.R32F),U===i.HALF_FLOAT&&(J=i.R16F),U===i.UNSIGNED_BYTE&&(J=i.R8)),v===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.R8UI),U===i.UNSIGNED_SHORT&&(J=i.R16UI),U===i.UNSIGNED_INT&&(J=i.R32UI),U===i.BYTE&&(J=i.R8I),U===i.SHORT&&(J=i.R16I),U===i.INT&&(J=i.R32I)),v===i.RG&&(U===i.FLOAT&&(J=i.RG32F),U===i.HALF_FLOAT&&(J=i.RG16F),U===i.UNSIGNED_BYTE&&(J=i.RG8)),v===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.RG8UI),U===i.UNSIGNED_SHORT&&(J=i.RG16UI),U===i.UNSIGNED_INT&&(J=i.RG32UI),U===i.BYTE&&(J=i.RG8I),U===i.SHORT&&(J=i.RG16I),U===i.INT&&(J=i.RG32I)),v===i.RGB_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.RGB8UI),U===i.UNSIGNED_SHORT&&(J=i.RGB16UI),U===i.UNSIGNED_INT&&(J=i.RGB32UI),U===i.BYTE&&(J=i.RGB8I),U===i.SHORT&&(J=i.RGB16I),U===i.INT&&(J=i.RGB32I)),v===i.RGBA_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),U===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),U===i.UNSIGNED_INT&&(J=i.RGBA32UI),U===i.BYTE&&(J=i.RGBA8I),U===i.SHORT&&(J=i.RGBA16I),U===i.INT&&(J=i.RGBA32I)),v===i.RGB&&U===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),v===i.RGBA){const st=nt?ma:jt.getTransfer(K);U===i.FLOAT&&(J=i.RGBA32F),U===i.HALF_FLOAT&&(J=i.RGBA16F),U===i.UNSIGNED_BYTE&&(J=st===ne?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function M(A,v){let U;return A?v===null||v===ei||v===Ni?U=i.DEPTH24_STENCIL8:v===xn?U=i.DEPTH32F_STENCIL8:v===ns&&(U=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ei||v===Ni?U=i.DEPTH_COMPONENT24:v===xn?U=i.DEPTH_COMPONENT32F:v===ns&&(U=i.DEPTH_COMPONENT16),U}function L(A,v){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ze&&A.minFilter!==nn?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function C(A){const v=A.target;v.removeEventListener("dispose",C),P(v),v.isVideoTexture&&d.delete(v)}function w(A){const v=A.target;v.removeEventListener("dispose",w),S(v)}function P(A){const v=n.get(A);if(v.__webglInit===void 0)return;const U=A.source,K=f.get(U);if(K){const nt=K[v.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&b(A),Object.keys(K).length===0&&f.delete(U)}n.remove(A)}function b(A){const v=n.get(A);i.deleteTexture(v.__webglTexture);const U=A.source,K=f.get(U);delete K[v.__cacheKey],r.memory.textures--}function S(A){const v=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(v.__webglFramebuffer[K]))for(let nt=0;nt<v.__webglFramebuffer[K].length;nt++)i.deleteFramebuffer(v.__webglFramebuffer[K][nt]);else i.deleteFramebuffer(v.__webglFramebuffer[K]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[K])}else{if(Array.isArray(v.__webglFramebuffer))for(let K=0;K<v.__webglFramebuffer.length;K++)i.deleteFramebuffer(v.__webglFramebuffer[K]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let K=0;K<v.__webglColorRenderbuffer.length;K++)v.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[K]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const U=A.textures;for(let K=0,nt=U.length;K<nt;K++){const J=n.get(U[K]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),r.memory.textures--),n.remove(U[K])}n.remove(A)}let R=0;function W(){R=0}function H(){const A=R;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),R+=1,A}function X(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function G(A,v){const U=n.get(A);if(A.isVideoTexture&&B(A),A.isRenderTargetTexture===!1&&A.version>0&&U.__version!==A.version){const K=A.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(U,A,v);return}}e.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+v)}function V(A,v){const U=n.get(A);if(A.version>0&&U.__version!==A.version){j(U,A,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+v)}function $(A,v){const U=n.get(A);if(A.version>0&&U.__version!==A.version){j(U,A,v);return}e.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+v)}function Y(A,v){const U=n.get(A);if(A.version>0&&U.__version!==A.version){it(U,A,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+v)}const at={[Dr]:i.REPEAT,[Kn]:i.CLAMP_TO_EDGE,[Ir]:i.MIRRORED_REPEAT},ot={[Ze]:i.NEAREST,[bu]:i.NEAREST_MIPMAP_NEAREST,[_s]:i.NEAREST_MIPMAP_LINEAR,[nn]:i.LINEAR,[wa]:i.LINEAR_MIPMAP_NEAREST,[Jn]:i.LINEAR_MIPMAP_LINEAR},ut={[wu]:i.NEVER,[Iu]:i.ALWAYS,[Ru]:i.LESS,[Il]:i.LEQUAL,[Cu]:i.EQUAL,[Du]:i.GEQUAL,[Pu]:i.GREATER,[Lu]:i.NOTEQUAL};function At(A,v){if(v.type===xn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===nn||v.magFilter===wa||v.magFilter===_s||v.magFilter===Jn||v.minFilter===nn||v.minFilter===wa||v.minFilter===_s||v.minFilter===Jn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,at[v.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,at[v.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,at[v.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ot[v.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ot[v.minFilter]),v.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,ut[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Ze||v.minFilter!==_s&&v.minFilter!==Jn||v.type===xn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const U=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function bt(A,v){let U=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",C));const K=v.source;let nt=f.get(K);nt===void 0&&(nt={},f.set(K,nt));const J=X(v);if(J!==A.__cacheKey){nt[J]===void 0&&(nt[J]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,U=!0),nt[J].usedTimes++;const st=nt[A.__cacheKey];st!==void 0&&(nt[A.__cacheKey].usedTimes--,st.usedTimes===0&&b(v)),A.__cacheKey=J,A.__webglTexture=nt[J].texture}return U}function j(A,v,U){let K=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(K=i.TEXTURE_3D);const nt=bt(A,v),J=v.source;e.bindTexture(K,A.__webglTexture,i.TEXTURE0+U);const st=n.get(J);if(J.version!==st.__version||nt===!0){e.activeTexture(i.TEXTURE0+U);const ht=jt.getPrimaries(jt.workingColorSpace),_t=v.colorSpace===Pn?null:jt.getPrimaries(v.colorSpace),Bt=v.colorSpace===Pn||ht===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let ct=_(v.image,!1,s.maxTextureSize);ct=et(v,ct);const yt=a.convert(v.format,v.colorSpace),Ct=a.convert(v.type);let Ut=y(v.internalFormat,yt,Ct,v.colorSpace,v.isVideoTexture);At(K,v);let St;const Vt=v.mipmaps,kt=v.isVideoTexture!==!0,Zt=st.__version===void 0||nt===!0,I=J.dataReady,N=L(v,ct);if(v.isDepthTexture)Ut=M(v.format===Fi,v.type),Zt&&(kt?e.texStorage2D(i.TEXTURE_2D,1,Ut,ct.width,ct.height):e.texImage2D(i.TEXTURE_2D,0,Ut,ct.width,ct.height,0,yt,Ct,null));else if(v.isDataTexture)if(Vt.length>0){kt&&Zt&&e.texStorage2D(i.TEXTURE_2D,N,Ut,Vt[0].width,Vt[0].height);for(let D=0,F=Vt.length;D<F;D++)St=Vt[D],kt?I&&e.texSubImage2D(i.TEXTURE_2D,D,0,0,St.width,St.height,yt,Ct,St.data):e.texImage2D(i.TEXTURE_2D,D,Ut,St.width,St.height,0,yt,Ct,St.data);v.generateMipmaps=!1}else kt?(Zt&&e.texStorage2D(i.TEXTURE_2D,N,Ut,ct.width,ct.height),I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct.width,ct.height,yt,Ct,ct.data)):e.texImage2D(i.TEXTURE_2D,0,Ut,ct.width,ct.height,0,yt,Ct,ct.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){kt&&Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,N,Ut,Vt[0].width,Vt[0].height,ct.depth);for(let D=0,F=Vt.length;D<F;D++)if(St=Vt[D],v.format!==Ye)if(yt!==null)if(kt){if(I)if(v.layerUpdates.size>0){const rt=jc(St.width,St.height,v.format,v.type);for(const lt of v.layerUpdates){const vt=St.data.subarray(lt*rt/St.data.BYTES_PER_ELEMENT,(lt+1)*rt/St.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,D,0,0,lt,St.width,St.height,1,yt,vt)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,D,0,0,0,St.width,St.height,ct.depth,yt,St.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,D,Ut,St.width,St.height,ct.depth,0,St.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?I&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,D,0,0,0,St.width,St.height,ct.depth,yt,Ct,St.data):e.texImage3D(i.TEXTURE_2D_ARRAY,D,Ut,St.width,St.height,ct.depth,0,yt,Ct,St.data)}else{kt&&Zt&&e.texStorage2D(i.TEXTURE_2D,N,Ut,Vt[0].width,Vt[0].height);for(let D=0,F=Vt.length;D<F;D++)St=Vt[D],v.format!==Ye?yt!==null?kt?I&&e.compressedTexSubImage2D(i.TEXTURE_2D,D,0,0,St.width,St.height,yt,St.data):e.compressedTexImage2D(i.TEXTURE_2D,D,Ut,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?I&&e.texSubImage2D(i.TEXTURE_2D,D,0,0,St.width,St.height,yt,Ct,St.data):e.texImage2D(i.TEXTURE_2D,D,Ut,St.width,St.height,0,yt,Ct,St.data)}else if(v.isDataArrayTexture)if(kt){if(Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,N,Ut,ct.width,ct.height,ct.depth),I)if(v.layerUpdates.size>0){const D=jc(ct.width,ct.height,v.format,v.type);for(const F of v.layerUpdates){const rt=ct.data.subarray(F*D/ct.data.BYTES_PER_ELEMENT,(F+1)*D/ct.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,F,ct.width,ct.height,1,yt,Ct,rt)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ct.width,ct.height,ct.depth,yt,Ct,ct.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ut,ct.width,ct.height,ct.depth,0,yt,Ct,ct.data);else if(v.isData3DTexture)kt?(Zt&&e.texStorage3D(i.TEXTURE_3D,N,Ut,ct.width,ct.height,ct.depth),I&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ct.width,ct.height,ct.depth,yt,Ct,ct.data)):e.texImage3D(i.TEXTURE_3D,0,Ut,ct.width,ct.height,ct.depth,0,yt,Ct,ct.data);else if(v.isFramebufferTexture){if(Zt)if(kt)e.texStorage2D(i.TEXTURE_2D,N,Ut,ct.width,ct.height);else{let D=ct.width,F=ct.height;for(let rt=0;rt<N;rt++)e.texImage2D(i.TEXTURE_2D,rt,Ut,D,F,0,yt,Ct,null),D>>=1,F>>=1}}else if(Vt.length>0){if(kt&&Zt){const D=Q(Vt[0]);e.texStorage2D(i.TEXTURE_2D,N,Ut,D.width,D.height)}for(let D=0,F=Vt.length;D<F;D++)St=Vt[D],kt?I&&e.texSubImage2D(i.TEXTURE_2D,D,0,0,yt,Ct,St):e.texImage2D(i.TEXTURE_2D,D,Ut,yt,Ct,St);v.generateMipmaps=!1}else if(kt){if(Zt){const D=Q(ct);e.texStorage2D(i.TEXTURE_2D,N,Ut,D.width,D.height)}I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,yt,Ct,ct)}else e.texImage2D(i.TEXTURE_2D,0,Ut,yt,Ct,ct);m(v)&&p(K),st.__version=J.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function it(A,v,U){if(v.image.length!==6)return;const K=bt(A,v),nt=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+U);const J=n.get(nt);if(nt.version!==J.__version||K===!0){e.activeTexture(i.TEXTURE0+U);const st=jt.getPrimaries(jt.workingColorSpace),ht=v.colorSpace===Pn?null:jt.getPrimaries(v.colorSpace),_t=v.colorSpace===Pn||st===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const Bt=v.isCompressedTexture||v.image[0].isCompressedTexture,ct=v.image[0]&&v.image[0].isDataTexture,yt=[];for(let F=0;F<6;F++)!Bt&&!ct?yt[F]=_(v.image[F],!0,s.maxCubemapSize):yt[F]=ct?v.image[F].image:v.image[F],yt[F]=et(v,yt[F]);const Ct=yt[0],Ut=a.convert(v.format,v.colorSpace),St=a.convert(v.type),Vt=y(v.internalFormat,Ut,St,v.colorSpace),kt=v.isVideoTexture!==!0,Zt=J.__version===void 0||K===!0,I=nt.dataReady;let N=L(v,Ct);At(i.TEXTURE_CUBE_MAP,v);let D;if(Bt){kt&&Zt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,N,Vt,Ct.width,Ct.height);for(let F=0;F<6;F++){D=yt[F].mipmaps;for(let rt=0;rt<D.length;rt++){const lt=D[rt];v.format!==Ye?Ut!==null?kt?I&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,rt,0,0,lt.width,lt.height,Ut,lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,rt,Vt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,rt,0,0,lt.width,lt.height,Ut,St,lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,rt,Vt,lt.width,lt.height,0,Ut,St,lt.data)}}}else{if(D=v.mipmaps,kt&&Zt){D.length>0&&N++;const F=Q(yt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,N,Vt,F.width,F.height)}for(let F=0;F<6;F++)if(ct){kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,0,0,0,yt[F].width,yt[F].height,Ut,St,yt[F].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,0,Vt,yt[F].width,yt[F].height,0,Ut,St,yt[F].data);for(let rt=0;rt<D.length;rt++){const vt=D[rt].image[F].image;kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,rt+1,0,0,vt.width,vt.height,Ut,St,vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,rt+1,Vt,vt.width,vt.height,0,Ut,St,vt.data)}}else{kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,0,0,0,Ut,St,yt[F]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,0,Vt,Ut,St,yt[F]);for(let rt=0;rt<D.length;rt++){const lt=D[rt];kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,rt+1,0,0,Ut,St,lt.image[F]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,rt+1,Vt,Ut,St,lt.image[F])}}}m(v)&&p(i.TEXTURE_CUBE_MAP),J.__version=nt.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function ft(A,v,U,K,nt,J){const st=a.convert(U.format,U.colorSpace),ht=a.convert(U.type),_t=y(U.internalFormat,st,ht,U.colorSpace),Bt=n.get(v),ct=n.get(U);if(ct.__renderTarget=v,!Bt.__hasExternalTextures){const yt=Math.max(1,v.width>>J),Ct=Math.max(1,v.height>>J);nt===i.TEXTURE_3D||nt===i.TEXTURE_2D_ARRAY?e.texImage3D(nt,J,_t,yt,Ct,v.depth,0,st,ht,null):e.texImage2D(nt,J,_t,yt,Ct,0,st,ht,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),xt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,nt,ct.__webglTexture,0,tt(v)):(nt===i.TEXTURE_2D||nt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,nt,ct.__webglTexture,J),e.bindFramebuffer(i.FRAMEBUFFER,null)}function dt(A,v,U){if(i.bindRenderbuffer(i.RENDERBUFFER,A),v.depthBuffer){const K=v.depthTexture,nt=K&&K.isDepthTexture?K.type:null,J=M(v.stencilBuffer,nt),st=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=tt(v);xt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,J,v.width,v.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,J,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,J,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,A)}else{const K=v.textures;for(let nt=0;nt<K.length;nt++){const J=K[nt],st=a.convert(J.format,J.colorSpace),ht=a.convert(J.type),_t=y(J.internalFormat,st,ht,J.colorSpace),Bt=tt(v);U&&xt(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Bt,_t,v.width,v.height):xt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Bt,_t,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,_t,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function pt(A,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(v.depthTexture);K.__renderTarget=v,(!K.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),G(v.depthTexture,0);const nt=K.__webglTexture,J=tt(v);if(v.depthTexture.format===Pi)xt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0);else if(v.depthTexture.format===Fi)xt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function Rt(A){const v=n.get(A),U=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const K=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),K){const nt=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,K.removeEventListener("dispose",nt)};K.addEventListener("dispose",nt),v.__depthDisposeCallback=nt}v.__boundDepthTexture=K}if(A.depthTexture&&!v.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");pt(v.__webglFramebuffer,A)}else if(U){v.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[K]),v.__webglDepthbuffer[K]===void 0)v.__webglDepthbuffer[K]=i.createRenderbuffer(),dt(v.__webglDepthbuffer[K],A,!1);else{const nt=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,J)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),dt(v.__webglDepthbuffer,A,!1);else{const K=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,nt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function It(A,v,U){const K=n.get(A);v!==void 0&&ft(K.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&Rt(A)}function Ft(A){const v=A.texture,U=n.get(A),K=n.get(v);A.addEventListener("dispose",w);const nt=A.textures,J=A.isWebGLCubeRenderTarget===!0,st=nt.length>1;if(st||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=v.version,r.memory.textures++),J){U.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(v.mipmaps&&v.mipmaps.length>0){U.__webglFramebuffer[ht]=[];for(let _t=0;_t<v.mipmaps.length;_t++)U.__webglFramebuffer[ht][_t]=i.createFramebuffer()}else U.__webglFramebuffer[ht]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){U.__webglFramebuffer=[];for(let ht=0;ht<v.mipmaps.length;ht++)U.__webglFramebuffer[ht]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(st)for(let ht=0,_t=nt.length;ht<_t;ht++){const Bt=n.get(nt[ht]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=i.createTexture(),r.memory.textures++)}if(A.samples>0&&xt(A)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let ht=0;ht<nt.length;ht++){const _t=nt[ht];U.__webglColorRenderbuffer[ht]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[ht]);const Bt=a.convert(_t.format,_t.colorSpace),ct=a.convert(_t.type),yt=y(_t.internalFormat,Bt,ct,_t.colorSpace,A.isXRRenderTarget===!0),Ct=tt(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,yt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,U.__webglColorRenderbuffer[ht])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),dt(U.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),At(i.TEXTURE_CUBE_MAP,v);for(let ht=0;ht<6;ht++)if(v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)ft(U.__webglFramebuffer[ht][_t],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,_t);else ft(U.__webglFramebuffer[ht],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);m(v)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(st){for(let ht=0,_t=nt.length;ht<_t;ht++){const Bt=nt[ht],ct=n.get(Bt);e.bindTexture(i.TEXTURE_2D,ct.__webglTexture),At(i.TEXTURE_2D,Bt),ft(U.__webglFramebuffer,A,Bt,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,0),m(Bt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let ht=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ht=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,K.__webglTexture),At(ht,v),v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)ft(U.__webglFramebuffer[_t],A,v,i.COLOR_ATTACHMENT0,ht,_t);else ft(U.__webglFramebuffer,A,v,i.COLOR_ATTACHMENT0,ht,0);m(v)&&p(ht),e.unbindTexture()}A.depthBuffer&&Rt(A)}function wt(A){const v=A.textures;for(let U=0,K=v.length;U<K;U++){const nt=v[U];if(m(nt)){const J=x(A),st=n.get(nt).__webglTexture;e.bindTexture(J,st),p(J),e.unbindTexture()}}}const Yt=[],T=[];function gt(A){if(A.samples>0){if(xt(A)===!1){const v=A.textures,U=A.width,K=A.height;let nt=i.COLOR_BUFFER_BIT;const J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,st=n.get(A),ht=v.length>1;if(ht)for(let _t=0;_t<v.length;_t++)e.bindFramebuffer(i.FRAMEBUFFER,st.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,st.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,st.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,st.__webglFramebuffer);for(let _t=0;_t<v.length;_t++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(nt|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(nt|=i.STENCIL_BUFFER_BIT)),ht){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,st.__webglColorRenderbuffer[_t]);const Bt=n.get(v[_t]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Bt,0)}i.blitFramebuffer(0,0,U,K,0,0,U,K,nt,i.NEAREST),c===!0&&(Yt.length=0,T.length=0,Yt.push(i.COLOR_ATTACHMENT0+_t),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Yt.push(J),T.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,T)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Yt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ht)for(let _t=0;_t<v.length;_t++){e.bindFramebuffer(i.FRAMEBUFFER,st.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,st.__webglColorRenderbuffer[_t]);const Bt=n.get(v[_t]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,st.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,Bt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,st.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const v=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function tt(A){return Math.min(s.maxSamples,A.samples)}function xt(A){const v=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function B(A){const v=r.render.frame;d.get(A)!==v&&(d.set(A,v),A.update())}function et(A,v){const U=A.colorSpace,K=A.format,nt=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||U!==zi&&U!==Pn&&(jt.getTransfer(U)===ne?(K!==Ye||nt!==yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),v}function Q(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=H,this.resetTextureUnits=W,this.setTexture2D=G,this.setTexture2DArray=V,this.setTexture3D=$,this.setTextureCube=Y,this.rebindTextures=It,this.setupRenderTarget=Ft,this.updateRenderTargetMipmap=wt,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=xt}function z0(i,t){function e(n,s=Pn){let a;const r=jt.getTransfer(s);if(n===yn)return i.UNSIGNED_BYTE;if(n===bo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Eo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===El)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Sl)return i.BYTE;if(n===bl)return i.SHORT;if(n===ns)return i.UNSIGNED_SHORT;if(n===So)return i.INT;if(n===ei)return i.UNSIGNED_INT;if(n===xn)return i.FLOAT;if(n===ss)return i.HALF_FLOAT;if(n===Al)return i.ALPHA;if(n===Tl)return i.RGB;if(n===Ye)return i.RGBA;if(n===wl)return i.LUMINANCE;if(n===Rl)return i.LUMINANCE_ALPHA;if(n===Pi)return i.DEPTH_COMPONENT;if(n===Fi)return i.DEPTH_STENCIL;if(n===Cl)return i.RED;if(n===Ao)return i.RED_INTEGER;if(n===Pl)return i.RG;if(n===To)return i.RG_INTEGER;if(n===wo)return i.RGBA_INTEGER;if(n===qs||n===js||n===Ks||n===Js)if(r===ne)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===qs)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===js)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ks)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Js)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===qs)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===js)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ks)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Js)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ur||n===Nr||n===Fr||n===kr)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===Ur)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Nr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===kr)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===zr||n===Or||n===Br)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===zr||n===Or)return r===ne?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===Br)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Hr||n===Vr||n===Gr||n===Wr||n===Xr||n===$r||n===Yr||n===Zr||n===qr||n===jr||n===Kr||n===Jr||n===Qr||n===to)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===Hr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Vr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Gr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$r)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Yr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Zr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===qr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===jr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Kr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qr)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===to)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qs||n===eo||n===no)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===Qs)return r===ne?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===eo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===no)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ll||n===io||n===so||n===ao)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===Qs)return a.COMPRESSED_RED_RGTC1_EXT;if(n===io)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===so)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ao)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ni?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class O0 extends Be{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Me extends he{constructor(){super(),this.isGroup=!0,this.type="Group"}}const B0={type:"move"};class er{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=d.position.distanceTo(u.position),h=.02,g=.005;l.inputState.pinching&&f>h+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=h-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(B0)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Me;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const H0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,V0=`
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

}`;class G0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Re,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Fn({vertexShader:H0,fragmentShader:V0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new re(new _a(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class W0 extends Oi{constructor(t,e){super();const n=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,d=null,u=null,f=null,h=null,g=null;const _=new G0,m=e.getContextAttributes();let p=null,x=null;const y=[],M=[],L=new Ht;let C=null;const w=new Be;w.viewport=new le;const P=new Be;P.viewport=new le;const b=[w,P],S=new O0;let R=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let it=y[j];return it===void 0&&(it=new er,y[j]=it),it.getTargetRaySpace()},this.getControllerGrip=function(j){let it=y[j];return it===void 0&&(it=new er,y[j]=it),it.getGripSpace()},this.getHand=function(j){let it=y[j];return it===void 0&&(it=new er,y[j]=it),it.getHandSpace()};function H(j){const it=M.indexOf(j.inputSource);if(it===-1)return;const ft=y[it];ft!==void 0&&(ft.update(j.inputSource,j.frame,l||r),ft.dispatchEvent({type:j.type,data:j.inputSource}))}function X(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",G);for(let j=0;j<y.length;j++){const it=M[j];it!==null&&(M[j]=null,y[j].disconnect(it))}R=null,W=null,_.reset(),t.setRenderTarget(p),h=null,f=null,u=null,s=null,x=null,bt.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",X),s.addEventListener("inputsourceschange",G),m.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const it={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};h=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:h}),t.setPixelRatio(1),t.setSize(h.framebufferWidth,h.framebufferHeight,!1),x=new ni(h.framebufferWidth,h.framebufferHeight,{format:Ye,type:yn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let it=null,ft=null,dt=null;m.depth&&(dt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=m.stencil?Fi:Pi,ft=m.stencil?Ni:ei);const pt={colorFormat:e.RGBA8,depthFormat:dt,scaleFactor:a};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(pt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),x=new ni(f.textureWidth,f.textureHeight,{format:Ye,type:yn,depthTexture:new Xl(f.textureWidth,f.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),bt.setContext(s),bt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function G(j){for(let it=0;it<j.removed.length;it++){const ft=j.removed[it],dt=M.indexOf(ft);dt>=0&&(M[dt]=null,y[dt].disconnect(ft))}for(let it=0;it<j.added.length;it++){const ft=j.added[it];let dt=M.indexOf(ft);if(dt===-1){for(let Rt=0;Rt<y.length;Rt++)if(Rt>=M.length){M.push(ft),dt=Rt;break}else if(M[Rt]===null){M[Rt]=ft,dt=Rt;break}if(dt===-1)break}const pt=y[dt];pt&&pt.connect(ft)}}const V=new O,$=new O;function Y(j,it,ft){V.setFromMatrixPosition(it.matrixWorld),$.setFromMatrixPosition(ft.matrixWorld);const dt=V.distanceTo($),pt=it.projectionMatrix.elements,Rt=ft.projectionMatrix.elements,It=pt[14]/(pt[10]-1),Ft=pt[14]/(pt[10]+1),wt=(pt[9]+1)/pt[5],Yt=(pt[9]-1)/pt[5],T=(pt[8]-1)/pt[0],gt=(Rt[8]+1)/Rt[0],tt=It*T,xt=It*gt,B=dt/(-T+gt),et=B*-T;if(it.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(et),j.translateZ(B),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),pt[10]===-1)j.projectionMatrix.copy(it.projectionMatrix),j.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{const Q=It+B,A=Ft+B,v=tt-et,U=xt+(dt-et),K=wt*Ft/A*Q,nt=Yt*Ft/A*Q;j.projectionMatrix.makePerspective(v,U,K,nt,Q,A),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function at(j,it){it===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(it.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let it=j.near,ft=j.far;_.texture!==null&&(_.depthNear>0&&(it=_.depthNear),_.depthFar>0&&(ft=_.depthFar)),S.near=P.near=w.near=it,S.far=P.far=w.far=ft,(R!==S.near||W!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),R=S.near,W=S.far),w.layers.mask=j.layers.mask|2,P.layers.mask=j.layers.mask|4,S.layers.mask=w.layers.mask|P.layers.mask;const dt=j.parent,pt=S.cameras;at(S,dt);for(let Rt=0;Rt<pt.length;Rt++)at(pt[Rt],dt);pt.length===2?Y(S,w,P):S.projectionMatrix.copy(w.projectionMatrix),ot(j,S,dt)};function ot(j,it,ft){ft===null?j.matrix.copy(it.matrixWorld):(j.matrix.copy(ft.matrixWorld),j.matrix.invert(),j.matrix.multiply(it.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(it.projectionMatrix),j.projectionMatrixInverse.copy(it.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=oo*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&h===null))return c},this.setFoveation=function(j){c=j,f!==null&&(f.fixedFoveation=j),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=j)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(S)};let ut=null;function At(j,it){if(d=it.getViewerPose(l||r),g=it,d!==null){const ft=d.views;h!==null&&(t.setRenderTargetFramebuffer(x,h.framebuffer),t.setRenderTarget(x));let dt=!1;ft.length!==S.cameras.length&&(S.cameras.length=0,dt=!0);for(let Rt=0;Rt<ft.length;Rt++){const It=ft[Rt];let Ft=null;if(h!==null)Ft=h.getViewport(It);else{const Yt=u.getViewSubImage(f,It);Ft=Yt.viewport,Rt===0&&(t.setRenderTargetTextures(x,Yt.colorTexture,f.ignoreDepthValues?void 0:Yt.depthStencilTexture),t.setRenderTarget(x))}let wt=b[Rt];wt===void 0&&(wt=new Be,wt.layers.enable(Rt),wt.viewport=new le,b[Rt]=wt),wt.matrix.fromArray(It.transform.matrix),wt.matrix.decompose(wt.position,wt.quaternion,wt.scale),wt.projectionMatrix.fromArray(It.projectionMatrix),wt.projectionMatrixInverse.copy(wt.projectionMatrix).invert(),wt.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),Rt===0&&(S.matrix.copy(wt.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),dt===!0&&S.cameras.push(wt)}const pt=s.enabledFeatures;if(pt&&pt.includes("depth-sensing")){const Rt=u.getDepthInformation(ft[0]);Rt&&Rt.isValid&&Rt.texture&&_.init(t,Rt,s.renderState)}}for(let ft=0;ft<y.length;ft++){const dt=M[ft],pt=y[ft];dt!==null&&pt!==void 0&&pt.update(dt,it,l||r)}ut&&ut(j,it),it.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:it}),g=null}const bt=new Gl;bt.setAnimationLoop(At),this.setAnimationLoop=function(j){ut=j},this.dispose=function(){}}}const Xn=new an,X0=new oe;function $0(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Bl(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,y,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),u(m,p)):p.isMeshPhongMaterial?(a(m,p),d(m,p)):p.isMeshStandardMaterial?(a(m,p),f(m,p),p.isMeshPhysicalMaterial&&h(m,p,M)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),_(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,x,y):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Pe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Pe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),y=x.envMap,M=x.envMapRotation;y&&(m.envMap.value=y,Xn.copy(M),Xn.x*=-1,Xn.y*=-1,Xn.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Xn.y*=-1,Xn.z*=-1),m.envMapRotation.value.setFromMatrix4(X0.makeRotationFromEuler(Xn)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=y*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function h(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Pe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Y0(i,t,e,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,y){const M=y.program;n.uniformBlockBinding(x,M)}function l(x,y){let M=s[x.id];M===void 0&&(g(x),M=d(x),s[x.id]=M,x.addEventListener("dispose",m));const L=y.program;n.updateUBOMapping(x,L);const C=t.render.frame;a[x.id]!==C&&(f(x),a[x.id]=C)}function d(x){const y=u();x.__bindingPointIndex=y;const M=i.createBuffer(),L=x.__size,C=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,L,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,M),M}function u(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const y=s[x.id],M=x.uniforms,L=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let C=0,w=M.length;C<w;C++){const P=Array.isArray(M[C])?M[C]:[M[C]];for(let b=0,S=P.length;b<S;b++){const R=P[b];if(h(R,C,b,L)===!0){const W=R.__offset,H=Array.isArray(R.value)?R.value:[R.value];let X=0;for(let G=0;G<H.length;G++){const V=H[G],$=_(V);typeof V=="number"||typeof V=="boolean"?(R.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,W+X,R.__data)):V.isMatrix3?(R.__data[0]=V.elements[0],R.__data[1]=V.elements[1],R.__data[2]=V.elements[2],R.__data[3]=0,R.__data[4]=V.elements[3],R.__data[5]=V.elements[4],R.__data[6]=V.elements[5],R.__data[7]=0,R.__data[8]=V.elements[6],R.__data[9]=V.elements[7],R.__data[10]=V.elements[8],R.__data[11]=0):(V.toArray(R.__data,X),X+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(x,y,M,L){const C=x.value,w=y+"_"+M;if(L[w]===void 0)return typeof C=="number"||typeof C=="boolean"?L[w]=C:L[w]=C.clone(),!0;{const P=L[w];if(typeof C=="number"||typeof C=="boolean"){if(P!==C)return L[w]=C,!0}else if(P.equals(C)===!1)return P.copy(C),!0}return!1}function g(x){const y=x.uniforms;let M=0;const L=16;for(let w=0,P=y.length;w<P;w++){const b=Array.isArray(y[w])?y[w]:[y[w]];for(let S=0,R=b.length;S<R;S++){const W=b[S],H=Array.isArray(W.value)?W.value:[W.value];for(let X=0,G=H.length;X<G;X++){const V=H[X],$=_(V),Y=M%L,at=Y%$.boundary,ot=Y+at;M+=at,ot!==0&&L-ot<$.storage&&(M+=L-ot),W.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=M,M+=$.storage}}}const C=M%L;return C>0&&(M+=L-C),x.__size=M,x.__cache={},this}function _(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function m(x){const y=x.target;y.removeEventListener("dispose",m);const M=r.indexOf(y.__bindingPointIndex);r.splice(M,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete a[y.id]}function p(){for(const x in s)i.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:p}}class Z0{constructor(t={}){const{canvas:e=Nu(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=n.getContextAttributes().alpha}else h=r;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Oe,this.toneMapping=In,this.toneMappingExposure=1;const M=this;let L=!1,C=0,w=0,P=null,b=-1,S=null;const R=new le,W=new le;let H=null;const X=new Ot(0);let G=0,V=e.width,$=e.height,Y=1,at=null,ot=null;const ut=new le(0,0,V,$),At=new le(0,0,V,$);let bt=!1;const j=new Po;let it=!1,ft=!1;const dt=new oe,pt=new oe,Rt=new O,It=new le,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let wt=!1;function Yt(){return P===null?Y:1}let T=n;function gt(E,k){return e.getContext(E,k)}try{const E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Mo}`),e.addEventListener("webglcontextlost",F,!1),e.addEventListener("webglcontextrestored",rt,!1),e.addEventListener("webglcontextcreationerror",lt,!1),T===null){const k="webgl2";if(T=gt(k,E),T===null)throw gt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let tt,xt,B,et,Q,A,v,U,K,nt,J,st,ht,_t,Bt,ct,yt,Ct,Ut,St,Vt,kt,Zt,I;function N(){tt=new Qm(T),tt.init(),kt=new z0(T,tt),xt=new Ym(T,tt,t,kt),B=new N0(T,tt),xt.reverseDepthBuffer&&f&&B.buffers.depth.setReversed(!0),et=new ng(T),Q=new M0,A=new k0(T,tt,B,Q,xt,kt,et),v=new qm(M),U=new Jm(M),K=new lf(T),Zt=new Xm(T,K),nt=new tg(T,K,et,Zt),J=new sg(T,nt,K,et),Ut=new ig(T,xt,A),ct=new Zm(Q),st=new v0(M,v,U,tt,xt,Zt,ct),ht=new $0(M,Q),_t=new S0,Bt=new R0(tt),Ct=new Wm(M,v,U,B,J,h,c),yt=new I0(M,J,xt),I=new Y0(T,et,xt,B),St=new $m(T,tt,et),Vt=new eg(T,tt,et),et.programs=st.programs,M.capabilities=xt,M.extensions=tt,M.properties=Q,M.renderLists=_t,M.shadowMap=yt,M.state=B,M.info=et}N();const D=new W0(M,T);this.xr=D,this.getContext=function(){return T},this.getContextAttributes=function(){return T.getContextAttributes()},this.forceContextLoss=function(){const E=tt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=tt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(E){E!==void 0&&(Y=E,this.setSize(V,$,!1))},this.getSize=function(E){return E.set(V,$)},this.setSize=function(E,k,Z=!0){if(D.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=E,$=k,e.width=Math.floor(E*Y),e.height=Math.floor(k*Y),Z===!0&&(e.style.width=E+"px",e.style.height=k+"px"),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set(V*Y,$*Y).floor()},this.setDrawingBufferSize=function(E,k,Z){V=E,$=k,Y=Z,e.width=Math.floor(E*Z),e.height=Math.floor(k*Z),this.setViewport(0,0,E,k)},this.getCurrentViewport=function(E){return E.copy(R)},this.getViewport=function(E){return E.copy(ut)},this.setViewport=function(E,k,Z,q){E.isVector4?ut.set(E.x,E.y,E.z,E.w):ut.set(E,k,Z,q),B.viewport(R.copy(ut).multiplyScalar(Y).round())},this.getScissor=function(E){return E.copy(At)},this.setScissor=function(E,k,Z,q){E.isVector4?At.set(E.x,E.y,E.z,E.w):At.set(E,k,Z,q),B.scissor(W.copy(At).multiplyScalar(Y).round())},this.getScissorTest=function(){return bt},this.setScissorTest=function(E){B.setScissorTest(bt=E)},this.setOpaqueSort=function(E){at=E},this.setTransparentSort=function(E){ot=E},this.getClearColor=function(E){return E.copy(Ct.getClearColor())},this.setClearColor=function(){Ct.setClearColor.apply(Ct,arguments)},this.getClearAlpha=function(){return Ct.getClearAlpha()},this.setClearAlpha=function(){Ct.setClearAlpha.apply(Ct,arguments)},this.clear=function(E=!0,k=!0,Z=!0){let q=0;if(E){let z=!1;if(P!==null){const mt=P.texture.format;z=mt===wo||mt===To||mt===Ao}if(z){const mt=P.texture.type,Et=mt===yn||mt===ei||mt===ns||mt===Ni||mt===bo||mt===Eo,Pt=Ct.getClearColor(),Lt=Ct.getClearAlpha(),Nt=Pt.r,zt=Pt.g,Dt=Pt.b;Et?(g[0]=Nt,g[1]=zt,g[2]=Dt,g[3]=Lt,T.clearBufferuiv(T.COLOR,0,g)):(_[0]=Nt,_[1]=zt,_[2]=Dt,_[3]=Lt,T.clearBufferiv(T.COLOR,0,_))}else q|=T.COLOR_BUFFER_BIT}k&&(q|=T.DEPTH_BUFFER_BIT),Z&&(q|=T.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),T.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",F,!1),e.removeEventListener("webglcontextrestored",rt,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),_t.dispose(),Bt.dispose(),Q.dispose(),v.dispose(),U.dispose(),J.dispose(),Zt.dispose(),I.dispose(),st.dispose(),D.dispose(),D.removeEventListener("sessionstart",kn),D.removeEventListener("sessionend",si),on.stop()};function F(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function rt(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const E=et.autoReset,k=yt.enabled,Z=yt.autoUpdate,q=yt.needsUpdate,z=yt.type;N(),et.autoReset=E,yt.enabled=k,yt.autoUpdate=Z,yt.needsUpdate=q,yt.type=z}function lt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function vt(E){const k=E.target;k.removeEventListener("dispose",vt),Wt(k)}function Wt(E){se(E),Q.remove(E)}function se(E){const k=Q.get(E).programs;k!==void 0&&(k.forEach(function(Z){st.releaseProgram(Z)}),E.isShaderMaterial&&st.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,Z,q,z,mt){k===null&&(k=Ft);const Et=z.isMesh&&z.matrixWorld.determinant()<0,Pt=us(E,k,Z,q,z);B.setMaterial(q,Et);let Lt=Z.index,Nt=1;if(q.wireframe===!0){if(Lt=nt.getWireframeAttribute(Z),Lt===void 0)return;Nt=2}const zt=Z.drawRange,Dt=Z.attributes.position;let qt=zt.start*Nt,te=(zt.start+zt.count)*Nt;mt!==null&&(qt=Math.max(qt,mt.start*Nt),te=Math.min(te,(mt.start+mt.count)*Nt)),Lt!==null?(qt=Math.max(qt,0),te=Math.min(te,Lt.count)):Dt!=null&&(qt=Math.max(qt,0),te=Math.min(te,Dt.count));const ee=te-qt;if(ee<0||ee===1/0)return;Zt.setup(z,q,Pt,Z,Lt);let fe,Jt=St;if(Lt!==null&&(fe=K.get(Lt),Jt=Vt,Jt.setIndex(fe)),z.isMesh)q.wireframe===!0?(B.setLineWidth(q.wireframeLinewidth*Yt()),Jt.setMode(T.LINES)):Jt.setMode(T.TRIANGLES);else if(z.isLine){let Tt=q.linewidth;Tt===void 0&&(Tt=1),B.setLineWidth(Tt*Yt()),z.isLineSegments?Jt.setMode(T.LINES):z.isLineLoop?Jt.setMode(T.LINE_LOOP):Jt.setMode(T.LINE_STRIP)}else z.isPoints?Jt.setMode(T.POINTS):z.isSprite&&Jt.setMode(T.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Jt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(tt.get("WEBGL_multi_draw"))Jt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Tt=z._multiDrawStarts,Ge=z._multiDrawCounts,Qt=z._multiDrawCount,De=Lt?K.get(Lt).bytesPerElement:1,Sn=Q.get(q).currentProgram.getUniforms();for(let pe=0;pe<Qt;pe++)Sn.setValue(T,"_gl_DrawID",pe),Jt.render(Tt[pe]/De,Ge[pe])}else if(z.isInstancedMesh)Jt.renderInstances(qt,ee,z.count);else if(Z.isInstancedBufferGeometry){const Tt=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Ge=Math.min(Z.instanceCount,Tt);Jt.renderInstances(qt,ee,Ge)}else Jt.render(qt,ee)};function $t(E,k,Z){E.transparent===!0&&E.side===Te&&E.forceSinglePass===!1?(E.side=Pe,E.needsUpdate=!0,ri(E,k,Z),E.side=Nn,E.needsUpdate=!0,ri(E,k,Z),E.side=Te):ri(E,k,Z)}this.compile=function(E,k,Z=null){Z===null&&(Z=E),p=Bt.get(Z),p.init(k),y.push(p),Z.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),E!==Z&&E.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();const q=new Set;return E.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const mt=z.material;if(mt)if(Array.isArray(mt))for(let Et=0;Et<mt.length;Et++){const Pt=mt[Et];$t(Pt,Z,z),q.add(Pt)}else $t(mt,Z,z),q.add(mt)}),y.pop(),p=null,q},this.compileAsync=function(E,k,Z=null){const q=this.compile(E,k,Z);return new Promise(z=>{function mt(){if(q.forEach(function(Et){Q.get(Et).currentProgram.isReady()&&q.delete(Et)}),q.size===0){z(E);return}setTimeout(mt,10)}tt.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let Kt=null;function ue(E){Kt&&Kt(E)}function kn(){on.stop()}function si(){on.start()}const on=new Gl;on.setAnimationLoop(ue),typeof self<"u"&&on.setContext(self),this.setAnimationLoop=function(E){Kt=E,D.setAnimationLoop(E),E===null?on.stop():on.start()},D.addEventListener("sessionstart",kn),D.addEventListener("sessionend",si),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),D.enabled===!0&&D.isPresenting===!0&&(D.cameraAutoUpdate===!0&&D.updateCamera(k),k=D.getCamera()),E.isScene===!0&&E.onBeforeRender(M,E,k,P),p=Bt.get(E,y.length),p.init(k),y.push(p),pt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),j.setFromProjectionMatrix(pt),ft=this.localClippingEnabled,it=ct.init(this.clippingPlanes,ft),m=_t.get(E,x.length),m.init(),x.push(m),D.enabled===!0&&D.isPresenting===!0){const mt=M.xr.getDepthSensingMesh();mt!==null&&Hi(mt,k,-1/0,M.sortObjects)}Hi(E,k,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(at,ot),wt=D.enabled===!1||D.isPresenting===!1||D.hasDepthSensing()===!1,wt&&Ct.addToRenderList(m,E),this.info.render.frame++,it===!0&&ct.beginShadows();const Z=p.state.shadowsArray;yt.render(Z,E,k),it===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();const q=m.opaque,z=m.transmissive;if(p.setupLights(),k.isArrayCamera){const mt=k.cameras;if(z.length>0)for(let Et=0,Pt=mt.length;Et<Pt;Et++){const Lt=mt[Et];cs(q,z,E,Lt)}wt&&Ct.render(E);for(let Et=0,Pt=mt.length;Et<Pt;Et++){const Lt=mt[Et];os(m,E,Lt,Lt.viewport)}}else z.length>0&&cs(q,z,E,k),wt&&Ct.render(E),os(m,E,k);P!==null&&(A.updateMultisampleRenderTarget(P),A.updateRenderTargetMipmap(P)),E.isScene===!0&&E.onAfterRender(M,E,k),Zt.resetDefaultState(),b=-1,S=null,y.pop(),y.length>0?(p=y[y.length-1],it===!0&&ct.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Hi(E,k,Z,q){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)Z=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||j.intersectsSprite(E)){q&&It.setFromMatrixPosition(E.matrixWorld).applyMatrix4(pt);const Et=J.update(E),Pt=E.material;Pt.visible&&m.push(E,Et,Pt,Z,It.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||j.intersectsObject(E))){const Et=J.update(E),Pt=E.material;if(q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),It.copy(E.boundingSphere.center)):(Et.boundingSphere===null&&Et.computeBoundingSphere(),It.copy(Et.boundingSphere.center)),It.applyMatrix4(E.matrixWorld).applyMatrix4(pt)),Array.isArray(Pt)){const Lt=Et.groups;for(let Nt=0,zt=Lt.length;Nt<zt;Nt++){const Dt=Lt[Nt],qt=Pt[Dt.materialIndex];qt&&qt.visible&&m.push(E,Et,qt,Z,It.z,Dt)}}else Pt.visible&&m.push(E,Et,Pt,Z,It.z,null)}}const mt=E.children;for(let Et=0,Pt=mt.length;Et<Pt;Et++)Hi(mt[Et],k,Z,q)}function os(E,k,Z,q){const z=E.opaque,mt=E.transmissive,Et=E.transparent;p.setupLightsView(Z),it===!0&&ct.setGlobalState(M.clippingPlanes,Z),q&&B.viewport(R.copy(q)),z.length>0&&ai(z,k,Z),mt.length>0&&ai(mt,k,Z),Et.length>0&&ai(Et,k,Z),B.buffers.depth.setTest(!0),B.buffers.depth.setMask(!0),B.buffers.color.setMask(!0),B.setPolygonOffset(!1)}function cs(E,k,Z,q){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new ni(1,1,{generateMipmaps:!0,type:tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float")?ss:yn,minFilter:Jn,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:jt.workingColorSpace}));const mt=p.state.transmissionRenderTarget[q.id],Et=q.viewport||R;mt.setSize(Et.z,Et.w);const Pt=M.getRenderTarget();M.setRenderTarget(mt),M.getClearColor(X),G=M.getClearAlpha(),G<1&&M.setClearColor(16777215,.5),M.clear(),wt&&Ct.render(Z);const Lt=M.toneMapping;M.toneMapping=In;const Nt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),it===!0&&ct.setGlobalState(M.clippingPlanes,q),ai(E,Z,q),A.updateMultisampleRenderTarget(mt),A.updateRenderTargetMipmap(mt),tt.has("WEBGL_multisampled_render_to_texture")===!1){let zt=!1;for(let Dt=0,qt=k.length;Dt<qt;Dt++){const te=k[Dt],ee=te.object,fe=te.geometry,Jt=te.material,Tt=te.group;if(Jt.side===Te&&ee.layers.test(q.layers)){const Ge=Jt.side;Jt.side=Pe,Jt.needsUpdate=!0,ls(ee,Z,q,fe,Jt,Tt),Jt.side=Ge,Jt.needsUpdate=!0,zt=!0}}zt===!0&&(A.updateMultisampleRenderTarget(mt),A.updateRenderTargetMipmap(mt))}M.setRenderTarget(Pt),M.setClearColor(X,G),Nt!==void 0&&(q.viewport=Nt),M.toneMapping=Lt}function ai(E,k,Z){const q=k.isScene===!0?k.overrideMaterial:null;for(let z=0,mt=E.length;z<mt;z++){const Et=E[z],Pt=Et.object,Lt=Et.geometry,Nt=q===null?Et.material:q,zt=Et.group;Pt.layers.test(Z.layers)&&ls(Pt,k,Z,Lt,Nt,zt)}}function ls(E,k,Z,q,z,mt){E.onBeforeRender(M,k,Z,q,z,mt),E.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),z.onBeforeRender(M,k,Z,q,E,mt),z.transparent===!0&&z.side===Te&&z.forceSinglePass===!1?(z.side=Pe,z.needsUpdate=!0,M.renderBufferDirect(Z,k,q,z,E,mt),z.side=Nn,z.needsUpdate=!0,M.renderBufferDirect(Z,k,q,z,E,mt),z.side=Te):M.renderBufferDirect(Z,k,q,z,E,mt),E.onAfterRender(M,k,Z,q,z,mt)}function ri(E,k,Z){k.isScene!==!0&&(k=Ft);const q=Q.get(E),z=p.state.lights,mt=p.state.shadowsArray,Et=z.state.version,Pt=st.getParameters(E,z.state,mt,k,Z),Lt=st.getProgramCacheKey(Pt);let Nt=q.programs;q.environment=E.isMeshStandardMaterial?k.environment:null,q.fog=k.fog,q.envMap=(E.isMeshStandardMaterial?U:v).get(E.envMap||q.environment),q.envMapRotation=q.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,Nt===void 0&&(E.addEventListener("dispose",vt),Nt=new Map,q.programs=Nt);let zt=Nt.get(Lt);if(zt!==void 0){if(q.currentProgram===zt&&q.lightsStateVersion===Et)return ds(E,Pt),zt}else Pt.uniforms=st.getUniforms(E),E.onBeforeCompile(Pt,M),zt=st.acquireProgram(Pt,Lt),Nt.set(Lt,zt),q.uniforms=Pt.uniforms;const Dt=q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Dt.clippingPlanes=ct.uniform),ds(E,Pt),q.needsLights=Ma(E),q.lightsStateVersion=Et,q.needsLights&&(Dt.ambientLightColor.value=z.state.ambient,Dt.lightProbe.value=z.state.probe,Dt.directionalLights.value=z.state.directional,Dt.directionalLightShadows.value=z.state.directionalShadow,Dt.spotLights.value=z.state.spot,Dt.spotLightShadows.value=z.state.spotShadow,Dt.rectAreaLights.value=z.state.rectArea,Dt.ltc_1.value=z.state.rectAreaLTC1,Dt.ltc_2.value=z.state.rectAreaLTC2,Dt.pointLights.value=z.state.point,Dt.pointLightShadows.value=z.state.pointShadow,Dt.hemisphereLights.value=z.state.hemi,Dt.directionalShadowMap.value=z.state.directionalShadowMap,Dt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Dt.spotShadowMap.value=z.state.spotShadowMap,Dt.spotLightMatrix.value=z.state.spotLightMatrix,Dt.spotLightMap.value=z.state.spotLightMap,Dt.pointShadowMap.value=z.state.pointShadowMap,Dt.pointShadowMatrix.value=z.state.pointShadowMatrix),q.currentProgram=zt,q.uniformsList=null,zt}function hs(E){if(E.uniformsList===null){const k=E.currentProgram.getUniforms();E.uniformsList=ea.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function ds(E,k){const Z=Q.get(E);Z.outputColorSpace=k.outputColorSpace,Z.batching=k.batching,Z.batchingColor=k.batchingColor,Z.instancing=k.instancing,Z.instancingColor=k.instancingColor,Z.instancingMorph=k.instancingMorph,Z.skinning=k.skinning,Z.morphTargets=k.morphTargets,Z.morphNormals=k.morphNormals,Z.morphColors=k.morphColors,Z.morphTargetsCount=k.morphTargetsCount,Z.numClippingPlanes=k.numClippingPlanes,Z.numIntersection=k.numClipIntersection,Z.vertexAlphas=k.vertexAlphas,Z.vertexTangents=k.vertexTangents,Z.toneMapping=k.toneMapping}function us(E,k,Z,q,z){k.isScene!==!0&&(k=Ft),A.resetTextureUnits();const mt=k.fog,Et=q.isMeshStandardMaterial?k.environment:null,Pt=P===null?M.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:zi,Lt=(q.isMeshStandardMaterial?U:v).get(q.envMap||Et),Nt=q.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,zt=!!Z.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Dt=!!Z.morphAttributes.position,qt=!!Z.morphAttributes.normal,te=!!Z.morphAttributes.color;let ee=In;q.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(ee=M.toneMapping);const fe=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Jt=fe!==void 0?fe.length:0,Tt=Q.get(q),Ge=p.state.lights;if(it===!0&&(ft===!0||E!==S)){const Ue=E===S&&q.id===b;ct.setState(q,E,Ue)}let Qt=!1;q.version===Tt.__version?(Tt.needsLights&&Tt.lightsStateVersion!==Ge.state.version||Tt.outputColorSpace!==Pt||z.isBatchedMesh&&Tt.batching===!1||!z.isBatchedMesh&&Tt.batching===!0||z.isBatchedMesh&&Tt.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Tt.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Tt.instancing===!1||!z.isInstancedMesh&&Tt.instancing===!0||z.isSkinnedMesh&&Tt.skinning===!1||!z.isSkinnedMesh&&Tt.skinning===!0||z.isInstancedMesh&&Tt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Tt.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Tt.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Tt.instancingMorph===!1&&z.morphTexture!==null||Tt.envMap!==Lt||q.fog===!0&&Tt.fog!==mt||Tt.numClippingPlanes!==void 0&&(Tt.numClippingPlanes!==ct.numPlanes||Tt.numIntersection!==ct.numIntersection)||Tt.vertexAlphas!==Nt||Tt.vertexTangents!==zt||Tt.morphTargets!==Dt||Tt.morphNormals!==qt||Tt.morphColors!==te||Tt.toneMapping!==ee||Tt.morphTargetsCount!==Jt)&&(Qt=!0):(Qt=!0,Tt.__version=q.version);let De=Tt.currentProgram;Qt===!0&&(De=ri(q,k,z));let Sn=!1,pe=!1,zn=!1;const ae=De.getUniforms(),Ie=Tt.uniforms;if(B.useProgram(De.program)&&(Sn=!0,pe=!0,zn=!0),q.id!==b&&(b=q.id,pe=!0),Sn||S!==E){B.buffers.depth.getReversed()?(dt.copy(E.projectionMatrix),ku(dt),zu(dt),ae.setValue(T,"projectionMatrix",dt)):ae.setValue(T,"projectionMatrix",E.projectionMatrix),ae.setValue(T,"viewMatrix",E.matrixWorldInverse);const je=ae.map.cameraPosition;je!==void 0&&je.setValue(T,Rt.setFromMatrixPosition(E.matrixWorld)),xt.logarithmicDepthBuffer&&ae.setValue(T,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&ae.setValue(T,"isOrthographic",E.isOrthographicCamera===!0),S!==E&&(S=E,pe=!0,zn=!0)}if(z.isSkinnedMesh){ae.setOptional(T,z,"bindMatrix"),ae.setOptional(T,z,"bindMatrixInverse");const Ue=z.skeleton;Ue&&(Ue.boneTexture===null&&Ue.computeBoneTexture(),ae.setValue(T,"boneTexture",Ue.boneTexture,A))}z.isBatchedMesh&&(ae.setOptional(T,z,"batchingTexture"),ae.setValue(T,"batchingTexture",z._matricesTexture,A),ae.setOptional(T,z,"batchingIdTexture"),ae.setValue(T,"batchingIdTexture",z._indirectTexture,A),ae.setOptional(T,z,"batchingColorTexture"),z._colorsTexture!==null&&ae.setValue(T,"batchingColorTexture",z._colorsTexture,A));const bn=Z.morphAttributes;if((bn.position!==void 0||bn.normal!==void 0||bn.color!==void 0)&&Ut.update(z,Z,De),(pe||Tt.receiveShadow!==z.receiveShadow)&&(Tt.receiveShadow=z.receiveShadow,ae.setValue(T,"receiveShadow",z.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Ie.envMap.value=Lt,Ie.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&k.environment!==null&&(Ie.envMapIntensity.value=k.environmentIntensity),pe&&(ae.setValue(T,"toneMappingExposure",M.toneMappingExposure),Tt.needsLights&&fs(Ie,zn),mt&&q.fog===!0&&ht.refreshFogUniforms(Ie,mt),ht.refreshMaterialUniforms(Ie,q,Y,$,p.state.transmissionRenderTarget[E.id]),ea.upload(T,hs(Tt),Ie,A)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(ea.upload(T,hs(Tt),Ie,A),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&ae.setValue(T,"center",z.center),ae.setValue(T,"modelViewMatrix",z.modelViewMatrix),ae.setValue(T,"normalMatrix",z.normalMatrix),ae.setValue(T,"modelMatrix",z.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const Ue=q.uniformsGroups;for(let je=0,Ke=Ue.length;je<Ke;je++){const Vi=Ue[je];I.update(Vi,De),I.bind(Vi,De)}}return De}function fs(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function Ma(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(E,k,Z){Q.get(E.texture).__webglTexture=k,Q.get(E.depthTexture).__webglTexture=Z;const q=Q.get(E);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=Z===void 0,q.__autoAllocateDepthBuffer||tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,k){const Z=Q.get(E);Z.__webglFramebuffer=k,Z.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,Z=0){P=E,C=k,w=Z;let q=!0,z=null,mt=!1,Et=!1;if(E){const Lt=Q.get(E);if(Lt.__useDefaultFramebuffer!==void 0)B.bindFramebuffer(T.FRAMEBUFFER,null),q=!1;else if(Lt.__webglFramebuffer===void 0)A.setupRenderTarget(E);else if(Lt.__hasExternalTextures)A.rebindTextures(E,Q.get(E.texture).__webglTexture,Q.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Dt=E.depthTexture;if(Lt.__boundDepthTexture!==Dt){if(Dt!==null&&Q.has(Dt)&&(E.width!==Dt.image.width||E.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(E)}}const Nt=E.texture;(Nt.isData3DTexture||Nt.isDataArrayTexture||Nt.isCompressedArrayTexture)&&(Et=!0);const zt=Q.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(zt[k])?z=zt[k][Z]:z=zt[k],mt=!0):E.samples>0&&A.useMultisampledRTT(E)===!1?z=Q.get(E).__webglMultisampledFramebuffer:Array.isArray(zt)?z=zt[Z]:z=zt,R.copy(E.viewport),W.copy(E.scissor),H=E.scissorTest}else R.copy(ut).multiplyScalar(Y).floor(),W.copy(At).multiplyScalar(Y).floor(),H=bt;if(B.bindFramebuffer(T.FRAMEBUFFER,z)&&q&&B.drawBuffers(E,z),B.viewport(R),B.scissor(W),B.setScissorTest(H),mt){const Lt=Q.get(E.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_CUBE_MAP_POSITIVE_X+k,Lt.__webglTexture,Z)}else if(Et){const Lt=Q.get(E.texture),Nt=k||0;T.framebufferTextureLayer(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,Lt.__webglTexture,Z||0,Nt)}b=-1},this.readRenderTargetPixels=function(E,k,Z,q,z,mt,Et){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=Q.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Et!==void 0&&(Pt=Pt[Et]),Pt){B.bindFramebuffer(T.FRAMEBUFFER,Pt);try{const Lt=E.texture,Nt=Lt.format,zt=Lt.type;if(!xt.textureFormatReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!xt.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-q&&Z>=0&&Z<=E.height-z&&T.readPixels(k,Z,q,z,kt.convert(Nt),kt.convert(zt),mt)}finally{const Lt=P!==null?Q.get(P).__webglFramebuffer:null;B.bindFramebuffer(T.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(E,k,Z,q,z,mt,Et){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=Q.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Et!==void 0&&(Pt=Pt[Et]),Pt){const Lt=E.texture,Nt=Lt.format,zt=Lt.type;if(!xt.textureFormatReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!xt.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=E.width-q&&Z>=0&&Z<=E.height-z){B.bindFramebuffer(T.FRAMEBUFFER,Pt);const Dt=T.createBuffer();T.bindBuffer(T.PIXEL_PACK_BUFFER,Dt),T.bufferData(T.PIXEL_PACK_BUFFER,mt.byteLength,T.STREAM_READ),T.readPixels(k,Z,q,z,kt.convert(Nt),kt.convert(zt),0);const qt=P!==null?Q.get(P).__webglFramebuffer:null;B.bindFramebuffer(T.FRAMEBUFFER,qt);const te=T.fenceSync(T.SYNC_GPU_COMMANDS_COMPLETE,0);return T.flush(),await Fu(T,te,4),T.bindBuffer(T.PIXEL_PACK_BUFFER,Dt),T.getBufferSubData(T.PIXEL_PACK_BUFFER,0,mt),T.deleteBuffer(Dt),T.deleteSync(te),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,k=null,Z=0){E.isTexture!==!0&&(Ki("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,E=arguments[1]);const q=Math.pow(2,-Z),z=Math.floor(E.image.width*q),mt=Math.floor(E.image.height*q),Et=k!==null?k.x:0,Pt=k!==null?k.y:0;A.setTexture2D(E,0),T.copyTexSubImage2D(T.TEXTURE_2D,Z,0,0,Et,Pt,z,mt),B.unbindTexture()},this.copyTextureToTexture=function(E,k,Z=null,q=null,z=0){E.isTexture!==!0&&(Ki("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,E=arguments[1],k=arguments[2],z=arguments[3]||0,Z=null);let mt,Et,Pt,Lt,Nt,zt,Dt,qt,te;const ee=E.isCompressedTexture?E.mipmaps[z]:E.image;Z!==null?(mt=Z.max.x-Z.min.x,Et=Z.max.y-Z.min.y,Pt=Z.isBox3?Z.max.z-Z.min.z:1,Lt=Z.min.x,Nt=Z.min.y,zt=Z.isBox3?Z.min.z:0):(mt=ee.width,Et=ee.height,Pt=ee.depth||1,Lt=0,Nt=0,zt=0),q!==null?(Dt=q.x,qt=q.y,te=q.z):(Dt=0,qt=0,te=0);const fe=kt.convert(k.format),Jt=kt.convert(k.type);let Tt;k.isData3DTexture?(A.setTexture3D(k,0),Tt=T.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(A.setTexture2DArray(k,0),Tt=T.TEXTURE_2D_ARRAY):(A.setTexture2D(k,0),Tt=T.TEXTURE_2D),T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,k.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,k.unpackAlignment);const Ge=T.getParameter(T.UNPACK_ROW_LENGTH),Qt=T.getParameter(T.UNPACK_IMAGE_HEIGHT),De=T.getParameter(T.UNPACK_SKIP_PIXELS),Sn=T.getParameter(T.UNPACK_SKIP_ROWS),pe=T.getParameter(T.UNPACK_SKIP_IMAGES);T.pixelStorei(T.UNPACK_ROW_LENGTH,ee.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,ee.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Lt),T.pixelStorei(T.UNPACK_SKIP_ROWS,Nt),T.pixelStorei(T.UNPACK_SKIP_IMAGES,zt);const zn=E.isDataArrayTexture||E.isData3DTexture,ae=k.isDataArrayTexture||k.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const Ie=Q.get(E),bn=Q.get(k),Ue=Q.get(Ie.__renderTarget),je=Q.get(bn.__renderTarget);B.bindFramebuffer(T.READ_FRAMEBUFFER,Ue.__webglFramebuffer),B.bindFramebuffer(T.DRAW_FRAMEBUFFER,je.__webglFramebuffer);for(let Ke=0;Ke<Pt;Ke++)zn&&T.framebufferTextureLayer(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,Q.get(E).__webglTexture,z,zt+Ke),E.isDepthTexture?(ae&&T.framebufferTextureLayer(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,Q.get(k).__webglTexture,z,te+Ke),T.blitFramebuffer(Lt,Nt,mt,Et,Dt,qt,mt,Et,T.DEPTH_BUFFER_BIT,T.NEAREST)):ae?T.copyTexSubImage3D(Tt,z,Dt,qt,te+Ke,Lt,Nt,mt,Et):T.copyTexSubImage2D(Tt,z,Dt,qt,te+Ke,Lt,Nt,mt,Et);B.bindFramebuffer(T.READ_FRAMEBUFFER,null),B.bindFramebuffer(T.DRAW_FRAMEBUFFER,null)}else ae?E.isDataTexture||E.isData3DTexture?T.texSubImage3D(Tt,z,Dt,qt,te,mt,Et,Pt,fe,Jt,ee.data):k.isCompressedArrayTexture?T.compressedTexSubImage3D(Tt,z,Dt,qt,te,mt,Et,Pt,fe,ee.data):T.texSubImage3D(Tt,z,Dt,qt,te,mt,Et,Pt,fe,Jt,ee):E.isDataTexture?T.texSubImage2D(T.TEXTURE_2D,z,Dt,qt,mt,Et,fe,Jt,ee.data):E.isCompressedTexture?T.compressedTexSubImage2D(T.TEXTURE_2D,z,Dt,qt,ee.width,ee.height,fe,ee.data):T.texSubImage2D(T.TEXTURE_2D,z,Dt,qt,mt,Et,fe,Jt,ee);T.pixelStorei(T.UNPACK_ROW_LENGTH,Ge),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Qt),T.pixelStorei(T.UNPACK_SKIP_PIXELS,De),T.pixelStorei(T.UNPACK_SKIP_ROWS,Sn),T.pixelStorei(T.UNPACK_SKIP_IMAGES,pe),z===0&&k.generateMipmaps&&T.generateMipmap(Tt),B.unbindTexture()},this.copyTextureToTexture3D=function(E,k,Z=null,q=null,z=0){return E.isTexture!==!0&&(Ki("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Z=arguments[0]||null,q=arguments[1]||null,E=arguments[2],k=arguments[3],z=arguments[4]||0),Ki('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,k,Z,q,z)},this.initRenderTarget=function(E){Q.get(E).__webglFramebuffer===void 0&&A.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?A.setTextureCube(E,0):E.isData3DTexture?A.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?A.setTexture2DArray(E,0):A.setTexture2D(E,0),B.unbindTexture()},this.resetState=function(){C=0,w=0,P=null,B.reset(),Zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=jt._getUnpackColorSpace()}}class q0 extends he{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new an,this.environmentIntensity=1,this.environmentRotation=new an,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class j0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ro,this.updateRanges=[],this.version=0,this.uuid=Un()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const be=new O;class la{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=en(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=en(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=en(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=en(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=en(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),a=ie(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new qe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new la(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class jl extends ii{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Ot(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let bi;const Yi=new O,Ei=new O,Ai=new O,Ti=new Ht,Zi=new Ht,Kl=new oe,zs=new O,qi=new O,Os=new O,Kc=new Ht,nr=new Ht,Jc=new Ht;class K0 extends he{constructor(t=new jl){if(super(),this.isSprite=!0,this.type="Sprite",bi===void 0){bi=new Le;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new j0(e,5);bi.setIndex([0,1,2,0,2,3]),bi.setAttribute("position",new la(n,3,0,!1)),bi.setAttribute("uv",new la(n,2,3,!1))}this.geometry=bi,this.material=t,this.center=new Ht(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ei.setFromMatrixScale(this.matrixWorld),Kl.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ai.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ei.multiplyScalar(-Ai.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;Bs(zs.set(-.5,-.5,0),Ai,r,Ei,s,a),Bs(qi.set(.5,-.5,0),Ai,r,Ei,s,a),Bs(Os.set(.5,.5,0),Ai,r,Ei,s,a),Kc.set(0,0),nr.set(1,0),Jc.set(1,1);let o=t.ray.intersectTriangle(zs,qi,Os,!1,Yi);if(o===null&&(Bs(qi.set(-.5,.5,0),Ai,r,Ei,s,a),nr.set(0,1),o=t.ray.intersectTriangle(zs,Os,qi,!1,Yi),o===null))return;const c=t.ray.origin.distanceTo(Yi);c<t.near||c>t.far||e.push({distance:c,point:Yi.clone(),uv:ke.getInterpolation(Yi,zs,qi,Os,Kc,nr,Jc,new Ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Bs(i,t,e,n,s,a){Ti.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Zi.x=a*Ti.x-s*Ti.y,Zi.y=s*Ti.x+a*Ti.y):Zi.copy(Ti),i.copy(t),i.x+=Zi.x,i.y+=Zi.y,i.applyMatrix4(Kl)}class Do extends ii{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Ot(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ha=new O,da=new O,Qc=new oe,ji=new Ro,Hs=new ga,ir=new O,tl=new O;class J0 extends he{constructor(t=new Le,e=new Do){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,a=e.count;s<a;s++)ha.fromBufferAttribute(e,s-1),da.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=ha.distanceTo(da);t.setAttribute("lineDistance",new de(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Hs.copy(n.boundingSphere),Hs.applyMatrix4(s),Hs.radius+=a,t.ray.intersectsSphere(Hs)===!1)return;Qc.copy(s).invert(),ji.copy(t.ray).applyMatrix4(Qc);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){const h=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let _=h,m=g-1;_<m;_+=l){const p=d.getX(_),x=d.getX(_+1),y=Vs(this,t,ji,c,p,x);y&&e.push(y)}if(this.isLineLoop){const _=d.getX(g-1),m=d.getX(h),p=Vs(this,t,ji,c,_,m);p&&e.push(p)}}else{const h=Math.max(0,r.start),g=Math.min(f.count,r.start+r.count);for(let _=h,m=g-1;_<m;_+=l){const p=Vs(this,t,ji,c,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=Vs(this,t,ji,c,g-1,h);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Vs(i,t,e,n,s,a){const r=i.geometry.attributes.position;if(ha.fromBufferAttribute(r,s),da.fromBufferAttribute(r,a),e.distanceSqToSegment(ha,da,ir,tl)>n)return;ir.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(ir);if(!(c<t.near||c>t.far))return{distance:c,point:tl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const el=new O,nl=new O;class Jl extends J0{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,a=e.count;s<a;s+=2)el.fromBufferAttribute(e,s),nl.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+el.distanceTo(nl);t.setAttribute("lineDistance",new de(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Q0 extends Re{constructor(t,e,n,s,a,r,o,c,l){super(t,e,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Io extends Le{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const a=[],r=[];o(s),l(n),d(),this.setAttribute("position",new de(a,3)),this.setAttribute("normal",new de(a.slice(),3)),this.setAttribute("uv",new de(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const y=new O,M=new O,L=new O;for(let C=0;C<e.length;C+=3)h(e[C+0],y),h(e[C+1],M),h(e[C+2],L),c(y,M,L,x)}function c(x,y,M,L){const C=L+1,w=[];for(let P=0;P<=C;P++){w[P]=[];const b=x.clone().lerp(M,P/C),S=y.clone().lerp(M,P/C),R=C-P;for(let W=0;W<=R;W++)W===0&&P===C?w[P][W]=b:w[P][W]=b.clone().lerp(S,W/R)}for(let P=0;P<C;P++)for(let b=0;b<2*(C-P)-1;b++){const S=Math.floor(b/2);b%2===0?(f(w[P][S+1]),f(w[P+1][S]),f(w[P][S])):(f(w[P][S+1]),f(w[P+1][S+1]),f(w[P+1][S]))}}function l(x){const y=new O;for(let M=0;M<a.length;M+=3)y.x=a[M+0],y.y=a[M+1],y.z=a[M+2],y.normalize().multiplyScalar(x),a[M+0]=y.x,a[M+1]=y.y,a[M+2]=y.z}function d(){const x=new O;for(let y=0;y<a.length;y+=3){x.x=a[y+0],x.y=a[y+1],x.z=a[y+2];const M=m(x)/2/Math.PI+.5,L=p(x)/Math.PI+.5;r.push(M,1-L)}g(),u()}function u(){for(let x=0;x<r.length;x+=6){const y=r[x+0],M=r[x+2],L=r[x+4],C=Math.max(y,M,L),w=Math.min(y,M,L);C>.9&&w<.1&&(y<.2&&(r[x+0]+=1),M<.2&&(r[x+2]+=1),L<.2&&(r[x+4]+=1))}}function f(x){a.push(x.x,x.y,x.z)}function h(x,y){const M=x*3;y.x=t[M+0],y.y=t[M+1],y.z=t[M+2]}function g(){const x=new O,y=new O,M=new O,L=new O,C=new Ht,w=new Ht,P=new Ht;for(let b=0,S=0;b<a.length;b+=9,S+=6){x.set(a[b+0],a[b+1],a[b+2]),y.set(a[b+3],a[b+4],a[b+5]),M.set(a[b+6],a[b+7],a[b+8]),C.set(r[S+0],r[S+1]),w.set(r[S+2],r[S+3]),P.set(r[S+4],r[S+5]),L.copy(x).add(y).add(M).divideScalar(3);const R=m(L);_(C,S+0,x,R),_(w,S+2,y,R),_(P,S+4,M,R)}}function _(x,y,M,L){L<0&&x.x===1&&(r[y]=x.x-1),M.x===0&&M.z===0&&(r[y]=L/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Io(t.vertices,t.indices,t.radius,t.details)}}const Gs=new O,Ws=new O,sr=new O,Xs=new ke;class t_ extends Le{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(ta*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],d=["a","b","c"],u=new Array(3),f={},h=[];for(let g=0;g<c;g+=3){r?(l[0]=r.getX(g),l[1]=r.getX(g+1),l[2]=r.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:p}=Xs;if(_.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),p.fromBufferAttribute(o,l[2]),Xs.getNormal(sr),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let x=0;x<3;x++){const y=(x+1)%3,M=u[x],L=u[y],C=Xs[d[x]],w=Xs[d[y]],P=`${M}_${L}`,b=`${L}_${M}`;b in f&&f[b]?(sr.dot(f[b].normal)<=a&&(h.push(C.x,C.y,C.z),h.push(w.x,w.y,w.z)),f[b]=null):P in f||(f[P]={index0:l[x],index1:l[y],normal:sr.clone()})}}for(const g in f)if(f[g]){const{index0:_,index1:m}=f[g];Gs.fromBufferAttribute(o,_),Ws.fromBufferAttribute(o,m),h.push(Gs.x,Gs.y,Gs.z),h.push(Ws.x,Ws.y,Ws.z)}this.setAttribute("position",new de(h,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Uo extends Io{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Uo(t.radius,t.detail)}}class Ri extends Le{constructor(t=.5,e=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],d=[];let u=t;const f=(e-t)/s,h=new O,g=new Ht;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const p=a+m/n*r;h.x=u*Math.cos(p),h.y=u*Math.sin(p),c.push(h.x,h.y,h.z),l.push(0,0,1),g.x=(h.x/e+1)/2,g.y=(h.y/e+1)/2,d.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){const m=_*(n+1);for(let p=0;p<n;p++){const x=p+m,y=x,M=x+n+1,L=x+n+2,C=x+1;o.push(y,M,C),o.push(M,L,C)}}this.setIndex(o),this.setAttribute("position",new de(c,3)),this.setAttribute("normal",new de(l,3)),this.setAttribute("uv",new de(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ri(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class va extends Le{constructor(t=1,e=.4,n=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:a},n=Math.floor(n),s=Math.floor(s);const r=[],o=[],c=[],l=[],d=new O,u=new O,f=new O;for(let h=0;h<=n;h++)for(let g=0;g<=s;g++){const _=g/s*a,m=h/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(h/n)}for(let h=1;h<=n;h++)for(let g=1;g<=s;g++){const _=(s+1)*h+g-1,m=(s+1)*(h-1)+g-1,p=(s+1)*(h-1)+g,x=(s+1)*h+g;r.push(_,m,x),r.push(m,p,x)}this.setIndex(r),this.setAttribute("position",new de(o,3)),this.setAttribute("normal",new de(c,3)),this.setAttribute("uv",new de(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new va(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class is extends ii{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dl,this.normalScale=new Ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new an,this.combine=yo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ql extends he{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ot(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class e_ extends Ql{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ot(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ar=new oe,il=new O,sl=new O;class n_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ht(512,512),this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Po,this._frameExtents=new Ht(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;il.setFromMatrixPosition(t.matrixWorld),e.position.copy(il),sl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(sl),e.updateMatrixWorld(),ar.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ar),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ar)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class i_ extends n_{constructor(){super(new Wl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class s_ extends Ql{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.target=new he,this.shadow=new i_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const al=new oe;class a_{constructor(t,e,n=0,s=1/0){this.ray=new Ro(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Co,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return al.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(al),this}intersectObject(t,e=!0,n=[]){return lo(t,this,n,e),n.sort(rl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,a=t.length;s<a;s++)lo(t[s],this,n,e);return n.sort(rl),n}}function rl(i,t){return i.distance-t.distance}function lo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const a=i.children;for(let r=0,o=a.length;r<o;r++)lo(a[r],t,e,!0)}}class r_ extends Jl{constructor(t=10,e=10,n=4473924,s=8947848){n=new Ot(n),s=new Ot(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let f=0,h=0,g=-o;f<=e;f++,g+=r){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=f===a?n:s;_.toArray(l,h),h+=3,_.toArray(l,h),h+=3,_.toArray(l,h),h+=3,_.toArray(l,h),h+=3}const d=new Le;d.setAttribute("position",new de(c,3)),d.setAttribute("color",new de(l,3));const u=new Do({vertexColors:!0,toneMapped:!1});super(d,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Mo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Mo);const o_={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function c_(i,t,e,n){const s=new Be(i.fov,n,.1,200),a=new O,r=new O,o=new O;let c=!1,l=i.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1;function f(){const h=(i.pitchDeg+d.pitchDelta)*Math.PI/180,g=i.yawDeg*Math.PI/180;o.set(Math.sin(g)*Math.cos(h),Math.sin(h),Math.cos(g)*Math.cos(h)).multiplyScalar(i.distance*d.distanceScale*d.zoom)}return f(),{camera:s,update(h,g,_,m,p=o_){const x=g+.6;if(!c)a.set(h,x,_),c=!0;else{const L=1-Math.exp(-Math.max(i.smoothing,.001)*m);a.x+=(h-a.x)*L,a.y+=(x-a.y)*L,a.z+=(_-a.z)*L}const y=1-Math.exp(-Math.max(t.smoothing,.001)*m);d.distanceScale+=(p.distanceScale-d.distanceScale)*y,d.offsetX+=(p.offsetX-d.offsetX)*y,d.offsetZ+=(p.offsetZ-d.offsetZ)*y,d.pitchDelta+=(p.pitchDelta-d.pitchDelta)*y;const M=1-Math.exp(-Math.max(e.smoothing,.001)*m);d.zoom+=(u-d.zoom)*M,f(),(s.fov!==l||s.fov!==i.fov)&&(s.fov=i.fov,l=i.fov,s.updateProjectionMatrix()),r.set(a.x+d.offsetX,a.y,a.z+d.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(h){s.aspect=h,s.updateProjectionMatrix()},getGroundBasis(){const h=new O().setFromMatrixColumn(s.matrixWorld,0),g=new O().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(h.x,h.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:h.x/_,rightZ:h.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(h){u=Number.isFinite(h)&&h>0?h:1},smart(){return{...d}}}}const $s=Math.PI*2,Ys=1e-6;function l_(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function h_(i,t){const e=Math.sin(i);return Math.cos(i)-t*.28*e*e*e}function ol(i){return(1-Math.sin(i))/2}function th(i,t){if(!i.grounded||i.speed<Ys)return l_();const e=i.speed/Math.max(i.moveSpeed,Ys),n=Math.min(t.maxAmp,e*t.strideGain),s=Math.abs(i.localForward),a=Math.abs(i.localRight),r=s+a+Ys,o=s/r,c=a/r,l=i.localForward>=0?1:-1,d=i.localRight>=0?1:-1,u=Math.max(i.legLength,Ys),f=n*u;function h(S,R){const W=h_(S,t.plantLock),H=ol(S),G=-(l*o*f*W)/u,V=R*d>0?1:-1,$=1+V*t.crossStep*.45,Y=d*V*t.crossStep*f*.4*H,ot=(d*c*f*t.sideWeight*$*W+Y*c)/u,ut=t.kneeLift*H*n*(.55+.25*o+(V>0?.2*c:0));return{pitchX:G,rollZ:ot,kneeX:ut}}const g=(i.phase%$s+$s)%$s,_=h(g,-1),m=h((g+Math.PI)%$s,1),p=Math.cos(g),x=ol(g),y=-t.comSway*n*p*(.6*o+.8*c)-d*t.comSway*n*c*.45,M=t.comBob*x*n,L=d*t.hipLean*n*c*p*.6,C=d*t.hipLean*n*c*(.45+.25*p),w=t.armSwing*n*p*(o*l+.3*c),P=w,b=-w;return{legL:_,legR:m,pelvisX:y,pelvisY:M,pelvisRoll:L,sideLean:C,armL:P,armR:b,strafe:c,backward:l<0?o:0}}function we(i){return i<0?0:i>1?1:i}const d_=Math.PI*2;function u_(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function f_(i,t,e,n,s){const a=we(n);if(a<=0)return i;const r=we(t),o=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),l=e%2===0?1:-1,d=we(s.forwardBias),u={speed:c,phase:i.phase+r*d_*o,localForward:c*d,localRight:c*(1-d)*l};return{speed:i.speed+(u.speed-i.speed)*a,phase:i.phase+(u.phase-i.phase)*a,localForward:i.localForward+(u.localForward-i.localForward)*a,localRight:i.localRight+(u.localRight-i.localRight)*a}}function p_(i,t,e){const n=u_(),s=we(i),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return n;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,d=e.stepKnee*a,u=e.stepSide*a;return n.legL.pitchX=o?-l:l*.55,n.legR.pitchX=c?-l:l*.55,n.legL.kneeX=o?d:d*.4,n.legR.kneeX=c?d:d*.4,n.legL.rollZ=-u*r,n.legR.rollZ=u*r,n.pelvisX=e.stepSway*a*r,n.pelvisY=-e.stepDip*a,n.pelvisRoll=u*.25*r,n}function eh(i,t){if(i<=0||i>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return i<e?Math.sin(Math.PI/2*(i/e)):Math.cos(Math.PI/2*((i-e)/(1-e)))}function cl(i,t,e,n,s){if(e<=0||n<=0)return 0;const a=(i-t)/e;return a<0||a>=1?0:n*eh(a,s)}function m_(i,t,e,n){const s=t?1:0,a=1-Math.exp(-Math.max(0,n)*Math.max(0,e)),r=i+(s-i)*a;return t&&r>.999?1:!t&&r<.001?0:r}function g_(i,t,e){const n=we(i);return{gaitScale:1-n*(1-we(t)),attackLegWeight:we(e)*n}}function __(i,t){const e=we(t);return e===1?i:{legL:{pitchX:i.legL.pitchX*e,rollZ:i.legL.rollZ*e,kneeX:i.legL.kneeX*e},legR:{pitchX:i.legR.pitchX*e,rollZ:i.legR.rollZ*e,kneeX:i.legR.kneeX*e},pelvisX:i.pelvisX*e,pelvisY:i.pelvisY*e,pelvisRoll:i.pelvisRoll*e,sideLean:i.sideLean*e,armL:i.armL*e,armR:i.armR*e,strafe:i.strafe,backward:i.backward}}function x_(i,t){const e=Math.min(1,Math.abs(i)/Math.max(t.impactSpeed,1e-6));return we(t.minScale+(1-t.minScale)*e)}function v_(){return nh()}function nh(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function M_(i,t){return i.type==="light"?Math.max(0,t.leanLight):i.type==="heavy"?Math.max(0,t.leanHeavy):i.type==="knock"?Math.max(0,t.leanKnock):0}function y_(i,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?we(t.forceHitHeight):i.type==="light"?we(t.hitHeight.light):i.type==="heavy"?we(t.hitHeight.heavy):i.type==="knock"?we(t.hitHeight.knock):0}function S_(i,t,e){const n=we(e),s=(a,r)=>a+(r-a)*n;return{upperPitch:s(i.upperPitch,t.upperPitch),upperRoll:s(i.upperRoll,t.upperRoll),upperYaw:s(i.upperYaw,t.upperYaw),fold:s(i.fold,t.fold),shift:s(i.shift,t.shift),drop:s(i.drop,t.drop),back:s(i.back,t.back),knee:s(i.knee,t.knee),hip:s(i.hip,t.hip),arm:s(i.arm,t.arm)}}function ih(i,t,e){const n=nh(),s=M_(i,e);if(n.intensity=s,s<=0||i.duration<=0||!Number.isFinite(i.timer))return n;const a=we(1-i.timer/i.duration),r=eh(a,e.pulseRatio);n.pulse=r,n.active=r>0,n.hitHeight=y_(i,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),u=i.dirX*o+i.dirZ*c,f=i.dirX*l+i.dirZ*d;if(n.localFwd=u,n.localRight=f,!e.enabled){n.legacy=!0;const _=Math.sin(Math.PI*a);return n.upperPitch=s*_*u,n.upperRoll=-s*_*f*.7,n.drop=(s>.5?.09:.04)*_,n.flash=e.flashStrength*_,n.active=_>0,n}const h=s*r,g=S_(e.abdomen,e.shoulder,n.hitHeight);return n.upperPitch=h*(g.upperPitch*u+g.fold),n.upperRoll=-h*g.upperRoll*f,n.upperYaw=h*g.upperYaw*f,n.upperShift=h*g.shift,n.upperShiftX=n.upperShift*f,n.upperShiftZ=n.upperShift*u,n.comShift=h*e.comShift,n.comX=n.comShift*f,n.comZ=n.comShift*u,n.pelvisBack=h*g.back,n.drop=h*g.drop,n.knee=h*g.knee,n.hip=h*g.hip,n.arm=h*g.arm,n.flash=e.flashStrength*r,n}function sh(i,t){const e=Math.max(0,t.pelvisTiltGain),n=Math.max(0,t.pelvisShift),s=Number.isFinite(i.leanForward)?i.leanForward:0,a=Number.isFinite(i.leanSide)?i.leanSide:0,r=Number.isFinite(i.speedRatio)?Math.max(0,Math.min(1,i.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*n,pelvisZ:s*n,crouch:Math.max(0,t.moveCrouch)*r}}const $n=1e-6;function Qi(i,t,e){return i<t?t:i>e?e:i}function b_(i,t,e,n=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=$n||a<=$n||!Number.isFinite(i.x)||!Number.isFinite(i.y)||!Number.isFinite(i.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+$n,l=Math.hypot(i.x,i.y,i.z);if(l<=$n)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(i.x,-i.y),u=Math.hypot(i.x,i.y),f=i.z,h=Math.hypot(f,u),g=Qi(h,c,o),_=h>o+$n||h<c-$n,m=Math.atan2(-f,Math.max(u,$n)),p=Qi((s*s+g*g-a*a)/(2*s*g),-1,1),x=Qi((a*a+g*g-s*s)/(2*a*g),-1,1),y=Math.acos(p),M=Math.acos(x),L=n>=0?1:-1;return{rootPitch:m-L*y,rootRoll:d,jointPitch:L*(y+M),clamped:_,reach:l/o}}function E_(i,t,e,n){const s=Qi(e,0,1),a=Math.max(0,n),r=(o,c)=>{const l=Qi((c-o)*s,-a,a);return o+l};return{rootPitch:r(i.rootPitch,t.rootPitch),rootRoll:r(i.rootRoll,t.rootRoll),jointPitch:r(i.jointPitch,t.jointPitch)}}function ah(i,t){return{pelvisPos:i.position.clone(),pelvisRotX:i.rotation.x,pelvisRotZ:i.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const No={active:!1,weight:0,clamped:0,maxError:0};function rh(i){const{root:t,pelvis:e,lower:n,limbs:s,base:a,cfg:r}=i;if(!r.enabled||r.weight<=0||!i.grounded||s.length===0)return{...No};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:n.position.clone(),lowerRotZ:n.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,n.position.copy(a.lowerPos),n.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(h=>h.tip.getWorldPosition(new O));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,n.position.copy(o.lowerPos),n.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),n.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(i.attacking?Math.max(0,Math.min(1,r.attackScale)):1),d=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let u=0;for(let h=0;h<s.length;h++){const g=s[h],_=n.worldToLocal(c[h].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=b_(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(u+=1);const x=E_({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,l,d);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let f=0;for(let h=0;h<s.length;h++){const g=s[h].tip.getWorldPosition(new O);f=Math.max(f,g.distanceTo(c[h]))}return{active:!0,weight:l,clamped:u,maxError:f}}function mn(i,t,e){return i<t?t:i>e?e:i}const A_={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function T_(i,t,e,n,s,a,r,o,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new Me,f=new Me;f.name="pelvis",f.position.y=i.legLength,u.add(f);const h=new Me;h.name="lower";const g=new Me;g.name="upper",f.add(h),f.add(g);const _=[],m=(tt,xt,B,et)=>{const Q=new is({color:et}),A=new re(new rn(tt,xt,B),Q);return A.castShadow=!0,A.receiveShadow=!0,_.push(Q),A},p=i.headSize,x=i.legLength,y=i.armLength,M=i.limbThickness,L=i.bodyHeight,C=i.bodyWidth,w=m(C,L,.28,e);w.position.y=L/2,g.add(w);const P=new Me;P.position.y=L,g.add(P);const b=m(p,p,p,e);b.position.y=p/2,P.add(b);for(const tt of[-1,1]){const xt=m(.06,.07,.02,t.shoe);xt.position.set(tt*.09,p/2+.03,p/2+.011),P.add(xt)}const S=(tt,xt)=>{const B=xt?y:x,et=new Me;et.name=xt?tt<0?"shoulderL":"shoulderR":tt<0?"hipL":"hipR",xt||(et.rotation.order="ZYX"),et.position.set(tt*(xt?C/2+M/2:C/2-M/2),xt?L-.04:0,0),(xt?g:h).add(et);const Q=m(M,B/2,M,t.limb);Q.position.y=-B/4,et.add(Q);const A=new Me;A.name=xt?"elbow":"knee",A.position.y=-B/2,et.add(A);const v=m(M,B/2,M,t.limb);if(v.position.y=-B/4,A.add(v),!xt){const U=m(M*1.15,.07,M*1.7,t.shoe);U.position.set(0,-B/2+.035,.045),A.add(U);const K=new he;return K.name="footTip",K.position.y=-B/2,A.add(K),{root:et,joint:A,tip:K}}return{root:et,joint:A}},R=S(-1,!1),W=S(1,!1),H=S(-1,!0),X=S(1,!0),G=[R,W].map(tt=>({root:tt.root,joint:tt.joint,tip:tt.tip,upperLen:x/2,lowerLen:x/2,bend:1})),V=new Qe({color:s.attackArcColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),$=new re(new va(.62,.042,6,20,Math.PI*1.1),V);$.position.set(0,.78-x,.56),g.add($);const Y=document.createElement("canvas");Y.width=256,Y.height=72;const at=Y.getContext("2d"),ot=new Q0(Y),ut=new jl({map:ot,transparent:!0,depthTest:!1,depthWrite:!1}),At=new K0(ut);At.scale.set(1.85,.52,1),At.position.y=1.7-x,At.renderOrder=20,g.add(At);function bt(tt){at&&(at.clearRect(0,0,256,72),at.fillStyle=s.labelBg,at.fillRect(0,0,256,72),at.strokeStyle=e,at.lineWidth=5,at.strokeRect(3,3,250,66),at.fillStyle=e,at.font="bold 29px ui-monospace, Menlo, Consolas, monospace",at.textAlign="center",at.textBaseline="middle",at.fillText(`${n} ${A_[tt]}`,128,38),ot.needsUpdate=!0)}const j=new Ot(e),it=new Ot(o.flashColor),ft=new Ot;let dt=null,pt=0,Rt=0,It=0,Ft=0,wt=0,Yt=0,T=0,gt={...No};return{group:u,update(tt,xt){u.position.set(tt.position.x,tt.position.y,tt.position.z),u.rotation.y=tt.bodyYaw,P.rotation.y=(tt.headYaw-tt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,tt.mode!==dt&&(dt=tt.mode,bt(tt.mode),pt=1),pt=Math.max(0,pt-xt*2.2);const B=tt.hurt,et=ih(B,tt.bodyYaw,o),Q=et.flash;ft.copy(it).multiplyScalar(Q);for(const ct of _)ct.emissive.copy(j).multiplyScalar(pt*.5),Q>0&&ct.emissive.add(ft);f.position.set(0,x,0),f.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),h.position.set(0,0,0),h.rotation.z=0;const A=Math.hypot(tt.velocity.x,tt.velocity.z),v=Math.sin(tt.bodyYaw),U=Math.cos(tt.bodyYaw),K=Math.cos(tt.bodyYaw),nt=-Math.sin(tt.bodyYaw),J=th({phase:tt.gaitPhase,speed:A,moveSpeed:a,localForward:tt.velocity.x*v+tt.velocity.z*U,localRight:tt.velocity.x*K+tt.velocity.z*nt,legLength:i.legLength,grounded:!0},r);R.root.rotation.x=J.legL.pitchX,W.root.rotation.x=J.legR.pitchX,R.root.rotation.z=J.legL.rollZ,W.root.rotation.z=J.legR.rollZ,R.joint.rotation.x=J.legL.kneeX,W.joint.rotation.x=J.legR.kneeX,H.root.rotation.x=J.armL,X.root.rotation.x=J.armR,H.joint.rotation.x=-.18,X.joint.rotation.x=-.18,f.position.x=J.pelvisX,f.position.y=x+J.pelvisY,f.rotation.z=J.pelvisRoll,g.rotation.z=J.sideLean*(et.intensity>0?.4:1);const st=ah(f,h);if(c){const ct=Math.max(.004166666666666667,Math.min(xt,.1)),yt=Math.sin(tt.bodyYaw),Ct=Math.cos(tt.bodyYaw),Ut=mn((tt.velocity.x-Rt)/ct,-60,60),St=mn((tt.velocity.z-It)/ct,-60,60),Vt=Ut*yt+St*Ct,kt=ti(tt.bodyYaw-Ft)/ct,Zt=c.maxForwardDeg*Math.PI/180,I=c.maxSideDeg*Math.PI/180,N=1-Math.exp(-Math.max(0,c.smoothing)*ct);wt+=(mn(Vt*c.accelGain,-Zt,Zt)-wt)*N,Yt+=(mn(-kt*A*c.turnGain,-I,I)-Yt)*N;const D=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;T+=(mn(A/Math.max(a,1e-6),0,1)-T)*(1-Math.exp(-Math.max(0,D)*ct));const F=sh({leanForward:wt,leanSide:Yt,speedRatio:T},c);g.rotation.x+=wt,g.rotation.z+=Yt,f.rotation.x+=F.pelvisPitch,f.rotation.z+=F.pelvisRoll,f.position.x+=F.pelvisX,f.position.z+=F.pelvisZ,f.position.y-=F.crouch;const rt=d.enabled?mn(d.weight,0,1):0;h.position.y+=F.crouch*(1-rt)}Rt=tt.velocity.x,It=tt.velocity.z,Ft=tt.bodyYaw,g.rotation.x+=et.upperPitch,g.rotation.z+=et.upperRoll,g.rotation.y+=et.upperYaw;const ht=mn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),_t=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=mn(et.upperShiftX*ht,-_t,_t),g.position.z+=mn(et.upperShiftZ*ht,-_t,_t),f.position.x+=et.comX,f.position.z+=et.comZ-et.pelvisBack,f.position.y-=et.drop;const Bt=et.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(h.position.z+=et.pelvisBack*(1-Bt),h.position.y+=et.drop*(1-Bt),R.joint.rotation.x+=et.knee,W.joint.rotation.x+=et.knee,R.root.rotation.x-=et.hip,W.root.rotation.x-=et.hip,H.root.rotation.x+=et.arm,X.root.rotation.x+=et.arm*.8,tt.attackPhase!=="idle"&&et.intensity===0){const ct=tt.attackProgress,yt=ct<.34?-1:ct<.68?-1+(ct-.34)/.34*2:Math.max(0,1-(ct-.68)/.32),Ct=Math.max(0,-yt),Ut=Math.max(0,yt);X.root.rotation.x=-1.7*Ct+1.25*Ut,X.joint.rotation.x=-(.25+Ct*.45),g.rotation.y=-.28*yt,V.opacity=tt.attackPhase==="active"?.85:0,tt.attackPhase==="active"&&($.rotation.z=-1.1+ct*3)}else V.opacity=0;gt=rh({root:u,pelvis:f,lower:h,limbs:G,base:st,cfg:d,grounded:!0,attacking:tt.attackPhase!=="idle"})},ik(){return gt},dispose(){u.traverse(tt=>{if(tt instanceof re){tt.geometry.dispose();const xt=tt.material;Array.isArray(xt)?xt.forEach(B=>B.dispose()):xt.dispose()}}),ot.dispose(),ut.dispose()}}}function oh(i){return{x:0,y:0,z:1}}function w_(i){return Math.asin(oh().y)}function R_(i,t){const e=Math.cos(t),n=Math.sin(t);return{x:i.x*e+i.z*n,y:i.y,z:-0*n+i.z*e}}function Ee(i,t,e){return i<t?t:i>e?e:i}const ll=1e-6;function ce(i,t,e,n){const s=new re(new rn(i,t,e),new is({color:n}));return s.castShadow=!0,s.receiveShadow=!0,s}function ge(){return new Me}function na(i,t,e){const n=ge(),s=ce(t*.7,.12,t*.7,e.wood);s.position.y=.06,n.add(s);const a=ce(t*2.4,.045,t*.8,e.metal);a.position.y=.13,n.add(a);const r=ce(t*.38,i,t,e.blade);r.position.y=.13+i/2,n.add(r);const o=ce(t*.42,i*.96,t*.2,e.bladeEdge);o.position.set(0,.13+i/2,t*.5),n.add(o);const c=ce(t*.3,.09,t*.45,e.blade);return c.position.y=.13+i+.045,n.add(c),n}function C_(i){const t=na(.72,.15,i),e=ce(.12,.46,.12,i.wood);return e.position.y=-.3,t.add(e),t}function P_(i){const t=ge(),e=ce(.32,.38,.06,i.metal);e.position.set(0,.02,.1),t.add(e);const n=ce(.11,.11,.045,i.blade);return n.position.set(0,.02,.145),t.add(n),t}function L_(i){const t=ge(),e=ce(.055,.88,.055,i.wood);e.position.y=.42,t.add(e);const n=ce(.15,.15,.15,i.glow);n.position.y=.92;const s=n.material;return s.emissive=new Ot(i.glow),s.emissiveIntensity=.85,t.add(n),{g:t,orb:n}}function D_(i){const t=ge();for(let n=0;n<5;n++){const s=(n-2)*.15,a=ce(.055,.16,.05,i.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ce(.014,.66,.014,i.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function I_(i){const t=ge(),e=ce(.025,.025,.46,i.wood);e.position.z=.23,t.add(e);const n=ce(.055,.055,.09,i.blade);return n.position.z=.5,t.add(n),t}function U_(i,t,e,n,s,a,r,o,c,l,d){const u=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},h=ge(),g=ge();g.name="pelvis",g.position.y=i.legLength,h.add(g);const _=ge();_.name="lower";const m=ge();m.name="upper",g.add(_),g.add(m);const p=i.headSize,x=i.legLength,y=i.armLength,M=i.limbThickness,L=i.bodyHeight,C=i.bodyWidth,w=ce(C,L,.28,t.body);w.position.y=L/2,m.add(w);const P=ge();P.position.y=n.headPivotHeight,m.add(P);const b=ce(p,p,p,t.head);b.position.y=p/2,P.add(b);const S=new is({color:"#1b2733"});for(const N of[-1,1]){const D=new re(new rn(.06,.07,.02),S);D.position.set(N*.09,p/2+.03,p/2+.011),P.add(D)}const R=N=>{const D=ge();D.name=N<0?"hipL":"hipR",D.rotation.order="ZYX",D.position.set(N*(C/2-M/2),0,0),_.add(D);const F=ce(M,x/2,M,t.limb);F.position.y=-x/4,D.add(F);const rt=ge();rt.name="knee",rt.position.y=-x/2,D.add(rt);const lt=ce(M,x/2,M,t.limb);lt.position.y=-x/4,rt.add(lt);const vt=ce(M*1.15,.07,M*1.7,t.shoe);vt.position.set(0,-x/2+.035,.045),rt.add(vt);const Wt=new he;return Wt.name="footTip",Wt.position.y=-x/2,rt.add(Wt),{root:D,joint:rt,hand:ge(),tip:Wt}},W=N=>{const D=ge();D.name=N<0?"shoulderL":"shoulderR",D.position.set(N*(C/2+M/2),L-.04,0),m.add(D);const F=ce(M,y/2,M,t.limb);F.position.y=-y/4,D.add(F);const rt=ge();rt.name="elbow",rt.position.y=-y/2,D.add(rt);const lt=ce(M,y/2,M,t.limb);lt.position.y=-y/4,rt.add(lt);const vt=ge();vt.position.y=-y/2,rt.add(vt);const Wt=ce(M*1.1,.09,M*1.1,t.head);return Wt.position.y=.045,vt.add(Wt),{root:D,joint:rt,hand:vt}},H=R(-1),X=R(1),G=W(-1),V=W(1),$=[H,X].map(N=>({root:N.root,joint:N.joint,tip:N.tip,upperLen:x/2,lowerLen:x/2,bend:1})),Y=ge(),at=ge();V.hand.add(Y),G.hand.add(at);const ot=L_(t),ut=D_(t),At=I_(t),bt={"sword-shield":{right:na(.42,.075,t),left:P_(t)},"dual-swords":{right:na(.42,.075,t),left:na(.42,.075,t)},greatsword:{right:C_(t),left:ce(.12,.2,.12,t.wood)},staff:{right:ot.g,left:ge(),orb:ot.orb},bow:{right:At,left:ut.g,arrow:At,drawString:ut.drawString}};for(const N of Object.keys(bt))Y.add(bt[N].right),at.add(bt[N].left),bt[N].right.visible=!1,bt[N].left.visible=!1;let j=null,it=0,ft=0,dt=0,pt=0,Rt=0,It=0,Ft=v_(),wt={...No},Yt=0,T=0,gt=0,tt=0,xt=0,B=1,et={speed:0,phase:0},Q=0,A=0,v=!0,U=0,K="none",nt=0,J=0,st=0,ht=.3,_t=0;function Bt(N){const D=Math.PI/180,F=a;let rt=0,lt=0,vt=0,Wt=0;N==="sword-shield"?(rt=F.swordPitchDeg*D,lt=-F.swordYawDeg*D,vt=F.shieldPitchDeg*D):N==="dual-swords"?(rt=F.swordPitchDeg*D,lt=-F.swordYawDeg*D,vt=F.swordPitchDeg*D,Wt=F.swordYawDeg*D):N==="greatsword"?(rt=F.greatswordPitchDeg*D,lt=-F.greatswordYawDeg*D,vt=F.greatswordPitchDeg*D,Wt=F.greatswordYawDeg*D):N==="staff"?rt=F.staffPitchDeg*D:vt=F.bowPitchDeg*D,Y.rotation.set(rt,0,lt),at.rotation.set(vt,0,Wt)}function ct(N){if(N!==j){j=N;for(const D of Object.keys(bt))bt[D].right.visible=D===N,bt[D].left.visible=D===N;Bt(N),ut.drawString.position.z=-.06,At.position.z=0,ot.orb.scale.setScalar(1),m.rotation.y=0}}ct("sword-shield");const yt=[];h.traverse(N=>{N instanceof re&&N.material instanceof is&&yt.push(N.material)});const Ct=new Ot(o.flashColor);function Ut(N,D){const F=ih(N,D,o);Ft=F,m.rotation.x+=F.upperPitch,m.rotation.z+=F.upperRoll,m.rotation.y+=F.upperYaw;const rt=Ee(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),lt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Ee(F.upperShiftX*rt,-lt,lt),m.position.z+=Ee(F.upperShiftZ*rt,-lt,lt),g.position.x+=F.comX,g.position.z+=F.comZ-F.pelvisBack,g.position.y-=F.drop;const vt=F.legacy?0:Ee(o.lowerScale,0,1);_.position.z+=F.pelvisBack*(1-vt),_.position.y+=F.drop*(1-vt),H.joint.rotation.x+=F.knee,X.joint.rotation.x+=F.knee,H.root.rotation.x-=F.hip,X.root.rotation.x-=F.hip,G.root.rotation.x+=F.arm,V.root.rotation.x+=F.arm*.8;for(const Wt of yt)Wt.emissive.copy(Ct).multiplyScalar(F.flash)}function St(N){return N<.3?-1:N<.62?-1+(N-.3)/.32*2:Math.max(0,1-(N-.62)/.38)}function Vt(N){if(N.phase==="idle"||N.charging)return;const D=N.attackProgress,F=St(D),rt=Math.max(0,F),lt=N.comboIndex%2===0?1:-1,vt=c.stride,Wt=Number.isFinite(vt.stepReach)?vt.stepReach:.17,se=Number.isFinite(vt.stepSideReach)?vt.stepSideReach:.14,$t=Number.isFinite(vt.stepDipReach)?vt.stepDipReach:.05,Kt=N.weapon==="greatsword"?Ee(Number.isFinite(vt.heavyScale)?vt.heavyScale:1,0,1):1;g.position.z+=Wt*rt*Kt,g.position.x+=lt*se*rt*Kt,g.position.y-=$t*Math.sin(Math.PI*D)*Kt}function kt(N){if(ut.drawString.position.z=-.06,At.position.z=0,ot.orb.scale.setScalar(1),m.rotation.y=0,N.charging&&N.weapon==="bow"){const lt=N.charge;G.root.rotation.x=-1.25,G.joint.rotation.x=-.15,V.root.rotation.x=.35+lt*.3,V.joint.rotation.x=-1.15,ut.drawString.position.z=-.06-lt*.22,At.position.z=-lt*.3,m.rotation.y=-.22;return}if(N.phase==="idle")return;const D=St(N.attackProgress),F=Math.max(0,-D),rt=Math.max(0,D);if(N.weapon==="bow")G.root.rotation.x=-1.2,G.joint.rotation.x=-.15,V.root.rotation.x=.9-rt*.8,V.joint.rotation.x=-.3;else if(N.weapon==="greatsword"){const lt=-1.6*F+1.25*rt,vt=Ee(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);V.root.rotation.x=lt,V.joint.rotation.x=-(.25+F*.4),G.root.rotation.x=lt+.06,G.joint.rotation.x=-(.32+F*.4),G.root.rotation.z=.38,m.rotation.y=-.2*D*vt}else{const lt=N.comboIndex;if(lt===1)V.root.rotation.x=-1.7*F+1.1*rt,V.joint.rotation.x=-(.2+F*.5),G.root.rotation.x=.1,m.rotation.y=-.18*D;else if(lt===2)G.root.rotation.x=-1.5*F+1*rt,G.joint.rotation.x=-(.2+F*.5),V.root.rotation.x=.2,m.rotation.y=.45*-D;else{const vt=-1.9*F+1.2*rt;G.root.rotation.x=vt,V.root.rotation.x=vt,G.joint.rotation.x=-(.15+F*.4),V.joint.rotation.x=-(.15+F*.4),m.rotation.y=-.3*D}}Vt(N)}function Zt(N,D){N&&(V.root.rotation.x=-1.05,V.joint.rotation.x=-.35,G.root.rotation.x=-.45,G.joint.rotation.x=-.2,m.rotation.y=-.12,ot.orb.scale.setScalar(1.25+.12*Math.sin(D*2)))}function I(N){if(!N||N.phase==="idle")return;const D=N.progress,F=D<.3?-.35+D/.3*1.35:D<.7?1:Math.max(0,1-(D-.7)/.3),rt=Math.PI/180;m.rotation.x+=f.leanDeg*rt*F,G.root.rotation.x-=f.shieldPitchDeg*rt*F,G.joint.rotation.x-=.22*F,V.root.rotation.x-=.3*F,g.position.z+=f.pelvisReach*Math.max(0,F)}return{group:h,update(N,D,F,rt,lt=!1,vt,Wt){ct(D.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const se=Math.max(1/240,Math.min(rt,.1)),$t=vt===void 0?Q+=rt:vt;A=$t;const Kt=c.landing;Kt.enabled?v&&!N.grounded?(K="jump",nt=$t,J=Kt.anticipationDuration,st=Math.max(0,Kt.jumpAnticipation),ht=.32):!v&&N.grounded&&(K="land",nt=$t,J=Kt.duration,st=x_(U,Kt),ht=Kt.compressRatio,_t=U):(K="none",st=0),$t<nt&&(K="none",st=0),v=N.grounded,U=N.velocity.y;const ue=cl($t,nt,J,st,ht),kn=D.phase!=="idle";tt=m_(tt,kn,se,c.attack.blendRate);const si=g_(tt,c.attack.gaitWeight,c.attack.lowerBodyWeight);xt=si.attackLegWeight,B=si.gaitScale;const on=Math.sin(N.bodyYaw),Hi=Math.cos(N.bodyYaw),os=(N.velocity.x-it)/se,cs=(N.velocity.z-ft)/se,ai=Ee(os,-60,60),ls=Ee(cs,-60,60),ri=ai*on+ls*Hi,hs=ti(N.bodyYaw-dt)/se,ds=Math.hypot(N.velocity.x,N.velocity.z),us=r.maxForwardDeg*Math.PI/180,fs=r.maxSideDeg*Math.PI/180,Ma=Ee(ri*r.accelGain,-us,us),E=Ee(-hs*ds*r.turnGain,-fs,fs),k=1-Math.exp(-r.smoothing*se);pt+=(Ma-pt)*k,Rt+=(E-Rt)*k,it=N.velocity.x,ft=N.velocity.z,dt=N.bodyYaw;const Z=Math.hypot(N.velocity.x,N.velocity.z),q=Math.cos(N.bodyYaw),z=-Math.sin(N.bodyYaw),mt=N.velocity.x*q+N.velocity.z*z,Et=Z>ll?Ee(mt/Z,-1,1):0,Pt=n.hipYawMaxDeg*Math.PI/180,Lt=n.legYawScale*Et*Pt;T+=(Lt-T)*(1-Math.exp(-n.hipYawSmoothing*se));const Nt=N.bodyYaw+T;gt=Nt;const zt=Math.sin(Nt),Dt=Math.cos(Nt),qt=Math.cos(Nt),te=-Math.sin(Nt),ee={speed:Z,phase:N.gaitPhase,localForward:N.velocity.x*zt+N.velocity.z*Dt,localRight:N.velocity.x*qt+N.velocity.z*te},fe=kn?f_(ee,D.attackProgress,D.comboIndex,tt,c.stride):ee;et=fe;const Jt={phase:fe.phase,speed:fe.speed,moveSpeed:e,localForward:fe.localForward,localRight:fe.localRight,legLength:i.legLength,grounded:N.grounded},Tt=__(th(Jt,s),si.gaitScale);N.grounded?(H.root.rotation.x=Tt.legL.pitchX,X.root.rotation.x=Tt.legR.pitchX,H.root.rotation.z=Tt.legL.rollZ,X.root.rotation.z=Tt.legR.rollZ,H.joint.rotation.x=Tt.legL.kneeX,X.joint.rotation.x=Tt.legR.kneeX,G.root.rotation.x=Tt.armL,V.root.rotation.x=Tt.armR,G.joint.rotation.x=-(.18+Tt.armL*.2),V.joint.rotation.x=-(.18+Tt.armR*.2),G.root.rotation.z=0,V.root.rotation.z=0,g.position.x=Tt.pelvisX,g.position.y=x+Tt.pelvisY,g.rotation.z=Tt.pelvisRoll):(H.root.rotation.x=-.55,X.root.rotation.x=-.25,H.joint.rotation.x=.75,X.joint.rotation.x=.55,G.root.rotation.x=-.9,V.root.rotation.x=-.7,G.joint.rotation.x=-.6,V.joint.rotation.x=-.6,H.root.rotation.z=0,X.root.rotation.z=0);const Ge=ah(g,_),Qt=Z/Math.max(e,ll),De=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,Sn=1-Math.exp(-Math.max(0,De)*se);Yt+=(Ee(Qt,0,1)-Yt)*Sn;const pe=sh({leanForward:pt,leanSide:Rt,speedRatio:Yt},r);g.rotation.x+=pe.pelvisPitch,g.rotation.z+=pe.pelvisRoll,g.position.x+=pe.pelvisX,g.position.z+=pe.pelvisZ,g.position.y-=pe.crouch;const zn=u.enabled&&N.grounded?Ee(u.weight,0,1)*(kn?Ee(u.attackScale,0,1):1):0;_.position.y+=pe.crouch*(1-Ee(zn,0,1)),kt(D),Zt(lt,N.gaitPhase),I(Wt);const ae=a.greatswordPitchDeg*Math.PI/180,Ie=D.weapon==="greatsword",bn=Math.hypot(N.velocity.x,N.velocity.z),je=Ie&&D.phase==="idle"&&bn>.5?Math.min(1.15,bn/Math.max(e,.001)*.9):0;It+=(je-It)*(1-Math.exp(-6*se)),Ie&&(Y.rotation.x=ae+It),D.weapon==="bow"&&(ut.g.rotation.x=-(G.root.rotation.x+G.joint.rotation.x),At.rotation.x=-(V.root.rotation.x+V.joint.rotation.x));const Ke=m.rotation.y;Ut(F,N.bodyYaw);const Vi=F.type==="none"?1:.4;if(m.rotation.x+=pt*Vi,m.rotation.z+=(Rt+Tt.sideLean)*Vi,ue>0&&(H.root.rotation.x-=Kt.hipPitch*ue,X.root.rotation.x-=Kt.hipPitch*ue,H.joint.rotation.x+=Kt.kneeBend*ue,X.joint.rotation.x+=Kt.kneeBend*ue,g.position.y-=Kt.crouchDepth*ue,_.position.y+=Kt.crouchDepth*(1-Kt.lowerScale)*ue,m.rotation.x+=Kt.upperPitch*ue,G.root.rotation.x-=Kt.armTuck*ue,V.root.rotation.x-=Kt.armTuck*ue),xt>0&&N.grounded){const cn=p_(D.attackProgress,D.comboIndex,c.stride),ln=xt;H.root.rotation.x+=cn.legL.pitchX*ln,X.root.rotation.x+=cn.legR.pitchX*ln,H.root.rotation.z+=cn.legL.rollZ*ln,X.root.rotation.z+=cn.legR.rollZ*ln,H.joint.rotation.x+=cn.legL.kneeX*ln,X.joint.rotation.x+=cn.legR.kneeX*ln,g.position.x+=cn.pelvisX*ln,g.position.y+=cn.pelvisY*ln,g.rotation.z+=cn.pelvisRoll*ln}_.rotation.y=T;const ch=Ke;P.rotation.y=ti(N.headYaw-N.bodyYaw-ch),wt=rh({root:h,pelvis:g,lower:_,limbs:$,base:Ge,cfg:u,grounded:N.grounded,attacking:kn})},lean(){return{forward:pt,side:Rt}},landing(){const N=cl(A,nt,J,st,ht),D=J>0?Math.max(0,J-Math.max(0,A-nt)):0;return{pulse:N,remaining:D,kind:N>0?K:"none",impactVy:_t}},hurt(){return Ft},ik(){return wt},attackBlend(){return tt},attackWeights(){return{gaitScale:B,attackLegWeight:xt,driveSpeed:et.speed,stridePhase:et.phase}},hipYaw(){return T},gaitYaw(){return gt},arrowDirection(){At.updateWorldMatrix(!0,!1);const N=At.matrixWorld.elements,D=N[8],F=N[9],rt=N[10],lt=Math.hypot(D,F,rt)||1;return{x:D/lt,y:F/lt,z:rt/lt}},dispose(){h.traverse(N=>{if(N instanceof re){N.geometry.dispose();const D=N.material;Array.isArray(D)?D.forEach(F=>F.dispose()):D.dispose()}})}}}function N_(i,t){switch(i){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function F_(i,t,e){const n=Math.max(1,i.clientWidth),s=Math.max(1,i.clientHeight),a=new Z0({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=Ml,a.setSize(n,s,!1),i.appendChild(a.domElement);const r=new q0;r.background=new Ot("#12161d"),r.add(new e_(11061486,2764600,1.15));const o=new s_(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],d=new Me;for(const B of t.boxes){const et=B.maxX-B.minX,Q=B.maxY-B.minY,A=B.maxZ-B.minZ;let v=N_(B.kind,e);B.kind==="step"&&(v=new Ot(v).offsetHSL(0,0,B.maxY*.09).getStyle());const U=new is({color:v,transparent:!0,opacity:1}),K=new re(new rn(et,Q,A),U);K.position.set((B.minX+B.maxX)/2,(B.minY+B.maxY)/2,(B.minZ+B.maxZ)/2),K.castShadow=B.kind!=="ground",K.receiveShadow=!0,K.add(new Jl(new t_(K.geometry),new Do({color:10467020,transparent:!0,opacity:.32}))),d.add(K),l.push(U)}r.add(d);const u=t.gridMeta.maxX-t.gridMeta.minX,f=new r_(u,u,4873328,3358797);f.position.y=.002,f.visible=e.showGrid,r.add(f);const h=U_(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new Me,_=.9,m=new Me;m.position.y=_,h.group.position.y=-_,m.add(h.group),g.add(m),r.add(g);const p=t.dummies.map((B,et)=>{const Q=e.dummies.colors,A=Q[et%Q.length]??"#cccccc",v=T_(e.voxel,e.colors,A,B.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return v.group.traverse(U=>{U.userData.dummyId=B.id}),r.add(v.group),v}),x=p.map(B=>B.group),y=new a_,M=e.targeting.ringRadius,L=new Qe({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:Te,depthWrite:!1}),C=new re(new Ri(M-.07,M,28),L);C.rotation.x=-Math.PI/2,C.position.y=.03,C.visible=!1,r.add(C);const w=new Me;r.add(w);const P=new Qe({color:12577023,transparent:!0,opacity:0,side:Te,depthWrite:!1}),b=new Me;b.position.set(0,.95,.72),w.add(b);const S=new Me;S.rotation.x=w_(e.camera.pitchDeg),b.add(S);const R=new re(new va(.78,.045,6,24,Math.PI*1.15),P);S.add(R);const W=new Uo(1,0),H=new Qe({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),X=Array.from({length:16},()=>{const B=new re(W,H);return B.visible=!1,r.add(B),B}),G=new Ri(.86,1,40),V=Array.from({length:6},()=>{const B=new Qe({color:10146047,transparent:!0,opacity:0,side:Te,depthWrite:!1}),et=new re(G,B);return et.rotation.x=-Math.PI/2,et.visible=!1,r.add(et),{mesh:et,mat:B}}),$=new Qe({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),Y=new re(new rn(.035,.035,.5),$);w.add(Y);const at=e.dash,ot=new Ri(at.ringRadius-.06,at.ringRadius,28),ut=Array.from({length:6},()=>{const B=new Qe({color:16777215,transparent:!0,opacity:0,side:Te,depthWrite:!1}),et=new re(ot,B);return et.rotation.x=-Math.PI/2,et.visible=!1,r.add(et),{mesh:et,mat:B,life:0,base:1}});function At(B,et,Q,A,v){const U=ut.find(K=>K.life<=0)??ut[0];U.mat.color.set(A),U.mesh.position.set(B,Q+.04,et),U.base=v,U.mesh.scale.setScalar(v*.6),U.mesh.visible=!0,U.mat.opacity=.9,U.life=at.fxDuration}const bt=e.links,j=new Ri(bt.ringRadius-.07,bt.ringRadius,28),it=Array.from({length:5},()=>{const B=new Qe({color:bt.chargeColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),et=new re(j,B);return et.rotation.x=-Math.PI/2,et.visible=!1,r.add(et),{mesh:et,mat:B,life:0,base:1}});function ft(B,et,Q,A){const v=it.find(U=>U.life<=0)??it[0];v.mesh.position.set(B,Q+.05,et),v.base=A,v.mesh.scale.setScalar(A*.55),v.mesh.visible=!0,v.mat.opacity=.85,v.life=bt.fxDuration}let dt=t.playerLink.id,pt=t.playerLink.hitIds.length,Rt=t.dash.id,It="none",Ft=0,wt=-1,Yt=1;const T=c_(e.camera,e.smartCamera,e.zoom,n/s),gt=t.character.position;T.update(gt.x,gt.y,gt.z,1,t.camera);function tt(B,et){if(x.length===0)return 0;const Q=a.domElement.getBoundingClientRect(),A=new Ht((B-Q.left)/Q.width*2-1,-((et-Q.top)/Q.height)*2+1);y.setFromCamera(A,T.camera);const v=y.intersectObjects(x,!0);for(const U of v){const K=U.object.userData.dummyId;if(K&&K>0)return K}return 0}function xt(B,et,Q){const A=a.domElement.getBoundingClientRect(),v=new O(B,et,Q).project(T.camera);return{x:A.left+(v.x*.5+.5)*A.width,y:A.top+(-v.y*.5+.5)*A.height}}return{render(B,et){const Q=B.character,A=B.combat;g.position.set(Q.position.x,Q.position.y,Q.position.z),g.rotation.y=Q.bodyYaw;const v=B.dash.phase==="active"&&B.dash.kind==="roll",U=v&&B.dash.duration>0?Math.min(1,1-B.dash.timer/B.dash.duration):0;m.rotation.x=v?U*Math.PI*2:0,m.position.y=_-(v?.2*Math.sin(Math.PI*U):0),h.update(Q,A,B.playerHurt,et,B.abilities.channeling,B.time,B.playerLink);for(let st=0;st<p.length;st++)B.dummies[st]&&p[st].update(B.dummies[st],et);const K=B.targeting.hasTarget?B.dummies[B.targeting.targetId-1]:void 0;if(C.visible=!!K,K&&(C.position.set(K.position.x,K.position.y+.03,K.position.z),C.scale.setScalar(1+.07*Math.sin(B.time*6))),w.position.set(Q.position.x,Q.position.y,Q.position.z),w.rotation.y=A.phase!=="idle"?A.attackFacing:Q.bodyYaw,B.dash.id!==Rt){Rt=B.dash.id;const st=B.dash;It=st.kind,st.kind==="blink"?(At(st.fromX,st.fromZ,Q.position.y,at.blinkColor,.9),At(st.toX,st.toZ,Q.position.y,at.blinkColor,1.35)):At(st.fromX,st.fromZ,Q.position.y,at.rollColor,1.1)}for(const st of ut){if(st.life<=0)continue;st.life-=et;const ht=Math.max(0,st.life/at.fxDuration);st.mat.opacity=.9*ht,st.mesh.scale.setScalar(st.base*(.6+(1-ht)*1.2)),st.life<=0&&(st.mesh.visible=!1)}const nt=B.playerLink;nt.id!==dt&&(dt=nt.id,pt=nt.hitIds.length,ft(Q.position.x,Q.position.z,Q.position.y,1)),nt.hitIds.length>pt?(pt=nt.hitIds.length,ft(Q.position.x,Q.position.z,Q.position.y,1.35)):nt.hitIds.length<pt&&(pt=nt.hitIds.length);for(const st of it){if(st.life<=0)continue;st.life-=et;const ht=Math.max(0,st.life/Math.max(bt.fxDuration,1e-6));st.mat.opacity=.85*ht,st.mesh.scale.setScalar(st.base*(.55+(1-ht)*1.1)),st.life<=0&&(st.mesh.visible=!1)}A.attackId!==Ft&&(Ft=A.attackId,A.weapon==="bow"&&A.phase!=="idle"&&(wt=0,Yt=.6+A.lastCharge*.9));const J=A.phase==="active"&&A.comboIndex>0;P.opacity=J?.78:0,J&&(R.rotation.z=-1.2+A.attackProgress*3.2,R.scale.setScalar(.9+A.comboIndex*.13));for(let st=0;st<X.length;st++){const ht=B.abilities.projectiles[st],_t=X[st];_t.visible=!!ht,ht&&(_t.position.set(ht.x,ht.y,ht.z),_t.scale.setScalar(ht.radius),_t.rotation.y+=et*6)}for(let st=0;st<V.length;st++){const ht=B.abilities.rings[st],_t=V[st];if(_t.mesh.visible=!!ht,ht){const Bt=Math.max(0,Math.min(1,ht.life/Math.max(ht.duration,1e-6)));_t.mesh.position.set(ht.x,.05,ht.z),_t.mesh.scale.setScalar(ht.radius),_t.mat.opacity=.25+.55*Bt}}if(wt>=0){wt+=et;const st=wt*14*Yt;Y.position.set(0,.85,.6+st),$.opacity=st<9?.95:0,st>=9&&(wt=-1)}else $.opacity=0;T.update(Q.position.x,Q.position.y,Q.position.z,et,B.camera),a.render(r,T.camera)},resize(){const B=Math.max(1,i.clientWidth),et=Math.max(1,i.clientHeight);a.setSize(B,et,!1),T.resize(B/et)},getGroundBasis(){return T.getGroundBasis()},setCollidersVisible(B){for(const et of l)et.opacity=B?.3:1,et.wireframe=B,et.needsUpdate=!0},setGridVisible(B){f.visible=B},setZoom(B){T.setZoom(B)},pickDummy:tt,projectToScreen:xt,diagnostics(){const B=oh(e.camera.pitchDeg),et=R_(B,w.rotation.y);return{lean:h.lean(),slashNormal:et,arrowForward:h.arrowDirection(),gait:{hipYaw:h.hipYaw(),gaitYaw:h.gaitYaw()},attackBlend:h.attackBlend(),attackWeights:h.attackWeights(),landing:h.landing(),hurt:h.hurt(),ik:h.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:ut.filter(Q=>Q.life>0).length,lastKind:It},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...T.smart()}}},dispose(){h.dispose();for(const B of p)B.dispose();C.geometry.dispose(),L.dispose(),R.geometry.dispose(),P.dispose(),W.dispose(),H.dispose(),G.dispose();for(const B of V)B.mat.dispose();Y.geometry.dispose(),$.dispose();for(const B of ut)B.mat.dispose();ot.dispose();for(const B of it)B.mat.dispose();j.dispose(),d.traverse(B=>{B instanceof re&&B.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}const k_={intents:{...hl},stickX:0,stickY:0,source:"idle",gestures:[],lastGesture:null};function z_(){const i=document.getElementById("app"),t=document.getElementById("hud");if(!i||!t)throw new Error("缺少 #app / #hud 容器");const e=hd(Rd,Cd),n=F_(i,e,Je),s=ud(e),a=Xd(t),r=Yd(t,document.getElementById("hint")),o={timeScale:1,paused:!1,showColliders:Je.showColliders,showGrid:Je.showGrid};let c=1;const l=bd({maxRadiusPx:()=>Je.joystick.maxRadiusPx,deadZone:Je.joystick.deadZone,getBasis:()=>n.getGroundBasis(),zoom:()=>Je.zoom}),d=Array.from(document.querySelectorAll(".wp[data-weapon]"));let u=e.combat.weapon;function f(y){if(y===u)return;u=y;const M=Qn.indexOf(y)+1;for(const L of d)L.classList.toggle("is-active",Number(L.dataset.weapon)===M);_.refreshWeapon()}let h=k_,g=0;const _=Vd(e,Je,o,{singleStep:()=>s.singleStep(h.intents),reset:()=>{c=1,s.singleStep({...hl,resetPressed:!0})},resetZoom:()=>{c=1,n.setZoom(1)},onToggleColliders:y=>n.setCollidersVisible(y),onToggleGrid:y=>n.setGridVisible(y)});window.addEventListener("resize",()=>n.resize()),window.__harness={world:e,view:n,clock:s,input:l,viewConfig:Je,getUserZoom:()=>c,getGestures:()=>h.gestures,getLastGesture:()=>h.lastGesture};let m=performance.now(),p=60;function x(y){const M=Math.min((y-m)/1e3,.1);m=y,M>0&&(p=p*.9+1/M*.1);const L=l.sample();L.intents.resetPressed&&(c=1),c=_d(c,L.zoomScale,Je.zoom.min,Je.zoom.max),n.setZoom(c);let C=L.intents.dummyClickId;if(L.tap){const b=n.pickDummy(L.tap.x,L.tap.y);b>0&&(C=b)}C>0&&(g=C),h={...L,intents:{...L.intents,dummyClickId:g}};const w=s.frame(M,h.intents,o.timeScale,o.paused);w>0&&(g=0),f(e.combat.weapon),n.render(e,M);const P=n.diagnostics();a.update(e,p,w,h,o,{attackBlend:P.attackBlend,attackWeights:P.attackWeights,landing:P.landing,hurt:P.hurt,ik:P.ik,zoom:P.camera.zoom},r.hudCompact()),requestAnimationFrame(x)}requestAnimationFrame(x)}z_();

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Jn=["sword-shield","dual-swords","greatsword","staff","bow"],va=["wander","follow","keep-distance","attack","idle"],rl={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},ea=1e-6;function ha(i,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ea?Math.atan2(t.aimX,t.aimZ):i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget?i.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>ea?Math.atan2(t.moveX,t.moveZ):i.character.facing}function ah(i,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ea){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>ea)return{x:t.moveX/e,z:t.moveZ/e};const n=i.character.facing;return{x:Math.sin(n),z:Math.cos(n)}}const He=1e-6,ir=Math.PI/180;function ol(){return{type:"none",timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function sr(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Do(i,t,e,n,s){i.type=t,i.duration=e,i.timer=e,i.dirX=n,i.dirZ=s,i.knockX=0,i.knockZ=0}function ro(i,t,e){const n=e.duration>0?e.duration:co(i,e.type);if(t.kind==="player"){const a=i.playerHurt;if(Do(a,e.type,n,e.dirX,e.dirZ),!i.config.hits.noDamageToPlayer&&e.knockback>He){const r=e.knockback*i.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}sr(i,"player-hurt",e.sourceId??0,i.character.position);return}const s=i.dummies[t.index];if(s){if(Do(s.hurt,e.type,n,e.dirX,e.dirZ),e.knockback>He){const a=e.knockback*i.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}i.hitCount+=1,sr(i,"hit",s.id,s.position)}}function oo(i,t,e){ro(i,{kind:"dummy",index:t},e)}function rh(i,t){const e=[i.playerHurt];for(const s of i.dummies)e.push(s.hurt);const n=Math.exp(-i.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=n,s.knockZ*=n,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function co(i,t){const e=i.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function oh(i){const t=i.combat,e=i.config.hits,n=i.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*ir),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=i.config.dummies.radius,l=i.config.targeting.idealRange;for(const d of i.dummies){const u=d.position.x-n.x,h=d.position.z-n.z,p=Math.hypot(u,h);if(p>s+c)continue;const g=p>He?u/p:r,_=p>He?h/p:o;if(p>He&&(u*r+h*o)/p<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const f=e.knockback[t.weapon]??0;let x=p;f>0&&(x=Math.max(p+f,l));const S=Math.max(0,x-p);oo(i,i.dummies.indexOf(d),{type:m,duration:co(i,m),dirX:g,dirZ:_,knockback:S})}}function ch(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="active")return;const s=n.weapon===""?void 0:e.moves[n.weapon];if(!s||!s.enabled||!i.modules.hits||!i.modules.dummies)return;const a=s.hit;if(n.pulseTimer-=t,n.pulseTimer>0)return;n.pulseTimer=Math.max(a.pulseInterval,0);const r=i.character.position,o=n.fromX,c=n.fromZ,l=r.x,d=r.z,u=l-o,h=d-c,p=u*u+h*h,g=Math.sin(n.facing),_=Math.cos(n.facing),m=Math.cos(Io(a.arcDeg,0,180)*ir),f=i.config.dummies.radius;for(let x=0;x<i.dummies.length;x++){const S=i.dummies[x];if(n.hitIds.indexOf(S.id)>=0)continue;const M=p>He?Io(((S.position.x-o)*u+(S.position.z-c)*h)/p,0,1):0,L=o+u*M,w=c+h*M,T=Math.hypot(S.position.x-L,S.position.z-w);let C=!1;if(a.shape==="circle")C=T<=a.radius+f;else if(a.shape==="capsule")C=T<=Math.max(a.radius,a.width)+f;else{const q=S.position.x-l,X=S.position.z-d,H=Math.hypot(q,X),K=H>He?(q*g+X*_)/H>=m:!0;C=H<=a.radius+f&&K||T<=a.width+f}if(!C)continue;const b=S.position.x-o,y=S.position.z-c,R=Math.hypot(b,y);if(R>He&&(b*g+y*_)/R<Math.cos(Math.max(a.arcDeg,90)*ir))continue;const W=R>He?b/R:g,I=R>He?y/R:_;ro(i,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:W,dirZ:I,knockback:a.knockback}),n.hitIds.push(S.id),sr(i,"link-hit",S.id,S.position)}}function lh(i){const t=i.config.hits,e=i.character.position;for(const n of i.events){if(n.type!=="dummy-hit")continue;const s=i.dummies[n.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>He?a/o:0,l=o>He?r/o:1;ro(i,{kind:"player"},{type:"light",duration:co(i,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function hh(i,t){if(!i.modules.hits)return;i.events.some(n=>n.type==="attack-active")&&oh(i),ch(i,t),lh(i)}function Io(i,t,e){return i<t?t:i>e?e:i}const $s=1e-6;function Qi(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function dh(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function uh(i){const t=i.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function fh(i){const t=i.abilities,e=i.config.abilities.arcane,n=i.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:n.x+s*r,y:n.y+1,z:n.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,Qi(i,"projectile-fire",t.volleyId,o)}function ph(i,t,e){const n=i.abilities,s=i.config.abilities.arcane,a=i.dash.phase==="active",r=i.playerLink;if(i.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){n.channeling||(n.channeling=!0,n.fireTimer=0,Qi(i,"channel-start",0,i.character.position)),n.channelYaw=ha(i,e),n.fireTimer-=t;let c=0;for(;n.fireTimer<=0&&c++<8;)n.fireTimer+=Math.max(s.fireInterval,$s),fh(i)}else n.channeling&&(n.channeling=!1,Qi(i,"channel-end",0,i.character.position))}function mh(i,t){const e=i.config.abilities.ring,n=i.dash.phase==="active";if(i.combat.weapon!=="staff"||!t.skill2Pressed||n)return;const s=i.character.position,a={id:++i.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};i.abilities.rings.push(a),Qi(i,"ring-place",a.id,s)}function gh(i,t){const e=i.abilities,n=i.config.abilities.arcane,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<i.dummies.length;l++){const d=i.dummies[l],u=d.position.x-o.x,h=d.position.z-o.z,p=o.radius+s;if(!(u*u+h*h>p*p)){oo(i,l,{type:n.hurtType,duration:n.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:n.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function _h(i,t){const e=i.abilities,n=i.config.abilities.ring,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(n.pulseInterval,$s),a)for(let l=0;l<i.dummies.length;l++){const d=i.dummies[l],u=d.position.x-o.x,h=d.position.z-o.z,p=o.radius+s;if(u*u+h*h>p*p)continue;const g=Math.hypot(u,h),_=g>$s?u/g:0,m=g>$s?h/g:1;oo(i,l,{type:"heavy",duration:n.stun,dirX:_,dirZ:m,knockback:n.knockback})}Qi(i,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function xh(i,t,e){ph(i,t,e),mh(i,e),gh(i,t),_h(i,t)}function Ma(i){i.rngState=i.rngState+1831565813>>>0;let t=i.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Uo=1e-6;function No(i,t,e){return i<t?t:i>e?e:i}function cl(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function ll(i){const t=i.camera,e=cl();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=i.character.position.x,t.centroidZ=i.character.position.z}function vh(i){const t=i.camera,e=i.config.camera,n=i.character.position;let s=0,a=0,r=0,o=0;for(const l of i.dummies){const d=l.position.x-n.x,u=l.position.z-n.z,h=Math.hypot(d,u);if(h>e.radius)continue;const p=No((e.radius-h)/Math.max(Uo,e.radius-e.nearDistance),0,1);let g=p*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*p),s+=g,a+=l.position.x*g,r+=l.position.z*g,o+=1}const c=s<=0?0:No(s/(s+Math.max(Uo,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=n.x,t.centroidZ=n.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,d=r/s;t.centroidX=l,t.centroidZ=d;let u=(l-n.x)*e.framingBias*c,h=(d-n.z)*e.framingBias*c;const p=Math.hypot(u,h);p>e.maxOffset&&(u=u/p*e.maxOffset,h=h/p*e.maxOffset),t.offsetX=u,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Mh(i){const t=[],e=i.ground.size;t.push(ri("ground","ground",0,0,e,e,-i.ground.thickness,0));for(const n of i.steps)t.push(ri(n.id,"step",n.x,n.z,n.width,n.depth,0,n.height));for(const n of i.doorways){const s=n.openingWidth/2,a=n.wallThickness;t.push(ri(`${n.id}-left`,"wall",n.x-s-n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(ri(`${n.id}-right`,"wall",n.x+s+n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(ri(`${n.id}-lintel`,"lintel",n.x,n.z,n.openingWidth,a,n.openingHeight,n.wallHeight))}for(const n of i.obstacles)t.push(ri(n.id,"obstacle",n.x,n.z,n.width,n.depth,0,n.height));return t}function ri(i,t,e,n,s,a,r,o){return{id:i,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:n-a/2,maxZ:n+a/2}}const _n=1e-6;function na(i,t,e){return i<t?t:i>e?e:i}function ar(i,t,e,n,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of i)l.maxY>n+a+_n||l.maxY<n-r-_n||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function lo(i,t,e,n,s){let a=!1;const r=t.y+n;for(let o=0;o<2;o++)for(const c of i){if(c.maxY<=t.y+s+_n||c.minY>=r-_n)continue;const l=na(t.x,c.minX,c.maxX),d=na(t.z,c.minZ,c.maxZ),u=t.x-l,h=t.z-d,p=u*u+h*h;if(!(p>=e*e))if(a=!0,p>_n*_n){const g=Math.sqrt(p),_=(e-g)/g;t.x+=u*_,t.z+=h*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,f=c.maxZ-t.z,x=Math.min(g,_,m,f);x===g?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function ho(i,t,e,n,s){const a=t.y+n;for(const r of i){if(r.maxY<=t.y+s+_n||r.minY>=a-_n)continue;const o=na(t.x,r.minX,r.maxX),c=na(t.z,r.minZ,r.maxZ),l=t.x-o,d=t.z-c;if(l*l+d*d<e*e-_n)return!0}return!1}const rr=1e-6;function Qn(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Fo(i,t,e,n){const s=Qn(t-i);return i+s*(1-Math.exp(-Math.max(e,rr)*n))}function yh(i,t,e){const n=i.character,s=i.config.orientation,a=i.combat,r=Math.hypot(e.moveX,e.moveZ),o=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>rr,c=i.abilities.channeling,l=a.charging&&a.weapon==="bow"&&i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget;a.phase!=="idle"?n.facing=a.attackFacing:o||c?n.facing=ha(i,e):l?n.facing=i.targeting.targetYaw:r>rr&&(n.facing=Math.atan2(e.moveX,e.moveZ));const d=n.velocity;Math.hypot(d.x,d.z)>.15&&(n.moveYaw=Math.atan2(d.x,d.z)),n.bodyYaw=Fo(n.bodyYaw,n.facing,s.bodyTurnRate,t);let u=Fo(n.headYaw,n.facing,s.headTurnRate,t);const h=s.maxHeadTurnDeg*Math.PI/180,p=Qn(u-n.bodyYaw);p>h?u=n.bodyYaw+h:p<-h&&(u=n.bodyYaw-h),n.headYaw=u}const or=1e-6,Sh=Math.PI/180;function cr(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function uo(i,t,e){return i<t?t:i>e?e:i}function da(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function lr(i){const t=i.id,e=i.windowId;Object.assign(i,da()),i.id=t,i.windowId=e}function Eh(i){lr(i)}function bh(i){lr(i.playerLink);for(const t of i.dummies)lr(t.link)}function Ah(i,t){const e=[i.playerLink];for(const n of i.dummies)e.push(n.link);for(const n of e)n.linkWindow=Math.max(0,n.linkWindow-t),n.cooldown=Math.max(0,n.cooldown-t),n.linkWindow===0&&n.phase==="idle"&&n.source!=="none"&&(n.source="none",n.usedWindowId=-1)}function hr(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(n.linkWindow=Math.max(n.linkWindow,s),n.source=t,n.windowId+=1,n.usedWindowId=-1,n.prevSprinting=!1)}function ia(i){const t=i.playerLink;if(t.phase==="idle")return;const e=t.id,n=t.windowId;Object.assign(t,da()),t.id=e,t.windowId=n,t.fromX=i.character.position.x,t.fromZ=i.character.position.z}function Th(i,t){const e=i.config.links.search,n=i.character.position,s=uo(e.maxAngleDeg,0,180)*Sh;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of i.dummies){const l=c.position.x-n.x,d=c.position.z-n.z,u=Math.hypot(l,d);if(u<or||u>e.range)continue;const h=Math.atan2(l,d);Math.abs(Qn(h-t))>s||u<o&&(o=u,a=c.id,r=h)}return{id:a,yaw:r,dist:a>0?o:0}}function wh(i,t,e,n){const s=i.config.links,a=i.playerLink,r=i.character.position,o=ha(i,t),c=Th(i,o),l=c.id>0?c.yaw:o,d=c.id>0?uo(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=n,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=d,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,i.dash.cooldown=Math.max(i.dash.cooldown,s.sharedCooldown),cr(i,"link-start",a.id)}function Rh(i,t){const e=i.playerLink;if(e.phase==="idle")return;const n=e.weapon===""?void 0:i.config.links.moves[e.weapon];if(!n){ia(i);return}if(e.weapon!==i.combat.weapon){ia(i);return}e.timer+=t;const s=c=>c==="windup"?n.windup:c==="active"?n.active:n.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,cr(i,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,cr(i,"link-end",e.id))}const r=n.windup+n.active+n.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=n.windup+e.timer:e.phase==="recovery"?o=n.windup+n.active+e.timer:o=r,e.progress=r>0?uo(o/r,0,1):1,e.phase==="active"&&n.active>or){const c=Math.max(0,e.travel-e.travelled),l=Math.max(or,n.active-e.timer),d=c/l;i.impulse.x=Math.sin(e.facing)*d,i.impulse.z=Math.cos(e.facing)*d}}function Ch(i,t,e){const n=i.config.links,s=i.playerLink,a=i.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!n.enabled||!i.modules.links){s.phase!=="idle"&&ia(i);return}const r=i.combat,o=i.character.sprinting;o&&n.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&n.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,n.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&hr(i,"sprint"),s.prevSprinting=o,Rh(i,t);const c=n.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&i.dash.phase==="idle"&&!!c&&c.enabled&&wh(i,e,c,r.weapon)}const dr=1e-6;function Ln(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function hl(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function dl(i){const t=i.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=hl()}function Ph(i){return{weapon:Jn[Math.max(0,i-1)]??Jn[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:hl()}}function Lh(i,t){return ha(i,t)}function Dh(i,t){const e=i.config.targeting;if(!e.targetAssist||!i.modules.targeting||!i.targeting.hasTarget)return t;const n=i.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*i.config.combat.minLungeScale;return Math.min(Math.max(n,0)+a,s)}function ul(i,t,e,n){const s=i.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=n,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=Lh(i,t),s.attackProgress=0,s.timings=e,s.attackId+=1,Ln(i,"attack-start",n)}function fl(i){return Math.max(0,i.config.combat.settle)}function ur(i,t,e){const n=i.config.combat.weapons[i.combat.weapon];ul(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:fl(i),lunge:Dh(i,n.lunge[e-1]??0)},e)}function Ih(i,t,e){const n=i.config.combat.bow.release;i.combat.lastCharge=e,ul(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:fl(i),lunge:n.lunge},0),Ln(i,"charge-release",e)}function Uh(i,t,e){const n=i.combat;if(n.phase==="idle")return;const s=n.timings;n.phaseTimer+=t;let a=0;for(;n.phase!=="idle"&&a++<8;){const c=n.phase==="windup"?s.windup:n.phase==="active"?s.active:n.phase==="recovery"?s.recovery:s.settle;if(n.phaseTimer<c)break;if(n.phaseTimer-=c,n.phase==="windup")n.phase="active",Ln(i,"attack-active",n.comboIndex);else if(n.phase==="active")n.phase="recovery";else if(n.phase==="recovery")n.phase="settle",Ln(i,"attack-end",n.comboIndex);else if(n.phase="idle",n.phaseTimer=0,n.comboWindow=i.config.combat.comboWindow,n.queued){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&ur(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}if(n.queued&&n.phase==="recovery"){const c=n.timings.recovery;if(c>dr&&n.phaseTimer>=c*i.config.combat.cancelWindow){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&ur(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;n.phase==="windup"?o=n.phaseTimer:n.phase==="active"?o=s.windup+n.phaseTimer:n.phase==="recovery"?o=s.windup+s.active+n.phaseTimer:n.phase==="settle"&&(o=r),n.phase!=="idle"&&(n.attackProgress=r>0?Math.min(1,o/r):1)}function Nh(i,t,e){const n=i.combat,s=i.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Jn.length){const c=Jn[e.weaponSlot-1];c!==n.weapon&&(n.weapon=c,dl(i),ia(i),Ln(i,"weapon-change",e.weaponSlot))}n.phase==="idle"&&n.comboWindow>0&&(n.comboWindow=Math.max(0,n.comboWindow-t),n.comboWindow===0&&n.comboIndex>0&&(n.comboIndex=0,Ln(i,"combo-reset",0))),Uh(i,t,e);const a=s.weapons[n.weapon],r=i.dash.phase==="active";if(a.comboCount>0){const c=i.playerLink.phase!=="idle"||i.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(n.phase==="idle"){const d=n.comboWindow>0&&n.comboIndex<a.comboCount?n.comboIndex+1:1;ur(i,e,d)}else n.queued=!0}else if(n.weapon!=="staff"){if(n.weapon==="bow"&&(!r&&!i.playerLink.consumedAttack&&e.attackPressed&&n.phase==="idle"&&!n.charging&&(n.charging=!0,n.charge=0,Ln(i,"charge-start",0)),n.charging&&e.attackHeld&&(n.charge=Math.min(1,n.charge+t/Math.max(s.bow.maxChargeTime,dr))),n.charging&&!r&&(e.attackReleased||!e.attackHeld))){n.charging=!1;const c=n.charge;n.charge=0,c>=s.bow.minChargeToFire&&n.phase==="idle"?Ih(i,e,c):Ln(i,"charge-release",0)}}if(!(i.playerLink.phase==="active")&&(i.impulse.x=0,i.impulse.z=0,n.phase==="active"&&n.timings.active>dr)){const c=n.timings.lunge/n.timings.active;i.impulse.x=Math.sin(n.attackFacing)*c,i.impulse.z=Math.cos(n.attackFacing)*c}}const fr=1e-6;function ya(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Fh(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function kh(i){const t=i.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=i.character.position.x,t.fromZ=i.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function ko(i,t,e){return i<t?t:i>e?e:i}function zh(i,t,e){const n=i.config.dash,a=i.character.position,r=i.config.worldBounds,o=Math.max(.05,n.blinkStep),c=Math.max(0,n.blinkDistance);let l=0,d=a.x,u=a.z;for(;l<c-fr;){const h=Math.min(c,l+o),p=a.x+t*h,g=a.z+e*h,_=ko(p,r.minX,r.maxX),m=ko(g,r.minZ,r.maxZ),f={x:_,y:a.y,z:m};if(ho(i.boxes,f,i.config.characterRadius,i.config.characterHeight,i.config.stepHeight)||(d=_,u=m,l=h,_!==p||m!==g))break}return{x:d,z:u}}function Oh(i,t,e){const n=i.dash,s=i.config.dash;if(n.phase==="active"&&n.timer<=0&&(n.phase="idle",n.timer=0,hr(i,"roll")),n.cooldown>0){const o=n.cooldown;n.cooldown=Math.max(0,n.cooldown-t),o>0&&n.cooldown===0&&ya(i,"dash-ready",0)}const a=i.combat;if(e.sprintPressed&&n.cooldown<=0&&n.phase==="idle"&&a.phase==="idle"&&!a.charging&&i.playerLink.phase==="idle"){const o=ah(i,e),c=o.x,l=o.z,d=i.combat.weapon==="staff";if(n.kind=d?"blink":"roll",n.dirX=c,n.dirZ=l,n.fromX=i.character.position.x,n.fromZ=i.character.position.z,n.id+=1,n.cooldown=d?s.blinkCooldown:s.rollCooldown,d){const u=zh(i,c,l);i.character.position.x=u.x,i.character.position.z=u.z,n.toX=u.x,n.toZ=u.z,n.duration=0,n.timer=0,n.phase="idle",s.blinkClearVelocity&&(i.character.velocity.x=0,i.character.velocity.z=0),hr(i,"blink"),ya(i,"blink",n.id)}else n.phase="active",n.duration=Math.max(fr,s.rollDuration),n.timer=n.duration,n.toX=n.fromX+c*s.rollDistance,n.toZ=n.fromZ+l*s.rollDistance,ya(i,"roll",n.id)}if(n.phase==="active"&&n.kind==="roll"){const o=Math.max(fr,n.timer),c=i.character.position.x,l=i.character.position.z;i.impulse.x=(n.toX-c)/o,i.impulse.z=(n.toZ-l)/o}n.phase==="active"&&(n.timer=Math.max(0,n.timer-t))}const Ve=1e-6,pr=Math.PI*2,Bh=7,Hh=18;function zo(i,t,e){return i<t?t:i>e?e:i}function Vh(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Oo(i,t,e,n){return i+Vh(t-i)*(1-Math.exp(-Math.max(e,Ve)*n))}function fo(i,t,e){i.events.push({type:t,tick:i.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Gh(i){const t=[];for(let e=0;e<i.count;e++){const n=i.spawn[e]??{x:0,z:0},s=i.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:n.x,homeZ:n.z,position:{x:n.x,y:0,z:n.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,distance:0,targetX:n.x,targetZ:n.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:ol(),link:da()})}return t}function Wh(i){const t=va.indexOf(i);return va[(t+1)%va.length]}function Xh(i){const t=i.config.dummies;for(let e=0;e<i.dummies.length;e++){const n=i.dummies[e],s=t.spawn[e]??{x:n.homeX,z:n.homeZ},a=t.initialModes[e]??n.initialMode;n.mode=a,n.initialMode=a,n.homeX=s.x,n.homeZ=s.z,n.position.x=s.x,n.position.y=0,n.position.z=s.z,n.velocity.x=0,n.velocity.y=0,n.velocity.z=0,n.facing=0,n.bodyYaw=0,n.headYaw=0,n.gaitPhase=0,n.distance=0,n.targetX=s.x,n.targetZ=s.z,n.wanderTimer=0,n.attackCooldown=0,n.attackPhase="idle",n.attackPhaseTimer=0,n.attackProgress=0;const r=n.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,Eh(n.link)}i.dummyAttackCount=0}function $h(i,t,e){const n=Ma(i)*pr,s=Math.sqrt(Ma(i))*e.wanderRadius;t.targetX=t.homeX+Math.cos(n)*s,t.targetZ=t.homeZ+Math.sin(n)*s,t.wanderTimer=e.wanderInterval*(.6+Ma(i)*.8)}function Yh(i,t){return i.attackPhase==="windup"?t.attackWindup:i.attackPhase==="active"?t.attackActive:i.attackPhase==="recovery"?t.attackRecovery:0}function Zh(i,t,e,n){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(Yh(t,n),Ve);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",fo(i,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=n.attackWindup+n.attackActive+n.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=n.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=n.attackWindup+n.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function qh(i,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const n=i.character.position,s=n.x-t.position.x,a=n.z-t.position.z,r=Math.hypot(s,a),o=r>Ve?s/r:0,c=r>Ve?a/r:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,p=t.targetZ-t.position.z,g=Math.hypot(h,p);(t.wanderTimer<=0||g<.3)&&$h(i,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,f=Math.hypot(_,m);f>Ve&&(l=_/f,d=m/f)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,d=c);else if(t.mode==="keep-distance"){const h=r-e.keepDistance;h>e.keepDeadZone?(l=o,d=c):h<-e.keepDeadZone?(l=-o,d=-c):(l=-c*e.keepStrafe,d=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,d=c);let u=t.facing;return t.mode==="wander"?Math.hypot(l,d)>Ve&&(u=Math.atan2(l,d)):r>Ve&&(u=Math.atan2(o,c)),{x:l,z:d,facing:u}}function jh(i,t,e,n){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=i.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=n.attackRange+Ve&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=n.attackInterval,i.dummyAttackCount+=1,fo(i,"dummy-attack",e))}Zh(i,e,t,n);const s=qh(i,e,n),a=1-Math.exp(-Math.max(n.acceleration,Ve)*t);e.velocity.x+=(s.x*n.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*n.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=Oo(e.bodyYaw,e.facing,Bh,t),e.headYaw=Oo(e.headYaw,e.facing,Hh,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=i.config.stepHeight;lo(i.boxes,e.position,n.radius,n.height,c)&&ho(i.boxes,e.position,n.radius,n.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const d=i.config.worldBounds;e.position.x=zo(e.position.x,d.minX,d.maxX),e.position.z=zo(e.position.z,d.minZ,d.maxZ);const u=ar(i.boxes,e.position.x,e.position.z,e.position.y,n.radius,c,Number.POSITIVE_INFINITY);u>Number.NEGATIVE_INFINITY&&u<=e.position.y+c+Ve&&(e.position.y=u);const h=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=h;const p=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(i.config.strideSpeedCap,p/Math.max(i.config.moveSpeed,Ve)),_=Math.max(i.config.strideLength*(1+g*i.config.strideSpeedGain),Ve);e.gaitPhase=(e.gaitPhase+h/_*pr)%pr}function Kh(i,t,e){const n=i.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=i.dummies.length){const s=i.dummies[e.dummyClickId-1];s.mode=Wh(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,fo(i,"dummy-mode",s)}for(const s of i.dummies)jh(i,t,s,n)}const oi=1e-6,Bo=Math.PI*2;function Sa(i,t){return Math.sqrt(i*i+t*t)}function fs(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Jh(i){const t=i.character,e=i.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.distance=0,t.coyoteTime=i.config.coyoteTime,t.jumpBuffer=0,dl(i)}function Qh(i,t,e){const n=i.config,s=i.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Sa(o,c);l>1&&(o/=l,c/=l);const d=i.combat.phase!=="idle",u=i.playerLink.phase!=="idle",h=d||i.dash.phase==="active"||u;s.sprinting=!h&&e.sprintHeld&&l>oi;const p=n.combat.weapons[i.combat.weapon];let g=p?p.moveMultiplier:1;h?g*=i.combat.phase==="settle"?n.combat.settleMoveScale:n.combat.attackMoveScale:i.combat.charging?g*=n.combat.bow.chargeMoveMultiplier:i.abilities.channeling&&(g*=n.abilities.arcane.moveScale);const _=n.moveSpeed*(s.sprinting?n.sprintMultiplier:1)*g;if(h)r.x=o*_,r.z=c*_;else{const W=l>oi?n.acceleration:n.friction,I=1-Math.exp(-W*t);r.x+=(o*_-r.x)*I,r.z+=(c*_-r.z)*I}e.jumpPressed?s.jumpBuffer=n.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?n.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=n.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,fs(i,"jumped",n.jumpSpeed)),i.events.some(W=>W.type==="blink"&&W.tick===i.tick)&&(r.x=0,r.z=0,i.impulse.x=0,i.impulse.z=0);const f=a.x,x=a.z;if(a.x+=(r.x+i.impulse.x+i.playerHurt.knockX)*t,a.z+=(r.z+i.impulse.z+i.playerHurt.knockZ)*t,lo(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight)){if(ho(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight))a.x=f,a.z=x,r.x=0,r.z=0;else{const W=a.x-f,I=a.z-x;Math.abs(W)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(I)<Math.abs(r.z*t)*.5&&(r.z=0)}fs(i,"blocked",1)}const M=n.worldBounds;a.x=Ho(a.x,M.minX,M.maxX),a.z=Ho(a.z,M.minZ,M.maxZ);const L=ar(i.boxes,a.x,a.z,a.y,n.characterRadius,n.stepHeight,n.fallTolerance);s.grounded&&L>a.y+oi&&L-a.y<=n.stepHeight+oi&&(a.y=L,r.y=0,fs(i,"stepUp",L));const w=a.y;r.y-=n.gravity*t,a.y+=r.y*t;const T=ar(i.boxes,a.x,a.z,w,n.characterRadius,n.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&a.y<=T&&r.y<=0?(a.y=T,r.y=0,s.grounded||fs(i,"landed",T),s.grounded=!0):s.grounded=!1;const C=Sa(a.x-f,a.z-x);s.distance+=C;const b=Sa(r.x,r.z),y=Math.min(n.strideSpeedCap,b/Math.max(n.moveSpeed,oi)),R=Math.max(n.strideLength*(1+y*n.strideSpeedGain),oi);s.gaitPhase=(s.gaitPhase+C/R*Bo)%Bo}function Ho(i,t,e){return i<t?t:i>e?e:i}const td=1e-6,Vo=2.399963229728653;function Go(i,t,e){return i<t?t:i>e?e:i}function Wo(i,t,e,n,s,a,r,o,c){const l=t.x-i.x,d=t.z-i.z,u=Math.hypot(l,d),h=e+n;if(u>=h)return;let p,g,_;u<td?(p=o,g=c,_=h):(p=l/u,g=d/u,_=h-u);const m=_+r;i.x-=p*m*s,i.z-=g*m*s,t.x+=p*m*a,t.z+=g*m*a}function ed(i){const t=i.config.separation,e=i.dummies,n=i.character.position,s=i.config.characterRadius,a=i.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let d=0;d<r;d++){for(let u=0;u<e.length;u++)for(let h=u+1;h<e.length;h++){const p=(u*3+h)*Vo;Wo(e[u].position,e[h].position,a,a,.5,.5,o,Math.cos(p),Math.sin(p))}for(let u=0;u<e.length;u++){const h=(u+1)*Vo;Wo(n,e[u].position,s,a,0,1,o,Math.cos(h),Math.sin(h))}}const c=i.config.stepHeight,l=i.config.worldBounds;for(const d of e)lo(i.boxes,d.position,a,i.config.dummies.height,c),d.position.x=Go(d.position.x,l.minX,l.maxX),d.position.z=Go(d.position.z,l.minZ,l.maxZ)}const Xo=1e-6,nd=Math.PI/180;function id(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function sd(i,t,e){return i<t?t:i>e?e:i}function ad(i,t,e){const n=i.config.targeting,s=i.targeting,a=i.character.position;let r=i.character.facing;Math.hypot(e.moveX,e.moveZ)>Xo&&(r=Math.atan2(e.moveX,e.moveZ));const c=sd(n.maxAngleDeg,0,180)*nd;let l=Number.POSITIVE_INFINITY,d=0,u=0,h=0;for(const p of i.dummies){const g=p.position.x-a.x,_=p.position.z-a.z,m=Math.hypot(g,_);if(m<Xo||m>n.range)continue;const f=Math.atan2(g,_),x=Math.abs(Qn(f-r));if(x>c)continue;const S=m-n.frontBias*Math.cos(x);S<l&&(l=S,d=p.id,u=f,h=m)}s.targetId=d,s.targetYaw=u,s.targetDist=h,s.hasTarget=d>0}function rd(i,t){return{tick:0,time:0,rngState:2654435769,config:i,boxes:Mh(t),gridMeta:t.grid,character:{position:{x:i.spawn.x,y:i.spawn.y,z:i.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,distance:0,coyoteTime:i.coyoteTime,jumpBuffer:0},combat:Ph(1),playerLink:da(),abilities:dh(),impulse:{x:0,z:0},targeting:id(),playerHurt:ol(),hitCount:0,dash:{...Fh(),fromX:i.spawn.x,fromZ:i.spawn.z,toX:i.spawn.x,toZ:i.spawn.z},camera:{...cl(),centroidX:i.spawn.x,centroidZ:i.spawn.z},dummies:Gh(i.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,dummies:!0}}}function od(i){Jh(i),Xh(i),bh(i);const t=i.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=i.playerHurt;e.type="none",e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,i.hitCount=0,uh(i),kh(i),ll(i),i.events.length=0}function $o(i,t,e){if(i.events.length=0,i.tick+=1,i.time+=t,i.impulse.x=0,i.impulse.z=0,e.resetPressed){od(i);const n=i.config.spawn;return i.events.push({type:"reset",tick:i.tick,x:n.x,y:n.y,z:n.z,value:0}),i}return i.modules.dummies&&i.modules.targeting?ad(i,t,e):(i.targeting.targetId=0,i.targeting.targetYaw=0,i.targeting.targetDist=0,i.targeting.hasTarget=!1),Ch(i,t,e),i.modules.combat&&Nh(i,t,e),i.modules.dash&&Oh(i,t,e),i.modules.movement&&Qh(i,t,e),i.modules.orientation&&yh(i,t,e),i.modules.dummies&&Kh(i,t,e),rh(i,t),Ah(i,t),i.modules.abilities&&xh(i,t,e),i.modules.dummies&&(hh(i,t),i.modules.separation&&ed(i)),i.modules.camera?vh(i):ll(i),i}function cd(i){let t=0;return{frame(e,n,s,a){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const r=i.config.fixedDt,o=i.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<o;){const l=c===0?n:{...n,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};$o(i,r,l),t-=r,c++}return c>=o&&(t=0),c},singleStep(e){$o(i,i.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Yo=.001;function mr(i,t,e){return i<t?t:i>e?e:i}function pl(){return{active:!1,lastDist:0}}function ld(i){const t=i.length;if(t<2)return null;const e=i[t-2],n=i[t-1];return e.id===n.id?null:[e,n]}function hd(i,t,e,n){const s=ld(t);if(!s)return{state:pl(),scale:1,started:!1,ended:i.active,pinching:!1};const a=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=Math.max(1.0001,Number.isFinite(n)?n:1.25),o=1/r,c=r;if(!Number.isFinite(a)||a<Yo)return{state:{active:!0,lastDist:0},scale:1,started:!i.active,ended:!1,pinching:!0};if(!i.active||i.lastDist<Yo)return{state:{active:!0,lastDist:a},scale:1,started:!i.active,ended:!1,pinching:!0};const l=a/i.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(l)&&l>0?Math.pow(l,d):1;return{state:{active:!0,lastDist:a},scale:mr(Number.isFinite(u)?u:1,o,c),started:!1,ended:!1,pinching:!0}}function dd(i,t,e,n){const s=Math.min(e,n),a=Math.max(e,n),r=Number.isFinite(t)&&t>0?t:1,o=i*r;return Number.isFinite(o)?mr(o,s,a):mr(i,s,a)}function ud(i,t){const e=Number.isFinite(t)&&t>0?t:1,n=Number.isFinite(i)?i:0;return Math.pow(e,n/100)}const Zo=["jump","sprint","reset","attack","skill2"],fd=8,pd=12,md=16,gd=400,_d=1.0001;function ps(i){return i instanceof Element&&i.closest("[data-ui-button], [data-ui-region], #debug-panel, #hud, #weapon-bar, #hint")!==null}function xd(i){const{maxRadiusPx:t,deadZone:e,getBasis:n,zoom:s}=i,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,d=0,u=null,h=0,p=0,g=!1,_=null,m=null,f=0,x=0,S=0,M=0,L=0;const w=new Set,T=new Map;let C=pl(),b=!1,y=1;function R(){const V=Array.from(T.values()),tt=s(),xt=hd(C,V,tt.pinchGain,tt.maxStepRatio);if(C=xt.state,b=xt.pinching,xt.scale!==1&&(y*=xt.scale),xt.started)r=null,l=0,d=0,u=null,g=!0,_=null;else if(xt.ended)if(V.length===1){const Ct=V[0];r=Ct.id,o=Ct.x,c=Ct.y,l=0,d=0,u=null,g=!0,_=null}else r=null,l=0,d=0,u=null}const W={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},I={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let q=0,X=0;const H={},K=new Set,Y=[],et=V=>{if(ps(V.target)){w.add(V.pointerId);return}w.delete(V.pointerId),T.set(V.pointerId,{id:V.pointerId,x:V.clientX,y:V.clientY}),r===null&&!b&&(r=V.pointerId,o=V.clientX,c=V.clientY,l=0,d=0,u=V.pointerId,h=V.clientX,p=V.clientY,g=!1),R()},ft=V=>{if(V.pointerId===m&&(S=V.clientX-f,M=V.clientY-x),!w.has(V.pointerId)&&T.has(V.pointerId)&&(T.set(V.pointerId,{id:V.pointerId,x:V.clientX,y:V.clientY}),R()),w.has(V.pointerId)||V.pointerId!==r)return;V.pointerId===u&&Math.hypot(V.clientX-h,V.clientY-p)>fd&&(g=!0);let tt=V.clientX-o,xt=V.clientY-c;const Ct=Math.hypot(tt,xt),St=a();Ct>St&&(tt*=St/Ct,xt*=St/Ct),l=tt,d=xt};function _t(V){if(!W[V])return;W[V]=!1,V==="attack"&&(I.attackReleased=!0);const tt=document.getElementById(`btn-${V}`);tt==null||tt.classList.remove("is-down")}const vt=V=>{const tt=T.delete(V.pointerId),xt=w.delete(V.pointerId);tt&&R(),V.pointerId===m&&(m=null,L=1);for(const Ct of Zo)H[Ct]===V.pointerId&&(H[Ct]=void 0,_t(Ct));xt||(V.pointerId===u&&(!g&&!ps(V.target)&&(_={x:V.clientX,y:V.clientY}),u=null),V.pointerId===r&&(r=null,l=0,d=0))};for(const V of Zo){const tt=document.getElementById(`btn-${V}`);if(!tt)continue;const xt=V==="attack"||V==="skill2",Ct=Ft=>{if(Ft.preventDefault(),H[V]=Ft.pointerId,W[V]=!0,V==="jump"&&(I.jump=!0),V==="reset"&&(I.reset=!0),V==="sprint"&&(I.sprintPressed=!0),V==="attack"&&(I.attackPressed=!0),V==="skill2"&&(I.skill2=!0),tt.classList.add("is-down"),xt){try{tt.setPointerCapture(Ft.pointerId)}catch{}m=Ft.pointerId,f=Ft.clientX,x=Ft.clientY,S=0,M=0,L=0}},St=Ft=>{H[V]===Ft.pointerId&&(H[V]=void 0,_t(V))};tt.addEventListener("pointerdown",Ct),tt.addEventListener("pointerup",St),tt.addEventListener("pointercancel",St),xt||tt.addEventListener("pointerleave",St),Y.push(()=>{tt.removeEventListener("pointerdown",Ct),tt.removeEventListener("pointerup",St),tt.removeEventListener("pointercancel",St),xt||tt.removeEventListener("pointerleave",St)})}const wt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const V of wt){const tt=xt=>{xt.preventDefault(),q=Number(V.dataset.weapon)||0};V.addEventListener("pointerdown",tt),Y.push(()=>V.removeEventListener("pointerdown",tt))}const $=V=>{const tt=V.key.toLowerCase();if((tt===" "||tt.startsWith("arrow"))&&V.preventDefault(),K.has(tt))return;K.add(tt),tt===" "&&(I.jump=!0),tt==="r"&&(I.reset=!0),tt==="shift"&&(I.sprintPressed=!0),tt==="j"&&(I.attackPressed=!0),tt==="k"&&(I.skill2=!0),tt>="1"&&tt<="5"&&(q=Number(tt)),tt>="6"&&tt<="9"&&(X=Number(tt)-5);const xt=Math.max(_d,s().keyStep||1.12);(tt==="="||tt==="+")&&(y*=xt),(tt==="-"||tt==="_")&&(y/=xt)},ht=V=>{const tt=V.key.toLowerCase();K.has(tt)&&(K.delete(tt),tt==="j"&&(I.attackReleased=!0))},pt=V=>{if(ps(V.target))return;V.preventDefault();const tt=V.deltaMode===1?V.deltaY*md:V.deltaMode===2?V.deltaY*gd:V.deltaY;y*=ud(tt,s().wheelStep)},ut=V=>{ps(V.target)||V.preventDefault()};return window.addEventListener("pointerdown",et),window.addEventListener("pointermove",ft),window.addEventListener("pointerup",vt),window.addEventListener("pointercancel",vt),window.addEventListener("keydown",$),window.addEventListener("keyup",ht),window.addEventListener("wheel",pt,{passive:!1}),window.addEventListener("gesturestart",ut),{sample(){const V=a();let tt=r!==null?Math.max(-1,Math.min(1,l/V)):0,xt=r!==null?Math.max(-1,Math.min(1,d/V)):0,Ct=0,St=0;(K.has("a")||K.has("arrowleft"))&&(Ct-=1),(K.has("d")||K.has("arrowright"))&&(Ct+=1),(K.has("w")||K.has("arrowup"))&&(St-=1),(K.has("s")||K.has("arrowdown"))&&(St+=1),tt+=Ct,xt+=St;let Ft=Math.hypot(tt,xt);Ft>1&&(tt/=Ft,xt/=Ft,Ft=1),Ft<e&&(tt=0,xt=0);const D=n();let ae=D.rightX*tt+D.forwardX*-xt,dt=D.rightZ*tt+D.forwardZ*-xt;const Rt=Math.hypot(ae,dt);Rt>1&&(ae/=Rt,dt/=Rt);const G=Math.hypot(S,M),at=(m!==null||L>0)&&G>pd;let rt=0,A=0;if(at){const Q=S/G,it=M/G,lt=D.rightX*Q+D.forwardX*-it,gt=D.rightZ*Q+D.forwardZ*-it,zt=Math.hypot(lt,gt)||1;rt=lt/zt,A=gt/zt}L>0&&(L-=1,L===0&&m===null&&(S=0,M=0));const v=_;_=null;const k=y;y=1;const J={moveX:ae,moveZ:dt,jumpPressed:I.jump,sprintHeld:W.sprint||K.has("shift"),sprintPressed:I.sprintPressed,resetPressed:I.reset,attackPressed:I.attackPressed,attackHeld:W.attack||K.has("j"),attackReleased:I.attackReleased,skill2Pressed:I.skill2,weaponSlot:q,dummyClickId:X,aimX:rt,aimZ:A,aimActive:at};I.jump=!1,I.reset=!1,I.sprintPressed=!1,I.attackPressed=!1,I.attackReleased=!1,I.skill2=!1,q=0,X=0;const nt=r!==null?"pointer":K.size>0?"keyboard":"idle";return{intents:J,stickX:tt,stickY:xt,source:nt,tap:v,zoomScale:k}},dispose(){window.removeEventListener("pointerdown",et),window.removeEventListener("pointermove",ft),window.removeEventListener("pointerup",vt),window.removeEventListener("pointercancel",vt),window.removeEventListener("keydown",$),window.removeEventListener("keyup",ht),window.removeEventListener("wheel",pt),window.removeEventListener("gesturestart",ut);for(const V of Y)V()}}}const vd={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Md={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},yd={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:.7,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},Sd={core:vd,scene:Md,view:yd};function po(i){return JSON.parse(JSON.stringify(i))}const mo=Sd,Ed=po(mo.core),bd=po(mo.scene),Je=po(mo.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class sn{constructor(t,e,n,s,a="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),sn.nextNameID=sn.nextNameID||0,this.$name.id=`lil-gui-name-${++sn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Ad extends sn{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function gr(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Td={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:gr,toHexString:gr},ts={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},wd={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=ts.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return ts.toHexString(s)}},Rd={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=ts.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return ts.toHexString(s)}},Cd=[Td,ts,wd,Rd];function Pd(i){return Cd.find(t=>t.match(i))}class Ld extends sn{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Pd(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=gr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Ea extends sn{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Dd extends sn{constructor(t,e,n,s,a,r){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},n=x=>{const S=parseFloat(this.$input.value);isNaN(S)||(this._snapClampSetValue(S+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),n(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,d,u;const h=5,p=x=>{o=x.clientX,c=l=x.clientY,r=!0,d=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(r){const S=x.clientX-o,M=x.clientY-c;Math.abs(M)>h?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(S)>h&&_()}if(!r){const S=x.clientY-l;u-=S*this._step*this._arrowKeyMultiplier(x),d+u>this._max?u=this._max-d:d+u<this._min&&(u=this._min-d),this._snapClampSetValue(d+u)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},f=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",p),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",f)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(f,x,S,M,L)=>(f-x)/(S-x)*(L-M)+M,e=f=>{const x=this.$slider.getBoundingClientRect();let S=t(f,x.left,x.right,this._min,this._max);this._snapClampSetValue(S)},n=f=>{this._setDraggingStyle(!0),e(f.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=f=>{e(f.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=f=>{f.preventDefault(),this._setDraggingStyle(!0),e(f.touches[0].clientX),r=!1},d=f=>{f.touches.length>1||(this._hasScrollBar?(o=f.touches[0].clientX,c=f.touches[0].clientY,r=!0):l(f),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",h))},u=f=>{if(r){const x=f.touches[0].clientX-o,S=f.touches[0].clientY-c;Math.abs(x)>Math.abs(S)?l(f):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h))}else f.preventDefault(),e(f.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h)},p=this._callOnFinishChange.bind(this),g=400;let _;const m=f=>{if(Math.abs(f.deltaX)<Math.abs(f.deltaY)&&this._hasScrollBar)return;f.preventDefault();const S=this._normalizeMouseWheel(f)*this._step;this._snapClampSetValue(this.getValue()+S),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(p,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Id extends sn{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Ud extends sn{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Nd=`.lil-gui {
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
}`;function Fd(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let qo=!1;class sa{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!qo&&o&&(Fd(Nd),qo=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,a){if(Object(n)===n)return new Id(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new Dd(this,t,e,n,s,a);case"boolean":return new Ad(this,t,e);case"string":return new Ud(this,t,e);case"function":return new Ea(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new Ld(this,t,e,n)}addFolder(t){const e=new sa({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Ea||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Ea)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function kd(i,t,e,n){const s=document.getElementById("debug-panel"),a=s?new sa({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new sa({title:"实验台 · 调试面板"}),r=a.addFolder("模拟");r.add(e,"timeScale",0,3,.05).name("时间缩放"),r.add(e,"paused").name("暂停"),r.add({step:n.singleStep},"step").name("单步 (1 tick)"),r.add({reset:n.reset},"reset").name("复位全部");const o=a.addFolder("模块");o.add(i.modules,"movement").name("movement"),o.add(i.modules,"combat").name("combat"),o.add(i.modules,"links").name("links"),o.add(i.modules,"orientation").name("orientation"),o.add(i.modules,"targeting").name("targeting"),o.add(i.modules,"hits").name("hits"),o.add(i.modules,"separation").name("separation"),o.add(i.modules,"dash").name("dash"),o.add(i.modules,"camera").name("camera"),o.add(i.modules,"dummies").name("dummies"),o.add(i.modules,"abilities").name("abilities");const c=i.config,l=a.addFolder("移动参数");l.add(c,"moveSpeed",1,10,.1).name("移动速度"),l.add(c,"sprintMultiplier",1,3,.05).name("冲刺倍率"),l.add(c,"acceleration",1,40,.5).name("加速度"),l.add(c,"friction",1,40,.5).name("摩擦"),l.add(c,"gravity",5,60,.5).name("重力"),l.add(c,"jumpSpeed",2,16,.2).name("起跳速度"),l.add(c,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),l.add(c,"characterRadius",.1,.8,.01).name("角色半径"),l.add(c,"characterHeight",.6,2.2,.05).name("角色身高"),l.add(c,"strideLength",.3,3,.05).name("基础步幅"),l.add(c,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),l.add(c,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const d=a.addFolder("程序化步态 (v8)");d.add(t.gait,"strideGain",.1,2,.05).name("摆幅随速度增益"),d.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),d.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),d.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),d.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),d.add(t.gait,"plantLock",0,1,.05).name("脚落地锁定"),d.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),d.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),d.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),d.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆");const u=a.addFolder("程序动画 (v8c/v8d)");u.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),u.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),u.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const h=t.animation.stride;u.add(h,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),u.add(h,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),u.add(h,"cycles",1,3,1).name("每段跨步周期数"),u.add(h,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),u.add(h,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),u.add(h,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),u.add(h,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),u.add(h,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),u.add(h,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),u.add(h,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),u.add(h,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),u.add(h,"heavyScale",0,1,.01).name("大剑重击收敛系数"),u.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),u.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),u.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),u.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),u.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),u.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),u.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),u.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),u.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),u.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),u.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),u.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const p=c.combat,g=a.addFolder("战斗参数"),_=g.add(i.combat,"weapon",Jn).name("当前武器");g.add(p,"comboWindow",.1,2,.05).name("连击窗口 (s)"),g.add(p,"settle",0,.8,.01).name("段间停顿 (s)"),g.add(p,"attackMoveScale",0,1,.01).name("攻击时移动比例"),g.add(p,"autoCombo").name("按住自动连击"),g.add(p.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),g.add(p.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),g.add(p.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),g.add(p.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),g.add(p.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),g.add(p.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const m=c.abilities;g.add(m.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),g.add(m.arcane,"speed",3,24,.5).name("飞弹速度"),g.add(m.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),g.add(m.ring,"radius",.5,5,.1).name("电环半径"),g.add(m.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),g.add(m.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const f=c.orientation,x=a.addFolder("朝向参数");x.add(f,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),x.add(f,"headTurnRate",.5,40,.5).name("头部转向速率"),x.add(f,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),x.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),x.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),x.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const S=a.addFolder("惯性倾斜 / 盆骨 (v8g)"),M=t.lean;S.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),S.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),S.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),S.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),S.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),S.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),S.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),S.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),S.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=a.addFolder("足部 IK (v8g)"),w=t.ik;L.add(w,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),L.add(w,"weight",0,1,.01).name("钉地权重"),L.add(w,"attackScale",0,1,.01).name("攻击时权重倍率"),L.add(w,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const T=a.addFolder("程序动画 / 武器握持");T.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),T.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),T.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),T.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const C=c.targeting,b=a.addFolder("目标辅助");b.add(C,"targetAssist").name("启用目标辅助"),b.add(C,"range",1,14,.5).name("锁定范围 (m)"),b.add(C,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),b.add(C,"frontBias",0,4,.1).name("朝向加权"),b.add(C,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),b.add(C,"maxLungeScale",1,3,.1).name("前冲最大放大");const y=c.hits,R=a.addFolder("命中 / 受击 / 击退");R.add(y,"arcDeg",10,120,5).name("命中扇区半角 (°)"),R.add(y,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),R.add(y,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),R.add(y,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),R.add(y.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),R.add(y.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),R.add(y,"dummyReach",.5,4,.1).name("假人命中距离 (m)");const W=c.separation,I=a.addFolder("角色间分离");I.add(W,"iterations",1,8,1).name("迭代次数"),I.add(W,"slop",0,.05,.002).name("额外分离量 (m)");const q=c.dash,X=a.addFolder("冲刺 / 闪避");X.add(q,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),X.add(q,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),X.add(q,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),X.add(q,"blinkDistance",1,12,.25).name("闪现距离 (m)"),X.add(q,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),X.add(q,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),X.add(q,"blinkClearVelocity").name("闪现清空速度"),X.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),X.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const H=c.camera,K=a.addFolder("智能相机");K.add(H,"radius",2,18,.5).name("威胁评估半径 (m)"),K.add(H,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),K.add(H,"saturation",.5,8,.1).name("威胁归一化饱和"),K.add(H,"pushIn",0,.5,.01).name("无威胁推进比例"),K.add(H,"maxPullback",0,1,.02).name("最大拉远比例"),K.add(H,"maxOffset",0,6,.1).name("最大构图平移 (m)"),K.add(H,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),K.add(H,"framingBias",0,1,.05).name("威胁质心平移系数"),K.add(H,"attackBoost",0,2,.05).name("挥砍中额外加权"),K.add(H.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),K.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Y=a.addFolder("输入");Y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),Y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const et=c.dummies,ft=a.addFolder("假人参数");ft.add(et,"moveSpeed",.5,8,.1).name("移动速度"),ft.add(et,"wanderRadius",.5,8,.1).name("游走半径"),ft.add(et,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),ft.add(et,"followStopDistance",.3,5,.1).name("跟随停距"),ft.add(et,"keepDistance",1,10,.1).name("保持距离"),ft.add(et,"keepDeadZone",.1,2,.05).name("保持死区"),ft.add(et,"attackRange",.5,5,.1).name("攻击距离"),ft.add(et,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const _t=a.addFolder("相机");_t.add(t.camera,"pitchDeg",20,80,1).name("俯角"),_t.add(t.camera,"yawDeg",-180,180,1).name("方位角"),_t.add(t.camera,"distance",6,35,.5).name("距离"),_t.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),_t.add(t.camera,"fov",25,90,1).name("FOV");const vt=a.addFolder("相机缩放 (v8e)");vt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),vt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),vt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),vt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),vt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),vt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),vt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),vt.add({reset:n.resetZoom},"reset").name("缩放归 1");const wt=a.addFolder("受击分层 (v8f)"),$=t.hurt;wt.add($,"enabled").name("启用分层受击 (关=旧版对照)"),wt.add($,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),wt.add($,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),wt.add($,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),wt.add($,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),wt.add($,"upperShiftScale",0,1,.01).name("上身位移缩放"),wt.add($,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),wt.add($.hitHeight,"light",0,1,.01).name("轻击命中部位"),wt.add($.hitHeight,"heavy",0,1,.01).name("重击命中部位"),wt.add($.hitHeight,"knock",0,1,.01).name("击退命中部位"),wt.add($,"leanLight",0,1.5,.01).name("轻击力度"),wt.add($,"leanHeavy",0,1.5,.01).name("重击力度"),wt.add($,"leanKnock",0,1.5,.01).name("击退力度"),wt.add($,"flashStrength",0,2,.05).name("受击闪光强度");const ht=[{name:"打腹 (abdomen)",p:$.abdomen},{name:"打肩 (shoulder)",p:$.shoulder}].map(({name:xt,p:Ct})=>{const St=wt.addFolder(xt);return St.add(Ct,"upperPitch",0,2,.01).name("上身前后倾斜"),St.add(Ct,"upperRoll",0,2,.01).name("上身侧倾"),St.add(Ct,"upperYaw",0,1.5,.01).name("肩部扭转"),St.add(Ct,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),St.add(Ct,"shift",0,.8,.01).name("身体反应位移"),St.add(Ct,"drop",0,.4,.01).name("整体下沉"),St.add(Ct,"back",0,.4,.01).name("屁股向后"),St.add(Ct,"knee",0,1.6,.01).name("屈膝"),St.add(Ct,"hip",0,1,.01).name("髋前倾"),St.add(Ct,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),St}),pt=a.addFolder("派生招 (v9a)"),ut=i.config.links;pt.add(ut,"enabled").name("总开关 (false=旧连击)"),pt.add(ut.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),pt.add(ut.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),pt.add(ut.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),pt.add(ut,"sharedCooldown",0,3,.05).name("共享 CD (s)"),pt.add(ut,"triggerWhileSprinting").name("长跑中可直接触发"),pt.add(ut.search,"range",1,14,.1).name("索敌距离 (m)"),pt.add(ut.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),pt.add(ut.search,"stopDistance",0,3,.05).name("停住距离 (m)");const V=ut.moves["sword-shield"];V&&(pt.add(V,"enabled").name("剑盾盾击"),pt.add(V,"distance",0,8,.1).name("冲锋极限 (m)"),pt.add(V,"windup",0,.5,.01).name("前摇 (s)"),pt.add(V,"active",0,.8,.01).name("冲锋 / 命中 (s)"),pt.add(V,"recovery",0,.8,.01).name("收势 (s)"),pt.add(V.hit,"radius",0,4,.05).name("命中半径 (m)"),pt.add(V.hit,"width",0,2,.05).name("扫掠半径 (m)"),pt.add(V.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),pt.add(V.hit,"duration",0,1.5,.01).name("僵直 (s)")),pt.add(i.config.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const tt=a.addFolder("显示");return tt.add(e,"showColliders").name("碰撞盒线框").onChange(n.onToggleColliders),tt.add(e,"showGrid").name("地面网格").onChange(n.onToggleGrid),l.close(),u.close(),g.close(),x.close(),T.close(),S.close(),L.close(),b.close(),R.close(),I.close(),X.close(),K.close(),Y.close(),o.close(),ft.close(),_t.close(),vt.close(),wt.close(),pt.close(),ht.forEach(xt=>xt.close()),tt.close(),a.close(),{gui:a,refreshWeapon:()=>_.updateDisplay()}}const zd=["剑盾","双剑","大剑","法杖","弓"],Od={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function Bd(i){return{update(t,e,n,s,a,r){const o=t.character,c=o.position,l=o.velocity,d=t.combat,u=t.events.length>0?t.events[t.events.length-1]:null,h=tt=>tt.toFixed(2),p=tt=>(tt*180/Math.PI).toFixed(0),g=zd[Jn.indexOf(d.weapon)]??d.weapon,_=Math.round(d.charge*10),m="|".repeat(_)+".".repeat(10-_),f=t.dash,x=f.phase==="active"&&f.duration>0?(1-f.timer/f.duration)*100:0,S=f.phase==="active"?`${f.kind}@${x.toFixed(0)}%`:`${f.kind} cd${h(f.cooldown)}`,M=s.intents.aimActive?`(${h(s.intents.aimX)},${h(s.intents.aimZ)})`:"-",L=l.x*Math.sin(o.bodyYaw)+l.z*Math.cos(o.bodyYaw),w=l.x*Math.cos(o.bodyYaw)-l.z*Math.sin(o.bodyYaw),T=Math.abs(L)+Math.abs(w)+1e-6,C=Math.round(Math.abs(w)/T*100),b=`strafe ${C}%${L<-.05?" back":""}`,y=t.camera,R=`threat ${(y.threat*100).toFixed(0)}%  dist×${h(y.distanceScale)}  off (${h(y.offsetX)},${h(y.offsetZ)})  pitch +${h(y.pitchDelta)}°  n=${y.threatCount}`,W=r?h(r.attackBlend):"-",I=r==null?void 0:r.attackWeights,q=I?`gw ${h(I.gaitScale)}  lw ${h(I.attackLegWeight)}  spd ${h(I.driveSpeed)}`:"-",X=I?`${h(I.gaitScale)}/${h(I.attackLegWeight)}`:"-",H=r?`${r.landing.kind} ${h(r.landing.pulse)} t${h(r.landing.remaining)} vy${h(r.landing.impactVy)}`:"-",K=r?`${r.landing.kind}/${h(r.landing.pulse)}`:"-",Y=(r==null?void 0:r.zoom)!==void 0?`zoom ×${h(r.zoom)}`:"-",et=r==null?void 0:r.hurt,ft=et?`hurt ${t.playerHurt.type}  部位h${h(et.hitHeight)}  脉冲p${h(et.pulse)}  上身${h(et.upperShift)}  重心${h(et.comShift)}  后坐${h(et.pelvisBack)}  屈膝${h(et.knee)}`:"-",_t=et?`${h(et.hitHeight)}/${h(et.pulse)}/${h(et.knee)}`:"-",vt=r==null?void 0:r.ik,wt=vt?`${vt.active?"on":"off"} w${h(vt.weight)} e${h(vt.maxError)}`:"-",$=t.playerLink,ht=`link ${$.kind||"-"}  ${$.phase}  prog ${h($.progress)}  win ${h($.linkWindow)}s  cd ${h($.cooldown)}s  hits ${$.hitIds.length}  travel ${h($.travelled)}/${h($.travel)}m  id ${$.id}`,pt=`${$.phase}/${$.kind||"-"}/w${h($.linkWindow)}`,ut=t.dummies.map(tt=>`${tt.id}:${Od[tt.mode]}`).join("  ");window.innerHeight>window.innerWidth?i.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${n}`,`pos (${h(c.x)},${h(c.y)},${h(c.z)})  vel (${h(l.x)},${h(l.y)},${h(l.z)})`,`face ${p(o.facing)}  body ${p(o.bodyYaw)}  head ${p(o.headYaw)}  move ${p(o.moveYaw)}  st${C}%`,`weapon ${g}  ${d.phase}  combo ${d.comboIndex}/3  atk ${h(d.attackProgress)}  dash ${S}  ab ${W}  gw/lw ${X}  land ${K}  ik ${wt}`,`aim ${M}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${h(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${_t}`,`dummies ${ut}  atkCount ${t.dummyAttackCount}  cam ${(y.threat*100).toFixed(0)}% ×${h(y.distanceScale)}  ${Y}  lk ${pt}`,`event ${u?`${u.type} ${h(u.value)}`:"-"}  scale ${h(a.timeScale)}${a.paused?" [P]":""}`].join(`
`):i.textContent=[`tick ${t.tick}   t ${h(t.time)}s   fps ${e.toFixed(0)}   steps ${n}`,`pos  (${h(c.x)}, ${h(c.y)}, ${h(c.z)})`,`vel  (${h(l.x)}, ${h(l.y)}, ${h(l.z)})`,`grounded ${o.grounded?"Y":"N"}   sprint ${o.sprinting?"Y":"N"}   facing ${p(o.facing)}deg   atkBlend ${W}   ${q}   land ${H}`,ft,`ik ${wt}  clamped ${vt?vt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${p(o.facing)}  body ${p(o.bodyYaw)}  head ${p(o.headYaw)}  move ${p(o.moveYaw)}  (head-body ${p(o.headYaw-o.bodyYaw)})  ${b}`,`move (${h(s.intents.moveX)}, ${h(s.intents.moveZ)})  stick (${h(s.stickX)}, ${h(s.stickY)})  ${s.source}  aim ${M}`,`weapon ${g}  phase ${d.phase}  combo ${d.comboIndex}/3  atk ${h(d.attackProgress)}${d.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${f.kind}  phase ${f.phase}  prog ${x.toFixed(0)}%  cd ${h(f.cooldown)}s  id ${f.id}  from (${h(f.fromX)},${h(f.fromZ)}) → to (${h(f.toX)},${h(f.toZ)})`,ht,`camera ${R}  ${Y}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${h(t.targeting.targetDist)}m  face ${p(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${m}] ${(d.charge*100).toFixed(0)}%  charging ${d.charging?"Y":"N"}`,`dummies ${ut}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${h(t.impulse.x)}, ${h(t.impulse.z)})`,`event ${u?`${u.type} ${h(u.value)}`:"-"}   scale ${h(a.timeScale)}${a.paused?" [PAUSED]":""}`].join(`
`)}}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const go="170",Hd=0,jo=1,Vd=2,ml=1,gl=2,gn=3,Nn=0,Pe=1,Te=2,Dn=0,Ri=1,Ko=2,Jo=3,Qo=4,Gd=5,Zn=100,Wd=101,Xd=102,$d=103,Yd=104,Zd=200,qd=201,jd=202,Kd=203,_r=204,xr=205,Jd=206,Qd=207,tu=208,eu=209,nu=210,iu=211,su=212,au=213,ru=214,vr=0,Mr=1,yr=2,Li=3,Sr=4,Er=5,br=6,Ar=7,_o=0,ou=1,cu=2,In=0,lu=1,hu=2,du=3,uu=4,fu=5,pu=6,mu=7,_l=300,Di=301,Ii=302,Tr=303,wr=304,ua=306,Rr=1e3,jn=1001,Cr=1002,Ze=1003,gu=1004,ms=1005,nn=1006,ba=1007,Kn=1008,yn=1009,xl=1010,vl=1011,es=1012,xo=1013,ti=1014,xn=1015,is=1016,vo=1017,Mo=1018,Ui=1020,Ml=35902,yl=1021,Sl=1022,Ye=1023,El=1024,bl=1025,Ci=1026,Ni=1027,Al=1028,yo=1029,Tl=1030,So=1031,Eo=1033,Ys=33776,Zs=33777,qs=33778,js=33779,Pr=35840,Lr=35841,Dr=35842,Ir=35843,Ur=36196,Nr=37492,Fr=37496,kr=37808,zr=37809,Or=37810,Br=37811,Hr=37812,Vr=37813,Gr=37814,Wr=37815,Xr=37816,$r=37817,Yr=37818,Zr=37819,qr=37820,jr=37821,Ks=36492,Kr=36494,Jr=36495,wl=36283,Qr=36284,to=36285,eo=36286,_u=3200,xu=3201,Rl=0,vu=1,Pn="",Oe="srgb",ki="srgb-linear",fa="linear",ee="srgb",ci=7680,tc=519,Mu=512,yu=513,Su=514,Cl=515,Eu=516,bu=517,Au=518,Tu=519,no=35044,ec="300 es",vn=2e3,aa=2001;class zi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Js=Math.PI/180,io=180/Math.PI;function Un(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ye[i&255]+ye[i>>8&255]+ye[i>>16&255]+ye[i>>24&255]+"-"+ye[t&255]+ye[t>>8&255]+"-"+ye[t>>16&15|64]+ye[t>>24&255]+"-"+ye[e&63|128]+ye[e>>8&255]+"-"+ye[e>>16&255]+ye[e>>24&255]+ye[n&255]+ye[n>>8&255]+ye[n>>16&255]+ye[n>>24&255]).toLowerCase()}function Ce(i,t,e){return Math.max(t,Math.min(e,i))}function wu(i,t){return(i%t+t)%t}function Aa(i,t,e){return(1-e)*i+e*t}function en(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ne(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Ht{constructor(t=0,e=0){Ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*s+t.x,this.y=a*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Vt{constructor(t,e,n,s,a,r,o,c,l){Vt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l)}set(t,e,n,s,a,r,o,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=a,d[5]=c,d[6]=n,d[7]=r,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],h=n[2],p=n[5],g=n[8],_=s[0],m=s[3],f=s[6],x=s[1],S=s[4],M=s[7],L=s[2],w=s[5],T=s[8];return a[0]=r*_+o*x+c*L,a[3]=r*m+o*S+c*w,a[6]=r*f+o*M+c*T,a[1]=l*_+d*x+u*L,a[4]=l*m+d*S+u*w,a[7]=l*f+d*M+u*T,a[2]=h*_+p*x+g*L,a[5]=h*m+p*S+g*w,a[8]=h*f+p*M+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*r*d-e*o*l-n*a*d+n*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=d*r-o*l,h=o*c-d*a,p=l*a-r*c,g=e*u+n*h+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-d*n)*_,t[2]=(o*n-s*r)*_,t[3]=h*_,t[4]=(d*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=p*_,t[7]=(n*c-l*e)*_,t[8]=(r*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ta.makeScale(t,e)),this}rotate(t){return this.premultiply(Ta.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ta.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ta=new Vt;function Pl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ra(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ru(){const i=ra("canvas");return i.style.display="block",i}const nc={};function ji(i){i in nc||(nc[i]=!0,console.warn(i))}function Cu(i,t,e){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}function Pu(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Lu(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Zt={enabled:!0,workingColorSpace:ki,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ee&&(i.r=Mn(i.r),i.g=Mn(i.g),i.b=Mn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ee&&(i.r=Pi(i.r),i.g=Pi(i.g),i.b=Pi(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Pn?fa:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Mn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Pi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const ic=[.64,.33,.3,.6,.15,.06],sc=[.2126,.7152,.0722],ac=[.3127,.329],rc=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),oc=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Zt.define({[ki]:{primaries:ic,whitePoint:ac,transfer:fa,toXYZ:rc,fromXYZ:oc,luminanceCoefficients:sc,workingColorSpaceConfig:{unpackColorSpace:Oe},outputColorSpaceConfig:{drawingBufferColorSpace:Oe}},[Oe]:{primaries:ic,whitePoint:ac,transfer:ee,toXYZ:rc,fromXYZ:oc,luminanceCoefficients:sc,outputColorSpaceConfig:{drawingBufferColorSpace:Oe}}});let li;class Du{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{li===void 0&&(li=ra("canvas")),li.width=t.width,li.height=t.height;const n=li.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=li}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ra("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Mn(a[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Mn(e[n]/255)*255):e[n]=Mn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Iu=0;class Ll{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Iu++}),this.uuid=Un(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(wa(s[r].image)):a.push(wa(s[r]))}else a=wa(s);n.url=a}return e||(t.images[this.uuid]=n),n}}function wa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Du.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Uu=0;class Re extends zi{constructor(t=Re.DEFAULT_IMAGE,e=Re.DEFAULT_MAPPING,n=jn,s=jn,a=nn,r=Kn,o=Ye,c=yn,l=Re.DEFAULT_ANISOTROPY,d=Pn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Uu++}),this.uuid=Un(),this.name="",this.source=new Ll(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ht(0,0),this.repeat=new Ht(1,1),this.center=new Ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==_l)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Rr:t.x=t.x-Math.floor(t.x);break;case jn:t.x=t.x<0?0:1;break;case Cr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Rr:t.y=t.y-Math.floor(t.y);break;case jn:t.y=t.y<0?0:1;break;case Cr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Re.DEFAULT_IMAGE=null;Re.DEFAULT_MAPPING=_l;Re.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a;const c=t.elements,l=c[0],d=c[4],u=c[8],h=c[1],p=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(d-h)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(l+1)/2,M=(p+1)/2,L=(f+1)/2,w=(d+h)/4,T=(u+_)/4,C=(g+m)/4;return S>M&&S>L?S<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(S),s=w/n,a=T/n):M>L?M<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(M),n=w/s,a=C/s):L<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(L),n=T/a,s=C/a),this.set(n,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(h-d)*(h-d));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-_)/x,this.z=(h-d)/x,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Nu extends zi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new Re(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Ll(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ei extends Nu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Dl extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Fu extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ss{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,r,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3];const h=a[r+0],p=a[r+1],g=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(o===1){t[e+0]=h,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==h||l!==p||d!==g){let m=1-o;const f=c*h+l*p+d*g+u*_,x=f>=0?1:-1,S=1-f*f;if(S>Number.EPSILON){const L=Math.sqrt(S),w=Math.atan2(L,f*x);m=Math.sin(m*w)/L,o=Math.sin(o*w)/L}const M=o*x;if(c=c*m+h*M,l=l*m+p*M,d=d*m+g*M,u=u*m+_*M,m===1-o){const L=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=L,l*=L,d*=L,u*=L}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,a,r){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=a[r],h=a[r+1],p=a[r+2],g=a[r+3];return t[e]=o*g+d*u+c*p-l*h,t[e+1]=c*g+d*h+l*u-o*p,t[e+2]=l*g+d*p+o*h-c*u,t[e+3]=d*g-o*u-c*h-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(a/2),h=c(n/2),p=c(s/2),g=c(a/2);switch(r){case"XYZ":this._x=h*d*u+l*p*g,this._y=l*p*u-h*d*g,this._z=l*d*g+h*p*u,this._w=l*d*u-h*p*g;break;case"YXZ":this._x=h*d*u+l*p*g,this._y=l*p*u-h*d*g,this._z=l*d*g-h*p*u,this._w=l*d*u+h*p*g;break;case"ZXY":this._x=h*d*u-l*p*g,this._y=l*p*u+h*d*g,this._z=l*d*g+h*p*u,this._w=l*d*u-h*p*g;break;case"ZYX":this._x=h*d*u-l*p*g,this._y=l*p*u+h*d*g,this._z=l*d*g-h*p*u,this._w=l*d*u+h*p*g;break;case"YZX":this._x=h*d*u+l*p*g,this._y=l*p*u+h*d*g,this._z=l*d*g-h*p*u,this._w=l*d*u-h*p*g;break;case"XZY":this._x=h*d*u-l*p*g,this._y=l*p*u-h*d*g,this._z=l*d*g+h*p*u,this._w=l*d*u+h*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],d=e[6],u=e[10],h=n+o+u;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(d-c)*p,this._y=(a-l)*p,this._z=(r-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+r)/p,this._z=(a+l)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(a-l)/p,this._x=(s+r)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(r-s)/p,this._x=(a+l)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ce(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+r*o+s*l-a*c,this._y=s*d+r*c+a*o-n*l,this._z=a*d+r*l+n*c-s*o,this._w=r*d-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const p=1-e;return this._w=p*r+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,o),u=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=r*u+this._w*h,this._x=n*u+this._x*h,this._y=s*u+this._y*h,this._z=a*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{constructor(t=0,e=0,n=0){B.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(cc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(cc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*n),d=2*(o*e-a*s),u=2*(a*n-r*e);return this.x=e+c*l+r*u-o*d,this.y=n+c*d+o*l-a*u,this.z=s+c*u+a*d-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ra.copy(this).projectOnVector(t),this.sub(Ra)}reflect(t){return this.sub(Ra.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ra=new B,cc=new ss;class as{constructor(t=new B(1/0,1/0,1/0),e=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(We.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(We.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=We.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,We):We.fromBufferAttribute(a,r),We.applyMatrix4(t.matrixWorld),this.expandByPoint(We);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),gs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),gs.copy(n.boundingBox)),gs.applyMatrix4(t.matrixWorld),this.union(gs)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,We),We.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Vi),_s.subVectors(this.max,Vi),hi.subVectors(t.a,Vi),di.subVectors(t.b,Vi),ui.subVectors(t.c,Vi),bn.subVectors(di,hi),An.subVectors(ui,di),On.subVectors(hi,ui);let e=[0,-bn.z,bn.y,0,-An.z,An.y,0,-On.z,On.y,bn.z,0,-bn.x,An.z,0,-An.x,On.z,0,-On.x,-bn.y,bn.x,0,-An.y,An.x,0,-On.y,On.x,0];return!Ca(e,hi,di,ui,_s)||(e=[1,0,0,0,1,0,0,0,1],!Ca(e,hi,di,ui,_s))?!1:(xs.crossVectors(bn,An),e=[xs.x,xs.y,xs.z],Ca(e,hi,di,ui,_s))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,We).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(We).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const hn=[new B,new B,new B,new B,new B,new B,new B,new B],We=new B,gs=new as,hi=new B,di=new B,ui=new B,bn=new B,An=new B,On=new B,Vi=new B,_s=new B,xs=new B,Bn=new B;function Ca(i,t,e,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){Bn.fromArray(i,a);const o=s.x*Math.abs(Bn.x)+s.y*Math.abs(Bn.y)+s.z*Math.abs(Bn.z),c=t.dot(Bn),l=e.dot(Bn),d=n.dot(Bn);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const ku=new as,Gi=new B,Pa=new B;class pa{constructor(t=new B,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ku.setFromPoints(t).getCenter(n);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Gi.subVectors(t,this.center);const e=Gi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Gi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Pa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Gi.copy(t.center).add(Pa)),this.expandByPoint(Gi.copy(t.center).sub(Pa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const dn=new B,La=new B,vs=new B,Tn=new B,Da=new B,Ms=new B,Ia=new B;class bo{constructor(t=new B,e=new B(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(dn.copy(this.origin).addScaledVector(this.direction,e),dn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){La.copy(t).add(e).multiplyScalar(.5),vs.copy(e).sub(t).normalize(),Tn.copy(this.origin).sub(La);const a=t.distanceTo(e)*.5,r=-this.direction.dot(vs),o=Tn.dot(this.direction),c=-Tn.dot(vs),l=Tn.lengthSq(),d=Math.abs(1-r*r);let u,h,p,g;if(d>0)if(u=r*c-o,h=r*o-c,g=a*d,u>=0)if(h>=-g)if(h<=g){const _=1/d;u*=_,h*=_,p=u*(u+r*h+2*o)+h*(r*u+h+2*c)+l}else h=a,u=Math.max(0,-(r*h+o)),p=-u*u+h*(h+2*c)+l;else h=-a,u=Math.max(0,-(r*h+o)),p=-u*u+h*(h+2*c)+l;else h<=-g?(u=Math.max(0,-(-r*a+o)),h=u>0?-a:Math.min(Math.max(-a,-c),a),p=-u*u+h*(h+2*c)+l):h<=g?(u=0,h=Math.min(Math.max(-a,-c),a),p=h*(h+2*c)+l):(u=Math.max(0,-(r*a+o)),h=u>0?a:Math.min(Math.max(-a,-c),a),p=-u*u+h*(h+2*c)+l);else h=r>0?-a:a,u=Math.max(0,-(r*h+o)),p=-u*u+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(La).addScaledVector(vs,h),p}intersectSphere(t,e){dn.subVectors(t.center,this.origin);const n=dn.dot(this.direction),s=dn.dot(dn)-n*n,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,r,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(n=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(n=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),d>=0?(a=(t.min.y-h.y)*d,r=(t.max.y-h.y)*d):(a=(t.max.y-h.y)*d,r=(t.min.y-h.y)*d),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(t.min.z-h.z)*u,c=(t.max.z-h.z)*u):(o=(t.max.z-h.z)*u,c=(t.min.z-h.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,dn)!==null}intersectTriangle(t,e,n,s,a){Da.subVectors(e,t),Ms.subVectors(n,t),Ia.crossVectors(Da,Ms);let r=this.direction.dot(Ia),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Tn.subVectors(this.origin,t);const c=o*this.direction.dot(Ms.crossVectors(Tn,Ms));if(c<0)return null;const l=o*this.direction.dot(Da.cross(Tn));if(l<0||c+l>r)return null;const d=-o*Tn.dot(Ia);return d<0?null:this.at(d/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,s,a,r,o,c,l,d,u,h,p,g,_,m){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l,d,u,h,p,g,_,m)}set(t,e,n,s,a,r,o,c,l,d,u,h,p,g,_,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=a,f[5]=r,f[9]=o,f[13]=c,f[2]=l,f[6]=d,f[10]=u,f[14]=h,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/fi.setFromMatrixColumn(t,0).length(),a=1/fi.setFromMatrixColumn(t,1).length(),r=1/fi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(a),u=Math.sin(a);if(t.order==="XYZ"){const h=r*d,p=r*u,g=o*d,_=o*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=h-_*l,e[9]=-o*c,e[2]=_-h*l,e[6]=g+p*l,e[10]=r*c}else if(t.order==="YXZ"){const h=c*d,p=c*u,g=l*d,_=l*u;e[0]=h+_*o,e[4]=g*o-p,e[8]=r*l,e[1]=r*u,e[5]=r*d,e[9]=-o,e[2]=p*o-g,e[6]=_+h*o,e[10]=r*c}else if(t.order==="ZXY"){const h=c*d,p=c*u,g=l*d,_=l*u;e[0]=h-_*o,e[4]=-r*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=r*d,e[9]=_-h*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const h=r*d,p=r*u,g=o*d,_=o*u;e[0]=c*d,e[4]=g*l-p,e[8]=h*l+_,e[1]=c*u,e[5]=_*l+h,e[9]=p*l-g,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const h=r*c,p=r*l,g=o*c,_=o*l;e[0]=c*d,e[4]=_-h*u,e[8]=g*u+p,e[1]=u,e[5]=r*d,e[9]=-o*d,e[2]=-l*d,e[6]=p*u+g,e[10]=h-_*u}else if(t.order==="XZY"){const h=r*c,p=r*l,g=o*c,_=o*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=h*u+_,e[5]=r*d,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*d,e[10]=_*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zu,t,Ou)}lookAt(t,e,n){const s=this.elements;return Ne.subVectors(t,e),Ne.lengthSq()===0&&(Ne.z=1),Ne.normalize(),wn.crossVectors(n,Ne),wn.lengthSq()===0&&(Math.abs(n.z)===1?Ne.x+=1e-4:Ne.z+=1e-4,Ne.normalize(),wn.crossVectors(n,Ne)),wn.normalize(),ys.crossVectors(Ne,wn),s[0]=wn.x,s[4]=ys.x,s[8]=Ne.x,s[1]=wn.y,s[5]=ys.y,s[9]=Ne.y,s[2]=wn.z,s[6]=ys.z,s[10]=Ne.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],h=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],x=n[3],S=n[7],M=n[11],L=n[15],w=s[0],T=s[4],C=s[8],b=s[12],y=s[1],R=s[5],W=s[9],I=s[13],q=s[2],X=s[6],H=s[10],K=s[14],Y=s[3],et=s[7],ft=s[11],_t=s[15];return a[0]=r*w+o*y+c*q+l*Y,a[4]=r*T+o*R+c*X+l*et,a[8]=r*C+o*W+c*H+l*ft,a[12]=r*b+o*I+c*K+l*_t,a[1]=d*w+u*y+h*q+p*Y,a[5]=d*T+u*R+h*X+p*et,a[9]=d*C+u*W+h*H+p*ft,a[13]=d*b+u*I+h*K+p*_t,a[2]=g*w+_*y+m*q+f*Y,a[6]=g*T+_*R+m*X+f*et,a[10]=g*C+_*W+m*H+f*ft,a[14]=g*b+_*I+m*K+f*_t,a[3]=x*w+S*y+M*q+L*Y,a[7]=x*T+S*R+M*X+L*et,a[11]=x*C+S*W+M*H+L*ft,a[15]=x*b+S*I+M*K+L*_t,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],d=t[2],u=t[6],h=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+a*c*u-s*l*u-a*o*h+n*l*h+s*o*p-n*c*p)+_*(+e*c*p-e*l*h+a*r*h-s*r*p+s*l*d-a*c*d)+m*(+e*l*u-e*o*p-a*r*u+n*r*p+a*o*d-n*l*d)+f*(-s*o*d-e*c*u+e*o*h+s*r*u-n*r*h+n*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=t[9],h=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],x=u*m*l-_*h*l+_*c*p-o*m*p-u*c*f+o*h*f,S=g*h*l-d*m*l-g*c*p+r*m*p+d*c*f-r*h*f,M=d*_*l-g*u*l+g*o*p-r*_*p-d*o*f+r*u*f,L=g*u*c-d*_*c-g*o*h+r*_*h+d*o*m-r*u*m,w=e*x+n*S+s*M+a*L;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return t[0]=x*T,t[1]=(_*h*a-u*m*a-_*s*p+n*m*p+u*s*f-n*h*f)*T,t[2]=(o*m*a-_*c*a+_*s*l-n*m*l-o*s*f+n*c*f)*T,t[3]=(u*c*a-o*h*a-u*s*l+n*h*l+o*s*p-n*c*p)*T,t[4]=S*T,t[5]=(d*m*a-g*h*a+g*s*p-e*m*p-d*s*f+e*h*f)*T,t[6]=(g*c*a-r*m*a-g*s*l+e*m*l+r*s*f-e*c*f)*T,t[7]=(r*h*a-d*c*a+d*s*l-e*h*l-r*s*p+e*c*p)*T,t[8]=M*T,t[9]=(g*u*a-d*_*a-g*n*p+e*_*p+d*n*f-e*u*f)*T,t[10]=(r*_*a-g*o*a+g*n*l-e*_*l-r*n*f+e*o*f)*T,t[11]=(d*o*a-r*u*a-d*n*l+e*u*l+r*n*p-e*o*p)*T,t[12]=L*T,t[13]=(d*_*s-g*u*s+g*n*h-e*_*h-d*n*m+e*u*m)*T,t[14]=(g*o*s-r*_*s-g*n*c+e*_*c+r*n*m-e*o*m)*T,t[15]=(r*u*s-d*o*s+d*n*c-e*u*c-r*n*h+e*o*h)*T,this}scale(t){const e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),a=1-n,r=t.x,o=t.y,c=t.z,l=a*r,d=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*r,0,l*c-s*o,d*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,r){return this.set(1,n,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,d=r+r,u=o+o,h=a*l,p=a*d,g=a*u,_=r*d,m=r*u,f=o*u,x=c*l,S=c*d,M=c*u,L=n.x,w=n.y,T=n.z;return s[0]=(1-(_+f))*L,s[1]=(p+M)*L,s[2]=(g-S)*L,s[3]=0,s[4]=(p-M)*w,s[5]=(1-(h+f))*w,s[6]=(m+x)*w,s[7]=0,s[8]=(g+S)*T,s[9]=(m-x)*T,s[10]=(1-(h+_))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let a=fi.set(s[0],s[1],s[2]).length();const r=fi.set(s[4],s[5],s[6]).length(),o=fi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],Xe.copy(this);const l=1/a,d=1/r,u=1/o;return Xe.elements[0]*=l,Xe.elements[1]*=l,Xe.elements[2]*=l,Xe.elements[4]*=d,Xe.elements[5]*=d,Xe.elements[6]*=d,Xe.elements[8]*=u,Xe.elements[9]*=u,Xe.elements[10]*=u,e.setFromRotationMatrix(Xe),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,s,a,r,o=vn){const c=this.elements,l=2*a/(e-t),d=2*a/(n-s),u=(e+t)/(e-t),h=(n+s)/(n-s);let p,g;if(o===vn)p=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===aa)p=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,a,r,o=vn){const c=this.elements,l=1/(e-t),d=1/(n-s),u=1/(r-a),h=(e+t)*l,p=(n+s)*d;let g,_;if(o===vn)g=(r+a)*u,_=-2*u;else if(o===aa)g=a*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const fi=new B,Xe=new oe,zu=new B(0,0,0),Ou=new B(1,1,1),wn=new B,ys=new B,Ne=new B,lc=new oe,hc=new ss;class an{constructor(t=0,e=0,n=0,s=an.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],h=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Ce(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ce(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ce(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Ce(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Ce(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ce(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return lc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(lc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return hc.setFromEuler(this),this.setFromQuaternion(hc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}an.DEFAULT_ORDER="XYZ";class Ao{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Bu=0;const dc=new B,pi=new ss,un=new oe,Ss=new B,Wi=new B,Hu=new B,Vu=new ss,uc=new B(1,0,0),fc=new B(0,1,0),pc=new B(0,0,1),mc={type:"added"},Gu={type:"removed"},mi={type:"childadded",child:null},Ua={type:"childremoved",child:null};class he extends zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bu++}),this.uuid=Un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=he.DEFAULT_UP.clone();const t=new B,e=new an,n=new ss,s=new B(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new oe},normalMatrix:{value:new Vt}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=he.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ao,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return pi.setFromAxisAngle(t,e),this.quaternion.multiply(pi),this}rotateOnWorldAxis(t,e){return pi.setFromAxisAngle(t,e),this.quaternion.premultiply(pi),this}rotateX(t){return this.rotateOnAxis(uc,t)}rotateY(t){return this.rotateOnAxis(fc,t)}rotateZ(t){return this.rotateOnAxis(pc,t)}translateOnAxis(t,e){return dc.copy(t).applyQuaternion(this.quaternion),this.position.add(dc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(uc,t)}translateY(t){return this.translateOnAxis(fc,t)}translateZ(t){return this.translateOnAxis(pc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(un.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ss.copy(t):Ss.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Wi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?un.lookAt(Wi,Ss,this.up):un.lookAt(Ss,Wi,this.up),this.quaternion.setFromRotationMatrix(un),s&&(un.extractRotation(s.matrixWorld),pi.setFromRotationMatrix(un),this.quaternion.premultiply(pi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(mc),mi.child=t,this.dispatchEvent(mi),mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Gu),Ua.child=t,this.dispatchEvent(Ua),Ua.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),un.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),un.multiply(t.parent.matrixWorld)),t.applyMatrix4(un),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(mc),mi.child=t,this.dispatchEvent(mi),mi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wi,t,Hu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Wi,Vu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];a(t.shapes,u)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),d=r(t.images),u=r(t.shapes),h=r(t.skeletons),p=r(t.animations),g=r(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),h.length>0&&(n.skeletons=h),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}he.DEFAULT_UP=new B(0,1,0);he.DEFAULT_MATRIX_AUTO_UPDATE=!0;he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const $e=new B,fn=new B,Na=new B,pn=new B,gi=new B,_i=new B,gc=new B,Fa=new B,ka=new B,za=new B,Oa=new le,Ba=new le,Ha=new le;class ke{constructor(t=new B,e=new B,n=new B){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),$e.subVectors(t,e),s.cross($e);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){$e.subVectors(s,e),fn.subVectors(n,e),Na.subVectors(t,e);const r=$e.dot($e),o=$e.dot(fn),c=$e.dot(Na),l=fn.dot(fn),d=fn.dot(Na),u=r*l-o*o;if(u===0)return a.set(0,0,0),null;const h=1/u,p=(l*c-o*d)*h,g=(r*d-o*c)*h;return a.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,pn)===null?!1:pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getInterpolation(t,e,n,s,a,r,o,c){return this.getBarycoord(t,e,n,s,pn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,pn.x),c.addScaledVector(r,pn.y),c.addScaledVector(o,pn.z),c)}static getInterpolatedAttribute(t,e,n,s,a,r){return Oa.setScalar(0),Ba.setScalar(0),Ha.setScalar(0),Oa.fromBufferAttribute(t,e),Ba.fromBufferAttribute(t,n),Ha.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Oa,a.x),r.addScaledVector(Ba,a.y),r.addScaledVector(Ha,a.z),r}static isFrontFacing(t,e,n,s){return $e.subVectors(n,e),fn.subVectors(t,e),$e.cross(fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return $e.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),$e.cross(fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ke.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ke.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,a){return ke.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return ke.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ke.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,a=this.c;let r,o;gi.subVectors(s,n),_i.subVectors(a,n),Fa.subVectors(t,n);const c=gi.dot(Fa),l=_i.dot(Fa);if(c<=0&&l<=0)return e.copy(n);ka.subVectors(t,s);const d=gi.dot(ka),u=_i.dot(ka);if(d>=0&&u<=d)return e.copy(s);const h=c*u-d*l;if(h<=0&&c>=0&&d<=0)return r=c/(c-d),e.copy(n).addScaledVector(gi,r);za.subVectors(t,a);const p=gi.dot(za),g=_i.dot(za);if(g>=0&&p<=g)return e.copy(a);const _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(_i,o);const m=d*g-p*u;if(m<=0&&u-d>=0&&p-g>=0)return gc.subVectors(a,s),o=(u-d)/(u-d+(p-g)),e.copy(s).addScaledVector(gc,o);const f=1/(m+_+h);return r=_*f,o=h*f,e.copy(n).addScaledVector(gi,r).addScaledVector(_i,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Il={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rn={h:0,s:0,l:0},Es={h:0,s:0,l:0};function Va(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Zt.workingColorSpace){if(t=wu(t,1),e=Ce(e,0,1),n=Ce(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=Va(r,a,t+1/3),this.g=Va(r,a,t),this.b=Va(r,a,t-1/3)}return Zt.toWorkingColorSpace(this,s),this}setStyle(t,e=Oe){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Oe){const n=Il[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Mn(t.r),this.g=Mn(t.g),this.b=Mn(t.b),this}copyLinearToSRGB(t){return this.r=Pi(t.r),this.g=Pi(t.g),this.b=Pi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Oe){return Zt.fromWorkingColorSpace(Se.copy(this),t),Math.round(Ce(Se.r*255,0,255))*65536+Math.round(Ce(Se.g*255,0,255))*256+Math.round(Ce(Se.b*255,0,255))}getHexString(t=Oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.fromWorkingColorSpace(Se.copy(this),e);const n=Se.r,s=Se.g,a=Se.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let c,l;const d=(o+r)/2;if(o===r)c=0,l=0;else{const u=r-o;switch(l=d<=.5?u/(r+o):u/(2-r-o),r){case n:c=(s-a)/u+(s<a?6:0);break;case s:c=(a-n)/u+2;break;case a:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=Zt.workingColorSpace){return Zt.fromWorkingColorSpace(Se.copy(this),e),t.r=Se.r,t.g=Se.g,t.b=Se.b,t}getStyle(t=Oe){Zt.fromWorkingColorSpace(Se.copy(this),t);const e=Se.r,n=Se.g,s=Se.b;return t!==Oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Rn),this.setHSL(Rn.h+t,Rn.s+e,Rn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Rn),t.getHSL(Es);const n=Aa(Rn.h,Es.h,e),s=Aa(Rn.s,Es.s,e),a=Aa(Rn.l,Es.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Se=new Bt;Bt.NAMES=Il;let Wu=0;class ni extends zi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wu++}),this.uuid=Un(),this.name="",this.blending=Ri,this.side=Nn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_r,this.blendDst=xr,this.blendEquation=Zn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=Li,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ci,this.stencilZFail=ci,this.stencilZPass=ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ri&&(n.blending=this.blending),this.side!==Nn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==_r&&(n.blendSrc=this.blendSrc),this.blendDst!==xr&&(n.blendDst=this.blendDst),this.blendEquation!==Zn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Li&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ci&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ci&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ci&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Qe extends ni{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new an,this.combine=_o,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const me=new B,bs=new Ht;class qe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=no,this.updateRanges=[],this.gpuType=xn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)bs.fromBufferAttribute(this,e),bs.applyMatrix3(t),this.setXY(e,bs.x,bs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=en(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ne(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=en(e,this.array)),e}setX(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=en(e,this.array)),e}setY(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=en(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=en(e,this.array)),e}setW(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array),a=ne(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==no&&(t.usage=this.usage),t}}class Ul extends qe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Nl extends qe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class de extends qe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Xu=0;const ze=new oe,Ga=new he,xi=new B,Fe=new as,Xi=new as,ve=new B;class Le extends zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xu++}),this.uuid=Un(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Pl(t)?Nl:Ul)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Vt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ze.makeRotationFromQuaternion(t),this.applyMatrix4(ze),this}rotateX(t){return ze.makeRotationX(t),this.applyMatrix4(ze),this}rotateY(t){return ze.makeRotationY(t),this.applyMatrix4(ze),this}rotateZ(t){return ze.makeRotationZ(t),this.applyMatrix4(ze),this}translate(t,e,n){return ze.makeTranslation(t,e,n),this.applyMatrix4(ze),this}scale(t,e,n){return ze.makeScale(t,e,n),this.applyMatrix4(ze),this}lookAt(t){return Ga.lookAt(t),Ga.updateMatrix(),this.applyMatrix4(Ga.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xi).negate(),this.translate(xi.x,xi.y,xi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new de(n,3))}else{for(let n=0,s=e.count;n<s;n++){const a=t[n];e.setXYZ(n,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new as);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const a=e[n];Fe.setFromBufferAttribute(a),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,Fe.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,Fe.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(Fe.min),this.boundingBox.expandByPoint(Fe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(t){const n=this.boundingSphere.center;if(Fe.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];Xi.setFromBufferAttribute(o),this.morphTargetsRelative?(ve.addVectors(Fe.min,Xi.min),Fe.expandByPoint(ve),ve.addVectors(Fe.max,Xi.max),Fe.expandByPoint(ve)):(Fe.expandByPoint(Xi.min),Fe.expandByPoint(Xi.max))}Fe.getCenter(n);let s=0;for(let a=0,r=t.count;a<r;a++)ve.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(ve));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)ve.fromBufferAttribute(o,l),c&&(xi.fromBufferAttribute(t,l),ve.add(xi)),s=Math.max(s,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qe(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<n.count;C++)o[C]=new B,c[C]=new B;const l=new B,d=new B,u=new B,h=new Ht,p=new Ht,g=new Ht,_=new B,m=new B;function f(C,b,y){l.fromBufferAttribute(n,C),d.fromBufferAttribute(n,b),u.fromBufferAttribute(n,y),h.fromBufferAttribute(a,C),p.fromBufferAttribute(a,b),g.fromBufferAttribute(a,y),d.sub(l),u.sub(l),p.sub(h),g.sub(h);const R=1/(p.x*g.y-g.x*p.y);isFinite(R)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(R),m.copy(u).multiplyScalar(p.x).addScaledVector(d,-g.x).multiplyScalar(R),o[C].add(_),o[b].add(_),o[y].add(_),c[C].add(m),c[b].add(m),c[y].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let C=0,b=x.length;C<b;++C){const y=x[C],R=y.start,W=y.count;for(let I=R,q=R+W;I<q;I+=3)f(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const S=new B,M=new B,L=new B,w=new B;function T(C){L.fromBufferAttribute(s,C),w.copy(L);const b=o[C];S.copy(b),S.sub(L.multiplyScalar(L.dot(b))).normalize(),M.crossVectors(w,b);const R=M.dot(c[C])<0?-1:1;r.setXYZW(C,S.x,S.y,S.z,R)}for(let C=0,b=x.length;C<b;++C){const y=x[C],R=y.start,W=y.count;for(let I=R,q=R+W;I<q;I+=3)T(t.getX(I+0)),T(t.getX(I+1)),T(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new qe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,p=n.count;h<p;h++)n.setXYZ(h,0,0,0);const s=new B,a=new B,r=new B,o=new B,c=new B,l=new B,d=new B,u=new B;if(t)for(let h=0,p=t.count;h<p;h+=3){const g=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,m),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,p=e.count;h<p;h+=3)s.fromBufferAttribute(e,h+0),a.fromBufferAttribute(e,h+1),r.fromBufferAttribute(e,h+2),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(o,c){const l=o.array,d=o.itemSize,u=o.normalized,h=new l.constructor(c.length*d);let p=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*d;for(let f=0;f<d;f++)h[g++]=l[p++]}return new qe(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let d=0,u=l.length;d<u;d++){const h=l[d],p=t(h,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,h=l.length;u<h;u++){const p=l[u];d.push(p.toJSON(t.data))}d.length>0&&(s[c]=d,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const a=t.morphAttributes;for(const l in a){const d=[],u=a[l];for(let h=0,p=u.length;h<p;h++)d.push(u[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,d=r.length;l<d;l++){const u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _c=new oe,Hn=new bo,As=new pa,xc=new B,Ts=new B,ws=new B,Rs=new B,Wa=new B,Cs=new B,vc=new B,Ps=new B;class re extends he{constructor(t=new Le,e=new Qe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){Cs.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const d=o[c],u=a[c];d!==0&&(Wa.fromBufferAttribute(u,t),r?Cs.addScaledVector(Wa,d):Cs.addScaledVector(Wa.sub(e),d))}e.add(Cs)}return e}raycast(t,e){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),As.copy(n.boundingSphere),As.applyMatrix4(a),Hn.copy(t.ray).recast(t.near),!(As.containsPoint(Hn.origin)===!1&&(Hn.intersectSphere(As,xc)===null||Hn.origin.distanceToSquared(xc)>(t.far-t.near)**2))&&(_c.copy(a).invert(),Hn.copy(t.ray).applyMatrix4(_c),!(n.boundingBox!==null&&Hn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Hn)))}_computeIntersections(t,e,n){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,h=a.groups,p=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,_=h.length;g<_;g++){const m=h[g],f=r[m.materialIndex],x=Math.max(m.start,p.start),S=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,L=S;M<L;M+=3){const w=o.getX(M),T=o.getX(M+1),C=o.getX(M+2);s=Ls(this,f,t,n,l,d,u,w,T,C),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const x=o.getX(m),S=o.getX(m+1),M=o.getX(m+2);s=Ls(this,r,t,n,l,d,u,x,S,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,_=h.length;g<_;g++){const m=h[g],f=r[m.materialIndex],x=Math.max(m.start,p.start),S=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let M=x,L=S;M<L;M+=3){const w=M,T=M+1,C=M+2;s=Ls(this,f,t,n,l,d,u,w,T,C),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const x=m,S=m+1,M=m+2;s=Ls(this,r,t,n,l,d,u,x,S,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function $u(i,t,e,n,s,a,r,o){let c;if(t.side===Pe?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,t.side===Nn,o),c===null)return null;Ps.copy(o),Ps.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ps);return l<e.near||l>e.far?null:{distance:l,point:Ps.clone(),object:i}}function Ls(i,t,e,n,s,a,r,o,c,l){i.getVertexPosition(o,Ts),i.getVertexPosition(c,ws),i.getVertexPosition(l,Rs);const d=$u(i,t,e,n,Ts,ws,Rs,vc);if(d){const u=new B;ke.getBarycoord(vc,Ts,ws,Rs,u),s&&(d.uv=ke.getInterpolatedAttribute(s,o,c,l,u,new Ht)),a&&(d.uv1=ke.getInterpolatedAttribute(a,o,c,l,u,new Ht)),r&&(d.normal=ke.getInterpolatedAttribute(r,o,c,l,u,new B),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:c,c:l,normal:new B,materialIndex:0};ke.getNormal(Ts,ws,Rs,h.normal),d.face=h,d.barycoord=u}return d}class rn extends Le{constructor(t=1,e=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],d=[],u=[];let h=0,p=0;g("z","y","x",-1,-1,n,e,t,r,a,0),g("z","y","x",1,-1,n,e,-t,r,a,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,a,4),g("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new de(l,3)),this.setAttribute("normal",new de(d,3)),this.setAttribute("uv",new de(u,2));function g(_,m,f,x,S,M,L,w,T,C,b){const y=M/T,R=L/C,W=M/2,I=L/2,q=w/2,X=T+1,H=C+1;let K=0,Y=0;const et=new B;for(let ft=0;ft<H;ft++){const _t=ft*R-I;for(let vt=0;vt<X;vt++){const wt=vt*y-W;et[_]=wt*x,et[m]=_t*S,et[f]=q,l.push(et.x,et.y,et.z),et[_]=0,et[m]=0,et[f]=w>0?1:-1,d.push(et.x,et.y,et.z),u.push(vt/T),u.push(1-ft/C),K+=1}}for(let ft=0;ft<C;ft++)for(let _t=0;_t<T;_t++){const vt=h+_t+X*ft,wt=h+_t+X*(ft+1),$=h+(_t+1)+X*(ft+1),ht=h+(_t+1)+X*ft;c.push(vt,wt,ht),c.push(wt,$,ht),Y+=6}o.addGroup(p,Y,b),p+=Y,h+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Fi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ae(i){const t={};for(let e=0;e<i.length;e++){const n=Fi(i[e]);for(const s in n)t[s]=n[s]}return t}function Yu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Fl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}const Zu={clone:Fi,merge:Ae};var qu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ju=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fn extends ni{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=qu,this.fragmentShader=ju,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Fi(t.uniforms),this.uniformsGroups=Yu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class kl extends he{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=vn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Cn=new B,Mc=new Ht,yc=new Ht;class Be extends kl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=io*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Js*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return io*2*Math.atan(Math.tan(Js*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Cn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Cn.x,Cn.y).multiplyScalar(-t/Cn.z),Cn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Cn.x,Cn.y).multiplyScalar(-t/Cn.z)}getViewSize(t,e){return this.getViewBounds(t,Mc,yc),e.subVectors(yc,Mc)}setViewOffset(t,e,n,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Js*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const vi=-90,Mi=1;class Ku extends he{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Be(vi,Mi,t,e);s.layers=this.layers,this.add(s);const a=new Be(vi,Mi,t,e);a.layers=this.layers,this.add(a);const r=new Be(vi,Mi,t,e);r.layers=this.layers,this.add(r);const o=new Be(vi,Mi,t,e);o.layers=this.layers,this.add(o);const c=new Be(vi,Mi,t,e);c.layers=this.layers,this.add(c);const l=new Be(vi,Mi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===aa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,a),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,d),t.setRenderTarget(u,h,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class zl extends Re{constructor(t,e,n,s,a,r,o,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:Di,super(t,e,n,s,a,r,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ju extends ei{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new zl(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:nn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new rn(5,5,5),a=new Fn({name:"CubemapFromEquirect",uniforms:Fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Pe,blending:Dn});a.uniforms.tEquirect.value=e;const r=new re(s,a),o=e.minFilter;return e.minFilter===Kn&&(e.minFilter=nn),new Ku(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(a)}}const Xa=new B,Qu=new B,tf=new Vt;class $n{constructor(t=new B(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Xa.subVectors(n,e).cross(Qu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Xa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||tf.getNormalMatrix(t),s=this.coplanarPoint(Xa).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vn=new pa,Ds=new B;class To{constructor(t=new $n,e=new $n,n=new $n,s=new $n,a=new $n,r=new $n){this.planes=[t,e,n,s,a,r]}set(t,e,n,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=vn){const n=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],d=s[5],u=s[6],h=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],x=s[13],S=s[14],M=s[15];if(n[0].setComponents(c-a,h-l,m-p,M-f).normalize(),n[1].setComponents(c+a,h+l,m+p,M+f).normalize(),n[2].setComponents(c+r,h+d,m+g,M+x).normalize(),n[3].setComponents(c-r,h-d,m-g,M-x).normalize(),n[4].setComponents(c-o,h-u,m-_,M-S).normalize(),e===vn)n[5].setComponents(c+o,h+u,m+_,M+S).normalize();else if(e===aa)n[5].setComponents(o,u,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Vn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Vn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Vn)}intersectsSprite(t){return Vn.center.set(0,0,0),Vn.radius=.7071067811865476,Vn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Vn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ds.x=s.normal.x>0?t.max.x:t.min.x,Ds.y=s.normal.y>0?t.max.y:t.min.y,Ds.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ds)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ol(){let i=null,t=!1,e=null,n=null;function s(a,r){e(a,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function ef(i){const t=new WeakMap;function e(o,c){const l=o.array,d=o.usage,u=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,d),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<u.length;p++){const g=u[h],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,u[h]=_)}u.length=h+1;for(let p=0,g=u.length;p<g;p++){const _=u[p];i.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class ma extends Le{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=t/o,h=e/c,p=[],g=[],_=[],m=[];for(let f=0;f<d;f++){const x=f*h-r;for(let S=0;S<l;S++){const M=S*u-a;g.push(M,-x,0),_.push(0,0,1),m.push(S/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let x=0;x<o;x++){const S=x+l*f,M=x+l*(f+1),L=x+1+l*(f+1),w=x+1+l*f;p.push(S,M,w),p.push(M,L,w)}this.setIndex(p),this.setAttribute("position",new de(g,3)),this.setAttribute("normal",new de(_,3)),this.setAttribute("uv",new de(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ma(t.width,t.height,t.widthSegments,t.heightSegments)}}var nf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,sf=`#ifdef USE_ALPHAHASH
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
#endif`,af=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,of=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,cf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lf=`#ifdef USE_AOMAP
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
#endif`,hf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,df=`#ifdef USE_BATCHING
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
#endif`,uf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ff=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,pf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,mf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,gf=`#ifdef USE_IRIDESCENCE
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
#endif`,_f=`#ifdef USE_BUMPMAP
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
#endif`,xf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,vf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Mf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Sf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ef=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Af=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Tf=`#define PI 3.141592653589793
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
} // validated`,wf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Rf=`vec3 transformedNormal = objectNormal;
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
#endif`,Cf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Pf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Df=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,If="gl_FragColor = linearToOutputTexel( gl_FragColor );",Uf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Nf=`#ifdef USE_ENVMAP
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
#endif`,Ff=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kf=`#ifdef USE_ENVMAP
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
#endif`,zf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Of=`#ifdef USE_ENVMAP
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
#endif`,Bf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Hf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Vf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Wf=`#ifdef USE_GRADIENTMAP
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
}`,Xf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$f=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Zf=`uniform bool receiveShadow;
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
#endif`,qf=`#ifdef USE_ENVMAP
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
#endif`,jf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Kf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,tp=`PhysicalMaterial material;
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
#endif`,ep=`struct PhysicalMaterial {
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
}`,np=`
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
#endif`,ip=`#if defined( RE_IndirectDiffuse )
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
#endif`,sp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ap=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,op=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,dp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,up=`#if defined( USE_POINTS_UV )
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
#endif`,fp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_p=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xp=`#ifdef USE_MORPHTARGETS
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
#endif`,vp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,yp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ep=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ap=`#ifdef USE_NORMALMAP
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
#endif`,Tp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,wp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Rp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Cp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Pp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Dp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ip=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Up=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Np=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Fp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,zp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Op=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Bp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Hp=`float getShadowMask() {
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
}`,Vp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gp=`#ifdef USE_SKINNING
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
#endif`,Wp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xp=`#ifdef USE_SKINNING
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
#endif`,$p=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Zp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,jp=`#ifdef USE_TRANSMISSION
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
#endif`,Kp=`#ifdef USE_TRANSMISSION
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
#endif`,Jp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,em=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const nm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,im=`uniform sampler2D t2D;
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
}`,sm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,am=`#ifdef ENVMAP_TYPE_CUBE
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
}`,rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,om=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cm=`#include <common>
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
}`,lm=`#if DEPTH_PACKING == 3200
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
}`,hm=`#define DISTANCE
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
}`,dm=`#define DISTANCE
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
}`,um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pm=`uniform float scale;
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
}`,mm=`uniform vec3 diffuse;
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
}`,gm=`#include <common>
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
}`,_m=`uniform vec3 diffuse;
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
}`,xm=`#define LAMBERT
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
}`,vm=`#define LAMBERT
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
}`,Mm=`#define MATCAP
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
}`,ym=`#define MATCAP
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
}`,Sm=`#define NORMAL
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
}`,Em=`#define NORMAL
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
}`,bm=`#define PHONG
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
}`,Am=`#define PHONG
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
}`,Tm=`#define STANDARD
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
}`,wm=`#define STANDARD
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
}`,Rm=`#define TOON
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
}`,Cm=`#define TOON
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
}`,Pm=`uniform float size;
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
}`,Lm=`uniform vec3 diffuse;
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
}`,Dm=`#include <common>
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
}`,Im=`uniform vec3 color;
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
}`,Um=`uniform float rotation;
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
}`,Nm=`uniform vec3 diffuse;
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
}`,Wt={alphahash_fragment:nf,alphahash_pars_fragment:sf,alphamap_fragment:af,alphamap_pars_fragment:rf,alphatest_fragment:of,alphatest_pars_fragment:cf,aomap_fragment:lf,aomap_pars_fragment:hf,batching_pars_vertex:df,batching_vertex:uf,begin_vertex:ff,beginnormal_vertex:pf,bsdfs:mf,iridescence_fragment:gf,bumpmap_pars_fragment:_f,clipping_planes_fragment:xf,clipping_planes_pars_fragment:vf,clipping_planes_pars_vertex:Mf,clipping_planes_vertex:yf,color_fragment:Sf,color_pars_fragment:Ef,color_pars_vertex:bf,color_vertex:Af,common:Tf,cube_uv_reflection_fragment:wf,defaultnormal_vertex:Rf,displacementmap_pars_vertex:Cf,displacementmap_vertex:Pf,emissivemap_fragment:Lf,emissivemap_pars_fragment:Df,colorspace_fragment:If,colorspace_pars_fragment:Uf,envmap_fragment:Nf,envmap_common_pars_fragment:Ff,envmap_pars_fragment:kf,envmap_pars_vertex:zf,envmap_physical_pars_fragment:qf,envmap_vertex:Of,fog_vertex:Bf,fog_pars_vertex:Hf,fog_fragment:Vf,fog_pars_fragment:Gf,gradientmap_pars_fragment:Wf,lightmap_pars_fragment:Xf,lights_lambert_fragment:$f,lights_lambert_pars_fragment:Yf,lights_pars_begin:Zf,lights_toon_fragment:jf,lights_toon_pars_fragment:Kf,lights_phong_fragment:Jf,lights_phong_pars_fragment:Qf,lights_physical_fragment:tp,lights_physical_pars_fragment:ep,lights_fragment_begin:np,lights_fragment_maps:ip,lights_fragment_end:sp,logdepthbuf_fragment:ap,logdepthbuf_pars_fragment:rp,logdepthbuf_pars_vertex:op,logdepthbuf_vertex:cp,map_fragment:lp,map_pars_fragment:hp,map_particle_fragment:dp,map_particle_pars_fragment:up,metalnessmap_fragment:fp,metalnessmap_pars_fragment:pp,morphinstance_vertex:mp,morphcolor_vertex:gp,morphnormal_vertex:_p,morphtarget_pars_vertex:xp,morphtarget_vertex:vp,normal_fragment_begin:Mp,normal_fragment_maps:yp,normal_pars_fragment:Sp,normal_pars_vertex:Ep,normal_vertex:bp,normalmap_pars_fragment:Ap,clearcoat_normal_fragment_begin:Tp,clearcoat_normal_fragment_maps:wp,clearcoat_pars_fragment:Rp,iridescence_pars_fragment:Cp,opaque_fragment:Pp,packing:Lp,premultiplied_alpha_fragment:Dp,project_vertex:Ip,dithering_fragment:Up,dithering_pars_fragment:Np,roughnessmap_fragment:Fp,roughnessmap_pars_fragment:kp,shadowmap_pars_fragment:zp,shadowmap_pars_vertex:Op,shadowmap_vertex:Bp,shadowmask_pars_fragment:Hp,skinbase_vertex:Vp,skinning_pars_vertex:Gp,skinning_vertex:Wp,skinnormal_vertex:Xp,specularmap_fragment:$p,specularmap_pars_fragment:Yp,tonemapping_fragment:Zp,tonemapping_pars_fragment:qp,transmission_fragment:jp,transmission_pars_fragment:Kp,uv_pars_fragment:Jp,uv_pars_vertex:Qp,uv_vertex:tm,worldpos_vertex:em,background_vert:nm,background_frag:im,backgroundCube_vert:sm,backgroundCube_frag:am,cube_vert:rm,cube_frag:om,depth_vert:cm,depth_frag:lm,distanceRGBA_vert:hm,distanceRGBA_frag:dm,equirect_vert:um,equirect_frag:fm,linedashed_vert:pm,linedashed_frag:mm,meshbasic_vert:gm,meshbasic_frag:_m,meshlambert_vert:xm,meshlambert_frag:vm,meshmatcap_vert:Mm,meshmatcap_frag:ym,meshnormal_vert:Sm,meshnormal_frag:Em,meshphong_vert:bm,meshphong_frag:Am,meshphysical_vert:Tm,meshphysical_frag:wm,meshtoon_vert:Rm,meshtoon_frag:Cm,points_vert:Pm,points_frag:Lm,shadow_vert:Dm,shadow_frag:Im,sprite_vert:Um,sprite_frag:Nm},yt={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new Ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new Ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},tn={basic:{uniforms:Ae([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.fog]),vertexShader:Wt.meshbasic_vert,fragmentShader:Wt.meshbasic_frag},lambert:{uniforms:Ae([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Wt.meshlambert_vert,fragmentShader:Wt.meshlambert_frag},phong:{uniforms:Ae([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30}}]),vertexShader:Wt.meshphong_vert,fragmentShader:Wt.meshphong_frag},standard:{uniforms:Ae([yt.common,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.roughnessmap,yt.metalnessmap,yt.fog,yt.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag},toon:{uniforms:Ae([yt.common,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.gradientmap,yt.fog,yt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Wt.meshtoon_vert,fragmentShader:Wt.meshtoon_frag},matcap:{uniforms:Ae([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,{matcap:{value:null}}]),vertexShader:Wt.meshmatcap_vert,fragmentShader:Wt.meshmatcap_frag},points:{uniforms:Ae([yt.points,yt.fog]),vertexShader:Wt.points_vert,fragmentShader:Wt.points_frag},dashed:{uniforms:Ae([yt.common,yt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Wt.linedashed_vert,fragmentShader:Wt.linedashed_frag},depth:{uniforms:Ae([yt.common,yt.displacementmap]),vertexShader:Wt.depth_vert,fragmentShader:Wt.depth_frag},normal:{uniforms:Ae([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,{opacity:{value:1}}]),vertexShader:Wt.meshnormal_vert,fragmentShader:Wt.meshnormal_frag},sprite:{uniforms:Ae([yt.sprite,yt.fog]),vertexShader:Wt.sprite_vert,fragmentShader:Wt.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Wt.background_vert,fragmentShader:Wt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:Wt.backgroundCube_vert,fragmentShader:Wt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Wt.cube_vert,fragmentShader:Wt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Wt.equirect_vert,fragmentShader:Wt.equirect_frag},distanceRGBA:{uniforms:Ae([yt.common,yt.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Wt.distanceRGBA_vert,fragmentShader:Wt.distanceRGBA_frag},shadow:{uniforms:Ae([yt.lights,yt.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:Wt.shadow_vert,fragmentShader:Wt.shadow_frag}};tn.physical={uniforms:Ae([tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new Ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new Ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new Ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag};const Is={r:0,b:0,g:0},Gn=new an,Fm=new oe;function km(i,t,e,n,s,a,r){const o=new Bt(0);let c=a===!0?0:1,l,d,u=null,h=0,p=null;function g(x){let S=x.isScene===!0?x.background:null;return S&&S.isTexture&&(S=(x.backgroundBlurriness>0?e:t).get(S)),S}function _(x){let S=!1;const M=g(x);M===null?f(o,c):M&&M.isColor&&(f(M,1),S=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,r):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,S){const M=g(S);M&&(M.isCubeTexture||M.mapping===ua)?(d===void 0&&(d=new re(new rn(1,1,1),new Fn({name:"BackgroundCubeMaterial",uniforms:Fi(tn.backgroundCube.uniforms),vertexShader:tn.backgroundCube.vertexShader,fragmentShader:tn.backgroundCube.fragmentShader,side:Pe,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(L,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Gn.copy(S.backgroundRotation),Gn.x*=-1,Gn.y*=-1,Gn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Gn.y*=-1,Gn.z*=-1),d.material.uniforms.envMap.value=M,d.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Fm.makeRotationFromEuler(Gn)),d.material.toneMapped=Zt.getTransfer(M.colorSpace)!==ee,(u!==M||h!==M.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,u=M,h=M.version,p=i.toneMapping),d.layers.enableAll(),x.unshift(d,d.geometry,d.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new re(new ma(2,2),new Fn({name:"BackgroundMaterial",uniforms:Fi(tn.background.uniforms),vertexShader:tn.background.vertexShader,fragmentShader:tn.background.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=Zt.getTransfer(M.colorSpace)!==ee,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||h!==M.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,h=M.version,p=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function f(x,S){x.getRGB(Is,Fl(i)),n.buffers.color.setClear(Is.r,Is.g,Is.b,S,r)}return{getClearColor:function(){return o},setClearColor:function(x,S=1){o.set(x),c=S,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,f(o,c)},render:_,addToRenderList:m}}function zm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null);let a=s,r=!1;function o(y,R,W,I,q){let X=!1;const H=u(I,W,R);a!==H&&(a=H,l(a.object)),X=p(y,I,W,q),X&&g(y,I,W,q),q!==null&&t.update(q,i.ELEMENT_ARRAY_BUFFER),(X||r)&&(r=!1,M(y,R,W,I),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function d(y){return i.deleteVertexArray(y)}function u(y,R,W){const I=W.wireframe===!0;let q=n[y.id];q===void 0&&(q={},n[y.id]=q);let X=q[R.id];X===void 0&&(X={},q[R.id]=X);let H=X[I];return H===void 0&&(H=h(c()),X[I]=H),H}function h(y){const R=[],W=[],I=[];for(let q=0;q<e;q++)R[q]=0,W[q]=0,I[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:W,attributeDivisors:I,object:y,attributes:{},index:null}}function p(y,R,W,I){const q=a.attributes,X=R.attributes;let H=0;const K=W.getAttributes();for(const Y in K)if(K[Y].location>=0){const ft=q[Y];let _t=X[Y];if(_t===void 0&&(Y==="instanceMatrix"&&y.instanceMatrix&&(_t=y.instanceMatrix),Y==="instanceColor"&&y.instanceColor&&(_t=y.instanceColor)),ft===void 0||ft.attribute!==_t||_t&&ft.data!==_t.data)return!0;H++}return a.attributesNum!==H||a.index!==I}function g(y,R,W,I){const q={},X=R.attributes;let H=0;const K=W.getAttributes();for(const Y in K)if(K[Y].location>=0){let ft=X[Y];ft===void 0&&(Y==="instanceMatrix"&&y.instanceMatrix&&(ft=y.instanceMatrix),Y==="instanceColor"&&y.instanceColor&&(ft=y.instanceColor));const _t={};_t.attribute=ft,ft&&ft.data&&(_t.data=ft.data),q[Y]=_t,H++}a.attributes=q,a.attributesNum=H,a.index=I}function _(){const y=a.newAttributes;for(let R=0,W=y.length;R<W;R++)y[R]=0}function m(y){f(y,0)}function f(y,R){const W=a.newAttributes,I=a.enabledAttributes,q=a.attributeDivisors;W[y]=1,I[y]===0&&(i.enableVertexAttribArray(y),I[y]=1),q[y]!==R&&(i.vertexAttribDivisor(y,R),q[y]=R)}function x(){const y=a.newAttributes,R=a.enabledAttributes;for(let W=0,I=R.length;W<I;W++)R[W]!==y[W]&&(i.disableVertexAttribArray(W),R[W]=0)}function S(y,R,W,I,q,X,H){H===!0?i.vertexAttribIPointer(y,R,W,q,X):i.vertexAttribPointer(y,R,W,I,q,X)}function M(y,R,W,I){_();const q=I.attributes,X=W.getAttributes(),H=R.defaultAttributeValues;for(const K in X){const Y=X[K];if(Y.location>=0){let et=q[K];if(et===void 0&&(K==="instanceMatrix"&&y.instanceMatrix&&(et=y.instanceMatrix),K==="instanceColor"&&y.instanceColor&&(et=y.instanceColor)),et!==void 0){const ft=et.normalized,_t=et.itemSize,vt=t.get(et);if(vt===void 0)continue;const wt=vt.buffer,$=vt.type,ht=vt.bytesPerElement,pt=$===i.INT||$===i.UNSIGNED_INT||et.gpuType===xo;if(et.isInterleavedBufferAttribute){const ut=et.data,V=ut.stride,tt=et.offset;if(ut.isInstancedInterleavedBuffer){for(let xt=0;xt<Y.locationSize;xt++)f(Y.location+xt,ut.meshPerAttribute);y.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let xt=0;xt<Y.locationSize;xt++)m(Y.location+xt);i.bindBuffer(i.ARRAY_BUFFER,wt);for(let xt=0;xt<Y.locationSize;xt++)S(Y.location+xt,_t/Y.locationSize,$,ft,V*ht,(tt+_t/Y.locationSize*xt)*ht,pt)}else{if(et.isInstancedBufferAttribute){for(let ut=0;ut<Y.locationSize;ut++)f(Y.location+ut,et.meshPerAttribute);y.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let ut=0;ut<Y.locationSize;ut++)m(Y.location+ut);i.bindBuffer(i.ARRAY_BUFFER,wt);for(let ut=0;ut<Y.locationSize;ut++)S(Y.location+ut,_t/Y.locationSize,$,ft,_t*ht,_t/Y.locationSize*ut*ht,pt)}}else if(H!==void 0){const ft=H[K];if(ft!==void 0)switch(ft.length){case 2:i.vertexAttrib2fv(Y.location,ft);break;case 3:i.vertexAttrib3fv(Y.location,ft);break;case 4:i.vertexAttrib4fv(Y.location,ft);break;default:i.vertexAttrib1fv(Y.location,ft)}}}}x()}function L(){C();for(const y in n){const R=n[y];for(const W in R){const I=R[W];for(const q in I)d(I[q].object),delete I[q];delete R[W]}delete n[y]}}function w(y){if(n[y.id]===void 0)return;const R=n[y.id];for(const W in R){const I=R[W];for(const q in I)d(I[q].object),delete I[q];delete R[W]}delete n[y.id]}function T(y){for(const R in n){const W=n[R];if(W[y.id]===void 0)continue;const I=W[y.id];for(const q in I)d(I[q].object),delete I[q];delete W[y.id]}}function C(){b(),r=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:b,dispose:L,releaseStatesOfGeometry:w,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function Om(i,t,e){let n;function s(l){n=l}function a(l,d){i.drawArrays(n,l,d),e.update(d,n,1)}function r(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),e.update(d,n,u))}function o(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let p=0;for(let g=0;g<u;g++)p+=d[g];e.update(p,n,1)}function c(l,d,u,h){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)r(l[g],d[g],h[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,d,0,h,0,u);let g=0;for(let _=0;_<u;_++)g+=d[_]*h[_];e.update(g,n,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Bm(i,t,e,n){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(T){return!(T!==Ye&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const C=T===is&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==yn&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==xn&&!C)}function c(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:M,vertexTextures:L,maxSamples:w}}function Hm(i){const t=this;let e=null,n=0,s=!1,a=!1;const r=new $n,o=new Vt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const p=u.length!==0||h||n!==0||s;return s=h,n=u.length,p},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,p){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||a&&!m)a?d(null):l();else{const x=a?0:n,S=x*4;let M=f.clippingState||null;c.value=M,M=d(g,h,S,p);for(let L=0;L!==S;++L)M[L]=e[L];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(u,h,p,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const f=p+_*4,x=h.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<f)&&(m=new Float32Array(f));for(let S=0,M=p;S!==_;++S,M+=4)r.copy(u[S]).applyMatrix4(x,o),r.normal.toArray(m,M),m[M+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Vm(i){let t=new WeakMap;function e(r,o){return o===Tr?r.mapping=Di:o===wr&&(r.mapping=Ii),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===Tr||o===wr)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new Ju(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class Bl extends kl{constructor(t=-1,e=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ti=4,Sc=[.125,.215,.35,.446,.526,.582],qn=20,$a=new Bl,Ec=new Bt;let Ya=null,Za=0,qa=0,ja=!1;const Yn=(1+Math.sqrt(5))/2,yi=1/Yn,bc=[new B(-Yn,yi,0),new B(Yn,yi,0),new B(-yi,0,Yn),new B(yi,0,Yn),new B(0,Yn,-yi),new B(0,Yn,yi),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)];class Ac{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ya=this._renderer.getRenderTarget(),Za=this._renderer.getActiveCubeFace(),qa=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Rc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ya,Za,qa),this._renderer.xr.enabled=ja,t.scissorTest=!1,Us(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Di||t.mapping===Ii?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ya=this._renderer.getRenderTarget(),Za=this._renderer.getActiveCubeFace(),qa=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:is,format:Ye,colorSpace:ki,depthBuffer:!1},s=Tc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tc(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gm(a)),this._blurMaterial=Wm(a,t,e)}return s}_compileMaterial(t){const e=new re(this._lodPlanes[0],t);this._renderer.compile(e,$a)}_sceneToCubeUV(t,e,n,s){const o=new Be(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(Ec),d.toneMapping=In,d.autoClear=!1;const p=new Qe({name:"PMREM.Background",side:Pe,depthWrite:!1,depthTest:!1}),g=new re(new rn,p);let _=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(Ec),_=!0);for(let f=0;f<6;f++){const x=f%3;x===0?(o.up.set(0,c[f],0),o.lookAt(l[f],0,0)):x===1?(o.up.set(0,0,c[f]),o.lookAt(0,l[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,l[f]));const S=this._cubeSize;Us(s,x*S,f>2?S:0,S,S),d.setRenderTarget(s),_&&d.render(g,o),d.render(t,o)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Di||t.mapping===Ii;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Rc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wc());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new re(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;Us(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,$a)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=bc[(s-a-1)%bc.length];this._blur(t,a-1,a,r,o)}e.autoClear=n}_blur(t,e,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",a),this._halfBlur(r,t,n,n,s,"longitudinal",a)}_halfBlur(t,e,n,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new re(this._lodPlanes[s],l),h=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*p):2*Math.PI/(2*qn-1),_=a/g,m=isFinite(a)?1+Math.floor(d*_):qn;m>qn&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${qn}`);const f=[];let x=0;for(let T=0;T<qn;++T){const C=T/_,b=Math.exp(-C*C/2);f.push(b),T===0?x+=b:T<m&&(x+=2*b)}for(let T=0;T<f.length;T++)f[T]=f[T]/x;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=f,h.latitudinal.value=r==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:S}=this;h.dTheta.value=g,h.mipInt.value=S-n;const M=this._sizeLods[s],L=3*M*(s>S-Ti?s-S+Ti:0),w=4*(this._cubeSize-M);Us(e,L,w,3*M,2*M),c.setRenderTarget(e),c.render(u,$a)}}function Gm(i){const t=[],e=[],n=[];let s=i;const a=i-Ti+1+Sc.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>i-Ti?c=Sc[r-i+Ti-1]:r===0&&(c=0),n.push(c);const l=1/(o-2),d=-l,u=1+l,h=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,g=6,_=3,m=2,f=1,x=new Float32Array(_*g*p),S=new Float32Array(m*g*p),M=new Float32Array(f*g*p);for(let w=0;w<p;w++){const T=w%3*2/3-1,C=w>2?0:-1,b=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];x.set(b,_*g*w),S.set(h,m*g*w);const y=[w,w,w,w,w,w];M.set(y,f*g*w)}const L=new Le;L.setAttribute("position",new qe(x,_)),L.setAttribute("uv",new qe(S,m)),L.setAttribute("faceIndex",new qe(M,f)),t.push(L),s>Ti&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Tc(i,t,e){const n=new ei(i,t,e);return n.texture.mapping=ua,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Us(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Wm(i,t,e){const n=new Float32Array(qn),s=new B(0,1,0);return new Fn({name:"SphericalGaussianBlur",defines:{n:qn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:wo(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function wc(){return new Fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wo(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Rc(){return new Fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function wo(){return`

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
	`}function Xm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Tr||c===wr,d=c===Di||c===Ii;if(l||d){let u=t.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return e===null&&(e=new Ac(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return l&&p&&p.height>0||d&&p&&s(p)?(e===null&&(e=new Ac(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function $m(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&ji("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Ym(i,t,e,n){const s={},a=new WeakMap;function r(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)t.remove(_[m])}h.removeEventListener("dispose",r),delete s[h.id];const p=a.get(h);p&&(t.remove(p),a.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(u,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,e.memory.geometries++),h}function c(u){const h=u.attributes;for(const g in h)t.update(h[g],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const _=p[g];for(let m=0,f=_.length;m<f;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(u){const h=[],p=u.index,g=u.attributes.position;let _=0;if(p!==null){const x=p.array;_=p.version;for(let S=0,M=x.length;S<M;S+=3){const L=x[S+0],w=x[S+1],T=x[S+2];h.push(L,w,w,T,T,L)}}else if(g!==void 0){const x=g.array;_=g.version;for(let S=0,M=x.length/3-1;S<M;S+=3){const L=S+0,w=S+1,T=S+2;h.push(L,w,w,T,T,L)}}else return;const m=new(Pl(h)?Nl:Ul)(h,1);m.version=_;const f=a.get(u);f&&t.remove(f),a.set(u,m)}function d(u){const h=a.get(u);if(h){const p=u.index;p!==null&&h.version<p.version&&l(u)}else l(u);return a.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function Zm(i,t,e){let n;function s(h){n=h}let a,r;function o(h){a=h.type,r=h.bytesPerElement}function c(h,p){i.drawElements(n,p,a,h*r),e.update(p,n,1)}function l(h,p,g){g!==0&&(i.drawElementsInstanced(n,p,a,h*r,g),e.update(p,n,g))}function d(h,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,a,h,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function u(h,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<h.length;f++)l(h[f]/r,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,a,h,0,_,0,g);let f=0;for(let x=0;x<g;x++)f+=p[x]*_[x];e.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function qm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function jm(i,t,e){const n=new WeakMap,s=new le;function a(r,o,c){const l=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=n.get(o);if(h===void 0||h.count!==u){let y=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var p=y;h!==void 0&&h.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let L=o.attributes.position.count*M,w=1;L>t.maxTextureSize&&(w=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const T=new Float32Array(L*w*4*u),C=new Dl(T,L,w,u);C.type=xn,C.needsUpdate=!0;const b=M*4;for(let R=0;R<u;R++){const W=f[R],I=x[R],q=S[R],X=L*w*4*R;for(let H=0;H<W.count;H++){const K=H*b;g===!0&&(s.fromBufferAttribute(W,H),T[X+K+0]=s.x,T[X+K+1]=s.y,T[X+K+2]=s.z,T[X+K+3]=0),_===!0&&(s.fromBufferAttribute(I,H),T[X+K+4]=s.x,T[X+K+5]=s.y,T[X+K+6]=s.z,T[X+K+7]=0),m===!0&&(s.fromBufferAttribute(q,H),T[X+K+8]=s.x,T[X+K+9]=s.y,T[X+K+10]=s.z,T[X+K+11]=q.itemSize===4?s.w:1)}}h={count:u,texture:C,size:new Ht(L,w)},n.set(o,h),o.addEventListener("dispose",y)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:a}}function Km(i,t,e,n){let s=new WeakMap;function a(c){const l=n.render.frame,d=c.geometry,u=t.get(c,d);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;s.get(h)!==l&&(h.update(),s.set(h,l))}return u}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class Hl extends Re{constructor(t,e,n,s,a,r,o,c,l,d=Ci){if(d!==Ci&&d!==Ni)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===Ci&&(n=ti),n===void 0&&d===Ni&&(n=Ui),super(null,s,a,r,o,c,d,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Ze,this.minFilter=c!==void 0?c:Ze,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Vl=new Re,Cc=new Hl(1,1),Gl=new Dl,Wl=new Fu,Xl=new zl,Pc=[],Lc=[],Dc=new Float32Array(16),Ic=new Float32Array(9),Uc=new Float32Array(4);function Oi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let a=Pc[s];if(a===void 0&&(a=new Float32Array(s),Pc[s]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,i[r].toArray(a,o)}return a}function _e(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ga(i,t){let e=Lc[t];e===void 0&&(e=new Int32Array(t),Lc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Jm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Qm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2fv(this.addr,t),xe(e,t)}}function tg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;i.uniform3fv(this.addr,t),xe(e,t)}}function eg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4fv(this.addr,t),xe(e,t)}}function ng(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Uc.set(n),i.uniformMatrix2fv(this.addr,!1,Uc),xe(e,n)}}function ig(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Ic.set(n),i.uniformMatrix3fv(this.addr,!1,Ic),xe(e,n)}}function sg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Dc.set(n),i.uniformMatrix4fv(this.addr,!1,Dc),xe(e,n)}}function ag(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function rg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2iv(this.addr,t),xe(e,t)}}function og(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3iv(this.addr,t),xe(e,t)}}function cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4iv(this.addr,t),xe(e,t)}}function lg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2uiv(this.addr,t),xe(e,t)}}function dg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3uiv(this.addr,t),xe(e,t)}}function ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4uiv(this.addr,t),xe(e,t)}}function fg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(Cc.compareFunction=Cl,a=Cc):a=Vl,e.setTexture2D(t||a,s)}function pg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Wl,s)}function mg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Xl,s)}function gg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Gl,s)}function _g(i){switch(i){case 5126:return Jm;case 35664:return Qm;case 35665:return tg;case 35666:return eg;case 35674:return ng;case 35675:return ig;case 35676:return sg;case 5124:case 35670:return ag;case 35667:case 35671:return rg;case 35668:case 35672:return og;case 35669:case 35673:return cg;case 5125:return lg;case 36294:return hg;case 36295:return dg;case 36296:return ug;case 35678:case 36198:case 36298:case 36306:case 35682:return fg;case 35679:case 36299:case 36307:return pg;case 35680:case 36300:case 36308:case 36293:return mg;case 36289:case 36303:case 36311:case 36292:return gg}}function xg(i,t){i.uniform1fv(this.addr,t)}function vg(i,t){const e=Oi(t,this.size,2);i.uniform2fv(this.addr,e)}function Mg(i,t){const e=Oi(t,this.size,3);i.uniform3fv(this.addr,e)}function yg(i,t){const e=Oi(t,this.size,4);i.uniform4fv(this.addr,e)}function Sg(i,t){const e=Oi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Eg(i,t){const e=Oi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function bg(i,t){const e=Oi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Ag(i,t){i.uniform1iv(this.addr,t)}function Tg(i,t){i.uniform2iv(this.addr,t)}function wg(i,t){i.uniform3iv(this.addr,t)}function Rg(i,t){i.uniform4iv(this.addr,t)}function Cg(i,t){i.uniform1uiv(this.addr,t)}function Pg(i,t){i.uniform2uiv(this.addr,t)}function Lg(i,t){i.uniform3uiv(this.addr,t)}function Dg(i,t){i.uniform4uiv(this.addr,t)}function Ig(i,t,e){const n=this.cache,s=t.length,a=ga(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||Vl,a[r])}function Ug(i,t,e){const n=this.cache,s=t.length,a=ga(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||Wl,a[r])}function Ng(i,t,e){const n=this.cache,s=t.length,a=ga(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||Xl,a[r])}function Fg(i,t,e){const n=this.cache,s=t.length,a=ga(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||Gl,a[r])}function kg(i){switch(i){case 5126:return xg;case 35664:return vg;case 35665:return Mg;case 35666:return yg;case 35674:return Sg;case 35675:return Eg;case 35676:return bg;case 5124:case 35670:return Ag;case 35667:case 35671:return Tg;case 35668:case 35672:return wg;case 35669:case 35673:return Rg;case 5125:return Cg;case 36294:return Pg;case 36295:return Lg;case 36296:return Dg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ig;case 35679:case 36299:case 36307:return Ug;case 35680:case 36300:case 36308:case 36293:return Ng;case 36289:case 36303:case 36311:case 36292:return Fg}}class zg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=_g(e.type)}}class Og{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=kg(e.type)}}class Bg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],n)}}}const Ka=/(\w+)(\])?(\[|\.)?/g;function Nc(i,t){i.seq.push(t),i.map[t.id]=t}function Hg(i,t,e){const n=i.name,s=n.length;for(Ka.lastIndex=0;;){const a=Ka.exec(n),r=Ka.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Nc(e,l===void 0?new zg(o,i,t):new Og(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Bg(o),Nc(e,u)),e=u}}}class Qs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);Hg(a,r,this)}}setValue(t,e,n,s){const a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function Fc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Vg=37297;let Gg=0;function Wg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}const kc=new Vt;function Xg(i){Zt._getMatrix(kc,Zt.workingColorSpace,i);const t=`mat3( ${kc.elements.map(e=>e.toFixed(4))} )`;switch(Zt.getTransfer(i)){case fa:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function zc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Wg(i.getShaderSource(t),r)}else return s}function $g(i,t){const e=Xg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Yg(i,t){let e;switch(t){case lu:e="Linear";break;case hu:e="Reinhard";break;case du:e="Cineon";break;case uu:e="ACESFilmic";break;case pu:e="AgX";break;case mu:e="Neutral";break;case fu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ns=new B;function Zg(){Zt.getLuminanceCoefficients(Ns);const i=Ns.x.toFixed(4),t=Ns.y.toFixed(4),e=Ns.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function qg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ki).join(`
`)}function jg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Kg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(t,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:i.getAttribLocation(t,r),locationSize:o}}return e}function Ki(i){return i!==""}function Oc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Bc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Jg=/^[ \t]*#include +<([\w\d./]+)>/gm;function so(i){return i.replace(Jg,t0)}const Qg=new Map;function t0(i,t){let e=Wt[t];if(e===void 0){const n=Qg.get(t);if(n!==void 0)e=Wt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return so(e)}const e0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hc(i){return i.replace(e0,n0)}function n0(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Vc(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function i0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ml?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===gl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===gn&&(t="SHADOWMAP_TYPE_VSM"),t}function s0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Di:case Ii:t="ENVMAP_TYPE_CUBE";break;case ua:t="ENVMAP_TYPE_CUBE_UV";break}return t}function a0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ii:t="ENVMAP_MODE_REFRACTION";break}return t}function r0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case _o:t="ENVMAP_BLENDING_MULTIPLY";break;case ou:t="ENVMAP_BLENDING_MIX";break;case cu:t="ENVMAP_BLENDING_ADD";break}return t}function o0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function c0(i,t,e,n){const s=i.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=i0(e),l=s0(e),d=a0(e),u=r0(e),h=o0(e),p=qg(e),g=jg(a),_=s.createProgram();let m,f,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ki).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ki).join(`
`),f.length>0&&(f+=`
`)):(m=[Vc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ki).join(`
`),f=[Vc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==In?"#define TONE_MAPPING":"",e.toneMapping!==In?Wt.tonemapping_pars_fragment:"",e.toneMapping!==In?Yg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Wt.colorspace_pars_fragment,$g("linearToOutputTexel",e.outputColorSpace),Zg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ki).join(`
`)),r=so(r),r=Oc(r,e),r=Bc(r,e),o=so(o),o=Oc(o,e),o=Bc(o,e),r=Hc(r),o=Hc(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===ec?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ec?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const S=x+m+r,M=x+f+o,L=Fc(s,s.VERTEX_SHADER,S),w=Fc(s,s.FRAGMENT_SHADER,M);s.attachShader(_,L),s.attachShader(_,w),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function T(R){if(i.debug.checkShaderErrors){const W=s.getProgramInfoLog(_).trim(),I=s.getShaderInfoLog(L).trim(),q=s.getShaderInfoLog(w).trim();let X=!0,H=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,L,w);else{const K=zc(s,L,"vertex"),Y=zc(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+W+`
`+K+`
`+Y)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(I===""||q==="")&&(H=!1);H&&(R.diagnostics={runnable:X,programLog:W,vertexShader:{log:I,prefix:m},fragmentShader:{log:q,prefix:f}})}s.deleteShader(L),s.deleteShader(w),C=new Qs(s,_),b=Kg(s,_)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,Vg)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=w,this}let l0=0;class h0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new d0(t),e.set(t,n)),n}}class d0{constructor(t){this.id=l0++,this.code=t,this.usedTimes=0}}function u0(i,t,e,n,s,a,r){const o=new Ao,c=new h0,l=new Set,d=[],u=s.logarithmicDepthBuffer,h=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,R,W,I){const q=W.fog,X=I.geometry,H=b.isMeshStandardMaterial?W.environment:null,K=(b.isMeshStandardMaterial?e:t).get(b.envMap||H),Y=K&&K.mapping===ua?K.image.height:null,et=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));const ft=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,_t=ft!==void 0?ft.length:0;let vt=0;X.morphAttributes.position!==void 0&&(vt=1),X.morphAttributes.normal!==void 0&&(vt=2),X.morphAttributes.color!==void 0&&(vt=3);let wt,$,ht,pt;if(et){const $t=tn[et];wt=$t.vertexShader,$=$t.fragmentShader}else wt=b.vertexShader,$=b.fragmentShader,c.update(b),ht=c.getVertexShaderID(b),pt=c.getFragmentShaderID(b);const ut=i.getRenderTarget(),V=i.state.buffers.depth.getReversed(),tt=I.isInstancedMesh===!0,xt=I.isBatchedMesh===!0,Ct=!!b.map,St=!!b.matcap,Ft=!!K,D=!!b.aoMap,ae=!!b.lightMap,dt=!!b.bumpMap,Rt=!!b.normalMap,G=!!b.displacementMap,at=!!b.emissiveMap,rt=!!b.metalnessMap,A=!!b.roughnessMap,v=b.anisotropy>0,k=b.clearcoat>0,J=b.dispersion>0,nt=b.iridescence>0,Q=b.sheen>0,it=b.transmission>0,lt=v&&!!b.anisotropyMap,gt=k&&!!b.clearcoatMap,zt=k&&!!b.clearcoatNormalMap,ot=k&&!!b.clearcoatRoughnessMap,Et=nt&&!!b.iridescenceMap,It=nt&&!!b.iridescenceThicknessMap,Ut=Q&&!!b.sheenColorMap,Tt=Q&&!!b.sheenRoughnessMap,Xt=!!b.specularMap,kt=!!b.specularColorMap,Jt=!!b.specularIntensityMap,U=it&&!!b.transmissionMap,N=it&&!!b.thicknessMap,P=!!b.gradientMap,F=!!b.alphaMap,st=b.alphaTest>0,ct=!!b.alphaHash,Mt=!!b.extensions;let Gt=In;b.toneMapped&&(ut===null||ut.isXRRenderTarget===!0)&&(Gt=i.toneMapping);const ie={shaderID:et,shaderType:b.type,shaderName:b.name,vertexShader:wt,fragmentShader:$,defines:b.defines,customVertexShaderID:ht,customFragmentShaderID:pt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:xt,batchingColor:xt&&I._colorsTexture!==null,instancing:tt,instancingColor:tt&&I.instanceColor!==null,instancingMorph:tt&&I.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ut===null?i.outputColorSpace:ut.isXRRenderTarget===!0?ut.texture.colorSpace:ki,alphaToCoverage:!!b.alphaToCoverage,map:Ct,matcap:St,envMap:Ft,envMapMode:Ft&&K.mapping,envMapCubeUVHeight:Y,aoMap:D,lightMap:ae,bumpMap:dt,normalMap:Rt,displacementMap:h&&G,emissiveMap:at,normalMapObjectSpace:Rt&&b.normalMapType===vu,normalMapTangentSpace:Rt&&b.normalMapType===Rl,metalnessMap:rt,roughnessMap:A,anisotropy:v,anisotropyMap:lt,clearcoat:k,clearcoatMap:gt,clearcoatNormalMap:zt,clearcoatRoughnessMap:ot,dispersion:J,iridescence:nt,iridescenceMap:Et,iridescenceThicknessMap:It,sheen:Q,sheenColorMap:Ut,sheenRoughnessMap:Tt,specularMap:Xt,specularColorMap:kt,specularIntensityMap:Jt,transmission:it,transmissionMap:U,thicknessMap:N,gradientMap:P,opaque:b.transparent===!1&&b.blending===Ri&&b.alphaToCoverage===!1,alphaMap:F,alphaTest:st,alphaHash:ct,combine:b.combine,mapUv:Ct&&_(b.map.channel),aoMapUv:D&&_(b.aoMap.channel),lightMapUv:ae&&_(b.lightMap.channel),bumpMapUv:dt&&_(b.bumpMap.channel),normalMapUv:Rt&&_(b.normalMap.channel),displacementMapUv:G&&_(b.displacementMap.channel),emissiveMapUv:at&&_(b.emissiveMap.channel),metalnessMapUv:rt&&_(b.metalnessMap.channel),roughnessMapUv:A&&_(b.roughnessMap.channel),anisotropyMapUv:lt&&_(b.anisotropyMap.channel),clearcoatMapUv:gt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:zt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:It&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Tt&&_(b.sheenRoughnessMap.channel),specularMapUv:Xt&&_(b.specularMap.channel),specularColorMapUv:kt&&_(b.specularColorMap.channel),specularIntensityMapUv:Jt&&_(b.specularIntensityMap.channel),transmissionMapUv:U&&_(b.transmissionMap.channel),thicknessMapUv:N&&_(b.thicknessMap.channel),alphaMapUv:F&&_(b.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(Rt||v),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!X.attributes.uv&&(Ct||F),fog:!!q,useFog:b.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:V,skinning:I.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:_t,morphTextureStride:vt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Gt,decodeVideoTexture:Ct&&b.map.isVideoTexture===!0&&Zt.getTransfer(b.map.colorSpace)===ee,decodeVideoTextureEmissive:at&&b.emissiveMap.isVideoTexture===!0&&Zt.getTransfer(b.emissiveMap.colorSpace)===ee,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Te,flipSided:b.side===Pe,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Mt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Mt&&b.extensions.multiDraw===!0||xt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ie.vertexUv1s=l.has(1),ie.vertexUv2s=l.has(2),ie.vertexUv3s=l.has(3),l.clear(),ie}function f(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)y.push(R),y.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(x(y,b),S(y,b),y.push(i.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function S(b,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),b.push(o.mask)}function M(b){const y=g[b.type];let R;if(y){const W=tn[y];R=Zu.clone(W.uniforms)}else R=b.uniforms;return R}function L(b,y){let R;for(let W=0,I=d.length;W<I;W++){const q=d[W];if(q.cacheKey===y){R=q,++R.usedTimes;break}}return R===void 0&&(R=new c0(i,y,b,a),d.push(R)),R}function w(b){if(--b.usedTimes===0){const y=d.indexOf(b);d[y]=d[d.length-1],d.pop(),b.destroy()}}function T(b){c.remove(b)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:L,releaseProgram:w,releaseShaderCache:T,programs:d,dispose:C}}function f0(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:a}}function p0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Gc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Wc(){const i=[];let t=0;const e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function r(u,h,p,g,_,m){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:h,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=f):(f.id=u.id,f.object=u,f.geometry=h,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),t++,f}function o(u,h,p,g,_,m){const f=r(u,h,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(u,h,p,g,_,m){const f=r(u,h,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function l(u,h){e.length>1&&e.sort(u||p0),n.length>1&&n.sort(h||Gc),s.length>1&&s.sort(h||Gc)}function d(){for(let u=t,h=i.length;u<h;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:o,unshift:c,finish:d,sort:l}}function m0(){let i=new WeakMap;function t(n,s){const a=i.get(n);let r;return a===void 0?(r=new Wc,i.set(n,[r])):s>=a.length?(r=new Wc,a.push(r)):r=a[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function g0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new B,color:new Bt};break;case"SpotLight":e={position:new B,direction:new B,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new B,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new B,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new B,halfWidth:new B,halfHeight:new B};break}return i[t.id]=e,e}}}function _0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let x0=0;function v0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function M0(i){const t=new g0,e=_0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new B);const s=new B,a=new oe,r=new oe;function o(l){let d=0,u=0,h=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,x=0,S=0,M=0,L=0,w=0,T=0;l.sort(v0);for(let b=0,y=l.length;b<y;b++){const R=l[b],W=R.color,I=R.intensity,q=R.distance,X=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=W.r*I,u+=W.g*I,h+=W.b*I;else if(R.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(R.sh.coefficients[H],I);T++}else if(R.isDirectionalLight){const H=t.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const K=R.shadow,Y=e.get(R);Y.shadowIntensity=K.intensity,Y.shadowBias=K.bias,Y.shadowNormalBias=K.normalBias,Y.shadowRadius=K.radius,Y.shadowMapSize=K.mapSize,n.directionalShadow[p]=Y,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=R.shadow.matrix,x++}n.directional[p]=H,p++}else if(R.isSpotLight){const H=t.get(R);H.position.setFromMatrixPosition(R.matrixWorld),H.color.copy(W).multiplyScalar(I),H.distance=q,H.coneCos=Math.cos(R.angle),H.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),H.decay=R.decay,n.spot[_]=H;const K=R.shadow;if(R.map&&(n.spotLightMap[L]=R.map,L++,K.updateMatrices(R),R.castShadow&&w++),n.spotLightMatrix[_]=K.matrix,R.castShadow){const Y=e.get(R);Y.shadowIntensity=K.intensity,Y.shadowBias=K.bias,Y.shadowNormalBias=K.normalBias,Y.shadowRadius=K.radius,Y.shadowMapSize=K.mapSize,n.spotShadow[_]=Y,n.spotShadowMap[_]=X,M++}_++}else if(R.isRectAreaLight){const H=t.get(R);H.color.copy(W).multiplyScalar(I),H.halfWidth.set(R.width*.5,0,0),H.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=H,m++}else if(R.isPointLight){const H=t.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),H.distance=R.distance,H.decay=R.decay,R.castShadow){const K=R.shadow,Y=e.get(R);Y.shadowIntensity=K.intensity,Y.shadowBias=K.bias,Y.shadowNormalBias=K.normalBias,Y.shadowRadius=K.radius,Y.shadowMapSize=K.mapSize,Y.shadowCameraNear=K.camera.near,Y.shadowCameraFar=K.camera.far,n.pointShadow[g]=Y,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=R.shadow.matrix,S++}n.point[g]=H,g++}else if(R.isHemisphereLight){const H=t.get(R);H.skyColor.copy(R.color).multiplyScalar(I),H.groundColor.copy(R.groundColor).multiplyScalar(I),n.hemi[f]=H,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=yt.LTC_FLOAT_1,n.rectAreaLTC2=yt.LTC_FLOAT_2):(n.rectAreaLTC1=yt.LTC_HALF_1,n.rectAreaLTC2=yt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=h;const C=n.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==f||C.numDirectionalShadows!==x||C.numPointShadows!==S||C.numSpotShadows!==M||C.numSpotMaps!==L||C.numLightProbes!==T)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=M+L-w,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=T,C.directionalLength=p,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=f,C.numDirectionalShadows=x,C.numPointShadows=S,C.numSpotShadows=M,C.numSpotMaps=L,C.numLightProbes=T,n.version=x0++)}function c(l,d){let u=0,h=0,p=0,g=0,_=0;const m=d.matrixWorldInverse;for(let f=0,x=l.length;f<x;f++){const S=l[f];if(S.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(S.isSpotLight){const M=n.spot[p];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),p++}else if(S.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),r.identity(),a.copy(S.matrixWorld),a.premultiply(m),r.extractRotation(a),M.halfWidth.set(S.width*.5,0,0),M.halfHeight.set(0,S.height*.5,0),M.halfWidth.applyMatrix4(r),M.halfHeight.applyMatrix4(r),g++}else if(S.isPointLight){const M=n.point[h];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),h++}else if(S.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function Xc(i){const t=new M0(i),e=[],n=[];function s(d){l.camera=d,e.length=0,n.length=0}function a(d){e.push(d)}function r(d){n.push(d)}function o(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function y0(i){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new Xc(i),t.set(s,[o])):a>=r.length?(o=new Xc(i),r.push(o)):o=r[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class S0 extends ni{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=_u,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class E0 extends ni{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const b0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,A0=`uniform sampler2D shadow_pass;
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
}`;function T0(i,t,e){let n=new To;const s=new Ht,a=new Ht,r=new le,o=new S0({depthPacking:xu}),c=new E0,l={},d=e.maxTextureSize,u={[Nn]:Pe,[Pe]:Nn,[Te]:Te},h=new Fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ht},radius:{value:4}},vertexShader:b0,fragmentShader:A0}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new Le;g.setAttribute("position",new qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new re(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ml;let f=this.type;this.render=function(w,T,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const b=i.getRenderTarget(),y=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),W=i.state;W.setBlending(Dn),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const I=f!==gn&&this.type===gn,q=f===gn&&this.type!==gn;for(let X=0,H=w.length;X<H;X++){const K=w[X],Y=K.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const et=Y.getFrameExtents();if(s.multiply(et),a.copy(Y.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/et.x),s.x=a.x*et.x,Y.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/et.y),s.y=a.y*et.y,Y.mapSize.y=a.y)),Y.map===null||I===!0||q===!0){const _t=this.type!==gn?{minFilter:Ze,magFilter:Ze}:{};Y.map!==null&&Y.map.dispose(),Y.map=new ei(s.x,s.y,_t),Y.map.texture.name=K.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const ft=Y.getViewportCount();for(let _t=0;_t<ft;_t++){const vt=Y.getViewport(_t);r.set(a.x*vt.x,a.y*vt.y,a.x*vt.z,a.y*vt.w),W.viewport(r),Y.updateMatrices(K,_t),n=Y.getFrustum(),M(T,C,Y.camera,K,this.type)}Y.isPointLightShadow!==!0&&this.type===gn&&x(Y,C),Y.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(b,y,R)};function x(w,T){const C=t.update(_);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ei(s.x,s.y)),h.uniforms.shadow_pass.value=w.map.texture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(T,null,C,h,_,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(T,null,C,p,_,null)}function S(w,T,C,b){let y=null;const R=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)y=R;else if(y=C.isPointLight===!0?c:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const W=y.uuid,I=T.uuid;let q=l[W];q===void 0&&(q={},l[W]=q);let X=q[I];X===void 0&&(X=y.clone(),q[I]=X,T.addEventListener("dispose",L)),y=X}if(y.visible=T.visible,y.wireframe=T.wireframe,b===gn?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:u[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const W=i.properties.get(y);W.light=C}return y}function M(w,T,C,b,y){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===gn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);const I=t.update(w),q=w.material;if(Array.isArray(q)){const X=I.groups;for(let H=0,K=X.length;H<K;H++){const Y=X[H],et=q[Y.materialIndex];if(et&&et.visible){const ft=S(w,et,b,y);w.onBeforeShadow(i,w,T,C,I,ft,Y),i.renderBufferDirect(C,null,I,ft,w,Y),w.onAfterShadow(i,w,T,C,I,ft,Y)}}}else if(q.visible){const X=S(w,q,b,y);w.onBeforeShadow(i,w,T,C,I,X,null),i.renderBufferDirect(C,null,I,X,w,null),w.onAfterShadow(i,w,T,C,I,X,null)}}const W=w.children;for(let I=0,q=W.length;I<q;I++)M(W[I],T,C,b,y)}function L(w){w.target.removeEventListener("dispose",L);for(const C in l){const b=l[C],y=w.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const w0={[vr]:Mr,[yr]:br,[Sr]:Ar,[Li]:Er,[Mr]:vr,[br]:yr,[Ar]:Sr,[Er]:Li};function R0(i,t){function e(){let U=!1;const N=new le;let P=null;const F=new le(0,0,0,0);return{setMask:function(st){P!==st&&!U&&(i.colorMask(st,st,st,st),P=st)},setLocked:function(st){U=st},setClear:function(st,ct,Mt,Gt,ie){ie===!0&&(st*=Gt,ct*=Gt,Mt*=Gt),N.set(st,ct,Mt,Gt),F.equals(N)===!1&&(i.clearColor(st,ct,Mt,Gt),F.copy(N))},reset:function(){U=!1,P=null,F.set(-1,0,0,0)}}}function n(){let U=!1,N=!1,P=null,F=null,st=null;return{setReversed:function(ct){if(N!==ct){const Mt=t.get("EXT_clip_control");N?Mt.clipControlEXT(Mt.LOWER_LEFT_EXT,Mt.ZERO_TO_ONE_EXT):Mt.clipControlEXT(Mt.LOWER_LEFT_EXT,Mt.NEGATIVE_ONE_TO_ONE_EXT);const Gt=st;st=null,this.setClear(Gt)}N=ct},getReversed:function(){return N},setTest:function(ct){ct?ut(i.DEPTH_TEST):V(i.DEPTH_TEST)},setMask:function(ct){P!==ct&&!U&&(i.depthMask(ct),P=ct)},setFunc:function(ct){if(N&&(ct=w0[ct]),F!==ct){switch(ct){case vr:i.depthFunc(i.NEVER);break;case Mr:i.depthFunc(i.ALWAYS);break;case yr:i.depthFunc(i.LESS);break;case Li:i.depthFunc(i.LEQUAL);break;case Sr:i.depthFunc(i.EQUAL);break;case Er:i.depthFunc(i.GEQUAL);break;case br:i.depthFunc(i.GREATER);break;case Ar:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}F=ct}},setLocked:function(ct){U=ct},setClear:function(ct){st!==ct&&(N&&(ct=1-ct),i.clearDepth(ct),st=ct)},reset:function(){U=!1,P=null,F=null,st=null,N=!1}}}function s(){let U=!1,N=null,P=null,F=null,st=null,ct=null,Mt=null,Gt=null,ie=null;return{setTest:function($t){U||($t?ut(i.STENCIL_TEST):V(i.STENCIL_TEST))},setMask:function($t){N!==$t&&!U&&(i.stencilMask($t),N=$t)},setFunc:function($t,qt,ue){(P!==$t||F!==qt||st!==ue)&&(i.stencilFunc($t,qt,ue),P=$t,F=qt,st=ue)},setOp:function($t,qt,ue){(ct!==$t||Mt!==qt||Gt!==ue)&&(i.stencilOp($t,qt,ue),ct=$t,Mt=qt,Gt=ue)},setLocked:function($t){U=$t},setClear:function($t){ie!==$t&&(i.clearStencil($t),ie=$t)},reset:function(){U=!1,N=null,P=null,F=null,st=null,ct=null,Mt=null,Gt=null,ie=null}}}const a=new e,r=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},h=new WeakMap,p=[],g=null,_=!1,m=null,f=null,x=null,S=null,M=null,L=null,w=null,T=new Bt(0,0,0),C=0,b=!1,y=null,R=null,W=null,I=null,q=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,K=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(Y)[1]),H=K>=1):Y.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),H=K>=2);let et=null,ft={};const _t=i.getParameter(i.SCISSOR_BOX),vt=i.getParameter(i.VIEWPORT),wt=new le().fromArray(_t),$=new le().fromArray(vt);function ht(U,N,P,F){const st=new Uint8Array(4),ct=i.createTexture();i.bindTexture(U,ct),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Mt=0;Mt<P;Mt++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(N,0,i.RGBA,1,1,F,0,i.RGBA,i.UNSIGNED_BYTE,st):i.texImage2D(N+Mt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,st);return ct}const pt={};pt[i.TEXTURE_2D]=ht(i.TEXTURE_2D,i.TEXTURE_2D,1),pt[i.TEXTURE_CUBE_MAP]=ht(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[i.TEXTURE_2D_ARRAY]=ht(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),pt[i.TEXTURE_3D]=ht(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ut(i.DEPTH_TEST),r.setFunc(Li),dt(!1),Rt(jo),ut(i.CULL_FACE),D(Dn);function ut(U){d[U]!==!0&&(i.enable(U),d[U]=!0)}function V(U){d[U]!==!1&&(i.disable(U),d[U]=!1)}function tt(U,N){return u[U]!==N?(i.bindFramebuffer(U,N),u[U]=N,U===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=N),U===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=N),!0):!1}function xt(U,N){let P=p,F=!1;if(U){P=h.get(N),P===void 0&&(P=[],h.set(N,P));const st=U.textures;if(P.length!==st.length||P[0]!==i.COLOR_ATTACHMENT0){for(let ct=0,Mt=st.length;ct<Mt;ct++)P[ct]=i.COLOR_ATTACHMENT0+ct;P.length=st.length,F=!0}}else P[0]!==i.BACK&&(P[0]=i.BACK,F=!0);F&&i.drawBuffers(P)}function Ct(U){return g!==U?(i.useProgram(U),g=U,!0):!1}const St={[Zn]:i.FUNC_ADD,[Wd]:i.FUNC_SUBTRACT,[Xd]:i.FUNC_REVERSE_SUBTRACT};St[$d]=i.MIN,St[Yd]=i.MAX;const Ft={[Zd]:i.ZERO,[qd]:i.ONE,[jd]:i.SRC_COLOR,[_r]:i.SRC_ALPHA,[nu]:i.SRC_ALPHA_SATURATE,[tu]:i.DST_COLOR,[Jd]:i.DST_ALPHA,[Kd]:i.ONE_MINUS_SRC_COLOR,[xr]:i.ONE_MINUS_SRC_ALPHA,[eu]:i.ONE_MINUS_DST_COLOR,[Qd]:i.ONE_MINUS_DST_ALPHA,[iu]:i.CONSTANT_COLOR,[su]:i.ONE_MINUS_CONSTANT_COLOR,[au]:i.CONSTANT_ALPHA,[ru]:i.ONE_MINUS_CONSTANT_ALPHA};function D(U,N,P,F,st,ct,Mt,Gt,ie,$t){if(U===Dn){_===!0&&(V(i.BLEND),_=!1);return}if(_===!1&&(ut(i.BLEND),_=!0),U!==Gd){if(U!==m||$t!==b){if((f!==Zn||M!==Zn)&&(i.blendEquation(i.FUNC_ADD),f=Zn,M=Zn),$t)switch(U){case Ri:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ko:i.blendFunc(i.ONE,i.ONE);break;case Jo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Qo:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Ri:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ko:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Jo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Qo:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}x=null,S=null,L=null,w=null,T.set(0,0,0),C=0,m=U,b=$t}return}st=st||N,ct=ct||P,Mt=Mt||F,(N!==f||st!==M)&&(i.blendEquationSeparate(St[N],St[st]),f=N,M=st),(P!==x||F!==S||ct!==L||Mt!==w)&&(i.blendFuncSeparate(Ft[P],Ft[F],Ft[ct],Ft[Mt]),x=P,S=F,L=ct,w=Mt),(Gt.equals(T)===!1||ie!==C)&&(i.blendColor(Gt.r,Gt.g,Gt.b,ie),T.copy(Gt),C=ie),m=U,b=!1}function ae(U,N){U.side===Te?V(i.CULL_FACE):ut(i.CULL_FACE);let P=U.side===Pe;N&&(P=!P),dt(P),U.blending===Ri&&U.transparent===!1?D(Dn):D(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),r.setFunc(U.depthFunc),r.setTest(U.depthTest),r.setMask(U.depthWrite),a.setMask(U.colorWrite);const F=U.stencilWrite;o.setTest(F),F&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),at(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ut(i.SAMPLE_ALPHA_TO_COVERAGE):V(i.SAMPLE_ALPHA_TO_COVERAGE)}function dt(U){y!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),y=U)}function Rt(U){U!==Hd?(ut(i.CULL_FACE),U!==R&&(U===jo?i.cullFace(i.BACK):U===Vd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):V(i.CULL_FACE),R=U}function G(U){U!==W&&(H&&i.lineWidth(U),W=U)}function at(U,N,P){U?(ut(i.POLYGON_OFFSET_FILL),(I!==N||q!==P)&&(i.polygonOffset(N,P),I=N,q=P)):V(i.POLYGON_OFFSET_FILL)}function rt(U){U?ut(i.SCISSOR_TEST):V(i.SCISSOR_TEST)}function A(U){U===void 0&&(U=i.TEXTURE0+X-1),et!==U&&(i.activeTexture(U),et=U)}function v(U,N,P){P===void 0&&(et===null?P=i.TEXTURE0+X-1:P=et);let F=ft[P];F===void 0&&(F={type:void 0,texture:void 0},ft[P]=F),(F.type!==U||F.texture!==N)&&(et!==P&&(i.activeTexture(P),et=P),i.bindTexture(U,N||pt[U]),F.type=U,F.texture=N)}function k(){const U=ft[et];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function J(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function nt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function it(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function lt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function gt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function zt(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ot(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Et(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function It(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ut(U){wt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),wt.copy(U))}function Tt(U){$.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),$.copy(U))}function Xt(U,N){let P=l.get(N);P===void 0&&(P=new WeakMap,l.set(N,P));let F=P.get(U);F===void 0&&(F=i.getUniformBlockIndex(N,U.name),P.set(U,F))}function kt(U,N){const F=l.get(N).get(U);c.get(N)!==F&&(i.uniformBlockBinding(N,F,U.__bindingPointIndex),c.set(N,F))}function Jt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},et=null,ft={},u={},h=new WeakMap,p=[],g=null,_=!1,m=null,f=null,x=null,S=null,M=null,L=null,w=null,T=new Bt(0,0,0),C=0,b=!1,y=null,R=null,W=null,I=null,q=null,wt.set(0,0,i.canvas.width,i.canvas.height),$.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:ut,disable:V,bindFramebuffer:tt,drawBuffers:xt,useProgram:Ct,setBlending:D,setMaterial:ae,setFlipSided:dt,setCullFace:Rt,setLineWidth:G,setPolygonOffset:at,setScissorTest:rt,activeTexture:A,bindTexture:v,unbindTexture:k,compressedTexImage2D:J,compressedTexImage3D:nt,texImage2D:Et,texImage3D:It,updateUBOMapping:Xt,uniformBlockBinding:kt,texStorage2D:zt,texStorage3D:ot,texSubImage2D:Q,texSubImage3D:it,compressedTexSubImage2D:lt,compressedTexSubImage3D:gt,scissor:Ut,viewport:Tt,reset:Jt}}function $c(i,t,e,n){const s=C0(n);switch(e){case yl:return i*t;case El:return i*t;case bl:return i*t*2;case Al:return i*t/s.components*s.byteLength;case yo:return i*t/s.components*s.byteLength;case Tl:return i*t*2/s.components*s.byteLength;case So:return i*t*2/s.components*s.byteLength;case Sl:return i*t*3/s.components*s.byteLength;case Ye:return i*t*4/s.components*s.byteLength;case Eo:return i*t*4/s.components*s.byteLength;case Ys:case Zs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case qs:case js:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Lr:case Ir:return Math.max(i,16)*Math.max(t,8)/4;case Pr:case Dr:return Math.max(i,8)*Math.max(t,8)/2;case Ur:case Nr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Fr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case kr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case zr:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Or:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Br:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Hr:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Vr:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Gr:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Wr:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Xr:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case $r:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Yr:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Zr:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case qr:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case jr:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ks:case Kr:case Jr:return Math.ceil(i/4)*Math.ceil(t/4)*16;case wl:case Qr:return Math.ceil(i/4)*Math.ceil(t/4)*8;case to:case eo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function C0(i){switch(i){case yn:case xl:return{byteLength:1,components:1};case es:case vl:case is:return{byteLength:2,components:1};case vo:case Mo:return{byteLength:2,components:4};case ti:case xo:case xn:return{byteLength:4,components:1};case Ml:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function P0(i,t,e,n,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ht,d=new WeakMap;let u;const h=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,v){return p?new OffscreenCanvas(A,v):ra("canvas")}function _(A,v,k){let J=1;const nt=rt(A);if((nt.width>k||nt.height>k)&&(J=k/Math.max(nt.width,nt.height)),J<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const Q=Math.floor(J*nt.width),it=Math.floor(J*nt.height);u===void 0&&(u=g(Q,it));const lt=v?g(Q,it):u;return lt.width=Q,lt.height=it,lt.getContext("2d").drawImage(A,0,0,Q,it),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+Q+"x"+it+")."),lt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),A;return A}function m(A){return A.generateMipmaps}function f(A){i.generateMipmap(A)}function x(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(A,v,k,J,nt=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Q=v;if(v===i.RED&&(k===i.FLOAT&&(Q=i.R32F),k===i.HALF_FLOAT&&(Q=i.R16F),k===i.UNSIGNED_BYTE&&(Q=i.R8)),v===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(Q=i.R8UI),k===i.UNSIGNED_SHORT&&(Q=i.R16UI),k===i.UNSIGNED_INT&&(Q=i.R32UI),k===i.BYTE&&(Q=i.R8I),k===i.SHORT&&(Q=i.R16I),k===i.INT&&(Q=i.R32I)),v===i.RG&&(k===i.FLOAT&&(Q=i.RG32F),k===i.HALF_FLOAT&&(Q=i.RG16F),k===i.UNSIGNED_BYTE&&(Q=i.RG8)),v===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(Q=i.RG8UI),k===i.UNSIGNED_SHORT&&(Q=i.RG16UI),k===i.UNSIGNED_INT&&(Q=i.RG32UI),k===i.BYTE&&(Q=i.RG8I),k===i.SHORT&&(Q=i.RG16I),k===i.INT&&(Q=i.RG32I)),v===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),k===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),k===i.UNSIGNED_INT&&(Q=i.RGB32UI),k===i.BYTE&&(Q=i.RGB8I),k===i.SHORT&&(Q=i.RGB16I),k===i.INT&&(Q=i.RGB32I)),v===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),k===i.UNSIGNED_INT&&(Q=i.RGBA32UI),k===i.BYTE&&(Q=i.RGBA8I),k===i.SHORT&&(Q=i.RGBA16I),k===i.INT&&(Q=i.RGBA32I)),v===i.RGB&&k===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),v===i.RGBA){const it=nt?fa:Zt.getTransfer(J);k===i.FLOAT&&(Q=i.RGBA32F),k===i.HALF_FLOAT&&(Q=i.RGBA16F),k===i.UNSIGNED_BYTE&&(Q=it===ee?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Q}function M(A,v){let k;return A?v===null||v===ti||v===Ui?k=i.DEPTH24_STENCIL8:v===xn?k=i.DEPTH32F_STENCIL8:v===es&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ti||v===Ui?k=i.DEPTH_COMPONENT24:v===xn?k=i.DEPTH_COMPONENT32F:v===es&&(k=i.DEPTH_COMPONENT16),k}function L(A,v){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ze&&A.minFilter!==nn?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function w(A){const v=A.target;v.removeEventListener("dispose",w),C(v),v.isVideoTexture&&d.delete(v)}function T(A){const v=A.target;v.removeEventListener("dispose",T),y(v)}function C(A){const v=n.get(A);if(v.__webglInit===void 0)return;const k=A.source,J=h.get(k);if(J){const nt=J[v.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&b(A),Object.keys(J).length===0&&h.delete(k)}n.remove(A)}function b(A){const v=n.get(A);i.deleteTexture(v.__webglTexture);const k=A.source,J=h.get(k);delete J[v.__cacheKey],r.memory.textures--}function y(A){const v=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(v.__webglFramebuffer[J]))for(let nt=0;nt<v.__webglFramebuffer[J].length;nt++)i.deleteFramebuffer(v.__webglFramebuffer[J][nt]);else i.deleteFramebuffer(v.__webglFramebuffer[J]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[J])}else{if(Array.isArray(v.__webglFramebuffer))for(let J=0;J<v.__webglFramebuffer.length;J++)i.deleteFramebuffer(v.__webglFramebuffer[J]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let J=0;J<v.__webglColorRenderbuffer.length;J++)v.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[J]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const k=A.textures;for(let J=0,nt=k.length;J<nt;J++){const Q=n.get(k[J]);Q.__webglTexture&&(i.deleteTexture(Q.__webglTexture),r.memory.textures--),n.remove(k[J])}n.remove(A)}let R=0;function W(){R=0}function I(){const A=R;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),R+=1,A}function q(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function X(A,v){const k=n.get(A);if(A.isVideoTexture&&G(A),A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){const J=A.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(k,A,v);return}}e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+v)}function H(A,v){const k=n.get(A);if(A.version>0&&k.__version!==A.version){$(k,A,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+v)}function K(A,v){const k=n.get(A);if(A.version>0&&k.__version!==A.version){$(k,A,v);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+v)}function Y(A,v){const k=n.get(A);if(A.version>0&&k.__version!==A.version){ht(k,A,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+v)}const et={[Rr]:i.REPEAT,[jn]:i.CLAMP_TO_EDGE,[Cr]:i.MIRRORED_REPEAT},ft={[Ze]:i.NEAREST,[gu]:i.NEAREST_MIPMAP_NEAREST,[ms]:i.NEAREST_MIPMAP_LINEAR,[nn]:i.LINEAR,[ba]:i.LINEAR_MIPMAP_NEAREST,[Kn]:i.LINEAR_MIPMAP_LINEAR},_t={[Mu]:i.NEVER,[Tu]:i.ALWAYS,[yu]:i.LESS,[Cl]:i.LEQUAL,[Su]:i.EQUAL,[Au]:i.GEQUAL,[Eu]:i.GREATER,[bu]:i.NOTEQUAL};function vt(A,v){if(v.type===xn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===nn||v.magFilter===ba||v.magFilter===ms||v.magFilter===Kn||v.minFilter===nn||v.minFilter===ba||v.minFilter===ms||v.minFilter===Kn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,et[v.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,et[v.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,et[v.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ft[v.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ft[v.minFilter]),v.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,_t[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Ze||v.minFilter!==ms&&v.minFilter!==Kn||v.type===xn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const k=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function wt(A,v){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",w));const J=v.source;let nt=h.get(J);nt===void 0&&(nt={},h.set(J,nt));const Q=q(v);if(Q!==A.__cacheKey){nt[Q]===void 0&&(nt[Q]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,k=!0),nt[Q].usedTimes++;const it=nt[A.__cacheKey];it!==void 0&&(nt[A.__cacheKey].usedTimes--,it.usedTimes===0&&b(v)),A.__cacheKey=Q,A.__webglTexture=nt[Q].texture}return k}function $(A,v,k){let J=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(J=i.TEXTURE_3D);const nt=wt(A,v),Q=v.source;e.bindTexture(J,A.__webglTexture,i.TEXTURE0+k);const it=n.get(Q);if(Q.version!==it.__version||nt===!0){e.activeTexture(i.TEXTURE0+k);const lt=Zt.getPrimaries(Zt.workingColorSpace),gt=v.colorSpace===Pn?null:Zt.getPrimaries(v.colorSpace),zt=v.colorSpace===Pn||lt===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,zt);let ot=_(v.image,!1,s.maxTextureSize);ot=at(v,ot);const Et=a.convert(v.format,v.colorSpace),It=a.convert(v.type);let Ut=S(v.internalFormat,Et,It,v.colorSpace,v.isVideoTexture);vt(J,v);let Tt;const Xt=v.mipmaps,kt=v.isVideoTexture!==!0,Jt=it.__version===void 0||nt===!0,U=Q.dataReady,N=L(v,ot);if(v.isDepthTexture)Ut=M(v.format===Ni,v.type),Jt&&(kt?e.texStorage2D(i.TEXTURE_2D,1,Ut,ot.width,ot.height):e.texImage2D(i.TEXTURE_2D,0,Ut,ot.width,ot.height,0,Et,It,null));else if(v.isDataTexture)if(Xt.length>0){kt&&Jt&&e.texStorage2D(i.TEXTURE_2D,N,Ut,Xt[0].width,Xt[0].height);for(let P=0,F=Xt.length;P<F;P++)Tt=Xt[P],kt?U&&e.texSubImage2D(i.TEXTURE_2D,P,0,0,Tt.width,Tt.height,Et,It,Tt.data):e.texImage2D(i.TEXTURE_2D,P,Ut,Tt.width,Tt.height,0,Et,It,Tt.data);v.generateMipmaps=!1}else kt?(Jt&&e.texStorage2D(i.TEXTURE_2D,N,Ut,ot.width,ot.height),U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ot.width,ot.height,Et,It,ot.data)):e.texImage2D(i.TEXTURE_2D,0,Ut,ot.width,ot.height,0,Et,It,ot.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){kt&&Jt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,N,Ut,Xt[0].width,Xt[0].height,ot.depth);for(let P=0,F=Xt.length;P<F;P++)if(Tt=Xt[P],v.format!==Ye)if(Et!==null)if(kt){if(U)if(v.layerUpdates.size>0){const st=$c(Tt.width,Tt.height,v.format,v.type);for(const ct of v.layerUpdates){const Mt=Tt.data.subarray(ct*st/Tt.data.BYTES_PER_ELEMENT,(ct+1)*st/Tt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,P,0,0,ct,Tt.width,Tt.height,1,Et,Mt)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,P,0,0,0,Tt.width,Tt.height,ot.depth,Et,Tt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,P,Ut,Tt.width,Tt.height,ot.depth,0,Tt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?U&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,P,0,0,0,Tt.width,Tt.height,ot.depth,Et,It,Tt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,P,Ut,Tt.width,Tt.height,ot.depth,0,Et,It,Tt.data)}else{kt&&Jt&&e.texStorage2D(i.TEXTURE_2D,N,Ut,Xt[0].width,Xt[0].height);for(let P=0,F=Xt.length;P<F;P++)Tt=Xt[P],v.format!==Ye?Et!==null?kt?U&&e.compressedTexSubImage2D(i.TEXTURE_2D,P,0,0,Tt.width,Tt.height,Et,Tt.data):e.compressedTexImage2D(i.TEXTURE_2D,P,Ut,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?U&&e.texSubImage2D(i.TEXTURE_2D,P,0,0,Tt.width,Tt.height,Et,It,Tt.data):e.texImage2D(i.TEXTURE_2D,P,Ut,Tt.width,Tt.height,0,Et,It,Tt.data)}else if(v.isDataArrayTexture)if(kt){if(Jt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,N,Ut,ot.width,ot.height,ot.depth),U)if(v.layerUpdates.size>0){const P=$c(ot.width,ot.height,v.format,v.type);for(const F of v.layerUpdates){const st=ot.data.subarray(F*P/ot.data.BYTES_PER_ELEMENT,(F+1)*P/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,F,ot.width,ot.height,1,Et,It,st)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,Et,It,ot.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ut,ot.width,ot.height,ot.depth,0,Et,It,ot.data);else if(v.isData3DTexture)kt?(Jt&&e.texStorage3D(i.TEXTURE_3D,N,Ut,ot.width,ot.height,ot.depth),U&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,Et,It,ot.data)):e.texImage3D(i.TEXTURE_3D,0,Ut,ot.width,ot.height,ot.depth,0,Et,It,ot.data);else if(v.isFramebufferTexture){if(Jt)if(kt)e.texStorage2D(i.TEXTURE_2D,N,Ut,ot.width,ot.height);else{let P=ot.width,F=ot.height;for(let st=0;st<N;st++)e.texImage2D(i.TEXTURE_2D,st,Ut,P,F,0,Et,It,null),P>>=1,F>>=1}}else if(Xt.length>0){if(kt&&Jt){const P=rt(Xt[0]);e.texStorage2D(i.TEXTURE_2D,N,Ut,P.width,P.height)}for(let P=0,F=Xt.length;P<F;P++)Tt=Xt[P],kt?U&&e.texSubImage2D(i.TEXTURE_2D,P,0,0,Et,It,Tt):e.texImage2D(i.TEXTURE_2D,P,Ut,Et,It,Tt);v.generateMipmaps=!1}else if(kt){if(Jt){const P=rt(ot);e.texStorage2D(i.TEXTURE_2D,N,Ut,P.width,P.height)}U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Et,It,ot)}else e.texImage2D(i.TEXTURE_2D,0,Ut,Et,It,ot);m(v)&&f(J),it.__version=Q.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function ht(A,v,k){if(v.image.length!==6)return;const J=wt(A,v),nt=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+k);const Q=n.get(nt);if(nt.version!==Q.__version||J===!0){e.activeTexture(i.TEXTURE0+k);const it=Zt.getPrimaries(Zt.workingColorSpace),lt=v.colorSpace===Pn?null:Zt.getPrimaries(v.colorSpace),gt=v.colorSpace===Pn||it===lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const zt=v.isCompressedTexture||v.image[0].isCompressedTexture,ot=v.image[0]&&v.image[0].isDataTexture,Et=[];for(let F=0;F<6;F++)!zt&&!ot?Et[F]=_(v.image[F],!0,s.maxCubemapSize):Et[F]=ot?v.image[F].image:v.image[F],Et[F]=at(v,Et[F]);const It=Et[0],Ut=a.convert(v.format,v.colorSpace),Tt=a.convert(v.type),Xt=S(v.internalFormat,Ut,Tt,v.colorSpace),kt=v.isVideoTexture!==!0,Jt=Q.__version===void 0||J===!0,U=nt.dataReady;let N=L(v,It);vt(i.TEXTURE_CUBE_MAP,v);let P;if(zt){kt&&Jt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,N,Xt,It.width,It.height);for(let F=0;F<6;F++){P=Et[F].mipmaps;for(let st=0;st<P.length;st++){const ct=P[st];v.format!==Ye?Ut!==null?kt?U&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,st,0,0,ct.width,ct.height,Ut,ct.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,st,Xt,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,st,0,0,ct.width,ct.height,Ut,Tt,ct.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,st,Xt,ct.width,ct.height,0,Ut,Tt,ct.data)}}}else{if(P=v.mipmaps,kt&&Jt){P.length>0&&N++;const F=rt(Et[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,N,Xt,F.width,F.height)}for(let F=0;F<6;F++)if(ot){kt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,0,0,0,Et[F].width,Et[F].height,Ut,Tt,Et[F].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,0,Xt,Et[F].width,Et[F].height,0,Ut,Tt,Et[F].data);for(let st=0;st<P.length;st++){const Mt=P[st].image[F].image;kt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,st+1,0,0,Mt.width,Mt.height,Ut,Tt,Mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,st+1,Xt,Mt.width,Mt.height,0,Ut,Tt,Mt.data)}}else{kt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,0,0,0,Ut,Tt,Et[F]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,0,Xt,Ut,Tt,Et[F]);for(let st=0;st<P.length;st++){const ct=P[st];kt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,st+1,0,0,Ut,Tt,ct.image[F]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+F,st+1,Xt,Ut,Tt,ct.image[F])}}}m(v)&&f(i.TEXTURE_CUBE_MAP),Q.__version=nt.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function pt(A,v,k,J,nt,Q){const it=a.convert(k.format,k.colorSpace),lt=a.convert(k.type),gt=S(k.internalFormat,it,lt,k.colorSpace),zt=n.get(v),ot=n.get(k);if(ot.__renderTarget=v,!zt.__hasExternalTextures){const Et=Math.max(1,v.width>>Q),It=Math.max(1,v.height>>Q);nt===i.TEXTURE_3D||nt===i.TEXTURE_2D_ARRAY?e.texImage3D(nt,Q,gt,Et,It,v.depth,0,it,lt,null):e.texImage2D(nt,Q,gt,Et,It,0,it,lt,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),Rt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,nt,ot.__webglTexture,0,dt(v)):(nt===i.TEXTURE_2D||nt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,nt,ot.__webglTexture,Q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ut(A,v,k){if(i.bindRenderbuffer(i.RENDERBUFFER,A),v.depthBuffer){const J=v.depthTexture,nt=J&&J.isDepthTexture?J.type:null,Q=M(v.stencilBuffer,nt),it=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,lt=dt(v);Rt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt,Q,v.width,v.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,Q,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Q,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,A)}else{const J=v.textures;for(let nt=0;nt<J.length;nt++){const Q=J[nt],it=a.convert(Q.format,Q.colorSpace),lt=a.convert(Q.type),gt=S(Q.internalFormat,it,lt,Q.colorSpace),zt=dt(v);k&&Rt(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,zt,gt,v.width,v.height):Rt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,zt,gt,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,gt,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function V(A,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=n.get(v.depthTexture);J.__renderTarget=v,(!J.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),X(v.depthTexture,0);const nt=J.__webglTexture,Q=dt(v);if(v.depthTexture.format===Ci)Rt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0);else if(v.depthTexture.format===Ni)Rt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function tt(A){const v=n.get(A),k=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const J=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),J){const nt=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,J.removeEventListener("dispose",nt)};J.addEventListener("dispose",nt),v.__depthDisposeCallback=nt}v.__boundDepthTexture=J}if(A.depthTexture&&!v.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");V(v.__webglFramebuffer,A)}else if(k){v.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[J]),v.__webglDepthbuffer[J]===void 0)v.__webglDepthbuffer[J]=i.createRenderbuffer(),ut(v.__webglDepthbuffer[J],A,!1);else{const nt=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=v.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,Q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),ut(v.__webglDepthbuffer,A,!1);else{const J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,nt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function xt(A,v,k){const J=n.get(A);v!==void 0&&pt(J.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&tt(A)}function Ct(A){const v=A.texture,k=n.get(A),J=n.get(v);A.addEventListener("dispose",T);const nt=A.textures,Q=A.isWebGLCubeRenderTarget===!0,it=nt.length>1;if(it||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=v.version,r.memory.textures++),Q){k.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer[lt]=[];for(let gt=0;gt<v.mipmaps.length;gt++)k.__webglFramebuffer[lt][gt]=i.createFramebuffer()}else k.__webglFramebuffer[lt]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer=[];for(let lt=0;lt<v.mipmaps.length;lt++)k.__webglFramebuffer[lt]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(it)for(let lt=0,gt=nt.length;lt<gt;lt++){const zt=n.get(nt[lt]);zt.__webglTexture===void 0&&(zt.__webglTexture=i.createTexture(),r.memory.textures++)}if(A.samples>0&&Rt(A)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let lt=0;lt<nt.length;lt++){const gt=nt[lt];k.__webglColorRenderbuffer[lt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[lt]);const zt=a.convert(gt.format,gt.colorSpace),ot=a.convert(gt.type),Et=S(gt.internalFormat,zt,ot,gt.colorSpace,A.isXRRenderTarget===!0),It=dt(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,It,Et,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.RENDERBUFFER,k.__webglColorRenderbuffer[lt])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),ut(k.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Q){e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),vt(i.TEXTURE_CUBE_MAP,v);for(let lt=0;lt<6;lt++)if(v.mipmaps&&v.mipmaps.length>0)for(let gt=0;gt<v.mipmaps.length;gt++)pt(k.__webglFramebuffer[lt][gt],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,gt);else pt(k.__webglFramebuffer[lt],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);m(v)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(it){for(let lt=0,gt=nt.length;lt<gt;lt++){const zt=nt[lt],ot=n.get(zt);e.bindTexture(i.TEXTURE_2D,ot.__webglTexture),vt(i.TEXTURE_2D,zt),pt(k.__webglFramebuffer,A,zt,i.COLOR_ATTACHMENT0+lt,i.TEXTURE_2D,0),m(zt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let lt=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(lt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(lt,J.__webglTexture),vt(lt,v),v.mipmaps&&v.mipmaps.length>0)for(let gt=0;gt<v.mipmaps.length;gt++)pt(k.__webglFramebuffer[gt],A,v,i.COLOR_ATTACHMENT0,lt,gt);else pt(k.__webglFramebuffer,A,v,i.COLOR_ATTACHMENT0,lt,0);m(v)&&f(lt),e.unbindTexture()}A.depthBuffer&&tt(A)}function St(A){const v=A.textures;for(let k=0,J=v.length;k<J;k++){const nt=v[k];if(m(nt)){const Q=x(A),it=n.get(nt).__webglTexture;e.bindTexture(Q,it),f(Q),e.unbindTexture()}}}const Ft=[],D=[];function ae(A){if(A.samples>0){if(Rt(A)===!1){const v=A.textures,k=A.width,J=A.height;let nt=i.COLOR_BUFFER_BIT;const Q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=n.get(A),lt=v.length>1;if(lt)for(let gt=0;gt<v.length;gt++)e.bindFramebuffer(i.FRAMEBUFFER,it.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,it.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,it.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,it.__webglFramebuffer);for(let gt=0;gt<v.length;gt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(nt|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(nt|=i.STENCIL_BUFFER_BIT)),lt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,it.__webglColorRenderbuffer[gt]);const zt=n.get(v[gt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,zt,0)}i.blitFramebuffer(0,0,k,J,0,0,k,J,nt,i.NEAREST),c===!0&&(Ft.length=0,D.length=0,Ft.push(i.COLOR_ATTACHMENT0+gt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Ft.push(Q),D.push(Q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,D)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ft))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),lt)for(let gt=0;gt<v.length;gt++){e.bindFramebuffer(i.FRAMEBUFFER,it.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,it.__webglColorRenderbuffer[gt]);const zt=n.get(v[gt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,it.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,zt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,it.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const v=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function dt(A){return Math.min(s.maxSamples,A.samples)}function Rt(A){const v=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function G(A){const v=r.render.frame;d.get(A)!==v&&(d.set(A,v),A.update())}function at(A,v){const k=A.colorSpace,J=A.format,nt=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||k!==ki&&k!==Pn&&(Zt.getTransfer(k)===ee?(J!==Ye||nt!==yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),v}function rt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=I,this.resetTextureUnits=W,this.setTexture2D=X,this.setTexture2DArray=H,this.setTexture3D=K,this.setTextureCube=Y,this.rebindTextures=xt,this.setupRenderTarget=Ct,this.updateRenderTargetMipmap=St,this.updateMultisampleRenderTarget=ae,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Rt}function L0(i,t){function e(n,s=Pn){let a;const r=Zt.getTransfer(s);if(n===yn)return i.UNSIGNED_BYTE;if(n===vo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Mo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ml)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===xl)return i.BYTE;if(n===vl)return i.SHORT;if(n===es)return i.UNSIGNED_SHORT;if(n===xo)return i.INT;if(n===ti)return i.UNSIGNED_INT;if(n===xn)return i.FLOAT;if(n===is)return i.HALF_FLOAT;if(n===yl)return i.ALPHA;if(n===Sl)return i.RGB;if(n===Ye)return i.RGBA;if(n===El)return i.LUMINANCE;if(n===bl)return i.LUMINANCE_ALPHA;if(n===Ci)return i.DEPTH_COMPONENT;if(n===Ni)return i.DEPTH_STENCIL;if(n===Al)return i.RED;if(n===yo)return i.RED_INTEGER;if(n===Tl)return i.RG;if(n===So)return i.RG_INTEGER;if(n===Eo)return i.RGBA_INTEGER;if(n===Ys||n===Zs||n===qs||n===js)if(r===ee)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===Ys)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Zs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===qs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===js)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===Ys)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Zs)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===qs)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===js)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Pr||n===Lr||n===Dr||n===Ir)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===Pr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Lr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Dr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ir)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ur||n===Nr||n===Fr)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===Ur||n===Nr)return r===ee?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===Fr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===kr||n===zr||n===Or||n===Br||n===Hr||n===Vr||n===Gr||n===Wr||n===Xr||n===$r||n===Yr||n===Zr||n===qr||n===jr)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===kr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Or)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Br)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Hr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Vr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Gr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Wr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Xr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$r)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Yr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Zr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===qr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===jr)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ks||n===Kr||n===Jr)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===Ks)return r===ee?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Kr)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Jr)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===wl||n===Qr||n===to||n===eo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===Ks)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Qr)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===to)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===eo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ui?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class D0 extends Be{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Me extends he{constructor(){super(),this.isGroup=!0,this.type="Group"}}const I0={type:"move"};class Ja{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),f=this._getHandJoint(l,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=d.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&h>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(I0)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Me;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const U0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,N0=`
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

}`;class F0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Re,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Fn({vertexShader:U0,fragmentShader:N0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new re(new ma(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class k0 extends zi{constructor(t,e){super();const n=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,d=null,u=null,h=null,p=null,g=null;const _=new F0,m=e.getContextAttributes();let f=null,x=null;const S=[],M=[],L=new Ht;let w=null;const T=new Be;T.viewport=new le;const C=new Be;C.viewport=new le;const b=[T,C],y=new D0;let R=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ht=S[$];return ht===void 0&&(ht=new Ja,S[$]=ht),ht.getTargetRaySpace()},this.getControllerGrip=function($){let ht=S[$];return ht===void 0&&(ht=new Ja,S[$]=ht),ht.getGripSpace()},this.getHand=function($){let ht=S[$];return ht===void 0&&(ht=new Ja,S[$]=ht),ht.getHandSpace()};function I($){const ht=M.indexOf($.inputSource);if(ht===-1)return;const pt=S[ht];pt!==void 0&&(pt.update($.inputSource,$.frame,l||r),pt.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",X);for(let $=0;$<S.length;$++){const ht=M[$];ht!==null&&(M[$]=null,S[$].disconnect(ht))}R=null,W=null,_.reset(),t.setRenderTarget(f),p=null,h=null,u=null,s=null,x=null,wt.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",q),s.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const ht={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};p=new XRWebGLLayer(s,e,ht),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new ei(p.framebufferWidth,p.framebufferHeight,{format:Ye,type:yn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let ht=null,pt=null,ut=null;m.depth&&(ut=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ht=m.stencil?Ni:Ci,pt=m.stencil?Ui:ti);const V={colorFormat:e.RGBA8,depthFormat:ut,scaleFactor:a};u=new XRWebGLBinding(s,e),h=u.createProjectionLayer(V),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),x=new ei(h.textureWidth,h.textureHeight,{format:Ye,type:yn,depthTexture:new Hl(h.textureWidth,h.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,ht),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),wt.setContext(s),wt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function X($){for(let ht=0;ht<$.removed.length;ht++){const pt=$.removed[ht],ut=M.indexOf(pt);ut>=0&&(M[ut]=null,S[ut].disconnect(pt))}for(let ht=0;ht<$.added.length;ht++){const pt=$.added[ht];let ut=M.indexOf(pt);if(ut===-1){for(let tt=0;tt<S.length;tt++)if(tt>=M.length){M.push(pt),ut=tt;break}else if(M[tt]===null){M[tt]=pt,ut=tt;break}if(ut===-1)break}const V=S[ut];V&&V.connect(pt)}}const H=new B,K=new B;function Y($,ht,pt){H.setFromMatrixPosition(ht.matrixWorld),K.setFromMatrixPosition(pt.matrixWorld);const ut=H.distanceTo(K),V=ht.projectionMatrix.elements,tt=pt.projectionMatrix.elements,xt=V[14]/(V[10]-1),Ct=V[14]/(V[10]+1),St=(V[9]+1)/V[5],Ft=(V[9]-1)/V[5],D=(V[8]-1)/V[0],ae=(tt[8]+1)/tt[0],dt=xt*D,Rt=xt*ae,G=ut/(-D+ae),at=G*-D;if(ht.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(at),$.translateZ(G),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),V[10]===-1)$.projectionMatrix.copy(ht.projectionMatrix),$.projectionMatrixInverse.copy(ht.projectionMatrixInverse);else{const rt=xt+G,A=Ct+G,v=dt-at,k=Rt+(ut-at),J=St*Ct/A*rt,nt=Ft*Ct/A*rt;$.projectionMatrix.makePerspective(v,k,J,nt,rt,A),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function et($,ht){ht===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ht.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let ht=$.near,pt=$.far;_.texture!==null&&(_.depthNear>0&&(ht=_.depthNear),_.depthFar>0&&(pt=_.depthFar)),y.near=C.near=T.near=ht,y.far=C.far=T.far=pt,(R!==y.near||W!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),R=y.near,W=y.far),T.layers.mask=$.layers.mask|2,C.layers.mask=$.layers.mask|4,y.layers.mask=T.layers.mask|C.layers.mask;const ut=$.parent,V=y.cameras;et(y,ut);for(let tt=0;tt<V.length;tt++)et(V[tt],ut);V.length===2?Y(y,T,C):y.projectionMatrix.copy(T.projectionMatrix),ft($,y,ut)};function ft($,ht,pt){pt===null?$.matrix.copy(ht.matrixWorld):($.matrix.copy(pt.matrixWorld),$.matrix.invert(),$.matrix.multiply(ht.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ht.projectionMatrix),$.projectionMatrixInverse.copy(ht.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=io*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&p===null))return c},this.setFoveation=function($){c=$,h!==null&&(h.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let _t=null;function vt($,ht){if(d=ht.getViewerPose(l||r),g=ht,d!==null){const pt=d.views;p!==null&&(t.setRenderTargetFramebuffer(x,p.framebuffer),t.setRenderTarget(x));let ut=!1;pt.length!==y.cameras.length&&(y.cameras.length=0,ut=!0);for(let tt=0;tt<pt.length;tt++){const xt=pt[tt];let Ct=null;if(p!==null)Ct=p.getViewport(xt);else{const Ft=u.getViewSubImage(h,xt);Ct=Ft.viewport,tt===0&&(t.setRenderTargetTextures(x,Ft.colorTexture,h.ignoreDepthValues?void 0:Ft.depthStencilTexture),t.setRenderTarget(x))}let St=b[tt];St===void 0&&(St=new Be,St.layers.enable(tt),St.viewport=new le,b[tt]=St),St.matrix.fromArray(xt.transform.matrix),St.matrix.decompose(St.position,St.quaternion,St.scale),St.projectionMatrix.fromArray(xt.projectionMatrix),St.projectionMatrixInverse.copy(St.projectionMatrix).invert(),St.viewport.set(Ct.x,Ct.y,Ct.width,Ct.height),tt===0&&(y.matrix.copy(St.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ut===!0&&y.cameras.push(St)}const V=s.enabledFeatures;if(V&&V.includes("depth-sensing")){const tt=u.getDepthInformation(pt[0]);tt&&tt.isValid&&tt.texture&&_.init(t,tt,s.renderState)}}for(let pt=0;pt<S.length;pt++){const ut=M[pt],V=S[pt];ut!==null&&V!==void 0&&V.update(ut,ht,l||r)}_t&&_t($,ht),ht.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ht}),g=null}const wt=new Ol;wt.setAnimationLoop(vt),this.setAnimationLoop=function($){_t=$},this.dispose=function(){}}}const Wn=new an,z0=new oe;function O0(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Fl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,x,S,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(m,f):f.isMeshToonMaterial?(a(m,f),u(m,f)):f.isMeshPhongMaterial?(a(m,f),d(m,f)):f.isMeshStandardMaterial?(a(m,f),h(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(a(m,f),g(m,f)):f.isMeshDepthMaterial?a(m,f):f.isMeshDistanceMaterial?(a(m,f),_(m,f)):f.isMeshNormalMaterial?a(m,f):f.isLineBasicMaterial?(r(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,x,S):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Pe&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Pe&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const x=t.get(f),S=x.envMap,M=x.envMapRotation;S&&(m.envMap.value=S,Wn.copy(M),Wn.x*=-1,Wn.y*=-1,Wn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Wn.y*=-1,Wn.z*=-1),m.envMapRotation.value.setFromMatrix4(z0.makeRotationFromEuler(Wn)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function r(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,x,S){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*x,m.scale.value=S*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function d(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function h(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,x){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Pe&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const x=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function B0(i,t,e,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,S){const M=S.program;n.uniformBlockBinding(x,M)}function l(x,S){let M=s[x.id];M===void 0&&(g(x),M=d(x),s[x.id]=M,x.addEventListener("dispose",m));const L=S.program;n.updateUBOMapping(x,L);const w=t.render.frame;a[x.id]!==w&&(h(x),a[x.id]=w)}function d(x){const S=u();x.__bindingPointIndex=S;const M=i.createBuffer(),L=x.__size,w=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,L,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,M),M}function u(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const S=s[x.id],M=x.uniforms,L=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let w=0,T=M.length;w<T;w++){const C=Array.isArray(M[w])?M[w]:[M[w]];for(let b=0,y=C.length;b<y;b++){const R=C[b];if(p(R,w,b,L)===!0){const W=R.__offset,I=Array.isArray(R.value)?R.value:[R.value];let q=0;for(let X=0;X<I.length;X++){const H=I[X],K=_(H);typeof H=="number"||typeof H=="boolean"?(R.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,W+q,R.__data)):H.isMatrix3?(R.__data[0]=H.elements[0],R.__data[1]=H.elements[1],R.__data[2]=H.elements[2],R.__data[3]=0,R.__data[4]=H.elements[3],R.__data[5]=H.elements[4],R.__data[6]=H.elements[5],R.__data[7]=0,R.__data[8]=H.elements[6],R.__data[9]=H.elements[7],R.__data[10]=H.elements[8],R.__data[11]=0):(H.toArray(R.__data,q),q+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,W,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(x,S,M,L){const w=x.value,T=S+"_"+M;if(L[T]===void 0)return typeof w=="number"||typeof w=="boolean"?L[T]=w:L[T]=w.clone(),!0;{const C=L[T];if(typeof w=="number"||typeof w=="boolean"){if(C!==w)return L[T]=w,!0}else if(C.equals(w)===!1)return C.copy(w),!0}return!1}function g(x){const S=x.uniforms;let M=0;const L=16;for(let T=0,C=S.length;T<C;T++){const b=Array.isArray(S[T])?S[T]:[S[T]];for(let y=0,R=b.length;y<R;y++){const W=b[y],I=Array.isArray(W.value)?W.value:[W.value];for(let q=0,X=I.length;q<X;q++){const H=I[q],K=_(H),Y=M%L,et=Y%K.boundary,ft=Y+et;M+=et,ft!==0&&L-ft<K.storage&&(M+=L-ft),W.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=M,M+=K.storage}}}const w=M%L;return w>0&&(M+=L-w),x.__size=M,x.__cache={},this}function _(x){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),S}function m(x){const S=x.target;S.removeEventListener("dispose",m);const M=r.indexOf(S.__bindingPointIndex);r.splice(M,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete a[S.id]}function f(){for(const x in s)i.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:f}}class H0{constructor(t={}){const{canvas:e=Ru(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=r;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const x=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Oe,this.toneMapping=In,this.toneMappingExposure=1;const M=this;let L=!1,w=0,T=0,C=null,b=-1,y=null;const R=new le,W=new le;let I=null;const q=new Bt(0);let X=0,H=e.width,K=e.height,Y=1,et=null,ft=null;const _t=new le(0,0,H,K),vt=new le(0,0,H,K);let wt=!1;const $=new To;let ht=!1,pt=!1;const ut=new oe,V=new oe,tt=new B,xt=new le,Ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let St=!1;function Ft(){return C===null?Y:1}let D=n;function ae(E,z){return e.getContext(E,z)}try{const E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${go}`),e.addEventListener("webglcontextlost",F,!1),e.addEventListener("webglcontextrestored",st,!1),e.addEventListener("webglcontextcreationerror",ct,!1),D===null){const z="webgl2";if(D=ae(z,E),D===null)throw ae(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let dt,Rt,G,at,rt,A,v,k,J,nt,Q,it,lt,gt,zt,ot,Et,It,Ut,Tt,Xt,kt,Jt,U;function N(){dt=new $m(D),dt.init(),kt=new L0(D,dt),Rt=new Bm(D,dt,t,kt),G=new R0(D,dt),Rt.reverseDepthBuffer&&h&&G.buffers.depth.setReversed(!0),at=new qm(D),rt=new f0,A=new P0(D,dt,G,rt,Rt,kt,at),v=new Vm(M),k=new Xm(M),J=new ef(D),Jt=new zm(D,J),nt=new Ym(D,J,at,Jt),Q=new Km(D,nt,J,at),Ut=new jm(D,Rt,A),ot=new Hm(rt),it=new u0(M,v,k,dt,Rt,Jt,ot),lt=new O0(M,rt),gt=new m0,zt=new y0(dt),It=new km(M,v,k,G,Q,p,c),Et=new T0(M,Q,Rt),U=new B0(D,at,Rt,G),Tt=new Om(D,dt,at),Xt=new Zm(D,dt,at),at.programs=it.programs,M.capabilities=Rt,M.extensions=dt,M.properties=rt,M.renderLists=gt,M.shadowMap=Et,M.state=G,M.info=at}N();const P=new k0(M,D);this.xr=P,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const E=dt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=dt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(E){E!==void 0&&(Y=E,this.setSize(H,K,!1))},this.getSize=function(E){return E.set(H,K)},this.setSize=function(E,z,Z=!0){if(P.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=E,K=z,e.width=Math.floor(E*Y),e.height=Math.floor(z*Y),Z===!0&&(e.style.width=E+"px",e.style.height=z+"px"),this.setViewport(0,0,E,z)},this.getDrawingBufferSize=function(E){return E.set(H*Y,K*Y).floor()},this.setDrawingBufferSize=function(E,z,Z){H=E,K=z,Y=Z,e.width=Math.floor(E*Z),e.height=Math.floor(z*Z),this.setViewport(0,0,E,z)},this.getCurrentViewport=function(E){return E.copy(R)},this.getViewport=function(E){return E.copy(_t)},this.setViewport=function(E,z,Z,j){E.isVector4?_t.set(E.x,E.y,E.z,E.w):_t.set(E,z,Z,j),G.viewport(R.copy(_t).multiplyScalar(Y).round())},this.getScissor=function(E){return E.copy(vt)},this.setScissor=function(E,z,Z,j){E.isVector4?vt.set(E.x,E.y,E.z,E.w):vt.set(E,z,Z,j),G.scissor(W.copy(vt).multiplyScalar(Y).round())},this.getScissorTest=function(){return wt},this.setScissorTest=function(E){G.setScissorTest(wt=E)},this.setOpaqueSort=function(E){et=E},this.setTransparentSort=function(E){ft=E},this.getClearColor=function(E){return E.copy(It.getClearColor())},this.setClearColor=function(){It.setClearColor.apply(It,arguments)},this.getClearAlpha=function(){return It.getClearAlpha()},this.setClearAlpha=function(){It.setClearAlpha.apply(It,arguments)},this.clear=function(E=!0,z=!0,Z=!0){let j=0;if(E){let O=!1;if(C!==null){const mt=C.texture.format;O=mt===Eo||mt===So||mt===yo}if(O){const mt=C.texture.type,bt=mt===yn||mt===ti||mt===es||mt===Ui||mt===vo||mt===Mo,Pt=It.getClearColor(),Lt=It.getClearAlpha(),Nt=Pt.r,Ot=Pt.g,Dt=Pt.b;bt?(g[0]=Nt,g[1]=Ot,g[2]=Dt,g[3]=Lt,D.clearBufferuiv(D.COLOR,0,g)):(_[0]=Nt,_[1]=Ot,_[2]=Dt,_[3]=Lt,D.clearBufferiv(D.COLOR,0,_))}else j|=D.COLOR_BUFFER_BIT}z&&(j|=D.DEPTH_BUFFER_BIT),Z&&(j|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",F,!1),e.removeEventListener("webglcontextrestored",st,!1),e.removeEventListener("webglcontextcreationerror",ct,!1),gt.dispose(),zt.dispose(),rt.dispose(),v.dispose(),k.dispose(),Q.dispose(),Jt.dispose(),U.dispose(),it.dispose(),P.dispose(),P.removeEventListener("sessionstart",kn),P.removeEventListener("sessionend",ii),on.stop()};function F(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function st(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const E=at.autoReset,z=Et.enabled,Z=Et.autoUpdate,j=Et.needsUpdate,O=Et.type;N(),at.autoReset=E,Et.enabled=z,Et.autoUpdate=Z,Et.needsUpdate=j,Et.type=O}function ct(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Mt(E){const z=E.target;z.removeEventListener("dispose",Mt),Gt(z)}function Gt(E){ie(E),rt.remove(E)}function ie(E){const z=rt.get(E).programs;z!==void 0&&(z.forEach(function(Z){it.releaseProgram(Z)}),E.isShaderMaterial&&it.releaseShaderCache(E))}this.renderBufferDirect=function(E,z,Z,j,O,mt){z===null&&(z=Ct);const bt=O.isMesh&&O.matrixWorld.determinant()<0,Pt=ds(E,z,Z,j,O);G.setMaterial(j,bt);let Lt=Z.index,Nt=1;if(j.wireframe===!0){if(Lt=nt.getWireframeAttribute(Z),Lt===void 0)return;Nt=2}const Ot=Z.drawRange,Dt=Z.attributes.position;let Yt=Ot.start*Nt,Qt=(Ot.start+Ot.count)*Nt;mt!==null&&(Yt=Math.max(Yt,mt.start*Nt),Qt=Math.min(Qt,(mt.start+mt.count)*Nt)),Lt!==null?(Yt=Math.max(Yt,0),Qt=Math.min(Qt,Lt.count)):Dt!=null&&(Yt=Math.max(Yt,0),Qt=Math.min(Qt,Dt.count));const te=Qt-Yt;if(te<0||te===1/0)return;Jt.setup(O,j,Pt,Z,Lt);let fe,jt=Tt;if(Lt!==null&&(fe=J.get(Lt),jt=Xt,jt.setIndex(fe)),O.isMesh)j.wireframe===!0?(G.setLineWidth(j.wireframeLinewidth*Ft()),jt.setMode(D.LINES)):jt.setMode(D.TRIANGLES);else if(O.isLine){let At=j.linewidth;At===void 0&&(At=1),G.setLineWidth(At*Ft()),O.isLineSegments?jt.setMode(D.LINES):O.isLineLoop?jt.setMode(D.LINE_LOOP):jt.setMode(D.LINE_STRIP)}else O.isPoints?jt.setMode(D.POINTS):O.isSprite&&jt.setMode(D.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)jt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(dt.get("WEBGL_multi_draw"))jt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const At=O._multiDrawStarts,Ge=O._multiDrawCounts,Kt=O._multiDrawCount,De=Lt?J.get(Lt).bytesPerElement:1,Sn=rt.get(j).currentProgram.getUniforms();for(let pe=0;pe<Kt;pe++)Sn.setValue(D,"_gl_DrawID",pe),jt.render(At[pe]/De,Ge[pe])}else if(O.isInstancedMesh)jt.renderInstances(Yt,te,O.count);else if(Z.isInstancedBufferGeometry){const At=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Ge=Math.min(Z.instanceCount,At);jt.renderInstances(Yt,te,Ge)}else jt.render(Yt,te)};function $t(E,z,Z){E.transparent===!0&&E.side===Te&&E.forceSinglePass===!1?(E.side=Pe,E.needsUpdate=!0,ai(E,z,Z),E.side=Nn,E.needsUpdate=!0,ai(E,z,Z),E.side=Te):ai(E,z,Z)}this.compile=function(E,z,Z=null){Z===null&&(Z=E),f=zt.get(Z),f.init(z),S.push(f),Z.traverseVisible(function(O){O.isLight&&O.layers.test(z.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),E!==Z&&E.traverseVisible(function(O){O.isLight&&O.layers.test(z.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),f.setupLights();const j=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const mt=O.material;if(mt)if(Array.isArray(mt))for(let bt=0;bt<mt.length;bt++){const Pt=mt[bt];$t(Pt,Z,O),j.add(Pt)}else $t(mt,Z,O),j.add(mt)}),S.pop(),f=null,j},this.compileAsync=function(E,z,Z=null){const j=this.compile(E,z,Z);return new Promise(O=>{function mt(){if(j.forEach(function(bt){rt.get(bt).currentProgram.isReady()&&j.delete(bt)}),j.size===0){O(E);return}setTimeout(mt,10)}dt.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let qt=null;function ue(E){qt&&qt(E)}function kn(){on.stop()}function ii(){on.start()}const on=new Ol;on.setAnimationLoop(ue),typeof self<"u"&&on.setContext(self),this.setAnimationLoop=function(E){qt=E,P.setAnimationLoop(E),E===null?on.stop():on.start()},P.addEventListener("sessionstart",kn),P.addEventListener("sessionend",ii),this.render=function(E,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),P.enabled===!0&&P.isPresenting===!0&&(P.cameraAutoUpdate===!0&&P.updateCamera(z),z=P.getCamera()),E.isScene===!0&&E.onBeforeRender(M,E,z,C),f=zt.get(E,S.length),f.init(z),S.push(f),V.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),$.setFromProjectionMatrix(V),pt=this.localClippingEnabled,ht=ot.init(this.clippingPlanes,pt),m=gt.get(E,x.length),m.init(),x.push(m),P.enabled===!0&&P.isPresenting===!0){const mt=M.xr.getDepthSensingMesh();mt!==null&&Bi(mt,z,-1/0,M.sortObjects)}Bi(E,z,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(et,ft),St=P.enabled===!1||P.isPresenting===!1||P.hasDepthSensing()===!1,St&&It.addToRenderList(m,E),this.info.render.frame++,ht===!0&&ot.beginShadows();const Z=f.state.shadowsArray;Et.render(Z,E,z),ht===!0&&ot.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=m.opaque,O=m.transmissive;if(f.setupLights(),z.isArrayCamera){const mt=z.cameras;if(O.length>0)for(let bt=0,Pt=mt.length;bt<Pt;bt++){const Lt=mt[bt];os(j,O,E,Lt)}St&&It.render(E);for(let bt=0,Pt=mt.length;bt<Pt;bt++){const Lt=mt[bt];rs(m,E,Lt,Lt.viewport)}}else O.length>0&&os(j,O,E,z),St&&It.render(E),rs(m,E,z);C!==null&&(A.updateMultisampleRenderTarget(C),A.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(M,E,z),Jt.resetDefaultState(),b=-1,y=null,S.pop(),S.length>0?(f=S[S.length-1],ht===!0&&ot.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Bi(E,z,Z,j){if(E.visible===!1)return;if(E.layers.test(z.layers)){if(E.isGroup)Z=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(z);else if(E.isLight)f.pushLight(E),E.castShadow&&f.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||$.intersectsSprite(E)){j&&xt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(V);const bt=Q.update(E),Pt=E.material;Pt.visible&&m.push(E,bt,Pt,Z,xt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||$.intersectsObject(E))){const bt=Q.update(E),Pt=E.material;if(j&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),xt.copy(E.boundingSphere.center)):(bt.boundingSphere===null&&bt.computeBoundingSphere(),xt.copy(bt.boundingSphere.center)),xt.applyMatrix4(E.matrixWorld).applyMatrix4(V)),Array.isArray(Pt)){const Lt=bt.groups;for(let Nt=0,Ot=Lt.length;Nt<Ot;Nt++){const Dt=Lt[Nt],Yt=Pt[Dt.materialIndex];Yt&&Yt.visible&&m.push(E,bt,Yt,Z,xt.z,Dt)}}else Pt.visible&&m.push(E,bt,Pt,Z,xt.z,null)}}const mt=E.children;for(let bt=0,Pt=mt.length;bt<Pt;bt++)Bi(mt[bt],z,Z,j)}function rs(E,z,Z,j){const O=E.opaque,mt=E.transmissive,bt=E.transparent;f.setupLightsView(Z),ht===!0&&ot.setGlobalState(M.clippingPlanes,Z),j&&G.viewport(R.copy(j)),O.length>0&&si(O,z,Z),mt.length>0&&si(mt,z,Z),bt.length>0&&si(bt,z,Z),G.buffers.depth.setTest(!0),G.buffers.depth.setMask(!0),G.buffers.color.setMask(!0),G.setPolygonOffset(!1)}function os(E,z,Z,j){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[j.id]===void 0&&(f.state.transmissionRenderTarget[j.id]=new ei(1,1,{generateMipmaps:!0,type:dt.has("EXT_color_buffer_half_float")||dt.has("EXT_color_buffer_float")?is:yn,minFilter:Kn,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Zt.workingColorSpace}));const mt=f.state.transmissionRenderTarget[j.id],bt=j.viewport||R;mt.setSize(bt.z,bt.w);const Pt=M.getRenderTarget();M.setRenderTarget(mt),M.getClearColor(q),X=M.getClearAlpha(),X<1&&M.setClearColor(16777215,.5),M.clear(),St&&It.render(Z);const Lt=M.toneMapping;M.toneMapping=In;const Nt=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),f.setupLightsView(j),ht===!0&&ot.setGlobalState(M.clippingPlanes,j),si(E,Z,j),A.updateMultisampleRenderTarget(mt),A.updateRenderTargetMipmap(mt),dt.has("WEBGL_multisampled_render_to_texture")===!1){let Ot=!1;for(let Dt=0,Yt=z.length;Dt<Yt;Dt++){const Qt=z[Dt],te=Qt.object,fe=Qt.geometry,jt=Qt.material,At=Qt.group;if(jt.side===Te&&te.layers.test(j.layers)){const Ge=jt.side;jt.side=Pe,jt.needsUpdate=!0,cs(te,Z,j,fe,jt,At),jt.side=Ge,jt.needsUpdate=!0,Ot=!0}}Ot===!0&&(A.updateMultisampleRenderTarget(mt),A.updateRenderTargetMipmap(mt))}M.setRenderTarget(Pt),M.setClearColor(q,X),Nt!==void 0&&(j.viewport=Nt),M.toneMapping=Lt}function si(E,z,Z){const j=z.isScene===!0?z.overrideMaterial:null;for(let O=0,mt=E.length;O<mt;O++){const bt=E[O],Pt=bt.object,Lt=bt.geometry,Nt=j===null?bt.material:j,Ot=bt.group;Pt.layers.test(Z.layers)&&cs(Pt,z,Z,Lt,Nt,Ot)}}function cs(E,z,Z,j,O,mt){E.onBeforeRender(M,z,Z,j,O,mt),E.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(M,z,Z,j,E,mt),O.transparent===!0&&O.side===Te&&O.forceSinglePass===!1?(O.side=Pe,O.needsUpdate=!0,M.renderBufferDirect(Z,z,j,O,E,mt),O.side=Nn,O.needsUpdate=!0,M.renderBufferDirect(Z,z,j,O,E,mt),O.side=Te):M.renderBufferDirect(Z,z,j,O,E,mt),E.onAfterRender(M,z,Z,j,O,mt)}function ai(E,z,Z){z.isScene!==!0&&(z=Ct);const j=rt.get(E),O=f.state.lights,mt=f.state.shadowsArray,bt=O.state.version,Pt=it.getParameters(E,O.state,mt,z,Z),Lt=it.getProgramCacheKey(Pt);let Nt=j.programs;j.environment=E.isMeshStandardMaterial?z.environment:null,j.fog=z.fog,j.envMap=(E.isMeshStandardMaterial?k:v).get(E.envMap||j.environment),j.envMapRotation=j.environment!==null&&E.envMap===null?z.environmentRotation:E.envMapRotation,Nt===void 0&&(E.addEventListener("dispose",Mt),Nt=new Map,j.programs=Nt);let Ot=Nt.get(Lt);if(Ot!==void 0){if(j.currentProgram===Ot&&j.lightsStateVersion===bt)return hs(E,Pt),Ot}else Pt.uniforms=it.getUniforms(E),E.onBeforeCompile(Pt,M),Ot=it.acquireProgram(Pt,Lt),Nt.set(Lt,Ot),j.uniforms=Pt.uniforms;const Dt=j.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Dt.clippingPlanes=ot.uniform),hs(E,Pt),j.needsLights=xa(E),j.lightsStateVersion=bt,j.needsLights&&(Dt.ambientLightColor.value=O.state.ambient,Dt.lightProbe.value=O.state.probe,Dt.directionalLights.value=O.state.directional,Dt.directionalLightShadows.value=O.state.directionalShadow,Dt.spotLights.value=O.state.spot,Dt.spotLightShadows.value=O.state.spotShadow,Dt.rectAreaLights.value=O.state.rectArea,Dt.ltc_1.value=O.state.rectAreaLTC1,Dt.ltc_2.value=O.state.rectAreaLTC2,Dt.pointLights.value=O.state.point,Dt.pointLightShadows.value=O.state.pointShadow,Dt.hemisphereLights.value=O.state.hemi,Dt.directionalShadowMap.value=O.state.directionalShadowMap,Dt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Dt.spotShadowMap.value=O.state.spotShadowMap,Dt.spotLightMatrix.value=O.state.spotLightMatrix,Dt.spotLightMap.value=O.state.spotLightMap,Dt.pointShadowMap.value=O.state.pointShadowMap,Dt.pointShadowMatrix.value=O.state.pointShadowMatrix),j.currentProgram=Ot,j.uniformsList=null,Ot}function ls(E){if(E.uniformsList===null){const z=E.currentProgram.getUniforms();E.uniformsList=Qs.seqWithValue(z.seq,E.uniforms)}return E.uniformsList}function hs(E,z){const Z=rt.get(E);Z.outputColorSpace=z.outputColorSpace,Z.batching=z.batching,Z.batchingColor=z.batchingColor,Z.instancing=z.instancing,Z.instancingColor=z.instancingColor,Z.instancingMorph=z.instancingMorph,Z.skinning=z.skinning,Z.morphTargets=z.morphTargets,Z.morphNormals=z.morphNormals,Z.morphColors=z.morphColors,Z.morphTargetsCount=z.morphTargetsCount,Z.numClippingPlanes=z.numClippingPlanes,Z.numIntersection=z.numClipIntersection,Z.vertexAlphas=z.vertexAlphas,Z.vertexTangents=z.vertexTangents,Z.toneMapping=z.toneMapping}function ds(E,z,Z,j,O){z.isScene!==!0&&(z=Ct),A.resetTextureUnits();const mt=z.fog,bt=j.isMeshStandardMaterial?z.environment:null,Pt=C===null?M.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ki,Lt=(j.isMeshStandardMaterial?k:v).get(j.envMap||bt),Nt=j.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Ot=!!Z.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Dt=!!Z.morphAttributes.position,Yt=!!Z.morphAttributes.normal,Qt=!!Z.morphAttributes.color;let te=In;j.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(te=M.toneMapping);const fe=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,jt=fe!==void 0?fe.length:0,At=rt.get(j),Ge=f.state.lights;if(ht===!0&&(pt===!0||E!==y)){const Ue=E===y&&j.id===b;ot.setState(j,E,Ue)}let Kt=!1;j.version===At.__version?(At.needsLights&&At.lightsStateVersion!==Ge.state.version||At.outputColorSpace!==Pt||O.isBatchedMesh&&At.batching===!1||!O.isBatchedMesh&&At.batching===!0||O.isBatchedMesh&&At.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&At.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&At.instancing===!1||!O.isInstancedMesh&&At.instancing===!0||O.isSkinnedMesh&&At.skinning===!1||!O.isSkinnedMesh&&At.skinning===!0||O.isInstancedMesh&&At.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&At.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&At.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&At.instancingMorph===!1&&O.morphTexture!==null||At.envMap!==Lt||j.fog===!0&&At.fog!==mt||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==ot.numPlanes||At.numIntersection!==ot.numIntersection)||At.vertexAlphas!==Nt||At.vertexTangents!==Ot||At.morphTargets!==Dt||At.morphNormals!==Yt||At.morphColors!==Qt||At.toneMapping!==te||At.morphTargetsCount!==jt)&&(Kt=!0):(Kt=!0,At.__version=j.version);let De=At.currentProgram;Kt===!0&&(De=ai(j,z,O));let Sn=!1,pe=!1,zn=!1;const se=De.getUniforms(),Ie=At.uniforms;if(G.useProgram(De.program)&&(Sn=!0,pe=!0,zn=!0),j.id!==b&&(b=j.id,pe=!0),Sn||y!==E){G.buffers.depth.getReversed()?(ut.copy(E.projectionMatrix),Pu(ut),Lu(ut),se.setValue(D,"projectionMatrix",ut)):se.setValue(D,"projectionMatrix",E.projectionMatrix),se.setValue(D,"viewMatrix",E.matrixWorldInverse);const je=se.map.cameraPosition;je!==void 0&&je.setValue(D,tt.setFromMatrixPosition(E.matrixWorld)),Rt.logarithmicDepthBuffer&&se.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&se.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,pe=!0,zn=!0)}if(O.isSkinnedMesh){se.setOptional(D,O,"bindMatrix"),se.setOptional(D,O,"bindMatrixInverse");const Ue=O.skeleton;Ue&&(Ue.boneTexture===null&&Ue.computeBoneTexture(),se.setValue(D,"boneTexture",Ue.boneTexture,A))}O.isBatchedMesh&&(se.setOptional(D,O,"batchingTexture"),se.setValue(D,"batchingTexture",O._matricesTexture,A),se.setOptional(D,O,"batchingIdTexture"),se.setValue(D,"batchingIdTexture",O._indirectTexture,A),se.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&se.setValue(D,"batchingColorTexture",O._colorsTexture,A));const En=Z.morphAttributes;if((En.position!==void 0||En.normal!==void 0||En.color!==void 0)&&Ut.update(O,Z,De),(pe||At.receiveShadow!==O.receiveShadow)&&(At.receiveShadow=O.receiveShadow,se.setValue(D,"receiveShadow",O.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(Ie.envMap.value=Lt,Ie.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&z.environment!==null&&(Ie.envMapIntensity.value=z.environmentIntensity),pe&&(se.setValue(D,"toneMappingExposure",M.toneMappingExposure),At.needsLights&&us(Ie,zn),mt&&j.fog===!0&&lt.refreshFogUniforms(Ie,mt),lt.refreshMaterialUniforms(Ie,j,Y,K,f.state.transmissionRenderTarget[E.id]),Qs.upload(D,ls(At),Ie,A)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(Qs.upload(D,ls(At),Ie,A),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&se.setValue(D,"center",O.center),se.setValue(D,"modelViewMatrix",O.modelViewMatrix),se.setValue(D,"normalMatrix",O.normalMatrix),se.setValue(D,"modelMatrix",O.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const Ue=j.uniformsGroups;for(let je=0,Ke=Ue.length;je<Ke;je++){const Hi=Ue[je];U.update(Hi,De),U.bind(Hi,De)}}return De}function us(E,z){E.ambientLightColor.needsUpdate=z,E.lightProbe.needsUpdate=z,E.directionalLights.needsUpdate=z,E.directionalLightShadows.needsUpdate=z,E.pointLights.needsUpdate=z,E.pointLightShadows.needsUpdate=z,E.spotLights.needsUpdate=z,E.spotLightShadows.needsUpdate=z,E.rectAreaLights.needsUpdate=z,E.hemisphereLights.needsUpdate=z}function xa(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,z,Z){rt.get(E.texture).__webglTexture=z,rt.get(E.depthTexture).__webglTexture=Z;const j=rt.get(E);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=Z===void 0,j.__autoAllocateDepthBuffer||dt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,z){const Z=rt.get(E);Z.__webglFramebuffer=z,Z.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(E,z=0,Z=0){C=E,w=z,T=Z;let j=!0,O=null,mt=!1,bt=!1;if(E){const Lt=rt.get(E);if(Lt.__useDefaultFramebuffer!==void 0)G.bindFramebuffer(D.FRAMEBUFFER,null),j=!1;else if(Lt.__webglFramebuffer===void 0)A.setupRenderTarget(E);else if(Lt.__hasExternalTextures)A.rebindTextures(E,rt.get(E.texture).__webglTexture,rt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Dt=E.depthTexture;if(Lt.__boundDepthTexture!==Dt){if(Dt!==null&&rt.has(Dt)&&(E.width!==Dt.image.width||E.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(E)}}const Nt=E.texture;(Nt.isData3DTexture||Nt.isDataArrayTexture||Nt.isCompressedArrayTexture)&&(bt=!0);const Ot=rt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ot[z])?O=Ot[z][Z]:O=Ot[z],mt=!0):E.samples>0&&A.useMultisampledRTT(E)===!1?O=rt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ot)?O=Ot[Z]:O=Ot,R.copy(E.viewport),W.copy(E.scissor),I=E.scissorTest}else R.copy(_t).multiplyScalar(Y).floor(),W.copy(vt).multiplyScalar(Y).floor(),I=wt;if(G.bindFramebuffer(D.FRAMEBUFFER,O)&&j&&G.drawBuffers(E,O),G.viewport(R),G.scissor(W),G.setScissorTest(I),mt){const Lt=rt.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+z,Lt.__webglTexture,Z)}else if(bt){const Lt=rt.get(E.texture),Nt=z||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Lt.__webglTexture,Z||0,Nt)}b=-1},this.readRenderTargetPixels=function(E,z,Z,j,O,mt,bt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&bt!==void 0&&(Pt=Pt[bt]),Pt){G.bindFramebuffer(D.FRAMEBUFFER,Pt);try{const Lt=E.texture,Nt=Lt.format,Ot=Lt.type;if(!Rt.textureFormatReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Rt.textureTypeReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=E.width-j&&Z>=0&&Z<=E.height-O&&D.readPixels(z,Z,j,O,kt.convert(Nt),kt.convert(Ot),mt)}finally{const Lt=C!==null?rt.get(C).__webglFramebuffer:null;G.bindFramebuffer(D.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(E,z,Z,j,O,mt,bt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&bt!==void 0&&(Pt=Pt[bt]),Pt){const Lt=E.texture,Nt=Lt.format,Ot=Lt.type;if(!Rt.textureFormatReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Rt.textureTypeReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=E.width-j&&Z>=0&&Z<=E.height-O){G.bindFramebuffer(D.FRAMEBUFFER,Pt);const Dt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Dt),D.bufferData(D.PIXEL_PACK_BUFFER,mt.byteLength,D.STREAM_READ),D.readPixels(z,Z,j,O,kt.convert(Nt),kt.convert(Ot),0);const Yt=C!==null?rt.get(C).__webglFramebuffer:null;G.bindFramebuffer(D.FRAMEBUFFER,Yt);const Qt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Cu(D,Qt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Dt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,mt),D.deleteBuffer(Dt),D.deleteSync(Qt),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,z=null,Z=0){E.isTexture!==!0&&(ji("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,E=arguments[1]);const j=Math.pow(2,-Z),O=Math.floor(E.image.width*j),mt=Math.floor(E.image.height*j),bt=z!==null?z.x:0,Pt=z!==null?z.y:0;A.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,Z,0,0,bt,Pt,O,mt),G.unbindTexture()},this.copyTextureToTexture=function(E,z,Z=null,j=null,O=0){E.isTexture!==!0&&(ji("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,E=arguments[1],z=arguments[2],O=arguments[3]||0,Z=null);let mt,bt,Pt,Lt,Nt,Ot,Dt,Yt,Qt;const te=E.isCompressedTexture?E.mipmaps[O]:E.image;Z!==null?(mt=Z.max.x-Z.min.x,bt=Z.max.y-Z.min.y,Pt=Z.isBox3?Z.max.z-Z.min.z:1,Lt=Z.min.x,Nt=Z.min.y,Ot=Z.isBox3?Z.min.z:0):(mt=te.width,bt=te.height,Pt=te.depth||1,Lt=0,Nt=0,Ot=0),j!==null?(Dt=j.x,Yt=j.y,Qt=j.z):(Dt=0,Yt=0,Qt=0);const fe=kt.convert(z.format),jt=kt.convert(z.type);let At;z.isData3DTexture?(A.setTexture3D(z,0),At=D.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(A.setTexture2DArray(z,0),At=D.TEXTURE_2D_ARRAY):(A.setTexture2D(z,0),At=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,z.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,z.unpackAlignment);const Ge=D.getParameter(D.UNPACK_ROW_LENGTH),Kt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),De=D.getParameter(D.UNPACK_SKIP_PIXELS),Sn=D.getParameter(D.UNPACK_SKIP_ROWS),pe=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,te.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,te.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Lt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Nt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ot);const zn=E.isDataArrayTexture||E.isData3DTexture,se=z.isDataArrayTexture||z.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const Ie=rt.get(E),En=rt.get(z),Ue=rt.get(Ie.__renderTarget),je=rt.get(En.__renderTarget);G.bindFramebuffer(D.READ_FRAMEBUFFER,Ue.__webglFramebuffer),G.bindFramebuffer(D.DRAW_FRAMEBUFFER,je.__webglFramebuffer);for(let Ke=0;Ke<Pt;Ke++)zn&&D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,rt.get(E).__webglTexture,O,Ot+Ke),E.isDepthTexture?(se&&D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,rt.get(z).__webglTexture,O,Qt+Ke),D.blitFramebuffer(Lt,Nt,mt,bt,Dt,Yt,mt,bt,D.DEPTH_BUFFER_BIT,D.NEAREST)):se?D.copyTexSubImage3D(At,O,Dt,Yt,Qt+Ke,Lt,Nt,mt,bt):D.copyTexSubImage2D(At,O,Dt,Yt,Qt+Ke,Lt,Nt,mt,bt);G.bindFramebuffer(D.READ_FRAMEBUFFER,null),G.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else se?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(At,O,Dt,Yt,Qt,mt,bt,Pt,fe,jt,te.data):z.isCompressedArrayTexture?D.compressedTexSubImage3D(At,O,Dt,Yt,Qt,mt,bt,Pt,fe,te.data):D.texSubImage3D(At,O,Dt,Yt,Qt,mt,bt,Pt,fe,jt,te):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,O,Dt,Yt,mt,bt,fe,jt,te.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,O,Dt,Yt,te.width,te.height,fe,te.data):D.texSubImage2D(D.TEXTURE_2D,O,Dt,Yt,mt,bt,fe,jt,te);D.pixelStorei(D.UNPACK_ROW_LENGTH,Ge),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Kt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,De),D.pixelStorei(D.UNPACK_SKIP_ROWS,Sn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,pe),O===0&&z.generateMipmaps&&D.generateMipmap(At),G.unbindTexture()},this.copyTextureToTexture3D=function(E,z,Z=null,j=null,O=0){return E.isTexture!==!0&&(ji("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Z=arguments[0]||null,j=arguments[1]||null,E=arguments[2],z=arguments[3],O=arguments[4]||0),ji('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,z,Z,j,O)},this.initRenderTarget=function(E){rt.get(E).__webglFramebuffer===void 0&&A.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?A.setTextureCube(E,0):E.isData3DTexture?A.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?A.setTexture2DArray(E,0):A.setTexture2D(E,0),G.unbindTexture()},this.resetState=function(){w=0,T=0,C=null,G.reset(),Jt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Zt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Zt._getUnpackColorSpace()}}class V0 extends he{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new an,this.environmentIntensity=1,this.environmentRotation=new an,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class G0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=no,this.updateRanges=[],this.version=0,this.uuid=Un()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ee=new B;class oa{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=en(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ne(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=en(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=en(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=en(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=en(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array),a=ne(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new qe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new oa(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class $l extends ni{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Si;const $i=new B,Ei=new B,bi=new B,Ai=new Ht,Yi=new Ht,Yl=new oe,Fs=new B,Zi=new B,ks=new B,Yc=new Ht,Qa=new Ht,Zc=new Ht;class W0 extends he{constructor(t=new $l){if(super(),this.isSprite=!0,this.type="Sprite",Si===void 0){Si=new Le;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new G0(e,5);Si.setIndex([0,1,2,0,2,3]),Si.setAttribute("position",new oa(n,3,0,!1)),Si.setAttribute("uv",new oa(n,2,3,!1))}this.geometry=Si,this.material=t,this.center=new Ht(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ei.setFromMatrixScale(this.matrixWorld),Yl.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),bi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ei.multiplyScalar(-bi.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;zs(Fs.set(-.5,-.5,0),bi,r,Ei,s,a),zs(Zi.set(.5,-.5,0),bi,r,Ei,s,a),zs(ks.set(.5,.5,0),bi,r,Ei,s,a),Yc.set(0,0),Qa.set(1,0),Zc.set(1,1);let o=t.ray.intersectTriangle(Fs,Zi,ks,!1,$i);if(o===null&&(zs(Zi.set(-.5,.5,0),bi,r,Ei,s,a),Qa.set(0,1),o=t.ray.intersectTriangle(Fs,ks,Zi,!1,$i),o===null))return;const c=t.ray.origin.distanceTo($i);c<t.near||c>t.far||e.push({distance:c,point:$i.clone(),uv:ke.getInterpolation($i,Fs,Zi,ks,Yc,Qa,Zc,new Ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function zs(i,t,e,n,s,a){Ai.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Yi.x=a*Ai.x-s*Ai.y,Yi.y=s*Ai.x+a*Ai.y):Yi.copy(Ai),i.copy(t),i.x+=Yi.x,i.y+=Yi.y,i.applyMatrix4(Yl)}class Ro extends ni{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ca=new B,la=new B,qc=new oe,qi=new bo,Os=new pa,tr=new B,jc=new B;class X0 extends he{constructor(t=new Le,e=new Ro){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,a=e.count;s<a;s++)ca.fromBufferAttribute(e,s-1),la.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=ca.distanceTo(la);t.setAttribute("lineDistance",new de(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Os.copy(n.boundingSphere),Os.applyMatrix4(s),Os.radius+=a,t.ray.intersectsSphere(Os)===!1)return;qc.copy(s).invert(),qi.copy(t.ray).applyMatrix4(qc);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,h=n.attributes.position;if(d!==null){const p=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let _=p,m=g-1;_<m;_+=l){const f=d.getX(_),x=d.getX(_+1),S=Bs(this,t,qi,c,f,x);S&&e.push(S)}if(this.isLineLoop){const _=d.getX(g-1),m=d.getX(p),f=Bs(this,t,qi,c,_,m);f&&e.push(f)}}else{const p=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let _=p,m=g-1;_<m;_+=l){const f=Bs(this,t,qi,c,_,_+1);f&&e.push(f)}if(this.isLineLoop){const _=Bs(this,t,qi,c,g-1,p);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Bs(i,t,e,n,s,a){const r=i.geometry.attributes.position;if(ca.fromBufferAttribute(r,s),la.fromBufferAttribute(r,a),e.distanceSqToSegment(ca,la,tr,jc)>n)return;tr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(tr);if(!(c<t.near||c>t.far))return{distance:c,point:jc.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Kc=new B,Jc=new B;class Zl extends X0{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,a=e.count;s<a;s+=2)Kc.fromBufferAttribute(e,s),Jc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Kc.distanceTo(Jc);t.setAttribute("lineDistance",new de(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class $0 extends Re{constructor(t,e,n,s,a,r,o,c,l){super(t,e,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Co extends Le{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const a=[],r=[];o(s),l(n),d(),this.setAttribute("position",new de(a,3)),this.setAttribute("normal",new de(a.slice(),3)),this.setAttribute("uv",new de(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const S=new B,M=new B,L=new B;for(let w=0;w<e.length;w+=3)p(e[w+0],S),p(e[w+1],M),p(e[w+2],L),c(S,M,L,x)}function c(x,S,M,L){const w=L+1,T=[];for(let C=0;C<=w;C++){T[C]=[];const b=x.clone().lerp(M,C/w),y=S.clone().lerp(M,C/w),R=w-C;for(let W=0;W<=R;W++)W===0&&C===w?T[C][W]=b:T[C][W]=b.clone().lerp(y,W/R)}for(let C=0;C<w;C++)for(let b=0;b<2*(w-C)-1;b++){const y=Math.floor(b/2);b%2===0?(h(T[C][y+1]),h(T[C+1][y]),h(T[C][y])):(h(T[C][y+1]),h(T[C+1][y+1]),h(T[C+1][y]))}}function l(x){const S=new B;for(let M=0;M<a.length;M+=3)S.x=a[M+0],S.y=a[M+1],S.z=a[M+2],S.normalize().multiplyScalar(x),a[M+0]=S.x,a[M+1]=S.y,a[M+2]=S.z}function d(){const x=new B;for(let S=0;S<a.length;S+=3){x.x=a[S+0],x.y=a[S+1],x.z=a[S+2];const M=m(x)/2/Math.PI+.5,L=f(x)/Math.PI+.5;r.push(M,1-L)}g(),u()}function u(){for(let x=0;x<r.length;x+=6){const S=r[x+0],M=r[x+2],L=r[x+4],w=Math.max(S,M,L),T=Math.min(S,M,L);w>.9&&T<.1&&(S<.2&&(r[x+0]+=1),M<.2&&(r[x+2]+=1),L<.2&&(r[x+4]+=1))}}function h(x){a.push(x.x,x.y,x.z)}function p(x,S){const M=x*3;S.x=t[M+0],S.y=t[M+1],S.z=t[M+2]}function g(){const x=new B,S=new B,M=new B,L=new B,w=new Ht,T=new Ht,C=new Ht;for(let b=0,y=0;b<a.length;b+=9,y+=6){x.set(a[b+0],a[b+1],a[b+2]),S.set(a[b+3],a[b+4],a[b+5]),M.set(a[b+6],a[b+7],a[b+8]),w.set(r[y+0],r[y+1]),T.set(r[y+2],r[y+3]),C.set(r[y+4],r[y+5]),L.copy(x).add(S).add(M).divideScalar(3);const R=m(L);_(w,y+0,x,R),_(T,y+2,S,R),_(C,y+4,M,R)}}function _(x,S,M,L){L<0&&x.x===1&&(r[S]=x.x-1),M.x===0&&M.z===0&&(r[S]=L/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function f(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Co(t.vertices,t.indices,t.radius,t.details)}}const Hs=new B,Vs=new B,er=new B,Gs=new ke;class Y0 extends Le{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(Js*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],d=["a","b","c"],u=new Array(3),h={},p=[];for(let g=0;g<c;g+=3){r?(l[0]=r.getX(g),l[1]=r.getX(g+1),l[2]=r.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:f}=Gs;if(_.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),f.fromBufferAttribute(o,l[2]),Gs.getNormal(er),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let x=0;x<3;x++){const S=(x+1)%3,M=u[x],L=u[S],w=Gs[d[x]],T=Gs[d[S]],C=`${M}_${L}`,b=`${L}_${M}`;b in h&&h[b]?(er.dot(h[b].normal)<=a&&(p.push(w.x,w.y,w.z),p.push(T.x,T.y,T.z)),h[b]=null):C in h||(h[C]={index0:l[x],index1:l[S],normal:er.clone()})}}for(const g in h)if(h[g]){const{index0:_,index1:m}=h[g];Hs.fromBufferAttribute(o,_),Vs.fromBufferAttribute(o,m),p.push(Hs.x,Hs.y,Hs.z),p.push(Vs.x,Vs.y,Vs.z)}this.setAttribute("position",new de(p,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Po extends Co{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Po(t.radius,t.detail)}}class wi extends Le{constructor(t=.5,e=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],d=[];let u=t;const h=(e-t)/s,p=new B,g=new Ht;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const f=a+m/n*r;p.x=u*Math.cos(f),p.y=u*Math.sin(f),c.push(p.x,p.y,p.z),l.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,d.push(g.x,g.y)}u+=h}for(let _=0;_<s;_++){const m=_*(n+1);for(let f=0;f<n;f++){const x=f+m,S=x,M=x+n+1,L=x+n+2,w=x+1;o.push(S,M,w),o.push(M,L,w)}}this.setIndex(o),this.setAttribute("position",new de(c,3)),this.setAttribute("normal",new de(l,3)),this.setAttribute("uv",new de(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class _a extends Le{constructor(t=1,e=.4,n=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:a},n=Math.floor(n),s=Math.floor(s);const r=[],o=[],c=[],l=[],d=new B,u=new B,h=new B;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const _=g/s*a,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),h.subVectors(u,d).normalize(),c.push(h.x,h.y,h.z),l.push(g/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,x=(s+1)*p+g;r.push(_,m,x),r.push(m,f,x)}this.setIndex(r),this.setAttribute("position",new de(o,3)),this.setAttribute("normal",new de(c,3)),this.setAttribute("uv",new de(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _a(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ns extends ni{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rl,this.normalScale=new Ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new an,this.combine=_o,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class ql extends he{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Z0 extends ql{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const nr=new oe,Qc=new B,tl=new B;class q0{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ht(512,512),this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new To,this._frameExtents=new Ht(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Qc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Qc),tl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tl),e.updateMatrixWorld(),nr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(nr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class j0 extends q0{constructor(){super(new Bl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class K0 extends ql{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.target=new he,this.shadow=new j0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const el=new oe;class J0{constructor(t,e,n=0,s=1/0){this.ray=new bo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Ao,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return el.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(el),this}intersectObject(t,e=!0,n=[]){return ao(t,this,n,e),n.sort(nl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,a=t.length;s<a;s++)ao(t[s],this,n,e);return n.sort(nl),n}}function nl(i,t){return i.distance-t.distance}function ao(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const a=i.children;for(let r=0,o=a.length;r<o;r++)ao(a[r],t,e,!0)}}class Q0 extends Zl{constructor(t=10,e=10,n=4473924,s=8947848){n=new Bt(n),s=new Bt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let h=0,p=0,g=-o;h<=e;h++,g+=r){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=h===a?n:s;_.toArray(l,p),p+=3,_.toArray(l,p),p+=3,_.toArray(l,p),p+=3,_.toArray(l,p),p+=3}const d=new Le;d.setAttribute("position",new de(c,3)),d.setAttribute("color",new de(l,3));const u=new Ro({vertexColors:!0,toneMapped:!1});super(d,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:go}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=go);const t_={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function e_(i,t,e,n){const s=new Be(i.fov,n,.1,200),a=new B,r=new B,o=new B;let c=!1,l=i.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1;function h(){const p=(i.pitchDeg+d.pitchDelta)*Math.PI/180,g=i.yawDeg*Math.PI/180;o.set(Math.sin(g)*Math.cos(p),Math.sin(p),Math.cos(g)*Math.cos(p)).multiplyScalar(i.distance*d.distanceScale*d.zoom)}return h(),{camera:s,update(p,g,_,m,f=t_){const x=g+.6;if(!c)a.set(p,x,_),c=!0;else{const L=1-Math.exp(-Math.max(i.smoothing,.001)*m);a.x+=(p-a.x)*L,a.y+=(x-a.y)*L,a.z+=(_-a.z)*L}const S=1-Math.exp(-Math.max(t.smoothing,.001)*m);d.distanceScale+=(f.distanceScale-d.distanceScale)*S,d.offsetX+=(f.offsetX-d.offsetX)*S,d.offsetZ+=(f.offsetZ-d.offsetZ)*S,d.pitchDelta+=(f.pitchDelta-d.pitchDelta)*S;const M=1-Math.exp(-Math.max(e.smoothing,.001)*m);d.zoom+=(u-d.zoom)*M,h(),(s.fov!==l||s.fov!==i.fov)&&(s.fov=i.fov,l=i.fov,s.updateProjectionMatrix()),r.set(a.x+d.offsetX,a.y,a.z+d.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(p){s.aspect=p,s.updateProjectionMatrix()},getGroundBasis(){const p=new B().setFromMatrixColumn(s.matrixWorld,0),g=new B().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(p.x,p.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:p.x/_,rightZ:p.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(p){u=Number.isFinite(p)&&p>0?p:1},smart(){return{...d}}}}const Ws=Math.PI*2,Xs=1e-6;function n_(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function i_(i,t){const e=Math.sin(i);return Math.cos(i)-t*.28*e*e*e}function il(i){return(1-Math.sin(i))/2}function jl(i,t){if(!i.grounded||i.speed<Xs)return n_();const e=i.speed/Math.max(i.moveSpeed,Xs),n=Math.min(t.maxAmp,e*t.strideGain),s=Math.abs(i.localForward),a=Math.abs(i.localRight),r=s+a+Xs,o=s/r,c=a/r,l=i.localForward>=0?1:-1,d=i.localRight>=0?1:-1,u=Math.max(i.legLength,Xs),h=n*u;function p(y,R){const W=i_(y,t.plantLock),I=il(y),X=-(l*o*h*W)/u,H=R*d>0?1:-1,K=1+H*t.crossStep*.45,Y=d*H*t.crossStep*h*.4*I,ft=(d*c*h*t.sideWeight*K*W+Y*c)/u,_t=t.kneeLift*I*n*(.55+.25*o+(H>0?.2*c:0));return{pitchX:X,rollZ:ft,kneeX:_t}}const g=(i.phase%Ws+Ws)%Ws,_=p(g,-1),m=p((g+Math.PI)%Ws,1),f=Math.cos(g),x=il(g),S=-t.comSway*n*f*(.6*o+.8*c)-d*t.comSway*n*c*.45,M=t.comBob*x*n,L=d*t.hipLean*n*c*f*.6,w=d*t.hipLean*n*c*(.45+.25*f),T=t.armSwing*n*f*(o*l+.3*c),C=T,b=-T;return{legL:_,legR:m,pelvisX:S,pelvisY:M,pelvisRoll:L,sideLean:w,armL:C,armR:b,strafe:c,backward:l<0?o:0}}function we(i){return i<0?0:i>1?1:i}const s_=Math.PI*2;function a_(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function r_(i,t,e,n,s){const a=we(n);if(a<=0)return i;const r=we(t),o=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),l=e%2===0?1:-1,d=we(s.forwardBias),u={speed:c,phase:i.phase+r*s_*o,localForward:c*d,localRight:c*(1-d)*l};return{speed:i.speed+(u.speed-i.speed)*a,phase:i.phase+(u.phase-i.phase)*a,localForward:i.localForward+(u.localForward-i.localForward)*a,localRight:i.localRight+(u.localRight-i.localRight)*a}}function o_(i,t,e){const n=a_(),s=we(i),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return n;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,d=e.stepKnee*a,u=e.stepSide*a;return n.legL.pitchX=o?-l:l*.55,n.legR.pitchX=c?-l:l*.55,n.legL.kneeX=o?d:d*.4,n.legR.kneeX=c?d:d*.4,n.legL.rollZ=-u*r,n.legR.rollZ=u*r,n.pelvisX=e.stepSway*a*r,n.pelvisY=-e.stepDip*a,n.pelvisRoll=u*.25*r,n}function Kl(i,t){if(i<=0||i>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return i<e?Math.sin(Math.PI/2*(i/e)):Math.cos(Math.PI/2*((i-e)/(1-e)))}function sl(i,t,e,n,s){if(e<=0||n<=0)return 0;const a=(i-t)/e;return a<0||a>=1?0:n*Kl(a,s)}function c_(i,t,e,n){const s=t?1:0,a=1-Math.exp(-Math.max(0,n)*Math.max(0,e)),r=i+(s-i)*a;return t&&r>.999?1:!t&&r<.001?0:r}function l_(i,t,e){const n=we(i);return{gaitScale:1-n*(1-we(t)),attackLegWeight:we(e)*n}}function h_(i,t){const e=we(t);return e===1?i:{legL:{pitchX:i.legL.pitchX*e,rollZ:i.legL.rollZ*e,kneeX:i.legL.kneeX*e},legR:{pitchX:i.legR.pitchX*e,rollZ:i.legR.rollZ*e,kneeX:i.legR.kneeX*e},pelvisX:i.pelvisX*e,pelvisY:i.pelvisY*e,pelvisRoll:i.pelvisRoll*e,sideLean:i.sideLean*e,armL:i.armL*e,armR:i.armR*e,strafe:i.strafe,backward:i.backward}}function d_(i,t){const e=Math.min(1,Math.abs(i)/Math.max(t.impactSpeed,1e-6));return we(t.minScale+(1-t.minScale)*e)}function u_(){return Jl()}function Jl(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function f_(i,t){return i.type==="light"?Math.max(0,t.leanLight):i.type==="heavy"?Math.max(0,t.leanHeavy):i.type==="knock"?Math.max(0,t.leanKnock):0}function p_(i,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?we(t.forceHitHeight):i.type==="light"?we(t.hitHeight.light):i.type==="heavy"?we(t.hitHeight.heavy):i.type==="knock"?we(t.hitHeight.knock):0}function m_(i,t,e){const n=we(e),s=(a,r)=>a+(r-a)*n;return{upperPitch:s(i.upperPitch,t.upperPitch),upperRoll:s(i.upperRoll,t.upperRoll),upperYaw:s(i.upperYaw,t.upperYaw),fold:s(i.fold,t.fold),shift:s(i.shift,t.shift),drop:s(i.drop,t.drop),back:s(i.back,t.back),knee:s(i.knee,t.knee),hip:s(i.hip,t.hip),arm:s(i.arm,t.arm)}}function Ql(i,t,e){const n=Jl(),s=f_(i,e);if(n.intensity=s,s<=0||i.duration<=0||!Number.isFinite(i.timer))return n;const a=we(1-i.timer/i.duration),r=Kl(a,e.pulseRatio);n.pulse=r,n.active=r>0,n.hitHeight=p_(i,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),u=i.dirX*o+i.dirZ*c,h=i.dirX*l+i.dirZ*d;if(n.localFwd=u,n.localRight=h,!e.enabled){n.legacy=!0;const _=Math.sin(Math.PI*a);return n.upperPitch=s*_*u,n.upperRoll=-s*_*h*.7,n.drop=(s>.5?.09:.04)*_,n.flash=e.flashStrength*_,n.active=_>0,n}const p=s*r,g=m_(e.abdomen,e.shoulder,n.hitHeight);return n.upperPitch=p*(g.upperPitch*u+g.fold),n.upperRoll=-p*g.upperRoll*h,n.upperYaw=p*g.upperYaw*h,n.upperShift=p*g.shift,n.upperShiftX=n.upperShift*h,n.upperShiftZ=n.upperShift*u,n.comShift=p*e.comShift,n.comX=n.comShift*h,n.comZ=n.comShift*u,n.pelvisBack=p*g.back,n.drop=p*g.drop,n.knee=p*g.knee,n.hip=p*g.hip,n.arm=p*g.arm,n.flash=e.flashStrength*r,n}function th(i,t){const e=Math.max(0,t.pelvisTiltGain),n=Math.max(0,t.pelvisShift),s=Number.isFinite(i.leanForward)?i.leanForward:0,a=Number.isFinite(i.leanSide)?i.leanSide:0,r=Number.isFinite(i.speedRatio)?Math.max(0,Math.min(1,i.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*n,pelvisZ:s*n,crouch:Math.max(0,t.moveCrouch)*r}}const Xn=1e-6;function Ji(i,t,e){return i<t?t:i>e?e:i}function g_(i,t,e,n=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=Xn||a<=Xn||!Number.isFinite(i.x)||!Number.isFinite(i.y)||!Number.isFinite(i.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+Xn,l=Math.hypot(i.x,i.y,i.z);if(l<=Xn)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(i.x,-i.y),u=Math.hypot(i.x,i.y),h=i.z,p=Math.hypot(h,u),g=Ji(p,c,o),_=p>o+Xn||p<c-Xn,m=Math.atan2(-h,Math.max(u,Xn)),f=Ji((s*s+g*g-a*a)/(2*s*g),-1,1),x=Ji((a*a+g*g-s*s)/(2*a*g),-1,1),S=Math.acos(f),M=Math.acos(x),L=n>=0?1:-1;return{rootPitch:m-L*S,rootRoll:d,jointPitch:L*(S+M),clamped:_,reach:l/o}}function __(i,t,e,n){const s=Ji(e,0,1),a=Math.max(0,n),r=(o,c)=>{const l=Ji((c-o)*s,-a,a);return o+l};return{rootPitch:r(i.rootPitch,t.rootPitch),rootRoll:r(i.rootRoll,t.rootRoll),jointPitch:r(i.jointPitch,t.jointPitch)}}function eh(i,t){return{pelvisPos:i.position.clone(),pelvisRotX:i.rotation.x,pelvisRotZ:i.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Lo={active:!1,weight:0,clamped:0,maxError:0};function nh(i){const{root:t,pelvis:e,lower:n,limbs:s,base:a,cfg:r}=i;if(!r.enabled||r.weight<=0||!i.grounded||s.length===0)return{...Lo};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:n.position.clone(),lowerRotZ:n.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,n.position.copy(a.lowerPos),n.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(p=>p.tip.getWorldPosition(new B));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,n.position.copy(o.lowerPos),n.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),n.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(i.attacking?Math.max(0,Math.min(1,r.attackScale)):1),d=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let u=0;for(let p=0;p<s.length;p++){const g=s[p],_=n.worldToLocal(c[p].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},f=g_(m,g.upperLen,g.lowerLen,g.bend);f.clamped&&(u+=1);const x=__({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},f,l,d);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let p=0;p<s.length;p++){const g=s[p].tip.getWorldPosition(new B);h=Math.max(h,g.distanceTo(c[p]))}return{active:!0,weight:l,clamped:u,maxError:h}}function mn(i,t,e){return i<t?t:i>e?e:i}const x_={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function v_(i,t,e,n,s,a,r,o,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new Me,h=new Me;h.name="pelvis",h.position.y=i.legLength,u.add(h);const p=new Me;p.name="lower";const g=new Me;g.name="upper",h.add(p),h.add(g);const _=[],m=(dt,Rt,G,at)=>{const rt=new ns({color:at}),A=new re(new rn(dt,Rt,G),rt);return A.castShadow=!0,A.receiveShadow=!0,_.push(rt),A},f=i.headSize,x=i.legLength,S=i.armLength,M=i.limbThickness,L=i.bodyHeight,w=i.bodyWidth,T=m(w,L,.28,e);T.position.y=L/2,g.add(T);const C=new Me;C.position.y=L,g.add(C);const b=m(f,f,f,e);b.position.y=f/2,C.add(b);for(const dt of[-1,1]){const Rt=m(.06,.07,.02,t.shoe);Rt.position.set(dt*.09,f/2+.03,f/2+.011),C.add(Rt)}const y=(dt,Rt)=>{const G=Rt?S:x,at=new Me;at.name=Rt?dt<0?"shoulderL":"shoulderR":dt<0?"hipL":"hipR",Rt||(at.rotation.order="ZYX"),at.position.set(dt*(Rt?w/2+M/2:w/2-M/2),Rt?L-.04:0,0),(Rt?g:p).add(at);const rt=m(M,G/2,M,t.limb);rt.position.y=-G/4,at.add(rt);const A=new Me;A.name=Rt?"elbow":"knee",A.position.y=-G/2,at.add(A);const v=m(M,G/2,M,t.limb);if(v.position.y=-G/4,A.add(v),!Rt){const k=m(M*1.15,.07,M*1.7,t.shoe);k.position.set(0,-G/2+.035,.045),A.add(k);const J=new he;return J.name="footTip",J.position.y=-G/2,A.add(J),{root:at,joint:A,tip:J}}return{root:at,joint:A}},R=y(-1,!1),W=y(1,!1),I=y(-1,!0),q=y(1,!0),X=[R,W].map(dt=>({root:dt.root,joint:dt.joint,tip:dt.tip,upperLen:x/2,lowerLen:x/2,bend:1})),H=new Qe({color:s.attackArcColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),K=new re(new _a(.62,.042,6,20,Math.PI*1.1),H);K.position.set(0,.78-x,.56),g.add(K);const Y=document.createElement("canvas");Y.width=256,Y.height=72;const et=Y.getContext("2d"),ft=new $0(Y),_t=new $l({map:ft,transparent:!0,depthTest:!1,depthWrite:!1}),vt=new W0(_t);vt.scale.set(1.85,.52,1),vt.position.y=1.7-x,vt.renderOrder=20,g.add(vt);function wt(dt){et&&(et.clearRect(0,0,256,72),et.fillStyle=s.labelBg,et.fillRect(0,0,256,72),et.strokeStyle=e,et.lineWidth=5,et.strokeRect(3,3,250,66),et.fillStyle=e,et.font="bold 29px ui-monospace, Menlo, Consolas, monospace",et.textAlign="center",et.textBaseline="middle",et.fillText(`${n} ${x_[dt]}`,128,38),ft.needsUpdate=!0)}const $=new Bt(e),ht=new Bt(o.flashColor),pt=new Bt;let ut=null,V=0,tt=0,xt=0,Ct=0,St=0,Ft=0,D=0,ae={...Lo};return{group:u,update(dt,Rt){u.position.set(dt.position.x,dt.position.y,dt.position.z),u.rotation.y=dt.bodyYaw,C.rotation.y=(dt.headYaw-dt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,dt.mode!==ut&&(ut=dt.mode,wt(dt.mode),V=1),V=Math.max(0,V-Rt*2.2);const G=dt.hurt,at=Ql(G,dt.bodyYaw,o),rt=at.flash;pt.copy(ht).multiplyScalar(rt);for(const ot of _)ot.emissive.copy($).multiplyScalar(V*.5),rt>0&&ot.emissive.add(pt);h.position.set(0,x,0),h.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),p.position.set(0,0,0),p.rotation.z=0;const A=Math.hypot(dt.velocity.x,dt.velocity.z),v=Math.sin(dt.bodyYaw),k=Math.cos(dt.bodyYaw),J=Math.cos(dt.bodyYaw),nt=-Math.sin(dt.bodyYaw),Q=jl({phase:dt.gaitPhase,speed:A,moveSpeed:a,localForward:dt.velocity.x*v+dt.velocity.z*k,localRight:dt.velocity.x*J+dt.velocity.z*nt,legLength:i.legLength,grounded:!0},r);R.root.rotation.x=Q.legL.pitchX,W.root.rotation.x=Q.legR.pitchX,R.root.rotation.z=Q.legL.rollZ,W.root.rotation.z=Q.legR.rollZ,R.joint.rotation.x=Q.legL.kneeX,W.joint.rotation.x=Q.legR.kneeX,I.root.rotation.x=Q.armL,q.root.rotation.x=Q.armR,I.joint.rotation.x=-.18,q.joint.rotation.x=-.18,h.position.x=Q.pelvisX,h.position.y=x+Q.pelvisY,h.rotation.z=Q.pelvisRoll,g.rotation.z=Q.sideLean*(at.intensity>0?.4:1);const it=eh(h,p);if(c){const ot=Math.max(.004166666666666667,Math.min(Rt,.1)),Et=Math.sin(dt.bodyYaw),It=Math.cos(dt.bodyYaw),Ut=mn((dt.velocity.x-tt)/ot,-60,60),Tt=mn((dt.velocity.z-xt)/ot,-60,60),Xt=Ut*Et+Tt*It,kt=Qn(dt.bodyYaw-Ct)/ot,Jt=c.maxForwardDeg*Math.PI/180,U=c.maxSideDeg*Math.PI/180,N=1-Math.exp(-Math.max(0,c.smoothing)*ot);St+=(mn(Xt*c.accelGain,-Jt,Jt)-St)*N,Ft+=(mn(-kt*A*c.turnGain,-U,U)-Ft)*N;const P=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;D+=(mn(A/Math.max(a,1e-6),0,1)-D)*(1-Math.exp(-Math.max(0,P)*ot));const F=th({leanForward:St,leanSide:Ft,speedRatio:D},c);g.rotation.x+=St,g.rotation.z+=Ft,h.rotation.x+=F.pelvisPitch,h.rotation.z+=F.pelvisRoll,h.position.x+=F.pelvisX,h.position.z+=F.pelvisZ,h.position.y-=F.crouch;const st=d.enabled?mn(d.weight,0,1):0;p.position.y+=F.crouch*(1-st)}tt=dt.velocity.x,xt=dt.velocity.z,Ct=dt.bodyYaw,g.rotation.x+=at.upperPitch,g.rotation.z+=at.upperRoll,g.rotation.y+=at.upperYaw;const lt=mn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),gt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=mn(at.upperShiftX*lt,-gt,gt),g.position.z+=mn(at.upperShiftZ*lt,-gt,gt),h.position.x+=at.comX,h.position.z+=at.comZ-at.pelvisBack,h.position.y-=at.drop;const zt=at.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(p.position.z+=at.pelvisBack*(1-zt),p.position.y+=at.drop*(1-zt),R.joint.rotation.x+=at.knee,W.joint.rotation.x+=at.knee,R.root.rotation.x-=at.hip,W.root.rotation.x-=at.hip,I.root.rotation.x+=at.arm,q.root.rotation.x+=at.arm*.8,dt.attackPhase!=="idle"&&at.intensity===0){const ot=dt.attackProgress,Et=ot<.34?-1:ot<.68?-1+(ot-.34)/.34*2:Math.max(0,1-(ot-.68)/.32),It=Math.max(0,-Et),Ut=Math.max(0,Et);q.root.rotation.x=-1.7*It+1.25*Ut,q.joint.rotation.x=-(.25+It*.45),g.rotation.y=-.28*Et,H.opacity=dt.attackPhase==="active"?.85:0,dt.attackPhase==="active"&&(K.rotation.z=-1.1+ot*3)}else H.opacity=0;ae=nh({root:u,pelvis:h,lower:p,limbs:X,base:it,cfg:d,grounded:!0,attacking:dt.attackPhase!=="idle"})},ik(){return ae},dispose(){u.traverse(dt=>{if(dt instanceof re){dt.geometry.dispose();const Rt=dt.material;Array.isArray(Rt)?Rt.forEach(G=>G.dispose()):Rt.dispose()}}),ft.dispose(),_t.dispose()}}}function ih(i){return{x:0,y:0,z:1}}function M_(i){return Math.asin(ih().y)}function y_(i,t){const e=Math.cos(t),n=Math.sin(t);return{x:i.x*e+i.z*n,y:i.y,z:-0*n+i.z*e}}function be(i,t,e){return i<t?t:i>e?e:i}const al=1e-6;function ce(i,t,e,n){const s=new re(new rn(i,t,e),new ns({color:n}));return s.castShadow=!0,s.receiveShadow=!0,s}function ge(){return new Me}function ta(i,t,e){const n=ge(),s=ce(t*.7,.12,t*.7,e.wood);s.position.y=.06,n.add(s);const a=ce(t*2.4,.045,t*.8,e.metal);a.position.y=.13,n.add(a);const r=ce(t*.38,i,t,e.blade);r.position.y=.13+i/2,n.add(r);const o=ce(t*.42,i*.96,t*.2,e.bladeEdge);o.position.set(0,.13+i/2,t*.5),n.add(o);const c=ce(t*.3,.09,t*.45,e.blade);return c.position.y=.13+i+.045,n.add(c),n}function S_(i){const t=ta(.72,.15,i),e=ce(.12,.46,.12,i.wood);return e.position.y=-.3,t.add(e),t}function E_(i){const t=ge(),e=ce(.32,.38,.06,i.metal);e.position.set(0,.02,.1),t.add(e);const n=ce(.11,.11,.045,i.blade);return n.position.set(0,.02,.145),t.add(n),t}function b_(i){const t=ge(),e=ce(.055,.88,.055,i.wood);e.position.y=.42,t.add(e);const n=ce(.15,.15,.15,i.glow);n.position.y=.92;const s=n.material;return s.emissive=new Bt(i.glow),s.emissiveIntensity=.85,t.add(n),{g:t,orb:n}}function A_(i){const t=ge();for(let n=0;n<5;n++){const s=(n-2)*.15,a=ce(.055,.16,.05,i.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ce(.014,.66,.014,i.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function T_(i){const t=ge(),e=ce(.025,.025,.46,i.wood);e.position.z=.23,t.add(e);const n=ce(.055,.055,.09,i.blade);return n.position.z=.5,t.add(n),t}function w_(i,t,e,n,s,a,r,o,c,l,d){const u=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},h=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},p=ge(),g=ge();g.name="pelvis",g.position.y=i.legLength,p.add(g);const _=ge();_.name="lower";const m=ge();m.name="upper",g.add(_),g.add(m);const f=i.headSize,x=i.legLength,S=i.armLength,M=i.limbThickness,L=i.bodyHeight,w=i.bodyWidth,T=ce(w,L,.28,t.body);T.position.y=L/2,m.add(T);const C=ge();C.position.y=n.headPivotHeight,m.add(C);const b=ce(f,f,f,t.head);b.position.y=f/2,C.add(b);const y=new ns({color:"#1b2733"});for(const N of[-1,1]){const P=new re(new rn(.06,.07,.02),y);P.position.set(N*.09,f/2+.03,f/2+.011),C.add(P)}const R=N=>{const P=ge();P.name=N<0?"hipL":"hipR",P.rotation.order="ZYX",P.position.set(N*(w/2-M/2),0,0),_.add(P);const F=ce(M,x/2,M,t.limb);F.position.y=-x/4,P.add(F);const st=ge();st.name="knee",st.position.y=-x/2,P.add(st);const ct=ce(M,x/2,M,t.limb);ct.position.y=-x/4,st.add(ct);const Mt=ce(M*1.15,.07,M*1.7,t.shoe);Mt.position.set(0,-x/2+.035,.045),st.add(Mt);const Gt=new he;return Gt.name="footTip",Gt.position.y=-x/2,st.add(Gt),{root:P,joint:st,hand:ge(),tip:Gt}},W=N=>{const P=ge();P.name=N<0?"shoulderL":"shoulderR",P.position.set(N*(w/2+M/2),L-.04,0),m.add(P);const F=ce(M,S/2,M,t.limb);F.position.y=-S/4,P.add(F);const st=ge();st.name="elbow",st.position.y=-S/2,P.add(st);const ct=ce(M,S/2,M,t.limb);ct.position.y=-S/4,st.add(ct);const Mt=ge();Mt.position.y=-S/2,st.add(Mt);const Gt=ce(M*1.1,.09,M*1.1,t.head);return Gt.position.y=.045,Mt.add(Gt),{root:P,joint:st,hand:Mt}},I=R(-1),q=R(1),X=W(-1),H=W(1),K=[I,q].map(N=>({root:N.root,joint:N.joint,tip:N.tip,upperLen:x/2,lowerLen:x/2,bend:1})),Y=ge(),et=ge();H.hand.add(Y),X.hand.add(et);const ft=b_(t),_t=A_(t),vt=T_(t),wt={"sword-shield":{right:ta(.42,.075,t),left:E_(t)},"dual-swords":{right:ta(.42,.075,t),left:ta(.42,.075,t)},greatsword:{right:S_(t),left:ce(.12,.2,.12,t.wood)},staff:{right:ft.g,left:ge(),orb:ft.orb},bow:{right:vt,left:_t.g,arrow:vt,drawString:_t.drawString}};for(const N of Object.keys(wt))Y.add(wt[N].right),et.add(wt[N].left),wt[N].right.visible=!1,wt[N].left.visible=!1;let $=null,ht=0,pt=0,ut=0,V=0,tt=0,xt=0,Ct=u_(),St={...Lo},Ft=0,D=0,ae=0,dt=0,Rt=0,G=1,at={speed:0,phase:0},rt=0,A=0,v=!0,k=0,J="none",nt=0,Q=0,it=0,lt=.3,gt=0;function zt(N){const P=Math.PI/180,F=a;let st=0,ct=0,Mt=0,Gt=0;N==="sword-shield"?(st=F.swordPitchDeg*P,ct=-F.swordYawDeg*P,Mt=F.shieldPitchDeg*P):N==="dual-swords"?(st=F.swordPitchDeg*P,ct=-F.swordYawDeg*P,Mt=F.swordPitchDeg*P,Gt=F.swordYawDeg*P):N==="greatsword"?(st=F.greatswordPitchDeg*P,ct=-F.greatswordYawDeg*P,Mt=F.greatswordPitchDeg*P,Gt=F.greatswordYawDeg*P):N==="staff"?st=F.staffPitchDeg*P:Mt=F.bowPitchDeg*P,Y.rotation.set(st,0,ct),et.rotation.set(Mt,0,Gt)}function ot(N){if(N!==$){$=N;for(const P of Object.keys(wt))wt[P].right.visible=P===N,wt[P].left.visible=P===N;zt(N),_t.drawString.position.z=-.06,vt.position.z=0,ft.orb.scale.setScalar(1),m.rotation.y=0}}ot("sword-shield");const Et=[];p.traverse(N=>{N instanceof re&&N.material instanceof ns&&Et.push(N.material)});const It=new Bt(o.flashColor);function Ut(N,P){const F=Ql(N,P,o);Ct=F,m.rotation.x+=F.upperPitch,m.rotation.z+=F.upperRoll,m.rotation.y+=F.upperYaw;const st=be(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),ct=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=be(F.upperShiftX*st,-ct,ct),m.position.z+=be(F.upperShiftZ*st,-ct,ct),g.position.x+=F.comX,g.position.z+=F.comZ-F.pelvisBack,g.position.y-=F.drop;const Mt=F.legacy?0:be(o.lowerScale,0,1);_.position.z+=F.pelvisBack*(1-Mt),_.position.y+=F.drop*(1-Mt),I.joint.rotation.x+=F.knee,q.joint.rotation.x+=F.knee,I.root.rotation.x-=F.hip,q.root.rotation.x-=F.hip,X.root.rotation.x+=F.arm,H.root.rotation.x+=F.arm*.8;for(const Gt of Et)Gt.emissive.copy(It).multiplyScalar(F.flash)}function Tt(N){return N<.3?-1:N<.62?-1+(N-.3)/.32*2:Math.max(0,1-(N-.62)/.38)}function Xt(N){if(N.phase==="idle"||N.charging)return;const P=N.attackProgress,F=Tt(P),st=Math.max(0,F),ct=N.comboIndex%2===0?1:-1,Mt=c.stride,Gt=Number.isFinite(Mt.stepReach)?Mt.stepReach:.17,ie=Number.isFinite(Mt.stepSideReach)?Mt.stepSideReach:.14,$t=Number.isFinite(Mt.stepDipReach)?Mt.stepDipReach:.05,qt=N.weapon==="greatsword"?be(Number.isFinite(Mt.heavyScale)?Mt.heavyScale:1,0,1):1;g.position.z+=Gt*st*qt,g.position.x+=ct*ie*st*qt,g.position.y-=$t*Math.sin(Math.PI*P)*qt}function kt(N){if(_t.drawString.position.z=-.06,vt.position.z=0,ft.orb.scale.setScalar(1),m.rotation.y=0,N.charging&&N.weapon==="bow"){const ct=N.charge;X.root.rotation.x=-1.25,X.joint.rotation.x=-.15,H.root.rotation.x=.35+ct*.3,H.joint.rotation.x=-1.15,_t.drawString.position.z=-.06-ct*.22,vt.position.z=-ct*.3,m.rotation.y=-.22;return}if(N.phase==="idle")return;const P=Tt(N.attackProgress),F=Math.max(0,-P),st=Math.max(0,P);if(N.weapon==="bow")X.root.rotation.x=-1.2,X.joint.rotation.x=-.15,H.root.rotation.x=.9-st*.8,H.joint.rotation.x=-.3;else if(N.weapon==="greatsword"){const ct=-1.6*F+1.25*st,Mt=be(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);H.root.rotation.x=ct,H.joint.rotation.x=-(.25+F*.4),X.root.rotation.x=ct+.06,X.joint.rotation.x=-(.32+F*.4),X.root.rotation.z=.38,m.rotation.y=-.2*P*Mt}else{const ct=N.comboIndex;if(ct===1)H.root.rotation.x=-1.7*F+1.1*st,H.joint.rotation.x=-(.2+F*.5),X.root.rotation.x=.1,m.rotation.y=-.18*P;else if(ct===2)X.root.rotation.x=-1.5*F+1*st,X.joint.rotation.x=-(.2+F*.5),H.root.rotation.x=.2,m.rotation.y=.45*-P;else{const Mt=-1.9*F+1.2*st;X.root.rotation.x=Mt,H.root.rotation.x=Mt,X.joint.rotation.x=-(.15+F*.4),H.joint.rotation.x=-(.15+F*.4),m.rotation.y=-.3*P}}Xt(N)}function Jt(N,P){N&&(H.root.rotation.x=-1.05,H.joint.rotation.x=-.35,X.root.rotation.x=-.45,X.joint.rotation.x=-.2,m.rotation.y=-.12,ft.orb.scale.setScalar(1.25+.12*Math.sin(P*2)))}function U(N){if(!N||N.phase==="idle")return;const P=N.progress,F=P<.3?-.35+P/.3*1.35:P<.7?1:Math.max(0,1-(P-.7)/.3),st=Math.PI/180;m.rotation.x+=h.leanDeg*st*F,X.root.rotation.x-=h.shieldPitchDeg*st*F,X.joint.rotation.x-=.22*F,H.root.rotation.x-=.3*F,g.position.z+=h.pelvisReach*Math.max(0,F)}return{group:p,update(N,P,F,st,ct=!1,Mt,Gt){ot(P.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const ie=Math.max(1/240,Math.min(st,.1)),$t=Mt===void 0?rt+=st:Mt;A=$t;const qt=c.landing;qt.enabled?v&&!N.grounded?(J="jump",nt=$t,Q=qt.anticipationDuration,it=Math.max(0,qt.jumpAnticipation),lt=.32):!v&&N.grounded&&(J="land",nt=$t,Q=qt.duration,it=d_(k,qt),lt=qt.compressRatio,gt=k):(J="none",it=0),$t<nt&&(J="none",it=0),v=N.grounded,k=N.velocity.y;const ue=sl($t,nt,Q,it,lt),kn=P.phase!=="idle";dt=c_(dt,kn,ie,c.attack.blendRate);const ii=l_(dt,c.attack.gaitWeight,c.attack.lowerBodyWeight);Rt=ii.attackLegWeight,G=ii.gaitScale;const on=Math.sin(N.bodyYaw),Bi=Math.cos(N.bodyYaw),rs=(N.velocity.x-ht)/ie,os=(N.velocity.z-pt)/ie,si=be(rs,-60,60),cs=be(os,-60,60),ai=si*on+cs*Bi,ls=Qn(N.bodyYaw-ut)/ie,hs=Math.hypot(N.velocity.x,N.velocity.z),ds=r.maxForwardDeg*Math.PI/180,us=r.maxSideDeg*Math.PI/180,xa=be(ai*r.accelGain,-ds,ds),E=be(-ls*hs*r.turnGain,-us,us),z=1-Math.exp(-r.smoothing*ie);V+=(xa-V)*z,tt+=(E-tt)*z,ht=N.velocity.x,pt=N.velocity.z,ut=N.bodyYaw;const Z=Math.hypot(N.velocity.x,N.velocity.z),j=Math.cos(N.bodyYaw),O=-Math.sin(N.bodyYaw),mt=N.velocity.x*j+N.velocity.z*O,bt=Z>al?be(mt/Z,-1,1):0,Pt=n.hipYawMaxDeg*Math.PI/180,Lt=n.legYawScale*bt*Pt;D+=(Lt-D)*(1-Math.exp(-n.hipYawSmoothing*ie));const Nt=N.bodyYaw+D;ae=Nt;const Ot=Math.sin(Nt),Dt=Math.cos(Nt),Yt=Math.cos(Nt),Qt=-Math.sin(Nt),te={speed:Z,phase:N.gaitPhase,localForward:N.velocity.x*Ot+N.velocity.z*Dt,localRight:N.velocity.x*Yt+N.velocity.z*Qt},fe=kn?r_(te,P.attackProgress,P.comboIndex,dt,c.stride):te;at=fe;const jt={phase:fe.phase,speed:fe.speed,moveSpeed:e,localForward:fe.localForward,localRight:fe.localRight,legLength:i.legLength,grounded:N.grounded},At=h_(jl(jt,s),ii.gaitScale);N.grounded?(I.root.rotation.x=At.legL.pitchX,q.root.rotation.x=At.legR.pitchX,I.root.rotation.z=At.legL.rollZ,q.root.rotation.z=At.legR.rollZ,I.joint.rotation.x=At.legL.kneeX,q.joint.rotation.x=At.legR.kneeX,X.root.rotation.x=At.armL,H.root.rotation.x=At.armR,X.joint.rotation.x=-(.18+At.armL*.2),H.joint.rotation.x=-(.18+At.armR*.2),X.root.rotation.z=0,H.root.rotation.z=0,g.position.x=At.pelvisX,g.position.y=x+At.pelvisY,g.rotation.z=At.pelvisRoll):(I.root.rotation.x=-.55,q.root.rotation.x=-.25,I.joint.rotation.x=.75,q.joint.rotation.x=.55,X.root.rotation.x=-.9,H.root.rotation.x=-.7,X.joint.rotation.x=-.6,H.joint.rotation.x=-.6,I.root.rotation.z=0,q.root.rotation.z=0);const Ge=eh(g,_),Kt=Z/Math.max(e,al),De=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,Sn=1-Math.exp(-Math.max(0,De)*ie);Ft+=(be(Kt,0,1)-Ft)*Sn;const pe=th({leanForward:V,leanSide:tt,speedRatio:Ft},r);g.rotation.x+=pe.pelvisPitch,g.rotation.z+=pe.pelvisRoll,g.position.x+=pe.pelvisX,g.position.z+=pe.pelvisZ,g.position.y-=pe.crouch;const zn=u.enabled&&N.grounded?be(u.weight,0,1)*(kn?be(u.attackScale,0,1):1):0;_.position.y+=pe.crouch*(1-be(zn,0,1)),kt(P),Jt(ct,N.gaitPhase),U(Gt);const se=a.greatswordPitchDeg*Math.PI/180,Ie=P.weapon==="greatsword",En=Math.hypot(N.velocity.x,N.velocity.z),je=Ie&&P.phase==="idle"&&En>.5?Math.min(1.15,En/Math.max(e,.001)*.9):0;xt+=(je-xt)*(1-Math.exp(-6*ie)),Ie&&(Y.rotation.x=se+xt),P.weapon==="bow"&&(_t.g.rotation.x=-(X.root.rotation.x+X.joint.rotation.x),vt.rotation.x=-(H.root.rotation.x+H.joint.rotation.x));const Ke=m.rotation.y;Ut(F,N.bodyYaw);const Hi=F.type==="none"?1:.4;if(m.rotation.x+=V*Hi,m.rotation.z+=(tt+At.sideLean)*Hi,ue>0&&(I.root.rotation.x-=qt.hipPitch*ue,q.root.rotation.x-=qt.hipPitch*ue,I.joint.rotation.x+=qt.kneeBend*ue,q.joint.rotation.x+=qt.kneeBend*ue,g.position.y-=qt.crouchDepth*ue,_.position.y+=qt.crouchDepth*(1-qt.lowerScale)*ue,m.rotation.x+=qt.upperPitch*ue,X.root.rotation.x-=qt.armTuck*ue,H.root.rotation.x-=qt.armTuck*ue),Rt>0&&N.grounded){const cn=o_(P.attackProgress,P.comboIndex,c.stride),ln=Rt;I.root.rotation.x+=cn.legL.pitchX*ln,q.root.rotation.x+=cn.legR.pitchX*ln,I.root.rotation.z+=cn.legL.rollZ*ln,q.root.rotation.z+=cn.legR.rollZ*ln,I.joint.rotation.x+=cn.legL.kneeX*ln,q.joint.rotation.x+=cn.legR.kneeX*ln,g.position.x+=cn.pelvisX*ln,g.position.y+=cn.pelvisY*ln,g.rotation.z+=cn.pelvisRoll*ln}_.rotation.y=D;const sh=Ke;C.rotation.y=Qn(N.headYaw-N.bodyYaw-sh),St=nh({root:p,pelvis:g,lower:_,limbs:K,base:Ge,cfg:u,grounded:N.grounded,attacking:kn})},lean(){return{forward:V,side:tt}},landing(){const N=sl(A,nt,Q,it,lt),P=Q>0?Math.max(0,Q-Math.max(0,A-nt)):0;return{pulse:N,remaining:P,kind:N>0?J:"none",impactVy:gt}},hurt(){return Ct},ik(){return St},attackBlend(){return dt},attackWeights(){return{gaitScale:G,attackLegWeight:Rt,driveSpeed:at.speed,stridePhase:at.phase}},hipYaw(){return D},gaitYaw(){return ae},arrowDirection(){vt.updateWorldMatrix(!0,!1);const N=vt.matrixWorld.elements,P=N[8],F=N[9],st=N[10],ct=Math.hypot(P,F,st)||1;return{x:P/ct,y:F/ct,z:st/ct}},dispose(){p.traverse(N=>{if(N instanceof re){N.geometry.dispose();const P=N.material;Array.isArray(P)?P.forEach(F=>F.dispose()):P.dispose()}})}}}function R_(i,t){switch(i){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function C_(i,t,e){const n=Math.max(1,i.clientWidth),s=Math.max(1,i.clientHeight),a=new H0({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=gl,a.setSize(n,s,!1),i.appendChild(a.domElement);const r=new V0;r.background=new Bt("#12161d"),r.add(new Z0(11061486,2764600,1.15));const o=new K0(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],d=new Me;for(const G of t.boxes){const at=G.maxX-G.minX,rt=G.maxY-G.minY,A=G.maxZ-G.minZ;let v=R_(G.kind,e);G.kind==="step"&&(v=new Bt(v).offsetHSL(0,0,G.maxY*.09).getStyle());const k=new ns({color:v,transparent:!0,opacity:1}),J=new re(new rn(at,rt,A),k);J.position.set((G.minX+G.maxX)/2,(G.minY+G.maxY)/2,(G.minZ+G.maxZ)/2),J.castShadow=G.kind!=="ground",J.receiveShadow=!0,J.add(new Zl(new Y0(J.geometry),new Ro({color:10467020,transparent:!0,opacity:.32}))),d.add(J),l.push(k)}r.add(d);const u=t.gridMeta.maxX-t.gridMeta.minX,h=new Q0(u,u,4873328,3358797);h.position.y=.002,h.visible=e.showGrid,r.add(h);const p=w_(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new Me,_=.9,m=new Me;m.position.y=_,p.group.position.y=-_,m.add(p.group),g.add(m),r.add(g);const f=t.dummies.map((G,at)=>{const rt=e.dummies.colors,A=rt[at%rt.length]??"#cccccc",v=v_(e.voxel,e.colors,A,G.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return v.group.traverse(k=>{k.userData.dummyId=G.id}),r.add(v.group),v}),x=f.map(G=>G.group),S=new J0,M=e.targeting.ringRadius,L=new Qe({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:Te,depthWrite:!1}),w=new re(new wi(M-.07,M,28),L);w.rotation.x=-Math.PI/2,w.position.y=.03,w.visible=!1,r.add(w);const T=new Me;r.add(T);const C=new Qe({color:12577023,transparent:!0,opacity:0,side:Te,depthWrite:!1}),b=new Me;b.position.set(0,.95,.72),T.add(b);const y=new Me;y.rotation.x=M_(e.camera.pitchDeg),b.add(y);const R=new re(new _a(.78,.045,6,24,Math.PI*1.15),C);y.add(R);const W=new Po(1,0),I=new Qe({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),q=Array.from({length:16},()=>{const G=new re(W,I);return G.visible=!1,r.add(G),G}),X=new wi(.86,1,40),H=Array.from({length:6},()=>{const G=new Qe({color:10146047,transparent:!0,opacity:0,side:Te,depthWrite:!1}),at=new re(X,G);return at.rotation.x=-Math.PI/2,at.visible=!1,r.add(at),{mesh:at,mat:G}}),K=new Qe({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),Y=new re(new rn(.035,.035,.5),K);T.add(Y);const et=e.dash,ft=new wi(et.ringRadius-.06,et.ringRadius,28),_t=Array.from({length:6},()=>{const G=new Qe({color:16777215,transparent:!0,opacity:0,side:Te,depthWrite:!1}),at=new re(ft,G);return at.rotation.x=-Math.PI/2,at.visible=!1,r.add(at),{mesh:at,mat:G,life:0,base:1}});function vt(G,at,rt,A,v){const k=_t.find(J=>J.life<=0)??_t[0];k.mat.color.set(A),k.mesh.position.set(G,rt+.04,at),k.base=v,k.mesh.scale.setScalar(v*.6),k.mesh.visible=!0,k.mat.opacity=.9,k.life=et.fxDuration}const wt=e.links,$=new wi(wt.ringRadius-.07,wt.ringRadius,28),ht=Array.from({length:5},()=>{const G=new Qe({color:wt.chargeColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),at=new re($,G);return at.rotation.x=-Math.PI/2,at.visible=!1,r.add(at),{mesh:at,mat:G,life:0,base:1}});function pt(G,at,rt,A){const v=ht.find(k=>k.life<=0)??ht[0];v.mesh.position.set(G,rt+.05,at),v.base=A,v.mesh.scale.setScalar(A*.55),v.mesh.visible=!0,v.mat.opacity=.85,v.life=wt.fxDuration}let ut=t.playerLink.id,V=t.playerLink.hitIds.length,tt=t.dash.id,xt="none",Ct=0,St=-1,Ft=1;const D=e_(e.camera,e.smartCamera,e.zoom,n/s),ae=t.character.position;D.update(ae.x,ae.y,ae.z,1,t.camera);function dt(G,at){if(x.length===0)return 0;const rt=a.domElement.getBoundingClientRect(),A=new Ht((G-rt.left)/rt.width*2-1,-((at-rt.top)/rt.height)*2+1);S.setFromCamera(A,D.camera);const v=S.intersectObjects(x,!0);for(const k of v){const J=k.object.userData.dummyId;if(J&&J>0)return J}return 0}function Rt(G,at,rt){const A=a.domElement.getBoundingClientRect(),v=new B(G,at,rt).project(D.camera);return{x:A.left+(v.x*.5+.5)*A.width,y:A.top+(-v.y*.5+.5)*A.height}}return{render(G,at){const rt=G.character,A=G.combat;g.position.set(rt.position.x,rt.position.y,rt.position.z),g.rotation.y=rt.bodyYaw;const v=G.dash.phase==="active"&&G.dash.kind==="roll",k=v&&G.dash.duration>0?Math.min(1,1-G.dash.timer/G.dash.duration):0;m.rotation.x=v?k*Math.PI*2:0,m.position.y=_-(v?.2*Math.sin(Math.PI*k):0),p.update(rt,A,G.playerHurt,at,G.abilities.channeling,G.time,G.playerLink);for(let it=0;it<f.length;it++)G.dummies[it]&&f[it].update(G.dummies[it],at);const J=G.targeting.hasTarget?G.dummies[G.targeting.targetId-1]:void 0;if(w.visible=!!J,J&&(w.position.set(J.position.x,J.position.y+.03,J.position.z),w.scale.setScalar(1+.07*Math.sin(G.time*6))),T.position.set(rt.position.x,rt.position.y,rt.position.z),T.rotation.y=A.phase!=="idle"?A.attackFacing:rt.bodyYaw,G.dash.id!==tt){tt=G.dash.id;const it=G.dash;xt=it.kind,it.kind==="blink"?(vt(it.fromX,it.fromZ,rt.position.y,et.blinkColor,.9),vt(it.toX,it.toZ,rt.position.y,et.blinkColor,1.35)):vt(it.fromX,it.fromZ,rt.position.y,et.rollColor,1.1)}for(const it of _t){if(it.life<=0)continue;it.life-=at;const lt=Math.max(0,it.life/et.fxDuration);it.mat.opacity=.9*lt,it.mesh.scale.setScalar(it.base*(.6+(1-lt)*1.2)),it.life<=0&&(it.mesh.visible=!1)}const nt=G.playerLink;nt.id!==ut&&(ut=nt.id,V=nt.hitIds.length,pt(rt.position.x,rt.position.z,rt.position.y,1)),nt.hitIds.length>V?(V=nt.hitIds.length,pt(rt.position.x,rt.position.z,rt.position.y,1.35)):nt.hitIds.length<V&&(V=nt.hitIds.length);for(const it of ht){if(it.life<=0)continue;it.life-=at;const lt=Math.max(0,it.life/Math.max(wt.fxDuration,1e-6));it.mat.opacity=.85*lt,it.mesh.scale.setScalar(it.base*(.55+(1-lt)*1.1)),it.life<=0&&(it.mesh.visible=!1)}A.attackId!==Ct&&(Ct=A.attackId,A.weapon==="bow"&&A.phase!=="idle"&&(St=0,Ft=.6+A.lastCharge*.9));const Q=A.phase==="active"&&A.comboIndex>0;C.opacity=Q?.78:0,Q&&(R.rotation.z=-1.2+A.attackProgress*3.2,R.scale.setScalar(.9+A.comboIndex*.13));for(let it=0;it<q.length;it++){const lt=G.abilities.projectiles[it],gt=q[it];gt.visible=!!lt,lt&&(gt.position.set(lt.x,lt.y,lt.z),gt.scale.setScalar(lt.radius),gt.rotation.y+=at*6)}for(let it=0;it<H.length;it++){const lt=G.abilities.rings[it],gt=H[it];if(gt.mesh.visible=!!lt,lt){const zt=Math.max(0,Math.min(1,lt.life/Math.max(lt.duration,1e-6)));gt.mesh.position.set(lt.x,.05,lt.z),gt.mesh.scale.setScalar(lt.radius),gt.mat.opacity=.25+.55*zt}}if(St>=0){St+=at;const it=St*14*Ft;Y.position.set(0,.85,.6+it),K.opacity=it<9?.95:0,it>=9&&(St=-1)}else K.opacity=0;D.update(rt.position.x,rt.position.y,rt.position.z,at,G.camera),a.render(r,D.camera)},resize(){const G=Math.max(1,i.clientWidth),at=Math.max(1,i.clientHeight);a.setSize(G,at,!1),D.resize(G/at)},getGroundBasis(){return D.getGroundBasis()},setCollidersVisible(G){for(const at of l)at.opacity=G?.3:1,at.wireframe=G,at.needsUpdate=!0},setGridVisible(G){h.visible=G},setZoom(G){D.setZoom(G)},pickDummy:dt,projectToScreen:Rt,diagnostics(){const G=ih(e.camera.pitchDeg),at=y_(G,T.rotation.y);return{lean:p.lean(),slashNormal:at,arrowForward:p.arrowDirection(),gait:{hipYaw:p.hipYaw(),gaitYaw:p.gaitYaw()},attackBlend:p.attackBlend(),attackWeights:p.attackWeights(),landing:p.landing(),hurt:p.hurt(),ik:p.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:_t.filter(rt=>rt.life>0).length,lastKind:xt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...D.smart()}}},dispose(){p.dispose();for(const G of f)G.dispose();w.geometry.dispose(),L.dispose(),R.geometry.dispose(),C.dispose(),W.dispose(),I.dispose(),X.dispose();for(const G of H)G.mat.dispose();Y.geometry.dispose(),K.dispose();for(const G of _t)G.mat.dispose();ft.dispose();for(const G of ht)G.mat.dispose();$.dispose(),d.traverse(G=>{G instanceof re&&G.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}const P_={intents:{...rl},stickX:0,stickY:0,source:"idle"};function L_(){const i=document.getElementById("app"),t=document.getElementById("hud");if(!i||!t)throw new Error("缺少 #app / #hud 容器");const e=rd(Ed,bd),n=C_(i,e,Je),s=cd(e),a=Bd(t),r={timeScale:1,paused:!1,showColliders:Je.showColliders,showGrid:Je.showGrid};let o=1;const c=xd({maxRadiusPx:()=>Je.joystick.maxRadiusPx,deadZone:Je.joystick.deadZone,getBasis:()=>n.getGroundBasis(),zoom:()=>Je.zoom}),l=Array.from(document.querySelectorAll(".wp[data-weapon]"));let d=e.combat.weapon;function u(x){if(x===d)return;d=x;const S=Jn.indexOf(x)+1;for(const M of l)M.classList.toggle("is-active",Number(M.dataset.weapon)===S);g.refreshWeapon()}let h=P_,p=0;const g=kd(e,Je,r,{singleStep:()=>s.singleStep(h.intents),reset:()=>{o=1,s.singleStep({...rl,resetPressed:!0})},resetZoom:()=>{o=1,n.setZoom(1)},onToggleColliders:x=>n.setCollidersVisible(x),onToggleGrid:x=>n.setGridVisible(x)});window.addEventListener("resize",()=>n.resize()),window.__harness={world:e,view:n,clock:s,input:c,viewConfig:Je,getUserZoom:()=>o};let _=performance.now(),m=60;function f(x){const S=Math.min((x-_)/1e3,.1);_=x,S>0&&(m=m*.9+1/S*.1);const M=c.sample();M.intents.resetPressed&&(o=1),o=dd(o,M.zoomScale,Je.zoom.min,Je.zoom.max),n.setZoom(o);let L=M.intents.dummyClickId;if(M.tap){const C=n.pickDummy(M.tap.x,M.tap.y);C>0&&(L=C)}L>0&&(p=L),h={...M,intents:{...M.intents,dummyClickId:p}};const w=s.frame(S,h.intents,r.timeScale,r.paused);w>0&&(p=0),u(e.combat.weapon),n.render(e,S);const T=n.diagnostics();a.update(e,m,w,h,r,{attackBlend:T.attackBlend,attackWeights:T.attackWeights,landing:T.landing,hurt:T.hurt,ik:T.ik,zoom:T.camera.zoom}),requestAnimationFrame(f)}requestAnimationFrame(f)}L_();

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const yi=["sword-shield","dual-swords","greatsword","staff","bow"],Ya=["wander","follow","keep-distance","attack","idle"],id={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},ba=1e-6;function Fa(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ba?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>ba?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Ah(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ba){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>ba)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const on=1e-6,zr=Math.PI/180;function sd(){return{type:"none",timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Or(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function wc(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function Xo(n,t,e){const i=e.duration>0?e.duration:$o(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if(wc(a,e.type,i,e.dirX,e.dirZ),!n.config.hits.noDamageToPlayer&&e.knockback>on){const r=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}Or(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if(wc(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>on){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,Or(n,"hit",s.id,s.position)}}function Wo(n,t,e){Xo(n,{kind:"dummy",index:t},e)}function Rh(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function $o(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Ch(n){const t=n.combat,e=n.config.hits,i=n.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*zr),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=n.config.dummies.radius,l=n.config.targeting.idealRange;for(const d of n.dummies){const f=d.position.x-i.x,h=d.position.z-i.z,u=Math.hypot(f,h);if(u>s+c)continue;const g=u>on?f/u:r,_=u>on?h/u:o;if(u>on&&(f*r+h*o)/u<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,l));const v=Math.max(0,x-u);Wo(n,n.dummies.indexOf(d),{type:m,duration:$o(n,m),dirX:g,dirZ:_,knockback:v})}}function Ph(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const r=n.character.position,o=i.fromX,c=i.fromZ,l=r.x,d=r.z,f=l-o,h=d-c,u=f*f+h*h,g=Math.sin(i.facing),_=Math.cos(i.facing),m=Math.cos(Tc(a.arcDeg,0,180)*zr),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const v=n.dummies[x];if(i.hitIds.indexOf(v.id)>=0)continue;const y=u>on?Tc(((v.position.x-o)*f+(v.position.z-c)*h)/u,0,1):0,L=o+f*y,C=c+h*y,A=Math.hypot(v.position.x-L,v.position.z-C);let T=!1;if(a.shape==="circle")T=A<=a.radius+p;else if(a.shape==="capsule")T=A<=Math.max(a.radius,a.width)+p;else{const W=v.position.x-l,P=v.position.z-d,R=Math.hypot(W,P),X=R>on?(W*g+P*_)/R>=m:!0;T=R<=a.radius+p&&X||A<=a.width+p}if(!T)continue;const b=v.position.x-o,S=v.position.z-c,D=Math.hypot(b,S);if(D>on&&(b*g+S*_)/D<Math.cos(Math.max(a.arcDeg,90)*zr))continue;const O=D>on?b/D:g,k=D>on?S/D:_;Xo(n,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:O,dirZ:k,knockback:a.knockback}),i.hitIds.push(v.id),Or(n,"link-hit",v.id,v.position)}}function Dh(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>on?a/o:0,l=o>on?r/o:1;Xo(n,{kind:"player"},{type:"light",duration:$o(n,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function Lh(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&Ch(n),Ph(n,t),Dh(n)}function Tc(n,t,e){return n<t?t:n>e?e:n}const ua=1e-6;function bs(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ih(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function kh(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function Uh(n){const t=n.abilities,e=n.config.abilities.arcane,i=n.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:i.x+s*r,y:i.y+1,z:i.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,bs(n,"projectile-fire",t.volleyId,o)}function Fh(n,t,e){const i=n.abilities,s=n.config.abilities.arcane,a=n.dash.phase==="active",r=n.playerLink;if(n.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){i.channeling||(i.channeling=!0,i.fireTimer=0,bs(n,"channel-start",0,n.character.position)),i.channelYaw=Fa(n,e),i.fireTimer-=t;let c=0;for(;i.fireTimer<=0&&c++<8;)i.fireTimer+=Math.max(s.fireInterval,ua),Uh(n)}else i.channeling&&(i.channeling=!1,bs(n,"channel-end",0,n.character.position))}function Nh(n,t){const e=n.config.abilities.ring,i=n.dash.phase==="active";if(n.combat.weapon!=="staff"||!t.skill2Pressed||i)return;const s=n.character.position,a={id:++n.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};n.abilities.rings.push(a),bs(n,"ring-place",a.id,s)}function zh(n,t){const e=n.abilities,i=n.config.abilities.arcane,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-o.x,h=d.position.z-o.z,u=o.radius+s;if(!(f*f+h*h>u*u)){Wo(n,l,{type:i.hurtType,duration:i.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:i.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function Oh(n,t){const e=n.abilities,i=n.config.abilities.ring,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(i.pulseInterval,ua),a)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],f=d.position.x-o.x,h=d.position.z-o.z,u=o.radius+s;if(f*f+h*h>u*u)continue;const g=Math.hypot(f,h),_=g>ua?f/g:0,m=g>ua?h/g:1;Wo(n,l,{type:"heavy",duration:i.stun,dirX:_,dirZ:m,knockback:i.knockback})}bs(n,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function Bh(n,t,e){Fh(n,t,e),Nh(n,e),zh(n,t),Oh(n,t)}function Za(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Ac=1e-6;function Rc(n,t,e){return n<t?t:n>e?e:n}function ad(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function rd(n){const t=n.camera,e=ad();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Hh(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,r=0,o=0;for(const l of n.dummies){const d=l.position.x-i.x,f=l.position.z-i.z,h=Math.hypot(d,f);if(h>e.radius)continue;const u=Rc((e.radius-h)/Math.max(Ac,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*u),s+=g,a+=l.position.x*g,r+=l.position.z*g,o+=1}const c=s<=0?0:Rc(s/(s+Math.max(Ac,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,d=r/s;t.centroidX=l,t.centroidZ=d;let f=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const u=Math.hypot(f,h);u>e.maxOffset&&(f=f/u*e.maxOffset,h=h/u*e.maxOffset),t.offsetX=f,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Gh(n){const t=[],e=n.ground.size;t.push(Ai("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Ai(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(Ai(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ai(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ai(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Ai(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Ai(n,t,e,i,s,a,r,o){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:i-a/2,maxZ:i+a/2}}const On=1e-6;function Ea(n,t,e){return n<t?t:n>e?e:n}function Br(n,t,e,i,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+a+On||l.maxY<i-r-On||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Yo(n,t,e,i,s){let a=!1;const r=t.y+i;for(let o=0;o<2;o++)for(const c of n){if(c.maxY<=t.y+s+On||c.minY>=r-On)continue;const l=Ea(t.x,c.minX,c.maxX),d=Ea(t.z,c.minZ,c.maxZ),f=t.x-l,h=t.z-d,u=f*f+h*h;if(!(u>=e*e))if(a=!0,u>On*On){const g=Math.sqrt(u),_=(e-g)/g;t.x+=f*_,t.z+=h*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,p=c.maxZ-t.z,x=Math.min(g,_,m,p);x===g?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function Zo(n,t,e,i,s){const a=t.y+i;for(const r of n){if(r.maxY<=t.y+s+On||r.minY>=a-On)continue;const o=Ea(t.x,r.minX,r.maxX),c=Ea(t.z,r.minZ,r.maxZ),l=t.x-o,d=t.z-c;if(l*l+d*d<e*e-On)return!0}return!1}const Hr=1e-6;function Cn(n){return Math.atan2(Math.sin(n),Math.cos(n))}function qa(n,t,e,i){const s=Cn(t-n);return n+s*(1-Math.exp(-Math.max(e,Hr)*i))}function Cc(n,t,e,i){const s=Cn(t-n),a=Math.abs(s);return a<=i||a<=e?t:Cn(n+Math.sign(s)*Math.max(e,0))}function Vh(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,r=Math.hypot(e.moveX,e.moveZ),o=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Hr,c=n.abilities.channeling,l=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(o||c)i.facing=Fa(n,e);else if(l)i.facing=n.targeting.targetYaw;else if(r>Math.max(s.facingDeadZone,Hr)){const g=Math.atan2(e.moveX,e.moveZ),_=s.facingTurnRate*Math.PI/180*t,m=s.facingSnapDeg*Math.PI/180;if(r>=.35)i.facing=Cc(i.facing,g,_,m);else if(r>=s.facingMinMagnitude&&Math.abs(Cn(g-i.facing))>s.facingDeadbandDeg*Math.PI/180){const x=qa(i.facing,g,s.facingSmoothRate,t);i.facing=Cc(i.facing,x,_,0)}}const d=i.velocity;Math.hypot(d.x,d.z)>.15&&(i.moveYaw=Math.atan2(d.x,d.z)),i.bodyYaw=qa(i.bodyYaw,i.facing,s.bodyTurnRate,t);let f=qa(i.headYaw,i.facing,s.headTurnRate,t);const h=s.maxHeadTurnDeg*Math.PI/180,u=Cn(f-i.bodyYaw);u>h?f=i.bodyYaw+h:u<-h&&(f=i.bodyYaw-h),i.headYaw=f}const Gr=1e-6,Xh=Math.PI/180;function Vr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qo(n,t,e){return n<t?t:n>e?e:n}function Na(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Xr(n){const t=n.id,e=n.windowId;Object.assign(n,Na()),n.id=t,n.windowId=e}function Wh(n){Xr(n)}function $h(n){Xr(n.playerLink);for(const t of n.dummies)Xr(t.link)}function Yh(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Wr(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function wa(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Na()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function Zh(n,t){const e=n.config.links.search,i=n.character.position,s=qo(e.maxAngleDeg,0,180)*Xh;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,f=Math.hypot(l,d);if(f<Gr||f>e.range)continue;const h=Math.atan2(l,d);Math.abs(Cn(h-t))>s||f<o&&(o=f,a=c.id,r=h)}return{id:a,yaw:r,dist:a>0?o:0}}function qh(n,t,e,i){const s=n.config.links,a=n.playerLink,r=n.character.position,o=Fa(n,t),c=Zh(n,o),l=c.id>0?c.yaw:o,d=c.id>0?qo(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=d,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),Vr(n,"link-start",a.id)}function jh(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){wa(n);return}if(e.weapon!==n.combat.weapon){wa(n);return}e.timer+=t;const s=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Vr(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Vr(n,"link-end",e.id))}const r=i.windup+i.active+i.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=i.windup+e.timer:e.phase==="recovery"?o=i.windup+i.active+e.timer:o=r,e.progress=r>0?qo(o/r,0,1):1,e.phase==="active"&&i.active>Gr){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Gr,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function Kh(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&wa(n);return}const r=n.combat,o=n.character.sprinting;o&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&Wr(n,"sprint"),s.prevSprinting=o,jh(n,t);const c=i.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&qh(n,e,c,r.weapon)}const $r=1e-6;function Kn(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function od(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function cd(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=od()}function Jh(n){return{weapon:yi[Math.max(0,n-1)]??yi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:od()}}function Qh(n,t){return Fa(n,t)}function tu(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function ld(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=Qh(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,Kn(n,"attack-start",i)}function dd(n){return Math.max(0,n.config.combat.settle)}function Yr(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];ld(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:dd(n),lunge:tu(n,i.lunge[e-1]??0)},e)}function eu(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,ld(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:dd(n),lunge:i.lunge},0),Kn(n,"charge-release",e)}function nu(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const c=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<c)break;if(i.phaseTimer-=c,i.phase==="windup")i.phase="active",Kn(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",Kn(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Yr(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const c=i.timings.recovery;if(c>$r&&i.phaseTimer>=c*n.config.combat.cancelWindow){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Yr(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;i.phase==="windup"?o=i.phaseTimer:i.phase==="active"?o=s.windup+i.phaseTimer:i.phase==="recovery"?o=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(o=r),i.phase!=="idle"&&(i.attackProgress=r>0?Math.min(1,o/r):1)}function iu(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=yi.length){const c=yi[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,cd(n),wa(n),Kn(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Kn(n,"combo-reset",0))),nu(n,t,e);const a=s.weapons[i.weapon],r=n.dash.phase==="active";if(a.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;Yr(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&(!r&&!n.playerLink.consumedAttack&&e.attackPressed&&i.phase==="idle"&&!i.charging&&(i.charging=!0,i.charge=0,Kn(n,"charge-start",0)),i.charging&&e.attackHeld&&(i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,$r))),i.charging&&!r&&(e.attackReleased||!e.attackHeld))){i.charging=!1;const c=i.charge;i.charge=0,c>=s.bow.minChargeToFire&&i.phase==="idle"?eu(n,e,c):Kn(n,"charge-release",0)}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>$r)){const c=i.timings.lunge/i.timings.active;n.impulse.x=Math.sin(i.attackFacing)*c,n.impulse.z=Math.cos(i.attackFacing)*c}}const Zr=1e-6;function ja(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function su(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function au(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Pc(n,t,e){return n<t?t:n>e?e:n}function ru(n,t,e){const i=n.config.dash,a=n.character.position,r=n.config.worldBounds,o=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=a.x,f=a.z;for(;l<c-Zr;){const h=Math.min(c,l+o),u=a.x+t*h,g=a.z+e*h,_=Pc(u,r.minX,r.maxX),m=Pc(g,r.minZ,r.maxZ),p={x:_,y:a.y,z:m};if(Zo(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=_,f=m,l=h,_!==u||m!==g))break}return{x:d,z:f}}function ou(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Wr(n,"roll")),i.cooldown>0){const o=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),o>0&&i.cooldown===0&&ja(n,"dash-ready",0)}const a=n.combat;if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&a.phase==="idle"&&!a.charging&&n.playerLink.phase==="idle"){const o=Ah(n,e),c=o.x,l=o.z,d=n.combat.weapon==="staff";if(i.kind=d?"blink":"roll",i.dirX=c,i.dirZ=l,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=d?s.blinkCooldown:s.rollCooldown,d){const f=ru(n,c,l);n.character.position.x=f.x,n.character.position.z=f.z,i.toX=f.x,i.toZ=f.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Wr(n,"blink"),ja(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Zr,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+l*s.rollDistance,ja(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const o=Math.max(Zr,i.timer),c=n.character.position.x,l=n.character.position.z;n.impulse.x=(i.toX-c)/o,n.impulse.z=(i.toZ-l)/o}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const cn=1e-6,qr=Math.PI*2,cu=7,lu=18;function Dc(n,t,e){return n<t?t:n>e?e:n}function du(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Lc(n,t,e,i){return n+du(t-n)*(1-Math.exp(-Math.max(e,cn)*i))}function jo(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function hu(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:sd(),link:Na()})}return t}function uu(n){const t=Ya.indexOf(n);return Ya[(t+1)%Ya.length]}function fu(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const r=i.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,Wh(i.link)}n.dummyAttackCount=0}function pu(n,t,e){const i=Za(n)*qr,s=Math.sqrt(Za(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+Za(n)*.8)}function mu(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function gu(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(mu(t,i),cn);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",jo(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function _u(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,r=Math.hypot(s,a),o=r>cn?s/r:0,c=r>cn?a/r:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(h,u);(t.wanderTimer<=0||g<.3)&&pu(n,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>cn&&(l=_/p,d=m/p)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,d=c);else if(t.mode==="keep-distance"){const h=r-e.keepDistance;h>e.keepDeadZone?(l=o,d=c):h<-e.keepDeadZone?(l=-o,d=-c):(l=-c*e.keepStrafe,d=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,d=c);let f=t.facing;return t.mode==="wander"?Math.hypot(l,d)>cn&&(f=Math.atan2(l,d)):r>cn&&(f=Math.atan2(o,c)),{x:l,z:d,facing:f}}function xu(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=n.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=i.attackRange+cn&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,jo(n,"dummy-attack",e))}gu(n,e,t,i);const s=_u(n,e,i),a=1-Math.exp(-Math.max(i.acceleration,cn)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=Lc(e.bodyYaw,e.facing,cu,t),e.headYaw=Lc(e.headYaw,e.facing,lu,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;Yo(n.boxes,e.position,i.radius,i.height,c)&&Zo(n.boxes,e.position,i.radius,i.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const d=n.config.worldBounds;e.position.x=Dc(e.position.x,d.minX,d.maxX),e.position.z=Dc(e.position.z,d.minZ,d.maxZ);const f=Br(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+cn&&(e.position.y=f);const h=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=h;const u=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,u/Math.max(n.config.moveSpeed,cn)),_=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),cn);e.stride=_,e.gaitPhase=(e.gaitPhase+h/_*qr)%qr}function vu(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=uu(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,jo(n,"dummy-mode",s)}for(const s of n.dummies)xu(n,t,s,i)}const Ri=1e-6,Ic=Math.PI*2;function Ka(n,t){return Math.sqrt(n*n+t*t)}function Is(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Mu(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,cd(n)}function yu(n,t,e){const i=n.config,s=n.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Ka(o,c);l>1&&(o/=l,c/=l);const d=n.combat.phase!=="idle",f=n.playerLink.phase!=="idle",h=d||n.dash.phase==="active"||f;s.sprinting=!h&&e.sprintHeld&&l>Ri;const u=i.combat.weapons[n.combat.weapon];let g=u?u.moveMultiplier:1;h?g*=n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=i.abilities.arcane.moveScale);const _=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*g;if(h)r.x=o*_,r.z=c*_;else{const O=l>Ri?i.acceleration:i.friction,k=1-Math.exp(-O*t);r.x+=(o*_-r.x)*k,r.z+=(c*_-r.z)*k}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,Is(n,"jumped",i.jumpSpeed)),n.events.some(O=>O.type==="blink"&&O.tick===n.tick)&&(r.x=0,r.z=0,n.impulse.x=0,n.impulse.z=0);const p=a.x,x=a.z;if(a.x+=(r.x+n.impulse.x+n.playerHurt.knockX)*t,a.z+=(r.z+n.impulse.z+n.playerHurt.knockZ)*t,Yo(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if(Zo(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=p,a.z=x,r.x=0,r.z=0;else{const O=a.x-p,k=a.z-x;Math.abs(O)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(k)<Math.abs(r.z*t)*.5&&(r.z=0)}Is(n,"blocked",1)}const y=i.worldBounds;a.x=kc(a.x,y.minX,y.maxX),a.z=kc(a.z,y.minZ,y.maxZ);const L=Br(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&L>a.y+Ri&&L-a.y<=i.stepHeight+Ri&&(a.y=L,r.y=0,Is(n,"stepUp",L));const C=a.y;r.y-=i.gravity*t,a.y+=r.y*t;const A=Br(n.boxes,a.x,a.z,C,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);A>Number.NEGATIVE_INFINITY&&a.y<=A&&r.y<=0?(a.y=A,r.y=0,s.grounded||Is(n,"landed",A),s.grounded=!0):s.grounded=!1;const T=Ka(a.x-p,a.z-x);s.distance+=T;const b=Ka(r.x,r.z),S=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,Ri)),D=Math.max(i.strideLength*(1+S*i.strideSpeedGain),Ri);s.stride=D,s.gaitPhase=(s.gaitPhase+T/D*Ic)%Ic}function kc(n,t,e){return n<t?t:n>e?e:n}const jr=1e-6,Uc=2.399963229728653;function mi(n,t,e){return n<t?t:n>e?e:n}function Fc(n,t,e,i,s,a,r,o,c){const l=t.x-n.x,d=t.z-n.z,f=Math.hypot(l,d),h=e+i;if(f>=h)return;let u,g,_;f<jr?(u=o,g=c,_=h):(u=l/f,g=d/f,_=h-f);const m=_+r;n.x-=u*m*s,n.z-=g*m*s,t.x+=u*m*a,t.z+=g*m*a}function Su(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let d=0;d<r;d++){for(let f=0;f<e.length;f++)for(let h=f+1;h<e.length;h++){const u=(f*3+h)*Uc;Fc(e[f].position,e[h].position,a,a,.5,.5,o,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const h=(f+1)*Uc;Fc(i,e[f].position,s,a,0,1,o,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)Yo(n.boxes,d.position,a,n.config.dummies.height,c),d.position.x=mi(d.position.x,l.minX,l.maxX),d.position.z=mi(d.position.z,l.minZ,l.maxZ)}function bu(n,t,e,i,s,a,r,o){const c=Math.hypot(e,i),l=Math.max(0,o.contactBand),d=mi(o.minScale,0,1);if(c<jr||l<=0||d>=1)return 1;const f=s+r,h=mi(o.approachDot,0,.99);let u=0;for(const g of a){const _=g.position.x-n,m=g.position.z-t,p=Math.hypot(_,m);if(p>=f+l)continue;if(p<jr){u=1;continue}const x=(e*_+i*m)/(c*p);if(x<=h)continue;const v=mi(1-(p-f)/l,0,1),y=mi((x-h)/(1-h),0,1);u=Math.max(u,v*y)}return 1-(1-d)*mi(u,0,1)}function Eu(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=bu(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Nc=1e-6,wu=Math.PI/180;function Tu(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Au(n,t,e){return n<t?t:n>e?e:n}function Ru(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let r=n.character.facing;Math.hypot(e.moveX,e.moveZ)>Nc&&(r=Math.atan2(e.moveX,e.moveZ));const c=Au(i.maxAngleDeg,0,180)*wu;let l=Number.POSITIVE_INFINITY,d=0,f=0,h=0;for(const u of n.dummies){const g=u.position.x-a.x,_=u.position.z-a.z,m=Math.hypot(g,_);if(m<Nc||m>i.range)continue;const p=Math.atan2(g,_),x=Math.abs(Cn(p-r));if(x>c)continue;const v=m-i.frontBias*Math.cos(x);v<l&&(l=v,d=u.id,f=p,h=m)}s.targetId=d,s.targetYaw=f,s.targetDist=h,s.hasTarget=d>0}function Cu(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:Gh(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Jh(1),playerLink:Na(),abilities:Ih(),impulse:{x:0,z:0},targeting:Tu(),playerHurt:sd(),hitCount:0,dash:{...su(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...ad(),centroidX:n.spawn.x,centroidZ:n.spawn.z},dummies:hu(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,dummies:!0}}}function Pu(n){Mu(n),fu(n),$h(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,kh(n),au(n),rd(n),n.events.length=0}function zc(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){Pu(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Ru(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Kh(n,t,e),n.modules.combat&&iu(n,t,e),n.modules.dash&&ou(n,t,e),n.modules.movement&&yu(n,t,e),n.modules.orientation&&Vh(n,t,e),n.modules.dummies&&vu(n,t,e),Rh(n,t),Yh(n,t),n.modules.abilities&&Bh(n,t,e),n.modules.dummies&&(Lh(n,t),n.modules.separation&&(Su(n),Eu(n))),n.modules.camera?Hh(n):rd(n),n}function Du(n){let t=0;return{frame(e,i,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};zc(n,o,d),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){zc(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const hd={slopPx:12,longPressMs:450,doubleTapMs:280};function Lu(n,t,e=hd.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,r=t.rightZ*i+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/o,worldZ:r/o}}function ai(n,t,e,i,s,a){const r=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:r,angleDeg:r>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function Iu(n=hd){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),ai(s,"press",0,0,0,1)},move(s,a,r,o){const c=i(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,d=r-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,ai(c.button,"drag",l,d,o-c.startedAt,1)):null},end(s,a,r,o){const c=i(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,d=r-c.startY,f=o-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return ai(c.button,"release",l,d,f,1);const u=e.get(c.button);return u!==void 0&&o-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,r-u.y)<=n.slopPx*2?(e.delete(c.button),ai(c.button,"doubleTap",l,d,f,2)):(e.set(c.button,{at:o,x:a,y:r}),ai(c.button,"tap",l,d,f,1))},cancel(s,a){const r=i(s);return r?(t.delete(s),ai(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,ai(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const Ja=.001,ku=18;function Kr(n,t,e){return n<t?t:n>e?e:n}function Jr(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Uu(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Fu(n,t,e,i,s=ku){const a=Uu(t);if(!a)return{state:Jr(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(r)||r<Ja)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<Ja?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-n.armDist)<o?{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Ja)return{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=r/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,h):1;return{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:Kr(Number.isFinite(u)?u:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Nu(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),r=Number.isFinite(t)&&t>0?t:1,o=n*r;return Number.isFinite(o)?Kr(o,s,a):Kr(n,s,a)}function zu(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Ou(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Qa=["jump","sprint","reset","attack","skill2"],Bu=8,Hu=26,tr=16,Oc=20,Bc=140,Gu=18,Vu=16,Xu=400,Wu=1.0001;function fa(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function $u(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&fa(e)}function Yu(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,d=0,f=0,h=0,u=-1,g=0,_=null,m=-1,p=0,x=0,v=0,y=0,L=!1,C=0,A=1,T=0,b=null,S=0,D=0,O=!1,k=null,W=null,P=0,R=0,X=0,U=0,N=!1,tt=!0,ht=-1;const nt=Iu({slopPx:Oc,longPressMs:450,doubleTapMs:350});let gt=[],j=null;const Q=new Set;function pt(z){z&&gt.push(z)}const K=new Map;let mt=Jr(),wt=!1,Ct=1;function Ut(){const z=Array.from(K.values()),ot=s(),ut=Fu(mt,z,ot.pinchGain,ot.maxStepRatio,Gu);if(mt=ut.state,wt=ut.pinching,ut.scale!==1&&(Ct*=ut.scale),ut.started||ut.armedNow)b=null,O=!0,k=null;else if(ut.ended&&r===null&&z.length===1){const Ot=z[0];r=Ot.id,o=Ot.x,c=Ot.y,l=0,d=0,f=Ot.x,h=Ot.y,L=!1,C=0,A=1,T=0,performance.now(),b=null,O=!0,k=null}}const At={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Lt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let F=0,Qt=0;const Et={},Rt=new Set,q=[];function dt(){for(const z of Qa)Et[z]!==void 0&&(Et[z]=void 0),G(z);nt.reset(),Q.clear(),K.clear(),mt=Jr(),wt=!1,r=null,l=0,d=0,f=0,h=0,L=!1,C=0,A=1,T=0,p=0,x=0,v=0,y=0,_=null,m=-1,b=null,O=!1,k=null,W=null,ht=-1,X=0,U=0,N=!1,tt=!0}const lt=()=>{document.hidden&&dt()},w=z=>{if(z.clientX===0&&z.clientY===0){g++;return}if(fa(z.target)||$u(z.clientX,z.clientY)){Q.add(z.pointerId);return}if(Q.delete(z.pointerId),K.set(z.pointerId,{id:z.pointerId,x:z.clientX,y:z.clientY}),r===null&&!wt){_=null,m=-1,r=z.pointerId,o=z.clientX,c=z.clientY,l=0,d=0,f=z.clientX,h=z.clientY,performance.now();const ot=Number.isFinite(z.screenX)&&Number.isFinite(z.screenY)&&(z.screenX!==0||z.screenY!==0);L=ot,C=0,A=1,T=0,p=ot?z.screenX:0,x=ot?z.screenY:0,v=p,y=x,b=z.pointerId,S=z.clientX,D=z.clientY,O=!1}Ut()},M=z=>{if(z.pointerId===W&&(z.pointerType==="mouse"&&z.buttons===0||z.clientX===0&&z.clientY===0&&(P!==0||R!==0)||(tt?(X=z.clientX-P,U=z.clientY-R):(P=z.clientX,R=z.clientY,tt=!0,X=0,U=0))),pt(nt.move(z.pointerId,z.clientX,z.clientY,performance.now())),!Q.has(z.pointerId)&&K.has(z.pointerId)&&(K.set(z.pointerId,{id:z.pointerId,x:z.clientX,y:z.clientY}),Ut()),Q.has(z.pointerId)||z.pointerId!==r)return;const ot=performance.now();if(_===z.pointerId&&ot-m<150){g++;return}const ut=z.clientX,Ot=z.clientY;if(ut===0&&Ot===0&&(o!==0||c!==0)){g++;return}const Gt=ut-f,I=Ot-h,yt=Number.isFinite(z.screenX)&&Number.isFinite(z.screenY),J=yt?z.screenX:0,at=yt?z.screenY:0,bt=yt&&(J!==0||at!==0),Mt=J-v,Bt=at-y;if(L&&bt){const fe=Math.hypot(Mt,Bt),_e=Math.hypot(Gt,I);if(fe>3){if(C=0,T<30&&_e>6&&Mt*Gt+Bt*I>.7*fe*_e){const Fe=fe/_e;Fe>.2&&Fe<5&&(A+=(Fe-A)*.3,T++)}}else _e>12&&(C++,C>=2&&(L=!1))}const Kt=Math.hypot(Gt,I);if(!L){const fe=u<0?Number.POSITIVE_INFINITY:ot-u,_e=bt?Math.hypot(Mt,Bt):1/0;Kt>28&&(fe<200||_e<Kt*.4)&&(o+=Gt,c+=I,g++)}f=ut,h=Ot,v=J,y=at,z.pointerId===b&&Math.hypot(z.clientX-S,z.clientY-D)>Bu&&(O=!0);let ie,$t;L&&bt?(ie=(J-p)/A,$t=(at-x)/A):(ie=ut-o,$t=Ot-c);const ge=Math.hypot(ie,$t),ye=a();ge>ye&&(ie*=ye/ge,$t*=ye/ge);const tn=Math.hypot(l,d),en=Math.hypot(ie,$t);if(tn>10&&en>10){const fe=Math.abs(Math.atan2(l*$t-d*ie,l*ie+d*$t)),_e=Math.max(tn,en)*fe,Fe=Math.max(Math.hypot(Gt,I),Math.hypot(Mt,Bt)/Math.max(.2,A));if(fe>.6&&Fe<Math.max(6,_e*.5)){g++;return}}l=ie,d=$t};function G(z){if(!At[z])return;At[z]=!1,z==="attack"&&(Lt.attackReleased=!0);const ot=document.getElementById(`btn-${z}`);ot==null||ot.classList.remove("is-down")}function et(){r!==null&&(_=r,m=performance.now(),r=null,l=0,d=0,f=0,h=0,L=!1,C=0,A=1,T=0,p=0,x=0,v=0,y=0)}const st=z=>{const ot=K.delete(z.pointerId),ut=Q.delete(z.pointerId);ot&&Ut(),z.pointerId===W&&(W=null,N?ht=performance.now():(X=0,U=0,ht=-1)),pt(nt.end(z.pointerId,z.clientX,z.clientY,performance.now()));for(const kt of Qa)Et[kt]===z.pointerId&&(Et[kt]=void 0,G(kt));const Ot=!ot&&!ut&&K.size<=1&&r!==null;(z.pointerId===r||K.size===0||Ot)&&et(),!ut&&z.pointerId===b&&(!O&&!fa(z.target)&&(k={x:z.clientX,y:z.clientY}),b=null)};for(const z of Qa){const ot=document.getElementById(`btn-${z}`);if(!ot)continue;const ut=z==="attack"||z==="skill2",Ot=I=>{if(I.preventDefault(),Et[z]===void 0){Et[z]=I.pointerId,At[z]=!0,z==="jump"&&(Lt.jump=!0),z==="reset"&&(Lt.reset=!0),z==="sprint"&&(Lt.sprintPressed=!0),z==="attack"&&(Lt.attackPressed=!0),z==="skill2"&&(Lt.skill2=!0),ot.classList.add("is-down"),pt(nt.begin(z,I.pointerId,I.clientX,I.clientY,performance.now()));try{ot.setPointerCapture(I.pointerId)}catch{}ut&&(W=I.pointerId,P=I.clientX,R=I.clientY,tt=!(I.clientX===0&&I.clientY===0),X=0,U=0,N=!1,ht=-1)}},kt=I=>{Et[z]===I.pointerId&&(Et[z]=void 0,G(z),pt(nt.end(I.pointerId,I.clientX,I.clientY,performance.now())))},Gt=I=>{Et[z]===I.pointerId&&(Et[z]=void 0,G(z),pt(nt.cancel(I.pointerId,performance.now())))};ot.addEventListener("pointerdown",Ot),ot.addEventListener("pointerup",kt),ot.addEventListener("pointercancel",Gt),q.push(()=>{ot.removeEventListener("pointerdown",Ot),ot.removeEventListener("pointerup",kt),ot.removeEventListener("pointercancel",Gt)})}const it=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const z of it){const ot=ut=>{ut.preventDefault(),F=Number(z.dataset.weapon)||0};z.addEventListener("pointerdown",ot),q.push(()=>z.removeEventListener("pointerdown",ot))}const $=z=>{const ot=z.key.toLowerCase();if((ot===" "||ot.startsWith("arrow"))&&z.preventDefault(),Rt.has(ot))return;Rt.add(ot),ot===" "&&(Lt.jump=!0),ot==="r"&&(Lt.reset=!0),ot==="shift"&&(Lt.sprintPressed=!0),ot==="j"&&(Lt.attackPressed=!0),ot==="k"&&(Lt.skill2=!0),ot>="1"&&ot<="5"&&(F=Number(ot)),ot>="6"&&ot<="9"&&(Qt=Number(ot)-5);const ut=Math.max(Wu,s().keyStep||1.12);(ot==="="||ot==="+")&&(Ct*=ut),(ot==="-"||ot==="_")&&(Ct/=ut)},ct=z=>{const ot=z.key.toLowerCase();Rt.has(ot)&&(Rt.delete(ot),ot==="j"&&(Lt.attackReleased=!0))},_t=z=>{if(fa(z.target))return;z.preventDefault();const ot=z.deltaMode===1?z.deltaY*Vu:z.deltaMode===2?z.deltaY*Xu:z.deltaY;Ct*=zu(ot,s().wheelStep)},Pt=z=>{z.preventDefault()},ft=()=>{u=performance.now()};window.addEventListener("resize",ft),window.addEventListener("orientationchange",ft);const xt=typeof window<"u"?window.visualViewport:null;return xt&&(xt.addEventListener("resize",ft),xt.addEventListener("scroll",ft)),window.addEventListener("pointerdown",w),window.addEventListener("pointermove",M),window.addEventListener("pointerup",st),window.addEventListener("pointercancel",st),window.addEventListener("blur",dt),document.addEventListener("visibilitychange",lt),window.addEventListener("keydown",$),window.addEventListener("keyup",ct),window.addEventListener("wheel",_t,{passive:!1}),window.addEventListener("gesturestart",Pt),{peekStick(){return{id:r,held:r!==null,originX:o,originY:c,x:f,y:h,dx:f-o,dy:h-c,radius:a(),badMoves:g,screenOk:L,originSX:p,originSY:x,screenX:v,screenY:y,scale:A}},peekAim(){const z=performance.now(),ot=Math.hypot(X,U),ut=W!==null||ht>=0&&z-ht<Bc;if(!(ut&&N&&ot>=tr))return{active:!1,holding:ut,x:0,z:0,dx:X,dy:U};const kt=i(),Gt=X/ot,I=U/ot,yt=kt.rightX*Gt+kt.forwardX*-I,J=kt.rightZ*Gt+kt.forwardZ*-I,at=Math.hypot(yt,J)||1;return{active:!0,holding:ut,x:yt/at,z:J/at,dx:X,dy:U}},sample(){var he;const z=a();let ot=r!==null?Math.max(-1,Math.min(1,l/z)):0,ut=r!==null?Math.max(-1,Math.min(1,d/z)):0,Ot=0,kt=0;(Rt.has("a")||Rt.has("arrowleft"))&&(Ot-=1),(Rt.has("d")||Rt.has("arrowright"))&&(Ot+=1),(Rt.has("w")||Rt.has("arrowup"))&&(kt-=1),(Rt.has("s")||Rt.has("arrowdown"))&&(kt+=1),ot+=Ot,ut+=kt;let Gt=Math.hypot(ot,ut);Gt>1&&(ot/=Gt,ut/=Gt,Gt=1);const I=ot,yt=ut;Gt<e&&(ot=0,ut=0);const J=i();let at=J.rightX*ot+J.forwardX*-ut,bt=J.rightZ*ot+J.forwardZ*-ut;const Mt=Math.hypot(at,bt);Mt>1&&(at/=Mt,bt/=Mt);const Bt=performance.now();pt(nt.poll(Bt));const Kt=Math.hypot(X,U);W!==null&&(Kt>=Hu?N=!0:Kt<tr&&(N=!1));const ie=W!==null||ht>=0&&Bt-ht<Bc,$t=ie&&N&&Kt>=tr;let ge=0,ye=0;if($t){const Ne=X/Kt,rt=U/Kt,St=J.rightX*Ne+J.forwardX*-rt,Tt=J.rightZ*Ne+J.forwardZ*-rt,Vt=Math.hypot(St,Tt)||1;ge=St/Vt,ye=Tt/Vt}!ie&&W===null&&(X=0,U=0,ht=-1,N=!1);const tn=k;k=null;const en=Ct;Ct=1;const fe={moveX:at,moveZ:bt,jumpPressed:Lt.jump,sprintHeld:At.sprint||Rt.has("shift"),sprintPressed:Lt.sprintPressed,resetPressed:Lt.reset,attackPressed:Lt.attackPressed,attackHeld:At.attack||Rt.has("j"),attackReleased:Lt.attackReleased,skill2Pressed:Lt.skill2,weaponSlot:F,dummyClickId:Qt,aimX:ge,aimZ:ye,aimActive:$t};Lt.jump=!1,Lt.reset=!1,Lt.sprintPressed=!1,Lt.attackPressed=!1,Lt.attackReleased=!1,Lt.skill2=!1,F=0,Qt=0;const _e=gt.map(Ne=>Lu(Ne,J,Oc));gt=[],_e.length>0&&(j=_e[_e.length-1]);const Fe=r!==null?"pointer":Rt.size>0?"keyboard":"idle";return{intents:fe,stickX:ot,stickY:ut,stickRawX:I,stickRawY:yt,stickHeld:r!==null,stickId:r,stickOriginX:o,stickOriginY:c,stickPxX:f,stickPxY:h,stickBad:g,stickScreenOk:L,stickOriginSX:p,stickOriginSY:x,stickScreenX:v,stickScreenY:y,stickScale:A,stickVpTop:((he=Ou())==null?void 0:he.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:X,aimDY:U,source:Fe,tap:tn,zoomScale:en,gestures:_e,lastGesture:j}},dispose(){window.removeEventListener("pointerdown",w),window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",st),window.removeEventListener("pointercancel",st),window.removeEventListener("blur",dt),document.removeEventListener("visibilitychange",lt),window.removeEventListener("keydown",$),window.removeEventListener("keyup",ct),window.removeEventListener("wheel",_t),window.removeEventListener("resize",ft),window.removeEventListener("orientationchange",ft),xt&&(xt.removeEventListener("resize",ft),xt.removeEventListener("scroll",ft)),window.removeEventListener("gesturestart",Pt),nt.reset();for(const z of q)z()}}}const Ta=1,Aa=2,Ra=4,ud=8,Ca=16,ys=32,fd=64,pd=128,Zu=[[Ta,"atk"],[Aa,"dash"],[Ra,"link"],[ud,"air"],[Ca,"hurt"],[ys,"aim"],[fd,"spr"],[pd,"chan"]];function Ci(n){if(n===0)return"-";const t=Zu.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const qu=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],ju=0,Ku=15,er=19,Ju=21,Qu=22,tf=23,ef=24,Sn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Ye=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,dn=n=>Math.round(n*180/Math.PI*10)/10,nr=Math.PI*2;function ls(n){let t=n%nr;return t>Math.PI&&(t-=nr),t<-Math.PI&&(t+=nr),t}function nf(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Ta),n.dash.phase!=="idle"&&(e|=Aa),n.playerLink.phase!=="idle"&&(e|=Ra),n.character.grounded||(e|=ud),n.playerHurt.type!=="none"&&(e|=Ca),t.intents.aimActive&&(e|=ys),n.character.sprinting&&(e|=fd),n.abilities.channeling&&(e|=pd),e}function sf(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function af(n){const t={sampleHz:n.sampleHz??Sn.sampleHz,sampleCapacity:n.sampleCapacity??Sn.sampleCapacity,eventCapacity:n.eventCapacity??Sn.eventCapacity,anomalyCapacity:n.anomalyCapacity??Sn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Sn.dirJumpDeg,aimDropDeg:n.aimDropDeg??Sn.aimDropDeg,freezeMs:n.freezeMs??Sn.freezeMs,freezeSpeed:n.freezeSpeed??Sn.freezeSpeed,stickLostMs:n.stickLostMs??Sn.stickLostMs,spikeMs:n.spikeMs??Sn.spikeMs},e=n.meta,i=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let o=!0,c=-1,l=-1e9,d=null,f=0,h=0,u="",g=-1,_=-1,m=-1,p=0,x=-1e9,v=-1,y={},L=null,C=0,A=0,T=0,b=0;function S(P,R){const X=1/t.sampleHz,U=P[ju];U-l<X-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(P),l=U)}function D(P,R,X,U,N,tt){const ht=y[P]??-1e9;if(R-ht<1.2)return;if(y[P]=R,P==="frameSpike"){let gt=0;for(const j of a)j.kind==="frameSpike"&&gt++;if(gt>=6)return}a.length>=t.anomalyCapacity&&a.shift();let nt=i.slice(-7);tt&&(nt.length===0||nt[nt.length-1]!==tt)&&(nt=[...nt.slice(-6),tt]),a.push({kind:P,t:Ye(R),tick:X,ms:Math.round(U),detail:N,ctx:nt}),P==="dirJump"?r.dirJumps++:P==="aimDrop"?r.aimDrops++:P==="moveFreeze"?r.freezes++:P==="stickLost"?r.stickLosts++:P==="stickJump"?r.stickJumps++:P==="stickBad"?r.stickBads++:P==="stickDrift"&&r.stickDrifts++}function O(P,R,X,U){s.length>=t.eventCapacity&&s.shift(),s.push({t:Ye(X),tick:U,k:P,d:R})}function k(P){switch(P.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=P.tick;break}}function W(){const P=r,R=P.wallMs/1e3,X=P.gestures,U=nt=>Object.entries(X).filter(([gt])=>gt.endsWith(`.${nt}`)).reduce((gt,[,j])=>gt+j,0),N=[];if(N.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),N.push(`运行 ${R.toFixed(1)}s / ${P.frames} 帧 · ${P.fps.toFixed(1)}fps · 最大 ${P.dtMax.toFixed(0)}ms · 尖峰 ${P.spikes} · 步 ${P.steps}`),N.push(`摇杆活跃 ${R>0?Math.round(P.stickActiveMs/1e3/R*100):0}% · 手势 按下 ${U("press")}（单击 ${U("tap")} / 双击 ${U("doubleTap")} / 拖拽 ${U("drag")} / 长按 ${U("longPress")} / 打断 ${U("cancel")} / 拖放 ${U("release")}）`),N.push(`攻击 ${P.attacks}(中${P.hits}) · 受击 ${P.hurts} · 派生 ${P.links}(中${P.linkHits}) · 翻滚 ${P.rolls} 闪现 ${P.blinks} · 跳 ${P.jumps} · 复位 ${P.resets}`),N.push(`法杖 引导${P.channels} 飞弹${P.bolts} 电环${P.rings} · 弓蓄力${P.bowCharges} · 当前武器 ${u||"-"}`),N.push(`异常 ${P.dirJumps+P.aimDrops+P.freezes+P.stickLosts+P.stickJumps+P.stickBads+P.stickDrifts}（dir ${P.dirJumps} / aim ${P.aimDrops} / freeze ${P.freezes} / stick ${P.stickLosts} / stickJump ${P.stickJumps} / 坏指针 ${P.stickBads} / 坐标漂移 ${P.stickDrifts}） · 掉帧尖峰 ${P.spikes}`+(P.inTurns>0?` · 输入转向 ${P.inTurns} 次（最大 ${P.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const nt of a.slice(-6)){N.push(`· ${nt.kind} @t${nt.t.toFixed(2)} tick${nt.tick} ${nt.ms>0?`${nt.ms}ms `:""}${nt.detail}`);const gt=nt.ctx.map(Q=>String(Q[Ku])).join(" "),j=nt.ctx.map(Q=>Q[er]===""||Q[er]==null?".":String(Q[er])).join(" ");if(N.push(`  yaw ${gt}`),N.push(`  in  ${j}`),nt.kind==="stickJump"||nt.kind==="stickBad"||nt.kind==="stickLost"){const Q=nt.ctx.map(K=>`${K[Ju]},${K[Qu]}`).join(" "),pt=nt.ctx.map(K=>`${K[tf]},${K[ef]}`).join(" ");N.push(`  o   ${Q}`),N.push(`  p   ${pt}`)}}if(s.length>0){N.push("最近事件：");for(const nt of s.slice(-12))N.push(`  ${nt.t.toFixed(2)} ${nt.k} ${nt.d}`.trimEnd())}const tt=r.screenFrames>0?`屏幕 screenX/Y（${r.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ht=r.screenFrames>0&&r.clientFrames>0?` / client 回退 ${r.clientFrames} 帧`:"";return N.push(`摇杆坐标源 ${tt}${ht}`),N.push(`UA ${e.ua}`),N.join(`
`)}return{sample(P,R,X,U=0){r.frames++,R.stickHeld&&(R.stickScreenOk?r.screenFrames++:r.clientFrames++),r.steps+=U,r.wallMs+=X,X>r.dtMax&&(r.dtMax=X),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=P.time;const N=P.time;if(c<0&&(c=N),T=N,b=P.tick,!o)return;const tt=P.character,ht=Math.hypot(R.stickX,R.stickY),nt=Math.hypot(tt.velocity.x,tt.velocity.z);u=P.combat.weapon;const gt=nf(P,R),j=tt.facing,pt=Math.hypot(R.intents.moveX,R.intents.moveZ)>.05?Math.atan2(R.intents.moveX,R.intents.moveZ):null;ht>.2&&(r.stickActiveMs+=X);const K=[Ye(N),P.tick,Math.round(X*10)/10,Ye(R.stickX),Ye(R.stickY),Ye(R.stickRawX),Ye(R.stickRawY),R.stickHeld?1:0,R.source.slice(0,8),Ye(R.intents.moveX),Ye(R.intents.moveZ),Ye(tt.position.x),Ye(tt.position.z),Ye(tt.velocity.x),Ye(tt.velocity.z),dn(j),dn(tt.bodyYaw),gt,Ye(tt.stride),pt===null?"":dn(pt),R.stickId===null?"":R.stickId,Math.round(R.stickOriginX),Math.round(R.stickOriginY),Math.round(R.stickPxX),Math.round(R.stickPxY),R.stickBad,Math.round(R.stickVpTop),Math.round(R.stickOriginSX),Math.round(R.stickOriginSY),Math.round(R.stickScreenX),Math.round(R.stickScreenY),R.stickScreenOk?1:0,Math.round(R.stickScale*100)/100];S(K);const mt=N*1e3<v;if(X>t.spikeMs&&!mt&&N-c>.6&&(r.spikes++,D("frameSpike",N,P.tick,X,`dt ${X.toFixed(0)}ms fl=${Ci(gt)}`,K)),d!==null&&!mt){const dt=Math.abs(dn(ls(j-d))),lt=Math.abs(dn(ls(tt.moveYaw-f))),w=(h|gt)&(Ta|Aa|Ra|Ca)|gt&ys,M=pt===null?null:Math.abs(dn(ls(j-pt))),G=pt===null||d===null?null:Math.abs(dn(ls(d-pt))),et=M!==null&&G!==null&&M<G-.5,st=(h&ys)!==0&&(gt&ys)===0&&pt===null,it=M!==null&&(M<=12||et);dt>t.aimDropDeg&&st?D("aimDrop",N,P.tick,0,`${dt.toFixed(0)}° @aim→none stick(${R.stickX.toFixed(2)},${R.stickY.toFixed(2)}) aim(${R.aimDX.toFixed(0)},${R.aimDY.toFixed(0)}) fl=${Ci(gt)}`,K):dt>t.dirJumpDeg&&w===0&&!st&&(it?(r.inTurns++,dt>r.inTurnMax&&(r.inTurnMax=dt)):D("dirJump",N,P.tick,0,`${dt.toFixed(0)}° res${M===null?" 无输入":`${M.toFixed(0)}°`} yaw ${dn(d)}→${dn(j)} in ${pt===null?".":dn(pt)}° mvΔ${lt.toFixed(0)}° aim(${R.aimDX.toFixed(0)},${R.aimDY.toFixed(0)}) fl=${Ci(h)}→${Ci(gt)}`,K))}const wt=(gt&(Ta|Aa|Ra|Ca))!==0,Ct=P.tick-x<30;ht>.35&&nt<t.freezeSpeed&&!wt&&!Ct?(g<0&&(g=N),N-g>=t.freezeMs/1e3&&N>=_&&(D("moveFreeze",N,P.tick,(N-g)*1e3,`stick(${R.stickX.toFixed(2)},${R.stickY.toFixed(2)}) v${nt.toFixed(2)} ${R.source} fl=${Ci(gt)}`,K),_=N+1.5,g=-1)):g=-1,R.stickHeld?(ht>p&&(p=ht),p>.35&&ht<.06?(m<0&&(m=N),N-m>=t.stickLostMs/1e3&&(D("stickLost",N,P.tick,(N-m)*1e3,`raw(${R.stickRawX.toFixed(2)},${R.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ci(gt)}`,K),m=-1,p=0)):m=-1):(p=0,m=-1);const Ut=R.stickScale>.2&&R.stickScale<5?R.stickScale:1,At=R.stickScreenOk,Lt=At?R.stickScreenX/Ut:R.stickPxX,F=At?R.stickScreenY/Ut:R.stickPxY,Qt=At?R.stickOriginSX/Ut:R.stickOriginX,Et=At?R.stickOriginSY/Ut:R.stickOriginY,Rt=Lt-Qt,q=F-Et;if(R.stickHeld&&R.stickId!==null){const dt=L;if(dt&&dt.held&&dt.id===R.stickId){const lt=Math.hypot(dt.dx,dt.dy),w=Math.hypot(Rt,q),M=Math.max(lt,w),G=Math.hypot(Lt-dt.cx,F-dt.cy),et=Math.abs(dn(ls(Math.atan2(q,Rt)-Math.atan2(dt.dy,dt.dx)))),st=M*et*Math.PI/180,it=Math.hypot(Qt-dt.ox,Et-dt.oy);if(M>18&&et>35&&G<Math.max(5,st*.35)&&D("stickJump",N,P.tick,0,`Δ${et.toFixed(0)}° 手指只动${G.toFixed(0)}px(弧长应${st.toFixed(0)}px) o(${Math.round(dt.ox)},${Math.round(dt.oy)})→(${Math.round(Qt)},${Math.round(Et)}) 原点位移${it.toFixed(0)}px p(${Math.round(Lt)},${Math.round(F)}) raw(${Math.round(Rt)},${Math.round(q)}) id${R.stickId} ${At?"src=屏幕":"src=client"}`,K),At&&dt.screenOk){const $=Math.hypot(R.stickPxX-dt.x,R.stickPxY-dt.y),ct=Math.hypot((R.stickScreenX-dt.sx)/Ut,(R.stickScreenY-dt.sy)/Ut);C+=$-ct,Math.abs(C)>20&&(D("stickDrift",N,P.tick,0,`client 相对屏幕漂移 ${C>0?"+":""}${C.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(R.stickPxX)},${Math.round(R.stickPxY)}) screen(${Math.round(R.stickScreenX)},${Math.round(R.stickScreenY)})`,K),C=0)}}L={id:R.stickId,ox:Qt,oy:Et,cx:Lt,cy:F,x:R.stickPxX,y:R.stickPxY,sx:R.stickScreenX,sy:R.stickScreenY,dx:Rt,dy:q,held:!0,screenOk:At}}else L=null,C=0;if(R.stickBad>A){const dt=R.stickBad-A;D("stickBad",N,P.tick,0,`拦截 ${dt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${R.stickBad}）o(${Math.round(R.stickOriginX)},${Math.round(R.stickOriginY)}) p(${Math.round(R.stickPxX)},${Math.round(R.stickPxY)}) id${R.stickId??"-"}`,K)}A=R.stickBad,d=j,f=tt.moveYaw,h=gt},event(P,R){const X=sf(P);k(P),o&&(P.type==="dash-ready"||P.type==="combo-reset"||P.type==="stepUp"||O(P.type,X,R,P.tick))},gesture(P){const R=`${P.button}.${P.kind}`;r.gestures[R]=(r.gestures[R]??0)+1,o&&(P.kind==="longPress"||P.kind==="doubleTap"||P.kind==="drag"||P.kind==="cancel")&&O(`g:${P.kind}`,`${P.button} ${P.heldMs.toFixed(0)}ms d${P.distance.toFixed(0)}px ${P.angleDeg.toFixed(0)}°`,T,b)},suspend(P){v=T*1e3+P,g=-1,m=-1},setEnabled(P){o=P,P||(d=null,L=null,g=-1,m=-1)},clear(){i.length=0,s.length=0,a.length=0,y={},l=-1e9,d=null,h=0,g=-1,m=-1,p=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0,r.stickJumps=0,r.stickBads=0,r.stickDrifts=0,r.screenFrames=0,r.clientFrames=0,C=0,L=null,A=0;for(const P of Object.keys(r.gestures))delete r.gestures[P]},status(){const P=r.simS,R=a.some(X=>P-X.t<8&&(X.kind==="dirJump"||X.kind==="aimDrop"||X.kind==="moveFreeze"||X.kind==="stickLost"||X.kind==="stickJump"||X.kind==="stickBad"||X.kind==="stickDrift"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:R,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:qu,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:W}}const rf={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},of={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},cf={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.35,chestYawMaxDeg:0,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},lf={core:rf,scene:of,view:cf};function Ko(n){return JSON.parse(JSON.stringify(n))}const Jo=lf,df=Ko(Jo.core),hf=Ko(Jo.scene),hn=Ko(Jo.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Rn{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),Rn.nextNameID=Rn.nextNameID||0,this.$name.id=`lil-gui-name-${++Rn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class uf extends Rn{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Qr(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const ff={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Qr,toHexString:Qr},Es={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},pf={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Es.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Es.toHexString(s)}},mf={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Es.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Es.toHexString(s)}},gf=[ff,Es,pf,mf];function _f(n){return gf.find(t=>t.match(n))}class xf extends Rn{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=_f(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Qr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class ir extends Rn{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class vf extends Rn{constructor(t,e,i,s,a,r){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,d,f;const h=5,u=x=>{o=x.clientX,c=l=x.clientY,r=!0,d=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(r){const v=x.clientX-o,y=x.clientY-c;Math.abs(y)>h?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>h&&_()}if(!r){const v=x.clientY-l;f-=v*this._step*this._arrowKeyMultiplier(x),d+f>this._max?f=this._max-d:d+f<this._min&&(f=this._min-d),this._snapClampSetValue(d+f)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,v,y,L)=>(p-x)/(v-x)*(L-y)+y,e=p=>{const x=this.$slider.getBoundingClientRect();let v=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(v)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),r=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(o=p.touches[0].clientX,c=p.touches[0].clientY,r=!0):l(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",h))},f=p=>{if(r){const x=p.touches[0].clientX-o,v=p.touches[0].clientY-c;Math.abs(x)>Math.abs(v)?l(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h)},u=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const v=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Mf extends Rn{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class yf extends Rn{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Sf=`.lil-gui {
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
}`;function bf(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Hc=!1;class Pa{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Hc&&o&&(bf(Sf),Hc=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,i,s,a){if(Object(i)===i)return new Mf(this,t,e,i);const r=t[e];switch(typeof r){case"number":return new vf(this,t,e,i,s,a);case"boolean":return new uf(this,t,e);case"string":return new yf(this,t,e);case"function":return new ir(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,i=1){return new xf(this,t,e,i)}addFolder(t){const e=new Pa({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof ir||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof ir)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Ef(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new Pa({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new Pa({title:"实验台 · 调试面板"}),r=n.config,o=[],c=[],l=dt=>{const lt=a.addFolder(dt);return c.push(lt),lt},d=(dt,lt)=>{const w=dt.addFolder(lt);return o.push(w),w},f=l("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid);const h=d(f,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const u=l("移动 / 输入"),g=d(u,"基础移动参数");g.add(r,"moveSpeed",1,10,.1).name("移动速度"),g.add(r,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(r,"acceleration",1,40,.5).name("加速度"),g.add(r,"friction",1,40,.5).name("摩擦"),g.add(r,"gravity",5,60,.5).name("重力"),g.add(r,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(r,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(r,"characterRadius",.1,.8,.01).name("角色半径"),g.add(r,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(r,"strideLength",.3,3,.05).name("基础步幅"),g.add(r,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(r,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=d(u,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=r.dash,p=d(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=r.separation,v=d(u,"角色间分离 / 挤压阻力");v.add(x,"iterations",1,8,1).name("迭代次数"),v.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),v.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),v.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),v.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=r.dummies,L=d(u,"假人 AI");L.add(y,"moveSpeed",.5,8,.1).name("移动速度"),L.add(y,"wanderRadius",.5,8,.1).name("游走半径"),L.add(y,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),L.add(y,"followStopDistance",.3,5,.1).name("跟随停距"),L.add(y,"keepDistance",1,10,.1).name("保持距离"),L.add(y,"keepDeadZone",.1,2,.05).name("保持死区"),L.add(y,"attackRange",.5,5,.1).name("攻击距离"),L.add(y,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const C=l("步态 / 停步"),A=d(C,"程序化步态");A.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),A.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),A.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),A.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),A.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),A.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),A.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),A.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),A.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),A.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),A.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),A.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),A.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),A.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)");const T=d(C,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=d(C,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),d(C,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const D=d(C,"足部 IK"),O=t.ik;D.add(O,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),D.add(O,"weight",0,1,.01).name("钉地权重"),D.add(O,"attackScale",0,1,.01).name("攻击时权重倍率"),D.add(O,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const k=d(C,"惯性倾斜 / 盆骨"),W=t.lean;k.add(W,"accelGain",0,.1,.002).name("前后加速度增益"),k.add(W,"turnGain",0,.2,.005).name("绕圈侧倾增益"),k.add(W,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),k.add(W,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),k.add(W,"smoothing",1,30,1).name("倾斜平滑速率"),k.add(W,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),k.add(W,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),k.add(W,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),k.add(W,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=r.orientation,R=d(C,"朝向 / 下盘带转");R.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),R.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),R.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),R.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),R.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),R.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const X=l("战斗 / 受击"),U=r.combat,N=d(X,"连击 / 武器"),tt=N.add(n.combat,"weapon",yi).name("当前武器");N.add(U,"comboWindow",.1,2,.05).name("连击窗口 (s)"),N.add(U,"settle",0,.8,.01).name("段间停顿 (s)"),N.add(U,"attackMoveScale",0,1,.01).name("攻击时移动比例"),N.add(U,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),N.add(U,"cancelWindow",0,1,.01).name("取消窗口 (s)"),N.add(U,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),N.add(U,"autoCombo").name("按住自动连击"),N.add(U.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),N.add(U.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),N.add(U.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),N.add(U.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),N.add(U.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),N.add(U.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const ht=r.abilities;N.add(ht.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),N.add(ht.arcane,"speed",3,24,.5).name("飞弹速度"),N.add(ht.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),N.add(ht.ring,"radius",.5,5,.1).name("电环半径"),N.add(ht.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),N.add(ht.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const nt=d(X,"攻击动作 / 跨步 / 落地");nt.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),nt.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),nt.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const gt=t.animation.stride;nt.add(gt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),nt.add(gt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),nt.add(gt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),nt.add(gt,"cycles",1,3,1).name("每段跨步周期数"),nt.add(gt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),nt.add(gt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),nt.add(gt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),nt.add(gt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),nt.add(gt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),nt.add(gt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),nt.add(gt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),nt.add(gt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),nt.add(gt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),nt.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),nt.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),nt.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),nt.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),nt.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),nt.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),nt.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),nt.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),nt.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),nt.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),nt.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),nt.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const j=d(X,"武器握持");j.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),j.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),j.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),j.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const Q=r.hits,pt=d(X,"命中 / 受击 / 击退");pt.add(Q,"arcDeg",10,120,5).name("命中扇区半角 (°)"),pt.add(Q,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),pt.add(Q,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),pt.add(Q,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),pt.add(Q.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),pt.add(Q.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),pt.add(Q,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),pt.add(Q,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const K=r.targeting,mt=d(X,"目标辅助");mt.add(K,"targetAssist").name("启用目标辅助"),mt.add(K,"range",1,14,.5).name("锁定范围 (m)"),mt.add(K,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),mt.add(K,"frontBias",0,4,.1).name("朝向加权"),mt.add(K,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),mt.add(K,"maxLungeScale",1,3,.1).name("前冲最大放大");const wt=d(X,"受击分层"),Ct=t.hurt;wt.add(Ct,"enabled").name("启用分层受击 (关=旧版对照)"),wt.add(Ct,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),wt.add(Ct,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),wt.add(Ct,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),wt.add(Ct,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),wt.add(Ct,"upperShiftScale",0,1,.01).name("上身位移缩放"),wt.add(Ct,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),wt.add(Ct.hitHeight,"light",0,1,.01).name("轻击命中部位"),wt.add(Ct.hitHeight,"heavy",0,1,.01).name("重击命中部位"),wt.add(Ct.hitHeight,"knock",0,1,.01).name("击退命中部位"),wt.add(Ct,"leanLight",0,1.5,.01).name("轻击力度"),wt.add(Ct,"leanHeavy",0,1.5,.01).name("重击力度"),wt.add(Ct,"leanKnock",0,1.5,.01).name("击退力度"),wt.add(Ct,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:Ct.abdomen},{name:"打肩 (shoulder)",p:Ct.shoulder}].map(({name:dt,p:lt})=>{const w=d(wt,dt);return w.add(lt,"upperPitch",0,2,.01).name("上身前后倾斜"),w.add(lt,"upperRoll",0,2,.01).name("上身侧倾"),w.add(lt,"upperYaw",0,1.5,.01).name("肩部扭转"),w.add(lt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),w.add(lt,"shift",0,.8,.01).name("身体反应位移"),w.add(lt,"drop",0,.4,.01).name("整体下沉"),w.add(lt,"back",0,.4,.01).name("屁股向后"),w.add(lt,"knee",0,1.6,.01).name("屈膝"),w.add(lt,"hip",0,1,.01).name("髋前倾"),w.add(lt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),w});const Ut=d(X,"派生招"),At=r.links;Ut.add(At,"enabled").name("总开关 (false=旧连击)"),Ut.add(At.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Ut.add(At.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Ut.add(At.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Ut.add(At,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Ut.add(At,"triggerWhileSprinting").name("长跑中可直接触发"),Ut.add(At.search,"range",1,14,.1).name("索敌距离 (m)"),Ut.add(At.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Ut.add(At.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Lt=At.moves["sword-shield"];Lt&&(Ut.add(Lt,"enabled").name("剑盾盾击"),Ut.add(Lt,"distance",0,8,.1).name("冲锋极限 (m)"),Ut.add(Lt,"windup",0,.5,.01).name("前摇 (s)"),Ut.add(Lt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Ut.add(Lt,"recovery",0,.8,.01).name("收势 (s)"),Ut.add(Lt.hit,"radius",0,4,.05).name("命中半径 (m)"),Ut.add(Lt.hit,"width",0,2,.05).name("扫掠半径 (m)"),Ut.add(Lt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Ut.add(Lt.hit,"duration",0,1.5,.01).name("僵直 (s)")),Ut.add(r.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const F=l("相机"),Qt=d(F,"基础");Qt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Qt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Qt.add(t.camera,"distance",6,35,.5).name("距离"),Qt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Qt.add(t.camera,"fov",25,90,1).name("FOV");const Et=r.camera,Rt=d(F,"智能构图");Rt.add(Et,"radius",2,18,.5).name("威胁评估半径 (m)"),Rt.add(Et,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Rt.add(Et,"saturation",.5,8,.1).name("威胁归一化饱和"),Rt.add(Et,"pushIn",0,.5,.01).name("无威胁推进比例"),Rt.add(Et,"maxPullback",0,1,.02).name("最大拉远比例"),Rt.add(Et,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Rt.add(Et,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Rt.add(Et,"framingBias",0,1,.05).name("威胁质心平移系数"),Rt.add(Et,"attackBoost",0,2,.05).name("挥砍中额外加权"),Rt.add(Et.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Rt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const q=d(F,"缩放");return q.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),q.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),q.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),q.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),q.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),q.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),q.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),q.add({reset:i.resetZoom},"reset").name("缩放归 1"),o.forEach(dt=>dt.close()),c.forEach(dt=>dt.close()),a.close(),{gui:a,refreshWeapon:()=>tt.updateDisplay()}}const sr=Math.PI*2,bn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},wf=45,Tf=50;function Af(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function ds(n,t,e){const i=Af(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function Rf(n,t){return Math.atan2(n,-t)*180/Math.PI}function Gc(n,t){return Math.abs(((n-t)%360+540)%360-180)}function ks(n){return(n%360+360)%360}const Cf={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function Pf(n,t,e,i=8){const s=n.character,a=t.intents,r=Math.hypot(a.moveX,a.moveZ),o=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),d=r>.001?ds(a.moveX,a.moveZ,e):null,f=l>.15?ds(c.x,c.z,e):null,h=ds(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?ds(a.aimX,a.aimZ,e):null,g=n.targeting,_=g.hasTarget?ds(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=d!==null&&f!==null?Gc(d,f):null,p=d!==null?Gc(d,h):null,x=m!==null&&m>wf&&r>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,r),rawDeg:o>.02?Rf(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,o),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:h,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:x}}function Vc(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>Tf&&(n.inLen>=.35||n.speed>=.4)}const Xc="harness.dirDebug";function Df(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),r={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},o=s.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Xc)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),a&&(a.textContent=c?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(c)))}l();function d(v){if(c=v,!t)try{window.localStorage.setItem(Xc,v?"1":"0")}catch{}l()}a==null||a.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",v=>{v.key.toLowerCase()==="v"&&!v.metaKey&&!v.ctrlKey&&d(!c)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;s.width=Math.round(h*f),s.height=Math.round(h*f);let u=Cf,g=0,_="",m=8;function p(v){if(!o)return;const y=h,L=h,C=y/2,A=L/2,T=Math.min(y,L)/2-13;o.setTransform(f,0,0,f,0,0),o.clearRect(0,0,y,L),o.beginPath(),o.arc(C,A,T,0,sr),o.fillStyle="rgba(8, 12, 17, 0.5)",o.fill(),o.lineWidth=1,o.strokeStyle=v.warnMove?"rgba(251, 191, 36, 0.85)":bn.ring,o.stroke(),o.strokeStyle=bn.grid,o.beginPath(),o.moveTo(C-T,A),o.lineTo(C+T,A),o.moveTo(C,A-T),o.lineTo(C,A+T),o.stroke();for(let O=0;O<8;O++){const k=O*Math.PI/4,W=C+Math.sin(k)*(T-3),P=A-Math.cos(k)*(T-3),R=C+Math.sin(k)*T,X=A-Math.cos(k)*T;o.beginPath(),o.moveTo(W,P),o.lineTo(R,X),o.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(o.save(),o.setLineDash([2,3]),o.strokeStyle=bn.dead,o.beginPath(),o.arc(C,A,T*b,0,sr),o.stroke(),o.restore());const S=(O,k,W,P,R=!1,X=1)=>{const U=O*Math.PI/180,N=Math.sin(U),tt=-Math.cos(U),ht=T*Math.max(.14,Math.min(1,k)),nt=C+N*T*.14,gt=A+tt*T*.14,j=C+N*ht,Q=A+tt*ht;if(o.save(),o.globalAlpha=X,o.strokeStyle=W,o.fillStyle=W,o.lineWidth=P,o.lineCap="round",R&&o.setLineDash([3,3]),o.beginPath(),o.moveTo(nt,gt),o.lineTo(j,Q),o.stroke(),!R&&ht>T*.3){const pt=-tt,K=N,mt=5.2;o.beginPath(),o.moveTo(j+N*1.5,Q+tt*1.5),o.lineTo(j-N*mt+pt*mt*.72,Q-tt*mt+K*mt*.72),o.lineTo(j-N*mt-pt*mt*.72,Q-tt*mt-K*mt*.72),o.closePath(),o.fill()}o.restore()},D=(O,k)=>{const W=O*Math.PI/180,P=Math.sin(W),R=-Math.cos(W),X=-R,U=P,N=T+1.5,tt=N+6.5;o.save(),o.fillStyle=k,o.strokeStyle=k,o.lineWidth=1,o.beginPath(),o.moveTo(C+P*tt,A+R*tt),o.lineTo(C+P*N+X*4,A+R*N+U*4),o.lineTo(C+P*N-X*4,A+R*N-U*4),o.closePath(),o.fill(),o.restore()};v.lockDeg!==null&&S(v.lockDeg,1,bn.lock,1,!0,.7),v.rawDeg!==null&&v.stickHeld&&S(v.rawDeg,v.rawLen,bn.raw,1,!0,.9),v.aimDeg!==null&&S(v.aimDeg,1,bn.aim,1.6,!0,.95),S(v.faceDeg,1,bn.face,1.1,!0,.55),v.moveDeg!==null&&S(v.moveDeg,v.speed/Math.max(1,m),bn.move,5.5,!1,.8),v.inDeg!==null&&S(v.inDeg,v.inLen,bn.input,2.2),D(v.faceDeg,bn.face),o.beginPath(),o.arc(C,A,2.2,0,sr),o.fillStyle="rgba(220, 235, 248, 0.85)",o.fill()}function x(v,y){const L=T=>T===null?"-":String(Math.round(ks(T)));r.in.textContent=`入 ${L(v.inDeg)}`,r.mv.textContent=`移 ${L(v.moveDeg)}`,r.fc.textContent=`面 ${L(v.faceDeg)}`;const C=T=>T===null?"-":`${Math.round(T)}°`,A=[`Δ入→移 ${C(v.gapMove)}`,`Δ入→面 ${C(v.gapFace)}`];v.speed>.05&&A.push(`v${v.speed.toFixed(1)}`),v.lockDeg!==null&&A.push(`锁#${v.lockId} ${v.lockDist.toFixed(1)}m`),v.aimDeg!==null&&A.push("拖拽瞄准"),r.gap.textContent=A.join("  "),e.classList.toggle("is-warn",v.warnMove||Vc(v,y))}return{update(v,y,L){if(!c)return;m=Math.max(1,v.config.moveSpeed*Math.max(1,v.config.sprintMultiplier));const C=Pf(v,y,L,m);u=C;const A=v.combat.phase!=="idle";p(C);const T=performance.now(),b=`${C.inDeg}|${C.moveDeg}|${C.faceDeg}|${C.lockId}|${C.aimDeg}|${C.warnMove}|${C.speed.toFixed(1)}`;(T-g>90||b!==_)&&(g=T,_=b,x(C,A),e.dataset.in=C.inDeg===null?"":ks(C.inDeg).toFixed(1),e.dataset.mv=C.moveDeg===null?"":ks(C.moveDeg).toFixed(1),e.dataset.fc=ks(C.faceDeg).toFixed(1),e.dataset.warn=C.warnMove||Vc(C,A)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>u}}const Lf=6,If=480,Wc=240,$c=92,kf=18;function Uf(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function Ff(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function Nf(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function zf(n={}){const t=Math.max(1,n.windowS??Lf),e=Math.max(60,n.capacity??If),i=Math.max(1,n.speedCap??kf),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const r=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${r}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${r}</div>`].join("");const o=n.toggle??a.querySelector("#motiondbg-toggle"),c=a.querySelector("#motiondbg-graph"),l=a.querySelector("#motiondbg-read"),d=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(Wc*u),c.height=Math.round($c*u);const g=Df({deadZone:n.deadZone,container:f,embedded:!0});let _=!1;function m(T){_=T,a.classList.toggle("is-off",!T),!s&&o&&(o.textContent=T?"手感 ⌄":"手感 ▸",o.setAttribute("aria-expanded",String(T)),o.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}m(!1),s||(o==null||o.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(!_)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&m(!_)}));const p=[];let x=0,v=null,y=-1,L={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function C(T){const b=T-t;let S=0;for(;S<p.length&&p[S].t<b;)S++;return p.slice(S)}function A(T,b){if(!h)return;const S=Wc,D=$c;h.setTransform(u,0,0,u,0,0),h.clearRect(0,0,S,D),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,S,D);const O=4,k=4,W=S-O-k,P=9,R=46,X=62,U=22,N=b-t,tt=K=>O+Math.max(0,Math.min(1,(K-N)/t))*W;for(let K=0;K<T.length;K++){if(!T[K].busy)continue;const mt=tt(T[K].t),wt=K+1<T.length?tt(T[K+1].t):mt+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(mt,P,Math.max(2,wt-mt),R)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const K of[P,P+R/2,P+R])h.moveTo(O,K),h.lineTo(S-k,K);h.moveTo(O,X+U/2),h.lineTo(S-k,X+U/2),h.stroke();const nt=Math.max(1,...T.map(K=>K.speed),...T.map(K=>K.drive))*1.15,gt=K=>P+R-K/nt*R;if(T.length>1){h.beginPath(),h.moveTo(tt(T[0].t),gt(T[0].speed));for(let K=1;K<T.length;K++)h.lineTo(tt(T[K].t),gt(T[K].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(tt(T[T.length-1].t),P+R),h.lineTo(tt(T[0].t),P+R),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(tt(T[0].t),gt(T[0].drive));for(let K=1;K<T.length;K++)h.lineTo(tt(T[K].t),gt(T[K].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let j=.02;for(const K of T)j=Math.max(j,Math.abs(K.dv));j*=1.1;const Q=X+U/2,pt=U/2;for(const K of T){const mt=Math.min(pt,Math.abs(K.dv)/j*pt);h.fillStyle=K.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(tt(K.t)-.7,K.dv>=0?Q-mt:Q,1.4,Math.max(.5,mt))}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(nt.toFixed(1),O+2,P+8),h.fillText("v",O+2,P+R-2),h.fillText("Δv",O+2,X+9),h.textAlign="right",h.fillText("0",S-k-2,P+R-2),h.textAlign="left"}return{dirDebug:g,update(T,b,S){const D=performance.now()/1e3,O=y<0?1/60:Math.max(1e-4,Math.min(.25,D-y));y=D;const k=T.character,W={x:k.position.x,z:k.position.z},P=Math.hypot(k.velocity.x,k.velocity.z),{speed:R,raw:X}=v?Ff(v,W,O,i):{speed:0,raw:0},U=Uf(x,R,O,D);U.drive=P,U.raw=X,U.busy=Nf(T),v=W,x=R,p.push(U),p.length>e&&p.shift();const N=C(D);let tt=0;for(const ht of N)tt=Math.max(tt,ht.speed);if(L={speed:R,drive:P,raw:X,dv:U.dv,accel:U.accel,peak:tt,samples:N.length,windowS:t,busy:U.busy},g.update(T,b,S),_){A(N,D);const ht=U.dv>=0?"+":"";l.textContent=`v ${R.toFixed(2)} · 驱 ${P.toFixed(2)} · 峰 ${tt.toFixed(2)} · Δv ${ht}${U.dv.toFixed(3)} · ${N.length} 帧`}},setEnabled:m,toggle(){return m(!_),_},enabled:()=>_,last:()=>({...L}),samples:()=>C(performance.now()/1e3).map(T=>({...T}))}}const Of=["剑盾","双剑","大剑","法杖","弓"],Bf={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function Hf(n){return{update(t,e,i,s,a,r,o=!1){const c=t.character,l=c.position,d=c.velocity,f=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,u=At=>At.toFixed(2),g=At=>(At*180/Math.PI).toFixed(0),_=Of[yi.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,v=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,y=x.phase==="active"?`${x.kind}@${v.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,L=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",C=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),A=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),T=Math.abs(C)+Math.abs(A)+1e-6,b=Math.round(Math.abs(A)/T*100),S=`strafe ${b}%${C<-.05?" back":""}`,D=t.camera,O=`threat ${(D.threat*100).toFixed(0)}%  dist×${u(D.distanceScale)}  off (${u(D.offsetX)},${u(D.offsetZ)})  pitch +${u(D.pitchDelta)}°  n=${D.threatCount}`,k=r?u(r.attackBlend):"-",W=r==null?void 0:r.attackWeights,P=W?`gw ${u(W.gaitScale)}  lw ${u(W.attackLegWeight)}  spd ${u(W.driveSpeed)}`:"-",R=W?`${u(W.gaitScale)}/${u(W.attackLegWeight)}`:"-",X=r?`${r.landing.kind} ${u(r.landing.pulse)} t${u(r.landing.remaining)} vy${u(r.landing.impactVy)}`:"-",U=r?`${r.landing.kind}/${u(r.landing.pulse)}`:"-",N=(r==null?void 0:r.zoom)!==void 0?`zoom ×${u(r.zoom)}`:"-",tt=r==null?void 0:r.hurt,ht=tt?`hurt ${t.playerHurt.type}  部位h${u(tt.hitHeight)}  脉冲p${u(tt.pulse)}  上身${u(tt.upperShift)}  重心${u(tt.comShift)}  后坐${u(tt.pelvisBack)}  屈膝${u(tt.knee)}`:"-",nt=tt?`${u(tt.hitHeight)}/${u(tt.pulse)}/${u(tt.knee)}`:"-",gt=r==null?void 0:r.ik,j=gt?`${gt.active?"on":"off"} w${u(gt.weight)} e${u(gt.maxError)}`:"-",Q=t.playerLink,pt=`link ${Q.kind||"-"}  ${Q.phase}  prog ${u(Q.progress)}  win ${u(Q.linkWindow)}s  cd ${u(Q.cooldown)}s  hits ${Q.hitIds.length}  travel ${u(Q.travelled)}/${u(Q.travel)}m  id ${Q.id}`,K=`${Q.phase}/${Q.kind||"-"}/w${u(Q.linkWindow)}`,mt=s.lastGesture,wt=mt?`${mt.button} ${mt.kind} ${mt.heldMs.toFixed(0)}ms d${mt.distance.toFixed(0)}px ${mt.angleDeg.toFixed(0)}° taps${mt.taps}`:"-",Ct=t.dummies.map(At=>`${At.id}:${Bf[At.mode]}`).join("  ");if(o){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${Q.phase}${Q.kind?`/${Q.kind}`:""} w${u(Q.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(l.x)},${u(l.y)},${u(l.z)})  vel (${u(d.x)},${u(d.y)},${u(d.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${b}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(c.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${y}  ab ${k}  gw/lw ${R}  land ${U}  ik ${j}`,`aim ${L}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${nt}`,`dummies ${Ct}  atkCount ${t.dummyAttackCount}  cam ${(D.threat*100).toFixed(0)}% ×${u(D.distanceScale)}  ${N}  lk ${K}`,`event ${h?`${h.type} ${u(h.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${wt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(l.x)}, ${u(l.y)}, ${u(l.z)})`,`vel  (${u(d.x)}, ${u(d.y)}, ${u(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${k}   ${P}   land ${X}`,ht,`ik ${j}  clamped ${gt?gt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${S}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${L}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${v.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,pt,`camera ${O}  ${N}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Ct}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${h?`${h.type} ${u(h.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${wt}`].join(`
`)}}}const Us=["hud","motion","debug"],Yc={hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}};function Gf(n){var l;const t=Object.fromEntries(Us.map(d=>[d,document.getElementById(`${d==="motion"?"motiondbg":d==="debug"?"debug":"hud"}-toggle`)])),e=Object.fromEntries(Us.map(d=>[d,document.getElementById(d==="motion"?"motiondbg":d==="debug"?"debug-panel":"hud")]));let i={},s=null;function a(){var d,f,h;for(const u of Us){const g=s===u,_=t[u],m=e[u];_&&(_.setAttribute("aria-expanded",String(g)),_.textContent=`${Yc[u].short} ${g?"▾":"▸"}`,_.setAttribute("aria-label",`${g?"收起":"展开"}${Yc[u].full}`)),m&&m.classList.toggle("is-open",g)}n.classList.toggle("is-compact",s!=="hud"),(d=i.motion)==null||d.setEnabled(s==="motion"),s==="debug"?(f=i.debug)==null||f.open():(h=i.debug)==null||h.close()}function r(d){s=s===d?null:d,a()}function o(){s!==null&&(s=null,a())}for(const d of Us)(l=t[d])==null||l.addEventListener("pointerdown",f=>{f.preventDefault(),f.stopPropagation(),r(d)});window.addEventListener("keydown",d=>{d.key.toLowerCase()==="v"&&!d.metaKey&&!d.ctrlKey&&r("motion")});function c(d){const f=d.target;f instanceof Element&&f.closest("#panel-row, #panel-stack")||s!=="debug"&&o()}return window.addEventListener("pointerdown",c,{capture:!0,passive:!0}),a(),{hudCompact:()=>s!=="hud",register(d){i=d,a()},toggle:r,closeAll:o,isOpen:d=>s===d}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Qo="170",Vf=0,Zc=1,Xf=2,md=1,gd=2,zn=3,ei=0,qe=1,Ve=2,Jn=0,ji=1,qc=2,jc=3,Kc=4,Wf=5,gi=100,$f=101,Yf=102,Zf=103,qf=104,jf=200,Kf=201,Jf=202,Qf=203,to=204,eo=205,tp=206,ep=207,np=208,ip=209,sp=210,ap=211,rp=212,op=213,cp=214,no=0,io=1,so=2,Qi=3,ao=4,ro=5,oo=6,co=7,tc=0,lp=1,dp=2,Qn=0,hp=1,up=2,fp=3,pp=4,mp=5,gp=6,_p=7,_d=300,ts=301,es=302,lo=303,ho=304,za=306,uo=1e3,xi=1001,fo=1002,_n=1003,xp=1004,Fs=1005,An=1006,ar=1007,vi=1008,Vn=1009,xd=1010,vd=1011,ws=1012,ec=1013,Si=1014,Bn=1015,As=1016,nc=1017,ic=1018,ns=1020,Md=35902,yd=1021,Sd=1022,gn=1023,bd=1024,Ed=1025,Ki=1026,is=1027,wd=1028,sc=1029,Td=1030,ac=1031,rc=1033,pa=33776,ma=33777,ga=33778,_a=33779,po=35840,mo=35841,go=35842,_o=35843,xo=36196,vo=37492,Mo=37496,yo=37808,So=37809,bo=37810,Eo=37811,wo=37812,To=37813,Ao=37814,Ro=37815,Co=37816,Po=37817,Do=37818,Lo=37819,Io=37820,ko=37821,xa=36492,Uo=36494,Fo=36495,Ad=36283,No=36284,zo=36285,Oo=36286,vp=3200,Mp=3201,Rd=0,yp=1,jn="",an="srgb",as="srgb-linear",Oa="linear",ce="srgb",Pi=7680,Jc=519,Sp=512,bp=513,Ep=514,Cd=515,wp=516,Tp=517,Ap=518,Rp=519,Bo=35044,Qc="300 es",Hn=2e3,Da=2001;class rs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],va=Math.PI/180,Ho=180/Math.PI;function ti(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]).toLowerCase()}function Ze(n,t,e){return Math.max(t,Math.min(e,n))}function Cp(n,t){return(n%t+t)%t}function rr(n,t,e){return(1-e)*n+e*t}function Tn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function le(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Zt{constructor(t=0,e=0){Zt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ze(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*s+t.x,this.y=a*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qt{constructor(t,e,i,s,a,r,o,c,l){qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,r,o,c,l)}set(t,e,i,s,a,r,o,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=a,d[5]=c,d[6]=i,d[7]=r,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,r=i[0],o=i[3],c=i[6],l=i[1],d=i[4],f=i[7],h=i[2],u=i[5],g=i[8],_=s[0],m=s[3],p=s[6],x=s[1],v=s[4],y=s[7],L=s[2],C=s[5],A=s[8];return a[0]=r*_+o*x+c*L,a[3]=r*m+o*v+c*C,a[6]=r*p+o*y+c*A,a[1]=l*_+d*x+f*L,a[4]=l*m+d*v+f*C,a[7]=l*p+d*y+f*A,a[2]=h*_+u*x+g*L,a[5]=h*m+u*v+g*C,a[8]=h*p+u*y+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*r*d-e*o*l-i*a*d+i*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8],f=d*r-o*l,h=o*c-d*a,u=l*a-r*c,g=e*f+i*h+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(s*l-d*i)*_,t[2]=(o*i-s*r)*_,t[3]=h*_,t[4]=(d*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=u*_,t[7]=(i*c-l*e)*_,t[8]=(r*e-i*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(i*c,i*l,-i*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(or.makeScale(t,e)),this}rotate(t){return this.premultiply(or.makeRotation(-t)),this}translate(t,e){return this.premultiply(or.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const or=new qt;function Pd(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function La(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Pp(){const n=La("canvas");return n.style.display="block",n}const tl={};function vs(n){n in tl||(tl[n]=!0,console.warn(n))}function Dp(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function Lp(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Ip(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const re={enabled:!0,workingColorSpace:as,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ce&&(n.r=Gn(n.r),n.g=Gn(n.g),n.b=Gn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ce&&(n.r=Ji(n.r),n.g=Ji(n.g),n.b=Ji(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===jn?Oa:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Gn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ji(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const el=[.64,.33,.3,.6,.15,.06],nl=[.2126,.7152,.0722],il=[.3127,.329],sl=new qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),al=new qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);re.define({[as]:{primaries:el,whitePoint:il,transfer:Oa,toXYZ:sl,fromXYZ:al,luminanceCoefficients:nl,workingColorSpaceConfig:{unpackColorSpace:an},outputColorSpaceConfig:{drawingBufferColorSpace:an}},[an]:{primaries:el,whitePoint:il,transfer:ce,toXYZ:sl,fromXYZ:al,luminanceCoefficients:nl,outputColorSpaceConfig:{drawingBufferColorSpace:an}}});let Di;class kp{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Di===void 0&&(Di=La("canvas")),Di.width=t.width,Di.height=t.height;const i=Di.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Di}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=La("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Gn(a[r]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Gn(e[i]/255)*255):e[i]=Gn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Up=0;class Dd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Up++}),this.uuid=ti(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(cr(s[r].image)):a.push(cr(s[r]))}else a=cr(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function cr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?kp.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Fp=0;class We extends rs{constructor(t=We.DEFAULT_IMAGE,e=We.DEFAULT_MAPPING,i=xi,s=xi,a=An,r=vi,o=gn,c=Vn,l=We.DEFAULT_ANISOTROPY,d=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fp++}),this.uuid=ti(),this.name="",this.source=new Dd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Zt(0,0),this.repeat=new Zt(1,1),this.center=new Zt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==_d)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case uo:t.x=t.x-Math.floor(t.x);break;case xi:t.x=t.x<0?0:1;break;case fo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case uo:t.y=t.y-Math.floor(t.y);break;case xi:t.y=t.y<0?0:1;break;case fo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}We.DEFAULT_IMAGE=null;We.DEFAULT_MAPPING=_d;We.DEFAULT_ANISOTROPY=1;class Se{constructor(t=0,e=0,i=0,s=1){Se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*i+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const c=t.elements,l=c[0],d=c[4],f=c[8],h=c[1],u=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,y=(u+1)/2,L=(p+1)/2,C=(d+h)/4,A=(f+_)/4,T=(g+m)/4;return v>y&&v>L?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=C/i,a=A/i):y>L?y<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(y),i=C/s,a=T/s):L<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(L),i=A/a,s=T/a),this.set(i,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-d)*(h-d));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-_)/x,this.z=(h-d)/x,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Np extends rs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Se(0,0,t,e),this.scissorTest=!1,this.viewport=new Se(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:An,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new We(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Dd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends Np{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Ld extends We{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class zp extends We{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rs{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,r,o){let c=i[s+0],l=i[s+1],d=i[s+2],f=i[s+3];const h=a[r+0],u=a[r+1],g=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f;return}if(o===1){t[e+0]=h,t[e+1]=u,t[e+2]=g,t[e+3]=_;return}if(f!==_||c!==h||l!==u||d!==g){let m=1-o;const p=c*h+l*u+d*g+f*_,x=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const L=Math.sqrt(v),C=Math.atan2(L,p*x);m=Math.sin(m*C)/L,o=Math.sin(o*C)/L}const y=o*x;if(c=c*m+h*y,l=l*m+u*y,d=d*m+g*y,f=f*m+_*y,m===1-o){const L=1/Math.sqrt(c*c+l*l+d*d+f*f);c*=L,l*=L,d*=L,f*=L}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,r){const o=i[s],c=i[s+1],l=i[s+2],d=i[s+3],f=a[r],h=a[r+1],u=a[r+2],g=a[r+3];return t[e]=o*g+d*f+c*u-l*h,t[e+1]=c*g+d*h+l*f-o*u,t[e+2]=l*g+d*u+o*h-c*f,t[e+3]=d*g-o*f-c*h-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(i/2),d=o(s/2),f=o(a/2),h=c(i/2),u=c(s/2),g=c(a/2);switch(r){case"XYZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"YXZ":this._x=h*d*f+l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"ZXY":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f-h*u*g;break;case"ZYX":this._x=h*d*f-l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f+h*u*g;break;case"YZX":this._x=h*d*f+l*u*g,this._y=l*u*f+h*d*g,this._z=l*d*g-h*u*f,this._w=l*d*f-h*u*g;break;case"XZY":this._x=h*d*f-l*u*g,this._y=l*u*f-h*d*g,this._z=l*d*g+h*u*f,this._w=l*d*f+h*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],d=e[6],f=e[10],h=i+o+f;if(h>0){const u=.5/Math.sqrt(h+1);this._w=.25/u,this._x=(d-c)*u,this._y=(a-l)*u,this._z=(r-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(d-c)/u,this._x=.25*u,this._y=(s+r)/u,this._z=(a+l)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(a-l)/u,this._x=(s+r)/u,this._y=.25*u,this._z=(c+d)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(r-s)/u,this._x=(a+l)/u,this._y=(c+d)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ze(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+r*o+s*l-a*c,this._y=s*d+r*c+a*o-i*l,this._z=a*d+r*l+i*c-s*o,this._w=r*d-i*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+i*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=i,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const u=1-e;return this._w=u*r+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,o),f=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=r*f+this._w*h,this._x=i*f+this._x*h,this._y=s*f+this._y*h,this._z=a*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Y{constructor(t=0,e=0,i=0){Y.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*i),d=2*(o*e-a*s),f=2*(a*i-r*e);return this.x=e+c*l+r*f-o*d,this.y=i+c*d+o*l-a*f,this.z=s+c*f+a*d-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-i*c,this.z=i*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return lr.copy(this).projectOnVector(t),this.sub(lr)}reflect(t){return this.sub(lr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Ze(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const lr=new Y,rl=new Rs;class Cs{constructor(t=new Y(1/0,1/0,1/0),e=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,un):un.fromBufferAttribute(a,r),un.applyMatrix4(t.matrixWorld),this.expandByPoint(un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ns.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ns.copy(i.boundingBox)),Ns.applyMatrix4(t.matrixWorld),this.union(Ns)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,un),un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(hs),zs.subVectors(this.max,hs),Li.subVectors(t.a,hs),Ii.subVectors(t.b,hs),ki.subVectors(t.c,hs),Xn.subVectors(Ii,Li),Wn.subVectors(ki,Ii),ri.subVectors(Li,ki);let e=[0,-Xn.z,Xn.y,0,-Wn.z,Wn.y,0,-ri.z,ri.y,Xn.z,0,-Xn.x,Wn.z,0,-Wn.x,ri.z,0,-ri.x,-Xn.y,Xn.x,0,-Wn.y,Wn.x,0,-ri.y,ri.x,0];return!dr(e,Li,Ii,ki,zs)||(e=[1,0,0,0,1,0,0,0,1],!dr(e,Li,Ii,ki,zs))?!1:(Os.crossVectors(Xn,Wn),e=[Os.x,Os.y,Os.z],dr(e,Li,Ii,ki,zs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(In),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const In=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],un=new Y,Ns=new Cs,Li=new Y,Ii=new Y,ki=new Y,Xn=new Y,Wn=new Y,ri=new Y,hs=new Y,zs=new Y,Os=new Y,oi=new Y;function dr(n,t,e,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){oi.fromArray(n,a);const o=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),c=t.dot(oi),l=e.dot(oi),d=i.dot(oi);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const Op=new Cs,us=new Y,hr=new Y;class Ba{constructor(t=new Y,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Op.setFromPoints(t).getCenter(i);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;us.subVectors(t,this.center);const e=us.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(us,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(hr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(us.copy(t.center).add(hr)),this.expandByPoint(us.copy(t.center).sub(hr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const kn=new Y,ur=new Y,Bs=new Y,$n=new Y,fr=new Y,Hs=new Y,pr=new Y;class oc{constructor(t=new Y,e=new Y(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(kn.copy(this.origin).addScaledVector(this.direction,e),kn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ur.copy(t).add(e).multiplyScalar(.5),Bs.copy(e).sub(t).normalize(),$n.copy(this.origin).sub(ur);const a=t.distanceTo(e)*.5,r=-this.direction.dot(Bs),o=$n.dot(this.direction),c=-$n.dot(Bs),l=$n.lengthSq(),d=Math.abs(1-r*r);let f,h,u,g;if(d>0)if(f=r*c-o,h=r*o-c,g=a*d,f>=0)if(h>=-g)if(h<=g){const _=1/d;f*=_,h*=_,u=f*(f+r*h+2*o)+h*(r*f+h+2*c)+l}else h=a,f=Math.max(0,-(r*h+o)),u=-f*f+h*(h+2*c)+l;else h=-a,f=Math.max(0,-(r*h+o)),u=-f*f+h*(h+2*c)+l;else h<=-g?(f=Math.max(0,-(-r*a+o)),h=f>0?-a:Math.min(Math.max(-a,-c),a),u=-f*f+h*(h+2*c)+l):h<=g?(f=0,h=Math.min(Math.max(-a,-c),a),u=h*(h+2*c)+l):(f=Math.max(0,-(r*a+o)),h=f>0?a:Math.min(Math.max(-a,-c),a),u=-f*f+h*(h+2*c)+l);else h=r>0?-a:a,f=Math.max(0,-(r*h+o)),u=-f*f+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(ur).addScaledVector(Bs,h),u}intersectSphere(t,e){kn.subVectors(t.center,this.origin);const i=kn.dot(this.direction),s=kn.dot(kn)-i*i,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,r,o,c;const l=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,s=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,s=(t.min.x-h.x)*l),d>=0?(a=(t.min.y-h.y)*d,r=(t.max.y-h.y)*d):(a=(t.max.y-h.y)*d,r=(t.min.y-h.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-h.z)*f,c=(t.max.z-h.z)*f):(o=(t.max.z-h.z)*f,c=(t.min.z-h.z)*f),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,kn)!==null}intersectTriangle(t,e,i,s,a){fr.subVectors(e,t),Hs.subVectors(i,t),pr.crossVectors(fr,Hs);let r=this.direction.dot(pr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;$n.subVectors(this.origin,t);const c=o*this.direction.dot(Hs.crossVectors($n,Hs));if(c<0)return null;const l=o*this.direction.dot(fr.cross($n));if(l<0||c+l>r)return null;const d=-o*$n.dot(pr);return d<0?null:this.at(d/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class me{constructor(t,e,i,s,a,r,o,c,l,d,f,h,u,g,_,m){me.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,r,o,c,l,d,f,h,u,g,_,m)}set(t,e,i,s,a,r,o,c,l,d,f,h,u,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=c,p[2]=l,p[6]=d,p[10]=f,p[14]=h,p[3]=u,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new me().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Ui.setFromMatrixColumn(t,0).length(),a=1/Ui.setFromMatrixColumn(t,1).length(),r=1/Ui.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*r,e[9]=i[9]*r,e[10]=i[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),d=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const h=r*d,u=r*f,g=o*d,_=o*f;e[0]=c*d,e[4]=-c*f,e[8]=l,e[1]=u+g*l,e[5]=h-_*l,e[9]=-o*c,e[2]=_-h*l,e[6]=g+u*l,e[10]=r*c}else if(t.order==="YXZ"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h+_*o,e[4]=g*o-u,e[8]=r*l,e[1]=r*f,e[5]=r*d,e[9]=-o,e[2]=u*o-g,e[6]=_+h*o,e[10]=r*c}else if(t.order==="ZXY"){const h=c*d,u=c*f,g=l*d,_=l*f;e[0]=h-_*o,e[4]=-r*f,e[8]=g+u*o,e[1]=u+g*o,e[5]=r*d,e[9]=_-h*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const h=r*d,u=r*f,g=o*d,_=o*f;e[0]=c*d,e[4]=g*l-u,e[8]=h*l+_,e[1]=c*f,e[5]=_*l+h,e[9]=u*l-g,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const h=r*c,u=r*l,g=o*c,_=o*l;e[0]=c*d,e[4]=_-h*f,e[8]=g*f+u,e[1]=f,e[5]=r*d,e[9]=-o*d,e[2]=-l*d,e[6]=u*f+g,e[10]=h-_*f}else if(t.order==="XZY"){const h=r*c,u=r*l,g=o*c,_=o*l;e[0]=c*d,e[4]=-f,e[8]=l*d,e[1]=h*f+_,e[5]=r*d,e[9]=u*f-g,e[2]=g*f-u,e[6]=o*d,e[10]=_*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Bp,t,Hp)}lookAt(t,e,i){const s=this.elements;return Ke.subVectors(t,e),Ke.lengthSq()===0&&(Ke.z=1),Ke.normalize(),Yn.crossVectors(i,Ke),Yn.lengthSq()===0&&(Math.abs(i.z)===1?Ke.x+=1e-4:Ke.z+=1e-4,Ke.normalize(),Yn.crossVectors(i,Ke)),Yn.normalize(),Gs.crossVectors(Ke,Yn),s[0]=Yn.x,s[4]=Gs.x,s[8]=Ke.x,s[1]=Yn.y,s[5]=Gs.y,s[9]=Ke.y,s[2]=Yn.z,s[6]=Gs.z,s[10]=Ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,r=i[0],o=i[4],c=i[8],l=i[12],d=i[1],f=i[5],h=i[9],u=i[13],g=i[2],_=i[6],m=i[10],p=i[14],x=i[3],v=i[7],y=i[11],L=i[15],C=s[0],A=s[4],T=s[8],b=s[12],S=s[1],D=s[5],O=s[9],k=s[13],W=s[2],P=s[6],R=s[10],X=s[14],U=s[3],N=s[7],tt=s[11],ht=s[15];return a[0]=r*C+o*S+c*W+l*U,a[4]=r*A+o*D+c*P+l*N,a[8]=r*T+o*O+c*R+l*tt,a[12]=r*b+o*k+c*X+l*ht,a[1]=d*C+f*S+h*W+u*U,a[5]=d*A+f*D+h*P+u*N,a[9]=d*T+f*O+h*R+u*tt,a[13]=d*b+f*k+h*X+u*ht,a[2]=g*C+_*S+m*W+p*U,a[6]=g*A+_*D+m*P+p*N,a[10]=g*T+_*O+m*R+p*tt,a[14]=g*b+_*k+m*X+p*ht,a[3]=x*C+v*S+y*W+L*U,a[7]=x*A+v*D+y*P+L*N,a[11]=x*T+v*O+y*R+L*tt,a[15]=x*b+v*k+y*X+L*ht,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],d=t[2],f=t[6],h=t[10],u=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+a*c*f-s*l*f-a*o*h+i*l*h+s*o*u-i*c*u)+_*(+e*c*u-e*l*h+a*r*h-s*r*u+s*l*d-a*c*d)+m*(+e*l*f-e*o*u-a*r*f+i*r*u+a*o*d-i*l*d)+p*(-s*o*d-e*c*f+e*o*h+s*r*f-i*r*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],d=t[8],f=t[9],h=t[10],u=t[11],g=t[12],_=t[13],m=t[14],p=t[15],x=f*m*l-_*h*l+_*c*u-o*m*u-f*c*p+o*h*p,v=g*h*l-d*m*l-g*c*u+r*m*u+d*c*p-r*h*p,y=d*_*l-g*f*l+g*o*u-r*_*u-d*o*p+r*f*p,L=g*f*c-d*_*c-g*o*h+r*_*h+d*o*m-r*f*m,C=e*x+i*v+s*y+a*L;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/C;return t[0]=x*A,t[1]=(_*h*a-f*m*a-_*s*u+i*m*u+f*s*p-i*h*p)*A,t[2]=(o*m*a-_*c*a+_*s*l-i*m*l-o*s*p+i*c*p)*A,t[3]=(f*c*a-o*h*a-f*s*l+i*h*l+o*s*u-i*c*u)*A,t[4]=v*A,t[5]=(d*m*a-g*h*a+g*s*u-e*m*u-d*s*p+e*h*p)*A,t[6]=(g*c*a-r*m*a-g*s*l+e*m*l+r*s*p-e*c*p)*A,t[7]=(r*h*a-d*c*a+d*s*l-e*h*l-r*s*u+e*c*u)*A,t[8]=y*A,t[9]=(g*f*a-d*_*a-g*i*u+e*_*u+d*i*p-e*f*p)*A,t[10]=(r*_*a-g*o*a+g*i*l-e*_*l-r*i*p+e*o*p)*A,t[11]=(d*o*a-r*f*a-d*i*l+e*f*l+r*i*u-e*o*u)*A,t[12]=L*A,t[13]=(d*_*s-g*f*s+g*i*h-e*_*h-d*i*m+e*f*m)*A,t[14]=(g*o*s-r*_*s-g*i*c+e*_*c+r*i*m-e*o*m)*A,t[15]=(r*f*s-d*o*s+d*i*c-e*f*c-r*i*h+e*o*h)*A,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,r=t.x,o=t.y,c=t.z,l=a*r,d=a*o;return this.set(l*r+i,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+i,d*c-s*r,0,l*c-s*o,d*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,r){return this.set(1,i,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,d=r+r,f=o+o,h=a*l,u=a*d,g=a*f,_=r*d,m=r*f,p=o*f,x=c*l,v=c*d,y=c*f,L=i.x,C=i.y,A=i.z;return s[0]=(1-(_+p))*L,s[1]=(u+y)*L,s[2]=(g-v)*L,s[3]=0,s[4]=(u-y)*C,s[5]=(1-(h+p))*C,s[6]=(m+x)*C,s[7]=0,s[8]=(g+v)*A,s[9]=(m-x)*A,s[10]=(1-(h+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=Ui.set(s[0],s[1],s[2]).length();const r=Ui.set(s[4],s[5],s[6]).length(),o=Ui.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],fn.copy(this);const l=1/a,d=1/r,f=1/o;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=d,fn.elements[5]*=d,fn.elements[6]*=d,fn.elements[8]*=f,fn.elements[9]*=f,fn.elements[10]*=f,e.setFromRotationMatrix(fn),i.x=a,i.y=r,i.z=o,this}makePerspective(t,e,i,s,a,r,o=Hn){const c=this.elements,l=2*a/(e-t),d=2*a/(i-s),f=(e+t)/(e-t),h=(i+s)/(i-s);let u,g;if(o===Hn)u=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===Da)u=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=u,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,a,r,o=Hn){const c=this.elements,l=1/(e-t),d=1/(i-s),f=1/(r-a),h=(e+t)*l,u=(i+s)*d;let g,_;if(o===Hn)g=(r+a)*f,_=-2*f;else if(o===Da)g=a*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-u,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ui=new Y,fn=new me,Bp=new Y(0,0,0),Hp=new Y(1,1,1),Yn=new Y,Gs=new Y,Ke=new Y,ol=new me,cl=new Rs;class Pn{constructor(t=0,e=0,i=0,s=Pn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],d=s[9],f=s[2],h=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,u),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Ze(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,u),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ze(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ol.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ol,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return cl.setFromEuler(this),this.setFromQuaternion(cl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Pn.DEFAULT_ORDER="XYZ";class cc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Gp=0;const ll=new Y,Fi=new Rs,Un=new me,Vs=new Y,fs=new Y,Vp=new Y,Xp=new Rs,dl=new Y(1,0,0),hl=new Y(0,1,0),ul=new Y(0,0,1),fl={type:"added"},Wp={type:"removed"},Ni={type:"childadded",child:null},mr={type:"childremoved",child:null};class be extends rs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gp++}),this.uuid=ti(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new Y,e=new Pn,i=new Rs,s=new Y(1,1,1);function a(){i.setFromEuler(e,!1)}function r(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new me},normalMatrix:{value:new qt}}),this.matrix=new me,this.matrixWorld=new me,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new cc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.premultiply(Fi),this}rotateX(t){return this.rotateOnAxis(dl,t)}rotateY(t){return this.rotateOnAxis(hl,t)}rotateZ(t){return this.rotateOnAxis(ul,t)}translateOnAxis(t,e){return ll.copy(t).applyQuaternion(this.quaternion),this.position.add(ll.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(dl,t)}translateY(t){return this.translateOnAxis(hl,t)}translateZ(t){return this.translateOnAxis(ul,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Vs.copy(t):Vs.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(fs,Vs,this.up):Un.lookAt(Vs,fs,this.up),this.quaternion.setFromRotationMatrix(Un),s&&(Un.extractRotation(s.matrixWorld),Fi.setFromRotationMatrix(Un),this.quaternion.premultiply(Fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(fl),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Wp),mr.child=t,this.dispatchEvent(mr),mr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Un.multiply(t.parent.matrixWorld)),t.applyMatrix4(Un),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(fl),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,t,Vp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,Xp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),d=r(t.images),f=r(t.shapes),h=r(t.skeletons),u=r(t.animations),g=r(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=s,i;function r(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}be.DEFAULT_UP=new Y(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pn=new Y,Fn=new Y,gr=new Y,Nn=new Y,zi=new Y,Oi=new Y,pl=new Y,_r=new Y,xr=new Y,vr=new Y,Mr=new Se,yr=new Se,Sr=new Se;class Qe{constructor(t=new Y,e=new Y,i=new Y){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),pn.subVectors(t,e),s.cross(pn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){pn.subVectors(s,e),Fn.subVectors(i,e),gr.subVectors(t,e);const r=pn.dot(pn),o=pn.dot(Fn),c=pn.dot(gr),l=Fn.dot(Fn),d=Fn.dot(gr),f=r*l-o*o;if(f===0)return a.set(0,0,0),null;const h=1/f,u=(l*c-o*d)*h,g=(r*d-o*c)*h;return a.set(1-u-g,g,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(t,e,i,s,a,r,o,c){return this.getBarycoord(t,e,i,s,Nn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Nn.x),c.addScaledVector(r,Nn.y),c.addScaledVector(o,Nn.z),c)}static getInterpolatedAttribute(t,e,i,s,a,r){return Mr.setScalar(0),yr.setScalar(0),Sr.setScalar(0),Mr.fromBufferAttribute(t,e),yr.fromBufferAttribute(t,i),Sr.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Mr,a.x),r.addScaledVector(yr,a.y),r.addScaledVector(Sr,a.z),r}static isFrontFacing(t,e,i,s){return pn.subVectors(i,e),Fn.subVectors(t,e),pn.cross(Fn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),pn.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Qe.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Qe.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return Qe.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return Qe.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Qe.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let r,o;zi.subVectors(s,i),Oi.subVectors(a,i),_r.subVectors(t,i);const c=zi.dot(_r),l=Oi.dot(_r);if(c<=0&&l<=0)return e.copy(i);xr.subVectors(t,s);const d=zi.dot(xr),f=Oi.dot(xr);if(d>=0&&f<=d)return e.copy(s);const h=c*f-d*l;if(h<=0&&c>=0&&d<=0)return r=c/(c-d),e.copy(i).addScaledVector(zi,r);vr.subVectors(t,a);const u=zi.dot(vr),g=Oi.dot(vr);if(g>=0&&u<=g)return e.copy(a);const _=u*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(i).addScaledVector(Oi,o);const m=d*g-u*f;if(m<=0&&f-d>=0&&u-g>=0)return pl.subVectors(a,s),o=(f-d)/(f-d+(u-g)),e.copy(s).addScaledVector(pl,o);const p=1/(m+_+h);return r=_*p,o=h*p,e.copy(i).addScaledVector(zi,r).addScaledVector(Oi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Id={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},Xs={h:0,s:0,l:0};function br(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Yt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=an){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=re.workingColorSpace){return this.r=t,this.g=e,this.b=i,re.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=re.workingColorSpace){if(t=Cp(t,1),e=Ze(e,0,1),i=Ze(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,r=2*i-a;this.r=br(r,a,t+1/3),this.g=br(r,a,t),this.b=br(r,a,t-1/3)}return re.toWorkingColorSpace(this,s),this}setStyle(t,e=an){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=an){const i=Id[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gn(t.r),this.g=Gn(t.g),this.b=Gn(t.b),this}copyLinearToSRGB(t){return this.r=Ji(t.r),this.g=Ji(t.g),this.b=Ji(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=an){return re.fromWorkingColorSpace(Ue.copy(this),t),Math.round(Ze(Ue.r*255,0,255))*65536+Math.round(Ze(Ue.g*255,0,255))*256+Math.round(Ze(Ue.b*255,0,255))}getHexString(t=an){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.fromWorkingColorSpace(Ue.copy(this),e);const i=Ue.r,s=Ue.g,a=Ue.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let c,l;const d=(o+r)/2;if(o===r)c=0,l=0;else{const f=r-o;switch(l=d<=.5?f/(r+o):f/(2-r-o),r){case i:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-i)/f+2;break;case a:c=(i-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=re.workingColorSpace){return re.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=an){re.fromWorkingColorSpace(Ue.copy(this),t);const e=Ue.r,i=Ue.g,s=Ue.b;return t!==an?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Zn),this.setHSL(Zn.h+t,Zn.s+e,Zn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Zn),t.getHSL(Xs);const i=rr(Zn.h,Xs.h,e),s=rr(Zn.s,Xs.s,e),a=rr(Zn.l,Xs.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Yt;Yt.NAMES=Id;let $p=0;class Ei extends rs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$p++}),this.uuid=ti(),this.name="",this.blending=ji,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=to,this.blendDst=eo,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ji&&(i.blending=this.blending),this.side!==ei&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==to&&(i.blendSrc=this.blendSrc),this.blendDst!==eo&&(i.blendDst=this.blendDst),this.blendEquation!==gi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class En extends Ei{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=tc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const we=new Y,Ws=new Zt;class xn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Bo,this.updateRanges=[],this.gpuType=Bn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Ws.fromBufferAttribute(this,e),Ws.applyMatrix3(t),this.setXY(e,Ws.x,Ws.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Tn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=le(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Tn(e,this.array)),e}setX(t,e){return this.normalized&&(e=le(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Tn(e,this.array)),e}setY(t,e){return this.normalized&&(e=le(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Tn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=le(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Tn(e,this.array)),e}setW(t,e){return this.normalized&&(e=le(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=le(e,this.array),i=le(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=le(e,this.array),i=le(i,this.array),s=le(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=le(e,this.array),i=le(i,this.array),s=le(s,this.array),a=le(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Bo&&(t.usage=this.usage),t}}class kd extends xn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Ud extends xn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Ee extends xn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Yp=0;const nn=new me,Er=new be,Bi=new Y,Je=new Cs,ps=new Cs,Pe=new Y;class je extends rs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=ti(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Pd(t)?Ud:kd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new qt().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return nn.makeRotationFromQuaternion(t),this.applyMatrix4(nn),this}rotateX(t){return nn.makeRotationX(t),this.applyMatrix4(nn),this}rotateY(t){return nn.makeRotationY(t),this.applyMatrix4(nn),this}rotateZ(t){return nn.makeRotationZ(t),this.applyMatrix4(nn),this}translate(t,e,i){return nn.makeTranslation(t,e,i),this.applyMatrix4(nn),this}scale(t,e,i){return nn.makeScale(t,e,i),this.applyMatrix4(nn),this}lookAt(t){return Er.lookAt(t),Er.updateMatrix(),this.applyMatrix4(Er.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Ee(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Cs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];Je.setFromBufferAttribute(a),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,Je.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,Je.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(Je.min),this.boundingBox.expandByPoint(Je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ba);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(t){const i=this.boundingSphere.center;if(Je.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];ps.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(Je.min,ps.min),Je.expandByPoint(Pe),Pe.addVectors(Je.max,ps.max),Je.expandByPoint(Pe)):(Je.expandByPoint(ps.min),Je.expandByPoint(ps.max))}Je.getCenter(i);let s=0;for(let a=0,r=t.count;a<r;a++)Pe.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(Pe));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)Pe.fromBufferAttribute(o,l),c&&(Bi.fromBufferAttribute(t,l),Pe.add(Bi)),s=Math.max(s,i.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xn(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let T=0;T<i.count;T++)o[T]=new Y,c[T]=new Y;const l=new Y,d=new Y,f=new Y,h=new Zt,u=new Zt,g=new Zt,_=new Y,m=new Y;function p(T,b,S){l.fromBufferAttribute(i,T),d.fromBufferAttribute(i,b),f.fromBufferAttribute(i,S),h.fromBufferAttribute(a,T),u.fromBufferAttribute(a,b),g.fromBufferAttribute(a,S),d.sub(l),f.sub(l),u.sub(h),g.sub(h);const D=1/(u.x*g.y-g.x*u.y);isFinite(D)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(D),m.copy(f).multiplyScalar(u.x).addScaledVector(d,-g.x).multiplyScalar(D),o[T].add(_),o[b].add(_),o[S].add(_),c[T].add(m),c[b].add(m),c[S].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,b=x.length;T<b;++T){const S=x[T],D=S.start,O=S.count;for(let k=D,W=D+O;k<W;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const v=new Y,y=new Y,L=new Y,C=new Y;function A(T){L.fromBufferAttribute(s,T),C.copy(L);const b=o[T];v.copy(b),v.sub(L.multiplyScalar(L.dot(b))).normalize(),y.crossVectors(C,b);const D=y.dot(c[T])<0?-1:1;r.setXYZW(T,v.x,v.y,v.z,D)}for(let T=0,b=x.length;T<b;++T){const S=x[T],D=S.start,O=S.count;for(let k=D,W=D+O;k<W;k+=3)A(t.getX(k+0)),A(t.getX(k+1)),A(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new xn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,u=i.count;h<u;h++)i.setXYZ(h,0,0,0);const s=new Y,a=new Y,r=new Y,o=new Y,c=new Y,l=new Y,d=new Y,f=new Y;if(t)for(let h=0,u=t.count;h<u;h+=3){const g=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,m),d.subVectors(r,a),f.subVectors(s,a),d.cross(f),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),o.add(d),c.add(d),l.add(d),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,u=e.count;h<u;h+=3)s.fromBufferAttribute(e,h+0),a.fromBufferAttribute(e,h+1),r.fromBufferAttribute(e,h+2),d.subVectors(r,a),f.subVectors(s,a),d.cross(f),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,c){const l=o.array,d=o.itemSize,f=o.normalized,h=new l.constructor(c.length*d);let u=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?u=c[_]*o.data.stride+o.offset:u=c[_]*d;for(let p=0;p<d;p++)h[g++]=l[u++]}return new xn(h,d,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new je,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let d=0,f=l.length;d<f;d++){const h=l[d],u=t(h,i);c.push(u)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let f=0,h=l.length;f<h;f++){const u=l[f];d.push(u.toJSON(t.data))}d.length>0&&(s[c]=d,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const a=t.morphAttributes;for(const l in a){const d=[],f=a[l];for(let h=0,u=f.length;h<u;h++)d.push(f[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,d=r.length;l<d;l++){const f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ml=new me,ci=new oc,$s=new Ba,gl=new Y,Ys=new Y,Zs=new Y,qs=new Y,wr=new Y,js=new Y,_l=new Y,Ks=new Y;class pe extends be{constructor(t=new je,e=new En){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){js.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const d=o[c],f=a[c];d!==0&&(wr.fromBufferAttribute(f,t),r?js.addScaledVector(wr,d):js.addScaledVector(wr.sub(e),d))}e.add(js)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),$s.copy(i.boundingSphere),$s.applyMatrix4(a),ci.copy(t.ray).recast(t.near),!($s.containsPoint(ci.origin)===!1&&(ci.intersectSphere($s,gl)===null||ci.origin.distanceToSquared(gl)>(t.far-t.near)**2))&&(ml.copy(a).invert(),ci.copy(t.ray).applyMatrix4(ml),!(i.boundingBox!==null&&ci.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ci)))}_computeIntersections(t,e,i){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,d=a.attributes.uv1,f=a.attributes.normal,h=a.groups,u=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=r[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(o.count,Math.min(m.start+m.count,u.start+u.count));for(let y=x,L=v;y<L;y+=3){const C=o.getX(y),A=o.getX(y+1),T=o.getX(y+2);s=Js(this,p,t,i,l,d,f,C,A,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=o.getX(m),v=o.getX(m+1),y=o.getX(m+2);s=Js(this,r,t,i,l,d,f,x,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=r[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let y=x,L=v;y<L;y+=3){const C=y,A=y+1,T=y+2;s=Js(this,p,t,i,l,d,f,C,A,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),_=Math.min(c.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=m,v=m+1,y=m+2;s=Js(this,r,t,i,l,d,f,x,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Zp(n,t,e,i,s,a,r,o){let c;if(t.side===qe?c=i.intersectTriangle(r,a,s,!0,o):c=i.intersectTriangle(s,a,r,t.side===ei,o),c===null)return null;Ks.copy(o),Ks.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Ks);return l<e.near||l>e.far?null:{distance:l,point:Ks.clone(),object:n}}function Js(n,t,e,i,s,a,r,o,c,l){n.getVertexPosition(o,Ys),n.getVertexPosition(c,Zs),n.getVertexPosition(l,qs);const d=Zp(n,t,e,i,Ys,Zs,qs,_l);if(d){const f=new Y;Qe.getBarycoord(_l,Ys,Zs,qs,f),s&&(d.uv=Qe.getInterpolatedAttribute(s,o,c,l,f,new Zt)),a&&(d.uv1=Qe.getInterpolatedAttribute(a,o,c,l,f,new Zt)),r&&(d.normal=Qe.getInterpolatedAttribute(r,o,c,l,f,new Y),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:c,c:l,normal:new Y,materialIndex:0};Qe.getNormal(Ys,Zs,qs,h.normal),d.face=h,d.barycoord=f}return d}class Dn extends je{constructor(t=1,e=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],d=[],f=[];let h=0,u=0;g("z","y","x",-1,-1,i,e,t,r,a,0),g("z","y","x",1,-1,i,e,-t,r,a,1),g("x","z","y",1,1,t,i,e,s,r,2),g("x","z","y",1,-1,t,i,-e,s,r,3),g("x","y","z",1,-1,t,e,i,s,a,4),g("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new Ee(l,3)),this.setAttribute("normal",new Ee(d,3)),this.setAttribute("uv",new Ee(f,2));function g(_,m,p,x,v,y,L,C,A,T,b){const S=y/A,D=L/T,O=y/2,k=L/2,W=C/2,P=A+1,R=T+1;let X=0,U=0;const N=new Y;for(let tt=0;tt<R;tt++){const ht=tt*D-k;for(let nt=0;nt<P;nt++){const gt=nt*S-O;N[_]=gt*x,N[m]=ht*v,N[p]=W,l.push(N.x,N.y,N.z),N[_]=0,N[m]=0,N[p]=C>0?1:-1,d.push(N.x,N.y,N.z),f.push(nt/A),f.push(1-tt/T),X+=1}}for(let tt=0;tt<T;tt++)for(let ht=0;ht<A;ht++){const nt=h+ht+P*tt,gt=h+ht+P*(tt+1),j=h+(ht+1)+P*(tt+1),Q=h+(ht+1)+P*tt;c.push(nt,gt,Q),c.push(gt,j,Q),U+=6}o.addGroup(u,U,b),u+=U,h+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ss(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Ge(n){const t={};for(let e=0;e<n.length;e++){const i=ss(n[e]);for(const s in i)t[s]=i[s]}return t}function qp(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Fd(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const jp={clone:ss,merge:Ge};var Kp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Jp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ni extends Ei{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Kp,this.fragmentShader=Jp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ss(t.uniforms),this.uniformsGroups=qp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Nd extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new me,this.projectionMatrix=new me,this.projectionMatrixInverse=new me,this.coordinateSystem=Hn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qn=new Y,xl=new Zt,vl=new Zt;class rn extends Nd{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ho*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(va*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ho*2*Math.atan(Math.tan(va*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(qn.x,qn.y).multiplyScalar(-t/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(qn.x,qn.y).multiplyScalar(-t/qn.z)}getViewSize(t,e){return this.getViewBounds(t,xl,vl),e.subVectors(vl,xl)}setViewOffset(t,e,i,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(va*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*i/l,s*=r.width/c,i*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Hi=-90,Gi=1;class Qp extends be{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new rn(Hi,Gi,t,e);s.layers=this.layers,this.add(s);const a=new rn(Hi,Gi,t,e);a.layers=this.layers,this.add(a);const r=new rn(Hi,Gi,t,e);r.layers=this.layers,this.add(r);const o=new rn(Hi,Gi,t,e);o.layers=this.layers,this.add(o);const c=new rn(Hi,Gi,t,e);c.layers=this.layers,this.add(c);const l=new rn(Hi,Gi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===Hn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Da)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,d]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,r),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,d),t.setRenderTarget(f,h,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class zd extends We{constructor(t,e,i,s,a,r,o,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:ts,super(t,e,i,s,a,r,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class tm extends bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new zd(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:An}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Dn(5,5,5),a=new ni({name:"CubemapFromEquirect",uniforms:ss(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:qe,blending:Jn});a.uniforms.tEquirect.value=e;const r=new pe(s,a),o=e.minFilter;return e.minFilter===vi&&(e.minFilter=An),new Qp(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,i,s);t.setRenderTarget(a)}}const Tr=new Y,em=new Y,nm=new qt;class fi{constructor(t=new Y(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Tr.subVectors(i,e).cross(em.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Tr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||nm.getNormalMatrix(t),s=this.coplanarPoint(Tr).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new Ba,Qs=new Y;class lc{constructor(t=new fi,e=new fi,i=new fi,s=new fi,a=new fi,r=new fi){this.planes=[t,e,i,s,a,r]}set(t,e,i,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Hn){const i=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],d=s[5],f=s[6],h=s[7],u=s[8],g=s[9],_=s[10],m=s[11],p=s[12],x=s[13],v=s[14],y=s[15];if(i[0].setComponents(c-a,h-l,m-u,y-p).normalize(),i[1].setComponents(c+a,h+l,m+u,y+p).normalize(),i[2].setComponents(c+r,h+d,m+g,y+x).normalize(),i[3].setComponents(c-r,h-d,m-g,y-x).normalize(),i[4].setComponents(c-o,h-f,m-_,y-v).normalize(),e===Hn)i[5].setComponents(c+o,h+f,m+_,y+v).normalize();else if(e===Da)i[5].setComponents(o,f,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(t){return li.center.set(0,0,0),li.radius=.7071067811865476,li.applyMatrix4(t.matrixWorld),this.intersectsSphere(li)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Qs.x=s.normal.x>0?t.max.x:t.min.x,Qs.y=s.normal.y>0?t.max.y:t.min.y,Qs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Qs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Od(){let n=null,t=!1,e=null,i=null;function s(a,r){e(a,r),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function im(n){const t=new WeakMap;function e(o,c){const l=o.array,d=o.usage,f=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),o.onUploadCallback();let u;if(l instanceof Float32Array)u=n.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=n.SHORT;else if(l instanceof Uint32Array)u=n.UNSIGNED_INT;else if(l instanceof Int32Array)u=n.INT;else if(l instanceof Int8Array)u=n.BYTE;else if(l instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,c,l){const d=c.array,f=c.updateRanges;if(n.bindBuffer(l,o),f.length===0)n.bufferSubData(l,0,d);else{f.sort((u,g)=>u.start-g.start);let h=0;for(let u=1;u<f.length;u++){const g=f[h],_=f[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let u=0,g=f.length;u<g;u++){const _=f[u];n.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class Ha extends je{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,d=c+1,f=t/o,h=e/c,u=[],g=[],_=[],m=[];for(let p=0;p<d;p++){const x=p*h-r;for(let v=0;v<l;v++){const y=v*f-a;g.push(y,-x,0),_.push(0,0,1),m.push(v/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<o;x++){const v=x+l*p,y=x+l*(p+1),L=x+1+l*(p+1),C=x+1+l*p;u.push(v,y,C),u.push(y,L,C)}this.setIndex(u),this.setAttribute("position",new Ee(g,3)),this.setAttribute("normal",new Ee(_,3)),this.setAttribute("uv",new Ee(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ha(t.width,t.height,t.widthSegments,t.heightSegments)}}var sm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,am=`#ifdef USE_ALPHAHASH
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
#endif`,rm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,om=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,lm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,dm=`#ifdef USE_AOMAP
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
#endif`,hm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,um=`#ifdef USE_BATCHING
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
#endif`,fm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,pm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,mm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,gm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_m=`#ifdef USE_IRIDESCENCE
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
#endif`,xm=`#ifdef USE_BUMPMAP
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
#endif`,vm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ym=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Sm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,bm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Em=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,wm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Tm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Am=`#define PI 3.141592653589793
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
} // validated`,Rm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Cm=`vec3 transformedNormal = objectNormal;
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
#endif`,Pm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Im=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,km="gl_FragColor = linearToOutputTexel( gl_FragColor );",Um=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fm=`#ifdef USE_ENVMAP
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
#endif`,Nm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,zm=`#ifdef USE_ENVMAP
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
#endif`,Om=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Bm=`#ifdef USE_ENVMAP
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
#endif`,Hm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Vm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Wm=`#ifdef USE_GRADIENTMAP
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
}`,$m=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ym=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qm=`uniform bool receiveShadow;
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
#endif`,jm=`#ifdef USE_ENVMAP
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
#endif`,Km=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Jm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Qm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,tg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,eg=`PhysicalMaterial material;
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
#endif`,ng=`struct PhysicalMaterial {
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
}`,ig=`
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
#endif`,sg=`#if defined( RE_IndirectDiffuse )
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
#endif`,ag=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,rg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,og=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ug=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,fg=`#if defined( USE_POINTS_UV )
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
#endif`,pg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,mg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,gg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_g=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vg=`#ifdef USE_MORPHTARGETS
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
#endif`,Mg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Sg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,bg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Eg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Tg=`#ifdef USE_NORMALMAP
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
#endif`,Ag=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Rg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Pg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ig=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,kg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ug=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Fg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ng=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Og=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Bg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Hg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Gg=`float getShadowMask() {
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
}`,Vg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Xg=`#ifdef USE_SKINNING
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
#endif`,Wg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$g=`#ifdef USE_SKINNING
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
#endif`,Yg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Zg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,qg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,jg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Kg=`#ifdef USE_TRANSMISSION
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
#endif`,Jg=`#ifdef USE_TRANSMISSION
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
#endif`,Qg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,t0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,e0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,n0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const i0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,s0=`uniform sampler2D t2D;
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
}`,a0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,o0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,c0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l0=`#include <common>
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
}`,d0=`#if DEPTH_PACKING == 3200
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
}`,h0=`#define DISTANCE
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
}`,u0=`#define DISTANCE
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
}`,f0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,p0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,m0=`uniform float scale;
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
}`,g0=`uniform vec3 diffuse;
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
}`,_0=`#include <common>
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
}`,x0=`uniform vec3 diffuse;
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
}`,v0=`#define LAMBERT
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
}`,M0=`#define LAMBERT
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
}`,y0=`#define MATCAP
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
}`,S0=`#define MATCAP
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
}`,b0=`#define NORMAL
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
}`,E0=`#define NORMAL
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
}`,w0=`#define PHONG
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
}`,T0=`#define PHONG
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
}`,A0=`#define STANDARD
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
}`,R0=`#define STANDARD
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
}`,C0=`#define TOON
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
}`,P0=`#define TOON
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
}`,D0=`uniform float size;
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
}`,L0=`uniform vec3 diffuse;
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
}`,I0=`#include <common>
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
}`,k0=`uniform vec3 color;
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
}`,U0=`uniform float rotation;
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
}`,F0=`uniform vec3 diffuse;
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
}`,jt={alphahash_fragment:sm,alphahash_pars_fragment:am,alphamap_fragment:rm,alphamap_pars_fragment:om,alphatest_fragment:cm,alphatest_pars_fragment:lm,aomap_fragment:dm,aomap_pars_fragment:hm,batching_pars_vertex:um,batching_vertex:fm,begin_vertex:pm,beginnormal_vertex:mm,bsdfs:gm,iridescence_fragment:_m,bumpmap_pars_fragment:xm,clipping_planes_fragment:vm,clipping_planes_pars_fragment:Mm,clipping_planes_pars_vertex:ym,clipping_planes_vertex:Sm,color_fragment:bm,color_pars_fragment:Em,color_pars_vertex:wm,color_vertex:Tm,common:Am,cube_uv_reflection_fragment:Rm,defaultnormal_vertex:Cm,displacementmap_pars_vertex:Pm,displacementmap_vertex:Dm,emissivemap_fragment:Lm,emissivemap_pars_fragment:Im,colorspace_fragment:km,colorspace_pars_fragment:Um,envmap_fragment:Fm,envmap_common_pars_fragment:Nm,envmap_pars_fragment:zm,envmap_pars_vertex:Om,envmap_physical_pars_fragment:jm,envmap_vertex:Bm,fog_vertex:Hm,fog_pars_vertex:Gm,fog_fragment:Vm,fog_pars_fragment:Xm,gradientmap_pars_fragment:Wm,lightmap_pars_fragment:$m,lights_lambert_fragment:Ym,lights_lambert_pars_fragment:Zm,lights_pars_begin:qm,lights_toon_fragment:Km,lights_toon_pars_fragment:Jm,lights_phong_fragment:Qm,lights_phong_pars_fragment:tg,lights_physical_fragment:eg,lights_physical_pars_fragment:ng,lights_fragment_begin:ig,lights_fragment_maps:sg,lights_fragment_end:ag,logdepthbuf_fragment:rg,logdepthbuf_pars_fragment:og,logdepthbuf_pars_vertex:cg,logdepthbuf_vertex:lg,map_fragment:dg,map_pars_fragment:hg,map_particle_fragment:ug,map_particle_pars_fragment:fg,metalnessmap_fragment:pg,metalnessmap_pars_fragment:mg,morphinstance_vertex:gg,morphcolor_vertex:_g,morphnormal_vertex:xg,morphtarget_pars_vertex:vg,morphtarget_vertex:Mg,normal_fragment_begin:yg,normal_fragment_maps:Sg,normal_pars_fragment:bg,normal_pars_vertex:Eg,normal_vertex:wg,normalmap_pars_fragment:Tg,clearcoat_normal_fragment_begin:Ag,clearcoat_normal_fragment_maps:Rg,clearcoat_pars_fragment:Cg,iridescence_pars_fragment:Pg,opaque_fragment:Dg,packing:Lg,premultiplied_alpha_fragment:Ig,project_vertex:kg,dithering_fragment:Ug,dithering_pars_fragment:Fg,roughnessmap_fragment:Ng,roughnessmap_pars_fragment:zg,shadowmap_pars_fragment:Og,shadowmap_pars_vertex:Bg,shadowmap_vertex:Hg,shadowmask_pars_fragment:Gg,skinbase_vertex:Vg,skinning_pars_vertex:Xg,skinning_vertex:Wg,skinnormal_vertex:$g,specularmap_fragment:Yg,specularmap_pars_fragment:Zg,tonemapping_fragment:qg,tonemapping_pars_fragment:jg,transmission_fragment:Kg,transmission_pars_fragment:Jg,uv_pars_fragment:Qg,uv_pars_vertex:t0,uv_vertex:e0,worldpos_vertex:n0,background_vert:i0,background_frag:s0,backgroundCube_vert:a0,backgroundCube_frag:r0,cube_vert:o0,cube_frag:c0,depth_vert:l0,depth_frag:d0,distanceRGBA_vert:h0,distanceRGBA_frag:u0,equirect_vert:f0,equirect_frag:p0,linedashed_vert:m0,linedashed_frag:g0,meshbasic_vert:_0,meshbasic_frag:x0,meshlambert_vert:v0,meshlambert_frag:M0,meshmatcap_vert:y0,meshmatcap_frag:S0,meshnormal_vert:b0,meshnormal_frag:E0,meshphong_vert:w0,meshphong_frag:T0,meshphysical_vert:A0,meshphysical_frag:R0,meshtoon_vert:C0,meshtoon_frag:P0,points_vert:D0,points_frag:L0,shadow_vert:I0,shadow_frag:k0,sprite_vert:U0,sprite_frag:F0},Dt={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},envMapRotation:{value:new qt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new Zt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new Zt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},wn={basic:{uniforms:Ge([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:Ge([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:Ge([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:Ge([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:Ge([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new Yt(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:Ge([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:Ge([Dt.points,Dt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:Ge([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:Ge([Dt.common,Dt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:Ge([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:Ge([Dt.sprite,Dt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qt}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distanceRGBA:{uniforms:Ge([Dt.common,Dt.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distanceRGBA_vert,fragmentShader:jt.distanceRGBA_frag},shadow:{uniforms:Ge([Dt.lights,Dt.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};wn.physical={uniforms:Ge([wn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new Zt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new Zt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new Zt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};const ta={r:0,b:0,g:0},di=new Pn,N0=new me;function z0(n,t,e,i,s,a,r){const o=new Yt(0);let c=a===!0?0:1,l,d,f=null,h=0,u=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?e:t).get(v)),v}function _(x){let v=!1;const y=g(x);y===null?p(o,c):y&&y.isColor&&(p(y,1),v=!0);const L=n.xr.getEnvironmentBlendMode();L==="additive"?i.buffers.color.setClear(0,0,0,1,r):L==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,v){const y=g(v);y&&(y.isCubeTexture||y.mapping===za)?(d===void 0&&(d=new pe(new Dn(1,1,1),new ni({name:"BackgroundCubeMaterial",uniforms:ss(wn.backgroundCube.uniforms),vertexShader:wn.backgroundCube.vertexShader,fragmentShader:wn.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(L,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),di.copy(v.backgroundRotation),di.x*=-1,di.y*=-1,di.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(N0.makeRotationFromEuler(di)),d.material.toneMapped=re.getTransfer(y.colorSpace)!==ce,(f!==y||h!==y.version||u!==n.toneMapping)&&(d.material.needsUpdate=!0,f=y,h=y.version,u=n.toneMapping),d.layers.enableAll(),x.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new pe(new Ha(2,2),new ni({name:"BackgroundMaterial",uniforms:ss(wn.background.uniforms),vertexShader:wn.background.vertexShader,fragmentShader:wn.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=re.getTransfer(y.colorSpace)!==ce,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||h!==y.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=y,h=y.version,u=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,v){x.getRGB(ta,Fd(n)),i.buffers.color.setClear(ta.r,ta.g,ta.b,v,r)}return{getClearColor:function(){return o},setClearColor:function(x,v=1){o.set(x),c=v,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(o,c)},render:_,addToRenderList:m}}function O0(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let a=s,r=!1;function o(S,D,O,k,W){let P=!1;const R=f(k,O,D);a!==R&&(a=R,l(a.object)),P=u(S,k,O,W),P&&g(S,k,O,W),W!==null&&t.update(W,n.ELEMENT_ARRAY_BUFFER),(P||r)&&(r=!1,y(S,D,O,k),W!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function c(){return n.createVertexArray()}function l(S){return n.bindVertexArray(S)}function d(S){return n.deleteVertexArray(S)}function f(S,D,O){const k=O.wireframe===!0;let W=i[S.id];W===void 0&&(W={},i[S.id]=W);let P=W[D.id];P===void 0&&(P={},W[D.id]=P);let R=P[k];return R===void 0&&(R=h(c()),P[k]=R),R}function h(S){const D=[],O=[],k=[];for(let W=0;W<e;W++)D[W]=0,O[W]=0,k[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:O,attributeDivisors:k,object:S,attributes:{},index:null}}function u(S,D,O,k){const W=a.attributes,P=D.attributes;let R=0;const X=O.getAttributes();for(const U in X)if(X[U].location>=0){const tt=W[U];let ht=P[U];if(ht===void 0&&(U==="instanceMatrix"&&S.instanceMatrix&&(ht=S.instanceMatrix),U==="instanceColor"&&S.instanceColor&&(ht=S.instanceColor)),tt===void 0||tt.attribute!==ht||ht&&tt.data!==ht.data)return!0;R++}return a.attributesNum!==R||a.index!==k}function g(S,D,O,k){const W={},P=D.attributes;let R=0;const X=O.getAttributes();for(const U in X)if(X[U].location>=0){let tt=P[U];tt===void 0&&(U==="instanceMatrix"&&S.instanceMatrix&&(tt=S.instanceMatrix),U==="instanceColor"&&S.instanceColor&&(tt=S.instanceColor));const ht={};ht.attribute=tt,tt&&tt.data&&(ht.data=tt.data),W[U]=ht,R++}a.attributes=W,a.attributesNum=R,a.index=k}function _(){const S=a.newAttributes;for(let D=0,O=S.length;D<O;D++)S[D]=0}function m(S){p(S,0)}function p(S,D){const O=a.newAttributes,k=a.enabledAttributes,W=a.attributeDivisors;O[S]=1,k[S]===0&&(n.enableVertexAttribArray(S),k[S]=1),W[S]!==D&&(n.vertexAttribDivisor(S,D),W[S]=D)}function x(){const S=a.newAttributes,D=a.enabledAttributes;for(let O=0,k=D.length;O<k;O++)D[O]!==S[O]&&(n.disableVertexAttribArray(O),D[O]=0)}function v(S,D,O,k,W,P,R){R===!0?n.vertexAttribIPointer(S,D,O,W,P):n.vertexAttribPointer(S,D,O,k,W,P)}function y(S,D,O,k){_();const W=k.attributes,P=O.getAttributes(),R=D.defaultAttributeValues;for(const X in P){const U=P[X];if(U.location>=0){let N=W[X];if(N===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(N=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(N=S.instanceColor)),N!==void 0){const tt=N.normalized,ht=N.itemSize,nt=t.get(N);if(nt===void 0)continue;const gt=nt.buffer,j=nt.type,Q=nt.bytesPerElement,pt=j===n.INT||j===n.UNSIGNED_INT||N.gpuType===ec;if(N.isInterleavedBufferAttribute){const K=N.data,mt=K.stride,wt=N.offset;if(K.isInstancedInterleavedBuffer){for(let Ct=0;Ct<U.locationSize;Ct++)p(U.location+Ct,K.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Ct=0;Ct<U.locationSize;Ct++)m(U.location+Ct);n.bindBuffer(n.ARRAY_BUFFER,gt);for(let Ct=0;Ct<U.locationSize;Ct++)v(U.location+Ct,ht/U.locationSize,j,tt,mt*Q,(wt+ht/U.locationSize*Ct)*Q,pt)}else{if(N.isInstancedBufferAttribute){for(let K=0;K<U.locationSize;K++)p(U.location+K,N.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=N.meshPerAttribute*N.count)}else for(let K=0;K<U.locationSize;K++)m(U.location+K);n.bindBuffer(n.ARRAY_BUFFER,gt);for(let K=0;K<U.locationSize;K++)v(U.location+K,ht/U.locationSize,j,tt,ht*Q,ht/U.locationSize*K*Q,pt)}}else if(R!==void 0){const tt=R[X];if(tt!==void 0)switch(tt.length){case 2:n.vertexAttrib2fv(U.location,tt);break;case 3:n.vertexAttrib3fv(U.location,tt);break;case 4:n.vertexAttrib4fv(U.location,tt);break;default:n.vertexAttrib1fv(U.location,tt)}}}}x()}function L(){T();for(const S in i){const D=i[S];for(const O in D){const k=D[O];for(const W in k)d(k[W].object),delete k[W];delete D[O]}delete i[S]}}function C(S){if(i[S.id]===void 0)return;const D=i[S.id];for(const O in D){const k=D[O];for(const W in k)d(k[W].object),delete k[W];delete D[O]}delete i[S.id]}function A(S){for(const D in i){const O=i[D];if(O[S.id]===void 0)continue;const k=O[S.id];for(const W in k)d(k[W].object),delete k[W];delete O[S.id]}}function T(){b(),r=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:b,dispose:L,releaseStatesOfGeometry:C,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function B0(n,t,e){let i;function s(l){i=l}function a(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function r(l,d,f){f!==0&&(n.drawArraysInstanced(i,l,d,f),e.update(d,i,f))}function o(l,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,f);let u=0;for(let g=0;g<f;g++)u+=d[g];e.update(u,i,1)}function c(l,d,f,h){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)r(l[g],d[g],h[g]);else{u.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=d[_]*h[_];e.update(g,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function H0(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==gn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const T=A===As&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Vn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Bn&&!T)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const f=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,C=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:h,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:L,maxSamples:C}}function G0(n){const t=this;let e=null,i=0,s=!1,a=!1;const r=new fi,o=new qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const u=f.length!==0||h||i!==0||s;return s=h,i=f.length,u},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,h){e=d(f,h,0)},this.setState=function(f,h,u){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!s||g===null||g.length===0||a&&!m)a?d(null):l();else{const x=a?0:i,v=x*4;let y=p.clippingState||null;c.value=y,y=d(g,h,v,u);for(let L=0;L!==v;++L)y[L]=e[L];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(f,h,u,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=u+_*4,x=h.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,y=u;v!==_;++v,y+=4)r.copy(f[v]).applyMatrix4(x,o),r.normal.toArray(m,y),m[y+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function V0(n){let t=new WeakMap;function e(r,o){return o===lo?r.mapping=ts:o===ho&&(r.mapping=es),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===lo||o===ho)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new tm(c.height);return l.fromEquirectangularTexture(n,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class Bd extends Nd{constructor(t=-1,e=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,r=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Zi=4,Ml=[.125,.215,.35,.446,.526,.582],_i=20,Ar=new Bd,yl=new Yt;let Rr=null,Cr=0,Pr=0,Dr=!1;const pi=(1+Math.sqrt(5))/2,Vi=1/pi,Sl=[new Y(-pi,Vi,0),new Y(pi,Vi,0),new Y(-Vi,0,pi),new Y(Vi,0,pi),new Y(0,pi,-Vi),new Y(0,pi,Vi),new Y(-1,1,-1),new Y(1,1,-1),new Y(-1,1,1),new Y(1,1,1)];class bl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Rr=this._renderer.getRenderTarget(),Cr=this._renderer.getActiveCubeFace(),Pr=this._renderer.getActiveMipmapLevel(),Dr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Rr,Cr,Pr),this._renderer.xr.enabled=Dr,t.scissorTest=!1,ea(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ts||t.mapping===es?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Rr=this._renderer.getRenderTarget(),Cr=this._renderer.getActiveCubeFace(),Pr=this._renderer.getActiveMipmapLevel(),Dr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:An,minFilter:An,generateMipmaps:!1,type:As,format:gn,colorSpace:as,depthBuffer:!1},s=El(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=El(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=X0(a)),this._blurMaterial=W0(a,t,e)}return s}_compileMaterial(t){const e=new pe(this._lodPlanes[0],t);this._renderer.compile(e,Ar)}_sceneToCubeUV(t,e,i,s){const o=new rn(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(yl),d.toneMapping=Qn,d.autoClear=!1;const u=new En({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1}),g=new pe(new Dn,u);let _=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,_=!0):(u.color.copy(yl),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):x===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const v=this._cubeSize;ea(s,x*v,p>2?v:0,v,v),d.setRenderTarget(s),_&&d.render(g,o),d.render(t,o)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===ts||t.mapping===es;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wl());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new pe(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;ea(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(r,Ar)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Sl[(s-a-1)%Sl.length];this._blur(t,a-1,a,r,o)}e.autoClear=i}_blur(t,e,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,i,s,"latitudinal",a),this._halfBlur(r,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,f=new pe(this._lodPlanes[s],l),h=l.uniforms,u=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*_i-1),_=a/g,m=isFinite(a)?1+Math.floor(d*_):_i;m>_i&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_i}`);const p=[];let x=0;for(let A=0;A<_i;++A){const T=A/_,b=Math.exp(-T*T/2);p.push(b),A===0?x+=b:A<m&&(x+=2*b)}for(let A=0;A<p.length;A++)p[A]=p[A]/x;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=r==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:v}=this;h.dTheta.value=g,h.mipInt.value=v-i;const y=this._sizeLods[s],L=3*y*(s>v-Zi?s-v+Zi:0),C=4*(this._cubeSize-y);ea(e,L,C,3*y,2*y),c.setRenderTarget(e),c.render(f,Ar)}}function X0(n){const t=[],e=[],i=[];let s=n;const a=n-Zi+1+Ml.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>n-Zi?c=Ml[r-n+Zi-1]:r===0&&(c=0),i.push(c);const l=1/(o-2),d=-l,f=1+l,h=[d,d,f,d,f,f,d,d,f,f,d,f],u=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*u),v=new Float32Array(m*g*u),y=new Float32Array(p*g*u);for(let C=0;C<u;C++){const A=C%3*2/3-1,T=C>2?0:-1,b=[A,T,0,A+2/3,T,0,A+2/3,T+1,0,A,T,0,A+2/3,T+1,0,A,T+1,0];x.set(b,_*g*C),v.set(h,m*g*C);const S=[C,C,C,C,C,C];y.set(S,p*g*C)}const L=new je;L.setAttribute("position",new xn(x,_)),L.setAttribute("uv",new xn(v,m)),L.setAttribute("faceIndex",new xn(y,p)),t.push(L),s>Zi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function El(n,t,e){const i=new bi(n,t,e);return i.texture.mapping=za,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ea(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function W0(n,t,e){const i=new Float32Array(_i),s=new Y(0,1,0);return new ni({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:dc(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function wl(){return new ni({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:dc(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function Tl(){return new ni({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:dc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function dc(){return`

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
	`}function $0(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===lo||c===ho,d=c===ts||c===es;if(l||d){let f=t.get(o);const h=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return e===null&&(e=new bl(n)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const u=o.image;return l&&u&&u.height>0||d&&u&&s(u)?(e===null&&(e=new bl(n)),f=l?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:r}}function Y0(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&vs("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Z0(n,t,e,i){const s={},a=new WeakMap;function r(f){const h=f.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}h.removeEventListener("dispose",r),delete s[h.id];const u=a.get(h);u&&(t.remove(u),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,e.memory.geometries++),h}function c(f){const h=f.attributes;for(const g in h)t.update(h[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const _=u[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],n.ARRAY_BUFFER)}}function l(f){const h=[],u=f.index,g=f.attributes.position;let _=0;if(u!==null){const x=u.array;_=u.version;for(let v=0,y=x.length;v<y;v+=3){const L=x[v+0],C=x[v+1],A=x[v+2];h.push(L,C,C,A,A,L)}}else if(g!==void 0){const x=g.array;_=g.version;for(let v=0,y=x.length/3-1;v<y;v+=3){const L=v+0,C=v+1,A=v+2;h.push(L,C,C,A,A,L)}}else return;const m=new(Pd(h)?Ud:kd)(h,1);m.version=_;const p=a.get(f);p&&t.remove(p),a.set(f,m)}function d(f){const h=a.get(f);if(h){const u=f.index;u!==null&&h.version<u.version&&l(f)}else l(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:d}}function q0(n,t,e){let i;function s(h){i=h}let a,r;function o(h){a=h.type,r=h.bytesPerElement}function c(h,u){n.drawElements(i,u,a,h*r),e.update(u,i,1)}function l(h,u,g){g!==0&&(n.drawElementsInstanced(i,u,a,h*r,g),e.update(u,i,g))}function d(h,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,h,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(h,u,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)l(h[p]/r,u[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,a,h,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=u[x]*_[x];e.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function j0(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(e.calls++,r){case n.TRIANGLES:e.triangles+=o*(a/3);break;case n.LINES:e.lines+=o*(a/2);break;case n.LINE_STRIP:e.lines+=o*(a-1);break;case n.LINE_LOOP:e.lines+=o*a;break;case n.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function K0(n,t,e){const i=new WeakMap,s=new Se;function a(r,o,c){const l=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==f){let S=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",S)};var u=S;h!==void 0&&h.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),_===!0&&(y=2),m===!0&&(y=3);let L=o.attributes.position.count*y,C=1;L>t.maxTextureSize&&(C=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const A=new Float32Array(L*C*4*f),T=new Ld(A,L,C,f);T.type=Bn,T.needsUpdate=!0;const b=y*4;for(let D=0;D<f;D++){const O=p[D],k=x[D],W=v[D],P=L*C*4*D;for(let R=0;R<O.count;R++){const X=R*b;g===!0&&(s.fromBufferAttribute(O,R),A[P+X+0]=s.x,A[P+X+1]=s.y,A[P+X+2]=s.z,A[P+X+3]=0),_===!0&&(s.fromBufferAttribute(k,R),A[P+X+4]=s.x,A[P+X+5]=s.y,A[P+X+6]=s.z,A[P+X+7]=0),m===!0&&(s.fromBufferAttribute(W,R),A[P+X+8]=s.x,A[P+X+9]=s.y,A[P+X+10]=s.z,A[P+X+11]=W.itemSize===4?s.w:1)}}h={count:f,texture:T,size:new Zt(L,C)},i.set(o,h),o.addEventListener("dispose",S)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:a}}function J0(n,t,e,i){let s=new WeakMap;function a(c){const l=i.render.frame,d=c.geometry,f=t.get(c,d);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;s.get(h)!==l&&(h.update(),s.set(h,l))}return f}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class Hd extends We{constructor(t,e,i,s,a,r,o,c,l,d=Ki){if(d!==Ki&&d!==is)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Ki&&(i=Si),i===void 0&&d===is&&(i=ns),super(null,s,a,r,o,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:_n,this.minFilter=c!==void 0?c:_n,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Gd=new We,Al=new Hd(1,1),Vd=new Ld,Xd=new zp,Wd=new zd,Rl=[],Cl=[],Pl=new Float32Array(16),Dl=new Float32Array(9),Ll=new Float32Array(4);function os(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=Rl[s];if(a===void 0&&(a=new Float32Array(s),Rl[s]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,n[r].toArray(a,o)}return a}function Re(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ce(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Ga(n,t){let e=Cl[t];e===void 0&&(e=new Int32Array(t),Cl[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Q0(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function t_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2fv(this.addr,t),Ce(e,t)}}function e_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;n.uniform3fv(this.addr,t),Ce(e,t)}}function n_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4fv(this.addr,t),Ce(e,t)}}function i_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,i))return;Ll.set(i),n.uniformMatrix2fv(this.addr,!1,Ll),Ce(e,i)}}function s_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,i))return;Dl.set(i),n.uniformMatrix3fv(this.addr,!1,Dl),Ce(e,i)}}function a_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,i))return;Pl.set(i),n.uniformMatrix4fv(this.addr,!1,Pl),Ce(e,i)}}function r_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function o_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2iv(this.addr,t),Ce(e,t)}}function c_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;n.uniform3iv(this.addr,t),Ce(e,t)}}function l_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4iv(this.addr,t),Ce(e,t)}}function d_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function h_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2uiv(this.addr,t),Ce(e,t)}}function u_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;n.uniform3uiv(this.addr,t),Ce(e,t)}}function f_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4uiv(this.addr,t),Ce(e,t)}}function p_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Al.compareFunction=Cd,a=Al):a=Gd,e.setTexture2D(t||a,s)}function m_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Xd,s)}function g_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Wd,s)}function __(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Vd,s)}function x_(n){switch(n){case 5126:return Q0;case 35664:return t_;case 35665:return e_;case 35666:return n_;case 35674:return i_;case 35675:return s_;case 35676:return a_;case 5124:case 35670:return r_;case 35667:case 35671:return o_;case 35668:case 35672:return c_;case 35669:case 35673:return l_;case 5125:return d_;case 36294:return h_;case 36295:return u_;case 36296:return f_;case 35678:case 36198:case 36298:case 36306:case 35682:return p_;case 35679:case 36299:case 36307:return m_;case 35680:case 36300:case 36308:case 36293:return g_;case 36289:case 36303:case 36311:case 36292:return __}}function v_(n,t){n.uniform1fv(this.addr,t)}function M_(n,t){const e=os(t,this.size,2);n.uniform2fv(this.addr,e)}function y_(n,t){const e=os(t,this.size,3);n.uniform3fv(this.addr,e)}function S_(n,t){const e=os(t,this.size,4);n.uniform4fv(this.addr,e)}function b_(n,t){const e=os(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function E_(n,t){const e=os(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function w_(n,t){const e=os(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function T_(n,t){n.uniform1iv(this.addr,t)}function A_(n,t){n.uniform2iv(this.addr,t)}function R_(n,t){n.uniform3iv(this.addr,t)}function C_(n,t){n.uniform4iv(this.addr,t)}function P_(n,t){n.uniform1uiv(this.addr,t)}function D_(n,t){n.uniform2uiv(this.addr,t)}function L_(n,t){n.uniform3uiv(this.addr,t)}function I_(n,t){n.uniform4uiv(this.addr,t)}function k_(n,t,e){const i=this.cache,s=t.length,a=Ga(e,s);Re(i,a)||(n.uniform1iv(this.addr,a),Ce(i,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||Gd,a[r])}function U_(n,t,e){const i=this.cache,s=t.length,a=Ga(e,s);Re(i,a)||(n.uniform1iv(this.addr,a),Ce(i,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||Xd,a[r])}function F_(n,t,e){const i=this.cache,s=t.length,a=Ga(e,s);Re(i,a)||(n.uniform1iv(this.addr,a),Ce(i,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||Wd,a[r])}function N_(n,t,e){const i=this.cache,s=t.length,a=Ga(e,s);Re(i,a)||(n.uniform1iv(this.addr,a),Ce(i,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||Vd,a[r])}function z_(n){switch(n){case 5126:return v_;case 35664:return M_;case 35665:return y_;case 35666:return S_;case 35674:return b_;case 35675:return E_;case 35676:return w_;case 5124:case 35670:return T_;case 35667:case 35671:return A_;case 35668:case 35672:return R_;case 35669:case 35673:return C_;case 5125:return P_;case 36294:return D_;case 36295:return L_;case 36296:return I_;case 35678:case 36198:case 36298:case 36306:case 35682:return k_;case 35679:case 36299:case 36307:return U_;case 35680:case 36300:case 36308:case 36293:return F_;case 36289:case 36303:case 36311:case 36292:return N_}}class O_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=x_(e.type)}}class B_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=z_(e.type)}}class H_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],i)}}}const Lr=/(\w+)(\])?(\[|\.)?/g;function Il(n,t){n.seq.push(t),n.map[t.id]=t}function G_(n,t,e){const i=n.name,s=i.length;for(Lr.lastIndex=0;;){const a=Lr.exec(i),r=Lr.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Il(e,l===void 0?new O_(o,n,t):new B_(o,n,t));break}else{let f=e.map[o];f===void 0&&(f=new H_(o),Il(e,f)),e=f}}}class Ma{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);G_(a,r,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&i.push(r)}return i}}function kl(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const V_=37297;let X_=0;function W_(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return i.join(`
`)}const Ul=new qt;function $_(n){re._getMatrix(Ul,re.workingColorSpace,n);const t=`mat3( ${Ul.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(n)){case Oa:return[t,"LinearTransferOETF"];case ce:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Fl(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+W_(n.getShaderSource(t),r)}else return s}function Y_(n,t){const e=$_(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Z_(n,t){let e;switch(t){case hp:e="Linear";break;case up:e="Reinhard";break;case fp:e="Cineon";break;case pp:e="ACESFilmic";break;case gp:e="AgX";break;case _p:e="Neutral";break;case mp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const na=new Y;function q_(){re.getLuminanceCoefficients(na);const n=na.x.toFixed(4),t=na.y.toFixed(4),e=na.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function j_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ms).join(`
`)}function K_(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function J_(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:n.getAttribLocation(t,r),locationSize:o}}return e}function Ms(n){return n!==""}function Nl(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function zl(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Q_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Go(n){return n.replace(Q_,ex)}const tx=new Map;function ex(n,t){let e=jt[t];if(e===void 0){const i=tx.get(t);if(i!==void 0)e=jt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Go(e)}const nx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ol(n){return n.replace(nx,ix)}function ix(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Bl(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function sx(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===md?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===gd?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===zn&&(t="SHADOWMAP_TYPE_VSM"),t}function ax(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ts:case es:t="ENVMAP_TYPE_CUBE";break;case za:t="ENVMAP_TYPE_CUBE_UV";break}return t}function rx(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case es:t="ENVMAP_MODE_REFRACTION";break}return t}function ox(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case tc:t="ENVMAP_BLENDING_MULTIPLY";break;case lp:t="ENVMAP_BLENDING_MIX";break;case dp:t="ENVMAP_BLENDING_ADD";break}return t}function cx(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function lx(n,t,e,i){const s=n.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=sx(e),l=ax(e),d=rx(e),f=ox(e),h=cx(e),u=j_(e),g=K_(a),_=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),p.length>0&&(p+=`
`)):(m=[Bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),p=[Bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Qn?"#define TONE_MAPPING":"",e.toneMapping!==Qn?jt.tonemapping_pars_fragment:"",e.toneMapping!==Qn?Z_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,Y_("linearToOutputTexel",e.outputColorSpace),q_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ms).join(`
`)),r=Go(r),r=Nl(r,e),r=zl(r,e),o=Go(o),o=Nl(o,e),o=zl(o,e),r=Ol(r),o=Ol(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Qc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Qc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=x+m+r,y=x+p+o,L=kl(s,s.VERTEX_SHADER,v),C=kl(s,s.FRAGMENT_SHADER,y);s.attachShader(_,L),s.attachShader(_,C),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(D){if(n.debug.checkShaderErrors){const O=s.getProgramInfoLog(_).trim(),k=s.getShaderInfoLog(L).trim(),W=s.getShaderInfoLog(C).trim();let P=!0,R=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(P=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,L,C);else{const X=Fl(s,L,"vertex"),U=Fl(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+O+`
`+X+`
`+U)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(k===""||W==="")&&(R=!1);R&&(D.diagnostics={runnable:P,programLog:O,vertexShader:{log:k,prefix:m},fragmentShader:{log:W,prefix:p}})}s.deleteShader(L),s.deleteShader(C),T=new Ma(s,_),b=J_(s,_)}let T;this.getUniforms=function(){return T===void 0&&A(this),T};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,V_)),S},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=X_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=C,this}let dx=0;class hx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new ux(t),e.set(t,i)),i}}class ux{constructor(t){this.id=dx++,this.code=t,this.usedTimes=0}}function fx(n,t,e,i,s,a,r){const o=new cc,c=new hx,l=new Set,d=[],f=s.logarithmicDepthBuffer,h=s.vertexTextures;let u=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,S,D,O,k){const W=O.fog,P=k.geometry,R=b.isMeshStandardMaterial?O.environment:null,X=(b.isMeshStandardMaterial?e:t).get(b.envMap||R),U=X&&X.mapping===za?X.image.height:null,N=g[b.type];b.precision!==null&&(u=s.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const tt=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,ht=tt!==void 0?tt.length:0;let nt=0;P.morphAttributes.position!==void 0&&(nt=1),P.morphAttributes.normal!==void 0&&(nt=2),P.morphAttributes.color!==void 0&&(nt=3);let gt,j,Q,pt;if(N){const $t=wn[N];gt=$t.vertexShader,j=$t.fragmentShader}else gt=b.vertexShader,j=b.fragmentShader,c.update(b),Q=c.getVertexShaderID(b),pt=c.getFragmentShaderID(b);const K=n.getRenderTarget(),mt=n.state.buffers.depth.getReversed(),wt=k.isInstancedMesh===!0,Ct=k.isBatchedMesh===!0,Ut=!!b.map,At=!!b.matcap,Lt=!!X,F=!!b.aoMap,Qt=!!b.lightMap,Et=!!b.bumpMap,Rt=!!b.normalMap,q=!!b.displacementMap,dt=!!b.emissiveMap,lt=!!b.metalnessMap,w=!!b.roughnessMap,M=b.anisotropy>0,G=b.clearcoat>0,et=b.dispersion>0,st=b.iridescence>0,it=b.sheen>0,$=b.transmission>0,ct=M&&!!b.anisotropyMap,_t=G&&!!b.clearcoatMap,Pt=G&&!!b.clearcoatNormalMap,ft=G&&!!b.clearcoatRoughnessMap,xt=st&&!!b.iridescenceMap,z=st&&!!b.iridescenceThicknessMap,ot=it&&!!b.sheenColorMap,ut=it&&!!b.sheenRoughnessMap,Ot=!!b.specularMap,kt=!!b.specularColorMap,Gt=!!b.specularIntensityMap,I=$&&!!b.transmissionMap,yt=$&&!!b.thicknessMap,J=!!b.gradientMap,at=!!b.alphaMap,bt=b.alphaTest>0,Mt=!!b.alphaHash,Bt=!!b.extensions;let Kt=Qn;b.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Kt=n.toneMapping);const ie={shaderID:N,shaderType:b.type,shaderName:b.name,vertexShader:gt,fragmentShader:j,defines:b.defines,customVertexShaderID:Q,customFragmentShaderID:pt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Ct,batchingColor:Ct&&k._colorsTexture!==null,instancing:wt,instancingColor:wt&&k.instanceColor!==null,instancingMorph:wt&&k.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:as,alphaToCoverage:!!b.alphaToCoverage,map:Ut,matcap:At,envMap:Lt,envMapMode:Lt&&X.mapping,envMapCubeUVHeight:U,aoMap:F,lightMap:Qt,bumpMap:Et,normalMap:Rt,displacementMap:h&&q,emissiveMap:dt,normalMapObjectSpace:Rt&&b.normalMapType===yp,normalMapTangentSpace:Rt&&b.normalMapType===Rd,metalnessMap:lt,roughnessMap:w,anisotropy:M,anisotropyMap:ct,clearcoat:G,clearcoatMap:_t,clearcoatNormalMap:Pt,clearcoatRoughnessMap:ft,dispersion:et,iridescence:st,iridescenceMap:xt,iridescenceThicknessMap:z,sheen:it,sheenColorMap:ot,sheenRoughnessMap:ut,specularMap:Ot,specularColorMap:kt,specularIntensityMap:Gt,transmission:$,transmissionMap:I,thicknessMap:yt,gradientMap:J,opaque:b.transparent===!1&&b.blending===ji&&b.alphaToCoverage===!1,alphaMap:at,alphaTest:bt,alphaHash:Mt,combine:b.combine,mapUv:Ut&&_(b.map.channel),aoMapUv:F&&_(b.aoMap.channel),lightMapUv:Qt&&_(b.lightMap.channel),bumpMapUv:Et&&_(b.bumpMap.channel),normalMapUv:Rt&&_(b.normalMap.channel),displacementMapUv:q&&_(b.displacementMap.channel),emissiveMapUv:dt&&_(b.emissiveMap.channel),metalnessMapUv:lt&&_(b.metalnessMap.channel),roughnessMapUv:w&&_(b.roughnessMap.channel),anisotropyMapUv:ct&&_(b.anisotropyMap.channel),clearcoatMapUv:_t&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Pt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ft&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:z&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:ot&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:ut&&_(b.sheenRoughnessMap.channel),specularMapUv:Ot&&_(b.specularMap.channel),specularColorMapUv:kt&&_(b.specularColorMap.channel),specularIntensityMapUv:Gt&&_(b.specularIntensityMap.channel),transmissionMapUv:I&&_(b.transmissionMap.channel),thicknessMapUv:yt&&_(b.thicknessMap.channel),alphaMapUv:at&&_(b.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(Rt||M),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!P.attributes.uv&&(Ut||at),fog:!!W,useFog:b.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:mt,skinning:k.isSkinnedMesh===!0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:nt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:Kt,decodeVideoTexture:Ut&&b.map.isVideoTexture===!0&&re.getTransfer(b.map.colorSpace)===ce,decodeVideoTextureEmissive:dt&&b.emissiveMap.isVideoTexture===!0&&re.getTransfer(b.emissiveMap.colorSpace)===ce,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ve,flipSided:b.side===qe,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Bt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Bt&&b.extensions.multiDraw===!0||Ct)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ie.vertexUv1s=l.has(1),ie.vertexUv2s=l.has(2),ie.vertexUv3s=l.has(3),l.clear(),ie}function p(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const D in b.defines)S.push(D),S.push(b.defines[D]);return b.isRawShaderMaterial===!1&&(x(S,b),v(S,b),S.push(n.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function x(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function v(b,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),b.push(o.mask)}function y(b){const S=g[b.type];let D;if(S){const O=wn[S];D=jp.clone(O.uniforms)}else D=b.uniforms;return D}function L(b,S){let D;for(let O=0,k=d.length;O<k;O++){const W=d[O];if(W.cacheKey===S){D=W,++D.usedTimes;break}}return D===void 0&&(D=new lx(n,S,b,a),d.push(D)),D}function C(b){if(--b.usedTimes===0){const S=d.indexOf(b);d[S]=d[d.length-1],d.pop(),b.destroy()}}function A(b){c.remove(b)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:L,releaseProgram:C,releaseShaderCache:A,programs:d,dispose:T}}function px(){let n=new WeakMap;function t(r){return n.has(r)}function e(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,c){n.get(r)[o]=c}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function mx(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Hl(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Gl(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function r(f,h,u,g,_,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:h,material:u,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=h,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=_,p.group=m),t++,p}function o(f,h,u,g,_,m){const p=r(f,h,u,g,_,m);u.transmission>0?i.push(p):u.transparent===!0?s.push(p):e.push(p)}function c(f,h,u,g,_,m){const p=r(f,h,u,g,_,m);u.transmission>0?i.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function l(f,h){e.length>1&&e.sort(f||mx),i.length>1&&i.sort(h||Hl),s.length>1&&s.sort(h||Hl)}function d(){for(let f=t,h=n.length;f<h;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:o,unshift:c,finish:d,sort:l}}function gx(){let n=new WeakMap;function t(i,s){const a=n.get(i);let r;return a===void 0?(r=new Gl,n.set(i,[r])):s>=a.length?(r=new Gl,a.push(r)):r=a[s],r}function e(){n=new WeakMap}return{get:t,dispose:e}}function _x(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new Y,color:new Yt};break;case"SpotLight":e={position:new Y,direction:new Y,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new Y,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new Y,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return n[t.id]=e,e}}}function xx(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Zt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Zt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Zt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let vx=0;function Mx(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function yx(n){const t=new _x,e=xx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new Y);const s=new Y,a=new me,r=new me;function o(l){let d=0,f=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,g=0,_=0,m=0,p=0,x=0,v=0,y=0,L=0,C=0,A=0;l.sort(Mx);for(let b=0,S=l.length;b<S;b++){const D=l[b],O=D.color,k=D.intensity,W=D.distance,P=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=O.r*k,f+=O.g*k,h+=O.b*k;else if(D.isLightProbe){for(let R=0;R<9;R++)i.probe[R].addScaledVector(D.sh.coefficients[R],k);A++}else if(D.isDirectionalLight){const R=t.get(D);if(R.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const X=D.shadow,U=e.get(D);U.shadowIntensity=X.intensity,U.shadowBias=X.bias,U.shadowNormalBias=X.normalBias,U.shadowRadius=X.radius,U.shadowMapSize=X.mapSize,i.directionalShadow[u]=U,i.directionalShadowMap[u]=P,i.directionalShadowMatrix[u]=D.shadow.matrix,x++}i.directional[u]=R,u++}else if(D.isSpotLight){const R=t.get(D);R.position.setFromMatrixPosition(D.matrixWorld),R.color.copy(O).multiplyScalar(k),R.distance=W,R.coneCos=Math.cos(D.angle),R.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),R.decay=D.decay,i.spot[_]=R;const X=D.shadow;if(D.map&&(i.spotLightMap[L]=D.map,L++,X.updateMatrices(D),D.castShadow&&C++),i.spotLightMatrix[_]=X.matrix,D.castShadow){const U=e.get(D);U.shadowIntensity=X.intensity,U.shadowBias=X.bias,U.shadowNormalBias=X.normalBias,U.shadowRadius=X.radius,U.shadowMapSize=X.mapSize,i.spotShadow[_]=U,i.spotShadowMap[_]=P,y++}_++}else if(D.isRectAreaLight){const R=t.get(D);R.color.copy(O).multiplyScalar(k),R.halfWidth.set(D.width*.5,0,0),R.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=R,m++}else if(D.isPointLight){const R=t.get(D);if(R.color.copy(D.color).multiplyScalar(D.intensity),R.distance=D.distance,R.decay=D.decay,D.castShadow){const X=D.shadow,U=e.get(D);U.shadowIntensity=X.intensity,U.shadowBias=X.bias,U.shadowNormalBias=X.normalBias,U.shadowRadius=X.radius,U.shadowMapSize=X.mapSize,U.shadowCameraNear=X.camera.near,U.shadowCameraFar=X.camera.far,i.pointShadow[g]=U,i.pointShadowMap[g]=P,i.pointShadowMatrix[g]=D.shadow.matrix,v++}i.point[g]=R,g++}else if(D.isHemisphereLight){const R=t.get(D);R.skyColor.copy(D.color).multiplyScalar(k),R.groundColor.copy(D.groundColor).multiplyScalar(k),i.hemi[p]=R,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Dt.LTC_FLOAT_1,i.rectAreaLTC2=Dt.LTC_FLOAT_2):(i.rectAreaLTC1=Dt.LTC_HALF_1,i.rectAreaLTC2=Dt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=h;const T=i.hash;(T.directionalLength!==u||T.pointLength!==g||T.spotLength!==_||T.rectAreaLength!==m||T.hemiLength!==p||T.numDirectionalShadows!==x||T.numPointShadows!==v||T.numSpotShadows!==y||T.numSpotMaps!==L||T.numLightProbes!==A)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=y+L-C,i.spotLightMap.length=L,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=A,T.directionalLength=u,T.pointLength=g,T.spotLength=_,T.rectAreaLength=m,T.hemiLength=p,T.numDirectionalShadows=x,T.numPointShadows=v,T.numSpotShadows=y,T.numSpotMaps=L,T.numLightProbes=A,i.version=vx++)}function c(l,d){let f=0,h=0,u=0,g=0,_=0;const m=d.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const v=l[p];if(v.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),f++}else if(v.isSpotLight){const y=i.spot[u];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(v.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),r.identity(),a.copy(v.matrixWorld),a.premultiply(m),r.extractRotation(a),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(r),y.halfHeight.applyMatrix4(r),g++}else if(v.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),h++}else if(v.isHemisphereLight){const y=i.hemi[_];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:i}}function Vl(n){const t=new yx(n),e=[],i=[];function s(d){l.camera=d,e.length=0,i.length=0}function a(d){e.push(d)}function r(d){i.push(d)}function o(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function Sx(n){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new Vl(n),t.set(s,[o])):a>=r.length?(o=new Vl(n),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:e,dispose:i}}class bx extends Ei{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=vp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Ex extends Ei{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const wx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Tx=`uniform sampler2D shadow_pass;
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
}`;function Ax(n,t,e){let i=new lc;const s=new Zt,a=new Zt,r=new Se,o=new bx({depthPacking:Mp}),c=new Ex,l={},d=e.maxTextureSize,f={[ei]:qe,[qe]:ei,[Ve]:Ve},h=new ni({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Zt},radius:{value:4}},vertexShader:wx,fragmentShader:Tx}),u=h.clone();u.defines.HORIZONTAL_PASS=1;const g=new je;g.setAttribute("position",new xn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new pe(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=md;let p=this.type;this.render=function(C,A,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const b=n.getRenderTarget(),S=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),O=n.state;O.setBlending(Jn),O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const k=p!==zn&&this.type===zn,W=p===zn&&this.type!==zn;for(let P=0,R=C.length;P<R;P++){const X=C[P],U=X.shadow;if(U===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;s.copy(U.mapSize);const N=U.getFrameExtents();if(s.multiply(N),a.copy(U.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/N.x),s.x=a.x*N.x,U.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/N.y),s.y=a.y*N.y,U.mapSize.y=a.y)),U.map===null||k===!0||W===!0){const ht=this.type!==zn?{minFilter:_n,magFilter:_n}:{};U.map!==null&&U.map.dispose(),U.map=new bi(s.x,s.y,ht),U.map.texture.name=X.name+".shadowMap",U.camera.updateProjectionMatrix()}n.setRenderTarget(U.map),n.clear();const tt=U.getViewportCount();for(let ht=0;ht<tt;ht++){const nt=U.getViewport(ht);r.set(a.x*nt.x,a.y*nt.y,a.x*nt.z,a.y*nt.w),O.viewport(r),U.updateMatrices(X,ht),i=U.getFrustum(),y(A,T,U.camera,X,this.type)}U.isPointLightShadow!==!0&&this.type===zn&&x(U,T),U.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,S,D)};function x(C,A){const T=t.update(_);h.defines.VSM_SAMPLES!==C.blurSamples&&(h.defines.VSM_SAMPLES=C.blurSamples,u.defines.VSM_SAMPLES=C.blurSamples,h.needsUpdate=!0,u.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new bi(s.x,s.y)),h.uniforms.shadow_pass.value=C.map.texture,h.uniforms.resolution.value=C.mapSize,h.uniforms.radius.value=C.radius,n.setRenderTarget(C.mapPass),n.clear(),n.renderBufferDirect(A,null,T,h,_,null),u.uniforms.shadow_pass.value=C.mapPass.texture,u.uniforms.resolution.value=C.mapSize,u.uniforms.radius.value=C.radius,n.setRenderTarget(C.map),n.clear(),n.renderBufferDirect(A,null,T,u,_,null)}function v(C,A,T,b){let S=null;const D=T.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(D!==void 0)S=D;else if(S=T.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const O=S.uuid,k=A.uuid;let W=l[O];W===void 0&&(W={},l[O]=W);let P=W[k];P===void 0&&(P=S.clone(),W[k]=P,A.addEventListener("dispose",L)),S=P}if(S.visible=A.visible,S.wireframe=A.wireframe,b===zn?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:f[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,T.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const O=n.properties.get(S);O.light=T}return S}function y(C,A,T,b,S){if(C.visible===!1)return;if(C.layers.test(A.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&S===zn)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,C.matrixWorld);const k=t.update(C),W=C.material;if(Array.isArray(W)){const P=k.groups;for(let R=0,X=P.length;R<X;R++){const U=P[R],N=W[U.materialIndex];if(N&&N.visible){const tt=v(C,N,b,S);C.onBeforeShadow(n,C,A,T,k,tt,U),n.renderBufferDirect(T,null,k,tt,C,U),C.onAfterShadow(n,C,A,T,k,tt,U)}}}else if(W.visible){const P=v(C,W,b,S);C.onBeforeShadow(n,C,A,T,k,P,null),n.renderBufferDirect(T,null,k,P,C,null),C.onAfterShadow(n,C,A,T,k,P,null)}}const O=C.children;for(let k=0,W=O.length;k<W;k++)y(O[k],A,T,b,S)}function L(C){C.target.removeEventListener("dispose",L);for(const T in l){const b=l[T],S=C.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const Rx={[no]:io,[so]:oo,[ao]:co,[Qi]:ro,[io]:no,[oo]:so,[co]:ao,[ro]:Qi};function Cx(n,t){function e(){let I=!1;const yt=new Se;let J=null;const at=new Se(0,0,0,0);return{setMask:function(bt){J!==bt&&!I&&(n.colorMask(bt,bt,bt,bt),J=bt)},setLocked:function(bt){I=bt},setClear:function(bt,Mt,Bt,Kt,ie){ie===!0&&(bt*=Kt,Mt*=Kt,Bt*=Kt),yt.set(bt,Mt,Bt,Kt),at.equals(yt)===!1&&(n.clearColor(bt,Mt,Bt,Kt),at.copy(yt))},reset:function(){I=!1,J=null,at.set(-1,0,0,0)}}}function i(){let I=!1,yt=!1,J=null,at=null,bt=null;return{setReversed:function(Mt){if(yt!==Mt){const Bt=t.get("EXT_clip_control");yt?Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.ZERO_TO_ONE_EXT):Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.NEGATIVE_ONE_TO_ONE_EXT);const Kt=bt;bt=null,this.setClear(Kt)}yt=Mt},getReversed:function(){return yt},setTest:function(Mt){Mt?K(n.DEPTH_TEST):mt(n.DEPTH_TEST)},setMask:function(Mt){J!==Mt&&!I&&(n.depthMask(Mt),J=Mt)},setFunc:function(Mt){if(yt&&(Mt=Rx[Mt]),at!==Mt){switch(Mt){case no:n.depthFunc(n.NEVER);break;case io:n.depthFunc(n.ALWAYS);break;case so:n.depthFunc(n.LESS);break;case Qi:n.depthFunc(n.LEQUAL);break;case ao:n.depthFunc(n.EQUAL);break;case ro:n.depthFunc(n.GEQUAL);break;case oo:n.depthFunc(n.GREATER);break;case co:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}at=Mt}},setLocked:function(Mt){I=Mt},setClear:function(Mt){bt!==Mt&&(yt&&(Mt=1-Mt),n.clearDepth(Mt),bt=Mt)},reset:function(){I=!1,J=null,at=null,bt=null,yt=!1}}}function s(){let I=!1,yt=null,J=null,at=null,bt=null,Mt=null,Bt=null,Kt=null,ie=null;return{setTest:function($t){I||($t?K(n.STENCIL_TEST):mt(n.STENCIL_TEST))},setMask:function($t){yt!==$t&&!I&&(n.stencilMask($t),yt=$t)},setFunc:function($t,ge,ye){(J!==$t||at!==ge||bt!==ye)&&(n.stencilFunc($t,ge,ye),J=$t,at=ge,bt=ye)},setOp:function($t,ge,ye){(Mt!==$t||Bt!==ge||Kt!==ye)&&(n.stencilOp($t,ge,ye),Mt=$t,Bt=ge,Kt=ye)},setLocked:function($t){I=$t},setClear:function($t){ie!==$t&&(n.clearStencil($t),ie=$t)},reset:function(){I=!1,yt=null,J=null,at=null,bt=null,Mt=null,Bt=null,Kt=null,ie=null}}}const a=new e,r=new i,o=new s,c=new WeakMap,l=new WeakMap;let d={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,v=null,y=null,L=null,C=null,A=new Yt(0,0,0),T=0,b=!1,S=null,D=null,O=null,k=null,W=null;const P=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let R=!1,X=0;const U=n.getParameter(n.VERSION);U.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(U)[1]),R=X>=1):U.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),R=X>=2);let N=null,tt={};const ht=n.getParameter(n.SCISSOR_BOX),nt=n.getParameter(n.VIEWPORT),gt=new Se().fromArray(ht),j=new Se().fromArray(nt);function Q(I,yt,J,at){const bt=new Uint8Array(4),Mt=n.createTexture();n.bindTexture(I,Mt),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Bt=0;Bt<J;Bt++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(yt,0,n.RGBA,1,1,at,0,n.RGBA,n.UNSIGNED_BYTE,bt):n.texImage2D(yt+Bt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,bt);return Mt}const pt={};pt[n.TEXTURE_2D]=Q(n.TEXTURE_2D,n.TEXTURE_2D,1),pt[n.TEXTURE_CUBE_MAP]=Q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[n.TEXTURE_2D_ARRAY]=Q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),pt[n.TEXTURE_3D]=Q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),K(n.DEPTH_TEST),r.setFunc(Qi),Et(!1),Rt(Zc),K(n.CULL_FACE),F(Jn);function K(I){d[I]!==!0&&(n.enable(I),d[I]=!0)}function mt(I){d[I]!==!1&&(n.disable(I),d[I]=!1)}function wt(I,yt){return f[I]!==yt?(n.bindFramebuffer(I,yt),f[I]=yt,I===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=yt),I===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=yt),!0):!1}function Ct(I,yt){let J=u,at=!1;if(I){J=h.get(yt),J===void 0&&(J=[],h.set(yt,J));const bt=I.textures;if(J.length!==bt.length||J[0]!==n.COLOR_ATTACHMENT0){for(let Mt=0,Bt=bt.length;Mt<Bt;Mt++)J[Mt]=n.COLOR_ATTACHMENT0+Mt;J.length=bt.length,at=!0}}else J[0]!==n.BACK&&(J[0]=n.BACK,at=!0);at&&n.drawBuffers(J)}function Ut(I){return g!==I?(n.useProgram(I),g=I,!0):!1}const At={[gi]:n.FUNC_ADD,[$f]:n.FUNC_SUBTRACT,[Yf]:n.FUNC_REVERSE_SUBTRACT};At[Zf]=n.MIN,At[qf]=n.MAX;const Lt={[jf]:n.ZERO,[Kf]:n.ONE,[Jf]:n.SRC_COLOR,[to]:n.SRC_ALPHA,[sp]:n.SRC_ALPHA_SATURATE,[np]:n.DST_COLOR,[tp]:n.DST_ALPHA,[Qf]:n.ONE_MINUS_SRC_COLOR,[eo]:n.ONE_MINUS_SRC_ALPHA,[ip]:n.ONE_MINUS_DST_COLOR,[ep]:n.ONE_MINUS_DST_ALPHA,[ap]:n.CONSTANT_COLOR,[rp]:n.ONE_MINUS_CONSTANT_COLOR,[op]:n.CONSTANT_ALPHA,[cp]:n.ONE_MINUS_CONSTANT_ALPHA};function F(I,yt,J,at,bt,Mt,Bt,Kt,ie,$t){if(I===Jn){_===!0&&(mt(n.BLEND),_=!1);return}if(_===!1&&(K(n.BLEND),_=!0),I!==Wf){if(I!==m||$t!==b){if((p!==gi||y!==gi)&&(n.blendEquation(n.FUNC_ADD),p=gi,y=gi),$t)switch(I){case ji:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case qc:n.blendFunc(n.ONE,n.ONE);break;case jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Kc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ji:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case qc:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case jc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Kc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}x=null,v=null,L=null,C=null,A.set(0,0,0),T=0,m=I,b=$t}return}bt=bt||yt,Mt=Mt||J,Bt=Bt||at,(yt!==p||bt!==y)&&(n.blendEquationSeparate(At[yt],At[bt]),p=yt,y=bt),(J!==x||at!==v||Mt!==L||Bt!==C)&&(n.blendFuncSeparate(Lt[J],Lt[at],Lt[Mt],Lt[Bt]),x=J,v=at,L=Mt,C=Bt),(Kt.equals(A)===!1||ie!==T)&&(n.blendColor(Kt.r,Kt.g,Kt.b,ie),A.copy(Kt),T=ie),m=I,b=!1}function Qt(I,yt){I.side===Ve?mt(n.CULL_FACE):K(n.CULL_FACE);let J=I.side===qe;yt&&(J=!J),Et(J),I.blending===ji&&I.transparent===!1?F(Jn):F(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),r.setFunc(I.depthFunc),r.setTest(I.depthTest),r.setMask(I.depthWrite),a.setMask(I.colorWrite);const at=I.stencilWrite;o.setTest(at),at&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),dt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):mt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Et(I){S!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),S=I)}function Rt(I){I!==Vf?(K(n.CULL_FACE),I!==D&&(I===Zc?n.cullFace(n.BACK):I===Xf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):mt(n.CULL_FACE),D=I}function q(I){I!==O&&(R&&n.lineWidth(I),O=I)}function dt(I,yt,J){I?(K(n.POLYGON_OFFSET_FILL),(k!==yt||W!==J)&&(n.polygonOffset(yt,J),k=yt,W=J)):mt(n.POLYGON_OFFSET_FILL)}function lt(I){I?K(n.SCISSOR_TEST):mt(n.SCISSOR_TEST)}function w(I){I===void 0&&(I=n.TEXTURE0+P-1),N!==I&&(n.activeTexture(I),N=I)}function M(I,yt,J){J===void 0&&(N===null?J=n.TEXTURE0+P-1:J=N);let at=tt[J];at===void 0&&(at={type:void 0,texture:void 0},tt[J]=at),(at.type!==I||at.texture!==yt)&&(N!==J&&(n.activeTexture(J),N=J),n.bindTexture(I,yt||pt[I]),at.type=I,at.texture=yt)}function G(){const I=tt[N];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function et(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function st(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function it(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ct(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _t(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Pt(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ft(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function xt(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function z(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(I){gt.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),gt.copy(I))}function ut(I){j.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),j.copy(I))}function Ot(I,yt){let J=l.get(yt);J===void 0&&(J=new WeakMap,l.set(yt,J));let at=J.get(I);at===void 0&&(at=n.getUniformBlockIndex(yt,I.name),J.set(I,at))}function kt(I,yt){const at=l.get(yt).get(I);c.get(yt)!==at&&(n.uniformBlockBinding(yt,at,I.__bindingPointIndex),c.set(yt,at))}function Gt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},N=null,tt={},f={},h=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,v=null,y=null,L=null,C=null,A=new Yt(0,0,0),T=0,b=!1,S=null,D=null,O=null,k=null,W=null,gt.set(0,0,n.canvas.width,n.canvas.height),j.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:K,disable:mt,bindFramebuffer:wt,drawBuffers:Ct,useProgram:Ut,setBlending:F,setMaterial:Qt,setFlipSided:Et,setCullFace:Rt,setLineWidth:q,setPolygonOffset:dt,setScissorTest:lt,activeTexture:w,bindTexture:M,unbindTexture:G,compressedTexImage2D:et,compressedTexImage3D:st,texImage2D:xt,texImage3D:z,updateUBOMapping:Ot,uniformBlockBinding:kt,texStorage2D:Pt,texStorage3D:ft,texSubImage2D:it,texSubImage3D:$,compressedTexSubImage2D:ct,compressedTexSubImage3D:_t,scissor:ot,viewport:ut,reset:Gt}}function Xl(n,t,e,i){const s=Px(i);switch(e){case yd:return n*t;case bd:return n*t;case Ed:return n*t*2;case wd:return n*t/s.components*s.byteLength;case sc:return n*t/s.components*s.byteLength;case Td:return n*t*2/s.components*s.byteLength;case ac:return n*t*2/s.components*s.byteLength;case Sd:return n*t*3/s.components*s.byteLength;case gn:return n*t*4/s.components*s.byteLength;case rc:return n*t*4/s.components*s.byteLength;case pa:case ma:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ga:case _a:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case mo:case _o:return Math.max(n,16)*Math.max(t,8)/4;case po:case go:return Math.max(n,8)*Math.max(t,8)/2;case xo:case vo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Mo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case yo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case So:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case bo:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Eo:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case wo:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case To:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Ao:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Ro:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Co:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Po:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Do:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Lo:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Io:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case ko:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case xa:case Uo:case Fo:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Ad:case No:return Math.ceil(n/4)*Math.ceil(t/4)*8;case zo:case Oo:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Px(n){switch(n){case Vn:case xd:return{byteLength:1,components:1};case ws:case vd:case As:return{byteLength:2,components:1};case nc:case ic:return{byteLength:2,components:4};case Si:case ec:case Bn:return{byteLength:4,components:1};case Md:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Dx(n,t,e,i,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Zt,d=new WeakMap;let f;const h=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,M){return u?new OffscreenCanvas(w,M):La("canvas")}function _(w,M,G){let et=1;const st=lt(w);if((st.width>G||st.height>G)&&(et=G/Math.max(st.width,st.height)),et<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const it=Math.floor(et*st.width),$=Math.floor(et*st.height);f===void 0&&(f=g(it,$));const ct=M?g(it,$):f;return ct.width=it,ct.height=$,ct.getContext("2d").drawImage(w,0,0,it,$),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+it+"x"+$+")."),ct}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),w;return w}function m(w){return w.generateMipmaps}function p(w){n.generateMipmap(w)}function x(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(w,M,G,et,st=!1){if(w!==null){if(n[w]!==void 0)return n[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let it=M;if(M===n.RED&&(G===n.FLOAT&&(it=n.R32F),G===n.HALF_FLOAT&&(it=n.R16F),G===n.UNSIGNED_BYTE&&(it=n.R8)),M===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(it=n.R8UI),G===n.UNSIGNED_SHORT&&(it=n.R16UI),G===n.UNSIGNED_INT&&(it=n.R32UI),G===n.BYTE&&(it=n.R8I),G===n.SHORT&&(it=n.R16I),G===n.INT&&(it=n.R32I)),M===n.RG&&(G===n.FLOAT&&(it=n.RG32F),G===n.HALF_FLOAT&&(it=n.RG16F),G===n.UNSIGNED_BYTE&&(it=n.RG8)),M===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(it=n.RG8UI),G===n.UNSIGNED_SHORT&&(it=n.RG16UI),G===n.UNSIGNED_INT&&(it=n.RG32UI),G===n.BYTE&&(it=n.RG8I),G===n.SHORT&&(it=n.RG16I),G===n.INT&&(it=n.RG32I)),M===n.RGB_INTEGER&&(G===n.UNSIGNED_BYTE&&(it=n.RGB8UI),G===n.UNSIGNED_SHORT&&(it=n.RGB16UI),G===n.UNSIGNED_INT&&(it=n.RGB32UI),G===n.BYTE&&(it=n.RGB8I),G===n.SHORT&&(it=n.RGB16I),G===n.INT&&(it=n.RGB32I)),M===n.RGBA_INTEGER&&(G===n.UNSIGNED_BYTE&&(it=n.RGBA8UI),G===n.UNSIGNED_SHORT&&(it=n.RGBA16UI),G===n.UNSIGNED_INT&&(it=n.RGBA32UI),G===n.BYTE&&(it=n.RGBA8I),G===n.SHORT&&(it=n.RGBA16I),G===n.INT&&(it=n.RGBA32I)),M===n.RGB&&G===n.UNSIGNED_INT_5_9_9_9_REV&&(it=n.RGB9_E5),M===n.RGBA){const $=st?Oa:re.getTransfer(et);G===n.FLOAT&&(it=n.RGBA32F),G===n.HALF_FLOAT&&(it=n.RGBA16F),G===n.UNSIGNED_BYTE&&(it=$===ce?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT_4_4_4_4&&(it=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(it=n.RGB5_A1)}return(it===n.R16F||it===n.R32F||it===n.RG16F||it===n.RG32F||it===n.RGBA16F||it===n.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function y(w,M){let G;return w?M===null||M===Si||M===ns?G=n.DEPTH24_STENCIL8:M===Bn?G=n.DEPTH32F_STENCIL8:M===ws&&(G=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Si||M===ns?G=n.DEPTH_COMPONENT24:M===Bn?G=n.DEPTH_COMPONENT32F:M===ws&&(G=n.DEPTH_COMPONENT16),G}function L(w,M){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==_n&&w.minFilter!==An?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function C(w){const M=w.target;M.removeEventListener("dispose",C),T(M),M.isVideoTexture&&d.delete(M)}function A(w){const M=w.target;M.removeEventListener("dispose",A),S(M)}function T(w){const M=i.get(w);if(M.__webglInit===void 0)return;const G=w.source,et=h.get(G);if(et){const st=et[M.__cacheKey];st.usedTimes--,st.usedTimes===0&&b(w),Object.keys(et).length===0&&h.delete(G)}i.remove(w)}function b(w){const M=i.get(w);n.deleteTexture(M.__webglTexture);const G=w.source,et=h.get(G);delete et[M.__cacheKey],r.memory.textures--}function S(w){const M=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let et=0;et<6;et++){if(Array.isArray(M.__webglFramebuffer[et]))for(let st=0;st<M.__webglFramebuffer[et].length;st++)n.deleteFramebuffer(M.__webglFramebuffer[et][st]);else n.deleteFramebuffer(M.__webglFramebuffer[et]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[et])}else{if(Array.isArray(M.__webglFramebuffer))for(let et=0;et<M.__webglFramebuffer.length;et++)n.deleteFramebuffer(M.__webglFramebuffer[et]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let et=0;et<M.__webglColorRenderbuffer.length;et++)M.__webglColorRenderbuffer[et]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[et]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const G=w.textures;for(let et=0,st=G.length;et<st;et++){const it=i.get(G[et]);it.__webglTexture&&(n.deleteTexture(it.__webglTexture),r.memory.textures--),i.remove(G[et])}i.remove(w)}let D=0;function O(){D=0}function k(){const w=D;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),D+=1,w}function W(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function P(w,M){const G=i.get(w);if(w.isVideoTexture&&q(w),w.isRenderTargetTexture===!1&&w.version>0&&G.__version!==w.version){const et=w.image;if(et===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(et.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(G,w,M);return}}e.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+M)}function R(w,M){const G=i.get(w);if(w.version>0&&G.__version!==w.version){j(G,w,M);return}e.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+M)}function X(w,M){const G=i.get(w);if(w.version>0&&G.__version!==w.version){j(G,w,M);return}e.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+M)}function U(w,M){const G=i.get(w);if(w.version>0&&G.__version!==w.version){Q(G,w,M);return}e.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+M)}const N={[uo]:n.REPEAT,[xi]:n.CLAMP_TO_EDGE,[fo]:n.MIRRORED_REPEAT},tt={[_n]:n.NEAREST,[xp]:n.NEAREST_MIPMAP_NEAREST,[Fs]:n.NEAREST_MIPMAP_LINEAR,[An]:n.LINEAR,[ar]:n.LINEAR_MIPMAP_NEAREST,[vi]:n.LINEAR_MIPMAP_LINEAR},ht={[Sp]:n.NEVER,[Rp]:n.ALWAYS,[bp]:n.LESS,[Cd]:n.LEQUAL,[Ep]:n.EQUAL,[Ap]:n.GEQUAL,[wp]:n.GREATER,[Tp]:n.NOTEQUAL};function nt(w,M){if(M.type===Bn&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===An||M.magFilter===ar||M.magFilter===Fs||M.magFilter===vi||M.minFilter===An||M.minFilter===ar||M.minFilter===Fs||M.minFilter===vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,N[M.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,N[M.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,N[M.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,tt[M.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,tt[M.minFilter]),M.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,ht[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===_n||M.minFilter!==Fs&&M.minFilter!==vi||M.type===Bn&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");n.texParameterf(w,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function gt(w,M){let G=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",C));const et=M.source;let st=h.get(et);st===void 0&&(st={},h.set(et,st));const it=W(M);if(it!==w.__cacheKey){st[it]===void 0&&(st[it]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,G=!0),st[it].usedTimes++;const $=st[w.__cacheKey];$!==void 0&&(st[w.__cacheKey].usedTimes--,$.usedTimes===0&&b(M)),w.__cacheKey=it,w.__webglTexture=st[it].texture}return G}function j(w,M,G){let et=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(et=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(et=n.TEXTURE_3D);const st=gt(w,M),it=M.source;e.bindTexture(et,w.__webglTexture,n.TEXTURE0+G);const $=i.get(it);if(it.version!==$.__version||st===!0){e.activeTexture(n.TEXTURE0+G);const ct=re.getPrimaries(re.workingColorSpace),_t=M.colorSpace===jn?null:re.getPrimaries(M.colorSpace),Pt=M.colorSpace===jn||ct===_t?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);let ft=_(M.image,!1,s.maxTextureSize);ft=dt(M,ft);const xt=a.convert(M.format,M.colorSpace),z=a.convert(M.type);let ot=v(M.internalFormat,xt,z,M.colorSpace,M.isVideoTexture);nt(et,M);let ut;const Ot=M.mipmaps,kt=M.isVideoTexture!==!0,Gt=$.__version===void 0||st===!0,I=it.dataReady,yt=L(M,ft);if(M.isDepthTexture)ot=y(M.format===is,M.type),Gt&&(kt?e.texStorage2D(n.TEXTURE_2D,1,ot,ft.width,ft.height):e.texImage2D(n.TEXTURE_2D,0,ot,ft.width,ft.height,0,xt,z,null));else if(M.isDataTexture)if(Ot.length>0){kt&&Gt&&e.texStorage2D(n.TEXTURE_2D,yt,ot,Ot[0].width,Ot[0].height);for(let J=0,at=Ot.length;J<at;J++)ut=Ot[J],kt?I&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ut.width,ut.height,xt,z,ut.data):e.texImage2D(n.TEXTURE_2D,J,ot,ut.width,ut.height,0,xt,z,ut.data);M.generateMipmaps=!1}else kt?(Gt&&e.texStorage2D(n.TEXTURE_2D,yt,ot,ft.width,ft.height),I&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ft.width,ft.height,xt,z,ft.data)):e.texImage2D(n.TEXTURE_2D,0,ot,ft.width,ft.height,0,xt,z,ft.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){kt&&Gt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,yt,ot,Ot[0].width,Ot[0].height,ft.depth);for(let J=0,at=Ot.length;J<at;J++)if(ut=Ot[J],M.format!==gn)if(xt!==null)if(kt){if(I)if(M.layerUpdates.size>0){const bt=Xl(ut.width,ut.height,M.format,M.type);for(const Mt of M.layerUpdates){const Bt=ut.data.subarray(Mt*bt/ut.data.BYTES_PER_ELEMENT,(Mt+1)*bt/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,Mt,ut.width,ut.height,1,xt,Bt)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ut.width,ut.height,ft.depth,xt,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,J,ot,ut.width,ut.height,ft.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?I&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ut.width,ut.height,ft.depth,xt,z,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,J,ot,ut.width,ut.height,ft.depth,0,xt,z,ut.data)}else{kt&&Gt&&e.texStorage2D(n.TEXTURE_2D,yt,ot,Ot[0].width,Ot[0].height);for(let J=0,at=Ot.length;J<at;J++)ut=Ot[J],M.format!==gn?xt!==null?kt?I&&e.compressedTexSubImage2D(n.TEXTURE_2D,J,0,0,ut.width,ut.height,xt,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,J,ot,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?I&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ut.width,ut.height,xt,z,ut.data):e.texImage2D(n.TEXTURE_2D,J,ot,ut.width,ut.height,0,xt,z,ut.data)}else if(M.isDataArrayTexture)if(kt){if(Gt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,yt,ot,ft.width,ft.height,ft.depth),I)if(M.layerUpdates.size>0){const J=Xl(ft.width,ft.height,M.format,M.type);for(const at of M.layerUpdates){const bt=ft.data.subarray(at*J/ft.data.BYTES_PER_ELEMENT,(at+1)*J/ft.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,at,ft.width,ft.height,1,xt,z,bt)}M.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ft.width,ft.height,ft.depth,xt,z,ft.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,ot,ft.width,ft.height,ft.depth,0,xt,z,ft.data);else if(M.isData3DTexture)kt?(Gt&&e.texStorage3D(n.TEXTURE_3D,yt,ot,ft.width,ft.height,ft.depth),I&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ft.width,ft.height,ft.depth,xt,z,ft.data)):e.texImage3D(n.TEXTURE_3D,0,ot,ft.width,ft.height,ft.depth,0,xt,z,ft.data);else if(M.isFramebufferTexture){if(Gt)if(kt)e.texStorage2D(n.TEXTURE_2D,yt,ot,ft.width,ft.height);else{let J=ft.width,at=ft.height;for(let bt=0;bt<yt;bt++)e.texImage2D(n.TEXTURE_2D,bt,ot,J,at,0,xt,z,null),J>>=1,at>>=1}}else if(Ot.length>0){if(kt&&Gt){const J=lt(Ot[0]);e.texStorage2D(n.TEXTURE_2D,yt,ot,J.width,J.height)}for(let J=0,at=Ot.length;J<at;J++)ut=Ot[J],kt?I&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,xt,z,ut):e.texImage2D(n.TEXTURE_2D,J,ot,xt,z,ut);M.generateMipmaps=!1}else if(kt){if(Gt){const J=lt(ft);e.texStorage2D(n.TEXTURE_2D,yt,ot,J.width,J.height)}I&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,xt,z,ft)}else e.texImage2D(n.TEXTURE_2D,0,ot,xt,z,ft);m(M)&&p(et),$.__version=it.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function Q(w,M,G){if(M.image.length!==6)return;const et=gt(w,M),st=M.source;e.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+G);const it=i.get(st);if(st.version!==it.__version||et===!0){e.activeTexture(n.TEXTURE0+G);const $=re.getPrimaries(re.workingColorSpace),ct=M.colorSpace===jn?null:re.getPrimaries(M.colorSpace),_t=M.colorSpace===jn||$===ct?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const Pt=M.isCompressedTexture||M.image[0].isCompressedTexture,ft=M.image[0]&&M.image[0].isDataTexture,xt=[];for(let at=0;at<6;at++)!Pt&&!ft?xt[at]=_(M.image[at],!0,s.maxCubemapSize):xt[at]=ft?M.image[at].image:M.image[at],xt[at]=dt(M,xt[at]);const z=xt[0],ot=a.convert(M.format,M.colorSpace),ut=a.convert(M.type),Ot=v(M.internalFormat,ot,ut,M.colorSpace),kt=M.isVideoTexture!==!0,Gt=it.__version===void 0||et===!0,I=st.dataReady;let yt=L(M,z);nt(n.TEXTURE_CUBE_MAP,M);let J;if(Pt){kt&&Gt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,Ot,z.width,z.height);for(let at=0;at<6;at++){J=xt[at].mipmaps;for(let bt=0;bt<J.length;bt++){const Mt=J[bt];M.format!==gn?ot!==null?kt?I&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,bt,0,0,Mt.width,Mt.height,ot,Mt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,bt,Ot,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,bt,0,0,Mt.width,Mt.height,ot,ut,Mt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,bt,Ot,Mt.width,Mt.height,0,ot,ut,Mt.data)}}}else{if(J=M.mipmaps,kt&&Gt){J.length>0&&yt++;const at=lt(xt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,Ot,at.width,at.height)}for(let at=0;at<6;at++)if(ft){kt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,xt[at].width,xt[at].height,ot,ut,xt[at].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Ot,xt[at].width,xt[at].height,0,ot,ut,xt[at].data);for(let bt=0;bt<J.length;bt++){const Bt=J[bt].image[at].image;kt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,bt+1,0,0,Bt.width,Bt.height,ot,ut,Bt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,bt+1,Ot,Bt.width,Bt.height,0,ot,ut,Bt.data)}}else{kt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,ot,ut,xt[at]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Ot,ot,ut,xt[at]);for(let bt=0;bt<J.length;bt++){const Mt=J[bt];kt?I&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,bt+1,0,0,ot,ut,Mt.image[at]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,bt+1,Ot,ot,ut,Mt.image[at])}}}m(M)&&p(n.TEXTURE_CUBE_MAP),it.__version=st.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function pt(w,M,G,et,st,it){const $=a.convert(G.format,G.colorSpace),ct=a.convert(G.type),_t=v(G.internalFormat,$,ct,G.colorSpace),Pt=i.get(M),ft=i.get(G);if(ft.__renderTarget=M,!Pt.__hasExternalTextures){const xt=Math.max(1,M.width>>it),z=Math.max(1,M.height>>it);st===n.TEXTURE_3D||st===n.TEXTURE_2D_ARRAY?e.texImage3D(st,it,_t,xt,z,M.depth,0,$,ct,null):e.texImage2D(st,it,_t,xt,z,0,$,ct,null)}e.bindFramebuffer(n.FRAMEBUFFER,w),Rt(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,et,st,ft.__webglTexture,0,Et(M)):(st===n.TEXTURE_2D||st>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,et,st,ft.__webglTexture,it),e.bindFramebuffer(n.FRAMEBUFFER,null)}function K(w,M,G){if(n.bindRenderbuffer(n.RENDERBUFFER,w),M.depthBuffer){const et=M.depthTexture,st=et&&et.isDepthTexture?et.type:null,it=y(M.stencilBuffer,st),$=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=Et(M);Rt(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ct,it,M.width,M.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,ct,it,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,it,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,$,n.RENDERBUFFER,w)}else{const et=M.textures;for(let st=0;st<et.length;st++){const it=et[st],$=a.convert(it.format,it.colorSpace),ct=a.convert(it.type),_t=v(it.internalFormat,$,ct,it.colorSpace),Pt=Et(M);G&&Rt(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Pt,_t,M.width,M.height):Rt(M)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Pt,_t,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,_t,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function mt(w,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const et=i.get(M.depthTexture);et.__renderTarget=M,(!et.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),P(M.depthTexture,0);const st=et.__webglTexture,it=Et(M);if(M.depthTexture.format===Ki)Rt(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,st,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,st,0);else if(M.depthTexture.format===is)Rt(M)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,st,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function wt(w){const M=i.get(w),G=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const et=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),et){const st=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,et.removeEventListener("dispose",st)};et.addEventListener("dispose",st),M.__depthDisposeCallback=st}M.__boundDepthTexture=et}if(w.depthTexture&&!M.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");mt(M.__webglFramebuffer,w)}else if(G){M.__webglDepthbuffer=[];for(let et=0;et<6;et++)if(e.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[et]),M.__webglDepthbuffer[et]===void 0)M.__webglDepthbuffer[et]=n.createRenderbuffer(),K(M.__webglDepthbuffer[et],w,!1);else{const st=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=M.__webglDepthbuffer[et];n.bindRenderbuffer(n.RENDERBUFFER,it),n.framebufferRenderbuffer(n.FRAMEBUFFER,st,n.RENDERBUFFER,it)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),K(M.__webglDepthbuffer,w,!1);else{const et=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,et,n.RENDERBUFFER,st)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ct(w,M,G){const et=i.get(w);M!==void 0&&pt(et.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&wt(w)}function Ut(w){const M=w.texture,G=i.get(w),et=i.get(M);w.addEventListener("dispose",A);const st=w.textures,it=w.isWebGLCubeRenderTarget===!0,$=st.length>1;if($||(et.__webglTexture===void 0&&(et.__webglTexture=n.createTexture()),et.__version=M.version,r.memory.textures++),it){G.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer[ct]=[];for(let _t=0;_t<M.mipmaps.length;_t++)G.__webglFramebuffer[ct][_t]=n.createFramebuffer()}else G.__webglFramebuffer[ct]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){G.__webglFramebuffer=[];for(let ct=0;ct<M.mipmaps.length;ct++)G.__webglFramebuffer[ct]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if($)for(let ct=0,_t=st.length;ct<_t;ct++){const Pt=i.get(st[ct]);Pt.__webglTexture===void 0&&(Pt.__webglTexture=n.createTexture(),r.memory.textures++)}if(w.samples>0&&Rt(w)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ct=0;ct<st.length;ct++){const _t=st[ct];G.__webglColorRenderbuffer[ct]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[ct]);const Pt=a.convert(_t.format,_t.colorSpace),ft=a.convert(_t.type),xt=v(_t.internalFormat,Pt,ft,_t.colorSpace,w.isXRRenderTarget===!0),z=Et(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,z,xt,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.RENDERBUFFER,G.__webglColorRenderbuffer[ct])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),K(G.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(it){e.bindTexture(n.TEXTURE_CUBE_MAP,et.__webglTexture),nt(n.TEXTURE_CUBE_MAP,M);for(let ct=0;ct<6;ct++)if(M.mipmaps&&M.mipmaps.length>0)for(let _t=0;_t<M.mipmaps.length;_t++)pt(G.__webglFramebuffer[ct][_t],w,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,_t);else pt(G.__webglFramebuffer[ct],w,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);m(M)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if($){for(let ct=0,_t=st.length;ct<_t;ct++){const Pt=st[ct],ft=i.get(Pt);e.bindTexture(n.TEXTURE_2D,ft.__webglTexture),nt(n.TEXTURE_2D,Pt),pt(G.__webglFramebuffer,w,Pt,n.COLOR_ATTACHMENT0+ct,n.TEXTURE_2D,0),m(Pt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let ct=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ct=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ct,et.__webglTexture),nt(ct,M),M.mipmaps&&M.mipmaps.length>0)for(let _t=0;_t<M.mipmaps.length;_t++)pt(G.__webglFramebuffer[_t],w,M,n.COLOR_ATTACHMENT0,ct,_t);else pt(G.__webglFramebuffer,w,M,n.COLOR_ATTACHMENT0,ct,0);m(M)&&p(ct),e.unbindTexture()}w.depthBuffer&&wt(w)}function At(w){const M=w.textures;for(let G=0,et=M.length;G<et;G++){const st=M[G];if(m(st)){const it=x(w),$=i.get(st).__webglTexture;e.bindTexture(it,$),p(it),e.unbindTexture()}}}const Lt=[],F=[];function Qt(w){if(w.samples>0){if(Rt(w)===!1){const M=w.textures,G=w.width,et=w.height;let st=n.COLOR_BUFFER_BIT;const it=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$=i.get(w),ct=M.length>1;if(ct)for(let _t=0;_t<M.length;_t++)e.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_t,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,$.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_t,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,$.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,$.__webglFramebuffer);for(let _t=0;_t<M.length;_t++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(st|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(st|=n.STENCIL_BUFFER_BIT)),ct){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,$.__webglColorRenderbuffer[_t]);const Pt=i.get(M[_t]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Pt,0)}n.blitFramebuffer(0,0,G,et,0,0,G,et,st,n.NEAREST),c===!0&&(Lt.length=0,F.length=0,Lt.push(n.COLOR_ATTACHMENT0+_t),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Lt.push(it),F.push(it),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,F)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Lt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ct)for(let _t=0;_t<M.length;_t++){e.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_t,n.RENDERBUFFER,$.__webglColorRenderbuffer[_t]);const Pt=i.get(M[_t]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,$.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_t,n.TEXTURE_2D,Pt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,$.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const M=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function Et(w){return Math.min(s.maxSamples,w.samples)}function Rt(w){const M=i.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function q(w){const M=r.render.frame;d.get(w)!==M&&(d.set(w,M),w.update())}function dt(w,M){const G=w.colorSpace,et=w.format,st=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||G!==as&&G!==jn&&(re.getTransfer(G)===ce?(et!==gn||st!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),M}function lt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=O,this.setTexture2D=P,this.setTexture2DArray=R,this.setTexture3D=X,this.setTextureCube=U,this.rebindTextures=Ct,this.setupRenderTarget=Ut,this.updateRenderTargetMipmap=At,this.updateMultisampleRenderTarget=Qt,this.setupDepthRenderbuffer=wt,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Rt}function Lx(n,t){function e(i,s=jn){let a;const r=re.getTransfer(s);if(i===Vn)return n.UNSIGNED_BYTE;if(i===nc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ic)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Md)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===xd)return n.BYTE;if(i===vd)return n.SHORT;if(i===ws)return n.UNSIGNED_SHORT;if(i===ec)return n.INT;if(i===Si)return n.UNSIGNED_INT;if(i===Bn)return n.FLOAT;if(i===As)return n.HALF_FLOAT;if(i===yd)return n.ALPHA;if(i===Sd)return n.RGB;if(i===gn)return n.RGBA;if(i===bd)return n.LUMINANCE;if(i===Ed)return n.LUMINANCE_ALPHA;if(i===Ki)return n.DEPTH_COMPONENT;if(i===is)return n.DEPTH_STENCIL;if(i===wd)return n.RED;if(i===sc)return n.RED_INTEGER;if(i===Td)return n.RG;if(i===ac)return n.RG_INTEGER;if(i===rc)return n.RGBA_INTEGER;if(i===pa||i===ma||i===ga||i===_a)if(r===ce)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===pa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ma)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ga)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===_a)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===pa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ma)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ga)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===_a)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===po||i===mo||i===go||i===_o)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===po)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===mo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===go)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_o)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===xo||i===vo||i===Mo)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===xo||i===vo)return r===ce?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Mo)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===yo||i===So||i===bo||i===Eo||i===wo||i===To||i===Ao||i===Ro||i===Co||i===Po||i===Do||i===Lo||i===Io||i===ko)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===yo)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===So)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===bo)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Eo)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===wo)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===To)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ao)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ro)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Co)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Po)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Do)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Lo)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Io)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ko)return r===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===xa||i===Uo||i===Fo)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===xa)return r===ce?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Uo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Fo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ad||i===No||i===zo||i===Oo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===xa)return a.COMPRESSED_RED_RGTC1_EXT;if(i===No)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===zo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Oo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ns?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class Ix extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class De extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const kx={type:"move"};class Ir{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new De,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new De,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new De,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const d=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],h=d.position.distanceTo(f.position),u=.02,g=.005;l.inputState.pinching&&h>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(kx)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new De;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Ux=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Fx=`
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

}`;class Nx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new We,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ni({vertexShader:Ux,fragmentShader:Fx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new pe(new Ha(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class zx extends rs{constructor(t,e){super();const i=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,d=null,f=null,h=null,u=null,g=null;const _=new Nx,m=e.getContextAttributes();let p=null,x=null;const v=[],y=[],L=new Zt;let C=null;const A=new rn;A.viewport=new Se;const T=new rn;T.viewport=new Se;const b=[A,T],S=new Ix;let D=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let Q=v[j];return Q===void 0&&(Q=new Ir,v[j]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(j){let Q=v[j];return Q===void 0&&(Q=new Ir,v[j]=Q),Q.getGripSpace()},this.getHand=function(j){let Q=v[j];return Q===void 0&&(Q=new Ir,v[j]=Q),Q.getHandSpace()};function k(j){const Q=y.indexOf(j.inputSource);if(Q===-1)return;const pt=v[Q];pt!==void 0&&(pt.update(j.inputSource,j.frame,l||r),pt.dispatchEvent({type:j.type,data:j.inputSource}))}function W(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",P);for(let j=0;j<v.length;j++){const Q=y[j];Q!==null&&(y[j]=null,v[j].disconnect(Q))}D=null,O=null,_.reset(),t.setRenderTarget(p),u=null,h=null,f=null,s=null,x=null,gt.stop(),i.isPresenting=!1,t.setPixelRatio(C),t.setSize(L.width,L.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){a=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return h!==null?h:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",W),s.addEventListener("inputsourceschange",P),m.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const Q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,Q),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new bi(u.framebufferWidth,u.framebufferHeight,{format:gn,type:Vn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let Q=null,pt=null,K=null;m.depth&&(K=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=m.stencil?is:Ki,pt=m.stencil?ns:Si);const mt={colorFormat:e.RGBA8,depthFormat:K,scaleFactor:a};f=new XRWebGLBinding(s,e),h=f.createProjectionLayer(mt),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),x=new bi(h.textureWidth,h.textureHeight,{format:gn,type:Vn,depthTexture:new Hd(h.textureWidth,h.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),gt.setContext(s),gt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function P(j){for(let Q=0;Q<j.removed.length;Q++){const pt=j.removed[Q],K=y.indexOf(pt);K>=0&&(y[K]=null,v[K].disconnect(pt))}for(let Q=0;Q<j.added.length;Q++){const pt=j.added[Q];let K=y.indexOf(pt);if(K===-1){for(let wt=0;wt<v.length;wt++)if(wt>=y.length){y.push(pt),K=wt;break}else if(y[wt]===null){y[wt]=pt,K=wt;break}if(K===-1)break}const mt=v[K];mt&&mt.connect(pt)}}const R=new Y,X=new Y;function U(j,Q,pt){R.setFromMatrixPosition(Q.matrixWorld),X.setFromMatrixPosition(pt.matrixWorld);const K=R.distanceTo(X),mt=Q.projectionMatrix.elements,wt=pt.projectionMatrix.elements,Ct=mt[14]/(mt[10]-1),Ut=mt[14]/(mt[10]+1),At=(mt[9]+1)/mt[5],Lt=(mt[9]-1)/mt[5],F=(mt[8]-1)/mt[0],Qt=(wt[8]+1)/wt[0],Et=Ct*F,Rt=Ct*Qt,q=K/(-F+Qt),dt=q*-F;if(Q.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(dt),j.translateZ(q),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),mt[10]===-1)j.projectionMatrix.copy(Q.projectionMatrix),j.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const lt=Ct+q,w=Ut+q,M=Et-dt,G=Rt+(K-dt),et=At*Ut/w*lt,st=Lt*Ut/w*lt;j.projectionMatrix.makePerspective(M,G,et,st,lt,w),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function N(j,Q){Q===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(Q.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let Q=j.near,pt=j.far;_.texture!==null&&(_.depthNear>0&&(Q=_.depthNear),_.depthFar>0&&(pt=_.depthFar)),S.near=T.near=A.near=Q,S.far=T.far=A.far=pt,(D!==S.near||O!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),D=S.near,O=S.far),A.layers.mask=j.layers.mask|2,T.layers.mask=j.layers.mask|4,S.layers.mask=A.layers.mask|T.layers.mask;const K=j.parent,mt=S.cameras;N(S,K);for(let wt=0;wt<mt.length;wt++)N(mt[wt],K);mt.length===2?U(S,A,T):S.projectionMatrix.copy(A.projectionMatrix),tt(j,S,K)};function tt(j,Q,pt){pt===null?j.matrix.copy(Q.matrixWorld):(j.matrix.copy(pt.matrixWorld),j.matrix.invert(),j.matrix.multiply(Q.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(Q.projectionMatrix),j.projectionMatrixInverse.copy(Q.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Ho*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(h===null&&u===null))return c},this.setFoveation=function(j){c=j,h!==null&&(h.fixedFoveation=j),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=j)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(S)};let ht=null;function nt(j,Q){if(d=Q.getViewerPose(l||r),g=Q,d!==null){const pt=d.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let K=!1;pt.length!==S.cameras.length&&(S.cameras.length=0,K=!0);for(let wt=0;wt<pt.length;wt++){const Ct=pt[wt];let Ut=null;if(u!==null)Ut=u.getViewport(Ct);else{const Lt=f.getViewSubImage(h,Ct);Ut=Lt.viewport,wt===0&&(t.setRenderTargetTextures(x,Lt.colorTexture,h.ignoreDepthValues?void 0:Lt.depthStencilTexture),t.setRenderTarget(x))}let At=b[wt];At===void 0&&(At=new rn,At.layers.enable(wt),At.viewport=new Se,b[wt]=At),At.matrix.fromArray(Ct.transform.matrix),At.matrix.decompose(At.position,At.quaternion,At.scale),At.projectionMatrix.fromArray(Ct.projectionMatrix),At.projectionMatrixInverse.copy(At.projectionMatrix).invert(),At.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),wt===0&&(S.matrix.copy(At.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),K===!0&&S.cameras.push(At)}const mt=s.enabledFeatures;if(mt&&mt.includes("depth-sensing")){const wt=f.getDepthInformation(pt[0]);wt&&wt.isValid&&wt.texture&&_.init(t,wt,s.renderState)}}for(let pt=0;pt<v.length;pt++){const K=y[pt],mt=v[pt];K!==null&&mt!==void 0&&mt.update(K,Q,l||r)}ht&&ht(j,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}const gt=new Od;gt.setAnimationLoop(nt),this.setAnimationLoop=function(j){ht=j},this.dispose=function(){}}}const hi=new Pn,Ox=new me;function Bx(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Fd(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,v,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),d(m,p)):p.isMeshStandardMaterial?(a(m,p),h(m,p),p.isMeshPhysicalMaterial&&u(m,p,y)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),_(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,x,v):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===qe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===qe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),v=x.envMap,y=x.envMapRotation;v&&(m.envMap.value=v,hi.copy(y),hi.x*=-1,hi.y*=-1,hi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),m.envMapRotation.value.setFromMatrix4(Ox.makeRotationFromEuler(hi)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===qe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Hx(n,t,e,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,v){const y=v.program;i.uniformBlockBinding(x,y)}function l(x,v){let y=s[x.id];y===void 0&&(g(x),y=d(x),s[x.id]=y,x.addEventListener("dispose",m));const L=v.program;i.updateUBOMapping(x,L);const C=t.render.frame;a[x.id]!==C&&(h(x),a[x.id]=C)}function d(x){const v=f();x.__bindingPointIndex=v;const y=n.createBuffer(),L=x.__size,C=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,L,C),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,y),y}function f(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const v=s[x.id],y=x.uniforms,L=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let C=0,A=y.length;C<A;C++){const T=Array.isArray(y[C])?y[C]:[y[C]];for(let b=0,S=T.length;b<S;b++){const D=T[b];if(u(D,C,b,L)===!0){const O=D.__offset,k=Array.isArray(D.value)?D.value:[D.value];let W=0;for(let P=0;P<k.length;P++){const R=k[P],X=_(R);typeof R=="number"||typeof R=="boolean"?(D.__data[0]=R,n.bufferSubData(n.UNIFORM_BUFFER,O+W,D.__data)):R.isMatrix3?(D.__data[0]=R.elements[0],D.__data[1]=R.elements[1],D.__data[2]=R.elements[2],D.__data[3]=0,D.__data[4]=R.elements[3],D.__data[5]=R.elements[4],D.__data[6]=R.elements[5],D.__data[7]=0,D.__data[8]=R.elements[6],D.__data[9]=R.elements[7],D.__data[10]=R.elements[8],D.__data[11]=0):(R.toArray(D.__data,W),W+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,O,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,v,y,L){const C=x.value,A=v+"_"+y;if(L[A]===void 0)return typeof C=="number"||typeof C=="boolean"?L[A]=C:L[A]=C.clone(),!0;{const T=L[A];if(typeof C=="number"||typeof C=="boolean"){if(T!==C)return L[A]=C,!0}else if(T.equals(C)===!1)return T.copy(C),!0}return!1}function g(x){const v=x.uniforms;let y=0;const L=16;for(let A=0,T=v.length;A<T;A++){const b=Array.isArray(v[A])?v[A]:[v[A]];for(let S=0,D=b.length;S<D;S++){const O=b[S],k=Array.isArray(O.value)?O.value:[O.value];for(let W=0,P=k.length;W<P;W++){const R=k[W],X=_(R),U=y%L,N=U%X.boundary,tt=U+N;y+=N,tt!==0&&L-tt<X.storage&&(y+=L-tt),O.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=y,y+=X.storage}}}const C=y%L;return C>0&&(y+=L-C),x.__size=y,x.__cache={},this}function _(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function m(x){const v=x.target;v.removeEventListener("dispose",m);const y=r.indexOf(v.__bindingPointIndex);r.splice(y,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function p(){for(const x in s)n.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:p}}class Gx{constructor(t={}){const{canvas:e=Pp(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=r;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=an,this.toneMapping=Qn,this.toneMappingExposure=1;const y=this;let L=!1,C=0,A=0,T=null,b=-1,S=null;const D=new Se,O=new Se;let k=null;const W=new Yt(0);let P=0,R=e.width,X=e.height,U=1,N=null,tt=null;const ht=new Se(0,0,R,X),nt=new Se(0,0,R,X);let gt=!1;const j=new lc;let Q=!1,pt=!1;const K=new me,mt=new me,wt=new Y,Ct=new Se,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let At=!1;function Lt(){return T===null?U:1}let F=i;function Qt(E,B){return e.getContext(E,B)}try{const E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Qo}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",bt,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),F===null){const B="webgl2";if(F=Qt(B,E),F===null)throw Qt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Et,Rt,q,dt,lt,w,M,G,et,st,it,$,ct,_t,Pt,ft,xt,z,ot,ut,Ot,kt,Gt,I;function yt(){Et=new Y0(F),Et.init(),kt=new Lx(F,Et),Rt=new H0(F,Et,t,kt),q=new Cx(F,Et),Rt.reverseDepthBuffer&&h&&q.buffers.depth.setReversed(!0),dt=new j0(F),lt=new px,w=new Dx(F,Et,q,lt,Rt,kt,dt),M=new V0(y),G=new $0(y),et=new im(F),Gt=new O0(F,et),st=new Z0(F,et,dt,Gt),it=new J0(F,st,et,dt),ot=new K0(F,Rt,w),ft=new G0(lt),$=new fx(y,M,G,Et,Rt,Gt,ft),ct=new Bx(y,lt),_t=new gx,Pt=new Sx(Et),z=new z0(y,M,G,q,it,u,c),xt=new Ax(y,it,Rt),I=new Hx(F,dt,Rt,q),ut=new B0(F,Et,dt),Ot=new q0(F,Et,dt),dt.programs=$.programs,y.capabilities=Rt,y.extensions=Et,y.properties=lt,y.renderLists=_t,y.shadowMap=xt,y.state=q,y.info=dt}yt();const J=new zx(y,F);this.xr=J,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const E=Et.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Et.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return U},this.setPixelRatio=function(E){E!==void 0&&(U=E,this.setSize(R,X,!1))},this.getSize=function(E){return E.set(R,X)},this.setSize=function(E,B,V=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}R=E,X=B,e.width=Math.floor(E*U),e.height=Math.floor(B*U),V===!0&&(e.style.width=E+"px",e.style.height=B+"px"),this.setViewport(0,0,E,B)},this.getDrawingBufferSize=function(E){return E.set(R*U,X*U).floor()},this.setDrawingBufferSize=function(E,B,V){R=E,X=B,U=V,e.width=Math.floor(E*V),e.height=Math.floor(B*V),this.setViewport(0,0,E,B)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(ht)},this.setViewport=function(E,B,V,Z){E.isVector4?ht.set(E.x,E.y,E.z,E.w):ht.set(E,B,V,Z),q.viewport(D.copy(ht).multiplyScalar(U).round())},this.getScissor=function(E){return E.copy(nt)},this.setScissor=function(E,B,V,Z){E.isVector4?nt.set(E.x,E.y,E.z,E.w):nt.set(E,B,V,Z),q.scissor(O.copy(nt).multiplyScalar(U).round())},this.getScissorTest=function(){return gt},this.setScissorTest=function(E){q.setScissorTest(gt=E)},this.setOpaqueSort=function(E){N=E},this.setTransparentSort=function(E){tt=E},this.getClearColor=function(E){return E.copy(z.getClearColor())},this.setClearColor=function(){z.setClearColor.apply(z,arguments)},this.getClearAlpha=function(){return z.getClearAlpha()},this.setClearAlpha=function(){z.setClearAlpha.apply(z,arguments)},this.clear=function(E=!0,B=!0,V=!0){let Z=0;if(E){let H=!1;if(T!==null){const vt=T.texture.format;H=vt===rc||vt===ac||vt===sc}if(H){const vt=T.texture.type,It=vt===Vn||vt===Si||vt===ws||vt===ns||vt===nc||vt===ic,Nt=z.getClearColor(),zt=z.getClearAlpha(),Xt=Nt.r,Wt=Nt.g,Ft=Nt.b;It?(g[0]=Xt,g[1]=Wt,g[2]=Ft,g[3]=zt,F.clearBufferuiv(F.COLOR,0,g)):(_[0]=Xt,_[1]=Wt,_[2]=Ft,_[3]=zt,F.clearBufferiv(F.COLOR,0,_))}else Z|=F.COLOR_BUFFER_BIT}B&&(Z|=F.DEPTH_BUFFER_BIT),V&&(Z|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",bt,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),_t.dispose(),Pt.dispose(),lt.dispose(),M.dispose(),G.dispose(),it.dispose(),Gt.dispose(),I.dispose(),$.dispose(),J.dispose(),J.removeEventListener("sessionstart",tn),J.removeEventListener("sessionend",en),fe.stop()};function at(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function bt(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const E=dt.autoReset,B=xt.enabled,V=xt.autoUpdate,Z=xt.needsUpdate,H=xt.type;yt(),dt.autoReset=E,xt.enabled=B,xt.autoUpdate=V,xt.needsUpdate=Z,xt.type=H}function Mt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Bt(E){const B=E.target;B.removeEventListener("dispose",Bt),Kt(B)}function Kt(E){ie(E),lt.remove(E)}function ie(E){const B=lt.get(E).programs;B!==void 0&&(B.forEach(function(V){$.releaseProgram(V)}),E.isShaderMaterial&&$.releaseShaderCache(E))}this.renderBufferDirect=function(E,B,V,Z,H,vt){B===null&&(B=Ut);const It=H.isMesh&&H.matrixWorld.determinant()<0,Nt=te(E,B,V,Z,H);q.setMaterial(Z,It);let zt=V.index,Xt=1;if(Z.wireframe===!0){if(zt=st.getWireframeAttribute(V),zt===void 0)return;Xt=2}const Wt=V.drawRange,Ft=V.attributes.position;let ee=Wt.start*Xt,ne=(Wt.start+Wt.count)*Xt;vt!==null&&(ee=Math.max(ee,vt.start*Xt),ne=Math.min(ne,(vt.start+vt.count)*Xt)),zt!==null?(ee=Math.max(ee,0),ne=Math.min(ne,zt.count)):Ft!=null&&(ee=Math.max(ee,0),ne=Math.min(ne,Ft.count));const oe=ne-ee;if(oe<0||oe===1/0)return;Gt.setup(H,Z,Nt,V,zt);let Le,se=ut;if(zt!==null&&(Le=et.get(zt),se=Ot,se.setIndex(Le)),H.isMesh)Z.wireframe===!0?(q.setLineWidth(Z.wireframeLinewidth*Lt()),se.setMode(F.LINES)):se.setMode(F.TRIANGLES);else if(H.isLine){let Ht=Z.linewidth;Ht===void 0&&(Ht=1),q.setLineWidth(Ht*Lt()),H.isLineSegments?se.setMode(F.LINES):H.isLineLoop?se.setMode(F.LINE_LOOP):se.setMode(F.LINE_STRIP)}else H.isPoints?se.setMode(F.POINTS):H.isSprite&&se.setMode(F.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)se.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Et.get("WEBGL_multi_draw"))se.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Ht=H._multiDrawStarts,ln=H._multiDrawCounts,ae=H._multiDrawCount,Te=zt?et.get(zt).bytesPerElement:1,vn=lt.get(Z).currentProgram.getUniforms();for(let ze=0;ze<ae;ze++)vn.setValue(F,"_gl_DrawID",ze),se.render(Ht[ze]/Te,ln[ze])}else if(H.isInstancedMesh)se.renderInstances(ee,oe,H.count);else if(V.isInstancedBufferGeometry){const Ht=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,ln=Math.min(V.instanceCount,Ht);se.renderInstances(ee,oe,ln)}else se.render(ee,oe)};function $t(E,B,V){E.transparent===!0&&E.side===Ve&&E.forceSinglePass===!1?(E.side=qe,E.needsUpdate=!0,St(E,B,V),E.side=ei,E.needsUpdate=!0,St(E,B,V),E.side=Ve):St(E,B,V)}this.compile=function(E,B,V=null){V===null&&(V=E),p=Pt.get(V),p.init(B),v.push(p),V.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),E!==V&&E.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();const Z=new Set;return E.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const vt=H.material;if(vt)if(Array.isArray(vt))for(let It=0;It<vt.length;It++){const Nt=vt[It];$t(Nt,V,H),Z.add(Nt)}else $t(vt,V,H),Z.add(vt)}),v.pop(),p=null,Z},this.compileAsync=function(E,B,V=null){const Z=this.compile(E,B,V);return new Promise(H=>{function vt(){if(Z.forEach(function(It){lt.get(It).currentProgram.isReady()&&Z.delete(It)}),Z.size===0){H(E);return}setTimeout(vt,10)}Et.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let ge=null;function ye(E){ge&&ge(E)}function tn(){fe.stop()}function en(){fe.start()}const fe=new Od;fe.setAnimationLoop(ye),typeof self<"u"&&fe.setContext(self),this.setAnimationLoop=function(E){ge=E,J.setAnimationLoop(E),E===null?fe.stop():fe.start()},J.addEventListener("sessionstart",tn),J.addEventListener("sessionend",en),this.render=function(E,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(B),B=J.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,B,T),p=Pt.get(E,v.length),p.init(B),v.push(p),mt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),j.setFromProjectionMatrix(mt),pt=this.localClippingEnabled,Q=ft.init(this.clippingPlanes,pt),m=_t.get(E,x.length),m.init(),x.push(m),J.enabled===!0&&J.isPresenting===!0){const vt=y.xr.getDepthSensingMesh();vt!==null&&_e(vt,B,-1/0,y.sortObjects)}_e(E,B,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(N,tt),At=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,At&&z.addToRenderList(m,E),this.info.render.frame++,Q===!0&&ft.beginShadows();const V=p.state.shadowsArray;xt.render(V,E,B),Q===!0&&ft.endShadows(),this.info.autoReset===!0&&this.info.reset();const Z=m.opaque,H=m.transmissive;if(p.setupLights(),B.isArrayCamera){const vt=B.cameras;if(H.length>0)for(let It=0,Nt=vt.length;It<Nt;It++){const zt=vt[It];he(Z,H,E,zt)}At&&z.render(E);for(let It=0,Nt=vt.length;It<Nt;It++){const zt=vt[It];Fe(m,E,zt,zt.viewport)}}else H.length>0&&he(Z,H,E,B),At&&z.render(E),Fe(m,E,B);T!==null&&(w.updateMultisampleRenderTarget(T),w.updateRenderTargetMipmap(T)),E.isScene===!0&&E.onAfterRender(y,E,B),Gt.resetDefaultState(),b=-1,S=null,v.pop(),v.length>0?(p=v[v.length-1],Q===!0&&ft.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function _e(E,B,V,Z){if(E.visible===!1)return;if(E.layers.test(B.layers)){if(E.isGroup)V=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(B);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||j.intersectsSprite(E)){Z&&Ct.setFromMatrixPosition(E.matrixWorld).applyMatrix4(mt);const It=it.update(E),Nt=E.material;Nt.visible&&m.push(E,It,Nt,V,Ct.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||j.intersectsObject(E))){const It=it.update(E),Nt=E.material;if(Z&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ct.copy(E.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),Ct.copy(It.boundingSphere.center)),Ct.applyMatrix4(E.matrixWorld).applyMatrix4(mt)),Array.isArray(Nt)){const zt=It.groups;for(let Xt=0,Wt=zt.length;Xt<Wt;Xt++){const Ft=zt[Xt],ee=Nt[Ft.materialIndex];ee&&ee.visible&&m.push(E,It,ee,V,Ct.z,Ft)}}else Nt.visible&&m.push(E,It,Nt,V,Ct.z,null)}}const vt=E.children;for(let It=0,Nt=vt.length;It<Nt;It++)_e(vt[It],B,V,Z)}function Fe(E,B,V,Z){const H=E.opaque,vt=E.transmissive,It=E.transparent;p.setupLightsView(V),Q===!0&&ft.setGlobalState(y.clippingPlanes,V),Z&&q.viewport(D.copy(Z)),H.length>0&&Ne(H,B,V),vt.length>0&&Ne(vt,B,V),It.length>0&&Ne(It,B,V),q.buffers.depth.setTest(!0),q.buffers.depth.setMask(!0),q.buffers.color.setMask(!0),q.setPolygonOffset(!1)}function he(E,B,V,Z){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Z.id]===void 0&&(p.state.transmissionRenderTarget[Z.id]=new bi(1,1,{generateMipmaps:!0,type:Et.has("EXT_color_buffer_half_float")||Et.has("EXT_color_buffer_float")?As:Vn,minFilter:vi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:re.workingColorSpace}));const vt=p.state.transmissionRenderTarget[Z.id],It=Z.viewport||D;vt.setSize(It.z,It.w);const Nt=y.getRenderTarget();y.setRenderTarget(vt),y.getClearColor(W),P=y.getClearAlpha(),P<1&&y.setClearColor(16777215,.5),y.clear(),At&&z.render(V);const zt=y.toneMapping;y.toneMapping=Qn;const Xt=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),p.setupLightsView(Z),Q===!0&&ft.setGlobalState(y.clippingPlanes,Z),Ne(E,V,Z),w.updateMultisampleRenderTarget(vt),w.updateRenderTargetMipmap(vt),Et.has("WEBGL_multisampled_render_to_texture")===!1){let Wt=!1;for(let Ft=0,ee=B.length;Ft<ee;Ft++){const ne=B[Ft],oe=ne.object,Le=ne.geometry,se=ne.material,Ht=ne.group;if(se.side===Ve&&oe.layers.test(Z.layers)){const ln=se.side;se.side=qe,se.needsUpdate=!0,rt(oe,V,Z,Le,se,Ht),se.side=ln,se.needsUpdate=!0,Wt=!0}}Wt===!0&&(w.updateMultisampleRenderTarget(vt),w.updateRenderTargetMipmap(vt))}y.setRenderTarget(Nt),y.setClearColor(W,P),Xt!==void 0&&(Z.viewport=Xt),y.toneMapping=zt}function Ne(E,B,V){const Z=B.isScene===!0?B.overrideMaterial:null;for(let H=0,vt=E.length;H<vt;H++){const It=E[H],Nt=It.object,zt=It.geometry,Xt=Z===null?It.material:Z,Wt=It.group;Nt.layers.test(V.layers)&&rt(Nt,B,V,zt,Xt,Wt)}}function rt(E,B,V,Z,H,vt){E.onBeforeRender(y,B,V,Z,H,vt),E.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),H.onBeforeRender(y,B,V,Z,E,vt),H.transparent===!0&&H.side===Ve&&H.forceSinglePass===!1?(H.side=qe,H.needsUpdate=!0,y.renderBufferDirect(V,B,Z,H,E,vt),H.side=ei,H.needsUpdate=!0,y.renderBufferDirect(V,B,Z,H,E,vt),H.side=Ve):y.renderBufferDirect(V,B,Z,H,E,vt),E.onAfterRender(y,B,V,Z,H,vt)}function St(E,B,V){B.isScene!==!0&&(B=Ut);const Z=lt.get(E),H=p.state.lights,vt=p.state.shadowsArray,It=H.state.version,Nt=$.getParameters(E,H.state,vt,B,V),zt=$.getProgramCacheKey(Nt);let Xt=Z.programs;Z.environment=E.isMeshStandardMaterial?B.environment:null,Z.fog=B.fog,Z.envMap=(E.isMeshStandardMaterial?G:M).get(E.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&E.envMap===null?B.environmentRotation:E.envMapRotation,Xt===void 0&&(E.addEventListener("dispose",Bt),Xt=new Map,Z.programs=Xt);let Wt=Xt.get(zt);if(Wt!==void 0){if(Z.currentProgram===Wt&&Z.lightsStateVersion===It)return Vt(E,Nt),Wt}else Nt.uniforms=$.getUniforms(E),E.onBeforeCompile(Nt,y),Wt=$.acquireProgram(Nt,zt),Xt.set(zt,Wt),Z.uniforms=Nt.uniforms;const Ft=Z.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ft.clippingPlanes=ft.uniform),Vt(E,Nt),Z.needsLights=xe(E),Z.lightsStateVersion=It,Z.needsLights&&(Ft.ambientLightColor.value=H.state.ambient,Ft.lightProbe.value=H.state.probe,Ft.directionalLights.value=H.state.directional,Ft.directionalLightShadows.value=H.state.directionalShadow,Ft.spotLights.value=H.state.spot,Ft.spotLightShadows.value=H.state.spotShadow,Ft.rectAreaLights.value=H.state.rectArea,Ft.ltc_1.value=H.state.rectAreaLTC1,Ft.ltc_2.value=H.state.rectAreaLTC2,Ft.pointLights.value=H.state.point,Ft.pointLightShadows.value=H.state.pointShadow,Ft.hemisphereLights.value=H.state.hemi,Ft.directionalShadowMap.value=H.state.directionalShadowMap,Ft.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ft.spotShadowMap.value=H.state.spotShadowMap,Ft.spotLightMatrix.value=H.state.spotLightMatrix,Ft.spotLightMap.value=H.state.spotLightMap,Ft.pointShadowMap.value=H.state.pointShadowMap,Ft.pointShadowMatrix.value=H.state.pointShadowMatrix),Z.currentProgram=Wt,Z.uniformsList=null,Wt}function Tt(E){if(E.uniformsList===null){const B=E.currentProgram.getUniforms();E.uniformsList=Ma.seqWithValue(B.seq,E.uniforms)}return E.uniformsList}function Vt(E,B){const V=lt.get(E);V.outputColorSpace=B.outputColorSpace,V.batching=B.batching,V.batchingColor=B.batchingColor,V.instancing=B.instancing,V.instancingColor=B.instancingColor,V.instancingMorph=B.instancingMorph,V.skinning=B.skinning,V.morphTargets=B.morphTargets,V.morphNormals=B.morphNormals,V.morphColors=B.morphColors,V.morphTargetsCount=B.morphTargetsCount,V.numClippingPlanes=B.numClippingPlanes,V.numIntersection=B.numClipIntersection,V.vertexAlphas=B.vertexAlphas,V.vertexTangents=B.vertexTangents,V.toneMapping=B.toneMapping}function te(E,B,V,Z,H){B.isScene!==!0&&(B=Ut),w.resetTextureUnits();const vt=B.fog,It=Z.isMeshStandardMaterial?B.environment:null,Nt=T===null?y.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:as,zt=(Z.isMeshStandardMaterial?G:M).get(Z.envMap||It),Xt=Z.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Wt=!!V.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Ft=!!V.morphAttributes.position,ee=!!V.morphAttributes.normal,ne=!!V.morphAttributes.color;let oe=Qn;Z.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(oe=y.toneMapping);const Le=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,se=Le!==void 0?Le.length:0,Ht=lt.get(Z),ln=p.state.lights;if(Q===!0&&(pt===!0||E!==S)){const Oe=E===S&&Z.id===b;ft.setState(Z,E,Oe)}let ae=!1;Z.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==ln.state.version||Ht.outputColorSpace!==Nt||H.isBatchedMesh&&Ht.batching===!1||!H.isBatchedMesh&&Ht.batching===!0||H.isBatchedMesh&&Ht.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ht.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ht.instancing===!1||!H.isInstancedMesh&&Ht.instancing===!0||H.isSkinnedMesh&&Ht.skinning===!1||!H.isSkinnedMesh&&Ht.skinning===!0||H.isInstancedMesh&&Ht.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ht.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ht.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ht.instancingMorph===!1&&H.morphTexture!==null||Ht.envMap!==zt||Z.fog===!0&&Ht.fog!==vt||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==ft.numPlanes||Ht.numIntersection!==ft.numIntersection)||Ht.vertexAlphas!==Xt||Ht.vertexTangents!==Wt||Ht.morphTargets!==Ft||Ht.morphNormals!==ee||Ht.morphColors!==ne||Ht.toneMapping!==oe||Ht.morphTargetsCount!==se)&&(ae=!0):(ae=!0,Ht.__version=Z.version);let Te=Ht.currentProgram;ae===!0&&(Te=St(Z,B,H));let vn=!1,ze=!1,si=!1;const de=Te.getUniforms(),$e=Ht.uniforms;if(q.useProgram(Te.program)&&(vn=!0,ze=!0,si=!0),Z.id!==b&&(b=Z.id,ze=!0),vn||S!==E){q.buffers.depth.getReversed()?(K.copy(E.projectionMatrix),Lp(K),Ip(K),de.setValue(F,"projectionMatrix",K)):de.setValue(F,"projectionMatrix",E.projectionMatrix),de.setValue(F,"viewMatrix",E.matrixWorldInverse);const Mn=de.map.cameraPosition;Mn!==void 0&&Mn.setValue(F,wt.setFromMatrixPosition(E.matrixWorld)),Rt.logarithmicDepthBuffer&&de.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&de.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),S!==E&&(S=E,ze=!0,si=!0)}if(H.isSkinnedMesh){de.setOptional(F,H,"bindMatrix"),de.setOptional(F,H,"bindMatrixInverse");const Oe=H.skeleton;Oe&&(Oe.boneTexture===null&&Oe.computeBoneTexture(),de.setValue(F,"boneTexture",Oe.boneTexture,w))}H.isBatchedMesh&&(de.setOptional(F,H,"batchingTexture"),de.setValue(F,"batchingTexture",H._matricesTexture,w),de.setOptional(F,H,"batchingIdTexture"),de.setValue(F,"batchingIdTexture",H._indirectTexture,w),de.setOptional(F,H,"batchingColorTexture"),H._colorsTexture!==null&&de.setValue(F,"batchingColorTexture",H._colorsTexture,w));const Ln=V.morphAttributes;if((Ln.position!==void 0||Ln.normal!==void 0||Ln.color!==void 0)&&ot.update(H,V,Te),(ze||Ht.receiveShadow!==H.receiveShadow)&&(Ht.receiveShadow=H.receiveShadow,de.setValue(F,"receiveShadow",H.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&($e.envMap.value=zt,$e.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&B.environment!==null&&($e.envMapIntensity.value=B.environmentIntensity),ze&&(de.setValue(F,"toneMappingExposure",y.toneMappingExposure),Ht.needsLights&&Jt($e,si),vt&&Z.fog===!0&&ct.refreshFogUniforms($e,vt),ct.refreshMaterialUniforms($e,Z,U,X,p.state.transmissionRenderTarget[E.id]),Ma.upload(F,Tt(Ht),$e,w)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(Ma.upload(F,Tt(Ht),$e,w),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&de.setValue(F,"center",H.center),de.setValue(F,"modelViewMatrix",H.modelViewMatrix),de.setValue(F,"normalMatrix",H.normalMatrix),de.setValue(F,"modelMatrix",H.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const Oe=Z.uniformsGroups;for(let Mn=0,yn=Oe.length;Mn<yn;Mn++){const Ps=Oe[Mn];I.update(Ps,Te),I.bind(Ps,Te)}}return Te}function Jt(E,B){E.ambientLightColor.needsUpdate=B,E.lightProbe.needsUpdate=B,E.directionalLights.needsUpdate=B,E.directionalLightShadows.needsUpdate=B,E.pointLights.needsUpdate=B,E.pointLightShadows.needsUpdate=B,E.spotLights.needsUpdate=B,E.spotLightShadows.needsUpdate=B,E.rectAreaLights.needsUpdate=B,E.hemisphereLights.needsUpdate=B}function xe(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(E,B,V){lt.get(E.texture).__webglTexture=B,lt.get(E.depthTexture).__webglTexture=V;const Z=lt.get(E);Z.__hasExternalTextures=!0,Z.__autoAllocateDepthBuffer=V===void 0,Z.__autoAllocateDepthBuffer||Et.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,B){const V=lt.get(E);V.__webglFramebuffer=B,V.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(E,B=0,V=0){T=E,C=B,A=V;let Z=!0,H=null,vt=!1,It=!1;if(E){const zt=lt.get(E);if(zt.__useDefaultFramebuffer!==void 0)q.bindFramebuffer(F.FRAMEBUFFER,null),Z=!1;else if(zt.__webglFramebuffer===void 0)w.setupRenderTarget(E);else if(zt.__hasExternalTextures)w.rebindTextures(E,lt.get(E.texture).__webglTexture,lt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ft=E.depthTexture;if(zt.__boundDepthTexture!==Ft){if(Ft!==null&&lt.has(Ft)&&(E.width!==Ft.image.width||E.height!==Ft.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(E)}}const Xt=E.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(It=!0);const Wt=lt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Wt[B])?H=Wt[B][V]:H=Wt[B],vt=!0):E.samples>0&&w.useMultisampledRTT(E)===!1?H=lt.get(E).__webglMultisampledFramebuffer:Array.isArray(Wt)?H=Wt[V]:H=Wt,D.copy(E.viewport),O.copy(E.scissor),k=E.scissorTest}else D.copy(ht).multiplyScalar(U).floor(),O.copy(nt).multiplyScalar(U).floor(),k=gt;if(q.bindFramebuffer(F.FRAMEBUFFER,H)&&Z&&q.drawBuffers(E,H),q.viewport(D),q.scissor(O),q.setScissorTest(k),vt){const zt=lt.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+B,zt.__webglTexture,V)}else if(It){const zt=lt.get(E.texture),Xt=B||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,zt.__webglTexture,V||0,Xt)}b=-1},this.readRenderTargetPixels=function(E,B,V,Z,H,vt,It){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Nt=lt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&It!==void 0&&(Nt=Nt[It]),Nt){q.bindFramebuffer(F.FRAMEBUFFER,Nt);try{const zt=E.texture,Xt=zt.format,Wt=zt.type;if(!Rt.textureFormatReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Rt.textureTypeReadable(Wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=E.width-Z&&V>=0&&V<=E.height-H&&F.readPixels(B,V,Z,H,kt.convert(Xt),kt.convert(Wt),vt)}finally{const zt=T!==null?lt.get(T).__webglFramebuffer:null;q.bindFramebuffer(F.FRAMEBUFFER,zt)}}},this.readRenderTargetPixelsAsync=async function(E,B,V,Z,H,vt,It){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Nt=lt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&It!==void 0&&(Nt=Nt[It]),Nt){const zt=E.texture,Xt=zt.format,Wt=zt.type;if(!Rt.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Rt.textureTypeReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=E.width-Z&&V>=0&&V<=E.height-H){q.bindFramebuffer(F.FRAMEBUFFER,Nt);const Ft=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Ft),F.bufferData(F.PIXEL_PACK_BUFFER,vt.byteLength,F.STREAM_READ),F.readPixels(B,V,Z,H,kt.convert(Xt),kt.convert(Wt),0);const ee=T!==null?lt.get(T).__webglFramebuffer:null;q.bindFramebuffer(F.FRAMEBUFFER,ee);const ne=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Dp(F,ne,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Ft),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,vt),F.deleteBuffer(Ft),F.deleteSync(ne),vt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,B=null,V=0){E.isTexture!==!0&&(vs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,E=arguments[1]);const Z=Math.pow(2,-V),H=Math.floor(E.image.width*Z),vt=Math.floor(E.image.height*Z),It=B!==null?B.x:0,Nt=B!==null?B.y:0;w.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,V,0,0,It,Nt,H,vt),q.unbindTexture()},this.copyTextureToTexture=function(E,B,V=null,Z=null,H=0){E.isTexture!==!0&&(vs("WebGLRenderer: copyTextureToTexture function signature has changed."),Z=arguments[0]||null,E=arguments[1],B=arguments[2],H=arguments[3]||0,V=null);let vt,It,Nt,zt,Xt,Wt,Ft,ee,ne;const oe=E.isCompressedTexture?E.mipmaps[H]:E.image;V!==null?(vt=V.max.x-V.min.x,It=V.max.y-V.min.y,Nt=V.isBox3?V.max.z-V.min.z:1,zt=V.min.x,Xt=V.min.y,Wt=V.isBox3?V.min.z:0):(vt=oe.width,It=oe.height,Nt=oe.depth||1,zt=0,Xt=0,Wt=0),Z!==null?(Ft=Z.x,ee=Z.y,ne=Z.z):(Ft=0,ee=0,ne=0);const Le=kt.convert(B.format),se=kt.convert(B.type);let Ht;B.isData3DTexture?(w.setTexture3D(B,0),Ht=F.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(w.setTexture2DArray(B,0),Ht=F.TEXTURE_2D_ARRAY):(w.setTexture2D(B,0),Ht=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,B.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,B.unpackAlignment);const ln=F.getParameter(F.UNPACK_ROW_LENGTH),ae=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Te=F.getParameter(F.UNPACK_SKIP_PIXELS),vn=F.getParameter(F.UNPACK_SKIP_ROWS),ze=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,oe.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,oe.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,zt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Xt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Wt);const si=E.isDataArrayTexture||E.isData3DTexture,de=B.isDataArrayTexture||B.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const $e=lt.get(E),Ln=lt.get(B),Oe=lt.get($e.__renderTarget),Mn=lt.get(Ln.__renderTarget);q.bindFramebuffer(F.READ_FRAMEBUFFER,Oe.__webglFramebuffer),q.bindFramebuffer(F.DRAW_FRAMEBUFFER,Mn.__webglFramebuffer);for(let yn=0;yn<Nt;yn++)si&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,lt.get(E).__webglTexture,H,Wt+yn),E.isDepthTexture?(de&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,lt.get(B).__webglTexture,H,ne+yn),F.blitFramebuffer(zt,Xt,vt,It,Ft,ee,vt,It,F.DEPTH_BUFFER_BIT,F.NEAREST)):de?F.copyTexSubImage3D(Ht,H,Ft,ee,ne+yn,zt,Xt,vt,It):F.copyTexSubImage2D(Ht,H,Ft,ee,ne+yn,zt,Xt,vt,It);q.bindFramebuffer(F.READ_FRAMEBUFFER,null),q.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else de?E.isDataTexture||E.isData3DTexture?F.texSubImage3D(Ht,H,Ft,ee,ne,vt,It,Nt,Le,se,oe.data):B.isCompressedArrayTexture?F.compressedTexSubImage3D(Ht,H,Ft,ee,ne,vt,It,Nt,Le,oe.data):F.texSubImage3D(Ht,H,Ft,ee,ne,vt,It,Nt,Le,se,oe):E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,H,Ft,ee,vt,It,Le,se,oe.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,H,Ft,ee,oe.width,oe.height,Le,oe.data):F.texSubImage2D(F.TEXTURE_2D,H,Ft,ee,vt,It,Le,se,oe);F.pixelStorei(F.UNPACK_ROW_LENGTH,ln),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ae),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Te),F.pixelStorei(F.UNPACK_SKIP_ROWS,vn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,ze),H===0&&B.generateMipmaps&&F.generateMipmap(Ht),q.unbindTexture()},this.copyTextureToTexture3D=function(E,B,V=null,Z=null,H=0){return E.isTexture!==!0&&(vs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,Z=arguments[1]||null,E=arguments[2],B=arguments[3],H=arguments[4]||0),vs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,B,V,Z,H)},this.initRenderTarget=function(E){lt.get(E).__webglFramebuffer===void 0&&w.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?w.setTextureCube(E,0):E.isData3DTexture?w.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?w.setTexture2DArray(E,0):w.setTexture2D(E,0),q.unbindTexture()},this.resetState=function(){C=0,A=0,T=null,q.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}class Vx extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Pn,this.environmentIntensity=1,this.environmentRotation=new Pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Xx{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Bo,this.updateRanges=[],this.version=0,this.uuid=ti()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ti()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ti()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const He=new Y;class Ia{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix4(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyNormalMatrix(t),this.setXYZ(e,He.x,He.y,He.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.transformDirection(t),this.setXYZ(e,He.x,He.y,He.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Tn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=le(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=le(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=le(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=le(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=le(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Tn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Tn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Tn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Tn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=le(e,this.array),i=le(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=le(e,this.array),i=le(i,this.array),s=le(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=le(e,this.array),i=le(i,this.array),s=le(s,this.array),a=le(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new xn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ia(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class $d extends Ei{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Yt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Xi;const ms=new Y,Wi=new Y,$i=new Y,Yi=new Zt,gs=new Zt,Yd=new me,ia=new Y,_s=new Y,sa=new Y,Wl=new Zt,kr=new Zt,$l=new Zt;class Wx extends be{constructor(t=new $d){if(super(),this.isSprite=!0,this.type="Sprite",Xi===void 0){Xi=new je;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Xx(e,5);Xi.setIndex([0,1,2,0,2,3]),Xi.setAttribute("position",new Ia(i,3,0,!1)),Xi.setAttribute("uv",new Ia(i,2,3,!1))}this.geometry=Xi,this.material=t,this.center=new Zt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Wi.setFromMatrixScale(this.matrixWorld),Yd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),$i.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Wi.multiplyScalar(-$i.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;aa(ia.set(-.5,-.5,0),$i,r,Wi,s,a),aa(_s.set(.5,-.5,0),$i,r,Wi,s,a),aa(sa.set(.5,.5,0),$i,r,Wi,s,a),Wl.set(0,0),kr.set(1,0),$l.set(1,1);let o=t.ray.intersectTriangle(ia,_s,sa,!1,ms);if(o===null&&(aa(_s.set(-.5,.5,0),$i,r,Wi,s,a),kr.set(0,1),o=t.ray.intersectTriangle(ia,sa,_s,!1,ms),o===null))return;const c=t.ray.origin.distanceTo(ms);c<t.near||c>t.far||e.push({distance:c,point:ms.clone(),uv:Qe.getInterpolation(ms,ia,_s,sa,Wl,kr,$l,new Zt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function aa(n,t,e,i,s,a){Yi.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(gs.x=a*Yi.x-s*Yi.y,gs.y=s*Yi.x+a*Yi.y):gs.copy(Yi),n.copy(t),n.x+=gs.x,n.y+=gs.y,n.applyMatrix4(Yd)}class hc extends Ei{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Yt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ka=new Y,Ua=new Y,Yl=new me,xs=new oc,ra=new Ba,Ur=new Y,Zl=new Y;class $x extends be{constructor(t=new je,e=new hc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)ka.fromBufferAttribute(e,s-1),Ua.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=ka.distanceTo(Ua);t.setAttribute("lineDistance",new Ee(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ra.copy(i.boundingSphere),ra.applyMatrix4(s),ra.radius+=a,t.ray.intersectsSphere(ra)===!1)return;Yl.copy(s).invert(),xs.copy(t.ray).applyMatrix4(Yl);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const u=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let _=u,m=g-1;_<m;_+=l){const p=d.getX(_),x=d.getX(_+1),v=oa(this,t,xs,c,p,x);v&&e.push(v)}if(this.isLineLoop){const _=d.getX(g-1),m=d.getX(u),p=oa(this,t,xs,c,_,m);p&&e.push(p)}}else{const u=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let _=u,m=g-1;_<m;_+=l){const p=oa(this,t,xs,c,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=oa(this,t,xs,c,g-1,u);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function oa(n,t,e,i,s,a){const r=n.geometry.attributes.position;if(ka.fromBufferAttribute(r,s),Ua.fromBufferAttribute(r,a),e.distanceSqToSegment(ka,Ua,Ur,Zl)>i)return;Ur.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ur);if(!(c<t.near||c>t.far))return{distance:c,point:Zl.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const ql=new Y,jl=new Y;class Zd extends $x{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)ql.fromBufferAttribute(e,s),jl.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+ql.distanceTo(jl);t.setAttribute("lineDistance",new Ee(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Yx extends We{constructor(t,e,i,s,a,r,o,c,l){super(t,e,i,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class uc extends je{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],r=[];o(s),l(i),d(),this.setAttribute("position",new Ee(a,3)),this.setAttribute("normal",new Ee(a.slice(),3)),this.setAttribute("uv",new Ee(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const v=new Y,y=new Y,L=new Y;for(let C=0;C<e.length;C+=3)u(e[C+0],v),u(e[C+1],y),u(e[C+2],L),c(v,y,L,x)}function c(x,v,y,L){const C=L+1,A=[];for(let T=0;T<=C;T++){A[T]=[];const b=x.clone().lerp(y,T/C),S=v.clone().lerp(y,T/C),D=C-T;for(let O=0;O<=D;O++)O===0&&T===C?A[T][O]=b:A[T][O]=b.clone().lerp(S,O/D)}for(let T=0;T<C;T++)for(let b=0;b<2*(C-T)-1;b++){const S=Math.floor(b/2);b%2===0?(h(A[T][S+1]),h(A[T+1][S]),h(A[T][S])):(h(A[T][S+1]),h(A[T+1][S+1]),h(A[T+1][S]))}}function l(x){const v=new Y;for(let y=0;y<a.length;y+=3)v.x=a[y+0],v.y=a[y+1],v.z=a[y+2],v.normalize().multiplyScalar(x),a[y+0]=v.x,a[y+1]=v.y,a[y+2]=v.z}function d(){const x=new Y;for(let v=0;v<a.length;v+=3){x.x=a[v+0],x.y=a[v+1],x.z=a[v+2];const y=m(x)/2/Math.PI+.5,L=p(x)/Math.PI+.5;r.push(y,1-L)}g(),f()}function f(){for(let x=0;x<r.length;x+=6){const v=r[x+0],y=r[x+2],L=r[x+4],C=Math.max(v,y,L),A=Math.min(v,y,L);C>.9&&A<.1&&(v<.2&&(r[x+0]+=1),y<.2&&(r[x+2]+=1),L<.2&&(r[x+4]+=1))}}function h(x){a.push(x.x,x.y,x.z)}function u(x,v){const y=x*3;v.x=t[y+0],v.y=t[y+1],v.z=t[y+2]}function g(){const x=new Y,v=new Y,y=new Y,L=new Y,C=new Zt,A=new Zt,T=new Zt;for(let b=0,S=0;b<a.length;b+=9,S+=6){x.set(a[b+0],a[b+1],a[b+2]),v.set(a[b+3],a[b+4],a[b+5]),y.set(a[b+6],a[b+7],a[b+8]),C.set(r[S+0],r[S+1]),A.set(r[S+2],r[S+3]),T.set(r[S+4],r[S+5]),L.copy(x).add(v).add(y).divideScalar(3);const D=m(L);_(C,S+0,x,D),_(A,S+2,v,D),_(T,S+4,y,D)}}function _(x,v,y,L){L<0&&x.x===1&&(r[v]=x.x-1),y.x===0&&y.z===0&&(r[v]=L/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uc(t.vertices,t.indices,t.radius,t.details)}}const ca=new Y,la=new Y,Fr=new Y,da=new Qe;class Zx extends je{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(va*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],d=["a","b","c"],f=new Array(3),h={},u=[];for(let g=0;g<c;g+=3){r?(l[0]=r.getX(g),l[1]=r.getX(g+1),l[2]=r.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:p}=da;if(_.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),p.fromBufferAttribute(o,l[2]),da.getNormal(Fr),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const v=(x+1)%3,y=f[x],L=f[v],C=da[d[x]],A=da[d[v]],T=`${y}_${L}`,b=`${L}_${y}`;b in h&&h[b]?(Fr.dot(h[b].normal)<=a&&(u.push(C.x,C.y,C.z),u.push(A.x,A.y,A.z)),h[b]=null):T in h||(h[T]={index0:l[x],index1:l[v],normal:Fr.clone()})}}for(const g in h)if(h[g]){const{index0:_,index1:m}=h[g];ca.fromBufferAttribute(o,_),la.fromBufferAttribute(o,m),u.push(ca.x,ca.y,ca.z),u.push(la.x,la.y,la.z)}this.setAttribute("position",new Ee(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class fc extends uc{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new fc(t.radius,t.detail)}}class qi extends je{constructor(t=.5,e=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],l=[],d=[];let f=t;const h=(e-t)/s,u=new Y,g=new Zt;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){const p=a+m/i*r;u.x=f*Math.cos(p),u.y=f*Math.sin(p),c.push(u.x,u.y,u.z),l.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,d.push(g.x,g.y)}f+=h}for(let _=0;_<s;_++){const m=_*(i+1);for(let p=0;p<i;p++){const x=p+m,v=x,y=x+i+1,L=x+i+2,C=x+1;o.push(v,y,C),o.push(y,L,C)}}this.setIndex(o),this.setAttribute("position",new Ee(c,3)),this.setAttribute("normal",new Ee(l,3)),this.setAttribute("uv",new Ee(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Va extends je{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],c=[],l=[],d=new Y,f=new Y,h=new Y;for(let u=0;u<=i;u++)for(let g=0;g<=s;g++){const _=g/s*a,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(_),f.y=(t+e*Math.cos(m))*Math.sin(_),f.z=e*Math.sin(m),o.push(f.x,f.y,f.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),h.subVectors(f,d).normalize(),c.push(h.x,h.y,h.z),l.push(g/s),l.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=s;g++){const _=(s+1)*u+g-1,m=(s+1)*(u-1)+g-1,p=(s+1)*(u-1)+g,x=(s+1)*u+g;r.push(_,m,x),r.push(m,p,x)}this.setIndex(r),this.setAttribute("position",new Ee(o,3)),this.setAttribute("normal",new Ee(c,3)),this.setAttribute("uv",new Ee(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Va(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ts extends Ei{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rd,this.normalScale=new Zt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=tc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class qd extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class qx extends qd{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Nr=new me,Kl=new Y,Jl=new Y;class jx{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Zt(512,512),this.map=null,this.mapPass=null,this.matrix=new me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lc,this._frameExtents=new Zt(1,1),this._viewportCount=1,this._viewports=[new Se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Kl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Kl),Jl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Jl),e.updateMatrixWorld(),Nr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Nr),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Nr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Kx extends jx{constructor(){super(new Bd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Jx extends qd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new Kx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Ql=new me;class Qx{constructor(t,e,i=0,s=1/0){this.ray=new oc(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new cc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Ql.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ql),this}intersectObject(t,e=!0,i=[]){return Vo(t,this,i,e),i.sort(td),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)Vo(t[s],this,i,e);return i.sort(td),i}}function td(n,t){return n.distance-t.distance}function Vo(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)Vo(a[r],t,e,!0)}}class tv extends Zd{constructor(t=10,e=10,i=4473924,s=8947848){i=new Yt(i),s=new Yt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let h=0,u=0,g=-o;h<=e;h++,g+=r){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=h===a?i:s;_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3,_.toArray(l,u),u+=3}const d=new je;d.setAttribute("position",new Ee(c,3)),d.setAttribute("color",new Ee(l,3));const f=new hc({vertexColors:!0,toneMapped:!1});super(d,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Qo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Qo);const ev={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function nv(n,t,e,i){const s=new rn(n.fov,i,.1,200),a=new Y,r=new Y,o=new Y;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function h(){const u=(n.pitchDeg+d.pitchDelta)*Math.PI/180,g=n.yawDeg*Math.PI/180;o.set(Math.sin(g)*Math.cos(u),Math.sin(u),Math.cos(g)*Math.cos(u)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return h(),{camera:s,update(u,g,_,m,p=ev){const x=g+.6;if(!c)a.set(u,x,_),c=!0;else{const L=1-Math.exp(-Math.max(n.smoothing,.001)*m);a.x+=(u-a.x)*L,a.y+=(x-a.y)*L,a.z+=(_-a.z)*L}const v=1-Math.exp(-Math.max(t.smoothing,.001)*m);d.distanceScale+=(p.distanceScale-d.distanceScale)*v,d.offsetX+=(p.offsetX-d.offsetX)*v,d.offsetZ+=(p.offsetZ-d.offsetZ)*v,d.pitchDelta+=(p.pitchDelta-d.pitchDelta)*v;const y=1-Math.exp(-Math.max(e.smoothing,.001)*m);d.zoom+=(f-d.zoom)*y,h(),(s.fov!==l||s.fov!==n.fov)&&(s.fov=n.fov,l=n.fov,s.updateProjectionMatrix()),r.set(a.x+d.offsetX,a.y,a.z+d.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new Y().setFromMatrixColumn(s.matrixWorld,0),g=new Y().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(u.x,u.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:u.x/_,rightZ:u.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...d}}}}const Mi=Math.PI*2,mn=1e-6;function ii(n,t,e){return n<t?t:n>e?e:n}function jd(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function iv(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Kd(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=iv(n);return i===1?s:e+(s-e)*i}function ed(n){return(1-Math.sin(n))/2}function pc(n,t){if(!n.grounded||n.speed<mn)return jd();const e=n.speed/Math.max(n.moveSpeed,mn),i=Math.max(n.legLength,mn),s=n.stride>mn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),r=i*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(n.localForward),c=Math.abs(n.localRight),l=o+c+mn,d=o/l,f=c/l,h=n.localForward>=0?1:-1,u=n.localRight>=0?1:-1,g=s,_=k=>Math.asin(ii(k,-r,r)/i);function m(k,W){const P=Kd(k,t.plantLock),R=ed(k),X=h*d*g*P,U=-_(X),N=W*u>0?1:-1,tt=1+N*t.crossStep*.45,ht=u*N*t.crossStep*g*.4*R,nt=u*f*g*t.sideWeight*tt*P+ht*f,gt=_(nt),j=t.kneeLift*R*a*(.55+.25*d+(N>0?.2*f:0));return{pitchX:U,rollZ:gt,kneeX:j}}const p=(n.phase%Mi+Mi)%Mi,x=m(p,-1),v=m((p+Math.PI)%Mi,1),y=Math.cos(p),L=ed(p),C=-t.comSway*a*y*(.6*d+.8*f)-u*t.comSway*a*f*.45,A=t.comBob*L*a,T=u*t.hipLean*a*f*y*.6,b=u*t.hipLean*a*f*(.45+.25*y),S=t.armSwing*a*y*(d*h+.3*f),D=S,O=-S;return{legL:x,legR:v,pelvisX:C,pelvisY:A,pelvisRoll:T,sideLean:b,armL:D,armR:O,strafe:f,backward:h<0?d:0}}function Jd(n){const t=(n%Mi+Mi)%Mi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Qd(n,t,e){const i=ii(e.progress,0,1);if(i>=1||n.speed<mn)return jd();const s=i*i*(3-2*i),a=1-s;return pc({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function th(n,t,e,i){const s=ii(n,-1,1),a=Math.abs(s),r=Math.min(1,t*(1+Math.max(0,i)*a*a));return ii(r*s,-1,1)*(e*Math.PI/180)}function eh(n,t,e,i,s){const a=Math.max(e,mn),r=Math.max(0,i)*a,o=Math.max(0,s)*a,c=t>mn?(t-n)/t:0,l=c>.02,d=c<-.015,f=n<=r*.15,h=!d&&n<o&&(l||f);return{enter:n>mn&&n<=r&&l,resume:!h}}function nh(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return ii(n*ii(t,0,2),-i,i)}function ih(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),r=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*r}}function sh(n,t,e,i,s){const a=ii(n,0,1),r=ii(s.stopPeakRatio,.05,.95),o=a<=r?a/r:(a-r)/(1-r),c=o*o*(3-2*o),l=a<=r?c:1-c,d=Math.hypot(e,i),f=d>mn?e/d:1,h=d>mn?i/d:0,u=Kd(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*l,trailPitch:Math.max(0,s.stopTrailPitch)*l,leadKnee:Math.max(0,s.stopStepKnee)*l,bodyShift:Math.max(0,s.stopBodyShift)*l,bodyDip:Math.max(0,s.stopBodyDip)*l,chestPitch:Math.max(0,s.stopChestPitch)*l,leadLeft:u,fwdN:f,rightN:h,env:l}}function Xe(n){return n<0?0:n>1?1:n}const ya=Math.PI*2;function sv(n){return((n+Math.PI)%ya+ya)%ya-Math.PI}function av(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function rv(n,t,e,i,s,a=n.phase){const r=Xe(i);if(r<=0)return n;const o=Xe(t),c=Math.max(1,Math.round(s.cycles)),l=Math.max(0,s.strideSpeed),d=e%2===0?1:-1,f=Xe(s.forwardBias),h=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*h,g=o<=.5?o*2:(o-.5)*2,_=g*g*(3-2*g),m=o<=.5?_:1-_,p={speed:l,phase:a+ya*c/2*m,localForward:l*f,localRight:l*(1-f)*d},x=sv(p.phase-n.phase),v=r*r*(3-2*r);return{speed:n.speed+(p.speed-n.speed)*r,phase:n.phase+x*v,localForward:n.localForward+(p.localForward-n.localForward)*r,localRight:n.localRight+(p.localRight-n.localRight)*r,stride:u*r*r}}function ov(n,t,e){const i=av(),s=Xe(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,d=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=o?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=o?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-f*r,i.legR.rollZ=f*r,i.pelvisX=e.stepSway*a*r,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*r,i}function ah(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function nd(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*ah(a,s)}function cv(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),r=n+(s-n)*a;return t&&r>.999?1:!t&&r<.001?0:r}function lv(n,t,e){const i=Xe(n);return{gaitScale:1-i*(1-Xe(t)),attackLegWeight:Xe(e)*i}}function dv(n,t){const e=Xe(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function hv(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Xe(t.minScale+(1-t.minScale)*e)}function uv(){return rh()}function rh(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function fv(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function pv(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Xe(t.forceHitHeight):n.type==="light"?Xe(t.hitHeight.light):n.type==="heavy"?Xe(t.hitHeight.heavy):n.type==="knock"?Xe(t.hitHeight.knock):0}function mv(n,t,e){const i=Xe(e),s=(a,r)=>a+(r-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function oh(n,t,e){const i=rh(),s=fv(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=Xe(1-n.timer/n.duration),r=ah(a,e.pulseRatio);i.pulse=r,i.active=r>0,i.hitHeight=pv(n,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),f=n.dirX*o+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=f,i.localRight=h,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*a);return i.upperPitch=s*_*f,i.upperRoll=-s*_*h*.7,i.drop=(s>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const u=s*r,g=mv(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*h,i.upperYaw=u*g.upperYaw*h,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*r,i}function ch(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,r=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*r}}const ui=1e-6;function Ss(n,t,e){return n<t?t:n>e?e:n}function gv(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=ui||a<=ui||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+ui,l=Math.hypot(n.x,n.y,n.z);if(l<=ui)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),h=n.z,u=Math.hypot(h,f),g=Ss(u,c,o),_=u>o+ui||u<c-ui,m=Math.atan2(-h,Math.max(f,ui)),p=Ss((s*s+g*g-a*a)/(2*s*g),-1,1),x=Ss((a*a+g*g-s*s)/(2*a*g),-1,1),v=Math.acos(p),y=Math.acos(x),L=i>=0?1:-1;return{rootPitch:m-L*v,rootRoll:d,jointPitch:L*(v+y),clamped:_,reach:l/o}}function _v(n,t,e,i){const s=Ss(e,0,1),a=Math.max(0,i),r=(o,c)=>{const l=Ss((c-o)*s,-a,a);return o+l};return{rootPitch:r(n.rootPitch,t.rootPitch),rootRoll:r(n.rootRoll,t.rootRoll),jointPitch:r(n.jointPitch,t.jointPitch)}}function lh(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const mc={active:!1,weight:0,clamped:0,maxError:0};function dh(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:r}=n;if(!r.enabled||r.weight<=0||!n.grounded||s.length===0)return{...mc};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(u=>u.tip.getWorldPosition(new Y));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,i.position.copy(o.lowerPos),i.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(n.attacking?Math.max(0,Math.min(1,r.attackScale)):1),d=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const g=s[u],_=i.worldToLocal(c[u].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=gv(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const x=_v({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,l,d);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let u=0;u<s.length;u++){const g=s[u].tip.getWorldPosition(new Y);h=Math.max(h,g.distanceTo(c[u]))}return{active:!0,weight:l,clamped:f,maxError:h}}function sn(n,t,e){return n<t?t:n>e?e:n}const xv={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function vv(n,t,e,i,s,a,r,o,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new De,h=new De;h.name="pelvis",h.position.y=n.legLength,f.add(h);const u=new De;u.name="lower";const g=new De;g.name="upper",h.add(u),h.add(g);const _=[],m=($,ct,_t,Pt)=>{const ft=new Ts({color:Pt}),xt=new pe(new Dn($,ct,_t),ft);return xt.castShadow=!0,xt.receiveShadow=!0,_.push(ft),xt},p=n.headSize,x=n.legLength,v=n.armLength,y=n.limbThickness,L=n.bodyHeight,C=n.bodyWidth,A=m(C,L,.28,e);A.position.y=L/2,g.add(A);const T=new De;T.name="headPivot",T.position.y=L,g.add(T);const b=m(p,p,p,e);b.position.y=p/2,T.add(b);for(const $ of[-1,1]){const ct=m(.06,.07,.02,t.shoe);ct.position.set($*.09,p/2+.03,p/2+.011),T.add(ct)}const S=($,ct)=>{const _t=ct?v:x,Pt=new De;Pt.name=ct?$<0?"shoulderL":"shoulderR":$<0?"hipL":"hipR",ct||(Pt.rotation.order="ZYX"),Pt.position.set($*(ct?C/2+y/2:C/2-y/2),ct?L-.04:0,0),(ct?g:u).add(Pt);const ft=m(y,_t/2,y,t.limb);ft.position.y=-_t/4,Pt.add(ft);const xt=new De;xt.name=ct?"elbow":"knee",xt.position.y=-_t/2,Pt.add(xt);const z=m(y,_t/2,y,t.limb);if(z.position.y=-_t/4,xt.add(z),!ct){const ot=m(y*1.15,.07,y*1.7,t.shoe);ot.position.set(0,-_t/2+.035,.045),xt.add(ot);const ut=new be;return ut.name="footTip",ut.position.y=-_t/2,xt.add(ut),{root:Pt,joint:xt,tip:ut}}return{root:Pt,joint:xt}},D=S(-1,!1),O=S(1,!1),k=S(-1,!0),W=S(1,!0),P=[D,O].map($=>({root:$.root,joint:$.joint,tip:$.tip,upperLen:x/2,lowerLen:x/2,bend:1})),R=new En({color:s.attackArcColor,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),X=new pe(new Va(.62,.042,6,20,Math.PI*1.1),R);X.position.set(0,.78-x,.56),g.add(X);const U=document.createElement("canvas");U.width=256,U.height=72;const N=U.getContext("2d"),tt=new Yx(U),ht=new $d({map:tt,transparent:!0,depthTest:!1,depthWrite:!1}),nt=new Wx(ht);nt.scale.set(1.85,.52,1),nt.position.y=1.7-x,nt.renderOrder=20,g.add(nt);function gt($){N&&(N.clearRect(0,0,256,72),N.fillStyle=s.labelBg,N.fillRect(0,0,256,72),N.strokeStyle=e,N.lineWidth=5,N.strokeRect(3,3,250,66),N.fillStyle=e,N.font="bold 29px ui-monospace, Menlo, Consolas, monospace",N.textAlign="center",N.textBaseline="middle",N.fillText(`${i} ${xv[$]}`,128,38),tt.needsUpdate=!0)}const j=new Yt(e),Q=new Yt(o.flashColor),pt=new Yt;let K=null,mt=0,wt=0,Ct=0,Ut=0,At=0,Lt=0,F=0,Qt={...mc},Et=-1,Rt=0,q=0,dt=0,lt=0,w=0,M=0,G=0,et=1,st=0,it=0;return{group:f,update($,ct){f.position.set($.position.x,$.position.y,$.position.z),f.rotation.y=$.bodyYaw,T.rotation.y=($.headYaw-$.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,$.mode!==K&&(K=$.mode,gt($.mode),mt=1),mt=Math.max(0,mt-ct*2.2);const _t=$.hurt,Pt=oh(_t,$.bodyYaw,o),ft=Pt.flash;pt.copy(Q).multiplyScalar(ft);for(const V of _)V.emissive.copy(j).multiplyScalar(mt*.5),ft>0&&V.emissive.add(pt);h.position.set(0,x,0),h.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const xt=Math.hypot($.velocity.x,$.velocity.z),z=sn(r.knockGaitScale??0,0,1),ot=$.hurt.knockX*z,ut=$.hurt.knockZ*z,Ot=z>0&&Math.hypot($.hurt.knockX,$.hurt.knockZ)>.001,kt=$.velocity.x+ot,Gt=$.velocity.z+ut,I=Math.hypot(kt,Gt),yt=Math.cos($.bodyYaw),J=-Math.sin($.bodyYaw),at=xt>1e-6?sn(($.velocity.x*yt+$.velocity.z*J)/xt,-1,1):0,bt=th(at,r.strafeHipScale,r.strafeHipMaxDeg,r.strafeHipBoost);st+=(bt-st)*(1-Math.exp(-12*Math.max(0,ct))),u.rotation.y=st;const Mt=$.bodyYaw+st,Bt=Math.sin(Mt),Kt=Math.cos(Mt),ie=Math.cos(Mt),$t=-Math.sin(Mt),ge=kt*Bt+Gt*Kt,ye=kt*ie+Gt*$t,tn=Math.max(0,r.stopBlendSec||0),en=tn>0&&!Ot,fe=eh(xt,it,a,r.stopEnterRatio,r.stopExitRatio);if(!en||fe.resume)Et=-1;else if(Et<0&&fe.enter){Et=0,Rt=$.gaitPhase,q=Jd($.gaitPhase),dt=xt,lt=Math.max($.stride,1e-6),w=ge,M=ye;const V=1/Math.max(1e-6,xt);G=$.velocity.x*V,et=$.velocity.z*V}it=xt;const _e=en&&Et>=0;_e&&(Et=Math.min(1,Et+ct/tn));const Fe=_e?{phase:Rt,speed:dt,moveSpeed:a,localForward:w,localRight:M,legLength:n.legLength,stride:lt,grounded:!0}:{phase:$.gaitPhase,speed:I,moveSpeed:a,localForward:ge,localRight:ye,legLength:n.legLength,stride:$.stride,grounded:!0},he=_e?Qd(Fe,r,{progress:Et,phase0:Rt,phaseEnd:q}):pc(Fe,r);let Ne=0,rt=0,St=0,Tt=0;if(_e){const V=ih($.bodyYaw,G,et),Z=sh(Et,Rt,V.forward,V.right,r);Z.leadLeft?(he.legL.pitchX-=Z.leadPitch,he.legL.kneeX+=Z.leadKnee,he.legR.pitchX+=Z.trailPitch):(he.legR.pitchX-=Z.leadPitch,he.legR.kneeX+=Z.leadKnee,he.legL.pitchX+=Z.trailPitch),rt=Z.bodyShift*Z.fwdN,Ne=Z.bodyShift*Z.rightN,St=Z.bodyDip,Tt=Z.chestPitch}D.root.rotation.x=he.legL.pitchX,O.root.rotation.x=he.legR.pitchX,D.root.rotation.z=he.legL.rollZ,O.root.rotation.z=he.legR.rollZ,D.joint.rotation.x=he.legL.kneeX,O.joint.rotation.x=he.legR.kneeX,k.root.rotation.x=he.armL,W.root.rotation.x=he.armR,k.joint.rotation.x=-.18,W.joint.rotation.x=-.18,h.position.x=he.pelvisX,h.position.y=x+he.pelvisY,h.position.z=0,h.rotation.z=he.pelvisRoll,g.rotation.z=he.sideLean*(Pt.intensity>0?.4:1);const Vt=lh(h,u);h.position.x+=Ne,h.position.z+=rt,u.position.x-=Ne,u.position.z-=rt;const te=d.enabled?sn(d.weight,0,1):0;if(h.position.y-=St,u.position.y+=St*(1-te),c){const V=Math.max(.004166666666666667,Math.min(ct,.1)),Z=Math.sin($.bodyYaw),H=Math.cos($.bodyYaw),vt=sn(($.velocity.x-wt)/V,-60,60),It=sn(($.velocity.z-Ct)/V,-60,60),Nt=vt*Z+It*H,zt=Cn($.bodyYaw-Ut)/V,Xt=c.maxForwardDeg*Math.PI/180,Wt=c.maxSideDeg*Math.PI/180,Ft=1-Math.exp(-Math.max(0,c.smoothing)*V);At+=(sn(Nt*c.accelGain,-Xt,Xt)-At)*Ft,Lt+=(sn(-zt*xt*c.turnGain,-Wt,Wt)-Lt)*Ft;const ee=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;F+=(sn(xt/Math.max(a,1e-6),0,1)-F)*(1-Math.exp(-Math.max(0,ee)*V));const ne=ch({leanForward:At,leanSide:Lt,speedRatio:F},c);g.rotation.x+=At+Tt,g.rotation.z+=Lt,h.rotation.x+=ne.pelvisPitch,h.rotation.z+=ne.pelvisRoll,h.position.x+=ne.pelvisX,h.position.z+=ne.pelvisZ,h.position.y-=ne.crouch;const oe=d.enabled?sn(d.weight,0,1):0;u.position.y+=ne.crouch*(1-oe)}wt=$.velocity.x,Ct=$.velocity.z,Ut=$.bodyYaw,g.rotation.x+=Pt.upperPitch,g.rotation.z+=Pt.upperRoll,g.rotation.y+=Pt.upperYaw;const Jt=sn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),xe=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=sn(Pt.upperShiftX*Jt,-xe,xe),g.position.z+=sn(Pt.upperShiftZ*Jt,-xe,xe),h.position.x+=Pt.comX,h.position.z+=Pt.comZ-Pt.pelvisBack,h.position.y-=Pt.drop;const E=Pt.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(u.position.z+=Pt.pelvisBack*(1-E),u.position.y+=Pt.drop*(1-E),D.joint.rotation.x+=Pt.knee,O.joint.rotation.x+=Pt.knee,D.root.rotation.x-=Pt.hip,O.root.rotation.x-=Pt.hip,k.root.rotation.x+=Pt.arm,W.root.rotation.x+=Pt.arm*.8,$.attackPhase!=="idle"&&Pt.intensity===0){const V=$.attackProgress,Z=V<.34?-1:V<.68?-1+(V-.34)/.34*2:Math.max(0,1-(V-.68)/.32),H=Math.max(0,-Z),vt=Math.max(0,Z);W.root.rotation.x=-1.7*H+1.25*vt,W.joint.rotation.x=-(.25+H*.45),g.rotation.y=-.28*Z,R.opacity=$.attackPhase==="active"?.85:0,$.attackPhase==="active"&&(X.rotation.z=-1.1+V*3)}else R.opacity=0;const B=nh(st,r.chestYawScale,r.chestYawMaxDeg);g.rotation.y+=B,T.rotation.y=($.headYaw-$.bodyYaw-B+Math.PI*3)%(Math.PI*2)-Math.PI,Qt=dh({root:f,pelvis:h,lower:u,limbs:P,base:Vt,cfg:d,grounded:!0,attacking:$.attackPhase!=="idle"})},ik(){return Qt},dispose(){f.traverse($=>{if($ instanceof pe){$.geometry.dispose();const ct=$.material;Array.isArray(ct)?ct.forEach(_t=>_t.dispose()):ct.dispose()}}),tt.dispose(),ht.dispose()}}}function hh(n){return{x:0,y:0,z:1}}function Mv(n){return Math.asin(hh().y)}function yv(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}function Ie(n,t,e){return n<t?t:n>e?e:n}const ha=1e-6;function Me(n,t,e,i){const s=new pe(new Dn(n,t,e),new Ts({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function Ae(){return new De}function Sa(n,t,e){const i=Ae(),s=Me(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=Me(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const r=Me(t*.38,n,t,e.blade);r.position.y=.13+n/2,i.add(r);const o=Me(t*.42,n*.96,t*.2,e.bladeEdge);o.position.set(0,.13+n/2,t*.5),i.add(o);const c=Me(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function Sv(n){const t=Sa(.72,.15,n),e=Me(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function bv(n){const t=Ae(),e=Me(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Me(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function Ev(n){const t=Ae(),e=Me(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Me(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new Yt(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function wv(n){const t=Ae();for(let i=0;i<5;i++){const s=(i-2)*.15,a=Me(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=Me(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Tv(n){const t=Ae(),e=Me(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Me(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function Av(n,t,e,i,s,a,r,o,c,l,d){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},h=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=Ae(),g=Ae();g.name="pelvis",g.position.y=n.legLength,u.add(g);const _=Ae();_.name="lower";const m=Ae();m.name="upper",g.add(_),g.add(m);const p=n.headSize,x=n.legLength,v=n.armLength,y=n.limbThickness,L=n.bodyHeight,C=n.bodyWidth,A=Me(C,L,.28,t.body);A.position.y=L/2,m.add(A);const T=Ae();T.name="headPivot",T.position.y=i.headPivotHeight,m.add(T);const b=Me(p,p,p,t.head);b.position.y=p/2,T.add(b);const S=new Ts({color:"#1b2733"});for(const rt of[-1,1]){const St=new pe(new Dn(.06,.07,.02),S);St.position.set(rt*.09,p/2+.03,p/2+.011),T.add(St)}const D=rt=>{const St=Ae();St.name=rt<0?"hipL":"hipR",St.rotation.order="ZYX",St.position.set(rt*(C/2-y/2),0,0),_.add(St);const Tt=Me(y,x/2,y,t.limb);Tt.position.y=-x/4,St.add(Tt);const Vt=Ae();Vt.name="knee",Vt.position.y=-x/2,St.add(Vt);const te=Me(y,x/2,y,t.limb);te.position.y=-x/4,Vt.add(te);const Jt=Me(y*1.15,.07,y*1.7,t.shoe);Jt.position.set(0,-x/2+.035,.045),Vt.add(Jt);const xe=new be;return xe.name="footTip",xe.position.y=-x/2,Vt.add(xe),{root:St,joint:Vt,hand:Ae(),tip:xe}},O=rt=>{const St=Ae();St.name=rt<0?"shoulderL":"shoulderR",St.position.set(rt*(C/2+y/2),L-.04,0),m.add(St);const Tt=Me(y,v/2,y,t.limb);Tt.position.y=-v/4,St.add(Tt);const Vt=Ae();Vt.name="elbow",Vt.position.y=-v/2,St.add(Vt);const te=Me(y,v/2,y,t.limb);te.position.y=-v/4,Vt.add(te);const Jt=Ae();Jt.position.y=-v/2,Vt.add(Jt);const xe=Me(y*1.1,.09,y*1.1,t.head);return xe.position.y=.045,Jt.add(xe),{root:St,joint:Vt,hand:Jt}},k=D(-1),W=D(1),P=O(-1),R=O(1),X=[k,W].map(rt=>({root:rt.root,joint:rt.joint,tip:rt.tip,upperLen:x/2,lowerLen:x/2,bend:1})),U=Ae(),N=Ae();R.hand.add(U),P.hand.add(N);const tt=Ev(t),ht=wv(t),nt=Tv(t),gt={"sword-shield":{right:Sa(.42,.075,t),left:bv(t)},"dual-swords":{right:Sa(.42,.075,t),left:Sa(.42,.075,t)},greatsword:{right:Sv(t),left:Me(.12,.2,.12,t.wood)},staff:{right:tt.g,left:Ae(),orb:tt.orb},bow:{right:nt,left:ht.g,arrow:nt,drawString:ht.drawString}};for(const rt of Object.keys(gt))U.add(gt[rt].right),N.add(gt[rt].left),gt[rt].right.visible=!1,gt[rt].left.visible=!1;let j=null,Q=0,pt=0,K=0,mt=0,wt=0,Ct=0,Ut=uv(),At={...mc},Lt=0,F=0,Qt=0,Et=-1,Rt=0,q=0,dt=0,lt=0,w=0,M=0,G=0,et=1,st=0,it=0,$=0,ct=!1,_t=0,Pt=0,ft=0,xt=0,z=0,ot=0,ut=1,Ot={speed:0,phase:0},kt={lp:0,lr:0,rp:0,rr:0},Gt=0,I=0,yt=!0,J=0,at="none",bt=0,Mt=0,Bt=0,Kt=.3,ie=0;function $t(rt){const St=Math.PI/180,Tt=a;let Vt=0,te=0,Jt=0,xe=0;rt==="sword-shield"?(Vt=Tt.swordPitchDeg*St,te=-Tt.swordYawDeg*St,Jt=Tt.shieldPitchDeg*St):rt==="dual-swords"?(Vt=Tt.swordPitchDeg*St,te=-Tt.swordYawDeg*St,Jt=Tt.swordPitchDeg*St,xe=Tt.swordYawDeg*St):rt==="greatsword"?(Vt=Tt.greatswordPitchDeg*St,te=-Tt.greatswordYawDeg*St,Jt=Tt.greatswordPitchDeg*St,xe=Tt.greatswordYawDeg*St):rt==="staff"?Vt=Tt.staffPitchDeg*St:Jt=Tt.bowPitchDeg*St,U.rotation.set(Vt,0,te),N.rotation.set(Jt,0,xe)}function ge(rt){if(rt!==j){j=rt;for(const St of Object.keys(gt))gt[St].right.visible=St===rt,gt[St].left.visible=St===rt;$t(rt),ht.drawString.position.z=-.06,nt.position.z=0,tt.orb.scale.setScalar(1),m.rotation.y=0}}ge("sword-shield");const ye=[];u.traverse(rt=>{rt instanceof pe&&rt.material instanceof Ts&&ye.push(rt.material)});const tn=new Yt(o.flashColor);function en(rt,St){const Tt=oh(rt,St,o);Ut=Tt,m.rotation.x+=Tt.upperPitch,m.rotation.z+=Tt.upperRoll,m.rotation.y+=Tt.upperYaw;const Vt=Ie(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),te=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Ie(Tt.upperShiftX*Vt,-te,te),m.position.z+=Ie(Tt.upperShiftZ*Vt,-te,te),g.position.x+=Tt.comX,g.position.z+=Tt.comZ-Tt.pelvisBack,g.position.y-=Tt.drop;const Jt=Tt.legacy?0:Ie(o.lowerScale,0,1);_.position.z+=Tt.pelvisBack*(1-Jt),_.position.y+=Tt.drop*(1-Jt),k.joint.rotation.x+=Tt.knee,W.joint.rotation.x+=Tt.knee,k.root.rotation.x-=Tt.hip,W.root.rotation.x-=Tt.hip,P.root.rotation.x+=Tt.arm,R.root.rotation.x+=Tt.arm*.8;for(const xe of ye)xe.emissive.copy(tn).multiplyScalar(Tt.flash)}function fe(rt){return rt<.3?-1:rt<.62?-1+(rt-.3)/.32*2:Math.max(0,1-(rt-.62)/.38)}function _e(rt){if(rt.phase==="idle"||rt.charging)return;const St=rt.attackProgress,Tt=fe(St),Vt=Math.max(0,Tt),te=rt.comboIndex%2===0?1:-1,Jt=c.stride,xe=Number.isFinite(Jt.stepReach)?Jt.stepReach:.17,E=Number.isFinite(Jt.stepSideReach)?Jt.stepSideReach:.14,B=Number.isFinite(Jt.stepDipReach)?Jt.stepDipReach:.05,V=rt.weapon==="greatsword"?Ie(Number.isFinite(Jt.heavyScale)?Jt.heavyScale:1,0,1):1;g.position.z+=xe*Vt*V,g.position.x+=te*E*Vt*V,g.position.y-=B*Math.sin(Math.PI*St)*V}function Fe(rt){if(ht.drawString.position.z=-.06,nt.position.z=0,tt.orb.scale.setScalar(1),m.rotation.y=0,rt.charging&&rt.weapon==="bow"){const te=rt.charge;P.root.rotation.x=-1.25,P.joint.rotation.x=-.15,R.root.rotation.x=.35+te*.3,R.joint.rotation.x=-1.15,ht.drawString.position.z=-.06-te*.22,nt.position.z=-te*.3,m.rotation.y=-.22;return}if(rt.phase==="idle")return;const St=fe(rt.attackProgress),Tt=Math.max(0,-St),Vt=Math.max(0,St);if(rt.weapon==="bow")P.root.rotation.x=-1.2,P.joint.rotation.x=-.15,R.root.rotation.x=.9-Vt*.8,R.joint.rotation.x=-.3;else if(rt.weapon==="greatsword"){const te=-1.6*Tt+1.25*Vt,Jt=Ie(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);R.root.rotation.x=te,R.joint.rotation.x=-(.25+Tt*.4),P.root.rotation.x=te+.06,P.joint.rotation.x=-(.32+Tt*.4),P.root.rotation.z=.38,m.rotation.y=-.2*St*Jt}else{const te=rt.comboIndex;if(te===1)R.root.rotation.x=-1.7*Tt+1.1*Vt,R.joint.rotation.x=-(.2+Tt*.5),P.root.rotation.x=.1,m.rotation.y=-.18*St;else if(te===2)P.root.rotation.x=-1.5*Tt+1*Vt,P.joint.rotation.x=-(.2+Tt*.5),R.root.rotation.x=.2,m.rotation.y=.45*-St;else{const Jt=-1.9*Tt+1.2*Vt;P.root.rotation.x=Jt,R.root.rotation.x=Jt,P.joint.rotation.x=-(.15+Tt*.4),R.joint.rotation.x=-(.15+Tt*.4),m.rotation.y=-.3*St}}_e(rt)}function he(rt,St){rt&&(R.root.rotation.x=-1.05,R.joint.rotation.x=-.35,P.root.rotation.x=-.45,P.joint.rotation.x=-.2,m.rotation.y=-.12,tt.orb.scale.setScalar(1.25+.12*Math.sin(St*2)))}function Ne(rt){if(!rt||rt.phase==="idle")return;const St=rt.progress,Tt=St<.3?-.35+St/.3*1.35:St<.7?1:Math.max(0,1-(St-.7)/.3),Vt=Math.PI/180;m.rotation.x+=h.leanDeg*Vt*Tt,P.root.rotation.x-=h.shieldPitchDeg*Vt*Tt,P.joint.rotation.x-=.22*Tt,R.root.rotation.x-=.3*Tt,g.position.z+=h.pelvisReach*Math.max(0,Tt)}return{group:u,update(rt,St,Tt,Vt,te=!1,Jt,xe){ge(St.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const E=Math.max(1/240,Math.min(Vt,.1)),B=Jt===void 0?Gt+=Vt:Jt;I=B;const V=c.landing;V.enabled?yt&&!rt.grounded?(at="jump",bt=B,Mt=V.anticipationDuration,Bt=Math.max(0,V.jumpAnticipation),Kt=.32):!yt&&rt.grounded&&(at="land",bt=B,Mt=V.duration,Bt=hv(J,V),Kt=V.compressRatio,ie=J):(at="none",Bt=0),B<bt&&(at="none",Bt=0),yt=rt.grounded,J=rt.velocity.y;const Z=nd(B,bt,Mt,Bt,Kt),H=St.phase!=="idle";z=cv(z,H,E,c.attack.blendRate);const vt=lv(z,c.attack.gaitWeight,c.attack.lowerBodyWeight);ot=vt.attackLegWeight,ut=vt.gaitScale;const It=Math.sin(rt.bodyYaw),Nt=Math.cos(rt.bodyYaw),zt=(rt.velocity.x-Q)/E,Xt=(rt.velocity.z-pt)/E,Wt=Ie(zt,-60,60),Ft=Ie(Xt,-60,60),ee=Wt*It+Ft*Nt,ne=Cn(rt.bodyYaw-K)/E,oe=Math.hypot(rt.velocity.x,rt.velocity.z),Le=r.maxForwardDeg*Math.PI/180,se=r.maxSideDeg*Math.PI/180,Ht=Ie(ee*r.accelGain,-Le,Le),ln=Ie(-ne*oe*r.turnGain,-se,se),ae=1-Math.exp(-r.smoothing*E);mt+=(Ht-mt)*ae,wt+=(ln-wt)*ae,Q=rt.velocity.x,pt=rt.velocity.z,K=rt.bodyYaw;const Te=Math.hypot(rt.velocity.x,rt.velocity.z),vn=Ie(s.knockGaitScale??0,0,1),ze=Tt.knockX*vn,si=Tt.knockZ*vn,de=vn>0&&Math.hypot(Tt.knockX,Tt.knockZ)>.001,$e=rt.velocity.x+ze,Ln=rt.velocity.z+si,Oe=Math.hypot($e,Ln);xt=Oe;const Mn=Math.cos(rt.bodyYaw),yn=-Math.sin(rt.bodyYaw),Ps=rt.velocity.x*Mn+rt.velocity.z*yn,uh=Te>ha?Ie(Ps/Te,-1,1):0,fh=th(uh,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost);F+=(fh-F)*(1-Math.exp(-i.hipYawSmoothing*E));const cs=rt.bodyYaw+F;Qt=cs;const ph=Math.sin(cs),mh=Math.cos(cs),gh=Math.cos(cs),_h=-Math.sin(cs),Ds={speed:Oe,phase:rt.gaitPhase,localForward:$e*ph+Ln*mh,localRight:$e*gh+Ln*_h,stride:rt.stride};H&&!ct&&($=rt.gaitPhase),ct=H;const wi=z>0?rv(Ds,St.attackProgress,St.comboIndex,z,c.stride,$):Ds;Ot=wi;const gc=Math.max(0,s.stopBlendSec||0),_c=gc>0&&!H&&!de&&rt.grounded,xc=eh(Te,st,e,s.stopEnterRatio,s.stopExitRatio);if(!_c||xc.resume)Et=-1;else if(Et<0&&xc.enter){Et=0,Rt=rt.gaitPhase,q=Jd(rt.gaitPhase),dt=Te,lt=Math.max(rt.stride,ha),w=Ds.localForward,M=Ds.localRight;const Be=1/Math.max(ha,Te);G=rt.velocity.x*Be,et=rt.velocity.z*Be}st=Te;const Ls=_c&&Et>=0;Ls&&(Et=Math.min(1,Et+E/gc));const vc=Ls?{phase:Rt,speed:dt,moveSpeed:e,localForward:w,localRight:M,legLength:n.legLength,stride:lt,grounded:!0}:{phase:wi.phase,speed:wi.speed,moveSpeed:e,localForward:wi.localForward,localRight:wi.localRight,legLength:n.legLength,stride:wi.stride??0,grounded:rt.grounded},xh=Ls?Qd(vc,s,{progress:Et,phase0:Rt,phaseEnd:q}):pc(vc,s),ve=dv(xh,vt.gaitScale);let Xa=0,Wa=0,$a=0,Mc=0;if(Ls){const Be=ih(rt.bodyYaw,G,et),ue=sh(Et,Rt,Be.forward,Be.right,s);ue.leadLeft?(ve.legL.pitchX-=ue.leadPitch,ve.legL.kneeX+=ue.leadKnee,ve.legR.pitchX+=ue.trailPitch):(ve.legR.pitchX-=ue.leadPitch,ve.legR.kneeX+=ue.leadKnee,ve.legL.pitchX+=ue.trailPitch),Wa=ue.bodyShift*ue.fwdN,Xa=ue.bodyShift*ue.rightN,$a=ue.bodyDip,Mc=ue.chestPitch,_t=ue.leadPitch,Pt=ue.bodyShift,ft=ue.bodyDip}else _t=0,Pt=0,ft=0;kt={lp:ve.legL.pitchX,lr:ve.legL.rollZ,rp:ve.legR.pitchX,rr:ve.legR.rollZ},rt.grounded?(k.root.rotation.x=ve.legL.pitchX,W.root.rotation.x=ve.legR.pitchX,k.root.rotation.z=ve.legL.rollZ,W.root.rotation.z=ve.legR.rollZ,k.joint.rotation.x=ve.legL.kneeX,W.joint.rotation.x=ve.legR.kneeX,P.root.rotation.x=ve.armL,R.root.rotation.x=ve.armR,P.joint.rotation.x=-(.18+ve.armL*.2),R.joint.rotation.x=-(.18+ve.armR*.2),P.root.rotation.z=0,R.root.rotation.z=0,g.position.x=ve.pelvisX,g.position.y=x+ve.pelvisY,g.position.z=0,g.rotation.z=ve.pelvisRoll):(k.root.rotation.x=-.55,W.root.rotation.x=-.25,k.joint.rotation.x=.75,W.joint.rotation.x=.55,P.root.rotation.x=-.9,R.root.rotation.x=-.7,P.joint.rotation.x=-.6,R.joint.rotation.x=-.6,k.root.rotation.z=0,W.root.rotation.z=0);const vh=lh(g,_),yc=f.enabled&&rt.grounded?Ie(f.weight,0,1)*(H?Ie(f.attackScale,0,1):1):0;g.position.x+=Xa,g.position.z+=Wa,_.position.x-=Xa,_.position.z-=Wa,g.position.y-=$a,_.position.y+=$a*(1-Ie(yc,0,1));const Mh=Te/Math.max(e,ha),yh=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,Sh=1-Math.exp(-Math.max(0,yh)*E);Lt+=(Ie(Mh,0,1)-Lt)*Sh;const Ti=ch({leanForward:mt,leanSide:wt,speedRatio:Lt},r);g.rotation.x+=Ti.pelvisPitch,g.rotation.z+=Ti.pelvisRoll,g.position.x+=Ti.pelvisX,g.position.z+=Ti.pelvisZ,g.position.y-=Ti.crouch,_.position.y+=Ti.crouch*(1-Ie(yc,0,1)),Fe(St),he(te,rt.gaitPhase),Ne(xe);const bh=a.greatswordPitchDeg*Math.PI/180,Sc=St.weapon==="greatsword",bc=Math.hypot(rt.velocity.x,rt.velocity.z),Eh=Sc&&St.phase==="idle"&&bc>.5?Math.min(1.15,bc/Math.max(e,.001)*.9):0;Ct+=(Eh-Ct)*(1-Math.exp(-6*E)),Sc&&(U.rotation.x=bh+Ct),St.weapon==="bow"&&(ht.g.rotation.x=-(P.root.rotation.x+P.joint.rotation.x),nt.rotation.x=-(R.root.rotation.x+R.joint.rotation.x));const wh=m.rotation.y;en(Tt,rt.bodyYaw);const Ec=Tt.type==="none"?1:.4;if(m.rotation.x+=mt*Ec+Mc,m.rotation.z+=(wt+ve.sideLean)*Ec,Z>0&&(k.root.rotation.x-=V.hipPitch*Z,W.root.rotation.x-=V.hipPitch*Z,k.joint.rotation.x+=V.kneeBend*Z,W.joint.rotation.x+=V.kneeBend*Z,g.position.y-=V.crouchDepth*Z,_.position.y+=V.crouchDepth*(1-V.lowerScale)*Z,m.rotation.x+=V.upperPitch*Z,P.root.rotation.x-=V.armTuck*Z,R.root.rotation.x-=V.armTuck*Z),ot>0&&rt.grounded){const Be=ov(St.attackProgress,St.comboIndex,c.stride),ue=ot;k.root.rotation.x+=Be.legL.pitchX*ue,W.root.rotation.x+=Be.legR.pitchX*ue,k.root.rotation.z+=Be.legL.rollZ*ue,W.root.rotation.z+=Be.legR.rollZ*ue,k.joint.rotation.x+=Be.legL.kneeX*ue,W.joint.rotation.x+=Be.legR.kneeX*ue,g.position.x+=Be.pelvisX*ue,g.position.y+=Be.pelvisY*ue,g.rotation.z+=Be.pelvisRoll*ue}_.rotation.y=F,it=nh(F,s.chestYawScale,s.chestYawMaxDeg),m.rotation.y+=it;const Th=wh;T.rotation.y=Cn(rt.headYaw-rt.bodyYaw-Th-it),At=dh({root:u,pelvis:g,lower:_,limbs:X,base:vh,cfg:f,grounded:rt.grounded,attacking:H})},lean(){return{forward:mt,side:wt}},landing(){const rt=nd(I,bt,Mt,Bt,Kt),St=Mt>0?Math.max(0,Mt-Math.max(0,I-bt)):0;return{pulse:rt,remaining:St,kind:rt>0?at:"none",impactVy:ie}},hurt(){return Ut},ik(){return At},attackBlend(){return z},attackWeights(){return{gaitScale:ut,attackLegWeight:ot,driveSpeed:Ot.speed,stridePhase:Ot.phase}},hipYaw(){return F},gaitDebug(){return{stopT:Et,hipYaw:F,chestYaw:it,speed:st,gaitSpeed:xt,stopStep:_t,stopShift:Pt,stopDip:ft,legLPitch:kt.lp,legLRoll:kt.lr,legRPitch:kt.rp,legRRoll:kt.rr}},gaitYaw(){return Qt},arrowDirection(){nt.updateWorldMatrix(!0,!1);const rt=nt.matrixWorld.elements,St=rt[8],Tt=rt[9],Vt=rt[10],te=Math.hypot(St,Tt,Vt)||1;return{x:St/te,y:Tt/te,z:Vt/te}},dispose(){u.traverse(rt=>{if(rt instanceof pe){rt.geometry.dispose();const St=rt.material;Array.isArray(St)?St.forEach(Tt=>Tt.dispose()):St.dispose()}})}}}function Rv(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function Cv(n,t,e){const i=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),a=new Gx({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=gd,a.setSize(i,s,!1),n.appendChild(a.domElement);const r=new Vx;r.background=new Yt("#12161d"),r.add(new qx(11061486,2764600,1.15));const o=new Jx(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],d=new De;for(const q of t.boxes){const dt=q.maxX-q.minX,lt=q.maxY-q.minY,w=q.maxZ-q.minZ;let M=Rv(q.kind,e);q.kind==="step"&&(M=new Yt(M).offsetHSL(0,0,q.maxY*.09).getStyle());const G=new Ts({color:M,transparent:!0,opacity:1}),et=new pe(new Dn(dt,lt,w),G);et.position.set((q.minX+q.maxX)/2,(q.minY+q.maxY)/2,(q.minZ+q.maxZ)/2),et.castShadow=q.kind!=="ground",et.receiveShadow=!0,et.add(new Zd(new Zx(et.geometry),new hc({color:10467020,transparent:!0,opacity:.32}))),d.add(et),l.push(G)}r.add(d);const f=t.gridMeta.maxX-t.gridMeta.minX,h=new tv(f,f,4873328,3358797);h.position.y=.002,h.visible=e.showGrid,r.add(h);const u=Av(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new De,_=.9,m=new De;m.position.y=_,u.group.position.y=-_,m.add(u.group),g.add(m),r.add(g);const p=t.dummies.map((q,dt)=>{const lt=e.dummies.colors,w=lt[dt%lt.length]??"#cccccc",M=vv(e.voxel,e.colors,w,q.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return M.group.traverse(G=>{G.userData.dummyId=q.id}),r.add(M.group),M}),x=p.map(q=>q.group),v=new Qx,y=e.targeting.ringRadius,L=new En({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:Ve,depthWrite:!1}),C=new pe(new qi(y-.07,y,28),L);C.rotation.x=-Math.PI/2,C.position.y=.03,C.visible=!1,r.add(C);const A=new De;r.add(A);const T=new En({color:12577023,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),b=new De;b.position.set(0,.95,.72),A.add(b);const S=new De;S.rotation.x=Mv(e.camera.pitchDeg),b.add(S);const D=new pe(new Va(.78,.045,6,24,Math.PI*1.15),T);S.add(D);const O=new fc(1,0),k=new En({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),W=Array.from({length:16},()=>{const q=new pe(O,k);return q.visible=!1,r.add(q),q}),P=new qi(.86,1,40),R=Array.from({length:6},()=>{const q=new En({color:10146047,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),dt=new pe(P,q);return dt.rotation.x=-Math.PI/2,dt.visible=!1,r.add(dt),{mesh:dt,mat:q}}),X=new En({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),U=new pe(new Dn(.035,.035,.5),X);A.add(U);const N=e.dash,tt=new qi(N.ringRadius-.06,N.ringRadius,28),ht=Array.from({length:6},()=>{const q=new En({color:16777215,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),dt=new pe(tt,q);return dt.rotation.x=-Math.PI/2,dt.visible=!1,r.add(dt),{mesh:dt,mat:q,life:0,base:1}});function nt(q,dt,lt,w,M){const G=ht.find(et=>et.life<=0)??ht[0];G.mat.color.set(w),G.mesh.position.set(q,lt+.04,dt),G.base=M,G.mesh.scale.setScalar(M*.6),G.mesh.visible=!0,G.mat.opacity=.9,G.life=N.fxDuration}const gt=e.links,j=new qi(gt.ringRadius-.07,gt.ringRadius,28),Q=Array.from({length:5},()=>{const q=new En({color:gt.chargeColor,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),dt=new pe(j,q);return dt.rotation.x=-Math.PI/2,dt.visible=!1,r.add(dt),{mesh:dt,mat:q,life:0,base:1}});function pt(q,dt,lt,w){const M=Q.find(G=>G.life<=0)??Q[0];M.mesh.position.set(q,lt+.05,dt),M.base=w,M.mesh.scale.setScalar(w*.55),M.mesh.visible=!0,M.mat.opacity=.85,M.life=gt.fxDuration}let K=t.playerLink.id,mt=t.playerLink.hitIds.length,wt=t.dash.id,Ct="none",Ut=0,At=-1,Lt=1;const F=nv(e.camera,e.smartCamera,e.zoom,i/s),Qt=t.character.position;F.update(Qt.x,Qt.y,Qt.z,1,t.camera);function Et(q,dt){if(x.length===0)return 0;const lt=a.domElement.getBoundingClientRect(),w=new Zt((q-lt.left)/lt.width*2-1,-((dt-lt.top)/lt.height)*2+1);v.setFromCamera(w,F.camera);const M=v.intersectObjects(x,!0);for(const G of M){const et=G.object.userData.dummyId;if(et&&et>0)return et}return 0}function Rt(q,dt,lt){const w=a.domElement.getBoundingClientRect(),M=new Y(q,dt,lt).project(F.camera);return{x:w.left+(M.x*.5+.5)*w.width,y:w.top+(-M.y*.5+.5)*w.height}}return{gaitDebug(){return u.gaitDebug()},render(q,dt){const lt=q.character,w=q.combat;g.position.set(lt.position.x,lt.position.y,lt.position.z),g.rotation.y=lt.bodyYaw;const M=q.dash.phase==="active"&&q.dash.kind==="roll",G=M&&q.dash.duration>0?Math.min(1,1-q.dash.timer/q.dash.duration):0;m.rotation.x=M?G*Math.PI*2:0,m.position.y=_-(M?.2*Math.sin(Math.PI*G):0),u.update(lt,w,q.playerHurt,dt,q.abilities.channeling,q.time,q.playerLink);for(let $=0;$<p.length;$++)q.dummies[$]&&p[$].update(q.dummies[$],dt);const et=q.targeting.hasTarget?q.dummies[q.targeting.targetId-1]:void 0;if(C.visible=!!et,et&&(C.position.set(et.position.x,et.position.y+.03,et.position.z),C.scale.setScalar(1+.07*Math.sin(q.time*6))),A.position.set(lt.position.x,lt.position.y,lt.position.z),A.rotation.y=w.phase!=="idle"?w.attackFacing:lt.bodyYaw,q.dash.id!==wt){wt=q.dash.id;const $=q.dash;Ct=$.kind,$.kind==="blink"?(nt($.fromX,$.fromZ,lt.position.y,N.blinkColor,.9),nt($.toX,$.toZ,lt.position.y,N.blinkColor,1.35)):nt($.fromX,$.fromZ,lt.position.y,N.rollColor,1.1)}for(const $ of ht){if($.life<=0)continue;$.life-=dt;const ct=Math.max(0,$.life/N.fxDuration);$.mat.opacity=.9*ct,$.mesh.scale.setScalar($.base*(.6+(1-ct)*1.2)),$.life<=0&&($.mesh.visible=!1)}const st=q.playerLink;st.id!==K&&(K=st.id,mt=st.hitIds.length,pt(lt.position.x,lt.position.z,lt.position.y,1)),st.hitIds.length>mt?(mt=st.hitIds.length,pt(lt.position.x,lt.position.z,lt.position.y,1.35)):st.hitIds.length<mt&&(mt=st.hitIds.length);for(const $ of Q){if($.life<=0)continue;$.life-=dt;const ct=Math.max(0,$.life/Math.max(gt.fxDuration,1e-6));$.mat.opacity=.85*ct,$.mesh.scale.setScalar($.base*(.55+(1-ct)*1.1)),$.life<=0&&($.mesh.visible=!1)}w.attackId!==Ut&&(Ut=w.attackId,w.weapon==="bow"&&w.phase!=="idle"&&(At=0,Lt=.6+w.lastCharge*.9));const it=w.phase==="active"&&w.comboIndex>0;T.opacity=it?.78:0,it&&(D.rotation.z=-1.2+w.attackProgress*3.2,D.scale.setScalar(.9+w.comboIndex*.13));for(let $=0;$<W.length;$++){const ct=q.abilities.projectiles[$],_t=W[$];_t.visible=!!ct,ct&&(_t.position.set(ct.x,ct.y,ct.z),_t.scale.setScalar(ct.radius),_t.rotation.y+=dt*6)}for(let $=0;$<R.length;$++){const ct=q.abilities.rings[$],_t=R[$];if(_t.mesh.visible=!!ct,ct){const Pt=Math.max(0,Math.min(1,ct.life/Math.max(ct.duration,1e-6)));_t.mesh.position.set(ct.x,.05,ct.z),_t.mesh.scale.setScalar(ct.radius),_t.mat.opacity=.25+.55*Pt}}if(At>=0){At+=dt;const $=At*14*Lt;U.position.set(0,.85,.6+$),X.opacity=$<9?.95:0,$>=9&&(At=-1)}else X.opacity=0;F.update(lt.position.x,lt.position.y,lt.position.z,dt,q.camera),a.render(r,F.camera)},resize(){const q=Math.max(1,n.clientWidth),dt=Math.max(1,n.clientHeight);a.setSize(q,dt,!1),F.resize(q/dt)},getGroundBasis(){return F.getGroundBasis()},setCollidersVisible(q){for(const dt of l)dt.opacity=q?.3:1,dt.wireframe=q,dt.needsUpdate=!0},setGridVisible(q){h.visible=q},setZoom(q){F.setZoom(q)},pickDummy:Et,projectToScreen:Rt,diagnostics(){const q=hh(e.camera.pitchDeg),dt=yv(q,A.rotation.y);return{lean:u.lean(),slashNormal:dt,arrowForward:u.arrowDirection(),gait:{hipYaw:u.hipYaw(),gaitYaw:u.gaitYaw()},attackBlend:u.attackBlend(),attackWeights:u.attackWeights(),landing:u.landing(),hurt:u.hurt(),ik:u.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:ht.filter(lt=>lt.life>0).length,lastKind:Ct},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...F.smart()}}},dispose(){u.dispose();for(const q of p)q.dispose();C.geometry.dispose(),L.dispose(),D.geometry.dispose(),T.dispose(),O.dispose(),k.dispose(),P.dispose();for(const q of R)q.mat.dispose();U.geometry.dispose(),X.dispose();for(const q of ht)q.mat.dispose();tt.dispose();for(const q of Q)q.mat.dispose();j.dispose(),d.traverse(q=>{q instanceof pe&&q.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}async function Pv(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function Dv(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function Lv(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),s=i("diag-status"),a=i("diag-text"),r=i("diag-copy"),o=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),f=i("diag-mask");let h=!1,u=!0,g=0;function _(){const x=n.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){h=x,e.hidden=!x,x?_():a.hidden=!0}function p(x){r.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!h)}),d.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),r.addEventListener("click",()=>{const x=n.summary();Pv(x).then(v=>{v?(p("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),p("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=n.dump(),v=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);Dv(`harness-${x.meta.version}-${v}.json`,JSON.stringify(x)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),a.hidden=!0,_(),p("已清空")}),l.addEventListener("click",()=>{u=!u,n.setEnabled(u),_()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),h&&_()},isOpen:()=>h,close:()=>m(!1)}}const Iv={intents:{...id},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function kv(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Cu(df,hf),i=Cv(n,e,hn),s=Du(e),a=Hf(t),r=Gf(t),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.19 · 11-07 09:11 · 诊断");const c=S=>String(S).padStart(2,"0"),l=new Date,d=af({meta:{version:"v0.9.19",buildTime:"11-07 09:11",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=Lv(d,o),h=zf({deadZone:()=>hn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const u={timeScale:1,paused:!1,showColliders:hn.showColliders,showGrid:hn.showGrid};let g=1;const _=Yu({maxRadiusPx:()=>hn.joystick.maxRadiusPx,deadZone:hn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>hn.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function x(S){if(S===p)return;p=S;const D=yi.indexOf(S)+1;for(const O of m)O.classList.toggle("is-active",Number(O.dataset.weapon)===D);L.refreshWeapon()}let v=Iv,y=0;const L=Ef(e,hn,u,{singleStep:()=>s.singleStep(v.intents),reset:()=>{g=1,s.singleStep({...id,resetPressed:!0})},resetZoom:()=>{g=1,i.setZoom(1)},onToggleColliders:S=>i.setCollidersVisible(S),onToggleGrid:S=>i.setGridVisible(S)});r.register({motion:h,debug:L.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:_,viewConfig:hn,getUserZoom:()=>g,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug()};let C=performance.now(),A=60,T=0;function b(S){const D=Math.min((S-C)/1e3,.1);C=S,D>0&&(A=A*.9+1/D*.1);const O=_.sample();O.intents.resetPressed&&(g=1),g=Nu(g,O.zoomScale,hn.zoom.min,hn.zoom.max),i.setZoom(g);let k=O.intents.dummyClickId;if(O.tap){const R=i.pickDummy(O.tap.x,O.tap.y);R>0&&(k=R)}k>0&&(y=k),v={...O,intents:{...O.intents,dummyClickId:y}};const W=s.frame(D,v.intents,u.timeScale,u.paused,()=>{const R=e.events;for(let X=0;X<R.length;X++)d.event(R[X],e.time)});W>0&&(y=0),d.sample(e,v,D*1e3,W);for(const R of v.gestures)d.gesture(R);S-T>250&&(T=S,f.tick()),x(e.combat.weapon),i.render(e,D),h.update(e,v,i.getGroundBasis());const P=i.diagnostics();a.update(e,A,W,v,u,{attackBlend:P.attackBlend,attackWeights:P.attackWeights,landing:P.landing,hurt:P.hurt,ik:P.ik,zoom:P.camera.zoom},r.hudCompact()),requestAnimationFrame(b)}requestAnimationFrame(b)}kv();

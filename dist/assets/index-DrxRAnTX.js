(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const ii=["sword-shield","dual-swords","greatsword","staff","bow"],Pa=["wander","follow","keep-distance","attack","idle"],bl={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},oa=1e-6;function ya(i,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>oa?Math.atan2(t.aimX,t.aimZ):i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget?i.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>oa?Math.atan2(t.moveX,t.moveZ):i.character.facing}function Ad(i,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>oa){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>oa)return{x:t.moveX/e,z:t.moveZ/e};const n=i.character.facing;return{x:Math.sin(n),z:Math.cos(n)}}const Ge=1e-6,Mr=Math.PI/180;function El(){return{type:"none",timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function yr(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function jo(i,t,e,n,s){i.type=t,i.duration=e,i.timer=e,i.dirX=n,i.dirZ=s,i.knockX=0,i.knockZ=0}function Ao(i,t,e){const n=e.duration>0?e.duration:wo(i,e.type);if(t.kind==="player"){const a=i.playerHurt;if(jo(a,e.type,n,e.dirX,e.dirZ),!i.config.hits.noDamageToPlayer&&e.knockback>Ge){const r=e.knockback*i.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}yr(i,"player-hurt",e.sourceId??0,i.character.position);return}const s=i.dummies[t.index];if(s){if(jo(s.hurt,e.type,n,e.dirX,e.dirZ),e.knockback>Ge){const a=e.knockback*i.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}i.hitCount+=1,yr(i,"hit",s.id,s.position)}}function To(i,t,e){Ao(i,{kind:"dummy",index:t},e)}function Td(i,t){const e=[i.playerHurt];for(const s of i.dummies)e.push(s.hurt);const n=Math.exp(-i.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=n,s.knockZ*=n,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function wo(i,t){const e=i.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function wd(i){const t=i.combat,e=i.config.hits,n=i.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Mr),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=i.config.dummies.radius,l=i.config.targeting.idealRange;for(const h of i.dummies){const u=h.position.x-n.x,f=h.position.z-n.z,d=Math.hypot(u,f);if(d>s+c)continue;const g=d>Ge?u/d:r,_=d>Ge?f/d:o;if(d>Ge&&(u*r+f*o)/d<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=d;p>0&&(x=Math.max(d+p,l));const S=Math.max(0,x-d);To(i,i.dummies.indexOf(h),{type:m,duration:wo(i,m),dirX:g,dirZ:_,knockback:S})}}function Rd(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="active")return;const s=n.weapon===""?void 0:e.moves[n.weapon];if(!s||!s.enabled||!i.modules.hits||!i.modules.dummies)return;const a=s.hit;if(n.pulseTimer-=t,n.pulseTimer>0)return;n.pulseTimer=Math.max(a.pulseInterval,0);const r=i.character.position,o=n.fromX,c=n.fromZ,l=r.x,h=r.z,u=l-o,f=h-c,d=u*u+f*f,g=Math.sin(n.facing),_=Math.cos(n.facing),m=Math.cos(Ko(a.arcDeg,0,180)*Mr),p=i.config.dummies.radius;for(let x=0;x<i.dummies.length;x++){const S=i.dummies[x];if(n.hitIds.indexOf(S.id)>=0)continue;const M=d>Ge?Ko(((S.position.x-o)*u+(S.position.z-c)*f)/d,0,1):0,I=o+u*M,P=c+f*M,R=Math.hypot(S.position.x-I,S.position.z-P);let L=!1;if(a.shape==="circle")L=R<=a.radius+p;else if(a.shape==="capsule")L=R<=Math.max(a.radius,a.width)+p;else{const z=S.position.x-l,G=S.position.z-h,k=Math.hypot(z,G),B=k>Ge?(z*g+G*_)/k>=m:!0;L=k<=a.radius+p&&B||R<=a.width+p}if(!L)continue;const b=S.position.x-o,y=S.position.z-c,w=Math.hypot(b,y);if(w>Ge&&(b*g+y*_)/w<Math.cos(Math.max(a.arcDeg,90)*Mr))continue;const C=w>Ge?b/w:g,D=w>Ge?y/w:_;Ao(i,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:C,dirZ:D,knockback:a.knockback}),n.hitIds.push(S.id),yr(i,"link-hit",S.id,S.position)}}function Cd(i){const t=i.config.hits,e=i.character.position;for(const n of i.events){if(n.type!=="dummy-hit")continue;const s=i.dummies[n.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>Ge?a/o:0,l=o>Ge?r/o:1;Ao(i,{kind:"player"},{type:"light",duration:wo(i,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function Pd(i,t){if(!i.modules.hits)return;i.events.some(n=>n.type==="attack-active")&&wd(i),Rd(i,t),Cd(i)}function Ko(i,t,e){return i<t?t:i>e?e:i}const Js=1e-6;function as(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Ld(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function Dd(i){const t=i.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function Id(i){const t=i.abilities,e=i.config.abilities.arcane,n=i.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:n.x+s*r,y:n.y+1,z:n.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,as(i,"projectile-fire",t.volleyId,o)}function Ud(i,t,e){const n=i.abilities,s=i.config.abilities.arcane,a=i.dash.phase==="active",r=i.playerLink;if(i.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){n.channeling||(n.channeling=!0,n.fireTimer=0,as(i,"channel-start",0,i.character.position)),n.channelYaw=ya(i,e),n.fireTimer-=t;let c=0;for(;n.fireTimer<=0&&c++<8;)n.fireTimer+=Math.max(s.fireInterval,Js),Id(i)}else n.channeling&&(n.channeling=!1,as(i,"channel-end",0,i.character.position))}function kd(i,t){const e=i.config.abilities.ring,n=i.dash.phase==="active";if(i.combat.weapon!=="staff"||!t.skill2Pressed||n)return;const s=i.character.position,a={id:++i.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};i.abilities.rings.push(a),as(i,"ring-place",a.id,s)}function Fd(i,t){const e=i.abilities,n=i.config.abilities.arcane,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],u=h.position.x-o.x,f=h.position.z-o.z,d=o.radius+s;if(!(u*u+f*f>d*d)){To(i,l,{type:n.hurtType,duration:n.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:n.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function Nd(i,t){const e=i.abilities,n=i.config.abilities.ring,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(n.pulseInterval,Js),a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],u=h.position.x-o.x,f=h.position.z-o.z,d=o.radius+s;if(u*u+f*f>d*d)continue;const g=Math.hypot(u,f),_=g>Js?u/g:0,m=g>Js?f/g:1;To(i,l,{type:"heavy",duration:n.stun,dirX:_,dirZ:m,knockback:n.knockback})}as(i,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function zd(i,t,e){Ud(i,t,e),kd(i,e),Fd(i,t),Nd(i,t)}function La(i){i.rngState=i.rngState+1831565813>>>0;let t=i.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Jo=1e-6;function Qo(i,t,e){return i<t?t:i>e?e:i}function Al(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Tl(i){const t=i.camera,e=Al();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=i.character.position.x,t.centroidZ=i.character.position.z}function Od(i){const t=i.camera,e=i.config.camera,n=i.character.position;let s=0,a=0,r=0,o=0;for(const l of i.dummies){const h=l.position.x-n.x,u=l.position.z-n.z,f=Math.hypot(h,u);if(f>e.radius)continue;const d=Qo((e.radius-f)/Math.max(Jo,e.radius-e.nearDistance),0,1);let g=d*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*d),s+=g,a+=l.position.x*g,r+=l.position.z*g,o+=1}const c=s<=0?0:Qo(s/(s+Math.max(Jo,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=n.x,t.centroidZ=n.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,h=r/s;t.centroidX=l,t.centroidZ=h;let u=(l-n.x)*e.framingBias*c,f=(h-n.z)*e.framingBias*c;const d=Math.hypot(u,f);d>e.maxOffset&&(u=u/d*e.maxOffset,f=f/d*e.maxOffset),t.offsetX=u,t.offsetZ=f}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Bd(i){const t=[],e=i.ground.size;t.push(di("ground","ground",0,0,e,e,-i.ground.thickness,0));for(const n of i.steps)t.push(di(n.id,"step",n.x,n.z,n.width,n.depth,0,n.height));for(const n of i.doorways){const s=n.openingWidth/2,a=n.wallThickness;t.push(di(`${n.id}-left`,"wall",n.x-s-n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(di(`${n.id}-right`,"wall",n.x+s+n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(di(`${n.id}-lintel`,"lintel",n.x,n.z,n.openingWidth,a,n.openingHeight,n.wallHeight))}for(const n of i.obstacles)t.push(di(n.id,"obstacle",n.x,n.z,n.width,n.depth,0,n.height));return t}function di(i,t,e,n,s,a,r,o){return{id:i,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:n-a/2,maxZ:n+a/2}}const yn=1e-6;function ca(i,t,e){return i<t?t:i>e?e:i}function Sr(i,t,e,n,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of i)l.maxY>n+a+yn||l.maxY<n-r-yn||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Ro(i,t,e,n,s){let a=!1;const r=t.y+n;for(let o=0;o<2;o++)for(const c of i){if(c.maxY<=t.y+s+yn||c.minY>=r-yn)continue;const l=ca(t.x,c.minX,c.maxX),h=ca(t.z,c.minZ,c.maxZ),u=t.x-l,f=t.z-h,d=u*u+f*f;if(!(d>=e*e))if(a=!0,d>yn*yn){const g=Math.sqrt(d),_=(e-g)/g;t.x+=u*_,t.z+=f*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,p=c.maxZ-t.z,x=Math.min(g,_,m,p);x===g?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function Co(i,t,e,n,s){const a=t.y+n;for(const r of i){if(r.maxY<=t.y+s+yn||r.minY>=a-yn)continue;const o=ca(t.x,r.minX,r.maxX),c=ca(t.z,r.minZ,r.maxZ),l=t.x-o,h=t.z-c;if(l*l+h*h<e*e-yn)return!0}return!1}const br=1e-6;function cn(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Da(i,t,e,n){const s=cn(t-i);return i+s*(1-Math.exp(-Math.max(e,br)*n))}function tc(i,t,e,n){const s=cn(t-i),a=Math.abs(s);return a<=n||a<=e?t:cn(i+Math.sign(s)*Math.max(e,0))}function Hd(i,t,e){const n=i.character,s=i.config.orientation,a=i.combat,r=Math.hypot(e.moveX,e.moveZ),o=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>br,c=i.abilities.channeling,l=a.charging&&a.weapon==="bow"&&i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget;if(a.phase!=="idle")n.facing=a.attackFacing;else if(o||c)n.facing=ya(i,e);else if(l)n.facing=i.targeting.targetYaw;else if(r>Math.max(s.facingDeadZone,br)){const g=Math.atan2(e.moveX,e.moveZ),_=s.facingTurnRate*Math.PI/180*t,m=s.facingSnapDeg*Math.PI/180;if(r>=.35)n.facing=tc(n.facing,g,_,m);else if(r>=s.facingMinMagnitude&&Math.abs(cn(g-n.facing))>s.facingDeadbandDeg*Math.PI/180){const x=Da(n.facing,g,s.facingSmoothRate,t);n.facing=tc(n.facing,x,_,0)}}const h=n.velocity;Math.hypot(h.x,h.z)>.15&&(n.moveYaw=Math.atan2(h.x,h.z)),n.bodyYaw=Da(n.bodyYaw,n.facing,s.bodyTurnRate,t);let u=Da(n.headYaw,n.facing,s.headTurnRate,t);const f=s.maxHeadTurnDeg*Math.PI/180,d=cn(u-n.bodyYaw);d>f?u=n.bodyYaw+f:d<-f&&(u=n.bodyYaw-f),n.headYaw=u}const Er=1e-6,Gd=Math.PI/180;function Ar(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Po(i,t,e){return i<t?t:i>e?e:i}function Sa(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Tr(i){const t=i.id,e=i.windowId;Object.assign(i,Sa()),i.id=t,i.windowId=e}function Vd(i){Tr(i)}function Wd(i){Tr(i.playerLink);for(const t of i.dummies)Tr(t.link)}function Xd(i,t){const e=[i.playerLink];for(const n of i.dummies)e.push(n.link);for(const n of e)n.linkWindow=Math.max(0,n.linkWindow-t),n.cooldown=Math.max(0,n.cooldown-t),n.linkWindow===0&&n.phase==="idle"&&n.source!=="none"&&(n.source="none",n.usedWindowId=-1)}function wr(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(n.linkWindow=Math.max(n.linkWindow,s),n.source=t,n.windowId+=1,n.usedWindowId=-1,n.prevSprinting=!1)}function la(i){const t=i.playerLink;if(t.phase==="idle")return;const e=t.id,n=t.windowId;Object.assign(t,Sa()),t.id=e,t.windowId=n,t.fromX=i.character.position.x,t.fromZ=i.character.position.z}function $d(i,t){const e=i.config.links.search,n=i.character.position,s=Po(e.maxAngleDeg,0,180)*Gd;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of i.dummies){const l=c.position.x-n.x,h=c.position.z-n.z,u=Math.hypot(l,h);if(u<Er||u>e.range)continue;const f=Math.atan2(l,h);Math.abs(cn(f-t))>s||u<o&&(o=u,a=c.id,r=f)}return{id:a,yaw:r,dist:a>0?o:0}}function Yd(i,t,e,n){const s=i.config.links,a=i.playerLink,r=i.character.position,o=ya(i,t),c=$d(i,o),l=c.id>0?c.yaw:o,h=c.id>0?Po(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=n,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=h,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,i.dash.cooldown=Math.max(i.dash.cooldown,s.sharedCooldown),Ar(i,"link-start",a.id)}function Zd(i,t){const e=i.playerLink;if(e.phase==="idle")return;const n=e.weapon===""?void 0:i.config.links.moves[e.weapon];if(!n){la(i);return}if(e.weapon!==i.combat.weapon){la(i);return}e.timer+=t;const s=c=>c==="windup"?n.windup:c==="active"?n.active:n.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Ar(i,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Ar(i,"link-end",e.id))}const r=n.windup+n.active+n.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=n.windup+e.timer:e.phase==="recovery"?o=n.windup+n.active+e.timer:o=r,e.progress=r>0?Po(o/r,0,1):1,e.phase==="active"&&n.active>Er){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Er,n.active-e.timer),h=c/l;i.impulse.x=Math.sin(e.facing)*h,i.impulse.z=Math.cos(e.facing)*h}}function qd(i,t,e){const n=i.config.links,s=i.playerLink,a=i.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!n.enabled||!i.modules.links){s.phase!=="idle"&&la(i);return}const r=i.combat,o=i.character.sprinting;o&&n.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&n.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,n.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&wr(i,"sprint"),s.prevSprinting=o,Zd(i,t);const c=n.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&i.dash.phase==="idle"&&!!c&&c.enabled&&Yd(i,e,c,r.weapon)}const Rr=1e-6;function Fn(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function wl(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Rl(i){const t=i.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=wl()}function jd(i){return{weapon:ii[Math.max(0,i-1)]??ii[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:wl()}}function Kd(i,t){return ya(i,t)}function Jd(i,t){const e=i.config.targeting;if(!e.targetAssist||!i.modules.targeting||!i.targeting.hasTarget)return t;const n=i.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*i.config.combat.minLungeScale;return Math.min(Math.max(n,0)+a,s)}function Cl(i,t,e,n){const s=i.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=n,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=Kd(i,t),s.attackProgress=0,s.timings=e,s.attackId+=1,Fn(i,"attack-start",n)}function Pl(i){return Math.max(0,i.config.combat.settle)}function Cr(i,t,e){const n=i.config.combat.weapons[i.combat.weapon];Cl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:Pl(i),lunge:Jd(i,n.lunge[e-1]??0)},e)}function Qd(i,t,e){const n=i.config.combat.bow.release;i.combat.lastCharge=e,Cl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:Pl(i),lunge:n.lunge},0),Fn(i,"charge-release",e)}function th(i,t,e){const n=i.combat;if(n.phase==="idle")return;const s=n.timings;n.phaseTimer+=t;let a=0;for(;n.phase!=="idle"&&a++<8;){const c=n.phase==="windup"?s.windup:n.phase==="active"?s.active:n.phase==="recovery"?s.recovery:s.settle;if(n.phaseTimer<c)break;if(n.phaseTimer-=c,n.phase==="windup")n.phase="active",Fn(i,"attack-active",n.comboIndex);else if(n.phase==="active")n.phase="recovery";else if(n.phase==="recovery")n.phase="settle",Fn(i,"attack-end",n.comboIndex);else if(n.phase="idle",n.phaseTimer=0,n.comboWindow=i.config.combat.comboWindow,n.queued){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Cr(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}if(n.queued&&n.phase==="recovery"){const c=n.timings.recovery;if(c>Rr&&n.phaseTimer>=c*i.config.combat.cancelWindow){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Cr(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;n.phase==="windup"?o=n.phaseTimer:n.phase==="active"?o=s.windup+n.phaseTimer:n.phase==="recovery"?o=s.windup+s.active+n.phaseTimer:n.phase==="settle"&&(o=r),n.phase!=="idle"&&(n.attackProgress=r>0?Math.min(1,o/r):1)}function eh(i,t,e){const n=i.combat,s=i.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ii.length){const c=ii[e.weaponSlot-1];c!==n.weapon&&(n.weapon=c,Rl(i),la(i),Fn(i,"weapon-change",e.weaponSlot))}n.phase==="idle"&&n.comboWindow>0&&(n.comboWindow=Math.max(0,n.comboWindow-t),n.comboWindow===0&&n.comboIndex>0&&(n.comboIndex=0,Fn(i,"combo-reset",0))),th(i,t,e);const a=s.weapons[n.weapon],r=i.dash.phase==="active";if(a.comboCount>0){const c=i.playerLink.phase!=="idle"||i.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(n.phase==="idle"){const h=n.comboWindow>0&&n.comboIndex<a.comboCount?n.comboIndex+1:1;Cr(i,e,h)}else n.queued=!0}else if(n.weapon!=="staff"){if(n.weapon==="bow"&&(!r&&!i.playerLink.consumedAttack&&e.attackPressed&&n.phase==="idle"&&!n.charging&&(n.charging=!0,n.charge=0,Fn(i,"charge-start",0)),n.charging&&e.attackHeld&&(n.charge=Math.min(1,n.charge+t/Math.max(s.bow.maxChargeTime,Rr))),n.charging&&!r&&(e.attackReleased||!e.attackHeld))){n.charging=!1;const c=n.charge;n.charge=0,c>=s.bow.minChargeToFire&&n.phase==="idle"?Qd(i,e,c):Fn(i,"charge-release",0)}}if(!(i.playerLink.phase==="active")&&(i.impulse.x=0,i.impulse.z=0,n.phase==="active"&&n.timings.active>Rr)){const c=n.timings.lunge/n.timings.active;i.impulse.x=Math.sin(n.attackFacing)*c,i.impulse.z=Math.cos(n.attackFacing)*c}}const Pr=1e-6;function Ia(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function nh(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function ih(i){const t=i.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=i.character.position.x,t.fromZ=i.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function ec(i,t,e){return i<t?t:i>e?e:i}function sh(i,t,e){const n=i.config.dash,a=i.character.position,r=i.config.worldBounds,o=Math.max(.05,n.blinkStep),c=Math.max(0,n.blinkDistance);let l=0,h=a.x,u=a.z;for(;l<c-Pr;){const f=Math.min(c,l+o),d=a.x+t*f,g=a.z+e*f,_=ec(d,r.minX,r.maxX),m=ec(g,r.minZ,r.maxZ),p={x:_,y:a.y,z:m};if(Co(i.boxes,p,i.config.characterRadius,i.config.characterHeight,i.config.stepHeight)||(h=_,u=m,l=f,_!==d||m!==g))break}return{x:h,z:u}}function ah(i,t,e){const n=i.dash,s=i.config.dash;if(n.phase==="active"&&n.timer<=0&&(n.phase="idle",n.timer=0,wr(i,"roll")),n.cooldown>0){const o=n.cooldown;n.cooldown=Math.max(0,n.cooldown-t),o>0&&n.cooldown===0&&Ia(i,"dash-ready",0)}const a=i.combat;if(e.sprintPressed&&n.cooldown<=0&&n.phase==="idle"&&a.phase==="idle"&&!a.charging&&i.playerLink.phase==="idle"){const o=Ad(i,e),c=o.x,l=o.z,h=i.combat.weapon==="staff";if(n.kind=h?"blink":"roll",n.dirX=c,n.dirZ=l,n.fromX=i.character.position.x,n.fromZ=i.character.position.z,n.id+=1,n.cooldown=h?s.blinkCooldown:s.rollCooldown,h){const u=sh(i,c,l);i.character.position.x=u.x,i.character.position.z=u.z,n.toX=u.x,n.toZ=u.z,n.duration=0,n.timer=0,n.phase="idle",s.blinkClearVelocity&&(i.character.velocity.x=0,i.character.velocity.z=0),wr(i,"blink"),Ia(i,"blink",n.id)}else n.phase="active",n.duration=Math.max(Pr,s.rollDuration),n.timer=n.duration,n.toX=n.fromX+c*s.rollDistance,n.toZ=n.fromZ+l*s.rollDistance,Ia(i,"roll",n.id)}if(n.phase==="active"&&n.kind==="roll"){const o=Math.max(Pr,n.timer),c=i.character.position.x,l=i.character.position.z;i.impulse.x=(n.toX-c)/o,i.impulse.z=(n.toZ-l)/o}n.phase==="active"&&(n.timer=Math.max(0,n.timer-t))}const Ve=1e-6,Lr=Math.PI*2,rh=7,oh=18;function nc(i,t,e){return i<t?t:i>e?e:i}function ch(i){return Math.atan2(Math.sin(i),Math.cos(i))}function ic(i,t,e,n){return i+ch(t-i)*(1-Math.exp(-Math.max(e,Ve)*n))}function Lo(i,t,e){i.events.push({type:t,tick:i.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function lh(i){const t=[];for(let e=0;e<i.count;e++){const n=i.spawn[e]??{x:0,z:0},s=i.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:n.x,homeZ:n.z,position:{x:n.x,y:0,z:n.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:n.x,targetZ:n.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:El(),link:Sa()})}return t}function dh(i){const t=Pa.indexOf(i);return Pa[(t+1)%Pa.length]}function hh(i){const t=i.config.dummies;for(let e=0;e<i.dummies.length;e++){const n=i.dummies[e],s=t.spawn[e]??{x:n.homeX,z:n.homeZ},a=t.initialModes[e]??n.initialMode;n.mode=a,n.initialMode=a,n.homeX=s.x,n.homeZ=s.z,n.position.x=s.x,n.position.y=0,n.position.z=s.z,n.velocity.x=0,n.velocity.y=0,n.velocity.z=0,n.facing=0,n.bodyYaw=0,n.headYaw=0,n.gaitPhase=0,n.stride=1,n.distance=0,n.targetX=s.x,n.targetZ=s.z,n.wanderTimer=0,n.attackCooldown=0,n.attackPhase="idle",n.attackPhaseTimer=0,n.attackProgress=0;const r=n.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,Vd(n.link)}i.dummyAttackCount=0}function uh(i,t,e){const n=La(i)*Lr,s=Math.sqrt(La(i))*e.wanderRadius;t.targetX=t.homeX+Math.cos(n)*s,t.targetZ=t.homeZ+Math.sin(n)*s,t.wanderTimer=e.wanderInterval*(.6+La(i)*.8)}function fh(i,t){return i.attackPhase==="windup"?t.attackWindup:i.attackPhase==="active"?t.attackActive:i.attackPhase==="recovery"?t.attackRecovery:0}function ph(i,t,e,n){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(fh(t,n),Ve);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",Lo(i,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=n.attackWindup+n.attackActive+n.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=n.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=n.attackWindup+n.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function mh(i,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const n=i.character.position,s=n.x-t.position.x,a=n.z-t.position.z,r=Math.hypot(s,a),o=r>Ve?s/r:0,c=r>Ve?a/r:0;let l=0,h=0;if(t.mode==="wander"){const f=t.targetX-t.position.x,d=t.targetZ-t.position.z,g=Math.hypot(f,d);(t.wanderTimer<=0||g<.3)&&uh(i,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>Ve&&(l=_/p,h=m/p)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,h=c);else if(t.mode==="keep-distance"){const f=r-e.keepDistance;f>e.keepDeadZone?(l=o,h=c):f<-e.keepDeadZone?(l=-o,h=-c):(l=-c*e.keepStrafe,h=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,h=c);let u=t.facing;return t.mode==="wander"?Math.hypot(l,h)>Ve&&(u=Math.atan2(l,h)):r>Ve&&(u=Math.atan2(o,c)),{x:l,z:h,facing:u}}function gh(i,t,e,n){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=i.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=n.attackRange+Ve&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=n.attackInterval,i.dummyAttackCount+=1,Lo(i,"dummy-attack",e))}ph(i,e,t,n);const s=mh(i,e,n),a=1-Math.exp(-Math.max(n.acceleration,Ve)*t);e.velocity.x+=(s.x*n.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*n.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=ic(e.bodyYaw,e.facing,rh,t),e.headYaw=ic(e.headYaw,e.facing,oh,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=i.config.stepHeight;Ro(i.boxes,e.position,n.radius,n.height,c)&&Co(i.boxes,e.position,n.radius,n.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const h=i.config.worldBounds;e.position.x=nc(e.position.x,h.minX,h.maxX),e.position.z=nc(e.position.z,h.minZ,h.maxZ);const u=Sr(i.boxes,e.position.x,e.position.z,e.position.y,n.radius,c,Number.POSITIVE_INFINITY);u>Number.NEGATIVE_INFINITY&&u<=e.position.y+c+Ve&&(e.position.y=u);const f=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=f;const d=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(i.config.strideSpeedCap,d/Math.max(i.config.moveSpeed,Ve)),_=Math.max(i.config.strideLength*(1+g*i.config.strideSpeedGain),Ve);e.stride=_,e.gaitPhase=(e.gaitPhase+f/_*Lr)%Lr}function _h(i,t,e){const n=i.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=i.dummies.length){const s=i.dummies[e.dummyClickId-1];s.mode=dh(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,Lo(i,"dummy-mode",s)}for(const s of i.dummies)gh(i,t,s,n)}const hi=1e-6,sc=Math.PI*2;function Ua(i,t){return Math.sqrt(i*i+t*t)}function vs(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function xh(i){const t=i.character,e=i.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=i.config.strideLength,t.distance=0,t.coyoteTime=i.config.coyoteTime,t.jumpBuffer=0,Rl(i)}function vh(i,t,e){const n=i.config,s=i.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Ua(o,c);l>1&&(o/=l,c/=l);const h=i.combat.phase!=="idle",u=i.playerLink.phase!=="idle",f=h||i.dash.phase==="active"||u;s.sprinting=!f&&e.sprintHeld&&l>hi;const d=n.combat.weapons[i.combat.weapon];let g=d?d.moveMultiplier:1;f?g*=i.combat.phase==="settle"?n.combat.settleMoveScale:n.combat.attackMoveScale:i.combat.charging?g*=n.combat.bow.chargeMoveMultiplier:i.abilities.channeling&&(g*=n.abilities.arcane.moveScale);const _=n.moveSpeed*(s.sprinting?n.sprintMultiplier:1)*g;if(f)r.x=o*_,r.z=c*_;else{const C=l>hi?n.acceleration:n.friction,D=1-Math.exp(-C*t);r.x+=(o*_-r.x)*D,r.z+=(c*_-r.z)*D}e.jumpPressed?s.jumpBuffer=n.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?n.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=n.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,vs(i,"jumped",n.jumpSpeed)),i.events.some(C=>C.type==="blink"&&C.tick===i.tick)&&(r.x=0,r.z=0,i.impulse.x=0,i.impulse.z=0);const p=a.x,x=a.z;if(a.x+=(r.x+i.impulse.x+i.playerHurt.knockX)*t,a.z+=(r.z+i.impulse.z+i.playerHurt.knockZ)*t,Ro(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight)){if(Co(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight))a.x=p,a.z=x,r.x=0,r.z=0;else{const C=a.x-p,D=a.z-x;Math.abs(C)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(D)<Math.abs(r.z*t)*.5&&(r.z=0)}vs(i,"blocked",1)}const M=n.worldBounds;a.x=ac(a.x,M.minX,M.maxX),a.z=ac(a.z,M.minZ,M.maxZ);const I=Sr(i.boxes,a.x,a.z,a.y,n.characterRadius,n.stepHeight,n.fallTolerance);s.grounded&&I>a.y+hi&&I-a.y<=n.stepHeight+hi&&(a.y=I,r.y=0,vs(i,"stepUp",I));const P=a.y;r.y-=n.gravity*t,a.y+=r.y*t;const R=Sr(i.boxes,a.x,a.z,P,n.characterRadius,n.stepHeight,Number.POSITIVE_INFINITY);R>Number.NEGATIVE_INFINITY&&a.y<=R&&r.y<=0?(a.y=R,r.y=0,s.grounded||vs(i,"landed",R),s.grounded=!0):s.grounded=!1;const L=Ua(a.x-p,a.z-x);s.distance+=L;const b=Ua(r.x,r.z),y=Math.min(n.strideSpeedCap,b/Math.max(n.moveSpeed,hi)),w=Math.max(n.strideLength*(1+y*n.strideSpeedGain),hi);s.stride=w,s.gaitPhase=(s.gaitPhase+L/w*sc)%sc}function ac(i,t,e){return i<t?t:i>e?e:i}const Mh=1e-6,rc=2.399963229728653;function oc(i,t,e){return i<t?t:i>e?e:i}function cc(i,t,e,n,s,a,r,o,c){const l=t.x-i.x,h=t.z-i.z,u=Math.hypot(l,h),f=e+n;if(u>=f)return;let d,g,_;u<Mh?(d=o,g=c,_=f):(d=l/u,g=h/u,_=f-u);const m=_+r;i.x-=d*m*s,i.z-=g*m*s,t.x+=d*m*a,t.z+=g*m*a}function yh(i){const t=i.config.separation,e=i.dummies,n=i.character.position,s=i.config.characterRadius,a=i.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let h=0;h<r;h++){for(let u=0;u<e.length;u++)for(let f=u+1;f<e.length;f++){const d=(u*3+f)*rc;cc(e[u].position,e[f].position,a,a,.5,.5,o,Math.cos(d),Math.sin(d))}for(let u=0;u<e.length;u++){const f=(u+1)*rc;cc(n,e[u].position,s,a,0,1,o,Math.cos(f),Math.sin(f))}}const c=i.config.stepHeight,l=i.config.worldBounds;for(const h of e)Ro(i.boxes,h.position,a,i.config.dummies.height,c),h.position.x=oc(h.position.x,l.minX,l.maxX),h.position.z=oc(h.position.z,l.minZ,l.maxZ)}const lc=1e-6,Sh=Math.PI/180;function bh(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Eh(i,t,e){return i<t?t:i>e?e:i}function Ah(i,t,e){const n=i.config.targeting,s=i.targeting,a=i.character.position;let r=i.character.facing;Math.hypot(e.moveX,e.moveZ)>lc&&(r=Math.atan2(e.moveX,e.moveZ));const c=Eh(n.maxAngleDeg,0,180)*Sh;let l=Number.POSITIVE_INFINITY,h=0,u=0,f=0;for(const d of i.dummies){const g=d.position.x-a.x,_=d.position.z-a.z,m=Math.hypot(g,_);if(m<lc||m>n.range)continue;const p=Math.atan2(g,_),x=Math.abs(cn(p-r));if(x>c)continue;const S=m-n.frontBias*Math.cos(x);S<l&&(l=S,h=d.id,u=p,f=m)}s.targetId=h,s.targetYaw=u,s.targetDist=f,s.hasTarget=h>0}function Th(i,t){return{tick:0,time:0,rngState:2654435769,config:i,boxes:Bd(t),gridMeta:t.grid,character:{position:{x:i.spawn.x,y:i.spawn.y,z:i.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:i.strideLength,distance:0,coyoteTime:i.coyoteTime,jumpBuffer:0},combat:jd(1),playerLink:Sa(),abilities:Ld(),impulse:{x:0,z:0},targeting:bh(),playerHurt:El(),hitCount:0,dash:{...nh(),fromX:i.spawn.x,fromZ:i.spawn.z,toX:i.spawn.x,toZ:i.spawn.z},camera:{...Al(),centroidX:i.spawn.x,centroidZ:i.spawn.z},dummies:lh(i.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,dummies:!0}}}function wh(i){xh(i),hh(i),Wd(i);const t=i.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=i.playerHurt;e.type="none",e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,i.hitCount=0,Dd(i),ih(i),Tl(i),i.events.length=0}function dc(i,t,e){if(i.events.length=0,i.tick+=1,i.time+=t,i.impulse.x=0,i.impulse.z=0,e.resetPressed){wh(i);const n=i.config.spawn;return i.events.push({type:"reset",tick:i.tick,x:n.x,y:n.y,z:n.z,value:0}),i}return i.modules.dummies&&i.modules.targeting?Ah(i,t,e):(i.targeting.targetId=0,i.targeting.targetYaw=0,i.targeting.targetDist=0,i.targeting.hasTarget=!1),qd(i,t,e),i.modules.combat&&eh(i,t,e),i.modules.dash&&ah(i,t,e),i.modules.movement&&vh(i,t,e),i.modules.orientation&&Hd(i,t,e),i.modules.dummies&&_h(i,t,e),Td(i,t),Xd(i,t),i.modules.abilities&&zd(i,t,e),i.modules.dummies&&(Pd(i,t),i.modules.separation&&yh(i)),i.modules.camera?Od(i):Tl(i),i}function Rh(i){let t=0;return{frame(e,n,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=i.config.fixedDt,c=i.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const h=l===0?n:{...n,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};dc(i,o,h),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){dc(i,i.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Ll={slopPx:12,longPressMs:450,doubleTapMs:280};function Ch(i,t,e=Ll.slopPx){if(i.distance<e)return{...i,worldX:0,worldZ:0};const n=i.dx/i.distance,s=i.dy/i.distance,a=t.rightX*n+t.forwardX*-s,r=t.rightZ*n+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...i,worldX:0,worldZ:0}:{...i,worldX:a/o,worldZ:r/o}}function Vn(i,t,e,n,s,a){const r=Math.hypot(e,n);return{button:i,kind:t,dx:e,dy:n,distance:r,angleDeg:r>.001?Math.atan2(n,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function Ph(i=Ll){const t=new Map,e=new Map,n=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),Vn(s,"press",0,0,0,1)},move(s,a,r,o){const c=n(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY;return!c.dragging&&Math.hypot(l,h)>=i.slopPx?(c.dragging=!0,Vn(c.button,"drag",l,h,o-c.startedAt,1)):null},end(s,a,r,o){const c=n(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY,u=o-c.startedAt,f=Math.hypot(l,h);if(c.dragging||c.longFired||f>=i.slopPx)return Vn(c.button,"release",l,h,u,1);const d=e.get(c.button);return d!==void 0&&o-d.at<=i.doubleTapMs&&Math.hypot(a-d.x,r-d.y)<=i.slopPx*2?(e.delete(c.button),Vn(c.button,"doubleTap",l,h,u,2)):(e.set(c.button,{at:o,x:a,y:r}),Vn(c.button,"tap",l,h,u,1))},cancel(s,a){const r=n(s);return r?(t.delete(s),Vn(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=i.longPressMs)return a.longFired=!0,Vn(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const ka=.001,Lh=18;function Dr(i,t,e){return i<t?t:i>e?e:i}function Ir(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Dh(i){const t=i.length;if(t<2)return null;const e=i[t-2],n=i[t-1];return e.id===n.id?null:[e,n]}function Ih(i,t,e,n,s=Lh){const a=Dh(t);if(!a)return{state:Ir(),scale:1,started:!1,ended:i.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(n)?n:1.25),l=1/c,h=c;if(!Number.isFinite(r)||r<ka)return{state:{active:!0,lastDist:0,armDist:0,armed:i.armed},scale:1,started:!i.active,ended:!1,armedNow:!1,pinching:i.armed};if(!i.active){const g=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!i.armed)return i.armDist<ka?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-i.armDist)<o?{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(i.lastDist<ka)return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=r/i.lastDist,f=Math.max(0,Number.isFinite(e)?e:1),d=Number.isFinite(u)&&u>0?Math.pow(u,f):1;return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:Dr(Number.isFinite(d)?d:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Uh(i,t,e,n){const s=Math.min(e,n),a=Math.max(e,n),r=Number.isFinite(t)&&t>0?t:1,o=i*r;return Number.isFinite(o)?Dr(o,s,a):Dr(i,s,a)}function kh(i,t){const e=Number.isFinite(t)&&t>0?t:1,n=Number.isFinite(i)?i:0;return Math.pow(e,n/100)}const Fa=["jump","sprint","reset","attack","skill2"],Fh=8,Ms=12,hc=140,Nh=18,zh=16,Oh=400,Bh=1.0001;function Na(i){return i instanceof Element&&i.closest("[data-ui-button], [data-ui-region], #debug-panel, #hud, #weapon-bar, #hint")!==null}function Hh(i){const{maxRadiusPx:t,deadZone:e,getBasis:n,zoom:s}=i,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,h=0,u=null,f=0,d=0,g=!1,_=null,m=null,p=0,x=0,S=0,M=0,I=-1;const P=Ph({slopPx:Ms,longPressMs:450,doubleTapMs:350});let R=[],L=null;const b=new Set;function y(T){T&&R.push(T)}const w=new Map;let C=Ir(),D=!1,z=1;function G(){const T=Array.from(w.values()),mt=s(),tt=Ih(C,T,mt.pinchGain,mt.maxStepRatio,Nh);if(C=tt.state,D=tt.pinching,tt.scale!==1&&(z*=tt.scale),tt.started||tt.armedNow)u=null,g=!0,_=null;else if(tt.ended&&r===null&&T.length===1){const vt=T[0];r=vt.id,o=vt.x,c=vt.y,l=0,h=0,u=null,g=!0,_=null}}const k={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},B={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let Y=0,et=0;const Q={},lt=new Set,St=[];function xt(){for(const T of Fa)Q[T]!==void 0&&(Q[T]=void 0),ut(T);P.reset(),b.clear(),w.clear(),C=Ir(),D=!1,r=null,l=0,h=0,u=null,g=!1,_=null,m=null,I=-1,S=0,M=0}const Z=()=>{document.hidden&&xt()},at=T=>{if(Na(T.target)){b.add(T.pointerId);return}b.delete(T.pointerId),w.set(T.pointerId,{id:T.pointerId,x:T.clientX,y:T.clientY}),r===null&&!D&&(r=T.pointerId,o=T.clientX,c=T.clientY,l=0,h=0,u=T.pointerId,f=T.clientX,d=T.clientY,g=!1),G()},pt=T=>{if(T.pointerId===m&&(T.pointerType==="mouse"&&T.buttons===0||T.clientX===0&&T.clientY===0&&(p!==0||x!==0)||(S=T.clientX-p,M=T.clientY-x)),y(P.move(T.pointerId,T.clientX,T.clientY,performance.now())),!b.has(T.pointerId)&&w.has(T.pointerId)&&(w.set(T.pointerId,{id:T.pointerId,x:T.clientX,y:T.clientY}),G()),b.has(T.pointerId)||T.pointerId!==r)return;T.pointerId===u&&Math.hypot(T.clientX-f,T.clientY-d)>Fh&&(g=!0);let mt=T.clientX-o,tt=T.clientY-c;const vt=Math.hypot(mt,tt),$=a();vt>$&&(mt*=$/vt,tt*=$/vt),l=mt,h=tt};function ut(T){if(!k[T])return;k[T]=!1,T==="attack"&&(B.attackReleased=!0);const mt=document.getElementById(`btn-${T}`);mt==null||mt.classList.remove("is-down")}const ft=T=>{const mt=w.delete(T.pointerId),tt=b.delete(T.pointerId);mt&&G(),T.pointerId===m&&(m=null,I=performance.now()),y(P.end(T.pointerId,T.clientX,T.clientY,performance.now()));for(const vt of Fa)Q[vt]===T.pointerId&&(Q[vt]=void 0,ut(vt));tt||(T.pointerId===u&&(!g&&!Na(T.target)&&(_={x:T.clientX,y:T.clientY}),u=null),T.pointerId===r&&(r=null,l=0,h=0))};for(const T of Fa){const mt=document.getElementById(`btn-${T}`);if(!mt)continue;const tt=T==="attack"||T==="skill2",vt=nt=>{if(nt.preventDefault(),Q[T]===void 0){Q[T]=nt.pointerId,k[T]=!0,T==="jump"&&(B.jump=!0),T==="reset"&&(B.reset=!0),T==="sprint"&&(B.sprintPressed=!0),T==="attack"&&(B.attackPressed=!0),T==="skill2"&&(B.skill2=!0),mt.classList.add("is-down"),y(P.begin(T,nt.pointerId,nt.clientX,nt.clientY,performance.now()));try{mt.setPointerCapture(nt.pointerId)}catch{}tt&&(m=nt.pointerId,p=nt.clientX,x=nt.clientY,S=0,M=0,I=-1)}},$=nt=>{Q[T]===nt.pointerId&&(Q[T]=void 0,ut(T),y(P.end(nt.pointerId,nt.clientX,nt.clientY,performance.now())))},it=nt=>{Q[T]===nt.pointerId&&(Q[T]=void 0,ut(T),y(P.cancel(nt.pointerId,performance.now())))};mt.addEventListener("pointerdown",vt),mt.addEventListener("pointerup",$),mt.addEventListener("pointercancel",it),St.push(()=>{mt.removeEventListener("pointerdown",vt),mt.removeEventListener("pointerup",$),mt.removeEventListener("pointercancel",it)})}const Rt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const T of Rt){const mt=tt=>{tt.preventDefault(),Y=Number(T.dataset.weapon)||0};T.addEventListener("pointerdown",mt),St.push(()=>T.removeEventListener("pointerdown",mt))}const Dt=T=>{const mt=T.key.toLowerCase();if((mt===" "||mt.startsWith("arrow"))&&T.preventDefault(),lt.has(mt))return;lt.add(mt),mt===" "&&(B.jump=!0),mt==="r"&&(B.reset=!0),mt==="shift"&&(B.sprintPressed=!0),mt==="j"&&(B.attackPressed=!0),mt==="k"&&(B.skill2=!0),mt>="1"&&mt<="5"&&(Y=Number(mt)),mt>="6"&&mt<="9"&&(et=Number(mt)-5);const tt=Math.max(Bh,s().keyStep||1.12);(mt==="="||mt==="+")&&(z*=tt),(mt==="-"||mt==="_")&&(z/=tt)},Ut=T=>{const mt=T.key.toLowerCase();lt.has(mt)&&(lt.delete(mt),mt==="j"&&(B.attackReleased=!0))},At=T=>{if(Na(T.target))return;T.preventDefault();const mt=T.deltaMode===1?T.deltaY*zh:T.deltaMode===2?T.deltaY*Oh:T.deltaY;z*=kh(mt,s().wheelStep)},$t=T=>{T.preventDefault()};return window.addEventListener("pointerdown",at),window.addEventListener("pointermove",pt),window.addEventListener("pointerup",ft),window.addEventListener("pointercancel",ft),window.addEventListener("blur",xt),document.addEventListener("visibilitychange",Z),window.addEventListener("keydown",Dt),window.addEventListener("keyup",Ut),window.addEventListener("wheel",At,{passive:!1}),window.addEventListener("gesturestart",$t),{peekAim(){const T=performance.now(),mt=Math.hypot(S,M),tt=m!==null||I>=0&&T-I<hc;if(!(tt&&mt>Ms))return{active:!1,holding:tt,x:0,z:0,dx:S,dy:M};const $=n(),it=S/mt,nt=M/mt,A=$.rightX*it+$.forwardX*-nt,v=$.rightZ*it+$.forwardZ*-nt,O=Math.hypot(A,v)||1;return{active:!0,holding:tt,x:A/O,z:v/O,dx:S,dy:M}},sample(){const T=a();let mt=r!==null?Math.max(-1,Math.min(1,l/T)):0,tt=r!==null?Math.max(-1,Math.min(1,h/T)):0,vt=0,$=0;(lt.has("a")||lt.has("arrowleft"))&&(vt-=1),(lt.has("d")||lt.has("arrowright"))&&(vt+=1),(lt.has("w")||lt.has("arrowup"))&&($-=1),(lt.has("s")||lt.has("arrowdown"))&&($+=1),mt+=vt,tt+=$;let it=Math.hypot(mt,tt);it>1&&(mt/=it,tt/=it,it=1);const nt=mt,A=tt;it<e&&(mt=0,tt=0);const v=n();let O=v.rightX*mt+v.forwardX*-tt,K=v.rightZ*mt+v.forwardZ*-tt;const st=Math.hypot(O,K);st>1&&(O/=st,K/=st);const J=performance.now();y(P.poll(J));const rt=Math.hypot(S,M),ht=m!==null||I>=0&&J-I<hc,_t=ht&&rt>Ms;let zt=0,ct=0;if(_t){const Nt=S/rt,Zt=M/rt,F=v.rightX*Nt+v.forwardX*-Zt,N=v.rightZ*Nt+v.forwardZ*-Zt,U=Math.hypot(F,N)||1;zt=F/U,ct=N/U}!ht&&m===null&&(S=0,M=0,I=-1);const bt=_;_=null;const It=z;z=1;const kt={moveX:O,moveZ:K,jumpPressed:B.jump,sprintHeld:k.sprint||lt.has("shift"),sprintPressed:B.sprintPressed,resetPressed:B.reset,attackPressed:B.attackPressed,attackHeld:k.attack||lt.has("j"),attackReleased:B.attackReleased,skill2Pressed:B.skill2,weaponSlot:Y,dummyClickId:et,aimX:zt,aimZ:ct,aimActive:_t};B.jump=!1,B.reset=!1,B.sprintPressed=!1,B.attackPressed=!1,B.attackReleased=!1,B.skill2=!1,Y=0,et=0;const Et=R.map(Nt=>Ch(Nt,v,Ms));R=[],Et.length>0&&(L=Et[Et.length-1]);const Vt=r!==null?"pointer":lt.size>0?"keyboard":"idle";return{intents:kt,stickX:mt,stickY:tt,stickRawX:nt,stickRawY:A,stickHeld:r!==null,source:Vt,tap:bt,zoomScale:It,gestures:Et,lastGesture:L}},dispose(){window.removeEventListener("pointerdown",at),window.removeEventListener("pointermove",pt),window.removeEventListener("pointerup",ft),window.removeEventListener("pointercancel",ft),window.removeEventListener("blur",xt),document.removeEventListener("visibilitychange",Z),window.removeEventListener("keydown",Dt),window.removeEventListener("keyup",Ut),window.removeEventListener("wheel",At),window.removeEventListener("gesturestart",$t),P.reset();for(const T of St)T()}}}const da=1,ha=2,ua=4,Dl=8,fa=16,pa=32,Il=64,Ul=128,Gh=[[da,"atk"],[ha,"dash"],[ua,"link"],[Dl,"air"],[fa,"hurt"],[pa,"aim"],[Il,"spr"],[Ul,"chan"]];function ui(i){if(i===0)return"-";const t=Gh.filter(([e])=>(i&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Vh=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw"],Wh=0,Xh=15,za=19,Qe={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Ce=i=>Number.isFinite(i)?Math.round(i*1e3)/1e3:0,tn=i=>Math.round(i*180/Math.PI*10)/10,Oa=Math.PI*2;function ys(i){let t=i%Oa;return t>Math.PI&&(t-=Oa),t<-Math.PI&&(t+=Oa),t}function $h(i,t){let e=0;return i.combat.phase!=="idle"&&(e|=da),i.dash.phase!=="idle"&&(e|=ha),i.playerLink.phase!=="idle"&&(e|=ua),i.character.grounded||(e|=Dl),i.playerHurt.type!=="none"&&(e|=fa),t.intents.aimActive&&(e|=pa),i.character.sprinting&&(e|=Il),i.abilities.channeling&&(e|=Ul),e}function Yh(i){const t=`(${i.x.toFixed(1)},${i.z.toFixed(1)})`;switch(i.type){case"attack-start":return`slot${i.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${i.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${i.value} ${t}`;case"weapon-change":return`slot${i.value}`;case"dummy-mode":return`dummy${i.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return i.value!==0?`v${i.value}`:""}}function Zh(i){const t={sampleHz:i.sampleHz??Qe.sampleHz,sampleCapacity:i.sampleCapacity??Qe.sampleCapacity,eventCapacity:i.eventCapacity??Qe.eventCapacity,anomalyCapacity:i.anomalyCapacity??Qe.anomalyCapacity,dirJumpDeg:i.dirJumpDeg??Qe.dirJumpDeg,aimDropDeg:i.aimDropDeg??Qe.aimDropDeg,freezeMs:i.freezeMs??Qe.freezeMs,freezeSpeed:i.freezeSpeed??Qe.freezeSpeed,stickLostMs:i.stickLostMs??Qe.stickLostMs,spikeMs:i.spikeMs??Qe.spikeMs},e=i.meta,n=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0};let o=!0,c=-1,l=-1e9,h=null,u=0,f=0,d="",g=-1,_=-1,m=-1,p=0,x=-1e9,S=-1,M={},I=0,P=0;function R(C,D){const z=1/t.sampleHz,G=C[Wh];G-l<z-1e-6||(n.length>=t.sampleCapacity&&n.shift(),n.push(C),l=G)}function L(C,D,z,G,k,B){const Y=M[C]??-1e9;if(D-Y<1.2)return;if(M[C]=D,C==="frameSpike"){let Q=0;for(const lt of a)lt.kind==="frameSpike"&&Q++;if(Q>=6)return}a.length>=t.anomalyCapacity&&a.shift();let et=n.slice(-7);B&&(et.length===0||et[et.length-1]!==B)&&(et=[...et.slice(-6),B]),a.push({kind:C,t:Ce(D),tick:z,ms:Math.round(G),detail:k,ctx:et}),C==="dirJump"?r.dirJumps++:C==="aimDrop"?r.aimDrops++:C==="moveFreeze"?r.freezes++:C==="stickLost"&&r.stickLosts++}function b(C,D,z,G){s.length>=t.eventCapacity&&s.shift(),s.push({t:Ce(z),tick:G,k:C,d:D})}function y(C){switch(C.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=C.tick;break}}function w(){const C=r,D=C.wallMs/1e3,z=C.gestures,G=B=>Object.entries(z).filter(([Y])=>Y.endsWith(`.${B}`)).reduce((Y,[,et])=>Y+et,0),k=[];if(k.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),k.push(`运行 ${D.toFixed(1)}s / ${C.frames} 帧 · ${C.fps.toFixed(1)}fps · 最大 ${C.dtMax.toFixed(0)}ms · 尖峰 ${C.spikes} · 步 ${C.steps}`),k.push(`摇杆活跃 ${D>0?Math.round(C.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${G("press")}（单击 ${G("tap")} / 双击 ${G("doubleTap")} / 拖拽 ${G("drag")} / 长按 ${G("longPress")} / 打断 ${G("cancel")} / 拖放 ${G("release")}）`),k.push(`攻击 ${C.attacks}(中${C.hits}) · 受击 ${C.hurts} · 派生 ${C.links}(中${C.linkHits}) · 翻滚 ${C.rolls} 闪现 ${C.blinks} · 跳 ${C.jumps} · 复位 ${C.resets}`),k.push(`法杖 引导${C.channels} 飞弹${C.bolts} 电环${C.rings} · 弓蓄力${C.bowCharges} · 当前武器 ${d||"-"}`),k.push(`异常 ${C.dirJumps+C.aimDrops+C.freezes+C.stickLosts}（dir ${C.dirJumps} / aim ${C.aimDrops} / freeze ${C.freezes} / stick ${C.stickLosts}） · 掉帧尖峰 ${C.spikes}`+(C.inTurns>0?` · 输入转向 ${C.inTurns} 次（最大 ${C.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const B of a.slice(-6)){k.push(`· ${B.kind} @t${B.t.toFixed(2)} tick${B.tick} ${B.ms>0?`${B.ms}ms `:""}${B.detail}`);const Y=B.ctx.map(Q=>String(Q[Xh])).join(" "),et=B.ctx.map(Q=>Q[za]===""||Q[za]==null?".":String(Q[za])).join(" ");k.push(`  yaw ${Y}`),k.push(`  in  ${et}`)}if(s.length>0){k.push("最近事件：");for(const B of s.slice(-12))k.push(`  ${B.t.toFixed(2)} ${B.k} ${B.d}`.trimEnd())}return k.push(`UA ${e.ua}`),k.join(`
`)}return{sample(C,D,z,G=0){r.frames++,r.steps+=G,r.wallMs+=z,z>r.dtMax&&(r.dtMax=z),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=C.time;const k=C.time;if(c<0&&(c=k),I=k,P=C.tick,!o)return;const B=C.character,Y=Math.hypot(D.stickX,D.stickY),et=Math.hypot(B.velocity.x,B.velocity.z);d=C.combat.weapon;const Q=$h(C,D),lt=B.facing,xt=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;Y>.2&&(r.stickActiveMs+=z);const Z=[Ce(k),C.tick,Math.round(z*10)/10,Ce(D.stickX),Ce(D.stickY),Ce(D.stickRawX),Ce(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),Ce(D.intents.moveX),Ce(D.intents.moveZ),Ce(B.position.x),Ce(B.position.z),Ce(B.velocity.x),Ce(B.velocity.z),tn(lt),tn(B.bodyYaw),Q,Ce(B.stride),xt===null?"":tn(xt)];R(Z);const at=k*1e3<S;if(z>t.spikeMs&&!at&&k-c>.6&&(r.spikes++,L("frameSpike",k,C.tick,z,`dt ${z.toFixed(0)}ms fl=${ui(Q)}`,Z)),h!==null&&!at){const ft=Math.abs(tn(ys(lt-h))),Rt=Math.abs(tn(ys(B.moveYaw-u))),Dt=(f|Q)&(da|ha|ua|fa),Ut=xt===null?null:Math.abs(tn(ys(lt-xt))),At=xt===null||h===null?null:Math.abs(tn(ys(h-xt))),$t=Ut!==null&&At!==null&&Ut<At-.5,T=(f&pa)!==0&&(Q&pa)===0,mt=Ut!==null&&(Ut<=12||$t);ft>t.aimDropDeg&&T?L("aimDrop",k,C.tick,0,`${ft.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) fl=${ui(Q)}`,Z):ft>t.dirJumpDeg&&Dt===0&&!T&&(mt?(r.inTurns++,ft>r.inTurnMax&&(r.inTurnMax=ft)):L("dirJump",k,C.tick,0,`${ft.toFixed(0)}° res${Ut===null?" 无输入":`${Ut.toFixed(0)}°`} yaw ${tn(h)}→${tn(lt)} in ${xt===null?".":tn(xt)}° mvΔ${Rt.toFixed(0)}° fl=${ui(f)}→${ui(Q)}`,Z))}const pt=(Q&(da|ha|ua|fa))!==0,ut=C.tick-x<30;Y>.35&&et<t.freezeSpeed&&!pt&&!ut?(g<0&&(g=k),k-g>=t.freezeMs/1e3&&k>=_&&(L("moveFreeze",k,C.tick,(k-g)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${et.toFixed(2)} ${D.source} fl=${ui(Q)}`,Z),_=k+1.5,g=-1)):g=-1,D.stickHeld?(Y>p&&(p=Y),p>.35&&Y<.06?(m<0&&(m=k),k-m>=t.stickLostMs/1e3&&(L("stickLost",k,C.tick,(k-m)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${ui(Q)}`,Z),m=-1,p=0)):m=-1):(p=0,m=-1),h=lt,u=B.moveYaw,f=Q},event(C,D){const z=Yh(C);y(C),o&&(C.type==="dash-ready"||C.type==="combo-reset"||C.type==="stepUp"||b(C.type,z,D,C.tick))},gesture(C){const D=`${C.button}.${C.kind}`;r.gestures[D]=(r.gestures[D]??0)+1,o&&(C.kind==="longPress"||C.kind==="doubleTap"||C.kind==="drag"||C.kind==="cancel")&&b(`g:${C.kind}`,`${C.button} ${C.heldMs.toFixed(0)}ms d${C.distance.toFixed(0)}px ${C.angleDeg.toFixed(0)}°`,I,P)},suspend(C){S=I*1e3+C,g=-1,m=-1},setEnabled(C){o=C,C||(h=null,g=-1,m=-1)},clear(){n.length=0,s.length=0,a.length=0,M={},l=-1e9,h=null,f=0,g=-1,m=-1,p=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0;for(const C of Object.keys(r.gestures))delete r.gestures[C]},status(){const C=r.simS,D=a.some(z=>C-z.t<8&&(z.kind==="dirJump"||z.kind==="aimDrop"||z.kind==="moveFreeze"||z.kind==="stickLost"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:D,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:Vh,samples:n.slice(),events:s.slice(),anomalies:a.slice()}},summary:w}}const qh={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},jh={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},Kh={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},Jh={core:qh,scene:jh,view:Kh};function Do(i){return JSON.parse(JSON.stringify(i))}const Io=Jh,Qh=Do(Io.core),tu=Do(Io.scene),en=Do(Io.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class on{constructor(t,e,n,s,a="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),on.nextNameID=on.nextNameID||0,this.$name.id=`lil-gui-name-${++on.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class eu extends on{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Ur(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const nu={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Ur,toHexString:Ur},rs={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},iu={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=rs.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return rs.toHexString(s)}},su={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=rs.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return rs.toHexString(s)}},au=[nu,rs,iu,su];function ru(i){return au.find(t=>t.match(i))}class ou extends on{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=ru(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Ur(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Ba extends on{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class cu extends on{constructor(t,e,n,s,a,r){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},n=x=>{const S=parseFloat(this.$input.value);isNaN(S)||(this._snapClampSetValue(S+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),n(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,h,u;const f=5,d=x=>{o=x.clientX,c=l=x.clientY,r=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(r){const S=x.clientX-o,M=x.clientY-c;Math.abs(M)>f?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(S)>f&&_()}if(!r){const S=x.clientY-l;u-=S*this._step*this._arrowKeyMultiplier(x),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,S,M,I)=>(p-x)/(S-x)*(I-M)+M,e=p=>{const x=this.$slider.getBoundingClientRect();let S=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(S)},n=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),r=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(o=p.touches[0].clientX,c=p.touches[0].clientY,r=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",f))},u=p=>{if(r){const x=p.touches[0].clientX-o,S=p.touches[0].clientY-c;Math.abs(x)>Math.abs(S)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f))}else p.preventDefault(),e(p.touches[0].clientX)},f=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",f)},d=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const S=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+S),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(d,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class lu extends on{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class du extends on{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const hu=`.lil-gui {
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
}`;function uu(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let uc=!1;class ma{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!uc&&o&&(uu(hu),uc=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,a){if(Object(n)===n)return new lu(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new cu(this,t,e,n,s,a);case"boolean":return new eu(this,t,e);case"string":return new du(this,t,e);case"function":return new Ba(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new ou(this,t,e,n)}addFolder(t){const e=new ma({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Ba||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Ba)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function fu(i,t,e,n){const s=document.getElementById("debug-panel"),a=s?new ma({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new ma({title:"实验台 · 调试面板"}),r=a.addFolder("模拟");r.add(e,"timeScale",0,3,.05).name("时间缩放"),r.add(e,"paused").name("暂停"),r.add({step:n.singleStep},"step").name("单步 (1 tick)"),r.add({reset:n.reset},"reset").name("复位全部");const o=a.addFolder("模块");o.add(i.modules,"movement").name("movement"),o.add(i.modules,"combat").name("combat"),o.add(i.modules,"links").name("links"),o.add(i.modules,"orientation").name("orientation"),o.add(i.modules,"targeting").name("targeting"),o.add(i.modules,"hits").name("hits"),o.add(i.modules,"separation").name("separation"),o.add(i.modules,"dash").name("dash"),o.add(i.modules,"camera").name("camera"),o.add(i.modules,"dummies").name("dummies"),o.add(i.modules,"abilities").name("abilities");const c=i.config,l=a.addFolder("移动参数");l.add(c,"moveSpeed",1,10,.1).name("移动速度"),l.add(c,"sprintMultiplier",1,3,.05).name("冲刺倍率"),l.add(c,"acceleration",1,40,.5).name("加速度"),l.add(c,"friction",1,40,.5).name("摩擦"),l.add(c,"gravity",5,60,.5).name("重力"),l.add(c,"jumpSpeed",2,16,.2).name("起跳速度"),l.add(c,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),l.add(c,"characterRadius",.1,.8,.01).name("角色半径"),l.add(c,"characterHeight",.6,2.2,.05).name("角色身高"),l.add(c,"strideLength",.3,3,.05).name("基础步幅"),l.add(c,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),l.add(c,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const h=a.addFolder("程序化步态 (v8)");h.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),h.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),h.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),h.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),h.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),h.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),h.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),h.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),h.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),h.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),h.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆");const u=a.addFolder("程序动画 (v8c/v8d)");u.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),u.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),u.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const f=t.animation.stride;u.add(f,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),u.add(f,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),u.add(f,"cycles",1,3,1).name("每段跨步周期数"),u.add(f,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),u.add(f,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),u.add(f,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),u.add(f,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),u.add(f,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),u.add(f,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),u.add(f,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),u.add(f,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),u.add(f,"heavyScale",0,1,.01).name("大剑重击收敛系数"),u.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),u.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),u.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),u.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),u.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),u.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),u.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),u.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),u.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),u.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),u.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),u.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const d=c.combat,g=a.addFolder("战斗参数"),_=g.add(i.combat,"weapon",ii).name("当前武器");g.add(d,"comboWindow",.1,2,.05).name("连击窗口 (s)"),g.add(d,"settle",0,.8,.01).name("段间停顿 (s)"),g.add(d,"attackMoveScale",0,1,.01).name("攻击时移动比例"),g.add(d,"autoCombo").name("按住自动连击"),g.add(d.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),g.add(d.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),g.add(d.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),g.add(d.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),g.add(d.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),g.add(d.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const m=c.abilities;g.add(m.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),g.add(m.arcane,"speed",3,24,.5).name("飞弹速度"),g.add(m.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),g.add(m.ring,"radius",.5,5,.1).name("电环半径"),g.add(m.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),g.add(m.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const p=c.orientation,x=a.addFolder("朝向参数");x.add(p,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),x.add(p,"headTurnRate",.5,40,.5).name("头部转向速率"),x.add(p,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),x.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),x.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),x.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const S=a.addFolder("惯性倾斜 / 盆骨 (v8g)"),M=t.lean;S.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),S.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),S.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),S.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),S.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),S.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),S.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),S.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),S.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const I=a.addFolder("足部 IK (v8g)"),P=t.ik;I.add(P,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),I.add(P,"weight",0,1,.01).name("钉地权重"),I.add(P,"attackScale",0,1,.01).name("攻击时权重倍率"),I.add(P,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const R=a.addFolder("程序动画 / 武器握持");R.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),R.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),R.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),R.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const L=c.targeting,b=a.addFolder("目标辅助");b.add(L,"targetAssist").name("启用目标辅助"),b.add(L,"range",1,14,.5).name("锁定范围 (m)"),b.add(L,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),b.add(L,"frontBias",0,4,.1).name("朝向加权"),b.add(L,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),b.add(L,"maxLungeScale",1,3,.1).name("前冲最大放大");const y=c.hits,w=a.addFolder("命中 / 受击 / 击退");w.add(y,"arcDeg",10,120,5).name("命中扇区半角 (°)"),w.add(y,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),w.add(y,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),w.add(y,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),w.add(y.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),w.add(y.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),w.add(y,"dummyReach",.5,4,.1).name("假人命中距离 (m)");const C=c.separation,D=a.addFolder("角色间分离");D.add(C,"iterations",1,8,1).name("迭代次数"),D.add(C,"slop",0,.05,.002).name("额外分离量 (m)");const z=c.dash,G=a.addFolder("冲刺 / 闪避");G.add(z,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),G.add(z,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),G.add(z,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),G.add(z,"blinkDistance",1,12,.25).name("闪现距离 (m)"),G.add(z,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),G.add(z,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),G.add(z,"blinkClearVelocity").name("闪现清空速度"),G.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),G.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const k=c.camera,B=a.addFolder("智能相机");B.add(k,"radius",2,18,.5).name("威胁评估半径 (m)"),B.add(k,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),B.add(k,"saturation",.5,8,.1).name("威胁归一化饱和"),B.add(k,"pushIn",0,.5,.01).name("无威胁推进比例"),B.add(k,"maxPullback",0,1,.02).name("最大拉远比例"),B.add(k,"maxOffset",0,6,.1).name("最大构图平移 (m)"),B.add(k,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),B.add(k,"framingBias",0,1,.05).name("威胁质心平移系数"),B.add(k,"attackBoost",0,2,.05).name("挥砍中额外加权"),B.add(k.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),B.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Y=a.addFolder("输入");Y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),Y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const et=c.dummies,Q=a.addFolder("假人参数");Q.add(et,"moveSpeed",.5,8,.1).name("移动速度"),Q.add(et,"wanderRadius",.5,8,.1).name("游走半径"),Q.add(et,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),Q.add(et,"followStopDistance",.3,5,.1).name("跟随停距"),Q.add(et,"keepDistance",1,10,.1).name("保持距离"),Q.add(et,"keepDeadZone",.1,2,.05).name("保持死区"),Q.add(et,"attackRange",.5,5,.1).name("攻击距离"),Q.add(et,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const lt=a.addFolder("相机");lt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),lt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),lt.add(t.camera,"distance",6,35,.5).name("距离"),lt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),lt.add(t.camera,"fov",25,90,1).name("FOV");const St=a.addFolder("相机缩放 (v8e)");St.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),St.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),St.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),St.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),St.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),St.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),St.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),St.add({reset:n.resetZoom},"reset").name("缩放归 1");const xt=a.addFolder("受击分层 (v8f)"),Z=t.hurt;xt.add(Z,"enabled").name("启用分层受击 (关=旧版对照)"),xt.add(Z,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),xt.add(Z,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),xt.add(Z,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),xt.add(Z,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),xt.add(Z,"upperShiftScale",0,1,.01).name("上身位移缩放"),xt.add(Z,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),xt.add(Z.hitHeight,"light",0,1,.01).name("轻击命中部位"),xt.add(Z.hitHeight,"heavy",0,1,.01).name("重击命中部位"),xt.add(Z.hitHeight,"knock",0,1,.01).name("击退命中部位"),xt.add(Z,"leanLight",0,1.5,.01).name("轻击力度"),xt.add(Z,"leanHeavy",0,1.5,.01).name("重击力度"),xt.add(Z,"leanKnock",0,1.5,.01).name("击退力度"),xt.add(Z,"flashStrength",0,2,.05).name("受击闪光强度");const at=[{name:"打腹 (abdomen)",p:Z.abdomen},{name:"打肩 (shoulder)",p:Z.shoulder}].map(({name:Dt,p:Ut})=>{const At=xt.addFolder(Dt);return At.add(Ut,"upperPitch",0,2,.01).name("上身前后倾斜"),At.add(Ut,"upperRoll",0,2,.01).name("上身侧倾"),At.add(Ut,"upperYaw",0,1.5,.01).name("肩部扭转"),At.add(Ut,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),At.add(Ut,"shift",0,.8,.01).name("身体反应位移"),At.add(Ut,"drop",0,.4,.01).name("整体下沉"),At.add(Ut,"back",0,.4,.01).name("屁股向后"),At.add(Ut,"knee",0,1.6,.01).name("屈膝"),At.add(Ut,"hip",0,1,.01).name("髋前倾"),At.add(Ut,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),At}),pt=a.addFolder("派生招 (v9a)"),ut=i.config.links;pt.add(ut,"enabled").name("总开关 (false=旧连击)"),pt.add(ut.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),pt.add(ut.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),pt.add(ut.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),pt.add(ut,"sharedCooldown",0,3,.05).name("共享 CD (s)"),pt.add(ut,"triggerWhileSprinting").name("长跑中可直接触发"),pt.add(ut.search,"range",1,14,.1).name("索敌距离 (m)"),pt.add(ut.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),pt.add(ut.search,"stopDistance",0,3,.05).name("停住距离 (m)");const ft=ut.moves["sword-shield"];ft&&(pt.add(ft,"enabled").name("剑盾盾击"),pt.add(ft,"distance",0,8,.1).name("冲锋极限 (m)"),pt.add(ft,"windup",0,.5,.01).name("前摇 (s)"),pt.add(ft,"active",0,.8,.01).name("冲锋 / 命中 (s)"),pt.add(ft,"recovery",0,.8,.01).name("收势 (s)"),pt.add(ft.hit,"radius",0,4,.05).name("命中半径 (m)"),pt.add(ft.hit,"width",0,2,.05).name("扫掠半径 (m)"),pt.add(ft.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),pt.add(ft.hit,"duration",0,1.5,.01).name("僵直 (s)")),pt.add(i.config.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Rt=a.addFolder("显示");return Rt.add(e,"showColliders").name("碰撞盒线框").onChange(n.onToggleColliders),Rt.add(e,"showGrid").name("地面网格").onChange(n.onToggleGrid),l.close(),u.close(),g.close(),x.close(),R.close(),S.close(),I.close(),b.close(),w.close(),D.close(),G.close(),B.close(),Y.close(),o.close(),Q.close(),lt.close(),St.close(),xt.close(),pt.close(),at.forEach(Dt=>Dt.close()),Rt.close(),a.close(),{gui:a,refreshWeapon:()=>_.updateDisplay()}}const pu=["剑盾","双剑","大剑","法杖","弓"],mu={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function gu(i){return{update(t,e,n,s,a,r,o=!1){const c=t.character,l=c.position,h=c.velocity,u=t.combat,f=t.events.length>0?t.events[t.events.length-1]:null,d=At=>At.toFixed(2),g=At=>(At*180/Math.PI).toFixed(0),_=pu[ii.indexOf(u.weapon)]??u.weapon,m=Math.round(u.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,S=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,M=x.phase==="active"?`${x.kind}@${S.toFixed(0)}%`:`${x.kind} cd${d(x.cooldown)}`,I=s.intents.aimActive?`(${d(s.intents.aimX)},${d(s.intents.aimZ)})`:"-",P=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),R=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),L=Math.abs(P)+Math.abs(R)+1e-6,b=Math.round(Math.abs(R)/L*100),y=`strafe ${b}%${P<-.05?" back":""}`,w=t.camera,C=`threat ${(w.threat*100).toFixed(0)}%  dist×${d(w.distanceScale)}  off (${d(w.offsetX)},${d(w.offsetZ)})  pitch +${d(w.pitchDelta)}°  n=${w.threatCount}`,D=r?d(r.attackBlend):"-",z=r==null?void 0:r.attackWeights,G=z?`gw ${d(z.gaitScale)}  lw ${d(z.attackLegWeight)}  spd ${d(z.driveSpeed)}`:"-",k=z?`${d(z.gaitScale)}/${d(z.attackLegWeight)}`:"-",B=r?`${r.landing.kind} ${d(r.landing.pulse)} t${d(r.landing.remaining)} vy${d(r.landing.impactVy)}`:"-",Y=r?`${r.landing.kind}/${d(r.landing.pulse)}`:"-",et=(r==null?void 0:r.zoom)!==void 0?`zoom ×${d(r.zoom)}`:"-",Q=r==null?void 0:r.hurt,lt=Q?`hurt ${t.playerHurt.type}  部位h${d(Q.hitHeight)}  脉冲p${d(Q.pulse)}  上身${d(Q.upperShift)}  重心${d(Q.comShift)}  后坐${d(Q.pelvisBack)}  屈膝${d(Q.knee)}`:"-",St=Q?`${d(Q.hitHeight)}/${d(Q.pulse)}/${d(Q.knee)}`:"-",xt=r==null?void 0:r.ik,Z=xt?`${xt.active?"on":"off"} w${d(xt.weight)} e${d(xt.maxError)}`:"-",at=t.playerLink,pt=`link ${at.kind||"-"}  ${at.phase}  prog ${d(at.progress)}  win ${d(at.linkWindow)}s  cd ${d(at.cooldown)}s  hits ${at.hitIds.length}  travel ${d(at.travelled)}/${d(at.travel)}m  id ${at.id}`,ut=`${at.phase}/${at.kind||"-"}/w${d(at.linkWindow)}`,ft=s.lastGesture,Rt=ft?`${ft.button} ${ft.kind} ${ft.heldMs.toFixed(0)}ms d${ft.distance.toFixed(0)}px ${ft.angleDeg.toFixed(0)}° taps${ft.taps}`:"-",Dt=t.dummies.map(At=>`${At.id}:${mu[At.mode]}`).join("  ");if(o){i.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${u.phase} · lk ${at.phase}${at.kind?`/${at.kind}`:""} w${d(at.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?i.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${n}`,`pos (${d(l.x)},${d(l.y)},${d(l.z)})  vel (${d(h.x)},${d(h.y)},${d(h.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${b}%  stick(${d(s.stickX)},${d(s.stickY)}) ${s.source}  str${d(c.stride)}`,`weapon ${_}  ${u.phase}  combo ${u.comboIndex}/3  atk ${d(u.attackProgress)}  dash ${M}  ab ${D}  gw/lw ${k}  land ${Y}  ik ${Z}`,`aim ${I}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${St}`,`dummies ${Dt}  atkCount ${t.dummyAttackCount}  cam ${(w.threat*100).toFixed(0)}% ×${d(w.distanceScale)}  ${et}  lk ${ut}`,`event ${f?`${f.type} ${d(f.value)}`:"-"}  scale ${d(a.timeScale)}${a.paused?" [P]":""}  g ${Rt}`].join(`
`):i.textContent=[`tick ${t.tick}   t ${d(t.time)}s   fps ${e.toFixed(0)}   steps ${n}`,`pos  (${d(l.x)}, ${d(l.y)}, ${d(l.z)})`,`vel  (${d(h.x)}, ${d(h.y)}, ${d(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${D}   ${G}   land ${B}`,lt,`ik ${Z}  clamped ${xt?xt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${y}`,`move (${d(s.intents.moveX)}, ${d(s.intents.moveZ)})  stick (${d(s.stickX)}, ${d(s.stickY)})  ${s.source}  aim ${I}`,`weapon ${_}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${d(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${S.toFixed(0)}%  cd ${d(x.cooldown)}s  id ${x.id}  from (${d(x.fromX)},${d(x.fromZ)}) → to (${d(x.toX)},${d(x.toZ)})`,pt,`camera ${C}  ${et}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${Dt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${d(t.impulse.x)}, ${d(t.impulse.z)})`,`event ${f?`${f.type} ${d(f.value)}`:"-"}   scale ${d(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${Rt}`].join(`
`)}}}const _u=8e3;function xu(i,t){const e=document.getElementById("hud-toggle"),n=document.getElementById("hint-toggle");let s=!1,a=!1,r=0;function o(){i.classList.toggle("is-compact",!s),e==null||e.setAttribute("aria-expanded",String(s)),e&&(e.textContent=s?"状态 ▾":"状态 ▸",e.setAttribute("aria-label",s?"收起状态读数":"展开状态读数")),t&&(t.hidden=!a),n==null||n.setAttribute("aria-expanded",String(a)),n&&(n.textContent=a?"操作说明 ▾":"操作说明 ▸",n.setAttribute("aria-label",a?"收起操作说明":"展开操作说明"))}function c(){a&&(a=!1,window.clearTimeout(r),r=0,o())}function l(){s&&(s=!1,o())}function h(d){d.preventDefault(),d.stopPropagation(),s=!s,o()}function u(d){d.preventDefault(),d.stopPropagation(),a=!a,window.clearTimeout(r),r=0,a&&(r=window.setTimeout(c,_u)),o()}e==null||e.addEventListener("pointerdown",h),n==null||n.addEventListener("pointerdown",u);function f(d){const g=d.target;g instanceof Element&&g.closest("#fold-row, #hint")||(c(),l())}return window.addEventListener("pointerdown",f,{capture:!0,passive:!0}),o(),{hudCompact:()=>!s}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Uo="170",vu=0,fc=1,Mu=2,kl=1,Fl=2,Mn=3,Bn=0,Le=1,Te=2,Nn=0,Ii=1,pc=2,mc=3,gc=4,yu=5,Qn=100,Su=101,bu=102,Eu=103,Au=104,Tu=200,wu=201,Ru=202,Cu=203,kr=204,Fr=205,Pu=206,Lu=207,Du=208,Iu=209,Uu=210,ku=211,Fu=212,Nu=213,zu=214,Nr=0,zr=1,Or=2,Fi=3,Br=4,Hr=5,Gr=6,Vr=7,ko=0,Ou=1,Bu=2,zn=0,Hu=1,Gu=2,Vu=3,Wu=4,Xu=5,$u=6,Yu=7,Nl=300,Ni=301,zi=302,Wr=303,Xr=304,ba=306,$r=1e3,ei=1001,Yr=1002,qe=1003,Zu=1004,Ss=1005,rn=1006,Ha=1007,ni=1008,An=1009,zl=1010,Ol=1011,os=1012,Fo=1013,si=1014,Sn=1015,ls=1016,No=1017,zo=1018,Oi=1020,Bl=35902,Hl=1021,Gl=1022,Ze=1023,Vl=1024,Wl=1025,Ui=1026,Bi=1027,Xl=1028,Oo=1029,$l=1030,Bo=1031,Ho=1033,Qs=33776,ta=33777,ea=33778,na=33779,Zr=35840,qr=35841,jr=35842,Kr=35843,Jr=36196,Qr=37492,to=37496,eo=37808,no=37809,io=37810,so=37811,ao=37812,ro=37813,oo=37814,co=37815,lo=37816,ho=37817,uo=37818,fo=37819,po=37820,mo=37821,ia=36492,go=36494,_o=36495,Yl=36283,xo=36284,vo=36285,Mo=36286,qu=3200,ju=3201,Zl=0,Ku=1,kn="",Be="srgb",Gi="srgb-linear",Ea="linear",ne="srgb",fi=7680,_c=519,Ju=512,Qu=513,tf=514,ql=515,ef=516,nf=517,sf=518,af=519,yo=35044,xc="300 es",bn=2e3,ga=2001;class Vi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],sa=Math.PI/180,So=180/Math.PI;function On(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ye[i&255]+ye[i>>8&255]+ye[i>>16&255]+ye[i>>24&255]+"-"+ye[t&255]+ye[t>>8&255]+"-"+ye[t>>16&15|64]+ye[t>>24&255]+"-"+ye[e&63|128]+ye[e>>8&255]+"-"+ye[e>>16&255]+ye[e>>24&255]+ye[n&255]+ye[n>>8&255]+ye[n>>16&255]+ye[n>>24&255]).toLowerCase()}function Pe(i,t,e){return Math.max(t,Math.min(e,i))}function rf(i,t){return(i%t+t)%t}function Ga(i,t,e){return(1-e)*i+e*t}function an(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ie(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Ht{constructor(t=0,e=0){Ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*s+t.x,this.y=a*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Gt{constructor(t,e,n,s,a,r,o,c,l){Gt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l)}set(t,e,n,s,a,r,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=a,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],_=s[0],m=s[3],p=s[6],x=s[1],S=s[4],M=s[7],I=s[2],P=s[5],R=s[8];return a[0]=r*_+o*x+c*I,a[3]=r*m+o*S+c*P,a[6]=r*p+o*M+c*R,a[1]=l*_+h*x+u*I,a[4]=l*m+h*S+u*P,a[7]=l*p+h*M+u*R,a[2]=f*_+d*x+g*I,a[5]=f*m+d*S+g*P,a[8]=f*p+d*M+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*o*l-n*a*h+n*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*r-o*l,f=o*c-h*a,d=l*a-r*c,g=e*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*r)*_,t[3]=f*_,t[4]=(h*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=d*_,t[7]=(n*c-l*e)*_,t[8]=(r*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Va.makeScale(t,e)),this}rotate(t){return this.premultiply(Va.makeRotation(-t)),this}translate(t,e){return this.premultiply(Va.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Va=new Gt;function jl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function _a(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function of(){const i=_a("canvas");return i.style.display="block",i}const vc={};function ns(i){i in vc||(vc[i]=!0,console.warn(i))}function cf(i,t,e){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}function lf(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function df(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const jt={enabled:!0,workingColorSpace:Gi,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ne&&(i.r=En(i.r),i.g=En(i.g),i.b=En(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ne&&(i.r=ki(i.r),i.g=ki(i.g),i.b=ki(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===kn?Ea:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function En(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Mc=[.64,.33,.3,.6,.15,.06],yc=[.2126,.7152,.0722],Sc=[.3127,.329],bc=new Gt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ec=new Gt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);jt.define({[Gi]:{primaries:Mc,whitePoint:Sc,transfer:Ea,toXYZ:bc,fromXYZ:Ec,luminanceCoefficients:yc,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:Mc,whitePoint:Sc,transfer:ne,toXYZ:bc,fromXYZ:Ec,luminanceCoefficients:yc,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}});let pi;class hf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{pi===void 0&&(pi=_a("canvas")),pi.width=t.width,pi.height=t.height;const n=pi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=_a("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=En(a[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(En(e[n]/255)*255):e[n]=En(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let uf=0;class Kl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=On(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Wa(s[r].image)):a.push(Wa(s[r]))}else a=Wa(s);n.url=a}return e||(t.images[this.uuid]=n),n}}function Wa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?hf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ff=0;class Re extends Vi{constructor(t=Re.DEFAULT_IMAGE,e=Re.DEFAULT_MAPPING,n=ei,s=ei,a=rn,r=ni,o=Ze,c=An,l=Re.DEFAULT_ANISOTROPY,h=kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ff++}),this.uuid=On(),this.name="",this.source=new Kl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ht(0,0),this.repeat=new Ht(1,1),this.center=new Ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Nl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case $r:t.x=t.x-Math.floor(t.x);break;case ei:t.x=t.x<0?0:1;break;case Yr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case $r:t.y=t.y-Math.floor(t.y);break;case ei:t.y=t.y<0?0:1;break;case Yr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Re.DEFAULT_IMAGE=null;Re.DEFAULT_MAPPING=Nl;Re.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(l+1)/2,M=(d+1)/2,I=(p+1)/2,P=(h+f)/4,R=(u+_)/4,L=(g+m)/4;return S>M&&S>I?S<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(S),s=P/n,a=R/n):M>I?M<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(M),n=P/s,a=L/s):I<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(I),n=R/a,s=L/a),this.set(n,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-_)/x,this.z=(f-h)/x,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class pf extends Vi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new Re(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Kl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ai extends pf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Jl extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=qe,this.minFilter=qe,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class mf extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=qe,this.minFilter=qe,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ds{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,r,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=a[r+0],d=a[r+1],g=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==f||l!==d||h!==g){let m=1-o;const p=c*f+l*d+h*g+u*_,x=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){const I=Math.sqrt(S),P=Math.atan2(I,p*x);m=Math.sin(m*P)/I,o=Math.sin(o*P)/I}const M=o*x;if(c=c*m+f*M,l=l*m+d*M,h=h*m+g*M,u=u*m+_*M,m===1-o){const I=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=I,l*=I,h*=I,u*=I}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,a,r){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=a[r],f=a[r+1],d=a[r+2],g=a[r+3];return t[e]=o*g+h*u+c*d-l*f,t[e+1]=c*g+h*f+l*u-o*d,t[e+2]=l*g+h*d+o*f-c*u,t[e+3]=h*g-o*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(a/2),f=c(n/2),d=c(s/2),g=c(a/2);switch(r){case"XYZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u+f*d*g;break;case"YZX":this._x=f*h*u+l*d*g,this._y=l*d*u+f*h*g,this._z=l*h*g-f*d*u,this._w=l*h*u-f*d*g;break;case"XZY":this._x=f*h*u-l*d*g,this._y=l*d*u-f*h*g,this._z=l*h*g+f*d*u,this._w=l*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(a-l)*d,this._z=(r-s)*d}else if(n>o&&n>u){const d=2*Math.sqrt(1+n-o-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+l)/d}else if(o>u){const d=2*Math.sqrt(1+o-n-u);this._w=(a-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-o);this._w=(r-s)/d,this._x=(a+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Pe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-n*l,this._z=a*h+r*l+n*c-s*o,this._w=r*h-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=r*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=a*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(t=0,e=0,n=0){X.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ac.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ac.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*n),h=2*(o*e-a*s),u=2*(a*n-r*e);return this.x=e+c*l+r*u-o*h,this.y=n+c*h+o*l-a*u,this.z=s+c*u+a*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Xa.copy(this).projectOnVector(t),this.sub(Xa)}reflect(t){return this.sub(Xa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Xa=new X,Ac=new ds;class hs{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Xe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Xe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Xe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Xe):Xe.fromBufferAttribute(a,r),Xe.applyMatrix4(t.matrixWorld),this.expandByPoint(Xe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),bs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),bs.copy(n.boundingBox)),bs.applyMatrix4(t.matrixWorld),this.union(bs)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Xe),Xe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Yi),Es.subVectors(this.max,Yi),mi.subVectors(t.a,Yi),gi.subVectors(t.b,Yi),_i.subVectors(t.c,Yi),Cn.subVectors(gi,mi),Pn.subVectors(_i,gi),Wn.subVectors(mi,_i);let e=[0,-Cn.z,Cn.y,0,-Pn.z,Pn.y,0,-Wn.z,Wn.y,Cn.z,0,-Cn.x,Pn.z,0,-Pn.x,Wn.z,0,-Wn.x,-Cn.y,Cn.x,0,-Pn.y,Pn.x,0,-Wn.y,Wn.x,0];return!$a(e,mi,gi,_i,Es)||(e=[1,0,0,0,1,0,0,0,1],!$a(e,mi,gi,_i,Es))?!1:(As.crossVectors(Cn,Pn),e=[As.x,As.y,As.z],$a(e,mi,gi,_i,Es))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Xe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Xe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(pn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const pn=[new X,new X,new X,new X,new X,new X,new X,new X],Xe=new X,bs=new hs,mi=new X,gi=new X,_i=new X,Cn=new X,Pn=new X,Wn=new X,Yi=new X,Es=new X,As=new X,Xn=new X;function $a(i,t,e,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){Xn.fromArray(i,a);const o=s.x*Math.abs(Xn.x)+s.y*Math.abs(Xn.y)+s.z*Math.abs(Xn.z),c=t.dot(Xn),l=e.dot(Xn),h=n.dot(Xn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const gf=new hs,Zi=new X,Ya=new X;class Aa{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):gf.setFromPoints(t).getCenter(n);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Zi.subVectors(t,this.center);const e=Zi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Zi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ya.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Zi.copy(t.center).add(Ya)),this.expandByPoint(Zi.copy(t.center).sub(Ya))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const mn=new X,Za=new X,Ts=new X,Ln=new X,qa=new X,ws=new X,ja=new X;class Go{constructor(t=new X,e=new X(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,mn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=mn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(mn.copy(this.origin).addScaledVector(this.direction,e),mn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Za.copy(t).add(e).multiplyScalar(.5),Ts.copy(e).sub(t).normalize(),Ln.copy(this.origin).sub(Za);const a=t.distanceTo(e)*.5,r=-this.direction.dot(Ts),o=Ln.dot(this.direction),c=-Ln.dot(Ts),l=Ln.lengthSq(),h=Math.abs(1-r*r);let u,f,d,g;if(h>0)if(u=r*c-o,f=r*o-c,g=a*h,u>=0)if(f>=-g)if(f<=g){const _=1/h;u*=_,f*=_,d=u*(u+r*f+2*o)+f*(r*u+f+2*c)+l}else f=a,u=Math.max(0,-(r*f+o)),d=-u*u+f*(f+2*c)+l;else f=-a,u=Math.max(0,-(r*f+o)),d=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-r*a+o)),f=u>0?-a:Math.min(Math.max(-a,-c),a),d=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-a,-c),a),d=f*(f+2*c)+l):(u=Math.max(0,-(r*a+o)),f=u>0?a:Math.min(Math.max(-a,-c),a),d=-u*u+f*(f+2*c)+l);else f=r>0?-a:a,u=Math.max(0,-(r*f+o)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Za).addScaledVector(Ts,f),d}intersectSphere(t,e){mn.subVectors(t.center,this.origin);const n=mn.dot(this.direction),s=mn.dot(mn)-n*n,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(a=(t.min.y-f.y)*h,r=(t.max.y-f.y)*h):(a=(t.max.y-f.y)*h,r=(t.min.y-f.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,mn)!==null}intersectTriangle(t,e,n,s,a){qa.subVectors(e,t),ws.subVectors(n,t),ja.crossVectors(qa,ws);let r=this.direction.dot(ja),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Ln.subVectors(this.origin,t);const c=o*this.direction.dot(ws.crossVectors(Ln,ws));if(c<0)return null;const l=o*this.direction.dot(qa.cross(Ln));if(l<0||c+l>r)return null;const h=-o*Ln.dot(ja);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,s,a,r,o,c,l,h,u,f,d,g,_,m){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l,h,u,f,d,g,_,m)}set(t,e,n,s,a,r,o,c,l,h,u,f,d,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/xi.setFromMatrixColumn(t,0).length(),a=1/xi.setFromMatrixColumn(t,1).length(),r=1/xi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),u=Math.sin(a);if(t.order==="XYZ"){const f=r*h,d=r*u,g=o*h,_=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+g*l,e[5]=f-_*l,e[9]=-o*c,e[2]=_-f*l,e[6]=g+d*l,e[10]=r*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,g=l*h,_=l*u;e[0]=f+_*o,e[4]=g*o-d,e[8]=r*l,e[1]=r*u,e[5]=r*h,e[9]=-o,e[2]=d*o-g,e[6]=_+f*o,e[10]=r*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,g=l*h,_=l*u;e[0]=f-_*o,e[4]=-r*u,e[8]=g+d*o,e[1]=d+g*o,e[5]=r*h,e[9]=_-f*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const f=r*h,d=r*u,g=o*h,_=o*u;e[0]=c*h,e[4]=g*l-d,e[8]=f*l+_,e[1]=c*u,e[5]=_*l+f,e[9]=d*l-g,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const f=r*c,d=r*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-f*u,e[8]=g*u+d,e[1]=u,e[5]=r*h,e[9]=-o*h,e[2]=-l*h,e[6]=d*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=r*c,d=r*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+_,e[5]=r*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=o*h,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(_f,t,xf)}lookAt(t,e,n){const s=this.elements;return Fe.subVectors(t,e),Fe.lengthSq()===0&&(Fe.z=1),Fe.normalize(),Dn.crossVectors(n,Fe),Dn.lengthSq()===0&&(Math.abs(n.z)===1?Fe.x+=1e-4:Fe.z+=1e-4,Fe.normalize(),Dn.crossVectors(n,Fe)),Dn.normalize(),Rs.crossVectors(Fe,Dn),s[0]=Dn.x,s[4]=Rs.x,s[8]=Fe.x,s[1]=Dn.y,s[5]=Rs.y,s[9]=Fe.y,s[2]=Dn.z,s[6]=Rs.z,s[10]=Fe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],_=n[6],m=n[10],p=n[14],x=n[3],S=n[7],M=n[11],I=n[15],P=s[0],R=s[4],L=s[8],b=s[12],y=s[1],w=s[5],C=s[9],D=s[13],z=s[2],G=s[6],k=s[10],B=s[14],Y=s[3],et=s[7],Q=s[11],lt=s[15];return a[0]=r*P+o*y+c*z+l*Y,a[4]=r*R+o*w+c*G+l*et,a[8]=r*L+o*C+c*k+l*Q,a[12]=r*b+o*D+c*B+l*lt,a[1]=h*P+u*y+f*z+d*Y,a[5]=h*R+u*w+f*G+d*et,a[9]=h*L+u*C+f*k+d*Q,a[13]=h*b+u*D+f*B+d*lt,a[2]=g*P+_*y+m*z+p*Y,a[6]=g*R+_*w+m*G+p*et,a[10]=g*L+_*C+m*k+p*Q,a[14]=g*b+_*D+m*B+p*lt,a[3]=x*P+S*y+M*z+I*Y,a[7]=x*R+S*w+M*G+I*et,a[11]=x*L+S*C+M*k+I*Q,a[15]=x*b+S*D+M*B+I*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+a*c*u-s*l*u-a*o*f+n*l*f+s*o*d-n*c*d)+_*(+e*c*d-e*l*f+a*r*f-s*r*d+s*l*h-a*c*h)+m*(+e*l*u-e*o*d-a*r*u+n*r*d+a*o*h-n*l*h)+p*(-s*o*h-e*c*u+e*o*f+s*r*u-n*r*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],_=t[13],m=t[14],p=t[15],x=u*m*l-_*f*l+_*c*d-o*m*d-u*c*p+o*f*p,S=g*f*l-h*m*l-g*c*d+r*m*d+h*c*p-r*f*p,M=h*_*l-g*u*l+g*o*d-r*_*d-h*o*p+r*u*p,I=g*u*c-h*_*c-g*o*f+r*_*f+h*o*m-r*u*m,P=e*x+n*S+s*M+a*I;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/P;return t[0]=x*R,t[1]=(_*f*a-u*m*a-_*s*d+n*m*d+u*s*p-n*f*p)*R,t[2]=(o*m*a-_*c*a+_*s*l-n*m*l-o*s*p+n*c*p)*R,t[3]=(u*c*a-o*f*a-u*s*l+n*f*l+o*s*d-n*c*d)*R,t[4]=S*R,t[5]=(h*m*a-g*f*a+g*s*d-e*m*d-h*s*p+e*f*p)*R,t[6]=(g*c*a-r*m*a-g*s*l+e*m*l+r*s*p-e*c*p)*R,t[7]=(r*f*a-h*c*a+h*s*l-e*f*l-r*s*d+e*c*d)*R,t[8]=M*R,t[9]=(g*u*a-h*_*a-g*n*d+e*_*d+h*n*p-e*u*p)*R,t[10]=(r*_*a-g*o*a+g*n*l-e*_*l-r*n*p+e*o*p)*R,t[11]=(h*o*a-r*u*a-h*n*l+e*u*l+r*n*d-e*o*d)*R,t[12]=I*R,t[13]=(h*_*s-g*u*s+g*n*f-e*_*f-h*n*m+e*u*m)*R,t[14]=(g*o*s-r*_*s-g*n*c+e*_*c+r*n*m-e*o*m)*R,t[15]=(r*u*s-h*o*s+h*n*c-e*u*c-r*n*f+e*o*f)*R,this}scale(t){const e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),a=1-n,r=t.x,o=t.y,c=t.z,l=a*r,h=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,r){return this.set(1,n,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,h=r+r,u=o+o,f=a*l,d=a*h,g=a*u,_=r*h,m=r*u,p=o*u,x=c*l,S=c*h,M=c*u,I=n.x,P=n.y,R=n.z;return s[0]=(1-(_+p))*I,s[1]=(d+M)*I,s[2]=(g-S)*I,s[3]=0,s[4]=(d-M)*P,s[5]=(1-(f+p))*P,s[6]=(m+x)*P,s[7]=0,s[8]=(g+S)*R,s[9]=(m-x)*R,s[10]=(1-(f+_))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let a=xi.set(s[0],s[1],s[2]).length();const r=xi.set(s[4],s[5],s[6]).length(),o=xi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],$e.copy(this);const l=1/a,h=1/r,u=1/o;return $e.elements[0]*=l,$e.elements[1]*=l,$e.elements[2]*=l,$e.elements[4]*=h,$e.elements[5]*=h,$e.elements[6]*=h,$e.elements[8]*=u,$e.elements[9]*=u,$e.elements[10]*=u,e.setFromRotationMatrix($e),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,s,a,r,o=bn){const c=this.elements,l=2*a/(e-t),h=2*a/(n-s),u=(e+t)/(e-t),f=(n+s)/(n-s);let d,g;if(o===bn)d=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===ga)d=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,a,r,o=bn){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(r-a),f=(e+t)*l,d=(n+s)*h;let g,_;if(o===bn)g=(r+a)*u,_=-2*u;else if(o===ga)g=a*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const xi=new X,$e=new oe,_f=new X(0,0,0),xf=new X(1,1,1),Dn=new X,Rs=new X,Fe=new X,Tc=new oe,wc=new ds;class ln{constructor(t=0,e=0,n=0,s=ln.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Pe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Pe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(Pe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Pe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Pe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Pe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Tc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Tc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return wc.setFromEuler(this),this.setFromQuaternion(wc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ln.DEFAULT_ORDER="XYZ";class Vo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let vf=0;const Rc=new X,vi=new ds,gn=new oe,Cs=new X,qi=new X,Mf=new X,yf=new ds,Cc=new X(1,0,0),Pc=new X(0,1,0),Lc=new X(0,0,1),Dc={type:"added"},Sf={type:"removed"},Mi={type:"childadded",child:null},Ka={type:"childremoved",child:null};class de extends Vi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:vf++}),this.uuid=On(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=de.DEFAULT_UP.clone();const t=new X,e=new ln,n=new ds,s=new X(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new oe},normalMatrix:{value:new Gt}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=de.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return vi.setFromAxisAngle(t,e),this.quaternion.multiply(vi),this}rotateOnWorldAxis(t,e){return vi.setFromAxisAngle(t,e),this.quaternion.premultiply(vi),this}rotateX(t){return this.rotateOnAxis(Cc,t)}rotateY(t){return this.rotateOnAxis(Pc,t)}rotateZ(t){return this.rotateOnAxis(Lc,t)}translateOnAxis(t,e){return Rc.copy(t).applyQuaternion(this.quaternion),this.position.add(Rc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Cc,t)}translateY(t){return this.translateOnAxis(Pc,t)}translateZ(t){return this.translateOnAxis(Lc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(gn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Cs.copy(t):Cs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gn.lookAt(qi,Cs,this.up):gn.lookAt(Cs,qi,this.up),this.quaternion.setFromRotationMatrix(gn),s&&(gn.extractRotation(s.matrixWorld),vi.setFromRotationMatrix(gn),this.quaternion.premultiply(vi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Dc),Mi.child=t,this.dispatchEvent(Mi),Mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Sf),Ka.child=t,this.dispatchEvent(Ka),Ka.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),gn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),gn.multiply(t.parent.matrixWorld)),t.applyMatrix4(gn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Dc),Mi.child=t,this.dispatchEvent(Mi),Mi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,t,Mf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,yf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];a(t.shapes,u)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),u=r(t.shapes),f=r(t.skeletons),d=r(t.animations),g=r(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}de.DEFAULT_UP=new X(0,1,0);de.DEFAULT_MATRIX_AUTO_UPDATE=!0;de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ye=new X,_n=new X,Ja=new X,xn=new X,yi=new X,Si=new X,Ic=new X,Qa=new X,tr=new X,er=new X,nr=new le,ir=new le,sr=new le;class ze{constructor(t=new X,e=new X,n=new X){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ye.subVectors(t,e),s.cross(Ye);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){Ye.subVectors(s,e),_n.subVectors(n,e),Ja.subVectors(t,e);const r=Ye.dot(Ye),o=Ye.dot(_n),c=Ye.dot(Ja),l=_n.dot(_n),h=_n.dot(Ja),u=r*l-o*o;if(u===0)return a.set(0,0,0),null;const f=1/u,d=(l*c-o*h)*f,g=(r*h-o*c)*f;return a.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,xn)===null?!1:xn.x>=0&&xn.y>=0&&xn.x+xn.y<=1}static getInterpolation(t,e,n,s,a,r,o,c){return this.getBarycoord(t,e,n,s,xn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,xn.x),c.addScaledVector(r,xn.y),c.addScaledVector(o,xn.z),c)}static getInterpolatedAttribute(t,e,n,s,a,r){return nr.setScalar(0),ir.setScalar(0),sr.setScalar(0),nr.fromBufferAttribute(t,e),ir.fromBufferAttribute(t,n),sr.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(nr,a.x),r.addScaledVector(ir,a.y),r.addScaledVector(sr,a.z),r}static isFrontFacing(t,e,n,s){return Ye.subVectors(n,e),_n.subVectors(t,e),Ye.cross(_n).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ye.subVectors(this.c,this.b),_n.subVectors(this.a,this.b),Ye.cross(_n).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ze.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ze.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,a){return ze.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return ze.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ze.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,a=this.c;let r,o;yi.subVectors(s,n),Si.subVectors(a,n),Qa.subVectors(t,n);const c=yi.dot(Qa),l=Si.dot(Qa);if(c<=0&&l<=0)return e.copy(n);tr.subVectors(t,s);const h=yi.dot(tr),u=Si.dot(tr);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(yi,r);er.subVectors(t,a);const d=yi.dot(er),g=Si.dot(er);if(g>=0&&d<=g)return e.copy(a);const _=d*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(Si,o);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Ic.subVectors(a,s),o=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(Ic,o);const p=1/(m+_+f);return r=_*p,o=f*p,e.copy(n).addScaledVector(yi,r).addScaledVector(Si,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ql={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},In={h:0,s:0,l:0},Ps={h:0,s:0,l:0};function ar(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,jt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=jt.workingColorSpace){return this.r=t,this.g=e,this.b=n,jt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=jt.workingColorSpace){if(t=rf(t,1),e=Pe(e,0,1),n=Pe(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=ar(r,a,t+1/3),this.g=ar(r,a,t),this.b=ar(r,a,t-1/3)}return jt.toWorkingColorSpace(this,s),this}setStyle(t,e=Be){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=Ql[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=En(t.r),this.g=En(t.g),this.b=En(t.b),this}copyLinearToSRGB(t){return this.r=ki(t.r),this.g=ki(t.g),this.b=ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return jt.fromWorkingColorSpace(Se.copy(this),t),Math.round(Pe(Se.r*255,0,255))*65536+Math.round(Pe(Se.g*255,0,255))*256+Math.round(Pe(Se.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=jt.workingColorSpace){jt.fromWorkingColorSpace(Se.copy(this),e);const n=Se.r,s=Se.g,a=Se.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const u=r-o;switch(l=h<=.5?u/(r+o):u/(2-r-o),r){case n:c=(s-a)/u+(s<a?6:0);break;case s:c=(a-n)/u+2;break;case a:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=jt.workingColorSpace){return jt.fromWorkingColorSpace(Se.copy(this),e),t.r=Se.r,t.g=Se.g,t.b=Se.b,t}getStyle(t=Be){jt.fromWorkingColorSpace(Se.copy(this),t);const e=Se.r,n=Se.g,s=Se.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(In),this.setHSL(In.h+t,In.s+e,In.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(In),t.getHSL(Ps);const n=Ga(In.h,Ps.h,e),s=Ga(In.s,Ps.s,e),a=Ga(In.l,Ps.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Se=new Bt;Bt.NAMES=Ql;let bf=0;class ri extends Vi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bf++}),this.uuid=On(),this.name="",this.blending=Ii,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=kr,this.blendDst=Fr,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=Fi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_c,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fi,this.stencilZFail=fi,this.stencilZPass=fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ii&&(n.blending=this.blending),this.side!==Bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==kr&&(n.blendSrc=this.blendSrc),this.blendDst!==Fr&&(n.blendDst=this.blendDst),this.blendEquation!==Qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Fi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_c&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==fi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==fi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class nn extends ri{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=ko,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const me=new X,Ls=new Ht;class je{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=yo,this.updateRanges=[],this.gpuType=Sn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ls.fromBufferAttribute(this,e),Ls.applyMatrix3(t),this.setXY(e,Ls.x,Ls.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=an(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=an(e,this.array)),e}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=an(e,this.array)),e}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=an(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=an(e,this.array)),e}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),a=ie(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==yo&&(t.usage=this.usage),t}}class td extends je{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ed extends je{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends je{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Ef=0;const Oe=new oe,rr=new de,bi=new X,Ne=new hs,ji=new hs,ve=new X;class De extends Vi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=On(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(jl(t)?ed:td)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Gt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Oe.makeRotationFromQuaternion(t),this.applyMatrix4(Oe),this}rotateX(t){return Oe.makeRotationX(t),this.applyMatrix4(Oe),this}rotateY(t){return Oe.makeRotationY(t),this.applyMatrix4(Oe),this}rotateZ(t){return Oe.makeRotationZ(t),this.applyMatrix4(Oe),this}translate(t,e,n){return Oe.makeTranslation(t,e,n),this.applyMatrix4(Oe),this}scale(t,e,n){return Oe.makeScale(t,e,n),this.applyMatrix4(Oe),this}lookAt(t){return rr.lookAt(t),rr.updateMatrix(),this.applyMatrix4(rr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new he(n,3))}else{for(let n=0,s=e.count;n<s;n++){const a=t[n];e.setXYZ(n,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const a=e[n];Ne.setFromBufferAttribute(a),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,Ne.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,Ne.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(Ne.min),this.boundingBox.expandByPoint(Ne.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Aa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(t){const n=this.boundingSphere.center;if(Ne.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];ji.setFromBufferAttribute(o),this.morphTargetsRelative?(ve.addVectors(Ne.min,ji.min),Ne.expandByPoint(ve),ve.addVectors(Ne.max,ji.max),Ne.expandByPoint(ve)):(Ne.expandByPoint(ji.min),Ne.expandByPoint(ji.max))}Ne.getCenter(n);let s=0;for(let a=0,r=t.count;a<r;a++)ve.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(ve));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)ve.fromBufferAttribute(o,l),c&&(bi.fromBufferAttribute(t,l),ve.add(bi)),s=Math.max(s,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new je(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let L=0;L<n.count;L++)o[L]=new X,c[L]=new X;const l=new X,h=new X,u=new X,f=new Ht,d=new Ht,g=new Ht,_=new X,m=new X;function p(L,b,y){l.fromBufferAttribute(n,L),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,y),f.fromBufferAttribute(a,L),d.fromBufferAttribute(a,b),g.fromBufferAttribute(a,y),h.sub(l),u.sub(l),d.sub(f),g.sub(f);const w=1/(d.x*g.y-g.x*d.y);isFinite(w)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(w),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(w),o[L].add(_),o[b].add(_),o[y].add(_),c[L].add(m),c[b].add(m),c[y].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let L=0,b=x.length;L<b;++L){const y=x[L],w=y.start,C=y.count;for(let D=w,z=w+C;D<z;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const S=new X,M=new X,I=new X,P=new X;function R(L){I.fromBufferAttribute(s,L),P.copy(I);const b=o[L];S.copy(b),S.sub(I.multiplyScalar(I.dot(b))).normalize(),M.crossVectors(P,b);const w=M.dot(c[L])<0?-1:1;r.setXYZW(L,S.x,S.y,S.z,w)}for(let L=0,b=x.length;L<b;++L){const y=x[L],w=y.start,C=y.count;for(let D=w,z=w+C;D<z;D+=3)R(t.getX(D+0)),R(t.getX(D+1)),R(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new je(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new X,a=new X,r=new X,o=new X,c=new X,l=new X,h=new X,u=new X;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,m),h.subVectors(r,a),u.subVectors(s,a),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),a.fromBufferAttribute(e,f+1),r.fromBufferAttribute(e,f+2),h.subVectors(r,a),u.subVectors(s,a),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,f=new l.constructor(c.length*h);let d=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*h;for(let p=0;p<h;p++)f[g++]=l[d++]}return new je(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new De,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const a=t.morphAttributes;for(const l in a){const h=[],u=a[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Uc=new oe,$n=new Go,Ds=new Aa,kc=new X,Is=new X,Us=new X,ks=new X,or=new X,Fs=new X,Fc=new X,Ns=new X;class re extends de{constructor(t=new De,e=new nn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){Fs.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],u=a[c];h!==0&&(or.fromBufferAttribute(u,t),r?Fs.addScaledVector(or,h):Fs.addScaledVector(or.sub(e),h))}e.add(Fs)}return e}raycast(t,e){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ds.copy(n.boundingSphere),Ds.applyMatrix4(a),$n.copy(t.ray).recast(t.near),!(Ds.containsPoint($n.origin)===!1&&($n.intersectSphere(Ds,kc)===null||$n.origin.distanceToSquared(kc)>(t.far-t.near)**2))&&(Uc.copy(a).invert(),$n.copy(t.ray).applyMatrix4(Uc),!(n.boundingBox!==null&&$n.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,$n)))}_computeIntersections(t,e,n){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,u=a.attributes.normal,f=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=r[m.materialIndex],x=Math.max(m.start,d.start),S=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let M=x,I=S;M<I;M+=3){const P=o.getX(M),R=o.getX(M+1),L=o.getX(M+2);s=zs(this,p,t,n,l,h,u,P,R,L),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const x=o.getX(m),S=o.getX(m+1),M=o.getX(m+2);s=zs(this,r,t,n,l,h,u,x,S,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,_=f.length;g<_;g++){const m=f[g],p=r[m.materialIndex],x=Math.max(m.start,d.start),S=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let M=x,I=S;M<I;M+=3){const P=M,R=M+1,L=M+2;s=zs(this,p,t,n,l,h,u,P,R,L),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const x=m,S=m+1,M=m+2;s=zs(this,r,t,n,l,h,u,x,S,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Af(i,t,e,n,s,a,r,o){let c;if(t.side===Le?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,t.side===Bn,o),c===null)return null;Ns.copy(o),Ns.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ns);return l<e.near||l>e.far?null:{distance:l,point:Ns.clone(),object:i}}function zs(i,t,e,n,s,a,r,o,c,l){i.getVertexPosition(o,Is),i.getVertexPosition(c,Us),i.getVertexPosition(l,ks);const h=Af(i,t,e,n,Is,Us,ks,Fc);if(h){const u=new X;ze.getBarycoord(Fc,Is,Us,ks,u),s&&(h.uv=ze.getInterpolatedAttribute(s,o,c,l,u,new Ht)),a&&(h.uv1=ze.getInterpolatedAttribute(a,o,c,l,u,new Ht)),r&&(h.normal=ze.getInterpolatedAttribute(r,o,c,l,u,new X),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new X,materialIndex:0};ze.getNormal(Is,Us,ks,f.normal),h.face=f,h.barycoord=u}return h}class dn extends De{constructor(t=1,e=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,n,e,t,r,a,0),g("z","y","x",1,-1,n,e,-t,r,a,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,a,4),g("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new he(l,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(u,2));function g(_,m,p,x,S,M,I,P,R,L,b){const y=M/R,w=I/L,C=M/2,D=I/2,z=P/2,G=R+1,k=L+1;let B=0,Y=0;const et=new X;for(let Q=0;Q<k;Q++){const lt=Q*w-D;for(let St=0;St<G;St++){const xt=St*y-C;et[_]=xt*x,et[m]=lt*S,et[p]=z,l.push(et.x,et.y,et.z),et[_]=0,et[m]=0,et[p]=P>0?1:-1,h.push(et.x,et.y,et.z),u.push(St/R),u.push(1-Q/L),B+=1}}for(let Q=0;Q<L;Q++)for(let lt=0;lt<R;lt++){const St=f+lt+G*Q,xt=f+lt+G*(Q+1),Z=f+(lt+1)+G*(Q+1),at=f+(lt+1)+G*Q;c.push(St,xt,at),c.push(xt,Z,at),Y+=6}o.addGroup(d,Y,b),d+=Y,f+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Hi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ae(i){const t={};for(let e=0;e<i.length;e++){const n=Hi(i[e]);for(const s in n)t[s]=n[s]}return t}function Tf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function nd(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:jt.workingColorSpace}const wf={clone:Hi,merge:Ae};var Rf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Hn extends ri{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rf,this.fragmentShader=Cf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Hi(t.uniforms),this.uniformsGroups=Tf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class id extends de{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=bn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Un=new X,Nc=new Ht,zc=new Ht;class He extends id{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=So*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(sa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return So*2*Math.atan(Math.tan(sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Un.x,Un.y).multiplyScalar(-t/Un.z),Un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Un.x,Un.y).multiplyScalar(-t/Un.z)}getViewSize(t,e){return this.getViewBounds(t,Nc,zc),e.subVectors(zc,Nc)}setViewOffset(t,e,n,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(sa*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ei=-90,Ai=1;class Pf extends de{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new He(Ei,Ai,t,e);s.layers=this.layers,this.add(s);const a=new He(Ei,Ai,t,e);a.layers=this.layers,this.add(a);const r=new He(Ei,Ai,t,e);r.layers=this.layers,this.add(r);const o=new He(Ei,Ai,t,e);o.layers=this.layers,this.add(o);const c=new He(Ei,Ai,t,e);c.layers=this.layers,this.add(c);const l=new He(Ei,Ai,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ga)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,a),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class sd extends Re{constructor(t,e,n,s,a,r,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Ni,super(t,e,n,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Lf extends ai{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new sd(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:rn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new dn(5,5,5),a=new Hn({name:"CubemapFromEquirect",uniforms:Hi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Le,blending:Nn});a.uniforms.tEquirect.value=e;const r=new re(s,a),o=e.minFilter;return e.minFilter===ni&&(e.minFilter=rn),new Pf(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(a)}}const cr=new X,Df=new X,If=new Gt;class Kn{constructor(t=new X(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=cr.subVectors(n,e).cross(Df.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(cr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||If.getNormalMatrix(t),s=this.coplanarPoint(cr).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Yn=new Aa,Os=new X;class Wo{constructor(t=new Kn,e=new Kn,n=new Kn,s=new Kn,a=new Kn,r=new Kn){this.planes=[t,e,n,s,a,r]}set(t,e,n,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=bn){const n=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],d=s[8],g=s[9],_=s[10],m=s[11],p=s[12],x=s[13],S=s[14],M=s[15];if(n[0].setComponents(c-a,f-l,m-d,M-p).normalize(),n[1].setComponents(c+a,f+l,m+d,M+p).normalize(),n[2].setComponents(c+r,f+h,m+g,M+x).normalize(),n[3].setComponents(c-r,f-h,m-g,M-x).normalize(),n[4].setComponents(c-o,f-u,m-_,M-S).normalize(),e===bn)n[5].setComponents(c+o,f+u,m+_,M+S).normalize();else if(e===ga)n[5].setComponents(o,u,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Yn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Yn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Yn)}intersectsSprite(t){return Yn.center.set(0,0,0),Yn.radius=.7071067811865476,Yn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Yn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Os.x=s.normal.x>0?t.max.x:t.min.x,Os.y=s.normal.y>0?t.max.y:t.min.y,Os.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Os)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ad(){let i=null,t=!1,e=null,n=null;function s(a,r){e(a,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function Uf(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],_=u[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const _=u[d];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class Ta extends De{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=t/o,f=e/c,d=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const x=p*f-r;for(let S=0;S<l;S++){const M=S*u-a;g.push(M,-x,0),_.push(0,0,1),m.push(S/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<o;x++){const S=x+l*p,M=x+l*(p+1),I=x+1+l*(p+1),P=x+1+l*p;d.push(S,M,P),d.push(M,I,P)}this.setIndex(d),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(_,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ta(t.width,t.height,t.widthSegments,t.heightSegments)}}var kf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ff=`#ifdef USE_ALPHAHASH
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
#endif`,Nf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Of=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hf=`#ifdef USE_AOMAP
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
#endif`,Gf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vf=`#ifdef USE_BATCHING
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
#endif`,Wf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Xf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$f=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Zf=`#ifdef USE_IRIDESCENCE
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
#endif`,qf=`#ifdef USE_BUMPMAP
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
#endif`,jf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Kf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ep=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,np=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ip=`#if defined( USE_COLOR_ALPHA )
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
#endif`,sp=`#define PI 3.141592653589793
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
} // validated`,ap=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,rp=`vec3 transformedNormal = objectNormal;
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
#endif`,op=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hp="gl_FragColor = linearToOutputTexel( gl_FragColor );",up=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,fp=`#ifdef USE_ENVMAP
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
#endif`,pp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mp=`#ifdef USE_ENVMAP
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
#endif`,gp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_p=`#ifdef USE_ENVMAP
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
#endif`,xp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,yp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sp=`#ifdef USE_GRADIENTMAP
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
}`,bp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ep=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ap=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tp=`uniform bool receiveShadow;
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
#endif`,wp=`#ifdef USE_ENVMAP
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
#endif`,Rp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Lp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Dp=`PhysicalMaterial material;
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
#endif`,Ip=`struct PhysicalMaterial {
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
}`,Up=`
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
#endif`,kp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Fp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Np=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Op=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Wp=`#if defined( USE_POINTS_UV )
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
#endif`,Xp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$p=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Yp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Zp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jp=`#ifdef USE_MORPHTARGETS
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
#endif`,Kp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,tm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,em=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,nm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,im=`#ifdef USE_NORMALMAP
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
#endif`,sm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,am=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,om=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,cm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,lm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,dm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,um=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,fm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,pm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,mm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,gm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_m=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,vm=`float getShadowMask() {
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
}`,Mm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ym=`#ifdef USE_SKINNING
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
#endif`,Sm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bm=`#ifdef USE_SKINNING
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
#endif`,Em=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Am=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Tm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Rm=`#ifdef USE_TRANSMISSION
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
#endif`,Cm=`#ifdef USE_TRANSMISSION
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
#endif`,Pm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Im=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Um=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,km=`uniform sampler2D t2D;
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
}`,Fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,zm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Om=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bm=`#include <common>
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
}`,Hm=`#if DEPTH_PACKING == 3200
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
}`,Gm=`#define DISTANCE
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
}`,Vm=`#define DISTANCE
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
}`,Wm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Xm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$m=`uniform float scale;
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
}`,Ym=`uniform vec3 diffuse;
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
}`,Zm=`#include <common>
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
}`,qm=`uniform vec3 diffuse;
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
}`,jm=`#define LAMBERT
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
}`,Km=`#define LAMBERT
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
}`,Jm=`#define MATCAP
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
}`,Qm=`#define MATCAP
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
}`,tg=`#define NORMAL
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
}`,eg=`#define NORMAL
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
}`,ng=`#define PHONG
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
}`,ig=`#define PHONG
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
}`,sg=`#define STANDARD
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
}`,ag=`#define STANDARD
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
}`,rg=`#define TOON
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
}`,og=`#define TOON
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
}`,cg=`uniform float size;
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
}`,lg=`uniform vec3 diffuse;
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
}`,dg=`#include <common>
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
}`,hg=`uniform vec3 color;
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
}`,ug=`uniform float rotation;
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
}`,fg=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:kf,alphahash_pars_fragment:Ff,alphamap_fragment:Nf,alphamap_pars_fragment:zf,alphatest_fragment:Of,alphatest_pars_fragment:Bf,aomap_fragment:Hf,aomap_pars_fragment:Gf,batching_pars_vertex:Vf,batching_vertex:Wf,begin_vertex:Xf,beginnormal_vertex:$f,bsdfs:Yf,iridescence_fragment:Zf,bumpmap_pars_fragment:qf,clipping_planes_fragment:jf,clipping_planes_pars_fragment:Kf,clipping_planes_pars_vertex:Jf,clipping_planes_vertex:Qf,color_fragment:tp,color_pars_fragment:ep,color_pars_vertex:np,color_vertex:ip,common:sp,cube_uv_reflection_fragment:ap,defaultnormal_vertex:rp,displacementmap_pars_vertex:op,displacementmap_vertex:cp,emissivemap_fragment:lp,emissivemap_pars_fragment:dp,colorspace_fragment:hp,colorspace_pars_fragment:up,envmap_fragment:fp,envmap_common_pars_fragment:pp,envmap_pars_fragment:mp,envmap_pars_vertex:gp,envmap_physical_pars_fragment:wp,envmap_vertex:_p,fog_vertex:xp,fog_pars_vertex:vp,fog_fragment:Mp,fog_pars_fragment:yp,gradientmap_pars_fragment:Sp,lightmap_pars_fragment:bp,lights_lambert_fragment:Ep,lights_lambert_pars_fragment:Ap,lights_pars_begin:Tp,lights_toon_fragment:Rp,lights_toon_pars_fragment:Cp,lights_phong_fragment:Pp,lights_phong_pars_fragment:Lp,lights_physical_fragment:Dp,lights_physical_pars_fragment:Ip,lights_fragment_begin:Up,lights_fragment_maps:kp,lights_fragment_end:Fp,logdepthbuf_fragment:Np,logdepthbuf_pars_fragment:zp,logdepthbuf_pars_vertex:Op,logdepthbuf_vertex:Bp,map_fragment:Hp,map_pars_fragment:Gp,map_particle_fragment:Vp,map_particle_pars_fragment:Wp,metalnessmap_fragment:Xp,metalnessmap_pars_fragment:$p,morphinstance_vertex:Yp,morphcolor_vertex:Zp,morphnormal_vertex:qp,morphtarget_pars_vertex:jp,morphtarget_vertex:Kp,normal_fragment_begin:Jp,normal_fragment_maps:Qp,normal_pars_fragment:tm,normal_pars_vertex:em,normal_vertex:nm,normalmap_pars_fragment:im,clearcoat_normal_fragment_begin:sm,clearcoat_normal_fragment_maps:am,clearcoat_pars_fragment:rm,iridescence_pars_fragment:om,opaque_fragment:cm,packing:lm,premultiplied_alpha_fragment:dm,project_vertex:hm,dithering_fragment:um,dithering_pars_fragment:fm,roughnessmap_fragment:pm,roughnessmap_pars_fragment:mm,shadowmap_pars_fragment:gm,shadowmap_pars_vertex:_m,shadowmap_vertex:xm,shadowmask_pars_fragment:vm,skinbase_vertex:Mm,skinning_pars_vertex:ym,skinning_vertex:Sm,skinnormal_vertex:bm,specularmap_fragment:Em,specularmap_pars_fragment:Am,tonemapping_fragment:Tm,tonemapping_pars_fragment:wm,transmission_fragment:Rm,transmission_pars_fragment:Cm,uv_pars_fragment:Pm,uv_pars_vertex:Lm,uv_vertex:Dm,worldpos_vertex:Im,background_vert:Um,background_frag:km,backgroundCube_vert:Fm,backgroundCube_frag:Nm,cube_vert:zm,cube_frag:Om,depth_vert:Bm,depth_frag:Hm,distanceRGBA_vert:Gm,distanceRGBA_frag:Vm,equirect_vert:Wm,equirect_frag:Xm,linedashed_vert:$m,linedashed_frag:Ym,meshbasic_vert:Zm,meshbasic_frag:qm,meshlambert_vert:jm,meshlambert_frag:Km,meshmatcap_vert:Jm,meshmatcap_frag:Qm,meshnormal_vert:tg,meshnormal_frag:eg,meshphong_vert:ng,meshphong_frag:ig,meshphysical_vert:sg,meshphysical_frag:ag,meshtoon_vert:rg,meshtoon_frag:og,points_vert:cg,points_frag:lg,shadow_vert:dg,shadow_frag:hg,sprite_vert:ug,sprite_frag:fg},yt={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Gt}},envmap:{envMap:{value:null},envMapRotation:{value:new Gt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Gt},normalScale:{value:new Ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0},uvTransform:{value:new Gt}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new Ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Gt},alphaMap:{value:null},alphaMapTransform:{value:new Gt},alphaTest:{value:0}}},sn={basic:{uniforms:Ae([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ae([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ae([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ae([yt.common,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.roughnessmap,yt.metalnessmap,yt.fog,yt.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ae([yt.common,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.gradientmap,yt.fog,yt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ae([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ae([yt.points,yt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ae([yt.common,yt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ae([yt.common,yt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ae([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ae([yt.sprite,yt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Gt}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ae([yt.common,yt.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ae([yt.lights,yt.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};sn.physical={uniforms:Ae([sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Gt},clearcoatNormalScale:{value:new Ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Gt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Gt},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Gt},transmissionSamplerSize:{value:new Ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Gt},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Gt},anisotropyVector:{value:new Ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Gt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const Bs={r:0,b:0,g:0},Zn=new ln,pg=new oe;function mg(i,t,e,n,s,a,r){const o=new Bt(0);let c=a===!0?0:1,l,h,u=null,f=0,d=null;function g(x){let S=x.isScene===!0?x.background:null;return S&&S.isTexture&&(S=(x.backgroundBlurriness>0?e:t).get(S)),S}function _(x){let S=!1;const M=g(x);M===null?p(o,c):M&&M.isColor&&(p(M,1),S=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,r):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,S){const M=g(S);M&&(M.isCubeTexture||M.mapping===ba)?(h===void 0&&(h=new re(new dn(1,1,1),new Hn({name:"BackgroundCubeMaterial",uniforms:Hi(sn.backgroundCube.uniforms),vertexShader:sn.backgroundCube.vertexShader,fragmentShader:sn.backgroundCube.fragmentShader,side:Le,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,P,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Zn.copy(S.backgroundRotation),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(pg.makeRotationFromEuler(Zn)),h.material.toneMapped=jt.getTransfer(M.colorSpace)!==ne,(u!==M||f!==M.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=M,f=M.version,d=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new re(new Ta(2,2),new Hn({name:"BackgroundMaterial",uniforms:Hi(sn.background.uniforms),vertexShader:sn.background.vertexShader,fragmentShader:sn.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=jt.getTransfer(M.colorSpace)!==ne,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,S){x.getRGB(Bs,nd(i)),n.buffers.color.setClear(Bs.r,Bs.g,Bs.b,S,r)}return{getClearColor:function(){return o},setClearColor:function(x,S=1){o.set(x),c=S,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(o,c)},render:_,addToRenderList:m}}function gg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let a=s,r=!1;function o(y,w,C,D,z){let G=!1;const k=u(D,C,w);a!==k&&(a=k,l(a.object)),G=d(y,D,C,z),G&&g(y,D,C,z),z!==null&&t.update(z,i.ELEMENT_ARRAY_BUFFER),(G||r)&&(r=!1,M(y,w,C,D),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function u(y,w,C){const D=C.wireframe===!0;let z=n[y.id];z===void 0&&(z={},n[y.id]=z);let G=z[w.id];G===void 0&&(G={},z[w.id]=G);let k=G[D];return k===void 0&&(k=f(c()),G[D]=k),k}function f(y){const w=[],C=[],D=[];for(let z=0;z<e;z++)w[z]=0,C[z]=0,D[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:C,attributeDivisors:D,object:y,attributes:{},index:null}}function d(y,w,C,D){const z=a.attributes,G=w.attributes;let k=0;const B=C.getAttributes();for(const Y in B)if(B[Y].location>=0){const Q=z[Y];let lt=G[Y];if(lt===void 0&&(Y==="instanceMatrix"&&y.instanceMatrix&&(lt=y.instanceMatrix),Y==="instanceColor"&&y.instanceColor&&(lt=y.instanceColor)),Q===void 0||Q.attribute!==lt||lt&&Q.data!==lt.data)return!0;k++}return a.attributesNum!==k||a.index!==D}function g(y,w,C,D){const z={},G=w.attributes;let k=0;const B=C.getAttributes();for(const Y in B)if(B[Y].location>=0){let Q=G[Y];Q===void 0&&(Y==="instanceMatrix"&&y.instanceMatrix&&(Q=y.instanceMatrix),Y==="instanceColor"&&y.instanceColor&&(Q=y.instanceColor));const lt={};lt.attribute=Q,Q&&Q.data&&(lt.data=Q.data),z[Y]=lt,k++}a.attributes=z,a.attributesNum=k,a.index=D}function _(){const y=a.newAttributes;for(let w=0,C=y.length;w<C;w++)y[w]=0}function m(y){p(y,0)}function p(y,w){const C=a.newAttributes,D=a.enabledAttributes,z=a.attributeDivisors;C[y]=1,D[y]===0&&(i.enableVertexAttribArray(y),D[y]=1),z[y]!==w&&(i.vertexAttribDivisor(y,w),z[y]=w)}function x(){const y=a.newAttributes,w=a.enabledAttributes;for(let C=0,D=w.length;C<D;C++)w[C]!==y[C]&&(i.disableVertexAttribArray(C),w[C]=0)}function S(y,w,C,D,z,G,k){k===!0?i.vertexAttribIPointer(y,w,C,z,G):i.vertexAttribPointer(y,w,C,D,z,G)}function M(y,w,C,D){_();const z=D.attributes,G=C.getAttributes(),k=w.defaultAttributeValues;for(const B in G){const Y=G[B];if(Y.location>=0){let et=z[B];if(et===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&(et=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&(et=y.instanceColor)),et!==void 0){const Q=et.normalized,lt=et.itemSize,St=t.get(et);if(St===void 0)continue;const xt=St.buffer,Z=St.type,at=St.bytesPerElement,pt=Z===i.INT||Z===i.UNSIGNED_INT||et.gpuType===Fo;if(et.isInterleavedBufferAttribute){const ut=et.data,ft=ut.stride,Rt=et.offset;if(ut.isInstancedInterleavedBuffer){for(let Dt=0;Dt<Y.locationSize;Dt++)p(Y.location+Dt,ut.meshPerAttribute);y.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let Dt=0;Dt<Y.locationSize;Dt++)m(Y.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,xt);for(let Dt=0;Dt<Y.locationSize;Dt++)S(Y.location+Dt,lt/Y.locationSize,Z,Q,ft*at,(Rt+lt/Y.locationSize*Dt)*at,pt)}else{if(et.isInstancedBufferAttribute){for(let ut=0;ut<Y.locationSize;ut++)p(Y.location+ut,et.meshPerAttribute);y.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let ut=0;ut<Y.locationSize;ut++)m(Y.location+ut);i.bindBuffer(i.ARRAY_BUFFER,xt);for(let ut=0;ut<Y.locationSize;ut++)S(Y.location+ut,lt/Y.locationSize,Z,Q,lt*at,lt/Y.locationSize*ut*at,pt)}}else if(k!==void 0){const Q=k[B];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(Y.location,Q);break;case 3:i.vertexAttrib3fv(Y.location,Q);break;case 4:i.vertexAttrib4fv(Y.location,Q);break;default:i.vertexAttrib1fv(Y.location,Q)}}}}x()}function I(){L();for(const y in n){const w=n[y];for(const C in w){const D=w[C];for(const z in D)h(D[z].object),delete D[z];delete w[C]}delete n[y]}}function P(y){if(n[y.id]===void 0)return;const w=n[y.id];for(const C in w){const D=w[C];for(const z in D)h(D[z].object),delete D[z];delete w[C]}delete n[y.id]}function R(y){for(const w in n){const C=n[w];if(C[y.id]===void 0)continue;const D=C[y.id];for(const z in D)h(D[z].object),delete D[z];delete C[y.id]}}function L(){b(),r=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:b,dispose:I,releaseStatesOfGeometry:P,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function _g(i,t,e){let n;function s(l){n=l}function a(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function o(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];e.update(d,n,1)}function c(l,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)r(l[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*f[_];e.update(g,n,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function xg(i,t,e,n){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(R){return!(R!==Ze&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const L=R===ls&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==An&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Sn&&!L)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,P=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:M,vertexTextures:I,maxSamples:P}}function vg(i){const t=this;let e=null,n=0,s=!1,a=!1;const r=new Kn,o=new Gt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||a&&!m)a?h(null):l();else{const x=a?0:n,S=x*4;let M=p.clippingState||null;c.value=M,M=h(g,f,S,d);for(let I=0;I!==S;++I)M[I]=e[I];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=d+_*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,M=d;S!==_;++S,M+=4)r.copy(u[S]).applyMatrix4(x,o),r.normal.toArray(m,M),m[M+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Mg(i){let t=new WeakMap;function e(r,o){return o===Wr?r.mapping=Ni:o===Xr&&(r.mapping=zi),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===Wr||o===Xr)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new Lf(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class rd extends id{constructor(t=-1,e=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Li=4,Oc=[.125,.215,.35,.446,.526,.582],ti=20,lr=new rd,Bc=new Bt;let dr=null,hr=0,ur=0,fr=!1;const Jn=(1+Math.sqrt(5))/2,Ti=1/Jn,Hc=[new X(-Jn,Ti,0),new X(Jn,Ti,0),new X(-Ti,0,Jn),new X(Ti,0,Jn),new X(0,Jn,-Ti),new X(0,Jn,Ti),new X(-1,1,-1),new X(1,1,-1),new X(-1,1,1),new X(1,1,1)];class Gc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){dr=this._renderer.getRenderTarget(),hr=this._renderer.getActiveCubeFace(),ur=this._renderer.getActiveMipmapLevel(),fr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(dr,hr,ur),this._renderer.xr.enabled=fr,t.scissorTest=!1,Hs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ni||t.mapping===zi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),dr=this._renderer.getRenderTarget(),hr=this._renderer.getActiveCubeFace(),ur=this._renderer.getActiveMipmapLevel(),fr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:ls,format:Ze,colorSpace:Gi,depthBuffer:!1},s=Vc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vc(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=yg(a)),this._blurMaterial=Sg(a,t,e)}return s}_compileMaterial(t){const e=new re(this._lodPlanes[0],t);this._renderer.compile(e,lr)}_sceneToCubeUV(t,e,n,s){const o=new He(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Bc),h.toneMapping=zn,h.autoClear=!1;const d=new nn({name:"PMREM.Background",side:Le,depthWrite:!1,depthTest:!1}),g=new re(new dn,d);let _=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,_=!0):(d.color.copy(Bc),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):x===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const S=this._cubeSize;Hs(s,x*S,p>2?S:0,S,S),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ni||t.mapping===zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wc());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new re(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;Hs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,lr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Hc[(s-a-1)%Hc.length];this._blur(t,a-1,a,r,o)}e.autoClear=n}_blur(t,e,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",a),this._halfBlur(r,t,n,n,s,"longitudinal",a)}_halfBlur(t,e,n,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new re(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*d):2*Math.PI/(2*ti-1),_=a/g,m=isFinite(a)?1+Math.floor(h*_):ti;m>ti&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ti}`);const p=[];let x=0;for(let R=0;R<ti;++R){const L=R/_,b=Math.exp(-L*L/2);p.push(b),R===0?x+=b:R<m&&(x+=2*b)}for(let R=0;R<p.length;R++)p[R]=p[R]/x;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=r==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=g,f.mipInt.value=S-n;const M=this._sizeLods[s],I=3*M*(s>S-Li?s-S+Li:0),P=4*(this._cubeSize-M);Hs(e,I,P,3*M,2*M),c.setRenderTarget(e),c.render(u,lr)}}function yg(i){const t=[],e=[],n=[];let s=i;const a=i-Li+1+Oc.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>i-Li?c=Oc[r-i+Li-1]:r===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*d),S=new Float32Array(m*g*d),M=new Float32Array(p*g*d);for(let P=0;P<d;P++){const R=P%3*2/3-1,L=P>2?0:-1,b=[R,L,0,R+2/3,L,0,R+2/3,L+1,0,R,L,0,R+2/3,L+1,0,R,L+1,0];x.set(b,_*g*P),S.set(f,m*g*P);const y=[P,P,P,P,P,P];M.set(y,p*g*P)}const I=new De;I.setAttribute("position",new je(x,_)),I.setAttribute("uv",new je(S,m)),I.setAttribute("faceIndex",new je(M,p)),t.push(I),s>Li&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Vc(i,t,e){const n=new ai(i,t,e);return n.texture.mapping=ba,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Hs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Sg(i,t,e){const n=new Float32Array(ti),s=new X(0,1,0);return new Hn({name:"SphericalGaussianBlur",defines:{n:ti,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Xo(),fragmentShader:`

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
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Wc(){return new Hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xo(),fragmentShader:`

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
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Xc(){return new Hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Xo(){return`

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
	`}function bg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Wr||c===Xr,h=c===Ni||c===zi;if(l||h){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new Gc(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new Gc(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function Eg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&ns("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Ag(i,t,e,n){const s={},a=new WeakMap;function r(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}f.removeEventListener("dispose",r),delete s[f.id];const d=a.get(f);d&&(t.remove(d),a.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",r),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const g in f)t.update(f[g],i.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const _=d[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,g=u.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let S=0,M=x.length;S<M;S+=3){const I=x[S+0],P=x[S+1],R=x[S+2];f.push(I,P,P,R,R,I)}}else if(g!==void 0){const x=g.array;_=g.version;for(let S=0,M=x.length/3-1;S<M;S+=3){const I=S+0,P=S+1,R=S+2;f.push(I,P,P,R,R,I)}}else return;const m=new(jl(f)?ed:td)(f,1);m.version=_;const p=a.get(u);p&&t.remove(p),a.set(u,m)}function h(u){const f=a.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return a.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Tg(i,t,e){let n;function s(f){n=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function c(f,d){i.drawElements(n,d,a,f*r),e.update(d,n,1)}function l(f,d,g){g!==0&&(i.drawElementsInstanced(n,d,a,f*r,g),e.update(d,n,g))}function h(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,a,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,n,1)}function u(f,d,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/r,d[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,a,f,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=d[x]*_[x];e.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function wg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Rg(i,t,e){const n=new WeakMap,s=new le;function a(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let y=function(){L.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var d=y;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let I=o.attributes.position.count*M,P=1;I>t.maxTextureSize&&(P=Math.ceil(I/t.maxTextureSize),I=t.maxTextureSize);const R=new Float32Array(I*P*4*u),L=new Jl(R,I,P,u);L.type=Sn,L.needsUpdate=!0;const b=M*4;for(let w=0;w<u;w++){const C=p[w],D=x[w],z=S[w],G=I*P*4*w;for(let k=0;k<C.count;k++){const B=k*b;g===!0&&(s.fromBufferAttribute(C,k),R[G+B+0]=s.x,R[G+B+1]=s.y,R[G+B+2]=s.z,R[G+B+3]=0),_===!0&&(s.fromBufferAttribute(D,k),R[G+B+4]=s.x,R[G+B+5]=s.y,R[G+B+6]=s.z,R[G+B+7]=0),m===!0&&(s.fromBufferAttribute(z,k),R[G+B+8]=s.x,R[G+B+9]=s.y,R[G+B+10]=s.z,R[G+B+11]=z.itemSize===4?s.w:1)}}f={count:u,texture:L,size:new Ht(I,P)},n.set(o,f),o.addEventListener("dispose",y)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:a}}function Cg(i,t,e,n){let s=new WeakMap;function a(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class od extends Re{constructor(t,e,n,s,a,r,o,c,l,h=Ui){if(h!==Ui&&h!==Bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ui&&(n=si),n===void 0&&h===Bi&&(n=Oi),super(null,s,a,r,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:qe,this.minFilter=c!==void 0?c:qe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const cd=new Re,$c=new od(1,1),ld=new Jl,dd=new mf,hd=new sd,Yc=[],Zc=[],qc=new Float32Array(16),jc=new Float32Array(9),Kc=new Float32Array(4);function Wi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let a=Yc[s];if(a===void 0&&(a=new Float32Array(s),Yc[s]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,i[r].toArray(a,o)}return a}function _e(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function wa(i,t){let e=Zc[t];e===void 0&&(e=new Int32Array(t),Zc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Pg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Lg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2fv(this.addr,t),xe(e,t)}}function Dg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;i.uniform3fv(this.addr,t),xe(e,t)}}function Ig(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4fv(this.addr,t),xe(e,t)}}function Ug(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;Kc.set(n),i.uniformMatrix2fv(this.addr,!1,Kc),xe(e,n)}}function kg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;jc.set(n),i.uniformMatrix3fv(this.addr,!1,jc),xe(e,n)}}function Fg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;qc.set(n),i.uniformMatrix4fv(this.addr,!1,qc),xe(e,n)}}function Ng(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function zg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2iv(this.addr,t),xe(e,t)}}function Og(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3iv(this.addr,t),xe(e,t)}}function Bg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4iv(this.addr,t),xe(e,t)}}function Hg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2uiv(this.addr,t),xe(e,t)}}function Vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3uiv(this.addr,t),xe(e,t)}}function Wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4uiv(this.addr,t),xe(e,t)}}function Xg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?($c.compareFunction=ql,a=$c):a=cd,e.setTexture2D(t||a,s)}function $g(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||dd,s)}function Yg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||hd,s)}function Zg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ld,s)}function qg(i){switch(i){case 5126:return Pg;case 35664:return Lg;case 35665:return Dg;case 35666:return Ig;case 35674:return Ug;case 35675:return kg;case 35676:return Fg;case 5124:case 35670:return Ng;case 35667:case 35671:return zg;case 35668:case 35672:return Og;case 35669:case 35673:return Bg;case 5125:return Hg;case 36294:return Gg;case 36295:return Vg;case 36296:return Wg;case 35678:case 36198:case 36298:case 36306:case 35682:return Xg;case 35679:case 36299:case 36307:return $g;case 35680:case 36300:case 36308:case 36293:return Yg;case 36289:case 36303:case 36311:case 36292:return Zg}}function jg(i,t){i.uniform1fv(this.addr,t)}function Kg(i,t){const e=Wi(t,this.size,2);i.uniform2fv(this.addr,e)}function Jg(i,t){const e=Wi(t,this.size,3);i.uniform3fv(this.addr,e)}function Qg(i,t){const e=Wi(t,this.size,4);i.uniform4fv(this.addr,e)}function t0(i,t){const e=Wi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function e0(i,t){const e=Wi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function n0(i,t){const e=Wi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function i0(i,t){i.uniform1iv(this.addr,t)}function s0(i,t){i.uniform2iv(this.addr,t)}function a0(i,t){i.uniform3iv(this.addr,t)}function r0(i,t){i.uniform4iv(this.addr,t)}function o0(i,t){i.uniform1uiv(this.addr,t)}function c0(i,t){i.uniform2uiv(this.addr,t)}function l0(i,t){i.uniform3uiv(this.addr,t)}function d0(i,t){i.uniform4uiv(this.addr,t)}function h0(i,t,e){const n=this.cache,s=t.length,a=wa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||cd,a[r])}function u0(i,t,e){const n=this.cache,s=t.length,a=wa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||dd,a[r])}function f0(i,t,e){const n=this.cache,s=t.length,a=wa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||hd,a[r])}function p0(i,t,e){const n=this.cache,s=t.length,a=wa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||ld,a[r])}function m0(i){switch(i){case 5126:return jg;case 35664:return Kg;case 35665:return Jg;case 35666:return Qg;case 35674:return t0;case 35675:return e0;case 35676:return n0;case 5124:case 35670:return i0;case 35667:case 35671:return s0;case 35668:case 35672:return a0;case 35669:case 35673:return r0;case 5125:return o0;case 36294:return c0;case 36295:return l0;case 36296:return d0;case 35678:case 36198:case 36298:case 36306:case 35682:return h0;case 35679:case 36299:case 36307:return u0;case 35680:case 36300:case 36308:case 36293:return f0;case 36289:case 36303:case 36311:case 36292:return p0}}class g0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=qg(e.type)}}class _0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=m0(e.type)}}class x0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],n)}}}const pr=/(\w+)(\])?(\[|\.)?/g;function Jc(i,t){i.seq.push(t),i.map[t.id]=t}function v0(i,t,e){const n=i.name,s=n.length;for(pr.lastIndex=0;;){const a=pr.exec(n),r=pr.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Jc(e,l===void 0?new g0(o,i,t):new _0(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new x0(o),Jc(e,u)),e=u}}}class aa{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);v0(a,r,this)}}setValue(t,e,n,s){const a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function Qc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const M0=37297;let y0=0;function S0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}const tl=new Gt;function b0(i){jt._getMatrix(tl,jt.workingColorSpace,i);const t=`mat3( ${tl.elements.map(e=>e.toFixed(4))} )`;switch(jt.getTransfer(i)){case Ea:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function el(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+S0(i.getShaderSource(t),r)}else return s}function E0(i,t){const e=b0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function A0(i,t){let e;switch(t){case Hu:e="Linear";break;case Gu:e="Reinhard";break;case Vu:e="Cineon";break;case Wu:e="ACESFilmic";break;case $u:e="AgX";break;case Yu:e="Neutral";break;case Xu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Gs=new X;function T0(){jt.getLuminanceCoefficients(Gs);const i=Gs.x.toFixed(4),t=Gs.y.toFixed(4),e=Gs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function w0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(is).join(`
`)}function R0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function C0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(t,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:i.getAttribLocation(t,r),locationSize:o}}return e}function is(i){return i!==""}function nl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function il(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const P0=/^[ \t]*#include +<([\w\d./]+)>/gm;function bo(i){return i.replace(P0,D0)}const L0=new Map;function D0(i,t){let e=Xt[t];if(e===void 0){const n=L0.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return bo(e)}const I0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sl(i){return i.replace(I0,U0)}function U0(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function al(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function k0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===kl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Fl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Mn&&(t="SHADOWMAP_TYPE_VSM"),t}function F0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ni:case zi:t="ENVMAP_TYPE_CUBE";break;case ba:t="ENVMAP_TYPE_CUBE_UV";break}return t}function N0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case zi:t="ENVMAP_MODE_REFRACTION";break}return t}function z0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ko:t="ENVMAP_BLENDING_MULTIPLY";break;case Ou:t="ENVMAP_BLENDING_MIX";break;case Bu:t="ENVMAP_BLENDING_ADD";break}return t}function O0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function B0(i,t,e,n){const s=i.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=k0(e),l=F0(e),h=N0(e),u=z0(e),f=O0(e),d=w0(e),g=R0(a),_=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(is).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(is).join(`
`),p.length>0&&(p+=`
`)):(m=[al(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(is).join(`
`),p=[al(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==zn?"#define TONE_MAPPING":"",e.toneMapping!==zn?Xt.tonemapping_pars_fragment:"",e.toneMapping!==zn?A0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,E0("linearToOutputTexel",e.outputColorSpace),T0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(is).join(`
`)),r=bo(r),r=nl(r,e),r=il(r,e),o=bo(o),o=nl(o,e),o=il(o,e),r=sl(r),o=sl(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===xc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===xc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=x+m+r,M=x+p+o,I=Qc(s,s.VERTEX_SHADER,S),P=Qc(s,s.FRAGMENT_SHADER,M);s.attachShader(_,I),s.attachShader(_,P),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(w){if(i.debug.checkShaderErrors){const C=s.getProgramInfoLog(_).trim(),D=s.getShaderInfoLog(I).trim(),z=s.getShaderInfoLog(P).trim();let G=!0,k=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,I,P);else{const B=el(s,I,"vertex"),Y=el(s,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+C+`
`+B+`
`+Y)}else C!==""?console.warn("THREE.WebGLProgram: Program Info Log:",C):(D===""||z==="")&&(k=!1);k&&(w.diagnostics={runnable:G,programLog:C,vertexShader:{log:D,prefix:m},fragmentShader:{log:z,prefix:p}})}s.deleteShader(I),s.deleteShader(P),L=new aa(s,_),b=C0(s,_)}let L;this.getUniforms=function(){return L===void 0&&R(this),L};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,M0)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=y0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=I,this.fragmentShader=P,this}let H0=0;class G0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new V0(t),e.set(t,n)),n}}class V0{constructor(t){this.id=H0++,this.code=t,this.usedTimes=0}}function W0(i,t,e,n,s,a,r){const o=new Vo,c=new G0,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,w,C,D){const z=C.fog,G=D.geometry,k=b.isMeshStandardMaterial?C.environment:null,B=(b.isMeshStandardMaterial?e:t).get(b.envMap||k),Y=B&&B.mapping===ba?B.image.height:null,et=g[b.type];b.precision!==null&&(d=s.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const Q=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,lt=Q!==void 0?Q.length:0;let St=0;G.morphAttributes.position!==void 0&&(St=1),G.morphAttributes.normal!==void 0&&(St=2),G.morphAttributes.color!==void 0&&(St=3);let xt,Z,at,pt;if(et){const Yt=sn[et];xt=Yt.vertexShader,Z=Yt.fragmentShader}else xt=b.vertexShader,Z=b.fragmentShader,c.update(b),at=c.getVertexShaderID(b),pt=c.getFragmentShaderID(b);const ut=i.getRenderTarget(),ft=i.state.buffers.depth.getReversed(),Rt=D.isInstancedMesh===!0,Dt=D.isBatchedMesh===!0,Ut=!!b.map,At=!!b.matcap,$t=!!B,T=!!b.aoMap,mt=!!b.lightMap,tt=!!b.bumpMap,vt=!!b.normalMap,$=!!b.displacementMap,it=!!b.emissiveMap,nt=!!b.metalnessMap,A=!!b.roughnessMap,v=b.anisotropy>0,O=b.clearcoat>0,K=b.dispersion>0,st=b.iridescence>0,J=b.sheen>0,rt=b.transmission>0,ht=v&&!!b.anisotropyMap,_t=O&&!!b.clearcoatMap,zt=O&&!!b.clearcoatNormalMap,ct=O&&!!b.clearcoatRoughnessMap,bt=st&&!!b.iridescenceMap,It=st&&!!b.iridescenceThicknessMap,kt=J&&!!b.sheenColorMap,Et=J&&!!b.sheenRoughnessMap,Vt=!!b.specularMap,Nt=!!b.specularColorMap,Zt=!!b.specularIntensityMap,F=rt&&!!b.transmissionMap,N=rt&&!!b.thicknessMap,U=!!b.gradientMap,H=!!b.alphaMap,ot=b.alphaTest>0,dt=!!b.alphaHash,Mt=!!b.extensions;let Wt=zn;b.toneMapped&&(ut===null||ut.isXRRenderTarget===!0)&&(Wt=i.toneMapping);const se={shaderID:et,shaderType:b.type,shaderName:b.name,vertexShader:xt,fragmentShader:Z,defines:b.defines,customVertexShaderID:at,customFragmentShaderID:pt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:Dt,batchingColor:Dt&&D._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&D.instanceColor!==null,instancingMorph:Rt&&D.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ut===null?i.outputColorSpace:ut.isXRRenderTarget===!0?ut.texture.colorSpace:Gi,alphaToCoverage:!!b.alphaToCoverage,map:Ut,matcap:At,envMap:$t,envMapMode:$t&&B.mapping,envMapCubeUVHeight:Y,aoMap:T,lightMap:mt,bumpMap:tt,normalMap:vt,displacementMap:f&&$,emissiveMap:it,normalMapObjectSpace:vt&&b.normalMapType===Ku,normalMapTangentSpace:vt&&b.normalMapType===Zl,metalnessMap:nt,roughnessMap:A,anisotropy:v,anisotropyMap:ht,clearcoat:O,clearcoatMap:_t,clearcoatNormalMap:zt,clearcoatRoughnessMap:ct,dispersion:K,iridescence:st,iridescenceMap:bt,iridescenceThicknessMap:It,sheen:J,sheenColorMap:kt,sheenRoughnessMap:Et,specularMap:Vt,specularColorMap:Nt,specularIntensityMap:Zt,transmission:rt,transmissionMap:F,thicknessMap:N,gradientMap:U,opaque:b.transparent===!1&&b.blending===Ii&&b.alphaToCoverage===!1,alphaMap:H,alphaTest:ot,alphaHash:dt,combine:b.combine,mapUv:Ut&&_(b.map.channel),aoMapUv:T&&_(b.aoMap.channel),lightMapUv:mt&&_(b.lightMap.channel),bumpMapUv:tt&&_(b.bumpMap.channel),normalMapUv:vt&&_(b.normalMap.channel),displacementMapUv:$&&_(b.displacementMap.channel),emissiveMapUv:it&&_(b.emissiveMap.channel),metalnessMapUv:nt&&_(b.metalnessMap.channel),roughnessMapUv:A&&_(b.roughnessMap.channel),anisotropyMapUv:ht&&_(b.anisotropyMap.channel),clearcoatMapUv:_t&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:zt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ct&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:bt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:It&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:kt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Et&&_(b.sheenRoughnessMap.channel),specularMapUv:Vt&&_(b.specularMap.channel),specularColorMapUv:Nt&&_(b.specularColorMap.channel),specularIntensityMapUv:Zt&&_(b.specularIntensityMap.channel),transmissionMapUv:F&&_(b.transmissionMap.channel),thicknessMapUv:N&&_(b.thicknessMap.channel),alphaMapUv:H&&_(b.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(vt||v),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!G.attributes.uv&&(Ut||H),fog:!!z,useFog:b.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:ft,skinning:D.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:St,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&w.length>0,shadowMapType:i.shadowMap.type,toneMapping:Wt,decodeVideoTexture:Ut&&b.map.isVideoTexture===!0&&jt.getTransfer(b.map.colorSpace)===ne,decodeVideoTextureEmissive:it&&b.emissiveMap.isVideoTexture===!0&&jt.getTransfer(b.emissiveMap.colorSpace)===ne,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Te,flipSided:b.side===Le,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Mt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Mt&&b.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return se.vertexUv1s=l.has(1),se.vertexUv2s=l.has(2),se.vertexUv3s=l.has(3),l.clear(),se}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const w in b.defines)y.push(w),y.push(b.defines[w]);return b.isRawShaderMaterial===!1&&(x(y,b),S(y,b),y.push(i.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function S(b,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),b.push(o.mask)}function M(b){const y=g[b.type];let w;if(y){const C=sn[y];w=wf.clone(C.uniforms)}else w=b.uniforms;return w}function I(b,y){let w;for(let C=0,D=h.length;C<D;C++){const z=h[C];if(z.cacheKey===y){w=z,++w.usedTimes;break}}return w===void 0&&(w=new B0(i,y,b,a),h.push(w)),w}function P(b){if(--b.usedTimes===0){const y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function R(b){c.remove(b)}function L(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:I,releaseProgram:P,releaseShaderCache:R,programs:h,dispose:L}}function X0(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:a}}function $0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function rl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ol(){const i=[];let t=0;const e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function r(u,f,d,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,f,d,g,_,m){const p=r(u,f,d,g,_,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,g,_,m){const p=r(u,f,d,g,_,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||$0),n.length>1&&n.sort(f||rl),s.length>1&&s.sort(f||rl)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:o,unshift:c,finish:h,sort:l}}function Y0(){let i=new WeakMap;function t(n,s){const a=i.get(n);let r;return a===void 0?(r=new ol,i.set(n,[r])):s>=a.length?(r=new ol,a.push(r)):r=a[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function Z0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new X,color:new Bt};break;case"SpotLight":e={position:new X,direction:new X,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new X,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new X,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new X,halfWidth:new X,halfHeight:new X};break}return i[t.id]=e,e}}}function q0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let j0=0;function K0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function J0(i){const t=new Z0,e=q0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new X);const s=new X,a=new oe,r=new oe;function o(l){let h=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,g=0,_=0,m=0,p=0,x=0,S=0,M=0,I=0,P=0,R=0;l.sort(K0);for(let b=0,y=l.length;b<y;b++){const w=l[b],C=w.color,D=w.intensity,z=w.distance,G=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)h+=C.r*D,u+=C.g*D,f+=C.b*D;else if(w.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(w.sh.coefficients[k],D);R++}else if(w.isDirectionalLight){const k=t.get(w);if(k.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const B=w.shadow,Y=e.get(w);Y.shadowIntensity=B.intensity,Y.shadowBias=B.bias,Y.shadowNormalBias=B.normalBias,Y.shadowRadius=B.radius,Y.shadowMapSize=B.mapSize,n.directionalShadow[d]=Y,n.directionalShadowMap[d]=G,n.directionalShadowMatrix[d]=w.shadow.matrix,x++}n.directional[d]=k,d++}else if(w.isSpotLight){const k=t.get(w);k.position.setFromMatrixPosition(w.matrixWorld),k.color.copy(C).multiplyScalar(D),k.distance=z,k.coneCos=Math.cos(w.angle),k.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),k.decay=w.decay,n.spot[_]=k;const B=w.shadow;if(w.map&&(n.spotLightMap[I]=w.map,I++,B.updateMatrices(w),w.castShadow&&P++),n.spotLightMatrix[_]=B.matrix,w.castShadow){const Y=e.get(w);Y.shadowIntensity=B.intensity,Y.shadowBias=B.bias,Y.shadowNormalBias=B.normalBias,Y.shadowRadius=B.radius,Y.shadowMapSize=B.mapSize,n.spotShadow[_]=Y,n.spotShadowMap[_]=G,M++}_++}else if(w.isRectAreaLight){const k=t.get(w);k.color.copy(C).multiplyScalar(D),k.halfWidth.set(w.width*.5,0,0),k.halfHeight.set(0,w.height*.5,0),n.rectArea[m]=k,m++}else if(w.isPointLight){const k=t.get(w);if(k.color.copy(w.color).multiplyScalar(w.intensity),k.distance=w.distance,k.decay=w.decay,w.castShadow){const B=w.shadow,Y=e.get(w);Y.shadowIntensity=B.intensity,Y.shadowBias=B.bias,Y.shadowNormalBias=B.normalBias,Y.shadowRadius=B.radius,Y.shadowMapSize=B.mapSize,Y.shadowCameraNear=B.camera.near,Y.shadowCameraFar=B.camera.far,n.pointShadow[g]=Y,n.pointShadowMap[g]=G,n.pointShadowMatrix[g]=w.shadow.matrix,S++}n.point[g]=k,g++}else if(w.isHemisphereLight){const k=t.get(w);k.skyColor.copy(w.color).multiplyScalar(D),k.groundColor.copy(w.groundColor).multiplyScalar(D),n.hemi[p]=k,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=yt.LTC_FLOAT_1,n.rectAreaLTC2=yt.LTC_FLOAT_2):(n.rectAreaLTC1=yt.LTC_HALF_1,n.rectAreaLTC2=yt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const L=n.hash;(L.directionalLength!==d||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==m||L.hemiLength!==p||L.numDirectionalShadows!==x||L.numPointShadows!==S||L.numSpotShadows!==M||L.numSpotMaps!==I||L.numLightProbes!==R)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=M+I-P,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=R,L.directionalLength=d,L.pointLength=g,L.spotLength=_,L.rectAreaLength=m,L.hemiLength=p,L.numDirectionalShadows=x,L.numPointShadows=S,L.numSpotShadows=M,L.numSpotMaps=I,L.numLightProbes=R,n.version=j0++)}function c(l,h){let u=0,f=0,d=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const S=l[p];if(S.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(S.isSpotLight){const M=n.spot[d];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),d++}else if(S.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),r.identity(),a.copy(S.matrixWorld),a.premultiply(m),r.extractRotation(a),M.halfWidth.set(S.width*.5,0,0),M.halfHeight.set(0,S.height*.5,0),M.halfWidth.applyMatrix4(r),M.halfHeight.applyMatrix4(r),g++}else if(S.isPointLight){const M=n.point[f];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(m),f++}else if(S.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function cl(i){const t=new J0(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function a(h){e.push(h)}function r(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function Q0(i){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new cl(i),t.set(s,[o])):a>=r.length?(o=new cl(i),r.push(o)):o=r[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class t_ extends ri{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=qu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class e_ extends ri{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const n_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,i_=`uniform sampler2D shadow_pass;
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
}`;function s_(i,t,e){let n=new Wo;const s=new Ht,a=new Ht,r=new le,o=new t_({depthPacking:ju}),c=new e_,l={},h=e.maxTextureSize,u={[Bn]:Le,[Le]:Bn,[Te]:Te},f=new Hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ht},radius:{value:4}},vertexShader:n_,fragmentShader:i_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new De;g.setAttribute("position",new je(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new re(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kl;let p=this.type;this.render=function(P,R,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||P.length===0)return;const b=i.getRenderTarget(),y=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),C=i.state;C.setBlending(Nn),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const D=p!==Mn&&this.type===Mn,z=p===Mn&&this.type!==Mn;for(let G=0,k=P.length;G<k;G++){const B=P[G],Y=B.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const et=Y.getFrameExtents();if(s.multiply(et),a.copy(Y.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/et.x),s.x=a.x*et.x,Y.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/et.y),s.y=a.y*et.y,Y.mapSize.y=a.y)),Y.map===null||D===!0||z===!0){const lt=this.type!==Mn?{minFilter:qe,magFilter:qe}:{};Y.map!==null&&Y.map.dispose(),Y.map=new ai(s.x,s.y,lt),Y.map.texture.name=B.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const Q=Y.getViewportCount();for(let lt=0;lt<Q;lt++){const St=Y.getViewport(lt);r.set(a.x*St.x,a.y*St.y,a.x*St.z,a.y*St.w),C.viewport(r),Y.updateMatrices(B,lt),n=Y.getFrustum(),M(R,L,Y.camera,B,this.type)}Y.isPointLightShadow!==!0&&this.type===Mn&&x(Y,L),Y.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,y,w)};function x(P,R){const L=t.update(_);f.defines.VSM_SAMPLES!==P.blurSamples&&(f.defines.VSM_SAMPLES=P.blurSamples,d.defines.VSM_SAMPLES=P.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new ai(s.x,s.y)),f.uniforms.shadow_pass.value=P.map.texture,f.uniforms.resolution.value=P.mapSize,f.uniforms.radius.value=P.radius,i.setRenderTarget(P.mapPass),i.clear(),i.renderBufferDirect(R,null,L,f,_,null),d.uniforms.shadow_pass.value=P.mapPass.texture,d.uniforms.resolution.value=P.mapSize,d.uniforms.radius.value=P.radius,i.setRenderTarget(P.map),i.clear(),i.renderBufferDirect(R,null,L,d,_,null)}function S(P,R,L,b){let y=null;const w=L.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(w!==void 0)y=w;else if(y=L.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const C=y.uuid,D=R.uuid;let z=l[C];z===void 0&&(z={},l[C]=z);let G=z[D];G===void 0&&(G=y.clone(),z[D]=G,R.addEventListener("dispose",I)),y=G}if(y.visible=R.visible,y.wireframe=R.wireframe,b===Mn?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:u[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const C=i.properties.get(y);C.light=L}return y}function M(P,R,L,b,y){if(P.visible===!1)return;if(P.layers.test(R.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&y===Mn)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,P.matrixWorld);const D=t.update(P),z=P.material;if(Array.isArray(z)){const G=D.groups;for(let k=0,B=G.length;k<B;k++){const Y=G[k],et=z[Y.materialIndex];if(et&&et.visible){const Q=S(P,et,b,y);P.onBeforeShadow(i,P,R,L,D,Q,Y),i.renderBufferDirect(L,null,D,Q,P,Y),P.onAfterShadow(i,P,R,L,D,Q,Y)}}}else if(z.visible){const G=S(P,z,b,y);P.onBeforeShadow(i,P,R,L,D,G,null),i.renderBufferDirect(L,null,D,G,P,null),P.onAfterShadow(i,P,R,L,D,G,null)}}const C=P.children;for(let D=0,z=C.length;D<z;D++)M(C[D],R,L,b,y)}function I(P){P.target.removeEventListener("dispose",I);for(const L in l){const b=l[L],y=P.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const a_={[Nr]:zr,[Or]:Gr,[Br]:Vr,[Fi]:Hr,[zr]:Nr,[Gr]:Or,[Vr]:Br,[Hr]:Fi};function r_(i,t){function e(){let F=!1;const N=new le;let U=null;const H=new le(0,0,0,0);return{setMask:function(ot){U!==ot&&!F&&(i.colorMask(ot,ot,ot,ot),U=ot)},setLocked:function(ot){F=ot},setClear:function(ot,dt,Mt,Wt,se){se===!0&&(ot*=Wt,dt*=Wt,Mt*=Wt),N.set(ot,dt,Mt,Wt),H.equals(N)===!1&&(i.clearColor(ot,dt,Mt,Wt),H.copy(N))},reset:function(){F=!1,U=null,H.set(-1,0,0,0)}}}function n(){let F=!1,N=!1,U=null,H=null,ot=null;return{setReversed:function(dt){if(N!==dt){const Mt=t.get("EXT_clip_control");N?Mt.clipControlEXT(Mt.LOWER_LEFT_EXT,Mt.ZERO_TO_ONE_EXT):Mt.clipControlEXT(Mt.LOWER_LEFT_EXT,Mt.NEGATIVE_ONE_TO_ONE_EXT);const Wt=ot;ot=null,this.setClear(Wt)}N=dt},getReversed:function(){return N},setTest:function(dt){dt?ut(i.DEPTH_TEST):ft(i.DEPTH_TEST)},setMask:function(dt){U!==dt&&!F&&(i.depthMask(dt),U=dt)},setFunc:function(dt){if(N&&(dt=a_[dt]),H!==dt){switch(dt){case Nr:i.depthFunc(i.NEVER);break;case zr:i.depthFunc(i.ALWAYS);break;case Or:i.depthFunc(i.LESS);break;case Fi:i.depthFunc(i.LEQUAL);break;case Br:i.depthFunc(i.EQUAL);break;case Hr:i.depthFunc(i.GEQUAL);break;case Gr:i.depthFunc(i.GREATER);break;case Vr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}H=dt}},setLocked:function(dt){F=dt},setClear:function(dt){ot!==dt&&(N&&(dt=1-dt),i.clearDepth(dt),ot=dt)},reset:function(){F=!1,U=null,H=null,ot=null,N=!1}}}function s(){let F=!1,N=null,U=null,H=null,ot=null,dt=null,Mt=null,Wt=null,se=null;return{setTest:function(Yt){F||(Yt?ut(i.STENCIL_TEST):ft(i.STENCIL_TEST))},setMask:function(Yt){N!==Yt&&!F&&(i.stencilMask(Yt),N=Yt)},setFunc:function(Yt,Kt,ue){(U!==Yt||H!==Kt||ot!==ue)&&(i.stencilFunc(Yt,Kt,ue),U=Yt,H=Kt,ot=ue)},setOp:function(Yt,Kt,ue){(dt!==Yt||Mt!==Kt||Wt!==ue)&&(i.stencilOp(Yt,Kt,ue),dt=Yt,Mt=Kt,Wt=ue)},setLocked:function(Yt){F=Yt},setClear:function(Yt){se!==Yt&&(i.clearStencil(Yt),se=Yt)},reset:function(){F=!1,N=null,U=null,H=null,ot=null,dt=null,Mt=null,Wt=null,se=null}}}const a=new e,r=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],g=null,_=!1,m=null,p=null,x=null,S=null,M=null,I=null,P=null,R=new Bt(0,0,0),L=0,b=!1,y=null,w=null,C=null,D=null,z=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,B=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(Y)[1]),k=B>=1):Y.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),k=B>=2);let et=null,Q={};const lt=i.getParameter(i.SCISSOR_BOX),St=i.getParameter(i.VIEWPORT),xt=new le().fromArray(lt),Z=new le().fromArray(St);function at(F,N,U,H){const ot=new Uint8Array(4),dt=i.createTexture();i.bindTexture(F,dt),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Mt=0;Mt<U;Mt++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(N,0,i.RGBA,1,1,H,0,i.RGBA,i.UNSIGNED_BYTE,ot):i.texImage2D(N+Mt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ot);return dt}const pt={};pt[i.TEXTURE_2D]=at(i.TEXTURE_2D,i.TEXTURE_2D,1),pt[i.TEXTURE_CUBE_MAP]=at(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[i.TEXTURE_2D_ARRAY]=at(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),pt[i.TEXTURE_3D]=at(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ut(i.DEPTH_TEST),r.setFunc(Fi),tt(!1),vt(fc),ut(i.CULL_FACE),T(Nn);function ut(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function ft(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function Rt(F,N){return u[F]!==N?(i.bindFramebuffer(F,N),u[F]=N,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=N),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=N),!0):!1}function Dt(F,N){let U=d,H=!1;if(F){U=f.get(N),U===void 0&&(U=[],f.set(N,U));const ot=F.textures;if(U.length!==ot.length||U[0]!==i.COLOR_ATTACHMENT0){for(let dt=0,Mt=ot.length;dt<Mt;dt++)U[dt]=i.COLOR_ATTACHMENT0+dt;U.length=ot.length,H=!0}}else U[0]!==i.BACK&&(U[0]=i.BACK,H=!0);H&&i.drawBuffers(U)}function Ut(F){return g!==F?(i.useProgram(F),g=F,!0):!1}const At={[Qn]:i.FUNC_ADD,[Su]:i.FUNC_SUBTRACT,[bu]:i.FUNC_REVERSE_SUBTRACT};At[Eu]=i.MIN,At[Au]=i.MAX;const $t={[Tu]:i.ZERO,[wu]:i.ONE,[Ru]:i.SRC_COLOR,[kr]:i.SRC_ALPHA,[Uu]:i.SRC_ALPHA_SATURATE,[Du]:i.DST_COLOR,[Pu]:i.DST_ALPHA,[Cu]:i.ONE_MINUS_SRC_COLOR,[Fr]:i.ONE_MINUS_SRC_ALPHA,[Iu]:i.ONE_MINUS_DST_COLOR,[Lu]:i.ONE_MINUS_DST_ALPHA,[ku]:i.CONSTANT_COLOR,[Fu]:i.ONE_MINUS_CONSTANT_COLOR,[Nu]:i.CONSTANT_ALPHA,[zu]:i.ONE_MINUS_CONSTANT_ALPHA};function T(F,N,U,H,ot,dt,Mt,Wt,se,Yt){if(F===Nn){_===!0&&(ft(i.BLEND),_=!1);return}if(_===!1&&(ut(i.BLEND),_=!0),F!==yu){if(F!==m||Yt!==b){if((p!==Qn||M!==Qn)&&(i.blendEquation(i.FUNC_ADD),p=Qn,M=Qn),Yt)switch(F){case Ii:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case pc:i.blendFunc(i.ONE,i.ONE);break;case mc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case gc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Ii:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case pc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case mc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case gc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}x=null,S=null,I=null,P=null,R.set(0,0,0),L=0,m=F,b=Yt}return}ot=ot||N,dt=dt||U,Mt=Mt||H,(N!==p||ot!==M)&&(i.blendEquationSeparate(At[N],At[ot]),p=N,M=ot),(U!==x||H!==S||dt!==I||Mt!==P)&&(i.blendFuncSeparate($t[U],$t[H],$t[dt],$t[Mt]),x=U,S=H,I=dt,P=Mt),(Wt.equals(R)===!1||se!==L)&&(i.blendColor(Wt.r,Wt.g,Wt.b,se),R.copy(Wt),L=se),m=F,b=!1}function mt(F,N){F.side===Te?ft(i.CULL_FACE):ut(i.CULL_FACE);let U=F.side===Le;N&&(U=!U),tt(U),F.blending===Ii&&F.transparent===!1?T(Nn):T(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),r.setFunc(F.depthFunc),r.setTest(F.depthTest),r.setMask(F.depthWrite),a.setMask(F.colorWrite);const H=F.stencilWrite;o.setTest(H),H&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),it(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ut(i.SAMPLE_ALPHA_TO_COVERAGE):ft(i.SAMPLE_ALPHA_TO_COVERAGE)}function tt(F){y!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),y=F)}function vt(F){F!==vu?(ut(i.CULL_FACE),F!==w&&(F===fc?i.cullFace(i.BACK):F===Mu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ft(i.CULL_FACE),w=F}function $(F){F!==C&&(k&&i.lineWidth(F),C=F)}function it(F,N,U){F?(ut(i.POLYGON_OFFSET_FILL),(D!==N||z!==U)&&(i.polygonOffset(N,U),D=N,z=U)):ft(i.POLYGON_OFFSET_FILL)}function nt(F){F?ut(i.SCISSOR_TEST):ft(i.SCISSOR_TEST)}function A(F){F===void 0&&(F=i.TEXTURE0+G-1),et!==F&&(i.activeTexture(F),et=F)}function v(F,N,U){U===void 0&&(et===null?U=i.TEXTURE0+G-1:U=et);let H=Q[U];H===void 0&&(H={type:void 0,texture:void 0},Q[U]=H),(H.type!==F||H.texture!==N)&&(et!==U&&(i.activeTexture(U),et=U),i.bindTexture(F,N||pt[F]),H.type=F,H.texture=N)}function O(){const F=Q[et];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function K(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function st(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function rt(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ht(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function _t(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function zt(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ct(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function bt(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function It(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function kt(F){xt.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),xt.copy(F))}function Et(F){Z.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Z.copy(F))}function Vt(F,N){let U=l.get(N);U===void 0&&(U=new WeakMap,l.set(N,U));let H=U.get(F);H===void 0&&(H=i.getUniformBlockIndex(N,F.name),U.set(F,H))}function Nt(F,N){const H=l.get(N).get(F);c.get(N)!==H&&(i.uniformBlockBinding(N,H,F.__bindingPointIndex),c.set(N,H))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},et=null,Q={},u={},f=new WeakMap,d=[],g=null,_=!1,m=null,p=null,x=null,S=null,M=null,I=null,P=null,R=new Bt(0,0,0),L=0,b=!1,y=null,w=null,C=null,D=null,z=null,xt.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:ut,disable:ft,bindFramebuffer:Rt,drawBuffers:Dt,useProgram:Ut,setBlending:T,setMaterial:mt,setFlipSided:tt,setCullFace:vt,setLineWidth:$,setPolygonOffset:it,setScissorTest:nt,activeTexture:A,bindTexture:v,unbindTexture:O,compressedTexImage2D:K,compressedTexImage3D:st,texImage2D:bt,texImage3D:It,updateUBOMapping:Vt,uniformBlockBinding:Nt,texStorage2D:zt,texStorage3D:ct,texSubImage2D:J,texSubImage3D:rt,compressedTexSubImage2D:ht,compressedTexSubImage3D:_t,scissor:kt,viewport:Et,reset:Zt}}function ll(i,t,e,n){const s=o_(n);switch(e){case Hl:return i*t;case Vl:return i*t;case Wl:return i*t*2;case Xl:return i*t/s.components*s.byteLength;case Oo:return i*t/s.components*s.byteLength;case $l:return i*t*2/s.components*s.byteLength;case Bo:return i*t*2/s.components*s.byteLength;case Gl:return i*t*3/s.components*s.byteLength;case Ze:return i*t*4/s.components*s.byteLength;case Ho:return i*t*4/s.components*s.byteLength;case Qs:case ta:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ea:case na:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case qr:case Kr:return Math.max(i,16)*Math.max(t,8)/4;case Zr:case jr:return Math.max(i,8)*Math.max(t,8)/2;case Jr:case Qr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case to:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case eo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case no:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case io:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case so:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case ao:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ro:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case oo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case co:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case lo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ho:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case uo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case fo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case po:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case mo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ia:case go:case _o:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Yl:case xo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case vo:case Mo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function o_(i){switch(i){case An:case zl:return{byteLength:1,components:1};case os:case Ol:case ls:return{byteLength:2,components:1};case No:case zo:return{byteLength:2,components:4};case si:case Fo:case Sn:return{byteLength:4,components:1};case Bl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function c_(i,t,e,n,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ht,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,v){return d?new OffscreenCanvas(A,v):_a("canvas")}function _(A,v,O){let K=1;const st=nt(A);if((st.width>O||st.height>O)&&(K=O/Math.max(st.width,st.height)),K<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const J=Math.floor(K*st.width),rt=Math.floor(K*st.height);u===void 0&&(u=g(J,rt));const ht=v?g(J,rt):u;return ht.width=J,ht.height=rt,ht.getContext("2d").drawImage(A,0,0,J,rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+J+"x"+rt+")."),ht}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){i.generateMipmap(A)}function x(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(A,v,O,K,st=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let J=v;if(v===i.RED&&(O===i.FLOAT&&(J=i.R32F),O===i.HALF_FLOAT&&(J=i.R16F),O===i.UNSIGNED_BYTE&&(J=i.R8)),v===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(J=i.R8UI),O===i.UNSIGNED_SHORT&&(J=i.R16UI),O===i.UNSIGNED_INT&&(J=i.R32UI),O===i.BYTE&&(J=i.R8I),O===i.SHORT&&(J=i.R16I),O===i.INT&&(J=i.R32I)),v===i.RG&&(O===i.FLOAT&&(J=i.RG32F),O===i.HALF_FLOAT&&(J=i.RG16F),O===i.UNSIGNED_BYTE&&(J=i.RG8)),v===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(J=i.RG8UI),O===i.UNSIGNED_SHORT&&(J=i.RG16UI),O===i.UNSIGNED_INT&&(J=i.RG32UI),O===i.BYTE&&(J=i.RG8I),O===i.SHORT&&(J=i.RG16I),O===i.INT&&(J=i.RG32I)),v===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(J=i.RGB8UI),O===i.UNSIGNED_SHORT&&(J=i.RGB16UI),O===i.UNSIGNED_INT&&(J=i.RGB32UI),O===i.BYTE&&(J=i.RGB8I),O===i.SHORT&&(J=i.RGB16I),O===i.INT&&(J=i.RGB32I)),v===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),O===i.UNSIGNED_INT&&(J=i.RGBA32UI),O===i.BYTE&&(J=i.RGBA8I),O===i.SHORT&&(J=i.RGBA16I),O===i.INT&&(J=i.RGBA32I)),v===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),v===i.RGBA){const rt=st?Ea:jt.getTransfer(K);O===i.FLOAT&&(J=i.RGBA32F),O===i.HALF_FLOAT&&(J=i.RGBA16F),O===i.UNSIGNED_BYTE&&(J=rt===ne?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function M(A,v){let O;return A?v===null||v===si||v===Oi?O=i.DEPTH24_STENCIL8:v===Sn?O=i.DEPTH32F_STENCIL8:v===os&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===si||v===Oi?O=i.DEPTH_COMPONENT24:v===Sn?O=i.DEPTH_COMPONENT32F:v===os&&(O=i.DEPTH_COMPONENT16),O}function I(A,v){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==qe&&A.minFilter!==rn?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function P(A){const v=A.target;v.removeEventListener("dispose",P),L(v),v.isVideoTexture&&h.delete(v)}function R(A){const v=A.target;v.removeEventListener("dispose",R),y(v)}function L(A){const v=n.get(A);if(v.__webglInit===void 0)return;const O=A.source,K=f.get(O);if(K){const st=K[v.__cacheKey];st.usedTimes--,st.usedTimes===0&&b(A),Object.keys(K).length===0&&f.delete(O)}n.remove(A)}function b(A){const v=n.get(A);i.deleteTexture(v.__webglTexture);const O=A.source,K=f.get(O);delete K[v.__cacheKey],r.memory.textures--}function y(A){const v=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(v.__webglFramebuffer[K]))for(let st=0;st<v.__webglFramebuffer[K].length;st++)i.deleteFramebuffer(v.__webglFramebuffer[K][st]);else i.deleteFramebuffer(v.__webglFramebuffer[K]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[K])}else{if(Array.isArray(v.__webglFramebuffer))for(let K=0;K<v.__webglFramebuffer.length;K++)i.deleteFramebuffer(v.__webglFramebuffer[K]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let K=0;K<v.__webglColorRenderbuffer.length;K++)v.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[K]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const O=A.textures;for(let K=0,st=O.length;K<st;K++){const J=n.get(O[K]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),r.memory.textures--),n.remove(O[K])}n.remove(A)}let w=0;function C(){w=0}function D(){const A=w;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),w+=1,A}function z(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function G(A,v){const O=n.get(A);if(A.isVideoTexture&&$(A),A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){const K=A.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(O,A,v);return}}e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+v)}function k(A,v){const O=n.get(A);if(A.version>0&&O.__version!==A.version){Z(O,A,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+v)}function B(A,v){const O=n.get(A);if(A.version>0&&O.__version!==A.version){Z(O,A,v);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+v)}function Y(A,v){const O=n.get(A);if(A.version>0&&O.__version!==A.version){at(O,A,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+v)}const et={[$r]:i.REPEAT,[ei]:i.CLAMP_TO_EDGE,[Yr]:i.MIRRORED_REPEAT},Q={[qe]:i.NEAREST,[Zu]:i.NEAREST_MIPMAP_NEAREST,[Ss]:i.NEAREST_MIPMAP_LINEAR,[rn]:i.LINEAR,[Ha]:i.LINEAR_MIPMAP_NEAREST,[ni]:i.LINEAR_MIPMAP_LINEAR},lt={[Ju]:i.NEVER,[af]:i.ALWAYS,[Qu]:i.LESS,[ql]:i.LEQUAL,[tf]:i.EQUAL,[sf]:i.GEQUAL,[ef]:i.GREATER,[nf]:i.NOTEQUAL};function St(A,v){if(v.type===Sn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===rn||v.magFilter===Ha||v.magFilter===Ss||v.magFilter===ni||v.minFilter===rn||v.minFilter===Ha||v.minFilter===Ss||v.minFilter===ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,et[v.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,et[v.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,et[v.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,Q[v.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,Q[v.minFilter]),v.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,lt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===qe||v.minFilter!==Ss&&v.minFilter!==ni||v.type===Sn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function xt(A,v){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",P));const K=v.source;let st=f.get(K);st===void 0&&(st={},f.set(K,st));const J=z(v);if(J!==A.__cacheKey){st[J]===void 0&&(st[J]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,O=!0),st[J].usedTimes++;const rt=st[A.__cacheKey];rt!==void 0&&(st[A.__cacheKey].usedTimes--,rt.usedTimes===0&&b(v)),A.__cacheKey=J,A.__webglTexture=st[J].texture}return O}function Z(A,v,O){let K=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(K=i.TEXTURE_3D);const st=xt(A,v),J=v.source;e.bindTexture(K,A.__webglTexture,i.TEXTURE0+O);const rt=n.get(J);if(J.version!==rt.__version||st===!0){e.activeTexture(i.TEXTURE0+O);const ht=jt.getPrimaries(jt.workingColorSpace),_t=v.colorSpace===kn?null:jt.getPrimaries(v.colorSpace),zt=v.colorSpace===kn||ht===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,zt);let ct=_(v.image,!1,s.maxTextureSize);ct=it(v,ct);const bt=a.convert(v.format,v.colorSpace),It=a.convert(v.type);let kt=S(v.internalFormat,bt,It,v.colorSpace,v.isVideoTexture);St(K,v);let Et;const Vt=v.mipmaps,Nt=v.isVideoTexture!==!0,Zt=rt.__version===void 0||st===!0,F=J.dataReady,N=I(v,ct);if(v.isDepthTexture)kt=M(v.format===Bi,v.type),Zt&&(Nt?e.texStorage2D(i.TEXTURE_2D,1,kt,ct.width,ct.height):e.texImage2D(i.TEXTURE_2D,0,kt,ct.width,ct.height,0,bt,It,null));else if(v.isDataTexture)if(Vt.length>0){Nt&&Zt&&e.texStorage2D(i.TEXTURE_2D,N,kt,Vt[0].width,Vt[0].height);for(let U=0,H=Vt.length;U<H;U++)Et=Vt[U],Nt?F&&e.texSubImage2D(i.TEXTURE_2D,U,0,0,Et.width,Et.height,bt,It,Et.data):e.texImage2D(i.TEXTURE_2D,U,kt,Et.width,Et.height,0,bt,It,Et.data);v.generateMipmaps=!1}else Nt?(Zt&&e.texStorage2D(i.TEXTURE_2D,N,kt,ct.width,ct.height),F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct.width,ct.height,bt,It,ct.data)):e.texImage2D(i.TEXTURE_2D,0,kt,ct.width,ct.height,0,bt,It,ct.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Nt&&Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,N,kt,Vt[0].width,Vt[0].height,ct.depth);for(let U=0,H=Vt.length;U<H;U++)if(Et=Vt[U],v.format!==Ze)if(bt!==null)if(Nt){if(F)if(v.layerUpdates.size>0){const ot=ll(Et.width,Et.height,v.format,v.type);for(const dt of v.layerUpdates){const Mt=Et.data.subarray(dt*ot/Et.data.BYTES_PER_ELEMENT,(dt+1)*ot/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,U,0,0,dt,Et.width,Et.height,1,bt,Mt)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,U,0,0,0,Et.width,Et.height,ct.depth,bt,Et.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,U,kt,Et.width,Et.height,ct.depth,0,Et.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?F&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,U,0,0,0,Et.width,Et.height,ct.depth,bt,It,Et.data):e.texImage3D(i.TEXTURE_2D_ARRAY,U,kt,Et.width,Et.height,ct.depth,0,bt,It,Et.data)}else{Nt&&Zt&&e.texStorage2D(i.TEXTURE_2D,N,kt,Vt[0].width,Vt[0].height);for(let U=0,H=Vt.length;U<H;U++)Et=Vt[U],v.format!==Ze?bt!==null?Nt?F&&e.compressedTexSubImage2D(i.TEXTURE_2D,U,0,0,Et.width,Et.height,bt,Et.data):e.compressedTexImage2D(i.TEXTURE_2D,U,kt,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?F&&e.texSubImage2D(i.TEXTURE_2D,U,0,0,Et.width,Et.height,bt,It,Et.data):e.texImage2D(i.TEXTURE_2D,U,kt,Et.width,Et.height,0,bt,It,Et.data)}else if(v.isDataArrayTexture)if(Nt){if(Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,N,kt,ct.width,ct.height,ct.depth),F)if(v.layerUpdates.size>0){const U=ll(ct.width,ct.height,v.format,v.type);for(const H of v.layerUpdates){const ot=ct.data.subarray(H*U/ct.data.BYTES_PER_ELEMENT,(H+1)*U/ct.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,H,ct.width,ct.height,1,bt,It,ot)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ct.width,ct.height,ct.depth,bt,It,ct.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,kt,ct.width,ct.height,ct.depth,0,bt,It,ct.data);else if(v.isData3DTexture)Nt?(Zt&&e.texStorage3D(i.TEXTURE_3D,N,kt,ct.width,ct.height,ct.depth),F&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ct.width,ct.height,ct.depth,bt,It,ct.data)):e.texImage3D(i.TEXTURE_3D,0,kt,ct.width,ct.height,ct.depth,0,bt,It,ct.data);else if(v.isFramebufferTexture){if(Zt)if(Nt)e.texStorage2D(i.TEXTURE_2D,N,kt,ct.width,ct.height);else{let U=ct.width,H=ct.height;for(let ot=0;ot<N;ot++)e.texImage2D(i.TEXTURE_2D,ot,kt,U,H,0,bt,It,null),U>>=1,H>>=1}}else if(Vt.length>0){if(Nt&&Zt){const U=nt(Vt[0]);e.texStorage2D(i.TEXTURE_2D,N,kt,U.width,U.height)}for(let U=0,H=Vt.length;U<H;U++)Et=Vt[U],Nt?F&&e.texSubImage2D(i.TEXTURE_2D,U,0,0,bt,It,Et):e.texImage2D(i.TEXTURE_2D,U,kt,bt,It,Et);v.generateMipmaps=!1}else if(Nt){if(Zt){const U=nt(ct);e.texStorage2D(i.TEXTURE_2D,N,kt,U.width,U.height)}F&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,bt,It,ct)}else e.texImage2D(i.TEXTURE_2D,0,kt,bt,It,ct);m(v)&&p(K),rt.__version=J.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function at(A,v,O){if(v.image.length!==6)return;const K=xt(A,v),st=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+O);const J=n.get(st);if(st.version!==J.__version||K===!0){e.activeTexture(i.TEXTURE0+O);const rt=jt.getPrimaries(jt.workingColorSpace),ht=v.colorSpace===kn?null:jt.getPrimaries(v.colorSpace),_t=v.colorSpace===kn||rt===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const zt=v.isCompressedTexture||v.image[0].isCompressedTexture,ct=v.image[0]&&v.image[0].isDataTexture,bt=[];for(let H=0;H<6;H++)!zt&&!ct?bt[H]=_(v.image[H],!0,s.maxCubemapSize):bt[H]=ct?v.image[H].image:v.image[H],bt[H]=it(v,bt[H]);const It=bt[0],kt=a.convert(v.format,v.colorSpace),Et=a.convert(v.type),Vt=S(v.internalFormat,kt,Et,v.colorSpace),Nt=v.isVideoTexture!==!0,Zt=J.__version===void 0||K===!0,F=st.dataReady;let N=I(v,It);St(i.TEXTURE_CUBE_MAP,v);let U;if(zt){Nt&&Zt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,N,Vt,It.width,It.height);for(let H=0;H<6;H++){U=bt[H].mipmaps;for(let ot=0;ot<U.length;ot++){const dt=U[ot];v.format!==Ze?kt!==null?Nt?F&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,ot,0,0,dt.width,dt.height,kt,dt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,ot,Vt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,ot,0,0,dt.width,dt.height,kt,Et,dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,ot,Vt,dt.width,dt.height,0,kt,Et,dt.data)}}}else{if(U=v.mipmaps,Nt&&Zt){U.length>0&&N++;const H=nt(bt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,N,Vt,H.width,H.height)}for(let H=0;H<6;H++)if(ct){Nt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,0,0,bt[H].width,bt[H].height,kt,Et,bt[H].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,Vt,bt[H].width,bt[H].height,0,kt,Et,bt[H].data);for(let ot=0;ot<U.length;ot++){const Mt=U[ot].image[H].image;Nt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,ot+1,0,0,Mt.width,Mt.height,kt,Et,Mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,ot+1,Vt,Mt.width,Mt.height,0,kt,Et,Mt.data)}}else{Nt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,0,0,kt,Et,bt[H]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,Vt,kt,Et,bt[H]);for(let ot=0;ot<U.length;ot++){const dt=U[ot];Nt?F&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,ot+1,0,0,kt,Et,dt.image[H]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+H,ot+1,Vt,kt,Et,dt.image[H])}}}m(v)&&p(i.TEXTURE_CUBE_MAP),J.__version=st.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function pt(A,v,O,K,st,J){const rt=a.convert(O.format,O.colorSpace),ht=a.convert(O.type),_t=S(O.internalFormat,rt,ht,O.colorSpace),zt=n.get(v),ct=n.get(O);if(ct.__renderTarget=v,!zt.__hasExternalTextures){const bt=Math.max(1,v.width>>J),It=Math.max(1,v.height>>J);st===i.TEXTURE_3D||st===i.TEXTURE_2D_ARRAY?e.texImage3D(st,J,_t,bt,It,v.depth,0,rt,ht,null):e.texImage2D(st,J,_t,bt,It,0,rt,ht,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),vt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,st,ct.__webglTexture,0,tt(v)):(st===i.TEXTURE_2D||st>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,st,ct.__webglTexture,J),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ut(A,v,O){if(i.bindRenderbuffer(i.RENDERBUFFER,A),v.depthBuffer){const K=v.depthTexture,st=K&&K.isDepthTexture?K.type:null,J=M(v.stencilBuffer,st),rt=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=tt(v);vt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,J,v.width,v.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,J,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,J,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,rt,i.RENDERBUFFER,A)}else{const K=v.textures;for(let st=0;st<K.length;st++){const J=K[st],rt=a.convert(J.format,J.colorSpace),ht=a.convert(J.type),_t=S(J.internalFormat,rt,ht,J.colorSpace),zt=tt(v);O&&vt(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,zt,_t,v.width,v.height):vt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,zt,_t,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,_t,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ft(A,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(v.depthTexture);K.__renderTarget=v,(!K.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),G(v.depthTexture,0);const st=K.__webglTexture,J=tt(v);if(v.depthTexture.format===Ui)vt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0);else if(v.depthTexture.format===Bi)vt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function Rt(A){const v=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const K=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),K){const st=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,K.removeEventListener("dispose",st)};K.addEventListener("dispose",st),v.__depthDisposeCallback=st}v.__boundDepthTexture=K}if(A.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");ft(v.__webglFramebuffer,A)}else if(O){v.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[K]),v.__webglDepthbuffer[K]===void 0)v.__webglDepthbuffer[K]=i.createRenderbuffer(),ut(v.__webglDepthbuffer[K],A,!1);else{const st=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,J)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),ut(v.__webglDepthbuffer,A,!1);else{const K=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,st=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,st),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,st)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Dt(A,v,O){const K=n.get(A);v!==void 0&&pt(K.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Rt(A)}function Ut(A){const v=A.texture,O=n.get(A),K=n.get(v);A.addEventListener("dispose",R);const st=A.textures,J=A.isWebGLCubeRenderTarget===!0,rt=st.length>1;if(rt||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=v.version,r.memory.textures++),J){O.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[ht]=[];for(let _t=0;_t<v.mipmaps.length;_t++)O.__webglFramebuffer[ht][_t]=i.createFramebuffer()}else O.__webglFramebuffer[ht]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let ht=0;ht<v.mipmaps.length;ht++)O.__webglFramebuffer[ht]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(rt)for(let ht=0,_t=st.length;ht<_t;ht++){const zt=n.get(st[ht]);zt.__webglTexture===void 0&&(zt.__webglTexture=i.createTexture(),r.memory.textures++)}if(A.samples>0&&vt(A)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ht=0;ht<st.length;ht++){const _t=st[ht];O.__webglColorRenderbuffer[ht]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[ht]);const zt=a.convert(_t.format,_t.colorSpace),ct=a.convert(_t.type),bt=S(_t.internalFormat,zt,ct,_t.colorSpace,A.isXRRenderTarget===!0),It=tt(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,It,bt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,O.__webglColorRenderbuffer[ht])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),ut(O.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),St(i.TEXTURE_CUBE_MAP,v);for(let ht=0;ht<6;ht++)if(v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)pt(O.__webglFramebuffer[ht][_t],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,_t);else pt(O.__webglFramebuffer[ht],A,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);m(v)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){for(let ht=0,_t=st.length;ht<_t;ht++){const zt=st[ht],ct=n.get(zt);e.bindTexture(i.TEXTURE_2D,ct.__webglTexture),St(i.TEXTURE_2D,zt),pt(O.__webglFramebuffer,A,zt,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,0),m(zt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let ht=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ht=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,K.__webglTexture),St(ht,v),v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)pt(O.__webglFramebuffer[_t],A,v,i.COLOR_ATTACHMENT0,ht,_t);else pt(O.__webglFramebuffer,A,v,i.COLOR_ATTACHMENT0,ht,0);m(v)&&p(ht),e.unbindTexture()}A.depthBuffer&&Rt(A)}function At(A){const v=A.textures;for(let O=0,K=v.length;O<K;O++){const st=v[O];if(m(st)){const J=x(A),rt=n.get(st).__webglTexture;e.bindTexture(J,rt),p(J),e.unbindTexture()}}}const $t=[],T=[];function mt(A){if(A.samples>0){if(vt(A)===!1){const v=A.textures,O=A.width,K=A.height;let st=i.COLOR_BUFFER_BIT;const J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=n.get(A),ht=v.length>1;if(ht)for(let _t=0;_t<v.length;_t++)e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,rt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let _t=0;_t<v.length;_t++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(st|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(st|=i.STENCIL_BUFFER_BIT)),ht){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,rt.__webglColorRenderbuffer[_t]);const zt=n.get(v[_t]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,zt,0)}i.blitFramebuffer(0,0,O,K,0,0,O,K,st,i.NEAREST),c===!0&&($t.length=0,T.length=0,$t.push(i.COLOR_ATTACHMENT0+_t),A.depthBuffer&&A.resolveDepthBuffer===!1&&($t.push(J),T.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,T)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,$t))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ht)for(let _t=0;_t<v.length;_t++){e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,rt.__webglColorRenderbuffer[_t]);const zt=n.get(v[_t]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,zt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,rt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const v=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function tt(A){return Math.min(s.maxSamples,A.samples)}function vt(A){const v=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function $(A){const v=r.render.frame;h.get(A)!==v&&(h.set(A,v),A.update())}function it(A,v){const O=A.colorSpace,K=A.format,st=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||O!==Gi&&O!==kn&&(jt.getTransfer(O)===ne?(K!==Ze||st!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}function nt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=C,this.setTexture2D=G,this.setTexture2DArray=k,this.setTexture3D=B,this.setTextureCube=Y,this.rebindTextures=Dt,this.setupRenderTarget=Ut,this.updateRenderTargetMipmap=At,this.updateMultisampleRenderTarget=mt,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=vt}function l_(i,t){function e(n,s=kn){let a;const r=jt.getTransfer(s);if(n===An)return i.UNSIGNED_BYTE;if(n===No)return i.UNSIGNED_SHORT_4_4_4_4;if(n===zo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Bl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===zl)return i.BYTE;if(n===Ol)return i.SHORT;if(n===os)return i.UNSIGNED_SHORT;if(n===Fo)return i.INT;if(n===si)return i.UNSIGNED_INT;if(n===Sn)return i.FLOAT;if(n===ls)return i.HALF_FLOAT;if(n===Hl)return i.ALPHA;if(n===Gl)return i.RGB;if(n===Ze)return i.RGBA;if(n===Vl)return i.LUMINANCE;if(n===Wl)return i.LUMINANCE_ALPHA;if(n===Ui)return i.DEPTH_COMPONENT;if(n===Bi)return i.DEPTH_STENCIL;if(n===Xl)return i.RED;if(n===Oo)return i.RED_INTEGER;if(n===$l)return i.RG;if(n===Bo)return i.RG_INTEGER;if(n===Ho)return i.RGBA_INTEGER;if(n===Qs||n===ta||n===ea||n===na)if(r===ne)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===Qs)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ta)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ea)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===na)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===Qs)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ta)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ea)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===na)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Zr||n===qr||n===jr||n===Kr)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===Zr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===qr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===jr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Kr)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Jr||n===Qr||n===to)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===Jr||n===Qr)return r===ne?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===to)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===eo||n===no||n===io||n===so||n===ao||n===ro||n===oo||n===co||n===lo||n===ho||n===uo||n===fo||n===po||n===mo)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===eo)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===no)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===io)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===so)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ao)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ro)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===oo)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===co)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===lo)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ho)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===uo)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===fo)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===po)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===mo)return r===ne?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ia||n===go||n===_o)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===ia)return r===ne?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===go)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===_o)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Yl||n===xo||n===vo||n===Mo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===ia)return a.COMPRESSED_RED_RGTC1_EXT;if(n===xo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===vo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Mo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Oi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class d_ extends He{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Me extends de{constructor(){super(),this.isGroup=!0,this.type="Group"}}const h_={type:"move"};class mr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(h_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Me;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const u_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,f_=`
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

}`;class p_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Re,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Hn({vertexShader:u_,fragmentShader:f_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new re(new Ta(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class m_ extends Vi{constructor(t,e){super();const n=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,g=null;const _=new p_,m=e.getContextAttributes();let p=null,x=null;const S=[],M=[],I=new Ht;let P=null;const R=new He;R.viewport=new le;const L=new He;L.viewport=new le;const b=[R,L],y=new d_;let w=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let at=S[Z];return at===void 0&&(at=new mr,S[Z]=at),at.getTargetRaySpace()},this.getControllerGrip=function(Z){let at=S[Z];return at===void 0&&(at=new mr,S[Z]=at),at.getGripSpace()},this.getHand=function(Z){let at=S[Z];return at===void 0&&(at=new mr,S[Z]=at),at.getHandSpace()};function D(Z){const at=M.indexOf(Z.inputSource);if(at===-1)return;const pt=S[at];pt!==void 0&&(pt.update(Z.inputSource,Z.frame,l||r),pt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function z(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",G);for(let Z=0;Z<S.length;Z++){const at=M[Z];at!==null&&(M[Z]=null,S[Z].disconnect(at))}w=null,C=null,_.reset(),t.setRenderTarget(p),d=null,f=null,u=null,s=null,x=null,xt.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",z),s.addEventListener("inputsourceschange",G),m.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(I),s.renderState.layers===void 0){const at={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,e,at),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new ai(d.framebufferWidth,d.framebufferHeight,{format:Ze,type:An,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let at=null,pt=null,ut=null;m.depth&&(ut=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,at=m.stencil?Bi:Ui,pt=m.stencil?Oi:si);const ft={colorFormat:e.RGBA8,depthFormat:ut,scaleFactor:a};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(ft),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),x=new ai(f.textureWidth,f.textureHeight,{format:Ze,type:An,depthTexture:new od(f.textureWidth,f.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,at),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),xt.setContext(s),xt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function G(Z){for(let at=0;at<Z.removed.length;at++){const pt=Z.removed[at],ut=M.indexOf(pt);ut>=0&&(M[ut]=null,S[ut].disconnect(pt))}for(let at=0;at<Z.added.length;at++){const pt=Z.added[at];let ut=M.indexOf(pt);if(ut===-1){for(let Rt=0;Rt<S.length;Rt++)if(Rt>=M.length){M.push(pt),ut=Rt;break}else if(M[Rt]===null){M[Rt]=pt,ut=Rt;break}if(ut===-1)break}const ft=S[ut];ft&&ft.connect(pt)}}const k=new X,B=new X;function Y(Z,at,pt){k.setFromMatrixPosition(at.matrixWorld),B.setFromMatrixPosition(pt.matrixWorld);const ut=k.distanceTo(B),ft=at.projectionMatrix.elements,Rt=pt.projectionMatrix.elements,Dt=ft[14]/(ft[10]-1),Ut=ft[14]/(ft[10]+1),At=(ft[9]+1)/ft[5],$t=(ft[9]-1)/ft[5],T=(ft[8]-1)/ft[0],mt=(Rt[8]+1)/Rt[0],tt=Dt*T,vt=Dt*mt,$=ut/(-T+mt),it=$*-T;if(at.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(it),Z.translateZ($),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),ft[10]===-1)Z.projectionMatrix.copy(at.projectionMatrix),Z.projectionMatrixInverse.copy(at.projectionMatrixInverse);else{const nt=Dt+$,A=Ut+$,v=tt-it,O=vt+(ut-it),K=At*Ut/A*nt,st=$t*Ut/A*nt;Z.projectionMatrix.makePerspective(v,O,K,st,nt,A),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function et(Z,at){at===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(at.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let at=Z.near,pt=Z.far;_.texture!==null&&(_.depthNear>0&&(at=_.depthNear),_.depthFar>0&&(pt=_.depthFar)),y.near=L.near=R.near=at,y.far=L.far=R.far=pt,(w!==y.near||C!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),w=y.near,C=y.far),R.layers.mask=Z.layers.mask|2,L.layers.mask=Z.layers.mask|4,y.layers.mask=R.layers.mask|L.layers.mask;const ut=Z.parent,ft=y.cameras;et(y,ut);for(let Rt=0;Rt<ft.length;Rt++)et(ft[Rt],ut);ft.length===2?Y(y,R,L):y.projectionMatrix.copy(R.projectionMatrix),Q(Z,y,ut)};function Q(Z,at,pt){pt===null?Z.matrix.copy(at.matrixWorld):(Z.matrix.copy(pt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(at.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(at.projectionMatrix),Z.projectionMatrixInverse.copy(at.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=So*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(Z){c=Z,f!==null&&(f.fixedFoveation=Z),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let lt=null;function St(Z,at){if(h=at.getViewerPose(l||r),g=at,h!==null){const pt=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let ut=!1;pt.length!==y.cameras.length&&(y.cameras.length=0,ut=!0);for(let Rt=0;Rt<pt.length;Rt++){const Dt=pt[Rt];let Ut=null;if(d!==null)Ut=d.getViewport(Dt);else{const $t=u.getViewSubImage(f,Dt);Ut=$t.viewport,Rt===0&&(t.setRenderTargetTextures(x,$t.colorTexture,f.ignoreDepthValues?void 0:$t.depthStencilTexture),t.setRenderTarget(x))}let At=b[Rt];At===void 0&&(At=new He,At.layers.enable(Rt),At.viewport=new le,b[Rt]=At),At.matrix.fromArray(Dt.transform.matrix),At.matrix.decompose(At.position,At.quaternion,At.scale),At.projectionMatrix.fromArray(Dt.projectionMatrix),At.projectionMatrixInverse.copy(At.projectionMatrix).invert(),At.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),Rt===0&&(y.matrix.copy(At.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ut===!0&&y.cameras.push(At)}const ft=s.enabledFeatures;if(ft&&ft.includes("depth-sensing")){const Rt=u.getDepthInformation(pt[0]);Rt&&Rt.isValid&&Rt.texture&&_.init(t,Rt,s.renderState)}}for(let pt=0;pt<S.length;pt++){const ut=M[pt],ft=S[pt];ut!==null&&ft!==void 0&&ft.update(ut,at,l||r)}lt&&lt(Z,at),at.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:at}),g=null}const xt=new ad;xt.setAnimationLoop(St),this.setAnimationLoop=function(Z){lt=Z},this.dispose=function(){}}}const qn=new ln,g_=new oe;function __(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,nd(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,S,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),u(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p)):p.isMeshStandardMaterial?(a(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,M)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),_(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,x,S):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Le&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Le&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),S=x.envMap,M=x.envMapRotation;S&&(m.envMap.value=S,qn.copy(M),qn.x*=-1,qn.y*=-1,qn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(qn.y*=-1,qn.z*=-1),m.envMapRotation.value.setFromMatrix4(g_.makeRotationFromEuler(qn)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=S*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Le&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function x_(i,t,e,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,S){const M=S.program;n.uniformBlockBinding(x,M)}function l(x,S){let M=s[x.id];M===void 0&&(g(x),M=h(x),s[x.id]=M,x.addEventListener("dispose",m));const I=S.program;n.updateUBOMapping(x,I);const P=t.render.frame;a[x.id]!==P&&(f(x),a[x.id]=P)}function h(x){const S=u();x.__bindingPointIndex=S;const M=i.createBuffer(),I=x.__size,P=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,I,P),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,M),M}function u(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const S=s[x.id],M=x.uniforms,I=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let P=0,R=M.length;P<R;P++){const L=Array.isArray(M[P])?M[P]:[M[P]];for(let b=0,y=L.length;b<y;b++){const w=L[b];if(d(w,P,b,I)===!0){const C=w.__offset,D=Array.isArray(w.value)?w.value:[w.value];let z=0;for(let G=0;G<D.length;G++){const k=D[G],B=_(k);typeof k=="number"||typeof k=="boolean"?(w.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,C+z,w.__data)):k.isMatrix3?(w.__data[0]=k.elements[0],w.__data[1]=k.elements[1],w.__data[2]=k.elements[2],w.__data[3]=0,w.__data[4]=k.elements[3],w.__data[5]=k.elements[4],w.__data[6]=k.elements[5],w.__data[7]=0,w.__data[8]=k.elements[6],w.__data[9]=k.elements[7],w.__data[10]=k.elements[8],w.__data[11]=0):(k.toArray(w.__data,z),z+=B.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,C,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(x,S,M,I){const P=x.value,R=S+"_"+M;if(I[R]===void 0)return typeof P=="number"||typeof P=="boolean"?I[R]=P:I[R]=P.clone(),!0;{const L=I[R];if(typeof P=="number"||typeof P=="boolean"){if(L!==P)return I[R]=P,!0}else if(L.equals(P)===!1)return L.copy(P),!0}return!1}function g(x){const S=x.uniforms;let M=0;const I=16;for(let R=0,L=S.length;R<L;R++){const b=Array.isArray(S[R])?S[R]:[S[R]];for(let y=0,w=b.length;y<w;y++){const C=b[y],D=Array.isArray(C.value)?C.value:[C.value];for(let z=0,G=D.length;z<G;z++){const k=D[z],B=_(k),Y=M%I,et=Y%B.boundary,Q=Y+et;M+=et,Q!==0&&I-Q<B.storage&&(M+=I-Q),C.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=M,M+=B.storage}}}const P=M%I;return P>0&&(M+=I-P),x.__size=M,x.__cache={},this}function _(x){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),S}function m(x){const S=x.target;S.removeEventListener("dispose",m);const M=r.indexOf(S.__bindingPointIndex);r.splice(M,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete a[S.id]}function p(){for(const x in s)i.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:p}}class v_{constructor(t={}){const{canvas:e=of(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Be,this.toneMapping=zn,this.toneMappingExposure=1;const M=this;let I=!1,P=0,R=0,L=null,b=-1,y=null;const w=new le,C=new le;let D=null;const z=new Bt(0);let G=0,k=e.width,B=e.height,Y=1,et=null,Q=null;const lt=new le(0,0,k,B),St=new le(0,0,k,B);let xt=!1;const Z=new Wo;let at=!1,pt=!1;const ut=new oe,ft=new oe,Rt=new X,Dt=new le,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let At=!1;function $t(){return L===null?Y:1}let T=n;function mt(E,V){return e.getContext(E,V)}try{const E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Uo}`),e.addEventListener("webglcontextlost",H,!1),e.addEventListener("webglcontextrestored",ot,!1),e.addEventListener("webglcontextcreationerror",dt,!1),T===null){const V="webgl2";if(T=mt(V,E),T===null)throw mt(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let tt,vt,$,it,nt,A,v,O,K,st,J,rt,ht,_t,zt,ct,bt,It,kt,Et,Vt,Nt,Zt,F;function N(){tt=new Eg(T),tt.init(),Nt=new l_(T,tt),vt=new xg(T,tt,t,Nt),$=new r_(T,tt),vt.reverseDepthBuffer&&f&&$.buffers.depth.setReversed(!0),it=new wg(T),nt=new X0,A=new c_(T,tt,$,nt,vt,Nt,it),v=new Mg(M),O=new bg(M),K=new Uf(T),Zt=new gg(T,K),st=new Ag(T,K,it,Zt),J=new Cg(T,st,K,it),kt=new Rg(T,vt,A),ct=new vg(nt),rt=new W0(M,v,O,tt,vt,Zt,ct),ht=new __(M,nt),_t=new Y0,zt=new Q0(tt),It=new mg(M,v,O,$,J,d,c),bt=new s_(M,J,vt),F=new x_(T,it,vt,$),Et=new _g(T,tt,it),Vt=new Tg(T,tt,it),it.programs=rt.programs,M.capabilities=vt,M.extensions=tt,M.properties=nt,M.renderLists=_t,M.shadowMap=bt,M.state=$,M.info=it}N();const U=new m_(M,T);this.xr=U,this.getContext=function(){return T},this.getContextAttributes=function(){return T.getContextAttributes()},this.forceContextLoss=function(){const E=tt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=tt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(E){E!==void 0&&(Y=E,this.setSize(k,B,!1))},this.getSize=function(E){return E.set(k,B)},this.setSize=function(E,V,q=!0){if(U.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=E,B=V,e.width=Math.floor(E*Y),e.height=Math.floor(V*Y),q===!0&&(e.style.width=E+"px",e.style.height=V+"px"),this.setViewport(0,0,E,V)},this.getDrawingBufferSize=function(E){return E.set(k*Y,B*Y).floor()},this.setDrawingBufferSize=function(E,V,q){k=E,B=V,Y=q,e.width=Math.floor(E*q),e.height=Math.floor(V*q),this.setViewport(0,0,E,V)},this.getCurrentViewport=function(E){return E.copy(w)},this.getViewport=function(E){return E.copy(lt)},this.setViewport=function(E,V,q,j){E.isVector4?lt.set(E.x,E.y,E.z,E.w):lt.set(E,V,q,j),$.viewport(w.copy(lt).multiplyScalar(Y).round())},this.getScissor=function(E){return E.copy(St)},this.setScissor=function(E,V,q,j){E.isVector4?St.set(E.x,E.y,E.z,E.w):St.set(E,V,q,j),$.scissor(C.copy(St).multiplyScalar(Y).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(E){$.setScissorTest(xt=E)},this.setOpaqueSort=function(E){et=E},this.setTransparentSort=function(E){Q=E},this.getClearColor=function(E){return E.copy(It.getClearColor())},this.setClearColor=function(){It.setClearColor.apply(It,arguments)},this.getClearAlpha=function(){return It.getClearAlpha()},this.setClearAlpha=function(){It.setClearAlpha.apply(It,arguments)},this.clear=function(E=!0,V=!0,q=!0){let j=0;if(E){let W=!1;if(L!==null){const gt=L.texture.format;W=gt===Ho||gt===Bo||gt===Oo}if(W){const gt=L.texture.type,Tt=gt===An||gt===si||gt===os||gt===Oi||gt===No||gt===zo,Ct=It.getClearColor(),Pt=It.getClearAlpha(),Ft=Ct.r,Ot=Ct.g,Lt=Ct.b;Tt?(g[0]=Ft,g[1]=Ot,g[2]=Lt,g[3]=Pt,T.clearBufferuiv(T.COLOR,0,g)):(_[0]=Ft,_[1]=Ot,_[2]=Lt,_[3]=Pt,T.clearBufferiv(T.COLOR,0,_))}else j|=T.COLOR_BUFFER_BIT}V&&(j|=T.DEPTH_BUFFER_BIT),q&&(j|=T.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),T.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",H,!1),e.removeEventListener("webglcontextrestored",ot,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),_t.dispose(),zt.dispose(),nt.dispose(),v.dispose(),O.dispose(),J.dispose(),Zt.dispose(),F.dispose(),rt.dispose(),U.dispose(),U.removeEventListener("sessionstart",Tn),U.removeEventListener("sessionend",oi),hn.stop()};function H(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function ot(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const E=it.autoReset,V=bt.enabled,q=bt.autoUpdate,j=bt.needsUpdate,W=bt.type;N(),it.autoReset=E,bt.enabled=V,bt.autoUpdate=q,bt.needsUpdate=j,bt.type=W}function dt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Mt(E){const V=E.target;V.removeEventListener("dispose",Mt),Wt(V)}function Wt(E){se(E),nt.remove(E)}function se(E){const V=nt.get(E).programs;V!==void 0&&(V.forEach(function(q){rt.releaseProgram(q)}),E.isShaderMaterial&&rt.releaseShaderCache(E))}this.renderBufferDirect=function(E,V,q,j,W,gt){V===null&&(V=Ut);const Tt=W.isMesh&&W.matrixWorld.determinant()<0,Ct=_s(E,V,q,j,W);$.setMaterial(j,Tt);let Pt=q.index,Ft=1;if(j.wireframe===!0){if(Pt=st.getWireframeAttribute(q),Pt===void 0)return;Ft=2}const Ot=q.drawRange,Lt=q.attributes.position;let qt=Ot.start*Ft,te=(Ot.start+Ot.count)*Ft;gt!==null&&(qt=Math.max(qt,gt.start*Ft),te=Math.min(te,(gt.start+gt.count)*Ft)),Pt!==null?(qt=Math.max(qt,0),te=Math.min(te,Pt.count)):Lt!=null&&(qt=Math.max(qt,0),te=Math.min(te,Lt.count));const ee=te-qt;if(ee<0||ee===1/0)return;Zt.setup(W,j,Ct,q,Pt);let fe,Jt=Et;if(Pt!==null&&(fe=K.get(Pt),Jt=Vt,Jt.setIndex(fe)),W.isMesh)j.wireframe===!0?($.setLineWidth(j.wireframeLinewidth*$t()),Jt.setMode(T.LINES)):Jt.setMode(T.TRIANGLES);else if(W.isLine){let wt=j.linewidth;wt===void 0&&(wt=1),$.setLineWidth(wt*$t()),W.isLineSegments?Jt.setMode(T.LINES):W.isLineLoop?Jt.setMode(T.LINE_LOOP):Jt.setMode(T.LINE_STRIP)}else W.isPoints?Jt.setMode(T.POINTS):W.isSprite&&Jt.setMode(T.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)Jt.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(tt.get("WEBGL_multi_draw"))Jt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const wt=W._multiDrawStarts,We=W._multiDrawCounts,Qt=W._multiDrawCount,Ie=Pt?K.get(Pt).bytesPerElement:1,wn=nt.get(j).currentProgram.getUniforms();for(let pe=0;pe<Qt;pe++)wn.setValue(T,"_gl_DrawID",pe),Jt.render(wt[pe]/Ie,We[pe])}else if(W.isInstancedMesh)Jt.renderInstances(qt,ee,W.count);else if(q.isInstancedBufferGeometry){const wt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,We=Math.min(q.instanceCount,wt);Jt.renderInstances(qt,ee,We)}else Jt.render(qt,ee)};function Yt(E,V,q){E.transparent===!0&&E.side===Te&&E.forceSinglePass===!1?(E.side=Le,E.needsUpdate=!0,li(E,V,q),E.side=Bn,E.needsUpdate=!0,li(E,V,q),E.side=Te):li(E,V,q)}this.compile=function(E,V,q=null){q===null&&(q=E),p=zt.get(q),p.init(V),S.push(p),q.traverseVisible(function(W){W.isLight&&W.layers.test(V.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),E!==q&&E.traverseVisible(function(W){W.isLight&&W.layers.test(V.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),p.setupLights();const j=new Set;return E.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const gt=W.material;if(gt)if(Array.isArray(gt))for(let Tt=0;Tt<gt.length;Tt++){const Ct=gt[Tt];Yt(Ct,q,W),j.add(Ct)}else Yt(gt,q,W),j.add(gt)}),S.pop(),p=null,j},this.compileAsync=function(E,V,q=null){const j=this.compile(E,V,q);return new Promise(W=>{function gt(){if(j.forEach(function(Tt){nt.get(Tt).currentProgram.isReady()&&j.delete(Tt)}),j.size===0){W(E);return}setTimeout(gt,10)}tt.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let Kt=null;function ue(E){Kt&&Kt(E)}function Tn(){hn.stop()}function oi(){hn.start()}const hn=new ad;hn.setAnimationLoop(ue),typeof self<"u"&&hn.setContext(self),this.setAnimationLoop=function(E){Kt=E,U.setAnimationLoop(E),E===null?hn.stop():hn.start()},U.addEventListener("sessionstart",Tn),U.addEventListener("sessionend",oi),this.render=function(E,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),U.enabled===!0&&U.isPresenting===!0&&(U.cameraAutoUpdate===!0&&U.updateCamera(V),V=U.getCamera()),E.isScene===!0&&E.onBeforeRender(M,E,V,L),p=zt.get(E,S.length),p.init(V),S.push(p),ft.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),Z.setFromProjectionMatrix(ft),pt=this.localClippingEnabled,at=ct.init(this.clippingPlanes,pt),m=_t.get(E,x.length),m.init(),x.push(m),U.enabled===!0&&U.isPresenting===!0){const gt=M.xr.getDepthSensingMesh();gt!==null&&Xi(gt,V,-1/0,M.sortObjects)}Xi(E,V,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(et,Q),At=U.enabled===!1||U.isPresenting===!1||U.hasDepthSensing()===!1,At&&It.addToRenderList(m,E),this.info.render.frame++,at===!0&&ct.beginShadows();const q=p.state.shadowsArray;bt.render(q,E,V),at===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=m.opaque,W=m.transmissive;if(p.setupLights(),V.isArrayCamera){const gt=V.cameras;if(W.length>0)for(let Tt=0,Ct=gt.length;Tt<Ct;Tt++){const Pt=gt[Tt];fs(j,W,E,Pt)}At&&It.render(E);for(let Tt=0,Ct=gt.length;Tt<Ct;Tt++){const Pt=gt[Tt];us(m,E,Pt,Pt.viewport)}}else W.length>0&&fs(j,W,E,V),At&&It.render(E),us(m,E,V);L!==null&&(A.updateMultisampleRenderTarget(L),A.updateRenderTargetMipmap(L)),E.isScene===!0&&E.onAfterRender(M,E,V),Zt.resetDefaultState(),b=-1,y=null,S.pop(),S.length>0?(p=S[S.length-1],at===!0&&ct.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Xi(E,V,q,j){if(E.visible===!1)return;if(E.layers.test(V.layers)){if(E.isGroup)q=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(V);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Z.intersectsSprite(E)){j&&Dt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ft);const Tt=J.update(E),Ct=E.material;Ct.visible&&m.push(E,Tt,Ct,q,Dt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Z.intersectsObject(E))){const Tt=J.update(E),Ct=E.material;if(j&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Dt.copy(E.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),Dt.copy(Tt.boundingSphere.center)),Dt.applyMatrix4(E.matrixWorld).applyMatrix4(ft)),Array.isArray(Ct)){const Pt=Tt.groups;for(let Ft=0,Ot=Pt.length;Ft<Ot;Ft++){const Lt=Pt[Ft],qt=Ct[Lt.materialIndex];qt&&qt.visible&&m.push(E,Tt,qt,q,Dt.z,Lt)}}else Ct.visible&&m.push(E,Tt,Ct,q,Dt.z,null)}}const gt=E.children;for(let Tt=0,Ct=gt.length;Tt<Ct;Tt++)Xi(gt[Tt],V,q,j)}function us(E,V,q,j){const W=E.opaque,gt=E.transmissive,Tt=E.transparent;p.setupLightsView(q),at===!0&&ct.setGlobalState(M.clippingPlanes,q),j&&$.viewport(w.copy(j)),W.length>0&&ci(W,V,q),gt.length>0&&ci(gt,V,q),Tt.length>0&&ci(Tt,V,q),$.buffers.depth.setTest(!0),$.buffers.depth.setMask(!0),$.buffers.color.setMask(!0),$.setPolygonOffset(!1)}function fs(E,V,q,j){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[j.id]===void 0&&(p.state.transmissionRenderTarget[j.id]=new ai(1,1,{generateMipmaps:!0,type:tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float")?ls:An,minFilter:ni,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:jt.workingColorSpace}));const gt=p.state.transmissionRenderTarget[j.id],Tt=j.viewport||w;gt.setSize(Tt.z,Tt.w);const Ct=M.getRenderTarget();M.setRenderTarget(gt),M.getClearColor(z),G=M.getClearAlpha(),G<1&&M.setClearColor(16777215,.5),M.clear(),At&&It.render(q);const Pt=M.toneMapping;M.toneMapping=zn;const Ft=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),p.setupLightsView(j),at===!0&&ct.setGlobalState(M.clippingPlanes,j),ci(E,q,j),A.updateMultisampleRenderTarget(gt),A.updateRenderTargetMipmap(gt),tt.has("WEBGL_multisampled_render_to_texture")===!1){let Ot=!1;for(let Lt=0,qt=V.length;Lt<qt;Lt++){const te=V[Lt],ee=te.object,fe=te.geometry,Jt=te.material,wt=te.group;if(Jt.side===Te&&ee.layers.test(j.layers)){const We=Jt.side;Jt.side=Le,Jt.needsUpdate=!0,ps(ee,q,j,fe,Jt,wt),Jt.side=We,Jt.needsUpdate=!0,Ot=!0}}Ot===!0&&(A.updateMultisampleRenderTarget(gt),A.updateRenderTargetMipmap(gt))}M.setRenderTarget(Ct),M.setClearColor(z,G),Ft!==void 0&&(j.viewport=Ft),M.toneMapping=Pt}function ci(E,V,q){const j=V.isScene===!0?V.overrideMaterial:null;for(let W=0,gt=E.length;W<gt;W++){const Tt=E[W],Ct=Tt.object,Pt=Tt.geometry,Ft=j===null?Tt.material:j,Ot=Tt.group;Ct.layers.test(q.layers)&&ps(Ct,V,q,Pt,Ft,Ot)}}function ps(E,V,q,j,W,gt){E.onBeforeRender(M,V,q,j,W,gt),E.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),W.onBeforeRender(M,V,q,j,E,gt),W.transparent===!0&&W.side===Te&&W.forceSinglePass===!1?(W.side=Le,W.needsUpdate=!0,M.renderBufferDirect(q,V,j,W,E,gt),W.side=Bn,W.needsUpdate=!0,M.renderBufferDirect(q,V,j,W,E,gt),W.side=Te):M.renderBufferDirect(q,V,j,W,E,gt),E.onAfterRender(M,V,q,j,W,gt)}function li(E,V,q){V.isScene!==!0&&(V=Ut);const j=nt.get(E),W=p.state.lights,gt=p.state.shadowsArray,Tt=W.state.version,Ct=rt.getParameters(E,W.state,gt,V,q),Pt=rt.getProgramCacheKey(Ct);let Ft=j.programs;j.environment=E.isMeshStandardMaterial?V.environment:null,j.fog=V.fog,j.envMap=(E.isMeshStandardMaterial?O:v).get(E.envMap||j.environment),j.envMapRotation=j.environment!==null&&E.envMap===null?V.environmentRotation:E.envMapRotation,Ft===void 0&&(E.addEventListener("dispose",Mt),Ft=new Map,j.programs=Ft);let Ot=Ft.get(Pt);if(Ot!==void 0){if(j.currentProgram===Ot&&j.lightsStateVersion===Tt)return gs(E,Ct),Ot}else Ct.uniforms=rt.getUniforms(E),E.onBeforeCompile(Ct,M),Ot=rt.acquireProgram(Ct,Pt),Ft.set(Pt,Ot),j.uniforms=Ct.uniforms;const Lt=j.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Lt.clippingPlanes=ct.uniform),gs(E,Ct),j.needsLights=Ca(E),j.lightsStateVersion=Tt,j.needsLights&&(Lt.ambientLightColor.value=W.state.ambient,Lt.lightProbe.value=W.state.probe,Lt.directionalLights.value=W.state.directional,Lt.directionalLightShadows.value=W.state.directionalShadow,Lt.spotLights.value=W.state.spot,Lt.spotLightShadows.value=W.state.spotShadow,Lt.rectAreaLights.value=W.state.rectArea,Lt.ltc_1.value=W.state.rectAreaLTC1,Lt.ltc_2.value=W.state.rectAreaLTC2,Lt.pointLights.value=W.state.point,Lt.pointLightShadows.value=W.state.pointShadow,Lt.hemisphereLights.value=W.state.hemi,Lt.directionalShadowMap.value=W.state.directionalShadowMap,Lt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Lt.spotShadowMap.value=W.state.spotShadowMap,Lt.spotLightMatrix.value=W.state.spotLightMatrix,Lt.spotLightMap.value=W.state.spotLightMap,Lt.pointShadowMap.value=W.state.pointShadowMap,Lt.pointShadowMatrix.value=W.state.pointShadowMatrix),j.currentProgram=Ot,j.uniformsList=null,Ot}function ms(E){if(E.uniformsList===null){const V=E.currentProgram.getUniforms();E.uniformsList=aa.seqWithValue(V.seq,E.uniforms)}return E.uniformsList}function gs(E,V){const q=nt.get(E);q.outputColorSpace=V.outputColorSpace,q.batching=V.batching,q.batchingColor=V.batchingColor,q.instancing=V.instancing,q.instancingColor=V.instancingColor,q.instancingMorph=V.instancingMorph,q.skinning=V.skinning,q.morphTargets=V.morphTargets,q.morphNormals=V.morphNormals,q.morphColors=V.morphColors,q.morphTargetsCount=V.morphTargetsCount,q.numClippingPlanes=V.numClippingPlanes,q.numIntersection=V.numClipIntersection,q.vertexAlphas=V.vertexAlphas,q.vertexTangents=V.vertexTangents,q.toneMapping=V.toneMapping}function _s(E,V,q,j,W){V.isScene!==!0&&(V=Ut),A.resetTextureUnits();const gt=V.fog,Tt=j.isMeshStandardMaterial?V.environment:null,Ct=L===null?M.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Gi,Pt=(j.isMeshStandardMaterial?O:v).get(j.envMap||Tt),Ft=j.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ot=!!q.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Lt=!!q.morphAttributes.position,qt=!!q.morphAttributes.normal,te=!!q.morphAttributes.color;let ee=zn;j.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(ee=M.toneMapping);const fe=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Jt=fe!==void 0?fe.length:0,wt=nt.get(j),We=p.state.lights;if(at===!0&&(pt===!0||E!==y)){const ke=E===y&&j.id===b;ct.setState(j,E,ke)}let Qt=!1;j.version===wt.__version?(wt.needsLights&&wt.lightsStateVersion!==We.state.version||wt.outputColorSpace!==Ct||W.isBatchedMesh&&wt.batching===!1||!W.isBatchedMesh&&wt.batching===!0||W.isBatchedMesh&&wt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&wt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&wt.instancing===!1||!W.isInstancedMesh&&wt.instancing===!0||W.isSkinnedMesh&&wt.skinning===!1||!W.isSkinnedMesh&&wt.skinning===!0||W.isInstancedMesh&&wt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&wt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&wt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&wt.instancingMorph===!1&&W.morphTexture!==null||wt.envMap!==Pt||j.fog===!0&&wt.fog!==gt||wt.numClippingPlanes!==void 0&&(wt.numClippingPlanes!==ct.numPlanes||wt.numIntersection!==ct.numIntersection)||wt.vertexAlphas!==Ft||wt.vertexTangents!==Ot||wt.morphTargets!==Lt||wt.morphNormals!==qt||wt.morphColors!==te||wt.toneMapping!==ee||wt.morphTargetsCount!==Jt)&&(Qt=!0):(Qt=!0,wt.__version=j.version);let Ie=wt.currentProgram;Qt===!0&&(Ie=li(j,V,W));let wn=!1,pe=!1,Gn=!1;const ae=Ie.getUniforms(),Ue=wt.uniforms;if($.useProgram(Ie.program)&&(wn=!0,pe=!0,Gn=!0),j.id!==b&&(b=j.id,pe=!0),wn||y!==E){$.buffers.depth.getReversed()?(ut.copy(E.projectionMatrix),lf(ut),df(ut),ae.setValue(T,"projectionMatrix",ut)):ae.setValue(T,"projectionMatrix",E.projectionMatrix),ae.setValue(T,"viewMatrix",E.matrixWorldInverse);const Ke=ae.map.cameraPosition;Ke!==void 0&&Ke.setValue(T,Rt.setFromMatrixPosition(E.matrixWorld)),vt.logarithmicDepthBuffer&&ae.setValue(T,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&ae.setValue(T,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,pe=!0,Gn=!0)}if(W.isSkinnedMesh){ae.setOptional(T,W,"bindMatrix"),ae.setOptional(T,W,"bindMatrixInverse");const ke=W.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),ae.setValue(T,"boneTexture",ke.boneTexture,A))}W.isBatchedMesh&&(ae.setOptional(T,W,"batchingTexture"),ae.setValue(T,"batchingTexture",W._matricesTexture,A),ae.setOptional(T,W,"batchingIdTexture"),ae.setValue(T,"batchingIdTexture",W._indirectTexture,A),ae.setOptional(T,W,"batchingColorTexture"),W._colorsTexture!==null&&ae.setValue(T,"batchingColorTexture",W._colorsTexture,A));const Rn=q.morphAttributes;if((Rn.position!==void 0||Rn.normal!==void 0||Rn.color!==void 0)&&kt.update(W,q,Ie),(pe||wt.receiveShadow!==W.receiveShadow)&&(wt.receiveShadow=W.receiveShadow,ae.setValue(T,"receiveShadow",W.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(Ue.envMap.value=Pt,Ue.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&V.environment!==null&&(Ue.envMapIntensity.value=V.environmentIntensity),pe&&(ae.setValue(T,"toneMappingExposure",M.toneMappingExposure),wt.needsLights&&xs(Ue,Gn),gt&&j.fog===!0&&ht.refreshFogUniforms(Ue,gt),ht.refreshMaterialUniforms(Ue,j,Y,B,p.state.transmissionRenderTarget[E.id]),aa.upload(T,ms(wt),Ue,A)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(aa.upload(T,ms(wt),Ue,A),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&ae.setValue(T,"center",W.center),ae.setValue(T,"modelViewMatrix",W.modelViewMatrix),ae.setValue(T,"normalMatrix",W.normalMatrix),ae.setValue(T,"modelMatrix",W.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const ke=j.uniformsGroups;for(let Ke=0,Je=ke.length;Ke<Je;Ke++){const $i=ke[Ke];F.update($i,Ie),F.bind($i,Ie)}}return Ie}function xs(E,V){E.ambientLightColor.needsUpdate=V,E.lightProbe.needsUpdate=V,E.directionalLights.needsUpdate=V,E.directionalLightShadows.needsUpdate=V,E.pointLights.needsUpdate=V,E.pointLightShadows.needsUpdate=V,E.spotLights.needsUpdate=V,E.spotLightShadows.needsUpdate=V,E.rectAreaLights.needsUpdate=V,E.hemisphereLights.needsUpdate=V}function Ca(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(E,V,q){nt.get(E.texture).__webglTexture=V,nt.get(E.depthTexture).__webglTexture=q;const j=nt.get(E);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=q===void 0,j.__autoAllocateDepthBuffer||tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,V){const q=nt.get(E);q.__webglFramebuffer=V,q.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(E,V=0,q=0){L=E,P=V,R=q;let j=!0,W=null,gt=!1,Tt=!1;if(E){const Pt=nt.get(E);if(Pt.__useDefaultFramebuffer!==void 0)$.bindFramebuffer(T.FRAMEBUFFER,null),j=!1;else if(Pt.__webglFramebuffer===void 0)A.setupRenderTarget(E);else if(Pt.__hasExternalTextures)A.rebindTextures(E,nt.get(E.texture).__webglTexture,nt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Lt=E.depthTexture;if(Pt.__boundDepthTexture!==Lt){if(Lt!==null&&nt.has(Lt)&&(E.width!==Lt.image.width||E.height!==Lt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(E)}}const Ft=E.texture;(Ft.isData3DTexture||Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)&&(Tt=!0);const Ot=nt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ot[V])?W=Ot[V][q]:W=Ot[V],gt=!0):E.samples>0&&A.useMultisampledRTT(E)===!1?W=nt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ot)?W=Ot[q]:W=Ot,w.copy(E.viewport),C.copy(E.scissor),D=E.scissorTest}else w.copy(lt).multiplyScalar(Y).floor(),C.copy(St).multiplyScalar(Y).floor(),D=xt;if($.bindFramebuffer(T.FRAMEBUFFER,W)&&j&&$.drawBuffers(E,W),$.viewport(w),$.scissor(C),$.setScissorTest(D),gt){const Pt=nt.get(E.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_CUBE_MAP_POSITIVE_X+V,Pt.__webglTexture,q)}else if(Tt){const Pt=nt.get(E.texture),Ft=V||0;T.framebufferTextureLayer(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,Pt.__webglTexture,q||0,Ft)}b=-1},this.readRenderTargetPixels=function(E,V,q,j,W,gt,Tt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=nt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Tt!==void 0&&(Ct=Ct[Tt]),Ct){$.bindFramebuffer(T.FRAMEBUFFER,Ct);try{const Pt=E.texture,Ft=Pt.format,Ot=Pt.type;if(!vt.textureFormatReadable(Ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!vt.textureTypeReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=E.width-j&&q>=0&&q<=E.height-W&&T.readPixels(V,q,j,W,Nt.convert(Ft),Nt.convert(Ot),gt)}finally{const Pt=L!==null?nt.get(L).__webglFramebuffer:null;$.bindFramebuffer(T.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(E,V,q,j,W,gt,Tt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=nt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Tt!==void 0&&(Ct=Ct[Tt]),Ct){const Pt=E.texture,Ft=Pt.format,Ot=Pt.type;if(!vt.textureFormatReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!vt.textureTypeReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(V>=0&&V<=E.width-j&&q>=0&&q<=E.height-W){$.bindFramebuffer(T.FRAMEBUFFER,Ct);const Lt=T.createBuffer();T.bindBuffer(T.PIXEL_PACK_BUFFER,Lt),T.bufferData(T.PIXEL_PACK_BUFFER,gt.byteLength,T.STREAM_READ),T.readPixels(V,q,j,W,Nt.convert(Ft),Nt.convert(Ot),0);const qt=L!==null?nt.get(L).__webglFramebuffer:null;$.bindFramebuffer(T.FRAMEBUFFER,qt);const te=T.fenceSync(T.SYNC_GPU_COMMANDS_COMPLETE,0);return T.flush(),await cf(T,te,4),T.bindBuffer(T.PIXEL_PACK_BUFFER,Lt),T.getBufferSubData(T.PIXEL_PACK_BUFFER,0,gt),T.deleteBuffer(Lt),T.deleteSync(te),gt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,V=null,q=0){E.isTexture!==!0&&(ns("WebGLRenderer: copyFramebufferToTexture function signature has changed."),V=arguments[0]||null,E=arguments[1]);const j=Math.pow(2,-q),W=Math.floor(E.image.width*j),gt=Math.floor(E.image.height*j),Tt=V!==null?V.x:0,Ct=V!==null?V.y:0;A.setTexture2D(E,0),T.copyTexSubImage2D(T.TEXTURE_2D,q,0,0,Tt,Ct,W,gt),$.unbindTexture()},this.copyTextureToTexture=function(E,V,q=null,j=null,W=0){E.isTexture!==!0&&(ns("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,E=arguments[1],V=arguments[2],W=arguments[3]||0,q=null);let gt,Tt,Ct,Pt,Ft,Ot,Lt,qt,te;const ee=E.isCompressedTexture?E.mipmaps[W]:E.image;q!==null?(gt=q.max.x-q.min.x,Tt=q.max.y-q.min.y,Ct=q.isBox3?q.max.z-q.min.z:1,Pt=q.min.x,Ft=q.min.y,Ot=q.isBox3?q.min.z:0):(gt=ee.width,Tt=ee.height,Ct=ee.depth||1,Pt=0,Ft=0,Ot=0),j!==null?(Lt=j.x,qt=j.y,te=j.z):(Lt=0,qt=0,te=0);const fe=Nt.convert(V.format),Jt=Nt.convert(V.type);let wt;V.isData3DTexture?(A.setTexture3D(V,0),wt=T.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(A.setTexture2DArray(V,0),wt=T.TEXTURE_2D_ARRAY):(A.setTexture2D(V,0),wt=T.TEXTURE_2D),T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,V.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,V.unpackAlignment);const We=T.getParameter(T.UNPACK_ROW_LENGTH),Qt=T.getParameter(T.UNPACK_IMAGE_HEIGHT),Ie=T.getParameter(T.UNPACK_SKIP_PIXELS),wn=T.getParameter(T.UNPACK_SKIP_ROWS),pe=T.getParameter(T.UNPACK_SKIP_IMAGES);T.pixelStorei(T.UNPACK_ROW_LENGTH,ee.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,ee.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Pt),T.pixelStorei(T.UNPACK_SKIP_ROWS,Ft),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Ot);const Gn=E.isDataArrayTexture||E.isData3DTexture,ae=V.isDataArrayTexture||V.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const Ue=nt.get(E),Rn=nt.get(V),ke=nt.get(Ue.__renderTarget),Ke=nt.get(Rn.__renderTarget);$.bindFramebuffer(T.READ_FRAMEBUFFER,ke.__webglFramebuffer),$.bindFramebuffer(T.DRAW_FRAMEBUFFER,Ke.__webglFramebuffer);for(let Je=0;Je<Ct;Je++)Gn&&T.framebufferTextureLayer(T.READ_FRAMEBUFFER,T.COLOR_ATTACHMENT0,nt.get(E).__webglTexture,W,Ot+Je),E.isDepthTexture?(ae&&T.framebufferTextureLayer(T.DRAW_FRAMEBUFFER,T.COLOR_ATTACHMENT0,nt.get(V).__webglTexture,W,te+Je),T.blitFramebuffer(Pt,Ft,gt,Tt,Lt,qt,gt,Tt,T.DEPTH_BUFFER_BIT,T.NEAREST)):ae?T.copyTexSubImage3D(wt,W,Lt,qt,te+Je,Pt,Ft,gt,Tt):T.copyTexSubImage2D(wt,W,Lt,qt,te+Je,Pt,Ft,gt,Tt);$.bindFramebuffer(T.READ_FRAMEBUFFER,null),$.bindFramebuffer(T.DRAW_FRAMEBUFFER,null)}else ae?E.isDataTexture||E.isData3DTexture?T.texSubImage3D(wt,W,Lt,qt,te,gt,Tt,Ct,fe,Jt,ee.data):V.isCompressedArrayTexture?T.compressedTexSubImage3D(wt,W,Lt,qt,te,gt,Tt,Ct,fe,ee.data):T.texSubImage3D(wt,W,Lt,qt,te,gt,Tt,Ct,fe,Jt,ee):E.isDataTexture?T.texSubImage2D(T.TEXTURE_2D,W,Lt,qt,gt,Tt,fe,Jt,ee.data):E.isCompressedTexture?T.compressedTexSubImage2D(T.TEXTURE_2D,W,Lt,qt,ee.width,ee.height,fe,ee.data):T.texSubImage2D(T.TEXTURE_2D,W,Lt,qt,gt,Tt,fe,Jt,ee);T.pixelStorei(T.UNPACK_ROW_LENGTH,We),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Qt),T.pixelStorei(T.UNPACK_SKIP_PIXELS,Ie),T.pixelStorei(T.UNPACK_SKIP_ROWS,wn),T.pixelStorei(T.UNPACK_SKIP_IMAGES,pe),W===0&&V.generateMipmaps&&T.generateMipmap(wt),$.unbindTexture()},this.copyTextureToTexture3D=function(E,V,q=null,j=null,W=0){return E.isTexture!==!0&&(ns("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,j=arguments[1]||null,E=arguments[2],V=arguments[3],W=arguments[4]||0),ns('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,V,q,j,W)},this.initRenderTarget=function(E){nt.get(E).__webglFramebuffer===void 0&&A.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?A.setTextureCube(E,0):E.isData3DTexture?A.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?A.setTexture2DArray(E,0):A.setTexture2D(E,0),$.unbindTexture()},this.resetState=function(){P=0,R=0,L=null,$.reset(),Zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=jt._getDrawingBufferColorSpace(t),e.unpackColorSpace=jt._getUnpackColorSpace()}}class M_ extends de{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class y_{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=yo,this.updateRanges=[],this.version=0,this.uuid=On()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=On()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=On()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const be=new X;class xa{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=an(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=an(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=an(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=an(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=an(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),a=ie(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new je(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new xa(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ud extends ri{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let wi;const Ki=new X,Ri=new X,Ci=new X,Pi=new Ht,Ji=new Ht,fd=new oe,Vs=new X,Qi=new X,Ws=new X,dl=new Ht,gr=new Ht,hl=new Ht;class S_ extends de{constructor(t=new ud){if(super(),this.isSprite=!0,this.type="Sprite",wi===void 0){wi=new De;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new y_(e,5);wi.setIndex([0,1,2,0,2,3]),wi.setAttribute("position",new xa(n,3,0,!1)),wi.setAttribute("uv",new xa(n,2,3,!1))}this.geometry=wi,this.material=t,this.center=new Ht(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ri.setFromMatrixScale(this.matrixWorld),fd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ci.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ri.multiplyScalar(-Ci.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;Xs(Vs.set(-.5,-.5,0),Ci,r,Ri,s,a),Xs(Qi.set(.5,-.5,0),Ci,r,Ri,s,a),Xs(Ws.set(.5,.5,0),Ci,r,Ri,s,a),dl.set(0,0),gr.set(1,0),hl.set(1,1);let o=t.ray.intersectTriangle(Vs,Qi,Ws,!1,Ki);if(o===null&&(Xs(Qi.set(-.5,.5,0),Ci,r,Ri,s,a),gr.set(0,1),o=t.ray.intersectTriangle(Vs,Ws,Qi,!1,Ki),o===null))return;const c=t.ray.origin.distanceTo(Ki);c<t.near||c>t.far||e.push({distance:c,point:Ki.clone(),uv:ze.getInterpolation(Ki,Vs,Qi,Ws,dl,gr,hl,new Ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Xs(i,t,e,n,s,a){Pi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Ji.x=a*Pi.x-s*Pi.y,Ji.y=s*Pi.x+a*Pi.y):Ji.copy(Pi),i.copy(t),i.x+=Ji.x,i.y+=Ji.y,i.applyMatrix4(fd)}class $o extends ri{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const va=new X,Ma=new X,ul=new oe,ts=new Go,$s=new Aa,_r=new X,fl=new X;class b_ extends de{constructor(t=new De,e=new $o){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,a=e.count;s<a;s++)va.fromBufferAttribute(e,s-1),Ma.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=va.distanceTo(Ma);t.setAttribute("lineDistance",new he(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$s.copy(n.boundingSphere),$s.applyMatrix4(s),$s.radius+=a,t.ray.intersectsSphere($s)===!1)return;ul.copy(s).invert(),ts.copy(t.ray).applyMatrix4(ul);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let _=d,m=g-1;_<m;_+=l){const p=h.getX(_),x=h.getX(_+1),S=Ys(this,t,ts,c,p,x);S&&e.push(S)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(d),p=Ys(this,t,ts,c,_,m);p&&e.push(p)}}else{const d=Math.max(0,r.start),g=Math.min(f.count,r.start+r.count);for(let _=d,m=g-1;_<m;_+=l){const p=Ys(this,t,ts,c,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=Ys(this,t,ts,c,g-1,d);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Ys(i,t,e,n,s,a){const r=i.geometry.attributes.position;if(va.fromBufferAttribute(r,s),Ma.fromBufferAttribute(r,a),e.distanceSqToSegment(va,Ma,_r,fl)>n)return;_r.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(_r);if(!(c<t.near||c>t.far))return{distance:c,point:fl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const pl=new X,ml=new X;class pd extends b_{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,a=e.count;s<a;s+=2)pl.fromBufferAttribute(e,s),ml.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+pl.distanceTo(ml);t.setAttribute("lineDistance",new he(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class E_ extends Re{constructor(t,e,n,s,a,r,o,c,l){super(t,e,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Yo extends De{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const a=[],r=[];o(s),l(n),h(),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(a.slice(),3)),this.setAttribute("uv",new he(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const S=new X,M=new X,I=new X;for(let P=0;P<e.length;P+=3)d(e[P+0],S),d(e[P+1],M),d(e[P+2],I),c(S,M,I,x)}function c(x,S,M,I){const P=I+1,R=[];for(let L=0;L<=P;L++){R[L]=[];const b=x.clone().lerp(M,L/P),y=S.clone().lerp(M,L/P),w=P-L;for(let C=0;C<=w;C++)C===0&&L===P?R[L][C]=b:R[L][C]=b.clone().lerp(y,C/w)}for(let L=0;L<P;L++)for(let b=0;b<2*(P-L)-1;b++){const y=Math.floor(b/2);b%2===0?(f(R[L][y+1]),f(R[L+1][y]),f(R[L][y])):(f(R[L][y+1]),f(R[L+1][y+1]),f(R[L+1][y]))}}function l(x){const S=new X;for(let M=0;M<a.length;M+=3)S.x=a[M+0],S.y=a[M+1],S.z=a[M+2],S.normalize().multiplyScalar(x),a[M+0]=S.x,a[M+1]=S.y,a[M+2]=S.z}function h(){const x=new X;for(let S=0;S<a.length;S+=3){x.x=a[S+0],x.y=a[S+1],x.z=a[S+2];const M=m(x)/2/Math.PI+.5,I=p(x)/Math.PI+.5;r.push(M,1-I)}g(),u()}function u(){for(let x=0;x<r.length;x+=6){const S=r[x+0],M=r[x+2],I=r[x+4],P=Math.max(S,M,I),R=Math.min(S,M,I);P>.9&&R<.1&&(S<.2&&(r[x+0]+=1),M<.2&&(r[x+2]+=1),I<.2&&(r[x+4]+=1))}}function f(x){a.push(x.x,x.y,x.z)}function d(x,S){const M=x*3;S.x=t[M+0],S.y=t[M+1],S.z=t[M+2]}function g(){const x=new X,S=new X,M=new X,I=new X,P=new Ht,R=new Ht,L=new Ht;for(let b=0,y=0;b<a.length;b+=9,y+=6){x.set(a[b+0],a[b+1],a[b+2]),S.set(a[b+3],a[b+4],a[b+5]),M.set(a[b+6],a[b+7],a[b+8]),P.set(r[y+0],r[y+1]),R.set(r[y+2],r[y+3]),L.set(r[y+4],r[y+5]),I.copy(x).add(S).add(M).divideScalar(3);const w=m(I);_(P,y+0,x,w),_(R,y+2,S,w),_(L,y+4,M,w)}}function _(x,S,M,I){I<0&&x.x===1&&(r[S]=x.x-1),M.x===0&&M.z===0&&(r[S]=I/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yo(t.vertices,t.indices,t.radius,t.details)}}const Zs=new X,qs=new X,xr=new X,js=new ze;class A_ extends De{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(sa*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],h=["a","b","c"],u=new Array(3),f={},d=[];for(let g=0;g<c;g+=3){r?(l[0]=r.getX(g),l[1]=r.getX(g+1),l[2]=r.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:p}=js;if(_.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),p.fromBufferAttribute(o,l[2]),js.getNormal(xr),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let x=0;x<3;x++){const S=(x+1)%3,M=u[x],I=u[S],P=js[h[x]],R=js[h[S]],L=`${M}_${I}`,b=`${I}_${M}`;b in f&&f[b]?(xr.dot(f[b].normal)<=a&&(d.push(P.x,P.y,P.z),d.push(R.x,R.y,R.z)),f[b]=null):L in f||(f[L]={index0:l[x],index1:l[S],normal:xr.clone()})}}for(const g in f)if(f[g]){const{index0:_,index1:m}=f[g];Zs.fromBufferAttribute(o,_),qs.fromBufferAttribute(o,m),d.push(Zs.x,Zs.y,Zs.z),d.push(qs.x,qs.y,qs.z)}this.setAttribute("position",new he(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Zo extends Yo{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Zo(t.radius,t.detail)}}class Di extends De{constructor(t=.5,e=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let u=t;const f=(e-t)/s,d=new X,g=new Ht;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const p=a+m/n*r;d.x=u*Math.cos(p),d.y=u*Math.sin(p),c.push(d.x,d.y,d.z),l.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,h.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){const m=_*(n+1);for(let p=0;p<n;p++){const x=p+m,S=x,M=x+n+1,I=x+n+2,P=x+1;o.push(S,M,P),o.push(M,I,P)}}this.setIndex(o),this.setAttribute("position",new he(c,3)),this.setAttribute("normal",new he(l,3)),this.setAttribute("uv",new he(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Di(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ra extends De{constructor(t=1,e=.4,n=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:a},n=Math.floor(n),s=Math.floor(s);const r=[],o=[],c=[],l=[],h=new X,u=new X,f=new X;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const _=g/s*a,m=d/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const _=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,x=(s+1)*d+g;r.push(_,m,x),r.push(m,p,x)}this.setIndex(r),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ra(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class cs extends ri{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zl,this.normalScale=new Ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=ko,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class md extends de{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class T_ extends md{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const vr=new oe,gl=new X,_l=new X;class w_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ht(512,512),this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Wo,this._frameExtents=new Ht(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;gl.setFromMatrixPosition(t.matrixWorld),e.position.copy(gl),_l.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(_l),e.updateMatrixWorld(),vr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(vr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class R_ extends w_{constructor(){super(new rd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class C_ extends md{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.target=new de,this.shadow=new R_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const xl=new oe;class P_{constructor(t,e,n=0,s=1/0){this.ray=new Go(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Vo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return xl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(xl),this}intersectObject(t,e=!0,n=[]){return Eo(t,this,n,e),n.sort(vl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,a=t.length;s<a;s++)Eo(t[s],this,n,e);return n.sort(vl),n}}function vl(i,t){return i.distance-t.distance}function Eo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const a=i.children;for(let r=0,o=a.length;r<o;r++)Eo(a[r],t,e,!0)}}class L_ extends pd{constructor(t=10,e=10,n=4473924,s=8947848){n=new Bt(n),s=new Bt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let f=0,d=0,g=-o;f<=e;f++,g+=r){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=f===a?n:s;_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3}const h=new De;h.setAttribute("position",new he(c,3)),h.setAttribute("color",new he(l,3));const u=new $o({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Uo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Uo);const D_={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function I_(i,t,e,n){const s=new He(i.fov,n,.1,200),a=new X,r=new X,o=new X;let c=!1,l=i.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1;function f(){const d=(i.pitchDeg+h.pitchDelta)*Math.PI/180,g=i.yawDeg*Math.PI/180;o.set(Math.sin(g)*Math.cos(d),Math.sin(d),Math.cos(g)*Math.cos(d)).multiplyScalar(i.distance*h.distanceScale*h.zoom)}return f(),{camera:s,update(d,g,_,m,p=D_){const x=g+.6;if(!c)a.set(d,x,_),c=!0;else{const I=1-Math.exp(-Math.max(i.smoothing,.001)*m);a.x+=(d-a.x)*I,a.y+=(x-a.y)*I,a.z+=(_-a.z)*I}const S=1-Math.exp(-Math.max(t.smoothing,.001)*m);h.distanceScale+=(p.distanceScale-h.distanceScale)*S,h.offsetX+=(p.offsetX-h.offsetX)*S,h.offsetZ+=(p.offsetZ-h.offsetZ)*S,h.pitchDelta+=(p.pitchDelta-h.pitchDelta)*S;const M=1-Math.exp(-Math.max(e.smoothing,.001)*m);h.zoom+=(u-h.zoom)*M,f(),(s.fov!==l||s.fov!==i.fov)&&(s.fov=i.fov,l=i.fov,s.updateProjectionMatrix()),r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(d){s.aspect=d,s.updateProjectionMatrix()},getGroundBasis(){const d=new X().setFromMatrixColumn(s.matrixWorld,0),g=new X().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(d.x,d.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:d.x/_,rightZ:d.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(d){u=Number.isFinite(d)&&d>0?d:1},smart(){return{...h}}}}const Ks=Math.PI*2,es=1e-6;function U_(i,t,e){return i<t?t:i>e?e:i}function k_(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function F_(i){if(i<=Math.PI)return 1-2*i/Math.PI;const t=(i-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function N_(i,t){const e=Math.cos(i),n=t<=0?0:t>=1?1:t;if(n===0)return e;const s=F_(i);return n===1?s:e+(s-e)*n}function Ml(i){return(1-Math.sin(i))/2}function gd(i,t){if(!i.grounded||i.speed<es)return k_();const e=i.speed/Math.max(i.moveSpeed,es),n=Math.max(i.legLength,es),s=i.stride>es?i.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*n,a=Math.min(t.maxAmp,s/n),r=n*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(i.localForward),c=Math.abs(i.localRight),l=o+c+es,h=o/l,u=c/l,f=i.localForward>=0?1:-1,d=i.localRight>=0?1:-1,g=s,_=D=>Math.asin(U_(D,-r,r)/n);function m(D,z){const G=N_(D,t.plantLock),k=Ml(D),B=f*h*g*G,Y=-_(B),et=z*d>0?1:-1,Q=1+et*t.crossStep*.45,lt=d*et*t.crossStep*g*.4*k,St=d*u*g*t.sideWeight*Q*G+lt*u,xt=_(St),Z=t.kneeLift*k*a*(.55+.25*h+(et>0?.2*u:0));return{pitchX:Y,rollZ:xt,kneeX:Z}}const p=(i.phase%Ks+Ks)%Ks,x=m(p,-1),S=m((p+Math.PI)%Ks,1),M=Math.cos(p),I=Ml(p),P=-t.comSway*a*M*(.6*h+.8*u)-d*t.comSway*a*u*.45,R=t.comBob*I*a,L=d*t.hipLean*a*u*M*.6,b=d*t.hipLean*a*u*(.45+.25*M),y=t.armSwing*a*M*(h*f+.3*u),w=y,C=-y;return{legL:x,legR:S,pelvisX:P,pelvisY:R,pelvisRoll:L,sideLean:b,armL:w,armR:C,strafe:u,backward:f<0?h:0}}function we(i){return i<0?0:i>1?1:i}const z_=Math.PI*2;function O_(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function B_(i,t,e,n,s){const a=we(n);if(a<=0)return i;const r=we(t),o=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),l=e%2===0?1:-1,h=we(s.forwardBias),u={speed:c,phase:i.phase+r*z_*o,localForward:c*h,localRight:c*(1-h)*l};return{speed:i.speed+(u.speed-i.speed)*a,phase:i.phase+(u.phase-i.phase)*a,localForward:i.localForward+(u.localForward-i.localForward)*a,localRight:i.localRight+(u.localRight-i.localRight)*a}}function H_(i,t,e){const n=O_(),s=we(i),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return n;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,h=e.stepKnee*a,u=e.stepSide*a;return n.legL.pitchX=o?-l:l*.55,n.legR.pitchX=c?-l:l*.55,n.legL.kneeX=o?h:h*.4,n.legR.kneeX=c?h:h*.4,n.legL.rollZ=-u*r,n.legR.rollZ=u*r,n.pelvisX=e.stepSway*a*r,n.pelvisY=-e.stepDip*a,n.pelvisRoll=u*.25*r,n}function _d(i,t){if(i<=0||i>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return i<e?Math.sin(Math.PI/2*(i/e)):Math.cos(Math.PI/2*((i-e)/(1-e)))}function yl(i,t,e,n,s){if(e<=0||n<=0)return 0;const a=(i-t)/e;return a<0||a>=1?0:n*_d(a,s)}function G_(i,t,e,n){const s=t?1:0,a=1-Math.exp(-Math.max(0,n)*Math.max(0,e)),r=i+(s-i)*a;return t&&r>.999?1:!t&&r<.001?0:r}function V_(i,t,e){const n=we(i);return{gaitScale:1-n*(1-we(t)),attackLegWeight:we(e)*n}}function W_(i,t){const e=we(t);return e===1?i:{legL:{pitchX:i.legL.pitchX*e,rollZ:i.legL.rollZ*e,kneeX:i.legL.kneeX*e},legR:{pitchX:i.legR.pitchX*e,rollZ:i.legR.rollZ*e,kneeX:i.legR.kneeX*e},pelvisX:i.pelvisX*e,pelvisY:i.pelvisY*e,pelvisRoll:i.pelvisRoll*e,sideLean:i.sideLean*e,armL:i.armL*e,armR:i.armR*e,strafe:i.strafe,backward:i.backward}}function X_(i,t){const e=Math.min(1,Math.abs(i)/Math.max(t.impactSpeed,1e-6));return we(t.minScale+(1-t.minScale)*e)}function $_(){return xd()}function xd(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function Y_(i,t){return i.type==="light"?Math.max(0,t.leanLight):i.type==="heavy"?Math.max(0,t.leanHeavy):i.type==="knock"?Math.max(0,t.leanKnock):0}function Z_(i,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?we(t.forceHitHeight):i.type==="light"?we(t.hitHeight.light):i.type==="heavy"?we(t.hitHeight.heavy):i.type==="knock"?we(t.hitHeight.knock):0}function q_(i,t,e){const n=we(e),s=(a,r)=>a+(r-a)*n;return{upperPitch:s(i.upperPitch,t.upperPitch),upperRoll:s(i.upperRoll,t.upperRoll),upperYaw:s(i.upperYaw,t.upperYaw),fold:s(i.fold,t.fold),shift:s(i.shift,t.shift),drop:s(i.drop,t.drop),back:s(i.back,t.back),knee:s(i.knee,t.knee),hip:s(i.hip,t.hip),arm:s(i.arm,t.arm)}}function vd(i,t,e){const n=xd(),s=Y_(i,e);if(n.intensity=s,s<=0||i.duration<=0||!Number.isFinite(i.timer))return n;const a=we(1-i.timer/i.duration),r=_d(a,e.pulseRatio);n.pulse=r,n.active=r>0,n.hitHeight=Z_(i,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),u=i.dirX*o+i.dirZ*c,f=i.dirX*l+i.dirZ*h;if(n.localFwd=u,n.localRight=f,!e.enabled){n.legacy=!0;const _=Math.sin(Math.PI*a);return n.upperPitch=s*_*u,n.upperRoll=-s*_*f*.7,n.drop=(s>.5?.09:.04)*_,n.flash=e.flashStrength*_,n.active=_>0,n}const d=s*r,g=q_(e.abdomen,e.shoulder,n.hitHeight);return n.upperPitch=d*(g.upperPitch*u+g.fold),n.upperRoll=-d*g.upperRoll*f,n.upperYaw=d*g.upperYaw*f,n.upperShift=d*g.shift,n.upperShiftX=n.upperShift*f,n.upperShiftZ=n.upperShift*u,n.comShift=d*e.comShift,n.comX=n.comShift*f,n.comZ=n.comShift*u,n.pelvisBack=d*g.back,n.drop=d*g.drop,n.knee=d*g.knee,n.hip=d*g.hip,n.arm=d*g.arm,n.flash=e.flashStrength*r,n}function Md(i,t){const e=Math.max(0,t.pelvisTiltGain),n=Math.max(0,t.pelvisShift),s=Number.isFinite(i.leanForward)?i.leanForward:0,a=Number.isFinite(i.leanSide)?i.leanSide:0,r=Number.isFinite(i.speedRatio)?Math.max(0,Math.min(1,i.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*n,pelvisZ:s*n,crouch:Math.max(0,t.moveCrouch)*r}}const jn=1e-6;function ss(i,t,e){return i<t?t:i>e?e:i}function j_(i,t,e,n=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=jn||a<=jn||!Number.isFinite(i.x)||!Number.isFinite(i.y)||!Number.isFinite(i.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+jn,l=Math.hypot(i.x,i.y,i.z);if(l<=jn)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(i.x,-i.y),u=Math.hypot(i.x,i.y),f=i.z,d=Math.hypot(f,u),g=ss(d,c,o),_=d>o+jn||d<c-jn,m=Math.atan2(-f,Math.max(u,jn)),p=ss((s*s+g*g-a*a)/(2*s*g),-1,1),x=ss((a*a+g*g-s*s)/(2*a*g),-1,1),S=Math.acos(p),M=Math.acos(x),I=n>=0?1:-1;return{rootPitch:m-I*S,rootRoll:h,jointPitch:I*(S+M),clamped:_,reach:l/o}}function K_(i,t,e,n){const s=ss(e,0,1),a=Math.max(0,n),r=(o,c)=>{const l=ss((c-o)*s,-a,a);return o+l};return{rootPitch:r(i.rootPitch,t.rootPitch),rootRoll:r(i.rootRoll,t.rootRoll),jointPitch:r(i.jointPitch,t.jointPitch)}}function yd(i,t){return{pelvisPos:i.position.clone(),pelvisRotX:i.rotation.x,pelvisRotZ:i.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const qo={active:!1,weight:0,clamped:0,maxError:0};function Sd(i){const{root:t,pelvis:e,lower:n,limbs:s,base:a,cfg:r}=i;if(!r.enabled||r.weight<=0||!i.grounded||s.length===0)return{...qo};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:n.position.clone(),lowerRotZ:n.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,n.position.copy(a.lowerPos),n.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(d=>d.tip.getWorldPosition(new X));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,n.position.copy(o.lowerPos),n.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),n.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(i.attacking?Math.max(0,Math.min(1,r.attackScale)):1),h=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let u=0;for(let d=0;d<s.length;d++){const g=s[d],_=n.worldToLocal(c[d].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=j_(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(u+=1);const x=K_({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,l,h);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let f=0;for(let d=0;d<s.length;d++){const g=s[d].tip.getWorldPosition(new X);f=Math.max(f,g.distanceTo(c[d]))}return{active:!0,weight:l,clamped:u,maxError:f}}function vn(i,t,e){return i<t?t:i>e?e:i}const J_={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function Q_(i,t,e,n,s,a,r,o,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new Me,f=new Me;f.name="pelvis",f.position.y=i.legLength,u.add(f);const d=new Me;d.name="lower";const g=new Me;g.name="upper",f.add(d),f.add(g);const _=[],m=(tt,vt,$,it)=>{const nt=new cs({color:it}),A=new re(new dn(tt,vt,$),nt);return A.castShadow=!0,A.receiveShadow=!0,_.push(nt),A},p=i.headSize,x=i.legLength,S=i.armLength,M=i.limbThickness,I=i.bodyHeight,P=i.bodyWidth,R=m(P,I,.28,e);R.position.y=I/2,g.add(R);const L=new Me;L.position.y=I,g.add(L);const b=m(p,p,p,e);b.position.y=p/2,L.add(b);for(const tt of[-1,1]){const vt=m(.06,.07,.02,t.shoe);vt.position.set(tt*.09,p/2+.03,p/2+.011),L.add(vt)}const y=(tt,vt)=>{const $=vt?S:x,it=new Me;it.name=vt?tt<0?"shoulderL":"shoulderR":tt<0?"hipL":"hipR",vt||(it.rotation.order="ZYX"),it.position.set(tt*(vt?P/2+M/2:P/2-M/2),vt?I-.04:0,0),(vt?g:d).add(it);const nt=m(M,$/2,M,t.limb);nt.position.y=-$/4,it.add(nt);const A=new Me;A.name=vt?"elbow":"knee",A.position.y=-$/2,it.add(A);const v=m(M,$/2,M,t.limb);if(v.position.y=-$/4,A.add(v),!vt){const O=m(M*1.15,.07,M*1.7,t.shoe);O.position.set(0,-$/2+.035,.045),A.add(O);const K=new de;return K.name="footTip",K.position.y=-$/2,A.add(K),{root:it,joint:A,tip:K}}return{root:it,joint:A}},w=y(-1,!1),C=y(1,!1),D=y(-1,!0),z=y(1,!0),G=[w,C].map(tt=>({root:tt.root,joint:tt.joint,tip:tt.tip,upperLen:x/2,lowerLen:x/2,bend:1})),k=new nn({color:s.attackArcColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),B=new re(new Ra(.62,.042,6,20,Math.PI*1.1),k);B.position.set(0,.78-x,.56),g.add(B);const Y=document.createElement("canvas");Y.width=256,Y.height=72;const et=Y.getContext("2d"),Q=new E_(Y),lt=new ud({map:Q,transparent:!0,depthTest:!1,depthWrite:!1}),St=new S_(lt);St.scale.set(1.85,.52,1),St.position.y=1.7-x,St.renderOrder=20,g.add(St);function xt(tt){et&&(et.clearRect(0,0,256,72),et.fillStyle=s.labelBg,et.fillRect(0,0,256,72),et.strokeStyle=e,et.lineWidth=5,et.strokeRect(3,3,250,66),et.fillStyle=e,et.font="bold 29px ui-monospace, Menlo, Consolas, monospace",et.textAlign="center",et.textBaseline="middle",et.fillText(`${n} ${J_[tt]}`,128,38),Q.needsUpdate=!0)}const Z=new Bt(e),at=new Bt(o.flashColor),pt=new Bt;let ut=null,ft=0,Rt=0,Dt=0,Ut=0,At=0,$t=0,T=0,mt={...qo};return{group:u,update(tt,vt){u.position.set(tt.position.x,tt.position.y,tt.position.z),u.rotation.y=tt.bodyYaw,L.rotation.y=(tt.headYaw-tt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,tt.mode!==ut&&(ut=tt.mode,xt(tt.mode),ft=1),ft=Math.max(0,ft-vt*2.2);const $=tt.hurt,it=vd($,tt.bodyYaw,o),nt=it.flash;pt.copy(at).multiplyScalar(nt);for(const ct of _)ct.emissive.copy(Z).multiplyScalar(ft*.5),nt>0&&ct.emissive.add(pt);f.position.set(0,x,0),f.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),d.position.set(0,0,0),d.rotation.z=0;const A=Math.hypot(tt.velocity.x,tt.velocity.z),v=Math.sin(tt.bodyYaw),O=Math.cos(tt.bodyYaw),K=Math.cos(tt.bodyYaw),st=-Math.sin(tt.bodyYaw),J=gd({phase:tt.gaitPhase,speed:A,moveSpeed:a,localForward:tt.velocity.x*v+tt.velocity.z*O,localRight:tt.velocity.x*K+tt.velocity.z*st,legLength:i.legLength,stride:tt.stride,grounded:!0},r);w.root.rotation.x=J.legL.pitchX,C.root.rotation.x=J.legR.pitchX,w.root.rotation.z=J.legL.rollZ,C.root.rotation.z=J.legR.rollZ,w.joint.rotation.x=J.legL.kneeX,C.joint.rotation.x=J.legR.kneeX,D.root.rotation.x=J.armL,z.root.rotation.x=J.armR,D.joint.rotation.x=-.18,z.joint.rotation.x=-.18,f.position.x=J.pelvisX,f.position.y=x+J.pelvisY,f.rotation.z=J.pelvisRoll,g.rotation.z=J.sideLean*(it.intensity>0?.4:1);const rt=yd(f,d);if(c){const ct=Math.max(.004166666666666667,Math.min(vt,.1)),bt=Math.sin(tt.bodyYaw),It=Math.cos(tt.bodyYaw),kt=vn((tt.velocity.x-Rt)/ct,-60,60),Et=vn((tt.velocity.z-Dt)/ct,-60,60),Vt=kt*bt+Et*It,Nt=cn(tt.bodyYaw-Ut)/ct,Zt=c.maxForwardDeg*Math.PI/180,F=c.maxSideDeg*Math.PI/180,N=1-Math.exp(-Math.max(0,c.smoothing)*ct);At+=(vn(Vt*c.accelGain,-Zt,Zt)-At)*N,$t+=(vn(-Nt*A*c.turnGain,-F,F)-$t)*N;const U=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;T+=(vn(A/Math.max(a,1e-6),0,1)-T)*(1-Math.exp(-Math.max(0,U)*ct));const H=Md({leanForward:At,leanSide:$t,speedRatio:T},c);g.rotation.x+=At,g.rotation.z+=$t,f.rotation.x+=H.pelvisPitch,f.rotation.z+=H.pelvisRoll,f.position.x+=H.pelvisX,f.position.z+=H.pelvisZ,f.position.y-=H.crouch;const ot=h.enabled?vn(h.weight,0,1):0;d.position.y+=H.crouch*(1-ot)}Rt=tt.velocity.x,Dt=tt.velocity.z,Ut=tt.bodyYaw,g.rotation.x+=it.upperPitch,g.rotation.z+=it.upperRoll,g.rotation.y+=it.upperYaw;const ht=vn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),_t=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=vn(it.upperShiftX*ht,-_t,_t),g.position.z+=vn(it.upperShiftZ*ht,-_t,_t),f.position.x+=it.comX,f.position.z+=it.comZ-it.pelvisBack,f.position.y-=it.drop;const zt=it.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(d.position.z+=it.pelvisBack*(1-zt),d.position.y+=it.drop*(1-zt),w.joint.rotation.x+=it.knee,C.joint.rotation.x+=it.knee,w.root.rotation.x-=it.hip,C.root.rotation.x-=it.hip,D.root.rotation.x+=it.arm,z.root.rotation.x+=it.arm*.8,tt.attackPhase!=="idle"&&it.intensity===0){const ct=tt.attackProgress,bt=ct<.34?-1:ct<.68?-1+(ct-.34)/.34*2:Math.max(0,1-(ct-.68)/.32),It=Math.max(0,-bt),kt=Math.max(0,bt);z.root.rotation.x=-1.7*It+1.25*kt,z.joint.rotation.x=-(.25+It*.45),g.rotation.y=-.28*bt,k.opacity=tt.attackPhase==="active"?.85:0,tt.attackPhase==="active"&&(B.rotation.z=-1.1+ct*3)}else k.opacity=0;mt=Sd({root:u,pelvis:f,lower:d,limbs:G,base:rt,cfg:h,grounded:!0,attacking:tt.attackPhase!=="idle"})},ik(){return mt},dispose(){u.traverse(tt=>{if(tt instanceof re){tt.geometry.dispose();const vt=tt.material;Array.isArray(vt)?vt.forEach($=>$.dispose()):vt.dispose()}}),Q.dispose(),lt.dispose()}}}function bd(i){return{x:0,y:0,z:1}}function tx(i){return Math.asin(bd().y)}function ex(i,t){const e=Math.cos(t),n=Math.sin(t);return{x:i.x*e+i.z*n,y:i.y,z:-0*n+i.z*e}}function Ee(i,t,e){return i<t?t:i>e?e:i}const Sl=1e-6;function ce(i,t,e,n){const s=new re(new dn(i,t,e),new cs({color:n}));return s.castShadow=!0,s.receiveShadow=!0,s}function ge(){return new Me}function ra(i,t,e){const n=ge(),s=ce(t*.7,.12,t*.7,e.wood);s.position.y=.06,n.add(s);const a=ce(t*2.4,.045,t*.8,e.metal);a.position.y=.13,n.add(a);const r=ce(t*.38,i,t,e.blade);r.position.y=.13+i/2,n.add(r);const o=ce(t*.42,i*.96,t*.2,e.bladeEdge);o.position.set(0,.13+i/2,t*.5),n.add(o);const c=ce(t*.3,.09,t*.45,e.blade);return c.position.y=.13+i+.045,n.add(c),n}function nx(i){const t=ra(.72,.15,i),e=ce(.12,.46,.12,i.wood);return e.position.y=-.3,t.add(e),t}function ix(i){const t=ge(),e=ce(.32,.38,.06,i.metal);e.position.set(0,.02,.1),t.add(e);const n=ce(.11,.11,.045,i.blade);return n.position.set(0,.02,.145),t.add(n),t}function sx(i){const t=ge(),e=ce(.055,.88,.055,i.wood);e.position.y=.42,t.add(e);const n=ce(.15,.15,.15,i.glow);n.position.y=.92;const s=n.material;return s.emissive=new Bt(i.glow),s.emissiveIntensity=.85,t.add(n),{g:t,orb:n}}function ax(i){const t=ge();for(let n=0;n<5;n++){const s=(n-2)*.15,a=ce(.055,.16,.05,i.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ce(.014,.66,.014,i.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function rx(i){const t=ge(),e=ce(.025,.025,.46,i.wood);e.position.z=.23,t.add(e);const n=ce(.055,.055,.09,i.blade);return n.position.z=.5,t.add(n),t}function ox(i,t,e,n,s,a,r,o,c,l,h){const u=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},d=ge(),g=ge();g.name="pelvis",g.position.y=i.legLength,d.add(g);const _=ge();_.name="lower";const m=ge();m.name="upper",g.add(_),g.add(m);const p=i.headSize,x=i.legLength,S=i.armLength,M=i.limbThickness,I=i.bodyHeight,P=i.bodyWidth,R=ce(P,I,.28,t.body);R.position.y=I/2,m.add(R);const L=ge();L.position.y=n.headPivotHeight,m.add(L);const b=ce(p,p,p,t.head);b.position.y=p/2,L.add(b);const y=new cs({color:"#1b2733"});for(const N of[-1,1]){const U=new re(new dn(.06,.07,.02),y);U.position.set(N*.09,p/2+.03,p/2+.011),L.add(U)}const w=N=>{const U=ge();U.name=N<0?"hipL":"hipR",U.rotation.order="ZYX",U.position.set(N*(P/2-M/2),0,0),_.add(U);const H=ce(M,x/2,M,t.limb);H.position.y=-x/4,U.add(H);const ot=ge();ot.name="knee",ot.position.y=-x/2,U.add(ot);const dt=ce(M,x/2,M,t.limb);dt.position.y=-x/4,ot.add(dt);const Mt=ce(M*1.15,.07,M*1.7,t.shoe);Mt.position.set(0,-x/2+.035,.045),ot.add(Mt);const Wt=new de;return Wt.name="footTip",Wt.position.y=-x/2,ot.add(Wt),{root:U,joint:ot,hand:ge(),tip:Wt}},C=N=>{const U=ge();U.name=N<0?"shoulderL":"shoulderR",U.position.set(N*(P/2+M/2),I-.04,0),m.add(U);const H=ce(M,S/2,M,t.limb);H.position.y=-S/4,U.add(H);const ot=ge();ot.name="elbow",ot.position.y=-S/2,U.add(ot);const dt=ce(M,S/2,M,t.limb);dt.position.y=-S/4,ot.add(dt);const Mt=ge();Mt.position.y=-S/2,ot.add(Mt);const Wt=ce(M*1.1,.09,M*1.1,t.head);return Wt.position.y=.045,Mt.add(Wt),{root:U,joint:ot,hand:Mt}},D=w(-1),z=w(1),G=C(-1),k=C(1),B=[D,z].map(N=>({root:N.root,joint:N.joint,tip:N.tip,upperLen:x/2,lowerLen:x/2,bend:1})),Y=ge(),et=ge();k.hand.add(Y),G.hand.add(et);const Q=sx(t),lt=ax(t),St=rx(t),xt={"sword-shield":{right:ra(.42,.075,t),left:ix(t)},"dual-swords":{right:ra(.42,.075,t),left:ra(.42,.075,t)},greatsword:{right:nx(t),left:ce(.12,.2,.12,t.wood)},staff:{right:Q.g,left:ge(),orb:Q.orb},bow:{right:St,left:lt.g,arrow:St,drawString:lt.drawString}};for(const N of Object.keys(xt))Y.add(xt[N].right),et.add(xt[N].left),xt[N].right.visible=!1,xt[N].left.visible=!1;let Z=null,at=0,pt=0,ut=0,ft=0,Rt=0,Dt=0,Ut=$_(),At={...qo},$t=0,T=0,mt=0,tt=0,vt=0,$=1,it={speed:0,phase:0},nt=0,A=0,v=!0,O=0,K="none",st=0,J=0,rt=0,ht=.3,_t=0;function zt(N){const U=Math.PI/180,H=a;let ot=0,dt=0,Mt=0,Wt=0;N==="sword-shield"?(ot=H.swordPitchDeg*U,dt=-H.swordYawDeg*U,Mt=H.shieldPitchDeg*U):N==="dual-swords"?(ot=H.swordPitchDeg*U,dt=-H.swordYawDeg*U,Mt=H.swordPitchDeg*U,Wt=H.swordYawDeg*U):N==="greatsword"?(ot=H.greatswordPitchDeg*U,dt=-H.greatswordYawDeg*U,Mt=H.greatswordPitchDeg*U,Wt=H.greatswordYawDeg*U):N==="staff"?ot=H.staffPitchDeg*U:Mt=H.bowPitchDeg*U,Y.rotation.set(ot,0,dt),et.rotation.set(Mt,0,Wt)}function ct(N){if(N!==Z){Z=N;for(const U of Object.keys(xt))xt[U].right.visible=U===N,xt[U].left.visible=U===N;zt(N),lt.drawString.position.z=-.06,St.position.z=0,Q.orb.scale.setScalar(1),m.rotation.y=0}}ct("sword-shield");const bt=[];d.traverse(N=>{N instanceof re&&N.material instanceof cs&&bt.push(N.material)});const It=new Bt(o.flashColor);function kt(N,U){const H=vd(N,U,o);Ut=H,m.rotation.x+=H.upperPitch,m.rotation.z+=H.upperRoll,m.rotation.y+=H.upperYaw;const ot=Ee(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),dt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Ee(H.upperShiftX*ot,-dt,dt),m.position.z+=Ee(H.upperShiftZ*ot,-dt,dt),g.position.x+=H.comX,g.position.z+=H.comZ-H.pelvisBack,g.position.y-=H.drop;const Mt=H.legacy?0:Ee(o.lowerScale,0,1);_.position.z+=H.pelvisBack*(1-Mt),_.position.y+=H.drop*(1-Mt),D.joint.rotation.x+=H.knee,z.joint.rotation.x+=H.knee,D.root.rotation.x-=H.hip,z.root.rotation.x-=H.hip,G.root.rotation.x+=H.arm,k.root.rotation.x+=H.arm*.8;for(const Wt of bt)Wt.emissive.copy(It).multiplyScalar(H.flash)}function Et(N){return N<.3?-1:N<.62?-1+(N-.3)/.32*2:Math.max(0,1-(N-.62)/.38)}function Vt(N){if(N.phase==="idle"||N.charging)return;const U=N.attackProgress,H=Et(U),ot=Math.max(0,H),dt=N.comboIndex%2===0?1:-1,Mt=c.stride,Wt=Number.isFinite(Mt.stepReach)?Mt.stepReach:.17,se=Number.isFinite(Mt.stepSideReach)?Mt.stepSideReach:.14,Yt=Number.isFinite(Mt.stepDipReach)?Mt.stepDipReach:.05,Kt=N.weapon==="greatsword"?Ee(Number.isFinite(Mt.heavyScale)?Mt.heavyScale:1,0,1):1;g.position.z+=Wt*ot*Kt,g.position.x+=dt*se*ot*Kt,g.position.y-=Yt*Math.sin(Math.PI*U)*Kt}function Nt(N){if(lt.drawString.position.z=-.06,St.position.z=0,Q.orb.scale.setScalar(1),m.rotation.y=0,N.charging&&N.weapon==="bow"){const dt=N.charge;G.root.rotation.x=-1.25,G.joint.rotation.x=-.15,k.root.rotation.x=.35+dt*.3,k.joint.rotation.x=-1.15,lt.drawString.position.z=-.06-dt*.22,St.position.z=-dt*.3,m.rotation.y=-.22;return}if(N.phase==="idle")return;const U=Et(N.attackProgress),H=Math.max(0,-U),ot=Math.max(0,U);if(N.weapon==="bow")G.root.rotation.x=-1.2,G.joint.rotation.x=-.15,k.root.rotation.x=.9-ot*.8,k.joint.rotation.x=-.3;else if(N.weapon==="greatsword"){const dt=-1.6*H+1.25*ot,Mt=Ee(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);k.root.rotation.x=dt,k.joint.rotation.x=-(.25+H*.4),G.root.rotation.x=dt+.06,G.joint.rotation.x=-(.32+H*.4),G.root.rotation.z=.38,m.rotation.y=-.2*U*Mt}else{const dt=N.comboIndex;if(dt===1)k.root.rotation.x=-1.7*H+1.1*ot,k.joint.rotation.x=-(.2+H*.5),G.root.rotation.x=.1,m.rotation.y=-.18*U;else if(dt===2)G.root.rotation.x=-1.5*H+1*ot,G.joint.rotation.x=-(.2+H*.5),k.root.rotation.x=.2,m.rotation.y=.45*-U;else{const Mt=-1.9*H+1.2*ot;G.root.rotation.x=Mt,k.root.rotation.x=Mt,G.joint.rotation.x=-(.15+H*.4),k.joint.rotation.x=-(.15+H*.4),m.rotation.y=-.3*U}}Vt(N)}function Zt(N,U){N&&(k.root.rotation.x=-1.05,k.joint.rotation.x=-.35,G.root.rotation.x=-.45,G.joint.rotation.x=-.2,m.rotation.y=-.12,Q.orb.scale.setScalar(1.25+.12*Math.sin(U*2)))}function F(N){if(!N||N.phase==="idle")return;const U=N.progress,H=U<.3?-.35+U/.3*1.35:U<.7?1:Math.max(0,1-(U-.7)/.3),ot=Math.PI/180;m.rotation.x+=f.leanDeg*ot*H,G.root.rotation.x-=f.shieldPitchDeg*ot*H,G.joint.rotation.x-=.22*H,k.root.rotation.x-=.3*H,g.position.z+=f.pelvisReach*Math.max(0,H)}return{group:d,update(N,U,H,ot,dt=!1,Mt,Wt){ct(U.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const se=Math.max(1/240,Math.min(ot,.1)),Yt=Mt===void 0?nt+=ot:Mt;A=Yt;const Kt=c.landing;Kt.enabled?v&&!N.grounded?(K="jump",st=Yt,J=Kt.anticipationDuration,rt=Math.max(0,Kt.jumpAnticipation),ht=.32):!v&&N.grounded&&(K="land",st=Yt,J=Kt.duration,rt=X_(O,Kt),ht=Kt.compressRatio,_t=O):(K="none",rt=0),Yt<st&&(K="none",rt=0),v=N.grounded,O=N.velocity.y;const ue=yl(Yt,st,J,rt,ht),Tn=U.phase!=="idle";tt=G_(tt,Tn,se,c.attack.blendRate);const oi=V_(tt,c.attack.gaitWeight,c.attack.lowerBodyWeight);vt=oi.attackLegWeight,$=oi.gaitScale;const hn=Math.sin(N.bodyYaw),Xi=Math.cos(N.bodyYaw),us=(N.velocity.x-at)/se,fs=(N.velocity.z-pt)/se,ci=Ee(us,-60,60),ps=Ee(fs,-60,60),li=ci*hn+ps*Xi,ms=cn(N.bodyYaw-ut)/se,gs=Math.hypot(N.velocity.x,N.velocity.z),_s=r.maxForwardDeg*Math.PI/180,xs=r.maxSideDeg*Math.PI/180,Ca=Ee(li*r.accelGain,-_s,_s),E=Ee(-ms*gs*r.turnGain,-xs,xs),V=1-Math.exp(-r.smoothing*se);ft+=(Ca-ft)*V,Rt+=(E-Rt)*V,at=N.velocity.x,pt=N.velocity.z,ut=N.bodyYaw;const q=Math.hypot(N.velocity.x,N.velocity.z),j=Math.cos(N.bodyYaw),W=-Math.sin(N.bodyYaw),gt=N.velocity.x*j+N.velocity.z*W,Tt=q>Sl?Ee(gt/q,-1,1):0,Ct=n.hipYawMaxDeg*Math.PI/180,Pt=n.legYawScale*Tt*Ct;T+=(Pt-T)*(1-Math.exp(-n.hipYawSmoothing*se));const Ft=N.bodyYaw+T;mt=Ft;const Ot=Math.sin(Ft),Lt=Math.cos(Ft),qt=Math.cos(Ft),te=-Math.sin(Ft),ee={speed:q,phase:N.gaitPhase,localForward:N.velocity.x*Ot+N.velocity.z*Lt,localRight:N.velocity.x*qt+N.velocity.z*te},fe=Tn?B_(ee,U.attackProgress,U.comboIndex,tt,c.stride):ee;it=fe;const Jt={phase:fe.phase,speed:fe.speed,moveSpeed:e,localForward:fe.localForward,localRight:fe.localRight,legLength:i.legLength,stride:Tn?0:N.stride,grounded:N.grounded},wt=W_(gd(Jt,s),oi.gaitScale);N.grounded?(D.root.rotation.x=wt.legL.pitchX,z.root.rotation.x=wt.legR.pitchX,D.root.rotation.z=wt.legL.rollZ,z.root.rotation.z=wt.legR.rollZ,D.joint.rotation.x=wt.legL.kneeX,z.joint.rotation.x=wt.legR.kneeX,G.root.rotation.x=wt.armL,k.root.rotation.x=wt.armR,G.joint.rotation.x=-(.18+wt.armL*.2),k.joint.rotation.x=-(.18+wt.armR*.2),G.root.rotation.z=0,k.root.rotation.z=0,g.position.x=wt.pelvisX,g.position.y=x+wt.pelvisY,g.rotation.z=wt.pelvisRoll):(D.root.rotation.x=-.55,z.root.rotation.x=-.25,D.joint.rotation.x=.75,z.joint.rotation.x=.55,G.root.rotation.x=-.9,k.root.rotation.x=-.7,G.joint.rotation.x=-.6,k.joint.rotation.x=-.6,D.root.rotation.z=0,z.root.rotation.z=0);const We=yd(g,_),Qt=q/Math.max(e,Sl),Ie=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,wn=1-Math.exp(-Math.max(0,Ie)*se);$t+=(Ee(Qt,0,1)-$t)*wn;const pe=Md({leanForward:ft,leanSide:Rt,speedRatio:$t},r);g.rotation.x+=pe.pelvisPitch,g.rotation.z+=pe.pelvisRoll,g.position.x+=pe.pelvisX,g.position.z+=pe.pelvisZ,g.position.y-=pe.crouch;const Gn=u.enabled&&N.grounded?Ee(u.weight,0,1)*(Tn?Ee(u.attackScale,0,1):1):0;_.position.y+=pe.crouch*(1-Ee(Gn,0,1)),Nt(U),Zt(dt,N.gaitPhase),F(Wt);const ae=a.greatswordPitchDeg*Math.PI/180,Ue=U.weapon==="greatsword",Rn=Math.hypot(N.velocity.x,N.velocity.z),Ke=Ue&&U.phase==="idle"&&Rn>.5?Math.min(1.15,Rn/Math.max(e,.001)*.9):0;Dt+=(Ke-Dt)*(1-Math.exp(-6*se)),Ue&&(Y.rotation.x=ae+Dt),U.weapon==="bow"&&(lt.g.rotation.x=-(G.root.rotation.x+G.joint.rotation.x),St.rotation.x=-(k.root.rotation.x+k.joint.rotation.x));const Je=m.rotation.y;kt(H,N.bodyYaw);const $i=H.type==="none"?1:.4;if(m.rotation.x+=ft*$i,m.rotation.z+=(Rt+wt.sideLean)*$i,ue>0&&(D.root.rotation.x-=Kt.hipPitch*ue,z.root.rotation.x-=Kt.hipPitch*ue,D.joint.rotation.x+=Kt.kneeBend*ue,z.joint.rotation.x+=Kt.kneeBend*ue,g.position.y-=Kt.crouchDepth*ue,_.position.y+=Kt.crouchDepth*(1-Kt.lowerScale)*ue,m.rotation.x+=Kt.upperPitch*ue,G.root.rotation.x-=Kt.armTuck*ue,k.root.rotation.x-=Kt.armTuck*ue),vt>0&&N.grounded){const un=H_(U.attackProgress,U.comboIndex,c.stride),fn=vt;D.root.rotation.x+=un.legL.pitchX*fn,z.root.rotation.x+=un.legR.pitchX*fn,D.root.rotation.z+=un.legL.rollZ*fn,z.root.rotation.z+=un.legR.rollZ*fn,D.joint.rotation.x+=un.legL.kneeX*fn,z.joint.rotation.x+=un.legR.kneeX*fn,g.position.x+=un.pelvisX*fn,g.position.y+=un.pelvisY*fn,g.rotation.z+=un.pelvisRoll*fn}_.rotation.y=T;const Ed=Je;L.rotation.y=cn(N.headYaw-N.bodyYaw-Ed),At=Sd({root:d,pelvis:g,lower:_,limbs:B,base:We,cfg:u,grounded:N.grounded,attacking:Tn})},lean(){return{forward:ft,side:Rt}},landing(){const N=yl(A,st,J,rt,ht),U=J>0?Math.max(0,J-Math.max(0,A-st)):0;return{pulse:N,remaining:U,kind:N>0?K:"none",impactVy:_t}},hurt(){return Ut},ik(){return At},attackBlend(){return tt},attackWeights(){return{gaitScale:$,attackLegWeight:vt,driveSpeed:it.speed,stridePhase:it.phase}},hipYaw(){return T},gaitYaw(){return mt},arrowDirection(){St.updateWorldMatrix(!0,!1);const N=St.matrixWorld.elements,U=N[8],H=N[9],ot=N[10],dt=Math.hypot(U,H,ot)||1;return{x:U/dt,y:H/dt,z:ot/dt}},dispose(){d.traverse(N=>{if(N instanceof re){N.geometry.dispose();const U=N.material;Array.isArray(U)?U.forEach(H=>H.dispose()):U.dispose()}})}}}function cx(i,t){switch(i){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function lx(i,t,e){const n=Math.max(1,i.clientWidth),s=Math.max(1,i.clientHeight),a=new v_({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=Fl,a.setSize(n,s,!1),i.appendChild(a.domElement);const r=new M_;r.background=new Bt("#12161d"),r.add(new T_(11061486,2764600,1.15));const o=new C_(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],h=new Me;for(const $ of t.boxes){const it=$.maxX-$.minX,nt=$.maxY-$.minY,A=$.maxZ-$.minZ;let v=cx($.kind,e);$.kind==="step"&&(v=new Bt(v).offsetHSL(0,0,$.maxY*.09).getStyle());const O=new cs({color:v,transparent:!0,opacity:1}),K=new re(new dn(it,nt,A),O);K.position.set(($.minX+$.maxX)/2,($.minY+$.maxY)/2,($.minZ+$.maxZ)/2),K.castShadow=$.kind!=="ground",K.receiveShadow=!0,K.add(new pd(new A_(K.geometry),new $o({color:10467020,transparent:!0,opacity:.32}))),h.add(K),l.push(O)}r.add(h);const u=t.gridMeta.maxX-t.gridMeta.minX,f=new L_(u,u,4873328,3358797);f.position.y=.002,f.visible=e.showGrid,r.add(f);const d=ox(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new Me,_=.9,m=new Me;m.position.y=_,d.group.position.y=-_,m.add(d.group),g.add(m),r.add(g);const p=t.dummies.map(($,it)=>{const nt=e.dummies.colors,A=nt[it%nt.length]??"#cccccc",v=Q_(e.voxel,e.colors,A,$.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return v.group.traverse(O=>{O.userData.dummyId=$.id}),r.add(v.group),v}),x=p.map($=>$.group),S=new P_,M=e.targeting.ringRadius,I=new nn({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:Te,depthWrite:!1}),P=new re(new Di(M-.07,M,28),I);P.rotation.x=-Math.PI/2,P.position.y=.03,P.visible=!1,r.add(P);const R=new Me;r.add(R);const L=new nn({color:12577023,transparent:!0,opacity:0,side:Te,depthWrite:!1}),b=new Me;b.position.set(0,.95,.72),R.add(b);const y=new Me;y.rotation.x=tx(e.camera.pitchDeg),b.add(y);const w=new re(new Ra(.78,.045,6,24,Math.PI*1.15),L);y.add(w);const C=new Zo(1,0),D=new nn({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),z=Array.from({length:16},()=>{const $=new re(C,D);return $.visible=!1,r.add($),$}),G=new Di(.86,1,40),k=Array.from({length:6},()=>{const $=new nn({color:10146047,transparent:!0,opacity:0,side:Te,depthWrite:!1}),it=new re(G,$);return it.rotation.x=-Math.PI/2,it.visible=!1,r.add(it),{mesh:it,mat:$}}),B=new nn({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),Y=new re(new dn(.035,.035,.5),B);R.add(Y);const et=e.dash,Q=new Di(et.ringRadius-.06,et.ringRadius,28),lt=Array.from({length:6},()=>{const $=new nn({color:16777215,transparent:!0,opacity:0,side:Te,depthWrite:!1}),it=new re(Q,$);return it.rotation.x=-Math.PI/2,it.visible=!1,r.add(it),{mesh:it,mat:$,life:0,base:1}});function St($,it,nt,A,v){const O=lt.find(K=>K.life<=0)??lt[0];O.mat.color.set(A),O.mesh.position.set($,nt+.04,it),O.base=v,O.mesh.scale.setScalar(v*.6),O.mesh.visible=!0,O.mat.opacity=.9,O.life=et.fxDuration}const xt=e.links,Z=new Di(xt.ringRadius-.07,xt.ringRadius,28),at=Array.from({length:5},()=>{const $=new nn({color:xt.chargeColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),it=new re(Z,$);return it.rotation.x=-Math.PI/2,it.visible=!1,r.add(it),{mesh:it,mat:$,life:0,base:1}});function pt($,it,nt,A){const v=at.find(O=>O.life<=0)??at[0];v.mesh.position.set($,nt+.05,it),v.base=A,v.mesh.scale.setScalar(A*.55),v.mesh.visible=!0,v.mat.opacity=.85,v.life=xt.fxDuration}let ut=t.playerLink.id,ft=t.playerLink.hitIds.length,Rt=t.dash.id,Dt="none",Ut=0,At=-1,$t=1;const T=I_(e.camera,e.smartCamera,e.zoom,n/s),mt=t.character.position;T.update(mt.x,mt.y,mt.z,1,t.camera);function tt($,it){if(x.length===0)return 0;const nt=a.domElement.getBoundingClientRect(),A=new Ht(($-nt.left)/nt.width*2-1,-((it-nt.top)/nt.height)*2+1);S.setFromCamera(A,T.camera);const v=S.intersectObjects(x,!0);for(const O of v){const K=O.object.userData.dummyId;if(K&&K>0)return K}return 0}function vt($,it,nt){const A=a.domElement.getBoundingClientRect(),v=new X($,it,nt).project(T.camera);return{x:A.left+(v.x*.5+.5)*A.width,y:A.top+(-v.y*.5+.5)*A.height}}return{render($,it){const nt=$.character,A=$.combat;g.position.set(nt.position.x,nt.position.y,nt.position.z),g.rotation.y=nt.bodyYaw;const v=$.dash.phase==="active"&&$.dash.kind==="roll",O=v&&$.dash.duration>0?Math.min(1,1-$.dash.timer/$.dash.duration):0;m.rotation.x=v?O*Math.PI*2:0,m.position.y=_-(v?.2*Math.sin(Math.PI*O):0),d.update(nt,A,$.playerHurt,it,$.abilities.channeling,$.time,$.playerLink);for(let rt=0;rt<p.length;rt++)$.dummies[rt]&&p[rt].update($.dummies[rt],it);const K=$.targeting.hasTarget?$.dummies[$.targeting.targetId-1]:void 0;if(P.visible=!!K,K&&(P.position.set(K.position.x,K.position.y+.03,K.position.z),P.scale.setScalar(1+.07*Math.sin($.time*6))),R.position.set(nt.position.x,nt.position.y,nt.position.z),R.rotation.y=A.phase!=="idle"?A.attackFacing:nt.bodyYaw,$.dash.id!==Rt){Rt=$.dash.id;const rt=$.dash;Dt=rt.kind,rt.kind==="blink"?(St(rt.fromX,rt.fromZ,nt.position.y,et.blinkColor,.9),St(rt.toX,rt.toZ,nt.position.y,et.blinkColor,1.35)):St(rt.fromX,rt.fromZ,nt.position.y,et.rollColor,1.1)}for(const rt of lt){if(rt.life<=0)continue;rt.life-=it;const ht=Math.max(0,rt.life/et.fxDuration);rt.mat.opacity=.9*ht,rt.mesh.scale.setScalar(rt.base*(.6+(1-ht)*1.2)),rt.life<=0&&(rt.mesh.visible=!1)}const st=$.playerLink;st.id!==ut&&(ut=st.id,ft=st.hitIds.length,pt(nt.position.x,nt.position.z,nt.position.y,1)),st.hitIds.length>ft?(ft=st.hitIds.length,pt(nt.position.x,nt.position.z,nt.position.y,1.35)):st.hitIds.length<ft&&(ft=st.hitIds.length);for(const rt of at){if(rt.life<=0)continue;rt.life-=it;const ht=Math.max(0,rt.life/Math.max(xt.fxDuration,1e-6));rt.mat.opacity=.85*ht,rt.mesh.scale.setScalar(rt.base*(.55+(1-ht)*1.1)),rt.life<=0&&(rt.mesh.visible=!1)}A.attackId!==Ut&&(Ut=A.attackId,A.weapon==="bow"&&A.phase!=="idle"&&(At=0,$t=.6+A.lastCharge*.9));const J=A.phase==="active"&&A.comboIndex>0;L.opacity=J?.78:0,J&&(w.rotation.z=-1.2+A.attackProgress*3.2,w.scale.setScalar(.9+A.comboIndex*.13));for(let rt=0;rt<z.length;rt++){const ht=$.abilities.projectiles[rt],_t=z[rt];_t.visible=!!ht,ht&&(_t.position.set(ht.x,ht.y,ht.z),_t.scale.setScalar(ht.radius),_t.rotation.y+=it*6)}for(let rt=0;rt<k.length;rt++){const ht=$.abilities.rings[rt],_t=k[rt];if(_t.mesh.visible=!!ht,ht){const zt=Math.max(0,Math.min(1,ht.life/Math.max(ht.duration,1e-6)));_t.mesh.position.set(ht.x,.05,ht.z),_t.mesh.scale.setScalar(ht.radius),_t.mat.opacity=.25+.55*zt}}if(At>=0){At+=it;const rt=At*14*$t;Y.position.set(0,.85,.6+rt),B.opacity=rt<9?.95:0,rt>=9&&(At=-1)}else B.opacity=0;T.update(nt.position.x,nt.position.y,nt.position.z,it,$.camera),a.render(r,T.camera)},resize(){const $=Math.max(1,i.clientWidth),it=Math.max(1,i.clientHeight);a.setSize($,it,!1),T.resize($/it)},getGroundBasis(){return T.getGroundBasis()},setCollidersVisible($){for(const it of l)it.opacity=$?.3:1,it.wireframe=$,it.needsUpdate=!0},setGridVisible($){f.visible=$},setZoom($){T.setZoom($)},pickDummy:tt,projectToScreen:vt,diagnostics(){const $=bd(e.camera.pitchDeg),it=ex($,R.rotation.y);return{lean:d.lean(),slashNormal:it,arrowForward:d.arrowDirection(),gait:{hipYaw:d.hipYaw(),gaitYaw:d.gaitYaw()},attackBlend:d.attackBlend(),attackWeights:d.attackWeights(),landing:d.landing(),hurt:d.hurt(),ik:d.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:lt.filter(nt=>nt.life>0).length,lastKind:Dt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...T.smart()}}},dispose(){d.dispose();for(const $ of p)$.dispose();P.geometry.dispose(),I.dispose(),w.geometry.dispose(),L.dispose(),C.dispose(),D.dispose(),G.dispose();for(const $ of k)$.mat.dispose();Y.geometry.dispose(),B.dispose();for(const $ of lt)$.mat.dispose();Q.dispose();for(const $ of at)$.mat.dispose();Z.dispose(),h.traverse($=>{$ instanceof re&&$.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}async function dx(i){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(i),!0}catch{}try{const t=document.createElement("textarea");t.value=i,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,i.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function hx(i,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=i,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),2e3)}function ux(i,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const n=x=>e.querySelector(`#${x}`),s=n("diag-status"),a=n("diag-text"),r=n("diag-copy"),o=n("diag-json"),c=n("diag-clear"),l=n("diag-toggle"),h=n("diag-close"),u=n("diag-mask");let f=!1,d=!0,g=0;function _(){const x=i.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){f=x,e.hidden=!x,x?_():a.hidden=!0}function p(x){r.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!f)}),h.addEventListener("click",()=>m(!1)),u.addEventListener("click",()=>m(!1)),r.addEventListener("click",()=>{const x=i.summary();dx(x).then(S=>{S?(p("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),p("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=i.dump(),S=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);hx(`harness-${x.meta.version}-${S}.json`,JSON.stringify(x)),p("已导出")}),c.addEventListener("click",()=>{i.clear(),a.hidden=!0,_(),p("已清空")}),l.addEventListener("click",()=>{d=!d,i.setEnabled(d),_()}),{tick(){const x=i.status();t==null||t.classList.toggle("is-alert",x.alert),f&&_()},isOpen:()=>f,close:()=>m(!1)}}const fx={intents:{...bl},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function px(){const i=document.getElementById("app"),t=document.getElementById("hud");if(!i||!t)throw new Error("缺少 #app / #hud 容器");const e=Th(Qh,tu),n=lx(i,e,en),s=Rh(e),a=gu(t),r=xu(t,document.getElementById("hint")),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.9 · 11-06 22:29 · 诊断");const c=b=>String(b).padStart(2,"0"),l=new Date,h=Zh({meta:{version:"v0.9.9",buildTime:"11-06 22:29",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=ux(h,o);document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const f={timeScale:1,paused:!1,showColliders:en.showColliders,showGrid:en.showGrid};let d=1;const g=Hh({maxRadiusPx:()=>en.joystick.maxRadiusPx,deadZone:en.joystick.deadZone,getBasis:()=>n.getGroundBasis(),zoom:()=>en.zoom}),_=Array.from(document.querySelectorAll(".wp[data-weapon]"));let m=e.combat.weapon;function p(b){if(b===m)return;m=b;const y=ii.indexOf(b)+1;for(const w of _)w.classList.toggle("is-active",Number(w.dataset.weapon)===y);M.refreshWeapon()}let x=fx,S=0;const M=fu(e,en,f,{singleStep:()=>s.singleStep(x.intents),reset:()=>{d=1,s.singleStep({...bl,resetPressed:!0})},resetZoom:()=>{d=1,n.setZoom(1)},onToggleColliders:b=>n.setCollidersVisible(b),onToggleGrid:b=>n.setGridVisible(b)});window.addEventListener("resize",()=>n.resize()),window.__harness={world:e,view:n,clock:s,input:g,viewConfig:en,getUserZoom:()=>d,getGestures:()=>x.gestures,getLastGesture:()=>x.lastGesture,telemetry:h,telemetrySummary:()=>h.summary()};let I=performance.now(),P=60,R=0;function L(b){const y=Math.min((b-I)/1e3,.1);I=b,y>0&&(P=P*.9+1/y*.1);const w=g.sample();w.intents.resetPressed&&(d=1),d=Uh(d,w.zoomScale,en.zoom.min,en.zoom.max),n.setZoom(d);let C=w.intents.dummyClickId;if(w.tap){const G=n.pickDummy(w.tap.x,w.tap.y);G>0&&(C=G)}C>0&&(S=C),x={...w,intents:{...w.intents,dummyClickId:S}};const D=s.frame(y,x.intents,f.timeScale,f.paused,()=>{const G=e.events;for(let k=0;k<G.length;k++)h.event(G[k],e.time)});D>0&&(S=0),h.sample(e,x,y*1e3,D);for(const G of x.gestures)h.gesture(G);b-R>250&&(R=b,u.tick()),p(e.combat.weapon),n.render(e,y);const z=n.diagnostics();a.update(e,P,D,x,f,{attackBlend:z.attackBlend,attackWeights:z.attackWeights,landing:z.landing,hurt:z.hurt,ik:z.ik,zoom:z.camera.zoom},r.hudCompact()),requestAnimationFrame(L)}requestAnimationFrame(L)}px();

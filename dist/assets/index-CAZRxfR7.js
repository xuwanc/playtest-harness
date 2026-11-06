(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const si=["sword-shield","dual-swords","greatsword","staff","bow"],La=["wander","follow","keep-distance","attack","idle"],Dl={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},da=1e-6;function ba(i,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>da?Math.atan2(t.aimX,t.aimZ):i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget?i.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>da?Math.atan2(t.moveX,t.moveZ):i.character.facing}function Id(i,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>da){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>da)return{x:t.moveX/e,z:t.moveZ/e};const n=i.character.facing;return{x:Math.sin(n),z:Math.cos(n)}}const Ge=1e-6,Er=Math.PI/180;function Ll(){return{type:"none",timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Ar(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function tc(i,t,e,n,s){i.type=t,i.duration=e,i.timer=e,i.dirX=n,i.dirZ=s,i.knockX=0,i.knockZ=0}function Co(i,t,e){const n=e.duration>0?e.duration:Do(i,e.type);if(t.kind==="player"){const a=i.playerHurt;if(tc(a,e.type,n,e.dirX,e.dirZ),!i.config.hits.noDamageToPlayer&&e.knockback>Ge){const r=e.knockback*i.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}Ar(i,"player-hurt",e.sourceId??0,i.character.position);return}const s=i.dummies[t.index];if(s){if(tc(s.hurt,e.type,n,e.dirX,e.dirZ),e.knockback>Ge){const a=e.knockback*i.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}i.hitCount+=1,Ar(i,"hit",s.id,s.position)}}function Po(i,t,e){Co(i,{kind:"dummy",index:t},e)}function Ud(i,t){const e=[i.playerHurt];for(const s of i.dummies)e.push(s.hurt);const n=Math.exp(-i.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=n,s.knockZ*=n,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function Do(i,t){const e=i.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function kd(i){const t=i.combat,e=i.config.hits,n=i.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Er),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=i.config.dummies.radius,l=i.config.targeting.idealRange;for(const h of i.dummies){const f=h.position.x-n.x,p=h.position.z-n.z,d=Math.hypot(f,p);if(d>s+c)continue;const g=d>Ge?f/d:r,_=d>Ge?p/d:o;if(d>Ge&&(f*r+p*o)/d<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const u=e.knockback[t.weapon]??0;let x=d;u>0&&(x=Math.max(d+u,l));const y=Math.max(0,x-d);Po(i,i.dummies.indexOf(h),{type:m,duration:Do(i,m),dirX:g,dirZ:_,knockback:y})}}function Fd(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="active")return;const s=n.weapon===""?void 0:e.moves[n.weapon];if(!s||!s.enabled||!i.modules.hits||!i.modules.dummies)return;const a=s.hit;if(n.pulseTimer-=t,n.pulseTimer>0)return;n.pulseTimer=Math.max(a.pulseInterval,0);const r=i.character.position,o=n.fromX,c=n.fromZ,l=r.x,h=r.z,f=l-o,p=h-c,d=f*f+p*p,g=Math.sin(n.facing),_=Math.cos(n.facing),m=Math.cos(ec(a.arcDeg,0,180)*Er),u=i.config.dummies.radius;for(let x=0;x<i.dummies.length;x++){const y=i.dummies[x];if(n.hitIds.indexOf(y.id)>=0)continue;const v=d>Ge?ec(((y.position.x-o)*f+(y.position.z-c)*p)/d,0,1):0,L=o+f*v,w=c+p*v,C=Math.hypot(y.position.x-L,y.position.z-w);let P=!1;if(a.shape==="circle")P=C<=a.radius+u;else if(a.shape==="capsule")P=C<=Math.max(a.radius,a.width)+u;else{const O=y.position.x-l,H=y.position.z-h,I=Math.hypot(O,H),X=I>Ge?(O*g+H*_)/I>=m:!0;P=I<=a.radius+u&&X||C<=a.width+u}if(!P)continue;const b=y.position.x-o,S=y.position.z-c,R=Math.hypot(b,S);if(R>Ge&&(b*g+S*_)/R<Math.cos(Math.max(a.arcDeg,90)*Er))continue;const T=R>Ge?b/R:g,D=R>Ge?S/R:_;Co(i,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:T,dirZ:D,knockback:a.knockback}),n.hitIds.push(y.id),Ar(i,"link-hit",y.id,y.position)}}function Nd(i){const t=i.config.hits,e=i.character.position;for(const n of i.events){if(n.type!=="dummy-hit")continue;const s=i.dummies[n.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>Ge?a/o:0,l=o>Ge?r/o:1;Co(i,{kind:"player"},{type:"light",duration:Do(i,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function zd(i,t){if(!i.modules.hits)return;i.events.some(n=>n.type==="attack-active")&&kd(i),Fd(i,t),Nd(i)}function ec(i,t,e){return i<t?t:i>e?e:i}const ea=1e-6;function cs(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Od(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function Bd(i){const t=i.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function Hd(i){const t=i.abilities,e=i.config.abilities.arcane,n=i.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:n.x+s*r,y:n.y+1,z:n.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,cs(i,"projectile-fire",t.volleyId,o)}function Gd(i,t,e){const n=i.abilities,s=i.config.abilities.arcane,a=i.dash.phase==="active",r=i.playerLink;if(i.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){n.channeling||(n.channeling=!0,n.fireTimer=0,cs(i,"channel-start",0,i.character.position)),n.channelYaw=ba(i,e),n.fireTimer-=t;let c=0;for(;n.fireTimer<=0&&c++<8;)n.fireTimer+=Math.max(s.fireInterval,ea),Hd(i)}else n.channeling&&(n.channeling=!1,cs(i,"channel-end",0,i.character.position))}function Vd(i,t){const e=i.config.abilities.ring,n=i.dash.phase==="active";if(i.combat.weapon!=="staff"||!t.skill2Pressed||n)return;const s=i.character.position,a={id:++i.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};i.abilities.rings.push(a),cs(i,"ring-place",a.id,s)}function Wd(i,t){const e=i.abilities,n=i.config.abilities.arcane,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],f=h.position.x-o.x,p=h.position.z-o.z,d=o.radius+s;if(!(f*f+p*p>d*d)){Po(i,l,{type:n.hurtType,duration:n.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:n.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function Xd(i,t){const e=i.abilities,n=i.config.abilities.ring,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(n.pulseInterval,ea),a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],f=h.position.x-o.x,p=h.position.z-o.z,d=o.radius+s;if(f*f+p*p>d*d)continue;const g=Math.hypot(f,p),_=g>ea?f/g:0,m=g>ea?p/g:1;Po(i,l,{type:"heavy",duration:n.stun,dirX:_,dirZ:m,knockback:n.knockback})}cs(i,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function $d(i,t,e){Gd(i,t,e),Vd(i,e),Wd(i,t),Xd(i,t)}function Ia(i){i.rngState=i.rngState+1831565813>>>0;let t=i.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const nc=1e-6;function ic(i,t,e){return i<t?t:i>e?e:i}function Il(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Ul(i){const t=i.camera,e=Il();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=i.character.position.x,t.centroidZ=i.character.position.z}function Yd(i){const t=i.camera,e=i.config.camera,n=i.character.position;let s=0,a=0,r=0,o=0;for(const l of i.dummies){const h=l.position.x-n.x,f=l.position.z-n.z,p=Math.hypot(h,f);if(p>e.radius)continue;const d=ic((e.radius-p)/Math.max(nc,e.radius-e.nearDistance),0,1);let g=d*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*d),s+=g,a+=l.position.x*g,r+=l.position.z*g,o+=1}const c=s<=0?0:ic(s/(s+Math.max(nc,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=n.x,t.centroidZ=n.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,h=r/s;t.centroidX=l,t.centroidZ=h;let f=(l-n.x)*e.framingBias*c,p=(h-n.z)*e.framingBias*c;const d=Math.hypot(f,p);d>e.maxOffset&&(f=f/d*e.maxOffset,p=p/d*e.maxOffset),t.offsetX=f,t.offsetZ=p}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Zd(i){const t=[],e=i.ground.size;t.push(hi("ground","ground",0,0,e,e,-i.ground.thickness,0));for(const n of i.steps)t.push(hi(n.id,"step",n.x,n.z,n.width,n.depth,0,n.height));for(const n of i.doorways){const s=n.openingWidth/2,a=n.wallThickness;t.push(hi(`${n.id}-left`,"wall",n.x-s-n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(hi(`${n.id}-right`,"wall",n.x+s+n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(hi(`${n.id}-lintel`,"lintel",n.x,n.z,n.openingWidth,a,n.openingHeight,n.wallHeight))}for(const n of i.obstacles)t.push(hi(n.id,"obstacle",n.x,n.z,n.width,n.depth,0,n.height));return t}function hi(i,t,e,n,s,a,r,o){return{id:i,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:n-a/2,maxZ:n+a/2}}const Sn=1e-6;function ha(i,t,e){return i<t?t:i>e?e:i}function Tr(i,t,e,n,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of i)l.maxY>n+a+Sn||l.maxY<n-r-Sn||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Lo(i,t,e,n,s){let a=!1;const r=t.y+n;for(let o=0;o<2;o++)for(const c of i){if(c.maxY<=t.y+s+Sn||c.minY>=r-Sn)continue;const l=ha(t.x,c.minX,c.maxX),h=ha(t.z,c.minZ,c.maxZ),f=t.x-l,p=t.z-h,d=f*f+p*p;if(!(d>=e*e))if(a=!0,d>Sn*Sn){const g=Math.sqrt(d),_=(e-g)/g;t.x+=f*_,t.z+=p*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,u=c.maxZ-t.z,x=Math.min(g,_,m,u);x===g?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function Io(i,t,e,n,s){const a=t.y+n;for(const r of i){if(r.maxY<=t.y+s+Sn||r.minY>=a-Sn)continue;const o=ha(t.x,r.minX,r.maxX),c=ha(t.z,r.minZ,r.maxZ),l=t.x-o,h=t.z-c;if(l*l+h*h<e*e-Sn)return!0}return!1}const wr=1e-6;function ln(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Ua(i,t,e,n){const s=ln(t-i);return i+s*(1-Math.exp(-Math.max(e,wr)*n))}function sc(i,t,e,n){const s=ln(t-i),a=Math.abs(s);return a<=n||a<=e?t:ln(i+Math.sign(s)*Math.max(e,0))}function qd(i,t,e){const n=i.character,s=i.config.orientation,a=i.combat,r=Math.hypot(e.moveX,e.moveZ),o=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>wr,c=i.abilities.channeling,l=a.charging&&a.weapon==="bow"&&i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget;if(a.phase!=="idle")n.facing=a.attackFacing;else if(o||c)n.facing=ba(i,e);else if(l)n.facing=i.targeting.targetYaw;else if(r>Math.max(s.facingDeadZone,wr)){const g=Math.atan2(e.moveX,e.moveZ),_=s.facingTurnRate*Math.PI/180*t,m=s.facingSnapDeg*Math.PI/180;if(r>=.35)n.facing=sc(n.facing,g,_,m);else if(r>=s.facingMinMagnitude&&Math.abs(ln(g-n.facing))>s.facingDeadbandDeg*Math.PI/180){const x=Ua(n.facing,g,s.facingSmoothRate,t);n.facing=sc(n.facing,x,_,0)}}const h=n.velocity;Math.hypot(h.x,h.z)>.15&&(n.moveYaw=Math.atan2(h.x,h.z)),n.bodyYaw=Ua(n.bodyYaw,n.facing,s.bodyTurnRate,t);let f=Ua(n.headYaw,n.facing,s.headTurnRate,t);const p=s.maxHeadTurnDeg*Math.PI/180,d=ln(f-n.bodyYaw);d>p?f=n.bodyYaw+p:d<-p&&(f=n.bodyYaw-p),n.headYaw=f}const Rr=1e-6,jd=Math.PI/180;function Cr(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Uo(i,t,e){return i<t?t:i>e?e:i}function Ea(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Pr(i){const t=i.id,e=i.windowId;Object.assign(i,Ea()),i.id=t,i.windowId=e}function Kd(i){Pr(i)}function Jd(i){Pr(i.playerLink);for(const t of i.dummies)Pr(t.link)}function Qd(i,t){const e=[i.playerLink];for(const n of i.dummies)e.push(n.link);for(const n of e)n.linkWindow=Math.max(0,n.linkWindow-t),n.cooldown=Math.max(0,n.cooldown-t),n.linkWindow===0&&n.phase==="idle"&&n.source!=="none"&&(n.source="none",n.usedWindowId=-1)}function Dr(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(n.linkWindow=Math.max(n.linkWindow,s),n.source=t,n.windowId+=1,n.usedWindowId=-1,n.prevSprinting=!1)}function ua(i){const t=i.playerLink;if(t.phase==="idle")return;const e=t.id,n=t.windowId;Object.assign(t,Ea()),t.id=e,t.windowId=n,t.fromX=i.character.position.x,t.fromZ=i.character.position.z}function th(i,t){const e=i.config.links.search,n=i.character.position,s=Uo(e.maxAngleDeg,0,180)*jd;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of i.dummies){const l=c.position.x-n.x,h=c.position.z-n.z,f=Math.hypot(l,h);if(f<Rr||f>e.range)continue;const p=Math.atan2(l,h);Math.abs(ln(p-t))>s||f<o&&(o=f,a=c.id,r=p)}return{id:a,yaw:r,dist:a>0?o:0}}function eh(i,t,e,n){const s=i.config.links,a=i.playerLink,r=i.character.position,o=ba(i,t),c=th(i,o),l=c.id>0?c.yaw:o,h=c.id>0?Uo(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=n,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=h,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,i.dash.cooldown=Math.max(i.dash.cooldown,s.sharedCooldown),Cr(i,"link-start",a.id)}function nh(i,t){const e=i.playerLink;if(e.phase==="idle")return;const n=e.weapon===""?void 0:i.config.links.moves[e.weapon];if(!n){ua(i);return}if(e.weapon!==i.combat.weapon){ua(i);return}e.timer+=t;const s=c=>c==="windup"?n.windup:c==="active"?n.active:n.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Cr(i,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Cr(i,"link-end",e.id))}const r=n.windup+n.active+n.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=n.windup+e.timer:e.phase==="recovery"?o=n.windup+n.active+e.timer:o=r,e.progress=r>0?Uo(o/r,0,1):1,e.phase==="active"&&n.active>Rr){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Rr,n.active-e.timer),h=c/l;i.impulse.x=Math.sin(e.facing)*h,i.impulse.z=Math.cos(e.facing)*h}}function ih(i,t,e){const n=i.config.links,s=i.playerLink,a=i.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!n.enabled||!i.modules.links){s.phase!=="idle"&&ua(i);return}const r=i.combat,o=i.character.sprinting;o&&n.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&n.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,n.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&Dr(i,"sprint"),s.prevSprinting=o,nh(i,t);const c=n.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&i.dash.phase==="idle"&&!!c&&c.enabled&&eh(i,e,c,r.weapon)}const Lr=1e-6;function Nn(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function kl(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Fl(i){const t=i.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=kl()}function sh(i){return{weapon:si[Math.max(0,i-1)]??si[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:kl()}}function ah(i,t){return ba(i,t)}function rh(i,t){const e=i.config.targeting;if(!e.targetAssist||!i.modules.targeting||!i.targeting.hasTarget)return t;const n=i.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*i.config.combat.minLungeScale;return Math.min(Math.max(n,0)+a,s)}function Nl(i,t,e,n){const s=i.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=n,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=ah(i,t),s.attackProgress=0,s.timings=e,s.attackId+=1,Nn(i,"attack-start",n)}function zl(i){return Math.max(0,i.config.combat.settle)}function Ir(i,t,e){const n=i.config.combat.weapons[i.combat.weapon];Nl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:zl(i),lunge:rh(i,n.lunge[e-1]??0)},e)}function oh(i,t,e){const n=i.config.combat.bow.release;i.combat.lastCharge=e,Nl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:zl(i),lunge:n.lunge},0),Nn(i,"charge-release",e)}function ch(i,t,e){const n=i.combat;if(n.phase==="idle")return;const s=n.timings;n.phaseTimer+=t;let a=0;for(;n.phase!=="idle"&&a++<8;){const c=n.phase==="windup"?s.windup:n.phase==="active"?s.active:n.phase==="recovery"?s.recovery:s.settle;if(n.phaseTimer<c)break;if(n.phaseTimer-=c,n.phase==="windup")n.phase="active",Nn(i,"attack-active",n.comboIndex);else if(n.phase==="active")n.phase="recovery";else if(n.phase==="recovery")n.phase="settle",Nn(i,"attack-end",n.comboIndex);else if(n.phase="idle",n.phaseTimer=0,n.comboWindow=i.config.combat.comboWindow,n.queued){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Ir(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}if(n.queued&&n.phase==="recovery"){const c=n.timings.recovery;if(c>Lr&&n.phaseTimer>=c*i.config.combat.cancelWindow){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Ir(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;n.phase==="windup"?o=n.phaseTimer:n.phase==="active"?o=s.windup+n.phaseTimer:n.phase==="recovery"?o=s.windup+s.active+n.phaseTimer:n.phase==="settle"&&(o=r),n.phase!=="idle"&&(n.attackProgress=r>0?Math.min(1,o/r):1)}function lh(i,t,e){const n=i.combat,s=i.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=si.length){const c=si[e.weaponSlot-1];c!==n.weapon&&(n.weapon=c,Fl(i),ua(i),Nn(i,"weapon-change",e.weaponSlot))}n.phase==="idle"&&n.comboWindow>0&&(n.comboWindow=Math.max(0,n.comboWindow-t),n.comboWindow===0&&n.comboIndex>0&&(n.comboIndex=0,Nn(i,"combo-reset",0))),ch(i,t,e);const a=s.weapons[n.weapon],r=i.dash.phase==="active";if(a.comboCount>0){const c=i.playerLink.phase!=="idle"||i.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(n.phase==="idle"){const h=n.comboWindow>0&&n.comboIndex<a.comboCount?n.comboIndex+1:1;Ir(i,e,h)}else n.queued=!0}else if(n.weapon!=="staff"){if(n.weapon==="bow"&&(!r&&!i.playerLink.consumedAttack&&e.attackPressed&&n.phase==="idle"&&!n.charging&&(n.charging=!0,n.charge=0,Nn(i,"charge-start",0)),n.charging&&e.attackHeld&&(n.charge=Math.min(1,n.charge+t/Math.max(s.bow.maxChargeTime,Lr))),n.charging&&!r&&(e.attackReleased||!e.attackHeld))){n.charging=!1;const c=n.charge;n.charge=0,c>=s.bow.minChargeToFire&&n.phase==="idle"?oh(i,e,c):Nn(i,"charge-release",0)}}if(!(i.playerLink.phase==="active")&&(i.impulse.x=0,i.impulse.z=0,n.phase==="active"&&n.timings.active>Lr)){const c=n.timings.lunge/n.timings.active;i.impulse.x=Math.sin(n.attackFacing)*c,i.impulse.z=Math.cos(n.attackFacing)*c}}const Ur=1e-6;function ka(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function dh(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function hh(i){const t=i.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=i.character.position.x,t.fromZ=i.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function ac(i,t,e){return i<t?t:i>e?e:i}function uh(i,t,e){const n=i.config.dash,a=i.character.position,r=i.config.worldBounds,o=Math.max(.05,n.blinkStep),c=Math.max(0,n.blinkDistance);let l=0,h=a.x,f=a.z;for(;l<c-Ur;){const p=Math.min(c,l+o),d=a.x+t*p,g=a.z+e*p,_=ac(d,r.minX,r.maxX),m=ac(g,r.minZ,r.maxZ),u={x:_,y:a.y,z:m};if(Io(i.boxes,u,i.config.characterRadius,i.config.characterHeight,i.config.stepHeight)||(h=_,f=m,l=p,_!==d||m!==g))break}return{x:h,z:f}}function fh(i,t,e){const n=i.dash,s=i.config.dash;if(n.phase==="active"&&n.timer<=0&&(n.phase="idle",n.timer=0,Dr(i,"roll")),n.cooldown>0){const o=n.cooldown;n.cooldown=Math.max(0,n.cooldown-t),o>0&&n.cooldown===0&&ka(i,"dash-ready",0)}const a=i.combat;if(e.sprintPressed&&n.cooldown<=0&&n.phase==="idle"&&a.phase==="idle"&&!a.charging&&i.playerLink.phase==="idle"){const o=Id(i,e),c=o.x,l=o.z,h=i.combat.weapon==="staff";if(n.kind=h?"blink":"roll",n.dirX=c,n.dirZ=l,n.fromX=i.character.position.x,n.fromZ=i.character.position.z,n.id+=1,n.cooldown=h?s.blinkCooldown:s.rollCooldown,h){const f=uh(i,c,l);i.character.position.x=f.x,i.character.position.z=f.z,n.toX=f.x,n.toZ=f.z,n.duration=0,n.timer=0,n.phase="idle",s.blinkClearVelocity&&(i.character.velocity.x=0,i.character.velocity.z=0),Dr(i,"blink"),ka(i,"blink",n.id)}else n.phase="active",n.duration=Math.max(Ur,s.rollDuration),n.timer=n.duration,n.toX=n.fromX+c*s.rollDistance,n.toZ=n.fromZ+l*s.rollDistance,ka(i,"roll",n.id)}if(n.phase==="active"&&n.kind==="roll"){const o=Math.max(Ur,n.timer),c=i.character.position.x,l=i.character.position.z;i.impulse.x=(n.toX-c)/o,i.impulse.z=(n.toZ-l)/o}n.phase==="active"&&(n.timer=Math.max(0,n.timer-t))}const Ve=1e-6,kr=Math.PI*2,ph=7,mh=18;function rc(i,t,e){return i<t?t:i>e?e:i}function gh(i){return Math.atan2(Math.sin(i),Math.cos(i))}function oc(i,t,e,n){return i+gh(t-i)*(1-Math.exp(-Math.max(e,Ve)*n))}function ko(i,t,e){i.events.push({type:t,tick:i.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function _h(i){const t=[];for(let e=0;e<i.count;e++){const n=i.spawn[e]??{x:0,z:0},s=i.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:n.x,homeZ:n.z,position:{x:n.x,y:0,z:n.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:n.x,targetZ:n.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Ll(),link:Ea()})}return t}function xh(i){const t=La.indexOf(i);return La[(t+1)%La.length]}function vh(i){const t=i.config.dummies;for(let e=0;e<i.dummies.length;e++){const n=i.dummies[e],s=t.spawn[e]??{x:n.homeX,z:n.homeZ},a=t.initialModes[e]??n.initialMode;n.mode=a,n.initialMode=a,n.homeX=s.x,n.homeZ=s.z,n.position.x=s.x,n.position.y=0,n.position.z=s.z,n.velocity.x=0,n.velocity.y=0,n.velocity.z=0,n.facing=0,n.bodyYaw=0,n.headYaw=0,n.gaitPhase=0,n.stride=1,n.distance=0,n.targetX=s.x,n.targetZ=s.z,n.wanderTimer=0,n.attackCooldown=0,n.attackPhase="idle",n.attackPhaseTimer=0,n.attackProgress=0;const r=n.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,Kd(n.link)}i.dummyAttackCount=0}function Mh(i,t,e){const n=Ia(i)*kr,s=Math.sqrt(Ia(i))*e.wanderRadius;t.targetX=t.homeX+Math.cos(n)*s,t.targetZ=t.homeZ+Math.sin(n)*s,t.wanderTimer=e.wanderInterval*(.6+Ia(i)*.8)}function yh(i,t){return i.attackPhase==="windup"?t.attackWindup:i.attackPhase==="active"?t.attackActive:i.attackPhase==="recovery"?t.attackRecovery:0}function Sh(i,t,e,n){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(yh(t,n),Ve);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",ko(i,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=n.attackWindup+n.attackActive+n.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=n.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=n.attackWindup+n.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function bh(i,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const n=i.character.position,s=n.x-t.position.x,a=n.z-t.position.z,r=Math.hypot(s,a),o=r>Ve?s/r:0,c=r>Ve?a/r:0;let l=0,h=0;if(t.mode==="wander"){const p=t.targetX-t.position.x,d=t.targetZ-t.position.z,g=Math.hypot(p,d);(t.wanderTimer<=0||g<.3)&&Mh(i,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,u=Math.hypot(_,m);u>Ve&&(l=_/u,h=m/u)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,h=c);else if(t.mode==="keep-distance"){const p=r-e.keepDistance;p>e.keepDeadZone?(l=o,h=c):p<-e.keepDeadZone?(l=-o,h=-c):(l=-c*e.keepStrafe,h=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,h=c);let f=t.facing;return t.mode==="wander"?Math.hypot(l,h)>Ve&&(f=Math.atan2(l,h)):r>Ve&&(f=Math.atan2(o,c)),{x:l,z:h,facing:f}}function Eh(i,t,e,n){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=i.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=n.attackRange+Ve&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=n.attackInterval,i.dummyAttackCount+=1,ko(i,"dummy-attack",e))}Sh(i,e,t,n);const s=bh(i,e,n),a=1-Math.exp(-Math.max(n.acceleration,Ve)*t);e.velocity.x+=(s.x*n.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*n.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=oc(e.bodyYaw,e.facing,ph,t),e.headYaw=oc(e.headYaw,e.facing,mh,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=i.config.stepHeight;Lo(i.boxes,e.position,n.radius,n.height,c)&&Io(i.boxes,e.position,n.radius,n.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const h=i.config.worldBounds;e.position.x=rc(e.position.x,h.minX,h.maxX),e.position.z=rc(e.position.z,h.minZ,h.maxZ);const f=Tr(i.boxes,e.position.x,e.position.z,e.position.y,n.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+Ve&&(e.position.y=f);const p=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=p;const d=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(i.config.strideSpeedCap,d/Math.max(i.config.moveSpeed,Ve)),_=Math.max(i.config.strideLength*(1+g*i.config.strideSpeedGain),Ve);e.stride=_,e.gaitPhase=(e.gaitPhase+p/_*kr)%kr}function Ah(i,t,e){const n=i.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=i.dummies.length){const s=i.dummies[e.dummyClickId-1];s.mode=xh(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,ko(i,"dummy-mode",s)}for(const s of i.dummies)Eh(i,t,s,n)}const ui=1e-6,cc=Math.PI*2;function Fa(i,t){return Math.sqrt(i*i+t*t)}function Ss(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Th(i){const t=i.character,e=i.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=i.config.strideLength,t.distance=0,t.coyoteTime=i.config.coyoteTime,t.jumpBuffer=0,Fl(i)}function wh(i,t,e){const n=i.config,s=i.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Fa(o,c);l>1&&(o/=l,c/=l);const h=i.combat.phase!=="idle",f=i.playerLink.phase!=="idle",p=h||i.dash.phase==="active"||f;s.sprinting=!p&&e.sprintHeld&&l>ui;const d=n.combat.weapons[i.combat.weapon];let g=d?d.moveMultiplier:1;p?g*=i.combat.phase==="settle"?n.combat.settleMoveScale:n.combat.attackMoveScale:i.combat.charging?g*=n.combat.bow.chargeMoveMultiplier:i.abilities.channeling&&(g*=n.abilities.arcane.moveScale);const _=n.moveSpeed*(s.sprinting?n.sprintMultiplier:1)*g;if(p)r.x=o*_,r.z=c*_;else{const T=l>ui?n.acceleration:n.friction,D=1-Math.exp(-T*t);r.x+=(o*_-r.x)*D,r.z+=(c*_-r.z)*D}e.jumpPressed?s.jumpBuffer=n.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?n.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=n.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,Ss(i,"jumped",n.jumpSpeed)),i.events.some(T=>T.type==="blink"&&T.tick===i.tick)&&(r.x=0,r.z=0,i.impulse.x=0,i.impulse.z=0);const u=a.x,x=a.z;if(a.x+=(r.x+i.impulse.x+i.playerHurt.knockX)*t,a.z+=(r.z+i.impulse.z+i.playerHurt.knockZ)*t,Lo(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight)){if(Io(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight))a.x=u,a.z=x,r.x=0,r.z=0;else{const T=a.x-u,D=a.z-x;Math.abs(T)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(D)<Math.abs(r.z*t)*.5&&(r.z=0)}Ss(i,"blocked",1)}const v=n.worldBounds;a.x=lc(a.x,v.minX,v.maxX),a.z=lc(a.z,v.minZ,v.maxZ);const L=Tr(i.boxes,a.x,a.z,a.y,n.characterRadius,n.stepHeight,n.fallTolerance);s.grounded&&L>a.y+ui&&L-a.y<=n.stepHeight+ui&&(a.y=L,r.y=0,Ss(i,"stepUp",L));const w=a.y;r.y-=n.gravity*t,a.y+=r.y*t;const C=Tr(i.boxes,a.x,a.z,w,n.characterRadius,n.stepHeight,Number.POSITIVE_INFINITY);C>Number.NEGATIVE_INFINITY&&a.y<=C&&r.y<=0?(a.y=C,r.y=0,s.grounded||Ss(i,"landed",C),s.grounded=!0):s.grounded=!1;const P=Fa(a.x-u,a.z-x);s.distance+=P;const b=Fa(r.x,r.z),S=Math.min(n.strideSpeedCap,b/Math.max(n.moveSpeed,ui)),R=Math.max(n.strideLength*(1+S*n.strideSpeedGain),ui);s.stride=R,s.gaitPhase=(s.gaitPhase+P/R*cc)%cc}function lc(i,t,e){return i<t?t:i>e?e:i}const Rh=1e-6,dc=2.399963229728653;function hc(i,t,e){return i<t?t:i>e?e:i}function uc(i,t,e,n,s,a,r,o,c){const l=t.x-i.x,h=t.z-i.z,f=Math.hypot(l,h),p=e+n;if(f>=p)return;let d,g,_;f<Rh?(d=o,g=c,_=p):(d=l/f,g=h/f,_=p-f);const m=_+r;i.x-=d*m*s,i.z-=g*m*s,t.x+=d*m*a,t.z+=g*m*a}function Ch(i){const t=i.config.separation,e=i.dummies,n=i.character.position,s=i.config.characterRadius,a=i.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let h=0;h<r;h++){for(let f=0;f<e.length;f++)for(let p=f+1;p<e.length;p++){const d=(f*3+p)*dc;uc(e[f].position,e[p].position,a,a,.5,.5,o,Math.cos(d),Math.sin(d))}for(let f=0;f<e.length;f++){const p=(f+1)*dc;uc(n,e[f].position,s,a,0,1,o,Math.cos(p),Math.sin(p))}}const c=i.config.stepHeight,l=i.config.worldBounds;for(const h of e)Lo(i.boxes,h.position,a,i.config.dummies.height,c),h.position.x=hc(h.position.x,l.minX,l.maxX),h.position.z=hc(h.position.z,l.minZ,l.maxZ)}const fc=1e-6,Ph=Math.PI/180;function Dh(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Lh(i,t,e){return i<t?t:i>e?e:i}function Ih(i,t,e){const n=i.config.targeting,s=i.targeting,a=i.character.position;let r=i.character.facing;Math.hypot(e.moveX,e.moveZ)>fc&&(r=Math.atan2(e.moveX,e.moveZ));const c=Lh(n.maxAngleDeg,0,180)*Ph;let l=Number.POSITIVE_INFINITY,h=0,f=0,p=0;for(const d of i.dummies){const g=d.position.x-a.x,_=d.position.z-a.z,m=Math.hypot(g,_);if(m<fc||m>n.range)continue;const u=Math.atan2(g,_),x=Math.abs(ln(u-r));if(x>c)continue;const y=m-n.frontBias*Math.cos(x);y<l&&(l=y,h=d.id,f=u,p=m)}s.targetId=h,s.targetYaw=f,s.targetDist=p,s.hasTarget=h>0}function Uh(i,t){return{tick:0,time:0,rngState:2654435769,config:i,boxes:Zd(t),gridMeta:t.grid,character:{position:{x:i.spawn.x,y:i.spawn.y,z:i.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:i.strideLength,distance:0,coyoteTime:i.coyoteTime,jumpBuffer:0},combat:sh(1),playerLink:Ea(),abilities:Od(),impulse:{x:0,z:0},targeting:Dh(),playerHurt:Ll(),hitCount:0,dash:{...dh(),fromX:i.spawn.x,fromZ:i.spawn.z,toX:i.spawn.x,toZ:i.spawn.z},camera:{...Il(),centroidX:i.spawn.x,centroidZ:i.spawn.z},dummies:_h(i.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,dummies:!0}}}function kh(i){Th(i),vh(i),Jd(i);const t=i.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=i.playerHurt;e.type="none",e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,i.hitCount=0,Bd(i),hh(i),Ul(i),i.events.length=0}function pc(i,t,e){if(i.events.length=0,i.tick+=1,i.time+=t,i.impulse.x=0,i.impulse.z=0,e.resetPressed){kh(i);const n=i.config.spawn;return i.events.push({type:"reset",tick:i.tick,x:n.x,y:n.y,z:n.z,value:0}),i}return i.modules.dummies&&i.modules.targeting?Ih(i,t,e):(i.targeting.targetId=0,i.targeting.targetYaw=0,i.targeting.targetDist=0,i.targeting.hasTarget=!1),ih(i,t,e),i.modules.combat&&lh(i,t,e),i.modules.dash&&fh(i,t,e),i.modules.movement&&wh(i,t,e),i.modules.orientation&&qd(i,t,e),i.modules.dummies&&Ah(i,t,e),Ud(i,t),Qd(i,t),i.modules.abilities&&$d(i,t,e),i.modules.dummies&&(zd(i,t),i.modules.separation&&Ch(i)),i.modules.camera?Yd(i):Ul(i),i}function Fh(i){let t=0;return{frame(e,n,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=i.config.fixedDt,c=i.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const h=l===0?n:{...n,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};pc(i,o,h),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){pc(i,i.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Ol={slopPx:12,longPressMs:450,doubleTapMs:280};function Nh(i,t,e=Ol.slopPx){if(i.distance<e)return{...i,worldX:0,worldZ:0};const n=i.dx/i.distance,s=i.dy/i.distance,a=t.rightX*n+t.forwardX*-s,r=t.rightZ*n+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...i,worldX:0,worldZ:0}:{...i,worldX:a/o,worldZ:r/o}}function Wn(i,t,e,n,s,a){const r=Math.hypot(e,n);return{button:i,kind:t,dx:e,dy:n,distance:r,angleDeg:r>.001?Math.atan2(n,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function zh(i=Ol){const t=new Map,e=new Map,n=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),Wn(s,"press",0,0,0,1)},move(s,a,r,o){const c=n(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY;return!c.dragging&&Math.hypot(l,h)>=i.slopPx?(c.dragging=!0,Wn(c.button,"drag",l,h,o-c.startedAt,1)):null},end(s,a,r,o){const c=n(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY,f=o-c.startedAt,p=Math.hypot(l,h);if(c.dragging||c.longFired||p>=i.slopPx)return Wn(c.button,"release",l,h,f,1);const d=e.get(c.button);return d!==void 0&&o-d.at<=i.doubleTapMs&&Math.hypot(a-d.x,r-d.y)<=i.slopPx*2?(e.delete(c.button),Wn(c.button,"doubleTap",l,h,f,2)):(e.set(c.button,{at:o,x:a,y:r}),Wn(c.button,"tap",l,h,f,1))},cancel(s,a){const r=n(s);return r?(t.delete(s),Wn(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=i.longPressMs)return a.longFired=!0,Wn(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const Na=.001,Oh=18;function Fr(i,t,e){return i<t?t:i>e?e:i}function Nr(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Bh(i){const t=i.length;if(t<2)return null;const e=i[t-2],n=i[t-1];return e.id===n.id?null:[e,n]}function Hh(i,t,e,n,s=Oh){const a=Bh(t);if(!a)return{state:Nr(),scale:1,started:!1,ended:i.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(n)?n:1.25),l=1/c,h=c;if(!Number.isFinite(r)||r<Na)return{state:{active:!0,lastDist:0,armDist:0,armed:i.armed},scale:1,started:!i.active,ended:!1,armedNow:!1,pinching:i.armed};if(!i.active){const g=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!i.armed)return i.armDist<Na?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-i.armDist)<o?{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(i.lastDist<Na)return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=r/i.lastDist,p=Math.max(0,Number.isFinite(e)?e:1),d=Number.isFinite(f)&&f>0?Math.pow(f,p):1;return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:Fr(Number.isFinite(d)?d:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Gh(i,t,e,n){const s=Math.min(e,n),a=Math.max(e,n),r=Number.isFinite(t)&&t>0?t:1,o=i*r;return Number.isFinite(o)?Fr(o,s,a):Fr(i,s,a)}function Vh(i,t){const e=Number.isFinite(t)&&t>0?t:1,n=Number.isFinite(i)?i:0;return Math.pow(e,n/100)}const za=["jump","sprint","reset","attack","skill2"],Wh=8,Xh=26,Oa=16,mc=20,gc=140,$h=18,Yh=16,Zh=400,qh=1.0001;function Ba(i){return i instanceof Element&&i.closest("[data-ui-button], [data-ui-region], #debug-panel, #hud, #weapon-bar, #hint")!==null}function jh(i){const{maxRadiusPx:t,deadZone:e,getBasis:n,zoom:s}=i,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,h=0,f=null,p=0,d=0,g=!1,_=null,m=null,u=0,x=0,y=0,v=0,L=!1,w=!0,C=-1;const P=zh({slopPx:mc,longPressMs:450,doubleTapMs:350});let b=[],S=null;const R=new Set;function T(U){U&&b.push(U)}const D=new Map;let O=Nr(),H=!1,I=1;function X(){const U=Array.from(D.values()),nt=s(),z=Hh(O,U,nt.pinchGain,nt.maxStepRatio,$h);if(O=z.state,H=z.pinching,z.scale!==1&&(I*=z.scale),z.started||z.armedNow)f=null,g=!0,_=null;else if(z.ended&&r===null&&U.length===1){const it=U[0];r=it.id,o=it.x,c=it.y,l=0,h=0,f=null,g=!0,_=null}}const Y={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},q={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let et=0,mt=0;const vt={},ft=new Set,j=[];function st(){for(const U of za)vt[U]!==void 0&&(vt[U]=void 0),wt(U);P.reset(),R.clear(),D.clear(),O=Nr(),H=!1,r=null,l=0,h=0,f=null,g=!1,_=null,m=null,C=-1,y=0,v=0,L=!1,w=!0}const ht=()=>{document.hidden&&st()},pt=U=>{if(Ba(U.target)){R.add(U.pointerId);return}R.delete(U.pointerId),D.set(U.pointerId,{id:U.pointerId,x:U.clientX,y:U.clientY}),r===null&&!H&&(r=U.pointerId,o=U.clientX,c=U.clientY,l=0,h=0,f=U.pointerId,p=U.clientX,d=U.clientY,g=!1),X()},gt=U=>{if(U.pointerId===m&&(U.pointerType==="mouse"&&U.buttons===0||U.clientX===0&&U.clientY===0&&(u!==0||x!==0)||(w?(y=U.clientX-u,v=U.clientY-x):(u=U.clientX,x=U.clientY,w=!0,y=0,v=0))),T(P.move(U.pointerId,U.clientX,U.clientY,performance.now())),!R.has(U.pointerId)&&D.has(U.pointerId)&&(D.set(U.pointerId,{id:U.pointerId,x:U.clientX,y:U.clientY}),X()),R.has(U.pointerId)||U.pointerId!==r)return;U.pointerId===f&&Math.hypot(U.clientX-p,U.clientY-d)>Wh&&(g=!0);let nt=U.clientX-o,z=U.clientY-c;const it=Math.hypot(nt,z),rt=a();it>rt&&(nt*=rt/it,z*=rt/it),l=nt,h=z};function wt(U){if(!Y[U])return;Y[U]=!1,U==="attack"&&(q.attackReleased=!0);const nt=document.getElementById(`btn-${U}`);nt==null||nt.classList.remove("is-down")}const Rt=U=>{const nt=D.delete(U.pointerId),z=R.delete(U.pointerId);nt&&X(),U.pointerId===m&&(m=null,L?C=performance.now():(y=0,v=0,C=-1)),T(P.end(U.pointerId,U.clientX,U.clientY,performance.now()));for(const it of za)vt[it]===U.pointerId&&(vt[it]=void 0,wt(it));z||(U.pointerId===f&&(!g&&!Ba(U.target)&&(_={x:U.clientX,y:U.clientY}),f=null),U.pointerId===r&&(r=null,l=0,h=0))};for(const U of za){const nt=document.getElementById(`btn-${U}`);if(!nt)continue;const z=U==="attack"||U==="skill2",it=M=>{if(M.preventDefault(),vt[U]===void 0){vt[U]=M.pointerId,Y[U]=!0,U==="jump"&&(q.jump=!0),U==="reset"&&(q.reset=!0),U==="sprint"&&(q.sprintPressed=!0),U==="attack"&&(q.attackPressed=!0),U==="skill2"&&(q.skill2=!0),nt.classList.add("is-down"),T(P.begin(U,M.pointerId,M.clientX,M.clientY,performance.now()));try{nt.setPointerCapture(M.pointerId)}catch{}z&&(m=M.pointerId,u=M.clientX,x=M.clientY,w=!(M.clientX===0&&M.clientY===0),y=0,v=0,L=!1,C=-1)}},rt=M=>{vt[U]===M.pointerId&&(vt[U]=void 0,wt(U),T(P.end(M.pointerId,M.clientX,M.clientY,performance.now())))},E=M=>{vt[U]===M.pointerId&&(vt[U]=void 0,wt(U),T(P.cancel(M.pointerId,performance.now())))};nt.addEventListener("pointerdown",it),nt.addEventListener("pointerup",rt),nt.addEventListener("pointercancel",E),j.push(()=>{nt.removeEventListener("pointerdown",it),nt.removeEventListener("pointerup",rt),nt.removeEventListener("pointercancel",E)})}const It=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const U of It){const nt=z=>{z.preventDefault(),et=Number(U.dataset.weapon)||0};U.addEventListener("pointerdown",nt),j.push(()=>U.removeEventListener("pointerdown",nt))}const bt=U=>{const nt=U.key.toLowerCase();if((nt===" "||nt.startsWith("arrow"))&&U.preventDefault(),ft.has(nt))return;ft.add(nt),nt===" "&&(q.jump=!0),nt==="r"&&(q.reset=!0),nt==="shift"&&(q.sprintPressed=!0),nt==="j"&&(q.attackPressed=!0),nt==="k"&&(q.skill2=!0),nt>="1"&&nt<="5"&&(et=Number(nt)),nt>="6"&&nt<="9"&&(mt=Number(nt)-5);const z=Math.max(qh,s().keyStep||1.12);(nt==="="||nt==="+")&&(I*=z),(nt==="-"||nt==="_")&&(I/=z)},Xt=U=>{const nt=U.key.toLowerCase();ft.has(nt)&&(ft.delete(nt),nt==="j"&&(q.attackReleased=!0))},F=U=>{if(Ba(U.target))return;U.preventDefault();const nt=U.deltaMode===1?U.deltaY*Yh:U.deltaMode===2?U.deltaY*Zh:U.deltaY;I*=Vh(nt,s().wheelStep)},ie=U=>{U.preventDefault()};return window.addEventListener("pointerdown",pt),window.addEventListener("pointermove",gt),window.addEventListener("pointerup",Rt),window.addEventListener("pointercancel",Rt),window.addEventListener("blur",st),document.addEventListener("visibilitychange",ht),window.addEventListener("keydown",bt),window.addEventListener("keyup",Xt),window.addEventListener("wheel",F,{passive:!1}),window.addEventListener("gesturestart",ie),{peekAim(){const U=performance.now(),nt=Math.hypot(y,v),z=m!==null||C>=0&&U-C<gc;if(!(z&&L&&nt>=Oa))return{active:!1,holding:z,x:0,z:0,dx:y,dy:v};const rt=n(),E=y/nt,M=v/nt,V=rt.rightX*E+rt.forwardX*-M,K=rt.rightZ*E+rt.forwardZ*-M,at=Math.hypot(V,K)||1;return{active:!0,holding:z,x:V/at,z:K/at,dx:y,dy:v}},sample(){const U=a();let nt=r!==null?Math.max(-1,Math.min(1,l/U)):0,z=r!==null?Math.max(-1,Math.min(1,h/U)):0,it=0,rt=0;(ft.has("a")||ft.has("arrowleft"))&&(it-=1),(ft.has("d")||ft.has("arrowright"))&&(it+=1),(ft.has("w")||ft.has("arrowup"))&&(rt-=1),(ft.has("s")||ft.has("arrowdown"))&&(rt+=1),nt+=it,z+=rt;let E=Math.hypot(nt,z);E>1&&(nt/=E,z/=E,E=1);const M=nt,V=z;E<e&&(nt=0,z=0);const K=n();let at=K.rightX*nt+K.forwardX*-z,tt=K.rightZ*nt+K.forwardZ*-z;const ot=Math.hypot(at,tt);ot>1&&(at/=ot,tt/=ot);const ut=performance.now();T(P.poll(ut));const _t=Math.hypot(y,v);m!==null&&(_t>=Xh?L=!0:_t<Oa&&(L=!1));const Nt=m!==null||C>=0&&ut-C<gc,lt=Nt&&L&&_t>=Oa;let Mt=0,Lt=0;if(lt){const N=y/_t,B=v/_t,k=K.rightX*N+K.forwardX*-B,G=K.rightZ*N+K.forwardZ*-B,ct=Math.hypot(k,G)||1;Mt=k/ct,Lt=G/ct}!Nt&&m===null&&(y=0,v=0,C=-1,L=!1);const Ut=_;_=null;const Tt=I;I=1;const Gt={moveX:at,moveZ:tt,jumpPressed:q.jump,sprintHeld:Y.sprint||ft.has("shift"),sprintPressed:q.sprintPressed,resetPressed:q.reset,attackPressed:q.attackPressed,attackHeld:Y.attack||ft.has("j"),attackReleased:q.attackReleased,skill2Pressed:q.skill2,weaponSlot:et,dummyClickId:mt,aimX:Mt,aimZ:Lt,aimActive:lt};q.jump=!1,q.reset=!1,q.sprintPressed=!1,q.attackPressed=!1,q.attackReleased=!1,q.skill2=!1,et=0,mt=0;const Ft=b.map(N=>Nh(N,K,mc));b=[],Ft.length>0&&(S=Ft[Ft.length-1]);const Zt=r!==null?"pointer":ft.size>0?"keyboard":"idle";return{intents:Gt,stickX:nt,stickY:z,stickRawX:M,stickRawY:V,stickHeld:r!==null,aimDX:y,aimDY:v,source:Zt,tap:Ut,zoomScale:Tt,gestures:Ft,lastGesture:S}},dispose(){window.removeEventListener("pointerdown",pt),window.removeEventListener("pointermove",gt),window.removeEventListener("pointerup",Rt),window.removeEventListener("pointercancel",Rt),window.removeEventListener("blur",st),document.removeEventListener("visibilitychange",ht),window.removeEventListener("keydown",bt),window.removeEventListener("keyup",Xt),window.removeEventListener("wheel",F),window.removeEventListener("gesturestart",ie),P.reset();for(const U of j)U()}}}const fa=1,pa=2,ma=4,Bl=8,ga=16,rs=32,Hl=64,Gl=128,Kh=[[fa,"atk"],[pa,"dash"],[ma,"link"],[Bl,"air"],[ga,"hurt"],[rs,"aim"],[Hl,"spr"],[Gl,"chan"]];function fi(i){if(i===0)return"-";const t=Kh.filter(([e])=>(i&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Jh=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw"],Qh=0,tu=15,Ha=19,tn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Ce=i=>Number.isFinite(i)?Math.round(i*1e3)/1e3:0,en=i=>Math.round(i*180/Math.PI*10)/10,Ga=Math.PI*2;function bs(i){let t=i%Ga;return t>Math.PI&&(t-=Ga),t<-Math.PI&&(t+=Ga),t}function eu(i,t){let e=0;return i.combat.phase!=="idle"&&(e|=fa),i.dash.phase!=="idle"&&(e|=pa),i.playerLink.phase!=="idle"&&(e|=ma),i.character.grounded||(e|=Bl),i.playerHurt.type!=="none"&&(e|=ga),t.intents.aimActive&&(e|=rs),i.character.sprinting&&(e|=Hl),i.abilities.channeling&&(e|=Gl),e}function nu(i){const t=`(${i.x.toFixed(1)},${i.z.toFixed(1)})`;switch(i.type){case"attack-start":return`slot${i.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${i.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${i.value} ${t}`;case"weapon-change":return`slot${i.value}`;case"dummy-mode":return`dummy${i.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return i.value!==0?`v${i.value}`:""}}function iu(i){const t={sampleHz:i.sampleHz??tn.sampleHz,sampleCapacity:i.sampleCapacity??tn.sampleCapacity,eventCapacity:i.eventCapacity??tn.eventCapacity,anomalyCapacity:i.anomalyCapacity??tn.anomalyCapacity,dirJumpDeg:i.dirJumpDeg??tn.dirJumpDeg,aimDropDeg:i.aimDropDeg??tn.aimDropDeg,freezeMs:i.freezeMs??tn.freezeMs,freezeSpeed:i.freezeSpeed??tn.freezeSpeed,stickLostMs:i.stickLostMs??tn.stickLostMs,spikeMs:i.spikeMs??tn.spikeMs},e=i.meta,n=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0};let o=!0,c=-1,l=-1e9,h=null,f=0,p=0,d="",g=-1,_=-1,m=-1,u=0,x=-1e9,y=-1,v={},L=0,w=0;function C(T,D){const O=1/t.sampleHz,H=T[Qh];H-l<O-1e-6||(n.length>=t.sampleCapacity&&n.shift(),n.push(T),l=H)}function P(T,D,O,H,I,X){const Y=v[T]??-1e9;if(D-Y<1.2)return;if(v[T]=D,T==="frameSpike"){let et=0;for(const mt of a)mt.kind==="frameSpike"&&et++;if(et>=6)return}a.length>=t.anomalyCapacity&&a.shift();let q=n.slice(-7);X&&(q.length===0||q[q.length-1]!==X)&&(q=[...q.slice(-6),X]),a.push({kind:T,t:Ce(D),tick:O,ms:Math.round(H),detail:I,ctx:q}),T==="dirJump"?r.dirJumps++:T==="aimDrop"?r.aimDrops++:T==="moveFreeze"?r.freezes++:T==="stickLost"&&r.stickLosts++}function b(T,D,O,H){s.length>=t.eventCapacity&&s.shift(),s.push({t:Ce(O),tick:H,k:T,d:D})}function S(T){switch(T.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=T.tick;break}}function R(){const T=r,D=T.wallMs/1e3,O=T.gestures,H=X=>Object.entries(O).filter(([Y])=>Y.endsWith(`.${X}`)).reduce((Y,[,q])=>Y+q,0),I=[];if(I.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),I.push(`运行 ${D.toFixed(1)}s / ${T.frames} 帧 · ${T.fps.toFixed(1)}fps · 最大 ${T.dtMax.toFixed(0)}ms · 尖峰 ${T.spikes} · 步 ${T.steps}`),I.push(`摇杆活跃 ${D>0?Math.round(T.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${H("press")}（单击 ${H("tap")} / 双击 ${H("doubleTap")} / 拖拽 ${H("drag")} / 长按 ${H("longPress")} / 打断 ${H("cancel")} / 拖放 ${H("release")}）`),I.push(`攻击 ${T.attacks}(中${T.hits}) · 受击 ${T.hurts} · 派生 ${T.links}(中${T.linkHits}) · 翻滚 ${T.rolls} 闪现 ${T.blinks} · 跳 ${T.jumps} · 复位 ${T.resets}`),I.push(`法杖 引导${T.channels} 飞弹${T.bolts} 电环${T.rings} · 弓蓄力${T.bowCharges} · 当前武器 ${d||"-"}`),I.push(`异常 ${T.dirJumps+T.aimDrops+T.freezes+T.stickLosts}（dir ${T.dirJumps} / aim ${T.aimDrops} / freeze ${T.freezes} / stick ${T.stickLosts}） · 掉帧尖峰 ${T.spikes}`+(T.inTurns>0?` · 输入转向 ${T.inTurns} 次（最大 ${T.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const X of a.slice(-6)){I.push(`· ${X.kind} @t${X.t.toFixed(2)} tick${X.tick} ${X.ms>0?`${X.ms}ms `:""}${X.detail}`);const Y=X.ctx.map(et=>String(et[tu])).join(" "),q=X.ctx.map(et=>et[Ha]===""||et[Ha]==null?".":String(et[Ha])).join(" ");I.push(`  yaw ${Y}`),I.push(`  in  ${q}`)}if(s.length>0){I.push("最近事件：");for(const X of s.slice(-12))I.push(`  ${X.t.toFixed(2)} ${X.k} ${X.d}`.trimEnd())}return I.push(`UA ${e.ua}`),I.join(`
`)}return{sample(T,D,O,H=0){r.frames++,r.steps+=H,r.wallMs+=O,O>r.dtMax&&(r.dtMax=O),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=T.time;const I=T.time;if(c<0&&(c=I),L=I,w=T.tick,!o)return;const X=T.character,Y=Math.hypot(D.stickX,D.stickY),q=Math.hypot(X.velocity.x,X.velocity.z);d=T.combat.weapon;const et=eu(T,D),mt=X.facing,ft=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;Y>.2&&(r.stickActiveMs+=O);const j=[Ce(I),T.tick,Math.round(O*10)/10,Ce(D.stickX),Ce(D.stickY),Ce(D.stickRawX),Ce(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),Ce(D.intents.moveX),Ce(D.intents.moveZ),Ce(X.position.x),Ce(X.position.z),Ce(X.velocity.x),Ce(X.velocity.z),en(mt),en(X.bodyYaw),et,Ce(X.stride),ft===null?"":en(ft)];C(j);const st=I*1e3<y;if(O>t.spikeMs&&!st&&I-c>.6&&(r.spikes++,P("frameSpike",I,T.tick,O,`dt ${O.toFixed(0)}ms fl=${fi(et)}`,j)),h!==null&&!st){const gt=Math.abs(en(bs(mt-h))),wt=Math.abs(en(bs(X.moveYaw-f))),Rt=(p|et)&(fa|pa|ma|ga)|et&rs,It=ft===null?null:Math.abs(en(bs(mt-ft))),bt=ft===null||h===null?null:Math.abs(en(bs(h-ft))),Xt=It!==null&&bt!==null&&It<bt-.5,F=(p&rs)!==0&&(et&rs)===0&&ft===null,ie=It!==null&&(It<=12||Xt);gt>t.aimDropDeg&&F?P("aimDrop",I,T.tick,0,`${gt.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${fi(et)}`,j):gt>t.dirJumpDeg&&Rt===0&&!F&&(ie?(r.inTurns++,gt>r.inTurnMax&&(r.inTurnMax=gt)):P("dirJump",I,T.tick,0,`${gt.toFixed(0)}° res${It===null?" 无输入":`${It.toFixed(0)}°`} yaw ${en(h)}→${en(mt)} in ${ft===null?".":en(ft)}° mvΔ${wt.toFixed(0)}° aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${fi(p)}→${fi(et)}`,j))}const ht=(et&(fa|pa|ma|ga))!==0,pt=T.tick-x<30;Y>.35&&q<t.freezeSpeed&&!ht&&!pt?(g<0&&(g=I),I-g>=t.freezeMs/1e3&&I>=_&&(P("moveFreeze",I,T.tick,(I-g)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${q.toFixed(2)} ${D.source} fl=${fi(et)}`,j),_=I+1.5,g=-1)):g=-1,D.stickHeld?(Y>u&&(u=Y),u>.35&&Y<.06?(m<0&&(m=I),I-m>=t.stickLostMs/1e3&&(P("stickLost",I,T.tick,(I-m)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${u.toFixed(2)} fl=${fi(et)}`,j),m=-1,u=0)):m=-1):(u=0,m=-1),h=mt,f=X.moveYaw,p=et},event(T,D){const O=nu(T);S(T),o&&(T.type==="dash-ready"||T.type==="combo-reset"||T.type==="stepUp"||b(T.type,O,D,T.tick))},gesture(T){const D=`${T.button}.${T.kind}`;r.gestures[D]=(r.gestures[D]??0)+1,o&&(T.kind==="longPress"||T.kind==="doubleTap"||T.kind==="drag"||T.kind==="cancel")&&b(`g:${T.kind}`,`${T.button} ${T.heldMs.toFixed(0)}ms d${T.distance.toFixed(0)}px ${T.angleDeg.toFixed(0)}°`,L,w)},suspend(T){y=L*1e3+T,g=-1,m=-1},setEnabled(T){o=T,T||(h=null,g=-1,m=-1)},clear(){n.length=0,s.length=0,a.length=0,v={},l=-1e9,h=null,p=0,g=-1,m=-1,u=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0;for(const T of Object.keys(r.gestures))delete r.gestures[T]},status(){const T=r.simS,D=a.some(O=>T-O.t<8&&(O.kind==="dirJump"||O.kind==="aimDrop"||O.kind==="moveFreeze"||O.kind==="stickLost"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:D,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:Jh,samples:n.slice(),events:s.slice(),anomalies:a.slice()}},summary:R}}const su={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},au={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},ru={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},ou={core:su,scene:au,view:ru};function Fo(i){return JSON.parse(JSON.stringify(i))}const No=ou,cu=Fo(No.core),lu=Fo(No.scene),Xe=Fo(No.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class cn{constructor(t,e,n,s,a="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),cn.nextNameID=cn.nextNameID||0,this.$name.id=`lil-gui-name-${++cn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class du extends cn{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function zr(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const hu={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:zr,toHexString:zr},ls={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},uu={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=ls.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return ls.toHexString(s)}},fu={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=ls.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return ls.toHexString(s)}},pu=[hu,ls,uu,fu];function mu(i){return pu.find(t=>t.match(i))}class gu extends cn{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=mu(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=zr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Va extends cn{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class _u extends cn{constructor(t,e,n,s,a,r){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},n=x=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),n(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,h,f;const p=5,d=x=>{o=x.clientX,c=l=x.clientY,r=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(r){const y=x.clientX-o,v=x.clientY-c;Math.abs(v)>p?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>p&&_()}if(!r){const y=x.clientY-l;f-=y*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},u=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",u)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(u,x,y,v,L)=>(u-x)/(y-x)*(L-v)+v,e=u=>{const x=this.$slider.getBoundingClientRect();let y=t(u,x.left,x.right,this._min,this._max);this._snapClampSetValue(y)},n=u=>{this._setDraggingStyle(!0),e(u.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=u=>{e(u.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=u=>{u.preventDefault(),this._setDraggingStyle(!0),e(u.touches[0].clientX),r=!1},h=u=>{u.touches.length>1||(this._hasScrollBar?(o=u.touches[0].clientX,c=u.touches[0].clientY,r=!0):l(u),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",p))},f=u=>{if(r){const x=u.touches[0].clientX-o,y=u.touches[0].clientY-c;Math.abs(x)>Math.abs(y)?l(u):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p))}else u.preventDefault(),e(u.touches[0].clientX)},p=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p)},d=this._callOnFinishChange.bind(this),g=400;let _;const m=u=>{if(Math.abs(u.deltaX)<Math.abs(u.deltaY)&&this._hasScrollBar)return;u.preventDefault();const y=this._normalizeMouseWheel(u)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(d,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class xu extends cn{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class vu extends cn{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Mu=`.lil-gui {
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
}`;function yu(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let _c=!1;class _a{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!_c&&o&&(yu(Mu),_c=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,a){if(Object(n)===n)return new xu(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new _u(this,t,e,n,s,a);case"boolean":return new du(this,t,e);case"string":return new vu(this,t,e);case"function":return new Va(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new gu(this,t,e,n)}addFolder(t){const e=new _a({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Va||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Va)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Su(i,t,e,n){const s=document.getElementById("debug-panel"),a=s?new _a({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new _a({title:"实验台 · 调试面板"}),r=a.addFolder("模拟");r.add(e,"timeScale",0,3,.05).name("时间缩放"),r.add(e,"paused").name("暂停"),r.add({step:n.singleStep},"step").name("单步 (1 tick)"),r.add({reset:n.reset},"reset").name("复位全部");const o=a.addFolder("模块");o.add(i.modules,"movement").name("movement"),o.add(i.modules,"combat").name("combat"),o.add(i.modules,"links").name("links"),o.add(i.modules,"orientation").name("orientation"),o.add(i.modules,"targeting").name("targeting"),o.add(i.modules,"hits").name("hits"),o.add(i.modules,"separation").name("separation"),o.add(i.modules,"dash").name("dash"),o.add(i.modules,"camera").name("camera"),o.add(i.modules,"dummies").name("dummies"),o.add(i.modules,"abilities").name("abilities");const c=i.config,l=a.addFolder("移动参数");l.add(c,"moveSpeed",1,10,.1).name("移动速度"),l.add(c,"sprintMultiplier",1,3,.05).name("冲刺倍率"),l.add(c,"acceleration",1,40,.5).name("加速度"),l.add(c,"friction",1,40,.5).name("摩擦"),l.add(c,"gravity",5,60,.5).name("重力"),l.add(c,"jumpSpeed",2,16,.2).name("起跳速度"),l.add(c,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),l.add(c,"characterRadius",.1,.8,.01).name("角色半径"),l.add(c,"characterHeight",.6,2.2,.05).name("角色身高"),l.add(c,"strideLength",.3,3,.05).name("基础步幅"),l.add(c,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),l.add(c,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const h=a.addFolder("程序化步态 (v8)");h.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),h.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),h.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),h.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),h.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),h.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),h.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),h.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),h.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),h.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),h.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆");const f=a.addFolder("程序动画 (v8c/v8d)");f.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),f.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),f.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const p=t.animation.stride;f.add(p,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),f.add(p,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),f.add(p,"cycles",1,3,1).name("每段跨步周期数"),f.add(p,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),f.add(p,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),f.add(p,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),f.add(p,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),f.add(p,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),f.add(p,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),f.add(p,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),f.add(p,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),f.add(p,"heavyScale",0,1,.01).name("大剑重击收敛系数"),f.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),f.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),f.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),f.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),f.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),f.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),f.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),f.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),f.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),f.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),f.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),f.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const d=c.combat,g=a.addFolder("战斗参数"),_=g.add(i.combat,"weapon",si).name("当前武器");g.add(d,"comboWindow",.1,2,.05).name("连击窗口 (s)"),g.add(d,"settle",0,.8,.01).name("段间停顿 (s)"),g.add(d,"attackMoveScale",0,1,.01).name("攻击时移动比例"),g.add(d,"autoCombo").name("按住自动连击"),g.add(d.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),g.add(d.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),g.add(d.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),g.add(d.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),g.add(d.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),g.add(d.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const m=c.abilities;g.add(m.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),g.add(m.arcane,"speed",3,24,.5).name("飞弹速度"),g.add(m.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),g.add(m.ring,"radius",.5,5,.1).name("电环半径"),g.add(m.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),g.add(m.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const u=c.orientation,x=a.addFolder("朝向参数");x.add(u,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),x.add(u,"headTurnRate",.5,40,.5).name("头部转向速率"),x.add(u,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),x.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),x.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),x.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const y=a.addFolder("惯性倾斜 / 盆骨 (v8g)"),v=t.lean;y.add(v,"accelGain",0,.1,.002).name("前后加速度增益"),y.add(v,"turnGain",0,.2,.005).name("绕圈侧倾增益"),y.add(v,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),y.add(v,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),y.add(v,"smoothing",1,30,1).name("倾斜平滑速率"),y.add(v,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),y.add(v,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),y.add(v,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),y.add(v,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=a.addFolder("足部 IK (v8g)"),w=t.ik;L.add(w,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),L.add(w,"weight",0,1,.01).name("钉地权重"),L.add(w,"attackScale",0,1,.01).name("攻击时权重倍率"),L.add(w,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const C=a.addFolder("程序动画 / 武器握持");C.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),C.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),C.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),C.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const P=c.targeting,b=a.addFolder("目标辅助");b.add(P,"targetAssist").name("启用目标辅助"),b.add(P,"range",1,14,.5).name("锁定范围 (m)"),b.add(P,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),b.add(P,"frontBias",0,4,.1).name("朝向加权"),b.add(P,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),b.add(P,"maxLungeScale",1,3,.1).name("前冲最大放大");const S=c.hits,R=a.addFolder("命中 / 受击 / 击退");R.add(S,"arcDeg",10,120,5).name("命中扇区半角 (°)"),R.add(S,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),R.add(S,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),R.add(S,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),R.add(S.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),R.add(S.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),R.add(S,"dummyReach",.5,4,.1).name("假人命中距离 (m)");const T=c.separation,D=a.addFolder("角色间分离");D.add(T,"iterations",1,8,1).name("迭代次数"),D.add(T,"slop",0,.05,.002).name("额外分离量 (m)");const O=c.dash,H=a.addFolder("冲刺 / 闪避");H.add(O,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),H.add(O,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),H.add(O,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),H.add(O,"blinkDistance",1,12,.25).name("闪现距离 (m)"),H.add(O,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),H.add(O,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),H.add(O,"blinkClearVelocity").name("闪现清空速度"),H.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),H.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const I=c.camera,X=a.addFolder("智能相机");X.add(I,"radius",2,18,.5).name("威胁评估半径 (m)"),X.add(I,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),X.add(I,"saturation",.5,8,.1).name("威胁归一化饱和"),X.add(I,"pushIn",0,.5,.01).name("无威胁推进比例"),X.add(I,"maxPullback",0,1,.02).name("最大拉远比例"),X.add(I,"maxOffset",0,6,.1).name("最大构图平移 (m)"),X.add(I,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),X.add(I,"framingBias",0,1,.05).name("威胁质心平移系数"),X.add(I,"attackBoost",0,2,.05).name("挥砍中额外加权"),X.add(I.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),X.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Y=a.addFolder("输入");Y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),Y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const q=c.dummies,et=a.addFolder("假人参数");et.add(q,"moveSpeed",.5,8,.1).name("移动速度"),et.add(q,"wanderRadius",.5,8,.1).name("游走半径"),et.add(q,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),et.add(q,"followStopDistance",.3,5,.1).name("跟随停距"),et.add(q,"keepDistance",1,10,.1).name("保持距离"),et.add(q,"keepDeadZone",.1,2,.05).name("保持死区"),et.add(q,"attackRange",.5,5,.1).name("攻击距离"),et.add(q,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const mt=a.addFolder("相机");mt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),mt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),mt.add(t.camera,"distance",6,35,.5).name("距离"),mt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),mt.add(t.camera,"fov",25,90,1).name("FOV");const vt=a.addFolder("相机缩放 (v8e)");vt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),vt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),vt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),vt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),vt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),vt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),vt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),vt.add({reset:n.resetZoom},"reset").name("缩放归 1");const ft=a.addFolder("受击分层 (v8f)"),j=t.hurt;ft.add(j,"enabled").name("启用分层受击 (关=旧版对照)"),ft.add(j,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),ft.add(j,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),ft.add(j,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),ft.add(j,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),ft.add(j,"upperShiftScale",0,1,.01).name("上身位移缩放"),ft.add(j,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),ft.add(j.hitHeight,"light",0,1,.01).name("轻击命中部位"),ft.add(j.hitHeight,"heavy",0,1,.01).name("重击命中部位"),ft.add(j.hitHeight,"knock",0,1,.01).name("击退命中部位"),ft.add(j,"leanLight",0,1.5,.01).name("轻击力度"),ft.add(j,"leanHeavy",0,1.5,.01).name("重击力度"),ft.add(j,"leanKnock",0,1.5,.01).name("击退力度"),ft.add(j,"flashStrength",0,2,.05).name("受击闪光强度");const st=[{name:"打腹 (abdomen)",p:j.abdomen},{name:"打肩 (shoulder)",p:j.shoulder}].map(({name:Rt,p:It})=>{const bt=ft.addFolder(Rt);return bt.add(It,"upperPitch",0,2,.01).name("上身前后倾斜"),bt.add(It,"upperRoll",0,2,.01).name("上身侧倾"),bt.add(It,"upperYaw",0,1.5,.01).name("肩部扭转"),bt.add(It,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),bt.add(It,"shift",0,.8,.01).name("身体反应位移"),bt.add(It,"drop",0,.4,.01).name("整体下沉"),bt.add(It,"back",0,.4,.01).name("屁股向后"),bt.add(It,"knee",0,1.6,.01).name("屈膝"),bt.add(It,"hip",0,1,.01).name("髋前倾"),bt.add(It,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),bt}),ht=a.addFolder("派生招 (v9a)"),pt=i.config.links;ht.add(pt,"enabled").name("总开关 (false=旧连击)"),ht.add(pt.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),ht.add(pt.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),ht.add(pt.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),ht.add(pt,"sharedCooldown",0,3,.05).name("共享 CD (s)"),ht.add(pt,"triggerWhileSprinting").name("长跑中可直接触发"),ht.add(pt.search,"range",1,14,.1).name("索敌距离 (m)"),ht.add(pt.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),ht.add(pt.search,"stopDistance",0,3,.05).name("停住距离 (m)");const gt=pt.moves["sword-shield"];gt&&(ht.add(gt,"enabled").name("剑盾盾击"),ht.add(gt,"distance",0,8,.1).name("冲锋极限 (m)"),ht.add(gt,"windup",0,.5,.01).name("前摇 (s)"),ht.add(gt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),ht.add(gt,"recovery",0,.8,.01).name("收势 (s)"),ht.add(gt.hit,"radius",0,4,.05).name("命中半径 (m)"),ht.add(gt.hit,"width",0,2,.05).name("扫掠半径 (m)"),ht.add(gt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),ht.add(gt.hit,"duration",0,1.5,.01).name("僵直 (s)")),ht.add(i.config.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const wt=a.addFolder("显示");return wt.add(e,"showColliders").name("碰撞盒线框").onChange(n.onToggleColliders),wt.add(e,"showGrid").name("地面网格").onChange(n.onToggleGrid),l.close(),f.close(),g.close(),x.close(),C.close(),y.close(),L.close(),b.close(),R.close(),D.close(),H.close(),X.close(),Y.close(),o.close(),et.close(),mt.close(),vt.close(),ft.close(),ht.close(),st.forEach(Rt=>Rt.close()),wt.close(),a.close(),{gui:a,refreshWeapon:()=>_.updateDisplay()}}const Wa=Math.PI*2,nn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},bu=45,Eu=50;function Au(i,t,e){return{x:e.rightX*i+e.rightZ*t,y:-(e.forwardX*i+e.forwardZ*t)}}function Zi(i,t,e){const n=Au(i,t,e);return Math.atan2(n.x,-n.y)*180/Math.PI}function Tu(i,t){return Math.atan2(i,-t)*180/Math.PI}function xc(i,t){return Math.abs(((i-t)%360+540)%360-180)}function Es(i){return(i%360+360)%360}const wu={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function Ru(i,t,e,n=8){const s=i.character,a=t.intents,r=Math.hypot(a.moveX,a.moveZ),o=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),h=r>.001?Zi(a.moveX,a.moveZ,e):null,f=l>.15?Zi(c.x,c.z,e):null,p=Zi(Math.sin(s.facing),Math.cos(s.facing),e),d=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?Zi(a.aimX,a.aimZ,e):null,g=i.targeting,_=g.hasTarget?Zi(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&f!==null?xc(h,f):null,u=h!==null?xc(h,p):null,x=m!==null&&m>bu&&r>=.35&&l>=.4;return{inDeg:h,inLen:Math.min(1,r),rawDeg:o>.02?Tu(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,o),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:p,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:d,gapMove:m,gapFace:u,warnMove:x}}function vc(i,t){return!t&&i.aimDeg===null&&i.gapFace!==null&&i.gapFace>Eu&&(i.inLen>=.35||i.speed>=.4)}const Mc="harness.dirDebug";function Cu(i={}){const t=document.createElement("div");t.id="dirdbg",t.innerHTML=['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>','<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"].join(""),document.body.appendChild(t);const e=t.querySelector("#dirdbg-canvas"),n=t.querySelector("#dirdbg-toggle"),s={in:t.querySelector('[data-k="in"]'),mv:t.querySelector('[data-k="mv"]'),fc:t.querySelector('[data-k="fc"]'),gap:t.querySelector('[data-k="gap"]')},a=e.getContext("2d");let r=!0;try{r=window.localStorage.getItem(Mc)!=="0"}catch{}function o(){t.classList.toggle("is-off",!r),n.textContent=r?"方向 ⌄":"方向 ▸",n.setAttribute("aria-expanded",String(r))}o();function c(u){r=u;try{window.localStorage.setItem(Mc,u?"1":"0")}catch{}o()}n.addEventListener("pointerdown",u=>{u.preventDefault(),u.stopPropagation(),c(!r)}),window.addEventListener("keydown",u=>{u.key.toLowerCase()==="v"&&!u.metaKey&&!u.ctrlKey&&c(!r)});const l=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;e.width=Math.round(h*l),e.height=Math.round(h*l);let f=wu,p=0,d="",g=8;function _(u){if(!a)return;const x=h,y=h,v=x/2,L=y/2,w=Math.min(x,y)/2-13;a.setTransform(l,0,0,l,0,0),a.clearRect(0,0,x,y),a.beginPath(),a.arc(v,L,w,0,Wa),a.fillStyle="rgba(8, 12, 17, 0.5)",a.fill(),a.lineWidth=1,a.strokeStyle=u.warnMove?"rgba(251, 191, 36, 0.85)":nn.ring,a.stroke(),a.strokeStyle=nn.grid,a.beginPath(),a.moveTo(v-w,L),a.lineTo(v+w,L),a.moveTo(v,L-w),a.lineTo(v,L+w),a.stroke();for(let S=0;S<8;S++){const R=S*Math.PI/4,T=v+Math.sin(R)*(w-3),D=L-Math.cos(R)*(w-3),O=v+Math.sin(R)*w,H=L-Math.cos(R)*w;a.beginPath(),a.moveTo(T,D),a.lineTo(O,H),a.stroke()}const C=i.deadZone?Math.min(.9,Math.max(0,i.deadZone())):0;C>0&&(a.save(),a.setLineDash([2,3]),a.strokeStyle=nn.dead,a.beginPath(),a.arc(v,L,w*C,0,Wa),a.stroke(),a.restore());const P=(S,R,T,D,O=!1,H=1)=>{const I=S*Math.PI/180,X=Math.sin(I),Y=-Math.cos(I),q=w*Math.max(.14,Math.min(1,R)),et=v+X*w*.14,mt=L+Y*w*.14,vt=v+X*q,ft=L+Y*q;if(a.save(),a.globalAlpha=H,a.strokeStyle=T,a.fillStyle=T,a.lineWidth=D,a.lineCap="round",O&&a.setLineDash([3,3]),a.beginPath(),a.moveTo(et,mt),a.lineTo(vt,ft),a.stroke(),!O&&q>w*.3){const j=-Y,st=X,ht=5.2;a.beginPath(),a.moveTo(vt+X*1.5,ft+Y*1.5),a.lineTo(vt-X*ht+j*ht*.72,ft-Y*ht+st*ht*.72),a.lineTo(vt-X*ht-j*ht*.72,ft-Y*ht-st*ht*.72),a.closePath(),a.fill()}a.restore()},b=(S,R)=>{const T=S*Math.PI/180,D=Math.sin(T),O=-Math.cos(T),H=-O,I=D,X=w+1.5,Y=X+6.5;a.save(),a.fillStyle=R,a.strokeStyle=R,a.lineWidth=1,a.beginPath(),a.moveTo(v+D*Y,L+O*Y),a.lineTo(v+D*X+H*4,L+O*X+I*4),a.lineTo(v+D*X-H*4,L+O*X-I*4),a.closePath(),a.fill(),a.restore()};u.lockDeg!==null&&P(u.lockDeg,1,nn.lock,1,!0,.7),u.rawDeg!==null&&u.stickHeld&&P(u.rawDeg,u.rawLen,nn.raw,1,!0,.9),u.aimDeg!==null&&P(u.aimDeg,1,nn.aim,1.6,!0,.95),P(u.faceDeg,1,nn.face,1.1,!0,.55),u.moveDeg!==null&&P(u.moveDeg,u.speed/Math.max(1,g),nn.move,5.5,!1,.8),u.inDeg!==null&&P(u.inDeg,u.inLen,nn.input,2.2),b(u.faceDeg,nn.face),a.beginPath(),a.arc(v,L,2.2,0,Wa),a.fillStyle="rgba(220, 235, 248, 0.85)",a.fill()}function m(u,x){const y=w=>w===null?"-":String(Math.round(Es(w)));s.in.textContent=`入 ${y(u.inDeg)}`,s.mv.textContent=`移 ${y(u.moveDeg)}`,s.fc.textContent=`面 ${y(u.faceDeg)}`;const v=w=>w===null?"-":`${Math.round(w)}°`,L=[`Δ入→移 ${v(u.gapMove)}`,`Δ入→面 ${v(u.gapFace)}`];u.speed>.05&&L.push(`v${u.speed.toFixed(1)}`),u.lockDeg!==null&&L.push(`锁#${u.lockId} ${u.lockDist.toFixed(1)}m`),u.aimDeg!==null&&L.push("拖拽瞄准"),s.gap.textContent=L.join("  "),t.classList.toggle("is-warn",u.warnMove||vc(u,x))}return{update(u,x,y){if(!r)return;g=Math.max(1,u.config.moveSpeed*Math.max(1,u.config.sprintMultiplier));const v=Ru(u,x,y,g);f=v;const L=u.combat.phase!=="idle";_(v);const w=performance.now(),C=`${v.inDeg}|${v.moveDeg}|${v.faceDeg}|${v.lockId}|${v.aimDeg}|${v.warnMove}|${v.speed.toFixed(1)}`;(w-p>90||C!==d)&&(p=w,d=C,m(v,L),t.dataset.in=v.inDeg===null?"":Es(v.inDeg).toFixed(1),t.dataset.mv=v.moveDeg===null?"":Es(v.moveDeg).toFixed(1),t.dataset.fc=Es(v.faceDeg).toFixed(1),t.dataset.warn=v.warnMove||vc(v,L)?"1":"0")},setEnabled:c,toggle(){return c(!r),r},enabled:()=>r,last:()=>f}}const Pu=["剑盾","双剑","大剑","法杖","弓"],Du={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function Lu(i){return{update(t,e,n,s,a,r,o=!1){const c=t.character,l=c.position,h=c.velocity,f=t.combat,p=t.events.length>0?t.events[t.events.length-1]:null,d=bt=>bt.toFixed(2),g=bt=>(bt*180/Math.PI).toFixed(0),_=Pu[si.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),u="|".repeat(m)+".".repeat(10-m),x=t.dash,y=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${y.toFixed(0)}%`:`${x.kind} cd${d(x.cooldown)}`,L=s.intents.aimActive?`(${d(s.intents.aimX)},${d(s.intents.aimZ)})`:"-",w=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),C=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),P=Math.abs(w)+Math.abs(C)+1e-6,b=Math.round(Math.abs(C)/P*100),S=`strafe ${b}%${w<-.05?" back":""}`,R=t.camera,T=`threat ${(R.threat*100).toFixed(0)}%  dist×${d(R.distanceScale)}  off (${d(R.offsetX)},${d(R.offsetZ)})  pitch +${d(R.pitchDelta)}°  n=${R.threatCount}`,D=r?d(r.attackBlend):"-",O=r==null?void 0:r.attackWeights,H=O?`gw ${d(O.gaitScale)}  lw ${d(O.attackLegWeight)}  spd ${d(O.driveSpeed)}`:"-",I=O?`${d(O.gaitScale)}/${d(O.attackLegWeight)}`:"-",X=r?`${r.landing.kind} ${d(r.landing.pulse)} t${d(r.landing.remaining)} vy${d(r.landing.impactVy)}`:"-",Y=r?`${r.landing.kind}/${d(r.landing.pulse)}`:"-",q=(r==null?void 0:r.zoom)!==void 0?`zoom ×${d(r.zoom)}`:"-",et=r==null?void 0:r.hurt,mt=et?`hurt ${t.playerHurt.type}  部位h${d(et.hitHeight)}  脉冲p${d(et.pulse)}  上身${d(et.upperShift)}  重心${d(et.comShift)}  后坐${d(et.pelvisBack)}  屈膝${d(et.knee)}`:"-",vt=et?`${d(et.hitHeight)}/${d(et.pulse)}/${d(et.knee)}`:"-",ft=r==null?void 0:r.ik,j=ft?`${ft.active?"on":"off"} w${d(ft.weight)} e${d(ft.maxError)}`:"-",st=t.playerLink,ht=`link ${st.kind||"-"}  ${st.phase}  prog ${d(st.progress)}  win ${d(st.linkWindow)}s  cd ${d(st.cooldown)}s  hits ${st.hitIds.length}  travel ${d(st.travelled)}/${d(st.travel)}m  id ${st.id}`,pt=`${st.phase}/${st.kind||"-"}/w${d(st.linkWindow)}`,gt=s.lastGesture,wt=gt?`${gt.button} ${gt.kind} ${gt.heldMs.toFixed(0)}ms d${gt.distance.toFixed(0)}px ${gt.angleDeg.toFixed(0)}° taps${gt.taps}`:"-",Rt=t.dummies.map(bt=>`${bt.id}:${Du[bt.mode]}`).join("  ");if(o){i.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${st.phase}${st.kind?`/${st.kind}`:""} w${d(st.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?i.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${n}`,`pos (${d(l.x)},${d(l.y)},${d(l.z)})  vel (${d(h.x)},${d(h.y)},${d(h.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${b}%  stick(${d(s.stickX)},${d(s.stickY)}) ${s.source}  str${d(c.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${d(f.attackProgress)}  dash ${v}  ab ${D}  gw/lw ${I}  land ${Y}  ik ${j}`,`aim ${L}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${vt}`,`dummies ${Rt}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${d(R.distanceScale)}  ${q}  lk ${pt}`,`event ${p?`${p.type} ${d(p.value)}`:"-"}  scale ${d(a.timeScale)}${a.paused?" [P]":""}  g ${wt}`].join(`
`):i.textContent=[`tick ${t.tick}   t ${d(t.time)}s   fps ${e.toFixed(0)}   steps ${n}`,`pos  (${d(l.x)}, ${d(l.y)}, ${d(l.z)})`,`vel  (${d(h.x)}, ${d(h.y)}, ${d(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${D}   ${H}   land ${X}`,mt,`ik ${j}  clamped ${ft?ft.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${S}`,`move (${d(s.intents.moveX)}, ${d(s.intents.moveZ)})  stick (${d(s.stickX)}, ${d(s.stickY)})  ${s.source}  aim ${L}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${d(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${y.toFixed(0)}%  cd ${d(x.cooldown)}s  id ${x.id}  from (${d(x.fromX)},${d(x.fromZ)}) → to (${d(x.toX)},${d(x.toZ)})`,ht,`camera ${T}  ${q}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${u}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Rt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${d(t.impulse.x)}, ${d(t.impulse.z)})`,`event ${p?`${p.type} ${d(p.value)}`:"-"}   scale ${d(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${wt}`].join(`
`)}}}const Iu=8e3;function Uu(i,t){const e=document.getElementById("hud-toggle"),n=document.getElementById("hint-toggle");let s=!1,a=!1,r=0;function o(){i.classList.toggle("is-compact",!s),e==null||e.setAttribute("aria-expanded",String(s)),e&&(e.textContent=s?"状态 ▾":"状态 ▸",e.setAttribute("aria-label",s?"收起状态读数":"展开状态读数")),t&&(t.hidden=!a),n==null||n.setAttribute("aria-expanded",String(a)),n&&(n.textContent=a?"操作说明 ▾":"操作说明 ▸",n.setAttribute("aria-label",a?"收起操作说明":"展开操作说明"))}function c(){a&&(a=!1,window.clearTimeout(r),r=0,o())}function l(){s&&(s=!1,o())}function h(d){d.preventDefault(),d.stopPropagation(),s=!s,o()}function f(d){d.preventDefault(),d.stopPropagation(),a=!a,window.clearTimeout(r),r=0,a&&(r=window.setTimeout(c,Iu)),o()}e==null||e.addEventListener("pointerdown",h),n==null||n.addEventListener("pointerdown",f);function p(d){const g=d.target;g instanceof Element&&g.closest("#fold-row, #hint")||(c(),l())}return window.addEventListener("pointerdown",p,{capture:!0,passive:!0}),o(),{hudCompact:()=>!s}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const zo="170",ku=0,yc=1,Fu=2,Vl=1,Wl=2,yn=3,Hn=0,De=1,Te=2,zn=0,Ui=1,Sc=2,bc=3,Ec=4,Nu=5,ti=100,zu=101,Ou=102,Bu=103,Hu=104,Gu=200,Vu=201,Wu=202,Xu=203,Or=204,Br=205,$u=206,Yu=207,Zu=208,qu=209,ju=210,Ku=211,Ju=212,Qu=213,tf=214,Hr=0,Gr=1,Vr=2,Ni=3,Wr=4,Xr=5,$r=6,Yr=7,Oo=0,ef=1,nf=2,On=0,sf=1,af=2,rf=3,of=4,cf=5,lf=6,df=7,Xl=300,zi=301,Oi=302,Zr=303,qr=304,Aa=306,jr=1e3,ni=1001,Kr=1002,je=1003,hf=1004,As=1005,on=1006,Xa=1007,ii=1008,Tn=1009,$l=1010,Yl=1011,ds=1012,Bo=1013,ai=1014,bn=1015,us=1016,Ho=1017,Go=1018,Bi=1020,Zl=35902,ql=1021,jl=1022,qe=1023,Kl=1024,Jl=1025,ki=1026,Hi=1027,Ql=1028,Vo=1029,td=1030,Wo=1031,Xo=1033,na=33776,ia=33777,sa=33778,aa=33779,Jr=35840,Qr=35841,to=35842,eo=35843,no=36196,io=37492,so=37496,ao=37808,ro=37809,oo=37810,co=37811,lo=37812,ho=37813,uo=37814,fo=37815,po=37816,mo=37817,go=37818,_o=37819,xo=37820,vo=37821,ra=36492,Mo=36494,yo=36495,ed=36283,So=36284,bo=36285,Eo=36286,uf=3200,ff=3201,nd=0,pf=1,Fn="",Be="srgb",Vi="srgb-linear",Ta="linear",ee="srgb",pi=7680,Ac=519,mf=512,gf=513,_f=514,id=515,xf=516,vf=517,Mf=518,yf=519,Ao=35044,Tc="300 es",En=2e3,xa=2001;class Wi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],oa=Math.PI/180,To=180/Math.PI;function Bn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ye[i&255]+ye[i>>8&255]+ye[i>>16&255]+ye[i>>24&255]+"-"+ye[t&255]+ye[t>>8&255]+"-"+ye[t>>16&15|64]+ye[t>>24&255]+"-"+ye[e&63|128]+ye[e>>8&255]+"-"+ye[e>>16&255]+ye[e>>24&255]+ye[n&255]+ye[n>>8&255]+ye[n>>16&255]+ye[n>>24&255]).toLowerCase()}function Pe(i,t,e){return Math.max(t,Math.min(e,i))}function Sf(i,t){return(i%t+t)%t}function $a(i,t,e){return(1-e)*i+e*t}function rn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ne(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Bt{constructor(t=0,e=0){Bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*s+t.x,this.y=a*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ht{constructor(t,e,n,s,a,r,o,c,l){Ht.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l)}set(t,e,n,s,a,r,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=a,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],h=n[4],f=n[7],p=n[2],d=n[5],g=n[8],_=s[0],m=s[3],u=s[6],x=s[1],y=s[4],v=s[7],L=s[2],w=s[5],C=s[8];return a[0]=r*_+o*x+c*L,a[3]=r*m+o*y+c*w,a[6]=r*u+o*v+c*C,a[1]=l*_+h*x+f*L,a[4]=l*m+h*y+f*w,a[7]=l*u+h*v+f*C,a[2]=p*_+d*x+g*L,a[5]=p*m+d*y+g*w,a[8]=p*u+d*v+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*o*l-n*a*h+n*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=h*r-o*l,p=o*c-h*a,d=l*a-r*c,g=e*f+n*p+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*r)*_,t[3]=p*_,t[4]=(h*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=d*_,t[7]=(n*c-l*e)*_,t[8]=(r*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ya.makeScale(t,e)),this}rotate(t){return this.premultiply(Ya.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ya.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ya=new Ht;function sd(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function va(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function bf(){const i=va("canvas");return i.style.display="block",i}const wc={};function ss(i){i in wc||(wc[i]=!0,console.warn(i))}function Ef(i,t,e){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}function Af(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Tf(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const qt={enabled:!0,workingColorSpace:Vi,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ee&&(i.r=An(i.r),i.g=An(i.g),i.b=An(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ee&&(i.r=Fi(i.r),i.g=Fi(i.g),i.b=Fi(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Fn?Ta:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function An(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Rc=[.64,.33,.3,.6,.15,.06],Cc=[.2126,.7152,.0722],Pc=[.3127,.329],Dc=new Ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Lc=new Ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);qt.define({[Vi]:{primaries:Rc,whitePoint:Pc,transfer:Ta,toXYZ:Dc,fromXYZ:Lc,luminanceCoefficients:Cc,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:Rc,whitePoint:Pc,transfer:ee,toXYZ:Dc,fromXYZ:Lc,luminanceCoefficients:Cc,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}});let mi;class wf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{mi===void 0&&(mi=va("canvas")),mi.width=t.width,mi.height=t.height;const n=mi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=mi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=va("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=An(a[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(An(e[n]/255)*255):e[n]=An(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Rf=0;class ad{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Rf++}),this.uuid=Bn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Za(s[r].image)):a.push(Za(s[r]))}else a=Za(s);n.url=a}return e||(t.images[this.uuid]=n),n}}function Za(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?wf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Cf=0;class Re extends Wi{constructor(t=Re.DEFAULT_IMAGE,e=Re.DEFAULT_MAPPING,n=ni,s=ni,a=on,r=ii,o=qe,c=Tn,l=Re.DEFAULT_ANISOTROPY,h=Fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cf++}),this.uuid=Bn(),this.name="",this.source=new ad(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Bt(0,0),this.repeat=new Bt(1,1),this.center=new Bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Xl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case jr:t.x=t.x-Math.floor(t.x);break;case ni:t.x=t.x<0?0:1;break;case Kr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case jr:t.y=t.y-Math.floor(t.y);break;case ni:t.y=t.y<0?0:1;break;case Kr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Re.DEFAULT_IMAGE=null;Re.DEFAULT_MAPPING=Xl;Re.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a;const c=t.elements,l=c[0],h=c[4],f=c[8],p=c[1],d=c[5],g=c[9],_=c[2],m=c[6],u=c[10];if(Math.abs(h-p)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+p)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,v=(d+1)/2,L=(u+1)/2,w=(h+p)/4,C=(f+_)/4,P=(g+m)/4;return y>v&&y>L?y<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(y),s=w/n,a=C/n):v>L?v<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),n=w/s,a=P/s):L<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(L),n=C/a,s=P/a),this.set(n,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(p-h)*(p-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-_)/x,this.z=(p-h)/x,this.w=Math.acos((l+d+u-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Pf extends Wi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new Re(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new ad(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ri extends Pf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class rd extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Df extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class fs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,r,o){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3];const p=a[r+0],d=a[r+1],g=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=p,t[e+1]=d,t[e+2]=g,t[e+3]=_;return}if(f!==_||c!==p||l!==d||h!==g){let m=1-o;const u=c*p+l*d+h*g+f*_,x=u>=0?1:-1,y=1-u*u;if(y>Number.EPSILON){const L=Math.sqrt(y),w=Math.atan2(L,u*x);m=Math.sin(m*w)/L,o=Math.sin(o*w)/L}const v=o*x;if(c=c*m+p*v,l=l*m+d*v,h=h*m+g*v,f=f*m+_*v,m===1-o){const L=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=L,l*=L,h*=L,f*=L}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,a,r){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=a[r],p=a[r+1],d=a[r+2],g=a[r+3];return t[e]=o*g+h*f+c*d-l*p,t[e+1]=c*g+h*p+l*f-o*d,t[e+2]=l*g+h*d+o*p-c*f,t[e+3]=h*g-o*f-c*p-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),f=o(a/2),p=c(n/2),d=c(s/2),g=c(a/2);switch(r){case"XYZ":this._x=p*h*f+l*d*g,this._y=l*d*f-p*h*g,this._z=l*h*g+p*d*f,this._w=l*h*f-p*d*g;break;case"YXZ":this._x=p*h*f+l*d*g,this._y=l*d*f-p*h*g,this._z=l*h*g-p*d*f,this._w=l*h*f+p*d*g;break;case"ZXY":this._x=p*h*f-l*d*g,this._y=l*d*f+p*h*g,this._z=l*h*g+p*d*f,this._w=l*h*f-p*d*g;break;case"ZYX":this._x=p*h*f-l*d*g,this._y=l*d*f+p*h*g,this._z=l*h*g-p*d*f,this._w=l*h*f+p*d*g;break;case"YZX":this._x=p*h*f+l*d*g,this._y=l*d*f+p*h*g,this._z=l*h*g-p*d*f,this._w=l*h*f-p*d*g;break;case"XZY":this._x=p*h*f-l*d*g,this._y=l*d*f-p*h*g,this._z=l*h*g+p*d*f,this._w=l*h*f+p*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],h=e[6],f=e[10],p=n+o+f;if(p>0){const d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(h-c)*d,this._y=(a-l)*d,this._z=(r-s)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+l)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(a-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(r-s)/d,this._x=(a+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Pe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-n*l,this._z=a*h+r*l+n*c-s*o,this._w=r*h-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),f=Math.sin((1-e)*h)/l,p=Math.sin(e*h)/l;return this._w=r*f+this._w*p,this._x=n*f+this._x*p,this._y=s*f+this._y*p,this._z=a*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Z{constructor(t=0,e=0,n=0){Z.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ic.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ic.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*n),h=2*(o*e-a*s),f=2*(a*n-r*e);return this.x=e+c*l+r*f-o*h,this.y=n+c*h+o*l-a*f,this.z=s+c*f+a*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return qa.copy(this).projectOnVector(t),this.sub(qa)}reflect(t){return this.sub(qa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qa=new Z,Ic=new fs;class ps{constructor(t=new Z(1/0,1/0,1/0),e=new Z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint($e.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint($e.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=$e.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,$e):$e.fromBufferAttribute(a,r),$e.applyMatrix4(t.matrixWorld),this.expandByPoint($e);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ts.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ts.copy(n.boundingBox)),Ts.applyMatrix4(t.matrixWorld),this.union(Ts)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,$e),$e.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(qi),ws.subVectors(this.max,qi),gi.subVectors(t.a,qi),_i.subVectors(t.b,qi),xi.subVectors(t.c,qi),Pn.subVectors(_i,gi),Dn.subVectors(xi,_i),Xn.subVectors(gi,xi);let e=[0,-Pn.z,Pn.y,0,-Dn.z,Dn.y,0,-Xn.z,Xn.y,Pn.z,0,-Pn.x,Dn.z,0,-Dn.x,Xn.z,0,-Xn.x,-Pn.y,Pn.x,0,-Dn.y,Dn.x,0,-Xn.y,Xn.x,0];return!ja(e,gi,_i,xi,ws)||(e=[1,0,0,0,1,0,0,0,1],!ja(e,gi,_i,xi,ws))?!1:(Rs.crossVectors(Pn,Dn),e=[Rs.x,Rs.y,Rs.z],ja(e,gi,_i,xi,ws))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,$e).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize($e).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const mn=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],$e=new Z,Ts=new ps,gi=new Z,_i=new Z,xi=new Z,Pn=new Z,Dn=new Z,Xn=new Z,qi=new Z,ws=new Z,Rs=new Z,$n=new Z;function ja(i,t,e,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){$n.fromArray(i,a);const o=s.x*Math.abs($n.x)+s.y*Math.abs($n.y)+s.z*Math.abs($n.z),c=t.dot($n),l=e.dot($n),h=n.dot($n);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Lf=new ps,ji=new Z,Ka=new Z;class wa{constructor(t=new Z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Lf.setFromPoints(t).getCenter(n);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ji.subVectors(t,this.center);const e=ji.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ji,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ka.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ji.copy(t.center).add(Ka)),this.expandByPoint(ji.copy(t.center).sub(Ka))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const gn=new Z,Ja=new Z,Cs=new Z,Ln=new Z,Qa=new Z,Ps=new Z,tr=new Z;class $o{constructor(t=new Z,e=new Z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,gn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=gn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(gn.copy(this.origin).addScaledVector(this.direction,e),gn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ja.copy(t).add(e).multiplyScalar(.5),Cs.copy(e).sub(t).normalize(),Ln.copy(this.origin).sub(Ja);const a=t.distanceTo(e)*.5,r=-this.direction.dot(Cs),o=Ln.dot(this.direction),c=-Ln.dot(Cs),l=Ln.lengthSq(),h=Math.abs(1-r*r);let f,p,d,g;if(h>0)if(f=r*c-o,p=r*o-c,g=a*h,f>=0)if(p>=-g)if(p<=g){const _=1/h;f*=_,p*=_,d=f*(f+r*p+2*o)+p*(r*f+p+2*c)+l}else p=a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;else p=-a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;else p<=-g?(f=Math.max(0,-(-r*a+o)),p=f>0?-a:Math.min(Math.max(-a,-c),a),d=-f*f+p*(p+2*c)+l):p<=g?(f=0,p=Math.min(Math.max(-a,-c),a),d=p*(p+2*c)+l):(f=Math.max(0,-(r*a+o)),p=f>0?a:Math.min(Math.max(-a,-c),a),d=-f*f+p*(p+2*c)+l);else p=r>0?-a:a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Ja).addScaledVector(Cs,p),d}intersectSphere(t,e){gn.subVectors(t.center,this.origin);const n=gn.dot(this.direction),s=gn.dot(gn)-n*n,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,p=this.origin;return l>=0?(n=(t.min.x-p.x)*l,s=(t.max.x-p.x)*l):(n=(t.max.x-p.x)*l,s=(t.min.x-p.x)*l),h>=0?(a=(t.min.y-p.y)*h,r=(t.max.y-p.y)*h):(a=(t.max.y-p.y)*h,r=(t.min.y-p.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-p.z)*f,c=(t.max.z-p.z)*f):(o=(t.max.z-p.z)*f,c=(t.min.z-p.z)*f),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,gn)!==null}intersectTriangle(t,e,n,s,a){Qa.subVectors(e,t),Ps.subVectors(n,t),tr.crossVectors(Qa,Ps);let r=this.direction.dot(tr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Ln.subVectors(this.origin,t);const c=o*this.direction.dot(Ps.crossVectors(Ln,Ps));if(c<0)return null;const l=o*this.direction.dot(Qa.cross(Ln));if(l<0||c+l>r)return null;const h=-o*Ln.dot(tr);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,s,a,r,o,c,l,h,f,p,d,g,_,m){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l,h,f,p,d,g,_,m)}set(t,e,n,s,a,r,o,c,l,h,f,p,d,g,_,m){const u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=a,u[5]=r,u[9]=o,u[13]=c,u[2]=l,u[6]=h,u[10]=f,u[14]=p,u[3]=d,u[7]=g,u[11]=_,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/vi.setFromMatrixColumn(t,0).length(),a=1/vi.setFromMatrixColumn(t,1).length(),r=1/vi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const p=r*h,d=r*f,g=o*h,_=o*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=d+g*l,e[5]=p-_*l,e[9]=-o*c,e[2]=_-p*l,e[6]=g+d*l,e[10]=r*c}else if(t.order==="YXZ"){const p=c*h,d=c*f,g=l*h,_=l*f;e[0]=p+_*o,e[4]=g*o-d,e[8]=r*l,e[1]=r*f,e[5]=r*h,e[9]=-o,e[2]=d*o-g,e[6]=_+p*o,e[10]=r*c}else if(t.order==="ZXY"){const p=c*h,d=c*f,g=l*h,_=l*f;e[0]=p-_*o,e[4]=-r*f,e[8]=g+d*o,e[1]=d+g*o,e[5]=r*h,e[9]=_-p*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const p=r*h,d=r*f,g=o*h,_=o*f;e[0]=c*h,e[4]=g*l-d,e[8]=p*l+_,e[1]=c*f,e[5]=_*l+p,e[9]=d*l-g,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const p=r*c,d=r*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-p*f,e[8]=g*f+d,e[1]=f,e[5]=r*h,e[9]=-o*h,e[2]=-l*h,e[6]=d*f+g,e[10]=p-_*f}else if(t.order==="XZY"){const p=r*c,d=r*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=p*f+_,e[5]=r*h,e[9]=d*f-g,e[2]=g*f-d,e[6]=o*h,e[10]=_*f+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(If,t,Uf)}lookAt(t,e,n){const s=this.elements;return Fe.subVectors(t,e),Fe.lengthSq()===0&&(Fe.z=1),Fe.normalize(),In.crossVectors(n,Fe),In.lengthSq()===0&&(Math.abs(n.z)===1?Fe.x+=1e-4:Fe.z+=1e-4,Fe.normalize(),In.crossVectors(n,Fe)),In.normalize(),Ds.crossVectors(Fe,In),s[0]=In.x,s[4]=Ds.x,s[8]=Fe.x,s[1]=In.y,s[5]=Ds.y,s[9]=Fe.y,s[2]=In.z,s[6]=Ds.z,s[10]=Fe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],h=n[1],f=n[5],p=n[9],d=n[13],g=n[2],_=n[6],m=n[10],u=n[14],x=n[3],y=n[7],v=n[11],L=n[15],w=s[0],C=s[4],P=s[8],b=s[12],S=s[1],R=s[5],T=s[9],D=s[13],O=s[2],H=s[6],I=s[10],X=s[14],Y=s[3],q=s[7],et=s[11],mt=s[15];return a[0]=r*w+o*S+c*O+l*Y,a[4]=r*C+o*R+c*H+l*q,a[8]=r*P+o*T+c*I+l*et,a[12]=r*b+o*D+c*X+l*mt,a[1]=h*w+f*S+p*O+d*Y,a[5]=h*C+f*R+p*H+d*q,a[9]=h*P+f*T+p*I+d*et,a[13]=h*b+f*D+p*X+d*mt,a[2]=g*w+_*S+m*O+u*Y,a[6]=g*C+_*R+m*H+u*q,a[10]=g*P+_*T+m*I+u*et,a[14]=g*b+_*D+m*X+u*mt,a[3]=x*w+y*S+v*O+L*Y,a[7]=x*C+y*R+v*H+L*q,a[11]=x*P+y*T+v*I+L*et,a[15]=x*b+y*D+v*X+L*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],h=t[2],f=t[6],p=t[10],d=t[14],g=t[3],_=t[7],m=t[11],u=t[15];return g*(+a*c*f-s*l*f-a*o*p+n*l*p+s*o*d-n*c*d)+_*(+e*c*d-e*l*p+a*r*p-s*r*d+s*l*h-a*c*h)+m*(+e*l*f-e*o*d-a*r*f+n*r*d+a*o*h-n*l*h)+u*(-s*o*h-e*c*f+e*o*p+s*r*f-n*r*p+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=t[9],p=t[10],d=t[11],g=t[12],_=t[13],m=t[14],u=t[15],x=f*m*l-_*p*l+_*c*d-o*m*d-f*c*u+o*p*u,y=g*p*l-h*m*l-g*c*d+r*m*d+h*c*u-r*p*u,v=h*_*l-g*f*l+g*o*d-r*_*d-h*o*u+r*f*u,L=g*f*c-h*_*c-g*o*p+r*_*p+h*o*m-r*f*m,w=e*x+n*y+s*v+a*L;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/w;return t[0]=x*C,t[1]=(_*p*a-f*m*a-_*s*d+n*m*d+f*s*u-n*p*u)*C,t[2]=(o*m*a-_*c*a+_*s*l-n*m*l-o*s*u+n*c*u)*C,t[3]=(f*c*a-o*p*a-f*s*l+n*p*l+o*s*d-n*c*d)*C,t[4]=y*C,t[5]=(h*m*a-g*p*a+g*s*d-e*m*d-h*s*u+e*p*u)*C,t[6]=(g*c*a-r*m*a-g*s*l+e*m*l+r*s*u-e*c*u)*C,t[7]=(r*p*a-h*c*a+h*s*l-e*p*l-r*s*d+e*c*d)*C,t[8]=v*C,t[9]=(g*f*a-h*_*a-g*n*d+e*_*d+h*n*u-e*f*u)*C,t[10]=(r*_*a-g*o*a+g*n*l-e*_*l-r*n*u+e*o*u)*C,t[11]=(h*o*a-r*f*a-h*n*l+e*f*l+r*n*d-e*o*d)*C,t[12]=L*C,t[13]=(h*_*s-g*f*s+g*n*p-e*_*p-h*n*m+e*f*m)*C,t[14]=(g*o*s-r*_*s-g*n*c+e*_*c+r*n*m-e*o*m)*C,t[15]=(r*f*s-h*o*s+h*n*c-e*f*c-r*n*p+e*o*p)*C,this}scale(t){const e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),a=1-n,r=t.x,o=t.y,c=t.z,l=a*r,h=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,r){return this.set(1,n,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,h=r+r,f=o+o,p=a*l,d=a*h,g=a*f,_=r*h,m=r*f,u=o*f,x=c*l,y=c*h,v=c*f,L=n.x,w=n.y,C=n.z;return s[0]=(1-(_+u))*L,s[1]=(d+v)*L,s[2]=(g-y)*L,s[3]=0,s[4]=(d-v)*w,s[5]=(1-(p+u))*w,s[6]=(m+x)*w,s[7]=0,s[8]=(g+y)*C,s[9]=(m-x)*C,s[10]=(1-(p+_))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let a=vi.set(s[0],s[1],s[2]).length();const r=vi.set(s[4],s[5],s[6]).length(),o=vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],Ye.copy(this);const l=1/a,h=1/r,f=1/o;return Ye.elements[0]*=l,Ye.elements[1]*=l,Ye.elements[2]*=l,Ye.elements[4]*=h,Ye.elements[5]*=h,Ye.elements[6]*=h,Ye.elements[8]*=f,Ye.elements[9]*=f,Ye.elements[10]*=f,e.setFromRotationMatrix(Ye),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,s,a,r,o=En){const c=this.elements,l=2*a/(e-t),h=2*a/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s);let d,g;if(o===En)d=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===xa)d=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,a,r,o=En){const c=this.elements,l=1/(e-t),h=1/(n-s),f=1/(r-a),p=(e+t)*l,d=(n+s)*h;let g,_;if(o===En)g=(r+a)*f,_=-2*f;else if(o===xa)g=a*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const vi=new Z,Ye=new oe,If=new Z(0,0,0),Uf=new Z(1,1,1),In=new Z,Ds=new Z,Fe=new Z,Uc=new oe,kc=new fs;class dn{constructor(t=0,e=0,n=0,s=dn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],p=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Pe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Pe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Pe(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Pe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Pe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Pe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Uc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Uc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return kc.setFromEuler(this),this.setFromQuaternion(kc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}dn.DEFAULT_ORDER="XYZ";class Yo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let kf=0;const Fc=new Z,Mi=new fs,_n=new oe,Ls=new Z,Ki=new Z,Ff=new Z,Nf=new fs,Nc=new Z(1,0,0),zc=new Z(0,1,0),Oc=new Z(0,0,1),Bc={type:"added"},zf={type:"removed"},yi={type:"childadded",child:null},er={type:"childremoved",child:null};class de extends Wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:kf++}),this.uuid=Bn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=de.DEFAULT_UP.clone();const t=new Z,e=new dn,n=new fs,s=new Z(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new oe},normalMatrix:{value:new Ht}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=de.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.premultiply(Mi),this}rotateX(t){return this.rotateOnAxis(Nc,t)}rotateY(t){return this.rotateOnAxis(zc,t)}rotateZ(t){return this.rotateOnAxis(Oc,t)}translateOnAxis(t,e){return Fc.copy(t).applyQuaternion(this.quaternion),this.position.add(Fc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nc,t)}translateY(t){return this.translateOnAxis(zc,t)}translateZ(t){return this.translateOnAxis(Oc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ls.copy(t):Ls.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ki.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(Ki,Ls,this.up):_n.lookAt(Ls,Ki,this.up),this.quaternion.setFromRotationMatrix(_n),s&&(_n.extractRotation(s.matrixWorld),Mi.setFromRotationMatrix(_n),this.quaternion.premultiply(Mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Bc),yi.child=t,this.dispatchEvent(yi),yi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(zf),er.child=t,this.dispatchEvent(er),er.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),_n.multiply(t.parent.matrixWorld)),t.applyMatrix4(_n),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Bc),yi.child=t,this.dispatchEvent(yi),yi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ki,t,Ff),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ki,Nf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),f=r(t.shapes),p=r(t.skeletons),d=r(t.animations),g=r(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}de.DEFAULT_UP=new Z(0,1,0);de.DEFAULT_MATRIX_AUTO_UPDATE=!0;de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ze=new Z,xn=new Z,nr=new Z,vn=new Z,Si=new Z,bi=new Z,Hc=new Z,ir=new Z,sr=new Z,ar=new Z,rr=new le,or=new le,cr=new le;class ze{constructor(t=new Z,e=new Z,n=new Z){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ze.subVectors(t,e),s.cross(Ze);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){Ze.subVectors(s,e),xn.subVectors(n,e),nr.subVectors(t,e);const r=Ze.dot(Ze),o=Ze.dot(xn),c=Ze.dot(nr),l=xn.dot(xn),h=xn.dot(nr),f=r*l-o*o;if(f===0)return a.set(0,0,0),null;const p=1/f,d=(l*c-o*h)*p,g=(r*h-o*c)*p;return a.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getInterpolation(t,e,n,s,a,r,o,c){return this.getBarycoord(t,e,n,s,vn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,vn.x),c.addScaledVector(r,vn.y),c.addScaledVector(o,vn.z),c)}static getInterpolatedAttribute(t,e,n,s,a,r){return rr.setScalar(0),or.setScalar(0),cr.setScalar(0),rr.fromBufferAttribute(t,e),or.fromBufferAttribute(t,n),cr.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(rr,a.x),r.addScaledVector(or,a.y),r.addScaledVector(cr,a.z),r}static isFrontFacing(t,e,n,s){return Ze.subVectors(n,e),xn.subVectors(t,e),Ze.cross(xn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ze.subVectors(this.c,this.b),xn.subVectors(this.a,this.b),Ze.cross(xn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ze.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ze.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,a){return ze.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return ze.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ze.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,a=this.c;let r,o;Si.subVectors(s,n),bi.subVectors(a,n),ir.subVectors(t,n);const c=Si.dot(ir),l=bi.dot(ir);if(c<=0&&l<=0)return e.copy(n);sr.subVectors(t,s);const h=Si.dot(sr),f=bi.dot(sr);if(h>=0&&f<=h)return e.copy(s);const p=c*f-h*l;if(p<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(Si,r);ar.subVectors(t,a);const d=Si.dot(ar),g=bi.dot(ar);if(g>=0&&d<=g)return e.copy(a);const _=d*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(bi,o);const m=h*g-d*f;if(m<=0&&f-h>=0&&d-g>=0)return Hc.subVectors(a,s),o=(f-h)/(f-h+(d-g)),e.copy(s).addScaledVector(Hc,o);const u=1/(m+_+p);return r=_*u,o=p*u,e.copy(n).addScaledVector(Si,r).addScaledVector(bi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const od={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},Is={h:0,s:0,l:0};function lr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ot{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,qt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,qt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=qt.workingColorSpace){if(t=Sf(t,1),e=Pe(e,0,1),n=Pe(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=lr(r,a,t+1/3),this.g=lr(r,a,t),this.b=lr(r,a,t-1/3)}return qt.toWorkingColorSpace(this,s),this}setStyle(t,e=Be){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=od[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=An(t.r),this.g=An(t.g),this.b=An(t.b),this}copyLinearToSRGB(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return qt.fromWorkingColorSpace(Se.copy(this),t),Math.round(Pe(Se.r*255,0,255))*65536+Math.round(Pe(Se.g*255,0,255))*256+Math.round(Pe(Se.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=qt.workingColorSpace){qt.fromWorkingColorSpace(Se.copy(this),e);const n=Se.r,s=Se.g,a=Se.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const f=r-o;switch(l=h<=.5?f/(r+o):f/(2-r-o),r){case n:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-n)/f+2;break;case a:c=(n-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=qt.workingColorSpace){return qt.fromWorkingColorSpace(Se.copy(this),e),t.r=Se.r,t.g=Se.g,t.b=Se.b,t}getStyle(t=Be){qt.fromWorkingColorSpace(Se.copy(this),t);const e=Se.r,n=Se.g,s=Se.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Un),this.setHSL(Un.h+t,Un.s+e,Un.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Un),t.getHSL(Is);const n=$a(Un.h,Is.h,e),s=$a(Un.s,Is.s,e),a=$a(Un.l,Is.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Se=new Ot;Ot.NAMES=od;let Of=0;class oi extends Wi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=Bn(),this.name="",this.blending=Ui,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Or,this.blendDst=Br,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ot(0,0,0),this.blendAlpha=0,this.depthFunc=Ni,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ac,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ui&&(n.blending=this.blending),this.side!==Hn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Or&&(n.blendSrc=this.blendSrc),this.blendDst!==Br&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ni&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ac&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class sn extends oi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=Oo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const me=new Z,Us=new Bt;class Ke{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ao,this.updateRanges=[],this.gpuType=bn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Us.fromBufferAttribute(this,e),Us.applyMatrix3(t),this.setXY(e,Us.x,Us.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ne(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=rn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=rn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=rn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=rn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array),a=ne(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ao&&(t.usage=this.usage),t}}class cd extends Ke{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ld extends Ke{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends Ke{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Bf=0;const Oe=new oe,dr=new de,Ei=new Z,Ne=new ps,Ji=new ps,ve=new Z;class Le extends Wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=Bn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(sd(t)?ld:cd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Ht().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Oe.makeRotationFromQuaternion(t),this.applyMatrix4(Oe),this}rotateX(t){return Oe.makeRotationX(t),this.applyMatrix4(Oe),this}rotateY(t){return Oe.makeRotationY(t),this.applyMatrix4(Oe),this}rotateZ(t){return Oe.makeRotationZ(t),this.applyMatrix4(Oe),this}translate(t,e,n){return Oe.makeTranslation(t,e,n),this.applyMatrix4(Oe),this}scale(t,e,n){return Oe.makeScale(t,e,n),this.applyMatrix4(Oe),this}lookAt(t){return dr.lookAt(t),dr.updateMatrix(),this.applyMatrix4(dr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new he(n,3))}else{for(let n=0,s=e.count;n<s;n++){const a=t[n];e.setXYZ(n,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ps);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Z(-1/0,-1/0,-1/0),new Z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const a=e[n];Ne.setFromBufferAttribute(a),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,Ne.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,Ne.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(Ne.min),this.boundingBox.expandByPoint(Ne.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Z,1/0);return}if(t){const n=this.boundingSphere.center;if(Ne.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];Ji.setFromBufferAttribute(o),this.morphTargetsRelative?(ve.addVectors(Ne.min,Ji.min),Ne.expandByPoint(ve),ve.addVectors(Ne.max,Ji.max),Ne.expandByPoint(ve)):(Ne.expandByPoint(Ji.min),Ne.expandByPoint(Ji.max))}Ne.getCenter(n);let s=0;for(let a=0,r=t.count;a<r;a++)ve.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(ve));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)ve.fromBufferAttribute(o,l),c&&(Ei.fromBufferAttribute(t,l),ve.add(Ei)),s=Math.max(s,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ke(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<n.count;P++)o[P]=new Z,c[P]=new Z;const l=new Z,h=new Z,f=new Z,p=new Bt,d=new Bt,g=new Bt,_=new Z,m=new Z;function u(P,b,S){l.fromBufferAttribute(n,P),h.fromBufferAttribute(n,b),f.fromBufferAttribute(n,S),p.fromBufferAttribute(a,P),d.fromBufferAttribute(a,b),g.fromBufferAttribute(a,S),h.sub(l),f.sub(l),d.sub(p),g.sub(p);const R=1/(d.x*g.y-g.x*d.y);isFinite(R)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(R),m.copy(f).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(R),o[P].add(_),o[b].add(_),o[S].add(_),c[P].add(m),c[b].add(m),c[S].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let P=0,b=x.length;P<b;++P){const S=x[P],R=S.start,T=S.count;for(let D=R,O=R+T;D<O;D+=3)u(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const y=new Z,v=new Z,L=new Z,w=new Z;function C(P){L.fromBufferAttribute(s,P),w.copy(L);const b=o[P];y.copy(b),y.sub(L.multiplyScalar(L.dot(b))).normalize(),v.crossVectors(w,b);const R=v.dot(c[P])<0?-1:1;r.setXYZW(P,y.x,y.y,y.z,R)}for(let P=0,b=x.length;P<b;++P){const S=x[P],R=S.start,T=S.count;for(let D=R,O=R+T;D<O;D+=3)C(t.getX(D+0)),C(t.getX(D+1)),C(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ke(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);const s=new Z,a=new Z,r=new Z,o=new Z,c=new Z,l=new Z,h=new Z,f=new Z;if(t)for(let p=0,d=t.count;p<d;p+=3){const g=t.getX(p+0),_=t.getX(p+1),m=t.getX(p+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,m),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let p=0,d=e.count;p<d;p+=3)s.fromBufferAttribute(e,p+0),a.fromBufferAttribute(e,p+1),r.fromBufferAttribute(e,p+2),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,f=o.normalized,p=new l.constructor(c.length*h);let d=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*h;for(let u=0;u<h;u++)p[g++]=l[d++]}return new Ke(p,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,f=l.length;h<f;h++){const p=l[h],d=t(p,n);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,p=l.length;f<p;f++){const d=l[f];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const a=t.morphAttributes;for(const l in a){const h=[],f=a[l];for(let p=0,d=f.length;p<d;p++)h.push(f[p].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Gc=new oe,Yn=new $o,ks=new wa,Vc=new Z,Fs=new Z,Ns=new Z,zs=new Z,hr=new Z,Os=new Z,Wc=new Z,Bs=new Z;class re extends de{constructor(t=new Le,e=new sn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){Os.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],f=a[c];h!==0&&(hr.fromBufferAttribute(f,t),r?Os.addScaledVector(hr,h):Os.addScaledVector(hr.sub(e),h))}e.add(Os)}return e}raycast(t,e){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ks.copy(n.boundingSphere),ks.applyMatrix4(a),Yn.copy(t.ray).recast(t.near),!(ks.containsPoint(Yn.origin)===!1&&(Yn.intersectSphere(ks,Vc)===null||Yn.origin.distanceToSquared(Vc)>(t.far-t.near)**2))&&(Gc.copy(a).invert(),Yn.copy(t.ray).applyMatrix4(Gc),!(n.boundingBox!==null&&Yn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Yn)))}_computeIntersections(t,e,n){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,p=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,_=p.length;g<_;g++){const m=p[g],u=r[m.materialIndex],x=Math.max(m.start,d.start),y=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let v=x,L=y;v<L;v+=3){const w=o.getX(v),C=o.getX(v+1),P=o.getX(v+2);s=Hs(this,u,t,n,l,h,f,w,C,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=g,u=_;m<u;m+=3){const x=o.getX(m),y=o.getX(m+1),v=o.getX(m+2);s=Hs(this,r,t,n,l,h,f,x,y,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,_=p.length;g<_;g++){const m=p[g],u=r[m.materialIndex],x=Math.max(m.start,d.start),y=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let v=x,L=y;v<L;v+=3){const w=v,C=v+1,P=v+2;s=Hs(this,u,t,n,l,h,f,w,C,P),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=g,u=_;m<u;m+=3){const x=m,y=m+1,v=m+2;s=Hs(this,r,t,n,l,h,f,x,y,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Hf(i,t,e,n,s,a,r,o){let c;if(t.side===De?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,t.side===Hn,o),c===null)return null;Bs.copy(o),Bs.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Bs);return l<e.near||l>e.far?null:{distance:l,point:Bs.clone(),object:i}}function Hs(i,t,e,n,s,a,r,o,c,l){i.getVertexPosition(o,Fs),i.getVertexPosition(c,Ns),i.getVertexPosition(l,zs);const h=Hf(i,t,e,n,Fs,Ns,zs,Wc);if(h){const f=new Z;ze.getBarycoord(Wc,Fs,Ns,zs,f),s&&(h.uv=ze.getInterpolatedAttribute(s,o,c,l,f,new Bt)),a&&(h.uv1=ze.getInterpolatedAttribute(a,o,c,l,f,new Bt)),r&&(h.normal=ze.getInterpolatedAttribute(r,o,c,l,f,new Z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const p={a:o,b:c,c:l,normal:new Z,materialIndex:0};ze.getNormal(Fs,Ns,zs,p.normal),h.face=p,h.barycoord=f}return h}class hn extends Le{constructor(t=1,e=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],h=[],f=[];let p=0,d=0;g("z","y","x",-1,-1,n,e,t,r,a,0),g("z","y","x",1,-1,n,e,-t,r,a,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,a,4),g("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new he(l,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(f,2));function g(_,m,u,x,y,v,L,w,C,P,b){const S=v/C,R=L/P,T=v/2,D=L/2,O=w/2,H=C+1,I=P+1;let X=0,Y=0;const q=new Z;for(let et=0;et<I;et++){const mt=et*R-D;for(let vt=0;vt<H;vt++){const ft=vt*S-T;q[_]=ft*x,q[m]=mt*y,q[u]=O,l.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[u]=w>0?1:-1,h.push(q.x,q.y,q.z),f.push(vt/C),f.push(1-et/P),X+=1}}for(let et=0;et<P;et++)for(let mt=0;mt<C;mt++){const vt=p+mt+H*et,ft=p+mt+H*(et+1),j=p+(mt+1)+H*(et+1),st=p+(mt+1)+H*et;c.push(vt,ft,st),c.push(ft,j,st),Y+=6}o.addGroup(d,Y,b),d+=Y,p+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Gi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ae(i){const t={};for(let e=0;e<i.length;e++){const n=Gi(i[e]);for(const s in n)t[s]=n[s]}return t}function Gf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function dd(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:qt.workingColorSpace}const Vf={clone:Gi,merge:Ae};var Wf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends oi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wf,this.fragmentShader=Xf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Gi(t.uniforms),this.uniformsGroups=Gf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class hd extends de{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=En}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const kn=new Z,Xc=new Bt,$c=new Bt;class He extends hd{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=To*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(oa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return To*2*Math.atan(Math.tan(oa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){kn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(kn.x,kn.y).multiplyScalar(-t/kn.z),kn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(kn.x,kn.y).multiplyScalar(-t/kn.z)}getViewSize(t,e){return this.getViewBounds(t,Xc,$c),e.subVectors($c,Xc)}setViewOffset(t,e,n,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(oa*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ai=-90,Ti=1;class $f extends de{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new He(Ai,Ti,t,e);s.layers=this.layers,this.add(s);const a=new He(Ai,Ti,t,e);a.layers=this.layers,this.add(a);const r=new He(Ai,Ti,t,e);r.layers=this.layers,this.add(r);const o=new He(Ai,Ti,t,e);o.layers=this.layers,this.add(o);const c=new He(Ai,Ti,t,e);c.layers=this.layers,this.add(c);const l=new He(Ai,Ti,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===En)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===xa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,h]=this.children,f=t.getRenderTarget(),p=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,a),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,p,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class ud extends Re{constructor(t,e,n,s,a,r,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:zi,super(t,e,n,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Yf extends ri{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ud(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:on}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new hn(5,5,5),a=new Gn({name:"CubemapFromEquirect",uniforms:Gi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:De,blending:zn});a.uniforms.tEquirect.value=e;const r=new re(s,a),o=e.minFilter;return e.minFilter===ii&&(e.minFilter=on),new $f(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(a)}}const ur=new Z,Zf=new Z,qf=new Ht;class Jn{constructor(t=new Z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ur.subVectors(n,e).cross(Zf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ur),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||qf.getNormalMatrix(t),s=this.coplanarPoint(ur).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zn=new wa,Gs=new Z;class Zo{constructor(t=new Jn,e=new Jn,n=new Jn,s=new Jn,a=new Jn,r=new Jn){this.planes=[t,e,n,s,a,r]}set(t,e,n,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=En){const n=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],h=s[5],f=s[6],p=s[7],d=s[8],g=s[9],_=s[10],m=s[11],u=s[12],x=s[13],y=s[14],v=s[15];if(n[0].setComponents(c-a,p-l,m-d,v-u).normalize(),n[1].setComponents(c+a,p+l,m+d,v+u).normalize(),n[2].setComponents(c+r,p+h,m+g,v+x).normalize(),n[3].setComponents(c-r,p-h,m-g,v-x).normalize(),n[4].setComponents(c-o,p-f,m-_,v-y).normalize(),e===En)n[5].setComponents(c+o,p+f,m+_,v+y).normalize();else if(e===xa)n[5].setComponents(o,f,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Zn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Zn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Zn)}intersectsSprite(t){return Zn.center.set(0,0,0),Zn.radius=.7071067811865476,Zn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Zn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Gs.x=s.normal.x>0?t.max.x:t.min.x,Gs.y=s.normal.y>0?t.max.y:t.min.y,Gs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Gs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function fd(){let i=null,t=!1,e=null,n=null;function s(a,r){e(a,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function jf(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,f=l.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:p,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,c,l){const h=c.array,f=c.updateRanges;if(i.bindBuffer(l,o),f.length===0)i.bufferSubData(l,0,h);else{f.sort((d,g)=>d.start-g.start);let p=0;for(let d=1;d<f.length;d++){const g=f[p],_=f[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++p,f[p]=_)}f.length=p+1;for(let d=0,g=f.length;d<g;d++){const _=f[d];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class Ra extends Le{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,f=t/o,p=e/c,d=[],g=[],_=[],m=[];for(let u=0;u<h;u++){const x=u*p-r;for(let y=0;y<l;y++){const v=y*f-a;g.push(v,-x,0),_.push(0,0,1),m.push(y/o),m.push(1-u/c)}}for(let u=0;u<c;u++)for(let x=0;x<o;x++){const y=x+l*u,v=x+l*(u+1),L=x+1+l*(u+1),w=x+1+l*u;d.push(y,v,w),d.push(v,L,w)}this.setIndex(d),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(_,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ra(t.width,t.height,t.widthSegments,t.heightSegments)}}var Kf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Jf=`#ifdef USE_ALPHAHASH
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
#endif`,Qf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ep=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,np=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ip=`#ifdef USE_AOMAP
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
#endif`,sp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ap=`#ifdef USE_BATCHING
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
#endif`,rp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,op=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,lp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,dp=`#ifdef USE_IRIDESCENCE
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
#endif`,hp=`#ifdef USE_BUMPMAP
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
#endif`,up=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,fp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,pp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_p=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,vp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Mp=`#define PI 3.141592653589793
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
} // validated`,yp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Sp=`vec3 transformedNormal = objectNormal;
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
#endif`,bp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ep=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ap=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Tp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Cp=`#ifdef USE_ENVMAP
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
#endif`,Pp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Dp=`#ifdef USE_ENVMAP
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
#endif`,Lp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ip=`#ifdef USE_ENVMAP
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
#endif`,Up=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,kp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Np=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zp=`#ifdef USE_GRADIENTMAP
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
}`,Op=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Bp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gp=`uniform bool receiveShadow;
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
#endif`,Vp=`#ifdef USE_ENVMAP
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
#endif`,Wp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Xp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$p=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Yp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Zp=`PhysicalMaterial material;
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
#endif`,qp=`struct PhysicalMaterial {
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
}`,jp=`
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
#endif`,Kp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Jp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,em=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,im=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,am=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,rm=`#if defined( USE_POINTS_UV )
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
#endif`,om=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,lm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,hm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,um=`#ifdef USE_MORPHTARGETS
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
#endif`,fm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,mm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,gm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_m=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,vm=`#ifdef USE_NORMALMAP
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
#endif`,Mm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ym=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Sm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Em=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Am=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Tm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Rm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Pm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Dm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Lm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Im=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Um=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,km=`float getShadowMask() {
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
}`,Fm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Nm=`#ifdef USE_SKINNING
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
#endif`,zm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Om=`#ifdef USE_SKINNING
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
#endif`,Bm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Hm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Gm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Vm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Wm=`#ifdef USE_TRANSMISSION
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
#endif`,Xm=`#ifdef USE_TRANSMISSION
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
#endif`,$m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ym=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const jm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Km=`uniform sampler2D t2D;
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
}`,Jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ng=`#include <common>
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
}`,ig=`#if DEPTH_PACKING == 3200
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
}`,sg=`#define DISTANCE
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
}`,ag=`#define DISTANCE
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
}`,rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,og=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cg=`uniform float scale;
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
}`,lg=`uniform vec3 diffuse;
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
}`,dg=`#include <common>
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
}`,hg=`uniform vec3 diffuse;
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
}`,ug=`#define LAMBERT
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
}`,fg=`#define LAMBERT
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
}`,pg=`#define MATCAP
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
}`,mg=`#define MATCAP
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
}`,gg=`#define NORMAL
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
}`,_g=`#define NORMAL
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
}`,xg=`#define PHONG
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
}`,vg=`#define PHONG
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
}`,Mg=`#define STANDARD
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
}`,yg=`#define STANDARD
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
}`,Sg=`#define TOON
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
}`,bg=`#define TOON
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
}`,Eg=`uniform float size;
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
}`,Ag=`uniform vec3 diffuse;
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
}`,Tg=`#include <common>
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
}`,wg=`uniform vec3 color;
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
}`,Rg=`uniform float rotation;
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
}`,Cg=`uniform vec3 diffuse;
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
}`,Wt={alphahash_fragment:Kf,alphahash_pars_fragment:Jf,alphamap_fragment:Qf,alphamap_pars_fragment:tp,alphatest_fragment:ep,alphatest_pars_fragment:np,aomap_fragment:ip,aomap_pars_fragment:sp,batching_pars_vertex:ap,batching_vertex:rp,begin_vertex:op,beginnormal_vertex:cp,bsdfs:lp,iridescence_fragment:dp,bumpmap_pars_fragment:hp,clipping_planes_fragment:up,clipping_planes_pars_fragment:fp,clipping_planes_pars_vertex:pp,clipping_planes_vertex:mp,color_fragment:gp,color_pars_fragment:_p,color_pars_vertex:xp,color_vertex:vp,common:Mp,cube_uv_reflection_fragment:yp,defaultnormal_vertex:Sp,displacementmap_pars_vertex:bp,displacementmap_vertex:Ep,emissivemap_fragment:Ap,emissivemap_pars_fragment:Tp,colorspace_fragment:wp,colorspace_pars_fragment:Rp,envmap_fragment:Cp,envmap_common_pars_fragment:Pp,envmap_pars_fragment:Dp,envmap_pars_vertex:Lp,envmap_physical_pars_fragment:Vp,envmap_vertex:Ip,fog_vertex:Up,fog_pars_vertex:kp,fog_fragment:Fp,fog_pars_fragment:Np,gradientmap_pars_fragment:zp,lightmap_pars_fragment:Op,lights_lambert_fragment:Bp,lights_lambert_pars_fragment:Hp,lights_pars_begin:Gp,lights_toon_fragment:Wp,lights_toon_pars_fragment:Xp,lights_phong_fragment:$p,lights_phong_pars_fragment:Yp,lights_physical_fragment:Zp,lights_physical_pars_fragment:qp,lights_fragment_begin:jp,lights_fragment_maps:Kp,lights_fragment_end:Jp,logdepthbuf_fragment:Qp,logdepthbuf_pars_fragment:tm,logdepthbuf_pars_vertex:em,logdepthbuf_vertex:nm,map_fragment:im,map_pars_fragment:sm,map_particle_fragment:am,map_particle_pars_fragment:rm,metalnessmap_fragment:om,metalnessmap_pars_fragment:cm,morphinstance_vertex:lm,morphcolor_vertex:dm,morphnormal_vertex:hm,morphtarget_pars_vertex:um,morphtarget_vertex:fm,normal_fragment_begin:pm,normal_fragment_maps:mm,normal_pars_fragment:gm,normal_pars_vertex:_m,normal_vertex:xm,normalmap_pars_fragment:vm,clearcoat_normal_fragment_begin:Mm,clearcoat_normal_fragment_maps:ym,clearcoat_pars_fragment:Sm,iridescence_pars_fragment:bm,opaque_fragment:Em,packing:Am,premultiplied_alpha_fragment:Tm,project_vertex:wm,dithering_fragment:Rm,dithering_pars_fragment:Cm,roughnessmap_fragment:Pm,roughnessmap_pars_fragment:Dm,shadowmap_pars_fragment:Lm,shadowmap_pars_vertex:Im,shadowmap_vertex:Um,shadowmask_pars_fragment:km,skinbase_vertex:Fm,skinning_pars_vertex:Nm,skinning_vertex:zm,skinnormal_vertex:Om,specularmap_fragment:Bm,specularmap_pars_fragment:Hm,tonemapping_fragment:Gm,tonemapping_pars_fragment:Vm,transmission_fragment:Wm,transmission_pars_fragment:Xm,uv_pars_fragment:$m,uv_pars_vertex:Ym,uv_vertex:Zm,worldpos_vertex:qm,background_vert:jm,background_frag:Km,backgroundCube_vert:Jm,backgroundCube_frag:Qm,cube_vert:tg,cube_frag:eg,depth_vert:ng,depth_frag:ig,distanceRGBA_vert:sg,distanceRGBA_frag:ag,equirect_vert:rg,equirect_frag:og,linedashed_vert:cg,linedashed_frag:lg,meshbasic_vert:dg,meshbasic_frag:hg,meshlambert_vert:ug,meshlambert_frag:fg,meshmatcap_vert:pg,meshmatcap_frag:mg,meshnormal_vert:gg,meshnormal_frag:_g,meshphong_vert:xg,meshphong_frag:vg,meshphysical_vert:Mg,meshphysical_frag:yg,meshtoon_vert:Sg,meshtoon_frag:bg,points_vert:Eg,points_frag:Ag,shadow_vert:Tg,shadow_frag:wg,sprite_vert:Rg,sprite_frag:Cg},St={common:{diffuse:{value:new Ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ht}},envmap:{envMap:{value:null},envMapRotation:{value:new Ht},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ht},normalScale:{value:new Bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0},uvTransform:{value:new Ht}},sprite:{diffuse:{value:new Ot(16777215)},opacity:{value:1},center:{value:new Bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}}},an={basic:{uniforms:Ae([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Wt.meshbasic_vert,fragmentShader:Wt.meshbasic_frag},lambert:{uniforms:Ae([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Ot(0)}}]),vertexShader:Wt.meshlambert_vert,fragmentShader:Wt.meshlambert_frag},phong:{uniforms:Ae([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Ot(0)},specular:{value:new Ot(1118481)},shininess:{value:30}}]),vertexShader:Wt.meshphong_vert,fragmentShader:Wt.meshphong_frag},standard:{uniforms:Ae([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag},toon:{uniforms:Ae([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Ot(0)}}]),vertexShader:Wt.meshtoon_vert,fragmentShader:Wt.meshtoon_frag},matcap:{uniforms:Ae([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Wt.meshmatcap_vert,fragmentShader:Wt.meshmatcap_frag},points:{uniforms:Ae([St.points,St.fog]),vertexShader:Wt.points_vert,fragmentShader:Wt.points_frag},dashed:{uniforms:Ae([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Wt.linedashed_vert,fragmentShader:Wt.linedashed_frag},depth:{uniforms:Ae([St.common,St.displacementmap]),vertexShader:Wt.depth_vert,fragmentShader:Wt.depth_frag},normal:{uniforms:Ae([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Wt.meshnormal_vert,fragmentShader:Wt.meshnormal_frag},sprite:{uniforms:Ae([St.sprite,St.fog]),vertexShader:Wt.sprite_vert,fragmentShader:Wt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Wt.background_vert,fragmentShader:Wt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ht}},vertexShader:Wt.backgroundCube_vert,fragmentShader:Wt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Wt.cube_vert,fragmentShader:Wt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Wt.equirect_vert,fragmentShader:Wt.equirect_frag},distanceRGBA:{uniforms:Ae([St.common,St.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Wt.distanceRGBA_vert,fragmentShader:Wt.distanceRGBA_frag},shadow:{uniforms:Ae([St.lights,St.fog,{color:{value:new Ot(0)},opacity:{value:1}}]),vertexShader:Wt.shadow_vert,fragmentShader:Wt.shadow_frag}};an.physical={uniforms:Ae([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ht},clearcoatNormalScale:{value:new Bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ht},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ht},sheen:{value:0},sheenColor:{value:new Ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ht},transmissionSamplerSize:{value:new Bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ht},attenuationDistance:{value:0},attenuationColor:{value:new Ot(0)},specularColor:{value:new Ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ht},anisotropyVector:{value:new Bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ht}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag};const Vs={r:0,b:0,g:0},qn=new dn,Pg=new oe;function Dg(i,t,e,n,s,a,r){const o=new Ot(0);let c=a===!0?0:1,l,h,f=null,p=0,d=null;function g(x){let y=x.isScene===!0?x.background:null;return y&&y.isTexture&&(y=(x.backgroundBlurriness>0?e:t).get(y)),y}function _(x){let y=!1;const v=g(x);v===null?u(o,c):v&&v.isColor&&(u(v,1),y=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,r):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,y){const v=g(y);v&&(v.isCubeTexture||v.mapping===Aa)?(h===void 0&&(h=new re(new hn(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:Gi(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:De,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,w,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),qn.copy(y.backgroundRotation),qn.x*=-1,qn.y*=-1,qn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(qn.y*=-1,qn.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Pg.makeRotationFromEuler(qn)),h.material.toneMapped=qt.getTransfer(v.colorSpace)!==ee,(f!==v||p!==v.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=v,p=v.version,d=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new re(new Ra(2,2),new Gn({name:"BackgroundMaterial",uniforms:Gi(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=qt.getTransfer(v.colorSpace)!==ee,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||p!==v.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,f=v,p=v.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function u(x,y){x.getRGB(Vs,dd(i)),n.buffers.color.setClear(Vs.r,Vs.g,Vs.b,y,r)}return{getClearColor:function(){return o},setClearColor:function(x,y=1){o.set(x),c=y,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,u(o,c)},render:_,addToRenderList:m}}function Lg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let a=s,r=!1;function o(S,R,T,D,O){let H=!1;const I=f(D,T,R);a!==I&&(a=I,l(a.object)),H=d(S,D,T,O),H&&g(S,D,T,O),O!==null&&t.update(O,i.ELEMENT_ARRAY_BUFFER),(H||r)&&(r=!1,v(S,R,T,D),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function f(S,R,T){const D=T.wireframe===!0;let O=n[S.id];O===void 0&&(O={},n[S.id]=O);let H=O[R.id];H===void 0&&(H={},O[R.id]=H);let I=H[D];return I===void 0&&(I=p(c()),H[D]=I),I}function p(S){const R=[],T=[],D=[];for(let O=0;O<e;O++)R[O]=0,T[O]=0,D[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:T,attributeDivisors:D,object:S,attributes:{},index:null}}function d(S,R,T,D){const O=a.attributes,H=R.attributes;let I=0;const X=T.getAttributes();for(const Y in X)if(X[Y].location>=0){const et=O[Y];let mt=H[Y];if(mt===void 0&&(Y==="instanceMatrix"&&S.instanceMatrix&&(mt=S.instanceMatrix),Y==="instanceColor"&&S.instanceColor&&(mt=S.instanceColor)),et===void 0||et.attribute!==mt||mt&&et.data!==mt.data)return!0;I++}return a.attributesNum!==I||a.index!==D}function g(S,R,T,D){const O={},H=R.attributes;let I=0;const X=T.getAttributes();for(const Y in X)if(X[Y].location>=0){let et=H[Y];et===void 0&&(Y==="instanceMatrix"&&S.instanceMatrix&&(et=S.instanceMatrix),Y==="instanceColor"&&S.instanceColor&&(et=S.instanceColor));const mt={};mt.attribute=et,et&&et.data&&(mt.data=et.data),O[Y]=mt,I++}a.attributes=O,a.attributesNum=I,a.index=D}function _(){const S=a.newAttributes;for(let R=0,T=S.length;R<T;R++)S[R]=0}function m(S){u(S,0)}function u(S,R){const T=a.newAttributes,D=a.enabledAttributes,O=a.attributeDivisors;T[S]=1,D[S]===0&&(i.enableVertexAttribArray(S),D[S]=1),O[S]!==R&&(i.vertexAttribDivisor(S,R),O[S]=R)}function x(){const S=a.newAttributes,R=a.enabledAttributes;for(let T=0,D=R.length;T<D;T++)R[T]!==S[T]&&(i.disableVertexAttribArray(T),R[T]=0)}function y(S,R,T,D,O,H,I){I===!0?i.vertexAttribIPointer(S,R,T,O,H):i.vertexAttribPointer(S,R,T,D,O,H)}function v(S,R,T,D){_();const O=D.attributes,H=T.getAttributes(),I=R.defaultAttributeValues;for(const X in H){const Y=H[X];if(Y.location>=0){let q=O[X];if(q===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(q=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(q=S.instanceColor)),q!==void 0){const et=q.normalized,mt=q.itemSize,vt=t.get(q);if(vt===void 0)continue;const ft=vt.buffer,j=vt.type,st=vt.bytesPerElement,ht=j===i.INT||j===i.UNSIGNED_INT||q.gpuType===Bo;if(q.isInterleavedBufferAttribute){const pt=q.data,gt=pt.stride,wt=q.offset;if(pt.isInstancedInterleavedBuffer){for(let Rt=0;Rt<Y.locationSize;Rt++)u(Y.location+Rt,pt.meshPerAttribute);S.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let Rt=0;Rt<Y.locationSize;Rt++)m(Y.location+Rt);i.bindBuffer(i.ARRAY_BUFFER,ft);for(let Rt=0;Rt<Y.locationSize;Rt++)y(Y.location+Rt,mt/Y.locationSize,j,et,gt*st,(wt+mt/Y.locationSize*Rt)*st,ht)}else{if(q.isInstancedBufferAttribute){for(let pt=0;pt<Y.locationSize;pt++)u(Y.location+pt,q.meshPerAttribute);S.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let pt=0;pt<Y.locationSize;pt++)m(Y.location+pt);i.bindBuffer(i.ARRAY_BUFFER,ft);for(let pt=0;pt<Y.locationSize;pt++)y(Y.location+pt,mt/Y.locationSize,j,et,mt*st,mt/Y.locationSize*pt*st,ht)}}else if(I!==void 0){const et=I[X];if(et!==void 0)switch(et.length){case 2:i.vertexAttrib2fv(Y.location,et);break;case 3:i.vertexAttrib3fv(Y.location,et);break;case 4:i.vertexAttrib4fv(Y.location,et);break;default:i.vertexAttrib1fv(Y.location,et)}}}}x()}function L(){P();for(const S in n){const R=n[S];for(const T in R){const D=R[T];for(const O in D)h(D[O].object),delete D[O];delete R[T]}delete n[S]}}function w(S){if(n[S.id]===void 0)return;const R=n[S.id];for(const T in R){const D=R[T];for(const O in D)h(D[O].object),delete D[O];delete R[T]}delete n[S.id]}function C(S){for(const R in n){const T=n[R];if(T[S.id]===void 0)continue;const D=T[S.id];for(const O in D)h(D[O].object),delete D[O];delete T[S.id]}}function P(){b(),r=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:b,dispose:L,releaseStatesOfGeometry:w,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function Ig(i,t,e){let n;function s(l){n=l}function a(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,f){f!==0&&(i.drawArraysInstanced(n,l,h,f),e.update(h,n,f))}function o(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,f);let d=0;for(let g=0;g<f;g++)d+=h[g];e.update(d,n,1)}function c(l,h,f,p){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)r(l[g],h[g],p[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,p,0,f);let g=0;for(let _=0;_<f;_++)g+=h[_]*p[_];e.update(g,n,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Ug(i,t,e,n){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==qe&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const P=C===us&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==Tn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==bn&&!P)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=e.logarithmicDepthBuffer===!0,p=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:L,maxSamples:w}}function kg(i){const t=this;let e=null,n=0,s=!1,a=!1;const r=new Jn,o=new Ht,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const d=f.length!==0||p||n!==0||s;return s=p,n=f.length,d},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,p){e=h(f,p,0)},this.setState=function(f,p,d){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,u=i.get(f);if(!s||g===null||g.length===0||a&&!m)a?h(null):l();else{const x=a?0:n,y=x*4;let v=u.clippingState||null;c.value=v,v=h(g,p,y,d);for(let L=0;L!==y;++L)v[L]=e[L];u.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,p,d,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const u=d+_*4,x=p.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<u)&&(m=new Float32Array(u));for(let y=0,v=d;y!==_;++y,v+=4)r.copy(f[y]).applyMatrix4(x,o),r.normal.toArray(m,v),m[v+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Fg(i){let t=new WeakMap;function e(r,o){return o===Zr?r.mapping=zi:o===qr&&(r.mapping=Oi),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===Zr||o===qr)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new Yf(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class pd extends hd{constructor(t=-1,e=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Li=4,Yc=[.125,.215,.35,.446,.526,.582],ei=20,fr=new pd,Zc=new Ot;let pr=null,mr=0,gr=0,_r=!1;const Qn=(1+Math.sqrt(5))/2,wi=1/Qn,qc=[new Z(-Qn,wi,0),new Z(Qn,wi,0),new Z(-wi,0,Qn),new Z(wi,0,Qn),new Z(0,Qn,-wi),new Z(0,Qn,wi),new Z(-1,1,-1),new Z(1,1,-1),new Z(-1,1,1),new Z(1,1,1)];class jc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){pr=this._renderer.getRenderTarget(),mr=this._renderer.getActiveCubeFace(),gr=this._renderer.getActiveMipmapLevel(),_r=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(pr,mr,gr),this._renderer.xr.enabled=_r,t.scissorTest=!1,Ws(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zi||t.mapping===Oi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),pr=this._renderer.getRenderTarget(),mr=this._renderer.getActiveCubeFace(),gr=this._renderer.getActiveMipmapLevel(),_r=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:on,minFilter:on,generateMipmaps:!1,type:us,format:qe,colorSpace:Vi,depthBuffer:!1},s=Kc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kc(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ng(a)),this._blurMaterial=zg(a,t,e)}return s}_compileMaterial(t){const e=new re(this._lodPlanes[0],t);this._renderer.compile(e,fr)}_sceneToCubeUV(t,e,n,s){const o=new He(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor(Zc),h.toneMapping=On,h.autoClear=!1;const d=new sn({name:"PMREM.Background",side:De,depthWrite:!1,depthTest:!1}),g=new re(new hn,d);let _=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,_=!0):(d.color.copy(Zc),_=!0);for(let u=0;u<6;u++){const x=u%3;x===0?(o.up.set(0,c[u],0),o.lookAt(l[u],0,0)):x===1?(o.up.set(0,0,c[u]),o.lookAt(0,l[u],0)):(o.up.set(0,c[u],0),o.lookAt(0,0,l[u]));const y=this._cubeSize;Ws(s,x*y,u>2?y:0,y,y),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=p,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===zi||t.mapping===Oi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jc());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new re(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;Ws(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,fr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=qc[(s-a-1)%qc.length];this._blur(t,a-1,a,r,o)}e.autoClear=n}_blur(t,e,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",a),this._halfBlur(r,t,n,n,s,"longitudinal",a)}_halfBlur(t,e,n,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new re(this._lodPlanes[s],l),p=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*d):2*Math.PI/(2*ei-1),_=a/g,m=isFinite(a)?1+Math.floor(h*_):ei;m>ei&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ei}`);const u=[];let x=0;for(let C=0;C<ei;++C){const P=C/_,b=Math.exp(-P*P/2);u.push(b),C===0?x+=b:C<m&&(x+=2*b)}for(let C=0;C<u.length;C++)u[C]=u[C]/x;p.envMap.value=t.texture,p.samples.value=m,p.weights.value=u,p.latitudinal.value=r==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:y}=this;p.dTheta.value=g,p.mipInt.value=y-n;const v=this._sizeLods[s],L=3*v*(s>y-Li?s-y+Li:0),w=4*(this._cubeSize-v);Ws(e,L,w,3*v,2*v),c.setRenderTarget(e),c.render(f,fr)}}function Ng(i){const t=[],e=[],n=[];let s=i;const a=i-Li+1+Yc.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>i-Li?c=Yc[r-i+Li-1]:r===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,f=1+l,p=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,g=6,_=3,m=2,u=1,x=new Float32Array(_*g*d),y=new Float32Array(m*g*d),v=new Float32Array(u*g*d);for(let w=0;w<d;w++){const C=w%3*2/3-1,P=w>2?0:-1,b=[C,P,0,C+2/3,P,0,C+2/3,P+1,0,C,P,0,C+2/3,P+1,0,C,P+1,0];x.set(b,_*g*w),y.set(p,m*g*w);const S=[w,w,w,w,w,w];v.set(S,u*g*w)}const L=new Le;L.setAttribute("position",new Ke(x,_)),L.setAttribute("uv",new Ke(y,m)),L.setAttribute("faceIndex",new Ke(v,u)),t.push(L),s>Li&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Kc(i,t,e){const n=new ri(i,t,e);return n.texture.mapping=Aa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ws(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function zg(i,t,e){const n=new Float32Array(ei),s=new Z(0,1,0);return new Gn({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:qo(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function Jc(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qo(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function Qc(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function qo(){return`

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
	`}function Og(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Zr||c===qr,h=c===zi||c===Oi;if(l||h){let f=t.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return e===null&&(e=new jc(i)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new jc(i)),f=l?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function Bg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&ss("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Hg(i,t,e,n){const s={},a=new WeakMap;function r(f){const p=f.target;p.index!==null&&t.remove(p.index);for(const g in p.attributes)t.remove(p.attributes[g]);for(const g in p.morphAttributes){const _=p.morphAttributes[g];for(let m=0,u=_.length;m<u;m++)t.remove(_[m])}p.removeEventListener("dispose",r),delete s[p.id];const d=a.get(p);d&&(t.remove(d),a.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",r),s[p.id]=!0,e.memory.geometries++),p}function c(f){const p=f.attributes;for(const g in p)t.update(p[g],i.ARRAY_BUFFER);const d=f.morphAttributes;for(const g in d){const _=d[g];for(let m=0,u=_.length;m<u;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(f){const p=[],d=f.index,g=f.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let y=0,v=x.length;y<v;y+=3){const L=x[y+0],w=x[y+1],C=x[y+2];p.push(L,w,w,C,C,L)}}else if(g!==void 0){const x=g.array;_=g.version;for(let y=0,v=x.length/3-1;y<v;y+=3){const L=y+0,w=y+1,C=y+2;p.push(L,w,w,C,C,L)}}else return;const m=new(sd(p)?ld:cd)(p,1);m.version=_;const u=a.get(f);u&&t.remove(u),a.set(f,m)}function h(f){const p=a.get(f);if(p){const d=f.index;d!==null&&p.version<d.version&&l(f)}else l(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function Gg(i,t,e){let n;function s(p){n=p}let a,r;function o(p){a=p.type,r=p.bytesPerElement}function c(p,d){i.drawElements(n,d,a,p*r),e.update(d,n,1)}function l(p,d,g){g!==0&&(i.drawElementsInstanced(n,d,a,p*r,g),e.update(d,n,g))}function h(p,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,a,p,0,g);let m=0;for(let u=0;u<g;u++)m+=d[u];e.update(m,n,1)}function f(p,d,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<p.length;u++)l(p[u]/r,d[u],_[u]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,a,p,0,_,0,g);let u=0;for(let x=0;x<g;x++)u+=d[x]*_[x];e.update(u,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Vg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Wg(i,t,e){const n=new WeakMap,s=new le;function a(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let p=n.get(o);if(p===void 0||p.count!==f){let S=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var d=S;p!==void 0&&p.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let L=o.attributes.position.count*v,w=1;L>t.maxTextureSize&&(w=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const C=new Float32Array(L*w*4*f),P=new rd(C,L,w,f);P.type=bn,P.needsUpdate=!0;const b=v*4;for(let R=0;R<f;R++){const T=u[R],D=x[R],O=y[R],H=L*w*4*R;for(let I=0;I<T.count;I++){const X=I*b;g===!0&&(s.fromBufferAttribute(T,I),C[H+X+0]=s.x,C[H+X+1]=s.y,C[H+X+2]=s.z,C[H+X+3]=0),_===!0&&(s.fromBufferAttribute(D,I),C[H+X+4]=s.x,C[H+X+5]=s.y,C[H+X+6]=s.z,C[H+X+7]=0),m===!0&&(s.fromBufferAttribute(O,I),C[H+X+8]=s.x,C[H+X+9]=s.y,C[H+X+10]=s.z,C[H+X+11]=O.itemSize===4?s.w:1)}}p={count:f,texture:P,size:new Bt(L,w)},n.set(o,p),o.addEventListener("dispose",S)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:a}}function Xg(i,t,e,n){let s=new WeakMap;function a(c){const l=n.render.frame,h=c.geometry,f=t.get(c,h);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==l&&(p.update(),s.set(p,l))}return f}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class md extends Re{constructor(t,e,n,s,a,r,o,c,l,h=ki){if(h!==ki&&h!==Hi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ki&&(n=ai),n===void 0&&h===Hi&&(n=Bi),super(null,s,a,r,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:je,this.minFilter=c!==void 0?c:je,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const gd=new Re,tl=new md(1,1),_d=new rd,xd=new Df,vd=new ud,el=[],nl=[],il=new Float32Array(16),sl=new Float32Array(9),al=new Float32Array(4);function Xi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let a=el[s];if(a===void 0&&(a=new Float32Array(s),el[s]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,i[r].toArray(a,o)}return a}function _e(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ca(i,t){let e=nl[t];e===void 0&&(e=new Int32Array(t),nl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function $g(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Yg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2fv(this.addr,t),xe(e,t)}}function Zg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;i.uniform3fv(this.addr,t),xe(e,t)}}function qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4fv(this.addr,t),xe(e,t)}}function jg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;al.set(n),i.uniformMatrix2fv(this.addr,!1,al),xe(e,n)}}function Kg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;sl.set(n),i.uniformMatrix3fv(this.addr,!1,sl),xe(e,n)}}function Jg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;il.set(n),i.uniformMatrix4fv(this.addr,!1,il),xe(e,n)}}function Qg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function t0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2iv(this.addr,t),xe(e,t)}}function e0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3iv(this.addr,t),xe(e,t)}}function n0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4iv(this.addr,t),xe(e,t)}}function i0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function s0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2uiv(this.addr,t),xe(e,t)}}function a0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3uiv(this.addr,t),xe(e,t)}}function r0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4uiv(this.addr,t),xe(e,t)}}function o0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(tl.compareFunction=id,a=tl):a=gd,e.setTexture2D(t||a,s)}function c0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||xd,s)}function l0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||vd,s)}function d0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||_d,s)}function h0(i){switch(i){case 5126:return $g;case 35664:return Yg;case 35665:return Zg;case 35666:return qg;case 35674:return jg;case 35675:return Kg;case 35676:return Jg;case 5124:case 35670:return Qg;case 35667:case 35671:return t0;case 35668:case 35672:return e0;case 35669:case 35673:return n0;case 5125:return i0;case 36294:return s0;case 36295:return a0;case 36296:return r0;case 35678:case 36198:case 36298:case 36306:case 35682:return o0;case 35679:case 36299:case 36307:return c0;case 35680:case 36300:case 36308:case 36293:return l0;case 36289:case 36303:case 36311:case 36292:return d0}}function u0(i,t){i.uniform1fv(this.addr,t)}function f0(i,t){const e=Xi(t,this.size,2);i.uniform2fv(this.addr,e)}function p0(i,t){const e=Xi(t,this.size,3);i.uniform3fv(this.addr,e)}function m0(i,t){const e=Xi(t,this.size,4);i.uniform4fv(this.addr,e)}function g0(i,t){const e=Xi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function _0(i,t){const e=Xi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function x0(i,t){const e=Xi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function v0(i,t){i.uniform1iv(this.addr,t)}function M0(i,t){i.uniform2iv(this.addr,t)}function y0(i,t){i.uniform3iv(this.addr,t)}function S0(i,t){i.uniform4iv(this.addr,t)}function b0(i,t){i.uniform1uiv(this.addr,t)}function E0(i,t){i.uniform2uiv(this.addr,t)}function A0(i,t){i.uniform3uiv(this.addr,t)}function T0(i,t){i.uniform4uiv(this.addr,t)}function w0(i,t,e){const n=this.cache,s=t.length,a=Ca(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||gd,a[r])}function R0(i,t,e){const n=this.cache,s=t.length,a=Ca(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||xd,a[r])}function C0(i,t,e){const n=this.cache,s=t.length,a=Ca(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||vd,a[r])}function P0(i,t,e){const n=this.cache,s=t.length,a=Ca(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||_d,a[r])}function D0(i){switch(i){case 5126:return u0;case 35664:return f0;case 35665:return p0;case 35666:return m0;case 35674:return g0;case 35675:return _0;case 35676:return x0;case 5124:case 35670:return v0;case 35667:case 35671:return M0;case 35668:case 35672:return y0;case 35669:case 35673:return S0;case 5125:return b0;case 36294:return E0;case 36295:return A0;case 36296:return T0;case 35678:case 36198:case 36298:case 36306:case 35682:return w0;case 35679:case 36299:case 36307:return R0;case 35680:case 36300:case 36308:case 36293:return C0;case 36289:case 36303:case 36311:case 36292:return P0}}class L0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=h0(e.type)}}class I0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=D0(e.type)}}class U0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],n)}}}const xr=/(\w+)(\])?(\[|\.)?/g;function rl(i,t){i.seq.push(t),i.map[t.id]=t}function k0(i,t,e){const n=i.name,s=n.length;for(xr.lastIndex=0;;){const a=xr.exec(n),r=xr.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){rl(e,l===void 0?new L0(o,i,t):new I0(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new U0(o),rl(e,f)),e=f}}}class ca{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);k0(a,r,this)}}setValue(t,e,n,s){const a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function ol(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const F0=37297;let N0=0;function z0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}const cl=new Ht;function O0(i){qt._getMatrix(cl,qt.workingColorSpace,i);const t=`mat3( ${cl.elements.map(e=>e.toFixed(4))} )`;switch(qt.getTransfer(i)){case Ta:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function ll(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+z0(i.getShaderSource(t),r)}else return s}function B0(i,t){const e=O0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function H0(i,t){let e;switch(t){case sf:e="Linear";break;case af:e="Reinhard";break;case rf:e="Cineon";break;case of:e="ACESFilmic";break;case lf:e="AgX";break;case df:e="Neutral";break;case cf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Xs=new Z;function G0(){qt.getLuminanceCoefficients(Xs);const i=Xs.x.toFixed(4),t=Xs.y.toFixed(4),e=Xs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function V0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(as).join(`
`)}function W0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function X0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(t,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:i.getAttribLocation(t,r),locationSize:o}}return e}function as(i){return i!==""}function dl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const $0=/^[ \t]*#include +<([\w\d./]+)>/gm;function wo(i){return i.replace($0,Z0)}const Y0=new Map;function Z0(i,t){let e=Wt[t];if(e===void 0){const n=Y0.get(t);if(n!==void 0)e=Wt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return wo(e)}const q0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ul(i){return i.replace(q0,j0)}function j0(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function fl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function K0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Vl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Wl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===yn&&(t="SHADOWMAP_TYPE_VSM"),t}function J0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case zi:case Oi:t="ENVMAP_TYPE_CUBE";break;case Aa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Q0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Oi:t="ENVMAP_MODE_REFRACTION";break}return t}function t_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Oo:t="ENVMAP_BLENDING_MULTIPLY";break;case ef:t="ENVMAP_BLENDING_MIX";break;case nf:t="ENVMAP_BLENDING_ADD";break}return t}function e_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function n_(i,t,e,n){const s=i.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=K0(e),l=J0(e),h=Q0(e),f=t_(e),p=e_(e),d=V0(e),g=W0(a),_=s.createProgram();let m,u,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(as).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(as).join(`
`),u.length>0&&(u+=`
`)):(m=[fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(as).join(`
`),u=[fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==On?"#define TONE_MAPPING":"",e.toneMapping!==On?Wt.tonemapping_pars_fragment:"",e.toneMapping!==On?H0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Wt.colorspace_pars_fragment,B0("linearToOutputTexel",e.outputColorSpace),G0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(as).join(`
`)),r=wo(r),r=dl(r,e),r=hl(r,e),o=wo(o),o=dl(o,e),o=hl(o,e),r=ul(r),o=ul(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",e.glslVersion===Tc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Tc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const y=x+m+r,v=x+u+o,L=ol(s,s.VERTEX_SHADER,y),w=ol(s,s.FRAGMENT_SHADER,v);s.attachShader(_,L),s.attachShader(_,w),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(R){if(i.debug.checkShaderErrors){const T=s.getProgramInfoLog(_).trim(),D=s.getShaderInfoLog(L).trim(),O=s.getShaderInfoLog(w).trim();let H=!0,I=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,L,w);else{const X=ll(s,L,"vertex"),Y=ll(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+T+`
`+X+`
`+Y)}else T!==""?console.warn("THREE.WebGLProgram: Program Info Log:",T):(D===""||O==="")&&(I=!1);I&&(R.diagnostics={runnable:H,programLog:T,vertexShader:{log:D,prefix:m},fragmentShader:{log:O,prefix:u}})}s.deleteShader(L),s.deleteShader(w),P=new ca(s,_),b=X0(s,_)}let P;this.getUniforms=function(){return P===void 0&&C(this),P};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,F0)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=N0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=w,this}let i_=0;class s_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new a_(t),e.set(t,n)),n}}class a_{constructor(t){this.id=i_++,this.code=t,this.usedTimes=0}}function r_(i,t,e,n,s,a,r){const o=new Yo,c=new s_,l=new Set,h=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,S,R,T,D){const O=T.fog,H=D.geometry,I=b.isMeshStandardMaterial?T.environment:null,X=(b.isMeshStandardMaterial?e:t).get(b.envMap||I),Y=X&&X.mapping===Aa?X.image.height:null,q=g[b.type];b.precision!==null&&(d=s.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const et=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,mt=et!==void 0?et.length:0;let vt=0;H.morphAttributes.position!==void 0&&(vt=1),H.morphAttributes.normal!==void 0&&(vt=2),H.morphAttributes.color!==void 0&&(vt=3);let ft,j,st,ht;if(q){const $t=an[q];ft=$t.vertexShader,j=$t.fragmentShader}else ft=b.vertexShader,j=b.fragmentShader,c.update(b),st=c.getVertexShaderID(b),ht=c.getFragmentShaderID(b);const pt=i.getRenderTarget(),gt=i.state.buffers.depth.getReversed(),wt=D.isInstancedMesh===!0,Rt=D.isBatchedMesh===!0,It=!!b.map,bt=!!b.matcap,Xt=!!X,F=!!b.aoMap,ie=!!b.lightMap,U=!!b.bumpMap,nt=!!b.normalMap,z=!!b.displacementMap,it=!!b.emissiveMap,rt=!!b.metalnessMap,E=!!b.roughnessMap,M=b.anisotropy>0,V=b.clearcoat>0,K=b.dispersion>0,at=b.iridescence>0,tt=b.sheen>0,ot=b.transmission>0,ut=M&&!!b.anisotropyMap,_t=V&&!!b.clearcoatMap,Nt=V&&!!b.clearcoatNormalMap,lt=V&&!!b.clearcoatRoughnessMap,Mt=at&&!!b.iridescenceMap,Lt=at&&!!b.iridescenceThicknessMap,Ut=tt&&!!b.sheenColorMap,Tt=tt&&!!b.sheenRoughnessMap,Gt=!!b.specularMap,Ft=!!b.specularColorMap,Zt=!!b.specularIntensityMap,N=ot&&!!b.transmissionMap,B=ot&&!!b.thicknessMap,k=!!b.gradientMap,G=!!b.alphaMap,ct=b.alphaTest>0,dt=!!b.alphaHash,yt=!!b.extensions;let Vt=On;b.toneMapped&&(pt===null||pt.isXRRenderTarget===!0)&&(Vt=i.toneMapping);const se={shaderID:q,shaderType:b.type,shaderName:b.name,vertexShader:ft,fragmentShader:j,defines:b.defines,customVertexShaderID:st,customFragmentShaderID:ht,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:Rt,batchingColor:Rt&&D._colorsTexture!==null,instancing:wt,instancingColor:wt&&D.instanceColor!==null,instancingMorph:wt&&D.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:pt===null?i.outputColorSpace:pt.isXRRenderTarget===!0?pt.texture.colorSpace:Vi,alphaToCoverage:!!b.alphaToCoverage,map:It,matcap:bt,envMap:Xt,envMapMode:Xt&&X.mapping,envMapCubeUVHeight:Y,aoMap:F,lightMap:ie,bumpMap:U,normalMap:nt,displacementMap:p&&z,emissiveMap:it,normalMapObjectSpace:nt&&b.normalMapType===pf,normalMapTangentSpace:nt&&b.normalMapType===nd,metalnessMap:rt,roughnessMap:E,anisotropy:M,anisotropyMap:ut,clearcoat:V,clearcoatMap:_t,clearcoatNormalMap:Nt,clearcoatRoughnessMap:lt,dispersion:K,iridescence:at,iridescenceMap:Mt,iridescenceThicknessMap:Lt,sheen:tt,sheenColorMap:Ut,sheenRoughnessMap:Tt,specularMap:Gt,specularColorMap:Ft,specularIntensityMap:Zt,transmission:ot,transmissionMap:N,thicknessMap:B,gradientMap:k,opaque:b.transparent===!1&&b.blending===Ui&&b.alphaToCoverage===!1,alphaMap:G,alphaTest:ct,alphaHash:dt,combine:b.combine,mapUv:It&&_(b.map.channel),aoMapUv:F&&_(b.aoMap.channel),lightMapUv:ie&&_(b.lightMap.channel),bumpMapUv:U&&_(b.bumpMap.channel),normalMapUv:nt&&_(b.normalMap.channel),displacementMapUv:z&&_(b.displacementMap.channel),emissiveMapUv:it&&_(b.emissiveMap.channel),metalnessMapUv:rt&&_(b.metalnessMap.channel),roughnessMapUv:E&&_(b.roughnessMap.channel),anisotropyMapUv:ut&&_(b.anisotropyMap.channel),clearcoatMapUv:_t&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Nt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:lt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Lt&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Tt&&_(b.sheenRoughnessMap.channel),specularMapUv:Gt&&_(b.specularMap.channel),specularColorMapUv:Ft&&_(b.specularColorMap.channel),specularIntensityMapUv:Zt&&_(b.specularIntensityMap.channel),transmissionMapUv:N&&_(b.transmissionMap.channel),thicknessMapUv:B&&_(b.thicknessMap.channel),alphaMapUv:G&&_(b.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(nt||M),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!H.attributes.uv&&(It||G),fog:!!O,useFog:b.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:gt,skinning:D.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:vt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Vt,decodeVideoTexture:It&&b.map.isVideoTexture===!0&&qt.getTransfer(b.map.colorSpace)===ee,decodeVideoTextureEmissive:it&&b.emissiveMap.isVideoTexture===!0&&qt.getTransfer(b.emissiveMap.colorSpace)===ee,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Te,flipSided:b.side===De,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:yt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(yt&&b.extensions.multiDraw===!0||Rt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return se.vertexUv1s=l.has(1),se.vertexUv2s=l.has(2),se.vertexUv3s=l.has(3),l.clear(),se}function u(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)S.push(R),S.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(x(S,b),y(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function x(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function y(b,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),b.push(o.mask)}function v(b){const S=g[b.type];let R;if(S){const T=an[S];R=Vf.clone(T.uniforms)}else R=b.uniforms;return R}function L(b,S){let R;for(let T=0,D=h.length;T<D;T++){const O=h[T];if(O.cacheKey===S){R=O,++R.usedTimes;break}}return R===void 0&&(R=new n_(i,S,b,a),h.push(R)),R}function w(b){if(--b.usedTimes===0){const S=h.indexOf(b);h[S]=h[h.length-1],h.pop(),b.destroy()}}function C(b){c.remove(b)}function P(){c.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:v,acquireProgram:L,releaseProgram:w,releaseShaderCache:C,programs:h,dispose:P}}function o_(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:a}}function c_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function pl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ml(){const i=[];let t=0;const e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function r(f,p,d,g,_,m){let u=i[t];return u===void 0?(u={id:f.id,object:f,geometry:p,material:d,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},i[t]=u):(u.id=f.id,u.object=f,u.geometry=p,u.material=d,u.groupOrder=g,u.renderOrder=f.renderOrder,u.z=_,u.group=m),t++,u}function o(f,p,d,g,_,m){const u=r(f,p,d,g,_,m);d.transmission>0?n.push(u):d.transparent===!0?s.push(u):e.push(u)}function c(f,p,d,g,_,m){const u=r(f,p,d,g,_,m);d.transmission>0?n.unshift(u):d.transparent===!0?s.unshift(u):e.unshift(u)}function l(f,p){e.length>1&&e.sort(f||c_),n.length>1&&n.sort(p||pl),s.length>1&&s.sort(p||pl)}function h(){for(let f=t,p=i.length;f<p;f++){const d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:o,unshift:c,finish:h,sort:l}}function l_(){let i=new WeakMap;function t(n,s){const a=i.get(n);let r;return a===void 0?(r=new ml,i.set(n,[r])):s>=a.length?(r=new ml,a.push(r)):r=a[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function d_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new Z,color:new Ot};break;case"SpotLight":e={position:new Z,direction:new Z,color:new Ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new Z,color:new Ot,distance:0,decay:0};break;case"HemisphereLight":e={direction:new Z,skyColor:new Ot,groundColor:new Ot};break;case"RectAreaLight":e={color:new Ot,position:new Z,halfWidth:new Z,halfHeight:new Z};break}return i[t.id]=e,e}}}function h_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let u_=0;function f_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function p_(i){const t=new d_,e=h_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new Z);const s=new Z,a=new oe,r=new oe;function o(l){let h=0,f=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,g=0,_=0,m=0,u=0,x=0,y=0,v=0,L=0,w=0,C=0;l.sort(f_);for(let b=0,S=l.length;b<S;b++){const R=l[b],T=R.color,D=R.intensity,O=R.distance,H=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=T.r*D,f+=T.g*D,p+=T.b*D;else if(R.isLightProbe){for(let I=0;I<9;I++)n.probe[I].addScaledVector(R.sh.coefficients[I],D);C++}else if(R.isDirectionalLight){const I=t.get(R);if(I.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const X=R.shadow,Y=e.get(R);Y.shadowIntensity=X.intensity,Y.shadowBias=X.bias,Y.shadowNormalBias=X.normalBias,Y.shadowRadius=X.radius,Y.shadowMapSize=X.mapSize,n.directionalShadow[d]=Y,n.directionalShadowMap[d]=H,n.directionalShadowMatrix[d]=R.shadow.matrix,x++}n.directional[d]=I,d++}else if(R.isSpotLight){const I=t.get(R);I.position.setFromMatrixPosition(R.matrixWorld),I.color.copy(T).multiplyScalar(D),I.distance=O,I.coneCos=Math.cos(R.angle),I.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),I.decay=R.decay,n.spot[_]=I;const X=R.shadow;if(R.map&&(n.spotLightMap[L]=R.map,L++,X.updateMatrices(R),R.castShadow&&w++),n.spotLightMatrix[_]=X.matrix,R.castShadow){const Y=e.get(R);Y.shadowIntensity=X.intensity,Y.shadowBias=X.bias,Y.shadowNormalBias=X.normalBias,Y.shadowRadius=X.radius,Y.shadowMapSize=X.mapSize,n.spotShadow[_]=Y,n.spotShadowMap[_]=H,v++}_++}else if(R.isRectAreaLight){const I=t.get(R);I.color.copy(T).multiplyScalar(D),I.halfWidth.set(R.width*.5,0,0),I.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=I,m++}else if(R.isPointLight){const I=t.get(R);if(I.color.copy(R.color).multiplyScalar(R.intensity),I.distance=R.distance,I.decay=R.decay,R.castShadow){const X=R.shadow,Y=e.get(R);Y.shadowIntensity=X.intensity,Y.shadowBias=X.bias,Y.shadowNormalBias=X.normalBias,Y.shadowRadius=X.radius,Y.shadowMapSize=X.mapSize,Y.shadowCameraNear=X.camera.near,Y.shadowCameraFar=X.camera.far,n.pointShadow[g]=Y,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=R.shadow.matrix,y++}n.point[g]=I,g++}else if(R.isHemisphereLight){const I=t.get(R);I.skyColor.copy(R.color).multiplyScalar(D),I.groundColor.copy(R.groundColor).multiplyScalar(D),n.hemi[u]=I,u++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=p;const P=n.hash;(P.directionalLength!==d||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==u||P.numDirectionalShadows!==x||P.numPointShadows!==y||P.numSpotShadows!==v||P.numSpotMaps!==L||P.numLightProbes!==C)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=u,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=v+L-w,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,P.directionalLength=d,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=u,P.numDirectionalShadows=x,P.numPointShadows=y,P.numSpotShadows=v,P.numSpotMaps=L,P.numLightProbes=C,n.version=u_++)}function c(l,h){let f=0,p=0,d=0,g=0,_=0;const m=h.matrixWorldInverse;for(let u=0,x=l.length;u<x;u++){const y=l[u];if(y.isDirectionalLight){const v=n.directional[f];v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(y.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(y.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),r.identity(),a.copy(y.matrixWorld),a.premultiply(m),r.extractRotation(a),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),g++}else if(y.isPointLight){const v=n.point[p];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),p++}else if(y.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function gl(i){const t=new p_(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function a(h){e.push(h)}function r(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function m_(i){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new gl(i),t.set(s,[o])):a>=r.length?(o=new gl(i),r.push(o)):o=r[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class g_ extends oi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=uf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class __ extends oi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const x_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,v_=`uniform sampler2D shadow_pass;
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
}`;function M_(i,t,e){let n=new Zo;const s=new Bt,a=new Bt,r=new le,o=new g_({depthPacking:ff}),c=new __,l={},h=e.maxTextureSize,f={[Hn]:De,[De]:Hn,[Te]:Te},p=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Bt},radius:{value:4}},vertexShader:x_,fragmentShader:v_}),d=p.clone();d.defines.HORIZONTAL_PASS=1;const g=new Le;g.setAttribute("position",new Ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new re(g,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vl;let u=this.type;this.render=function(w,C,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const b=i.getRenderTarget(),S=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),T=i.state;T.setBlending(zn),T.buffers.color.setClear(1,1,1,1),T.buffers.depth.setTest(!0),T.setScissorTest(!1);const D=u!==yn&&this.type===yn,O=u===yn&&this.type!==yn;for(let H=0,I=w.length;H<I;H++){const X=w[H],Y=X.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const q=Y.getFrameExtents();if(s.multiply(q),a.copy(Y.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/q.x),s.x=a.x*q.x,Y.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/q.y),s.y=a.y*q.y,Y.mapSize.y=a.y)),Y.map===null||D===!0||O===!0){const mt=this.type!==yn?{minFilter:je,magFilter:je}:{};Y.map!==null&&Y.map.dispose(),Y.map=new ri(s.x,s.y,mt),Y.map.texture.name=X.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const et=Y.getViewportCount();for(let mt=0;mt<et;mt++){const vt=Y.getViewport(mt);r.set(a.x*vt.x,a.y*vt.y,a.x*vt.z,a.y*vt.w),T.viewport(r),Y.updateMatrices(X,mt),n=Y.getFrustum(),v(C,P,Y.camera,X,this.type)}Y.isPointLightShadow!==!0&&this.type===yn&&x(Y,P),Y.needsUpdate=!1}u=this.type,m.needsUpdate=!1,i.setRenderTarget(b,S,R)};function x(w,C){const P=t.update(_);p.defines.VSM_SAMPLES!==w.blurSamples&&(p.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ri(s.x,s.y)),p.uniforms.shadow_pass.value=w.map.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(C,null,P,p,_,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(C,null,P,d,_,null)}function y(w,C,P,b){let S=null;const R=P.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)S=R;else if(S=P.isPointLight===!0?c:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const T=S.uuid,D=C.uuid;let O=l[T];O===void 0&&(O={},l[T]=O);let H=O[D];H===void 0&&(H=S.clone(),O[D]=H,C.addEventListener("dispose",L)),S=H}if(S.visible=C.visible,S.wireframe=C.wireframe,b===yn?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:f[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,P.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const T=i.properties.get(S);T.light=P}return S}function v(w,C,P,b,S){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&S===yn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,w.matrixWorld);const D=t.update(w),O=w.material;if(Array.isArray(O)){const H=D.groups;for(let I=0,X=H.length;I<X;I++){const Y=H[I],q=O[Y.materialIndex];if(q&&q.visible){const et=y(w,q,b,S);w.onBeforeShadow(i,w,C,P,D,et,Y),i.renderBufferDirect(P,null,D,et,w,Y),w.onAfterShadow(i,w,C,P,D,et,Y)}}}else if(O.visible){const H=y(w,O,b,S);w.onBeforeShadow(i,w,C,P,D,H,null),i.renderBufferDirect(P,null,D,H,w,null),w.onAfterShadow(i,w,C,P,D,H,null)}}const T=w.children;for(let D=0,O=T.length;D<O;D++)v(T[D],C,P,b,S)}function L(w){w.target.removeEventListener("dispose",L);for(const P in l){const b=l[P],S=w.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const y_={[Hr]:Gr,[Vr]:$r,[Wr]:Yr,[Ni]:Xr,[Gr]:Hr,[$r]:Vr,[Yr]:Wr,[Xr]:Ni};function S_(i,t){function e(){let N=!1;const B=new le;let k=null;const G=new le(0,0,0,0);return{setMask:function(ct){k!==ct&&!N&&(i.colorMask(ct,ct,ct,ct),k=ct)},setLocked:function(ct){N=ct},setClear:function(ct,dt,yt,Vt,se){se===!0&&(ct*=Vt,dt*=Vt,yt*=Vt),B.set(ct,dt,yt,Vt),G.equals(B)===!1&&(i.clearColor(ct,dt,yt,Vt),G.copy(B))},reset:function(){N=!1,k=null,G.set(-1,0,0,0)}}}function n(){let N=!1,B=!1,k=null,G=null,ct=null;return{setReversed:function(dt){if(B!==dt){const yt=t.get("EXT_clip_control");B?yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.ZERO_TO_ONE_EXT):yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.NEGATIVE_ONE_TO_ONE_EXT);const Vt=ct;ct=null,this.setClear(Vt)}B=dt},getReversed:function(){return B},setTest:function(dt){dt?pt(i.DEPTH_TEST):gt(i.DEPTH_TEST)},setMask:function(dt){k!==dt&&!N&&(i.depthMask(dt),k=dt)},setFunc:function(dt){if(B&&(dt=y_[dt]),G!==dt){switch(dt){case Hr:i.depthFunc(i.NEVER);break;case Gr:i.depthFunc(i.ALWAYS);break;case Vr:i.depthFunc(i.LESS);break;case Ni:i.depthFunc(i.LEQUAL);break;case Wr:i.depthFunc(i.EQUAL);break;case Xr:i.depthFunc(i.GEQUAL);break;case $r:i.depthFunc(i.GREATER);break;case Yr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}G=dt}},setLocked:function(dt){N=dt},setClear:function(dt){ct!==dt&&(B&&(dt=1-dt),i.clearDepth(dt),ct=dt)},reset:function(){N=!1,k=null,G=null,ct=null,B=!1}}}function s(){let N=!1,B=null,k=null,G=null,ct=null,dt=null,yt=null,Vt=null,se=null;return{setTest:function($t){N||($t?pt(i.STENCIL_TEST):gt(i.STENCIL_TEST))},setMask:function($t){B!==$t&&!N&&(i.stencilMask($t),B=$t)},setFunc:function($t,jt,ue){(k!==$t||G!==jt||ct!==ue)&&(i.stencilFunc($t,jt,ue),k=$t,G=jt,ct=ue)},setOp:function($t,jt,ue){(dt!==$t||yt!==jt||Vt!==ue)&&(i.stencilOp($t,jt,ue),dt=$t,yt=jt,Vt=ue)},setLocked:function($t){N=$t},setClear:function($t){se!==$t&&(i.clearStencil($t),se=$t)},reset:function(){N=!1,B=null,k=null,G=null,ct=null,dt=null,yt=null,Vt=null,se=null}}}const a=new e,r=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},f={},p=new WeakMap,d=[],g=null,_=!1,m=null,u=null,x=null,y=null,v=null,L=null,w=null,C=new Ot(0,0,0),P=0,b=!1,S=null,R=null,T=null,D=null,O=null;const H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,X=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(Y)[1]),I=X>=1):Y.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),I=X>=2);let q=null,et={};const mt=i.getParameter(i.SCISSOR_BOX),vt=i.getParameter(i.VIEWPORT),ft=new le().fromArray(mt),j=new le().fromArray(vt);function st(N,B,k,G){const ct=new Uint8Array(4),dt=i.createTexture();i.bindTexture(N,dt),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let yt=0;yt<k;yt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(B,0,i.RGBA,1,1,G,0,i.RGBA,i.UNSIGNED_BYTE,ct):i.texImage2D(B+yt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ct);return dt}const ht={};ht[i.TEXTURE_2D]=st(i.TEXTURE_2D,i.TEXTURE_2D,1),ht[i.TEXTURE_CUBE_MAP]=st(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ht[i.TEXTURE_2D_ARRAY]=st(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ht[i.TEXTURE_3D]=st(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),pt(i.DEPTH_TEST),r.setFunc(Ni),U(!1),nt(yc),pt(i.CULL_FACE),F(zn);function pt(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function gt(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function wt(N,B){return f[N]!==B?(i.bindFramebuffer(N,B),f[N]=B,N===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=B),N===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=B),!0):!1}function Rt(N,B){let k=d,G=!1;if(N){k=p.get(B),k===void 0&&(k=[],p.set(B,k));const ct=N.textures;if(k.length!==ct.length||k[0]!==i.COLOR_ATTACHMENT0){for(let dt=0,yt=ct.length;dt<yt;dt++)k[dt]=i.COLOR_ATTACHMENT0+dt;k.length=ct.length,G=!0}}else k[0]!==i.BACK&&(k[0]=i.BACK,G=!0);G&&i.drawBuffers(k)}function It(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const bt={[ti]:i.FUNC_ADD,[zu]:i.FUNC_SUBTRACT,[Ou]:i.FUNC_REVERSE_SUBTRACT};bt[Bu]=i.MIN,bt[Hu]=i.MAX;const Xt={[Gu]:i.ZERO,[Vu]:i.ONE,[Wu]:i.SRC_COLOR,[Or]:i.SRC_ALPHA,[ju]:i.SRC_ALPHA_SATURATE,[Zu]:i.DST_COLOR,[$u]:i.DST_ALPHA,[Xu]:i.ONE_MINUS_SRC_COLOR,[Br]:i.ONE_MINUS_SRC_ALPHA,[qu]:i.ONE_MINUS_DST_COLOR,[Yu]:i.ONE_MINUS_DST_ALPHA,[Ku]:i.CONSTANT_COLOR,[Ju]:i.ONE_MINUS_CONSTANT_COLOR,[Qu]:i.CONSTANT_ALPHA,[tf]:i.ONE_MINUS_CONSTANT_ALPHA};function F(N,B,k,G,ct,dt,yt,Vt,se,$t){if(N===zn){_===!0&&(gt(i.BLEND),_=!1);return}if(_===!1&&(pt(i.BLEND),_=!0),N!==Nu){if(N!==m||$t!==b){if((u!==ti||v!==ti)&&(i.blendEquation(i.FUNC_ADD),u=ti,v=ti),$t)switch(N){case Ui:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sc:i.blendFunc(i.ONE,i.ONE);break;case bc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ec:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Ui:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case bc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ec:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,y=null,L=null,w=null,C.set(0,0,0),P=0,m=N,b=$t}return}ct=ct||B,dt=dt||k,yt=yt||G,(B!==u||ct!==v)&&(i.blendEquationSeparate(bt[B],bt[ct]),u=B,v=ct),(k!==x||G!==y||dt!==L||yt!==w)&&(i.blendFuncSeparate(Xt[k],Xt[G],Xt[dt],Xt[yt]),x=k,y=G,L=dt,w=yt),(Vt.equals(C)===!1||se!==P)&&(i.blendColor(Vt.r,Vt.g,Vt.b,se),C.copy(Vt),P=se),m=N,b=!1}function ie(N,B){N.side===Te?gt(i.CULL_FACE):pt(i.CULL_FACE);let k=N.side===De;B&&(k=!k),U(k),N.blending===Ui&&N.transparent===!1?F(zn):F(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),r.setFunc(N.depthFunc),r.setTest(N.depthTest),r.setMask(N.depthWrite),a.setMask(N.colorWrite);const G=N.stencilWrite;o.setTest(G),G&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),it(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?pt(i.SAMPLE_ALPHA_TO_COVERAGE):gt(i.SAMPLE_ALPHA_TO_COVERAGE)}function U(N){S!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),S=N)}function nt(N){N!==ku?(pt(i.CULL_FACE),N!==R&&(N===yc?i.cullFace(i.BACK):N===Fu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):gt(i.CULL_FACE),R=N}function z(N){N!==T&&(I&&i.lineWidth(N),T=N)}function it(N,B,k){N?(pt(i.POLYGON_OFFSET_FILL),(D!==B||O!==k)&&(i.polygonOffset(B,k),D=B,O=k)):gt(i.POLYGON_OFFSET_FILL)}function rt(N){N?pt(i.SCISSOR_TEST):gt(i.SCISSOR_TEST)}function E(N){N===void 0&&(N=i.TEXTURE0+H-1),q!==N&&(i.activeTexture(N),q=N)}function M(N,B,k){k===void 0&&(q===null?k=i.TEXTURE0+H-1:k=q);let G=et[k];G===void 0&&(G={type:void 0,texture:void 0},et[k]=G),(G.type!==N||G.texture!==B)&&(q!==k&&(i.activeTexture(k),q=k),i.bindTexture(N,B||ht[N]),G.type=N,G.texture=B)}function V(){const N=et[q];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function K(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function at(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function tt(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ot(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ut(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _t(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Nt(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function lt(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Mt(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Lt(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ut(N){ft.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),ft.copy(N))}function Tt(N){j.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),j.copy(N))}function Gt(N,B){let k=l.get(B);k===void 0&&(k=new WeakMap,l.set(B,k));let G=k.get(N);G===void 0&&(G=i.getUniformBlockIndex(B,N.name),k.set(N,G))}function Ft(N,B){const G=l.get(B).get(N);c.get(B)!==G&&(i.uniformBlockBinding(B,G,N.__bindingPointIndex),c.set(B,G))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},q=null,et={},f={},p=new WeakMap,d=[],g=null,_=!1,m=null,u=null,x=null,y=null,v=null,L=null,w=null,C=new Ot(0,0,0),P=0,b=!1,S=null,R=null,T=null,D=null,O=null,ft.set(0,0,i.canvas.width,i.canvas.height),j.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:pt,disable:gt,bindFramebuffer:wt,drawBuffers:Rt,useProgram:It,setBlending:F,setMaterial:ie,setFlipSided:U,setCullFace:nt,setLineWidth:z,setPolygonOffset:it,setScissorTest:rt,activeTexture:E,bindTexture:M,unbindTexture:V,compressedTexImage2D:K,compressedTexImage3D:at,texImage2D:Mt,texImage3D:Lt,updateUBOMapping:Gt,uniformBlockBinding:Ft,texStorage2D:Nt,texStorage3D:lt,texSubImage2D:tt,texSubImage3D:ot,compressedTexSubImage2D:ut,compressedTexSubImage3D:_t,scissor:Ut,viewport:Tt,reset:Zt}}function _l(i,t,e,n){const s=b_(n);switch(e){case ql:return i*t;case Kl:return i*t;case Jl:return i*t*2;case Ql:return i*t/s.components*s.byteLength;case Vo:return i*t/s.components*s.byteLength;case td:return i*t*2/s.components*s.byteLength;case Wo:return i*t*2/s.components*s.byteLength;case jl:return i*t*3/s.components*s.byteLength;case qe:return i*t*4/s.components*s.byteLength;case Xo:return i*t*4/s.components*s.byteLength;case na:case ia:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case sa:case aa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Qr:case eo:return Math.max(i,16)*Math.max(t,8)/4;case Jr:case to:return Math.max(i,8)*Math.max(t,8)/2;case no:case io:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case so:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ao:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ro:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case oo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case co:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case lo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ho:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case uo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case fo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case po:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case mo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case go:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case _o:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case xo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case vo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ra:case Mo:case yo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ed:case So:return Math.ceil(i/4)*Math.ceil(t/4)*8;case bo:case Eo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function b_(i){switch(i){case Tn:case $l:return{byteLength:1,components:1};case ds:case Yl:case us:return{byteLength:2,components:1};case Ho:case Go:return{byteLength:2,components:4};case ai:case Bo:case bn:return{byteLength:4,components:1};case Zl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function E_(i,t,e,n,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Bt,h=new WeakMap;let f;const p=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,M){return d?new OffscreenCanvas(E,M):va("canvas")}function _(E,M,V){let K=1;const at=rt(E);if((at.width>V||at.height>V)&&(K=V/Math.max(at.width,at.height)),K<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const tt=Math.floor(K*at.width),ot=Math.floor(K*at.height);f===void 0&&(f=g(tt,ot));const ut=M?g(tt,ot):f;return ut.width=tt,ut.height=ot,ut.getContext("2d").drawImage(E,0,0,tt,ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+at.width+"x"+at.height+") to ("+tt+"x"+ot+")."),ut}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+at.width+"x"+at.height+")."),E;return E}function m(E){return E.generateMipmaps}function u(E){i.generateMipmap(E)}function x(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(E,M,V,K,at=!1){if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let tt=M;if(M===i.RED&&(V===i.FLOAT&&(tt=i.R32F),V===i.HALF_FLOAT&&(tt=i.R16F),V===i.UNSIGNED_BYTE&&(tt=i.R8)),M===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(tt=i.R8UI),V===i.UNSIGNED_SHORT&&(tt=i.R16UI),V===i.UNSIGNED_INT&&(tt=i.R32UI),V===i.BYTE&&(tt=i.R8I),V===i.SHORT&&(tt=i.R16I),V===i.INT&&(tt=i.R32I)),M===i.RG&&(V===i.FLOAT&&(tt=i.RG32F),V===i.HALF_FLOAT&&(tt=i.RG16F),V===i.UNSIGNED_BYTE&&(tt=i.RG8)),M===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(tt=i.RG8UI),V===i.UNSIGNED_SHORT&&(tt=i.RG16UI),V===i.UNSIGNED_INT&&(tt=i.RG32UI),V===i.BYTE&&(tt=i.RG8I),V===i.SHORT&&(tt=i.RG16I),V===i.INT&&(tt=i.RG32I)),M===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(tt=i.RGB8UI),V===i.UNSIGNED_SHORT&&(tt=i.RGB16UI),V===i.UNSIGNED_INT&&(tt=i.RGB32UI),V===i.BYTE&&(tt=i.RGB8I),V===i.SHORT&&(tt=i.RGB16I),V===i.INT&&(tt=i.RGB32I)),M===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(tt=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(tt=i.RGBA16UI),V===i.UNSIGNED_INT&&(tt=i.RGBA32UI),V===i.BYTE&&(tt=i.RGBA8I),V===i.SHORT&&(tt=i.RGBA16I),V===i.INT&&(tt=i.RGBA32I)),M===i.RGB&&V===i.UNSIGNED_INT_5_9_9_9_REV&&(tt=i.RGB9_E5),M===i.RGBA){const ot=at?Ta:qt.getTransfer(K);V===i.FLOAT&&(tt=i.RGBA32F),V===i.HALF_FLOAT&&(tt=i.RGBA16F),V===i.UNSIGNED_BYTE&&(tt=ot===ee?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(tt=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(tt=i.RGB5_A1)}return(tt===i.R16F||tt===i.R32F||tt===i.RG16F||tt===i.RG32F||tt===i.RGBA16F||tt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function v(E,M){let V;return E?M===null||M===ai||M===Bi?V=i.DEPTH24_STENCIL8:M===bn?V=i.DEPTH32F_STENCIL8:M===ds&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===ai||M===Bi?V=i.DEPTH_COMPONENT24:M===bn?V=i.DEPTH_COMPONENT32F:M===ds&&(V=i.DEPTH_COMPONENT16),V}function L(E,M){return m(E)===!0||E.isFramebufferTexture&&E.minFilter!==je&&E.minFilter!==on?Math.log2(Math.max(M.width,M.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?M.mipmaps.length:1}function w(E){const M=E.target;M.removeEventListener("dispose",w),P(M),M.isVideoTexture&&h.delete(M)}function C(E){const M=E.target;M.removeEventListener("dispose",C),S(M)}function P(E){const M=n.get(E);if(M.__webglInit===void 0)return;const V=E.source,K=p.get(V);if(K){const at=K[M.__cacheKey];at.usedTimes--,at.usedTimes===0&&b(E),Object.keys(K).length===0&&p.delete(V)}n.remove(E)}function b(E){const M=n.get(E);i.deleteTexture(M.__webglTexture);const V=E.source,K=p.get(V);delete K[M.__cacheKey],r.memory.textures--}function S(E){const M=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(M.__webglFramebuffer[K]))for(let at=0;at<M.__webglFramebuffer[K].length;at++)i.deleteFramebuffer(M.__webglFramebuffer[K][at]);else i.deleteFramebuffer(M.__webglFramebuffer[K]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[K])}else{if(Array.isArray(M.__webglFramebuffer))for(let K=0;K<M.__webglFramebuffer.length;K++)i.deleteFramebuffer(M.__webglFramebuffer[K]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let K=0;K<M.__webglColorRenderbuffer.length;K++)M.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[K]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const V=E.textures;for(let K=0,at=V.length;K<at;K++){const tt=n.get(V[K]);tt.__webglTexture&&(i.deleteTexture(tt.__webglTexture),r.memory.textures--),n.remove(V[K])}n.remove(E)}let R=0;function T(){R=0}function D(){const E=R;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),R+=1,E}function O(E){const M=[];return M.push(E.wrapS),M.push(E.wrapT),M.push(E.wrapR||0),M.push(E.magFilter),M.push(E.minFilter),M.push(E.anisotropy),M.push(E.internalFormat),M.push(E.format),M.push(E.type),M.push(E.generateMipmaps),M.push(E.premultiplyAlpha),M.push(E.flipY),M.push(E.unpackAlignment),M.push(E.colorSpace),M.join()}function H(E,M){const V=n.get(E);if(E.isVideoTexture&&z(E),E.isRenderTargetTexture===!1&&E.version>0&&V.__version!==E.version){const K=E.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(V,E,M);return}}e.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+M)}function I(E,M){const V=n.get(E);if(E.version>0&&V.__version!==E.version){j(V,E,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+M)}function X(E,M){const V=n.get(E);if(E.version>0&&V.__version!==E.version){j(V,E,M);return}e.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+M)}function Y(E,M){const V=n.get(E);if(E.version>0&&V.__version!==E.version){st(V,E,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+M)}const q={[jr]:i.REPEAT,[ni]:i.CLAMP_TO_EDGE,[Kr]:i.MIRRORED_REPEAT},et={[je]:i.NEAREST,[hf]:i.NEAREST_MIPMAP_NEAREST,[As]:i.NEAREST_MIPMAP_LINEAR,[on]:i.LINEAR,[Xa]:i.LINEAR_MIPMAP_NEAREST,[ii]:i.LINEAR_MIPMAP_LINEAR},mt={[mf]:i.NEVER,[yf]:i.ALWAYS,[gf]:i.LESS,[id]:i.LEQUAL,[_f]:i.EQUAL,[Mf]:i.GEQUAL,[xf]:i.GREATER,[vf]:i.NOTEQUAL};function vt(E,M){if(M.type===bn&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===on||M.magFilter===Xa||M.magFilter===As||M.magFilter===ii||M.minFilter===on||M.minFilter===Xa||M.minFilter===As||M.minFilter===ii)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,q[M.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,q[M.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,q[M.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,et[M.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,et[M.minFilter]),M.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,mt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===je||M.minFilter!==As&&M.minFilter!==ii||M.type===bn&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const V=t.get("EXT_texture_filter_anisotropic");i.texParameterf(E,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function ft(E,M){let V=!1;E.__webglInit===void 0&&(E.__webglInit=!0,M.addEventListener("dispose",w));const K=M.source;let at=p.get(K);at===void 0&&(at={},p.set(K,at));const tt=O(M);if(tt!==E.__cacheKey){at[tt]===void 0&&(at[tt]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,V=!0),at[tt].usedTimes++;const ot=at[E.__cacheKey];ot!==void 0&&(at[E.__cacheKey].usedTimes--,ot.usedTimes===0&&b(M)),E.__cacheKey=tt,E.__webglTexture=at[tt].texture}return V}function j(E,M,V){let K=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(K=i.TEXTURE_3D);const at=ft(E,M),tt=M.source;e.bindTexture(K,E.__webglTexture,i.TEXTURE0+V);const ot=n.get(tt);if(tt.version!==ot.__version||at===!0){e.activeTexture(i.TEXTURE0+V);const ut=qt.getPrimaries(qt.workingColorSpace),_t=M.colorSpace===Fn?null:qt.getPrimaries(M.colorSpace),Nt=M.colorSpace===Fn||ut===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let lt=_(M.image,!1,s.maxTextureSize);lt=it(M,lt);const Mt=a.convert(M.format,M.colorSpace),Lt=a.convert(M.type);let Ut=y(M.internalFormat,Mt,Lt,M.colorSpace,M.isVideoTexture);vt(K,M);let Tt;const Gt=M.mipmaps,Ft=M.isVideoTexture!==!0,Zt=ot.__version===void 0||at===!0,N=tt.dataReady,B=L(M,lt);if(M.isDepthTexture)Ut=v(M.format===Hi,M.type),Zt&&(Ft?e.texStorage2D(i.TEXTURE_2D,1,Ut,lt.width,lt.height):e.texImage2D(i.TEXTURE_2D,0,Ut,lt.width,lt.height,0,Mt,Lt,null));else if(M.isDataTexture)if(Gt.length>0){Ft&&Zt&&e.texStorage2D(i.TEXTURE_2D,B,Ut,Gt[0].width,Gt[0].height);for(let k=0,G=Gt.length;k<G;k++)Tt=Gt[k],Ft?N&&e.texSubImage2D(i.TEXTURE_2D,k,0,0,Tt.width,Tt.height,Mt,Lt,Tt.data):e.texImage2D(i.TEXTURE_2D,k,Ut,Tt.width,Tt.height,0,Mt,Lt,Tt.data);M.generateMipmaps=!1}else Ft?(Zt&&e.texStorage2D(i.TEXTURE_2D,B,Ut,lt.width,lt.height),N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,lt.width,lt.height,Mt,Lt,lt.data)):e.texImage2D(i.TEXTURE_2D,0,Ut,lt.width,lt.height,0,Mt,Lt,lt.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ft&&Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,B,Ut,Gt[0].width,Gt[0].height,lt.depth);for(let k=0,G=Gt.length;k<G;k++)if(Tt=Gt[k],M.format!==qe)if(Mt!==null)if(Ft){if(N)if(M.layerUpdates.size>0){const ct=_l(Tt.width,Tt.height,M.format,M.type);for(const dt of M.layerUpdates){const yt=Tt.data.subarray(dt*ct/Tt.data.BYTES_PER_ELEMENT,(dt+1)*ct/Tt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,k,0,0,dt,Tt.width,Tt.height,1,Mt,yt)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,k,0,0,0,Tt.width,Tt.height,lt.depth,Mt,Tt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,k,Ut,Tt.width,Tt.height,lt.depth,0,Tt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,k,0,0,0,Tt.width,Tt.height,lt.depth,Mt,Lt,Tt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,k,Ut,Tt.width,Tt.height,lt.depth,0,Mt,Lt,Tt.data)}else{Ft&&Zt&&e.texStorage2D(i.TEXTURE_2D,B,Ut,Gt[0].width,Gt[0].height);for(let k=0,G=Gt.length;k<G;k++)Tt=Gt[k],M.format!==qe?Mt!==null?Ft?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,k,0,0,Tt.width,Tt.height,Mt,Tt.data):e.compressedTexImage2D(i.TEXTURE_2D,k,Ut,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?N&&e.texSubImage2D(i.TEXTURE_2D,k,0,0,Tt.width,Tt.height,Mt,Lt,Tt.data):e.texImage2D(i.TEXTURE_2D,k,Ut,Tt.width,Tt.height,0,Mt,Lt,Tt.data)}else if(M.isDataArrayTexture)if(Ft){if(Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,B,Ut,lt.width,lt.height,lt.depth),N)if(M.layerUpdates.size>0){const k=_l(lt.width,lt.height,M.format,M.type);for(const G of M.layerUpdates){const ct=lt.data.subarray(G*k/lt.data.BYTES_PER_ELEMENT,(G+1)*k/lt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,G,lt.width,lt.height,1,Mt,Lt,ct)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,lt.width,lt.height,lt.depth,Mt,Lt,lt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ut,lt.width,lt.height,lt.depth,0,Mt,Lt,lt.data);else if(M.isData3DTexture)Ft?(Zt&&e.texStorage3D(i.TEXTURE_3D,B,Ut,lt.width,lt.height,lt.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,lt.width,lt.height,lt.depth,Mt,Lt,lt.data)):e.texImage3D(i.TEXTURE_3D,0,Ut,lt.width,lt.height,lt.depth,0,Mt,Lt,lt.data);else if(M.isFramebufferTexture){if(Zt)if(Ft)e.texStorage2D(i.TEXTURE_2D,B,Ut,lt.width,lt.height);else{let k=lt.width,G=lt.height;for(let ct=0;ct<B;ct++)e.texImage2D(i.TEXTURE_2D,ct,Ut,k,G,0,Mt,Lt,null),k>>=1,G>>=1}}else if(Gt.length>0){if(Ft&&Zt){const k=rt(Gt[0]);e.texStorage2D(i.TEXTURE_2D,B,Ut,k.width,k.height)}for(let k=0,G=Gt.length;k<G;k++)Tt=Gt[k],Ft?N&&e.texSubImage2D(i.TEXTURE_2D,k,0,0,Mt,Lt,Tt):e.texImage2D(i.TEXTURE_2D,k,Ut,Mt,Lt,Tt);M.generateMipmaps=!1}else if(Ft){if(Zt){const k=rt(lt);e.texStorage2D(i.TEXTURE_2D,B,Ut,k.width,k.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Mt,Lt,lt)}else e.texImage2D(i.TEXTURE_2D,0,Ut,Mt,Lt,lt);m(M)&&u(K),ot.__version=tt.version,M.onUpdate&&M.onUpdate(M)}E.__version=M.version}function st(E,M,V){if(M.image.length!==6)return;const K=ft(E,M),at=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+V);const tt=n.get(at);if(at.version!==tt.__version||K===!0){e.activeTexture(i.TEXTURE0+V);const ot=qt.getPrimaries(qt.workingColorSpace),ut=M.colorSpace===Fn?null:qt.getPrimaries(M.colorSpace),_t=M.colorSpace===Fn||ot===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const Nt=M.isCompressedTexture||M.image[0].isCompressedTexture,lt=M.image[0]&&M.image[0].isDataTexture,Mt=[];for(let G=0;G<6;G++)!Nt&&!lt?Mt[G]=_(M.image[G],!0,s.maxCubemapSize):Mt[G]=lt?M.image[G].image:M.image[G],Mt[G]=it(M,Mt[G]);const Lt=Mt[0],Ut=a.convert(M.format,M.colorSpace),Tt=a.convert(M.type),Gt=y(M.internalFormat,Ut,Tt,M.colorSpace),Ft=M.isVideoTexture!==!0,Zt=tt.__version===void 0||K===!0,N=at.dataReady;let B=L(M,Lt);vt(i.TEXTURE_CUBE_MAP,M);let k;if(Nt){Ft&&Zt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,B,Gt,Lt.width,Lt.height);for(let G=0;G<6;G++){k=Mt[G].mipmaps;for(let ct=0;ct<k.length;ct++){const dt=k[ct];M.format!==qe?Ut!==null?Ft?N&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ct,0,0,dt.width,dt.height,Ut,dt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ct,Gt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ct,0,0,dt.width,dt.height,Ut,Tt,dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ct,Gt,dt.width,dt.height,0,Ut,Tt,dt.data)}}}else{if(k=M.mipmaps,Ft&&Zt){k.length>0&&B++;const G=rt(Mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,B,Gt,G.width,G.height)}for(let G=0;G<6;G++)if(lt){Ft?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,0,0,Mt[G].width,Mt[G].height,Ut,Tt,Mt[G].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,Gt,Mt[G].width,Mt[G].height,0,Ut,Tt,Mt[G].data);for(let ct=0;ct<k.length;ct++){const yt=k[ct].image[G].image;Ft?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ct+1,0,0,yt.width,yt.height,Ut,Tt,yt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ct+1,Gt,yt.width,yt.height,0,Ut,Tt,yt.data)}}else{Ft?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,0,0,Ut,Tt,Mt[G]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,Gt,Ut,Tt,Mt[G]);for(let ct=0;ct<k.length;ct++){const dt=k[ct];Ft?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ct+1,0,0,Ut,Tt,dt.image[G]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,ct+1,Gt,Ut,Tt,dt.image[G])}}}m(M)&&u(i.TEXTURE_CUBE_MAP),tt.__version=at.version,M.onUpdate&&M.onUpdate(M)}E.__version=M.version}function ht(E,M,V,K,at,tt){const ot=a.convert(V.format,V.colorSpace),ut=a.convert(V.type),_t=y(V.internalFormat,ot,ut,V.colorSpace),Nt=n.get(M),lt=n.get(V);if(lt.__renderTarget=M,!Nt.__hasExternalTextures){const Mt=Math.max(1,M.width>>tt),Lt=Math.max(1,M.height>>tt);at===i.TEXTURE_3D||at===i.TEXTURE_2D_ARRAY?e.texImage3D(at,tt,_t,Mt,Lt,M.depth,0,ot,ut,null):e.texImage2D(at,tt,_t,Mt,Lt,0,ot,ut,null)}e.bindFramebuffer(i.FRAMEBUFFER,E),nt(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,at,lt.__webglTexture,0,U(M)):(at===i.TEXTURE_2D||at>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&at<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,at,lt.__webglTexture,tt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function pt(E,M,V){if(i.bindRenderbuffer(i.RENDERBUFFER,E),M.depthBuffer){const K=M.depthTexture,at=K&&K.isDepthTexture?K.type:null,tt=v(M.stencilBuffer,at),ot=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ut=U(M);nt(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ut,tt,M.width,M.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,ut,tt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,tt,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ot,i.RENDERBUFFER,E)}else{const K=M.textures;for(let at=0;at<K.length;at++){const tt=K[at],ot=a.convert(tt.format,tt.colorSpace),ut=a.convert(tt.type),_t=y(tt.internalFormat,ot,ut,tt.colorSpace),Nt=U(M);V&&nt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,_t,M.width,M.height):nt(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Nt,_t,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,_t,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function gt(E,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,E),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(M.depthTexture);K.__renderTarget=M,(!K.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),H(M.depthTexture,0);const at=K.__webglTexture,tt=U(M);if(M.depthTexture.format===ki)nt(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0);else if(M.depthTexture.format===Hi)nt(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function wt(E){const M=n.get(E),V=E.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==E.depthTexture){const K=E.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),K){const at=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,K.removeEventListener("dispose",at)};K.addEventListener("dispose",at),M.__depthDisposeCallback=at}M.__boundDepthTexture=K}if(E.depthTexture&&!M.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");gt(M.__webglFramebuffer,E)}else if(V){M.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[K]),M.__webglDepthbuffer[K]===void 0)M.__webglDepthbuffer[K]=i.createRenderbuffer(),pt(M.__webglDepthbuffer[K],E,!1);else{const at=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=M.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,tt)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),pt(M.__webglDepthbuffer,E,!1);else{const K=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,at),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,at)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Rt(E,M,V){const K=n.get(E);M!==void 0&&ht(K.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&wt(E)}function It(E){const M=E.texture,V=n.get(E),K=n.get(M);E.addEventListener("dispose",C);const at=E.textures,tt=E.isWebGLCubeRenderTarget===!0,ot=at.length>1;if(ot||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=M.version,r.memory.textures++),tt){V.__webglFramebuffer=[];for(let ut=0;ut<6;ut++)if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer[ut]=[];for(let _t=0;_t<M.mipmaps.length;_t++)V.__webglFramebuffer[ut][_t]=i.createFramebuffer()}else V.__webglFramebuffer[ut]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer=[];for(let ut=0;ut<M.mipmaps.length;ut++)V.__webglFramebuffer[ut]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(ot)for(let ut=0,_t=at.length;ut<_t;ut++){const Nt=n.get(at[ut]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=i.createTexture(),r.memory.textures++)}if(E.samples>0&&nt(E)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ut=0;ut<at.length;ut++){const _t=at[ut];V.__webglColorRenderbuffer[ut]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ut]);const Nt=a.convert(_t.format,_t.colorSpace),lt=a.convert(_t.type),Mt=y(_t.internalFormat,Nt,lt,_t.colorSpace,E.isXRRenderTarget===!0),Lt=U(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Lt,Mt,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,V.__webglColorRenderbuffer[ut])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),pt(V.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),vt(i.TEXTURE_CUBE_MAP,M);for(let ut=0;ut<6;ut++)if(M.mipmaps&&M.mipmaps.length>0)for(let _t=0;_t<M.mipmaps.length;_t++)ht(V.__webglFramebuffer[ut][_t],E,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,_t);else ht(V.__webglFramebuffer[ut],E,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0);m(M)&&u(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ot){for(let ut=0,_t=at.length;ut<_t;ut++){const Nt=at[ut],lt=n.get(Nt);e.bindTexture(i.TEXTURE_2D,lt.__webglTexture),vt(i.TEXTURE_2D,Nt),ht(V.__webglFramebuffer,E,Nt,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,0),m(Nt)&&u(i.TEXTURE_2D)}e.unbindTexture()}else{let ut=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ut=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ut,K.__webglTexture),vt(ut,M),M.mipmaps&&M.mipmaps.length>0)for(let _t=0;_t<M.mipmaps.length;_t++)ht(V.__webglFramebuffer[_t],E,M,i.COLOR_ATTACHMENT0,ut,_t);else ht(V.__webglFramebuffer,E,M,i.COLOR_ATTACHMENT0,ut,0);m(M)&&u(ut),e.unbindTexture()}E.depthBuffer&&wt(E)}function bt(E){const M=E.textures;for(let V=0,K=M.length;V<K;V++){const at=M[V];if(m(at)){const tt=x(E),ot=n.get(at).__webglTexture;e.bindTexture(tt,ot),u(tt),e.unbindTexture()}}}const Xt=[],F=[];function ie(E){if(E.samples>0){if(nt(E)===!1){const M=E.textures,V=E.width,K=E.height;let at=i.COLOR_BUFFER_BIT;const tt=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=n.get(E),ut=M.length>1;if(ut)for(let _t=0;_t<M.length;_t++)e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let _t=0;_t<M.length;_t++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(at|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(at|=i.STENCIL_BUFFER_BIT)),ut){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ot.__webglColorRenderbuffer[_t]);const Nt=n.get(M[_t]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Nt,0)}i.blitFramebuffer(0,0,V,K,0,0,V,K,at,i.NEAREST),c===!0&&(Xt.length=0,F.length=0,Xt.push(i.COLOR_ATTACHMENT0+_t),E.depthBuffer&&E.resolveDepthBuffer===!1&&(Xt.push(tt),F.push(tt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,F)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Xt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ut)for(let _t=0;_t<M.length;_t++){e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,ot.__webglColorRenderbuffer[_t]);const Nt=n.get(M[_t]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ot.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,Nt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&c){const M=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function U(E){return Math.min(s.maxSamples,E.samples)}function nt(E){const M=n.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function z(E){const M=r.render.frame;h.get(E)!==M&&(h.set(E,M),E.update())}function it(E,M){const V=E.colorSpace,K=E.format,at=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||V!==Vi&&V!==Fn&&(qt.getTransfer(V)===ee?(K!==qe||at!==Tn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),M}function rt(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(l.width=E.naturalWidth||E.width,l.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(l.width=E.displayWidth,l.height=E.displayHeight):(l.width=E.width,l.height=E.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=T,this.setTexture2D=H,this.setTexture2DArray=I,this.setTexture3D=X,this.setTextureCube=Y,this.rebindTextures=Rt,this.setupRenderTarget=It,this.updateRenderTargetMipmap=bt,this.updateMultisampleRenderTarget=ie,this.setupDepthRenderbuffer=wt,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=nt}function A_(i,t){function e(n,s=Fn){let a;const r=qt.getTransfer(s);if(n===Tn)return i.UNSIGNED_BYTE;if(n===Ho)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Go)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Zl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===$l)return i.BYTE;if(n===Yl)return i.SHORT;if(n===ds)return i.UNSIGNED_SHORT;if(n===Bo)return i.INT;if(n===ai)return i.UNSIGNED_INT;if(n===bn)return i.FLOAT;if(n===us)return i.HALF_FLOAT;if(n===ql)return i.ALPHA;if(n===jl)return i.RGB;if(n===qe)return i.RGBA;if(n===Kl)return i.LUMINANCE;if(n===Jl)return i.LUMINANCE_ALPHA;if(n===ki)return i.DEPTH_COMPONENT;if(n===Hi)return i.DEPTH_STENCIL;if(n===Ql)return i.RED;if(n===Vo)return i.RED_INTEGER;if(n===td)return i.RG;if(n===Wo)return i.RG_INTEGER;if(n===Xo)return i.RGBA_INTEGER;if(n===na||n===ia||n===sa||n===aa)if(r===ee)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===na)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ia)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===sa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===aa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===na)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ia)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===sa)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===aa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Jr||n===Qr||n===to||n===eo)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===Jr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===to)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===eo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===no||n===io||n===so)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===no||n===io)return r===ee?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===so)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ao||n===ro||n===oo||n===co||n===lo||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===_o||n===xo||n===vo)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===ao)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ro)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===oo)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===co)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===lo)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ho)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===uo)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===fo)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===po)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===mo)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===go)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===_o)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===xo)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===vo)return r===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ra||n===Mo||n===yo)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===ra)return r===ee?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Mo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===yo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ed||n===So||n===bo||n===Eo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===ra)return a.COMPRESSED_RED_RGTC1_EXT;if(n===So)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===bo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Eo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Bi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class T_ extends He{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Me extends de{constructor(){super(),this.isGroup=!0,this.type="Group"}}const w_={type:"move"};class vr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),u=this._getHandJoint(l,_);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],p=h.position.distanceTo(f.position),d=.02,g=.005;l.inputState.pinching&&p>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&p<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(w_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Me;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const R_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C_=`
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

}`;class P_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Re,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Gn({vertexShader:R_,fragmentShader:C_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new re(new Ra(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class D_ extends Wi{constructor(t,e){super();const n=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,f=null,p=null,d=null,g=null;const _=new P_,m=e.getContextAttributes();let u=null,x=null;const y=[],v=[],L=new Bt;let w=null;const C=new He;C.viewport=new le;const P=new He;P.viewport=new le;const b=[C,P],S=new T_;let R=null,T=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let st=y[j];return st===void 0&&(st=new vr,y[j]=st),st.getTargetRaySpace()},this.getControllerGrip=function(j){let st=y[j];return st===void 0&&(st=new vr,y[j]=st),st.getGripSpace()},this.getHand=function(j){let st=y[j];return st===void 0&&(st=new vr,y[j]=st),st.getHandSpace()};function D(j){const st=v.indexOf(j.inputSource);if(st===-1)return;const ht=y[st];ht!==void 0&&(ht.update(j.inputSource,j.frame,l||r),ht.dispatchEvent({type:j.type,data:j.inputSource}))}function O(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",H);for(let j=0;j<y.length;j++){const st=v[j];st!==null&&(v[j]=null,y[j].disconnect(st))}R=null,T=null,_.reset(),t.setRenderTarget(u),d=null,p=null,f=null,s=null,x=null,ft.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(u=t.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",O),s.addEventListener("inputsourceschange",H),m.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const st={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,e,st),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new ri(d.framebufferWidth,d.framebufferHeight,{format:qe,type:Tn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let st=null,ht=null,pt=null;m.depth&&(pt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,st=m.stencil?Hi:ki,ht=m.stencil?Bi:ai);const gt={colorFormat:e.RGBA8,depthFormat:pt,scaleFactor:a};f=new XRWebGLBinding(s,e),p=f.createProjectionLayer(gt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),x=new ri(p.textureWidth,p.textureHeight,{format:qe,type:Tn,depthTexture:new md(p.textureWidth,p.textureHeight,ht,void 0,void 0,void 0,void 0,void 0,void 0,st),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),ft.setContext(s),ft.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function H(j){for(let st=0;st<j.removed.length;st++){const ht=j.removed[st],pt=v.indexOf(ht);pt>=0&&(v[pt]=null,y[pt].disconnect(ht))}for(let st=0;st<j.added.length;st++){const ht=j.added[st];let pt=v.indexOf(ht);if(pt===-1){for(let wt=0;wt<y.length;wt++)if(wt>=v.length){v.push(ht),pt=wt;break}else if(v[wt]===null){v[wt]=ht,pt=wt;break}if(pt===-1)break}const gt=y[pt];gt&&gt.connect(ht)}}const I=new Z,X=new Z;function Y(j,st,ht){I.setFromMatrixPosition(st.matrixWorld),X.setFromMatrixPosition(ht.matrixWorld);const pt=I.distanceTo(X),gt=st.projectionMatrix.elements,wt=ht.projectionMatrix.elements,Rt=gt[14]/(gt[10]-1),It=gt[14]/(gt[10]+1),bt=(gt[9]+1)/gt[5],Xt=(gt[9]-1)/gt[5],F=(gt[8]-1)/gt[0],ie=(wt[8]+1)/wt[0],U=Rt*F,nt=Rt*ie,z=pt/(-F+ie),it=z*-F;if(st.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(it),j.translateZ(z),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),gt[10]===-1)j.projectionMatrix.copy(st.projectionMatrix),j.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{const rt=Rt+z,E=It+z,M=U-it,V=nt+(pt-it),K=bt*It/E*rt,at=Xt*It/E*rt;j.projectionMatrix.makePerspective(M,V,K,at,rt,E),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function q(j,st){st===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(st.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let st=j.near,ht=j.far;_.texture!==null&&(_.depthNear>0&&(st=_.depthNear),_.depthFar>0&&(ht=_.depthFar)),S.near=P.near=C.near=st,S.far=P.far=C.far=ht,(R!==S.near||T!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),R=S.near,T=S.far),C.layers.mask=j.layers.mask|2,P.layers.mask=j.layers.mask|4,S.layers.mask=C.layers.mask|P.layers.mask;const pt=j.parent,gt=S.cameras;q(S,pt);for(let wt=0;wt<gt.length;wt++)q(gt[wt],pt);gt.length===2?Y(S,C,P):S.projectionMatrix.copy(C.projectionMatrix),et(j,S,pt)};function et(j,st,ht){ht===null?j.matrix.copy(st.matrixWorld):(j.matrix.copy(ht.matrixWorld),j.matrix.invert(),j.matrix.multiply(st.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(st.projectionMatrix),j.projectionMatrixInverse.copy(st.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=To*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(p===null&&d===null))return c},this.setFoveation=function(j){c=j,p!==null&&(p.fixedFoveation=j),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=j)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(S)};let mt=null;function vt(j,st){if(h=st.getViewerPose(l||r),g=st,h!==null){const ht=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let pt=!1;ht.length!==S.cameras.length&&(S.cameras.length=0,pt=!0);for(let wt=0;wt<ht.length;wt++){const Rt=ht[wt];let It=null;if(d!==null)It=d.getViewport(Rt);else{const Xt=f.getViewSubImage(p,Rt);It=Xt.viewport,wt===0&&(t.setRenderTargetTextures(x,Xt.colorTexture,p.ignoreDepthValues?void 0:Xt.depthStencilTexture),t.setRenderTarget(x))}let bt=b[wt];bt===void 0&&(bt=new He,bt.layers.enable(wt),bt.viewport=new le,b[wt]=bt),bt.matrix.fromArray(Rt.transform.matrix),bt.matrix.decompose(bt.position,bt.quaternion,bt.scale),bt.projectionMatrix.fromArray(Rt.projectionMatrix),bt.projectionMatrixInverse.copy(bt.projectionMatrix).invert(),bt.viewport.set(It.x,It.y,It.width,It.height),wt===0&&(S.matrix.copy(bt.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),pt===!0&&S.cameras.push(bt)}const gt=s.enabledFeatures;if(gt&&gt.includes("depth-sensing")){const wt=f.getDepthInformation(ht[0]);wt&&wt.isValid&&wt.texture&&_.init(t,wt,s.renderState)}}for(let ht=0;ht<y.length;ht++){const pt=v[ht],gt=y[ht];pt!==null&&gt!==void 0&&gt.update(pt,st,l||r)}mt&&mt(j,st),st.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:st}),g=null}const ft=new fd;ft.setAnimationLoop(vt),this.setAnimationLoop=function(j){mt=j},this.dispose=function(){}}}const jn=new dn,L_=new oe;function I_(i,t){function e(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function n(m,u){u.color.getRGB(m.fogColor.value,dd(i)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function s(m,u,x,y,v){u.isMeshBasicMaterial||u.isMeshLambertMaterial?a(m,u):u.isMeshToonMaterial?(a(m,u),f(m,u)):u.isMeshPhongMaterial?(a(m,u),h(m,u)):u.isMeshStandardMaterial?(a(m,u),p(m,u),u.isMeshPhysicalMaterial&&d(m,u,v)):u.isMeshMatcapMaterial?(a(m,u),g(m,u)):u.isMeshDepthMaterial?a(m,u):u.isMeshDistanceMaterial?(a(m,u),_(m,u)):u.isMeshNormalMaterial?a(m,u):u.isLineBasicMaterial?(r(m,u),u.isLineDashedMaterial&&o(m,u)):u.isPointsMaterial?c(m,u,x,y):u.isSpriteMaterial?l(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function a(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,e(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,e(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,e(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===De&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,e(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===De&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,e(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,e(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const x=t.get(u),y=x.envMap,v=x.envMapRotation;y&&(m.envMap.value=y,jn.copy(v),jn.x*=-1,jn.y*=-1,jn.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),m.envMapRotation.value.setFromMatrix4(L_.makeRotationFromEuler(jn)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,e(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,m.aoMapTransform))}function r(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,e(u.map,m.mapTransform))}function o(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function c(m,u,x,y){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*x,m.scale.value=y*.5,u.map&&(m.map.value=u.map,e(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,e(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function l(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,e(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,e(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function h(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function f(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function p(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function d(m,u,x){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===De&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,u){u.matcap&&(m.matcap.value=u.matcap)}function _(m,u){const x=t.get(u).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function U_(i,t,e,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,y){const v=y.program;n.uniformBlockBinding(x,v)}function l(x,y){let v=s[x.id];v===void 0&&(g(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",m));const L=y.program;n.updateUBOMapping(x,L);const w=t.render.frame;a[x.id]!==w&&(p(x),a[x.id]=w)}function h(x){const y=f();x.__bindingPointIndex=y;const v=i.createBuffer(),L=x.__size,w=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,L,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,v),v}function f(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const y=s[x.id],v=x.uniforms,L=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let w=0,C=v.length;w<C;w++){const P=Array.isArray(v[w])?v[w]:[v[w]];for(let b=0,S=P.length;b<S;b++){const R=P[b];if(d(R,w,b,L)===!0){const T=R.__offset,D=Array.isArray(R.value)?R.value:[R.value];let O=0;for(let H=0;H<D.length;H++){const I=D[H],X=_(I);typeof I=="number"||typeof I=="boolean"?(R.__data[0]=I,i.bufferSubData(i.UNIFORM_BUFFER,T+O,R.__data)):I.isMatrix3?(R.__data[0]=I.elements[0],R.__data[1]=I.elements[1],R.__data[2]=I.elements[2],R.__data[3]=0,R.__data[4]=I.elements[3],R.__data[5]=I.elements[4],R.__data[6]=I.elements[5],R.__data[7]=0,R.__data[8]=I.elements[6],R.__data[9]=I.elements[7],R.__data[10]=I.elements[8],R.__data[11]=0):(I.toArray(R.__data,O),O+=X.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,T,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(x,y,v,L){const w=x.value,C=y+"_"+v;if(L[C]===void 0)return typeof w=="number"||typeof w=="boolean"?L[C]=w:L[C]=w.clone(),!0;{const P=L[C];if(typeof w=="number"||typeof w=="boolean"){if(P!==w)return L[C]=w,!0}else if(P.equals(w)===!1)return P.copy(w),!0}return!1}function g(x){const y=x.uniforms;let v=0;const L=16;for(let C=0,P=y.length;C<P;C++){const b=Array.isArray(y[C])?y[C]:[y[C]];for(let S=0,R=b.length;S<R;S++){const T=b[S],D=Array.isArray(T.value)?T.value:[T.value];for(let O=0,H=D.length;O<H;O++){const I=D[O],X=_(I),Y=v%L,q=Y%X.boundary,et=Y+q;v+=q,et!==0&&L-et<X.storage&&(v+=L-et),T.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),T.__offset=v,v+=X.storage}}}const w=v%L;return w>0&&(v+=L-w),x.__size=v,x.__cache={},this}function _(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function m(x){const y=x.target;y.removeEventListener("dispose",m);const v=r.indexOf(y.__bindingPointIndex);r.splice(v,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete a[y.id]}function u(){for(const x in s)i.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:u}}class k_{constructor(t={}){const{canvas:e=bf(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,u=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Be,this.toneMapping=On,this.toneMappingExposure=1;const v=this;let L=!1,w=0,C=0,P=null,b=-1,S=null;const R=new le,T=new le;let D=null;const O=new Ot(0);let H=0,I=e.width,X=e.height,Y=1,q=null,et=null;const mt=new le(0,0,I,X),vt=new le(0,0,I,X);let ft=!1;const j=new Zo;let st=!1,ht=!1;const pt=new oe,gt=new oe,wt=new Z,Rt=new le,It={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let bt=!1;function Xt(){return P===null?Y:1}let F=n;function ie(A,W){return e.getContext(A,W)}try{const A={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${zo}`),e.addEventListener("webglcontextlost",G,!1),e.addEventListener("webglcontextrestored",ct,!1),e.addEventListener("webglcontextcreationerror",dt,!1),F===null){const W="webgl2";if(F=ie(W,A),F===null)throw ie(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let U,nt,z,it,rt,E,M,V,K,at,tt,ot,ut,_t,Nt,lt,Mt,Lt,Ut,Tt,Gt,Ft,Zt,N;function B(){U=new Bg(F),U.init(),Ft=new A_(F,U),nt=new Ug(F,U,t,Ft),z=new S_(F,U),nt.reverseDepthBuffer&&p&&z.buffers.depth.setReversed(!0),it=new Vg(F),rt=new o_,E=new E_(F,U,z,rt,nt,Ft,it),M=new Fg(v),V=new Og(v),K=new jf(F),Zt=new Lg(F,K),at=new Hg(F,K,it,Zt),tt=new Xg(F,at,K,it),Ut=new Wg(F,nt,E),lt=new kg(rt),ot=new r_(v,M,V,U,nt,Zt,lt),ut=new I_(v,rt),_t=new l_,Nt=new m_(U),Lt=new Dg(v,M,V,z,tt,d,c),Mt=new M_(v,tt,nt),N=new U_(F,it,nt,z),Tt=new Ig(F,U,it),Gt=new Gg(F,U,it),it.programs=ot.programs,v.capabilities=nt,v.extensions=U,v.properties=rt,v.renderLists=_t,v.shadowMap=Mt,v.state=z,v.info=it}B();const k=new D_(v,F);this.xr=k,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const A=U.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=U.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(A){A!==void 0&&(Y=A,this.setSize(I,X,!1))},this.getSize=function(A){return A.set(I,X)},this.setSize=function(A,W,J=!0){if(k.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=A,X=W,e.width=Math.floor(A*Y),e.height=Math.floor(W*Y),J===!0&&(e.style.width=A+"px",e.style.height=W+"px"),this.setViewport(0,0,A,W)},this.getDrawingBufferSize=function(A){return A.set(I*Y,X*Y).floor()},this.setDrawingBufferSize=function(A,W,J){I=A,X=W,Y=J,e.width=Math.floor(A*J),e.height=Math.floor(W*J),this.setViewport(0,0,A,W)},this.getCurrentViewport=function(A){return A.copy(R)},this.getViewport=function(A){return A.copy(mt)},this.setViewport=function(A,W,J,Q){A.isVector4?mt.set(A.x,A.y,A.z,A.w):mt.set(A,W,J,Q),z.viewport(R.copy(mt).multiplyScalar(Y).round())},this.getScissor=function(A){return A.copy(vt)},this.setScissor=function(A,W,J,Q){A.isVector4?vt.set(A.x,A.y,A.z,A.w):vt.set(A,W,J,Q),z.scissor(T.copy(vt).multiplyScalar(Y).round())},this.getScissorTest=function(){return ft},this.setScissorTest=function(A){z.setScissorTest(ft=A)},this.setOpaqueSort=function(A){q=A},this.setTransparentSort=function(A){et=A},this.getClearColor=function(A){return A.copy(Lt.getClearColor())},this.setClearColor=function(){Lt.setClearColor.apply(Lt,arguments)},this.getClearAlpha=function(){return Lt.getClearAlpha()},this.setClearAlpha=function(){Lt.setClearAlpha.apply(Lt,arguments)},this.clear=function(A=!0,W=!0,J=!0){let Q=0;if(A){let $=!1;if(P!==null){const xt=P.texture.format;$=xt===Xo||xt===Wo||xt===Vo}if($){const xt=P.texture.type,Et=xt===Tn||xt===ai||xt===ds||xt===Bi||xt===Ho||xt===Go,Ct=Lt.getClearColor(),Pt=Lt.getClearAlpha(),kt=Ct.r,zt=Ct.g,Dt=Ct.b;Et?(g[0]=kt,g[1]=zt,g[2]=Dt,g[3]=Pt,F.clearBufferuiv(F.COLOR,0,g)):(_[0]=kt,_[1]=zt,_[2]=Dt,_[3]=Pt,F.clearBufferiv(F.COLOR,0,_))}else Q|=F.COLOR_BUFFER_BIT}W&&(Q|=F.DEPTH_BUFFER_BIT),J&&(Q|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",G,!1),e.removeEventListener("webglcontextrestored",ct,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),_t.dispose(),Nt.dispose(),rt.dispose(),M.dispose(),V.dispose(),tt.dispose(),Zt.dispose(),N.dispose(),ot.dispose(),k.dispose(),k.removeEventListener("sessionstart",wn),k.removeEventListener("sessionend",ci),un.stop()};function G(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function ct(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const A=it.autoReset,W=Mt.enabled,J=Mt.autoUpdate,Q=Mt.needsUpdate,$=Mt.type;B(),it.autoReset=A,Mt.enabled=W,Mt.autoUpdate=J,Mt.needsUpdate=Q,Mt.type=$}function dt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function yt(A){const W=A.target;W.removeEventListener("dispose",yt),Vt(W)}function Vt(A){se(A),rt.remove(A)}function se(A){const W=rt.get(A).programs;W!==void 0&&(W.forEach(function(J){ot.releaseProgram(J)}),A.isShaderMaterial&&ot.releaseShaderCache(A))}this.renderBufferDirect=function(A,W,J,Q,$,xt){W===null&&(W=It);const Et=$.isMesh&&$.matrixWorld.determinant()<0,Ct=Ms(A,W,J,Q,$);z.setMaterial(Q,Et);let Pt=J.index,kt=1;if(Q.wireframe===!0){if(Pt=at.getWireframeAttribute(J),Pt===void 0)return;kt=2}const zt=J.drawRange,Dt=J.attributes.position;let Yt=zt.start*kt,Qt=(zt.start+zt.count)*kt;xt!==null&&(Yt=Math.max(Yt,xt.start*kt),Qt=Math.min(Qt,(xt.start+xt.count)*kt)),Pt!==null?(Yt=Math.max(Yt,0),Qt=Math.min(Qt,Pt.count)):Dt!=null&&(Yt=Math.max(Yt,0),Qt=Math.min(Qt,Dt.count));const te=Qt-Yt;if(te<0||te===1/0)return;Zt.setup($,Q,Ct,J,Pt);let fe,Kt=Tt;if(Pt!==null&&(fe=K.get(Pt),Kt=Gt,Kt.setIndex(fe)),$.isMesh)Q.wireframe===!0?(z.setLineWidth(Q.wireframeLinewidth*Xt()),Kt.setMode(F.LINES)):Kt.setMode(F.TRIANGLES);else if($.isLine){let At=Q.linewidth;At===void 0&&(At=1),z.setLineWidth(At*Xt()),$.isLineSegments?Kt.setMode(F.LINES):$.isLineLoop?Kt.setMode(F.LINE_LOOP):Kt.setMode(F.LINE_STRIP)}else $.isPoints?Kt.setMode(F.POINTS):$.isSprite&&Kt.setMode(F.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)Kt.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(U.get("WEBGL_multi_draw"))Kt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const At=$._multiDrawStarts,We=$._multiDrawCounts,Jt=$._multiDrawCount,Ie=Pt?K.get(Pt).bytesPerElement:1,Rn=rt.get(Q).currentProgram.getUniforms();for(let pe=0;pe<Jt;pe++)Rn.setValue(F,"_gl_DrawID",pe),Kt.render(At[pe]/Ie,We[pe])}else if($.isInstancedMesh)Kt.renderInstances(Yt,te,$.count);else if(J.isInstancedBufferGeometry){const At=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,We=Math.min(J.instanceCount,At);Kt.renderInstances(Yt,te,We)}else Kt.render(Yt,te)};function $t(A,W,J){A.transparent===!0&&A.side===Te&&A.forceSinglePass===!1?(A.side=De,A.needsUpdate=!0,di(A,W,J),A.side=Hn,A.needsUpdate=!0,di(A,W,J),A.side=Te):di(A,W,J)}this.compile=function(A,W,J=null){J===null&&(J=A),u=Nt.get(J),u.init(W),y.push(u),J.traverseVisible(function($){$.isLight&&$.layers.test(W.layers)&&(u.pushLight($),$.castShadow&&u.pushShadow($))}),A!==J&&A.traverseVisible(function($){$.isLight&&$.layers.test(W.layers)&&(u.pushLight($),$.castShadow&&u.pushShadow($))}),u.setupLights();const Q=new Set;return A.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const xt=$.material;if(xt)if(Array.isArray(xt))for(let Et=0;Et<xt.length;Et++){const Ct=xt[Et];$t(Ct,J,$),Q.add(Ct)}else $t(xt,J,$),Q.add(xt)}),y.pop(),u=null,Q},this.compileAsync=function(A,W,J=null){const Q=this.compile(A,W,J);return new Promise($=>{function xt(){if(Q.forEach(function(Et){rt.get(Et).currentProgram.isReady()&&Q.delete(Et)}),Q.size===0){$(A);return}setTimeout(xt,10)}U.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let jt=null;function ue(A){jt&&jt(A)}function wn(){un.stop()}function ci(){un.start()}const un=new fd;un.setAnimationLoop(ue),typeof self<"u"&&un.setContext(self),this.setAnimationLoop=function(A){jt=A,k.setAnimationLoop(A),A===null?un.stop():un.start()},k.addEventListener("sessionstart",wn),k.addEventListener("sessionend",ci),this.render=function(A,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),k.enabled===!0&&k.isPresenting===!0&&(k.cameraAutoUpdate===!0&&k.updateCamera(W),W=k.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,W,P),u=Nt.get(A,y.length),u.init(W),y.push(u),gt.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),j.setFromProjectionMatrix(gt),ht=this.localClippingEnabled,st=lt.init(this.clippingPlanes,ht),m=_t.get(A,x.length),m.init(),x.push(m),k.enabled===!0&&k.isPresenting===!0){const xt=v.xr.getDepthSensingMesh();xt!==null&&$i(xt,W,-1/0,v.sortObjects)}$i(A,W,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(q,et),bt=k.enabled===!1||k.isPresenting===!1||k.hasDepthSensing()===!1,bt&&Lt.addToRenderList(m,A),this.info.render.frame++,st===!0&&lt.beginShadows();const J=u.state.shadowsArray;Mt.render(J,A,W),st===!0&&lt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,$=m.transmissive;if(u.setupLights(),W.isArrayCamera){const xt=W.cameras;if($.length>0)for(let Et=0,Ct=xt.length;Et<Ct;Et++){const Pt=xt[Et];gs(Q,$,A,Pt)}bt&&Lt.render(A);for(let Et=0,Ct=xt.length;Et<Ct;Et++){const Pt=xt[Et];ms(m,A,Pt,Pt.viewport)}}else $.length>0&&gs(Q,$,A,W),bt&&Lt.render(A),ms(m,A,W);P!==null&&(E.updateMultisampleRenderTarget(P),E.updateRenderTargetMipmap(P)),A.isScene===!0&&A.onAfterRender(v,A,W),Zt.resetDefaultState(),b=-1,S=null,y.pop(),y.length>0?(u=y[y.length-1],st===!0&&lt.setGlobalState(v.clippingPlanes,u.state.camera)):u=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function $i(A,W,J,Q){if(A.visible===!1)return;if(A.layers.test(W.layers)){if(A.isGroup)J=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(W);else if(A.isLight)u.pushLight(A),A.castShadow&&u.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||j.intersectsSprite(A)){Q&&Rt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(gt);const Et=tt.update(A),Ct=A.material;Ct.visible&&m.push(A,Et,Ct,J,Rt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||j.intersectsObject(A))){const Et=tt.update(A),Ct=A.material;if(Q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Rt.copy(A.boundingSphere.center)):(Et.boundingSphere===null&&Et.computeBoundingSphere(),Rt.copy(Et.boundingSphere.center)),Rt.applyMatrix4(A.matrixWorld).applyMatrix4(gt)),Array.isArray(Ct)){const Pt=Et.groups;for(let kt=0,zt=Pt.length;kt<zt;kt++){const Dt=Pt[kt],Yt=Ct[Dt.materialIndex];Yt&&Yt.visible&&m.push(A,Et,Yt,J,Rt.z,Dt)}}else Ct.visible&&m.push(A,Et,Ct,J,Rt.z,null)}}const xt=A.children;for(let Et=0,Ct=xt.length;Et<Ct;Et++)$i(xt[Et],W,J,Q)}function ms(A,W,J,Q){const $=A.opaque,xt=A.transmissive,Et=A.transparent;u.setupLightsView(J),st===!0&&lt.setGlobalState(v.clippingPlanes,J),Q&&z.viewport(R.copy(Q)),$.length>0&&li($,W,J),xt.length>0&&li(xt,W,J),Et.length>0&&li(Et,W,J),z.buffers.depth.setTest(!0),z.buffers.depth.setMask(!0),z.buffers.color.setMask(!0),z.setPolygonOffset(!1)}function gs(A,W,J,Q){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[Q.id]===void 0&&(u.state.transmissionRenderTarget[Q.id]=new ri(1,1,{generateMipmaps:!0,type:U.has("EXT_color_buffer_half_float")||U.has("EXT_color_buffer_float")?us:Tn,minFilter:ii,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qt.workingColorSpace}));const xt=u.state.transmissionRenderTarget[Q.id],Et=Q.viewport||R;xt.setSize(Et.z,Et.w);const Ct=v.getRenderTarget();v.setRenderTarget(xt),v.getClearColor(O),H=v.getClearAlpha(),H<1&&v.setClearColor(16777215,.5),v.clear(),bt&&Lt.render(J);const Pt=v.toneMapping;v.toneMapping=On;const kt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),u.setupLightsView(Q),st===!0&&lt.setGlobalState(v.clippingPlanes,Q),li(A,J,Q),E.updateMultisampleRenderTarget(xt),E.updateRenderTargetMipmap(xt),U.has("WEBGL_multisampled_render_to_texture")===!1){let zt=!1;for(let Dt=0,Yt=W.length;Dt<Yt;Dt++){const Qt=W[Dt],te=Qt.object,fe=Qt.geometry,Kt=Qt.material,At=Qt.group;if(Kt.side===Te&&te.layers.test(Q.layers)){const We=Kt.side;Kt.side=De,Kt.needsUpdate=!0,_s(te,J,Q,fe,Kt,At),Kt.side=We,Kt.needsUpdate=!0,zt=!0}}zt===!0&&(E.updateMultisampleRenderTarget(xt),E.updateRenderTargetMipmap(xt))}v.setRenderTarget(Ct),v.setClearColor(O,H),kt!==void 0&&(Q.viewport=kt),v.toneMapping=Pt}function li(A,W,J){const Q=W.isScene===!0?W.overrideMaterial:null;for(let $=0,xt=A.length;$<xt;$++){const Et=A[$],Ct=Et.object,Pt=Et.geometry,kt=Q===null?Et.material:Q,zt=Et.group;Ct.layers.test(J.layers)&&_s(Ct,W,J,Pt,kt,zt)}}function _s(A,W,J,Q,$,xt){A.onBeforeRender(v,W,J,Q,$,xt),A.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(v,W,J,Q,A,xt),$.transparent===!0&&$.side===Te&&$.forceSinglePass===!1?($.side=De,$.needsUpdate=!0,v.renderBufferDirect(J,W,Q,$,A,xt),$.side=Hn,$.needsUpdate=!0,v.renderBufferDirect(J,W,Q,$,A,xt),$.side=Te):v.renderBufferDirect(J,W,Q,$,A,xt),A.onAfterRender(v,W,J,Q,$,xt)}function di(A,W,J){W.isScene!==!0&&(W=It);const Q=rt.get(A),$=u.state.lights,xt=u.state.shadowsArray,Et=$.state.version,Ct=ot.getParameters(A,$.state,xt,W,J),Pt=ot.getProgramCacheKey(Ct);let kt=Q.programs;Q.environment=A.isMeshStandardMaterial?W.environment:null,Q.fog=W.fog,Q.envMap=(A.isMeshStandardMaterial?V:M).get(A.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&A.envMap===null?W.environmentRotation:A.envMapRotation,kt===void 0&&(A.addEventListener("dispose",yt),kt=new Map,Q.programs=kt);let zt=kt.get(Pt);if(zt!==void 0){if(Q.currentProgram===zt&&Q.lightsStateVersion===Et)return vs(A,Ct),zt}else Ct.uniforms=ot.getUniforms(A),A.onBeforeCompile(Ct,v),zt=ot.acquireProgram(Ct,Pt),kt.set(Pt,zt),Q.uniforms=Ct.uniforms;const Dt=Q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Dt.clippingPlanes=lt.uniform),vs(A,Ct),Q.needsLights=Da(A),Q.lightsStateVersion=Et,Q.needsLights&&(Dt.ambientLightColor.value=$.state.ambient,Dt.lightProbe.value=$.state.probe,Dt.directionalLights.value=$.state.directional,Dt.directionalLightShadows.value=$.state.directionalShadow,Dt.spotLights.value=$.state.spot,Dt.spotLightShadows.value=$.state.spotShadow,Dt.rectAreaLights.value=$.state.rectArea,Dt.ltc_1.value=$.state.rectAreaLTC1,Dt.ltc_2.value=$.state.rectAreaLTC2,Dt.pointLights.value=$.state.point,Dt.pointLightShadows.value=$.state.pointShadow,Dt.hemisphereLights.value=$.state.hemi,Dt.directionalShadowMap.value=$.state.directionalShadowMap,Dt.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Dt.spotShadowMap.value=$.state.spotShadowMap,Dt.spotLightMatrix.value=$.state.spotLightMatrix,Dt.spotLightMap.value=$.state.spotLightMap,Dt.pointShadowMap.value=$.state.pointShadowMap,Dt.pointShadowMatrix.value=$.state.pointShadowMatrix),Q.currentProgram=zt,Q.uniformsList=null,zt}function xs(A){if(A.uniformsList===null){const W=A.currentProgram.getUniforms();A.uniformsList=ca.seqWithValue(W.seq,A.uniforms)}return A.uniformsList}function vs(A,W){const J=rt.get(A);J.outputColorSpace=W.outputColorSpace,J.batching=W.batching,J.batchingColor=W.batchingColor,J.instancing=W.instancing,J.instancingColor=W.instancingColor,J.instancingMorph=W.instancingMorph,J.skinning=W.skinning,J.morphTargets=W.morphTargets,J.morphNormals=W.morphNormals,J.morphColors=W.morphColors,J.morphTargetsCount=W.morphTargetsCount,J.numClippingPlanes=W.numClippingPlanes,J.numIntersection=W.numClipIntersection,J.vertexAlphas=W.vertexAlphas,J.vertexTangents=W.vertexTangents,J.toneMapping=W.toneMapping}function Ms(A,W,J,Q,$){W.isScene!==!0&&(W=It),E.resetTextureUnits();const xt=W.fog,Et=Q.isMeshStandardMaterial?W.environment:null,Ct=P===null?v.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Vi,Pt=(Q.isMeshStandardMaterial?V:M).get(Q.envMap||Et),kt=Q.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,zt=!!J.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Dt=!!J.morphAttributes.position,Yt=!!J.morphAttributes.normal,Qt=!!J.morphAttributes.color;let te=On;Q.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(te=v.toneMapping);const fe=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Kt=fe!==void 0?fe.length:0,At=rt.get(Q),We=u.state.lights;if(st===!0&&(ht===!0||A!==S)){const ke=A===S&&Q.id===b;lt.setState(Q,A,ke)}let Jt=!1;Q.version===At.__version?(At.needsLights&&At.lightsStateVersion!==We.state.version||At.outputColorSpace!==Ct||$.isBatchedMesh&&At.batching===!1||!$.isBatchedMesh&&At.batching===!0||$.isBatchedMesh&&At.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&At.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&At.instancing===!1||!$.isInstancedMesh&&At.instancing===!0||$.isSkinnedMesh&&At.skinning===!1||!$.isSkinnedMesh&&At.skinning===!0||$.isInstancedMesh&&At.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&At.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&At.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&At.instancingMorph===!1&&$.morphTexture!==null||At.envMap!==Pt||Q.fog===!0&&At.fog!==xt||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==lt.numPlanes||At.numIntersection!==lt.numIntersection)||At.vertexAlphas!==kt||At.vertexTangents!==zt||At.morphTargets!==Dt||At.morphNormals!==Yt||At.morphColors!==Qt||At.toneMapping!==te||At.morphTargetsCount!==Kt)&&(Jt=!0):(Jt=!0,At.__version=Q.version);let Ie=At.currentProgram;Jt===!0&&(Ie=di(Q,W,$));let Rn=!1,pe=!1,Vn=!1;const ae=Ie.getUniforms(),Ue=At.uniforms;if(z.useProgram(Ie.program)&&(Rn=!0,pe=!0,Vn=!0),Q.id!==b&&(b=Q.id,pe=!0),Rn||S!==A){z.buffers.depth.getReversed()?(pt.copy(A.projectionMatrix),Af(pt),Tf(pt),ae.setValue(F,"projectionMatrix",pt)):ae.setValue(F,"projectionMatrix",A.projectionMatrix),ae.setValue(F,"viewMatrix",A.matrixWorldInverse);const Je=ae.map.cameraPosition;Je!==void 0&&Je.setValue(F,wt.setFromMatrixPosition(A.matrixWorld)),nt.logarithmicDepthBuffer&&ae.setValue(F,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&ae.setValue(F,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,pe=!0,Vn=!0)}if($.isSkinnedMesh){ae.setOptional(F,$,"bindMatrix"),ae.setOptional(F,$,"bindMatrixInverse");const ke=$.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),ae.setValue(F,"boneTexture",ke.boneTexture,E))}$.isBatchedMesh&&(ae.setOptional(F,$,"batchingTexture"),ae.setValue(F,"batchingTexture",$._matricesTexture,E),ae.setOptional(F,$,"batchingIdTexture"),ae.setValue(F,"batchingIdTexture",$._indirectTexture,E),ae.setOptional(F,$,"batchingColorTexture"),$._colorsTexture!==null&&ae.setValue(F,"batchingColorTexture",$._colorsTexture,E));const Cn=J.morphAttributes;if((Cn.position!==void 0||Cn.normal!==void 0||Cn.color!==void 0)&&Ut.update($,J,Ie),(pe||At.receiveShadow!==$.receiveShadow)&&(At.receiveShadow=$.receiveShadow,ae.setValue(F,"receiveShadow",$.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Ue.envMap.value=Pt,Ue.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&W.environment!==null&&(Ue.envMapIntensity.value=W.environmentIntensity),pe&&(ae.setValue(F,"toneMappingExposure",v.toneMappingExposure),At.needsLights&&ys(Ue,Vn),xt&&Q.fog===!0&&ut.refreshFogUniforms(Ue,xt),ut.refreshMaterialUniforms(Ue,Q,Y,X,u.state.transmissionRenderTarget[A.id]),ca.upload(F,xs(At),Ue,E)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(ca.upload(F,xs(At),Ue,E),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&ae.setValue(F,"center",$.center),ae.setValue(F,"modelViewMatrix",$.modelViewMatrix),ae.setValue(F,"normalMatrix",$.normalMatrix),ae.setValue(F,"modelMatrix",$.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const ke=Q.uniformsGroups;for(let Je=0,Qe=ke.length;Je<Qe;Je++){const Yi=ke[Je];N.update(Yi,Ie),N.bind(Yi,Ie)}}return Ie}function ys(A,W){A.ambientLightColor.needsUpdate=W,A.lightProbe.needsUpdate=W,A.directionalLights.needsUpdate=W,A.directionalLightShadows.needsUpdate=W,A.pointLights.needsUpdate=W,A.pointLightShadows.needsUpdate=W,A.spotLights.needsUpdate=W,A.spotLightShadows.needsUpdate=W,A.rectAreaLights.needsUpdate=W,A.hemisphereLights.needsUpdate=W}function Da(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(A,W,J){rt.get(A.texture).__webglTexture=W,rt.get(A.depthTexture).__webglTexture=J;const Q=rt.get(A);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=J===void 0,Q.__autoAllocateDepthBuffer||U.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,W){const J=rt.get(A);J.__webglFramebuffer=W,J.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(A,W=0,J=0){P=A,w=W,C=J;let Q=!0,$=null,xt=!1,Et=!1;if(A){const Pt=rt.get(A);if(Pt.__useDefaultFramebuffer!==void 0)z.bindFramebuffer(F.FRAMEBUFFER,null),Q=!1;else if(Pt.__webglFramebuffer===void 0)E.setupRenderTarget(A);else if(Pt.__hasExternalTextures)E.rebindTextures(A,rt.get(A.texture).__webglTexture,rt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Dt=A.depthTexture;if(Pt.__boundDepthTexture!==Dt){if(Dt!==null&&rt.has(Dt)&&(A.width!==Dt.image.width||A.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(A)}}const kt=A.texture;(kt.isData3DTexture||kt.isDataArrayTexture||kt.isCompressedArrayTexture)&&(Et=!0);const zt=rt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(zt[W])?$=zt[W][J]:$=zt[W],xt=!0):A.samples>0&&E.useMultisampledRTT(A)===!1?$=rt.get(A).__webglMultisampledFramebuffer:Array.isArray(zt)?$=zt[J]:$=zt,R.copy(A.viewport),T.copy(A.scissor),D=A.scissorTest}else R.copy(mt).multiplyScalar(Y).floor(),T.copy(vt).multiplyScalar(Y).floor(),D=ft;if(z.bindFramebuffer(F.FRAMEBUFFER,$)&&Q&&z.drawBuffers(A,$),z.viewport(R),z.scissor(T),z.setScissorTest(D),xt){const Pt=rt.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+W,Pt.__webglTexture,J)}else if(Et){const Pt=rt.get(A.texture),kt=W||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,Pt.__webglTexture,J||0,kt)}b=-1},this.readRenderTargetPixels=function(A,W,J,Q,$,xt,Et){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=rt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Et!==void 0&&(Ct=Ct[Et]),Ct){z.bindFramebuffer(F.FRAMEBUFFER,Ct);try{const Pt=A.texture,kt=Pt.format,zt=Pt.type;if(!nt.textureFormatReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!nt.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=A.width-Q&&J>=0&&J<=A.height-$&&F.readPixels(W,J,Q,$,Ft.convert(kt),Ft.convert(zt),xt)}finally{const Pt=P!==null?rt.get(P).__webglFramebuffer:null;z.bindFramebuffer(F.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(A,W,J,Q,$,xt,Et){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=rt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Et!==void 0&&(Ct=Ct[Et]),Ct){const Pt=A.texture,kt=Pt.format,zt=Pt.type;if(!nt.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!nt.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(W>=0&&W<=A.width-Q&&J>=0&&J<=A.height-$){z.bindFramebuffer(F.FRAMEBUFFER,Ct);const Dt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Dt),F.bufferData(F.PIXEL_PACK_BUFFER,xt.byteLength,F.STREAM_READ),F.readPixels(W,J,Q,$,Ft.convert(kt),Ft.convert(zt),0);const Yt=P!==null?rt.get(P).__webglFramebuffer:null;z.bindFramebuffer(F.FRAMEBUFFER,Yt);const Qt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Ef(F,Qt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Dt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,xt),F.deleteBuffer(Dt),F.deleteSync(Qt),xt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,W=null,J=0){A.isTexture!==!0&&(ss("WebGLRenderer: copyFramebufferToTexture function signature has changed."),W=arguments[0]||null,A=arguments[1]);const Q=Math.pow(2,-J),$=Math.floor(A.image.width*Q),xt=Math.floor(A.image.height*Q),Et=W!==null?W.x:0,Ct=W!==null?W.y:0;E.setTexture2D(A,0),F.copyTexSubImage2D(F.TEXTURE_2D,J,0,0,Et,Ct,$,xt),z.unbindTexture()},this.copyTextureToTexture=function(A,W,J=null,Q=null,$=0){A.isTexture!==!0&&(ss("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,A=arguments[1],W=arguments[2],$=arguments[3]||0,J=null);let xt,Et,Ct,Pt,kt,zt,Dt,Yt,Qt;const te=A.isCompressedTexture?A.mipmaps[$]:A.image;J!==null?(xt=J.max.x-J.min.x,Et=J.max.y-J.min.y,Ct=J.isBox3?J.max.z-J.min.z:1,Pt=J.min.x,kt=J.min.y,zt=J.isBox3?J.min.z:0):(xt=te.width,Et=te.height,Ct=te.depth||1,Pt=0,kt=0,zt=0),Q!==null?(Dt=Q.x,Yt=Q.y,Qt=Q.z):(Dt=0,Yt=0,Qt=0);const fe=Ft.convert(W.format),Kt=Ft.convert(W.type);let At;W.isData3DTexture?(E.setTexture3D(W,0),At=F.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(E.setTexture2DArray(W,0),At=F.TEXTURE_2D_ARRAY):(E.setTexture2D(W,0),At=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,W.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,W.unpackAlignment);const We=F.getParameter(F.UNPACK_ROW_LENGTH),Jt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Ie=F.getParameter(F.UNPACK_SKIP_PIXELS),Rn=F.getParameter(F.UNPACK_SKIP_ROWS),pe=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,te.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,te.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Pt),F.pixelStorei(F.UNPACK_SKIP_ROWS,kt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,zt);const Vn=A.isDataArrayTexture||A.isData3DTexture,ae=W.isDataArrayTexture||W.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const Ue=rt.get(A),Cn=rt.get(W),ke=rt.get(Ue.__renderTarget),Je=rt.get(Cn.__renderTarget);z.bindFramebuffer(F.READ_FRAMEBUFFER,ke.__webglFramebuffer),z.bindFramebuffer(F.DRAW_FRAMEBUFFER,Je.__webglFramebuffer);for(let Qe=0;Qe<Ct;Qe++)Vn&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,rt.get(A).__webglTexture,$,zt+Qe),A.isDepthTexture?(ae&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,rt.get(W).__webglTexture,$,Qt+Qe),F.blitFramebuffer(Pt,kt,xt,Et,Dt,Yt,xt,Et,F.DEPTH_BUFFER_BIT,F.NEAREST)):ae?F.copyTexSubImage3D(At,$,Dt,Yt,Qt+Qe,Pt,kt,xt,Et):F.copyTexSubImage2D(At,$,Dt,Yt,Qt+Qe,Pt,kt,xt,Et);z.bindFramebuffer(F.READ_FRAMEBUFFER,null),z.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else ae?A.isDataTexture||A.isData3DTexture?F.texSubImage3D(At,$,Dt,Yt,Qt,xt,Et,Ct,fe,Kt,te.data):W.isCompressedArrayTexture?F.compressedTexSubImage3D(At,$,Dt,Yt,Qt,xt,Et,Ct,fe,te.data):F.texSubImage3D(At,$,Dt,Yt,Qt,xt,Et,Ct,fe,Kt,te):A.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,$,Dt,Yt,xt,Et,fe,Kt,te.data):A.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,$,Dt,Yt,te.width,te.height,fe,te.data):F.texSubImage2D(F.TEXTURE_2D,$,Dt,Yt,xt,Et,fe,Kt,te);F.pixelStorei(F.UNPACK_ROW_LENGTH,We),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Jt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ie),F.pixelStorei(F.UNPACK_SKIP_ROWS,Rn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,pe),$===0&&W.generateMipmaps&&F.generateMipmap(At),z.unbindTexture()},this.copyTextureToTexture3D=function(A,W,J=null,Q=null,$=0){return A.isTexture!==!0&&(ss("WebGLRenderer: copyTextureToTexture3D function signature has changed."),J=arguments[0]||null,Q=arguments[1]||null,A=arguments[2],W=arguments[3],$=arguments[4]||0),ss('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,W,J,Q,$)},this.initRenderTarget=function(A){rt.get(A).__webglFramebuffer===void 0&&E.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?E.setTextureCube(A,0):A.isData3DTexture?E.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?E.setTexture2DArray(A,0):E.setTexture2D(A,0),z.unbindTexture()},this.resetState=function(){w=0,C=0,P=null,z.reset(),Zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=qt._getUnpackColorSpace()}}class F_ extends de{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new dn,this.environmentIntensity=1,this.environmentRotation=new dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class N_{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Ao,this.updateRanges=[],this.version=0,this.uuid=Bn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const be=new Z;class Ma{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=rn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ne(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=rn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=rn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=rn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=rn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array),a=ne(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new Ke(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ma(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Md extends oi{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Ot(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ri;const Qi=new Z,Ci=new Z,Pi=new Z,Di=new Bt,ts=new Bt,yd=new oe,$s=new Z,es=new Z,Ys=new Z,xl=new Bt,Mr=new Bt,vl=new Bt;class z_ extends de{constructor(t=new Md){if(super(),this.isSprite=!0,this.type="Sprite",Ri===void 0){Ri=new Le;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new N_(e,5);Ri.setIndex([0,1,2,0,2,3]),Ri.setAttribute("position",new Ma(n,3,0,!1)),Ri.setAttribute("uv",new Ma(n,2,3,!1))}this.geometry=Ri,this.material=t,this.center=new Bt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ci.setFromMatrixScale(this.matrixWorld),yd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Pi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ci.multiplyScalar(-Pi.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;Zs($s.set(-.5,-.5,0),Pi,r,Ci,s,a),Zs(es.set(.5,-.5,0),Pi,r,Ci,s,a),Zs(Ys.set(.5,.5,0),Pi,r,Ci,s,a),xl.set(0,0),Mr.set(1,0),vl.set(1,1);let o=t.ray.intersectTriangle($s,es,Ys,!1,Qi);if(o===null&&(Zs(es.set(-.5,.5,0),Pi,r,Ci,s,a),Mr.set(0,1),o=t.ray.intersectTriangle($s,Ys,es,!1,Qi),o===null))return;const c=t.ray.origin.distanceTo(Qi);c<t.near||c>t.far||e.push({distance:c,point:Qi.clone(),uv:ze.getInterpolation(Qi,$s,es,Ys,xl,Mr,vl,new Bt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Zs(i,t,e,n,s,a){Di.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(ts.x=a*Di.x-s*Di.y,ts.y=s*Di.x+a*Di.y):ts.copy(Di),i.copy(t),i.x+=ts.x,i.y+=ts.y,i.applyMatrix4(yd)}class jo extends oi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Ot(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ya=new Z,Sa=new Z,Ml=new oe,ns=new $o,qs=new wa,yr=new Z,yl=new Z;class O_ extends de{constructor(t=new Le,e=new jo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,a=e.count;s<a;s++)ya.fromBufferAttribute(e,s-1),Sa.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=ya.distanceTo(Sa);t.setAttribute("lineDistance",new he(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qs.copy(n.boundingSphere),qs.applyMatrix4(s),qs.radius+=a,t.ray.intersectsSphere(qs)===!1)return;Ml.copy(s).invert(),ns.copy(t.ray).applyMatrix4(Ml);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,p=n.attributes.position;if(h!==null){const d=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let _=d,m=g-1;_<m;_+=l){const u=h.getX(_),x=h.getX(_+1),y=js(this,t,ns,c,u,x);y&&e.push(y)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(d),u=js(this,t,ns,c,_,m);u&&e.push(u)}}else{const d=Math.max(0,r.start),g=Math.min(p.count,r.start+r.count);for(let _=d,m=g-1;_<m;_+=l){const u=js(this,t,ns,c,_,_+1);u&&e.push(u)}if(this.isLineLoop){const _=js(this,t,ns,c,g-1,d);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function js(i,t,e,n,s,a){const r=i.geometry.attributes.position;if(ya.fromBufferAttribute(r,s),Sa.fromBufferAttribute(r,a),e.distanceSqToSegment(ya,Sa,yr,yl)>n)return;yr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(yr);if(!(c<t.near||c>t.far))return{distance:c,point:yl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Sl=new Z,bl=new Z;class Sd extends O_{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,a=e.count;s<a;s+=2)Sl.fromBufferAttribute(e,s),bl.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Sl.distanceTo(bl);t.setAttribute("lineDistance",new he(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class B_ extends Re{constructor(t,e,n,s,a,r,o,c,l){super(t,e,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ko extends Le{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const a=[],r=[];o(s),l(n),h(),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(a.slice(),3)),this.setAttribute("uv",new he(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const y=new Z,v=new Z,L=new Z;for(let w=0;w<e.length;w+=3)d(e[w+0],y),d(e[w+1],v),d(e[w+2],L),c(y,v,L,x)}function c(x,y,v,L){const w=L+1,C=[];for(let P=0;P<=w;P++){C[P]=[];const b=x.clone().lerp(v,P/w),S=y.clone().lerp(v,P/w),R=w-P;for(let T=0;T<=R;T++)T===0&&P===w?C[P][T]=b:C[P][T]=b.clone().lerp(S,T/R)}for(let P=0;P<w;P++)for(let b=0;b<2*(w-P)-1;b++){const S=Math.floor(b/2);b%2===0?(p(C[P][S+1]),p(C[P+1][S]),p(C[P][S])):(p(C[P][S+1]),p(C[P+1][S+1]),p(C[P+1][S]))}}function l(x){const y=new Z;for(let v=0;v<a.length;v+=3)y.x=a[v+0],y.y=a[v+1],y.z=a[v+2],y.normalize().multiplyScalar(x),a[v+0]=y.x,a[v+1]=y.y,a[v+2]=y.z}function h(){const x=new Z;for(let y=0;y<a.length;y+=3){x.x=a[y+0],x.y=a[y+1],x.z=a[y+2];const v=m(x)/2/Math.PI+.5,L=u(x)/Math.PI+.5;r.push(v,1-L)}g(),f()}function f(){for(let x=0;x<r.length;x+=6){const y=r[x+0],v=r[x+2],L=r[x+4],w=Math.max(y,v,L),C=Math.min(y,v,L);w>.9&&C<.1&&(y<.2&&(r[x+0]+=1),v<.2&&(r[x+2]+=1),L<.2&&(r[x+4]+=1))}}function p(x){a.push(x.x,x.y,x.z)}function d(x,y){const v=x*3;y.x=t[v+0],y.y=t[v+1],y.z=t[v+2]}function g(){const x=new Z,y=new Z,v=new Z,L=new Z,w=new Bt,C=new Bt,P=new Bt;for(let b=0,S=0;b<a.length;b+=9,S+=6){x.set(a[b+0],a[b+1],a[b+2]),y.set(a[b+3],a[b+4],a[b+5]),v.set(a[b+6],a[b+7],a[b+8]),w.set(r[S+0],r[S+1]),C.set(r[S+2],r[S+3]),P.set(r[S+4],r[S+5]),L.copy(x).add(y).add(v).divideScalar(3);const R=m(L);_(w,S+0,x,R),_(C,S+2,y,R),_(P,S+4,v,R)}}function _(x,y,v,L){L<0&&x.x===1&&(r[y]=x.x-1),v.x===0&&v.z===0&&(r[y]=L/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function u(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ko(t.vertices,t.indices,t.radius,t.details)}}const Ks=new Z,Js=new Z,Sr=new Z,Qs=new ze;class H_ extends Le{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(oa*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],h=["a","b","c"],f=new Array(3),p={},d=[];for(let g=0;g<c;g+=3){r?(l[0]=r.getX(g),l[1]=r.getX(g+1),l[2]=r.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:u}=Qs;if(_.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),u.fromBufferAttribute(o,l[2]),Qs.getNormal(Sr),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(u.x*s)},${Math.round(u.y*s)},${Math.round(u.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const y=(x+1)%3,v=f[x],L=f[y],w=Qs[h[x]],C=Qs[h[y]],P=`${v}_${L}`,b=`${L}_${v}`;b in p&&p[b]?(Sr.dot(p[b].normal)<=a&&(d.push(w.x,w.y,w.z),d.push(C.x,C.y,C.z)),p[b]=null):P in p||(p[P]={index0:l[x],index1:l[y],normal:Sr.clone()})}}for(const g in p)if(p[g]){const{index0:_,index1:m}=p[g];Ks.fromBufferAttribute(o,_),Js.fromBufferAttribute(o,m),d.push(Ks.x,Ks.y,Ks.z),d.push(Js.x,Js.y,Js.z)}this.setAttribute("position",new he(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Jo extends Ko{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Jo(t.radius,t.detail)}}class Ii extends Le{constructor(t=.5,e=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let f=t;const p=(e-t)/s,d=new Z,g=new Bt;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const u=a+m/n*r;d.x=f*Math.cos(u),d.y=f*Math.sin(u),c.push(d.x,d.y,d.z),l.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,h.push(g.x,g.y)}f+=p}for(let _=0;_<s;_++){const m=_*(n+1);for(let u=0;u<n;u++){const x=u+m,y=x,v=x+n+1,L=x+n+2,w=x+1;o.push(y,v,w),o.push(v,L,w)}}this.setIndex(o),this.setAttribute("position",new he(c,3)),this.setAttribute("normal",new he(l,3)),this.setAttribute("uv",new he(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ii(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Pa extends Le{constructor(t=1,e=.4,n=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:a},n=Math.floor(n),s=Math.floor(s);const r=[],o=[],c=[],l=[],h=new Z,f=new Z,p=new Z;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const _=g/s*a,m=d/n*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(_),f.y=(t+e*Math.cos(m))*Math.sin(_),f.z=e*Math.sin(m),o.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),p.subVectors(f,h).normalize(),c.push(p.x,p.y,p.z),l.push(g/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const _=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,u=(s+1)*(d-1)+g,x=(s+1)*d+g;r.push(_,m,x),r.push(m,u,x)}this.setIndex(r),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pa(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class hs extends oi{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nd,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=Oo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class bd extends de{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ot(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class G_ extends bd{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ot(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const br=new oe,El=new Z,Al=new Z;class V_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Bt(512,512),this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zo,this._frameExtents=new Bt(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;El.setFromMatrixPosition(t.matrixWorld),e.position.copy(El),Al.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Al),e.updateMatrixWorld(),br.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(br),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(br)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class W_ extends V_{constructor(){super(new pd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class X_ extends bd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.target=new de,this.shadow=new W_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Tl=new oe;class $_{constructor(t,e,n=0,s=1/0){this.ray=new $o(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Yo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Tl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Tl),this}intersectObject(t,e=!0,n=[]){return Ro(t,this,n,e),n.sort(wl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,a=t.length;s<a;s++)Ro(t[s],this,n,e);return n.sort(wl),n}}function wl(i,t){return i.distance-t.distance}function Ro(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const a=i.children;for(let r=0,o=a.length;r<o;r++)Ro(a[r],t,e,!0)}}class Y_ extends Sd{constructor(t=10,e=10,n=4473924,s=8947848){n=new Ot(n),s=new Ot(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let p=0,d=0,g=-o;p<=e;p++,g+=r){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=p===a?n:s;_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3}const h=new Le;h.setAttribute("position",new he(c,3)),h.setAttribute("color",new he(l,3));const f=new jo({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zo);const Z_={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function q_(i,t,e,n){const s=new He(i.fov,n,.1,200),a=new Z,r=new Z,o=new Z;let c=!1,l=i.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function p(){const d=(i.pitchDeg+h.pitchDelta)*Math.PI/180,g=i.yawDeg*Math.PI/180;o.set(Math.sin(g)*Math.cos(d),Math.sin(d),Math.cos(g)*Math.cos(d)).multiplyScalar(i.distance*h.distanceScale*h.zoom)}return p(),{camera:s,update(d,g,_,m,u=Z_){const x=g+.6;if(!c)a.set(d,x,_),c=!0;else{const L=1-Math.exp(-Math.max(i.smoothing,.001)*m);a.x+=(d-a.x)*L,a.y+=(x-a.y)*L,a.z+=(_-a.z)*L}const y=1-Math.exp(-Math.max(t.smoothing,.001)*m);h.distanceScale+=(u.distanceScale-h.distanceScale)*y,h.offsetX+=(u.offsetX-h.offsetX)*y,h.offsetZ+=(u.offsetZ-h.offsetZ)*y,h.pitchDelta+=(u.pitchDelta-h.pitchDelta)*y;const v=1-Math.exp(-Math.max(e.smoothing,.001)*m);h.zoom+=(f-h.zoom)*v,p(),(s.fov!==l||s.fov!==i.fov)&&(s.fov=i.fov,l=i.fov,s.updateProjectionMatrix()),r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(d){s.aspect=d,s.updateProjectionMatrix()},getGroundBasis(){const d=new Z().setFromMatrixColumn(s.matrixWorld,0),g=new Z().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(d.x,d.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:d.x/_,rightZ:d.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(d){f=Number.isFinite(d)&&d>0?d:1},smart(){return{...h}}}}const ta=Math.PI*2,is=1e-6;function j_(i,t,e){return i<t?t:i>e?e:i}function K_(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function J_(i){if(i<=Math.PI)return 1-2*i/Math.PI;const t=(i-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Q_(i,t){const e=Math.cos(i),n=t<=0?0:t>=1?1:t;if(n===0)return e;const s=J_(i);return n===1?s:e+(s-e)*n}function Rl(i){return(1-Math.sin(i))/2}function Ed(i,t){if(!i.grounded||i.speed<is)return K_();const e=i.speed/Math.max(i.moveSpeed,is),n=Math.max(i.legLength,is),s=i.stride>is?i.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*n,a=Math.min(t.maxAmp,s/n),r=n*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(i.localForward),c=Math.abs(i.localRight),l=o+c+is,h=o/l,f=c/l,p=i.localForward>=0?1:-1,d=i.localRight>=0?1:-1,g=s,_=D=>Math.asin(j_(D,-r,r)/n);function m(D,O){const H=Q_(D,t.plantLock),I=Rl(D),X=p*h*g*H,Y=-_(X),q=O*d>0?1:-1,et=1+q*t.crossStep*.45,mt=d*q*t.crossStep*g*.4*I,vt=d*f*g*t.sideWeight*et*H+mt*f,ft=_(vt),j=t.kneeLift*I*a*(.55+.25*h+(q>0?.2*f:0));return{pitchX:Y,rollZ:ft,kneeX:j}}const u=(i.phase%ta+ta)%ta,x=m(u,-1),y=m((u+Math.PI)%ta,1),v=Math.cos(u),L=Rl(u),w=-t.comSway*a*v*(.6*h+.8*f)-d*t.comSway*a*f*.45,C=t.comBob*L*a,P=d*t.hipLean*a*f*v*.6,b=d*t.hipLean*a*f*(.45+.25*v),S=t.armSwing*a*v*(h*p+.3*f),R=S,T=-S;return{legL:x,legR:y,pelvisX:w,pelvisY:C,pelvisRoll:P,sideLean:b,armL:R,armR:T,strafe:f,backward:p<0?h:0}}function we(i){return i<0?0:i>1?1:i}const tx=Math.PI*2;function ex(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function nx(i,t,e,n,s){const a=we(n);if(a<=0)return i;const r=we(t),o=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),l=e%2===0?1:-1,h=we(s.forwardBias),f={speed:c,phase:i.phase+r*tx*o,localForward:c*h,localRight:c*(1-h)*l};return{speed:i.speed+(f.speed-i.speed)*a,phase:i.phase+(f.phase-i.phase)*a,localForward:i.localForward+(f.localForward-i.localForward)*a,localRight:i.localRight+(f.localRight-i.localRight)*a}}function ix(i,t,e){const n=ex(),s=we(i),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return n;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return n.legL.pitchX=o?-l:l*.55,n.legR.pitchX=c?-l:l*.55,n.legL.kneeX=o?h:h*.4,n.legR.kneeX=c?h:h*.4,n.legL.rollZ=-f*r,n.legR.rollZ=f*r,n.pelvisX=e.stepSway*a*r,n.pelvisY=-e.stepDip*a,n.pelvisRoll=f*.25*r,n}function Ad(i,t){if(i<=0||i>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return i<e?Math.sin(Math.PI/2*(i/e)):Math.cos(Math.PI/2*((i-e)/(1-e)))}function Cl(i,t,e,n,s){if(e<=0||n<=0)return 0;const a=(i-t)/e;return a<0||a>=1?0:n*Ad(a,s)}function sx(i,t,e,n){const s=t?1:0,a=1-Math.exp(-Math.max(0,n)*Math.max(0,e)),r=i+(s-i)*a;return t&&r>.999?1:!t&&r<.001?0:r}function ax(i,t,e){const n=we(i);return{gaitScale:1-n*(1-we(t)),attackLegWeight:we(e)*n}}function rx(i,t){const e=we(t);return e===1?i:{legL:{pitchX:i.legL.pitchX*e,rollZ:i.legL.rollZ*e,kneeX:i.legL.kneeX*e},legR:{pitchX:i.legR.pitchX*e,rollZ:i.legR.rollZ*e,kneeX:i.legR.kneeX*e},pelvisX:i.pelvisX*e,pelvisY:i.pelvisY*e,pelvisRoll:i.pelvisRoll*e,sideLean:i.sideLean*e,armL:i.armL*e,armR:i.armR*e,strafe:i.strafe,backward:i.backward}}function ox(i,t){const e=Math.min(1,Math.abs(i)/Math.max(t.impactSpeed,1e-6));return we(t.minScale+(1-t.minScale)*e)}function cx(){return Td()}function Td(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function lx(i,t){return i.type==="light"?Math.max(0,t.leanLight):i.type==="heavy"?Math.max(0,t.leanHeavy):i.type==="knock"?Math.max(0,t.leanKnock):0}function dx(i,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?we(t.forceHitHeight):i.type==="light"?we(t.hitHeight.light):i.type==="heavy"?we(t.hitHeight.heavy):i.type==="knock"?we(t.hitHeight.knock):0}function hx(i,t,e){const n=we(e),s=(a,r)=>a+(r-a)*n;return{upperPitch:s(i.upperPitch,t.upperPitch),upperRoll:s(i.upperRoll,t.upperRoll),upperYaw:s(i.upperYaw,t.upperYaw),fold:s(i.fold,t.fold),shift:s(i.shift,t.shift),drop:s(i.drop,t.drop),back:s(i.back,t.back),knee:s(i.knee,t.knee),hip:s(i.hip,t.hip),arm:s(i.arm,t.arm)}}function wd(i,t,e){const n=Td(),s=lx(i,e);if(n.intensity=s,s<=0||i.duration<=0||!Number.isFinite(i.timer))return n;const a=we(1-i.timer/i.duration),r=Ad(a,e.pulseRatio);n.pulse=r,n.active=r>0,n.hitHeight=dx(i,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),f=i.dirX*o+i.dirZ*c,p=i.dirX*l+i.dirZ*h;if(n.localFwd=f,n.localRight=p,!e.enabled){n.legacy=!0;const _=Math.sin(Math.PI*a);return n.upperPitch=s*_*f,n.upperRoll=-s*_*p*.7,n.drop=(s>.5?.09:.04)*_,n.flash=e.flashStrength*_,n.active=_>0,n}const d=s*r,g=hx(e.abdomen,e.shoulder,n.hitHeight);return n.upperPitch=d*(g.upperPitch*f+g.fold),n.upperRoll=-d*g.upperRoll*p,n.upperYaw=d*g.upperYaw*p,n.upperShift=d*g.shift,n.upperShiftX=n.upperShift*p,n.upperShiftZ=n.upperShift*f,n.comShift=d*e.comShift,n.comX=n.comShift*p,n.comZ=n.comShift*f,n.pelvisBack=d*g.back,n.drop=d*g.drop,n.knee=d*g.knee,n.hip=d*g.hip,n.arm=d*g.arm,n.flash=e.flashStrength*r,n}function Rd(i,t){const e=Math.max(0,t.pelvisTiltGain),n=Math.max(0,t.pelvisShift),s=Number.isFinite(i.leanForward)?i.leanForward:0,a=Number.isFinite(i.leanSide)?i.leanSide:0,r=Number.isFinite(i.speedRatio)?Math.max(0,Math.min(1,i.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*n,pelvisZ:s*n,crouch:Math.max(0,t.moveCrouch)*r}}const Kn=1e-6;function os(i,t,e){return i<t?t:i>e?e:i}function ux(i,t,e,n=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=Kn||a<=Kn||!Number.isFinite(i.x)||!Number.isFinite(i.y)||!Number.isFinite(i.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+Kn,l=Math.hypot(i.x,i.y,i.z);if(l<=Kn)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(i.x,-i.y),f=Math.hypot(i.x,i.y),p=i.z,d=Math.hypot(p,f),g=os(d,c,o),_=d>o+Kn||d<c-Kn,m=Math.atan2(-p,Math.max(f,Kn)),u=os((s*s+g*g-a*a)/(2*s*g),-1,1),x=os((a*a+g*g-s*s)/(2*a*g),-1,1),y=Math.acos(u),v=Math.acos(x),L=n>=0?1:-1;return{rootPitch:m-L*y,rootRoll:h,jointPitch:L*(y+v),clamped:_,reach:l/o}}function fx(i,t,e,n){const s=os(e,0,1),a=Math.max(0,n),r=(o,c)=>{const l=os((c-o)*s,-a,a);return o+l};return{rootPitch:r(i.rootPitch,t.rootPitch),rootRoll:r(i.rootRoll,t.rootRoll),jointPitch:r(i.jointPitch,t.jointPitch)}}function Cd(i,t){return{pelvisPos:i.position.clone(),pelvisRotX:i.rotation.x,pelvisRotZ:i.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Qo={active:!1,weight:0,clamped:0,maxError:0};function Pd(i){const{root:t,pelvis:e,lower:n,limbs:s,base:a,cfg:r}=i;if(!r.enabled||r.weight<=0||!i.grounded||s.length===0)return{...Qo};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:n.position.clone(),lowerRotZ:n.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,n.position.copy(a.lowerPos),n.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(d=>d.tip.getWorldPosition(new Z));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,n.position.copy(o.lowerPos),n.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),n.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(i.attacking?Math.max(0,Math.min(1,r.attackScale)):1),h=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let f=0;for(let d=0;d<s.length;d++){const g=s[d],_=n.worldToLocal(c[d].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},u=ux(m,g.upperLen,g.lowerLen,g.bend);u.clamped&&(f+=1);const x=fx({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},u,l,h);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let p=0;for(let d=0;d<s.length;d++){const g=s[d].tip.getWorldPosition(new Z);p=Math.max(p,g.distanceTo(c[d]))}return{active:!0,weight:l,clamped:f,maxError:p}}function Mn(i,t,e){return i<t?t:i>e?e:i}const px={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function mx(i,t,e,n,s,a,r,o,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Me,p=new Me;p.name="pelvis",p.position.y=i.legLength,f.add(p);const d=new Me;d.name="lower";const g=new Me;g.name="upper",p.add(d),p.add(g);const _=[],m=(U,nt,z,it)=>{const rt=new hs({color:it}),E=new re(new hn(U,nt,z),rt);return E.castShadow=!0,E.receiveShadow=!0,_.push(rt),E},u=i.headSize,x=i.legLength,y=i.armLength,v=i.limbThickness,L=i.bodyHeight,w=i.bodyWidth,C=m(w,L,.28,e);C.position.y=L/2,g.add(C);const P=new Me;P.position.y=L,g.add(P);const b=m(u,u,u,e);b.position.y=u/2,P.add(b);for(const U of[-1,1]){const nt=m(.06,.07,.02,t.shoe);nt.position.set(U*.09,u/2+.03,u/2+.011),P.add(nt)}const S=(U,nt)=>{const z=nt?y:x,it=new Me;it.name=nt?U<0?"shoulderL":"shoulderR":U<0?"hipL":"hipR",nt||(it.rotation.order="ZYX"),it.position.set(U*(nt?w/2+v/2:w/2-v/2),nt?L-.04:0,0),(nt?g:d).add(it);const rt=m(v,z/2,v,t.limb);rt.position.y=-z/4,it.add(rt);const E=new Me;E.name=nt?"elbow":"knee",E.position.y=-z/2,it.add(E);const M=m(v,z/2,v,t.limb);if(M.position.y=-z/4,E.add(M),!nt){const V=m(v*1.15,.07,v*1.7,t.shoe);V.position.set(0,-z/2+.035,.045),E.add(V);const K=new de;return K.name="footTip",K.position.y=-z/2,E.add(K),{root:it,joint:E,tip:K}}return{root:it,joint:E}},R=S(-1,!1),T=S(1,!1),D=S(-1,!0),O=S(1,!0),H=[R,T].map(U=>({root:U.root,joint:U.joint,tip:U.tip,upperLen:x/2,lowerLen:x/2,bend:1})),I=new sn({color:s.attackArcColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),X=new re(new Pa(.62,.042,6,20,Math.PI*1.1),I);X.position.set(0,.78-x,.56),g.add(X);const Y=document.createElement("canvas");Y.width=256,Y.height=72;const q=Y.getContext("2d"),et=new B_(Y),mt=new Md({map:et,transparent:!0,depthTest:!1,depthWrite:!1}),vt=new z_(mt);vt.scale.set(1.85,.52,1),vt.position.y=1.7-x,vt.renderOrder=20,g.add(vt);function ft(U){q&&(q.clearRect(0,0,256,72),q.fillStyle=s.labelBg,q.fillRect(0,0,256,72),q.strokeStyle=e,q.lineWidth=5,q.strokeRect(3,3,250,66),q.fillStyle=e,q.font="bold 29px ui-monospace, Menlo, Consolas, monospace",q.textAlign="center",q.textBaseline="middle",q.fillText(`${n} ${px[U]}`,128,38),et.needsUpdate=!0)}const j=new Ot(e),st=new Ot(o.flashColor),ht=new Ot;let pt=null,gt=0,wt=0,Rt=0,It=0,bt=0,Xt=0,F=0,ie={...Qo};return{group:f,update(U,nt){f.position.set(U.position.x,U.position.y,U.position.z),f.rotation.y=U.bodyYaw,P.rotation.y=(U.headYaw-U.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,U.mode!==pt&&(pt=U.mode,ft(U.mode),gt=1),gt=Math.max(0,gt-nt*2.2);const z=U.hurt,it=wd(z,U.bodyYaw,o),rt=it.flash;ht.copy(st).multiplyScalar(rt);for(const lt of _)lt.emissive.copy(j).multiplyScalar(gt*.5),rt>0&&lt.emissive.add(ht);p.position.set(0,x,0),p.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),d.position.set(0,0,0),d.rotation.z=0;const E=Math.hypot(U.velocity.x,U.velocity.z),M=Math.sin(U.bodyYaw),V=Math.cos(U.bodyYaw),K=Math.cos(U.bodyYaw),at=-Math.sin(U.bodyYaw),tt=Ed({phase:U.gaitPhase,speed:E,moveSpeed:a,localForward:U.velocity.x*M+U.velocity.z*V,localRight:U.velocity.x*K+U.velocity.z*at,legLength:i.legLength,stride:U.stride,grounded:!0},r);R.root.rotation.x=tt.legL.pitchX,T.root.rotation.x=tt.legR.pitchX,R.root.rotation.z=tt.legL.rollZ,T.root.rotation.z=tt.legR.rollZ,R.joint.rotation.x=tt.legL.kneeX,T.joint.rotation.x=tt.legR.kneeX,D.root.rotation.x=tt.armL,O.root.rotation.x=tt.armR,D.joint.rotation.x=-.18,O.joint.rotation.x=-.18,p.position.x=tt.pelvisX,p.position.y=x+tt.pelvisY,p.rotation.z=tt.pelvisRoll,g.rotation.z=tt.sideLean*(it.intensity>0?.4:1);const ot=Cd(p,d);if(c){const lt=Math.max(.004166666666666667,Math.min(nt,.1)),Mt=Math.sin(U.bodyYaw),Lt=Math.cos(U.bodyYaw),Ut=Mn((U.velocity.x-wt)/lt,-60,60),Tt=Mn((U.velocity.z-Rt)/lt,-60,60),Gt=Ut*Mt+Tt*Lt,Ft=ln(U.bodyYaw-It)/lt,Zt=c.maxForwardDeg*Math.PI/180,N=c.maxSideDeg*Math.PI/180,B=1-Math.exp(-Math.max(0,c.smoothing)*lt);bt+=(Mn(Gt*c.accelGain,-Zt,Zt)-bt)*B,Xt+=(Mn(-Ft*E*c.turnGain,-N,N)-Xt)*B;const k=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;F+=(Mn(E/Math.max(a,1e-6),0,1)-F)*(1-Math.exp(-Math.max(0,k)*lt));const G=Rd({leanForward:bt,leanSide:Xt,speedRatio:F},c);g.rotation.x+=bt,g.rotation.z+=Xt,p.rotation.x+=G.pelvisPitch,p.rotation.z+=G.pelvisRoll,p.position.x+=G.pelvisX,p.position.z+=G.pelvisZ,p.position.y-=G.crouch;const ct=h.enabled?Mn(h.weight,0,1):0;d.position.y+=G.crouch*(1-ct)}wt=U.velocity.x,Rt=U.velocity.z,It=U.bodyYaw,g.rotation.x+=it.upperPitch,g.rotation.z+=it.upperRoll,g.rotation.y+=it.upperYaw;const ut=Mn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),_t=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Mn(it.upperShiftX*ut,-_t,_t),g.position.z+=Mn(it.upperShiftZ*ut,-_t,_t),p.position.x+=it.comX,p.position.z+=it.comZ-it.pelvisBack,p.position.y-=it.drop;const Nt=it.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(d.position.z+=it.pelvisBack*(1-Nt),d.position.y+=it.drop*(1-Nt),R.joint.rotation.x+=it.knee,T.joint.rotation.x+=it.knee,R.root.rotation.x-=it.hip,T.root.rotation.x-=it.hip,D.root.rotation.x+=it.arm,O.root.rotation.x+=it.arm*.8,U.attackPhase!=="idle"&&it.intensity===0){const lt=U.attackProgress,Mt=lt<.34?-1:lt<.68?-1+(lt-.34)/.34*2:Math.max(0,1-(lt-.68)/.32),Lt=Math.max(0,-Mt),Ut=Math.max(0,Mt);O.root.rotation.x=-1.7*Lt+1.25*Ut,O.joint.rotation.x=-(.25+Lt*.45),g.rotation.y=-.28*Mt,I.opacity=U.attackPhase==="active"?.85:0,U.attackPhase==="active"&&(X.rotation.z=-1.1+lt*3)}else I.opacity=0;ie=Pd({root:f,pelvis:p,lower:d,limbs:H,base:ot,cfg:h,grounded:!0,attacking:U.attackPhase!=="idle"})},ik(){return ie},dispose(){f.traverse(U=>{if(U instanceof re){U.geometry.dispose();const nt=U.material;Array.isArray(nt)?nt.forEach(z=>z.dispose()):nt.dispose()}}),et.dispose(),mt.dispose()}}}function Dd(i){return{x:0,y:0,z:1}}function gx(i){return Math.asin(Dd().y)}function _x(i,t){const e=Math.cos(t),n=Math.sin(t);return{x:i.x*e+i.z*n,y:i.y,z:-0*n+i.z*e}}function Ee(i,t,e){return i<t?t:i>e?e:i}const Pl=1e-6;function ce(i,t,e,n){const s=new re(new hn(i,t,e),new hs({color:n}));return s.castShadow=!0,s.receiveShadow=!0,s}function ge(){return new Me}function la(i,t,e){const n=ge(),s=ce(t*.7,.12,t*.7,e.wood);s.position.y=.06,n.add(s);const a=ce(t*2.4,.045,t*.8,e.metal);a.position.y=.13,n.add(a);const r=ce(t*.38,i,t,e.blade);r.position.y=.13+i/2,n.add(r);const o=ce(t*.42,i*.96,t*.2,e.bladeEdge);o.position.set(0,.13+i/2,t*.5),n.add(o);const c=ce(t*.3,.09,t*.45,e.blade);return c.position.y=.13+i+.045,n.add(c),n}function xx(i){const t=la(.72,.15,i),e=ce(.12,.46,.12,i.wood);return e.position.y=-.3,t.add(e),t}function vx(i){const t=ge(),e=ce(.32,.38,.06,i.metal);e.position.set(0,.02,.1),t.add(e);const n=ce(.11,.11,.045,i.blade);return n.position.set(0,.02,.145),t.add(n),t}function Mx(i){const t=ge(),e=ce(.055,.88,.055,i.wood);e.position.y=.42,t.add(e);const n=ce(.15,.15,.15,i.glow);n.position.y=.92;const s=n.material;return s.emissive=new Ot(i.glow),s.emissiveIntensity=.85,t.add(n),{g:t,orb:n}}function yx(i){const t=ge();for(let n=0;n<5;n++){const s=(n-2)*.15,a=ce(.055,.16,.05,i.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ce(.014,.66,.014,i.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Sx(i){const t=ge(),e=ce(.025,.025,.46,i.wood);e.position.z=.23,t.add(e);const n=ce(.055,.055,.09,i.blade);return n.position.z=.5,t.add(n),t}function bx(i,t,e,n,s,a,r,o,c,l,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},p=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},d=ge(),g=ge();g.name="pelvis",g.position.y=i.legLength,d.add(g);const _=ge();_.name="lower";const m=ge();m.name="upper",g.add(_),g.add(m);const u=i.headSize,x=i.legLength,y=i.armLength,v=i.limbThickness,L=i.bodyHeight,w=i.bodyWidth,C=ce(w,L,.28,t.body);C.position.y=L/2,m.add(C);const P=ge();P.position.y=n.headPivotHeight,m.add(P);const b=ce(u,u,u,t.head);b.position.y=u/2,P.add(b);const S=new hs({color:"#1b2733"});for(const B of[-1,1]){const k=new re(new hn(.06,.07,.02),S);k.position.set(B*.09,u/2+.03,u/2+.011),P.add(k)}const R=B=>{const k=ge();k.name=B<0?"hipL":"hipR",k.rotation.order="ZYX",k.position.set(B*(w/2-v/2),0,0),_.add(k);const G=ce(v,x/2,v,t.limb);G.position.y=-x/4,k.add(G);const ct=ge();ct.name="knee",ct.position.y=-x/2,k.add(ct);const dt=ce(v,x/2,v,t.limb);dt.position.y=-x/4,ct.add(dt);const yt=ce(v*1.15,.07,v*1.7,t.shoe);yt.position.set(0,-x/2+.035,.045),ct.add(yt);const Vt=new de;return Vt.name="footTip",Vt.position.y=-x/2,ct.add(Vt),{root:k,joint:ct,hand:ge(),tip:Vt}},T=B=>{const k=ge();k.name=B<0?"shoulderL":"shoulderR",k.position.set(B*(w/2+v/2),L-.04,0),m.add(k);const G=ce(v,y/2,v,t.limb);G.position.y=-y/4,k.add(G);const ct=ge();ct.name="elbow",ct.position.y=-y/2,k.add(ct);const dt=ce(v,y/2,v,t.limb);dt.position.y=-y/4,ct.add(dt);const yt=ge();yt.position.y=-y/2,ct.add(yt);const Vt=ce(v*1.1,.09,v*1.1,t.head);return Vt.position.y=.045,yt.add(Vt),{root:k,joint:ct,hand:yt}},D=R(-1),O=R(1),H=T(-1),I=T(1),X=[D,O].map(B=>({root:B.root,joint:B.joint,tip:B.tip,upperLen:x/2,lowerLen:x/2,bend:1})),Y=ge(),q=ge();I.hand.add(Y),H.hand.add(q);const et=Mx(t),mt=yx(t),vt=Sx(t),ft={"sword-shield":{right:la(.42,.075,t),left:vx(t)},"dual-swords":{right:la(.42,.075,t),left:la(.42,.075,t)},greatsword:{right:xx(t),left:ce(.12,.2,.12,t.wood)},staff:{right:et.g,left:ge(),orb:et.orb},bow:{right:vt,left:mt.g,arrow:vt,drawString:mt.drawString}};for(const B of Object.keys(ft))Y.add(ft[B].right),q.add(ft[B].left),ft[B].right.visible=!1,ft[B].left.visible=!1;let j=null,st=0,ht=0,pt=0,gt=0,wt=0,Rt=0,It=cx(),bt={...Qo},Xt=0,F=0,ie=0,U=0,nt=0,z=1,it={speed:0,phase:0},rt=0,E=0,M=!0,V=0,K="none",at=0,tt=0,ot=0,ut=.3,_t=0;function Nt(B){const k=Math.PI/180,G=a;let ct=0,dt=0,yt=0,Vt=0;B==="sword-shield"?(ct=G.swordPitchDeg*k,dt=-G.swordYawDeg*k,yt=G.shieldPitchDeg*k):B==="dual-swords"?(ct=G.swordPitchDeg*k,dt=-G.swordYawDeg*k,yt=G.swordPitchDeg*k,Vt=G.swordYawDeg*k):B==="greatsword"?(ct=G.greatswordPitchDeg*k,dt=-G.greatswordYawDeg*k,yt=G.greatswordPitchDeg*k,Vt=G.greatswordYawDeg*k):B==="staff"?ct=G.staffPitchDeg*k:yt=G.bowPitchDeg*k,Y.rotation.set(ct,0,dt),q.rotation.set(yt,0,Vt)}function lt(B){if(B!==j){j=B;for(const k of Object.keys(ft))ft[k].right.visible=k===B,ft[k].left.visible=k===B;Nt(B),mt.drawString.position.z=-.06,vt.position.z=0,et.orb.scale.setScalar(1),m.rotation.y=0}}lt("sword-shield");const Mt=[];d.traverse(B=>{B instanceof re&&B.material instanceof hs&&Mt.push(B.material)});const Lt=new Ot(o.flashColor);function Ut(B,k){const G=wd(B,k,o);It=G,m.rotation.x+=G.upperPitch,m.rotation.z+=G.upperRoll,m.rotation.y+=G.upperYaw;const ct=Ee(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),dt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Ee(G.upperShiftX*ct,-dt,dt),m.position.z+=Ee(G.upperShiftZ*ct,-dt,dt),g.position.x+=G.comX,g.position.z+=G.comZ-G.pelvisBack,g.position.y-=G.drop;const yt=G.legacy?0:Ee(o.lowerScale,0,1);_.position.z+=G.pelvisBack*(1-yt),_.position.y+=G.drop*(1-yt),D.joint.rotation.x+=G.knee,O.joint.rotation.x+=G.knee,D.root.rotation.x-=G.hip,O.root.rotation.x-=G.hip,H.root.rotation.x+=G.arm,I.root.rotation.x+=G.arm*.8;for(const Vt of Mt)Vt.emissive.copy(Lt).multiplyScalar(G.flash)}function Tt(B){return B<.3?-1:B<.62?-1+(B-.3)/.32*2:Math.max(0,1-(B-.62)/.38)}function Gt(B){if(B.phase==="idle"||B.charging)return;const k=B.attackProgress,G=Tt(k),ct=Math.max(0,G),dt=B.comboIndex%2===0?1:-1,yt=c.stride,Vt=Number.isFinite(yt.stepReach)?yt.stepReach:.17,se=Number.isFinite(yt.stepSideReach)?yt.stepSideReach:.14,$t=Number.isFinite(yt.stepDipReach)?yt.stepDipReach:.05,jt=B.weapon==="greatsword"?Ee(Number.isFinite(yt.heavyScale)?yt.heavyScale:1,0,1):1;g.position.z+=Vt*ct*jt,g.position.x+=dt*se*ct*jt,g.position.y-=$t*Math.sin(Math.PI*k)*jt}function Ft(B){if(mt.drawString.position.z=-.06,vt.position.z=0,et.orb.scale.setScalar(1),m.rotation.y=0,B.charging&&B.weapon==="bow"){const dt=B.charge;H.root.rotation.x=-1.25,H.joint.rotation.x=-.15,I.root.rotation.x=.35+dt*.3,I.joint.rotation.x=-1.15,mt.drawString.position.z=-.06-dt*.22,vt.position.z=-dt*.3,m.rotation.y=-.22;return}if(B.phase==="idle")return;const k=Tt(B.attackProgress),G=Math.max(0,-k),ct=Math.max(0,k);if(B.weapon==="bow")H.root.rotation.x=-1.2,H.joint.rotation.x=-.15,I.root.rotation.x=.9-ct*.8,I.joint.rotation.x=-.3;else if(B.weapon==="greatsword"){const dt=-1.6*G+1.25*ct,yt=Ee(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);I.root.rotation.x=dt,I.joint.rotation.x=-(.25+G*.4),H.root.rotation.x=dt+.06,H.joint.rotation.x=-(.32+G*.4),H.root.rotation.z=.38,m.rotation.y=-.2*k*yt}else{const dt=B.comboIndex;if(dt===1)I.root.rotation.x=-1.7*G+1.1*ct,I.joint.rotation.x=-(.2+G*.5),H.root.rotation.x=.1,m.rotation.y=-.18*k;else if(dt===2)H.root.rotation.x=-1.5*G+1*ct,H.joint.rotation.x=-(.2+G*.5),I.root.rotation.x=.2,m.rotation.y=.45*-k;else{const yt=-1.9*G+1.2*ct;H.root.rotation.x=yt,I.root.rotation.x=yt,H.joint.rotation.x=-(.15+G*.4),I.joint.rotation.x=-(.15+G*.4),m.rotation.y=-.3*k}}Gt(B)}function Zt(B,k){B&&(I.root.rotation.x=-1.05,I.joint.rotation.x=-.35,H.root.rotation.x=-.45,H.joint.rotation.x=-.2,m.rotation.y=-.12,et.orb.scale.setScalar(1.25+.12*Math.sin(k*2)))}function N(B){if(!B||B.phase==="idle")return;const k=B.progress,G=k<.3?-.35+k/.3*1.35:k<.7?1:Math.max(0,1-(k-.7)/.3),ct=Math.PI/180;m.rotation.x+=p.leanDeg*ct*G,H.root.rotation.x-=p.shieldPitchDeg*ct*G,H.joint.rotation.x-=.22*G,I.root.rotation.x-=.3*G,g.position.z+=p.pelvisReach*Math.max(0,G)}return{group:d,update(B,k,G,ct,dt=!1,yt,Vt){lt(k.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const se=Math.max(1/240,Math.min(ct,.1)),$t=yt===void 0?rt+=ct:yt;E=$t;const jt=c.landing;jt.enabled?M&&!B.grounded?(K="jump",at=$t,tt=jt.anticipationDuration,ot=Math.max(0,jt.jumpAnticipation),ut=.32):!M&&B.grounded&&(K="land",at=$t,tt=jt.duration,ot=ox(V,jt),ut=jt.compressRatio,_t=V):(K="none",ot=0),$t<at&&(K="none",ot=0),M=B.grounded,V=B.velocity.y;const ue=Cl($t,at,tt,ot,ut),wn=k.phase!=="idle";U=sx(U,wn,se,c.attack.blendRate);const ci=ax(U,c.attack.gaitWeight,c.attack.lowerBodyWeight);nt=ci.attackLegWeight,z=ci.gaitScale;const un=Math.sin(B.bodyYaw),$i=Math.cos(B.bodyYaw),ms=(B.velocity.x-st)/se,gs=(B.velocity.z-ht)/se,li=Ee(ms,-60,60),_s=Ee(gs,-60,60),di=li*un+_s*$i,xs=ln(B.bodyYaw-pt)/se,vs=Math.hypot(B.velocity.x,B.velocity.z),Ms=r.maxForwardDeg*Math.PI/180,ys=r.maxSideDeg*Math.PI/180,Da=Ee(di*r.accelGain,-Ms,Ms),A=Ee(-xs*vs*r.turnGain,-ys,ys),W=1-Math.exp(-r.smoothing*se);gt+=(Da-gt)*W,wt+=(A-wt)*W,st=B.velocity.x,ht=B.velocity.z,pt=B.bodyYaw;const J=Math.hypot(B.velocity.x,B.velocity.z),Q=Math.cos(B.bodyYaw),$=-Math.sin(B.bodyYaw),xt=B.velocity.x*Q+B.velocity.z*$,Et=J>Pl?Ee(xt/J,-1,1):0,Ct=n.hipYawMaxDeg*Math.PI/180,Pt=n.legYawScale*Et*Ct;F+=(Pt-F)*(1-Math.exp(-n.hipYawSmoothing*se));const kt=B.bodyYaw+F;ie=kt;const zt=Math.sin(kt),Dt=Math.cos(kt),Yt=Math.cos(kt),Qt=-Math.sin(kt),te={speed:J,phase:B.gaitPhase,localForward:B.velocity.x*zt+B.velocity.z*Dt,localRight:B.velocity.x*Yt+B.velocity.z*Qt},fe=wn?nx(te,k.attackProgress,k.comboIndex,U,c.stride):te;it=fe;const Kt={phase:fe.phase,speed:fe.speed,moveSpeed:e,localForward:fe.localForward,localRight:fe.localRight,legLength:i.legLength,stride:wn?0:B.stride,grounded:B.grounded},At=rx(Ed(Kt,s),ci.gaitScale);B.grounded?(D.root.rotation.x=At.legL.pitchX,O.root.rotation.x=At.legR.pitchX,D.root.rotation.z=At.legL.rollZ,O.root.rotation.z=At.legR.rollZ,D.joint.rotation.x=At.legL.kneeX,O.joint.rotation.x=At.legR.kneeX,H.root.rotation.x=At.armL,I.root.rotation.x=At.armR,H.joint.rotation.x=-(.18+At.armL*.2),I.joint.rotation.x=-(.18+At.armR*.2),H.root.rotation.z=0,I.root.rotation.z=0,g.position.x=At.pelvisX,g.position.y=x+At.pelvisY,g.rotation.z=At.pelvisRoll):(D.root.rotation.x=-.55,O.root.rotation.x=-.25,D.joint.rotation.x=.75,O.joint.rotation.x=.55,H.root.rotation.x=-.9,I.root.rotation.x=-.7,H.joint.rotation.x=-.6,I.joint.rotation.x=-.6,D.root.rotation.z=0,O.root.rotation.z=0);const We=Cd(g,_),Jt=J/Math.max(e,Pl),Ie=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,Rn=1-Math.exp(-Math.max(0,Ie)*se);Xt+=(Ee(Jt,0,1)-Xt)*Rn;const pe=Rd({leanForward:gt,leanSide:wt,speedRatio:Xt},r);g.rotation.x+=pe.pelvisPitch,g.rotation.z+=pe.pelvisRoll,g.position.x+=pe.pelvisX,g.position.z+=pe.pelvisZ,g.position.y-=pe.crouch;const Vn=f.enabled&&B.grounded?Ee(f.weight,0,1)*(wn?Ee(f.attackScale,0,1):1):0;_.position.y+=pe.crouch*(1-Ee(Vn,0,1)),Ft(k),Zt(dt,B.gaitPhase),N(Vt);const ae=a.greatswordPitchDeg*Math.PI/180,Ue=k.weapon==="greatsword",Cn=Math.hypot(B.velocity.x,B.velocity.z),Je=Ue&&k.phase==="idle"&&Cn>.5?Math.min(1.15,Cn/Math.max(e,.001)*.9):0;Rt+=(Je-Rt)*(1-Math.exp(-6*se)),Ue&&(Y.rotation.x=ae+Rt),k.weapon==="bow"&&(mt.g.rotation.x=-(H.root.rotation.x+H.joint.rotation.x),vt.rotation.x=-(I.root.rotation.x+I.joint.rotation.x));const Qe=m.rotation.y;Ut(G,B.bodyYaw);const Yi=G.type==="none"?1:.4;if(m.rotation.x+=gt*Yi,m.rotation.z+=(wt+At.sideLean)*Yi,ue>0&&(D.root.rotation.x-=jt.hipPitch*ue,O.root.rotation.x-=jt.hipPitch*ue,D.joint.rotation.x+=jt.kneeBend*ue,O.joint.rotation.x+=jt.kneeBend*ue,g.position.y-=jt.crouchDepth*ue,_.position.y+=jt.crouchDepth*(1-jt.lowerScale)*ue,m.rotation.x+=jt.upperPitch*ue,H.root.rotation.x-=jt.armTuck*ue,I.root.rotation.x-=jt.armTuck*ue),nt>0&&B.grounded){const fn=ix(k.attackProgress,k.comboIndex,c.stride),pn=nt;D.root.rotation.x+=fn.legL.pitchX*pn,O.root.rotation.x+=fn.legR.pitchX*pn,D.root.rotation.z+=fn.legL.rollZ*pn,O.root.rotation.z+=fn.legR.rollZ*pn,D.joint.rotation.x+=fn.legL.kneeX*pn,O.joint.rotation.x+=fn.legR.kneeX*pn,g.position.x+=fn.pelvisX*pn,g.position.y+=fn.pelvisY*pn,g.rotation.z+=fn.pelvisRoll*pn}_.rotation.y=F;const Ld=Qe;P.rotation.y=ln(B.headYaw-B.bodyYaw-Ld),bt=Pd({root:d,pelvis:g,lower:_,limbs:X,base:We,cfg:f,grounded:B.grounded,attacking:wn})},lean(){return{forward:gt,side:wt}},landing(){const B=Cl(E,at,tt,ot,ut),k=tt>0?Math.max(0,tt-Math.max(0,E-at)):0;return{pulse:B,remaining:k,kind:B>0?K:"none",impactVy:_t}},hurt(){return It},ik(){return bt},attackBlend(){return U},attackWeights(){return{gaitScale:z,attackLegWeight:nt,driveSpeed:it.speed,stridePhase:it.phase}},hipYaw(){return F},gaitYaw(){return ie},arrowDirection(){vt.updateWorldMatrix(!0,!1);const B=vt.matrixWorld.elements,k=B[8],G=B[9],ct=B[10],dt=Math.hypot(k,G,ct)||1;return{x:k/dt,y:G/dt,z:ct/dt}},dispose(){d.traverse(B=>{if(B instanceof re){B.geometry.dispose();const k=B.material;Array.isArray(k)?k.forEach(G=>G.dispose()):k.dispose()}})}}}function Ex(i,t){switch(i){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function Ax(i,t,e){const n=Math.max(1,i.clientWidth),s=Math.max(1,i.clientHeight),a=new k_({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=Wl,a.setSize(n,s,!1),i.appendChild(a.domElement);const r=new F_;r.background=new Ot("#12161d"),r.add(new G_(11061486,2764600,1.15));const o=new X_(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],h=new Me;for(const z of t.boxes){const it=z.maxX-z.minX,rt=z.maxY-z.minY,E=z.maxZ-z.minZ;let M=Ex(z.kind,e);z.kind==="step"&&(M=new Ot(M).offsetHSL(0,0,z.maxY*.09).getStyle());const V=new hs({color:M,transparent:!0,opacity:1}),K=new re(new hn(it,rt,E),V);K.position.set((z.minX+z.maxX)/2,(z.minY+z.maxY)/2,(z.minZ+z.maxZ)/2),K.castShadow=z.kind!=="ground",K.receiveShadow=!0,K.add(new Sd(new H_(K.geometry),new jo({color:10467020,transparent:!0,opacity:.32}))),h.add(K),l.push(V)}r.add(h);const f=t.gridMeta.maxX-t.gridMeta.minX,p=new Y_(f,f,4873328,3358797);p.position.y=.002,p.visible=e.showGrid,r.add(p);const d=bx(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new Me,_=.9,m=new Me;m.position.y=_,d.group.position.y=-_,m.add(d.group),g.add(m),r.add(g);const u=t.dummies.map((z,it)=>{const rt=e.dummies.colors,E=rt[it%rt.length]??"#cccccc",M=mx(e.voxel,e.colors,E,z.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return M.group.traverse(V=>{V.userData.dummyId=z.id}),r.add(M.group),M}),x=u.map(z=>z.group),y=new $_,v=e.targeting.ringRadius,L=new sn({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:Te,depthWrite:!1}),w=new re(new Ii(v-.07,v,28),L);w.rotation.x=-Math.PI/2,w.position.y=.03,w.visible=!1,r.add(w);const C=new Me;r.add(C);const P=new sn({color:12577023,transparent:!0,opacity:0,side:Te,depthWrite:!1}),b=new Me;b.position.set(0,.95,.72),C.add(b);const S=new Me;S.rotation.x=gx(e.camera.pitchDeg),b.add(S);const R=new re(new Pa(.78,.045,6,24,Math.PI*1.15),P);S.add(R);const T=new Jo(1,0),D=new sn({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),O=Array.from({length:16},()=>{const z=new re(T,D);return z.visible=!1,r.add(z),z}),H=new Ii(.86,1,40),I=Array.from({length:6},()=>{const z=new sn({color:10146047,transparent:!0,opacity:0,side:Te,depthWrite:!1}),it=new re(H,z);return it.rotation.x=-Math.PI/2,it.visible=!1,r.add(it),{mesh:it,mat:z}}),X=new sn({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),Y=new re(new hn(.035,.035,.5),X);C.add(Y);const q=e.dash,et=new Ii(q.ringRadius-.06,q.ringRadius,28),mt=Array.from({length:6},()=>{const z=new sn({color:16777215,transparent:!0,opacity:0,side:Te,depthWrite:!1}),it=new re(et,z);return it.rotation.x=-Math.PI/2,it.visible=!1,r.add(it),{mesh:it,mat:z,life:0,base:1}});function vt(z,it,rt,E,M){const V=mt.find(K=>K.life<=0)??mt[0];V.mat.color.set(E),V.mesh.position.set(z,rt+.04,it),V.base=M,V.mesh.scale.setScalar(M*.6),V.mesh.visible=!0,V.mat.opacity=.9,V.life=q.fxDuration}const ft=e.links,j=new Ii(ft.ringRadius-.07,ft.ringRadius,28),st=Array.from({length:5},()=>{const z=new sn({color:ft.chargeColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),it=new re(j,z);return it.rotation.x=-Math.PI/2,it.visible=!1,r.add(it),{mesh:it,mat:z,life:0,base:1}});function ht(z,it,rt,E){const M=st.find(V=>V.life<=0)??st[0];M.mesh.position.set(z,rt+.05,it),M.base=E,M.mesh.scale.setScalar(E*.55),M.mesh.visible=!0,M.mat.opacity=.85,M.life=ft.fxDuration}let pt=t.playerLink.id,gt=t.playerLink.hitIds.length,wt=t.dash.id,Rt="none",It=0,bt=-1,Xt=1;const F=q_(e.camera,e.smartCamera,e.zoom,n/s),ie=t.character.position;F.update(ie.x,ie.y,ie.z,1,t.camera);function U(z,it){if(x.length===0)return 0;const rt=a.domElement.getBoundingClientRect(),E=new Bt((z-rt.left)/rt.width*2-1,-((it-rt.top)/rt.height)*2+1);y.setFromCamera(E,F.camera);const M=y.intersectObjects(x,!0);for(const V of M){const K=V.object.userData.dummyId;if(K&&K>0)return K}return 0}function nt(z,it,rt){const E=a.domElement.getBoundingClientRect(),M=new Z(z,it,rt).project(F.camera);return{x:E.left+(M.x*.5+.5)*E.width,y:E.top+(-M.y*.5+.5)*E.height}}return{render(z,it){const rt=z.character,E=z.combat;g.position.set(rt.position.x,rt.position.y,rt.position.z),g.rotation.y=rt.bodyYaw;const M=z.dash.phase==="active"&&z.dash.kind==="roll",V=M&&z.dash.duration>0?Math.min(1,1-z.dash.timer/z.dash.duration):0;m.rotation.x=M?V*Math.PI*2:0,m.position.y=_-(M?.2*Math.sin(Math.PI*V):0),d.update(rt,E,z.playerHurt,it,z.abilities.channeling,z.time,z.playerLink);for(let ot=0;ot<u.length;ot++)z.dummies[ot]&&u[ot].update(z.dummies[ot],it);const K=z.targeting.hasTarget?z.dummies[z.targeting.targetId-1]:void 0;if(w.visible=!!K,K&&(w.position.set(K.position.x,K.position.y+.03,K.position.z),w.scale.setScalar(1+.07*Math.sin(z.time*6))),C.position.set(rt.position.x,rt.position.y,rt.position.z),C.rotation.y=E.phase!=="idle"?E.attackFacing:rt.bodyYaw,z.dash.id!==wt){wt=z.dash.id;const ot=z.dash;Rt=ot.kind,ot.kind==="blink"?(vt(ot.fromX,ot.fromZ,rt.position.y,q.blinkColor,.9),vt(ot.toX,ot.toZ,rt.position.y,q.blinkColor,1.35)):vt(ot.fromX,ot.fromZ,rt.position.y,q.rollColor,1.1)}for(const ot of mt){if(ot.life<=0)continue;ot.life-=it;const ut=Math.max(0,ot.life/q.fxDuration);ot.mat.opacity=.9*ut,ot.mesh.scale.setScalar(ot.base*(.6+(1-ut)*1.2)),ot.life<=0&&(ot.mesh.visible=!1)}const at=z.playerLink;at.id!==pt&&(pt=at.id,gt=at.hitIds.length,ht(rt.position.x,rt.position.z,rt.position.y,1)),at.hitIds.length>gt?(gt=at.hitIds.length,ht(rt.position.x,rt.position.z,rt.position.y,1.35)):at.hitIds.length<gt&&(gt=at.hitIds.length);for(const ot of st){if(ot.life<=0)continue;ot.life-=it;const ut=Math.max(0,ot.life/Math.max(ft.fxDuration,1e-6));ot.mat.opacity=.85*ut,ot.mesh.scale.setScalar(ot.base*(.55+(1-ut)*1.1)),ot.life<=0&&(ot.mesh.visible=!1)}E.attackId!==It&&(It=E.attackId,E.weapon==="bow"&&E.phase!=="idle"&&(bt=0,Xt=.6+E.lastCharge*.9));const tt=E.phase==="active"&&E.comboIndex>0;P.opacity=tt?.78:0,tt&&(R.rotation.z=-1.2+E.attackProgress*3.2,R.scale.setScalar(.9+E.comboIndex*.13));for(let ot=0;ot<O.length;ot++){const ut=z.abilities.projectiles[ot],_t=O[ot];_t.visible=!!ut,ut&&(_t.position.set(ut.x,ut.y,ut.z),_t.scale.setScalar(ut.radius),_t.rotation.y+=it*6)}for(let ot=0;ot<I.length;ot++){const ut=z.abilities.rings[ot],_t=I[ot];if(_t.mesh.visible=!!ut,ut){const Nt=Math.max(0,Math.min(1,ut.life/Math.max(ut.duration,1e-6)));_t.mesh.position.set(ut.x,.05,ut.z),_t.mesh.scale.setScalar(ut.radius),_t.mat.opacity=.25+.55*Nt}}if(bt>=0){bt+=it;const ot=bt*14*Xt;Y.position.set(0,.85,.6+ot),X.opacity=ot<9?.95:0,ot>=9&&(bt=-1)}else X.opacity=0;F.update(rt.position.x,rt.position.y,rt.position.z,it,z.camera),a.render(r,F.camera)},resize(){const z=Math.max(1,i.clientWidth),it=Math.max(1,i.clientHeight);a.setSize(z,it,!1),F.resize(z/it)},getGroundBasis(){return F.getGroundBasis()},setCollidersVisible(z){for(const it of l)it.opacity=z?.3:1,it.wireframe=z,it.needsUpdate=!0},setGridVisible(z){p.visible=z},setZoom(z){F.setZoom(z)},pickDummy:U,projectToScreen:nt,diagnostics(){const z=Dd(e.camera.pitchDeg),it=_x(z,C.rotation.y);return{lean:d.lean(),slashNormal:it,arrowForward:d.arrowDirection(),gait:{hipYaw:d.hipYaw(),gaitYaw:d.gaitYaw()},attackBlend:d.attackBlend(),attackWeights:d.attackWeights(),landing:d.landing(),hurt:d.hurt(),ik:d.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:mt.filter(rt=>rt.life>0).length,lastKind:Rt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...F.smart()}}},dispose(){d.dispose();for(const z of u)z.dispose();w.geometry.dispose(),L.dispose(),R.geometry.dispose(),P.dispose(),T.dispose(),D.dispose(),H.dispose();for(const z of I)z.mat.dispose();Y.geometry.dispose(),X.dispose();for(const z of mt)z.mat.dispose();et.dispose();for(const z of st)z.mat.dispose();j.dispose(),h.traverse(z=>{z instanceof re&&z.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}async function Tx(i){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(i),!0}catch{}try{const t=document.createElement("textarea");t.value=i,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,i.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function wx(i,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=i,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),2e3)}function Rx(i,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const n=x=>e.querySelector(`#${x}`),s=n("diag-status"),a=n("diag-text"),r=n("diag-copy"),o=n("diag-json"),c=n("diag-clear"),l=n("diag-toggle"),h=n("diag-close"),f=n("diag-mask");let p=!1,d=!0,g=0;function _(){const x=i.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){p=x,e.hidden=!x,x?_():a.hidden=!0}function u(x){r.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!p)}),h.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),r.addEventListener("click",()=>{const x=i.summary();Tx(x).then(y=>{y?(u("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),u("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=i.dump(),y=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);wx(`harness-${x.meta.version}-${y}.json`,JSON.stringify(x)),u("已导出")}),c.addEventListener("click",()=>{i.clear(),a.hidden=!0,_(),u("已清空")}),l.addEventListener("click",()=>{d=!d,i.setEnabled(d),_()}),{tick(){const x=i.status();t==null||t.classList.toggle("is-alert",x.alert),p&&_()},isOpen:()=>p,close:()=>m(!1)}}const Cx={intents:{...Dl},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function Px(){const i=document.getElementById("app"),t=document.getElementById("hud");if(!i||!t)throw new Error("缺少 #app / #hud 容器");const e=Uh(cu,lu),n=Ax(i,e,Xe),s=Fh(e),a=Lu(t),r=Uu(t,document.getElementById("hint")),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.12 · 11-06 23:19 · 诊断");const c=S=>String(S).padStart(2,"0"),l=new Date,h=iu({meta:{version:"v0.9.12",buildTime:"11-06 23:19",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=Rx(h,o),p=Cu({deadZone:()=>Xe.joystick.deadZone});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const d={timeScale:1,paused:!1,showColliders:Xe.showColliders,showGrid:Xe.showGrid};let g=1;const _=jh({maxRadiusPx:()=>Xe.joystick.maxRadiusPx,deadZone:Xe.joystick.deadZone,getBasis:()=>n.getGroundBasis(),zoom:()=>Xe.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let u=e.combat.weapon;function x(S){if(S===u)return;u=S;const R=si.indexOf(S)+1;for(const T of m)T.classList.toggle("is-active",Number(T.dataset.weapon)===R);L.refreshWeapon()}let y=Cx,v=0;const L=Su(e,Xe,d,{singleStep:()=>s.singleStep(y.intents),reset:()=>{g=1,s.singleStep({...Dl,resetPressed:!0})},resetZoom:()=>{g=1,n.setZoom(1)},onToggleColliders:S=>n.setCollidersVisible(S),onToggleGrid:S=>n.setGridVisible(S)});window.addEventListener("resize",()=>n.resize()),window.__harness={world:e,view:n,clock:s,input:_,viewConfig:Xe,getUserZoom:()=>g,getGestures:()=>y.gestures,getLastGesture:()=>y.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:p,dirAngles:()=>p.last()};let w=performance.now(),C=60,P=0;function b(S){const R=Math.min((S-w)/1e3,.1);w=S,R>0&&(C=C*.9+1/R*.1);const T=_.sample();T.intents.resetPressed&&(g=1),g=Gh(g,T.zoomScale,Xe.zoom.min,Xe.zoom.max),n.setZoom(g);let D=T.intents.dummyClickId;if(T.tap){const I=n.pickDummy(T.tap.x,T.tap.y);I>0&&(D=I)}D>0&&(v=D),y={...T,intents:{...T.intents,dummyClickId:v}};const O=s.frame(R,y.intents,d.timeScale,d.paused,()=>{const I=e.events;for(let X=0;X<I.length;X++)h.event(I[X],e.time)});O>0&&(v=0),h.sample(e,y,R*1e3,O);for(const I of y.gestures)h.gesture(I);S-P>250&&(P=S,f.tick()),x(e.combat.weapon),n.render(e,R),p.update(e,y,n.getGroundBasis());const H=n.diagnostics();a.update(e,C,O,y,d,{attackBlend:H.attackBlend,attackWeights:H.attackWeights,landing:H.landing,hurt:H.hurt,ik:H.ik,zoom:H.camera.zoom},r.hudCompact()),requestAnimationFrame(b)}requestAnimationFrame(b)}Px();

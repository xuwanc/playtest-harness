(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const ai=["sword-shield","dual-swords","greatsword","staff","bow"],Ia=["wander","follow","keep-distance","attack","idle"],Dl={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},ha=1e-6;function Ea(i,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ha?Math.atan2(t.aimX,t.aimZ):i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget?i.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>ha?Math.atan2(t.moveX,t.moveZ):i.character.facing}function Id(i,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ha){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>ha)return{x:t.moveX/e,z:t.moveZ/e};const n=i.character.facing;return{x:Math.sin(n),z:Math.cos(n)}}const Ve=1e-6,Er=Math.PI/180;function Ll(){return{type:"none",timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function wr(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function tc(i,t,e,n,s){i.type=t,i.duration=e,i.timer=e,i.dirX=n,i.dirZ=s,i.knockX=0,i.knockZ=0}function Co(i,t,e){const n=e.duration>0?e.duration:Do(i,e.type);if(t.kind==="player"){const a=i.playerHurt;if(tc(a,e.type,n,e.dirX,e.dirZ),!i.config.hits.noDamageToPlayer&&e.knockback>Ve){const r=e.knockback*i.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}wr(i,"player-hurt",e.sourceId??0,i.character.position);return}const s=i.dummies[t.index];if(s){if(tc(s.hurt,e.type,n,e.dirX,e.dirZ),e.knockback>Ve){const a=e.knockback*i.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}i.hitCount+=1,wr(i,"hit",s.id,s.position)}}function Po(i,t,e){Co(i,{kind:"dummy",index:t},e)}function kd(i,t){const e=[i.playerHurt];for(const s of i.dummies)e.push(s.hurt);const n=Math.exp(-i.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=n,s.knockZ*=n,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function Do(i,t){const e=i.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Ud(i){const t=i.combat,e=i.config.hits,n=i.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Er),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=i.config.dummies.radius,l=i.config.targeting.idealRange;for(const h of i.dummies){const f=h.position.x-n.x,p=h.position.z-n.z,d=Math.hypot(f,p);if(d>s+c)continue;const m=d>Ve?f/d:r,_=d>Ve?p/d:o;if(d>Ve&&(f*r+p*o)/d<a)continue;let g="light";t.weapon==="greatsword"?g="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(g="heavy");const u=e.knockback[t.weapon]??0;let x=d;u>0&&(x=Math.max(d+u,l));const S=Math.max(0,x-d);Po(i,i.dummies.indexOf(h),{type:g,duration:Do(i,g),dirX:m,dirZ:_,knockback:S})}}function Fd(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="active")return;const s=n.weapon===""?void 0:e.moves[n.weapon];if(!s||!s.enabled||!i.modules.hits||!i.modules.dummies)return;const a=s.hit;if(n.pulseTimer-=t,n.pulseTimer>0)return;n.pulseTimer=Math.max(a.pulseInterval,0);const r=i.character.position,o=n.fromX,c=n.fromZ,l=r.x,h=r.z,f=l-o,p=h-c,d=f*f+p*p,m=Math.sin(n.facing),_=Math.cos(n.facing),g=Math.cos(ec(a.arcDeg,0,180)*Er),u=i.config.dummies.radius;for(let x=0;x<i.dummies.length;x++){const S=i.dummies[x];if(n.hitIds.indexOf(S.id)>=0)continue;const v=d>Ve?ec(((S.position.x-o)*f+(S.position.z-c)*p)/d,0,1):0,I=o+f*v,A=c+p*v,P=Math.hypot(S.position.x-I,S.position.z-A);let L=!1;if(a.shape==="circle")L=P<=a.radius+u;else if(a.shape==="capsule")L=P<=Math.max(a.radius,a.width)+u;else{const T=S.position.x-l,D=S.position.z-h,U=Math.hypot(T,D),q=U>Ve?(T*m+D*_)/U>=g:!0;L=U<=a.radius+u&&q||P<=a.width+u}if(!L)continue;const b=S.position.x-o,M=S.position.z-c,R=Math.hypot(b,M);if(R>Ve&&(b*m+M*_)/R<Math.cos(Math.max(a.arcDeg,90)*Er))continue;const Y=R>Ve?b/R:m,z=R>Ve?M/R:_;Co(i,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:Y,dirZ:z,knockback:a.knockback}),n.hitIds.push(S.id),wr(i,"link-hit",S.id,S.position)}}function Nd(i){const t=i.config.hits,e=i.character.position;for(const n of i.events){if(n.type!=="dummy-hit")continue;const s=i.dummies[n.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>Ve?a/o:0,l=o>Ve?r/o:1;Co(i,{kind:"player"},{type:"light",duration:Do(i,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function zd(i,t){if(!i.modules.hits)return;i.events.some(n=>n.type==="attack-active")&&Ud(i),Fd(i,t),Nd(i)}function ec(i,t,e){return i<t?t:i>e?e:i}const ea=1e-6;function ls(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Od(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function Bd(i){const t=i.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function Hd(i){const t=i.abilities,e=i.config.abilities.arcane,n=i.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:n.x+s*r,y:n.y+1,z:n.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,ls(i,"projectile-fire",t.volleyId,o)}function Vd(i,t,e){const n=i.abilities,s=i.config.abilities.arcane,a=i.dash.phase==="active",r=i.playerLink;if(i.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){n.channeling||(n.channeling=!0,n.fireTimer=0,ls(i,"channel-start",0,i.character.position)),n.channelYaw=Ea(i,e),n.fireTimer-=t;let c=0;for(;n.fireTimer<=0&&c++<8;)n.fireTimer+=Math.max(s.fireInterval,ea),Hd(i)}else n.channeling&&(n.channeling=!1,ls(i,"channel-end",0,i.character.position))}function Gd(i,t){const e=i.config.abilities.ring,n=i.dash.phase==="active";if(i.combat.weapon!=="staff"||!t.skill2Pressed||n)return;const s=i.character.position,a={id:++i.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};i.abilities.rings.push(a),ls(i,"ring-place",a.id,s)}function Wd(i,t){const e=i.abilities,n=i.config.abilities.arcane,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],f=h.position.x-o.x,p=h.position.z-o.z,d=o.radius+s;if(!(f*f+p*p>d*d)){Po(i,l,{type:n.hurtType,duration:n.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:n.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function Xd(i,t){const e=i.abilities,n=i.config.abilities.ring,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(n.pulseInterval,ea),a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],f=h.position.x-o.x,p=h.position.z-o.z,d=o.radius+s;if(f*f+p*p>d*d)continue;const m=Math.hypot(f,p),_=m>ea?f/m:0,g=m>ea?p/m:1;Po(i,l,{type:"heavy",duration:n.stun,dirX:_,dirZ:g,knockback:n.knockback})}ls(i,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function $d(i,t,e){Vd(i,t,e),Gd(i,e),Wd(i,t),Xd(i,t)}function ka(i){i.rngState=i.rngState+1831565813>>>0;let t=i.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const nc=1e-6;function ic(i,t,e){return i<t?t:i>e?e:i}function Il(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function kl(i){const t=i.camera,e=Il();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=i.character.position.x,t.centroidZ=i.character.position.z}function Yd(i){const t=i.camera,e=i.config.camera,n=i.character.position;let s=0,a=0,r=0,o=0;for(const l of i.dummies){const h=l.position.x-n.x,f=l.position.z-n.z,p=Math.hypot(h,f);if(p>e.radius)continue;const d=ic((e.radius-p)/Math.max(nc,e.radius-e.nearDistance),0,1);let m=d*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(m+=e.attackBoost*d),s+=m,a+=l.position.x*m,r+=l.position.z*m,o+=1}const c=s<=0?0:ic(s/(s+Math.max(nc,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=n.x,t.centroidZ=n.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,h=r/s;t.centroidX=l,t.centroidZ=h;let f=(l-n.x)*e.framingBias*c,p=(h-n.z)*e.framingBias*c;const d=Math.hypot(f,p);d>e.maxOffset&&(f=f/d*e.maxOffset,p=p/d*e.maxOffset),t.offsetX=f,t.offsetZ=p}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Zd(i){const t=[],e=i.ground.size;t.push(hi("ground","ground",0,0,e,e,-i.ground.thickness,0));for(const n of i.steps)t.push(hi(n.id,"step",n.x,n.z,n.width,n.depth,0,n.height));for(const n of i.doorways){const s=n.openingWidth/2,a=n.wallThickness;t.push(hi(`${n.id}-left`,"wall",n.x-s-n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(hi(`${n.id}-right`,"wall",n.x+s+n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(hi(`${n.id}-lintel`,"lintel",n.x,n.z,n.openingWidth,a,n.openingHeight,n.wallHeight))}for(const n of i.obstacles)t.push(hi(n.id,"obstacle",n.x,n.z,n.width,n.depth,0,n.height));return t}function hi(i,t,e,n,s,a,r,o){return{id:i,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:n-a/2,maxZ:n+a/2}}const En=1e-6;function ua(i,t,e){return i<t?t:i>e?e:i}function Ar(i,t,e,n,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of i)l.maxY>n+a+En||l.maxY<n-r-En||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Lo(i,t,e,n,s){let a=!1;const r=t.y+n;for(let o=0;o<2;o++)for(const c of i){if(c.maxY<=t.y+s+En||c.minY>=r-En)continue;const l=ua(t.x,c.minX,c.maxX),h=ua(t.z,c.minZ,c.maxZ),f=t.x-l,p=t.z-h,d=f*f+p*p;if(!(d>=e*e))if(a=!0,d>En*En){const m=Math.sqrt(d),_=(e-m)/m;t.x+=f*_,t.z+=p*_}else{const m=t.x-c.minX,_=c.maxX-t.x,g=t.z-c.minZ,u=c.maxZ-t.z,x=Math.min(m,_,g,u);x===m?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function Io(i,t,e,n,s){const a=t.y+n;for(const r of i){if(r.maxY<=t.y+s+En||r.minY>=a-En)continue;const o=ua(t.x,r.minX,r.maxX),c=ua(t.z,r.minZ,r.maxZ),l=t.x-o,h=t.z-c;if(l*l+h*h<e*e-En)return!0}return!1}const Tr=1e-6;function dn(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Ua(i,t,e,n){const s=dn(t-i);return i+s*(1-Math.exp(-Math.max(e,Tr)*n))}function sc(i,t,e,n){const s=dn(t-i),a=Math.abs(s);return a<=n||a<=e?t:dn(i+Math.sign(s)*Math.max(e,0))}function qd(i,t,e){const n=i.character,s=i.config.orientation,a=i.combat,r=Math.hypot(e.moveX,e.moveZ),o=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Tr,c=i.abilities.channeling,l=a.charging&&a.weapon==="bow"&&i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget;if(a.phase!=="idle")n.facing=a.attackFacing;else if(o||c)n.facing=Ea(i,e);else if(l)n.facing=i.targeting.targetYaw;else if(r>Math.max(s.facingDeadZone,Tr)){const m=Math.atan2(e.moveX,e.moveZ),_=s.facingTurnRate*Math.PI/180*t,g=s.facingSnapDeg*Math.PI/180;if(r>=.35)n.facing=sc(n.facing,m,_,g);else if(r>=s.facingMinMagnitude&&Math.abs(dn(m-n.facing))>s.facingDeadbandDeg*Math.PI/180){const x=Ua(n.facing,m,s.facingSmoothRate,t);n.facing=sc(n.facing,x,_,0)}}const h=n.velocity;Math.hypot(h.x,h.z)>.15&&(n.moveYaw=Math.atan2(h.x,h.z)),n.bodyYaw=Ua(n.bodyYaw,n.facing,s.bodyTurnRate,t);let f=Ua(n.headYaw,n.facing,s.headTurnRate,t);const p=s.maxHeadTurnDeg*Math.PI/180,d=dn(f-n.bodyYaw);d>p?f=n.bodyYaw+p:d<-p&&(f=n.bodyYaw-p),n.headYaw=f}const Rr=1e-6,jd=Math.PI/180;function Cr(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function ko(i,t,e){return i<t?t:i>e?e:i}function wa(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Pr(i){const t=i.id,e=i.windowId;Object.assign(i,wa()),i.id=t,i.windowId=e}function Kd(i){Pr(i)}function Jd(i){Pr(i.playerLink);for(const t of i.dummies)Pr(t.link)}function Qd(i,t){const e=[i.playerLink];for(const n of i.dummies)e.push(n.link);for(const n of e)n.linkWindow=Math.max(0,n.linkWindow-t),n.cooldown=Math.max(0,n.cooldown-t),n.linkWindow===0&&n.phase==="idle"&&n.source!=="none"&&(n.source="none",n.usedWindowId=-1)}function Dr(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(n.linkWindow=Math.max(n.linkWindow,s),n.source=t,n.windowId+=1,n.usedWindowId=-1,n.prevSprinting=!1)}function fa(i){const t=i.playerLink;if(t.phase==="idle")return;const e=t.id,n=t.windowId;Object.assign(t,wa()),t.id=e,t.windowId=n,t.fromX=i.character.position.x,t.fromZ=i.character.position.z}function th(i,t){const e=i.config.links.search,n=i.character.position,s=ko(e.maxAngleDeg,0,180)*jd;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of i.dummies){const l=c.position.x-n.x,h=c.position.z-n.z,f=Math.hypot(l,h);if(f<Rr||f>e.range)continue;const p=Math.atan2(l,h);Math.abs(dn(p-t))>s||f<o&&(o=f,a=c.id,r=p)}return{id:a,yaw:r,dist:a>0?o:0}}function eh(i,t,e,n){const s=i.config.links,a=i.playerLink,r=i.character.position,o=Ea(i,t),c=th(i,o),l=c.id>0?c.yaw:o,h=c.id>0?ko(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=n,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=h,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,i.dash.cooldown=Math.max(i.dash.cooldown,s.sharedCooldown),Cr(i,"link-start",a.id)}function nh(i,t){const e=i.playerLink;if(e.phase==="idle")return;const n=e.weapon===""?void 0:i.config.links.moves[e.weapon];if(!n){fa(i);return}if(e.weapon!==i.combat.weapon){fa(i);return}e.timer+=t;const s=c=>c==="windup"?n.windup:c==="active"?n.active:n.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Cr(i,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Cr(i,"link-end",e.id))}const r=n.windup+n.active+n.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=n.windup+e.timer:e.phase==="recovery"?o=n.windup+n.active+e.timer:o=r,e.progress=r>0?ko(o/r,0,1):1,e.phase==="active"&&n.active>Rr){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Rr,n.active-e.timer),h=c/l;i.impulse.x=Math.sin(e.facing)*h,i.impulse.z=Math.cos(e.facing)*h}}function ih(i,t,e){const n=i.config.links,s=i.playerLink,a=i.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!n.enabled||!i.modules.links){s.phase!=="idle"&&fa(i);return}const r=i.combat,o=i.character.sprinting;o&&n.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&n.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,n.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&Dr(i,"sprint"),s.prevSprinting=o,nh(i,t);const c=n.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&i.dash.phase==="idle"&&!!c&&c.enabled&&eh(i,e,c,r.weapon)}const Lr=1e-6;function zn(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Ul(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Fl(i){const t=i.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=Ul()}function sh(i){return{weapon:ai[Math.max(0,i-1)]??ai[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:Ul()}}function ah(i,t){return Ea(i,t)}function rh(i,t){const e=i.config.targeting;if(!e.targetAssist||!i.modules.targeting||!i.targeting.hasTarget)return t;const n=i.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*i.config.combat.minLungeScale;return Math.min(Math.max(n,0)+a,s)}function Nl(i,t,e,n){const s=i.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=n,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=ah(i,t),s.attackProgress=0,s.timings=e,s.attackId+=1,zn(i,"attack-start",n)}function zl(i){return Math.max(0,i.config.combat.settle)}function Ir(i,t,e){const n=i.config.combat.weapons[i.combat.weapon];Nl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:zl(i),lunge:rh(i,n.lunge[e-1]??0)},e)}function oh(i,t,e){const n=i.config.combat.bow.release;i.combat.lastCharge=e,Nl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:zl(i),lunge:n.lunge},0),zn(i,"charge-release",e)}function ch(i,t,e){const n=i.combat;if(n.phase==="idle")return;const s=n.timings;n.phaseTimer+=t;let a=0;for(;n.phase!=="idle"&&a++<8;){const c=n.phase==="windup"?s.windup:n.phase==="active"?s.active:n.phase==="recovery"?s.recovery:s.settle;if(n.phaseTimer<c)break;if(n.phaseTimer-=c,n.phase==="windup")n.phase="active",zn(i,"attack-active",n.comboIndex);else if(n.phase==="active")n.phase="recovery";else if(n.phase==="recovery")n.phase="settle",zn(i,"attack-end",n.comboIndex);else if(n.phase="idle",n.phaseTimer=0,n.comboWindow=i.config.combat.comboWindow,n.queued){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Ir(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}if(n.queued&&n.phase==="recovery"){const c=n.timings.recovery;if(c>Lr&&n.phaseTimer>=c*i.config.combat.cancelWindow){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Ir(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;n.phase==="windup"?o=n.phaseTimer:n.phase==="active"?o=s.windup+n.phaseTimer:n.phase==="recovery"?o=s.windup+s.active+n.phaseTimer:n.phase==="settle"&&(o=r),n.phase!=="idle"&&(n.attackProgress=r>0?Math.min(1,o/r):1)}function lh(i,t,e){const n=i.combat,s=i.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ai.length){const c=ai[e.weaponSlot-1];c!==n.weapon&&(n.weapon=c,Fl(i),fa(i),zn(i,"weapon-change",e.weaponSlot))}n.phase==="idle"&&n.comboWindow>0&&(n.comboWindow=Math.max(0,n.comboWindow-t),n.comboWindow===0&&n.comboIndex>0&&(n.comboIndex=0,zn(i,"combo-reset",0))),ch(i,t,e);const a=s.weapons[n.weapon],r=i.dash.phase==="active";if(a.comboCount>0){const c=i.playerLink.phase!=="idle"||i.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(n.phase==="idle"){const h=n.comboWindow>0&&n.comboIndex<a.comboCount?n.comboIndex+1:1;Ir(i,e,h)}else n.queued=!0}else if(n.weapon!=="staff"){if(n.weapon==="bow"&&(!r&&!i.playerLink.consumedAttack&&e.attackPressed&&n.phase==="idle"&&!n.charging&&(n.charging=!0,n.charge=0,zn(i,"charge-start",0)),n.charging&&e.attackHeld&&(n.charge=Math.min(1,n.charge+t/Math.max(s.bow.maxChargeTime,Lr))),n.charging&&!r&&(e.attackReleased||!e.attackHeld))){n.charging=!1;const c=n.charge;n.charge=0,c>=s.bow.minChargeToFire&&n.phase==="idle"?oh(i,e,c):zn(i,"charge-release",0)}}if(!(i.playerLink.phase==="active")&&(i.impulse.x=0,i.impulse.z=0,n.phase==="active"&&n.timings.active>Lr)){const c=n.timings.lunge/n.timings.active;i.impulse.x=Math.sin(n.attackFacing)*c,i.impulse.z=Math.cos(n.attackFacing)*c}}const kr=1e-6;function Fa(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function dh(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function hh(i){const t=i.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=i.character.position.x,t.fromZ=i.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function ac(i,t,e){return i<t?t:i>e?e:i}function uh(i,t,e){const n=i.config.dash,a=i.character.position,r=i.config.worldBounds,o=Math.max(.05,n.blinkStep),c=Math.max(0,n.blinkDistance);let l=0,h=a.x,f=a.z;for(;l<c-kr;){const p=Math.min(c,l+o),d=a.x+t*p,m=a.z+e*p,_=ac(d,r.minX,r.maxX),g=ac(m,r.minZ,r.maxZ),u={x:_,y:a.y,z:g};if(Io(i.boxes,u,i.config.characterRadius,i.config.characterHeight,i.config.stepHeight)||(h=_,f=g,l=p,_!==d||g!==m))break}return{x:h,z:f}}function fh(i,t,e){const n=i.dash,s=i.config.dash;if(n.phase==="active"&&n.timer<=0&&(n.phase="idle",n.timer=0,Dr(i,"roll")),n.cooldown>0){const o=n.cooldown;n.cooldown=Math.max(0,n.cooldown-t),o>0&&n.cooldown===0&&Fa(i,"dash-ready",0)}const a=i.combat;if(e.sprintPressed&&n.cooldown<=0&&n.phase==="idle"&&a.phase==="idle"&&!a.charging&&i.playerLink.phase==="idle"){const o=Id(i,e),c=o.x,l=o.z,h=i.combat.weapon==="staff";if(n.kind=h?"blink":"roll",n.dirX=c,n.dirZ=l,n.fromX=i.character.position.x,n.fromZ=i.character.position.z,n.id+=1,n.cooldown=h?s.blinkCooldown:s.rollCooldown,h){const f=uh(i,c,l);i.character.position.x=f.x,i.character.position.z=f.z,n.toX=f.x,n.toZ=f.z,n.duration=0,n.timer=0,n.phase="idle",s.blinkClearVelocity&&(i.character.velocity.x=0,i.character.velocity.z=0),Dr(i,"blink"),Fa(i,"blink",n.id)}else n.phase="active",n.duration=Math.max(kr,s.rollDuration),n.timer=n.duration,n.toX=n.fromX+c*s.rollDistance,n.toZ=n.fromZ+l*s.rollDistance,Fa(i,"roll",n.id)}if(n.phase==="active"&&n.kind==="roll"){const o=Math.max(kr,n.timer),c=i.character.position.x,l=i.character.position.z;i.impulse.x=(n.toX-c)/o,i.impulse.z=(n.toZ-l)/o}n.phase==="active"&&(n.timer=Math.max(0,n.timer-t))}const Ge=1e-6,Ur=Math.PI*2,ph=7,mh=18;function rc(i,t,e){return i<t?t:i>e?e:i}function gh(i){return Math.atan2(Math.sin(i),Math.cos(i))}function oc(i,t,e,n){return i+gh(t-i)*(1-Math.exp(-Math.max(e,Ge)*n))}function Uo(i,t,e){i.events.push({type:t,tick:i.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function _h(i){const t=[];for(let e=0;e<i.count;e++){const n=i.spawn[e]??{x:0,z:0},s=i.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:n.x,homeZ:n.z,position:{x:n.x,y:0,z:n.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:n.x,targetZ:n.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Ll(),link:wa()})}return t}function xh(i){const t=Ia.indexOf(i);return Ia[(t+1)%Ia.length]}function vh(i){const t=i.config.dummies;for(let e=0;e<i.dummies.length;e++){const n=i.dummies[e],s=t.spawn[e]??{x:n.homeX,z:n.homeZ},a=t.initialModes[e]??n.initialMode;n.mode=a,n.initialMode=a,n.homeX=s.x,n.homeZ=s.z,n.position.x=s.x,n.position.y=0,n.position.z=s.z,n.velocity.x=0,n.velocity.y=0,n.velocity.z=0,n.facing=0,n.bodyYaw=0,n.headYaw=0,n.gaitPhase=0,n.stride=1,n.distance=0,n.targetX=s.x,n.targetZ=s.z,n.wanderTimer=0,n.attackCooldown=0,n.attackPhase="idle",n.attackPhaseTimer=0,n.attackProgress=0;const r=n.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,Kd(n.link)}i.dummyAttackCount=0}function Mh(i,t,e){const n=ka(i)*Ur,s=Math.sqrt(ka(i))*e.wanderRadius;t.targetX=t.homeX+Math.cos(n)*s,t.targetZ=t.homeZ+Math.sin(n)*s,t.wanderTimer=e.wanderInterval*(.6+ka(i)*.8)}function yh(i,t){return i.attackPhase==="windup"?t.attackWindup:i.attackPhase==="active"?t.attackActive:i.attackPhase==="recovery"?t.attackRecovery:0}function Sh(i,t,e,n){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(yh(t,n),Ge);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",Uo(i,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=n.attackWindup+n.attackActive+n.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=n.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=n.attackWindup+n.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function bh(i,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const n=i.character.position,s=n.x-t.position.x,a=n.z-t.position.z,r=Math.hypot(s,a),o=r>Ge?s/r:0,c=r>Ge?a/r:0;let l=0,h=0;if(t.mode==="wander"){const p=t.targetX-t.position.x,d=t.targetZ-t.position.z,m=Math.hypot(p,d);(t.wanderTimer<=0||m<.3)&&Mh(i,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,u=Math.hypot(_,g);u>Ge&&(l=_/u,h=g/u)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,h=c);else if(t.mode==="keep-distance"){const p=r-e.keepDistance;p>e.keepDeadZone?(l=o,h=c):p<-e.keepDeadZone?(l=-o,h=-c):(l=-c*e.keepStrafe,h=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,h=c);let f=t.facing;return t.mode==="wander"?Math.hypot(l,h)>Ge&&(f=Math.atan2(l,h)):r>Ge&&(f=Math.atan2(o,c)),{x:l,z:h,facing:f}}function Eh(i,t,e,n){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const g=i.character.position;Math.hypot(g.x-e.position.x,g.z-e.position.z)<=n.attackRange+Ge&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=n.attackInterval,i.dummyAttackCount+=1,Uo(i,"dummy-attack",e))}Sh(i,e,t,n);const s=bh(i,e,n),a=1-Math.exp(-Math.max(n.acceleration,Ge)*t);e.velocity.x+=(s.x*n.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*n.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=oc(e.bodyYaw,e.facing,ph,t),e.headYaw=oc(e.headYaw,e.facing,mh,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=i.config.stepHeight;Lo(i.boxes,e.position,n.radius,n.height,c)&&Io(i.boxes,e.position,n.radius,n.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const h=i.config.worldBounds;e.position.x=rc(e.position.x,h.minX,h.maxX),e.position.z=rc(e.position.z,h.minZ,h.maxZ);const f=Ar(i.boxes,e.position.x,e.position.z,e.position.y,n.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+Ge&&(e.position.y=f);const p=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=p;const d=Math.hypot(e.velocity.x,e.velocity.z),m=Math.min(i.config.strideSpeedCap,d/Math.max(i.config.moveSpeed,Ge)),_=Math.max(i.config.strideLength*(1+m*i.config.strideSpeedGain),Ge);e.stride=_,e.gaitPhase=(e.gaitPhase+p/_*Ur)%Ur}function wh(i,t,e){const n=i.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=i.dummies.length){const s=i.dummies[e.dummyClickId-1];s.mode=xh(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,Uo(i,"dummy-mode",s)}for(const s of i.dummies)Eh(i,t,s,n)}const ui=1e-6,cc=Math.PI*2;function Na(i,t){return Math.sqrt(i*i+t*t)}function bs(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Ah(i){const t=i.character,e=i.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=i.config.strideLength,t.distance=0,t.coyoteTime=i.config.coyoteTime,t.jumpBuffer=0,Fl(i)}function Th(i,t,e){const n=i.config,s=i.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Na(o,c);l>1&&(o/=l,c/=l);const h=i.combat.phase!=="idle",f=i.playerLink.phase!=="idle",p=h||i.dash.phase==="active"||f;s.sprinting=!p&&e.sprintHeld&&l>ui;const d=n.combat.weapons[i.combat.weapon];let m=d?d.moveMultiplier:1;p?m*=i.combat.phase==="settle"?n.combat.settleMoveScale:n.combat.attackMoveScale:i.combat.charging?m*=n.combat.bow.chargeMoveMultiplier:i.abilities.channeling&&(m*=n.abilities.arcane.moveScale);const _=n.moveSpeed*(s.sprinting?n.sprintMultiplier:1)*m;if(p)r.x=o*_,r.z=c*_;else{const Y=l>ui?n.acceleration:n.friction,z=1-Math.exp(-Y*t);r.x+=(o*_-r.x)*z,r.z+=(c*_-r.z)*z}e.jumpPressed?s.jumpBuffer=n.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?n.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=n.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,bs(i,"jumped",n.jumpSpeed)),i.events.some(Y=>Y.type==="blink"&&Y.tick===i.tick)&&(r.x=0,r.z=0,i.impulse.x=0,i.impulse.z=0);const u=a.x,x=a.z;if(a.x+=(r.x+i.impulse.x+i.playerHurt.knockX)*t,a.z+=(r.z+i.impulse.z+i.playerHurt.knockZ)*t,Lo(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight)){if(Io(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight))a.x=u,a.z=x,r.x=0,r.z=0;else{const Y=a.x-u,z=a.z-x;Math.abs(Y)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(z)<Math.abs(r.z*t)*.5&&(r.z=0)}bs(i,"blocked",1)}const v=n.worldBounds;a.x=lc(a.x,v.minX,v.maxX),a.z=lc(a.z,v.minZ,v.maxZ);const I=Ar(i.boxes,a.x,a.z,a.y,n.characterRadius,n.stepHeight,n.fallTolerance);s.grounded&&I>a.y+ui&&I-a.y<=n.stepHeight+ui&&(a.y=I,r.y=0,bs(i,"stepUp",I));const A=a.y;r.y-=n.gravity*t,a.y+=r.y*t;const P=Ar(i.boxes,a.x,a.z,A,n.characterRadius,n.stepHeight,Number.POSITIVE_INFINITY);P>Number.NEGATIVE_INFINITY&&a.y<=P&&r.y<=0?(a.y=P,r.y=0,s.grounded||bs(i,"landed",P),s.grounded=!0):s.grounded=!1;const L=Na(a.x-u,a.z-x);s.distance+=L;const b=Na(r.x,r.z),M=Math.min(n.strideSpeedCap,b/Math.max(n.moveSpeed,ui)),R=Math.max(n.strideLength*(1+M*n.strideSpeedGain),ui);s.stride=R,s.gaitPhase=(s.gaitPhase+L/R*cc)%cc}function lc(i,t,e){return i<t?t:i>e?e:i}const Rh=1e-6,dc=2.399963229728653;function hc(i,t,e){return i<t?t:i>e?e:i}function uc(i,t,e,n,s,a,r,o,c){const l=t.x-i.x,h=t.z-i.z,f=Math.hypot(l,h),p=e+n;if(f>=p)return;let d,m,_;f<Rh?(d=o,m=c,_=p):(d=l/f,m=h/f,_=p-f);const g=_+r;i.x-=d*g*s,i.z-=m*g*s,t.x+=d*g*a,t.z+=m*g*a}function Ch(i){const t=i.config.separation,e=i.dummies,n=i.character.position,s=i.config.characterRadius,a=i.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let h=0;h<r;h++){for(let f=0;f<e.length;f++)for(let p=f+1;p<e.length;p++){const d=(f*3+p)*dc;uc(e[f].position,e[p].position,a,a,.5,.5,o,Math.cos(d),Math.sin(d))}for(let f=0;f<e.length;f++){const p=(f+1)*dc;uc(n,e[f].position,s,a,0,1,o,Math.cos(p),Math.sin(p))}}const c=i.config.stepHeight,l=i.config.worldBounds;for(const h of e)Lo(i.boxes,h.position,a,i.config.dummies.height,c),h.position.x=hc(h.position.x,l.minX,l.maxX),h.position.z=hc(h.position.z,l.minZ,l.maxZ)}const fc=1e-6,Ph=Math.PI/180;function Dh(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Lh(i,t,e){return i<t?t:i>e?e:i}function Ih(i,t,e){const n=i.config.targeting,s=i.targeting,a=i.character.position;let r=i.character.facing;Math.hypot(e.moveX,e.moveZ)>fc&&(r=Math.atan2(e.moveX,e.moveZ));const c=Lh(n.maxAngleDeg,0,180)*Ph;let l=Number.POSITIVE_INFINITY,h=0,f=0,p=0;for(const d of i.dummies){const m=d.position.x-a.x,_=d.position.z-a.z,g=Math.hypot(m,_);if(g<fc||g>n.range)continue;const u=Math.atan2(m,_),x=Math.abs(dn(u-r));if(x>c)continue;const S=g-n.frontBias*Math.cos(x);S<l&&(l=S,h=d.id,f=u,p=g)}s.targetId=h,s.targetYaw=f,s.targetDist=p,s.hasTarget=h>0}function kh(i,t){return{tick:0,time:0,rngState:2654435769,config:i,boxes:Zd(t),gridMeta:t.grid,character:{position:{x:i.spawn.x,y:i.spawn.y,z:i.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:i.strideLength,distance:0,coyoteTime:i.coyoteTime,jumpBuffer:0},combat:sh(1),playerLink:wa(),abilities:Od(),impulse:{x:0,z:0},targeting:Dh(),playerHurt:Ll(),hitCount:0,dash:{...dh(),fromX:i.spawn.x,fromZ:i.spawn.z,toX:i.spawn.x,toZ:i.spawn.z},camera:{...Il(),centroidX:i.spawn.x,centroidZ:i.spawn.z},dummies:_h(i.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,dummies:!0}}}function Uh(i){Ah(i),vh(i),Jd(i);const t=i.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=i.playerHurt;e.type="none",e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,i.hitCount=0,Bd(i),hh(i),kl(i),i.events.length=0}function pc(i,t,e){if(i.events.length=0,i.tick+=1,i.time+=t,i.impulse.x=0,i.impulse.z=0,e.resetPressed){Uh(i);const n=i.config.spawn;return i.events.push({type:"reset",tick:i.tick,x:n.x,y:n.y,z:n.z,value:0}),i}return i.modules.dummies&&i.modules.targeting?Ih(i,t,e):(i.targeting.targetId=0,i.targeting.targetYaw=0,i.targeting.targetDist=0,i.targeting.hasTarget=!1),ih(i,t,e),i.modules.combat&&lh(i,t,e),i.modules.dash&&fh(i,t,e),i.modules.movement&&Th(i,t,e),i.modules.orientation&&qd(i,t,e),i.modules.dummies&&wh(i,t,e),kd(i,t),Qd(i,t),i.modules.abilities&&$d(i,t,e),i.modules.dummies&&(zd(i,t),i.modules.separation&&Ch(i)),i.modules.camera?Yd(i):kl(i),i}function Fh(i){let t=0;return{frame(e,n,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=i.config.fixedDt,c=i.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const h=l===0?n:{...n,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};pc(i,o,h),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){pc(i,i.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Ol={slopPx:12,longPressMs:450,doubleTapMs:280};function Nh(i,t,e=Ol.slopPx){if(i.distance<e)return{...i,worldX:0,worldZ:0};const n=i.dx/i.distance,s=i.dy/i.distance,a=t.rightX*n+t.forwardX*-s,r=t.rightZ*n+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...i,worldX:0,worldZ:0}:{...i,worldX:a/o,worldZ:r/o}}function Xn(i,t,e,n,s,a){const r=Math.hypot(e,n);return{button:i,kind:t,dx:e,dy:n,distance:r,angleDeg:r>.001?Math.atan2(n,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function zh(i=Ol){const t=new Map,e=new Map,n=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),Xn(s,"press",0,0,0,1)},move(s,a,r,o){const c=n(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY;return!c.dragging&&Math.hypot(l,h)>=i.slopPx?(c.dragging=!0,Xn(c.button,"drag",l,h,o-c.startedAt,1)):null},end(s,a,r,o){const c=n(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY,f=o-c.startedAt,p=Math.hypot(l,h);if(c.dragging||c.longFired||p>=i.slopPx)return Xn(c.button,"release",l,h,f,1);const d=e.get(c.button);return d!==void 0&&o-d.at<=i.doubleTapMs&&Math.hypot(a-d.x,r-d.y)<=i.slopPx*2?(e.delete(c.button),Xn(c.button,"doubleTap",l,h,f,2)):(e.set(c.button,{at:o,x:a,y:r}),Xn(c.button,"tap",l,h,f,1))},cancel(s,a){const r=n(s);return r?(t.delete(s),Xn(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=i.longPressMs)return a.longFired=!0,Xn(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const za=.001,Oh=18;function Fr(i,t,e){return i<t?t:i>e?e:i}function Nr(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Bh(i){const t=i.length;if(t<2)return null;const e=i[t-2],n=i[t-1];return e.id===n.id?null:[e,n]}function Hh(i,t,e,n,s=Oh){const a=Bh(t);if(!a)return{state:Nr(),scale:1,started:!1,ended:i.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(n)?n:1.25),l=1/c,h=c;if(!Number.isFinite(r)||r<za)return{state:{active:!0,lastDist:0,armDist:0,armed:i.armed},scale:1,started:!i.active,ended:!1,armedNow:!1,pinching:i.armed};if(!i.active){const m=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!i.armed)return i.armDist<za?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-i.armDist)<o?{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(i.lastDist<za)return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=r/i.lastDist,p=Math.max(0,Number.isFinite(e)?e:1),d=Number.isFinite(f)&&f>0?Math.pow(f,p):1;return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:Fr(Number.isFinite(d)?d:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Vh(i,t,e,n){const s=Math.min(e,n),a=Math.max(e,n),r=Number.isFinite(t)&&t>0?t:1,o=i*r;return Number.isFinite(o)?Fr(o,s,a):Fr(i,s,a)}function Gh(i,t){const e=Number.isFinite(t)&&t>0?t:1,n=Number.isFinite(i)?i:0;return Math.pow(e,n/100)}function Wh(){const i=typeof window<"u"?window.visualViewport:null;return i?{left:i.offsetLeft,top:i.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Oa=["jump","sprint","reset","attack","skill2"],Xh=8,$h=26,Ba=16,mc=20,gc=140,Yh=18,Zh=16,qh=400,jh=1.0001;function na(i){return i instanceof Element&&i.closest("[data-ui-button], [data-ui-region], #debug-panel, #hud, #weapon-bar, #hint")!==null}function Kh(i,t){if(!Number.isFinite(i)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(i,t);return e instanceof Element&&na(e)}function Jh(i){const{maxRadiusPx:t,deadZone:e,getBasis:n,zoom:s}=i,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,h=0,f=0,p=0,d=-1,m=null,_=null,g=0,u=null,x=0,S=0,v=!1,I=null,A=null,P=0,L=0,b=0,M=0,R=!1,Y=!0,z=-1;const T=zh({slopPx:mc,longPressMs:450,doubleTapMs:350});let D=[],U=null;const q=new Set;function F(C){C&&D.push(C)}const K=new Map;let it=Nr(),ft=!1,ht=1;function xt(){const C=Array.from(K.values()),W=s(),Z=Hh(it,C,W.pinchGain,W.maxStepRatio,Yh);if(it=Z.state,ft=Z.pinching,Z.scale!==1&&(ht*=Z.scale),Z.started||Z.armedNow)u=null,v=!0,I=null;else if(Z.ended&&r===null&&C.length===1){const nt=C[0];r=nt.id,o=nt.x,c=nt.y,l=0,h=0,f=nt.x,p=nt.y,performance.now(),u=null,v=!0,I=null}}const J={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Q={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let ot=0,pt=0;const gt={},St=new Set,Pt=[];function Ut(){for(const C of Oa)gt[C]!==void 0&&(gt[C]=void 0),Zt(C);T.reset(),q.clear(),K.clear(),it=Nr(),ft=!1,r=null,l=0,h=0,f=0,p=0,u=null,v=!1,I=null,A=null,z=-1,b=0,M=0,R=!1,Y=!0}const _t=()=>{document.hidden&&Ut()},Xt=C=>{if(na(C.target)||Kh(C.clientX,C.clientY)){q.add(C.pointerId);return}q.delete(C.pointerId),K.set(C.pointerId,{id:C.pointerId,x:C.clientX,y:C.clientY}),r===null&&!ft&&(r=C.pointerId,o=C.clientX,c=C.clientY,l=0,h=0,f=C.clientX,p=C.clientY,performance.now(),m=typeof C.screenX=="number"&&(C.screenX!==0||C.screenY!==0)?C.screenX:null,_=m===null?null:C.screenY,u=C.pointerId,x=C.clientX,S=C.clientY,v=!1),xt()},N=C=>{if(C.pointerId===A&&(C.pointerType==="mouse"&&C.buttons===0||C.clientX===0&&C.clientY===0&&(P!==0||L!==0)||(Y?(b=C.clientX-P,M=C.clientY-L):(P=C.clientX,L=C.clientY,Y=!0,b=0,M=0))),F(T.move(C.pointerId,C.clientX,C.clientY,performance.now())),!q.has(C.pointerId)&&K.has(C.pointerId)&&(K.set(C.pointerId,{id:C.pointerId,x:C.clientX,y:C.clientY}),xt()),q.has(C.pointerId)||C.pointerId!==r)return;const W=performance.now(),Z=C.clientX,nt=C.clientY;if(Z===0&&nt===0&&(o!==0||c!==0)){g++;return}const mt=Z-f,Rt=nt-p,ct=Math.hypot(mt,Rt),vt=d<0?Number.POSITIVE_INFINITY:W-d,Ct=typeof C.screenX=="number"?C.screenX:0,kt=typeof C.screenY=="number"?C.screenY:0,bt=Ct!==0||kt!==0,zt=bt&&m!==null?Math.hypot(Ct-m,kt-(_??m)):1/0;ct>28&&(vt<200||zt<ct*.4)&&(o+=mt,c+=Rt,g++),f=Z,p=nt,m=bt?Ct:null,_=bt?kt:null,C.pointerId===u&&Math.hypot(C.clientX-x,C.clientY-S)>Xh&&(v=!0);let Yt=Z-o,O=nt-c;const B=Math.hypot(Yt,O),k=a();B>k&&(Yt*=k/B,O*=k/B),l=Yt,h=O};function Zt(C){if(!J[C])return;J[C]=!1,C==="attack"&&(Q.attackReleased=!0);const W=document.getElementById(`btn-${C}`);W==null||W.classList.remove("is-down")}const lt=C=>{const W=K.delete(C.pointerId),Z=q.delete(C.pointerId);W&&xt(),C.pointerId===A&&(A=null,R?z=performance.now():(b=0,M=0,z=-1)),F(T.end(C.pointerId,C.clientX,C.clientY,performance.now()));for(const nt of Oa)gt[nt]===C.pointerId&&(gt[nt]=void 0,Zt(nt));Z||(C.pointerId===u&&(!v&&!na(C.target)&&(I={x:C.clientX,y:C.clientY}),u=null),C.pointerId===r&&(r=null,l=0,h=0,f=0,p=0,m=null,_=null))};for(const C of Oa){const W=document.getElementById(`btn-${C}`);if(!W)continue;const Z=C==="attack"||C==="skill2",nt=Rt=>{if(Rt.preventDefault(),gt[C]===void 0){gt[C]=Rt.pointerId,J[C]=!0,C==="jump"&&(Q.jump=!0),C==="reset"&&(Q.reset=!0),C==="sprint"&&(Q.sprintPressed=!0),C==="attack"&&(Q.attackPressed=!0),C==="skill2"&&(Q.skill2=!0),W.classList.add("is-down"),F(T.begin(C,Rt.pointerId,Rt.clientX,Rt.clientY,performance.now()));try{W.setPointerCapture(Rt.pointerId)}catch{}Z&&(A=Rt.pointerId,P=Rt.clientX,L=Rt.clientY,Y=!(Rt.clientX===0&&Rt.clientY===0),b=0,M=0,R=!1,z=-1)}},rt=Rt=>{gt[C]===Rt.pointerId&&(gt[C]=void 0,Zt(C),F(T.end(Rt.pointerId,Rt.clientX,Rt.clientY,performance.now())))},mt=Rt=>{gt[C]===Rt.pointerId&&(gt[C]=void 0,Zt(C),F(T.cancel(Rt.pointerId,performance.now())))};W.addEventListener("pointerdown",nt),W.addEventListener("pointerup",rt),W.addEventListener("pointercancel",mt),Pt.push(()=>{W.removeEventListener("pointerdown",nt),W.removeEventListener("pointerup",rt),W.removeEventListener("pointercancel",mt)})}const Tt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const C of Tt){const W=Z=>{Z.preventDefault(),ot=Number(C.dataset.weapon)||0};C.addEventListener("pointerdown",W),Pt.push(()=>C.removeEventListener("pointerdown",W))}const j=C=>{const W=C.key.toLowerCase();if((W===" "||W.startsWith("arrow"))&&C.preventDefault(),St.has(W))return;St.add(W),W===" "&&(Q.jump=!0),W==="r"&&(Q.reset=!0),W==="shift"&&(Q.sprintPressed=!0),W==="j"&&(Q.attackPressed=!0),W==="k"&&(Q.skill2=!0),W>="1"&&W<="5"&&(ot=Number(W)),W>="6"&&W<="9"&&(pt=Number(W)-5);const Z=Math.max(jh,s().keyStep||1.12);(W==="="||W==="+")&&(ht*=Z),(W==="-"||W==="_")&&(ht/=Z)},at=C=>{const W=C.key.toLowerCase();St.has(W)&&(St.delete(W),W==="j"&&(Q.attackReleased=!0))},ut=C=>{if(na(C.target))return;C.preventDefault();const W=C.deltaMode===1?C.deltaY*Zh:C.deltaMode===2?C.deltaY*qh:C.deltaY;ht*=Gh(W,s().wheelStep)},w=C=>{C.preventDefault()},y=()=>{d=performance.now()};window.addEventListener("resize",y),window.addEventListener("orientationchange",y);const H=typeof window<"u"?window.visualViewport:null;return H&&(H.addEventListener("resize",y),H.addEventListener("scroll",y)),window.addEventListener("pointerdown",Xt),window.addEventListener("pointermove",N),window.addEventListener("pointerup",lt),window.addEventListener("pointercancel",lt),window.addEventListener("blur",Ut),document.addEventListener("visibilitychange",_t),window.addEventListener("keydown",j),window.addEventListener("keyup",at),window.addEventListener("wheel",ut,{passive:!1}),window.addEventListener("gesturestart",w),{peekStick(){return{id:r,held:r!==null,originX:o,originY:c,x:f,y:p,dx:f-o,dy:p-c,radius:a(),badMoves:g}},peekAim(){const C=performance.now(),W=Math.hypot(b,M),Z=A!==null||z>=0&&C-z<gc;if(!(Z&&R&&W>=Ba))return{active:!1,holding:Z,x:0,z:0,dx:b,dy:M};const rt=n(),mt=b/W,Rt=M/W,ct=rt.rightX*mt+rt.forwardX*-Rt,vt=rt.rightZ*mt+rt.forwardZ*-Rt,Ct=Math.hypot(ct,vt)||1;return{active:!0,holding:Z,x:ct/Ct,z:vt/Ct,dx:b,dy:M}},sample(){var te;const C=a();let W=r!==null?Math.max(-1,Math.min(1,l/C)):0,Z=r!==null?Math.max(-1,Math.min(1,h/C)):0,nt=0,rt=0;(St.has("a")||St.has("arrowleft"))&&(nt-=1),(St.has("d")||St.has("arrowright"))&&(nt+=1),(St.has("w")||St.has("arrowup"))&&(rt-=1),(St.has("s")||St.has("arrowdown"))&&(rt+=1),W+=nt,Z+=rt;let mt=Math.hypot(W,Z);mt>1&&(W/=mt,Z/=mt,mt=1);const Rt=W,ct=Z;mt<e&&(W=0,Z=0);const vt=n();let Ct=vt.rightX*W+vt.forwardX*-Z,kt=vt.rightZ*W+vt.forwardZ*-Z;const bt=Math.hypot(Ct,kt);bt>1&&(Ct/=bt,kt/=bt);const zt=performance.now();F(T.poll(zt));const Ft=Math.hypot(b,M);A!==null&&(Ft>=$h?R=!0:Ft<Ba&&(R=!1));const Yt=A!==null||z>=0&&zt-z<gc,O=Yt&&R&&Ft>=Ba;let B=0,k=0;if(O){const Vt=b/Ft,qt=M/Ft,ce=vt.rightX*Vt+vt.forwardX*-qt,We=vt.rightZ*Vt+vt.forwardZ*-qt,fn=Math.hypot(ce,We)||1;B=ce/fn,k=We/fn}!Yt&&A===null&&(b=0,M=0,z=-1,R=!1);const V=I;I=null;const st=ht;ht=1;const dt={moveX:Ct,moveZ:kt,jumpPressed:Q.jump,sprintHeld:J.sprint||St.has("shift"),sprintPressed:Q.sprintPressed,resetPressed:Q.reset,attackPressed:Q.attackPressed,attackHeld:J.attack||St.has("j"),attackReleased:Q.attackReleased,skill2Pressed:Q.skill2,weaponSlot:ot,dummyClickId:pt,aimX:B,aimZ:k,aimActive:O};Q.jump=!1,Q.reset=!1,Q.sprintPressed=!1,Q.attackPressed=!1,Q.attackReleased=!1,Q.skill2=!1,ot=0,pt=0;const yt=D.map(Vt=>Nh(Vt,vt,mc));D=[],yt.length>0&&(U=yt[yt.length-1]);const Ht=r!==null?"pointer":St.size>0?"keyboard":"idle";return{intents:dt,stickX:W,stickY:Z,stickRawX:Rt,stickRawY:ct,stickHeld:r!==null,stickId:r,stickOriginX:o,stickOriginY:c,stickPxX:f,stickPxY:p,stickBad:g,stickVpTop:((te=Wh())==null?void 0:te.top)??0,stickVpAge:d<0?-1:Math.round(performance.now()-d),aimDX:b,aimDY:M,source:Ht,tap:V,zoomScale:st,gestures:yt,lastGesture:U}},dispose(){window.removeEventListener("pointerdown",Xt),window.removeEventListener("pointermove",N),window.removeEventListener("pointerup",lt),window.removeEventListener("pointercancel",lt),window.removeEventListener("blur",Ut),document.removeEventListener("visibilitychange",_t),window.removeEventListener("keydown",j),window.removeEventListener("keyup",at),window.removeEventListener("wheel",ut),window.removeEventListener("resize",y),window.removeEventListener("orientationchange",y),H&&(H.removeEventListener("resize",y),H.removeEventListener("scroll",y)),window.removeEventListener("gesturestart",w),T.reset();for(const C of Pt)C()}}}const pa=1,ma=2,ga=4,Bl=8,_a=16,os=32,Hl=64,Vl=128,Qh=[[pa,"atk"],[ma,"dash"],[ga,"link"],[Bl,"air"],[_a,"hurt"],[os,"aim"],[Hl,"spr"],[Vl,"chan"]];function fi(i){if(i===0)return"-";const t=Qh.filter(([e])=>(i&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const tu=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt"],eu=0,nu=15,Ha=19,iu=21,su=22,au=23,ru=24,nn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Ce=i=>Number.isFinite(i)?Math.round(i*1e3)/1e3:0,$e=i=>Math.round(i*180/Math.PI*10)/10,Va=Math.PI*2;function Zi(i){let t=i%Va;return t>Math.PI&&(t-=Va),t<-Math.PI&&(t+=Va),t}function ou(i,t){let e=0;return i.combat.phase!=="idle"&&(e|=pa),i.dash.phase!=="idle"&&(e|=ma),i.playerLink.phase!=="idle"&&(e|=ga),i.character.grounded||(e|=Bl),i.playerHurt.type!=="none"&&(e|=_a),t.intents.aimActive&&(e|=os),i.character.sprinting&&(e|=Hl),i.abilities.channeling&&(e|=Vl),e}function cu(i){const t=`(${i.x.toFixed(1)},${i.z.toFixed(1)})`;switch(i.type){case"attack-start":return`slot${i.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${i.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${i.value} ${t}`;case"weapon-change":return`slot${i.value}`;case"dummy-mode":return`dummy${i.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return i.value!==0?`v${i.value}`:""}}function lu(i){const t={sampleHz:i.sampleHz??nn.sampleHz,sampleCapacity:i.sampleCapacity??nn.sampleCapacity,eventCapacity:i.eventCapacity??nn.eventCapacity,anomalyCapacity:i.anomalyCapacity??nn.anomalyCapacity,dirJumpDeg:i.dirJumpDeg??nn.dirJumpDeg,aimDropDeg:i.aimDropDeg??nn.aimDropDeg,freezeMs:i.freezeMs??nn.freezeMs,freezeSpeed:i.freezeSpeed??nn.freezeSpeed,stickLostMs:i.stickLostMs??nn.stickLostMs,spikeMs:i.spikeMs??nn.spikeMs},e=i.meta,n=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0};let o=!0,c=-1,l=-1e9,h=null,f=0,p=0,d="",m=-1,_=-1,g=-1,u=0,x=-1e9,S=-1,v={},I=null,A=0,P=0,L=0;function b(T,D){const U=1/t.sampleHz,q=T[eu];q-l<U-1e-6||(n.length>=t.sampleCapacity&&n.shift(),n.push(T),l=q)}function M(T,D,U,q,F,K){const it=v[T]??-1e9;if(D-it<1.2)return;if(v[T]=D,T==="frameSpike"){let ht=0;for(const xt of a)xt.kind==="frameSpike"&&ht++;if(ht>=6)return}a.length>=t.anomalyCapacity&&a.shift();let ft=n.slice(-7);K&&(ft.length===0||ft[ft.length-1]!==K)&&(ft=[...ft.slice(-6),K]),a.push({kind:T,t:Ce(D),tick:U,ms:Math.round(q),detail:F,ctx:ft}),T==="dirJump"?r.dirJumps++:T==="aimDrop"?r.aimDrops++:T==="moveFreeze"?r.freezes++:T==="stickLost"?r.stickLosts++:T==="stickJump"?r.stickJumps++:T==="stickBad"&&r.stickBads++}function R(T,D,U,q){s.length>=t.eventCapacity&&s.shift(),s.push({t:Ce(U),tick:q,k:T,d:D})}function Y(T){switch(T.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=T.tick;break}}function z(){const T=r,D=T.wallMs/1e3,U=T.gestures,q=K=>Object.entries(U).filter(([it])=>it.endsWith(`.${K}`)).reduce((it,[,ft])=>it+ft,0),F=[];if(F.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),F.push(`运行 ${D.toFixed(1)}s / ${T.frames} 帧 · ${T.fps.toFixed(1)}fps · 最大 ${T.dtMax.toFixed(0)}ms · 尖峰 ${T.spikes} · 步 ${T.steps}`),F.push(`摇杆活跃 ${D>0?Math.round(T.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${q("press")}（单击 ${q("tap")} / 双击 ${q("doubleTap")} / 拖拽 ${q("drag")} / 长按 ${q("longPress")} / 打断 ${q("cancel")} / 拖放 ${q("release")}）`),F.push(`攻击 ${T.attacks}(中${T.hits}) · 受击 ${T.hurts} · 派生 ${T.links}(中${T.linkHits}) · 翻滚 ${T.rolls} 闪现 ${T.blinks} · 跳 ${T.jumps} · 复位 ${T.resets}`),F.push(`法杖 引导${T.channels} 飞弹${T.bolts} 电环${T.rings} · 弓蓄力${T.bowCharges} · 当前武器 ${d||"-"}`),F.push(`异常 ${T.dirJumps+T.aimDrops+T.freezes+T.stickLosts+T.stickJumps+T.stickBads}（dir ${T.dirJumps} / aim ${T.aimDrops} / freeze ${T.freezes} / stick ${T.stickLosts} / stickJump ${T.stickJumps} / 坏指针 ${T.stickBads}） · 掉帧尖峰 ${T.spikes}`+(T.inTurns>0?` · 输入转向 ${T.inTurns} 次（最大 ${T.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const K of a.slice(-6)){F.push(`· ${K.kind} @t${K.t.toFixed(2)} tick${K.tick} ${K.ms>0?`${K.ms}ms `:""}${K.detail}`);const it=K.ctx.map(ht=>String(ht[nu])).join(" "),ft=K.ctx.map(ht=>ht[Ha]===""||ht[Ha]==null?".":String(ht[Ha])).join(" ");if(F.push(`  yaw ${it}`),F.push(`  in  ${ft}`),K.kind==="stickJump"||K.kind==="stickBad"||K.kind==="stickLost"){const ht=K.ctx.map(J=>`${J[iu]},${J[su]}`).join(" "),xt=K.ctx.map(J=>`${J[au]},${J[ru]}`).join(" ");F.push(`  o   ${ht}`),F.push(`  p   ${xt}`)}}if(s.length>0){F.push("最近事件：");for(const K of s.slice(-12))F.push(`  ${K.t.toFixed(2)} ${K.k} ${K.d}`.trimEnd())}return F.push(`UA ${e.ua}`),F.join(`
`)}return{sample(T,D,U,q=0){r.frames++,r.steps+=q,r.wallMs+=U,U>r.dtMax&&(r.dtMax=U),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=T.time;const F=T.time;if(c<0&&(c=F),P=F,L=T.tick,!o)return;const K=T.character,it=Math.hypot(D.stickX,D.stickY),ft=Math.hypot(K.velocity.x,K.velocity.z);d=T.combat.weapon;const ht=ou(T,D),xt=K.facing,Q=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;it>.2&&(r.stickActiveMs+=U);const ot=[Ce(F),T.tick,Math.round(U*10)/10,Ce(D.stickX),Ce(D.stickY),Ce(D.stickRawX),Ce(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),Ce(D.intents.moveX),Ce(D.intents.moveZ),Ce(K.position.x),Ce(K.position.z),Ce(K.velocity.x),Ce(K.velocity.z),$e(xt),$e(K.bodyYaw),ht,Ce(K.stride),Q===null?"":$e(Q),D.stickId===null?"":D.stickId,Math.round(D.stickOriginX),Math.round(D.stickOriginY),Math.round(D.stickPxX),Math.round(D.stickPxY),D.stickBad,Math.round(D.stickVpTop)];b(ot);const pt=F*1e3<S;if(U>t.spikeMs&&!pt&&F-c>.6&&(r.spikes++,M("frameSpike",F,T.tick,U,`dt ${U.toFixed(0)}ms fl=${fi(ht)}`,ot)),h!==null&&!pt){const _t=Math.abs($e(Zi(xt-h))),Xt=Math.abs($e(Zi(K.moveYaw-f))),N=(p|ht)&(pa|ma|ga|_a)|ht&os,Zt=Q===null?null:Math.abs($e(Zi(xt-Q))),lt=Q===null||h===null?null:Math.abs($e(Zi(h-Q))),Tt=Zt!==null&&lt!==null&&Zt<lt-.5,j=(p&os)!==0&&(ht&os)===0&&Q===null,at=Zt!==null&&(Zt<=12||Tt);_t>t.aimDropDeg&&j?M("aimDrop",F,T.tick,0,`${_t.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${fi(ht)}`,ot):_t>t.dirJumpDeg&&N===0&&!j&&(at?(r.inTurns++,_t>r.inTurnMax&&(r.inTurnMax=_t)):M("dirJump",F,T.tick,0,`${_t.toFixed(0)}° res${Zt===null?" 无输入":`${Zt.toFixed(0)}°`} yaw ${$e(h)}→${$e(xt)} in ${Q===null?".":$e(Q)}° mvΔ${Xt.toFixed(0)}° aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${fi(p)}→${fi(ht)}`,ot))}const gt=(ht&(pa|ma|ga|_a))!==0,St=T.tick-x<30;it>.35&&ft<t.freezeSpeed&&!gt&&!St?(m<0&&(m=F),F-m>=t.freezeMs/1e3&&F>=_&&(M("moveFreeze",F,T.tick,(F-m)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${ft.toFixed(2)} ${D.source} fl=${fi(ht)}`,ot),_=F+1.5,m=-1)):m=-1,D.stickHeld?(it>u&&(u=it),u>.35&&it<.06?(g<0&&(g=F),F-g>=t.stickLostMs/1e3&&(M("stickLost",F,T.tick,(F-g)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${u.toFixed(2)} fl=${fi(ht)}`,ot),g=-1,u=0)):g=-1):(u=0,g=-1);const Pt=D.stickPxX-D.stickOriginX,Ut=D.stickPxY-D.stickOriginY;if(D.stickHeld&&D.stickId!==null){const _t=I;if(_t&&_t.held&&_t.id===D.stickId){const Xt=Math.hypot(_t.dx,_t.dy),N=Math.hypot(Pt,Ut),Zt=Math.max(Xt,N),lt=Math.hypot(D.stickPxX-_t.x,D.stickPxY-_t.y),Tt=Math.abs($e(Zi(Math.atan2(Ut,Pt)-Math.atan2(_t.dy,_t.dx)))),j=Zt*Tt*Math.PI/180,at=Math.hypot(D.stickOriginX-_t.ox,D.stickOriginY-_t.oy);Zt>18&&Tt>35&&lt<Math.max(5,j*.35)&&M("stickJump",F,T.tick,0,`Δ${Tt.toFixed(0)}° 手指只动${lt.toFixed(0)}px(弧长应${j.toFixed(0)}px) o(${Math.round(_t.ox)},${Math.round(_t.oy)})→(${Math.round(D.stickOriginX)},${Math.round(D.stickOriginY)}) 原点位移${at.toFixed(0)}px p(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) raw(${Math.round(Pt)},${Math.round(Ut)}) id${D.stickId} vvt${Math.round(D.stickVpTop)}`,ot)}I={id:D.stickId,ox:D.stickOriginX,oy:D.stickOriginY,x:D.stickPxX,y:D.stickPxY,dx:Pt,dy:Ut,held:!0}}else I=null;if(D.stickBad>A){const _t=D.stickBad-A;M("stickBad",F,T.tick,0,`拦截 ${_t} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${D.stickBad}）o(${Math.round(D.stickOriginX)},${Math.round(D.stickOriginY)}) p(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) id${D.stickId??"-"}`,ot)}A=D.stickBad,h=xt,f=K.moveYaw,p=ht},event(T,D){const U=cu(T);Y(T),o&&(T.type==="dash-ready"||T.type==="combo-reset"||T.type==="stepUp"||R(T.type,U,D,T.tick))},gesture(T){const D=`${T.button}.${T.kind}`;r.gestures[D]=(r.gestures[D]??0)+1,o&&(T.kind==="longPress"||T.kind==="doubleTap"||T.kind==="drag"||T.kind==="cancel")&&R(`g:${T.kind}`,`${T.button} ${T.heldMs.toFixed(0)}ms d${T.distance.toFixed(0)}px ${T.angleDeg.toFixed(0)}°`,P,L)},suspend(T){S=P*1e3+T,m=-1,g=-1},setEnabled(T){o=T,T||(h=null,I=null,m=-1,g=-1)},clear(){n.length=0,s.length=0,a.length=0,v={},l=-1e9,h=null,p=0,m=-1,g=-1,u=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0,r.stickJumps=0,r.stickBads=0,I=null,A=0;for(const T of Object.keys(r.gestures))delete r.gestures[T]},status(){const T=r.simS,D=a.some(U=>T-U.t<8&&(U.kind==="dirJump"||U.kind==="aimDrop"||U.kind==="moveFreeze"||U.kind==="stickLost"||U.kind==="stickJump"||U.kind==="stickBad"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:D,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:tu,samples:n.slice(),events:s.slice(),anomalies:a.slice()}},summary:z}}const du={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},hu={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},uu={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},fu={core:du,scene:hu,view:uu};function Fo(i){return JSON.parse(JSON.stringify(i))}const No=fu,pu=Fo(No.core),mu=Fo(No.scene),Ye=Fo(No.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class ln{constructor(t,e,n,s,a="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),ln.nextNameID=ln.nextNameID||0,this.$name.id=`lil-gui-name-${++ln.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class gu extends ln{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function zr(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const _u={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:zr,toHexString:zr},ds={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},xu={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=ds.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return ds.toHexString(s)}},vu={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=ds.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return ds.toHexString(s)}},Mu=[_u,ds,xu,vu];function yu(i){return Mu.find(t=>t.match(i))}class Su extends ln{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=yu(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=zr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Ga extends ln{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class bu extends ln{constructor(t,e,n,s,a,r){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},n=x=>{const S=parseFloat(this.$input.value);isNaN(S)||(this._snapClampSetValue(S+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),n(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,h,f;const p=5,d=x=>{o=x.clientX,c=l=x.clientY,r=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=x=>{if(r){const S=x.clientX-o,v=x.clientY-c;Math.abs(v)>p?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(S)>p&&_()}if(!r){const S=x.clientY-l;f-=S*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},u=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",u)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(u,x,S,v,I)=>(u-x)/(S-x)*(I-v)+v,e=u=>{const x=this.$slider.getBoundingClientRect();let S=t(u,x.left,x.right,this._min,this._max);this._snapClampSetValue(S)},n=u=>{this._setDraggingStyle(!0),e(u.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=u=>{e(u.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=u=>{u.preventDefault(),this._setDraggingStyle(!0),e(u.touches[0].clientX),r=!1},h=u=>{u.touches.length>1||(this._hasScrollBar?(o=u.touches[0].clientX,c=u.touches[0].clientY,r=!0):l(u),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",p))},f=u=>{if(r){const x=u.touches[0].clientX-o,S=u.touches[0].clientY-c;Math.abs(x)>Math.abs(S)?l(u):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p))}else u.preventDefault(),e(u.touches[0].clientX)},p=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p)},d=this._callOnFinishChange.bind(this),m=400;let _;const g=u=>{if(Math.abs(u.deltaX)<Math.abs(u.deltaY)&&this._hasScrollBar)return;u.preventDefault();const S=this._normalizeMouseWheel(u)*this._step;this._snapClampSetValue(this.getValue()+S),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(d,m)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Eu extends ln{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class wu extends ln{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Au=`.lil-gui {
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
}`;function Tu(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let _c=!1;class xa{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!_c&&o&&(Tu(Au),_c=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,a){if(Object(n)===n)return new Eu(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new bu(this,t,e,n,s,a);case"boolean":return new gu(this,t,e);case"string":return new wu(this,t,e);case"function":return new Ga(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new Su(this,t,e,n)}addFolder(t){const e=new xa({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof Ga||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof Ga)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Ru(i,t,e,n){const s=document.getElementById("debug-panel"),a=s?new xa({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new xa({title:"实验台 · 调试面板"}),r=a.addFolder("模拟");r.add(e,"timeScale",0,3,.05).name("时间缩放"),r.add(e,"paused").name("暂停"),r.add({step:n.singleStep},"step").name("单步 (1 tick)"),r.add({reset:n.reset},"reset").name("复位全部");const o=a.addFolder("模块");o.add(i.modules,"movement").name("movement"),o.add(i.modules,"combat").name("combat"),o.add(i.modules,"links").name("links"),o.add(i.modules,"orientation").name("orientation"),o.add(i.modules,"targeting").name("targeting"),o.add(i.modules,"hits").name("hits"),o.add(i.modules,"separation").name("separation"),o.add(i.modules,"dash").name("dash"),o.add(i.modules,"camera").name("camera"),o.add(i.modules,"dummies").name("dummies"),o.add(i.modules,"abilities").name("abilities");const c=i.config,l=a.addFolder("移动参数");l.add(c,"moveSpeed",1,10,.1).name("移动速度"),l.add(c,"sprintMultiplier",1,3,.05).name("冲刺倍率"),l.add(c,"acceleration",1,40,.5).name("加速度"),l.add(c,"friction",1,40,.5).name("摩擦"),l.add(c,"gravity",5,60,.5).name("重力"),l.add(c,"jumpSpeed",2,16,.2).name("起跳速度"),l.add(c,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),l.add(c,"characterRadius",.1,.8,.01).name("角色半径"),l.add(c,"characterHeight",.6,2.2,.05).name("角色身高"),l.add(c,"strideLength",.3,3,.05).name("基础步幅"),l.add(c,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),l.add(c,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const h=a.addFolder("程序化步态 (v8)");h.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),h.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),h.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),h.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),h.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),h.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),h.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),h.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),h.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),h.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),h.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆");const f=a.addFolder("程序动画 (v8c/v8d)");f.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),f.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),f.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const p=t.animation.stride;f.add(p,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),f.add(p,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),f.add(p,"cycles",1,3,1).name("每段跨步周期数"),f.add(p,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),f.add(p,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),f.add(p,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),f.add(p,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),f.add(p,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),f.add(p,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),f.add(p,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),f.add(p,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),f.add(p,"heavyScale",0,1,.01).name("大剑重击收敛系数"),f.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),f.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),f.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),f.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),f.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),f.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),f.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),f.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),f.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),f.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),f.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),f.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const d=c.combat,m=a.addFolder("战斗参数"),_=m.add(i.combat,"weapon",ai).name("当前武器");m.add(d,"comboWindow",.1,2,.05).name("连击窗口 (s)"),m.add(d,"settle",0,.8,.01).name("段间停顿 (s)"),m.add(d,"attackMoveScale",0,1,.01).name("攻击时移动比例"),m.add(d,"autoCombo").name("按住自动连击"),m.add(d.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),m.add(d.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),m.add(d.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),m.add(d.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),m.add(d.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),m.add(d.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const g=c.abilities;m.add(g.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),m.add(g.arcane,"speed",3,24,.5).name("飞弹速度"),m.add(g.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),m.add(g.ring,"radius",.5,5,.1).name("电环半径"),m.add(g.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),m.add(g.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const u=c.orientation,x=a.addFolder("朝向参数");x.add(u,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),x.add(u,"headTurnRate",.5,40,.5).name("头部转向速率"),x.add(u,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),x.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),x.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),x.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const S=a.addFolder("惯性倾斜 / 盆骨 (v8g)"),v=t.lean;S.add(v,"accelGain",0,.1,.002).name("前后加速度增益"),S.add(v,"turnGain",0,.2,.005).name("绕圈侧倾增益"),S.add(v,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),S.add(v,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),S.add(v,"smoothing",1,30,1).name("倾斜平滑速率"),S.add(v,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),S.add(v,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),S.add(v,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),S.add(v,"crouchSmoothing",1,30,1).name("下沉平滑速率");const I=a.addFolder("足部 IK (v8g)"),A=t.ik;I.add(A,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),I.add(A,"weight",0,1,.01).name("钉地权重"),I.add(A,"attackScale",0,1,.01).name("攻击时权重倍率"),I.add(A,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const P=a.addFolder("程序动画 / 武器握持");P.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),P.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),P.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),P.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const L=c.targeting,b=a.addFolder("目标辅助");b.add(L,"targetAssist").name("启用目标辅助"),b.add(L,"range",1,14,.5).name("锁定范围 (m)"),b.add(L,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),b.add(L,"frontBias",0,4,.1).name("朝向加权"),b.add(L,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),b.add(L,"maxLungeScale",1,3,.1).name("前冲最大放大");const M=c.hits,R=a.addFolder("命中 / 受击 / 击退");R.add(M,"arcDeg",10,120,5).name("命中扇区半角 (°)"),R.add(M,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),R.add(M,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),R.add(M,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),R.add(M.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),R.add(M.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),R.add(M,"dummyReach",.5,4,.1).name("假人命中距离 (m)");const Y=c.separation,z=a.addFolder("角色间分离");z.add(Y,"iterations",1,8,1).name("迭代次数"),z.add(Y,"slop",0,.05,.002).name("额外分离量 (m)");const T=c.dash,D=a.addFolder("冲刺 / 闪避");D.add(T,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),D.add(T,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),D.add(T,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),D.add(T,"blinkDistance",1,12,.25).name("闪现距离 (m)"),D.add(T,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),D.add(T,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),D.add(T,"blinkClearVelocity").name("闪现清空速度"),D.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),D.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const U=c.camera,q=a.addFolder("智能相机");q.add(U,"radius",2,18,.5).name("威胁评估半径 (m)"),q.add(U,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),q.add(U,"saturation",.5,8,.1).name("威胁归一化饱和"),q.add(U,"pushIn",0,.5,.01).name("无威胁推进比例"),q.add(U,"maxPullback",0,1,.02).name("最大拉远比例"),q.add(U,"maxOffset",0,6,.1).name("最大构图平移 (m)"),q.add(U,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),q.add(U,"framingBias",0,1,.05).name("威胁质心平移系数"),q.add(U,"attackBoost",0,2,.05).name("挥砍中额外加权"),q.add(U.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),q.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const F=a.addFolder("输入");F.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),F.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const K=c.dummies,it=a.addFolder("假人参数");it.add(K,"moveSpeed",.5,8,.1).name("移动速度"),it.add(K,"wanderRadius",.5,8,.1).name("游走半径"),it.add(K,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),it.add(K,"followStopDistance",.3,5,.1).name("跟随停距"),it.add(K,"keepDistance",1,10,.1).name("保持距离"),it.add(K,"keepDeadZone",.1,2,.05).name("保持死区"),it.add(K,"attackRange",.5,5,.1).name("攻击距离"),it.add(K,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const ft=a.addFolder("相机");ft.add(t.camera,"pitchDeg",20,80,1).name("俯角"),ft.add(t.camera,"yawDeg",-180,180,1).name("方位角"),ft.add(t.camera,"distance",6,35,.5).name("距离"),ft.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),ft.add(t.camera,"fov",25,90,1).name("FOV");const ht=a.addFolder("相机缩放 (v8e)");ht.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),ht.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),ht.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),ht.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),ht.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),ht.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),ht.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),ht.add({reset:n.resetZoom},"reset").name("缩放归 1");const xt=a.addFolder("受击分层 (v8f)"),J=t.hurt;xt.add(J,"enabled").name("启用分层受击 (关=旧版对照)"),xt.add(J,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),xt.add(J,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),xt.add(J,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),xt.add(J,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),xt.add(J,"upperShiftScale",0,1,.01).name("上身位移缩放"),xt.add(J,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),xt.add(J.hitHeight,"light",0,1,.01).name("轻击命中部位"),xt.add(J.hitHeight,"heavy",0,1,.01).name("重击命中部位"),xt.add(J.hitHeight,"knock",0,1,.01).name("击退命中部位"),xt.add(J,"leanLight",0,1.5,.01).name("轻击力度"),xt.add(J,"leanHeavy",0,1.5,.01).name("重击力度"),xt.add(J,"leanKnock",0,1.5,.01).name("击退力度"),xt.add(J,"flashStrength",0,2,.05).name("受击闪光强度");const Q=[{name:"打腹 (abdomen)",p:J.abdomen},{name:"打肩 (shoulder)",p:J.shoulder}].map(({name:Pt,p:Ut})=>{const _t=xt.addFolder(Pt);return _t.add(Ut,"upperPitch",0,2,.01).name("上身前后倾斜"),_t.add(Ut,"upperRoll",0,2,.01).name("上身侧倾"),_t.add(Ut,"upperYaw",0,1.5,.01).name("肩部扭转"),_t.add(Ut,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),_t.add(Ut,"shift",0,.8,.01).name("身体反应位移"),_t.add(Ut,"drop",0,.4,.01).name("整体下沉"),_t.add(Ut,"back",0,.4,.01).name("屁股向后"),_t.add(Ut,"knee",0,1.6,.01).name("屈膝"),_t.add(Ut,"hip",0,1,.01).name("髋前倾"),_t.add(Ut,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),_t}),ot=a.addFolder("派生招 (v9a)"),pt=i.config.links;ot.add(pt,"enabled").name("总开关 (false=旧连击)"),ot.add(pt.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),ot.add(pt.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),ot.add(pt.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),ot.add(pt,"sharedCooldown",0,3,.05).name("共享 CD (s)"),ot.add(pt,"triggerWhileSprinting").name("长跑中可直接触发"),ot.add(pt.search,"range",1,14,.1).name("索敌距离 (m)"),ot.add(pt.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),ot.add(pt.search,"stopDistance",0,3,.05).name("停住距离 (m)");const gt=pt.moves["sword-shield"];gt&&(ot.add(gt,"enabled").name("剑盾盾击"),ot.add(gt,"distance",0,8,.1).name("冲锋极限 (m)"),ot.add(gt,"windup",0,.5,.01).name("前摇 (s)"),ot.add(gt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),ot.add(gt,"recovery",0,.8,.01).name("收势 (s)"),ot.add(gt.hit,"radius",0,4,.05).name("命中半径 (m)"),ot.add(gt.hit,"width",0,2,.05).name("扫掠半径 (m)"),ot.add(gt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),ot.add(gt.hit,"duration",0,1.5,.01).name("僵直 (s)")),ot.add(i.config.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const St=a.addFolder("显示");return St.add(e,"showColliders").name("碰撞盒线框").onChange(n.onToggleColliders),St.add(e,"showGrid").name("地面网格").onChange(n.onToggleGrid),l.close(),f.close(),m.close(),x.close(),P.close(),S.close(),I.close(),b.close(),R.close(),z.close(),D.close(),q.close(),F.close(),o.close(),it.close(),ft.close(),ht.close(),xt.close(),ot.close(),Q.forEach(Pt=>Pt.close()),St.close(),a.close(),{gui:a,refreshWeapon:()=>_.updateDisplay()}}const Wa=Math.PI*2,sn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},Cu=45,Pu=50;function Du(i,t,e){return{x:e.rightX*i+e.rightZ*t,y:-(e.forwardX*i+e.forwardZ*t)}}function qi(i,t,e){const n=Du(i,t,e);return Math.atan2(n.x,-n.y)*180/Math.PI}function Lu(i,t){return Math.atan2(i,-t)*180/Math.PI}function xc(i,t){return Math.abs(((i-t)%360+540)%360-180)}function Es(i){return(i%360+360)%360}const Iu={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function ku(i,t,e,n=8){const s=i.character,a=t.intents,r=Math.hypot(a.moveX,a.moveZ),o=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),h=r>.001?qi(a.moveX,a.moveZ,e):null,f=l>.15?qi(c.x,c.z,e):null,p=qi(Math.sin(s.facing),Math.cos(s.facing),e),d=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?qi(a.aimX,a.aimZ,e):null,m=i.targeting,_=m.hasTarget?qi(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&f!==null?xc(h,f):null,u=h!==null?xc(h,p):null,x=g!==null&&g>Cu&&r>=.35&&l>=.4;return{inDeg:h,inLen:Math.min(1,r),rawDeg:o>.02?Lu(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,o),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:p,lockDeg:_,lockId:m.targetId,lockDist:m.targetDist,aimDeg:d,gapMove:g,gapFace:u,warnMove:x}}function vc(i,t){return!t&&i.aimDeg===null&&i.gapFace!==null&&i.gapFace>Pu&&(i.inLen>=.35||i.speed>=.4)}const Mc="harness.dirDebug";function Uu(i={}){const t=document.createElement("div");t.id="dirdbg",t.innerHTML=['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>','<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"].join(""),document.body.appendChild(t);const e=t.querySelector("#dirdbg-canvas"),n=t.querySelector("#dirdbg-toggle"),s={in:t.querySelector('[data-k="in"]'),mv:t.querySelector('[data-k="mv"]'),fc:t.querySelector('[data-k="fc"]'),gap:t.querySelector('[data-k="gap"]')},a=e.getContext("2d");let r=!0;try{r=window.localStorage.getItem(Mc)!=="0"}catch{}function o(){t.classList.toggle("is-off",!r),n.textContent=r?"方向 ⌄":"方向 ▸",n.setAttribute("aria-expanded",String(r))}o();function c(u){r=u;try{window.localStorage.setItem(Mc,u?"1":"0")}catch{}o()}n.addEventListener("pointerdown",u=>{u.preventDefault(),u.stopPropagation(),c(!r)}),window.addEventListener("keydown",u=>{u.key.toLowerCase()==="v"&&!u.metaKey&&!u.ctrlKey&&c(!r)});const l=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;e.width=Math.round(h*l),e.height=Math.round(h*l);let f=Iu,p=0,d="",m=8;function _(u){if(!a)return;const x=h,S=h,v=x/2,I=S/2,A=Math.min(x,S)/2-13;a.setTransform(l,0,0,l,0,0),a.clearRect(0,0,x,S),a.beginPath(),a.arc(v,I,A,0,Wa),a.fillStyle="rgba(8, 12, 17, 0.5)",a.fill(),a.lineWidth=1,a.strokeStyle=u.warnMove?"rgba(251, 191, 36, 0.85)":sn.ring,a.stroke(),a.strokeStyle=sn.grid,a.beginPath(),a.moveTo(v-A,I),a.lineTo(v+A,I),a.moveTo(v,I-A),a.lineTo(v,I+A),a.stroke();for(let M=0;M<8;M++){const R=M*Math.PI/4,Y=v+Math.sin(R)*(A-3),z=I-Math.cos(R)*(A-3),T=v+Math.sin(R)*A,D=I-Math.cos(R)*A;a.beginPath(),a.moveTo(Y,z),a.lineTo(T,D),a.stroke()}const P=i.deadZone?Math.min(.9,Math.max(0,i.deadZone())):0;P>0&&(a.save(),a.setLineDash([2,3]),a.strokeStyle=sn.dead,a.beginPath(),a.arc(v,I,A*P,0,Wa),a.stroke(),a.restore());const L=(M,R,Y,z,T=!1,D=1)=>{const U=M*Math.PI/180,q=Math.sin(U),F=-Math.cos(U),K=A*Math.max(.14,Math.min(1,R)),it=v+q*A*.14,ft=I+F*A*.14,ht=v+q*K,xt=I+F*K;if(a.save(),a.globalAlpha=D,a.strokeStyle=Y,a.fillStyle=Y,a.lineWidth=z,a.lineCap="round",T&&a.setLineDash([3,3]),a.beginPath(),a.moveTo(it,ft),a.lineTo(ht,xt),a.stroke(),!T&&K>A*.3){const J=-F,Q=q,ot=5.2;a.beginPath(),a.moveTo(ht+q*1.5,xt+F*1.5),a.lineTo(ht-q*ot+J*ot*.72,xt-F*ot+Q*ot*.72),a.lineTo(ht-q*ot-J*ot*.72,xt-F*ot-Q*ot*.72),a.closePath(),a.fill()}a.restore()},b=(M,R)=>{const Y=M*Math.PI/180,z=Math.sin(Y),T=-Math.cos(Y),D=-T,U=z,q=A+1.5,F=q+6.5;a.save(),a.fillStyle=R,a.strokeStyle=R,a.lineWidth=1,a.beginPath(),a.moveTo(v+z*F,I+T*F),a.lineTo(v+z*q+D*4,I+T*q+U*4),a.lineTo(v+z*q-D*4,I+T*q-U*4),a.closePath(),a.fill(),a.restore()};u.lockDeg!==null&&L(u.lockDeg,1,sn.lock,1,!0,.7),u.rawDeg!==null&&u.stickHeld&&L(u.rawDeg,u.rawLen,sn.raw,1,!0,.9),u.aimDeg!==null&&L(u.aimDeg,1,sn.aim,1.6,!0,.95),L(u.faceDeg,1,sn.face,1.1,!0,.55),u.moveDeg!==null&&L(u.moveDeg,u.speed/Math.max(1,m),sn.move,5.5,!1,.8),u.inDeg!==null&&L(u.inDeg,u.inLen,sn.input,2.2),b(u.faceDeg,sn.face),a.beginPath(),a.arc(v,I,2.2,0,Wa),a.fillStyle="rgba(220, 235, 248, 0.85)",a.fill()}function g(u,x){const S=A=>A===null?"-":String(Math.round(Es(A)));s.in.textContent=`入 ${S(u.inDeg)}`,s.mv.textContent=`移 ${S(u.moveDeg)}`,s.fc.textContent=`面 ${S(u.faceDeg)}`;const v=A=>A===null?"-":`${Math.round(A)}°`,I=[`Δ入→移 ${v(u.gapMove)}`,`Δ入→面 ${v(u.gapFace)}`];u.speed>.05&&I.push(`v${u.speed.toFixed(1)}`),u.lockDeg!==null&&I.push(`锁#${u.lockId} ${u.lockDist.toFixed(1)}m`),u.aimDeg!==null&&I.push("拖拽瞄准"),s.gap.textContent=I.join("  "),t.classList.toggle("is-warn",u.warnMove||vc(u,x))}return{update(u,x,S){if(!r)return;m=Math.max(1,u.config.moveSpeed*Math.max(1,u.config.sprintMultiplier));const v=ku(u,x,S,m);f=v;const I=u.combat.phase!=="idle";_(v);const A=performance.now(),P=`${v.inDeg}|${v.moveDeg}|${v.faceDeg}|${v.lockId}|${v.aimDeg}|${v.warnMove}|${v.speed.toFixed(1)}`;(A-p>90||P!==d)&&(p=A,d=P,g(v,I),t.dataset.in=v.inDeg===null?"":Es(v.inDeg).toFixed(1),t.dataset.mv=v.moveDeg===null?"":Es(v.moveDeg).toFixed(1),t.dataset.fc=Es(v.faceDeg).toFixed(1),t.dataset.warn=v.warnMove||vc(v,I)?"1":"0")},setEnabled:c,toggle(){return c(!r),r},enabled:()=>r,last:()=>f}}const Fu=["剑盾","双剑","大剑","法杖","弓"],Nu={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function zu(i){return{update(t,e,n,s,a,r,o=!1){const c=t.character,l=c.position,h=c.velocity,f=t.combat,p=t.events.length>0?t.events[t.events.length-1]:null,d=_t=>_t.toFixed(2),m=_t=>(_t*180/Math.PI).toFixed(0),_=Fu[ai.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),u="|".repeat(g)+".".repeat(10-g),x=t.dash,S=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${S.toFixed(0)}%`:`${x.kind} cd${d(x.cooldown)}`,I=s.intents.aimActive?`(${d(s.intents.aimX)},${d(s.intents.aimZ)})`:"-",A=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),P=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),L=Math.abs(A)+Math.abs(P)+1e-6,b=Math.round(Math.abs(P)/L*100),M=`strafe ${b}%${A<-.05?" back":""}`,R=t.camera,Y=`threat ${(R.threat*100).toFixed(0)}%  dist×${d(R.distanceScale)}  off (${d(R.offsetX)},${d(R.offsetZ)})  pitch +${d(R.pitchDelta)}°  n=${R.threatCount}`,z=r?d(r.attackBlend):"-",T=r==null?void 0:r.attackWeights,D=T?`gw ${d(T.gaitScale)}  lw ${d(T.attackLegWeight)}  spd ${d(T.driveSpeed)}`:"-",U=T?`${d(T.gaitScale)}/${d(T.attackLegWeight)}`:"-",q=r?`${r.landing.kind} ${d(r.landing.pulse)} t${d(r.landing.remaining)} vy${d(r.landing.impactVy)}`:"-",F=r?`${r.landing.kind}/${d(r.landing.pulse)}`:"-",K=(r==null?void 0:r.zoom)!==void 0?`zoom ×${d(r.zoom)}`:"-",it=r==null?void 0:r.hurt,ft=it?`hurt ${t.playerHurt.type}  部位h${d(it.hitHeight)}  脉冲p${d(it.pulse)}  上身${d(it.upperShift)}  重心${d(it.comShift)}  后坐${d(it.pelvisBack)}  屈膝${d(it.knee)}`:"-",ht=it?`${d(it.hitHeight)}/${d(it.pulse)}/${d(it.knee)}`:"-",xt=r==null?void 0:r.ik,J=xt?`${xt.active?"on":"off"} w${d(xt.weight)} e${d(xt.maxError)}`:"-",Q=t.playerLink,ot=`link ${Q.kind||"-"}  ${Q.phase}  prog ${d(Q.progress)}  win ${d(Q.linkWindow)}s  cd ${d(Q.cooldown)}s  hits ${Q.hitIds.length}  travel ${d(Q.travelled)}/${d(Q.travel)}m  id ${Q.id}`,pt=`${Q.phase}/${Q.kind||"-"}/w${d(Q.linkWindow)}`,gt=s.lastGesture,St=gt?`${gt.button} ${gt.kind} ${gt.heldMs.toFixed(0)}ms d${gt.distance.toFixed(0)}px ${gt.angleDeg.toFixed(0)}° taps${gt.taps}`:"-",Pt=t.dummies.map(_t=>`${_t.id}:${Nu[_t.mode]}`).join("  ");if(o){i.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${Q.phase}${Q.kind?`/${Q.kind}`:""} w${d(Q.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?i.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${n}`,`pos (${d(l.x)},${d(l.y)},${d(l.z)})  vel (${d(h.x)},${d(h.y)},${d(h.z)})`,`face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  st${b}%  stick(${d(s.stickX)},${d(s.stickY)}) ${s.source}  str${d(c.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${d(f.attackProgress)}  dash ${v}  ab ${z}  gw/lw ${U}  land ${F}  ik ${J}`,`aim ${I}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ht}`,`dummies ${Pt}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${d(R.distanceScale)}  ${K}  lk ${pt}`,`event ${p?`${p.type} ${d(p.value)}`:"-"}  scale ${d(a.timeScale)}${a.paused?" [P]":""}  g ${St}`].join(`
`):i.textContent=[`tick ${t.tick}   t ${d(t.time)}s   fps ${e.toFixed(0)}   steps ${n}`,`pos  (${d(l.x)}, ${d(l.y)}, ${d(l.z)})`,`vel  (${d(h.x)}, ${d(h.y)}, ${d(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${m(c.facing)}deg   atkBlend ${z}   ${D}   land ${q}`,ft,`ik ${J}  clamped ${xt?xt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  (head-body ${m(c.headYaw-c.bodyYaw)})  ${M}`,`move (${d(s.intents.moveX)}, ${d(s.intents.moveZ)})  stick (${d(s.stickX)}, ${d(s.stickY)})  ${s.source}  aim ${I}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${d(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${S.toFixed(0)}%  cd ${d(x.cooldown)}s  id ${x.id}  from (${d(x.fromX)},${d(x.fromZ)}) → to (${d(x.toX)},${d(x.toZ)})`,ot,`camera ${Y}  ${K}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${u}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Pt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${d(t.impulse.x)}, ${d(t.impulse.z)})`,`event ${p?`${p.type} ${d(p.value)}`:"-"}   scale ${d(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${St}`].join(`
`)}}}const Ou=8e3;function Bu(i,t){const e=document.getElementById("hud-toggle"),n=document.getElementById("hint-toggle");let s=!1,a=!1,r=0;function o(){i.classList.toggle("is-compact",!s),e==null||e.setAttribute("aria-expanded",String(s)),e&&(e.textContent=s?"状态 ▾":"状态 ▸",e.setAttribute("aria-label",s?"收起状态读数":"展开状态读数")),t&&(t.hidden=!a),n==null||n.setAttribute("aria-expanded",String(a)),n&&(n.textContent=a?"操作说明 ▾":"操作说明 ▸",n.setAttribute("aria-label",a?"收起操作说明":"展开操作说明"))}function c(){a&&(a=!1,window.clearTimeout(r),r=0,o())}function l(){s&&(s=!1,o())}function h(d){d.preventDefault(),d.stopPropagation(),s=!s,o()}function f(d){d.preventDefault(),d.stopPropagation(),a=!a,window.clearTimeout(r),r=0,a&&(r=window.setTimeout(c,Ou)),o()}e==null||e.addEventListener("pointerdown",h),n==null||n.addEventListener("pointerdown",f);function p(d){const m=d.target;m instanceof Element&&m.closest("#fold-row, #hint")||(c(),l())}return window.addEventListener("pointerdown",p,{capture:!0,passive:!0}),o(),{hudCompact:()=>!s}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const zo="170",Hu=0,yc=1,Vu=2,Gl=1,Wl=2,bn=3,Vn=0,De=1,Ae=2,On=0,ki=1,Sc=2,bc=3,Ec=4,Gu=5,ei=100,Wu=101,Xu=102,$u=103,Yu=104,Zu=200,qu=201,ju=202,Ku=203,Or=204,Br=205,Ju=206,Qu=207,tf=208,ef=209,nf=210,sf=211,af=212,rf=213,of=214,Hr=0,Vr=1,Gr=2,Ni=3,Wr=4,Xr=5,$r=6,Yr=7,Oo=0,cf=1,lf=2,Bn=0,df=1,hf=2,uf=3,ff=4,pf=5,mf=6,gf=7,Xl=300,zi=301,Oi=302,Zr=303,qr=304,Aa=306,jr=1e3,ii=1001,Kr=1002,Je=1003,_f=1004,ws=1005,cn=1006,Xa=1007,si=1008,Rn=1009,$l=1010,Yl=1011,hs=1012,Bo=1013,ri=1014,wn=1015,fs=1016,Ho=1017,Vo=1018,Bi=1020,Zl=35902,ql=1021,jl=1022,Ke=1023,Kl=1024,Jl=1025,Ui=1026,Hi=1027,Ql=1028,Go=1029,td=1030,Wo=1031,Xo=1033,ia=33776,sa=33777,aa=33778,ra=33779,Jr=35840,Qr=35841,to=35842,eo=35843,no=36196,io=37492,so=37496,ao=37808,ro=37809,oo=37810,co=37811,lo=37812,ho=37813,uo=37814,fo=37815,po=37816,mo=37817,go=37818,_o=37819,xo=37820,vo=37821,oa=36492,Mo=36494,yo=36495,ed=36283,So=36284,bo=36285,Eo=36286,xf=3200,vf=3201,nd=0,Mf=1,Nn="",Be="srgb",Gi="srgb-linear",Ta="linear",ie="srgb",pi=7680,wc=519,yf=512,Sf=513,bf=514,id=515,Ef=516,wf=517,Af=518,Tf=519,wo=35044,Ac="300 es",An=2e3,va=2001;class Wi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ca=Math.PI/180,Ao=180/Math.PI;function Hn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ye[i&255]+ye[i>>8&255]+ye[i>>16&255]+ye[i>>24&255]+"-"+ye[t&255]+ye[t>>8&255]+"-"+ye[t>>16&15|64]+ye[t>>24&255]+"-"+ye[e&63|128]+ye[e>>8&255]+"-"+ye[e>>16&255]+ye[e>>24&255]+ye[n&255]+ye[n>>8&255]+ye[n>>16&255]+ye[n>>24&255]).toLowerCase()}function Pe(i,t,e){return Math.max(t,Math.min(e,i))}function Rf(i,t){return(i%t+t)%t}function $a(i,t,e){return(1-e)*i+e*t}function on(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function se(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Gt{constructor(t=0,e=0){Gt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*s+t.x,this.y=a*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Wt{constructor(t,e,n,s,a,r,o,c,l){Wt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l)}set(t,e,n,s,a,r,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=a,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],h=n[4],f=n[7],p=n[2],d=n[5],m=n[8],_=s[0],g=s[3],u=s[6],x=s[1],S=s[4],v=s[7],I=s[2],A=s[5],P=s[8];return a[0]=r*_+o*x+c*I,a[3]=r*g+o*S+c*A,a[6]=r*u+o*v+c*P,a[1]=l*_+h*x+f*I,a[4]=l*g+h*S+f*A,a[7]=l*u+h*v+f*P,a[2]=p*_+d*x+m*I,a[5]=p*g+d*S+m*A,a[8]=p*u+d*v+m*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*o*l-n*a*h+n*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=h*r-o*l,p=o*c-h*a,d=l*a-r*c,m=e*f+n*p+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=f*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*r)*_,t[3]=p*_,t[4]=(h*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=d*_,t[7]=(n*c-l*e)*_,t[8]=(r*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ya.makeScale(t,e)),this}rotate(t){return this.premultiply(Ya.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ya.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ya=new Wt;function sd(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ma(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Cf(){const i=Ma("canvas");return i.style.display="block",i}const Tc={};function as(i){i in Tc||(Tc[i]=!0,console.warn(i))}function Pf(i,t,e){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}function Df(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Lf(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Kt={enabled:!0,workingColorSpace:Gi,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ie&&(i.r=Tn(i.r),i.g=Tn(i.g),i.b=Tn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ie&&(i.r=Fi(i.r),i.g=Fi(i.g),i.b=Fi(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Nn?Ta:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Tn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Rc=[.64,.33,.3,.6,.15,.06],Cc=[.2126,.7152,.0722],Pc=[.3127,.329],Dc=new Wt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Lc=new Wt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Kt.define({[Gi]:{primaries:Rc,whitePoint:Pc,transfer:Ta,toXYZ:Dc,fromXYZ:Lc,luminanceCoefficients:Cc,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:Rc,whitePoint:Pc,transfer:ie,toXYZ:Dc,fromXYZ:Lc,luminanceCoefficients:Cc,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}});let mi;class If{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{mi===void 0&&(mi=Ma("canvas")),mi.width=t.width,mi.height=t.height;const n=mi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=mi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ma("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Tn(a[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Tn(e[n]/255)*255):e[n]=Tn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let kf=0;class ad{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:kf++}),this.uuid=Hn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Za(s[r].image)):a.push(Za(s[r]))}else a=Za(s);n.url=a}return e||(t.images[this.uuid]=n),n}}function Za(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?If.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Uf=0;class Re extends Wi{constructor(t=Re.DEFAULT_IMAGE,e=Re.DEFAULT_MAPPING,n=ii,s=ii,a=cn,r=si,o=Ke,c=Rn,l=Re.DEFAULT_ANISOTROPY,h=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Uf++}),this.uuid=Hn(),this.name="",this.source=new ad(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Gt(0,0),this.repeat=new Gt(1,1),this.center=new Gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Xl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case jr:t.x=t.x-Math.floor(t.x);break;case ii:t.x=t.x<0?0:1;break;case Kr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case jr:t.y=t.y-Math.floor(t.y);break;case ii:t.y=t.y<0?0:1;break;case Kr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Re.DEFAULT_IMAGE=null;Re.DEFAULT_MAPPING=Xl;Re.DEFAULT_ANISOTROPY=1;class de{constructor(t=0,e=0,n=0,s=1){de.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a;const c=t.elements,l=c[0],h=c[4],f=c[8],p=c[1],d=c[5],m=c[9],_=c[2],g=c[6],u=c[10];if(Math.abs(h-p)<.01&&Math.abs(f-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+p)<.1&&Math.abs(f+_)<.1&&Math.abs(m+g)<.1&&Math.abs(l+d+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(l+1)/2,v=(d+1)/2,I=(u+1)/2,A=(h+p)/4,P=(f+_)/4,L=(m+g)/4;return S>v&&S>I?S<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(S),s=A/n,a=P/n):v>I?v<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),n=A/s,a=L/s):I<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(I),n=P/a,s=L/a),this.set(n,s,a,e),this}let x=Math.sqrt((g-m)*(g-m)+(f-_)*(f-_)+(p-h)*(p-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(f-_)/x,this.z=(p-h)/x,this.w=Math.acos((l+d+u-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ff extends Wi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new Re(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new ad(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class oi extends Ff{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class rd extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Je,this.minFilter=Je,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nf extends Re{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Je,this.minFilter=Je,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ps{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,r,o){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3];const p=a[r+0],d=a[r+1],m=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=p,t[e+1]=d,t[e+2]=m,t[e+3]=_;return}if(f!==_||c!==p||l!==d||h!==m){let g=1-o;const u=c*p+l*d+h*m+f*_,x=u>=0?1:-1,S=1-u*u;if(S>Number.EPSILON){const I=Math.sqrt(S),A=Math.atan2(I,u*x);g=Math.sin(g*A)/I,o=Math.sin(o*A)/I}const v=o*x;if(c=c*g+p*v,l=l*g+d*v,h=h*g+m*v,f=f*g+_*v,g===1-o){const I=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=I,l*=I,h*=I,f*=I}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,a,r){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=a[r],p=a[r+1],d=a[r+2],m=a[r+3];return t[e]=o*m+h*f+c*d-l*p,t[e+1]=c*m+h*p+l*f-o*d,t[e+2]=l*m+h*d+o*p-c*f,t[e+3]=h*m-o*f-c*p-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),f=o(a/2),p=c(n/2),d=c(s/2),m=c(a/2);switch(r){case"XYZ":this._x=p*h*f+l*d*m,this._y=l*d*f-p*h*m,this._z=l*h*m+p*d*f,this._w=l*h*f-p*d*m;break;case"YXZ":this._x=p*h*f+l*d*m,this._y=l*d*f-p*h*m,this._z=l*h*m-p*d*f,this._w=l*h*f+p*d*m;break;case"ZXY":this._x=p*h*f-l*d*m,this._y=l*d*f+p*h*m,this._z=l*h*m+p*d*f,this._w=l*h*f-p*d*m;break;case"ZYX":this._x=p*h*f-l*d*m,this._y=l*d*f+p*h*m,this._z=l*h*m-p*d*f,this._w=l*h*f+p*d*m;break;case"YZX":this._x=p*h*f+l*d*m,this._y=l*d*f+p*h*m,this._z=l*h*m-p*d*f,this._w=l*h*f-p*d*m;break;case"XZY":this._x=p*h*f-l*d*m,this._y=l*d*f-p*h*m,this._z=l*h*m+p*d*f,this._w=l*h*f+p*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],h=e[6],f=e[10],p=n+o+f;if(p>0){const d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(h-c)*d,this._y=(a-l)*d,this._z=(r-s)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+l)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(a-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(r-s)/d,this._x=(a+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Pe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-n*l,this._z=a*h+r*l+n*c-s*o,this._w=r*h-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),f=Math.sin((1-e)*h)/l,p=Math.sin(e*h)/l;return this._w=r*f+this._w*p,this._x=n*f+this._x*p,this._y=s*f+this._y*p,this._z=a*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ${constructor(t=0,e=0,n=0){$.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ic.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ic.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*n),h=2*(o*e-a*s),f=2*(a*n-r*e);return this.x=e+c*l+r*f-o*h,this.y=n+c*h+o*l-a*f,this.z=s+c*f+a*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return qa.copy(this).projectOnVector(t),this.sub(qa)}reflect(t){return this.sub(qa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Pe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qa=new $,Ic=new ps;class ms{constructor(t=new $(1/0,1/0,1/0),e=new $(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ze.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ze.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ze.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Ze):Ze.fromBufferAttribute(a,r),Ze.applyMatrix4(t.matrixWorld),this.expandByPoint(Ze);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),As.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),As.copy(n.boundingBox)),As.applyMatrix4(t.matrixWorld),this.union(As)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ze),Ze.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ji),Ts.subVectors(this.max,ji),gi.subVectors(t.a,ji),_i.subVectors(t.b,ji),xi.subVectors(t.c,ji),Dn.subVectors(_i,gi),Ln.subVectors(xi,_i),$n.subVectors(gi,xi);let e=[0,-Dn.z,Dn.y,0,-Ln.z,Ln.y,0,-$n.z,$n.y,Dn.z,0,-Dn.x,Ln.z,0,-Ln.x,$n.z,0,-$n.x,-Dn.y,Dn.x,0,-Ln.y,Ln.x,0,-$n.y,$n.x,0];return!ja(e,gi,_i,xi,Ts)||(e=[1,0,0,0,1,0,0,0,1],!ja(e,gi,_i,xi,Ts))?!1:(Rs.crossVectors(Dn,Ln),e=[Rs.x,Rs.y,Rs.z],ja(e,gi,_i,xi,Ts))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ze).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ze).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_n),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const _n=[new $,new $,new $,new $,new $,new $,new $,new $],Ze=new $,As=new ms,gi=new $,_i=new $,xi=new $,Dn=new $,Ln=new $,$n=new $,ji=new $,Ts=new $,Rs=new $,Yn=new $;function ja(i,t,e,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){Yn.fromArray(i,a);const o=s.x*Math.abs(Yn.x)+s.y*Math.abs(Yn.y)+s.z*Math.abs(Yn.z),c=t.dot(Yn),l=e.dot(Yn),h=n.dot(Yn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const zf=new ms,Ki=new $,Ka=new $;class Ra{constructor(t=new $,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):zf.setFromPoints(t).getCenter(n);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ki.subVectors(t,this.center);const e=Ki.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ki,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ka.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ki.copy(t.center).add(Ka)),this.expandByPoint(Ki.copy(t.center).sub(Ka))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const xn=new $,Ja=new $,Cs=new $,In=new $,Qa=new $,Ps=new $,tr=new $;class $o{constructor(t=new $,e=new $(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(xn.copy(this.origin).addScaledVector(this.direction,e),xn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ja.copy(t).add(e).multiplyScalar(.5),Cs.copy(e).sub(t).normalize(),In.copy(this.origin).sub(Ja);const a=t.distanceTo(e)*.5,r=-this.direction.dot(Cs),o=In.dot(this.direction),c=-In.dot(Cs),l=In.lengthSq(),h=Math.abs(1-r*r);let f,p,d,m;if(h>0)if(f=r*c-o,p=r*o-c,m=a*h,f>=0)if(p>=-m)if(p<=m){const _=1/h;f*=_,p*=_,d=f*(f+r*p+2*o)+p*(r*f+p+2*c)+l}else p=a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;else p=-a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;else p<=-m?(f=Math.max(0,-(-r*a+o)),p=f>0?-a:Math.min(Math.max(-a,-c),a),d=-f*f+p*(p+2*c)+l):p<=m?(f=0,p=Math.min(Math.max(-a,-c),a),d=p*(p+2*c)+l):(f=Math.max(0,-(r*a+o)),p=f>0?a:Math.min(Math.max(-a,-c),a),d=-f*f+p*(p+2*c)+l);else p=r>0?-a:a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Ja).addScaledVector(Cs,p),d}intersectSphere(t,e){xn.subVectors(t.center,this.origin);const n=xn.dot(this.direction),s=xn.dot(xn)-n*n,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,p=this.origin;return l>=0?(n=(t.min.x-p.x)*l,s=(t.max.x-p.x)*l):(n=(t.max.x-p.x)*l,s=(t.min.x-p.x)*l),h>=0?(a=(t.min.y-p.y)*h,r=(t.max.y-p.y)*h):(a=(t.max.y-p.y)*h,r=(t.min.y-p.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-p.z)*f,c=(t.max.z-p.z)*f):(o=(t.max.z-p.z)*f,c=(t.min.z-p.z)*f),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,xn)!==null}intersectTriangle(t,e,n,s,a){Qa.subVectors(e,t),Ps.subVectors(n,t),tr.crossVectors(Qa,Ps);let r=this.direction.dot(tr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;In.subVectors(this.origin,t);const c=o*this.direction.dot(Ps.crossVectors(In,Ps));if(c<0)return null;const l=o*this.direction.dot(Qa.cross(In));if(l<0||c+l>r)return null;const h=-o*In.dot(tr);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,s,a,r,o,c,l,h,f,p,d,m,_,g){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l,h,f,p,d,m,_,g)}set(t,e,n,s,a,r,o,c,l,h,f,p,d,m,_,g){const u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=a,u[5]=r,u[9]=o,u[13]=c,u[2]=l,u[6]=h,u[10]=f,u[14]=p,u[3]=d,u[7]=m,u[11]=_,u[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/vi.setFromMatrixColumn(t,0).length(),a=1/vi.setFromMatrixColumn(t,1).length(),r=1/vi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const p=r*h,d=r*f,m=o*h,_=o*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=d+m*l,e[5]=p-_*l,e[9]=-o*c,e[2]=_-p*l,e[6]=m+d*l,e[10]=r*c}else if(t.order==="YXZ"){const p=c*h,d=c*f,m=l*h,_=l*f;e[0]=p+_*o,e[4]=m*o-d,e[8]=r*l,e[1]=r*f,e[5]=r*h,e[9]=-o,e[2]=d*o-m,e[6]=_+p*o,e[10]=r*c}else if(t.order==="ZXY"){const p=c*h,d=c*f,m=l*h,_=l*f;e[0]=p-_*o,e[4]=-r*f,e[8]=m+d*o,e[1]=d+m*o,e[5]=r*h,e[9]=_-p*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const p=r*h,d=r*f,m=o*h,_=o*f;e[0]=c*h,e[4]=m*l-d,e[8]=p*l+_,e[1]=c*f,e[5]=_*l+p,e[9]=d*l-m,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const p=r*c,d=r*l,m=o*c,_=o*l;e[0]=c*h,e[4]=_-p*f,e[8]=m*f+d,e[1]=f,e[5]=r*h,e[9]=-o*h,e[2]=-l*h,e[6]=d*f+m,e[10]=p-_*f}else if(t.order==="XZY"){const p=r*c,d=r*l,m=o*c,_=o*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=p*f+_,e[5]=r*h,e[9]=d*f-m,e[2]=m*f-d,e[6]=o*h,e[10]=_*f+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Of,t,Bf)}lookAt(t,e,n){const s=this.elements;return Fe.subVectors(t,e),Fe.lengthSq()===0&&(Fe.z=1),Fe.normalize(),kn.crossVectors(n,Fe),kn.lengthSq()===0&&(Math.abs(n.z)===1?Fe.x+=1e-4:Fe.z+=1e-4,Fe.normalize(),kn.crossVectors(n,Fe)),kn.normalize(),Ds.crossVectors(Fe,kn),s[0]=kn.x,s[4]=Ds.x,s[8]=Fe.x,s[1]=kn.y,s[5]=Ds.y,s[9]=Fe.y,s[2]=kn.z,s[6]=Ds.z,s[10]=Fe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],h=n[1],f=n[5],p=n[9],d=n[13],m=n[2],_=n[6],g=n[10],u=n[14],x=n[3],S=n[7],v=n[11],I=n[15],A=s[0],P=s[4],L=s[8],b=s[12],M=s[1],R=s[5],Y=s[9],z=s[13],T=s[2],D=s[6],U=s[10],q=s[14],F=s[3],K=s[7],it=s[11],ft=s[15];return a[0]=r*A+o*M+c*T+l*F,a[4]=r*P+o*R+c*D+l*K,a[8]=r*L+o*Y+c*U+l*it,a[12]=r*b+o*z+c*q+l*ft,a[1]=h*A+f*M+p*T+d*F,a[5]=h*P+f*R+p*D+d*K,a[9]=h*L+f*Y+p*U+d*it,a[13]=h*b+f*z+p*q+d*ft,a[2]=m*A+_*M+g*T+u*F,a[6]=m*P+_*R+g*D+u*K,a[10]=m*L+_*Y+g*U+u*it,a[14]=m*b+_*z+g*q+u*ft,a[3]=x*A+S*M+v*T+I*F,a[7]=x*P+S*R+v*D+I*K,a[11]=x*L+S*Y+v*U+I*it,a[15]=x*b+S*z+v*q+I*ft,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],h=t[2],f=t[6],p=t[10],d=t[14],m=t[3],_=t[7],g=t[11],u=t[15];return m*(+a*c*f-s*l*f-a*o*p+n*l*p+s*o*d-n*c*d)+_*(+e*c*d-e*l*p+a*r*p-s*r*d+s*l*h-a*c*h)+g*(+e*l*f-e*o*d-a*r*f+n*r*d+a*o*h-n*l*h)+u*(-s*o*h-e*c*f+e*o*p+s*r*f-n*r*p+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=t[9],p=t[10],d=t[11],m=t[12],_=t[13],g=t[14],u=t[15],x=f*g*l-_*p*l+_*c*d-o*g*d-f*c*u+o*p*u,S=m*p*l-h*g*l-m*c*d+r*g*d+h*c*u-r*p*u,v=h*_*l-m*f*l+m*o*d-r*_*d-h*o*u+r*f*u,I=m*f*c-h*_*c-m*o*p+r*_*p+h*o*g-r*f*g,A=e*x+n*S+s*v+a*I;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/A;return t[0]=x*P,t[1]=(_*p*a-f*g*a-_*s*d+n*g*d+f*s*u-n*p*u)*P,t[2]=(o*g*a-_*c*a+_*s*l-n*g*l-o*s*u+n*c*u)*P,t[3]=(f*c*a-o*p*a-f*s*l+n*p*l+o*s*d-n*c*d)*P,t[4]=S*P,t[5]=(h*g*a-m*p*a+m*s*d-e*g*d-h*s*u+e*p*u)*P,t[6]=(m*c*a-r*g*a-m*s*l+e*g*l+r*s*u-e*c*u)*P,t[7]=(r*p*a-h*c*a+h*s*l-e*p*l-r*s*d+e*c*d)*P,t[8]=v*P,t[9]=(m*f*a-h*_*a-m*n*d+e*_*d+h*n*u-e*f*u)*P,t[10]=(r*_*a-m*o*a+m*n*l-e*_*l-r*n*u+e*o*u)*P,t[11]=(h*o*a-r*f*a-h*n*l+e*f*l+r*n*d-e*o*d)*P,t[12]=I*P,t[13]=(h*_*s-m*f*s+m*n*p-e*_*p-h*n*g+e*f*g)*P,t[14]=(m*o*s-r*_*s-m*n*c+e*_*c+r*n*g-e*o*g)*P,t[15]=(r*f*s-h*o*s+h*n*c-e*f*c-r*n*p+e*o*p)*P,this}scale(t){const e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),a=1-n,r=t.x,o=t.y,c=t.z,l=a*r,h=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,r){return this.set(1,n,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,h=r+r,f=o+o,p=a*l,d=a*h,m=a*f,_=r*h,g=r*f,u=o*f,x=c*l,S=c*h,v=c*f,I=n.x,A=n.y,P=n.z;return s[0]=(1-(_+u))*I,s[1]=(d+v)*I,s[2]=(m-S)*I,s[3]=0,s[4]=(d-v)*A,s[5]=(1-(p+u))*A,s[6]=(g+x)*A,s[7]=0,s[8]=(m+S)*P,s[9]=(g-x)*P,s[10]=(1-(p+_))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let a=vi.set(s[0],s[1],s[2]).length();const r=vi.set(s[4],s[5],s[6]).length(),o=vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],qe.copy(this);const l=1/a,h=1/r,f=1/o;return qe.elements[0]*=l,qe.elements[1]*=l,qe.elements[2]*=l,qe.elements[4]*=h,qe.elements[5]*=h,qe.elements[6]*=h,qe.elements[8]*=f,qe.elements[9]*=f,qe.elements[10]*=f,e.setFromRotationMatrix(qe),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,s,a,r,o=An){const c=this.elements,l=2*a/(e-t),h=2*a/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s);let d,m;if(o===An)d=-(r+a)/(r-a),m=-2*r*a/(r-a);else if(o===va)d=-r/(r-a),m=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,a,r,o=An){const c=this.elements,l=1/(e-t),h=1/(n-s),f=1/(r-a),p=(e+t)*l,d=(n+s)*h;let m,_;if(o===An)m=(r+a)*f,_=-2*f;else if(o===va)m=a*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const vi=new $,qe=new oe,Of=new $(0,0,0),Bf=new $(1,1,1),kn=new $,Ds=new $,Fe=new $,kc=new oe,Uc=new ps;class hn{constructor(t=0,e=0,n=0,s=hn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],p=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Pe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Pe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Pe(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Pe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Pe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Pe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return kc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(kc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Uc.setFromEuler(this),this.setFromQuaternion(Uc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hn.DEFAULT_ORDER="XYZ";class Yo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Hf=0;const Fc=new $,Mi=new ps,vn=new oe,Ls=new $,Ji=new $,Vf=new $,Gf=new ps,Nc=new $(1,0,0),zc=new $(0,1,0),Oc=new $(0,0,1),Bc={type:"added"},Wf={type:"removed"},yi={type:"childadded",child:null},er={type:"childremoved",child:null};class he extends Wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hf++}),this.uuid=Hn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=he.DEFAULT_UP.clone();const t=new $,e=new hn,n=new ps,s=new $(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new oe},normalMatrix:{value:new Wt}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=he.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.premultiply(Mi),this}rotateX(t){return this.rotateOnAxis(Nc,t)}rotateY(t){return this.rotateOnAxis(zc,t)}rotateZ(t){return this.rotateOnAxis(Oc,t)}translateOnAxis(t,e){return Fc.copy(t).applyQuaternion(this.quaternion),this.position.add(Fc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nc,t)}translateY(t){return this.translateOnAxis(zc,t)}translateZ(t){return this.translateOnAxis(Oc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(vn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ls.copy(t):Ls.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vn.lookAt(Ji,Ls,this.up):vn.lookAt(Ls,Ji,this.up),this.quaternion.setFromRotationMatrix(vn),s&&(vn.extractRotation(s.matrixWorld),Mi.setFromRotationMatrix(vn),this.quaternion.premultiply(Mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Bc),yi.child=t,this.dispatchEvent(yi),yi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Wf),er.child=t,this.dispatchEvent(er),er.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),vn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),vn.multiply(t.parent.matrixWorld)),t.applyMatrix4(vn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Bc),yi.child=t,this.dispatchEvent(yi),yi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,t,Vf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,Gf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),f=r(t.shapes),p=r(t.skeletons),d=r(t.animations),m=r(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}he.DEFAULT_UP=new $(0,1,0);he.DEFAULT_MATRIX_AUTO_UPDATE=!0;he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const je=new $,Mn=new $,nr=new $,yn=new $,Si=new $,bi=new $,Hc=new $,ir=new $,sr=new $,ar=new $,rr=new de,or=new de,cr=new de;class ze{constructor(t=new $,e=new $,n=new $){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),je.subVectors(t,e),s.cross(je);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){je.subVectors(s,e),Mn.subVectors(n,e),nr.subVectors(t,e);const r=je.dot(je),o=je.dot(Mn),c=je.dot(nr),l=Mn.dot(Mn),h=Mn.dot(nr),f=r*l-o*o;if(f===0)return a.set(0,0,0),null;const p=1/f,d=(l*c-o*h)*p,m=(r*h-o*c)*p;return a.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,yn)===null?!1:yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getInterpolation(t,e,n,s,a,r,o,c){return this.getBarycoord(t,e,n,s,yn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,yn.x),c.addScaledVector(r,yn.y),c.addScaledVector(o,yn.z),c)}static getInterpolatedAttribute(t,e,n,s,a,r){return rr.setScalar(0),or.setScalar(0),cr.setScalar(0),rr.fromBufferAttribute(t,e),or.fromBufferAttribute(t,n),cr.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(rr,a.x),r.addScaledVector(or,a.y),r.addScaledVector(cr,a.z),r}static isFrontFacing(t,e,n,s){return je.subVectors(n,e),Mn.subVectors(t,e),je.cross(Mn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return je.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),je.cross(Mn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ze.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ze.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,a){return ze.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return ze.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ze.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,a=this.c;let r,o;Si.subVectors(s,n),bi.subVectors(a,n),ir.subVectors(t,n);const c=Si.dot(ir),l=bi.dot(ir);if(c<=0&&l<=0)return e.copy(n);sr.subVectors(t,s);const h=Si.dot(sr),f=bi.dot(sr);if(h>=0&&f<=h)return e.copy(s);const p=c*f-h*l;if(p<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(Si,r);ar.subVectors(t,a);const d=Si.dot(ar),m=bi.dot(ar);if(m>=0&&d<=m)return e.copy(a);const _=d*l-c*m;if(_<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector(bi,o);const g=h*m-d*f;if(g<=0&&f-h>=0&&d-m>=0)return Hc.subVectors(a,s),o=(f-h)/(f-h+(d-m)),e.copy(s).addScaledVector(Hc,o);const u=1/(g+_+p);return r=_*u,o=p*u,e.copy(n).addScaledVector(Si,r).addScaledVector(bi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const od={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},Is={h:0,s:0,l:0};function lr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Kt.workingColorSpace){if(t=Rf(t,1),e=Pe(e,0,1),n=Pe(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=lr(r,a,t+1/3),this.g=lr(r,a,t),this.b=lr(r,a,t-1/3)}return Kt.toWorkingColorSpace(this,s),this}setStyle(t,e=Be){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=od[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Tn(t.r),this.g=Tn(t.g),this.b=Tn(t.b),this}copyLinearToSRGB(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return Kt.fromWorkingColorSpace(Se.copy(this),t),Math.round(Pe(Se.r*255,0,255))*65536+Math.round(Pe(Se.g*255,0,255))*256+Math.round(Pe(Se.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.fromWorkingColorSpace(Se.copy(this),e);const n=Se.r,s=Se.g,a=Se.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const f=r-o;switch(l=h<=.5?f/(r+o):f/(2-r-o),r){case n:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-n)/f+2;break;case a:c=(n-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Kt.workingColorSpace){return Kt.fromWorkingColorSpace(Se.copy(this),e),t.r=Se.r,t.g=Se.g,t.b=Se.b,t}getStyle(t=Be){Kt.fromWorkingColorSpace(Se.copy(this),t);const e=Se.r,n=Se.g,s=Se.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Un),this.setHSL(Un.h+t,Un.s+e,Un.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Un),t.getHSL(Is);const n=$a(Un.h,Is.h,e),s=$a(Un.s,Is.s,e),a=$a(Un.l,Is.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Se=new Bt;Bt.NAMES=od;let Xf=0;class ci extends Wi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=Hn(),this.name="",this.blending=ki,this.side=Vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Or,this.blendDst=Br,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=Ni,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=wc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ki&&(n.blending=this.blending),this.side!==Vn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Or&&(n.blendSrc=this.blendSrc),this.blendDst!==Br&&(n.blendDst=this.blendDst),this.blendEquation!==ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ni&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==wc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class an extends ci{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=Oo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const me=new $,ks=new Gt;class Qe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=wo,this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ks.fromBufferAttribute(this,e),ks.applyMatrix3(t),this.setXY(e,ks.x,ks.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=on(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=on(e,this.array)),e}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=on(e,this.array)),e}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=on(e,this.array)),e}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=on(e,this.array)),e}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array),a=se(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==wo&&(t.usage=this.usage),t}}class cd extends Qe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ld extends Qe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ue extends Qe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let $f=0;const Oe=new oe,dr=new he,Ei=new $,Ne=new ms,Qi=new ms,ve=new $;class Le extends Wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=Hn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(sd(t)?ld:cd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Wt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Oe.makeRotationFromQuaternion(t),this.applyMatrix4(Oe),this}rotateX(t){return Oe.makeRotationX(t),this.applyMatrix4(Oe),this}rotateY(t){return Oe.makeRotationY(t),this.applyMatrix4(Oe),this}rotateZ(t){return Oe.makeRotationZ(t),this.applyMatrix4(Oe),this}translate(t,e,n){return Oe.makeTranslation(t,e,n),this.applyMatrix4(Oe),this}scale(t,e,n){return Oe.makeScale(t,e,n),this.applyMatrix4(Oe),this}lookAt(t){return dr.lookAt(t),dr.updateMatrix(),this.applyMatrix4(dr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ue(n,3))}else{for(let n=0,s=e.count;n<s;n++){const a=t[n];e.setXYZ(n,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ms);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new $(-1/0,-1/0,-1/0),new $(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const a=e[n];Ne.setFromBufferAttribute(a),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,Ne.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,Ne.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(Ne.min),this.boundingBox.expandByPoint(Ne.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ra);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new $,1/0);return}if(t){const n=this.boundingSphere.center;if(Ne.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];Qi.setFromBufferAttribute(o),this.morphTargetsRelative?(ve.addVectors(Ne.min,Qi.min),Ne.expandByPoint(ve),ve.addVectors(Ne.max,Qi.max),Ne.expandByPoint(ve)):(Ne.expandByPoint(Qi.min),Ne.expandByPoint(Qi.max))}Ne.getCenter(n);let s=0;for(let a=0,r=t.count;a<r;a++)ve.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(ve));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)ve.fromBufferAttribute(o,l),c&&(Ei.fromBufferAttribute(t,l),ve.add(Ei)),s=Math.max(s,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Qe(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let L=0;L<n.count;L++)o[L]=new $,c[L]=new $;const l=new $,h=new $,f=new $,p=new Gt,d=new Gt,m=new Gt,_=new $,g=new $;function u(L,b,M){l.fromBufferAttribute(n,L),h.fromBufferAttribute(n,b),f.fromBufferAttribute(n,M),p.fromBufferAttribute(a,L),d.fromBufferAttribute(a,b),m.fromBufferAttribute(a,M),h.sub(l),f.sub(l),d.sub(p),m.sub(p);const R=1/(d.x*m.y-m.x*d.y);isFinite(R)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(R),g.copy(f).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(R),o[L].add(_),o[b].add(_),o[M].add(_),c[L].add(g),c[b].add(g),c[M].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let L=0,b=x.length;L<b;++L){const M=x[L],R=M.start,Y=M.count;for(let z=R,T=R+Y;z<T;z+=3)u(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const S=new $,v=new $,I=new $,A=new $;function P(L){I.fromBufferAttribute(s,L),A.copy(I);const b=o[L];S.copy(b),S.sub(I.multiplyScalar(I.dot(b))).normalize(),v.crossVectors(A,b);const R=v.dot(c[L])<0?-1:1;r.setXYZW(L,S.x,S.y,S.z,R)}for(let L=0,b=x.length;L<b;++L){const M=x[L],R=M.start,Y=M.count;for(let z=R,T=R+Y;z<T;z+=3)P(t.getX(z+0)),P(t.getX(z+1)),P(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Qe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);const s=new $,a=new $,r=new $,o=new $,c=new $,l=new $,h=new $,f=new $;if(t)for(let p=0,d=t.count;p<d;p+=3){const m=t.getX(p+0),_=t.getX(p+1),g=t.getX(p+2);s.fromBufferAttribute(e,m),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let p=0,d=e.count;p<d;p+=3)s.fromBufferAttribute(e,p+0),a.fromBufferAttribute(e,p+1),r.fromBufferAttribute(e,p+2),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,f=o.normalized,p=new l.constructor(c.length*h);let d=0,m=0;for(let _=0,g=c.length;_<g;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*h;for(let u=0;u<h;u++)p[m++]=l[d++]}return new Qe(p,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,f=l.length;h<f;h++){const p=l[h],d=t(p,n);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,p=l.length;f<p;f++){const d=l[f];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const a=t.morphAttributes;for(const l in a){const h=[],f=a[l];for(let p=0,d=f.length;p<d;p++)h.push(f[p].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Vc=new oe,Zn=new $o,Us=new Ra,Gc=new $,Fs=new $,Ns=new $,zs=new $,hr=new $,Os=new $,Wc=new $,Bs=new $;class re extends he{constructor(t=new Le,e=new an){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){Os.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],f=a[c];h!==0&&(hr.fromBufferAttribute(f,t),r?Os.addScaledVector(hr,h):Os.addScaledVector(hr.sub(e),h))}e.add(Os)}return e}raycast(t,e){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Us.copy(n.boundingSphere),Us.applyMatrix4(a),Zn.copy(t.ray).recast(t.near),!(Us.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(Us,Gc)===null||Zn.origin.distanceToSquared(Gc)>(t.far-t.near)**2))&&(Vc.copy(a).invert(),Zn.copy(t.ray).applyMatrix4(Vc),!(n.boundingBox!==null&&Zn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Zn)))}_computeIntersections(t,e,n){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,p=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,_=p.length;m<_;m++){const g=p[m],u=r[g.materialIndex],x=Math.max(g.start,d.start),S=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let v=x,I=S;v<I;v+=3){const A=o.getX(v),P=o.getX(v+1),L=o.getX(v+2);s=Hs(this,u,t,n,l,h,f,A,P,L),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let g=m,u=_;g<u;g+=3){const x=o.getX(g),S=o.getX(g+1),v=o.getX(g+2);s=Hs(this,r,t,n,l,h,f,x,S,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let m=0,_=p.length;m<_;m++){const g=p[m],u=r[g.materialIndex],x=Math.max(g.start,d.start),S=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let v=x,I=S;v<I;v+=3){const A=v,P=v+1,L=v+2;s=Hs(this,u,t,n,l,h,f,A,P,L),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let g=m,u=_;g<u;g+=3){const x=g,S=g+1,v=g+2;s=Hs(this,r,t,n,l,h,f,x,S,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Yf(i,t,e,n,s,a,r,o){let c;if(t.side===De?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,t.side===Vn,o),c===null)return null;Bs.copy(o),Bs.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Bs);return l<e.near||l>e.far?null:{distance:l,point:Bs.clone(),object:i}}function Hs(i,t,e,n,s,a,r,o,c,l){i.getVertexPosition(o,Fs),i.getVertexPosition(c,Ns),i.getVertexPosition(l,zs);const h=Yf(i,t,e,n,Fs,Ns,zs,Wc);if(h){const f=new $;ze.getBarycoord(Wc,Fs,Ns,zs,f),s&&(h.uv=ze.getInterpolatedAttribute(s,o,c,l,f,new Gt)),a&&(h.uv1=ze.getInterpolatedAttribute(a,o,c,l,f,new Gt)),r&&(h.normal=ze.getInterpolatedAttribute(r,o,c,l,f,new $),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const p={a:o,b:c,c:l,normal:new $,materialIndex:0};ze.getNormal(Fs,Ns,zs,p.normal),h.face=p,h.barycoord=f}return h}class un extends Le{constructor(t=1,e=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],h=[],f=[];let p=0,d=0;m("z","y","x",-1,-1,n,e,t,r,a,0),m("z","y","x",1,-1,n,e,-t,r,a,1),m("x","z","y",1,1,t,n,e,s,r,2),m("x","z","y",1,-1,t,n,-e,s,r,3),m("x","y","z",1,-1,t,e,n,s,a,4),m("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new ue(l,3)),this.setAttribute("normal",new ue(h,3)),this.setAttribute("uv",new ue(f,2));function m(_,g,u,x,S,v,I,A,P,L,b){const M=v/P,R=I/L,Y=v/2,z=I/2,T=A/2,D=P+1,U=L+1;let q=0,F=0;const K=new $;for(let it=0;it<U;it++){const ft=it*R-z;for(let ht=0;ht<D;ht++){const xt=ht*M-Y;K[_]=xt*x,K[g]=ft*S,K[u]=T,l.push(K.x,K.y,K.z),K[_]=0,K[g]=0,K[u]=A>0?1:-1,h.push(K.x,K.y,K.z),f.push(ht/P),f.push(1-it/L),q+=1}}for(let it=0;it<L;it++)for(let ft=0;ft<P;ft++){const ht=p+ft+D*it,xt=p+ft+D*(it+1),J=p+(ft+1)+D*(it+1),Q=p+(ft+1)+D*it;c.push(ht,xt,Q),c.push(xt,J,Q),F+=6}o.addGroup(d,F,b),d+=F,p+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new un(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Vi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function we(i){const t={};for(let e=0;e<i.length;e++){const n=Vi(i[e]);for(const s in n)t[s]=n[s]}return t}function Zf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function dd(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Kt.workingColorSpace}const qf={clone:Vi,merge:we};var jf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends ci{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=jf,this.fragmentShader=Kf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Vi(t.uniforms),this.uniformsGroups=Zf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class hd extends he{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=An}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Fn=new $,Xc=new Gt,$c=new Gt;class He extends hd{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ao*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ca*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ao*2*Math.atan(Math.tan(ca*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Fn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Fn.x,Fn.y).multiplyScalar(-t/Fn.z),Fn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fn.x,Fn.y).multiplyScalar(-t/Fn.z)}getViewSize(t,e){return this.getViewBounds(t,Xc,$c),e.subVectors($c,Xc)}setViewOffset(t,e,n,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ca*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const wi=-90,Ai=1;class Jf extends he{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new He(wi,Ai,t,e);s.layers=this.layers,this.add(s);const a=new He(wi,Ai,t,e);a.layers=this.layers,this.add(a);const r=new He(wi,Ai,t,e);r.layers=this.layers,this.add(r);const o=new He(wi,Ai,t,e);o.layers=this.layers,this.add(o);const c=new He(wi,Ai,t,e);c.layers=this.layers,this.add(c);const l=new He(wi,Ai,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===An)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===va)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,h]=this.children,f=t.getRenderTarget(),p=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,a),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,p,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class ud extends Re{constructor(t,e,n,s,a,r,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:zi,super(t,e,n,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Qf extends oi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ud(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:cn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new un(5,5,5),a=new Gn({name:"CubemapFromEquirect",uniforms:Vi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:De,blending:On});a.uniforms.tEquirect.value=e;const r=new re(s,a),o=e.minFilter;return e.minFilter===si&&(e.minFilter=cn),new Jf(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(a)}}const ur=new $,tp=new $,ep=new Wt;class Qn{constructor(t=new $(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ur.subVectors(n,e).cross(tp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ur),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ep.getNormalMatrix(t),s=this.coplanarPoint(ur).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qn=new Ra,Vs=new $;class Zo{constructor(t=new Qn,e=new Qn,n=new Qn,s=new Qn,a=new Qn,r=new Qn){this.planes=[t,e,n,s,a,r]}set(t,e,n,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=An){const n=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],h=s[5],f=s[6],p=s[7],d=s[8],m=s[9],_=s[10],g=s[11],u=s[12],x=s[13],S=s[14],v=s[15];if(n[0].setComponents(c-a,p-l,g-d,v-u).normalize(),n[1].setComponents(c+a,p+l,g+d,v+u).normalize(),n[2].setComponents(c+r,p+h,g+m,v+x).normalize(),n[3].setComponents(c-r,p-h,g-m,v-x).normalize(),n[4].setComponents(c-o,p-f,g-_,v-S).normalize(),e===An)n[5].setComponents(c+o,p+f,g+_,v+S).normalize();else if(e===va)n[5].setComponents(o,f,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qn)}intersectsSprite(t){return qn.center.set(0,0,0),qn.radius=.7071067811865476,qn.applyMatrix4(t.matrixWorld),this.intersectsSphere(qn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Vs.x=s.normal.x>0?t.max.x:t.min.x,Vs.y=s.normal.y>0?t.max.y:t.min.y,Vs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Vs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function fd(){let i=null,t=!1,e=null,n=null;function s(a,r){e(a,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function np(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,f=l.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:p,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,c,l){const h=c.array,f=c.updateRanges;if(i.bindBuffer(l,o),f.length===0)i.bufferSubData(l,0,h);else{f.sort((d,m)=>d.start-m.start);let p=0;for(let d=1;d<f.length;d++){const m=f[p],_=f[d];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++p,f[p]=_)}f.length=p+1;for(let d=0,m=f.length;d<m;d++){const _=f[d];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class Ca extends Le{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,f=t/o,p=e/c,d=[],m=[],_=[],g=[];for(let u=0;u<h;u++){const x=u*p-r;for(let S=0;S<l;S++){const v=S*f-a;m.push(v,-x,0),_.push(0,0,1),g.push(S/o),g.push(1-u/c)}}for(let u=0;u<c;u++)for(let x=0;x<o;x++){const S=x+l*u,v=x+l*(u+1),I=x+1+l*(u+1),A=x+1+l*u;d.push(S,v,A),d.push(v,I,A)}this.setIndex(d),this.setAttribute("position",new ue(m,3)),this.setAttribute("normal",new ue(_,3)),this.setAttribute("uv",new ue(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ca(t.width,t.height,t.widthSegments,t.heightSegments)}}var ip=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,sp=`#ifdef USE_ALPHAHASH
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
#endif`,ap=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,op=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,cp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lp=`#ifdef USE_AOMAP
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
#endif`,dp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hp=`#ifdef USE_BATCHING
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
#endif`,up=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,pp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,mp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,gp=`#ifdef USE_IRIDESCENCE
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
#endif`,_p=`#ifdef USE_BUMPMAP
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
#endif`,xp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Sp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,bp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ep=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,wp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ap=`#define PI 3.141592653589793
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
} // validated`,Tp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Rp=`vec3 transformedNormal = objectNormal;
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
#endif`,Cp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Pp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Dp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ip="gl_FragColor = linearToOutputTexel( gl_FragColor );",kp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Up=`#ifdef USE_ENVMAP
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
#endif`,Fp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Np=`#ifdef USE_ENVMAP
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
#endif`,zp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Op=`#ifdef USE_ENVMAP
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
#endif`,Bp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Hp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Vp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Wp=`#ifdef USE_GRADIENTMAP
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
}`,Xp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$p=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Zp=`uniform bool receiveShadow;
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
#endif`,qp=`#ifdef USE_ENVMAP
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
#endif`,jp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Kp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,tm=`PhysicalMaterial material;
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
#endif`,em=`struct PhysicalMaterial {
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
}`,nm=`
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
#endif`,im=`#if defined( RE_IndirectDiffuse )
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
#endif`,sm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,am=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,om=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,hm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,um=`#if defined( USE_POINTS_UV )
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
#endif`,fm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_m=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xm=`#ifdef USE_MORPHTARGETS
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
#endif`,vm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ym=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Em=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,wm=`#ifdef USE_NORMALMAP
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
#endif`,Am=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Tm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Rm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Cm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Pm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Dm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Lm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Im=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,km=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Um=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Fm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Nm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,zm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Om=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Bm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Hm=`float getShadowMask() {
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
}`,Vm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gm=`#ifdef USE_SKINNING
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
#endif`,Wm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xm=`#ifdef USE_SKINNING
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
#endif`,$m=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ym=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Zm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,jm=`#ifdef USE_TRANSMISSION
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
#endif`,Km=`#ifdef USE_TRANSMISSION
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
#endif`,Jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,eg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ng=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ig=`uniform sampler2D t2D;
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
}`,sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ag=`#ifdef ENVMAP_TYPE_CUBE
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
}`,rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,og=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cg=`#include <common>
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
}`,lg=`#if DEPTH_PACKING == 3200
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
}`,dg=`#define DISTANCE
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
}`,hg=`#define DISTANCE
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
}`,ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pg=`uniform float scale;
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
}`,mg=`uniform vec3 diffuse;
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
}`,gg=`#include <common>
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
}`,_g=`uniform vec3 diffuse;
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
}`,xg=`#define LAMBERT
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
}`,vg=`#define LAMBERT
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
}`,Mg=`#define MATCAP
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
}`,yg=`#define MATCAP
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
}`,Sg=`#define NORMAL
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
}`,bg=`#define NORMAL
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
}`,Eg=`#define PHONG
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
}`,wg=`#define PHONG
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
}`,Ag=`#define STANDARD
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
}`,Tg=`#define STANDARD
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
}`,Rg=`#define TOON
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
}`,Cg=`#define TOON
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
}`,Pg=`uniform float size;
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
}`,Dg=`uniform vec3 diffuse;
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
}`,Lg=`#include <common>
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
}`,Ig=`uniform vec3 color;
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
}`,kg=`uniform float rotation;
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
}`,Ug=`uniform vec3 diffuse;
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
}`,$t={alphahash_fragment:ip,alphahash_pars_fragment:sp,alphamap_fragment:ap,alphamap_pars_fragment:rp,alphatest_fragment:op,alphatest_pars_fragment:cp,aomap_fragment:lp,aomap_pars_fragment:dp,batching_pars_vertex:hp,batching_vertex:up,begin_vertex:fp,beginnormal_vertex:pp,bsdfs:mp,iridescence_fragment:gp,bumpmap_pars_fragment:_p,clipping_planes_fragment:xp,clipping_planes_pars_fragment:vp,clipping_planes_pars_vertex:Mp,clipping_planes_vertex:yp,color_fragment:Sp,color_pars_fragment:bp,color_pars_vertex:Ep,color_vertex:wp,common:Ap,cube_uv_reflection_fragment:Tp,defaultnormal_vertex:Rp,displacementmap_pars_vertex:Cp,displacementmap_vertex:Pp,emissivemap_fragment:Dp,emissivemap_pars_fragment:Lp,colorspace_fragment:Ip,colorspace_pars_fragment:kp,envmap_fragment:Up,envmap_common_pars_fragment:Fp,envmap_pars_fragment:Np,envmap_pars_vertex:zp,envmap_physical_pars_fragment:qp,envmap_vertex:Op,fog_vertex:Bp,fog_pars_vertex:Hp,fog_fragment:Vp,fog_pars_fragment:Gp,gradientmap_pars_fragment:Wp,lightmap_pars_fragment:Xp,lights_lambert_fragment:$p,lights_lambert_pars_fragment:Yp,lights_pars_begin:Zp,lights_toon_fragment:jp,lights_toon_pars_fragment:Kp,lights_phong_fragment:Jp,lights_phong_pars_fragment:Qp,lights_physical_fragment:tm,lights_physical_pars_fragment:em,lights_fragment_begin:nm,lights_fragment_maps:im,lights_fragment_end:sm,logdepthbuf_fragment:am,logdepthbuf_pars_fragment:rm,logdepthbuf_pars_vertex:om,logdepthbuf_vertex:cm,map_fragment:lm,map_pars_fragment:dm,map_particle_fragment:hm,map_particle_pars_fragment:um,metalnessmap_fragment:fm,metalnessmap_pars_fragment:pm,morphinstance_vertex:mm,morphcolor_vertex:gm,morphnormal_vertex:_m,morphtarget_pars_vertex:xm,morphtarget_vertex:vm,normal_fragment_begin:Mm,normal_fragment_maps:ym,normal_pars_fragment:Sm,normal_pars_vertex:bm,normal_vertex:Em,normalmap_pars_fragment:wm,clearcoat_normal_fragment_begin:Am,clearcoat_normal_fragment_maps:Tm,clearcoat_pars_fragment:Rm,iridescence_pars_fragment:Cm,opaque_fragment:Pm,packing:Dm,premultiplied_alpha_fragment:Lm,project_vertex:Im,dithering_fragment:km,dithering_pars_fragment:Um,roughnessmap_fragment:Fm,roughnessmap_pars_fragment:Nm,shadowmap_pars_fragment:zm,shadowmap_pars_vertex:Om,shadowmap_vertex:Bm,shadowmask_pars_fragment:Hm,skinbase_vertex:Vm,skinning_pars_vertex:Gm,skinning_vertex:Wm,skinnormal_vertex:Xm,specularmap_fragment:$m,specularmap_pars_fragment:Ym,tonemapping_fragment:Zm,tonemapping_pars_fragment:qm,transmission_fragment:jm,transmission_pars_fragment:Km,uv_pars_fragment:Jm,uv_pars_vertex:Qm,uv_vertex:tg,worldpos_vertex:eg,background_vert:ng,background_frag:ig,backgroundCube_vert:sg,backgroundCube_frag:ag,cube_vert:rg,cube_frag:og,depth_vert:cg,depth_frag:lg,distanceRGBA_vert:dg,distanceRGBA_frag:hg,equirect_vert:ug,equirect_frag:fg,linedashed_vert:pg,linedashed_frag:mg,meshbasic_vert:gg,meshbasic_frag:_g,meshlambert_vert:xg,meshlambert_frag:vg,meshmatcap_vert:Mg,meshmatcap_frag:yg,meshnormal_vert:Sg,meshnormal_frag:bg,meshphong_vert:Eg,meshphong_frag:wg,meshphysical_vert:Ag,meshphysical_frag:Tg,meshtoon_vert:Rg,meshtoon_frag:Cg,points_vert:Pg,points_frag:Dg,shadow_vert:Lg,shadow_frag:Ig,sprite_vert:kg,sprite_frag:Ug},Et={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},envMapRotation:{value:new Wt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new Gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new Gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},rn={basic:{uniforms:we([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:we([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new Bt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:we([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:we([Et.common,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.roughnessmap,Et.metalnessmap,Et.fog,Et.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:we([Et.common,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.gradientmap,Et.fog,Et.lights,{emissive:{value:new Bt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:we([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:we([Et.points,Et.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:we([Et.common,Et.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:we([Et.common,Et.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:we([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:we([Et.sprite,Et.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Wt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:we([Et.common,Et.displacementmap,{referencePosition:{value:new $},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:we([Et.lights,Et.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};rn.physical={uniforms:we([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new Gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new Gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new Gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const Gs={r:0,b:0,g:0},jn=new hn,Fg=new oe;function Ng(i,t,e,n,s,a,r){const o=new Bt(0);let c=a===!0?0:1,l,h,f=null,p=0,d=null;function m(x){let S=x.isScene===!0?x.background:null;return S&&S.isTexture&&(S=(x.backgroundBlurriness>0?e:t).get(S)),S}function _(x){let S=!1;const v=m(x);v===null?u(o,c):v&&v.isColor&&(u(v,1),S=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,r):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(x,S){const v=m(S);v&&(v.isCubeTexture||v.mapping===Aa)?(h===void 0&&(h=new re(new un(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:Vi(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:De,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,A,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),jn.copy(S.backgroundRotation),jn.x*=-1,jn.y*=-1,jn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Fg.makeRotationFromEuler(jn)),h.material.toneMapped=Kt.getTransfer(v.colorSpace)!==ie,(f!==v||p!==v.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=v,p=v.version,d=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new re(new Ca(2,2),new Gn({name:"BackgroundMaterial",uniforms:Vi(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Vn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=Kt.getTransfer(v.colorSpace)!==ie,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||p!==v.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,f=v,p=v.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function u(x,S){x.getRGB(Gs,dd(i)),n.buffers.color.setClear(Gs.r,Gs.g,Gs.b,S,r)}return{getClearColor:function(){return o},setClearColor:function(x,S=1){o.set(x),c=S,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,u(o,c)},render:_,addToRenderList:g}}function zg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let a=s,r=!1;function o(M,R,Y,z,T){let D=!1;const U=f(z,Y,R);a!==U&&(a=U,l(a.object)),D=d(M,z,Y,T),D&&m(M,z,Y,T),T!==null&&t.update(T,i.ELEMENT_ARRAY_BUFFER),(D||r)&&(r=!1,v(M,R,Y,z),T!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(T).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function f(M,R,Y){const z=Y.wireframe===!0;let T=n[M.id];T===void 0&&(T={},n[M.id]=T);let D=T[R.id];D===void 0&&(D={},T[R.id]=D);let U=D[z];return U===void 0&&(U=p(c()),D[z]=U),U}function p(M){const R=[],Y=[],z=[];for(let T=0;T<e;T++)R[T]=0,Y[T]=0,z[T]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:Y,attributeDivisors:z,object:M,attributes:{},index:null}}function d(M,R,Y,z){const T=a.attributes,D=R.attributes;let U=0;const q=Y.getAttributes();for(const F in q)if(q[F].location>=0){const it=T[F];let ft=D[F];if(ft===void 0&&(F==="instanceMatrix"&&M.instanceMatrix&&(ft=M.instanceMatrix),F==="instanceColor"&&M.instanceColor&&(ft=M.instanceColor)),it===void 0||it.attribute!==ft||ft&&it.data!==ft.data)return!0;U++}return a.attributesNum!==U||a.index!==z}function m(M,R,Y,z){const T={},D=R.attributes;let U=0;const q=Y.getAttributes();for(const F in q)if(q[F].location>=0){let it=D[F];it===void 0&&(F==="instanceMatrix"&&M.instanceMatrix&&(it=M.instanceMatrix),F==="instanceColor"&&M.instanceColor&&(it=M.instanceColor));const ft={};ft.attribute=it,it&&it.data&&(ft.data=it.data),T[F]=ft,U++}a.attributes=T,a.attributesNum=U,a.index=z}function _(){const M=a.newAttributes;for(let R=0,Y=M.length;R<Y;R++)M[R]=0}function g(M){u(M,0)}function u(M,R){const Y=a.newAttributes,z=a.enabledAttributes,T=a.attributeDivisors;Y[M]=1,z[M]===0&&(i.enableVertexAttribArray(M),z[M]=1),T[M]!==R&&(i.vertexAttribDivisor(M,R),T[M]=R)}function x(){const M=a.newAttributes,R=a.enabledAttributes;for(let Y=0,z=R.length;Y<z;Y++)R[Y]!==M[Y]&&(i.disableVertexAttribArray(Y),R[Y]=0)}function S(M,R,Y,z,T,D,U){U===!0?i.vertexAttribIPointer(M,R,Y,T,D):i.vertexAttribPointer(M,R,Y,z,T,D)}function v(M,R,Y,z){_();const T=z.attributes,D=Y.getAttributes(),U=R.defaultAttributeValues;for(const q in D){const F=D[q];if(F.location>=0){let K=T[q];if(K===void 0&&(q==="instanceMatrix"&&M.instanceMatrix&&(K=M.instanceMatrix),q==="instanceColor"&&M.instanceColor&&(K=M.instanceColor)),K!==void 0){const it=K.normalized,ft=K.itemSize,ht=t.get(K);if(ht===void 0)continue;const xt=ht.buffer,J=ht.type,Q=ht.bytesPerElement,ot=J===i.INT||J===i.UNSIGNED_INT||K.gpuType===Bo;if(K.isInterleavedBufferAttribute){const pt=K.data,gt=pt.stride,St=K.offset;if(pt.isInstancedInterleavedBuffer){for(let Pt=0;Pt<F.locationSize;Pt++)u(F.location+Pt,pt.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let Pt=0;Pt<F.locationSize;Pt++)g(F.location+Pt);i.bindBuffer(i.ARRAY_BUFFER,xt);for(let Pt=0;Pt<F.locationSize;Pt++)S(F.location+Pt,ft/F.locationSize,J,it,gt*Q,(St+ft/F.locationSize*Pt)*Q,ot)}else{if(K.isInstancedBufferAttribute){for(let pt=0;pt<F.locationSize;pt++)u(F.location+pt,K.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let pt=0;pt<F.locationSize;pt++)g(F.location+pt);i.bindBuffer(i.ARRAY_BUFFER,xt);for(let pt=0;pt<F.locationSize;pt++)S(F.location+pt,ft/F.locationSize,J,it,ft*Q,ft/F.locationSize*pt*Q,ot)}}else if(U!==void 0){const it=U[q];if(it!==void 0)switch(it.length){case 2:i.vertexAttrib2fv(F.location,it);break;case 3:i.vertexAttrib3fv(F.location,it);break;case 4:i.vertexAttrib4fv(F.location,it);break;default:i.vertexAttrib1fv(F.location,it)}}}}x()}function I(){L();for(const M in n){const R=n[M];for(const Y in R){const z=R[Y];for(const T in z)h(z[T].object),delete z[T];delete R[Y]}delete n[M]}}function A(M){if(n[M.id]===void 0)return;const R=n[M.id];for(const Y in R){const z=R[Y];for(const T in z)h(z[T].object),delete z[T];delete R[Y]}delete n[M.id]}function P(M){for(const R in n){const Y=n[R];if(Y[M.id]===void 0)continue;const z=Y[M.id];for(const T in z)h(z[T].object),delete z[T];delete Y[M.id]}}function L(){b(),r=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:b,dispose:I,releaseStatesOfGeometry:A,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:g,disableUnusedAttributes:x}}function Og(i,t,e){let n;function s(l){n=l}function a(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,f){f!==0&&(i.drawArraysInstanced(n,l,h,f),e.update(h,n,f))}function o(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,f);let d=0;for(let m=0;m<f;m++)d+=h[m];e.update(d,n,1)}function c(l,h,f,p){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<l.length;m++)r(l[m],h[m],p[m]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,p,0,f);let m=0;for(let _=0;_<f;_++)m+=h[_]*p[_];e.update(m,n,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Bg(i,t,e,n){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(P){return!(P!==Ke&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const L=P===fs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==Rn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==wn&&!L)}function c(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=e.logarithmicDepthBuffer===!0,p=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=m>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:d,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:u,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:I,maxSamples:A}}function Hg(i){const t=this;let e=null,n=0,s=!1,a=!1;const r=new Qn,o=new Wt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const d=f.length!==0||p||n!==0||s;return s=p,n=f.length,d},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,p){e=h(f,p,0)},this.setState=function(f,p,d){const m=f.clippingPlanes,_=f.clipIntersection,g=f.clipShadows,u=i.get(f);if(!s||m===null||m.length===0||a&&!g)a?h(null):l();else{const x=a?0:n,S=x*4;let v=u.clippingState||null;c.value=v,v=h(m,p,S,d);for(let I=0;I!==S;++I)v[I]=e[I];u.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,p,d,m){const _=f!==null?f.length:0;let g=null;if(_!==0){if(g=c.value,m!==!0||g===null){const u=d+_*4,x=p.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<u)&&(g=new Float32Array(u));for(let S=0,v=d;S!==_;++S,v+=4)r.copy(f[S]).applyMatrix4(x,o),r.normal.toArray(g,v),g[v+3]=r.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function Vg(i){let t=new WeakMap;function e(r,o){return o===Zr?r.mapping=zi:o===qr&&(r.mapping=Oi),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===Zr||o===qr)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new Qf(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class pd extends hd{constructor(t=-1,e=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Li=4,Yc=[.125,.215,.35,.446,.526,.582],ni=20,fr=new pd,Zc=new Bt;let pr=null,mr=0,gr=0,_r=!1;const ti=(1+Math.sqrt(5))/2,Ti=1/ti,qc=[new $(-ti,Ti,0),new $(ti,Ti,0),new $(-Ti,0,ti),new $(Ti,0,ti),new $(0,ti,-Ti),new $(0,ti,Ti),new $(-1,1,-1),new $(1,1,-1),new $(-1,1,1),new $(1,1,1)];class jc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){pr=this._renderer.getRenderTarget(),mr=this._renderer.getActiveCubeFace(),gr=this._renderer.getActiveMipmapLevel(),_r=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(pr,mr,gr),this._renderer.xr.enabled=_r,t.scissorTest=!1,Ws(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zi||t.mapping===Oi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),pr=this._renderer.getRenderTarget(),mr=this._renderer.getActiveCubeFace(),gr=this._renderer.getActiveMipmapLevel(),_r=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:cn,minFilter:cn,generateMipmaps:!1,type:fs,format:Ke,colorSpace:Gi,depthBuffer:!1},s=Kc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kc(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gg(a)),this._blurMaterial=Wg(a,t,e)}return s}_compileMaterial(t){const e=new re(this._lodPlanes[0],t);this._renderer.compile(e,fr)}_sceneToCubeUV(t,e,n,s){const o=new He(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor(Zc),h.toneMapping=Bn,h.autoClear=!1;const d=new an({name:"PMREM.Background",side:De,depthWrite:!1,depthTest:!1}),m=new re(new un,d);let _=!1;const g=t.background;g?g.isColor&&(d.color.copy(g),t.background=null,_=!0):(d.color.copy(Zc),_=!0);for(let u=0;u<6;u++){const x=u%3;x===0?(o.up.set(0,c[u],0),o.lookAt(l[u],0,0)):x===1?(o.up.set(0,0,c[u]),o.lookAt(0,l[u],0)):(o.up.set(0,c[u],0),o.lookAt(0,0,l[u]));const S=this._cubeSize;Ws(s,x*S,u>2?S:0,S,S),h.setRenderTarget(s),_&&h.render(m,o),h.render(t,o)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===zi||t.mapping===Oi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jc());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new re(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;Ws(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,fr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=qc[(s-a-1)%qc.length];this._blur(t,a-1,a,r,o)}e.autoClear=n}_blur(t,e,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",a),this._halfBlur(r,t,n,n,s,"longitudinal",a)}_halfBlur(t,e,n,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new re(this._lodPlanes[s],l),p=l.uniforms,d=this._sizeLods[n]-1,m=isFinite(a)?Math.PI/(2*d):2*Math.PI/(2*ni-1),_=a/m,g=isFinite(a)?1+Math.floor(h*_):ni;g>ni&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ni}`);const u=[];let x=0;for(let P=0;P<ni;++P){const L=P/_,b=Math.exp(-L*L/2);u.push(b),P===0?x+=b:P<g&&(x+=2*b)}for(let P=0;P<u.length;P++)u[P]=u[P]/x;p.envMap.value=t.texture,p.samples.value=g,p.weights.value=u,p.latitudinal.value=r==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:S}=this;p.dTheta.value=m,p.mipInt.value=S-n;const v=this._sizeLods[s],I=3*v*(s>S-Li?s-S+Li:0),A=4*(this._cubeSize-v);Ws(e,I,A,3*v,2*v),c.setRenderTarget(e),c.render(f,fr)}}function Gg(i){const t=[],e=[],n=[];let s=i;const a=i-Li+1+Yc.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>i-Li?c=Yc[r-i+Li-1]:r===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,f=1+l,p=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,m=6,_=3,g=2,u=1,x=new Float32Array(_*m*d),S=new Float32Array(g*m*d),v=new Float32Array(u*m*d);for(let A=0;A<d;A++){const P=A%3*2/3-1,L=A>2?0:-1,b=[P,L,0,P+2/3,L,0,P+2/3,L+1,0,P,L,0,P+2/3,L+1,0,P,L+1,0];x.set(b,_*m*A),S.set(p,g*m*A);const M=[A,A,A,A,A,A];v.set(M,u*m*A)}const I=new Le;I.setAttribute("position",new Qe(x,_)),I.setAttribute("uv",new Qe(S,g)),I.setAttribute("faceIndex",new Qe(v,u)),t.push(I),s>Li&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Kc(i,t,e){const n=new oi(i,t,e);return n.texture.mapping=Aa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ws(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Wg(i,t,e){const n=new Float32Array(ni),s=new $(0,1,0);return new Gn({name:"SphericalGaussianBlur",defines:{n:ni,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:qo(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function Jc(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qo(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function Qc(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function qo(){return`

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
	`}function Xg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Zr||c===qr,h=c===zi||c===Oi;if(l||h){let f=t.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return e===null&&(e=new jc(i)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new jc(i)),f=l?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function $g(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&as("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Yg(i,t,e,n){const s={},a=new WeakMap;function r(f){const p=f.target;p.index!==null&&t.remove(p.index);for(const m in p.attributes)t.remove(p.attributes[m]);for(const m in p.morphAttributes){const _=p.morphAttributes[m];for(let g=0,u=_.length;g<u;g++)t.remove(_[g])}p.removeEventListener("dispose",r),delete s[p.id];const d=a.get(p);d&&(t.remove(d),a.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",r),s[p.id]=!0,e.memory.geometries++),p}function c(f){const p=f.attributes;for(const m in p)t.update(p[m],i.ARRAY_BUFFER);const d=f.morphAttributes;for(const m in d){const _=d[m];for(let g=0,u=_.length;g<u;g++)t.update(_[g],i.ARRAY_BUFFER)}}function l(f){const p=[],d=f.index,m=f.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let S=0,v=x.length;S<v;S+=3){const I=x[S+0],A=x[S+1],P=x[S+2];p.push(I,A,A,P,P,I)}}else if(m!==void 0){const x=m.array;_=m.version;for(let S=0,v=x.length/3-1;S<v;S+=3){const I=S+0,A=S+1,P=S+2;p.push(I,A,A,P,P,I)}}else return;const g=new(sd(p)?ld:cd)(p,1);g.version=_;const u=a.get(f);u&&t.remove(u),a.set(f,g)}function h(f){const p=a.get(f);if(p){const d=f.index;d!==null&&p.version<d.version&&l(f)}else l(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function Zg(i,t,e){let n;function s(p){n=p}let a,r;function o(p){a=p.type,r=p.bytesPerElement}function c(p,d){i.drawElements(n,d,a,p*r),e.update(d,n,1)}function l(p,d,m){m!==0&&(i.drawElementsInstanced(n,d,a,p*r,m),e.update(d,n,m))}function h(p,d,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,a,p,0,m);let g=0;for(let u=0;u<m;u++)g+=d[u];e.update(g,n,1)}function f(p,d,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let u=0;u<p.length;u++)l(p[u]/r,d[u],_[u]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,a,p,0,_,0,m);let u=0;for(let x=0;x<m;x++)u+=d[x]*_[x];e.update(u,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function qg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function jg(i,t,e){const n=new WeakMap,s=new de;function a(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let p=n.get(o);if(p===void 0||p.count!==f){let M=function(){L.dispose(),n.delete(o),o.removeEventListener("dispose",M)};var d=M;p!==void 0&&p.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let v=0;m===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let I=o.attributes.position.count*v,A=1;I>t.maxTextureSize&&(A=Math.ceil(I/t.maxTextureSize),I=t.maxTextureSize);const P=new Float32Array(I*A*4*f),L=new rd(P,I,A,f);L.type=wn,L.needsUpdate=!0;const b=v*4;for(let R=0;R<f;R++){const Y=u[R],z=x[R],T=S[R],D=I*A*4*R;for(let U=0;U<Y.count;U++){const q=U*b;m===!0&&(s.fromBufferAttribute(Y,U),P[D+q+0]=s.x,P[D+q+1]=s.y,P[D+q+2]=s.z,P[D+q+3]=0),_===!0&&(s.fromBufferAttribute(z,U),P[D+q+4]=s.x,P[D+q+5]=s.y,P[D+q+6]=s.z,P[D+q+7]=0),g===!0&&(s.fromBufferAttribute(T,U),P[D+q+8]=s.x,P[D+q+9]=s.y,P[D+q+10]=s.z,P[D+q+11]=T.itemSize===4?s.w:1)}}p={count:f,texture:L,size:new Gt(I,A)},n.set(o,p),o.addEventListener("dispose",M)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const _=o.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:a}}function Kg(i,t,e,n){let s=new WeakMap;function a(c){const l=n.render.frame,h=c.geometry,f=t.get(c,h);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==l&&(p.update(),s.set(p,l))}return f}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class md extends Re{constructor(t,e,n,s,a,r,o,c,l,h=Ui){if(h!==Ui&&h!==Hi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ui&&(n=ri),n===void 0&&h===Hi&&(n=Bi),super(null,s,a,r,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Je,this.minFilter=c!==void 0?c:Je,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const gd=new Re,tl=new md(1,1),_d=new rd,xd=new Nf,vd=new ud,el=[],nl=[],il=new Float32Array(16),sl=new Float32Array(9),al=new Float32Array(4);function Xi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let a=el[s];if(a===void 0&&(a=new Float32Array(s),el[s]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,i[r].toArray(a,o)}return a}function _e(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Pa(i,t){let e=nl[t];e===void 0&&(e=new Int32Array(t),nl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Jg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2fv(this.addr,t),xe(e,t)}}function t0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;i.uniform3fv(this.addr,t),xe(e,t)}}function e0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4fv(this.addr,t),xe(e,t)}}function n0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;al.set(n),i.uniformMatrix2fv(this.addr,!1,al),xe(e,n)}}function i0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;sl.set(n),i.uniformMatrix3fv(this.addr,!1,sl),xe(e,n)}}function s0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),xe(e,t)}else{if(_e(e,n))return;il.set(n),i.uniformMatrix4fv(this.addr,!1,il),xe(e,n)}}function a0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function r0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2iv(this.addr,t),xe(e,t)}}function o0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3iv(this.addr,t),xe(e,t)}}function c0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4iv(this.addr,t),xe(e,t)}}function l0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function d0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;i.uniform2uiv(this.addr,t),xe(e,t)}}function h0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;i.uniform3uiv(this.addr,t),xe(e,t)}}function u0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;i.uniform4uiv(this.addr,t),xe(e,t)}}function f0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(tl.compareFunction=id,a=tl):a=gd,e.setTexture2D(t||a,s)}function p0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||xd,s)}function m0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||vd,s)}function g0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||_d,s)}function _0(i){switch(i){case 5126:return Jg;case 35664:return Qg;case 35665:return t0;case 35666:return e0;case 35674:return n0;case 35675:return i0;case 35676:return s0;case 5124:case 35670:return a0;case 35667:case 35671:return r0;case 35668:case 35672:return o0;case 35669:case 35673:return c0;case 5125:return l0;case 36294:return d0;case 36295:return h0;case 36296:return u0;case 35678:case 36198:case 36298:case 36306:case 35682:return f0;case 35679:case 36299:case 36307:return p0;case 35680:case 36300:case 36308:case 36293:return m0;case 36289:case 36303:case 36311:case 36292:return g0}}function x0(i,t){i.uniform1fv(this.addr,t)}function v0(i,t){const e=Xi(t,this.size,2);i.uniform2fv(this.addr,e)}function M0(i,t){const e=Xi(t,this.size,3);i.uniform3fv(this.addr,e)}function y0(i,t){const e=Xi(t,this.size,4);i.uniform4fv(this.addr,e)}function S0(i,t){const e=Xi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function b0(i,t){const e=Xi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function E0(i,t){const e=Xi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function w0(i,t){i.uniform1iv(this.addr,t)}function A0(i,t){i.uniform2iv(this.addr,t)}function T0(i,t){i.uniform3iv(this.addr,t)}function R0(i,t){i.uniform4iv(this.addr,t)}function C0(i,t){i.uniform1uiv(this.addr,t)}function P0(i,t){i.uniform2uiv(this.addr,t)}function D0(i,t){i.uniform3uiv(this.addr,t)}function L0(i,t){i.uniform4uiv(this.addr,t)}function I0(i,t,e){const n=this.cache,s=t.length,a=Pa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||gd,a[r])}function k0(i,t,e){const n=this.cache,s=t.length,a=Pa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||xd,a[r])}function U0(i,t,e){const n=this.cache,s=t.length,a=Pa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||vd,a[r])}function F0(i,t,e){const n=this.cache,s=t.length,a=Pa(e,s);_e(n,a)||(i.uniform1iv(this.addr,a),xe(n,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||_d,a[r])}function N0(i){switch(i){case 5126:return x0;case 35664:return v0;case 35665:return M0;case 35666:return y0;case 35674:return S0;case 35675:return b0;case 35676:return E0;case 5124:case 35670:return w0;case 35667:case 35671:return A0;case 35668:case 35672:return T0;case 35669:case 35673:return R0;case 5125:return C0;case 36294:return P0;case 36295:return D0;case 36296:return L0;case 35678:case 36198:case 36298:case 36306:case 35682:return I0;case 35679:case 36299:case 36307:return k0;case 35680:case 36300:case 36308:case 36293:return U0;case 36289:case 36303:case 36311:case 36292:return F0}}class z0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=_0(e.type)}}class O0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=N0(e.type)}}class B0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],n)}}}const xr=/(\w+)(\])?(\[|\.)?/g;function rl(i,t){i.seq.push(t),i.map[t.id]=t}function H0(i,t,e){const n=i.name,s=n.length;for(xr.lastIndex=0;;){const a=xr.exec(n),r=xr.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){rl(e,l===void 0?new z0(o,i,t):new O0(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new B0(o),rl(e,f)),e=f}}}class la{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);H0(a,r,this)}}setValue(t,e,n,s){const a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function ol(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const V0=37297;let G0=0;function W0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}const cl=new Wt;function X0(i){Kt._getMatrix(cl,Kt.workingColorSpace,i);const t=`mat3( ${cl.elements.map(e=>e.toFixed(4))} )`;switch(Kt.getTransfer(i)){case Ta:return[t,"LinearTransferOETF"];case ie:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function ll(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+W0(i.getShaderSource(t),r)}else return s}function $0(i,t){const e=X0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Y0(i,t){let e;switch(t){case df:e="Linear";break;case hf:e="Reinhard";break;case uf:e="Cineon";break;case ff:e="ACESFilmic";break;case mf:e="AgX";break;case gf:e="Neutral";break;case pf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Xs=new $;function Z0(){Kt.getLuminanceCoefficients(Xs);const i=Xs.x.toFixed(4),t=Xs.y.toFixed(4),e=Xs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function q0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(rs).join(`
`)}function j0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function K0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(t,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:i.getAttribLocation(t,r),locationSize:o}}return e}function rs(i){return i!==""}function dl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const J0=/^[ \t]*#include +<([\w\d./]+)>/gm;function To(i){return i.replace(J0,t_)}const Q0=new Map;function t_(i,t){let e=$t[t];if(e===void 0){const n=Q0.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return To(e)}const e_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ul(i){return i.replace(e_,n_)}function n_(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function fl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function i_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Gl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Wl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===bn&&(t="SHADOWMAP_TYPE_VSM"),t}function s_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case zi:case Oi:t="ENVMAP_TYPE_CUBE";break;case Aa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function a_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Oi:t="ENVMAP_MODE_REFRACTION";break}return t}function r_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Oo:t="ENVMAP_BLENDING_MULTIPLY";break;case cf:t="ENVMAP_BLENDING_MIX";break;case lf:t="ENVMAP_BLENDING_ADD";break}return t}function o_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function c_(i,t,e,n){const s=i.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=i_(e),l=s_(e),h=a_(e),f=r_(e),p=o_(e),d=q0(e),m=j0(a),_=s.createProgram();let g,u,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(rs).join(`
`),g.length>0&&(g+=`
`),u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(rs).join(`
`),u.length>0&&(u+=`
`)):(g=[fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rs).join(`
`),u=[fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Bn?"#define TONE_MAPPING":"",e.toneMapping!==Bn?$t.tonemapping_pars_fragment:"",e.toneMapping!==Bn?Y0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,$0("linearToOutputTexel",e.outputColorSpace),Z0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(rs).join(`
`)),r=To(r),r=dl(r,e),r=hl(r,e),o=To(o),o=dl(o,e),o=hl(o,e),r=ul(r),o=ul(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,u=["#define varying in",e.glslVersion===Ac?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ac?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const S=x+g+r,v=x+u+o,I=ol(s,s.VERTEX_SHADER,S),A=ol(s,s.FRAGMENT_SHADER,v);s.attachShader(_,I),s.attachShader(_,A),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function P(R){if(i.debug.checkShaderErrors){const Y=s.getProgramInfoLog(_).trim(),z=s.getShaderInfoLog(I).trim(),T=s.getShaderInfoLog(A).trim();let D=!0,U=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(D=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,I,A);else{const q=ll(s,I,"vertex"),F=ll(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+Y+`
`+q+`
`+F)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(z===""||T==="")&&(U=!1);U&&(R.diagnostics={runnable:D,programLog:Y,vertexShader:{log:z,prefix:g},fragmentShader:{log:T,prefix:u}})}s.deleteShader(I),s.deleteShader(A),L=new la(s,_),b=K0(s,_)}let L;this.getUniforms=function(){return L===void 0&&P(this),L};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,V0)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=G0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=I,this.fragmentShader=A,this}let l_=0;class d_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new h_(t),e.set(t,n)),n}}class h_{constructor(t){this.id=l_++,this.code=t,this.usedTimes=0}}function u_(i,t,e,n,s,a,r){const o=new Yo,c=new d_,l=new Set,h=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let d=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,M,R,Y,z){const T=Y.fog,D=z.geometry,U=b.isMeshStandardMaterial?Y.environment:null,q=(b.isMeshStandardMaterial?e:t).get(b.envMap||U),F=q&&q.mapping===Aa?q.image.height:null,K=m[b.type];b.precision!==null&&(d=s.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const it=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,ft=it!==void 0?it.length:0;let ht=0;D.morphAttributes.position!==void 0&&(ht=1),D.morphAttributes.normal!==void 0&&(ht=2),D.morphAttributes.color!==void 0&&(ht=3);let xt,J,Q,ot;if(K){const Vt=rn[K];xt=Vt.vertexShader,J=Vt.fragmentShader}else xt=b.vertexShader,J=b.fragmentShader,c.update(b),Q=c.getVertexShaderID(b),ot=c.getFragmentShaderID(b);const pt=i.getRenderTarget(),gt=i.state.buffers.depth.getReversed(),St=z.isInstancedMesh===!0,Pt=z.isBatchedMesh===!0,Ut=!!b.map,_t=!!b.matcap,Xt=!!q,N=!!b.aoMap,Zt=!!b.lightMap,lt=!!b.bumpMap,Tt=!!b.normalMap,j=!!b.displacementMap,at=!!b.emissiveMap,ut=!!b.metalnessMap,w=!!b.roughnessMap,y=b.anisotropy>0,H=b.clearcoat>0,C=b.dispersion>0,W=b.iridescence>0,Z=b.sheen>0,nt=b.transmission>0,rt=y&&!!b.anisotropyMap,mt=H&&!!b.clearcoatMap,Rt=H&&!!b.clearcoatNormalMap,ct=H&&!!b.clearcoatRoughnessMap,vt=W&&!!b.iridescenceMap,Ct=W&&!!b.iridescenceThicknessMap,kt=Z&&!!b.sheenColorMap,bt=Z&&!!b.sheenRoughnessMap,zt=!!b.specularMap,Ft=!!b.specularColorMap,Yt=!!b.specularIntensityMap,O=nt&&!!b.transmissionMap,B=nt&&!!b.thicknessMap,k=!!b.gradientMap,V=!!b.alphaMap,st=b.alphaTest>0,dt=!!b.alphaHash,yt=!!b.extensions;let Ht=Bn;b.toneMapped&&(pt===null||pt.isXRRenderTarget===!0)&&(Ht=i.toneMapping);const te={shaderID:K,shaderType:b.type,shaderName:b.name,vertexShader:xt,fragmentShader:J,defines:b.defines,customVertexShaderID:Q,customFragmentShaderID:ot,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:Pt,batchingColor:Pt&&z._colorsTexture!==null,instancing:St,instancingColor:St&&z.instanceColor!==null,instancingMorph:St&&z.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:pt===null?i.outputColorSpace:pt.isXRRenderTarget===!0?pt.texture.colorSpace:Gi,alphaToCoverage:!!b.alphaToCoverage,map:Ut,matcap:_t,envMap:Xt,envMapMode:Xt&&q.mapping,envMapCubeUVHeight:F,aoMap:N,lightMap:Zt,bumpMap:lt,normalMap:Tt,displacementMap:p&&j,emissiveMap:at,normalMapObjectSpace:Tt&&b.normalMapType===Mf,normalMapTangentSpace:Tt&&b.normalMapType===nd,metalnessMap:ut,roughnessMap:w,anisotropy:y,anisotropyMap:rt,clearcoat:H,clearcoatMap:mt,clearcoatNormalMap:Rt,clearcoatRoughnessMap:ct,dispersion:C,iridescence:W,iridescenceMap:vt,iridescenceThicknessMap:Ct,sheen:Z,sheenColorMap:kt,sheenRoughnessMap:bt,specularMap:zt,specularColorMap:Ft,specularIntensityMap:Yt,transmission:nt,transmissionMap:O,thicknessMap:B,gradientMap:k,opaque:b.transparent===!1&&b.blending===ki&&b.alphaToCoverage===!1,alphaMap:V,alphaTest:st,alphaHash:dt,combine:b.combine,mapUv:Ut&&_(b.map.channel),aoMapUv:N&&_(b.aoMap.channel),lightMapUv:Zt&&_(b.lightMap.channel),bumpMapUv:lt&&_(b.bumpMap.channel),normalMapUv:Tt&&_(b.normalMap.channel),displacementMapUv:j&&_(b.displacementMap.channel),emissiveMapUv:at&&_(b.emissiveMap.channel),metalnessMapUv:ut&&_(b.metalnessMap.channel),roughnessMapUv:w&&_(b.roughnessMap.channel),anisotropyMapUv:rt&&_(b.anisotropyMap.channel),clearcoatMapUv:mt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Rt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ct&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ct&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:kt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:bt&&_(b.sheenRoughnessMap.channel),specularMapUv:zt&&_(b.specularMap.channel),specularColorMapUv:Ft&&_(b.specularColorMap.channel),specularIntensityMapUv:Yt&&_(b.specularIntensityMap.channel),transmissionMapUv:O&&_(b.transmissionMap.channel),thicknessMapUv:B&&_(b.thicknessMap.channel),alphaMapUv:V&&_(b.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Tt||y),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!D.attributes.uv&&(Ut||V),fog:!!T,useFog:b.fog===!0,fogExp2:!!T&&T.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:gt,skinning:z.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:ft,morphTextureStride:ht,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ht,decodeVideoTexture:Ut&&b.map.isVideoTexture===!0&&Kt.getTransfer(b.map.colorSpace)===ie,decodeVideoTextureEmissive:at&&b.emissiveMap.isVideoTexture===!0&&Kt.getTransfer(b.emissiveMap.colorSpace)===ie,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ae,flipSided:b.side===De,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:yt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(yt&&b.extensions.multiDraw===!0||Pt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return te.vertexUv1s=l.has(1),te.vertexUv2s=l.has(2),te.vertexUv3s=l.has(3),l.clear(),te}function u(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)M.push(R),M.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(x(M,b),S(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function x(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function S(b,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),b.push(o.mask)}function v(b){const M=m[b.type];let R;if(M){const Y=rn[M];R=qf.clone(Y.uniforms)}else R=b.uniforms;return R}function I(b,M){let R;for(let Y=0,z=h.length;Y<z;Y++){const T=h[Y];if(T.cacheKey===M){R=T,++R.usedTimes;break}}return R===void 0&&(R=new c_(i,M,b,a),h.push(R)),R}function A(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function P(b){c.remove(b)}function L(){c.dispose()}return{getParameters:g,getProgramCacheKey:u,getUniforms:v,acquireProgram:I,releaseProgram:A,releaseShaderCache:P,programs:h,dispose:L}}function f_(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:a}}function p_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function pl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ml(){const i=[];let t=0;const e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function r(f,p,d,m,_,g){let u=i[t];return u===void 0?(u={id:f.id,object:f,geometry:p,material:d,groupOrder:m,renderOrder:f.renderOrder,z:_,group:g},i[t]=u):(u.id=f.id,u.object=f,u.geometry=p,u.material=d,u.groupOrder=m,u.renderOrder=f.renderOrder,u.z=_,u.group=g),t++,u}function o(f,p,d,m,_,g){const u=r(f,p,d,m,_,g);d.transmission>0?n.push(u):d.transparent===!0?s.push(u):e.push(u)}function c(f,p,d,m,_,g){const u=r(f,p,d,m,_,g);d.transmission>0?n.unshift(u):d.transparent===!0?s.unshift(u):e.unshift(u)}function l(f,p){e.length>1&&e.sort(f||p_),n.length>1&&n.sort(p||pl),s.length>1&&s.sort(p||pl)}function h(){for(let f=t,p=i.length;f<p;f++){const d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:o,unshift:c,finish:h,sort:l}}function m_(){let i=new WeakMap;function t(n,s){const a=i.get(n);let r;return a===void 0?(r=new ml,i.set(n,[r])):s>=a.length?(r=new ml,a.push(r)):r=a[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function g_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new $,color:new Bt};break;case"SpotLight":e={position:new $,direction:new $,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new $,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new $,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new $,halfWidth:new $,halfHeight:new $};break}return i[t.id]=e,e}}}function __(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let x_=0;function v_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function M_(i){const t=new g_,e=__(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new $);const s=new $,a=new oe,r=new oe;function o(l){let h=0,f=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,m=0,_=0,g=0,u=0,x=0,S=0,v=0,I=0,A=0,P=0;l.sort(v_);for(let b=0,M=l.length;b<M;b++){const R=l[b],Y=R.color,z=R.intensity,T=R.distance,D=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=Y.r*z,f+=Y.g*z,p+=Y.b*z;else if(R.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(R.sh.coefficients[U],z);P++}else if(R.isDirectionalLight){const U=t.get(R);if(U.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const q=R.shadow,F=e.get(R);F.shadowIntensity=q.intensity,F.shadowBias=q.bias,F.shadowNormalBias=q.normalBias,F.shadowRadius=q.radius,F.shadowMapSize=q.mapSize,n.directionalShadow[d]=F,n.directionalShadowMap[d]=D,n.directionalShadowMatrix[d]=R.shadow.matrix,x++}n.directional[d]=U,d++}else if(R.isSpotLight){const U=t.get(R);U.position.setFromMatrixPosition(R.matrixWorld),U.color.copy(Y).multiplyScalar(z),U.distance=T,U.coneCos=Math.cos(R.angle),U.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),U.decay=R.decay,n.spot[_]=U;const q=R.shadow;if(R.map&&(n.spotLightMap[I]=R.map,I++,q.updateMatrices(R),R.castShadow&&A++),n.spotLightMatrix[_]=q.matrix,R.castShadow){const F=e.get(R);F.shadowIntensity=q.intensity,F.shadowBias=q.bias,F.shadowNormalBias=q.normalBias,F.shadowRadius=q.radius,F.shadowMapSize=q.mapSize,n.spotShadow[_]=F,n.spotShadowMap[_]=D,v++}_++}else if(R.isRectAreaLight){const U=t.get(R);U.color.copy(Y).multiplyScalar(z),U.halfWidth.set(R.width*.5,0,0),U.halfHeight.set(0,R.height*.5,0),n.rectArea[g]=U,g++}else if(R.isPointLight){const U=t.get(R);if(U.color.copy(R.color).multiplyScalar(R.intensity),U.distance=R.distance,U.decay=R.decay,R.castShadow){const q=R.shadow,F=e.get(R);F.shadowIntensity=q.intensity,F.shadowBias=q.bias,F.shadowNormalBias=q.normalBias,F.shadowRadius=q.radius,F.shadowMapSize=q.mapSize,F.shadowCameraNear=q.camera.near,F.shadowCameraFar=q.camera.far,n.pointShadow[m]=F,n.pointShadowMap[m]=D,n.pointShadowMatrix[m]=R.shadow.matrix,S++}n.point[m]=U,m++}else if(R.isHemisphereLight){const U=t.get(R);U.skyColor.copy(R.color).multiplyScalar(z),U.groundColor.copy(R.groundColor).multiplyScalar(z),n.hemi[u]=U,u++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Et.LTC_FLOAT_1,n.rectAreaLTC2=Et.LTC_FLOAT_2):(n.rectAreaLTC1=Et.LTC_HALF_1,n.rectAreaLTC2=Et.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=p;const L=n.hash;(L.directionalLength!==d||L.pointLength!==m||L.spotLength!==_||L.rectAreaLength!==g||L.hemiLength!==u||L.numDirectionalShadows!==x||L.numPointShadows!==S||L.numSpotShadows!==v||L.numSpotMaps!==I||L.numLightProbes!==P)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=g,n.point.length=m,n.hemi.length=u,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=v+I-A,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=P,L.directionalLength=d,L.pointLength=m,L.spotLength=_,L.rectAreaLength=g,L.hemiLength=u,L.numDirectionalShadows=x,L.numPointShadows=S,L.numSpotShadows=v,L.numSpotMaps=I,L.numLightProbes=P,n.version=x_++)}function c(l,h){let f=0,p=0,d=0,m=0,_=0;const g=h.matrixWorldInverse;for(let u=0,x=l.length;u<x;u++){const S=l[u];if(S.isDirectionalLight){const v=n.directional[f];v.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),f++}else if(S.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),d++}else if(S.isRectAreaLight){const v=n.rectArea[m];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(g),r.identity(),a.copy(S.matrixWorld),a.premultiply(g),r.extractRotation(a),v.halfWidth.set(S.width*.5,0,0),v.halfHeight.set(0,S.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),m++}else if(S.isPointLight){const v=n.point[p];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(g),p++}else if(S.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:o,setupView:c,state:n}}function gl(i){const t=new M_(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function a(h){e.push(h)}function r(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function y_(i){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new gl(i),t.set(s,[o])):a>=r.length?(o=new gl(i),r.push(o)):o=r[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class S_ extends ci{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=xf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class b_ extends ci{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const E_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,w_=`uniform sampler2D shadow_pass;
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
}`;function A_(i,t,e){let n=new Zo;const s=new Gt,a=new Gt,r=new de,o=new S_({depthPacking:vf}),c=new b_,l={},h=e.maxTextureSize,f={[Vn]:De,[De]:Vn,[Ae]:Ae},p=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Gt},radius:{value:4}},vertexShader:E_,fragmentShader:w_}),d=p.clone();d.defines.HORIZONTAL_PASS=1;const m=new Le;m.setAttribute("position",new Qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new re(m,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Gl;let u=this.type;this.render=function(A,P,L){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;const b=i.getRenderTarget(),M=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),Y=i.state;Y.setBlending(On),Y.buffers.color.setClear(1,1,1,1),Y.buffers.depth.setTest(!0),Y.setScissorTest(!1);const z=u!==bn&&this.type===bn,T=u===bn&&this.type!==bn;for(let D=0,U=A.length;D<U;D++){const q=A[D],F=q.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);const K=F.getFrameExtents();if(s.multiply(K),a.copy(F.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/K.x),s.x=a.x*K.x,F.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/K.y),s.y=a.y*K.y,F.mapSize.y=a.y)),F.map===null||z===!0||T===!0){const ft=this.type!==bn?{minFilter:Je,magFilter:Je}:{};F.map!==null&&F.map.dispose(),F.map=new oi(s.x,s.y,ft),F.map.texture.name=q.name+".shadowMap",F.camera.updateProjectionMatrix()}i.setRenderTarget(F.map),i.clear();const it=F.getViewportCount();for(let ft=0;ft<it;ft++){const ht=F.getViewport(ft);r.set(a.x*ht.x,a.y*ht.y,a.x*ht.z,a.y*ht.w),Y.viewport(r),F.updateMatrices(q,ft),n=F.getFrustum(),v(P,L,F.camera,q,this.type)}F.isPointLightShadow!==!0&&this.type===bn&&x(F,L),F.needsUpdate=!1}u=this.type,g.needsUpdate=!1,i.setRenderTarget(b,M,R)};function x(A,P){const L=t.update(_);p.defines.VSM_SAMPLES!==A.blurSamples&&(p.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new oi(s.x,s.y)),p.uniforms.shadow_pass.value=A.map.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(P,null,L,p,_,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(P,null,L,d,_,null)}function S(A,P,L,b){let M=null;const R=L.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(R!==void 0)M=R;else if(M=L.isPointLight===!0?c:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const Y=M.uuid,z=P.uuid;let T=l[Y];T===void 0&&(T={},l[Y]=T);let D=T[z];D===void 0&&(D=M.clone(),T[z]=D,P.addEventListener("dispose",I)),M=D}if(M.visible=P.visible,M.wireframe=P.wireframe,b===bn?M.side=P.shadowSide!==null?P.shadowSide:P.side:M.side=P.shadowSide!==null?P.shadowSide:f[P.side],M.alphaMap=P.alphaMap,M.alphaTest=P.alphaTest,M.map=P.map,M.clipShadows=P.clipShadows,M.clippingPlanes=P.clippingPlanes,M.clipIntersection=P.clipIntersection,M.displacementMap=P.displacementMap,M.displacementScale=P.displacementScale,M.displacementBias=P.displacementBias,M.wireframeLinewidth=P.wireframeLinewidth,M.linewidth=P.linewidth,L.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const Y=i.properties.get(M);Y.light=L}return M}function v(A,P,L,b,M){if(A.visible===!1)return;if(A.layers.test(P.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===bn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,A.matrixWorld);const z=t.update(A),T=A.material;if(Array.isArray(T)){const D=z.groups;for(let U=0,q=D.length;U<q;U++){const F=D[U],K=T[F.materialIndex];if(K&&K.visible){const it=S(A,K,b,M);A.onBeforeShadow(i,A,P,L,z,it,F),i.renderBufferDirect(L,null,z,it,A,F),A.onAfterShadow(i,A,P,L,z,it,F)}}}else if(T.visible){const D=S(A,T,b,M);A.onBeforeShadow(i,A,P,L,z,D,null),i.renderBufferDirect(L,null,z,D,A,null),A.onAfterShadow(i,A,P,L,z,D,null)}}const Y=A.children;for(let z=0,T=Y.length;z<T;z++)v(Y[z],P,L,b,M)}function I(A){A.target.removeEventListener("dispose",I);for(const L in l){const b=l[L],M=A.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const T_={[Hr]:Vr,[Gr]:$r,[Wr]:Yr,[Ni]:Xr,[Vr]:Hr,[$r]:Gr,[Yr]:Wr,[Xr]:Ni};function R_(i,t){function e(){let O=!1;const B=new de;let k=null;const V=new de(0,0,0,0);return{setMask:function(st){k!==st&&!O&&(i.colorMask(st,st,st,st),k=st)},setLocked:function(st){O=st},setClear:function(st,dt,yt,Ht,te){te===!0&&(st*=Ht,dt*=Ht,yt*=Ht),B.set(st,dt,yt,Ht),V.equals(B)===!1&&(i.clearColor(st,dt,yt,Ht),V.copy(B))},reset:function(){O=!1,k=null,V.set(-1,0,0,0)}}}function n(){let O=!1,B=!1,k=null,V=null,st=null;return{setReversed:function(dt){if(B!==dt){const yt=t.get("EXT_clip_control");B?yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.ZERO_TO_ONE_EXT):yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.NEGATIVE_ONE_TO_ONE_EXT);const Ht=st;st=null,this.setClear(Ht)}B=dt},getReversed:function(){return B},setTest:function(dt){dt?pt(i.DEPTH_TEST):gt(i.DEPTH_TEST)},setMask:function(dt){k!==dt&&!O&&(i.depthMask(dt),k=dt)},setFunc:function(dt){if(B&&(dt=T_[dt]),V!==dt){switch(dt){case Hr:i.depthFunc(i.NEVER);break;case Vr:i.depthFunc(i.ALWAYS);break;case Gr:i.depthFunc(i.LESS);break;case Ni:i.depthFunc(i.LEQUAL);break;case Wr:i.depthFunc(i.EQUAL);break;case Xr:i.depthFunc(i.GEQUAL);break;case $r:i.depthFunc(i.GREATER);break;case Yr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}V=dt}},setLocked:function(dt){O=dt},setClear:function(dt){st!==dt&&(B&&(dt=1-dt),i.clearDepth(dt),st=dt)},reset:function(){O=!1,k=null,V=null,st=null,B=!1}}}function s(){let O=!1,B=null,k=null,V=null,st=null,dt=null,yt=null,Ht=null,te=null;return{setTest:function(Vt){O||(Vt?pt(i.STENCIL_TEST):gt(i.STENCIL_TEST))},setMask:function(Vt){B!==Vt&&!O&&(i.stencilMask(Vt),B=Vt)},setFunc:function(Vt,qt,ce){(k!==Vt||V!==qt||st!==ce)&&(i.stencilFunc(Vt,qt,ce),k=Vt,V=qt,st=ce)},setOp:function(Vt,qt,ce){(dt!==Vt||yt!==qt||Ht!==ce)&&(i.stencilOp(Vt,qt,ce),dt=Vt,yt=qt,Ht=ce)},setLocked:function(Vt){O=Vt},setClear:function(Vt){te!==Vt&&(i.clearStencil(Vt),te=Vt)},reset:function(){O=!1,B=null,k=null,V=null,st=null,dt=null,yt=null,Ht=null,te=null}}}const a=new e,r=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},f={},p=new WeakMap,d=[],m=null,_=!1,g=null,u=null,x=null,S=null,v=null,I=null,A=null,P=new Bt(0,0,0),L=0,b=!1,M=null,R=null,Y=null,z=null,T=null;const D=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,q=0;const F=i.getParameter(i.VERSION);F.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(F)[1]),U=q>=1):F.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),U=q>=2);let K=null,it={};const ft=i.getParameter(i.SCISSOR_BOX),ht=i.getParameter(i.VIEWPORT),xt=new de().fromArray(ft),J=new de().fromArray(ht);function Q(O,B,k,V){const st=new Uint8Array(4),dt=i.createTexture();i.bindTexture(O,dt),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let yt=0;yt<k;yt++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(B,0,i.RGBA,1,1,V,0,i.RGBA,i.UNSIGNED_BYTE,st):i.texImage2D(B+yt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,st);return dt}const ot={};ot[i.TEXTURE_2D]=Q(i.TEXTURE_2D,i.TEXTURE_2D,1),ot[i.TEXTURE_CUBE_MAP]=Q(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ot[i.TEXTURE_2D_ARRAY]=Q(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ot[i.TEXTURE_3D]=Q(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),pt(i.DEPTH_TEST),r.setFunc(Ni),lt(!1),Tt(yc),pt(i.CULL_FACE),N(On);function pt(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function gt(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function St(O,B){return f[O]!==B?(i.bindFramebuffer(O,B),f[O]=B,O===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=B),O===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=B),!0):!1}function Pt(O,B){let k=d,V=!1;if(O){k=p.get(B),k===void 0&&(k=[],p.set(B,k));const st=O.textures;if(k.length!==st.length||k[0]!==i.COLOR_ATTACHMENT0){for(let dt=0,yt=st.length;dt<yt;dt++)k[dt]=i.COLOR_ATTACHMENT0+dt;k.length=st.length,V=!0}}else k[0]!==i.BACK&&(k[0]=i.BACK,V=!0);V&&i.drawBuffers(k)}function Ut(O){return m!==O?(i.useProgram(O),m=O,!0):!1}const _t={[ei]:i.FUNC_ADD,[Wu]:i.FUNC_SUBTRACT,[Xu]:i.FUNC_REVERSE_SUBTRACT};_t[$u]=i.MIN,_t[Yu]=i.MAX;const Xt={[Zu]:i.ZERO,[qu]:i.ONE,[ju]:i.SRC_COLOR,[Or]:i.SRC_ALPHA,[nf]:i.SRC_ALPHA_SATURATE,[tf]:i.DST_COLOR,[Ju]:i.DST_ALPHA,[Ku]:i.ONE_MINUS_SRC_COLOR,[Br]:i.ONE_MINUS_SRC_ALPHA,[ef]:i.ONE_MINUS_DST_COLOR,[Qu]:i.ONE_MINUS_DST_ALPHA,[sf]:i.CONSTANT_COLOR,[af]:i.ONE_MINUS_CONSTANT_COLOR,[rf]:i.CONSTANT_ALPHA,[of]:i.ONE_MINUS_CONSTANT_ALPHA};function N(O,B,k,V,st,dt,yt,Ht,te,Vt){if(O===On){_===!0&&(gt(i.BLEND),_=!1);return}if(_===!1&&(pt(i.BLEND),_=!0),O!==Gu){if(O!==g||Vt!==b){if((u!==ei||v!==ei)&&(i.blendEquation(i.FUNC_ADD),u=ei,v=ei),Vt)switch(O){case ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sc:i.blendFunc(i.ONE,i.ONE);break;case bc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ec:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case bc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ec:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}x=null,S=null,I=null,A=null,P.set(0,0,0),L=0,g=O,b=Vt}return}st=st||B,dt=dt||k,yt=yt||V,(B!==u||st!==v)&&(i.blendEquationSeparate(_t[B],_t[st]),u=B,v=st),(k!==x||V!==S||dt!==I||yt!==A)&&(i.blendFuncSeparate(Xt[k],Xt[V],Xt[dt],Xt[yt]),x=k,S=V,I=dt,A=yt),(Ht.equals(P)===!1||te!==L)&&(i.blendColor(Ht.r,Ht.g,Ht.b,te),P.copy(Ht),L=te),g=O,b=!1}function Zt(O,B){O.side===Ae?gt(i.CULL_FACE):pt(i.CULL_FACE);let k=O.side===De;B&&(k=!k),lt(k),O.blending===ki&&O.transparent===!1?N(On):N(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),r.setFunc(O.depthFunc),r.setTest(O.depthTest),r.setMask(O.depthWrite),a.setMask(O.colorWrite);const V=O.stencilWrite;o.setTest(V),V&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),at(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?pt(i.SAMPLE_ALPHA_TO_COVERAGE):gt(i.SAMPLE_ALPHA_TO_COVERAGE)}function lt(O){M!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),M=O)}function Tt(O){O!==Hu?(pt(i.CULL_FACE),O!==R&&(O===yc?i.cullFace(i.BACK):O===Vu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):gt(i.CULL_FACE),R=O}function j(O){O!==Y&&(U&&i.lineWidth(O),Y=O)}function at(O,B,k){O?(pt(i.POLYGON_OFFSET_FILL),(z!==B||T!==k)&&(i.polygonOffset(B,k),z=B,T=k)):gt(i.POLYGON_OFFSET_FILL)}function ut(O){O?pt(i.SCISSOR_TEST):gt(i.SCISSOR_TEST)}function w(O){O===void 0&&(O=i.TEXTURE0+D-1),K!==O&&(i.activeTexture(O),K=O)}function y(O,B,k){k===void 0&&(K===null?k=i.TEXTURE0+D-1:k=K);let V=it[k];V===void 0&&(V={type:void 0,texture:void 0},it[k]=V),(V.type!==O||V.texture!==B)&&(K!==k&&(i.activeTexture(k),K=k),i.bindTexture(O,B||ot[O]),V.type=O,V.texture=B)}function H(){const O=it[K];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function C(){try{i.compressedTexImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function W(){try{i.compressedTexImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Z(){try{i.texSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function nt(){try{i.texSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function rt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function mt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Rt(){try{i.texStorage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ct(){try{i.texStorage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function vt(){try{i.texImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ct(){try{i.texImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function kt(O){xt.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),xt.copy(O))}function bt(O){J.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),J.copy(O))}function zt(O,B){let k=l.get(B);k===void 0&&(k=new WeakMap,l.set(B,k));let V=k.get(O);V===void 0&&(V=i.getUniformBlockIndex(B,O.name),k.set(O,V))}function Ft(O,B){const V=l.get(B).get(O);c.get(B)!==V&&(i.uniformBlockBinding(B,V,O.__bindingPointIndex),c.set(B,V))}function Yt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},K=null,it={},f={},p=new WeakMap,d=[],m=null,_=!1,g=null,u=null,x=null,S=null,v=null,I=null,A=null,P=new Bt(0,0,0),L=0,b=!1,M=null,R=null,Y=null,z=null,T=null,xt.set(0,0,i.canvas.width,i.canvas.height),J.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:pt,disable:gt,bindFramebuffer:St,drawBuffers:Pt,useProgram:Ut,setBlending:N,setMaterial:Zt,setFlipSided:lt,setCullFace:Tt,setLineWidth:j,setPolygonOffset:at,setScissorTest:ut,activeTexture:w,bindTexture:y,unbindTexture:H,compressedTexImage2D:C,compressedTexImage3D:W,texImage2D:vt,texImage3D:Ct,updateUBOMapping:zt,uniformBlockBinding:Ft,texStorage2D:Rt,texStorage3D:ct,texSubImage2D:Z,texSubImage3D:nt,compressedTexSubImage2D:rt,compressedTexSubImage3D:mt,scissor:kt,viewport:bt,reset:Yt}}function _l(i,t,e,n){const s=C_(n);switch(e){case ql:return i*t;case Kl:return i*t;case Jl:return i*t*2;case Ql:return i*t/s.components*s.byteLength;case Go:return i*t/s.components*s.byteLength;case td:return i*t*2/s.components*s.byteLength;case Wo:return i*t*2/s.components*s.byteLength;case jl:return i*t*3/s.components*s.byteLength;case Ke:return i*t*4/s.components*s.byteLength;case Xo:return i*t*4/s.components*s.byteLength;case ia:case sa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case aa:case ra:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Qr:case eo:return Math.max(i,16)*Math.max(t,8)/4;case Jr:case to:return Math.max(i,8)*Math.max(t,8)/2;case no:case io:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case so:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ao:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ro:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case oo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case co:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case lo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ho:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case uo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case fo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case po:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case mo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case go:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case _o:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case xo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case vo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case oa:case Mo:case yo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ed:case So:return Math.ceil(i/4)*Math.ceil(t/4)*8;case bo:case Eo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function C_(i){switch(i){case Rn:case $l:return{byteLength:1,components:1};case hs:case Yl:case fs:return{byteLength:2,components:1};case Ho:case Vo:return{byteLength:2,components:4};case ri:case Bo:case wn:return{byteLength:4,components:1};case Zl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function P_(i,t,e,n,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Gt,h=new WeakMap;let f;const p=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(w,y){return d?new OffscreenCanvas(w,y):Ma("canvas")}function _(w,y,H){let C=1;const W=ut(w);if((W.width>H||W.height>H)&&(C=H/Math.max(W.width,W.height)),C<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Z=Math.floor(C*W.width),nt=Math.floor(C*W.height);f===void 0&&(f=m(Z,nt));const rt=y?m(Z,nt):f;return rt.width=Z,rt.height=nt,rt.getContext("2d").drawImage(w,0,0,Z,nt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+W.width+"x"+W.height+") to ("+Z+"x"+nt+")."),rt}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+W.width+"x"+W.height+")."),w;return w}function g(w){return w.generateMipmaps}function u(w){i.generateMipmap(w)}function x(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(w,y,H,C,W=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Z=y;if(y===i.RED&&(H===i.FLOAT&&(Z=i.R32F),H===i.HALF_FLOAT&&(Z=i.R16F),H===i.UNSIGNED_BYTE&&(Z=i.R8)),y===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(Z=i.R8UI),H===i.UNSIGNED_SHORT&&(Z=i.R16UI),H===i.UNSIGNED_INT&&(Z=i.R32UI),H===i.BYTE&&(Z=i.R8I),H===i.SHORT&&(Z=i.R16I),H===i.INT&&(Z=i.R32I)),y===i.RG&&(H===i.FLOAT&&(Z=i.RG32F),H===i.HALF_FLOAT&&(Z=i.RG16F),H===i.UNSIGNED_BYTE&&(Z=i.RG8)),y===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(Z=i.RG8UI),H===i.UNSIGNED_SHORT&&(Z=i.RG16UI),H===i.UNSIGNED_INT&&(Z=i.RG32UI),H===i.BYTE&&(Z=i.RG8I),H===i.SHORT&&(Z=i.RG16I),H===i.INT&&(Z=i.RG32I)),y===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),H===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),H===i.UNSIGNED_INT&&(Z=i.RGB32UI),H===i.BYTE&&(Z=i.RGB8I),H===i.SHORT&&(Z=i.RGB16I),H===i.INT&&(Z=i.RGB32I)),y===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),H===i.UNSIGNED_INT&&(Z=i.RGBA32UI),H===i.BYTE&&(Z=i.RGBA8I),H===i.SHORT&&(Z=i.RGBA16I),H===i.INT&&(Z=i.RGBA32I)),y===i.RGB&&H===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),y===i.RGBA){const nt=W?Ta:Kt.getTransfer(C);H===i.FLOAT&&(Z=i.RGBA32F),H===i.HALF_FLOAT&&(Z=i.RGBA16F),H===i.UNSIGNED_BYTE&&(Z=nt===ie?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function v(w,y){let H;return w?y===null||y===ri||y===Bi?H=i.DEPTH24_STENCIL8:y===wn?H=i.DEPTH32F_STENCIL8:y===hs&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===ri||y===Bi?H=i.DEPTH_COMPONENT24:y===wn?H=i.DEPTH_COMPONENT32F:y===hs&&(H=i.DEPTH_COMPONENT16),H}function I(w,y){return g(w)===!0||w.isFramebufferTexture&&w.minFilter!==Je&&w.minFilter!==cn?Math.log2(Math.max(y.width,y.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?y.mipmaps.length:1}function A(w){const y=w.target;y.removeEventListener("dispose",A),L(y),y.isVideoTexture&&h.delete(y)}function P(w){const y=w.target;y.removeEventListener("dispose",P),M(y)}function L(w){const y=n.get(w);if(y.__webglInit===void 0)return;const H=w.source,C=p.get(H);if(C){const W=C[y.__cacheKey];W.usedTimes--,W.usedTimes===0&&b(w),Object.keys(C).length===0&&p.delete(H)}n.remove(w)}function b(w){const y=n.get(w);i.deleteTexture(y.__webglTexture);const H=w.source,C=p.get(H);delete C[y.__cacheKey],r.memory.textures--}function M(w){const y=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let C=0;C<6;C++){if(Array.isArray(y.__webglFramebuffer[C]))for(let W=0;W<y.__webglFramebuffer[C].length;W++)i.deleteFramebuffer(y.__webglFramebuffer[C][W]);else i.deleteFramebuffer(y.__webglFramebuffer[C]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[C])}else{if(Array.isArray(y.__webglFramebuffer))for(let C=0;C<y.__webglFramebuffer.length;C++)i.deleteFramebuffer(y.__webglFramebuffer[C]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let C=0;C<y.__webglColorRenderbuffer.length;C++)y.__webglColorRenderbuffer[C]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[C]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const H=w.textures;for(let C=0,W=H.length;C<W;C++){const Z=n.get(H[C]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),r.memory.textures--),n.remove(H[C])}n.remove(w)}let R=0;function Y(){R=0}function z(){const w=R;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),R+=1,w}function T(w){const y=[];return y.push(w.wrapS),y.push(w.wrapT),y.push(w.wrapR||0),y.push(w.magFilter),y.push(w.minFilter),y.push(w.anisotropy),y.push(w.internalFormat),y.push(w.format),y.push(w.type),y.push(w.generateMipmaps),y.push(w.premultiplyAlpha),y.push(w.flipY),y.push(w.unpackAlignment),y.push(w.colorSpace),y.join()}function D(w,y){const H=n.get(w);if(w.isVideoTexture&&j(w),w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){const C=w.image;if(C===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(C.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(H,w,y);return}}e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+y)}function U(w,y){const H=n.get(w);if(w.version>0&&H.__version!==w.version){J(H,w,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+y)}function q(w,y){const H=n.get(w);if(w.version>0&&H.__version!==w.version){J(H,w,y);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+y)}function F(w,y){const H=n.get(w);if(w.version>0&&H.__version!==w.version){Q(H,w,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+y)}const K={[jr]:i.REPEAT,[ii]:i.CLAMP_TO_EDGE,[Kr]:i.MIRRORED_REPEAT},it={[Je]:i.NEAREST,[_f]:i.NEAREST_MIPMAP_NEAREST,[ws]:i.NEAREST_MIPMAP_LINEAR,[cn]:i.LINEAR,[Xa]:i.LINEAR_MIPMAP_NEAREST,[si]:i.LINEAR_MIPMAP_LINEAR},ft={[yf]:i.NEVER,[Tf]:i.ALWAYS,[Sf]:i.LESS,[id]:i.LEQUAL,[bf]:i.EQUAL,[Af]:i.GEQUAL,[Ef]:i.GREATER,[wf]:i.NOTEQUAL};function ht(w,y){if(y.type===wn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===cn||y.magFilter===Xa||y.magFilter===ws||y.magFilter===si||y.minFilter===cn||y.minFilter===Xa||y.minFilter===ws||y.minFilter===si)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,K[y.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,K[y.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,K[y.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,it[y.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,it[y.minFilter]),y.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,ft[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Je||y.minFilter!==ws&&y.minFilter!==si||y.type===wn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function xt(w,y){let H=!1;w.__webglInit===void 0&&(w.__webglInit=!0,y.addEventListener("dispose",A));const C=y.source;let W=p.get(C);W===void 0&&(W={},p.set(C,W));const Z=T(y);if(Z!==w.__cacheKey){W[Z]===void 0&&(W[Z]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,H=!0),W[Z].usedTimes++;const nt=W[w.__cacheKey];nt!==void 0&&(W[w.__cacheKey].usedTimes--,nt.usedTimes===0&&b(y)),w.__cacheKey=Z,w.__webglTexture=W[Z].texture}return H}function J(w,y,H){let C=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(C=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(C=i.TEXTURE_3D);const W=xt(w,y),Z=y.source;e.bindTexture(C,w.__webglTexture,i.TEXTURE0+H);const nt=n.get(Z);if(Z.version!==nt.__version||W===!0){e.activeTexture(i.TEXTURE0+H);const rt=Kt.getPrimaries(Kt.workingColorSpace),mt=y.colorSpace===Nn?null:Kt.getPrimaries(y.colorSpace),Rt=y.colorSpace===Nn||rt===mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt);let ct=_(y.image,!1,s.maxTextureSize);ct=at(y,ct);const vt=a.convert(y.format,y.colorSpace),Ct=a.convert(y.type);let kt=S(y.internalFormat,vt,Ct,y.colorSpace,y.isVideoTexture);ht(C,y);let bt;const zt=y.mipmaps,Ft=y.isVideoTexture!==!0,Yt=nt.__version===void 0||W===!0,O=Z.dataReady,B=I(y,ct);if(y.isDepthTexture)kt=v(y.format===Hi,y.type),Yt&&(Ft?e.texStorage2D(i.TEXTURE_2D,1,kt,ct.width,ct.height):e.texImage2D(i.TEXTURE_2D,0,kt,ct.width,ct.height,0,vt,Ct,null));else if(y.isDataTexture)if(zt.length>0){Ft&&Yt&&e.texStorage2D(i.TEXTURE_2D,B,kt,zt[0].width,zt[0].height);for(let k=0,V=zt.length;k<V;k++)bt=zt[k],Ft?O&&e.texSubImage2D(i.TEXTURE_2D,k,0,0,bt.width,bt.height,vt,Ct,bt.data):e.texImage2D(i.TEXTURE_2D,k,kt,bt.width,bt.height,0,vt,Ct,bt.data);y.generateMipmaps=!1}else Ft?(Yt&&e.texStorage2D(i.TEXTURE_2D,B,kt,ct.width,ct.height),O&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct.width,ct.height,vt,Ct,ct.data)):e.texImage2D(i.TEXTURE_2D,0,kt,ct.width,ct.height,0,vt,Ct,ct.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Ft&&Yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,B,kt,zt[0].width,zt[0].height,ct.depth);for(let k=0,V=zt.length;k<V;k++)if(bt=zt[k],y.format!==Ke)if(vt!==null)if(Ft){if(O)if(y.layerUpdates.size>0){const st=_l(bt.width,bt.height,y.format,y.type);for(const dt of y.layerUpdates){const yt=bt.data.subarray(dt*st/bt.data.BYTES_PER_ELEMENT,(dt+1)*st/bt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,k,0,0,dt,bt.width,bt.height,1,vt,yt)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,k,0,0,0,bt.width,bt.height,ct.depth,vt,bt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,k,kt,bt.width,bt.height,ct.depth,0,bt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?O&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,k,0,0,0,bt.width,bt.height,ct.depth,vt,Ct,bt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,k,kt,bt.width,bt.height,ct.depth,0,vt,Ct,bt.data)}else{Ft&&Yt&&e.texStorage2D(i.TEXTURE_2D,B,kt,zt[0].width,zt[0].height);for(let k=0,V=zt.length;k<V;k++)bt=zt[k],y.format!==Ke?vt!==null?Ft?O&&e.compressedTexSubImage2D(i.TEXTURE_2D,k,0,0,bt.width,bt.height,vt,bt.data):e.compressedTexImage2D(i.TEXTURE_2D,k,kt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?O&&e.texSubImage2D(i.TEXTURE_2D,k,0,0,bt.width,bt.height,vt,Ct,bt.data):e.texImage2D(i.TEXTURE_2D,k,kt,bt.width,bt.height,0,vt,Ct,bt.data)}else if(y.isDataArrayTexture)if(Ft){if(Yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,B,kt,ct.width,ct.height,ct.depth),O)if(y.layerUpdates.size>0){const k=_l(ct.width,ct.height,y.format,y.type);for(const V of y.layerUpdates){const st=ct.data.subarray(V*k/ct.data.BYTES_PER_ELEMENT,(V+1)*k/ct.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,V,ct.width,ct.height,1,vt,Ct,st)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ct.width,ct.height,ct.depth,vt,Ct,ct.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,kt,ct.width,ct.height,ct.depth,0,vt,Ct,ct.data);else if(y.isData3DTexture)Ft?(Yt&&e.texStorage3D(i.TEXTURE_3D,B,kt,ct.width,ct.height,ct.depth),O&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ct.width,ct.height,ct.depth,vt,Ct,ct.data)):e.texImage3D(i.TEXTURE_3D,0,kt,ct.width,ct.height,ct.depth,0,vt,Ct,ct.data);else if(y.isFramebufferTexture){if(Yt)if(Ft)e.texStorage2D(i.TEXTURE_2D,B,kt,ct.width,ct.height);else{let k=ct.width,V=ct.height;for(let st=0;st<B;st++)e.texImage2D(i.TEXTURE_2D,st,kt,k,V,0,vt,Ct,null),k>>=1,V>>=1}}else if(zt.length>0){if(Ft&&Yt){const k=ut(zt[0]);e.texStorage2D(i.TEXTURE_2D,B,kt,k.width,k.height)}for(let k=0,V=zt.length;k<V;k++)bt=zt[k],Ft?O&&e.texSubImage2D(i.TEXTURE_2D,k,0,0,vt,Ct,bt):e.texImage2D(i.TEXTURE_2D,k,kt,vt,Ct,bt);y.generateMipmaps=!1}else if(Ft){if(Yt){const k=ut(ct);e.texStorage2D(i.TEXTURE_2D,B,kt,k.width,k.height)}O&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,vt,Ct,ct)}else e.texImage2D(i.TEXTURE_2D,0,kt,vt,Ct,ct);g(y)&&u(C),nt.__version=Z.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function Q(w,y,H){if(y.image.length!==6)return;const C=xt(w,y),W=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+H);const Z=n.get(W);if(W.version!==Z.__version||C===!0){e.activeTexture(i.TEXTURE0+H);const nt=Kt.getPrimaries(Kt.workingColorSpace),rt=y.colorSpace===Nn?null:Kt.getPrimaries(y.colorSpace),mt=y.colorSpace===Nn||nt===rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt);const Rt=y.isCompressedTexture||y.image[0].isCompressedTexture,ct=y.image[0]&&y.image[0].isDataTexture,vt=[];for(let V=0;V<6;V++)!Rt&&!ct?vt[V]=_(y.image[V],!0,s.maxCubemapSize):vt[V]=ct?y.image[V].image:y.image[V],vt[V]=at(y,vt[V]);const Ct=vt[0],kt=a.convert(y.format,y.colorSpace),bt=a.convert(y.type),zt=S(y.internalFormat,kt,bt,y.colorSpace),Ft=y.isVideoTexture!==!0,Yt=Z.__version===void 0||C===!0,O=W.dataReady;let B=I(y,Ct);ht(i.TEXTURE_CUBE_MAP,y);let k;if(Rt){Ft&&Yt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,B,zt,Ct.width,Ct.height);for(let V=0;V<6;V++){k=vt[V].mipmaps;for(let st=0;st<k.length;st++){const dt=k[st];y.format!==Ke?kt!==null?Ft?O&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,st,0,0,dt.width,dt.height,kt,dt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,st,zt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,st,0,0,dt.width,dt.height,kt,bt,dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,st,zt,dt.width,dt.height,0,kt,bt,dt.data)}}}else{if(k=y.mipmaps,Ft&&Yt){k.length>0&&B++;const V=ut(vt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,B,zt,V.width,V.height)}for(let V=0;V<6;V++)if(ct){Ft?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,0,0,vt[V].width,vt[V].height,kt,bt,vt[V].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,zt,vt[V].width,vt[V].height,0,kt,bt,vt[V].data);for(let st=0;st<k.length;st++){const yt=k[st].image[V].image;Ft?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,st+1,0,0,yt.width,yt.height,kt,bt,yt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,st+1,zt,yt.width,yt.height,0,kt,bt,yt.data)}}else{Ft?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,0,0,kt,bt,vt[V]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,zt,kt,bt,vt[V]);for(let st=0;st<k.length;st++){const dt=k[st];Ft?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,st+1,0,0,kt,bt,dt.image[V]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,st+1,zt,kt,bt,dt.image[V])}}}g(y)&&u(i.TEXTURE_CUBE_MAP),Z.__version=W.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function ot(w,y,H,C,W,Z){const nt=a.convert(H.format,H.colorSpace),rt=a.convert(H.type),mt=S(H.internalFormat,nt,rt,H.colorSpace),Rt=n.get(y),ct=n.get(H);if(ct.__renderTarget=y,!Rt.__hasExternalTextures){const vt=Math.max(1,y.width>>Z),Ct=Math.max(1,y.height>>Z);W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?e.texImage3D(W,Z,mt,vt,Ct,y.depth,0,nt,rt,null):e.texImage2D(W,Z,mt,vt,Ct,0,nt,rt,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),Tt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,C,W,ct.__webglTexture,0,lt(y)):(W===i.TEXTURE_2D||W>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&W<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,C,W,ct.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function pt(w,y,H){if(i.bindRenderbuffer(i.RENDERBUFFER,w),y.depthBuffer){const C=y.depthTexture,W=C&&C.isDepthTexture?C.type:null,Z=v(y.stencilBuffer,W),nt=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=lt(y);Tt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,Z,y.width,y.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,Z,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Z,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,w)}else{const C=y.textures;for(let W=0;W<C.length;W++){const Z=C[W],nt=a.convert(Z.format,Z.colorSpace),rt=a.convert(Z.type),mt=S(Z.internalFormat,nt,rt,Z.colorSpace),Rt=lt(y);H&&Tt(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,mt,y.width,y.height):Tt(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Rt,mt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,mt,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function gt(w,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const C=n.get(y.depthTexture);C.__renderTarget=y,(!C.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),D(y.depthTexture,0);const W=C.__webglTexture,Z=lt(y);if(y.depthTexture.format===Ui)Tt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,W,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,W,0);else if(y.depthTexture.format===Hi)Tt(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,W,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,W,0);else throw new Error("Unknown depthTexture format")}function St(w){const y=n.get(w),H=w.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==w.depthTexture){const C=w.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),C){const W=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,C.removeEventListener("dispose",W)};C.addEventListener("dispose",W),y.__depthDisposeCallback=W}y.__boundDepthTexture=C}if(w.depthTexture&&!y.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");gt(y.__webglFramebuffer,w)}else if(H){y.__webglDepthbuffer=[];for(let C=0;C<6;C++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[C]),y.__webglDepthbuffer[C]===void 0)y.__webglDepthbuffer[C]=i.createRenderbuffer(),pt(y.__webglDepthbuffer[C],w,!1);else{const W=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=y.__webglDepthbuffer[C];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,W,i.RENDERBUFFER,Z)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),pt(y.__webglDepthbuffer,w,!1);else{const C=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,C,i.RENDERBUFFER,W)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Pt(w,y,H){const C=n.get(w);y!==void 0&&ot(C.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&St(w)}function Ut(w){const y=w.texture,H=n.get(w),C=n.get(y);w.addEventListener("dispose",P);const W=w.textures,Z=w.isWebGLCubeRenderTarget===!0,nt=W.length>1;if(nt||(C.__webglTexture===void 0&&(C.__webglTexture=i.createTexture()),C.__version=y.version,r.memory.textures++),Z){H.__webglFramebuffer=[];for(let rt=0;rt<6;rt++)if(y.mipmaps&&y.mipmaps.length>0){H.__webglFramebuffer[rt]=[];for(let mt=0;mt<y.mipmaps.length;mt++)H.__webglFramebuffer[rt][mt]=i.createFramebuffer()}else H.__webglFramebuffer[rt]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){H.__webglFramebuffer=[];for(let rt=0;rt<y.mipmaps.length;rt++)H.__webglFramebuffer[rt]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(nt)for(let rt=0,mt=W.length;rt<mt;rt++){const Rt=n.get(W[rt]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=i.createTexture(),r.memory.textures++)}if(w.samples>0&&Tt(w)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let rt=0;rt<W.length;rt++){const mt=W[rt];H.__webglColorRenderbuffer[rt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[rt]);const Rt=a.convert(mt.format,mt.colorSpace),ct=a.convert(mt.type),vt=S(mt.internalFormat,Rt,ct,mt.colorSpace,w.isXRRenderTarget===!0),Ct=lt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,vt,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+rt,i.RENDERBUFFER,H.__webglColorRenderbuffer[rt])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),pt(H.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture),ht(i.TEXTURE_CUBE_MAP,y);for(let rt=0;rt<6;rt++)if(y.mipmaps&&y.mipmaps.length>0)for(let mt=0;mt<y.mipmaps.length;mt++)ot(H.__webglFramebuffer[rt][mt],w,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt);else ot(H.__webglFramebuffer[rt],w,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0);g(y)&&u(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(nt){for(let rt=0,mt=W.length;rt<mt;rt++){const Rt=W[rt],ct=n.get(Rt);e.bindTexture(i.TEXTURE_2D,ct.__webglTexture),ht(i.TEXTURE_2D,Rt),ot(H.__webglFramebuffer,w,Rt,i.COLOR_ATTACHMENT0+rt,i.TEXTURE_2D,0),g(Rt)&&u(i.TEXTURE_2D)}e.unbindTexture()}else{let rt=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(rt=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(rt,C.__webglTexture),ht(rt,y),y.mipmaps&&y.mipmaps.length>0)for(let mt=0;mt<y.mipmaps.length;mt++)ot(H.__webglFramebuffer[mt],w,y,i.COLOR_ATTACHMENT0,rt,mt);else ot(H.__webglFramebuffer,w,y,i.COLOR_ATTACHMENT0,rt,0);g(y)&&u(rt),e.unbindTexture()}w.depthBuffer&&St(w)}function _t(w){const y=w.textures;for(let H=0,C=y.length;H<C;H++){const W=y[H];if(g(W)){const Z=x(w),nt=n.get(W).__webglTexture;e.bindTexture(Z,nt),u(Z),e.unbindTexture()}}}const Xt=[],N=[];function Zt(w){if(w.samples>0){if(Tt(w)===!1){const y=w.textures,H=w.width,C=w.height;let W=i.COLOR_BUFFER_BIT;const Z=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=n.get(w),rt=y.length>1;if(rt)for(let mt=0;mt<y.length;mt++)e.bindFramebuffer(i.FRAMEBUFFER,nt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,nt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,nt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,nt.__webglFramebuffer);for(let mt=0;mt<y.length;mt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(W|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(W|=i.STENCIL_BUFFER_BIT)),rt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,nt.__webglColorRenderbuffer[mt]);const Rt=n.get(y[mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Rt,0)}i.blitFramebuffer(0,0,H,C,0,0,H,C,W,i.NEAREST),c===!0&&(Xt.length=0,N.length=0,Xt.push(i.COLOR_ATTACHMENT0+mt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Xt.push(Z),N.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,N)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Xt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),rt)for(let mt=0;mt<y.length;mt++){e.bindFramebuffer(i.FRAMEBUFFER,nt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,nt.__webglColorRenderbuffer[mt]);const Rt=n.get(y[mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,nt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,Rt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,nt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const y=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function lt(w){return Math.min(s.maxSamples,w.samples)}function Tt(w){const y=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function j(w){const y=r.render.frame;h.get(w)!==y&&(h.set(w,y),w.update())}function at(w,y){const H=w.colorSpace,C=w.format,W=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||H!==Gi&&H!==Nn&&(Kt.getTransfer(H)===ie?(C!==Ke||W!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),y}function ut(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=Y,this.setTexture2D=D,this.setTexture2DArray=U,this.setTexture3D=q,this.setTextureCube=F,this.rebindTextures=Pt,this.setupRenderTarget=Ut,this.updateRenderTargetMipmap=_t,this.updateMultisampleRenderTarget=Zt,this.setupDepthRenderbuffer=St,this.setupFrameBufferTexture=ot,this.useMultisampledRTT=Tt}function D_(i,t){function e(n,s=Nn){let a;const r=Kt.getTransfer(s);if(n===Rn)return i.UNSIGNED_BYTE;if(n===Ho)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Vo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Zl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===$l)return i.BYTE;if(n===Yl)return i.SHORT;if(n===hs)return i.UNSIGNED_SHORT;if(n===Bo)return i.INT;if(n===ri)return i.UNSIGNED_INT;if(n===wn)return i.FLOAT;if(n===fs)return i.HALF_FLOAT;if(n===ql)return i.ALPHA;if(n===jl)return i.RGB;if(n===Ke)return i.RGBA;if(n===Kl)return i.LUMINANCE;if(n===Jl)return i.LUMINANCE_ALPHA;if(n===Ui)return i.DEPTH_COMPONENT;if(n===Hi)return i.DEPTH_STENCIL;if(n===Ql)return i.RED;if(n===Go)return i.RED_INTEGER;if(n===td)return i.RG;if(n===Wo)return i.RG_INTEGER;if(n===Xo)return i.RGBA_INTEGER;if(n===ia||n===sa||n===aa||n===ra)if(r===ie)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===ia)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===sa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===aa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ra)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===ia)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===sa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===aa)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ra)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Jr||n===Qr||n===to||n===eo)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===Jr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===to)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===eo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===no||n===io||n===so)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===no||n===io)return r===ie?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===so)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ao||n===ro||n===oo||n===co||n===lo||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===_o||n===xo||n===vo)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===ao)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ro)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===oo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===co)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===lo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ho)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===uo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===fo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===po)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===mo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===go)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===_o)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===xo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===vo)return r===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===oa||n===Mo||n===yo)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===oa)return r===ie?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Mo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===yo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ed||n===So||n===bo||n===Eo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===oa)return a.COMPRESSED_RED_RGTC1_EXT;if(n===So)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===bo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Eo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Bi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class L_ extends He{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Me extends he{constructor(){super(),this.isGroup=!0,this.type="Group"}}const I_={type:"move"};class vr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new $,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new $),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new $,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new $),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,n),u=this._getHandJoint(l,_);g!==null&&(u.matrix.fromArray(g.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=g.radius),u.visible=g!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],p=h.position.distanceTo(f.position),d=.02,m=.005;l.inputState.pinching&&p>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&p<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(I_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Me;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const k_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,U_=`
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

}`;class F_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Re,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Gn({vertexShader:k_,fragmentShader:U_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new re(new Ca(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class N_ extends Wi{constructor(t,e){super();const n=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,f=null,p=null,d=null,m=null;const _=new F_,g=e.getContextAttributes();let u=null,x=null;const S=[],v=[],I=new Gt;let A=null;const P=new He;P.viewport=new de;const L=new He;L.viewport=new de;const b=[P,L],M=new L_;let R=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let Q=S[J];return Q===void 0&&(Q=new vr,S[J]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(J){let Q=S[J];return Q===void 0&&(Q=new vr,S[J]=Q),Q.getGripSpace()},this.getHand=function(J){let Q=S[J];return Q===void 0&&(Q=new vr,S[J]=Q),Q.getHandSpace()};function z(J){const Q=v.indexOf(J.inputSource);if(Q===-1)return;const ot=S[Q];ot!==void 0&&(ot.update(J.inputSource,J.frame,l||r),ot.dispatchEvent({type:J.type,data:J.inputSource}))}function T(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",T),s.removeEventListener("inputsourceschange",D);for(let J=0;J<S.length;J++){const Q=v[J];Q!==null&&(v[J]=null,S[J].disconnect(Q))}R=null,Y=null,_.reset(),t.setRenderTarget(u),d=null,p=null,f=null,s=null,x=null,xt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(u=t.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",T),s.addEventListener("inputsourceschange",D),g.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(I),s.renderState.layers===void 0){const Q={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,e,Q),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new oi(d.framebufferWidth,d.framebufferHeight,{format:Ke,type:Rn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let Q=null,ot=null,pt=null;g.depth&&(pt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=g.stencil?Hi:Ui,ot=g.stencil?Bi:ri);const gt={colorFormat:e.RGBA8,depthFormat:pt,scaleFactor:a};f=new XRWebGLBinding(s,e),p=f.createProjectionLayer(gt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),x=new oi(p.textureWidth,p.textureHeight,{format:Ke,type:Rn,depthTexture:new md(p.textureWidth,p.textureHeight,ot,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),xt.setContext(s),xt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function D(J){for(let Q=0;Q<J.removed.length;Q++){const ot=J.removed[Q],pt=v.indexOf(ot);pt>=0&&(v[pt]=null,S[pt].disconnect(ot))}for(let Q=0;Q<J.added.length;Q++){const ot=J.added[Q];let pt=v.indexOf(ot);if(pt===-1){for(let St=0;St<S.length;St++)if(St>=v.length){v.push(ot),pt=St;break}else if(v[St]===null){v[St]=ot,pt=St;break}if(pt===-1)break}const gt=S[pt];gt&&gt.connect(ot)}}const U=new $,q=new $;function F(J,Q,ot){U.setFromMatrixPosition(Q.matrixWorld),q.setFromMatrixPosition(ot.matrixWorld);const pt=U.distanceTo(q),gt=Q.projectionMatrix.elements,St=ot.projectionMatrix.elements,Pt=gt[14]/(gt[10]-1),Ut=gt[14]/(gt[10]+1),_t=(gt[9]+1)/gt[5],Xt=(gt[9]-1)/gt[5],N=(gt[8]-1)/gt[0],Zt=(St[8]+1)/St[0],lt=Pt*N,Tt=Pt*Zt,j=pt/(-N+Zt),at=j*-N;if(Q.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(at),J.translateZ(j),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),gt[10]===-1)J.projectionMatrix.copy(Q.projectionMatrix),J.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const ut=Pt+j,w=Ut+j,y=lt-at,H=Tt+(pt-at),C=_t*Ut/w*ut,W=Xt*Ut/w*ut;J.projectionMatrix.makePerspective(y,H,C,W,ut,w),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function K(J,Q){Q===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(Q.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let Q=J.near,ot=J.far;_.texture!==null&&(_.depthNear>0&&(Q=_.depthNear),_.depthFar>0&&(ot=_.depthFar)),M.near=L.near=P.near=Q,M.far=L.far=P.far=ot,(R!==M.near||Y!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,Y=M.far),P.layers.mask=J.layers.mask|2,L.layers.mask=J.layers.mask|4,M.layers.mask=P.layers.mask|L.layers.mask;const pt=J.parent,gt=M.cameras;K(M,pt);for(let St=0;St<gt.length;St++)K(gt[St],pt);gt.length===2?F(M,P,L):M.projectionMatrix.copy(P.projectionMatrix),it(J,M,pt)};function it(J,Q,ot){ot===null?J.matrix.copy(Q.matrixWorld):(J.matrix.copy(ot.matrixWorld),J.matrix.invert(),J.matrix.multiply(Q.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(Q.projectionMatrix),J.projectionMatrixInverse.copy(Q.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Ao*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(p===null&&d===null))return c},this.setFoveation=function(J){c=J,p!==null&&(p.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let ft=null;function ht(J,Q){if(h=Q.getViewerPose(l||r),m=Q,h!==null){const ot=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let pt=!1;ot.length!==M.cameras.length&&(M.cameras.length=0,pt=!0);for(let St=0;St<ot.length;St++){const Pt=ot[St];let Ut=null;if(d!==null)Ut=d.getViewport(Pt);else{const Xt=f.getViewSubImage(p,Pt);Ut=Xt.viewport,St===0&&(t.setRenderTargetTextures(x,Xt.colorTexture,p.ignoreDepthValues?void 0:Xt.depthStencilTexture),t.setRenderTarget(x))}let _t=b[St];_t===void 0&&(_t=new He,_t.layers.enable(St),_t.viewport=new de,b[St]=_t),_t.matrix.fromArray(Pt.transform.matrix),_t.matrix.decompose(_t.position,_t.quaternion,_t.scale),_t.projectionMatrix.fromArray(Pt.projectionMatrix),_t.projectionMatrixInverse.copy(_t.projectionMatrix).invert(),_t.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),St===0&&(M.matrix.copy(_t.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),pt===!0&&M.cameras.push(_t)}const gt=s.enabledFeatures;if(gt&&gt.includes("depth-sensing")){const St=f.getDepthInformation(ot[0]);St&&St.isValid&&St.texture&&_.init(t,St,s.renderState)}}for(let ot=0;ot<S.length;ot++){const pt=v[ot],gt=S[ot];pt!==null&&gt!==void 0&&gt.update(pt,Q,l||r)}ft&&ft(J,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),m=null}const xt=new fd;xt.setAnimationLoop(ht),this.setAnimationLoop=function(J){ft=J},this.dispose=function(){}}}const Kn=new hn,z_=new oe;function O_(i,t){function e(g,u){g.matrixAutoUpdate===!0&&g.updateMatrix(),u.value.copy(g.matrix)}function n(g,u){u.color.getRGB(g.fogColor.value,dd(i)),u.isFog?(g.fogNear.value=u.near,g.fogFar.value=u.far):u.isFogExp2&&(g.fogDensity.value=u.density)}function s(g,u,x,S,v){u.isMeshBasicMaterial||u.isMeshLambertMaterial?a(g,u):u.isMeshToonMaterial?(a(g,u),f(g,u)):u.isMeshPhongMaterial?(a(g,u),h(g,u)):u.isMeshStandardMaterial?(a(g,u),p(g,u),u.isMeshPhysicalMaterial&&d(g,u,v)):u.isMeshMatcapMaterial?(a(g,u),m(g,u)):u.isMeshDepthMaterial?a(g,u):u.isMeshDistanceMaterial?(a(g,u),_(g,u)):u.isMeshNormalMaterial?a(g,u):u.isLineBasicMaterial?(r(g,u),u.isLineDashedMaterial&&o(g,u)):u.isPointsMaterial?c(g,u,x,S):u.isSpriteMaterial?l(g,u):u.isShadowMaterial?(g.color.value.copy(u.color),g.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function a(g,u){g.opacity.value=u.opacity,u.color&&g.diffuse.value.copy(u.color),u.emissive&&g.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(g.map.value=u.map,e(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,e(u.alphaMap,g.alphaMapTransform)),u.bumpMap&&(g.bumpMap.value=u.bumpMap,e(u.bumpMap,g.bumpMapTransform),g.bumpScale.value=u.bumpScale,u.side===De&&(g.bumpScale.value*=-1)),u.normalMap&&(g.normalMap.value=u.normalMap,e(u.normalMap,g.normalMapTransform),g.normalScale.value.copy(u.normalScale),u.side===De&&g.normalScale.value.negate()),u.displacementMap&&(g.displacementMap.value=u.displacementMap,e(u.displacementMap,g.displacementMapTransform),g.displacementScale.value=u.displacementScale,g.displacementBias.value=u.displacementBias),u.emissiveMap&&(g.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,g.emissiveMapTransform)),u.specularMap&&(g.specularMap.value=u.specularMap,e(u.specularMap,g.specularMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest);const x=t.get(u),S=x.envMap,v=x.envMapRotation;S&&(g.envMap.value=S,Kn.copy(v),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),g.envMapRotation.value.setFromMatrix4(z_.makeRotationFromEuler(Kn)),g.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=u.reflectivity,g.ior.value=u.ior,g.refractionRatio.value=u.refractionRatio),u.lightMap&&(g.lightMap.value=u.lightMap,g.lightMapIntensity.value=u.lightMapIntensity,e(u.lightMap,g.lightMapTransform)),u.aoMap&&(g.aoMap.value=u.aoMap,g.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,g.aoMapTransform))}function r(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,u.map&&(g.map.value=u.map,e(u.map,g.mapTransform))}function o(g,u){g.dashSize.value=u.dashSize,g.totalSize.value=u.dashSize+u.gapSize,g.scale.value=u.scale}function c(g,u,x,S){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.size.value=u.size*x,g.scale.value=S*.5,u.map&&(g.map.value=u.map,e(u.map,g.uvTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,e(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function l(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.rotation.value=u.rotation,u.map&&(g.map.value=u.map,e(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,e(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function h(g,u){g.specular.value.copy(u.specular),g.shininess.value=Math.max(u.shininess,1e-4)}function f(g,u){u.gradientMap&&(g.gradientMap.value=u.gradientMap)}function p(g,u){g.metalness.value=u.metalness,u.metalnessMap&&(g.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,g.metalnessMapTransform)),g.roughness.value=u.roughness,u.roughnessMap&&(g.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,g.roughnessMapTransform)),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)}function d(g,u,x){g.ior.value=u.ior,u.sheen>0&&(g.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),g.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(g.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,g.sheenColorMapTransform)),u.sheenRoughnessMap&&(g.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,g.sheenRoughnessMapTransform))),u.clearcoat>0&&(g.clearcoat.value=u.clearcoat,g.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(g.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,g.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(g.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===De&&g.clearcoatNormalScale.value.negate())),u.dispersion>0&&(g.dispersion.value=u.dispersion),u.iridescence>0&&(g.iridescence.value=u.iridescence,g.iridescenceIOR.value=u.iridescenceIOR,g.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(g.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,g.iridescenceMapTransform)),u.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),u.transmission>0&&(g.transmission.value=u.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),u.transmissionMap&&(g.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,g.transmissionMapTransform)),g.thickness.value=u.thickness,u.thicknessMap&&(g.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=u.attenuationDistance,g.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(g.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(g.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=u.specularIntensity,g.specularColor.value.copy(u.specularColor),u.specularColorMap&&(g.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,g.specularColorMapTransform)),u.specularIntensityMap&&(g.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,u){u.matcap&&(g.matcap.value=u.matcap)}function _(g,u){const x=t.get(u).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function B_(i,t,e,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,S){const v=S.program;n.uniformBlockBinding(x,v)}function l(x,S){let v=s[x.id];v===void 0&&(m(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",g));const I=S.program;n.updateUBOMapping(x,I);const A=t.render.frame;a[x.id]!==A&&(p(x),a[x.id]=A)}function h(x){const S=f();x.__bindingPointIndex=S;const v=i.createBuffer(),I=x.__size,A=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,I,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,v),v}function f(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const S=s[x.id],v=x.uniforms,I=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let A=0,P=v.length;A<P;A++){const L=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,M=L.length;b<M;b++){const R=L[b];if(d(R,A,b,I)===!0){const Y=R.__offset,z=Array.isArray(R.value)?R.value:[R.value];let T=0;for(let D=0;D<z.length;D++){const U=z[D],q=_(U);typeof U=="number"||typeof U=="boolean"?(R.__data[0]=U,i.bufferSubData(i.UNIFORM_BUFFER,Y+T,R.__data)):U.isMatrix3?(R.__data[0]=U.elements[0],R.__data[1]=U.elements[1],R.__data[2]=U.elements[2],R.__data[3]=0,R.__data[4]=U.elements[3],R.__data[5]=U.elements[4],R.__data[6]=U.elements[5],R.__data[7]=0,R.__data[8]=U.elements[6],R.__data[9]=U.elements[7],R.__data[10]=U.elements[8],R.__data[11]=0):(U.toArray(R.__data,T),T+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,Y,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(x,S,v,I){const A=x.value,P=S+"_"+v;if(I[P]===void 0)return typeof A=="number"||typeof A=="boolean"?I[P]=A:I[P]=A.clone(),!0;{const L=I[P];if(typeof A=="number"||typeof A=="boolean"){if(L!==A)return I[P]=A,!0}else if(L.equals(A)===!1)return L.copy(A),!0}return!1}function m(x){const S=x.uniforms;let v=0;const I=16;for(let P=0,L=S.length;P<L;P++){const b=Array.isArray(S[P])?S[P]:[S[P]];for(let M=0,R=b.length;M<R;M++){const Y=b[M],z=Array.isArray(Y.value)?Y.value:[Y.value];for(let T=0,D=z.length;T<D;T++){const U=z[T],q=_(U),F=v%I,K=F%q.boundary,it=F+K;v+=K,it!==0&&I-it<q.storage&&(v+=I-it),Y.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=v,v+=q.storage}}}const A=v%I;return A>0&&(v+=I-A),x.__size=v,x.__cache={},this}function _(x){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),S}function g(x){const S=x.target;S.removeEventListener("dispose",g);const v=r.indexOf(S.__bindingPointIndex);r.splice(v,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete a[S.id]}function u(){for(const x in s)i.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:u}}class H_{constructor(t={}){const{canvas:e=Cf(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,u=null;const x=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Be,this.toneMapping=Bn,this.toneMappingExposure=1;const v=this;let I=!1,A=0,P=0,L=null,b=-1,M=null;const R=new de,Y=new de;let z=null;const T=new Bt(0);let D=0,U=e.width,q=e.height,F=1,K=null,it=null;const ft=new de(0,0,U,q),ht=new de(0,0,U,q);let xt=!1;const J=new Zo;let Q=!1,ot=!1;const pt=new oe,gt=new oe,St=new $,Pt=new de,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let _t=!1;function Xt(){return L===null?F:1}let N=n;function Zt(E,G){return e.getContext(E,G)}try{const E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${zo}`),e.addEventListener("webglcontextlost",V,!1),e.addEventListener("webglcontextrestored",st,!1),e.addEventListener("webglcontextcreationerror",dt,!1),N===null){const G="webgl2";if(N=Zt(G,E),N===null)throw Zt(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let lt,Tt,j,at,ut,w,y,H,C,W,Z,nt,rt,mt,Rt,ct,vt,Ct,kt,bt,zt,Ft,Yt,O;function B(){lt=new $g(N),lt.init(),Ft=new D_(N,lt),Tt=new Bg(N,lt,t,Ft),j=new R_(N,lt),Tt.reverseDepthBuffer&&p&&j.buffers.depth.setReversed(!0),at=new qg(N),ut=new f_,w=new P_(N,lt,j,ut,Tt,Ft,at),y=new Vg(v),H=new Xg(v),C=new np(N),Yt=new zg(N,C),W=new Yg(N,C,at,Yt),Z=new Kg(N,W,C,at),kt=new jg(N,Tt,w),ct=new Hg(ut),nt=new u_(v,y,H,lt,Tt,Yt,ct),rt=new O_(v,ut),mt=new m_,Rt=new y_(lt),Ct=new Ng(v,y,H,j,Z,d,c),vt=new A_(v,Z,Tt),O=new B_(N,at,Tt,j),bt=new Og(N,lt,at),zt=new Zg(N,lt,at),at.programs=nt.programs,v.capabilities=Tt,v.extensions=lt,v.properties=ut,v.renderLists=mt,v.shadowMap=vt,v.state=j,v.info=at}B();const k=new N_(v,N);this.xr=k,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const E=lt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=lt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(E){E!==void 0&&(F=E,this.setSize(U,q,!1))},this.getSize=function(E){return E.set(U,q)},this.setSize=function(E,G,tt=!0){if(k.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=E,q=G,e.width=Math.floor(E*F),e.height=Math.floor(G*F),tt===!0&&(e.style.width=E+"px",e.style.height=G+"px"),this.setViewport(0,0,E,G)},this.getDrawingBufferSize=function(E){return E.set(U*F,q*F).floor()},this.setDrawingBufferSize=function(E,G,tt){U=E,q=G,F=tt,e.width=Math.floor(E*tt),e.height=Math.floor(G*tt),this.setViewport(0,0,E,G)},this.getCurrentViewport=function(E){return E.copy(R)},this.getViewport=function(E){return E.copy(ft)},this.setViewport=function(E,G,tt,et){E.isVector4?ft.set(E.x,E.y,E.z,E.w):ft.set(E,G,tt,et),j.viewport(R.copy(ft).multiplyScalar(F).round())},this.getScissor=function(E){return E.copy(ht)},this.setScissor=function(E,G,tt,et){E.isVector4?ht.set(E.x,E.y,E.z,E.w):ht.set(E,G,tt,et),j.scissor(Y.copy(ht).multiplyScalar(F).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(E){j.setScissorTest(xt=E)},this.setOpaqueSort=function(E){K=E},this.setTransparentSort=function(E){it=E},this.getClearColor=function(E){return E.copy(Ct.getClearColor())},this.setClearColor=function(){Ct.setClearColor.apply(Ct,arguments)},this.getClearAlpha=function(){return Ct.getClearAlpha()},this.setClearAlpha=function(){Ct.setClearAlpha.apply(Ct,arguments)},this.clear=function(E=!0,G=!0,tt=!0){let et=0;if(E){let X=!1;if(L!==null){const Mt=L.texture.format;X=Mt===Xo||Mt===Wo||Mt===Go}if(X){const Mt=L.texture.type,wt=Mt===Rn||Mt===ri||Mt===hs||Mt===Bi||Mt===Ho||Mt===Vo,Dt=Ct.getClearColor(),Lt=Ct.getClearAlpha(),Nt=Dt.r,Ot=Dt.g,It=Dt.b;wt?(m[0]=Nt,m[1]=Ot,m[2]=It,m[3]=Lt,N.clearBufferuiv(N.COLOR,0,m)):(_[0]=Nt,_[1]=Ot,_[2]=It,_[3]=Lt,N.clearBufferiv(N.COLOR,0,_))}else et|=N.COLOR_BUFFER_BIT}G&&(et|=N.DEPTH_BUFFER_BIT),tt&&(et|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",V,!1),e.removeEventListener("webglcontextrestored",st,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),mt.dispose(),Rt.dispose(),ut.dispose(),y.dispose(),H.dispose(),Z.dispose(),Yt.dispose(),O.dispose(),nt.dispose(),k.dispose(),k.removeEventListener("sessionstart",We),k.removeEventListener("sessionend",fn),pn.stop()};function V(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function st(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const E=at.autoReset,G=vt.enabled,tt=vt.autoUpdate,et=vt.needsUpdate,X=vt.type;B(),at.autoReset=E,vt.enabled=G,vt.autoUpdate=tt,vt.needsUpdate=et,vt.type=X}function dt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function yt(E){const G=E.target;G.removeEventListener("dispose",yt),Ht(G)}function Ht(E){te(E),ut.remove(E)}function te(E){const G=ut.get(E).programs;G!==void 0&&(G.forEach(function(tt){nt.releaseProgram(tt)}),E.isShaderMaterial&&nt.releaseShaderCache(E))}this.renderBufferDirect=function(E,G,tt,et,X,Mt){G===null&&(G=Ut);const wt=X.isMesh&&X.matrixWorld.determinant()<0,Dt=ys(E,G,tt,et,X);j.setMaterial(et,wt);let Lt=tt.index,Nt=1;if(et.wireframe===!0){if(Lt=W.getWireframeAttribute(tt),Lt===void 0)return;Nt=2}const Ot=tt.drawRange,It=tt.attributes.position;let jt=Ot.start*Nt,ee=(Ot.start+Ot.count)*Nt;Mt!==null&&(jt=Math.max(jt,Mt.start*Nt),ee=Math.min(ee,(Mt.start+Mt.count)*Nt)),Lt!==null?(jt=Math.max(jt,0),ee=Math.min(ee,Lt.count)):It!=null&&(jt=Math.max(jt,0),ee=Math.min(ee,It.count));const ne=ee-jt;if(ne<0||ne===1/0)return;Yt.setup(X,et,Dt,tt,Lt);let fe,Jt=bt;if(Lt!==null&&(fe=C.get(Lt),Jt=zt,Jt.setIndex(fe)),X.isMesh)et.wireframe===!0?(j.setLineWidth(et.wireframeLinewidth*Xt()),Jt.setMode(N.LINES)):Jt.setMode(N.TRIANGLES);else if(X.isLine){let At=et.linewidth;At===void 0&&(At=1),j.setLineWidth(At*Xt()),X.isLineSegments?Jt.setMode(N.LINES):X.isLineLoop?Jt.setMode(N.LINE_LOOP):Jt.setMode(N.LINE_STRIP)}else X.isPoints?Jt.setMode(N.POINTS):X.isSprite&&Jt.setMode(N.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)Jt.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(lt.get("WEBGL_multi_draw"))Jt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const At=X._multiDrawStarts,Xe=X._multiDrawCounts,Qt=X._multiDrawCount,Ie=Lt?C.get(Lt).bytesPerElement:1,Cn=ut.get(et).currentProgram.getUniforms();for(let pe=0;pe<Qt;pe++)Cn.setValue(N,"_gl_DrawID",pe),Jt.render(At[pe]/Ie,Xe[pe])}else if(X.isInstancedMesh)Jt.renderInstances(jt,ne,X.count);else if(tt.isInstancedBufferGeometry){const At=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,Xe=Math.min(tt.instanceCount,At);Jt.renderInstances(jt,ne,Xe)}else Jt.render(jt,ne)};function Vt(E,G,tt){E.transparent===!0&&E.side===Ae&&E.forceSinglePass===!1?(E.side=De,E.needsUpdate=!0,di(E,G,tt),E.side=Vn,E.needsUpdate=!0,di(E,G,tt),E.side=Ae):di(E,G,tt)}this.compile=function(E,G,tt=null){tt===null&&(tt=E),u=Rt.get(tt),u.init(G),S.push(u),tt.traverseVisible(function(X){X.isLight&&X.layers.test(G.layers)&&(u.pushLight(X),X.castShadow&&u.pushShadow(X))}),E!==tt&&E.traverseVisible(function(X){X.isLight&&X.layers.test(G.layers)&&(u.pushLight(X),X.castShadow&&u.pushShadow(X))}),u.setupLights();const et=new Set;return E.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const Mt=X.material;if(Mt)if(Array.isArray(Mt))for(let wt=0;wt<Mt.length;wt++){const Dt=Mt[wt];Vt(Dt,tt,X),et.add(Dt)}else Vt(Mt,tt,X),et.add(Mt)}),S.pop(),u=null,et},this.compileAsync=function(E,G,tt=null){const et=this.compile(E,G,tt);return new Promise(X=>{function Mt(){if(et.forEach(function(wt){ut.get(wt).currentProgram.isReady()&&et.delete(wt)}),et.size===0){X(E);return}setTimeout(Mt,10)}lt.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let qt=null;function ce(E){qt&&qt(E)}function We(){pn.stop()}function fn(){pn.start()}const pn=new fd;pn.setAnimationLoop(ce),typeof self<"u"&&pn.setContext(self),this.setAnimationLoop=function(E){qt=E,k.setAnimationLoop(E),E===null?pn.stop():pn.start()},k.addEventListener("sessionstart",We),k.addEventListener("sessionend",fn),this.render=function(E,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),k.enabled===!0&&k.isPresenting===!0&&(k.cameraAutoUpdate===!0&&k.updateCamera(G),G=k.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,G,L),u=Rt.get(E,S.length),u.init(G),S.push(u),gt.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),J.setFromProjectionMatrix(gt),ot=this.localClippingEnabled,Q=ct.init(this.clippingPlanes,ot),g=mt.get(E,x.length),g.init(),x.push(g),k.enabled===!0&&k.isPresenting===!0){const Mt=v.xr.getDepthSensingMesh();Mt!==null&&$i(Mt,G,-1/0,v.sortObjects)}$i(E,G,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(K,it),_t=k.enabled===!1||k.isPresenting===!1||k.hasDepthSensing()===!1,_t&&Ct.addToRenderList(g,E),this.info.render.frame++,Q===!0&&ct.beginShadows();const tt=u.state.shadowsArray;vt.render(tt,E,G),Q===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=g.opaque,X=g.transmissive;if(u.setupLights(),G.isArrayCamera){const Mt=G.cameras;if(X.length>0)for(let wt=0,Dt=Mt.length;wt<Dt;wt++){const Lt=Mt[wt];_s(et,X,E,Lt)}_t&&Ct.render(E);for(let wt=0,Dt=Mt.length;wt<Dt;wt++){const Lt=Mt[wt];gs(g,E,Lt,Lt.viewport)}}else X.length>0&&_s(et,X,E,G),_t&&Ct.render(E),gs(g,E,G);L!==null&&(w.updateMultisampleRenderTarget(L),w.updateRenderTargetMipmap(L)),E.isScene===!0&&E.onAfterRender(v,E,G),Yt.resetDefaultState(),b=-1,M=null,S.pop(),S.length>0?(u=S[S.length-1],Q===!0&&ct.setGlobalState(v.clippingPlanes,u.state.camera)):u=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function $i(E,G,tt,et){if(E.visible===!1)return;if(E.layers.test(G.layers)){if(E.isGroup)tt=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(G);else if(E.isLight)u.pushLight(E),E.castShadow&&u.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||J.intersectsSprite(E)){et&&Pt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(gt);const wt=Z.update(E),Dt=E.material;Dt.visible&&g.push(E,wt,Dt,tt,Pt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||J.intersectsObject(E))){const wt=Z.update(E),Dt=E.material;if(et&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Pt.copy(E.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),Pt.copy(wt.boundingSphere.center)),Pt.applyMatrix4(E.matrixWorld).applyMatrix4(gt)),Array.isArray(Dt)){const Lt=wt.groups;for(let Nt=0,Ot=Lt.length;Nt<Ot;Nt++){const It=Lt[Nt],jt=Dt[It.materialIndex];jt&&jt.visible&&g.push(E,wt,jt,tt,Pt.z,It)}}else Dt.visible&&g.push(E,wt,Dt,tt,Pt.z,null)}}const Mt=E.children;for(let wt=0,Dt=Mt.length;wt<Dt;wt++)$i(Mt[wt],G,tt,et)}function gs(E,G,tt,et){const X=E.opaque,Mt=E.transmissive,wt=E.transparent;u.setupLightsView(tt),Q===!0&&ct.setGlobalState(v.clippingPlanes,tt),et&&j.viewport(R.copy(et)),X.length>0&&li(X,G,tt),Mt.length>0&&li(Mt,G,tt),wt.length>0&&li(wt,G,tt),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function _s(E,G,tt,et){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[et.id]===void 0&&(u.state.transmissionRenderTarget[et.id]=new oi(1,1,{generateMipmaps:!0,type:lt.has("EXT_color_buffer_half_float")||lt.has("EXT_color_buffer_float")?fs:Rn,minFilter:si,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Kt.workingColorSpace}));const Mt=u.state.transmissionRenderTarget[et.id],wt=et.viewport||R;Mt.setSize(wt.z,wt.w);const Dt=v.getRenderTarget();v.setRenderTarget(Mt),v.getClearColor(T),D=v.getClearAlpha(),D<1&&v.setClearColor(16777215,.5),v.clear(),_t&&Ct.render(tt);const Lt=v.toneMapping;v.toneMapping=Bn;const Nt=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),u.setupLightsView(et),Q===!0&&ct.setGlobalState(v.clippingPlanes,et),li(E,tt,et),w.updateMultisampleRenderTarget(Mt),w.updateRenderTargetMipmap(Mt),lt.has("WEBGL_multisampled_render_to_texture")===!1){let Ot=!1;for(let It=0,jt=G.length;It<jt;It++){const ee=G[It],ne=ee.object,fe=ee.geometry,Jt=ee.material,At=ee.group;if(Jt.side===Ae&&ne.layers.test(et.layers)){const Xe=Jt.side;Jt.side=De,Jt.needsUpdate=!0,xs(ne,tt,et,fe,Jt,At),Jt.side=Xe,Jt.needsUpdate=!0,Ot=!0}}Ot===!0&&(w.updateMultisampleRenderTarget(Mt),w.updateRenderTargetMipmap(Mt))}v.setRenderTarget(Dt),v.setClearColor(T,D),Nt!==void 0&&(et.viewport=Nt),v.toneMapping=Lt}function li(E,G,tt){const et=G.isScene===!0?G.overrideMaterial:null;for(let X=0,Mt=E.length;X<Mt;X++){const wt=E[X],Dt=wt.object,Lt=wt.geometry,Nt=et===null?wt.material:et,Ot=wt.group;Dt.layers.test(tt.layers)&&xs(Dt,G,tt,Lt,Nt,Ot)}}function xs(E,G,tt,et,X,Mt){E.onBeforeRender(v,G,tt,et,X,Mt),E.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),X.onBeforeRender(v,G,tt,et,E,Mt),X.transparent===!0&&X.side===Ae&&X.forceSinglePass===!1?(X.side=De,X.needsUpdate=!0,v.renderBufferDirect(tt,G,et,X,E,Mt),X.side=Vn,X.needsUpdate=!0,v.renderBufferDirect(tt,G,et,X,E,Mt),X.side=Ae):v.renderBufferDirect(tt,G,et,X,E,Mt),E.onAfterRender(v,G,tt,et,X,Mt)}function di(E,G,tt){G.isScene!==!0&&(G=Ut);const et=ut.get(E),X=u.state.lights,Mt=u.state.shadowsArray,wt=X.state.version,Dt=nt.getParameters(E,X.state,Mt,G,tt),Lt=nt.getProgramCacheKey(Dt);let Nt=et.programs;et.environment=E.isMeshStandardMaterial?G.environment:null,et.fog=G.fog,et.envMap=(E.isMeshStandardMaterial?H:y).get(E.envMap||et.environment),et.envMapRotation=et.environment!==null&&E.envMap===null?G.environmentRotation:E.envMapRotation,Nt===void 0&&(E.addEventListener("dispose",yt),Nt=new Map,et.programs=Nt);let Ot=Nt.get(Lt);if(Ot!==void 0){if(et.currentProgram===Ot&&et.lightsStateVersion===wt)return Ms(E,Dt),Ot}else Dt.uniforms=nt.getUniforms(E),E.onBeforeCompile(Dt,v),Ot=nt.acquireProgram(Dt,Lt),Nt.set(Lt,Ot),et.uniforms=Dt.uniforms;const It=et.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(It.clippingPlanes=ct.uniform),Ms(E,Dt),et.needsLights=La(E),et.lightsStateVersion=wt,et.needsLights&&(It.ambientLightColor.value=X.state.ambient,It.lightProbe.value=X.state.probe,It.directionalLights.value=X.state.directional,It.directionalLightShadows.value=X.state.directionalShadow,It.spotLights.value=X.state.spot,It.spotLightShadows.value=X.state.spotShadow,It.rectAreaLights.value=X.state.rectArea,It.ltc_1.value=X.state.rectAreaLTC1,It.ltc_2.value=X.state.rectAreaLTC2,It.pointLights.value=X.state.point,It.pointLightShadows.value=X.state.pointShadow,It.hemisphereLights.value=X.state.hemi,It.directionalShadowMap.value=X.state.directionalShadowMap,It.directionalShadowMatrix.value=X.state.directionalShadowMatrix,It.spotShadowMap.value=X.state.spotShadowMap,It.spotLightMatrix.value=X.state.spotLightMatrix,It.spotLightMap.value=X.state.spotLightMap,It.pointShadowMap.value=X.state.pointShadowMap,It.pointShadowMatrix.value=X.state.pointShadowMatrix),et.currentProgram=Ot,et.uniformsList=null,Ot}function vs(E){if(E.uniformsList===null){const G=E.currentProgram.getUniforms();E.uniformsList=la.seqWithValue(G.seq,E.uniforms)}return E.uniformsList}function Ms(E,G){const tt=ut.get(E);tt.outputColorSpace=G.outputColorSpace,tt.batching=G.batching,tt.batchingColor=G.batchingColor,tt.instancing=G.instancing,tt.instancingColor=G.instancingColor,tt.instancingMorph=G.instancingMorph,tt.skinning=G.skinning,tt.morphTargets=G.morphTargets,tt.morphNormals=G.morphNormals,tt.morphColors=G.morphColors,tt.morphTargetsCount=G.morphTargetsCount,tt.numClippingPlanes=G.numClippingPlanes,tt.numIntersection=G.numClipIntersection,tt.vertexAlphas=G.vertexAlphas,tt.vertexTangents=G.vertexTangents,tt.toneMapping=G.toneMapping}function ys(E,G,tt,et,X){G.isScene!==!0&&(G=Ut),w.resetTextureUnits();const Mt=G.fog,wt=et.isMeshStandardMaterial?G.environment:null,Dt=L===null?v.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Gi,Lt=(et.isMeshStandardMaterial?H:y).get(et.envMap||wt),Nt=et.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,Ot=!!tt.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),It=!!tt.morphAttributes.position,jt=!!tt.morphAttributes.normal,ee=!!tt.morphAttributes.color;let ne=Bn;et.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(ne=v.toneMapping);const fe=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,Jt=fe!==void 0?fe.length:0,At=ut.get(et),Xe=u.state.lights;if(Q===!0&&(ot===!0||E!==M)){const Ue=E===M&&et.id===b;ct.setState(et,E,Ue)}let Qt=!1;et.version===At.__version?(At.needsLights&&At.lightsStateVersion!==Xe.state.version||At.outputColorSpace!==Dt||X.isBatchedMesh&&At.batching===!1||!X.isBatchedMesh&&At.batching===!0||X.isBatchedMesh&&At.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&At.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&At.instancing===!1||!X.isInstancedMesh&&At.instancing===!0||X.isSkinnedMesh&&At.skinning===!1||!X.isSkinnedMesh&&At.skinning===!0||X.isInstancedMesh&&At.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&At.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&At.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&At.instancingMorph===!1&&X.morphTexture!==null||At.envMap!==Lt||et.fog===!0&&At.fog!==Mt||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==ct.numPlanes||At.numIntersection!==ct.numIntersection)||At.vertexAlphas!==Nt||At.vertexTangents!==Ot||At.morphTargets!==It||At.morphNormals!==jt||At.morphColors!==ee||At.toneMapping!==ne||At.morphTargetsCount!==Jt)&&(Qt=!0):(Qt=!0,At.__version=et.version);let Ie=At.currentProgram;Qt===!0&&(Ie=di(et,G,X));let Cn=!1,pe=!1,Wn=!1;const ae=Ie.getUniforms(),ke=At.uniforms;if(j.useProgram(Ie.program)&&(Cn=!0,pe=!0,Wn=!0),et.id!==b&&(b=et.id,pe=!0),Cn||M!==E){j.buffers.depth.getReversed()?(pt.copy(E.projectionMatrix),Df(pt),Lf(pt),ae.setValue(N,"projectionMatrix",pt)):ae.setValue(N,"projectionMatrix",E.projectionMatrix),ae.setValue(N,"viewMatrix",E.matrixWorldInverse);const tn=ae.map.cameraPosition;tn!==void 0&&tn.setValue(N,St.setFromMatrixPosition(E.matrixWorld)),Tt.logarithmicDepthBuffer&&ae.setValue(N,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&ae.setValue(N,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,pe=!0,Wn=!0)}if(X.isSkinnedMesh){ae.setOptional(N,X,"bindMatrix"),ae.setOptional(N,X,"bindMatrixInverse");const Ue=X.skeleton;Ue&&(Ue.boneTexture===null&&Ue.computeBoneTexture(),ae.setValue(N,"boneTexture",Ue.boneTexture,w))}X.isBatchedMesh&&(ae.setOptional(N,X,"batchingTexture"),ae.setValue(N,"batchingTexture",X._matricesTexture,w),ae.setOptional(N,X,"batchingIdTexture"),ae.setValue(N,"batchingIdTexture",X._indirectTexture,w),ae.setOptional(N,X,"batchingColorTexture"),X._colorsTexture!==null&&ae.setValue(N,"batchingColorTexture",X._colorsTexture,w));const Pn=tt.morphAttributes;if((Pn.position!==void 0||Pn.normal!==void 0||Pn.color!==void 0)&&kt.update(X,tt,Ie),(pe||At.receiveShadow!==X.receiveShadow)&&(At.receiveShadow=X.receiveShadow,ae.setValue(N,"receiveShadow",X.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(ke.envMap.value=Lt,ke.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&G.environment!==null&&(ke.envMapIntensity.value=G.environmentIntensity),pe&&(ae.setValue(N,"toneMappingExposure",v.toneMappingExposure),At.needsLights&&Ss(ke,Wn),Mt&&et.fog===!0&&rt.refreshFogUniforms(ke,Mt),rt.refreshMaterialUniforms(ke,et,F,q,u.state.transmissionRenderTarget[E.id]),la.upload(N,vs(At),ke,w)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(la.upload(N,vs(At),ke,w),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&ae.setValue(N,"center",X.center),ae.setValue(N,"modelViewMatrix",X.modelViewMatrix),ae.setValue(N,"normalMatrix",X.normalMatrix),ae.setValue(N,"modelMatrix",X.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const Ue=et.uniformsGroups;for(let tn=0,en=Ue.length;tn<en;tn++){const Yi=Ue[tn];O.update(Yi,Ie),O.bind(Yi,Ie)}}return Ie}function Ss(E,G){E.ambientLightColor.needsUpdate=G,E.lightProbe.needsUpdate=G,E.directionalLights.needsUpdate=G,E.directionalLightShadows.needsUpdate=G,E.pointLights.needsUpdate=G,E.pointLightShadows.needsUpdate=G,E.spotLights.needsUpdate=G,E.spotLightShadows.needsUpdate=G,E.rectAreaLights.needsUpdate=G,E.hemisphereLights.needsUpdate=G}function La(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(E,G,tt){ut.get(E.texture).__webglTexture=G,ut.get(E.depthTexture).__webglTexture=tt;const et=ut.get(E);et.__hasExternalTextures=!0,et.__autoAllocateDepthBuffer=tt===void 0,et.__autoAllocateDepthBuffer||lt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),et.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,G){const tt=ut.get(E);tt.__webglFramebuffer=G,tt.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(E,G=0,tt=0){L=E,A=G,P=tt;let et=!0,X=null,Mt=!1,wt=!1;if(E){const Lt=ut.get(E);if(Lt.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(N.FRAMEBUFFER,null),et=!1;else if(Lt.__webglFramebuffer===void 0)w.setupRenderTarget(E);else if(Lt.__hasExternalTextures)w.rebindTextures(E,ut.get(E.texture).__webglTexture,ut.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const It=E.depthTexture;if(Lt.__boundDepthTexture!==It){if(It!==null&&ut.has(It)&&(E.width!==It.image.width||E.height!==It.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(E)}}const Nt=E.texture;(Nt.isData3DTexture||Nt.isDataArrayTexture||Nt.isCompressedArrayTexture)&&(wt=!0);const Ot=ut.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ot[G])?X=Ot[G][tt]:X=Ot[G],Mt=!0):E.samples>0&&w.useMultisampledRTT(E)===!1?X=ut.get(E).__webglMultisampledFramebuffer:Array.isArray(Ot)?X=Ot[tt]:X=Ot,R.copy(E.viewport),Y.copy(E.scissor),z=E.scissorTest}else R.copy(ft).multiplyScalar(F).floor(),Y.copy(ht).multiplyScalar(F).floor(),z=xt;if(j.bindFramebuffer(N.FRAMEBUFFER,X)&&et&&j.drawBuffers(E,X),j.viewport(R),j.scissor(Y),j.setScissorTest(z),Mt){const Lt=ut.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+G,Lt.__webglTexture,tt)}else if(wt){const Lt=ut.get(E.texture),Nt=G||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Lt.__webglTexture,tt||0,Nt)}b=-1},this.readRenderTargetPixels=function(E,G,tt,et,X,Mt,wt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=ut.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&wt!==void 0&&(Dt=Dt[wt]),Dt){j.bindFramebuffer(N.FRAMEBUFFER,Dt);try{const Lt=E.texture,Nt=Lt.format,Ot=Lt.type;if(!Tt.textureFormatReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Tt.textureTypeReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=E.width-et&&tt>=0&&tt<=E.height-X&&N.readPixels(G,tt,et,X,Ft.convert(Nt),Ft.convert(Ot),Mt)}finally{const Lt=L!==null?ut.get(L).__webglFramebuffer:null;j.bindFramebuffer(N.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(E,G,tt,et,X,Mt,wt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=ut.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&wt!==void 0&&(Dt=Dt[wt]),Dt){const Lt=E.texture,Nt=Lt.format,Ot=Lt.type;if(!Tt.textureFormatReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Tt.textureTypeReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(G>=0&&G<=E.width-et&&tt>=0&&tt<=E.height-X){j.bindFramebuffer(N.FRAMEBUFFER,Dt);const It=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,It),N.bufferData(N.PIXEL_PACK_BUFFER,Mt.byteLength,N.STREAM_READ),N.readPixels(G,tt,et,X,Ft.convert(Nt),Ft.convert(Ot),0);const jt=L!==null?ut.get(L).__webglFramebuffer:null;j.bindFramebuffer(N.FRAMEBUFFER,jt);const ee=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Pf(N,ee,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,It),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Mt),N.deleteBuffer(It),N.deleteSync(ee),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,G=null,tt=0){E.isTexture!==!0&&(as("WebGLRenderer: copyFramebufferToTexture function signature has changed."),G=arguments[0]||null,E=arguments[1]);const et=Math.pow(2,-tt),X=Math.floor(E.image.width*et),Mt=Math.floor(E.image.height*et),wt=G!==null?G.x:0,Dt=G!==null?G.y:0;w.setTexture2D(E,0),N.copyTexSubImage2D(N.TEXTURE_2D,tt,0,0,wt,Dt,X,Mt),j.unbindTexture()},this.copyTextureToTexture=function(E,G,tt=null,et=null,X=0){E.isTexture!==!0&&(as("WebGLRenderer: copyTextureToTexture function signature has changed."),et=arguments[0]||null,E=arguments[1],G=arguments[2],X=arguments[3]||0,tt=null);let Mt,wt,Dt,Lt,Nt,Ot,It,jt,ee;const ne=E.isCompressedTexture?E.mipmaps[X]:E.image;tt!==null?(Mt=tt.max.x-tt.min.x,wt=tt.max.y-tt.min.y,Dt=tt.isBox3?tt.max.z-tt.min.z:1,Lt=tt.min.x,Nt=tt.min.y,Ot=tt.isBox3?tt.min.z:0):(Mt=ne.width,wt=ne.height,Dt=ne.depth||1,Lt=0,Nt=0,Ot=0),et!==null?(It=et.x,jt=et.y,ee=et.z):(It=0,jt=0,ee=0);const fe=Ft.convert(G.format),Jt=Ft.convert(G.type);let At;G.isData3DTexture?(w.setTexture3D(G,0),At=N.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(w.setTexture2DArray(G,0),At=N.TEXTURE_2D_ARRAY):(w.setTexture2D(G,0),At=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,G.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,G.unpackAlignment);const Xe=N.getParameter(N.UNPACK_ROW_LENGTH),Qt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Ie=N.getParameter(N.UNPACK_SKIP_PIXELS),Cn=N.getParameter(N.UNPACK_SKIP_ROWS),pe=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,ne.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ne.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Lt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Nt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ot);const Wn=E.isDataArrayTexture||E.isData3DTexture,ae=G.isDataArrayTexture||G.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const ke=ut.get(E),Pn=ut.get(G),Ue=ut.get(ke.__renderTarget),tn=ut.get(Pn.__renderTarget);j.bindFramebuffer(N.READ_FRAMEBUFFER,Ue.__webglFramebuffer),j.bindFramebuffer(N.DRAW_FRAMEBUFFER,tn.__webglFramebuffer);for(let en=0;en<Dt;en++)Wn&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ut.get(E).__webglTexture,X,Ot+en),E.isDepthTexture?(ae&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ut.get(G).__webglTexture,X,ee+en),N.blitFramebuffer(Lt,Nt,Mt,wt,It,jt,Mt,wt,N.DEPTH_BUFFER_BIT,N.NEAREST)):ae?N.copyTexSubImage3D(At,X,It,jt,ee+en,Lt,Nt,Mt,wt):N.copyTexSubImage2D(At,X,It,jt,ee+en,Lt,Nt,Mt,wt);j.bindFramebuffer(N.READ_FRAMEBUFFER,null),j.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else ae?E.isDataTexture||E.isData3DTexture?N.texSubImage3D(At,X,It,jt,ee,Mt,wt,Dt,fe,Jt,ne.data):G.isCompressedArrayTexture?N.compressedTexSubImage3D(At,X,It,jt,ee,Mt,wt,Dt,fe,ne.data):N.texSubImage3D(At,X,It,jt,ee,Mt,wt,Dt,fe,Jt,ne):E.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,X,It,jt,Mt,wt,fe,Jt,ne.data):E.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,X,It,jt,ne.width,ne.height,fe,ne.data):N.texSubImage2D(N.TEXTURE_2D,X,It,jt,Mt,wt,fe,Jt,ne);N.pixelStorei(N.UNPACK_ROW_LENGTH,Xe),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Qt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ie),N.pixelStorei(N.UNPACK_SKIP_ROWS,Cn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,pe),X===0&&G.generateMipmaps&&N.generateMipmap(At),j.unbindTexture()},this.copyTextureToTexture3D=function(E,G,tt=null,et=null,X=0){return E.isTexture!==!0&&(as("WebGLRenderer: copyTextureToTexture3D function signature has changed."),tt=arguments[0]||null,et=arguments[1]||null,E=arguments[2],G=arguments[3],X=arguments[4]||0),as('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,G,tt,et,X)},this.initRenderTarget=function(E){ut.get(E).__webglFramebuffer===void 0&&w.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?w.setTextureCube(E,0):E.isData3DTexture?w.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?w.setTexture2DArray(E,0):w.setTexture2D(E,0),j.unbindTexture()},this.resetState=function(){A=0,P=0,L=null,j.reset(),Yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Kt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Kt._getUnpackColorSpace()}}class V_ extends he{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class G_{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=wo,this.updateRanges=[],this.version=0,this.uuid=Hn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Hn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Hn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const be=new $;class ya{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=on(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=se(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=se(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=on(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=on(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=on(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=on(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=se(e,this.array),n=se(n,this.array),s=se(s,this.array),a=se(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new Qe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ya(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Md extends ci{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ri;const ts=new $,Ci=new $,Pi=new $,Di=new Gt,es=new Gt,yd=new oe,$s=new $,ns=new $,Ys=new $,xl=new Gt,Mr=new Gt,vl=new Gt;class W_ extends he{constructor(t=new Md){if(super(),this.isSprite=!0,this.type="Sprite",Ri===void 0){Ri=new Le;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new G_(e,5);Ri.setIndex([0,1,2,0,2,3]),Ri.setAttribute("position",new ya(n,3,0,!1)),Ri.setAttribute("uv",new ya(n,2,3,!1))}this.geometry=Ri,this.material=t,this.center=new Gt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ci.setFromMatrixScale(this.matrixWorld),yd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Pi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ci.multiplyScalar(-Pi.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;Zs($s.set(-.5,-.5,0),Pi,r,Ci,s,a),Zs(ns.set(.5,-.5,0),Pi,r,Ci,s,a),Zs(Ys.set(.5,.5,0),Pi,r,Ci,s,a),xl.set(0,0),Mr.set(1,0),vl.set(1,1);let o=t.ray.intersectTriangle($s,ns,Ys,!1,ts);if(o===null&&(Zs(ns.set(-.5,.5,0),Pi,r,Ci,s,a),Mr.set(0,1),o=t.ray.intersectTriangle($s,Ys,ns,!1,ts),o===null))return;const c=t.ray.origin.distanceTo(ts);c<t.near||c>t.far||e.push({distance:c,point:ts.clone(),uv:ze.getInterpolation(ts,$s,ns,Ys,xl,Mr,vl,new Gt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Zs(i,t,e,n,s,a){Di.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(es.x=a*Di.x-s*Di.y,es.y=s*Di.x+a*Di.y):es.copy(Di),i.copy(t),i.x+=es.x,i.y+=es.y,i.applyMatrix4(yd)}class jo extends ci{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Sa=new $,ba=new $,Ml=new oe,is=new $o,qs=new Ra,yr=new $,yl=new $;class X_ extends he{constructor(t=new Le,e=new jo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,a=e.count;s<a;s++)Sa.fromBufferAttribute(e,s-1),ba.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Sa.distanceTo(ba);t.setAttribute("lineDistance",new ue(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qs.copy(n.boundingSphere),qs.applyMatrix4(s),qs.radius+=a,t.ray.intersectsSphere(qs)===!1)return;Ml.copy(s).invert(),is.copy(t.ray).applyMatrix4(Ml);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,p=n.attributes.position;if(h!==null){const d=Math.max(0,r.start),m=Math.min(h.count,r.start+r.count);for(let _=d,g=m-1;_<g;_+=l){const u=h.getX(_),x=h.getX(_+1),S=js(this,t,is,c,u,x);S&&e.push(S)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(d),u=js(this,t,is,c,_,g);u&&e.push(u)}}else{const d=Math.max(0,r.start),m=Math.min(p.count,r.start+r.count);for(let _=d,g=m-1;_<g;_+=l){const u=js(this,t,is,c,_,_+1);u&&e.push(u)}if(this.isLineLoop){const _=js(this,t,is,c,m-1,d);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function js(i,t,e,n,s,a){const r=i.geometry.attributes.position;if(Sa.fromBufferAttribute(r,s),ba.fromBufferAttribute(r,a),e.distanceSqToSegment(Sa,ba,yr,yl)>n)return;yr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(yr);if(!(c<t.near||c>t.far))return{distance:c,point:yl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Sl=new $,bl=new $;class Sd extends X_{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,a=e.count;s<a;s+=2)Sl.fromBufferAttribute(e,s),bl.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Sl.distanceTo(bl);t.setAttribute("lineDistance",new ue(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class $_ extends Re{constructor(t,e,n,s,a,r,o,c,l){super(t,e,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ko extends Le{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const a=[],r=[];o(s),l(n),h(),this.setAttribute("position",new ue(a,3)),this.setAttribute("normal",new ue(a.slice(),3)),this.setAttribute("uv",new ue(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const S=new $,v=new $,I=new $;for(let A=0;A<e.length;A+=3)d(e[A+0],S),d(e[A+1],v),d(e[A+2],I),c(S,v,I,x)}function c(x,S,v,I){const A=I+1,P=[];for(let L=0;L<=A;L++){P[L]=[];const b=x.clone().lerp(v,L/A),M=S.clone().lerp(v,L/A),R=A-L;for(let Y=0;Y<=R;Y++)Y===0&&L===A?P[L][Y]=b:P[L][Y]=b.clone().lerp(M,Y/R)}for(let L=0;L<A;L++)for(let b=0;b<2*(A-L)-1;b++){const M=Math.floor(b/2);b%2===0?(p(P[L][M+1]),p(P[L+1][M]),p(P[L][M])):(p(P[L][M+1]),p(P[L+1][M+1]),p(P[L+1][M]))}}function l(x){const S=new $;for(let v=0;v<a.length;v+=3)S.x=a[v+0],S.y=a[v+1],S.z=a[v+2],S.normalize().multiplyScalar(x),a[v+0]=S.x,a[v+1]=S.y,a[v+2]=S.z}function h(){const x=new $;for(let S=0;S<a.length;S+=3){x.x=a[S+0],x.y=a[S+1],x.z=a[S+2];const v=g(x)/2/Math.PI+.5,I=u(x)/Math.PI+.5;r.push(v,1-I)}m(),f()}function f(){for(let x=0;x<r.length;x+=6){const S=r[x+0],v=r[x+2],I=r[x+4],A=Math.max(S,v,I),P=Math.min(S,v,I);A>.9&&P<.1&&(S<.2&&(r[x+0]+=1),v<.2&&(r[x+2]+=1),I<.2&&(r[x+4]+=1))}}function p(x){a.push(x.x,x.y,x.z)}function d(x,S){const v=x*3;S.x=t[v+0],S.y=t[v+1],S.z=t[v+2]}function m(){const x=new $,S=new $,v=new $,I=new $,A=new Gt,P=new Gt,L=new Gt;for(let b=0,M=0;b<a.length;b+=9,M+=6){x.set(a[b+0],a[b+1],a[b+2]),S.set(a[b+3],a[b+4],a[b+5]),v.set(a[b+6],a[b+7],a[b+8]),A.set(r[M+0],r[M+1]),P.set(r[M+2],r[M+3]),L.set(r[M+4],r[M+5]),I.copy(x).add(S).add(v).divideScalar(3);const R=g(I);_(A,M+0,x,R),_(P,M+2,S,R),_(L,M+4,v,R)}}function _(x,S,v,I){I<0&&x.x===1&&(r[S]=x.x-1),v.x===0&&v.z===0&&(r[S]=I/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function u(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ko(t.vertices,t.indices,t.radius,t.details)}}const Ks=new $,Js=new $,Sr=new $,Qs=new ze;class Y_ extends Le{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(ca*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],h=["a","b","c"],f=new Array(3),p={},d=[];for(let m=0;m<c;m+=3){r?(l[0]=r.getX(m),l[1]=r.getX(m+1),l[2]=r.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);const{a:_,b:g,c:u}=Qs;if(_.fromBufferAttribute(o,l[0]),g.fromBufferAttribute(o,l[1]),u.fromBufferAttribute(o,l[2]),Qs.getNormal(Sr),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(u.x*s)},${Math.round(u.y*s)},${Math.round(u.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const S=(x+1)%3,v=f[x],I=f[S],A=Qs[h[x]],P=Qs[h[S]],L=`${v}_${I}`,b=`${I}_${v}`;b in p&&p[b]?(Sr.dot(p[b].normal)<=a&&(d.push(A.x,A.y,A.z),d.push(P.x,P.y,P.z)),p[b]=null):L in p||(p[L]={index0:l[x],index1:l[S],normal:Sr.clone()})}}for(const m in p)if(p[m]){const{index0:_,index1:g}=p[m];Ks.fromBufferAttribute(o,_),Js.fromBufferAttribute(o,g),d.push(Ks.x,Ks.y,Ks.z),d.push(Js.x,Js.y,Js.z)}this.setAttribute("position",new ue(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Jo extends Ko{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Jo(t.radius,t.detail)}}class Ii extends Le{constructor(t=.5,e=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let f=t;const p=(e-t)/s,d=new $,m=new Gt;for(let _=0;_<=s;_++){for(let g=0;g<=n;g++){const u=a+g/n*r;d.x=f*Math.cos(u),d.y=f*Math.sin(u),c.push(d.x,d.y,d.z),l.push(0,0,1),m.x=(d.x/e+1)/2,m.y=(d.y/e+1)/2,h.push(m.x,m.y)}f+=p}for(let _=0;_<s;_++){const g=_*(n+1);for(let u=0;u<n;u++){const x=u+g,S=x,v=x+n+1,I=x+n+2,A=x+1;o.push(S,v,A),o.push(v,I,A)}}this.setIndex(o),this.setAttribute("position",new ue(c,3)),this.setAttribute("normal",new ue(l,3)),this.setAttribute("uv",new ue(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ii(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Da extends Le{constructor(t=1,e=.4,n=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:a},n=Math.floor(n),s=Math.floor(s);const r=[],o=[],c=[],l=[],h=new $,f=new $,p=new $;for(let d=0;d<=n;d++)for(let m=0;m<=s;m++){const _=m/s*a,g=d/n*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(_),f.y=(t+e*Math.cos(g))*Math.sin(_),f.z=e*Math.sin(g),o.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),p.subVectors(f,h).normalize(),c.push(p.x,p.y,p.z),l.push(m/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let m=1;m<=s;m++){const _=(s+1)*d+m-1,g=(s+1)*(d-1)+m-1,u=(s+1)*(d-1)+m,x=(s+1)*d+m;r.push(_,g,x),r.push(g,u,x)}this.setIndex(r),this.setAttribute("position",new ue(o,3)),this.setAttribute("normal",new ue(c,3)),this.setAttribute("uv",new ue(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Da(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class us extends ci{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nd,this.normalScale=new Gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=Oo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class bd extends he{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Z_ extends bd{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const br=new oe,El=new $,wl=new $;class q_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Gt(512,512),this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zo,this._frameExtents=new Gt(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;El.setFromMatrixPosition(t.matrixWorld),e.position.copy(El),wl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(wl),e.updateMatrixWorld(),br.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(br),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(br)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class j_ extends q_{constructor(){super(new pd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class K_ extends bd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.target=new he,this.shadow=new j_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Al=new oe;class J_{constructor(t,e,n=0,s=1/0){this.ray=new $o(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Yo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Al.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Al),this}intersectObject(t,e=!0,n=[]){return Ro(t,this,n,e),n.sort(Tl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,a=t.length;s<a;s++)Ro(t[s],this,n,e);return n.sort(Tl),n}}function Tl(i,t){return i.distance-t.distance}function Ro(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const a=i.children;for(let r=0,o=a.length;r<o;r++)Ro(a[r],t,e,!0)}}class Q_ extends Sd{constructor(t=10,e=10,n=4473924,s=8947848){n=new Bt(n),s=new Bt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let p=0,d=0,m=-o;p<=e;p++,m+=r){c.push(-o,0,m,o,0,m),c.push(m,0,-o,m,0,o);const _=p===a?n:s;_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3}const h=new Le;h.setAttribute("position",new ue(c,3)),h.setAttribute("color",new ue(l,3));const f=new jo({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zo);const tx={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function ex(i,t,e,n){const s=new He(i.fov,n,.1,200),a=new $,r=new $,o=new $;let c=!1,l=i.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function p(){const d=(i.pitchDeg+h.pitchDelta)*Math.PI/180,m=i.yawDeg*Math.PI/180;o.set(Math.sin(m)*Math.cos(d),Math.sin(d),Math.cos(m)*Math.cos(d)).multiplyScalar(i.distance*h.distanceScale*h.zoom)}return p(),{camera:s,update(d,m,_,g,u=tx){const x=m+.6;if(!c)a.set(d,x,_),c=!0;else{const I=1-Math.exp(-Math.max(i.smoothing,.001)*g);a.x+=(d-a.x)*I,a.y+=(x-a.y)*I,a.z+=(_-a.z)*I}const S=1-Math.exp(-Math.max(t.smoothing,.001)*g);h.distanceScale+=(u.distanceScale-h.distanceScale)*S,h.offsetX+=(u.offsetX-h.offsetX)*S,h.offsetZ+=(u.offsetZ-h.offsetZ)*S,h.pitchDelta+=(u.pitchDelta-h.pitchDelta)*S;const v=1-Math.exp(-Math.max(e.smoothing,.001)*g);h.zoom+=(f-h.zoom)*v,p(),(s.fov!==l||s.fov!==i.fov)&&(s.fov=i.fov,l=i.fov,s.updateProjectionMatrix()),r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(d){s.aspect=d,s.updateProjectionMatrix()},getGroundBasis(){const d=new $().setFromMatrixColumn(s.matrixWorld,0),m=new $().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(d.x,d.z)||1,g=Math.hypot(m.x,m.z)||1;return{rightX:d.x/_,rightZ:d.z/_,forwardX:m.x/g,forwardZ:m.z/g}},setZoom(d){f=Number.isFinite(d)&&d>0?d:1},smart(){return{...h}}}}const ta=Math.PI*2,ss=1e-6;function nx(i,t,e){return i<t?t:i>e?e:i}function ix(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function sx(i){if(i<=Math.PI)return 1-2*i/Math.PI;const t=(i-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function ax(i,t){const e=Math.cos(i),n=t<=0?0:t>=1?1:t;if(n===0)return e;const s=sx(i);return n===1?s:e+(s-e)*n}function Rl(i){return(1-Math.sin(i))/2}function Ed(i,t){if(!i.grounded||i.speed<ss)return ix();const e=i.speed/Math.max(i.moveSpeed,ss),n=Math.max(i.legLength,ss),s=i.stride>ss?i.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*n,a=Math.min(t.maxAmp,s/n),r=n*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(i.localForward),c=Math.abs(i.localRight),l=o+c+ss,h=o/l,f=c/l,p=i.localForward>=0?1:-1,d=i.localRight>=0?1:-1,m=s,_=z=>Math.asin(nx(z,-r,r)/n);function g(z,T){const D=ax(z,t.plantLock),U=Rl(z),q=p*h*m*D,F=-_(q),K=T*d>0?1:-1,it=1+K*t.crossStep*.45,ft=d*K*t.crossStep*m*.4*U,ht=d*f*m*t.sideWeight*it*D+ft*f,xt=_(ht),J=t.kneeLift*U*a*(.55+.25*h+(K>0?.2*f:0));return{pitchX:F,rollZ:xt,kneeX:J}}const u=(i.phase%ta+ta)%ta,x=g(u,-1),S=g((u+Math.PI)%ta,1),v=Math.cos(u),I=Rl(u),A=-t.comSway*a*v*(.6*h+.8*f)-d*t.comSway*a*f*.45,P=t.comBob*I*a,L=d*t.hipLean*a*f*v*.6,b=d*t.hipLean*a*f*(.45+.25*v),M=t.armSwing*a*v*(h*p+.3*f),R=M,Y=-M;return{legL:x,legR:S,pelvisX:A,pelvisY:P,pelvisRoll:L,sideLean:b,armL:R,armR:Y,strafe:f,backward:p<0?h:0}}function Te(i){return i<0?0:i>1?1:i}const rx=Math.PI*2;function ox(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function cx(i,t,e,n,s){const a=Te(n);if(a<=0)return i;const r=Te(t),o=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),l=e%2===0?1:-1,h=Te(s.forwardBias),f={speed:c,phase:i.phase+r*rx*o,localForward:c*h,localRight:c*(1-h)*l};return{speed:i.speed+(f.speed-i.speed)*a,phase:i.phase+(f.phase-i.phase)*a,localForward:i.localForward+(f.localForward-i.localForward)*a,localRight:i.localRight+(f.localRight-i.localRight)*a}}function lx(i,t,e){const n=ox(),s=Te(i),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return n;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return n.legL.pitchX=o?-l:l*.55,n.legR.pitchX=c?-l:l*.55,n.legL.kneeX=o?h:h*.4,n.legR.kneeX=c?h:h*.4,n.legL.rollZ=-f*r,n.legR.rollZ=f*r,n.pelvisX=e.stepSway*a*r,n.pelvisY=-e.stepDip*a,n.pelvisRoll=f*.25*r,n}function wd(i,t){if(i<=0||i>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return i<e?Math.sin(Math.PI/2*(i/e)):Math.cos(Math.PI/2*((i-e)/(1-e)))}function Cl(i,t,e,n,s){if(e<=0||n<=0)return 0;const a=(i-t)/e;return a<0||a>=1?0:n*wd(a,s)}function dx(i,t,e,n){const s=t?1:0,a=1-Math.exp(-Math.max(0,n)*Math.max(0,e)),r=i+(s-i)*a;return t&&r>.999?1:!t&&r<.001?0:r}function hx(i,t,e){const n=Te(i);return{gaitScale:1-n*(1-Te(t)),attackLegWeight:Te(e)*n}}function ux(i,t){const e=Te(t);return e===1?i:{legL:{pitchX:i.legL.pitchX*e,rollZ:i.legL.rollZ*e,kneeX:i.legL.kneeX*e},legR:{pitchX:i.legR.pitchX*e,rollZ:i.legR.rollZ*e,kneeX:i.legR.kneeX*e},pelvisX:i.pelvisX*e,pelvisY:i.pelvisY*e,pelvisRoll:i.pelvisRoll*e,sideLean:i.sideLean*e,armL:i.armL*e,armR:i.armR*e,strafe:i.strafe,backward:i.backward}}function fx(i,t){const e=Math.min(1,Math.abs(i)/Math.max(t.impactSpeed,1e-6));return Te(t.minScale+(1-t.minScale)*e)}function px(){return Ad()}function Ad(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function mx(i,t){return i.type==="light"?Math.max(0,t.leanLight):i.type==="heavy"?Math.max(0,t.leanHeavy):i.type==="knock"?Math.max(0,t.leanKnock):0}function gx(i,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Te(t.forceHitHeight):i.type==="light"?Te(t.hitHeight.light):i.type==="heavy"?Te(t.hitHeight.heavy):i.type==="knock"?Te(t.hitHeight.knock):0}function _x(i,t,e){const n=Te(e),s=(a,r)=>a+(r-a)*n;return{upperPitch:s(i.upperPitch,t.upperPitch),upperRoll:s(i.upperRoll,t.upperRoll),upperYaw:s(i.upperYaw,t.upperYaw),fold:s(i.fold,t.fold),shift:s(i.shift,t.shift),drop:s(i.drop,t.drop),back:s(i.back,t.back),knee:s(i.knee,t.knee),hip:s(i.hip,t.hip),arm:s(i.arm,t.arm)}}function Td(i,t,e){const n=Ad(),s=mx(i,e);if(n.intensity=s,s<=0||i.duration<=0||!Number.isFinite(i.timer))return n;const a=Te(1-i.timer/i.duration),r=wd(a,e.pulseRatio);n.pulse=r,n.active=r>0,n.hitHeight=gx(i,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),f=i.dirX*o+i.dirZ*c,p=i.dirX*l+i.dirZ*h;if(n.localFwd=f,n.localRight=p,!e.enabled){n.legacy=!0;const _=Math.sin(Math.PI*a);return n.upperPitch=s*_*f,n.upperRoll=-s*_*p*.7,n.drop=(s>.5?.09:.04)*_,n.flash=e.flashStrength*_,n.active=_>0,n}const d=s*r,m=_x(e.abdomen,e.shoulder,n.hitHeight);return n.upperPitch=d*(m.upperPitch*f+m.fold),n.upperRoll=-d*m.upperRoll*p,n.upperYaw=d*m.upperYaw*p,n.upperShift=d*m.shift,n.upperShiftX=n.upperShift*p,n.upperShiftZ=n.upperShift*f,n.comShift=d*e.comShift,n.comX=n.comShift*p,n.comZ=n.comShift*f,n.pelvisBack=d*m.back,n.drop=d*m.drop,n.knee=d*m.knee,n.hip=d*m.hip,n.arm=d*m.arm,n.flash=e.flashStrength*r,n}function Rd(i,t){const e=Math.max(0,t.pelvisTiltGain),n=Math.max(0,t.pelvisShift),s=Number.isFinite(i.leanForward)?i.leanForward:0,a=Number.isFinite(i.leanSide)?i.leanSide:0,r=Number.isFinite(i.speedRatio)?Math.max(0,Math.min(1,i.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*n,pelvisZ:s*n,crouch:Math.max(0,t.moveCrouch)*r}}const Jn=1e-6;function cs(i,t,e){return i<t?t:i>e?e:i}function xx(i,t,e,n=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=Jn||a<=Jn||!Number.isFinite(i.x)||!Number.isFinite(i.y)||!Number.isFinite(i.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+Jn,l=Math.hypot(i.x,i.y,i.z);if(l<=Jn)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(i.x,-i.y),f=Math.hypot(i.x,i.y),p=i.z,d=Math.hypot(p,f),m=cs(d,c,o),_=d>o+Jn||d<c-Jn,g=Math.atan2(-p,Math.max(f,Jn)),u=cs((s*s+m*m-a*a)/(2*s*m),-1,1),x=cs((a*a+m*m-s*s)/(2*a*m),-1,1),S=Math.acos(u),v=Math.acos(x),I=n>=0?1:-1;return{rootPitch:g-I*S,rootRoll:h,jointPitch:I*(S+v),clamped:_,reach:l/o}}function vx(i,t,e,n){const s=cs(e,0,1),a=Math.max(0,n),r=(o,c)=>{const l=cs((c-o)*s,-a,a);return o+l};return{rootPitch:r(i.rootPitch,t.rootPitch),rootRoll:r(i.rootRoll,t.rootRoll),jointPitch:r(i.jointPitch,t.jointPitch)}}function Cd(i,t){return{pelvisPos:i.position.clone(),pelvisRotX:i.rotation.x,pelvisRotZ:i.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Qo={active:!1,weight:0,clamped:0,maxError:0};function Pd(i){const{root:t,pelvis:e,lower:n,limbs:s,base:a,cfg:r}=i;if(!r.enabled||r.weight<=0||!i.grounded||s.length===0)return{...Qo};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:n.position.clone(),lowerRotZ:n.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,n.position.copy(a.lowerPos),n.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(d=>d.tip.getWorldPosition(new $));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,n.position.copy(o.lowerPos),n.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),n.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(i.attacking?Math.max(0,Math.min(1,r.attackScale)):1),h=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let f=0;for(let d=0;d<s.length;d++){const m=s[d],_=n.worldToLocal(c[d].clone()),g={x:_.x-m.root.position.x,y:_.y-m.root.position.y,z:_.z-m.root.position.z},u=xx(g,m.upperLen,m.lowerLen,m.bend);u.clamped&&(f+=1);const x=vx({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},u,l,h);m.root.rotation.x=x.rootPitch,m.root.rotation.z=x.rootRoll,m.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let p=0;for(let d=0;d<s.length;d++){const m=s[d].tip.getWorldPosition(new $);p=Math.max(p,m.distanceTo(c[d]))}return{active:!0,weight:l,clamped:f,maxError:p}}function Sn(i,t,e){return i<t?t:i>e?e:i}const Mx={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function yx(i,t,e,n,s,a,r,o,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Me,p=new Me;p.name="pelvis",p.position.y=i.legLength,f.add(p);const d=new Me;d.name="lower";const m=new Me;m.name="upper",p.add(d),p.add(m);const _=[],g=(lt,Tt,j,at)=>{const ut=new us({color:at}),w=new re(new un(lt,Tt,j),ut);return w.castShadow=!0,w.receiveShadow=!0,_.push(ut),w},u=i.headSize,x=i.legLength,S=i.armLength,v=i.limbThickness,I=i.bodyHeight,A=i.bodyWidth,P=g(A,I,.28,e);P.position.y=I/2,m.add(P);const L=new Me;L.position.y=I,m.add(L);const b=g(u,u,u,e);b.position.y=u/2,L.add(b);for(const lt of[-1,1]){const Tt=g(.06,.07,.02,t.shoe);Tt.position.set(lt*.09,u/2+.03,u/2+.011),L.add(Tt)}const M=(lt,Tt)=>{const j=Tt?S:x,at=new Me;at.name=Tt?lt<0?"shoulderL":"shoulderR":lt<0?"hipL":"hipR",Tt||(at.rotation.order="ZYX"),at.position.set(lt*(Tt?A/2+v/2:A/2-v/2),Tt?I-.04:0,0),(Tt?m:d).add(at);const ut=g(v,j/2,v,t.limb);ut.position.y=-j/4,at.add(ut);const w=new Me;w.name=Tt?"elbow":"knee",w.position.y=-j/2,at.add(w);const y=g(v,j/2,v,t.limb);if(y.position.y=-j/4,w.add(y),!Tt){const H=g(v*1.15,.07,v*1.7,t.shoe);H.position.set(0,-j/2+.035,.045),w.add(H);const C=new he;return C.name="footTip",C.position.y=-j/2,w.add(C),{root:at,joint:w,tip:C}}return{root:at,joint:w}},R=M(-1,!1),Y=M(1,!1),z=M(-1,!0),T=M(1,!0),D=[R,Y].map(lt=>({root:lt.root,joint:lt.joint,tip:lt.tip,upperLen:x/2,lowerLen:x/2,bend:1})),U=new an({color:s.attackArcColor,transparent:!0,opacity:0,side:Ae,depthWrite:!1}),q=new re(new Da(.62,.042,6,20,Math.PI*1.1),U);q.position.set(0,.78-x,.56),m.add(q);const F=document.createElement("canvas");F.width=256,F.height=72;const K=F.getContext("2d"),it=new $_(F),ft=new Md({map:it,transparent:!0,depthTest:!1,depthWrite:!1}),ht=new W_(ft);ht.scale.set(1.85,.52,1),ht.position.y=1.7-x,ht.renderOrder=20,m.add(ht);function xt(lt){K&&(K.clearRect(0,0,256,72),K.fillStyle=s.labelBg,K.fillRect(0,0,256,72),K.strokeStyle=e,K.lineWidth=5,K.strokeRect(3,3,250,66),K.fillStyle=e,K.font="bold 29px ui-monospace, Menlo, Consolas, monospace",K.textAlign="center",K.textBaseline="middle",K.fillText(`${n} ${Mx[lt]}`,128,38),it.needsUpdate=!0)}const J=new Bt(e),Q=new Bt(o.flashColor),ot=new Bt;let pt=null,gt=0,St=0,Pt=0,Ut=0,_t=0,Xt=0,N=0,Zt={...Qo};return{group:f,update(lt,Tt){f.position.set(lt.position.x,lt.position.y,lt.position.z),f.rotation.y=lt.bodyYaw,L.rotation.y=(lt.headYaw-lt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,lt.mode!==pt&&(pt=lt.mode,xt(lt.mode),gt=1),gt=Math.max(0,gt-Tt*2.2);const j=lt.hurt,at=Td(j,lt.bodyYaw,o),ut=at.flash;ot.copy(Q).multiplyScalar(ut);for(const ct of _)ct.emissive.copy(J).multiplyScalar(gt*.5),ut>0&&ct.emissive.add(ot);p.position.set(0,x,0),p.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),d.position.set(0,0,0),d.rotation.z=0;const w=Math.hypot(lt.velocity.x,lt.velocity.z),y=Math.sin(lt.bodyYaw),H=Math.cos(lt.bodyYaw),C=Math.cos(lt.bodyYaw),W=-Math.sin(lt.bodyYaw),Z=Ed({phase:lt.gaitPhase,speed:w,moveSpeed:a,localForward:lt.velocity.x*y+lt.velocity.z*H,localRight:lt.velocity.x*C+lt.velocity.z*W,legLength:i.legLength,stride:lt.stride,grounded:!0},r);R.root.rotation.x=Z.legL.pitchX,Y.root.rotation.x=Z.legR.pitchX,R.root.rotation.z=Z.legL.rollZ,Y.root.rotation.z=Z.legR.rollZ,R.joint.rotation.x=Z.legL.kneeX,Y.joint.rotation.x=Z.legR.kneeX,z.root.rotation.x=Z.armL,T.root.rotation.x=Z.armR,z.joint.rotation.x=-.18,T.joint.rotation.x=-.18,p.position.x=Z.pelvisX,p.position.y=x+Z.pelvisY,p.rotation.z=Z.pelvisRoll,m.rotation.z=Z.sideLean*(at.intensity>0?.4:1);const nt=Cd(p,d);if(c){const ct=Math.max(.004166666666666667,Math.min(Tt,.1)),vt=Math.sin(lt.bodyYaw),Ct=Math.cos(lt.bodyYaw),kt=Sn((lt.velocity.x-St)/ct,-60,60),bt=Sn((lt.velocity.z-Pt)/ct,-60,60),zt=kt*vt+bt*Ct,Ft=dn(lt.bodyYaw-Ut)/ct,Yt=c.maxForwardDeg*Math.PI/180,O=c.maxSideDeg*Math.PI/180,B=1-Math.exp(-Math.max(0,c.smoothing)*ct);_t+=(Sn(zt*c.accelGain,-Yt,Yt)-_t)*B,Xt+=(Sn(-Ft*w*c.turnGain,-O,O)-Xt)*B;const k=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;N+=(Sn(w/Math.max(a,1e-6),0,1)-N)*(1-Math.exp(-Math.max(0,k)*ct));const V=Rd({leanForward:_t,leanSide:Xt,speedRatio:N},c);m.rotation.x+=_t,m.rotation.z+=Xt,p.rotation.x+=V.pelvisPitch,p.rotation.z+=V.pelvisRoll,p.position.x+=V.pelvisX,p.position.z+=V.pelvisZ,p.position.y-=V.crouch;const st=h.enabled?Sn(h.weight,0,1):0;d.position.y+=V.crouch*(1-st)}St=lt.velocity.x,Pt=lt.velocity.z,Ut=lt.bodyYaw,m.rotation.x+=at.upperPitch,m.rotation.z+=at.upperRoll,m.rotation.y+=at.upperYaw;const rt=Sn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),mt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Sn(at.upperShiftX*rt,-mt,mt),m.position.z+=Sn(at.upperShiftZ*rt,-mt,mt),p.position.x+=at.comX,p.position.z+=at.comZ-at.pelvisBack,p.position.y-=at.drop;const Rt=at.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(d.position.z+=at.pelvisBack*(1-Rt),d.position.y+=at.drop*(1-Rt),R.joint.rotation.x+=at.knee,Y.joint.rotation.x+=at.knee,R.root.rotation.x-=at.hip,Y.root.rotation.x-=at.hip,z.root.rotation.x+=at.arm,T.root.rotation.x+=at.arm*.8,lt.attackPhase!=="idle"&&at.intensity===0){const ct=lt.attackProgress,vt=ct<.34?-1:ct<.68?-1+(ct-.34)/.34*2:Math.max(0,1-(ct-.68)/.32),Ct=Math.max(0,-vt),kt=Math.max(0,vt);T.root.rotation.x=-1.7*Ct+1.25*kt,T.joint.rotation.x=-(.25+Ct*.45),m.rotation.y=-.28*vt,U.opacity=lt.attackPhase==="active"?.85:0,lt.attackPhase==="active"&&(q.rotation.z=-1.1+ct*3)}else U.opacity=0;Zt=Pd({root:f,pelvis:p,lower:d,limbs:D,base:nt,cfg:h,grounded:!0,attacking:lt.attackPhase!=="idle"})},ik(){return Zt},dispose(){f.traverse(lt=>{if(lt instanceof re){lt.geometry.dispose();const Tt=lt.material;Array.isArray(Tt)?Tt.forEach(j=>j.dispose()):Tt.dispose()}}),it.dispose(),ft.dispose()}}}function Dd(i){return{x:0,y:0,z:1}}function Sx(i){return Math.asin(Dd().y)}function bx(i,t){const e=Math.cos(t),n=Math.sin(t);return{x:i.x*e+i.z*n,y:i.y,z:-0*n+i.z*e}}function Ee(i,t,e){return i<t?t:i>e?e:i}const Pl=1e-6;function le(i,t,e,n){const s=new re(new un(i,t,e),new us({color:n}));return s.castShadow=!0,s.receiveShadow=!0,s}function ge(){return new Me}function da(i,t,e){const n=ge(),s=le(t*.7,.12,t*.7,e.wood);s.position.y=.06,n.add(s);const a=le(t*2.4,.045,t*.8,e.metal);a.position.y=.13,n.add(a);const r=le(t*.38,i,t,e.blade);r.position.y=.13+i/2,n.add(r);const o=le(t*.42,i*.96,t*.2,e.bladeEdge);o.position.set(0,.13+i/2,t*.5),n.add(o);const c=le(t*.3,.09,t*.45,e.blade);return c.position.y=.13+i+.045,n.add(c),n}function Ex(i){const t=da(.72,.15,i),e=le(.12,.46,.12,i.wood);return e.position.y=-.3,t.add(e),t}function wx(i){const t=ge(),e=le(.32,.38,.06,i.metal);e.position.set(0,.02,.1),t.add(e);const n=le(.11,.11,.045,i.blade);return n.position.set(0,.02,.145),t.add(n),t}function Ax(i){const t=ge(),e=le(.055,.88,.055,i.wood);e.position.y=.42,t.add(e);const n=le(.15,.15,.15,i.glow);n.position.y=.92;const s=n.material;return s.emissive=new Bt(i.glow),s.emissiveIntensity=.85,t.add(n),{g:t,orb:n}}function Tx(i){const t=ge();for(let n=0;n<5;n++){const s=(n-2)*.15,a=le(.055,.16,.05,i.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=le(.014,.66,.014,i.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Rx(i){const t=ge(),e=le(.025,.025,.46,i.wood);e.position.z=.23,t.add(e);const n=le(.055,.055,.09,i.blade);return n.position.z=.5,t.add(n),t}function Cx(i,t,e,n,s,a,r,o,c,l,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},p=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},d=ge(),m=ge();m.name="pelvis",m.position.y=i.legLength,d.add(m);const _=ge();_.name="lower";const g=ge();g.name="upper",m.add(_),m.add(g);const u=i.headSize,x=i.legLength,S=i.armLength,v=i.limbThickness,I=i.bodyHeight,A=i.bodyWidth,P=le(A,I,.28,t.body);P.position.y=I/2,g.add(P);const L=ge();L.position.y=n.headPivotHeight,g.add(L);const b=le(u,u,u,t.head);b.position.y=u/2,L.add(b);const M=new us({color:"#1b2733"});for(const B of[-1,1]){const k=new re(new un(.06,.07,.02),M);k.position.set(B*.09,u/2+.03,u/2+.011),L.add(k)}const R=B=>{const k=ge();k.name=B<0?"hipL":"hipR",k.rotation.order="ZYX",k.position.set(B*(A/2-v/2),0,0),_.add(k);const V=le(v,x/2,v,t.limb);V.position.y=-x/4,k.add(V);const st=ge();st.name="knee",st.position.y=-x/2,k.add(st);const dt=le(v,x/2,v,t.limb);dt.position.y=-x/4,st.add(dt);const yt=le(v*1.15,.07,v*1.7,t.shoe);yt.position.set(0,-x/2+.035,.045),st.add(yt);const Ht=new he;return Ht.name="footTip",Ht.position.y=-x/2,st.add(Ht),{root:k,joint:st,hand:ge(),tip:Ht}},Y=B=>{const k=ge();k.name=B<0?"shoulderL":"shoulderR",k.position.set(B*(A/2+v/2),I-.04,0),g.add(k);const V=le(v,S/2,v,t.limb);V.position.y=-S/4,k.add(V);const st=ge();st.name="elbow",st.position.y=-S/2,k.add(st);const dt=le(v,S/2,v,t.limb);dt.position.y=-S/4,st.add(dt);const yt=ge();yt.position.y=-S/2,st.add(yt);const Ht=le(v*1.1,.09,v*1.1,t.head);return Ht.position.y=.045,yt.add(Ht),{root:k,joint:st,hand:yt}},z=R(-1),T=R(1),D=Y(-1),U=Y(1),q=[z,T].map(B=>({root:B.root,joint:B.joint,tip:B.tip,upperLen:x/2,lowerLen:x/2,bend:1})),F=ge(),K=ge();U.hand.add(F),D.hand.add(K);const it=Ax(t),ft=Tx(t),ht=Rx(t),xt={"sword-shield":{right:da(.42,.075,t),left:wx(t)},"dual-swords":{right:da(.42,.075,t),left:da(.42,.075,t)},greatsword:{right:Ex(t),left:le(.12,.2,.12,t.wood)},staff:{right:it.g,left:ge(),orb:it.orb},bow:{right:ht,left:ft.g,arrow:ht,drawString:ft.drawString}};for(const B of Object.keys(xt))F.add(xt[B].right),K.add(xt[B].left),xt[B].right.visible=!1,xt[B].left.visible=!1;let J=null,Q=0,ot=0,pt=0,gt=0,St=0,Pt=0,Ut=px(),_t={...Qo},Xt=0,N=0,Zt=0,lt=0,Tt=0,j=1,at={speed:0,phase:0},ut=0,w=0,y=!0,H=0,C="none",W=0,Z=0,nt=0,rt=.3,mt=0;function Rt(B){const k=Math.PI/180,V=a;let st=0,dt=0,yt=0,Ht=0;B==="sword-shield"?(st=V.swordPitchDeg*k,dt=-V.swordYawDeg*k,yt=V.shieldPitchDeg*k):B==="dual-swords"?(st=V.swordPitchDeg*k,dt=-V.swordYawDeg*k,yt=V.swordPitchDeg*k,Ht=V.swordYawDeg*k):B==="greatsword"?(st=V.greatswordPitchDeg*k,dt=-V.greatswordYawDeg*k,yt=V.greatswordPitchDeg*k,Ht=V.greatswordYawDeg*k):B==="staff"?st=V.staffPitchDeg*k:yt=V.bowPitchDeg*k,F.rotation.set(st,0,dt),K.rotation.set(yt,0,Ht)}function ct(B){if(B!==J){J=B;for(const k of Object.keys(xt))xt[k].right.visible=k===B,xt[k].left.visible=k===B;Rt(B),ft.drawString.position.z=-.06,ht.position.z=0,it.orb.scale.setScalar(1),g.rotation.y=0}}ct("sword-shield");const vt=[];d.traverse(B=>{B instanceof re&&B.material instanceof us&&vt.push(B.material)});const Ct=new Bt(o.flashColor);function kt(B,k){const V=Td(B,k,o);Ut=V,g.rotation.x+=V.upperPitch,g.rotation.z+=V.upperRoll,g.rotation.y+=V.upperYaw;const st=Ee(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),dt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Ee(V.upperShiftX*st,-dt,dt),g.position.z+=Ee(V.upperShiftZ*st,-dt,dt),m.position.x+=V.comX,m.position.z+=V.comZ-V.pelvisBack,m.position.y-=V.drop;const yt=V.legacy?0:Ee(o.lowerScale,0,1);_.position.z+=V.pelvisBack*(1-yt),_.position.y+=V.drop*(1-yt),z.joint.rotation.x+=V.knee,T.joint.rotation.x+=V.knee,z.root.rotation.x-=V.hip,T.root.rotation.x-=V.hip,D.root.rotation.x+=V.arm,U.root.rotation.x+=V.arm*.8;for(const Ht of vt)Ht.emissive.copy(Ct).multiplyScalar(V.flash)}function bt(B){return B<.3?-1:B<.62?-1+(B-.3)/.32*2:Math.max(0,1-(B-.62)/.38)}function zt(B){if(B.phase==="idle"||B.charging)return;const k=B.attackProgress,V=bt(k),st=Math.max(0,V),dt=B.comboIndex%2===0?1:-1,yt=c.stride,Ht=Number.isFinite(yt.stepReach)?yt.stepReach:.17,te=Number.isFinite(yt.stepSideReach)?yt.stepSideReach:.14,Vt=Number.isFinite(yt.stepDipReach)?yt.stepDipReach:.05,qt=B.weapon==="greatsword"?Ee(Number.isFinite(yt.heavyScale)?yt.heavyScale:1,0,1):1;m.position.z+=Ht*st*qt,m.position.x+=dt*te*st*qt,m.position.y-=Vt*Math.sin(Math.PI*k)*qt}function Ft(B){if(ft.drawString.position.z=-.06,ht.position.z=0,it.orb.scale.setScalar(1),g.rotation.y=0,B.charging&&B.weapon==="bow"){const dt=B.charge;D.root.rotation.x=-1.25,D.joint.rotation.x=-.15,U.root.rotation.x=.35+dt*.3,U.joint.rotation.x=-1.15,ft.drawString.position.z=-.06-dt*.22,ht.position.z=-dt*.3,g.rotation.y=-.22;return}if(B.phase==="idle")return;const k=bt(B.attackProgress),V=Math.max(0,-k),st=Math.max(0,k);if(B.weapon==="bow")D.root.rotation.x=-1.2,D.joint.rotation.x=-.15,U.root.rotation.x=.9-st*.8,U.joint.rotation.x=-.3;else if(B.weapon==="greatsword"){const dt=-1.6*V+1.25*st,yt=Ee(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);U.root.rotation.x=dt,U.joint.rotation.x=-(.25+V*.4),D.root.rotation.x=dt+.06,D.joint.rotation.x=-(.32+V*.4),D.root.rotation.z=.38,g.rotation.y=-.2*k*yt}else{const dt=B.comboIndex;if(dt===1)U.root.rotation.x=-1.7*V+1.1*st,U.joint.rotation.x=-(.2+V*.5),D.root.rotation.x=.1,g.rotation.y=-.18*k;else if(dt===2)D.root.rotation.x=-1.5*V+1*st,D.joint.rotation.x=-(.2+V*.5),U.root.rotation.x=.2,g.rotation.y=.45*-k;else{const yt=-1.9*V+1.2*st;D.root.rotation.x=yt,U.root.rotation.x=yt,D.joint.rotation.x=-(.15+V*.4),U.joint.rotation.x=-(.15+V*.4),g.rotation.y=-.3*k}}zt(B)}function Yt(B,k){B&&(U.root.rotation.x=-1.05,U.joint.rotation.x=-.35,D.root.rotation.x=-.45,D.joint.rotation.x=-.2,g.rotation.y=-.12,it.orb.scale.setScalar(1.25+.12*Math.sin(k*2)))}function O(B){if(!B||B.phase==="idle")return;const k=B.progress,V=k<.3?-.35+k/.3*1.35:k<.7?1:Math.max(0,1-(k-.7)/.3),st=Math.PI/180;g.rotation.x+=p.leanDeg*st*V,D.root.rotation.x-=p.shieldPitchDeg*st*V,D.joint.rotation.x-=.22*V,U.root.rotation.x-=.3*V,m.position.z+=p.pelvisReach*Math.max(0,V)}return{group:d,update(B,k,V,st,dt=!1,yt,Ht){ct(k.weapon),g.rotation.x=0,g.rotation.z=0,m.position.x=0,m.position.y=x,m.position.z=0,m.rotation.z=0,m.rotation.x=0,g.position.x=0,g.position.y=0,g.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const te=Math.max(1/240,Math.min(st,.1)),Vt=yt===void 0?ut+=st:yt;w=Vt;const qt=c.landing;qt.enabled?y&&!B.grounded?(C="jump",W=Vt,Z=qt.anticipationDuration,nt=Math.max(0,qt.jumpAnticipation),rt=.32):!y&&B.grounded&&(C="land",W=Vt,Z=qt.duration,nt=fx(H,qt),rt=qt.compressRatio,mt=H):(C="none",nt=0),Vt<W&&(C="none",nt=0),y=B.grounded,H=B.velocity.y;const ce=Cl(Vt,W,Z,nt,rt),We=k.phase!=="idle";lt=dx(lt,We,te,c.attack.blendRate);const fn=hx(lt,c.attack.gaitWeight,c.attack.lowerBodyWeight);Tt=fn.attackLegWeight,j=fn.gaitScale;const pn=Math.sin(B.bodyYaw),$i=Math.cos(B.bodyYaw),gs=(B.velocity.x-Q)/te,_s=(B.velocity.z-ot)/te,li=Ee(gs,-60,60),xs=Ee(_s,-60,60),di=li*pn+xs*$i,vs=dn(B.bodyYaw-pt)/te,Ms=Math.hypot(B.velocity.x,B.velocity.z),ys=r.maxForwardDeg*Math.PI/180,Ss=r.maxSideDeg*Math.PI/180,La=Ee(di*r.accelGain,-ys,ys),E=Ee(-vs*Ms*r.turnGain,-Ss,Ss),G=1-Math.exp(-r.smoothing*te);gt+=(La-gt)*G,St+=(E-St)*G,Q=B.velocity.x,ot=B.velocity.z,pt=B.bodyYaw;const tt=Math.hypot(B.velocity.x,B.velocity.z),et=Math.cos(B.bodyYaw),X=-Math.sin(B.bodyYaw),Mt=B.velocity.x*et+B.velocity.z*X,wt=tt>Pl?Ee(Mt/tt,-1,1):0,Dt=n.hipYawMaxDeg*Math.PI/180,Lt=n.legYawScale*wt*Dt;N+=(Lt-N)*(1-Math.exp(-n.hipYawSmoothing*te));const Nt=B.bodyYaw+N;Zt=Nt;const Ot=Math.sin(Nt),It=Math.cos(Nt),jt=Math.cos(Nt),ee=-Math.sin(Nt),ne={speed:tt,phase:B.gaitPhase,localForward:B.velocity.x*Ot+B.velocity.z*It,localRight:B.velocity.x*jt+B.velocity.z*ee},fe=We?cx(ne,k.attackProgress,k.comboIndex,lt,c.stride):ne;at=fe;const Jt={phase:fe.phase,speed:fe.speed,moveSpeed:e,localForward:fe.localForward,localRight:fe.localRight,legLength:i.legLength,stride:We?0:B.stride,grounded:B.grounded},At=ux(Ed(Jt,s),fn.gaitScale);B.grounded?(z.root.rotation.x=At.legL.pitchX,T.root.rotation.x=At.legR.pitchX,z.root.rotation.z=At.legL.rollZ,T.root.rotation.z=At.legR.rollZ,z.joint.rotation.x=At.legL.kneeX,T.joint.rotation.x=At.legR.kneeX,D.root.rotation.x=At.armL,U.root.rotation.x=At.armR,D.joint.rotation.x=-(.18+At.armL*.2),U.joint.rotation.x=-(.18+At.armR*.2),D.root.rotation.z=0,U.root.rotation.z=0,m.position.x=At.pelvisX,m.position.y=x+At.pelvisY,m.rotation.z=At.pelvisRoll):(z.root.rotation.x=-.55,T.root.rotation.x=-.25,z.joint.rotation.x=.75,T.joint.rotation.x=.55,D.root.rotation.x=-.9,U.root.rotation.x=-.7,D.joint.rotation.x=-.6,U.joint.rotation.x=-.6,z.root.rotation.z=0,T.root.rotation.z=0);const Xe=Cd(m,_),Qt=tt/Math.max(e,Pl),Ie=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,Cn=1-Math.exp(-Math.max(0,Ie)*te);Xt+=(Ee(Qt,0,1)-Xt)*Cn;const pe=Rd({leanForward:gt,leanSide:St,speedRatio:Xt},r);m.rotation.x+=pe.pelvisPitch,m.rotation.z+=pe.pelvisRoll,m.position.x+=pe.pelvisX,m.position.z+=pe.pelvisZ,m.position.y-=pe.crouch;const Wn=f.enabled&&B.grounded?Ee(f.weight,0,1)*(We?Ee(f.attackScale,0,1):1):0;_.position.y+=pe.crouch*(1-Ee(Wn,0,1)),Ft(k),Yt(dt,B.gaitPhase),O(Ht);const ae=a.greatswordPitchDeg*Math.PI/180,ke=k.weapon==="greatsword",Pn=Math.hypot(B.velocity.x,B.velocity.z),tn=ke&&k.phase==="idle"&&Pn>.5?Math.min(1.15,Pn/Math.max(e,.001)*.9):0;Pt+=(tn-Pt)*(1-Math.exp(-6*te)),ke&&(F.rotation.x=ae+Pt),k.weapon==="bow"&&(ft.g.rotation.x=-(D.root.rotation.x+D.joint.rotation.x),ht.rotation.x=-(U.root.rotation.x+U.joint.rotation.x));const en=g.rotation.y;kt(V,B.bodyYaw);const Yi=V.type==="none"?1:.4;if(g.rotation.x+=gt*Yi,g.rotation.z+=(St+At.sideLean)*Yi,ce>0&&(z.root.rotation.x-=qt.hipPitch*ce,T.root.rotation.x-=qt.hipPitch*ce,z.joint.rotation.x+=qt.kneeBend*ce,T.joint.rotation.x+=qt.kneeBend*ce,m.position.y-=qt.crouchDepth*ce,_.position.y+=qt.crouchDepth*(1-qt.lowerScale)*ce,g.rotation.x+=qt.upperPitch*ce,D.root.rotation.x-=qt.armTuck*ce,U.root.rotation.x-=qt.armTuck*ce),Tt>0&&B.grounded){const mn=lx(k.attackProgress,k.comboIndex,c.stride),gn=Tt;z.root.rotation.x+=mn.legL.pitchX*gn,T.root.rotation.x+=mn.legR.pitchX*gn,z.root.rotation.z+=mn.legL.rollZ*gn,T.root.rotation.z+=mn.legR.rollZ*gn,z.joint.rotation.x+=mn.legL.kneeX*gn,T.joint.rotation.x+=mn.legR.kneeX*gn,m.position.x+=mn.pelvisX*gn,m.position.y+=mn.pelvisY*gn,m.rotation.z+=mn.pelvisRoll*gn}_.rotation.y=N;const Ld=en;L.rotation.y=dn(B.headYaw-B.bodyYaw-Ld),_t=Pd({root:d,pelvis:m,lower:_,limbs:q,base:Xe,cfg:f,grounded:B.grounded,attacking:We})},lean(){return{forward:gt,side:St}},landing(){const B=Cl(w,W,Z,nt,rt),k=Z>0?Math.max(0,Z-Math.max(0,w-W)):0;return{pulse:B,remaining:k,kind:B>0?C:"none",impactVy:mt}},hurt(){return Ut},ik(){return _t},attackBlend(){return lt},attackWeights(){return{gaitScale:j,attackLegWeight:Tt,driveSpeed:at.speed,stridePhase:at.phase}},hipYaw(){return N},gaitYaw(){return Zt},arrowDirection(){ht.updateWorldMatrix(!0,!1);const B=ht.matrixWorld.elements,k=B[8],V=B[9],st=B[10],dt=Math.hypot(k,V,st)||1;return{x:k/dt,y:V/dt,z:st/dt}},dispose(){d.traverse(B=>{if(B instanceof re){B.geometry.dispose();const k=B.material;Array.isArray(k)?k.forEach(V=>V.dispose()):k.dispose()}})}}}function Px(i,t){switch(i){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function Dx(i,t,e){const n=Math.max(1,i.clientWidth),s=Math.max(1,i.clientHeight),a=new H_({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=Wl,a.setSize(n,s,!1),i.appendChild(a.domElement);const r=new V_;r.background=new Bt("#12161d"),r.add(new Z_(11061486,2764600,1.15));const o=new K_(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],h=new Me;for(const j of t.boxes){const at=j.maxX-j.minX,ut=j.maxY-j.minY,w=j.maxZ-j.minZ;let y=Px(j.kind,e);j.kind==="step"&&(y=new Bt(y).offsetHSL(0,0,j.maxY*.09).getStyle());const H=new us({color:y,transparent:!0,opacity:1}),C=new re(new un(at,ut,w),H);C.position.set((j.minX+j.maxX)/2,(j.minY+j.maxY)/2,(j.minZ+j.maxZ)/2),C.castShadow=j.kind!=="ground",C.receiveShadow=!0,C.add(new Sd(new Y_(C.geometry),new jo({color:10467020,transparent:!0,opacity:.32}))),h.add(C),l.push(H)}r.add(h);const f=t.gridMeta.maxX-t.gridMeta.minX,p=new Q_(f,f,4873328,3358797);p.position.y=.002,p.visible=e.showGrid,r.add(p);const d=Cx(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),m=new Me,_=.9,g=new Me;g.position.y=_,d.group.position.y=-_,g.add(d.group),m.add(g),r.add(m);const u=t.dummies.map((j,at)=>{const ut=e.dummies.colors,w=ut[at%ut.length]??"#cccccc",y=yx(e.voxel,e.colors,w,j.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return y.group.traverse(H=>{H.userData.dummyId=j.id}),r.add(y.group),y}),x=u.map(j=>j.group),S=new J_,v=e.targeting.ringRadius,I=new an({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:Ae,depthWrite:!1}),A=new re(new Ii(v-.07,v,28),I);A.rotation.x=-Math.PI/2,A.position.y=.03,A.visible=!1,r.add(A);const P=new Me;r.add(P);const L=new an({color:12577023,transparent:!0,opacity:0,side:Ae,depthWrite:!1}),b=new Me;b.position.set(0,.95,.72),P.add(b);const M=new Me;M.rotation.x=Sx(e.camera.pitchDeg),b.add(M);const R=new re(new Da(.78,.045,6,24,Math.PI*1.15),L);M.add(R);const Y=new Jo(1,0),z=new an({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),T=Array.from({length:16},()=>{const j=new re(Y,z);return j.visible=!1,r.add(j),j}),D=new Ii(.86,1,40),U=Array.from({length:6},()=>{const j=new an({color:10146047,transparent:!0,opacity:0,side:Ae,depthWrite:!1}),at=new re(D,j);return at.rotation.x=-Math.PI/2,at.visible=!1,r.add(at),{mesh:at,mat:j}}),q=new an({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),F=new re(new un(.035,.035,.5),q);P.add(F);const K=e.dash,it=new Ii(K.ringRadius-.06,K.ringRadius,28),ft=Array.from({length:6},()=>{const j=new an({color:16777215,transparent:!0,opacity:0,side:Ae,depthWrite:!1}),at=new re(it,j);return at.rotation.x=-Math.PI/2,at.visible=!1,r.add(at),{mesh:at,mat:j,life:0,base:1}});function ht(j,at,ut,w,y){const H=ft.find(C=>C.life<=0)??ft[0];H.mat.color.set(w),H.mesh.position.set(j,ut+.04,at),H.base=y,H.mesh.scale.setScalar(y*.6),H.mesh.visible=!0,H.mat.opacity=.9,H.life=K.fxDuration}const xt=e.links,J=new Ii(xt.ringRadius-.07,xt.ringRadius,28),Q=Array.from({length:5},()=>{const j=new an({color:xt.chargeColor,transparent:!0,opacity:0,side:Ae,depthWrite:!1}),at=new re(J,j);return at.rotation.x=-Math.PI/2,at.visible=!1,r.add(at),{mesh:at,mat:j,life:0,base:1}});function ot(j,at,ut,w){const y=Q.find(H=>H.life<=0)??Q[0];y.mesh.position.set(j,ut+.05,at),y.base=w,y.mesh.scale.setScalar(w*.55),y.mesh.visible=!0,y.mat.opacity=.85,y.life=xt.fxDuration}let pt=t.playerLink.id,gt=t.playerLink.hitIds.length,St=t.dash.id,Pt="none",Ut=0,_t=-1,Xt=1;const N=ex(e.camera,e.smartCamera,e.zoom,n/s),Zt=t.character.position;N.update(Zt.x,Zt.y,Zt.z,1,t.camera);function lt(j,at){if(x.length===0)return 0;const ut=a.domElement.getBoundingClientRect(),w=new Gt((j-ut.left)/ut.width*2-1,-((at-ut.top)/ut.height)*2+1);S.setFromCamera(w,N.camera);const y=S.intersectObjects(x,!0);for(const H of y){const C=H.object.userData.dummyId;if(C&&C>0)return C}return 0}function Tt(j,at,ut){const w=a.domElement.getBoundingClientRect(),y=new $(j,at,ut).project(N.camera);return{x:w.left+(y.x*.5+.5)*w.width,y:w.top+(-y.y*.5+.5)*w.height}}return{render(j,at){const ut=j.character,w=j.combat;m.position.set(ut.position.x,ut.position.y,ut.position.z),m.rotation.y=ut.bodyYaw;const y=j.dash.phase==="active"&&j.dash.kind==="roll",H=y&&j.dash.duration>0?Math.min(1,1-j.dash.timer/j.dash.duration):0;g.rotation.x=y?H*Math.PI*2:0,g.position.y=_-(y?.2*Math.sin(Math.PI*H):0),d.update(ut,w,j.playerHurt,at,j.abilities.channeling,j.time,j.playerLink);for(let nt=0;nt<u.length;nt++)j.dummies[nt]&&u[nt].update(j.dummies[nt],at);const C=j.targeting.hasTarget?j.dummies[j.targeting.targetId-1]:void 0;if(A.visible=!!C,C&&(A.position.set(C.position.x,C.position.y+.03,C.position.z),A.scale.setScalar(1+.07*Math.sin(j.time*6))),P.position.set(ut.position.x,ut.position.y,ut.position.z),P.rotation.y=w.phase!=="idle"?w.attackFacing:ut.bodyYaw,j.dash.id!==St){St=j.dash.id;const nt=j.dash;Pt=nt.kind,nt.kind==="blink"?(ht(nt.fromX,nt.fromZ,ut.position.y,K.blinkColor,.9),ht(nt.toX,nt.toZ,ut.position.y,K.blinkColor,1.35)):ht(nt.fromX,nt.fromZ,ut.position.y,K.rollColor,1.1)}for(const nt of ft){if(nt.life<=0)continue;nt.life-=at;const rt=Math.max(0,nt.life/K.fxDuration);nt.mat.opacity=.9*rt,nt.mesh.scale.setScalar(nt.base*(.6+(1-rt)*1.2)),nt.life<=0&&(nt.mesh.visible=!1)}const W=j.playerLink;W.id!==pt&&(pt=W.id,gt=W.hitIds.length,ot(ut.position.x,ut.position.z,ut.position.y,1)),W.hitIds.length>gt?(gt=W.hitIds.length,ot(ut.position.x,ut.position.z,ut.position.y,1.35)):W.hitIds.length<gt&&(gt=W.hitIds.length);for(const nt of Q){if(nt.life<=0)continue;nt.life-=at;const rt=Math.max(0,nt.life/Math.max(xt.fxDuration,1e-6));nt.mat.opacity=.85*rt,nt.mesh.scale.setScalar(nt.base*(.55+(1-rt)*1.1)),nt.life<=0&&(nt.mesh.visible=!1)}w.attackId!==Ut&&(Ut=w.attackId,w.weapon==="bow"&&w.phase!=="idle"&&(_t=0,Xt=.6+w.lastCharge*.9));const Z=w.phase==="active"&&w.comboIndex>0;L.opacity=Z?.78:0,Z&&(R.rotation.z=-1.2+w.attackProgress*3.2,R.scale.setScalar(.9+w.comboIndex*.13));for(let nt=0;nt<T.length;nt++){const rt=j.abilities.projectiles[nt],mt=T[nt];mt.visible=!!rt,rt&&(mt.position.set(rt.x,rt.y,rt.z),mt.scale.setScalar(rt.radius),mt.rotation.y+=at*6)}for(let nt=0;nt<U.length;nt++){const rt=j.abilities.rings[nt],mt=U[nt];if(mt.mesh.visible=!!rt,rt){const Rt=Math.max(0,Math.min(1,rt.life/Math.max(rt.duration,1e-6)));mt.mesh.position.set(rt.x,.05,rt.z),mt.mesh.scale.setScalar(rt.radius),mt.mat.opacity=.25+.55*Rt}}if(_t>=0){_t+=at;const nt=_t*14*Xt;F.position.set(0,.85,.6+nt),q.opacity=nt<9?.95:0,nt>=9&&(_t=-1)}else q.opacity=0;N.update(ut.position.x,ut.position.y,ut.position.z,at,j.camera),a.render(r,N.camera)},resize(){const j=Math.max(1,i.clientWidth),at=Math.max(1,i.clientHeight);a.setSize(j,at,!1),N.resize(j/at)},getGroundBasis(){return N.getGroundBasis()},setCollidersVisible(j){for(const at of l)at.opacity=j?.3:1,at.wireframe=j,at.needsUpdate=!0},setGridVisible(j){p.visible=j},setZoom(j){N.setZoom(j)},pickDummy:lt,projectToScreen:Tt,diagnostics(){const j=Dd(e.camera.pitchDeg),at=bx(j,P.rotation.y);return{lean:d.lean(),slashNormal:at,arrowForward:d.arrowDirection(),gait:{hipYaw:d.hipYaw(),gaitYaw:d.gaitYaw()},attackBlend:d.attackBlend(),attackWeights:d.attackWeights(),landing:d.landing(),hurt:d.hurt(),ik:d.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:g.rotation.x,activeRings:ft.filter(ut=>ut.life>0).length,lastKind:Pt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...N.smart()}}},dispose(){d.dispose();for(const j of u)j.dispose();A.geometry.dispose(),I.dispose(),R.geometry.dispose(),L.dispose(),Y.dispose(),z.dispose(),D.dispose();for(const j of U)j.mat.dispose();F.geometry.dispose(),q.dispose();for(const j of ft)j.mat.dispose();it.dispose();for(const j of Q)j.mat.dispose();J.dispose(),h.traverse(j=>{j instanceof re&&j.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}async function Lx(i){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(i),!0}catch{}try{const t=document.createElement("textarea");t.value=i,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,i.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function Ix(i,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=i,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),2e3)}function kx(i,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const n=x=>e.querySelector(`#${x}`),s=n("diag-status"),a=n("diag-text"),r=n("diag-copy"),o=n("diag-json"),c=n("diag-clear"),l=n("diag-toggle"),h=n("diag-close"),f=n("diag-mask");let p=!1,d=!0,m=0;function _(){const x=i.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function g(x){p=x,e.hidden=!x,x?_():a.hidden=!0}function u(x){r.textContent=x,window.clearTimeout(m),m=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),g(!p)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),r.addEventListener("click",()=>{const x=i.summary();Lx(x).then(S=>{S?(u("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),u("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=i.dump(),S=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);Ix(`harness-${x.meta.version}-${S}.json`,JSON.stringify(x)),u("已导出")}),c.addEventListener("click",()=>{i.clear(),a.hidden=!0,_(),u("已清空")}),l.addEventListener("click",()=>{d=!d,i.setEnabled(d),_()}),{tick(){const x=i.status();t==null||t.classList.toggle("is-alert",x.alert),p&&_()},isOpen:()=>p,close:()=>g(!1)}}const Ux={intents:{...Dl},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function Fx(){const i=document.getElementById("app"),t=document.getElementById("hud");if(!i||!t)throw new Error("缺少 #app / #hud 容器");const e=kh(pu,mu),n=Dx(i,e,Ye),s=Fh(e),a=zu(t),r=Bu(t,document.getElementById("hint")),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.13 · 11-06 23:39 · 诊断");const c=M=>String(M).padStart(2,"0"),l=new Date,h=lu({meta:{version:"v0.9.13",buildTime:"11-06 23:39",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=kx(h,o),p=Uu({deadZone:()=>Ye.joystick.deadZone});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const d={timeScale:1,paused:!1,showColliders:Ye.showColliders,showGrid:Ye.showGrid};let m=1;const _=Jh({maxRadiusPx:()=>Ye.joystick.maxRadiusPx,deadZone:Ye.joystick.deadZone,getBasis:()=>n.getGroundBasis(),zoom:()=>Ye.zoom}),g=Array.from(document.querySelectorAll(".wp[data-weapon]"));let u=e.combat.weapon;function x(M){if(M===u)return;u=M;const R=ai.indexOf(M)+1;for(const Y of g)Y.classList.toggle("is-active",Number(Y.dataset.weapon)===R);I.refreshWeapon()}let S=Ux,v=0;const I=Ru(e,Ye,d,{singleStep:()=>s.singleStep(S.intents),reset:()=>{m=1,s.singleStep({...Dl,resetPressed:!0})},resetZoom:()=>{m=1,n.setZoom(1)},onToggleColliders:M=>n.setCollidersVisible(M),onToggleGrid:M=>n.setGridVisible(M)});window.addEventListener("resize",()=>n.resize()),window.__harness={world:e,view:n,clock:s,input:_,viewConfig:Ye,getUserZoom:()=>m,getGestures:()=>S.gestures,getLastGesture:()=>S.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:p,dirAngles:()=>p.last()};let A=performance.now(),P=60,L=0;function b(M){const R=Math.min((M-A)/1e3,.1);A=M,R>0&&(P=P*.9+1/R*.1);const Y=_.sample();Y.intents.resetPressed&&(m=1),m=Vh(m,Y.zoomScale,Ye.zoom.min,Ye.zoom.max),n.setZoom(m);let z=Y.intents.dummyClickId;if(Y.tap){const U=n.pickDummy(Y.tap.x,Y.tap.y);U>0&&(z=U)}z>0&&(v=z),S={...Y,intents:{...Y.intents,dummyClickId:v}};const T=s.frame(R,S.intents,d.timeScale,d.paused,()=>{const U=e.events;for(let q=0;q<U.length;q++)h.event(U[q],e.time)});T>0&&(v=0),h.sample(e,S,R*1e3,T);for(const U of S.gestures)h.gesture(U);M-L>250&&(L=M,f.tick()),x(e.combat.weapon),n.render(e,R),p.update(e,S,n.getGroundBasis());const D=n.diagnostics();a.update(e,P,T,S,d,{attackBlend:D.attackBlend,attackWeights:D.attackWeights,landing:D.landing,hurt:D.hurt,ik:D.ik,zoom:D.camera.zoom},r.hudCompact()),requestAnimationFrame(b)}requestAnimationFrame(b)}Fx();

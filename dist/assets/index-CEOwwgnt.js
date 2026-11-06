(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const yi=["sword-shield","dual-swords","greatsword","staff","bow"],Wa=["wander","follow","keep-distance","attack","idle"],Ql={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Sa=1e-6;function Ua(i,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Sa?Math.atan2(t.aimX,t.aimZ):i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget?i.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Sa?Math.atan2(t.moveX,t.moveZ):i.character.facing}function bh(i,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Sa){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Sa)return{x:t.moveX/e,z:t.moveZ/e};const n=i.character.facing;return{x:Math.sin(n),z:Math.cos(n)}}const on=1e-6,Fr=Math.PI/180;function td(){return{type:"none",timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Nr(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Sc(i,t,e,n,s){i.type=t,i.duration=e,i.timer=e,i.dirX=n,i.dirZ=s,i.knockX=0,i.knockZ=0}function Go(i,t,e){const n=e.duration>0?e.duration:Xo(i,e.type);if(t.kind==="player"){const a=i.playerHurt;if(Sc(a,e.type,n,e.dirX,e.dirZ),!i.config.hits.noDamageToPlayer&&e.knockback>on){const r=e.knockback*i.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}Nr(i,"player-hurt",e.sourceId??0,i.character.position);return}const s=i.dummies[t.index];if(s){if(Sc(s.hurt,e.type,n,e.dirX,e.dirZ),e.knockback>on){const a=e.knockback*i.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}i.hitCount+=1,Nr(i,"hit",s.id,s.position)}}function Vo(i,t,e){Go(i,{kind:"dummy",index:t},e)}function Eh(i,t){const e=[i.playerHurt];for(const s of i.dummies)e.push(s.hurt);const n=Math.exp(-i.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=n,s.knockZ*=n,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function Xo(i,t){const e=i.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function wh(i){const t=i.combat,e=i.config.hits,n=i.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Fr),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=i.config.dummies.radius,l=i.config.targeting.idealRange;for(const h of i.dummies){const p=h.position.x-n.x,u=h.position.z-n.z,d=Math.hypot(p,u);if(d>s+c)continue;const m=d>on?p/d:r,_=d>on?u/d:o;if(d>on&&(p*r+u*o)/d<a)continue;let g="light";t.weapon==="greatsword"?g="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(g="heavy");const f=e.knockback[t.weapon]??0;let x=d;f>0&&(x=Math.max(d+f,l));const M=Math.max(0,x-d);Vo(i,i.dummies.indexOf(h),{type:g,duration:Xo(i,g),dirX:m,dirZ:_,knockback:M})}}function Th(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="active")return;const s=n.weapon===""?void 0:e.moves[n.weapon];if(!s||!s.enabled||!i.modules.hits||!i.modules.dummies)return;const a=s.hit;if(n.pulseTimer-=t,n.pulseTimer>0)return;n.pulseTimer=Math.max(a.pulseInterval,0);const r=i.character.position,o=n.fromX,c=n.fromZ,l=r.x,h=r.z,p=l-o,u=h-c,d=p*p+u*u,m=Math.sin(n.facing),_=Math.cos(n.facing),g=Math.cos(bc(a.arcDeg,0,180)*Fr),f=i.config.dummies.radius;for(let x=0;x<i.dummies.length;x++){const M=i.dummies[x];if(n.hitIds.indexOf(M.id)>=0)continue;const v=d>on?bc(((M.position.x-o)*p+(M.position.z-c)*u)/d,0,1):0,L=o+p*v,w=c+u*v,A=Math.hypot(M.position.x-L,M.position.z-w);let D=!1;if(a.shape==="circle")D=A<=a.radius+f;else if(a.shape==="capsule")D=A<=Math.max(a.radius,a.width)+f;else{const G=M.position.x-l,P=M.position.z-h,R=Math.hypot(G,P),$=R>on?(G*m+P*_)/R>=g:!0;D=R<=a.radius+f&&$||A<=a.width+f}if(!D)continue;const E=M.position.x-o,S=M.position.z-c,C=Math.hypot(E,S);if(C>on&&(E*m+S*_)/C<Math.cos(Math.max(a.arcDeg,90)*Fr))continue;const N=C>on?E/C:m,F=C>on?S/C:_;Go(i,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:N,dirZ:F,knockback:a.knockback}),n.hitIds.push(M.id),Nr(i,"link-hit",M.id,M.position)}}function Ah(i){const t=i.config.hits,e=i.character.position;for(const n of i.events){if(n.type!=="dummy-hit")continue;const s=i.dummies[n.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>on?a/o:0,l=o>on?r/o:1;Go(i,{kind:"player"},{type:"light",duration:Xo(i,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function Rh(i,t){if(!i.modules.hits)return;i.events.some(n=>n.type==="attack-active")&&wh(i),Th(i,t),Ah(i)}function bc(i,t,e){return i<t?t:i>e?e:i}const ha=1e-6;function bs(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Ch(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function Ph(i){const t=i.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function Dh(i){const t=i.abilities,e=i.config.abilities.arcane,n=i.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:n.x+s*r,y:n.y+1,z:n.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,bs(i,"projectile-fire",t.volleyId,o)}function Lh(i,t,e){const n=i.abilities,s=i.config.abilities.arcane,a=i.dash.phase==="active",r=i.playerLink;if(i.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){n.channeling||(n.channeling=!0,n.fireTimer=0,bs(i,"channel-start",0,i.character.position)),n.channelYaw=Ua(i,e),n.fireTimer-=t;let c=0;for(;n.fireTimer<=0&&c++<8;)n.fireTimer+=Math.max(s.fireInterval,ha),Dh(i)}else n.channeling&&(n.channeling=!1,bs(i,"channel-end",0,i.character.position))}function Ih(i,t){const e=i.config.abilities.ring,n=i.dash.phase==="active";if(i.combat.weapon!=="staff"||!t.skill2Pressed||n)return;const s=i.character.position,a={id:++i.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};i.abilities.rings.push(a),bs(i,"ring-place",a.id,s)}function kh(i,t){const e=i.abilities,n=i.config.abilities.arcane,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],p=h.position.x-o.x,u=h.position.z-o.z,d=o.radius+s;if(!(p*p+u*u>d*d)){Vo(i,l,{type:n.hurtType,duration:n.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:n.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function Uh(i,t){const e=i.abilities,n=i.config.abilities.ring,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(n.pulseInterval,ha),a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],p=h.position.x-o.x,u=h.position.z-o.z,d=o.radius+s;if(p*p+u*u>d*d)continue;const m=Math.hypot(p,u),_=m>ha?p/m:0,g=m>ha?u/m:1;Vo(i,l,{type:"heavy",duration:n.stun,dirX:_,dirZ:g,knockback:n.knockback})}bs(i,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function Fh(i,t,e){Lh(i,t,e),Ih(i,e),kh(i,t),Uh(i,t)}function $a(i){i.rngState=i.rngState+1831565813>>>0;let t=i.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Ec=1e-6;function wc(i,t,e){return i<t?t:i>e?e:i}function ed(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function nd(i){const t=i.camera,e=ed();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=i.character.position.x,t.centroidZ=i.character.position.z}function Nh(i){const t=i.camera,e=i.config.camera,n=i.character.position;let s=0,a=0,r=0,o=0;for(const l of i.dummies){const h=l.position.x-n.x,p=l.position.z-n.z,u=Math.hypot(h,p);if(u>e.radius)continue;const d=wc((e.radius-u)/Math.max(Ec,e.radius-e.nearDistance),0,1);let m=d*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(m+=e.attackBoost*d),s+=m,a+=l.position.x*m,r+=l.position.z*m,o+=1}const c=s<=0?0:wc(s/(s+Math.max(Ec,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=n.x,t.centroidZ=n.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,h=r/s;t.centroidX=l,t.centroidZ=h;let p=(l-n.x)*e.framingBias*c,u=(h-n.z)*e.framingBias*c;const d=Math.hypot(p,u);d>e.maxOffset&&(p=p/d*e.maxOffset,u=u/d*e.maxOffset),t.offsetX=p,t.offsetZ=u}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function zh(i){const t=[],e=i.ground.size;t.push(Ai("ground","ground",0,0,e,e,-i.ground.thickness,0));for(const n of i.steps)t.push(Ai(n.id,"step",n.x,n.z,n.width,n.depth,0,n.height));for(const n of i.doorways){const s=n.openingWidth/2,a=n.wallThickness;t.push(Ai(`${n.id}-left`,"wall",n.x-s-n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(Ai(`${n.id}-right`,"wall",n.x+s+n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(Ai(`${n.id}-lintel`,"lintel",n.x,n.z,n.openingWidth,a,n.openingHeight,n.wallHeight))}for(const n of i.obstacles)t.push(Ai(n.id,"obstacle",n.x,n.z,n.width,n.depth,0,n.height));return t}function Ai(i,t,e,n,s,a,r,o){return{id:i,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:n-a/2,maxZ:n+a/2}}const Nn=1e-6;function ba(i,t,e){return i<t?t:i>e?e:i}function zr(i,t,e,n,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of i)l.maxY>n+a+Nn||l.maxY<n-r-Nn||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Wo(i,t,e,n,s){let a=!1;const r=t.y+n;for(let o=0;o<2;o++)for(const c of i){if(c.maxY<=t.y+s+Nn||c.minY>=r-Nn)continue;const l=ba(t.x,c.minX,c.maxX),h=ba(t.z,c.minZ,c.maxZ),p=t.x-l,u=t.z-h,d=p*p+u*u;if(!(d>=e*e))if(a=!0,d>Nn*Nn){const m=Math.sqrt(d),_=(e-m)/m;t.x+=p*_,t.z+=u*_}else{const m=t.x-c.minX,_=c.maxX-t.x,g=t.z-c.minZ,f=c.maxZ-t.z,x=Math.min(m,_,g,f);x===m?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function $o(i,t,e,n,s){const a=t.y+n;for(const r of i){if(r.maxY<=t.y+s+Nn||r.minY>=a-Nn)continue;const o=ba(t.x,r.minX,r.maxX),c=ba(t.z,r.minZ,r.maxZ),l=t.x-o,h=t.z-c;if(l*l+h*h<e*e-Nn)return!0}return!1}const Or=1e-6;function Rn(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Ya(i,t,e,n){const s=Rn(t-i);return i+s*(1-Math.exp(-Math.max(e,Or)*n))}function Tc(i,t,e,n){const s=Rn(t-i),a=Math.abs(s);return a<=n||a<=e?t:Rn(i+Math.sign(s)*Math.max(e,0))}function Oh(i,t,e){const n=i.character,s=i.config.orientation,a=i.combat,r=Math.hypot(e.moveX,e.moveZ),o=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Or,c=i.abilities.channeling,l=a.charging&&a.weapon==="bow"&&i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget;if(a.phase!=="idle")n.facing=a.attackFacing;else if(o||c)n.facing=Ua(i,e);else if(l)n.facing=i.targeting.targetYaw;else if(r>Math.max(s.facingDeadZone,Or)){const m=Math.atan2(e.moveX,e.moveZ),_=s.facingTurnRate*Math.PI/180*t,g=s.facingSnapDeg*Math.PI/180;if(r>=.35)n.facing=Tc(n.facing,m,_,g);else if(r>=s.facingMinMagnitude&&Math.abs(Rn(m-n.facing))>s.facingDeadbandDeg*Math.PI/180){const x=Ya(n.facing,m,s.facingSmoothRate,t);n.facing=Tc(n.facing,x,_,0)}}const h=n.velocity;Math.hypot(h.x,h.z)>.15&&(n.moveYaw=Math.atan2(h.x,h.z)),n.bodyYaw=Ya(n.bodyYaw,n.facing,s.bodyTurnRate,t);let p=Ya(n.headYaw,n.facing,s.headTurnRate,t);const u=s.maxHeadTurnDeg*Math.PI/180,d=Rn(p-n.bodyYaw);d>u?p=n.bodyYaw+u:d<-u&&(p=n.bodyYaw-u),n.headYaw=p}const Br=1e-6,Bh=Math.PI/180;function Hr(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Yo(i,t,e){return i<t?t:i>e?e:i}function Fa(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Gr(i){const t=i.id,e=i.windowId;Object.assign(i,Fa()),i.id=t,i.windowId=e}function Hh(i){Gr(i)}function Gh(i){Gr(i.playerLink);for(const t of i.dummies)Gr(t.link)}function Vh(i,t){const e=[i.playerLink];for(const n of i.dummies)e.push(n.link);for(const n of e)n.linkWindow=Math.max(0,n.linkWindow-t),n.cooldown=Math.max(0,n.cooldown-t),n.linkWindow===0&&n.phase==="idle"&&n.source!=="none"&&(n.source="none",n.usedWindowId=-1)}function Vr(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(n.linkWindow=Math.max(n.linkWindow,s),n.source=t,n.windowId+=1,n.usedWindowId=-1,n.prevSprinting=!1)}function Ea(i){const t=i.playerLink;if(t.phase==="idle")return;const e=t.id,n=t.windowId;Object.assign(t,Fa()),t.id=e,t.windowId=n,t.fromX=i.character.position.x,t.fromZ=i.character.position.z}function Xh(i,t){const e=i.config.links.search,n=i.character.position,s=Yo(e.maxAngleDeg,0,180)*Bh;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of i.dummies){const l=c.position.x-n.x,h=c.position.z-n.z,p=Math.hypot(l,h);if(p<Br||p>e.range)continue;const u=Math.atan2(l,h);Math.abs(Rn(u-t))>s||p<o&&(o=p,a=c.id,r=u)}return{id:a,yaw:r,dist:a>0?o:0}}function Wh(i,t,e,n){const s=i.config.links,a=i.playerLink,r=i.character.position,o=Ua(i,t),c=Xh(i,o),l=c.id>0?c.yaw:o,h=c.id>0?Yo(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=n,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=h,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,i.dash.cooldown=Math.max(i.dash.cooldown,s.sharedCooldown),Hr(i,"link-start",a.id)}function $h(i,t){const e=i.playerLink;if(e.phase==="idle")return;const n=e.weapon===""?void 0:i.config.links.moves[e.weapon];if(!n){Ea(i);return}if(e.weapon!==i.combat.weapon){Ea(i);return}e.timer+=t;const s=c=>c==="windup"?n.windup:c==="active"?n.active:n.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Hr(i,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Hr(i,"link-end",e.id))}const r=n.windup+n.active+n.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=n.windup+e.timer:e.phase==="recovery"?o=n.windup+n.active+e.timer:o=r,e.progress=r>0?Yo(o/r,0,1):1,e.phase==="active"&&n.active>Br){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Br,n.active-e.timer),h=c/l;i.impulse.x=Math.sin(e.facing)*h,i.impulse.z=Math.cos(e.facing)*h}}function Yh(i,t,e){const n=i.config.links,s=i.playerLink,a=i.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!n.enabled||!i.modules.links){s.phase!=="idle"&&Ea(i);return}const r=i.combat,o=i.character.sprinting;o&&n.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&n.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,n.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&Vr(i,"sprint"),s.prevSprinting=o,$h(i,t);const c=n.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&i.dash.phase==="idle"&&!!c&&c.enabled&&Wh(i,e,c,r.weapon)}const Xr=1e-6;function Kn(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function id(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function sd(i){const t=i.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=id()}function Zh(i){return{weapon:yi[Math.max(0,i-1)]??yi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:id()}}function qh(i,t){return Ua(i,t)}function jh(i,t){const e=i.config.targeting;if(!e.targetAssist||!i.modules.targeting||!i.targeting.hasTarget)return t;const n=i.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*i.config.combat.minLungeScale;return Math.min(Math.max(n,0)+a,s)}function ad(i,t,e,n){const s=i.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=n,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=qh(i,t),s.attackProgress=0,s.timings=e,s.attackId+=1,Kn(i,"attack-start",n)}function rd(i){return Math.max(0,i.config.combat.settle)}function Wr(i,t,e){const n=i.config.combat.weapons[i.combat.weapon];ad(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:rd(i),lunge:jh(i,n.lunge[e-1]??0)},e)}function Kh(i,t,e){const n=i.config.combat.bow.release;i.combat.lastCharge=e,ad(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:rd(i),lunge:n.lunge},0),Kn(i,"charge-release",e)}function Jh(i,t,e){const n=i.combat;if(n.phase==="idle")return;const s=n.timings;n.phaseTimer+=t;let a=0;for(;n.phase!=="idle"&&a++<8;){const c=n.phase==="windup"?s.windup:n.phase==="active"?s.active:n.phase==="recovery"?s.recovery:s.settle;if(n.phaseTimer<c)break;if(n.phaseTimer-=c,n.phase==="windup")n.phase="active",Kn(i,"attack-active",n.comboIndex);else if(n.phase==="active")n.phase="recovery";else if(n.phase==="recovery")n.phase="settle",Kn(i,"attack-end",n.comboIndex);else if(n.phase="idle",n.phaseTimer=0,n.comboWindow=i.config.combat.comboWindow,n.queued){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Wr(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}if(n.queued&&n.phase==="recovery"){const c=n.timings.recovery;if(c>Xr&&n.phaseTimer>=c*i.config.combat.cancelWindow){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Wr(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;n.phase==="windup"?o=n.phaseTimer:n.phase==="active"?o=s.windup+n.phaseTimer:n.phase==="recovery"?o=s.windup+s.active+n.phaseTimer:n.phase==="settle"&&(o=r),n.phase!=="idle"&&(n.attackProgress=r>0?Math.min(1,o/r):1)}function Qh(i,t,e){const n=i.combat,s=i.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=yi.length){const c=yi[e.weaponSlot-1];c!==n.weapon&&(n.weapon=c,sd(i),Ea(i),Kn(i,"weapon-change",e.weaponSlot))}n.phase==="idle"&&n.comboWindow>0&&(n.comboWindow=Math.max(0,n.comboWindow-t),n.comboWindow===0&&n.comboIndex>0&&(n.comboIndex=0,Kn(i,"combo-reset",0))),Jh(i,t,e);const a=s.weapons[n.weapon],r=i.dash.phase==="active";if(a.comboCount>0){const c=i.playerLink.phase!=="idle"||i.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(n.phase==="idle"){const h=n.comboWindow>0&&n.comboIndex<a.comboCount?n.comboIndex+1:1;Wr(i,e,h)}else n.queued=!0}else if(n.weapon!=="staff"){if(n.weapon==="bow"&&(!r&&!i.playerLink.consumedAttack&&e.attackPressed&&n.phase==="idle"&&!n.charging&&(n.charging=!0,n.charge=0,Kn(i,"charge-start",0)),n.charging&&e.attackHeld&&(n.charge=Math.min(1,n.charge+t/Math.max(s.bow.maxChargeTime,Xr))),n.charging&&!r&&(e.attackReleased||!e.attackHeld))){n.charging=!1;const c=n.charge;n.charge=0,c>=s.bow.minChargeToFire&&n.phase==="idle"?Kh(i,e,c):Kn(i,"charge-release",0)}}if(!(i.playerLink.phase==="active")&&(i.impulse.x=0,i.impulse.z=0,n.phase==="active"&&n.timings.active>Xr)){const c=n.timings.lunge/n.timings.active;i.impulse.x=Math.sin(n.attackFacing)*c,i.impulse.z=Math.cos(n.attackFacing)*c}}const $r=1e-6;function Za(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function tu(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function eu(i){const t=i.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=i.character.position.x,t.fromZ=i.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Ac(i,t,e){return i<t?t:i>e?e:i}function nu(i,t,e){const n=i.config.dash,a=i.character.position,r=i.config.worldBounds,o=Math.max(.05,n.blinkStep),c=Math.max(0,n.blinkDistance);let l=0,h=a.x,p=a.z;for(;l<c-$r;){const u=Math.min(c,l+o),d=a.x+t*u,m=a.z+e*u,_=Ac(d,r.minX,r.maxX),g=Ac(m,r.minZ,r.maxZ),f={x:_,y:a.y,z:g};if($o(i.boxes,f,i.config.characterRadius,i.config.characterHeight,i.config.stepHeight)||(h=_,p=g,l=u,_!==d||g!==m))break}return{x:h,z:p}}function iu(i,t,e){const n=i.dash,s=i.config.dash;if(n.phase==="active"&&n.timer<=0&&(n.phase="idle",n.timer=0,Vr(i,"roll")),n.cooldown>0){const o=n.cooldown;n.cooldown=Math.max(0,n.cooldown-t),o>0&&n.cooldown===0&&Za(i,"dash-ready",0)}const a=i.combat;if(e.sprintPressed&&n.cooldown<=0&&n.phase==="idle"&&a.phase==="idle"&&!a.charging&&i.playerLink.phase==="idle"){const o=bh(i,e),c=o.x,l=o.z,h=i.combat.weapon==="staff";if(n.kind=h?"blink":"roll",n.dirX=c,n.dirZ=l,n.fromX=i.character.position.x,n.fromZ=i.character.position.z,n.id+=1,n.cooldown=h?s.blinkCooldown:s.rollCooldown,h){const p=nu(i,c,l);i.character.position.x=p.x,i.character.position.z=p.z,n.toX=p.x,n.toZ=p.z,n.duration=0,n.timer=0,n.phase="idle",s.blinkClearVelocity&&(i.character.velocity.x=0,i.character.velocity.z=0),Vr(i,"blink"),Za(i,"blink",n.id)}else n.phase="active",n.duration=Math.max($r,s.rollDuration),n.timer=n.duration,n.toX=n.fromX+c*s.rollDistance,n.toZ=n.fromZ+l*s.rollDistance,Za(i,"roll",n.id)}if(n.phase==="active"&&n.kind==="roll"){const o=Math.max($r,n.timer),c=i.character.position.x,l=i.character.position.z;i.impulse.x=(n.toX-c)/o,i.impulse.z=(n.toZ-l)/o}n.phase==="active"&&(n.timer=Math.max(0,n.timer-t))}const cn=1e-6,Yr=Math.PI*2,su=7,au=18;function Rc(i,t,e){return i<t?t:i>e?e:i}function ru(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Cc(i,t,e,n){return i+ru(t-i)*(1-Math.exp(-Math.max(e,cn)*n))}function Zo(i,t,e){i.events.push({type:t,tick:i.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function ou(i){const t=[];for(let e=0;e<i.count;e++){const n=i.spawn[e]??{x:0,z:0},s=i.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:n.x,homeZ:n.z,position:{x:n.x,y:0,z:n.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:n.x,targetZ:n.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:td(),link:Fa()})}return t}function cu(i){const t=Wa.indexOf(i);return Wa[(t+1)%Wa.length]}function lu(i){const t=i.config.dummies;for(let e=0;e<i.dummies.length;e++){const n=i.dummies[e],s=t.spawn[e]??{x:n.homeX,z:n.homeZ},a=t.initialModes[e]??n.initialMode;n.mode=a,n.initialMode=a,n.homeX=s.x,n.homeZ=s.z,n.position.x=s.x,n.position.y=0,n.position.z=s.z,n.velocity.x=0,n.velocity.y=0,n.velocity.z=0,n.facing=0,n.bodyYaw=0,n.headYaw=0,n.gaitPhase=0,n.stride=1,n.distance=0,n.targetX=s.x,n.targetZ=s.z,n.wanderTimer=0,n.attackCooldown=0,n.attackPhase="idle",n.attackPhaseTimer=0,n.attackProgress=0;const r=n.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,Hh(n.link)}i.dummyAttackCount=0}function du(i,t,e){const n=$a(i)*Yr,s=Math.sqrt($a(i))*e.wanderRadius;t.targetX=t.homeX+Math.cos(n)*s,t.targetZ=t.homeZ+Math.sin(n)*s,t.wanderTimer=e.wanderInterval*(.6+$a(i)*.8)}function hu(i,t){return i.attackPhase==="windup"?t.attackWindup:i.attackPhase==="active"?t.attackActive:i.attackPhase==="recovery"?t.attackRecovery:0}function uu(i,t,e,n){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(hu(t,n),cn);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",Zo(i,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=n.attackWindup+n.attackActive+n.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=n.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=n.attackWindup+n.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function fu(i,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const n=i.character.position,s=n.x-t.position.x,a=n.z-t.position.z,r=Math.hypot(s,a),o=r>cn?s/r:0,c=r>cn?a/r:0;let l=0,h=0;if(t.mode==="wander"){const u=t.targetX-t.position.x,d=t.targetZ-t.position.z,m=Math.hypot(u,d);(t.wanderTimer<=0||m<.3)&&du(i,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,f=Math.hypot(_,g);f>cn&&(l=_/f,h=g/f)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,h=c);else if(t.mode==="keep-distance"){const u=r-e.keepDistance;u>e.keepDeadZone?(l=o,h=c):u<-e.keepDeadZone?(l=-o,h=-c):(l=-c*e.keepStrafe,h=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,h=c);let p=t.facing;return t.mode==="wander"?Math.hypot(l,h)>cn&&(p=Math.atan2(l,h)):r>cn&&(p=Math.atan2(o,c)),{x:l,z:h,facing:p}}function pu(i,t,e,n){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const g=i.character.position;Math.hypot(g.x-e.position.x,g.z-e.position.z)<=n.attackRange+cn&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=n.attackInterval,i.dummyAttackCount+=1,Zo(i,"dummy-attack",e))}uu(i,e,t,n);const s=fu(i,e,n),a=1-Math.exp(-Math.max(n.acceleration,cn)*t);e.velocity.x+=(s.x*n.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*n.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=Cc(e.bodyYaw,e.facing,su,t),e.headYaw=Cc(e.headYaw,e.facing,au,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=i.config.stepHeight;Wo(i.boxes,e.position,n.radius,n.height,c)&&$o(i.boxes,e.position,n.radius,n.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const h=i.config.worldBounds;e.position.x=Rc(e.position.x,h.minX,h.maxX),e.position.z=Rc(e.position.z,h.minZ,h.maxZ);const p=zr(i.boxes,e.position.x,e.position.z,e.position.y,n.radius,c,Number.POSITIVE_INFINITY);p>Number.NEGATIVE_INFINITY&&p<=e.position.y+c+cn&&(e.position.y=p);const u=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=u;const d=Math.hypot(e.velocity.x,e.velocity.z),m=Math.min(i.config.strideSpeedCap,d/Math.max(i.config.moveSpeed,cn)),_=Math.max(i.config.strideLength*(1+m*i.config.strideSpeedGain),cn);e.stride=_,e.gaitPhase=(e.gaitPhase+u/_*Yr)%Yr}function mu(i,t,e){const n=i.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=i.dummies.length){const s=i.dummies[e.dummyClickId-1];s.mode=cu(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,Zo(i,"dummy-mode",s)}for(const s of i.dummies)pu(i,t,s,n)}const Ri=1e-6,Pc=Math.PI*2;function qa(i,t){return Math.sqrt(i*i+t*t)}function Is(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function gu(i){const t=i.character,e=i.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=i.config.strideLength,t.distance=0,t.coyoteTime=i.config.coyoteTime,t.jumpBuffer=0,sd(i)}function _u(i,t,e){const n=i.config,s=i.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=qa(o,c);l>1&&(o/=l,c/=l);const h=i.combat.phase!=="idle",p=i.playerLink.phase!=="idle",u=h||i.dash.phase==="active"||p;s.sprinting=!u&&e.sprintHeld&&l>Ri;const d=n.combat.weapons[i.combat.weapon];let m=d?d.moveMultiplier:1;u?m*=i.combat.phase==="settle"?n.combat.settleMoveScale:n.combat.attackMoveScale:i.combat.charging?m*=n.combat.bow.chargeMoveMultiplier:i.abilities.channeling&&(m*=n.abilities.arcane.moveScale);const _=n.moveSpeed*(s.sprinting?n.sprintMultiplier:1)*m;if(u)r.x=o*_,r.z=c*_;else{const N=l>Ri?n.acceleration:n.friction,F=1-Math.exp(-N*t);r.x+=(o*_-r.x)*F,r.z+=(c*_-r.z)*F}e.jumpPressed?s.jumpBuffer=n.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?n.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=n.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,Is(i,"jumped",n.jumpSpeed)),i.events.some(N=>N.type==="blink"&&N.tick===i.tick)&&(r.x=0,r.z=0,i.impulse.x=0,i.impulse.z=0);const f=a.x,x=a.z;if(a.x+=(r.x+i.impulse.x+i.playerHurt.knockX)*t,a.z+=(r.z+i.impulse.z+i.playerHurt.knockZ)*t,Wo(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight)){if($o(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight))a.x=f,a.z=x,r.x=0,r.z=0;else{const N=a.x-f,F=a.z-x;Math.abs(N)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(F)<Math.abs(r.z*t)*.5&&(r.z=0)}Is(i,"blocked",1)}const v=n.worldBounds;a.x=Dc(a.x,v.minX,v.maxX),a.z=Dc(a.z,v.minZ,v.maxZ);const L=zr(i.boxes,a.x,a.z,a.y,n.characterRadius,n.stepHeight,n.fallTolerance);s.grounded&&L>a.y+Ri&&L-a.y<=n.stepHeight+Ri&&(a.y=L,r.y=0,Is(i,"stepUp",L));const w=a.y;r.y-=n.gravity*t,a.y+=r.y*t;const A=zr(i.boxes,a.x,a.z,w,n.characterRadius,n.stepHeight,Number.POSITIVE_INFINITY);A>Number.NEGATIVE_INFINITY&&a.y<=A&&r.y<=0?(a.y=A,r.y=0,s.grounded||Is(i,"landed",A),s.grounded=!0):s.grounded=!1;const D=qa(a.x-f,a.z-x);s.distance+=D;const E=qa(r.x,r.z),S=Math.min(n.strideSpeedCap,E/Math.max(n.moveSpeed,Ri)),C=Math.max(n.strideLength*(1+S*n.strideSpeedGain),Ri);s.stride=C,s.gaitPhase=(s.gaitPhase+D/C*Pc)%Pc}function Dc(i,t,e){return i<t?t:i>e?e:i}const Zr=1e-6,Lc=2.399963229728653;function mi(i,t,e){return i<t?t:i>e?e:i}function Ic(i,t,e,n,s,a,r,o,c){const l=t.x-i.x,h=t.z-i.z,p=Math.hypot(l,h),u=e+n;if(p>=u)return;let d,m,_;p<Zr?(d=o,m=c,_=u):(d=l/p,m=h/p,_=u-p);const g=_+r;i.x-=d*g*s,i.z-=m*g*s,t.x+=d*g*a,t.z+=m*g*a}function xu(i){const t=i.config.separation,e=i.dummies,n=i.character.position,s=i.config.characterRadius,a=i.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let h=0;h<r;h++){for(let p=0;p<e.length;p++)for(let u=p+1;u<e.length;u++){const d=(p*3+u)*Lc;Ic(e[p].position,e[u].position,a,a,.5,.5,o,Math.cos(d),Math.sin(d))}for(let p=0;p<e.length;p++){const u=(p+1)*Lc;Ic(n,e[p].position,s,a,0,1,o,Math.cos(u),Math.sin(u))}}const c=i.config.stepHeight,l=i.config.worldBounds;for(const h of e)Wo(i.boxes,h.position,a,i.config.dummies.height,c),h.position.x=mi(h.position.x,l.minX,l.maxX),h.position.z=mi(h.position.z,l.minZ,l.maxZ)}function vu(i,t,e,n,s,a,r,o){const c=Math.hypot(e,n),l=Math.max(0,o.contactBand),h=mi(o.minScale,0,1);if(c<Zr||l<=0||h>=1)return 1;const p=s+r,u=mi(o.approachDot,0,.99);let d=0;for(const m of a){const _=m.position.x-i,g=m.position.z-t,f=Math.hypot(_,g);if(f>=p+l)continue;if(f<Zr){d=1;continue}const x=(e*_+n*g)/(c*f);if(x<=u)continue;const M=mi(1-(f-p)/l,0,1),v=mi((x-u)/(1-u),0,1);d=Math.max(d,M*v)}return 1-(1-h)*mi(d,0,1)}function Mu(i){const t=i.config.separation.crowd;if(!t)return;const e=i.character,n=vu(e.position.x,e.position.z,e.velocity.x,e.velocity.z,i.config.characterRadius,i.dummies,i.config.dummies.radius,t);n>=1||(e.velocity.x*=n,e.velocity.z*=n)}const kc=1e-6,yu=Math.PI/180;function Su(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function bu(i,t,e){return i<t?t:i>e?e:i}function Eu(i,t,e){const n=i.config.targeting,s=i.targeting,a=i.character.position;let r=i.character.facing;Math.hypot(e.moveX,e.moveZ)>kc&&(r=Math.atan2(e.moveX,e.moveZ));const c=bu(n.maxAngleDeg,0,180)*yu;let l=Number.POSITIVE_INFINITY,h=0,p=0,u=0;for(const d of i.dummies){const m=d.position.x-a.x,_=d.position.z-a.z,g=Math.hypot(m,_);if(g<kc||g>n.range)continue;const f=Math.atan2(m,_),x=Math.abs(Rn(f-r));if(x>c)continue;const M=g-n.frontBias*Math.cos(x);M<l&&(l=M,h=d.id,p=f,u=g)}s.targetId=h,s.targetYaw=p,s.targetDist=u,s.hasTarget=h>0}function wu(i,t){return{tick:0,time:0,rngState:2654435769,config:i,boxes:zh(t),gridMeta:t.grid,character:{position:{x:i.spawn.x,y:i.spawn.y,z:i.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:i.strideLength,distance:0,coyoteTime:i.coyoteTime,jumpBuffer:0},combat:Zh(1),playerLink:Fa(),abilities:Ch(),impulse:{x:0,z:0},targeting:Su(),playerHurt:td(),hitCount:0,dash:{...tu(),fromX:i.spawn.x,fromZ:i.spawn.z,toX:i.spawn.x,toZ:i.spawn.z},camera:{...ed(),centroidX:i.spawn.x,centroidZ:i.spawn.z},dummies:ou(i.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,dummies:!0}}}function Tu(i){gu(i),lu(i),Gh(i);const t=i.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=i.playerHurt;e.type="none",e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,i.hitCount=0,Ph(i),eu(i),nd(i),i.events.length=0}function Uc(i,t,e){if(i.events.length=0,i.tick+=1,i.time+=t,i.impulse.x=0,i.impulse.z=0,e.resetPressed){Tu(i);const n=i.config.spawn;return i.events.push({type:"reset",tick:i.tick,x:n.x,y:n.y,z:n.z,value:0}),i}return i.modules.dummies&&i.modules.targeting?Eu(i,t,e):(i.targeting.targetId=0,i.targeting.targetYaw=0,i.targeting.targetDist=0,i.targeting.hasTarget=!1),Yh(i,t,e),i.modules.combat&&Qh(i,t,e),i.modules.dash&&iu(i,t,e),i.modules.movement&&_u(i,t,e),i.modules.orientation&&Oh(i,t,e),i.modules.dummies&&mu(i,t,e),Eh(i,t),Vh(i,t),i.modules.abilities&&Fh(i,t,e),i.modules.dummies&&(Rh(i,t),i.modules.separation&&(xu(i),Mu(i))),i.modules.camera?Nh(i):nd(i),i}function Au(i){let t=0;return{frame(e,n,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=i.config.fixedDt,c=i.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const h=l===0?n:{...n,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Uc(i,o,h),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){Uc(i,i.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const od={slopPx:12,longPressMs:450,doubleTapMs:280};function Ru(i,t,e=od.slopPx){if(i.distance<e)return{...i,worldX:0,worldZ:0};const n=i.dx/i.distance,s=i.dy/i.distance,a=t.rightX*n+t.forwardX*-s,r=t.rightZ*n+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...i,worldX:0,worldZ:0}:{...i,worldX:a/o,worldZ:r/o}}function ai(i,t,e,n,s,a){const r=Math.hypot(e,n);return{button:i,kind:t,dx:e,dy:n,distance:r,angleDeg:r>.001?Math.atan2(n,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function Cu(i=od){const t=new Map,e=new Map,n=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),ai(s,"press",0,0,0,1)},move(s,a,r,o){const c=n(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY;return!c.dragging&&Math.hypot(l,h)>=i.slopPx?(c.dragging=!0,ai(c.button,"drag",l,h,o-c.startedAt,1)):null},end(s,a,r,o){const c=n(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY,p=o-c.startedAt,u=Math.hypot(l,h);if(c.dragging||c.longFired||u>=i.slopPx)return ai(c.button,"release",l,h,p,1);const d=e.get(c.button);return d!==void 0&&o-d.at<=i.doubleTapMs&&Math.hypot(a-d.x,r-d.y)<=i.slopPx*2?(e.delete(c.button),ai(c.button,"doubleTap",l,h,p,2)):(e.set(c.button,{at:o,x:a,y:r}),ai(c.button,"tap",l,h,p,1))},cancel(s,a){const r=n(s);return r?(t.delete(s),ai(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=i.longPressMs)return a.longFired=!0,ai(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const ja=.001,Pu=18;function qr(i,t,e){return i<t?t:i>e?e:i}function jr(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Du(i){const t=i.length;if(t<2)return null;const e=i[t-2],n=i[t-1];return e.id===n.id?null:[e,n]}function Lu(i,t,e,n,s=Pu){const a=Du(t);if(!a)return{state:jr(),scale:1,started:!1,ended:i.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(n)?n:1.25),l=1/c,h=c;if(!Number.isFinite(r)||r<ja)return{state:{active:!0,lastDist:0,armDist:0,armed:i.armed},scale:1,started:!i.active,ended:!1,armedNow:!1,pinching:i.armed};if(!i.active){const m=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!i.armed)return i.armDist<ja?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-i.armDist)<o?{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(i.lastDist<ja)return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const p=r/i.lastDist,u=Math.max(0,Number.isFinite(e)?e:1),d=Number.isFinite(p)&&p>0?Math.pow(p,u):1;return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:qr(Number.isFinite(d)?d:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Iu(i,t,e,n){const s=Math.min(e,n),a=Math.max(e,n),r=Number.isFinite(t)&&t>0?t:1,o=i*r;return Number.isFinite(o)?qr(o,s,a):qr(i,s,a)}function ku(i,t){const e=Number.isFinite(t)&&t>0?t:1,n=Number.isFinite(i)?i:0;return Math.pow(e,n/100)}function Uu(){const i=typeof window<"u"?window.visualViewport:null;return i?{left:i.offsetLeft,top:i.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Ka=["jump","sprint","reset","attack","skill2"],Fu=8,Nu=26,Ja=16,Fc=20,Nc=140,zu=18,Ou=16,Bu=400,Hu=1.0001;function ua(i){return i instanceof Element&&i.closest("[data-ui-button], [data-ui-region], #debug-panel, #hud, #weapon-bar, #hint")!==null}function Gu(i,t){if(!Number.isFinite(i)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(i,t);return e instanceof Element&&ua(e)}function Vu(i){const{maxRadiusPx:t,deadZone:e,getBasis:n,zoom:s}=i,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,h=0,p=0,u=0,d=-1,m=0,_=null,g=-1,f=0,x=0,M=0,v=0,L=!1,w=0,A=1,D=0,E=null,S=0,C=0,N=!1,F=null,G=null,P=0,R=0,$=0,z=0,V=!1,J=!0,pt=-1;const ct=Cu({slopPx:Fc,longPressMs:450,doubleTapMs:350});let lt=[],q=null;const Q=new Set;function ht(O){O&&lt.push(O)}const it=new Map;let vt=jr(),Et=!1,Dt=1;function Ht(){const O=Array.from(it.values()),ot=s(),dt=Lu(vt,O,ot.pinchGain,ot.maxStepRatio,zu);if(vt=dt.state,Et=dt.pinching,dt.scale!==1&&(Dt*=dt.scale),dt.started||dt.armedNow)E=null,N=!0,F=null;else if(dt.ended&&r===null&&O.length===1){const Ut=O[0];r=Ut.id,o=Ut.x,c=Ut.y,l=0,h=0,p=Ut.x,u=Ut.y,L=!1,w=0,A=1,D=0,performance.now(),E=null,N=!0,F=null}}const Ct={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Lt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let U=0,Yt=0;const Pt={},It=new Set,Z=[];function ut(){for(const O of Ka)Pt[O]!==void 0&&(Pt[O]=void 0),B(O);ct.reset(),Q.clear(),it.clear(),vt=jr(),Et=!1,r=null,l=0,h=0,p=0,u=0,L=!1,w=0,A=1,D=0,f=0,x=0,M=0,v=0,_=null,g=-1,E=null,N=!1,F=null,G=null,pt=-1,$=0,z=0,V=!1,J=!0}const mt=()=>{document.hidden&&ut()},T=O=>{if(O.clientX===0&&O.clientY===0){m++;return}if(ua(O.target)||Gu(O.clientX,O.clientY)){Q.add(O.pointerId);return}if(Q.delete(O.pointerId),it.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),r===null&&!Et){_=null,g=-1,r=O.pointerId,o=O.clientX,c=O.clientY,l=0,h=0,p=O.clientX,u=O.clientY,performance.now();const ot=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY)&&(O.screenX!==0||O.screenY!==0);L=ot,w=0,A=1,D=0,f=ot?O.screenX:0,x=ot?O.screenY:0,M=f,v=x,E=O.pointerId,S=O.clientX,C=O.clientY,N=!1}Ht()},y=O=>{if(O.pointerId===G&&(O.pointerType==="mouse"&&O.buttons===0||O.clientX===0&&O.clientY===0&&(P!==0||R!==0)||(J?($=O.clientX-P,z=O.clientY-R):(P=O.clientX,R=O.clientY,J=!0,$=0,z=0))),ht(ct.move(O.pointerId,O.clientX,O.clientY,performance.now())),!Q.has(O.pointerId)&&it.has(O.pointerId)&&(it.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),Ht()),Q.has(O.pointerId)||O.pointerId!==r)return;const ot=performance.now();if(_===O.pointerId&&ot-g<150){m++;return}const dt=O.clientX,Ut=O.clientY;if(dt===0&&Ut===0&&(o!==0||c!==0)){m++;return}const Gt=dt-p,I=Ut-u,yt=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY),j=yt?O.screenX:0,at=yt?O.screenY:0,St=yt&&(j!==0||at!==0),xt=j-M,Bt=at-v;if(L&&St){const me=Math.hypot(xt,Bt),ge=Math.hypot(Gt,I);if(me>3){if(w=0,D<30&&ge>6&&xt*Gt+Bt*I>.7*me*ge){const Fe=me/ge;Fe>.2&&Fe<5&&(A+=(Fe-A)*.3,D++)}}else ge>12&&(w++,w>=2&&(L=!1))}const ee=Math.hypot(Gt,I);if(!L){const me=d<0?Number.POSITIVE_INFINITY:ot-d,ge=St?Math.hypot(xt,Bt):1/0;ee>28&&(me<200||ge<ee*.4)&&(o+=Gt,c+=I,m++)}p=dt,u=Ut,M=j,v=at,O.pointerId===E&&Math.hypot(O.clientX-S,O.clientY-C)>Fu&&(N=!0);let se,Wt;L&&St?(se=(j-f)/A,Wt=(at-x)/A):(se=dt-o,Wt=Ut-c);const pe=Math.hypot(se,Wt),Se=a();pe>Se&&(se*=Se/pe,Wt*=Se/pe);const en=Math.hypot(l,h),Ke=Math.hypot(se,Wt);if(en>10&&Ke>10){const me=Math.abs(Math.atan2(l*Wt-h*se,l*se+h*Wt)),ge=Math.max(en,Ke)*me,Fe=Math.max(Math.hypot(Gt,I),Math.hypot(xt,Bt)/Math.max(.2,A));if(me>.6&&Fe<Math.max(6,ge*.5)){m++;return}}l=se,h=Wt};function B(O){if(!Ct[O])return;Ct[O]=!1,O==="attack"&&(Lt.attackReleased=!0);const ot=document.getElementById(`btn-${O}`);ot==null||ot.classList.remove("is-down")}function tt(){r!==null&&(_=r,g=performance.now(),r=null,l=0,h=0,p=0,u=0,L=!1,w=0,A=1,D=0,f=0,x=0,M=0,v=0)}const st=O=>{const ot=it.delete(O.pointerId),dt=Q.delete(O.pointerId);ot&&Ht(),O.pointerId===G&&(G=null,V?pt=performance.now():($=0,z=0,pt=-1)),ht(ct.end(O.pointerId,O.clientX,O.clientY,performance.now()));for(const Ft of Ka)Pt[Ft]===O.pointerId&&(Pt[Ft]=void 0,B(Ft));const Ut=!ot&&!dt&&it.size<=1&&r!==null;(O.pointerId===r||it.size===0||Ut)&&tt(),!dt&&O.pointerId===E&&(!N&&!ua(O.target)&&(F={x:O.clientX,y:O.clientY}),E=null)};for(const O of Ka){const ot=document.getElementById(`btn-${O}`);if(!ot)continue;const dt=O==="attack"||O==="skill2",Ut=I=>{if(I.preventDefault(),Pt[O]===void 0){Pt[O]=I.pointerId,Ct[O]=!0,O==="jump"&&(Lt.jump=!0),O==="reset"&&(Lt.reset=!0),O==="sprint"&&(Lt.sprintPressed=!0),O==="attack"&&(Lt.attackPressed=!0),O==="skill2"&&(Lt.skill2=!0),ot.classList.add("is-down"),ht(ct.begin(O,I.pointerId,I.clientX,I.clientY,performance.now()));try{ot.setPointerCapture(I.pointerId)}catch{}dt&&(G=I.pointerId,P=I.clientX,R=I.clientY,J=!(I.clientX===0&&I.clientY===0),$=0,z=0,V=!1,pt=-1)}},Ft=I=>{Pt[O]===I.pointerId&&(Pt[O]=void 0,B(O),ht(ct.end(I.pointerId,I.clientX,I.clientY,performance.now())))},Gt=I=>{Pt[O]===I.pointerId&&(Pt[O]=void 0,B(O),ht(ct.cancel(I.pointerId,performance.now())))};ot.addEventListener("pointerdown",Ut),ot.addEventListener("pointerup",Ft),ot.addEventListener("pointercancel",Gt),Z.push(()=>{ot.removeEventListener("pointerdown",Ut),ot.removeEventListener("pointerup",Ft),ot.removeEventListener("pointercancel",Gt)})}const nt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const O of nt){const ot=dt=>{dt.preventDefault(),U=Number(O.dataset.weapon)||0};O.addEventListener("pointerdown",ot),Z.push(()=>O.removeEventListener("pointerdown",ot))}const X=O=>{const ot=O.key.toLowerCase();if((ot===" "||ot.startsWith("arrow"))&&O.preventDefault(),It.has(ot))return;It.add(ot),ot===" "&&(Lt.jump=!0),ot==="r"&&(Lt.reset=!0),ot==="shift"&&(Lt.sprintPressed=!0),ot==="j"&&(Lt.attackPressed=!0),ot==="k"&&(Lt.skill2=!0),ot>="1"&&ot<="5"&&(U=Number(ot)),ot>="6"&&ot<="9"&&(Yt=Number(ot)-5);const dt=Math.max(Hu,s().keyStep||1.12);(ot==="="||ot==="+")&&(Dt*=dt),(ot==="-"||ot==="_")&&(Dt/=dt)},rt=O=>{const ot=O.key.toLowerCase();It.has(ot)&&(It.delete(ot),ot==="j"&&(Lt.attackReleased=!0))},_t=O=>{if(ua(O.target))return;O.preventDefault();const ot=O.deltaMode===1?O.deltaY*Ou:O.deltaMode===2?O.deltaY*Bu:O.deltaY;Dt*=ku(ot,s().wheelStep)},Tt=O=>{O.preventDefault()},ft=()=>{d=performance.now()};window.addEventListener("resize",ft),window.addEventListener("orientationchange",ft);const gt=typeof window<"u"?window.visualViewport:null;return gt&&(gt.addEventListener("resize",ft),gt.addEventListener("scroll",ft)),window.addEventListener("pointerdown",T),window.addEventListener("pointermove",y),window.addEventListener("pointerup",st),window.addEventListener("pointercancel",st),window.addEventListener("blur",ut),document.addEventListener("visibilitychange",mt),window.addEventListener("keydown",X),window.addEventListener("keyup",rt),window.addEventListener("wheel",_t,{passive:!1}),window.addEventListener("gesturestart",Tt),{peekStick(){return{id:r,held:r!==null,originX:o,originY:c,x:p,y:u,dx:p-o,dy:u-c,radius:a(),badMoves:m,screenOk:L,originSX:f,originSY:x,screenX:M,screenY:v,scale:A}},peekAim(){const O=performance.now(),ot=Math.hypot($,z),dt=G!==null||pt>=0&&O-pt<Nc;if(!(dt&&V&&ot>=Ja))return{active:!1,holding:dt,x:0,z:0,dx:$,dy:z};const Ft=n(),Gt=$/ot,I=z/ot,yt=Ft.rightX*Gt+Ft.forwardX*-I,j=Ft.rightZ*Gt+Ft.forwardZ*-I,at=Math.hypot(yt,j)||1;return{active:!0,holding:dt,x:yt/at,z:j/at,dx:$,dy:z}},sample(){var he;const O=a();let ot=r!==null?Math.max(-1,Math.min(1,l/O)):0,dt=r!==null?Math.max(-1,Math.min(1,h/O)):0,Ut=0,Ft=0;(It.has("a")||It.has("arrowleft"))&&(Ut-=1),(It.has("d")||It.has("arrowright"))&&(Ut+=1),(It.has("w")||It.has("arrowup"))&&(Ft-=1),(It.has("s")||It.has("arrowdown"))&&(Ft+=1),ot+=Ut,dt+=Ft;let Gt=Math.hypot(ot,dt);Gt>1&&(ot/=Gt,dt/=Gt,Gt=1);const I=ot,yt=dt;Gt<e&&(ot=0,dt=0);const j=n();let at=j.rightX*ot+j.forwardX*-dt,St=j.rightZ*ot+j.forwardZ*-dt;const xt=Math.hypot(at,St);xt>1&&(at/=xt,St/=xt);const Bt=performance.now();ht(ct.poll(Bt));const ee=Math.hypot($,z);G!==null&&(ee>=Nu?V=!0:ee<Ja&&(V=!1));const se=G!==null||pt>=0&&Bt-pt<Nc,Wt=se&&V&&ee>=Ja;let pe=0,Se=0;if(Wt){const et=$/ee,bt=z/ee,wt=j.rightX*et+j.forwardX*-bt,Vt=j.rightZ*et+j.forwardZ*-bt,qt=Math.hypot(wt,Vt)||1;pe=wt/qt,Se=Vt/qt}!se&&G===null&&($=0,z=0,pt=-1,V=!1);const en=F;F=null;const Ke=Dt;Dt=1;const me={moveX:at,moveZ:St,jumpPressed:Lt.jump,sprintHeld:Ct.sprint||It.has("shift"),sprintPressed:Lt.sprintPressed,resetPressed:Lt.reset,attackPressed:Lt.attackPressed,attackHeld:Ct.attack||It.has("j"),attackReleased:Lt.attackReleased,skill2Pressed:Lt.skill2,weaponSlot:U,dummyClickId:Yt,aimX:pe,aimZ:Se,aimActive:Wt};Lt.jump=!1,Lt.reset=!1,Lt.sprintPressed=!1,Lt.attackPressed=!1,Lt.attackReleased=!1,Lt.skill2=!1,U=0,Yt=0;const ge=lt.map(et=>Ru(et,j,Fc));lt=[],ge.length>0&&(q=ge[ge.length-1]);const Fe=r!==null?"pointer":It.size>0?"keyboard":"idle";return{intents:me,stickX:ot,stickY:dt,stickRawX:I,stickRawY:yt,stickHeld:r!==null,stickId:r,stickOriginX:o,stickOriginY:c,stickPxX:p,stickPxY:u,stickBad:m,stickScreenOk:L,stickOriginSX:f,stickOriginSY:x,stickScreenX:M,stickScreenY:v,stickScale:A,stickVpTop:((he=Uu())==null?void 0:he.top)??0,stickVpAge:d<0?-1:Math.round(performance.now()-d),aimDX:$,aimDY:z,source:Fe,tap:en,zoomScale:Ke,gestures:ge,lastGesture:q}},dispose(){window.removeEventListener("pointerdown",T),window.removeEventListener("pointermove",y),window.removeEventListener("pointerup",st),window.removeEventListener("pointercancel",st),window.removeEventListener("blur",ut),document.removeEventListener("visibilitychange",mt),window.removeEventListener("keydown",X),window.removeEventListener("keyup",rt),window.removeEventListener("wheel",_t),window.removeEventListener("resize",ft),window.removeEventListener("orientationchange",ft),gt&&(gt.removeEventListener("resize",ft),gt.removeEventListener("scroll",ft)),window.removeEventListener("gesturestart",Tt),ct.reset();for(const O of Z)O()}}}const wa=1,Ta=2,Aa=4,cd=8,Ra=16,ys=32,ld=64,dd=128,Xu=[[wa,"atk"],[Ta,"dash"],[Aa,"link"],[cd,"air"],[Ra,"hurt"],[ys,"aim"],[ld,"spr"],[dd,"chan"]];function Ci(i){if(i===0)return"-";const t=Xu.filter(([e])=>(i&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Wu=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],$u=0,Yu=15,Qa=19,Zu=21,qu=22,ju=23,Ku=24,yn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Ye=i=>Number.isFinite(i)?Math.round(i*1e3)/1e3:0,ln=i=>Math.round(i*180/Math.PI*10)/10,tr=Math.PI*2;function ls(i){let t=i%tr;return t>Math.PI&&(t-=tr),t<-Math.PI&&(t+=tr),t}function Ju(i,t){let e=0;return i.combat.phase!=="idle"&&(e|=wa),i.dash.phase!=="idle"&&(e|=Ta),i.playerLink.phase!=="idle"&&(e|=Aa),i.character.grounded||(e|=cd),i.playerHurt.type!=="none"&&(e|=Ra),t.intents.aimActive&&(e|=ys),i.character.sprinting&&(e|=ld),i.abilities.channeling&&(e|=dd),e}function Qu(i){const t=`(${i.x.toFixed(1)},${i.z.toFixed(1)})`;switch(i.type){case"attack-start":return`slot${i.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${i.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${i.value} ${t}`;case"weapon-change":return`slot${i.value}`;case"dummy-mode":return`dummy${i.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return i.value!==0?`v${i.value}`:""}}function tf(i){const t={sampleHz:i.sampleHz??yn.sampleHz,sampleCapacity:i.sampleCapacity??yn.sampleCapacity,eventCapacity:i.eventCapacity??yn.eventCapacity,anomalyCapacity:i.anomalyCapacity??yn.anomalyCapacity,dirJumpDeg:i.dirJumpDeg??yn.dirJumpDeg,aimDropDeg:i.aimDropDeg??yn.aimDropDeg,freezeMs:i.freezeMs??yn.freezeMs,freezeSpeed:i.freezeSpeed??yn.freezeSpeed,stickLostMs:i.stickLostMs??yn.stickLostMs,spikeMs:i.spikeMs??yn.spikeMs},e=i.meta,n=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let o=!0,c=-1,l=-1e9,h=null,p=0,u=0,d="",m=-1,_=-1,g=-1,f=0,x=-1e9,M=-1,v={},L=null,w=0,A=0,D=0,E=0;function S(P,R){const $=1/t.sampleHz,z=P[$u];z-l<$-1e-6||(n.length>=t.sampleCapacity&&n.shift(),n.push(P),l=z)}function C(P,R,$,z,V,J){const pt=v[P]??-1e9;if(R-pt<1.2)return;if(v[P]=R,P==="frameSpike"){let lt=0;for(const q of a)q.kind==="frameSpike"&&lt++;if(lt>=6)return}a.length>=t.anomalyCapacity&&a.shift();let ct=n.slice(-7);J&&(ct.length===0||ct[ct.length-1]!==J)&&(ct=[...ct.slice(-6),J]),a.push({kind:P,t:Ye(R),tick:$,ms:Math.round(z),detail:V,ctx:ct}),P==="dirJump"?r.dirJumps++:P==="aimDrop"?r.aimDrops++:P==="moveFreeze"?r.freezes++:P==="stickLost"?r.stickLosts++:P==="stickJump"?r.stickJumps++:P==="stickBad"?r.stickBads++:P==="stickDrift"&&r.stickDrifts++}function N(P,R,$,z){s.length>=t.eventCapacity&&s.shift(),s.push({t:Ye($),tick:z,k:P,d:R})}function F(P){switch(P.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=P.tick;break}}function G(){const P=r,R=P.wallMs/1e3,$=P.gestures,z=ct=>Object.entries($).filter(([lt])=>lt.endsWith(`.${ct}`)).reduce((lt,[,q])=>lt+q,0),V=[];if(V.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),V.push(`运行 ${R.toFixed(1)}s / ${P.frames} 帧 · ${P.fps.toFixed(1)}fps · 最大 ${P.dtMax.toFixed(0)}ms · 尖峰 ${P.spikes} · 步 ${P.steps}`),V.push(`摇杆活跃 ${R>0?Math.round(P.stickActiveMs/1e3/R*100):0}% · 手势 按下 ${z("press")}（单击 ${z("tap")} / 双击 ${z("doubleTap")} / 拖拽 ${z("drag")} / 长按 ${z("longPress")} / 打断 ${z("cancel")} / 拖放 ${z("release")}）`),V.push(`攻击 ${P.attacks}(中${P.hits}) · 受击 ${P.hurts} · 派生 ${P.links}(中${P.linkHits}) · 翻滚 ${P.rolls} 闪现 ${P.blinks} · 跳 ${P.jumps} · 复位 ${P.resets}`),V.push(`法杖 引导${P.channels} 飞弹${P.bolts} 电环${P.rings} · 弓蓄力${P.bowCharges} · 当前武器 ${d||"-"}`),V.push(`异常 ${P.dirJumps+P.aimDrops+P.freezes+P.stickLosts+P.stickJumps+P.stickBads+P.stickDrifts}（dir ${P.dirJumps} / aim ${P.aimDrops} / freeze ${P.freezes} / stick ${P.stickLosts} / stickJump ${P.stickJumps} / 坏指针 ${P.stickBads} / 坐标漂移 ${P.stickDrifts}） · 掉帧尖峰 ${P.spikes}`+(P.inTurns>0?` · 输入转向 ${P.inTurns} 次（最大 ${P.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const ct of a.slice(-6)){V.push(`· ${ct.kind} @t${ct.t.toFixed(2)} tick${ct.tick} ${ct.ms>0?`${ct.ms}ms `:""}${ct.detail}`);const lt=ct.ctx.map(Q=>String(Q[Yu])).join(" "),q=ct.ctx.map(Q=>Q[Qa]===""||Q[Qa]==null?".":String(Q[Qa])).join(" ");if(V.push(`  yaw ${lt}`),V.push(`  in  ${q}`),ct.kind==="stickJump"||ct.kind==="stickBad"||ct.kind==="stickLost"){const Q=ct.ctx.map(it=>`${it[Zu]},${it[qu]}`).join(" "),ht=ct.ctx.map(it=>`${it[ju]},${it[Ku]}`).join(" ");V.push(`  o   ${Q}`),V.push(`  p   ${ht}`)}}if(s.length>0){V.push("最近事件：");for(const ct of s.slice(-12))V.push(`  ${ct.t.toFixed(2)} ${ct.k} ${ct.d}`.trimEnd())}const J=r.screenFrames>0?`屏幕 screenX/Y（${r.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",pt=r.screenFrames>0&&r.clientFrames>0?` / client 回退 ${r.clientFrames} 帧`:"";return V.push(`摇杆坐标源 ${J}${pt}`),V.push(`UA ${e.ua}`),V.join(`
`)}return{sample(P,R,$,z=0){r.frames++,R.stickHeld&&(R.stickScreenOk?r.screenFrames++:r.clientFrames++),r.steps+=z,r.wallMs+=$,$>r.dtMax&&(r.dtMax=$),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=P.time;const V=P.time;if(c<0&&(c=V),D=V,E=P.tick,!o)return;const J=P.character,pt=Math.hypot(R.stickX,R.stickY),ct=Math.hypot(J.velocity.x,J.velocity.z);d=P.combat.weapon;const lt=Ju(P,R),q=J.facing,ht=Math.hypot(R.intents.moveX,R.intents.moveZ)>.05?Math.atan2(R.intents.moveX,R.intents.moveZ):null;pt>.2&&(r.stickActiveMs+=$);const it=[Ye(V),P.tick,Math.round($*10)/10,Ye(R.stickX),Ye(R.stickY),Ye(R.stickRawX),Ye(R.stickRawY),R.stickHeld?1:0,R.source.slice(0,8),Ye(R.intents.moveX),Ye(R.intents.moveZ),Ye(J.position.x),Ye(J.position.z),Ye(J.velocity.x),Ye(J.velocity.z),ln(q),ln(J.bodyYaw),lt,Ye(J.stride),ht===null?"":ln(ht),R.stickId===null?"":R.stickId,Math.round(R.stickOriginX),Math.round(R.stickOriginY),Math.round(R.stickPxX),Math.round(R.stickPxY),R.stickBad,Math.round(R.stickVpTop),Math.round(R.stickOriginSX),Math.round(R.stickOriginSY),Math.round(R.stickScreenX),Math.round(R.stickScreenY),R.stickScreenOk?1:0,Math.round(R.stickScale*100)/100];S(it);const vt=V*1e3<M;if($>t.spikeMs&&!vt&&V-c>.6&&(r.spikes++,C("frameSpike",V,P.tick,$,`dt ${$.toFixed(0)}ms fl=${Ci(lt)}`,it)),h!==null&&!vt){const ut=Math.abs(ln(ls(q-h))),mt=Math.abs(ln(ls(J.moveYaw-p))),T=(u|lt)&(wa|Ta|Aa|Ra)|lt&ys,y=ht===null?null:Math.abs(ln(ls(q-ht))),B=ht===null||h===null?null:Math.abs(ln(ls(h-ht))),tt=y!==null&&B!==null&&y<B-.5,st=(u&ys)!==0&&(lt&ys)===0&&ht===null,nt=y!==null&&(y<=12||tt);ut>t.aimDropDeg&&st?C("aimDrop",V,P.tick,0,`${ut.toFixed(0)}° @aim→none stick(${R.stickX.toFixed(2)},${R.stickY.toFixed(2)}) aim(${R.aimDX.toFixed(0)},${R.aimDY.toFixed(0)}) fl=${Ci(lt)}`,it):ut>t.dirJumpDeg&&T===0&&!st&&(nt?(r.inTurns++,ut>r.inTurnMax&&(r.inTurnMax=ut)):C("dirJump",V,P.tick,0,`${ut.toFixed(0)}° res${y===null?" 无输入":`${y.toFixed(0)}°`} yaw ${ln(h)}→${ln(q)} in ${ht===null?".":ln(ht)}° mvΔ${mt.toFixed(0)}° aim(${R.aimDX.toFixed(0)},${R.aimDY.toFixed(0)}) fl=${Ci(u)}→${Ci(lt)}`,it))}const Et=(lt&(wa|Ta|Aa|Ra))!==0,Dt=P.tick-x<30;pt>.35&&ct<t.freezeSpeed&&!Et&&!Dt?(m<0&&(m=V),V-m>=t.freezeMs/1e3&&V>=_&&(C("moveFreeze",V,P.tick,(V-m)*1e3,`stick(${R.stickX.toFixed(2)},${R.stickY.toFixed(2)}) v${ct.toFixed(2)} ${R.source} fl=${Ci(lt)}`,it),_=V+1.5,m=-1)):m=-1,R.stickHeld?(pt>f&&(f=pt),f>.35&&pt<.06?(g<0&&(g=V),V-g>=t.stickLostMs/1e3&&(C("stickLost",V,P.tick,(V-g)*1e3,`raw(${R.stickRawX.toFixed(2)},${R.stickRawY.toFixed(2)}) peak ${f.toFixed(2)} fl=${Ci(lt)}`,it),g=-1,f=0)):g=-1):(f=0,g=-1);const Ht=R.stickScale>.2&&R.stickScale<5?R.stickScale:1,Ct=R.stickScreenOk,Lt=Ct?R.stickScreenX/Ht:R.stickPxX,U=Ct?R.stickScreenY/Ht:R.stickPxY,Yt=Ct?R.stickOriginSX/Ht:R.stickOriginX,Pt=Ct?R.stickOriginSY/Ht:R.stickOriginY,It=Lt-Yt,Z=U-Pt;if(R.stickHeld&&R.stickId!==null){const ut=L;if(ut&&ut.held&&ut.id===R.stickId){const mt=Math.hypot(ut.dx,ut.dy),T=Math.hypot(It,Z),y=Math.max(mt,T),B=Math.hypot(Lt-ut.cx,U-ut.cy),tt=Math.abs(ln(ls(Math.atan2(Z,It)-Math.atan2(ut.dy,ut.dx)))),st=y*tt*Math.PI/180,nt=Math.hypot(Yt-ut.ox,Pt-ut.oy);if(y>18&&tt>35&&B<Math.max(5,st*.35)&&C("stickJump",V,P.tick,0,`Δ${tt.toFixed(0)}° 手指只动${B.toFixed(0)}px(弧长应${st.toFixed(0)}px) o(${Math.round(ut.ox)},${Math.round(ut.oy)})→(${Math.round(Yt)},${Math.round(Pt)}) 原点位移${nt.toFixed(0)}px p(${Math.round(Lt)},${Math.round(U)}) raw(${Math.round(It)},${Math.round(Z)}) id${R.stickId} ${Ct?"src=屏幕":"src=client"}`,it),Ct&&ut.screenOk){const X=Math.hypot(R.stickPxX-ut.x,R.stickPxY-ut.y),rt=Math.hypot((R.stickScreenX-ut.sx)/Ht,(R.stickScreenY-ut.sy)/Ht);w+=X-rt,Math.abs(w)>20&&(C("stickDrift",V,P.tick,0,`client 相对屏幕漂移 ${w>0?"+":""}${w.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(R.stickPxX)},${Math.round(R.stickPxY)}) screen(${Math.round(R.stickScreenX)},${Math.round(R.stickScreenY)})`,it),w=0)}}L={id:R.stickId,ox:Yt,oy:Pt,cx:Lt,cy:U,x:R.stickPxX,y:R.stickPxY,sx:R.stickScreenX,sy:R.stickScreenY,dx:It,dy:Z,held:!0,screenOk:Ct}}else L=null,w=0;if(R.stickBad>A){const ut=R.stickBad-A;C("stickBad",V,P.tick,0,`拦截 ${ut} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${R.stickBad}）o(${Math.round(R.stickOriginX)},${Math.round(R.stickOriginY)}) p(${Math.round(R.stickPxX)},${Math.round(R.stickPxY)}) id${R.stickId??"-"}`,it)}A=R.stickBad,h=q,p=J.moveYaw,u=lt},event(P,R){const $=Qu(P);F(P),o&&(P.type==="dash-ready"||P.type==="combo-reset"||P.type==="stepUp"||N(P.type,$,R,P.tick))},gesture(P){const R=`${P.button}.${P.kind}`;r.gestures[R]=(r.gestures[R]??0)+1,o&&(P.kind==="longPress"||P.kind==="doubleTap"||P.kind==="drag"||P.kind==="cancel")&&N(`g:${P.kind}`,`${P.button} ${P.heldMs.toFixed(0)}ms d${P.distance.toFixed(0)}px ${P.angleDeg.toFixed(0)}°`,D,E)},suspend(P){M=D*1e3+P,m=-1,g=-1},setEnabled(P){o=P,P||(h=null,L=null,m=-1,g=-1)},clear(){n.length=0,s.length=0,a.length=0,v={},l=-1e9,h=null,u=0,m=-1,g=-1,f=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0,r.stickJumps=0,r.stickBads=0,r.stickDrifts=0,r.screenFrames=0,r.clientFrames=0,w=0,L=null,A=0;for(const P of Object.keys(r.gestures))delete r.gestures[P]},status(){const P=r.simS,R=a.some($=>P-$.t<8&&($.kind==="dirJump"||$.kind==="aimDrop"||$.kind==="moveFreeze"||$.kind==="stickLost"||$.kind==="stickJump"||$.kind==="stickBad"||$.kind==="stickDrift"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:R,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:Wu,samples:n.slice(),events:s.slice(),anomalies:a.slice()}},summary:G}}const ef={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},nf={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},sf={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.35,chestYawMaxDeg:0,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},af={core:ef,scene:nf,view:sf};function qo(i){return JSON.parse(JSON.stringify(i))}const jo=af,rf=qo(jo.core),of=qo(jo.scene),dn=qo(jo.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class An{constructor(t,e,n,s,a="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),An.nextNameID=An.nextNameID||0,this.$name.id=`lil-gui-name-${++An.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class cf extends An{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Kr(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const lf={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Kr,toHexString:Kr},Es={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},df={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=Es.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Es.toHexString(s)}},hf={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=Es.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return Es.toHexString(s)}},uf=[lf,Es,df,hf];function ff(i){return uf.find(t=>t.match(i))}class pf extends An{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=ff(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Kr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class er extends An{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class mf extends An{constructor(t,e,n,s,a,r){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},n=x=>{const M=parseFloat(this.$input.value);isNaN(M)||(this._snapClampSetValue(M+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),n(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,h,p;const u=5,d=x=>{o=x.clientX,c=l=x.clientY,r=!0,h=this.getValue(),p=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=x=>{if(r){const M=x.clientX-o,v=x.clientY-c;Math.abs(v)>u?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(M)>u&&_()}if(!r){const M=x.clientY-l;p-=M*this._step*this._arrowKeyMultiplier(x),h+p>this._max?p=this._max-h:h+p<this._min&&(p=this._min-h),this._snapClampSetValue(h+p)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},f=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",f)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(f,x,M,v,L)=>(f-x)/(M-x)*(L-v)+v,e=f=>{const x=this.$slider.getBoundingClientRect();let M=t(f,x.left,x.right,this._min,this._max);this._snapClampSetValue(M)},n=f=>{this._setDraggingStyle(!0),e(f.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=f=>{e(f.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=f=>{f.preventDefault(),this._setDraggingStyle(!0),e(f.touches[0].clientX),r=!1},h=f=>{f.touches.length>1||(this._hasScrollBar?(o=f.touches[0].clientX,c=f.touches[0].clientY,r=!0):l(f),window.addEventListener("touchmove",p,{passive:!1}),window.addEventListener("touchend",u))},p=f=>{if(r){const x=f.touches[0].clientX-o,M=f.touches[0].clientY-c;Math.abs(x)>Math.abs(M)?l(f):(window.removeEventListener("touchmove",p),window.removeEventListener("touchend",u))}else f.preventDefault(),e(f.touches[0].clientX)},u=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",p),window.removeEventListener("touchend",u)},d=this._callOnFinishChange.bind(this),m=400;let _;const g=f=>{if(Math.abs(f.deltaX)<Math.abs(f.deltaY)&&this._hasScrollBar)return;f.preventDefault();const M=this._normalizeMouseWheel(f)*this._step;this._snapClampSetValue(this.getValue()+M),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(d,m)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class gf extends An{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class _f extends An{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const xf=`.lil-gui {
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
}`;function vf(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let zc=!1;class Ca{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!zc&&o&&(vf(xf),zc=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,a){if(Object(n)===n)return new gf(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new mf(this,t,e,n,s,a);case"boolean":return new cf(this,t,e);case"string":return new _f(this,t,e);case"function":return new er(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new pf(this,t,e,n)}addFolder(t){const e=new Ca({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof er||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof er)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Mf(i,t,e,n){const s=document.getElementById("debug-panel"),a=s?new Ca({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new Ca({title:"实验台 · 调试面板"}),r=a.addFolder("模拟");r.add(e,"timeScale",0,3,.05).name("时间缩放"),r.add(e,"paused").name("暂停"),r.add({step:n.singleStep},"step").name("单步 (1 tick)"),r.add({reset:n.reset},"reset").name("复位全部");const o=a.addFolder("模块");o.add(i.modules,"movement").name("movement"),o.add(i.modules,"combat").name("combat"),o.add(i.modules,"links").name("links"),o.add(i.modules,"orientation").name("orientation"),o.add(i.modules,"targeting").name("targeting"),o.add(i.modules,"hits").name("hits"),o.add(i.modules,"separation").name("separation"),o.add(i.modules,"dash").name("dash"),o.add(i.modules,"camera").name("camera"),o.add(i.modules,"dummies").name("dummies"),o.add(i.modules,"abilities").name("abilities");const c=i.config,l=a.addFolder("移动参数");l.add(c,"moveSpeed",1,10,.1).name("移动速度"),l.add(c,"sprintMultiplier",1,3,.05).name("冲刺倍率"),l.add(c,"acceleration",1,40,.5).name("加速度"),l.add(c,"friction",1,40,.5).name("摩擦"),l.add(c,"gravity",5,60,.5).name("重力"),l.add(c,"jumpSpeed",2,16,.2).name("起跳速度"),l.add(c,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),l.add(c,"characterRadius",.1,.8,.01).name("角色半径"),l.add(c,"characterHeight",.6,2.2,.05).name("角色身高"),l.add(c,"strideLength",.3,3,.05).name("基础步幅"),l.add(c,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),l.add(c,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const h=a.addFolder("程序化步态 (v8)");h.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),h.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),h.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),h.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),h.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),h.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),h.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),h.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),h.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),h.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),h.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆");const p=a.addFolder("停步 / 胸朝向 (v9o)");p.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),p.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),p.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),p.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),p.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const u=a.addFolder("停步惯性 (v9p)");u.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),u.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),u.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),u.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),u.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),u.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置");const d=a.addFolder("击退步态 (v9q)");d.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const m=a.addFolder("程序动画 (v8c/v8d)");m.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),m.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),m.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const _=t.animation.stride;m.add(_,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),m.add(_,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),m.add(_,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),m.add(_,"cycles",1,3,1).name("每段跨步周期数"),m.add(_,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),m.add(_,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),m.add(_,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),m.add(_,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),m.add(_,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),m.add(_,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),m.add(_,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),m.add(_,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),m.add(_,"heavyScale",0,1,.01).name("大剑重击收敛系数"),m.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),m.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),m.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),m.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),m.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),m.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),m.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),m.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),m.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),m.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),m.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),m.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const g=c.combat,f=a.addFolder("战斗参数"),x=f.add(i.combat,"weapon",yi).name("当前武器");f.add(g,"comboWindow",.1,2,.05).name("连击窗口 (s)"),f.add(g,"settle",0,.8,.01).name("段间停顿 (s)"),f.add(g,"attackMoveScale",0,1,.01).name("攻击时移动比例"),f.add(g,"autoCombo").name("按住自动连击"),f.add(g.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),f.add(g.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),f.add(g.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),f.add(g.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),f.add(g.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),f.add(g.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const M=c.abilities;f.add(M.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),f.add(M.arcane,"speed",3,24,.5).name("飞弹速度"),f.add(M.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),f.add(M.ring,"radius",.5,5,.1).name("电环半径"),f.add(M.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),f.add(M.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const v=c.orientation,L=a.addFolder("朝向参数");L.add(v,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),L.add(v,"headTurnRate",.5,40,.5).name("头部转向速率"),L.add(v,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),L.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),L.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),L.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const w=a.addFolder("惯性倾斜 / 盆骨 (v8g)"),A=t.lean;w.add(A,"accelGain",0,.1,.002).name("前后加速度增益"),w.add(A,"turnGain",0,.2,.005).name("绕圈侧倾增益"),w.add(A,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),w.add(A,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),w.add(A,"smoothing",1,30,1).name("倾斜平滑速率"),w.add(A,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),w.add(A,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),w.add(A,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),w.add(A,"crouchSmoothing",1,30,1).name("下沉平滑速率");const D=a.addFolder("足部 IK (v8g)"),E=t.ik;D.add(E,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),D.add(E,"weight",0,1,.01).name("钉地权重"),D.add(E,"attackScale",0,1,.01).name("攻击时权重倍率"),D.add(E,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const S=a.addFolder("程序动画 / 武器握持");S.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),S.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),S.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),S.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const C=c.targeting,N=a.addFolder("目标辅助");N.add(C,"targetAssist").name("启用目标辅助"),N.add(C,"range",1,14,.5).name("锁定范围 (m)"),N.add(C,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),N.add(C,"frontBias",0,4,.1).name("朝向加权"),N.add(C,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),N.add(C,"maxLungeScale",1,3,.1).name("前冲最大放大");const F=c.hits,G=a.addFolder("命中 / 受击 / 击退");G.add(F,"arcDeg",10,120,5).name("命中扇区半角 (°)"),G.add(F,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),G.add(F,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),G.add(F,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),G.add(F.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),G.add(F.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),G.add(F,"dummyReach",.5,4,.1).name("假人命中距离 (m)");const P=c.separation,R=a.addFolder("角色间分离");R.add(P,"iterations",1,8,1).name("迭代次数"),R.add(P,"slop",0,.05,.002).name("额外分离量 (m)"),R.add(P.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),R.add(P.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),R.add(P.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const $=c.dash,z=a.addFolder("冲刺 / 闪避");z.add($,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),z.add($,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),z.add($,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),z.add($,"blinkDistance",1,12,.25).name("闪现距离 (m)"),z.add($,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),z.add($,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),z.add($,"blinkClearVelocity").name("闪现清空速度"),z.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),z.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const V=c.camera,J=a.addFolder("智能相机");J.add(V,"radius",2,18,.5).name("威胁评估半径 (m)"),J.add(V,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),J.add(V,"saturation",.5,8,.1).name("威胁归一化饱和"),J.add(V,"pushIn",0,.5,.01).name("无威胁推进比例"),J.add(V,"maxPullback",0,1,.02).name("最大拉远比例"),J.add(V,"maxOffset",0,6,.1).name("最大构图平移 (m)"),J.add(V,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),J.add(V,"framingBias",0,1,.05).name("威胁质心平移系数"),J.add(V,"attackBoost",0,2,.05).name("挥砍中额外加权"),J.add(V.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),J.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const pt=a.addFolder("输入");pt.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),pt.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const ct=c.dummies,lt=a.addFolder("假人参数");lt.add(ct,"moveSpeed",.5,8,.1).name("移动速度"),lt.add(ct,"wanderRadius",.5,8,.1).name("游走半径"),lt.add(ct,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),lt.add(ct,"followStopDistance",.3,5,.1).name("跟随停距"),lt.add(ct,"keepDistance",1,10,.1).name("保持距离"),lt.add(ct,"keepDeadZone",.1,2,.05).name("保持死区"),lt.add(ct,"attackRange",.5,5,.1).name("攻击距离"),lt.add(ct,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const q=a.addFolder("相机");q.add(t.camera,"pitchDeg",20,80,1).name("俯角"),q.add(t.camera,"yawDeg",-180,180,1).name("方位角"),q.add(t.camera,"distance",6,35,.5).name("距离"),q.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),q.add(t.camera,"fov",25,90,1).name("FOV");const Q=a.addFolder("相机缩放 (v8e)");Q.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Q.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),Q.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Q.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Q.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Q.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Q.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Q.add({reset:n.resetZoom},"reset").name("缩放归 1");const ht=a.addFolder("受击分层 (v8f)"),it=t.hurt;ht.add(it,"enabled").name("启用分层受击 (关=旧版对照)"),ht.add(it,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),ht.add(it,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),ht.add(it,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),ht.add(it,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),ht.add(it,"upperShiftScale",0,1,.01).name("上身位移缩放"),ht.add(it,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),ht.add(it.hitHeight,"light",0,1,.01).name("轻击命中部位"),ht.add(it.hitHeight,"heavy",0,1,.01).name("重击命中部位"),ht.add(it.hitHeight,"knock",0,1,.01).name("击退命中部位"),ht.add(it,"leanLight",0,1.5,.01).name("轻击力度"),ht.add(it,"leanHeavy",0,1.5,.01).name("重击力度"),ht.add(it,"leanKnock",0,1.5,.01).name("击退力度"),ht.add(it,"flashStrength",0,2,.05).name("受击闪光强度");const vt=[{name:"打腹 (abdomen)",p:it.abdomen},{name:"打肩 (shoulder)",p:it.shoulder}].map(({name:Lt,p:U})=>{const Yt=ht.addFolder(Lt);return Yt.add(U,"upperPitch",0,2,.01).name("上身前后倾斜"),Yt.add(U,"upperRoll",0,2,.01).name("上身侧倾"),Yt.add(U,"upperYaw",0,1.5,.01).name("肩部扭转"),Yt.add(U,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),Yt.add(U,"shift",0,.8,.01).name("身体反应位移"),Yt.add(U,"drop",0,.4,.01).name("整体下沉"),Yt.add(U,"back",0,.4,.01).name("屁股向后"),Yt.add(U,"knee",0,1.6,.01).name("屈膝"),Yt.add(U,"hip",0,1,.01).name("髋前倾"),Yt.add(U,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),Yt}),Et=a.addFolder("派生招 (v9a)"),Dt=i.config.links;Et.add(Dt,"enabled").name("总开关 (false=旧连击)"),Et.add(Dt.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Et.add(Dt.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Et.add(Dt.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Et.add(Dt,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Et.add(Dt,"triggerWhileSprinting").name("长跑中可直接触发"),Et.add(Dt.search,"range",1,14,.1).name("索敌距离 (m)"),Et.add(Dt.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Et.add(Dt.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Ht=Dt.moves["sword-shield"];Ht&&(Et.add(Ht,"enabled").name("剑盾盾击"),Et.add(Ht,"distance",0,8,.1).name("冲锋极限 (m)"),Et.add(Ht,"windup",0,.5,.01).name("前摇 (s)"),Et.add(Ht,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Et.add(Ht,"recovery",0,.8,.01).name("收势 (s)"),Et.add(Ht.hit,"radius",0,4,.05).name("命中半径 (m)"),Et.add(Ht.hit,"width",0,2,.05).name("扫掠半径 (m)"),Et.add(Ht.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Et.add(Ht.hit,"duration",0,1.5,.01).name("僵直 (s)")),Et.add(i.config.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Ct=a.addFolder("显示");return Ct.add(e,"showColliders").name("碰撞盒线框").onChange(n.onToggleColliders),Ct.add(e,"showGrid").name("地面网格").onChange(n.onToggleGrid),l.close(),m.close(),f.close(),L.close(),S.close(),w.close(),D.close(),N.close(),G.close(),R.close(),z.close(),J.close(),pt.close(),o.close(),lt.close(),q.close(),Q.close(),ht.close(),d.close(),Et.close(),vt.forEach(Lt=>Lt.close()),Ct.close(),a.close(),{gui:a,refreshWeapon:()=>x.updateDisplay()}}const nr=Math.PI*2,Sn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},yf=45,Sf=50;function bf(i,t,e){return{x:e.rightX*i+e.rightZ*t,y:-(e.forwardX*i+e.forwardZ*t)}}function ds(i,t,e){const n=bf(i,t,e);return Math.atan2(n.x,-n.y)*180/Math.PI}function Ef(i,t){return Math.atan2(i,-t)*180/Math.PI}function Oc(i,t){return Math.abs(((i-t)%360+540)%360-180)}function ks(i){return(i%360+360)%360}const wf={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function Tf(i,t,e,n=8){const s=i.character,a=t.intents,r=Math.hypot(a.moveX,a.moveZ),o=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),h=r>.001?ds(a.moveX,a.moveZ,e):null,p=l>.15?ds(c.x,c.z,e):null,u=ds(Math.sin(s.facing),Math.cos(s.facing),e),d=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?ds(a.aimX,a.aimZ,e):null,m=i.targeting,_=m.hasTarget?ds(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&p!==null?Oc(h,p):null,f=h!==null?Oc(h,u):null,x=g!==null&&g>yf&&r>=.35&&l>=.4;return{inDeg:h,inLen:Math.min(1,r),rawDeg:o>.02?Ef(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,o),stickHeld:t.stickHeld,moveDeg:p,speed:l,faceDeg:u,lockDeg:_,lockId:m.targetId,lockDist:m.targetDist,aimDeg:d,gapMove:g,gapFace:f,warnMove:x}}function Bc(i,t){return!t&&i.aimDeg===null&&i.gapFace!==null&&i.gapFace>Sf&&(i.inLen>=.35||i.speed>=.4)}const Hc="harness.dirDebug";function Af(i={}){const t=!!i.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const n=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?n.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...n].join(""),(i.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),r={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},o=s.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Hc)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),a&&(a.textContent=c?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(c)))}l();function h(M){if(c=M,!t)try{window.localStorage.setItem(Hc,M?"1":"0")}catch{}l()}a==null||a.addEventListener("pointerdown",M=>{M.preventDefault(),M.stopPropagation(),h(!c)}),t||window.addEventListener("keydown",M=>{M.key.toLowerCase()==="v"&&!M.metaKey&&!M.ctrlKey&&h(!c)});const p=Math.min(3,Math.max(1,window.devicePixelRatio||1)),u=118;s.width=Math.round(u*p),s.height=Math.round(u*p);let d=wf,m=0,_="",g=8;function f(M){if(!o)return;const v=u,L=u,w=v/2,A=L/2,D=Math.min(v,L)/2-13;o.setTransform(p,0,0,p,0,0),o.clearRect(0,0,v,L),o.beginPath(),o.arc(w,A,D,0,nr),o.fillStyle="rgba(8, 12, 17, 0.5)",o.fill(),o.lineWidth=1,o.strokeStyle=M.warnMove?"rgba(251, 191, 36, 0.85)":Sn.ring,o.stroke(),o.strokeStyle=Sn.grid,o.beginPath(),o.moveTo(w-D,A),o.lineTo(w+D,A),o.moveTo(w,A-D),o.lineTo(w,A+D),o.stroke();for(let N=0;N<8;N++){const F=N*Math.PI/4,G=w+Math.sin(F)*(D-3),P=A-Math.cos(F)*(D-3),R=w+Math.sin(F)*D,$=A-Math.cos(F)*D;o.beginPath(),o.moveTo(G,P),o.lineTo(R,$),o.stroke()}const E=i.deadZone?Math.min(.9,Math.max(0,i.deadZone())):0;E>0&&(o.save(),o.setLineDash([2,3]),o.strokeStyle=Sn.dead,o.beginPath(),o.arc(w,A,D*E,0,nr),o.stroke(),o.restore());const S=(N,F,G,P,R=!1,$=1)=>{const z=N*Math.PI/180,V=Math.sin(z),J=-Math.cos(z),pt=D*Math.max(.14,Math.min(1,F)),ct=w+V*D*.14,lt=A+J*D*.14,q=w+V*pt,Q=A+J*pt;if(o.save(),o.globalAlpha=$,o.strokeStyle=G,o.fillStyle=G,o.lineWidth=P,o.lineCap="round",R&&o.setLineDash([3,3]),o.beginPath(),o.moveTo(ct,lt),o.lineTo(q,Q),o.stroke(),!R&&pt>D*.3){const ht=-J,it=V,vt=5.2;o.beginPath(),o.moveTo(q+V*1.5,Q+J*1.5),o.lineTo(q-V*vt+ht*vt*.72,Q-J*vt+it*vt*.72),o.lineTo(q-V*vt-ht*vt*.72,Q-J*vt-it*vt*.72),o.closePath(),o.fill()}o.restore()},C=(N,F)=>{const G=N*Math.PI/180,P=Math.sin(G),R=-Math.cos(G),$=-R,z=P,V=D+1.5,J=V+6.5;o.save(),o.fillStyle=F,o.strokeStyle=F,o.lineWidth=1,o.beginPath(),o.moveTo(w+P*J,A+R*J),o.lineTo(w+P*V+$*4,A+R*V+z*4),o.lineTo(w+P*V-$*4,A+R*V-z*4),o.closePath(),o.fill(),o.restore()};M.lockDeg!==null&&S(M.lockDeg,1,Sn.lock,1,!0,.7),M.rawDeg!==null&&M.stickHeld&&S(M.rawDeg,M.rawLen,Sn.raw,1,!0,.9),M.aimDeg!==null&&S(M.aimDeg,1,Sn.aim,1.6,!0,.95),S(M.faceDeg,1,Sn.face,1.1,!0,.55),M.moveDeg!==null&&S(M.moveDeg,M.speed/Math.max(1,g),Sn.move,5.5,!1,.8),M.inDeg!==null&&S(M.inDeg,M.inLen,Sn.input,2.2),C(M.faceDeg,Sn.face),o.beginPath(),o.arc(w,A,2.2,0,nr),o.fillStyle="rgba(220, 235, 248, 0.85)",o.fill()}function x(M,v){const L=D=>D===null?"-":String(Math.round(ks(D)));r.in.textContent=`入 ${L(M.inDeg)}`,r.mv.textContent=`移 ${L(M.moveDeg)}`,r.fc.textContent=`面 ${L(M.faceDeg)}`;const w=D=>D===null?"-":`${Math.round(D)}°`,A=[`Δ入→移 ${w(M.gapMove)}`,`Δ入→面 ${w(M.gapFace)}`];M.speed>.05&&A.push(`v${M.speed.toFixed(1)}`),M.lockDeg!==null&&A.push(`锁#${M.lockId} ${M.lockDist.toFixed(1)}m`),M.aimDeg!==null&&A.push("拖拽瞄准"),r.gap.textContent=A.join("  "),e.classList.toggle("is-warn",M.warnMove||Bc(M,v))}return{update(M,v,L){if(!c)return;g=Math.max(1,M.config.moveSpeed*Math.max(1,M.config.sprintMultiplier));const w=Tf(M,v,L,g);d=w;const A=M.combat.phase!=="idle";f(w);const D=performance.now(),E=`${w.inDeg}|${w.moveDeg}|${w.faceDeg}|${w.lockId}|${w.aimDeg}|${w.warnMove}|${w.speed.toFixed(1)}`;(D-m>90||E!==_)&&(m=D,_=E,x(w,A),e.dataset.in=w.inDeg===null?"":ks(w.inDeg).toFixed(1),e.dataset.mv=w.moveDeg===null?"":ks(w.moveDeg).toFixed(1),e.dataset.fc=ks(w.faceDeg).toFixed(1),e.dataset.warn=w.warnMove||Bc(w,A)?"1":"0")},setEnabled:h,toggle(){return h(!c),c},enabled:()=>c,last:()=>d}}const Rf=6,Cf=480,Gc=240,Vc=92;function Pf(i,t,e,n){const s=t-i;return{t:n,speed:t,dv:s,accel:e>1e-4?s/e:0}}function Df(i={}){const t=Math.max(1,i.windowS??Rf),e=Math.max(60,i.capacity??Cf),n=document.createElement("div");n.id="motiondbg",n.setAttribute("data-ui-region",""),n.innerHTML=['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>','<div id="motiondbg-body">','  <div id="motiondbg-head"><span>速度 / 变化量</span><span id="motiondbg-window">6.0s</span></div>','  <canvas id="motiondbg-graph" width="240" height="92"></canvas>','  <div id="motiondbg-read">v - · 峰 - · Δv -</div>','  <div id="motiondbg-dir"></div>',"</div>"].join(""),document.body.appendChild(n);const s=n.querySelector("#motiondbg-toggle"),a=n.querySelector("#motiondbg-graph"),r=n.querySelector("#motiondbg-read"),o=n.querySelector("#motiondbg-window"),c=n.querySelector("#motiondbg-dir");o.textContent=`${t.toFixed(1)}s`;const l=a.getContext("2d"),h=Math.min(3,Math.max(1,window.devicePixelRatio||1));a.width=Math.round(Gc*h),a.height=Math.round(Vc*h);const p=Af({deadZone:i.deadZone,container:c,embedded:!0});let u=!1;function d(v){u=v,n.classList.toggle("is-off",!v),s.textContent=v?"手感 ⌄":"手感 ▸",s.setAttribute("aria-expanded",String(v)),s.setAttribute("aria-label",v?"收起手感调试面板":"展开手感调试面板")}d(!1),s.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),d(!u)}),window.addEventListener("keydown",v=>{v.key.toLowerCase()==="v"&&!v.metaKey&&!v.ctrlKey&&d(!u)});const m=[];let _=0,g=-1,f={speed:0,dv:0,accel:0,peak:0,samples:0,windowS:t};function x(v){const L=v-t;let w=0;for(;w<m.length&&m[w].t<L;)w++;return m.slice(w)}function M(v,L){if(!l)return;const w=Gc,A=Vc;l.setTransform(h,0,0,h,0,0),l.clearRect(0,0,w,A),l.fillStyle="rgba(8, 12, 17, 0.55)",l.fillRect(0,0,w,A);const D=4,E=4,S=w-D-E,C=9,N=46,F=62,G=22,P=L-t,R=lt=>D+Math.max(0,Math.min(1,(lt-P)/t))*S;l.strokeStyle="rgba(150, 190, 220, 0.14)",l.lineWidth=1,l.beginPath();for(const lt of[C,C+N/2,C+N])l.moveTo(D,lt),l.lineTo(w-E,lt);l.moveTo(D,F+G/2),l.lineTo(w-E,F+G/2),l.stroke();const z=Math.max(1,...v.map(lt=>lt.speed))*1.15,V=lt=>C+N-lt/z*N;if(v.length>1){l.beginPath(),l.moveTo(R(v[0].t),V(v[0].speed));for(let lt=1;lt<v.length;lt++)l.lineTo(R(v[lt].t),V(v[lt].speed));l.strokeStyle="#38bdf8",l.lineWidth=1.8,l.lineJoin="round",l.stroke(),l.lineTo(R(v[v.length-1].t),C+N),l.lineTo(R(v[0].t),C+N),l.closePath(),l.fillStyle="rgba(56, 189, 248, 0.14)",l.fill()}let J=.02;for(const lt of v)J=Math.max(J,Math.abs(lt.dv));J*=1.1;const pt=F+G/2,ct=G/2;for(const lt of v){const q=Math.min(ct,Math.abs(lt.dv)/J*ct);l.fillStyle=lt.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",l.fillRect(R(lt.t)-.7,lt.dv>=0?pt-q:pt,1.4,Math.max(.5,q))}l.font="9px ui-monospace, monospace",l.fillStyle="rgba(190, 214, 234, 0.55)",l.textAlign="left",l.fillText(z.toFixed(1),D+2,C+8),l.fillText("v",D+2,C+N-2),l.fillText("Δv",D+2,F+9),l.textAlign="right",l.fillText("0",w-E-2,C+N-2),l.textAlign="left"}return{dirDebug:p,update(v,L,w){const A=performance.now()/1e3,D=g<0?1/60:Math.max(1e-4,Math.min(.25,A-g));g=A;const E=v.character,S=Math.hypot(E.velocity.x,E.velocity.z),C=Pf(_,S,D,A);_=S,m.push(C),m.length>e&&m.shift();const N=x(A);let F=0;for(const G of N)F=Math.max(F,G.speed);if(f={speed:S,dv:C.dv,accel:C.accel,peak:F,samples:N.length,windowS:t},p.update(v,L,w),u){M(N,A);const G=C.dv>=0?"+":"";r.textContent=`v ${S.toFixed(2)} · 峰 ${F.toFixed(2)} · Δv ${G}${C.dv.toFixed(3)} · ${N.length} 帧`}},setEnabled:d,toggle(){return d(!u),u},enabled:()=>u,last:()=>({...f}),samples:()=>x(performance.now()/1e3).map(v=>({...v}))}}const Lf=["剑盾","双剑","大剑","法杖","弓"],If={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function kf(i){return{update(t,e,n,s,a,r,o=!1){const c=t.character,l=c.position,h=c.velocity,p=t.combat,u=t.events.length>0?t.events[t.events.length-1]:null,d=Ct=>Ct.toFixed(2),m=Ct=>(Ct*180/Math.PI).toFixed(0),_=Lf[yi.indexOf(p.weapon)]??p.weapon,g=Math.round(p.charge*10),f="|".repeat(g)+".".repeat(10-g),x=t.dash,M=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${M.toFixed(0)}%`:`${x.kind} cd${d(x.cooldown)}`,L=s.intents.aimActive?`(${d(s.intents.aimX)},${d(s.intents.aimZ)})`:"-",w=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),A=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),D=Math.abs(w)+Math.abs(A)+1e-6,E=Math.round(Math.abs(A)/D*100),S=`strafe ${E}%${w<-.05?" back":""}`,C=t.camera,N=`threat ${(C.threat*100).toFixed(0)}%  dist×${d(C.distanceScale)}  off (${d(C.offsetX)},${d(C.offsetZ)})  pitch +${d(C.pitchDelta)}°  n=${C.threatCount}`,F=r?d(r.attackBlend):"-",G=r==null?void 0:r.attackWeights,P=G?`gw ${d(G.gaitScale)}  lw ${d(G.attackLegWeight)}  spd ${d(G.driveSpeed)}`:"-",R=G?`${d(G.gaitScale)}/${d(G.attackLegWeight)}`:"-",$=r?`${r.landing.kind} ${d(r.landing.pulse)} t${d(r.landing.remaining)} vy${d(r.landing.impactVy)}`:"-",z=r?`${r.landing.kind}/${d(r.landing.pulse)}`:"-",V=(r==null?void 0:r.zoom)!==void 0?`zoom ×${d(r.zoom)}`:"-",J=r==null?void 0:r.hurt,pt=J?`hurt ${t.playerHurt.type}  部位h${d(J.hitHeight)}  脉冲p${d(J.pulse)}  上身${d(J.upperShift)}  重心${d(J.comShift)}  后坐${d(J.pelvisBack)}  屈膝${d(J.knee)}`:"-",ct=J?`${d(J.hitHeight)}/${d(J.pulse)}/${d(J.knee)}`:"-",lt=r==null?void 0:r.ik,q=lt?`${lt.active?"on":"off"} w${d(lt.weight)} e${d(lt.maxError)}`:"-",Q=t.playerLink,ht=`link ${Q.kind||"-"}  ${Q.phase}  prog ${d(Q.progress)}  win ${d(Q.linkWindow)}s  cd ${d(Q.cooldown)}s  hits ${Q.hitIds.length}  travel ${d(Q.travelled)}/${d(Q.travel)}m  id ${Q.id}`,it=`${Q.phase}/${Q.kind||"-"}/w${d(Q.linkWindow)}`,vt=s.lastGesture,Et=vt?`${vt.button} ${vt.kind} ${vt.heldMs.toFixed(0)}ms d${vt.distance.toFixed(0)}px ${vt.angleDeg.toFixed(0)}° taps${vt.taps}`:"-",Dt=t.dummies.map(Ct=>`${Ct.id}:${If[Ct.mode]}`).join("  ");if(o){i.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${p.phase} · lk ${Q.phase}${Q.kind?`/${Q.kind}`:""} w${d(Q.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?i.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${n}`,`pos (${d(l.x)},${d(l.y)},${d(l.z)})  vel (${d(h.x)},${d(h.y)},${d(h.z)})`,`face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  st${E}%  stick(${d(s.stickX)},${d(s.stickY)}) ${s.source}  str${d(c.stride)}`,`weapon ${_}  ${p.phase}  combo ${p.comboIndex}/3  atk ${d(p.attackProgress)}  dash ${v}  ab ${F}  gw/lw ${R}  land ${z}  ik ${q}`,`aim ${L}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ct}`,`dummies ${Dt}  atkCount ${t.dummyAttackCount}  cam ${(C.threat*100).toFixed(0)}% ×${d(C.distanceScale)}  ${V}  lk ${it}`,`event ${u?`${u.type} ${d(u.value)}`:"-"}  scale ${d(a.timeScale)}${a.paused?" [P]":""}  g ${Et}`].join(`
`):i.textContent=[`tick ${t.tick}   t ${d(t.time)}s   fps ${e.toFixed(0)}   steps ${n}`,`pos  (${d(l.x)}, ${d(l.y)}, ${d(l.z)})`,`vel  (${d(h.x)}, ${d(h.y)}, ${d(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${m(c.facing)}deg   atkBlend ${F}   ${P}   land ${$}`,pt,`ik ${q}  clamped ${lt?lt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  (head-body ${m(c.headYaw-c.bodyYaw)})  ${S}`,`move (${d(s.intents.moveX)}, ${d(s.intents.moveZ)})  stick (${d(s.stickX)}, ${d(s.stickY)})  ${s.source}  aim ${L}`,`weapon ${_}  phase ${p.phase}  combo ${p.comboIndex}/3  atk ${d(p.attackProgress)}${p.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${M.toFixed(0)}%  cd ${d(x.cooldown)}s  id ${x.id}  from (${d(x.fromX)},${d(x.fromZ)}) → to (${d(x.toX)},${d(x.toZ)})`,ht,`camera ${N}  ${V}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${f}] ${(p.charge*100).toFixed(0)}%  charging ${p.charging?"Y":"N"}`,`dummies ${Dt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${d(t.impulse.x)}, ${d(t.impulse.z)})`,`event ${u?`${u.type} ${d(u.value)}`:"-"}   scale ${d(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${Et}`].join(`
`)}}}const Uf=8e3;function Ff(i,t){const e=document.getElementById("hud-toggle"),n=document.getElementById("hint-toggle");let s=!1,a=!1,r=0;function o(){i.classList.toggle("is-compact",!s),e==null||e.setAttribute("aria-expanded",String(s)),e&&(e.textContent=s?"状态 ▾":"状态 ▸",e.setAttribute("aria-label",s?"收起状态读数":"展开状态读数")),t&&(t.hidden=!a),n==null||n.setAttribute("aria-expanded",String(a)),n&&(n.textContent=a?"操作说明 ▾":"操作说明 ▸",n.setAttribute("aria-label",a?"收起操作说明":"展开操作说明"))}function c(){a&&(a=!1,window.clearTimeout(r),r=0,o())}function l(){s&&(s=!1,o())}function h(d){d.preventDefault(),d.stopPropagation(),s=!s,o()}function p(d){d.preventDefault(),d.stopPropagation(),a=!a,window.clearTimeout(r),r=0,a&&(r=window.setTimeout(c,Uf)),o()}e==null||e.addEventListener("pointerdown",h),n==null||n.addEventListener("pointerdown",p);function u(d){const m=d.target;m instanceof Element&&m.closest("#fold-row, #hint")||(c(),l())}return window.addEventListener("pointerdown",u,{capture:!0,passive:!0}),o(),{hudCompact:()=>!s}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ko="170",Nf=0,Xc=1,zf=2,hd=1,ud=2,Fn=3,ei=0,qe=1,Ge=2,Jn=0,ji=1,Wc=2,$c=3,Yc=4,Of=5,gi=100,Bf=101,Hf=102,Gf=103,Vf=104,Xf=200,Wf=201,$f=202,Yf=203,Jr=204,Qr=205,Zf=206,qf=207,jf=208,Kf=209,Jf=210,Qf=211,tp=212,ep=213,np=214,to=0,eo=1,no=2,Qi=3,io=4,so=5,ao=6,ro=7,Jo=0,ip=1,sp=2,Qn=0,ap=1,rp=2,op=3,cp=4,lp=5,dp=6,hp=7,fd=300,ts=301,es=302,oo=303,co=304,Na=306,lo=1e3,xi=1001,ho=1002,_n=1003,up=1004,Us=1005,Tn=1006,ir=1007,vi=1008,Hn=1009,pd=1010,md=1011,ws=1012,Qo=1013,Si=1014,zn=1015,As=1016,tc=1017,ec=1018,ns=1020,gd=35902,_d=1021,xd=1022,gn=1023,vd=1024,Md=1025,Ki=1026,is=1027,yd=1028,nc=1029,Sd=1030,ic=1031,sc=1033,fa=33776,pa=33777,ma=33778,ga=33779,uo=35840,fo=35841,po=35842,mo=35843,go=36196,_o=37492,xo=37496,vo=37808,Mo=37809,yo=37810,So=37811,bo=37812,Eo=37813,wo=37814,To=37815,Ao=37816,Ro=37817,Co=37818,Po=37819,Do=37820,Lo=37821,_a=36492,Io=36494,ko=36495,bd=36283,Uo=36284,Fo=36285,No=36286,fp=3200,pp=3201,Ed=0,mp=1,jn="",an="srgb",as="srgb-linear",za="linear",le="srgb",Pi=7680,Zc=519,gp=512,_p=513,xp=514,wd=515,vp=516,Mp=517,yp=518,Sp=519,zo=35044,qc="300 es",On=2e3,Pa=2001;class rs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const Ie=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],xa=Math.PI/180,Oo=180/Math.PI;function ti(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ie[i&255]+Ie[i>>8&255]+Ie[i>>16&255]+Ie[i>>24&255]+"-"+Ie[t&255]+Ie[t>>8&255]+"-"+Ie[t>>16&15|64]+Ie[t>>24&255]+"-"+Ie[e&63|128]+Ie[e>>8&255]+"-"+Ie[e>>16&255]+Ie[e>>24&255]+Ie[n&255]+Ie[n>>8&255]+Ie[n>>16&255]+Ie[n>>24&255]).toLowerCase()}function Ze(i,t,e){return Math.max(t,Math.min(e,i))}function bp(i,t){return(i%t+t)%t}function sr(i,t,e){return(1-e)*i+e*t}function wn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function de(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class jt{constructor(t=0,e=0){jt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*s+t.x,this.y=a*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kt{constructor(t,e,n,s,a,r,o,c,l){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l)}set(t,e,n,s,a,r,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=a,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],h=n[4],p=n[7],u=n[2],d=n[5],m=n[8],_=s[0],g=s[3],f=s[6],x=s[1],M=s[4],v=s[7],L=s[2],w=s[5],A=s[8];return a[0]=r*_+o*x+c*L,a[3]=r*g+o*M+c*w,a[6]=r*f+o*v+c*A,a[1]=l*_+h*x+p*L,a[4]=l*g+h*M+p*w,a[7]=l*f+h*v+p*A,a[2]=u*_+d*x+m*L,a[5]=u*g+d*M+m*w,a[8]=u*f+d*v+m*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*o*l-n*a*h+n*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],p=h*r-o*l,u=o*c-h*a,d=l*a-r*c,m=e*p+n*u+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=p*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*r)*_,t[3]=u*_,t[4]=(h*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=d*_,t[7]=(n*c-l*e)*_,t[8]=(r*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(ar.makeScale(t,e)),this}rotate(t){return this.premultiply(ar.makeRotation(-t)),this}translate(t,e){return this.premultiply(ar.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ar=new Kt;function Td(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Da(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ep(){const i=Da("canvas");return i.style.display="block",i}const jc={};function vs(i){i in jc||(jc[i]=!0,console.warn(i))}function wp(i,t,e){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}function Tp(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Ap(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ie={enabled:!0,workingColorSpace:as,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===le&&(i.r=Bn(i.r),i.g=Bn(i.g),i.b=Bn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===le&&(i.r=Ji(i.r),i.g=Ji(i.g),i.b=Ji(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===jn?za:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Bn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ji(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Kc=[.64,.33,.3,.6,.15,.06],Jc=[.2126,.7152,.0722],Qc=[.3127,.329],tl=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),el=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ie.define({[as]:{primaries:Kc,whitePoint:Qc,transfer:za,toXYZ:tl,fromXYZ:el,luminanceCoefficients:Jc,workingColorSpaceConfig:{unpackColorSpace:an},outputColorSpaceConfig:{drawingBufferColorSpace:an}},[an]:{primaries:Kc,whitePoint:Qc,transfer:le,toXYZ:tl,fromXYZ:el,luminanceCoefficients:Jc,outputColorSpaceConfig:{drawingBufferColorSpace:an}}});let Di;class Rp{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Di===void 0&&(Di=Da("canvas")),Di.width=t.width,Di.height=t.height;const n=Di.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Di}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Da("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Bn(a[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Bn(e[n]/255)*255):e[n]=Bn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Cp=0;class Ad{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Cp++}),this.uuid=ti(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(rr(s[r].image)):a.push(rr(s[r]))}else a=rr(s);n.url=a}return e||(t.images[this.uuid]=n),n}}function rr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Rp.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Pp=0;class Xe extends rs{constructor(t=Xe.DEFAULT_IMAGE,e=Xe.DEFAULT_MAPPING,n=xi,s=xi,a=Tn,r=vi,o=gn,c=Hn,l=Xe.DEFAULT_ANISOTROPY,h=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Pp++}),this.uuid=ti(),this.name="",this.source=new Ad(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new jt(0,0),this.repeat=new jt(1,1),this.center=new jt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==fd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case lo:t.x=t.x-Math.floor(t.x);break;case xi:t.x=t.x<0?0:1;break;case ho:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case lo:t.y=t.y-Math.floor(t.y);break;case xi:t.y=t.y<0?0:1;break;case ho:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=fd;Xe.DEFAULT_ANISOTROPY=1;class ye{constructor(t=0,e=0,n=0,s=1){ye.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a;const c=t.elements,l=c[0],h=c[4],p=c[8],u=c[1],d=c[5],m=c[9],_=c[2],g=c[6],f=c[10];if(Math.abs(h-u)<.01&&Math.abs(p-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(p+_)<.1&&Math.abs(m+g)<.1&&Math.abs(l+d+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,v=(d+1)/2,L=(f+1)/2,w=(h+u)/4,A=(p+_)/4,D=(m+g)/4;return M>v&&M>L?M<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(M),s=w/n,a=A/n):v>L?v<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),n=w/s,a=D/s):L<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(L),n=A/a,s=D/a),this.set(n,s,a,e),this}let x=Math.sqrt((g-m)*(g-m)+(p-_)*(p-_)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(p-_)/x,this.z=(u-h)/x,this.w=Math.acos((l+d+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Dp extends rs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ye(0,0,t,e),this.scissorTest=!1,this.viewport=new ye(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Tn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new Xe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Ad(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends Dp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Rd extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Lp extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,r,o){let c=n[s+0],l=n[s+1],h=n[s+2],p=n[s+3];const u=a[r+0],d=a[r+1],m=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=p;return}if(o===1){t[e+0]=u,t[e+1]=d,t[e+2]=m,t[e+3]=_;return}if(p!==_||c!==u||l!==d||h!==m){let g=1-o;const f=c*u+l*d+h*m+p*_,x=f>=0?1:-1,M=1-f*f;if(M>Number.EPSILON){const L=Math.sqrt(M),w=Math.atan2(L,f*x);g=Math.sin(g*w)/L,o=Math.sin(o*w)/L}const v=o*x;if(c=c*g+u*v,l=l*g+d*v,h=h*g+m*v,p=p*g+_*v,g===1-o){const L=1/Math.sqrt(c*c+l*l+h*h+p*p);c*=L,l*=L,h*=L,p*=L}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=p}static multiplyQuaternionsFlat(t,e,n,s,a,r){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],p=a[r],u=a[r+1],d=a[r+2],m=a[r+3];return t[e]=o*m+h*p+c*d-l*u,t[e+1]=c*m+h*u+l*p-o*d,t[e+2]=l*m+h*d+o*u-c*p,t[e+3]=h*m-o*p-c*u-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),p=o(a/2),u=c(n/2),d=c(s/2),m=c(a/2);switch(r){case"XYZ":this._x=u*h*p+l*d*m,this._y=l*d*p-u*h*m,this._z=l*h*m+u*d*p,this._w=l*h*p-u*d*m;break;case"YXZ":this._x=u*h*p+l*d*m,this._y=l*d*p-u*h*m,this._z=l*h*m-u*d*p,this._w=l*h*p+u*d*m;break;case"ZXY":this._x=u*h*p-l*d*m,this._y=l*d*p+u*h*m,this._z=l*h*m+u*d*p,this._w=l*h*p-u*d*m;break;case"ZYX":this._x=u*h*p-l*d*m,this._y=l*d*p+u*h*m,this._z=l*h*m-u*d*p,this._w=l*h*p+u*d*m;break;case"YZX":this._x=u*h*p+l*d*m,this._y=l*d*p+u*h*m,this._z=l*h*m-u*d*p,this._w=l*h*p-u*d*m;break;case"XZY":this._x=u*h*p-l*d*m,this._y=l*d*p-u*h*m,this._z=l*h*m+u*d*p,this._w=l*h*p+u*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],h=e[6],p=e[10],u=n+o+p;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-c)*d,this._y=(a-l)*d,this._z=(r-s)*d}else if(n>o&&n>p){const d=2*Math.sqrt(1+n-o-p);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+l)/d}else if(o>p){const d=2*Math.sqrt(1+o-n-p);this._w=(a-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+p-n-o);this._w=(r-s)/d,this._x=(a+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ze(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-n*l,this._z=a*h+r*l+n*c-s*o,this._w=r*h-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),p=Math.sin((1-e)*h)/l,u=Math.sin(e*h)/l;return this._w=r*p+this._w*u,this._x=n*p+this._x*u,this._y=s*p+this._y*u,this._z=a*p+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(t=0,e=0,n=0){W.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(nl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(nl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*n),h=2*(o*e-a*s),p=2*(a*n-r*e);return this.x=e+c*l+r*p-o*h,this.y=n+c*h+o*l-a*p,this.z=s+c*p+a*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return or.copy(this).projectOnVector(t),this.sub(or)}reflect(t){return this.sub(or.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const or=new W,nl=new Rs;class Cs{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,hn):hn.fromBufferAttribute(a,r),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Fs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fs.copy(n.boundingBox)),Fs.applyMatrix4(t.matrixWorld),this.union(Fs)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(hs),Ns.subVectors(this.max,hs),Li.subVectors(t.a,hs),Ii.subVectors(t.b,hs),ki.subVectors(t.c,hs),Xn.subVectors(Ii,Li),Wn.subVectors(ki,Ii),ri.subVectors(Li,ki);let e=[0,-Xn.z,Xn.y,0,-Wn.z,Wn.y,0,-ri.z,ri.y,Xn.z,0,-Xn.x,Wn.z,0,-Wn.x,ri.z,0,-ri.x,-Xn.y,Xn.x,0,-Wn.y,Wn.x,0,-ri.y,ri.x,0];return!cr(e,Li,Ii,ki,Ns)||(e=[1,0,0,0,1,0,0,0,1],!cr(e,Li,Ii,ki,Ns))?!1:(zs.crossVectors(Xn,Wn),e=[zs.x,zs.y,zs.z],cr(e,Li,Ii,ki,Ns))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Dn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Dn=[new W,new W,new W,new W,new W,new W,new W,new W],hn=new W,Fs=new Cs,Li=new W,Ii=new W,ki=new W,Xn=new W,Wn=new W,ri=new W,hs=new W,Ns=new W,zs=new W,oi=new W;function cr(i,t,e,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){oi.fromArray(i,a);const o=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),c=t.dot(oi),l=e.dot(oi),h=n.dot(oi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Ip=new Cs,us=new W,lr=new W;class Oa{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Ip.setFromPoints(t).getCenter(n);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;us.subVectors(t,this.center);const e=us.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(us,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(lr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(us.copy(t.center).add(lr)),this.expandByPoint(us.copy(t.center).sub(lr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ln=new W,dr=new W,Os=new W,$n=new W,hr=new W,Bs=new W,ur=new W;class ac{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ln)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ln.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ln.copy(this.origin).addScaledVector(this.direction,e),Ln.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){dr.copy(t).add(e).multiplyScalar(.5),Os.copy(e).sub(t).normalize(),$n.copy(this.origin).sub(dr);const a=t.distanceTo(e)*.5,r=-this.direction.dot(Os),o=$n.dot(this.direction),c=-$n.dot(Os),l=$n.lengthSq(),h=Math.abs(1-r*r);let p,u,d,m;if(h>0)if(p=r*c-o,u=r*o-c,m=a*h,p>=0)if(u>=-m)if(u<=m){const _=1/h;p*=_,u*=_,d=p*(p+r*u+2*o)+u*(r*p+u+2*c)+l}else u=a,p=Math.max(0,-(r*u+o)),d=-p*p+u*(u+2*c)+l;else u=-a,p=Math.max(0,-(r*u+o)),d=-p*p+u*(u+2*c)+l;else u<=-m?(p=Math.max(0,-(-r*a+o)),u=p>0?-a:Math.min(Math.max(-a,-c),a),d=-p*p+u*(u+2*c)+l):u<=m?(p=0,u=Math.min(Math.max(-a,-c),a),d=u*(u+2*c)+l):(p=Math.max(0,-(r*a+o)),u=p>0?a:Math.min(Math.max(-a,-c),a),d=-p*p+u*(u+2*c)+l);else u=r>0?-a:a,p=Math.max(0,-(r*u+o)),d=-p*p+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,p),s&&s.copy(dr).addScaledVector(Os,u),d}intersectSphere(t,e){Ln.subVectors(t.center,this.origin);const n=Ln.dot(this.direction),s=Ln.dot(Ln)-n*n,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,p=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,s=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,s=(t.min.x-u.x)*l),h>=0?(a=(t.min.y-u.y)*h,r=(t.max.y-u.y)*h):(a=(t.max.y-u.y)*h,r=(t.min.y-u.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),p>=0?(o=(t.min.z-u.z)*p,c=(t.max.z-u.z)*p):(o=(t.max.z-u.z)*p,c=(t.min.z-u.z)*p),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ln)!==null}intersectTriangle(t,e,n,s,a){hr.subVectors(e,t),Bs.subVectors(n,t),ur.crossVectors(hr,Bs);let r=this.direction.dot(ur),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;$n.subVectors(this.origin,t);const c=o*this.direction.dot(Bs.crossVectors($n,Bs));if(c<0)return null;const l=o*this.direction.dot(hr.cross($n));if(l<0||c+l>r)return null;const h=-o*$n.dot(ur);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class fe{constructor(t,e,n,s,a,r,o,c,l,h,p,u,d,m,_,g){fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l,h,p,u,d,m,_,g)}set(t,e,n,s,a,r,o,c,l,h,p,u,d,m,_,g){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=a,f[5]=r,f[9]=o,f[13]=c,f[2]=l,f[6]=h,f[10]=p,f[14]=u,f[3]=d,f[7]=m,f[11]=_,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ui.setFromMatrixColumn(t,0).length(),a=1/Ui.setFromMatrixColumn(t,1).length(),r=1/Ui.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),p=Math.sin(a);if(t.order==="XYZ"){const u=r*h,d=r*p,m=o*h,_=o*p;e[0]=c*h,e[4]=-c*p,e[8]=l,e[1]=d+m*l,e[5]=u-_*l,e[9]=-o*c,e[2]=_-u*l,e[6]=m+d*l,e[10]=r*c}else if(t.order==="YXZ"){const u=c*h,d=c*p,m=l*h,_=l*p;e[0]=u+_*o,e[4]=m*o-d,e[8]=r*l,e[1]=r*p,e[5]=r*h,e[9]=-o,e[2]=d*o-m,e[6]=_+u*o,e[10]=r*c}else if(t.order==="ZXY"){const u=c*h,d=c*p,m=l*h,_=l*p;e[0]=u-_*o,e[4]=-r*p,e[8]=m+d*o,e[1]=d+m*o,e[5]=r*h,e[9]=_-u*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const u=r*h,d=r*p,m=o*h,_=o*p;e[0]=c*h,e[4]=m*l-d,e[8]=u*l+_,e[1]=c*p,e[5]=_*l+u,e[9]=d*l-m,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const u=r*c,d=r*l,m=o*c,_=o*l;e[0]=c*h,e[4]=_-u*p,e[8]=m*p+d,e[1]=p,e[5]=r*h,e[9]=-o*h,e[2]=-l*h,e[6]=d*p+m,e[10]=u-_*p}else if(t.order==="XZY"){const u=r*c,d=r*l,m=o*c,_=o*l;e[0]=c*h,e[4]=-p,e[8]=l*h,e[1]=u*p+_,e[5]=r*h,e[9]=d*p-m,e[2]=m*p-d,e[6]=o*h,e[10]=_*p+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(kp,t,Up)}lookAt(t,e,n){const s=this.elements;return Je.subVectors(t,e),Je.lengthSq()===0&&(Je.z=1),Je.normalize(),Yn.crossVectors(n,Je),Yn.lengthSq()===0&&(Math.abs(n.z)===1?Je.x+=1e-4:Je.z+=1e-4,Je.normalize(),Yn.crossVectors(n,Je)),Yn.normalize(),Hs.crossVectors(Je,Yn),s[0]=Yn.x,s[4]=Hs.x,s[8]=Je.x,s[1]=Yn.y,s[5]=Hs.y,s[9]=Je.y,s[2]=Yn.z,s[6]=Hs.z,s[10]=Je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],h=n[1],p=n[5],u=n[9],d=n[13],m=n[2],_=n[6],g=n[10],f=n[14],x=n[3],M=n[7],v=n[11],L=n[15],w=s[0],A=s[4],D=s[8],E=s[12],S=s[1],C=s[5],N=s[9],F=s[13],G=s[2],P=s[6],R=s[10],$=s[14],z=s[3],V=s[7],J=s[11],pt=s[15];return a[0]=r*w+o*S+c*G+l*z,a[4]=r*A+o*C+c*P+l*V,a[8]=r*D+o*N+c*R+l*J,a[12]=r*E+o*F+c*$+l*pt,a[1]=h*w+p*S+u*G+d*z,a[5]=h*A+p*C+u*P+d*V,a[9]=h*D+p*N+u*R+d*J,a[13]=h*E+p*F+u*$+d*pt,a[2]=m*w+_*S+g*G+f*z,a[6]=m*A+_*C+g*P+f*V,a[10]=m*D+_*N+g*R+f*J,a[14]=m*E+_*F+g*$+f*pt,a[3]=x*w+M*S+v*G+L*z,a[7]=x*A+M*C+v*P+L*V,a[11]=x*D+M*N+v*R+L*J,a[15]=x*E+M*F+v*$+L*pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],h=t[2],p=t[6],u=t[10],d=t[14],m=t[3],_=t[7],g=t[11],f=t[15];return m*(+a*c*p-s*l*p-a*o*u+n*l*u+s*o*d-n*c*d)+_*(+e*c*d-e*l*u+a*r*u-s*r*d+s*l*h-a*c*h)+g*(+e*l*p-e*o*d-a*r*p+n*r*d+a*o*h-n*l*h)+f*(-s*o*h-e*c*p+e*o*u+s*r*p-n*r*u+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],p=t[9],u=t[10],d=t[11],m=t[12],_=t[13],g=t[14],f=t[15],x=p*g*l-_*u*l+_*c*d-o*g*d-p*c*f+o*u*f,M=m*u*l-h*g*l-m*c*d+r*g*d+h*c*f-r*u*f,v=h*_*l-m*p*l+m*o*d-r*_*d-h*o*f+r*p*f,L=m*p*c-h*_*c-m*o*u+r*_*u+h*o*g-r*p*g,w=e*x+n*M+s*v+a*L;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=x*A,t[1]=(_*u*a-p*g*a-_*s*d+n*g*d+p*s*f-n*u*f)*A,t[2]=(o*g*a-_*c*a+_*s*l-n*g*l-o*s*f+n*c*f)*A,t[3]=(p*c*a-o*u*a-p*s*l+n*u*l+o*s*d-n*c*d)*A,t[4]=M*A,t[5]=(h*g*a-m*u*a+m*s*d-e*g*d-h*s*f+e*u*f)*A,t[6]=(m*c*a-r*g*a-m*s*l+e*g*l+r*s*f-e*c*f)*A,t[7]=(r*u*a-h*c*a+h*s*l-e*u*l-r*s*d+e*c*d)*A,t[8]=v*A,t[9]=(m*p*a-h*_*a-m*n*d+e*_*d+h*n*f-e*p*f)*A,t[10]=(r*_*a-m*o*a+m*n*l-e*_*l-r*n*f+e*o*f)*A,t[11]=(h*o*a-r*p*a-h*n*l+e*p*l+r*n*d-e*o*d)*A,t[12]=L*A,t[13]=(h*_*s-m*p*s+m*n*u-e*_*u-h*n*g+e*p*g)*A,t[14]=(m*o*s-r*_*s-m*n*c+e*_*c+r*n*g-e*o*g)*A,t[15]=(r*p*s-h*o*s+h*n*c-e*p*c-r*n*u+e*o*u)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),a=1-n,r=t.x,o=t.y,c=t.z,l=a*r,h=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,r){return this.set(1,n,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,h=r+r,p=o+o,u=a*l,d=a*h,m=a*p,_=r*h,g=r*p,f=o*p,x=c*l,M=c*h,v=c*p,L=n.x,w=n.y,A=n.z;return s[0]=(1-(_+f))*L,s[1]=(d+v)*L,s[2]=(m-M)*L,s[3]=0,s[4]=(d-v)*w,s[5]=(1-(u+f))*w,s[6]=(g+x)*w,s[7]=0,s[8]=(m+M)*A,s[9]=(g-x)*A,s[10]=(1-(u+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let a=Ui.set(s[0],s[1],s[2]).length();const r=Ui.set(s[4],s[5],s[6]).length(),o=Ui.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],un.copy(this);const l=1/a,h=1/r,p=1/o;return un.elements[0]*=l,un.elements[1]*=l,un.elements[2]*=l,un.elements[4]*=h,un.elements[5]*=h,un.elements[6]*=h,un.elements[8]*=p,un.elements[9]*=p,un.elements[10]*=p,e.setFromRotationMatrix(un),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,s,a,r,o=On){const c=this.elements,l=2*a/(e-t),h=2*a/(n-s),p=(e+t)/(e-t),u=(n+s)/(n-s);let d,m;if(o===On)d=-(r+a)/(r-a),m=-2*r*a/(r-a);else if(o===Pa)d=-r/(r-a),m=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=h,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,a,r,o=On){const c=this.elements,l=1/(e-t),h=1/(n-s),p=1/(r-a),u=(e+t)*l,d=(n+s)*h;let m,_;if(o===On)m=(r+a)*p,_=-2*p;else if(o===Pa)m=a*p,_=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ui=new W,un=new fe,kp=new W(0,0,0),Up=new W(1,1,1),Yn=new W,Hs=new W,Je=new W,il=new fe,sl=new Rs;class Cn{constructor(t=0,e=0,n=0,s=Cn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],p=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-p,a),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-p,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Ze(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-p,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ze(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return il.makeRotationFromQuaternion(t),this.setFromRotationMatrix(il,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return sl.setFromEuler(this),this.setFromQuaternion(sl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Cn.DEFAULT_ORDER="XYZ";class rc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Fp=0;const al=new W,Fi=new Rs,In=new fe,Gs=new W,fs=new W,Np=new W,zp=new Rs,rl=new W(1,0,0),ol=new W(0,1,0),cl=new W(0,0,1),ll={type:"added"},Op={type:"removed"},Ni={type:"childadded",child:null},fr={type:"childremoved",child:null};class be extends rs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Fp++}),this.uuid=ti(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new W,e=new Cn,n=new Rs,s=new W(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new Kt}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.premultiply(Fi),this}rotateX(t){return this.rotateOnAxis(rl,t)}rotateY(t){return this.rotateOnAxis(ol,t)}rotateZ(t){return this.rotateOnAxis(cl,t)}translateOnAxis(t,e){return al.copy(t).applyQuaternion(this.quaternion),this.position.add(al.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(rl,t)}translateY(t){return this.translateOnAxis(ol,t)}translateZ(t){return this.translateOnAxis(cl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Gs.copy(t):Gs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(fs,Gs,this.up):In.lookAt(Gs,fs,this.up),this.quaternion.setFromRotationMatrix(In),s&&(In.extractRotation(s.matrixWorld),Fi.setFromRotationMatrix(In),this.quaternion.premultiply(Fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ll),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Op),fr.child=t,this.dispatchEvent(fr),fr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),In.multiply(t.parent.matrixWorld)),t.applyMatrix4(In),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ll),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,t,Np),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,zp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const p=c[l];a(t.shapes,p)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),p=r(t.shapes),u=r(t.skeletons),d=r(t.animations),m=r(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),p.length>0&&(n.shapes=p),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}be.DEFAULT_UP=new W(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fn=new W,kn=new W,pr=new W,Un=new W,zi=new W,Oi=new W,dl=new W,mr=new W,gr=new W,_r=new W,xr=new ye,vr=new ye,Mr=new ye;class tn{constructor(t=new W,e=new W,n=new W){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),fn.subVectors(t,e),s.cross(fn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){fn.subVectors(s,e),kn.subVectors(n,e),pr.subVectors(t,e);const r=fn.dot(fn),o=fn.dot(kn),c=fn.dot(pr),l=kn.dot(kn),h=kn.dot(pr),p=r*l-o*o;if(p===0)return a.set(0,0,0),null;const u=1/p,d=(l*c-o*h)*u,m=(r*h-o*c)*u;return a.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(t,e,n,s,a,r,o,c){return this.getBarycoord(t,e,n,s,Un)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Un.x),c.addScaledVector(r,Un.y),c.addScaledVector(o,Un.z),c)}static getInterpolatedAttribute(t,e,n,s,a,r){return xr.setScalar(0),vr.setScalar(0),Mr.setScalar(0),xr.fromBufferAttribute(t,e),vr.fromBufferAttribute(t,n),Mr.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(xr,a.x),r.addScaledVector(vr,a.y),r.addScaledVector(Mr,a.z),r}static isFrontFacing(t,e,n,s){return fn.subVectors(n,e),kn.subVectors(t,e),fn.cross(kn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return fn.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),fn.cross(kn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return tn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,a){return tn.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,a=this.c;let r,o;zi.subVectors(s,n),Oi.subVectors(a,n),mr.subVectors(t,n);const c=zi.dot(mr),l=Oi.dot(mr);if(c<=0&&l<=0)return e.copy(n);gr.subVectors(t,s);const h=zi.dot(gr),p=Oi.dot(gr);if(h>=0&&p<=h)return e.copy(s);const u=c*p-h*l;if(u<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(zi,r);_r.subVectors(t,a);const d=zi.dot(_r),m=Oi.dot(_r);if(m>=0&&d<=m)return e.copy(a);const _=d*l-c*m;if(_<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector(Oi,o);const g=h*m-d*p;if(g<=0&&p-h>=0&&d-m>=0)return dl.subVectors(a,s),o=(p-h)/(p-h+(d-m)),e.copy(s).addScaledVector(dl,o);const f=1/(g+_+u);return r=_*f,o=u*f,e.copy(n).addScaledVector(zi,r).addScaledVector(Oi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Cd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},Vs={h:0,s:0,l:0};function yr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Zt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=an){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ie.workingColorSpace){return this.r=t,this.g=e,this.b=n,ie.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ie.workingColorSpace){if(t=bp(t,1),e=Ze(e,0,1),n=Ze(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=yr(r,a,t+1/3),this.g=yr(r,a,t),this.b=yr(r,a,t-1/3)}return ie.toWorkingColorSpace(this,s),this}setStyle(t,e=an){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=an){const n=Cd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bn(t.r),this.g=Bn(t.g),this.b=Bn(t.b),this}copyLinearToSRGB(t){return this.r=Ji(t.r),this.g=Ji(t.g),this.b=Ji(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=an){return ie.fromWorkingColorSpace(ke.copy(this),t),Math.round(Ze(ke.r*255,0,255))*65536+Math.round(Ze(ke.g*255,0,255))*256+Math.round(Ze(ke.b*255,0,255))}getHexString(t=an){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.fromWorkingColorSpace(ke.copy(this),e);const n=ke.r,s=ke.g,a=ke.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const p=r-o;switch(l=h<=.5?p/(r+o):p/(2-r-o),r){case n:c=(s-a)/p+(s<a?6:0);break;case s:c=(a-n)/p+2;break;case a:c=(n-s)/p+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.fromWorkingColorSpace(ke.copy(this),e),t.r=ke.r,t.g=ke.g,t.b=ke.b,t}getStyle(t=an){ie.fromWorkingColorSpace(ke.copy(this),t);const e=ke.r,n=ke.g,s=ke.b;return t!==an?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Zn),this.setHSL(Zn.h+t,Zn.s+e,Zn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Zn),t.getHSL(Vs);const n=sr(Zn.h,Vs.h,e),s=sr(Zn.s,Vs.s,e),a=sr(Zn.l,Vs.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ke=new Zt;Zt.NAMES=Cd;let Bp=0;class Ei extends rs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Bp++}),this.uuid=ti(),this.name="",this.blending=ji,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Jr,this.blendDst=Qr,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ji&&(n.blending=this.blending),this.side!==ei&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Jr&&(n.blendSrc=this.blendSrc),this.blendDst!==Qr&&(n.blendDst=this.blendDst),this.blendEquation!==gi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class bn extends Ei{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=Jo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const we=new W,Xs=new jt;class xn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=zo,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Xs.fromBufferAttribute(this,e),Xs.applyMatrix3(t),this.setXY(e,Xs.x,Xs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=wn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=de(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=wn(e,this.array)),e}setX(t,e){return this.normalized&&(e=de(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=wn(e,this.array)),e}setY(t,e){return this.normalized&&(e=de(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=wn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=de(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=wn(e,this.array)),e}setW(t,e){return this.normalized&&(e=de(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=de(e,this.array),n=de(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=de(e,this.array),n=de(n,this.array),s=de(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=de(e,this.array),n=de(n,this.array),s=de(s,this.array),a=de(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==zo&&(t.usage=this.usage),t}}class Pd extends xn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Dd extends xn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Ee extends xn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Hp=0;const sn=new fe,Sr=new be,Bi=new W,Qe=new Cs,ps=new Cs,Ce=new W;class je extends rs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Hp++}),this.uuid=ti(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Td(t)?Dd:Pd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Kt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return sn.makeRotationFromQuaternion(t),this.applyMatrix4(sn),this}rotateX(t){return sn.makeRotationX(t),this.applyMatrix4(sn),this}rotateY(t){return sn.makeRotationY(t),this.applyMatrix4(sn),this}rotateZ(t){return sn.makeRotationZ(t),this.applyMatrix4(sn),this}translate(t,e,n){return sn.makeTranslation(t,e,n),this.applyMatrix4(sn),this}scale(t,e,n){return sn.makeScale(t,e,n),this.applyMatrix4(sn),this}lookAt(t){return Sr.lookAt(t),Sr.updateMatrix(),this.applyMatrix4(Sr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Ee(n,3))}else{for(let n=0,s=e.count;n<s;n++){const a=t[n];e.setXYZ(n,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Cs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const a=e[n];Qe.setFromBufferAttribute(a),this.morphTargetsRelative?(Ce.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Ce),Ce.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Ce)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Oa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new W,1/0);return}if(t){const n=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];ps.setFromBufferAttribute(o),this.morphTargetsRelative?(Ce.addVectors(Qe.min,ps.min),Qe.expandByPoint(Ce),Ce.addVectors(Qe.max,ps.max),Qe.expandByPoint(Ce)):(Qe.expandByPoint(ps.min),Qe.expandByPoint(ps.max))}Qe.getCenter(n);let s=0;for(let a=0,r=t.count;a<r;a++)Ce.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(Ce));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ce.fromBufferAttribute(o,l),c&&(Bi.fromBufferAttribute(t,l),Ce.add(Bi)),s=Math.max(s,n.distanceToSquared(Ce))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xn(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let D=0;D<n.count;D++)o[D]=new W,c[D]=new W;const l=new W,h=new W,p=new W,u=new jt,d=new jt,m=new jt,_=new W,g=new W;function f(D,E,S){l.fromBufferAttribute(n,D),h.fromBufferAttribute(n,E),p.fromBufferAttribute(n,S),u.fromBufferAttribute(a,D),d.fromBufferAttribute(a,E),m.fromBufferAttribute(a,S),h.sub(l),p.sub(l),d.sub(u),m.sub(u);const C=1/(d.x*m.y-m.x*d.y);isFinite(C)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(p,-d.y).multiplyScalar(C),g.copy(p).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(C),o[D].add(_),o[E].add(_),o[S].add(_),c[D].add(g),c[E].add(g),c[S].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let D=0,E=x.length;D<E;++D){const S=x[D],C=S.start,N=S.count;for(let F=C,G=C+N;F<G;F+=3)f(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const M=new W,v=new W,L=new W,w=new W;function A(D){L.fromBufferAttribute(s,D),w.copy(L);const E=o[D];M.copy(E),M.sub(L.multiplyScalar(L.dot(E))).normalize(),v.crossVectors(w,E);const C=v.dot(c[D])<0?-1:1;r.setXYZW(D,M.x,M.y,M.z,C)}for(let D=0,E=x.length;D<E;++D){const S=x[D],C=S.start,N=S.count;for(let F=C,G=C+N;F<G;F+=3)A(t.getX(F+0)),A(t.getX(F+1)),A(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new xn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const s=new W,a=new W,r=new W,o=new W,c=new W,l=new W,h=new W,p=new W;if(t)for(let u=0,d=t.count;u<d;u+=3){const m=t.getX(u+0),_=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,m),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),h.subVectors(r,a),p.subVectors(s,a),h.cross(p),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),a.fromBufferAttribute(e,u+1),r.fromBufferAttribute(e,u+2),h.subVectors(r,a),p.subVectors(s,a),h.cross(p),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ce.fromBufferAttribute(t,e),Ce.normalize(),t.setXYZ(e,Ce.x,Ce.y,Ce.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,p=o.normalized,u=new l.constructor(c.length*h);let d=0,m=0;for(let _=0,g=c.length;_<g;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*h;for(let f=0;f<h;f++)u[m++]=l[d++]}return new xn(u,h,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new je,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,p=l.length;h<p;h++){const u=l[h],d=t(u,n);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let p=0,u=l.length;p<u;p++){const d=l[p];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const a=t.morphAttributes;for(const l in a){const h=[],p=a[l];for(let u=0,d=p.length;u<d;u++)h.push(p[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const p=r[l];this.addGroup(p.start,p.count,p.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hl=new fe,ci=new ac,Ws=new Oa,ul=new W,$s=new W,Ys=new W,Zs=new W,br=new W,qs=new W,fl=new W,js=new W;class ue extends be{constructor(t=new je,e=new bn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){qs.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],p=a[c];h!==0&&(br.fromBufferAttribute(p,t),r?qs.addScaledVector(br,h):qs.addScaledVector(br.sub(e),h))}e.add(qs)}return e}raycast(t,e){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ws.copy(n.boundingSphere),Ws.applyMatrix4(a),ci.copy(t.ray).recast(t.near),!(Ws.containsPoint(ci.origin)===!1&&(ci.intersectSphere(Ws,ul)===null||ci.origin.distanceToSquared(ul)>(t.far-t.near)**2))&&(hl.copy(a).invert(),ci.copy(t.ray).applyMatrix4(hl),!(n.boundingBox!==null&&ci.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ci)))}_computeIntersections(t,e,n){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,p=a.attributes.normal,u=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,_=u.length;m<_;m++){const g=u[m],f=r[g.materialIndex],x=Math.max(g.start,d.start),M=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let v=x,L=M;v<L;v+=3){const w=o.getX(v),A=o.getX(v+1),D=o.getX(v+2);s=Ks(this,f,t,n,l,h,p,w,A,D),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let g=m,f=_;g<f;g+=3){const x=o.getX(g),M=o.getX(g+1),v=o.getX(g+2);s=Ks(this,r,t,n,l,h,p,x,M,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let m=0,_=u.length;m<_;m++){const g=u[m],f=r[g.materialIndex],x=Math.max(g.start,d.start),M=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let v=x,L=M;v<L;v+=3){const w=v,A=v+1,D=v+2;s=Ks(this,f,t,n,l,h,p,w,A,D),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let g=m,f=_;g<f;g+=3){const x=g,M=g+1,v=g+2;s=Ks(this,r,t,n,l,h,p,x,M,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Gp(i,t,e,n,s,a,r,o){let c;if(t.side===qe?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,t.side===ei,o),c===null)return null;js.copy(o),js.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(js);return l<e.near||l>e.far?null:{distance:l,point:js.clone(),object:i}}function Ks(i,t,e,n,s,a,r,o,c,l){i.getVertexPosition(o,$s),i.getVertexPosition(c,Ys),i.getVertexPosition(l,Zs);const h=Gp(i,t,e,n,$s,Ys,Zs,fl);if(h){const p=new W;tn.getBarycoord(fl,$s,Ys,Zs,p),s&&(h.uv=tn.getInterpolatedAttribute(s,o,c,l,p,new jt)),a&&(h.uv1=tn.getInterpolatedAttribute(a,o,c,l,p,new jt)),r&&(h.normal=tn.getInterpolatedAttribute(r,o,c,l,p,new W),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new W,materialIndex:0};tn.getNormal($s,Ys,Zs,u.normal),h.face=u,h.barycoord=p}return h}class Pn extends je{constructor(t=1,e=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],h=[],p=[];let u=0,d=0;m("z","y","x",-1,-1,n,e,t,r,a,0),m("z","y","x",1,-1,n,e,-t,r,a,1),m("x","z","y",1,1,t,n,e,s,r,2),m("x","z","y",1,-1,t,n,-e,s,r,3),m("x","y","z",1,-1,t,e,n,s,a,4),m("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new Ee(l,3)),this.setAttribute("normal",new Ee(h,3)),this.setAttribute("uv",new Ee(p,2));function m(_,g,f,x,M,v,L,w,A,D,E){const S=v/A,C=L/D,N=v/2,F=L/2,G=w/2,P=A+1,R=D+1;let $=0,z=0;const V=new W;for(let J=0;J<R;J++){const pt=J*C-F;for(let ct=0;ct<P;ct++){const lt=ct*S-N;V[_]=lt*x,V[g]=pt*M,V[f]=G,l.push(V.x,V.y,V.z),V[_]=0,V[g]=0,V[f]=w>0?1:-1,h.push(V.x,V.y,V.z),p.push(ct/A),p.push(1-J/D),$+=1}}for(let J=0;J<D;J++)for(let pt=0;pt<A;pt++){const ct=u+pt+P*J,lt=u+pt+P*(J+1),q=u+(pt+1)+P*(J+1),Q=u+(pt+1)+P*J;c.push(ct,lt,Q),c.push(lt,q,Q),z+=6}o.addGroup(d,z,E),d+=z,u+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ss(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function He(i){const t={};for(let e=0;e<i.length;e++){const n=ss(i[e]);for(const s in n)t[s]=n[s]}return t}function Vp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ld(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ie.workingColorSpace}const Xp={clone:ss,merge:He};var Wp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$p=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ni extends Ei{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wp,this.fragmentShader=$p,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ss(t.uniforms),this.uniformsGroups=Vp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Id extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=On}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qn=new W,pl=new jt,ml=new jt;class rn extends Id{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Oo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(xa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Oo*2*Math.atan(Math.tan(xa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(qn.x,qn.y).multiplyScalar(-t/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(qn.x,qn.y).multiplyScalar(-t/qn.z)}getViewSize(t,e){return this.getViewBounds(t,pl,ml),e.subVectors(ml,pl)}setViewOffset(t,e,n,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(xa*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Hi=-90,Gi=1;class Yp extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new rn(Hi,Gi,t,e);s.layers=this.layers,this.add(s);const a=new rn(Hi,Gi,t,e);a.layers=this.layers,this.add(a);const r=new rn(Hi,Gi,t,e);r.layers=this.layers,this.add(r);const o=new rn(Hi,Gi,t,e);o.layers=this.layers,this.add(o);const c=new rn(Hi,Gi,t,e);c.layers=this.layers,this.add(c);const l=new rn(Hi,Gi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===On)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Pa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,h]=this.children,p=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,a),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(p,u,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class kd extends Xe{constructor(t,e,n,s,a,r,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:ts,super(t,e,n,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Zp extends bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new kd(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Tn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Pn(5,5,5),a=new ni({name:"CubemapFromEquirect",uniforms:ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:Jn});a.uniforms.tEquirect.value=e;const r=new ue(s,a),o=e.minFilter;return e.minFilter===vi&&(e.minFilter=Tn),new Yp(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(a)}}const Er=new W,qp=new W,jp=new Kt;class fi{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Er.subVectors(n,e).cross(qp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Er),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||jp.getNormalMatrix(t),s=this.coplanarPoint(Er).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new Oa,Js=new W;class oc{constructor(t=new fi,e=new fi,n=new fi,s=new fi,a=new fi,r=new fi){this.planes=[t,e,n,s,a,r]}set(t,e,n,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=On){const n=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],h=s[5],p=s[6],u=s[7],d=s[8],m=s[9],_=s[10],g=s[11],f=s[12],x=s[13],M=s[14],v=s[15];if(n[0].setComponents(c-a,u-l,g-d,v-f).normalize(),n[1].setComponents(c+a,u+l,g+d,v+f).normalize(),n[2].setComponents(c+r,u+h,g+m,v+x).normalize(),n[3].setComponents(c-r,u-h,g-m,v-x).normalize(),n[4].setComponents(c-o,u-p,g-_,v-M).normalize(),e===On)n[5].setComponents(c+o,u+p,g+_,v+M).normalize();else if(e===Pa)n[5].setComponents(o,p,_,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(t){return li.center.set(0,0,0),li.radius=.7071067811865476,li.applyMatrix4(t.matrixWorld),this.intersectsSphere(li)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Js.x=s.normal.x>0?t.max.x:t.min.x,Js.y=s.normal.y>0?t.max.y:t.min.y,Js.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Js)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ud(){let i=null,t=!1,e=null,n=null;function s(a,r){e(a,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function Kp(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,p=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:p}}function n(o,c,l){const h=c.array,p=c.updateRanges;if(i.bindBuffer(l,o),p.length===0)i.bufferSubData(l,0,h);else{p.sort((d,m)=>d.start-m.start);let u=0;for(let d=1;d<p.length;d++){const m=p[u],_=p[d];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++u,p[u]=_)}p.length=u+1;for(let d=0,m=p.length;d<m;d++){const _=p[d];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class Ba extends je{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,p=t/o,u=e/c,d=[],m=[],_=[],g=[];for(let f=0;f<h;f++){const x=f*u-r;for(let M=0;M<l;M++){const v=M*p-a;m.push(v,-x,0),_.push(0,0,1),g.push(M/o),g.push(1-f/c)}}for(let f=0;f<c;f++)for(let x=0;x<o;x++){const M=x+l*f,v=x+l*(f+1),L=x+1+l*(f+1),w=x+1+l*f;d.push(M,v,w),d.push(v,L,w)}this.setIndex(d),this.setAttribute("position",new Ee(m,3)),this.setAttribute("normal",new Ee(_,3)),this.setAttribute("uv",new Ee(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ba(t.width,t.height,t.widthSegments,t.heightSegments)}}var Jp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Qp=`#ifdef USE_ALPHAHASH
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
#endif`,tm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,em=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,im=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sm=`#ifdef USE_AOMAP
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
#endif`,am=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rm=`#ifdef USE_BATCHING
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
#endif`,om=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,cm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,dm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,hm=`#ifdef USE_IRIDESCENCE
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
#endif`,um=`#ifdef USE_BUMPMAP
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
#endif`,fm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,pm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_m=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Mm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ym=`#define PI 3.141592653589793
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
} // validated`,Sm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,bm=`vec3 transformedNormal = objectNormal;
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
#endif`,Em=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Am=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Rm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Pm=`#ifdef USE_ENVMAP
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
#endif`,Dm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Lm=`#ifdef USE_ENVMAP
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
#endif`,Im=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,km=`#ifdef USE_ENVMAP
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
#endif`,Um=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Fm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Nm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,zm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Om=`#ifdef USE_GRADIENTMAP
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
}`,Bm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Hm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vm=`uniform bool receiveShadow;
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
#endif`,Xm=`#ifdef USE_ENVMAP
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
#endif`,Wm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$m=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ym=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qm=`PhysicalMaterial material;
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
#endif`,jm=`struct PhysicalMaterial {
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
}`,Km=`
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
#endif`,Jm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Qm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,tg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,eg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ng=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ig=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,sg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ag=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,rg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,og=`#if defined( USE_POINTS_UV )
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
#endif`,cg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,lg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,hg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ug=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fg=`#ifdef USE_MORPHTARGETS
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
#endif`,pg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,gg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_g=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Mg=`#ifdef USE_NORMALMAP
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
#endif`,yg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Eg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Tg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ag=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Rg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ig=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,kg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ug=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Fg=`float getShadowMask() {
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
}`,Ng=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zg=`#ifdef USE_SKINNING
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
#endif`,Og=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Bg=`#ifdef USE_SKINNING
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
#endif`,Hg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Vg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Xg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Wg=`#ifdef USE_TRANSMISSION
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
#endif`,$g=`#ifdef USE_TRANSMISSION
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
#endif`,Yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Kg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jg=`uniform sampler2D t2D;
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
}`,Qg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,t0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,e0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,n0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,i0=`#include <common>
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
}`,s0=`#if DEPTH_PACKING == 3200
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
}`,a0=`#define DISTANCE
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
}`,r0=`#define DISTANCE
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
}`,o0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,c0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l0=`uniform float scale;
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
}`,d0=`uniform vec3 diffuse;
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
}`,h0=`#include <common>
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
}`,u0=`uniform vec3 diffuse;
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
}`,f0=`#define LAMBERT
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
}`,p0=`#define LAMBERT
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
}`,m0=`#define MATCAP
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
}`,g0=`#define MATCAP
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
}`,_0=`#define NORMAL
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
}`,x0=`#define NORMAL
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
}`,v0=`#define PHONG
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
}`,M0=`#define PHONG
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
}`,y0=`#define STANDARD
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
}`,S0=`#define STANDARD
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
}`,b0=`#define TOON
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
}`,E0=`#define TOON
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
}`,w0=`uniform float size;
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
}`,T0=`uniform vec3 diffuse;
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
}`,A0=`#include <common>
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
}`,R0=`uniform vec3 color;
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
}`,C0=`uniform float rotation;
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
}`,P0=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:Jp,alphahash_pars_fragment:Qp,alphamap_fragment:tm,alphamap_pars_fragment:em,alphatest_fragment:nm,alphatest_pars_fragment:im,aomap_fragment:sm,aomap_pars_fragment:am,batching_pars_vertex:rm,batching_vertex:om,begin_vertex:cm,beginnormal_vertex:lm,bsdfs:dm,iridescence_fragment:hm,bumpmap_pars_fragment:um,clipping_planes_fragment:fm,clipping_planes_pars_fragment:pm,clipping_planes_pars_vertex:mm,clipping_planes_vertex:gm,color_fragment:_m,color_pars_fragment:xm,color_pars_vertex:vm,color_vertex:Mm,common:ym,cube_uv_reflection_fragment:Sm,defaultnormal_vertex:bm,displacementmap_pars_vertex:Em,displacementmap_vertex:wm,emissivemap_fragment:Tm,emissivemap_pars_fragment:Am,colorspace_fragment:Rm,colorspace_pars_fragment:Cm,envmap_fragment:Pm,envmap_common_pars_fragment:Dm,envmap_pars_fragment:Lm,envmap_pars_vertex:Im,envmap_physical_pars_fragment:Xm,envmap_vertex:km,fog_vertex:Um,fog_pars_vertex:Fm,fog_fragment:Nm,fog_pars_fragment:zm,gradientmap_pars_fragment:Om,lightmap_pars_fragment:Bm,lights_lambert_fragment:Hm,lights_lambert_pars_fragment:Gm,lights_pars_begin:Vm,lights_toon_fragment:Wm,lights_toon_pars_fragment:$m,lights_phong_fragment:Ym,lights_phong_pars_fragment:Zm,lights_physical_fragment:qm,lights_physical_pars_fragment:jm,lights_fragment_begin:Km,lights_fragment_maps:Jm,lights_fragment_end:Qm,logdepthbuf_fragment:tg,logdepthbuf_pars_fragment:eg,logdepthbuf_pars_vertex:ng,logdepthbuf_vertex:ig,map_fragment:sg,map_pars_fragment:ag,map_particle_fragment:rg,map_particle_pars_fragment:og,metalnessmap_fragment:cg,metalnessmap_pars_fragment:lg,morphinstance_vertex:dg,morphcolor_vertex:hg,morphnormal_vertex:ug,morphtarget_pars_vertex:fg,morphtarget_vertex:pg,normal_fragment_begin:mg,normal_fragment_maps:gg,normal_pars_fragment:_g,normal_pars_vertex:xg,normal_vertex:vg,normalmap_pars_fragment:Mg,clearcoat_normal_fragment_begin:yg,clearcoat_normal_fragment_maps:Sg,clearcoat_pars_fragment:bg,iridescence_pars_fragment:Eg,opaque_fragment:wg,packing:Tg,premultiplied_alpha_fragment:Ag,project_vertex:Rg,dithering_fragment:Cg,dithering_pars_fragment:Pg,roughnessmap_fragment:Dg,roughnessmap_pars_fragment:Lg,shadowmap_pars_fragment:Ig,shadowmap_pars_vertex:kg,shadowmap_vertex:Ug,shadowmask_pars_fragment:Fg,skinbase_vertex:Ng,skinning_pars_vertex:zg,skinning_vertex:Og,skinnormal_vertex:Bg,specularmap_fragment:Hg,specularmap_pars_fragment:Gg,tonemapping_fragment:Vg,tonemapping_pars_fragment:Xg,transmission_fragment:Wg,transmission_pars_fragment:$g,uv_pars_fragment:Yg,uv_pars_vertex:Zg,uv_vertex:qg,worldpos_vertex:jg,background_vert:Kg,background_frag:Jg,backgroundCube_vert:Qg,backgroundCube_frag:t0,cube_vert:e0,cube_frag:n0,depth_vert:i0,depth_frag:s0,distanceRGBA_vert:a0,distanceRGBA_frag:r0,equirect_vert:o0,equirect_frag:c0,linedashed_vert:l0,linedashed_frag:d0,meshbasic_vert:h0,meshbasic_frag:u0,meshlambert_vert:f0,meshlambert_frag:p0,meshmatcap_vert:m0,meshmatcap_frag:g0,meshnormal_vert:_0,meshnormal_frag:x0,meshphong_vert:v0,meshphong_frag:M0,meshphysical_vert:y0,meshphysical_frag:S0,meshtoon_vert:b0,meshtoon_frag:E0,points_vert:w0,points_frag:T0,shadow_vert:A0,shadow_frag:R0,sprite_vert:C0,sprite_frag:P0},At={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new jt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new jt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},En={basic:{uniforms:He([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:He([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:He([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:He([At.common,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.roughnessmap,At.metalnessmap,At.fog,At.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:He([At.common,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.gradientmap,At.fog,At.lights,{emissive:{value:new Zt(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:He([At.common,At.bumpmap,At.normalmap,At.displacementmap,At.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:He([At.points,At.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:He([At.common,At.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:He([At.common,At.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:He([At.common,At.bumpmap,At.normalmap,At.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:He([At.sprite,At.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:He([At.common,At.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:He([At.lights,At.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};En.physical={uniforms:He([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new jt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new jt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new jt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const Qs={r:0,b:0,g:0},di=new Cn,D0=new fe;function L0(i,t,e,n,s,a,r){const o=new Zt(0);let c=a===!0?0:1,l,h,p=null,u=0,d=null;function m(x){let M=x.isScene===!0?x.background:null;return M&&M.isTexture&&(M=(x.backgroundBlurriness>0?e:t).get(M)),M}function _(x){let M=!1;const v=m(x);v===null?f(o,c):v&&v.isColor&&(f(v,1),M=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,r):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(x,M){const v=m(M);v&&(v.isCubeTexture||v.mapping===Na)?(h===void 0&&(h=new ue(new Pn(1,1,1),new ni({name:"BackgroundCubeMaterial",uniforms:ss(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),di.copy(M.backgroundRotation),di.x*=-1,di.y*=-1,di.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(D0.makeRotationFromEuler(di)),h.material.toneMapped=ie.getTransfer(v.colorSpace)!==le,(p!==v||u!==v.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,p=v,u=v.version,d=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ue(new Ba(2,2),new ni({name:"BackgroundMaterial",uniforms:ss(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=ie.getTransfer(v.colorSpace)!==le,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(p!==v||u!==v.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,p=v,u=v.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function f(x,M){x.getRGB(Qs,Ld(i)),n.buffers.color.setClear(Qs.r,Qs.g,Qs.b,M,r)}return{getClearColor:function(){return o},setClearColor:function(x,M=1){o.set(x),c=M,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,f(o,c)},render:_,addToRenderList:g}}function I0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let a=s,r=!1;function o(S,C,N,F,G){let P=!1;const R=p(F,N,C);a!==R&&(a=R,l(a.object)),P=d(S,F,N,G),P&&m(S,F,N,G),G!==null&&t.update(G,i.ELEMENT_ARRAY_BUFFER),(P||r)&&(r=!1,v(S,C,N,F),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function p(S,C,N){const F=N.wireframe===!0;let G=n[S.id];G===void 0&&(G={},n[S.id]=G);let P=G[C.id];P===void 0&&(P={},G[C.id]=P);let R=P[F];return R===void 0&&(R=u(c()),P[F]=R),R}function u(S){const C=[],N=[],F=[];for(let G=0;G<e;G++)C[G]=0,N[G]=0,F[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:N,attributeDivisors:F,object:S,attributes:{},index:null}}function d(S,C,N,F){const G=a.attributes,P=C.attributes;let R=0;const $=N.getAttributes();for(const z in $)if($[z].location>=0){const J=G[z];let pt=P[z];if(pt===void 0&&(z==="instanceMatrix"&&S.instanceMatrix&&(pt=S.instanceMatrix),z==="instanceColor"&&S.instanceColor&&(pt=S.instanceColor)),J===void 0||J.attribute!==pt||pt&&J.data!==pt.data)return!0;R++}return a.attributesNum!==R||a.index!==F}function m(S,C,N,F){const G={},P=C.attributes;let R=0;const $=N.getAttributes();for(const z in $)if($[z].location>=0){let J=P[z];J===void 0&&(z==="instanceMatrix"&&S.instanceMatrix&&(J=S.instanceMatrix),z==="instanceColor"&&S.instanceColor&&(J=S.instanceColor));const pt={};pt.attribute=J,J&&J.data&&(pt.data=J.data),G[z]=pt,R++}a.attributes=G,a.attributesNum=R,a.index=F}function _(){const S=a.newAttributes;for(let C=0,N=S.length;C<N;C++)S[C]=0}function g(S){f(S,0)}function f(S,C){const N=a.newAttributes,F=a.enabledAttributes,G=a.attributeDivisors;N[S]=1,F[S]===0&&(i.enableVertexAttribArray(S),F[S]=1),G[S]!==C&&(i.vertexAttribDivisor(S,C),G[S]=C)}function x(){const S=a.newAttributes,C=a.enabledAttributes;for(let N=0,F=C.length;N<F;N++)C[N]!==S[N]&&(i.disableVertexAttribArray(N),C[N]=0)}function M(S,C,N,F,G,P,R){R===!0?i.vertexAttribIPointer(S,C,N,G,P):i.vertexAttribPointer(S,C,N,F,G,P)}function v(S,C,N,F){_();const G=F.attributes,P=N.getAttributes(),R=C.defaultAttributeValues;for(const $ in P){const z=P[$];if(z.location>=0){let V=G[$];if(V===void 0&&($==="instanceMatrix"&&S.instanceMatrix&&(V=S.instanceMatrix),$==="instanceColor"&&S.instanceColor&&(V=S.instanceColor)),V!==void 0){const J=V.normalized,pt=V.itemSize,ct=t.get(V);if(ct===void 0)continue;const lt=ct.buffer,q=ct.type,Q=ct.bytesPerElement,ht=q===i.INT||q===i.UNSIGNED_INT||V.gpuType===Qo;if(V.isInterleavedBufferAttribute){const it=V.data,vt=it.stride,Et=V.offset;if(it.isInstancedInterleavedBuffer){for(let Dt=0;Dt<z.locationSize;Dt++)f(z.location+Dt,it.meshPerAttribute);S.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let Dt=0;Dt<z.locationSize;Dt++)g(z.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,lt);for(let Dt=0;Dt<z.locationSize;Dt++)M(z.location+Dt,pt/z.locationSize,q,J,vt*Q,(Et+pt/z.locationSize*Dt)*Q,ht)}else{if(V.isInstancedBufferAttribute){for(let it=0;it<z.locationSize;it++)f(z.location+it,V.meshPerAttribute);S.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let it=0;it<z.locationSize;it++)g(z.location+it);i.bindBuffer(i.ARRAY_BUFFER,lt);for(let it=0;it<z.locationSize;it++)M(z.location+it,pt/z.locationSize,q,J,pt*Q,pt/z.locationSize*it*Q,ht)}}else if(R!==void 0){const J=R[$];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(z.location,J);break;case 3:i.vertexAttrib3fv(z.location,J);break;case 4:i.vertexAttrib4fv(z.location,J);break;default:i.vertexAttrib1fv(z.location,J)}}}}x()}function L(){D();for(const S in n){const C=n[S];for(const N in C){const F=C[N];for(const G in F)h(F[G].object),delete F[G];delete C[N]}delete n[S]}}function w(S){if(n[S.id]===void 0)return;const C=n[S.id];for(const N in C){const F=C[N];for(const G in F)h(F[G].object),delete F[G];delete C[N]}delete n[S.id]}function A(S){for(const C in n){const N=n[C];if(N[S.id]===void 0)continue;const F=N[S.id];for(const G in F)h(F[G].object),delete F[G];delete N[S.id]}}function D(){E(),r=!0,a!==s&&(a=s,l(a.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:D,resetDefaultState:E,dispose:L,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:g,disableUnusedAttributes:x}}function k0(i,t,e){let n;function s(l){n=l}function a(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,p){p!==0&&(i.drawArraysInstanced(n,l,h,p),e.update(h,n,p))}function o(l,h,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,p);let d=0;for(let m=0;m<p;m++)d+=h[m];e.update(d,n,1)}function c(l,h,p,u){if(p===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<l.length;m++)r(l[m],h[m],u[m]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,p);let m=0;for(let _=0;_<p;_++)m+=h[_]*u[_];e.update(m,n,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function U0(i,t,e,n){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==gn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const D=A===As&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Hn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==zn&&!D)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const p=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=m>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:p,reverseDepthBuffer:u,maxTextures:d,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:v,vertexTextures:L,maxSamples:w}}function F0(i){const t=this;let e=null,n=0,s=!1,a=!1;const r=new fi,o=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(p,u){const d=p.length!==0||u||n!==0||s;return s=u,n=p.length,d},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(p,u){e=h(p,u,0)},this.setState=function(p,u,d){const m=p.clippingPlanes,_=p.clipIntersection,g=p.clipShadows,f=i.get(p);if(!s||m===null||m.length===0||a&&!g)a?h(null):l();else{const x=a?0:n,M=x*4;let v=f.clippingState||null;c.value=v,v=h(m,u,M,d);for(let L=0;L!==M;++L)v[L]=e[L];f.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(p,u,d,m){const _=p!==null?p.length:0;let g=null;if(_!==0){if(g=c.value,m!==!0||g===null){const f=d+_*4,x=u.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<f)&&(g=new Float32Array(f));for(let M=0,v=d;M!==_;++M,v+=4)r.copy(p[M]).applyMatrix4(x,o),r.normal.toArray(g,v),g[v+3]=r.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function N0(i){let t=new WeakMap;function e(r,o){return o===oo?r.mapping=ts:o===co&&(r.mapping=es),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===oo||o===co)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new Zp(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class Fd extends Id{constructor(t=-1,e=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Zi=4,gl=[.125,.215,.35,.446,.526,.582],_i=20,wr=new Fd,_l=new Zt;let Tr=null,Ar=0,Rr=0,Cr=!1;const pi=(1+Math.sqrt(5))/2,Vi=1/pi,xl=[new W(-pi,Vi,0),new W(pi,Vi,0),new W(-Vi,0,pi),new W(Vi,0,pi),new W(0,pi,-Vi),new W(0,pi,Vi),new W(-1,1,-1),new W(1,1,-1),new W(-1,1,1),new W(1,1,1)];class vl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Tr=this._renderer.getRenderTarget(),Ar=this._renderer.getActiveCubeFace(),Rr=this._renderer.getActiveMipmapLevel(),Cr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Tr,Ar,Rr),this._renderer.xr.enabled=Cr,t.scissorTest=!1,ta(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ts||t.mapping===es?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Tr=this._renderer.getRenderTarget(),Ar=this._renderer.getActiveCubeFace(),Rr=this._renderer.getActiveMipmapLevel(),Cr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Tn,minFilter:Tn,generateMipmaps:!1,type:As,format:gn,colorSpace:as,depthBuffer:!1},s=Ml(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ml(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=z0(a)),this._blurMaterial=O0(a,t,e)}return s}_compileMaterial(t){const e=new ue(this._lodPlanes[0],t);this._renderer.compile(e,wr)}_sceneToCubeUV(t,e,n,s){const o=new rn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,p=h.autoClear,u=h.toneMapping;h.getClearColor(_l),h.toneMapping=Qn,h.autoClear=!1;const d=new bn({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1}),m=new ue(new Pn,d);let _=!1;const g=t.background;g?g.isColor&&(d.color.copy(g),t.background=null,_=!0):(d.color.copy(_l),_=!0);for(let f=0;f<6;f++){const x=f%3;x===0?(o.up.set(0,c[f],0),o.lookAt(l[f],0,0)):x===1?(o.up.set(0,0,c[f]),o.lookAt(0,l[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,l[f]));const M=this._cubeSize;ta(s,x*M,f>2?M:0,M,M),h.setRenderTarget(s),_&&h.render(m,o),h.render(t,o)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=u,h.autoClear=p,t.background=g}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ts||t.mapping===es;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yl());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new ue(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;ta(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,wr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=xl[(s-a-1)%xl.length];this._blur(t,a-1,a,r,o)}e.autoClear=n}_blur(t,e,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",a),this._halfBlur(r,t,n,n,s,"longitudinal",a)}_halfBlur(t,e,n,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,p=new ue(this._lodPlanes[s],l),u=l.uniforms,d=this._sizeLods[n]-1,m=isFinite(a)?Math.PI/(2*d):2*Math.PI/(2*_i-1),_=a/m,g=isFinite(a)?1+Math.floor(h*_):_i;g>_i&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${_i}`);const f=[];let x=0;for(let A=0;A<_i;++A){const D=A/_,E=Math.exp(-D*D/2);f.push(E),A===0?x+=E:A<g&&(x+=2*E)}for(let A=0;A<f.length;A++)f[A]=f[A]/x;u.envMap.value=t.texture,u.samples.value=g,u.weights.value=f,u.latitudinal.value=r==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:M}=this;u.dTheta.value=m,u.mipInt.value=M-n;const v=this._sizeLods[s],L=3*v*(s>M-Zi?s-M+Zi:0),w=4*(this._cubeSize-v);ta(e,L,w,3*v,2*v),c.setRenderTarget(e),c.render(p,wr)}}function z0(i){const t=[],e=[],n=[];let s=i;const a=i-Zi+1+gl.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>i-Zi?c=gl[r-i+Zi-1]:r===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,p=1+l,u=[h,h,p,h,p,p,h,h,p,p,h,p],d=6,m=6,_=3,g=2,f=1,x=new Float32Array(_*m*d),M=new Float32Array(g*m*d),v=new Float32Array(f*m*d);for(let w=0;w<d;w++){const A=w%3*2/3-1,D=w>2?0:-1,E=[A,D,0,A+2/3,D,0,A+2/3,D+1,0,A,D,0,A+2/3,D+1,0,A,D+1,0];x.set(E,_*m*w),M.set(u,g*m*w);const S=[w,w,w,w,w,w];v.set(S,f*m*w)}const L=new je;L.setAttribute("position",new xn(x,_)),L.setAttribute("uv",new xn(M,g)),L.setAttribute("faceIndex",new xn(v,f)),t.push(L),s>Zi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ml(i,t,e){const n=new bi(i,t,e);return n.texture.mapping=Na,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ta(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function O0(i,t,e){const n=new Float32Array(_i),s=new W(0,1,0);return new ni({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:cc(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function yl(){return new ni({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:cc(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function Sl(){return new ni({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function cc(){return`

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
	`}function B0(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===oo||c===co,h=c===ts||c===es;if(l||h){let p=t.get(o);const u=p!==void 0?p.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return e===null&&(e=new vl(i)),p=l?e.fromEquirectangular(o,p):e.fromCubemap(o,p),p.texture.pmremVersion=o.pmremVersion,t.set(o,p),p.texture;if(p!==void 0)return p.texture;{const d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new vl(i)),p=l?e.fromEquirectangular(o):e.fromCubemap(o),p.texture.pmremVersion=o.pmremVersion,t.set(o,p),o.addEventListener("dispose",a),p.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function H0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&vs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function G0(i,t,e,n){const s={},a=new WeakMap;function r(p){const u=p.target;u.index!==null&&t.remove(u.index);for(const m in u.attributes)t.remove(u.attributes[m]);for(const m in u.morphAttributes){const _=u.morphAttributes[m];for(let g=0,f=_.length;g<f;g++)t.remove(_[g])}u.removeEventListener("dispose",r),delete s[u.id];const d=a.get(u);d&&(t.remove(d),a.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(p,u){return s[u.id]===!0||(u.addEventListener("dispose",r),s[u.id]=!0,e.memory.geometries++),u}function c(p){const u=p.attributes;for(const m in u)t.update(u[m],i.ARRAY_BUFFER);const d=p.morphAttributes;for(const m in d){const _=d[m];for(let g=0,f=_.length;g<f;g++)t.update(_[g],i.ARRAY_BUFFER)}}function l(p){const u=[],d=p.index,m=p.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let M=0,v=x.length;M<v;M+=3){const L=x[M+0],w=x[M+1],A=x[M+2];u.push(L,w,w,A,A,L)}}else if(m!==void 0){const x=m.array;_=m.version;for(let M=0,v=x.length/3-1;M<v;M+=3){const L=M+0,w=M+1,A=M+2;u.push(L,w,w,A,A,L)}}else return;const g=new(Td(u)?Dd:Pd)(u,1);g.version=_;const f=a.get(p);f&&t.remove(f),a.set(p,g)}function h(p){const u=a.get(p);if(u){const d=p.index;d!==null&&u.version<d.version&&l(p)}else l(p);return a.get(p)}return{get:o,update:c,getWireframeAttribute:h}}function V0(i,t,e){let n;function s(u){n=u}let a,r;function o(u){a=u.type,r=u.bytesPerElement}function c(u,d){i.drawElements(n,d,a,u*r),e.update(d,n,1)}function l(u,d,m){m!==0&&(i.drawElementsInstanced(n,d,a,u*r,m),e.update(d,n,m))}function h(u,d,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,a,u,0,m);let g=0;for(let f=0;f<m;f++)g+=d[f];e.update(g,n,1)}function p(u,d,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<u.length;f++)l(u[f]/r,d[f],_[f]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,a,u,0,_,0,m);let f=0;for(let x=0;x<m;x++)f+=d[x]*_[x];e.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=p}function X0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function W0(i,t,e){const n=new WeakMap,s=new ye;function a(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==p){let S=function(){D.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var d=S;u!==void 0&&u.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let v=0;m===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let L=o.attributes.position.count*v,w=1;L>t.maxTextureSize&&(w=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const A=new Float32Array(L*w*4*p),D=new Rd(A,L,w,p);D.type=zn,D.needsUpdate=!0;const E=v*4;for(let C=0;C<p;C++){const N=f[C],F=x[C],G=M[C],P=L*w*4*C;for(let R=0;R<N.count;R++){const $=R*E;m===!0&&(s.fromBufferAttribute(N,R),A[P+$+0]=s.x,A[P+$+1]=s.y,A[P+$+2]=s.z,A[P+$+3]=0),_===!0&&(s.fromBufferAttribute(F,R),A[P+$+4]=s.x,A[P+$+5]=s.y,A[P+$+6]=s.z,A[P+$+7]=0),g===!0&&(s.fromBufferAttribute(G,R),A[P+$+8]=s.x,A[P+$+9]=s.y,A[P+$+10]=s.z,A[P+$+11]=G.itemSize===4?s.w:1)}}u={count:p,texture:D,size:new jt(L,w)},n.set(o,u),o.addEventListener("dispose",S)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const _=o.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:a}}function $0(i,t,e,n){let s=new WeakMap;function a(c){const l=n.render.frame,h=c.geometry,p=t.get(c,h);if(s.get(p)!==l&&(t.update(p),s.set(p,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==l&&(u.update(),s.set(u,l))}return p}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class Nd extends Xe{constructor(t,e,n,s,a,r,o,c,l,h=Ki){if(h!==Ki&&h!==is)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ki&&(n=Si),n===void 0&&h===is&&(n=ns),super(null,s,a,r,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:_n,this.minFilter=c!==void 0?c:_n,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const zd=new Xe,bl=new Nd(1,1),Od=new Rd,Bd=new Lp,Hd=new kd,El=[],wl=[],Tl=new Float32Array(16),Al=new Float32Array(9),Rl=new Float32Array(4);function os(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let a=El[s];if(a===void 0&&(a=new Float32Array(s),El[s]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,i[r].toArray(a,o)}return a}function Ae(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Re(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ha(i,t){let e=wl[t];e===void 0&&(e=new Int32Array(t),wl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Y0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Z0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2fv(this.addr,t),Re(e,t)}}function q0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;i.uniform3fv(this.addr,t),Re(e,t)}}function j0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4fv(this.addr,t),Re(e,t)}}function K0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Rl.set(n),i.uniformMatrix2fv(this.addr,!1,Rl),Re(e,n)}}function J0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Al.set(n),i.uniformMatrix3fv(this.addr,!1,Al),Re(e,n)}}function Q0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Tl.set(n),i.uniformMatrix4fv(this.addr,!1,Tl),Re(e,n)}}function t_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function e_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2iv(this.addr,t),Re(e,t)}}function n_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3iv(this.addr,t),Re(e,t)}}function i_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4iv(this.addr,t),Re(e,t)}}function s_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function a_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2uiv(this.addr,t),Re(e,t)}}function r_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3uiv(this.addr,t),Re(e,t)}}function o_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4uiv(this.addr,t),Re(e,t)}}function c_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(bl.compareFunction=wd,a=bl):a=zd,e.setTexture2D(t||a,s)}function l_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Bd,s)}function d_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Hd,s)}function h_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Od,s)}function u_(i){switch(i){case 5126:return Y0;case 35664:return Z0;case 35665:return q0;case 35666:return j0;case 35674:return K0;case 35675:return J0;case 35676:return Q0;case 5124:case 35670:return t_;case 35667:case 35671:return e_;case 35668:case 35672:return n_;case 35669:case 35673:return i_;case 5125:return s_;case 36294:return a_;case 36295:return r_;case 36296:return o_;case 35678:case 36198:case 36298:case 36306:case 35682:return c_;case 35679:case 36299:case 36307:return l_;case 35680:case 36300:case 36308:case 36293:return d_;case 36289:case 36303:case 36311:case 36292:return h_}}function f_(i,t){i.uniform1fv(this.addr,t)}function p_(i,t){const e=os(t,this.size,2);i.uniform2fv(this.addr,e)}function m_(i,t){const e=os(t,this.size,3);i.uniform3fv(this.addr,e)}function g_(i,t){const e=os(t,this.size,4);i.uniform4fv(this.addr,e)}function __(i,t){const e=os(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function x_(i,t){const e=os(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function v_(i,t){const e=os(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function M_(i,t){i.uniform1iv(this.addr,t)}function y_(i,t){i.uniform2iv(this.addr,t)}function S_(i,t){i.uniform3iv(this.addr,t)}function b_(i,t){i.uniform4iv(this.addr,t)}function E_(i,t){i.uniform1uiv(this.addr,t)}function w_(i,t){i.uniform2uiv(this.addr,t)}function T_(i,t){i.uniform3uiv(this.addr,t)}function A_(i,t){i.uniform4uiv(this.addr,t)}function R_(i,t,e){const n=this.cache,s=t.length,a=Ha(e,s);Ae(n,a)||(i.uniform1iv(this.addr,a),Re(n,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||zd,a[r])}function C_(i,t,e){const n=this.cache,s=t.length,a=Ha(e,s);Ae(n,a)||(i.uniform1iv(this.addr,a),Re(n,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||Bd,a[r])}function P_(i,t,e){const n=this.cache,s=t.length,a=Ha(e,s);Ae(n,a)||(i.uniform1iv(this.addr,a),Re(n,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||Hd,a[r])}function D_(i,t,e){const n=this.cache,s=t.length,a=Ha(e,s);Ae(n,a)||(i.uniform1iv(this.addr,a),Re(n,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||Od,a[r])}function L_(i){switch(i){case 5126:return f_;case 35664:return p_;case 35665:return m_;case 35666:return g_;case 35674:return __;case 35675:return x_;case 35676:return v_;case 5124:case 35670:return M_;case 35667:case 35671:return y_;case 35668:case 35672:return S_;case 35669:case 35673:return b_;case 5125:return E_;case 36294:return w_;case 36295:return T_;case 36296:return A_;case 35678:case 36198:case 36298:case 36306:case 35682:return R_;case 35679:case 36299:case 36307:return C_;case 35680:case 36300:case 36308:case 36293:return P_;case 36289:case 36303:case 36311:case 36292:return D_}}class I_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=u_(e.type)}}class k_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=L_(e.type)}}class U_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],n)}}}const Pr=/(\w+)(\])?(\[|\.)?/g;function Cl(i,t){i.seq.push(t),i.map[t.id]=t}function F_(i,t,e){const n=i.name,s=n.length;for(Pr.lastIndex=0;;){const a=Pr.exec(n),r=Pr.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Cl(e,l===void 0?new I_(o,i,t):new k_(o,i,t));break}else{let p=e.map[o];p===void 0&&(p=new U_(o),Cl(e,p)),e=p}}}class va{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);F_(a,r,this)}}setValue(t,e,n,s){const a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function Pl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const N_=37297;let z_=0;function O_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}const Dl=new Kt;function B_(i){ie._getMatrix(Dl,ie.workingColorSpace,i);const t=`mat3( ${Dl.elements.map(e=>e.toFixed(4))} )`;switch(ie.getTransfer(i)){case za:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Ll(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+O_(i.getShaderSource(t),r)}else return s}function H_(i,t){const e=B_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function G_(i,t){let e;switch(t){case ap:e="Linear";break;case rp:e="Reinhard";break;case op:e="Cineon";break;case cp:e="ACESFilmic";break;case dp:e="AgX";break;case hp:e="Neutral";break;case lp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ea=new W;function V_(){ie.getLuminanceCoefficients(ea);const i=ea.x.toFixed(4),t=ea.y.toFixed(4),e=ea.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function X_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ms).join(`
`)}function W_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function $_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(t,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:i.getAttribLocation(t,r),locationSize:o}}return e}function Ms(i){return i!==""}function Il(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function kl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Y_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bo(i){return i.replace(Y_,q_)}const Z_=new Map;function q_(i,t){let e=Qt[t];if(e===void 0){const n=Z_.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Bo(e)}const j_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ul(i){return i.replace(j_,K_)}function K_(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Fl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function J_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===hd?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===ud?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Fn&&(t="SHADOWMAP_TYPE_VSM"),t}function Q_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ts:case es:t="ENVMAP_TYPE_CUBE";break;case Na:t="ENVMAP_TYPE_CUBE_UV";break}return t}function tx(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case es:t="ENVMAP_MODE_REFRACTION";break}return t}function ex(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Jo:t="ENVMAP_BLENDING_MULTIPLY";break;case ip:t="ENVMAP_BLENDING_MIX";break;case sp:t="ENVMAP_BLENDING_ADD";break}return t}function nx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function ix(i,t,e,n){const s=i.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=J_(e),l=Q_(e),h=tx(e),p=ex(e),u=nx(e),d=X_(e),m=W_(a),_=s.createProgram();let g,f,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ms).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ms).join(`
`),f.length>0&&(f+=`
`)):(g=[Fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),f=[Fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+p:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Qn?"#define TONE_MAPPING":"",e.toneMapping!==Qn?Qt.tonemapping_pars_fragment:"",e.toneMapping!==Qn?G_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,H_("linearToOutputTexel",e.outputColorSpace),V_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ms).join(`
`)),r=Bo(r),r=Il(r,e),r=kl(r,e),o=Bo(o),o=Il(o,e),o=kl(o,e),r=Ul(r),o=Ul(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",e.glslVersion===qc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===qc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const M=x+g+r,v=x+f+o,L=Pl(s,s.VERTEX_SHADER,M),w=Pl(s,s.FRAGMENT_SHADER,v);s.attachShader(_,L),s.attachShader(_,w),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(C){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(_).trim(),F=s.getShaderInfoLog(L).trim(),G=s.getShaderInfoLog(w).trim();let P=!0,R=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(P=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,L,w);else{const $=Ll(s,L,"vertex"),z=Ll(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+N+`
`+$+`
`+z)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(F===""||G==="")&&(R=!1);R&&(C.diagnostics={runnable:P,programLog:N,vertexShader:{log:F,prefix:g},fragmentShader:{log:G,prefix:f}})}s.deleteShader(L),s.deleteShader(w),D=new va(s,_),E=$_(s,_)}let D;this.getUniforms=function(){return D===void 0&&A(this),D};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,N_)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=z_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=w,this}let sx=0;class ax{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new rx(t),e.set(t,n)),n}}class rx{constructor(t){this.id=sx++,this.code=t,this.usedTimes=0}}function ox(i,t,e,n,s,a,r){const o=new rc,c=new ax,l=new Set,h=[],p=s.logarithmicDepthBuffer,u=s.vertexTextures;let d=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return l.add(E),E===0?"uv":`uv${E}`}function g(E,S,C,N,F){const G=N.fog,P=F.geometry,R=E.isMeshStandardMaterial?N.environment:null,$=(E.isMeshStandardMaterial?e:t).get(E.envMap||R),z=$&&$.mapping===Na?$.image.height:null,V=m[E.type];E.precision!==null&&(d=s.getMaxPrecision(E.precision),d!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",d,"instead."));const J=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,pt=J!==void 0?J.length:0;let ct=0;P.morphAttributes.position!==void 0&&(ct=1),P.morphAttributes.normal!==void 0&&(ct=2),P.morphAttributes.color!==void 0&&(ct=3);let lt,q,Q,ht;if(V){const Wt=En[V];lt=Wt.vertexShader,q=Wt.fragmentShader}else lt=E.vertexShader,q=E.fragmentShader,c.update(E),Q=c.getVertexShaderID(E),ht=c.getFragmentShaderID(E);const it=i.getRenderTarget(),vt=i.state.buffers.depth.getReversed(),Et=F.isInstancedMesh===!0,Dt=F.isBatchedMesh===!0,Ht=!!E.map,Ct=!!E.matcap,Lt=!!$,U=!!E.aoMap,Yt=!!E.lightMap,Pt=!!E.bumpMap,It=!!E.normalMap,Z=!!E.displacementMap,ut=!!E.emissiveMap,mt=!!E.metalnessMap,T=!!E.roughnessMap,y=E.anisotropy>0,B=E.clearcoat>0,tt=E.dispersion>0,st=E.iridescence>0,nt=E.sheen>0,X=E.transmission>0,rt=y&&!!E.anisotropyMap,_t=B&&!!E.clearcoatMap,Tt=B&&!!E.clearcoatNormalMap,ft=B&&!!E.clearcoatRoughnessMap,gt=st&&!!E.iridescenceMap,O=st&&!!E.iridescenceThicknessMap,ot=nt&&!!E.sheenColorMap,dt=nt&&!!E.sheenRoughnessMap,Ut=!!E.specularMap,Ft=!!E.specularColorMap,Gt=!!E.specularIntensityMap,I=X&&!!E.transmissionMap,yt=X&&!!E.thicknessMap,j=!!E.gradientMap,at=!!E.alphaMap,St=E.alphaTest>0,xt=!!E.alphaHash,Bt=!!E.extensions;let ee=Qn;E.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(ee=i.toneMapping);const se={shaderID:V,shaderType:E.type,shaderName:E.name,vertexShader:lt,fragmentShader:q,defines:E.defines,customVertexShaderID:Q,customFragmentShaderID:ht,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:d,batching:Dt,batchingColor:Dt&&F._colorsTexture!==null,instancing:Et,instancingColor:Et&&F.instanceColor!==null,instancingMorph:Et&&F.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:it===null?i.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:as,alphaToCoverage:!!E.alphaToCoverage,map:Ht,matcap:Ct,envMap:Lt,envMapMode:Lt&&$.mapping,envMapCubeUVHeight:z,aoMap:U,lightMap:Yt,bumpMap:Pt,normalMap:It,displacementMap:u&&Z,emissiveMap:ut,normalMapObjectSpace:It&&E.normalMapType===mp,normalMapTangentSpace:It&&E.normalMapType===Ed,metalnessMap:mt,roughnessMap:T,anisotropy:y,anisotropyMap:rt,clearcoat:B,clearcoatMap:_t,clearcoatNormalMap:Tt,clearcoatRoughnessMap:ft,dispersion:tt,iridescence:st,iridescenceMap:gt,iridescenceThicknessMap:O,sheen:nt,sheenColorMap:ot,sheenRoughnessMap:dt,specularMap:Ut,specularColorMap:Ft,specularIntensityMap:Gt,transmission:X,transmissionMap:I,thicknessMap:yt,gradientMap:j,opaque:E.transparent===!1&&E.blending===ji&&E.alphaToCoverage===!1,alphaMap:at,alphaTest:St,alphaHash:xt,combine:E.combine,mapUv:Ht&&_(E.map.channel),aoMapUv:U&&_(E.aoMap.channel),lightMapUv:Yt&&_(E.lightMap.channel),bumpMapUv:Pt&&_(E.bumpMap.channel),normalMapUv:It&&_(E.normalMap.channel),displacementMapUv:Z&&_(E.displacementMap.channel),emissiveMapUv:ut&&_(E.emissiveMap.channel),metalnessMapUv:mt&&_(E.metalnessMap.channel),roughnessMapUv:T&&_(E.roughnessMap.channel),anisotropyMapUv:rt&&_(E.anisotropyMap.channel),clearcoatMapUv:_t&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:Tt&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ft&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:gt&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:O&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:ot&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:dt&&_(E.sheenRoughnessMap.channel),specularMapUv:Ut&&_(E.specularMap.channel),specularColorMapUv:Ft&&_(E.specularColorMap.channel),specularIntensityMapUv:Gt&&_(E.specularIntensityMap.channel),transmissionMapUv:I&&_(E.transmissionMap.channel),thicknessMapUv:yt&&_(E.thicknessMap.channel),alphaMapUv:at&&_(E.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(It||y),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!P.attributes.uv&&(Ht||at),fog:!!G,useFog:E.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:vt,skinning:F.isSkinnedMesh===!0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:pt,morphTextureStride:ct,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:ee,decodeVideoTexture:Ht&&E.map.isVideoTexture===!0&&ie.getTransfer(E.map.colorSpace)===le,decodeVideoTextureEmissive:ut&&E.emissiveMap.isVideoTexture===!0&&ie.getTransfer(E.emissiveMap.colorSpace)===le,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Ge,flipSided:E.side===qe,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Bt&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Bt&&E.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return se.vertexUv1s=l.has(1),se.vertexUv2s=l.has(2),se.vertexUv3s=l.has(3),l.clear(),se}function f(E){const S=[];if(E.shaderID?S.push(E.shaderID):(S.push(E.customVertexShaderID),S.push(E.customFragmentShaderID)),E.defines!==void 0)for(const C in E.defines)S.push(C),S.push(E.defines[C]);return E.isRawShaderMaterial===!1&&(x(S,E),M(S,E),S.push(i.outputColorSpace)),S.push(E.customProgramCacheKey),S.join()}function x(E,S){E.push(S.precision),E.push(S.outputColorSpace),E.push(S.envMapMode),E.push(S.envMapCubeUVHeight),E.push(S.mapUv),E.push(S.alphaMapUv),E.push(S.lightMapUv),E.push(S.aoMapUv),E.push(S.bumpMapUv),E.push(S.normalMapUv),E.push(S.displacementMapUv),E.push(S.emissiveMapUv),E.push(S.metalnessMapUv),E.push(S.roughnessMapUv),E.push(S.anisotropyMapUv),E.push(S.clearcoatMapUv),E.push(S.clearcoatNormalMapUv),E.push(S.clearcoatRoughnessMapUv),E.push(S.iridescenceMapUv),E.push(S.iridescenceThicknessMapUv),E.push(S.sheenColorMapUv),E.push(S.sheenRoughnessMapUv),E.push(S.specularMapUv),E.push(S.specularColorMapUv),E.push(S.specularIntensityMapUv),E.push(S.transmissionMapUv),E.push(S.thicknessMapUv),E.push(S.combine),E.push(S.fogExp2),E.push(S.sizeAttenuation),E.push(S.morphTargetsCount),E.push(S.morphAttributeCount),E.push(S.numDirLights),E.push(S.numPointLights),E.push(S.numSpotLights),E.push(S.numSpotLightMaps),E.push(S.numHemiLights),E.push(S.numRectAreaLights),E.push(S.numDirLightShadows),E.push(S.numPointLightShadows),E.push(S.numSpotLightShadows),E.push(S.numSpotLightShadowsWithMaps),E.push(S.numLightProbes),E.push(S.shadowMapType),E.push(S.toneMapping),E.push(S.numClippingPlanes),E.push(S.numClipIntersection),E.push(S.depthPacking)}function M(E,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),E.push(o.mask)}function v(E){const S=m[E.type];let C;if(S){const N=En[S];C=Xp.clone(N.uniforms)}else C=E.uniforms;return C}function L(E,S){let C;for(let N=0,F=h.length;N<F;N++){const G=h[N];if(G.cacheKey===S){C=G,++C.usedTimes;break}}return C===void 0&&(C=new ix(i,S,E,a),h.push(C)),C}function w(E){if(--E.usedTimes===0){const S=h.indexOf(E);h[S]=h[h.length-1],h.pop(),E.destroy()}}function A(E){c.remove(E)}function D(){c.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:v,acquireProgram:L,releaseProgram:w,releaseShaderCache:A,programs:h,dispose:D}}function cx(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:a}}function lx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Nl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zl(){const i=[];let t=0;const e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function r(p,u,d,m,_,g){let f=i[t];return f===void 0?(f={id:p.id,object:p,geometry:u,material:d,groupOrder:m,renderOrder:p.renderOrder,z:_,group:g},i[t]=f):(f.id=p.id,f.object=p,f.geometry=u,f.material=d,f.groupOrder=m,f.renderOrder=p.renderOrder,f.z=_,f.group=g),t++,f}function o(p,u,d,m,_,g){const f=r(p,u,d,m,_,g);d.transmission>0?n.push(f):d.transparent===!0?s.push(f):e.push(f)}function c(p,u,d,m,_,g){const f=r(p,u,d,m,_,g);d.transmission>0?n.unshift(f):d.transparent===!0?s.unshift(f):e.unshift(f)}function l(p,u){e.length>1&&e.sort(p||lx),n.length>1&&n.sort(u||Nl),s.length>1&&s.sort(u||Nl)}function h(){for(let p=t,u=i.length;p<u;p++){const d=i[p];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:o,unshift:c,finish:h,sort:l}}function dx(){let i=new WeakMap;function t(n,s){const a=i.get(n);let r;return a===void 0?(r=new zl,i.set(n,[r])):s>=a.length?(r=new zl,a.push(r)):r=a[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function hx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new Zt};break;case"SpotLight":e={position:new W,direction:new W,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new W,halfWidth:new W,halfHeight:new W};break}return i[t.id]=e,e}}}function ux(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new jt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new jt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new jt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let fx=0;function px(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function mx(i){const t=new hx,e=ux(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new W);const s=new W,a=new fe,r=new fe;function o(l){let h=0,p=0,u=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let d=0,m=0,_=0,g=0,f=0,x=0,M=0,v=0,L=0,w=0,A=0;l.sort(px);for(let E=0,S=l.length;E<S;E++){const C=l[E],N=C.color,F=C.intensity,G=C.distance,P=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=N.r*F,p+=N.g*F,u+=N.b*F;else if(C.isLightProbe){for(let R=0;R<9;R++)n.probe[R].addScaledVector(C.sh.coefficients[R],F);A++}else if(C.isDirectionalLight){const R=t.get(C);if(R.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const $=C.shadow,z=e.get(C);z.shadowIntensity=$.intensity,z.shadowBias=$.bias,z.shadowNormalBias=$.normalBias,z.shadowRadius=$.radius,z.shadowMapSize=$.mapSize,n.directionalShadow[d]=z,n.directionalShadowMap[d]=P,n.directionalShadowMatrix[d]=C.shadow.matrix,x++}n.directional[d]=R,d++}else if(C.isSpotLight){const R=t.get(C);R.position.setFromMatrixPosition(C.matrixWorld),R.color.copy(N).multiplyScalar(F),R.distance=G,R.coneCos=Math.cos(C.angle),R.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),R.decay=C.decay,n.spot[_]=R;const $=C.shadow;if(C.map&&(n.spotLightMap[L]=C.map,L++,$.updateMatrices(C),C.castShadow&&w++),n.spotLightMatrix[_]=$.matrix,C.castShadow){const z=e.get(C);z.shadowIntensity=$.intensity,z.shadowBias=$.bias,z.shadowNormalBias=$.normalBias,z.shadowRadius=$.radius,z.shadowMapSize=$.mapSize,n.spotShadow[_]=z,n.spotShadowMap[_]=P,v++}_++}else if(C.isRectAreaLight){const R=t.get(C);R.color.copy(N).multiplyScalar(F),R.halfWidth.set(C.width*.5,0,0),R.halfHeight.set(0,C.height*.5,0),n.rectArea[g]=R,g++}else if(C.isPointLight){const R=t.get(C);if(R.color.copy(C.color).multiplyScalar(C.intensity),R.distance=C.distance,R.decay=C.decay,C.castShadow){const $=C.shadow,z=e.get(C);z.shadowIntensity=$.intensity,z.shadowBias=$.bias,z.shadowNormalBias=$.normalBias,z.shadowRadius=$.radius,z.shadowMapSize=$.mapSize,z.shadowCameraNear=$.camera.near,z.shadowCameraFar=$.camera.far,n.pointShadow[m]=z,n.pointShadowMap[m]=P,n.pointShadowMatrix[m]=C.shadow.matrix,M++}n.point[m]=R,m++}else if(C.isHemisphereLight){const R=t.get(C);R.skyColor.copy(C.color).multiplyScalar(F),R.groundColor.copy(C.groundColor).multiplyScalar(F),n.hemi[f]=R,f++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=At.LTC_FLOAT_1,n.rectAreaLTC2=At.LTC_FLOAT_2):(n.rectAreaLTC1=At.LTC_HALF_1,n.rectAreaLTC2=At.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=p,n.ambient[2]=u;const D=n.hash;(D.directionalLength!==d||D.pointLength!==m||D.spotLength!==_||D.rectAreaLength!==g||D.hemiLength!==f||D.numDirectionalShadows!==x||D.numPointShadows!==M||D.numSpotShadows!==v||D.numSpotMaps!==L||D.numLightProbes!==A)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=g,n.point.length=m,n.hemi.length=f,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=v+L-w,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=A,D.directionalLength=d,D.pointLength=m,D.spotLength=_,D.rectAreaLength=g,D.hemiLength=f,D.numDirectionalShadows=x,D.numPointShadows=M,D.numSpotShadows=v,D.numSpotMaps=L,D.numLightProbes=A,n.version=fx++)}function c(l,h){let p=0,u=0,d=0,m=0,_=0;const g=h.matrixWorldInverse;for(let f=0,x=l.length;f<x;f++){const M=l[f];if(M.isDirectionalLight){const v=n.directional[p];v.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),p++}else if(M.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),d++}else if(M.isRectAreaLight){const v=n.rectArea[m];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(g),r.identity(),a.copy(M.matrixWorld),a.premultiply(g),r.extractRotation(a),v.halfWidth.set(M.width*.5,0,0),v.halfHeight.set(0,M.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),m++}else if(M.isPointLight){const v=n.point[u];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(g),u++}else if(M.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(M.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:o,setupView:c,state:n}}function Ol(i){const t=new mx(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function a(h){e.push(h)}function r(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function gx(i){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new Ol(i),t.set(s,[o])):a>=r.length?(o=new Ol(i),r.push(o)):o=r[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class _x extends Ei{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=fp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class xx extends Ei{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const vx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mx=`uniform sampler2D shadow_pass;
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
}`;function yx(i,t,e){let n=new oc;const s=new jt,a=new jt,r=new ye,o=new _x({depthPacking:pp}),c=new xx,l={},h=e.maxTextureSize,p={[ei]:qe,[qe]:ei,[Ge]:Ge},u=new ni({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new jt},radius:{value:4}},vertexShader:vx,fragmentShader:Mx}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const m=new je;m.setAttribute("position",new xn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ue(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hd;let f=this.type;this.render=function(w,A,D){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const E=i.getRenderTarget(),S=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),N=i.state;N.setBlending(Jn),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const F=f!==Fn&&this.type===Fn,G=f===Fn&&this.type!==Fn;for(let P=0,R=w.length;P<R;P++){const $=w[P],z=$.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const V=z.getFrameExtents();if(s.multiply(V),a.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/V.x),s.x=a.x*V.x,z.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/V.y),s.y=a.y*V.y,z.mapSize.y=a.y)),z.map===null||F===!0||G===!0){const pt=this.type!==Fn?{minFilter:_n,magFilter:_n}:{};z.map!==null&&z.map.dispose(),z.map=new bi(s.x,s.y,pt),z.map.texture.name=$.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();const J=z.getViewportCount();for(let pt=0;pt<J;pt++){const ct=z.getViewport(pt);r.set(a.x*ct.x,a.y*ct.y,a.x*ct.z,a.y*ct.w),N.viewport(r),z.updateMatrices($,pt),n=z.getFrustum(),v(A,D,z.camera,$,this.type)}z.isPointLightShadow!==!0&&this.type===Fn&&x(z,D),z.needsUpdate=!1}f=this.type,g.needsUpdate=!1,i.setRenderTarget(E,S,C)};function x(w,A){const D=t.update(_);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new bi(s.x,s.y)),u.uniforms.shadow_pass.value=w.map.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,D,u,_,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,D,d,_,null)}function M(w,A,D,E){let S=null;const C=D.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)S=C;else if(S=D.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const N=S.uuid,F=A.uuid;let G=l[N];G===void 0&&(G={},l[N]=G);let P=G[F];P===void 0&&(P=S.clone(),G[F]=P,A.addEventListener("dispose",L)),S=P}if(S.visible=A.visible,S.wireframe=A.wireframe,E===Fn?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:p[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,D.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const N=i.properties.get(S);N.light=D}return S}function v(w,A,D,E,S){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&S===Fn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,w.matrixWorld);const F=t.update(w),G=w.material;if(Array.isArray(G)){const P=F.groups;for(let R=0,$=P.length;R<$;R++){const z=P[R],V=G[z.materialIndex];if(V&&V.visible){const J=M(w,V,E,S);w.onBeforeShadow(i,w,A,D,F,J,z),i.renderBufferDirect(D,null,F,J,w,z),w.onAfterShadow(i,w,A,D,F,J,z)}}}else if(G.visible){const P=M(w,G,E,S);w.onBeforeShadow(i,w,A,D,F,P,null),i.renderBufferDirect(D,null,F,P,w,null),w.onAfterShadow(i,w,A,D,F,P,null)}}const N=w.children;for(let F=0,G=N.length;F<G;F++)v(N[F],A,D,E,S)}function L(w){w.target.removeEventListener("dispose",L);for(const D in l){const E=l[D],S=w.target.uuid;S in E&&(E[S].dispose(),delete E[S])}}}const Sx={[to]:eo,[no]:ao,[io]:ro,[Qi]:so,[eo]:to,[ao]:no,[ro]:io,[so]:Qi};function bx(i,t){function e(){let I=!1;const yt=new ye;let j=null;const at=new ye(0,0,0,0);return{setMask:function(St){j!==St&&!I&&(i.colorMask(St,St,St,St),j=St)},setLocked:function(St){I=St},setClear:function(St,xt,Bt,ee,se){se===!0&&(St*=ee,xt*=ee,Bt*=ee),yt.set(St,xt,Bt,ee),at.equals(yt)===!1&&(i.clearColor(St,xt,Bt,ee),at.copy(yt))},reset:function(){I=!1,j=null,at.set(-1,0,0,0)}}}function n(){let I=!1,yt=!1,j=null,at=null,St=null;return{setReversed:function(xt){if(yt!==xt){const Bt=t.get("EXT_clip_control");yt?Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.ZERO_TO_ONE_EXT):Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.NEGATIVE_ONE_TO_ONE_EXT);const ee=St;St=null,this.setClear(ee)}yt=xt},getReversed:function(){return yt},setTest:function(xt){xt?it(i.DEPTH_TEST):vt(i.DEPTH_TEST)},setMask:function(xt){j!==xt&&!I&&(i.depthMask(xt),j=xt)},setFunc:function(xt){if(yt&&(xt=Sx[xt]),at!==xt){switch(xt){case to:i.depthFunc(i.NEVER);break;case eo:i.depthFunc(i.ALWAYS);break;case no:i.depthFunc(i.LESS);break;case Qi:i.depthFunc(i.LEQUAL);break;case io:i.depthFunc(i.EQUAL);break;case so:i.depthFunc(i.GEQUAL);break;case ao:i.depthFunc(i.GREATER);break;case ro:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}at=xt}},setLocked:function(xt){I=xt},setClear:function(xt){St!==xt&&(yt&&(xt=1-xt),i.clearDepth(xt),St=xt)},reset:function(){I=!1,j=null,at=null,St=null,yt=!1}}}function s(){let I=!1,yt=null,j=null,at=null,St=null,xt=null,Bt=null,ee=null,se=null;return{setTest:function(Wt){I||(Wt?it(i.STENCIL_TEST):vt(i.STENCIL_TEST))},setMask:function(Wt){yt!==Wt&&!I&&(i.stencilMask(Wt),yt=Wt)},setFunc:function(Wt,pe,Se){(j!==Wt||at!==pe||St!==Se)&&(i.stencilFunc(Wt,pe,Se),j=Wt,at=pe,St=Se)},setOp:function(Wt,pe,Se){(xt!==Wt||Bt!==pe||ee!==Se)&&(i.stencilOp(Wt,pe,Se),xt=Wt,Bt=pe,ee=Se)},setLocked:function(Wt){I=Wt},setClear:function(Wt){se!==Wt&&(i.clearStencil(Wt),se=Wt)},reset:function(){I=!1,yt=null,j=null,at=null,St=null,xt=null,Bt=null,ee=null,se=null}}}const a=new e,r=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},p={},u=new WeakMap,d=[],m=null,_=!1,g=null,f=null,x=null,M=null,v=null,L=null,w=null,A=new Zt(0,0,0),D=0,E=!1,S=null,C=null,N=null,F=null,G=null;const P=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let R=!1,$=0;const z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(z)[1]),R=$>=1):z.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),R=$>=2);let V=null,J={};const pt=i.getParameter(i.SCISSOR_BOX),ct=i.getParameter(i.VIEWPORT),lt=new ye().fromArray(pt),q=new ye().fromArray(ct);function Q(I,yt,j,at){const St=new Uint8Array(4),xt=i.createTexture();i.bindTexture(I,xt),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Bt=0;Bt<j;Bt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(yt,0,i.RGBA,1,1,at,0,i.RGBA,i.UNSIGNED_BYTE,St):i.texImage2D(yt+Bt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,St);return xt}const ht={};ht[i.TEXTURE_2D]=Q(i.TEXTURE_2D,i.TEXTURE_2D,1),ht[i.TEXTURE_CUBE_MAP]=Q(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ht[i.TEXTURE_2D_ARRAY]=Q(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ht[i.TEXTURE_3D]=Q(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),it(i.DEPTH_TEST),r.setFunc(Qi),Pt(!1),It(Xc),it(i.CULL_FACE),U(Jn);function it(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function vt(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Et(I,yt){return p[I]!==yt?(i.bindFramebuffer(I,yt),p[I]=yt,I===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=yt),I===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=yt),!0):!1}function Dt(I,yt){let j=d,at=!1;if(I){j=u.get(yt),j===void 0&&(j=[],u.set(yt,j));const St=I.textures;if(j.length!==St.length||j[0]!==i.COLOR_ATTACHMENT0){for(let xt=0,Bt=St.length;xt<Bt;xt++)j[xt]=i.COLOR_ATTACHMENT0+xt;j.length=St.length,at=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,at=!0);at&&i.drawBuffers(j)}function Ht(I){return m!==I?(i.useProgram(I),m=I,!0):!1}const Ct={[gi]:i.FUNC_ADD,[Bf]:i.FUNC_SUBTRACT,[Hf]:i.FUNC_REVERSE_SUBTRACT};Ct[Gf]=i.MIN,Ct[Vf]=i.MAX;const Lt={[Xf]:i.ZERO,[Wf]:i.ONE,[$f]:i.SRC_COLOR,[Jr]:i.SRC_ALPHA,[Jf]:i.SRC_ALPHA_SATURATE,[jf]:i.DST_COLOR,[Zf]:i.DST_ALPHA,[Yf]:i.ONE_MINUS_SRC_COLOR,[Qr]:i.ONE_MINUS_SRC_ALPHA,[Kf]:i.ONE_MINUS_DST_COLOR,[qf]:i.ONE_MINUS_DST_ALPHA,[Qf]:i.CONSTANT_COLOR,[tp]:i.ONE_MINUS_CONSTANT_COLOR,[ep]:i.CONSTANT_ALPHA,[np]:i.ONE_MINUS_CONSTANT_ALPHA};function U(I,yt,j,at,St,xt,Bt,ee,se,Wt){if(I===Jn){_===!0&&(vt(i.BLEND),_=!1);return}if(_===!1&&(it(i.BLEND),_=!0),I!==Of){if(I!==g||Wt!==E){if((f!==gi||v!==gi)&&(i.blendEquation(i.FUNC_ADD),f=gi,v=gi),Wt)switch(I){case ji:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wc:i.blendFunc(i.ONE,i.ONE);break;case $c:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Yc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ji:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case $c:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Yc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}x=null,M=null,L=null,w=null,A.set(0,0,0),D=0,g=I,E=Wt}return}St=St||yt,xt=xt||j,Bt=Bt||at,(yt!==f||St!==v)&&(i.blendEquationSeparate(Ct[yt],Ct[St]),f=yt,v=St),(j!==x||at!==M||xt!==L||Bt!==w)&&(i.blendFuncSeparate(Lt[j],Lt[at],Lt[xt],Lt[Bt]),x=j,M=at,L=xt,w=Bt),(ee.equals(A)===!1||se!==D)&&(i.blendColor(ee.r,ee.g,ee.b,se),A.copy(ee),D=se),g=I,E=!1}function Yt(I,yt){I.side===Ge?vt(i.CULL_FACE):it(i.CULL_FACE);let j=I.side===qe;yt&&(j=!j),Pt(j),I.blending===ji&&I.transparent===!1?U(Jn):U(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),r.setFunc(I.depthFunc),r.setTest(I.depthTest),r.setMask(I.depthWrite),a.setMask(I.colorWrite);const at=I.stencilWrite;o.setTest(at),at&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ut(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?it(i.SAMPLE_ALPHA_TO_COVERAGE):vt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Pt(I){S!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),S=I)}function It(I){I!==Nf?(it(i.CULL_FACE),I!==C&&(I===Xc?i.cullFace(i.BACK):I===zf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):vt(i.CULL_FACE),C=I}function Z(I){I!==N&&(R&&i.lineWidth(I),N=I)}function ut(I,yt,j){I?(it(i.POLYGON_OFFSET_FILL),(F!==yt||G!==j)&&(i.polygonOffset(yt,j),F=yt,G=j)):vt(i.POLYGON_OFFSET_FILL)}function mt(I){I?it(i.SCISSOR_TEST):vt(i.SCISSOR_TEST)}function T(I){I===void 0&&(I=i.TEXTURE0+P-1),V!==I&&(i.activeTexture(I),V=I)}function y(I,yt,j){j===void 0&&(V===null?j=i.TEXTURE0+P-1:j=V);let at=J[j];at===void 0&&(at={type:void 0,texture:void 0},J[j]=at),(at.type!==I||at.texture!==yt)&&(V!==j&&(i.activeTexture(j),V=j),i.bindTexture(I,yt||ht[I]),at.type=I,at.texture=yt)}function B(){const I=J[V];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function tt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function st(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function nt(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function X(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function rt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _t(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Tt(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ft(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function gt(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function O(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(I){lt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),lt.copy(I))}function dt(I){q.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),q.copy(I))}function Ut(I,yt){let j=l.get(yt);j===void 0&&(j=new WeakMap,l.set(yt,j));let at=j.get(I);at===void 0&&(at=i.getUniformBlockIndex(yt,I.name),j.set(I,at))}function Ft(I,yt){const at=l.get(yt).get(I);c.get(yt)!==at&&(i.uniformBlockBinding(yt,at,I.__bindingPointIndex),c.set(yt,at))}function Gt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},V=null,J={},p={},u=new WeakMap,d=[],m=null,_=!1,g=null,f=null,x=null,M=null,v=null,L=null,w=null,A=new Zt(0,0,0),D=0,E=!1,S=null,C=null,N=null,F=null,G=null,lt.set(0,0,i.canvas.width,i.canvas.height),q.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:it,disable:vt,bindFramebuffer:Et,drawBuffers:Dt,useProgram:Ht,setBlending:U,setMaterial:Yt,setFlipSided:Pt,setCullFace:It,setLineWidth:Z,setPolygonOffset:ut,setScissorTest:mt,activeTexture:T,bindTexture:y,unbindTexture:B,compressedTexImage2D:tt,compressedTexImage3D:st,texImage2D:gt,texImage3D:O,updateUBOMapping:Ut,uniformBlockBinding:Ft,texStorage2D:Tt,texStorage3D:ft,texSubImage2D:nt,texSubImage3D:X,compressedTexSubImage2D:rt,compressedTexSubImage3D:_t,scissor:ot,viewport:dt,reset:Gt}}function Bl(i,t,e,n){const s=Ex(n);switch(e){case _d:return i*t;case vd:return i*t;case Md:return i*t*2;case yd:return i*t/s.components*s.byteLength;case nc:return i*t/s.components*s.byteLength;case Sd:return i*t*2/s.components*s.byteLength;case ic:return i*t*2/s.components*s.byteLength;case xd:return i*t*3/s.components*s.byteLength;case gn:return i*t*4/s.components*s.byteLength;case sc:return i*t*4/s.components*s.byteLength;case fa:case pa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ma:case ga:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case fo:case mo:return Math.max(i,16)*Math.max(t,8)/4;case uo:case po:return Math.max(i,8)*Math.max(t,8)/2;case go:case _o:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case xo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case vo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Mo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case yo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case So:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case bo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Eo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case wo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case To:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ao:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ro:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Co:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Po:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Do:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Lo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case _a:case Io:case ko:return Math.ceil(i/4)*Math.ceil(t/4)*16;case bd:case Uo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Fo:case No:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Ex(i){switch(i){case Hn:case pd:return{byteLength:1,components:1};case ws:case md:case As:return{byteLength:2,components:1};case tc:case ec:return{byteLength:2,components:4};case Si:case Qo:case zn:return{byteLength:4,components:1};case gd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function wx(i,t,e,n,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new jt,h=new WeakMap;let p;const u=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(T,y){return d?new OffscreenCanvas(T,y):Da("canvas")}function _(T,y,B){let tt=1;const st=mt(T);if((st.width>B||st.height>B)&&(tt=B/Math.max(st.width,st.height)),tt<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const nt=Math.floor(tt*st.width),X=Math.floor(tt*st.height);p===void 0&&(p=m(nt,X));const rt=y?m(nt,X):p;return rt.width=nt,rt.height=X,rt.getContext("2d").drawImage(T,0,0,nt,X),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+nt+"x"+X+")."),rt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),T;return T}function g(T){return T.generateMipmaps}function f(T){i.generateMipmap(T)}function x(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(T,y,B,tt,st=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let nt=y;if(y===i.RED&&(B===i.FLOAT&&(nt=i.R32F),B===i.HALF_FLOAT&&(nt=i.R16F),B===i.UNSIGNED_BYTE&&(nt=i.R8)),y===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(nt=i.R8UI),B===i.UNSIGNED_SHORT&&(nt=i.R16UI),B===i.UNSIGNED_INT&&(nt=i.R32UI),B===i.BYTE&&(nt=i.R8I),B===i.SHORT&&(nt=i.R16I),B===i.INT&&(nt=i.R32I)),y===i.RG&&(B===i.FLOAT&&(nt=i.RG32F),B===i.HALF_FLOAT&&(nt=i.RG16F),B===i.UNSIGNED_BYTE&&(nt=i.RG8)),y===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(nt=i.RG8UI),B===i.UNSIGNED_SHORT&&(nt=i.RG16UI),B===i.UNSIGNED_INT&&(nt=i.RG32UI),B===i.BYTE&&(nt=i.RG8I),B===i.SHORT&&(nt=i.RG16I),B===i.INT&&(nt=i.RG32I)),y===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(nt=i.RGB8UI),B===i.UNSIGNED_SHORT&&(nt=i.RGB16UI),B===i.UNSIGNED_INT&&(nt=i.RGB32UI),B===i.BYTE&&(nt=i.RGB8I),B===i.SHORT&&(nt=i.RGB16I),B===i.INT&&(nt=i.RGB32I)),y===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(nt=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(nt=i.RGBA16UI),B===i.UNSIGNED_INT&&(nt=i.RGBA32UI),B===i.BYTE&&(nt=i.RGBA8I),B===i.SHORT&&(nt=i.RGBA16I),B===i.INT&&(nt=i.RGBA32I)),y===i.RGB&&B===i.UNSIGNED_INT_5_9_9_9_REV&&(nt=i.RGB9_E5),y===i.RGBA){const X=st?za:ie.getTransfer(tt);B===i.FLOAT&&(nt=i.RGBA32F),B===i.HALF_FLOAT&&(nt=i.RGBA16F),B===i.UNSIGNED_BYTE&&(nt=X===le?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(nt=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(nt=i.RGB5_A1)}return(nt===i.R16F||nt===i.R32F||nt===i.RG16F||nt===i.RG32F||nt===i.RGBA16F||nt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function v(T,y){let B;return T?y===null||y===Si||y===ns?B=i.DEPTH24_STENCIL8:y===zn?B=i.DEPTH32F_STENCIL8:y===ws&&(B=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Si||y===ns?B=i.DEPTH_COMPONENT24:y===zn?B=i.DEPTH_COMPONENT32F:y===ws&&(B=i.DEPTH_COMPONENT16),B}function L(T,y){return g(T)===!0||T.isFramebufferTexture&&T.minFilter!==_n&&T.minFilter!==Tn?Math.log2(Math.max(y.width,y.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?y.mipmaps.length:1}function w(T){const y=T.target;y.removeEventListener("dispose",w),D(y),y.isVideoTexture&&h.delete(y)}function A(T){const y=T.target;y.removeEventListener("dispose",A),S(y)}function D(T){const y=n.get(T);if(y.__webglInit===void 0)return;const B=T.source,tt=u.get(B);if(tt){const st=tt[y.__cacheKey];st.usedTimes--,st.usedTimes===0&&E(T),Object.keys(tt).length===0&&u.delete(B)}n.remove(T)}function E(T){const y=n.get(T);i.deleteTexture(y.__webglTexture);const B=T.source,tt=u.get(B);delete tt[y.__cacheKey],r.memory.textures--}function S(T){const y=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(y.__webglFramebuffer[tt]))for(let st=0;st<y.__webglFramebuffer[tt].length;st++)i.deleteFramebuffer(y.__webglFramebuffer[tt][st]);else i.deleteFramebuffer(y.__webglFramebuffer[tt]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[tt])}else{if(Array.isArray(y.__webglFramebuffer))for(let tt=0;tt<y.__webglFramebuffer.length;tt++)i.deleteFramebuffer(y.__webglFramebuffer[tt]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let tt=0;tt<y.__webglColorRenderbuffer.length;tt++)y.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[tt]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const B=T.textures;for(let tt=0,st=B.length;tt<st;tt++){const nt=n.get(B[tt]);nt.__webglTexture&&(i.deleteTexture(nt.__webglTexture),r.memory.textures--),n.remove(B[tt])}n.remove(T)}let C=0;function N(){C=0}function F(){const T=C;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),C+=1,T}function G(T){const y=[];return y.push(T.wrapS),y.push(T.wrapT),y.push(T.wrapR||0),y.push(T.magFilter),y.push(T.minFilter),y.push(T.anisotropy),y.push(T.internalFormat),y.push(T.format),y.push(T.type),y.push(T.generateMipmaps),y.push(T.premultiplyAlpha),y.push(T.flipY),y.push(T.unpackAlignment),y.push(T.colorSpace),y.join()}function P(T,y){const B=n.get(T);if(T.isVideoTexture&&Z(T),T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){const tt=T.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(B,T,y);return}}e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+y)}function R(T,y){const B=n.get(T);if(T.version>0&&B.__version!==T.version){q(B,T,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+y)}function $(T,y){const B=n.get(T);if(T.version>0&&B.__version!==T.version){q(B,T,y);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+y)}function z(T,y){const B=n.get(T);if(T.version>0&&B.__version!==T.version){Q(B,T,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+y)}const V={[lo]:i.REPEAT,[xi]:i.CLAMP_TO_EDGE,[ho]:i.MIRRORED_REPEAT},J={[_n]:i.NEAREST,[up]:i.NEAREST_MIPMAP_NEAREST,[Us]:i.NEAREST_MIPMAP_LINEAR,[Tn]:i.LINEAR,[ir]:i.LINEAR_MIPMAP_NEAREST,[vi]:i.LINEAR_MIPMAP_LINEAR},pt={[gp]:i.NEVER,[Sp]:i.ALWAYS,[_p]:i.LESS,[wd]:i.LEQUAL,[xp]:i.EQUAL,[yp]:i.GEQUAL,[vp]:i.GREATER,[Mp]:i.NOTEQUAL};function ct(T,y){if(y.type===zn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Tn||y.magFilter===ir||y.magFilter===Us||y.magFilter===vi||y.minFilter===Tn||y.minFilter===ir||y.minFilter===Us||y.minFilter===vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,V[y.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,V[y.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,V[y.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,J[y.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,J[y.minFilter]),y.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,pt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===_n||y.minFilter!==Us&&y.minFilter!==vi||y.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function lt(T,y){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,y.addEventListener("dispose",w));const tt=y.source;let st=u.get(tt);st===void 0&&(st={},u.set(tt,st));const nt=G(y);if(nt!==T.__cacheKey){st[nt]===void 0&&(st[nt]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,B=!0),st[nt].usedTimes++;const X=st[T.__cacheKey];X!==void 0&&(st[T.__cacheKey].usedTimes--,X.usedTimes===0&&E(y)),T.__cacheKey=nt,T.__webglTexture=st[nt].texture}return B}function q(T,y,B){let tt=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(tt=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(tt=i.TEXTURE_3D);const st=lt(T,y),nt=y.source;e.bindTexture(tt,T.__webglTexture,i.TEXTURE0+B);const X=n.get(nt);if(nt.version!==X.__version||st===!0){e.activeTexture(i.TEXTURE0+B);const rt=ie.getPrimaries(ie.workingColorSpace),_t=y.colorSpace===jn?null:ie.getPrimaries(y.colorSpace),Tt=y.colorSpace===jn||rt===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);let ft=_(y.image,!1,s.maxTextureSize);ft=ut(y,ft);const gt=a.convert(y.format,y.colorSpace),O=a.convert(y.type);let ot=M(y.internalFormat,gt,O,y.colorSpace,y.isVideoTexture);ct(tt,y);let dt;const Ut=y.mipmaps,Ft=y.isVideoTexture!==!0,Gt=X.__version===void 0||st===!0,I=nt.dataReady,yt=L(y,ft);if(y.isDepthTexture)ot=v(y.format===is,y.type),Gt&&(Ft?e.texStorage2D(i.TEXTURE_2D,1,ot,ft.width,ft.height):e.texImage2D(i.TEXTURE_2D,0,ot,ft.width,ft.height,0,gt,O,null));else if(y.isDataTexture)if(Ut.length>0){Ft&&Gt&&e.texStorage2D(i.TEXTURE_2D,yt,ot,Ut[0].width,Ut[0].height);for(let j=0,at=Ut.length;j<at;j++)dt=Ut[j],Ft?I&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,dt.width,dt.height,gt,O,dt.data):e.texImage2D(i.TEXTURE_2D,j,ot,dt.width,dt.height,0,gt,O,dt.data);y.generateMipmaps=!1}else Ft?(Gt&&e.texStorage2D(i.TEXTURE_2D,yt,ot,ft.width,ft.height),I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ft.width,ft.height,gt,O,ft.data)):e.texImage2D(i.TEXTURE_2D,0,ot,ft.width,ft.height,0,gt,O,ft.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Ft&&Gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,yt,ot,Ut[0].width,Ut[0].height,ft.depth);for(let j=0,at=Ut.length;j<at;j++)if(dt=Ut[j],y.format!==gn)if(gt!==null)if(Ft){if(I)if(y.layerUpdates.size>0){const St=Bl(dt.width,dt.height,y.format,y.type);for(const xt of y.layerUpdates){const Bt=dt.data.subarray(xt*St/dt.data.BYTES_PER_ELEMENT,(xt+1)*St/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,xt,dt.width,dt.height,1,gt,Bt)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,dt.width,dt.height,ft.depth,gt,dt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,ot,dt.width,dt.height,ft.depth,0,dt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?I&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,dt.width,dt.height,ft.depth,gt,O,dt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,ot,dt.width,dt.height,ft.depth,0,gt,O,dt.data)}else{Ft&&Gt&&e.texStorage2D(i.TEXTURE_2D,yt,ot,Ut[0].width,Ut[0].height);for(let j=0,at=Ut.length;j<at;j++)dt=Ut[j],y.format!==gn?gt!==null?Ft?I&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,dt.width,dt.height,gt,dt.data):e.compressedTexImage2D(i.TEXTURE_2D,j,ot,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?I&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,dt.width,dt.height,gt,O,dt.data):e.texImage2D(i.TEXTURE_2D,j,ot,dt.width,dt.height,0,gt,O,dt.data)}else if(y.isDataArrayTexture)if(Ft){if(Gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,yt,ot,ft.width,ft.height,ft.depth),I)if(y.layerUpdates.size>0){const j=Bl(ft.width,ft.height,y.format,y.type);for(const at of y.layerUpdates){const St=ft.data.subarray(at*j/ft.data.BYTES_PER_ELEMENT,(at+1)*j/ft.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,at,ft.width,ft.height,1,gt,O,St)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ft.width,ft.height,ft.depth,gt,O,ft.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,ot,ft.width,ft.height,ft.depth,0,gt,O,ft.data);else if(y.isData3DTexture)Ft?(Gt&&e.texStorage3D(i.TEXTURE_3D,yt,ot,ft.width,ft.height,ft.depth),I&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ft.width,ft.height,ft.depth,gt,O,ft.data)):e.texImage3D(i.TEXTURE_3D,0,ot,ft.width,ft.height,ft.depth,0,gt,O,ft.data);else if(y.isFramebufferTexture){if(Gt)if(Ft)e.texStorage2D(i.TEXTURE_2D,yt,ot,ft.width,ft.height);else{let j=ft.width,at=ft.height;for(let St=0;St<yt;St++)e.texImage2D(i.TEXTURE_2D,St,ot,j,at,0,gt,O,null),j>>=1,at>>=1}}else if(Ut.length>0){if(Ft&&Gt){const j=mt(Ut[0]);e.texStorage2D(i.TEXTURE_2D,yt,ot,j.width,j.height)}for(let j=0,at=Ut.length;j<at;j++)dt=Ut[j],Ft?I&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,gt,O,dt):e.texImage2D(i.TEXTURE_2D,j,ot,gt,O,dt);y.generateMipmaps=!1}else if(Ft){if(Gt){const j=mt(ft);e.texStorage2D(i.TEXTURE_2D,yt,ot,j.width,j.height)}I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,gt,O,ft)}else e.texImage2D(i.TEXTURE_2D,0,ot,gt,O,ft);g(y)&&f(tt),X.__version=nt.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function Q(T,y,B){if(y.image.length!==6)return;const tt=lt(T,y),st=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+B);const nt=n.get(st);if(st.version!==nt.__version||tt===!0){e.activeTexture(i.TEXTURE0+B);const X=ie.getPrimaries(ie.workingColorSpace),rt=y.colorSpace===jn?null:ie.getPrimaries(y.colorSpace),_t=y.colorSpace===jn||X===rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const Tt=y.isCompressedTexture||y.image[0].isCompressedTexture,ft=y.image[0]&&y.image[0].isDataTexture,gt=[];for(let at=0;at<6;at++)!Tt&&!ft?gt[at]=_(y.image[at],!0,s.maxCubemapSize):gt[at]=ft?y.image[at].image:y.image[at],gt[at]=ut(y,gt[at]);const O=gt[0],ot=a.convert(y.format,y.colorSpace),dt=a.convert(y.type),Ut=M(y.internalFormat,ot,dt,y.colorSpace),Ft=y.isVideoTexture!==!0,Gt=nt.__version===void 0||tt===!0,I=st.dataReady;let yt=L(y,O);ct(i.TEXTURE_CUBE_MAP,y);let j;if(Tt){Ft&&Gt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,yt,Ut,O.width,O.height);for(let at=0;at<6;at++){j=gt[at].mipmaps;for(let St=0;St<j.length;St++){const xt=j[St];y.format!==gn?ot!==null?Ft?I&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,St,0,0,xt.width,xt.height,ot,xt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,St,Ut,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,St,0,0,xt.width,xt.height,ot,dt,xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,St,Ut,xt.width,xt.height,0,ot,dt,xt.data)}}}else{if(j=y.mipmaps,Ft&&Gt){j.length>0&&yt++;const at=mt(gt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,yt,Ut,at.width,at.height)}for(let at=0;at<6;at++)if(ft){Ft?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,gt[at].width,gt[at].height,ot,dt,gt[at].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Ut,gt[at].width,gt[at].height,0,ot,dt,gt[at].data);for(let St=0;St<j.length;St++){const Bt=j[St].image[at].image;Ft?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,St+1,0,0,Bt.width,Bt.height,ot,dt,Bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,St+1,Ut,Bt.width,Bt.height,0,ot,dt,Bt.data)}}else{Ft?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,ot,dt,gt[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Ut,ot,dt,gt[at]);for(let St=0;St<j.length;St++){const xt=j[St];Ft?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,St+1,0,0,ot,dt,xt.image[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,St+1,Ut,ot,dt,xt.image[at])}}}g(y)&&f(i.TEXTURE_CUBE_MAP),nt.__version=st.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function ht(T,y,B,tt,st,nt){const X=a.convert(B.format,B.colorSpace),rt=a.convert(B.type),_t=M(B.internalFormat,X,rt,B.colorSpace),Tt=n.get(y),ft=n.get(B);if(ft.__renderTarget=y,!Tt.__hasExternalTextures){const gt=Math.max(1,y.width>>nt),O=Math.max(1,y.height>>nt);st===i.TEXTURE_3D||st===i.TEXTURE_2D_ARRAY?e.texImage3D(st,nt,_t,gt,O,y.depth,0,X,rt,null):e.texImage2D(st,nt,_t,gt,O,0,X,rt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),It(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,st,ft.__webglTexture,0,Pt(y)):(st===i.TEXTURE_2D||st>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,tt,st,ft.__webglTexture,nt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function it(T,y,B){if(i.bindRenderbuffer(i.RENDERBUFFER,T),y.depthBuffer){const tt=y.depthTexture,st=tt&&tt.isDepthTexture?tt.type:null,nt=v(y.stencilBuffer,st),X=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=Pt(y);It(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,nt,y.width,y.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,nt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,nt,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,T)}else{const tt=y.textures;for(let st=0;st<tt.length;st++){const nt=tt[st],X=a.convert(nt.format,nt.colorSpace),rt=a.convert(nt.type),_t=M(nt.internalFormat,X,rt,nt.colorSpace),Tt=Pt(y);B&&It(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt,_t,y.width,y.height):It(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Tt,_t,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,_t,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function vt(T,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const tt=n.get(y.depthTexture);tt.__renderTarget=y,(!tt.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),P(y.depthTexture,0);const st=tt.__webglTexture,nt=Pt(y);if(y.depthTexture.format===Ki)It(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0,nt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0);else if(y.depthTexture.format===is)It(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0,nt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function Et(T){const y=n.get(T),B=T.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==T.depthTexture){const tt=T.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),tt){const st=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,tt.removeEventListener("dispose",st)};tt.addEventListener("dispose",st),y.__depthDisposeCallback=st}y.__boundDepthTexture=tt}if(T.depthTexture&&!y.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");vt(y.__webglFramebuffer,T)}else if(B){y.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[tt]),y.__webglDepthbuffer[tt]===void 0)y.__webglDepthbuffer[tt]=i.createRenderbuffer(),it(y.__webglDepthbuffer[tt],T,!1);else{const st=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=y.__webglDepthbuffer[tt];i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,nt)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),it(y.__webglDepthbuffer,T,!1);else{const tt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,st=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,st),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,st)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Dt(T,y,B){const tt=n.get(T);y!==void 0&&ht(tt.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Et(T)}function Ht(T){const y=T.texture,B=n.get(T),tt=n.get(y);T.addEventListener("dispose",A);const st=T.textures,nt=T.isWebGLCubeRenderTarget===!0,X=st.length>1;if(X||(tt.__webglTexture===void 0&&(tt.__webglTexture=i.createTexture()),tt.__version=y.version,r.memory.textures++),nt){B.__webglFramebuffer=[];for(let rt=0;rt<6;rt++)if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer[rt]=[];for(let _t=0;_t<y.mipmaps.length;_t++)B.__webglFramebuffer[rt][_t]=i.createFramebuffer()}else B.__webglFramebuffer[rt]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer=[];for(let rt=0;rt<y.mipmaps.length;rt++)B.__webglFramebuffer[rt]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(X)for(let rt=0,_t=st.length;rt<_t;rt++){const Tt=n.get(st[rt]);Tt.__webglTexture===void 0&&(Tt.__webglTexture=i.createTexture(),r.memory.textures++)}if(T.samples>0&&It(T)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let rt=0;rt<st.length;rt++){const _t=st[rt];B.__webglColorRenderbuffer[rt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[rt]);const Tt=a.convert(_t.format,_t.colorSpace),ft=a.convert(_t.type),gt=M(_t.internalFormat,Tt,ft,_t.colorSpace,T.isXRRenderTarget===!0),O=Pt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,O,gt,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+rt,i.RENDERBUFFER,B.__webglColorRenderbuffer[rt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),it(B.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(nt){e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),ct(i.TEXTURE_CUBE_MAP,y);for(let rt=0;rt<6;rt++)if(y.mipmaps&&y.mipmaps.length>0)for(let _t=0;_t<y.mipmaps.length;_t++)ht(B.__webglFramebuffer[rt][_t],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,_t);else ht(B.__webglFramebuffer[rt],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0);g(y)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(X){for(let rt=0,_t=st.length;rt<_t;rt++){const Tt=st[rt],ft=n.get(Tt);e.bindTexture(i.TEXTURE_2D,ft.__webglTexture),ct(i.TEXTURE_2D,Tt),ht(B.__webglFramebuffer,T,Tt,i.COLOR_ATTACHMENT0+rt,i.TEXTURE_2D,0),g(Tt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let rt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(rt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(rt,tt.__webglTexture),ct(rt,y),y.mipmaps&&y.mipmaps.length>0)for(let _t=0;_t<y.mipmaps.length;_t++)ht(B.__webglFramebuffer[_t],T,y,i.COLOR_ATTACHMENT0,rt,_t);else ht(B.__webglFramebuffer,T,y,i.COLOR_ATTACHMENT0,rt,0);g(y)&&f(rt),e.unbindTexture()}T.depthBuffer&&Et(T)}function Ct(T){const y=T.textures;for(let B=0,tt=y.length;B<tt;B++){const st=y[B];if(g(st)){const nt=x(T),X=n.get(st).__webglTexture;e.bindTexture(nt,X),f(nt),e.unbindTexture()}}}const Lt=[],U=[];function Yt(T){if(T.samples>0){if(It(T)===!1){const y=T.textures,B=T.width,tt=T.height;let st=i.COLOR_BUFFER_BIT;const nt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=n.get(T),rt=y.length>1;if(rt)for(let _t=0;_t<y.length;_t++)e.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,X.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,X.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,X.__webglFramebuffer);for(let _t=0;_t<y.length;_t++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(st|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(st|=i.STENCIL_BUFFER_BIT)),rt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,X.__webglColorRenderbuffer[_t]);const Tt=n.get(y[_t]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Tt,0)}i.blitFramebuffer(0,0,B,tt,0,0,B,tt,st,i.NEAREST),c===!0&&(Lt.length=0,U.length=0,Lt.push(i.COLOR_ATTACHMENT0+_t),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Lt.push(nt),U.push(nt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,U)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Lt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),rt)for(let _t=0;_t<y.length;_t++){e.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,X.__webglColorRenderbuffer[_t]);const Tt=n.get(y[_t]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,X.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,Tt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,X.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function Pt(T){return Math.min(s.maxSamples,T.samples)}function It(T){const y=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Z(T){const y=r.render.frame;h.get(T)!==y&&(h.set(T,y),T.update())}function ut(T,y){const B=T.colorSpace,tt=T.format,st=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==as&&B!==jn&&(ie.getTransfer(B)===le?(tt!==gn||st!==Hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),y}function mt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=N,this.setTexture2D=P,this.setTexture2DArray=R,this.setTexture3D=$,this.setTextureCube=z,this.rebindTextures=Dt,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=Ct,this.updateMultisampleRenderTarget=Yt,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=It}function Tx(i,t){function e(n,s=jn){let a;const r=ie.getTransfer(s);if(n===Hn)return i.UNSIGNED_BYTE;if(n===tc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ec)return i.UNSIGNED_SHORT_5_5_5_1;if(n===gd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===pd)return i.BYTE;if(n===md)return i.SHORT;if(n===ws)return i.UNSIGNED_SHORT;if(n===Qo)return i.INT;if(n===Si)return i.UNSIGNED_INT;if(n===zn)return i.FLOAT;if(n===As)return i.HALF_FLOAT;if(n===_d)return i.ALPHA;if(n===xd)return i.RGB;if(n===gn)return i.RGBA;if(n===vd)return i.LUMINANCE;if(n===Md)return i.LUMINANCE_ALPHA;if(n===Ki)return i.DEPTH_COMPONENT;if(n===is)return i.DEPTH_STENCIL;if(n===yd)return i.RED;if(n===nc)return i.RED_INTEGER;if(n===Sd)return i.RG;if(n===ic)return i.RG_INTEGER;if(n===sc)return i.RGBA_INTEGER;if(n===fa||n===pa||n===ma||n===ga)if(r===le)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===fa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===pa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ma)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ga)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===fa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===pa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ma)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ga)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===uo||n===fo||n===po||n===mo)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===uo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===fo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===po)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===mo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===go||n===_o||n===xo)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===go||n===_o)return r===le?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===xo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===vo||n===Mo||n===yo||n===So||n===bo||n===Eo||n===wo||n===To||n===Ao||n===Ro||n===Co||n===Po||n===Do||n===Lo)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===vo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Mo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===yo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===So)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===bo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Eo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===wo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===To)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ao)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ro)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Co)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Po)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Do)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Lo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===_a||n===Io||n===ko)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===_a)return r===le?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Io)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ko)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===bd||n===Uo||n===Fo||n===No)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===_a)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Uo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Fo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===No)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ns?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Ax extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Pe extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Rx={type:"move"};class Dr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,n),f=this._getHandJoint(l,_);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}const h=l.joints["index-finger-tip"],p=l.joints["thumb-tip"],u=h.position.distanceTo(p.position),d=.02,m=.005;l.inputState.pinching&&u>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Rx)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Pe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Cx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Px=`
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

}`;class Dx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Xe,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new ni({vertexShader:Cx,fragmentShader:Px,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ue(new Ba(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Lx extends rs{constructor(t,e){super();const n=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,p=null,u=null,d=null,m=null;const _=new Dx,g=e.getContextAttributes();let f=null,x=null;const M=[],v=[],L=new jt;let w=null;const A=new rn;A.viewport=new ye;const D=new rn;D.viewport=new ye;const E=[A,D],S=new Ax;let C=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Q=M[q];return Q===void 0&&(Q=new Dr,M[q]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(q){let Q=M[q];return Q===void 0&&(Q=new Dr,M[q]=Q),Q.getGripSpace()},this.getHand=function(q){let Q=M[q];return Q===void 0&&(Q=new Dr,M[q]=Q),Q.getHandSpace()};function F(q){const Q=v.indexOf(q.inputSource);if(Q===-1)return;const ht=M[Q];ht!==void 0&&(ht.update(q.inputSource,q.frame,l||r),ht.dispatchEvent({type:q.type,data:q.inputSource}))}function G(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",P);for(let q=0;q<M.length;q++){const Q=v[q];Q!==null&&(v[q]=null,M[q].disconnect(Q))}C=null,N=null,_.reset(),t.setRenderTarget(f),d=null,u=null,p=null,s=null,x=null,lt.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return p},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",G),s.addEventListener("inputsourceschange",P),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const Q={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,e,Q),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new bi(d.framebufferWidth,d.framebufferHeight,{format:gn,type:Hn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let Q=null,ht=null,it=null;g.depth&&(it=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=g.stencil?is:Ki,ht=g.stencil?ns:Si);const vt={colorFormat:e.RGBA8,depthFormat:it,scaleFactor:a};p=new XRWebGLBinding(s,e),u=p.createProjectionLayer(vt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),x=new bi(u.textureWidth,u.textureHeight,{format:gn,type:Hn,depthTexture:new Nd(u.textureWidth,u.textureHeight,ht,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),lt.setContext(s),lt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function P(q){for(let Q=0;Q<q.removed.length;Q++){const ht=q.removed[Q],it=v.indexOf(ht);it>=0&&(v[it]=null,M[it].disconnect(ht))}for(let Q=0;Q<q.added.length;Q++){const ht=q.added[Q];let it=v.indexOf(ht);if(it===-1){for(let Et=0;Et<M.length;Et++)if(Et>=v.length){v.push(ht),it=Et;break}else if(v[Et]===null){v[Et]=ht,it=Et;break}if(it===-1)break}const vt=M[it];vt&&vt.connect(ht)}}const R=new W,$=new W;function z(q,Q,ht){R.setFromMatrixPosition(Q.matrixWorld),$.setFromMatrixPosition(ht.matrixWorld);const it=R.distanceTo($),vt=Q.projectionMatrix.elements,Et=ht.projectionMatrix.elements,Dt=vt[14]/(vt[10]-1),Ht=vt[14]/(vt[10]+1),Ct=(vt[9]+1)/vt[5],Lt=(vt[9]-1)/vt[5],U=(vt[8]-1)/vt[0],Yt=(Et[8]+1)/Et[0],Pt=Dt*U,It=Dt*Yt,Z=it/(-U+Yt),ut=Z*-U;if(Q.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(ut),q.translateZ(Z),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),vt[10]===-1)q.projectionMatrix.copy(Q.projectionMatrix),q.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const mt=Dt+Z,T=Ht+Z,y=Pt-ut,B=It+(it-ut),tt=Ct*Ht/T*mt,st=Lt*Ht/T*mt;q.projectionMatrix.makePerspective(y,B,tt,st,mt,T),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function V(q,Q){Q===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Q.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let Q=q.near,ht=q.far;_.texture!==null&&(_.depthNear>0&&(Q=_.depthNear),_.depthFar>0&&(ht=_.depthFar)),S.near=D.near=A.near=Q,S.far=D.far=A.far=ht,(C!==S.near||N!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),C=S.near,N=S.far),A.layers.mask=q.layers.mask|2,D.layers.mask=q.layers.mask|4,S.layers.mask=A.layers.mask|D.layers.mask;const it=q.parent,vt=S.cameras;V(S,it);for(let Et=0;Et<vt.length;Et++)V(vt[Et],it);vt.length===2?z(S,A,D):S.projectionMatrix.copy(A.projectionMatrix),J(q,S,it)};function J(q,Q,ht){ht===null?q.matrix.copy(Q.matrixWorld):(q.matrix.copy(ht.matrixWorld),q.matrix.invert(),q.matrix.multiply(Q.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Q.projectionMatrix),q.projectionMatrixInverse.copy(Q.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Oo*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(u===null&&d===null))return c},this.setFoveation=function(q){c=q,u!==null&&(u.fixedFoveation=q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=q)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(S)};let pt=null;function ct(q,Q){if(h=Q.getViewerPose(l||r),m=Q,h!==null){const ht=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let it=!1;ht.length!==S.cameras.length&&(S.cameras.length=0,it=!0);for(let Et=0;Et<ht.length;Et++){const Dt=ht[Et];let Ht=null;if(d!==null)Ht=d.getViewport(Dt);else{const Lt=p.getViewSubImage(u,Dt);Ht=Lt.viewport,Et===0&&(t.setRenderTargetTextures(x,Lt.colorTexture,u.ignoreDepthValues?void 0:Lt.depthStencilTexture),t.setRenderTarget(x))}let Ct=E[Et];Ct===void 0&&(Ct=new rn,Ct.layers.enable(Et),Ct.viewport=new ye,E[Et]=Ct),Ct.matrix.fromArray(Dt.transform.matrix),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.projectionMatrix.fromArray(Dt.projectionMatrix),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert(),Ct.viewport.set(Ht.x,Ht.y,Ht.width,Ht.height),Et===0&&(S.matrix.copy(Ct.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),it===!0&&S.cameras.push(Ct)}const vt=s.enabledFeatures;if(vt&&vt.includes("depth-sensing")){const Et=p.getDepthInformation(ht[0]);Et&&Et.isValid&&Et.texture&&_.init(t,Et,s.renderState)}}for(let ht=0;ht<M.length;ht++){const it=v[ht],vt=M[ht];it!==null&&vt!==void 0&&vt.update(it,Q,l||r)}pt&&pt(q,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),m=null}const lt=new Ud;lt.setAnimationLoop(ct),this.setAnimationLoop=function(q){pt=q},this.dispose=function(){}}}const hi=new Cn,Ix=new fe;function kx(i,t){function e(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function n(g,f){f.color.getRGB(g.fogColor.value,Ld(i)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,x,M,v){f.isMeshBasicMaterial||f.isMeshLambertMaterial?a(g,f):f.isMeshToonMaterial?(a(g,f),p(g,f)):f.isMeshPhongMaterial?(a(g,f),h(g,f)):f.isMeshStandardMaterial?(a(g,f),u(g,f),f.isMeshPhysicalMaterial&&d(g,f,v)):f.isMeshMatcapMaterial?(a(g,f),m(g,f)):f.isMeshDepthMaterial?a(g,f):f.isMeshDistanceMaterial?(a(g,f),_(g,f)):f.isMeshNormalMaterial?a(g,f):f.isLineBasicMaterial?(r(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?c(g,f,x,M):f.isSpriteMaterial?l(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function a(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,e(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===qe&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,e(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===qe&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,e(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,e(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);const x=t.get(f),M=x.envMap,v=x.envMapRotation;M&&(g.envMap.value=M,hi.copy(v),hi.x*=-1,hi.y*=-1,hi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),g.envMapRotation.value.setFromMatrix4(Ix.makeRotationFromEuler(hi)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,g.aoMapTransform))}function r(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function c(g,f,x,M){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*x,g.scale.value=M*.5,f.map&&(g.map.value=f.map,e(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function l(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,e(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,e(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function h(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function p(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function u(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function d(g,f,x){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===qe&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,f){f.matcap&&(g.matcap.value=f.matcap)}function _(g,f){const x=t.get(f).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Ux(i,t,e,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,M){const v=M.program;n.uniformBlockBinding(x,v)}function l(x,M){let v=s[x.id];v===void 0&&(m(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",g));const L=M.program;n.updateUBOMapping(x,L);const w=t.render.frame;a[x.id]!==w&&(u(x),a[x.id]=w)}function h(x){const M=p();x.__bindingPointIndex=M;const v=i.createBuffer(),L=x.__size,w=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,L,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,v),v}function p(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const M=s[x.id],v=x.uniforms,L=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let w=0,A=v.length;w<A;w++){const D=Array.isArray(v[w])?v[w]:[v[w]];for(let E=0,S=D.length;E<S;E++){const C=D[E];if(d(C,w,E,L)===!0){const N=C.__offset,F=Array.isArray(C.value)?C.value:[C.value];let G=0;for(let P=0;P<F.length;P++){const R=F[P],$=_(R);typeof R=="number"||typeof R=="boolean"?(C.__data[0]=R,i.bufferSubData(i.UNIFORM_BUFFER,N+G,C.__data)):R.isMatrix3?(C.__data[0]=R.elements[0],C.__data[1]=R.elements[1],C.__data[2]=R.elements[2],C.__data[3]=0,C.__data[4]=R.elements[3],C.__data[5]=R.elements[4],C.__data[6]=R.elements[5],C.__data[7]=0,C.__data[8]=R.elements[6],C.__data[9]=R.elements[7],C.__data[10]=R.elements[8],C.__data[11]=0):(R.toArray(C.__data,G),G+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(x,M,v,L){const w=x.value,A=M+"_"+v;if(L[A]===void 0)return typeof w=="number"||typeof w=="boolean"?L[A]=w:L[A]=w.clone(),!0;{const D=L[A];if(typeof w=="number"||typeof w=="boolean"){if(D!==w)return L[A]=w,!0}else if(D.equals(w)===!1)return D.copy(w),!0}return!1}function m(x){const M=x.uniforms;let v=0;const L=16;for(let A=0,D=M.length;A<D;A++){const E=Array.isArray(M[A])?M[A]:[M[A]];for(let S=0,C=E.length;S<C;S++){const N=E[S],F=Array.isArray(N.value)?N.value:[N.value];for(let G=0,P=F.length;G<P;G++){const R=F[G],$=_(R),z=v%L,V=z%$.boundary,J=z+V;v+=V,J!==0&&L-J<$.storage&&(v+=L-J),N.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=v,v+=$.storage}}}const w=v%L;return w>0&&(v+=L-w),x.__size=v,x.__cache={},this}function _(x){const M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),M}function g(x){const M=x.target;M.removeEventListener("dispose",g);const v=r.indexOf(M.__bindingPointIndex);r.splice(v,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete a[M.id]}function f(){for(const x in s)i.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:f}}class Fx{constructor(t={}){const{canvas:e=Ep(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:p=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,f=null;const x=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=an,this.toneMapping=Qn,this.toneMappingExposure=1;const v=this;let L=!1,w=0,A=0,D=null,E=-1,S=null;const C=new ye,N=new ye;let F=null;const G=new Zt(0);let P=0,R=e.width,$=e.height,z=1,V=null,J=null;const pt=new ye(0,0,R,$),ct=new ye(0,0,R,$);let lt=!1;const q=new oc;let Q=!1,ht=!1;const it=new fe,vt=new fe,Et=new W,Dt=new ye,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ct=!1;function Lt(){return D===null?z:1}let U=n;function Yt(b,k){return e.getContext(b,k)}try{const b={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:p};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ko}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",St,!1),e.addEventListener("webglcontextcreationerror",xt,!1),U===null){const k="webgl2";if(U=Yt(k,b),U===null)throw Yt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Pt,It,Z,ut,mt,T,y,B,tt,st,nt,X,rt,_t,Tt,ft,gt,O,ot,dt,Ut,Ft,Gt,I;function yt(){Pt=new H0(U),Pt.init(),Ft=new Tx(U,Pt),It=new U0(U,Pt,t,Ft),Z=new bx(U,Pt),It.reverseDepthBuffer&&u&&Z.buffers.depth.setReversed(!0),ut=new X0(U),mt=new cx,T=new wx(U,Pt,Z,mt,It,Ft,ut),y=new N0(v),B=new B0(v),tt=new Kp(U),Gt=new I0(U,tt),st=new G0(U,tt,ut,Gt),nt=new $0(U,st,tt,ut),ot=new W0(U,It,T),ft=new F0(mt),X=new ox(v,y,B,Pt,It,Gt,ft),rt=new kx(v,mt),_t=new dx,Tt=new gx(Pt),O=new L0(v,y,B,Z,nt,d,c),gt=new yx(v,nt,It),I=new Ux(U,ut,It,Z),dt=new k0(U,Pt,ut),Ut=new V0(U,Pt,ut),ut.programs=X.programs,v.capabilities=It,v.extensions=Pt,v.properties=mt,v.renderLists=_t,v.shadowMap=gt,v.state=Z,v.info=ut}yt();const j=new Lx(v,U);this.xr=j,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const b=Pt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Pt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(b){b!==void 0&&(z=b,this.setSize(R,$,!1))},this.getSize=function(b){return b.set(R,$)},this.setSize=function(b,k,Y=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}R=b,$=k,e.width=Math.floor(b*z),e.height=Math.floor(k*z),Y===!0&&(e.style.width=b+"px",e.style.height=k+"px"),this.setViewport(0,0,b,k)},this.getDrawingBufferSize=function(b){return b.set(R*z,$*z).floor()},this.setDrawingBufferSize=function(b,k,Y){R=b,$=k,z=Y,e.width=Math.floor(b*Y),e.height=Math.floor(k*Y),this.setViewport(0,0,b,k)},this.getCurrentViewport=function(b){return b.copy(C)},this.getViewport=function(b){return b.copy(pt)},this.setViewport=function(b,k,Y,K){b.isVector4?pt.set(b.x,b.y,b.z,b.w):pt.set(b,k,Y,K),Z.viewport(C.copy(pt).multiplyScalar(z).round())},this.getScissor=function(b){return b.copy(ct)},this.setScissor=function(b,k,Y,K){b.isVector4?ct.set(b.x,b.y,b.z,b.w):ct.set(b,k,Y,K),Z.scissor(N.copy(ct).multiplyScalar(z).round())},this.getScissorTest=function(){return lt},this.setScissorTest=function(b){Z.setScissorTest(lt=b)},this.setOpaqueSort=function(b){V=b},this.setTransparentSort=function(b){J=b},this.getClearColor=function(b){return b.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(b=!0,k=!0,Y=!0){let K=0;if(b){let H=!1;if(D!==null){const Mt=D.texture.format;H=Mt===sc||Mt===ic||Mt===nc}if(H){const Mt=D.texture.type,Rt=Mt===Hn||Mt===Si||Mt===ws||Mt===ns||Mt===tc||Mt===ec,Nt=O.getClearColor(),zt=O.getClearAlpha(),Xt=Nt.r,$t=Nt.g,kt=Nt.b;Rt?(m[0]=Xt,m[1]=$t,m[2]=kt,m[3]=zt,U.clearBufferuiv(U.COLOR,0,m)):(_[0]=Xt,_[1]=$t,_[2]=kt,_[3]=zt,U.clearBufferiv(U.COLOR,0,_))}else K|=U.COLOR_BUFFER_BIT}k&&(K|=U.DEPTH_BUFFER_BIT),Y&&(K|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",St,!1),e.removeEventListener("webglcontextcreationerror",xt,!1),_t.dispose(),Tt.dispose(),mt.dispose(),y.dispose(),B.dispose(),nt.dispose(),Gt.dispose(),I.dispose(),X.dispose(),j.dispose(),j.removeEventListener("sessionstart",en),j.removeEventListener("sessionend",Ke),me.stop()};function at(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function St(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const b=ut.autoReset,k=gt.enabled,Y=gt.autoUpdate,K=gt.needsUpdate,H=gt.type;yt(),ut.autoReset=b,gt.enabled=k,gt.autoUpdate=Y,gt.needsUpdate=K,gt.type=H}function xt(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Bt(b){const k=b.target;k.removeEventListener("dispose",Bt),ee(k)}function ee(b){se(b),mt.remove(b)}function se(b){const k=mt.get(b).programs;k!==void 0&&(k.forEach(function(Y){X.releaseProgram(Y)}),b.isShaderMaterial&&X.releaseShaderCache(b))}this.renderBufferDirect=function(b,k,Y,K,H,Mt){k===null&&(k=Ht);const Rt=H.isMesh&&H.matrixWorld.determinant()<0,Nt=Jt(b,k,Y,K,H);Z.setMaterial(K,Rt);let zt=Y.index,Xt=1;if(K.wireframe===!0){if(zt=st.getWireframeAttribute(Y),zt===void 0)return;Xt=2}const $t=Y.drawRange,kt=Y.attributes.position;let ne=$t.start*Xt,oe=($t.start+$t.count)*Xt;Mt!==null&&(ne=Math.max(ne,Mt.start*Xt),oe=Math.min(oe,(Mt.start+Mt.count)*Xt)),zt!==null?(ne=Math.max(ne,0),oe=Math.min(oe,zt.count)):kt!=null&&(ne=Math.max(ne,0),oe=Math.min(oe,kt.count));const ce=oe-ne;if(ce<0||ce===1/0)return;Gt.setup(H,K,Nt,Y,zt);let De,ae=dt;if(zt!==null&&(De=tt.get(zt),ae=Ut,ae.setIndex(De)),H.isMesh)K.wireframe===!0?(Z.setLineWidth(K.wireframeLinewidth*Lt()),ae.setMode(U.LINES)):ae.setMode(U.TRIANGLES);else if(H.isLine){let Ot=K.linewidth;Ot===void 0&&(Ot=1),Z.setLineWidth(Ot*Lt()),H.isLineSegments?ae.setMode(U.LINES):H.isLineLoop?ae.setMode(U.LINE_LOOP):ae.setMode(U.LINE_STRIP)}else H.isPoints?ae.setMode(U.POINTS):H.isSprite&&ae.setMode(U.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)ae.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Pt.get("WEBGL_multi_draw"))ae.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Ot=H._multiDrawStarts,nn=H._multiDrawCounts,te=H._multiDrawCount,Ne=zt?tt.get(zt).bytesPerElement:1,Gn=mt.get(K).currentProgram.getUniforms();for(let ze=0;ze<te;ze++)Gn.setValue(U,"_gl_DrawID",ze),ae.render(Ot[ze]/Ne,nn[ze])}else if(H.isInstancedMesh)ae.renderInstances(ne,ce,H.count);else if(Y.isInstancedBufferGeometry){const Ot=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,nn=Math.min(Y.instanceCount,Ot);ae.renderInstances(ne,ce,nn)}else ae.render(ne,ce)};function Wt(b,k,Y){b.transparent===!0&&b.side===Ge&&b.forceSinglePass===!1?(b.side=qe,b.needsUpdate=!0,wt(b,k,Y),b.side=ei,b.needsUpdate=!0,wt(b,k,Y),b.side=Ge):wt(b,k,Y)}this.compile=function(b,k,Y=null){Y===null&&(Y=b),f=Tt.get(Y),f.init(k),M.push(f),Y.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(f.pushLight(H),H.castShadow&&f.pushShadow(H))}),b!==Y&&b.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(f.pushLight(H),H.castShadow&&f.pushShadow(H))}),f.setupLights();const K=new Set;return b.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const Mt=H.material;if(Mt)if(Array.isArray(Mt))for(let Rt=0;Rt<Mt.length;Rt++){const Nt=Mt[Rt];Wt(Nt,Y,H),K.add(Nt)}else Wt(Mt,Y,H),K.add(Mt)}),M.pop(),f=null,K},this.compileAsync=function(b,k,Y=null){const K=this.compile(b,k,Y);return new Promise(H=>{function Mt(){if(K.forEach(function(Rt){mt.get(Rt).currentProgram.isReady()&&K.delete(Rt)}),K.size===0){H(b);return}setTimeout(Mt,10)}Pt.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let pe=null;function Se(b){pe&&pe(b)}function en(){me.stop()}function Ke(){me.start()}const me=new Ud;me.setAnimationLoop(Se),typeof self<"u"&&me.setContext(self),this.setAnimationLoop=function(b){pe=b,j.setAnimationLoop(b),b===null?me.stop():me.start()},j.addEventListener("sessionstart",en),j.addEventListener("sessionend",Ke),this.render=function(b,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(k),k=j.getCamera()),b.isScene===!0&&b.onBeforeRender(v,b,k,D),f=Tt.get(b,M.length),f.init(k),M.push(f),vt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),q.setFromProjectionMatrix(vt),ht=this.localClippingEnabled,Q=ft.init(this.clippingPlanes,ht),g=_t.get(b,x.length),g.init(),x.push(g),j.enabled===!0&&j.isPresenting===!0){const Mt=v.xr.getDepthSensingMesh();Mt!==null&&ge(Mt,k,-1/0,v.sortObjects)}ge(b,k,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(V,J),Ct=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,Ct&&O.addToRenderList(g,b),this.info.render.frame++,Q===!0&&ft.beginShadows();const Y=f.state.shadowsArray;gt.render(Y,b,k),Q===!0&&ft.endShadows(),this.info.autoReset===!0&&this.info.reset();const K=g.opaque,H=g.transmissive;if(f.setupLights(),k.isArrayCamera){const Mt=k.cameras;if(H.length>0)for(let Rt=0,Nt=Mt.length;Rt<Nt;Rt++){const zt=Mt[Rt];he(K,H,b,zt)}Ct&&O.render(b);for(let Rt=0,Nt=Mt.length;Rt<Nt;Rt++){const zt=Mt[Rt];Fe(g,b,zt,zt.viewport)}}else H.length>0&&he(K,H,b,k),Ct&&O.render(b),Fe(g,b,k);D!==null&&(T.updateMultisampleRenderTarget(D),T.updateRenderTargetMipmap(D)),b.isScene===!0&&b.onAfterRender(v,b,k),Gt.resetDefaultState(),E=-1,S=null,M.pop(),M.length>0?(f=M[M.length-1],Q===!0&&ft.setGlobalState(v.clippingPlanes,f.state.camera)):f=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function ge(b,k,Y,K){if(b.visible===!1)return;if(b.layers.test(k.layers)){if(b.isGroup)Y=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(k);else if(b.isLight)f.pushLight(b),b.castShadow&&f.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||q.intersectsSprite(b)){K&&Dt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(vt);const Rt=nt.update(b),Nt=b.material;Nt.visible&&g.push(b,Rt,Nt,Y,Dt.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||q.intersectsObject(b))){const Rt=nt.update(b),Nt=b.material;if(K&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Dt.copy(b.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),Dt.copy(Rt.boundingSphere.center)),Dt.applyMatrix4(b.matrixWorld).applyMatrix4(vt)),Array.isArray(Nt)){const zt=Rt.groups;for(let Xt=0,$t=zt.length;Xt<$t;Xt++){const kt=zt[Xt],ne=Nt[kt.materialIndex];ne&&ne.visible&&g.push(b,Rt,ne,Y,Dt.z,kt)}}else Nt.visible&&g.push(b,Rt,Nt,Y,Dt.z,null)}}const Mt=b.children;for(let Rt=0,Nt=Mt.length;Rt<Nt;Rt++)ge(Mt[Rt],k,Y,K)}function Fe(b,k,Y,K){const H=b.opaque,Mt=b.transmissive,Rt=b.transparent;f.setupLightsView(Y),Q===!0&&ft.setGlobalState(v.clippingPlanes,Y),K&&Z.viewport(C.copy(K)),H.length>0&&et(H,k,Y),Mt.length>0&&et(Mt,k,Y),Rt.length>0&&et(Rt,k,Y),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function he(b,k,Y,K){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[K.id]===void 0&&(f.state.transmissionRenderTarget[K.id]=new bi(1,1,{generateMipmaps:!0,type:Pt.has("EXT_color_buffer_half_float")||Pt.has("EXT_color_buffer_float")?As:Hn,minFilter:vi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ie.workingColorSpace}));const Mt=f.state.transmissionRenderTarget[K.id],Rt=K.viewport||C;Mt.setSize(Rt.z,Rt.w);const Nt=v.getRenderTarget();v.setRenderTarget(Mt),v.getClearColor(G),P=v.getClearAlpha(),P<1&&v.setClearColor(16777215,.5),v.clear(),Ct&&O.render(Y);const zt=v.toneMapping;v.toneMapping=Qn;const Xt=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),f.setupLightsView(K),Q===!0&&ft.setGlobalState(v.clippingPlanes,K),et(b,Y,K),T.updateMultisampleRenderTarget(Mt),T.updateRenderTargetMipmap(Mt),Pt.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let kt=0,ne=k.length;kt<ne;kt++){const oe=k[kt],ce=oe.object,De=oe.geometry,ae=oe.material,Ot=oe.group;if(ae.side===Ge&&ce.layers.test(K.layers)){const nn=ae.side;ae.side=qe,ae.needsUpdate=!0,bt(ce,Y,K,De,ae,Ot),ae.side=nn,ae.needsUpdate=!0,$t=!0}}$t===!0&&(T.updateMultisampleRenderTarget(Mt),T.updateRenderTargetMipmap(Mt))}v.setRenderTarget(Nt),v.setClearColor(G,P),Xt!==void 0&&(K.viewport=Xt),v.toneMapping=zt}function et(b,k,Y){const K=k.isScene===!0?k.overrideMaterial:null;for(let H=0,Mt=b.length;H<Mt;H++){const Rt=b[H],Nt=Rt.object,zt=Rt.geometry,Xt=K===null?Rt.material:K,$t=Rt.group;Nt.layers.test(Y.layers)&&bt(Nt,k,Y,zt,Xt,$t)}}function bt(b,k,Y,K,H,Mt){b.onBeforeRender(v,k,Y,K,H,Mt),b.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),H.onBeforeRender(v,k,Y,K,b,Mt),H.transparent===!0&&H.side===Ge&&H.forceSinglePass===!1?(H.side=qe,H.needsUpdate=!0,v.renderBufferDirect(Y,k,K,H,b,Mt),H.side=ei,H.needsUpdate=!0,v.renderBufferDirect(Y,k,K,H,b,Mt),H.side=Ge):v.renderBufferDirect(Y,k,K,H,b,Mt),b.onAfterRender(v,k,Y,K,H,Mt)}function wt(b,k,Y){k.isScene!==!0&&(k=Ht);const K=mt.get(b),H=f.state.lights,Mt=f.state.shadowsArray,Rt=H.state.version,Nt=X.getParameters(b,H.state,Mt,k,Y),zt=X.getProgramCacheKey(Nt);let Xt=K.programs;K.environment=b.isMeshStandardMaterial?k.environment:null,K.fog=k.fog,K.envMap=(b.isMeshStandardMaterial?B:y).get(b.envMap||K.environment),K.envMapRotation=K.environment!==null&&b.envMap===null?k.environmentRotation:b.envMapRotation,Xt===void 0&&(b.addEventListener("dispose",Bt),Xt=new Map,K.programs=Xt);let $t=Xt.get(zt);if($t!==void 0){if(K.currentProgram===$t&&K.lightsStateVersion===Rt)return qt(b,Nt),$t}else Nt.uniforms=X.getUniforms(b),b.onBeforeCompile(Nt,v),$t=X.acquireProgram(Nt,zt),Xt.set(zt,$t),K.uniforms=Nt.uniforms;const kt=K.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(kt.clippingPlanes=ft.uniform),qt(b,Nt),K.needsLights=Le(b),K.lightsStateVersion=Rt,K.needsLights&&(kt.ambientLightColor.value=H.state.ambient,kt.lightProbe.value=H.state.probe,kt.directionalLights.value=H.state.directional,kt.directionalLightShadows.value=H.state.directionalShadow,kt.spotLights.value=H.state.spot,kt.spotLightShadows.value=H.state.spotShadow,kt.rectAreaLights.value=H.state.rectArea,kt.ltc_1.value=H.state.rectAreaLTC1,kt.ltc_2.value=H.state.rectAreaLTC2,kt.pointLights.value=H.state.point,kt.pointLightShadows.value=H.state.pointShadow,kt.hemisphereLights.value=H.state.hemi,kt.directionalShadowMap.value=H.state.directionalShadowMap,kt.directionalShadowMatrix.value=H.state.directionalShadowMatrix,kt.spotShadowMap.value=H.state.spotShadowMap,kt.spotLightMatrix.value=H.state.spotLightMatrix,kt.spotLightMap.value=H.state.spotLightMap,kt.pointShadowMap.value=H.state.pointShadowMap,kt.pointShadowMatrix.value=H.state.pointShadowMatrix),K.currentProgram=$t,K.uniformsList=null,$t}function Vt(b){if(b.uniformsList===null){const k=b.currentProgram.getUniforms();b.uniformsList=va.seqWithValue(k.seq,b.uniforms)}return b.uniformsList}function qt(b,k){const Y=mt.get(b);Y.outputColorSpace=k.outputColorSpace,Y.batching=k.batching,Y.batchingColor=k.batchingColor,Y.instancing=k.instancing,Y.instancingColor=k.instancingColor,Y.instancingMorph=k.instancingMorph,Y.skinning=k.skinning,Y.morphTargets=k.morphTargets,Y.morphNormals=k.morphNormals,Y.morphColors=k.morphColors,Y.morphTargetsCount=k.morphTargetsCount,Y.numClippingPlanes=k.numClippingPlanes,Y.numIntersection=k.numClipIntersection,Y.vertexAlphas=k.vertexAlphas,Y.vertexTangents=k.vertexTangents,Y.toneMapping=k.toneMapping}function Jt(b,k,Y,K,H){k.isScene!==!0&&(k=Ht),T.resetTextureUnits();const Mt=k.fog,Rt=K.isMeshStandardMaterial?k.environment:null,Nt=D===null?v.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:as,zt=(K.isMeshStandardMaterial?B:y).get(K.envMap||Rt),Xt=K.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,$t=!!Y.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),kt=!!Y.morphAttributes.position,ne=!!Y.morphAttributes.normal,oe=!!Y.morphAttributes.color;let ce=Qn;K.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(ce=v.toneMapping);const De=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ae=De!==void 0?De.length:0,Ot=mt.get(K),nn=f.state.lights;if(Q===!0&&(ht===!0||b!==S)){const $e=b===S&&K.id===E;ft.setState(K,b,$e)}let te=!1;K.version===Ot.__version?(Ot.needsLights&&Ot.lightsStateVersion!==nn.state.version||Ot.outputColorSpace!==Nt||H.isBatchedMesh&&Ot.batching===!1||!H.isBatchedMesh&&Ot.batching===!0||H.isBatchedMesh&&Ot.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ot.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ot.instancing===!1||!H.isInstancedMesh&&Ot.instancing===!0||H.isSkinnedMesh&&Ot.skinning===!1||!H.isSkinnedMesh&&Ot.skinning===!0||H.isInstancedMesh&&Ot.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ot.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ot.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ot.instancingMorph===!1&&H.morphTexture!==null||Ot.envMap!==zt||K.fog===!0&&Ot.fog!==Mt||Ot.numClippingPlanes!==void 0&&(Ot.numClippingPlanes!==ft.numPlanes||Ot.numIntersection!==ft.numIntersection)||Ot.vertexAlphas!==Xt||Ot.vertexTangents!==$t||Ot.morphTargets!==kt||Ot.morphNormals!==ne||Ot.morphColors!==oe||Ot.toneMapping!==ce||Ot.morphTargetsCount!==ae)&&(te=!0):(te=!0,Ot.__version=K.version);let Ne=Ot.currentProgram;te===!0&&(Ne=wt(K,k,H));let Gn=!1,ze=!1,si=!1;const re=Ne.getUniforms(),We=Ot.uniforms;if(Z.useProgram(Ne.program)&&(Gn=!0,ze=!0,si=!0),K.id!==E&&(E=K.id,ze=!0),Gn||S!==b){Z.buffers.depth.getReversed()?(it.copy(b.projectionMatrix),Tp(it),Ap(it),re.setValue(U,"projectionMatrix",it)):re.setValue(U,"projectionMatrix",b.projectionMatrix),re.setValue(U,"viewMatrix",b.matrixWorldInverse);const vn=re.map.cameraPosition;vn!==void 0&&vn.setValue(U,Et.setFromMatrixPosition(b.matrixWorld)),It.logarithmicDepthBuffer&&re.setValue(U,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&re.setValue(U,"isOrthographic",b.isOrthographicCamera===!0),S!==b&&(S=b,ze=!0,si=!0)}if(H.isSkinnedMesh){re.setOptional(U,H,"bindMatrix"),re.setOptional(U,H,"bindMatrixInverse");const $e=H.skeleton;$e&&($e.boneTexture===null&&$e.computeBoneTexture(),re.setValue(U,"boneTexture",$e.boneTexture,T))}H.isBatchedMesh&&(re.setOptional(U,H,"batchingTexture"),re.setValue(U,"batchingTexture",H._matricesTexture,T),re.setOptional(U,H,"batchingIdTexture"),re.setValue(U,"batchingIdTexture",H._indirectTexture,T),re.setOptional(U,H,"batchingColorTexture"),H._colorsTexture!==null&&re.setValue(U,"batchingColorTexture",H._colorsTexture,T));const Vn=Y.morphAttributes;if((Vn.position!==void 0||Vn.normal!==void 0||Vn.color!==void 0)&&ot.update(H,Y,Ne),(ze||Ot.receiveShadow!==H.receiveShadow)&&(Ot.receiveShadow=H.receiveShadow,re.setValue(U,"receiveShadow",H.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(We.envMap.value=zt,We.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&k.environment!==null&&(We.envMapIntensity.value=k.environmentIntensity),ze&&(re.setValue(U,"toneMappingExposure",v.toneMappingExposure),Ot.needsLights&&Me(We,si),Mt&&K.fog===!0&&rt.refreshFogUniforms(We,Mt),rt.refreshMaterialUniforms(We,K,z,$,f.state.transmissionRenderTarget[b.id]),va.upload(U,Vt(Ot),We,T)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(va.upload(U,Vt(Ot),We,T),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&re.setValue(U,"center",H.center),re.setValue(U,"modelViewMatrix",H.modelViewMatrix),re.setValue(U,"normalMatrix",H.normalMatrix),re.setValue(U,"modelMatrix",H.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const $e=K.uniformsGroups;for(let vn=0,Mn=$e.length;vn<Mn;vn++){const Ps=$e[vn];I.update(Ps,Ne),I.bind(Ps,Ne)}}return Ne}function Me(b,k){b.ambientLightColor.needsUpdate=k,b.lightProbe.needsUpdate=k,b.directionalLights.needsUpdate=k,b.directionalLightShadows.needsUpdate=k,b.pointLights.needsUpdate=k,b.pointLightShadows.needsUpdate=k,b.spotLights.needsUpdate=k,b.spotLightShadows.needsUpdate=k,b.rectAreaLights.needsUpdate=k,b.hemisphereLights.needsUpdate=k}function Le(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(b,k,Y){mt.get(b.texture).__webglTexture=k,mt.get(b.depthTexture).__webglTexture=Y;const K=mt.get(b);K.__hasExternalTextures=!0,K.__autoAllocateDepthBuffer=Y===void 0,K.__autoAllocateDepthBuffer||Pt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),K.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,k){const Y=mt.get(b);Y.__webglFramebuffer=k,Y.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(b,k=0,Y=0){D=b,w=k,A=Y;let K=!0,H=null,Mt=!1,Rt=!1;if(b){const zt=mt.get(b);if(zt.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(U.FRAMEBUFFER,null),K=!1;else if(zt.__webglFramebuffer===void 0)T.setupRenderTarget(b);else if(zt.__hasExternalTextures)T.rebindTextures(b,mt.get(b.texture).__webglTexture,mt.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const kt=b.depthTexture;if(zt.__boundDepthTexture!==kt){if(kt!==null&&mt.has(kt)&&(b.width!==kt.image.width||b.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(b)}}const Xt=b.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Rt=!0);const $t=mt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray($t[k])?H=$t[k][Y]:H=$t[k],Mt=!0):b.samples>0&&T.useMultisampledRTT(b)===!1?H=mt.get(b).__webglMultisampledFramebuffer:Array.isArray($t)?H=$t[Y]:H=$t,C.copy(b.viewport),N.copy(b.scissor),F=b.scissorTest}else C.copy(pt).multiplyScalar(z).floor(),N.copy(ct).multiplyScalar(z).floor(),F=lt;if(Z.bindFramebuffer(U.FRAMEBUFFER,H)&&K&&Z.drawBuffers(b,H),Z.viewport(C),Z.scissor(N),Z.setScissorTest(F),Mt){const zt=mt.get(b.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+k,zt.__webglTexture,Y)}else if(Rt){const zt=mt.get(b.texture),Xt=k||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,zt.__webglTexture,Y||0,Xt)}E=-1},this.readRenderTargetPixels=function(b,k,Y,K,H,Mt,Rt){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Nt=mt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Rt!==void 0&&(Nt=Nt[Rt]),Nt){Z.bindFramebuffer(U.FRAMEBUFFER,Nt);try{const zt=b.texture,Xt=zt.format,$t=zt.type;if(!It.textureFormatReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!It.textureTypeReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=b.width-K&&Y>=0&&Y<=b.height-H&&U.readPixels(k,Y,K,H,Ft.convert(Xt),Ft.convert($t),Mt)}finally{const zt=D!==null?mt.get(D).__webglFramebuffer:null;Z.bindFramebuffer(U.FRAMEBUFFER,zt)}}},this.readRenderTargetPixelsAsync=async function(b,k,Y,K,H,Mt,Rt){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Nt=mt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Rt!==void 0&&(Nt=Nt[Rt]),Nt){const zt=b.texture,Xt=zt.format,$t=zt.type;if(!It.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!It.textureTypeReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=b.width-K&&Y>=0&&Y<=b.height-H){Z.bindFramebuffer(U.FRAMEBUFFER,Nt);const kt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,kt),U.bufferData(U.PIXEL_PACK_BUFFER,Mt.byteLength,U.STREAM_READ),U.readPixels(k,Y,K,H,Ft.convert(Xt),Ft.convert($t),0);const ne=D!==null?mt.get(D).__webglFramebuffer:null;Z.bindFramebuffer(U.FRAMEBUFFER,ne);const oe=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await wp(U,oe,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,kt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Mt),U.deleteBuffer(kt),U.deleteSync(oe),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,k=null,Y=0){b.isTexture!==!0&&(vs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,b=arguments[1]);const K=Math.pow(2,-Y),H=Math.floor(b.image.width*K),Mt=Math.floor(b.image.height*K),Rt=k!==null?k.x:0,Nt=k!==null?k.y:0;T.setTexture2D(b,0),U.copyTexSubImage2D(U.TEXTURE_2D,Y,0,0,Rt,Nt,H,Mt),Z.unbindTexture()},this.copyTextureToTexture=function(b,k,Y=null,K=null,H=0){b.isTexture!==!0&&(vs("WebGLRenderer: copyTextureToTexture function signature has changed."),K=arguments[0]||null,b=arguments[1],k=arguments[2],H=arguments[3]||0,Y=null);let Mt,Rt,Nt,zt,Xt,$t,kt,ne,oe;const ce=b.isCompressedTexture?b.mipmaps[H]:b.image;Y!==null?(Mt=Y.max.x-Y.min.x,Rt=Y.max.y-Y.min.y,Nt=Y.isBox3?Y.max.z-Y.min.z:1,zt=Y.min.x,Xt=Y.min.y,$t=Y.isBox3?Y.min.z:0):(Mt=ce.width,Rt=ce.height,Nt=ce.depth||1,zt=0,Xt=0,$t=0),K!==null?(kt=K.x,ne=K.y,oe=K.z):(kt=0,ne=0,oe=0);const De=Ft.convert(k.format),ae=Ft.convert(k.type);let Ot;k.isData3DTexture?(T.setTexture3D(k,0),Ot=U.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(T.setTexture2DArray(k,0),Ot=U.TEXTURE_2D_ARRAY):(T.setTexture2D(k,0),Ot=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,k.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,k.unpackAlignment);const nn=U.getParameter(U.UNPACK_ROW_LENGTH),te=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ne=U.getParameter(U.UNPACK_SKIP_PIXELS),Gn=U.getParameter(U.UNPACK_SKIP_ROWS),ze=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,ce.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ce.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,zt),U.pixelStorei(U.UNPACK_SKIP_ROWS,Xt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,$t);const si=b.isDataArrayTexture||b.isData3DTexture,re=k.isDataArrayTexture||k.isData3DTexture;if(b.isRenderTargetTexture||b.isDepthTexture){const We=mt.get(b),Vn=mt.get(k),$e=mt.get(We.__renderTarget),vn=mt.get(Vn.__renderTarget);Z.bindFramebuffer(U.READ_FRAMEBUFFER,$e.__webglFramebuffer),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,vn.__webglFramebuffer);for(let Mn=0;Mn<Nt;Mn++)si&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,mt.get(b).__webglTexture,H,$t+Mn),b.isDepthTexture?(re&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,mt.get(k).__webglTexture,H,oe+Mn),U.blitFramebuffer(zt,Xt,Mt,Rt,kt,ne,Mt,Rt,U.DEPTH_BUFFER_BIT,U.NEAREST)):re?U.copyTexSubImage3D(Ot,H,kt,ne,oe+Mn,zt,Xt,Mt,Rt):U.copyTexSubImage2D(Ot,H,kt,ne,oe+Mn,zt,Xt,Mt,Rt);Z.bindFramebuffer(U.READ_FRAMEBUFFER,null),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else re?b.isDataTexture||b.isData3DTexture?U.texSubImage3D(Ot,H,kt,ne,oe,Mt,Rt,Nt,De,ae,ce.data):k.isCompressedArrayTexture?U.compressedTexSubImage3D(Ot,H,kt,ne,oe,Mt,Rt,Nt,De,ce.data):U.texSubImage3D(Ot,H,kt,ne,oe,Mt,Rt,Nt,De,ae,ce):b.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,H,kt,ne,Mt,Rt,De,ae,ce.data):b.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,H,kt,ne,ce.width,ce.height,De,ce.data):U.texSubImage2D(U.TEXTURE_2D,H,kt,ne,Mt,Rt,De,ae,ce);U.pixelStorei(U.UNPACK_ROW_LENGTH,nn),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,te),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ne),U.pixelStorei(U.UNPACK_SKIP_ROWS,Gn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ze),H===0&&k.generateMipmaps&&U.generateMipmap(Ot),Z.unbindTexture()},this.copyTextureToTexture3D=function(b,k,Y=null,K=null,H=0){return b.isTexture!==!0&&(vs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Y=arguments[0]||null,K=arguments[1]||null,b=arguments[2],k=arguments[3],H=arguments[4]||0),vs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,k,Y,K,H)},this.initRenderTarget=function(b){mt.get(b).__webglFramebuffer===void 0&&T.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?T.setTextureCube(b,0):b.isData3DTexture?T.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?T.setTexture2DArray(b,0):T.setTexture2D(b,0),Z.unbindTexture()},this.resetState=function(){w=0,A=0,D=null,Z.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ie._getDrawingBufferColorSpace(t),e.unpackColorSpace=ie._getUnpackColorSpace()}}class Nx extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class zx{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=zo,this.updateRanges=[],this.version=0,this.uuid=ti()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ti()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ti()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Be=new W;class La{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=wn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=de(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=de(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=de(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=de(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=de(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=wn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=wn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=wn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=wn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=de(e,this.array),n=de(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=de(e,this.array),n=de(n,this.array),s=de(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=de(e,this.array),n=de(n,this.array),s=de(s,this.array),a=de(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new xn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new La(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Gd extends Ei{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Zt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Xi;const ms=new W,Wi=new W,$i=new W,Yi=new jt,gs=new jt,Vd=new fe,na=new W,_s=new W,ia=new W,Hl=new jt,Lr=new jt,Gl=new jt;class Ox extends be{constructor(t=new Gd){if(super(),this.isSprite=!0,this.type="Sprite",Xi===void 0){Xi=new je;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new zx(e,5);Xi.setIndex([0,1,2,0,2,3]),Xi.setAttribute("position",new La(n,3,0,!1)),Xi.setAttribute("uv",new La(n,2,3,!1))}this.geometry=Xi,this.material=t,this.center=new jt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Wi.setFromMatrixScale(this.matrixWorld),Vd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),$i.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Wi.multiplyScalar(-$i.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;sa(na.set(-.5,-.5,0),$i,r,Wi,s,a),sa(_s.set(.5,-.5,0),$i,r,Wi,s,a),sa(ia.set(.5,.5,0),$i,r,Wi,s,a),Hl.set(0,0),Lr.set(1,0),Gl.set(1,1);let o=t.ray.intersectTriangle(na,_s,ia,!1,ms);if(o===null&&(sa(_s.set(-.5,.5,0),$i,r,Wi,s,a),Lr.set(0,1),o=t.ray.intersectTriangle(na,ia,_s,!1,ms),o===null))return;const c=t.ray.origin.distanceTo(ms);c<t.near||c>t.far||e.push({distance:c,point:ms.clone(),uv:tn.getInterpolation(ms,na,_s,ia,Hl,Lr,Gl,new jt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function sa(i,t,e,n,s,a){Yi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(gs.x=a*Yi.x-s*Yi.y,gs.y=s*Yi.x+a*Yi.y):gs.copy(Yi),i.copy(t),i.x+=gs.x,i.y+=gs.y,i.applyMatrix4(Vd)}class lc extends Ei{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ia=new W,ka=new W,Vl=new fe,xs=new ac,aa=new Oa,Ir=new W,Xl=new W;class Bx extends be{constructor(t=new je,e=new lc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,a=e.count;s<a;s++)Ia.fromBufferAttribute(e,s-1),ka.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Ia.distanceTo(ka);t.setAttribute("lineDistance",new Ee(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),aa.copy(n.boundingSphere),aa.applyMatrix4(s),aa.radius+=a,t.ray.intersectsSphere(aa)===!1)return;Vl.copy(s).invert(),xs.copy(t.ray).applyMatrix4(Vl);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const d=Math.max(0,r.start),m=Math.min(h.count,r.start+r.count);for(let _=d,g=m-1;_<g;_+=l){const f=h.getX(_),x=h.getX(_+1),M=ra(this,t,xs,c,f,x);M&&e.push(M)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(d),f=ra(this,t,xs,c,_,g);f&&e.push(f)}}else{const d=Math.max(0,r.start),m=Math.min(u.count,r.start+r.count);for(let _=d,g=m-1;_<g;_+=l){const f=ra(this,t,xs,c,_,_+1);f&&e.push(f)}if(this.isLineLoop){const _=ra(this,t,xs,c,m-1,d);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function ra(i,t,e,n,s,a){const r=i.geometry.attributes.position;if(Ia.fromBufferAttribute(r,s),ka.fromBufferAttribute(r,a),e.distanceSqToSegment(Ia,ka,Ir,Xl)>n)return;Ir.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ir);if(!(c<t.near||c>t.far))return{distance:c,point:Xl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Wl=new W,$l=new W;class Xd extends Bx{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,a=e.count;s<a;s+=2)Wl.fromBufferAttribute(e,s),$l.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Wl.distanceTo($l);t.setAttribute("lineDistance",new Ee(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Hx extends Xe{constructor(t,e,n,s,a,r,o,c,l){super(t,e,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class dc extends je{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const a=[],r=[];o(s),l(n),h(),this.setAttribute("position",new Ee(a,3)),this.setAttribute("normal",new Ee(a.slice(),3)),this.setAttribute("uv",new Ee(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const M=new W,v=new W,L=new W;for(let w=0;w<e.length;w+=3)d(e[w+0],M),d(e[w+1],v),d(e[w+2],L),c(M,v,L,x)}function c(x,M,v,L){const w=L+1,A=[];for(let D=0;D<=w;D++){A[D]=[];const E=x.clone().lerp(v,D/w),S=M.clone().lerp(v,D/w),C=w-D;for(let N=0;N<=C;N++)N===0&&D===w?A[D][N]=E:A[D][N]=E.clone().lerp(S,N/C)}for(let D=0;D<w;D++)for(let E=0;E<2*(w-D)-1;E++){const S=Math.floor(E/2);E%2===0?(u(A[D][S+1]),u(A[D+1][S]),u(A[D][S])):(u(A[D][S+1]),u(A[D+1][S+1]),u(A[D+1][S]))}}function l(x){const M=new W;for(let v=0;v<a.length;v+=3)M.x=a[v+0],M.y=a[v+1],M.z=a[v+2],M.normalize().multiplyScalar(x),a[v+0]=M.x,a[v+1]=M.y,a[v+2]=M.z}function h(){const x=new W;for(let M=0;M<a.length;M+=3){x.x=a[M+0],x.y=a[M+1],x.z=a[M+2];const v=g(x)/2/Math.PI+.5,L=f(x)/Math.PI+.5;r.push(v,1-L)}m(),p()}function p(){for(let x=0;x<r.length;x+=6){const M=r[x+0],v=r[x+2],L=r[x+4],w=Math.max(M,v,L),A=Math.min(M,v,L);w>.9&&A<.1&&(M<.2&&(r[x+0]+=1),v<.2&&(r[x+2]+=1),L<.2&&(r[x+4]+=1))}}function u(x){a.push(x.x,x.y,x.z)}function d(x,M){const v=x*3;M.x=t[v+0],M.y=t[v+1],M.z=t[v+2]}function m(){const x=new W,M=new W,v=new W,L=new W,w=new jt,A=new jt,D=new jt;for(let E=0,S=0;E<a.length;E+=9,S+=6){x.set(a[E+0],a[E+1],a[E+2]),M.set(a[E+3],a[E+4],a[E+5]),v.set(a[E+6],a[E+7],a[E+8]),w.set(r[S+0],r[S+1]),A.set(r[S+2],r[S+3]),D.set(r[S+4],r[S+5]),L.copy(x).add(M).add(v).divideScalar(3);const C=g(L);_(w,S+0,x,C),_(A,S+2,M,C),_(D,S+4,v,C)}}function _(x,M,v,L){L<0&&x.x===1&&(r[M]=x.x-1),v.x===0&&v.z===0&&(r[M]=L/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function f(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dc(t.vertices,t.indices,t.radius,t.details)}}const oa=new W,ca=new W,kr=new W,la=new tn;class Gx extends je{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(xa*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],h=["a","b","c"],p=new Array(3),u={},d=[];for(let m=0;m<c;m+=3){r?(l[0]=r.getX(m),l[1]=r.getX(m+1),l[2]=r.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);const{a:_,b:g,c:f}=la;if(_.fromBufferAttribute(o,l[0]),g.fromBufferAttribute(o,l[1]),f.fromBufferAttribute(o,l[2]),la.getNormal(kr),p[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,p[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,p[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(p[0]===p[1]||p[1]===p[2]||p[2]===p[0]))for(let x=0;x<3;x++){const M=(x+1)%3,v=p[x],L=p[M],w=la[h[x]],A=la[h[M]],D=`${v}_${L}`,E=`${L}_${v}`;E in u&&u[E]?(kr.dot(u[E].normal)<=a&&(d.push(w.x,w.y,w.z),d.push(A.x,A.y,A.z)),u[E]=null):D in u||(u[D]={index0:l[x],index1:l[M],normal:kr.clone()})}}for(const m in u)if(u[m]){const{index0:_,index1:g}=u[m];oa.fromBufferAttribute(o,_),ca.fromBufferAttribute(o,g),d.push(oa.x,oa.y,oa.z),d.push(ca.x,ca.y,ca.z)}this.setAttribute("position",new Ee(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class hc extends dc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new hc(t.radius,t.detail)}}class qi extends je{constructor(t=.5,e=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let p=t;const u=(e-t)/s,d=new W,m=new jt;for(let _=0;_<=s;_++){for(let g=0;g<=n;g++){const f=a+g/n*r;d.x=p*Math.cos(f),d.y=p*Math.sin(f),c.push(d.x,d.y,d.z),l.push(0,0,1),m.x=(d.x/e+1)/2,m.y=(d.y/e+1)/2,h.push(m.x,m.y)}p+=u}for(let _=0;_<s;_++){const g=_*(n+1);for(let f=0;f<n;f++){const x=f+g,M=x,v=x+n+1,L=x+n+2,w=x+1;o.push(M,v,w),o.push(v,L,w)}}this.setIndex(o),this.setAttribute("position",new Ee(c,3)),this.setAttribute("normal",new Ee(l,3)),this.setAttribute("uv",new Ee(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ga extends je{constructor(t=1,e=.4,n=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:a},n=Math.floor(n),s=Math.floor(s);const r=[],o=[],c=[],l=[],h=new W,p=new W,u=new W;for(let d=0;d<=n;d++)for(let m=0;m<=s;m++){const _=m/s*a,g=d/n*Math.PI*2;p.x=(t+e*Math.cos(g))*Math.cos(_),p.y=(t+e*Math.cos(g))*Math.sin(_),p.z=e*Math.sin(g),o.push(p.x,p.y,p.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),u.subVectors(p,h).normalize(),c.push(u.x,u.y,u.z),l.push(m/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let m=1;m<=s;m++){const _=(s+1)*d+m-1,g=(s+1)*(d-1)+m-1,f=(s+1)*(d-1)+m,x=(s+1)*d+m;r.push(_,g,x),r.push(g,f,x)}this.setIndex(r),this.setAttribute("position",new Ee(o,3)),this.setAttribute("normal",new Ee(c,3)),this.setAttribute("uv",new Ee(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ga(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ts extends Ei{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ed,this.normalScale=new jt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=Jo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Wd extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Vx extends Wd{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ur=new fe,Yl=new W,Zl=new W;class Xx{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new jt(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new oc,this._frameExtents=new jt(1,1),this._viewportCount=1,this._viewports=[new ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Yl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Yl),Zl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Zl),e.updateMatrixWorld(),Ur.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ur),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ur)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Wx extends Xx{constructor(){super(new Fd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $x extends Wd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new Wx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const ql=new fe;class Yx{constructor(t,e,n=0,s=1/0){this.ray=new ac(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new rc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return ql.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ql),this}intersectObject(t,e=!0,n=[]){return Ho(t,this,n,e),n.sort(jl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,a=t.length;s<a;s++)Ho(t[s],this,n,e);return n.sort(jl),n}}function jl(i,t){return i.distance-t.distance}function Ho(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const a=i.children;for(let r=0,o=a.length;r<o;r++)Ho(a[r],t,e,!0)}}class Zx extends Xd{constructor(t=10,e=10,n=4473924,s=8947848){n=new Zt(n),s=new Zt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let u=0,d=0,m=-o;u<=e;u++,m+=r){c.push(-o,0,m,o,0,m),c.push(m,0,-o,m,0,o);const _=u===a?n:s;_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3}const h=new je;h.setAttribute("position",new Ee(c,3)),h.setAttribute("color",new Ee(l,3));const p=new lc({vertexColors:!0,toneMapped:!1});super(h,p),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ko}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ko);const qx={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function jx(i,t,e,n){const s=new rn(i.fov,n,.1,200),a=new W,r=new W,o=new W;let c=!1,l=i.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let p=1;function u(){const d=(i.pitchDeg+h.pitchDelta)*Math.PI/180,m=i.yawDeg*Math.PI/180;o.set(Math.sin(m)*Math.cos(d),Math.sin(d),Math.cos(m)*Math.cos(d)).multiplyScalar(i.distance*h.distanceScale*h.zoom)}return u(),{camera:s,update(d,m,_,g,f=qx){const x=m+.6;if(!c)a.set(d,x,_),c=!0;else{const L=1-Math.exp(-Math.max(i.smoothing,.001)*g);a.x+=(d-a.x)*L,a.y+=(x-a.y)*L,a.z+=(_-a.z)*L}const M=1-Math.exp(-Math.max(t.smoothing,.001)*g);h.distanceScale+=(f.distanceScale-h.distanceScale)*M,h.offsetX+=(f.offsetX-h.offsetX)*M,h.offsetZ+=(f.offsetZ-h.offsetZ)*M,h.pitchDelta+=(f.pitchDelta-h.pitchDelta)*M;const v=1-Math.exp(-Math.max(e.smoothing,.001)*g);h.zoom+=(p-h.zoom)*v,u(),(s.fov!==l||s.fov!==i.fov)&&(s.fov=i.fov,l=i.fov,s.updateProjectionMatrix()),r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(d){s.aspect=d,s.updateProjectionMatrix()},getGroundBasis(){const d=new W().setFromMatrixColumn(s.matrixWorld,0),m=new W().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(d.x,d.z)||1,g=Math.hypot(m.x,m.z)||1;return{rightX:d.x/_,rightZ:d.z/_,forwardX:m.x/g,forwardZ:m.z/g}},setZoom(d){p=Number.isFinite(d)&&d>0?d:1},smart(){return{...h}}}}const Mi=Math.PI*2,mn=1e-6;function ii(i,t,e){return i<t?t:i>e?e:i}function $d(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function Kx(i){if(i<=Math.PI)return 1-2*i/Math.PI;const t=(i-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Yd(i,t){const e=Math.cos(i),n=t<=0?0:t>=1?1:t;if(n===0)return e;const s=Kx(i);return n===1?s:e+(s-e)*n}function Kl(i){return(1-Math.sin(i))/2}function uc(i,t){if(!i.grounded||i.speed<mn)return $d();const e=i.speed/Math.max(i.moveSpeed,mn),n=Math.max(i.legLength,mn),s=i.stride>mn?i.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*n,a=Math.min(t.maxAmp,s/n),r=n*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(i.localForward),c=Math.abs(i.localRight),l=o+c+mn,h=o/l,p=c/l,u=i.localForward>=0?1:-1,d=i.localRight>=0?1:-1,m=s,_=F=>Math.asin(ii(F,-r,r)/n);function g(F,G){const P=Yd(F,t.plantLock),R=Kl(F),$=u*h*m*P,z=-_($),V=G*d>0?1:-1,J=1+V*t.crossStep*.45,pt=d*V*t.crossStep*m*.4*R,ct=d*p*m*t.sideWeight*J*P+pt*p,lt=_(ct),q=t.kneeLift*R*a*(.55+.25*h+(V>0?.2*p:0));return{pitchX:z,rollZ:lt,kneeX:q}}const f=(i.phase%Mi+Mi)%Mi,x=g(f,-1),M=g((f+Math.PI)%Mi,1),v=Math.cos(f),L=Kl(f),w=-t.comSway*a*v*(.6*h+.8*p)-d*t.comSway*a*p*.45,A=t.comBob*L*a,D=d*t.hipLean*a*p*v*.6,E=d*t.hipLean*a*p*(.45+.25*v),S=t.armSwing*a*v*(h*u+.3*p),C=S,N=-S;return{legL:x,legR:M,pelvisX:w,pelvisY:A,pelvisRoll:D,sideLean:E,armL:C,armR:N,strafe:p,backward:u<0?h:0}}function Zd(i){const t=(i%Mi+Mi)%Mi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function qd(i,t,e){const n=ii(e.progress,0,1);if(n>=1||i.speed<mn)return $d();const s=n*n*(3-2*n),a=1-s;return uc({...i,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:i.speed*a,stride:i.stride*a},t)}function jd(i,t,e,n){const s=ii(i,-1,1),a=Math.abs(s),r=Math.min(1,t*(1+Math.max(0,n)*a*a));return ii(r*s,-1,1)*(e*Math.PI/180)}function Kd(i,t,e,n,s){const a=Math.max(e,mn),r=Math.max(0,n)*a,o=Math.max(0,s)*a,c=t>mn?(t-i)/t:0,l=c>.02,h=c<-.015,p=i<=r*.15,u=!h&&i<o&&(l||p);return{enter:i>mn&&i<=r&&l,resume:!u}}function Jd(i,t,e){const n=Math.max(0,e)*(Math.PI/180);return ii(i*ii(t,0,2),-n,n)}function Qd(i,t,e){const n=Math.sin(i),s=Math.cos(i),a=Math.cos(i),r=-Math.sin(i);return{forward:t*n+e*s,right:t*a+e*r}}function th(i,t,e,n,s){const a=ii(i,0,1),r=ii(s.stopPeakRatio,.05,.95),o=a<=r?a/r:(a-r)/(1-r),c=o*o*(3-2*o),l=a<=r?c:1-c,h=Math.hypot(e,n),p=h>mn?e/h:1,u=h>mn?n/h:0,d=Yd(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*l,trailPitch:Math.max(0,s.stopTrailPitch)*l,leadKnee:Math.max(0,s.stopStepKnee)*l,bodyShift:Math.max(0,s.stopBodyShift)*l,chestPitch:Math.max(0,s.stopChestPitch)*l,leadLeft:d,fwdN:p,rightN:u,env:l}}function Ve(i){return i<0?0:i>1?1:i}const Ma=Math.PI*2;function Jx(i){return((i+Math.PI)%Ma+Ma)%Ma-Math.PI}function Qx(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function tv(i,t,e,n,s,a=i.phase){const r=Ve(n);if(r<=0)return i;const o=Ve(t),c=Math.max(1,Math.round(s.cycles)),l=Math.max(0,s.strideSpeed),h=e%2===0?1:-1,p=Ve(s.forwardBias),u=Math.max(0,i.stride??0),d=Math.max(0,s.strideScale??0)*u,m=o<=.5?o*2:(o-.5)*2,_=m*m*(3-2*m),g=o<=.5?_:1-_,f={speed:l,phase:a+Ma*c/2*g,localForward:l*p,localRight:l*(1-p)*h},x=Jx(f.phase-i.phase),M=r*r*(3-2*r);return{speed:i.speed+(f.speed-i.speed)*r,phase:i.phase+x*M,localForward:i.localForward+(f.localForward-i.localForward)*r,localRight:i.localRight+(f.localRight-i.localRight)*r,stride:d*r*r}}function ev(i,t,e){const n=Qx(),s=Ve(i),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return n;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,h=e.stepKnee*a,p=e.stepSide*a;return n.legL.pitchX=o?-l:l*.55,n.legR.pitchX=c?-l:l*.55,n.legL.kneeX=o?h:h*.4,n.legR.kneeX=c?h:h*.4,n.legL.rollZ=-p*r,n.legR.rollZ=p*r,n.pelvisX=e.stepSway*a*r,n.pelvisY=-e.stepDip*a,n.pelvisRoll=p*.25*r,n}function eh(i,t){if(i<=0||i>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return i<e?Math.sin(Math.PI/2*(i/e)):Math.cos(Math.PI/2*((i-e)/(1-e)))}function Jl(i,t,e,n,s){if(e<=0||n<=0)return 0;const a=(i-t)/e;return a<0||a>=1?0:n*eh(a,s)}function nv(i,t,e,n){const s=t?1:0,a=1-Math.exp(-Math.max(0,n)*Math.max(0,e)),r=i+(s-i)*a;return t&&r>.999?1:!t&&r<.001?0:r}function iv(i,t,e){const n=Ve(i);return{gaitScale:1-n*(1-Ve(t)),attackLegWeight:Ve(e)*n}}function sv(i,t){const e=Ve(t);return e===1?i:{legL:{pitchX:i.legL.pitchX*e,rollZ:i.legL.rollZ*e,kneeX:i.legL.kneeX*e},legR:{pitchX:i.legR.pitchX*e,rollZ:i.legR.rollZ*e,kneeX:i.legR.kneeX*e},pelvisX:i.pelvisX*e,pelvisY:i.pelvisY*e,pelvisRoll:i.pelvisRoll*e,sideLean:i.sideLean*e,armL:i.armL*e,armR:i.armR*e,strafe:i.strafe,backward:i.backward}}function av(i,t){const e=Math.min(1,Math.abs(i)/Math.max(t.impactSpeed,1e-6));return Ve(t.minScale+(1-t.minScale)*e)}function rv(){return nh()}function nh(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function ov(i,t){return i.type==="light"?Math.max(0,t.leanLight):i.type==="heavy"?Math.max(0,t.leanHeavy):i.type==="knock"?Math.max(0,t.leanKnock):0}function cv(i,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Ve(t.forceHitHeight):i.type==="light"?Ve(t.hitHeight.light):i.type==="heavy"?Ve(t.hitHeight.heavy):i.type==="knock"?Ve(t.hitHeight.knock):0}function lv(i,t,e){const n=Ve(e),s=(a,r)=>a+(r-a)*n;return{upperPitch:s(i.upperPitch,t.upperPitch),upperRoll:s(i.upperRoll,t.upperRoll),upperYaw:s(i.upperYaw,t.upperYaw),fold:s(i.fold,t.fold),shift:s(i.shift,t.shift),drop:s(i.drop,t.drop),back:s(i.back,t.back),knee:s(i.knee,t.knee),hip:s(i.hip,t.hip),arm:s(i.arm,t.arm)}}function ih(i,t,e){const n=nh(),s=ov(i,e);if(n.intensity=s,s<=0||i.duration<=0||!Number.isFinite(i.timer))return n;const a=Ve(1-i.timer/i.duration),r=eh(a,e.pulseRatio);n.pulse=r,n.active=r>0,n.hitHeight=cv(i,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),p=i.dirX*o+i.dirZ*c,u=i.dirX*l+i.dirZ*h;if(n.localFwd=p,n.localRight=u,!e.enabled){n.legacy=!0;const _=Math.sin(Math.PI*a);return n.upperPitch=s*_*p,n.upperRoll=-s*_*u*.7,n.drop=(s>.5?.09:.04)*_,n.flash=e.flashStrength*_,n.active=_>0,n}const d=s*r,m=lv(e.abdomen,e.shoulder,n.hitHeight);return n.upperPitch=d*(m.upperPitch*p+m.fold),n.upperRoll=-d*m.upperRoll*u,n.upperYaw=d*m.upperYaw*u,n.upperShift=d*m.shift,n.upperShiftX=n.upperShift*u,n.upperShiftZ=n.upperShift*p,n.comShift=d*e.comShift,n.comX=n.comShift*u,n.comZ=n.comShift*p,n.pelvisBack=d*m.back,n.drop=d*m.drop,n.knee=d*m.knee,n.hip=d*m.hip,n.arm=d*m.arm,n.flash=e.flashStrength*r,n}function sh(i,t){const e=Math.max(0,t.pelvisTiltGain),n=Math.max(0,t.pelvisShift),s=Number.isFinite(i.leanForward)?i.leanForward:0,a=Number.isFinite(i.leanSide)?i.leanSide:0,r=Number.isFinite(i.speedRatio)?Math.max(0,Math.min(1,i.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*n,pelvisZ:s*n,crouch:Math.max(0,t.moveCrouch)*r}}const ui=1e-6;function Ss(i,t,e){return i<t?t:i>e?e:i}function dv(i,t,e,n=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=ui||a<=ui||!Number.isFinite(i.x)||!Number.isFinite(i.y)||!Number.isFinite(i.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+ui,l=Math.hypot(i.x,i.y,i.z);if(l<=ui)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(i.x,-i.y),p=Math.hypot(i.x,i.y),u=i.z,d=Math.hypot(u,p),m=Ss(d,c,o),_=d>o+ui||d<c-ui,g=Math.atan2(-u,Math.max(p,ui)),f=Ss((s*s+m*m-a*a)/(2*s*m),-1,1),x=Ss((a*a+m*m-s*s)/(2*a*m),-1,1),M=Math.acos(f),v=Math.acos(x),L=n>=0?1:-1;return{rootPitch:g-L*M,rootRoll:h,jointPitch:L*(M+v),clamped:_,reach:l/o}}function hv(i,t,e,n){const s=Ss(e,0,1),a=Math.max(0,n),r=(o,c)=>{const l=Ss((c-o)*s,-a,a);return o+l};return{rootPitch:r(i.rootPitch,t.rootPitch),rootRoll:r(i.rootRoll,t.rootRoll),jointPitch:r(i.jointPitch,t.jointPitch)}}function ah(i,t){return{pelvisPos:i.position.clone(),pelvisRotX:i.rotation.x,pelvisRotZ:i.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const fc={active:!1,weight:0,clamped:0,maxError:0};function rh(i){const{root:t,pelvis:e,lower:n,limbs:s,base:a,cfg:r}=i;if(!r.enabled||r.weight<=0||!i.grounded||s.length===0)return{...fc};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:n.position.clone(),lowerRotZ:n.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,n.position.copy(a.lowerPos),n.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(d=>d.tip.getWorldPosition(new W));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,n.position.copy(o.lowerPos),n.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),n.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(i.attacking?Math.max(0,Math.min(1,r.attackScale)):1),h=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let p=0;for(let d=0;d<s.length;d++){const m=s[d],_=n.worldToLocal(c[d].clone()),g={x:_.x-m.root.position.x,y:_.y-m.root.position.y,z:_.z-m.root.position.z},f=dv(g,m.upperLen,m.lowerLen,m.bend);f.clamped&&(p+=1);const x=hv({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},f,l,h);m.root.rotation.x=x.rootPitch,m.root.rotation.z=x.rootRoll,m.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let u=0;for(let d=0;d<s.length;d++){const m=s[d].tip.getWorldPosition(new W);u=Math.max(u,m.distanceTo(c[d]))}return{active:!0,weight:l,clamped:p,maxError:u}}function pn(i,t,e){return i<t?t:i>e?e:i}const uv={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function fv(i,t,e,n,s,a,r,o,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},p=new Pe,u=new Pe;u.name="pelvis",u.position.y=i.legLength,p.add(u);const d=new Pe;d.name="lower";const m=new Pe;m.name="upper",u.add(d),u.add(m);const _=[],g=(X,rt,_t,Tt)=>{const ft=new Ts({color:Tt}),gt=new ue(new Pn(X,rt,_t),ft);return gt.castShadow=!0,gt.receiveShadow=!0,_.push(ft),gt},f=i.headSize,x=i.legLength,M=i.armLength,v=i.limbThickness,L=i.bodyHeight,w=i.bodyWidth,A=g(w,L,.28,e);A.position.y=L/2,m.add(A);const D=new Pe;D.name="headPivot",D.position.y=L,m.add(D);const E=g(f,f,f,e);E.position.y=f/2,D.add(E);for(const X of[-1,1]){const rt=g(.06,.07,.02,t.shoe);rt.position.set(X*.09,f/2+.03,f/2+.011),D.add(rt)}const S=(X,rt)=>{const _t=rt?M:x,Tt=new Pe;Tt.name=rt?X<0?"shoulderL":"shoulderR":X<0?"hipL":"hipR",rt||(Tt.rotation.order="ZYX"),Tt.position.set(X*(rt?w/2+v/2:w/2-v/2),rt?L-.04:0,0),(rt?m:d).add(Tt);const ft=g(v,_t/2,v,t.limb);ft.position.y=-_t/4,Tt.add(ft);const gt=new Pe;gt.name=rt?"elbow":"knee",gt.position.y=-_t/2,Tt.add(gt);const O=g(v,_t/2,v,t.limb);if(O.position.y=-_t/4,gt.add(O),!rt){const ot=g(v*1.15,.07,v*1.7,t.shoe);ot.position.set(0,-_t/2+.035,.045),gt.add(ot);const dt=new be;return dt.name="footTip",dt.position.y=-_t/2,gt.add(dt),{root:Tt,joint:gt,tip:dt}}return{root:Tt,joint:gt}},C=S(-1,!1),N=S(1,!1),F=S(-1,!0),G=S(1,!0),P=[C,N].map(X=>({root:X.root,joint:X.joint,tip:X.tip,upperLen:x/2,lowerLen:x/2,bend:1})),R=new bn({color:s.attackArcColor,transparent:!0,opacity:0,side:Ge,depthWrite:!1}),$=new ue(new Ga(.62,.042,6,20,Math.PI*1.1),R);$.position.set(0,.78-x,.56),m.add($);const z=document.createElement("canvas");z.width=256,z.height=72;const V=z.getContext("2d"),J=new Hx(z),pt=new Gd({map:J,transparent:!0,depthTest:!1,depthWrite:!1}),ct=new Ox(pt);ct.scale.set(1.85,.52,1),ct.position.y=1.7-x,ct.renderOrder=20,m.add(ct);function lt(X){V&&(V.clearRect(0,0,256,72),V.fillStyle=s.labelBg,V.fillRect(0,0,256,72),V.strokeStyle=e,V.lineWidth=5,V.strokeRect(3,3,250,66),V.fillStyle=e,V.font="bold 29px ui-monospace, Menlo, Consolas, monospace",V.textAlign="center",V.textBaseline="middle",V.fillText(`${n} ${uv[X]}`,128,38),J.needsUpdate=!0)}const q=new Zt(e),Q=new Zt(o.flashColor),ht=new Zt;let it=null,vt=0,Et=0,Dt=0,Ht=0,Ct=0,Lt=0,U=0,Yt={...fc},Pt=-1,It=0,Z=0,ut=0,mt=0,T=0,y=0,B=0,tt=1,st=0,nt=0;return{group:p,update(X,rt){p.position.set(X.position.x,X.position.y,X.position.z),p.rotation.y=X.bodyYaw,D.rotation.y=(X.headYaw-X.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,X.mode!==it&&(it=X.mode,lt(X.mode),vt=1),vt=Math.max(0,vt-rt*2.2);const _t=X.hurt,Tt=ih(_t,X.bodyYaw,o),ft=Tt.flash;ht.copy(Q).multiplyScalar(ft);for(const b of _)b.emissive.copy(q).multiplyScalar(vt*.5),ft>0&&b.emissive.add(ht);u.position.set(0,x,0),u.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),d.position.set(0,0,0),d.rotation.z=0;const gt=Math.hypot(X.velocity.x,X.velocity.z),O=pn(r.knockGaitScale??0,0,1),ot=X.hurt.knockX*O,dt=X.hurt.knockZ*O,Ut=O>0&&Math.hypot(X.hurt.knockX,X.hurt.knockZ)>.001,Ft=X.velocity.x+ot,Gt=X.velocity.z+dt,I=Math.hypot(Ft,Gt),yt=Math.cos(X.bodyYaw),j=-Math.sin(X.bodyYaw),at=gt>1e-6?pn((X.velocity.x*yt+X.velocity.z*j)/gt,-1,1):0,St=jd(at,r.strafeHipScale,r.strafeHipMaxDeg,r.strafeHipBoost);st+=(St-st)*(1-Math.exp(-12*Math.max(0,rt))),d.rotation.y=st;const xt=X.bodyYaw+st,Bt=Math.sin(xt),ee=Math.cos(xt),se=Math.cos(xt),Wt=-Math.sin(xt),pe=Ft*Bt+Gt*ee,Se=Ft*se+Gt*Wt,en=Math.max(0,r.stopBlendSec||0),Ke=en>0&&!Ut,me=Kd(gt,nt,a,r.stopEnterRatio,r.stopExitRatio);if(!Ke||me.resume)Pt=-1;else if(Pt<0&&me.enter){Pt=0,It=X.gaitPhase,Z=Zd(X.gaitPhase),ut=gt,mt=Math.max(X.stride,1e-6),T=pe,y=Se;const b=1/Math.max(1e-6,gt);B=X.velocity.x*b,tt=X.velocity.z*b}nt=gt;const ge=Ke&&Pt>=0;ge&&(Pt=Math.min(1,Pt+rt/en));const Fe=ge?{phase:It,speed:ut,moveSpeed:a,localForward:T,localRight:y,legLength:i.legLength,stride:mt,grounded:!0}:{phase:X.gaitPhase,speed:I,moveSpeed:a,localForward:pe,localRight:Se,legLength:i.legLength,stride:X.stride,grounded:!0},he=ge?qd(Fe,r,{progress:Pt,phase0:It,phaseEnd:Z}):uc(Fe,r);let et=0,bt=0,wt=0;if(ge){const b=Qd(X.bodyYaw,B,tt),k=th(Pt,It,b.forward,b.right,r);k.leadLeft?(he.legL.pitchX-=k.leadPitch,he.legL.kneeX+=k.leadKnee,he.legR.pitchX+=k.trailPitch):(he.legR.pitchX-=k.leadPitch,he.legR.kneeX+=k.leadKnee,he.legL.pitchX+=k.trailPitch),bt=k.bodyShift*k.fwdN,et=k.bodyShift*k.rightN,wt=k.chestPitch}C.root.rotation.x=he.legL.pitchX,N.root.rotation.x=he.legR.pitchX,C.root.rotation.z=he.legL.rollZ,N.root.rotation.z=he.legR.rollZ,C.joint.rotation.x=he.legL.kneeX,N.joint.rotation.x=he.legR.kneeX,F.root.rotation.x=he.armL,G.root.rotation.x=he.armR,F.joint.rotation.x=-.18,G.joint.rotation.x=-.18,u.position.x=he.pelvisX,u.position.y=x+he.pelvisY,u.position.z=0,u.rotation.z=he.pelvisRoll,m.rotation.z=he.sideLean*(Tt.intensity>0?.4:1);const Vt=ah(u,d);if(u.position.x+=et,u.position.z+=bt,d.position.x-=et,d.position.z-=bt,c){const b=Math.max(.004166666666666667,Math.min(rt,.1)),k=Math.sin(X.bodyYaw),Y=Math.cos(X.bodyYaw),K=pn((X.velocity.x-Et)/b,-60,60),H=pn((X.velocity.z-Dt)/b,-60,60),Mt=K*k+H*Y,Rt=Rn(X.bodyYaw-Ht)/b,Nt=c.maxForwardDeg*Math.PI/180,zt=c.maxSideDeg*Math.PI/180,Xt=1-Math.exp(-Math.max(0,c.smoothing)*b);Ct+=(pn(Mt*c.accelGain,-Nt,Nt)-Ct)*Xt,Lt+=(pn(-Rt*gt*c.turnGain,-zt,zt)-Lt)*Xt;const $t=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;U+=(pn(gt/Math.max(a,1e-6),0,1)-U)*(1-Math.exp(-Math.max(0,$t)*b));const kt=sh({leanForward:Ct,leanSide:Lt,speedRatio:U},c);m.rotation.x+=Ct+wt,m.rotation.z+=Lt,u.rotation.x+=kt.pelvisPitch,u.rotation.z+=kt.pelvisRoll,u.position.x+=kt.pelvisX,u.position.z+=kt.pelvisZ,u.position.y-=kt.crouch;const ne=h.enabled?pn(h.weight,0,1):0;d.position.y+=kt.crouch*(1-ne)}Et=X.velocity.x,Dt=X.velocity.z,Ht=X.bodyYaw,m.rotation.x+=Tt.upperPitch,m.rotation.z+=Tt.upperRoll,m.rotation.y+=Tt.upperYaw;const qt=pn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),Jt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=pn(Tt.upperShiftX*qt,-Jt,Jt),m.position.z+=pn(Tt.upperShiftZ*qt,-Jt,Jt),u.position.x+=Tt.comX,u.position.z+=Tt.comZ-Tt.pelvisBack,u.position.y-=Tt.drop;const Me=Tt.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(d.position.z+=Tt.pelvisBack*(1-Me),d.position.y+=Tt.drop*(1-Me),C.joint.rotation.x+=Tt.knee,N.joint.rotation.x+=Tt.knee,C.root.rotation.x-=Tt.hip,N.root.rotation.x-=Tt.hip,F.root.rotation.x+=Tt.arm,G.root.rotation.x+=Tt.arm*.8,X.attackPhase!=="idle"&&Tt.intensity===0){const b=X.attackProgress,k=b<.34?-1:b<.68?-1+(b-.34)/.34*2:Math.max(0,1-(b-.68)/.32),Y=Math.max(0,-k),K=Math.max(0,k);G.root.rotation.x=-1.7*Y+1.25*K,G.joint.rotation.x=-(.25+Y*.45),m.rotation.y=-.28*k,R.opacity=X.attackPhase==="active"?.85:0,X.attackPhase==="active"&&($.rotation.z=-1.1+b*3)}else R.opacity=0;const Le=Jd(st,r.chestYawScale,r.chestYawMaxDeg);m.rotation.y+=Le,D.rotation.y=(X.headYaw-X.bodyYaw-Le+Math.PI*3)%(Math.PI*2)-Math.PI,Yt=rh({root:p,pelvis:u,lower:d,limbs:P,base:Vt,cfg:h,grounded:!0,attacking:X.attackPhase!=="idle"})},ik(){return Yt},dispose(){p.traverse(X=>{if(X instanceof ue){X.geometry.dispose();const rt=X.material;Array.isArray(rt)?rt.forEach(_t=>_t.dispose()):rt.dispose()}}),J.dispose(),pt.dispose()}}}function oh(i){return{x:0,y:0,z:1}}function pv(i){return Math.asin(oh().y)}function mv(i,t){const e=Math.cos(t),n=Math.sin(t);return{x:i.x*e+i.z*n,y:i.y,z:-0*n+i.z*e}}function Ue(i,t,e){return i<t?t:i>e?e:i}const da=1e-6;function ve(i,t,e,n){const s=new ue(new Pn(i,t,e),new Ts({color:n}));return s.castShadow=!0,s.receiveShadow=!0,s}function Te(){return new Pe}function ya(i,t,e){const n=Te(),s=ve(t*.7,.12,t*.7,e.wood);s.position.y=.06,n.add(s);const a=ve(t*2.4,.045,t*.8,e.metal);a.position.y=.13,n.add(a);const r=ve(t*.38,i,t,e.blade);r.position.y=.13+i/2,n.add(r);const o=ve(t*.42,i*.96,t*.2,e.bladeEdge);o.position.set(0,.13+i/2,t*.5),n.add(o);const c=ve(t*.3,.09,t*.45,e.blade);return c.position.y=.13+i+.045,n.add(c),n}function gv(i){const t=ya(.72,.15,i),e=ve(.12,.46,.12,i.wood);return e.position.y=-.3,t.add(e),t}function _v(i){const t=Te(),e=ve(.32,.38,.06,i.metal);e.position.set(0,.02,.1),t.add(e);const n=ve(.11,.11,.045,i.blade);return n.position.set(0,.02,.145),t.add(n),t}function xv(i){const t=Te(),e=ve(.055,.88,.055,i.wood);e.position.y=.42,t.add(e);const n=ve(.15,.15,.15,i.glow);n.position.y=.92;const s=n.material;return s.emissive=new Zt(i.glow),s.emissiveIntensity=.85,t.add(n),{g:t,orb:n}}function vv(i){const t=Te();for(let n=0;n<5;n++){const s=(n-2)*.15,a=ve(.055,.16,.05,i.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ve(.014,.66,.014,i.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Mv(i){const t=Te(),e=ve(.025,.025,.46,i.wood);e.position.z=.23,t.add(e);const n=ve(.055,.055,.09,i.blade);return n.position.z=.5,t.add(n),t}function yv(i,t,e,n,s,a,r,o,c,l,h){const p=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},d=Te(),m=Te();m.name="pelvis",m.position.y=i.legLength,d.add(m);const _=Te();_.name="lower";const g=Te();g.name="upper",m.add(_),m.add(g);const f=i.headSize,x=i.legLength,M=i.armLength,v=i.limbThickness,L=i.bodyHeight,w=i.bodyWidth,A=ve(w,L,.28,t.body);A.position.y=L/2,g.add(A);const D=Te();D.name="headPivot",D.position.y=n.headPivotHeight,g.add(D);const E=ve(f,f,f,t.head);E.position.y=f/2,D.add(E);const S=new Ts({color:"#1b2733"});for(const et of[-1,1]){const bt=new ue(new Pn(.06,.07,.02),S);bt.position.set(et*.09,f/2+.03,f/2+.011),D.add(bt)}const C=et=>{const bt=Te();bt.name=et<0?"hipL":"hipR",bt.rotation.order="ZYX",bt.position.set(et*(w/2-v/2),0,0),_.add(bt);const wt=ve(v,x/2,v,t.limb);wt.position.y=-x/4,bt.add(wt);const Vt=Te();Vt.name="knee",Vt.position.y=-x/2,bt.add(Vt);const qt=ve(v,x/2,v,t.limb);qt.position.y=-x/4,Vt.add(qt);const Jt=ve(v*1.15,.07,v*1.7,t.shoe);Jt.position.set(0,-x/2+.035,.045),Vt.add(Jt);const Me=new be;return Me.name="footTip",Me.position.y=-x/2,Vt.add(Me),{root:bt,joint:Vt,hand:Te(),tip:Me}},N=et=>{const bt=Te();bt.name=et<0?"shoulderL":"shoulderR",bt.position.set(et*(w/2+v/2),L-.04,0),g.add(bt);const wt=ve(v,M/2,v,t.limb);wt.position.y=-M/4,bt.add(wt);const Vt=Te();Vt.name="elbow",Vt.position.y=-M/2,bt.add(Vt);const qt=ve(v,M/2,v,t.limb);qt.position.y=-M/4,Vt.add(qt);const Jt=Te();Jt.position.y=-M/2,Vt.add(Jt);const Me=ve(v*1.1,.09,v*1.1,t.head);return Me.position.y=.045,Jt.add(Me),{root:bt,joint:Vt,hand:Jt}},F=C(-1),G=C(1),P=N(-1),R=N(1),$=[F,G].map(et=>({root:et.root,joint:et.joint,tip:et.tip,upperLen:x/2,lowerLen:x/2,bend:1})),z=Te(),V=Te();R.hand.add(z),P.hand.add(V);const J=xv(t),pt=vv(t),ct=Mv(t),lt={"sword-shield":{right:ya(.42,.075,t),left:_v(t)},"dual-swords":{right:ya(.42,.075,t),left:ya(.42,.075,t)},greatsword:{right:gv(t),left:ve(.12,.2,.12,t.wood)},staff:{right:J.g,left:Te(),orb:J.orb},bow:{right:ct,left:pt.g,arrow:ct,drawString:pt.drawString}};for(const et of Object.keys(lt))z.add(lt[et].right),V.add(lt[et].left),lt[et].right.visible=!1,lt[et].left.visible=!1;let q=null,Q=0,ht=0,it=0,vt=0,Et=0,Dt=0,Ht=rv(),Ct={...fc},Lt=0,U=0,Yt=0,Pt=-1,It=0,Z=0,ut=0,mt=0,T=0,y=0,B=0,tt=1,st=0,nt=0,X=0,rt=!1,_t=0,Tt=0,ft=0,gt=0,O=0,ot=1,dt={speed:0,phase:0},Ut={lp:0,lr:0,rp:0,rr:0},Ft=0,Gt=0,I=!0,yt=0,j="none",at=0,St=0,xt=0,Bt=.3,ee=0;function se(et){const bt=Math.PI/180,wt=a;let Vt=0,qt=0,Jt=0,Me=0;et==="sword-shield"?(Vt=wt.swordPitchDeg*bt,qt=-wt.swordYawDeg*bt,Jt=wt.shieldPitchDeg*bt):et==="dual-swords"?(Vt=wt.swordPitchDeg*bt,qt=-wt.swordYawDeg*bt,Jt=wt.swordPitchDeg*bt,Me=wt.swordYawDeg*bt):et==="greatsword"?(Vt=wt.greatswordPitchDeg*bt,qt=-wt.greatswordYawDeg*bt,Jt=wt.greatswordPitchDeg*bt,Me=wt.greatswordYawDeg*bt):et==="staff"?Vt=wt.staffPitchDeg*bt:Jt=wt.bowPitchDeg*bt,z.rotation.set(Vt,0,qt),V.rotation.set(Jt,0,Me)}function Wt(et){if(et!==q){q=et;for(const bt of Object.keys(lt))lt[bt].right.visible=bt===et,lt[bt].left.visible=bt===et;se(et),pt.drawString.position.z=-.06,ct.position.z=0,J.orb.scale.setScalar(1),g.rotation.y=0}}Wt("sword-shield");const pe=[];d.traverse(et=>{et instanceof ue&&et.material instanceof Ts&&pe.push(et.material)});const Se=new Zt(o.flashColor);function en(et,bt){const wt=ih(et,bt,o);Ht=wt,g.rotation.x+=wt.upperPitch,g.rotation.z+=wt.upperRoll,g.rotation.y+=wt.upperYaw;const Vt=Ue(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),qt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Ue(wt.upperShiftX*Vt,-qt,qt),g.position.z+=Ue(wt.upperShiftZ*Vt,-qt,qt),m.position.x+=wt.comX,m.position.z+=wt.comZ-wt.pelvisBack,m.position.y-=wt.drop;const Jt=wt.legacy?0:Ue(o.lowerScale,0,1);_.position.z+=wt.pelvisBack*(1-Jt),_.position.y+=wt.drop*(1-Jt),F.joint.rotation.x+=wt.knee,G.joint.rotation.x+=wt.knee,F.root.rotation.x-=wt.hip,G.root.rotation.x-=wt.hip,P.root.rotation.x+=wt.arm,R.root.rotation.x+=wt.arm*.8;for(const Me of pe)Me.emissive.copy(Se).multiplyScalar(wt.flash)}function Ke(et){return et<.3?-1:et<.62?-1+(et-.3)/.32*2:Math.max(0,1-(et-.62)/.38)}function me(et){if(et.phase==="idle"||et.charging)return;const bt=et.attackProgress,wt=Ke(bt),Vt=Math.max(0,wt),qt=et.comboIndex%2===0?1:-1,Jt=c.stride,Me=Number.isFinite(Jt.stepReach)?Jt.stepReach:.17,Le=Number.isFinite(Jt.stepSideReach)?Jt.stepSideReach:.14,b=Number.isFinite(Jt.stepDipReach)?Jt.stepDipReach:.05,k=et.weapon==="greatsword"?Ue(Number.isFinite(Jt.heavyScale)?Jt.heavyScale:1,0,1):1;m.position.z+=Me*Vt*k,m.position.x+=qt*Le*Vt*k,m.position.y-=b*Math.sin(Math.PI*bt)*k}function ge(et){if(pt.drawString.position.z=-.06,ct.position.z=0,J.orb.scale.setScalar(1),g.rotation.y=0,et.charging&&et.weapon==="bow"){const qt=et.charge;P.root.rotation.x=-1.25,P.joint.rotation.x=-.15,R.root.rotation.x=.35+qt*.3,R.joint.rotation.x=-1.15,pt.drawString.position.z=-.06-qt*.22,ct.position.z=-qt*.3,g.rotation.y=-.22;return}if(et.phase==="idle")return;const bt=Ke(et.attackProgress),wt=Math.max(0,-bt),Vt=Math.max(0,bt);if(et.weapon==="bow")P.root.rotation.x=-1.2,P.joint.rotation.x=-.15,R.root.rotation.x=.9-Vt*.8,R.joint.rotation.x=-.3;else if(et.weapon==="greatsword"){const qt=-1.6*wt+1.25*Vt,Jt=Ue(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);R.root.rotation.x=qt,R.joint.rotation.x=-(.25+wt*.4),P.root.rotation.x=qt+.06,P.joint.rotation.x=-(.32+wt*.4),P.root.rotation.z=.38,g.rotation.y=-.2*bt*Jt}else{const qt=et.comboIndex;if(qt===1)R.root.rotation.x=-1.7*wt+1.1*Vt,R.joint.rotation.x=-(.2+wt*.5),P.root.rotation.x=.1,g.rotation.y=-.18*bt;else if(qt===2)P.root.rotation.x=-1.5*wt+1*Vt,P.joint.rotation.x=-(.2+wt*.5),R.root.rotation.x=.2,g.rotation.y=.45*-bt;else{const Jt=-1.9*wt+1.2*Vt;P.root.rotation.x=Jt,R.root.rotation.x=Jt,P.joint.rotation.x=-(.15+wt*.4),R.joint.rotation.x=-(.15+wt*.4),g.rotation.y=-.3*bt}}me(et)}function Fe(et,bt){et&&(R.root.rotation.x=-1.05,R.joint.rotation.x=-.35,P.root.rotation.x=-.45,P.joint.rotation.x=-.2,g.rotation.y=-.12,J.orb.scale.setScalar(1.25+.12*Math.sin(bt*2)))}function he(et){if(!et||et.phase==="idle")return;const bt=et.progress,wt=bt<.3?-.35+bt/.3*1.35:bt<.7?1:Math.max(0,1-(bt-.7)/.3),Vt=Math.PI/180;g.rotation.x+=u.leanDeg*Vt*wt,P.root.rotation.x-=u.shieldPitchDeg*Vt*wt,P.joint.rotation.x-=.22*wt,R.root.rotation.x-=.3*wt,m.position.z+=u.pelvisReach*Math.max(0,wt)}return{group:d,update(et,bt,wt,Vt,qt=!1,Jt,Me){Wt(bt.weapon),g.rotation.x=0,g.rotation.z=0,m.position.x=0,m.position.y=x,m.position.z=0,m.rotation.z=0,m.rotation.x=0,g.position.x=0,g.position.y=0,g.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const Le=Math.max(1/240,Math.min(Vt,.1)),b=Jt===void 0?Ft+=Vt:Jt;Gt=b;const k=c.landing;k.enabled?I&&!et.grounded?(j="jump",at=b,St=k.anticipationDuration,xt=Math.max(0,k.jumpAnticipation),Bt=.32):!I&&et.grounded&&(j="land",at=b,St=k.duration,xt=av(yt,k),Bt=k.compressRatio,ee=yt):(j="none",xt=0),b<at&&(j="none",xt=0),I=et.grounded,yt=et.velocity.y;const Y=Jl(b,at,St,xt,Bt),K=bt.phase!=="idle";gt=nv(gt,K,Le,c.attack.blendRate);const H=iv(gt,c.attack.gaitWeight,c.attack.lowerBodyWeight);O=H.attackLegWeight,ot=H.gaitScale;const Mt=Math.sin(et.bodyYaw),Rt=Math.cos(et.bodyYaw),Nt=(et.velocity.x-Q)/Le,zt=(et.velocity.z-ht)/Le,Xt=Ue(Nt,-60,60),$t=Ue(zt,-60,60),kt=Xt*Mt+$t*Rt,ne=Rn(et.bodyYaw-it)/Le,oe=Math.hypot(et.velocity.x,et.velocity.z),ce=r.maxForwardDeg*Math.PI/180,De=r.maxSideDeg*Math.PI/180,ae=Ue(kt*r.accelGain,-ce,ce),Ot=Ue(-ne*oe*r.turnGain,-De,De),nn=1-Math.exp(-r.smoothing*Le);vt+=(ae-vt)*nn,Et+=(Ot-Et)*nn,Q=et.velocity.x,ht=et.velocity.z,it=et.bodyYaw;const te=Math.hypot(et.velocity.x,et.velocity.z),Ne=Ue(s.knockGaitScale??0,0,1),Gn=wt.knockX*Ne,ze=wt.knockZ*Ne,si=Ne>0&&Math.hypot(wt.knockX,wt.knockZ)>.001,re=et.velocity.x+Gn,We=et.velocity.z+ze,Vn=Math.hypot(re,We);ft=Vn;const $e=Math.cos(et.bodyYaw),vn=-Math.sin(et.bodyYaw),Mn=et.velocity.x*$e+et.velocity.z*vn,Ps=te>da?Ue(Mn/te,-1,1):0,ch=jd(Ps,n.legYawScale,n.hipYawMaxDeg,s.strafeHipBoost);U+=(ch-U)*(1-Math.exp(-n.hipYawSmoothing*Le));const cs=et.bodyYaw+U;Yt=cs;const lh=Math.sin(cs),dh=Math.cos(cs),hh=Math.cos(cs),uh=-Math.sin(cs),Ds={speed:Vn,phase:et.gaitPhase,localForward:re*lh+We*dh,localRight:re*hh+We*uh,stride:et.stride};K&&!rt&&(X=et.gaitPhase),rt=K;const wi=gt>0?tv(Ds,bt.attackProgress,bt.comboIndex,gt,c.stride,X):Ds;dt=wi;const pc=Math.max(0,s.stopBlendSec||0),mc=pc>0&&!K&&!si&&et.grounded,gc=Kd(te,st,e,s.stopEnterRatio,s.stopExitRatio);if(!mc||gc.resume)Pt=-1;else if(Pt<0&&gc.enter){Pt=0,It=et.gaitPhase,Z=Zd(et.gaitPhase),ut=te,mt=Math.max(et.stride,da),T=Ds.localForward,y=Ds.localRight;const Oe=1/Math.max(da,te);B=et.velocity.x*Oe,tt=et.velocity.z*Oe}st=te;const Ls=mc&&Pt>=0;Ls&&(Pt=Math.min(1,Pt+Le/pc));const _c=Ls?{phase:It,speed:ut,moveSpeed:e,localForward:T,localRight:y,legLength:i.legLength,stride:mt,grounded:!0}:{phase:wi.phase,speed:wi.speed,moveSpeed:e,localForward:wi.localForward,localRight:wi.localRight,legLength:i.legLength,stride:wi.stride??0,grounded:et.grounded},fh=Ls?qd(_c,s,{progress:Pt,phase0:It,phaseEnd:Z}):uc(_c,s),_e=sv(fh,H.gaitScale);let Va=0,Xa=0,xc=0;if(Ls){const Oe=Qd(et.bodyYaw,B,tt),xe=th(Pt,It,Oe.forward,Oe.right,s);xe.leadLeft?(_e.legL.pitchX-=xe.leadPitch,_e.legL.kneeX+=xe.leadKnee,_e.legR.pitchX+=xe.trailPitch):(_e.legR.pitchX-=xe.leadPitch,_e.legR.kneeX+=xe.leadKnee,_e.legL.pitchX+=xe.trailPitch),Xa=xe.bodyShift*xe.fwdN,Va=xe.bodyShift*xe.rightN,xc=xe.chestPitch,_t=xe.leadPitch,Tt=xe.bodyShift}else _t=0,Tt=0;Ut={lp:_e.legL.pitchX,lr:_e.legL.rollZ,rp:_e.legR.pitchX,rr:_e.legR.rollZ},et.grounded?(F.root.rotation.x=_e.legL.pitchX,G.root.rotation.x=_e.legR.pitchX,F.root.rotation.z=_e.legL.rollZ,G.root.rotation.z=_e.legR.rollZ,F.joint.rotation.x=_e.legL.kneeX,G.joint.rotation.x=_e.legR.kneeX,P.root.rotation.x=_e.armL,R.root.rotation.x=_e.armR,P.joint.rotation.x=-(.18+_e.armL*.2),R.joint.rotation.x=-(.18+_e.armR*.2),P.root.rotation.z=0,R.root.rotation.z=0,m.position.x=_e.pelvisX,m.position.y=x+_e.pelvisY,m.position.z=0,m.rotation.z=_e.pelvisRoll):(F.root.rotation.x=-.55,G.root.rotation.x=-.25,F.joint.rotation.x=.75,G.joint.rotation.x=.55,P.root.rotation.x=-.9,R.root.rotation.x=-.7,P.joint.rotation.x=-.6,R.joint.rotation.x=-.6,F.root.rotation.z=0,G.root.rotation.z=0);const ph=ah(m,_);m.position.x+=Va,m.position.z+=Xa,_.position.x-=Va,_.position.z-=Xa;const mh=te/Math.max(e,da),gh=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,_h=1-Math.exp(-Math.max(0,gh)*Le);Lt+=(Ue(mh,0,1)-Lt)*_h;const Ti=sh({leanForward:vt,leanSide:Et,speedRatio:Lt},r);m.rotation.x+=Ti.pelvisPitch,m.rotation.z+=Ti.pelvisRoll,m.position.x+=Ti.pelvisX,m.position.z+=Ti.pelvisZ,m.position.y-=Ti.crouch;const xh=p.enabled&&et.grounded?Ue(p.weight,0,1)*(K?Ue(p.attackScale,0,1):1):0;_.position.y+=Ti.crouch*(1-Ue(xh,0,1)),ge(bt),Fe(qt,et.gaitPhase),he(Me);const vh=a.greatswordPitchDeg*Math.PI/180,vc=bt.weapon==="greatsword",Mc=Math.hypot(et.velocity.x,et.velocity.z),Mh=vc&&bt.phase==="idle"&&Mc>.5?Math.min(1.15,Mc/Math.max(e,.001)*.9):0;Dt+=(Mh-Dt)*(1-Math.exp(-6*Le)),vc&&(z.rotation.x=vh+Dt),bt.weapon==="bow"&&(pt.g.rotation.x=-(P.root.rotation.x+P.joint.rotation.x),ct.rotation.x=-(R.root.rotation.x+R.joint.rotation.x));const yh=g.rotation.y;en(wt,et.bodyYaw);const yc=wt.type==="none"?1:.4;if(g.rotation.x+=vt*yc+xc,g.rotation.z+=(Et+_e.sideLean)*yc,Y>0&&(F.root.rotation.x-=k.hipPitch*Y,G.root.rotation.x-=k.hipPitch*Y,F.joint.rotation.x+=k.kneeBend*Y,G.joint.rotation.x+=k.kneeBend*Y,m.position.y-=k.crouchDepth*Y,_.position.y+=k.crouchDepth*(1-k.lowerScale)*Y,g.rotation.x+=k.upperPitch*Y,P.root.rotation.x-=k.armTuck*Y,R.root.rotation.x-=k.armTuck*Y),O>0&&et.grounded){const Oe=ev(bt.attackProgress,bt.comboIndex,c.stride),xe=O;F.root.rotation.x+=Oe.legL.pitchX*xe,G.root.rotation.x+=Oe.legR.pitchX*xe,F.root.rotation.z+=Oe.legL.rollZ*xe,G.root.rotation.z+=Oe.legR.rollZ*xe,F.joint.rotation.x+=Oe.legL.kneeX*xe,G.joint.rotation.x+=Oe.legR.kneeX*xe,m.position.x+=Oe.pelvisX*xe,m.position.y+=Oe.pelvisY*xe,m.rotation.z+=Oe.pelvisRoll*xe}_.rotation.y=U,nt=Jd(U,s.chestYawScale,s.chestYawMaxDeg),g.rotation.y+=nt;const Sh=yh;D.rotation.y=Rn(et.headYaw-et.bodyYaw-Sh-nt),Ct=rh({root:d,pelvis:m,lower:_,limbs:$,base:ph,cfg:p,grounded:et.grounded,attacking:K})},lean(){return{forward:vt,side:Et}},landing(){const et=Jl(Gt,at,St,xt,Bt),bt=St>0?Math.max(0,St-Math.max(0,Gt-at)):0;return{pulse:et,remaining:bt,kind:et>0?j:"none",impactVy:ee}},hurt(){return Ht},ik(){return Ct},attackBlend(){return gt},attackWeights(){return{gaitScale:ot,attackLegWeight:O,driveSpeed:dt.speed,stridePhase:dt.phase}},hipYaw(){return U},gaitDebug(){return{stopT:Pt,hipYaw:U,chestYaw:nt,speed:st,gaitSpeed:ft,stopStep:_t,stopShift:Tt,legLPitch:Ut.lp,legLRoll:Ut.lr,legRPitch:Ut.rp,legRRoll:Ut.rr}},gaitYaw(){return Yt},arrowDirection(){ct.updateWorldMatrix(!0,!1);const et=ct.matrixWorld.elements,bt=et[8],wt=et[9],Vt=et[10],qt=Math.hypot(bt,wt,Vt)||1;return{x:bt/qt,y:wt/qt,z:Vt/qt}},dispose(){d.traverse(et=>{if(et instanceof ue){et.geometry.dispose();const bt=et.material;Array.isArray(bt)?bt.forEach(wt=>wt.dispose()):bt.dispose()}})}}}function Sv(i,t){switch(i){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function bv(i,t,e){const n=Math.max(1,i.clientWidth),s=Math.max(1,i.clientHeight),a=new Fx({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=ud,a.setSize(n,s,!1),i.appendChild(a.domElement);const r=new Nx;r.background=new Zt("#12161d"),r.add(new Vx(11061486,2764600,1.15));const o=new $x(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],h=new Pe;for(const Z of t.boxes){const ut=Z.maxX-Z.minX,mt=Z.maxY-Z.minY,T=Z.maxZ-Z.minZ;let y=Sv(Z.kind,e);Z.kind==="step"&&(y=new Zt(y).offsetHSL(0,0,Z.maxY*.09).getStyle());const B=new Ts({color:y,transparent:!0,opacity:1}),tt=new ue(new Pn(ut,mt,T),B);tt.position.set((Z.minX+Z.maxX)/2,(Z.minY+Z.maxY)/2,(Z.minZ+Z.maxZ)/2),tt.castShadow=Z.kind!=="ground",tt.receiveShadow=!0,tt.add(new Xd(new Gx(tt.geometry),new lc({color:10467020,transparent:!0,opacity:.32}))),h.add(tt),l.push(B)}r.add(h);const p=t.gridMeta.maxX-t.gridMeta.minX,u=new Zx(p,p,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const d=yv(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),m=new Pe,_=.9,g=new Pe;g.position.y=_,d.group.position.y=-_,g.add(d.group),m.add(g),r.add(m);const f=t.dummies.map((Z,ut)=>{const mt=e.dummies.colors,T=mt[ut%mt.length]??"#cccccc",y=fv(e.voxel,e.colors,T,Z.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return y.group.traverse(B=>{B.userData.dummyId=Z.id}),r.add(y.group),y}),x=f.map(Z=>Z.group),M=new Yx,v=e.targeting.ringRadius,L=new bn({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:Ge,depthWrite:!1}),w=new ue(new qi(v-.07,v,28),L);w.rotation.x=-Math.PI/2,w.position.y=.03,w.visible=!1,r.add(w);const A=new Pe;r.add(A);const D=new bn({color:12577023,transparent:!0,opacity:0,side:Ge,depthWrite:!1}),E=new Pe;E.position.set(0,.95,.72),A.add(E);const S=new Pe;S.rotation.x=pv(e.camera.pitchDeg),E.add(S);const C=new ue(new Ga(.78,.045,6,24,Math.PI*1.15),D);S.add(C);const N=new hc(1,0),F=new bn({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),G=Array.from({length:16},()=>{const Z=new ue(N,F);return Z.visible=!1,r.add(Z),Z}),P=new qi(.86,1,40),R=Array.from({length:6},()=>{const Z=new bn({color:10146047,transparent:!0,opacity:0,side:Ge,depthWrite:!1}),ut=new ue(P,Z);return ut.rotation.x=-Math.PI/2,ut.visible=!1,r.add(ut),{mesh:ut,mat:Z}}),$=new bn({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),z=new ue(new Pn(.035,.035,.5),$);A.add(z);const V=e.dash,J=new qi(V.ringRadius-.06,V.ringRadius,28),pt=Array.from({length:6},()=>{const Z=new bn({color:16777215,transparent:!0,opacity:0,side:Ge,depthWrite:!1}),ut=new ue(J,Z);return ut.rotation.x=-Math.PI/2,ut.visible=!1,r.add(ut),{mesh:ut,mat:Z,life:0,base:1}});function ct(Z,ut,mt,T,y){const B=pt.find(tt=>tt.life<=0)??pt[0];B.mat.color.set(T),B.mesh.position.set(Z,mt+.04,ut),B.base=y,B.mesh.scale.setScalar(y*.6),B.mesh.visible=!0,B.mat.opacity=.9,B.life=V.fxDuration}const lt=e.links,q=new qi(lt.ringRadius-.07,lt.ringRadius,28),Q=Array.from({length:5},()=>{const Z=new bn({color:lt.chargeColor,transparent:!0,opacity:0,side:Ge,depthWrite:!1}),ut=new ue(q,Z);return ut.rotation.x=-Math.PI/2,ut.visible=!1,r.add(ut),{mesh:ut,mat:Z,life:0,base:1}});function ht(Z,ut,mt,T){const y=Q.find(B=>B.life<=0)??Q[0];y.mesh.position.set(Z,mt+.05,ut),y.base=T,y.mesh.scale.setScalar(T*.55),y.mesh.visible=!0,y.mat.opacity=.85,y.life=lt.fxDuration}let it=t.playerLink.id,vt=t.playerLink.hitIds.length,Et=t.dash.id,Dt="none",Ht=0,Ct=-1,Lt=1;const U=jx(e.camera,e.smartCamera,e.zoom,n/s),Yt=t.character.position;U.update(Yt.x,Yt.y,Yt.z,1,t.camera);function Pt(Z,ut){if(x.length===0)return 0;const mt=a.domElement.getBoundingClientRect(),T=new jt((Z-mt.left)/mt.width*2-1,-((ut-mt.top)/mt.height)*2+1);M.setFromCamera(T,U.camera);const y=M.intersectObjects(x,!0);for(const B of y){const tt=B.object.userData.dummyId;if(tt&&tt>0)return tt}return 0}function It(Z,ut,mt){const T=a.domElement.getBoundingClientRect(),y=new W(Z,ut,mt).project(U.camera);return{x:T.left+(y.x*.5+.5)*T.width,y:T.top+(-y.y*.5+.5)*T.height}}return{gaitDebug(){return d.gaitDebug()},render(Z,ut){const mt=Z.character,T=Z.combat;m.position.set(mt.position.x,mt.position.y,mt.position.z),m.rotation.y=mt.bodyYaw;const y=Z.dash.phase==="active"&&Z.dash.kind==="roll",B=y&&Z.dash.duration>0?Math.min(1,1-Z.dash.timer/Z.dash.duration):0;g.rotation.x=y?B*Math.PI*2:0,g.position.y=_-(y?.2*Math.sin(Math.PI*B):0),d.update(mt,T,Z.playerHurt,ut,Z.abilities.channeling,Z.time,Z.playerLink);for(let X=0;X<f.length;X++)Z.dummies[X]&&f[X].update(Z.dummies[X],ut);const tt=Z.targeting.hasTarget?Z.dummies[Z.targeting.targetId-1]:void 0;if(w.visible=!!tt,tt&&(w.position.set(tt.position.x,tt.position.y+.03,tt.position.z),w.scale.setScalar(1+.07*Math.sin(Z.time*6))),A.position.set(mt.position.x,mt.position.y,mt.position.z),A.rotation.y=T.phase!=="idle"?T.attackFacing:mt.bodyYaw,Z.dash.id!==Et){Et=Z.dash.id;const X=Z.dash;Dt=X.kind,X.kind==="blink"?(ct(X.fromX,X.fromZ,mt.position.y,V.blinkColor,.9),ct(X.toX,X.toZ,mt.position.y,V.blinkColor,1.35)):ct(X.fromX,X.fromZ,mt.position.y,V.rollColor,1.1)}for(const X of pt){if(X.life<=0)continue;X.life-=ut;const rt=Math.max(0,X.life/V.fxDuration);X.mat.opacity=.9*rt,X.mesh.scale.setScalar(X.base*(.6+(1-rt)*1.2)),X.life<=0&&(X.mesh.visible=!1)}const st=Z.playerLink;st.id!==it&&(it=st.id,vt=st.hitIds.length,ht(mt.position.x,mt.position.z,mt.position.y,1)),st.hitIds.length>vt?(vt=st.hitIds.length,ht(mt.position.x,mt.position.z,mt.position.y,1.35)):st.hitIds.length<vt&&(vt=st.hitIds.length);for(const X of Q){if(X.life<=0)continue;X.life-=ut;const rt=Math.max(0,X.life/Math.max(lt.fxDuration,1e-6));X.mat.opacity=.85*rt,X.mesh.scale.setScalar(X.base*(.55+(1-rt)*1.1)),X.life<=0&&(X.mesh.visible=!1)}T.attackId!==Ht&&(Ht=T.attackId,T.weapon==="bow"&&T.phase!=="idle"&&(Ct=0,Lt=.6+T.lastCharge*.9));const nt=T.phase==="active"&&T.comboIndex>0;D.opacity=nt?.78:0,nt&&(C.rotation.z=-1.2+T.attackProgress*3.2,C.scale.setScalar(.9+T.comboIndex*.13));for(let X=0;X<G.length;X++){const rt=Z.abilities.projectiles[X],_t=G[X];_t.visible=!!rt,rt&&(_t.position.set(rt.x,rt.y,rt.z),_t.scale.setScalar(rt.radius),_t.rotation.y+=ut*6)}for(let X=0;X<R.length;X++){const rt=Z.abilities.rings[X],_t=R[X];if(_t.mesh.visible=!!rt,rt){const Tt=Math.max(0,Math.min(1,rt.life/Math.max(rt.duration,1e-6)));_t.mesh.position.set(rt.x,.05,rt.z),_t.mesh.scale.setScalar(rt.radius),_t.mat.opacity=.25+.55*Tt}}if(Ct>=0){Ct+=ut;const X=Ct*14*Lt;z.position.set(0,.85,.6+X),$.opacity=X<9?.95:0,X>=9&&(Ct=-1)}else $.opacity=0;U.update(mt.position.x,mt.position.y,mt.position.z,ut,Z.camera),a.render(r,U.camera)},resize(){const Z=Math.max(1,i.clientWidth),ut=Math.max(1,i.clientHeight);a.setSize(Z,ut,!1),U.resize(Z/ut)},getGroundBasis(){return U.getGroundBasis()},setCollidersVisible(Z){for(const ut of l)ut.opacity=Z?.3:1,ut.wireframe=Z,ut.needsUpdate=!0},setGridVisible(Z){u.visible=Z},setZoom(Z){U.setZoom(Z)},pickDummy:Pt,projectToScreen:It,diagnostics(){const Z=oh(e.camera.pitchDeg),ut=mv(Z,A.rotation.y);return{lean:d.lean(),slashNormal:ut,arrowForward:d.arrowDirection(),gait:{hipYaw:d.hipYaw(),gaitYaw:d.gaitYaw()},attackBlend:d.attackBlend(),attackWeights:d.attackWeights(),landing:d.landing(),hurt:d.hurt(),ik:d.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:g.rotation.x,activeRings:pt.filter(mt=>mt.life>0).length,lastKind:Dt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...U.smart()}}},dispose(){d.dispose();for(const Z of f)Z.dispose();w.geometry.dispose(),L.dispose(),C.geometry.dispose(),D.dispose(),N.dispose(),F.dispose(),P.dispose();for(const Z of R)Z.mat.dispose();z.geometry.dispose(),$.dispose();for(const Z of pt)Z.mat.dispose();J.dispose();for(const Z of Q)Z.mat.dispose();q.dispose(),h.traverse(Z=>{Z instanceof ue&&Z.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}async function Ev(i){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(i),!0}catch{}try{const t=document.createElement("textarea");t.value=i,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,i.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function wv(i,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=i,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),2e3)}function Tv(i,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const n=x=>e.querySelector(`#${x}`),s=n("diag-status"),a=n("diag-text"),r=n("diag-copy"),o=n("diag-json"),c=n("diag-clear"),l=n("diag-toggle"),h=n("diag-close"),p=n("diag-mask");let u=!1,d=!0,m=0;function _(){const x=i.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function g(x){u=x,e.hidden=!x,x?_():a.hidden=!0}function f(x){r.textContent=x,window.clearTimeout(m),m=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),g(!u)}),h.addEventListener("click",()=>g(!1)),p.addEventListener("click",()=>g(!1)),r.addEventListener("click",()=>{const x=i.summary();Ev(x).then(M=>{M?(f("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),f("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=i.dump(),M=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);wv(`harness-${x.meta.version}-${M}.json`,JSON.stringify(x)),f("已导出")}),c.addEventListener("click",()=>{i.clear(),a.hidden=!0,_(),f("已清空")}),l.addEventListener("click",()=>{d=!d,i.setEnabled(d),_()}),{tick(){const x=i.status();t==null||t.classList.toggle("is-alert",x.alert),u&&_()},isOpen:()=>u,close:()=>g(!1)}}const Av={intents:{...Ql},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function Rv(){const i=document.getElementById("app"),t=document.getElementById("hud");if(!i||!t)throw new Error("缺少 #app / #hud 容器");const e=wu(rf,of),n=bv(i,e,dn),s=Au(e),a=kf(t),r=Ff(t,document.getElementById("hint")),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.18 · 11-07 02:59 · 诊断");const c=S=>String(S).padStart(2,"0"),l=new Date,h=tf({meta:{version:"v0.9.18",buildTime:"11-07 02:59",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),p=Tv(h,o),u=Df({deadZone:()=>dn.joystick.deadZone});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const d={timeScale:1,paused:!1,showColliders:dn.showColliders,showGrid:dn.showGrid};let m=1;const _=Vu({maxRadiusPx:()=>dn.joystick.maxRadiusPx,deadZone:dn.joystick.deadZone,getBasis:()=>n.getGroundBasis(),zoom:()=>dn.zoom}),g=Array.from(document.querySelectorAll(".wp[data-weapon]"));let f=e.combat.weapon;function x(S){if(S===f)return;f=S;const C=yi.indexOf(S)+1;for(const N of g)N.classList.toggle("is-active",Number(N.dataset.weapon)===C);L.refreshWeapon()}let M=Av,v=0;const L=Mf(e,dn,d,{singleStep:()=>s.singleStep(M.intents),reset:()=>{m=1,s.singleStep({...Ql,resetPressed:!0})},resetZoom:()=>{m=1,n.setZoom(1)},onToggleColliders:S=>n.setCollidersVisible(S),onToggleGrid:S=>n.setGridVisible(S)});window.addEventListener("resize",()=>n.resize()),window.__harness={world:e,view:n,clock:s,input:_,viewConfig:dn,getUserZoom:()=>m,getGestures:()=>M.gestures,getLastGesture:()=>M.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:u.dirDebug,dirAngles:()=>u.dirDebug.last(),motionDebug:u,speedDebug:()=>u.last(),speedSamples:()=>u.samples(),gaitDebug:()=>n.gaitDebug()};let w=performance.now(),A=60,D=0;function E(S){const C=Math.min((S-w)/1e3,.1);w=S,C>0&&(A=A*.9+1/C*.1);const N=_.sample();N.intents.resetPressed&&(m=1),m=Iu(m,N.zoomScale,dn.zoom.min,dn.zoom.max),n.setZoom(m);let F=N.intents.dummyClickId;if(N.tap){const R=n.pickDummy(N.tap.x,N.tap.y);R>0&&(F=R)}F>0&&(v=F),M={...N,intents:{...N.intents,dummyClickId:v}};const G=s.frame(C,M.intents,d.timeScale,d.paused,()=>{const R=e.events;for(let $=0;$<R.length;$++)h.event(R[$],e.time)});G>0&&(v=0),h.sample(e,M,C*1e3,G);for(const R of M.gestures)h.gesture(R);S-D>250&&(D=S,p.tick()),x(e.combat.weapon),n.render(e,C),u.update(e,M,n.getGroundBasis());const P=n.diagnostics();a.update(e,A,G,M,d,{attackBlend:P.attackBlend,attackWeights:P.attackWeights,landing:P.landing,hurt:P.hurt,ik:P.ik,zoom:P.camera.zoom},r.hudCompact()),requestAnimationFrame(E)}requestAnimationFrame(E)}Rv();

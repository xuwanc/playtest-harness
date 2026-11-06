(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const yi=["sword-shield","dual-swords","greatsword","staff","bow"],Oa=["wander","follow","keep-distance","attack","idle"],$l={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},xa=1e-6;function Da(i,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>xa?Math.atan2(t.aimX,t.aimZ):i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget?i.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>xa?Math.atan2(t.moveX,t.moveZ):i.character.facing}function dh(i,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>xa){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>xa)return{x:t.moveX/e,z:t.moveZ/e};const n=i.character.facing;return{x:Math.sin(n),z:Math.cos(n)}}const sn=1e-6,Dr=Math.PI/180;function Yl(){return{type:"none",timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Lr(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function _c(i,t,e,n,s){i.type=t,i.duration=e,i.timer=e,i.dirX=n,i.dirZ=s,i.knockX=0,i.knockZ=0}function No(i,t,e){const n=e.duration>0?e.duration:Oo(i,e.type);if(t.kind==="player"){const a=i.playerHurt;if(_c(a,e.type,n,e.dirX,e.dirZ),!i.config.hits.noDamageToPlayer&&e.knockback>sn){const r=e.knockback*i.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}Lr(i,"player-hurt",e.sourceId??0,i.character.position);return}const s=i.dummies[t.index];if(s){if(_c(s.hurt,e.type,n,e.dirX,e.dirZ),e.knockback>sn){const a=e.knockback*i.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}i.hitCount+=1,Lr(i,"hit",s.id,s.position)}}function zo(i,t,e){No(i,{kind:"dummy",index:t},e)}function hh(i,t){const e=[i.playerHurt];for(const s of i.dummies)e.push(s.hurt);const n=Math.exp(-i.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=n,s.knockZ*=n,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function Oo(i,t){const e=i.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function uh(i){const t=i.combat,e=i.config.hits,n=i.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Dr),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=i.config.dummies.radius,l=i.config.targeting.idealRange;for(const h of i.dummies){const f=h.position.x-n.x,p=h.position.z-n.z,d=Math.hypot(f,p);if(d>s+c)continue;const g=d>sn?f/d:r,_=d>sn?p/d:o;if(d>sn&&(f*r+p*o)/d<a)continue;let m="light";t.weapon==="greatsword"?m="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(m="heavy");const u=e.knockback[t.weapon]??0;let x=d;u>0&&(x=Math.max(d+u,l));const S=Math.max(0,x-d);zo(i,i.dummies.indexOf(h),{type:m,duration:Oo(i,m),dirX:g,dirZ:_,knockback:S})}}function fh(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="active")return;const s=n.weapon===""?void 0:e.moves[n.weapon];if(!s||!s.enabled||!i.modules.hits||!i.modules.dummies)return;const a=s.hit;if(n.pulseTimer-=t,n.pulseTimer>0)return;n.pulseTimer=Math.max(a.pulseInterval,0);const r=i.character.position,o=n.fromX,c=n.fromZ,l=r.x,h=r.z,f=l-o,p=h-c,d=f*f+p*p,g=Math.sin(n.facing),_=Math.cos(n.facing),m=Math.cos(xc(a.arcDeg,0,180)*Dr),u=i.config.dummies.radius;for(let x=0;x<i.dummies.length;x++){const S=i.dummies[x];if(n.hitIds.indexOf(S.id)>=0)continue;const v=d>sn?xc(((S.position.x-o)*f+(S.position.z-c)*p)/d,0,1):0,D=o+f*v,A=c+p*v,C=Math.hypot(S.position.x-D,S.position.z-A);let L=!1;if(a.shape==="circle")L=C<=a.radius+u;else if(a.shape==="capsule")L=C<=Math.max(a.radius,a.width)+u;else{const W=S.position.x-l,R=S.position.z-h,T=Math.hypot(W,R),O=T>sn?(W*g+R*_)/T>=m:!0;L=T<=a.radius+u&&O||C<=a.width+u}if(!L)continue;const b=S.position.x-o,y=S.position.z-c,P=Math.hypot(b,y);if(P>sn&&(b*g+y*_)/P<Math.cos(Math.max(a.arcDeg,90)*Dr))continue;const B=P>sn?b/P:g,U=P>sn?y/P:_;No(i,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:B,dirZ:U,knockback:a.knockback}),n.hitIds.push(S.id),Lr(i,"link-hit",S.id,S.position)}}function ph(i){const t=i.config.hits,e=i.character.position;for(const n of i.events){if(n.type!=="dummy-hit")continue;const s=i.dummies[n.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>sn?a/o:0,l=o>sn?r/o:1;No(i,{kind:"player"},{type:"light",duration:Oo(i,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function mh(i,t){if(!i.modules.hits)return;i.events.some(n=>n.type==="attack-active")&&uh(i),fh(i,t),ph(i)}function xc(i,t,e){return i<t?t:i>e?e:i}const oa=1e-6;function Ss(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function gh(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function _h(i){const t=i.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function xh(i){const t=i.abilities,e=i.config.abilities.arcane,n=i.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:n.x+s*r,y:n.y+1,z:n.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,Ss(i,"projectile-fire",t.volleyId,o)}function vh(i,t,e){const n=i.abilities,s=i.config.abilities.arcane,a=i.dash.phase==="active",r=i.playerLink;if(i.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){n.channeling||(n.channeling=!0,n.fireTimer=0,Ss(i,"channel-start",0,i.character.position)),n.channelYaw=Da(i,e),n.fireTimer-=t;let c=0;for(;n.fireTimer<=0&&c++<8;)n.fireTimer+=Math.max(s.fireInterval,oa),xh(i)}else n.channeling&&(n.channeling=!1,Ss(i,"channel-end",0,i.character.position))}function Mh(i,t){const e=i.config.abilities.ring,n=i.dash.phase==="active";if(i.combat.weapon!=="staff"||!t.skill2Pressed||n)return;const s=i.character.position,a={id:++i.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};i.abilities.rings.push(a),Ss(i,"ring-place",a.id,s)}function yh(i,t){const e=i.abilities,n=i.config.abilities.arcane,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],f=h.position.x-o.x,p=h.position.z-o.z,d=o.radius+s;if(!(f*f+p*p>d*d)){zo(i,l,{type:n.hurtType,duration:n.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:n.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function Sh(i,t){const e=i.abilities,n=i.config.abilities.ring,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(n.pulseInterval,oa),a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],f=h.position.x-o.x,p=h.position.z-o.z,d=o.radius+s;if(f*f+p*p>d*d)continue;const g=Math.hypot(f,p),_=g>oa?f/g:0,m=g>oa?p/g:1;zo(i,l,{type:"heavy",duration:n.stun,dirX:_,dirZ:m,knockback:n.knockback})}Ss(i,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function bh(i,t,e){vh(i,t,e),Mh(i,e),yh(i,t),Sh(i,t)}function Ba(i){i.rngState=i.rngState+1831565813>>>0;let t=i.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const vc=1e-6;function Mc(i,t,e){return i<t?t:i>e?e:i}function Zl(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function ql(i){const t=i.camera,e=Zl();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=i.character.position.x,t.centroidZ=i.character.position.z}function Eh(i){const t=i.camera,e=i.config.camera,n=i.character.position;let s=0,a=0,r=0,o=0;for(const l of i.dummies){const h=l.position.x-n.x,f=l.position.z-n.z,p=Math.hypot(h,f);if(p>e.radius)continue;const d=Mc((e.radius-p)/Math.max(vc,e.radius-e.nearDistance),0,1);let g=d*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(g+=e.attackBoost*d),s+=g,a+=l.position.x*g,r+=l.position.z*g,o+=1}const c=s<=0?0:Mc(s/(s+Math.max(vc,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=n.x,t.centroidZ=n.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,h=r/s;t.centroidX=l,t.centroidZ=h;let f=(l-n.x)*e.framingBias*c,p=(h-n.z)*e.framingBias*c;const d=Math.hypot(f,p);d>e.maxOffset&&(f=f/d*e.maxOffset,p=p/d*e.maxOffset),t.offsetX=f,t.offsetZ=p}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function wh(i){const t=[],e=i.ground.size;t.push(Ai("ground","ground",0,0,e,e,-i.ground.thickness,0));for(const n of i.steps)t.push(Ai(n.id,"step",n.x,n.z,n.width,n.depth,0,n.height));for(const n of i.doorways){const s=n.openingWidth/2,a=n.wallThickness;t.push(Ai(`${n.id}-left`,"wall",n.x-s-n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(Ai(`${n.id}-right`,"wall",n.x+s+n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(Ai(`${n.id}-lintel`,"lintel",n.x,n.z,n.openingWidth,a,n.openingHeight,n.wallHeight))}for(const n of i.obstacles)t.push(Ai(n.id,"obstacle",n.x,n.z,n.width,n.depth,0,n.height));return t}function Ai(i,t,e,n,s,a,r,o){return{id:i,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:n-a/2,maxZ:n+a/2}}const Nn=1e-6;function va(i,t,e){return i<t?t:i>e?e:i}function Ir(i,t,e,n,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of i)l.maxY>n+a+Nn||l.maxY<n-r-Nn||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Bo(i,t,e,n,s){let a=!1;const r=t.y+n;for(let o=0;o<2;o++)for(const c of i){if(c.maxY<=t.y+s+Nn||c.minY>=r-Nn)continue;const l=va(t.x,c.minX,c.maxX),h=va(t.z,c.minZ,c.maxZ),f=t.x-l,p=t.z-h,d=f*f+p*p;if(!(d>=e*e))if(a=!0,d>Nn*Nn){const g=Math.sqrt(d),_=(e-g)/g;t.x+=f*_,t.z+=p*_}else{const g=t.x-c.minX,_=c.maxX-t.x,m=t.z-c.minZ,u=c.maxZ-t.z,x=Math.min(g,_,m,u);x===g?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===m?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function Ho(i,t,e,n,s){const a=t.y+n;for(const r of i){if(r.maxY<=t.y+s+Nn||r.minY>=a-Nn)continue;const o=va(t.x,r.minX,r.maxX),c=va(t.z,r.minZ,r.maxZ),l=t.x-o,h=t.z-c;if(l*l+h*h<e*e-Nn)return!0}return!1}const kr=1e-6;function Tn(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Ha(i,t,e,n){const s=Tn(t-i);return i+s*(1-Math.exp(-Math.max(e,kr)*n))}function yc(i,t,e,n){const s=Tn(t-i),a=Math.abs(s);return a<=n||a<=e?t:Tn(i+Math.sign(s)*Math.max(e,0))}function Ah(i,t,e){const n=i.character,s=i.config.orientation,a=i.combat,r=Math.hypot(e.moveX,e.moveZ),o=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>kr,c=i.abilities.channeling,l=a.charging&&a.weapon==="bow"&&i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget;if(a.phase!=="idle")n.facing=a.attackFacing;else if(o||c)n.facing=Da(i,e);else if(l)n.facing=i.targeting.targetYaw;else if(r>Math.max(s.facingDeadZone,kr)){const g=Math.atan2(e.moveX,e.moveZ),_=s.facingTurnRate*Math.PI/180*t,m=s.facingSnapDeg*Math.PI/180;if(r>=.35)n.facing=yc(n.facing,g,_,m);else if(r>=s.facingMinMagnitude&&Math.abs(Tn(g-n.facing))>s.facingDeadbandDeg*Math.PI/180){const x=Ha(n.facing,g,s.facingSmoothRate,t);n.facing=yc(n.facing,x,_,0)}}const h=n.velocity;Math.hypot(h.x,h.z)>.15&&(n.moveYaw=Math.atan2(h.x,h.z)),n.bodyYaw=Ha(n.bodyYaw,n.facing,s.bodyTurnRate,t);let f=Ha(n.headYaw,n.facing,s.headTurnRate,t);const p=s.maxHeadTurnDeg*Math.PI/180,d=Tn(f-n.bodyYaw);d>p?f=n.bodyYaw+p:d<-p&&(f=n.bodyYaw-p),n.headYaw=f}const Ur=1e-6,Th=Math.PI/180;function Fr(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Go(i,t,e){return i<t?t:i>e?e:i}function La(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Nr(i){const t=i.id,e=i.windowId;Object.assign(i,La()),i.id=t,i.windowId=e}function Rh(i){Nr(i)}function Ch(i){Nr(i.playerLink);for(const t of i.dummies)Nr(t.link)}function Ph(i,t){const e=[i.playerLink];for(const n of i.dummies)e.push(n.link);for(const n of e)n.linkWindow=Math.max(0,n.linkWindow-t),n.cooldown=Math.max(0,n.cooldown-t),n.linkWindow===0&&n.phase==="idle"&&n.source!=="none"&&(n.source="none",n.usedWindowId=-1)}function zr(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(n.linkWindow=Math.max(n.linkWindow,s),n.source=t,n.windowId+=1,n.usedWindowId=-1,n.prevSprinting=!1)}function Ma(i){const t=i.playerLink;if(t.phase==="idle")return;const e=t.id,n=t.windowId;Object.assign(t,La()),t.id=e,t.windowId=n,t.fromX=i.character.position.x,t.fromZ=i.character.position.z}function Dh(i,t){const e=i.config.links.search,n=i.character.position,s=Go(e.maxAngleDeg,0,180)*Th;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of i.dummies){const l=c.position.x-n.x,h=c.position.z-n.z,f=Math.hypot(l,h);if(f<Ur||f>e.range)continue;const p=Math.atan2(l,h);Math.abs(Tn(p-t))>s||f<o&&(o=f,a=c.id,r=p)}return{id:a,yaw:r,dist:a>0?o:0}}function Lh(i,t,e,n){const s=i.config.links,a=i.playerLink,r=i.character.position,o=Da(i,t),c=Dh(i,o),l=c.id>0?c.yaw:o,h=c.id>0?Go(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=n,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=h,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,i.dash.cooldown=Math.max(i.dash.cooldown,s.sharedCooldown),Fr(i,"link-start",a.id)}function Ih(i,t){const e=i.playerLink;if(e.phase==="idle")return;const n=e.weapon===""?void 0:i.config.links.moves[e.weapon];if(!n){Ma(i);return}if(e.weapon!==i.combat.weapon){Ma(i);return}e.timer+=t;const s=c=>c==="windup"?n.windup:c==="active"?n.active:n.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Fr(i,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Fr(i,"link-end",e.id))}const r=n.windup+n.active+n.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=n.windup+e.timer:e.phase==="recovery"?o=n.windup+n.active+e.timer:o=r,e.progress=r>0?Go(o/r,0,1):1,e.phase==="active"&&n.active>Ur){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Ur,n.active-e.timer),h=c/l;i.impulse.x=Math.sin(e.facing)*h,i.impulse.z=Math.cos(e.facing)*h}}function kh(i,t,e){const n=i.config.links,s=i.playerLink,a=i.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!n.enabled||!i.modules.links){s.phase!=="idle"&&Ma(i);return}const r=i.combat,o=i.character.sprinting;o&&n.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&n.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,n.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&zr(i,"sprint"),s.prevSprinting=o,Ih(i,t);const c=n.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&i.dash.phase==="idle"&&!!c&&c.enabled&&Lh(i,e,c,r.weapon)}const Or=1e-6;function jn(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function jl(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Kl(i){const t=i.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=jl()}function Uh(i){return{weapon:yi[Math.max(0,i-1)]??yi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:jl()}}function Fh(i,t){return Da(i,t)}function Nh(i,t){const e=i.config.targeting;if(!e.targetAssist||!i.modules.targeting||!i.targeting.hasTarget)return t;const n=i.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*i.config.combat.minLungeScale;return Math.min(Math.max(n,0)+a,s)}function Jl(i,t,e,n){const s=i.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=n,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=Fh(i,t),s.attackProgress=0,s.timings=e,s.attackId+=1,jn(i,"attack-start",n)}function Ql(i){return Math.max(0,i.config.combat.settle)}function Br(i,t,e){const n=i.config.combat.weapons[i.combat.weapon];Jl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:Ql(i),lunge:Nh(i,n.lunge[e-1]??0)},e)}function zh(i,t,e){const n=i.config.combat.bow.release;i.combat.lastCharge=e,Jl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:Ql(i),lunge:n.lunge},0),jn(i,"charge-release",e)}function Oh(i,t,e){const n=i.combat;if(n.phase==="idle")return;const s=n.timings;n.phaseTimer+=t;let a=0;for(;n.phase!=="idle"&&a++<8;){const c=n.phase==="windup"?s.windup:n.phase==="active"?s.active:n.phase==="recovery"?s.recovery:s.settle;if(n.phaseTimer<c)break;if(n.phaseTimer-=c,n.phase==="windup")n.phase="active",jn(i,"attack-active",n.comboIndex);else if(n.phase==="active")n.phase="recovery";else if(n.phase==="recovery")n.phase="settle",jn(i,"attack-end",n.comboIndex);else if(n.phase="idle",n.phaseTimer=0,n.comboWindow=i.config.combat.comboWindow,n.queued){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Br(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}if(n.queued&&n.phase==="recovery"){const c=n.timings.recovery;if(c>Or&&n.phaseTimer>=c*i.config.combat.cancelWindow){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Br(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;n.phase==="windup"?o=n.phaseTimer:n.phase==="active"?o=s.windup+n.phaseTimer:n.phase==="recovery"?o=s.windup+s.active+n.phaseTimer:n.phase==="settle"&&(o=r),n.phase!=="idle"&&(n.attackProgress=r>0?Math.min(1,o/r):1)}function Bh(i,t,e){const n=i.combat,s=i.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=yi.length){const c=yi[e.weaponSlot-1];c!==n.weapon&&(n.weapon=c,Kl(i),Ma(i),jn(i,"weapon-change",e.weaponSlot))}n.phase==="idle"&&n.comboWindow>0&&(n.comboWindow=Math.max(0,n.comboWindow-t),n.comboWindow===0&&n.comboIndex>0&&(n.comboIndex=0,jn(i,"combo-reset",0))),Oh(i,t,e);const a=s.weapons[n.weapon],r=i.dash.phase==="active";if(a.comboCount>0){const c=i.playerLink.phase!=="idle"||i.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(n.phase==="idle"){const h=n.comboWindow>0&&n.comboIndex<a.comboCount?n.comboIndex+1:1;Br(i,e,h)}else n.queued=!0}else if(n.weapon!=="staff"){if(n.weapon==="bow"&&(!r&&!i.playerLink.consumedAttack&&e.attackPressed&&n.phase==="idle"&&!n.charging&&(n.charging=!0,n.charge=0,jn(i,"charge-start",0)),n.charging&&e.attackHeld&&(n.charge=Math.min(1,n.charge+t/Math.max(s.bow.maxChargeTime,Or))),n.charging&&!r&&(e.attackReleased||!e.attackHeld))){n.charging=!1;const c=n.charge;n.charge=0,c>=s.bow.minChargeToFire&&n.phase==="idle"?zh(i,e,c):jn(i,"charge-release",0)}}if(!(i.playerLink.phase==="active")&&(i.impulse.x=0,i.impulse.z=0,n.phase==="active"&&n.timings.active>Or)){const c=n.timings.lunge/n.timings.active;i.impulse.x=Math.sin(n.attackFacing)*c,i.impulse.z=Math.cos(n.attackFacing)*c}}const Hr=1e-6;function Ga(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Hh(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Gh(i){const t=i.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=i.character.position.x,t.fromZ=i.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Sc(i,t,e){return i<t?t:i>e?e:i}function Vh(i,t,e){const n=i.config.dash,a=i.character.position,r=i.config.worldBounds,o=Math.max(.05,n.blinkStep),c=Math.max(0,n.blinkDistance);let l=0,h=a.x,f=a.z;for(;l<c-Hr;){const p=Math.min(c,l+o),d=a.x+t*p,g=a.z+e*p,_=Sc(d,r.minX,r.maxX),m=Sc(g,r.minZ,r.maxZ),u={x:_,y:a.y,z:m};if(Ho(i.boxes,u,i.config.characterRadius,i.config.characterHeight,i.config.stepHeight)||(h=_,f=m,l=p,_!==d||m!==g))break}return{x:h,z:f}}function Xh(i,t,e){const n=i.dash,s=i.config.dash;if(n.phase==="active"&&n.timer<=0&&(n.phase="idle",n.timer=0,zr(i,"roll")),n.cooldown>0){const o=n.cooldown;n.cooldown=Math.max(0,n.cooldown-t),o>0&&n.cooldown===0&&Ga(i,"dash-ready",0)}const a=i.combat;if(e.sprintPressed&&n.cooldown<=0&&n.phase==="idle"&&a.phase==="idle"&&!a.charging&&i.playerLink.phase==="idle"){const o=dh(i,e),c=o.x,l=o.z,h=i.combat.weapon==="staff";if(n.kind=h?"blink":"roll",n.dirX=c,n.dirZ=l,n.fromX=i.character.position.x,n.fromZ=i.character.position.z,n.id+=1,n.cooldown=h?s.blinkCooldown:s.rollCooldown,h){const f=Vh(i,c,l);i.character.position.x=f.x,i.character.position.z=f.z,n.toX=f.x,n.toZ=f.z,n.duration=0,n.timer=0,n.phase="idle",s.blinkClearVelocity&&(i.character.velocity.x=0,i.character.velocity.z=0),zr(i,"blink"),Ga(i,"blink",n.id)}else n.phase="active",n.duration=Math.max(Hr,s.rollDuration),n.timer=n.duration,n.toX=n.fromX+c*s.rollDistance,n.toZ=n.fromZ+l*s.rollDistance,Ga(i,"roll",n.id)}if(n.phase==="active"&&n.kind==="roll"){const o=Math.max(Hr,n.timer),c=i.character.position.x,l=i.character.position.z;i.impulse.x=(n.toX-c)/o,i.impulse.z=(n.toZ-l)/o}n.phase==="active"&&(n.timer=Math.max(0,n.timer-t))}const an=1e-6,Gr=Math.PI*2,Wh=7,$h=18;function bc(i,t,e){return i<t?t:i>e?e:i}function Yh(i){return Math.atan2(Math.sin(i),Math.cos(i))}function Ec(i,t,e,n){return i+Yh(t-i)*(1-Math.exp(-Math.max(e,an)*n))}function Vo(i,t,e){i.events.push({type:t,tick:i.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Zh(i){const t=[];for(let e=0;e<i.count;e++){const n=i.spawn[e]??{x:0,z:0},s=i.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:n.x,homeZ:n.z,position:{x:n.x,y:0,z:n.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:n.x,targetZ:n.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Yl(),link:La()})}return t}function qh(i){const t=Oa.indexOf(i);return Oa[(t+1)%Oa.length]}function jh(i){const t=i.config.dummies;for(let e=0;e<i.dummies.length;e++){const n=i.dummies[e],s=t.spawn[e]??{x:n.homeX,z:n.homeZ},a=t.initialModes[e]??n.initialMode;n.mode=a,n.initialMode=a,n.homeX=s.x,n.homeZ=s.z,n.position.x=s.x,n.position.y=0,n.position.z=s.z,n.velocity.x=0,n.velocity.y=0,n.velocity.z=0,n.facing=0,n.bodyYaw=0,n.headYaw=0,n.gaitPhase=0,n.stride=1,n.distance=0,n.targetX=s.x,n.targetZ=s.z,n.wanderTimer=0,n.attackCooldown=0,n.attackPhase="idle",n.attackPhaseTimer=0,n.attackProgress=0;const r=n.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,Rh(n.link)}i.dummyAttackCount=0}function Kh(i,t,e){const n=Ba(i)*Gr,s=Math.sqrt(Ba(i))*e.wanderRadius;t.targetX=t.homeX+Math.cos(n)*s,t.targetZ=t.homeZ+Math.sin(n)*s,t.wanderTimer=e.wanderInterval*(.6+Ba(i)*.8)}function Jh(i,t){return i.attackPhase==="windup"?t.attackWindup:i.attackPhase==="active"?t.attackActive:i.attackPhase==="recovery"?t.attackRecovery:0}function Qh(i,t,e,n){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(Jh(t,n),an);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",Vo(i,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=n.attackWindup+n.attackActive+n.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=n.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=n.attackWindup+n.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function tu(i,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const n=i.character.position,s=n.x-t.position.x,a=n.z-t.position.z,r=Math.hypot(s,a),o=r>an?s/r:0,c=r>an?a/r:0;let l=0,h=0;if(t.mode==="wander"){const p=t.targetX-t.position.x,d=t.targetZ-t.position.z,g=Math.hypot(p,d);(t.wanderTimer<=0||g<.3)&&Kh(i,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,u=Math.hypot(_,m);u>an&&(l=_/u,h=m/u)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,h=c);else if(t.mode==="keep-distance"){const p=r-e.keepDistance;p>e.keepDeadZone?(l=o,h=c):p<-e.keepDeadZone?(l=-o,h=-c):(l=-c*e.keepStrafe,h=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,h=c);let f=t.facing;return t.mode==="wander"?Math.hypot(l,h)>an&&(f=Math.atan2(l,h)):r>an&&(f=Math.atan2(o,c)),{x:l,z:h,facing:f}}function eu(i,t,e,n){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const m=i.character.position;Math.hypot(m.x-e.position.x,m.z-e.position.z)<=n.attackRange+an&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=n.attackInterval,i.dummyAttackCount+=1,Vo(i,"dummy-attack",e))}Qh(i,e,t,n);const s=tu(i,e,n),a=1-Math.exp(-Math.max(n.acceleration,an)*t);e.velocity.x+=(s.x*n.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*n.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=Ec(e.bodyYaw,e.facing,Wh,t),e.headYaw=Ec(e.headYaw,e.facing,$h,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=i.config.stepHeight;Bo(i.boxes,e.position,n.radius,n.height,c)&&Ho(i.boxes,e.position,n.radius,n.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const h=i.config.worldBounds;e.position.x=bc(e.position.x,h.minX,h.maxX),e.position.z=bc(e.position.z,h.minZ,h.maxZ);const f=Ir(i.boxes,e.position.x,e.position.z,e.position.y,n.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+an&&(e.position.y=f);const p=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=p;const d=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(i.config.strideSpeedCap,d/Math.max(i.config.moveSpeed,an)),_=Math.max(i.config.strideLength*(1+g*i.config.strideSpeedGain),an);e.stride=_,e.gaitPhase=(e.gaitPhase+p/_*Gr)%Gr}function nu(i,t,e){const n=i.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=i.dummies.length){const s=i.dummies[e.dummyClickId-1];s.mode=qh(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,Vo(i,"dummy-mode",s)}for(const s of i.dummies)eu(i,t,s,n)}const Ti=1e-6,wc=Math.PI*2;function Va(i,t){return Math.sqrt(i*i+t*t)}function Ps(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function iu(i){const t=i.character,e=i.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=i.config.strideLength,t.distance=0,t.coyoteTime=i.config.coyoteTime,t.jumpBuffer=0,Kl(i)}function su(i,t,e){const n=i.config,s=i.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Va(o,c);l>1&&(o/=l,c/=l);const h=i.combat.phase!=="idle",f=i.playerLink.phase!=="idle",p=h||i.dash.phase==="active"||f;s.sprinting=!p&&e.sprintHeld&&l>Ti;const d=n.combat.weapons[i.combat.weapon];let g=d?d.moveMultiplier:1;p?g*=i.combat.phase==="settle"?n.combat.settleMoveScale:n.combat.attackMoveScale:i.combat.charging?g*=n.combat.bow.chargeMoveMultiplier:i.abilities.channeling&&(g*=n.abilities.arcane.moveScale);const _=n.moveSpeed*(s.sprinting?n.sprintMultiplier:1)*g;if(p)r.x=o*_,r.z=c*_;else{const B=l>Ti?n.acceleration:n.friction,U=1-Math.exp(-B*t);r.x+=(o*_-r.x)*U,r.z+=(c*_-r.z)*U}e.jumpPressed?s.jumpBuffer=n.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?n.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=n.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,Ps(i,"jumped",n.jumpSpeed)),i.events.some(B=>B.type==="blink"&&B.tick===i.tick)&&(r.x=0,r.z=0,i.impulse.x=0,i.impulse.z=0);const u=a.x,x=a.z;if(a.x+=(r.x+i.impulse.x+i.playerHurt.knockX)*t,a.z+=(r.z+i.impulse.z+i.playerHurt.knockZ)*t,Bo(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight)){if(Ho(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight))a.x=u,a.z=x,r.x=0,r.z=0;else{const B=a.x-u,U=a.z-x;Math.abs(B)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(U)<Math.abs(r.z*t)*.5&&(r.z=0)}Ps(i,"blocked",1)}const v=n.worldBounds;a.x=Ac(a.x,v.minX,v.maxX),a.z=Ac(a.z,v.minZ,v.maxZ);const D=Ir(i.boxes,a.x,a.z,a.y,n.characterRadius,n.stepHeight,n.fallTolerance);s.grounded&&D>a.y+Ti&&D-a.y<=n.stepHeight+Ti&&(a.y=D,r.y=0,Ps(i,"stepUp",D));const A=a.y;r.y-=n.gravity*t,a.y+=r.y*t;const C=Ir(i.boxes,a.x,a.z,A,n.characterRadius,n.stepHeight,Number.POSITIVE_INFINITY);C>Number.NEGATIVE_INFINITY&&a.y<=C&&r.y<=0?(a.y=C,r.y=0,s.grounded||Ps(i,"landed",C),s.grounded=!0):s.grounded=!1;const L=Va(a.x-u,a.z-x);s.distance+=L;const b=Va(r.x,r.z),y=Math.min(n.strideSpeedCap,b/Math.max(n.moveSpeed,Ti)),P=Math.max(n.strideLength*(1+y*n.strideSpeedGain),Ti);s.stride=P,s.gaitPhase=(s.gaitPhase+L/P*wc)%wc}function Ac(i,t,e){return i<t?t:i>e?e:i}const Vr=1e-6,Tc=2.399963229728653;function mi(i,t,e){return i<t?t:i>e?e:i}function Rc(i,t,e,n,s,a,r,o,c){const l=t.x-i.x,h=t.z-i.z,f=Math.hypot(l,h),p=e+n;if(f>=p)return;let d,g,_;f<Vr?(d=o,g=c,_=p):(d=l/f,g=h/f,_=p-f);const m=_+r;i.x-=d*m*s,i.z-=g*m*s,t.x+=d*m*a,t.z+=g*m*a}function au(i){const t=i.config.separation,e=i.dummies,n=i.character.position,s=i.config.characterRadius,a=i.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let h=0;h<r;h++){for(let f=0;f<e.length;f++)for(let p=f+1;p<e.length;p++){const d=(f*3+p)*Tc;Rc(e[f].position,e[p].position,a,a,.5,.5,o,Math.cos(d),Math.sin(d))}for(let f=0;f<e.length;f++){const p=(f+1)*Tc;Rc(n,e[f].position,s,a,0,1,o,Math.cos(p),Math.sin(p))}}const c=i.config.stepHeight,l=i.config.worldBounds;for(const h of e)Bo(i.boxes,h.position,a,i.config.dummies.height,c),h.position.x=mi(h.position.x,l.minX,l.maxX),h.position.z=mi(h.position.z,l.minZ,l.maxZ)}function ru(i,t,e,n,s,a,r,o){const c=Math.hypot(e,n),l=Math.max(0,o.contactBand),h=mi(o.minScale,0,1);if(c<Vr||l<=0||h>=1)return 1;const f=s+r,p=mi(o.approachDot,0,.99);let d=0;for(const g of a){const _=g.position.x-i,m=g.position.z-t,u=Math.hypot(_,m);if(u>=f+l)continue;if(u<Vr){d=1;continue}const x=(e*_+n*m)/(c*u);if(x<=p)continue;const S=mi(1-(u-f)/l,0,1),v=mi((x-p)/(1-p),0,1);d=Math.max(d,S*v)}return 1-(1-h)*mi(d,0,1)}function ou(i){const t=i.config.separation.crowd;if(!t)return;const e=i.character,n=ru(e.position.x,e.position.z,e.velocity.x,e.velocity.z,i.config.characterRadius,i.dummies,i.config.dummies.radius,t);n>=1||(e.velocity.x*=n,e.velocity.z*=n)}const Cc=1e-6,cu=Math.PI/180;function lu(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function du(i,t,e){return i<t?t:i>e?e:i}function hu(i,t,e){const n=i.config.targeting,s=i.targeting,a=i.character.position;let r=i.character.facing;Math.hypot(e.moveX,e.moveZ)>Cc&&(r=Math.atan2(e.moveX,e.moveZ));const c=du(n.maxAngleDeg,0,180)*cu;let l=Number.POSITIVE_INFINITY,h=0,f=0,p=0;for(const d of i.dummies){const g=d.position.x-a.x,_=d.position.z-a.z,m=Math.hypot(g,_);if(m<Cc||m>n.range)continue;const u=Math.atan2(g,_),x=Math.abs(Tn(u-r));if(x>c)continue;const S=m-n.frontBias*Math.cos(x);S<l&&(l=S,h=d.id,f=u,p=m)}s.targetId=h,s.targetYaw=f,s.targetDist=p,s.hasTarget=h>0}function uu(i,t){return{tick:0,time:0,rngState:2654435769,config:i,boxes:wh(t),gridMeta:t.grid,character:{position:{x:i.spawn.x,y:i.spawn.y,z:i.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:i.strideLength,distance:0,coyoteTime:i.coyoteTime,jumpBuffer:0},combat:Uh(1),playerLink:La(),abilities:gh(),impulse:{x:0,z:0},targeting:lu(),playerHurt:Yl(),hitCount:0,dash:{...Hh(),fromX:i.spawn.x,fromZ:i.spawn.z,toX:i.spawn.x,toZ:i.spawn.z},camera:{...Zl(),centroidX:i.spawn.x,centroidZ:i.spawn.z},dummies:Zh(i.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,dummies:!0}}}function fu(i){iu(i),jh(i),Ch(i);const t=i.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=i.playerHurt;e.type="none",e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,i.hitCount=0,_h(i),Gh(i),ql(i),i.events.length=0}function Pc(i,t,e){if(i.events.length=0,i.tick+=1,i.time+=t,i.impulse.x=0,i.impulse.z=0,e.resetPressed){fu(i);const n=i.config.spawn;return i.events.push({type:"reset",tick:i.tick,x:n.x,y:n.y,z:n.z,value:0}),i}return i.modules.dummies&&i.modules.targeting?hu(i,t,e):(i.targeting.targetId=0,i.targeting.targetYaw=0,i.targeting.targetDist=0,i.targeting.hasTarget=!1),kh(i,t,e),i.modules.combat&&Bh(i,t,e),i.modules.dash&&Xh(i,t,e),i.modules.movement&&su(i,t,e),i.modules.orientation&&Ah(i,t,e),i.modules.dummies&&nu(i,t,e),hh(i,t),Ph(i,t),i.modules.abilities&&bh(i,t,e),i.modules.dummies&&(mh(i,t),i.modules.separation&&(au(i),ou(i))),i.modules.camera?Eh(i):ql(i),i}function pu(i){let t=0;return{frame(e,n,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=i.config.fixedDt,c=i.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const h=l===0?n:{...n,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Pc(i,o,h),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){Pc(i,i.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const td={slopPx:12,longPressMs:450,doubleTapMs:280};function mu(i,t,e=td.slopPx){if(i.distance<e)return{...i,worldX:0,worldZ:0};const n=i.dx/i.distance,s=i.dy/i.distance,a=t.rightX*n+t.forwardX*-s,r=t.rightZ*n+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...i,worldX:0,worldZ:0}:{...i,worldX:a/o,worldZ:r/o}}function ai(i,t,e,n,s,a){const r=Math.hypot(e,n);return{button:i,kind:t,dx:e,dy:n,distance:r,angleDeg:r>.001?Math.atan2(n,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function gu(i=td){const t=new Map,e=new Map,n=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),ai(s,"press",0,0,0,1)},move(s,a,r,o){const c=n(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY;return!c.dragging&&Math.hypot(l,h)>=i.slopPx?(c.dragging=!0,ai(c.button,"drag",l,h,o-c.startedAt,1)):null},end(s,a,r,o){const c=n(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY,f=o-c.startedAt,p=Math.hypot(l,h);if(c.dragging||c.longFired||p>=i.slopPx)return ai(c.button,"release",l,h,f,1);const d=e.get(c.button);return d!==void 0&&o-d.at<=i.doubleTapMs&&Math.hypot(a-d.x,r-d.y)<=i.slopPx*2?(e.delete(c.button),ai(c.button,"doubleTap",l,h,f,2)):(e.set(c.button,{at:o,x:a,y:r}),ai(c.button,"tap",l,h,f,1))},cancel(s,a){const r=n(s);return r?(t.delete(s),ai(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=i.longPressMs)return a.longFired=!0,ai(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const Xa=.001,_u=18;function Xr(i,t,e){return i<t?t:i>e?e:i}function Wr(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function xu(i){const t=i.length;if(t<2)return null;const e=i[t-2],n=i[t-1];return e.id===n.id?null:[e,n]}function vu(i,t,e,n,s=_u){const a=xu(t);if(!a)return{state:Wr(),scale:1,started:!1,ended:i.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(n)?n:1.25),l=1/c,h=c;if(!Number.isFinite(r)||r<Xa)return{state:{active:!0,lastDist:0,armDist:0,armed:i.armed},scale:1,started:!i.active,ended:!1,armedNow:!1,pinching:i.armed};if(!i.active){const g=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!i.armed)return i.armDist<Xa?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-i.armDist)<o?{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(i.lastDist<Xa)return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=r/i.lastDist,p=Math.max(0,Number.isFinite(e)?e:1),d=Number.isFinite(f)&&f>0?Math.pow(f,p):1;return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:Xr(Number.isFinite(d)?d:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Mu(i,t,e,n){const s=Math.min(e,n),a=Math.max(e,n),r=Number.isFinite(t)&&t>0?t:1,o=i*r;return Number.isFinite(o)?Xr(o,s,a):Xr(i,s,a)}function yu(i,t){const e=Number.isFinite(t)&&t>0?t:1,n=Number.isFinite(i)?i:0;return Math.pow(e,n/100)}function Su(){const i=typeof window<"u"?window.visualViewport:null;return i?{left:i.offsetLeft,top:i.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Wa=["jump","sprint","reset","attack","skill2"],bu=8,Eu=26,$a=16,Dc=20,Lc=140,wu=18,Au=16,Tu=400,Ru=1.0001;function ca(i){return i instanceof Element&&i.closest("[data-ui-button], [data-ui-region], #debug-panel, #hud, #weapon-bar, #hint")!==null}function Cu(i,t){if(!Number.isFinite(i)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(i,t);return e instanceof Element&&ca(e)}function Pu(i){const{maxRadiusPx:t,deadZone:e,getBasis:n,zoom:s}=i,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,h=0,f=0,p=0,d=-1,g=0,_=null,m=-1,u=0,x=0,S=0,v=0,D=!1,A=0,C=1,L=0,b=null,y=0,P=0,B=!1,U=null,W=null,R=0,T=0,O=0,F=0,$=!1,at=!0,ut=-1;const ot=gu({slopPx:Dc,longPressMs:450,doubleTapMs:350});let vt=[],q=null;const J=new Set;function ct(N){N&&vt.push(N)}const lt=new Map;let gt=Wr(),At=!1,Dt=1;function Xt(){const N=Array.from(lt.values()),rt=s(),dt=vu(gt,N,rt.pinchGain,rt.maxStepRatio,wu);if(gt=dt.state,At=dt.pinching,dt.scale!==1&&(Dt*=dt.scale),dt.started||dt.armedNow)b=null,B=!0,U=null;else if(dt.ended&&r===null&&N.length===1){const Ut=N[0];r=Ut.id,o=Ut.x,c=Ut.y,l=0,h=0,f=Ut.x,p=Ut.y,D=!1,A=0,C=1,L=0,performance.now(),b=null,B=!0,U=null}}const Rt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Tt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let k=0,ae=0;const Pt={},Lt=new Set,Y=[];function ht(){for(const N of Wa)Pt[N]!==void 0&&(Pt[N]=void 0),z(N);ot.reset(),J.clear(),lt.clear(),gt=Wr(),At=!1,r=null,l=0,h=0,f=0,p=0,D=!1,A=0,C=1,L=0,u=0,x=0,S=0,v=0,_=null,m=-1,b=null,B=!1,U=null,W=null,ut=-1,O=0,F=0,$=!1,at=!0}const ft=()=>{document.hidden&&ht()},w=N=>{if(N.clientX===0&&N.clientY===0){g++;return}if(ca(N.target)||Cu(N.clientX,N.clientY)){J.add(N.pointerId);return}if(J.delete(N.pointerId),lt.set(N.pointerId,{id:N.pointerId,x:N.clientX,y:N.clientY}),r===null&&!At){_=null,m=-1,r=N.pointerId,o=N.clientX,c=N.clientY,l=0,h=0,f=N.clientX,p=N.clientY,performance.now();const rt=Number.isFinite(N.screenX)&&Number.isFinite(N.screenY)&&(N.screenX!==0||N.screenY!==0);D=rt,A=0,C=1,L=0,u=rt?N.screenX:0,x=rt?N.screenY:0,S=u,v=x,b=N.pointerId,y=N.clientX,P=N.clientY,B=!1}Xt()},M=N=>{if(N.pointerId===W&&(N.pointerType==="mouse"&&N.buttons===0||N.clientX===0&&N.clientY===0&&(R!==0||T!==0)||(at?(O=N.clientX-R,F=N.clientY-T):(R=N.clientX,T=N.clientY,at=!0,O=0,F=0))),ct(ot.move(N.pointerId,N.clientX,N.clientY,performance.now())),!J.has(N.pointerId)&&lt.has(N.pointerId)&&(lt.set(N.pointerId,{id:N.pointerId,x:N.clientX,y:N.clientY}),Xt()),J.has(N.pointerId)||N.pointerId!==r)return;const rt=performance.now();if(_===N.pointerId&&rt-m<150){g++;return}const dt=N.clientX,Ut=N.clientY;if(dt===0&&Ut===0&&(o!==0||c!==0)){g++;return}const Gt=dt-f,I=Ut-p,xt=Number.isFinite(N.screenX)&&Number.isFinite(N.screenY),Z=xt?N.screenX:0,st=xt?N.screenY:0,bt=xt&&(Z!==0||st!==0),St=Z-S,Bt=st-v;if(D&&bt){const he=Math.hypot(St,Bt),et=Math.hypot(Gt,I);if(he>3){if(A=0,L<30&&et>6&&St*Gt+Bt*I>.7*he*et){const Mt=he/et;Mt>.2&&Mt<5&&(C+=(Mt-C)*.3,L++)}}else et>12&&(A++,A>=2&&(D=!1))}const ee=Math.hypot(Gt,I);if(!D){const he=d<0?Number.POSITIVE_INFINITY:rt-d,et=bt?Math.hypot(St,Bt):1/0;ee>28&&(he<200||et<ee*.4)&&(o+=Gt,c+=I,g++)}f=dt,p=Ut,S=Z,v=st,N.pointerId===b&&Math.hypot(N.clientX-y,N.clientY-P)>bu&&(B=!0);let Vt,Wt;D&&bt?(Vt=(Z-u)/C,Wt=(st-x)/C):(Vt=dt-o,Wt=Ut-c);const ge=Math.hypot(Vt,Wt),ye=a();ge>ye&&(Vt*=ye/ge,Wt*=ye/ge);const rn=Math.hypot(l,h),Je=Math.hypot(Vt,Wt);if(rn>10&&Je>10){const he=Math.abs(Math.atan2(l*Wt-h*Vt,l*Vt+h*Wt)),et=Math.max(rn,Je)*he,Mt=Math.max(Math.hypot(Gt,I),Math.hypot(St,Bt)/Math.max(.2,C));if(he>.6&&Mt<Math.max(6,et*.5)){g++;return}}l=Vt,h=Wt};function z(N){if(!Rt[N])return;Rt[N]=!1,N==="attack"&&(Tt.attackReleased=!0);const rt=document.getElementById(`btn-${N}`);rt==null||rt.classList.remove("is-down")}function tt(){r!==null&&(_=r,m=performance.now(),r=null,l=0,h=0,f=0,p=0,D=!1,A=0,C=1,L=0,u=0,x=0,S=0,v=0)}const G=N=>{const rt=lt.delete(N.pointerId),dt=J.delete(N.pointerId);rt&&Xt(),N.pointerId===W&&(W=null,$?ut=performance.now():(O=0,F=0,ut=-1)),ct(ot.end(N.pointerId,N.clientX,N.clientY,performance.now()));for(const kt of Wa)Pt[kt]===N.pointerId&&(Pt[kt]=void 0,z(kt));const Ut=!rt&&!dt&&lt.size<=1&&r!==null;(N.pointerId===r||lt.size===0||Ut)&&tt(),!dt&&N.pointerId===b&&(!B&&!ca(N.target)&&(U={x:N.clientX,y:N.clientY}),b=null)};for(const N of Wa){const rt=document.getElementById(`btn-${N}`);if(!rt)continue;const dt=N==="attack"||N==="skill2",Ut=I=>{if(I.preventDefault(),Pt[N]===void 0){Pt[N]=I.pointerId,Rt[N]=!0,N==="jump"&&(Tt.jump=!0),N==="reset"&&(Tt.reset=!0),N==="sprint"&&(Tt.sprintPressed=!0),N==="attack"&&(Tt.attackPressed=!0),N==="skill2"&&(Tt.skill2=!0),rt.classList.add("is-down"),ct(ot.begin(N,I.pointerId,I.clientX,I.clientY,performance.now()));try{rt.setPointerCapture(I.pointerId)}catch{}dt&&(W=I.pointerId,R=I.clientX,T=I.clientY,at=!(I.clientX===0&&I.clientY===0),O=0,F=0,$=!1,ut=-1)}},kt=I=>{Pt[N]===I.pointerId&&(Pt[N]=void 0,z(N),ct(ot.end(I.pointerId,I.clientX,I.clientY,performance.now())))},Gt=I=>{Pt[N]===I.pointerId&&(Pt[N]=void 0,z(N),ct(ot.cancel(I.pointerId,performance.now())))};rt.addEventListener("pointerdown",Ut),rt.addEventListener("pointerup",kt),rt.addEventListener("pointercancel",Gt),Y.push(()=>{rt.removeEventListener("pointerdown",Ut),rt.removeEventListener("pointerup",kt),rt.removeEventListener("pointercancel",Gt)})}const K=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const N of K){const rt=dt=>{dt.preventDefault(),k=Number(N.dataset.weapon)||0};N.addEventListener("pointerdown",rt),Y.push(()=>N.removeEventListener("pointerdown",rt))}const it=N=>{const rt=N.key.toLowerCase();if((rt===" "||rt.startsWith("arrow"))&&N.preventDefault(),Lt.has(rt))return;Lt.add(rt),rt===" "&&(Tt.jump=!0),rt==="r"&&(Tt.reset=!0),rt==="shift"&&(Tt.sprintPressed=!0),rt==="j"&&(Tt.attackPressed=!0),rt==="k"&&(Tt.skill2=!0),rt>="1"&&rt<="5"&&(k=Number(rt)),rt>="6"&&rt<="9"&&(ae=Number(rt)-5);const dt=Math.max(Ru,s().keyStep||1.12);(rt==="="||rt==="+")&&(Dt*=dt),(rt==="-"||rt==="_")&&(Dt/=dt)},nt=N=>{const rt=N.key.toLowerCase();Lt.has(rt)&&(Lt.delete(rt),rt==="j"&&(Tt.attackReleased=!0))},_t=N=>{if(ca(N.target))return;N.preventDefault();const rt=N.deltaMode===1?N.deltaY*Au:N.deltaMode===2?N.deltaY*Tu:N.deltaY;Dt*=yu(rt,s().wheelStep)},It=N=>{N.preventDefault()},pt=()=>{d=performance.now()};window.addEventListener("resize",pt),window.addEventListener("orientationchange",pt);const Et=typeof window<"u"?window.visualViewport:null;return Et&&(Et.addEventListener("resize",pt),Et.addEventListener("scroll",pt)),window.addEventListener("pointerdown",w),window.addEventListener("pointermove",M),window.addEventListener("pointerup",G),window.addEventListener("pointercancel",G),window.addEventListener("blur",ht),document.addEventListener("visibilitychange",ft),window.addEventListener("keydown",it),window.addEventListener("keyup",nt),window.addEventListener("wheel",_t,{passive:!1}),window.addEventListener("gesturestart",It),{peekStick(){return{id:r,held:r!==null,originX:o,originY:c,x:f,y:p,dx:f-o,dy:p-c,radius:a(),badMoves:g,screenOk:D,originSX:u,originSY:x,screenX:S,screenY:v,scale:C}},peekAim(){const N=performance.now(),rt=Math.hypot(O,F),dt=W!==null||ut>=0&&N-ut<Lc;if(!(dt&&$&&rt>=$a))return{active:!1,holding:dt,x:0,z:0,dx:O,dy:F};const kt=n(),Gt=O/rt,I=F/rt,xt=kt.rightX*Gt+kt.forwardX*-I,Z=kt.rightZ*Gt+kt.forwardZ*-I,st=Math.hypot(xt,Z)||1;return{active:!0,holding:dt,x:xt/st,z:Z/st,dx:O,dy:F}},sample(){var mt;const N=a();let rt=r!==null?Math.max(-1,Math.min(1,l/N)):0,dt=r!==null?Math.max(-1,Math.min(1,h/N)):0,Ut=0,kt=0;(Lt.has("a")||Lt.has("arrowleft"))&&(Ut-=1),(Lt.has("d")||Lt.has("arrowright"))&&(Ut+=1),(Lt.has("w")||Lt.has("arrowup"))&&(kt-=1),(Lt.has("s")||Lt.has("arrowdown"))&&(kt+=1),rt+=Ut,dt+=kt;let Gt=Math.hypot(rt,dt);Gt>1&&(rt/=Gt,dt/=Gt,Gt=1);const I=rt,xt=dt;Gt<e&&(rt=0,dt=0);const Z=n();let st=Z.rightX*rt+Z.forwardX*-dt,bt=Z.rightZ*rt+Z.forwardZ*-dt;const St=Math.hypot(st,bt);St>1&&(st/=St,bt/=St);const Bt=performance.now();ct(ot.poll(Bt));const ee=Math.hypot(O,F);W!==null&&(ee>=Eu?$=!0:ee<$a&&($=!1));const Vt=W!==null||ut>=0&&Bt-ut<Lc,Wt=Vt&&$&&ee>=$a;let ge=0,ye=0;if(Wt){const Ht=O/ee,Zt=F/ee,Yt=Z.rightX*Ht+Z.forwardX*-Zt,ue=Z.rightZ*Ht+Z.forwardZ*-Zt,we=Math.hypot(Yt,ue)||1;ge=Yt/we,ye=ue/we}!Vt&&W===null&&(O=0,F=0,ut=-1,$=!1);const rn=U;U=null;const Je=Dt;Dt=1;const he={moveX:st,moveZ:bt,jumpPressed:Tt.jump,sprintHeld:Rt.sprint||Lt.has("shift"),sprintPressed:Tt.sprintPressed,resetPressed:Tt.reset,attackPressed:Tt.attackPressed,attackHeld:Rt.attack||Lt.has("j"),attackReleased:Tt.attackReleased,skill2Pressed:Tt.skill2,weaponSlot:k,dummyClickId:ae,aimX:ge,aimZ:ye,aimActive:Wt};Tt.jump=!1,Tt.reset=!1,Tt.sprintPressed=!1,Tt.attackPressed=!1,Tt.attackReleased=!1,Tt.skill2=!1,k=0,ae=0;const et=vt.map(Ht=>mu(Ht,Z,Dc));vt=[],et.length>0&&(q=et[et.length-1]);const Mt=r!==null?"pointer":Lt.size>0?"keyboard":"idle";return{intents:he,stickX:rt,stickY:dt,stickRawX:I,stickRawY:xt,stickHeld:r!==null,stickId:r,stickOriginX:o,stickOriginY:c,stickPxX:f,stickPxY:p,stickBad:g,stickScreenOk:D,stickOriginSX:u,stickOriginSY:x,stickScreenX:S,stickScreenY:v,stickScale:C,stickVpTop:((mt=Su())==null?void 0:mt.top)??0,stickVpAge:d<0?-1:Math.round(performance.now()-d),aimDX:O,aimDY:F,source:Mt,tap:rn,zoomScale:Je,gestures:et,lastGesture:q}},dispose(){window.removeEventListener("pointerdown",w),window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",G),window.removeEventListener("pointercancel",G),window.removeEventListener("blur",ht),document.removeEventListener("visibilitychange",ft),window.removeEventListener("keydown",it),window.removeEventListener("keyup",nt),window.removeEventListener("wheel",_t),window.removeEventListener("resize",pt),window.removeEventListener("orientationchange",pt),Et&&(Et.removeEventListener("resize",pt),Et.removeEventListener("scroll",pt)),window.removeEventListener("gesturestart",It),ot.reset();for(const N of Y)N()}}}const ya=1,Sa=2,ba=4,ed=8,Ea=16,Ms=32,nd=64,id=128,Du=[[ya,"atk"],[Sa,"dash"],[ba,"link"],[ed,"air"],[Ea,"hurt"],[Ms,"aim"],[nd,"spr"],[id,"chan"]];function Ri(i){if(i===0)return"-";const t=Du.filter(([e])=>(i&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Lu=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Iu=0,ku=15,Ya=19,Uu=21,Fu=22,Nu=23,zu=24,vn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Xe=i=>Number.isFinite(i)?Math.round(i*1e3)/1e3:0,dn=i=>Math.round(i*180/Math.PI*10)/10,Za=Math.PI*2;function cs(i){let t=i%Za;return t>Math.PI&&(t-=Za),t<-Math.PI&&(t+=Za),t}function Ou(i,t){let e=0;return i.combat.phase!=="idle"&&(e|=ya),i.dash.phase!=="idle"&&(e|=Sa),i.playerLink.phase!=="idle"&&(e|=ba),i.character.grounded||(e|=ed),i.playerHurt.type!=="none"&&(e|=Ea),t.intents.aimActive&&(e|=Ms),i.character.sprinting&&(e|=nd),i.abilities.channeling&&(e|=id),e}function Bu(i){const t=`(${i.x.toFixed(1)},${i.z.toFixed(1)})`;switch(i.type){case"attack-start":return`slot${i.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${i.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${i.value} ${t}`;case"weapon-change":return`slot${i.value}`;case"dummy-mode":return`dummy${i.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return i.value!==0?`v${i.value}`:""}}function Hu(i){const t={sampleHz:i.sampleHz??vn.sampleHz,sampleCapacity:i.sampleCapacity??vn.sampleCapacity,eventCapacity:i.eventCapacity??vn.eventCapacity,anomalyCapacity:i.anomalyCapacity??vn.anomalyCapacity,dirJumpDeg:i.dirJumpDeg??vn.dirJumpDeg,aimDropDeg:i.aimDropDeg??vn.aimDropDeg,freezeMs:i.freezeMs??vn.freezeMs,freezeSpeed:i.freezeSpeed??vn.freezeSpeed,stickLostMs:i.stickLostMs??vn.stickLostMs,spikeMs:i.spikeMs??vn.spikeMs},e=i.meta,n=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let o=!0,c=-1,l=-1e9,h=null,f=0,p=0,d="",g=-1,_=-1,m=-1,u=0,x=-1e9,S=-1,v={},D=null,A=0,C=0,L=0,b=0;function y(R,T){const O=1/t.sampleHz,F=R[Iu];F-l<O-1e-6||(n.length>=t.sampleCapacity&&n.shift(),n.push(R),l=F)}function P(R,T,O,F,$,at){const ut=v[R]??-1e9;if(T-ut<1.2)return;if(v[R]=T,R==="frameSpike"){let vt=0;for(const q of a)q.kind==="frameSpike"&&vt++;if(vt>=6)return}a.length>=t.anomalyCapacity&&a.shift();let ot=n.slice(-7);at&&(ot.length===0||ot[ot.length-1]!==at)&&(ot=[...ot.slice(-6),at]),a.push({kind:R,t:Xe(T),tick:O,ms:Math.round(F),detail:$,ctx:ot}),R==="dirJump"?r.dirJumps++:R==="aimDrop"?r.aimDrops++:R==="moveFreeze"?r.freezes++:R==="stickLost"?r.stickLosts++:R==="stickJump"?r.stickJumps++:R==="stickBad"?r.stickBads++:R==="stickDrift"&&r.stickDrifts++}function B(R,T,O,F){s.length>=t.eventCapacity&&s.shift(),s.push({t:Xe(O),tick:F,k:R,d:T})}function U(R){switch(R.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=R.tick;break}}function W(){const R=r,T=R.wallMs/1e3,O=R.gestures,F=ot=>Object.entries(O).filter(([vt])=>vt.endsWith(`.${ot}`)).reduce((vt,[,q])=>vt+q,0),$=[];if($.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),$.push(`运行 ${T.toFixed(1)}s / ${R.frames} 帧 · ${R.fps.toFixed(1)}fps · 最大 ${R.dtMax.toFixed(0)}ms · 尖峰 ${R.spikes} · 步 ${R.steps}`),$.push(`摇杆活跃 ${T>0?Math.round(R.stickActiveMs/1e3/T*100):0}% · 手势 按下 ${F("press")}（单击 ${F("tap")} / 双击 ${F("doubleTap")} / 拖拽 ${F("drag")} / 长按 ${F("longPress")} / 打断 ${F("cancel")} / 拖放 ${F("release")}）`),$.push(`攻击 ${R.attacks}(中${R.hits}) · 受击 ${R.hurts} · 派生 ${R.links}(中${R.linkHits}) · 翻滚 ${R.rolls} 闪现 ${R.blinks} · 跳 ${R.jumps} · 复位 ${R.resets}`),$.push(`法杖 引导${R.channels} 飞弹${R.bolts} 电环${R.rings} · 弓蓄力${R.bowCharges} · 当前武器 ${d||"-"}`),$.push(`异常 ${R.dirJumps+R.aimDrops+R.freezes+R.stickLosts+R.stickJumps+R.stickBads+R.stickDrifts}（dir ${R.dirJumps} / aim ${R.aimDrops} / freeze ${R.freezes} / stick ${R.stickLosts} / stickJump ${R.stickJumps} / 坏指针 ${R.stickBads} / 坐标漂移 ${R.stickDrifts}） · 掉帧尖峰 ${R.spikes}`+(R.inTurns>0?` · 输入转向 ${R.inTurns} 次（最大 ${R.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const ot of a.slice(-6)){$.push(`· ${ot.kind} @t${ot.t.toFixed(2)} tick${ot.tick} ${ot.ms>0?`${ot.ms}ms `:""}${ot.detail}`);const vt=ot.ctx.map(J=>String(J[ku])).join(" "),q=ot.ctx.map(J=>J[Ya]===""||J[Ya]==null?".":String(J[Ya])).join(" ");if($.push(`  yaw ${vt}`),$.push(`  in  ${q}`),ot.kind==="stickJump"||ot.kind==="stickBad"||ot.kind==="stickLost"){const J=ot.ctx.map(lt=>`${lt[Uu]},${lt[Fu]}`).join(" "),ct=ot.ctx.map(lt=>`${lt[Nu]},${lt[zu]}`).join(" ");$.push(`  o   ${J}`),$.push(`  p   ${ct}`)}}if(s.length>0){$.push("最近事件：");for(const ot of s.slice(-12))$.push(`  ${ot.t.toFixed(2)} ${ot.k} ${ot.d}`.trimEnd())}const at=r.screenFrames>0?`屏幕 screenX/Y（${r.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ut=r.screenFrames>0&&r.clientFrames>0?` / client 回退 ${r.clientFrames} 帧`:"";return $.push(`摇杆坐标源 ${at}${ut}`),$.push(`UA ${e.ua}`),$.join(`
`)}return{sample(R,T,O,F=0){r.frames++,T.stickHeld&&(T.stickScreenOk?r.screenFrames++:r.clientFrames++),r.steps+=F,r.wallMs+=O,O>r.dtMax&&(r.dtMax=O),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=R.time;const $=R.time;if(c<0&&(c=$),L=$,b=R.tick,!o)return;const at=R.character,ut=Math.hypot(T.stickX,T.stickY),ot=Math.hypot(at.velocity.x,at.velocity.z);d=R.combat.weapon;const vt=Ou(R,T),q=at.facing,ct=Math.hypot(T.intents.moveX,T.intents.moveZ)>.05?Math.atan2(T.intents.moveX,T.intents.moveZ):null;ut>.2&&(r.stickActiveMs+=O);const lt=[Xe($),R.tick,Math.round(O*10)/10,Xe(T.stickX),Xe(T.stickY),Xe(T.stickRawX),Xe(T.stickRawY),T.stickHeld?1:0,T.source.slice(0,8),Xe(T.intents.moveX),Xe(T.intents.moveZ),Xe(at.position.x),Xe(at.position.z),Xe(at.velocity.x),Xe(at.velocity.z),dn(q),dn(at.bodyYaw),vt,Xe(at.stride),ct===null?"":dn(ct),T.stickId===null?"":T.stickId,Math.round(T.stickOriginX),Math.round(T.stickOriginY),Math.round(T.stickPxX),Math.round(T.stickPxY),T.stickBad,Math.round(T.stickVpTop),Math.round(T.stickOriginSX),Math.round(T.stickOriginSY),Math.round(T.stickScreenX),Math.round(T.stickScreenY),T.stickScreenOk?1:0,Math.round(T.stickScale*100)/100];y(lt);const gt=$*1e3<S;if(O>t.spikeMs&&!gt&&$-c>.6&&(r.spikes++,P("frameSpike",$,R.tick,O,`dt ${O.toFixed(0)}ms fl=${Ri(vt)}`,lt)),h!==null&&!gt){const ht=Math.abs(dn(cs(q-h))),ft=Math.abs(dn(cs(at.moveYaw-f))),w=(p|vt)&(ya|Sa|ba|Ea)|vt&Ms,M=ct===null?null:Math.abs(dn(cs(q-ct))),z=ct===null||h===null?null:Math.abs(dn(cs(h-ct))),tt=M!==null&&z!==null&&M<z-.5,G=(p&Ms)!==0&&(vt&Ms)===0&&ct===null,K=M!==null&&(M<=12||tt);ht>t.aimDropDeg&&G?P("aimDrop",$,R.tick,0,`${ht.toFixed(0)}° @aim→none stick(${T.stickX.toFixed(2)},${T.stickY.toFixed(2)}) aim(${T.aimDX.toFixed(0)},${T.aimDY.toFixed(0)}) fl=${Ri(vt)}`,lt):ht>t.dirJumpDeg&&w===0&&!G&&(K?(r.inTurns++,ht>r.inTurnMax&&(r.inTurnMax=ht)):P("dirJump",$,R.tick,0,`${ht.toFixed(0)}° res${M===null?" 无输入":`${M.toFixed(0)}°`} yaw ${dn(h)}→${dn(q)} in ${ct===null?".":dn(ct)}° mvΔ${ft.toFixed(0)}° aim(${T.aimDX.toFixed(0)},${T.aimDY.toFixed(0)}) fl=${Ri(p)}→${Ri(vt)}`,lt))}const At=(vt&(ya|Sa|ba|Ea))!==0,Dt=R.tick-x<30;ut>.35&&ot<t.freezeSpeed&&!At&&!Dt?(g<0&&(g=$),$-g>=t.freezeMs/1e3&&$>=_&&(P("moveFreeze",$,R.tick,($-g)*1e3,`stick(${T.stickX.toFixed(2)},${T.stickY.toFixed(2)}) v${ot.toFixed(2)} ${T.source} fl=${Ri(vt)}`,lt),_=$+1.5,g=-1)):g=-1,T.stickHeld?(ut>u&&(u=ut),u>.35&&ut<.06?(m<0&&(m=$),$-m>=t.stickLostMs/1e3&&(P("stickLost",$,R.tick,($-m)*1e3,`raw(${T.stickRawX.toFixed(2)},${T.stickRawY.toFixed(2)}) peak ${u.toFixed(2)} fl=${Ri(vt)}`,lt),m=-1,u=0)):m=-1):(u=0,m=-1);const Xt=T.stickScale>.2&&T.stickScale<5?T.stickScale:1,Rt=T.stickScreenOk,Tt=Rt?T.stickScreenX/Xt:T.stickPxX,k=Rt?T.stickScreenY/Xt:T.stickPxY,ae=Rt?T.stickOriginSX/Xt:T.stickOriginX,Pt=Rt?T.stickOriginSY/Xt:T.stickOriginY,Lt=Tt-ae,Y=k-Pt;if(T.stickHeld&&T.stickId!==null){const ht=D;if(ht&&ht.held&&ht.id===T.stickId){const ft=Math.hypot(ht.dx,ht.dy),w=Math.hypot(Lt,Y),M=Math.max(ft,w),z=Math.hypot(Tt-ht.cx,k-ht.cy),tt=Math.abs(dn(cs(Math.atan2(Y,Lt)-Math.atan2(ht.dy,ht.dx)))),G=M*tt*Math.PI/180,K=Math.hypot(ae-ht.ox,Pt-ht.oy);if(M>18&&tt>35&&z<Math.max(5,G*.35)&&P("stickJump",$,R.tick,0,`Δ${tt.toFixed(0)}° 手指只动${z.toFixed(0)}px(弧长应${G.toFixed(0)}px) o(${Math.round(ht.ox)},${Math.round(ht.oy)})→(${Math.round(ae)},${Math.round(Pt)}) 原点位移${K.toFixed(0)}px p(${Math.round(Tt)},${Math.round(k)}) raw(${Math.round(Lt)},${Math.round(Y)}) id${T.stickId} ${Rt?"src=屏幕":"src=client"}`,lt),Rt&&ht.screenOk){const it=Math.hypot(T.stickPxX-ht.x,T.stickPxY-ht.y),nt=Math.hypot((T.stickScreenX-ht.sx)/Xt,(T.stickScreenY-ht.sy)/Xt);A+=it-nt,Math.abs(A)>20&&(P("stickDrift",$,R.tick,0,`client 相对屏幕漂移 ${A>0?"+":""}${A.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(T.stickPxX)},${Math.round(T.stickPxY)}) screen(${Math.round(T.stickScreenX)},${Math.round(T.stickScreenY)})`,lt),A=0)}}D={id:T.stickId,ox:ae,oy:Pt,cx:Tt,cy:k,x:T.stickPxX,y:T.stickPxY,sx:T.stickScreenX,sy:T.stickScreenY,dx:Lt,dy:Y,held:!0,screenOk:Rt}}else D=null,A=0;if(T.stickBad>C){const ht=T.stickBad-C;P("stickBad",$,R.tick,0,`拦截 ${ht} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${T.stickBad}）o(${Math.round(T.stickOriginX)},${Math.round(T.stickOriginY)}) p(${Math.round(T.stickPxX)},${Math.round(T.stickPxY)}) id${T.stickId??"-"}`,lt)}C=T.stickBad,h=q,f=at.moveYaw,p=vt},event(R,T){const O=Bu(R);U(R),o&&(R.type==="dash-ready"||R.type==="combo-reset"||R.type==="stepUp"||B(R.type,O,T,R.tick))},gesture(R){const T=`${R.button}.${R.kind}`;r.gestures[T]=(r.gestures[T]??0)+1,o&&(R.kind==="longPress"||R.kind==="doubleTap"||R.kind==="drag"||R.kind==="cancel")&&B(`g:${R.kind}`,`${R.button} ${R.heldMs.toFixed(0)}ms d${R.distance.toFixed(0)}px ${R.angleDeg.toFixed(0)}°`,L,b)},suspend(R){S=L*1e3+R,g=-1,m=-1},setEnabled(R){o=R,R||(h=null,D=null,g=-1,m=-1)},clear(){n.length=0,s.length=0,a.length=0,v={},l=-1e9,h=null,p=0,g=-1,m=-1,u=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0,r.stickJumps=0,r.stickBads=0,r.stickDrifts=0,r.screenFrames=0,r.clientFrames=0,A=0,D=null,C=0;for(const R of Object.keys(r.gestures))delete r.gestures[R]},status(){const R=r.simS,T=a.some(O=>R-O.t<8&&(O.kind==="dirJump"||O.kind==="aimDrop"||O.kind==="moveFreeze"||O.kind==="stickLost"||O.kind==="stickJump"||O.kind==="stickBad"||O.kind==="stickDrift"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:T,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:Lu,samples:n.slice(),events:s.slice(),anomalies:a.slice()}},summary:W}}const Gu={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Vu={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},Xu={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.3,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.08,stopExitRatio:.18,chestYawScale:.45,chestYawMaxDeg:32,stopStepPitch:.26,stopTrailPitch:.09,stopStepKnee:.14,stopBodyShift:.075,stopChestPitch:.1,stopPeakRatio:.34},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},Wu={core:Gu,scene:Vu,view:Xu};function Xo(i){return JSON.parse(JSON.stringify(i))}const Wo=Wu,$u=Xo(Wo.core),Yu=Xo(Wo.scene),hn=Xo(Wo.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class An{constructor(t,e,n,s,a="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),An.nextNameID=An.nextNameID||0,this.$name.id=`lil-gui-name-${++An.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Zu extends An{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function $r(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const qu={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:$r,toHexString:$r},bs={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},ju={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=bs.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return bs.toHexString(s)}},Ku={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=bs.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return bs.toHexString(s)}},Ju=[qu,bs,ju,Ku];function Qu(i){return Ju.find(t=>t.match(i))}class tf extends An{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Qu(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=$r(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class qa extends An{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class ef extends An{constructor(t,e,n,s,a,r){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},n=x=>{const S=parseFloat(this.$input.value);isNaN(S)||(this._snapClampSetValue(S+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),n(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,h,f;const p=5,d=x=>{o=x.clientX,c=l=x.clientY,r=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(r){const S=x.clientX-o,v=x.clientY-c;Math.abs(v)>p?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(S)>p&&_()}if(!r){const S=x.clientY-l;f-=S*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},u=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",u)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(u,x,S,v,D)=>(u-x)/(S-x)*(D-v)+v,e=u=>{const x=this.$slider.getBoundingClientRect();let S=t(u,x.left,x.right,this._min,this._max);this._snapClampSetValue(S)},n=u=>{this._setDraggingStyle(!0),e(u.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=u=>{e(u.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=u=>{u.preventDefault(),this._setDraggingStyle(!0),e(u.touches[0].clientX),r=!1},h=u=>{u.touches.length>1||(this._hasScrollBar?(o=u.touches[0].clientX,c=u.touches[0].clientY,r=!0):l(u),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",p))},f=u=>{if(r){const x=u.touches[0].clientX-o,S=u.touches[0].clientY-c;Math.abs(x)>Math.abs(S)?l(u):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p))}else u.preventDefault(),e(u.touches[0].clientX)},p=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p)},d=this._callOnFinishChange.bind(this),g=400;let _;const m=u=>{if(Math.abs(u.deltaX)<Math.abs(u.deltaY)&&this._hasScrollBar)return;u.preventDefault();const S=this._normalizeMouseWheel(u)*this._step;this._snapClampSetValue(this.getValue()+S),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(d,g)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class nf extends An{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class sf extends An{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const af=`.lil-gui {
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
}`;function rf(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Ic=!1;class wa{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Ic&&o&&(rf(af),Ic=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,a){if(Object(n)===n)return new nf(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new ef(this,t,e,n,s,a);case"boolean":return new Zu(this,t,e);case"string":return new sf(this,t,e);case"function":return new qa(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new tf(this,t,e,n)}addFolder(t){const e=new wa({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof qa||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof qa)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function of(i,t,e,n){const s=document.getElementById("debug-panel"),a=s?new wa({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new wa({title:"实验台 · 调试面板"}),r=a.addFolder("模拟");r.add(e,"timeScale",0,3,.05).name("时间缩放"),r.add(e,"paused").name("暂停"),r.add({step:n.singleStep},"step").name("单步 (1 tick)"),r.add({reset:n.reset},"reset").name("复位全部");const o=a.addFolder("模块");o.add(i.modules,"movement").name("movement"),o.add(i.modules,"combat").name("combat"),o.add(i.modules,"links").name("links"),o.add(i.modules,"orientation").name("orientation"),o.add(i.modules,"targeting").name("targeting"),o.add(i.modules,"hits").name("hits"),o.add(i.modules,"separation").name("separation"),o.add(i.modules,"dash").name("dash"),o.add(i.modules,"camera").name("camera"),o.add(i.modules,"dummies").name("dummies"),o.add(i.modules,"abilities").name("abilities");const c=i.config,l=a.addFolder("移动参数");l.add(c,"moveSpeed",1,10,.1).name("移动速度"),l.add(c,"sprintMultiplier",1,3,.05).name("冲刺倍率"),l.add(c,"acceleration",1,40,.5).name("加速度"),l.add(c,"friction",1,40,.5).name("摩擦"),l.add(c,"gravity",5,60,.5).name("重力"),l.add(c,"jumpSpeed",2,16,.2).name("起跳速度"),l.add(c,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),l.add(c,"characterRadius",.1,.8,.01).name("角色半径"),l.add(c,"characterHeight",.6,2.2,.05).name("角色身高"),l.add(c,"strideLength",.3,3,.05).name("基础步幅"),l.add(c,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),l.add(c,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const h=a.addFolder("程序化步态 (v8)");h.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),h.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),h.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),h.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),h.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),h.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),h.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),h.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),h.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),h.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),h.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆");const f=a.addFolder("停步 / 胸朝向 (v9o)");f.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),f.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),f.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),f.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),f.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const p=a.addFolder("停步惯性 (v9p)");p.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),p.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),p.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),p.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),p.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),p.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置");const d=a.addFolder("程序动画 (v8c/v8d)");d.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),d.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),d.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const g=t.animation.stride;d.add(g,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),d.add(g,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),d.add(g,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),d.add(g,"cycles",1,3,1).name("每段跨步周期数"),d.add(g,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),d.add(g,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),d.add(g,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),d.add(g,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),d.add(g,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),d.add(g,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),d.add(g,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),d.add(g,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),d.add(g,"heavyScale",0,1,.01).name("大剑重击收敛系数"),d.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),d.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),d.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),d.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),d.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),d.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),d.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),d.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),d.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),d.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),d.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),d.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const _=c.combat,m=a.addFolder("战斗参数"),u=m.add(i.combat,"weapon",yi).name("当前武器");m.add(_,"comboWindow",.1,2,.05).name("连击窗口 (s)"),m.add(_,"settle",0,.8,.01).name("段间停顿 (s)"),m.add(_,"attackMoveScale",0,1,.01).name("攻击时移动比例"),m.add(_,"autoCombo").name("按住自动连击"),m.add(_.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),m.add(_.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),m.add(_.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),m.add(_.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),m.add(_.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),m.add(_.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const x=c.abilities;m.add(x.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),m.add(x.arcane,"speed",3,24,.5).name("飞弹速度"),m.add(x.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),m.add(x.ring,"radius",.5,5,.1).name("电环半径"),m.add(x.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),m.add(x.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const S=c.orientation,v=a.addFolder("朝向参数");v.add(S,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),v.add(S,"headTurnRate",.5,40,.5).name("头部转向速率"),v.add(S,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),v.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),v.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),v.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const D=a.addFolder("惯性倾斜 / 盆骨 (v8g)"),A=t.lean;D.add(A,"accelGain",0,.1,.002).name("前后加速度增益"),D.add(A,"turnGain",0,.2,.005).name("绕圈侧倾增益"),D.add(A,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),D.add(A,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),D.add(A,"smoothing",1,30,1).name("倾斜平滑速率"),D.add(A,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),D.add(A,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),D.add(A,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),D.add(A,"crouchSmoothing",1,30,1).name("下沉平滑速率");const C=a.addFolder("足部 IK (v8g)"),L=t.ik;C.add(L,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),C.add(L,"weight",0,1,.01).name("钉地权重"),C.add(L,"attackScale",0,1,.01).name("攻击时权重倍率"),C.add(L,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=a.addFolder("程序动画 / 武器握持");b.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),b.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),b.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),b.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const y=c.targeting,P=a.addFolder("目标辅助");P.add(y,"targetAssist").name("启用目标辅助"),P.add(y,"range",1,14,.5).name("锁定范围 (m)"),P.add(y,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),P.add(y,"frontBias",0,4,.1).name("朝向加权"),P.add(y,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),P.add(y,"maxLungeScale",1,3,.1).name("前冲最大放大");const B=c.hits,U=a.addFolder("命中 / 受击 / 击退");U.add(B,"arcDeg",10,120,5).name("命中扇区半角 (°)"),U.add(B,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),U.add(B,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),U.add(B,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),U.add(B.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),U.add(B.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),U.add(B,"dummyReach",.5,4,.1).name("假人命中距离 (m)");const W=c.separation,R=a.addFolder("角色间分离");R.add(W,"iterations",1,8,1).name("迭代次数"),R.add(W,"slop",0,.05,.002).name("额外分离量 (m)"),R.add(W.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),R.add(W.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),R.add(W.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const T=c.dash,O=a.addFolder("冲刺 / 闪避");O.add(T,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),O.add(T,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),O.add(T,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),O.add(T,"blinkDistance",1,12,.25).name("闪现距离 (m)"),O.add(T,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),O.add(T,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),O.add(T,"blinkClearVelocity").name("闪现清空速度"),O.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),O.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const F=c.camera,$=a.addFolder("智能相机");$.add(F,"radius",2,18,.5).name("威胁评估半径 (m)"),$.add(F,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),$.add(F,"saturation",.5,8,.1).name("威胁归一化饱和"),$.add(F,"pushIn",0,.5,.01).name("无威胁推进比例"),$.add(F,"maxPullback",0,1,.02).name("最大拉远比例"),$.add(F,"maxOffset",0,6,.1).name("最大构图平移 (m)"),$.add(F,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),$.add(F,"framingBias",0,1,.05).name("威胁质心平移系数"),$.add(F,"attackBoost",0,2,.05).name("挥砍中额外加权"),$.add(F.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),$.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const at=a.addFolder("输入");at.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),at.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const ut=c.dummies,ot=a.addFolder("假人参数");ot.add(ut,"moveSpeed",.5,8,.1).name("移动速度"),ot.add(ut,"wanderRadius",.5,8,.1).name("游走半径"),ot.add(ut,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),ot.add(ut,"followStopDistance",.3,5,.1).name("跟随停距"),ot.add(ut,"keepDistance",1,10,.1).name("保持距离"),ot.add(ut,"keepDeadZone",.1,2,.05).name("保持死区"),ot.add(ut,"attackRange",.5,5,.1).name("攻击距离"),ot.add(ut,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const vt=a.addFolder("相机");vt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),vt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),vt.add(t.camera,"distance",6,35,.5).name("距离"),vt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),vt.add(t.camera,"fov",25,90,1).name("FOV");const q=a.addFolder("相机缩放 (v8e)");q.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),q.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),q.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),q.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),q.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),q.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),q.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),q.add({reset:n.resetZoom},"reset").name("缩放归 1");const J=a.addFolder("受击分层 (v8f)"),ct=t.hurt;J.add(ct,"enabled").name("启用分层受击 (关=旧版对照)"),J.add(ct,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),J.add(ct,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),J.add(ct,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),J.add(ct,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),J.add(ct,"upperShiftScale",0,1,.01).name("上身位移缩放"),J.add(ct,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),J.add(ct.hitHeight,"light",0,1,.01).name("轻击命中部位"),J.add(ct.hitHeight,"heavy",0,1,.01).name("重击命中部位"),J.add(ct.hitHeight,"knock",0,1,.01).name("击退命中部位"),J.add(ct,"leanLight",0,1.5,.01).name("轻击力度"),J.add(ct,"leanHeavy",0,1.5,.01).name("重击力度"),J.add(ct,"leanKnock",0,1.5,.01).name("击退力度"),J.add(ct,"flashStrength",0,2,.05).name("受击闪光强度");const lt=[{name:"打腹 (abdomen)",p:ct.abdomen},{name:"打肩 (shoulder)",p:ct.shoulder}].map(({name:Rt,p:Tt})=>{const k=J.addFolder(Rt);return k.add(Tt,"upperPitch",0,2,.01).name("上身前后倾斜"),k.add(Tt,"upperRoll",0,2,.01).name("上身侧倾"),k.add(Tt,"upperYaw",0,1.5,.01).name("肩部扭转"),k.add(Tt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),k.add(Tt,"shift",0,.8,.01).name("身体反应位移"),k.add(Tt,"drop",0,.4,.01).name("整体下沉"),k.add(Tt,"back",0,.4,.01).name("屁股向后"),k.add(Tt,"knee",0,1.6,.01).name("屈膝"),k.add(Tt,"hip",0,1,.01).name("髋前倾"),k.add(Tt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),k}),gt=a.addFolder("派生招 (v9a)"),At=i.config.links;gt.add(At,"enabled").name("总开关 (false=旧连击)"),gt.add(At.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),gt.add(At.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),gt.add(At.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),gt.add(At,"sharedCooldown",0,3,.05).name("共享 CD (s)"),gt.add(At,"triggerWhileSprinting").name("长跑中可直接触发"),gt.add(At.search,"range",1,14,.1).name("索敌距离 (m)"),gt.add(At.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),gt.add(At.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Dt=At.moves["sword-shield"];Dt&&(gt.add(Dt,"enabled").name("剑盾盾击"),gt.add(Dt,"distance",0,8,.1).name("冲锋极限 (m)"),gt.add(Dt,"windup",0,.5,.01).name("前摇 (s)"),gt.add(Dt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),gt.add(Dt,"recovery",0,.8,.01).name("收势 (s)"),gt.add(Dt.hit,"radius",0,4,.05).name("命中半径 (m)"),gt.add(Dt.hit,"width",0,2,.05).name("扫掠半径 (m)"),gt.add(Dt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),gt.add(Dt.hit,"duration",0,1.5,.01).name("僵直 (s)")),gt.add(i.config.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Xt=a.addFolder("显示");return Xt.add(e,"showColliders").name("碰撞盒线框").onChange(n.onToggleColliders),Xt.add(e,"showGrid").name("地面网格").onChange(n.onToggleGrid),l.close(),d.close(),m.close(),v.close(),b.close(),D.close(),C.close(),P.close(),U.close(),R.close(),O.close(),$.close(),at.close(),o.close(),ot.close(),vt.close(),q.close(),J.close(),gt.close(),lt.forEach(Rt=>Rt.close()),Xt.close(),a.close(),{gui:a,refreshWeapon:()=>u.updateDisplay()}}const ja=Math.PI*2,Mn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},cf=45,lf=50;function df(i,t,e){return{x:e.rightX*i+e.rightZ*t,y:-(e.forwardX*i+e.forwardZ*t)}}function ls(i,t,e){const n=df(i,t,e);return Math.atan2(n.x,-n.y)*180/Math.PI}function hf(i,t){return Math.atan2(i,-t)*180/Math.PI}function kc(i,t){return Math.abs(((i-t)%360+540)%360-180)}function Ds(i){return(i%360+360)%360}const uf={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function ff(i,t,e,n=8){const s=i.character,a=t.intents,r=Math.hypot(a.moveX,a.moveZ),o=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),h=r>.001?ls(a.moveX,a.moveZ,e):null,f=l>.15?ls(c.x,c.z,e):null,p=ls(Math.sin(s.facing),Math.cos(s.facing),e),d=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?ls(a.aimX,a.aimZ,e):null,g=i.targeting,_=g.hasTarget?ls(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&f!==null?kc(h,f):null,u=h!==null?kc(h,p):null,x=m!==null&&m>cf&&r>=.35&&l>=.4;return{inDeg:h,inLen:Math.min(1,r),rawDeg:o>.02?hf(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,o),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:p,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:d,gapMove:m,gapFace:u,warnMove:x}}function Uc(i,t){return!t&&i.aimDeg===null&&i.gapFace!==null&&i.gapFace>lf&&(i.inLen>=.35||i.speed>=.4)}const Fc="harness.dirDebug";function pf(i={}){const t=document.createElement("div");t.id="dirdbg",t.innerHTML=['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>','<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"].join(""),document.body.appendChild(t);const e=t.querySelector("#dirdbg-canvas"),n=t.querySelector("#dirdbg-toggle"),s={in:t.querySelector('[data-k="in"]'),mv:t.querySelector('[data-k="mv"]'),fc:t.querySelector('[data-k="fc"]'),gap:t.querySelector('[data-k="gap"]')},a=e.getContext("2d");let r=!0;try{r=window.localStorage.getItem(Fc)!=="0"}catch{}function o(){t.classList.toggle("is-off",!r),n.textContent=r?"方向 ⌄":"方向 ▸",n.setAttribute("aria-expanded",String(r))}o();function c(u){r=u;try{window.localStorage.setItem(Fc,u?"1":"0")}catch{}o()}n.addEventListener("pointerdown",u=>{u.preventDefault(),u.stopPropagation(),c(!r)}),window.addEventListener("keydown",u=>{u.key.toLowerCase()==="v"&&!u.metaKey&&!u.ctrlKey&&c(!r)});const l=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;e.width=Math.round(h*l),e.height=Math.round(h*l);let f=uf,p=0,d="",g=8;function _(u){if(!a)return;const x=h,S=h,v=x/2,D=S/2,A=Math.min(x,S)/2-13;a.setTransform(l,0,0,l,0,0),a.clearRect(0,0,x,S),a.beginPath(),a.arc(v,D,A,0,ja),a.fillStyle="rgba(8, 12, 17, 0.5)",a.fill(),a.lineWidth=1,a.strokeStyle=u.warnMove?"rgba(251, 191, 36, 0.85)":Mn.ring,a.stroke(),a.strokeStyle=Mn.grid,a.beginPath(),a.moveTo(v-A,D),a.lineTo(v+A,D),a.moveTo(v,D-A),a.lineTo(v,D+A),a.stroke();for(let y=0;y<8;y++){const P=y*Math.PI/4,B=v+Math.sin(P)*(A-3),U=D-Math.cos(P)*(A-3),W=v+Math.sin(P)*A,R=D-Math.cos(P)*A;a.beginPath(),a.moveTo(B,U),a.lineTo(W,R),a.stroke()}const C=i.deadZone?Math.min(.9,Math.max(0,i.deadZone())):0;C>0&&(a.save(),a.setLineDash([2,3]),a.strokeStyle=Mn.dead,a.beginPath(),a.arc(v,D,A*C,0,ja),a.stroke(),a.restore());const L=(y,P,B,U,W=!1,R=1)=>{const T=y*Math.PI/180,O=Math.sin(T),F=-Math.cos(T),$=A*Math.max(.14,Math.min(1,P)),at=v+O*A*.14,ut=D+F*A*.14,ot=v+O*$,vt=D+F*$;if(a.save(),a.globalAlpha=R,a.strokeStyle=B,a.fillStyle=B,a.lineWidth=U,a.lineCap="round",W&&a.setLineDash([3,3]),a.beginPath(),a.moveTo(at,ut),a.lineTo(ot,vt),a.stroke(),!W&&$>A*.3){const q=-F,J=O,ct=5.2;a.beginPath(),a.moveTo(ot+O*1.5,vt+F*1.5),a.lineTo(ot-O*ct+q*ct*.72,vt-F*ct+J*ct*.72),a.lineTo(ot-O*ct-q*ct*.72,vt-F*ct-J*ct*.72),a.closePath(),a.fill()}a.restore()},b=(y,P)=>{const B=y*Math.PI/180,U=Math.sin(B),W=-Math.cos(B),R=-W,T=U,O=A+1.5,F=O+6.5;a.save(),a.fillStyle=P,a.strokeStyle=P,a.lineWidth=1,a.beginPath(),a.moveTo(v+U*F,D+W*F),a.lineTo(v+U*O+R*4,D+W*O+T*4),a.lineTo(v+U*O-R*4,D+W*O-T*4),a.closePath(),a.fill(),a.restore()};u.lockDeg!==null&&L(u.lockDeg,1,Mn.lock,1,!0,.7),u.rawDeg!==null&&u.stickHeld&&L(u.rawDeg,u.rawLen,Mn.raw,1,!0,.9),u.aimDeg!==null&&L(u.aimDeg,1,Mn.aim,1.6,!0,.95),L(u.faceDeg,1,Mn.face,1.1,!0,.55),u.moveDeg!==null&&L(u.moveDeg,u.speed/Math.max(1,g),Mn.move,5.5,!1,.8),u.inDeg!==null&&L(u.inDeg,u.inLen,Mn.input,2.2),b(u.faceDeg,Mn.face),a.beginPath(),a.arc(v,D,2.2,0,ja),a.fillStyle="rgba(220, 235, 248, 0.85)",a.fill()}function m(u,x){const S=A=>A===null?"-":String(Math.round(Ds(A)));s.in.textContent=`入 ${S(u.inDeg)}`,s.mv.textContent=`移 ${S(u.moveDeg)}`,s.fc.textContent=`面 ${S(u.faceDeg)}`;const v=A=>A===null?"-":`${Math.round(A)}°`,D=[`Δ入→移 ${v(u.gapMove)}`,`Δ入→面 ${v(u.gapFace)}`];u.speed>.05&&D.push(`v${u.speed.toFixed(1)}`),u.lockDeg!==null&&D.push(`锁#${u.lockId} ${u.lockDist.toFixed(1)}m`),u.aimDeg!==null&&D.push("拖拽瞄准"),s.gap.textContent=D.join("  "),t.classList.toggle("is-warn",u.warnMove||Uc(u,x))}return{update(u,x,S){if(!r)return;g=Math.max(1,u.config.moveSpeed*Math.max(1,u.config.sprintMultiplier));const v=ff(u,x,S,g);f=v;const D=u.combat.phase!=="idle";_(v);const A=performance.now(),C=`${v.inDeg}|${v.moveDeg}|${v.faceDeg}|${v.lockId}|${v.aimDeg}|${v.warnMove}|${v.speed.toFixed(1)}`;(A-p>90||C!==d)&&(p=A,d=C,m(v,D),t.dataset.in=v.inDeg===null?"":Ds(v.inDeg).toFixed(1),t.dataset.mv=v.moveDeg===null?"":Ds(v.moveDeg).toFixed(1),t.dataset.fc=Ds(v.faceDeg).toFixed(1),t.dataset.warn=v.warnMove||Uc(v,D)?"1":"0")},setEnabled:c,toggle(){return c(!r),r},enabled:()=>r,last:()=>f}}const mf=["剑盾","双剑","大剑","法杖","弓"],gf={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function _f(i){return{update(t,e,n,s,a,r,o=!1){const c=t.character,l=c.position,h=c.velocity,f=t.combat,p=t.events.length>0?t.events[t.events.length-1]:null,d=Rt=>Rt.toFixed(2),g=Rt=>(Rt*180/Math.PI).toFixed(0),_=mf[yi.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),u="|".repeat(m)+".".repeat(10-m),x=t.dash,S=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${S.toFixed(0)}%`:`${x.kind} cd${d(x.cooldown)}`,D=s.intents.aimActive?`(${d(s.intents.aimX)},${d(s.intents.aimZ)})`:"-",A=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),C=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),L=Math.abs(A)+Math.abs(C)+1e-6,b=Math.round(Math.abs(C)/L*100),y=`strafe ${b}%${A<-.05?" back":""}`,P=t.camera,B=`threat ${(P.threat*100).toFixed(0)}%  dist×${d(P.distanceScale)}  off (${d(P.offsetX)},${d(P.offsetZ)})  pitch +${d(P.pitchDelta)}°  n=${P.threatCount}`,U=r?d(r.attackBlend):"-",W=r==null?void 0:r.attackWeights,R=W?`gw ${d(W.gaitScale)}  lw ${d(W.attackLegWeight)}  spd ${d(W.driveSpeed)}`:"-",T=W?`${d(W.gaitScale)}/${d(W.attackLegWeight)}`:"-",O=r?`${r.landing.kind} ${d(r.landing.pulse)} t${d(r.landing.remaining)} vy${d(r.landing.impactVy)}`:"-",F=r?`${r.landing.kind}/${d(r.landing.pulse)}`:"-",$=(r==null?void 0:r.zoom)!==void 0?`zoom ×${d(r.zoom)}`:"-",at=r==null?void 0:r.hurt,ut=at?`hurt ${t.playerHurt.type}  部位h${d(at.hitHeight)}  脉冲p${d(at.pulse)}  上身${d(at.upperShift)}  重心${d(at.comShift)}  后坐${d(at.pelvisBack)}  屈膝${d(at.knee)}`:"-",ot=at?`${d(at.hitHeight)}/${d(at.pulse)}/${d(at.knee)}`:"-",vt=r==null?void 0:r.ik,q=vt?`${vt.active?"on":"off"} w${d(vt.weight)} e${d(vt.maxError)}`:"-",J=t.playerLink,ct=`link ${J.kind||"-"}  ${J.phase}  prog ${d(J.progress)}  win ${d(J.linkWindow)}s  cd ${d(J.cooldown)}s  hits ${J.hitIds.length}  travel ${d(J.travelled)}/${d(J.travel)}m  id ${J.id}`,lt=`${J.phase}/${J.kind||"-"}/w${d(J.linkWindow)}`,gt=s.lastGesture,At=gt?`${gt.button} ${gt.kind} ${gt.heldMs.toFixed(0)}ms d${gt.distance.toFixed(0)}px ${gt.angleDeg.toFixed(0)}° taps${gt.taps}`:"-",Dt=t.dummies.map(Rt=>`${Rt.id}:${gf[Rt.mode]}`).join("  ");if(o){i.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${J.phase}${J.kind?`/${J.kind}`:""} w${d(J.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?i.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${n}`,`pos (${d(l.x)},${d(l.y)},${d(l.z)})  vel (${d(h.x)},${d(h.y)},${d(h.z)})`,`face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  st${b}%  stick(${d(s.stickX)},${d(s.stickY)}) ${s.source}  str${d(c.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${d(f.attackProgress)}  dash ${v}  ab ${U}  gw/lw ${T}  land ${F}  ik ${q}`,`aim ${D}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ot}`,`dummies ${Dt}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${d(P.distanceScale)}  ${$}  lk ${lt}`,`event ${p?`${p.type} ${d(p.value)}`:"-"}  scale ${d(a.timeScale)}${a.paused?" [P]":""}  g ${At}`].join(`
`):i.textContent=[`tick ${t.tick}   t ${d(t.time)}s   fps ${e.toFixed(0)}   steps ${n}`,`pos  (${d(l.x)}, ${d(l.y)}, ${d(l.z)})`,`vel  (${d(h.x)}, ${d(h.y)}, ${d(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${g(c.facing)}deg   atkBlend ${U}   ${R}   land ${O}`,ut,`ik ${q}  clamped ${vt?vt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(c.facing)}  body ${g(c.bodyYaw)}  head ${g(c.headYaw)}  move ${g(c.moveYaw)}  (head-body ${g(c.headYaw-c.bodyYaw)})  ${y}`,`move (${d(s.intents.moveX)}, ${d(s.intents.moveZ)})  stick (${d(s.stickX)}, ${d(s.stickY)})  ${s.source}  aim ${D}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${d(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${S.toFixed(0)}%  cd ${d(x.cooldown)}s  id ${x.id}  from (${d(x.fromX)},${d(x.fromZ)}) → to (${d(x.toX)},${d(x.toZ)})`,ct,`camera ${B}  ${$}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${u}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Dt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${d(t.impulse.x)}, ${d(t.impulse.z)})`,`event ${p?`${p.type} ${d(p.value)}`:"-"}   scale ${d(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${At}`].join(`
`)}}}const xf=8e3;function vf(i,t){const e=document.getElementById("hud-toggle"),n=document.getElementById("hint-toggle");let s=!1,a=!1,r=0;function o(){i.classList.toggle("is-compact",!s),e==null||e.setAttribute("aria-expanded",String(s)),e&&(e.textContent=s?"状态 ▾":"状态 ▸",e.setAttribute("aria-label",s?"收起状态读数":"展开状态读数")),t&&(t.hidden=!a),n==null||n.setAttribute("aria-expanded",String(a)),n&&(n.textContent=a?"操作说明 ▾":"操作说明 ▸",n.setAttribute("aria-label",a?"收起操作说明":"展开操作说明"))}function c(){a&&(a=!1,window.clearTimeout(r),r=0,o())}function l(){s&&(s=!1,o())}function h(d){d.preventDefault(),d.stopPropagation(),s=!s,o()}function f(d){d.preventDefault(),d.stopPropagation(),a=!a,window.clearTimeout(r),r=0,a&&(r=window.setTimeout(c,xf)),o()}e==null||e.addEventListener("pointerdown",h),n==null||n.addEventListener("pointerdown",f);function p(d){const g=d.target;g instanceof Element&&g.closest("#fold-row, #hint")||(c(),l())}return window.addEventListener("pointerdown",p,{capture:!0,passive:!0}),o(),{hudCompact:()=>!s}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $o="170",Mf=0,Nc=1,yf=2,sd=1,ad=2,Fn=3,ti=0,$e=1,He=2,Kn=0,qi=1,zc=2,Oc=3,Bc=4,Sf=5,gi=100,bf=101,Ef=102,wf=103,Af=104,Tf=200,Rf=201,Cf=202,Pf=203,Yr=204,Zr=205,Df=206,Lf=207,If=208,kf=209,Uf=210,Ff=211,Nf=212,zf=213,Of=214,qr=0,jr=1,Kr=2,Ji=3,Jr=4,Qr=5,to=6,eo=7,Yo=0,Bf=1,Hf=2,Jn=0,Gf=1,Vf=2,Xf=3,Wf=4,$f=5,Yf=6,Zf=7,rd=300,Qi=301,ts=302,no=303,io=304,Ia=306,so=1e3,xi=1001,ao=1002,_n=1003,qf=1004,Ls=1005,wn=1006,Ka=1007,vi=1008,Hn=1009,od=1010,cd=1011,Es=1012,Zo=1013,Si=1014,zn=1015,As=1016,qo=1017,jo=1018,es=1020,ld=35902,dd=1021,hd=1022,gn=1023,ud=1024,fd=1025,ji=1026,ns=1027,pd=1028,Ko=1029,md=1030,Jo=1031,Qo=1033,la=33776,da=33777,ha=33778,ua=33779,ro=35840,oo=35841,co=35842,lo=35843,ho=36196,uo=37492,fo=37496,po=37808,mo=37809,go=37810,_o=37811,xo=37812,vo=37813,Mo=37814,yo=37815,So=37816,bo=37817,Eo=37818,wo=37819,Ao=37820,To=37821,fa=36492,Ro=36494,Co=36495,gd=36283,Po=36284,Do=36285,Lo=36286,jf=3200,Kf=3201,_d=0,Jf=1,qn="",en="srgb",ss="srgb-linear",ka="linear",oe="srgb",Ci=7680,Hc=519,Qf=512,tp=513,ep=514,xd=515,np=516,ip=517,sp=518,ap=519,Io=35044,Gc="300 es",On=2e3,Aa=2001;class as{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],pa=Math.PI/180,ko=180/Math.PI;function Qn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]).toLowerCase()}function We(i,t,e){return Math.max(t,Math.min(e,i))}function rp(i,t){return(i%t+t)%t}function Ja(i,t,e){return(1-e)*i+e*t}function En(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ce(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Kt{constructor(t=0,e=0){Kt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(We(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*s+t.x,this.y=a*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,n,s,a,r,o,c,l){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l)}set(t,e,n,s,a,r,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=a,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],h=n[4],f=n[7],p=n[2],d=n[5],g=n[8],_=s[0],m=s[3],u=s[6],x=s[1],S=s[4],v=s[7],D=s[2],A=s[5],C=s[8];return a[0]=r*_+o*x+c*D,a[3]=r*m+o*S+c*A,a[6]=r*u+o*v+c*C,a[1]=l*_+h*x+f*D,a[4]=l*m+h*S+f*A,a[7]=l*u+h*v+f*C,a[2]=p*_+d*x+g*D,a[5]=p*m+d*S+g*A,a[8]=p*u+d*v+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*o*l-n*a*h+n*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=h*r-o*l,p=o*c-h*a,d=l*a-r*c,g=e*f+n*p+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*r)*_,t[3]=p*_,t[4]=(h*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=d*_,t[7]=(n*c-l*e)*_,t[8]=(r*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Qa.makeScale(t,e)),this}rotate(t){return this.premultiply(Qa.makeRotation(-t)),this}translate(t,e){return this.premultiply(Qa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Qa=new Jt;function vd(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ta(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function op(){const i=Ta("canvas");return i.style.display="block",i}const Vc={};function xs(i){i in Vc||(Vc[i]=!0,console.warn(i))}function cp(i,t,e){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}function lp(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function dp(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ie={enabled:!0,workingColorSpace:ss,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===oe&&(i.r=Bn(i.r),i.g=Bn(i.g),i.b=Bn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===oe&&(i.r=Ki(i.r),i.g=Ki(i.g),i.b=Ki(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===qn?ka:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Bn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Xc=[.64,.33,.3,.6,.15,.06],Wc=[.2126,.7152,.0722],$c=[.3127,.329],Yc=new Jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zc=new Jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ie.define({[ss]:{primaries:Xc,whitePoint:$c,transfer:ka,toXYZ:Yc,fromXYZ:Zc,luminanceCoefficients:Wc,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:Xc,whitePoint:$c,transfer:oe,toXYZ:Yc,fromXYZ:Zc,luminanceCoefficients:Wc,outputColorSpaceConfig:{drawingBufferColorSpace:en}}});let Pi;class hp{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Pi===void 0&&(Pi=Ta("canvas")),Pi.width=t.width,Pi.height=t.height;const n=Pi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ta("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Bn(a[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Bn(e[n]/255)*255):e[n]=Bn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let up=0;class Md{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=Qn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(tr(s[r].image)):a.push(tr(s[r]))}else a=tr(s);n.url=a}return e||(t.images[this.uuid]=n),n}}function tr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?hp.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let fp=0;class Ve extends as{constructor(t=Ve.DEFAULT_IMAGE,e=Ve.DEFAULT_MAPPING,n=xi,s=xi,a=wn,r=vi,o=gn,c=Hn,l=Ve.DEFAULT_ANISOTROPY,h=qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fp++}),this.uuid=Qn(),this.name="",this.source=new Md(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Kt(0,0),this.repeat=new Kt(1,1),this.center=new Kt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==rd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case so:t.x=t.x-Math.floor(t.x);break;case xi:t.x=t.x<0?0:1;break;case ao:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case so:t.y=t.y-Math.floor(t.y);break;case xi:t.y=t.y<0?0:1;break;case ao:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ve.DEFAULT_IMAGE=null;Ve.DEFAULT_MAPPING=rd;Ve.DEFAULT_ANISOTROPY=1;class Me{constructor(t=0,e=0,n=0,s=1){Me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a;const c=t.elements,l=c[0],h=c[4],f=c[8],p=c[1],d=c[5],g=c[9],_=c[2],m=c[6],u=c[10];if(Math.abs(h-p)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+p)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(l+1)/2,v=(d+1)/2,D=(u+1)/2,A=(h+p)/4,C=(f+_)/4,L=(g+m)/4;return S>v&&S>D?S<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(S),s=A/n,a=C/n):v>D?v<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),n=A/s,a=L/s):D<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(D),n=C/a,s=L/a),this.set(n,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(p-h)*(p-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-_)/x,this.z=(p-h)/x,this.w=Math.acos((l+d+u-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class pp extends as{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:wn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new Ve(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Md(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends pp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class yd extends Ve{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class mp extends Ve{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ts{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,r,o){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3];const p=a[r+0],d=a[r+1],g=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=p,t[e+1]=d,t[e+2]=g,t[e+3]=_;return}if(f!==_||c!==p||l!==d||h!==g){let m=1-o;const u=c*p+l*d+h*g+f*_,x=u>=0?1:-1,S=1-u*u;if(S>Number.EPSILON){const D=Math.sqrt(S),A=Math.atan2(D,u*x);m=Math.sin(m*A)/D,o=Math.sin(o*A)/D}const v=o*x;if(c=c*m+p*v,l=l*m+d*v,h=h*m+g*v,f=f*m+_*v,m===1-o){const D=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=D,l*=D,h*=D,f*=D}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,a,r){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=a[r],p=a[r+1],d=a[r+2],g=a[r+3];return t[e]=o*g+h*f+c*d-l*p,t[e+1]=c*g+h*p+l*f-o*d,t[e+2]=l*g+h*d+o*p-c*f,t[e+3]=h*g-o*f-c*p-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),f=o(a/2),p=c(n/2),d=c(s/2),g=c(a/2);switch(r){case"XYZ":this._x=p*h*f+l*d*g,this._y=l*d*f-p*h*g,this._z=l*h*g+p*d*f,this._w=l*h*f-p*d*g;break;case"YXZ":this._x=p*h*f+l*d*g,this._y=l*d*f-p*h*g,this._z=l*h*g-p*d*f,this._w=l*h*f+p*d*g;break;case"ZXY":this._x=p*h*f-l*d*g,this._y=l*d*f+p*h*g,this._z=l*h*g+p*d*f,this._w=l*h*f-p*d*g;break;case"ZYX":this._x=p*h*f-l*d*g,this._y=l*d*f+p*h*g,this._z=l*h*g-p*d*f,this._w=l*h*f+p*d*g;break;case"YZX":this._x=p*h*f+l*d*g,this._y=l*d*f+p*h*g,this._z=l*h*g-p*d*f,this._w=l*h*f-p*d*g;break;case"XZY":this._x=p*h*f-l*d*g,this._y=l*d*f-p*h*g,this._z=l*h*g+p*d*f,this._w=l*h*f+p*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],h=e[6],f=e[10],p=n+o+f;if(p>0){const d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(h-c)*d,this._y=(a-l)*d,this._z=(r-s)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+l)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(a-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(r-s)/d,this._x=(a+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(We(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-n*l,this._z=a*h+r*l+n*c-s*o,this._w=r*h-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),f=Math.sin((1-e)*h)/l,p=Math.sin(e*h)/l;return this._w=r*f+this._w*p,this._x=n*f+this._x*p,this._y=s*f+this._y*p,this._z=a*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(t=0,e=0,n=0){X.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*n),h=2*(o*e-a*s),f=2*(a*n-r*e);return this.x=e+c*l+r*f-o*h,this.y=n+c*h+o*l-a*f,this.z=s+c*f+a*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return er.copy(this).projectOnVector(t),this.sub(er)}reflect(t){return this.sub(er.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(We(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const er=new X,qc=new Ts;class Rs{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,un):un.fromBufferAttribute(a,r),un.applyMatrix4(t.matrixWorld),this.expandByPoint(un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Is.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Is.copy(n.boundingBox)),Is.applyMatrix4(t.matrixWorld),this.union(Is)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,un),un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ds),ks.subVectors(this.max,ds),Di.subVectors(t.a,ds),Li.subVectors(t.b,ds),Ii.subVectors(t.c,ds),Vn.subVectors(Li,Di),Xn.subVectors(Ii,Li),ri.subVectors(Di,Ii);let e=[0,-Vn.z,Vn.y,0,-Xn.z,Xn.y,0,-ri.z,ri.y,Vn.z,0,-Vn.x,Xn.z,0,-Xn.x,ri.z,0,-ri.x,-Vn.y,Vn.x,0,-Xn.y,Xn.x,0,-ri.y,ri.x,0];return!nr(e,Di,Li,Ii,ks)||(e=[1,0,0,0,1,0,0,0,1],!nr(e,Di,Li,Ii,ks))?!1:(Us.crossVectors(Vn,Xn),e=[Us.x,Us.y,Us.z],nr(e,Di,Li,Ii,ks))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Dn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Dn=[new X,new X,new X,new X,new X,new X,new X,new X],un=new X,Is=new Rs,Di=new X,Li=new X,Ii=new X,Vn=new X,Xn=new X,ri=new X,ds=new X,ks=new X,Us=new X,oi=new X;function nr(i,t,e,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){oi.fromArray(i,a);const o=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),c=t.dot(oi),l=e.dot(oi),h=n.dot(oi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const gp=new Rs,hs=new X,ir=new X;class Ua{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):gp.setFromPoints(t).getCenter(n);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;hs.subVectors(t,this.center);const e=hs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(hs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ir.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(hs.copy(t.center).add(ir)),this.expandByPoint(hs.copy(t.center).sub(ir))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ln=new X,sr=new X,Fs=new X,Wn=new X,ar=new X,Ns=new X,rr=new X;class tc{constructor(t=new X,e=new X(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ln)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ln.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ln.copy(this.origin).addScaledVector(this.direction,e),Ln.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){sr.copy(t).add(e).multiplyScalar(.5),Fs.copy(e).sub(t).normalize(),Wn.copy(this.origin).sub(sr);const a=t.distanceTo(e)*.5,r=-this.direction.dot(Fs),o=Wn.dot(this.direction),c=-Wn.dot(Fs),l=Wn.lengthSq(),h=Math.abs(1-r*r);let f,p,d,g;if(h>0)if(f=r*c-o,p=r*o-c,g=a*h,f>=0)if(p>=-g)if(p<=g){const _=1/h;f*=_,p*=_,d=f*(f+r*p+2*o)+p*(r*f+p+2*c)+l}else p=a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;else p=-a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;else p<=-g?(f=Math.max(0,-(-r*a+o)),p=f>0?-a:Math.min(Math.max(-a,-c),a),d=-f*f+p*(p+2*c)+l):p<=g?(f=0,p=Math.min(Math.max(-a,-c),a),d=p*(p+2*c)+l):(f=Math.max(0,-(r*a+o)),p=f>0?a:Math.min(Math.max(-a,-c),a),d=-f*f+p*(p+2*c)+l);else p=r>0?-a:a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(sr).addScaledVector(Fs,p),d}intersectSphere(t,e){Ln.subVectors(t.center,this.origin);const n=Ln.dot(this.direction),s=Ln.dot(Ln)-n*n,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,p=this.origin;return l>=0?(n=(t.min.x-p.x)*l,s=(t.max.x-p.x)*l):(n=(t.max.x-p.x)*l,s=(t.min.x-p.x)*l),h>=0?(a=(t.min.y-p.y)*h,r=(t.max.y-p.y)*h):(a=(t.max.y-p.y)*h,r=(t.min.y-p.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-p.z)*f,c=(t.max.z-p.z)*f):(o=(t.max.z-p.z)*f,c=(t.min.z-p.z)*f),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ln)!==null}intersectTriangle(t,e,n,s,a){ar.subVectors(e,t),Ns.subVectors(n,t),rr.crossVectors(ar,Ns);let r=this.direction.dot(rr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Wn.subVectors(this.origin,t);const c=o*this.direction.dot(Ns.crossVectors(Wn,Ns));if(c<0)return null;const l=o*this.direction.dot(ar.cross(Wn));if(l<0||c+l>r)return null;const h=-o*Wn.dot(rr);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class me{constructor(t,e,n,s,a,r,o,c,l,h,f,p,d,g,_,m){me.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l,h,f,p,d,g,_,m)}set(t,e,n,s,a,r,o,c,l,h,f,p,d,g,_,m){const u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=a,u[5]=r,u[9]=o,u[13]=c,u[2]=l,u[6]=h,u[10]=f,u[14]=p,u[3]=d,u[7]=g,u[11]=_,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new me().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ki.setFromMatrixColumn(t,0).length(),a=1/ki.setFromMatrixColumn(t,1).length(),r=1/ki.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const p=r*h,d=r*f,g=o*h,_=o*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=d+g*l,e[5]=p-_*l,e[9]=-o*c,e[2]=_-p*l,e[6]=g+d*l,e[10]=r*c}else if(t.order==="YXZ"){const p=c*h,d=c*f,g=l*h,_=l*f;e[0]=p+_*o,e[4]=g*o-d,e[8]=r*l,e[1]=r*f,e[5]=r*h,e[9]=-o,e[2]=d*o-g,e[6]=_+p*o,e[10]=r*c}else if(t.order==="ZXY"){const p=c*h,d=c*f,g=l*h,_=l*f;e[0]=p-_*o,e[4]=-r*f,e[8]=g+d*o,e[1]=d+g*o,e[5]=r*h,e[9]=_-p*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const p=r*h,d=r*f,g=o*h,_=o*f;e[0]=c*h,e[4]=g*l-d,e[8]=p*l+_,e[1]=c*f,e[5]=_*l+p,e[9]=d*l-g,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const p=r*c,d=r*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-p*f,e[8]=g*f+d,e[1]=f,e[5]=r*h,e[9]=-o*h,e[2]=-l*h,e[6]=d*f+g,e[10]=p-_*f}else if(t.order==="XZY"){const p=r*c,d=r*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=p*f+_,e[5]=r*h,e[9]=d*f-g,e[2]=g*f-d,e[6]=o*h,e[10]=_*f+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(_p,t,xp)}lookAt(t,e,n){const s=this.elements;return qe.subVectors(t,e),qe.lengthSq()===0&&(qe.z=1),qe.normalize(),$n.crossVectors(n,qe),$n.lengthSq()===0&&(Math.abs(n.z)===1?qe.x+=1e-4:qe.z+=1e-4,qe.normalize(),$n.crossVectors(n,qe)),$n.normalize(),zs.crossVectors(qe,$n),s[0]=$n.x,s[4]=zs.x,s[8]=qe.x,s[1]=$n.y,s[5]=zs.y,s[9]=qe.y,s[2]=$n.z,s[6]=zs.z,s[10]=qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],h=n[1],f=n[5],p=n[9],d=n[13],g=n[2],_=n[6],m=n[10],u=n[14],x=n[3],S=n[7],v=n[11],D=n[15],A=s[0],C=s[4],L=s[8],b=s[12],y=s[1],P=s[5],B=s[9],U=s[13],W=s[2],R=s[6],T=s[10],O=s[14],F=s[3],$=s[7],at=s[11],ut=s[15];return a[0]=r*A+o*y+c*W+l*F,a[4]=r*C+o*P+c*R+l*$,a[8]=r*L+o*B+c*T+l*at,a[12]=r*b+o*U+c*O+l*ut,a[1]=h*A+f*y+p*W+d*F,a[5]=h*C+f*P+p*R+d*$,a[9]=h*L+f*B+p*T+d*at,a[13]=h*b+f*U+p*O+d*ut,a[2]=g*A+_*y+m*W+u*F,a[6]=g*C+_*P+m*R+u*$,a[10]=g*L+_*B+m*T+u*at,a[14]=g*b+_*U+m*O+u*ut,a[3]=x*A+S*y+v*W+D*F,a[7]=x*C+S*P+v*R+D*$,a[11]=x*L+S*B+v*T+D*at,a[15]=x*b+S*U+v*O+D*ut,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],h=t[2],f=t[6],p=t[10],d=t[14],g=t[3],_=t[7],m=t[11],u=t[15];return g*(+a*c*f-s*l*f-a*o*p+n*l*p+s*o*d-n*c*d)+_*(+e*c*d-e*l*p+a*r*p-s*r*d+s*l*h-a*c*h)+m*(+e*l*f-e*o*d-a*r*f+n*r*d+a*o*h-n*l*h)+u*(-s*o*h-e*c*f+e*o*p+s*r*f-n*r*p+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=t[9],p=t[10],d=t[11],g=t[12],_=t[13],m=t[14],u=t[15],x=f*m*l-_*p*l+_*c*d-o*m*d-f*c*u+o*p*u,S=g*p*l-h*m*l-g*c*d+r*m*d+h*c*u-r*p*u,v=h*_*l-g*f*l+g*o*d-r*_*d-h*o*u+r*f*u,D=g*f*c-h*_*c-g*o*p+r*_*p+h*o*m-r*f*m,A=e*x+n*S+s*v+a*D;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return t[0]=x*C,t[1]=(_*p*a-f*m*a-_*s*d+n*m*d+f*s*u-n*p*u)*C,t[2]=(o*m*a-_*c*a+_*s*l-n*m*l-o*s*u+n*c*u)*C,t[3]=(f*c*a-o*p*a-f*s*l+n*p*l+o*s*d-n*c*d)*C,t[4]=S*C,t[5]=(h*m*a-g*p*a+g*s*d-e*m*d-h*s*u+e*p*u)*C,t[6]=(g*c*a-r*m*a-g*s*l+e*m*l+r*s*u-e*c*u)*C,t[7]=(r*p*a-h*c*a+h*s*l-e*p*l-r*s*d+e*c*d)*C,t[8]=v*C,t[9]=(g*f*a-h*_*a-g*n*d+e*_*d+h*n*u-e*f*u)*C,t[10]=(r*_*a-g*o*a+g*n*l-e*_*l-r*n*u+e*o*u)*C,t[11]=(h*o*a-r*f*a-h*n*l+e*f*l+r*n*d-e*o*d)*C,t[12]=D*C,t[13]=(h*_*s-g*f*s+g*n*p-e*_*p-h*n*m+e*f*m)*C,t[14]=(g*o*s-r*_*s-g*n*c+e*_*c+r*n*m-e*o*m)*C,t[15]=(r*f*s-h*o*s+h*n*c-e*f*c-r*n*p+e*o*p)*C,this}scale(t){const e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),a=1-n,r=t.x,o=t.y,c=t.z,l=a*r,h=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,r){return this.set(1,n,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,h=r+r,f=o+o,p=a*l,d=a*h,g=a*f,_=r*h,m=r*f,u=o*f,x=c*l,S=c*h,v=c*f,D=n.x,A=n.y,C=n.z;return s[0]=(1-(_+u))*D,s[1]=(d+v)*D,s[2]=(g-S)*D,s[3]=0,s[4]=(d-v)*A,s[5]=(1-(p+u))*A,s[6]=(m+x)*A,s[7]=0,s[8]=(g+S)*C,s[9]=(m-x)*C,s[10]=(1-(p+_))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let a=ki.set(s[0],s[1],s[2]).length();const r=ki.set(s[4],s[5],s[6]).length(),o=ki.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],fn.copy(this);const l=1/a,h=1/r,f=1/o;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=f,fn.elements[9]*=f,fn.elements[10]*=f,e.setFromRotationMatrix(fn),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,s,a,r,o=On){const c=this.elements,l=2*a/(e-t),h=2*a/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s);let d,g;if(o===On)d=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===Aa)d=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,a,r,o=On){const c=this.elements,l=1/(e-t),h=1/(n-s),f=1/(r-a),p=(e+t)*l,d=(n+s)*h;let g,_;if(o===On)g=(r+a)*f,_=-2*f;else if(o===Aa)g=a*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ki=new X,fn=new me,_p=new X(0,0,0),xp=new X(1,1,1),$n=new X,zs=new X,qe=new X,jc=new me,Kc=new Ts;class Rn{constructor(t=0,e=0,n=0,s=Rn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],p=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(We(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-We(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(We(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-We(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return jc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(jc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Kc.setFromEuler(this),this.setFromQuaternion(Kc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Rn.DEFAULT_ORDER="XYZ";class ec{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let vp=0;const Jc=new X,Ui=new Ts,In=new me,Os=new X,us=new X,Mp=new X,yp=new Ts,Qc=new X(1,0,0),tl=new X(0,1,0),el=new X(0,0,1),nl={type:"added"},Sp={type:"removed"},Fi={type:"childadded",child:null},or={type:"childremoved",child:null};class Se extends as{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:vp++}),this.uuid=Qn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Se.DEFAULT_UP.clone();const t=new X,e=new Rn,n=new Ts,s=new X(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new me},normalMatrix:{value:new Jt}}),this.matrix=new me,this.matrixWorld=new me,this.matrixAutoUpdate=Se.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ec,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.multiply(Ui),this}rotateOnWorldAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.premultiply(Ui),this}rotateX(t){return this.rotateOnAxis(Qc,t)}rotateY(t){return this.rotateOnAxis(tl,t)}rotateZ(t){return this.rotateOnAxis(el,t)}translateOnAxis(t,e){return Jc.copy(t).applyQuaternion(this.quaternion),this.position.add(Jc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qc,t)}translateY(t){return this.translateOnAxis(tl,t)}translateZ(t){return this.translateOnAxis(el,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Os.copy(t):Os.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(us,Os,this.up):In.lookAt(Os,us,this.up),this.quaternion.setFromRotationMatrix(In),s&&(In.extractRotation(s.matrixWorld),Ui.setFromRotationMatrix(In),this.quaternion.premultiply(Ui.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(nl),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Sp),or.child=t,this.dispatchEvent(or),or.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),In.multiply(t.parent.matrixWorld)),t.applyMatrix4(In),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(nl),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,t,Mp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,yp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),f=r(t.shapes),p=r(t.skeletons),d=r(t.animations),g=r(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Se.DEFAULT_UP=new X(0,1,0);Se.DEFAULT_MATRIX_AUTO_UPDATE=!0;Se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pn=new X,kn=new X,cr=new X,Un=new X,Ni=new X,zi=new X,il=new X,lr=new X,dr=new X,hr=new X,ur=new Me,fr=new Me,pr=new Me;class Ke{constructor(t=new X,e=new X,n=new X){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),pn.subVectors(t,e),s.cross(pn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){pn.subVectors(s,e),kn.subVectors(n,e),cr.subVectors(t,e);const r=pn.dot(pn),o=pn.dot(kn),c=pn.dot(cr),l=kn.dot(kn),h=kn.dot(cr),f=r*l-o*o;if(f===0)return a.set(0,0,0),null;const p=1/f,d=(l*c-o*h)*p,g=(r*h-o*c)*p;return a.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(t,e,n,s,a,r,o,c){return this.getBarycoord(t,e,n,s,Un)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Un.x),c.addScaledVector(r,Un.y),c.addScaledVector(o,Un.z),c)}static getInterpolatedAttribute(t,e,n,s,a,r){return ur.setScalar(0),fr.setScalar(0),pr.setScalar(0),ur.fromBufferAttribute(t,e),fr.fromBufferAttribute(t,n),pr.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(ur,a.x),r.addScaledVector(fr,a.y),r.addScaledVector(pr,a.z),r}static isFrontFacing(t,e,n,s){return pn.subVectors(n,e),kn.subVectors(t,e),pn.cross(kn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),kn.subVectors(this.a,this.b),pn.cross(kn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ke.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ke.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,a){return Ke.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return Ke.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ke.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,a=this.c;let r,o;Ni.subVectors(s,n),zi.subVectors(a,n),lr.subVectors(t,n);const c=Ni.dot(lr),l=zi.dot(lr);if(c<=0&&l<=0)return e.copy(n);dr.subVectors(t,s);const h=Ni.dot(dr),f=zi.dot(dr);if(h>=0&&f<=h)return e.copy(s);const p=c*f-h*l;if(p<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(Ni,r);hr.subVectors(t,a);const d=Ni.dot(hr),g=zi.dot(hr);if(g>=0&&d<=g)return e.copy(a);const _=d*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(zi,o);const m=h*g-d*f;if(m<=0&&f-h>=0&&d-g>=0)return il.subVectors(a,s),o=(f-h)/(f-h+(d-g)),e.copy(s).addScaledVector(il,o);const u=1/(m+_+p);return r=_*u,o=p*u,e.copy(n).addScaledVector(Ni,r).addScaledVector(zi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Sd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},Bs={h:0,s:0,l:0};function mr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class jt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=en){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ie.workingColorSpace){return this.r=t,this.g=e,this.b=n,ie.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ie.workingColorSpace){if(t=rp(t,1),e=We(e,0,1),n=We(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=mr(r,a,t+1/3),this.g=mr(r,a,t),this.b=mr(r,a,t-1/3)}return ie.toWorkingColorSpace(this,s),this}setStyle(t,e=en){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=en){const n=Sd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bn(t.r),this.g=Bn(t.g),this.b=Bn(t.b),this}copyLinearToSRGB(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=en){return ie.fromWorkingColorSpace(Ue.copy(this),t),Math.round(We(Ue.r*255,0,255))*65536+Math.round(We(Ue.g*255,0,255))*256+Math.round(We(Ue.b*255,0,255))}getHexString(t=en){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.fromWorkingColorSpace(Ue.copy(this),e);const n=Ue.r,s=Ue.g,a=Ue.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const f=r-o;switch(l=h<=.5?f/(r+o):f/(2-r-o),r){case n:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-n)/f+2;break;case a:c=(n-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=en){ie.fromWorkingColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,s=Ue.b;return t!==en?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Yn),this.setHSL(Yn.h+t,Yn.s+e,Yn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Yn),t.getHSL(Bs);const n=Ja(Yn.h,Bs.h,e),s=Ja(Yn.s,Bs.s,e),a=Ja(Yn.l,Bs.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new jt;jt.NAMES=Sd;let bp=0;class Ei extends as{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bp++}),this.uuid=Qn(),this.name="",this.blending=qi,this.side=ti,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yr,this.blendDst=Zr,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new jt(0,0,0),this.blendAlpha=0,this.depthFunc=Ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ci,this.stencilZFail=Ci,this.stencilZPass=Ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qi&&(n.blending=this.blending),this.side!==ti&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Yr&&(n.blendSrc=this.blendSrc),this.blendDst!==Zr&&(n.blendDst=this.blendDst),this.blendEquation!==gi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ji&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Hc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ci&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ci&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ci&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Sn extends Ei{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=Yo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new X,Hs=new Kt;class xn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Io,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Hs.fromBufferAttribute(this,e),Hs.applyMatrix3(t),this.setXY(e,Hs.x,Hs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=En(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ce(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=En(e,this.array)),e}setX(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=En(e,this.array)),e}setY(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=En(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=En(e,this.array)),e}setW(t,e){return this.normalized&&(e=ce(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),s=ce(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),s=ce(s,this.array),a=ce(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Io&&(t.usage=this.usage),t}}class bd extends xn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Ed extends xn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class be extends xn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Ep=0;const tn=new me,gr=new Se,Oi=new X,je=new Rs,fs=new Rs,Pe=new X;class Ye extends as{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ep++}),this.uuid=Qn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vd(t)?Ed:bd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Jt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,n){return tn.makeTranslation(t,e,n),this.applyMatrix4(tn),this}scale(t,e,n){return tn.makeScale(t,e,n),this.applyMatrix4(tn),this}lookAt(t){return gr.lookAt(t),gr.updateMatrix(),this.applyMatrix4(gr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new be(n,3))}else{for(let n=0,s=e.count;n<s;n++){const a=t[n];e.setXYZ(n,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const a=e[n];je.setFromBufferAttribute(a),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,je.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,je.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(je.min),this.boundingBox.expandByPoint(je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ua);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(t){const n=this.boundingSphere.center;if(je.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];fs.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(je.min,fs.min),je.expandByPoint(Pe),Pe.addVectors(je.max,fs.max),je.expandByPoint(Pe)):(je.expandByPoint(fs.min),je.expandByPoint(fs.max))}je.getCenter(n);let s=0;for(let a=0,r=t.count;a<r;a++)Pe.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Pe.fromBufferAttribute(o,l),c&&(Oi.fromBufferAttribute(t,l),Pe.add(Oi)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xn(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let L=0;L<n.count;L++)o[L]=new X,c[L]=new X;const l=new X,h=new X,f=new X,p=new Kt,d=new Kt,g=new Kt,_=new X,m=new X;function u(L,b,y){l.fromBufferAttribute(n,L),h.fromBufferAttribute(n,b),f.fromBufferAttribute(n,y),p.fromBufferAttribute(a,L),d.fromBufferAttribute(a,b),g.fromBufferAttribute(a,y),h.sub(l),f.sub(l),d.sub(p),g.sub(p);const P=1/(d.x*g.y-g.x*d.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(P),m.copy(f).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(P),o[L].add(_),o[b].add(_),o[y].add(_),c[L].add(m),c[b].add(m),c[y].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let L=0,b=x.length;L<b;++L){const y=x[L],P=y.start,B=y.count;for(let U=P,W=P+B;U<W;U+=3)u(t.getX(U+0),t.getX(U+1),t.getX(U+2))}const S=new X,v=new X,D=new X,A=new X;function C(L){D.fromBufferAttribute(s,L),A.copy(D);const b=o[L];S.copy(b),S.sub(D.multiplyScalar(D.dot(b))).normalize(),v.crossVectors(A,b);const P=v.dot(c[L])<0?-1:1;r.setXYZW(L,S.x,S.y,S.z,P)}for(let L=0,b=x.length;L<b;++L){const y=x[L],P=y.start,B=y.count;for(let U=P,W=P+B;U<W;U+=3)C(t.getX(U+0)),C(t.getX(U+1)),C(t.getX(U+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new xn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);const s=new X,a=new X,r=new X,o=new X,c=new X,l=new X,h=new X,f=new X;if(t)for(let p=0,d=t.count;p<d;p+=3){const g=t.getX(p+0),_=t.getX(p+1),m=t.getX(p+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,m),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let p=0,d=e.count;p<d;p+=3)s.fromBufferAttribute(e,p+0),a.fromBufferAttribute(e,p+1),r.fromBufferAttribute(e,p+2),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,f=o.normalized,p=new l.constructor(c.length*h);let d=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*h;for(let u=0;u<h;u++)p[g++]=l[d++]}return new xn(p,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ye,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,f=l.length;h<f;h++){const p=l[h],d=t(p,n);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,p=l.length;f<p;f++){const d=l[f];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const a=t.morphAttributes;for(const l in a){const h=[],f=a[l];for(let p=0,d=f.length;p<d;p++)h.push(f[p].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const sl=new me,ci=new tc,Gs=new Ua,al=new X,Vs=new X,Xs=new X,Ws=new X,_r=new X,$s=new X,rl=new X,Ys=new X;class pe extends Se{constructor(t=new Ye,e=new Sn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){$s.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],f=a[c];h!==0&&(_r.fromBufferAttribute(f,t),r?$s.addScaledVector(_r,h):$s.addScaledVector(_r.sub(e),h))}e.add($s)}return e}raycast(t,e){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Gs.copy(n.boundingSphere),Gs.applyMatrix4(a),ci.copy(t.ray).recast(t.near),!(Gs.containsPoint(ci.origin)===!1&&(ci.intersectSphere(Gs,al)===null||ci.origin.distanceToSquared(al)>(t.far-t.near)**2))&&(sl.copy(a).invert(),ci.copy(t.ray).applyMatrix4(sl),!(n.boundingBox!==null&&ci.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ci)))}_computeIntersections(t,e,n){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,p=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,_=p.length;g<_;g++){const m=p[g],u=r[m.materialIndex],x=Math.max(m.start,d.start),S=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let v=x,D=S;v<D;v+=3){const A=o.getX(v),C=o.getX(v+1),L=o.getX(v+2);s=Zs(this,u,t,n,l,h,f,A,C,L),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=g,u=_;m<u;m+=3){const x=o.getX(m),S=o.getX(m+1),v=o.getX(m+2);s=Zs(this,r,t,n,l,h,f,x,S,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,_=p.length;g<_;g++){const m=p[g],u=r[m.materialIndex],x=Math.max(m.start,d.start),S=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let v=x,D=S;v<D;v+=3){const A=v,C=v+1,L=v+2;s=Zs(this,u,t,n,l,h,f,A,C,L),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=g,u=_;m<u;m+=3){const x=m,S=m+1,v=m+2;s=Zs(this,r,t,n,l,h,f,x,S,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function wp(i,t,e,n,s,a,r,o){let c;if(t.side===$e?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,t.side===ti,o),c===null)return null;Ys.copy(o),Ys.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ys);return l<e.near||l>e.far?null:{distance:l,point:Ys.clone(),object:i}}function Zs(i,t,e,n,s,a,r,o,c,l){i.getVertexPosition(o,Vs),i.getVertexPosition(c,Xs),i.getVertexPosition(l,Ws);const h=wp(i,t,e,n,Vs,Xs,Ws,rl);if(h){const f=new X;Ke.getBarycoord(rl,Vs,Xs,Ws,f),s&&(h.uv=Ke.getInterpolatedAttribute(s,o,c,l,f,new Kt)),a&&(h.uv1=Ke.getInterpolatedAttribute(a,o,c,l,f,new Kt)),r&&(h.normal=Ke.getInterpolatedAttribute(r,o,c,l,f,new X),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const p={a:o,b:c,c:l,normal:new X,materialIndex:0};Ke.getNormal(Vs,Xs,Ws,p.normal),h.face=p,h.barycoord=f}return h}class Cn extends Ye{constructor(t=1,e=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],h=[],f=[];let p=0,d=0;g("z","y","x",-1,-1,n,e,t,r,a,0),g("z","y","x",1,-1,n,e,-t,r,a,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,a,4),g("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new be(l,3)),this.setAttribute("normal",new be(h,3)),this.setAttribute("uv",new be(f,2));function g(_,m,u,x,S,v,D,A,C,L,b){const y=v/C,P=D/L,B=v/2,U=D/2,W=A/2,R=C+1,T=L+1;let O=0,F=0;const $=new X;for(let at=0;at<T;at++){const ut=at*P-U;for(let ot=0;ot<R;ot++){const vt=ot*y-B;$[_]=vt*x,$[m]=ut*S,$[u]=W,l.push($.x,$.y,$.z),$[_]=0,$[m]=0,$[u]=A>0?1:-1,h.push($.x,$.y,$.z),f.push(ot/C),f.push(1-at/L),O+=1}}for(let at=0;at<L;at++)for(let ut=0;ut<C;ut++){const ot=p+ut+R*at,vt=p+ut+R*(at+1),q=p+(ut+1)+R*(at+1),J=p+(ut+1)+R*at;c.push(ot,vt,J),c.push(vt,q,J),F+=6}o.addGroup(d,F,b),d+=F,p+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function is(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Be(i){const t={};for(let e=0;e<i.length;e++){const n=is(i[e]);for(const s in n)t[s]=n[s]}return t}function Ap(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function wd(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ie.workingColorSpace}const Tp={clone:is,merge:Be};var Rp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ei extends Ei{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Rp,this.fragmentShader=Cp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=is(t.uniforms),this.uniformsGroups=Ap(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ad extends Se{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new me,this.projectionMatrix=new me,this.projectionMatrixInverse=new me,this.coordinateSystem=On}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Zn=new X,ol=new Kt,cl=new Kt;class nn extends Ad{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ko*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(pa*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ko*2*Math.atan(Math.tan(pa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Zn.x,Zn.y).multiplyScalar(-t/Zn.z),Zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Zn.x,Zn.y).multiplyScalar(-t/Zn.z)}getViewSize(t,e){return this.getViewBounds(t,ol,cl),e.subVectors(cl,ol)}setViewOffset(t,e,n,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(pa*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Bi=-90,Hi=1;class Pp extends Se{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new nn(Bi,Hi,t,e);s.layers=this.layers,this.add(s);const a=new nn(Bi,Hi,t,e);a.layers=this.layers,this.add(a);const r=new nn(Bi,Hi,t,e);r.layers=this.layers,this.add(r);const o=new nn(Bi,Hi,t,e);o.layers=this.layers,this.add(o);const c=new nn(Bi,Hi,t,e);c.layers=this.layers,this.add(c);const l=new nn(Bi,Hi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===On)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Aa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,h]=this.children,f=t.getRenderTarget(),p=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,a),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,p,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Td extends Ve{constructor(t,e,n,s,a,r,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Qi,super(t,e,n,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Dp extends bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Td(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:wn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Cn(5,5,5),a=new ei({name:"CubemapFromEquirect",uniforms:is(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:Kn});a.uniforms.tEquirect.value=e;const r=new pe(s,a),o=e.minFilter;return e.minFilter===vi&&(e.minFilter=wn),new Pp(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(a)}}const xr=new X,Lp=new X,Ip=new Jt;class fi{constructor(t=new X(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=xr.subVectors(n,e).cross(Lp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(xr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Ip.getNormalMatrix(t),s=this.coplanarPoint(xr).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new Ua,qs=new X;class nc{constructor(t=new fi,e=new fi,n=new fi,s=new fi,a=new fi,r=new fi){this.planes=[t,e,n,s,a,r]}set(t,e,n,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=On){const n=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],h=s[5],f=s[6],p=s[7],d=s[8],g=s[9],_=s[10],m=s[11],u=s[12],x=s[13],S=s[14],v=s[15];if(n[0].setComponents(c-a,p-l,m-d,v-u).normalize(),n[1].setComponents(c+a,p+l,m+d,v+u).normalize(),n[2].setComponents(c+r,p+h,m+g,v+x).normalize(),n[3].setComponents(c-r,p-h,m-g,v-x).normalize(),n[4].setComponents(c-o,p-f,m-_,v-S).normalize(),e===On)n[5].setComponents(c+o,p+f,m+_,v+S).normalize();else if(e===Aa)n[5].setComponents(o,f,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(t){return li.center.set(0,0,0),li.radius=.7071067811865476,li.applyMatrix4(t.matrixWorld),this.intersectsSphere(li)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(qs.x=s.normal.x>0?t.max.x:t.min.x,qs.y=s.normal.y>0?t.max.y:t.min.y,qs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(qs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Rd(){let i=null,t=!1,e=null,n=null;function s(a,r){e(a,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function kp(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,f=l.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:p,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,c,l){const h=c.array,f=c.updateRanges;if(i.bindBuffer(l,o),f.length===0)i.bufferSubData(l,0,h);else{f.sort((d,g)=>d.start-g.start);let p=0;for(let d=1;d<f.length;d++){const g=f[p],_=f[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++p,f[p]=_)}f.length=p+1;for(let d=0,g=f.length;d<g;d++){const _=f[d];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class Fa extends Ye{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,f=t/o,p=e/c,d=[],g=[],_=[],m=[];for(let u=0;u<h;u++){const x=u*p-r;for(let S=0;S<l;S++){const v=S*f-a;g.push(v,-x,0),_.push(0,0,1),m.push(S/o),m.push(1-u/c)}}for(let u=0;u<c;u++)for(let x=0;x<o;x++){const S=x+l*u,v=x+l*(u+1),D=x+1+l*(u+1),A=x+1+l*u;d.push(S,v,A),d.push(v,D,A)}this.setIndex(d),this.setAttribute("position",new be(g,3)),this.setAttribute("normal",new be(_,3)),this.setAttribute("uv",new be(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fa(t.width,t.height,t.widthSegments,t.heightSegments)}}var Up=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Fp=`#ifdef USE_ALPHAHASH
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
#endif`,Np=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Op=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hp=`#ifdef USE_AOMAP
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
#endif`,Gp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vp=`#ifdef USE_BATCHING
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
#endif`,Xp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Wp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$p=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Zp=`#ifdef USE_IRIDESCENCE
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
#endif`,qp=`#ifdef USE_BUMPMAP
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
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Kp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,em=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,nm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,im=`#if defined( USE_COLOR_ALPHA )
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
#endif`,sm=`#define PI 3.141592653589793
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
} // validated`,am=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,rm=`vec3 transformedNormal = objectNormal;
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
#endif`,om=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hm="gl_FragColor = linearToOutputTexel( gl_FragColor );",um=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,fm=`#ifdef USE_ENVMAP
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
#endif`,pm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mm=`#ifdef USE_ENVMAP
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
#endif`,gm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_m=`#ifdef USE_ENVMAP
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
#endif`,xm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ym=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sm=`#ifdef USE_GRADIENTMAP
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
}`,bm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Em=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Am=`uniform bool receiveShadow;
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
#endif`,Tm=`#ifdef USE_ENVMAP
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
#endif`,Rm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lm=`PhysicalMaterial material;
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
#endif`,Im=`struct PhysicalMaterial {
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
}`,km=`
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
#endif`,Um=`#if defined( RE_IndirectDiffuse )
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
#endif`,Fm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Nm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Om=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Xm=`#if defined( USE_POINTS_UV )
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
#endif`,Wm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$m=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ym=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Zm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jm=`#ifdef USE_MORPHTARGETS
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
#endif`,Km=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,tg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,eg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ng=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ig=`#ifdef USE_NORMALMAP
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
#endif`,sg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ag=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,og=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,cg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,lg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,dg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ug=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,fg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,pg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,mg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,gg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_g=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,vg=`float getShadowMask() {
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
}`,Mg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,yg=`#ifdef USE_SKINNING
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
#endif`,Sg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bg=`#ifdef USE_SKINNING
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
#endif`,Eg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ag=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Rg=`#ifdef USE_TRANSMISSION
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
#endif`,Cg=`#ifdef USE_TRANSMISSION
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
#endif`,Pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ig=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const kg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ug=`uniform sampler2D t2D;
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
}`,Fg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ng=`#ifdef ENVMAP_TYPE_CUBE
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
}`,zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Og=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bg=`#include <common>
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
}`,Hg=`#if DEPTH_PACKING == 3200
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
}`,Gg=`#define DISTANCE
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
}`,Vg=`#define DISTANCE
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
}`,Xg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Wg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$g=`uniform float scale;
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
}`,Yg=`uniform vec3 diffuse;
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
}`,Zg=`#include <common>
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
}`,qg=`uniform vec3 diffuse;
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
}`,jg=`#define LAMBERT
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
}`,Kg=`#define LAMBERT
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
}`,Jg=`#define MATCAP
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
}`,Qg=`#define MATCAP
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
}`,t0=`#define NORMAL
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
}`,e0=`#define NORMAL
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
}`,n0=`#define PHONG
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
}`,i0=`#define PHONG
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
}`,s0=`#define STANDARD
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
}`,a0=`#define STANDARD
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
}`,r0=`#define TOON
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
}`,o0=`#define TOON
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
}`,c0=`uniform float size;
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
}`,l0=`uniform vec3 diffuse;
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
}`,d0=`#include <common>
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
}`,h0=`uniform vec3 color;
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
}`,u0=`uniform float rotation;
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
}`,f0=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:Up,alphahash_pars_fragment:Fp,alphamap_fragment:Np,alphamap_pars_fragment:zp,alphatest_fragment:Op,alphatest_pars_fragment:Bp,aomap_fragment:Hp,aomap_pars_fragment:Gp,batching_pars_vertex:Vp,batching_vertex:Xp,begin_vertex:Wp,beginnormal_vertex:$p,bsdfs:Yp,iridescence_fragment:Zp,bumpmap_pars_fragment:qp,clipping_planes_fragment:jp,clipping_planes_pars_fragment:Kp,clipping_planes_pars_vertex:Jp,clipping_planes_vertex:Qp,color_fragment:tm,color_pars_fragment:em,color_pars_vertex:nm,color_vertex:im,common:sm,cube_uv_reflection_fragment:am,defaultnormal_vertex:rm,displacementmap_pars_vertex:om,displacementmap_vertex:cm,emissivemap_fragment:lm,emissivemap_pars_fragment:dm,colorspace_fragment:hm,colorspace_pars_fragment:um,envmap_fragment:fm,envmap_common_pars_fragment:pm,envmap_pars_fragment:mm,envmap_pars_vertex:gm,envmap_physical_pars_fragment:Tm,envmap_vertex:_m,fog_vertex:xm,fog_pars_vertex:vm,fog_fragment:Mm,fog_pars_fragment:ym,gradientmap_pars_fragment:Sm,lightmap_pars_fragment:bm,lights_lambert_fragment:Em,lights_lambert_pars_fragment:wm,lights_pars_begin:Am,lights_toon_fragment:Rm,lights_toon_pars_fragment:Cm,lights_phong_fragment:Pm,lights_phong_pars_fragment:Dm,lights_physical_fragment:Lm,lights_physical_pars_fragment:Im,lights_fragment_begin:km,lights_fragment_maps:Um,lights_fragment_end:Fm,logdepthbuf_fragment:Nm,logdepthbuf_pars_fragment:zm,logdepthbuf_pars_vertex:Om,logdepthbuf_vertex:Bm,map_fragment:Hm,map_pars_fragment:Gm,map_particle_fragment:Vm,map_particle_pars_fragment:Xm,metalnessmap_fragment:Wm,metalnessmap_pars_fragment:$m,morphinstance_vertex:Ym,morphcolor_vertex:Zm,morphnormal_vertex:qm,morphtarget_pars_vertex:jm,morphtarget_vertex:Km,normal_fragment_begin:Jm,normal_fragment_maps:Qm,normal_pars_fragment:tg,normal_pars_vertex:eg,normal_vertex:ng,normalmap_pars_fragment:ig,clearcoat_normal_fragment_begin:sg,clearcoat_normal_fragment_maps:ag,clearcoat_pars_fragment:rg,iridescence_pars_fragment:og,opaque_fragment:cg,packing:lg,premultiplied_alpha_fragment:dg,project_vertex:hg,dithering_fragment:ug,dithering_pars_fragment:fg,roughnessmap_fragment:pg,roughnessmap_pars_fragment:mg,shadowmap_pars_fragment:gg,shadowmap_pars_vertex:_g,shadowmap_vertex:xg,shadowmask_pars_fragment:vg,skinbase_vertex:Mg,skinning_pars_vertex:yg,skinning_vertex:Sg,skinnormal_vertex:bg,specularmap_fragment:Eg,specularmap_pars_fragment:wg,tonemapping_fragment:Ag,tonemapping_pars_fragment:Tg,transmission_fragment:Rg,transmission_pars_fragment:Cg,uv_pars_fragment:Pg,uv_pars_vertex:Dg,uv_vertex:Lg,worldpos_vertex:Ig,background_vert:kg,background_frag:Ug,backgroundCube_vert:Fg,backgroundCube_frag:Ng,cube_vert:zg,cube_frag:Og,depth_vert:Bg,depth_frag:Hg,distanceRGBA_vert:Gg,distanceRGBA_frag:Vg,equirect_vert:Xg,equirect_frag:Wg,linedashed_vert:$g,linedashed_frag:Yg,meshbasic_vert:Zg,meshbasic_frag:qg,meshlambert_vert:jg,meshlambert_frag:Kg,meshmatcap_vert:Jg,meshmatcap_frag:Qg,meshnormal_vert:t0,meshnormal_frag:e0,meshphong_vert:n0,meshphong_frag:i0,meshphysical_vert:s0,meshphysical_frag:a0,meshtoon_vert:r0,meshtoon_frag:o0,points_vert:c0,points_frag:l0,shadow_vert:d0,shadow_frag:h0,sprite_vert:u0,sprite_frag:f0},wt={common:{diffuse:{value:new jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},envMapRotation:{value:new Jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new Kt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new jt(16777215)},opacity:{value:1},center:{value:new Kt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},bn={basic:{uniforms:Be([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:Be([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new jt(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:Be([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new jt(0)},specular:{value:new jt(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:Be([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:Be([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new jt(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:Be([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:Be([wt.points,wt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:Be([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:Be([wt.common,wt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:Be([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:Be([wt.sprite,wt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Jt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:Be([wt.common,wt.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:Be([wt.lights,wt.fog,{color:{value:new jt(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};bn.physical={uniforms:Be([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new Kt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new Kt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new jt(0)},specularColor:{value:new jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new Kt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const js={r:0,b:0,g:0},di=new Rn,p0=new me;function m0(i,t,e,n,s,a,r){const o=new jt(0);let c=a===!0?0:1,l,h,f=null,p=0,d=null;function g(x){let S=x.isScene===!0?x.background:null;return S&&S.isTexture&&(S=(x.backgroundBlurriness>0?e:t).get(S)),S}function _(x){let S=!1;const v=g(x);v===null?u(o,c):v&&v.isColor&&(u(v,1),S=!0);const D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,r):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,S){const v=g(S);v&&(v.isCubeTexture||v.mapping===Ia)?(h===void 0&&(h=new pe(new Cn(1,1,1),new ei({name:"BackgroundCubeMaterial",uniforms:is(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),di.copy(S.backgroundRotation),di.x*=-1,di.y*=-1,di.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(p0.makeRotationFromEuler(di)),h.material.toneMapped=ie.getTransfer(v.colorSpace)!==oe,(f!==v||p!==v.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=v,p=v.version,d=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new pe(new Fa(2,2),new ei({name:"BackgroundMaterial",uniforms:is(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=ie.getTransfer(v.colorSpace)!==oe,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||p!==v.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,f=v,p=v.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function u(x,S){x.getRGB(js,wd(i)),n.buffers.color.setClear(js.r,js.g,js.b,S,r)}return{getClearColor:function(){return o},setClearColor:function(x,S=1){o.set(x),c=S,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,u(o,c)},render:_,addToRenderList:m}}function g0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let a=s,r=!1;function o(y,P,B,U,W){let R=!1;const T=f(U,B,P);a!==T&&(a=T,l(a.object)),R=d(y,U,B,W),R&&g(y,U,B,W),W!==null&&t.update(W,i.ELEMENT_ARRAY_BUFFER),(R||r)&&(r=!1,v(y,P,B,U),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function f(y,P,B){const U=B.wireframe===!0;let W=n[y.id];W===void 0&&(W={},n[y.id]=W);let R=W[P.id];R===void 0&&(R={},W[P.id]=R);let T=R[U];return T===void 0&&(T=p(c()),R[U]=T),T}function p(y){const P=[],B=[],U=[];for(let W=0;W<e;W++)P[W]=0,B[W]=0,U[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:B,attributeDivisors:U,object:y,attributes:{},index:null}}function d(y,P,B,U){const W=a.attributes,R=P.attributes;let T=0;const O=B.getAttributes();for(const F in O)if(O[F].location>=0){const at=W[F];let ut=R[F];if(ut===void 0&&(F==="instanceMatrix"&&y.instanceMatrix&&(ut=y.instanceMatrix),F==="instanceColor"&&y.instanceColor&&(ut=y.instanceColor)),at===void 0||at.attribute!==ut||ut&&at.data!==ut.data)return!0;T++}return a.attributesNum!==T||a.index!==U}function g(y,P,B,U){const W={},R=P.attributes;let T=0;const O=B.getAttributes();for(const F in O)if(O[F].location>=0){let at=R[F];at===void 0&&(F==="instanceMatrix"&&y.instanceMatrix&&(at=y.instanceMatrix),F==="instanceColor"&&y.instanceColor&&(at=y.instanceColor));const ut={};ut.attribute=at,at&&at.data&&(ut.data=at.data),W[F]=ut,T++}a.attributes=W,a.attributesNum=T,a.index=U}function _(){const y=a.newAttributes;for(let P=0,B=y.length;P<B;P++)y[P]=0}function m(y){u(y,0)}function u(y,P){const B=a.newAttributes,U=a.enabledAttributes,W=a.attributeDivisors;B[y]=1,U[y]===0&&(i.enableVertexAttribArray(y),U[y]=1),W[y]!==P&&(i.vertexAttribDivisor(y,P),W[y]=P)}function x(){const y=a.newAttributes,P=a.enabledAttributes;for(let B=0,U=P.length;B<U;B++)P[B]!==y[B]&&(i.disableVertexAttribArray(B),P[B]=0)}function S(y,P,B,U,W,R,T){T===!0?i.vertexAttribIPointer(y,P,B,W,R):i.vertexAttribPointer(y,P,B,U,W,R)}function v(y,P,B,U){_();const W=U.attributes,R=B.getAttributes(),T=P.defaultAttributeValues;for(const O in R){const F=R[O];if(F.location>=0){let $=W[O];if($===void 0&&(O==="instanceMatrix"&&y.instanceMatrix&&($=y.instanceMatrix),O==="instanceColor"&&y.instanceColor&&($=y.instanceColor)),$!==void 0){const at=$.normalized,ut=$.itemSize,ot=t.get($);if(ot===void 0)continue;const vt=ot.buffer,q=ot.type,J=ot.bytesPerElement,ct=q===i.INT||q===i.UNSIGNED_INT||$.gpuType===Zo;if($.isInterleavedBufferAttribute){const lt=$.data,gt=lt.stride,At=$.offset;if(lt.isInstancedInterleavedBuffer){for(let Dt=0;Dt<F.locationSize;Dt++)u(F.location+Dt,lt.meshPerAttribute);y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let Dt=0;Dt<F.locationSize;Dt++)m(F.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,vt);for(let Dt=0;Dt<F.locationSize;Dt++)S(F.location+Dt,ut/F.locationSize,q,at,gt*J,(At+ut/F.locationSize*Dt)*J,ct)}else{if($.isInstancedBufferAttribute){for(let lt=0;lt<F.locationSize;lt++)u(F.location+lt,$.meshPerAttribute);y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let lt=0;lt<F.locationSize;lt++)m(F.location+lt);i.bindBuffer(i.ARRAY_BUFFER,vt);for(let lt=0;lt<F.locationSize;lt++)S(F.location+lt,ut/F.locationSize,q,at,ut*J,ut/F.locationSize*lt*J,ct)}}else if(T!==void 0){const at=T[O];if(at!==void 0)switch(at.length){case 2:i.vertexAttrib2fv(F.location,at);break;case 3:i.vertexAttrib3fv(F.location,at);break;case 4:i.vertexAttrib4fv(F.location,at);break;default:i.vertexAttrib1fv(F.location,at)}}}}x()}function D(){L();for(const y in n){const P=n[y];for(const B in P){const U=P[B];for(const W in U)h(U[W].object),delete U[W];delete P[B]}delete n[y]}}function A(y){if(n[y.id]===void 0)return;const P=n[y.id];for(const B in P){const U=P[B];for(const W in U)h(U[W].object),delete U[W];delete P[B]}delete n[y.id]}function C(y){for(const P in n){const B=n[P];if(B[y.id]===void 0)continue;const U=B[y.id];for(const W in U)h(U[W].object),delete U[W];delete B[y.id]}}function L(){b(),r=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:b,dispose:D,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function _0(i,t,e){let n;function s(l){n=l}function a(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,f){f!==0&&(i.drawArraysInstanced(n,l,h,f),e.update(h,n,f))}function o(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,f);let d=0;for(let g=0;g<f;g++)d+=h[g];e.update(d,n,1)}function c(l,h,f,p){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)r(l[g],h[g],p[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,p,0,f);let g=0;for(let _=0;_<f;_++)g+=h[_]*p[_];e.update(g,n,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function x0(i,t,e,n){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==gn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const L=C===As&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==Hn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==zn&&!L)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=e.logarithmicDepthBuffer===!0,p=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:D,maxSamples:A}}function v0(i){const t=this;let e=null,n=0,s=!1,a=!1;const r=new fi,o=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const d=f.length!==0||p||n!==0||s;return s=p,n=f.length,d},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,p){e=h(f,p,0)},this.setState=function(f,p,d){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,u=i.get(f);if(!s||g===null||g.length===0||a&&!m)a?h(null):l();else{const x=a?0:n,S=x*4;let v=u.clippingState||null;c.value=v,v=h(g,p,S,d);for(let D=0;D!==S;++D)v[D]=e[D];u.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,p,d,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const u=d+_*4,x=p.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<u)&&(m=new Float32Array(u));for(let S=0,v=d;S!==_;++S,v+=4)r.copy(f[S]).applyMatrix4(x,o),r.normal.toArray(m,v),m[v+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function M0(i){let t=new WeakMap;function e(r,o){return o===no?r.mapping=Qi:o===io&&(r.mapping=ts),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===no||o===io)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new Dp(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class Cd extends Ad{constructor(t=-1,e=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Yi=4,ll=[.125,.215,.35,.446,.526,.582],_i=20,vr=new Cd,dl=new jt;let Mr=null,yr=0,Sr=0,br=!1;const pi=(1+Math.sqrt(5))/2,Gi=1/pi,hl=[new X(-pi,Gi,0),new X(pi,Gi,0),new X(-Gi,0,pi),new X(Gi,0,pi),new X(0,pi,-Gi),new X(0,pi,Gi),new X(-1,1,-1),new X(1,1,-1),new X(-1,1,1),new X(1,1,1)];class ul{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Mr=this._renderer.getRenderTarget(),yr=this._renderer.getActiveCubeFace(),Sr=this._renderer.getActiveMipmapLevel(),br=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ml(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Mr,yr,Sr),this._renderer.xr.enabled=br,t.scissorTest=!1,Ks(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Qi||t.mapping===ts?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Mr=this._renderer.getRenderTarget(),yr=this._renderer.getActiveCubeFace(),Sr=this._renderer.getActiveMipmapLevel(),br=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:wn,minFilter:wn,generateMipmaps:!1,type:As,format:gn,colorSpace:ss,depthBuffer:!1},s=fl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fl(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=y0(a)),this._blurMaterial=S0(a,t,e)}return s}_compileMaterial(t){const e=new pe(this._lodPlanes[0],t);this._renderer.compile(e,vr)}_sceneToCubeUV(t,e,n,s){const o=new nn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor(dl),h.toneMapping=Jn,h.autoClear=!1;const d=new Sn({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),g=new pe(new Cn,d);let _=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,_=!0):(d.color.copy(dl),_=!0);for(let u=0;u<6;u++){const x=u%3;x===0?(o.up.set(0,c[u],0),o.lookAt(l[u],0,0)):x===1?(o.up.set(0,0,c[u]),o.lookAt(0,l[u],0)):(o.up.set(0,c[u],0),o.lookAt(0,0,l[u]));const S=this._cubeSize;Ks(s,x*S,u>2?S:0,S,S),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=p,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Qi||t.mapping===ts;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ml()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pl());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new pe(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;Ks(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,vr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=hl[(s-a-1)%hl.length];this._blur(t,a-1,a,r,o)}e.autoClear=n}_blur(t,e,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",a),this._halfBlur(r,t,n,n,s,"longitudinal",a)}_halfBlur(t,e,n,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new pe(this._lodPlanes[s],l),p=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*d):2*Math.PI/(2*_i-1),_=a/g,m=isFinite(a)?1+Math.floor(h*_):_i;m>_i&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_i}`);const u=[];let x=0;for(let C=0;C<_i;++C){const L=C/_,b=Math.exp(-L*L/2);u.push(b),C===0?x+=b:C<m&&(x+=2*b)}for(let C=0;C<u.length;C++)u[C]=u[C]/x;p.envMap.value=t.texture,p.samples.value=m,p.weights.value=u,p.latitudinal.value=r==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:S}=this;p.dTheta.value=g,p.mipInt.value=S-n;const v=this._sizeLods[s],D=3*v*(s>S-Yi?s-S+Yi:0),A=4*(this._cubeSize-v);Ks(e,D,A,3*v,2*v),c.setRenderTarget(e),c.render(f,vr)}}function y0(i){const t=[],e=[],n=[];let s=i;const a=i-Yi+1+ll.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>i-Yi?c=ll[r-i+Yi-1]:r===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,f=1+l,p=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,g=6,_=3,m=2,u=1,x=new Float32Array(_*g*d),S=new Float32Array(m*g*d),v=new Float32Array(u*g*d);for(let A=0;A<d;A++){const C=A%3*2/3-1,L=A>2?0:-1,b=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];x.set(b,_*g*A),S.set(p,m*g*A);const y=[A,A,A,A,A,A];v.set(y,u*g*A)}const D=new Ye;D.setAttribute("position",new xn(x,_)),D.setAttribute("uv",new xn(S,m)),D.setAttribute("faceIndex",new xn(v,u)),t.push(D),s>Yi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function fl(i,t,e){const n=new bi(i,t,e);return n.texture.mapping=Ia,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ks(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function S0(i,t,e){const n=new Float32Array(_i),s=new X(0,1,0);return new ei({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ic(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function pl(){return new ei({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ic(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function ml(){return new ei({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function ic(){return`

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
	`}function b0(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===no||c===io,h=c===Qi||c===ts;if(l||h){let f=t.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return e===null&&(e=new ul(i)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new ul(i)),f=l?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function E0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&xs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function w0(i,t,e,n){const s={},a=new WeakMap;function r(f){const p=f.target;p.index!==null&&t.remove(p.index);for(const g in p.attributes)t.remove(p.attributes[g]);for(const g in p.morphAttributes){const _=p.morphAttributes[g];for(let m=0,u=_.length;m<u;m++)t.remove(_[m])}p.removeEventListener("dispose",r),delete s[p.id];const d=a.get(p);d&&(t.remove(d),a.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",r),s[p.id]=!0,e.memory.geometries++),p}function c(f){const p=f.attributes;for(const g in p)t.update(p[g],i.ARRAY_BUFFER);const d=f.morphAttributes;for(const g in d){const _=d[g];for(let m=0,u=_.length;m<u;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(f){const p=[],d=f.index,g=f.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let S=0,v=x.length;S<v;S+=3){const D=x[S+0],A=x[S+1],C=x[S+2];p.push(D,A,A,C,C,D)}}else if(g!==void 0){const x=g.array;_=g.version;for(let S=0,v=x.length/3-1;S<v;S+=3){const D=S+0,A=S+1,C=S+2;p.push(D,A,A,C,C,D)}}else return;const m=new(vd(p)?Ed:bd)(p,1);m.version=_;const u=a.get(f);u&&t.remove(u),a.set(f,m)}function h(f){const p=a.get(f);if(p){const d=f.index;d!==null&&p.version<d.version&&l(f)}else l(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function A0(i,t,e){let n;function s(p){n=p}let a,r;function o(p){a=p.type,r=p.bytesPerElement}function c(p,d){i.drawElements(n,d,a,p*r),e.update(d,n,1)}function l(p,d,g){g!==0&&(i.drawElementsInstanced(n,d,a,p*r,g),e.update(d,n,g))}function h(p,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,a,p,0,g);let m=0;for(let u=0;u<g;u++)m+=d[u];e.update(m,n,1)}function f(p,d,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<p.length;u++)l(p[u]/r,d[u],_[u]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,a,p,0,_,0,g);let u=0;for(let x=0;x<g;x++)u+=d[x]*_[x];e.update(u,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function T0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function R0(i,t,e){const n=new WeakMap,s=new Me;function a(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let p=n.get(o);if(p===void 0||p.count!==f){let y=function(){L.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var d=y;p!==void 0&&p.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let D=o.attributes.position.count*v,A=1;D>t.maxTextureSize&&(A=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const C=new Float32Array(D*A*4*f),L=new yd(C,D,A,f);L.type=zn,L.needsUpdate=!0;const b=v*4;for(let P=0;P<f;P++){const B=u[P],U=x[P],W=S[P],R=D*A*4*P;for(let T=0;T<B.count;T++){const O=T*b;g===!0&&(s.fromBufferAttribute(B,T),C[R+O+0]=s.x,C[R+O+1]=s.y,C[R+O+2]=s.z,C[R+O+3]=0),_===!0&&(s.fromBufferAttribute(U,T),C[R+O+4]=s.x,C[R+O+5]=s.y,C[R+O+6]=s.z,C[R+O+7]=0),m===!0&&(s.fromBufferAttribute(W,T),C[R+O+8]=s.x,C[R+O+9]=s.y,C[R+O+10]=s.z,C[R+O+11]=W.itemSize===4?s.w:1)}}p={count:f,texture:L,size:new Kt(D,A)},n.set(o,p),o.addEventListener("dispose",y)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:a}}function C0(i,t,e,n){let s=new WeakMap;function a(c){const l=n.render.frame,h=c.geometry,f=t.get(c,h);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==l&&(p.update(),s.set(p,l))}return f}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class Pd extends Ve{constructor(t,e,n,s,a,r,o,c,l,h=ji){if(h!==ji&&h!==ns)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ji&&(n=Si),n===void 0&&h===ns&&(n=es),super(null,s,a,r,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:_n,this.minFilter=c!==void 0?c:_n,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Dd=new Ve,gl=new Pd(1,1),Ld=new yd,Id=new mp,kd=new Td,_l=[],xl=[],vl=new Float32Array(16),Ml=new Float32Array(9),yl=new Float32Array(4);function rs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let a=_l[s];if(a===void 0&&(a=new Float32Array(s),_l[s]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,i[r].toArray(a,o)}return a}function Re(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ce(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Na(i,t){let e=xl[t];e===void 0&&(e=new Int32Array(t),xl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function P0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function D0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2fv(this.addr,t),Ce(e,t)}}function L0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;i.uniform3fv(this.addr,t),Ce(e,t)}}function I0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4fv(this.addr,t),Ce(e,t)}}function k0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;yl.set(n),i.uniformMatrix2fv(this.addr,!1,yl),Ce(e,n)}}function U0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;Ml.set(n),i.uniformMatrix3fv(this.addr,!1,Ml),Ce(e,n)}}function F0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;vl.set(n),i.uniformMatrix4fv(this.addr,!1,vl),Ce(e,n)}}function N0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function z0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2iv(this.addr,t),Ce(e,t)}}function O0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3iv(this.addr,t),Ce(e,t)}}function B0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4iv(this.addr,t),Ce(e,t)}}function H0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function G0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2uiv(this.addr,t),Ce(e,t)}}function V0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3uiv(this.addr,t),Ce(e,t)}}function X0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4uiv(this.addr,t),Ce(e,t)}}function W0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(gl.compareFunction=xd,a=gl):a=Dd,e.setTexture2D(t||a,s)}function $0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Id,s)}function Y0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||kd,s)}function Z0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ld,s)}function q0(i){switch(i){case 5126:return P0;case 35664:return D0;case 35665:return L0;case 35666:return I0;case 35674:return k0;case 35675:return U0;case 35676:return F0;case 5124:case 35670:return N0;case 35667:case 35671:return z0;case 35668:case 35672:return O0;case 35669:case 35673:return B0;case 5125:return H0;case 36294:return G0;case 36295:return V0;case 36296:return X0;case 35678:case 36198:case 36298:case 36306:case 35682:return W0;case 35679:case 36299:case 36307:return $0;case 35680:case 36300:case 36308:case 36293:return Y0;case 36289:case 36303:case 36311:case 36292:return Z0}}function j0(i,t){i.uniform1fv(this.addr,t)}function K0(i,t){const e=rs(t,this.size,2);i.uniform2fv(this.addr,e)}function J0(i,t){const e=rs(t,this.size,3);i.uniform3fv(this.addr,e)}function Q0(i,t){const e=rs(t,this.size,4);i.uniform4fv(this.addr,e)}function t_(i,t){const e=rs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function e_(i,t){const e=rs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function n_(i,t){const e=rs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function i_(i,t){i.uniform1iv(this.addr,t)}function s_(i,t){i.uniform2iv(this.addr,t)}function a_(i,t){i.uniform3iv(this.addr,t)}function r_(i,t){i.uniform4iv(this.addr,t)}function o_(i,t){i.uniform1uiv(this.addr,t)}function c_(i,t){i.uniform2uiv(this.addr,t)}function l_(i,t){i.uniform3uiv(this.addr,t)}function d_(i,t){i.uniform4uiv(this.addr,t)}function h_(i,t,e){const n=this.cache,s=t.length,a=Na(e,s);Re(n,a)||(i.uniform1iv(this.addr,a),Ce(n,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||Dd,a[r])}function u_(i,t,e){const n=this.cache,s=t.length,a=Na(e,s);Re(n,a)||(i.uniform1iv(this.addr,a),Ce(n,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||Id,a[r])}function f_(i,t,e){const n=this.cache,s=t.length,a=Na(e,s);Re(n,a)||(i.uniform1iv(this.addr,a),Ce(n,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||kd,a[r])}function p_(i,t,e){const n=this.cache,s=t.length,a=Na(e,s);Re(n,a)||(i.uniform1iv(this.addr,a),Ce(n,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||Ld,a[r])}function m_(i){switch(i){case 5126:return j0;case 35664:return K0;case 35665:return J0;case 35666:return Q0;case 35674:return t_;case 35675:return e_;case 35676:return n_;case 5124:case 35670:return i_;case 35667:case 35671:return s_;case 35668:case 35672:return a_;case 35669:case 35673:return r_;case 5125:return o_;case 36294:return c_;case 36295:return l_;case 36296:return d_;case 35678:case 36198:case 36298:case 36306:case 35682:return h_;case 35679:case 36299:case 36307:return u_;case 35680:case 36300:case 36308:case 36293:return f_;case 36289:case 36303:case 36311:case 36292:return p_}}class g_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=q0(e.type)}}class __{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=m_(e.type)}}class x_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],n)}}}const Er=/(\w+)(\])?(\[|\.)?/g;function Sl(i,t){i.seq.push(t),i.map[t.id]=t}function v_(i,t,e){const n=i.name,s=n.length;for(Er.lastIndex=0;;){const a=Er.exec(n),r=Er.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Sl(e,l===void 0?new g_(o,i,t):new __(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new x_(o),Sl(e,f)),e=f}}}class ma{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);v_(a,r,this)}}setValue(t,e,n,s){const a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function bl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const M_=37297;let y_=0;function S_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}const El=new Jt;function b_(i){ie._getMatrix(El,ie.workingColorSpace,i);const t=`mat3( ${El.elements.map(e=>e.toFixed(4))} )`;switch(ie.getTransfer(i)){case ka:return[t,"LinearTransferOETF"];case oe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function wl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+S_(i.getShaderSource(t),r)}else return s}function E_(i,t){const e=b_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function w_(i,t){let e;switch(t){case Gf:e="Linear";break;case Vf:e="Reinhard";break;case Xf:e="Cineon";break;case Wf:e="ACESFilmic";break;case Yf:e="AgX";break;case Zf:e="Neutral";break;case $f:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Js=new X;function A_(){ie.getLuminanceCoefficients(Js);const i=Js.x.toFixed(4),t=Js.y.toFixed(4),e=Js.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function T_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vs).join(`
`)}function R_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function C_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(t,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:i.getAttribLocation(t,r),locationSize:o}}return e}function vs(i){return i!==""}function Al(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Tl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const P_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uo(i){return i.replace(P_,L_)}const D_=new Map;function L_(i,t){let e=Qt[t];if(e===void 0){const n=D_.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Uo(e)}const I_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rl(i){return i.replace(I_,k_)}function k_(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Cl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function U_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===sd?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===ad?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Fn&&(t="SHADOWMAP_TYPE_VSM"),t}function F_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Qi:case ts:t="ENVMAP_TYPE_CUBE";break;case Ia:t="ENVMAP_TYPE_CUBE_UV";break}return t}function N_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ts:t="ENVMAP_MODE_REFRACTION";break}return t}function z_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Yo:t="ENVMAP_BLENDING_MULTIPLY";break;case Bf:t="ENVMAP_BLENDING_MIX";break;case Hf:t="ENVMAP_BLENDING_ADD";break}return t}function O_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function B_(i,t,e,n){const s=i.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=U_(e),l=F_(e),h=N_(e),f=z_(e),p=O_(e),d=T_(e),g=R_(a),_=s.createProgram();let m,u,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(vs).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(vs).join(`
`),u.length>0&&(u+=`
`)):(m=[Cl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),u=[Cl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Jn?"#define TONE_MAPPING":"",e.toneMapping!==Jn?Qt.tonemapping_pars_fragment:"",e.toneMapping!==Jn?w_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,E_("linearToOutputTexel",e.outputColorSpace),A_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vs).join(`
`)),r=Uo(r),r=Al(r,e),r=Tl(r,e),o=Uo(o),o=Al(o,e),o=Tl(o,e),r=Rl(r),o=Rl(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",e.glslVersion===Gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const S=x+m+r,v=x+u+o,D=bl(s,s.VERTEX_SHADER,S),A=bl(s,s.FRAGMENT_SHADER,v);s.attachShader(_,D),s.attachShader(_,A),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(P){if(i.debug.checkShaderErrors){const B=s.getProgramInfoLog(_).trim(),U=s.getShaderInfoLog(D).trim(),W=s.getShaderInfoLog(A).trim();let R=!0,T=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(R=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,D,A);else{const O=wl(s,D,"vertex"),F=wl(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+O+`
`+F)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(U===""||W==="")&&(T=!1);T&&(P.diagnostics={runnable:R,programLog:B,vertexShader:{log:U,prefix:m},fragmentShader:{log:W,prefix:u}})}s.deleteShader(D),s.deleteShader(A),L=new ma(s,_),b=C_(s,_)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,M_)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=y_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=A,this}let H_=0;class G_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new V_(t),e.set(t,n)),n}}class V_{constructor(t){this.id=H_++,this.code=t,this.usedTimes=0}}function X_(i,t,e,n,s,a,r){const o=new ec,c=new G_,l=new Set,h=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,P,B,U){const W=B.fog,R=U.geometry,T=b.isMeshStandardMaterial?B.environment:null,O=(b.isMeshStandardMaterial?e:t).get(b.envMap||T),F=O&&O.mapping===Ia?O.image.height:null,$=g[b.type];b.precision!==null&&(d=s.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const at=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,ut=at!==void 0?at.length:0;let ot=0;R.morphAttributes.position!==void 0&&(ot=1),R.morphAttributes.normal!==void 0&&(ot=2),R.morphAttributes.color!==void 0&&(ot=3);let vt,q,J,ct;if($){const Wt=bn[$];vt=Wt.vertexShader,q=Wt.fragmentShader}else vt=b.vertexShader,q=b.fragmentShader,c.update(b),J=c.getVertexShaderID(b),ct=c.getFragmentShaderID(b);const lt=i.getRenderTarget(),gt=i.state.buffers.depth.getReversed(),At=U.isInstancedMesh===!0,Dt=U.isBatchedMesh===!0,Xt=!!b.map,Rt=!!b.matcap,Tt=!!O,k=!!b.aoMap,ae=!!b.lightMap,Pt=!!b.bumpMap,Lt=!!b.normalMap,Y=!!b.displacementMap,ht=!!b.emissiveMap,ft=!!b.metalnessMap,w=!!b.roughnessMap,M=b.anisotropy>0,z=b.clearcoat>0,tt=b.dispersion>0,G=b.iridescence>0,K=b.sheen>0,it=b.transmission>0,nt=M&&!!b.anisotropyMap,_t=z&&!!b.clearcoatMap,It=z&&!!b.clearcoatNormalMap,pt=z&&!!b.clearcoatRoughnessMap,Et=G&&!!b.iridescenceMap,N=G&&!!b.iridescenceThicknessMap,rt=K&&!!b.sheenColorMap,dt=K&&!!b.sheenRoughnessMap,Ut=!!b.specularMap,kt=!!b.specularColorMap,Gt=!!b.specularIntensityMap,I=it&&!!b.transmissionMap,xt=it&&!!b.thicknessMap,Z=!!b.gradientMap,st=!!b.alphaMap,bt=b.alphaTest>0,St=!!b.alphaHash,Bt=!!b.extensions;let ee=Jn;b.toneMapped&&(lt===null||lt.isXRRenderTarget===!0)&&(ee=i.toneMapping);const Vt={shaderID:$,shaderType:b.type,shaderName:b.name,vertexShader:vt,fragmentShader:q,defines:b.defines,customVertexShaderID:J,customFragmentShaderID:ct,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:Dt,batchingColor:Dt&&U._colorsTexture!==null,instancing:At,instancingColor:At&&U.instanceColor!==null,instancingMorph:At&&U.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:lt===null?i.outputColorSpace:lt.isXRRenderTarget===!0?lt.texture.colorSpace:ss,alphaToCoverage:!!b.alphaToCoverage,map:Xt,matcap:Rt,envMap:Tt,envMapMode:Tt&&O.mapping,envMapCubeUVHeight:F,aoMap:k,lightMap:ae,bumpMap:Pt,normalMap:Lt,displacementMap:p&&Y,emissiveMap:ht,normalMapObjectSpace:Lt&&b.normalMapType===Jf,normalMapTangentSpace:Lt&&b.normalMapType===_d,metalnessMap:ft,roughnessMap:w,anisotropy:M,anisotropyMap:nt,clearcoat:z,clearcoatMap:_t,clearcoatNormalMap:It,clearcoatRoughnessMap:pt,dispersion:tt,iridescence:G,iridescenceMap:Et,iridescenceThicknessMap:N,sheen:K,sheenColorMap:rt,sheenRoughnessMap:dt,specularMap:Ut,specularColorMap:kt,specularIntensityMap:Gt,transmission:it,transmissionMap:I,thicknessMap:xt,gradientMap:Z,opaque:b.transparent===!1&&b.blending===qi&&b.alphaToCoverage===!1,alphaMap:st,alphaTest:bt,alphaHash:St,combine:b.combine,mapUv:Xt&&_(b.map.channel),aoMapUv:k&&_(b.aoMap.channel),lightMapUv:ae&&_(b.lightMap.channel),bumpMapUv:Pt&&_(b.bumpMap.channel),normalMapUv:Lt&&_(b.normalMap.channel),displacementMapUv:Y&&_(b.displacementMap.channel),emissiveMapUv:ht&&_(b.emissiveMap.channel),metalnessMapUv:ft&&_(b.metalnessMap.channel),roughnessMapUv:w&&_(b.roughnessMap.channel),anisotropyMapUv:nt&&_(b.anisotropyMap.channel),clearcoatMapUv:_t&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:It&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:N&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:rt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:dt&&_(b.sheenRoughnessMap.channel),specularMapUv:Ut&&_(b.specularMap.channel),specularColorMapUv:kt&&_(b.specularColorMap.channel),specularIntensityMapUv:Gt&&_(b.specularIntensityMap.channel),transmissionMapUv:I&&_(b.transmissionMap.channel),thicknessMapUv:xt&&_(b.thicknessMap.channel),alphaMapUv:st&&_(b.alphaMap.channel),vertexTangents:!!R.attributes.tangent&&(Lt||M),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!R.attributes.color&&R.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!R.attributes.uv&&(Xt||st),fog:!!W,useFog:b.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:gt,skinning:U.isSkinnedMesh===!0,morphTargets:R.morphAttributes.position!==void 0,morphNormals:R.morphAttributes.normal!==void 0,morphColors:R.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:ot,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:ee,decodeVideoTexture:Xt&&b.map.isVideoTexture===!0&&ie.getTransfer(b.map.colorSpace)===oe,decodeVideoTextureEmissive:ht&&b.emissiveMap.isVideoTexture===!0&&ie.getTransfer(b.emissiveMap.colorSpace)===oe,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===He,flipSided:b.side===$e,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Bt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Bt&&b.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Vt.vertexUv1s=l.has(1),Vt.vertexUv2s=l.has(2),Vt.vertexUv3s=l.has(3),l.clear(),Vt}function u(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)y.push(P),y.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(x(y,b),S(y,b),y.push(i.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function S(b,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),b.push(o.mask)}function v(b){const y=g[b.type];let P;if(y){const B=bn[y];P=Tp.clone(B.uniforms)}else P=b.uniforms;return P}function D(b,y){let P;for(let B=0,U=h.length;B<U;B++){const W=h[B];if(W.cacheKey===y){P=W,++P.usedTimes;break}}return P===void 0&&(P=new B_(i,y,b,a),h.push(P)),P}function A(b){if(--b.usedTimes===0){const y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function C(b){c.remove(b)}function L(){c.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:v,acquireProgram:D,releaseProgram:A,releaseShaderCache:C,programs:h,dispose:L}}function W_(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:a}}function $_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Pl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Dl(){const i=[];let t=0;const e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function r(f,p,d,g,_,m){let u=i[t];return u===void 0?(u={id:f.id,object:f,geometry:p,material:d,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},i[t]=u):(u.id=f.id,u.object=f,u.geometry=p,u.material=d,u.groupOrder=g,u.renderOrder=f.renderOrder,u.z=_,u.group=m),t++,u}function o(f,p,d,g,_,m){const u=r(f,p,d,g,_,m);d.transmission>0?n.push(u):d.transparent===!0?s.push(u):e.push(u)}function c(f,p,d,g,_,m){const u=r(f,p,d,g,_,m);d.transmission>0?n.unshift(u):d.transparent===!0?s.unshift(u):e.unshift(u)}function l(f,p){e.length>1&&e.sort(f||$_),n.length>1&&n.sort(p||Pl),s.length>1&&s.sort(p||Pl)}function h(){for(let f=t,p=i.length;f<p;f++){const d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:o,unshift:c,finish:h,sort:l}}function Y_(){let i=new WeakMap;function t(n,s){const a=i.get(n);let r;return a===void 0?(r=new Dl,i.set(n,[r])):s>=a.length?(r=new Dl,a.push(r)):r=a[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function Z_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new X,color:new jt};break;case"SpotLight":e={position:new X,direction:new X,color:new jt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new X,color:new jt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new X,skyColor:new jt,groundColor:new jt};break;case"RectAreaLight":e={color:new jt,position:new X,halfWidth:new X,halfHeight:new X};break}return i[t.id]=e,e}}}function q_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Kt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Kt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Kt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let j_=0;function K_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function J_(i){const t=new Z_,e=q_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new X);const s=new X,a=new me,r=new me;function o(l){let h=0,f=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,g=0,_=0,m=0,u=0,x=0,S=0,v=0,D=0,A=0,C=0;l.sort(K_);for(let b=0,y=l.length;b<y;b++){const P=l[b],B=P.color,U=P.intensity,W=P.distance,R=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=B.r*U,f+=B.g*U,p+=B.b*U;else if(P.isLightProbe){for(let T=0;T<9;T++)n.probe[T].addScaledVector(P.sh.coefficients[T],U);C++}else if(P.isDirectionalLight){const T=t.get(P);if(T.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const O=P.shadow,F=e.get(P);F.shadowIntensity=O.intensity,F.shadowBias=O.bias,F.shadowNormalBias=O.normalBias,F.shadowRadius=O.radius,F.shadowMapSize=O.mapSize,n.directionalShadow[d]=F,n.directionalShadowMap[d]=R,n.directionalShadowMatrix[d]=P.shadow.matrix,x++}n.directional[d]=T,d++}else if(P.isSpotLight){const T=t.get(P);T.position.setFromMatrixPosition(P.matrixWorld),T.color.copy(B).multiplyScalar(U),T.distance=W,T.coneCos=Math.cos(P.angle),T.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),T.decay=P.decay,n.spot[_]=T;const O=P.shadow;if(P.map&&(n.spotLightMap[D]=P.map,D++,O.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[_]=O.matrix,P.castShadow){const F=e.get(P);F.shadowIntensity=O.intensity,F.shadowBias=O.bias,F.shadowNormalBias=O.normalBias,F.shadowRadius=O.radius,F.shadowMapSize=O.mapSize,n.spotShadow[_]=F,n.spotShadowMap[_]=R,v++}_++}else if(P.isRectAreaLight){const T=t.get(P);T.color.copy(B).multiplyScalar(U),T.halfWidth.set(P.width*.5,0,0),T.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=T,m++}else if(P.isPointLight){const T=t.get(P);if(T.color.copy(P.color).multiplyScalar(P.intensity),T.distance=P.distance,T.decay=P.decay,P.castShadow){const O=P.shadow,F=e.get(P);F.shadowIntensity=O.intensity,F.shadowBias=O.bias,F.shadowNormalBias=O.normalBias,F.shadowRadius=O.radius,F.shadowMapSize=O.mapSize,F.shadowCameraNear=O.camera.near,F.shadowCameraFar=O.camera.far,n.pointShadow[g]=F,n.pointShadowMap[g]=R,n.pointShadowMatrix[g]=P.shadow.matrix,S++}n.point[g]=T,g++}else if(P.isHemisphereLight){const T=t.get(P);T.skyColor.copy(P.color).multiplyScalar(U),T.groundColor.copy(P.groundColor).multiplyScalar(U),n.hemi[u]=T,u++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=wt.LTC_FLOAT_1,n.rectAreaLTC2=wt.LTC_FLOAT_2):(n.rectAreaLTC1=wt.LTC_HALF_1,n.rectAreaLTC2=wt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=p;const L=n.hash;(L.directionalLength!==d||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==m||L.hemiLength!==u||L.numDirectionalShadows!==x||L.numPointShadows!==S||L.numSpotShadows!==v||L.numSpotMaps!==D||L.numLightProbes!==C)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=u,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=v+D-A,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,L.directionalLength=d,L.pointLength=g,L.spotLength=_,L.rectAreaLength=m,L.hemiLength=u,L.numDirectionalShadows=x,L.numPointShadows=S,L.numSpotShadows=v,L.numSpotMaps=D,L.numLightProbes=C,n.version=j_++)}function c(l,h){let f=0,p=0,d=0,g=0,_=0;const m=h.matrixWorldInverse;for(let u=0,x=l.length;u<x;u++){const S=l[u];if(S.isDirectionalLight){const v=n.directional[f];v.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(S.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(S.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),r.identity(),a.copy(S.matrixWorld),a.premultiply(m),r.extractRotation(a),v.halfWidth.set(S.width*.5,0,0),v.halfHeight.set(0,S.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),g++}else if(S.isPointLight){const v=n.point[p];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),p++}else if(S.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function Ll(i){const t=new J_(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function a(h){e.push(h)}function r(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function Q_(i){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new Ll(i),t.set(s,[o])):a>=r.length?(o=new Ll(i),r.push(o)):o=r[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class tx extends Ei{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=jf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ex extends Ei{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const nx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ix=`uniform sampler2D shadow_pass;
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
}`;function sx(i,t,e){let n=new nc;const s=new Kt,a=new Kt,r=new Me,o=new tx({depthPacking:Kf}),c=new ex,l={},h=e.maxTextureSize,f={[ti]:$e,[$e]:ti,[He]:He},p=new ei({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Kt},radius:{value:4}},vertexShader:nx,fragmentShader:ix}),d=p.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ye;g.setAttribute("position",new xn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new pe(g,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sd;let u=this.type;this.render=function(A,C,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const b=i.getRenderTarget(),y=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),B=i.state;B.setBlending(Kn),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const U=u!==Fn&&this.type===Fn,W=u===Fn&&this.type!==Fn;for(let R=0,T=A.length;R<T;R++){const O=A[R],F=O.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);const $=F.getFrameExtents();if(s.multiply($),a.copy(F.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/$.x),s.x=a.x*$.x,F.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/$.y),s.y=a.y*$.y,F.mapSize.y=a.y)),F.map===null||U===!0||W===!0){const ut=this.type!==Fn?{minFilter:_n,magFilter:_n}:{};F.map!==null&&F.map.dispose(),F.map=new bi(s.x,s.y,ut),F.map.texture.name=O.name+".shadowMap",F.camera.updateProjectionMatrix()}i.setRenderTarget(F.map),i.clear();const at=F.getViewportCount();for(let ut=0;ut<at;ut++){const ot=F.getViewport(ut);r.set(a.x*ot.x,a.y*ot.y,a.x*ot.z,a.y*ot.w),B.viewport(r),F.updateMatrices(O,ut),n=F.getFrustum(),v(C,L,F.camera,O,this.type)}F.isPointLightShadow!==!0&&this.type===Fn&&x(F,L),F.needsUpdate=!1}u=this.type,m.needsUpdate=!1,i.setRenderTarget(b,y,P)};function x(A,C){const L=t.update(_);p.defines.VSM_SAMPLES!==A.blurSamples&&(p.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new bi(s.x,s.y)),p.uniforms.shadow_pass.value=A.map.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,L,p,_,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,L,d,_,null)}function S(A,C,L,b){let y=null;const P=L.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)y=P;else if(y=L.isPointLight===!0?c:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const B=y.uuid,U=C.uuid;let W=l[B];W===void 0&&(W={},l[B]=W);let R=W[U];R===void 0&&(R=y.clone(),W[U]=R,C.addEventListener("dispose",D)),y=R}if(y.visible=C.visible,y.wireframe=C.wireframe,b===Fn?y.side=C.shadowSide!==null?C.shadowSide:C.side:y.side=C.shadowSide!==null?C.shadowSide:f[C.side],y.alphaMap=C.alphaMap,y.alphaTest=C.alphaTest,y.map=C.map,y.clipShadows=C.clipShadows,y.clippingPlanes=C.clippingPlanes,y.clipIntersection=C.clipIntersection,y.displacementMap=C.displacementMap,y.displacementScale=C.displacementScale,y.displacementBias=C.displacementBias,y.wireframeLinewidth=C.wireframeLinewidth,y.linewidth=C.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const B=i.properties.get(y);B.light=L}return y}function v(A,C,L,b,y){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===Fn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,A.matrixWorld);const U=t.update(A),W=A.material;if(Array.isArray(W)){const R=U.groups;for(let T=0,O=R.length;T<O;T++){const F=R[T],$=W[F.materialIndex];if($&&$.visible){const at=S(A,$,b,y);A.onBeforeShadow(i,A,C,L,U,at,F),i.renderBufferDirect(L,null,U,at,A,F),A.onAfterShadow(i,A,C,L,U,at,F)}}}else if(W.visible){const R=S(A,W,b,y);A.onBeforeShadow(i,A,C,L,U,R,null),i.renderBufferDirect(L,null,U,R,A,null),A.onAfterShadow(i,A,C,L,U,R,null)}}const B=A.children;for(let U=0,W=B.length;U<W;U++)v(B[U],C,L,b,y)}function D(A){A.target.removeEventListener("dispose",D);for(const L in l){const b=l[L],y=A.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const ax={[qr]:jr,[Kr]:to,[Jr]:eo,[Ji]:Qr,[jr]:qr,[to]:Kr,[eo]:Jr,[Qr]:Ji};function rx(i,t){function e(){let I=!1;const xt=new Me;let Z=null;const st=new Me(0,0,0,0);return{setMask:function(bt){Z!==bt&&!I&&(i.colorMask(bt,bt,bt,bt),Z=bt)},setLocked:function(bt){I=bt},setClear:function(bt,St,Bt,ee,Vt){Vt===!0&&(bt*=ee,St*=ee,Bt*=ee),xt.set(bt,St,Bt,ee),st.equals(xt)===!1&&(i.clearColor(bt,St,Bt,ee),st.copy(xt))},reset:function(){I=!1,Z=null,st.set(-1,0,0,0)}}}function n(){let I=!1,xt=!1,Z=null,st=null,bt=null;return{setReversed:function(St){if(xt!==St){const Bt=t.get("EXT_clip_control");xt?Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.ZERO_TO_ONE_EXT):Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.NEGATIVE_ONE_TO_ONE_EXT);const ee=bt;bt=null,this.setClear(ee)}xt=St},getReversed:function(){return xt},setTest:function(St){St?lt(i.DEPTH_TEST):gt(i.DEPTH_TEST)},setMask:function(St){Z!==St&&!I&&(i.depthMask(St),Z=St)},setFunc:function(St){if(xt&&(St=ax[St]),st!==St){switch(St){case qr:i.depthFunc(i.NEVER);break;case jr:i.depthFunc(i.ALWAYS);break;case Kr:i.depthFunc(i.LESS);break;case Ji:i.depthFunc(i.LEQUAL);break;case Jr:i.depthFunc(i.EQUAL);break;case Qr:i.depthFunc(i.GEQUAL);break;case to:i.depthFunc(i.GREATER);break;case eo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}st=St}},setLocked:function(St){I=St},setClear:function(St){bt!==St&&(xt&&(St=1-St),i.clearDepth(St),bt=St)},reset:function(){I=!1,Z=null,st=null,bt=null,xt=!1}}}function s(){let I=!1,xt=null,Z=null,st=null,bt=null,St=null,Bt=null,ee=null,Vt=null;return{setTest:function(Wt){I||(Wt?lt(i.STENCIL_TEST):gt(i.STENCIL_TEST))},setMask:function(Wt){xt!==Wt&&!I&&(i.stencilMask(Wt),xt=Wt)},setFunc:function(Wt,ge,ye){(Z!==Wt||st!==ge||bt!==ye)&&(i.stencilFunc(Wt,ge,ye),Z=Wt,st=ge,bt=ye)},setOp:function(Wt,ge,ye){(St!==Wt||Bt!==ge||ee!==ye)&&(i.stencilOp(Wt,ge,ye),St=Wt,Bt=ge,ee=ye)},setLocked:function(Wt){I=Wt},setClear:function(Wt){Vt!==Wt&&(i.clearStencil(Wt),Vt=Wt)},reset:function(){I=!1,xt=null,Z=null,st=null,bt=null,St=null,Bt=null,ee=null,Vt=null}}}const a=new e,r=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},f={},p=new WeakMap,d=[],g=null,_=!1,m=null,u=null,x=null,S=null,v=null,D=null,A=null,C=new jt(0,0,0),L=0,b=!1,y=null,P=null,B=null,U=null,W=null;const R=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let T=!1,O=0;const F=i.getParameter(i.VERSION);F.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(F)[1]),T=O>=1):F.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),T=O>=2);let $=null,at={};const ut=i.getParameter(i.SCISSOR_BOX),ot=i.getParameter(i.VIEWPORT),vt=new Me().fromArray(ut),q=new Me().fromArray(ot);function J(I,xt,Z,st){const bt=new Uint8Array(4),St=i.createTexture();i.bindTexture(I,St),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Bt=0;Bt<Z;Bt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(xt,0,i.RGBA,1,1,st,0,i.RGBA,i.UNSIGNED_BYTE,bt):i.texImage2D(xt+Bt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,bt);return St}const ct={};ct[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),ct[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ct[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ct[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),lt(i.DEPTH_TEST),r.setFunc(Ji),Pt(!1),Lt(Nc),lt(i.CULL_FACE),k(Kn);function lt(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function gt(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function At(I,xt){return f[I]!==xt?(i.bindFramebuffer(I,xt),f[I]=xt,I===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=xt),I===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=xt),!0):!1}function Dt(I,xt){let Z=d,st=!1;if(I){Z=p.get(xt),Z===void 0&&(Z=[],p.set(xt,Z));const bt=I.textures;if(Z.length!==bt.length||Z[0]!==i.COLOR_ATTACHMENT0){for(let St=0,Bt=bt.length;St<Bt;St++)Z[St]=i.COLOR_ATTACHMENT0+St;Z.length=bt.length,st=!0}}else Z[0]!==i.BACK&&(Z[0]=i.BACK,st=!0);st&&i.drawBuffers(Z)}function Xt(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const Rt={[gi]:i.FUNC_ADD,[bf]:i.FUNC_SUBTRACT,[Ef]:i.FUNC_REVERSE_SUBTRACT};Rt[wf]=i.MIN,Rt[Af]=i.MAX;const Tt={[Tf]:i.ZERO,[Rf]:i.ONE,[Cf]:i.SRC_COLOR,[Yr]:i.SRC_ALPHA,[Uf]:i.SRC_ALPHA_SATURATE,[If]:i.DST_COLOR,[Df]:i.DST_ALPHA,[Pf]:i.ONE_MINUS_SRC_COLOR,[Zr]:i.ONE_MINUS_SRC_ALPHA,[kf]:i.ONE_MINUS_DST_COLOR,[Lf]:i.ONE_MINUS_DST_ALPHA,[Ff]:i.CONSTANT_COLOR,[Nf]:i.ONE_MINUS_CONSTANT_COLOR,[zf]:i.CONSTANT_ALPHA,[Of]:i.ONE_MINUS_CONSTANT_ALPHA};function k(I,xt,Z,st,bt,St,Bt,ee,Vt,Wt){if(I===Kn){_===!0&&(gt(i.BLEND),_=!1);return}if(_===!1&&(lt(i.BLEND),_=!0),I!==Sf){if(I!==m||Wt!==b){if((u!==gi||v!==gi)&&(i.blendEquation(i.FUNC_ADD),u=gi,v=gi),Wt)switch(I){case qi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case zc:i.blendFunc(i.ONE,i.ONE);break;case Oc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Bc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case qi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case zc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Oc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Bc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}x=null,S=null,D=null,A=null,C.set(0,0,0),L=0,m=I,b=Wt}return}bt=bt||xt,St=St||Z,Bt=Bt||st,(xt!==u||bt!==v)&&(i.blendEquationSeparate(Rt[xt],Rt[bt]),u=xt,v=bt),(Z!==x||st!==S||St!==D||Bt!==A)&&(i.blendFuncSeparate(Tt[Z],Tt[st],Tt[St],Tt[Bt]),x=Z,S=st,D=St,A=Bt),(ee.equals(C)===!1||Vt!==L)&&(i.blendColor(ee.r,ee.g,ee.b,Vt),C.copy(ee),L=Vt),m=I,b=!1}function ae(I,xt){I.side===He?gt(i.CULL_FACE):lt(i.CULL_FACE);let Z=I.side===$e;xt&&(Z=!Z),Pt(Z),I.blending===qi&&I.transparent===!1?k(Kn):k(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),r.setFunc(I.depthFunc),r.setTest(I.depthTest),r.setMask(I.depthWrite),a.setMask(I.colorWrite);const st=I.stencilWrite;o.setTest(st),st&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ht(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?lt(i.SAMPLE_ALPHA_TO_COVERAGE):gt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Pt(I){y!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),y=I)}function Lt(I){I!==Mf?(lt(i.CULL_FACE),I!==P&&(I===Nc?i.cullFace(i.BACK):I===yf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):gt(i.CULL_FACE),P=I}function Y(I){I!==B&&(T&&i.lineWidth(I),B=I)}function ht(I,xt,Z){I?(lt(i.POLYGON_OFFSET_FILL),(U!==xt||W!==Z)&&(i.polygonOffset(xt,Z),U=xt,W=Z)):gt(i.POLYGON_OFFSET_FILL)}function ft(I){I?lt(i.SCISSOR_TEST):gt(i.SCISSOR_TEST)}function w(I){I===void 0&&(I=i.TEXTURE0+R-1),$!==I&&(i.activeTexture(I),$=I)}function M(I,xt,Z){Z===void 0&&($===null?Z=i.TEXTURE0+R-1:Z=$);let st=at[Z];st===void 0&&(st={type:void 0,texture:void 0},at[Z]=st),(st.type!==I||st.texture!==xt)&&($!==Z&&(i.activeTexture(Z),$=Z),i.bindTexture(I,xt||ct[I]),st.type=I,st.texture=xt)}function z(){const I=at[$];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function tt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function G(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function K(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function it(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function nt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _t(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function It(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pt(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Et(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function N(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function rt(I){vt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),vt.copy(I))}function dt(I){q.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),q.copy(I))}function Ut(I,xt){let Z=l.get(xt);Z===void 0&&(Z=new WeakMap,l.set(xt,Z));let st=Z.get(I);st===void 0&&(st=i.getUniformBlockIndex(xt,I.name),Z.set(I,st))}function kt(I,xt){const st=l.get(xt).get(I);c.get(xt)!==st&&(i.uniformBlockBinding(xt,st,I.__bindingPointIndex),c.set(xt,st))}function Gt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},$=null,at={},f={},p=new WeakMap,d=[],g=null,_=!1,m=null,u=null,x=null,S=null,v=null,D=null,A=null,C=new jt(0,0,0),L=0,b=!1,y=null,P=null,B=null,U=null,W=null,vt.set(0,0,i.canvas.width,i.canvas.height),q.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:lt,disable:gt,bindFramebuffer:At,drawBuffers:Dt,useProgram:Xt,setBlending:k,setMaterial:ae,setFlipSided:Pt,setCullFace:Lt,setLineWidth:Y,setPolygonOffset:ht,setScissorTest:ft,activeTexture:w,bindTexture:M,unbindTexture:z,compressedTexImage2D:tt,compressedTexImage3D:G,texImage2D:Et,texImage3D:N,updateUBOMapping:Ut,uniformBlockBinding:kt,texStorage2D:It,texStorage3D:pt,texSubImage2D:K,texSubImage3D:it,compressedTexSubImage2D:nt,compressedTexSubImage3D:_t,scissor:rt,viewport:dt,reset:Gt}}function Il(i,t,e,n){const s=ox(n);switch(e){case dd:return i*t;case ud:return i*t;case fd:return i*t*2;case pd:return i*t/s.components*s.byteLength;case Ko:return i*t/s.components*s.byteLength;case md:return i*t*2/s.components*s.byteLength;case Jo:return i*t*2/s.components*s.byteLength;case hd:return i*t*3/s.components*s.byteLength;case gn:return i*t*4/s.components*s.byteLength;case Qo:return i*t*4/s.components*s.byteLength;case la:case da:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ha:case ua:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case oo:case lo:return Math.max(i,16)*Math.max(t,8)/4;case ro:case co:return Math.max(i,8)*Math.max(t,8)/2;case ho:case uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case fo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case mo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case go:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case _o:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case xo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case vo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Mo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case yo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case So:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case bo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Eo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case wo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ao:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case To:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case fa:case Ro:case Co:return Math.ceil(i/4)*Math.ceil(t/4)*16;case gd:case Po:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Do:case Lo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ox(i){switch(i){case Hn:case od:return{byteLength:1,components:1};case Es:case cd:case As:return{byteLength:2,components:1};case qo:case jo:return{byteLength:2,components:4};case Si:case Zo:case zn:return{byteLength:4,components:1};case ld:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function cx(i,t,e,n,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Kt,h=new WeakMap;let f;const p=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,M){return d?new OffscreenCanvas(w,M):Ta("canvas")}function _(w,M,z){let tt=1;const G=ft(w);if((G.width>z||G.height>z)&&(tt=z/Math.max(G.width,G.height)),tt<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const K=Math.floor(tt*G.width),it=Math.floor(tt*G.height);f===void 0&&(f=g(K,it));const nt=M?g(K,it):f;return nt.width=K,nt.height=it,nt.getContext("2d").drawImage(w,0,0,K,it),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+G.width+"x"+G.height+") to ("+K+"x"+it+")."),nt}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+G.width+"x"+G.height+")."),w;return w}function m(w){return w.generateMipmaps}function u(w){i.generateMipmap(w)}function x(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(w,M,z,tt,G=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let K=M;if(M===i.RED&&(z===i.FLOAT&&(K=i.R32F),z===i.HALF_FLOAT&&(K=i.R16F),z===i.UNSIGNED_BYTE&&(K=i.R8)),M===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.R8UI),z===i.UNSIGNED_SHORT&&(K=i.R16UI),z===i.UNSIGNED_INT&&(K=i.R32UI),z===i.BYTE&&(K=i.R8I),z===i.SHORT&&(K=i.R16I),z===i.INT&&(K=i.R32I)),M===i.RG&&(z===i.FLOAT&&(K=i.RG32F),z===i.HALF_FLOAT&&(K=i.RG16F),z===i.UNSIGNED_BYTE&&(K=i.RG8)),M===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.RG8UI),z===i.UNSIGNED_SHORT&&(K=i.RG16UI),z===i.UNSIGNED_INT&&(K=i.RG32UI),z===i.BYTE&&(K=i.RG8I),z===i.SHORT&&(K=i.RG16I),z===i.INT&&(K=i.RG32I)),M===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.RGB8UI),z===i.UNSIGNED_SHORT&&(K=i.RGB16UI),z===i.UNSIGNED_INT&&(K=i.RGB32UI),z===i.BYTE&&(K=i.RGB8I),z===i.SHORT&&(K=i.RGB16I),z===i.INT&&(K=i.RGB32I)),M===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),z===i.UNSIGNED_INT&&(K=i.RGBA32UI),z===i.BYTE&&(K=i.RGBA8I),z===i.SHORT&&(K=i.RGBA16I),z===i.INT&&(K=i.RGBA32I)),M===i.RGB&&z===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),M===i.RGBA){const it=G?ka:ie.getTransfer(tt);z===i.FLOAT&&(K=i.RGBA32F),z===i.HALF_FLOAT&&(K=i.RGBA16F),z===i.UNSIGNED_BYTE&&(K=it===oe?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function v(w,M){let z;return w?M===null||M===Si||M===es?z=i.DEPTH24_STENCIL8:M===zn?z=i.DEPTH32F_STENCIL8:M===Es&&(z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Si||M===es?z=i.DEPTH_COMPONENT24:M===zn?z=i.DEPTH_COMPONENT32F:M===Es&&(z=i.DEPTH_COMPONENT16),z}function D(w,M){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==_n&&w.minFilter!==wn?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function A(w){const M=w.target;M.removeEventListener("dispose",A),L(M),M.isVideoTexture&&h.delete(M)}function C(w){const M=w.target;M.removeEventListener("dispose",C),y(M)}function L(w){const M=n.get(w);if(M.__webglInit===void 0)return;const z=w.source,tt=p.get(z);if(tt){const G=tt[M.__cacheKey];G.usedTimes--,G.usedTimes===0&&b(w),Object.keys(tt).length===0&&p.delete(z)}n.remove(w)}function b(w){const M=n.get(w);i.deleteTexture(M.__webglTexture);const z=w.source,tt=p.get(z);delete tt[M.__cacheKey],r.memory.textures--}function y(w){const M=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(M.__webglFramebuffer[tt]))for(let G=0;G<M.__webglFramebuffer[tt].length;G++)i.deleteFramebuffer(M.__webglFramebuffer[tt][G]);else i.deleteFramebuffer(M.__webglFramebuffer[tt]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[tt])}else{if(Array.isArray(M.__webglFramebuffer))for(let tt=0;tt<M.__webglFramebuffer.length;tt++)i.deleteFramebuffer(M.__webglFramebuffer[tt]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let tt=0;tt<M.__webglColorRenderbuffer.length;tt++)M.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[tt]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const z=w.textures;for(let tt=0,G=z.length;tt<G;tt++){const K=n.get(z[tt]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),r.memory.textures--),n.remove(z[tt])}n.remove(w)}let P=0;function B(){P=0}function U(){const w=P;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),P+=1,w}function W(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function R(w,M){const z=n.get(w);if(w.isVideoTexture&&Y(w),w.isRenderTargetTexture===!1&&w.version>0&&z.__version!==w.version){const tt=w.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(z,w,M);return}}e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+M)}function T(w,M){const z=n.get(w);if(w.version>0&&z.__version!==w.version){q(z,w,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+M)}function O(w,M){const z=n.get(w);if(w.version>0&&z.__version!==w.version){q(z,w,M);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+M)}function F(w,M){const z=n.get(w);if(w.version>0&&z.__version!==w.version){J(z,w,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+M)}const $={[so]:i.REPEAT,[xi]:i.CLAMP_TO_EDGE,[ao]:i.MIRRORED_REPEAT},at={[_n]:i.NEAREST,[qf]:i.NEAREST_MIPMAP_NEAREST,[Ls]:i.NEAREST_MIPMAP_LINEAR,[wn]:i.LINEAR,[Ka]:i.LINEAR_MIPMAP_NEAREST,[vi]:i.LINEAR_MIPMAP_LINEAR},ut={[Qf]:i.NEVER,[ap]:i.ALWAYS,[tp]:i.LESS,[xd]:i.LEQUAL,[ep]:i.EQUAL,[sp]:i.GEQUAL,[np]:i.GREATER,[ip]:i.NOTEQUAL};function ot(w,M){if(M.type===zn&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===wn||M.magFilter===Ka||M.magFilter===Ls||M.magFilter===vi||M.minFilter===wn||M.minFilter===Ka||M.minFilter===Ls||M.minFilter===vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,$[M.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,$[M.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,$[M.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,at[M.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,at[M.minFilter]),M.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,ut[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===_n||M.minFilter!==Ls&&M.minFilter!==vi||M.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function vt(w,M){let z=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",A));const tt=M.source;let G=p.get(tt);G===void 0&&(G={},p.set(tt,G));const K=W(M);if(K!==w.__cacheKey){G[K]===void 0&&(G[K]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,z=!0),G[K].usedTimes++;const it=G[w.__cacheKey];it!==void 0&&(G[w.__cacheKey].usedTimes--,it.usedTimes===0&&b(M)),w.__cacheKey=K,w.__webglTexture=G[K].texture}return z}function q(w,M,z){let tt=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(tt=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(tt=i.TEXTURE_3D);const G=vt(w,M),K=M.source;e.bindTexture(tt,w.__webglTexture,i.TEXTURE0+z);const it=n.get(K);if(K.version!==it.__version||G===!0){e.activeTexture(i.TEXTURE0+z);const nt=ie.getPrimaries(ie.workingColorSpace),_t=M.colorSpace===qn?null:ie.getPrimaries(M.colorSpace),It=M.colorSpace===qn||nt===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);let pt=_(M.image,!1,s.maxTextureSize);pt=ht(M,pt);const Et=a.convert(M.format,M.colorSpace),N=a.convert(M.type);let rt=S(M.internalFormat,Et,N,M.colorSpace,M.isVideoTexture);ot(tt,M);let dt;const Ut=M.mipmaps,kt=M.isVideoTexture!==!0,Gt=it.__version===void 0||G===!0,I=K.dataReady,xt=D(M,pt);if(M.isDepthTexture)rt=v(M.format===ns,M.type),Gt&&(kt?e.texStorage2D(i.TEXTURE_2D,1,rt,pt.width,pt.height):e.texImage2D(i.TEXTURE_2D,0,rt,pt.width,pt.height,0,Et,N,null));else if(M.isDataTexture)if(Ut.length>0){kt&&Gt&&e.texStorage2D(i.TEXTURE_2D,xt,rt,Ut[0].width,Ut[0].height);for(let Z=0,st=Ut.length;Z<st;Z++)dt=Ut[Z],kt?I&&e.texSubImage2D(i.TEXTURE_2D,Z,0,0,dt.width,dt.height,Et,N,dt.data):e.texImage2D(i.TEXTURE_2D,Z,rt,dt.width,dt.height,0,Et,N,dt.data);M.generateMipmaps=!1}else kt?(Gt&&e.texStorage2D(i.TEXTURE_2D,xt,rt,pt.width,pt.height),I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,pt.width,pt.height,Et,N,pt.data)):e.texImage2D(i.TEXTURE_2D,0,rt,pt.width,pt.height,0,Et,N,pt.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){kt&&Gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,rt,Ut[0].width,Ut[0].height,pt.depth);for(let Z=0,st=Ut.length;Z<st;Z++)if(dt=Ut[Z],M.format!==gn)if(Et!==null)if(kt){if(I)if(M.layerUpdates.size>0){const bt=Il(dt.width,dt.height,M.format,M.type);for(const St of M.layerUpdates){const Bt=dt.data.subarray(St*bt/dt.data.BYTES_PER_ELEMENT,(St+1)*bt/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,St,dt.width,dt.height,1,Et,Bt)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,dt.width,dt.height,pt.depth,Et,dt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Z,rt,dt.width,dt.height,pt.depth,0,dt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?I&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,dt.width,dt.height,pt.depth,Et,N,dt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Z,rt,dt.width,dt.height,pt.depth,0,Et,N,dt.data)}else{kt&&Gt&&e.texStorage2D(i.TEXTURE_2D,xt,rt,Ut[0].width,Ut[0].height);for(let Z=0,st=Ut.length;Z<st;Z++)dt=Ut[Z],M.format!==gn?Et!==null?kt?I&&e.compressedTexSubImage2D(i.TEXTURE_2D,Z,0,0,dt.width,dt.height,Et,dt.data):e.compressedTexImage2D(i.TEXTURE_2D,Z,rt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?I&&e.texSubImage2D(i.TEXTURE_2D,Z,0,0,dt.width,dt.height,Et,N,dt.data):e.texImage2D(i.TEXTURE_2D,Z,rt,dt.width,dt.height,0,Et,N,dt.data)}else if(M.isDataArrayTexture)if(kt){if(Gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,rt,pt.width,pt.height,pt.depth),I)if(M.layerUpdates.size>0){const Z=Il(pt.width,pt.height,M.format,M.type);for(const st of M.layerUpdates){const bt=pt.data.subarray(st*Z/pt.data.BYTES_PER_ELEMENT,(st+1)*Z/pt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,st,pt.width,pt.height,1,Et,N,bt)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,pt.width,pt.height,pt.depth,Et,N,pt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,rt,pt.width,pt.height,pt.depth,0,Et,N,pt.data);else if(M.isData3DTexture)kt?(Gt&&e.texStorage3D(i.TEXTURE_3D,xt,rt,pt.width,pt.height,pt.depth),I&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,pt.width,pt.height,pt.depth,Et,N,pt.data)):e.texImage3D(i.TEXTURE_3D,0,rt,pt.width,pt.height,pt.depth,0,Et,N,pt.data);else if(M.isFramebufferTexture){if(Gt)if(kt)e.texStorage2D(i.TEXTURE_2D,xt,rt,pt.width,pt.height);else{let Z=pt.width,st=pt.height;for(let bt=0;bt<xt;bt++)e.texImage2D(i.TEXTURE_2D,bt,rt,Z,st,0,Et,N,null),Z>>=1,st>>=1}}else if(Ut.length>0){if(kt&&Gt){const Z=ft(Ut[0]);e.texStorage2D(i.TEXTURE_2D,xt,rt,Z.width,Z.height)}for(let Z=0,st=Ut.length;Z<st;Z++)dt=Ut[Z],kt?I&&e.texSubImage2D(i.TEXTURE_2D,Z,0,0,Et,N,dt):e.texImage2D(i.TEXTURE_2D,Z,rt,Et,N,dt);M.generateMipmaps=!1}else if(kt){if(Gt){const Z=ft(pt);e.texStorage2D(i.TEXTURE_2D,xt,rt,Z.width,Z.height)}I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Et,N,pt)}else e.texImage2D(i.TEXTURE_2D,0,rt,Et,N,pt);m(M)&&u(tt),it.__version=K.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function J(w,M,z){if(M.image.length!==6)return;const tt=vt(w,M),G=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+z);const K=n.get(G);if(G.version!==K.__version||tt===!0){e.activeTexture(i.TEXTURE0+z);const it=ie.getPrimaries(ie.workingColorSpace),nt=M.colorSpace===qn?null:ie.getPrimaries(M.colorSpace),_t=M.colorSpace===qn||it===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const It=M.isCompressedTexture||M.image[0].isCompressedTexture,pt=M.image[0]&&M.image[0].isDataTexture,Et=[];for(let st=0;st<6;st++)!It&&!pt?Et[st]=_(M.image[st],!0,s.maxCubemapSize):Et[st]=pt?M.image[st].image:M.image[st],Et[st]=ht(M,Et[st]);const N=Et[0],rt=a.convert(M.format,M.colorSpace),dt=a.convert(M.type),Ut=S(M.internalFormat,rt,dt,M.colorSpace),kt=M.isVideoTexture!==!0,Gt=K.__version===void 0||tt===!0,I=G.dataReady;let xt=D(M,N);ot(i.TEXTURE_CUBE_MAP,M);let Z;if(It){kt&&Gt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Ut,N.width,N.height);for(let st=0;st<6;st++){Z=Et[st].mipmaps;for(let bt=0;bt<Z.length;bt++){const St=Z[bt];M.format!==gn?rt!==null?kt?I&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,bt,0,0,St.width,St.height,rt,St.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,bt,Ut,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,bt,0,0,St.width,St.height,rt,dt,St.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,bt,Ut,St.width,St.height,0,rt,dt,St.data)}}}else{if(Z=M.mipmaps,kt&&Gt){Z.length>0&&xt++;const st=ft(Et[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Ut,st.width,st.height)}for(let st=0;st<6;st++)if(pt){kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Et[st].width,Et[st].height,rt,dt,Et[st].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Ut,Et[st].width,Et[st].height,0,rt,dt,Et[st].data);for(let bt=0;bt<Z.length;bt++){const Bt=Z[bt].image[st].image;kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,bt+1,0,0,Bt.width,Bt.height,rt,dt,Bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,bt+1,Ut,Bt.width,Bt.height,0,rt,dt,Bt.data)}}else{kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,rt,dt,Et[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Ut,rt,dt,Et[st]);for(let bt=0;bt<Z.length;bt++){const St=Z[bt];kt?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,bt+1,0,0,rt,dt,St.image[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,bt+1,Ut,rt,dt,St.image[st])}}}m(M)&&u(i.TEXTURE_CUBE_MAP),K.__version=G.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function ct(w,M,z,tt,G,K){const it=a.convert(z.format,z.colorSpace),nt=a.convert(z.type),_t=S(z.internalFormat,it,nt,z.colorSpace),It=n.get(M),pt=n.get(z);if(pt.__renderTarget=M,!It.__hasExternalTextures){const Et=Math.max(1,M.width>>K),N=Math.max(1,M.height>>K);G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?e.texImage3D(G,K,_t,Et,N,M.depth,0,it,nt,null):e.texImage2D(G,K,_t,Et,N,0,it,nt,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),Lt(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,G,pt.__webglTexture,0,Pt(M)):(G===i.TEXTURE_2D||G>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&G<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,tt,G,pt.__webglTexture,K),e.bindFramebuffer(i.FRAMEBUFFER,null)}function lt(w,M,z){if(i.bindRenderbuffer(i.RENDERBUFFER,w),M.depthBuffer){const tt=M.depthTexture,G=tt&&tt.isDepthTexture?tt.type:null,K=v(M.stencilBuffer,G),it=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=Pt(M);Lt(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,K,M.width,M.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,K,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,K,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,it,i.RENDERBUFFER,w)}else{const tt=M.textures;for(let G=0;G<tt.length;G++){const K=tt[G],it=a.convert(K.format,K.colorSpace),nt=a.convert(K.type),_t=S(K.internalFormat,it,nt,K.colorSpace),It=Pt(M);z&&Lt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,It,_t,M.width,M.height):Lt(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,It,_t,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,_t,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function gt(w,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const tt=n.get(M.depthTexture);tt.__renderTarget=M,(!tt.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),R(M.depthTexture,0);const G=tt.__webglTexture,K=Pt(M);if(M.depthTexture.format===ji)Lt(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,G,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,G,0);else if(M.depthTexture.format===ns)Lt(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,G,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,G,0);else throw new Error("Unknown depthTexture format")}function At(w){const M=n.get(w),z=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const tt=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),tt){const G=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,tt.removeEventListener("dispose",G)};tt.addEventListener("dispose",G),M.__depthDisposeCallback=G}M.__boundDepthTexture=tt}if(w.depthTexture&&!M.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");gt(M.__webglFramebuffer,w)}else if(z){M.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[tt]),M.__webglDepthbuffer[tt]===void 0)M.__webglDepthbuffer[tt]=i.createRenderbuffer(),lt(M.__webglDepthbuffer[tt],w,!1);else{const G=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=M.__webglDepthbuffer[tt];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,G,i.RENDERBUFFER,K)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),lt(M.__webglDepthbuffer,w,!1);else{const tt=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,G=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,G),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,G)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Dt(w,M,z){const tt=n.get(w);M!==void 0&&ct(tt.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&At(w)}function Xt(w){const M=w.texture,z=n.get(w),tt=n.get(M);w.addEventListener("dispose",C);const G=w.textures,K=w.isWebGLCubeRenderTarget===!0,it=G.length>1;if(it||(tt.__webglTexture===void 0&&(tt.__webglTexture=i.createTexture()),tt.__version=M.version,r.memory.textures++),K){z.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer[nt]=[];for(let _t=0;_t<M.mipmaps.length;_t++)z.__webglFramebuffer[nt][_t]=i.createFramebuffer()}else z.__webglFramebuffer[nt]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer=[];for(let nt=0;nt<M.mipmaps.length;nt++)z.__webglFramebuffer[nt]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(it)for(let nt=0,_t=G.length;nt<_t;nt++){const It=n.get(G[nt]);It.__webglTexture===void 0&&(It.__webglTexture=i.createTexture(),r.memory.textures++)}if(w.samples>0&&Lt(w)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let nt=0;nt<G.length;nt++){const _t=G[nt];z.__webglColorRenderbuffer[nt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[nt]);const It=a.convert(_t.format,_t.colorSpace),pt=a.convert(_t.type),Et=S(_t.internalFormat,It,pt,_t.colorSpace,w.isXRRenderTarget===!0),N=Pt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,N,Et,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,z.__webglColorRenderbuffer[nt])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),lt(z.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),ot(i.TEXTURE_CUBE_MAP,M);for(let nt=0;nt<6;nt++)if(M.mipmaps&&M.mipmaps.length>0)for(let _t=0;_t<M.mipmaps.length;_t++)ct(z.__webglFramebuffer[nt][_t],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t);else ct(z.__webglFramebuffer[nt],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);m(M)&&u(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(it){for(let nt=0,_t=G.length;nt<_t;nt++){const It=G[nt],pt=n.get(It);e.bindTexture(i.TEXTURE_2D,pt.__webglTexture),ot(i.TEXTURE_2D,It),ct(z.__webglFramebuffer,w,It,i.COLOR_ATTACHMENT0+nt,i.TEXTURE_2D,0),m(It)&&u(i.TEXTURE_2D)}e.unbindTexture()}else{let nt=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(nt=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(nt,tt.__webglTexture),ot(nt,M),M.mipmaps&&M.mipmaps.length>0)for(let _t=0;_t<M.mipmaps.length;_t++)ct(z.__webglFramebuffer[_t],w,M,i.COLOR_ATTACHMENT0,nt,_t);else ct(z.__webglFramebuffer,w,M,i.COLOR_ATTACHMENT0,nt,0);m(M)&&u(nt),e.unbindTexture()}w.depthBuffer&&At(w)}function Rt(w){const M=w.textures;for(let z=0,tt=M.length;z<tt;z++){const G=M[z];if(m(G)){const K=x(w),it=n.get(G).__webglTexture;e.bindTexture(K,it),u(K),e.unbindTexture()}}}const Tt=[],k=[];function ae(w){if(w.samples>0){if(Lt(w)===!1){const M=w.textures,z=w.width,tt=w.height;let G=i.COLOR_BUFFER_BIT;const K=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,it=n.get(w),nt=M.length>1;if(nt)for(let _t=0;_t<M.length;_t++)e.bindFramebuffer(i.FRAMEBUFFER,it.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,it.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,it.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,it.__webglFramebuffer);for(let _t=0;_t<M.length;_t++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(G|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(G|=i.STENCIL_BUFFER_BIT)),nt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,it.__webglColorRenderbuffer[_t]);const It=n.get(M[_t]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,It,0)}i.blitFramebuffer(0,0,z,tt,0,0,z,tt,G,i.NEAREST),c===!0&&(Tt.length=0,k.length=0,Tt.push(i.COLOR_ATTACHMENT0+_t),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Tt.push(K),k.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Tt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),nt)for(let _t=0;_t<M.length;_t++){e.bindFramebuffer(i.FRAMEBUFFER,it.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,it.__webglColorRenderbuffer[_t]);const It=n.get(M[_t]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,it.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,It,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,it.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const M=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Pt(w){return Math.min(s.maxSamples,w.samples)}function Lt(w){const M=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Y(w){const M=r.render.frame;h.get(w)!==M&&(h.set(w,M),w.update())}function ht(w,M){const z=w.colorSpace,tt=w.format,G=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||z!==ss&&z!==qn&&(ie.getTransfer(z)===oe?(tt!==gn||G!==Hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),M}function ft(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=B,this.setTexture2D=R,this.setTexture2DArray=T,this.setTexture3D=O,this.setTextureCube=F,this.rebindTextures=Dt,this.setupRenderTarget=Xt,this.updateRenderTargetMipmap=Rt,this.updateMultisampleRenderTarget=ae,this.setupDepthRenderbuffer=At,this.setupFrameBufferTexture=ct,this.useMultisampledRTT=Lt}function lx(i,t){function e(n,s=qn){let a;const r=ie.getTransfer(s);if(n===Hn)return i.UNSIGNED_BYTE;if(n===qo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===jo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ld)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===od)return i.BYTE;if(n===cd)return i.SHORT;if(n===Es)return i.UNSIGNED_SHORT;if(n===Zo)return i.INT;if(n===Si)return i.UNSIGNED_INT;if(n===zn)return i.FLOAT;if(n===As)return i.HALF_FLOAT;if(n===dd)return i.ALPHA;if(n===hd)return i.RGB;if(n===gn)return i.RGBA;if(n===ud)return i.LUMINANCE;if(n===fd)return i.LUMINANCE_ALPHA;if(n===ji)return i.DEPTH_COMPONENT;if(n===ns)return i.DEPTH_STENCIL;if(n===pd)return i.RED;if(n===Ko)return i.RED_INTEGER;if(n===md)return i.RG;if(n===Jo)return i.RG_INTEGER;if(n===Qo)return i.RGBA_INTEGER;if(n===la||n===da||n===ha||n===ua)if(r===oe)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===la)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===da)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ha)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ua)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===la)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===da)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ha)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ua)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ro||n===oo||n===co||n===lo)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===ro)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===oo)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===co)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===lo)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ho||n===uo||n===fo)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===ho||n===uo)return r===oe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===fo)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===po||n===mo||n===go||n===_o||n===xo||n===vo||n===Mo||n===yo||n===So||n===bo||n===Eo||n===wo||n===Ao||n===To)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===po)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===mo)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===go)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===_o)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xo)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===vo)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Mo)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===yo)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===So)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===bo)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Eo)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===wo)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ao)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===To)return r===oe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===fa||n===Ro||n===Co)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===fa)return r===oe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ro)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Co)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===gd||n===Po||n===Do||n===Lo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===fa)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Po)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Do)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Lo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===es?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class dx extends nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class De extends Se{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hx={type:"move"};class wr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new De,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new De,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new De,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),u=this._getHandJoint(l,_);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],p=h.position.distanceTo(f.position),d=.02,g=.005;l.inputState.pinching&&p>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&p<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(hx)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new De;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const ux=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fx=`
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

}`;class px{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Ve,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new ei({vertexShader:ux,fragmentShader:fx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new pe(new Fa(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class mx extends as{constructor(t,e){super();const n=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,f=null,p=null,d=null,g=null;const _=new px,m=e.getContextAttributes();let u=null,x=null;const S=[],v=[],D=new Kt;let A=null;const C=new nn;C.viewport=new Me;const L=new nn;L.viewport=new Me;const b=[C,L],y=new dx;let P=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let J=S[q];return J===void 0&&(J=new wr,S[q]=J),J.getTargetRaySpace()},this.getControllerGrip=function(q){let J=S[q];return J===void 0&&(J=new wr,S[q]=J),J.getGripSpace()},this.getHand=function(q){let J=S[q];return J===void 0&&(J=new wr,S[q]=J),J.getHandSpace()};function U(q){const J=v.indexOf(q.inputSource);if(J===-1)return;const ct=S[J];ct!==void 0&&(ct.update(q.inputSource,q.frame,l||r),ct.dispatchEvent({type:q.type,data:q.inputSource}))}function W(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",R);for(let q=0;q<S.length;q++){const J=v[q];J!==null&&(v[q]=null,S[q].disconnect(J))}P=null,B=null,_.reset(),t.setRenderTarget(u),d=null,p=null,f=null,s=null,x=null,vt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(u=t.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",W),s.addEventListener("inputsourceschange",R),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(D),s.renderState.layers===void 0){const J={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,e,J),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new bi(d.framebufferWidth,d.framebufferHeight,{format:gn,type:Hn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let J=null,ct=null,lt=null;m.depth&&(lt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=m.stencil?ns:ji,ct=m.stencil?es:Si);const gt={colorFormat:e.RGBA8,depthFormat:lt,scaleFactor:a};f=new XRWebGLBinding(s,e),p=f.createProjectionLayer(gt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),x=new bi(p.textureWidth,p.textureHeight,{format:gn,type:Hn,depthTexture:new Pd(p.textureWidth,p.textureHeight,ct,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),vt.setContext(s),vt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function R(q){for(let J=0;J<q.removed.length;J++){const ct=q.removed[J],lt=v.indexOf(ct);lt>=0&&(v[lt]=null,S[lt].disconnect(ct))}for(let J=0;J<q.added.length;J++){const ct=q.added[J];let lt=v.indexOf(ct);if(lt===-1){for(let At=0;At<S.length;At++)if(At>=v.length){v.push(ct),lt=At;break}else if(v[At]===null){v[At]=ct,lt=At;break}if(lt===-1)break}const gt=S[lt];gt&&gt.connect(ct)}}const T=new X,O=new X;function F(q,J,ct){T.setFromMatrixPosition(J.matrixWorld),O.setFromMatrixPosition(ct.matrixWorld);const lt=T.distanceTo(O),gt=J.projectionMatrix.elements,At=ct.projectionMatrix.elements,Dt=gt[14]/(gt[10]-1),Xt=gt[14]/(gt[10]+1),Rt=(gt[9]+1)/gt[5],Tt=(gt[9]-1)/gt[5],k=(gt[8]-1)/gt[0],ae=(At[8]+1)/At[0],Pt=Dt*k,Lt=Dt*ae,Y=lt/(-k+ae),ht=Y*-k;if(J.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(ht),q.translateZ(Y),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),gt[10]===-1)q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const ft=Dt+Y,w=Xt+Y,M=Pt-ht,z=Lt+(lt-ht),tt=Rt*Xt/w*ft,G=Tt*Xt/w*ft;q.projectionMatrix.makePerspective(M,z,tt,G,ft,w),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function $(q,J){J===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(J.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let J=q.near,ct=q.far;_.texture!==null&&(_.depthNear>0&&(J=_.depthNear),_.depthFar>0&&(ct=_.depthFar)),y.near=L.near=C.near=J,y.far=L.far=C.far=ct,(P!==y.near||B!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),P=y.near,B=y.far),C.layers.mask=q.layers.mask|2,L.layers.mask=q.layers.mask|4,y.layers.mask=C.layers.mask|L.layers.mask;const lt=q.parent,gt=y.cameras;$(y,lt);for(let At=0;At<gt.length;At++)$(gt[At],lt);gt.length===2?F(y,C,L):y.projectionMatrix.copy(C.projectionMatrix),at(q,y,lt)};function at(q,J,ct){ct===null?q.matrix.copy(J.matrixWorld):(q.matrix.copy(ct.matrixWorld),q.matrix.invert(),q.matrix.multiply(J.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=ko*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(p===null&&d===null))return c},this.setFoveation=function(q){c=q,p!==null&&(p.fixedFoveation=q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=q)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let ut=null;function ot(q,J){if(h=J.getViewerPose(l||r),g=J,h!==null){const ct=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let lt=!1;ct.length!==y.cameras.length&&(y.cameras.length=0,lt=!0);for(let At=0;At<ct.length;At++){const Dt=ct[At];let Xt=null;if(d!==null)Xt=d.getViewport(Dt);else{const Tt=f.getViewSubImage(p,Dt);Xt=Tt.viewport,At===0&&(t.setRenderTargetTextures(x,Tt.colorTexture,p.ignoreDepthValues?void 0:Tt.depthStencilTexture),t.setRenderTarget(x))}let Rt=b[At];Rt===void 0&&(Rt=new nn,Rt.layers.enable(At),Rt.viewport=new Me,b[At]=Rt),Rt.matrix.fromArray(Dt.transform.matrix),Rt.matrix.decompose(Rt.position,Rt.quaternion,Rt.scale),Rt.projectionMatrix.fromArray(Dt.projectionMatrix),Rt.projectionMatrixInverse.copy(Rt.projectionMatrix).invert(),Rt.viewport.set(Xt.x,Xt.y,Xt.width,Xt.height),At===0&&(y.matrix.copy(Rt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),lt===!0&&y.cameras.push(Rt)}const gt=s.enabledFeatures;if(gt&&gt.includes("depth-sensing")){const At=f.getDepthInformation(ct[0]);At&&At.isValid&&At.texture&&_.init(t,At,s.renderState)}}for(let ct=0;ct<S.length;ct++){const lt=v[ct],gt=S[ct];lt!==null&&gt!==void 0&&gt.update(lt,J,l||r)}ut&&ut(q,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const vt=new Rd;vt.setAnimationLoop(ot),this.setAnimationLoop=function(q){ut=q},this.dispose=function(){}}}const hi=new Rn,gx=new me;function _x(i,t){function e(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function n(m,u){u.color.getRGB(m.fogColor.value,wd(i)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function s(m,u,x,S,v){u.isMeshBasicMaterial||u.isMeshLambertMaterial?a(m,u):u.isMeshToonMaterial?(a(m,u),f(m,u)):u.isMeshPhongMaterial?(a(m,u),h(m,u)):u.isMeshStandardMaterial?(a(m,u),p(m,u),u.isMeshPhysicalMaterial&&d(m,u,v)):u.isMeshMatcapMaterial?(a(m,u),g(m,u)):u.isMeshDepthMaterial?a(m,u):u.isMeshDistanceMaterial?(a(m,u),_(m,u)):u.isMeshNormalMaterial?a(m,u):u.isLineBasicMaterial?(r(m,u),u.isLineDashedMaterial&&o(m,u)):u.isPointsMaterial?c(m,u,x,S):u.isSpriteMaterial?l(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function a(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,e(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,e(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,e(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===$e&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,e(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===$e&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,e(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,e(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const x=t.get(u),S=x.envMap,v=x.envMapRotation;S&&(m.envMap.value=S,hi.copy(v),hi.x*=-1,hi.y*=-1,hi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),m.envMapRotation.value.setFromMatrix4(gx.makeRotationFromEuler(hi)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,e(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,m.aoMapTransform))}function r(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,e(u.map,m.mapTransform))}function o(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function c(m,u,x,S){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*x,m.scale.value=S*.5,u.map&&(m.map.value=u.map,e(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,e(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function l(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,e(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,e(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function h(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function f(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function p(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function d(m,u,x){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===$e&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,u){u.matcap&&(m.matcap.value=u.matcap)}function _(m,u){const x=t.get(u).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function xx(i,t,e,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,S){const v=S.program;n.uniformBlockBinding(x,v)}function l(x,S){let v=s[x.id];v===void 0&&(g(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",m));const D=S.program;n.updateUBOMapping(x,D);const A=t.render.frame;a[x.id]!==A&&(p(x),a[x.id]=A)}function h(x){const S=f();x.__bindingPointIndex=S;const v=i.createBuffer(),D=x.__size,A=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,D,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,v),v}function f(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const S=s[x.id],v=x.uniforms,D=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let A=0,C=v.length;A<C;A++){const L=Array.isArray(v[A])?v[A]:[v[A]];for(let b=0,y=L.length;b<y;b++){const P=L[b];if(d(P,A,b,D)===!0){const B=P.__offset,U=Array.isArray(P.value)?P.value:[P.value];let W=0;for(let R=0;R<U.length;R++){const T=U[R],O=_(T);typeof T=="number"||typeof T=="boolean"?(P.__data[0]=T,i.bufferSubData(i.UNIFORM_BUFFER,B+W,P.__data)):T.isMatrix3?(P.__data[0]=T.elements[0],P.__data[1]=T.elements[1],P.__data[2]=T.elements[2],P.__data[3]=0,P.__data[4]=T.elements[3],P.__data[5]=T.elements[4],P.__data[6]=T.elements[5],P.__data[7]=0,P.__data[8]=T.elements[6],P.__data[9]=T.elements[7],P.__data[10]=T.elements[8],P.__data[11]=0):(T.toArray(P.__data,W),W+=O.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,B,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(x,S,v,D){const A=x.value,C=S+"_"+v;if(D[C]===void 0)return typeof A=="number"||typeof A=="boolean"?D[C]=A:D[C]=A.clone(),!0;{const L=D[C];if(typeof A=="number"||typeof A=="boolean"){if(L!==A)return D[C]=A,!0}else if(L.equals(A)===!1)return L.copy(A),!0}return!1}function g(x){const S=x.uniforms;let v=0;const D=16;for(let C=0,L=S.length;C<L;C++){const b=Array.isArray(S[C])?S[C]:[S[C]];for(let y=0,P=b.length;y<P;y++){const B=b[y],U=Array.isArray(B.value)?B.value:[B.value];for(let W=0,R=U.length;W<R;W++){const T=U[W],O=_(T),F=v%D,$=F%O.boundary,at=F+$;v+=$,at!==0&&D-at<O.storage&&(v+=D-at),B.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=v,v+=O.storage}}}const A=v%D;return A>0&&(v+=D-A),x.__size=v,x.__cache={},this}function _(x){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),S}function m(x){const S=x.target;S.removeEventListener("dispose",m);const v=r.indexOf(S.__bindingPointIndex);r.splice(v,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete a[S.id]}function u(){for(const x in s)i.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:u}}class vx{constructor(t={}){const{canvas:e=op(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,u=null;const x=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=en,this.toneMapping=Jn,this.toneMappingExposure=1;const v=this;let D=!1,A=0,C=0,L=null,b=-1,y=null;const P=new Me,B=new Me;let U=null;const W=new jt(0);let R=0,T=e.width,O=e.height,F=1,$=null,at=null;const ut=new Me(0,0,T,O),ot=new Me(0,0,T,O);let vt=!1;const q=new nc;let J=!1,ct=!1;const lt=new me,gt=new me,At=new X,Dt=new Me,Xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Rt=!1;function Tt(){return L===null?F:1}let k=n;function ae(E,H){return e.getContext(E,H)}try{const E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$o}`),e.addEventListener("webglcontextlost",st,!1),e.addEventListener("webglcontextrestored",bt,!1),e.addEventListener("webglcontextcreationerror",St,!1),k===null){const H="webgl2";if(k=ae(H,E),k===null)throw ae(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Pt,Lt,Y,ht,ft,w,M,z,tt,G,K,it,nt,_t,It,pt,Et,N,rt,dt,Ut,kt,Gt,I;function xt(){Pt=new E0(k),Pt.init(),kt=new lx(k,Pt),Lt=new x0(k,Pt,t,kt),Y=new rx(k,Pt),Lt.reverseDepthBuffer&&p&&Y.buffers.depth.setReversed(!0),ht=new T0(k),ft=new W_,w=new cx(k,Pt,Y,ft,Lt,kt,ht),M=new M0(v),z=new b0(v),tt=new kp(k),Gt=new g0(k,tt),G=new w0(k,tt,ht,Gt),K=new C0(k,G,tt,ht),rt=new R0(k,Lt,w),pt=new v0(ft),it=new X_(v,M,z,Pt,Lt,Gt,pt),nt=new _x(v,ft),_t=new Y_,It=new Q_(Pt),N=new m0(v,M,z,Y,K,d,c),Et=new sx(v,K,Lt),I=new xx(k,ht,Lt,Y),dt=new _0(k,Pt,ht),Ut=new A0(k,Pt,ht),ht.programs=it.programs,v.capabilities=Lt,v.extensions=Pt,v.properties=ft,v.renderLists=_t,v.shadowMap=Et,v.state=Y,v.info=ht}xt();const Z=new mx(v,k);this.xr=Z,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const E=Pt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Pt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(E){E!==void 0&&(F=E,this.setSize(T,O,!1))},this.getSize=function(E){return E.set(T,O)},this.setSize=function(E,H,j=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}T=E,O=H,e.width=Math.floor(E*F),e.height=Math.floor(H*F),j===!0&&(e.style.width=E+"px",e.style.height=H+"px"),this.setViewport(0,0,E,H)},this.getDrawingBufferSize=function(E){return E.set(T*F,O*F).floor()},this.setDrawingBufferSize=function(E,H,j){T=E,O=H,F=j,e.width=Math.floor(E*j),e.height=Math.floor(H*j),this.setViewport(0,0,E,H)},this.getCurrentViewport=function(E){return E.copy(P)},this.getViewport=function(E){return E.copy(ut)},this.setViewport=function(E,H,j,Q){E.isVector4?ut.set(E.x,E.y,E.z,E.w):ut.set(E,H,j,Q),Y.viewport(P.copy(ut).multiplyScalar(F).round())},this.getScissor=function(E){return E.copy(ot)},this.setScissor=function(E,H,j,Q){E.isVector4?ot.set(E.x,E.y,E.z,E.w):ot.set(E,H,j,Q),Y.scissor(B.copy(ot).multiplyScalar(F).round())},this.getScissorTest=function(){return vt},this.setScissorTest=function(E){Y.setScissorTest(vt=E)},this.setOpaqueSort=function(E){$=E},this.setTransparentSort=function(E){at=E},this.getClearColor=function(E){return E.copy(N.getClearColor())},this.setClearColor=function(){N.setClearColor.apply(N,arguments)},this.getClearAlpha=function(){return N.getClearAlpha()},this.setClearAlpha=function(){N.setClearAlpha.apply(N,arguments)},this.clear=function(E=!0,H=!0,j=!0){let Q=0;if(E){let V=!1;if(L!==null){const yt=L.texture.format;V=yt===Qo||yt===Jo||yt===Ko}if(V){const yt=L.texture.type,Ct=yt===Hn||yt===Si||yt===Es||yt===es||yt===qo||yt===jo,Nt=N.getClearColor(),zt=N.getClearAlpha(),$t=Nt.r,qt=Nt.g,Ft=Nt.b;Ct?(g[0]=$t,g[1]=qt,g[2]=Ft,g[3]=zt,k.clearBufferuiv(k.COLOR,0,g)):(_[0]=$t,_[1]=qt,_[2]=Ft,_[3]=zt,k.clearBufferiv(k.COLOR,0,_))}else Q|=k.COLOR_BUFFER_BIT}H&&(Q|=k.DEPTH_BUFFER_BIT),j&&(Q|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",st,!1),e.removeEventListener("webglcontextrestored",bt,!1),e.removeEventListener("webglcontextcreationerror",St,!1),_t.dispose(),It.dispose(),ft.dispose(),M.dispose(),z.dispose(),K.dispose(),Gt.dispose(),I.dispose(),it.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",rn),Z.removeEventListener("sessionend",Je),he.stop()};function st(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function bt(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const E=ht.autoReset,H=Et.enabled,j=Et.autoUpdate,Q=Et.needsUpdate,V=Et.type;xt(),ht.autoReset=E,Et.enabled=H,Et.autoUpdate=j,Et.needsUpdate=Q,Et.type=V}function St(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Bt(E){const H=E.target;H.removeEventListener("dispose",Bt),ee(H)}function ee(E){Vt(E),ft.remove(E)}function Vt(E){const H=ft.get(E).programs;H!==void 0&&(H.forEach(function(j){it.releaseProgram(j)}),E.isShaderMaterial&&it.releaseShaderCache(E))}this.renderBufferDirect=function(E,H,j,Q,V,yt){H===null&&(H=Xt);const Ct=V.isMesh&&V.matrixWorld.determinant()<0,Nt=on(E,H,j,Q,V);Y.setMaterial(Q,Ct);let zt=j.index,$t=1;if(Q.wireframe===!0){if(zt=G.getWireframeAttribute(j),zt===void 0)return;$t=2}const qt=j.drawRange,Ft=j.attributes.position;let ne=qt.start*$t,re=(qt.start+qt.count)*$t;yt!==null&&(ne=Math.max(ne,yt.start*$t),re=Math.min(re,(yt.start+yt.count)*$t)),zt!==null?(ne=Math.max(ne,0),re=Math.min(re,zt.count)):Ft!=null&&(ne=Math.max(ne,0),re=Math.min(re,Ft.count));const le=re-ne;if(le<0||le===1/0)return;Gt.setup(V,Q,Nt,j,zt);let Le,te=dt;if(zt!==null&&(Le=tt.get(zt),te=Ut,te.setIndex(Le)),V.isMesh)Q.wireframe===!0?(Y.setLineWidth(Q.wireframeLinewidth*Tt()),te.setMode(k.LINES)):te.setMode(k.TRIANGLES);else if(V.isLine){let Ot=Q.linewidth;Ot===void 0&&(Ot=1),Y.setLineWidth(Ot*Tt()),V.isLineSegments?te.setMode(k.LINES):V.isLineLoop?te.setMode(k.LINE_LOOP):te.setMode(k.LINE_STRIP)}else V.isPoints?te.setMode(k.POINTS):V.isSprite&&te.setMode(k.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)te.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(Pt.get("WEBGL_multi_draw"))te.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Ot=V._multiDrawStarts,cn=V._multiDrawCounts,se=V._multiDrawCount,Ze=zt?tt.get(zt).bytesPerElement:1,Gn=ft.get(Q).currentProgram.getUniforms();for(let Ae=0;Ae<se;Ae++)Gn.setValue(k,"_gl_DrawID",Ae),te.render(Ot[Ae]/Ze,cn[Ae])}else if(V.isInstancedMesh)te.renderInstances(ne,le,V.count);else if(j.isInstancedBufferGeometry){const Ot=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,cn=Math.min(j.instanceCount,Ot);te.renderInstances(ne,le,cn)}else te.render(ne,le)};function Wt(E,H,j){E.transparent===!0&&E.side===He&&E.forceSinglePass===!1?(E.side=$e,E.needsUpdate=!0,Yt(E,H,j),E.side=ti,E.needsUpdate=!0,Yt(E,H,j),E.side=He):Yt(E,H,j)}this.compile=function(E,H,j=null){j===null&&(j=E),u=It.get(j),u.init(H),S.push(u),j.traverseVisible(function(V){V.isLight&&V.layers.test(H.layers)&&(u.pushLight(V),V.castShadow&&u.pushShadow(V))}),E!==j&&E.traverseVisible(function(V){V.isLight&&V.layers.test(H.layers)&&(u.pushLight(V),V.castShadow&&u.pushShadow(V))}),u.setupLights();const Q=new Set;return E.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const yt=V.material;if(yt)if(Array.isArray(yt))for(let Ct=0;Ct<yt.length;Ct++){const Nt=yt[Ct];Wt(Nt,j,V),Q.add(Nt)}else Wt(yt,j,V),Q.add(yt)}),S.pop(),u=null,Q},this.compileAsync=function(E,H,j=null){const Q=this.compile(E,H,j);return new Promise(V=>{function yt(){if(Q.forEach(function(Ct){ft.get(Ct).currentProgram.isReady()&&Q.delete(Ct)}),Q.size===0){V(E);return}setTimeout(yt,10)}Pt.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let ge=null;function ye(E){ge&&ge(E)}function rn(){he.stop()}function Je(){he.start()}const he=new Rd;he.setAnimationLoop(ye),typeof self<"u"&&he.setContext(self),this.setAnimationLoop=function(E){ge=E,Z.setAnimationLoop(E),E===null?he.stop():he.start()},Z.addEventListener("sessionstart",rn),Z.addEventListener("sessionend",Je),this.render=function(E,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(H),H=Z.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,H,L),u=It.get(E,S.length),u.init(H),S.push(u),gt.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),q.setFromProjectionMatrix(gt),ct=this.localClippingEnabled,J=pt.init(this.clippingPlanes,ct),m=_t.get(E,x.length),m.init(),x.push(m),Z.enabled===!0&&Z.isPresenting===!0){const yt=v.xr.getDepthSensingMesh();yt!==null&&et(yt,H,-1/0,v.sortObjects)}et(E,H,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort($,at),Rt=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,Rt&&N.addToRenderList(m,E),this.info.render.frame++,J===!0&&pt.beginShadows();const j=u.state.shadowsArray;Et.render(j,E,H),J===!0&&pt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,V=m.transmissive;if(u.setupLights(),H.isArrayCamera){const yt=H.cameras;if(V.length>0)for(let Ct=0,Nt=yt.length;Ct<Nt;Ct++){const zt=yt[Ct];mt(Q,V,E,zt)}Rt&&N.render(E);for(let Ct=0,Nt=yt.length;Ct<Nt;Ct++){const zt=yt[Ct];Mt(m,E,zt,zt.viewport)}}else V.length>0&&mt(Q,V,E,H),Rt&&N.render(E),Mt(m,E,H);L!==null&&(w.updateMultisampleRenderTarget(L),w.updateRenderTargetMipmap(L)),E.isScene===!0&&E.onAfterRender(v,E,H),Gt.resetDefaultState(),b=-1,y=null,S.pop(),S.length>0?(u=S[S.length-1],J===!0&&pt.setGlobalState(v.clippingPlanes,u.state.camera)):u=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function et(E,H,j,Q){if(E.visible===!1)return;if(E.layers.test(H.layers)){if(E.isGroup)j=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(H);else if(E.isLight)u.pushLight(E),E.castShadow&&u.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||q.intersectsSprite(E)){Q&&Dt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(gt);const Ct=K.update(E),Nt=E.material;Nt.visible&&m.push(E,Ct,Nt,j,Dt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||q.intersectsObject(E))){const Ct=K.update(E),Nt=E.material;if(Q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Dt.copy(E.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Dt.copy(Ct.boundingSphere.center)),Dt.applyMatrix4(E.matrixWorld).applyMatrix4(gt)),Array.isArray(Nt)){const zt=Ct.groups;for(let $t=0,qt=zt.length;$t<qt;$t++){const Ft=zt[$t],ne=Nt[Ft.materialIndex];ne&&ne.visible&&m.push(E,Ct,ne,j,Dt.z,Ft)}}else Nt.visible&&m.push(E,Ct,Nt,j,Dt.z,null)}}const yt=E.children;for(let Ct=0,Nt=yt.length;Ct<Nt;Ct++)et(yt[Ct],H,j,Q)}function Mt(E,H,j,Q){const V=E.opaque,yt=E.transmissive,Ct=E.transparent;u.setupLightsView(j),J===!0&&pt.setGlobalState(v.clippingPlanes,j),Q&&Y.viewport(P.copy(Q)),V.length>0&&Ht(V,H,j),yt.length>0&&Ht(yt,H,j),Ct.length>0&&Ht(Ct,H,j),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function mt(E,H,j,Q){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[Q.id]===void 0&&(u.state.transmissionRenderTarget[Q.id]=new bi(1,1,{generateMipmaps:!0,type:Pt.has("EXT_color_buffer_half_float")||Pt.has("EXT_color_buffer_float")?As:Hn,minFilter:vi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ie.workingColorSpace}));const yt=u.state.transmissionRenderTarget[Q.id],Ct=Q.viewport||P;yt.setSize(Ct.z,Ct.w);const Nt=v.getRenderTarget();v.setRenderTarget(yt),v.getClearColor(W),R=v.getClearAlpha(),R<1&&v.setClearColor(16777215,.5),v.clear(),Rt&&N.render(j);const zt=v.toneMapping;v.toneMapping=Jn;const $t=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),u.setupLightsView(Q),J===!0&&pt.setGlobalState(v.clippingPlanes,Q),Ht(E,j,Q),w.updateMultisampleRenderTarget(yt),w.updateRenderTargetMipmap(yt),Pt.has("WEBGL_multisampled_render_to_texture")===!1){let qt=!1;for(let Ft=0,ne=H.length;Ft<ne;Ft++){const re=H[Ft],le=re.object,Le=re.geometry,te=re.material,Ot=re.group;if(te.side===He&&le.layers.test(Q.layers)){const cn=te.side;te.side=$e,te.needsUpdate=!0,Zt(le,j,Q,Le,te,Ot),te.side=cn,te.needsUpdate=!0,qt=!0}}qt===!0&&(w.updateMultisampleRenderTarget(yt),w.updateRenderTargetMipmap(yt))}v.setRenderTarget(Nt),v.setClearColor(W,R),$t!==void 0&&(Q.viewport=$t),v.toneMapping=zt}function Ht(E,H,j){const Q=H.isScene===!0?H.overrideMaterial:null;for(let V=0,yt=E.length;V<yt;V++){const Ct=E[V],Nt=Ct.object,zt=Ct.geometry,$t=Q===null?Ct.material:Q,qt=Ct.group;Nt.layers.test(j.layers)&&Zt(Nt,H,j,zt,$t,qt)}}function Zt(E,H,j,Q,V,yt){E.onBeforeRender(v,H,j,Q,V,yt),E.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),V.onBeforeRender(v,H,j,Q,E,yt),V.transparent===!0&&V.side===He&&V.forceSinglePass===!1?(V.side=$e,V.needsUpdate=!0,v.renderBufferDirect(j,H,Q,V,E,yt),V.side=ti,V.needsUpdate=!0,v.renderBufferDirect(j,H,Q,V,E,yt),V.side=He):v.renderBufferDirect(j,H,Q,V,E,yt),E.onAfterRender(v,H,j,Q,V,yt)}function Yt(E,H,j){H.isScene!==!0&&(H=Xt);const Q=ft.get(E),V=u.state.lights,yt=u.state.shadowsArray,Ct=V.state.version,Nt=it.getParameters(E,V.state,yt,H,j),zt=it.getProgramCacheKey(Nt);let $t=Q.programs;Q.environment=E.isMeshStandardMaterial?H.environment:null,Q.fog=H.fog,Q.envMap=(E.isMeshStandardMaterial?z:M).get(E.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&E.envMap===null?H.environmentRotation:E.envMapRotation,$t===void 0&&(E.addEventListener("dispose",Bt),$t=new Map,Q.programs=$t);let qt=$t.get(zt);if(qt!==void 0){if(Q.currentProgram===qt&&Q.lightsStateVersion===Ct)return we(E,Nt),qt}else Nt.uniforms=it.getUniforms(E),E.onBeforeCompile(Nt,v),qt=it.acquireProgram(Nt,zt),$t.set(zt,qt),Q.uniforms=Nt.uniforms;const Ft=Q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ft.clippingPlanes=pt.uniform),we(E,Nt),Q.needsLights=Fe(E),Q.lightsStateVersion=Ct,Q.needsLights&&(Ft.ambientLightColor.value=V.state.ambient,Ft.lightProbe.value=V.state.probe,Ft.directionalLights.value=V.state.directional,Ft.directionalLightShadows.value=V.state.directionalShadow,Ft.spotLights.value=V.state.spot,Ft.spotLightShadows.value=V.state.spotShadow,Ft.rectAreaLights.value=V.state.rectArea,Ft.ltc_1.value=V.state.rectAreaLTC1,Ft.ltc_2.value=V.state.rectAreaLTC2,Ft.pointLights.value=V.state.point,Ft.pointLightShadows.value=V.state.pointShadow,Ft.hemisphereLights.value=V.state.hemi,Ft.directionalShadowMap.value=V.state.directionalShadowMap,Ft.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Ft.spotShadowMap.value=V.state.spotShadowMap,Ft.spotLightMatrix.value=V.state.spotLightMatrix,Ft.spotLightMap.value=V.state.spotLightMap,Ft.pointShadowMap.value=V.state.pointShadowMap,Ft.pointShadowMatrix.value=V.state.pointShadowMatrix),Q.currentProgram=qt,Q.uniformsList=null,qt}function ue(E){if(E.uniformsList===null){const H=E.currentProgram.getUniforms();E.uniformsList=ma.seqWithValue(H.seq,E.uniforms)}return E.uniformsList}function we(E,H){const j=ft.get(E);j.outputColorSpace=H.outputColorSpace,j.batching=H.batching,j.batchingColor=H.batchingColor,j.instancing=H.instancing,j.instancingColor=H.instancingColor,j.instancingMorph=H.instancingMorph,j.skinning=H.skinning,j.morphTargets=H.morphTargets,j.morphNormals=H.morphNormals,j.morphColors=H.morphColors,j.morphTargetsCount=H.morphTargetsCount,j.numClippingPlanes=H.numClippingPlanes,j.numIntersection=H.numClipIntersection,j.vertexAlphas=H.vertexAlphas,j.vertexTangents=H.vertexTangents,j.toneMapping=H.toneMapping}function on(E,H,j,Q,V){H.isScene!==!0&&(H=Xt),w.resetTextureUnits();const yt=H.fog,Ct=Q.isMeshStandardMaterial?H.environment:null,Nt=L===null?v.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:ss,zt=(Q.isMeshStandardMaterial?z:M).get(Q.envMap||Ct),$t=Q.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,qt=!!j.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Ft=!!j.morphAttributes.position,ne=!!j.morphAttributes.normal,re=!!j.morphAttributes.color;let le=Jn;Q.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(le=v.toneMapping);const Le=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,te=Le!==void 0?Le.length:0,Ot=ft.get(Q),cn=u.state.lights;if(J===!0&&(ct===!0||E!==y)){const Ie=E===y&&Q.id===b;pt.setState(Q,E,Ie)}let se=!1;Q.version===Ot.__version?(Ot.needsLights&&Ot.lightsStateVersion!==cn.state.version||Ot.outputColorSpace!==Nt||V.isBatchedMesh&&Ot.batching===!1||!V.isBatchedMesh&&Ot.batching===!0||V.isBatchedMesh&&Ot.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Ot.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Ot.instancing===!1||!V.isInstancedMesh&&Ot.instancing===!0||V.isSkinnedMesh&&Ot.skinning===!1||!V.isSkinnedMesh&&Ot.skinning===!0||V.isInstancedMesh&&Ot.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Ot.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Ot.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Ot.instancingMorph===!1&&V.morphTexture!==null||Ot.envMap!==zt||Q.fog===!0&&Ot.fog!==yt||Ot.numClippingPlanes!==void 0&&(Ot.numClippingPlanes!==pt.numPlanes||Ot.numIntersection!==pt.numIntersection)||Ot.vertexAlphas!==$t||Ot.vertexTangents!==qt||Ot.morphTargets!==Ft||Ot.morphNormals!==ne||Ot.morphColors!==re||Ot.toneMapping!==le||Ot.morphTargetsCount!==te)&&(se=!0):(se=!0,Ot.__version=Q.version);let Ze=Ot.currentProgram;se===!0&&(Ze=Yt(Q,H,V));let Gn=!1,Ae=!1,ii=!1;const de=Ze.getUniforms(),Qe=Ot.uniforms;if(Y.useProgram(Ze.program)&&(Gn=!0,Ae=!0,ii=!0),Q.id!==b&&(b=Q.id,Ae=!0),Gn||y!==E){Y.buffers.depth.getReversed()?(lt.copy(E.projectionMatrix),lp(lt),dp(lt),de.setValue(k,"projectionMatrix",lt)):de.setValue(k,"projectionMatrix",E.projectionMatrix),de.setValue(k,"viewMatrix",E.matrixWorldInverse);const Ne=de.map.cameraPosition;Ne!==void 0&&Ne.setValue(k,At.setFromMatrixPosition(E.matrixWorld)),Lt.logarithmicDepthBuffer&&de.setValue(k,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&de.setValue(k,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Ae=!0,ii=!0)}if(V.isSkinnedMesh){de.setOptional(k,V,"bindMatrix"),de.setOptional(k,V,"bindMatrixInverse");const Ie=V.skeleton;Ie&&(Ie.boneTexture===null&&Ie.computeBoneTexture(),de.setValue(k,"boneTexture",Ie.boneTexture,w))}V.isBatchedMesh&&(de.setOptional(k,V,"batchingTexture"),de.setValue(k,"batchingTexture",V._matricesTexture,w),de.setOptional(k,V,"batchingIdTexture"),de.setValue(k,"batchingIdTexture",V._indirectTexture,w),de.setOptional(k,V,"batchingColorTexture"),V._colorsTexture!==null&&de.setValue(k,"batchingColorTexture",V._colorsTexture,w));const si=j.morphAttributes;if((si.position!==void 0||si.normal!==void 0||si.color!==void 0)&&rt.update(V,j,Ze),(Ae||Ot.receiveShadow!==V.receiveShadow)&&(Ot.receiveShadow=V.receiveShadow,de.setValue(k,"receiveShadow",V.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Qe.envMap.value=zt,Qe.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&H.environment!==null&&(Qe.envMapIntensity.value=H.environmentIntensity),Ae&&(de.setValue(k,"toneMappingExposure",v.toneMappingExposure),Ot.needsLights&&fe(Qe,ii),yt&&Q.fog===!0&&nt.refreshFogUniforms(Qe,yt),nt.refreshMaterialUniforms(Qe,Q,F,O,u.state.transmissionRenderTarget[E.id]),ma.upload(k,ue(Ot),Qe,w)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(ma.upload(k,ue(Ot),Qe,w),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&de.setValue(k,"center",V.center),de.setValue(k,"modelViewMatrix",V.modelViewMatrix),de.setValue(k,"normalMatrix",V.normalMatrix),de.setValue(k,"modelMatrix",V.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const Ie=Q.uniformsGroups;for(let Ne=0,ln=Ie.length;Ne<ln;Ne++){const os=Ie[Ne];I.update(os,Ze),I.bind(os,Ze)}}return Ze}function fe(E,H){E.ambientLightColor.needsUpdate=H,E.lightProbe.needsUpdate=H,E.directionalLights.needsUpdate=H,E.directionalLightShadows.needsUpdate=H,E.pointLights.needsUpdate=H,E.pointLightShadows.needsUpdate=H,E.spotLights.needsUpdate=H,E.spotLightShadows.needsUpdate=H,E.rectAreaLights.needsUpdate=H,E.hemisphereLights.needsUpdate=H}function Fe(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(E,H,j){ft.get(E.texture).__webglTexture=H,ft.get(E.depthTexture).__webglTexture=j;const Q=ft.get(E);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=j===void 0,Q.__autoAllocateDepthBuffer||Pt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,H){const j=ft.get(E);j.__webglFramebuffer=H,j.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(E,H=0,j=0){L=E,A=H,C=j;let Q=!0,V=null,yt=!1,Ct=!1;if(E){const zt=ft.get(E);if(zt.__useDefaultFramebuffer!==void 0)Y.bindFramebuffer(k.FRAMEBUFFER,null),Q=!1;else if(zt.__webglFramebuffer===void 0)w.setupRenderTarget(E);else if(zt.__hasExternalTextures)w.rebindTextures(E,ft.get(E.texture).__webglTexture,ft.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ft=E.depthTexture;if(zt.__boundDepthTexture!==Ft){if(Ft!==null&&ft.has(Ft)&&(E.width!==Ft.image.width||E.height!==Ft.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(E)}}const $t=E.texture;($t.isData3DTexture||$t.isDataArrayTexture||$t.isCompressedArrayTexture)&&(Ct=!0);const qt=ft.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(qt[H])?V=qt[H][j]:V=qt[H],yt=!0):E.samples>0&&w.useMultisampledRTT(E)===!1?V=ft.get(E).__webglMultisampledFramebuffer:Array.isArray(qt)?V=qt[j]:V=qt,P.copy(E.viewport),B.copy(E.scissor),U=E.scissorTest}else P.copy(ut).multiplyScalar(F).floor(),B.copy(ot).multiplyScalar(F).floor(),U=vt;if(Y.bindFramebuffer(k.FRAMEBUFFER,V)&&Q&&Y.drawBuffers(E,V),Y.viewport(P),Y.scissor(B),Y.setScissorTest(U),yt){const zt=ft.get(E.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+H,zt.__webglTexture,j)}else if(Ct){const zt=ft.get(E.texture),$t=H||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,zt.__webglTexture,j||0,$t)}b=-1},this.readRenderTargetPixels=function(E,H,j,Q,V,yt,Ct){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Nt=ft.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ct!==void 0&&(Nt=Nt[Ct]),Nt){Y.bindFramebuffer(k.FRAMEBUFFER,Nt);try{const zt=E.texture,$t=zt.format,qt=zt.type;if(!Lt.textureFormatReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Lt.textureTypeReadable(qt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=E.width-Q&&j>=0&&j<=E.height-V&&k.readPixels(H,j,Q,V,kt.convert($t),kt.convert(qt),yt)}finally{const zt=L!==null?ft.get(L).__webglFramebuffer:null;Y.bindFramebuffer(k.FRAMEBUFFER,zt)}}},this.readRenderTargetPixelsAsync=async function(E,H,j,Q,V,yt,Ct){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Nt=ft.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ct!==void 0&&(Nt=Nt[Ct]),Nt){const zt=E.texture,$t=zt.format,qt=zt.type;if(!Lt.textureFormatReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Lt.textureTypeReadable(qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(H>=0&&H<=E.width-Q&&j>=0&&j<=E.height-V){Y.bindFramebuffer(k.FRAMEBUFFER,Nt);const Ft=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Ft),k.bufferData(k.PIXEL_PACK_BUFFER,yt.byteLength,k.STREAM_READ),k.readPixels(H,j,Q,V,kt.convert($t),kt.convert(qt),0);const ne=L!==null?ft.get(L).__webglFramebuffer:null;Y.bindFramebuffer(k.FRAMEBUFFER,ne);const re=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await cp(k,re,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Ft),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,yt),k.deleteBuffer(Ft),k.deleteSync(re),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,H=null,j=0){E.isTexture!==!0&&(xs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),H=arguments[0]||null,E=arguments[1]);const Q=Math.pow(2,-j),V=Math.floor(E.image.width*Q),yt=Math.floor(E.image.height*Q),Ct=H!==null?H.x:0,Nt=H!==null?H.y:0;w.setTexture2D(E,0),k.copyTexSubImage2D(k.TEXTURE_2D,j,0,0,Ct,Nt,V,yt),Y.unbindTexture()},this.copyTextureToTexture=function(E,H,j=null,Q=null,V=0){E.isTexture!==!0&&(xs("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,E=arguments[1],H=arguments[2],V=arguments[3]||0,j=null);let yt,Ct,Nt,zt,$t,qt,Ft,ne,re;const le=E.isCompressedTexture?E.mipmaps[V]:E.image;j!==null?(yt=j.max.x-j.min.x,Ct=j.max.y-j.min.y,Nt=j.isBox3?j.max.z-j.min.z:1,zt=j.min.x,$t=j.min.y,qt=j.isBox3?j.min.z:0):(yt=le.width,Ct=le.height,Nt=le.depth||1,zt=0,$t=0,qt=0),Q!==null?(Ft=Q.x,ne=Q.y,re=Q.z):(Ft=0,ne=0,re=0);const Le=kt.convert(H.format),te=kt.convert(H.type);let Ot;H.isData3DTexture?(w.setTexture3D(H,0),Ot=k.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(w.setTexture2DArray(H,0),Ot=k.TEXTURE_2D_ARRAY):(w.setTexture2D(H,0),Ot=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,H.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,H.unpackAlignment);const cn=k.getParameter(k.UNPACK_ROW_LENGTH),se=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Ze=k.getParameter(k.UNPACK_SKIP_PIXELS),Gn=k.getParameter(k.UNPACK_SKIP_ROWS),Ae=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,le.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,le.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,zt),k.pixelStorei(k.UNPACK_SKIP_ROWS,$t),k.pixelStorei(k.UNPACK_SKIP_IMAGES,qt);const ii=E.isDataArrayTexture||E.isData3DTexture,de=H.isDataArrayTexture||H.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const Qe=ft.get(E),si=ft.get(H),Ie=ft.get(Qe.__renderTarget),Ne=ft.get(si.__renderTarget);Y.bindFramebuffer(k.READ_FRAMEBUFFER,Ie.__webglFramebuffer),Y.bindFramebuffer(k.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let ln=0;ln<Nt;ln++)ii&&k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ft.get(E).__webglTexture,V,qt+ln),E.isDepthTexture?(de&&k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ft.get(H).__webglTexture,V,re+ln),k.blitFramebuffer(zt,$t,yt,Ct,Ft,ne,yt,Ct,k.DEPTH_BUFFER_BIT,k.NEAREST)):de?k.copyTexSubImage3D(Ot,V,Ft,ne,re+ln,zt,$t,yt,Ct):k.copyTexSubImage2D(Ot,V,Ft,ne,re+ln,zt,$t,yt,Ct);Y.bindFramebuffer(k.READ_FRAMEBUFFER,null),Y.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else de?E.isDataTexture||E.isData3DTexture?k.texSubImage3D(Ot,V,Ft,ne,re,yt,Ct,Nt,Le,te,le.data):H.isCompressedArrayTexture?k.compressedTexSubImage3D(Ot,V,Ft,ne,re,yt,Ct,Nt,Le,le.data):k.texSubImage3D(Ot,V,Ft,ne,re,yt,Ct,Nt,Le,te,le):E.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,V,Ft,ne,yt,Ct,Le,te,le.data):E.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,V,Ft,ne,le.width,le.height,Le,le.data):k.texSubImage2D(k.TEXTURE_2D,V,Ft,ne,yt,Ct,Le,te,le);k.pixelStorei(k.UNPACK_ROW_LENGTH,cn),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,se),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Ze),k.pixelStorei(k.UNPACK_SKIP_ROWS,Gn),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Ae),V===0&&H.generateMipmaps&&k.generateMipmap(Ot),Y.unbindTexture()},this.copyTextureToTexture3D=function(E,H,j=null,Q=null,V=0){return E.isTexture!==!0&&(xs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),j=arguments[0]||null,Q=arguments[1]||null,E=arguments[2],H=arguments[3],V=arguments[4]||0),xs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,H,j,Q,V)},this.initRenderTarget=function(E){ft.get(E).__webglFramebuffer===void 0&&w.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?w.setTextureCube(E,0):E.isData3DTexture?w.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?w.setTexture2DArray(E,0):w.setTexture2D(E,0),Y.unbindTexture()},this.resetState=function(){A=0,C=0,L=null,Y.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ie._getDrawingBufferColorSpace(t),e.unpackColorSpace=ie._getUnpackColorSpace()}}class Mx extends Se{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class yx{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Io,this.updateRanges=[],this.version=0,this.uuid=Qn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ze=new X;class Ra{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=En(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ce(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=En(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=En(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=En(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=En(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),s=ce(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=ce(e,this.array),n=ce(n,this.array),s=ce(s,this.array),a=ce(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new xn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ra(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ud extends Ei{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new jt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Vi;const ps=new X,Xi=new X,Wi=new X,$i=new Kt,ms=new Kt,Fd=new me,Qs=new X,gs=new X,ta=new X,kl=new Kt,Ar=new Kt,Ul=new Kt;class Sx extends Se{constructor(t=new Ud){if(super(),this.isSprite=!0,this.type="Sprite",Vi===void 0){Vi=new Ye;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new yx(e,5);Vi.setIndex([0,1,2,0,2,3]),Vi.setAttribute("position",new Ra(n,3,0,!1)),Vi.setAttribute("uv",new Ra(n,2,3,!1))}this.geometry=Vi,this.material=t,this.center=new Kt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Xi.setFromMatrixScale(this.matrixWorld),Fd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Wi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Xi.multiplyScalar(-Wi.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;ea(Qs.set(-.5,-.5,0),Wi,r,Xi,s,a),ea(gs.set(.5,-.5,0),Wi,r,Xi,s,a),ea(ta.set(.5,.5,0),Wi,r,Xi,s,a),kl.set(0,0),Ar.set(1,0),Ul.set(1,1);let o=t.ray.intersectTriangle(Qs,gs,ta,!1,ps);if(o===null&&(ea(gs.set(-.5,.5,0),Wi,r,Xi,s,a),Ar.set(0,1),o=t.ray.intersectTriangle(Qs,ta,gs,!1,ps),o===null))return;const c=t.ray.origin.distanceTo(ps);c<t.near||c>t.far||e.push({distance:c,point:ps.clone(),uv:Ke.getInterpolation(ps,Qs,gs,ta,kl,Ar,Ul,new Kt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function ea(i,t,e,n,s,a){$i.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(ms.x=a*$i.x-s*$i.y,ms.y=s*$i.x+a*$i.y):ms.copy($i),i.copy(t),i.x+=ms.x,i.y+=ms.y,i.applyMatrix4(Fd)}class sc extends Ei{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new jt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ca=new X,Pa=new X,Fl=new me,_s=new tc,na=new Ua,Tr=new X,Nl=new X;class bx extends Se{constructor(t=new Ye,e=new sc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,a=e.count;s<a;s++)Ca.fromBufferAttribute(e,s-1),Pa.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Ca.distanceTo(Pa);t.setAttribute("lineDistance",new be(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),na.copy(n.boundingSphere),na.applyMatrix4(s),na.radius+=a,t.ray.intersectsSphere(na)===!1)return;Fl.copy(s).invert(),_s.copy(t.ray).applyMatrix4(Fl);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,p=n.attributes.position;if(h!==null){const d=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let _=d,m=g-1;_<m;_+=l){const u=h.getX(_),x=h.getX(_+1),S=ia(this,t,_s,c,u,x);S&&e.push(S)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(d),u=ia(this,t,_s,c,_,m);u&&e.push(u)}}else{const d=Math.max(0,r.start),g=Math.min(p.count,r.start+r.count);for(let _=d,m=g-1;_<m;_+=l){const u=ia(this,t,_s,c,_,_+1);u&&e.push(u)}if(this.isLineLoop){const _=ia(this,t,_s,c,g-1,d);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function ia(i,t,e,n,s,a){const r=i.geometry.attributes.position;if(Ca.fromBufferAttribute(r,s),Pa.fromBufferAttribute(r,a),e.distanceSqToSegment(Ca,Pa,Tr,Nl)>n)return;Tr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Tr);if(!(c<t.near||c>t.far))return{distance:c,point:Nl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const zl=new X,Ol=new X;class Nd extends bx{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,a=e.count;s<a;s+=2)zl.fromBufferAttribute(e,s),Ol.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+zl.distanceTo(Ol);t.setAttribute("lineDistance",new be(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ex extends Ve{constructor(t,e,n,s,a,r,o,c,l){super(t,e,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ac extends Ye{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const a=[],r=[];o(s),l(n),h(),this.setAttribute("position",new be(a,3)),this.setAttribute("normal",new be(a.slice(),3)),this.setAttribute("uv",new be(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const S=new X,v=new X,D=new X;for(let A=0;A<e.length;A+=3)d(e[A+0],S),d(e[A+1],v),d(e[A+2],D),c(S,v,D,x)}function c(x,S,v,D){const A=D+1,C=[];for(let L=0;L<=A;L++){C[L]=[];const b=x.clone().lerp(v,L/A),y=S.clone().lerp(v,L/A),P=A-L;for(let B=0;B<=P;B++)B===0&&L===A?C[L][B]=b:C[L][B]=b.clone().lerp(y,B/P)}for(let L=0;L<A;L++)for(let b=0;b<2*(A-L)-1;b++){const y=Math.floor(b/2);b%2===0?(p(C[L][y+1]),p(C[L+1][y]),p(C[L][y])):(p(C[L][y+1]),p(C[L+1][y+1]),p(C[L+1][y]))}}function l(x){const S=new X;for(let v=0;v<a.length;v+=3)S.x=a[v+0],S.y=a[v+1],S.z=a[v+2],S.normalize().multiplyScalar(x),a[v+0]=S.x,a[v+1]=S.y,a[v+2]=S.z}function h(){const x=new X;for(let S=0;S<a.length;S+=3){x.x=a[S+0],x.y=a[S+1],x.z=a[S+2];const v=m(x)/2/Math.PI+.5,D=u(x)/Math.PI+.5;r.push(v,1-D)}g(),f()}function f(){for(let x=0;x<r.length;x+=6){const S=r[x+0],v=r[x+2],D=r[x+4],A=Math.max(S,v,D),C=Math.min(S,v,D);A>.9&&C<.1&&(S<.2&&(r[x+0]+=1),v<.2&&(r[x+2]+=1),D<.2&&(r[x+4]+=1))}}function p(x){a.push(x.x,x.y,x.z)}function d(x,S){const v=x*3;S.x=t[v+0],S.y=t[v+1],S.z=t[v+2]}function g(){const x=new X,S=new X,v=new X,D=new X,A=new Kt,C=new Kt,L=new Kt;for(let b=0,y=0;b<a.length;b+=9,y+=6){x.set(a[b+0],a[b+1],a[b+2]),S.set(a[b+3],a[b+4],a[b+5]),v.set(a[b+6],a[b+7],a[b+8]),A.set(r[y+0],r[y+1]),C.set(r[y+2],r[y+3]),L.set(r[y+4],r[y+5]),D.copy(x).add(S).add(v).divideScalar(3);const P=m(D);_(A,y+0,x,P),_(C,y+2,S,P),_(L,y+4,v,P)}}function _(x,S,v,D){D<0&&x.x===1&&(r[S]=x.x-1),v.x===0&&v.z===0&&(r[S]=D/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function u(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ac(t.vertices,t.indices,t.radius,t.details)}}const sa=new X,aa=new X,Rr=new X,ra=new Ke;class wx extends Ye{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(pa*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],h=["a","b","c"],f=new Array(3),p={},d=[];for(let g=0;g<c;g+=3){r?(l[0]=r.getX(g),l[1]=r.getX(g+1),l[2]=r.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:u}=ra;if(_.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),u.fromBufferAttribute(o,l[2]),ra.getNormal(Rr),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(u.x*s)},${Math.round(u.y*s)},${Math.round(u.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const S=(x+1)%3,v=f[x],D=f[S],A=ra[h[x]],C=ra[h[S]],L=`${v}_${D}`,b=`${D}_${v}`;b in p&&p[b]?(Rr.dot(p[b].normal)<=a&&(d.push(A.x,A.y,A.z),d.push(C.x,C.y,C.z)),p[b]=null):L in p||(p[L]={index0:l[x],index1:l[S],normal:Rr.clone()})}}for(const g in p)if(p[g]){const{index0:_,index1:m}=p[g];sa.fromBufferAttribute(o,_),aa.fromBufferAttribute(o,m),d.push(sa.x,sa.y,sa.z),d.push(aa.x,aa.y,aa.z)}this.setAttribute("position",new be(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class rc extends ac{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new rc(t.radius,t.detail)}}class Zi extends Ye{constructor(t=.5,e=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let f=t;const p=(e-t)/s,d=new X,g=new Kt;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const u=a+m/n*r;d.x=f*Math.cos(u),d.y=f*Math.sin(u),c.push(d.x,d.y,d.z),l.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,h.push(g.x,g.y)}f+=p}for(let _=0;_<s;_++){const m=_*(n+1);for(let u=0;u<n;u++){const x=u+m,S=x,v=x+n+1,D=x+n+2,A=x+1;o.push(S,v,A),o.push(v,D,A)}}this.setIndex(o),this.setAttribute("position",new be(c,3)),this.setAttribute("normal",new be(l,3)),this.setAttribute("uv",new be(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class za extends Ye{constructor(t=1,e=.4,n=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:a},n=Math.floor(n),s=Math.floor(s);const r=[],o=[],c=[],l=[],h=new X,f=new X,p=new X;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const _=g/s*a,m=d/n*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(_),f.y=(t+e*Math.cos(m))*Math.sin(_),f.z=e*Math.sin(m),o.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),p.subVectors(f,h).normalize(),c.push(p.x,p.y,p.z),l.push(g/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const _=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,u=(s+1)*(d-1)+g,x=(s+1)*d+g;r.push(_,m,x),r.push(m,u,x)}this.setIndex(r),this.setAttribute("position",new be(o,3)),this.setAttribute("normal",new be(c,3)),this.setAttribute("uv",new be(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new za(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ws extends Ei{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_d,this.normalScale=new Kt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=Yo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class zd extends Se{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new jt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Ax extends zd{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Se.DEFAULT_UP),this.updateMatrix(),this.groundColor=new jt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Cr=new me,Bl=new X,Hl=new X;class Tx{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Kt(512,512),this.map=null,this.mapPass=null,this.matrix=new me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new nc,this._frameExtents=new Kt(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Bl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Bl),Hl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Hl),e.updateMatrixWorld(),Cr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Cr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Cr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Rx extends Tx{constructor(){super(new Cd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Cx extends zd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Se.DEFAULT_UP),this.updateMatrix(),this.target=new Se,this.shadow=new Rx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Gl=new me;class Px{constructor(t,e,n=0,s=1/0){this.ray=new tc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ec,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Gl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Gl),this}intersectObject(t,e=!0,n=[]){return Fo(t,this,n,e),n.sort(Vl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,a=t.length;s<a;s++)Fo(t[s],this,n,e);return n.sort(Vl),n}}function Vl(i,t){return i.distance-t.distance}function Fo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const a=i.children;for(let r=0,o=a.length;r<o;r++)Fo(a[r],t,e,!0)}}class Dx extends Nd{constructor(t=10,e=10,n=4473924,s=8947848){n=new jt(n),s=new jt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let p=0,d=0,g=-o;p<=e;p++,g+=r){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=p===a?n:s;_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3}const h=new Ye;h.setAttribute("position",new be(c,3)),h.setAttribute("color",new be(l,3));const f=new sc({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$o}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$o);const Lx={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function Ix(i,t,e,n){const s=new nn(i.fov,n,.1,200),a=new X,r=new X,o=new X;let c=!1,l=i.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function p(){const d=(i.pitchDeg+h.pitchDelta)*Math.PI/180,g=i.yawDeg*Math.PI/180;o.set(Math.sin(g)*Math.cos(d),Math.sin(d),Math.cos(g)*Math.cos(d)).multiplyScalar(i.distance*h.distanceScale*h.zoom)}return p(),{camera:s,update(d,g,_,m,u=Lx){const x=g+.6;if(!c)a.set(d,x,_),c=!0;else{const D=1-Math.exp(-Math.max(i.smoothing,.001)*m);a.x+=(d-a.x)*D,a.y+=(x-a.y)*D,a.z+=(_-a.z)*D}const S=1-Math.exp(-Math.max(t.smoothing,.001)*m);h.distanceScale+=(u.distanceScale-h.distanceScale)*S,h.offsetX+=(u.offsetX-h.offsetX)*S,h.offsetZ+=(u.offsetZ-h.offsetZ)*S,h.pitchDelta+=(u.pitchDelta-h.pitchDelta)*S;const v=1-Math.exp(-Math.max(e.smoothing,.001)*m);h.zoom+=(f-h.zoom)*v,p(),(s.fov!==l||s.fov!==i.fov)&&(s.fov=i.fov,l=i.fov,s.updateProjectionMatrix()),r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(d){s.aspect=d,s.updateProjectionMatrix()},getGroundBasis(){const d=new X().setFromMatrixColumn(s.matrixWorld,0),g=new X().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(d.x,d.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:d.x/_,rightZ:d.z/_,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(d){f=Number.isFinite(d)&&d>0?d:1},smart(){return{...h}}}}const Mi=Math.PI*2,mn=1e-6;function ni(i,t,e){return i<t?t:i>e?e:i}function Od(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function kx(i){if(i<=Math.PI)return 1-2*i/Math.PI;const t=(i-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Bd(i,t){const e=Math.cos(i),n=t<=0?0:t>=1?1:t;if(n===0)return e;const s=kx(i);return n===1?s:e+(s-e)*n}function Xl(i){return(1-Math.sin(i))/2}function oc(i,t){if(!i.grounded||i.speed<mn)return Od();const e=i.speed/Math.max(i.moveSpeed,mn),n=Math.max(i.legLength,mn),s=i.stride>mn?i.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*n,a=Math.min(t.maxAmp,s/n),r=n*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(i.localForward),c=Math.abs(i.localRight),l=o+c+mn,h=o/l,f=c/l,p=i.localForward>=0?1:-1,d=i.localRight>=0?1:-1,g=s,_=U=>Math.asin(ni(U,-r,r)/n);function m(U,W){const R=Bd(U,t.plantLock),T=Xl(U),O=p*h*g*R,F=-_(O),$=W*d>0?1:-1,at=1+$*t.crossStep*.45,ut=d*$*t.crossStep*g*.4*T,ot=d*f*g*t.sideWeight*at*R+ut*f,vt=_(ot),q=t.kneeLift*T*a*(.55+.25*h+($>0?.2*f:0));return{pitchX:F,rollZ:vt,kneeX:q}}const u=(i.phase%Mi+Mi)%Mi,x=m(u,-1),S=m((u+Math.PI)%Mi,1),v=Math.cos(u),D=Xl(u),A=-t.comSway*a*v*(.6*h+.8*f)-d*t.comSway*a*f*.45,C=t.comBob*D*a,L=d*t.hipLean*a*f*v*.6,b=d*t.hipLean*a*f*(.45+.25*v),y=t.armSwing*a*v*(h*p+.3*f),P=y,B=-y;return{legL:x,legR:S,pelvisX:A,pelvisY:C,pelvisRoll:L,sideLean:b,armL:P,armR:B,strafe:f,backward:p<0?h:0}}function Hd(i){const t=(i%Mi+Mi)%Mi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Gd(i,t,e){const n=ni(e.progress,0,1);if(n>=1||i.speed<mn)return Od();const s=n*n*(3-2*n),a=1-s;return oc({...i,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:i.speed*a,stride:i.stride*a},t)}function Vd(i,t,e,n){const s=ni(i,-1,1),a=Math.abs(s),r=Math.min(1,t*(1+Math.max(0,n)*a*a));return ni(r*s,-1,1)*(e*Math.PI/180)}function Xd(i,t,e,n,s){const a=Math.max(e,mn),r=Math.max(0,n)*a,o=Math.max(0,s)*a,c=t>mn?(t-i)/t:0,l=c>.02,h=c<-.015,f=i<=r*.15,p=!h&&i<o&&(l||f);return{enter:i>mn&&i<=r&&l,resume:!p}}function Wd(i,t,e){const n=Math.max(0,e)*(Math.PI/180);return ni(i*ni(t,0,2),-n,n)}function $d(i,t,e,n,s){const a=ni(i,0,1),r=ni(s.stopPeakRatio,.05,.95),o=a<=r?a/r:(a-r)/(1-r),c=o*o*(3-2*o),l=a<=r?c:1-c,h=Math.hypot(e,n),f=h>mn?e/h:1,p=h>mn?n/h:0,d=Bd(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*l,trailPitch:Math.max(0,s.stopTrailPitch)*l,leadKnee:Math.max(0,s.stopStepKnee)*l,bodyShift:Math.max(0,s.stopBodyShift)*l,chestPitch:Math.max(0,s.stopChestPitch)*l,leadLeft:d,fwdN:f,rightN:p,env:l}}function Ge(i){return i<0?0:i>1?1:i}const ga=Math.PI*2;function Ux(i){return((i+Math.PI)%ga+ga)%ga-Math.PI}function Fx(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function Nx(i,t,e,n,s,a=i.phase){const r=Ge(n);if(r<=0)return i;const o=Ge(t),c=Math.max(1,Math.round(s.cycles)),l=Math.max(0,s.strideSpeed),h=e%2===0?1:-1,f=Ge(s.forwardBias),p=Math.max(0,i.stride??0),d=Math.max(0,s.strideScale??0)*p,g=o<=.5?o*2:(o-.5)*2,_=g*g*(3-2*g),m=o<=.5?_:1-_,u={speed:l,phase:a+ga*c/2*m,localForward:l*f,localRight:l*(1-f)*h},x=Ux(u.phase-i.phase),S=r*r*(3-2*r);return{speed:i.speed+(u.speed-i.speed)*r,phase:i.phase+x*S,localForward:i.localForward+(u.localForward-i.localForward)*r,localRight:i.localRight+(u.localRight-i.localRight)*r,stride:d*r*r}}function zx(i,t,e){const n=Fx(),s=Ge(i),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return n;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return n.legL.pitchX=o?-l:l*.55,n.legR.pitchX=c?-l:l*.55,n.legL.kneeX=o?h:h*.4,n.legR.kneeX=c?h:h*.4,n.legL.rollZ=-f*r,n.legR.rollZ=f*r,n.pelvisX=e.stepSway*a*r,n.pelvisY=-e.stepDip*a,n.pelvisRoll=f*.25*r,n}function Yd(i,t){if(i<=0||i>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return i<e?Math.sin(Math.PI/2*(i/e)):Math.cos(Math.PI/2*((i-e)/(1-e)))}function Wl(i,t,e,n,s){if(e<=0||n<=0)return 0;const a=(i-t)/e;return a<0||a>=1?0:n*Yd(a,s)}function Ox(i,t,e,n){const s=t?1:0,a=1-Math.exp(-Math.max(0,n)*Math.max(0,e)),r=i+(s-i)*a;return t&&r>.999?1:!t&&r<.001?0:r}function Bx(i,t,e){const n=Ge(i);return{gaitScale:1-n*(1-Ge(t)),attackLegWeight:Ge(e)*n}}function Hx(i,t){const e=Ge(t);return e===1?i:{legL:{pitchX:i.legL.pitchX*e,rollZ:i.legL.rollZ*e,kneeX:i.legL.kneeX*e},legR:{pitchX:i.legR.pitchX*e,rollZ:i.legR.rollZ*e,kneeX:i.legR.kneeX*e},pelvisX:i.pelvisX*e,pelvisY:i.pelvisY*e,pelvisRoll:i.pelvisRoll*e,sideLean:i.sideLean*e,armL:i.armL*e,armR:i.armR*e,strafe:i.strafe,backward:i.backward}}function Gx(i,t){const e=Math.min(1,Math.abs(i)/Math.max(t.impactSpeed,1e-6));return Ge(t.minScale+(1-t.minScale)*e)}function Vx(){return Zd()}function Zd(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function Xx(i,t){return i.type==="light"?Math.max(0,t.leanLight):i.type==="heavy"?Math.max(0,t.leanHeavy):i.type==="knock"?Math.max(0,t.leanKnock):0}function Wx(i,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Ge(t.forceHitHeight):i.type==="light"?Ge(t.hitHeight.light):i.type==="heavy"?Ge(t.hitHeight.heavy):i.type==="knock"?Ge(t.hitHeight.knock):0}function $x(i,t,e){const n=Ge(e),s=(a,r)=>a+(r-a)*n;return{upperPitch:s(i.upperPitch,t.upperPitch),upperRoll:s(i.upperRoll,t.upperRoll),upperYaw:s(i.upperYaw,t.upperYaw),fold:s(i.fold,t.fold),shift:s(i.shift,t.shift),drop:s(i.drop,t.drop),back:s(i.back,t.back),knee:s(i.knee,t.knee),hip:s(i.hip,t.hip),arm:s(i.arm,t.arm)}}function qd(i,t,e){const n=Zd(),s=Xx(i,e);if(n.intensity=s,s<=0||i.duration<=0||!Number.isFinite(i.timer))return n;const a=Ge(1-i.timer/i.duration),r=Yd(a,e.pulseRatio);n.pulse=r,n.active=r>0,n.hitHeight=Wx(i,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),f=i.dirX*o+i.dirZ*c,p=i.dirX*l+i.dirZ*h;if(n.localFwd=f,n.localRight=p,!e.enabled){n.legacy=!0;const _=Math.sin(Math.PI*a);return n.upperPitch=s*_*f,n.upperRoll=-s*_*p*.7,n.drop=(s>.5?.09:.04)*_,n.flash=e.flashStrength*_,n.active=_>0,n}const d=s*r,g=$x(e.abdomen,e.shoulder,n.hitHeight);return n.upperPitch=d*(g.upperPitch*f+g.fold),n.upperRoll=-d*g.upperRoll*p,n.upperYaw=d*g.upperYaw*p,n.upperShift=d*g.shift,n.upperShiftX=n.upperShift*p,n.upperShiftZ=n.upperShift*f,n.comShift=d*e.comShift,n.comX=n.comShift*p,n.comZ=n.comShift*f,n.pelvisBack=d*g.back,n.drop=d*g.drop,n.knee=d*g.knee,n.hip=d*g.hip,n.arm=d*g.arm,n.flash=e.flashStrength*r,n}function jd(i,t){const e=Math.max(0,t.pelvisTiltGain),n=Math.max(0,t.pelvisShift),s=Number.isFinite(i.leanForward)?i.leanForward:0,a=Number.isFinite(i.leanSide)?i.leanSide:0,r=Number.isFinite(i.speedRatio)?Math.max(0,Math.min(1,i.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*n,pelvisZ:s*n,crouch:Math.max(0,t.moveCrouch)*r}}const ui=1e-6;function ys(i,t,e){return i<t?t:i>e?e:i}function Yx(i,t,e,n=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=ui||a<=ui||!Number.isFinite(i.x)||!Number.isFinite(i.y)||!Number.isFinite(i.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+ui,l=Math.hypot(i.x,i.y,i.z);if(l<=ui)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(i.x,-i.y),f=Math.hypot(i.x,i.y),p=i.z,d=Math.hypot(p,f),g=ys(d,c,o),_=d>o+ui||d<c-ui,m=Math.atan2(-p,Math.max(f,ui)),u=ys((s*s+g*g-a*a)/(2*s*g),-1,1),x=ys((a*a+g*g-s*s)/(2*a*g),-1,1),S=Math.acos(u),v=Math.acos(x),D=n>=0?1:-1;return{rootPitch:m-D*S,rootRoll:h,jointPitch:D*(S+v),clamped:_,reach:l/o}}function Zx(i,t,e,n){const s=ys(e,0,1),a=Math.max(0,n),r=(o,c)=>{const l=ys((c-o)*s,-a,a);return o+l};return{rootPitch:r(i.rootPitch,t.rootPitch),rootRoll:r(i.rootRoll,t.rootRoll),jointPitch:r(i.jointPitch,t.jointPitch)}}function Kd(i,t){return{pelvisPos:i.position.clone(),pelvisRotX:i.rotation.x,pelvisRotZ:i.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const cc={active:!1,weight:0,clamped:0,maxError:0};function Jd(i){const{root:t,pelvis:e,lower:n,limbs:s,base:a,cfg:r}=i;if(!r.enabled||r.weight<=0||!i.grounded||s.length===0)return{...cc};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:n.position.clone(),lowerRotZ:n.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,n.position.copy(a.lowerPos),n.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(d=>d.tip.getWorldPosition(new X));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,n.position.copy(o.lowerPos),n.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),n.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(i.attacking?Math.max(0,Math.min(1,r.attackScale)):1),h=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let f=0;for(let d=0;d<s.length;d++){const g=s[d],_=n.worldToLocal(c[d].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},u=Yx(m,g.upperLen,g.lowerLen,g.bend);u.clamped&&(f+=1);const x=Zx({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},u,l,h);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let p=0;for(let d=0;d<s.length;d++){const g=s[d].tip.getWorldPosition(new X);p=Math.max(p,g.distanceTo(c[d]))}return{active:!0,weight:l,clamped:f,maxError:p}}function yn(i,t,e){return i<t?t:i>e?e:i}const qx={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function jx(i,t,e,n,s,a,r,o,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new De,p=new De;p.name="pelvis",p.position.y=i.legLength,f.add(p);const d=new De;d.name="lower";const g=new De;g.name="upper",p.add(d),p.add(g);const _=[],m=(G,K,it,nt)=>{const _t=new ws({color:nt}),It=new pe(new Cn(G,K,it),_t);return It.castShadow=!0,It.receiveShadow=!0,_.push(_t),It},u=i.headSize,x=i.legLength,S=i.armLength,v=i.limbThickness,D=i.bodyHeight,A=i.bodyWidth,C=m(A,D,.28,e);C.position.y=D/2,g.add(C);const L=new De;L.name="headPivot",L.position.y=D,g.add(L);const b=m(u,u,u,e);b.position.y=u/2,L.add(b);for(const G of[-1,1]){const K=m(.06,.07,.02,t.shoe);K.position.set(G*.09,u/2+.03,u/2+.011),L.add(K)}const y=(G,K)=>{const it=K?S:x,nt=new De;nt.name=K?G<0?"shoulderL":"shoulderR":G<0?"hipL":"hipR",K||(nt.rotation.order="ZYX"),nt.position.set(G*(K?A/2+v/2:A/2-v/2),K?D-.04:0,0),(K?g:d).add(nt);const _t=m(v,it/2,v,t.limb);_t.position.y=-it/4,nt.add(_t);const It=new De;It.name=K?"elbow":"knee",It.position.y=-it/2,nt.add(It);const pt=m(v,it/2,v,t.limb);if(pt.position.y=-it/4,It.add(pt),!K){const Et=m(v*1.15,.07,v*1.7,t.shoe);Et.position.set(0,-it/2+.035,.045),It.add(Et);const N=new Se;return N.name="footTip",N.position.y=-it/2,It.add(N),{root:nt,joint:It,tip:N}}return{root:nt,joint:It}},P=y(-1,!1),B=y(1,!1),U=y(-1,!0),W=y(1,!0),R=[P,B].map(G=>({root:G.root,joint:G.joint,tip:G.tip,upperLen:x/2,lowerLen:x/2,bend:1})),T=new Sn({color:s.attackArcColor,transparent:!0,opacity:0,side:He,depthWrite:!1}),O=new pe(new za(.62,.042,6,20,Math.PI*1.1),T);O.position.set(0,.78-x,.56),g.add(O);const F=document.createElement("canvas");F.width=256,F.height=72;const $=F.getContext("2d"),at=new Ex(F),ut=new Ud({map:at,transparent:!0,depthTest:!1,depthWrite:!1}),ot=new Sx(ut);ot.scale.set(1.85,.52,1),ot.position.y=1.7-x,ot.renderOrder=20,g.add(ot);function vt(G){$&&($.clearRect(0,0,256,72),$.fillStyle=s.labelBg,$.fillRect(0,0,256,72),$.strokeStyle=e,$.lineWidth=5,$.strokeRect(3,3,250,66),$.fillStyle=e,$.font="bold 29px ui-monospace, Menlo, Consolas, monospace",$.textAlign="center",$.textBaseline="middle",$.fillText(`${n} ${qx[G]}`,128,38),at.needsUpdate=!0)}const q=new jt(e),J=new jt(o.flashColor),ct=new jt;let lt=null,gt=0,At=0,Dt=0,Xt=0,Rt=0,Tt=0,k=0,ae={...cc},Pt=-1,Lt=0,Y=0,ht=0,ft=0,w=0,M=0,z=0,tt=0;return{group:f,update(G,K){f.position.set(G.position.x,G.position.y,G.position.z),f.rotation.y=G.bodyYaw,L.rotation.y=(G.headYaw-G.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,G.mode!==lt&&(lt=G.mode,vt(G.mode),gt=1),gt=Math.max(0,gt-K*2.2);const it=G.hurt,nt=qd(it,G.bodyYaw,o),_t=nt.flash;ct.copy(J).multiplyScalar(_t);for(const mt of _)mt.emissive.copy(q).multiplyScalar(gt*.5),_t>0&&mt.emissive.add(ct);p.position.set(0,x,0),p.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),d.position.set(0,0,0),d.rotation.z=0;const It=Math.hypot(G.velocity.x,G.velocity.z),pt=Math.cos(G.bodyYaw),Et=-Math.sin(G.bodyYaw),N=It>1e-6?yn((G.velocity.x*pt+G.velocity.z*Et)/It,-1,1):0,rt=Vd(N,r.strafeHipScale,r.strafeHipMaxDeg,r.strafeHipBoost);z+=(rt-z)*(1-Math.exp(-12*Math.max(0,K))),d.rotation.y=z;const dt=G.bodyYaw+z,Ut=Math.sin(dt),kt=Math.cos(dt),Gt=Math.cos(dt),I=-Math.sin(dt),xt=G.velocity.x*Ut+G.velocity.z*kt,Z=G.velocity.x*Gt+G.velocity.z*I,st=Math.max(0,r.stopBlendSec||0),bt=st>0,St=Xd(It,tt,a,r.stopEnterRatio,r.stopExitRatio);!bt||St.resume?Pt=-1:Pt<0&&St.enter&&(Pt=0,Lt=G.gaitPhase,Y=Hd(G.gaitPhase),ht=It,ft=Math.max(G.stride,1e-6),w=xt,M=Z),tt=It;const Bt=bt&&Pt>=0;Bt&&(Pt=Math.min(1,Pt+K/st));const ee=Bt?{phase:Lt,speed:ht,moveSpeed:a,localForward:w,localRight:M,legLength:i.legLength,stride:ft,grounded:!0}:{phase:G.gaitPhase,speed:It,moveSpeed:a,localForward:xt,localRight:Z,legLength:i.legLength,stride:G.stride,grounded:!0},Vt=Bt?Gd(ee,r,{progress:Pt,phase0:Lt,phaseEnd:Y}):oc(ee,r);let Wt=0,ge=0,ye=0;if(Bt){const mt=$d(Pt,Lt,w,M,r);mt.leadLeft?(Vt.legL.pitchX-=mt.leadPitch,Vt.legL.kneeX+=mt.leadKnee,Vt.legR.pitchX+=mt.trailPitch):(Vt.legR.pitchX-=mt.leadPitch,Vt.legR.kneeX+=mt.leadKnee,Vt.legL.pitchX+=mt.trailPitch),ge=mt.bodyShift*mt.fwdN,Wt=mt.bodyShift*mt.rightN,ye=mt.chestPitch}P.root.rotation.x=Vt.legL.pitchX,B.root.rotation.x=Vt.legR.pitchX,P.root.rotation.z=Vt.legL.rollZ,B.root.rotation.z=Vt.legR.rollZ,P.joint.rotation.x=Vt.legL.kneeX,B.joint.rotation.x=Vt.legR.kneeX,U.root.rotation.x=Vt.armL,W.root.rotation.x=Vt.armR,U.joint.rotation.x=-.18,W.joint.rotation.x=-.18,p.position.x=Vt.pelvisX+Wt,p.position.y=x+Vt.pelvisY,p.position.z=ge,p.rotation.z=Vt.pelvisRoll,g.rotation.z=Vt.sideLean*(nt.intensity>0?.4:1);const rn=Kd(p,d);if(c){const mt=Math.max(.004166666666666667,Math.min(K,.1)),Ht=Math.sin(G.bodyYaw),Zt=Math.cos(G.bodyYaw),Yt=yn((G.velocity.x-At)/mt,-60,60),ue=yn((G.velocity.z-Dt)/mt,-60,60),we=Yt*Ht+ue*Zt,on=Tn(G.bodyYaw-Xt)/mt,fe=c.maxForwardDeg*Math.PI/180,Fe=c.maxSideDeg*Math.PI/180,E=1-Math.exp(-Math.max(0,c.smoothing)*mt);Rt+=(yn(we*c.accelGain,-fe,fe)-Rt)*E,Tt+=(yn(-on*It*c.turnGain,-Fe,Fe)-Tt)*E;const H=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;k+=(yn(It/Math.max(a,1e-6),0,1)-k)*(1-Math.exp(-Math.max(0,H)*mt));const j=jd({leanForward:Rt,leanSide:Tt,speedRatio:k},c);g.rotation.x+=Rt+ye,g.rotation.z+=Tt,p.rotation.x+=j.pelvisPitch,p.rotation.z+=j.pelvisRoll,p.position.x+=j.pelvisX,p.position.z+=j.pelvisZ,p.position.y-=j.crouch;const Q=h.enabled?yn(h.weight,0,1):0;d.position.y+=j.crouch*(1-Q)}At=G.velocity.x,Dt=G.velocity.z,Xt=G.bodyYaw,g.rotation.x+=nt.upperPitch,g.rotation.z+=nt.upperRoll,g.rotation.y+=nt.upperYaw;const Je=yn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),he=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=yn(nt.upperShiftX*Je,-he,he),g.position.z+=yn(nt.upperShiftZ*Je,-he,he),p.position.x+=nt.comX,p.position.z+=nt.comZ-nt.pelvisBack,p.position.y-=nt.drop;const et=nt.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(d.position.z+=nt.pelvisBack*(1-et),d.position.y+=nt.drop*(1-et),P.joint.rotation.x+=nt.knee,B.joint.rotation.x+=nt.knee,P.root.rotation.x-=nt.hip,B.root.rotation.x-=nt.hip,U.root.rotation.x+=nt.arm,W.root.rotation.x+=nt.arm*.8,G.attackPhase!=="idle"&&nt.intensity===0){const mt=G.attackProgress,Ht=mt<.34?-1:mt<.68?-1+(mt-.34)/.34*2:Math.max(0,1-(mt-.68)/.32),Zt=Math.max(0,-Ht),Yt=Math.max(0,Ht);W.root.rotation.x=-1.7*Zt+1.25*Yt,W.joint.rotation.x=-(.25+Zt*.45),g.rotation.y=-.28*Ht,T.opacity=G.attackPhase==="active"?.85:0,G.attackPhase==="active"&&(O.rotation.z=-1.1+mt*3)}else T.opacity=0;const Mt=Wd(z,r.chestYawScale,r.chestYawMaxDeg);g.rotation.y+=Mt,L.rotation.y=(G.headYaw-G.bodyYaw-Mt+Math.PI*3)%(Math.PI*2)-Math.PI,ae=Jd({root:f,pelvis:p,lower:d,limbs:R,base:rn,cfg:h,grounded:!0,attacking:G.attackPhase!=="idle"})},ik(){return ae},dispose(){f.traverse(G=>{if(G instanceof pe){G.geometry.dispose();const K=G.material;Array.isArray(K)?K.forEach(it=>it.dispose()):K.dispose()}}),at.dispose(),ut.dispose()}}}function Qd(i){return{x:0,y:0,z:1}}function Kx(i){return Math.asin(Qd().y)}function Jx(i,t){const e=Math.cos(t),n=Math.sin(t);return{x:i.x*e+i.z*n,y:i.y,z:-0*n+i.z*e}}function Oe(i,t,e){return i<t?t:i>e?e:i}const Pr=1e-6;function ve(i,t,e,n){const s=new pe(new Cn(i,t,e),new ws({color:n}));return s.castShadow=!0,s.receiveShadow=!0,s}function Te(){return new De}function _a(i,t,e){const n=Te(),s=ve(t*.7,.12,t*.7,e.wood);s.position.y=.06,n.add(s);const a=ve(t*2.4,.045,t*.8,e.metal);a.position.y=.13,n.add(a);const r=ve(t*.38,i,t,e.blade);r.position.y=.13+i/2,n.add(r);const o=ve(t*.42,i*.96,t*.2,e.bladeEdge);o.position.set(0,.13+i/2,t*.5),n.add(o);const c=ve(t*.3,.09,t*.45,e.blade);return c.position.y=.13+i+.045,n.add(c),n}function Qx(i){const t=_a(.72,.15,i),e=ve(.12,.46,.12,i.wood);return e.position.y=-.3,t.add(e),t}function tv(i){const t=Te(),e=ve(.32,.38,.06,i.metal);e.position.set(0,.02,.1),t.add(e);const n=ve(.11,.11,.045,i.blade);return n.position.set(0,.02,.145),t.add(n),t}function ev(i){const t=Te(),e=ve(.055,.88,.055,i.wood);e.position.y=.42,t.add(e);const n=ve(.15,.15,.15,i.glow);n.position.y=.92;const s=n.material;return s.emissive=new jt(i.glow),s.emissiveIntensity=.85,t.add(n),{g:t,orb:n}}function nv(i){const t=Te();for(let n=0;n<5;n++){const s=(n-2)*.15,a=ve(.055,.16,.05,i.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ve(.014,.66,.014,i.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function iv(i){const t=Te(),e=ve(.025,.025,.46,i.wood);e.position.z=.23,t.add(e);const n=ve(.055,.055,.09,i.blade);return n.position.z=.5,t.add(n),t}function sv(i,t,e,n,s,a,r,o,c,l,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},p=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},d=Te(),g=Te();g.name="pelvis",g.position.y=i.legLength,d.add(g);const _=Te();_.name="lower";const m=Te();m.name="upper",g.add(_),g.add(m);const u=i.headSize,x=i.legLength,S=i.armLength,v=i.limbThickness,D=i.bodyHeight,A=i.bodyWidth,C=ve(A,D,.28,t.body);C.position.y=D/2,m.add(C);const L=Te();L.name="headPivot",L.position.y=n.headPivotHeight,m.add(L);const b=ve(u,u,u,t.head);b.position.y=u/2,L.add(b);const y=new ws({color:"#1b2733"});for(const et of[-1,1]){const Mt=new pe(new Cn(.06,.07,.02),y);Mt.position.set(et*.09,u/2+.03,u/2+.011),L.add(Mt)}const P=et=>{const Mt=Te();Mt.name=et<0?"hipL":"hipR",Mt.rotation.order="ZYX",Mt.position.set(et*(A/2-v/2),0,0),_.add(Mt);const mt=ve(v,x/2,v,t.limb);mt.position.y=-x/4,Mt.add(mt);const Ht=Te();Ht.name="knee",Ht.position.y=-x/2,Mt.add(Ht);const Zt=ve(v,x/2,v,t.limb);Zt.position.y=-x/4,Ht.add(Zt);const Yt=ve(v*1.15,.07,v*1.7,t.shoe);Yt.position.set(0,-x/2+.035,.045),Ht.add(Yt);const ue=new Se;return ue.name="footTip",ue.position.y=-x/2,Ht.add(ue),{root:Mt,joint:Ht,hand:Te(),tip:ue}},B=et=>{const Mt=Te();Mt.name=et<0?"shoulderL":"shoulderR",Mt.position.set(et*(A/2+v/2),D-.04,0),m.add(Mt);const mt=ve(v,S/2,v,t.limb);mt.position.y=-S/4,Mt.add(mt);const Ht=Te();Ht.name="elbow",Ht.position.y=-S/2,Mt.add(Ht);const Zt=ve(v,S/2,v,t.limb);Zt.position.y=-S/4,Ht.add(Zt);const Yt=Te();Yt.position.y=-S/2,Ht.add(Yt);const ue=ve(v*1.1,.09,v*1.1,t.head);return ue.position.y=.045,Yt.add(ue),{root:Mt,joint:Ht,hand:Yt}},U=P(-1),W=P(1),R=B(-1),T=B(1),O=[U,W].map(et=>({root:et.root,joint:et.joint,tip:et.tip,upperLen:x/2,lowerLen:x/2,bend:1})),F=Te(),$=Te();T.hand.add(F),R.hand.add($);const at=ev(t),ut=nv(t),ot=iv(t),vt={"sword-shield":{right:_a(.42,.075,t),left:tv(t)},"dual-swords":{right:_a(.42,.075,t),left:_a(.42,.075,t)},greatsword:{right:Qx(t),left:ve(.12,.2,.12,t.wood)},staff:{right:at.g,left:Te(),orb:at.orb},bow:{right:ot,left:ut.g,arrow:ot,drawString:ut.drawString}};for(const et of Object.keys(vt))F.add(vt[et].right),$.add(vt[et].left),vt[et].right.visible=!1,vt[et].left.visible=!1;let q=null,J=0,ct=0,lt=0,gt=0,At=0,Dt=0,Xt=Vx(),Rt={...cc},Tt=0,k=0,ae=0,Pt=-1,Lt=0,Y=0,ht=0,ft=0,w=0,M=0,z=0,tt=0,G=0,K=!1,it=0,nt=0,_t=0,It=0,pt=1,Et={speed:0,phase:0},N={lp:0,lr:0,rp:0,rr:0},rt=0,dt=0,Ut=!0,kt=0,Gt="none",I=0,xt=0,Z=0,st=.3,bt=0;function St(et){const Mt=Math.PI/180,mt=a;let Ht=0,Zt=0,Yt=0,ue=0;et==="sword-shield"?(Ht=mt.swordPitchDeg*Mt,Zt=-mt.swordYawDeg*Mt,Yt=mt.shieldPitchDeg*Mt):et==="dual-swords"?(Ht=mt.swordPitchDeg*Mt,Zt=-mt.swordYawDeg*Mt,Yt=mt.swordPitchDeg*Mt,ue=mt.swordYawDeg*Mt):et==="greatsword"?(Ht=mt.greatswordPitchDeg*Mt,Zt=-mt.greatswordYawDeg*Mt,Yt=mt.greatswordPitchDeg*Mt,ue=mt.greatswordYawDeg*Mt):et==="staff"?Ht=mt.staffPitchDeg*Mt:Yt=mt.bowPitchDeg*Mt,F.rotation.set(Ht,0,Zt),$.rotation.set(Yt,0,ue)}function Bt(et){if(et!==q){q=et;for(const Mt of Object.keys(vt))vt[Mt].right.visible=Mt===et,vt[Mt].left.visible=Mt===et;St(et),ut.drawString.position.z=-.06,ot.position.z=0,at.orb.scale.setScalar(1),m.rotation.y=0}}Bt("sword-shield");const ee=[];d.traverse(et=>{et instanceof pe&&et.material instanceof ws&&ee.push(et.material)});const Vt=new jt(o.flashColor);function Wt(et,Mt){const mt=qd(et,Mt,o);Xt=mt,m.rotation.x+=mt.upperPitch,m.rotation.z+=mt.upperRoll,m.rotation.y+=mt.upperYaw;const Ht=Oe(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),Zt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Oe(mt.upperShiftX*Ht,-Zt,Zt),m.position.z+=Oe(mt.upperShiftZ*Ht,-Zt,Zt),g.position.x+=mt.comX,g.position.z+=mt.comZ-mt.pelvisBack,g.position.y-=mt.drop;const Yt=mt.legacy?0:Oe(o.lowerScale,0,1);_.position.z+=mt.pelvisBack*(1-Yt),_.position.y+=mt.drop*(1-Yt),U.joint.rotation.x+=mt.knee,W.joint.rotation.x+=mt.knee,U.root.rotation.x-=mt.hip,W.root.rotation.x-=mt.hip,R.root.rotation.x+=mt.arm,T.root.rotation.x+=mt.arm*.8;for(const ue of ee)ue.emissive.copy(Vt).multiplyScalar(mt.flash)}function ge(et){return et<.3?-1:et<.62?-1+(et-.3)/.32*2:Math.max(0,1-(et-.62)/.38)}function ye(et){if(et.phase==="idle"||et.charging)return;const Mt=et.attackProgress,mt=ge(Mt),Ht=Math.max(0,mt),Zt=et.comboIndex%2===0?1:-1,Yt=c.stride,ue=Number.isFinite(Yt.stepReach)?Yt.stepReach:.17,we=Number.isFinite(Yt.stepSideReach)?Yt.stepSideReach:.14,on=Number.isFinite(Yt.stepDipReach)?Yt.stepDipReach:.05,fe=et.weapon==="greatsword"?Oe(Number.isFinite(Yt.heavyScale)?Yt.heavyScale:1,0,1):1;g.position.z+=ue*Ht*fe,g.position.x+=Zt*we*Ht*fe,g.position.y-=on*Math.sin(Math.PI*Mt)*fe}function rn(et){if(ut.drawString.position.z=-.06,ot.position.z=0,at.orb.scale.setScalar(1),m.rotation.y=0,et.charging&&et.weapon==="bow"){const Zt=et.charge;R.root.rotation.x=-1.25,R.joint.rotation.x=-.15,T.root.rotation.x=.35+Zt*.3,T.joint.rotation.x=-1.15,ut.drawString.position.z=-.06-Zt*.22,ot.position.z=-Zt*.3,m.rotation.y=-.22;return}if(et.phase==="idle")return;const Mt=ge(et.attackProgress),mt=Math.max(0,-Mt),Ht=Math.max(0,Mt);if(et.weapon==="bow")R.root.rotation.x=-1.2,R.joint.rotation.x=-.15,T.root.rotation.x=.9-Ht*.8,T.joint.rotation.x=-.3;else if(et.weapon==="greatsword"){const Zt=-1.6*mt+1.25*Ht,Yt=Oe(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);T.root.rotation.x=Zt,T.joint.rotation.x=-(.25+mt*.4),R.root.rotation.x=Zt+.06,R.joint.rotation.x=-(.32+mt*.4),R.root.rotation.z=.38,m.rotation.y=-.2*Mt*Yt}else{const Zt=et.comboIndex;if(Zt===1)T.root.rotation.x=-1.7*mt+1.1*Ht,T.joint.rotation.x=-(.2+mt*.5),R.root.rotation.x=.1,m.rotation.y=-.18*Mt;else if(Zt===2)R.root.rotation.x=-1.5*mt+1*Ht,R.joint.rotation.x=-(.2+mt*.5),T.root.rotation.x=.2,m.rotation.y=.45*-Mt;else{const Yt=-1.9*mt+1.2*Ht;R.root.rotation.x=Yt,T.root.rotation.x=Yt,R.joint.rotation.x=-(.15+mt*.4),T.joint.rotation.x=-(.15+mt*.4),m.rotation.y=-.3*Mt}}ye(et)}function Je(et,Mt){et&&(T.root.rotation.x=-1.05,T.joint.rotation.x=-.35,R.root.rotation.x=-.45,R.joint.rotation.x=-.2,m.rotation.y=-.12,at.orb.scale.setScalar(1.25+.12*Math.sin(Mt*2)))}function he(et){if(!et||et.phase==="idle")return;const Mt=et.progress,mt=Mt<.3?-.35+Mt/.3*1.35:Mt<.7?1:Math.max(0,1-(Mt-.7)/.3),Ht=Math.PI/180;m.rotation.x+=p.leanDeg*Ht*mt,R.root.rotation.x-=p.shieldPitchDeg*Ht*mt,R.joint.rotation.x-=.22*mt,T.root.rotation.x-=.3*mt,g.position.z+=p.pelvisReach*Math.max(0,mt)}return{group:d,update(et,Mt,mt,Ht,Zt=!1,Yt,ue){Bt(Mt.weapon),m.rotation.x=0,m.rotation.z=0,g.position.x=0,g.position.y=x,g.position.z=0,g.rotation.z=0,g.rotation.x=0,m.position.x=0,m.position.y=0,m.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const we=Math.max(1/240,Math.min(Ht,.1)),on=Yt===void 0?rt+=Ht:Yt;dt=on;const fe=c.landing;fe.enabled?Ut&&!et.grounded?(Gt="jump",I=on,xt=fe.anticipationDuration,Z=Math.max(0,fe.jumpAnticipation),st=.32):!Ut&&et.grounded&&(Gt="land",I=on,xt=fe.duration,Z=Gx(kt,fe),st=fe.compressRatio,bt=kt):(Gt="none",Z=0),on<I&&(Gt="none",Z=0),Ut=et.grounded,kt=et.velocity.y;const Fe=Wl(on,I,xt,Z,st),E=Mt.phase!=="idle";_t=Ox(_t,E,we,c.attack.blendRate);const H=Bx(_t,c.attack.gaitWeight,c.attack.lowerBodyWeight);It=H.attackLegWeight,pt=H.gaitScale;const j=Math.sin(et.bodyYaw),Q=Math.cos(et.bodyYaw),V=(et.velocity.x-J)/we,yt=(et.velocity.z-ct)/we,Ct=Oe(V,-60,60),Nt=Oe(yt,-60,60),zt=Ct*j+Nt*Q,$t=Tn(et.bodyYaw-lt)/we,qt=Math.hypot(et.velocity.x,et.velocity.z),Ft=r.maxForwardDeg*Math.PI/180,ne=r.maxSideDeg*Math.PI/180,re=Oe(zt*r.accelGain,-Ft,Ft),le=Oe(-$t*qt*r.turnGain,-ne,ne),Le=1-Math.exp(-r.smoothing*we);gt+=(re-gt)*Le,At+=(le-At)*Le,J=et.velocity.x,ct=et.velocity.z,lt=et.bodyYaw;const te=Math.hypot(et.velocity.x,et.velocity.z),Ot=Math.cos(et.bodyYaw),cn=-Math.sin(et.bodyYaw),se=et.velocity.x*Ot+et.velocity.z*cn,Ze=te>Pr?Oe(se/te,-1,1):0,Gn=Vd(Ze,n.legYawScale,n.hipYawMaxDeg,s.strafeHipBoost);k+=(Gn-k)*(1-Math.exp(-n.hipYawSmoothing*we));const Ae=et.bodyYaw+k;ae=Ae;const ii=Math.sin(Ae),de=Math.cos(Ae),Qe=Math.cos(Ae),si=-Math.sin(Ae),Ie={speed:te,phase:et.gaitPhase,localForward:et.velocity.x*ii+et.velocity.z*de,localRight:et.velocity.x*Qe+et.velocity.z*si,stride:et.stride};E&&!K&&(G=et.gaitPhase),K=E;const Ne=_t>0?Nx(Ie,Mt.attackProgress,Mt.comboIndex,_t,c.stride,G):Ie;Et=Ne;const ln=Math.max(0,s.stopBlendSec||0),os=ln>0&&!E&&et.grounded,lc=Xd(te,z,e,s.stopEnterRatio,s.stopExitRatio);!os||lc.resume?Pt=-1:Pt<0&&lc.enter&&(Pt=0,Lt=et.gaitPhase,Y=Hd(et.gaitPhase),ht=te,ft=Math.max(et.stride,Pr),w=Ie.localForward,M=Ie.localRight),z=te;const Cs=os&&Pt>=0;Cs&&(Pt=Math.min(1,Pt+we/ln));const dc=Cs?{phase:Lt,speed:ht,moveSpeed:e,localForward:w,localRight:M,legLength:i.legLength,stride:ft,grounded:!0}:{phase:Ne.phase,speed:Ne.speed,moveSpeed:e,localForward:Ne.localForward,localRight:Ne.localRight,legLength:i.legLength,stride:Ne.stride??0,grounded:et.grounded},th=Cs?Gd(dc,s,{progress:Pt,phase0:Lt,phaseEnd:Y}):oc(dc,s),_e=Hx(th,H.gaitScale);let hc=0,uc=0,fc=0;if(Cs){const xe=$d(Pt,Lt,w,M,s);xe.leadLeft?(_e.legL.pitchX-=xe.leadPitch,_e.legL.kneeX+=xe.leadKnee,_e.legR.pitchX+=xe.trailPitch):(_e.legR.pitchX-=xe.leadPitch,_e.legR.kneeX+=xe.leadKnee,_e.legL.pitchX+=xe.trailPitch),uc=xe.bodyShift*xe.fwdN,hc=xe.bodyShift*xe.rightN,fc=xe.chestPitch,it=xe.leadPitch,nt=xe.bodyShift}else it=0,nt=0;N={lp:_e.legL.pitchX,lr:_e.legL.rollZ,rp:_e.legR.pitchX,rr:_e.legR.rollZ},et.grounded?(U.root.rotation.x=_e.legL.pitchX,W.root.rotation.x=_e.legR.pitchX,U.root.rotation.z=_e.legL.rollZ,W.root.rotation.z=_e.legR.rollZ,U.joint.rotation.x=_e.legL.kneeX,W.joint.rotation.x=_e.legR.kneeX,R.root.rotation.x=_e.armL,T.root.rotation.x=_e.armR,R.joint.rotation.x=-(.18+_e.armL*.2),T.joint.rotation.x=-(.18+_e.armR*.2),R.root.rotation.z=0,T.root.rotation.z=0,g.position.x=_e.pelvisX+hc,g.position.y=x+_e.pelvisY,g.position.z=uc,g.rotation.z=_e.pelvisRoll):(U.root.rotation.x=-.55,W.root.rotation.x=-.25,U.joint.rotation.x=.75,W.joint.rotation.x=.55,R.root.rotation.x=-.9,T.root.rotation.x=-.7,R.joint.rotation.x=-.6,T.joint.rotation.x=-.6,U.root.rotation.z=0,W.root.rotation.z=0);const eh=Kd(g,_),nh=te/Math.max(e,Pr),ih=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,sh=1-Math.exp(-Math.max(0,ih)*we);Tt+=(Oe(nh,0,1)-Tt)*sh;const wi=jd({leanForward:gt,leanSide:At,speedRatio:Tt},r);g.rotation.x+=wi.pelvisPitch,g.rotation.z+=wi.pelvisRoll,g.position.x+=wi.pelvisX,g.position.z+=wi.pelvisZ,g.position.y-=wi.crouch;const ah=f.enabled&&et.grounded?Oe(f.weight,0,1)*(E?Oe(f.attackScale,0,1):1):0;_.position.y+=wi.crouch*(1-Oe(ah,0,1)),rn(Mt),Je(Zt,et.gaitPhase),he(ue);const rh=a.greatswordPitchDeg*Math.PI/180,pc=Mt.weapon==="greatsword",mc=Math.hypot(et.velocity.x,et.velocity.z),oh=pc&&Mt.phase==="idle"&&mc>.5?Math.min(1.15,mc/Math.max(e,.001)*.9):0;Dt+=(oh-Dt)*(1-Math.exp(-6*we)),pc&&(F.rotation.x=rh+Dt),Mt.weapon==="bow"&&(ut.g.rotation.x=-(R.root.rotation.x+R.joint.rotation.x),ot.rotation.x=-(T.root.rotation.x+T.joint.rotation.x));const ch=m.rotation.y;Wt(mt,et.bodyYaw);const gc=mt.type==="none"?1:.4;if(m.rotation.x+=gt*gc+fc,m.rotation.z+=(At+_e.sideLean)*gc,Fe>0&&(U.root.rotation.x-=fe.hipPitch*Fe,W.root.rotation.x-=fe.hipPitch*Fe,U.joint.rotation.x+=fe.kneeBend*Fe,W.joint.rotation.x+=fe.kneeBend*Fe,g.position.y-=fe.crouchDepth*Fe,_.position.y+=fe.crouchDepth*(1-fe.lowerScale)*Fe,m.rotation.x+=fe.upperPitch*Fe,R.root.rotation.x-=fe.armTuck*Fe,T.root.rotation.x-=fe.armTuck*Fe),It>0&&et.grounded){const xe=zx(Mt.attackProgress,Mt.comboIndex,c.stride),Pn=It;U.root.rotation.x+=xe.legL.pitchX*Pn,W.root.rotation.x+=xe.legR.pitchX*Pn,U.root.rotation.z+=xe.legL.rollZ*Pn,W.root.rotation.z+=xe.legR.rollZ*Pn,U.joint.rotation.x+=xe.legL.kneeX*Pn,W.joint.rotation.x+=xe.legR.kneeX*Pn,g.position.x+=xe.pelvisX*Pn,g.position.y+=xe.pelvisY*Pn,g.rotation.z+=xe.pelvisRoll*Pn}_.rotation.y=k,tt=Wd(k,s.chestYawScale,s.chestYawMaxDeg),m.rotation.y+=tt;const lh=ch;L.rotation.y=Tn(et.headYaw-et.bodyYaw-lh-tt),Rt=Jd({root:d,pelvis:g,lower:_,limbs:O,base:eh,cfg:f,grounded:et.grounded,attacking:E})},lean(){return{forward:gt,side:At}},landing(){const et=Wl(dt,I,xt,Z,st),Mt=xt>0?Math.max(0,xt-Math.max(0,dt-I)):0;return{pulse:et,remaining:Mt,kind:et>0?Gt:"none",impactVy:bt}},hurt(){return Xt},ik(){return Rt},attackBlend(){return _t},attackWeights(){return{gaitScale:pt,attackLegWeight:It,driveSpeed:Et.speed,stridePhase:Et.phase}},hipYaw(){return k},gaitDebug(){return{stopT:Pt,hipYaw:k,chestYaw:tt,speed:z,stopStep:it,stopShift:nt,legLPitch:N.lp,legLRoll:N.lr,legRPitch:N.rp,legRRoll:N.rr}},gaitYaw(){return ae},arrowDirection(){ot.updateWorldMatrix(!0,!1);const et=ot.matrixWorld.elements,Mt=et[8],mt=et[9],Ht=et[10],Zt=Math.hypot(Mt,mt,Ht)||1;return{x:Mt/Zt,y:mt/Zt,z:Ht/Zt}},dispose(){d.traverse(et=>{if(et instanceof pe){et.geometry.dispose();const Mt=et.material;Array.isArray(Mt)?Mt.forEach(mt=>mt.dispose()):Mt.dispose()}})}}}function av(i,t){switch(i){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function rv(i,t,e){const n=Math.max(1,i.clientWidth),s=Math.max(1,i.clientHeight),a=new vx({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=ad,a.setSize(n,s,!1),i.appendChild(a.domElement);const r=new Mx;r.background=new jt("#12161d"),r.add(new Ax(11061486,2764600,1.15));const o=new Cx(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],h=new De;for(const Y of t.boxes){const ht=Y.maxX-Y.minX,ft=Y.maxY-Y.minY,w=Y.maxZ-Y.minZ;let M=av(Y.kind,e);Y.kind==="step"&&(M=new jt(M).offsetHSL(0,0,Y.maxY*.09).getStyle());const z=new ws({color:M,transparent:!0,opacity:1}),tt=new pe(new Cn(ht,ft,w),z);tt.position.set((Y.minX+Y.maxX)/2,(Y.minY+Y.maxY)/2,(Y.minZ+Y.maxZ)/2),tt.castShadow=Y.kind!=="ground",tt.receiveShadow=!0,tt.add(new Nd(new wx(tt.geometry),new sc({color:10467020,transparent:!0,opacity:.32}))),h.add(tt),l.push(z)}r.add(h);const f=t.gridMeta.maxX-t.gridMeta.minX,p=new Dx(f,f,4873328,3358797);p.position.y=.002,p.visible=e.showGrid,r.add(p);const d=sv(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new De,_=.9,m=new De;m.position.y=_,d.group.position.y=-_,m.add(d.group),g.add(m),r.add(g);const u=t.dummies.map((Y,ht)=>{const ft=e.dummies.colors,w=ft[ht%ft.length]??"#cccccc",M=jx(e.voxel,e.colors,w,Y.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return M.group.traverse(z=>{z.userData.dummyId=Y.id}),r.add(M.group),M}),x=u.map(Y=>Y.group),S=new Px,v=e.targeting.ringRadius,D=new Sn({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:He,depthWrite:!1}),A=new pe(new Zi(v-.07,v,28),D);A.rotation.x=-Math.PI/2,A.position.y=.03,A.visible=!1,r.add(A);const C=new De;r.add(C);const L=new Sn({color:12577023,transparent:!0,opacity:0,side:He,depthWrite:!1}),b=new De;b.position.set(0,.95,.72),C.add(b);const y=new De;y.rotation.x=Kx(e.camera.pitchDeg),b.add(y);const P=new pe(new za(.78,.045,6,24,Math.PI*1.15),L);y.add(P);const B=new rc(1,0),U=new Sn({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),W=Array.from({length:16},()=>{const Y=new pe(B,U);return Y.visible=!1,r.add(Y),Y}),R=new Zi(.86,1,40),T=Array.from({length:6},()=>{const Y=new Sn({color:10146047,transparent:!0,opacity:0,side:He,depthWrite:!1}),ht=new pe(R,Y);return ht.rotation.x=-Math.PI/2,ht.visible=!1,r.add(ht),{mesh:ht,mat:Y}}),O=new Sn({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),F=new pe(new Cn(.035,.035,.5),O);C.add(F);const $=e.dash,at=new Zi($.ringRadius-.06,$.ringRadius,28),ut=Array.from({length:6},()=>{const Y=new Sn({color:16777215,transparent:!0,opacity:0,side:He,depthWrite:!1}),ht=new pe(at,Y);return ht.rotation.x=-Math.PI/2,ht.visible=!1,r.add(ht),{mesh:ht,mat:Y,life:0,base:1}});function ot(Y,ht,ft,w,M){const z=ut.find(tt=>tt.life<=0)??ut[0];z.mat.color.set(w),z.mesh.position.set(Y,ft+.04,ht),z.base=M,z.mesh.scale.setScalar(M*.6),z.mesh.visible=!0,z.mat.opacity=.9,z.life=$.fxDuration}const vt=e.links,q=new Zi(vt.ringRadius-.07,vt.ringRadius,28),J=Array.from({length:5},()=>{const Y=new Sn({color:vt.chargeColor,transparent:!0,opacity:0,side:He,depthWrite:!1}),ht=new pe(q,Y);return ht.rotation.x=-Math.PI/2,ht.visible=!1,r.add(ht),{mesh:ht,mat:Y,life:0,base:1}});function ct(Y,ht,ft,w){const M=J.find(z=>z.life<=0)??J[0];M.mesh.position.set(Y,ft+.05,ht),M.base=w,M.mesh.scale.setScalar(w*.55),M.mesh.visible=!0,M.mat.opacity=.85,M.life=vt.fxDuration}let lt=t.playerLink.id,gt=t.playerLink.hitIds.length,At=t.dash.id,Dt="none",Xt=0,Rt=-1,Tt=1;const k=Ix(e.camera,e.smartCamera,e.zoom,n/s),ae=t.character.position;k.update(ae.x,ae.y,ae.z,1,t.camera);function Pt(Y,ht){if(x.length===0)return 0;const ft=a.domElement.getBoundingClientRect(),w=new Kt((Y-ft.left)/ft.width*2-1,-((ht-ft.top)/ft.height)*2+1);S.setFromCamera(w,k.camera);const M=S.intersectObjects(x,!0);for(const z of M){const tt=z.object.userData.dummyId;if(tt&&tt>0)return tt}return 0}function Lt(Y,ht,ft){const w=a.domElement.getBoundingClientRect(),M=new X(Y,ht,ft).project(k.camera);return{x:w.left+(M.x*.5+.5)*w.width,y:w.top+(-M.y*.5+.5)*w.height}}return{gaitDebug(){return d.gaitDebug()},render(Y,ht){const ft=Y.character,w=Y.combat;g.position.set(ft.position.x,ft.position.y,ft.position.z),g.rotation.y=ft.bodyYaw;const M=Y.dash.phase==="active"&&Y.dash.kind==="roll",z=M&&Y.dash.duration>0?Math.min(1,1-Y.dash.timer/Y.dash.duration):0;m.rotation.x=M?z*Math.PI*2:0,m.position.y=_-(M?.2*Math.sin(Math.PI*z):0),d.update(ft,w,Y.playerHurt,ht,Y.abilities.channeling,Y.time,Y.playerLink);for(let it=0;it<u.length;it++)Y.dummies[it]&&u[it].update(Y.dummies[it],ht);const tt=Y.targeting.hasTarget?Y.dummies[Y.targeting.targetId-1]:void 0;if(A.visible=!!tt,tt&&(A.position.set(tt.position.x,tt.position.y+.03,tt.position.z),A.scale.setScalar(1+.07*Math.sin(Y.time*6))),C.position.set(ft.position.x,ft.position.y,ft.position.z),C.rotation.y=w.phase!=="idle"?w.attackFacing:ft.bodyYaw,Y.dash.id!==At){At=Y.dash.id;const it=Y.dash;Dt=it.kind,it.kind==="blink"?(ot(it.fromX,it.fromZ,ft.position.y,$.blinkColor,.9),ot(it.toX,it.toZ,ft.position.y,$.blinkColor,1.35)):ot(it.fromX,it.fromZ,ft.position.y,$.rollColor,1.1)}for(const it of ut){if(it.life<=0)continue;it.life-=ht;const nt=Math.max(0,it.life/$.fxDuration);it.mat.opacity=.9*nt,it.mesh.scale.setScalar(it.base*(.6+(1-nt)*1.2)),it.life<=0&&(it.mesh.visible=!1)}const G=Y.playerLink;G.id!==lt&&(lt=G.id,gt=G.hitIds.length,ct(ft.position.x,ft.position.z,ft.position.y,1)),G.hitIds.length>gt?(gt=G.hitIds.length,ct(ft.position.x,ft.position.z,ft.position.y,1.35)):G.hitIds.length<gt&&(gt=G.hitIds.length);for(const it of J){if(it.life<=0)continue;it.life-=ht;const nt=Math.max(0,it.life/Math.max(vt.fxDuration,1e-6));it.mat.opacity=.85*nt,it.mesh.scale.setScalar(it.base*(.55+(1-nt)*1.1)),it.life<=0&&(it.mesh.visible=!1)}w.attackId!==Xt&&(Xt=w.attackId,w.weapon==="bow"&&w.phase!=="idle"&&(Rt=0,Tt=.6+w.lastCharge*.9));const K=w.phase==="active"&&w.comboIndex>0;L.opacity=K?.78:0,K&&(P.rotation.z=-1.2+w.attackProgress*3.2,P.scale.setScalar(.9+w.comboIndex*.13));for(let it=0;it<W.length;it++){const nt=Y.abilities.projectiles[it],_t=W[it];_t.visible=!!nt,nt&&(_t.position.set(nt.x,nt.y,nt.z),_t.scale.setScalar(nt.radius),_t.rotation.y+=ht*6)}for(let it=0;it<T.length;it++){const nt=Y.abilities.rings[it],_t=T[it];if(_t.mesh.visible=!!nt,nt){const It=Math.max(0,Math.min(1,nt.life/Math.max(nt.duration,1e-6)));_t.mesh.position.set(nt.x,.05,nt.z),_t.mesh.scale.setScalar(nt.radius),_t.mat.opacity=.25+.55*It}}if(Rt>=0){Rt+=ht;const it=Rt*14*Tt;F.position.set(0,.85,.6+it),O.opacity=it<9?.95:0,it>=9&&(Rt=-1)}else O.opacity=0;k.update(ft.position.x,ft.position.y,ft.position.z,ht,Y.camera),a.render(r,k.camera)},resize(){const Y=Math.max(1,i.clientWidth),ht=Math.max(1,i.clientHeight);a.setSize(Y,ht,!1),k.resize(Y/ht)},getGroundBasis(){return k.getGroundBasis()},setCollidersVisible(Y){for(const ht of l)ht.opacity=Y?.3:1,ht.wireframe=Y,ht.needsUpdate=!0},setGridVisible(Y){p.visible=Y},setZoom(Y){k.setZoom(Y)},pickDummy:Pt,projectToScreen:Lt,diagnostics(){const Y=Qd(e.camera.pitchDeg),ht=Jx(Y,C.rotation.y);return{lean:d.lean(),slashNormal:ht,arrowForward:d.arrowDirection(),gait:{hipYaw:d.hipYaw(),gaitYaw:d.gaitYaw()},attackBlend:d.attackBlend(),attackWeights:d.attackWeights(),landing:d.landing(),hurt:d.hurt(),ik:d.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:m.rotation.x,activeRings:ut.filter(ft=>ft.life>0).length,lastKind:Dt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...k.smart()}}},dispose(){d.dispose();for(const Y of u)Y.dispose();A.geometry.dispose(),D.dispose(),P.geometry.dispose(),L.dispose(),B.dispose(),U.dispose(),R.dispose();for(const Y of T)Y.mat.dispose();F.geometry.dispose(),O.dispose();for(const Y of ut)Y.mat.dispose();at.dispose();for(const Y of J)Y.mat.dispose();q.dispose(),h.traverse(Y=>{Y instanceof pe&&Y.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}async function ov(i){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(i),!0}catch{}try{const t=document.createElement("textarea");t.value=i,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,i.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function cv(i,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=i,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),2e3)}function lv(i,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const n=x=>e.querySelector(`#${x}`),s=n("diag-status"),a=n("diag-text"),r=n("diag-copy"),o=n("diag-json"),c=n("diag-clear"),l=n("diag-toggle"),h=n("diag-close"),f=n("diag-mask");let p=!1,d=!0,g=0;function _(){const x=i.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){p=x,e.hidden=!x,x?_():a.hidden=!0}function u(x){r.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!p)}),h.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),r.addEventListener("click",()=>{const x=i.summary();ov(x).then(S=>{S?(u("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),u("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=i.dump(),S=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);cv(`harness-${x.meta.version}-${S}.json`,JSON.stringify(x)),u("已导出")}),c.addEventListener("click",()=>{i.clear(),a.hidden=!0,_(),u("已清空")}),l.addEventListener("click",()=>{d=!d,i.setEnabled(d),_()}),{tick(){const x=i.status();t==null||t.classList.toggle("is-alert",x.alert),p&&_()},isOpen:()=>p,close:()=>m(!1)}}const dv={intents:{...$l},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function hv(){const i=document.getElementById("app"),t=document.getElementById("hud");if(!i||!t)throw new Error("缺少 #app / #hud 容器");const e=uu($u,Yu),n=rv(i,e,hn),s=pu(e),a=_f(t),r=vf(t,document.getElementById("hint")),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.17 · 11-07 01:42 · 诊断");const c=y=>String(y).padStart(2,"0"),l=new Date,h=Hu({meta:{version:"v0.9.17",buildTime:"11-07 01:42",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=lv(h,o),p=pf({deadZone:()=>hn.joystick.deadZone});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const d={timeScale:1,paused:!1,showColliders:hn.showColliders,showGrid:hn.showGrid};let g=1;const _=Pu({maxRadiusPx:()=>hn.joystick.maxRadiusPx,deadZone:hn.joystick.deadZone,getBasis:()=>n.getGroundBasis(),zoom:()=>hn.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let u=e.combat.weapon;function x(y){if(y===u)return;u=y;const P=yi.indexOf(y)+1;for(const B of m)B.classList.toggle("is-active",Number(B.dataset.weapon)===P);D.refreshWeapon()}let S=dv,v=0;const D=of(e,hn,d,{singleStep:()=>s.singleStep(S.intents),reset:()=>{g=1,s.singleStep({...$l,resetPressed:!0})},resetZoom:()=>{g=1,n.setZoom(1)},onToggleColliders:y=>n.setCollidersVisible(y),onToggleGrid:y=>n.setGridVisible(y)});window.addEventListener("resize",()=>n.resize()),window.__harness={world:e,view:n,clock:s,input:_,viewConfig:hn,getUserZoom:()=>g,getGestures:()=>S.gestures,getLastGesture:()=>S.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:p,dirAngles:()=>p.last(),gaitDebug:()=>n.gaitDebug()};let A=performance.now(),C=60,L=0;function b(y){const P=Math.min((y-A)/1e3,.1);A=y,P>0&&(C=C*.9+1/P*.1);const B=_.sample();B.intents.resetPressed&&(g=1),g=Mu(g,B.zoomScale,hn.zoom.min,hn.zoom.max),n.setZoom(g);let U=B.intents.dummyClickId;if(B.tap){const T=n.pickDummy(B.tap.x,B.tap.y);T>0&&(U=T)}U>0&&(v=U),S={...B,intents:{...B.intents,dummyClickId:v}};const W=s.frame(P,S.intents,d.timeScale,d.paused,()=>{const T=e.events;for(let O=0;O<T.length;O++)h.event(T[O],e.time)});W>0&&(v=0),h.sample(e,S,P*1e3,W);for(const T of S.gestures)h.gesture(T);y-L>250&&(L=y,f.tick()),x(e.combat.weapon),n.render(e,P),p.update(e,S,n.getGroundBasis());const R=n.diagnostics();a.update(e,C,W,S,d,{attackBlend:R.attackBlend,attackWeights:R.attackWeights,landing:R.landing,hurt:R.hurt,ik:R.ik,zoom:R.camera.zoom},r.hudCompact()),requestAnimationFrame(b)}requestAnimationFrame(b)}hv();

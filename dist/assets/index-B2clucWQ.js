(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const mi=["sword-shield","dual-swords","greatsword","staff","bow"],Fa=["wander","follow","keep-distance","attack","idle"],Nl={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},fa=1e-6;function Ta(i,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>fa?Math.atan2(t.aimX,t.aimZ):i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget?i.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>fa?Math.atan2(t.moveX,t.moveZ):i.character.facing}function qd(i,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>fa){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>fa)return{x:t.moveX/e,z:t.moveZ/e};const n=i.character.facing;return{x:Math.sin(n),z:Math.cos(n)}}const Qe=1e-6,Tr=Math.PI/180;function zl(){return{type:"none",timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Rr(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function oc(i,t,e,n,s){i.type=t,i.duration=e,i.timer=e,i.dirX=n,i.dirZ=s,i.knockX=0,i.knockZ=0}function Lo(i,t,e){const n=e.duration>0?e.duration:ko(i,e.type);if(t.kind==="player"){const a=i.playerHurt;if(oc(a,e.type,n,e.dirX,e.dirZ),!i.config.hits.noDamageToPlayer&&e.knockback>Qe){const r=e.knockback*i.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}Rr(i,"player-hurt",e.sourceId??0,i.character.position);return}const s=i.dummies[t.index];if(s){if(oc(s.hurt,e.type,n,e.dirX,e.dirZ),e.knockback>Qe){const a=e.knockback*i.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}i.hitCount+=1,Rr(i,"hit",s.id,s.position)}}function Io(i,t,e){Lo(i,{kind:"dummy",index:t},e)}function jd(i,t){const e=[i.playerHurt];for(const s of i.dummies)e.push(s.hurt);const n=Math.exp(-i.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=n,s.knockZ*=n,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function ko(i,t){const e=i.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Kd(i){const t=i.combat,e=i.config.hits,n=i.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Tr),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=i.config.dummies.radius,l=i.config.targeting.idealRange;for(const h of i.dummies){const f=h.position.x-n.x,p=h.position.z-n.z,d=Math.hypot(f,p);if(d>s+c)continue;const m=d>Qe?f/d:r,_=d>Qe?p/d:o;if(d>Qe&&(f*r+p*o)/d<a)continue;let g="light";t.weapon==="greatsword"?g="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(g="heavy");const u=e.knockback[t.weapon]??0;let x=d;u>0&&(x=Math.max(d+u,l));const S=Math.max(0,x-d);Io(i,i.dummies.indexOf(h),{type:g,duration:ko(i,g),dirX:m,dirZ:_,knockback:S})}}function Jd(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="active")return;const s=n.weapon===""?void 0:e.moves[n.weapon];if(!s||!s.enabled||!i.modules.hits||!i.modules.dummies)return;const a=s.hit;if(n.pulseTimer-=t,n.pulseTimer>0)return;n.pulseTimer=Math.max(a.pulseInterval,0);const r=i.character.position,o=n.fromX,c=n.fromZ,l=r.x,h=r.z,f=l-o,p=h-c,d=f*f+p*p,m=Math.sin(n.facing),_=Math.cos(n.facing),g=Math.cos(cc(a.arcDeg,0,180)*Tr),u=i.config.dummies.radius;for(let x=0;x<i.dummies.length;x++){const S=i.dummies[x];if(n.hitIds.indexOf(S.id)>=0)continue;const v=d>Qe?cc(((S.position.x-o)*f+(S.position.z-c)*p)/d,0,1):0,L=o+f*v,R=c+p*v,C=Math.hypot(S.position.x-L,S.position.z-R);let D=!1;if(a.shape==="circle")D=C<=a.radius+u;else if(a.shape==="capsule")D=C<=Math.max(a.radius,a.width)+u;else{const W=S.position.x-l,T=S.position.z-h,A=Math.hypot(W,T),B=A>Qe?(W*m+T*_)/A>=g:!0;D=A<=a.radius+u&&B||C<=a.width+u}if(!D)continue;const b=S.position.x-o,y=S.position.z-c,P=Math.hypot(b,y);if(P>Qe&&(b*m+y*_)/P<Math.cos(Math.max(a.arcDeg,90)*Tr))continue;const G=P>Qe?b/P:m,F=P>Qe?y/P:_;Lo(i,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:G,dirZ:F,knockback:a.knockback}),n.hitIds.push(S.id),Rr(i,"link-hit",S.id,S.position)}}function Qd(i){const t=i.config.hits,e=i.character.position;for(const n of i.events){if(n.type!=="dummy-hit")continue;const s=i.dummies[n.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>Qe?a/o:0,l=o>Qe?r/o:1;Lo(i,{kind:"player"},{type:"light",duration:ko(i,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function th(i,t){if(!i.modules.hits)return;i.events.some(n=>n.type==="attack-active")&&Kd(i),Jd(i,t),Qd(i)}function cc(i,t,e){return i<t?t:i>e?e:i}const ia=1e-6;function _s(i,t,e,n){i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function eh(){return{channeling:!1,channelYaw:0,fireTimer:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function nh(i){const t=i.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.projectiles.length=0,t.rings.length=0}function ih(i){const t=i.abilities,e=i.config.abilities.arcane,n=i.character.position,s=Math.sin(t.channelYaw),a=Math.cos(t.channelYaw),r=.55,o={id:++t.nextId,x:n.x+s*r,y:n.y+1,z:n.z+a*r,dirX:s,dirZ:a,speed:e.speed,life:e.life,radius:e.radius};t.projectiles.push(o),t.volleyId+=1,_s(i,"projectile-fire",t.volleyId,o)}function sh(i,t,e){const n=i.abilities,s=i.config.abilities.arcane,a=i.dash.phase==="active",r=i.playerLink;if(i.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack){n.channeling||(n.channeling=!0,n.fireTimer=0,_s(i,"channel-start",0,i.character.position)),n.channelYaw=Ta(i,e),n.fireTimer-=t;let c=0;for(;n.fireTimer<=0&&c++<8;)n.fireTimer+=Math.max(s.fireInterval,ia),ih(i)}else n.channeling&&(n.channeling=!1,_s(i,"channel-end",0,i.character.position))}function ah(i,t){const e=i.config.abilities.ring,n=i.dash.phase==="active";if(i.combat.weapon!=="staff"||!t.skill2Pressed||n)return;const s=i.character.position,a={id:++i.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};i.abilities.rings.push(a),_s(i,"ring-place",a.id,s)}function rh(i,t){const e=i.abilities,n=i.config.abilities.arcane,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.projectiles){if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],f=h.position.x-o.x,p=h.position.z-o.z,d=o.radius+s;if(!(f*f+p*p>d*d)){Io(i,l,{type:n.hurtType,duration:n.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:n.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function oh(i,t){const e=i.abilities,n=i.config.abilities.ring,s=i.config.dummies.radius,a=i.modules.hits&&i.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(n.pulseInterval,ia),a)for(let l=0;l<i.dummies.length;l++){const h=i.dummies[l],f=h.position.x-o.x,p=h.position.z-o.z,d=o.radius+s;if(f*f+p*p>d*d)continue;const m=Math.hypot(f,p),_=m>ia?f/m:0,g=m>ia?p/m:1;Io(i,l,{type:"heavy",duration:n.stun,dirX:_,dirZ:g,knockback:n.knockback})}_s(i,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function ch(i,t,e){sh(i,t,e),ah(i,e),rh(i,t),oh(i,t)}function Na(i){i.rngState=i.rngState+1831565813>>>0;let t=i.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const lc=1e-6;function dc(i,t,e){return i<t?t:i>e?e:i}function Ol(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Bl(i){const t=i.camera,e=Ol();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=i.character.position.x,t.centroidZ=i.character.position.z}function lh(i){const t=i.camera,e=i.config.camera,n=i.character.position;let s=0,a=0,r=0,o=0;for(const l of i.dummies){const h=l.position.x-n.x,f=l.position.z-n.z,p=Math.hypot(h,f);if(p>e.radius)continue;const d=dc((e.radius-p)/Math.max(lc,e.radius-e.nearDistance),0,1);let m=d*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(m+=e.attackBoost*d),s+=m,a+=l.position.x*m,r+=l.position.z*m,o+=1}const c=s<=0?0:dc(s/(s+Math.max(lc,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=n.x,t.centroidZ=n.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,h=r/s;t.centroidX=l,t.centroidZ=h;let f=(l-n.x)*e.framingBias*c,p=(h-n.z)*e.framingBias*c;const d=Math.hypot(f,p);d>e.maxOffset&&(f=f/d*e.maxOffset,p=p/d*e.maxOffset),t.offsetX=f,t.offsetZ=p}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function dh(i){const t=[],e=i.ground.size;t.push(Mi("ground","ground",0,0,e,e,-i.ground.thickness,0));for(const n of i.steps)t.push(Mi(n.id,"step",n.x,n.z,n.width,n.depth,0,n.height));for(const n of i.doorways){const s=n.openingWidth/2,a=n.wallThickness;t.push(Mi(`${n.id}-left`,"wall",n.x-s-n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(Mi(`${n.id}-right`,"wall",n.x+s+n.wallSpan/2,n.z,n.wallSpan,a,0,n.wallHeight)),t.push(Mi(`${n.id}-lintel`,"lintel",n.x,n.z,n.openingWidth,a,n.openingHeight,n.wallHeight))}for(const n of i.obstacles)t.push(Mi(n.id,"obstacle",n.x,n.z,n.width,n.depth,0,n.height));return t}function Mi(i,t,e,n,s,a,r,o){return{id:i,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:n-a/2,maxZ:n+a/2}}const Un=1e-6;function pa(i,t,e){return i<t?t:i>e?e:i}function Cr(i,t,e,n,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of i)l.maxY>n+a+Un||l.maxY<n-r-Un||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Uo(i,t,e,n,s){let a=!1;const r=t.y+n;for(let o=0;o<2;o++)for(const c of i){if(c.maxY<=t.y+s+Un||c.minY>=r-Un)continue;const l=pa(t.x,c.minX,c.maxX),h=pa(t.z,c.minZ,c.maxZ),f=t.x-l,p=t.z-h,d=f*f+p*p;if(!(d>=e*e))if(a=!0,d>Un*Un){const m=Math.sqrt(d),_=(e-m)/m;t.x+=f*_,t.z+=p*_}else{const m=t.x-c.minX,_=c.maxX-t.x,g=t.z-c.minZ,u=c.maxZ-t.z,x=Math.min(m,_,g,u);x===m?t.x=c.minX-e:x===_?t.x=c.maxX+e:x===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function Fo(i,t,e,n,s){const a=t.y+n;for(const r of i){if(r.maxY<=t.y+s+Un||r.minY>=a-Un)continue;const o=pa(t.x,r.minX,r.maxX),c=pa(t.z,r.minZ,r.maxZ),l=t.x-o,h=t.z-c;if(l*l+h*h<e*e-Un)return!0}return!1}const Pr=1e-6;function Sn(i){return Math.atan2(Math.sin(i),Math.cos(i))}function za(i,t,e,n){const s=Sn(t-i);return i+s*(1-Math.exp(-Math.max(e,Pr)*n))}function hc(i,t,e,n){const s=Sn(t-i),a=Math.abs(s);return a<=n||a<=e?t:Sn(i+Math.sign(s)*Math.max(e,0))}function hh(i,t,e){const n=i.character,s=i.config.orientation,a=i.combat,r=Math.hypot(e.moveX,e.moveZ),o=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Pr,c=i.abilities.channeling,l=a.charging&&a.weapon==="bow"&&i.config.targeting.targetAssist&&i.modules.targeting&&i.targeting.hasTarget;if(a.phase!=="idle")n.facing=a.attackFacing;else if(o||c)n.facing=Ta(i,e);else if(l)n.facing=i.targeting.targetYaw;else if(r>Math.max(s.facingDeadZone,Pr)){const m=Math.atan2(e.moveX,e.moveZ),_=s.facingTurnRate*Math.PI/180*t,g=s.facingSnapDeg*Math.PI/180;if(r>=.35)n.facing=hc(n.facing,m,_,g);else if(r>=s.facingMinMagnitude&&Math.abs(Sn(m-n.facing))>s.facingDeadbandDeg*Math.PI/180){const x=za(n.facing,m,s.facingSmoothRate,t);n.facing=hc(n.facing,x,_,0)}}const h=n.velocity;Math.hypot(h.x,h.z)>.15&&(n.moveYaw=Math.atan2(h.x,h.z)),n.bodyYaw=za(n.bodyYaw,n.facing,s.bodyTurnRate,t);let f=za(n.headYaw,n.facing,s.headTurnRate,t);const p=s.maxHeadTurnDeg*Math.PI/180,d=Sn(f-n.bodyYaw);d>p?f=n.bodyYaw+p:d<-p&&(f=n.bodyYaw-p),n.headYaw=f}const Dr=1e-6,uh=Math.PI/180;function Lr(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function No(i,t,e){return i<t?t:i>e?e:i}function Ra(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Ir(i){const t=i.id,e=i.windowId;Object.assign(i,Ra()),i.id=t,i.windowId=e}function fh(i){Ir(i)}function ph(i){Ir(i.playerLink);for(const t of i.dummies)Ir(t.link)}function mh(i,t){const e=[i.playerLink];for(const n of i.dummies)e.push(n.link);for(const n of e)n.linkWindow=Math.max(0,n.linkWindow-t),n.cooldown=Math.max(0,n.cooldown-t),n.linkWindow===0&&n.phase==="idle"&&n.source!=="none"&&(n.source="none",n.usedWindowId=-1)}function kr(i,t){const e=i.config.links,n=i.playerLink;if(!e.enabled||n.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(n.linkWindow=Math.max(n.linkWindow,s),n.source=t,n.windowId+=1,n.usedWindowId=-1,n.prevSprinting=!1)}function ma(i){const t=i.playerLink;if(t.phase==="idle")return;const e=t.id,n=t.windowId;Object.assign(t,Ra()),t.id=e,t.windowId=n,t.fromX=i.character.position.x,t.fromZ=i.character.position.z}function gh(i,t){const e=i.config.links.search,n=i.character.position,s=No(e.maxAngleDeg,0,180)*uh;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of i.dummies){const l=c.position.x-n.x,h=c.position.z-n.z,f=Math.hypot(l,h);if(f<Dr||f>e.range)continue;const p=Math.atan2(l,h);Math.abs(Sn(p-t))>s||f<o&&(o=f,a=c.id,r=p)}return{id:a,yaw:r,dist:a>0?o:0}}function _h(i,t,e,n){const s=i.config.links,a=i.playerLink,r=i.character.position,o=Ta(i,t),c=gh(i,o),l=c.id>0?c.yaw:o,h=c.id>0?No(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=n,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=h,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,i.dash.cooldown=Math.max(i.dash.cooldown,s.sharedCooldown),Lr(i,"link-start",a.id)}function xh(i,t){const e=i.playerLink;if(e.phase==="idle")return;const n=e.weapon===""?void 0:i.config.links.moves[e.weapon];if(!n){ma(i);return}if(e.weapon!==i.combat.weapon){ma(i);return}e.timer+=t;const s=c=>c==="windup"?n.windup:c==="active"?n.active:n.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Lr(i,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Lr(i,"link-end",e.id))}const r=n.windup+n.active+n.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=n.windup+e.timer:e.phase==="recovery"?o=n.windup+n.active+e.timer:o=r,e.progress=r>0?No(o/r,0,1):1,e.phase==="active"&&n.active>Dr){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Dr,n.active-e.timer),h=c/l;i.impulse.x=Math.sin(e.facing)*h,i.impulse.z=Math.cos(e.facing)*h}}function vh(i,t,e){const n=i.config.links,s=i.playerLink,a=i.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!n.enabled||!i.modules.links){s.phase!=="idle"&&ma(i);return}const r=i.combat,o=i.character.sprinting;o&&n.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&n.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,n.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&kr(i,"sprint"),s.prevSprinting=o,xh(i,t);const c=n.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&i.dash.phase==="idle"&&!!c&&c.enabled&&_h(i,e,c,r.weapon)}const Ur=1e-6;function Zn(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Hl(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Gl(i){const t=i.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=Hl()}function Mh(i){return{weapon:mi[Math.max(0,i-1)]??mi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:Hl()}}function yh(i,t){return Ta(i,t)}function Sh(i,t){const e=i.config.targeting;if(!e.targetAssist||!i.modules.targeting||!i.targeting.hasTarget)return t;const n=i.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*i.config.combat.minLungeScale;return Math.min(Math.max(n,0)+a,s)}function Vl(i,t,e,n){const s=i.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=n,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=yh(i,t),s.attackProgress=0,s.timings=e,s.attackId+=1,Zn(i,"attack-start",n)}function Xl(i){return Math.max(0,i.config.combat.settle)}function Fr(i,t,e){const n=i.config.combat.weapons[i.combat.weapon];Vl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:Xl(i),lunge:Sh(i,n.lunge[e-1]??0)},e)}function bh(i,t,e){const n=i.config.combat.bow.release;i.combat.lastCharge=e,Vl(i,t,{windup:n.windup,active:n.active,recovery:n.recovery,settle:Xl(i),lunge:n.lunge},0),Zn(i,"charge-release",e)}function Eh(i,t,e){const n=i.combat;if(n.phase==="idle")return;const s=n.timings;n.phaseTimer+=t;let a=0;for(;n.phase!=="idle"&&a++<8;){const c=n.phase==="windup"?s.windup:n.phase==="active"?s.active:n.phase==="recovery"?s.recovery:s.settle;if(n.phaseTimer<c)break;if(n.phaseTimer-=c,n.phase==="windup")n.phase="active",Zn(i,"attack-active",n.comboIndex);else if(n.phase==="active")n.phase="recovery";else if(n.phase==="recovery")n.phase="settle",Zn(i,"attack-end",n.comboIndex);else if(n.phase="idle",n.phaseTimer=0,n.comboWindow=i.config.combat.comboWindow,n.queued){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Fr(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}if(n.queued&&n.phase==="recovery"){const c=n.timings.recovery;if(c>Ur&&n.phaseTimer>=c*i.config.combat.cancelWindow){n.queued=!1;const l=i.config.combat.weapons[n.weapon];l.comboCount>0&&Fr(i,e,n.comboIndex<l.comboCount?n.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;n.phase==="windup"?o=n.phaseTimer:n.phase==="active"?o=s.windup+n.phaseTimer:n.phase==="recovery"?o=s.windup+s.active+n.phaseTimer:n.phase==="settle"&&(o=r),n.phase!=="idle"&&(n.attackProgress=r>0?Math.min(1,o/r):1)}function wh(i,t,e){const n=i.combat,s=i.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=mi.length){const c=mi[e.weaponSlot-1];c!==n.weapon&&(n.weapon=c,Gl(i),ma(i),Zn(i,"weapon-change",e.weaponSlot))}n.phase==="idle"&&n.comboWindow>0&&(n.comboWindow=Math.max(0,n.comboWindow-t),n.comboWindow===0&&n.comboIndex>0&&(n.comboIndex=0,Zn(i,"combo-reset",0))),Eh(i,t,e);const a=s.weapons[n.weapon],r=i.dash.phase==="active";if(a.comboCount>0){const c=i.playerLink.phase!=="idle"||i.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(n.phase==="idle"){const h=n.comboWindow>0&&n.comboIndex<a.comboCount?n.comboIndex+1:1;Fr(i,e,h)}else n.queued=!0}else if(n.weapon!=="staff"){if(n.weapon==="bow"&&(!r&&!i.playerLink.consumedAttack&&e.attackPressed&&n.phase==="idle"&&!n.charging&&(n.charging=!0,n.charge=0,Zn(i,"charge-start",0)),n.charging&&e.attackHeld&&(n.charge=Math.min(1,n.charge+t/Math.max(s.bow.maxChargeTime,Ur))),n.charging&&!r&&(e.attackReleased||!e.attackHeld))){n.charging=!1;const c=n.charge;n.charge=0,c>=s.bow.minChargeToFire&&n.phase==="idle"?bh(i,e,c):Zn(i,"charge-release",0)}}if(!(i.playerLink.phase==="active")&&(i.impulse.x=0,i.impulse.z=0,n.phase==="active"&&n.timings.active>Ur)){const c=n.timings.lunge/n.timings.active;i.impulse.x=Math.sin(n.attackFacing)*c,i.impulse.z=Math.cos(n.attackFacing)*c}}const Nr=1e-6;function Oa(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Ah(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Th(i){const t=i.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=i.character.position.x,t.fromZ=i.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function uc(i,t,e){return i<t?t:i>e?e:i}function Rh(i,t,e){const n=i.config.dash,a=i.character.position,r=i.config.worldBounds,o=Math.max(.05,n.blinkStep),c=Math.max(0,n.blinkDistance);let l=0,h=a.x,f=a.z;for(;l<c-Nr;){const p=Math.min(c,l+o),d=a.x+t*p,m=a.z+e*p,_=uc(d,r.minX,r.maxX),g=uc(m,r.minZ,r.maxZ),u={x:_,y:a.y,z:g};if(Fo(i.boxes,u,i.config.characterRadius,i.config.characterHeight,i.config.stepHeight)||(h=_,f=g,l=p,_!==d||g!==m))break}return{x:h,z:f}}function Ch(i,t,e){const n=i.dash,s=i.config.dash;if(n.phase==="active"&&n.timer<=0&&(n.phase="idle",n.timer=0,kr(i,"roll")),n.cooldown>0){const o=n.cooldown;n.cooldown=Math.max(0,n.cooldown-t),o>0&&n.cooldown===0&&Oa(i,"dash-ready",0)}const a=i.combat;if(e.sprintPressed&&n.cooldown<=0&&n.phase==="idle"&&a.phase==="idle"&&!a.charging&&i.playerLink.phase==="idle"){const o=qd(i,e),c=o.x,l=o.z,h=i.combat.weapon==="staff";if(n.kind=h?"blink":"roll",n.dirX=c,n.dirZ=l,n.fromX=i.character.position.x,n.fromZ=i.character.position.z,n.id+=1,n.cooldown=h?s.blinkCooldown:s.rollCooldown,h){const f=Rh(i,c,l);i.character.position.x=f.x,i.character.position.z=f.z,n.toX=f.x,n.toZ=f.z,n.duration=0,n.timer=0,n.phase="idle",s.blinkClearVelocity&&(i.character.velocity.x=0,i.character.velocity.z=0),kr(i,"blink"),Oa(i,"blink",n.id)}else n.phase="active",n.duration=Math.max(Nr,s.rollDuration),n.timer=n.duration,n.toX=n.fromX+c*s.rollDistance,n.toZ=n.fromZ+l*s.rollDistance,Oa(i,"roll",n.id)}if(n.phase==="active"&&n.kind==="roll"){const o=Math.max(Nr,n.timer),c=i.character.position.x,l=i.character.position.z;i.impulse.x=(n.toX-c)/o,i.impulse.z=(n.toZ-l)/o}n.phase==="active"&&(n.timer=Math.max(0,n.timer-t))}const tn=1e-6,zr=Math.PI*2,Ph=7,Dh=18;function fc(i,t,e){return i<t?t:i>e?e:i}function Lh(i){return Math.atan2(Math.sin(i),Math.cos(i))}function pc(i,t,e,n){return i+Lh(t-i)*(1-Math.exp(-Math.max(e,tn)*n))}function zo(i,t,e){i.events.push({type:t,tick:i.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Ih(i){const t=[];for(let e=0;e<i.count;e++){const n=i.spawn[e]??{x:0,z:0},s=i.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:n.x,homeZ:n.z,position:{x:n.x,y:0,z:n.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:n.x,targetZ:n.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:zl(),link:Ra()})}return t}function kh(i){const t=Fa.indexOf(i);return Fa[(t+1)%Fa.length]}function Uh(i){const t=i.config.dummies;for(let e=0;e<i.dummies.length;e++){const n=i.dummies[e],s=t.spawn[e]??{x:n.homeX,z:n.homeZ},a=t.initialModes[e]??n.initialMode;n.mode=a,n.initialMode=a,n.homeX=s.x,n.homeZ=s.z,n.position.x=s.x,n.position.y=0,n.position.z=s.z,n.velocity.x=0,n.velocity.y=0,n.velocity.z=0,n.facing=0,n.bodyYaw=0,n.headYaw=0,n.gaitPhase=0,n.stride=1,n.distance=0,n.targetX=s.x,n.targetZ=s.z,n.wanderTimer=0,n.attackCooldown=0,n.attackPhase="idle",n.attackPhaseTimer=0,n.attackProgress=0;const r=n.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,fh(n.link)}i.dummyAttackCount=0}function Fh(i,t,e){const n=Na(i)*zr,s=Math.sqrt(Na(i))*e.wanderRadius;t.targetX=t.homeX+Math.cos(n)*s,t.targetZ=t.homeZ+Math.sin(n)*s,t.wanderTimer=e.wanderInterval*(.6+Na(i)*.8)}function Nh(i,t){return i.attackPhase==="windup"?t.attackWindup:i.attackPhase==="active"?t.attackActive:i.attackPhase==="recovery"?t.attackRecovery:0}function zh(i,t,e,n){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(Nh(t,n),tn);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",zo(i,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=n.attackWindup+n.attackActive+n.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=n.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=n.attackWindup+n.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function Oh(i,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const n=i.character.position,s=n.x-t.position.x,a=n.z-t.position.z,r=Math.hypot(s,a),o=r>tn?s/r:0,c=r>tn?a/r:0;let l=0,h=0;if(t.mode==="wander"){const p=t.targetX-t.position.x,d=t.targetZ-t.position.z,m=Math.hypot(p,d);(t.wanderTimer<=0||m<.3)&&Fh(i,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,u=Math.hypot(_,g);u>tn&&(l=_/u,h=g/u)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,h=c);else if(t.mode==="keep-distance"){const p=r-e.keepDistance;p>e.keepDeadZone?(l=o,h=c):p<-e.keepDeadZone?(l=-o,h=-c):(l=-c*e.keepStrafe,h=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,h=c);let f=t.facing;return t.mode==="wander"?Math.hypot(l,h)>tn&&(f=Math.atan2(l,h)):r>tn&&(f=Math.atan2(o,c)),{x:l,z:h,facing:f}}function Bh(i,t,e,n){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const g=i.character.position;Math.hypot(g.x-e.position.x,g.z-e.position.z)<=n.attackRange+tn&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=n.attackInterval,i.dummyAttackCount+=1,zo(i,"dummy-attack",e))}zh(i,e,t,n);const s=Oh(i,e,n),a=1-Math.exp(-Math.max(n.acceleration,tn)*t);e.velocity.x+=(s.x*n.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*n.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=pc(e.bodyYaw,e.facing,Ph,t),e.headYaw=pc(e.headYaw,e.facing,Dh,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=i.config.stepHeight;Uo(i.boxes,e.position,n.radius,n.height,c)&&Fo(i.boxes,e.position,n.radius,n.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const h=i.config.worldBounds;e.position.x=fc(e.position.x,h.minX,h.maxX),e.position.z=fc(e.position.z,h.minZ,h.maxZ);const f=Cr(i.boxes,e.position.x,e.position.z,e.position.y,n.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+tn&&(e.position.y=f);const p=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=p;const d=Math.hypot(e.velocity.x,e.velocity.z),m=Math.min(i.config.strideSpeedCap,d/Math.max(i.config.moveSpeed,tn)),_=Math.max(i.config.strideLength*(1+m*i.config.strideSpeedGain),tn);e.stride=_,e.gaitPhase=(e.gaitPhase+p/_*zr)%zr}function Hh(i,t,e){const n=i.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=i.dummies.length){const s=i.dummies[e.dummyClickId-1];s.mode=kh(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,zo(i,"dummy-mode",s)}for(const s of i.dummies)Bh(i,t,s,n)}const yi=1e-6,mc=Math.PI*2;function Ba(i,t){return Math.sqrt(i*i+t*t)}function ws(i,t,e){const n=i.character.position;i.events.push({type:t,tick:i.tick,x:n.x,y:n.y,z:n.z,value:e})}function Gh(i){const t=i.character,e=i.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=i.config.strideLength,t.distance=0,t.coyoteTime=i.config.coyoteTime,t.jumpBuffer=0,Gl(i)}function Vh(i,t,e){const n=i.config,s=i.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Ba(o,c);l>1&&(o/=l,c/=l);const h=i.combat.phase!=="idle",f=i.playerLink.phase!=="idle",p=h||i.dash.phase==="active"||f;s.sprinting=!p&&e.sprintHeld&&l>yi;const d=n.combat.weapons[i.combat.weapon];let m=d?d.moveMultiplier:1;p?m*=i.combat.phase==="settle"?n.combat.settleMoveScale:n.combat.attackMoveScale:i.combat.charging?m*=n.combat.bow.chargeMoveMultiplier:i.abilities.channeling&&(m*=n.abilities.arcane.moveScale);const _=n.moveSpeed*(s.sprinting?n.sprintMultiplier:1)*m;if(p)r.x=o*_,r.z=c*_;else{const G=l>yi?n.acceleration:n.friction,F=1-Math.exp(-G*t);r.x+=(o*_-r.x)*F,r.z+=(c*_-r.z)*F}e.jumpPressed?s.jumpBuffer=n.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?n.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=n.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,ws(i,"jumped",n.jumpSpeed)),i.events.some(G=>G.type==="blink"&&G.tick===i.tick)&&(r.x=0,r.z=0,i.impulse.x=0,i.impulse.z=0);const u=a.x,x=a.z;if(a.x+=(r.x+i.impulse.x+i.playerHurt.knockX)*t,a.z+=(r.z+i.impulse.z+i.playerHurt.knockZ)*t,Uo(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight)){if(Fo(i.boxes,a,n.characterRadius,n.characterHeight,n.stepHeight))a.x=u,a.z=x,r.x=0,r.z=0;else{const G=a.x-u,F=a.z-x;Math.abs(G)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(F)<Math.abs(r.z*t)*.5&&(r.z=0)}ws(i,"blocked",1)}const v=n.worldBounds;a.x=gc(a.x,v.minX,v.maxX),a.z=gc(a.z,v.minZ,v.maxZ);const L=Cr(i.boxes,a.x,a.z,a.y,n.characterRadius,n.stepHeight,n.fallTolerance);s.grounded&&L>a.y+yi&&L-a.y<=n.stepHeight+yi&&(a.y=L,r.y=0,ws(i,"stepUp",L));const R=a.y;r.y-=n.gravity*t,a.y+=r.y*t;const C=Cr(i.boxes,a.x,a.z,R,n.characterRadius,n.stepHeight,Number.POSITIVE_INFINITY);C>Number.NEGATIVE_INFINITY&&a.y<=C&&r.y<=0?(a.y=C,r.y=0,s.grounded||ws(i,"landed",C),s.grounded=!0):s.grounded=!1;const D=Ba(a.x-u,a.z-x);s.distance+=D;const b=Ba(r.x,r.z),y=Math.min(n.strideSpeedCap,b/Math.max(n.moveSpeed,yi)),P=Math.max(n.strideLength*(1+y*n.strideSpeedGain),yi);s.stride=P,s.gaitPhase=(s.gaitPhase+D/P*mc)%mc}function gc(i,t,e){return i<t?t:i>e?e:i}const Xh=1e-6,_c=2.399963229728653;function xc(i,t,e){return i<t?t:i>e?e:i}function vc(i,t,e,n,s,a,r,o,c){const l=t.x-i.x,h=t.z-i.z,f=Math.hypot(l,h),p=e+n;if(f>=p)return;let d,m,_;f<Xh?(d=o,m=c,_=p):(d=l/f,m=h/f,_=p-f);const g=_+r;i.x-=d*g*s,i.z-=m*g*s,t.x+=d*g*a,t.z+=m*g*a}function Wh(i){const t=i.config.separation,e=i.dummies,n=i.character.position,s=i.config.characterRadius,a=i.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let h=0;h<r;h++){for(let f=0;f<e.length;f++)for(let p=f+1;p<e.length;p++){const d=(f*3+p)*_c;vc(e[f].position,e[p].position,a,a,.5,.5,o,Math.cos(d),Math.sin(d))}for(let f=0;f<e.length;f++){const p=(f+1)*_c;vc(n,e[f].position,s,a,0,1,o,Math.cos(p),Math.sin(p))}}const c=i.config.stepHeight,l=i.config.worldBounds;for(const h of e)Uo(i.boxes,h.position,a,i.config.dummies.height,c),h.position.x=xc(h.position.x,l.minX,l.maxX),h.position.z=xc(h.position.z,l.minZ,l.maxZ)}const Mc=1e-6,$h=Math.PI/180;function Yh(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Zh(i,t,e){return i<t?t:i>e?e:i}function qh(i,t,e){const n=i.config.targeting,s=i.targeting,a=i.character.position;let r=i.character.facing;Math.hypot(e.moveX,e.moveZ)>Mc&&(r=Math.atan2(e.moveX,e.moveZ));const c=Zh(n.maxAngleDeg,0,180)*$h;let l=Number.POSITIVE_INFINITY,h=0,f=0,p=0;for(const d of i.dummies){const m=d.position.x-a.x,_=d.position.z-a.z,g=Math.hypot(m,_);if(g<Mc||g>n.range)continue;const u=Math.atan2(m,_),x=Math.abs(Sn(u-r));if(x>c)continue;const S=g-n.frontBias*Math.cos(x);S<l&&(l=S,h=d.id,f=u,p=g)}s.targetId=h,s.targetYaw=f,s.targetDist=p,s.hasTarget=h>0}function jh(i,t){return{tick:0,time:0,rngState:2654435769,config:i,boxes:dh(t),gridMeta:t.grid,character:{position:{x:i.spawn.x,y:i.spawn.y,z:i.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:i.strideLength,distance:0,coyoteTime:i.coyoteTime,jumpBuffer:0},combat:Mh(1),playerLink:Ra(),abilities:eh(),impulse:{x:0,z:0},targeting:Yh(),playerHurt:zl(),hitCount:0,dash:{...Ah(),fromX:i.spawn.x,fromZ:i.spawn.z,toX:i.spawn.x,toZ:i.spawn.z},camera:{...Ol(),centroidX:i.spawn.x,centroidZ:i.spawn.z},dummies:Ih(i.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,dummies:!0}}}function Kh(i){Gh(i),Uh(i),ph(i);const t=i.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=i.playerHurt;e.type="none",e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,i.hitCount=0,nh(i),Th(i),Bl(i),i.events.length=0}function yc(i,t,e){if(i.events.length=0,i.tick+=1,i.time+=t,i.impulse.x=0,i.impulse.z=0,e.resetPressed){Kh(i);const n=i.config.spawn;return i.events.push({type:"reset",tick:i.tick,x:n.x,y:n.y,z:n.z,value:0}),i}return i.modules.dummies&&i.modules.targeting?qh(i,t,e):(i.targeting.targetId=0,i.targeting.targetYaw=0,i.targeting.targetDist=0,i.targeting.hasTarget=!1),vh(i,t,e),i.modules.combat&&wh(i,t,e),i.modules.dash&&Ch(i,t,e),i.modules.movement&&Vh(i,t,e),i.modules.orientation&&hh(i,t,e),i.modules.dummies&&Hh(i,t,e),jd(i,t),mh(i,t),i.modules.abilities&&ch(i,t,e),i.modules.dummies&&(th(i,t),i.modules.separation&&Wh(i)),i.modules.camera?lh(i):Bl(i),i}function Jh(i){let t=0;return{frame(e,n,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=i.config.fixedDt,c=i.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const h=l===0?n:{...n,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};yc(i,o,h),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){yc(i,i.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Wl={slopPx:12,longPressMs:450,doubleTapMs:280};function Qh(i,t,e=Wl.slopPx){if(i.distance<e)return{...i,worldX:0,worldZ:0};const n=i.dx/i.distance,s=i.dy/i.distance,a=t.rightX*n+t.forwardX*-s,r=t.rightZ*n+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...i,worldX:0,worldZ:0}:{...i,worldX:a/o,worldZ:r/o}}function ti(i,t,e,n,s,a){const r=Math.hypot(e,n);return{button:i,kind:t,dx:e,dy:n,distance:r,angleDeg:r>.001?Math.atan2(n,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function tu(i=Wl){const t=new Map,e=new Map,n=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),ti(s,"press",0,0,0,1)},move(s,a,r,o){const c=n(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY;return!c.dragging&&Math.hypot(l,h)>=i.slopPx?(c.dragging=!0,ti(c.button,"drag",l,h,o-c.startedAt,1)):null},end(s,a,r,o){const c=n(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY,f=o-c.startedAt,p=Math.hypot(l,h);if(c.dragging||c.longFired||p>=i.slopPx)return ti(c.button,"release",l,h,f,1);const d=e.get(c.button);return d!==void 0&&o-d.at<=i.doubleTapMs&&Math.hypot(a-d.x,r-d.y)<=i.slopPx*2?(e.delete(c.button),ti(c.button,"doubleTap",l,h,f,2)):(e.set(c.button,{at:o,x:a,y:r}),ti(c.button,"tap",l,h,f,1))},cancel(s,a){const r=n(s);return r?(t.delete(s),ti(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=i.longPressMs)return a.longFired=!0,ti(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const Ha=.001,eu=18;function Or(i,t,e){return i<t?t:i>e?e:i}function Br(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function nu(i){const t=i.length;if(t<2)return null;const e=i[t-2],n=i[t-1];return e.id===n.id?null:[e,n]}function iu(i,t,e,n,s=eu){const a=nu(t);if(!a)return{state:Br(),scale:1,started:!1,ended:i.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(n)?n:1.25),l=1/c,h=c;if(!Number.isFinite(r)||r<Ha)return{state:{active:!0,lastDist:0,armDist:0,armed:i.armed},scale:1,started:!i.active,ended:!1,armedNow:!1,pinching:i.armed};if(!i.active){const m=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!i.armed)return i.armDist<Ha?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-i.armDist)<o?{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(i.lastDist<Ha)return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=r/i.lastDist,p=Math.max(0,Number.isFinite(e)?e:1),d=Number.isFinite(f)&&f>0?Math.pow(f,p):1;return{state:{active:!0,lastDist:r,armDist:i.armDist,armed:!0},scale:Or(Number.isFinite(d)?d:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function su(i,t,e,n){const s=Math.min(e,n),a=Math.max(e,n),r=Number.isFinite(t)&&t>0?t:1,o=i*r;return Number.isFinite(o)?Or(o,s,a):Or(i,s,a)}function au(i,t){const e=Number.isFinite(t)&&t>0?t:1,n=Number.isFinite(i)?i:0;return Math.pow(e,n/100)}function ru(){const i=typeof window<"u"?window.visualViewport:null;return i?{left:i.offsetLeft,top:i.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Ga=["jump","sprint","reset","attack","skill2"],ou=8,cu=26,Va=16,Sc=20,bc=140,lu=18,du=16,hu=400,uu=1.0001;function sa(i){return i instanceof Element&&i.closest("[data-ui-button], [data-ui-region], #debug-panel, #hud, #weapon-bar, #hint")!==null}function fu(i,t){if(!Number.isFinite(i)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(i,t);return e instanceof Element&&sa(e)}function pu(i){const{maxRadiusPx:t,deadZone:e,getBasis:n,zoom:s}=i,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,h=0,f=0,p=0,d=-1,m=0,_=null,g=-1,u=0,x=0,S=0,v=0,L=!1,R=0,C=1,D=0,b=null,y=0,P=0,G=!1,F=null,W=null,T=0,A=0,B=0,O=0,$=!1,it=!0,mt=-1;const ct=tu({slopPx:Sc,longPressMs:450,doubleTapMs:350});let gt=[],Y=null;const nt=new Set;function ot(z){z&&gt.push(z)}const rt=new Map;let xt=Br(),Ct=!1,Lt=1;function Ht(){const z=Array.from(rt.values()),st=s(),dt=iu(xt,z,st.pinchGain,st.maxStepRatio,lu);if(xt=dt.state,Ct=dt.pinching,dt.scale!==1&&(Lt*=dt.scale),dt.started||dt.armedNow)b=null,G=!0,F=null;else if(dt.ended&&r===null&&z.length===1){const kt=z[0];r=kt.id,o=kt.x,c=kt.y,l=0,h=0,f=kt.x,p=kt.y,L=!1,R=0,C=1,D=0,performance.now(),b=null,G=!0,F=null}}const wt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},It={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let k=0,re=0;const Rt={},Pt=new Set,q=[];function ht(){for(const z of Ga)Rt[z]!==void 0&&(Rt[z]=void 0),N(z);ct.reset(),nt.clear(),rt.clear(),xt=Br(),Ct=!1,r=null,l=0,h=0,f=0,p=0,L=!1,R=0,C=1,D=0,u=0,x=0,S=0,v=0,_=null,g=-1,b=null,G=!1,F=null,W=null,mt=-1,B=0,O=0,$=!1,it=!0}const pt=()=>{document.hidden&&ht()},w=z=>{if(z.clientX===0&&z.clientY===0){m++;return}if(sa(z.target)||fu(z.clientX,z.clientY)){nt.add(z.pointerId);return}if(nt.delete(z.pointerId),rt.set(z.pointerId,{id:z.pointerId,x:z.clientX,y:z.clientY}),r===null&&!Ct){_=null,g=-1,r=z.pointerId,o=z.clientX,c=z.clientY,l=0,h=0,f=z.clientX,p=z.clientY,performance.now();const st=Number.isFinite(z.screenX)&&Number.isFinite(z.screenY)&&(z.screenX!==0||z.screenY!==0);L=st,R=0,C=1,D=0,u=st?z.screenX:0,x=st?z.screenY:0,S=u,v=x,b=z.pointerId,y=z.clientX,P=z.clientY,G=!1}Ht()},M=z=>{if(z.pointerId===W&&(z.pointerType==="mouse"&&z.buttons===0||z.clientX===0&&z.clientY===0&&(T!==0||A!==0)||(it?(B=z.clientX-T,O=z.clientY-A):(T=z.clientX,A=z.clientY,it=!0,B=0,O=0))),ot(ct.move(z.pointerId,z.clientX,z.clientY,performance.now())),!nt.has(z.pointerId)&&rt.has(z.pointerId)&&(rt.set(z.pointerId,{id:z.pointerId,x:z.clientX,y:z.clientY}),Ht()),nt.has(z.pointerId)||z.pointerId!==r)return;const st=performance.now();if(_===z.pointerId&&st-g<150){m++;return}const dt=z.clientX,kt=z.clientY;if(dt===0&&kt===0&&(o!==0||c!==0)){m++;return}const Xt=dt-f,I=kt-p,Mt=Number.isFinite(z.screenX)&&Number.isFinite(z.screenY),j=Mt?z.screenX:0,at=Mt?z.screenY:0,Et=Mt&&(j!==0||at!==0),St=j-S,Gt=at-v;if(L&&Et){const Ot=Math.hypot(St,Gt),Qt=Math.hypot(Xt,I);if(Ot>3){if(R=0,D<30&&Qt>6&&St*Xt+Gt*I>.7*Ot*Qt){const me=Ot/Qt;me>.2&&me<5&&(C+=(me-C)*.3,D++)}}else Qt>12&&(R++,R>=2&&(L=!1))}const Zt=Math.hypot(Xt,I);if(!L){const Ot=d<0?Number.POSITIVE_INFINITY:st-d,Qt=Et?Math.hypot(St,Gt):1/0;Zt>28&&(Ot<200||Qt<Zt*.4)&&(o+=Xt,c+=I,m++)}f=dt,p=kt,S=j,v=at,z.pointerId===b&&Math.hypot(z.clientX-y,z.clientY-P)>ou&&(G=!0);let ie,Z;L&&Et?(ie=(j-u)/C,Z=(at-x)/C):(ie=dt-o,Z=kt-c);const _t=Math.hypot(ie,Z),yt=a();_t>yt&&(ie*=yt/_t,Z*=yt/_t);const Dt=Math.hypot(l,h),$t=Math.hypot(ie,Z);if(Dt>10&&$t>10){const Ot=Math.abs(Math.atan2(l*Z-h*ie,l*ie+h*Z)),Qt=Math.max(Dt,$t)*Ot,me=Math.max(Math.hypot(Xt,I),Math.hypot(St,Gt)/Math.max(.2,C));if(Ot>.6&&me<Math.max(6,Qt*.5)){m++;return}}l=ie,h=Z};function N(z){if(!wt[z])return;wt[z]=!1,z==="attack"&&(It.attackReleased=!0);const st=document.getElementById(`btn-${z}`);st==null||st.classList.remove("is-down")}function U(){r!==null&&(_=r,g=performance.now(),r=null,l=0,h=0,f=0,p=0,L=!1,R=0,C=1,D=0,u=0,x=0,S=0,v=0)}const Q=z=>{const st=rt.delete(z.pointerId),dt=nt.delete(z.pointerId);st&&Ht(),z.pointerId===W&&(W=null,$?mt=performance.now():(B=0,O=0,mt=-1)),ot(ct.end(z.pointerId,z.clientX,z.clientY,performance.now()));for(const Ut of Ga)Rt[Ut]===z.pointerId&&(Rt[Ut]=void 0,N(Ut));const kt=!st&&!dt&&rt.size<=1&&r!==null;(z.pointerId===r||rt.size===0||kt)&&U(),!dt&&z.pointerId===b&&(!G&&!sa(z.target)&&(F={x:z.clientX,y:z.clientY}),b=null)};for(const z of Ga){const st=document.getElementById(`btn-${z}`);if(!st)continue;const dt=z==="attack"||z==="skill2",kt=I=>{if(I.preventDefault(),Rt[z]===void 0){Rt[z]=I.pointerId,wt[z]=!0,z==="jump"&&(It.jump=!0),z==="reset"&&(It.reset=!0),z==="sprint"&&(It.sprintPressed=!0),z==="attack"&&(It.attackPressed=!0),z==="skill2"&&(It.skill2=!0),st.classList.add("is-down"),ot(ct.begin(z,I.pointerId,I.clientX,I.clientY,performance.now()));try{st.setPointerCapture(I.pointerId)}catch{}dt&&(W=I.pointerId,T=I.clientX,A=I.clientY,it=!(I.clientX===0&&I.clientY===0),B=0,O=0,$=!1,mt=-1)}},Ut=I=>{Rt[z]===I.pointerId&&(Rt[z]=void 0,N(z),ot(ct.end(I.pointerId,I.clientX,I.clientY,performance.now())))},Xt=I=>{Rt[z]===I.pointerId&&(Rt[z]=void 0,N(z),ot(ct.cancel(I.pointerId,performance.now())))};st.addEventListener("pointerdown",kt),st.addEventListener("pointerup",Ut),st.addEventListener("pointercancel",Xt),q.push(()=>{st.removeEventListener("pointerdown",kt),st.removeEventListener("pointerup",Ut),st.removeEventListener("pointercancel",Xt)})}const et=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const z of et){const st=dt=>{dt.preventDefault(),k=Number(z.dataset.weapon)||0};z.addEventListener("pointerdown",st),q.push(()=>z.removeEventListener("pointerdown",st))}const K=z=>{const st=z.key.toLowerCase();if((st===" "||st.startsWith("arrow"))&&z.preventDefault(),Pt.has(st))return;Pt.add(st),st===" "&&(It.jump=!0),st==="r"&&(It.reset=!0),st==="shift"&&(It.sprintPressed=!0),st==="j"&&(It.attackPressed=!0),st==="k"&&(It.skill2=!0),st>="1"&&st<="5"&&(k=Number(st)),st>="6"&&st<="9"&&(re=Number(st)-5);const dt=Math.max(uu,s().keyStep||1.12);(st==="="||st==="+")&&(Lt*=dt),(st==="-"||st==="_")&&(Lt/=dt)},lt=z=>{const st=z.key.toLowerCase();Pt.has(st)&&(Pt.delete(st),st==="j"&&(It.attackReleased=!0))},ut=z=>{if(sa(z.target))return;z.preventDefault();const st=z.deltaMode===1?z.deltaY*du:z.deltaMode===2?z.deltaY*hu:z.deltaY;Lt*=au(st,s().wheelStep)},Wt=z=>{z.preventDefault()},ft=()=>{d=performance.now()};window.addEventListener("resize",ft),window.addEventListener("orientationchange",ft);const bt=typeof window<"u"?window.visualViewport:null;return bt&&(bt.addEventListener("resize",ft),bt.addEventListener("scroll",ft)),window.addEventListener("pointerdown",w),window.addEventListener("pointermove",M),window.addEventListener("pointerup",Q),window.addEventListener("pointercancel",Q),window.addEventListener("blur",ht),document.addEventListener("visibilitychange",pt),window.addEventListener("keydown",K),window.addEventListener("keyup",lt),window.addEventListener("wheel",ut,{passive:!1}),window.addEventListener("gesturestart",Wt),{peekStick(){return{id:r,held:r!==null,originX:o,originY:c,x:f,y:p,dx:f-o,dy:p-c,radius:a(),badMoves:m,screenOk:L,originSX:u,originSY:x,screenX:S,screenY:v,scale:C}},peekAim(){const z=performance.now(),st=Math.hypot(B,O),dt=W!==null||mt>=0&&z-mt<bc;if(!(dt&&$&&st>=Va))return{active:!1,holding:dt,x:0,z:0,dx:B,dy:O};const Ut=n(),Xt=B/st,I=O/st,Mt=Ut.rightX*Xt+Ut.forwardX*-I,j=Ut.rightZ*Xt+Ut.forwardZ*-I,at=Math.hypot(Mt,j)||1;return{active:!0,holding:dt,x:Mt/at,z:j/at,dx:B,dy:O}},sample(){var Le;const z=a();let st=r!==null?Math.max(-1,Math.min(1,l/z)):0,dt=r!==null?Math.max(-1,Math.min(1,h/z)):0,kt=0,Ut=0;(Pt.has("a")||Pt.has("arrowleft"))&&(kt-=1),(Pt.has("d")||Pt.has("arrowright"))&&(kt+=1),(Pt.has("w")||Pt.has("arrowup"))&&(Ut-=1),(Pt.has("s")||Pt.has("arrowdown"))&&(Ut+=1),st+=kt,dt+=Ut;let Xt=Math.hypot(st,dt);Xt>1&&(st/=Xt,dt/=Xt,Xt=1);const I=st,Mt=dt;Xt<e&&(st=0,dt=0);const j=n();let at=j.rightX*st+j.forwardX*-dt,Et=j.rightZ*st+j.forwardZ*-dt;const St=Math.hypot(at,Et);St>1&&(at/=St,Et/=St);const Gt=performance.now();ot(ct.poll(Gt));const Zt=Math.hypot(B,O);W!==null&&(Zt>=cu?$=!0:Zt<Va&&($=!1));const ie=W!==null||mt>=0&&Gt-mt<bc,Z=ie&&$&&Zt>=Va;let _t=0,yt=0;if(Z){const se=B/Zt,ye=O/Zt,Re=j.rightX*se+j.forwardX*-ye,Ze=j.rightZ*se+j.forwardZ*-ye,wn=Math.hypot(Re,Ze)||1;_t=Re/wn,yt=Ze/wn}!ie&&W===null&&(B=0,O=0,mt=-1,$=!1);const Dt=F;F=null;const $t=Lt;Lt=1;const Ot={moveX:at,moveZ:Et,jumpPressed:It.jump,sprintHeld:wt.sprint||Pt.has("shift"),sprintPressed:It.sprintPressed,resetPressed:It.reset,attackPressed:It.attackPressed,attackHeld:wt.attack||Pt.has("j"),attackReleased:It.attackReleased,skill2Pressed:It.skill2,weaponSlot:k,dummyClickId:re,aimX:_t,aimZ:yt,aimActive:Z};It.jump=!1,It.reset=!1,It.sprintPressed=!1,It.attackPressed=!1,It.attackReleased=!1,It.skill2=!1,k=0,re=0;const Qt=gt.map(se=>Qh(se,j,Sc));gt=[],Qt.length>0&&(Y=Qt[Qt.length-1]);const me=r!==null?"pointer":Pt.size>0?"keyboard":"idle";return{intents:Ot,stickX:st,stickY:dt,stickRawX:I,stickRawY:Mt,stickHeld:r!==null,stickId:r,stickOriginX:o,stickOriginY:c,stickPxX:f,stickPxY:p,stickBad:m,stickScreenOk:L,stickOriginSX:u,stickOriginSY:x,stickScreenX:S,stickScreenY:v,stickScale:C,stickVpTop:((Le=ru())==null?void 0:Le.top)??0,stickVpAge:d<0?-1:Math.round(performance.now()-d),aimDX:B,aimDY:O,source:me,tap:Dt,zoomScale:$t,gestures:Qt,lastGesture:Y}},dispose(){window.removeEventListener("pointerdown",w),window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",Q),window.removeEventListener("pointercancel",Q),window.removeEventListener("blur",ht),document.removeEventListener("visibilitychange",pt),window.removeEventListener("keydown",K),window.removeEventListener("keyup",lt),window.removeEventListener("wheel",ut),window.removeEventListener("resize",ft),window.removeEventListener("orientationchange",ft),bt&&(bt.removeEventListener("resize",ft),bt.removeEventListener("scroll",ft)),window.removeEventListener("gesturestart",Wt),ct.reset();for(const z of q)z()}}}const ga=1,_a=2,xa=4,$l=8,va=16,ms=32,Yl=64,Zl=128,mu=[[ga,"atk"],[_a,"dash"],[xa,"link"],[$l,"air"],[va,"hurt"],[ms,"aim"],[Yl,"spr"],[Zl,"chan"]];function Si(i){if(i===0)return"-";const t=mu.filter(([e])=>(i&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const gu=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],_u=0,xu=15,Xa=19,vu=21,Mu=22,yu=23,Su=24,pn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Be=i=>Number.isFinite(i)?Math.round(i*1e3)/1e3:0,sn=i=>Math.round(i*180/Math.PI*10)/10,Wa=Math.PI*2;function is(i){let t=i%Wa;return t>Math.PI&&(t-=Wa),t<-Math.PI&&(t+=Wa),t}function bu(i,t){let e=0;return i.combat.phase!=="idle"&&(e|=ga),i.dash.phase!=="idle"&&(e|=_a),i.playerLink.phase!=="idle"&&(e|=xa),i.character.grounded||(e|=$l),i.playerHurt.type!=="none"&&(e|=va),t.intents.aimActive&&(e|=ms),i.character.sprinting&&(e|=Yl),i.abilities.channeling&&(e|=Zl),e}function Eu(i){const t=`(${i.x.toFixed(1)},${i.z.toFixed(1)})`;switch(i.type){case"attack-start":return`slot${i.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${i.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${i.value} ${t}`;case"weapon-change":return`slot${i.value}`;case"dummy-mode":return`dummy${i.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return i.value!==0?`v${i.value}`:""}}function wu(i){const t={sampleHz:i.sampleHz??pn.sampleHz,sampleCapacity:i.sampleCapacity??pn.sampleCapacity,eventCapacity:i.eventCapacity??pn.eventCapacity,anomalyCapacity:i.anomalyCapacity??pn.anomalyCapacity,dirJumpDeg:i.dirJumpDeg??pn.dirJumpDeg,aimDropDeg:i.aimDropDeg??pn.aimDropDeg,freezeMs:i.freezeMs??pn.freezeMs,freezeSpeed:i.freezeSpeed??pn.freezeSpeed,stickLostMs:i.stickLostMs??pn.stickLostMs,spikeMs:i.spikeMs??pn.spikeMs},e=i.meta,n=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let o=!0,c=-1,l=-1e9,h=null,f=0,p=0,d="",m=-1,_=-1,g=-1,u=0,x=-1e9,S=-1,v={},L=null,R=0,C=0,D=0,b=0;function y(T,A){const B=1/t.sampleHz,O=T[_u];O-l<B-1e-6||(n.length>=t.sampleCapacity&&n.shift(),n.push(T),l=O)}function P(T,A,B,O,$,it){const mt=v[T]??-1e9;if(A-mt<1.2)return;if(v[T]=A,T==="frameSpike"){let gt=0;for(const Y of a)Y.kind==="frameSpike"&&gt++;if(gt>=6)return}a.length>=t.anomalyCapacity&&a.shift();let ct=n.slice(-7);it&&(ct.length===0||ct[ct.length-1]!==it)&&(ct=[...ct.slice(-6),it]),a.push({kind:T,t:Be(A),tick:B,ms:Math.round(O),detail:$,ctx:ct}),T==="dirJump"?r.dirJumps++:T==="aimDrop"?r.aimDrops++:T==="moveFreeze"?r.freezes++:T==="stickLost"?r.stickLosts++:T==="stickJump"?r.stickJumps++:T==="stickBad"?r.stickBads++:T==="stickDrift"&&r.stickDrifts++}function G(T,A,B,O){s.length>=t.eventCapacity&&s.shift(),s.push({t:Be(B),tick:O,k:T,d:A})}function F(T){switch(T.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=T.tick;break}}function W(){const T=r,A=T.wallMs/1e3,B=T.gestures,O=ct=>Object.entries(B).filter(([gt])=>gt.endsWith(`.${ct}`)).reduce((gt,[,Y])=>gt+Y,0),$=[];if($.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),$.push(`运行 ${A.toFixed(1)}s / ${T.frames} 帧 · ${T.fps.toFixed(1)}fps · 最大 ${T.dtMax.toFixed(0)}ms · 尖峰 ${T.spikes} · 步 ${T.steps}`),$.push(`摇杆活跃 ${A>0?Math.round(T.stickActiveMs/1e3/A*100):0}% · 手势 按下 ${O("press")}（单击 ${O("tap")} / 双击 ${O("doubleTap")} / 拖拽 ${O("drag")} / 长按 ${O("longPress")} / 打断 ${O("cancel")} / 拖放 ${O("release")}）`),$.push(`攻击 ${T.attacks}(中${T.hits}) · 受击 ${T.hurts} · 派生 ${T.links}(中${T.linkHits}) · 翻滚 ${T.rolls} 闪现 ${T.blinks} · 跳 ${T.jumps} · 复位 ${T.resets}`),$.push(`法杖 引导${T.channels} 飞弹${T.bolts} 电环${T.rings} · 弓蓄力${T.bowCharges} · 当前武器 ${d||"-"}`),$.push(`异常 ${T.dirJumps+T.aimDrops+T.freezes+T.stickLosts+T.stickJumps+T.stickBads+T.stickDrifts}（dir ${T.dirJumps} / aim ${T.aimDrops} / freeze ${T.freezes} / stick ${T.stickLosts} / stickJump ${T.stickJumps} / 坏指针 ${T.stickBads} / 坐标漂移 ${T.stickDrifts}） · 掉帧尖峰 ${T.spikes}`+(T.inTurns>0?` · 输入转向 ${T.inTurns} 次（最大 ${T.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const ct of a.slice(-6)){$.push(`· ${ct.kind} @t${ct.t.toFixed(2)} tick${ct.tick} ${ct.ms>0?`${ct.ms}ms `:""}${ct.detail}`);const gt=ct.ctx.map(nt=>String(nt[xu])).join(" "),Y=ct.ctx.map(nt=>nt[Xa]===""||nt[Xa]==null?".":String(nt[Xa])).join(" ");if($.push(`  yaw ${gt}`),$.push(`  in  ${Y}`),ct.kind==="stickJump"||ct.kind==="stickBad"||ct.kind==="stickLost"){const nt=ct.ctx.map(rt=>`${rt[vu]},${rt[Mu]}`).join(" "),ot=ct.ctx.map(rt=>`${rt[yu]},${rt[Su]}`).join(" ");$.push(`  o   ${nt}`),$.push(`  p   ${ot}`)}}if(s.length>0){$.push("最近事件：");for(const ct of s.slice(-12))$.push(`  ${ct.t.toFixed(2)} ${ct.k} ${ct.d}`.trimEnd())}const it=r.screenFrames>0?`屏幕 screenX/Y（${r.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=r.screenFrames>0&&r.clientFrames>0?` / client 回退 ${r.clientFrames} 帧`:"";return $.push(`摇杆坐标源 ${it}${mt}`),$.push(`UA ${e.ua}`),$.join(`
`)}return{sample(T,A,B,O=0){r.frames++,A.stickHeld&&(A.stickScreenOk?r.screenFrames++:r.clientFrames++),r.steps+=O,r.wallMs+=B,B>r.dtMax&&(r.dtMax=B),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=T.time;const $=T.time;if(c<0&&(c=$),D=$,b=T.tick,!o)return;const it=T.character,mt=Math.hypot(A.stickX,A.stickY),ct=Math.hypot(it.velocity.x,it.velocity.z);d=T.combat.weapon;const gt=bu(T,A),Y=it.facing,ot=Math.hypot(A.intents.moveX,A.intents.moveZ)>.05?Math.atan2(A.intents.moveX,A.intents.moveZ):null;mt>.2&&(r.stickActiveMs+=B);const rt=[Be($),T.tick,Math.round(B*10)/10,Be(A.stickX),Be(A.stickY),Be(A.stickRawX),Be(A.stickRawY),A.stickHeld?1:0,A.source.slice(0,8),Be(A.intents.moveX),Be(A.intents.moveZ),Be(it.position.x),Be(it.position.z),Be(it.velocity.x),Be(it.velocity.z),sn(Y),sn(it.bodyYaw),gt,Be(it.stride),ot===null?"":sn(ot),A.stickId===null?"":A.stickId,Math.round(A.stickOriginX),Math.round(A.stickOriginY),Math.round(A.stickPxX),Math.round(A.stickPxY),A.stickBad,Math.round(A.stickVpTop),Math.round(A.stickOriginSX),Math.round(A.stickOriginSY),Math.round(A.stickScreenX),Math.round(A.stickScreenY),A.stickScreenOk?1:0,Math.round(A.stickScale*100)/100];y(rt);const xt=$*1e3<S;if(B>t.spikeMs&&!xt&&$-c>.6&&(r.spikes++,P("frameSpike",$,T.tick,B,`dt ${B.toFixed(0)}ms fl=${Si(gt)}`,rt)),h!==null&&!xt){const ht=Math.abs(sn(is(Y-h))),pt=Math.abs(sn(is(it.moveYaw-f))),w=(p|gt)&(ga|_a|xa|va)|gt&ms,M=ot===null?null:Math.abs(sn(is(Y-ot))),N=ot===null||h===null?null:Math.abs(sn(is(h-ot))),U=M!==null&&N!==null&&M<N-.5,Q=(p&ms)!==0&&(gt&ms)===0&&ot===null,et=M!==null&&(M<=12||U);ht>t.aimDropDeg&&Q?P("aimDrop",$,T.tick,0,`${ht.toFixed(0)}° @aim→none stick(${A.stickX.toFixed(2)},${A.stickY.toFixed(2)}) aim(${A.aimDX.toFixed(0)},${A.aimDY.toFixed(0)}) fl=${Si(gt)}`,rt):ht>t.dirJumpDeg&&w===0&&!Q&&(et?(r.inTurns++,ht>r.inTurnMax&&(r.inTurnMax=ht)):P("dirJump",$,T.tick,0,`${ht.toFixed(0)}° res${M===null?" 无输入":`${M.toFixed(0)}°`} yaw ${sn(h)}→${sn(Y)} in ${ot===null?".":sn(ot)}° mvΔ${pt.toFixed(0)}° aim(${A.aimDX.toFixed(0)},${A.aimDY.toFixed(0)}) fl=${Si(p)}→${Si(gt)}`,rt))}const Ct=(gt&(ga|_a|xa|va))!==0,Lt=T.tick-x<30;mt>.35&&ct<t.freezeSpeed&&!Ct&&!Lt?(m<0&&(m=$),$-m>=t.freezeMs/1e3&&$>=_&&(P("moveFreeze",$,T.tick,($-m)*1e3,`stick(${A.stickX.toFixed(2)},${A.stickY.toFixed(2)}) v${ct.toFixed(2)} ${A.source} fl=${Si(gt)}`,rt),_=$+1.5,m=-1)):m=-1,A.stickHeld?(mt>u&&(u=mt),u>.35&&mt<.06?(g<0&&(g=$),$-g>=t.stickLostMs/1e3&&(P("stickLost",$,T.tick,($-g)*1e3,`raw(${A.stickRawX.toFixed(2)},${A.stickRawY.toFixed(2)}) peak ${u.toFixed(2)} fl=${Si(gt)}`,rt),g=-1,u=0)):g=-1):(u=0,g=-1);const Ht=A.stickScale>.2&&A.stickScale<5?A.stickScale:1,wt=A.stickScreenOk,It=wt?A.stickScreenX/Ht:A.stickPxX,k=wt?A.stickScreenY/Ht:A.stickPxY,re=wt?A.stickOriginSX/Ht:A.stickOriginX,Rt=wt?A.stickOriginSY/Ht:A.stickOriginY,Pt=It-re,q=k-Rt;if(A.stickHeld&&A.stickId!==null){const ht=L;if(ht&&ht.held&&ht.id===A.stickId){const pt=Math.hypot(ht.dx,ht.dy),w=Math.hypot(Pt,q),M=Math.max(pt,w),N=Math.hypot(It-ht.cx,k-ht.cy),U=Math.abs(sn(is(Math.atan2(q,Pt)-Math.atan2(ht.dy,ht.dx)))),Q=M*U*Math.PI/180,et=Math.hypot(re-ht.ox,Rt-ht.oy);if(M>18&&U>35&&N<Math.max(5,Q*.35)&&P("stickJump",$,T.tick,0,`Δ${U.toFixed(0)}° 手指只动${N.toFixed(0)}px(弧长应${Q.toFixed(0)}px) o(${Math.round(ht.ox)},${Math.round(ht.oy)})→(${Math.round(re)},${Math.round(Rt)}) 原点位移${et.toFixed(0)}px p(${Math.round(It)},${Math.round(k)}) raw(${Math.round(Pt)},${Math.round(q)}) id${A.stickId} ${wt?"src=屏幕":"src=client"}`,rt),wt&&ht.screenOk){const K=Math.hypot(A.stickPxX-ht.x,A.stickPxY-ht.y),lt=Math.hypot((A.stickScreenX-ht.sx)/Ht,(A.stickScreenY-ht.sy)/Ht);R+=K-lt,Math.abs(R)>20&&(P("stickDrift",$,T.tick,0,`client 相对屏幕漂移 ${R>0?"+":""}${R.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(A.stickPxX)},${Math.round(A.stickPxY)}) screen(${Math.round(A.stickScreenX)},${Math.round(A.stickScreenY)})`,rt),R=0)}}L={id:A.stickId,ox:re,oy:Rt,cx:It,cy:k,x:A.stickPxX,y:A.stickPxY,sx:A.stickScreenX,sy:A.stickScreenY,dx:Pt,dy:q,held:!0,screenOk:wt}}else L=null,R=0;if(A.stickBad>C){const ht=A.stickBad-C;P("stickBad",$,T.tick,0,`拦截 ${ht} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${A.stickBad}）o(${Math.round(A.stickOriginX)},${Math.round(A.stickOriginY)}) p(${Math.round(A.stickPxX)},${Math.round(A.stickPxY)}) id${A.stickId??"-"}`,rt)}C=A.stickBad,h=Y,f=it.moveYaw,p=gt},event(T,A){const B=Eu(T);F(T),o&&(T.type==="dash-ready"||T.type==="combo-reset"||T.type==="stepUp"||G(T.type,B,A,T.tick))},gesture(T){const A=`${T.button}.${T.kind}`;r.gestures[A]=(r.gestures[A]??0)+1,o&&(T.kind==="longPress"||T.kind==="doubleTap"||T.kind==="drag"||T.kind==="cancel")&&G(`g:${T.kind}`,`${T.button} ${T.heldMs.toFixed(0)}ms d${T.distance.toFixed(0)}px ${T.angleDeg.toFixed(0)}°`,D,b)},suspend(T){S=D*1e3+T,m=-1,g=-1},setEnabled(T){o=T,T||(h=null,L=null,m=-1,g=-1)},clear(){n.length=0,s.length=0,a.length=0,v={},l=-1e9,h=null,p=0,m=-1,g=-1,u=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0,r.stickJumps=0,r.stickBads=0,r.stickDrifts=0,r.screenFrames=0,r.clientFrames=0,R=0,L=null,C=0;for(const T of Object.keys(r.gestures))delete r.gestures[T]},status(){const T=r.simS,A=a.some(B=>T-B.t<8&&(B.kind==="dirJump"||B.kind==="aimDrop"||B.kind==="moveFreeze"||B.kind==="stickLost"||B.kind==="stickJump"||B.kind==="stickBad"||B.kind==="stickDrift"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:A,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:gu,samples:n.slice(),events:s.slice(),anomalies:a.slice()}},summary:W}}const Au={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:8},worldBounds:{minX:-13.5,maxX:13.5,minZ:-13.5,maxZ:13.5},orientation:{bodyTurnRate:7,headTurnRate:20,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:1.4,minChargeToFire:.18,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12}}},abilities:{arcane:{fireInterval:.28,speed:11,life:1.1,radius:.42,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.82},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},dummies:{count:4,spawn:[{x:-6,z:5},{x:-2,z:5},{x:2,z:5},{x:6,z:5}],initialModes:["wander","follow","keep-distance","attack"],radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Tu={ground:{size:28,thickness:.4},steps:[{id:"step-025",x:-7.5,z:2,width:2.4,depth:2.4,height:.25},{id:"step-040",x:-4.5,z:2,width:2.4,depth:2.4,height:.4},{id:"step-060",x:-1.5,z:2,width:2.4,depth:2.4,height:.6},{id:"step-090",x:1.5,z:2,width:2.4,depth:2.4,height:.9},{id:"step-120",x:4.5,z:2,width:2.4,depth:2.4,height:1.2}],doorways:[{id:"door-wide",x:-3,z:-3,openingWidth:2.4,openingHeight:1.7,wallThickness:.6,wallSpan:3.2,wallHeight:2.4},{id:"door-narrow",x:4,z:-3,openingWidth:.5,openingHeight:1.7,wallThickness:.6,wallSpan:2.4,wallHeight:2.4}],obstacles:[{id:"wall-a",x:7.5,z:1,width:3.5,depth:.6,height:2},{id:"pillar-a",x:-8,z:-7,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-14,maxX:14,minZ:-14,maxZ:14}},Ru={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:56,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.3,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},targeting:{ringColor:"#ffd166",ringRadius:.58},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],labelBg:"rgba(12,18,26,0.82)",attackArcColor:"#ff6b5e"}},Cu={core:Au,scene:Tu,view:Ru};function Oo(i){return JSON.parse(JSON.stringify(i))}const Bo=Cu,Pu=Oo(Bo.core),Du=Oo(Bo.scene),an=Oo(Bo.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class yn{constructor(t,e,n,s,a="div"){this.parent=t,this.object=e,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),yn.nextNameID=yn.nextNameID||0,this.$name.id=`lil-gui-name-${++yn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Lu extends yn{constructor(t,e,n){super(t,e,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Hr(i){let t,e;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Iu={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Hr,toHexString:Hr},xs={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},ku={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,t,e=1){const n=xs.fromHexString(i);t[0]=(n>>16&255)/255*e,t[1]=(n>>8&255)/255*e,t[2]=(n&255)/255*e},toHexString([i,t,e],n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return xs.toHexString(s)}},Uu={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,e=1){const n=xs.fromHexString(i);t.r=(n>>16&255)/255*e,t.g=(n>>8&255)/255*e,t.b=(n&255)/255*e},toHexString({r:i,g:t,b:e},n=1){n=255/n;const s=i*n<<16^t*n<<8^e*n<<0;return xs.toHexString(s)}},Fu=[Iu,xs,ku,Uu];function Nu(i){return Fu.find(t=>t.match(i))}class zu extends yn{constructor(t,e,n,s){super(t,e,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Nu(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Hr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class $a extends yn{constructor(t,e,n){super(t,e,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Ou extends yn{constructor(t,e,n,s,a,r){super(t,e,n,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},n=x=>{const S=parseFloat(this.$input.value);isNaN(S)||(this._snapClampSetValue(S+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),n(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),n(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,h,f;const p=5,d=x=>{o=x.clientX,c=l=x.clientY,r=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=x=>{if(r){const S=x.clientX-o,v=x.clientY-c;Math.abs(v)>p?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(S)>p&&_()}if(!r){const S=x.clientY-l;f-=S*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}l=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},u=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",u)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(u,x,S,v,L)=>(u-x)/(S-x)*(L-v)+v,e=u=>{const x=this.$slider.getBoundingClientRect();let S=t(u,x.left,x.right,this._min,this._max);this._snapClampSetValue(S)},n=u=>{this._setDraggingStyle(!0),e(u.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=u=>{e(u.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=u=>{u.preventDefault(),this._setDraggingStyle(!0),e(u.touches[0].clientX),r=!1},h=u=>{u.touches.length>1||(this._hasScrollBar?(o=u.touches[0].clientX,c=u.touches[0].clientY,r=!0):l(u),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",p))},f=u=>{if(r){const x=u.touches[0].clientX-o,S=u.touches[0].clientY-c;Math.abs(x)>Math.abs(S)?l(u):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p))}else u.preventDefault(),e(u.touches[0].clientX)},p=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",p)},d=this._callOnFinishChange.bind(this),m=400;let _;const g=u=>{if(Math.abs(u.deltaX)<Math.abs(u.deltaY)&&this._hasScrollBar)return;u.preventDefault();const S=this._normalizeMouseWheel(u)*this._step;this._snapClampSetValue(this.getValue()+S),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(d,m)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:n}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,n=-t.wheelDelta/120,n*=this._stepExplicit?1:10),e+-n}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Bu extends yn{constructor(t,e,n,s){super(t,e,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const n=document.createElement("option");n.textContent=e,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Hu extends yn{constructor(t,e,n){super(t,e,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Gu=`.lil-gui {
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
}`;function Vu(i){const t=document.createElement("style");t.innerHTML=i;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Ec=!1;class Ma{constructor({parent:t,autoPlace:e=t===void 0,container:n,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Ec&&o&&(Vu(Gu),Ec=!0),n?n.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,n,s,a){if(Object(n)===n)return new Bu(this,t,e,n);const r=t[e];switch(typeof r){case"number":return new Ou(this,t,e,n,s,a);case"boolean":return new Lu(this,t,e);case"string":return new Hu(this,t,e);case"function":return new $a(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,n=1){return new zu(this,t,e,n)}addFolder(t){const e=new Ma({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(n=>{n instanceof $a||n._name in t.controllers&&n.load(t.controllers[n._name])}),e&&t.folders&&this.folders.forEach(n=>{n._title in t.folders&&n.load(t.folders[n._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof $a)){if(n._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);e.controllers[n._name]=n.save()}}),t&&this.folders.forEach(n=>{if(n._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);e.folders[n._title]=n.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const n=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Xu(i,t,e,n){const s=document.getElementById("debug-panel"),a=s?new Ma({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new Ma({title:"实验台 · 调试面板"}),r=a.addFolder("模拟");r.add(e,"timeScale",0,3,.05).name("时间缩放"),r.add(e,"paused").name("暂停"),r.add({step:n.singleStep},"step").name("单步 (1 tick)"),r.add({reset:n.reset},"reset").name("复位全部");const o=a.addFolder("模块");o.add(i.modules,"movement").name("movement"),o.add(i.modules,"combat").name("combat"),o.add(i.modules,"links").name("links"),o.add(i.modules,"orientation").name("orientation"),o.add(i.modules,"targeting").name("targeting"),o.add(i.modules,"hits").name("hits"),o.add(i.modules,"separation").name("separation"),o.add(i.modules,"dash").name("dash"),o.add(i.modules,"camera").name("camera"),o.add(i.modules,"dummies").name("dummies"),o.add(i.modules,"abilities").name("abilities");const c=i.config,l=a.addFolder("移动参数");l.add(c,"moveSpeed",1,10,.1).name("移动速度"),l.add(c,"sprintMultiplier",1,3,.05).name("冲刺倍率"),l.add(c,"acceleration",1,40,.5).name("加速度"),l.add(c,"friction",1,40,.5).name("摩擦"),l.add(c,"gravity",5,60,.5).name("重力"),l.add(c,"jumpSpeed",2,16,.2).name("起跳速度"),l.add(c,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),l.add(c,"characterRadius",.1,.8,.01).name("角色半径"),l.add(c,"characterHeight",.6,2.2,.05).name("角色身高"),l.add(c,"strideLength",.3,3,.05).name("基础步幅"),l.add(c,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),l.add(c,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const h=a.addFolder("程序化步态 (v8)");h.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),h.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),h.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),h.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),h.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),h.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),h.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),h.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),h.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),h.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),h.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆");const f=a.addFolder("程序动画 (v8c/v8d)");f.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),f.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),f.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const p=t.animation.stride;f.add(p,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),f.add(p,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),f.add(p,"cycles",1,3,1).name("每段跨步周期数"),f.add(p,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),f.add(p,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),f.add(p,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),f.add(p,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),f.add(p,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),f.add(p,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),f.add(p,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),f.add(p,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),f.add(p,"heavyScale",0,1,.01).name("大剑重击收敛系数"),f.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),f.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),f.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),f.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),f.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),f.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),f.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),f.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),f.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),f.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),f.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),f.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const d=c.combat,m=a.addFolder("战斗参数"),_=m.add(i.combat,"weapon",mi).name("当前武器");m.add(d,"comboWindow",.1,2,.05).name("连击窗口 (s)"),m.add(d,"settle",0,.8,.01).name("段间停顿 (s)"),m.add(d,"attackMoveScale",0,1,.01).name("攻击时移动比例"),m.add(d,"autoCombo").name("按住自动连击"),m.add(d.bow,"maxChargeTime",.3,3,.1).name("满蓄力时间 (s)"),m.add(d.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),m.add(d.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),m.add(d.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),m.add(d.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),m.add(d.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const g=c.abilities;m.add(g.arcane,"fireInterval",.05,1,.01).name("奥术飞弹间隔 (s)"),m.add(g.arcane,"speed",3,24,.5).name("飞弹速度"),m.add(g.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),m.add(g.ring,"radius",.5,5,.1).name("电环半径"),m.add(g.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),m.add(g.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const u=c.orientation,x=a.addFolder("朝向参数");x.add(u,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),x.add(u,"headTurnRate",.5,40,.5).name("头部转向速率"),x.add(u,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),x.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),x.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),x.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const S=a.addFolder("惯性倾斜 / 盆骨 (v8g)"),v=t.lean;S.add(v,"accelGain",0,.1,.002).name("前后加速度增益"),S.add(v,"turnGain",0,.2,.005).name("绕圈侧倾增益"),S.add(v,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),S.add(v,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),S.add(v,"smoothing",1,30,1).name("倾斜平滑速率"),S.add(v,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),S.add(v,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),S.add(v,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),S.add(v,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=a.addFolder("足部 IK (v8g)"),R=t.ik;L.add(R,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),L.add(R,"weight",0,1,.01).name("钉地权重"),L.add(R,"attackScale",0,1,.01).name("攻击时权重倍率"),L.add(R,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const C=a.addFolder("程序动画 / 武器握持");C.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),C.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),C.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),C.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const D=c.targeting,b=a.addFolder("目标辅助");b.add(D,"targetAssist").name("启用目标辅助"),b.add(D,"range",1,14,.5).name("锁定范围 (m)"),b.add(D,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),b.add(D,"frontBias",0,4,.1).name("朝向加权"),b.add(D,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),b.add(D,"maxLungeScale",1,3,.1).name("前冲最大放大");const y=c.hits,P=a.addFolder("命中 / 受击 / 击退");P.add(y,"arcDeg",10,120,5).name("命中扇区半角 (°)"),P.add(y,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),P.add(y,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),P.add(y,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),P.add(y.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),P.add(y.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),P.add(y,"dummyReach",.5,4,.1).name("假人命中距离 (m)");const G=c.separation,F=a.addFolder("角色间分离");F.add(G,"iterations",1,8,1).name("迭代次数"),F.add(G,"slop",0,.05,.002).name("额外分离量 (m)");const W=c.dash,T=a.addFolder("冲刺 / 闪避");T.add(W,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),T.add(W,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),T.add(W,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),T.add(W,"blinkDistance",1,12,.25).name("闪现距离 (m)"),T.add(W,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),T.add(W,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),T.add(W,"blinkClearVelocity").name("闪现清空速度"),T.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),T.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const A=c.camera,B=a.addFolder("智能相机");B.add(A,"radius",2,18,.5).name("威胁评估半径 (m)"),B.add(A,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),B.add(A,"saturation",.5,8,.1).name("威胁归一化饱和"),B.add(A,"pushIn",0,.5,.01).name("无威胁推进比例"),B.add(A,"maxPullback",0,1,.02).name("最大拉远比例"),B.add(A,"maxOffset",0,6,.1).name("最大构图平移 (m)"),B.add(A,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),B.add(A,"framingBias",0,1,.05).name("威胁质心平移系数"),B.add(A,"attackBoost",0,2,.05).name("挥砍中额外加权"),B.add(A.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),B.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const O=a.addFolder("输入");O.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),O.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const $=c.dummies,it=a.addFolder("假人参数");it.add($,"moveSpeed",.5,8,.1).name("移动速度"),it.add($,"wanderRadius",.5,8,.1).name("游走半径"),it.add($,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),it.add($,"followStopDistance",.3,5,.1).name("跟随停距"),it.add($,"keepDistance",1,10,.1).name("保持距离"),it.add($,"keepDeadZone",.1,2,.05).name("保持死区"),it.add($,"attackRange",.5,5,.1).name("攻击距离"),it.add($,"attackInterval",.3,5,.1).name("攻击间隔 (s)");const mt=a.addFolder("相机");mt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),mt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),mt.add(t.camera,"distance",6,35,.5).name("距离"),mt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),mt.add(t.camera,"fov",25,90,1).name("FOV");const ct=a.addFolder("相机缩放 (v8e)");ct.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),ct.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),ct.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),ct.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),ct.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),ct.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),ct.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),ct.add({reset:n.resetZoom},"reset").name("缩放归 1");const gt=a.addFolder("受击分层 (v8f)"),Y=t.hurt;gt.add(Y,"enabled").name("启用分层受击 (关=旧版对照)"),gt.add(Y,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),gt.add(Y,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),gt.add(Y,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),gt.add(Y,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),gt.add(Y,"upperShiftScale",0,1,.01).name("上身位移缩放"),gt.add(Y,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),gt.add(Y.hitHeight,"light",0,1,.01).name("轻击命中部位"),gt.add(Y.hitHeight,"heavy",0,1,.01).name("重击命中部位"),gt.add(Y.hitHeight,"knock",0,1,.01).name("击退命中部位"),gt.add(Y,"leanLight",0,1.5,.01).name("轻击力度"),gt.add(Y,"leanHeavy",0,1.5,.01).name("重击力度"),gt.add(Y,"leanKnock",0,1.5,.01).name("击退力度"),gt.add(Y,"flashStrength",0,2,.05).name("受击闪光强度");const nt=[{name:"打腹 (abdomen)",p:Y.abdomen},{name:"打肩 (shoulder)",p:Y.shoulder}].map(({name:Lt,p:Ht})=>{const wt=gt.addFolder(Lt);return wt.add(Ht,"upperPitch",0,2,.01).name("上身前后倾斜"),wt.add(Ht,"upperRoll",0,2,.01).name("上身侧倾"),wt.add(Ht,"upperYaw",0,1.5,.01).name("肩部扭转"),wt.add(Ht,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),wt.add(Ht,"shift",0,.8,.01).name("身体反应位移"),wt.add(Ht,"drop",0,.4,.01).name("整体下沉"),wt.add(Ht,"back",0,.4,.01).name("屁股向后"),wt.add(Ht,"knee",0,1.6,.01).name("屈膝"),wt.add(Ht,"hip",0,1,.01).name("髋前倾"),wt.add(Ht,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),wt}),ot=a.addFolder("派生招 (v9a)"),rt=i.config.links;ot.add(rt,"enabled").name("总开关 (false=旧连击)"),ot.add(rt.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),ot.add(rt.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),ot.add(rt.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),ot.add(rt,"sharedCooldown",0,3,.05).name("共享 CD (s)"),ot.add(rt,"triggerWhileSprinting").name("长跑中可直接触发"),ot.add(rt.search,"range",1,14,.1).name("索敌距离 (m)"),ot.add(rt.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),ot.add(rt.search,"stopDistance",0,3,.05).name("停住距离 (m)");const xt=rt.moves["sword-shield"];xt&&(ot.add(xt,"enabled").name("剑盾盾击"),ot.add(xt,"distance",0,8,.1).name("冲锋极限 (m)"),ot.add(xt,"windup",0,.5,.01).name("前摇 (s)"),ot.add(xt,"active",0,.8,.01).name("冲锋 / 命中 (s)"),ot.add(xt,"recovery",0,.8,.01).name("收势 (s)"),ot.add(xt.hit,"radius",0,4,.05).name("命中半径 (m)"),ot.add(xt.hit,"width",0,2,.05).name("扫掠半径 (m)"),ot.add(xt.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),ot.add(xt.hit,"duration",0,1.5,.01).name("僵直 (s)")),ot.add(i.config.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Ct=a.addFolder("显示");return Ct.add(e,"showColliders").name("碰撞盒线框").onChange(n.onToggleColliders),Ct.add(e,"showGrid").name("地面网格").onChange(n.onToggleGrid),l.close(),f.close(),m.close(),x.close(),C.close(),S.close(),L.close(),b.close(),P.close(),F.close(),T.close(),B.close(),O.close(),o.close(),it.close(),mt.close(),ct.close(),gt.close(),ot.close(),nt.forEach(Lt=>Lt.close()),Ct.close(),a.close(),{gui:a,refreshWeapon:()=>_.updateDisplay()}}const Ya=Math.PI*2,mn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},Wu=45,$u=50;function Yu(i,t,e){return{x:e.rightX*i+e.rightZ*t,y:-(e.forwardX*i+e.forwardZ*t)}}function ss(i,t,e){const n=Yu(i,t,e);return Math.atan2(n.x,-n.y)*180/Math.PI}function Zu(i,t){return Math.atan2(i,-t)*180/Math.PI}function wc(i,t){return Math.abs(((i-t)%360+540)%360-180)}function As(i){return(i%360+360)%360}const qu={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function ju(i,t,e,n=8){const s=i.character,a=t.intents,r=Math.hypot(a.moveX,a.moveZ),o=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),h=r>.001?ss(a.moveX,a.moveZ,e):null,f=l>.15?ss(c.x,c.z,e):null,p=ss(Math.sin(s.facing),Math.cos(s.facing),e),d=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?ss(a.aimX,a.aimZ,e):null,m=i.targeting,_=m.hasTarget?ss(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&f!==null?wc(h,f):null,u=h!==null?wc(h,p):null,x=g!==null&&g>Wu&&r>=.35&&l>=.4;return{inDeg:h,inLen:Math.min(1,r),rawDeg:o>.02?Zu(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,o),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:p,lockDeg:_,lockId:m.targetId,lockDist:m.targetDist,aimDeg:d,gapMove:g,gapFace:u,warnMove:x}}function Ac(i,t){return!t&&i.aimDeg===null&&i.gapFace!==null&&i.gapFace>$u&&(i.inLen>=.35||i.speed>=.4)}const Tc="harness.dirDebug";function Ku(i={}){const t=document.createElement("div");t.id="dirdbg",t.innerHTML=['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>','<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"].join(""),document.body.appendChild(t);const e=t.querySelector("#dirdbg-canvas"),n=t.querySelector("#dirdbg-toggle"),s={in:t.querySelector('[data-k="in"]'),mv:t.querySelector('[data-k="mv"]'),fc:t.querySelector('[data-k="fc"]'),gap:t.querySelector('[data-k="gap"]')},a=e.getContext("2d");let r=!0;try{r=window.localStorage.getItem(Tc)!=="0"}catch{}function o(){t.classList.toggle("is-off",!r),n.textContent=r?"方向 ⌄":"方向 ▸",n.setAttribute("aria-expanded",String(r))}o();function c(u){r=u;try{window.localStorage.setItem(Tc,u?"1":"0")}catch{}o()}n.addEventListener("pointerdown",u=>{u.preventDefault(),u.stopPropagation(),c(!r)}),window.addEventListener("keydown",u=>{u.key.toLowerCase()==="v"&&!u.metaKey&&!u.ctrlKey&&c(!r)});const l=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;e.width=Math.round(h*l),e.height=Math.round(h*l);let f=qu,p=0,d="",m=8;function _(u){if(!a)return;const x=h,S=h,v=x/2,L=S/2,R=Math.min(x,S)/2-13;a.setTransform(l,0,0,l,0,0),a.clearRect(0,0,x,S),a.beginPath(),a.arc(v,L,R,0,Ya),a.fillStyle="rgba(8, 12, 17, 0.5)",a.fill(),a.lineWidth=1,a.strokeStyle=u.warnMove?"rgba(251, 191, 36, 0.85)":mn.ring,a.stroke(),a.strokeStyle=mn.grid,a.beginPath(),a.moveTo(v-R,L),a.lineTo(v+R,L),a.moveTo(v,L-R),a.lineTo(v,L+R),a.stroke();for(let y=0;y<8;y++){const P=y*Math.PI/4,G=v+Math.sin(P)*(R-3),F=L-Math.cos(P)*(R-3),W=v+Math.sin(P)*R,T=L-Math.cos(P)*R;a.beginPath(),a.moveTo(G,F),a.lineTo(W,T),a.stroke()}const C=i.deadZone?Math.min(.9,Math.max(0,i.deadZone())):0;C>0&&(a.save(),a.setLineDash([2,3]),a.strokeStyle=mn.dead,a.beginPath(),a.arc(v,L,R*C,0,Ya),a.stroke(),a.restore());const D=(y,P,G,F,W=!1,T=1)=>{const A=y*Math.PI/180,B=Math.sin(A),O=-Math.cos(A),$=R*Math.max(.14,Math.min(1,P)),it=v+B*R*.14,mt=L+O*R*.14,ct=v+B*$,gt=L+O*$;if(a.save(),a.globalAlpha=T,a.strokeStyle=G,a.fillStyle=G,a.lineWidth=F,a.lineCap="round",W&&a.setLineDash([3,3]),a.beginPath(),a.moveTo(it,mt),a.lineTo(ct,gt),a.stroke(),!W&&$>R*.3){const Y=-O,nt=B,ot=5.2;a.beginPath(),a.moveTo(ct+B*1.5,gt+O*1.5),a.lineTo(ct-B*ot+Y*ot*.72,gt-O*ot+nt*ot*.72),a.lineTo(ct-B*ot-Y*ot*.72,gt-O*ot-nt*ot*.72),a.closePath(),a.fill()}a.restore()},b=(y,P)=>{const G=y*Math.PI/180,F=Math.sin(G),W=-Math.cos(G),T=-W,A=F,B=R+1.5,O=B+6.5;a.save(),a.fillStyle=P,a.strokeStyle=P,a.lineWidth=1,a.beginPath(),a.moveTo(v+F*O,L+W*O),a.lineTo(v+F*B+T*4,L+W*B+A*4),a.lineTo(v+F*B-T*4,L+W*B-A*4),a.closePath(),a.fill(),a.restore()};u.lockDeg!==null&&D(u.lockDeg,1,mn.lock,1,!0,.7),u.rawDeg!==null&&u.stickHeld&&D(u.rawDeg,u.rawLen,mn.raw,1,!0,.9),u.aimDeg!==null&&D(u.aimDeg,1,mn.aim,1.6,!0,.95),D(u.faceDeg,1,mn.face,1.1,!0,.55),u.moveDeg!==null&&D(u.moveDeg,u.speed/Math.max(1,m),mn.move,5.5,!1,.8),u.inDeg!==null&&D(u.inDeg,u.inLen,mn.input,2.2),b(u.faceDeg,mn.face),a.beginPath(),a.arc(v,L,2.2,0,Ya),a.fillStyle="rgba(220, 235, 248, 0.85)",a.fill()}function g(u,x){const S=R=>R===null?"-":String(Math.round(As(R)));s.in.textContent=`入 ${S(u.inDeg)}`,s.mv.textContent=`移 ${S(u.moveDeg)}`,s.fc.textContent=`面 ${S(u.faceDeg)}`;const v=R=>R===null?"-":`${Math.round(R)}°`,L=[`Δ入→移 ${v(u.gapMove)}`,`Δ入→面 ${v(u.gapFace)}`];u.speed>.05&&L.push(`v${u.speed.toFixed(1)}`),u.lockDeg!==null&&L.push(`锁#${u.lockId} ${u.lockDist.toFixed(1)}m`),u.aimDeg!==null&&L.push("拖拽瞄准"),s.gap.textContent=L.join("  "),t.classList.toggle("is-warn",u.warnMove||Ac(u,x))}return{update(u,x,S){if(!r)return;m=Math.max(1,u.config.moveSpeed*Math.max(1,u.config.sprintMultiplier));const v=ju(u,x,S,m);f=v;const L=u.combat.phase!=="idle";_(v);const R=performance.now(),C=`${v.inDeg}|${v.moveDeg}|${v.faceDeg}|${v.lockId}|${v.aimDeg}|${v.warnMove}|${v.speed.toFixed(1)}`;(R-p>90||C!==d)&&(p=R,d=C,g(v,L),t.dataset.in=v.inDeg===null?"":As(v.inDeg).toFixed(1),t.dataset.mv=v.moveDeg===null?"":As(v.moveDeg).toFixed(1),t.dataset.fc=As(v.faceDeg).toFixed(1),t.dataset.warn=v.warnMove||Ac(v,L)?"1":"0")},setEnabled:c,toggle(){return c(!r),r},enabled:()=>r,last:()=>f}}const Ju=["剑盾","双剑","大剑","法杖","弓"],Qu={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function tf(i){return{update(t,e,n,s,a,r,o=!1){const c=t.character,l=c.position,h=c.velocity,f=t.combat,p=t.events.length>0?t.events[t.events.length-1]:null,d=wt=>wt.toFixed(2),m=wt=>(wt*180/Math.PI).toFixed(0),_=Ju[mi.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),u="|".repeat(g)+".".repeat(10-g),x=t.dash,S=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${S.toFixed(0)}%`:`${x.kind} cd${d(x.cooldown)}`,L=s.intents.aimActive?`(${d(s.intents.aimX)},${d(s.intents.aimZ)})`:"-",R=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),C=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),D=Math.abs(R)+Math.abs(C)+1e-6,b=Math.round(Math.abs(C)/D*100),y=`strafe ${b}%${R<-.05?" back":""}`,P=t.camera,G=`threat ${(P.threat*100).toFixed(0)}%  dist×${d(P.distanceScale)}  off (${d(P.offsetX)},${d(P.offsetZ)})  pitch +${d(P.pitchDelta)}°  n=${P.threatCount}`,F=r?d(r.attackBlend):"-",W=r==null?void 0:r.attackWeights,T=W?`gw ${d(W.gaitScale)}  lw ${d(W.attackLegWeight)}  spd ${d(W.driveSpeed)}`:"-",A=W?`${d(W.gaitScale)}/${d(W.attackLegWeight)}`:"-",B=r?`${r.landing.kind} ${d(r.landing.pulse)} t${d(r.landing.remaining)} vy${d(r.landing.impactVy)}`:"-",O=r?`${r.landing.kind}/${d(r.landing.pulse)}`:"-",$=(r==null?void 0:r.zoom)!==void 0?`zoom ×${d(r.zoom)}`:"-",it=r==null?void 0:r.hurt,mt=it?`hurt ${t.playerHurt.type}  部位h${d(it.hitHeight)}  脉冲p${d(it.pulse)}  上身${d(it.upperShift)}  重心${d(it.comShift)}  后坐${d(it.pelvisBack)}  屈膝${d(it.knee)}`:"-",ct=it?`${d(it.hitHeight)}/${d(it.pulse)}/${d(it.knee)}`:"-",gt=r==null?void 0:r.ik,Y=gt?`${gt.active?"on":"off"} w${d(gt.weight)} e${d(gt.maxError)}`:"-",nt=t.playerLink,ot=`link ${nt.kind||"-"}  ${nt.phase}  prog ${d(nt.progress)}  win ${d(nt.linkWindow)}s  cd ${d(nt.cooldown)}s  hits ${nt.hitIds.length}  travel ${d(nt.travelled)}/${d(nt.travel)}m  id ${nt.id}`,rt=`${nt.phase}/${nt.kind||"-"}/w${d(nt.linkWindow)}`,xt=s.lastGesture,Ct=xt?`${xt.button} ${xt.kind} ${xt.heldMs.toFixed(0)}ms d${xt.distance.toFixed(0)}px ${xt.angleDeg.toFixed(0)}° taps${xt.taps}`:"-",Lt=t.dummies.map(wt=>`${wt.id}:${Qu[wt.mode]}`).join("  ");if(o){i.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${nt.phase}${nt.kind?`/${nt.kind}`:""} w${d(nt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?i.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${n}`,`pos (${d(l.x)},${d(l.y)},${d(l.z)})  vel (${d(h.x)},${d(h.y)},${d(h.z)})`,`face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  st${b}%  stick(${d(s.stickX)},${d(s.stickY)}) ${s.source}  str${d(c.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${d(f.attackProgress)}  dash ${v}  ab ${F}  gw/lw ${A}  land ${O}  ik ${Y}`,`aim ${L}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ct}`,`dummies ${Lt}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${d(P.distanceScale)}  ${$}  lk ${rt}`,`event ${p?`${p.type} ${d(p.value)}`:"-"}  scale ${d(a.timeScale)}${a.paused?" [P]":""}  g ${Ct}`].join(`
`):i.textContent=[`tick ${t.tick}   t ${d(t.time)}s   fps ${e.toFixed(0)}   steps ${n}`,`pos  (${d(l.x)}, ${d(l.y)}, ${d(l.z)})`,`vel  (${d(h.x)}, ${d(h.y)}, ${d(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${m(c.facing)}deg   atkBlend ${F}   ${T}   land ${B}`,mt,`ik ${Y}  clamped ${gt?gt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  (head-body ${m(c.headYaw-c.bodyYaw)})  ${y}`,`move (${d(s.intents.moveX)}, ${d(s.intents.moveZ)})  stick (${d(s.stickX)}, ${d(s.stickY)})  ${s.source}  aim ${L}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${d(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${S.toFixed(0)}%  cd ${d(x.cooldown)}s  id ${x.id}  from (${d(x.fromX)},${d(x.fromZ)}) → to (${d(x.toX)},${d(x.toZ)})`,ot,`camera ${G}  ${$}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${d(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${u}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Lt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${d(t.impulse.x)}, ${d(t.impulse.z)})`,`event ${p?`${p.type} ${d(p.value)}`:"-"}   scale ${d(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${Ct}`].join(`
`)}}}const ef=8e3;function nf(i,t){const e=document.getElementById("hud-toggle"),n=document.getElementById("hint-toggle");let s=!1,a=!1,r=0;function o(){i.classList.toggle("is-compact",!s),e==null||e.setAttribute("aria-expanded",String(s)),e&&(e.textContent=s?"状态 ▾":"状态 ▸",e.setAttribute("aria-label",s?"收起状态读数":"展开状态读数")),t&&(t.hidden=!a),n==null||n.setAttribute("aria-expanded",String(a)),n&&(n.textContent=a?"操作说明 ▾":"操作说明 ▸",n.setAttribute("aria-label",a?"收起操作说明":"展开操作说明"))}function c(){a&&(a=!1,window.clearTimeout(r),r=0,o())}function l(){s&&(s=!1,o())}function h(d){d.preventDefault(),d.stopPropagation(),s=!s,o()}function f(d){d.preventDefault(),d.stopPropagation(),a=!a,window.clearTimeout(r),r=0,a&&(r=window.setTimeout(c,ef)),o()}e==null||e.addEventListener("pointerdown",h),n==null||n.addEventListener("pointerdown",f);function p(d){const m=d.target;m instanceof Element&&m.closest("#fold-row, #hint")||(c(),l())}return window.addEventListener("pointerdown",p,{capture:!0,passive:!0}),o(),{hudCompact:()=>!s}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ho="170",sf=0,Rc=1,af=2,ql=1,jl=2,kn=3,Jn=0,Ge=1,Ne=2,qn=0,Xi=1,Cc=2,Pc=3,Dc=4,rf=5,di=100,of=101,cf=102,lf=103,df=104,hf=200,uf=201,ff=202,pf=203,Gr=204,Vr=205,mf=206,gf=207,_f=208,xf=209,vf=210,Mf=211,yf=212,Sf=213,bf=214,Xr=0,Wr=1,$r=2,Yi=3,Yr=4,Zr=5,qr=6,jr=7,Go=0,Ef=1,wf=2,jn=0,Af=1,Tf=2,Rf=3,Cf=4,Pf=5,Df=6,Lf=7,Kl=300,Zi=301,qi=302,Kr=303,Jr=304,Ca=306,Qr=1e3,ui=1001,to=1002,dn=1003,If=1004,Ts=1005,Mn=1006,Za=1007,fi=1008,On=1009,Jl=1010,Ql=1011,vs=1012,Vo=1013,gi=1014,Fn=1015,ys=1016,Xo=1017,Wo=1018,ji=1020,td=35902,ed=1021,nd=1022,ln=1023,id=1024,sd=1025,Wi=1026,Ki=1027,ad=1028,$o=1029,rd=1030,Yo=1031,Zo=1033,aa=33776,ra=33777,oa=33778,ca=33779,eo=35840,no=35841,io=35842,so=35843,ao=36196,ro=37492,oo=37496,co=37808,lo=37809,ho=37810,uo=37811,fo=37812,po=37813,mo=37814,go=37815,_o=37816,xo=37817,vo=37818,Mo=37819,yo=37820,So=37821,la=36492,bo=36494,Eo=36495,od=36283,wo=36284,Ao=36285,To=36286,kf=3200,Uf=3201,cd=0,Ff=1,Yn="",Ke="srgb",Qi="srgb-linear",Pa="linear",le="srgb",bi=7680,Lc=519,Nf=512,zf=513,Of=514,ld=515,Bf=516,Hf=517,Gf=518,Vf=519,Ro=35044,Ic="300 es",Nn=2e3,ya=2001;class ts{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const Pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],da=Math.PI/180,Co=180/Math.PI;function Kn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pe[i&255]+Pe[i>>8&255]+Pe[i>>16&255]+Pe[i>>24&255]+"-"+Pe[t&255]+Pe[t>>8&255]+"-"+Pe[t>>16&15|64]+Pe[t>>24&255]+"-"+Pe[e&63|128]+Pe[e>>8&255]+"-"+Pe[e>>16&255]+Pe[e>>24&255]+Pe[n&255]+Pe[n>>8&255]+Pe[n>>16&255]+Pe[n>>24&255]).toLowerCase()}function He(i,t,e){return Math.max(t,Math.min(e,i))}function Xf(i,t){return(i%t+t)%t}function qa(i,t,e){return(1-e)*i+e*t}function vn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function de(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class jt{constructor(t=0,e=0){jt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(He(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*s+t.x,this.y=a*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kt{constructor(t,e,n,s,a,r,o,c,l){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l)}set(t,e,n,s,a,r,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=a,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],h=n[4],f=n[7],p=n[2],d=n[5],m=n[8],_=s[0],g=s[3],u=s[6],x=s[1],S=s[4],v=s[7],L=s[2],R=s[5],C=s[8];return a[0]=r*_+o*x+c*L,a[3]=r*g+o*S+c*R,a[6]=r*u+o*v+c*C,a[1]=l*_+h*x+f*L,a[4]=l*g+h*S+f*R,a[7]=l*u+h*v+f*C,a[2]=p*_+d*x+m*L,a[5]=p*g+d*S+m*R,a[8]=p*u+d*v+m*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*o*l-n*a*h+n*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=h*r-o*l,p=o*c-h*a,d=l*a-r*c,m=e*f+n*p+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=f*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*r)*_,t[3]=p*_,t[4]=(h*e-s*c)*_,t[5]=(s*a-o*e)*_,t[6]=d*_,t[7]=(n*c-l*e)*_,t[8]=(r*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(ja.makeScale(t,e)),this}rotate(t){return this.premultiply(ja.makeRotation(-t)),this}translate(t,e){return this.premultiply(ja.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ja=new Kt;function dd(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Sa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Wf(){const i=Sa("canvas");return i.style.display="block",i}const kc={};function fs(i){i in kc||(kc[i]=!0,console.warn(i))}function $f(i,t,e){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}function Yf(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Zf(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ne={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===le&&(i.r=zn(i.r),i.g=zn(i.g),i.b=zn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===le&&(i.r=$i(i.r),i.g=$i(i.g),i.b=$i(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Yn?Pa:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function zn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $i(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Uc=[.64,.33,.3,.6,.15,.06],Fc=[.2126,.7152,.0722],Nc=[.3127,.329],zc=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Oc=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ne.define({[Qi]:{primaries:Uc,whitePoint:Nc,transfer:Pa,toXYZ:zc,fromXYZ:Oc,luminanceCoefficients:Fc,workingColorSpaceConfig:{unpackColorSpace:Ke},outputColorSpaceConfig:{drawingBufferColorSpace:Ke}},[Ke]:{primaries:Uc,whitePoint:Nc,transfer:le,toXYZ:zc,fromXYZ:Oc,luminanceCoefficients:Fc,outputColorSpaceConfig:{drawingBufferColorSpace:Ke}}});let Ei;class qf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ei===void 0&&(Ei=Sa("canvas")),Ei.width=t.width,Ei.height=t.height;const n=Ei.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ei}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Sa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=zn(a[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zn(e[n]/255)*255):e[n]=zn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let jf=0;class hd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=Kn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Ka(s[r].image)):a.push(Ka(s[r]))}else a=Ka(s);n.url=a}return e||(t.images[this.uuid]=n),n}}function Ka(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?qf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Kf=0;class Oe extends ts{constructor(t=Oe.DEFAULT_IMAGE,e=Oe.DEFAULT_MAPPING,n=ui,s=ui,a=Mn,r=fi,o=ln,c=On,l=Oe.DEFAULT_ANISOTROPY,h=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=Kn(),this.name="",this.source=new hd(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new jt(0,0),this.repeat=new jt(1,1),this.center=new jt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Kl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Qr:t.x=t.x-Math.floor(t.x);break;case ui:t.x=t.x<0?0:1;break;case to:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Qr:t.y=t.y-Math.floor(t.y);break;case ui:t.y=t.y<0?0:1;break;case to:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Oe.DEFAULT_IMAGE=null;Oe.DEFAULT_MAPPING=Kl;Oe.DEFAULT_ANISOTROPY=1;class _e{constructor(t=0,e=0,n=0,s=1){_e.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a;const c=t.elements,l=c[0],h=c[4],f=c[8],p=c[1],d=c[5],m=c[9],_=c[2],g=c[6],u=c[10];if(Math.abs(h-p)<.01&&Math.abs(f-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+p)<.1&&Math.abs(f+_)<.1&&Math.abs(m+g)<.1&&Math.abs(l+d+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(l+1)/2,v=(d+1)/2,L=(u+1)/2,R=(h+p)/4,C=(f+_)/4,D=(m+g)/4;return S>v&&S>L?S<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(S),s=R/n,a=C/n):v>L?v<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),n=R/s,a=D/s):L<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(L),n=C/a,s=D/a),this.set(n,s,a,e),this}let x=Math.sqrt((g-m)*(g-m)+(f-_)*(f-_)+(p-h)*(p-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(f-_)/x,this.z=(p-h)/x,this.w=Math.acos((l+d+u-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Jf extends ts{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new _e(0,0,t,e),this.scissorTest=!1,this.viewport=new _e(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const a=new Oe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);a.flipY=!1,a.generateMipmaps=n.generateMipmaps,a.internalFormat=n.internalFormat,this.textures=[];const r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new hd(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _i extends Jf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ud extends Oe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=dn,this.minFilter=dn,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Qf extends Oe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=dn,this.minFilter=dn,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ss{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,r,o){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3];const p=a[r+0],d=a[r+1],m=a[r+2],_=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=p,t[e+1]=d,t[e+2]=m,t[e+3]=_;return}if(f!==_||c!==p||l!==d||h!==m){let g=1-o;const u=c*p+l*d+h*m+f*_,x=u>=0?1:-1,S=1-u*u;if(S>Number.EPSILON){const L=Math.sqrt(S),R=Math.atan2(L,u*x);g=Math.sin(g*R)/L,o=Math.sin(o*R)/L}const v=o*x;if(c=c*g+p*v,l=l*g+d*v,h=h*g+m*v,f=f*g+_*v,g===1-o){const L=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=L,l*=L,h*=L,f*=L}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,a,r){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=a[r],p=a[r+1],d=a[r+2],m=a[r+3];return t[e]=o*m+h*f+c*d-l*p,t[e+1]=c*m+h*p+l*f-o*d,t[e+2]=l*m+h*d+o*p-c*f,t[e+3]=h*m-o*f-c*p-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),f=o(a/2),p=c(n/2),d=c(s/2),m=c(a/2);switch(r){case"XYZ":this._x=p*h*f+l*d*m,this._y=l*d*f-p*h*m,this._z=l*h*m+p*d*f,this._w=l*h*f-p*d*m;break;case"YXZ":this._x=p*h*f+l*d*m,this._y=l*d*f-p*h*m,this._z=l*h*m-p*d*f,this._w=l*h*f+p*d*m;break;case"ZXY":this._x=p*h*f-l*d*m,this._y=l*d*f+p*h*m,this._z=l*h*m+p*d*f,this._w=l*h*f-p*d*m;break;case"ZYX":this._x=p*h*f-l*d*m,this._y=l*d*f+p*h*m,this._z=l*h*m-p*d*f,this._w=l*h*f+p*d*m;break;case"YZX":this._x=p*h*f+l*d*m,this._y=l*d*f+p*h*m,this._z=l*h*m-p*d*f,this._w=l*h*f-p*d*m;break;case"XZY":this._x=p*h*f-l*d*m,this._y=l*d*f-p*h*m,this._z=l*h*m+p*d*f,this._w=l*h*f+p*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],h=e[6],f=e[10],p=n+o+f;if(p>0){const d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(h-c)*d,this._y=(a-l)*d,this._z=(r-s)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+l)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(a-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(r-s)/d,this._x=(a+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(He(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-n*l,this._z=a*h+r*l+n*c-s*o,this._w=r*h-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+n*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=n,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),f=Math.sin((1-e)*h)/l,p=Math.sin(e*h)/l;return this._w=r*f+this._w*p,this._x=n*f+this._x*p,this._y=s*f+this._y*p,this._z=a*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(t=0,e=0,n=0){X.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Bc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Bc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*n),h=2*(o*e-a*s),f=2*(a*n-r*e);return this.x=e+c*l+r*f-o*h,this.y=n+c*h+o*l-a*f,this.z=s+c*f+a*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ja.copy(this).projectOnVector(t),this.sub(Ja)}reflect(t){return this.sub(Ja.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(He(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ja=new X,Bc=new Ss;class bs{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(rn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(rn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=rn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,rn):rn.fromBufferAttribute(a,r),rn.applyMatrix4(t.matrixWorld),this.expandByPoint(rn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Rs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rs.copy(n.boundingBox)),Rs.applyMatrix4(t.matrixWorld),this.union(Rs)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,rn),rn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(as),Cs.subVectors(this.max,as),wi.subVectors(t.a,as),Ai.subVectors(t.b,as),Ti.subVectors(t.c,as),Hn.subVectors(Ai,wi),Gn.subVectors(Ti,Ai),ei.subVectors(wi,Ti);let e=[0,-Hn.z,Hn.y,0,-Gn.z,Gn.y,0,-ei.z,ei.y,Hn.z,0,-Hn.x,Gn.z,0,-Gn.x,ei.z,0,-ei.x,-Hn.y,Hn.x,0,-Gn.y,Gn.x,0,-ei.y,ei.x,0];return!Qa(e,wi,Ai,Ti,Cs)||(e=[1,0,0,0,1,0,0,0,1],!Qa(e,wi,Ai,Ti,Cs))?!1:(Ps.crossVectors(Hn,Gn),e=[Ps.x,Ps.y,Ps.z],Qa(e,wi,Ai,Ti,Cs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,rn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(rn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Cn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Cn=[new X,new X,new X,new X,new X,new X,new X,new X],rn=new X,Rs=new bs,wi=new X,Ai=new X,Ti=new X,Hn=new X,Gn=new X,ei=new X,as=new X,Cs=new X,Ps=new X,ni=new X;function Qa(i,t,e,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){ni.fromArray(i,a);const o=s.x*Math.abs(ni.x)+s.y*Math.abs(ni.y)+s.z*Math.abs(ni.z),c=t.dot(ni),l=e.dot(ni),h=n.dot(ni);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const tp=new bs,rs=new X,tr=new X;class Da{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):tp.setFromPoints(t).getCenter(n);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;rs.subVectors(t,this.center);const e=rs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(rs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(tr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(rs.copy(t.center).add(tr)),this.expandByPoint(rs.copy(t.center).sub(tr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Pn=new X,er=new X,Ds=new X,Vn=new X,nr=new X,Ls=new X,ir=new X;class qo{constructor(t=new X,e=new X(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Pn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Pn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Pn.copy(this.origin).addScaledVector(this.direction,e),Pn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){er.copy(t).add(e).multiplyScalar(.5),Ds.copy(e).sub(t).normalize(),Vn.copy(this.origin).sub(er);const a=t.distanceTo(e)*.5,r=-this.direction.dot(Ds),o=Vn.dot(this.direction),c=-Vn.dot(Ds),l=Vn.lengthSq(),h=Math.abs(1-r*r);let f,p,d,m;if(h>0)if(f=r*c-o,p=r*o-c,m=a*h,f>=0)if(p>=-m)if(p<=m){const _=1/h;f*=_,p*=_,d=f*(f+r*p+2*o)+p*(r*f+p+2*c)+l}else p=a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;else p=-a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;else p<=-m?(f=Math.max(0,-(-r*a+o)),p=f>0?-a:Math.min(Math.max(-a,-c),a),d=-f*f+p*(p+2*c)+l):p<=m?(f=0,p=Math.min(Math.max(-a,-c),a),d=p*(p+2*c)+l):(f=Math.max(0,-(r*a+o)),p=f>0?a:Math.min(Math.max(-a,-c),a),d=-f*f+p*(p+2*c)+l);else p=r>0?-a:a,f=Math.max(0,-(r*p+o)),d=-f*f+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(er).addScaledVector(Ds,p),d}intersectSphere(t,e){Pn.subVectors(t.center,this.origin);const n=Pn.dot(this.direction),s=Pn.dot(Pn)-n*n,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,p=this.origin;return l>=0?(n=(t.min.x-p.x)*l,s=(t.max.x-p.x)*l):(n=(t.max.x-p.x)*l,s=(t.min.x-p.x)*l),h>=0?(a=(t.min.y-p.y)*h,r=(t.max.y-p.y)*h):(a=(t.max.y-p.y)*h,r=(t.min.y-p.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-p.z)*f,c=(t.max.z-p.z)*f):(o=(t.max.z-p.z)*f,c=(t.min.z-p.z)*f),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Pn)!==null}intersectTriangle(t,e,n,s,a){nr.subVectors(e,t),Ls.subVectors(n,t),ir.crossVectors(nr,Ls);let r=this.direction.dot(ir),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Vn.subVectors(this.origin,t);const c=o*this.direction.dot(Ls.crossVectors(Vn,Ls));if(c<0)return null;const l=o*this.direction.dot(nr.cross(Vn));if(l<0||c+l>r)return null;const h=-o*Vn.dot(ir);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pe{constructor(t,e,n,s,a,r,o,c,l,h,f,p,d,m,_,g){pe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,c,l,h,f,p,d,m,_,g)}set(t,e,n,s,a,r,o,c,l,h,f,p,d,m,_,g){const u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=a,u[5]=r,u[9]=o,u[13]=c,u[2]=l,u[6]=h,u[10]=f,u[14]=p,u[3]=d,u[7]=m,u[11]=_,u[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ri.setFromMatrixColumn(t,0).length(),a=1/Ri.setFromMatrixColumn(t,1).length(),r=1/Ri.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const p=r*h,d=r*f,m=o*h,_=o*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=d+m*l,e[5]=p-_*l,e[9]=-o*c,e[2]=_-p*l,e[6]=m+d*l,e[10]=r*c}else if(t.order==="YXZ"){const p=c*h,d=c*f,m=l*h,_=l*f;e[0]=p+_*o,e[4]=m*o-d,e[8]=r*l,e[1]=r*f,e[5]=r*h,e[9]=-o,e[2]=d*o-m,e[6]=_+p*o,e[10]=r*c}else if(t.order==="ZXY"){const p=c*h,d=c*f,m=l*h,_=l*f;e[0]=p-_*o,e[4]=-r*f,e[8]=m+d*o,e[1]=d+m*o,e[5]=r*h,e[9]=_-p*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const p=r*h,d=r*f,m=o*h,_=o*f;e[0]=c*h,e[4]=m*l-d,e[8]=p*l+_,e[1]=c*f,e[5]=_*l+p,e[9]=d*l-m,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const p=r*c,d=r*l,m=o*c,_=o*l;e[0]=c*h,e[4]=_-p*f,e[8]=m*f+d,e[1]=f,e[5]=r*h,e[9]=-o*h,e[2]=-l*h,e[6]=d*f+m,e[10]=p-_*f}else if(t.order==="XZY"){const p=r*c,d=r*l,m=o*c,_=o*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=p*f+_,e[5]=r*h,e[9]=d*f-m,e[2]=m*f-d,e[6]=o*h,e[10]=_*f+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ep,t,np)}lookAt(t,e,n){const s=this.elements;return We.subVectors(t,e),We.lengthSq()===0&&(We.z=1),We.normalize(),Xn.crossVectors(n,We),Xn.lengthSq()===0&&(Math.abs(n.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),Xn.crossVectors(n,We)),Xn.normalize(),Is.crossVectors(We,Xn),s[0]=Xn.x,s[4]=Is.x,s[8]=We.x,s[1]=Xn.y,s[5]=Is.y,s[9]=We.y,s[2]=Xn.z,s[6]=Is.z,s[10]=We.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],h=n[1],f=n[5],p=n[9],d=n[13],m=n[2],_=n[6],g=n[10],u=n[14],x=n[3],S=n[7],v=n[11],L=n[15],R=s[0],C=s[4],D=s[8],b=s[12],y=s[1],P=s[5],G=s[9],F=s[13],W=s[2],T=s[6],A=s[10],B=s[14],O=s[3],$=s[7],it=s[11],mt=s[15];return a[0]=r*R+o*y+c*W+l*O,a[4]=r*C+o*P+c*T+l*$,a[8]=r*D+o*G+c*A+l*it,a[12]=r*b+o*F+c*B+l*mt,a[1]=h*R+f*y+p*W+d*O,a[5]=h*C+f*P+p*T+d*$,a[9]=h*D+f*G+p*A+d*it,a[13]=h*b+f*F+p*B+d*mt,a[2]=m*R+_*y+g*W+u*O,a[6]=m*C+_*P+g*T+u*$,a[10]=m*D+_*G+g*A+u*it,a[14]=m*b+_*F+g*B+u*mt,a[3]=x*R+S*y+v*W+L*O,a[7]=x*C+S*P+v*T+L*$,a[11]=x*D+S*G+v*A+L*it,a[15]=x*b+S*F+v*B+L*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],h=t[2],f=t[6],p=t[10],d=t[14],m=t[3],_=t[7],g=t[11],u=t[15];return m*(+a*c*f-s*l*f-a*o*p+n*l*p+s*o*d-n*c*d)+_*(+e*c*d-e*l*p+a*r*p-s*r*d+s*l*h-a*c*h)+g*(+e*l*f-e*o*d-a*r*f+n*r*d+a*o*h-n*l*h)+u*(-s*o*h-e*c*f+e*o*p+s*r*f-n*r*p+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=t[9],p=t[10],d=t[11],m=t[12],_=t[13],g=t[14],u=t[15],x=f*g*l-_*p*l+_*c*d-o*g*d-f*c*u+o*p*u,S=m*p*l-h*g*l-m*c*d+r*g*d+h*c*u-r*p*u,v=h*_*l-m*f*l+m*o*d-r*_*d-h*o*u+r*f*u,L=m*f*c-h*_*c-m*o*p+r*_*p+h*o*g-r*f*g,R=e*x+n*S+s*v+a*L;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/R;return t[0]=x*C,t[1]=(_*p*a-f*g*a-_*s*d+n*g*d+f*s*u-n*p*u)*C,t[2]=(o*g*a-_*c*a+_*s*l-n*g*l-o*s*u+n*c*u)*C,t[3]=(f*c*a-o*p*a-f*s*l+n*p*l+o*s*d-n*c*d)*C,t[4]=S*C,t[5]=(h*g*a-m*p*a+m*s*d-e*g*d-h*s*u+e*p*u)*C,t[6]=(m*c*a-r*g*a-m*s*l+e*g*l+r*s*u-e*c*u)*C,t[7]=(r*p*a-h*c*a+h*s*l-e*p*l-r*s*d+e*c*d)*C,t[8]=v*C,t[9]=(m*f*a-h*_*a-m*n*d+e*_*d+h*n*u-e*f*u)*C,t[10]=(r*_*a-m*o*a+m*n*l-e*_*l-r*n*u+e*o*u)*C,t[11]=(h*o*a-r*f*a-h*n*l+e*f*l+r*n*d-e*o*d)*C,t[12]=L*C,t[13]=(h*_*s-m*f*s+m*n*p-e*_*p-h*n*g+e*f*g)*C,t[14]=(m*o*s-r*_*s-m*n*c+e*_*c+r*n*g-e*o*g)*C,t[15]=(r*f*s-h*o*s+h*n*c-e*f*c-r*n*p+e*o*p)*C,this}scale(t){const e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),a=1-n,r=t.x,o=t.y,c=t.z,l=a*r,h=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,r){return this.set(1,n,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,h=r+r,f=o+o,p=a*l,d=a*h,m=a*f,_=r*h,g=r*f,u=o*f,x=c*l,S=c*h,v=c*f,L=n.x,R=n.y,C=n.z;return s[0]=(1-(_+u))*L,s[1]=(d+v)*L,s[2]=(m-S)*L,s[3]=0,s[4]=(d-v)*R,s[5]=(1-(p+u))*R,s[6]=(g+x)*R,s[7]=0,s[8]=(m+S)*C,s[9]=(g-x)*C,s[10]=(1-(p+_))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let a=Ri.set(s[0],s[1],s[2]).length();const r=Ri.set(s[4],s[5],s[6]).length(),o=Ri.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],on.copy(this);const l=1/a,h=1/r,f=1/o;return on.elements[0]*=l,on.elements[1]*=l,on.elements[2]*=l,on.elements[4]*=h,on.elements[5]*=h,on.elements[6]*=h,on.elements[8]*=f,on.elements[9]*=f,on.elements[10]*=f,e.setFromRotationMatrix(on),n.x=a,n.y=r,n.z=o,this}makePerspective(t,e,n,s,a,r,o=Nn){const c=this.elements,l=2*a/(e-t),h=2*a/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s);let d,m;if(o===Nn)d=-(r+a)/(r-a),m=-2*r*a/(r-a);else if(o===ya)d=-r/(r-a),m=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,a,r,o=Nn){const c=this.elements,l=1/(e-t),h=1/(n-s),f=1/(r-a),p=(e+t)*l,d=(n+s)*h;let m,_;if(o===Nn)m=(r+a)*f,_=-2*f;else if(o===ya)m=a*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=_,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ri=new X,on=new pe,ep=new X(0,0,0),np=new X(1,1,1),Xn=new X,Is=new X,We=new X,Hc=new pe,Gc=new Ss;class bn{constructor(t=0,e=0,n=0,s=bn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],p=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(He(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-He(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(He(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-He(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Hc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Gc.setFromEuler(this),this.setFromQuaternion(Gc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bn.DEFAULT_ORDER="XYZ";class jo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ip=0;const Vc=new X,Ci=new Ss,Dn=new pe,ks=new X,os=new X,sp=new X,ap=new Ss,Xc=new X(1,0,0),Wc=new X(0,1,0),$c=new X(0,0,1),Yc={type:"added"},rp={type:"removed"},Pi={type:"childadded",child:null},sr={type:"childremoved",child:null};class xe extends ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=Kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xe.DEFAULT_UP.clone();const t=new X,e=new bn,n=new Ss,s=new X(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pe},normalMatrix:{value:new Kt}}),this.matrix=new pe,this.matrixWorld=new pe,this.matrixAutoUpdate=xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new jo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.premultiply(Ci),this}rotateX(t){return this.rotateOnAxis(Xc,t)}rotateY(t){return this.rotateOnAxis(Wc,t)}rotateZ(t){return this.rotateOnAxis($c,t)}translateOnAxis(t,e){return Vc.copy(t).applyQuaternion(this.quaternion),this.position.add(Vc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Xc,t)}translateY(t){return this.translateOnAxis(Wc,t)}translateZ(t){return this.translateOnAxis($c,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ks.copy(t):ks.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(os,ks,this.up):Dn.lookAt(ks,os,this.up),this.quaternion.setFromRotationMatrix(Dn),s&&(Dn.extractRotation(s.matrixWorld),Ci.setFromRotationMatrix(Dn),this.quaternion.premultiply(Ci.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yc),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(rp),sr.child=t,this.dispatchEvent(sr),sr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Dn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Dn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yc),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,t,sp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,ap,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),f=r(t.shapes),p=r(t.skeletons),d=r(t.animations),m=r(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}xe.DEFAULT_UP=new X(0,1,0);xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new X,Ln=new X,ar=new X,In=new X,Di=new X,Li=new X,Zc=new X,rr=new X,or=new X,cr=new X,lr=new _e,dr=new _e,hr=new _e;class Ye{constructor(t=new X,e=new X,n=new X){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),cn.subVectors(t,e),s.cross(cn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){cn.subVectors(s,e),Ln.subVectors(n,e),ar.subVectors(t,e);const r=cn.dot(cn),o=cn.dot(Ln),c=cn.dot(ar),l=Ln.dot(Ln),h=Ln.dot(ar),f=r*l-o*o;if(f===0)return a.set(0,0,0),null;const p=1/f,d=(l*c-o*h)*p,m=(r*h-o*c)*p;return a.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(t,e,n,s,a,r,o,c){return this.getBarycoord(t,e,n,s,In)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,In.x),c.addScaledVector(r,In.y),c.addScaledVector(o,In.z),c)}static getInterpolatedAttribute(t,e,n,s,a,r){return lr.setScalar(0),dr.setScalar(0),hr.setScalar(0),lr.fromBufferAttribute(t,e),dr.fromBufferAttribute(t,n),hr.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(lr,a.x),r.addScaledVector(dr,a.y),r.addScaledVector(hr,a.z),r}static isFrontFacing(t,e,n,s){return cn.subVectors(n,e),Ln.subVectors(t,e),cn.cross(Ln).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return cn.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),cn.cross(Ln).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ye.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ye.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,a){return Ye.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return Ye.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ye.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,a=this.c;let r,o;Di.subVectors(s,n),Li.subVectors(a,n),rr.subVectors(t,n);const c=Di.dot(rr),l=Li.dot(rr);if(c<=0&&l<=0)return e.copy(n);or.subVectors(t,s);const h=Di.dot(or),f=Li.dot(or);if(h>=0&&f<=h)return e.copy(s);const p=c*f-h*l;if(p<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(Di,r);cr.subVectors(t,a);const d=Di.dot(cr),m=Li.dot(cr);if(m>=0&&d<=m)return e.copy(a);const _=d*l-c*m;if(_<=0&&l>=0&&m<=0)return o=l/(l-m),e.copy(n).addScaledVector(Li,o);const g=h*m-d*f;if(g<=0&&f-h>=0&&d-m>=0)return Zc.subVectors(a,s),o=(f-h)/(f-h+(d-m)),e.copy(s).addScaledVector(Zc,o);const u=1/(g+_+p);return r=_*u,o=p*u,e.copy(n).addScaledVector(Di,r).addScaledVector(Li,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const fd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},Us={h:0,s:0,l:0};function ur(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ne.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ne.workingColorSpace){return this.r=t,this.g=e,this.b=n,ne.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ne.workingColorSpace){if(t=Xf(t,1),e=He(e,0,1),n=He(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=ur(r,a,t+1/3),this.g=ur(r,a,t),this.b=ur(r,a,t-1/3)}return ne.toWorkingColorSpace(this,s),this}setStyle(t,e=Ke){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ke){const n=fd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zn(t.r),this.g=zn(t.g),this.b=zn(t.b),this}copyLinearToSRGB(t){return this.r=$i(t.r),this.g=$i(t.g),this.b=$i(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ke){return ne.fromWorkingColorSpace(De.copy(this),t),Math.round(He(De.r*255,0,255))*65536+Math.round(He(De.g*255,0,255))*256+Math.round(He(De.b*255,0,255))}getHexString(t=Ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ne.workingColorSpace){ne.fromWorkingColorSpace(De.copy(this),e);const n=De.r,s=De.g,a=De.b,r=Math.max(n,s,a),o=Math.min(n,s,a);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const f=r-o;switch(l=h<=.5?f/(r+o):f/(2-r-o),r){case n:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-n)/f+2;break;case a:c=(n-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ne.workingColorSpace){return ne.fromWorkingColorSpace(De.copy(this),e),t.r=De.r,t.g=De.g,t.b=De.b,t}getStyle(t=Ke){ne.fromWorkingColorSpace(De.copy(this),t);const e=De.r,n=De.g,s=De.b;return t!==Ke?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Wn),this.setHSL(Wn.h+t,Wn.s+e,Wn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Wn),t.getHSL(Us);const n=qa(Wn.h,Us.h,e),s=qa(Wn.s,Us.s,e),a=qa(Wn.l,Us.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const De=new qt;qt.NAMES=fd;let op=0;class xi extends ts{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:op++}),this.uuid=Kn(),this.name="",this.blending=Xi,this.side=Jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Gr,this.blendDst=Vr,this.blendEquation=di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=Yi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bi,this.stencilZFail=bi,this.stencilZPass=bi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Xi&&(n.blending=this.blending),this.side!==Jn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Gr&&(n.blendSrc=this.blendSrc),this.blendDst!==Vr&&(n.blendDst=this.blendDst),this.blendEquation!==di&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Yi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Lc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==bi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==bi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class _n extends xi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Go,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Me=new X,Fs=new jt;class hn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ro,this.updateRanges=[],this.gpuType=Fn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Fs.fromBufferAttribute(this,e),Fs.applyMatrix3(t),this.setXY(e,Fs.x,Fs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=vn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=de(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=vn(e,this.array)),e}setX(t,e){return this.normalized&&(e=de(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=vn(e,this.array)),e}setY(t,e){return this.normalized&&(e=de(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=vn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=de(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=vn(e,this.array)),e}setW(t,e){return this.normalized&&(e=de(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=de(e,this.array),n=de(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=de(e,this.array),n=de(n,this.array),s=de(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=de(e,this.array),n=de(n,this.array),s=de(s,this.array),a=de(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ro&&(t.usage=this.usage),t}}class pd extends hn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class md extends hn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ve extends hn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let cp=0;const je=new pe,fr=new xe,Ii=new X,$e=new bs,cs=new bs,Ae=new X;class Ve extends ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cp++}),this.uuid=Kn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(dd(t)?md:pd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Kt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return je.makeRotationFromQuaternion(t),this.applyMatrix4(je),this}rotateX(t){return je.makeRotationX(t),this.applyMatrix4(je),this}rotateY(t){return je.makeRotationY(t),this.applyMatrix4(je),this}rotateZ(t){return je.makeRotationZ(t),this.applyMatrix4(je),this}translate(t,e,n){return je.makeTranslation(t,e,n),this.applyMatrix4(je),this}scale(t,e,n){return je.makeScale(t,e,n),this.applyMatrix4(je),this}lookAt(t){return fr.lookAt(t),fr.updateMatrix(),this.applyMatrix4(fr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ve(n,3))}else{for(let n=0,s=e.count;n<s;n++){const a=t[n];e.setXYZ(n,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new bs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const a=e[n];$e.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,$e.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,$e.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint($e.min),this.boundingBox.expandByPoint($e.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Da);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(t){const n=this.boundingSphere.center;if($e.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];cs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ae.addVectors($e.min,cs.min),$e.expandByPoint(Ae),Ae.addVectors($e.max,cs.max),$e.expandByPoint(Ae)):($e.expandByPoint(cs.min),$e.expandByPoint(cs.max))}$e.getCenter(n);let s=0;for(let a=0,r=t.count;a<r;a++)Ae.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(Ae));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ae.fromBufferAttribute(o,l),c&&(Ii.fromBufferAttribute(t,l),Ae.add(Ii)),s=Math.max(s,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hn(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let D=0;D<n.count;D++)o[D]=new X,c[D]=new X;const l=new X,h=new X,f=new X,p=new jt,d=new jt,m=new jt,_=new X,g=new X;function u(D,b,y){l.fromBufferAttribute(n,D),h.fromBufferAttribute(n,b),f.fromBufferAttribute(n,y),p.fromBufferAttribute(a,D),d.fromBufferAttribute(a,b),m.fromBufferAttribute(a,y),h.sub(l),f.sub(l),d.sub(p),m.sub(p);const P=1/(d.x*m.y-m.x*d.y);isFinite(P)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(P),g.copy(f).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(P),o[D].add(_),o[b].add(_),o[y].add(_),c[D].add(g),c[b].add(g),c[y].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let D=0,b=x.length;D<b;++D){const y=x[D],P=y.start,G=y.count;for(let F=P,W=P+G;F<W;F+=3)u(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const S=new X,v=new X,L=new X,R=new X;function C(D){L.fromBufferAttribute(s,D),R.copy(L);const b=o[D];S.copy(b),S.sub(L.multiplyScalar(L.dot(b))).normalize(),v.crossVectors(R,b);const P=v.dot(c[D])<0?-1:1;r.setXYZW(D,S.x,S.y,S.z,P)}for(let D=0,b=x.length;D<b;++D){const y=x[D],P=y.start,G=y.count;for(let F=P,W=P+G;F<W;F+=3)C(t.getX(F+0)),C(t.getX(F+1)),C(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new hn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);const s=new X,a=new X,r=new X,o=new X,c=new X,l=new X,h=new X,f=new X;if(t)for(let p=0,d=t.count;p<d;p+=3){const m=t.getX(p+0),_=t.getX(p+1),g=t.getX(p+2);s.fromBufferAttribute(e,m),a.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let p=0,d=e.count;p<d;p+=3)s.fromBufferAttribute(e,p+0),a.fromBufferAttribute(e,p+1),r.fromBufferAttribute(e,p+2),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,f=o.normalized,p=new l.constructor(c.length*h);let d=0,m=0;for(let _=0,g=c.length;_<g;_++){o.isInterleavedBufferAttribute?d=c[_]*o.data.stride+o.offset:d=c[_]*h;for(let u=0;u<h;u++)p[m++]=l[d++]}return new hn(p,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ve,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,f=l.length;h<f;h++){const p=l[h],d=t(p,n);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,p=l.length;f<p;f++){const d=l[f];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const a=t.morphAttributes;for(const l in a){const h=[],f=a[l];for(let p=0,d=f.length;p<d;p++)h.push(f[p].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const qc=new pe,ii=new qo,Ns=new Da,jc=new X,zs=new X,Os=new X,Bs=new X,pr=new X,Hs=new X,Kc=new X,Gs=new X;class fe extends xe{constructor(t=new Ve,e=new _n){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){Hs.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],f=a[c];h!==0&&(pr.fromBufferAttribute(f,t),r?Hs.addScaledVector(pr,h):Hs.addScaledVector(pr.sub(e),h))}e.add(Hs)}return e}raycast(t,e){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ns.copy(n.boundingSphere),Ns.applyMatrix4(a),ii.copy(t.ray).recast(t.near),!(Ns.containsPoint(ii.origin)===!1&&(ii.intersectSphere(Ns,jc)===null||ii.origin.distanceToSquared(jc)>(t.far-t.near)**2))&&(qc.copy(a).invert(),ii.copy(t.ray).applyMatrix4(qc),!(n.boundingBox!==null&&ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ii)))}_computeIntersections(t,e,n){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,p=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,_=p.length;m<_;m++){const g=p[m],u=r[g.materialIndex],x=Math.max(g.start,d.start),S=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let v=x,L=S;v<L;v+=3){const R=o.getX(v),C=o.getX(v+1),D=o.getX(v+2);s=Vs(this,u,t,n,l,h,f,R,C,D),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let g=m,u=_;g<u;g+=3){const x=o.getX(g),S=o.getX(g+1),v=o.getX(g+2);s=Vs(this,r,t,n,l,h,f,x,S,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let m=0,_=p.length;m<_;m++){const g=p[m],u=r[g.materialIndex],x=Math.max(g.start,d.start),S=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let v=x,L=S;v<L;v+=3){const R=v,C=v+1,D=v+2;s=Vs(this,u,t,n,l,h,f,R,C,D),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let g=m,u=_;g<u;g+=3){const x=g,S=g+1,v=g+2;s=Vs(this,r,t,n,l,h,f,x,S,v),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function lp(i,t,e,n,s,a,r,o){let c;if(t.side===Ge?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,t.side===Jn,o),c===null)return null;Gs.copy(o),Gs.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Gs);return l<e.near||l>e.far?null:{distance:l,point:Gs.clone(),object:i}}function Vs(i,t,e,n,s,a,r,o,c,l){i.getVertexPosition(o,zs),i.getVertexPosition(c,Os),i.getVertexPosition(l,Bs);const h=lp(i,t,e,n,zs,Os,Bs,Kc);if(h){const f=new X;Ye.getBarycoord(Kc,zs,Os,Bs,f),s&&(h.uv=Ye.getInterpolatedAttribute(s,o,c,l,f,new jt)),a&&(h.uv1=Ye.getInterpolatedAttribute(a,o,c,l,f,new jt)),r&&(h.normal=Ye.getInterpolatedAttribute(r,o,c,l,f,new X),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const p={a:o,b:c,c:l,normal:new X,materialIndex:0};Ye.getNormal(zs,Os,Bs,p.normal),h.face=p,h.barycoord=f}return h}class En extends Ve{constructor(t=1,e=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],h=[],f=[];let p=0,d=0;m("z","y","x",-1,-1,n,e,t,r,a,0),m("z","y","x",1,-1,n,e,-t,r,a,1),m("x","z","y",1,1,t,n,e,s,r,2),m("x","z","y",1,-1,t,n,-e,s,r,3),m("x","y","z",1,-1,t,e,n,s,a,4),m("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new ve(l,3)),this.setAttribute("normal",new ve(h,3)),this.setAttribute("uv",new ve(f,2));function m(_,g,u,x,S,v,L,R,C,D,b){const y=v/C,P=L/D,G=v/2,F=L/2,W=R/2,T=C+1,A=D+1;let B=0,O=0;const $=new X;for(let it=0;it<A;it++){const mt=it*P-F;for(let ct=0;ct<T;ct++){const gt=ct*y-G;$[_]=gt*x,$[g]=mt*S,$[u]=W,l.push($.x,$.y,$.z),$[_]=0,$[g]=0,$[u]=R>0?1:-1,h.push($.x,$.y,$.z),f.push(ct/C),f.push(1-it/D),B+=1}}for(let it=0;it<D;it++)for(let mt=0;mt<C;mt++){const ct=p+mt+T*it,gt=p+mt+T*(it+1),Y=p+(mt+1)+T*(it+1),nt=p+(mt+1)+T*it;c.push(ct,gt,nt),c.push(gt,Y,nt),O+=6}o.addGroup(d,O,b),d+=O,p+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new En(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ji(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Fe(i){const t={};for(let e=0;e<i.length;e++){const n=Ji(i[e]);for(const s in n)t[s]=n[s]}return t}function dp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function gd(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ne.workingColorSpace}const hp={clone:Ji,merge:Fe};var up=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Qn extends xi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=up,this.fragmentShader=fp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ji(t.uniforms),this.uniformsGroups=dp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class _d extends xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pe,this.projectionMatrix=new pe,this.projectionMatrixInverse=new pe,this.coordinateSystem=Nn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const $n=new X,Jc=new jt,Qc=new jt;class Je extends _d{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Co*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(da*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Co*2*Math.atan(Math.tan(da*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){$n.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set($n.x,$n.y).multiplyScalar(-t/$n.z),$n.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set($n.x,$n.y).multiplyScalar(-t/$n.z)}getViewSize(t,e){return this.getViewBounds(t,Jc,Qc),e.subVectors(Qc,Jc)}setViewOffset(t,e,n,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(da*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ki=-90,Ui=1;class pp extends xe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Je(ki,Ui,t,e);s.layers=this.layers,this.add(s);const a=new Je(ki,Ui,t,e);a.layers=this.layers,this.add(a);const r=new Je(ki,Ui,t,e);r.layers=this.layers,this.add(r);const o=new Je(ki,Ui,t,e);o.layers=this.layers,this.add(o);const c=new Je(ki,Ui,t,e);c.layers=this.layers,this.add(c);const l=new Je(ki,Ui,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===Nn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===ya)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,h]=this.children,f=t.getRenderTarget(),p=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,a),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,p,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class xd extends Oe{constructor(t,e,n,s,a,r,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Zi,super(t,e,n,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class mp extends _i{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new xd(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Mn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new En(5,5,5),a=new Qn({name:"CubemapFromEquirect",uniforms:Ji(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ge,blending:qn});a.uniforms.tEquirect.value=e;const r=new fe(s,a),o=e.minFilter;return e.minFilter===fi&&(e.minFilter=Mn),new pp(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(a)}}const mr=new X,gp=new X,_p=new Kt;class ci{constructor(t=new X(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=mr.subVectors(n,e).cross(gp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(mr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||_p.getNormalMatrix(t),s=this.coplanarPoint(mr).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const si=new Da,Xs=new X;class Ko{constructor(t=new ci,e=new ci,n=new ci,s=new ci,a=new ci,r=new ci){this.planes=[t,e,n,s,a,r]}set(t,e,n,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Nn){const n=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],h=s[5],f=s[6],p=s[7],d=s[8],m=s[9],_=s[10],g=s[11],u=s[12],x=s[13],S=s[14],v=s[15];if(n[0].setComponents(c-a,p-l,g-d,v-u).normalize(),n[1].setComponents(c+a,p+l,g+d,v+u).normalize(),n[2].setComponents(c+r,p+h,g+m,v+x).normalize(),n[3].setComponents(c-r,p-h,g-m,v-x).normalize(),n[4].setComponents(c-o,p-f,g-_,v-S).normalize(),e===Nn)n[5].setComponents(c+o,p+f,g+_,v+S).normalize();else if(e===ya)n[5].setComponents(o,f,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),si.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),si.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(si)}intersectsSprite(t){return si.center.set(0,0,0),si.radius=.7071067811865476,si.applyMatrix4(t.matrixWorld),this.intersectsSphere(si)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Xs.x=s.normal.x>0?t.max.x:t.min.x,Xs.y=s.normal.y>0?t.max.y:t.min.y,Xs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Xs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function vd(){let i=null,t=!1,e=null,n=null;function s(a,r){e(a,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function xp(i){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,f=l.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:p,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,c,l){const h=c.array,f=c.updateRanges;if(i.bindBuffer(l,o),f.length===0)i.bufferSubData(l,0,h);else{f.sort((d,m)=>d.start-m.start);let p=0;for(let d=1;d<f.length;d++){const m=f[p],_=f[d];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++p,f[p]=_)}f.length=p+1;for(let d=0,m=f.length;d<m;d++){const _=f[d];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class La extends Ve{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,f=t/o,p=e/c,d=[],m=[],_=[],g=[];for(let u=0;u<h;u++){const x=u*p-r;for(let S=0;S<l;S++){const v=S*f-a;m.push(v,-x,0),_.push(0,0,1),g.push(S/o),g.push(1-u/c)}}for(let u=0;u<c;u++)for(let x=0;x<o;x++){const S=x+l*u,v=x+l*(u+1),L=x+1+l*(u+1),R=x+1+l*u;d.push(S,v,R),d.push(v,L,R)}this.setIndex(d),this.setAttribute("position",new ve(m,3)),this.setAttribute("normal",new ve(_,3)),this.setAttribute("uv",new ve(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new La(t.width,t.height,t.widthSegments,t.heightSegments)}}var vp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mp=`#ifdef USE_ALPHAHASH
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
#endif`,yp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Sp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ep=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wp=`#ifdef USE_AOMAP
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
#endif`,Ap=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tp=`#ifdef USE_BATCHING
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
#endif`,Rp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Cp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Lp=`#ifdef USE_IRIDESCENCE
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
#endif`,Ip=`#ifdef USE_BUMPMAP
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
#endif`,kp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Up=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Op=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Hp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Gp=`#define PI 3.141592653589793
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
} // validated`,Vp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Xp=`vec3 transformedNormal = objectNormal;
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
#endif`,Wp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$p=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Yp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qp="gl_FragColor = linearToOutputTexel( gl_FragColor );",jp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Kp=`#ifdef USE_ENVMAP
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
#endif`,Jp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Qp=`#ifdef USE_ENVMAP
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
#endif`,tm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,em=`#ifdef USE_ENVMAP
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
#endif`,nm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,im=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,am=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rm=`#ifdef USE_GRADIENTMAP
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
}`,om=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dm=`uniform bool receiveShadow;
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
#endif`,hm=`#ifdef USE_ENVMAP
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
#endif`,um=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,pm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,mm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,gm=`PhysicalMaterial material;
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
#endif`,_m=`struct PhysicalMaterial {
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
}`,xm=`
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
#endif`,vm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Mm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ym=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Sm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Em=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,wm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Am=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Tm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rm=`#if defined( USE_POINTS_UV )
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
#endif`,Cm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Pm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Im=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,km=`#ifdef USE_MORPHTARGETS
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
#endif`,Um=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Nm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Om=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Hm=`#ifdef USE_NORMALMAP
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
#endif`,Gm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$m=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ym=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Zm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Km=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Jm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Qm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,eg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ng=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ig=`float getShadowMask() {
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
}`,sg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ag=`#ifdef USE_SKINNING
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
#endif`,rg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,og=`#ifdef USE_SKINNING
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
#endif`,cg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ug=`#ifdef USE_TRANSMISSION
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
#endif`,fg=`#ifdef USE_TRANSMISSION
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
#endif`,pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_g=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const xg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,vg=`uniform sampler2D t2D;
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
}`,Mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Eg=`#include <common>
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
}`,wg=`#if DEPTH_PACKING == 3200
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
}`,Ag=`#define DISTANCE
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
}`,Tg=`#define DISTANCE
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
}`,Rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Cg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pg=`uniform float scale;
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
}`,Dg=`uniform vec3 diffuse;
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
}`,Lg=`#include <common>
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
}`,Ig=`uniform vec3 diffuse;
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
}`,kg=`#define LAMBERT
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
}`,Ug=`#define LAMBERT
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
}`,Fg=`#define MATCAP
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
}`,Ng=`#define MATCAP
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
}`,zg=`#define NORMAL
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
}`,Og=`#define NORMAL
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
}`,Bg=`#define PHONG
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
}`,Hg=`#define PHONG
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
}`,Gg=`#define STANDARD
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
}`,Vg=`#define STANDARD
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
}`,Xg=`#define TOON
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
}`,Wg=`#define TOON
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
}`,$g=`uniform float size;
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
}`,Yg=`uniform vec3 diffuse;
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
}`,Zg=`#include <common>
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
}`,qg=`uniform vec3 color;
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
}`,jg=`uniform float rotation;
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
}`,Kg=`uniform vec3 diffuse;
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
}`,Jt={alphahash_fragment:vp,alphahash_pars_fragment:Mp,alphamap_fragment:yp,alphamap_pars_fragment:Sp,alphatest_fragment:bp,alphatest_pars_fragment:Ep,aomap_fragment:wp,aomap_pars_fragment:Ap,batching_pars_vertex:Tp,batching_vertex:Rp,begin_vertex:Cp,beginnormal_vertex:Pp,bsdfs:Dp,iridescence_fragment:Lp,bumpmap_pars_fragment:Ip,clipping_planes_fragment:kp,clipping_planes_pars_fragment:Up,clipping_planes_pars_vertex:Fp,clipping_planes_vertex:Np,color_fragment:zp,color_pars_fragment:Op,color_pars_vertex:Bp,color_vertex:Hp,common:Gp,cube_uv_reflection_fragment:Vp,defaultnormal_vertex:Xp,displacementmap_pars_vertex:Wp,displacementmap_vertex:$p,emissivemap_fragment:Yp,emissivemap_pars_fragment:Zp,colorspace_fragment:qp,colorspace_pars_fragment:jp,envmap_fragment:Kp,envmap_common_pars_fragment:Jp,envmap_pars_fragment:Qp,envmap_pars_vertex:tm,envmap_physical_pars_fragment:hm,envmap_vertex:em,fog_vertex:nm,fog_pars_vertex:im,fog_fragment:sm,fog_pars_fragment:am,gradientmap_pars_fragment:rm,lightmap_pars_fragment:om,lights_lambert_fragment:cm,lights_lambert_pars_fragment:lm,lights_pars_begin:dm,lights_toon_fragment:um,lights_toon_pars_fragment:fm,lights_phong_fragment:pm,lights_phong_pars_fragment:mm,lights_physical_fragment:gm,lights_physical_pars_fragment:_m,lights_fragment_begin:xm,lights_fragment_maps:vm,lights_fragment_end:Mm,logdepthbuf_fragment:ym,logdepthbuf_pars_fragment:Sm,logdepthbuf_pars_vertex:bm,logdepthbuf_vertex:Em,map_fragment:wm,map_pars_fragment:Am,map_particle_fragment:Tm,map_particle_pars_fragment:Rm,metalnessmap_fragment:Cm,metalnessmap_pars_fragment:Pm,morphinstance_vertex:Dm,morphcolor_vertex:Lm,morphnormal_vertex:Im,morphtarget_pars_vertex:km,morphtarget_vertex:Um,normal_fragment_begin:Fm,normal_fragment_maps:Nm,normal_pars_fragment:zm,normal_pars_vertex:Om,normal_vertex:Bm,normalmap_pars_fragment:Hm,clearcoat_normal_fragment_begin:Gm,clearcoat_normal_fragment_maps:Vm,clearcoat_pars_fragment:Xm,iridescence_pars_fragment:Wm,opaque_fragment:$m,packing:Ym,premultiplied_alpha_fragment:Zm,project_vertex:qm,dithering_fragment:jm,dithering_pars_fragment:Km,roughnessmap_fragment:Jm,roughnessmap_pars_fragment:Qm,shadowmap_pars_fragment:tg,shadowmap_pars_vertex:eg,shadowmap_vertex:ng,shadowmask_pars_fragment:ig,skinbase_vertex:sg,skinning_pars_vertex:ag,skinning_vertex:rg,skinnormal_vertex:og,specularmap_fragment:cg,specularmap_pars_fragment:lg,tonemapping_fragment:dg,tonemapping_pars_fragment:hg,transmission_fragment:ug,transmission_pars_fragment:fg,uv_pars_fragment:pg,uv_pars_vertex:mg,uv_vertex:gg,worldpos_vertex:_g,background_vert:xg,background_frag:vg,backgroundCube_vert:Mg,backgroundCube_frag:yg,cube_vert:Sg,cube_frag:bg,depth_vert:Eg,depth_frag:wg,distanceRGBA_vert:Ag,distanceRGBA_frag:Tg,equirect_vert:Rg,equirect_frag:Cg,linedashed_vert:Pg,linedashed_frag:Dg,meshbasic_vert:Lg,meshbasic_frag:Ig,meshlambert_vert:kg,meshlambert_frag:Ug,meshmatcap_vert:Fg,meshmatcap_frag:Ng,meshnormal_vert:zg,meshnormal_frag:Og,meshphong_vert:Bg,meshphong_frag:Hg,meshphysical_vert:Gg,meshphysical_frag:Vg,meshtoon_vert:Xg,meshtoon_frag:Wg,points_vert:$g,points_frag:Yg,shadow_vert:Zg,shadow_frag:qg,sprite_vert:jg,sprite_frag:Kg},At={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new jt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new jt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},xn={basic:{uniforms:Fe([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:Fe([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new qt(0)}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:Fe([At.common,At.specularmap,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.fog,At.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:Fe([At.common,At.envmap,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.roughnessmap,At.metalnessmap,At.fog,At.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:Fe([At.common,At.aomap,At.lightmap,At.emissivemap,At.bumpmap,At.normalmap,At.displacementmap,At.gradientmap,At.fog,At.lights,{emissive:{value:new qt(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:Fe([At.common,At.bumpmap,At.normalmap,At.displacementmap,At.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:Fe([At.points,At.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:Fe([At.common,At.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:Fe([At.common,At.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:Fe([At.common,At.bumpmap,At.normalmap,At.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:Fe([At.sprite,At.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distanceRGBA:{uniforms:Fe([At.common,At.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distanceRGBA_vert,fragmentShader:Jt.distanceRGBA_frag},shadow:{uniforms:Fe([At.lights,At.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};xn.physical={uniforms:Fe([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new jt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new jt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new jt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};const Ws={r:0,b:0,g:0},ai=new bn,Jg=new pe;function Qg(i,t,e,n,s,a,r){const o=new qt(0);let c=a===!0?0:1,l,h,f=null,p=0,d=null;function m(x){let S=x.isScene===!0?x.background:null;return S&&S.isTexture&&(S=(x.backgroundBlurriness>0?e:t).get(S)),S}function _(x){let S=!1;const v=m(x);v===null?u(o,c):v&&v.isColor&&(u(v,1),S=!0);const L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,r):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(x,S){const v=m(S);v&&(v.isCubeTexture||v.mapping===Ca)?(h===void 0&&(h=new fe(new En(1,1,1),new Qn({name:"BackgroundCubeMaterial",uniforms:Ji(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Ge,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ai.copy(S.backgroundRotation),ai.x*=-1,ai.y*=-1,ai.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Jg.makeRotationFromEuler(ai)),h.material.toneMapped=ne.getTransfer(v.colorSpace)!==le,(f!==v||p!==v.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=v,p=v.version,d=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new fe(new La(2,2),new Qn({name:"BackgroundMaterial",uniforms:Ji(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=ne.getTransfer(v.colorSpace)!==le,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||p!==v.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,f=v,p=v.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function u(x,S){x.getRGB(Ws,gd(i)),n.buffers.color.setClear(Ws.r,Ws.g,Ws.b,S,r)}return{getClearColor:function(){return o},setClearColor:function(x,S=1){o.set(x),c=S,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,u(o,c)},render:_,addToRenderList:g}}function t0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let a=s,r=!1;function o(y,P,G,F,W){let T=!1;const A=f(F,G,P);a!==A&&(a=A,l(a.object)),T=d(y,F,G,W),T&&m(y,F,G,W),W!==null&&t.update(W,i.ELEMENT_ARRAY_BUFFER),(T||r)&&(r=!1,v(y,P,G,F),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function f(y,P,G){const F=G.wireframe===!0;let W=n[y.id];W===void 0&&(W={},n[y.id]=W);let T=W[P.id];T===void 0&&(T={},W[P.id]=T);let A=T[F];return A===void 0&&(A=p(c()),T[F]=A),A}function p(y){const P=[],G=[],F=[];for(let W=0;W<e;W++)P[W]=0,G[W]=0,F[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:G,attributeDivisors:F,object:y,attributes:{},index:null}}function d(y,P,G,F){const W=a.attributes,T=P.attributes;let A=0;const B=G.getAttributes();for(const O in B)if(B[O].location>=0){const it=W[O];let mt=T[O];if(mt===void 0&&(O==="instanceMatrix"&&y.instanceMatrix&&(mt=y.instanceMatrix),O==="instanceColor"&&y.instanceColor&&(mt=y.instanceColor)),it===void 0||it.attribute!==mt||mt&&it.data!==mt.data)return!0;A++}return a.attributesNum!==A||a.index!==F}function m(y,P,G,F){const W={},T=P.attributes;let A=0;const B=G.getAttributes();for(const O in B)if(B[O].location>=0){let it=T[O];it===void 0&&(O==="instanceMatrix"&&y.instanceMatrix&&(it=y.instanceMatrix),O==="instanceColor"&&y.instanceColor&&(it=y.instanceColor));const mt={};mt.attribute=it,it&&it.data&&(mt.data=it.data),W[O]=mt,A++}a.attributes=W,a.attributesNum=A,a.index=F}function _(){const y=a.newAttributes;for(let P=0,G=y.length;P<G;P++)y[P]=0}function g(y){u(y,0)}function u(y,P){const G=a.newAttributes,F=a.enabledAttributes,W=a.attributeDivisors;G[y]=1,F[y]===0&&(i.enableVertexAttribArray(y),F[y]=1),W[y]!==P&&(i.vertexAttribDivisor(y,P),W[y]=P)}function x(){const y=a.newAttributes,P=a.enabledAttributes;for(let G=0,F=P.length;G<F;G++)P[G]!==y[G]&&(i.disableVertexAttribArray(G),P[G]=0)}function S(y,P,G,F,W,T,A){A===!0?i.vertexAttribIPointer(y,P,G,W,T):i.vertexAttribPointer(y,P,G,F,W,T)}function v(y,P,G,F){_();const W=F.attributes,T=G.getAttributes(),A=P.defaultAttributeValues;for(const B in T){const O=T[B];if(O.location>=0){let $=W[B];if($===void 0&&(B==="instanceMatrix"&&y.instanceMatrix&&($=y.instanceMatrix),B==="instanceColor"&&y.instanceColor&&($=y.instanceColor)),$!==void 0){const it=$.normalized,mt=$.itemSize,ct=t.get($);if(ct===void 0)continue;const gt=ct.buffer,Y=ct.type,nt=ct.bytesPerElement,ot=Y===i.INT||Y===i.UNSIGNED_INT||$.gpuType===Vo;if($.isInterleavedBufferAttribute){const rt=$.data,xt=rt.stride,Ct=$.offset;if(rt.isInstancedInterleavedBuffer){for(let Lt=0;Lt<O.locationSize;Lt++)u(O.location+Lt,rt.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Lt=0;Lt<O.locationSize;Lt++)g(O.location+Lt);i.bindBuffer(i.ARRAY_BUFFER,gt);for(let Lt=0;Lt<O.locationSize;Lt++)S(O.location+Lt,mt/O.locationSize,Y,it,xt*nt,(Ct+mt/O.locationSize*Lt)*nt,ot)}else{if($.isInstancedBufferAttribute){for(let rt=0;rt<O.locationSize;rt++)u(O.location+rt,$.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let rt=0;rt<O.locationSize;rt++)g(O.location+rt);i.bindBuffer(i.ARRAY_BUFFER,gt);for(let rt=0;rt<O.locationSize;rt++)S(O.location+rt,mt/O.locationSize,Y,it,mt*nt,mt/O.locationSize*rt*nt,ot)}}else if(A!==void 0){const it=A[B];if(it!==void 0)switch(it.length){case 2:i.vertexAttrib2fv(O.location,it);break;case 3:i.vertexAttrib3fv(O.location,it);break;case 4:i.vertexAttrib4fv(O.location,it);break;default:i.vertexAttrib1fv(O.location,it)}}}}x()}function L(){D();for(const y in n){const P=n[y];for(const G in P){const F=P[G];for(const W in F)h(F[W].object),delete F[W];delete P[G]}delete n[y]}}function R(y){if(n[y.id]===void 0)return;const P=n[y.id];for(const G in P){const F=P[G];for(const W in F)h(F[W].object),delete F[W];delete P[G]}delete n[y.id]}function C(y){for(const P in n){const G=n[P];if(G[y.id]===void 0)continue;const F=G[y.id];for(const W in F)h(F[W].object),delete F[W];delete G[y.id]}}function D(){b(),r=!0,a!==s&&(a=s,l(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:D,resetDefaultState:b,dispose:L,releaseStatesOfGeometry:R,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:g,disableUnusedAttributes:x}}function e0(i,t,e){let n;function s(l){n=l}function a(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,f){f!==0&&(i.drawArraysInstanced(n,l,h,f),e.update(h,n,f))}function o(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,f);let d=0;for(let m=0;m<f;m++)d+=h[m];e.update(d,n,1)}function c(l,h,f,p){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<l.length;m++)r(l[m],h[m],p[m]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,p,0,f);let m=0;for(let _=0;_<f;_++)m+=h[_]*p[_];e.update(m,n,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function n0(i,t,e,n){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==ln&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const D=C===ys&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==On&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Fn&&!D)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=e.logarithmicDepthBuffer===!0,p=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=m>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:d,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:u,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:L,maxSamples:R}}function i0(i){const t=this;let e=null,n=0,s=!1,a=!1;const r=new ci,o=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const d=f.length!==0||p||n!==0||s;return s=p,n=f.length,d},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,p){e=h(f,p,0)},this.setState=function(f,p,d){const m=f.clippingPlanes,_=f.clipIntersection,g=f.clipShadows,u=i.get(f);if(!s||m===null||m.length===0||a&&!g)a?h(null):l();else{const x=a?0:n,S=x*4;let v=u.clippingState||null;c.value=v,v=h(m,p,S,d);for(let L=0;L!==S;++L)v[L]=e[L];u.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,p,d,m){const _=f!==null?f.length:0;let g=null;if(_!==0){if(g=c.value,m!==!0||g===null){const u=d+_*4,x=p.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<u)&&(g=new Float32Array(u));for(let S=0,v=d;S!==_;++S,v+=4)r.copy(f[S]).applyMatrix4(x,o),r.normal.toArray(g,v),g[v+3]=r.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function s0(i){let t=new WeakMap;function e(r,o){return o===Kr?r.mapping=Zi:o===Jr&&(r.mapping=qi),r}function n(r){if(r&&r.isTexture){const o=r.mapping;if(o===Kr||o===Jr)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new mp(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class Md extends _d{constructor(t=-1,e=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-t,r=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Gi=4,tl=[.125,.215,.35,.446,.526,.582],hi=20,gr=new Md,el=new qt;let _r=null,xr=0,vr=0,Mr=!1;const li=(1+Math.sqrt(5))/2,Fi=1/li,nl=[new X(-li,Fi,0),new X(li,Fi,0),new X(-Fi,0,li),new X(Fi,0,li),new X(0,li,-Fi),new X(0,li,Fi),new X(-1,1,-1),new X(1,1,-1),new X(-1,1,1),new X(1,1,1)];class il{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){_r=this._renderer.getRenderTarget(),xr=this._renderer.getActiveCubeFace(),vr=this._renderer.getActiveMipmapLevel(),Mr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(_r,xr,vr),this._renderer.xr.enabled=Mr,t.scissorTest=!1,$s(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Zi||t.mapping===qi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),_r=this._renderer.getRenderTarget(),xr=this._renderer.getActiveCubeFace(),vr=this._renderer.getActiveMipmapLevel(),Mr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:ys,format:ln,colorSpace:Qi,depthBuffer:!1},s=sl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sl(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=a0(a)),this._blurMaterial=r0(a,t,e)}return s}_compileMaterial(t){const e=new fe(this._lodPlanes[0],t);this._renderer.compile(e,gr)}_sceneToCubeUV(t,e,n,s){const o=new Je(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor(el),h.toneMapping=jn,h.autoClear=!1;const d=new _n({name:"PMREM.Background",side:Ge,depthWrite:!1,depthTest:!1}),m=new fe(new En,d);let _=!1;const g=t.background;g?g.isColor&&(d.color.copy(g),t.background=null,_=!0):(d.color.copy(el),_=!0);for(let u=0;u<6;u++){const x=u%3;x===0?(o.up.set(0,c[u],0),o.lookAt(l[u],0,0)):x===1?(o.up.set(0,0,c[u]),o.lookAt(0,l[u],0)):(o.up.set(0,c[u],0),o.lookAt(0,0,l[u]));const S=this._cubeSize;$s(s,x*S,u>2?S:0,S,S),h.setRenderTarget(s),_&&h.render(m,o),h.render(t,o)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Zi||t.mapping===qi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=rl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=al());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new fe(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;$s(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,gr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=nl[(s-a-1)%nl.length];this._blur(t,a-1,a,r,o)}e.autoClear=n}_blur(t,e,n,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",a),this._halfBlur(r,t,n,n,s,"longitudinal",a)}_halfBlur(t,e,n,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new fe(this._lodPlanes[s],l),p=l.uniforms,d=this._sizeLods[n]-1,m=isFinite(a)?Math.PI/(2*d):2*Math.PI/(2*hi-1),_=a/m,g=isFinite(a)?1+Math.floor(h*_):hi;g>hi&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${hi}`);const u=[];let x=0;for(let C=0;C<hi;++C){const D=C/_,b=Math.exp(-D*D/2);u.push(b),C===0?x+=b:C<g&&(x+=2*b)}for(let C=0;C<u.length;C++)u[C]=u[C]/x;p.envMap.value=t.texture,p.samples.value=g,p.weights.value=u,p.latitudinal.value=r==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:S}=this;p.dTheta.value=m,p.mipInt.value=S-n;const v=this._sizeLods[s],L=3*v*(s>S-Gi?s-S+Gi:0),R=4*(this._cubeSize-v);$s(e,L,R,3*v,2*v),c.setRenderTarget(e),c.render(f,gr)}}function a0(i){const t=[],e=[],n=[];let s=i;const a=i-Gi+1+tl.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>i-Gi?c=tl[r-i+Gi-1]:r===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,f=1+l,p=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,m=6,_=3,g=2,u=1,x=new Float32Array(_*m*d),S=new Float32Array(g*m*d),v=new Float32Array(u*m*d);for(let R=0;R<d;R++){const C=R%3*2/3-1,D=R>2?0:-1,b=[C,D,0,C+2/3,D,0,C+2/3,D+1,0,C,D,0,C+2/3,D+1,0,C,D+1,0];x.set(b,_*m*R),S.set(p,g*m*R);const y=[R,R,R,R,R,R];v.set(y,u*m*R)}const L=new Ve;L.setAttribute("position",new hn(x,_)),L.setAttribute("uv",new hn(S,g)),L.setAttribute("faceIndex",new hn(v,u)),t.push(L),s>Gi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function sl(i,t,e){const n=new _i(i,t,e);return n.texture.mapping=Ca,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $s(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function r0(i,t,e){const n=new Float32Array(hi),s=new X(0,1,0);return new Qn({name:"SphericalGaussianBlur",defines:{n:hi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Jo(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function al(){return new Qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jo(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function rl(){return new Qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Jo(){return`

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
	`}function o0(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Kr||c===Jr,h=c===Zi||c===qi;if(l||h){let f=t.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return e===null&&(e=new il(i)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new il(i)),f=l?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function c0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&fs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function l0(i,t,e,n){const s={},a=new WeakMap;function r(f){const p=f.target;p.index!==null&&t.remove(p.index);for(const m in p.attributes)t.remove(p.attributes[m]);for(const m in p.morphAttributes){const _=p.morphAttributes[m];for(let g=0,u=_.length;g<u;g++)t.remove(_[g])}p.removeEventListener("dispose",r),delete s[p.id];const d=a.get(p);d&&(t.remove(d),a.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function o(f,p){return s[p.id]===!0||(p.addEventListener("dispose",r),s[p.id]=!0,e.memory.geometries++),p}function c(f){const p=f.attributes;for(const m in p)t.update(p[m],i.ARRAY_BUFFER);const d=f.morphAttributes;for(const m in d){const _=d[m];for(let g=0,u=_.length;g<u;g++)t.update(_[g],i.ARRAY_BUFFER)}}function l(f){const p=[],d=f.index,m=f.attributes.position;let _=0;if(d!==null){const x=d.array;_=d.version;for(let S=0,v=x.length;S<v;S+=3){const L=x[S+0],R=x[S+1],C=x[S+2];p.push(L,R,R,C,C,L)}}else if(m!==void 0){const x=m.array;_=m.version;for(let S=0,v=x.length/3-1;S<v;S+=3){const L=S+0,R=S+1,C=S+2;p.push(L,R,R,C,C,L)}}else return;const g=new(dd(p)?md:pd)(p,1);g.version=_;const u=a.get(f);u&&t.remove(u),a.set(f,g)}function h(f){const p=a.get(f);if(p){const d=f.index;d!==null&&p.version<d.version&&l(f)}else l(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function d0(i,t,e){let n;function s(p){n=p}let a,r;function o(p){a=p.type,r=p.bytesPerElement}function c(p,d){i.drawElements(n,d,a,p*r),e.update(d,n,1)}function l(p,d,m){m!==0&&(i.drawElementsInstanced(n,d,a,p*r,m),e.update(d,n,m))}function h(p,d,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,a,p,0,m);let g=0;for(let u=0;u<m;u++)g+=d[u];e.update(g,n,1)}function f(p,d,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let u=0;u<p.length;u++)l(p[u]/r,d[u],_[u]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,a,p,0,_,0,m);let u=0;for(let x=0;x<m;x++)u+=d[x]*_[x];e.update(u,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function h0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function u0(i,t,e){const n=new WeakMap,s=new _e;function a(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let p=n.get(o);if(p===void 0||p.count!==f){let y=function(){D.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var d=y;p!==void 0&&p.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let v=0;m===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let L=o.attributes.position.count*v,R=1;L>t.maxTextureSize&&(R=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const C=new Float32Array(L*R*4*f),D=new ud(C,L,R,f);D.type=Fn,D.needsUpdate=!0;const b=v*4;for(let P=0;P<f;P++){const G=u[P],F=x[P],W=S[P],T=L*R*4*P;for(let A=0;A<G.count;A++){const B=A*b;m===!0&&(s.fromBufferAttribute(G,A),C[T+B+0]=s.x,C[T+B+1]=s.y,C[T+B+2]=s.z,C[T+B+3]=0),_===!0&&(s.fromBufferAttribute(F,A),C[T+B+4]=s.x,C[T+B+5]=s.y,C[T+B+6]=s.z,C[T+B+7]=0),g===!0&&(s.fromBufferAttribute(W,A),C[T+B+8]=s.x,C[T+B+9]=s.y,C[T+B+10]=s.z,C[T+B+11]=W.itemSize===4?s.w:1)}}p={count:f,texture:D,size:new jt(L,R)},n.set(o,p),o.addEventListener("dispose",y)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const _=o.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:a}}function f0(i,t,e,n){let s=new WeakMap;function a(c){const l=n.render.frame,h=c.geometry,f=t.get(c,h);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==l&&(p.update(),s.set(p,l))}return f}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class yd extends Oe{constructor(t,e,n,s,a,r,o,c,l,h=Wi){if(h!==Wi&&h!==Ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Wi&&(n=gi),n===void 0&&h===Ki&&(n=ji),super(null,s,a,r,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:dn,this.minFilter=c!==void 0?c:dn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Sd=new Oe,ol=new yd(1,1),bd=new ud,Ed=new Qf,wd=new xd,cl=[],ll=[],dl=new Float32Array(16),hl=new Float32Array(9),ul=new Float32Array(4);function es(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let a=cl[s];if(a===void 0&&(a=new Float32Array(s),cl[s]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,i[r].toArray(a,o)}return a}function Ee(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function we(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ia(i,t){let e=ll[t];e===void 0&&(e=new Int32Array(t),ll[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function p0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function m0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2fv(this.addr,t),we(e,t)}}function g0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;i.uniform3fv(this.addr,t),we(e,t)}}function _0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4fv(this.addr,t),we(e,t)}}function x0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),we(e,t)}else{if(Ee(e,n))return;ul.set(n),i.uniformMatrix2fv(this.addr,!1,ul),we(e,n)}}function v0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),we(e,t)}else{if(Ee(e,n))return;hl.set(n),i.uniformMatrix3fv(this.addr,!1,hl),we(e,n)}}function M0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),we(e,t)}else{if(Ee(e,n))return;dl.set(n),i.uniformMatrix4fv(this.addr,!1,dl),we(e,n)}}function y0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function S0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2iv(this.addr,t),we(e,t)}}function b0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3iv(this.addr,t),we(e,t)}}function E0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4iv(this.addr,t),we(e,t)}}function w0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function A0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2uiv(this.addr,t),we(e,t)}}function T0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3uiv(this.addr,t),we(e,t)}}function R0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4uiv(this.addr,t),we(e,t)}}function C0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(ol.compareFunction=ld,a=ol):a=Sd,e.setTexture2D(t||a,s)}function P0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Ed,s)}function D0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||wd,s)}function L0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||bd,s)}function I0(i){switch(i){case 5126:return p0;case 35664:return m0;case 35665:return g0;case 35666:return _0;case 35674:return x0;case 35675:return v0;case 35676:return M0;case 5124:case 35670:return y0;case 35667:case 35671:return S0;case 35668:case 35672:return b0;case 35669:case 35673:return E0;case 5125:return w0;case 36294:return A0;case 36295:return T0;case 36296:return R0;case 35678:case 36198:case 36298:case 36306:case 35682:return C0;case 35679:case 36299:case 36307:return P0;case 35680:case 36300:case 36308:case 36293:return D0;case 36289:case 36303:case 36311:case 36292:return L0}}function k0(i,t){i.uniform1fv(this.addr,t)}function U0(i,t){const e=es(t,this.size,2);i.uniform2fv(this.addr,e)}function F0(i,t){const e=es(t,this.size,3);i.uniform3fv(this.addr,e)}function N0(i,t){const e=es(t,this.size,4);i.uniform4fv(this.addr,e)}function z0(i,t){const e=es(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function O0(i,t){const e=es(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function B0(i,t){const e=es(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function H0(i,t){i.uniform1iv(this.addr,t)}function G0(i,t){i.uniform2iv(this.addr,t)}function V0(i,t){i.uniform3iv(this.addr,t)}function X0(i,t){i.uniform4iv(this.addr,t)}function W0(i,t){i.uniform1uiv(this.addr,t)}function $0(i,t){i.uniform2uiv(this.addr,t)}function Y0(i,t){i.uniform3uiv(this.addr,t)}function Z0(i,t){i.uniform4uiv(this.addr,t)}function q0(i,t,e){const n=this.cache,s=t.length,a=Ia(e,s);Ee(n,a)||(i.uniform1iv(this.addr,a),we(n,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||Sd,a[r])}function j0(i,t,e){const n=this.cache,s=t.length,a=Ia(e,s);Ee(n,a)||(i.uniform1iv(this.addr,a),we(n,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||Ed,a[r])}function K0(i,t,e){const n=this.cache,s=t.length,a=Ia(e,s);Ee(n,a)||(i.uniform1iv(this.addr,a),we(n,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||wd,a[r])}function J0(i,t,e){const n=this.cache,s=t.length,a=Ia(e,s);Ee(n,a)||(i.uniform1iv(this.addr,a),we(n,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||bd,a[r])}function Q0(i){switch(i){case 5126:return k0;case 35664:return U0;case 35665:return F0;case 35666:return N0;case 35674:return z0;case 35675:return O0;case 35676:return B0;case 5124:case 35670:return H0;case 35667:case 35671:return G0;case 35668:case 35672:return V0;case 35669:case 35673:return X0;case 5125:return W0;case 36294:return $0;case 36295:return Y0;case 36296:return Z0;case 35678:case 36198:case 36298:case 36306:case 35682:return q0;case 35679:case 36299:case 36307:return j0;case 35680:case 36300:case 36308:case 36293:return K0;case 36289:case 36303:case 36311:case 36292:return J0}}class t_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=I0(e.type)}}class e_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Q0(e.type)}}class n_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],n)}}}const yr=/(\w+)(\])?(\[|\.)?/g;function fl(i,t){i.seq.push(t),i.map[t.id]=t}function i_(i,t,e){const n=i.name,s=n.length;for(yr.lastIndex=0;;){const a=yr.exec(n),r=yr.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){fl(e,l===void 0?new t_(o,i,t):new e_(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new n_(o),fl(e,f)),e=f}}}class ha{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);i_(a,r,this)}}setValue(t,e,n,s){const a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function pl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const s_=37297;let a_=0;function r_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}const ml=new Kt;function o_(i){ne._getMatrix(ml,ne.workingColorSpace,i);const t=`mat3( ${ml.elements.map(e=>e.toFixed(4))} )`;switch(ne.getTransfer(i)){case Pa:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function gl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+r_(i.getShaderSource(t),r)}else return s}function c_(i,t){const e=o_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function l_(i,t){let e;switch(t){case Af:e="Linear";break;case Tf:e="Reinhard";break;case Rf:e="Cineon";break;case Cf:e="ACESFilmic";break;case Df:e="AgX";break;case Lf:e="Neutral";break;case Pf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ys=new X;function d_(){ne.getLuminanceCoefficients(Ys);const i=Ys.x.toFixed(4),t=Ys.y.toFixed(4),e=Ys.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function h_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ps).join(`
`)}function u_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function f_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(t,s),r=a.name;let o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:i.getAttribLocation(t,r),locationSize:o}}return e}function ps(i){return i!==""}function _l(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function xl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const p_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Po(i){return i.replace(p_,g_)}const m_=new Map;function g_(i,t){let e=Jt[t];if(e===void 0){const n=m_.get(t);if(n!==void 0)e=Jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Po(e)}const __=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vl(i){return i.replace(__,x_)}function x_(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Ml(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function v_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===ql?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===jl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===kn&&(t="SHADOWMAP_TYPE_VSM"),t}function M_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Zi:case qi:t="ENVMAP_TYPE_CUBE";break;case Ca:t="ENVMAP_TYPE_CUBE_UV";break}return t}function y_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case qi:t="ENVMAP_MODE_REFRACTION";break}return t}function S_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Go:t="ENVMAP_BLENDING_MULTIPLY";break;case Ef:t="ENVMAP_BLENDING_MIX";break;case wf:t="ENVMAP_BLENDING_ADD";break}return t}function b_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function E_(i,t,e,n){const s=i.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=v_(e),l=M_(e),h=y_(e),f=S_(e),p=b_(e),d=h_(e),m=u_(a),_=s.createProgram();let g,u,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ps).join(`
`),g.length>0&&(g+=`
`),u=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ps).join(`
`),u.length>0&&(u+=`
`)):(g=[Ml(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ps).join(`
`),u=[Ml(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==jn?"#define TONE_MAPPING":"",e.toneMapping!==jn?Jt.tonemapping_pars_fragment:"",e.toneMapping!==jn?l_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,c_("linearToOutputTexel",e.outputColorSpace),d_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ps).join(`
`)),r=Po(r),r=_l(r,e),r=xl(r,e),o=Po(o),o=_l(o,e),o=xl(o,e),r=vl(r),o=vl(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,u=["#define varying in",e.glslVersion===Ic?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ic?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const S=x+g+r,v=x+u+o,L=pl(s,s.VERTEX_SHADER,S),R=pl(s,s.FRAGMENT_SHADER,v);s.attachShader(_,L),s.attachShader(_,R),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(P){if(i.debug.checkShaderErrors){const G=s.getProgramInfoLog(_).trim(),F=s.getShaderInfoLog(L).trim(),W=s.getShaderInfoLog(R).trim();let T=!0,A=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(T=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,L,R);else{const B=gl(s,L,"vertex"),O=gl(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+G+`
`+B+`
`+O)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(F===""||W==="")&&(A=!1);A&&(P.diagnostics={runnable:T,programLog:G,vertexShader:{log:F,prefix:g},fragmentShader:{log:W,prefix:u}})}s.deleteShader(L),s.deleteShader(R),D=new ha(s,_),b=f_(s,_)}let D;this.getUniforms=function(){return D===void 0&&C(this),D};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,s_)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=a_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=R,this}let w_=0;class A_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new T_(t),e.set(t,n)),n}}class T_{constructor(t){this.id=w_++,this.code=t,this.usedTimes=0}}function R_(i,t,e,n,s,a,r){const o=new jo,c=new A_,l=new Set,h=[],f=s.logarithmicDepthBuffer,p=s.vertexTextures;let d=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,y,P,G,F){const W=G.fog,T=F.geometry,A=b.isMeshStandardMaterial?G.environment:null,B=(b.isMeshStandardMaterial?e:t).get(b.envMap||A),O=B&&B.mapping===Ca?B.image.height:null,$=m[b.type];b.precision!==null&&(d=s.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const it=T.morphAttributes.position||T.morphAttributes.normal||T.morphAttributes.color,mt=it!==void 0?it.length:0;let ct=0;T.morphAttributes.position!==void 0&&(ct=1),T.morphAttributes.normal!==void 0&&(ct=2),T.morphAttributes.color!==void 0&&(ct=3);let gt,Y,nt,ot;if($){const Z=xn[$];gt=Z.vertexShader,Y=Z.fragmentShader}else gt=b.vertexShader,Y=b.fragmentShader,c.update(b),nt=c.getVertexShaderID(b),ot=c.getFragmentShaderID(b);const rt=i.getRenderTarget(),xt=i.state.buffers.depth.getReversed(),Ct=F.isInstancedMesh===!0,Lt=F.isBatchedMesh===!0,Ht=!!b.map,wt=!!b.matcap,It=!!B,k=!!b.aoMap,re=!!b.lightMap,Rt=!!b.bumpMap,Pt=!!b.normalMap,q=!!b.displacementMap,ht=!!b.emissiveMap,pt=!!b.metalnessMap,w=!!b.roughnessMap,M=b.anisotropy>0,N=b.clearcoat>0,U=b.dispersion>0,Q=b.iridescence>0,et=b.sheen>0,K=b.transmission>0,lt=M&&!!b.anisotropyMap,ut=N&&!!b.clearcoatMap,Wt=N&&!!b.clearcoatNormalMap,ft=N&&!!b.clearcoatRoughnessMap,bt=Q&&!!b.iridescenceMap,z=Q&&!!b.iridescenceThicknessMap,st=et&&!!b.sheenColorMap,dt=et&&!!b.sheenRoughnessMap,kt=!!b.specularMap,Ut=!!b.specularColorMap,Xt=!!b.specularIntensityMap,I=K&&!!b.transmissionMap,Mt=K&&!!b.thicknessMap,j=!!b.gradientMap,at=!!b.alphaMap,Et=b.alphaTest>0,St=!!b.alphaHash,Gt=!!b.extensions;let Zt=jn;b.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(Zt=i.toneMapping);const ie={shaderID:$,shaderType:b.type,shaderName:b.name,vertexShader:gt,fragmentShader:Y,defines:b.defines,customVertexShaderID:nt,customFragmentShaderID:ot,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:Lt,batchingColor:Lt&&F._colorsTexture!==null,instancing:Ct,instancingColor:Ct&&F.instanceColor!==null,instancingMorph:Ct&&F.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Qi,alphaToCoverage:!!b.alphaToCoverage,map:Ht,matcap:wt,envMap:It,envMapMode:It&&B.mapping,envMapCubeUVHeight:O,aoMap:k,lightMap:re,bumpMap:Rt,normalMap:Pt,displacementMap:p&&q,emissiveMap:ht,normalMapObjectSpace:Pt&&b.normalMapType===Ff,normalMapTangentSpace:Pt&&b.normalMapType===cd,metalnessMap:pt,roughnessMap:w,anisotropy:M,anisotropyMap:lt,clearcoat:N,clearcoatMap:ut,clearcoatNormalMap:Wt,clearcoatRoughnessMap:ft,dispersion:U,iridescence:Q,iridescenceMap:bt,iridescenceThicknessMap:z,sheen:et,sheenColorMap:st,sheenRoughnessMap:dt,specularMap:kt,specularColorMap:Ut,specularIntensityMap:Xt,transmission:K,transmissionMap:I,thicknessMap:Mt,gradientMap:j,opaque:b.transparent===!1&&b.blending===Xi&&b.alphaToCoverage===!1,alphaMap:at,alphaTest:Et,alphaHash:St,combine:b.combine,mapUv:Ht&&_(b.map.channel),aoMapUv:k&&_(b.aoMap.channel),lightMapUv:re&&_(b.lightMap.channel),bumpMapUv:Rt&&_(b.bumpMap.channel),normalMapUv:Pt&&_(b.normalMap.channel),displacementMapUv:q&&_(b.displacementMap.channel),emissiveMapUv:ht&&_(b.emissiveMap.channel),metalnessMapUv:pt&&_(b.metalnessMap.channel),roughnessMapUv:w&&_(b.roughnessMap.channel),anisotropyMapUv:lt&&_(b.anisotropyMap.channel),clearcoatMapUv:ut&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Wt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ft&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:bt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:z&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:st&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:dt&&_(b.sheenRoughnessMap.channel),specularMapUv:kt&&_(b.specularMap.channel),specularColorMapUv:Ut&&_(b.specularColorMap.channel),specularIntensityMapUv:Xt&&_(b.specularIntensityMap.channel),transmissionMapUv:I&&_(b.transmissionMap.channel),thicknessMapUv:Mt&&_(b.thicknessMap.channel),alphaMapUv:at&&_(b.alphaMap.channel),vertexTangents:!!T.attributes.tangent&&(Pt||M),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!T.attributes.color&&T.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!T.attributes.uv&&(Ht||at),fog:!!W,useFog:b.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:xt,skinning:F.isSkinnedMesh===!0,morphTargets:T.morphAttributes.position!==void 0,morphNormals:T.morphAttributes.normal!==void 0,morphColors:T.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:ct,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Zt,decodeVideoTexture:Ht&&b.map.isVideoTexture===!0&&ne.getTransfer(b.map.colorSpace)===le,decodeVideoTextureEmissive:ht&&b.emissiveMap.isVideoTexture===!0&&ne.getTransfer(b.emissiveMap.colorSpace)===le,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ne,flipSided:b.side===Ge,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Gt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Gt&&b.extensions.multiDraw===!0||Lt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ie.vertexUv1s=l.has(1),ie.vertexUv2s=l.has(2),ie.vertexUv3s=l.has(3),l.clear(),ie}function u(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)y.push(P),y.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(x(y,b),S(y,b),y.push(i.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function S(b,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),b.push(o.mask)}function v(b){const y=m[b.type];let P;if(y){const G=xn[y];P=hp.clone(G.uniforms)}else P=b.uniforms;return P}function L(b,y){let P;for(let G=0,F=h.length;G<F;G++){const W=h[G];if(W.cacheKey===y){P=W,++P.usedTimes;break}}return P===void 0&&(P=new E_(i,y,b,a),h.push(P)),P}function R(b){if(--b.usedTimes===0){const y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function C(b){c.remove(b)}function D(){c.dispose()}return{getParameters:g,getProgramCacheKey:u,getUniforms:v,acquireProgram:L,releaseProgram:R,releaseShaderCache:C,programs:h,dispose:D}}function C_(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:a}}function P_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function yl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Sl(){const i=[];let t=0;const e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function r(f,p,d,m,_,g){let u=i[t];return u===void 0?(u={id:f.id,object:f,geometry:p,material:d,groupOrder:m,renderOrder:f.renderOrder,z:_,group:g},i[t]=u):(u.id=f.id,u.object=f,u.geometry=p,u.material=d,u.groupOrder=m,u.renderOrder=f.renderOrder,u.z=_,u.group=g),t++,u}function o(f,p,d,m,_,g){const u=r(f,p,d,m,_,g);d.transmission>0?n.push(u):d.transparent===!0?s.push(u):e.push(u)}function c(f,p,d,m,_,g){const u=r(f,p,d,m,_,g);d.transmission>0?n.unshift(u):d.transparent===!0?s.unshift(u):e.unshift(u)}function l(f,p){e.length>1&&e.sort(f||P_),n.length>1&&n.sort(p||yl),s.length>1&&s.sort(p||yl)}function h(){for(let f=t,p=i.length;f<p;f++){const d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:o,unshift:c,finish:h,sort:l}}function D_(){let i=new WeakMap;function t(n,s){const a=i.get(n);let r;return a===void 0?(r=new Sl,i.set(n,[r])):s>=a.length?(r=new Sl,a.push(r)):r=a[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function L_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new X,color:new qt};break;case"SpotLight":e={position:new X,direction:new X,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new X,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new X,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new X,halfWidth:new X,halfHeight:new X};break}return i[t.id]=e,e}}}function I_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new jt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new jt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new jt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let k_=0;function U_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function F_(i){const t=new L_,e=I_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new X);const s=new X,a=new pe,r=new pe;function o(l){let h=0,f=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,m=0,_=0,g=0,u=0,x=0,S=0,v=0,L=0,R=0,C=0;l.sort(U_);for(let b=0,y=l.length;b<y;b++){const P=l[b],G=P.color,F=P.intensity,W=P.distance,T=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=G.r*F,f+=G.g*F,p+=G.b*F;else if(P.isLightProbe){for(let A=0;A<9;A++)n.probe[A].addScaledVector(P.sh.coefficients[A],F);C++}else if(P.isDirectionalLight){const A=t.get(P);if(A.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const B=P.shadow,O=e.get(P);O.shadowIntensity=B.intensity,O.shadowBias=B.bias,O.shadowNormalBias=B.normalBias,O.shadowRadius=B.radius,O.shadowMapSize=B.mapSize,n.directionalShadow[d]=O,n.directionalShadowMap[d]=T,n.directionalShadowMatrix[d]=P.shadow.matrix,x++}n.directional[d]=A,d++}else if(P.isSpotLight){const A=t.get(P);A.position.setFromMatrixPosition(P.matrixWorld),A.color.copy(G).multiplyScalar(F),A.distance=W,A.coneCos=Math.cos(P.angle),A.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),A.decay=P.decay,n.spot[_]=A;const B=P.shadow;if(P.map&&(n.spotLightMap[L]=P.map,L++,B.updateMatrices(P),P.castShadow&&R++),n.spotLightMatrix[_]=B.matrix,P.castShadow){const O=e.get(P);O.shadowIntensity=B.intensity,O.shadowBias=B.bias,O.shadowNormalBias=B.normalBias,O.shadowRadius=B.radius,O.shadowMapSize=B.mapSize,n.spotShadow[_]=O,n.spotShadowMap[_]=T,v++}_++}else if(P.isRectAreaLight){const A=t.get(P);A.color.copy(G).multiplyScalar(F),A.halfWidth.set(P.width*.5,0,0),A.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=A,g++}else if(P.isPointLight){const A=t.get(P);if(A.color.copy(P.color).multiplyScalar(P.intensity),A.distance=P.distance,A.decay=P.decay,P.castShadow){const B=P.shadow,O=e.get(P);O.shadowIntensity=B.intensity,O.shadowBias=B.bias,O.shadowNormalBias=B.normalBias,O.shadowRadius=B.radius,O.shadowMapSize=B.mapSize,O.shadowCameraNear=B.camera.near,O.shadowCameraFar=B.camera.far,n.pointShadow[m]=O,n.pointShadowMap[m]=T,n.pointShadowMatrix[m]=P.shadow.matrix,S++}n.point[m]=A,m++}else if(P.isHemisphereLight){const A=t.get(P);A.skyColor.copy(P.color).multiplyScalar(F),A.groundColor.copy(P.groundColor).multiplyScalar(F),n.hemi[u]=A,u++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=At.LTC_FLOAT_1,n.rectAreaLTC2=At.LTC_FLOAT_2):(n.rectAreaLTC1=At.LTC_HALF_1,n.rectAreaLTC2=At.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=p;const D=n.hash;(D.directionalLength!==d||D.pointLength!==m||D.spotLength!==_||D.rectAreaLength!==g||D.hemiLength!==u||D.numDirectionalShadows!==x||D.numPointShadows!==S||D.numSpotShadows!==v||D.numSpotMaps!==L||D.numLightProbes!==C)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=g,n.point.length=m,n.hemi.length=u,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=v+L-R,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=C,D.directionalLength=d,D.pointLength=m,D.spotLength=_,D.rectAreaLength=g,D.hemiLength=u,D.numDirectionalShadows=x,D.numPointShadows=S,D.numSpotShadows=v,D.numSpotMaps=L,D.numLightProbes=C,n.version=k_++)}function c(l,h){let f=0,p=0,d=0,m=0,_=0;const g=h.matrixWorldInverse;for(let u=0,x=l.length;u<x;u++){const S=l[u];if(S.isDirectionalLight){const v=n.directional[f];v.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),f++}else if(S.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),d++}else if(S.isRectAreaLight){const v=n.rectArea[m];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(g),r.identity(),a.copy(S.matrixWorld),a.premultiply(g),r.extractRotation(a),v.halfWidth.set(S.width*.5,0,0),v.halfHeight.set(0,S.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),m++}else if(S.isPointLight){const v=n.point[p];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(g),p++}else if(S.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:o,setupView:c,state:n}}function bl(i){const t=new F_(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function a(h){e.push(h)}function r(h){n.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function N_(i){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new bl(i),t.set(s,[o])):a>=r.length?(o=new bl(i),r.push(o)):o=r[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class z_ extends xi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=kf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class O_ extends xi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const B_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,H_=`uniform sampler2D shadow_pass;
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
}`;function G_(i,t,e){let n=new Ko;const s=new jt,a=new jt,r=new _e,o=new z_({depthPacking:Uf}),c=new O_,l={},h=e.maxTextureSize,f={[Jn]:Ge,[Ge]:Jn,[Ne]:Ne},p=new Qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new jt},radius:{value:4}},vertexShader:B_,fragmentShader:H_}),d=p.clone();d.defines.HORIZONTAL_PASS=1;const m=new Ve;m.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new fe(m,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ql;let u=this.type;this.render=function(R,C,D){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||R.length===0)return;const b=i.getRenderTarget(),y=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),G=i.state;G.setBlending(qn),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const F=u!==kn&&this.type===kn,W=u===kn&&this.type!==kn;for(let T=0,A=R.length;T<A;T++){const B=R[T],O=B.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);const $=O.getFrameExtents();if(s.multiply($),a.copy(O.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/$.x),s.x=a.x*$.x,O.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/$.y),s.y=a.y*$.y,O.mapSize.y=a.y)),O.map===null||F===!0||W===!0){const mt=this.type!==kn?{minFilter:dn,magFilter:dn}:{};O.map!==null&&O.map.dispose(),O.map=new _i(s.x,s.y,mt),O.map.texture.name=B.name+".shadowMap",O.camera.updateProjectionMatrix()}i.setRenderTarget(O.map),i.clear();const it=O.getViewportCount();for(let mt=0;mt<it;mt++){const ct=O.getViewport(mt);r.set(a.x*ct.x,a.y*ct.y,a.x*ct.z,a.y*ct.w),G.viewport(r),O.updateMatrices(B,mt),n=O.getFrustum(),v(C,D,O.camera,B,this.type)}O.isPointLightShadow!==!0&&this.type===kn&&x(O,D),O.needsUpdate=!1}u=this.type,g.needsUpdate=!1,i.setRenderTarget(b,y,P)};function x(R,C){const D=t.update(_);p.defines.VSM_SAMPLES!==R.blurSamples&&(p.defines.VSM_SAMPLES=R.blurSamples,d.defines.VSM_SAMPLES=R.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new _i(s.x,s.y)),p.uniforms.shadow_pass.value=R.map.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(C,null,D,p,_,null),d.uniforms.shadow_pass.value=R.mapPass.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(C,null,D,d,_,null)}function S(R,C,D,b){let y=null;const P=D.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(P!==void 0)y=P;else if(y=D.isPointLight===!0?c:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const G=y.uuid,F=C.uuid;let W=l[G];W===void 0&&(W={},l[G]=W);let T=W[F];T===void 0&&(T=y.clone(),W[F]=T,C.addEventListener("dispose",L)),y=T}if(y.visible=C.visible,y.wireframe=C.wireframe,b===kn?y.side=C.shadowSide!==null?C.shadowSide:C.side:y.side=C.shadowSide!==null?C.shadowSide:f[C.side],y.alphaMap=C.alphaMap,y.alphaTest=C.alphaTest,y.map=C.map,y.clipShadows=C.clipShadows,y.clippingPlanes=C.clippingPlanes,y.clipIntersection=C.clipIntersection,y.displacementMap=C.displacementMap,y.displacementScale=C.displacementScale,y.displacementBias=C.displacementBias,y.wireframeLinewidth=C.wireframeLinewidth,y.linewidth=C.linewidth,D.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const G=i.properties.get(y);G.light=D}return y}function v(R,C,D,b,y){if(R.visible===!1)return;if(R.layers.test(C.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&y===kn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,R.matrixWorld);const F=t.update(R),W=R.material;if(Array.isArray(W)){const T=F.groups;for(let A=0,B=T.length;A<B;A++){const O=T[A],$=W[O.materialIndex];if($&&$.visible){const it=S(R,$,b,y);R.onBeforeShadow(i,R,C,D,F,it,O),i.renderBufferDirect(D,null,F,it,R,O),R.onAfterShadow(i,R,C,D,F,it,O)}}}else if(W.visible){const T=S(R,W,b,y);R.onBeforeShadow(i,R,C,D,F,T,null),i.renderBufferDirect(D,null,F,T,R,null),R.onAfterShadow(i,R,C,D,F,T,null)}}const G=R.children;for(let F=0,W=G.length;F<W;F++)v(G[F],C,D,b,y)}function L(R){R.target.removeEventListener("dispose",L);for(const D in l){const b=l[D],y=R.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const V_={[Xr]:Wr,[$r]:qr,[Yr]:jr,[Yi]:Zr,[Wr]:Xr,[qr]:$r,[jr]:Yr,[Zr]:Yi};function X_(i,t){function e(){let I=!1;const Mt=new _e;let j=null;const at=new _e(0,0,0,0);return{setMask:function(Et){j!==Et&&!I&&(i.colorMask(Et,Et,Et,Et),j=Et)},setLocked:function(Et){I=Et},setClear:function(Et,St,Gt,Zt,ie){ie===!0&&(Et*=Zt,St*=Zt,Gt*=Zt),Mt.set(Et,St,Gt,Zt),at.equals(Mt)===!1&&(i.clearColor(Et,St,Gt,Zt),at.copy(Mt))},reset:function(){I=!1,j=null,at.set(-1,0,0,0)}}}function n(){let I=!1,Mt=!1,j=null,at=null,Et=null;return{setReversed:function(St){if(Mt!==St){const Gt=t.get("EXT_clip_control");Mt?Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.ZERO_TO_ONE_EXT):Gt.clipControlEXT(Gt.LOWER_LEFT_EXT,Gt.NEGATIVE_ONE_TO_ONE_EXT);const Zt=Et;Et=null,this.setClear(Zt)}Mt=St},getReversed:function(){return Mt},setTest:function(St){St?rt(i.DEPTH_TEST):xt(i.DEPTH_TEST)},setMask:function(St){j!==St&&!I&&(i.depthMask(St),j=St)},setFunc:function(St){if(Mt&&(St=V_[St]),at!==St){switch(St){case Xr:i.depthFunc(i.NEVER);break;case Wr:i.depthFunc(i.ALWAYS);break;case $r:i.depthFunc(i.LESS);break;case Yi:i.depthFunc(i.LEQUAL);break;case Yr:i.depthFunc(i.EQUAL);break;case Zr:i.depthFunc(i.GEQUAL);break;case qr:i.depthFunc(i.GREATER);break;case jr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}at=St}},setLocked:function(St){I=St},setClear:function(St){Et!==St&&(Mt&&(St=1-St),i.clearDepth(St),Et=St)},reset:function(){I=!1,j=null,at=null,Et=null,Mt=!1}}}function s(){let I=!1,Mt=null,j=null,at=null,Et=null,St=null,Gt=null,Zt=null,ie=null;return{setTest:function(Z){I||(Z?rt(i.STENCIL_TEST):xt(i.STENCIL_TEST))},setMask:function(Z){Mt!==Z&&!I&&(i.stencilMask(Z),Mt=Z)},setFunc:function(Z,_t,yt){(j!==Z||at!==_t||Et!==yt)&&(i.stencilFunc(Z,_t,yt),j=Z,at=_t,Et=yt)},setOp:function(Z,_t,yt){(St!==Z||Gt!==_t||Zt!==yt)&&(i.stencilOp(Z,_t,yt),St=Z,Gt=_t,Zt=yt)},setLocked:function(Z){I=Z},setClear:function(Z){ie!==Z&&(i.clearStencil(Z),ie=Z)},reset:function(){I=!1,Mt=null,j=null,at=null,Et=null,St=null,Gt=null,Zt=null,ie=null}}}const a=new e,r=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},f={},p=new WeakMap,d=[],m=null,_=!1,g=null,u=null,x=null,S=null,v=null,L=null,R=null,C=new qt(0,0,0),D=0,b=!1,y=null,P=null,G=null,F=null,W=null;const T=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let A=!1,B=0;const O=i.getParameter(i.VERSION);O.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(O)[1]),A=B>=1):O.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),A=B>=2);let $=null,it={};const mt=i.getParameter(i.SCISSOR_BOX),ct=i.getParameter(i.VIEWPORT),gt=new _e().fromArray(mt),Y=new _e().fromArray(ct);function nt(I,Mt,j,at){const Et=new Uint8Array(4),St=i.createTexture();i.bindTexture(I,St),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Gt=0;Gt<j;Gt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(Mt,0,i.RGBA,1,1,at,0,i.RGBA,i.UNSIGNED_BYTE,Et):i.texImage2D(Mt+Gt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Et);return St}const ot={};ot[i.TEXTURE_2D]=nt(i.TEXTURE_2D,i.TEXTURE_2D,1),ot[i.TEXTURE_CUBE_MAP]=nt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ot[i.TEXTURE_2D_ARRAY]=nt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ot[i.TEXTURE_3D]=nt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),rt(i.DEPTH_TEST),r.setFunc(Yi),Rt(!1),Pt(Rc),rt(i.CULL_FACE),k(qn);function rt(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function xt(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Ct(I,Mt){return f[I]!==Mt?(i.bindFramebuffer(I,Mt),f[I]=Mt,I===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=Mt),I===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=Mt),!0):!1}function Lt(I,Mt){let j=d,at=!1;if(I){j=p.get(Mt),j===void 0&&(j=[],p.set(Mt,j));const Et=I.textures;if(j.length!==Et.length||j[0]!==i.COLOR_ATTACHMENT0){for(let St=0,Gt=Et.length;St<Gt;St++)j[St]=i.COLOR_ATTACHMENT0+St;j.length=Et.length,at=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,at=!0);at&&i.drawBuffers(j)}function Ht(I){return m!==I?(i.useProgram(I),m=I,!0):!1}const wt={[di]:i.FUNC_ADD,[of]:i.FUNC_SUBTRACT,[cf]:i.FUNC_REVERSE_SUBTRACT};wt[lf]=i.MIN,wt[df]=i.MAX;const It={[hf]:i.ZERO,[uf]:i.ONE,[ff]:i.SRC_COLOR,[Gr]:i.SRC_ALPHA,[vf]:i.SRC_ALPHA_SATURATE,[_f]:i.DST_COLOR,[mf]:i.DST_ALPHA,[pf]:i.ONE_MINUS_SRC_COLOR,[Vr]:i.ONE_MINUS_SRC_ALPHA,[xf]:i.ONE_MINUS_DST_COLOR,[gf]:i.ONE_MINUS_DST_ALPHA,[Mf]:i.CONSTANT_COLOR,[yf]:i.ONE_MINUS_CONSTANT_COLOR,[Sf]:i.CONSTANT_ALPHA,[bf]:i.ONE_MINUS_CONSTANT_ALPHA};function k(I,Mt,j,at,Et,St,Gt,Zt,ie,Z){if(I===qn){_===!0&&(xt(i.BLEND),_=!1);return}if(_===!1&&(rt(i.BLEND),_=!0),I!==rf){if(I!==g||Z!==b){if((u!==di||v!==di)&&(i.blendEquation(i.FUNC_ADD),u=di,v=di),Z)switch(I){case Xi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Cc:i.blendFunc(i.ONE,i.ONE);break;case Pc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Dc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Xi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Cc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Pc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Dc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}x=null,S=null,L=null,R=null,C.set(0,0,0),D=0,g=I,b=Z}return}Et=Et||Mt,St=St||j,Gt=Gt||at,(Mt!==u||Et!==v)&&(i.blendEquationSeparate(wt[Mt],wt[Et]),u=Mt,v=Et),(j!==x||at!==S||St!==L||Gt!==R)&&(i.blendFuncSeparate(It[j],It[at],It[St],It[Gt]),x=j,S=at,L=St,R=Gt),(Zt.equals(C)===!1||ie!==D)&&(i.blendColor(Zt.r,Zt.g,Zt.b,ie),C.copy(Zt),D=ie),g=I,b=!1}function re(I,Mt){I.side===Ne?xt(i.CULL_FACE):rt(i.CULL_FACE);let j=I.side===Ge;Mt&&(j=!j),Rt(j),I.blending===Xi&&I.transparent===!1?k(qn):k(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),r.setFunc(I.depthFunc),r.setTest(I.depthTest),r.setMask(I.depthWrite),a.setMask(I.colorWrite);const at=I.stencilWrite;o.setTest(at),at&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ht(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?rt(i.SAMPLE_ALPHA_TO_COVERAGE):xt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(I){y!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),y=I)}function Pt(I){I!==sf?(rt(i.CULL_FACE),I!==P&&(I===Rc?i.cullFace(i.BACK):I===af?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):xt(i.CULL_FACE),P=I}function q(I){I!==G&&(A&&i.lineWidth(I),G=I)}function ht(I,Mt,j){I?(rt(i.POLYGON_OFFSET_FILL),(F!==Mt||W!==j)&&(i.polygonOffset(Mt,j),F=Mt,W=j)):xt(i.POLYGON_OFFSET_FILL)}function pt(I){I?rt(i.SCISSOR_TEST):xt(i.SCISSOR_TEST)}function w(I){I===void 0&&(I=i.TEXTURE0+T-1),$!==I&&(i.activeTexture(I),$=I)}function M(I,Mt,j){j===void 0&&($===null?j=i.TEXTURE0+T-1:j=$);let at=it[j];at===void 0&&(at={type:void 0,texture:void 0},it[j]=at),(at.type!==I||at.texture!==Mt)&&($!==j&&(i.activeTexture(j),$=j),i.bindTexture(I,Mt||ot[I]),at.type=I,at.texture=Mt)}function N(){const I=it[$];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function U(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function et(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function K(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function lt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ut(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Wt(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ft(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function bt(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function z(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function st(I){gt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),gt.copy(I))}function dt(I){Y.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),Y.copy(I))}function kt(I,Mt){let j=l.get(Mt);j===void 0&&(j=new WeakMap,l.set(Mt,j));let at=j.get(I);at===void 0&&(at=i.getUniformBlockIndex(Mt,I.name),j.set(I,at))}function Ut(I,Mt){const at=l.get(Mt).get(I);c.get(Mt)!==at&&(i.uniformBlockBinding(Mt,at,I.__bindingPointIndex),c.set(Mt,at))}function Xt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},$=null,it={},f={},p=new WeakMap,d=[],m=null,_=!1,g=null,u=null,x=null,S=null,v=null,L=null,R=null,C=new qt(0,0,0),D=0,b=!1,y=null,P=null,G=null,F=null,W=null,gt.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:rt,disable:xt,bindFramebuffer:Ct,drawBuffers:Lt,useProgram:Ht,setBlending:k,setMaterial:re,setFlipSided:Rt,setCullFace:Pt,setLineWidth:q,setPolygonOffset:ht,setScissorTest:pt,activeTexture:w,bindTexture:M,unbindTexture:N,compressedTexImage2D:U,compressedTexImage3D:Q,texImage2D:bt,texImage3D:z,updateUBOMapping:kt,uniformBlockBinding:Ut,texStorage2D:Wt,texStorage3D:ft,texSubImage2D:et,texSubImage3D:K,compressedTexSubImage2D:lt,compressedTexSubImage3D:ut,scissor:st,viewport:dt,reset:Xt}}function El(i,t,e,n){const s=W_(n);switch(e){case ed:return i*t;case id:return i*t;case sd:return i*t*2;case ad:return i*t/s.components*s.byteLength;case $o:return i*t/s.components*s.byteLength;case rd:return i*t*2/s.components*s.byteLength;case Yo:return i*t*2/s.components*s.byteLength;case nd:return i*t*3/s.components*s.byteLength;case ln:return i*t*4/s.components*s.byteLength;case Zo:return i*t*4/s.components*s.byteLength;case aa:case ra:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case oa:case ca:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case no:case so:return Math.max(i,16)*Math.max(t,8)/4;case eo:case io:return Math.max(i,8)*Math.max(t,8)/2;case ao:case ro:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case oo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case lo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case ho:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case uo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case fo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case po:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case mo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case go:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case _o:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case xo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case vo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Mo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case yo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case So:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case la:case bo:case Eo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case od:case wo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ao:case To:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function W_(i){switch(i){case On:case Jl:return{byteLength:1,components:1};case vs:case Ql:case ys:return{byteLength:2,components:1};case Xo:case Wo:return{byteLength:2,components:4};case gi:case Vo:case Fn:return{byteLength:4,components:1};case td:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function $_(i,t,e,n,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new jt,h=new WeakMap;let f;const p=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(w,M){return d?new OffscreenCanvas(w,M):Sa("canvas")}function _(w,M,N){let U=1;const Q=pt(w);if((Q.width>N||Q.height>N)&&(U=N/Math.max(Q.width,Q.height)),U<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const et=Math.floor(U*Q.width),K=Math.floor(U*Q.height);f===void 0&&(f=m(et,K));const lt=M?m(et,K):f;return lt.width=et,lt.height=K,lt.getContext("2d").drawImage(w,0,0,et,K),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+et+"x"+K+")."),lt}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),w;return w}function g(w){return w.generateMipmaps}function u(w){i.generateMipmap(w)}function x(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(w,M,N,U,Q=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let et=M;if(M===i.RED&&(N===i.FLOAT&&(et=i.R32F),N===i.HALF_FLOAT&&(et=i.R16F),N===i.UNSIGNED_BYTE&&(et=i.R8)),M===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(et=i.R8UI),N===i.UNSIGNED_SHORT&&(et=i.R16UI),N===i.UNSIGNED_INT&&(et=i.R32UI),N===i.BYTE&&(et=i.R8I),N===i.SHORT&&(et=i.R16I),N===i.INT&&(et=i.R32I)),M===i.RG&&(N===i.FLOAT&&(et=i.RG32F),N===i.HALF_FLOAT&&(et=i.RG16F),N===i.UNSIGNED_BYTE&&(et=i.RG8)),M===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(et=i.RG8UI),N===i.UNSIGNED_SHORT&&(et=i.RG16UI),N===i.UNSIGNED_INT&&(et=i.RG32UI),N===i.BYTE&&(et=i.RG8I),N===i.SHORT&&(et=i.RG16I),N===i.INT&&(et=i.RG32I)),M===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(et=i.RGB8UI),N===i.UNSIGNED_SHORT&&(et=i.RGB16UI),N===i.UNSIGNED_INT&&(et=i.RGB32UI),N===i.BYTE&&(et=i.RGB8I),N===i.SHORT&&(et=i.RGB16I),N===i.INT&&(et=i.RGB32I)),M===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(et=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(et=i.RGBA16UI),N===i.UNSIGNED_INT&&(et=i.RGBA32UI),N===i.BYTE&&(et=i.RGBA8I),N===i.SHORT&&(et=i.RGBA16I),N===i.INT&&(et=i.RGBA32I)),M===i.RGB&&N===i.UNSIGNED_INT_5_9_9_9_REV&&(et=i.RGB9_E5),M===i.RGBA){const K=Q?Pa:ne.getTransfer(U);N===i.FLOAT&&(et=i.RGBA32F),N===i.HALF_FLOAT&&(et=i.RGBA16F),N===i.UNSIGNED_BYTE&&(et=K===le?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(et=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(et=i.RGB5_A1)}return(et===i.R16F||et===i.R32F||et===i.RG16F||et===i.RG32F||et===i.RGBA16F||et===i.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function v(w,M){let N;return w?M===null||M===gi||M===ji?N=i.DEPTH24_STENCIL8:M===Fn?N=i.DEPTH32F_STENCIL8:M===vs&&(N=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===gi||M===ji?N=i.DEPTH_COMPONENT24:M===Fn?N=i.DEPTH_COMPONENT32F:M===vs&&(N=i.DEPTH_COMPONENT16),N}function L(w,M){return g(w)===!0||w.isFramebufferTexture&&w.minFilter!==dn&&w.minFilter!==Mn?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function R(w){const M=w.target;M.removeEventListener("dispose",R),D(M),M.isVideoTexture&&h.delete(M)}function C(w){const M=w.target;M.removeEventListener("dispose",C),y(M)}function D(w){const M=n.get(w);if(M.__webglInit===void 0)return;const N=w.source,U=p.get(N);if(U){const Q=U[M.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&b(w),Object.keys(U).length===0&&p.delete(N)}n.remove(w)}function b(w){const M=n.get(w);i.deleteTexture(M.__webglTexture);const N=w.source,U=p.get(N);delete U[M.__cacheKey],r.memory.textures--}function y(w){const M=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let U=0;U<6;U++){if(Array.isArray(M.__webglFramebuffer[U]))for(let Q=0;Q<M.__webglFramebuffer[U].length;Q++)i.deleteFramebuffer(M.__webglFramebuffer[U][Q]);else i.deleteFramebuffer(M.__webglFramebuffer[U]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[U])}else{if(Array.isArray(M.__webglFramebuffer))for(let U=0;U<M.__webglFramebuffer.length;U++)i.deleteFramebuffer(M.__webglFramebuffer[U]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let U=0;U<M.__webglColorRenderbuffer.length;U++)M.__webglColorRenderbuffer[U]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[U]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const N=w.textures;for(let U=0,Q=N.length;U<Q;U++){const et=n.get(N[U]);et.__webglTexture&&(i.deleteTexture(et.__webglTexture),r.memory.textures--),n.remove(N[U])}n.remove(w)}let P=0;function G(){P=0}function F(){const w=P;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),P+=1,w}function W(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function T(w,M){const N=n.get(w);if(w.isVideoTexture&&q(w),w.isRenderTargetTexture===!1&&w.version>0&&N.__version!==w.version){const U=w.image;if(U===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(U.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(N,w,M);return}}e.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+M)}function A(w,M){const N=n.get(w);if(w.version>0&&N.__version!==w.version){Y(N,w,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+M)}function B(w,M){const N=n.get(w);if(w.version>0&&N.__version!==w.version){Y(N,w,M);return}e.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+M)}function O(w,M){const N=n.get(w);if(w.version>0&&N.__version!==w.version){nt(N,w,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+M)}const $={[Qr]:i.REPEAT,[ui]:i.CLAMP_TO_EDGE,[to]:i.MIRRORED_REPEAT},it={[dn]:i.NEAREST,[If]:i.NEAREST_MIPMAP_NEAREST,[Ts]:i.NEAREST_MIPMAP_LINEAR,[Mn]:i.LINEAR,[Za]:i.LINEAR_MIPMAP_NEAREST,[fi]:i.LINEAR_MIPMAP_LINEAR},mt={[Nf]:i.NEVER,[Vf]:i.ALWAYS,[zf]:i.LESS,[ld]:i.LEQUAL,[Of]:i.EQUAL,[Gf]:i.GEQUAL,[Bf]:i.GREATER,[Hf]:i.NOTEQUAL};function ct(w,M){if(M.type===Fn&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===Mn||M.magFilter===Za||M.magFilter===Ts||M.magFilter===fi||M.minFilter===Mn||M.minFilter===Za||M.minFilter===Ts||M.minFilter===fi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,$[M.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,$[M.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,$[M.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,it[M.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,it[M.minFilter]),M.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,mt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===dn||M.minFilter!==Ts&&M.minFilter!==fi||M.type===Fn&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const N=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function gt(w,M){let N=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",R));const U=M.source;let Q=p.get(U);Q===void 0&&(Q={},p.set(U,Q));const et=W(M);if(et!==w.__cacheKey){Q[et]===void 0&&(Q[et]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,N=!0),Q[et].usedTimes++;const K=Q[w.__cacheKey];K!==void 0&&(Q[w.__cacheKey].usedTimes--,K.usedTimes===0&&b(M)),w.__cacheKey=et,w.__webglTexture=Q[et].texture}return N}function Y(w,M,N){let U=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(U=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(U=i.TEXTURE_3D);const Q=gt(w,M),et=M.source;e.bindTexture(U,w.__webglTexture,i.TEXTURE0+N);const K=n.get(et);if(et.version!==K.__version||Q===!0){e.activeTexture(i.TEXTURE0+N);const lt=ne.getPrimaries(ne.workingColorSpace),ut=M.colorSpace===Yn?null:ne.getPrimaries(M.colorSpace),Wt=M.colorSpace===Yn||lt===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Wt);let ft=_(M.image,!1,s.maxTextureSize);ft=ht(M,ft);const bt=a.convert(M.format,M.colorSpace),z=a.convert(M.type);let st=S(M.internalFormat,bt,z,M.colorSpace,M.isVideoTexture);ct(U,M);let dt;const kt=M.mipmaps,Ut=M.isVideoTexture!==!0,Xt=K.__version===void 0||Q===!0,I=et.dataReady,Mt=L(M,ft);if(M.isDepthTexture)st=v(M.format===Ki,M.type),Xt&&(Ut?e.texStorage2D(i.TEXTURE_2D,1,st,ft.width,ft.height):e.texImage2D(i.TEXTURE_2D,0,st,ft.width,ft.height,0,bt,z,null));else if(M.isDataTexture)if(kt.length>0){Ut&&Xt&&e.texStorage2D(i.TEXTURE_2D,Mt,st,kt[0].width,kt[0].height);for(let j=0,at=kt.length;j<at;j++)dt=kt[j],Ut?I&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,dt.width,dt.height,bt,z,dt.data):e.texImage2D(i.TEXTURE_2D,j,st,dt.width,dt.height,0,bt,z,dt.data);M.generateMipmaps=!1}else Ut?(Xt&&e.texStorage2D(i.TEXTURE_2D,Mt,st,ft.width,ft.height),I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ft.width,ft.height,bt,z,ft.data)):e.texImage2D(i.TEXTURE_2D,0,st,ft.width,ft.height,0,bt,z,ft.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ut&&Xt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,st,kt[0].width,kt[0].height,ft.depth);for(let j=0,at=kt.length;j<at;j++)if(dt=kt[j],M.format!==ln)if(bt!==null)if(Ut){if(I)if(M.layerUpdates.size>0){const Et=El(dt.width,dt.height,M.format,M.type);for(const St of M.layerUpdates){const Gt=dt.data.subarray(St*Et/dt.data.BYTES_PER_ELEMENT,(St+1)*Et/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,St,dt.width,dt.height,1,bt,Gt)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,dt.width,dt.height,ft.depth,bt,dt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,st,dt.width,dt.height,ft.depth,0,dt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?I&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,dt.width,dt.height,ft.depth,bt,z,dt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,st,dt.width,dt.height,ft.depth,0,bt,z,dt.data)}else{Ut&&Xt&&e.texStorage2D(i.TEXTURE_2D,Mt,st,kt[0].width,kt[0].height);for(let j=0,at=kt.length;j<at;j++)dt=kt[j],M.format!==ln?bt!==null?Ut?I&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,dt.width,dt.height,bt,dt.data):e.compressedTexImage2D(i.TEXTURE_2D,j,st,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?I&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,dt.width,dt.height,bt,z,dt.data):e.texImage2D(i.TEXTURE_2D,j,st,dt.width,dt.height,0,bt,z,dt.data)}else if(M.isDataArrayTexture)if(Ut){if(Xt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,st,ft.width,ft.height,ft.depth),I)if(M.layerUpdates.size>0){const j=El(ft.width,ft.height,M.format,M.type);for(const at of M.layerUpdates){const Et=ft.data.subarray(at*j/ft.data.BYTES_PER_ELEMENT,(at+1)*j/ft.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,at,ft.width,ft.height,1,bt,z,Et)}M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ft.width,ft.height,ft.depth,bt,z,ft.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,st,ft.width,ft.height,ft.depth,0,bt,z,ft.data);else if(M.isData3DTexture)Ut?(Xt&&e.texStorage3D(i.TEXTURE_3D,Mt,st,ft.width,ft.height,ft.depth),I&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ft.width,ft.height,ft.depth,bt,z,ft.data)):e.texImage3D(i.TEXTURE_3D,0,st,ft.width,ft.height,ft.depth,0,bt,z,ft.data);else if(M.isFramebufferTexture){if(Xt)if(Ut)e.texStorage2D(i.TEXTURE_2D,Mt,st,ft.width,ft.height);else{let j=ft.width,at=ft.height;for(let Et=0;Et<Mt;Et++)e.texImage2D(i.TEXTURE_2D,Et,st,j,at,0,bt,z,null),j>>=1,at>>=1}}else if(kt.length>0){if(Ut&&Xt){const j=pt(kt[0]);e.texStorage2D(i.TEXTURE_2D,Mt,st,j.width,j.height)}for(let j=0,at=kt.length;j<at;j++)dt=kt[j],Ut?I&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,bt,z,dt):e.texImage2D(i.TEXTURE_2D,j,st,bt,z,dt);M.generateMipmaps=!1}else if(Ut){if(Xt){const j=pt(ft);e.texStorage2D(i.TEXTURE_2D,Mt,st,j.width,j.height)}I&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,bt,z,ft)}else e.texImage2D(i.TEXTURE_2D,0,st,bt,z,ft);g(M)&&u(U),K.__version=et.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function nt(w,M,N){if(M.image.length!==6)return;const U=gt(w,M),Q=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+N);const et=n.get(Q);if(Q.version!==et.__version||U===!0){e.activeTexture(i.TEXTURE0+N);const K=ne.getPrimaries(ne.workingColorSpace),lt=M.colorSpace===Yn?null:ne.getPrimaries(M.colorSpace),ut=M.colorSpace===Yn||K===lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const Wt=M.isCompressedTexture||M.image[0].isCompressedTexture,ft=M.image[0]&&M.image[0].isDataTexture,bt=[];for(let at=0;at<6;at++)!Wt&&!ft?bt[at]=_(M.image[at],!0,s.maxCubemapSize):bt[at]=ft?M.image[at].image:M.image[at],bt[at]=ht(M,bt[at]);const z=bt[0],st=a.convert(M.format,M.colorSpace),dt=a.convert(M.type),kt=S(M.internalFormat,st,dt,M.colorSpace),Ut=M.isVideoTexture!==!0,Xt=et.__version===void 0||U===!0,I=Q.dataReady;let Mt=L(M,z);ct(i.TEXTURE_CUBE_MAP,M);let j;if(Wt){Ut&&Xt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,kt,z.width,z.height);for(let at=0;at<6;at++){j=bt[at].mipmaps;for(let Et=0;Et<j.length;Et++){const St=j[Et];M.format!==ln?st!==null?Ut?I&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et,0,0,St.width,St.height,st,St.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et,kt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et,0,0,St.width,St.height,st,dt,St.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et,kt,St.width,St.height,0,st,dt,St.data)}}}else{if(j=M.mipmaps,Ut&&Xt){j.length>0&&Mt++;const at=pt(bt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Mt,kt,at.width,at.height)}for(let at=0;at<6;at++)if(ft){Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,bt[at].width,bt[at].height,st,dt,bt[at].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,kt,bt[at].width,bt[at].height,0,st,dt,bt[at].data);for(let Et=0;Et<j.length;Et++){const Gt=j[Et].image[at].image;Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et+1,0,0,Gt.width,Gt.height,st,dt,Gt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et+1,kt,Gt.width,Gt.height,0,st,dt,Gt.data)}}else{Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,st,dt,bt[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,kt,st,dt,bt[at]);for(let Et=0;Et<j.length;Et++){const St=j[Et];Ut?I&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et+1,0,0,st,dt,St.image[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Et+1,kt,st,dt,St.image[at])}}}g(M)&&u(i.TEXTURE_CUBE_MAP),et.__version=Q.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function ot(w,M,N,U,Q,et){const K=a.convert(N.format,N.colorSpace),lt=a.convert(N.type),ut=S(N.internalFormat,K,lt,N.colorSpace),Wt=n.get(M),ft=n.get(N);if(ft.__renderTarget=M,!Wt.__hasExternalTextures){const bt=Math.max(1,M.width>>et),z=Math.max(1,M.height>>et);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?e.texImage3D(Q,et,ut,bt,z,M.depth,0,K,lt,null):e.texImage2D(Q,et,ut,bt,z,0,K,lt,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),Pt(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,U,Q,ft.__webglTexture,0,Rt(M)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,U,Q,ft.__webglTexture,et),e.bindFramebuffer(i.FRAMEBUFFER,null)}function rt(w,M,N){if(i.bindRenderbuffer(i.RENDERBUFFER,w),M.depthBuffer){const U=M.depthTexture,Q=U&&U.isDepthTexture?U.type:null,et=v(M.stencilBuffer,Q),K=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,lt=Rt(M);Pt(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt,et,M.width,M.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,et,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,et,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,w)}else{const U=M.textures;for(let Q=0;Q<U.length;Q++){const et=U[Q],K=a.convert(et.format,et.colorSpace),lt=a.convert(et.type),ut=S(et.internalFormat,K,lt,et.colorSpace),Wt=Rt(M);N&&Pt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,ut,M.width,M.height):Pt(M)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Wt,ut,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,ut,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xt(w,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const U=n.get(M.depthTexture);U.__renderTarget=M,(!U.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),T(M.depthTexture,0);const Q=U.__webglTexture,et=Rt(M);if(M.depthTexture.format===Wi)Pt(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(M.depthTexture.format===Ki)Pt(M)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Ct(w){const M=n.get(w),N=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const U=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),U){const Q=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,U.removeEventListener("dispose",Q)};U.addEventListener("dispose",Q),M.__depthDisposeCallback=Q}M.__boundDepthTexture=U}if(w.depthTexture&&!M.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");xt(M.__webglFramebuffer,w)}else if(N){M.__webglDepthbuffer=[];for(let U=0;U<6;U++)if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[U]),M.__webglDepthbuffer[U]===void 0)M.__webglDepthbuffer[U]=i.createRenderbuffer(),rt(M.__webglDepthbuffer[U],w,!1);else{const Q=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=M.__webglDepthbuffer[U];i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,et)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),rt(M.__webglDepthbuffer,w,!1);else{const U=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,U,i.RENDERBUFFER,Q)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Lt(w,M,N){const U=n.get(w);M!==void 0&&ot(U.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&Ct(w)}function Ht(w){const M=w.texture,N=n.get(w),U=n.get(M);w.addEventListener("dispose",C);const Q=w.textures,et=w.isWebGLCubeRenderTarget===!0,K=Q.length>1;if(K||(U.__webglTexture===void 0&&(U.__webglTexture=i.createTexture()),U.__version=M.version,r.memory.textures++),et){N.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(M.mipmaps&&M.mipmaps.length>0){N.__webglFramebuffer[lt]=[];for(let ut=0;ut<M.mipmaps.length;ut++)N.__webglFramebuffer[lt][ut]=i.createFramebuffer()}else N.__webglFramebuffer[lt]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){N.__webglFramebuffer=[];for(let lt=0;lt<M.mipmaps.length;lt++)N.__webglFramebuffer[lt]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(K)for(let lt=0,ut=Q.length;lt<ut;lt++){const Wt=n.get(Q[lt]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=i.createTexture(),r.memory.textures++)}if(w.samples>0&&Pt(w)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let lt=0;lt<Q.length;lt++){const ut=Q[lt];N.__webglColorRenderbuffer[lt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[lt]);const Wt=a.convert(ut.format,ut.colorSpace),ft=a.convert(ut.type),bt=S(ut.internalFormat,Wt,ft,ut.colorSpace,w.isXRRenderTarget===!0),z=Rt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,z,bt,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.RENDERBUFFER,N.__webglColorRenderbuffer[lt])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),rt(N.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(et){e.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture),ct(i.TEXTURE_CUBE_MAP,M);for(let lt=0;lt<6;lt++)if(M.mipmaps&&M.mipmaps.length>0)for(let ut=0;ut<M.mipmaps.length;ut++)ot(N.__webglFramebuffer[lt][ut],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,ut);else ot(N.__webglFramebuffer[lt],w,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);g(M)&&u(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(K){for(let lt=0,ut=Q.length;lt<ut;lt++){const Wt=Q[lt],ft=n.get(Wt);e.bindTexture(i.TEXTURE_2D,ft.__webglTexture),ct(i.TEXTURE_2D,Wt),ot(N.__webglFramebuffer,w,Wt,i.COLOR_ATTACHMENT0+lt,i.TEXTURE_2D,0),g(Wt)&&u(i.TEXTURE_2D)}e.unbindTexture()}else{let lt=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(lt=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(lt,U.__webglTexture),ct(lt,M),M.mipmaps&&M.mipmaps.length>0)for(let ut=0;ut<M.mipmaps.length;ut++)ot(N.__webglFramebuffer[ut],w,M,i.COLOR_ATTACHMENT0,lt,ut);else ot(N.__webglFramebuffer,w,M,i.COLOR_ATTACHMENT0,lt,0);g(M)&&u(lt),e.unbindTexture()}w.depthBuffer&&Ct(w)}function wt(w){const M=w.textures;for(let N=0,U=M.length;N<U;N++){const Q=M[N];if(g(Q)){const et=x(w),K=n.get(Q).__webglTexture;e.bindTexture(et,K),u(et),e.unbindTexture()}}}const It=[],k=[];function re(w){if(w.samples>0){if(Pt(w)===!1){const M=w.textures,N=w.width,U=w.height;let Q=i.COLOR_BUFFER_BIT;const et=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=n.get(w),lt=M.length>1;if(lt)for(let ut=0;ut<M.length;ut++)e.bindFramebuffer(i.FRAMEBUFFER,K.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,K.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,K.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,K.__webglFramebuffer);for(let ut=0;ut<M.length;ut++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),lt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,K.__webglColorRenderbuffer[ut]);const Wt=n.get(M[ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Wt,0)}i.blitFramebuffer(0,0,N,U,0,0,N,U,Q,i.NEAREST),c===!0&&(It.length=0,k.length=0,It.push(i.COLOR_ATTACHMENT0+ut),w.depthBuffer&&w.resolveDepthBuffer===!1&&(It.push(et),k.push(et),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,It))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),lt)for(let ut=0;ut<M.length;ut++){e.bindFramebuffer(i.FRAMEBUFFER,K.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,K.__webglColorRenderbuffer[ut]);const Wt=n.get(M[ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,K.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.TEXTURE_2D,Wt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,K.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const M=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Rt(w){return Math.min(s.maxSamples,w.samples)}function Pt(w){const M=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function q(w){const M=r.render.frame;h.get(w)!==M&&(h.set(w,M),w.update())}function ht(w,M){const N=w.colorSpace,U=w.format,Q=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||N!==Qi&&N!==Yn&&(ne.getTransfer(N)===le?(U!==ln||Q!==On)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),M}function pt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=G,this.setTexture2D=T,this.setTexture2DArray=A,this.setTexture3D=B,this.setTextureCube=O,this.rebindTextures=Lt,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=wt,this.updateMultisampleRenderTarget=re,this.setupDepthRenderbuffer=Ct,this.setupFrameBufferTexture=ot,this.useMultisampledRTT=Pt}function Y_(i,t){function e(n,s=Yn){let a;const r=ne.getTransfer(s);if(n===On)return i.UNSIGNED_BYTE;if(n===Xo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Wo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===td)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Jl)return i.BYTE;if(n===Ql)return i.SHORT;if(n===vs)return i.UNSIGNED_SHORT;if(n===Vo)return i.INT;if(n===gi)return i.UNSIGNED_INT;if(n===Fn)return i.FLOAT;if(n===ys)return i.HALF_FLOAT;if(n===ed)return i.ALPHA;if(n===nd)return i.RGB;if(n===ln)return i.RGBA;if(n===id)return i.LUMINANCE;if(n===sd)return i.LUMINANCE_ALPHA;if(n===Wi)return i.DEPTH_COMPONENT;if(n===Ki)return i.DEPTH_STENCIL;if(n===ad)return i.RED;if(n===$o)return i.RED_INTEGER;if(n===rd)return i.RG;if(n===Yo)return i.RG_INTEGER;if(n===Zo)return i.RGBA_INTEGER;if(n===aa||n===ra||n===oa||n===ca)if(r===le)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===aa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ra)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===oa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ca)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===aa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ra)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===oa)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ca)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===eo||n===no||n===io||n===so)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===eo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===no)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===io)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===so)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ao||n===ro||n===oo)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===ao||n===ro)return r===le?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===oo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===co||n===lo||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===_o||n===xo||n===vo||n===Mo||n===yo||n===So)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===co)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===lo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ho)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===uo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===fo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===po)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===mo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===go)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===_o)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===xo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===vo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Mo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===yo)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===So)return r===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===la||n===bo||n===Eo)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===la)return r===le?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===bo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Eo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===od||n===wo||n===Ao||n===To)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===la)return a.COMPRESSED_RED_RGTC1_EXT;if(n===wo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ao)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===To)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ji?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Z_ extends Je{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Te extends xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const q_={type:"move"};class Sr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Te,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Te,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Te,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,n),u=this._getHandJoint(l,_);g!==null&&(u.matrix.fromArray(g.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=g.radius),u.visible=g!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],p=h.position.distanceTo(f.position),d=.02,m=.005;l.inputState.pinching&&p>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&p<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(q_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Te;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const j_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,K_=`
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

}`;class J_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Oe,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Qn({vertexShader:j_,fragmentShader:K_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new fe(new La(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Q_ extends ts{constructor(t,e){super();const n=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,f=null,p=null,d=null,m=null;const _=new J_,g=e.getContextAttributes();let u=null,x=null;const S=[],v=[],L=new jt;let R=null;const C=new Je;C.viewport=new _e;const D=new Je;D.viewport=new _e;const b=[C,D],y=new Z_;let P=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let nt=S[Y];return nt===void 0&&(nt=new Sr,S[Y]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Y){let nt=S[Y];return nt===void 0&&(nt=new Sr,S[Y]=nt),nt.getGripSpace()},this.getHand=function(Y){let nt=S[Y];return nt===void 0&&(nt=new Sr,S[Y]=nt),nt.getHandSpace()};function F(Y){const nt=v.indexOf(Y.inputSource);if(nt===-1)return;const ot=S[nt];ot!==void 0&&(ot.update(Y.inputSource,Y.frame,l||r),ot.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",T);for(let Y=0;Y<S.length;Y++){const nt=v[Y];nt!==null&&(v[Y]=null,S[Y].disconnect(nt))}P=null,G=null,_.reset(),t.setRenderTarget(u),d=null,p=null,f=null,s=null,x=null,gt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(u=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",W),s.addEventListener("inputsourceschange",T),g.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0){const nt={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,e,nt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new _i(d.framebufferWidth,d.framebufferHeight,{format:ln,type:On,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let nt=null,ot=null,rt=null;g.depth&&(rt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=g.stencil?Ki:Wi,ot=g.stencil?ji:gi);const xt={colorFormat:e.RGBA8,depthFormat:rt,scaleFactor:a};f=new XRWebGLBinding(s,e),p=f.createProjectionLayer(xt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),x=new _i(p.textureWidth,p.textureHeight,{format:ln,type:On,depthTexture:new yd(p.textureWidth,p.textureHeight,ot,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),gt.setContext(s),gt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function T(Y){for(let nt=0;nt<Y.removed.length;nt++){const ot=Y.removed[nt],rt=v.indexOf(ot);rt>=0&&(v[rt]=null,S[rt].disconnect(ot))}for(let nt=0;nt<Y.added.length;nt++){const ot=Y.added[nt];let rt=v.indexOf(ot);if(rt===-1){for(let Ct=0;Ct<S.length;Ct++)if(Ct>=v.length){v.push(ot),rt=Ct;break}else if(v[Ct]===null){v[Ct]=ot,rt=Ct;break}if(rt===-1)break}const xt=S[rt];xt&&xt.connect(ot)}}const A=new X,B=new X;function O(Y,nt,ot){A.setFromMatrixPosition(nt.matrixWorld),B.setFromMatrixPosition(ot.matrixWorld);const rt=A.distanceTo(B),xt=nt.projectionMatrix.elements,Ct=ot.projectionMatrix.elements,Lt=xt[14]/(xt[10]-1),Ht=xt[14]/(xt[10]+1),wt=(xt[9]+1)/xt[5],It=(xt[9]-1)/xt[5],k=(xt[8]-1)/xt[0],re=(Ct[8]+1)/Ct[0],Rt=Lt*k,Pt=Lt*re,q=rt/(-k+re),ht=q*-k;if(nt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ht),Y.translateZ(q),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),xt[10]===-1)Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const pt=Lt+q,w=Ht+q,M=Rt-ht,N=Pt+(rt-ht),U=wt*Ht/w*pt,Q=It*Ht/w*pt;Y.projectionMatrix.makePerspective(M,N,U,Q,pt,w),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function $(Y,nt){nt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(nt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let nt=Y.near,ot=Y.far;_.texture!==null&&(_.depthNear>0&&(nt=_.depthNear),_.depthFar>0&&(ot=_.depthFar)),y.near=D.near=C.near=nt,y.far=D.far=C.far=ot,(P!==y.near||G!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),P=y.near,G=y.far),C.layers.mask=Y.layers.mask|2,D.layers.mask=Y.layers.mask|4,y.layers.mask=C.layers.mask|D.layers.mask;const rt=Y.parent,xt=y.cameras;$(y,rt);for(let Ct=0;Ct<xt.length;Ct++)$(xt[Ct],rt);xt.length===2?O(y,C,D):y.projectionMatrix.copy(C.projectionMatrix),it(Y,y,rt)};function it(Y,nt,ot){ot===null?Y.matrix.copy(nt.matrixWorld):(Y.matrix.copy(ot.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(nt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(nt.projectionMatrix),Y.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Co*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(p===null&&d===null))return c},this.setFoveation=function(Y){c=Y,p!==null&&(p.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let mt=null;function ct(Y,nt){if(h=nt.getViewerPose(l||r),m=nt,h!==null){const ot=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let rt=!1;ot.length!==y.cameras.length&&(y.cameras.length=0,rt=!0);for(let Ct=0;Ct<ot.length;Ct++){const Lt=ot[Ct];let Ht=null;if(d!==null)Ht=d.getViewport(Lt);else{const It=f.getViewSubImage(p,Lt);Ht=It.viewport,Ct===0&&(t.setRenderTargetTextures(x,It.colorTexture,p.ignoreDepthValues?void 0:It.depthStencilTexture),t.setRenderTarget(x))}let wt=b[Ct];wt===void 0&&(wt=new Je,wt.layers.enable(Ct),wt.viewport=new _e,b[Ct]=wt),wt.matrix.fromArray(Lt.transform.matrix),wt.matrix.decompose(wt.position,wt.quaternion,wt.scale),wt.projectionMatrix.fromArray(Lt.projectionMatrix),wt.projectionMatrixInverse.copy(wt.projectionMatrix).invert(),wt.viewport.set(Ht.x,Ht.y,Ht.width,Ht.height),Ct===0&&(y.matrix.copy(wt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),rt===!0&&y.cameras.push(wt)}const xt=s.enabledFeatures;if(xt&&xt.includes("depth-sensing")){const Ct=f.getDepthInformation(ot[0]);Ct&&Ct.isValid&&Ct.texture&&_.init(t,Ct,s.renderState)}}for(let ot=0;ot<S.length;ot++){const rt=v[ot],xt=S[ot];rt!==null&&xt!==void 0&&xt.update(rt,nt,l||r)}mt&&mt(Y,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),m=null}const gt=new vd;gt.setAnimationLoop(ct),this.setAnimationLoop=function(Y){mt=Y},this.dispose=function(){}}}const ri=new bn,tx=new pe;function ex(i,t){function e(g,u){g.matrixAutoUpdate===!0&&g.updateMatrix(),u.value.copy(g.matrix)}function n(g,u){u.color.getRGB(g.fogColor.value,gd(i)),u.isFog?(g.fogNear.value=u.near,g.fogFar.value=u.far):u.isFogExp2&&(g.fogDensity.value=u.density)}function s(g,u,x,S,v){u.isMeshBasicMaterial||u.isMeshLambertMaterial?a(g,u):u.isMeshToonMaterial?(a(g,u),f(g,u)):u.isMeshPhongMaterial?(a(g,u),h(g,u)):u.isMeshStandardMaterial?(a(g,u),p(g,u),u.isMeshPhysicalMaterial&&d(g,u,v)):u.isMeshMatcapMaterial?(a(g,u),m(g,u)):u.isMeshDepthMaterial?a(g,u):u.isMeshDistanceMaterial?(a(g,u),_(g,u)):u.isMeshNormalMaterial?a(g,u):u.isLineBasicMaterial?(r(g,u),u.isLineDashedMaterial&&o(g,u)):u.isPointsMaterial?c(g,u,x,S):u.isSpriteMaterial?l(g,u):u.isShadowMaterial?(g.color.value.copy(u.color),g.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function a(g,u){g.opacity.value=u.opacity,u.color&&g.diffuse.value.copy(u.color),u.emissive&&g.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(g.map.value=u.map,e(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,e(u.alphaMap,g.alphaMapTransform)),u.bumpMap&&(g.bumpMap.value=u.bumpMap,e(u.bumpMap,g.bumpMapTransform),g.bumpScale.value=u.bumpScale,u.side===Ge&&(g.bumpScale.value*=-1)),u.normalMap&&(g.normalMap.value=u.normalMap,e(u.normalMap,g.normalMapTransform),g.normalScale.value.copy(u.normalScale),u.side===Ge&&g.normalScale.value.negate()),u.displacementMap&&(g.displacementMap.value=u.displacementMap,e(u.displacementMap,g.displacementMapTransform),g.displacementScale.value=u.displacementScale,g.displacementBias.value=u.displacementBias),u.emissiveMap&&(g.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,g.emissiveMapTransform)),u.specularMap&&(g.specularMap.value=u.specularMap,e(u.specularMap,g.specularMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest);const x=t.get(u),S=x.envMap,v=x.envMapRotation;S&&(g.envMap.value=S,ri.copy(v),ri.x*=-1,ri.y*=-1,ri.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ri.y*=-1,ri.z*=-1),g.envMapRotation.value.setFromMatrix4(tx.makeRotationFromEuler(ri)),g.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=u.reflectivity,g.ior.value=u.ior,g.refractionRatio.value=u.refractionRatio),u.lightMap&&(g.lightMap.value=u.lightMap,g.lightMapIntensity.value=u.lightMapIntensity,e(u.lightMap,g.lightMapTransform)),u.aoMap&&(g.aoMap.value=u.aoMap,g.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,g.aoMapTransform))}function r(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,u.map&&(g.map.value=u.map,e(u.map,g.mapTransform))}function o(g,u){g.dashSize.value=u.dashSize,g.totalSize.value=u.dashSize+u.gapSize,g.scale.value=u.scale}function c(g,u,x,S){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.size.value=u.size*x,g.scale.value=S*.5,u.map&&(g.map.value=u.map,e(u.map,g.uvTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,e(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function l(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.rotation.value=u.rotation,u.map&&(g.map.value=u.map,e(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,e(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function h(g,u){g.specular.value.copy(u.specular),g.shininess.value=Math.max(u.shininess,1e-4)}function f(g,u){u.gradientMap&&(g.gradientMap.value=u.gradientMap)}function p(g,u){g.metalness.value=u.metalness,u.metalnessMap&&(g.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,g.metalnessMapTransform)),g.roughness.value=u.roughness,u.roughnessMap&&(g.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,g.roughnessMapTransform)),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)}function d(g,u,x){g.ior.value=u.ior,u.sheen>0&&(g.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),g.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(g.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,g.sheenColorMapTransform)),u.sheenRoughnessMap&&(g.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,g.sheenRoughnessMapTransform))),u.clearcoat>0&&(g.clearcoat.value=u.clearcoat,g.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(g.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,g.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(g.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Ge&&g.clearcoatNormalScale.value.negate())),u.dispersion>0&&(g.dispersion.value=u.dispersion),u.iridescence>0&&(g.iridescence.value=u.iridescence,g.iridescenceIOR.value=u.iridescenceIOR,g.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(g.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,g.iridescenceMapTransform)),u.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),u.transmission>0&&(g.transmission.value=u.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),u.transmissionMap&&(g.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,g.transmissionMapTransform)),g.thickness.value=u.thickness,u.thicknessMap&&(g.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=u.attenuationDistance,g.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(g.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(g.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=u.specularIntensity,g.specularColor.value.copy(u.specularColor),u.specularColorMap&&(g.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,g.specularColorMapTransform)),u.specularIntensityMap&&(g.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,u){u.matcap&&(g.matcap.value=u.matcap)}function _(g,u){const x=t.get(u).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function nx(i,t,e,n){let s={},a={},r=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,S){const v=S.program;n.uniformBlockBinding(x,v)}function l(x,S){let v=s[x.id];v===void 0&&(m(x),v=h(x),s[x.id]=v,x.addEventListener("dispose",g));const L=S.program;n.updateUBOMapping(x,L);const R=t.render.frame;a[x.id]!==R&&(p(x),a[x.id]=R)}function h(x){const S=f();x.__bindingPointIndex=S;const v=i.createBuffer(),L=x.__size,R=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,L,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,v),v}function f(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(x){const S=s[x.id],v=x.uniforms,L=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let R=0,C=v.length;R<C;R++){const D=Array.isArray(v[R])?v[R]:[v[R]];for(let b=0,y=D.length;b<y;b++){const P=D[b];if(d(P,R,b,L)===!0){const G=P.__offset,F=Array.isArray(P.value)?P.value:[P.value];let W=0;for(let T=0;T<F.length;T++){const A=F[T],B=_(A);typeof A=="number"||typeof A=="boolean"?(P.__data[0]=A,i.bufferSubData(i.UNIFORM_BUFFER,G+W,P.__data)):A.isMatrix3?(P.__data[0]=A.elements[0],P.__data[1]=A.elements[1],P.__data[2]=A.elements[2],P.__data[3]=0,P.__data[4]=A.elements[3],P.__data[5]=A.elements[4],P.__data[6]=A.elements[5],P.__data[7]=0,P.__data[8]=A.elements[6],P.__data[9]=A.elements[7],P.__data[10]=A.elements[8],P.__data[11]=0):(A.toArray(P.__data,W),W+=B.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(x,S,v,L){const R=x.value,C=S+"_"+v;if(L[C]===void 0)return typeof R=="number"||typeof R=="boolean"?L[C]=R:L[C]=R.clone(),!0;{const D=L[C];if(typeof R=="number"||typeof R=="boolean"){if(D!==R)return L[C]=R,!0}else if(D.equals(R)===!1)return D.copy(R),!0}return!1}function m(x){const S=x.uniforms;let v=0;const L=16;for(let C=0,D=S.length;C<D;C++){const b=Array.isArray(S[C])?S[C]:[S[C]];for(let y=0,P=b.length;y<P;y++){const G=b[y],F=Array.isArray(G.value)?G.value:[G.value];for(let W=0,T=F.length;W<T;W++){const A=F[W],B=_(A),O=v%L,$=O%B.boundary,it=O+$;v+=$,it!==0&&L-it<B.storage&&(v+=L-it),G.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=v,v+=B.storage}}}const R=v%L;return R>0&&(v+=L-R),x.__size=v,x.__cache={},this}function _(x){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),S}function g(x){const S=x.target;S.removeEventListener("dispose",g);const v=r.indexOf(S.__bindingPointIndex);r.splice(v,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete a[S.id]}function u(){for(const x in s)i.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:u}}class ix{constructor(t={}){const{canvas:e=Wf(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,u=null;const x=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ke,this.toneMapping=jn,this.toneMappingExposure=1;const v=this;let L=!1,R=0,C=0,D=null,b=-1,y=null;const P=new _e,G=new _e;let F=null;const W=new qt(0);let T=0,A=e.width,B=e.height,O=1,$=null,it=null;const mt=new _e(0,0,A,B),ct=new _e(0,0,A,B);let gt=!1;const Y=new Ko;let nt=!1,ot=!1;const rt=new pe,xt=new pe,Ct=new X,Lt=new _e,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let wt=!1;function It(){return D===null?O:1}let k=n;function re(E,H){return e.getContext(E,H)}try{const E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ho}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",Et,!1),e.addEventListener("webglcontextcreationerror",St,!1),k===null){const H="webgl2";if(k=re(H,E),k===null)throw re(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Rt,Pt,q,ht,pt,w,M,N,U,Q,et,K,lt,ut,Wt,ft,bt,z,st,dt,kt,Ut,Xt,I;function Mt(){Rt=new c0(k),Rt.init(),Ut=new Y_(k,Rt),Pt=new n0(k,Rt,t,Ut),q=new X_(k,Rt),Pt.reverseDepthBuffer&&p&&q.buffers.depth.setReversed(!0),ht=new h0(k),pt=new C_,w=new $_(k,Rt,q,pt,Pt,Ut,ht),M=new s0(v),N=new o0(v),U=new xp(k),Xt=new t0(k,U),Q=new l0(k,U,ht,Xt),et=new f0(k,Q,U,ht),st=new u0(k,Pt,w),ft=new i0(pt),K=new R_(v,M,N,Rt,Pt,Xt,ft),lt=new ex(v,pt),ut=new D_,Wt=new N_(Rt),z=new Qg(v,M,N,q,et,d,c),bt=new G_(v,et,Pt),I=new nx(k,ht,Pt,q),dt=new e0(k,Rt,ht),kt=new d0(k,Rt,ht),ht.programs=K.programs,v.capabilities=Pt,v.extensions=Rt,v.properties=pt,v.renderLists=ut,v.shadowMap=bt,v.state=q,v.info=ht}Mt();const j=new Q_(v,k);this.xr=j,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const E=Rt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Rt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(E){E!==void 0&&(O=E,this.setSize(A,B,!1))},this.getSize=function(E){return E.set(A,B)},this.setSize=function(E,H,J=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}A=E,B=H,e.width=Math.floor(E*O),e.height=Math.floor(H*O),J===!0&&(e.style.width=E+"px",e.style.height=H+"px"),this.setViewport(0,0,E,H)},this.getDrawingBufferSize=function(E){return E.set(A*O,B*O).floor()},this.setDrawingBufferSize=function(E,H,J){A=E,B=H,O=J,e.width=Math.floor(E*J),e.height=Math.floor(H*J),this.setViewport(0,0,E,H)},this.getCurrentViewport=function(E){return E.copy(P)},this.getViewport=function(E){return E.copy(mt)},this.setViewport=function(E,H,J,tt){E.isVector4?mt.set(E.x,E.y,E.z,E.w):mt.set(E,H,J,tt),q.viewport(P.copy(mt).multiplyScalar(O).round())},this.getScissor=function(E){return E.copy(ct)},this.setScissor=function(E,H,J,tt){E.isVector4?ct.set(E.x,E.y,E.z,E.w):ct.set(E,H,J,tt),q.scissor(G.copy(ct).multiplyScalar(O).round())},this.getScissorTest=function(){return gt},this.setScissorTest=function(E){q.setScissorTest(gt=E)},this.setOpaqueSort=function(E){$=E},this.setTransparentSort=function(E){it=E},this.getClearColor=function(E){return E.copy(z.getClearColor())},this.setClearColor=function(){z.setClearColor.apply(z,arguments)},this.getClearAlpha=function(){return z.getClearAlpha()},this.setClearAlpha=function(){z.setClearAlpha.apply(z,arguments)},this.clear=function(E=!0,H=!0,J=!0){let tt=0;if(E){let V=!1;if(D!==null){const vt=D.texture.format;V=vt===Zo||vt===Yo||vt===$o}if(V){const vt=D.texture.type,Tt=vt===On||vt===gi||vt===vs||vt===ji||vt===Xo||vt===Wo,Ft=z.getClearColor(),Nt=z.getClearAlpha(),Yt=Ft.r,Vt=Ft.g,zt=Ft.b;Tt?(m[0]=Yt,m[1]=Vt,m[2]=zt,m[3]=Nt,k.clearBufferuiv(k.COLOR,0,m)):(_[0]=Yt,_[1]=Vt,_[2]=zt,_[3]=Nt,k.clearBufferiv(k.COLOR,0,_))}else tt|=k.COLOR_BUFFER_BIT}H&&(tt|=k.DEPTH_BUFFER_BIT),J&&(tt|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(tt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",Et,!1),e.removeEventListener("webglcontextcreationerror",St,!1),ut.dispose(),Wt.dispose(),pt.dispose(),M.dispose(),N.dispose(),et.dispose(),Xt.dispose(),I.dispose(),K.dispose(),j.dispose(),j.removeEventListener("sessionstart",Dt),j.removeEventListener("sessionend",$t),Ot.stop()};function at(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function Et(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const E=ht.autoReset,H=bt.enabled,J=bt.autoUpdate,tt=bt.needsUpdate,V=bt.type;Mt(),ht.autoReset=E,bt.enabled=H,bt.autoUpdate=J,bt.needsUpdate=tt,bt.type=V}function St(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Gt(E){const H=E.target;H.removeEventListener("dispose",Gt),Zt(H)}function Zt(E){ie(E),pt.remove(E)}function ie(E){const H=pt.get(E).programs;H!==void 0&&(H.forEach(function(J){K.releaseProgram(J)}),E.isShaderMaterial&&K.releaseShaderCache(E))}this.renderBufferDirect=function(E,H,J,tt,V,vt){H===null&&(H=Ht);const Tt=V.isMesh&&V.matrixWorld.determinant()<0,Ft=un(E,H,J,tt,V);q.setMaterial(tt,Tt);let Nt=J.index,Yt=1;if(tt.wireframe===!0){if(Nt=Q.getWireframeAttribute(J),Nt===void 0)return;Yt=2}const Vt=J.drawRange,zt=J.attributes.position;let ee=Vt.start*Yt,oe=(Vt.start+Vt.count)*Yt;vt!==null&&(ee=Math.max(ee,vt.start*Yt),oe=Math.min(oe,(vt.start+vt.count)*Yt)),Nt!==null?(ee=Math.max(ee,0),oe=Math.min(oe,Nt.count)):zt!=null&&(ee=Math.max(ee,0),oe=Math.min(oe,zt.count));const he=oe-ee;if(he<0||he===1/0)return;Xt.setup(V,tt,Ft,J,Nt);let Ce,te=dt;if(Nt!==null&&(Ce=U.get(Nt),te=kt,te.setIndex(Ce)),V.isMesh)tt.wireframe===!0?(q.setLineWidth(tt.wireframeLinewidth*It()),te.setMode(k.LINES)):te.setMode(k.TRIANGLES);else if(V.isLine){let Bt=tt.linewidth;Bt===void 0&&(Bt=1),q.setLineWidth(Bt*It()),V.isLineSegments?te.setMode(k.LINES):V.isLineLoop?te.setMode(k.LINE_LOOP):te.setMode(k.LINE_STRIP)}else V.isPoints?te.setMode(k.POINTS):V.isSprite&&te.setMode(k.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)te.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(Rt.get("WEBGL_multi_draw"))te.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Bt=V._multiDrawStarts,en=V._multiDrawCounts,ae=V._multiDrawCount,Xe=Nt?U.get(Nt).bytesPerElement:1,nn=pt.get(tt).currentProgram.getUniforms();for(let Se=0;Se<ae;Se++)nn.setValue(k,"_gl_DrawID",Se),te.render(Bt[Se]/Xe,en[Se])}else if(V.isInstancedMesh)te.renderInstances(ee,he,V.count);else if(J.isInstancedBufferGeometry){const Bt=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,en=Math.min(J.instanceCount,Bt);te.renderInstances(ee,he,en)}else te.render(ee,he)};function Z(E,H,J){E.transparent===!0&&E.side===Ne&&E.forceSinglePass===!1?(E.side=Ge,E.needsUpdate=!0,Re(E,H,J),E.side=Jn,E.needsUpdate=!0,Re(E,H,J),E.side=Ne):Re(E,H,J)}this.compile=function(E,H,J=null){J===null&&(J=E),u=Wt.get(J),u.init(H),S.push(u),J.traverseVisible(function(V){V.isLight&&V.layers.test(H.layers)&&(u.pushLight(V),V.castShadow&&u.pushShadow(V))}),E!==J&&E.traverseVisible(function(V){V.isLight&&V.layers.test(H.layers)&&(u.pushLight(V),V.castShadow&&u.pushShadow(V))}),u.setupLights();const tt=new Set;return E.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const vt=V.material;if(vt)if(Array.isArray(vt))for(let Tt=0;Tt<vt.length;Tt++){const Ft=vt[Tt];Z(Ft,J,V),tt.add(Ft)}else Z(vt,J,V),tt.add(vt)}),S.pop(),u=null,tt},this.compileAsync=function(E,H,J=null){const tt=this.compile(E,H,J);return new Promise(V=>{function vt(){if(tt.forEach(function(Tt){pt.get(Tt).currentProgram.isReady()&&tt.delete(Tt)}),tt.size===0){V(E);return}setTimeout(vt,10)}Rt.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let _t=null;function yt(E){_t&&_t(E)}function Dt(){Ot.stop()}function $t(){Ot.start()}const Ot=new vd;Ot.setAnimationLoop(yt),typeof self<"u"&&Ot.setContext(self),this.setAnimationLoop=function(E){_t=E,j.setAnimationLoop(E),E===null?Ot.stop():Ot.start()},j.addEventListener("sessionstart",Dt),j.addEventListener("sessionend",$t),this.render=function(E,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(H),H=j.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,H,D),u=Wt.get(E,S.length),u.init(H),S.push(u),xt.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),Y.setFromProjectionMatrix(xt),ot=this.localClippingEnabled,nt=ft.init(this.clippingPlanes,ot),g=ut.get(E,x.length),g.init(),x.push(g),j.enabled===!0&&j.isPresenting===!0){const vt=v.xr.getDepthSensingMesh();vt!==null&&Qt(vt,H,-1/0,v.sortObjects)}Qt(E,H,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort($,it),wt=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,wt&&z.addToRenderList(g,E),this.info.render.frame++,nt===!0&&ft.beginShadows();const J=u.state.shadowsArray;bt.render(J,E,H),nt===!0&&ft.endShadows(),this.info.autoReset===!0&&this.info.reset();const tt=g.opaque,V=g.transmissive;if(u.setupLights(),H.isArrayCamera){const vt=H.cameras;if(V.length>0)for(let Tt=0,Ft=vt.length;Tt<Ft;Tt++){const Nt=vt[Tt];Le(tt,V,E,Nt)}wt&&z.render(E);for(let Tt=0,Ft=vt.length;Tt<Ft;Tt++){const Nt=vt[Tt];me(g,E,Nt,Nt.viewport)}}else V.length>0&&Le(tt,V,E,H),wt&&z.render(E),me(g,E,H);D!==null&&(w.updateMultisampleRenderTarget(D),w.updateRenderTargetMipmap(D)),E.isScene===!0&&E.onAfterRender(v,E,H),Xt.resetDefaultState(),b=-1,y=null,S.pop(),S.length>0?(u=S[S.length-1],nt===!0&&ft.setGlobalState(v.clippingPlanes,u.state.camera)):u=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function Qt(E,H,J,tt){if(E.visible===!1)return;if(E.layers.test(H.layers)){if(E.isGroup)J=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(H);else if(E.isLight)u.pushLight(E),E.castShadow&&u.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Y.intersectsSprite(E)){tt&&Lt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(xt);const Tt=et.update(E),Ft=E.material;Ft.visible&&g.push(E,Tt,Ft,J,Lt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Y.intersectsObject(E))){const Tt=et.update(E),Ft=E.material;if(tt&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Lt.copy(E.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),Lt.copy(Tt.boundingSphere.center)),Lt.applyMatrix4(E.matrixWorld).applyMatrix4(xt)),Array.isArray(Ft)){const Nt=Tt.groups;for(let Yt=0,Vt=Nt.length;Yt<Vt;Yt++){const zt=Nt[Yt],ee=Ft[zt.materialIndex];ee&&ee.visible&&g.push(E,Tt,ee,J,Lt.z,zt)}}else Ft.visible&&g.push(E,Tt,Ft,J,Lt.z,null)}}const vt=E.children;for(let Tt=0,Ft=vt.length;Tt<Ft;Tt++)Qt(vt[Tt],H,J,tt)}function me(E,H,J,tt){const V=E.opaque,vt=E.transmissive,Tt=E.transparent;u.setupLightsView(J),nt===!0&&ft.setGlobalState(v.clippingPlanes,J),tt&&q.viewport(P.copy(tt)),V.length>0&&se(V,H,J),vt.length>0&&se(vt,H,J),Tt.length>0&&se(Tt,H,J),q.buffers.depth.setTest(!0),q.buffers.depth.setMask(!0),q.buffers.color.setMask(!0),q.setPolygonOffset(!1)}function Le(E,H,J,tt){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[tt.id]===void 0&&(u.state.transmissionRenderTarget[tt.id]=new _i(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?ys:On,minFilter:fi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ne.workingColorSpace}));const vt=u.state.transmissionRenderTarget[tt.id],Tt=tt.viewport||P;vt.setSize(Tt.z,Tt.w);const Ft=v.getRenderTarget();v.setRenderTarget(vt),v.getClearColor(W),T=v.getClearAlpha(),T<1&&v.setClearColor(16777215,.5),v.clear(),wt&&z.render(J);const Nt=v.toneMapping;v.toneMapping=jn;const Yt=tt.viewport;if(tt.viewport!==void 0&&(tt.viewport=void 0),u.setupLightsView(tt),nt===!0&&ft.setGlobalState(v.clippingPlanes,tt),se(E,J,tt),w.updateMultisampleRenderTarget(vt),w.updateRenderTargetMipmap(vt),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let Vt=!1;for(let zt=0,ee=H.length;zt<ee;zt++){const oe=H[zt],he=oe.object,Ce=oe.geometry,te=oe.material,Bt=oe.group;if(te.side===Ne&&he.layers.test(tt.layers)){const en=te.side;te.side=Ge,te.needsUpdate=!0,ye(he,J,tt,Ce,te,Bt),te.side=en,te.needsUpdate=!0,Vt=!0}}Vt===!0&&(w.updateMultisampleRenderTarget(vt),w.updateRenderTargetMipmap(vt))}v.setRenderTarget(Ft),v.setClearColor(W,T),Yt!==void 0&&(tt.viewport=Yt),v.toneMapping=Nt}function se(E,H,J){const tt=H.isScene===!0?H.overrideMaterial:null;for(let V=0,vt=E.length;V<vt;V++){const Tt=E[V],Ft=Tt.object,Nt=Tt.geometry,Yt=tt===null?Tt.material:tt,Vt=Tt.group;Ft.layers.test(J.layers)&&ye(Ft,H,J,Nt,Yt,Vt)}}function ye(E,H,J,tt,V,vt){E.onBeforeRender(v,H,J,tt,V,vt),E.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),V.onBeforeRender(v,H,J,tt,E,vt),V.transparent===!0&&V.side===Ne&&V.forceSinglePass===!1?(V.side=Ge,V.needsUpdate=!0,v.renderBufferDirect(J,H,tt,V,E,vt),V.side=Jn,V.needsUpdate=!0,v.renderBufferDirect(J,H,tt,V,E,vt),V.side=Ne):v.renderBufferDirect(J,H,tt,V,E,vt),E.onAfterRender(v,H,J,tt,V,vt)}function Re(E,H,J){H.isScene!==!0&&(H=Ht);const tt=pt.get(E),V=u.state.lights,vt=u.state.shadowsArray,Tt=V.state.version,Ft=K.getParameters(E,V.state,vt,H,J),Nt=K.getProgramCacheKey(Ft);let Yt=tt.programs;tt.environment=E.isMeshStandardMaterial?H.environment:null,tt.fog=H.fog,tt.envMap=(E.isMeshStandardMaterial?N:M).get(E.envMap||tt.environment),tt.envMapRotation=tt.environment!==null&&E.envMap===null?H.environmentRotation:E.envMapRotation,Yt===void 0&&(E.addEventListener("dispose",Gt),Yt=new Map,tt.programs=Yt);let Vt=Yt.get(Nt);if(Vt!==void 0){if(tt.currentProgram===Vt&&tt.lightsStateVersion===Tt)return wn(E,Ft),Vt}else Ft.uniforms=K.getUniforms(E),E.onBeforeCompile(Ft,v),Vt=K.acquireProgram(Ft,Nt),Yt.set(Nt,Vt),tt.uniforms=Ft.uniforms;const zt=tt.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(zt.clippingPlanes=ft.uniform),wn(E,Ft),tt.needsLights=Ua(E),tt.lightsStateVersion=Tt,tt.needsLights&&(zt.ambientLightColor.value=V.state.ambient,zt.lightProbe.value=V.state.probe,zt.directionalLights.value=V.state.directional,zt.directionalLightShadows.value=V.state.directionalShadow,zt.spotLights.value=V.state.spot,zt.spotLightShadows.value=V.state.spotShadow,zt.rectAreaLights.value=V.state.rectArea,zt.ltc_1.value=V.state.rectAreaLTC1,zt.ltc_2.value=V.state.rectAreaLTC2,zt.pointLights.value=V.state.point,zt.pointLightShadows.value=V.state.pointShadow,zt.hemisphereLights.value=V.state.hemi,zt.directionalShadowMap.value=V.state.directionalShadowMap,zt.directionalShadowMatrix.value=V.state.directionalShadowMatrix,zt.spotShadowMap.value=V.state.spotShadowMap,zt.spotLightMatrix.value=V.state.spotLightMatrix,zt.spotLightMap.value=V.state.spotLightMap,zt.pointShadowMap.value=V.state.pointShadowMap,zt.pointShadowMatrix.value=V.state.pointShadowMatrix),tt.currentProgram=Vt,tt.uniformsList=null,Vt}function Ze(E){if(E.uniformsList===null){const H=E.currentProgram.getUniforms();E.uniformsList=ha.seqWithValue(H.seq,E.uniforms)}return E.uniformsList}function wn(E,H){const J=pt.get(E);J.outputColorSpace=H.outputColorSpace,J.batching=H.batching,J.batchingColor=H.batchingColor,J.instancing=H.instancing,J.instancingColor=H.instancingColor,J.instancingMorph=H.instancingMorph,J.skinning=H.skinning,J.morphTargets=H.morphTargets,J.morphNormals=H.morphNormals,J.morphColors=H.morphColors,J.morphTargetsCount=H.morphTargetsCount,J.numClippingPlanes=H.numClippingPlanes,J.numIntersection=H.numClipIntersection,J.vertexAlphas=H.vertexAlphas,J.vertexTangents=H.vertexTangents,J.toneMapping=H.toneMapping}function un(E,H,J,tt,V){H.isScene!==!0&&(H=Ht),w.resetTextureUnits();const vt=H.fog,Tt=tt.isMeshStandardMaterial?H.environment:null,Ft=D===null?v.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Qi,Nt=(tt.isMeshStandardMaterial?N:M).get(tt.envMap||Tt),Yt=tt.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Vt=!!J.attributes.tangent&&(!!tt.normalMap||tt.anisotropy>0),zt=!!J.morphAttributes.position,ee=!!J.morphAttributes.normal,oe=!!J.morphAttributes.color;let he=jn;tt.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(he=v.toneMapping);const Ce=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,te=Ce!==void 0?Ce.length:0,Bt=pt.get(tt),en=u.state.lights;if(nt===!0&&(ot===!0||E!==y)){const Ie=E===y&&tt.id===b;ft.setState(tt,E,Ie)}let ae=!1;tt.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==en.state.version||Bt.outputColorSpace!==Ft||V.isBatchedMesh&&Bt.batching===!1||!V.isBatchedMesh&&Bt.batching===!0||V.isBatchedMesh&&Bt.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Bt.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Bt.instancing===!1||!V.isInstancedMesh&&Bt.instancing===!0||V.isSkinnedMesh&&Bt.skinning===!1||!V.isSkinnedMesh&&Bt.skinning===!0||V.isInstancedMesh&&Bt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Bt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Bt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Bt.instancingMorph===!1&&V.morphTexture!==null||Bt.envMap!==Nt||tt.fog===!0&&Bt.fog!==vt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==ft.numPlanes||Bt.numIntersection!==ft.numIntersection)||Bt.vertexAlphas!==Yt||Bt.vertexTangents!==Vt||Bt.morphTargets!==zt||Bt.morphNormals!==ee||Bt.morphColors!==oe||Bt.toneMapping!==he||Bt.morphTargetsCount!==te)&&(ae=!0):(ae=!0,Bt.__version=tt.version);let Xe=Bt.currentProgram;ae===!0&&(Xe=Re(tt,H,V));let nn=!1,Se=!1,Bn=!1;const ce=Xe.getUniforms(),qe=Bt.uniforms;if(q.useProgram(Xe.program)&&(nn=!0,Se=!0,Bn=!0),tt.id!==b&&(b=tt.id,Se=!0),nn||y!==E){q.buffers.depth.getReversed()?(rt.copy(E.projectionMatrix),Yf(rt),Zf(rt),ce.setValue(k,"projectionMatrix",rt)):ce.setValue(k,"projectionMatrix",E.projectionMatrix),ce.setValue(k,"viewMatrix",E.matrixWorldInverse);const fn=ce.map.cameraPosition;fn!==void 0&&fn.setValue(k,Ct.setFromMatrixPosition(E.matrixWorld)),Pt.logarithmicDepthBuffer&&ce.setValue(k,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(tt.isMeshPhongMaterial||tt.isMeshToonMaterial||tt.isMeshLambertMaterial||tt.isMeshBasicMaterial||tt.isMeshStandardMaterial||tt.isShaderMaterial)&&ce.setValue(k,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Se=!0,Bn=!0)}if(V.isSkinnedMesh){ce.setOptional(k,V,"bindMatrix"),ce.setOptional(k,V,"bindMatrixInverse");const Ie=V.skeleton;Ie&&(Ie.boneTexture===null&&Ie.computeBoneTexture(),ce.setValue(k,"boneTexture",Ie.boneTexture,w))}V.isBatchedMesh&&(ce.setOptional(k,V,"batchingTexture"),ce.setValue(k,"batchingTexture",V._matricesTexture,w),ce.setOptional(k,V,"batchingIdTexture"),ce.setValue(k,"batchingIdTexture",V._indirectTexture,w),ce.setOptional(k,V,"batchingColorTexture"),V._colorsTexture!==null&&ce.setValue(k,"batchingColorTexture",V._colorsTexture,w));const An=J.morphAttributes;if((An.position!==void 0||An.normal!==void 0||An.color!==void 0)&&st.update(V,J,Xe),(Se||Bt.receiveShadow!==V.receiveShadow)&&(Bt.receiveShadow=V.receiveShadow,ce.setValue(k,"receiveShadow",V.receiveShadow)),tt.isMeshGouraudMaterial&&tt.envMap!==null&&(qe.envMap.value=Nt,qe.flipEnvMap.value=Nt.isCubeTexture&&Nt.isRenderTargetTexture===!1?-1:1),tt.isMeshStandardMaterial&&tt.envMap===null&&H.environment!==null&&(qe.envMapIntensity.value=H.environmentIntensity),Se&&(ce.setValue(k,"toneMappingExposure",v.toneMappingExposure),Bt.needsLights&&ns(qe,Bn),vt&&tt.fog===!0&&lt.refreshFogUniforms(qe,vt),lt.refreshMaterialUniforms(qe,tt,O,B,u.state.transmissionRenderTarget[E.id]),ha.upload(k,Ze(Bt),qe,w)),tt.isShaderMaterial&&tt.uniformsNeedUpdate===!0&&(ha.upload(k,Ze(Bt),qe,w),tt.uniformsNeedUpdate=!1),tt.isSpriteMaterial&&ce.setValue(k,"center",V.center),ce.setValue(k,"modelViewMatrix",V.modelViewMatrix),ce.setValue(k,"normalMatrix",V.normalMatrix),ce.setValue(k,"modelMatrix",V.matrixWorld),tt.isShaderMaterial||tt.isRawShaderMaterial){const Ie=tt.uniformsGroups;for(let fn=0,ue=Ie.length;fn<ue;fn++){const Es=Ie[fn];I.update(Es,Xe),I.bind(Es,Xe)}}return Xe}function ns(E,H){E.ambientLightColor.needsUpdate=H,E.lightProbe.needsUpdate=H,E.directionalLights.needsUpdate=H,E.directionalLightShadows.needsUpdate=H,E.pointLights.needsUpdate=H,E.pointLightShadows.needsUpdate=H,E.spotLights.needsUpdate=H,E.spotLightShadows.needsUpdate=H,E.rectAreaLights.needsUpdate=H,E.hemisphereLights.needsUpdate=H}function Ua(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(E,H,J){pt.get(E.texture).__webglTexture=H,pt.get(E.depthTexture).__webglTexture=J;const tt=pt.get(E);tt.__hasExternalTextures=!0,tt.__autoAllocateDepthBuffer=J===void 0,tt.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),tt.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,H){const J=pt.get(E);J.__webglFramebuffer=H,J.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(E,H=0,J=0){D=E,R=H,C=J;let tt=!0,V=null,vt=!1,Tt=!1;if(E){const Nt=pt.get(E);if(Nt.__useDefaultFramebuffer!==void 0)q.bindFramebuffer(k.FRAMEBUFFER,null),tt=!1;else if(Nt.__webglFramebuffer===void 0)w.setupRenderTarget(E);else if(Nt.__hasExternalTextures)w.rebindTextures(E,pt.get(E.texture).__webglTexture,pt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const zt=E.depthTexture;if(Nt.__boundDepthTexture!==zt){if(zt!==null&&pt.has(zt)&&(E.width!==zt.image.width||E.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(E)}}const Yt=E.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(Tt=!0);const Vt=pt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Vt[H])?V=Vt[H][J]:V=Vt[H],vt=!0):E.samples>0&&w.useMultisampledRTT(E)===!1?V=pt.get(E).__webglMultisampledFramebuffer:Array.isArray(Vt)?V=Vt[J]:V=Vt,P.copy(E.viewport),G.copy(E.scissor),F=E.scissorTest}else P.copy(mt).multiplyScalar(O).floor(),G.copy(ct).multiplyScalar(O).floor(),F=gt;if(q.bindFramebuffer(k.FRAMEBUFFER,V)&&tt&&q.drawBuffers(E,V),q.viewport(P),q.scissor(G),q.setScissorTest(F),vt){const Nt=pt.get(E.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+H,Nt.__webglTexture,J)}else if(Tt){const Nt=pt.get(E.texture),Yt=H||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,Nt.__webglTexture,J||0,Yt)}b=-1},this.readRenderTargetPixels=function(E,H,J,tt,V,vt,Tt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ft=pt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Tt!==void 0&&(Ft=Ft[Tt]),Ft){q.bindFramebuffer(k.FRAMEBUFFER,Ft);try{const Nt=E.texture,Yt=Nt.format,Vt=Nt.type;if(!Pt.textureFormatReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pt.textureTypeReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=E.width-tt&&J>=0&&J<=E.height-V&&k.readPixels(H,J,tt,V,Ut.convert(Yt),Ut.convert(Vt),vt)}finally{const Nt=D!==null?pt.get(D).__webglFramebuffer:null;q.bindFramebuffer(k.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(E,H,J,tt,V,vt,Tt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ft=pt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Tt!==void 0&&(Ft=Ft[Tt]),Ft){const Nt=E.texture,Yt=Nt.format,Vt=Nt.type;if(!Pt.textureFormatReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pt.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(H>=0&&H<=E.width-tt&&J>=0&&J<=E.height-V){q.bindFramebuffer(k.FRAMEBUFFER,Ft);const zt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,zt),k.bufferData(k.PIXEL_PACK_BUFFER,vt.byteLength,k.STREAM_READ),k.readPixels(H,J,tt,V,Ut.convert(Yt),Ut.convert(Vt),0);const ee=D!==null?pt.get(D).__webglFramebuffer:null;q.bindFramebuffer(k.FRAMEBUFFER,ee);const oe=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await $f(k,oe,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,zt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,vt),k.deleteBuffer(zt),k.deleteSync(oe),vt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,H=null,J=0){E.isTexture!==!0&&(fs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),H=arguments[0]||null,E=arguments[1]);const tt=Math.pow(2,-J),V=Math.floor(E.image.width*tt),vt=Math.floor(E.image.height*tt),Tt=H!==null?H.x:0,Ft=H!==null?H.y:0;w.setTexture2D(E,0),k.copyTexSubImage2D(k.TEXTURE_2D,J,0,0,Tt,Ft,V,vt),q.unbindTexture()},this.copyTextureToTexture=function(E,H,J=null,tt=null,V=0){E.isTexture!==!0&&(fs("WebGLRenderer: copyTextureToTexture function signature has changed."),tt=arguments[0]||null,E=arguments[1],H=arguments[2],V=arguments[3]||0,J=null);let vt,Tt,Ft,Nt,Yt,Vt,zt,ee,oe;const he=E.isCompressedTexture?E.mipmaps[V]:E.image;J!==null?(vt=J.max.x-J.min.x,Tt=J.max.y-J.min.y,Ft=J.isBox3?J.max.z-J.min.z:1,Nt=J.min.x,Yt=J.min.y,Vt=J.isBox3?J.min.z:0):(vt=he.width,Tt=he.height,Ft=he.depth||1,Nt=0,Yt=0,Vt=0),tt!==null?(zt=tt.x,ee=tt.y,oe=tt.z):(zt=0,ee=0,oe=0);const Ce=Ut.convert(H.format),te=Ut.convert(H.type);let Bt;H.isData3DTexture?(w.setTexture3D(H,0),Bt=k.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(w.setTexture2DArray(H,0),Bt=k.TEXTURE_2D_ARRAY):(w.setTexture2D(H,0),Bt=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,H.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,H.unpackAlignment);const en=k.getParameter(k.UNPACK_ROW_LENGTH),ae=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Xe=k.getParameter(k.UNPACK_SKIP_PIXELS),nn=k.getParameter(k.UNPACK_SKIP_ROWS),Se=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,he.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,he.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Nt),k.pixelStorei(k.UNPACK_SKIP_ROWS,Yt),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Vt);const Bn=E.isDataArrayTexture||E.isData3DTexture,ce=H.isDataArrayTexture||H.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const qe=pt.get(E),An=pt.get(H),Ie=pt.get(qe.__renderTarget),fn=pt.get(An.__renderTarget);q.bindFramebuffer(k.READ_FRAMEBUFFER,Ie.__webglFramebuffer),q.bindFramebuffer(k.DRAW_FRAMEBUFFER,fn.__webglFramebuffer);for(let ue=0;ue<Ft;ue++)Bn&&k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,pt.get(E).__webglTexture,V,Vt+ue),E.isDepthTexture?(ce&&k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,pt.get(H).__webglTexture,V,oe+ue),k.blitFramebuffer(Nt,Yt,vt,Tt,zt,ee,vt,Tt,k.DEPTH_BUFFER_BIT,k.NEAREST)):ce?k.copyTexSubImage3D(Bt,V,zt,ee,oe+ue,Nt,Yt,vt,Tt):k.copyTexSubImage2D(Bt,V,zt,ee,oe+ue,Nt,Yt,vt,Tt);q.bindFramebuffer(k.READ_FRAMEBUFFER,null),q.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ce?E.isDataTexture||E.isData3DTexture?k.texSubImage3D(Bt,V,zt,ee,oe,vt,Tt,Ft,Ce,te,he.data):H.isCompressedArrayTexture?k.compressedTexSubImage3D(Bt,V,zt,ee,oe,vt,Tt,Ft,Ce,he.data):k.texSubImage3D(Bt,V,zt,ee,oe,vt,Tt,Ft,Ce,te,he):E.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,V,zt,ee,vt,Tt,Ce,te,he.data):E.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,V,zt,ee,he.width,he.height,Ce,he.data):k.texSubImage2D(k.TEXTURE_2D,V,zt,ee,vt,Tt,Ce,te,he);k.pixelStorei(k.UNPACK_ROW_LENGTH,en),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ae),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Xe),k.pixelStorei(k.UNPACK_SKIP_ROWS,nn),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Se),V===0&&H.generateMipmaps&&k.generateMipmap(Bt),q.unbindTexture()},this.copyTextureToTexture3D=function(E,H,J=null,tt=null,V=0){return E.isTexture!==!0&&(fs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),J=arguments[0]||null,tt=arguments[1]||null,E=arguments[2],H=arguments[3],V=arguments[4]||0),fs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,H,J,tt,V)},this.initRenderTarget=function(E){pt.get(E).__webglFramebuffer===void 0&&w.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?w.setTextureCube(E,0):E.isData3DTexture?w.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?w.setTexture2DArray(E,0):w.setTexture2D(E,0),q.unbindTexture()},this.resetState=function(){R=0,C=0,D=null,q.reset(),Xt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Nn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ne._getDrawingBufferColorSpace(t),e.unpackColorSpace=ne._getUnpackColorSpace()}}class sx extends xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class ax{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Ro,this.updateRanges=[],this.version=0,this.uuid=Kn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ke=new X;class ba{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyMatrix4(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyNormalMatrix(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.transformDirection(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=vn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=de(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=de(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=de(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=de(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=de(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=vn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=vn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=vn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=vn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=de(e,this.array),n=de(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=de(e,this.array),n=de(n,this.array),s=de(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=de(e,this.array),n=de(n,this.array),s=de(s,this.array),a=de(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new hn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ba(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ad extends xi{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ni;const ls=new X,zi=new X,Oi=new X,Bi=new jt,ds=new jt,Td=new pe,Zs=new X,hs=new X,qs=new X,wl=new jt,br=new jt,Al=new jt;class rx extends xe{constructor(t=new Ad){if(super(),this.isSprite=!0,this.type="Sprite",Ni===void 0){Ni=new Ve;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ax(e,5);Ni.setIndex([0,1,2,0,2,3]),Ni.setAttribute("position",new ba(n,3,0,!1)),Ni.setAttribute("uv",new ba(n,2,3,!1))}this.geometry=Ni,this.material=t,this.center=new jt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),zi.setFromMatrixScale(this.matrixWorld),Td.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Oi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&zi.multiplyScalar(-Oi.z);const n=this.material.rotation;let s,a;n!==0&&(a=Math.cos(n),s=Math.sin(n));const r=this.center;js(Zs.set(-.5,-.5,0),Oi,r,zi,s,a),js(hs.set(.5,-.5,0),Oi,r,zi,s,a),js(qs.set(.5,.5,0),Oi,r,zi,s,a),wl.set(0,0),br.set(1,0),Al.set(1,1);let o=t.ray.intersectTriangle(Zs,hs,qs,!1,ls);if(o===null&&(js(hs.set(-.5,.5,0),Oi,r,zi,s,a),br.set(0,1),o=t.ray.intersectTriangle(Zs,qs,hs,!1,ls),o===null))return;const c=t.ray.origin.distanceTo(ls);c<t.near||c>t.far||e.push({distance:c,point:ls.clone(),uv:Ye.getInterpolation(ls,Zs,hs,qs,wl,br,Al,new jt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function js(i,t,e,n,s,a){Bi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(ds.x=a*Bi.x-s*Bi.y,ds.y=s*Bi.x+a*Bi.y):ds.copy(Bi),i.copy(t),i.x+=ds.x,i.y+=ds.y,i.applyMatrix4(Td)}class Qo extends xi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ea=new X,wa=new X,Tl=new pe,us=new qo,Ks=new Da,Er=new X,Rl=new X;class ox extends xe{constructor(t=new Ve,e=new Qo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,a=e.count;s<a;s++)Ea.fromBufferAttribute(e,s-1),wa.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Ea.distanceTo(wa);t.setAttribute("lineDistance",new ve(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ks.copy(n.boundingSphere),Ks.applyMatrix4(s),Ks.radius+=a,t.ray.intersectsSphere(Ks)===!1)return;Tl.copy(s).invert(),us.copy(t.ray).applyMatrix4(Tl);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,p=n.attributes.position;if(h!==null){const d=Math.max(0,r.start),m=Math.min(h.count,r.start+r.count);for(let _=d,g=m-1;_<g;_+=l){const u=h.getX(_),x=h.getX(_+1),S=Js(this,t,us,c,u,x);S&&e.push(S)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(d),u=Js(this,t,us,c,_,g);u&&e.push(u)}}else{const d=Math.max(0,r.start),m=Math.min(p.count,r.start+r.count);for(let _=d,g=m-1;_<g;_+=l){const u=Js(this,t,us,c,_,_+1);u&&e.push(u)}if(this.isLineLoop){const _=Js(this,t,us,c,m-1,d);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function Js(i,t,e,n,s,a){const r=i.geometry.attributes.position;if(Ea.fromBufferAttribute(r,s),wa.fromBufferAttribute(r,a),e.distanceSqToSegment(Ea,wa,Er,Rl)>n)return;Er.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Er);if(!(c<t.near||c>t.far))return{distance:c,point:Rl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Cl=new X,Pl=new X;class Rd extends ox{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,a=e.count;s<a;s+=2)Cl.fromBufferAttribute(e,s),Pl.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Cl.distanceTo(Pl);t.setAttribute("lineDistance",new ve(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class cx extends Oe{constructor(t,e,n,s,a,r,o,c,l){super(t,e,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class tc extends Ve{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const a=[],r=[];o(s),l(n),h(),this.setAttribute("position",new ve(a,3)),this.setAttribute("normal",new ve(a.slice(),3)),this.setAttribute("uv",new ve(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const S=new X,v=new X,L=new X;for(let R=0;R<e.length;R+=3)d(e[R+0],S),d(e[R+1],v),d(e[R+2],L),c(S,v,L,x)}function c(x,S,v,L){const R=L+1,C=[];for(let D=0;D<=R;D++){C[D]=[];const b=x.clone().lerp(v,D/R),y=S.clone().lerp(v,D/R),P=R-D;for(let G=0;G<=P;G++)G===0&&D===R?C[D][G]=b:C[D][G]=b.clone().lerp(y,G/P)}for(let D=0;D<R;D++)for(let b=0;b<2*(R-D)-1;b++){const y=Math.floor(b/2);b%2===0?(p(C[D][y+1]),p(C[D+1][y]),p(C[D][y])):(p(C[D][y+1]),p(C[D+1][y+1]),p(C[D+1][y]))}}function l(x){const S=new X;for(let v=0;v<a.length;v+=3)S.x=a[v+0],S.y=a[v+1],S.z=a[v+2],S.normalize().multiplyScalar(x),a[v+0]=S.x,a[v+1]=S.y,a[v+2]=S.z}function h(){const x=new X;for(let S=0;S<a.length;S+=3){x.x=a[S+0],x.y=a[S+1],x.z=a[S+2];const v=g(x)/2/Math.PI+.5,L=u(x)/Math.PI+.5;r.push(v,1-L)}m(),f()}function f(){for(let x=0;x<r.length;x+=6){const S=r[x+0],v=r[x+2],L=r[x+4],R=Math.max(S,v,L),C=Math.min(S,v,L);R>.9&&C<.1&&(S<.2&&(r[x+0]+=1),v<.2&&(r[x+2]+=1),L<.2&&(r[x+4]+=1))}}function p(x){a.push(x.x,x.y,x.z)}function d(x,S){const v=x*3;S.x=t[v+0],S.y=t[v+1],S.z=t[v+2]}function m(){const x=new X,S=new X,v=new X,L=new X,R=new jt,C=new jt,D=new jt;for(let b=0,y=0;b<a.length;b+=9,y+=6){x.set(a[b+0],a[b+1],a[b+2]),S.set(a[b+3],a[b+4],a[b+5]),v.set(a[b+6],a[b+7],a[b+8]),R.set(r[y+0],r[y+1]),C.set(r[y+2],r[y+3]),D.set(r[y+4],r[y+5]),L.copy(x).add(S).add(v).divideScalar(3);const P=g(L);_(R,y+0,x,P),_(C,y+2,S,P),_(D,y+4,v,P)}}function _(x,S,v,L){L<0&&x.x===1&&(r[S]=x.x-1),v.x===0&&v.z===0&&(r[S]=L/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function u(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new tc(t.vertices,t.indices,t.radius,t.details)}}const Qs=new X,ta=new X,wr=new X,ea=new Ye;class lx extends Ve{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(da*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],h=["a","b","c"],f=new Array(3),p={},d=[];for(let m=0;m<c;m+=3){r?(l[0]=r.getX(m),l[1]=r.getX(m+1),l[2]=r.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);const{a:_,b:g,c:u}=ea;if(_.fromBufferAttribute(o,l[0]),g.fromBufferAttribute(o,l[1]),u.fromBufferAttribute(o,l[2]),ea.getNormal(wr),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(u.x*s)},${Math.round(u.y*s)},${Math.round(u.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const S=(x+1)%3,v=f[x],L=f[S],R=ea[h[x]],C=ea[h[S]],D=`${v}_${L}`,b=`${L}_${v}`;b in p&&p[b]?(wr.dot(p[b].normal)<=a&&(d.push(R.x,R.y,R.z),d.push(C.x,C.y,C.z)),p[b]=null):D in p||(p[D]={index0:l[x],index1:l[S],normal:wr.clone()})}}for(const m in p)if(p[m]){const{index0:_,index1:g}=p[m];Qs.fromBufferAttribute(o,_),ta.fromBufferAttribute(o,g),d.push(Qs.x,Qs.y,Qs.z),d.push(ta.x,ta.y,ta.z)}this.setAttribute("position",new ve(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class ec extends tc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,a,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ec(t.radius,t.detail)}}class Vi extends Ve{constructor(t=.5,e=1,n=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:r},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let f=t;const p=(e-t)/s,d=new X,m=new jt;for(let _=0;_<=s;_++){for(let g=0;g<=n;g++){const u=a+g/n*r;d.x=f*Math.cos(u),d.y=f*Math.sin(u),c.push(d.x,d.y,d.z),l.push(0,0,1),m.x=(d.x/e+1)/2,m.y=(d.y/e+1)/2,h.push(m.x,m.y)}f+=p}for(let _=0;_<s;_++){const g=_*(n+1);for(let u=0;u<n;u++){const x=u+g,S=x,v=x+n+1,L=x+n+2,R=x+1;o.push(S,v,R),o.push(v,L,R)}}this.setIndex(o),this.setAttribute("position",new ve(c,3)),this.setAttribute("normal",new ve(l,3)),this.setAttribute("uv",new ve(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ka extends Ve{constructor(t=1,e=.4,n=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:a},n=Math.floor(n),s=Math.floor(s);const r=[],o=[],c=[],l=[],h=new X,f=new X,p=new X;for(let d=0;d<=n;d++)for(let m=0;m<=s;m++){const _=m/s*a,g=d/n*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(_),f.y=(t+e*Math.cos(g))*Math.sin(_),f.z=e*Math.sin(g),o.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),p.subVectors(f,h).normalize(),c.push(p.x,p.y,p.z),l.push(m/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let m=1;m<=s;m++){const _=(s+1)*d+m-1,g=(s+1)*(d-1)+m-1,u=(s+1)*(d-1)+m,x=(s+1)*d+m;r.push(_,g,x),r.push(g,u,x)}this.setIndex(r),this.setAttribute("position",new ve(o,3)),this.setAttribute("normal",new ve(c,3)),this.setAttribute("uv",new ve(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ka(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ms extends xi{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cd,this.normalScale=new jt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Go,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Cd extends xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class dx extends Cd{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ar=new pe,Dl=new X,Ll=new X;class hx{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new jt(512,512),this.map=null,this.mapPass=null,this.matrix=new pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ko,this._frameExtents=new jt(1,1),this._viewportCount=1,this._viewports=[new _e(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Dl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Dl),Ll.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ll),e.updateMatrixWorld(),Ar.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ar),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ar)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class ux extends hx{constructor(){super(new Md(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class fx extends Cd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.target=new xe,this.shadow=new ux}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Il=new pe;class px{constructor(t,e,n=0,s=1/0){this.ray=new qo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new jo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Il.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Il),this}intersectObject(t,e=!0,n=[]){return Do(t,this,n,e),n.sort(kl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,a=t.length;s<a;s++)Do(t[s],this,n,e);return n.sort(kl),n}}function kl(i,t){return i.distance-t.distance}function Do(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const a=i.children;for(let r=0,o=a.length;r<o;r++)Do(a[r],t,e,!0)}}class mx extends Rd{constructor(t=10,e=10,n=4473924,s=8947848){n=new qt(n),s=new qt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let p=0,d=0,m=-o;p<=e;p++,m+=r){c.push(-o,0,m,o,0,m),c.push(m,0,-o,m,0,o);const _=p===a?n:s;_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3,_.toArray(l,d),d+=3}const h=new Ve;h.setAttribute("position",new ve(c,3)),h.setAttribute("color",new ve(l,3));const f=new Qo({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ho}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ho);const gx={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function _x(i,t,e,n){const s=new Je(i.fov,n,.1,200),a=new X,r=new X,o=new X;let c=!1,l=i.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function p(){const d=(i.pitchDeg+h.pitchDelta)*Math.PI/180,m=i.yawDeg*Math.PI/180;o.set(Math.sin(m)*Math.cos(d),Math.sin(d),Math.cos(m)*Math.cos(d)).multiplyScalar(i.distance*h.distanceScale*h.zoom)}return p(),{camera:s,update(d,m,_,g,u=gx){const x=m+.6;if(!c)a.set(d,x,_),c=!0;else{const L=1-Math.exp(-Math.max(i.smoothing,.001)*g);a.x+=(d-a.x)*L,a.y+=(x-a.y)*L,a.z+=(_-a.z)*L}const S=1-Math.exp(-Math.max(t.smoothing,.001)*g);h.distanceScale+=(u.distanceScale-h.distanceScale)*S,h.offsetX+=(u.offsetX-h.offsetX)*S,h.offsetZ+=(u.offsetZ-h.offsetZ)*S,h.pitchDelta+=(u.pitchDelta-h.pitchDelta)*S;const v=1-Math.exp(-Math.max(e.smoothing,.001)*g);h.zoom+=(f-h.zoom)*v,p(),(s.fov!==l||s.fov!==i.fov)&&(s.fov=i.fov,l=i.fov,s.updateProjectionMatrix()),r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(d){s.aspect=d,s.updateProjectionMatrix()},getGroundBasis(){const d=new X().setFromMatrixColumn(s.matrixWorld,0),m=new X().setFromMatrixColumn(s.matrixWorld,2).negate(),_=Math.hypot(d.x,d.z)||1,g=Math.hypot(m.x,m.z)||1;return{rightX:d.x/_,rightZ:d.z/_,forwardX:m.x/g,forwardZ:m.z/g}},setZoom(d){f=Number.isFinite(d)&&d>0?d:1},smart(){return{...h}}}}const pi=Math.PI*2,Hi=1e-6;function Aa(i,t,e){return i<t?t:i>e?e:i}function Pd(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function xx(i){if(i<=Math.PI)return 1-2*i/Math.PI;const t=(i-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function vx(i,t){const e=Math.cos(i),n=t<=0?0:t>=1?1:t;if(n===0)return e;const s=xx(i);return n===1?s:e+(s-e)*n}function Ul(i){return(1-Math.sin(i))/2}function nc(i,t){if(!i.grounded||i.speed<Hi)return Pd();const e=i.speed/Math.max(i.moveSpeed,Hi),n=Math.max(i.legLength,Hi),s=i.stride>Hi?i.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*n,a=Math.min(t.maxAmp,s/n),r=n*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(i.localForward),c=Math.abs(i.localRight),l=o+c+Hi,h=o/l,f=c/l,p=i.localForward>=0?1:-1,d=i.localRight>=0?1:-1,m=s,_=F=>Math.asin(Aa(F,-r,r)/n);function g(F,W){const T=vx(F,t.plantLock),A=Ul(F),B=p*h*m*T,O=-_(B),$=W*d>0?1:-1,it=1+$*t.crossStep*.45,mt=d*$*t.crossStep*m*.4*A,ct=d*f*m*t.sideWeight*it*T+mt*f,gt=_(ct),Y=t.kneeLift*A*a*(.55+.25*h+($>0?.2*f:0));return{pitchX:O,rollZ:gt,kneeX:Y}}const u=(i.phase%pi+pi)%pi,x=g(u,-1),S=g((u+Math.PI)%pi,1),v=Math.cos(u),L=Ul(u),R=-t.comSway*a*v*(.6*h+.8*f)-d*t.comSway*a*f*.45,C=t.comBob*L*a,D=d*t.hipLean*a*f*v*.6,b=d*t.hipLean*a*f*(.45+.25*v),y=t.armSwing*a*v*(h*p+.3*f),P=y,G=-y;return{legL:x,legR:S,pelvisX:R,pelvisY:C,pelvisRoll:D,sideLean:b,armL:P,armR:G,strafe:f,backward:p<0?h:0}}function Dd(i){const t=(i%pi+pi)%pi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Ld(i,t,e){const n=Aa(e.progress,0,1);if(n>=1||i.speed<Hi)return Pd();const s=n*n*(3-2*n),a=1-s;return nc({...i,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:i.speed*a,stride:i.stride*a},t)}function Id(i,t,e,n){const s=Aa(i,-1,1),a=Math.abs(s),r=Math.min(1,t*(1+Math.max(0,n)*a*a));return Aa(r*s,-1,1)*(e*Math.PI/180)}function ze(i){return i<0?0:i>1?1:i}const Mx=Math.PI*2;function yx(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function Sx(i,t,e,n,s){const a=ze(n);if(a<=0)return i;const r=ze(t),o=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),l=e%2===0?1:-1,h=ze(s.forwardBias),f={speed:c,phase:i.phase+r*Mx*o,localForward:c*h,localRight:c*(1-h)*l};return{speed:i.speed+(f.speed-i.speed)*a,phase:i.phase+(f.phase-i.phase)*a,localForward:i.localForward+(f.localForward-i.localForward)*a,localRight:i.localRight+(f.localRight-i.localRight)*a}}function bx(i,t,e){const n=yx(),s=ze(i),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return n;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return n.legL.pitchX=o?-l:l*.55,n.legR.pitchX=c?-l:l*.55,n.legL.kneeX=o?h:h*.4,n.legR.kneeX=c?h:h*.4,n.legL.rollZ=-f*r,n.legR.rollZ=f*r,n.pelvisX=e.stepSway*a*r,n.pelvisY=-e.stepDip*a,n.pelvisRoll=f*.25*r,n}function kd(i,t){if(i<=0||i>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return i<e?Math.sin(Math.PI/2*(i/e)):Math.cos(Math.PI/2*((i-e)/(1-e)))}function Fl(i,t,e,n,s){if(e<=0||n<=0)return 0;const a=(i-t)/e;return a<0||a>=1?0:n*kd(a,s)}function Ex(i,t,e,n){const s=t?1:0,a=1-Math.exp(-Math.max(0,n)*Math.max(0,e)),r=i+(s-i)*a;return t&&r>.999?1:!t&&r<.001?0:r}function wx(i,t,e){const n=ze(i);return{gaitScale:1-n*(1-ze(t)),attackLegWeight:ze(e)*n}}function Ax(i,t){const e=ze(t);return e===1?i:{legL:{pitchX:i.legL.pitchX*e,rollZ:i.legL.rollZ*e,kneeX:i.legL.kneeX*e},legR:{pitchX:i.legR.pitchX*e,rollZ:i.legR.rollZ*e,kneeX:i.legR.kneeX*e},pelvisX:i.pelvisX*e,pelvisY:i.pelvisY*e,pelvisRoll:i.pelvisRoll*e,sideLean:i.sideLean*e,armL:i.armL*e,armR:i.armR*e,strafe:i.strafe,backward:i.backward}}function Tx(i,t){const e=Math.min(1,Math.abs(i)/Math.max(t.impactSpeed,1e-6));return ze(t.minScale+(1-t.minScale)*e)}function Rx(){return Ud()}function Ud(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function Cx(i,t){return i.type==="light"?Math.max(0,t.leanLight):i.type==="heavy"?Math.max(0,t.leanHeavy):i.type==="knock"?Math.max(0,t.leanKnock):0}function Px(i,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?ze(t.forceHitHeight):i.type==="light"?ze(t.hitHeight.light):i.type==="heavy"?ze(t.hitHeight.heavy):i.type==="knock"?ze(t.hitHeight.knock):0}function Dx(i,t,e){const n=ze(e),s=(a,r)=>a+(r-a)*n;return{upperPitch:s(i.upperPitch,t.upperPitch),upperRoll:s(i.upperRoll,t.upperRoll),upperYaw:s(i.upperYaw,t.upperYaw),fold:s(i.fold,t.fold),shift:s(i.shift,t.shift),drop:s(i.drop,t.drop),back:s(i.back,t.back),knee:s(i.knee,t.knee),hip:s(i.hip,t.hip),arm:s(i.arm,t.arm)}}function Fd(i,t,e){const n=Ud(),s=Cx(i,e);if(n.intensity=s,s<=0||i.duration<=0||!Number.isFinite(i.timer))return n;const a=ze(1-i.timer/i.duration),r=kd(a,e.pulseRatio);n.pulse=r,n.active=r>0,n.hitHeight=Px(i,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),f=i.dirX*o+i.dirZ*c,p=i.dirX*l+i.dirZ*h;if(n.localFwd=f,n.localRight=p,!e.enabled){n.legacy=!0;const _=Math.sin(Math.PI*a);return n.upperPitch=s*_*f,n.upperRoll=-s*_*p*.7,n.drop=(s>.5?.09:.04)*_,n.flash=e.flashStrength*_,n.active=_>0,n}const d=s*r,m=Dx(e.abdomen,e.shoulder,n.hitHeight);return n.upperPitch=d*(m.upperPitch*f+m.fold),n.upperRoll=-d*m.upperRoll*p,n.upperYaw=d*m.upperYaw*p,n.upperShift=d*m.shift,n.upperShiftX=n.upperShift*p,n.upperShiftZ=n.upperShift*f,n.comShift=d*e.comShift,n.comX=n.comShift*p,n.comZ=n.comShift*f,n.pelvisBack=d*m.back,n.drop=d*m.drop,n.knee=d*m.knee,n.hip=d*m.hip,n.arm=d*m.arm,n.flash=e.flashStrength*r,n}function Nd(i,t){const e=Math.max(0,t.pelvisTiltGain),n=Math.max(0,t.pelvisShift),s=Number.isFinite(i.leanForward)?i.leanForward:0,a=Number.isFinite(i.leanSide)?i.leanSide:0,r=Number.isFinite(i.speedRatio)?Math.max(0,Math.min(1,i.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*n,pelvisZ:s*n,crouch:Math.max(0,t.moveCrouch)*r}}const oi=1e-6;function gs(i,t,e){return i<t?t:i>e?e:i}function Lx(i,t,e,n=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=oi||a<=oi||!Number.isFinite(i.x)||!Number.isFinite(i.y)||!Number.isFinite(i.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+oi,l=Math.hypot(i.x,i.y,i.z);if(l<=oi)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(i.x,-i.y),f=Math.hypot(i.x,i.y),p=i.z,d=Math.hypot(p,f),m=gs(d,c,o),_=d>o+oi||d<c-oi,g=Math.atan2(-p,Math.max(f,oi)),u=gs((s*s+m*m-a*a)/(2*s*m),-1,1),x=gs((a*a+m*m-s*s)/(2*a*m),-1,1),S=Math.acos(u),v=Math.acos(x),L=n>=0?1:-1;return{rootPitch:g-L*S,rootRoll:h,jointPitch:L*(S+v),clamped:_,reach:l/o}}function Ix(i,t,e,n){const s=gs(e,0,1),a=Math.max(0,n),r=(o,c)=>{const l=gs((c-o)*s,-a,a);return o+l};return{rootPitch:r(i.rootPitch,t.rootPitch),rootRoll:r(i.rootRoll,t.rootRoll),jointPitch:r(i.jointPitch,t.jointPitch)}}function zd(i,t){return{pelvisPos:i.position.clone(),pelvisRotX:i.rotation.x,pelvisRotZ:i.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const ic={active:!1,weight:0,clamped:0,maxError:0};function Od(i){const{root:t,pelvis:e,lower:n,limbs:s,base:a,cfg:r}=i;if(!r.enabled||r.weight<=0||!i.grounded||s.length===0)return{...ic};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:n.position.clone(),lowerRotZ:n.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,n.position.copy(a.lowerPos),n.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(d=>d.tip.getWorldPosition(new X));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,n.position.copy(o.lowerPos),n.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),n.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(i.attacking?Math.max(0,Math.min(1,r.attackScale)):1),h=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let f=0;for(let d=0;d<s.length;d++){const m=s[d],_=n.worldToLocal(c[d].clone()),g={x:_.x-m.root.position.x,y:_.y-m.root.position.y,z:_.z-m.root.position.z},u=Lx(g,m.upperLen,m.lowerLen,m.bend);u.clamped&&(f+=1);const x=Ix({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},u,l,h);m.root.rotation.x=x.rootPitch,m.root.rotation.z=x.rootRoll,m.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let p=0;for(let d=0;d<s.length;d++){const m=s[d].tip.getWorldPosition(new X);p=Math.max(p,m.distanceTo(c[d]))}return{active:!0,weight:l,clamped:f,maxError:p}}function gn(i,t,e){return i<t?t:i>e?e:i}const kx={idle:"IDLE",wander:"WANDER",follow:"FOLLOW","keep-distance":"KEEP DIST",attack:"ATTACK"};function Ux(i,t,e,n,s,a,r,o,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Te,p=new Te;p.name="pelvis",p.position.y=i.legLength,f.add(p);const d=new Te;d.name="lower";const m=new Te;m.name="upper",p.add(d),p.add(m);const _=[],g=(U,Q,et,K)=>{const lt=new Ms({color:K}),ut=new fe(new En(U,Q,et),lt);return ut.castShadow=!0,ut.receiveShadow=!0,_.push(lt),ut},u=i.headSize,x=i.legLength,S=i.armLength,v=i.limbThickness,L=i.bodyHeight,R=i.bodyWidth,C=g(R,L,.28,e);C.position.y=L/2,m.add(C);const D=new Te;D.position.y=L,m.add(D);const b=g(u,u,u,e);b.position.y=u/2,D.add(b);for(const U of[-1,1]){const Q=g(.06,.07,.02,t.shoe);Q.position.set(U*.09,u/2+.03,u/2+.011),D.add(Q)}const y=(U,Q)=>{const et=Q?S:x,K=new Te;K.name=Q?U<0?"shoulderL":"shoulderR":U<0?"hipL":"hipR",Q||(K.rotation.order="ZYX"),K.position.set(U*(Q?R/2+v/2:R/2-v/2),Q?L-.04:0,0),(Q?m:d).add(K);const lt=g(v,et/2,v,t.limb);lt.position.y=-et/4,K.add(lt);const ut=new Te;ut.name=Q?"elbow":"knee",ut.position.y=-et/2,K.add(ut);const Wt=g(v,et/2,v,t.limb);if(Wt.position.y=-et/4,ut.add(Wt),!Q){const ft=g(v*1.15,.07,v*1.7,t.shoe);ft.position.set(0,-et/2+.035,.045),ut.add(ft);const bt=new xe;return bt.name="footTip",bt.position.y=-et/2,ut.add(bt),{root:K,joint:ut,tip:bt}}return{root:K,joint:ut}},P=y(-1,!1),G=y(1,!1),F=y(-1,!0),W=y(1,!0),T=[P,G].map(U=>({root:U.root,joint:U.joint,tip:U.tip,upperLen:x/2,lowerLen:x/2,bend:1})),A=new _n({color:s.attackArcColor,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),B=new fe(new ka(.62,.042,6,20,Math.PI*1.1),A);B.position.set(0,.78-x,.56),m.add(B);const O=document.createElement("canvas");O.width=256,O.height=72;const $=O.getContext("2d"),it=new cx(O),mt=new Ad({map:it,transparent:!0,depthTest:!1,depthWrite:!1}),ct=new rx(mt);ct.scale.set(1.85,.52,1),ct.position.y=1.7-x,ct.renderOrder=20,m.add(ct);function gt(U){$&&($.clearRect(0,0,256,72),$.fillStyle=s.labelBg,$.fillRect(0,0,256,72),$.strokeStyle=e,$.lineWidth=5,$.strokeRect(3,3,250,66),$.fillStyle=e,$.font="bold 29px ui-monospace, Menlo, Consolas, monospace",$.textAlign="center",$.textBaseline="middle",$.fillText(`${n} ${kx[U]}`,128,38),it.needsUpdate=!0)}const Y=new qt(e),nt=new qt(o.flashColor),ot=new qt;let rt=null,xt=0,Ct=0,Lt=0,Ht=0,wt=0,It=0,k=0,re={...ic},Rt=-1,Pt=0,q=0,ht=0,pt=0,w=0,M=0,N=0;return{group:f,update(U,Q){f.position.set(U.position.x,U.position.y,U.position.z),f.rotation.y=U.bodyYaw,D.rotation.y=(U.headYaw-U.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,U.mode!==rt&&(rt=U.mode,gt(U.mode),xt=1),xt=Math.max(0,xt-Q*2.2);const et=U.hurt,K=Fd(et,U.bodyYaw,o),lt=K.flash;ot.copy(nt).multiplyScalar(lt);for(const Dt of _)Dt.emissive.copy(Y).multiplyScalar(xt*.5),lt>0&&Dt.emissive.add(ot);p.position.set(0,x,0),p.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),d.position.set(0,0,0),d.rotation.z=0;const ut=Math.hypot(U.velocity.x,U.velocity.z),Wt=Math.cos(U.bodyYaw),ft=-Math.sin(U.bodyYaw),bt=ut>1e-6?gn((U.velocity.x*Wt+U.velocity.z*ft)/ut,-1,1):0,z=Id(bt,r.strafeHipScale,r.strafeHipMaxDeg,r.strafeHipBoost);N+=(z-N)*(1-Math.exp(-12*Math.max(0,Q))),d.rotation.y=N;const st=U.bodyYaw+N,dt=Math.sin(st),kt=Math.cos(st),Ut=Math.cos(st),Xt=-Math.sin(st),I=U.velocity.x*dt+U.velocity.z*kt,Mt=U.velocity.x*Ut+U.velocity.z*Xt,j=Math.max(0,r.stopBlendSec||0),at=j>0,Et=ut>a*.78;!at||Et?Rt=-1:ut>1e-6&&ut<a*.5&&Rt<0&&(Rt=0,Pt=U.gaitPhase,q=Dd(U.gaitPhase),ht=ut,pt=Math.max(U.stride,1e-6),w=I,M=Mt);const St=at&&Rt>=0;St&&(Rt=Math.min(1,Rt+Q/j));const Gt=St?{phase:Pt,speed:ht,moveSpeed:a,localForward:w,localRight:M,legLength:i.legLength,stride:pt,grounded:!0}:{phase:U.gaitPhase,speed:ut,moveSpeed:a,localForward:I,localRight:Mt,legLength:i.legLength,stride:U.stride,grounded:!0},Zt=St?Ld(Gt,r,{progress:Rt,phase0:Pt,phaseEnd:q}):nc(Gt,r);P.root.rotation.x=Zt.legL.pitchX,G.root.rotation.x=Zt.legR.pitchX,P.root.rotation.z=Zt.legL.rollZ,G.root.rotation.z=Zt.legR.rollZ,P.joint.rotation.x=Zt.legL.kneeX,G.joint.rotation.x=Zt.legR.kneeX,F.root.rotation.x=Zt.armL,W.root.rotation.x=Zt.armR,F.joint.rotation.x=-.18,W.joint.rotation.x=-.18,p.position.x=Zt.pelvisX,p.position.y=x+Zt.pelvisY,p.rotation.z=Zt.pelvisRoll,m.rotation.z=Zt.sideLean*(K.intensity>0?.4:1);const ie=zd(p,d);if(c){const Dt=Math.max(.004166666666666667,Math.min(Q,.1)),$t=Math.sin(U.bodyYaw),Ot=Math.cos(U.bodyYaw),Qt=gn((U.velocity.x-Ct)/Dt,-60,60),me=gn((U.velocity.z-Lt)/Dt,-60,60),Le=Qt*$t+me*Ot,se=Sn(U.bodyYaw-Ht)/Dt,ye=c.maxForwardDeg*Math.PI/180,Re=c.maxSideDeg*Math.PI/180,Ze=1-Math.exp(-Math.max(0,c.smoothing)*Dt);wt+=(gn(Le*c.accelGain,-ye,ye)-wt)*Ze,It+=(gn(-se*ut*c.turnGain,-Re,Re)-It)*Ze;const wn=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;k+=(gn(ut/Math.max(a,1e-6),0,1)-k)*(1-Math.exp(-Math.max(0,wn)*Dt));const un=Nd({leanForward:wt,leanSide:It,speedRatio:k},c);m.rotation.x+=wt,m.rotation.z+=It,p.rotation.x+=un.pelvisPitch,p.rotation.z+=un.pelvisRoll,p.position.x+=un.pelvisX,p.position.z+=un.pelvisZ,p.position.y-=un.crouch;const ns=h.enabled?gn(h.weight,0,1):0;d.position.y+=un.crouch*(1-ns)}Ct=U.velocity.x,Lt=U.velocity.z,Ht=U.bodyYaw,m.rotation.x+=K.upperPitch,m.rotation.z+=K.upperRoll,m.rotation.y+=K.upperYaw;const Z=gn(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),_t=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=gn(K.upperShiftX*Z,-_t,_t),m.position.z+=gn(K.upperShiftZ*Z,-_t,_t),p.position.x+=K.comX,p.position.z+=K.comZ-K.pelvisBack,p.position.y-=K.drop;const yt=K.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(d.position.z+=K.pelvisBack*(1-yt),d.position.y+=K.drop*(1-yt),P.joint.rotation.x+=K.knee,G.joint.rotation.x+=K.knee,P.root.rotation.x-=K.hip,G.root.rotation.x-=K.hip,F.root.rotation.x+=K.arm,W.root.rotation.x+=K.arm*.8,U.attackPhase!=="idle"&&K.intensity===0){const Dt=U.attackProgress,$t=Dt<.34?-1:Dt<.68?-1+(Dt-.34)/.34*2:Math.max(0,1-(Dt-.68)/.32),Ot=Math.max(0,-$t),Qt=Math.max(0,$t);W.root.rotation.x=-1.7*Ot+1.25*Qt,W.joint.rotation.x=-(.25+Ot*.45),m.rotation.y=-.28*$t,A.opacity=U.attackPhase==="active"?.85:0,U.attackPhase==="active"&&(B.rotation.z=-1.1+Dt*3)}else A.opacity=0;re=Od({root:f,pelvis:p,lower:d,limbs:T,base:ie,cfg:h,grounded:!0,attacking:U.attackPhase!=="idle"})},ik(){return re},dispose(){f.traverse(U=>{if(U instanceof fe){U.geometry.dispose();const Q=U.material;Array.isArray(Q)?Q.forEach(et=>et.dispose()):Q.dispose()}}),it.dispose(),mt.dispose()}}}function Bd(i){return{x:0,y:0,z:1}}function Fx(i){return Math.asin(Bd().y)}function Nx(i,t){const e=Math.cos(t),n=Math.sin(t);return{x:i.x*e+i.z*n,y:i.y,z:-0*n+i.z*e}}function Ue(i,t,e){return i<t?t:i>e?e:i}const na=1e-6;function ge(i,t,e,n){const s=new fe(new En(i,t,e),new Ms({color:n}));return s.castShadow=!0,s.receiveShadow=!0,s}function be(){return new Te}function ua(i,t,e){const n=be(),s=ge(t*.7,.12,t*.7,e.wood);s.position.y=.06,n.add(s);const a=ge(t*2.4,.045,t*.8,e.metal);a.position.y=.13,n.add(a);const r=ge(t*.38,i,t,e.blade);r.position.y=.13+i/2,n.add(r);const o=ge(t*.42,i*.96,t*.2,e.bladeEdge);o.position.set(0,.13+i/2,t*.5),n.add(o);const c=ge(t*.3,.09,t*.45,e.blade);return c.position.y=.13+i+.045,n.add(c),n}function zx(i){const t=ua(.72,.15,i),e=ge(.12,.46,.12,i.wood);return e.position.y=-.3,t.add(e),t}function Ox(i){const t=be(),e=ge(.32,.38,.06,i.metal);e.position.set(0,.02,.1),t.add(e);const n=ge(.11,.11,.045,i.blade);return n.position.set(0,.02,.145),t.add(n),t}function Bx(i){const t=be(),e=ge(.055,.88,.055,i.wood);e.position.y=.42,t.add(e);const n=ge(.15,.15,.15,i.glow);n.position.y=.92;const s=n.material;return s.emissive=new qt(i.glow),s.emissiveIntensity=.85,t.add(n),{g:t,orb:n}}function Hx(i){const t=be();for(let n=0;n<5;n++){const s=(n-2)*.15,a=ge(.055,.16,.05,i.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ge(.014,.66,.014,i.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Gx(i){const t=be(),e=ge(.025,.025,.46,i.wood);e.position.z=.23,t.add(e);const n=ge(.055,.055,.09,i.blade);return n.position.z=.5,t.add(n),t}function Vx(i,t,e,n,s,a,r,o,c,l,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},p=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},d=be(),m=be();m.name="pelvis",m.position.y=i.legLength,d.add(m);const _=be();_.name="lower";const g=be();g.name="upper",m.add(_),m.add(g);const u=i.headSize,x=i.legLength,S=i.armLength,v=i.limbThickness,L=i.bodyHeight,R=i.bodyWidth,C=ge(R,L,.28,t.body);C.position.y=L/2,g.add(C);const D=be();D.position.y=n.headPivotHeight,g.add(D);const b=ge(u,u,u,t.head);b.position.y=u/2,D.add(b);const y=new Ms({color:"#1b2733"});for(const Z of[-1,1]){const _t=new fe(new En(.06,.07,.02),y);_t.position.set(Z*.09,u/2+.03,u/2+.011),D.add(_t)}const P=Z=>{const _t=be();_t.name=Z<0?"hipL":"hipR",_t.rotation.order="ZYX",_t.position.set(Z*(R/2-v/2),0,0),_.add(_t);const yt=ge(v,x/2,v,t.limb);yt.position.y=-x/4,_t.add(yt);const Dt=be();Dt.name="knee",Dt.position.y=-x/2,_t.add(Dt);const $t=ge(v,x/2,v,t.limb);$t.position.y=-x/4,Dt.add($t);const Ot=ge(v*1.15,.07,v*1.7,t.shoe);Ot.position.set(0,-x/2+.035,.045),Dt.add(Ot);const Qt=new xe;return Qt.name="footTip",Qt.position.y=-x/2,Dt.add(Qt),{root:_t,joint:Dt,hand:be(),tip:Qt}},G=Z=>{const _t=be();_t.name=Z<0?"shoulderL":"shoulderR",_t.position.set(Z*(R/2+v/2),L-.04,0),g.add(_t);const yt=ge(v,S/2,v,t.limb);yt.position.y=-S/4,_t.add(yt);const Dt=be();Dt.name="elbow",Dt.position.y=-S/2,_t.add(Dt);const $t=ge(v,S/2,v,t.limb);$t.position.y=-S/4,Dt.add($t);const Ot=be();Ot.position.y=-S/2,Dt.add(Ot);const Qt=ge(v*1.1,.09,v*1.1,t.head);return Qt.position.y=.045,Ot.add(Qt),{root:_t,joint:Dt,hand:Ot}},F=P(-1),W=P(1),T=G(-1),A=G(1),B=[F,W].map(Z=>({root:Z.root,joint:Z.joint,tip:Z.tip,upperLen:x/2,lowerLen:x/2,bend:1})),O=be(),$=be();A.hand.add(O),T.hand.add($);const it=Bx(t),mt=Hx(t),ct=Gx(t),gt={"sword-shield":{right:ua(.42,.075,t),left:Ox(t)},"dual-swords":{right:ua(.42,.075,t),left:ua(.42,.075,t)},greatsword:{right:zx(t),left:ge(.12,.2,.12,t.wood)},staff:{right:it.g,left:be(),orb:it.orb},bow:{right:ct,left:mt.g,arrow:ct,drawString:mt.drawString}};for(const Z of Object.keys(gt))O.add(gt[Z].right),$.add(gt[Z].left),gt[Z].right.visible=!1,gt[Z].left.visible=!1;let Y=null,nt=0,ot=0,rt=0,xt=0,Ct=0,Lt=0,Ht=Rx(),wt={...ic},It=0,k=0,re=0,Rt=-1,Pt=0,q=0,ht=0,pt=0,w=0,M=0,N=0,U=0,Q=1,et={speed:0,phase:0},K={lp:0,lr:0,rp:0,rr:0},lt=0,ut=0,Wt=!0,ft=0,bt="none",z=0,st=0,dt=0,kt=.3,Ut=0;function Xt(Z){const _t=Math.PI/180,yt=a;let Dt=0,$t=0,Ot=0,Qt=0;Z==="sword-shield"?(Dt=yt.swordPitchDeg*_t,$t=-yt.swordYawDeg*_t,Ot=yt.shieldPitchDeg*_t):Z==="dual-swords"?(Dt=yt.swordPitchDeg*_t,$t=-yt.swordYawDeg*_t,Ot=yt.swordPitchDeg*_t,Qt=yt.swordYawDeg*_t):Z==="greatsword"?(Dt=yt.greatswordPitchDeg*_t,$t=-yt.greatswordYawDeg*_t,Ot=yt.greatswordPitchDeg*_t,Qt=yt.greatswordYawDeg*_t):Z==="staff"?Dt=yt.staffPitchDeg*_t:Ot=yt.bowPitchDeg*_t,O.rotation.set(Dt,0,$t),$.rotation.set(Ot,0,Qt)}function I(Z){if(Z!==Y){Y=Z;for(const _t of Object.keys(gt))gt[_t].right.visible=_t===Z,gt[_t].left.visible=_t===Z;Xt(Z),mt.drawString.position.z=-.06,ct.position.z=0,it.orb.scale.setScalar(1),g.rotation.y=0}}I("sword-shield");const Mt=[];d.traverse(Z=>{Z instanceof fe&&Z.material instanceof Ms&&Mt.push(Z.material)});const j=new qt(o.flashColor);function at(Z,_t){const yt=Fd(Z,_t,o);Ht=yt,g.rotation.x+=yt.upperPitch,g.rotation.z+=yt.upperRoll,g.rotation.y+=yt.upperYaw;const Dt=Ue(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),$t=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Ue(yt.upperShiftX*Dt,-$t,$t),g.position.z+=Ue(yt.upperShiftZ*Dt,-$t,$t),m.position.x+=yt.comX,m.position.z+=yt.comZ-yt.pelvisBack,m.position.y-=yt.drop;const Ot=yt.legacy?0:Ue(o.lowerScale,0,1);_.position.z+=yt.pelvisBack*(1-Ot),_.position.y+=yt.drop*(1-Ot),F.joint.rotation.x+=yt.knee,W.joint.rotation.x+=yt.knee,F.root.rotation.x-=yt.hip,W.root.rotation.x-=yt.hip,T.root.rotation.x+=yt.arm,A.root.rotation.x+=yt.arm*.8;for(const Qt of Mt)Qt.emissive.copy(j).multiplyScalar(yt.flash)}function Et(Z){return Z<.3?-1:Z<.62?-1+(Z-.3)/.32*2:Math.max(0,1-(Z-.62)/.38)}function St(Z){if(Z.phase==="idle"||Z.charging)return;const _t=Z.attackProgress,yt=Et(_t),Dt=Math.max(0,yt),$t=Z.comboIndex%2===0?1:-1,Ot=c.stride,Qt=Number.isFinite(Ot.stepReach)?Ot.stepReach:.17,me=Number.isFinite(Ot.stepSideReach)?Ot.stepSideReach:.14,Le=Number.isFinite(Ot.stepDipReach)?Ot.stepDipReach:.05,se=Z.weapon==="greatsword"?Ue(Number.isFinite(Ot.heavyScale)?Ot.heavyScale:1,0,1):1;m.position.z+=Qt*Dt*se,m.position.x+=$t*me*Dt*se,m.position.y-=Le*Math.sin(Math.PI*_t)*se}function Gt(Z){if(mt.drawString.position.z=-.06,ct.position.z=0,it.orb.scale.setScalar(1),g.rotation.y=0,Z.charging&&Z.weapon==="bow"){const $t=Z.charge;T.root.rotation.x=-1.25,T.joint.rotation.x=-.15,A.root.rotation.x=.35+$t*.3,A.joint.rotation.x=-1.15,mt.drawString.position.z=-.06-$t*.22,ct.position.z=-$t*.3,g.rotation.y=-.22;return}if(Z.phase==="idle")return;const _t=Et(Z.attackProgress),yt=Math.max(0,-_t),Dt=Math.max(0,_t);if(Z.weapon==="bow")T.root.rotation.x=-1.2,T.joint.rotation.x=-.15,A.root.rotation.x=.9-Dt*.8,A.joint.rotation.x=-.3;else if(Z.weapon==="greatsword"){const $t=-1.6*yt+1.25*Dt,Ot=Ue(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);A.root.rotation.x=$t,A.joint.rotation.x=-(.25+yt*.4),T.root.rotation.x=$t+.06,T.joint.rotation.x=-(.32+yt*.4),T.root.rotation.z=.38,g.rotation.y=-.2*_t*Ot}else{const $t=Z.comboIndex;if($t===1)A.root.rotation.x=-1.7*yt+1.1*Dt,A.joint.rotation.x=-(.2+yt*.5),T.root.rotation.x=.1,g.rotation.y=-.18*_t;else if($t===2)T.root.rotation.x=-1.5*yt+1*Dt,T.joint.rotation.x=-(.2+yt*.5),A.root.rotation.x=.2,g.rotation.y=.45*-_t;else{const Ot=-1.9*yt+1.2*Dt;T.root.rotation.x=Ot,A.root.rotation.x=Ot,T.joint.rotation.x=-(.15+yt*.4),A.joint.rotation.x=-(.15+yt*.4),g.rotation.y=-.3*_t}}St(Z)}function Zt(Z,_t){Z&&(A.root.rotation.x=-1.05,A.joint.rotation.x=-.35,T.root.rotation.x=-.45,T.joint.rotation.x=-.2,g.rotation.y=-.12,it.orb.scale.setScalar(1.25+.12*Math.sin(_t*2)))}function ie(Z){if(!Z||Z.phase==="idle")return;const _t=Z.progress,yt=_t<.3?-.35+_t/.3*1.35:_t<.7?1:Math.max(0,1-(_t-.7)/.3),Dt=Math.PI/180;g.rotation.x+=p.leanDeg*Dt*yt,T.root.rotation.x-=p.shieldPitchDeg*Dt*yt,T.joint.rotation.x-=.22*yt,A.root.rotation.x-=.3*yt,m.position.z+=p.pelvisReach*Math.max(0,yt)}return{group:d,update(Z,_t,yt,Dt,$t=!1,Ot,Qt){I(_t.weapon),g.rotation.x=0,g.rotation.z=0,m.position.x=0,m.position.y=x,m.position.z=0,m.rotation.z=0,m.rotation.x=0,g.position.x=0,g.position.y=0,g.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const me=Math.max(1/240,Math.min(Dt,.1)),Le=Ot===void 0?lt+=Dt:Ot;ut=Le;const se=c.landing;se.enabled?Wt&&!Z.grounded?(bt="jump",z=Le,st=se.anticipationDuration,dt=Math.max(0,se.jumpAnticipation),kt=.32):!Wt&&Z.grounded&&(bt="land",z=Le,st=se.duration,dt=Tx(ft,se),kt=se.compressRatio,Ut=ft):(bt="none",dt=0),Le<z&&(bt="none",dt=0),Wt=Z.grounded,ft=Z.velocity.y;const ye=Fl(Le,z,st,dt,kt),Re=_t.phase!=="idle";N=Ex(N,Re,me,c.attack.blendRate);const Ze=wx(N,c.attack.gaitWeight,c.attack.lowerBodyWeight);U=Ze.attackLegWeight,Q=Ze.gaitScale;const wn=Math.sin(Z.bodyYaw),un=Math.cos(Z.bodyYaw),ns=(Z.velocity.x-nt)/me,Ua=(Z.velocity.z-ot)/me,E=Ue(ns,-60,60),H=Ue(Ua,-60,60),J=E*wn+H*un,tt=Sn(Z.bodyYaw-rt)/me,V=Math.hypot(Z.velocity.x,Z.velocity.z),vt=r.maxForwardDeg*Math.PI/180,Tt=r.maxSideDeg*Math.PI/180,Ft=Ue(J*r.accelGain,-vt,vt),Nt=Ue(-tt*V*r.turnGain,-Tt,Tt),Yt=1-Math.exp(-r.smoothing*me);xt+=(Ft-xt)*Yt,Ct+=(Nt-Ct)*Yt,nt=Z.velocity.x,ot=Z.velocity.z,rt=Z.bodyYaw;const Vt=Math.hypot(Z.velocity.x,Z.velocity.z),zt=Math.cos(Z.bodyYaw),ee=-Math.sin(Z.bodyYaw),oe=Z.velocity.x*zt+Z.velocity.z*ee,he=Vt>na?Ue(oe/Vt,-1,1):0,Ce=Id(he,n.legYawScale,n.hipYawMaxDeg,s.strafeHipBoost);k+=(Ce-k)*(1-Math.exp(-n.hipYawSmoothing*me));const te=Z.bodyYaw+k;re=te;const Bt=Math.sin(te),en=Math.cos(te),ae=Math.cos(te),Xe=-Math.sin(te),nn={speed:Vt,phase:Z.gaitPhase,localForward:Z.velocity.x*Bt+Z.velocity.z*en,localRight:Z.velocity.x*ae+Z.velocity.z*Xe},Se=Re?Sx(nn,_t.attackProgress,_t.comboIndex,N,c.stride):nn;et=Se;const Bn=Math.max(0,s.stopBlendSec||0),ce=Bn>0&&!Re&&Z.grounded,qe=Vt>e*.78;!ce||qe?Rt=-1:Vt>na&&Vt<e*.5&&Rt<0&&(Rt=0,Pt=Z.gaitPhase,q=Dd(Z.gaitPhase),ht=Vt,pt=Math.max(Z.stride,na),w=nn.localForward,M=nn.localRight);const An=ce&&Rt>=0;An&&(Rt=Math.min(1,Rt+me/Bn));const Ie=An?{phase:Pt,speed:ht,moveSpeed:e,localForward:w,localRight:M,legLength:i.legLength,stride:pt,grounded:!0}:{phase:Se.phase,speed:Se.speed,moveSpeed:e,localForward:Se.localForward,localRight:Se.localRight,legLength:i.legLength,stride:Re?0:Z.stride,grounded:Z.grounded},fn=An?Ld(Ie,s,{progress:Rt,phase0:Pt,phaseEnd:q}):nc(Ie,s),ue=Ax(fn,Ze.gaitScale);K={lp:ue.legL.pitchX,lr:ue.legL.rollZ,rp:ue.legR.pitchX,rr:ue.legR.rollZ},Z.grounded?(F.root.rotation.x=ue.legL.pitchX,W.root.rotation.x=ue.legR.pitchX,F.root.rotation.z=ue.legL.rollZ,W.root.rotation.z=ue.legR.rollZ,F.joint.rotation.x=ue.legL.kneeX,W.joint.rotation.x=ue.legR.kneeX,T.root.rotation.x=ue.armL,A.root.rotation.x=ue.armR,T.joint.rotation.x=-(.18+ue.armL*.2),A.joint.rotation.x=-(.18+ue.armR*.2),T.root.rotation.z=0,A.root.rotation.z=0,m.position.x=ue.pelvisX,m.position.y=x+ue.pelvisY,m.rotation.z=ue.pelvisRoll):(F.root.rotation.x=-.55,W.root.rotation.x=-.25,F.joint.rotation.x=.75,W.joint.rotation.x=.55,T.root.rotation.x=-.9,A.root.rotation.x=-.7,T.joint.rotation.x=-.6,A.joint.rotation.x=-.6,F.root.rotation.z=0,W.root.rotation.z=0);const Es=zd(m,_),Hd=Vt/Math.max(e,na),Gd=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,Vd=1-Math.exp(-Math.max(0,Gd)*me);It+=(Ue(Hd,0,1)-It)*Vd;const vi=Nd({leanForward:xt,leanSide:Ct,speedRatio:It},r);m.rotation.x+=vi.pelvisPitch,m.rotation.z+=vi.pelvisRoll,m.position.x+=vi.pelvisX,m.position.z+=vi.pelvisZ,m.position.y-=vi.crouch;const Xd=f.enabled&&Z.grounded?Ue(f.weight,0,1)*(Re?Ue(f.attackScale,0,1):1):0;_.position.y+=vi.crouch*(1-Ue(Xd,0,1)),Gt(_t),Zt($t,Z.gaitPhase),ie(Qt);const Wd=a.greatswordPitchDeg*Math.PI/180,sc=_t.weapon==="greatsword",ac=Math.hypot(Z.velocity.x,Z.velocity.z),$d=sc&&_t.phase==="idle"&&ac>.5?Math.min(1.15,ac/Math.max(e,.001)*.9):0;Lt+=($d-Lt)*(1-Math.exp(-6*me)),sc&&(O.rotation.x=Wd+Lt),_t.weapon==="bow"&&(mt.g.rotation.x=-(T.root.rotation.x+T.joint.rotation.x),ct.rotation.x=-(A.root.rotation.x+A.joint.rotation.x));const Yd=g.rotation.y;at(yt,Z.bodyYaw);const rc=yt.type==="none"?1:.4;if(g.rotation.x+=xt*rc,g.rotation.z+=(Ct+ue.sideLean)*rc,ye>0&&(F.root.rotation.x-=se.hipPitch*ye,W.root.rotation.x-=se.hipPitch*ye,F.joint.rotation.x+=se.kneeBend*ye,W.joint.rotation.x+=se.kneeBend*ye,m.position.y-=se.crouchDepth*ye,_.position.y+=se.crouchDepth*(1-se.lowerScale)*ye,g.rotation.x+=se.upperPitch*ye,T.root.rotation.x-=se.armTuck*ye,A.root.rotation.x-=se.armTuck*ye),U>0&&Z.grounded){const Tn=bx(_t.attackProgress,_t.comboIndex,c.stride),Rn=U;F.root.rotation.x+=Tn.legL.pitchX*Rn,W.root.rotation.x+=Tn.legR.pitchX*Rn,F.root.rotation.z+=Tn.legL.rollZ*Rn,W.root.rotation.z+=Tn.legR.rollZ*Rn,F.joint.rotation.x+=Tn.legL.kneeX*Rn,W.joint.rotation.x+=Tn.legR.kneeX*Rn,m.position.x+=Tn.pelvisX*Rn,m.position.y+=Tn.pelvisY*Rn,m.rotation.z+=Tn.pelvisRoll*Rn}_.rotation.y=k;const Zd=Yd;D.rotation.y=Sn(Z.headYaw-Z.bodyYaw-Zd),wt=Od({root:d,pelvis:m,lower:_,limbs:B,base:Es,cfg:f,grounded:Z.grounded,attacking:Re})},lean(){return{forward:xt,side:Ct}},landing(){const Z=Fl(ut,z,st,dt,kt),_t=st>0?Math.max(0,st-Math.max(0,ut-z)):0;return{pulse:Z,remaining:_t,kind:Z>0?bt:"none",impactVy:Ut}},hurt(){return Ht},ik(){return wt},attackBlend(){return N},attackWeights(){return{gaitScale:Q,attackLegWeight:U,driveSpeed:et.speed,stridePhase:et.phase}},hipYaw(){return k},gaitDebug(){return{stopT:Rt,hipYaw:k,legLPitch:K.lp,legLRoll:K.lr,legRPitch:K.rp,legRRoll:K.rr}},gaitYaw(){return re},arrowDirection(){ct.updateWorldMatrix(!0,!1);const Z=ct.matrixWorld.elements,_t=Z[8],yt=Z[9],Dt=Z[10],$t=Math.hypot(_t,yt,Dt)||1;return{x:_t/$t,y:yt/$t,z:Dt/$t}},dispose(){d.traverse(Z=>{if(Z instanceof fe){Z.geometry.dispose();const _t=Z.material;Array.isArray(_t)?_t.forEach(yt=>yt.dispose()):_t.dispose()}})}}}function Xx(i,t){switch(i){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function Wx(i,t,e){const n=Math.max(1,i.clientWidth),s=Math.max(1,i.clientHeight),a=new ix({antialias:!0});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.shadowMap.enabled=!0,a.shadowMap.type=jl,a.setSize(n,s,!1),i.appendChild(a.domElement);const r=new sx;r.background=new qt("#12161d"),r.add(new dx(11061486,2764600,1.15));const o=new fx(16773852,1.5);o.position.set(9,18,11),o.castShadow=!0,o.shadow.mapSize.set(1024,1024);const c=o.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(o);const l=[],h=new Te;for(const q of t.boxes){const ht=q.maxX-q.minX,pt=q.maxY-q.minY,w=q.maxZ-q.minZ;let M=Xx(q.kind,e);q.kind==="step"&&(M=new qt(M).offsetHSL(0,0,q.maxY*.09).getStyle());const N=new Ms({color:M,transparent:!0,opacity:1}),U=new fe(new En(ht,pt,w),N);U.position.set((q.minX+q.maxX)/2,(q.minY+q.maxY)/2,(q.minZ+q.maxZ)/2),U.castShadow=q.kind!=="ground",U.receiveShadow=!0,U.add(new Rd(new lx(U.geometry),new Qo({color:10467020,transparent:!0,opacity:.32}))),h.add(U),l.push(N)}r.add(h);const f=t.gridMeta.maxX-t.gridMeta.minX,p=new mx(f,f,4873328,3358797);p.position.y=.002,p.visible=e.showGrid,r.add(p);const d=Vx(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),m=new Te,_=.9,g=new Te;g.position.y=_,d.group.position.y=-_,g.add(d.group),m.add(g),r.add(m);const u=t.dummies.map((q,ht)=>{const pt=e.dummies.colors,w=pt[ht%pt.length]??"#cccccc",M=Ux(e.voxel,e.colors,w,q.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return M.group.traverse(N=>{N.userData.dummyId=q.id}),r.add(M.group),M}),x=u.map(q=>q.group),S=new px,v=e.targeting.ringRadius,L=new _n({color:e.targeting.ringColor,transparent:!0,opacity:.9,side:Ne,depthWrite:!1}),R=new fe(new Vi(v-.07,v,28),L);R.rotation.x=-Math.PI/2,R.position.y=.03,R.visible=!1,r.add(R);const C=new Te;r.add(C);const D=new _n({color:12577023,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),b=new Te;b.position.set(0,.95,.72),C.add(b);const y=new Te;y.rotation.x=Fx(e.camera.pitchDeg),b.add(y);const P=new fe(new ka(.78,.045,6,24,Math.PI*1.15),D);y.add(P);const G=new ec(1,0),F=new _n({color:8381439,transparent:!0,opacity:.95,depthWrite:!1}),W=Array.from({length:16},()=>{const q=new fe(G,F);return q.visible=!1,r.add(q),q}),T=new Vi(.86,1,40),A=Array.from({length:6},()=>{const q=new _n({color:10146047,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),ht=new fe(T,q);return ht.rotation.x=-Math.PI/2,ht.visible=!1,r.add(ht),{mesh:ht,mat:q}}),B=new _n({color:16769184,transparent:!0,opacity:0,depthWrite:!1}),O=new fe(new En(.035,.035,.5),B);C.add(O);const $=e.dash,it=new Vi($.ringRadius-.06,$.ringRadius,28),mt=Array.from({length:6},()=>{const q=new _n({color:16777215,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),ht=new fe(it,q);return ht.rotation.x=-Math.PI/2,ht.visible=!1,r.add(ht),{mesh:ht,mat:q,life:0,base:1}});function ct(q,ht,pt,w,M){const N=mt.find(U=>U.life<=0)??mt[0];N.mat.color.set(w),N.mesh.position.set(q,pt+.04,ht),N.base=M,N.mesh.scale.setScalar(M*.6),N.mesh.visible=!0,N.mat.opacity=.9,N.life=$.fxDuration}const gt=e.links,Y=new Vi(gt.ringRadius-.07,gt.ringRadius,28),nt=Array.from({length:5},()=>{const q=new _n({color:gt.chargeColor,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),ht=new fe(Y,q);return ht.rotation.x=-Math.PI/2,ht.visible=!1,r.add(ht),{mesh:ht,mat:q,life:0,base:1}});function ot(q,ht,pt,w){const M=nt.find(N=>N.life<=0)??nt[0];M.mesh.position.set(q,pt+.05,ht),M.base=w,M.mesh.scale.setScalar(w*.55),M.mesh.visible=!0,M.mat.opacity=.85,M.life=gt.fxDuration}let rt=t.playerLink.id,xt=t.playerLink.hitIds.length,Ct=t.dash.id,Lt="none",Ht=0,wt=-1,It=1;const k=_x(e.camera,e.smartCamera,e.zoom,n/s),re=t.character.position;k.update(re.x,re.y,re.z,1,t.camera);function Rt(q,ht){if(x.length===0)return 0;const pt=a.domElement.getBoundingClientRect(),w=new jt((q-pt.left)/pt.width*2-1,-((ht-pt.top)/pt.height)*2+1);S.setFromCamera(w,k.camera);const M=S.intersectObjects(x,!0);for(const N of M){const U=N.object.userData.dummyId;if(U&&U>0)return U}return 0}function Pt(q,ht,pt){const w=a.domElement.getBoundingClientRect(),M=new X(q,ht,pt).project(k.camera);return{x:w.left+(M.x*.5+.5)*w.width,y:w.top+(-M.y*.5+.5)*w.height}}return{gaitDebug(){return d.gaitDebug()},render(q,ht){const pt=q.character,w=q.combat;m.position.set(pt.position.x,pt.position.y,pt.position.z),m.rotation.y=pt.bodyYaw;const M=q.dash.phase==="active"&&q.dash.kind==="roll",N=M&&q.dash.duration>0?Math.min(1,1-q.dash.timer/q.dash.duration):0;g.rotation.x=M?N*Math.PI*2:0,g.position.y=_-(M?.2*Math.sin(Math.PI*N):0),d.update(pt,w,q.playerHurt,ht,q.abilities.channeling,q.time,q.playerLink);for(let K=0;K<u.length;K++)q.dummies[K]&&u[K].update(q.dummies[K],ht);const U=q.targeting.hasTarget?q.dummies[q.targeting.targetId-1]:void 0;if(R.visible=!!U,U&&(R.position.set(U.position.x,U.position.y+.03,U.position.z),R.scale.setScalar(1+.07*Math.sin(q.time*6))),C.position.set(pt.position.x,pt.position.y,pt.position.z),C.rotation.y=w.phase!=="idle"?w.attackFacing:pt.bodyYaw,q.dash.id!==Ct){Ct=q.dash.id;const K=q.dash;Lt=K.kind,K.kind==="blink"?(ct(K.fromX,K.fromZ,pt.position.y,$.blinkColor,.9),ct(K.toX,K.toZ,pt.position.y,$.blinkColor,1.35)):ct(K.fromX,K.fromZ,pt.position.y,$.rollColor,1.1)}for(const K of mt){if(K.life<=0)continue;K.life-=ht;const lt=Math.max(0,K.life/$.fxDuration);K.mat.opacity=.9*lt,K.mesh.scale.setScalar(K.base*(.6+(1-lt)*1.2)),K.life<=0&&(K.mesh.visible=!1)}const Q=q.playerLink;Q.id!==rt&&(rt=Q.id,xt=Q.hitIds.length,ot(pt.position.x,pt.position.z,pt.position.y,1)),Q.hitIds.length>xt?(xt=Q.hitIds.length,ot(pt.position.x,pt.position.z,pt.position.y,1.35)):Q.hitIds.length<xt&&(xt=Q.hitIds.length);for(const K of nt){if(K.life<=0)continue;K.life-=ht;const lt=Math.max(0,K.life/Math.max(gt.fxDuration,1e-6));K.mat.opacity=.85*lt,K.mesh.scale.setScalar(K.base*(.55+(1-lt)*1.1)),K.life<=0&&(K.mesh.visible=!1)}w.attackId!==Ht&&(Ht=w.attackId,w.weapon==="bow"&&w.phase!=="idle"&&(wt=0,It=.6+w.lastCharge*.9));const et=w.phase==="active"&&w.comboIndex>0;D.opacity=et?.78:0,et&&(P.rotation.z=-1.2+w.attackProgress*3.2,P.scale.setScalar(.9+w.comboIndex*.13));for(let K=0;K<W.length;K++){const lt=q.abilities.projectiles[K],ut=W[K];ut.visible=!!lt,lt&&(ut.position.set(lt.x,lt.y,lt.z),ut.scale.setScalar(lt.radius),ut.rotation.y+=ht*6)}for(let K=0;K<A.length;K++){const lt=q.abilities.rings[K],ut=A[K];if(ut.mesh.visible=!!lt,lt){const Wt=Math.max(0,Math.min(1,lt.life/Math.max(lt.duration,1e-6)));ut.mesh.position.set(lt.x,.05,lt.z),ut.mesh.scale.setScalar(lt.radius),ut.mat.opacity=.25+.55*Wt}}if(wt>=0){wt+=ht;const K=wt*14*It;O.position.set(0,.85,.6+K),B.opacity=K<9?.95:0,K>=9&&(wt=-1)}else B.opacity=0;k.update(pt.position.x,pt.position.y,pt.position.z,ht,q.camera),a.render(r,k.camera)},resize(){const q=Math.max(1,i.clientWidth),ht=Math.max(1,i.clientHeight);a.setSize(q,ht,!1),k.resize(q/ht)},getGroundBasis(){return k.getGroundBasis()},setCollidersVisible(q){for(const ht of l)ht.opacity=q?.3:1,ht.wireframe=q,ht.needsUpdate=!0},setGridVisible(q){p.visible=q},setZoom(q){k.setZoom(q)},pickDummy:Rt,projectToScreen:Pt,diagnostics(){const q=Bd(e.camera.pitchDeg),ht=Nx(q,C.rotation.y);return{lean:d.lean(),slashNormal:ht,arrowForward:d.arrowDirection(),gait:{hipYaw:d.hipYaw(),gaitYaw:d.gaitYaw()},attackBlend:d.attackBlend(),attackWeights:d.attackWeights(),landing:d.landing(),hurt:d.hurt(),ik:d.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:g.rotation.x,activeRings:mt.filter(pt=>pt.life>0).length,lastKind:Lt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...k.smart()}}},dispose(){d.dispose();for(const q of u)q.dispose();R.geometry.dispose(),L.dispose(),P.geometry.dispose(),D.dispose(),G.dispose(),F.dispose(),T.dispose();for(const q of A)q.mat.dispose();O.geometry.dispose(),B.dispose();for(const q of mt)q.mat.dispose();it.dispose();for(const q of nt)q.mat.dispose();Y.dispose(),h.traverse(q=>{q instanceof fe&&q.geometry.dispose()}),a.dispose(),a.domElement.remove()}}}async function $x(i){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(i),!0}catch{}try{const t=document.createElement("textarea");t.value=i,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,i.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function Yx(i,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),n=URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=i,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),2e3)}function Zx(i,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const n=x=>e.querySelector(`#${x}`),s=n("diag-status"),a=n("diag-text"),r=n("diag-copy"),o=n("diag-json"),c=n("diag-clear"),l=n("diag-toggle"),h=n("diag-close"),f=n("diag-mask");let p=!1,d=!0,m=0;function _(){const x=i.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function g(x){p=x,e.hidden=!x,x?_():a.hidden=!0}function u(x){r.textContent=x,window.clearTimeout(m),m=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),g(!p)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),r.addEventListener("click",()=>{const x=i.summary();$x(x).then(S=>{S?(u("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),u("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=i.dump(),S=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);Yx(`harness-${x.meta.version}-${S}.json`,JSON.stringify(x)),u("已导出")}),c.addEventListener("click",()=>{i.clear(),a.hidden=!0,_(),u("已清空")}),l.addEventListener("click",()=>{d=!d,i.setEnabled(d),_()}),{tick(){const x=i.status();t==null||t.classList.toggle("is-alert",x.alert),p&&_()},isOpen:()=>p,close:()=>g(!1)}}const qx={intents:{...Nl},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function jx(){const i=document.getElementById("app"),t=document.getElementById("hud");if(!i||!t)throw new Error("缺少 #app / #hud 容器");const e=jh(Pu,Du),n=Wx(i,e,an),s=Jh(e),a=tf(t),r=nf(t,document.getElementById("hint")),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.15 · 11-07 00:28 · 诊断");const c=y=>String(y).padStart(2,"0"),l=new Date,h=wu({meta:{version:"v0.9.15",buildTime:"11-07 00:28",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=Zx(h,o),p=Ku({deadZone:()=>an.joystick.deadZone});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const d={timeScale:1,paused:!1,showColliders:an.showColliders,showGrid:an.showGrid};let m=1;const _=pu({maxRadiusPx:()=>an.joystick.maxRadiusPx,deadZone:an.joystick.deadZone,getBasis:()=>n.getGroundBasis(),zoom:()=>an.zoom}),g=Array.from(document.querySelectorAll(".wp[data-weapon]"));let u=e.combat.weapon;function x(y){if(y===u)return;u=y;const P=mi.indexOf(y)+1;for(const G of g)G.classList.toggle("is-active",Number(G.dataset.weapon)===P);L.refreshWeapon()}let S=qx,v=0;const L=Xu(e,an,d,{singleStep:()=>s.singleStep(S.intents),reset:()=>{m=1,s.singleStep({...Nl,resetPressed:!0})},resetZoom:()=>{m=1,n.setZoom(1)},onToggleColliders:y=>n.setCollidersVisible(y),onToggleGrid:y=>n.setGridVisible(y)});window.addEventListener("resize",()=>n.resize()),window.__harness={world:e,view:n,clock:s,input:_,viewConfig:an,getUserZoom:()=>m,getGestures:()=>S.gestures,getLastGesture:()=>S.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:p,dirAngles:()=>p.last(),gaitDebug:()=>n.gaitDebug()};let R=performance.now(),C=60,D=0;function b(y){const P=Math.min((y-R)/1e3,.1);R=y,P>0&&(C=C*.9+1/P*.1);const G=_.sample();G.intents.resetPressed&&(m=1),m=su(m,G.zoomScale,an.zoom.min,an.zoom.max),n.setZoom(m);let F=G.intents.dummyClickId;if(G.tap){const A=n.pickDummy(G.tap.x,G.tap.y);A>0&&(F=A)}F>0&&(v=F),S={...G,intents:{...G.intents,dummyClickId:v}};const W=s.frame(P,S.intents,d.timeScale,d.paused,()=>{const A=e.events;for(let B=0;B<A.length;B++)h.event(A[B],e.time)});W>0&&(v=0),h.sample(e,S,P*1e3,W);for(const A of S.gestures)h.gesture(A);y-D>250&&(D=y,f.tick()),x(e.combat.weapon),n.render(e,P),p.update(e,S,n.getGroundBasis());const T=n.diagnostics();a.update(e,C,W,S,d,{attackBlend:T.attackBlend,attackWeights:T.attackWeights,landing:T.landing,hurt:T.hurt,ik:T.ik,zoom:T.camera.zoom},r.hudCompact()),requestAnimationFrame(b)}requestAnimationFrame(b)}jx();

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Pi=["sword-shield","dual-swords","greatsword","staff","bow"],Rr=["wander","follow","keep-distance","attack","idle"],Md={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Ja=1e-6;function Vs(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Ja?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Ja?Math.atan2(t.moveX,t.moveZ):n.character.facing}function vf(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Ja){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Ja)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const xn=1e-6,So=Math.PI/180,Dc=-1e9;function Sd(){return{type:"none",lastAt:Dc,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function bo(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Al(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function Ic(n,t,e){const i=e.duration>0?e.duration:kc(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if(Al(a,e.type,i,e.dirX,e.dirZ),a.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>xn){const r=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*r,a.knockZ=e.dirZ*r}bo(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if(Al(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>xn){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,bo(n,"hit",s.id,s.position)}}function fr(n,t,e){Ic(n,{kind:"dummy",index:t},e)}function _f(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function kc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function yf(n){const t=n.combat,e=n.config.hits,i=n.character.position,s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*So),r=Math.sin(t.attackFacing),o=Math.cos(t.attackFacing),c=n.config.dummies.radius,l=n.config.targeting.idealRange;for(const h of n.dummies){const f=h.position.x-i.x,d=h.position.z-i.z,u=Math.hypot(f,d);if(u>s+c)continue;const p=u>xn?f/u:r,v=u>xn?d/u:o;if(u>xn&&(f*r+d*o)/u<a)continue;let g="light";t.weapon==="greatsword"?g="knock":(t.weapon==="bow"||t.comboIndex>=3)&&(g="heavy");const m=e.knockback[t.weapon]??0;let x=u;m>0&&(x=Math.max(u+m,l));const _=Math.max(0,x-u);fr(n,n.dummies.indexOf(h),{type:g,duration:kc(n,g),dirX:p,dirZ:v,knockback:_})}}function Mf(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const r=n.character.position,o=i.fromX,c=i.fromZ,l=r.x,h=r.z,f=l-o,d=h-c,u=f*f+d*d,p=Math.sin(i.facing),v=Math.cos(i.facing),g=Math.cos(Tl(a.arcDeg,0,180)*So),m=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const _=n.dummies[x];if(i.hitIds.indexOf(_.id)>=0)continue;const y=u>xn?Tl(((_.position.x-o)*f+(_.position.z-c)*d)/u,0,1):0,P=o+f*y,S=c+d*y,w=Math.hypot(_.position.x-P,_.position.z-S);let A=!1;if(a.shape==="circle")A=w<=a.radius+m;else if(a.shape==="capsule")A=w<=Math.max(a.radius,a.width)+m;else{const B=_.position.x-l,L=_.position.z-h,C=Math.hypot(B,L),X=C>xn?(B*p+L*v)/C>=g:!0;A=C<=a.radius+m&&X||w<=a.width+m}if(!A)continue;const E=_.position.x-o,M=_.position.z-c,R=Math.hypot(E,M);if(R>xn&&(E*p+M*v)/R<Math.cos(Math.max(a.arcDeg,90)*So))continue;const U=R>xn?E/R:p,F=R>xn?M/R:v;Ic(n,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:U,dirZ:F,knockback:a.knockback}),i.hitIds.push(_.id),bo(n,"link-hit",_.id,_.position)}}function Sf(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,r=e.z-s.position.z,o=Math.hypot(a,r);if(o>t.dummyReach)continue;const c=o>xn?a/o:0,l=o>xn?r/o:1;Ic(n,{kind:"player"},{type:"light",duration:kc(n,"light"),dirX:c,dirZ:l,knockback:t.dummyKnockback,sourceId:s.id})}}function bf(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&yf(n),Mf(n,t),Sf(n)}function Tl(n,t,e){return n<t?t:n>e?e:n}const Eo=Math.PI/180,Uc=1e-6;function Ef(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Qa(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function bd(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Uc?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Ed(n,t,e){const i=n.character,s=Math.hypot(i.velocity.x,i.velocity.z),a=Math.hypot(t.moveX,t.moveZ),r=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&s<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Uc)&&a<=Math.max(0,e.inputDeadZone)&&!r}function wf(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Af(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Ed(n,t,e))return!1;const i=bd(n,t,e.lookRange);if(i===null)return!1;const s=He(i-n.character.bodyYaw);return Math.abs(s)>Math.max(0,e.triggerDeg)*Eo}function Tf(n,t,e){const i=n.turnInPlace,s=n.config.turnInPlace;if(!s.enabled||!n.modules.turnInPlace||!Ed(n,e,s)){Qa(n);return}const a=bd(n,e,s.lookRange);if(a===null){Qa(n);return}const r=n.character,o=He(a-r.bodyYaw),c=Math.abs(o),l=Math.max(0,s.triggerDeg)*Eo,h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Uc;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,s.armSec))){i.phase="active",i.fromYaw=r.bodyYaw,i.dir=o>=0?1:-1;const f=Math.min(c,Math.max(0,s.settleDeg)*Eo);i.targetYaw=He(r.bodyYaw+i.dir*(c-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(s.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=He(i.targetYaw-i.fromYaw);r.bodyYaw=He(i.fromYaw+d*wf(i.progress)),h||(r.facing=r.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const wo=1e-6;function He(n){return Math.atan2(Math.sin(n),Math.cos(n))}function sa(n,t,e,i){const s=He(t-n);return n+s*(1-Math.exp(-Math.max(e,wo)*i))}function Rl(n,t,e,i){const s=He(t-n),a=Math.abs(s);return a<=i||a<=e?t:He(n+Math.sign(s)*Math.max(e,0))}function Rf(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,r=n.modules.gaze&&n.gaze.active,o=n.abilities.channeling,c=a.phase!=="idle"||a.charging||o||n.dash.phase!=="idle",l=r&&!c,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>wo,d=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(o)i.facing=Vs(n,e);else if(l)i.facing=sa(i.facing,n.gaze.centroidYaw,s.bodyTurnRate,t);else if(f)i.facing=Vs(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(s.facingDeadZone,wo)){const P=Math.atan2(e.moveX,e.moveZ),S=s.facingTurnRate*Math.PI/180*t,w=s.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=Rl(i.facing,P,S,w);else if(h>=s.facingMinMagnitude&&Math.abs(He(P-i.facing))>s.facingDeadbandDeg*Math.PI/180){const E=sa(i.facing,P,s.facingSmoothRate,t);i.facing=Rl(i.facing,E,S,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const p=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Af(n,e)||(i.bodyYaw=sa(i.bodyYaw,p,s.bodyTurnRate,t));let g=i.facing;if(r?g=l?n.gaze.mainYaw:i.facing:f?g=Math.atan2(e.aimX,e.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget&&(g=n.targeting.targetYaw),!r){const P=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(He(g-i.bodyYaw))>P&&(g=i.moveYaw)}const m=l?n.config.gaze.headTurnRate:s.headTurnRate;let x=sa(i.headYaw,g,m,t);const _=s.maxHeadTurnDeg*Math.PI/180,y=He(x-i.bodyYaw);y>_?x=i.bodyYaw+_:y<-_&&(x=i.bodyYaw-_),i.headYaw=x}const Ha=1e-6,Ao=Math.PI/180;function ds(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Cf(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,volleyId:0,projectiles:[],rings:[],nextId:0}}function wd(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.projectiles.length=0,t.rings.length=0}function Pf(n,t){const e=n.config.abilities.arcane,i=n.character.position,s=Math.max(0,e.homingConeDeg)*Ao;let a=-1,r=Math.max(0,e.homingRange);for(let o=0;o<n.dummies.length;o++){const c=n.dummies[o],l=c.position.x-i.x,h=c.position.z-i.z,f=Math.hypot(l,h);f<.001||f>r||Math.abs(He(Math.atan2(l,h)-t))>s||(a=o,r=f)}return a}function Lf(n){const t=n.abilities,e=n.config.abilities.arcane,i=n.character.position,s=Math.max(1,Math.floor(e.perWave)),a=e.spreadDeg*Ao,r=Pf(n,t.channelYaw),o=.16;for(let c=0;c<s;c++){const l=(c-(s-1)*.5)*a,h=t.channelYaw+l,f=(c-(s-1)*.5)*o,d=Math.sin(h),u=Math.cos(h),p={id:++t.nextId,x:i.x+d*.5+Math.cos(h)*f,y:i.y+1,z:i.z+u*.5-Math.sin(h)*f,dirX:d,dirZ:u,speed:e.speed,life:e.life,radius:e.radius,targetIndex:r,turnRate:Math.max(0,e.turnRateDeg)*Ao,homing:Math.max(0,e.homingTime),wave:t.waveIndex};t.projectiles.push(p),t.volleyId+=1,ds(n,"projectile-fire",t.volleyId,p)}ds(n,"arcane-wave",t.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Cl(n){const t=n.abilities;if(!t.channeling)return;const e=n.config.abilities.arcane;t.channeling=!1,t.fireTimer=0,t.cooldown=Math.max(0,e.cooldown),t.needsRelease=!0,ds(n,"channel-end",0,n.character.position)}function Df(n,t,e){const i=n.abilities,s=n.config.abilities.arcane,a=n.dash.phase==="active",r=n.playerLink,o=n.combat.weapon==="staff"&&e.attackHeld&&!a&&r.phase==="idle"&&!r.consumedAttack;if(i.cooldown>0&&(i.cooldown=Math.max(0,i.cooldown-t)),i.needsRelease&&!o&&(i.needsRelease=!1),i.channeling){if(!o){Cl(n);return}}else{if(!(o&&!i.needsRelease&&i.cooldown<=0))return;i.channeling=!0,i.channelId+=1,i.waveIndex=0,i.fireTimer=0,ds(n,"channel-start",i.channelId,n.character.position)}i.channelYaw=Vs(n,e),i.fireTimer-=t;let c=0;for(;i.fireTimer<=0&&c++<8;)if(i.fireTimer+=Math.max(s.waveInterval,Ha),Lf(n),i.waveIndex+=1,i.waveIndex>=Math.max(1,Math.floor(s.waves))){Cl(n);break}}function If(n,t){const e=n.config.abilities.ring,i=n.dash.phase==="active";if(n.combat.weapon!=="staff"||!t.skill2Pressed||i)return;const s=n.character.position,a={id:++n.abilities.nextId,x:s.x,z:s.z,radius:e.radius,life:e.duration,duration:e.duration,pulseTimer:0};n.abilities.rings.push(a),ds(n,"ring-place",a.id,s)}function kf(n,t){const e=n.abilities,i=n.config.abilities.arcane,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,r=[];for(const o of e.projectiles){if(o.homing>0&&(o.homing=Math.max(0,o.homing-t)),o.targetIndex>=0&&o.turnRate>0&&o.homing>0){const l=n.dummies[o.targetIndex];if(!l)o.targetIndex=-1;else{const h=Math.atan2(l.position.x-o.x,l.position.z-o.z),f=Math.atan2(o.dirX,o.dirZ),d=He(h-f),u=o.turnRate*t,p=Math.max(-u,Math.min(u,d)),v=f+p;o.dirX=Math.sin(v),o.dirZ=Math.cos(v)}}if(o.x+=o.dirX*o.speed*t,o.z+=o.dirZ*o.speed*t,o.life-=t,o.life<=0)continue;let c=!1;if(a)for(let l=0;l<n.dummies.length;l++){const h=n.dummies[l],f=h.position.x-o.x,d=h.position.z-o.z,u=o.radius+s;if(!(f*f+d*d>u*u)){fr(n,l,{type:i.hurtType,duration:i.hurtDuration,dirX:o.dirX,dirZ:o.dirZ,knockback:i.knockback}),c=!0;break}}c||r.push(o)}e.projectiles=r}function Uf(n,t){const e=n.abilities,i=n.config.abilities.ring,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,r=[];for(const o of e.rings){o.life-=t,o.pulseTimer-=t;let c=0;for(;o.pulseTimer<=0&&c++<8;){if(o.pulseTimer+=Math.max(i.pulseInterval,Ha),a)for(let l=0;l<n.dummies.length;l++){const h=n.dummies[l],f=h.position.x-o.x,d=h.position.z-o.z,u=o.radius+s;if(f*f+d*d>u*u)continue;const p=Math.hypot(f,d),v=p>Ha?f/p:0,g=p>Ha?d/p:1;fr(n,l,{type:"heavy",duration:i.stun,dirX:v,dirZ:g,knockback:i.knockback})}ds(n,"ring-pulse",o.id,{x:o.x,y:0,z:o.z})}o.life>0&&r.push(o)}e.rings=r}function Ff(n,t,e){Df(n,t,e),If(n,e),kf(n,t),Uf(n,t)}function Cr(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Pl=1e-6;function Ll(n,t,e){return n<t?t:n>e?e:n}function Ad(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Td(n){const t=n.camera,e=Ad();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Nf(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,r=0,o=0;for(const l of n.dummies){const h=l.position.x-i.x,f=l.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=Ll((e.radius-d)/Math.max(Pl,e.radius-e.nearDistance),0,1);let p=u*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(p+=e.attackBoost*u),s+=p,a+=l.position.x*p,r+=l.position.z*p,o+=1}const c=s<=0?0:Ll(s/(s+Math.max(Pl,e.saturation)),0,1);if(t.threat=c,t.threatCount=o,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=a/s,h=r/s;t.centroidX=l,t.centroidZ=h;let f=(l-i.x)*e.framingBias*c,d=(h-i.z)*e.framingBias*c;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function zf(n){const t=[],e=n.ground.size;t.push(Ni("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Ni(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(Ni(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ni(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Ni(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Ni(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Ni(n,t,e,i,s,a,r,o){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:r,maxY:o,minZ:i-a/2,maxZ:i+a/2}}const Wn=1e-6;function tr(n,t,e){return n<t?t:n>e?e:n}function Xs(n,t,e,i,s,a,r){const o=s*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+a+Wn||l.maxY<i-r-Wn||t+o<l.minX||t-o>l.maxX||e+o<l.minZ||e-o>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function Fc(n,t,e,i,s){let a=!1;const r=t.y+i;for(let o=0;o<2;o++)for(const c of n){if(c.maxY<=t.y+s+Wn||c.minY>=r-Wn)continue;const l=tr(t.x,c.minX,c.maxX),h=tr(t.z,c.minZ,c.maxZ),f=t.x-l,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(a=!0,u>Wn*Wn){const p=Math.sqrt(u),v=(e-p)/p;t.x+=f*v,t.z+=d*v}else{const p=t.x-c.minX,v=c.maxX-t.x,g=t.z-c.minZ,m=c.maxZ-t.z,x=Math.min(p,v,g,m);x===p?t.x=c.minX-e:x===v?t.x=c.maxX+e:x===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return a}function Nc(n,t,e,i,s){const a=t.y+i;for(const r of n){if(r.maxY<=t.y+s+Wn||r.minY>=a-Wn)continue;const o=tr(t.x,r.minX,r.maxX),c=tr(t.z,r.minZ,r.maxZ),l=t.x-o,h=t.z-c;if(l*l+h*h<e*e-Wn)return!0}return!1}const Ga=1e-6,Rd=Math.PI/180;function To(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Cd(n){n.arrows.length=0}function Of(n,t,e,i,s,a,r,o,c,l,h){const f=i-n,d=a-e,u=f*f+d*d;let p=0;u>Ga&&(p=((r-n)*f+(o-e)*d)/u,p=Math.max(0,Math.min(1,p)));const v=n+f*p,g=e+d*p,m=v-r,x=g-o;if(m*m+x*x>h*h)return-1;const _=t+(s-t)*p;return _<c-.1||_>c+l?-1:p}function Bf(n,t,e){const i=n.config.combat.bow.trajectory,s=Math.max(0,Math.min(1,t)),a=i.speedMin+(i.speedMax-i.speedMin)*s,r=Math.max(0,i.launchPitchDeg)*Rd,o=n.character.position,c=Math.sin(e),l=Math.cos(e),h=Math.cos(r),f={id:++n.arrowSeq,x:o.x+c*.55,y:o.y+.95,z:o.z+l*.55,vx:c*a*h,vy:a*Math.sin(r),vz:l*a*h,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,pitch:0,rest:0,hit:!1};return n.arrows.push(f),To(n,"arrow-shot",s,f),f}function Hf(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,s=n.config.dummies.radius,a=n.config.dummies.height,r=n.modules.hits&&n.modules.dummies,o=Math.max(0,i.gravity),c=[];for(const l of e){if(l.stuck){if(l.rest-=t,l.rest<=0)continue;if(l.stuckDummy>=0){const y=n.dummies[l.stuckDummy];y&&(l.x=y.position.x+l.offX,l.y=y.position.y+l.offY,l.z=y.position.z+l.offZ)}c.push(l);continue}if(l.life-=t,l.life<=0)continue;const h=l.x,f=l.y,d=l.z;l.vy-=o*t;const u=h+l.vx*t,p=f+l.vy*t,v=d+l.vz*t;let g=-1,m=2;if(r)for(let y=0;y<n.dummies.length;y++){const P=n.dummies[y],S=Of(h,f,d,u,p,v,P.position.x,P.position.z,P.position.y,a,s+i.radius);S>=0&&S<m&&(m=S,g=y)}if(g>=0){const y=n.dummies[g];l.x=h+(u-h)*m,l.y=f+(p-f)*m,l.z=d+(v-d)*m,l.stuck=!0,l.stuckDummy=g,l.offX=l.x-y.position.x,l.offY=l.y-y.position.y,l.offZ=l.z-y.position.z,l.yaw=Math.atan2(l.vx,l.vz),l.pitch=Math.atan2(-l.vy,Math.hypot(l.vx,l.vz)),l.rest=Math.max(.2,i.stickSec),l.hit=!0;const P=Math.hypot(l.vx,l.vz);fr(n,g,{type:"light",duration:.22,dirX:P>Ga?l.vx/P:0,dirZ:P>Ga?l.vz/P:1,knockback:.14}),To(n,"arrow-land",y.id,l),c.push(l);continue}const x=Xs(n.boxes,u,v,p+.4,.04,0,6),_=Number.isFinite(x)?x:0;if(p<=_+.02&&l.vy<0){l.x=u,l.y=_+Math.max(0,i.groundStickLift),l.z=v,l.stuck=!0,l.stuckDummy=-1,l.yaw=Math.atan2(l.vx,l.vz);const y=Math.atan2(-l.vy,Math.max(Ga,Math.hypot(l.vx,l.vz)));l.pitch=Math.max(y,Math.max(0,i.stickMinPitchDeg)*Rd),l.rest=Math.max(.2,i.stickSec),To(n,"arrow-land",-1,l),c.push(l);continue}l.x=u,l.y=p,l.z=v,c.push(l)}n.arrows=c}const Ro=1e-6,Gf=Math.PI/180;function Co(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function zc(n,t,e){return n<t?t:n>e?e:n}function pr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Po(n){const t=n.id,e=n.windowId;Object.assign(n,pr()),n.id=t,n.windowId=e}function Vf(n){Po(n)}function Pd(n){Po(n.playerLink);for(const t of n.dummies)Po(t.link)}function Xf(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Lo(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function er(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,pr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function Wf(n,t){const e=n.config.links.search,i=n.character.position,s=zc(e.maxAngleDeg,0,180)*Gf;let a=0,r=t,o=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,h=c.position.z-i.z,f=Math.hypot(l,h);if(f<Ro||f>e.range)continue;const d=Math.atan2(l,h);Math.abs(He(d-t))>s||f<o&&(o=f,a=c.id,r=d)}return{id:a,yaw:r,dist:a>0?o:0}}function $f(n,t,e,i){const s=n.config.links,a=n.playerLink,r=n.character.position,o=Vs(n,t),c=Wf(n,o),l=c.id>0?c.yaw:o,h=c.id>0?zc(c.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=l,a.targetId=c.id,a.targetDist=c.dist,a.travel=h,a.travelled=0,a.fromX=r.x,a.fromZ=r.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),Co(n,"link-start",a.id)}function Yf(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){er(n);return}if(e.weapon!==n.combat.weapon){er(n);return}e.timer+=t;const s=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const c=s(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Co(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Co(n,"link-end",e.id))}const r=i.windup+i.active+i.recovery;let o=0;if(e.phase==="windup"?o=e.timer:e.phase==="active"?o=i.windup+e.timer:e.phase==="recovery"?o=i.windup+i.active+e.timer:o=r,e.progress=r>0?zc(o/r,0,1):1,e.phase==="active"&&i.active>Ro){const c=Math.max(0,e.travel-e.travelled),l=Math.max(Ro,i.active-e.timer),h=c/l;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function Zf(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&er(n);return}const r=n.combat,o=n.character.sprinting;o&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!o&&Lo(n,"sprint"),s.prevSprinting=o,Yf(n,t);const c=i.moves[r.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&r.phase==="idle"&&!r.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&$f(n,e,c,r.weapon)}const Do=1e-6;function si(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ld(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Oc(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.bowQueued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=Ld()}function qf(n){return{weapon:Pi[Math.max(0,n-1)]??Pi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,bowQueued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:Ld()}}function jf(n,t){return Vs(n,t)}function Kf(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function Dd(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=jf(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,si(n,"attack-start",i)}function Id(n){return Math.max(0,n.config.combat.settle)}function Io(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Dd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Id(n),lunge:Kf(n,i.lunge[e-1]??0)},e)}function Jf(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Dd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Id(n),lunge:i.lunge},0),Bf(n,e,n.combat.attackFacing),si(n,"charge-release",e)}function Qf(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const c=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<c)break;if(i.phaseTimer-=c,i.phase==="windup")i.phase="active",si(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",si(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Io(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const c=i.timings.recovery;if(c>Do&&i.phaseTimer>=c*n.config.combat.cancelWindow){i.queued=!1;const l=n.config.combat.weapons[i.weapon];l.comboCount>0&&Io(n,e,i.comboIndex<l.comboCount?i.comboIndex+1:1)}}const r=s.windup+s.active+s.recovery;let o=0;i.phase==="windup"?o=i.phaseTimer:i.phase==="active"?o=s.windup+i.phaseTimer:i.phase==="recovery"?o=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(o=r),i.phase!=="idle"&&(i.attackProgress=r>0?Math.min(1,o/r):1)}function tp(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Pi.length){const c=Pi[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,Oc(n),er(n),si(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,si(n,"combo-reset",0))),Qf(n,t,e);const a=s.weapons[i.weapon],r=n.dash.phase==="active";if(a.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!r&&!c&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;Io(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&(!r&&!n.playerLink.consumedAttack&&(e.attackPressed&&i.phase!=="idle"&&(i.bowQueued=!0),!e.attackHeld&&!i.charging&&(i.bowQueued=!1),i.phase==="idle"&&!i.charging&&e.attackHeld&&(e.attackPressed||i.bowQueued)&&(i.bowQueued=!1,i.charging=!0,i.charge=0,si(n,"charge-start",0))),i.charging&&e.attackHeld&&(i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,Do))),i.charging&&!r&&(e.attackReleased||!e.attackHeld))){i.charging=!1;const c=i.charge;i.charge=0,c>=s.bow.minChargeToFire&&i.phase==="idle"?Jf(n,e,c):si(n,"charge-release",0)}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>Do)){const c=i.timings.lunge/i.timings.active;n.impulse.x=Math.sin(i.attackFacing)*c,n.impulse.z=Math.cos(i.attackFacing)*c}}const ko=1e-6;function Pr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ep(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function kd(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Dl(n,t,e){return n<t?t:n>e?e:n}function np(n,t,e){const i=n.config.dash,a=n.character.position,r=n.config.worldBounds,o=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,h=a.x,f=a.z;for(;l<c-ko;){const d=Math.min(c,l+o),u=a.x+t*d,p=a.z+e*d,v=Dl(u,r.minX,r.maxX),g=Dl(p,r.minZ,r.maxZ),m={x:v,y:a.y,z:g};if(Nc(n.boxes,m,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=v,f=g,l=d,v!==u||g!==p))break}return{x:h,z:f}}function ip(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Lo(n,"roll")),i.cooldown>0){const o=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),o>0&&i.cooldown===0&&Pr(n,"dash-ready",0)}const a=n.combat;if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&a.phase==="idle"&&!a.charging&&n.playerLink.phase==="idle"){const o=vf(n,e),c=o.x,l=o.z,h=n.combat.weapon==="staff";if(i.kind=h?"blink":"roll",i.dirX=c,i.dirZ=l,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=h?s.blinkCooldown:s.rollCooldown,h){const f=np(n,c,l);n.character.position.x=f.x,n.character.position.z=f.z,i.toX=f.x,i.toZ=f.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Lo(n,"blink"),Pr(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(ko,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+l*s.rollDistance,Pr(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const o=Math.max(ko,i.timer),c=n.character.position.x,l=n.character.position.z;n.impulse.x=(i.toX-c)/o,n.impulse.z=(i.toZ-l)/o}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const en=1e-6,Uo=Math.PI*2,sp=7,ap=18;function Il(n,t,e){return n<t?t:n>e?e:n}function rp(n){return Math.atan2(Math.sin(n),Math.cos(n))}function kl(n,t,e,i){return n+rp(t-n)*(1-Math.exp(-Math.max(e,en)*i))}function Bc(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function op(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Sd(),link:pr()})}return t}function cp(n){const t=Rr.indexOf(n);return Rr[(t+1)%Rr.length]}function Ud(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const r=i.hurt;r.type="none",r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,Vf(i.link)}n.dummyAttackCount=0}function lp(n,t,e){const i=Cr(n)*Uo,s=Math.sqrt(Cr(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+Cr(n)*.8)}function hp(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function dp(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const o=Math.max(hp(t,i),en);if(t.attackPhaseTimer<o)break;t.attackPhaseTimer-=o,t.attackPhase==="windup"?(t.attackPhase="active",Bc(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,r/a)}function up(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,r=Math.hypot(s,a),o=r>en?s/r:0,c=r>en?a/r:0;let l=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,p=Math.hypot(d,u);(t.wanderTimer<=0||p<.3)&&lp(n,t,e);const v=t.targetX-t.position.x,g=t.targetZ-t.position.z,m=Math.hypot(v,g);m>en&&(l=v/m,h=g/m)}else if(t.mode==="follow")r>e.followStopDistance&&(l=o,h=c);else if(t.mode==="keep-distance"){const d=r-e.keepDistance;d>e.keepDeadZone?(l=o,h=c):d<-e.keepDeadZone?(l=-o,h=-c):(l=-c*e.keepStrafe,h=o*e.keepStrafe)}else t.mode==="attack"&&r>e.attackRange&&t.attackPhase==="idle"&&(l=o,h=c);let f=t.facing;if(t.mode==="wander"?Math.hypot(l,h)>en&&(f=Math.atan2(l,h)):r>en&&(f=Math.atan2(o,c)),e.leashRadius>en&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,p=Math.hypot(d,u);if(p>e.leashRadius){const v=Math.min(1,(p-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),g=-d/p,m=-u/p;l=l*(1-v)+g*v,h=h*(1-v)+m*v;const x=Math.hypot(l,h);x>en&&(l/=x,h/=x)}}return{x:l,z:h,facing:f}}function fp(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const g=n.character.position;Math.hypot(g.x-e.position.x,g.z-e.position.z)<=i.attackRange+en&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,Bc(n,"dummy-attack",e))}dp(n,e,t,i);const s=up(n,e,i),a=1-Math.exp(-Math.max(i.acceleration,en)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*a,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*a,e.facing=s.facing,e.bodyYaw=kl(e.bodyYaw,e.facing,sp,t),e.headYaw=kl(e.headYaw,e.facing,ap,t);const r=e.position.x,o=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;Fc(n.boxes,e.position,i.radius,i.height,c)&&Nc(n.boxes,e.position,i.radius,i.height,c)&&(e.position.x=r,e.position.z=o,e.velocity.x=0,e.velocity.z=0);const h=n.config.worldBounds;e.position.x=Il(e.position.x,h.minX,h.maxX),e.position.z=Il(e.position.z,h.minZ,h.maxZ);const f=Xs(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+c+en&&(e.position.y=f);const d=Math.hypot(e.position.x-r,e.position.z-o);e.distance+=d;const u=Math.hypot(e.velocity.x,e.velocity.z),p=Math.min(n.config.strideSpeedCap,u/Math.max(n.config.moveSpeed,en)),v=Math.max(n.config.strideLength*(1+p*n.config.strideSpeedGain),en);e.stride=v,e.gaitPhase=(e.gaitPhase+d/v*Uo)%Uo}function pp(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=cp(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,Bc(n,"dummy-mode",s)}for(const s of n.dummies)fp(n,t,s,i)}const zi=1e-6,Ul=Math.PI*2;function Lr(n,t){return Math.sqrt(n*n+t*t)}function aa(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function mp(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Oc(n)}function gp(n,t,e){const i=n.character,s=n.config,a=Xs(n.boxes,t,e,s.characterHeight,s.characterRadius,s.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=a>Number.NEGATIVE_INFINITY?a:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=s.strideLength,i.distance=0,i.coyoteTime=s.coyoteTime,i.jumpBuffer=0,Oc(n),Pd(n),kd(n),wd(n),Cd(n),Qa(n);const r=n.targeting;r.targetId=0,r.targetYaw=0,r.targetDist=0,r.hasTarget=!1;const o=n.playerHurt;o.type="none",o.lastAt=Dc,o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,n.events.length=0}function xp(n,t,e){const i=n.config,s=n.character,a=s.position,r=s.velocity;let o=e.moveX,c=e.moveZ;const l=Lr(o,c);l>1&&(o/=l,c/=l);const h=n.combat.phase!=="idle",f=n.playerLink.phase!=="idle",d=h||n.dash.phase==="active"||f;s.sprinting=!d&&e.sprintHeld&&l>zi;const u=i.combat.weapons[n.combat.weapon];let p=u?u.moveMultiplier:1;d?p*=n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?p*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(p*=i.abilities.arcane.moveScale);const v=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*p;if(d)r.x=o*v,r.z=c*v;else{const U=l>zi?i.acceleration:i.friction,F=1-Math.exp(-U*t);r.x+=(o*v-r.x)*F,r.z+=(c*v-r.z)*F}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(r.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,aa(n,"jumped",i.jumpSpeed)),n.events.some(U=>U.type==="blink"&&U.tick===n.tick)&&(r.x=0,r.z=0,n.impulse.x=0,n.impulse.z=0);const m=a.x,x=a.z;if(a.x+=(r.x+n.impulse.x+n.playerHurt.knockX)*t,a.z+=(r.z+n.impulse.z+n.playerHurt.knockZ)*t,Fc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if(Nc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=m,a.z=x,r.x=0,r.z=0;else{const U=a.x-m,F=a.z-x;Math.abs(U)<Math.abs(r.x*t)*.5&&(r.x=0),Math.abs(F)<Math.abs(r.z*t)*.5&&(r.z=0)}aa(n,"blocked",1)}const y=i.worldBounds;a.x=Fl(a.x,y.minX,y.maxX),a.z=Fl(a.z,y.minZ,y.maxZ);const P=Xs(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&P>a.y+zi&&P-a.y<=i.stepHeight+zi&&(a.y=P,r.y=0,aa(n,"stepUp",P));const S=a.y;r.y-=i.gravity*t,a.y+=r.y*t;const w=Xs(n.boxes,a.x,a.z,S,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);w>Number.NEGATIVE_INFINITY&&a.y<=w&&r.y<=0?(a.y=w,r.y=0,s.grounded||aa(n,"landed",w),s.grounded=!0):s.grounded=!1;const A=Lr(a.x-m,a.z-x);s.distance+=A;const E=Lr(r.x,r.z),M=Math.min(i.strideSpeedCap,E/Math.max(i.moveSpeed,zi)),R=Math.max(i.strideLength*(1+M*i.strideSpeedGain),zi);s.stride=R,s.gaitPhase=(s.gaitPhase+A/R*Ul)%Ul}function Fl(n,t,e){return n<t?t:n>e?e:n}const Fo=1e-6,Nl=2.399963229728653;function bi(n,t,e){return n<t?t:n>e?e:n}function zl(n,t,e,i,s,a,r,o,c){const l=t.x-n.x,h=t.z-n.z,f=Math.hypot(l,h),d=e+i;if(f>=d)return;let u,p,v;f<Fo?(u=o,p=c,v=d):(u=l/f,p=h/f,v=d-f);const g=v+r;n.x-=u*g*s,n.z-=p*g*s,t.x+=u*g*a,t.z+=p*g*a}function vp(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,r=Math.max(1,Math.floor(t.iterations)),o=Math.max(0,t.slop);for(let h=0;h<r;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*Nl;zl(e[f].position,e[d].position,a,a,.5,.5,o,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*Nl;zl(i,e[f].position,s,a,0,1,o,Math.cos(d),Math.sin(d))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const h of e)Fc(n.boxes,h.position,a,n.config.dummies.height,c),h.position.x=bi(h.position.x,l.minX,l.maxX),h.position.z=bi(h.position.z,l.minZ,l.maxZ)}function _p(n,t,e,i,s,a,r,o){const c=Math.hypot(e,i),l=Math.max(0,o.contactBand),h=bi(o.minScale,0,1);if(c<Fo||l<=0||h>=1)return 1;const f=s+r,d=bi(o.approachDot,0,.99);let u=0;for(const p of a){const v=p.position.x-n,g=p.position.z-t,m=Math.hypot(v,g);if(m>=f+l)continue;if(m<Fo){u=1;continue}const x=(e*v+i*g)/(c*m);if(x<=d)continue;const _=bi(1-(m-f)/l,0,1),y=bi((x-d)/(1-d),0,1);u=Math.max(u,_*y)}return 1-(1-h)*bi(u,0,1)}function yp(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=_p(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Ol=1e-6,Mp=Math.PI/180;function Sp(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function bp(n,t,e){return n<t?t:n>e?e:n}function Ep(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let r=n.character.facing;Math.hypot(e.moveX,e.moveZ)>Ol&&(r=Math.atan2(e.moveX,e.moveZ));const c=bp(i.maxAngleDeg,0,180)*Mp;let l=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const p=u.position.x-a.x,v=u.position.z-a.z,g=Math.hypot(p,v);if(g<Ol||g>i.range)continue;const m=Math.atan2(p,v),x=Math.abs(He(m-r));if(x>c)continue;const _=g-i.frontBias*Math.cos(x);_<l&&(l=_,h=u.id,f=m,d=g)}s.targetId=h,s.targetYaw=f,s.targetDist=d,s.hasTarget=h>0}const Xn=1e-6;function nr(n,t,e){return n<t?t:n>e?e:n}function Bl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function wp(n,t,e){const i=n.config.gaze,s=n.gaze;if(!i.enabled||!n.modules.gaze){s.active=!1,s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}const a=n.character.position,r=(M,R)=>{const U=M.position.x-a.x,F=M.position.z-a.z,B=Math.hypot(U,F);if(B<Xn||B>R)return 0;const L=nr((R-B)/Math.max(Xn,R-i.nearDistance),0,1);let C=L*(i.modeWeight[M.mode]??.5);return M.attackPhase==="active"&&(C+=i.attackBoost*L),C},o=[];let c=0,l=!1,h=!1,f=!1;for(const M of n.dummies){const R=r(M,i.threatRange),U=M.position.x-a.x,F=M.position.z-a.z,B=Math.hypot(U,F);R>0&&(o.push({id:M.id,x:M.position.x,z:M.position.z,dx:U,dz:F,yaw:Math.atan2(U,F),w:R}),c+=R,B<=i.approachDist&&(i.modeWeight[M.mode]??.5)>=i.hostileModeWeight&&(f=!0)),B>Xn&&B<=i.recoveryDist&&(l=!0),(M.attackPhase==="windup"||M.attackPhase==="active")&&B<=i.threatRange&&(h=!0)}const d=c<=0?0:nr(c/(c+Math.max(Xn,i.saturation)),0,1),u=o.length>0,p=s.active,v=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),g=i.hurtHoldSec>Xn&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,m=p&&(l||g);if(s.active=v||m,!s.active){s.mainId=0,s.mainYaw=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}if(o.length===0)return;o.sort((M,R)=>R.w-M.w);const x=o.slice(0,Math.max(1,i.maxThreats)),_=o[0],y=Math.atan2(_.dx,_.dz),P=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let w=0,A=0,E=0;for(const M of x){const R=Math.abs(Bl(M.yaw-y))/Math.PI;let U=M.w/(1+Math.max(i.spreadFalloff,0)*R*R);M!==_&&i.behindFalloff<1&&Math.abs(Bl(M.yaw-S))>P&&(U*=Math.max(i.behindFalloff,0)),w+=M.x*U,A+=M.z*U,E+=U}s.mainId=_.id,s.mainYaw=y,s.centroidYaw=E>Xn?Math.atan2(w/E-a.x,A/E-a.z):y,s.threatCount=o.length,s.threat=d}function Ap(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Tp(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,s=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(s<Xn||s>e.threatRange)return 0;const a=Math.max(Xn,e.threatRange-e.nearDistance),r=nr((e.threatRange-s)/a,0,1);let o=r*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(o+=e.attackBoost*r);const c=Math.max(Xn,e.modeWeight.attack??1.5);return nr(o/c,0,1)}function Rp(){return{active:!1,mainId:0,mainYaw:0,centroidYaw:0,threatCount:0,threat:0}}function Cp(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:zf(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:qf(1),playerLink:pr(),arrows:[],arrowSeq:0,abilities:Cf(),impulse:{x:0,z:0},targeting:Sp(),turnInPlace:Ef(),playerHurt:Sd(),hitCount:0,dash:{...ep(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Ad(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Rp(),dummies:op(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function Pp(n){mp(n),Ud(n),Pd(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Dc,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,wd(n),Cd(n),kd(n),Td(n),Qa(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Hl(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){Pp(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Ep(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Zf(n,t,e),n.modules.combat&&tp(n,t,e),n.modules.dash&&ip(n,t,e),n.modules.movement&&xp(n,t,e),n.modules.gaze&&wp(n,t,e),n.modules.orientation&&Rf(n,t,e),Tf(n,t,e),n.modules.dummies&&pp(n,t,e),_f(n,t),Xf(n,t),n.modules.abilities&&Ff(n,t,e),n.modules.combat&&Hf(n,t),n.modules.dummies&&(bf(n,t),n.modules.separation&&(vp(n),yp(n))),n.modules.camera?Nf(n):Td(n),n}function Lp(n){let t=0;return{frame(e,i,s,a,r){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const o=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=o&&l<c;){const h=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Hl(n,o,h),r&&r(),t-=o,l++}return l>=c&&(t=0),l},singleStep(e){Hl(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Fd={slopPx:12,longPressMs:450,doubleTapMs:280};function Dp(n,t,e=Fd.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,r=t.rightZ*i+t.forwardZ*-s,o=Math.hypot(a,r);return o<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/o,worldZ:r/o}}function di(n,t,e,i,s,a){const r=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:r,angleDeg:r>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function Ip(n=Fd){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,r,o,c){if(t.has(a))return null;for(const l of t.values())if(l.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:r,startY:o,x:r,y:o,startedAt:c,dragging:!1,longFired:!1}),di(s,"press",0,0,0,1)},move(s,a,r,o){const c=i(s);if(!c)return null;c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY;return!c.dragging&&Math.hypot(l,h)>=n.slopPx?(c.dragging=!0,di(c.button,"drag",l,h,o-c.startedAt,1)):null},end(s,a,r,o){const c=i(s);if(!c)return null;t.delete(s),c.x=a,c.y=r;const l=a-c.startX,h=r-c.startY,f=o-c.startedAt,d=Math.hypot(l,h);if(c.dragging||c.longFired||d>=n.slopPx)return di(c.button,"release",l,h,f,1);const u=e.get(c.button);return u!==void 0&&o-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,r-u.y)<=n.slopPx*2?(e.delete(c.button),di(c.button,"doubleTap",l,h,f,2)):(e.set(c.button,{at:o,x:a,y:r}),di(c.button,"tap",l,h,f,1))},cancel(s,a){const r=i(s);return r?(t.delete(s),di(r.button,"cancel",r.x-r.startX,r.y-r.startY,a-r.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,di(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const Dr=.001,kp=18;function No(n,t,e){return n<t?t:n>e?e:n}function zo(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Up(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Fp(n,t,e,i,s=kp){const a=Up(t);if(!a)return{state:zo(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const r=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),o=s,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,h=c;if(!Number.isFinite(r)||r<Dr)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const p=o<=0;return{state:{active:!0,lastDist:r,armDist:r,armed:p},scale:1,started:!0,ended:!1,armedNow:!1,pinching:p}}if(!n.armed)return n.armDist<Dr?{state:{active:!0,lastDist:r,armDist:r,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(r-n.armDist)<o?{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Dr)return{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=r/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:r,armDist:n.armDist,armed:!0},scale:No(Number.isFinite(u)?u:1,l,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Np(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),r=Number.isFinite(t)&&t>0?t:1,o=n*r;return Number.isFinite(o)?No(o,s,a):No(n,s,a)}function zp(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Op(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Ir=["jump","sprint","reset","attack","skill2"],Bp=8,Hp=16,kr=10,Gl=14,Vl=140,Gp=18,Vp=16,Xp=400,Wp=1.0001;function Va(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function $p(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Va(e)}function Yp(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let r=null,o=0,c=0,l=0,h=0,f=0,d=0,u=-1,p=0,v=null,g=-1,m=0,x=0,_=0,y=0,P=!1,S=0,w=1,A=0,E=null,M=0,R=0,U=!1,F=null,B=null,L=0,C=0,X=0,H=0,q=!1,j=!0,st=-1;const ft=Ip({slopPx:Gl,longPressMs:450,doubleTapMs:350});let _t=[],Y=null;const tt=new Set;function mt(O){O&&_t.push(O)}const J=new Map;let gt=zo(),Ut=!1,Dt=1;function Mt(){const O=Array.from(J.values()),at=s(),ut=Fp(gt,O,at.pinchGain,at.maxStepRatio,Gp);if(gt=ut.state,Ut=ut.pinching,ut.scale!==1&&(Dt*=ut.scale),ut.started||ut.armedNow)E=null,U=!0,F=null;else if(ut.ended&&r===null&&O.length===1){const Ot=O[0];r=Ot.id,o=Ot.x,c=Ot.y,l=0,h=0,f=Ot.x,d=Ot.y,P=!1,S=0,w=1,A=0,performance.now(),E=null,U=!0,F=null}}const Pt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Ct={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let G=0,te=0;const Ft={},Nt=new Set,Lt=[];function Rt(){for(const O of Ir)Ft[O]!==void 0&&(Ft[O]=void 0),W(O);ft.reset(),tt.clear(),J.clear(),gt=zo(),Ut=!1,r=null,l=0,h=0,f=0,d=0,P=!1,S=0,w=1,A=0,m=0,x=0,_=0,y=0,v=null,g=-1,E=null,U=!1,F=null,B=null,st=-1,X=0,H=0,q=!1,j=!0}const It=()=>{document.hidden&&Rt()},D=O=>{if(O.clientX===0&&O.clientY===0){p++;return}if(Va(O.target)||$p(O.clientX,O.clientY)){tt.add(O.pointerId);return}if(tt.delete(O.pointerId),J.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),r===null&&!Ut){v=null,g=-1,r=O.pointerId,o=O.clientX,c=O.clientY,l=0,h=0,f=O.clientX,d=O.clientY,performance.now();const at=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY)&&(O.screenX!==0||O.screenY!==0);P=at,S=0,w=1,A=0,m=at?O.screenX:0,x=at?O.screenY:0,_=m,y=x,E=O.pointerId,M=O.clientX,R=O.clientY,U=!1}Mt()},b=O=>{if(O.pointerId===B&&(O.pointerType==="mouse"&&O.buttons===0||O.clientX===0&&O.clientY===0&&(L!==0||C!==0)||(j?(X=O.clientX-L,H=O.clientY-C):(L=O.clientX,C=O.clientY,j=!0,X=0,H=0))),mt(ft.move(O.pointerId,O.clientX,O.clientY,performance.now())),!tt.has(O.pointerId)&&J.has(O.pointerId)&&(J.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),Mt()),tt.has(O.pointerId)||O.pointerId!==r)return;const at=performance.now();if(v===O.pointerId&&at-g<150){p++;return}const ut=O.clientX,Ot=O.clientY;if(ut===0&&Ot===0&&(o!==0||c!==0)){p++;return}const $t=ut-f,z=Ot-d,St=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY),K=St?O.screenX:0,ot=St?O.screenY:0,bt=St&&(K!==0||ot!==0),wt=K-_,Xt=ot-y;if(P&&bt){const Z=Math.hypot(wt,Xt),yt=Math.hypot($t,z);if(Z>3){if(S=0,A<30&&yt>6&&wt*$t+Xt*z>.7*Z*yt){const Et=Z/yt;Et>.2&&Et<5&&(w+=(Et-w)*.3,A++)}}else yt>12&&(S++,S>=2&&(P=!1))}const Kt=Math.hypot($t,z);if(!P){const Z=u<0?Number.POSITIVE_INFINITY:at-u,yt=bt?Math.hypot(wt,Xt):1/0;Kt>28&&(Z<200||yt<Kt*.4)&&(o+=$t,c+=z,p++)}f=ut,d=Ot,_=K,y=ot,O.pointerId===E&&Math.hypot(O.clientX-M,O.clientY-R)>Bp&&(U=!0);let ce,jt;P&&bt?(ce=(K-m)/w,jt=(ot-x)/w):(ce=ut-o,jt=Ot-c);const ie=Math.hypot(ce,jt),_e=a();ie>_e&&(ce*=_e/ie,jt*=_e/ie);const Ge=Math.hypot(l,h),Fe=Math.hypot(ce,jt);if(Ge>10&&Fe>10){const Z=Math.abs(Math.atan2(l*jt-h*ce,l*ce+h*jt)),yt=Math.max(Ge,Fe)*Z,Et=Math.max(Math.hypot($t,z),Math.hypot(wt,Xt)/Math.max(.2,w));if(Z>.6&&Et<Math.max(6,yt*.5)){p++;return}}l=ce,h=jt};function W(O){if(!Pt[O])return;Pt[O]=!1,O==="attack"&&(Ct.attackReleased=!0);const at=document.getElementById(`btn-${O}`);at==null||at.classList.remove("is-down")}function lt(){r!==null&&(v=r,g=performance.now(),r=null,l=0,h=0,f=0,d=0,P=!1,S=0,w=1,A=0,m=0,x=0,_=0,y=0)}const ht=O=>{const at=J.delete(O.pointerId),ut=tt.delete(O.pointerId);at&&Mt(),O.pointerId===B&&(B=null,q?st=performance.now():(X=0,H=0,st=-1)),mt(ft.end(O.pointerId,O.clientX,O.clientY,performance.now()));for(const Ht of Ir)Ft[Ht]===O.pointerId&&(Ft[Ht]=void 0,W(Ht));const Ot=!at&&!ut&&J.size<=1&&r!==null;(O.pointerId===r||J.size===0||Ot)&&lt(),!ut&&O.pointerId===E&&(!U&&!Va(O.target)&&(F={x:O.clientX,y:O.clientY}),E=null)};for(const O of Ir){const at=document.getElementById(`btn-${O}`);if(!at)continue;const ut=O==="attack"||O==="skill2",Ot=z=>{if(z.preventDefault(),Ft[O]===void 0){Ft[O]=z.pointerId,Pt[O]=!0,O==="jump"&&(Ct.jump=!0),O==="reset"&&(Ct.reset=!0),O==="sprint"&&(Ct.sprintPressed=!0),O==="attack"&&(Ct.attackPressed=!0),O==="skill2"&&(Ct.skill2=!0),at.classList.add("is-down"),mt(ft.begin(O,z.pointerId,z.clientX,z.clientY,performance.now()));try{at.setPointerCapture(z.pointerId)}catch{}ut&&(B=z.pointerId,L=z.clientX,C=z.clientY,j=!(z.clientX===0&&z.clientY===0),X=0,H=0,q=!1,st=-1)}},Ht=z=>{Ft[O]===z.pointerId&&(Ft[O]=void 0,W(O),mt(ft.end(z.pointerId,z.clientX,z.clientY,performance.now())))},$t=z=>{Ft[O]===z.pointerId&&(Ft[O]=void 0,W(O),mt(ft.cancel(z.pointerId,performance.now())))};at.addEventListener("pointerdown",Ot),at.addEventListener("pointerup",Ht),at.addEventListener("pointercancel",$t),Lt.push(()=>{at.removeEventListener("pointerdown",Ot),at.removeEventListener("pointerup",Ht),at.removeEventListener("pointercancel",$t)})}const rt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const O of rt){const at=ut=>{ut.preventDefault(),G=Number(O.dataset.weapon)||0};O.addEventListener("pointerdown",at),Lt.push(()=>O.removeEventListener("pointerdown",at))}const zt=O=>{const at=O.key.toLowerCase();if((at===" "||at.startsWith("arrow"))&&O.preventDefault(),Nt.has(at))return;Nt.add(at),at===" "&&(Ct.jump=!0),at==="r"&&(Ct.reset=!0),at==="shift"&&(Ct.sprintPressed=!0),at==="j"&&(Ct.attackPressed=!0),at==="k"&&(Ct.skill2=!0),at>="1"&&at<="5"&&(G=Number(at)),at>="6"&&at<="9"&&(te=Number(at)-5);const ut=Math.max(Wp,s().keyStep||1.12);(at==="="||at==="+")&&(Dt*=ut),(at==="-"||at==="_")&&(Dt/=ut)},Q=O=>{const at=O.key.toLowerCase();Nt.has(at)&&(Nt.delete(at),at==="j"&&(Ct.attackReleased=!0))},xt=O=>{if(Va(O.target))return;O.preventDefault();const at=O.deltaMode===1?O.deltaY*Vp:O.deltaMode===2?O.deltaY*Xp:O.deltaY;Dt*=zp(at,s().wheelStep)},Wt=O=>{O.preventDefault()},nt=()=>{u=performance.now()};window.addEventListener("resize",nt),window.addEventListener("orientationchange",nt);const At=typeof window<"u"?window.visualViewport:null;return At&&(At.addEventListener("resize",nt),At.addEventListener("scroll",nt)),window.addEventListener("pointerdown",D),window.addEventListener("pointermove",b),window.addEventListener("pointerup",ht),window.addEventListener("pointercancel",ht),window.addEventListener("blur",Rt),document.addEventListener("visibilitychange",It),window.addEventListener("keydown",zt),window.addEventListener("keyup",Q),window.addEventListener("wheel",xt,{passive:!1}),window.addEventListener("gesturestart",Wt),{peekStick(){return{id:r,held:r!==null,originX:o,originY:c,x:f,y:d,dx:f-o,dy:d-c,radius:a(),badMoves:p,screenOk:P,originSX:m,originSY:x,screenX:_,screenY:y,scale:w}},peekAim(){const O=performance.now(),at=Math.hypot(X,H),ut=B!==null||st>=0&&O-st<Vl;if(!(ut&&q&&at>=kr))return{active:!1,holding:ut,x:0,z:0,dx:X,dy:H};const Ht=i(),$t=X/at,z=H/at,St=Ht.rightX*$t+Ht.forwardX*-z,K=Ht.rightZ*$t+Ht.forwardZ*-z,ot=Math.hypot(St,K)||1;return{active:!0,holding:ut,x:St/ot,z:K/ot,dx:X,dy:H}},sample(){var qt;const O=a();let at=r!==null?Math.max(-1,Math.min(1,l/O)):0,ut=r!==null?Math.max(-1,Math.min(1,h/O)):0,Ot=0,Ht=0;(Nt.has("a")||Nt.has("arrowleft"))&&(Ot-=1),(Nt.has("d")||Nt.has("arrowright"))&&(Ot+=1),(Nt.has("w")||Nt.has("arrowup"))&&(Ht-=1),(Nt.has("s")||Nt.has("arrowdown"))&&(Ht+=1),at+=Ot,ut+=Ht;let $t=Math.hypot(at,ut);$t>1&&(at/=$t,ut/=$t,$t=1);const z=at,St=ut;$t<e&&(at=0,ut=0);const K=i();let ot=K.rightX*at+K.forwardX*-ut,bt=K.rightZ*at+K.forwardZ*-ut;const wt=Math.hypot(ot,bt);wt>1&&(ot/=wt,bt/=wt);const Xt=performance.now();mt(ft.poll(Xt));const Kt=Math.hypot(X,H);B!==null&&(Kt>=Hp?q=!0:Kt<kr&&(q=!1));const ce=B!==null||st>=0&&Xt-st<Vl,jt=ce&&q&&Kt>=kr;let ie=0,_e=0;if(jt){const Yt=X/Kt,se=H/Kt,ue=K.rightX*Yt+K.forwardX*-se,ye=K.rightZ*Yt+K.forwardZ*-se,Ne=Math.hypot(ue,ye)||1;ie=ue/Ne,_e=ye/Ne}!ce&&B===null&&(X=0,H=0,st=-1,q=!1);const Ge=F;F=null;const Fe=Dt;Dt=1;const Z={moveX:ot,moveZ:bt,jumpPressed:Ct.jump,sprintHeld:Pt.sprint||Nt.has("shift"),sprintPressed:Ct.sprintPressed,resetPressed:Ct.reset,attackPressed:Ct.attackPressed,attackHeld:Pt.attack||Nt.has("j"),attackReleased:Ct.attackReleased,skill2Pressed:Ct.skill2,weaponSlot:G,dummyClickId:te,aimX:ie,aimZ:_e,aimActive:jt};Ct.jump=!1,Ct.reset=!1,Ct.sprintPressed=!1,Ct.attackPressed=!1,Ct.attackReleased=!1,Ct.skill2=!1,G=0,te=0;const yt=_t.map(Yt=>Dp(Yt,K,Gl));_t=[],yt.length>0&&(Y=yt[yt.length-1]);const Et=r!==null?"pointer":Nt.size>0?"keyboard":"idle";return{intents:Z,stickX:at,stickY:ut,stickRawX:z,stickRawY:St,stickHeld:r!==null,stickId:r,stickOriginX:o,stickOriginY:c,stickPxX:f,stickPxY:d,stickBad:p,stickScreenOk:P,stickOriginSX:m,stickOriginSY:x,stickScreenX:_,stickScreenY:y,stickScale:w,stickVpTop:((qt=Op())==null?void 0:qt.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:X,aimDY:H,source:Et,tap:Ge,zoomScale:Fe,gestures:yt,lastGesture:Y}},dispose(){window.removeEventListener("pointerdown",D),window.removeEventListener("pointermove",b),window.removeEventListener("pointerup",ht),window.removeEventListener("pointercancel",ht),window.removeEventListener("blur",Rt),document.removeEventListener("visibilitychange",It),window.removeEventListener("keydown",zt),window.removeEventListener("keyup",Q),window.removeEventListener("wheel",xt),window.removeEventListener("resize",nt),window.removeEventListener("orientationchange",nt),At&&(At.removeEventListener("resize",nt),At.removeEventListener("scroll",nt)),window.removeEventListener("gesturestart",Wt),ft.reset();for(const O of Lt)O()}}}const ir=1,sr=2,ar=4,Nd=8,rr=16,Ns=32,zd=64,Od=128,Zp=[[ir,"atk"],[sr,"dash"],[ar,"link"],[Nd,"air"],[rr,"hurt"],[Ns,"aim"],[zd,"spr"],[Od,"chan"]];function Oi(n){if(n===0)return"-";const t=Zp.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const qp=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],jp=0,Kp=15,Ur=19,Jp=21,Qp=22,tm=23,em=24,Pn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},tn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,yn=n=>Math.round(n*180/Math.PI*10)/10,Fr=Math.PI*2;function ws(n){let t=n%Fr;return t>Math.PI&&(t-=Fr),t<-Math.PI&&(t+=Fr),t}function nm(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=ir),n.dash.phase!=="idle"&&(e|=sr),n.playerLink.phase!=="idle"&&(e|=ar),n.character.grounded||(e|=Nd),n.playerHurt.type!=="none"&&(e|=rr),t.intents.aimActive&&(e|=Ns),n.character.sprinting&&(e|=zd),n.abilities.channeling&&(e|=Od),e}function im(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function sm(n){const t={sampleHz:n.sampleHz??Pn.sampleHz,sampleCapacity:n.sampleCapacity??Pn.sampleCapacity,eventCapacity:n.eventCapacity??Pn.eventCapacity,anomalyCapacity:n.anomalyCapacity??Pn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Pn.dirJumpDeg,aimDropDeg:n.aimDropDeg??Pn.aimDropDeg,freezeMs:n.freezeMs??Pn.freezeMs,freezeSpeed:n.freezeSpeed??Pn.freezeSpeed,stickLostMs:n.stickLostMs??Pn.stickLostMs,spikeMs:n.spikeMs??Pn.spikeMs},e=n.meta,i=[],s=[],a=[],r={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let o=!0,c=-1,l=-1e9,h=null,f=0,d=0,u="",p=-1,v=-1,g=-1,m=0,x=-1e9,_=-1,y={},P=null,S=0,w=0,A=0,E=0;function M(L,C){const X=1/t.sampleHz,H=L[jp];H-l<X-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),l=H)}function R(L,C,X,H,q,j){const st=y[L]??-1e9;if(C-st<1.2)return;if(y[L]=C,L==="frameSpike"){let _t=0;for(const Y of a)Y.kind==="frameSpike"&&_t++;if(_t>=6)return}a.length>=t.anomalyCapacity&&a.shift();let ft=i.slice(-7);j&&(ft.length===0||ft[ft.length-1]!==j)&&(ft=[...ft.slice(-6),j]),a.push({kind:L,t:tn(C),tick:X,ms:Math.round(H),detail:q,ctx:ft}),L==="dirJump"?r.dirJumps++:L==="aimDrop"?r.aimDrops++:L==="moveFreeze"?r.freezes++:L==="stickLost"?r.stickLosts++:L==="stickJump"?r.stickJumps++:L==="stickBad"?r.stickBads++:L==="stickDrift"&&r.stickDrifts++}function U(L,C,X,H){s.length>=t.eventCapacity&&s.shift(),s.push({t:tn(X),tick:H,k:L,d:C})}function F(L){switch(L.type){case"attack-start":r.attacks++;break;case"hit":r.hits++;break;case"player-hurt":r.hurts++;break;case"link-start":r.links++;break;case"link-hit":r.linkHits++;break;case"roll":r.rolls++;break;case"blink":r.blinks++;break;case"channel-start":r.channels++;break;case"projectile-fire":r.bolts++;break;case"ring-place":r.rings++;break;case"charge-start":r.bowCharges++;break;case"jumped":r.jumps++;break;case"reset":r.resets++;break;case"blocked":x=L.tick;break}}function B(){const L=r,C=L.wallMs/1e3,X=L.gestures,H=ft=>Object.entries(X).filter(([_t])=>_t.endsWith(`.${ft}`)).reduce((_t,[,Y])=>_t+Y,0),q=[];if(q.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),q.push(`运行 ${C.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),q.push(`摇杆活跃 ${C>0?Math.round(L.stickActiveMs/1e3/C*100):0}% · 手势 按下 ${H("press")}（单击 ${H("tap")} / 双击 ${H("doubleTap")} / 拖拽 ${H("drag")} / 长按 ${H("longPress")} / 打断 ${H("cancel")} / 拖放 ${H("release")}）`),q.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),q.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${u||"-"}`),q.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const ft of a.slice(-6)){q.push(`· ${ft.kind} @t${ft.t.toFixed(2)} tick${ft.tick} ${ft.ms>0?`${ft.ms}ms `:""}${ft.detail}`);const _t=ft.ctx.map(tt=>String(tt[Kp])).join(" "),Y=ft.ctx.map(tt=>tt[Ur]===""||tt[Ur]==null?".":String(tt[Ur])).join(" ");if(q.push(`  yaw ${_t}`),q.push(`  in  ${Y}`),ft.kind==="stickJump"||ft.kind==="stickBad"||ft.kind==="stickLost"){const tt=ft.ctx.map(J=>`${J[Jp]},${J[Qp]}`).join(" "),mt=ft.ctx.map(J=>`${J[tm]},${J[em]}`).join(" ");q.push(`  o   ${tt}`),q.push(`  p   ${mt}`)}}if(s.length>0){q.push("最近事件：");for(const ft of s.slice(-12))q.push(`  ${ft.t.toFixed(2)} ${ft.k} ${ft.d}`.trimEnd())}const j=r.screenFrames>0?`屏幕 screenX/Y（${r.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",st=r.screenFrames>0&&r.clientFrames>0?` / client 回退 ${r.clientFrames} 帧`:"";return q.push(`摇杆坐标源 ${j}${st}`),q.push(`UA ${e.ua}`),q.join(`
`)}return{sample(L,C,X,H=0){r.frames++,C.stickHeld&&(C.stickScreenOk?r.screenFrames++:r.clientFrames++),r.steps+=H,r.wallMs+=X,X>r.dtMax&&(r.dtMax=X),r.fps=r.wallMs>0?r.frames*1e3/r.wallMs:0,r.simS=L.time;const q=L.time;if(c<0&&(c=q),A=q,E=L.tick,!o)return;const j=L.character,st=Math.hypot(C.stickX,C.stickY),ft=Math.hypot(j.velocity.x,j.velocity.z);u=L.combat.weapon;const _t=nm(L,C),Y=j.facing,mt=Math.hypot(C.intents.moveX,C.intents.moveZ)>.05?Math.atan2(C.intents.moveX,C.intents.moveZ):null;st>.2&&(r.stickActiveMs+=X);const J=[tn(q),L.tick,Math.round(X*10)/10,tn(C.stickX),tn(C.stickY),tn(C.stickRawX),tn(C.stickRawY),C.stickHeld?1:0,C.source.slice(0,8),tn(C.intents.moveX),tn(C.intents.moveZ),tn(j.position.x),tn(j.position.z),tn(j.velocity.x),tn(j.velocity.z),yn(Y),yn(j.bodyYaw),_t,tn(j.stride),mt===null?"":yn(mt),C.stickId===null?"":C.stickId,Math.round(C.stickOriginX),Math.round(C.stickOriginY),Math.round(C.stickPxX),Math.round(C.stickPxY),C.stickBad,Math.round(C.stickVpTop),Math.round(C.stickOriginSX),Math.round(C.stickOriginSY),Math.round(C.stickScreenX),Math.round(C.stickScreenY),C.stickScreenOk?1:0,Math.round(C.stickScale*100)/100];M(J);const gt=q*1e3<_;if(X>t.spikeMs&&!gt&&q-c>.6&&(r.spikes++,R("frameSpike",q,L.tick,X,`dt ${X.toFixed(0)}ms fl=${Oi(_t)}`,J)),h!==null&&!gt){const Rt=Math.abs(yn(ws(Y-h))),It=Math.abs(yn(ws(j.moveYaw-f))),D=(d|_t)&(ir|sr|ar|rr)|_t&Ns,b=mt===null?null:Math.abs(yn(ws(Y-mt))),W=mt===null||h===null?null:Math.abs(yn(ws(h-mt))),lt=b!==null&&W!==null&&b<W-.5,ht=(d&Ns)!==0&&(_t&Ns)===0&&mt===null,rt=b!==null&&(b<=12||lt);Rt>t.aimDropDeg&&ht?R("aimDrop",q,L.tick,0,`${Rt.toFixed(0)}° @aim→none stick(${C.stickX.toFixed(2)},${C.stickY.toFixed(2)}) aim(${C.aimDX.toFixed(0)},${C.aimDY.toFixed(0)}) fl=${Oi(_t)}`,J):Rt>t.dirJumpDeg&&D===0&&!ht&&(rt?(r.inTurns++,Rt>r.inTurnMax&&(r.inTurnMax=Rt)):R("dirJump",q,L.tick,0,`${Rt.toFixed(0)}° res${b===null?" 无输入":`${b.toFixed(0)}°`} yaw ${yn(h)}→${yn(Y)} in ${mt===null?".":yn(mt)}° mvΔ${It.toFixed(0)}° aim(${C.aimDX.toFixed(0)},${C.aimDY.toFixed(0)}) fl=${Oi(d)}→${Oi(_t)}`,J))}const Ut=(_t&(ir|sr|ar|rr))!==0,Dt=L.tick-x<30;st>.35&&ft<t.freezeSpeed&&!Ut&&!Dt?(p<0&&(p=q),q-p>=t.freezeMs/1e3&&q>=v&&(R("moveFreeze",q,L.tick,(q-p)*1e3,`stick(${C.stickX.toFixed(2)},${C.stickY.toFixed(2)}) v${ft.toFixed(2)} ${C.source} fl=${Oi(_t)}`,J),v=q+1.5,p=-1)):p=-1,C.stickHeld?(st>m&&(m=st),m>.35&&st<.06?(g<0&&(g=q),q-g>=t.stickLostMs/1e3&&(R("stickLost",q,L.tick,(q-g)*1e3,`raw(${C.stickRawX.toFixed(2)},${C.stickRawY.toFixed(2)}) peak ${m.toFixed(2)} fl=${Oi(_t)}`,J),g=-1,m=0)):g=-1):(m=0,g=-1);const Mt=C.stickScale>.2&&C.stickScale<5?C.stickScale:1,Pt=C.stickScreenOk,Ct=Pt?C.stickScreenX/Mt:C.stickPxX,G=Pt?C.stickScreenY/Mt:C.stickPxY,te=Pt?C.stickOriginSX/Mt:C.stickOriginX,Ft=Pt?C.stickOriginSY/Mt:C.stickOriginY,Nt=Ct-te,Lt=G-Ft;if(C.stickHeld&&C.stickId!==null){const Rt=P;if(Rt&&Rt.held&&Rt.id===C.stickId){const It=Math.hypot(Rt.dx,Rt.dy),D=Math.hypot(Nt,Lt),b=Math.max(It,D),W=Math.hypot(Ct-Rt.cx,G-Rt.cy),lt=Math.abs(yn(ws(Math.atan2(Lt,Nt)-Math.atan2(Rt.dy,Rt.dx)))),ht=b*lt*Math.PI/180,rt=Math.hypot(te-Rt.ox,Ft-Rt.oy);if(b>18&&lt>35&&W<Math.max(5,ht*.35)&&R("stickJump",q,L.tick,0,`Δ${lt.toFixed(0)}° 手指只动${W.toFixed(0)}px(弧长应${ht.toFixed(0)}px) o(${Math.round(Rt.ox)},${Math.round(Rt.oy)})→(${Math.round(te)},${Math.round(Ft)}) 原点位移${rt.toFixed(0)}px p(${Math.round(Ct)},${Math.round(G)}) raw(${Math.round(Nt)},${Math.round(Lt)}) id${C.stickId} ${Pt?"src=屏幕":"src=client"}`,J),Pt&&Rt.screenOk){const zt=Math.hypot(C.stickPxX-Rt.x,C.stickPxY-Rt.y),Q=Math.hypot((C.stickScreenX-Rt.sx)/Mt,(C.stickScreenY-Rt.sy)/Mt);S+=zt-Q,Math.abs(S)>20&&(R("stickDrift",q,L.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(C.stickPxX)},${Math.round(C.stickPxY)}) screen(${Math.round(C.stickScreenX)},${Math.round(C.stickScreenY)})`,J),S=0)}}P={id:C.stickId,ox:te,oy:Ft,cx:Ct,cy:G,x:C.stickPxX,y:C.stickPxY,sx:C.stickScreenX,sy:C.stickScreenY,dx:Nt,dy:Lt,held:!0,screenOk:Pt}}else P=null,S=0;if(C.stickBad>w){const Rt=C.stickBad-w;R("stickBad",q,L.tick,0,`拦截 ${Rt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${C.stickBad}）o(${Math.round(C.stickOriginX)},${Math.round(C.stickOriginY)}) p(${Math.round(C.stickPxX)},${Math.round(C.stickPxY)}) id${C.stickId??"-"}`,J)}w=C.stickBad,h=Y,f=j.moveYaw,d=_t},event(L,C){const X=im(L);F(L),o&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||U(L.type,X,C,L.tick))},gesture(L){const C=`${L.button}.${L.kind}`;r.gestures[C]=(r.gestures[C]??0)+1,o&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&U(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,A,E)},suspend(L){_=A*1e3+L,p=-1,g=-1},setEnabled(L){o=L,L||(h=null,P=null,p=-1,g=-1)},clear(){i.length=0,s.length=0,a.length=0,y={},l=-1e9,h=null,d=0,p=-1,g=-1,m=0,r.frames=0,r.wallMs=0,r.dtMax=0,r.spikes=0,r.stickActiveMs=0,r.attacks=0,r.hits=0,r.hurts=0,r.links=0,r.linkHits=0,r.rolls=0,r.blinks=0,r.channels=0,r.bolts=0,r.rings=0,r.bowCharges=0,r.jumps=0,r.resets=0,r.dirJumps=0,r.aimDrops=0,r.inTurns=0,r.inTurnMax=0,r.freezes=0,r.stickLosts=0,r.stickJumps=0,r.stickBads=0,r.stickDrifts=0,r.screenFrames=0,r.clientFrames=0,S=0,P=null,w=0;for(const L of Object.keys(r.gestures))delete r.gestures[L]},status(){const L=r.simS,C=a.some(X=>L-X.t<8&&(X.kind==="dirJump"||X.kind==="aimDrop"||X.kind==="moveFreeze"||X.kind==="stickLost"||X.kind==="stickJump"||X.kind==="stickBad"||X.kind==="stickDrift"));return{durationS:r.wallMs/1e3,frames:r.frames,events:s.length,anomalies:a.length,alert:C,enabled:o}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...r,gestures:{...r.gestures}},columns:qp,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:B}}const am={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03},combat:{comboWindow:.65,settle:.16,attackMoveScale:0,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,release:{windup:.04,active:.12,recovery:.26,lunge:.12},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:7,gravity:9,maxLife:2.4,radius:.14,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:5,homingRange:8,homingConeDeg:40,turnRateDeg:420,homingTime:.35,cooldown:1,speed:14,life:1.2,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:7,headTurnRate:30,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},rm={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},om={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.36},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashThickness:.075,slashGlowOpacity:.34},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},cm={core:am,scene:rm,view:om};function Hc(n){return JSON.parse(JSON.stringify(n))}const Gc=cm,lm=Hc(Gc.core),ra=Hc(Gc.scene),rn=Hc(Gc.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class kn{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),kn.nextNameID=kn.nextNameID||0,this.$name.id=`lil-gui-name-${++kn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",r=>r.stopPropagation()),this.domElement.addEventListener("keyup",r=>r.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class hm extends kn{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Oo(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const dm={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Oo,toHexString:Oo},Ws={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},um={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Ws.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Ws.toHexString(s)}},fm={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Ws.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return Ws.toHexString(s)}},pm=[dm,Ws,um,fm];function mm(n){return pm.find(t=>t.match(n))}class gm extends kn{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=mm(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Oo(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Nr extends kn{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class xm extends kn{constructor(t,e,i,s,a,r){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const o=r!==void 0;this.step(o?r:this._getImplicitStep(),o),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const _=parseFloat(this.$input.value);isNaN(_)||(this._snapClampSetValue(_+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let r=!1,o,c,l,h,f;const d=5,u=x=>{o=x.clientX,c=l=x.clientY,r=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",p),window.addEventListener("mouseup",v)},p=x=>{if(r){const _=x.clientX-o,y=x.clientY-c;Math.abs(y)>d?(x.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(_)>d&&v()}if(!r){const _=x.clientY-l;f-=_*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}l=x.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",v)},g=()=>{this._inputFocused=!0},m=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",m)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(m,x,_,y,P)=>(m-x)/(_-x)*(P-y)+y,e=m=>{const x=this.$slider.getBoundingClientRect();let _=t(m,x.left,x.right,this._min,this._max);this._snapClampSetValue(_)},i=m=>{this._setDraggingStyle(!0),e(m.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=m=>{e(m.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let r=!1,o,c;const l=m=>{m.preventDefault(),this._setDraggingStyle(!0),e(m.touches[0].clientX),r=!1},h=m=>{m.touches.length>1||(this._hasScrollBar?(o=m.touches[0].clientX,c=m.touches[0].clientY,r=!0):l(m),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=m=>{if(r){const x=m.touches[0].clientX-o,_=m.touches[0].clientY-c;Math.abs(x)>Math.abs(_)?l(m):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else m.preventDefault(),e(m.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),p=400;let v;const g=m=>{if(Math.abs(m.deltaX)<Math.abs(m.deltaY)&&this._hasScrollBar)return;m.preventDefault();const _=this._normalizeMouseWheel(m)*this._step;this._snapClampSetValue(this.getValue()+_),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(u,p)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class vm extends kn{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class _m extends kn{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const ym=`.lil-gui {
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
}`;function Mm(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Xl=!1;class or{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:r=!1,injectStyles:o=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!Xl&&o&&(Mm(ym),Xl=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=r}add(t,e,i,s,a){if(Object(i)===i)return new vm(this,t,e,i);const r=t[e];switch(typeof r){case"number":return new xm(this,t,e,i,s,a);case"boolean":return new hm(this,t,e);case"string":return new _m(this,t,e);case"function":return new Nr(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,r)}addColor(t,e,i=1){return new gm(this,t,e,i)}addFolder(t){const e=new or({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Nr||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Nr)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Sm(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new or({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new or({title:"实验台 · 调试面板"}),r=n.config,o=[],c=[],l=D=>{const b=a.addFolder(D);return c.push(b),b},h=(D,b)=>{const W=D.addFolder(b);return o.push(W),W},f=l("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=l("移动 / 输入"),p=h(u,"基础移动参数");p.add(r,"moveSpeed",1,10,.1).name("移动速度"),p.add(r,"sprintMultiplier",1,3,.05).name("冲刺倍率"),p.add(r,"acceleration",1,40,.5).name("加速度"),p.add(r,"friction",1,40,.5).name("摩擦"),p.add(r,"gravity",5,60,.5).name("重力"),p.add(r,"jumpSpeed",2,16,.2).name("起跳速度"),p.add(r,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),p.add(r,"characterRadius",.1,.8,.01).name("角色半径"),p.add(r,"characterHeight",.6,2.2,.05).name("角色身高"),p.add(r,"strideLength",.3,3,.05).name("基础步幅"),p.add(r,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),p.add(r,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=h(u,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=r.dash,m=h(u,"冲刺 / 闪避");m.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),m.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),m.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),m.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),m.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),m.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),m.add(g,"blinkClearVelocity").name("闪现清空速度"),m.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),m.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=r.separation,_=h(u,"角色间分离 / 挤压阻力");_.add(x,"iterations",1,8,1).name("迭代次数"),_.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),_.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),_.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),_.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=r.dummies,P=h(u,"假人 AI");P.add(y,"moveSpeed",.5,8,.1).name("移动速度"),P.add(y,"wanderRadius",.5,8,.1).name("游走半径"),P.add(y,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),P.add(y,"followStopDistance",.3,5,.1).name("跟随停距"),P.add(y,"keepDistance",1,10,.1).name("保持距离"),P.add(y,"keepDeadZone",.1,2,.05).name("保持死区"),P.add(y,"attackRange",.5,5,.1).name("攻击距离"),P.add(y,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),P.add(y,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const S=l("步态 / 停步"),w=h(S,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const A=h(S,"停步收相 / 胸朝向");A.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),A.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),A.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),A.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),A.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=h(S,"停步惯性");E.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),E.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),E.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),E.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),E.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),E.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),E.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(S,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const R=h(S,"足部 IK"),U=t.ik;R.add(U,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),R.add(U,"weight",0,1,.01).name("钉地权重"),R.add(U,"attackScale",0,1,.01).name("攻击时权重倍率"),R.add(U,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const F=h(S,"惯性倾斜 / 盆骨"),B=t.lean;F.add(B,"accelGain",0,.1,.002).name("前后加速度增益"),F.add(B,"turnGain",0,.2,.005).name("绕圈侧倾增益"),F.add(B,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),F.add(B,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),F.add(B,"smoothing",1,30,1).name("倾斜平滑速率"),F.add(B,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),F.add(B,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),F.add(B,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),F.add(B,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=r.orientation,C=h(S,"朝向 / 下盘带转");C.add(L,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),C.add(L,"headTurnRate",.5,40,.5).name("头部转向速率"),C.add(L,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),C.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),C.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),C.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const X=h(S,"原地转身 / 停步偏差 (v9s)"),H=r.turnInPlace;X.add(H,"enabled").name("启用原地转身 (关=纯插值)"),X.add(H,"triggerDeg",20,180,5).name("触发夹角 (°)"),X.add(H,"settleDeg",0,60,1).name("转身保留余角 (°)"),X.add(H,"durationSec",.1,1.5,.02).name("转身时长 (s)"),X.add(H,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),X.add(H,"inputDeadZone",0,.5,.01).name("起步输入死区"),X.add(H,"armSec",0,.5,.01).name("触发防抖 (s)"),X.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),X.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),X.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),X.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),X.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),X.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const q=l("战斗 / 受击"),j=r.combat,st=h(q,"连击 / 武器"),ft=st.add(n.combat,"weapon",Pi).name("当前武器");st.add(j,"comboWindow",.1,2,.05).name("连击窗口 (s)"),st.add(j,"settle",0,.8,.01).name("段间停顿 (s)"),st.add(j,"attackMoveScale",0,1,.01).name("攻击时移动比例"),st.add(j,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),st.add(j,"cancelWindow",0,1,.01).name("取消窗口 (s)"),st.add(j,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),st.add(j,"autoCombo").name("按住自动连击"),st.add(j.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),st.add(j.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),st.add(j.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),st.add(j.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),st.add(j.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),st.add(j.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),st.add(j.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),st.add(j.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const _t=r.abilities;st.add(_t.arcane,"perWave",1,8,1).name("每波飞弹数"),st.add(_t.arcane,"waves",1,12,1).name("每次引导波数"),st.add(_t.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),st.add(_t.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),st.add(_t.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),st.add(_t.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),st.add(_t.arcane,"speed",3,24,.5).name("飞弹速度"),st.add(_t.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),st.add(_t.ring,"radius",.5,5,.1).name("电环半径"),st.add(_t.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),st.add(_t.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const Y=h(q,"攻击动作 / 跨步 / 落地");Y.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),Y.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),Y.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const tt=t.animation.stride;Y.add(tt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),Y.add(tt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),Y.add(tt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),Y.add(tt,"cycles",1,3,1).name("每段跨步周期数"),Y.add(tt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),Y.add(tt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),Y.add(tt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),Y.add(tt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),Y.add(tt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),Y.add(tt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),Y.add(tt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),Y.add(tt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),Y.add(tt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),Y.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),Y.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),Y.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),Y.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),Y.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),Y.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),Y.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),Y.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),Y.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),Y.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),Y.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),Y.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const mt=h(q,"武器握持");mt.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),mt.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),mt.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),mt.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const J=r.hits,gt=h(q,"命中 / 受击 / 击退");gt.add(J,"arcDeg",10,120,5).name("命中扇区半角 (°)"),gt.add(J,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),gt.add(J,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),gt.add(J,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),gt.add(J.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),gt.add(J.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),gt.add(J,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),gt.add(J,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Ut=r.targeting,Dt=h(q,"目标辅助");Dt.add(Ut,"targetAssist").name("启用目标辅助"),Dt.add(Ut,"range",1,14,.5).name("锁定范围 (m)"),Dt.add(Ut,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Dt.add(Ut,"frontBias",0,4,.1).name("朝向加权"),Dt.add(Ut,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Dt.add(Ut,"maxLungeScale",1,3,.1).name("前冲最大放大");const Mt=h(q,"受击分层"),Pt=t.hurt;Mt.add(Pt,"enabled").name("启用分层受击 (关=旧版对照)"),Mt.add(Pt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Mt.add(Pt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Mt.add(Pt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Mt.add(Pt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Mt.add(Pt,"upperShiftScale",0,1,.01).name("上身位移缩放"),Mt.add(Pt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Mt.add(Pt.hitHeight,"light",0,1,.01).name("轻击命中部位"),Mt.add(Pt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Mt.add(Pt.hitHeight,"knock",0,1,.01).name("击退命中部位"),Mt.add(Pt,"leanLight",0,1.5,.01).name("轻击力度"),Mt.add(Pt,"leanHeavy",0,1.5,.01).name("重击力度"),Mt.add(Pt,"leanKnock",0,1.5,.01).name("击退力度"),Mt.add(Pt,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:Pt.abdomen},{name:"打肩 (shoulder)",p:Pt.shoulder}].map(({name:D,p:b})=>{const W=h(Mt,D);return W.add(b,"upperPitch",0,2,.01).name("上身前后倾斜"),W.add(b,"upperRoll",0,2,.01).name("上身侧倾"),W.add(b,"upperYaw",0,1.5,.01).name("肩部扭转"),W.add(b,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),W.add(b,"shift",0,.8,.01).name("身体反应位移"),W.add(b,"drop",0,.4,.01).name("整体下沉"),W.add(b,"back",0,.4,.01).name("屁股向后"),W.add(b,"knee",0,1.6,.01).name("屈膝"),W.add(b,"hip",0,1,.01).name("髋前倾"),W.add(b,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),W});const Ct=h(q,"派生招"),G=r.links;Ct.add(G,"enabled").name("总开关 (false=旧连击)"),Ct.add(G.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Ct.add(G.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Ct.add(G.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Ct.add(G,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Ct.add(G,"triggerWhileSprinting").name("长跑中可直接触发"),Ct.add(G.search,"range",1,14,.1).name("索敌距离 (m)"),Ct.add(G.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Ct.add(G.search,"stopDistance",0,3,.05).name("停住距离 (m)");const te=G.moves["sword-shield"];te&&(Ct.add(te,"enabled").name("剑盾盾击"),Ct.add(te,"distance",0,8,.1).name("冲锋极限 (m)"),Ct.add(te,"windup",0,.5,.01).name("前摇 (s)"),Ct.add(te,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Ct.add(te,"recovery",0,.8,.01).name("收势 (s)"),Ct.add(te.hit,"radius",0,4,.05).name("命中半径 (m)"),Ct.add(te.hit,"width",0,2,.05).name("扫掠半径 (m)"),Ct.add(te.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Ct.add(te.hit,"duration",0,1.5,.01).name("僵直 (s)")),Ct.add(r.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const Ft=l("相机"),Nt=h(Ft,"基础");Nt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Nt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Nt.add(t.camera,"distance",6,35,.5).name("距离"),Nt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Nt.add(t.camera,"fov",25,90,1).name("FOV");const Lt=r.camera,Rt=h(Ft,"智能构图");Rt.add(Lt,"radius",2,18,.5).name("威胁评估半径 (m)"),Rt.add(Lt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Rt.add(Lt,"saturation",.5,8,.1).name("威胁归一化饱和"),Rt.add(Lt,"pushIn",0,.5,.01).name("无威胁推进比例"),Rt.add(Lt,"maxPullback",0,1,.02).name("最大拉远比例"),Rt.add(Lt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Rt.add(Lt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Rt.add(Lt,"framingBias",0,1,.05).name("威胁质心平移系数"),Rt.add(Lt,"attackBoost",0,2,.05).name("挥砍中额外加权"),Rt.add(Lt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Rt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const It=h(Ft,"缩放");return It.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),It.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),It.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),It.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),It.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),It.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),It.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),It.add({reset:i.resetZoom},"reset").name("缩放归 1"),o.forEach(D=>D.close()),c.forEach(D=>D.close()),a.close(),{gui:a,refreshWeapon:()=>ft.updateDisplay()}}function bm(n,t,e){let i=null,s=Number.POSITIVE_INFINITY;for(const a of n){const r=Math.hypot(t-a.x,e-a.z);r<=a.radius&&r<s&&(i=a,s=r)}return i}function Em(n,t){return n.find(e=>e.id===t)??null}function Wl(n,t,e){if(n.length===0)return null;const i=[...n].sort((o,c)=>o.index-c.index),s=i.findIndex(o=>o.id===t),a=e<0?-1:1,r=s<0?a>0?0:i.length-1:(s+a+i.length)%i.length;return i[r]??null}function wm({stations:n,world:t,view:e,container:i,onResetZoom:s}){const a=i??document.getElementById("lab-panel");let r=null,o=null;const c=new Map,l=document.createElement("div");l.id="lab-toast",l.setAttribute("aria-live","polite"),document.body.appendChild(l);let h=0;function f(g){l.textContent=`${g.index} · ${g.name} — ${g.hint}`,l.style.borderColor=g.color,l.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>l.classList.remove("is-on"),5e3)}function d(){return bm(n,t.character.position.x,t.character.position.z)}function u(){const g=d(),m=(g==null?void 0:g.id)??null;if(m===r)return;const x=r!==null;r=m;for(const[_,y]of c)y.classList.toggle("is-active",_===m);o&&(o.textContent=g?`${g.index} · ${g.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",o.style.color=g?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),g?f(g):x&&l.classList.remove("is-on")}function p(g){const m=typeof g=="number"?n.find(x=>x.index===g)??null:Em(n,g);return m?(gp(t,m.spawnX,m.spawnZ),t.camera.centroidX=m.spawnX,t.camera.centroidZ=m.spawnZ,e.snapCamera(m.spawnX,t.character.position.y,m.spawnZ),u(),!0):!1}function v(){Ud(t)}if(a){a.textContent="";const g=document.createElement("div");g.className="lab-head",g.textContent="测试工位";const m=document.createElement("span");m.className="lab-tip",m.textContent="[ / ] 切换",g.appendChild(m),a.appendChild(g);for(const y of[...n].sort((P,S)=>P.index-S.index)){const P=document.createElement("button");P.type="button",P.className="lab-row",P.dataset.station=y.id,P.dataset.uiButton="",P.style.setProperty("--lab-color",y.color),P.setAttribute("aria-label",`传送到工位 ${y.index}：${y.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(y.index);const w=document.createElement("span");w.className="lab-name",w.textContent=y.name,P.append(S,w),P.addEventListener("pointerdown",A=>{A.preventDefault(),A.stopPropagation(),p(y.id)}),a.appendChild(P),c.set(y.id,P)}o=document.createElement("div"),o.className="lab-hint",a.appendChild(o);const x=document.createElement("div");x.className="lab-foot";const _=document.createElement("button");if(_.type="button",_.className="lab-btn",_.dataset.uiButton="",_.textContent="召回假人",_.setAttribute("aria-label","召回全部假人回到各自工位"),_.addEventListener("pointerdown",y=>{y.preventDefault(),y.stopPropagation(),v()}),x.appendChild(_),s){const y=document.createElement("button");y.type="button",y.className="lab-btn",y.dataset.uiButton="",y.textContent="镜头归位",y.setAttribute("aria-label","把镜头缩放恢复到默认"),y.addEventListener("pointerdown",P=>{P.preventDefault(),P.stopPropagation(),s()}),x.appendChild(y)}a.appendChild(x)}return window.addEventListener("keydown",g=>{var m,x;if(!(g.metaKey||g.ctrlKey||g.altKey))if(g.key==="["){const _=Wl(n,((m=d())==null?void 0:m.id)??r,-1);_&&p(_.id)}else if(g.key==="]"){const _=Wl(n,((x=d())==null?void 0:x.id)??r,1);_&&p(_.id)}else g.key==="\\"&&v()}),u(),{goto:p,current:d,tick:u,recall:v,element:a}}const zr=Math.PI*2,Ln={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},Am=45,Tm=50;function Rm(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function As(n,t,e){const i=Rm(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function Cm(n,t){return Math.atan2(n,-t)*180/Math.PI}function $l(n,t){return Math.abs(((n-t)%360+540)%360-180)}function oa(n){return(n%360+360)%360}const Pm={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function Lm(n,t,e,i=8){const s=n.character,a=t.intents,r=Math.hypot(a.moveX,a.moveZ),o=Math.hypot(t.stickRawX,t.stickRawY),c=s.velocity,l=Math.hypot(c.x,c.z),h=r>.001?As(a.moveX,a.moveZ,e):null,f=l>.15?As(c.x,c.z,e):null,d=As(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?As(a.aimX,a.aimZ,e):null,p=n.targeting,v=p.hasTarget?As(Math.sin(p.targetYaw),Math.cos(p.targetYaw),e):null,g=h!==null&&f!==null?$l(h,f):null,m=h!==null?$l(h,d):null,x=g!==null&&g>Am&&r>=.35&&l>=.4;return{inDeg:h,inLen:Math.min(1,r),rawDeg:o>.02?Cm(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,o),stickHeld:t.stickHeld,moveDeg:f,speed:l,faceDeg:d,lockDeg:v,lockId:p.targetId,lockDist:p.targetDist,aimDeg:u,gapMove:g,gapFace:m,warnMove:x}}function Yl(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>Tm&&(n.inLen>=.35||n.speed>=.4)}const Zl="harness.dirDebug";function Dm(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),r={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},o=s.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(Zl)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),a&&(a.textContent=c?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(c)))}l();function h(_){if(c=_,!t)try{window.localStorage.setItem(Zl,_?"1":"0")}catch{}l()}a==null||a.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),h(!c)}),t||window.addEventListener("keydown",_=>{_.key.toLowerCase()==="v"&&!_.metaKey&&!_.ctrlKey&&h(!c)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;s.width=Math.round(d*f),s.height=Math.round(d*f);let u=Pm,p=0,v="",g=8;function m(_){if(!o)return;const y=d,P=d,S=y/2,w=P/2,A=Math.min(y,P)/2-13;o.setTransform(f,0,0,f,0,0),o.clearRect(0,0,y,P),o.beginPath(),o.arc(S,w,A,0,zr),o.fillStyle="rgba(8, 12, 17, 0.5)",o.fill(),o.lineWidth=1,o.strokeStyle=_.warnMove?"rgba(251, 191, 36, 0.85)":Ln.ring,o.stroke(),o.strokeStyle=Ln.grid,o.beginPath(),o.moveTo(S-A,w),o.lineTo(S+A,w),o.moveTo(S,w-A),o.lineTo(S,w+A),o.stroke();for(let U=0;U<8;U++){const F=U*Math.PI/4,B=S+Math.sin(F)*(A-3),L=w-Math.cos(F)*(A-3),C=S+Math.sin(F)*A,X=w-Math.cos(F)*A;o.beginPath(),o.moveTo(B,L),o.lineTo(C,X),o.stroke()}const E=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;E>0&&(o.save(),o.setLineDash([2,3]),o.strokeStyle=Ln.dead,o.beginPath(),o.arc(S,w,A*E,0,zr),o.stroke(),o.restore());const M=(U,F,B,L,C=!1,X=1)=>{const H=U*Math.PI/180,q=Math.sin(H),j=-Math.cos(H),st=A*Math.max(.14,Math.min(1,F)),ft=S+q*A*.14,_t=w+j*A*.14,Y=S+q*st,tt=w+j*st;if(o.save(),o.globalAlpha=X,o.strokeStyle=B,o.fillStyle=B,o.lineWidth=L,o.lineCap="round",C&&o.setLineDash([3,3]),o.beginPath(),o.moveTo(ft,_t),o.lineTo(Y,tt),o.stroke(),!C&&st>A*.3){const mt=-j,J=q,gt=5.2;o.beginPath(),o.moveTo(Y+q*1.5,tt+j*1.5),o.lineTo(Y-q*gt+mt*gt*.72,tt-j*gt+J*gt*.72),o.lineTo(Y-q*gt-mt*gt*.72,tt-j*gt-J*gt*.72),o.closePath(),o.fill()}o.restore()},R=(U,F)=>{const B=U*Math.PI/180,L=Math.sin(B),C=-Math.cos(B),X=-C,H=L,q=A+1.5,j=q+6.5;o.save(),o.fillStyle=F,o.strokeStyle=F,o.lineWidth=1,o.beginPath(),o.moveTo(S+L*j,w+C*j),o.lineTo(S+L*q+X*4,w+C*q+H*4),o.lineTo(S+L*q-X*4,w+C*q-H*4),o.closePath(),o.fill(),o.restore()};_.lockDeg!==null&&M(_.lockDeg,1,Ln.lock,1,!0,.7),_.rawDeg!==null&&_.stickHeld&&M(_.rawDeg,_.rawLen,Ln.raw,1,!0,.9),_.aimDeg!==null&&M(_.aimDeg,1,Ln.aim,1.6,!0,.95),M(_.faceDeg,1,Ln.face,1.1,!0,.55),_.moveDeg!==null&&M(_.moveDeg,_.speed/Math.max(1,g),Ln.move,5.5,!1,.8),_.inDeg!==null&&M(_.inDeg,_.inLen,Ln.input,2.2),R(_.faceDeg,Ln.face),o.beginPath(),o.arc(S,w,2.2,0,zr),o.fillStyle="rgba(220, 235, 248, 0.85)",o.fill()}function x(_,y){const P=A=>A===null?"-":String(Math.round(oa(A)));r.in.textContent=`入 ${P(_.inDeg)}`,r.mv.textContent=`移 ${P(_.moveDeg)}`,r.fc.textContent=`面 ${P(_.faceDeg)}`;const S=A=>A===null?"-":`${Math.round(A)}°`,w=[`Δ入→移 ${S(_.gapMove)}`,`Δ入→面 ${S(_.gapFace)}`];_.speed>.05&&w.push(`v${_.speed.toFixed(1)}`),_.lockDeg!==null&&w.push(`锁#${_.lockId} ${_.lockDist.toFixed(1)}m`),_.aimDeg!==null&&w.push("拖拽瞄准"),r.gap.textContent=w.join("  "),e.classList.toggle("is-warn",_.warnMove||Yl(_,y))}return{update(_,y,P){if(!c)return;g=Math.max(1,_.config.moveSpeed*Math.max(1,_.config.sprintMultiplier));const S=Lm(_,y,P,g);u=S;const w=_.combat.phase!=="idle";m(S);const A=performance.now(),E=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(A-p>90||E!==v)&&(p=A,v=E,x(S,w),e.dataset.in=S.inDeg===null?"":oa(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":oa(S.moveDeg).toFixed(1),e.dataset.fc=oa(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||Yl(S,w)?"1":"0")},setEnabled:h,toggle(){return h(!c),c},enabled:()=>c,last:()=>u}}const Im=6,km=480,ql=240,jl=92,Um=18;function Fm(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function Nm(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function zm(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function Om(n={}){const t=Math.max(1,n.windowS??Im),e=Math.max(60,n.capacity??km),i=Math.max(1,n.speedCap??Um),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const r=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${r}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${r}</div>`].join("");const o=n.toggle??a.querySelector("#motiondbg-toggle"),c=a.querySelector("#motiondbg-graph"),l=a.querySelector("#motiondbg-read"),h=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=c.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(ql*u),c.height=Math.round(jl*u);const p=Dm({deadZone:n.deadZone,container:f,embedded:!0});let v=!1;function g(A){v=A,a.classList.toggle("is-off",!A),!s&&o&&(o.textContent=A?"手感 ⌄":"手感 ▸",o.setAttribute("aria-expanded",String(A)),o.setAttribute("aria-label",A?"收起手感调试面板":"展开手感调试面板"))}g(!1),s||(o==null||o.addEventListener("pointerdown",A=>{A.preventDefault(),A.stopPropagation(),g(!v)}),window.addEventListener("keydown",A=>{A.key.toLowerCase()==="v"&&!A.metaKey&&!A.ctrlKey&&g(!v)}));const m=[];let x=0,_=null,y=-1,P={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(A){const E=A-t;let M=0;for(;M<m.length&&m[M].t<E;)M++;return m.slice(M)}function w(A,E){if(!d)return;const M=ql,R=jl;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,R),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,R);const U=4,F=4,B=M-U-F,L=9,C=46,X=62,H=22,q=E-t,j=J=>U+Math.max(0,Math.min(1,(J-q)/t))*B;for(let J=0;J<A.length;J++){if(!A[J].busy)continue;const gt=j(A[J].t),Ut=J+1<A.length?j(A[J+1].t):gt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(gt,L,Math.max(2,Ut-gt),C)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const J of[L,L+C/2,L+C])d.moveTo(U,J),d.lineTo(M-F,J);d.moveTo(U,X+H/2),d.lineTo(M-F,X+H/2),d.stroke();const ft=Math.max(1,...A.map(J=>J.speed),...A.map(J=>J.drive))*1.15,_t=J=>L+C-J/ft*C;if(A.length>1){d.beginPath(),d.moveTo(j(A[0].t),_t(A[0].speed));for(let J=1;J<A.length;J++)d.lineTo(j(A[J].t),_t(A[J].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(j(A[A.length-1].t),L+C),d.lineTo(j(A[0].t),L+C),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(j(A[0].t),_t(A[0].drive));for(let J=1;J<A.length;J++)d.lineTo(j(A[J].t),_t(A[J].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let Y=.02;for(const J of A)Y=Math.max(Y,Math.abs(J.dv));Y*=1.1;const tt=X+H/2,mt=H/2;for(const J of A){const gt=Math.min(mt,Math.abs(J.dv)/Y*mt);d.fillStyle=J.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(j(J.t)-.7,J.dv>=0?tt-gt:tt,1.4,Math.max(.5,gt))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(ft.toFixed(1),U+2,L+8),d.fillText("v",U+2,L+C-2),d.fillText("Δv",U+2,X+9),d.textAlign="right",d.fillText("0",M-F-2,L+C-2),d.textAlign="left"}return{dirDebug:p,update(A,E,M){const R=performance.now()/1e3,U=y<0?1/60:Math.max(1e-4,Math.min(.25,R-y));y=R;const F=A.character,B={x:F.position.x,z:F.position.z},L=Math.hypot(F.velocity.x,F.velocity.z),{speed:C,raw:X}=_?Nm(_,B,U,i):{speed:0,raw:0},H=Fm(x,C,U,R);H.drive=L,H.raw=X,H.busy=zm(A),_=B,x=C,m.push(H),m.length>e&&m.shift();const q=S(R);let j=0;for(const st of q)j=Math.max(j,st.speed);if(P={speed:C,drive:L,raw:X,dv:H.dv,accel:H.accel,peak:j,samples:q.length,windowS:t,busy:H.busy},p.update(A,E,M),v){w(q,R);const st=H.dv>=0?"+":"";l.textContent=`v ${C.toFixed(2)} · 驱 ${L.toFixed(2)} · 峰 ${j.toFixed(2)} · Δv ${st}${H.dv.toFixed(3)} · ${q.length} 帧`}},setEnabled:g,toggle(){return g(!v),v},enabled:()=>v,last:()=>({...P}),samples:()=>S(performance.now()/1e3).map(A=>({...A}))}}const Bm=["剑盾","双剑","大剑","法杖","弓"],Hm={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function Gm(n){return{update(t,e,i,s,a,r,o=!1){const c=t.character,l=c.position,h=c.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=Pt=>Pt.toFixed(2),p=Pt=>(Pt*180/Math.PI).toFixed(0),v=Bm[Pi.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),m="|".repeat(g)+".".repeat(10-g),x=t.dash,_=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,y=x.phase==="active"?`${x.kind}@${_.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,P=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",S=h.x*Math.sin(c.bodyYaw)+h.z*Math.cos(c.bodyYaw),w=h.x*Math.cos(c.bodyYaw)-h.z*Math.sin(c.bodyYaw),A=Math.abs(S)+Math.abs(w)+1e-6,E=Math.round(Math.abs(w)/A*100),M=`strafe ${E}%${S<-.05?" back":""}`,R=t.camera,U=`threat ${(R.threat*100).toFixed(0)}%  dist×${u(R.distanceScale)}  off (${u(R.offsetX)},${u(R.offsetZ)})  pitch +${u(R.pitchDelta)}°  n=${R.threatCount}`,F=r?u(r.attackBlend):"-",B=r==null?void 0:r.attackWeights,L=B?`gw ${u(B.gaitScale)}  lw ${u(B.attackLegWeight)}  spd ${u(B.driveSpeed)}`:"-",C=B?`${u(B.gaitScale)}/${u(B.attackLegWeight)}`:"-",X=r?`${r.landing.kind} ${u(r.landing.pulse)} t${u(r.landing.remaining)} vy${u(r.landing.impactVy)}`:"-",H=r?`${r.landing.kind}/${u(r.landing.pulse)}`:"-",q=(r==null?void 0:r.zoom)!==void 0?`zoom ×${u(r.zoom)}`:"-",j=r==null?void 0:r.hurt,st=j?`hurt ${t.playerHurt.type}  部位h${u(j.hitHeight)}  脉冲p${u(j.pulse)}  上身${u(j.upperShift)}  重心${u(j.comShift)}  后坐${u(j.pelvisBack)}  屈膝${u(j.knee)}`:"-",ft=j?`${u(j.hitHeight)}/${u(j.pulse)}/${u(j.knee)}`:"-",_t=r==null?void 0:r.ik,Y=_t?`${_t.active?"on":"off"} w${u(_t.weight)} e${u(_t.maxError)}`:"-",tt=t.playerLink,mt=`link ${tt.kind||"-"}  ${tt.phase}  prog ${u(tt.progress)}  win ${u(tt.linkWindow)}s  cd ${u(tt.cooldown)}s  hits ${tt.hitIds.length}  travel ${u(tt.travelled)}/${u(tt.travel)}m  id ${tt.id}`,J=`${tt.phase}/${tt.kind||"-"}/w${u(tt.linkWindow)}`,gt=s.lastGesture,Ut=gt?`${gt.button} ${gt.kind} ${gt.heldMs.toFixed(0)}ms d${gt.distance.toFixed(0)}px ${gt.angleDeg.toFixed(0)}° taps${gt.taps}`:"-",Dt=t.dummies.map(Pt=>`${Pt.id}:${Hm[Pt.mode]}`).join("  ");if(o){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${f.phase} · lk ${tt.phase}${tt.kind?`/${tt.kind}`:""} w${u(tt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(l.x)},${u(l.y)},${u(l.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${p(c.facing)}  body ${p(c.bodyYaw)}  head ${p(c.headYaw)}  move ${p(c.moveYaw)}  st${E}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(c.stride)}`,`weapon ${v}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${y}  ab ${F}  gw/lw ${C}  land ${H}  ik ${Y}`,`aim ${P}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ft}`,`dummies ${Dt}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${u(R.distanceScale)}  ${q}  lk ${J}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${Ut}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(l.x)}, ${u(l.y)}, ${u(l.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${p(c.facing)}deg   atkBlend ${F}   ${L}   land ${X}`,st,`ik ${Y}  clamped ${_t?_t.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${p(c.facing)}  body ${p(c.bodyYaw)}  head ${p(c.headYaw)}  move ${p(c.moveYaw)}  (head-body ${p(c.headYaw-c.bodyYaw)})  ${M}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${P}`,`weapon ${v}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${_.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,mt,`camera ${U}  ${q}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${p(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${m}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Dt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${Ut}`].join(`
`)}}}const ca=["lab","hud","motion","debug"],Kl={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Jl={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Vm(n){var c;const t=Object.fromEntries(ca.map(l=>[l,document.getElementById(Jl[l].toggle)])),e=Object.fromEntries(ca.map(l=>[l,document.getElementById(Jl[l].panel)]));let i={},s=null;function a(){var l,h,f;for(const d of ca){const u=s===d,p=t[d],v=e[d];p&&(p.setAttribute("aria-expanded",String(u)),p.textContent=`${Kl[d].short} ${u?"▾":"▸"}`,p.setAttribute("aria-label",`${u?"收起":"展开"}${Kl[d].full}`)),v&&v.classList.toggle("is-open",u)}n.classList.toggle("is-compact",s!=="hud"),(l=i.motion)==null||l.setEnabled(s==="motion"),s==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function r(l){s=s===l?null:l,a()}function o(){s!==null&&(s=null,a())}for(const l of ca)(c=t[l])==null||c.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),r(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&r("motion")}),a(),{hudCompact:()=>s!=="hud",register(l){i=l,a()},toggle:r,closeAll:o,isOpen:l=>s===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Vc="170",Xm=0,Ql=1,Wm=2,Bd=1,Hd=2,Vn=3,oi=0,nn=1,Te=2,ai=0,os=1,Ei=2,th=3,eh=4,$m=5,wi=100,Ym=101,Zm=102,qm=103,jm=104,Km=200,Jm=201,Qm=202,t0=203,Bo=204,Ho=205,e0=206,n0=207,i0=208,s0=209,a0=210,r0=211,o0=212,c0=213,l0=214,Go=0,Vo=1,Xo=2,us=3,Wo=4,$o=5,Yo=6,Zo=7,Xc=0,h0=1,d0=2,ri=0,u0=1,f0=2,p0=3,m0=4,g0=5,x0=6,v0=7,Gd=300,fs=301,ps=302,qo=303,jo=304,mr=306,Ko=1e3,Ti=1001,Jo=1002,An=1003,_0=1004,la=1005,In=1006,Or=1007,Ri=1008,qn=1009,Vd=1010,Xd=1011,$s=1012,Wc=1013,Li=1014,$n=1015,ta=1016,$c=1017,Yc=1018,ms=1020,Wd=35902,$d=1021,Yd=1022,wn=1023,Zd=1024,qd=1025,cs=1026,gs=1027,jd=1028,Zc=1029,Kd=1030,qc=1031,jc=1033,Xa=33776,Wa=33777,$a=33778,Ya=33779,Qo=35840,tc=35841,ec=35842,nc=35843,ic=36196,sc=37492,ac=37496,rc=37808,oc=37809,cc=37810,lc=37811,hc=37812,dc=37813,uc=37814,fc=37815,pc=37816,mc=37817,gc=37818,xc=37819,vc=37820,_c=37821,Za=36492,yc=36494,Mc=36495,Jd=36283,Sc=36284,bc=36285,Ec=36286,y0=3200,M0=3201,Qd=0,S0=1,ii="",je="srgb",vs="srgb-linear",gr="linear",ge="srgb",Bi=7680,nh=519,b0=512,E0=513,w0=514,tu=515,A0=516,T0=517,R0=518,C0=519,wc=35044,ih="300 es",Yn=2e3,cr=2001;class _s{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}}const We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let sh=1234567;const ls=Math.PI/180,Ys=180/Math.PI;function Un(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]).toLowerCase()}function Xe(n,t,e){return Math.max(t,Math.min(e,n))}function Kc(n,t){return(n%t+t)%t}function P0(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function L0(n,t,e){return n!==t?(e-n)/(t-n):0}function zs(n,t,e){return(1-e)*n+e*t}function D0(n,t,e,i){return zs(n,t,1-Math.exp(-e*i))}function I0(n,t=1){return t-Math.abs(Kc(n,t*2)-t)}function k0(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function U0(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function F0(n,t){return n+Math.floor(Math.random()*(t-n+1))}function N0(n,t){return n+Math.random()*(t-n)}function z0(n){return n*(.5-Math.random())}function O0(n){n!==void 0&&(sh=n);let t=sh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function B0(n){return n*ls}function H0(n){return n*Ys}function G0(n){return(n&n-1)===0&&n!==0}function V0(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function X0(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function W0(n,t,e,i,s){const a=Math.cos,r=Math.sin,o=a(e/2),c=r(e/2),l=a((t+i)/2),h=r((t+i)/2),f=a((t-i)/2),d=r((t-i)/2),u=a((i-t)/2),p=r((i-t)/2);switch(s){case"XYX":n.set(o*h,c*f,c*d,o*l);break;case"YZY":n.set(c*d,o*h,c*f,o*l);break;case"ZXZ":n.set(c*f,c*d,o*h,o*l);break;case"XZX":n.set(o*h,c*p,c*u,o*l);break;case"YXY":n.set(c*u,o*h,c*p,o*l);break;case"ZYZ":n.set(c*p,c*u,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function En(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function me(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const ah={DEG2RAD:ls,RAD2DEG:Ys,generateUUID:Un,clamp:Xe,euclideanModulo:Kc,mapLinear:P0,inverseLerp:L0,lerp:zs,damp:D0,pingpong:I0,smoothstep:k0,smootherstep:U0,randInt:F0,randFloat:N0,randFloatSpread:z0,seededRandom:O0,degToRad:B0,radToDeg:H0,isPowerOfTwo:G0,ceilPowerOfTwo:V0,floorPowerOfTwo:X0,setQuaternionFromProperEuler:W0,normalize:me,denormalize:En};class Bt{constructor(t=0,e=0){Bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*s+t.x,this.y=a*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ee{constructor(t,e,i,s,a,r,o,c,l){ee.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,r,o,c,l)}set(t,e,i,s,a,r,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=a,h[5]=c,h[6]=i,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,r=i[0],o=i[3],c=i[6],l=i[1],h=i[4],f=i[7],d=i[2],u=i[5],p=i[8],v=s[0],g=s[3],m=s[6],x=s[1],_=s[4],y=s[7],P=s[2],S=s[5],w=s[8];return a[0]=r*v+o*x+c*P,a[3]=r*g+o*_+c*S,a[6]=r*m+o*y+c*w,a[1]=l*v+h*x+f*P,a[4]=l*g+h*_+f*S,a[7]=l*m+h*y+f*w,a[2]=d*v+u*x+p*P,a[5]=d*g+u*_+p*S,a[8]=d*m+u*y+p*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*o*l-i*a*h+i*o*c+s*a*l-s*r*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=h*r-o*l,d=o*c-h*a,u=l*a-r*c,p=e*f+i*d+s*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=f*v,t[1]=(s*l-h*i)*v,t[2]=(o*i-s*r)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*a-o*e)*v,t[6]=u*v,t[7]=(i*c-l*e)*v,t[8]=(r*e-i*a)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,r,o){const c=Math.cos(a),l=Math.sin(a);return this.set(i*c,i*l,-i*(c*r+l*o)+r+t,-s*l,s*c,-s*(-l*r+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Br.makeScale(t,e)),this}rotate(t){return this.premultiply(Br.makeRotation(-t)),this}translate(t,e){return this.premultiply(Br.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Br=new ee;function eu(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function lr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function $0(){const n=lr("canvas");return n.style.display="block",n}const rh={};function Us(n){n in rh||(rh[n]=!0,console.warn(n))}function Y0(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function Z0(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function q0(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const he={enabled:!0,workingColorSpace:vs,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ge&&(n.r=Zn(n.r),n.g=Zn(n.g),n.b=Zn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ge&&(n.r=hs(n.r),n.g=hs(n.g),n.b=hs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ii?gr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Zn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function hs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const oh=[.64,.33,.3,.6,.15,.06],ch=[.2126,.7152,.0722],lh=[.3127,.329],hh=new ee().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),dh=new ee().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);he.define({[vs]:{primaries:oh,whitePoint:lh,transfer:gr,toXYZ:hh,fromXYZ:dh,luminanceCoefficients:ch,workingColorSpaceConfig:{unpackColorSpace:je},outputColorSpaceConfig:{drawingBufferColorSpace:je}},[je]:{primaries:oh,whitePoint:lh,transfer:ge,toXYZ:hh,fromXYZ:dh,luminanceCoefficients:ch,outputColorSpaceConfig:{drawingBufferColorSpace:je}}});let Hi;class j0{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Hi===void 0&&(Hi=lr("canvas")),Hi.width=t.width,Hi.height=t.height;const i=Hi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Hi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=lr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Zn(a[r]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Zn(e[i]/255)*255):e[i]=Zn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let K0=0;class nu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:K0++}),this.uuid=Un(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Hr(s[r].image)):a.push(Hr(s[r]))}else a=Hr(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function Hr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?j0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let J0=0;class Je extends _s{constructor(t=Je.DEFAULT_IMAGE,e=Je.DEFAULT_MAPPING,i=Ti,s=Ti,a=In,r=Ri,o=wn,c=qn,l=Je.DEFAULT_ANISOTROPY,h=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:J0++}),this.uuid=Un(),this.name="",this.source=new nu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Bt(0,0),this.repeat=new Bt(1,1),this.center=new Bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ee,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Gd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ko:t.x=t.x-Math.floor(t.x);break;case Ti:t.x=t.x<0?0:1;break;case Jo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ko:t.y=t.y-Math.floor(t.y);break;case Ti:t.y=t.y<0?0:1;break;case Jo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Je.DEFAULT_IMAGE=null;Je.DEFAULT_MAPPING=Gd;Je.DEFAULT_ANISOTROPY=1;class Re{constructor(t=0,e=0,i=0,s=1){Re.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*i+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const c=t.elements,l=c[0],h=c[4],f=c[8],d=c[1],u=c[5],p=c[9],v=c[2],g=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(f-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+v)<.1&&Math.abs(p+g)<.1&&Math.abs(l+u+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(l+1)/2,y=(u+1)/2,P=(m+1)/2,S=(h+d)/4,w=(f+v)/4,A=(p+g)/4;return _>y&&_>P?_<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(_),s=S/i,a=w/i):y>P?y<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(y),i=S/s,a=A/s):P<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(P),i=w/a,s=A/a),this.set(i,s,a,e),this}let x=Math.sqrt((g-p)*(g-p)+(f-v)*(f-v)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(g-p)/x,this.y=(f-v)/x,this.z=(d-h)/x,this.w=Math.acos((l+u+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Q0 extends _s{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Re(0,0,t,e),this.scissorTest=!1,this.viewport=new Re(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:In,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new Je(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new nu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Di extends Q0{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class iu extends Je{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class tg extends Je{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ea{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,r,o){let c=i[s+0],l=i[s+1],h=i[s+2],f=i[s+3];const d=a[r+0],u=a[r+1],p=a[r+2],v=a[r+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(o===1){t[e+0]=d,t[e+1]=u,t[e+2]=p,t[e+3]=v;return}if(f!==v||c!==d||l!==u||h!==p){let g=1-o;const m=c*d+l*u+h*p+f*v,x=m>=0?1:-1,_=1-m*m;if(_>Number.EPSILON){const P=Math.sqrt(_),S=Math.atan2(P,m*x);g=Math.sin(g*S)/P,o=Math.sin(o*S)/P}const y=o*x;if(c=c*g+d*y,l=l*g+u*y,h=h*g+p*y,f=f*g+v*y,g===1-o){const P=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=P,l*=P,h*=P,f*=P}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,r){const o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],f=a[r],d=a[r+1],u=a[r+2],p=a[r+3];return t[e]=o*p+h*f+c*u-l*d,t[e+1]=c*p+h*d+l*f-o*u,t[e+2]=l*p+h*u+o*d-c*f,t[e+3]=h*p-o*f-c*d-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),f=o(a/2),d=c(i/2),u=c(s/2),p=c(a/2);switch(r){case"XYZ":this._x=d*h*f+l*u*p,this._y=l*u*f-d*h*p,this._z=l*h*p+d*u*f,this._w=l*h*f-d*u*p;break;case"YXZ":this._x=d*h*f+l*u*p,this._y=l*u*f-d*h*p,this._z=l*h*p-d*u*f,this._w=l*h*f+d*u*p;break;case"ZXY":this._x=d*h*f-l*u*p,this._y=l*u*f+d*h*p,this._z=l*h*p+d*u*f,this._w=l*h*f-d*u*p;break;case"ZYX":this._x=d*h*f-l*u*p,this._y=l*u*f+d*h*p,this._z=l*h*p-d*u*f,this._w=l*h*f+d*u*p;break;case"YZX":this._x=d*h*f+l*u*p,this._y=l*u*f+d*h*p,this._z=l*h*p-d*u*f,this._w=l*h*f-d*u*p;break;case"XZY":this._x=d*h*f-l*u*p,this._y=l*u*f-d*h*p,this._z=l*h*p+d*u*f,this._w=l*h*f+d*u*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],r=e[1],o=e[5],c=e[9],l=e[2],h=e[6],f=e[10],d=i+o+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-c)*u,this._y=(a-l)*u,this._z=(r-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(h-c)/u,this._x=.25*u,this._y=(s+r)/u,this._z=(a+l)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(a-l)/u,this._x=(s+r)/u,this._y=.25*u,this._z=(c+h)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(r-s)/u,this._x=(a+l)/u,this._y=(c+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xe(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,r=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-i*l,this._z=a*h+r*l+i*c-s*o,this._w=r*h-i*o-s*c-a*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,r=this._w;let o=r*t._w+i*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=i,this._y=s,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const u=1-e;return this._w=u*r+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),f=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=r*f+this._w*d,this._x=i*f+this._x*d,this._y=s*f+this._y*d,this._z=a*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{constructor(t=0,e=0,i=0){V.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(uh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(uh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,r=t.y,o=t.z,c=t.w,l=2*(r*s-o*i),h=2*(o*e-a*s),f=2*(a*i-r*e);return this.x=e+c*l+r*f-o*h,this.y=i+c*h+o*l-a*f,this.z=s+c*f+a*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,r=e.x,o=e.y,c=e.z;return this.x=s*c-a*o,this.y=a*r-i*c,this.z=i*o-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Gr.copy(this).projectOnVector(t),this.sub(Gr)}reflect(t){return this.sub(Gr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Xe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Gr=new V,uh=new ea;class na{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Mn):Mn.fromBufferAttribute(a,r),Mn.applyMatrix4(t.matrixWorld),this.expandByPoint(Mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ha.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ha.copy(i.boundingBox)),ha.applyMatrix4(t.matrixWorld),this.union(ha)}const s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Mn),Mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ts),da.subVectors(this.max,Ts),Gi.subVectors(t.a,Ts),Vi.subVectors(t.b,Ts),Xi.subVectors(t.c,Ts),Kn.subVectors(Vi,Gi),Jn.subVectors(Xi,Vi),ui.subVectors(Gi,Xi);let e=[0,-Kn.z,Kn.y,0,-Jn.z,Jn.y,0,-ui.z,ui.y,Kn.z,0,-Kn.x,Jn.z,0,-Jn.x,ui.z,0,-ui.x,-Kn.y,Kn.x,0,-Jn.y,Jn.x,0,-ui.y,ui.x,0];return!Vr(e,Gi,Vi,Xi,da)||(e=[1,0,0,0,1,0,0,0,1],!Vr(e,Gi,Vi,Xi,da))?!1:(ua.crossVectors(Kn,Jn),e=[ua.x,ua.y,ua.z],Vr(e,Gi,Vi,Xi,da))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(zn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const zn=[new V,new V,new V,new V,new V,new V,new V,new V],Mn=new V,ha=new na,Gi=new V,Vi=new V,Xi=new V,Kn=new V,Jn=new V,ui=new V,Ts=new V,da=new V,ua=new V,fi=new V;function Vr(n,t,e,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){fi.fromArray(n,a);const o=s.x*Math.abs(fi.x)+s.y*Math.abs(fi.y)+s.z*Math.abs(fi.z),c=t.dot(fi),l=e.dot(fi),h=i.dot(fi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const eg=new na,Rs=new V,Xr=new V;class xr{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):eg.setFromPoints(t).getCenter(i);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Rs.subVectors(t,this.center);const e=Rs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Rs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Xr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Rs.copy(t.center).add(Xr)),this.expandByPoint(Rs.copy(t.center).sub(Xr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const On=new V,Wr=new V,fa=new V,Qn=new V,$r=new V,pa=new V,Yr=new V;class Jc{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,On)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=On.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(On.copy(this.origin).addScaledVector(this.direction,e),On.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Wr.copy(t).add(e).multiplyScalar(.5),fa.copy(e).sub(t).normalize(),Qn.copy(this.origin).sub(Wr);const a=t.distanceTo(e)*.5,r=-this.direction.dot(fa),o=Qn.dot(this.direction),c=-Qn.dot(fa),l=Qn.lengthSq(),h=Math.abs(1-r*r);let f,d,u,p;if(h>0)if(f=r*c-o,d=r*o-c,p=a*h,f>=0)if(d>=-p)if(d<=p){const v=1/h;f*=v,d*=v,u=f*(f+r*d+2*o)+d*(r*f+d+2*c)+l}else d=a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*c)+l;else d=-a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*c)+l;else d<=-p?(f=Math.max(0,-(-r*a+o)),d=f>0?-a:Math.min(Math.max(-a,-c),a),u=-f*f+d*(d+2*c)+l):d<=p?(f=0,d=Math.min(Math.max(-a,-c),a),u=d*(d+2*c)+l):(f=Math.max(0,-(r*a+o)),d=f>0?a:Math.min(Math.max(-a,-c),a),u=-f*f+d*(d+2*c)+l);else d=r>0?-a:a,f=Math.max(0,-(r*d+o)),u=-f*f+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Wr).addScaledVector(fa,d),u}intersectSphere(t,e){On.subVectors(t.center,this.origin);const i=On.dot(this.direction),s=On.dot(On)-i*i,a=t.radius*t.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(a=(t.min.y-d.y)*h,r=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,r=(t.min.y-d.y)*h),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(t.min.z-d.z)*f,c=(t.max.z-d.z)*f):(o=(t.max.z-d.z)*f,c=(t.min.z-d.z)*f),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,On)!==null}intersectTriangle(t,e,i,s,a){$r.subVectors(e,t),pa.subVectors(i,t),Yr.crossVectors($r,pa);let r=this.direction.dot(Yr),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Qn.subVectors(this.origin,t);const c=o*this.direction.dot(pa.crossVectors(Qn,pa));if(c<0)return null;const l=o*this.direction.dot($r.cross(Qn));if(l<0||c+l>r)return null;const h=-o*Qn.dot(Yr);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Me{constructor(t,e,i,s,a,r,o,c,l,h,f,d,u,p,v,g){Me.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,r,o,c,l,h,f,d,u,p,v,g)}set(t,e,i,s,a,r,o,c,l,h,f,d,u,p,v,g){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=a,m[5]=r,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=f,m[14]=d,m[3]=u,m[7]=p,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Me().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Wi.setFromMatrixColumn(t,0).length(),a=1/Wi.setFromMatrixColumn(t,1).length(),r=1/Wi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*r,e[9]=i[9]*r,e[10]=i[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const d=r*h,u=r*f,p=o*h,v=o*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=u+p*l,e[5]=d-v*l,e[9]=-o*c,e[2]=v-d*l,e[6]=p+u*l,e[10]=r*c}else if(t.order==="YXZ"){const d=c*h,u=c*f,p=l*h,v=l*f;e[0]=d+v*o,e[4]=p*o-u,e[8]=r*l,e[1]=r*f,e[5]=r*h,e[9]=-o,e[2]=u*o-p,e[6]=v+d*o,e[10]=r*c}else if(t.order==="ZXY"){const d=c*h,u=c*f,p=l*h,v=l*f;e[0]=d-v*o,e[4]=-r*f,e[8]=p+u*o,e[1]=u+p*o,e[5]=r*h,e[9]=v-d*o,e[2]=-r*l,e[6]=o,e[10]=r*c}else if(t.order==="ZYX"){const d=r*h,u=r*f,p=o*h,v=o*f;e[0]=c*h,e[4]=p*l-u,e[8]=d*l+v,e[1]=c*f,e[5]=v*l+d,e[9]=u*l-p,e[2]=-l,e[6]=o*c,e[10]=r*c}else if(t.order==="YZX"){const d=r*c,u=r*l,p=o*c,v=o*l;e[0]=c*h,e[4]=v-d*f,e[8]=p*f+u,e[1]=f,e[5]=r*h,e[9]=-o*h,e[2]=-l*h,e[6]=u*f+p,e[10]=d-v*f}else if(t.order==="XZY"){const d=r*c,u=r*l,p=o*c,v=o*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=d*f+v,e[5]=r*h,e[9]=u*f-p,e[2]=p*f-u,e[6]=o*h,e[10]=v*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ng,t,ig)}lookAt(t,e,i){const s=this.elements;return on.subVectors(t,e),on.lengthSq()===0&&(on.z=1),on.normalize(),ti.crossVectors(i,on),ti.lengthSq()===0&&(Math.abs(i.z)===1?on.x+=1e-4:on.z+=1e-4,on.normalize(),ti.crossVectors(i,on)),ti.normalize(),ma.crossVectors(on,ti),s[0]=ti.x,s[4]=ma.x,s[8]=on.x,s[1]=ti.y,s[5]=ma.y,s[9]=on.y,s[2]=ti.z,s[6]=ma.z,s[10]=on.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,r=i[0],o=i[4],c=i[8],l=i[12],h=i[1],f=i[5],d=i[9],u=i[13],p=i[2],v=i[6],g=i[10],m=i[14],x=i[3],_=i[7],y=i[11],P=i[15],S=s[0],w=s[4],A=s[8],E=s[12],M=s[1],R=s[5],U=s[9],F=s[13],B=s[2],L=s[6],C=s[10],X=s[14],H=s[3],q=s[7],j=s[11],st=s[15];return a[0]=r*S+o*M+c*B+l*H,a[4]=r*w+o*R+c*L+l*q,a[8]=r*A+o*U+c*C+l*j,a[12]=r*E+o*F+c*X+l*st,a[1]=h*S+f*M+d*B+u*H,a[5]=h*w+f*R+d*L+u*q,a[9]=h*A+f*U+d*C+u*j,a[13]=h*E+f*F+d*X+u*st,a[2]=p*S+v*M+g*B+m*H,a[6]=p*w+v*R+g*L+m*q,a[10]=p*A+v*U+g*C+m*j,a[14]=p*E+v*F+g*X+m*st,a[3]=x*S+_*M+y*B+P*H,a[7]=x*w+_*R+y*L+P*q,a[11]=x*A+_*U+y*C+P*j,a[15]=x*E+_*F+y*X+P*st,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],r=t[1],o=t[5],c=t[9],l=t[13],h=t[2],f=t[6],d=t[10],u=t[14],p=t[3],v=t[7],g=t[11],m=t[15];return p*(+a*c*f-s*l*f-a*o*d+i*l*d+s*o*u-i*c*u)+v*(+e*c*u-e*l*d+a*r*d-s*r*u+s*l*h-a*c*h)+g*(+e*l*f-e*o*u-a*r*f+i*r*u+a*o*h-i*l*h)+m*(-s*o*h-e*c*f+e*o*d+s*r*f-i*r*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=t[9],d=t[10],u=t[11],p=t[12],v=t[13],g=t[14],m=t[15],x=f*g*l-v*d*l+v*c*u-o*g*u-f*c*m+o*d*m,_=p*d*l-h*g*l-p*c*u+r*g*u+h*c*m-r*d*m,y=h*v*l-p*f*l+p*o*u-r*v*u-h*o*m+r*f*m,P=p*f*c-h*v*c-p*o*d+r*v*d+h*o*g-r*f*g,S=e*x+i*_+s*y+a*P;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/S;return t[0]=x*w,t[1]=(v*d*a-f*g*a-v*s*u+i*g*u+f*s*m-i*d*m)*w,t[2]=(o*g*a-v*c*a+v*s*l-i*g*l-o*s*m+i*c*m)*w,t[3]=(f*c*a-o*d*a-f*s*l+i*d*l+o*s*u-i*c*u)*w,t[4]=_*w,t[5]=(h*g*a-p*d*a+p*s*u-e*g*u-h*s*m+e*d*m)*w,t[6]=(p*c*a-r*g*a-p*s*l+e*g*l+r*s*m-e*c*m)*w,t[7]=(r*d*a-h*c*a+h*s*l-e*d*l-r*s*u+e*c*u)*w,t[8]=y*w,t[9]=(p*f*a-h*v*a-p*i*u+e*v*u+h*i*m-e*f*m)*w,t[10]=(r*v*a-p*o*a+p*i*l-e*v*l-r*i*m+e*o*m)*w,t[11]=(h*o*a-r*f*a-h*i*l+e*f*l+r*i*u-e*o*u)*w,t[12]=P*w,t[13]=(h*v*s-p*f*s+p*i*d-e*v*d-h*i*g+e*f*g)*w,t[14]=(p*o*s-r*v*s-p*i*c+e*v*c+r*i*g-e*o*g)*w,t[15]=(r*f*s-h*o*s+h*i*c-e*f*c-r*i*d+e*o*d)*w,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,r=t.x,o=t.y,c=t.z,l=a*r,h=a*o;return this.set(l*r+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,r){return this.set(1,i,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,r=e._y,o=e._z,c=e._w,l=a+a,h=r+r,f=o+o,d=a*l,u=a*h,p=a*f,v=r*h,g=r*f,m=o*f,x=c*l,_=c*h,y=c*f,P=i.x,S=i.y,w=i.z;return s[0]=(1-(v+m))*P,s[1]=(u+y)*P,s[2]=(p-_)*P,s[3]=0,s[4]=(u-y)*S,s[5]=(1-(d+m))*S,s[6]=(g+x)*S,s[7]=0,s[8]=(p+_)*w,s[9]=(g-x)*w,s[10]=(1-(d+v))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=Wi.set(s[0],s[1],s[2]).length();const r=Wi.set(s[4],s[5],s[6]).length(),o=Wi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],Sn.copy(this);const l=1/a,h=1/r,f=1/o;return Sn.elements[0]*=l,Sn.elements[1]*=l,Sn.elements[2]*=l,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=f,Sn.elements[9]*=f,Sn.elements[10]*=f,e.setFromRotationMatrix(Sn),i.x=a,i.y=r,i.z=o,this}makePerspective(t,e,i,s,a,r,o=Yn){const c=this.elements,l=2*a/(e-t),h=2*a/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let u,p;if(o===Yn)u=-(r+a)/(r-a),p=-2*r*a/(r-a);else if(o===cr)u=-r/(r-a),p=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=u,c[14]=p,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,a,r,o=Yn){const c=this.elements,l=1/(e-t),h=1/(i-s),f=1/(r-a),d=(e+t)*l,u=(i+s)*h;let p,v;if(o===Yn)p=(r+a)*f,v=-2*f;else if(o===cr)p=a*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-u,c[2]=0,c[6]=0,c[10]=v,c[14]=-p,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Wi=new V,Sn=new Me,ng=new V(0,0,0),ig=new V(1,1,1),ti=new V,ma=new V,on=new V,fh=new Me,ph=new ea;class Fn{constructor(t=0,e=0,i=0,s=Fn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-Xe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(Xe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Xe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return fh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(fh,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ph.setFromEuler(this),this.setFromQuaternion(ph,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fn.DEFAULT_ORDER="XYZ";class Qc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let sg=0;const mh=new V,$i=new ea,Bn=new Me,ga=new V,Cs=new V,ag=new V,rg=new ea,gh=new V(1,0,0),xh=new V(0,1,0),vh=new V(0,0,1),_h={type:"added"},og={type:"removed"},Yi={type:"childadded",child:null},Zr={type:"childremoved",child:null};class Pe extends _s{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sg++}),this.uuid=Un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Pe.DEFAULT_UP.clone();const t=new V,e=new Fn,i=new ea,s=new V(1,1,1);function a(){i.setFromEuler(e,!1)}function r(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Me},normalMatrix:{value:new ee}}),this.matrix=new Me,this.matrixWorld=new Me,this.matrixAutoUpdate=Pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return $i.setFromAxisAngle(t,e),this.quaternion.multiply($i),this}rotateOnWorldAxis(t,e){return $i.setFromAxisAngle(t,e),this.quaternion.premultiply($i),this}rotateX(t){return this.rotateOnAxis(gh,t)}rotateY(t){return this.rotateOnAxis(xh,t)}rotateZ(t){return this.rotateOnAxis(vh,t)}translateOnAxis(t,e){return mh.copy(t).applyQuaternion(this.quaternion),this.position.add(mh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(gh,t)}translateY(t){return this.translateOnAxis(xh,t)}translateZ(t){return this.translateOnAxis(vh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ga.copy(t):ga.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Cs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bn.lookAt(Cs,ga,this.up):Bn.lookAt(ga,Cs,this.up),this.quaternion.setFromRotationMatrix(Bn),s&&(Bn.extractRotation(s.matrixWorld),$i.setFromRotationMatrix(Bn),this.quaternion.premultiply($i.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(_h),Yi.child=t,this.dispatchEvent(Yi),Yi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(og),Zr.child=t,this.dispatchEvent(Zr),Zr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(_h),Yi.child=t,this.dispatchEvent(Yi),Yi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cs,t,ag),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cs,rg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];a(t.shapes,f)}else a(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(t.materials,this.material[c]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(a(t.animations,c))}}if(e){const o=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),f=r(t.shapes),d=r(t.skeletons),u=r(t.animations),p=r(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),p.length>0&&(i.nodes=p)}return i.object=s,i;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Pe.DEFAULT_UP=new V(0,1,0);Pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bn=new V,Hn=new V,qr=new V,Gn=new V,Zi=new V,qi=new V,yh=new V,jr=new V,Kr=new V,Jr=new V,Qr=new Re,to=new Re,eo=new Re;class hn{constructor(t=new V,e=new V,i=new V){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),bn.subVectors(t,e),s.cross(bn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){bn.subVectors(s,e),Hn.subVectors(i,e),qr.subVectors(t,e);const r=bn.dot(bn),o=bn.dot(Hn),c=bn.dot(qr),l=Hn.dot(Hn),h=Hn.dot(qr),f=r*l-o*o;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(l*c-o*h)*d,p=(r*h-o*c)*d;return a.set(1-u-p,p,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getInterpolation(t,e,i,s,a,r,o,c){return this.getBarycoord(t,e,i,s,Gn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,Gn.x),c.addScaledVector(r,Gn.y),c.addScaledVector(o,Gn.z),c)}static getInterpolatedAttribute(t,e,i,s,a,r){return Qr.setScalar(0),to.setScalar(0),eo.setScalar(0),Qr.fromBufferAttribute(t,e),to.fromBufferAttribute(t,i),eo.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Qr,a.x),r.addScaledVector(to,a.y),r.addScaledVector(eo,a.z),r}static isFrontFacing(t,e,i,s){return bn.subVectors(i,e),Hn.subVectors(t,e),bn.cross(Hn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return bn.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),bn.cross(Hn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return hn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return hn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return hn.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return hn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return hn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let r,o;Zi.subVectors(s,i),qi.subVectors(a,i),jr.subVectors(t,i);const c=Zi.dot(jr),l=qi.dot(jr);if(c<=0&&l<=0)return e.copy(i);Kr.subVectors(t,s);const h=Zi.dot(Kr),f=qi.dot(Kr);if(h>=0&&f<=h)return e.copy(s);const d=c*f-h*l;if(d<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(i).addScaledVector(Zi,r);Jr.subVectors(t,a);const u=Zi.dot(Jr),p=qi.dot(Jr);if(p>=0&&u<=p)return e.copy(a);const v=u*l-c*p;if(v<=0&&l>=0&&p<=0)return o=l/(l-p),e.copy(i).addScaledVector(qi,o);const g=h*p-u*f;if(g<=0&&f-h>=0&&u-p>=0)return yh.subVectors(a,s),o=(f-h)/(f-h+(u-p)),e.copy(s).addScaledVector(yh,o);const m=1/(g+v+d);return r=v*m,o=d*m,e.copy(i).addScaledVector(Zi,r).addScaledVector(qi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const su={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ei={h:0,s:0,l:0},xa={h:0,s:0,l:0};function no(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Zt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=i,he.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=he.workingColorSpace){if(t=Kc(t,1),e=Xe(e,0,1),i=Xe(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,r=2*i-a;this.r=no(r,a,t+1/3),this.g=no(r,a,t),this.b=no(r,a,t-1/3)}return he.toWorkingColorSpace(this,s),this}setStyle(t,e=je){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=je){const i=su[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zn(t.r),this.g=Zn(t.g),this.b=Zn(t.b),this}copyLinearToSRGB(t){return this.r=hs(t.r),this.g=hs(t.g),this.b=hs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=je){return he.fromWorkingColorSpace($e.copy(this),t),Math.round(Xe($e.r*255,0,255))*65536+Math.round(Xe($e.g*255,0,255))*256+Math.round(Xe($e.b*255,0,255))}getHexString(t=je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.fromWorkingColorSpace($e.copy(this),e);const i=$e.r,s=$e.g,a=$e.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const f=r-o;switch(l=h<=.5?f/(r+o):f/(2-r-o),r){case i:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-i)/f+2;break;case a:c=(i-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=he.workingColorSpace){return he.fromWorkingColorSpace($e.copy(this),e),t.r=$e.r,t.g=$e.g,t.b=$e.b,t}getStyle(t=je){he.fromWorkingColorSpace($e.copy(this),t);const e=$e.r,i=$e.g,s=$e.b;return t!==je?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(ei),this.setHSL(ei.h+t,ei.s+e,ei.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ei),t.getHSL(xa);const i=zs(ei.h,xa.h,e),s=zs(ei.s,xa.s,e),a=zs(ei.l,xa.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $e=new Zt;Zt.NAMES=su;let cg=0;class ki extends _s{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cg++}),this.uuid=Un(),this.name="",this.blending=os,this.side=oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Bo,this.blendDst=Ho,this.blendEquation=wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=us,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bi,this.stencilZFail=Bi,this.stencilZPass=Bi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==os&&(i.blending=this.blending),this.side!==oi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Bo&&(i.blendSrc=this.blendSrc),this.blendDst!==Ho&&(i.blendDst=this.blendDst),this.blendEquation!==wi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==us&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Bi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Bi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Bi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const c=a[o];delete c.metadata,r.push(c)}return r}if(e){const a=s(t.textures),r=s(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Be extends ki{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Xc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Le=new V,va=new Bt;class Qe{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=wc,this.updateRanges=[],this.gpuType=$n,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)va.fromBufferAttribute(this,e),va.applyMatrix3(t),this.setXY(e,va.x,va.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix3(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix4(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.applyNormalMatrix(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Le.fromBufferAttribute(this,e),Le.transformDirection(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=En(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=me(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=En(e,this.array)),e}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=En(e,this.array)),e}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=En(e,this.array)),e}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=En(e,this.array)),e}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array),s=me(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array),s=me(s,this.array),a=me(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==wc&&(t.usage=this.usage),t}}class au extends Qe{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class ru extends Qe{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class pe extends Qe{constructor(t,e,i){super(new Float32Array(t),e,i)}}let lg=0;const fn=new Me,io=new Pe,ji=new V,cn=new na,Ps=new na,ze=new V;class Ue extends _s{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:lg++}),this.uuid=Un(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(eu(t)?ru:au)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new ee().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return fn.makeRotationFromQuaternion(t),this.applyMatrix4(fn),this}rotateX(t){return fn.makeRotationX(t),this.applyMatrix4(fn),this}rotateY(t){return fn.makeRotationY(t),this.applyMatrix4(fn),this}rotateZ(t){return fn.makeRotationZ(t),this.applyMatrix4(fn),this}translate(t,e,i){return fn.makeTranslation(t,e,i),this.applyMatrix4(fn),this}scale(t,e,i){return fn.makeScale(t,e,i),this.applyMatrix4(fn),this}lookAt(t){return io.lookAt(t),io.updateMatrix(),this.applyMatrix4(io.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ji).negate(),this.translate(ji.x,ji.y,ji.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const r=t[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new pe(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new na);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];cn.setFromBufferAttribute(a),this.morphTargetsRelative?(ze.addVectors(this.boundingBox.min,cn.min),this.boundingBox.expandByPoint(ze),ze.addVectors(this.boundingBox.max,cn.max),this.boundingBox.expandByPoint(ze)):(this.boundingBox.expandByPoint(cn.min),this.boundingBox.expandByPoint(cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){const i=this.boundingSphere.center;if(cn.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){const o=e[a];Ps.setFromBufferAttribute(o),this.morphTargetsRelative?(ze.addVectors(cn.min,Ps.min),cn.expandByPoint(ze),ze.addVectors(cn.max,Ps.max),cn.expandByPoint(ze)):(cn.expandByPoint(Ps.min),cn.expandByPoint(Ps.max))}cn.getCenter(i);let s=0;for(let a=0,r=t.count;a<r;a++)ze.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(ze));if(e)for(let a=0,r=e.length;a<r;a++){const o=e[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)ze.fromBufferAttribute(o,l),c&&(ji.fromBufferAttribute(t,l),ze.add(ji)),s=Math.max(s,i.distanceToSquared(ze))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Qe(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let A=0;A<i.count;A++)o[A]=new V,c[A]=new V;const l=new V,h=new V,f=new V,d=new Bt,u=new Bt,p=new Bt,v=new V,g=new V;function m(A,E,M){l.fromBufferAttribute(i,A),h.fromBufferAttribute(i,E),f.fromBufferAttribute(i,M),d.fromBufferAttribute(a,A),u.fromBufferAttribute(a,E),p.fromBufferAttribute(a,M),h.sub(l),f.sub(l),u.sub(d),p.sub(d);const R=1/(u.x*p.y-p.x*u.y);isFinite(R)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(f,-u.y).multiplyScalar(R),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-p.x).multiplyScalar(R),o[A].add(v),o[E].add(v),o[M].add(v),c[A].add(g),c[E].add(g),c[M].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let A=0,E=x.length;A<E;++A){const M=x[A],R=M.start,U=M.count;for(let F=R,B=R+U;F<B;F+=3)m(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const _=new V,y=new V,P=new V,S=new V;function w(A){P.fromBufferAttribute(s,A),S.copy(P);const E=o[A];_.copy(E),_.sub(P.multiplyScalar(P.dot(E))).normalize(),y.crossVectors(S,E);const R=y.dot(c[A])<0?-1:1;r.setXYZW(A,_.x,_.y,_.z,R)}for(let A=0,E=x.length;A<E;++A){const M=x[A],R=M.start,U=M.count;for(let F=R,B=R+U;F<B;F+=3)w(t.getX(F+0)),w(t.getX(F+1)),w(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Qe(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new V,a=new V,r=new V,o=new V,c=new V,l=new V,h=new V,f=new V;if(t)for(let d=0,u=t.count;d<u;d+=3){const p=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,p),a.fromBufferAttribute(e,v),r.fromBufferAttribute(e,g),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),o.fromBufferAttribute(i,p),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,g),o.add(h),c.add(h),l.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,u=e.count;d<u;d+=3)s.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),r.fromBufferAttribute(e,d+2),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)ze.fromBufferAttribute(t,e),ze.normalize(),t.setXYZ(e,ze.x,ze.y,ze.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,f=o.normalized,d=new l.constructor(c.length*h);let u=0,p=0;for(let v=0,g=c.length;v<g;v++){o.isInterleavedBufferAttribute?u=c[v]*o.data.stride+o.offset:u=c[v]*h;for(let m=0;m<h;m++)d[p++]=l[u++]}return new Qe(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ue,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,i);e.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,f=l.length;h<f;h++){const d=l[h],u=t(d,i);c.push(u)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,d=l.length;f<d;f++){const u=l[f];h.push(u.toJSON(t.data))}h.length>0&&(s[c]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const a=t.morphAttributes;for(const l in a){const h=[],f=a[l];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Mh=new Me,pi=new Jc,_a=new xr,Sh=new V,ya=new V,Ma=new V,Sa=new V,so=new V,ba=new V,bh=new V,Ea=new V;class re extends Pe{constructor(t=new Ue,e=new Be){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(a&&o){ba.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],f=a[c];h!==0&&(so.fromBufferAttribute(f,t),r?ba.addScaledVector(so,h):ba.addScaledVector(so.sub(e),h))}e.add(ba)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),_a.copy(i.boundingSphere),_a.applyMatrix4(a),pi.copy(t.ray).recast(t.near),!(_a.containsPoint(pi.origin)===!1&&(pi.intersectSphere(_a,Sh)===null||pi.origin.distanceToSquared(Sh)>(t.far-t.near)**2))&&(Mh.copy(a).invert(),pi.copy(t.ray).applyMatrix4(Mh),!(i.boundingBox!==null&&pi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,pi)))}_computeIntersections(t,e,i){let s;const a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(o!==null)if(Array.isArray(r))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=r[g.materialIndex],x=Math.max(g.start,u.start),_=Math.min(o.count,Math.min(g.start+g.count,u.start+u.count));for(let y=x,P=_;y<P;y+=3){const S=o.getX(y),w=o.getX(y+1),A=o.getX(y+2);s=wa(this,m,t,i,l,h,f,S,w,A),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,u.start),v=Math.min(o.count,u.start+u.count);for(let g=p,m=v;g<m;g+=3){const x=o.getX(g),_=o.getX(g+1),y=o.getX(g+2);s=wa(this,r,t,i,l,h,f,x,_,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=r[g.materialIndex],x=Math.max(g.start,u.start),_=Math.min(c.count,Math.min(g.start+g.count,u.start+u.count));for(let y=x,P=_;y<P;y+=3){const S=y,w=y+1,A=y+2;s=wa(this,m,t,i,l,h,f,S,w,A),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,u.start),v=Math.min(c.count,u.start+u.count);for(let g=p,m=v;g<m;g+=3){const x=g,_=g+1,y=g+2;s=wa(this,r,t,i,l,h,f,x,_,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function hg(n,t,e,i,s,a,r,o){let c;if(t.side===nn?c=i.intersectTriangle(r,a,s,!0,o):c=i.intersectTriangle(s,a,r,t.side===oi,o),c===null)return null;Ea.copy(o),Ea.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Ea);return l<e.near||l>e.far?null:{distance:l,point:Ea.clone(),object:n}}function wa(n,t,e,i,s,a,r,o,c,l){n.getVertexPosition(o,ya),n.getVertexPosition(c,Ma),n.getVertexPosition(l,Sa);const h=hg(n,t,e,i,ya,Ma,Sa,bh);if(h){const f=new V;hn.getBarycoord(bh,ya,Ma,Sa,f),s&&(h.uv=hn.getInterpolatedAttribute(s,o,c,l,f,new Bt)),a&&(h.uv1=hn.getInterpolatedAttribute(a,o,c,l,f,new Bt)),r&&(h.normal=hn.getInterpolatedAttribute(r,o,c,l,f,new V),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new V,materialIndex:0};hn.getNormal(ya,Ma,Sa,d.normal),h.face=d,h.barycoord=f}return h}class Tn extends Ue{constructor(t=1,e=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const c=[],l=[],h=[],f=[];let d=0,u=0;p("z","y","x",-1,-1,i,e,t,r,a,0),p("z","y","x",1,-1,i,e,-t,r,a,1),p("x","z","y",1,1,t,i,e,s,r,2),p("x","z","y",1,-1,t,i,-e,s,r,3),p("x","y","z",1,-1,t,e,i,s,a,4),p("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(c),this.setAttribute("position",new pe(l,3)),this.setAttribute("normal",new pe(h,3)),this.setAttribute("uv",new pe(f,2));function p(v,g,m,x,_,y,P,S,w,A,E){const M=y/w,R=P/A,U=y/2,F=P/2,B=S/2,L=w+1,C=A+1;let X=0,H=0;const q=new V;for(let j=0;j<C;j++){const st=j*R-F;for(let ft=0;ft<L;ft++){const _t=ft*M-U;q[v]=_t*x,q[g]=st*_,q[m]=B,l.push(q.x,q.y,q.z),q[v]=0,q[g]=0,q[m]=S>0?1:-1,h.push(q.x,q.y,q.z),f.push(ft/w),f.push(1-j/A),X+=1}}for(let j=0;j<A;j++)for(let st=0;st<w;st++){const ft=d+st+L*j,_t=d+st+L*(j+1),Y=d+(st+1)+L*(j+1),tt=d+(st+1)+L*j;c.push(ft,_t,tt),c.push(_t,Y,tt),H+=6}o.addGroup(u,H,E),u+=H,d+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function xs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function qe(n){const t={};for(let e=0;e<n.length;e++){const i=xs(n[e]);for(const s in i)t[s]=i[s]}return t}function dg(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function ou(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:he.workingColorSpace}const ug={clone:xs,merge:qe};var fg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ci extends ki{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fg,this.fragmentShader=pg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=xs(t.uniforms),this.uniformsGroups=dg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class cu extends Pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Me,this.projectionMatrix=new Me,this.projectionMatrixInverse=new Me,this.coordinateSystem=Yn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ni=new V,Eh=new Bt,wh=new Bt;class mn extends cu{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ys*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ls*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ys*2*Math.atan(Math.tan(ls*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ni.x,ni.y).multiplyScalar(-t/ni.z),ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ni.x,ni.y).multiplyScalar(-t/ni.z)}getViewSize(t,e){return this.getViewBounds(t,Eh,wh),e.subVectors(wh,Eh)}setViewOffset(t,e,i,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ls*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,e-=r.offsetY*i/l,s*=r.width/c,i*=r.height/l}const o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ki=-90,Ji=1;class mg extends Pe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new mn(Ki,Ji,t,e);s.layers=this.layers,this.add(s);const a=new mn(Ki,Ji,t,e);a.layers=this.layers,this.add(a);const r=new mn(Ki,Ji,t,e);r.layers=this.layers,this.add(r);const o=new mn(Ki,Ji,t,e);o.layers=this.layers,this.add(o);const c=new mn(Ki,Ji,t,e);c.layers=this.layers,this.add(c);const l=new mn(Ki,Ji,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,r,o,c]=e;for(const l of e)this.remove(l);if(t===Yn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===cr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,c,l,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,r),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class lu extends Je{constructor(t,e,i,s,a,r,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:fs,super(t,e,i,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class gg extends Di{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new lu(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:In}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Tn(5,5,5),a=new ci({name:"CubemapFromEquirect",uniforms:xs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:nn,blending:ai});a.uniforms.tEquirect.value=e;const r=new re(s,a),o=e.minFilter;return e.minFilter===Ri&&(e.minFilter=In),new mg(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,i,s);t.setRenderTarget(a)}}const ao=new V,xg=new V,vg=new ee;class Mi{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=ao.subVectors(i,e).cross(xg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(ao),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||vg.getNormalMatrix(t),s=this.coplanarPoint(ao).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const mi=new xr,Aa=new V;class tl{constructor(t=new Mi,e=new Mi,i=new Mi,s=new Mi,a=new Mi,r=new Mi){this.planes=[t,e,i,s,a,r]}set(t,e,i,s,a,r){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Yn){const i=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],c=s[3],l=s[4],h=s[5],f=s[6],d=s[7],u=s[8],p=s[9],v=s[10],g=s[11],m=s[12],x=s[13],_=s[14],y=s[15];if(i[0].setComponents(c-a,d-l,g-u,y-m).normalize(),i[1].setComponents(c+a,d+l,g+u,y+m).normalize(),i[2].setComponents(c+r,d+h,g+p,y+x).normalize(),i[3].setComponents(c-r,d-h,g-p,y-x).normalize(),i[4].setComponents(c-o,d-f,g-v,y-_).normalize(),e===Yn)i[5].setComponents(c+o,d+f,g+v,y+_).normalize();else if(e===cr)i[5].setComponents(o,f,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),mi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),mi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(mi)}intersectsSprite(t){return mi.center.set(0,0,0),mi.radius=.7071067811865476,mi.applyMatrix4(t.matrixWorld),this.intersectsSphere(mi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Aa.x=s.normal.x>0?t.max.x:t.min.x,Aa.y=s.normal.y>0?t.max.y:t.min.y,Aa.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Aa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function hu(){let n=null,t=!1,e=null,i=null;function s(a,r){e(a,r),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function _g(n){const t=new WeakMap;function e(o,c){const l=o.array,h=o.usage,f=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),o.onUploadCallback();let u;if(l instanceof Float32Array)u=n.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=n.SHORT;else if(l instanceof Uint32Array)u=n.UNSIGNED_INT;else if(l instanceof Int32Array)u=n.INT;else if(l instanceof Int8Array)u=n.BYTE;else if(l instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,c,l){const h=c.array,f=c.updateRanges;if(n.bindBuffer(l,o),f.length===0)n.bufferSubData(l,0,h);else{f.sort((u,p)=>u.start-p.start);let d=0;for(let u=1;u<f.length;u++){const p=f[d],v=f[u];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,f[d]=v)}f.length=d+1;for(let u=0,p=f.length;u<p;u++){const v=f[u];n.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(n.deleteBuffer(c.buffer),t.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}class pn extends Ue{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,r=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,f=t/o,d=e/c,u=[],p=[],v=[],g=[];for(let m=0;m<h;m++){const x=m*d-r;for(let _=0;_<l;_++){const y=_*f-a;p.push(y,-x,0),v.push(0,0,1),g.push(_/o),g.push(1-m/c)}}for(let m=0;m<c;m++)for(let x=0;x<o;x++){const _=x+l*m,y=x+l*(m+1),P=x+1+l*(m+1),S=x+1+l*m;u.push(_,y,S),u.push(y,P,S)}this.setIndex(u),this.setAttribute("position",new pe(p,3)),this.setAttribute("normal",new pe(v,3)),this.setAttribute("uv",new pe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pn(t.width,t.height,t.widthSegments,t.heightSegments)}}var yg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mg=`#ifdef USE_ALPHAHASH
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
#endif`,Sg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Eg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,wg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ag=`#ifdef USE_AOMAP
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
#endif`,Tg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rg=`#ifdef USE_BATCHING
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
#endif`,Cg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ig=`#ifdef USE_IRIDESCENCE
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
#endif`,kg=`#ifdef USE_BUMPMAP
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
#endif`,Ug=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Fg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ng=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Og=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Bg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gg=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Vg=`#define PI 3.141592653589793
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
} // validated`,Xg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Wg=`vec3 transformedNormal = objectNormal;
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
#endif`,$g=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jg=`#ifdef USE_ENVMAP
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
#endif`,Qg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,tx=`#ifdef USE_ENVMAP
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
#endif`,ex=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nx=`#ifdef USE_ENVMAP
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
#endif`,ix=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ax=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ox=`#ifdef USE_GRADIENTMAP
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
}`,cx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dx=`uniform bool receiveShadow;
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
#endif`,ux=`#ifdef USE_ENVMAP
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
#endif`,fx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,px=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xx=`PhysicalMaterial material;
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
#endif`,vx=`struct PhysicalMaterial {
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
}`,_x=`
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
#endif`,yx=`#if defined( RE_IndirectDiffuse )
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
#endif`,Mx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sx=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bx=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ex=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wx=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ax=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Tx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Cx=`#if defined( USE_POINTS_UV )
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
#endif`,Px=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ix=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ux=`#ifdef USE_MORPHTARGETS
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
#endif`,Fx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,zx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ox=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gx=`#ifdef USE_NORMALMAP
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
#endif`,Vx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$x=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Yx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,qx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ev=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,iv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sv=`float getShadowMask() {
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
}`,av=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rv=`#ifdef USE_SKINNING
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
#endif`,ov=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cv=`#ifdef USE_SKINNING
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
#endif`,lv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,fv=`#ifdef USE_TRANSMISSION
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
#endif`,pv=`#ifdef USE_TRANSMISSION
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
#endif`,mv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _v=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yv=`uniform sampler2D t2D;
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
}`,Mv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ev=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wv=`#include <common>
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
}`,Av=`#if DEPTH_PACKING == 3200
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
}`,Tv=`#define DISTANCE
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
}`,Rv=`#define DISTANCE
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
}`,Cv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lv=`uniform float scale;
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
}`,Dv=`uniform vec3 diffuse;
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
}`,Iv=`#include <common>
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
}`,kv=`uniform vec3 diffuse;
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
}`,Uv=`#define LAMBERT
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
}`,Fv=`#define LAMBERT
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
}`,Nv=`#define MATCAP
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
}`,zv=`#define MATCAP
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
}`,Ov=`#define NORMAL
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
}`,Bv=`#define NORMAL
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
}`,Hv=`#define PHONG
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
}`,Gv=`#define PHONG
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
}`,Vv=`#define STANDARD
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
}`,Xv=`#define STANDARD
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
}`,Wv=`#define TOON
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
}`,$v=`#define TOON
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
}`,Yv=`uniform float size;
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
}`,Zv=`uniform vec3 diffuse;
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
}`,qv=`#include <common>
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
}`,jv=`uniform vec3 color;
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
}`,Kv=`uniform float rotation;
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
}`,Jv=`uniform vec3 diffuse;
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
}`,ne={alphahash_fragment:yg,alphahash_pars_fragment:Mg,alphamap_fragment:Sg,alphamap_pars_fragment:bg,alphatest_fragment:Eg,alphatest_pars_fragment:wg,aomap_fragment:Ag,aomap_pars_fragment:Tg,batching_pars_vertex:Rg,batching_vertex:Cg,begin_vertex:Pg,beginnormal_vertex:Lg,bsdfs:Dg,iridescence_fragment:Ig,bumpmap_pars_fragment:kg,clipping_planes_fragment:Ug,clipping_planes_pars_fragment:Fg,clipping_planes_pars_vertex:Ng,clipping_planes_vertex:zg,color_fragment:Og,color_pars_fragment:Bg,color_pars_vertex:Hg,color_vertex:Gg,common:Vg,cube_uv_reflection_fragment:Xg,defaultnormal_vertex:Wg,displacementmap_pars_vertex:$g,displacementmap_vertex:Yg,emissivemap_fragment:Zg,emissivemap_pars_fragment:qg,colorspace_fragment:jg,colorspace_pars_fragment:Kg,envmap_fragment:Jg,envmap_common_pars_fragment:Qg,envmap_pars_fragment:tx,envmap_pars_vertex:ex,envmap_physical_pars_fragment:ux,envmap_vertex:nx,fog_vertex:ix,fog_pars_vertex:sx,fog_fragment:ax,fog_pars_fragment:rx,gradientmap_pars_fragment:ox,lightmap_pars_fragment:cx,lights_lambert_fragment:lx,lights_lambert_pars_fragment:hx,lights_pars_begin:dx,lights_toon_fragment:fx,lights_toon_pars_fragment:px,lights_phong_fragment:mx,lights_phong_pars_fragment:gx,lights_physical_fragment:xx,lights_physical_pars_fragment:vx,lights_fragment_begin:_x,lights_fragment_maps:yx,lights_fragment_end:Mx,logdepthbuf_fragment:Sx,logdepthbuf_pars_fragment:bx,logdepthbuf_pars_vertex:Ex,logdepthbuf_vertex:wx,map_fragment:Ax,map_pars_fragment:Tx,map_particle_fragment:Rx,map_particle_pars_fragment:Cx,metalnessmap_fragment:Px,metalnessmap_pars_fragment:Lx,morphinstance_vertex:Dx,morphcolor_vertex:Ix,morphnormal_vertex:kx,morphtarget_pars_vertex:Ux,morphtarget_vertex:Fx,normal_fragment_begin:Nx,normal_fragment_maps:zx,normal_pars_fragment:Ox,normal_pars_vertex:Bx,normal_vertex:Hx,normalmap_pars_fragment:Gx,clearcoat_normal_fragment_begin:Vx,clearcoat_normal_fragment_maps:Xx,clearcoat_pars_fragment:Wx,iridescence_pars_fragment:$x,opaque_fragment:Yx,packing:Zx,premultiplied_alpha_fragment:qx,project_vertex:jx,dithering_fragment:Kx,dithering_pars_fragment:Jx,roughnessmap_fragment:Qx,roughnessmap_pars_fragment:tv,shadowmap_pars_fragment:ev,shadowmap_pars_vertex:nv,shadowmap_vertex:iv,shadowmask_pars_fragment:sv,skinbase_vertex:av,skinning_pars_vertex:rv,skinning_vertex:ov,skinnormal_vertex:cv,specularmap_fragment:lv,specularmap_pars_fragment:hv,tonemapping_fragment:dv,tonemapping_pars_fragment:uv,transmission_fragment:fv,transmission_pars_fragment:pv,uv_pars_fragment:mv,uv_pars_vertex:gv,uv_vertex:xv,worldpos_vertex:vv,background_vert:_v,background_frag:yv,backgroundCube_vert:Mv,backgroundCube_frag:Sv,cube_vert:bv,cube_frag:Ev,depth_vert:wv,depth_frag:Av,distanceRGBA_vert:Tv,distanceRGBA_frag:Rv,equirect_vert:Cv,equirect_frag:Pv,linedashed_vert:Lv,linedashed_frag:Dv,meshbasic_vert:Iv,meshbasic_frag:kv,meshlambert_vert:Uv,meshlambert_frag:Fv,meshmatcap_vert:Nv,meshmatcap_frag:zv,meshnormal_vert:Ov,meshnormal_frag:Bv,meshphong_vert:Hv,meshphong_frag:Gv,meshphysical_vert:Vv,meshphysical_frag:Xv,meshtoon_vert:Wv,meshtoon_frag:$v,points_vert:Yv,points_frag:Zv,shadow_vert:qv,shadow_frag:jv,sprite_vert:Kv,sprite_frag:Jv},kt={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ee}},envmap:{envMap:{value:null},envMapRotation:{value:new ee},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ee}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ee}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ee},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ee},normalScale:{value:new Bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ee},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ee}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ee}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ee}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0},uvTransform:{value:new ee}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new Bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}}},Dn={basic:{uniforms:qe([kt.common,kt.specularmap,kt.envmap,kt.aomap,kt.lightmap,kt.fog]),vertexShader:ne.meshbasic_vert,fragmentShader:ne.meshbasic_frag},lambert:{uniforms:qe([kt.common,kt.specularmap,kt.envmap,kt.aomap,kt.lightmap,kt.emissivemap,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.fog,kt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:ne.meshlambert_vert,fragmentShader:ne.meshlambert_frag},phong:{uniforms:qe([kt.common,kt.specularmap,kt.envmap,kt.aomap,kt.lightmap,kt.emissivemap,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.fog,kt.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:ne.meshphong_vert,fragmentShader:ne.meshphong_frag},standard:{uniforms:qe([kt.common,kt.envmap,kt.aomap,kt.lightmap,kt.emissivemap,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.roughnessmap,kt.metalnessmap,kt.fog,kt.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag},toon:{uniforms:qe([kt.common,kt.aomap,kt.lightmap,kt.emissivemap,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.gradientmap,kt.fog,kt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:ne.meshtoon_vert,fragmentShader:ne.meshtoon_frag},matcap:{uniforms:qe([kt.common,kt.bumpmap,kt.normalmap,kt.displacementmap,kt.fog,{matcap:{value:null}}]),vertexShader:ne.meshmatcap_vert,fragmentShader:ne.meshmatcap_frag},points:{uniforms:qe([kt.points,kt.fog]),vertexShader:ne.points_vert,fragmentShader:ne.points_frag},dashed:{uniforms:qe([kt.common,kt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ne.linedashed_vert,fragmentShader:ne.linedashed_frag},depth:{uniforms:qe([kt.common,kt.displacementmap]),vertexShader:ne.depth_vert,fragmentShader:ne.depth_frag},normal:{uniforms:qe([kt.common,kt.bumpmap,kt.normalmap,kt.displacementmap,{opacity:{value:1}}]),vertexShader:ne.meshnormal_vert,fragmentShader:ne.meshnormal_frag},sprite:{uniforms:qe([kt.sprite,kt.fog]),vertexShader:ne.sprite_vert,fragmentShader:ne.sprite_frag},background:{uniforms:{uvTransform:{value:new ee},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ne.background_vert,fragmentShader:ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ee}},vertexShader:ne.backgroundCube_vert,fragmentShader:ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ne.cube_vert,fragmentShader:ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ne.equirect_vert,fragmentShader:ne.equirect_frag},distanceRGBA:{uniforms:qe([kt.common,kt.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ne.distanceRGBA_vert,fragmentShader:ne.distanceRGBA_frag},shadow:{uniforms:qe([kt.lights,kt.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:ne.shadow_vert,fragmentShader:ne.shadow_frag}};Dn.physical={uniforms:qe([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ee},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ee},clearcoatNormalScale:{value:new Bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ee},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ee},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ee},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ee},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ee},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ee},transmissionSamplerSize:{value:new Bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ee},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ee},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ee},anisotropyVector:{value:new Bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ee}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag};const Ta={r:0,b:0,g:0},gi=new Fn,Qv=new Me;function t_(n,t,e,i,s,a,r){const o=new Zt(0);let c=a===!0?0:1,l,h,f=null,d=0,u=null;function p(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function v(x){let _=!1;const y=p(x);y===null?m(o,c):y&&y.isColor&&(m(y,1),_=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,r):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(x,_){const y=p(_);y&&(y.isCubeTexture||y.mapping===mr)?(h===void 0&&(h=new re(new Tn(1,1,1),new ci({name:"BackgroundCubeMaterial",uniforms:xs(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,S,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),gi.copy(_.backgroundRotation),gi.x*=-1,gi.y*=-1,gi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(gi.y*=-1,gi.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Qv.makeRotationFromEuler(gi)),h.material.toneMapped=he.getTransfer(y.colorSpace)!==ge,(f!==y||d!==y.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=y,d=y.version,u=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new re(new pn(2,2),new ci({name:"BackgroundMaterial",uniforms:xs(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:oi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=he.getTransfer(y.colorSpace)!==ge,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||d!==y.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=y,d=y.version,u=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,_){x.getRGB(Ta,ou(n)),i.buffers.color.setClear(Ta.r,Ta.g,Ta.b,_,r)}return{getClearColor:function(){return o},setClearColor:function(x,_=1){o.set(x),c=_,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,m(o,c)},render:v,addToRenderList:g}}function e_(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,r=!1;function o(M,R,U,F,B){let L=!1;const C=f(F,U,R);a!==C&&(a=C,l(a.object)),L=u(M,F,U,B),L&&p(M,F,U,B),B!==null&&t.update(B,n.ELEMENT_ARRAY_BUFFER),(L||r)&&(r=!1,y(M,R,U,F),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function c(){return n.createVertexArray()}function l(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,R,U){const F=U.wireframe===!0;let B=i[M.id];B===void 0&&(B={},i[M.id]=B);let L=B[R.id];L===void 0&&(L={},B[R.id]=L);let C=L[F];return C===void 0&&(C=d(c()),L[F]=C),C}function d(M){const R=[],U=[],F=[];for(let B=0;B<e;B++)R[B]=0,U[B]=0,F[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:U,attributeDivisors:F,object:M,attributes:{},index:null}}function u(M,R,U,F){const B=a.attributes,L=R.attributes;let C=0;const X=U.getAttributes();for(const H in X)if(X[H].location>=0){const j=B[H];let st=L[H];if(st===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(st=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(st=M.instanceColor)),j===void 0||j.attribute!==st||st&&j.data!==st.data)return!0;C++}return a.attributesNum!==C||a.index!==F}function p(M,R,U,F){const B={},L=R.attributes;let C=0;const X=U.getAttributes();for(const H in X)if(X[H].location>=0){let j=L[H];j===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(j=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(j=M.instanceColor));const st={};st.attribute=j,j&&j.data&&(st.data=j.data),B[H]=st,C++}a.attributes=B,a.attributesNum=C,a.index=F}function v(){const M=a.newAttributes;for(let R=0,U=M.length;R<U;R++)M[R]=0}function g(M){m(M,0)}function m(M,R){const U=a.newAttributes,F=a.enabledAttributes,B=a.attributeDivisors;U[M]=1,F[M]===0&&(n.enableVertexAttribArray(M),F[M]=1),B[M]!==R&&(n.vertexAttribDivisor(M,R),B[M]=R)}function x(){const M=a.newAttributes,R=a.enabledAttributes;for(let U=0,F=R.length;U<F;U++)R[U]!==M[U]&&(n.disableVertexAttribArray(U),R[U]=0)}function _(M,R,U,F,B,L,C){C===!0?n.vertexAttribIPointer(M,R,U,B,L):n.vertexAttribPointer(M,R,U,F,B,L)}function y(M,R,U,F){v();const B=F.attributes,L=U.getAttributes(),C=R.defaultAttributeValues;for(const X in L){const H=L[X];if(H.location>=0){let q=B[X];if(q===void 0&&(X==="instanceMatrix"&&M.instanceMatrix&&(q=M.instanceMatrix),X==="instanceColor"&&M.instanceColor&&(q=M.instanceColor)),q!==void 0){const j=q.normalized,st=q.itemSize,ft=t.get(q);if(ft===void 0)continue;const _t=ft.buffer,Y=ft.type,tt=ft.bytesPerElement,mt=Y===n.INT||Y===n.UNSIGNED_INT||q.gpuType===Wc;if(q.isInterleavedBufferAttribute){const J=q.data,gt=J.stride,Ut=q.offset;if(J.isInstancedInterleavedBuffer){for(let Dt=0;Dt<H.locationSize;Dt++)m(H.location+Dt,J.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Dt=0;Dt<H.locationSize;Dt++)g(H.location+Dt);n.bindBuffer(n.ARRAY_BUFFER,_t);for(let Dt=0;Dt<H.locationSize;Dt++)_(H.location+Dt,st/H.locationSize,Y,j,gt*tt,(Ut+st/H.locationSize*Dt)*tt,mt)}else{if(q.isInstancedBufferAttribute){for(let J=0;J<H.locationSize;J++)m(H.location+J,q.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let J=0;J<H.locationSize;J++)g(H.location+J);n.bindBuffer(n.ARRAY_BUFFER,_t);for(let J=0;J<H.locationSize;J++)_(H.location+J,st/H.locationSize,Y,j,st*tt,st/H.locationSize*J*tt,mt)}}else if(C!==void 0){const j=C[X];if(j!==void 0)switch(j.length){case 2:n.vertexAttrib2fv(H.location,j);break;case 3:n.vertexAttrib3fv(H.location,j);break;case 4:n.vertexAttrib4fv(H.location,j);break;default:n.vertexAttrib1fv(H.location,j)}}}}x()}function P(){A();for(const M in i){const R=i[M];for(const U in R){const F=R[U];for(const B in F)h(F[B].object),delete F[B];delete R[U]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;const R=i[M.id];for(const U in R){const F=R[U];for(const B in F)h(F[B].object),delete F[B];delete R[U]}delete i[M.id]}function w(M){for(const R in i){const U=i[R];if(U[M.id]===void 0)continue;const F=U[M.id];for(const B in F)h(F[B].object),delete F[B];delete U[M.id]}}function A(){E(),r=!0,a!==s&&(a=s,l(a.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:E,dispose:P,releaseStatesOfGeometry:S,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:g,disableUnusedAttributes:x}}function n_(n,t,e){let i;function s(l){i=l}function a(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function r(l,h,f){f!==0&&(n.drawArraysInstanced(i,l,h,f),e.update(h,i,f))}function o(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,f);let u=0;for(let p=0;p<f;p++)u+=h[p];e.update(u,i,1)}function c(l,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let p=0;p<l.length;p++)r(l[p],h[p],d[p]);else{u.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,f);let p=0;for(let v=0;v<f;v++)p+=h[v]*d[v];e.update(p,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function i_(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(w){return!(w!==wn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const A=w===ta&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==qn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==$n&&!A)}function c(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=p>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:y,vertexTextures:P,maxSamples:S}}function s_(n){const t=this;let e=null,i=0,s=!1,a=!1;const r=new Mi,o=new ee,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const p=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,m=n.get(f);if(!s||p===null||p.length===0||a&&!g)a?h(null):l();else{const x=a?0:i,_=x*4;let y=m.clippingState||null;c.value=y,y=h(p,d,_,u);for(let P=0;P!==_;++P)y[P]=e[P];m.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,p){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=c.value,p!==!0||g===null){const m=u+v*4,x=d.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<m)&&(g=new Float32Array(m));for(let _=0,y=u;_!==v;++_,y+=4)r.copy(f[_]).applyMatrix4(x,o),r.normal.toArray(g,y),g[y+3]=r.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function a_(n){let t=new WeakMap;function e(r,o){return o===qo?r.mapping=fs:o===jo&&(r.mapping=ps),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===qo||o===jo)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new gg(c.height);return l.fromEquirectangularTexture(n,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class du extends cu{constructor(t=-1,e=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,r=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const as=4,Ah=[.125,.215,.35,.446,.526,.582],Ai=20,ro=new du,Th=new Zt;let oo=null,co=0,lo=0,ho=!1;const Si=(1+Math.sqrt(5))/2,Qi=1/Si,Rh=[new V(-Si,Qi,0),new V(Si,Qi,0),new V(-Qi,0,Si),new V(Qi,0,Si),new V(0,Si,-Qi),new V(0,Si,Qi),new V(-1,1,-1),new V(1,1,-1),new V(-1,1,1),new V(1,1,1)];class Ch{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){oo=this._renderer.getRenderTarget(),co=this._renderer.getActiveCubeFace(),lo=this._renderer.getActiveMipmapLevel(),ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Dh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(oo,co,lo),this._renderer.xr.enabled=ho,t.scissorTest=!1,Ra(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===fs||t.mapping===ps?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),oo=this._renderer.getRenderTarget(),co=this._renderer.getActiveCubeFace(),lo=this._renderer.getActiveMipmapLevel(),ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:In,minFilter:In,generateMipmaps:!1,type:ta,format:wn,colorSpace:vs,depthBuffer:!1},s=Ph(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ph(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=r_(a)),this._blurMaterial=o_(a,t,e)}return s}_compileMaterial(t){const e=new re(this._lodPlanes[0],t);this._renderer.compile(e,ro)}_sceneToCubeUV(t,e,i,s){const o=new mn(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Th),h.toneMapping=ri,h.autoClear=!1;const u=new Be({name:"PMREM.Background",side:nn,depthWrite:!1,depthTest:!1}),p=new re(new Tn,u);let v=!1;const g=t.background;g?g.isColor&&(u.color.copy(g),t.background=null,v=!0):(u.color.copy(Th),v=!0);for(let m=0;m<6;m++){const x=m%3;x===0?(o.up.set(0,c[m],0),o.lookAt(l[m],0,0)):x===1?(o.up.set(0,0,c[m]),o.lookAt(0,l[m],0)):(o.up.set(0,c[m],0),o.lookAt(0,0,l[m]));const _=this._cubeSize;Ra(s,x*_,m>2?_:0,_,_),h.setRenderTarget(s),v&&h.render(p,o),h.render(t,o)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===fs||t.mapping===ps;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Dh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lh());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new re(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;const c=this._cubeSize;Ra(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(r,ro)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=Rh[(s-a-1)%Rh.length];this._blur(t,a-1,a,r,o)}e.autoClear=i}_blur(t,e,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,i,s,"latitudinal",a),this._halfBlur(r,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new re(this._lodPlanes[s],l),d=l.uniforms,u=this._sizeLods[i]-1,p=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Ai-1),v=a/p,g=isFinite(a)?1+Math.floor(h*v):Ai;g>Ai&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ai}`);const m=[];let x=0;for(let w=0;w<Ai;++w){const A=w/v,E=Math.exp(-A*A/2);m.push(E),w===0?x+=E:w<g&&(x+=2*E)}for(let w=0;w<m.length;w++)m[w]=m[w]/x;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=r==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:_}=this;d.dTheta.value=p,d.mipInt.value=_-i;const y=this._sizeLods[s],P=3*y*(s>_-as?s-_+as:0),S=4*(this._cubeSize-y);Ra(e,P,S,3*y,2*y),c.setRenderTarget(e),c.render(f,ro)}}function r_(n){const t=[],e=[],i=[];let s=n;const a=n-as+1+Ah.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);e.push(o);let c=1/o;r>n-as?c=Ah[r-n+as-1]:r===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,f=1+l,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,p=6,v=3,g=2,m=1,x=new Float32Array(v*p*u),_=new Float32Array(g*p*u),y=new Float32Array(m*p*u);for(let S=0;S<u;S++){const w=S%3*2/3-1,A=S>2?0:-1,E=[w,A,0,w+2/3,A,0,w+2/3,A+1,0,w,A,0,w+2/3,A+1,0,w,A+1,0];x.set(E,v*p*S),_.set(d,g*p*S);const M=[S,S,S,S,S,S];y.set(M,m*p*S)}const P=new Ue;P.setAttribute("position",new Qe(x,v)),P.setAttribute("uv",new Qe(_,g)),P.setAttribute("faceIndex",new Qe(y,m)),t.push(P),s>as&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Ph(n,t,e){const i=new Di(n,t,e);return i.texture.mapping=mr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ra(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function o_(n,t,e){const i=new Float32Array(Ai),s=new V(0,1,0);return new ci({name:"SphericalGaussianBlur",defines:{n:Ai,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:el(),fragmentShader:`

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
		`,blending:ai,depthTest:!1,depthWrite:!1})}function Lh(){return new ci({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:el(),fragmentShader:`

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
		`,blending:ai,depthTest:!1,depthWrite:!1})}function Dh(){return new ci({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:el(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ai,depthTest:!1,depthWrite:!1})}function el(){return`

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
	`}function c_(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===qo||c===jo,h=c===fs||c===ps;if(l||h){let f=t.get(o);const d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Ch(n)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const u=o.image;return l&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new Ch(n)),f=l?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",a),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:r}}function l_(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Us("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function h_(n,t,e,i){const s={},a=new WeakMap;function r(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);for(const p in d.morphAttributes){const v=d.morphAttributes[p];for(let g=0,m=v.length;g<m;g++)t.remove(v[g])}d.removeEventListener("dispose",r),delete s[d.id];const u=a.get(d);u&&(t.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",r),s[d.id]=!0,e.memory.geometries++),d}function c(f){const d=f.attributes;for(const p in d)t.update(d[p],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const p in u){const v=u[p];for(let g=0,m=v.length;g<m;g++)t.update(v[g],n.ARRAY_BUFFER)}}function l(f){const d=[],u=f.index,p=f.attributes.position;let v=0;if(u!==null){const x=u.array;v=u.version;for(let _=0,y=x.length;_<y;_+=3){const P=x[_+0],S=x[_+1],w=x[_+2];d.push(P,S,S,w,w,P)}}else if(p!==void 0){const x=p.array;v=p.version;for(let _=0,y=x.length/3-1;_<y;_+=3){const P=_+0,S=_+1,w=_+2;d.push(P,S,S,w,w,P)}}else return;const g=new(eu(d)?ru:au)(d,1);g.version=v;const m=a.get(f);m&&t.remove(m),a.set(f,g)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&l(f)}else l(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function d_(n,t,e){let i;function s(d){i=d}let a,r;function o(d){a=d.type,r=d.bytesPerElement}function c(d,u){n.drawElements(i,u,a,d*r),e.update(u,i,1)}function l(d,u,p){p!==0&&(n.drawElementsInstanced(i,u,a,d*r,p),e.update(u,i,p))}function h(d,u,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,d,0,p);let g=0;for(let m=0;m<p;m++)g+=u[m];e.update(g,i,1)}function f(d,u,p,v){if(p===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d.length;m++)l(d[m]/r,u[m],v[m]);else{g.multiDrawElementsInstancedWEBGL(i,u,0,a,d,0,v,0,p);let m=0;for(let x=0;x<p;x++)m+=u[x]*v[x];e.update(m,i,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function u_(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(e.calls++,r){case n.TRIANGLES:e.triangles+=o*(a/3);break;case n.LINES:e.lines+=o*(a/2);break;case n.LINE_STRIP:e.lines+=o*(a-1);break;case n.LINE_LOOP:e.lines+=o*a;break;case n.POINTS:e.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function f_(n,t,e){const i=new WeakMap,s=new Re;function a(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let M=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const p=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let y=0;p===!0&&(y=1),v===!0&&(y=2),g===!0&&(y=3);let P=o.attributes.position.count*y,S=1;P>t.maxTextureSize&&(S=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);const w=new Float32Array(P*S*4*f),A=new iu(w,P,S,f);A.type=$n,A.needsUpdate=!0;const E=y*4;for(let R=0;R<f;R++){const U=m[R],F=x[R],B=_[R],L=P*S*4*R;for(let C=0;C<U.count;C++){const X=C*E;p===!0&&(s.fromBufferAttribute(U,C),w[L+X+0]=s.x,w[L+X+1]=s.y,w[L+X+2]=s.z,w[L+X+3]=0),v===!0&&(s.fromBufferAttribute(F,C),w[L+X+4]=s.x,w[L+X+5]=s.y,w[L+X+6]=s.z,w[L+X+7]=0),g===!0&&(s.fromBufferAttribute(B,C),w[L+X+8]=s.x,w[L+X+9]=s.y,w[L+X+10]=s.z,w[L+X+11]=B.itemSize===4?s.w:1)}}d={count:f,texture:A,size:new Bt(P,S)},i.set(o,d),o.addEventListener("dispose",M)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",r.morphTexture,e);else{let p=0;for(let g=0;g<l.length;g++)p+=l[g];const v=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function p_(n,t,e,i){let s=new WeakMap;function a(c){const l=i.render.frame,h=c.geometry,f=t.get(c,h);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return f}function r(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:a,dispose:r}}class uu extends Je{constructor(t,e,i,s,a,r,o,c,l,h=cs){if(h!==cs&&h!==gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===cs&&(i=Li),i===void 0&&h===gs&&(i=ms),super(null,s,a,r,o,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:An,this.minFilter=c!==void 0?c:An,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const fu=new Je,Ih=new uu(1,1),pu=new iu,mu=new tg,gu=new lu,kh=[],Uh=[],Fh=new Float32Array(16),Nh=new Float32Array(9),zh=new Float32Array(4);function ys(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=kh[s];if(a===void 0&&(a=new Float32Array(s),kh[s]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,n[r].toArray(a,o)}return a}function Ie(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function ke(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function vr(n,t){let e=Uh[t];e===void 0&&(e=new Int32Array(t),Uh[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function m_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function g_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2fv(this.addr,t),ke(e,t)}}function x_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;n.uniform3fv(this.addr,t),ke(e,t)}}function v_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4fv(this.addr,t),ke(e,t)}}function __(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),ke(e,t)}else{if(Ie(e,i))return;zh.set(i),n.uniformMatrix2fv(this.addr,!1,zh),ke(e,i)}}function y_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),ke(e,t)}else{if(Ie(e,i))return;Nh.set(i),n.uniformMatrix3fv(this.addr,!1,Nh),ke(e,i)}}function M_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ie(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),ke(e,t)}else{if(Ie(e,i))return;Fh.set(i),n.uniformMatrix4fv(this.addr,!1,Fh),ke(e,i)}}function S_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function b_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2iv(this.addr,t),ke(e,t)}}function E_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;n.uniform3iv(this.addr,t),ke(e,t)}}function w_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4iv(this.addr,t),ke(e,t)}}function A_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function T_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;n.uniform2uiv(this.addr,t),ke(e,t)}}function R_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;n.uniform3uiv(this.addr,t),ke(e,t)}}function C_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;n.uniform4uiv(this.addr,t),ke(e,t)}}function P_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Ih.compareFunction=tu,a=Ih):a=fu,e.setTexture2D(t||a,s)}function L_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||mu,s)}function D_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||gu,s)}function I_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||pu,s)}function k_(n){switch(n){case 5126:return m_;case 35664:return g_;case 35665:return x_;case 35666:return v_;case 35674:return __;case 35675:return y_;case 35676:return M_;case 5124:case 35670:return S_;case 35667:case 35671:return b_;case 35668:case 35672:return E_;case 35669:case 35673:return w_;case 5125:return A_;case 36294:return T_;case 36295:return R_;case 36296:return C_;case 35678:case 36198:case 36298:case 36306:case 35682:return P_;case 35679:case 36299:case 36307:return L_;case 35680:case 36300:case 36308:case 36293:return D_;case 36289:case 36303:case 36311:case 36292:return I_}}function U_(n,t){n.uniform1fv(this.addr,t)}function F_(n,t){const e=ys(t,this.size,2);n.uniform2fv(this.addr,e)}function N_(n,t){const e=ys(t,this.size,3);n.uniform3fv(this.addr,e)}function z_(n,t){const e=ys(t,this.size,4);n.uniform4fv(this.addr,e)}function O_(n,t){const e=ys(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function B_(n,t){const e=ys(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function H_(n,t){const e=ys(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function G_(n,t){n.uniform1iv(this.addr,t)}function V_(n,t){n.uniform2iv(this.addr,t)}function X_(n,t){n.uniform3iv(this.addr,t)}function W_(n,t){n.uniform4iv(this.addr,t)}function $_(n,t){n.uniform1uiv(this.addr,t)}function Y_(n,t){n.uniform2uiv(this.addr,t)}function Z_(n,t){n.uniform3uiv(this.addr,t)}function q_(n,t){n.uniform4uiv(this.addr,t)}function j_(n,t,e){const i=this.cache,s=t.length,a=vr(e,s);Ie(i,a)||(n.uniform1iv(this.addr,a),ke(i,a));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||fu,a[r])}function K_(n,t,e){const i=this.cache,s=t.length,a=vr(e,s);Ie(i,a)||(n.uniform1iv(this.addr,a),ke(i,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||mu,a[r])}function J_(n,t,e){const i=this.cache,s=t.length,a=vr(e,s);Ie(i,a)||(n.uniform1iv(this.addr,a),ke(i,a));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||gu,a[r])}function Q_(n,t,e){const i=this.cache,s=t.length,a=vr(e,s);Ie(i,a)||(n.uniform1iv(this.addr,a),ke(i,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||pu,a[r])}function ty(n){switch(n){case 5126:return U_;case 35664:return F_;case 35665:return N_;case 35666:return z_;case 35674:return O_;case 35675:return B_;case 35676:return H_;case 5124:case 35670:return G_;case 35667:case 35671:return V_;case 35668:case 35672:return X_;case 35669:case 35673:return W_;case 5125:return $_;case 36294:return Y_;case 36295:return Z_;case 36296:return q_;case 35678:case 36198:case 36298:case 36306:case 35682:return j_;case 35679:case 36299:case 36307:return K_;case 35680:case 36300:case 36308:case 36293:return J_;case 36289:case 36303:case 36311:case 36292:return Q_}}class ey{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=k_(e.type)}}class ny{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ty(e.type)}}class iy{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(t,e[o.id],i)}}}const uo=/(\w+)(\])?(\[|\.)?/g;function Oh(n,t){n.seq.push(t),n.map[t.id]=t}function sy(n,t,e){const i=n.name,s=i.length;for(uo.lastIndex=0;;){const a=uo.exec(i),r=uo.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Oh(e,l===void 0?new ey(o,n,t):new ny(o,n,t));break}else{let f=e.map[o];f===void 0&&(f=new iy(o),Oh(e,f)),e=f}}}class qa{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),r=t.getUniformLocation(e,a.name);sy(a,r,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,r=e.length;a!==r;++a){const o=e[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const r=t[s];r.id in e&&i.push(r)}return i}}function Bh(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const ay=37297;let ry=0;function oy(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return i.join(`
`)}const Hh=new ee;function cy(n){he._getMatrix(Hh,he.workingColorSpace,n);const t=`mat3( ${Hh.elements.map(e=>e.toFixed(4))} )`;switch(he.getTransfer(n)){case gr:return[t,"LinearTransferOETF"];case ge:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Gh(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+oy(n.getShaderSource(t),r)}else return s}function ly(n,t){const e=cy(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function hy(n,t){let e;switch(t){case u0:e="Linear";break;case f0:e="Reinhard";break;case p0:e="Cineon";break;case m0:e="ACESFilmic";break;case x0:e="AgX";break;case v0:e="Neutral";break;case g0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ca=new V;function dy(){he.getLuminanceCoefficients(Ca);const n=Ca.x.toFixed(4),t=Ca.y.toFixed(4),e=Ca.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function uy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fs).join(`
`)}function fy(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function py(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:n.getAttribLocation(t,r),locationSize:o}}return e}function Fs(n){return n!==""}function Vh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Xh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const my=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ac(n){return n.replace(my,xy)}const gy=new Map;function xy(n,t){let e=ne[t];if(e===void 0){const i=gy.get(t);if(i!==void 0)e=ne[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Ac(e)}const vy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wh(n){return n.replace(vy,_y)}function _y(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function $h(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function yy(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Bd?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Hd?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Vn&&(t="SHADOWMAP_TYPE_VSM"),t}function My(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case fs:case ps:t="ENVMAP_TYPE_CUBE";break;case mr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Sy(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ps:t="ENVMAP_MODE_REFRACTION";break}return t}function by(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Xc:t="ENVMAP_BLENDING_MULTIPLY";break;case h0:t="ENVMAP_BLENDING_MIX";break;case d0:t="ENVMAP_BLENDING_ADD";break}return t}function Ey(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function wy(n,t,e,i){const s=n.getContext(),a=e.defines;let r=e.vertexShader,o=e.fragmentShader;const c=yy(e),l=My(e),h=Sy(e),f=by(e),d=Ey(e),u=uy(e),p=fy(a),v=s.createProgram();let g,m,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Fs).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Fs).join(`
`),m.length>0&&(m+=`
`)):(g=[$h(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fs).join(`
`),m=[$h(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ri?"#define TONE_MAPPING":"",e.toneMapping!==ri?ne.tonemapping_pars_fragment:"",e.toneMapping!==ri?hy("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ne.colorspace_pars_fragment,ly("linearToOutputTexel",e.outputColorSpace),dy(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Fs).join(`
`)),r=Ac(r),r=Vh(r,e),r=Xh(r,e),o=Ac(o),o=Vh(o,e),o=Xh(o,e),r=Wh(r),o=Wh(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===ih?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ih?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const _=x+g+r,y=x+m+o,P=Bh(s,s.VERTEX_SHADER,_),S=Bh(s,s.FRAGMENT_SHADER,y);s.attachShader(v,P),s.attachShader(v,S),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function w(R){if(n.debug.checkShaderErrors){const U=s.getProgramInfoLog(v).trim(),F=s.getShaderInfoLog(P).trim(),B=s.getShaderInfoLog(S).trim();let L=!0,C=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,P,S);else{const X=Gh(s,P,"vertex"),H=Gh(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+U+`
`+X+`
`+H)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(F===""||B==="")&&(C=!1);C&&(R.diagnostics={runnable:L,programLog:U,vertexShader:{log:F,prefix:g},fragmentShader:{log:B,prefix:m}})}s.deleteShader(P),s.deleteShader(S),A=new qa(s,v),E=py(s,v)}let A;this.getUniforms=function(){return A===void 0&&w(this),A};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,ay)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ry++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=P,this.fragmentShader=S,this}let Ay=0;class Ty{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Ry(t),e.set(t,i)),i}}class Ry{constructor(t){this.id=Ay++,this.code=t,this.usedTimes=0}}function Cy(n,t,e,i,s,a,r){const o=new Qc,c=new Ty,l=new Set,h=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let u=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(E){return l.add(E),E===0?"uv":`uv${E}`}function g(E,M,R,U,F){const B=U.fog,L=F.geometry,C=E.isMeshStandardMaterial?U.environment:null,X=(E.isMeshStandardMaterial?e:t).get(E.envMap||C),H=X&&X.mapping===mr?X.image.height:null,q=p[E.type];E.precision!==null&&(u=s.getMaxPrecision(E.precision),u!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",u,"instead."));const j=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,st=j!==void 0?j.length:0;let ft=0;L.morphAttributes.position!==void 0&&(ft=1),L.morphAttributes.normal!==void 0&&(ft=2),L.morphAttributes.color!==void 0&&(ft=3);let _t,Y,tt,mt;if(q){const jt=Dn[q];_t=jt.vertexShader,Y=jt.fragmentShader}else _t=E.vertexShader,Y=E.fragmentShader,c.update(E),tt=c.getVertexShaderID(E),mt=c.getFragmentShaderID(E);const J=n.getRenderTarget(),gt=n.state.buffers.depth.getReversed(),Ut=F.isInstancedMesh===!0,Dt=F.isBatchedMesh===!0,Mt=!!E.map,Pt=!!E.matcap,Ct=!!X,G=!!E.aoMap,te=!!E.lightMap,Ft=!!E.bumpMap,Nt=!!E.normalMap,Lt=!!E.displacementMap,Rt=!!E.emissiveMap,It=!!E.metalnessMap,D=!!E.roughnessMap,b=E.anisotropy>0,W=E.clearcoat>0,lt=E.dispersion>0,ht=E.iridescence>0,rt=E.sheen>0,zt=E.transmission>0,Q=b&&!!E.anisotropyMap,xt=W&&!!E.clearcoatMap,Wt=W&&!!E.clearcoatNormalMap,nt=W&&!!E.clearcoatRoughnessMap,At=ht&&!!E.iridescenceMap,O=ht&&!!E.iridescenceThicknessMap,at=rt&&!!E.sheenColorMap,ut=rt&&!!E.sheenRoughnessMap,Ot=!!E.specularMap,Ht=!!E.specularColorMap,$t=!!E.specularIntensityMap,z=zt&&!!E.transmissionMap,St=zt&&!!E.thicknessMap,K=!!E.gradientMap,ot=!!E.alphaMap,bt=E.alphaTest>0,wt=!!E.alphaHash,Xt=!!E.extensions;let Kt=ri;E.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Kt=n.toneMapping);const ce={shaderID:q,shaderType:E.type,shaderName:E.name,vertexShader:_t,fragmentShader:Y,defines:E.defines,customVertexShaderID:tt,customFragmentShaderID:mt,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:u,batching:Dt,batchingColor:Dt&&F._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&F.instanceColor!==null,instancingMorph:Ut&&F.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:vs,alphaToCoverage:!!E.alphaToCoverage,map:Mt,matcap:Pt,envMap:Ct,envMapMode:Ct&&X.mapping,envMapCubeUVHeight:H,aoMap:G,lightMap:te,bumpMap:Ft,normalMap:Nt,displacementMap:d&&Lt,emissiveMap:Rt,normalMapObjectSpace:Nt&&E.normalMapType===S0,normalMapTangentSpace:Nt&&E.normalMapType===Qd,metalnessMap:It,roughnessMap:D,anisotropy:b,anisotropyMap:Q,clearcoat:W,clearcoatMap:xt,clearcoatNormalMap:Wt,clearcoatRoughnessMap:nt,dispersion:lt,iridescence:ht,iridescenceMap:At,iridescenceThicknessMap:O,sheen:rt,sheenColorMap:at,sheenRoughnessMap:ut,specularMap:Ot,specularColorMap:Ht,specularIntensityMap:$t,transmission:zt,transmissionMap:z,thicknessMap:St,gradientMap:K,opaque:E.transparent===!1&&E.blending===os&&E.alphaToCoverage===!1,alphaMap:ot,alphaTest:bt,alphaHash:wt,combine:E.combine,mapUv:Mt&&v(E.map.channel),aoMapUv:G&&v(E.aoMap.channel),lightMapUv:te&&v(E.lightMap.channel),bumpMapUv:Ft&&v(E.bumpMap.channel),normalMapUv:Nt&&v(E.normalMap.channel),displacementMapUv:Lt&&v(E.displacementMap.channel),emissiveMapUv:Rt&&v(E.emissiveMap.channel),metalnessMapUv:It&&v(E.metalnessMap.channel),roughnessMapUv:D&&v(E.roughnessMap.channel),anisotropyMapUv:Q&&v(E.anisotropyMap.channel),clearcoatMapUv:xt&&v(E.clearcoatMap.channel),clearcoatNormalMapUv:Wt&&v(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&v(E.clearcoatRoughnessMap.channel),iridescenceMapUv:At&&v(E.iridescenceMap.channel),iridescenceThicknessMapUv:O&&v(E.iridescenceThicknessMap.channel),sheenColorMapUv:at&&v(E.sheenColorMap.channel),sheenRoughnessMapUv:ut&&v(E.sheenRoughnessMap.channel),specularMapUv:Ot&&v(E.specularMap.channel),specularColorMapUv:Ht&&v(E.specularColorMap.channel),specularIntensityMapUv:$t&&v(E.specularIntensityMap.channel),transmissionMapUv:z&&v(E.transmissionMap.channel),thicknessMapUv:St&&v(E.thicknessMap.channel),alphaMapUv:ot&&v(E.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Nt||b),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!L.attributes.uv&&(Mt||ot),fog:!!B,useFog:E.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:gt,skinning:F.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:st,morphTextureStride:ft,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:Kt,decodeVideoTexture:Mt&&E.map.isVideoTexture===!0&&he.getTransfer(E.map.colorSpace)===ge,decodeVideoTextureEmissive:Rt&&E.emissiveMap.isVideoTexture===!0&&he.getTransfer(E.emissiveMap.colorSpace)===ge,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Te,flipSided:E.side===nn,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Xt&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xt&&E.extensions.multiDraw===!0||Dt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return ce.vertexUv1s=l.has(1),ce.vertexUv2s=l.has(2),ce.vertexUv3s=l.has(3),l.clear(),ce}function m(E){const M=[];if(E.shaderID?M.push(E.shaderID):(M.push(E.customVertexShaderID),M.push(E.customFragmentShaderID)),E.defines!==void 0)for(const R in E.defines)M.push(R),M.push(E.defines[R]);return E.isRawShaderMaterial===!1&&(x(M,E),_(M,E),M.push(n.outputColorSpace)),M.push(E.customProgramCacheKey),M.join()}function x(E,M){E.push(M.precision),E.push(M.outputColorSpace),E.push(M.envMapMode),E.push(M.envMapCubeUVHeight),E.push(M.mapUv),E.push(M.alphaMapUv),E.push(M.lightMapUv),E.push(M.aoMapUv),E.push(M.bumpMapUv),E.push(M.normalMapUv),E.push(M.displacementMapUv),E.push(M.emissiveMapUv),E.push(M.metalnessMapUv),E.push(M.roughnessMapUv),E.push(M.anisotropyMapUv),E.push(M.clearcoatMapUv),E.push(M.clearcoatNormalMapUv),E.push(M.clearcoatRoughnessMapUv),E.push(M.iridescenceMapUv),E.push(M.iridescenceThicknessMapUv),E.push(M.sheenColorMapUv),E.push(M.sheenRoughnessMapUv),E.push(M.specularMapUv),E.push(M.specularColorMapUv),E.push(M.specularIntensityMapUv),E.push(M.transmissionMapUv),E.push(M.thicknessMapUv),E.push(M.combine),E.push(M.fogExp2),E.push(M.sizeAttenuation),E.push(M.morphTargetsCount),E.push(M.morphAttributeCount),E.push(M.numDirLights),E.push(M.numPointLights),E.push(M.numSpotLights),E.push(M.numSpotLightMaps),E.push(M.numHemiLights),E.push(M.numRectAreaLights),E.push(M.numDirLightShadows),E.push(M.numPointLightShadows),E.push(M.numSpotLightShadows),E.push(M.numSpotLightShadowsWithMaps),E.push(M.numLightProbes),E.push(M.shadowMapType),E.push(M.toneMapping),E.push(M.numClippingPlanes),E.push(M.numClipIntersection),E.push(M.depthPacking)}function _(E,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),E.push(o.mask)}function y(E){const M=p[E.type];let R;if(M){const U=Dn[M];R=ug.clone(U.uniforms)}else R=E.uniforms;return R}function P(E,M){let R;for(let U=0,F=h.length;U<F;U++){const B=h[U];if(B.cacheKey===M){R=B,++R.usedTimes;break}}return R===void 0&&(R=new wy(n,M,E,a),h.push(R)),R}function S(E){if(--E.usedTimes===0){const M=h.indexOf(E);h[M]=h[h.length-1],h.pop(),E.destroy()}}function w(E){c.remove(E)}function A(){c.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:y,acquireProgram:P,releaseProgram:S,releaseShaderCache:w,programs:h,dispose:A}}function Py(){let n=new WeakMap;function t(r){return n.has(r)}function e(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,c){n.get(r)[o]=c}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function Ly(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Yh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Zh(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function r(f,d,u,p,v,g){let m=n[t];return m===void 0?(m={id:f.id,object:f,geometry:d,material:u,groupOrder:p,renderOrder:f.renderOrder,z:v,group:g},n[t]=m):(m.id=f.id,m.object=f,m.geometry=d,m.material=u,m.groupOrder=p,m.renderOrder=f.renderOrder,m.z=v,m.group=g),t++,m}function o(f,d,u,p,v,g){const m=r(f,d,u,p,v,g);u.transmission>0?i.push(m):u.transparent===!0?s.push(m):e.push(m)}function c(f,d,u,p,v,g){const m=r(f,d,u,p,v,g);u.transmission>0?i.unshift(m):u.transparent===!0?s.unshift(m):e.unshift(m)}function l(f,d){e.length>1&&e.sort(f||Ly),i.length>1&&i.sort(d||Yh),s.length>1&&s.sort(d||Yh)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:o,unshift:c,finish:h,sort:l}}function Dy(){let n=new WeakMap;function t(i,s){const a=n.get(i);let r;return a===void 0?(r=new Zh,n.set(i,[r])):s>=a.length?(r=new Zh,a.push(r)):r=a[s],r}function e(){n=new WeakMap}return{get:t,dispose:e}}function Iy(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new Zt};break;case"SpotLight":e={position:new V,direction:new V,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new V,halfWidth:new V,halfHeight:new V};break}return n[t.id]=e,e}}}function ky(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Uy=0;function Fy(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Ny(n){const t=new Iy,e=ky(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new V);const s=new V,a=new Me,r=new Me;function o(l){let h=0,f=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let u=0,p=0,v=0,g=0,m=0,x=0,_=0,y=0,P=0,S=0,w=0;l.sort(Fy);for(let E=0,M=l.length;E<M;E++){const R=l[E],U=R.color,F=R.intensity,B=R.distance,L=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=U.r*F,f+=U.g*F,d+=U.b*F;else if(R.isLightProbe){for(let C=0;C<9;C++)i.probe[C].addScaledVector(R.sh.coefficients[C],F);w++}else if(R.isDirectionalLight){const C=t.get(R);if(C.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const X=R.shadow,H=e.get(R);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.directionalShadow[u]=H,i.directionalShadowMap[u]=L,i.directionalShadowMatrix[u]=R.shadow.matrix,x++}i.directional[u]=C,u++}else if(R.isSpotLight){const C=t.get(R);C.position.setFromMatrixPosition(R.matrixWorld),C.color.copy(U).multiplyScalar(F),C.distance=B,C.coneCos=Math.cos(R.angle),C.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),C.decay=R.decay,i.spot[v]=C;const X=R.shadow;if(R.map&&(i.spotLightMap[P]=R.map,P++,X.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[v]=X.matrix,R.castShadow){const H=e.get(R);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,i.spotShadow[v]=H,i.spotShadowMap[v]=L,y++}v++}else if(R.isRectAreaLight){const C=t.get(R);C.color.copy(U).multiplyScalar(F),C.halfWidth.set(R.width*.5,0,0),C.halfHeight.set(0,R.height*.5,0),i.rectArea[g]=C,g++}else if(R.isPointLight){const C=t.get(R);if(C.color.copy(R.color).multiplyScalar(R.intensity),C.distance=R.distance,C.decay=R.decay,R.castShadow){const X=R.shadow,H=e.get(R);H.shadowIntensity=X.intensity,H.shadowBias=X.bias,H.shadowNormalBias=X.normalBias,H.shadowRadius=X.radius,H.shadowMapSize=X.mapSize,H.shadowCameraNear=X.camera.near,H.shadowCameraFar=X.camera.far,i.pointShadow[p]=H,i.pointShadowMap[p]=L,i.pointShadowMatrix[p]=R.shadow.matrix,_++}i.point[p]=C,p++}else if(R.isHemisphereLight){const C=t.get(R);C.skyColor.copy(R.color).multiplyScalar(F),C.groundColor.copy(R.groundColor).multiplyScalar(F),i.hemi[m]=C,m++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=kt.LTC_FLOAT_1,i.rectAreaLTC2=kt.LTC_FLOAT_2):(i.rectAreaLTC1=kt.LTC_HALF_1,i.rectAreaLTC2=kt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const A=i.hash;(A.directionalLength!==u||A.pointLength!==p||A.spotLength!==v||A.rectAreaLength!==g||A.hemiLength!==m||A.numDirectionalShadows!==x||A.numPointShadows!==_||A.numSpotShadows!==y||A.numSpotMaps!==P||A.numLightProbes!==w)&&(i.directional.length=u,i.spot.length=v,i.rectArea.length=g,i.point.length=p,i.hemi.length=m,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=y+P-S,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=w,A.directionalLength=u,A.pointLength=p,A.spotLength=v,A.rectAreaLength=g,A.hemiLength=m,A.numDirectionalShadows=x,A.numPointShadows=_,A.numSpotShadows=y,A.numSpotMaps=P,A.numLightProbes=w,i.version=Uy++)}function c(l,h){let f=0,d=0,u=0,p=0,v=0;const g=h.matrixWorldInverse;for(let m=0,x=l.length;m<x;m++){const _=l[m];if(_.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(_.isSpotLight){const y=i.spot[u];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),u++}else if(_.isRectAreaLight){const y=i.rectArea[p];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(g),r.identity(),a.copy(_.matrixWorld),a.premultiply(g),r.extractRotation(a),y.halfWidth.set(_.width*.5,0,0),y.halfHeight.set(0,_.height*.5,0),y.halfWidth.applyMatrix4(r),y.halfHeight.applyMatrix4(r),p++}else if(_.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(_.matrixWorld),y.direction.transformDirection(g),v++}}}return{setup:o,setupView:c,state:i}}function qh(n){const t=new Ny(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function a(h){e.push(h)}function r(h){i.push(h)}function o(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:r}}function zy(n){let t=new WeakMap;function e(s,a=0){const r=t.get(s);let o;return r===void 0?(o=new qh(n),t.set(s,[o])):a>=r.length?(o=new qh(n),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:e,dispose:i}}class Oy extends ki{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=y0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class By extends ki{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Hy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gy=`uniform sampler2D shadow_pass;
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
}`;function Vy(n,t,e){let i=new tl;const s=new Bt,a=new Bt,r=new Re,o=new Oy({depthPacking:M0}),c=new By,l={},h=e.maxTextureSize,f={[oi]:nn,[nn]:oi,[Te]:Te},d=new ci({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Bt},radius:{value:4}},vertexShader:Hy,fragmentShader:Gy}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const p=new Ue;p.setAttribute("position",new Qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new re(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Bd;let m=this.type;this.render=function(S,w,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const E=n.getRenderTarget(),M=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),U=n.state;U.setBlending(ai),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const F=m!==Vn&&this.type===Vn,B=m===Vn&&this.type!==Vn;for(let L=0,C=S.length;L<C;L++){const X=S[L],H=X.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const q=H.getFrameExtents();if(s.multiply(q),a.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/q.x),s.x=a.x*q.x,H.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/q.y),s.y=a.y*q.y,H.mapSize.y=a.y)),H.map===null||F===!0||B===!0){const st=this.type!==Vn?{minFilter:An,magFilter:An}:{};H.map!==null&&H.map.dispose(),H.map=new Di(s.x,s.y,st),H.map.texture.name=X.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const j=H.getViewportCount();for(let st=0;st<j;st++){const ft=H.getViewport(st);r.set(a.x*ft.x,a.y*ft.y,a.x*ft.z,a.y*ft.w),U.viewport(r),H.updateMatrices(X,st),i=H.getFrustum(),y(w,A,H.camera,X,this.type)}H.isPointLightShadow!==!0&&this.type===Vn&&x(H,A),H.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(E,M,R)};function x(S,w){const A=t.update(v);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,u.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Di(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(w,null,A,d,v,null),u.uniforms.shadow_pass.value=S.mapPass.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(w,null,A,u,v,null)}function _(S,w,A,E){let M=null;const R=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)M=R;else if(M=A.isPointLight===!0?c:o,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const U=M.uuid,F=w.uuid;let B=l[U];B===void 0&&(B={},l[U]=B);let L=B[F];L===void 0&&(L=M.clone(),B[F]=L,w.addEventListener("dispose",P)),M=L}if(M.visible=w.visible,M.wireframe=w.wireframe,E===Vn?M.side=w.shadowSide!==null?w.shadowSide:w.side:M.side=w.shadowSide!==null?w.shadowSide:f[w.side],M.alphaMap=w.alphaMap,M.alphaTest=w.alphaTest,M.map=w.map,M.clipShadows=w.clipShadows,M.clippingPlanes=w.clippingPlanes,M.clipIntersection=w.clipIntersection,M.displacementMap=w.displacementMap,M.displacementScale=w.displacementScale,M.displacementBias=w.displacementBias,M.wireframeLinewidth=w.wireframeLinewidth,M.linewidth=w.linewidth,A.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const U=n.properties.get(M);U.light=A}return M}function y(S,w,A,E,M){if(S.visible===!1)return;if(S.layers.test(w.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Vn)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const F=t.update(S),B=S.material;if(Array.isArray(B)){const L=F.groups;for(let C=0,X=L.length;C<X;C++){const H=L[C],q=B[H.materialIndex];if(q&&q.visible){const j=_(S,q,E,M);S.onBeforeShadow(n,S,w,A,F,j,H),n.renderBufferDirect(A,null,F,j,S,H),S.onAfterShadow(n,S,w,A,F,j,H)}}}else if(B.visible){const L=_(S,B,E,M);S.onBeforeShadow(n,S,w,A,F,L,null),n.renderBufferDirect(A,null,F,L,S,null),S.onAfterShadow(n,S,w,A,F,L,null)}}const U=S.children;for(let F=0,B=U.length;F<B;F++)y(U[F],w,A,E,M)}function P(S){S.target.removeEventListener("dispose",P);for(const A in l){const E=l[A],M=S.target.uuid;M in E&&(E[M].dispose(),delete E[M])}}}const Xy={[Go]:Vo,[Xo]:Yo,[Wo]:Zo,[us]:$o,[Vo]:Go,[Yo]:Xo,[Zo]:Wo,[$o]:us};function Wy(n,t){function e(){let z=!1;const St=new Re;let K=null;const ot=new Re(0,0,0,0);return{setMask:function(bt){K!==bt&&!z&&(n.colorMask(bt,bt,bt,bt),K=bt)},setLocked:function(bt){z=bt},setClear:function(bt,wt,Xt,Kt,ce){ce===!0&&(bt*=Kt,wt*=Kt,Xt*=Kt),St.set(bt,wt,Xt,Kt),ot.equals(St)===!1&&(n.clearColor(bt,wt,Xt,Kt),ot.copy(St))},reset:function(){z=!1,K=null,ot.set(-1,0,0,0)}}}function i(){let z=!1,St=!1,K=null,ot=null,bt=null;return{setReversed:function(wt){if(St!==wt){const Xt=t.get("EXT_clip_control");St?Xt.clipControlEXT(Xt.LOWER_LEFT_EXT,Xt.ZERO_TO_ONE_EXT):Xt.clipControlEXT(Xt.LOWER_LEFT_EXT,Xt.NEGATIVE_ONE_TO_ONE_EXT);const Kt=bt;bt=null,this.setClear(Kt)}St=wt},getReversed:function(){return St},setTest:function(wt){wt?J(n.DEPTH_TEST):gt(n.DEPTH_TEST)},setMask:function(wt){K!==wt&&!z&&(n.depthMask(wt),K=wt)},setFunc:function(wt){if(St&&(wt=Xy[wt]),ot!==wt){switch(wt){case Go:n.depthFunc(n.NEVER);break;case Vo:n.depthFunc(n.ALWAYS);break;case Xo:n.depthFunc(n.LESS);break;case us:n.depthFunc(n.LEQUAL);break;case Wo:n.depthFunc(n.EQUAL);break;case $o:n.depthFunc(n.GEQUAL);break;case Yo:n.depthFunc(n.GREATER);break;case Zo:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ot=wt}},setLocked:function(wt){z=wt},setClear:function(wt){bt!==wt&&(St&&(wt=1-wt),n.clearDepth(wt),bt=wt)},reset:function(){z=!1,K=null,ot=null,bt=null,St=!1}}}function s(){let z=!1,St=null,K=null,ot=null,bt=null,wt=null,Xt=null,Kt=null,ce=null;return{setTest:function(jt){z||(jt?J(n.STENCIL_TEST):gt(n.STENCIL_TEST))},setMask:function(jt){St!==jt&&!z&&(n.stencilMask(jt),St=jt)},setFunc:function(jt,ie,_e){(K!==jt||ot!==ie||bt!==_e)&&(n.stencilFunc(jt,ie,_e),K=jt,ot=ie,bt=_e)},setOp:function(jt,ie,_e){(wt!==jt||Xt!==ie||Kt!==_e)&&(n.stencilOp(jt,ie,_e),wt=jt,Xt=ie,Kt=_e)},setLocked:function(jt){z=jt},setClear:function(jt){ce!==jt&&(n.clearStencil(jt),ce=jt)},reset:function(){z=!1,St=null,K=null,ot=null,bt=null,wt=null,Xt=null,Kt=null,ce=null}}}const a=new e,r=new i,o=new s,c=new WeakMap,l=new WeakMap;let h={},f={},d=new WeakMap,u=[],p=null,v=!1,g=null,m=null,x=null,_=null,y=null,P=null,S=null,w=new Zt(0,0,0),A=0,E=!1,M=null,R=null,U=null,F=null,B=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let C=!1,X=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(H)[1]),C=X>=1):H.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),C=X>=2);let q=null,j={};const st=n.getParameter(n.SCISSOR_BOX),ft=n.getParameter(n.VIEWPORT),_t=new Re().fromArray(st),Y=new Re().fromArray(ft);function tt(z,St,K,ot){const bt=new Uint8Array(4),wt=n.createTexture();n.bindTexture(z,wt),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Xt=0;Xt<K;Xt++)z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?n.texImage3D(St,0,n.RGBA,1,1,ot,0,n.RGBA,n.UNSIGNED_BYTE,bt):n.texImage2D(St+Xt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,bt);return wt}const mt={};mt[n.TEXTURE_2D]=tt(n.TEXTURE_2D,n.TEXTURE_2D,1),mt[n.TEXTURE_CUBE_MAP]=tt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),mt[n.TEXTURE_2D_ARRAY]=tt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),mt[n.TEXTURE_3D]=tt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),J(n.DEPTH_TEST),r.setFunc(us),Ft(!1),Nt(Ql),J(n.CULL_FACE),G(ai);function J(z){h[z]!==!0&&(n.enable(z),h[z]=!0)}function gt(z){h[z]!==!1&&(n.disable(z),h[z]=!1)}function Ut(z,St){return f[z]!==St?(n.bindFramebuffer(z,St),f[z]=St,z===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=St),z===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=St),!0):!1}function Dt(z,St){let K=u,ot=!1;if(z){K=d.get(St),K===void 0&&(K=[],d.set(St,K));const bt=z.textures;if(K.length!==bt.length||K[0]!==n.COLOR_ATTACHMENT0){for(let wt=0,Xt=bt.length;wt<Xt;wt++)K[wt]=n.COLOR_ATTACHMENT0+wt;K.length=bt.length,ot=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,ot=!0);ot&&n.drawBuffers(K)}function Mt(z){return p!==z?(n.useProgram(z),p=z,!0):!1}const Pt={[wi]:n.FUNC_ADD,[Ym]:n.FUNC_SUBTRACT,[Zm]:n.FUNC_REVERSE_SUBTRACT};Pt[qm]=n.MIN,Pt[jm]=n.MAX;const Ct={[Km]:n.ZERO,[Jm]:n.ONE,[Qm]:n.SRC_COLOR,[Bo]:n.SRC_ALPHA,[a0]:n.SRC_ALPHA_SATURATE,[i0]:n.DST_COLOR,[e0]:n.DST_ALPHA,[t0]:n.ONE_MINUS_SRC_COLOR,[Ho]:n.ONE_MINUS_SRC_ALPHA,[s0]:n.ONE_MINUS_DST_COLOR,[n0]:n.ONE_MINUS_DST_ALPHA,[r0]:n.CONSTANT_COLOR,[o0]:n.ONE_MINUS_CONSTANT_COLOR,[c0]:n.CONSTANT_ALPHA,[l0]:n.ONE_MINUS_CONSTANT_ALPHA};function G(z,St,K,ot,bt,wt,Xt,Kt,ce,jt){if(z===ai){v===!0&&(gt(n.BLEND),v=!1);return}if(v===!1&&(J(n.BLEND),v=!0),z!==$m){if(z!==g||jt!==E){if((m!==wi||y!==wi)&&(n.blendEquation(n.FUNC_ADD),m=wi,y=wi),jt)switch(z){case os:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ei:n.blendFunc(n.ONE,n.ONE);break;case th:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case eh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case os:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ei:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case th:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case eh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}x=null,_=null,P=null,S=null,w.set(0,0,0),A=0,g=z,E=jt}return}bt=bt||St,wt=wt||K,Xt=Xt||ot,(St!==m||bt!==y)&&(n.blendEquationSeparate(Pt[St],Pt[bt]),m=St,y=bt),(K!==x||ot!==_||wt!==P||Xt!==S)&&(n.blendFuncSeparate(Ct[K],Ct[ot],Ct[wt],Ct[Xt]),x=K,_=ot,P=wt,S=Xt),(Kt.equals(w)===!1||ce!==A)&&(n.blendColor(Kt.r,Kt.g,Kt.b,ce),w.copy(Kt),A=ce),g=z,E=!1}function te(z,St){z.side===Te?gt(n.CULL_FACE):J(n.CULL_FACE);let K=z.side===nn;St&&(K=!K),Ft(K),z.blending===os&&z.transparent===!1?G(ai):G(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),r.setFunc(z.depthFunc),r.setTest(z.depthTest),r.setMask(z.depthWrite),a.setMask(z.colorWrite);const ot=z.stencilWrite;o.setTest(ot),ot&&(o.setMask(z.stencilWriteMask),o.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),o.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Rt(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):gt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ft(z){M!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),M=z)}function Nt(z){z!==Xm?(J(n.CULL_FACE),z!==R&&(z===Ql?n.cullFace(n.BACK):z===Wm?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):gt(n.CULL_FACE),R=z}function Lt(z){z!==U&&(C&&n.lineWidth(z),U=z)}function Rt(z,St,K){z?(J(n.POLYGON_OFFSET_FILL),(F!==St||B!==K)&&(n.polygonOffset(St,K),F=St,B=K)):gt(n.POLYGON_OFFSET_FILL)}function It(z){z?J(n.SCISSOR_TEST):gt(n.SCISSOR_TEST)}function D(z){z===void 0&&(z=n.TEXTURE0+L-1),q!==z&&(n.activeTexture(z),q=z)}function b(z,St,K){K===void 0&&(q===null?K=n.TEXTURE0+L-1:K=q);let ot=j[K];ot===void 0&&(ot={type:void 0,texture:void 0},j[K]=ot),(ot.type!==z||ot.texture!==St)&&(q!==K&&(n.activeTexture(K),q=K),n.bindTexture(z,St||mt[z]),ot.type=z,ot.texture=St)}function W(){const z=j[q];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function lt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ht(){try{n.compressedTexImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function rt(){try{n.texSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function zt(){try{n.texSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Q(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function xt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Wt(){try{n.texStorage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function nt(){try{n.texStorage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function At(){try{n.texImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function O(){try{n.texImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function at(z){_t.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),_t.copy(z))}function ut(z){Y.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),Y.copy(z))}function Ot(z,St){let K=l.get(St);K===void 0&&(K=new WeakMap,l.set(St,K));let ot=K.get(z);ot===void 0&&(ot=n.getUniformBlockIndex(St,z.name),K.set(z,ot))}function Ht(z,St){const ot=l.get(St).get(z);c.get(St)!==ot&&(n.uniformBlockBinding(St,ot,z.__bindingPointIndex),c.set(St,ot))}function $t(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},q=null,j={},f={},d=new WeakMap,u=[],p=null,v=!1,g=null,m=null,x=null,_=null,y=null,P=null,S=null,w=new Zt(0,0,0),A=0,E=!1,M=null,R=null,U=null,F=null,B=null,_t.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:J,disable:gt,bindFramebuffer:Ut,drawBuffers:Dt,useProgram:Mt,setBlending:G,setMaterial:te,setFlipSided:Ft,setCullFace:Nt,setLineWidth:Lt,setPolygonOffset:Rt,setScissorTest:It,activeTexture:D,bindTexture:b,unbindTexture:W,compressedTexImage2D:lt,compressedTexImage3D:ht,texImage2D:At,texImage3D:O,updateUBOMapping:Ot,uniformBlockBinding:Ht,texStorage2D:Wt,texStorage3D:nt,texSubImage2D:rt,texSubImage3D:zt,compressedTexSubImage2D:Q,compressedTexSubImage3D:xt,scissor:at,viewport:ut,reset:$t}}function jh(n,t,e,i){const s=$y(i);switch(e){case $d:return n*t;case Zd:return n*t;case qd:return n*t*2;case jd:return n*t/s.components*s.byteLength;case Zc:return n*t/s.components*s.byteLength;case Kd:return n*t*2/s.components*s.byteLength;case qc:return n*t*2/s.components*s.byteLength;case Yd:return n*t*3/s.components*s.byteLength;case wn:return n*t*4/s.components*s.byteLength;case jc:return n*t*4/s.components*s.byteLength;case Xa:case Wa:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case $a:case Ya:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case tc:case nc:return Math.max(n,16)*Math.max(t,8)/4;case Qo:case ec:return Math.max(n,8)*Math.max(t,8)/2;case ic:case sc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ac:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case rc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case oc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case cc:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case lc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case hc:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case dc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case uc:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case fc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case pc:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case mc:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case gc:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case xc:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case vc:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case _c:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Za:case yc:case Mc:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Jd:case Sc:return Math.ceil(n/4)*Math.ceil(t/4)*8;case bc:case Ec:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function $y(n){switch(n){case qn:case Vd:return{byteLength:1,components:1};case $s:case Xd:case ta:return{byteLength:2,components:1};case $c:case Yc:return{byteLength:2,components:4};case Li:case Wc:case $n:return{byteLength:4,components:1};case Wd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Yy(n,t,e,i,s,a,r){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Bt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(D,b){return u?new OffscreenCanvas(D,b):lr("canvas")}function v(D,b,W){let lt=1;const ht=It(D);if((ht.width>W||ht.height>W)&&(lt=W/Math.max(ht.width,ht.height)),lt<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const rt=Math.floor(lt*ht.width),zt=Math.floor(lt*ht.height);f===void 0&&(f=p(rt,zt));const Q=b?p(rt,zt):f;return Q.width=rt,Q.height=zt,Q.getContext("2d").drawImage(D,0,0,rt,zt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ht.width+"x"+ht.height+") to ("+rt+"x"+zt+")."),Q}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ht.width+"x"+ht.height+")."),D;return D}function g(D){return D.generateMipmaps}function m(D){n.generateMipmap(D)}function x(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(D,b,W,lt,ht=!1){if(D!==null){if(n[D]!==void 0)return n[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let rt=b;if(b===n.RED&&(W===n.FLOAT&&(rt=n.R32F),W===n.HALF_FLOAT&&(rt=n.R16F),W===n.UNSIGNED_BYTE&&(rt=n.R8)),b===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(rt=n.R8UI),W===n.UNSIGNED_SHORT&&(rt=n.R16UI),W===n.UNSIGNED_INT&&(rt=n.R32UI),W===n.BYTE&&(rt=n.R8I),W===n.SHORT&&(rt=n.R16I),W===n.INT&&(rt=n.R32I)),b===n.RG&&(W===n.FLOAT&&(rt=n.RG32F),W===n.HALF_FLOAT&&(rt=n.RG16F),W===n.UNSIGNED_BYTE&&(rt=n.RG8)),b===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(rt=n.RG8UI),W===n.UNSIGNED_SHORT&&(rt=n.RG16UI),W===n.UNSIGNED_INT&&(rt=n.RG32UI),W===n.BYTE&&(rt=n.RG8I),W===n.SHORT&&(rt=n.RG16I),W===n.INT&&(rt=n.RG32I)),b===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(rt=n.RGB8UI),W===n.UNSIGNED_SHORT&&(rt=n.RGB16UI),W===n.UNSIGNED_INT&&(rt=n.RGB32UI),W===n.BYTE&&(rt=n.RGB8I),W===n.SHORT&&(rt=n.RGB16I),W===n.INT&&(rt=n.RGB32I)),b===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(rt=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(rt=n.RGBA16UI),W===n.UNSIGNED_INT&&(rt=n.RGBA32UI),W===n.BYTE&&(rt=n.RGBA8I),W===n.SHORT&&(rt=n.RGBA16I),W===n.INT&&(rt=n.RGBA32I)),b===n.RGB&&W===n.UNSIGNED_INT_5_9_9_9_REV&&(rt=n.RGB9_E5),b===n.RGBA){const zt=ht?gr:he.getTransfer(lt);W===n.FLOAT&&(rt=n.RGBA32F),W===n.HALF_FLOAT&&(rt=n.RGBA16F),W===n.UNSIGNED_BYTE&&(rt=zt===ge?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT_4_4_4_4&&(rt=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(rt=n.RGB5_A1)}return(rt===n.R16F||rt===n.R32F||rt===n.RG16F||rt===n.RG32F||rt===n.RGBA16F||rt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function y(D,b){let W;return D?b===null||b===Li||b===ms?W=n.DEPTH24_STENCIL8:b===$n?W=n.DEPTH32F_STENCIL8:b===$s&&(W=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Li||b===ms?W=n.DEPTH_COMPONENT24:b===$n?W=n.DEPTH_COMPONENT32F:b===$s&&(W=n.DEPTH_COMPONENT16),W}function P(D,b){return g(D)===!0||D.isFramebufferTexture&&D.minFilter!==An&&D.minFilter!==In?Math.log2(Math.max(b.width,b.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?b.mipmaps.length:1}function S(D){const b=D.target;b.removeEventListener("dispose",S),A(b),b.isVideoTexture&&h.delete(b)}function w(D){const b=D.target;b.removeEventListener("dispose",w),M(b)}function A(D){const b=i.get(D);if(b.__webglInit===void 0)return;const W=D.source,lt=d.get(W);if(lt){const ht=lt[b.__cacheKey];ht.usedTimes--,ht.usedTimes===0&&E(D),Object.keys(lt).length===0&&d.delete(W)}i.remove(D)}function E(D){const b=i.get(D);n.deleteTexture(b.__webglTexture);const W=D.source,lt=d.get(W);delete lt[b.__cacheKey],r.memory.textures--}function M(D){const b=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let lt=0;lt<6;lt++){if(Array.isArray(b.__webglFramebuffer[lt]))for(let ht=0;ht<b.__webglFramebuffer[lt].length;ht++)n.deleteFramebuffer(b.__webglFramebuffer[lt][ht]);else n.deleteFramebuffer(b.__webglFramebuffer[lt]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[lt])}else{if(Array.isArray(b.__webglFramebuffer))for(let lt=0;lt<b.__webglFramebuffer.length;lt++)n.deleteFramebuffer(b.__webglFramebuffer[lt]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let lt=0;lt<b.__webglColorRenderbuffer.length;lt++)b.__webglColorRenderbuffer[lt]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[lt]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const W=D.textures;for(let lt=0,ht=W.length;lt<ht;lt++){const rt=i.get(W[lt]);rt.__webglTexture&&(n.deleteTexture(rt.__webglTexture),r.memory.textures--),i.remove(W[lt])}i.remove(D)}let R=0;function U(){R=0}function F(){const D=R;return D>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),R+=1,D}function B(D){const b=[];return b.push(D.wrapS),b.push(D.wrapT),b.push(D.wrapR||0),b.push(D.magFilter),b.push(D.minFilter),b.push(D.anisotropy),b.push(D.internalFormat),b.push(D.format),b.push(D.type),b.push(D.generateMipmaps),b.push(D.premultiplyAlpha),b.push(D.flipY),b.push(D.unpackAlignment),b.push(D.colorSpace),b.join()}function L(D,b){const W=i.get(D);if(D.isVideoTexture&&Lt(D),D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){const lt=D.image;if(lt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(lt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(W,D,b);return}}e.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+b)}function C(D,b){const W=i.get(D);if(D.version>0&&W.__version!==D.version){Y(W,D,b);return}e.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+b)}function X(D,b){const W=i.get(D);if(D.version>0&&W.__version!==D.version){Y(W,D,b);return}e.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+b)}function H(D,b){const W=i.get(D);if(D.version>0&&W.__version!==D.version){tt(W,D,b);return}e.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+b)}const q={[Ko]:n.REPEAT,[Ti]:n.CLAMP_TO_EDGE,[Jo]:n.MIRRORED_REPEAT},j={[An]:n.NEAREST,[_0]:n.NEAREST_MIPMAP_NEAREST,[la]:n.NEAREST_MIPMAP_LINEAR,[In]:n.LINEAR,[Or]:n.LINEAR_MIPMAP_NEAREST,[Ri]:n.LINEAR_MIPMAP_LINEAR},st={[b0]:n.NEVER,[C0]:n.ALWAYS,[E0]:n.LESS,[tu]:n.LEQUAL,[w0]:n.EQUAL,[R0]:n.GEQUAL,[A0]:n.GREATER,[T0]:n.NOTEQUAL};function ft(D,b){if(b.type===$n&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===In||b.magFilter===Or||b.magFilter===la||b.magFilter===Ri||b.minFilter===In||b.minFilter===Or||b.minFilter===la||b.minFilter===Ri)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,q[b.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,q[b.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,q[b.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,j[b.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,j[b.minFilter]),b.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,st[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===An||b.minFilter!==la&&b.minFilter!==Ri||b.type===$n&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");n.texParameterf(D,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function _t(D,b){let W=!1;D.__webglInit===void 0&&(D.__webglInit=!0,b.addEventListener("dispose",S));const lt=b.source;let ht=d.get(lt);ht===void 0&&(ht={},d.set(lt,ht));const rt=B(b);if(rt!==D.__cacheKey){ht[rt]===void 0&&(ht[rt]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,W=!0),ht[rt].usedTimes++;const zt=ht[D.__cacheKey];zt!==void 0&&(ht[D.__cacheKey].usedTimes--,zt.usedTimes===0&&E(b)),D.__cacheKey=rt,D.__webglTexture=ht[rt].texture}return W}function Y(D,b,W){let lt=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(lt=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(lt=n.TEXTURE_3D);const ht=_t(D,b),rt=b.source;e.bindTexture(lt,D.__webglTexture,n.TEXTURE0+W);const zt=i.get(rt);if(rt.version!==zt.__version||ht===!0){e.activeTexture(n.TEXTURE0+W);const Q=he.getPrimaries(he.workingColorSpace),xt=b.colorSpace===ii?null:he.getPrimaries(b.colorSpace),Wt=b.colorSpace===ii||Q===xt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Wt);let nt=v(b.image,!1,s.maxTextureSize);nt=Rt(b,nt);const At=a.convert(b.format,b.colorSpace),O=a.convert(b.type);let at=_(b.internalFormat,At,O,b.colorSpace,b.isVideoTexture);ft(lt,b);let ut;const Ot=b.mipmaps,Ht=b.isVideoTexture!==!0,$t=zt.__version===void 0||ht===!0,z=rt.dataReady,St=P(b,nt);if(b.isDepthTexture)at=y(b.format===gs,b.type),$t&&(Ht?e.texStorage2D(n.TEXTURE_2D,1,at,nt.width,nt.height):e.texImage2D(n.TEXTURE_2D,0,at,nt.width,nt.height,0,At,O,null));else if(b.isDataTexture)if(Ot.length>0){Ht&&$t&&e.texStorage2D(n.TEXTURE_2D,St,at,Ot[0].width,Ot[0].height);for(let K=0,ot=Ot.length;K<ot;K++)ut=Ot[K],Ht?z&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,ut.width,ut.height,At,O,ut.data):e.texImage2D(n.TEXTURE_2D,K,at,ut.width,ut.height,0,At,O,ut.data);b.generateMipmaps=!1}else Ht?($t&&e.texStorage2D(n.TEXTURE_2D,St,at,nt.width,nt.height),z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,nt.width,nt.height,At,O,nt.data)):e.texImage2D(n.TEXTURE_2D,0,at,nt.width,nt.height,0,At,O,nt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Ht&&$t&&e.texStorage3D(n.TEXTURE_2D_ARRAY,St,at,Ot[0].width,Ot[0].height,nt.depth);for(let K=0,ot=Ot.length;K<ot;K++)if(ut=Ot[K],b.format!==wn)if(At!==null)if(Ht){if(z)if(b.layerUpdates.size>0){const bt=jh(ut.width,ut.height,b.format,b.type);for(const wt of b.layerUpdates){const Xt=ut.data.subarray(wt*bt/ut.data.BYTES_PER_ELEMENT,(wt+1)*bt/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,wt,ut.width,ut.height,1,At,Xt)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ut.width,ut.height,nt.depth,At,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,at,ut.width,ut.height,nt.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ht?z&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ut.width,ut.height,nt.depth,At,O,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,K,at,ut.width,ut.height,nt.depth,0,At,O,ut.data)}else{Ht&&$t&&e.texStorage2D(n.TEXTURE_2D,St,at,Ot[0].width,Ot[0].height);for(let K=0,ot=Ot.length;K<ot;K++)ut=Ot[K],b.format!==wn?At!==null?Ht?z&&e.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,ut.width,ut.height,At,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,K,at,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ht?z&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,ut.width,ut.height,At,O,ut.data):e.texImage2D(n.TEXTURE_2D,K,at,ut.width,ut.height,0,At,O,ut.data)}else if(b.isDataArrayTexture)if(Ht){if($t&&e.texStorage3D(n.TEXTURE_2D_ARRAY,St,at,nt.width,nt.height,nt.depth),z)if(b.layerUpdates.size>0){const K=jh(nt.width,nt.height,b.format,b.type);for(const ot of b.layerUpdates){const bt=nt.data.subarray(ot*K/nt.data.BYTES_PER_ELEMENT,(ot+1)*K/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ot,nt.width,nt.height,1,At,O,bt)}b.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,At,O,nt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,at,nt.width,nt.height,nt.depth,0,At,O,nt.data);else if(b.isData3DTexture)Ht?($t&&e.texStorage3D(n.TEXTURE_3D,St,at,nt.width,nt.height,nt.depth),z&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,At,O,nt.data)):e.texImage3D(n.TEXTURE_3D,0,at,nt.width,nt.height,nt.depth,0,At,O,nt.data);else if(b.isFramebufferTexture){if($t)if(Ht)e.texStorage2D(n.TEXTURE_2D,St,at,nt.width,nt.height);else{let K=nt.width,ot=nt.height;for(let bt=0;bt<St;bt++)e.texImage2D(n.TEXTURE_2D,bt,at,K,ot,0,At,O,null),K>>=1,ot>>=1}}else if(Ot.length>0){if(Ht&&$t){const K=It(Ot[0]);e.texStorage2D(n.TEXTURE_2D,St,at,K.width,K.height)}for(let K=0,ot=Ot.length;K<ot;K++)ut=Ot[K],Ht?z&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,At,O,ut):e.texImage2D(n.TEXTURE_2D,K,at,At,O,ut);b.generateMipmaps=!1}else if(Ht){if($t){const K=It(nt);e.texStorage2D(n.TEXTURE_2D,St,at,K.width,K.height)}z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,At,O,nt)}else e.texImage2D(n.TEXTURE_2D,0,at,At,O,nt);g(b)&&m(lt),zt.__version=rt.version,b.onUpdate&&b.onUpdate(b)}D.__version=b.version}function tt(D,b,W){if(b.image.length!==6)return;const lt=_t(D,b),ht=b.source;e.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+W);const rt=i.get(ht);if(ht.version!==rt.__version||lt===!0){e.activeTexture(n.TEXTURE0+W);const zt=he.getPrimaries(he.workingColorSpace),Q=b.colorSpace===ii?null:he.getPrimaries(b.colorSpace),xt=b.colorSpace===ii||zt===Q?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Wt=b.isCompressedTexture||b.image[0].isCompressedTexture,nt=b.image[0]&&b.image[0].isDataTexture,At=[];for(let ot=0;ot<6;ot++)!Wt&&!nt?At[ot]=v(b.image[ot],!0,s.maxCubemapSize):At[ot]=nt?b.image[ot].image:b.image[ot],At[ot]=Rt(b,At[ot]);const O=At[0],at=a.convert(b.format,b.colorSpace),ut=a.convert(b.type),Ot=_(b.internalFormat,at,ut,b.colorSpace),Ht=b.isVideoTexture!==!0,$t=rt.__version===void 0||lt===!0,z=ht.dataReady;let St=P(b,O);ft(n.TEXTURE_CUBE_MAP,b);let K;if(Wt){Ht&&$t&&e.texStorage2D(n.TEXTURE_CUBE_MAP,St,Ot,O.width,O.height);for(let ot=0;ot<6;ot++){K=At[ot].mipmaps;for(let bt=0;bt<K.length;bt++){const wt=K[bt];b.format!==wn?at!==null?Ht?z&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,bt,0,0,wt.width,wt.height,at,wt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,bt,Ot,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ht?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,bt,0,0,wt.width,wt.height,at,ut,wt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,bt,Ot,wt.width,wt.height,0,at,ut,wt.data)}}}else{if(K=b.mipmaps,Ht&&$t){K.length>0&&St++;const ot=It(At[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,St,Ot,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(nt){Ht?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,At[ot].width,At[ot].height,at,ut,At[ot].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Ot,At[ot].width,At[ot].height,0,at,ut,At[ot].data);for(let bt=0;bt<K.length;bt++){const Xt=K[bt].image[ot].image;Ht?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,bt+1,0,0,Xt.width,Xt.height,at,ut,Xt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,bt+1,Ot,Xt.width,Xt.height,0,at,ut,Xt.data)}}else{Ht?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,at,ut,At[ot]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Ot,at,ut,At[ot]);for(let bt=0;bt<K.length;bt++){const wt=K[bt];Ht?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,bt+1,0,0,at,ut,wt.image[ot]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ot,bt+1,Ot,at,ut,wt.image[ot])}}}g(b)&&m(n.TEXTURE_CUBE_MAP),rt.__version=ht.version,b.onUpdate&&b.onUpdate(b)}D.__version=b.version}function mt(D,b,W,lt,ht,rt){const zt=a.convert(W.format,W.colorSpace),Q=a.convert(W.type),xt=_(W.internalFormat,zt,Q,W.colorSpace),Wt=i.get(b),nt=i.get(W);if(nt.__renderTarget=b,!Wt.__hasExternalTextures){const At=Math.max(1,b.width>>rt),O=Math.max(1,b.height>>rt);ht===n.TEXTURE_3D||ht===n.TEXTURE_2D_ARRAY?e.texImage3D(ht,rt,xt,At,O,b.depth,0,zt,Q,null):e.texImage2D(ht,rt,xt,At,O,0,zt,Q,null)}e.bindFramebuffer(n.FRAMEBUFFER,D),Nt(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,lt,ht,nt.__webglTexture,0,Ft(b)):(ht===n.TEXTURE_2D||ht>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ht<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,lt,ht,nt.__webglTexture,rt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function J(D,b,W){if(n.bindRenderbuffer(n.RENDERBUFFER,D),b.depthBuffer){const lt=b.depthTexture,ht=lt&&lt.isDepthTexture?lt.type:null,rt=y(b.stencilBuffer,ht),zt=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=Ft(b);Nt(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Q,rt,b.width,b.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,Q,rt,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,rt,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,zt,n.RENDERBUFFER,D)}else{const lt=b.textures;for(let ht=0;ht<lt.length;ht++){const rt=lt[ht],zt=a.convert(rt.format,rt.colorSpace),Q=a.convert(rt.type),xt=_(rt.internalFormat,zt,Q,rt.colorSpace),Wt=Ft(b);W&&Nt(b)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Wt,xt,b.width,b.height):Nt(b)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Wt,xt,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,xt,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function gt(D,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,D),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const lt=i.get(b.depthTexture);lt.__renderTarget=b,(!lt.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),L(b.depthTexture,0);const ht=lt.__webglTexture,rt=Ft(b);if(b.depthTexture.format===cs)Nt(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ht,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ht,0);else if(b.depthTexture.format===gs)Nt(b)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ht,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ht,0);else throw new Error("Unknown depthTexture format")}function Ut(D){const b=i.get(D),W=D.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==D.depthTexture){const lt=D.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),lt){const ht=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,lt.removeEventListener("dispose",ht)};lt.addEventListener("dispose",ht),b.__depthDisposeCallback=ht}b.__boundDepthTexture=lt}if(D.depthTexture&&!b.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");gt(b.__webglFramebuffer,D)}else if(W){b.__webglDepthbuffer=[];for(let lt=0;lt<6;lt++)if(e.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[lt]),b.__webglDepthbuffer[lt]===void 0)b.__webglDepthbuffer[lt]=n.createRenderbuffer(),J(b.__webglDepthbuffer[lt],D,!1);else{const ht=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=b.__webglDepthbuffer[lt];n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ht,n.RENDERBUFFER,rt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),J(b.__webglDepthbuffer,D,!1);else{const lt=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ht=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ht),n.framebufferRenderbuffer(n.FRAMEBUFFER,lt,n.RENDERBUFFER,ht)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Dt(D,b,W){const lt=i.get(D);b!==void 0&&mt(lt.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&Ut(D)}function Mt(D){const b=D.texture,W=i.get(D),lt=i.get(b);D.addEventListener("dispose",w);const ht=D.textures,rt=D.isWebGLCubeRenderTarget===!0,zt=ht.length>1;if(zt||(lt.__webglTexture===void 0&&(lt.__webglTexture=n.createTexture()),lt.__version=b.version,r.memory.textures++),rt){W.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(b.mipmaps&&b.mipmaps.length>0){W.__webglFramebuffer[Q]=[];for(let xt=0;xt<b.mipmaps.length;xt++)W.__webglFramebuffer[Q][xt]=n.createFramebuffer()}else W.__webglFramebuffer[Q]=n.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){W.__webglFramebuffer=[];for(let Q=0;Q<b.mipmaps.length;Q++)W.__webglFramebuffer[Q]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(zt)for(let Q=0,xt=ht.length;Q<xt;Q++){const Wt=i.get(ht[Q]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=n.createTexture(),r.memory.textures++)}if(D.samples>0&&Nt(D)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let Q=0;Q<ht.length;Q++){const xt=ht[Q];W.__webglColorRenderbuffer[Q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[Q]);const Wt=a.convert(xt.format,xt.colorSpace),nt=a.convert(xt.type),At=_(xt.internalFormat,Wt,nt,xt.colorSpace,D.isXRRenderTarget===!0),O=Ft(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,O,At,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Q,n.RENDERBUFFER,W.__webglColorRenderbuffer[Q])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),J(W.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(rt){e.bindTexture(n.TEXTURE_CUBE_MAP,lt.__webglTexture),ft(n.TEXTURE_CUBE_MAP,b);for(let Q=0;Q<6;Q++)if(b.mipmaps&&b.mipmaps.length>0)for(let xt=0;xt<b.mipmaps.length;xt++)mt(W.__webglFramebuffer[Q][xt],D,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,xt);else mt(W.__webglFramebuffer[Q],D,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);g(b)&&m(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(zt){for(let Q=0,xt=ht.length;Q<xt;Q++){const Wt=ht[Q],nt=i.get(Wt);e.bindTexture(n.TEXTURE_2D,nt.__webglTexture),ft(n.TEXTURE_2D,Wt),mt(W.__webglFramebuffer,D,Wt,n.COLOR_ATTACHMENT0+Q,n.TEXTURE_2D,0),g(Wt)&&m(n.TEXTURE_2D)}e.unbindTexture()}else{let Q=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Q=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Q,lt.__webglTexture),ft(Q,b),b.mipmaps&&b.mipmaps.length>0)for(let xt=0;xt<b.mipmaps.length;xt++)mt(W.__webglFramebuffer[xt],D,b,n.COLOR_ATTACHMENT0,Q,xt);else mt(W.__webglFramebuffer,D,b,n.COLOR_ATTACHMENT0,Q,0);g(b)&&m(Q),e.unbindTexture()}D.depthBuffer&&Ut(D)}function Pt(D){const b=D.textures;for(let W=0,lt=b.length;W<lt;W++){const ht=b[W];if(g(ht)){const rt=x(D),zt=i.get(ht).__webglTexture;e.bindTexture(rt,zt),m(rt),e.unbindTexture()}}}const Ct=[],G=[];function te(D){if(D.samples>0){if(Nt(D)===!1){const b=D.textures,W=D.width,lt=D.height;let ht=n.COLOR_BUFFER_BIT;const rt=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,zt=i.get(D),Q=b.length>1;if(Q)for(let xt=0;xt<b.length;xt++)e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,zt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglFramebuffer);for(let xt=0;xt<b.length;xt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ht|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ht|=n.STENCIL_BUFFER_BIT)),Q){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,zt.__webglColorRenderbuffer[xt]);const Wt=i.get(b[xt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Wt,0)}n.blitFramebuffer(0,0,W,lt,0,0,W,lt,ht,n.NEAREST),c===!0&&(Ct.length=0,G.length=0,Ct.push(n.COLOR_ATTACHMENT0+xt),D.depthBuffer&&D.resolveDepthBuffer===!1&&(Ct.push(rt),G.push(rt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,G)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ct))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Q)for(let xt=0;xt<b.length;xt++){e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,zt.__webglColorRenderbuffer[xt]);const Wt=i.get(b[xt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,Wt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const b=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}function Ft(D){return Math.min(s.maxSamples,D.samples)}function Nt(D){const b=i.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Lt(D){const b=r.render.frame;h.get(D)!==b&&(h.set(D,b),D.update())}function Rt(D,b){const W=D.colorSpace,lt=D.format,ht=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||W!==vs&&W!==ii&&(he.getTransfer(W)===ge?(lt!==wn||ht!==qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),b}function It(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=U,this.setTexture2D=L,this.setTexture2DArray=C,this.setTexture3D=X,this.setTextureCube=H,this.rebindTextures=Dt,this.setupRenderTarget=Mt,this.updateRenderTargetMipmap=Pt,this.updateMultisampleRenderTarget=te,this.setupDepthRenderbuffer=Ut,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=Nt}function Zy(n,t){function e(i,s=ii){let a;const r=he.getTransfer(s);if(i===qn)return n.UNSIGNED_BYTE;if(i===$c)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Yc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Wd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Vd)return n.BYTE;if(i===Xd)return n.SHORT;if(i===$s)return n.UNSIGNED_SHORT;if(i===Wc)return n.INT;if(i===Li)return n.UNSIGNED_INT;if(i===$n)return n.FLOAT;if(i===ta)return n.HALF_FLOAT;if(i===$d)return n.ALPHA;if(i===Yd)return n.RGB;if(i===wn)return n.RGBA;if(i===Zd)return n.LUMINANCE;if(i===qd)return n.LUMINANCE_ALPHA;if(i===cs)return n.DEPTH_COMPONENT;if(i===gs)return n.DEPTH_STENCIL;if(i===jd)return n.RED;if(i===Zc)return n.RED_INTEGER;if(i===Kd)return n.RG;if(i===qc)return n.RG_INTEGER;if(i===jc)return n.RGBA_INTEGER;if(i===Xa||i===Wa||i===$a||i===Ya)if(r===ge)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Xa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Wa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===$a)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ya)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Xa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Wa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===$a)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ya)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Qo||i===tc||i===ec||i===nc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Qo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===tc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ec)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===nc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ic||i===sc||i===ac)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===ic||i===sc)return r===ge?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===ac)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===rc||i===oc||i===cc||i===lc||i===hc||i===dc||i===uc||i===fc||i===pc||i===mc||i===gc||i===xc||i===vc||i===_c)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===rc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===oc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===cc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===lc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===hc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===dc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===uc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===fc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===pc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===mc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===gc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===xc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===vc)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===_c)return r===ge?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Za||i===yc||i===Mc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Za)return r===ge?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===yc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Mc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Jd||i===Sc||i===bc||i===Ec)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Za)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Sc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===bc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ec)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ms?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class qy extends mn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class xe extends Pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const jy={type:"move"};class fo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),m=this._getHandJoint(l,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,p=.005;l.inputState.pinching&&d>u+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=u-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(jy)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new xe;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Ky=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Jy=`
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

}`;class Qy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new Je,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ci({vertexShader:Ky,fragmentShader:Jy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new re(new pn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tM extends _s{constructor(t,e){super();const i=this;let s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,f=null,d=null,u=null,p=null;const v=new Qy,g=e.getContextAttributes();let m=null,x=null;const _=[],y=[],P=new Bt;let S=null;const w=new mn;w.viewport=new Re;const A=new mn;A.viewport=new Re;const E=[w,A],M=new qy;let R=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=_[Y];return tt===void 0&&(tt=new fo,_[Y]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=_[Y];return tt===void 0&&(tt=new fo,_[Y]=tt),tt.getGripSpace()},this.getHand=function(Y){let tt=_[Y];return tt===void 0&&(tt=new fo,_[Y]=tt),tt.getHandSpace()};function F(Y){const tt=y.indexOf(Y.inputSource);if(tt===-1)return;const mt=_[tt];mt!==void 0&&(mt.update(Y.inputSource,Y.frame,l||r),mt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function B(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",L);for(let Y=0;Y<_.length;Y++){const tt=y[Y];tt!==null&&(y[Y]=null,_[Y].disconnect(tt))}R=null,U=null,v.reset(),t.setRenderTarget(m),u=null,d=null,f=null,s=null,x=null,_t.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",B),s.addEventListener("inputsourceschange",L),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(P),s.renderState.layers===void 0){const tt={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,tt),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new Di(u.framebufferWidth,u.framebufferHeight,{format:wn,type:qn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let tt=null,mt=null,J=null;g.depth&&(J=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=g.stencil?gs:cs,mt=g.stencil?ms:Li);const gt={colorFormat:e.RGBA8,depthFormat:J,scaleFactor:a};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(gt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new Di(d.textureWidth,d.textureHeight,{format:wn,type:qn,depthTexture:new uu(d.textureWidth,d.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),_t.setContext(s),_t.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function L(Y){for(let tt=0;tt<Y.removed.length;tt++){const mt=Y.removed[tt],J=y.indexOf(mt);J>=0&&(y[J]=null,_[J].disconnect(mt))}for(let tt=0;tt<Y.added.length;tt++){const mt=Y.added[tt];let J=y.indexOf(mt);if(J===-1){for(let Ut=0;Ut<_.length;Ut++)if(Ut>=y.length){y.push(mt),J=Ut;break}else if(y[Ut]===null){y[Ut]=mt,J=Ut;break}if(J===-1)break}const gt=_[J];gt&&gt.connect(mt)}}const C=new V,X=new V;function H(Y,tt,mt){C.setFromMatrixPosition(tt.matrixWorld),X.setFromMatrixPosition(mt.matrixWorld);const J=C.distanceTo(X),gt=tt.projectionMatrix.elements,Ut=mt.projectionMatrix.elements,Dt=gt[14]/(gt[10]-1),Mt=gt[14]/(gt[10]+1),Pt=(gt[9]+1)/gt[5],Ct=(gt[9]-1)/gt[5],G=(gt[8]-1)/gt[0],te=(Ut[8]+1)/Ut[0],Ft=Dt*G,Nt=Dt*te,Lt=J/(-G+te),Rt=Lt*-G;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Rt),Y.translateZ(Lt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),gt[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const It=Dt+Lt,D=Mt+Lt,b=Ft-Rt,W=Nt+(J-Rt),lt=Pt*Mt/D*It,ht=Ct*Mt/D*It;Y.projectionMatrix.makePerspective(b,W,lt,ht,It,D),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function q(Y,tt){tt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let tt=Y.near,mt=Y.far;v.texture!==null&&(v.depthNear>0&&(tt=v.depthNear),v.depthFar>0&&(mt=v.depthFar)),M.near=A.near=w.near=tt,M.far=A.far=w.far=mt,(R!==M.near||U!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,U=M.far),w.layers.mask=Y.layers.mask|2,A.layers.mask=Y.layers.mask|4,M.layers.mask=w.layers.mask|A.layers.mask;const J=Y.parent,gt=M.cameras;q(M,J);for(let Ut=0;Ut<gt.length;Ut++)q(gt[Ut],J);gt.length===2?H(M,w,A):M.projectionMatrix.copy(w.projectionMatrix),j(Y,M,J)};function j(Y,tt,mt){mt===null?Y.matrix.copy(tt.matrixWorld):(Y.matrix.copy(mt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ys*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let st=null;function ft(Y,tt){if(h=tt.getViewerPose(l||r),p=tt,h!==null){const mt=h.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let J=!1;mt.length!==M.cameras.length&&(M.cameras.length=0,J=!0);for(let Ut=0;Ut<mt.length;Ut++){const Dt=mt[Ut];let Mt=null;if(u!==null)Mt=u.getViewport(Dt);else{const Ct=f.getViewSubImage(d,Dt);Mt=Ct.viewport,Ut===0&&(t.setRenderTargetTextures(x,Ct.colorTexture,d.ignoreDepthValues?void 0:Ct.depthStencilTexture),t.setRenderTarget(x))}let Pt=E[Ut];Pt===void 0&&(Pt=new mn,Pt.layers.enable(Ut),Pt.viewport=new Re,E[Ut]=Pt),Pt.matrix.fromArray(Dt.transform.matrix),Pt.matrix.decompose(Pt.position,Pt.quaternion,Pt.scale),Pt.projectionMatrix.fromArray(Dt.projectionMatrix),Pt.projectionMatrixInverse.copy(Pt.projectionMatrix).invert(),Pt.viewport.set(Mt.x,Mt.y,Mt.width,Mt.height),Ut===0&&(M.matrix.copy(Pt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),J===!0&&M.cameras.push(Pt)}const gt=s.enabledFeatures;if(gt&&gt.includes("depth-sensing")){const Ut=f.getDepthInformation(mt[0]);Ut&&Ut.isValid&&Ut.texture&&v.init(t,Ut,s.renderState)}}for(let mt=0;mt<_.length;mt++){const J=y[mt],gt=_[mt];J!==null&&gt!==void 0&&gt.update(J,tt,l||r)}st&&st(Y,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),p=null}const _t=new hu;_t.setAnimationLoop(ft),this.setAnimationLoop=function(Y){st=Y},this.dispose=function(){}}}const xi=new Fn,eM=new Me;function nM(n,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,ou(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,x,_,y){m.isMeshBasicMaterial||m.isMeshLambertMaterial?a(g,m):m.isMeshToonMaterial?(a(g,m),f(g,m)):m.isMeshPhongMaterial?(a(g,m),h(g,m)):m.isMeshStandardMaterial?(a(g,m),d(g,m),m.isMeshPhysicalMaterial&&u(g,m,y)):m.isMeshMatcapMaterial?(a(g,m),p(g,m)):m.isMeshDepthMaterial?a(g,m):m.isMeshDistanceMaterial?(a(g,m),v(g,m)):m.isMeshNormalMaterial?a(g,m):m.isLineBasicMaterial?(r(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?c(g,m,x,_):m.isSpriteMaterial?l(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function a(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===nn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===nn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const x=t.get(m),_=x.envMap,y=x.envMapRotation;_&&(g.envMap.value=_,xi.copy(y),xi.x*=-1,xi.y*=-1,xi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(xi.y*=-1,xi.z*=-1),g.envMapRotation.value.setFromMatrix4(eM.makeRotationFromEuler(xi)),g.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function r(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function c(g,m,x,_){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*x,g.scale.value=_*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function l(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function f(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function u(g,m,x){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===nn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const x=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function iM(n,t,e,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,_){const y=_.program;i.uniformBlockBinding(x,y)}function l(x,_){let y=s[x.id];y===void 0&&(p(x),y=h(x),s[x.id]=y,x.addEventListener("dispose",g));const P=_.program;i.updateUBOMapping(x,P);const S=t.render.frame;a[x.id]!==S&&(d(x),a[x.id]=S)}function h(x){const _=f();x.__bindingPointIndex=_;const y=n.createBuffer(),P=x.__size,S=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,P,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,y),y}function f(){for(let x=0;x<o;x++)if(r.indexOf(x)===-1)return r.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const _=s[x.id],y=x.uniforms,P=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let S=0,w=y.length;S<w;S++){const A=Array.isArray(y[S])?y[S]:[y[S]];for(let E=0,M=A.length;E<M;E++){const R=A[E];if(u(R,S,E,P)===!0){const U=R.__offset,F=Array.isArray(R.value)?R.value:[R.value];let B=0;for(let L=0;L<F.length;L++){const C=F[L],X=v(C);typeof C=="number"||typeof C=="boolean"?(R.__data[0]=C,n.bufferSubData(n.UNIFORM_BUFFER,U+B,R.__data)):C.isMatrix3?(R.__data[0]=C.elements[0],R.__data[1]=C.elements[1],R.__data[2]=C.elements[2],R.__data[3]=0,R.__data[4]=C.elements[3],R.__data[5]=C.elements[4],R.__data[6]=C.elements[5],R.__data[7]=0,R.__data[8]=C.elements[6],R.__data[9]=C.elements[7],R.__data[10]=C.elements[8],R.__data[11]=0):(C.toArray(R.__data,B),B+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,_,y,P){const S=x.value,w=_+"_"+y;if(P[w]===void 0)return typeof S=="number"||typeof S=="boolean"?P[w]=S:P[w]=S.clone(),!0;{const A=P[w];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return P[w]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function p(x){const _=x.uniforms;let y=0;const P=16;for(let w=0,A=_.length;w<A;w++){const E=Array.isArray(_[w])?_[w]:[_[w]];for(let M=0,R=E.length;M<R;M++){const U=E[M],F=Array.isArray(U.value)?U.value:[U.value];for(let B=0,L=F.length;B<L;B++){const C=F[B],X=v(C),H=y%P,q=H%X.boundary,j=H+q;y+=q,j!==0&&P-j<X.storage&&(y+=P-j),U.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=y,y+=X.storage}}}const S=y%P;return S>0&&(y+=P-S),x.__size=y,x.__cache={},this}function v(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function g(x){const _=x.target;_.removeEventListener("dispose",g);const y=r.indexOf(_.__bindingPointIndex);r.splice(y,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete a[_.id]}function m(){for(const x in s)n.deleteBuffer(s[x]);r=[],s={},a={}}return{bind:c,update:l,dispose:m}}class sM{constructor(t={}){const{canvas:e=$0(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=r;const p=new Uint32Array(4),v=new Int32Array(4);let g=null,m=null;const x=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=je,this.toneMapping=ri,this.toneMappingExposure=1;const y=this;let P=!1,S=0,w=0,A=null,E=-1,M=null;const R=new Re,U=new Re;let F=null;const B=new Zt(0);let L=0,C=e.width,X=e.height,H=1,q=null,j=null;const st=new Re(0,0,C,X),ft=new Re(0,0,C,X);let _t=!1;const Y=new tl;let tt=!1,mt=!1;const J=new Me,gt=new Me,Ut=new V,Dt=new Re,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Pt=!1;function Ct(){return A===null?H:1}let G=i;function te(T,$){return e.getContext(T,$)}try{const T={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Vc}`),e.addEventListener("webglcontextlost",ot,!1),e.addEventListener("webglcontextrestored",bt,!1),e.addEventListener("webglcontextcreationerror",wt,!1),G===null){const $="webgl2";if(G=te($,T),G===null)throw te($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ft,Nt,Lt,Rt,It,D,b,W,lt,ht,rt,zt,Q,xt,Wt,nt,At,O,at,ut,Ot,Ht,$t,z;function St(){Ft=new l_(G),Ft.init(),Ht=new Zy(G,Ft),Nt=new i_(G,Ft,t,Ht),Lt=new Wy(G,Ft),Nt.reverseDepthBuffer&&d&&Lt.buffers.depth.setReversed(!0),Rt=new u_(G),It=new Py,D=new Yy(G,Ft,Lt,It,Nt,Ht,Rt),b=new a_(y),W=new c_(y),lt=new _g(G),$t=new e_(G,lt),ht=new h_(G,lt,Rt,$t),rt=new p_(G,ht,lt,Rt),at=new f_(G,Nt,D),nt=new s_(It),zt=new Cy(y,b,W,Ft,Nt,$t,nt),Q=new nM(y,It),xt=new Dy,Wt=new zy(Ft),O=new t_(y,b,W,Lt,rt,u,c),At=new Vy(y,rt,Nt),z=new iM(G,Rt,Nt,Lt),ut=new n_(G,Ft,Rt),Ot=new d_(G,Ft,Rt),Rt.programs=zt.programs,y.capabilities=Nt,y.extensions=Ft,y.properties=It,y.renderLists=xt,y.shadowMap=At,y.state=Lt,y.info=Rt}St();const K=new tM(y,G);this.xr=K,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const T=Ft.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ft.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(T){T!==void 0&&(H=T,this.setSize(C,X,!1))},this.getSize=function(T){return T.set(C,X)},this.setSize=function(T,$,I=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}C=T,X=$,e.width=Math.floor(T*H),e.height=Math.floor($*H),I===!0&&(e.style.width=T+"px",e.style.height=$+"px"),this.setViewport(0,0,T,$)},this.getDrawingBufferSize=function(T){return T.set(C*H,X*H).floor()},this.setDrawingBufferSize=function(T,$,I){C=T,X=$,H=I,e.width=Math.floor(T*I),e.height=Math.floor($*I),this.setViewport(0,0,T,$)},this.getCurrentViewport=function(T){return T.copy(R)},this.getViewport=function(T){return T.copy(st)},this.setViewport=function(T,$,I,N){T.isVector4?st.set(T.x,T.y,T.z,T.w):st.set(T,$,I,N),Lt.viewport(R.copy(st).multiplyScalar(H).round())},this.getScissor=function(T){return T.copy(ft)},this.setScissor=function(T,$,I,N){T.isVector4?ft.set(T.x,T.y,T.z,T.w):ft.set(T,$,I,N),Lt.scissor(U.copy(ft).multiplyScalar(H).round())},this.getScissorTest=function(){return _t},this.setScissorTest=function(T){Lt.setScissorTest(_t=T)},this.setOpaqueSort=function(T){q=T},this.setTransparentSort=function(T){j=T},this.getClearColor=function(T){return T.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(T=!0,$=!0,I=!0){let N=0;if(T){let k=!1;if(A!==null){const it=A.texture.format;k=it===jc||it===qc||it===Zc}if(k){const it=A.texture.type,dt=it===qn||it===Li||it===$s||it===ms||it===$c||it===Yc,pt=O.getClearColor(),Tt=O.getClearAlpha(),et=pt.r,ct=pt.g,vt=pt.b;dt?(p[0]=et,p[1]=ct,p[2]=vt,p[3]=Tt,G.clearBufferuiv(G.COLOR,0,p)):(v[0]=et,v[1]=ct,v[2]=vt,v[3]=Tt,G.clearBufferiv(G.COLOR,0,v))}else N|=G.COLOR_BUFFER_BIT}$&&(N|=G.DEPTH_BUFFER_BIT),I&&(N|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ot,!1),e.removeEventListener("webglcontextrestored",bt,!1),e.removeEventListener("webglcontextcreationerror",wt,!1),xt.dispose(),Wt.dispose(),It.dispose(),b.dispose(),W.dispose(),rt.dispose(),$t.dispose(),z.dispose(),zt.dispose(),K.dispose(),K.removeEventListener("sessionstart",Ge),K.removeEventListener("sessionend",Fe),Z.stop()};function ot(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function bt(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const T=Rt.autoReset,$=At.enabled,I=At.autoUpdate,N=At.needsUpdate,k=At.type;St(),Rt.autoReset=T,At.enabled=$,At.autoUpdate=I,At.needsUpdate=N,At.type=k}function wt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Xt(T){const $=T.target;$.removeEventListener("dispose",Xt),Kt($)}function Kt(T){ce(T),It.remove(T)}function ce(T){const $=It.get(T).programs;$!==void 0&&($.forEach(function(I){zt.releaseProgram(I)}),T.isShaderMaterial&&zt.releaseShaderCache(T))}this.renderBufferDirect=function(T,$,I,N,k,it){$===null&&($=Mt);const dt=k.isMesh&&k.matrixWorld.determinant()<0,pt=de(T,$,I,N,k);Lt.setMaterial(N,dt);let Tt=I.index,et=1;if(N.wireframe===!0){if(Tt=ht.getWireframeAttribute(I),Tt===void 0)return;et=2}const ct=I.drawRange,vt=I.attributes.position;let Gt=ct.start*et,Jt=(ct.start+ct.count)*et;it!==null&&(Gt=Math.max(Gt,it.start*et),Jt=Math.min(Jt,(it.start+it.count)*et)),Tt!==null?(Gt=Math.max(Gt,0),Jt=Math.min(Jt,Tt.count)):vt!=null&&(Gt=Math.max(Gt,0),Jt=Math.min(Jt,vt.count));const oe=Jt-Gt;if(oe<0||oe===1/0)return;$t.setup(k,N,pt,I,Tt);let be,Qt=ut;if(Tt!==null&&(be=lt.get(Tt),Qt=Ot,Qt.setIndex(be)),k.isMesh)N.wireframe===!0?(Lt.setLineWidth(N.wireframeLinewidth*Ct()),Qt.setMode(G.LINES)):Qt.setMode(G.TRIANGLES);else if(k.isLine){let Vt=N.linewidth;Vt===void 0&&(Vt=1),Lt.setLineWidth(Vt*Ct()),k.isLineSegments?Qt.setMode(G.LINES):k.isLineLoop?Qt.setMode(G.LINE_LOOP):Qt.setMode(G.LINE_STRIP)}else k.isPoints?Qt.setMode(G.POINTS):k.isSprite&&Qt.setMode(G.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Qt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Ft.get("WEBGL_multi_draw"))Qt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Vt=k._multiDrawStarts,Ce=k._multiDrawCounts,ae=k._multiDrawCount,Ee=Tt?lt.get(Tt).bytesPerElement:1,vn=It.get(N).currentProgram.getUniforms();for(let Ve=0;Ve<ae;Ve++)vn.setValue(G,"_gl_DrawID",Ve),Qt.render(Vt[Ve]/Ee,Ce[Ve])}else if(k.isInstancedMesh)Qt.renderInstances(Gt,oe,k.count);else if(I.isInstancedBufferGeometry){const Vt=I._maxInstanceCount!==void 0?I._maxInstanceCount:1/0,Ce=Math.min(I.instanceCount,Vt);Qt.renderInstances(Gt,oe,Ce)}else Qt.render(Gt,oe)};function jt(T,$,I){T.transparent===!0&&T.side===Te&&T.forceSinglePass===!1?(T.side=nn,T.needsUpdate=!0,ue(T,$,I),T.side=oi,T.needsUpdate=!0,ue(T,$,I),T.side=Te):ue(T,$,I)}this.compile=function(T,$,I=null){I===null&&(I=T),m=Wt.get(I),m.init($),_.push(m),I.traverseVisible(function(k){k.isLight&&k.layers.test($.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),T!==I&&T.traverseVisible(function(k){k.isLight&&k.layers.test($.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),m.setupLights();const N=new Set;return T.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const it=k.material;if(it)if(Array.isArray(it))for(let dt=0;dt<it.length;dt++){const pt=it[dt];jt(pt,I,k),N.add(pt)}else jt(it,I,k),N.add(it)}),_.pop(),m=null,N},this.compileAsync=function(T,$,I=null){const N=this.compile(T,$,I);return new Promise(k=>{function it(){if(N.forEach(function(dt){It.get(dt).currentProgram.isReady()&&N.delete(dt)}),N.size===0){k(T);return}setTimeout(it,10)}Ft.get("KHR_parallel_shader_compile")!==null?it():setTimeout(it,10)})};let ie=null;function _e(T){ie&&ie(T)}function Ge(){Z.stop()}function Fe(){Z.start()}const Z=new hu;Z.setAnimationLoop(_e),typeof self<"u"&&Z.setContext(self),this.setAnimationLoop=function(T){ie=T,K.setAnimationLoop(T),T===null?Z.stop():Z.start()},K.addEventListener("sessionstart",Ge),K.addEventListener("sessionend",Fe),this.render=function(T,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera($),$=K.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,$,A),m=Wt.get(T,_.length),m.init($),_.push(m),gt.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),Y.setFromProjectionMatrix(gt),mt=this.localClippingEnabled,tt=nt.init(this.clippingPlanes,mt),g=xt.get(T,x.length),g.init(),x.push(g),K.enabled===!0&&K.isPresenting===!0){const it=y.xr.getDepthSensingMesh();it!==null&&yt(it,$,-1/0,y.sortObjects)}yt(T,$,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(q,j),Pt=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,Pt&&O.addToRenderList(g,T),this.info.render.frame++,tt===!0&&nt.beginShadows();const I=m.state.shadowsArray;At.render(I,T,$),tt===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const N=g.opaque,k=g.transmissive;if(m.setupLights(),$.isArrayCamera){const it=$.cameras;if(k.length>0)for(let dt=0,pt=it.length;dt<pt;dt++){const Tt=it[dt];qt(N,k,T,Tt)}Pt&&O.render(T);for(let dt=0,pt=it.length;dt<pt;dt++){const Tt=it[dt];Et(g,T,Tt,Tt.viewport)}}else k.length>0&&qt(N,k,T,$),Pt&&O.render(T),Et(g,T,$);A!==null&&(D.updateMultisampleRenderTarget(A),D.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(y,T,$),$t.resetDefaultState(),E=-1,M=null,_.pop(),_.length>0?(m=_[_.length-1],tt===!0&&nt.setGlobalState(y.clippingPlanes,m.state.camera)):m=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function yt(T,$,I,N){if(T.visible===!1)return;if(T.layers.test($.layers)){if(T.isGroup)I=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update($);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Y.intersectsSprite(T)){N&&Dt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(gt);const dt=rt.update(T),pt=T.material;pt.visible&&g.push(T,dt,pt,I,Dt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Y.intersectsObject(T))){const dt=rt.update(T),pt=T.material;if(N&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Dt.copy(T.boundingSphere.center)):(dt.boundingSphere===null&&dt.computeBoundingSphere(),Dt.copy(dt.boundingSphere.center)),Dt.applyMatrix4(T.matrixWorld).applyMatrix4(gt)),Array.isArray(pt)){const Tt=dt.groups;for(let et=0,ct=Tt.length;et<ct;et++){const vt=Tt[et],Gt=pt[vt.materialIndex];Gt&&Gt.visible&&g.push(T,dt,Gt,I,Dt.z,vt)}}else pt.visible&&g.push(T,dt,pt,I,Dt.z,null)}}const it=T.children;for(let dt=0,pt=it.length;dt<pt;dt++)yt(it[dt],$,I,N)}function Et(T,$,I,N){const k=T.opaque,it=T.transmissive,dt=T.transparent;m.setupLightsView(I),tt===!0&&nt.setGlobalState(y.clippingPlanes,I),N&&Lt.viewport(R.copy(N)),k.length>0&&Yt(k,$,I),it.length>0&&Yt(it,$,I),dt.length>0&&Yt(dt,$,I),Lt.buffers.depth.setTest(!0),Lt.buffers.depth.setMask(!0),Lt.buffers.color.setMask(!0),Lt.setPolygonOffset(!1)}function qt(T,$,I,N){if((I.isScene===!0?I.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[N.id]===void 0&&(m.state.transmissionRenderTarget[N.id]=new Di(1,1,{generateMipmaps:!0,type:Ft.has("EXT_color_buffer_half_float")||Ft.has("EXT_color_buffer_float")?ta:qn,minFilter:Ri,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:he.workingColorSpace}));const it=m.state.transmissionRenderTarget[N.id],dt=N.viewport||R;it.setSize(dt.z,dt.w);const pt=y.getRenderTarget();y.setRenderTarget(it),y.getClearColor(B),L=y.getClearAlpha(),L<1&&y.setClearColor(16777215,.5),y.clear(),Pt&&O.render(I);const Tt=y.toneMapping;y.toneMapping=ri;const et=N.viewport;if(N.viewport!==void 0&&(N.viewport=void 0),m.setupLightsView(N),tt===!0&&nt.setGlobalState(y.clippingPlanes,N),Yt(T,I,N),D.updateMultisampleRenderTarget(it),D.updateRenderTargetMipmap(it),Ft.has("WEBGL_multisampled_render_to_texture")===!1){let ct=!1;for(let vt=0,Gt=$.length;vt<Gt;vt++){const Jt=$[vt],oe=Jt.object,be=Jt.geometry,Qt=Jt.material,Vt=Jt.group;if(Qt.side===Te&&oe.layers.test(N.layers)){const Ce=Qt.side;Qt.side=nn,Qt.needsUpdate=!0,se(oe,I,N,be,Qt,Vt),Qt.side=Ce,Qt.needsUpdate=!0,ct=!0}}ct===!0&&(D.updateMultisampleRenderTarget(it),D.updateRenderTargetMipmap(it))}y.setRenderTarget(pt),y.setClearColor(B,L),et!==void 0&&(N.viewport=et),y.toneMapping=Tt}function Yt(T,$,I){const N=$.isScene===!0?$.overrideMaterial:null;for(let k=0,it=T.length;k<it;k++){const dt=T[k],pt=dt.object,Tt=dt.geometry,et=N===null?dt.material:N,ct=dt.group;pt.layers.test(I.layers)&&se(pt,$,I,Tt,et,ct)}}function se(T,$,I,N,k,it){T.onBeforeRender(y,$,I,N,k,it),T.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),k.onBeforeRender(y,$,I,N,T,it),k.transparent===!0&&k.side===Te&&k.forceSinglePass===!1?(k.side=nn,k.needsUpdate=!0,y.renderBufferDirect(I,$,N,k,T,it),k.side=oi,k.needsUpdate=!0,y.renderBufferDirect(I,$,N,k,T,it),k.side=Te):y.renderBufferDirect(I,$,N,k,T,it),T.onAfterRender(y,$,I,N,k,it)}function ue(T,$,I){$.isScene!==!0&&($=Mt);const N=It.get(T),k=m.state.lights,it=m.state.shadowsArray,dt=k.state.version,pt=zt.getParameters(T,k.state,it,$,I),Tt=zt.getProgramCacheKey(pt);let et=N.programs;N.environment=T.isMeshStandardMaterial?$.environment:null,N.fog=$.fog,N.envMap=(T.isMeshStandardMaterial?W:b).get(T.envMap||N.environment),N.envMapRotation=N.environment!==null&&T.envMap===null?$.environmentRotation:T.envMapRotation,et===void 0&&(T.addEventListener("dispose",Xt),et=new Map,N.programs=et);let ct=et.get(Tt);if(ct!==void 0){if(N.currentProgram===ct&&N.lightsStateVersion===dt)return Ne(T,pt),ct}else pt.uniforms=zt.getUniforms(T),T.onBeforeCompile(pt,y),ct=zt.acquireProgram(pt,Tt),et.set(Tt,ct),N.uniforms=pt.uniforms;const vt=N.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(vt.clippingPlanes=nt.uniform),Ne(T,pt),N.needsLights=dn(T),N.lightsStateVersion=dt,N.needsLights&&(vt.ambientLightColor.value=k.state.ambient,vt.lightProbe.value=k.state.probe,vt.directionalLights.value=k.state.directional,vt.directionalLightShadows.value=k.state.directionalShadow,vt.spotLights.value=k.state.spot,vt.spotLightShadows.value=k.state.spotShadow,vt.rectAreaLights.value=k.state.rectArea,vt.ltc_1.value=k.state.rectAreaLTC1,vt.ltc_2.value=k.state.rectAreaLTC2,vt.pointLights.value=k.state.point,vt.pointLightShadows.value=k.state.pointShadow,vt.hemisphereLights.value=k.state.hemi,vt.directionalShadowMap.value=k.state.directionalShadowMap,vt.directionalShadowMatrix.value=k.state.directionalShadowMatrix,vt.spotShadowMap.value=k.state.spotShadowMap,vt.spotLightMatrix.value=k.state.spotLightMatrix,vt.spotLightMap.value=k.state.spotLightMap,vt.pointShadowMap.value=k.state.pointShadowMap,vt.pointShadowMatrix.value=k.state.pointShadowMatrix),N.currentProgram=ct,N.uniformsList=null,ct}function ye(T){if(T.uniformsList===null){const $=T.currentProgram.getUniforms();T.uniformsList=qa.seqWithValue($.seq,T.uniforms)}return T.uniformsList}function Ne(T,$){const I=It.get(T);I.outputColorSpace=$.outputColorSpace,I.batching=$.batching,I.batchingColor=$.batchingColor,I.instancing=$.instancing,I.instancingColor=$.instancingColor,I.instancingMorph=$.instancingMorph,I.skinning=$.skinning,I.morphTargets=$.morphTargets,I.morphNormals=$.morphNormals,I.morphColors=$.morphColors,I.morphTargetsCount=$.morphTargetsCount,I.numClippingPlanes=$.numClippingPlanes,I.numIntersection=$.numClipIntersection,I.vertexAlphas=$.vertexAlphas,I.vertexTangents=$.vertexTangents,I.toneMapping=$.toneMapping}function de(T,$,I,N,k){$.isScene!==!0&&($=Mt),D.resetTextureUnits();const it=$.fog,dt=N.isMeshStandardMaterial?$.environment:null,pt=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:vs,Tt=(N.isMeshStandardMaterial?W:b).get(N.envMap||dt),et=N.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,ct=!!I.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),vt=!!I.morphAttributes.position,Gt=!!I.morphAttributes.normal,Jt=!!I.morphAttributes.color;let oe=ri;N.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(oe=y.toneMapping);const be=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,Qt=be!==void 0?be.length:0,Vt=It.get(N),Ce=m.state.lights;if(tt===!0&&(mt===!0||T!==M)){const Ye=T===M&&N.id===E;nt.setState(N,T,Ye)}let ae=!1;N.version===Vt.__version?(Vt.needsLights&&Vt.lightsStateVersion!==Ce.state.version||Vt.outputColorSpace!==pt||k.isBatchedMesh&&Vt.batching===!1||!k.isBatchedMesh&&Vt.batching===!0||k.isBatchedMesh&&Vt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Vt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Vt.instancing===!1||!k.isInstancedMesh&&Vt.instancing===!0||k.isSkinnedMesh&&Vt.skinning===!1||!k.isSkinnedMesh&&Vt.skinning===!0||k.isInstancedMesh&&Vt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Vt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Vt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Vt.instancingMorph===!1&&k.morphTexture!==null||Vt.envMap!==Tt||N.fog===!0&&Vt.fog!==it||Vt.numClippingPlanes!==void 0&&(Vt.numClippingPlanes!==nt.numPlanes||Vt.numIntersection!==nt.numIntersection)||Vt.vertexAlphas!==et||Vt.vertexTangents!==ct||Vt.morphTargets!==vt||Vt.morphNormals!==Gt||Vt.morphColors!==Jt||Vt.toneMapping!==oe||Vt.morphTargetsCount!==Qt)&&(ae=!0):(ae=!0,Vt.__version=N.version);let Ee=Vt.currentProgram;ae===!0&&(Ee=ue(N,$,k));let vn=!1,Ve=!1,li=!1;const ve=Ee.getUniforms(),un=Vt.uniforms;if(Lt.useProgram(Ee.program)&&(vn=!0,Ve=!0,li=!0),N.id!==E&&(E=N.id,Ve=!0),vn||M!==T){Lt.buffers.depth.getReversed()?(J.copy(T.projectionMatrix),Z0(J),q0(J),ve.setValue(G,"projectionMatrix",J)):ve.setValue(G,"projectionMatrix",T.projectionMatrix),ve.setValue(G,"viewMatrix",T.matrixWorldInverse);const Rn=ve.map.cameraPosition;Rn!==void 0&&Rn.setValue(G,Ut.setFromMatrixPosition(T.matrixWorld)),Nt.logarithmicDepthBuffer&&ve.setValue(G,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&ve.setValue(G,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,Ve=!0,li=!0)}if(k.isSkinnedMesh){ve.setOptional(G,k,"bindMatrix"),ve.setOptional(G,k,"bindMatrixInverse");const Ye=k.skeleton;Ye&&(Ye.boneTexture===null&&Ye.computeBoneTexture(),ve.setValue(G,"boneTexture",Ye.boneTexture,D))}k.isBatchedMesh&&(ve.setOptional(G,k,"batchingTexture"),ve.setValue(G,"batchingTexture",k._matricesTexture,D),ve.setOptional(G,k,"batchingIdTexture"),ve.setValue(G,"batchingIdTexture",k._indirectTexture,D),ve.setOptional(G,k,"batchingColorTexture"),k._colorsTexture!==null&&ve.setValue(G,"batchingColorTexture",k._colorsTexture,D));const jn=I.morphAttributes;if((jn.position!==void 0||jn.normal!==void 0||jn.color!==void 0)&&at.update(k,I,Ee),(Ve||Vt.receiveShadow!==k.receiveShadow)&&(Vt.receiveShadow=k.receiveShadow,ve.setValue(G,"receiveShadow",k.receiveShadow)),N.isMeshGouraudMaterial&&N.envMap!==null&&(un.envMap.value=Tt,un.flipEnvMap.value=Tt.isCubeTexture&&Tt.isRenderTargetTexture===!1?-1:1),N.isMeshStandardMaterial&&N.envMap===null&&$.environment!==null&&(un.envMapIntensity.value=$.environmentIntensity),Ve&&(ve.setValue(G,"toneMappingExposure",y.toneMappingExposure),Vt.needsLights&&an(un,li),it&&N.fog===!0&&Q.refreshFogUniforms(un,it),Q.refreshMaterialUniforms(un,N,H,X,m.state.transmissionRenderTarget[T.id]),qa.upload(G,ye(Vt),un,D)),N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&(qa.upload(G,ye(Vt),un,D),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&ve.setValue(G,"center",k.center),ve.setValue(G,"modelViewMatrix",k.modelViewMatrix),ve.setValue(G,"normalMatrix",k.normalMatrix),ve.setValue(G,"modelMatrix",k.matrixWorld),N.isShaderMaterial||N.isRawShaderMaterial){const Ye=N.uniformsGroups;for(let Rn=0,Cn=Ye.length;Rn<Cn;Rn++){const Ms=Ye[Rn];z.update(Ms,Ee),z.bind(Ms,Ee)}}return Ee}function an(T,$){T.ambientLightColor.needsUpdate=$,T.lightProbe.needsUpdate=$,T.directionalLights.needsUpdate=$,T.directionalLightShadows.needsUpdate=$,T.pointLights.needsUpdate=$,T.pointLightShadows.needsUpdate=$,T.spotLights.needsUpdate=$,T.spotLightShadows.needsUpdate=$,T.rectAreaLights.needsUpdate=$,T.hemisphereLights.needsUpdate=$}function dn(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,$,I){It.get(T.texture).__webglTexture=$,It.get(T.depthTexture).__webglTexture=I;const N=It.get(T);N.__hasExternalTextures=!0,N.__autoAllocateDepthBuffer=I===void 0,N.__autoAllocateDepthBuffer||Ft.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),N.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,$){const I=It.get(T);I.__webglFramebuffer=$,I.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(T,$=0,I=0){A=T,S=$,w=I;let N=!0,k=null,it=!1,dt=!1;if(T){const Tt=It.get(T);if(Tt.__useDefaultFramebuffer!==void 0)Lt.bindFramebuffer(G.FRAMEBUFFER,null),N=!1;else if(Tt.__webglFramebuffer===void 0)D.setupRenderTarget(T);else if(Tt.__hasExternalTextures)D.rebindTextures(T,It.get(T.texture).__webglTexture,It.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const vt=T.depthTexture;if(Tt.__boundDepthTexture!==vt){if(vt!==null&&It.has(vt)&&(T.width!==vt.image.width||T.height!==vt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(T)}}const et=T.texture;(et.isData3DTexture||et.isDataArrayTexture||et.isCompressedArrayTexture)&&(dt=!0);const ct=It.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(ct[$])?k=ct[$][I]:k=ct[$],it=!0):T.samples>0&&D.useMultisampledRTT(T)===!1?k=It.get(T).__webglMultisampledFramebuffer:Array.isArray(ct)?k=ct[I]:k=ct,R.copy(T.viewport),U.copy(T.scissor),F=T.scissorTest}else R.copy(st).multiplyScalar(H).floor(),U.copy(ft).multiplyScalar(H).floor(),F=_t;if(Lt.bindFramebuffer(G.FRAMEBUFFER,k)&&N&&Lt.drawBuffers(T,k),Lt.viewport(R),Lt.scissor(U),Lt.setScissorTest(F),it){const Tt=It.get(T.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+$,Tt.__webglTexture,I)}else if(dt){const Tt=It.get(T.texture),et=$||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Tt.__webglTexture,I||0,et)}E=-1},this.readRenderTargetPixels=function(T,$,I,N,k,it,dt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let pt=It.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&dt!==void 0&&(pt=pt[dt]),pt){Lt.bindFramebuffer(G.FRAMEBUFFER,pt);try{const Tt=T.texture,et=Tt.format,ct=Tt.type;if(!Nt.textureFormatReadable(et)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Nt.textureTypeReadable(ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=T.width-N&&I>=0&&I<=T.height-k&&G.readPixels($,I,N,k,Ht.convert(et),Ht.convert(ct),it)}finally{const Tt=A!==null?It.get(A).__webglFramebuffer:null;Lt.bindFramebuffer(G.FRAMEBUFFER,Tt)}}},this.readRenderTargetPixelsAsync=async function(T,$,I,N,k,it,dt){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pt=It.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&dt!==void 0&&(pt=pt[dt]),pt){const Tt=T.texture,et=Tt.format,ct=Tt.type;if(!Nt.textureFormatReadable(et))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Nt.textureTypeReadable(ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if($>=0&&$<=T.width-N&&I>=0&&I<=T.height-k){Lt.bindFramebuffer(G.FRAMEBUFFER,pt);const vt=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,vt),G.bufferData(G.PIXEL_PACK_BUFFER,it.byteLength,G.STREAM_READ),G.readPixels($,I,N,k,Ht.convert(et),Ht.convert(ct),0);const Gt=A!==null?It.get(A).__webglFramebuffer:null;Lt.bindFramebuffer(G.FRAMEBUFFER,Gt);const Jt=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await Y0(G,Jt,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,vt),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,it),G.deleteBuffer(vt),G.deleteSync(Jt),it}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,$=null,I=0){T.isTexture!==!0&&(Us("WebGLRenderer: copyFramebufferToTexture function signature has changed."),$=arguments[0]||null,T=arguments[1]);const N=Math.pow(2,-I),k=Math.floor(T.image.width*N),it=Math.floor(T.image.height*N),dt=$!==null?$.x:0,pt=$!==null?$.y:0;D.setTexture2D(T,0),G.copyTexSubImage2D(G.TEXTURE_2D,I,0,0,dt,pt,k,it),Lt.unbindTexture()},this.copyTextureToTexture=function(T,$,I=null,N=null,k=0){T.isTexture!==!0&&(Us("WebGLRenderer: copyTextureToTexture function signature has changed."),N=arguments[0]||null,T=arguments[1],$=arguments[2],k=arguments[3]||0,I=null);let it,dt,pt,Tt,et,ct,vt,Gt,Jt;const oe=T.isCompressedTexture?T.mipmaps[k]:T.image;I!==null?(it=I.max.x-I.min.x,dt=I.max.y-I.min.y,pt=I.isBox3?I.max.z-I.min.z:1,Tt=I.min.x,et=I.min.y,ct=I.isBox3?I.min.z:0):(it=oe.width,dt=oe.height,pt=oe.depth||1,Tt=0,et=0,ct=0),N!==null?(vt=N.x,Gt=N.y,Jt=N.z):(vt=0,Gt=0,Jt=0);const be=Ht.convert($.format),Qt=Ht.convert($.type);let Vt;$.isData3DTexture?(D.setTexture3D($,0),Vt=G.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(D.setTexture2DArray($,0),Vt=G.TEXTURE_2D_ARRAY):(D.setTexture2D($,0),Vt=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,$.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,$.unpackAlignment);const Ce=G.getParameter(G.UNPACK_ROW_LENGTH),ae=G.getParameter(G.UNPACK_IMAGE_HEIGHT),Ee=G.getParameter(G.UNPACK_SKIP_PIXELS),vn=G.getParameter(G.UNPACK_SKIP_ROWS),Ve=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,oe.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,oe.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Tt),G.pixelStorei(G.UNPACK_SKIP_ROWS,et),G.pixelStorei(G.UNPACK_SKIP_IMAGES,ct);const li=T.isDataArrayTexture||T.isData3DTexture,ve=$.isDataArrayTexture||$.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const un=It.get(T),jn=It.get($),Ye=It.get(un.__renderTarget),Rn=It.get(jn.__renderTarget);Lt.bindFramebuffer(G.READ_FRAMEBUFFER,Ye.__webglFramebuffer),Lt.bindFramebuffer(G.DRAW_FRAMEBUFFER,Rn.__webglFramebuffer);for(let Cn=0;Cn<pt;Cn++)li&&G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,It.get(T).__webglTexture,k,ct+Cn),T.isDepthTexture?(ve&&G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,It.get($).__webglTexture,k,Jt+Cn),G.blitFramebuffer(Tt,et,it,dt,vt,Gt,it,dt,G.DEPTH_BUFFER_BIT,G.NEAREST)):ve?G.copyTexSubImage3D(Vt,k,vt,Gt,Jt+Cn,Tt,et,it,dt):G.copyTexSubImage2D(Vt,k,vt,Gt,Jt+Cn,Tt,et,it,dt);Lt.bindFramebuffer(G.READ_FRAMEBUFFER,null),Lt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else ve?T.isDataTexture||T.isData3DTexture?G.texSubImage3D(Vt,k,vt,Gt,Jt,it,dt,pt,be,Qt,oe.data):$.isCompressedArrayTexture?G.compressedTexSubImage3D(Vt,k,vt,Gt,Jt,it,dt,pt,be,oe.data):G.texSubImage3D(Vt,k,vt,Gt,Jt,it,dt,pt,be,Qt,oe):T.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,k,vt,Gt,it,dt,be,Qt,oe.data):T.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,k,vt,Gt,oe.width,oe.height,be,oe.data):G.texSubImage2D(G.TEXTURE_2D,k,vt,Gt,it,dt,be,Qt,oe);G.pixelStorei(G.UNPACK_ROW_LENGTH,Ce),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ae),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Ee),G.pixelStorei(G.UNPACK_SKIP_ROWS,vn),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Ve),k===0&&$.generateMipmaps&&G.generateMipmap(Vt),Lt.unbindTexture()},this.copyTextureToTexture3D=function(T,$,I=null,N=null,k=0){return T.isTexture!==!0&&(Us("WebGLRenderer: copyTextureToTexture3D function signature has changed."),I=arguments[0]||null,N=arguments[1]||null,T=arguments[2],$=arguments[3],k=arguments[4]||0),Us('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,$,I,N,k)},this.initRenderTarget=function(T){It.get(T).__webglFramebuffer===void 0&&D.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?D.setTextureCube(T,0):T.isData3DTexture?D.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?D.setTexture2DArray(T,0):D.setTexture2D(T,0),Lt.unbindTexture()},this.resetState=function(){S=0,w=0,A=null,Lt.reset(),$t.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=he._getDrawingBufferColorSpace(t),e.unpackColorSpace=he._getUnpackColorSpace()}}class aM extends Pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class rM{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=wc,this.updateRanges=[],this.version=0,this.uuid=Un()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ze=new V;class hr{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Ze.fromBufferAttribute(this,e),Ze.applyMatrix4(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ze.fromBufferAttribute(this,e),Ze.applyNormalMatrix(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ze.fromBufferAttribute(this,e),Ze.transformDirection(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=En(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=me(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=En(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=En(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=En(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=En(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),i=me(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),i=me(i,this.array),s=me(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),i=me(i,this.array),s=me(s,this.array),a=me(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new Qe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new hr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Tc extends ki{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Zt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ts;const Ls=new V,es=new V,ns=new V,is=new Bt,Ds=new Bt,xu=new Me,Pa=new V,Is=new V,La=new V,Kh=new Bt,po=new Bt,Jh=new Bt;class Qh extends Pe{constructor(t=new Tc){if(super(),this.isSprite=!0,this.type="Sprite",ts===void 0){ts=new Ue;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new rM(e,5);ts.setIndex([0,1,2,0,2,3]),ts.setAttribute("position",new hr(i,3,0,!1)),ts.setAttribute("uv",new hr(i,2,3,!1))}this.geometry=ts,this.material=t,this.center=new Bt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),es.setFromMatrixScale(this.matrixWorld),xu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ns.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&es.multiplyScalar(-ns.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const r=this.center;Da(Pa.set(-.5,-.5,0),ns,r,es,s,a),Da(Is.set(.5,-.5,0),ns,r,es,s,a),Da(La.set(.5,.5,0),ns,r,es,s,a),Kh.set(0,0),po.set(1,0),Jh.set(1,1);let o=t.ray.intersectTriangle(Pa,Is,La,!1,Ls);if(o===null&&(Da(Is.set(-.5,.5,0),ns,r,es,s,a),po.set(0,1),o=t.ray.intersectTriangle(Pa,La,Is,!1,Ls),o===null))return;const c=t.ray.origin.distanceTo(Ls);c<t.near||c>t.far||e.push({distance:c,point:Ls.clone(),uv:hn.getInterpolation(Ls,Pa,Is,La,Kh,po,Jh,new Bt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Da(n,t,e,i,s,a){is.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(Ds.x=a*is.x-s*is.y,Ds.y=s*is.x+a*is.y):Ds.copy(is),n.copy(t),n.x+=Ds.x,n.y+=Ds.y,n.applyMatrix4(xu)}class nl extends ki{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const dr=new V,ur=new V,td=new Me,ks=new Jc,Ia=new xr,mo=new V,ed=new V;class oM extends Pe{constructor(t=new Ue,e=new nl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)dr.fromBufferAttribute(e,s-1),ur.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=dr.distanceTo(ur);t.setAttribute("lineDistance",new pe(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ia.copy(i.boundingSphere),Ia.applyMatrix4(s),Ia.radius+=a,t.ray.intersectsSphere(Ia)===!1)return;td.copy(s).invert(),ks.copy(t.ray).applyMatrix4(td);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,r.start),p=Math.min(h.count,r.start+r.count);for(let v=u,g=p-1;v<g;v+=l){const m=h.getX(v),x=h.getX(v+1),_=ka(this,t,ks,c,m,x);_&&e.push(_)}if(this.isLineLoop){const v=h.getX(p-1),g=h.getX(u),m=ka(this,t,ks,c,v,g);m&&e.push(m)}}else{const u=Math.max(0,r.start),p=Math.min(d.count,r.start+r.count);for(let v=u,g=p-1;v<g;v+=l){const m=ka(this,t,ks,c,v,v+1);m&&e.push(m)}if(this.isLineLoop){const v=ka(this,t,ks,c,p-1,u);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function ka(n,t,e,i,s,a){const r=n.geometry.attributes.position;if(dr.fromBufferAttribute(r,s),ur.fromBufferAttribute(r,a),e.distanceSqToSegment(dr,ur,mo,ed)>i)return;mo.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(mo);if(!(c<t.near||c>t.far))return{distance:c,point:ed.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const nd=new V,id=new V;class vu extends oM{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)nd.fromBufferAttribute(e,s),id.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+nd.distanceTo(id);t.setAttribute("lineDistance",new pe(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Rc extends Je{constructor(t,e,i,s,a,r,o,c,l){super(t,e,i,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Nn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),a=0;e.push(0);for(let r=1;r<=t;r++)i=this.getPoint(r/t),a+=i.distanceTo(s),e.push(a),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const a=i.length;let r;e?r=e:r=t*i[a-1];let o=0,c=a-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=i[s]-r,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===r)return s/(a-1);const h=i[s],d=i[s+1]-h,u=(r-h)/d;return(s+u)/(a-1)}getTangent(t,e){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),c=e||(r.isVector2?new Bt:new V);return c.copy(o).sub(r).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new V,s=[],a=[],r=[],o=new V,c=new Me;for(let u=0;u<=t;u++){const p=u/t;s[u]=this.getTangentAt(p,new V)}a[0]=new V,r[0]=new V;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),f<=l&&(l=f,i.set(0,1,0)),d<=l&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let u=1;u<=t;u++){if(a[u]=a[u-1].clone(),r[u]=r[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Xe(s[u-1].dot(s[u]),-1,1));a[u].applyMatrix4(c.makeRotationAxis(o,p))}r[u].crossVectors(s[u],a[u])}if(e===!0){let u=Math.acos(Xe(a[0].dot(a[t]),-1,1));u/=t,s[0].dot(o.crossVectors(a[0],a[t]))>0&&(u=-u);for(let p=1;p<=t;p++)a[p].applyMatrix4(c.makeRotationAxis(s[p],u*p)),r[p].crossVectors(s[p],a[p])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class il extends Nn{constructor(t=0,e=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new Bt){const i=e,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+t*a;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=c-this.aX,u=l-this.aY;c=d*h-u*f+this.aX,l=d*f+u*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class cM extends il{constructor(t,e,i,s,a,r){super(t,e,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function sl(){let n=0,t=0,e=0,i=0;function s(a,r,o,c){n=a,t=o,e=-3*a+3*r-2*o-c,i=2*a-2*r+o+c}return{initCatmullRom:function(a,r,o,c,l){s(r,o,l*(o-a),l*(c-r))},initNonuniformCatmullRom:function(a,r,o,c,l,h,f){let d=(r-a)/l-(o-a)/(l+h)+(o-r)/h,u=(o-r)/h-(c-r)/(h+f)+(c-o)/f;d*=h,u*=h,s(r,o,d,u)},calc:function(a){const r=a*a,o=r*a;return n+t*a+e*r+i*o}}}const Ua=new V,go=new sl,xo=new sl,vo=new sl;class lM extends Nn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new V){const i=e,s=this.points,a=s.length,r=(a-(this.closed?0:1))*t;let o=Math.floor(r),c=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:c===0&&o===a-1&&(o=a-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%a]:(Ua.subVectors(s[0],s[1]).add(s[0]),l=Ua);const f=s[o%a],d=s[(o+1)%a];if(this.closed||o+2<a?h=s[(o+2)%a]:(Ua.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=Ua),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let p=Math.pow(l.distanceToSquared(f),u),v=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),go.initNonuniformCatmullRom(l.x,f.x,d.x,h.x,p,v,g),xo.initNonuniformCatmullRom(l.y,f.y,d.y,h.y,p,v,g),vo.initNonuniformCatmullRom(l.z,f.z,d.z,h.z,p,v,g)}else this.curveType==="catmullrom"&&(go.initCatmullRom(l.x,f.x,d.x,h.x,this.tension),xo.initCatmullRom(l.y,f.y,d.y,h.y,this.tension),vo.initCatmullRom(l.z,f.z,d.z,h.z,this.tension));return i.set(go.calc(c),xo.calc(c),vo.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new V().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function sd(n,t,e,i,s){const a=(i-t)*.5,r=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+a+r)*c+(-3*e+3*i-2*a-r)*o+a*n+e}function hM(n,t){const e=1-n;return e*e*t}function dM(n,t){return 2*(1-n)*n*t}function uM(n,t){return n*n*t}function Os(n,t,e,i){return hM(n,t)+dM(n,e)+uM(n,i)}function fM(n,t){const e=1-n;return e*e*e*t}function pM(n,t){const e=1-n;return 3*e*e*n*t}function mM(n,t){return 3*(1-n)*n*n*t}function gM(n,t){return n*n*n*t}function Bs(n,t,e,i,s){return fM(n,t)+pM(n,e)+mM(n,i)+gM(n,s)}class _u extends Nn{constructor(t=new Bt,e=new Bt,i=new Bt,s=new Bt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Bt){const i=e,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(Bs(t,s.x,a.x,r.x,o.x),Bs(t,s.y,a.y,r.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class xM extends Nn{constructor(t=new V,e=new V,i=new V,s=new V){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new V){const i=e,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(Bs(t,s.x,a.x,r.x,o.x),Bs(t,s.y,a.y,r.y,o.y),Bs(t,s.z,a.z,r.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class yu extends Nn{constructor(t=new Bt,e=new Bt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Bt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Bt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class vM extends Nn{constructor(t=new V,e=new V){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new V){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new V){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Mu extends Nn{constructor(t=new Bt,e=new Bt,i=new Bt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Bt){const i=e,s=this.v0,a=this.v1,r=this.v2;return i.set(Os(t,s.x,a.x,r.x),Os(t,s.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class _M extends Nn{constructor(t=new V,e=new V,i=new V){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new V){const i=e,s=this.v0,a=this.v1,r=this.v2;return i.set(Os(t,s.x,a.x,r.x),Os(t,s.y,a.y,r.y),Os(t,s.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Su extends Nn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Bt){const i=e,s=this.points,a=(s.length-1)*t,r=Math.floor(a),o=a-r,c=s[r===0?r:r-1],l=s[r],h=s[r>s.length-2?s.length-1:r+1],f=s[r>s.length-3?s.length-1:r+2];return i.set(sd(o,c.x,l.x,h.x,f.x),sd(o,c.y,l.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Bt().fromArray(s))}return this}}var ad=Object.freeze({__proto__:null,ArcCurve:cM,CatmullRomCurve3:lM,CubicBezierCurve:_u,CubicBezierCurve3:xM,EllipseCurve:il,LineCurve:yu,LineCurve3:vM,QuadraticBezierCurve:Mu,QuadraticBezierCurve3:_M,SplineCurve:Su});class yM extends Nn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ad[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,o=this.curves[a],c=o.getLength(),l=c===0?0:1-r/c;return o.getPointAt(l,e)}a++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],o=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,c=r.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new ad[s.type]().fromJSON(s))}return this}}class rd extends yM{constructor(t){super(),this.type="Path",this.currentPoint=new Bt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new yu(this.currentPoint.clone(),new Bt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const a=new Mu(this.currentPoint.clone(),new Bt(t,e),new Bt(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,a,r){const o=new _u(this.currentPoint.clone(),new Bt(t,e),new Bt(i,s),new Bt(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Su(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,a,r){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,i,s,a,r),this}absarc(t,e,i,s,a,r){return this.absellipse(t,e,i,i,s,a,r),this}ellipse(t,e,i,s,a,r,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,a,r,o,c),this}absellipse(t,e,i,s,a,r,o,c){const l=new il(t,e,i,s,a,r,o,c);if(this.curves.length>0){const f=l.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class al extends Ue{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const a=[],r=[],o=[],c=[],l=new V,h=new Bt;r.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*s;l.x=t*Math.cos(u),l.y=t*Math.sin(u),r.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(r[d]/t+1)/2,h.y=(r[d+1]/t+1)/2,c.push(h.x,h.y)}for(let f=1;f<=e;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new pe(r,3)),this.setAttribute("normal",new pe(o,3)),this.setAttribute("uv",new pe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new al(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Zs extends Ue{constructor(t=1,e=1,i=1,s=32,a=1,r=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),a=Math.floor(a);const h=[],f=[],d=[],u=[];let p=0;const v=[],g=i/2;let m=0;x(),r===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new pe(f,3)),this.setAttribute("normal",new pe(d,3)),this.setAttribute("uv",new pe(u,2));function x(){const y=new V,P=new V;let S=0;const w=(e-t)/i;for(let A=0;A<=a;A++){const E=[],M=A/a,R=M*(e-t)+t;for(let U=0;U<=s;U++){const F=U/s,B=F*c+o,L=Math.sin(B),C=Math.cos(B);P.x=R*L,P.y=-M*i+g,P.z=R*C,f.push(P.x,P.y,P.z),y.set(L,w,C).normalize(),d.push(y.x,y.y,y.z),u.push(F,1-M),E.push(p++)}v.push(E)}for(let A=0;A<s;A++)for(let E=0;E<a;E++){const M=v[E][A],R=v[E+1][A],U=v[E+1][A+1],F=v[E][A+1];(t>0||E!==0)&&(h.push(M,R,F),S+=3),(e>0||E!==a-1)&&(h.push(R,U,F),S+=3)}l.addGroup(m,S,0),m+=S}function _(y){const P=p,S=new Bt,w=new V;let A=0;const E=y===!0?t:e,M=y===!0?1:-1;for(let U=1;U<=s;U++)f.push(0,g*M,0),d.push(0,M,0),u.push(.5,.5),p++;const R=p;for(let U=0;U<=s;U++){const B=U/s*c+o,L=Math.cos(B),C=Math.sin(B);w.x=E*C,w.y=g*M,w.z=E*L,f.push(w.x,w.y,w.z),d.push(0,M,0),S.x=L*.5+.5,S.y=C*.5*M+.5,u.push(S.x,S.y),p++}for(let U=0;U<s;U++){const F=P+U,B=R+U;y===!0?h.push(B,B+1,F):h.push(B+1,B,F),A+=3}l.addGroup(m,A,y===!0?1:2),m+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class rl extends Zs{constructor(t=1,e=1,i=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,t,e,i,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(t){return new rl(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ol extends Ue{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],r=[];o(s),l(i),h(),this.setAttribute("position",new pe(a,3)),this.setAttribute("normal",new pe(a.slice(),3)),this.setAttribute("uv",new pe(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const _=new V,y=new V,P=new V;for(let S=0;S<e.length;S+=3)u(e[S+0],_),u(e[S+1],y),u(e[S+2],P),c(_,y,P,x)}function c(x,_,y,P){const S=P+1,w=[];for(let A=0;A<=S;A++){w[A]=[];const E=x.clone().lerp(y,A/S),M=_.clone().lerp(y,A/S),R=S-A;for(let U=0;U<=R;U++)U===0&&A===S?w[A][U]=E:w[A][U]=E.clone().lerp(M,U/R)}for(let A=0;A<S;A++)for(let E=0;E<2*(S-A)-1;E++){const M=Math.floor(E/2);E%2===0?(d(w[A][M+1]),d(w[A+1][M]),d(w[A][M])):(d(w[A][M+1]),d(w[A+1][M+1]),d(w[A+1][M]))}}function l(x){const _=new V;for(let y=0;y<a.length;y+=3)_.x=a[y+0],_.y=a[y+1],_.z=a[y+2],_.normalize().multiplyScalar(x),a[y+0]=_.x,a[y+1]=_.y,a[y+2]=_.z}function h(){const x=new V;for(let _=0;_<a.length;_+=3){x.x=a[_+0],x.y=a[_+1],x.z=a[_+2];const y=g(x)/2/Math.PI+.5,P=m(x)/Math.PI+.5;r.push(y,1-P)}p(),f()}function f(){for(let x=0;x<r.length;x+=6){const _=r[x+0],y=r[x+2],P=r[x+4],S=Math.max(_,y,P),w=Math.min(_,y,P);S>.9&&w<.1&&(_<.2&&(r[x+0]+=1),y<.2&&(r[x+2]+=1),P<.2&&(r[x+4]+=1))}}function d(x){a.push(x.x,x.y,x.z)}function u(x,_){const y=x*3;_.x=t[y+0],_.y=t[y+1],_.z=t[y+2]}function p(){const x=new V,_=new V,y=new V,P=new V,S=new Bt,w=new Bt,A=new Bt;for(let E=0,M=0;E<a.length;E+=9,M+=6){x.set(a[E+0],a[E+1],a[E+2]),_.set(a[E+3],a[E+4],a[E+5]),y.set(a[E+6],a[E+7],a[E+8]),S.set(r[M+0],r[M+1]),w.set(r[M+2],r[M+3]),A.set(r[M+4],r[M+5]),P.copy(x).add(_).add(y).divideScalar(3);const R=g(P);v(S,M+0,x,R),v(w,M+2,_,R),v(A,M+4,y,R)}}function v(x,_,y,P){P<0&&x.x===1&&(r[_]=x.x-1),y.x===0&&y.z===0&&(r[_]=P/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ol(t.vertices,t.indices,t.radius,t.details)}}const Fa=new V,Na=new V,_o=new V,za=new hn;class MM extends Ue{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(ls*e),r=t.getIndex(),o=t.getAttribute("position"),c=r?r.count:o.count,l=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let p=0;p<c;p+=3){r?(l[0]=r.getX(p),l[1]=r.getX(p+1),l[2]=r.getX(p+2)):(l[0]=p,l[1]=p+1,l[2]=p+2);const{a:v,b:g,c:m}=za;if(v.fromBufferAttribute(o,l[0]),g.fromBufferAttribute(o,l[1]),m.fromBufferAttribute(o,l[2]),za.getNormal(_o),f[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const _=(x+1)%3,y=f[x],P=f[_],S=za[h[x]],w=za[h[_]],A=`${y}_${P}`,E=`${P}_${y}`;E in d&&d[E]?(_o.dot(d[E].normal)<=a&&(u.push(S.x,S.y,S.z),u.push(w.x,w.y,w.z)),d[E]=null):A in d||(d[A]={index0:l[x],index1:l[_],normal:_o.clone()})}}for(const p in d)if(d[p]){const{index0:v,index1:g}=d[p];Fa.fromBufferAttribute(o,v),Na.fromBufferAttribute(o,g),u.push(Fa.x,Fa.y,Fa.z),u.push(Na.x,Na.y,Na.z)}this.setAttribute("position",new pe(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class bu extends rd{constructor(t){super(t),this.uuid=Un(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new rd().fromJSON(s))}return this}}const SM={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let a=Eu(n,0,s,e,!0);const r=[];if(!a||a.next===a.prev)return r;let o,c,l,h,f,d,u;if(i&&(a=TM(n,t,a,e)),n.length>80*e){o=l=n[0],c=h=n[1];for(let p=e;p<s;p+=e)f=n[p],d=n[p+1],f<o&&(o=f),d<c&&(c=d),f>l&&(l=f),d>h&&(h=d);u=Math.max(l-o,h-c),u=u!==0?32767/u:0}return qs(a,r,e,o,c,u,0),r}};function Eu(n,t,e,i,s){let a,r;if(s===zM(n,t,e,i)>0)for(a=t;a<e;a+=i)r=od(a,n[a],n[a+1],r);else for(a=e-i;a>=t;a-=i)r=od(a,n[a],n[a+1],r);return r&&_r(r,r.next)&&(Ks(r),r=r.next),r}function Ii(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(_r(e,e.next)||Ae(e.prev,e,e.next)===0)){if(Ks(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function qs(n,t,e,i,s,a,r){if(!n)return;!r&&a&&DM(n,i,s,a);let o=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,a?EM(n,i,s,a):bM(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Ks(n),n=l.next,o=l.next;continue}if(n=l,n===o){r?r===1?(n=wM(Ii(n),t,e),qs(n,t,e,i,s,a,2)):r===2&&AM(n,t,e,i,s,a):qs(Ii(n),t,e,i,s,a,1);break}}}function bM(n){const t=n.prev,e=n,i=n.next;if(Ae(t,e,i)>=0)return!1;const s=t.x,a=e.x,r=i.x,o=t.y,c=e.y,l=i.y,h=s<a?s<r?s:r:a<r?a:r,f=o<c?o<l?o:l:c<l?c:l,d=s>a?s>r?s:r:a>r?a:r,u=o>c?o>l?o:l:c>l?c:l;let p=i.next;for(;p!==t;){if(p.x>=h&&p.x<=d&&p.y>=f&&p.y<=u&&rs(s,o,a,c,r,l,p.x,p.y)&&Ae(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function EM(n,t,e,i){const s=n.prev,a=n,r=n.next;if(Ae(s,a,r)>=0)return!1;const o=s.x,c=a.x,l=r.x,h=s.y,f=a.y,d=r.y,u=o<c?o<l?o:l:c<l?c:l,p=h<f?h<d?h:d:f<d?f:d,v=o>c?o>l?o:l:c>l?c:l,g=h>f?h>d?h:d:f>d?f:d,m=Cc(u,p,t,e,i),x=Cc(v,g,t,e,i);let _=n.prevZ,y=n.nextZ;for(;_&&_.z>=m&&y&&y.z<=x;){if(_.x>=u&&_.x<=v&&_.y>=p&&_.y<=g&&_!==s&&_!==r&&rs(o,h,c,f,l,d,_.x,_.y)&&Ae(_.prev,_,_.next)>=0||(_=_.prevZ,y.x>=u&&y.x<=v&&y.y>=p&&y.y<=g&&y!==s&&y!==r&&rs(o,h,c,f,l,d,y.x,y.y)&&Ae(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;_&&_.z>=m;){if(_.x>=u&&_.x<=v&&_.y>=p&&_.y<=g&&_!==s&&_!==r&&rs(o,h,c,f,l,d,_.x,_.y)&&Ae(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;y&&y.z<=x;){if(y.x>=u&&y.x<=v&&y.y>=p&&y.y<=g&&y!==s&&y!==r&&rs(o,h,c,f,l,d,y.x,y.y)&&Ae(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function wM(n,t,e){let i=n;do{const s=i.prev,a=i.next.next;!_r(s,a)&&wu(s,i,i.next,a)&&js(s,a)&&js(a,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(a.i/e|0),Ks(i),Ks(i.next),i=n=a),i=i.next}while(i!==n);return Ii(i)}function AM(n,t,e,i,s,a){let r=n;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&UM(r,o)){let c=Au(r,o);r=Ii(r,r.next),c=Ii(c,c.next),qs(r,t,e,i,s,a,0),qs(c,t,e,i,s,a,0);return}o=o.next}r=r.next}while(r!==n)}function TM(n,t,e,i){const s=[];let a,r,o,c,l;for(a=0,r=t.length;a<r;a++)o=t[a]*i,c=a<r-1?t[a+1]*i:n.length,l=Eu(n,o,c,i,!1),l===l.next&&(l.steiner=!0),s.push(kM(l));for(s.sort(RM),a=0;a<s.length;a++)e=CM(s[a],e);return e}function RM(n,t){return n.x-t.x}function CM(n,t){const e=PM(n,t);if(!e)return t;const i=Au(e,n);return Ii(i,i.next),Ii(e,e.next)}function PM(n,t){let e=t,i=-1/0,s;const a=n.x,r=n.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const d=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=a&&d>i&&(i=d,s=e.x<e.next.x?e:e.next,d===a))return s}e=e.next}while(e!==t);if(!s)return null;const o=s,c=s.x,l=s.y;let h=1/0,f;e=s;do a>=e.x&&e.x>=c&&a!==e.x&&rs(r<l?a:i,r,c,l,r<l?i:a,r,e.x,e.y)&&(f=Math.abs(r-e.y)/(a-e.x),js(e,n)&&(f<h||f===h&&(e.x>s.x||e.x===s.x&&LM(s,e)))&&(s=e,h=f)),e=e.next;while(e!==o);return s}function LM(n,t){return Ae(n.prev,n,t.prev)<0&&Ae(t.next,n,n.next)<0}function DM(n,t,e,i){let s=n;do s.z===0&&(s.z=Cc(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,IM(s)}function IM(n){let t,e,i,s,a,r,o,c,l=1;do{for(e=n,n=null,a=null,r=0;e;){for(r++,i=e,o=0,t=0;t<l&&(o++,i=i.nextZ,!!i);t++);for(c=l;o>0||c>0&&i;)o!==0&&(c===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,o--):(s=i,i=i.nextZ,c--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;e=i}a.nextZ=null,l*=2}while(r>1);return n}function Cc(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function kM(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function rs(n,t,e,i,s,a,r,o){return(s-r)*(t-o)>=(n-r)*(a-o)&&(n-r)*(i-o)>=(e-r)*(t-o)&&(e-r)*(a-o)>=(s-r)*(i-o)}function UM(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!FM(n,t)&&(js(n,t)&&js(t,n)&&NM(n,t)&&(Ae(n.prev,n,t.prev)||Ae(n,t.prev,t))||_r(n,t)&&Ae(n.prev,n,n.next)>0&&Ae(t.prev,t,t.next)>0)}function Ae(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function _r(n,t){return n.x===t.x&&n.y===t.y}function wu(n,t,e,i){const s=Ba(Ae(n,t,e)),a=Ba(Ae(n,t,i)),r=Ba(Ae(e,i,n)),o=Ba(Ae(e,i,t));return!!(s!==a&&r!==o||s===0&&Oa(n,e,t)||a===0&&Oa(n,i,t)||r===0&&Oa(e,n,i)||o===0&&Oa(e,t,i))}function Oa(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Ba(n){return n>0?1:n<0?-1:0}function FM(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&wu(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function js(n,t){return Ae(n.prev,n,n.next)<0?Ae(n,t,n.next)>=0&&Ae(n,n.prev,t)>=0:Ae(n,t,n.prev)<0||Ae(n,n.next,t)<0}function NM(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,a=(n.y+t.y)/2;do e.y>a!=e.next.y>a&&e.next.y!==e.y&&s<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Au(n,t){const e=new Pc(n.i,n.x,n.y),i=new Pc(t.i,t.x,t.y),s=n.next,a=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,a.next=i,i.prev=a,i}function od(n,t,e,i){const s=new Pc(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ks(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Pc(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function zM(n,t,e,i){let s=0;for(let a=t,r=e-i;a<e;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class Hs{static area(t){const e=t.length;let i=0;for(let s=e-1,a=0;a<e;s=a++)i+=t[s].x*t[a].y-t[a].x*t[s].y;return i*.5}static isClockWise(t){return Hs.area(t)<0}static triangulateShape(t,e){const i=[],s=[],a=[];cd(t),ld(i,t);let r=t.length;e.forEach(cd);for(let c=0;c<e.length;c++)s.push(r),r+=e[c].length,ld(i,e[c]);const o=SM.triangulate(i,s);for(let c=0;c<o.length;c+=3)a.push(o.slice(c,c+3));return a}}function cd(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function ld(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class cl extends ol{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new cl(t.radius,t.detail)}}class Js extends Ue{constructor(t=.5,e=1,i=32,s=1,a=0,r=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:r},i=Math.max(3,i),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let f=t;const d=(e-t)/s,u=new V,p=new Bt;for(let v=0;v<=s;v++){for(let g=0;g<=i;g++){const m=a+g/i*r;u.x=f*Math.cos(m),u.y=f*Math.sin(m),c.push(u.x,u.y,u.z),l.push(0,0,1),p.x=(u.x/e+1)/2,p.y=(u.y/e+1)/2,h.push(p.x,p.y)}f+=d}for(let v=0;v<s;v++){const g=v*(i+1);for(let m=0;m<i;m++){const x=m+g,_=x,y=x+i+1,P=x+i+2,S=x+1;o.push(_,y,S),o.push(y,P,S)}}this.setIndex(o),this.setAttribute("position",new pe(c,3)),this.setAttribute("normal",new pe(l,3)),this.setAttribute("uv",new pe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Js(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ll extends Ue{constructor(t=new bu([new Bt(0,.5),new Bt(-.5,-.5),new Bt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],a=[],r=[];let o=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new pe(s,3)),this.setAttribute("normal",new pe(a,3)),this.setAttribute("uv",new pe(r,2));function l(h){const f=s.length/3,d=h.extractPoints(e);let u=d.shape;const p=d.holes;Hs.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,m=p.length;g<m;g++){const x=p[g];Hs.isClockWise(x)===!0&&(p[g]=x.reverse())}const v=Hs.triangulateShape(u,p);for(let g=0,m=p.length;g<m;g++){const x=p[g];u=u.concat(x)}for(let g=0,m=u.length;g<m;g++){const x=u[g];s.push(x.x,x.y,0),a.push(0,0,1),r.push(x.x,x.y)}for(let g=0,m=v.length;g<m;g++){const x=v[g],_=x[0]+f,y=x[1]+f,P=x[2]+f;i.push(_,y,P),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return OM(e,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const r=e[t.shapes[s]];i.push(r)}return new ll(i,t.curveSegments)}}function OM(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class yr extends Ue{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],c=[],l=[],h=new V,f=new V,d=new V;for(let u=0;u<=i;u++)for(let p=0;p<=s;p++){const v=p/s*a,g=u/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(v),f.y=(t+e*Math.cos(g))*Math.sin(v),f.z=e*Math.sin(g),o.push(f.x,f.y,f.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(f,h).normalize(),c.push(d.x,d.y,d.z),l.push(p/s),l.push(u/i)}for(let u=1;u<=i;u++)for(let p=1;p<=s;p++){const v=(s+1)*u+p-1,g=(s+1)*(u-1)+p-1,m=(s+1)*(u-1)+p,x=(s+1)*u+p;r.push(v,g,x),r.push(g,m,x)}this.setIndex(r),this.setAttribute("position",new pe(o,3)),this.setAttribute("normal",new pe(c,3)),this.setAttribute("uv",new pe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Qs extends ki{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Qd,this.normalScale=new Bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Xc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Tu extends Pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class BM extends Tu{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const yo=new Me,hd=new V,dd=new V;class HM{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Bt(512,512),this.map=null,this.mapPass=null,this.matrix=new Me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new tl,this._frameExtents=new Bt(1,1),this._viewportCount=1,this._viewports=[new Re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;hd.setFromMatrixPosition(t.matrixWorld),e.position.copy(hd),dd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(dd),e.updateMatrixWorld(),yo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yo),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(yo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class GM extends HM{constructor(){super(new du(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class VM extends Tu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.shadow=new GM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const ud=new Me;class XM{constructor(t,e,i=0,s=1/0){this.ray=new Jc(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Qc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return ud.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ud),this}intersectObject(t,e=!0,i=[]){return Lc(t,this,i,e),i.sort(fd),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)Lc(t[s],this,i,e);return i.sort(fd),i}}function fd(n,t){return n.distance-t.distance}function Lc(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)Lc(a[r],t,e,!0)}}class WM extends vu{constructor(t=10,e=10,i=4473924,s=8947848){i=new Zt(i),s=new Zt(s);const a=e/2,r=t/e,o=t/2,c=[],l=[];for(let d=0,u=0,p=-o;d<=e;d++,p+=r){c.push(-o,0,p,o,0,p),c.push(p,0,-o,p,0,o);const v=d===a?i:s;v.toArray(l,u),u+=3,v.toArray(l,u),u+=3,v.toArray(l,u),u+=3,v.toArray(l,u),u+=3}const h=new Ue;h.setAttribute("position",new pe(c,3)),h.setAttribute("color",new pe(l,3));const f=new nl({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Vc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Vc);const $M={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function YM(n,t,e,i){const s=new mn(n.fov,i,.1,200),a=new V,r=new V,o=new V;let c=!1,l=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function d(){const u=(n.pitchDeg+h.pitchDelta)*Math.PI/180,p=n.yawDeg*Math.PI/180;o.set(Math.sin(p)*Math.cos(u),Math.sin(u),Math.cos(p)*Math.cos(u)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return d(),{camera:s,update(u,p,v,g,m=$M){const x=p+.6;if(!c)a.set(u,x,v),c=!0;else{const P=1-Math.exp(-Math.max(n.smoothing,.001)*g);a.x+=(u-a.x)*P,a.y+=(x-a.y)*P,a.z+=(v-a.z)*P}const _=1-Math.exp(-Math.max(t.smoothing,.001)*g);h.distanceScale+=(m.distanceScale-h.distanceScale)*_,h.offsetX+=(m.offsetX-h.offsetX)*_,h.offsetZ+=(m.offsetZ-h.offsetZ)*_,h.pitchDelta+=(m.pitchDelta-h.pitchDelta)*_;const y=1-Math.exp(-Math.max(e.smoothing,.001)*g);h.zoom+=(f-h.zoom)*y,d(),(s.fov!==l||s.fov!==n.fov)&&(s.fov=n.fov,l=n.fov,s.updateProjectionMatrix()),r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},snap(u,p,v){a.set(u,p+.6,v),c=!0,r.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),d(),s.position.copy(r).add(o),s.lookAt(r),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new V().setFromMatrixColumn(s.matrixWorld,0),p=new V().setFromMatrixColumn(s.matrixWorld,2).negate(),v=Math.hypot(u.x,u.z)||1,g=Math.hypot(p.x,p.z)||1;return{rightX:u.x/v,rightZ:u.z/v,forwardX:p.x/g,forwardZ:p.z/g}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...h}}}}const Ci=Math.PI*2,gn=1e-6;function sn(n,t,e){return n<t?t:n>e?e:n}function Ru(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function ZM(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Cu(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=ZM(n);return i===1?s:e+(s-e)*i}function pd(n){return(1-Math.sin(n))/2}function hl(n,t,e){const i=Math.PI/180,s=sn(Number.isFinite(t)?t:100,0,180),a=sn(Number.isFinite(e)?e:132,0,180);if(a<=s)return n>=Math.cos(s*i)?1:0;const r=Math.cos(s*i),o=Math.cos(a*i);if(n>=r)return 1;const c=sn((r-n)/(r-o),0,1);return 1-c*c*(3-2*c)}function dl(n,t){if(!n.grounded||n.speed<gn)return Ru();const e=n.speed/Math.max(n.moveSpeed,gn),i=Math.max(n.legLength,gn),s=n.stride>gn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),r=i*Math.sin(Math.min(t.maxAmp,1.25)),o=Math.abs(n.localForward),c=Math.abs(n.localRight),l=o+c+gn,h=hl(n.localForward/Math.max(n.speed,gn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=c/l*h,d=o/l+c/l*(1-h),u=n.localForward>=0?1:-1,p=n.localRight>=0?1:-1,v=s,g=B=>Math.asin(sn(B,-r,r)/i);function m(B,L){const C=Cu(B,t.plantLock),X=pd(B),H=u*d*v*C,q=-g(H),j=L*p>0?1:-1,st=1+j*t.crossStep*.45,ft=p*j*t.crossStep*v*.4*X,_t=p*f*v*t.sideWeight*st*C+ft*f,Y=g(_t),tt=t.kneeLift*X*a*(.55+.25*d+(j>0?.2*f:0));return{pitchX:q,rollZ:Y,kneeX:tt}}const x=(n.phase%Ci+Ci)%Ci,_=m(x,-1),y=m((x+Math.PI)%Ci,1),P=Math.cos(x),S=pd(x),w=-t.comSway*a*P*(.6*d+.8*f)-p*t.comSway*a*f*.45,A=t.comBob*S*a,E=p*t.hipLean*a*f*P*.6,M=p*t.hipLean*a*f*(.45+.25*P),R=t.armSwing*a*P*(d*u+.3*f),U=R,F=-R;return{legL:_,legR:y,pelvisX:w,pelvisY:A,pelvisRoll:E,sideLean:M,armL:U,armR:F,strafe:f,backward:u<0?d:0}}function Pu(n){const t=(n%Ci+Ci)%Ci,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Lu(n,t,e){const i=sn(e.progress,0,1);if(i>=1||n.speed<gn)return Ru();const s=i*i*(3-2*i),a=1-s;return dl({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function Du(n,t,e,i){const s=sn(n,-1,1),a=Math.abs(s),r=Math.min(1,t*(1+Math.max(0,i)*a*a));return sn(r*s,-1,1)*(e*Math.PI/180)}function Iu(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const a=Math.atan2(t,n)*180/Math.PI;if(Math.abs(a)<=90)return e;const o=(a-Math.sign(a)*180)*Math.PI/180,c=sn(i,0,1),l=c*c;return e*l+o*(1-l)}function ku(n,t,e,i,s){const a=Math.max(e,gn),r=Math.max(0,i)*a,o=Math.max(0,s)*a,c=t>gn?(t-n)/t:0,l=c>.02,h=c<-.015,f=n<=r*.15,d=!h&&n<o&&(l||f);return{enter:n>gn&&n<=r&&l,resume:!d}}function Uu(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return sn(n*sn(t,0,2),-i,i)}function Fu(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),r=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*r}}function Nu(n,t,e){const i=sn(n,0,1),s=i*i*(3-2*i);return e?t==="inStop"?1-s:1:t==="afterStop"?1-s:0}function qM(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const s=sn(n,0,1),a=Math.sin(Math.PI*s),r=a*a;if(r<=1e-9)return i();const o=t>=0,c=o?1:.35,l=o?.35:1,h=Math.max(0,e.turnStepPitch)*r,f=Math.max(0,e.turnStepKnee)*r,d=Math.max(0,e.turnStepPitch)*.35*r,u=o?1:-1;return{legL:{pitchX:-h*c,rollZ:u*d*c,kneeX:f*c},legR:{pitchX:-h*l,rollZ:-u*d*l,kneeX:f*l},pelvisY:-Math.max(0,e.turnStepDip)*r,env:r}}function zu(n,t,e,i,s){const a=sn(n,0,1),r=sn(s.stopPeakRatio,.05,.95),o=a<=r?a/r:(a-r)/(1-r),c=o*o*(3-2*o),l=a<=r?c:1-c,h=Math.hypot(e,i),f=h>gn?e/h:1,d=h>gn?i/h:0,u=Cu(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*l,trailPitch:Math.max(0,s.stopTrailPitch)*l,leadKnee:Math.max(0,s.stopStepKnee)*l,bodyShift:Math.max(0,s.stopBodyShift)*l,bodyDip:Math.max(0,s.stopBodyDip)*l,chestPitch:Math.max(0,s.stopChestPitch)*l,leadLeft:u,fwdN:f,rightN:d,env:l}}function Ke(n){return n<0?0:n>1?1:n}const ja=Math.PI*2;function jM(n){return((n+Math.PI)%ja+ja)%ja-Math.PI}function KM(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function JM(n,t,e,i,s,a=n.phase){const r=Ke(i);if(r<=0)return n;const o=Ke(t),c=Math.max(1,Math.round(s.cycles)),l=Math.max(0,s.strideSpeed),h=e%2===0?1:-1,f=Ke(s.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*d,p=o<=.5?o*2:(o-.5)*2,v=p*p*(3-2*p),g=o<=.5?v:1-v,m={speed:l,phase:a+ja*c/2*g,localForward:l*f,localRight:l*(1-f)*h},x=jM(m.phase-n.phase),_=r*r*(3-2*r),y=n.speed>.05?d:0;return{speed:n.speed+(m.speed-n.speed)*r,phase:n.phase+x*_,localForward:n.localForward+(m.localForward-n.localForward)*r,localRight:n.localRight+(m.localRight-n.localRight)*r,stride:y+(u-y)*r*r}}function QM(n,t,e){const i=KM(),s=Ke(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const r=t%2===0?1:-1,o=r<0,c=r>0,l=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=o?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=o?h:h*.4,i.legR.kneeX=c?h:h*.4,i.legL.rollZ=-f*r,i.legR.rollZ=f*r,i.pelvisX=e.stepSway*a*r,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*r,i}function Ou(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function md(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*Ou(a,s)}function tS(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),r=n+(s-n)*a;return t&&r>.999?1:!t&&r<.001?0:r}function eS(n,t,e){const i=Ke(n);return{gaitScale:1-i*(1-Ke(t)),attackLegWeight:Ke(e)*i}}function nS(n,t){const e=Ke(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function iS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Ke(t.minScale+(1-t.minScale)*e)}function sS(){return Bu()}function Bu(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function aS(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function rS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Ke(t.forceHitHeight):n.type==="light"?Ke(t.hitHeight.light):n.type==="heavy"?Ke(t.hitHeight.heavy):n.type==="knock"?Ke(t.hitHeight.knock):0}function oS(n,t,e){const i=Ke(e),s=(a,r)=>a+(r-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function Hu(n,t,e){const i=Bu(),s=aS(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=Ke(1-n.timer/n.duration),r=Ou(a,e.pulseRatio);i.pulse=r,i.active=r>0,i.hitHeight=rS(n,e);const o=Math.sin(t),c=Math.cos(t),l=Math.cos(t),h=-Math.sin(t),f=n.dirX*o+n.dirZ*c,d=n.dirX*l+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*a);return i.upperPitch=s*v*f,i.upperRoll=-s*v*d*.7,i.drop=(s>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const u=s*r,p=oS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(p.upperPitch*f+p.fold),i.upperRoll=-u*p.upperRoll*d,i.upperYaw=u*p.upperYaw*d,i.upperShift=u*p.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*p.back,i.drop=u*p.drop,i.knee=u*p.knee,i.hip=u*p.hip,i.arm=u*p.arm,i.flash=e.flashStrength*r,i}function Gu(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,r=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*r}}const vi=1e-6;function Gs(n,t,e){return n<t?t:n>e?e:n}function cS(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=vi||a<=vi||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const o=s+a,c=Math.abs(s-a)+vi,l=Math.hypot(n.x,n.y,n.z);if(l<=vi)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),p=Gs(u,c,o),v=u>o+vi||u<c-vi,g=Math.atan2(-d,Math.max(f,vi)),m=Gs((s*s+p*p-a*a)/(2*s*p),-1,1),x=Gs((a*a+p*p-s*s)/(2*a*p),-1,1),_=Math.acos(m),y=Math.acos(x),P=i>=0?1:-1;return{rootPitch:g-P*_,rootRoll:h,jointPitch:P*(_+y),clamped:v,reach:l/o}}function lS(n,t,e,i){const s=Gs(e,0,1),a=Math.max(0,i),r=(o,c)=>{const l=Gs((c-o)*s,-a,a);return o+l};return{rootPitch:r(n.rootPitch,t.rootPitch),rootRoll:r(n.rootRoll,t.rootRoll),jointPitch:r(n.jointPitch,t.jointPitch)}}function Vu(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const ul={active:!1,weight:0,clamped:0,maxError:0};function Xu(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:r}=n;if(!r.enabled||r.weight<=0||!n.grounded||s.length===0)return{...ul};const o={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=s.map(u=>u.tip.getWorldPosition(new V));e.position.copy(o.pelvisPos),e.rotation.x=o.pelvisRotX,e.rotation.z=o.pelvisRotZ,i.position.copy(o.lowerPos),i.rotation.z=o.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,r.weight))*(n.attacking?Math.max(0,Math.min(1,r.attackScale)):1),h=Math.max(0,r.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const p=s[u],v=i.worldToLocal(c[u].clone()),g={x:v.x-p.root.position.x,y:v.y-p.root.position.y,z:v.z-p.root.position.z},m=cS(g,p.upperLen,p.lowerLen,p.bend);m.clamped&&(f+=1);const x=lS({rootPitch:p.root.rotation.x,rootRoll:p.root.rotation.z,jointPitch:p.joint.rotation.x},m,l,h);p.root.rotation.x=x.rootPitch,p.root.rotation.z=x.rootRoll,p.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<s.length;u++){const p=s[u].tip.getWorldPosition(new V);d=Math.max(d,p.distanceTo(c[u]))}return{active:!0,weight:l,clamped:f,maxError:d}}function ln(n,t,e){return n<t?t:n>e?e:n}function hS(n,t,e,i,s,a,r,o,c,l){const h=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new xe,d=new xe;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new xe;u.name="lower";const p=new xe;p.name="upper",d.add(u),d.add(p);const v=[],g=(Q,xt,Wt,nt)=>{const At=new Qs({color:nt}),O=new re(new Tn(Q,xt,Wt),At);return O.castShadow=!0,O.receiveShadow=!0,v.push(At),O},m=n.headSize,x=n.legLength,_=n.armLength,y=n.limbThickness,P=n.bodyHeight,S=n.bodyWidth,w=g(S,P,.28,e);w.position.y=P/2,p.add(w);const A=new xe;A.name="headPivot",A.position.y=P,p.add(A);const E=g(m,m,m,e);E.position.y=m/2,A.add(E);for(const Q of[-1,1]){const xt=g(.06,.07,.02,t.shoe);xt.position.set(Q*.09,m/2+.03,m/2+.011),A.add(xt)}const M=(Q,xt)=>{const Wt=xt?_:x,nt=new xe;nt.name=xt?Q<0?"shoulderL":"shoulderR":Q<0?"hipL":"hipR",xt||(nt.rotation.order="ZYX"),nt.position.set(Q*(xt?S/2+y/2:S/2-y/2),xt?P-.04:0,0),(xt?p:u).add(nt);const At=g(y,Wt/2,y,t.limb);At.position.y=-Wt/4,nt.add(At);const O=new xe;O.name=xt?"elbow":"knee",O.position.y=-Wt/2,nt.add(O);const at=g(y,Wt/2,y,t.limb);if(at.position.y=-Wt/4,O.add(at),!xt){const ut=g(y*1.15,.07,y*1.7,t.shoe);ut.position.set(0,-Wt/2+.035,.045),O.add(ut);const Ot=new Pe;return Ot.name="footTip",Ot.position.y=-Wt/2,O.add(Ot),{root:nt,joint:O,tip:Ot}}return{root:nt,joint:O}},R=M(-1,!1),U=M(1,!1),F=M(-1,!0),B=M(1,!0),L=[R,U].map(Q=>({root:Q.root,joint:Q.joint,tip:Q.tip,upperLen:x/2,lowerLen:x/2,bend:1})),C=new Be({color:s.attackArcColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),X=new re(new yr(.62,.042,6,20,Math.PI*1.1),C);X.position.set(0,.78-x,.56),p.add(X);const H=new Zt(e),q=new Zt(o.flashColor),j=new Zt;let st=null,ft=0,_t=0,Y=0,tt=0,mt=0,J=0,gt=0,Ut={...ul},Dt=-1,Mt=0,Pt=0,Ct=0,G=0,te=0,Ft=0,Nt=0,Lt=1,Rt=0,It=0,D="none",b=0,W=!1,lt=-1,ht=!1,rt=0,zt=0;return{group:f,update(Q,xt){f.position.set(Q.position.x,Q.position.y,Q.position.z),f.rotation.y=Q.bodyYaw,A.rotation.y=(Q.headYaw-Q.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,Q.mode!==st&&(st=Q.mode,ft=1),ft=Math.max(0,ft-xt*2.2);const Wt=Q.hurt,nt=Hu(Wt,Q.bodyYaw,o),At=nt.flash;j.copy(q).multiplyScalar(At);for(const et of v)et.emissive.copy(H).multiplyScalar(ft*.5),At>0&&et.emissive.add(j);d.position.set(0,x,0),d.rotation.set(0,0,0),p.position.set(0,0,0),p.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const O=Math.hypot(Q.velocity.x,Q.velocity.z),at=ln(r.knockGaitScale??0,0,1),ut=Q.hurt.knockX*at,Ot=Q.hurt.knockZ*at,Ht=at>0&&Math.hypot(Q.hurt.knockX,Q.hurt.knockZ)>.001,$t=Q.velocity.x+ut,z=Q.velocity.z+Ot,St=Math.hypot($t,z),K=Math.cos(Q.bodyYaw),ot=-Math.sin(Q.bodyYaw),bt=O>1e-6?ln((Q.velocity.x*K+Q.velocity.z*ot)/O,-1,1):0,wt=O>1e-6?ln((Q.velocity.x*Math.sin(Q.bodyYaw)+Q.velocity.z*Math.cos(Q.bodyYaw))/O,-1,1):1,Xt=hl(wt,r.backStrafeStartDeg,r.backStrafeFullDeg);D==="settled"&&ht&&rt>zt*1.02+1e-4&&(D="none");let Kt=1;D==="blend"?(Kt=Nu(W?lt:b,r.stopYawBlendMode,W),W||(b=Math.min(1,b+xt/Math.max(.01,r.stopYawAfterSec)),(b>=1||r.stopYawBlendMode==="inStop"||ht)&&(D="settled",Kt=0))):D==="settled"&&(Kt=ln(O/Math.max(1e-6,r.stopEnterRatio*a),0,1));const ce=Du(bt,r.strafeHipScale,r.strafeHipMaxDeg,r.strafeHipBoost),jt=Iu(wt,bt,ce,Xt)*Kt;Rt+=(jt-Rt)*(1-Math.exp(-12*Math.max(0,xt))),u.rotation.y=Rt;const ie=Q.bodyYaw+Rt,_e=Math.sin(ie),Ge=Math.cos(ie),Fe=Math.cos(ie),Z=-Math.sin(ie),yt=$t*_e+z*Ge,Et=$t*Fe+z*Z,qt=Math.max(0,r.stopBlendSec||0),Yt=qt>0&&!Ht,se=ku(O,It,a,r.stopEnterRatio,r.stopExitRatio);if(!Yt||se.resume)Dt=-1;else if(Dt<0&&se.enter){Dt=0,Mt=Q.gaitPhase,Pt=Pu(Q.gaitPhase),Ct=O,G=Math.max(Q.stride,1e-6),te=yt,Ft=Et;const et=1/Math.max(1e-6,O);Nt=Q.velocity.x*et,Lt=Q.velocity.z*et}const ue=It;It=O;const ye=Yt&&Dt>=0;ye&&(Dt=Math.min(1,Dt+xt/qt)),ye&&D!=="blend"&&(D="blend",b=0),W=ye&&Dt<1,lt=Dt,ht=se.resume,rt=O,zt=ue;const Ne=ye?{phase:Mt,speed:Ct,moveSpeed:a,localForward:te,localRight:Ft,legLength:n.legLength,stride:G,grounded:!0}:{phase:Q.gaitPhase,speed:St,moveSpeed:a,localForward:yt,localRight:Et,legLength:n.legLength,stride:Q.stride,grounded:!0},de=ye?Lu(Ne,r,{progress:Dt,phase0:Mt,phaseEnd:Pt}):dl(Ne,r);let an=0,dn=0,T=0,$=0;if(ye){const et=Fu(Q.bodyYaw,Nt,Lt),ct=zu(Dt,Mt,et.forward,et.right,r);ct.leadLeft?(de.legL.pitchX-=ct.leadPitch,de.legL.kneeX+=ct.leadKnee,de.legR.pitchX+=ct.trailPitch):(de.legR.pitchX-=ct.leadPitch,de.legR.kneeX+=ct.leadKnee,de.legL.pitchX+=ct.trailPitch),dn=ct.bodyShift*ct.fwdN,an=ct.bodyShift*ct.rightN,T=ct.bodyDip,$=ct.chestPitch}R.root.rotation.x=de.legL.pitchX,U.root.rotation.x=de.legR.pitchX,R.root.rotation.z=de.legL.rollZ,U.root.rotation.z=de.legR.rollZ,R.joint.rotation.x=de.legL.kneeX,U.joint.rotation.x=de.legR.kneeX,F.root.rotation.x=de.armL,B.root.rotation.x=de.armR,F.joint.rotation.x=-.18,B.joint.rotation.x=-.18,d.position.x=de.pelvisX,d.position.y=x+de.pelvisY,d.position.z=0,d.rotation.z=de.pelvisRoll,p.rotation.z=de.sideLean*(nt.intensity>0?.4:1);const I=Vu(d,u),N=ye&&h.enabled?{...h,weight:1}:h,k=N.enabled&&N.weight>0?ln(N.weight,0,1):0;if(d.position.x+=an,d.position.z+=dn,d.position.y-=T,u.position.y+=T,k<=0&&(u.position.x-=an,u.position.z-=dn),c){const et=Math.max(.004166666666666667,Math.min(xt,.1)),ct=Math.sin(Q.bodyYaw),vt=Math.cos(Q.bodyYaw),Gt=ln((Q.velocity.x-_t)/et,-60,60),Jt=ln((Q.velocity.z-Y)/et,-60,60),oe=Gt*ct+Jt*vt,be=He(Q.bodyYaw-tt)/et,Qt=c.maxForwardDeg*Math.PI/180,Vt=c.maxSideDeg*Math.PI/180,Ce=1-Math.exp(-Math.max(0,c.smoothing)*et);mt+=(ln(oe*c.accelGain,-Qt,Qt)-mt)*Ce,J+=(ln(-be*O*c.turnGain,-Vt,Vt)-J)*Ce;const ae=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;gt+=(ln(O/Math.max(a,1e-6),0,1)-gt)*(1-Math.exp(-Math.max(0,ae)*et));const Ee=Gu({leanForward:mt,leanSide:J,speedRatio:gt},c);p.rotation.x+=mt+$,p.rotation.z+=J,d.rotation.x+=Ee.pelvisPitch,d.rotation.z+=Ee.pelvisRoll,d.position.x+=Ee.pelvisX,d.position.z+=Ee.pelvisZ,d.position.y-=Ee.crouch,u.position.y+=Ee.crouch*(1-k)}_t=Q.velocity.x,Y=Q.velocity.z,tt=Q.bodyYaw,p.rotation.x+=nt.upperPitch,p.rotation.z+=nt.upperRoll,p.rotation.y+=nt.upperYaw;const it=ln(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),dt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;p.position.x+=ln(nt.upperShiftX*it,-dt,dt),p.position.z+=ln(nt.upperShiftZ*it,-dt,dt),d.position.x+=nt.comX,d.position.z+=nt.comZ-nt.pelvisBack,d.position.y-=nt.drop;const pt=nt.legacy?0:Math.max(0,Math.min(1,o.lowerScale));if(u.position.z+=nt.pelvisBack*(1-pt),u.position.y+=nt.drop*(1-pt),R.joint.rotation.x+=nt.knee,U.joint.rotation.x+=nt.knee,R.root.rotation.x-=nt.hip,U.root.rotation.x-=nt.hip,F.root.rotation.x+=nt.arm,B.root.rotation.x+=nt.arm*.8,Q.attackPhase!=="idle"&&nt.intensity===0){const et=Q.attackProgress,ct=et<.34?-1:et<.68?-1+(et-.34)/.34*2:Math.max(0,1-(et-.68)/.32),vt=Math.max(0,-ct),Gt=Math.max(0,ct);B.root.rotation.x=-1.7*vt+1.25*Gt,B.joint.rotation.x=-(.25+vt*.45),p.rotation.y=-.28*ct,C.opacity=Q.attackPhase==="active"?.85:0,Q.attackPhase==="active"&&(X.rotation.z=-1.1+et*3)}else C.opacity=0;const Tt=Uu(Rt,r.chestYawScale,r.chestYawMaxDeg);p.rotation.y+=Tt,A.rotation.y=(Q.headYaw-Q.bodyYaw-Tt+Math.PI*3)%(Math.PI*2)-Math.PI,Ut=Xu({root:f,pelvis:d,lower:u,limbs:L,base:I,cfg:N,grounded:!0,attacking:Q.attackPhase!=="idle"})},ik(){return Ut},dispose(){f.traverse(Q=>{if(Q instanceof re){Q.geometry.dispose();const xt=Q.material;Array.isArray(xt)?xt.forEach(Wt=>Wt.dispose()):xt.dispose()}})}}}const _i=.012,yi=.016;function dS(n,t){const e=t.lab,i=new xe;i.name="test-lab";const s=[],a=[],r=[],o=[];function c(x){return r.push(x),x}function l(x){return o.push(x),x}function h(x,_,y,P=_i){const S=c(new Be({color:_,transparent:!0,opacity:y,depthWrite:!1,side:Te,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),w=new re(x,S);return w.rotation.x=-Math.PI/2,w.position.y=P,w.renderOrder=2,w}function f(x,_){return l(new Js(Math.max(x,.001),_,72))}function d(x,_,y,P=yi){const w=document.createElement("canvas"),A=w.getContext("2d");if(!A)return new re;const E='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';A.font=E,w.width=ah.ceilPowerOfTwo(Math.ceil(A.measureText(x).width)+32),w.height=ah.ceilPowerOfTwo(96*1.4);const M=w.getContext("2d");if(!M)return new re;M.font=E,M.textAlign="center",M.textBaseline="middle",M.fillStyle=y,M.fillText(x,w.width/2,w.height/2);const R=new Rc(w);R.colorSpace=je,a.push(R);const U=w.width/w.height,F=l(new pn(_*U,_)),B=c(new Be({map:R,transparent:!0,depthWrite:!1,side:Te,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new re(F,B);return L.rotation.x=-Math.PI/2,L.position.y=P,L.renderOrder=3,L}function u(x,_,y,P,S,w){const A=y-_,E=l(new pn(A,P)),M=h(E,S,w,_i);M.position.set(A/2+_,_i,0);const R=new xe;return R.add(M),R.rotation.y=x-Math.PI/2,R}function p(x,_,y,P,S){const w=new bu;w.moveTo(0,_*.5),w.lineTo(-y*.5,_*.5-y*.9),w.lineTo(-y*.18,_*.5-y*.9),w.lineTo(-y*.18,-_*.5),w.lineTo(y*.18,-_*.5),w.lineTo(y*.18,_*.5-y*.9),w.lineTo(y*.5,_*.5-y*.9),w.closePath();const A=l(new ll(w)),E=h(A,P,S,_i+.002),M=new xe;return M.add(E),M.rotation.y=x+Math.PI,M}function v(x){var A;const _=new xe,y=d(`${x.index} · ${x.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((A=y.geometry.parameters)==null?void 0:A.width)??3;_.add(y);const w=h(l(new pn(S*.98,.08)),x.color,.7,yi);return w.position.set(0,yi,t.lab.labelTextHeight*.66),_.add(w),_.position.set(x.labelX,0,x.labelZ),_}const g=new xe;for(const x of n??[]){const _=new xe;if(_.position.set(x.x,0,x.z),x.shape==="square"){const y=x.radius,P=h(l(new pn(y*2,y*2)),x.color,e.padOpacity*.09);_.add(P);const S=.07,w=[[0,y,y*2+S,S],[0,-y,y*2+S,S],[-y,0,S,y*2+S],[y,0,S,y*2+S]];for(const[A,E,M,R]of w){const U=h(l(new pn(M,R)),x.color,e.padOpacity);U.position.x=A,U.position.z=E,_.add(U)}}else _.add(h(l(new al(x.radius,72)),x.color,e.padOpacity*.075)),_.add(h(f(x.radius-.075,x.radius),x.color,e.padOpacity));if(x.id==="hub"){for(let y=0;y<4;y++){const P=y*Math.PI/4,S=y%2===0;for(const w of[0,Math.PI])_.add(u(P+w,x.radius*.12,x.radius*.94,S?.09:.055,x.color,S?.5:.32))}_.add(h(f(.5,.56),x.color,.4))}else if(x.id==="dash"){const y=x.spawnZ-x.z,P=-x.radius+.5,S=y-P,w=h(l(new pn(.06,S)),x.color,.36);w.position.set(0,_i,(y+P)/2),_.add(w);let A=0;for(let M=y;M>=P-.01;M-=1,A++){const R=A%5===0,U=h(l(new pn(R?2.4:1.3,R?.1:.07)),x.color,R?.72:.42);U.position.set(0,_i,M),_.add(U);const F=d(String(A),.52,R?"#eaf4ff":"rgba(200,225,245,0.8)");F.position.set(1.6,yi,M),_.add(F)}const E=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,R]of E){const U=y-M,F=h(l(new pn(1.9,.09)),"#ffffff",.5);F.position.set(-1.5,_i,U),_.add(F);const B=d(R,.42,"rgba(220, 236, 250, 0.86)");B.position.set(-3,yi,U),_.add(B)}}else if(x.id==="gait"){_.add(h(f(1.44,1.5),x.color,.5)),_.add(h(f(1.14,1.2),x.color,.22));const y=1.55,P=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,w,A]of P){const M=Math.sin(S),R=Math.cos(S),U=p(S,1.7,.34,A,.75);U.position.set(M*1.7*.5,0,y+R*1.7*.5),_.add(U);const F=d(w,.44,A);F.position.set(M*(1.7+.7),yi,y+R*(1.7+.7)),_.add(F)}}if(g.add(_),e.showLabels){const y=v(x);s.push(y),g.add(y)}}i.add(g);const m=n==null?void 0:n.find(x=>x.id==="hub");if(m&&e.showLabels){const x=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[_,y,P]of x){const S=d(P,.4,"rgba(190, 224, 248, 0.8)");S.position.set(m.x+_*(m.radius+.7),yi,m.z+y*(m.radius+.7)),i.add(S),s.push(S)}}return i.visible=e.enabled,{group:i,setVisible(x){i.visible=x},setLabelsVisible(x){for(const _ of s)_.visible=x},dispose(){for(const x of o)x.dispose();for(const x of r)x.dispose();for(const x of a)x.dispose();i.clear()}}}const fl=64,Wu=[0,.24,.76,1],uS=[0,1,1,0],$u=[0,.12,.28,.5,.72,.88,1],fS=[0,.16,.5,1,.5,.16,0];function gd(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function pl(n,t,e,i,s=fl,a="band"){const r=Math.max(.001,n-t*.5),o=Math.max(r+.001,n+t*.5),c=a==="glow"?$u:Wu,l=a==="glow"?fS:uS,h=c.length,f=s+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),p=[];for(let g=0;g<f;g++){const m=g/s,x=(m-.5)*e,_=gd(m,i)*gd(1-m,i),y=Math.sin(x),P=Math.cos(x);for(let S=0;S<h;S++){const w=r+(o-r)*c[S],A=g*h+S;d[A*3]=y*w,d[A*3+1]=0,d[A*3+2]=P*w;const E=_*l[S];u[A*4]=1,u[A*4+1]=1,u[A*4+2]=1,u[A*4+3]=E}}for(let g=0;g<s;g++)for(let m=0;m<h-1;m++){const x=g*h+m,_=x+h;p.push(x,_,x+1,x+1,_,_+1)}const v=new Ue;return v.setAttribute("position",new Qe(d,3)),v.setAttribute("color",new Qe(u,4)),v.setIndex(p),v.computeBoundingSphere(),v}function Mo(n){const t=new Be({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Te,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const s=(c,l)=>{const h=Math.round(c*32)/32,f=Math.max(.05,Math.round(l*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const p=pl(n.radius,n.thickness*f,h,n.edgeFade,fl,n.profile??"band");if(e.set(d,p),e.size>64){for(const[v,g]of e)if(v!==d&&g!==i){g.dispose(),e.delete(v);break}}return p};i=s(n.arcRad,1);const a=new re(i,t);a.position.y=n.y,a.renderOrder=n.renderOrder??4;let r=n.arcRad,o=1;return{mesh:a,update(c,l,h,f,d,u=1){const p=Math.max(.05,u);(Math.abs(c-r)>.01||Math.abs(p-o)>.01)&&(i=s(c,p),a.geometry=i,r=c,o=p),t.opacity=l,t.color.copy(f),a.scale.set(h,1,h),a.rotation.y=d,a.visible=l>.002},arcRad(){return r},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function xd(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function pS(n,t,e,i,s){const a=s.arcDeg*Math.PI/180,r=s.playerOpacity;if(!n)return{arcRad:a,opacity:r,scale:1,level:0};const o=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=s.selectedArcDeg*Math.PI/180,h=a+(l-a)*(.35+.65*o),f=4+4*o+6*c,d=.5+.5*Math.sin(i*f),u=Math.min(.95,r+(.2+.1*c)*o+.04*d),p=1+.02*o+.012*d*o;return{arcRad:h,opacity:u,scale:p,level:o}}function mS(n,t,e,i,s){const a=Math.min(1,Math.max(0,s));return a<=.001?n.copy(t):a<.5?n.copy(t).lerp(e,a*2):n.copy(e).lerp(i,(a-.5)*2)}function gS(n=64,t=.06,e=5){const i=n+1,s=e+1,a=new Float32Array(i*s*3),r=new Float32Array(i*s*4),o=[];for(let l=0;l<i;l++){const h=l/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<s;u++){const p=u/e,v=t+(1-t)*p,g=l*s+u;a[g*3]=f*v,a[g*3+1]=0,a[g*3+2]=d*v;const m=Math.pow(1-p,1.8)*.9+(u===0?.1:0);r[g*4]=1,r[g*4+1]=1,r[g*4+2]=1,r[g*4+3]=Math.min(1,m)}}for(let l=0;l<n;l++)for(let h=0;h<e;h++){const f=l*s+h,d=f+s;o.push(f,d,f+1,f+1,d,d+1)}const c=new Ue;return c.setAttribute("position",new Qe(a,3)),c.setAttribute("color",new Qe(r,4)),c.setIndex(o),c.computeBoundingSphere(),c}function vd(n){const t=n.segments??fl,e=n.profile??"band",s=((e==="glow"?$u.length:Wu.length)-1)*6,a=pl(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),r=new Be({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Te,vertexColors:!0,toneMapped:!1}),o=new re(a,r);o.position.y=n.y,o.renderOrder=n.renderOrder??7,o.visible=!1,a.setDrawRange(0,0);let c=0;return{mesh:o,set(l,h,f,d,u=1){const p=Math.min(1,Math.max(0,l)),v=Math.round(p*t),g=p>.001?Math.max(1,v)*s:0;g!==a.drawRange.count&&a.setDrawRange(0,g),c=v,r.opacity=h,r.color.copy(f),o.scale.set(u,1,u),o.rotation.y=d,o.visible=h>.002&&p>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){a.dispose(),r.dispose()}}}function _d(n){const t=new xe,e=gS(48),i=new Be({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Te,vertexColors:!0,toneMapped:!1}),s=new re(e,i);s.renderOrder=n.renderOrder??2,t.add(s);const a=Math.max(.01,n.edgeWidthRatio??.045),r=pl(1-a*.5,a,Math.PI*2,0,64,"band"),o=new Be({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Te,vertexColors:!0,toneMapped:!1}),c=new re(r,o);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,h,f,d,u,p){const v=Math.min(1,Math.max(0,u));t.position.set(l,f,h),s.scale.set(d,1,d),c.scale.set(d,1,d),i.opacity=v*.26,o.opacity=v*(.72+.18*Math.sin(p*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),r.dispose(),o.dispose()}}}function yd(n,t,e,i){if(i<=1e-4||e<=0)return t;const s=1-Math.exp(-e/i);return n+(t-n)*s}function xS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),s=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:s,urgency:.35+.65*s}}function vS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function _S(n,t,e,i,s,a){return n!=="windup"||s<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*s,z:e+Math.cos(i)*s,radius:Math.max(.3,a)}}function yS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function MS(n,t,e){return n?t:e}function Yu(n){return{x:0,y:0,z:1}}function SS(n){return Math.asin(Yu().y)}function bS(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}function Oe(n,t,e){return n<t?t:n>e?e:n}const ss=1e-6;function we(n,t,e,i){const s=new re(new Tn(n,t,e),new Qs({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function De(){return new xe}function Ka(n,t,e){const i=De(),s=we(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=we(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const r=we(t*.38,n,t,e.blade);r.position.y=.13+n/2,i.add(r);const o=we(t*.42,n*.96,t*.2,e.bladeEdge);o.position.set(0,.13+n/2,t*.5),i.add(o);const c=we(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function ES(n){const t=Ka(.72,.15,n),e=we(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function wS(n){const t=De(),e=we(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=we(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function AS(n){const t=De(),e=we(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=we(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new Zt(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function TS(n){const t=De();for(let i=0;i<5;i++){const s=(i-2)*.15,a=we(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=we(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function RS(n){const t=De(),e=we(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=we(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function CS(n,t,e,i,s,a,r,o,c,l,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},d=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=De(),p=De();p.name="pelvis",p.position.y=n.legLength,u.add(p);const v=De();v.name="lower";const g=De();g.name="upper",p.add(v),p.add(g);const m=n.headSize,x=n.legLength,_=n.armLength,y=n.limbThickness,P=n.bodyHeight,S=n.bodyWidth,w=we(S,P,.28,t.body);w.position.y=P/2,g.add(w);const A=De();A.name="headPivot",A.position.y=i.headPivotHeight,g.add(A);const E=we(m,m,m,t.head);E.position.y=m/2,A.add(E);const M=new Qs({color:"#1b2733"});for(const I of[-1,1]){const N=new re(new Tn(.06,.07,.02),M);N.position.set(I*.09,m/2+.03,m/2+.011),A.add(N)}const R=I=>{const N=De();N.name=I<0?"hipL":"hipR",N.rotation.order="ZYX",N.position.set(I*(S/2-y/2),0,0),v.add(N);const k=we(y,x/2,y,t.limb);k.position.y=-x/4,N.add(k);const it=De();it.name="knee",it.position.y=-x/2,N.add(it);const dt=we(y,x/2,y,t.limb);dt.position.y=-x/4,it.add(dt);const pt=we(y*1.15,.07,y*1.7,t.shoe);pt.position.set(0,-x/2+.035,.045),it.add(pt);const Tt=new Pe;return Tt.name="footTip",Tt.position.y=-x/2,it.add(Tt),{root:N,joint:it,hand:De(),tip:Tt}},U=I=>{const N=De();N.name=I<0?"shoulderL":"shoulderR",N.position.set(I*(S/2+y/2),P-.04,0),g.add(N);const k=we(y,_/2,y,t.limb);k.position.y=-_/4,N.add(k);const it=De();it.name="elbow",it.position.y=-_/2,N.add(it);const dt=we(y,_/2,y,t.limb);dt.position.y=-_/4,it.add(dt);const pt=De();pt.position.y=-_/2,it.add(pt);const Tt=we(y*1.1,.09,y*1.1,t.head);return Tt.position.y=.045,pt.add(Tt),{root:N,joint:it,hand:pt}},F=R(-1),B=R(1),L=U(-1),C=U(1),X=[F,B].map(I=>({root:I.root,joint:I.joint,tip:I.tip,upperLen:x/2,lowerLen:x/2,bend:1})),H=De(),q=De();C.hand.add(H),L.hand.add(q);const j=AS(t),st=TS(t),ft=RS(t),_t={"sword-shield":{right:Ka(.42,.075,t),left:wS(t)},"dual-swords":{right:Ka(.42,.075,t),left:Ka(.42,.075,t)},greatsword:{right:ES(t),left:we(.12,.2,.12,t.wood)},staff:{right:j.g,left:De(),orb:j.orb},bow:{right:ft,left:st.g,arrow:ft,drawString:st.drawString}};for(const I of Object.keys(_t))H.add(_t[I].right),q.add(_t[I].left),_t[I].right.visible=!1,_t[I].left.visible=!1;let Y=null,tt=0,mt=0,J=0,gt=0,Ut=0,Dt=0,Mt=sS(),Pt={...ul},Ct=0,G=0,te=0,Ft=-1,Nt=0,Lt=0,Rt=0,It=0,D=0,b=0,W=0,lt=1,ht=0,rt=0,zt=0,Q=!1,xt=0,Wt=0,nt=0,At=0,O="none",at=0,ut=1,Ot=!1,Ht=-1,$t=!1,z=0,St=0,K=0,ot=0,bt=0,wt=1,Xt={speed:0,phase:0},Kt={lp:0,lr:0,rp:0,rr:0},ce=0,jt=0,ie=!0,_e=0,Ge="none",Fe=0,Z=0,yt=0,Et=.3,qt=0;function Yt(I){const N=Math.PI/180,k=a;let it=0,dt=0,pt=0,Tt=0;I==="sword-shield"?(it=k.swordPitchDeg*N,dt=-k.swordYawDeg*N,pt=k.shieldPitchDeg*N):I==="dual-swords"?(it=k.swordPitchDeg*N,dt=-k.swordYawDeg*N,pt=k.swordPitchDeg*N,Tt=k.swordYawDeg*N):I==="greatsword"?(it=k.greatswordPitchDeg*N,dt=-k.greatswordYawDeg*N,pt=k.greatswordPitchDeg*N,Tt=k.greatswordYawDeg*N):I==="staff"?it=k.staffPitchDeg*N:pt=k.bowPitchDeg*N,H.rotation.set(it,0,dt),q.rotation.set(pt,0,Tt)}function se(I){if(I!==Y){Y=I;for(const N of Object.keys(_t))_t[N].right.visible=N===I,_t[N].left.visible=N===I;Yt(I),st.drawString.position.z=-.06,ft.position.z=0,j.orb.scale.setScalar(1),g.rotation.y=0}}se("sword-shield");const ue=[];u.traverse(I=>{I instanceof re&&I.material instanceof Qs&&ue.push(I.material)});const ye=new Zt(o.flashColor);function Ne(I,N){const k=Hu(I,N,o);Mt=k,g.rotation.x+=k.upperPitch,g.rotation.z+=k.upperRoll,g.rotation.y+=k.upperYaw;const it=Oe(Number.isFinite(o.upperShiftScale)?o.upperShiftScale:1,0,1),dt=Number.isFinite(o.maxUpperShift)?Math.max(0,o.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Oe(k.upperShiftX*it,-dt,dt),g.position.z+=Oe(k.upperShiftZ*it,-dt,dt),p.position.x+=k.comX,p.position.z+=k.comZ-k.pelvisBack,p.position.y-=k.drop;const pt=k.legacy?0:Oe(o.lowerScale,0,1);v.position.z+=k.pelvisBack*(1-pt),v.position.y+=k.drop*(1-pt),F.joint.rotation.x+=k.knee,B.joint.rotation.x+=k.knee,F.root.rotation.x-=k.hip,B.root.rotation.x-=k.hip,L.root.rotation.x+=k.arm,C.root.rotation.x+=k.arm*.8;for(const Tt of ue)Tt.emissive.copy(ye).multiplyScalar(k.flash)}function de(I){return I<.3?-1:I<.62?-1+(I-.3)/.32*2:Math.max(0,1-(I-.62)/.38)}function an(I){if(I.phase==="idle"||I.charging)return;const N=I.attackProgress,k=de(N),it=Math.max(0,k),dt=I.comboIndex%2===0?1:-1,pt=c.stride,Tt=Number.isFinite(pt.stepReach)?pt.stepReach:.17,et=Number.isFinite(pt.stepSideReach)?pt.stepSideReach:.14,ct=Number.isFinite(pt.stepDipReach)?pt.stepDipReach:.05,vt=I.weapon==="greatsword"?Oe(Number.isFinite(pt.heavyScale)?pt.heavyScale:1,0,1):1;p.position.z+=Tt*it*vt,p.position.x+=dt*et*it*vt,p.position.y-=ct*Math.sin(Math.PI*N)*vt}function dn(I){if(st.drawString.position.z=-.06,ft.position.z=0,j.orb.scale.setScalar(1),g.rotation.y=0,I.charging&&I.weapon==="bow"){const dt=I.charge;L.root.rotation.x=-1.25,L.joint.rotation.x=-.15,C.root.rotation.x=.35+dt*.3,C.joint.rotation.x=-1.15,st.drawString.position.z=-.06-dt*.22,ft.position.z=-dt*.3,g.rotation.y=-.22;return}if(I.phase==="idle")return;const N=de(I.attackProgress),k=Math.max(0,-N),it=Math.max(0,N);if(I.weapon==="bow")L.root.rotation.x=-1.2,L.joint.rotation.x=-.15,C.root.rotation.x=.9-it*.8,C.joint.rotation.x=-.3;else if(I.weapon==="greatsword"){const dt=-1.6*k+1.25*it,pt=Oe(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);C.root.rotation.x=dt,C.joint.rotation.x=-(.25+k*.4),L.root.rotation.x=dt+.06,L.joint.rotation.x=-(.32+k*.4),L.root.rotation.z=.38,g.rotation.y=-.2*N*pt}else{const dt=I.comboIndex;if(dt===1)C.root.rotation.x=-1.7*k+1.1*it,C.joint.rotation.x=-(.2+k*.5),L.root.rotation.x=.1,g.rotation.y=-.18*N;else if(dt===2)L.root.rotation.x=-1.5*k+1*it,L.joint.rotation.x=-(.2+k*.5),C.root.rotation.x=.2,g.rotation.y=.45*-N;else{const pt=-1.9*k+1.2*it;L.root.rotation.x=pt,C.root.rotation.x=pt,L.joint.rotation.x=-(.15+k*.4),C.joint.rotation.x=-(.15+k*.4),g.rotation.y=-.3*N}}an(I)}function T(I,N){I&&(C.root.rotation.x=-1.05,C.joint.rotation.x=-.35,L.root.rotation.x=-.45,L.joint.rotation.x=-.2,g.rotation.y=-.12,j.orb.scale.setScalar(1.25+.12*Math.sin(N*2)))}function $(I){if(!I||I.phase==="idle")return;const N=I.progress,k=N<.3?-.35+N/.3*1.35:N<.7?1:Math.max(0,1-(N-.7)/.3),it=Math.PI/180;g.rotation.x+=d.leanDeg*it*k,L.root.rotation.x-=d.shieldPitchDeg*it*k,L.joint.rotation.x-=.22*k,C.root.rotation.x-=.3*k,p.position.z+=d.pelvisReach*Math.max(0,k)}return{group:u,update(I,N,k,it,dt=!1,pt,Tt,et){se(N.weapon),g.rotation.x=0,g.rotation.z=0,p.position.x=0,p.position.y=x,p.position.z=0,p.rotation.z=0,p.rotation.x=0,g.position.x=0,g.position.y=0,g.position.z=0,v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const ct=Math.max(1/240,Math.min(it,.1)),vt=pt===void 0?ce+=it:pt;jt=vt;const Gt=c.landing;Gt.enabled?ie&&!I.grounded?(Ge="jump",Fe=vt,Z=Gt.anticipationDuration,yt=Math.max(0,Gt.jumpAnticipation),Et=.32):!ie&&I.grounded&&(Ge="land",Fe=vt,Z=Gt.duration,yt=iS(_e,Gt),Et=Gt.compressRatio,qt=_e):(Ge="none",yt=0),vt<Fe&&(Ge="none",yt=0),ie=I.grounded,_e=I.velocity.y;const Jt=md(vt,Fe,Z,yt,Et),oe=N.phase!=="idle",be=(et==null?void 0:et.phase)==="active";ot=tS(ot,oe,ct,c.attack.blendRate);const Qt=eS(ot,c.attack.gaitWeight,c.attack.lowerBodyWeight);bt=Qt.attackLegWeight,wt=Qt.gaitScale;const Vt=Math.sin(I.bodyYaw),Ce=Math.cos(I.bodyYaw),ae=(I.velocity.x-tt)/ct,Ee=(I.velocity.z-mt)/ct,vn=Oe(ae,-60,60),Ve=Oe(Ee,-60,60),li=vn*Vt+Ve*Ce,ve=He(I.bodyYaw-J)/ct,un=Math.hypot(I.velocity.x,I.velocity.z),jn=r.maxForwardDeg*Math.PI/180,Ye=r.maxSideDeg*Math.PI/180,Rn=Oe(li*r.accelGain,-jn,jn),Cn=Oe(-ve*un*r.turnGain,-Ye,Ye),Ms=1-Math.exp(-r.smoothing*ct);gt+=(Rn-gt)*Ms,Ut+=(Cn-Ut)*Ms,tt=I.velocity.x,mt=I.velocity.z,J=I.bodyYaw;const _n=Math.hypot(I.velocity.x,I.velocity.z),Mr=Oe(s.knockGaitScale??0,0,1),Zu=k.knockX*Mr,qu=k.knockZ*Mr,ju=Mr>0&&Math.hypot(k.knockX,k.knockZ)>.001,Sr=I.velocity.x+Zu,br=I.velocity.z+qu,ml=Math.hypot(Sr,br);At=ml;const Ku=Math.cos(I.bodyYaw),Ju=-Math.sin(I.bodyYaw),Qu=I.velocity.x*Ku+I.velocity.z*Ju,gl=_n>ss?Oe(Qu/_n,-1,1):0,xl=_n>ss?Oe((I.velocity.x*Vt+I.velocity.z*Ce)/_n,-1,1):1,tf=hl(xl,s.backStrafeStartDeg,s.backStrafeFullDeg);O==="settled"&&$t&&z>St*1.02+1e-4&&(O="none");let Ss=1;O==="blend"?(Ss=Nu(Ot?Ht:at,s.stopYawBlendMode,Ot),Ot||(at=Math.min(1,at+ct/Math.max(.01,s.stopYawAfterSec)),(at>=1||s.stopYawBlendMode==="inStop"||$t)&&(O="settled",Ss=0))):O==="settled"&&(Ss=Oe(_n/Math.max(ss,s.stopEnterRatio*e),0,1)),ut=Ss;const ef=Du(gl,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost),nf=Iu(xl,gl,ef,tf)*Ss;G+=(nf-G)*(1-Math.exp(-i.hipYawSmoothing*ct));const bs=I.bodyYaw+G;te=bs;const sf=Math.sin(bs),af=Math.cos(bs),rf=Math.cos(bs),of=-Math.sin(bs),ia={speed:ml,phase:I.gaitPhase,localForward:Sr*sf+br*af,localRight:Sr*rf+br*of,stride:I.stride};oe&&!Q&&(zt=I.gaitPhase),Q=oe;const Ui=ot>0?JM(ia,N.attackProgress,N.comboIndex,ot,c.stride,zt):ia;Xt=Ui;const vl=Math.max(0,s.stopBlendSec||0),_l=vl>0&&!oe&&!ju&&I.grounded,Er=ku(_n,ht,e,s.stopEnterRatio,s.stopExitRatio);if(!_l||Er.resume)Ft=-1;else if(Ft<0&&Er.enter){Ft=0,Nt=I.gaitPhase,Lt=Pu(I.gaitPhase),Rt=_n,It=Math.max(I.stride,ss),D=ia.localForward,b=ia.localRight;const Se=1/Math.max(ss,_n);W=I.velocity.x*Se,lt=I.velocity.z*Se}const cf=ht;ht=_n;const hi=_l&&Ft>=0;hi&&(Ft=Math.min(1,Ft+ct/vl)),hi&&O!=="blend"&&(O="blend",at=0),Ot=hi&&Ft<1,Ht=Ft,$t=Er.resume,z=_n,St=cf;const yl=hi?{phase:Nt,speed:Rt,moveSpeed:e,localForward:D,localRight:b,legLength:n.legLength,stride:It,grounded:!0}:{phase:Ui.phase,speed:Ui.speed,moveSpeed:e,localForward:Ui.localForward,localRight:Ui.localRight,legLength:n.legLength,stride:Ui.stride??0,grounded:I.grounded},lf=hi?Lu(yl,s,{progress:Ft,phase0:Nt,phaseEnd:Lt}):dl(yl,s),fe=nS(lf,Qt.gaitScale);if(K=0,be&&et){const Se=qM(et.progress,et.dir,s),le=Qt.gaitScale;fe.legL.pitchX+=Se.legL.pitchX*le,fe.legL.rollZ+=Se.legL.rollZ*le,fe.legL.kneeX+=Se.legL.kneeX*le,fe.legR.pitchX+=Se.legR.pitchX*le,fe.legR.rollZ+=Se.legR.rollZ*le,fe.legR.kneeX+=Se.legR.kneeX*le,fe.pelvisY+=Se.pelvisY*le,K=Se.env}let wr=0,Ar=0,Tr=0,Ml=0;if(hi){const Se=Fu(I.bodyYaw,W,lt),le=zu(Ft,Nt,Se.forward,Se.right,s);le.leadLeft?(fe.legL.pitchX-=le.leadPitch,fe.legL.kneeX+=le.leadKnee,fe.legR.pitchX+=le.trailPitch):(fe.legR.pitchX-=le.leadPitch,fe.legR.kneeX+=le.leadKnee,fe.legL.pitchX+=le.trailPitch),Ar=le.bodyShift*le.fwdN,wr=le.bodyShift*le.rightN,Tr=le.bodyDip,Ml=le.chestPitch,xt=le.leadPitch,Wt=le.bodyShift,nt=le.bodyDip}else xt=0,Wt=0,nt=0;Kt={lp:fe.legL.pitchX,lr:fe.legL.rollZ,rp:fe.legR.pitchX,rr:fe.legR.rollZ},I.grounded?(F.root.rotation.x=fe.legL.pitchX,B.root.rotation.x=fe.legR.pitchX,F.root.rotation.z=fe.legL.rollZ,B.root.rotation.z=fe.legR.rollZ,F.joint.rotation.x=fe.legL.kneeX,B.joint.rotation.x=fe.legR.kneeX,L.root.rotation.x=fe.armL,C.root.rotation.x=fe.armR,L.joint.rotation.x=-(.18+fe.armL*.2),C.joint.rotation.x=-(.18+fe.armR*.2),L.root.rotation.z=0,C.root.rotation.z=0,p.position.x=fe.pelvisX,p.position.y=x+fe.pelvisY,p.position.z=0,p.rotation.z=fe.pelvisRoll):(F.root.rotation.x=-.55,B.root.rotation.x=-.25,F.joint.rotation.x=.75,B.joint.rotation.x=.55,L.root.rotation.x=-.9,C.root.rotation.x=-.7,L.joint.rotation.x=-.6,C.joint.rotation.x=-.6,F.root.rotation.z=0,B.root.rotation.z=0);const hf=Vu(p,v),Es=be?{...f,weight:0}:hi&&f.enabled?{...f,weight:1}:f,Sl=Es.enabled&&I.grounded&&Es.weight>0?Oe(Es.weight,0,1)*(oe?Oe(Es.attackScale,0,1):1):0;p.position.x+=wr,p.position.z+=Ar,p.position.y-=Tr,v.position.y+=Tr,Sl<=0&&(v.position.x-=wr,v.position.z-=Ar);const df=_n/Math.max(e,ss),uf=Number.isFinite(r.crouchSmoothing)?r.crouchSmoothing:8,ff=1-Math.exp(-Math.max(0,uf)*ct);Ct+=(Oe(df,0,1)-Ct)*ff;const Fi=Gu({leanForward:gt,leanSide:Ut,speedRatio:Ct},r);p.rotation.x+=Fi.pelvisPitch,p.rotation.z+=Fi.pelvisRoll,p.position.x+=Fi.pelvisX,p.position.z+=Fi.pelvisZ,p.position.y-=Fi.crouch,v.position.y+=Fi.crouch*(1-Oe(Sl,0,1)),dn(N),T(dt,I.gaitPhase),$(Tt);const pf=a.greatswordPitchDeg*Math.PI/180,bl=N.weapon==="greatsword",El=Math.hypot(I.velocity.x,I.velocity.z),mf=bl&&N.phase==="idle"&&El>.5?Math.min(1.15,El/Math.max(e,.001)*.9):0;Dt+=(mf-Dt)*(1-Math.exp(-6*ct)),bl&&(H.rotation.x=pf+Dt),N.weapon==="bow"&&(st.g.rotation.x=-(L.root.rotation.x+L.joint.rotation.x),ft.rotation.x=-(C.root.rotation.x+C.joint.rotation.x));const gf=g.rotation.y;Ne(k,I.bodyYaw);const wl=k.type==="none"?1:.4;if(g.rotation.x+=gt*wl+Ml,g.rotation.z+=(Ut+fe.sideLean)*wl,Jt>0&&(F.root.rotation.x-=Gt.hipPitch*Jt,B.root.rotation.x-=Gt.hipPitch*Jt,F.joint.rotation.x+=Gt.kneeBend*Jt,B.joint.rotation.x+=Gt.kneeBend*Jt,p.position.y-=Gt.crouchDepth*Jt,v.position.y+=Gt.crouchDepth*(1-Gt.lowerScale)*Jt,g.rotation.x+=Gt.upperPitch*Jt,L.root.rotation.x-=Gt.armTuck*Jt,C.root.rotation.x-=Gt.armTuck*Jt),bt>0&&I.grounded){const Se=QM(N.attackProgress,N.comboIndex,c.stride),le=bt;F.root.rotation.x+=Se.legL.pitchX*le,B.root.rotation.x+=Se.legR.pitchX*le,F.root.rotation.z+=Se.legL.rollZ*le,B.root.rotation.z+=Se.legR.rollZ*le,F.joint.rotation.x+=Se.legL.kneeX*le,B.joint.rotation.x+=Se.legR.kneeX*le,p.position.x+=Se.pelvisX*le,p.position.y+=Se.pelvisY*le,p.rotation.z+=Se.pelvisRoll*le}v.rotation.y=G,rt=Uu(G,s.chestYawScale,s.chestYawMaxDeg),g.rotation.y+=rt;const xf=gf;A.rotation.y=He(I.headYaw-I.bodyYaw-xf-rt),Pt=Xu({root:u,pelvis:p,lower:v,limbs:X,base:hf,cfg:Es,grounded:I.grounded,attacking:oe})},lean(){return{forward:gt,side:Ut}},landing(){const I=md(jt,Fe,Z,yt,Et),N=Z>0?Math.max(0,Z-Math.max(0,jt-Fe)):0;return{pulse:I,remaining:N,kind:I>0?Ge:"none",impactVy:qt}},hurt(){return Mt},ik(){return Pt},attackBlend(){return ot},attackWeights(){return{gaitScale:wt,attackLegWeight:bt,driveSpeed:Xt.speed,stridePhase:Xt.phase}},hipYaw(){return G},gaitDebug(){return{stopT:Ft,hipYaw:G,chestYaw:rt,speed:ht,gaitSpeed:At,stopStep:xt,stopShift:Wt,stopDip:nt,stopYawFade:ut,turnStep:K,legLPitch:Kt.lp,legLRoll:Kt.lr,legRPitch:Kt.rp,legRRoll:Kt.rr}},gaitYaw(){return te},arrowDirection(){ft.updateWorldMatrix(!0,!1);const I=ft.matrixWorld.elements,N=I[8],k=I[9],it=I[10],dt=Math.hypot(N,k,it)||1;return{x:N/dt,y:k/dt,z:it/dt}},dispose(){u.traverse(I=>{if(I instanceof re){I.geometry.dispose();const N=I.material;Array.isArray(N)?N.forEach(k=>k.dispose()):N.dispose()}})}}}function PS(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function LS(n,t,e,i){const s=Math.max(1,n.clientWidth),a=Math.max(1,n.clientHeight),r=new sM({antialias:!0});r.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),r.shadowMap.enabled=!0,r.shadowMap.type=Hd,r.setSize(s,a,!1),n.appendChild(r.domElement);const o=new aM;o.background=new Zt("#12161d"),o.add(new BM(11061486,2764600,1.15));const c=new VM(16773852,1.5);c.position.set(9,18,11),c.castShadow=!0,c.shadow.mapSize.set(1024,1024);const l=c.shadow.camera;l.left=-20,l.right=20,l.top=20,l.bottom=-20,l.near=1,l.far=60,o.add(c);const h=[],f=new xe;for(const Z of t.boxes){const yt=Z.maxX-Z.minX,Et=Z.maxY-Z.minY,qt=Z.maxZ-Z.minZ;let Yt=PS(Z.kind,e);Z.kind==="step"&&(Yt=new Zt(Yt).offsetHSL(0,0,Z.maxY*.09).getStyle());const se=new Qs({color:Yt,transparent:!0,opacity:1}),ue=new re(new Tn(yt,Et,qt),se);ue.position.set((Z.minX+Z.maxX)/2,(Z.minY+Z.maxY)/2,(Z.minZ+Z.maxZ)/2),ue.castShadow=Z.kind!=="ground",ue.receiveShadow=!0,ue.add(new vu(new MM(ue.geometry),new nl({color:10467020,transparent:!0,opacity:.32}))),f.add(ue),h.push(se)}o.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new WM(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,o.add(u);const p=dS(i,e);o.add(p.group);const v=CS(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=new xe,m=.9,x=new xe;x.position.y=m,v.group.position.y=-m,x.add(v.group),g.add(x),o.add(g);const _=t.dummies.map((Z,yt)=>{const Et=e.dummies.colors,qt=Et[yt%Et.length]??"#cccccc",Yt=hS(e.voxel,e.colors,qt,Z.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return Yt.group.traverse(se=>{se.userData.dummyId=Z.id}),o.add(Yt.group),Yt}),y=_.map(Z=>Z.group),P=new XM,S=e.groundRing,w=e.voxel.bodyWidth,A=xd(w,S.playerRadiusFactor),E=xd(w,S.dummyRadiusFactor),M=w*S.thicknessFactor,R=S.arcDeg*Math.PI/180;let U=0;const F=Mo({radius:A,thickness:M,arcRad:R,edgeFade:S.edgeFade,color:S.playerColor,opacity:S.playerOpacity,y:.028,renderOrder:6});F.mesh.name="player-ground-ring",o.add(F.mesh);const B=t.dummies.map(Z=>{const yt=Mo({radius:E,thickness:M,arcRad:R,edgeFade:S.edgeFade,color:S.neutralColor,opacity:S.opacity,y:.022,renderOrder:5});return yt.mesh.name=`dummy-ground-ring-${Z.id}`,o.add(yt.mesh),yt}),L=t.dummies.map(Z=>{const yt=Mo({radius:E*S.haloRadiusFactor,thickness:M*S.haloThicknessFactor,arcRad:R,edgeFade:S.edgeFade,color:S.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return yt.mesh.name=`dummy-ground-halo-${Z.id}`,o.add(yt.mesh),yt}),C=t.dummies.map(()=>0),X=t.dummies.map(()=>0),H=vd({radius:A*S.meterRadiusFactor,thickness:M*S.meterThicknessFactor,arcRad:R,edgeFade:.06,color:S.meterColorCharge,y:.03,renderOrder:8});H.mesh.name="player-ground-meter",o.add(H.mesh);const q=t.dummies.map(Z=>{const yt=vd({radius:E*S.warnRadiusFactor,thickness:M*S.warnThicknessFactor,arcRad:R,edgeFade:.02,color:S.warnColor,y:.031,renderOrder:9});return yt.mesh.name=`dummy-ground-warn-${Z.id}`,o.add(yt.mesh),yt}),j=_d({color:S.playerColor,y:.042,renderOrder:3});j.group.name="player-landing-preview",o.add(j.group);const st=new Zt,ft=new Zt(S.playerColor),_t=new Zt(S.neutralColor),Y=new Zt(S.lowThreatColor),tt=new Zt(S.highThreatColor),mt=new Zt(S.meterColorCharge),J=new Zt(S.meterColorChannel),gt=new Zt(S.meterColorCooldown),Ut=new Zt(S.warnColor),Dt=new xe;o.add(Dt);const Mt=e.projectiles;function Pt(){const yt=document.createElement("canvas");yt.width=64,yt.height=64;const Et=yt.getContext("2d");if(Et){const Yt=Et.createRadialGradient(32,32,0,32,32,32);Yt.addColorStop(0,"rgba(255,255,255,1)"),Yt.addColorStop(.28,"rgba(255,255,255,0.72)"),Yt.addColorStop(.62,"rgba(255,255,255,0.22)"),Yt.addColorStop(1,"rgba(255,255,255,0)"),Et.fillStyle=Yt,Et.fillRect(0,0,64,64)}const qt=new Rc(yt);return qt.colorSpace=je,qt}function Ct(){const Et=document.createElement("canvas");Et.width=2,Et.height=64;const qt=Et.getContext("2d");if(qt){const se=qt.createLinearGradient(0,0,0,64);se.addColorStop(0,"rgba(255,255,255,0)"),se.addColorStop(.55,"rgba(255,255,255,0.35)"),se.addColorStop(1,"rgba(255,255,255,0.95)"),qt.fillStyle=se,qt.fillRect(0,0,2,64)}const Yt=new Rc(Et);return Yt.colorSpace=je,Yt}const G=Pt(),te=Ct(),Ft=new Be({color:12577023,transparent:!0,opacity:0,side:Te,depthWrite:!1}),Nt=new Be({color:14217983,transparent:!0,opacity:0,side:Te,depthWrite:!1,blending:Ei}),Lt=new xe;Lt.position.set(0,.95,.72),Dt.add(Lt);const Rt=new xe;Rt.rotation.x=SS(e.camera.pitchDeg),Lt.add(Rt);const It=new yr(.78,Mt.slashThickness,6,28,Math.PI*1.15),D=new xe,b=new re(It,Ft),W=new re(It,Nt);W.scale.setScalar(1.09),W.renderOrder=4,D.add(b,W),Rt.add(D);const lt=new Tn(Mt.arrowWidth,Mt.arrowWidth,Mt.arrowLength),ht=new rl(Mt.arrowHeadSize*.42,Mt.arrowHeadSize,4);ht.rotateX(Math.PI/2);const rt=new Tn(Mt.arrowWidth*2.6,Mt.arrowWidth*.4,.1),zt=new Zs(Mt.arrowWidth*.45,Mt.arrowWidth*1.3,Mt.trailLength,6,1,!0);zt.rotateX(-Math.PI/2),zt.translate(0,0,-Mt.trailLength/2);const Q=Array.from({length:10},()=>{const Z=new xe,yt=new Be({color:Mt.arrowColor,transparent:!0}),Et=new Be({color:Mt.arrowHeadColor,transparent:!0}),qt=new Tc({map:G,color:Mt.arrowColor,transparent:!0,opacity:.85,blending:Ei,depthWrite:!1}),Yt=new Be({color:Mt.arrowTrailColor,map:te,transparent:!0,opacity:0,blending:Ei,depthWrite:!1,side:Te}),se=new re(lt,yt),ue=new re(ht,Et);ue.position.z=Mt.arrowLength/2+Mt.arrowHeadSize*.42;const ye=new re(rt,Et),Ne=new re(rt,Et);ye.position.z=-Mt.arrowLength/2+.08,Ne.position.z=ye.position.z,Ne.rotation.z=Math.PI/2;const de=new Qh(qt);de.scale.setScalar(Mt.arrowGlowSize),de.renderOrder=6;const an=new re(zt,Yt);return an.renderOrder=5,Z.add(se,ue,ye,Ne,de,an),Z.visible=!1,o.add(Z),{group:Z,shaftMat:yt,tipMat:Et,glowMat:qt,trailMat:Yt,glow:de,trail:an}}),xt=new cl(1,0),Wt=new V(Mt.boltShapeX,Mt.boltShapeY,Mt.boltShapeZ),nt=new Be({color:Mt.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),At=new Tc({map:G,color:Mt.boltGlowColor,transparent:!0,opacity:.45,blending:Ei,depthWrite:!1}),O=new Be({color:Mt.boltGlowColor,map:te,transparent:!0,opacity:Mt.trailOpacity,blending:Ei,depthWrite:!1,side:Te}),at=new Zs(.5,.03,Mt.boltTrailScale,6,1,!0);at.rotateX(-Math.PI/2),at.translate(0,0,-Mt.boltTrailScale/2);const ut=Array.from({length:24},()=>{const Z=new xe,yt=new re(xt,nt);yt.scale.copy(Wt);const Et=new Qh(At);Et.scale.setScalar(Mt.boltGlowScale),Et.renderOrder=6;const qt=new re(at,O);return qt.renderOrder=5,Z.add(yt,Et,qt),Z.visible=!1,o.add(Z),{group:Z,core:yt}}),Ot=Array.from({length:6},()=>{const Z=_d({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return Z.group.visible=!1,o.add(Z.group),Z}),Ht=e.dash,$t=new Js(Ht.ringRadius-.06,Ht.ringRadius,28),z=Array.from({length:6},()=>{const Z=new Be({color:16777215,transparent:!0,opacity:0,side:Te,depthWrite:!1}),yt=new re($t,Z);return yt.rotation.x=-Math.PI/2,yt.visible=!1,o.add(yt),{mesh:yt,mat:Z,life:0,base:1}});function St(Z,yt,Et,qt,Yt){const se=z.find(ue=>ue.life<=0)??z[0];se.mat.color.set(qt),se.mesh.position.set(Z,Et+.04,yt),se.base=Yt,se.mesh.scale.setScalar(Yt*.6),se.mesh.visible=!0,se.mat.opacity=.9,se.life=Ht.fxDuration}const K=e.links,ot=new Js(K.ringRadius-.07,K.ringRadius,28),bt=Array.from({length:5},()=>{const Z=new Be({color:K.chargeColor,transparent:!0,opacity:0,side:Te,depthWrite:!1}),yt=new re(ot,Z);return yt.rotation.x=-Math.PI/2,yt.visible=!1,o.add(yt),{mesh:yt,mat:Z,life:0,base:1}});function wt(Z,yt,Et,qt){const Yt=bt.find(se=>se.life<=0)??bt[0];Yt.mesh.position.set(Z,Et+.05,yt),Yt.base=qt,Yt.mesh.scale.setScalar(qt*.55),Yt.mesh.visible=!0,Yt.mat.opacity=.85,Yt.life=K.fxDuration}let Xt=t.playerLink.id,Kt=t.playerLink.hitIds.length,ce=t.dash.id,jt="none";const ie=YM(e.camera,e.smartCamera,e.zoom,s/a),_e=t.character.position;ie.update(_e.x,_e.y,_e.z,1,t.camera);function Ge(Z,yt){if(y.length===0)return 0;const Et=r.domElement.getBoundingClientRect(),qt=new Bt((Z-Et.left)/Et.width*2-1,-((yt-Et.top)/Et.height)*2+1);P.setFromCamera(qt,ie.camera);const Yt=P.intersectObjects(y,!0);for(const se of Yt){const ue=se.object.userData.dummyId;if(ue&&ue>0)return ue}return 0}function Fe(Z,yt,Et){const qt=r.domElement.getBoundingClientRect(),Yt=new V(Z,yt,Et).project(ie.camera);return{x:qt.left+(Yt.x*.5+.5)*qt.width,y:qt.top+(-Yt.y*.5+.5)*qt.height}}return{gaitDebug(){return v.gaitDebug()},render(Z,yt){const Et=Z.character,qt=Z.combat;g.position.set(Et.position.x,Et.position.y,Et.position.z),g.rotation.y=Et.bodyYaw;const Yt=Z.dash.phase==="active"&&Z.dash.kind==="roll",se=Yt&&Z.dash.duration>0?Math.min(1,1-Z.dash.timer/Z.dash.duration):0;x.rotation.x=Yt?se*Math.PI*2:0,x.position.y=m-(Yt?.2*Math.sin(Math.PI*se):0),v.update(Et,qt,Z.playerHurt,yt,Z.abilities.channeling,Z.time,Z.playerLink,Z.turnInPlace);for(let et=0;et<_.length;et++)Z.dummies[et]&&_[et].update(Z.dummies[et],yt);const ue=ie.camera.position,ye=Math.atan2(ue.x-Et.position.x,ue.z-Et.position.z),Ne=Z.config.gaze.hurtHoldSec,de=Z.time-Z.playerHurt.lastAt,an=Ne>0&&de>=0&&de<Ne?1-de/Ne:0,dn=pS(Z.gaze.active,Z.gaze.threat,an,Z.time,S);mS(st,ft,Y,tt,dn.level),U=MS(Et.grounded,Et.position.y,U),F.mesh.position.set(Et.position.x,U+.028,Et.position.z),F.update(dn.arcRad,dn.opacity,dn.scale,st,ye);const T=Z.config.abilities.arcane,$=Math.max(1,Math.floor(T.waves)),I=Math.max(1e-4,T.waveInterval),N=vS({charging:qt.charging,charge:qt.charge,channeling:Z.abilities.channeling,fireTimer:Z.abilities.fireTimer,fireInterval:I,channelProgress:Z.abilities.channeling?(Z.abilities.waveIndex+(1-Math.min(1,Math.max(0,Z.abilities.fireTimer/I))))/$:0,arcaneCooldown:Z.abilities.cooldown,arcaneCooldownMax:T.cooldown,dashCooldown:Z.dash.cooldown,dashCooldownMax:Z.dash.kind==="blink"?Z.config.dash.blinkCooldown:Z.config.dash.rollCooldown});H.mesh.position.set(Et.position.x,Et.position.y+.03,Et.position.z),H.set(N.ratio,N.source==="none"?0:S.meterOpacity,N.source==="charge"?mt:N.source==="channel"?J:gt,ye);const k=Z.playerLink,it=k.weapon?Z.config.links.moves[k.weapon]:void 0,dt=_S(k.phase,Et.position.x,Et.position.z,k.facing,k.travel,(it==null?void 0:it.hit.radius)??.9);j.set(dt.x,dt.z,.042,dt.radius,dt.active?S.landingOpacity:0,Z.time);for(let et=0;et<B.length;et++){const ct=Z.dummies[et],vt=B[et],Gt=L[et],Jt=q[et];if(!ct){vt.mesh.visible=!1,Gt.mesh.visible=!1,Jt.mesh.visible=!1;continue}const oe=Z.targeting.hasTarget&&Z.targeting.targetId===ct.id;if(Ap(Z,ct)){const Ve=Tp(Z,ct);st.copy(Y).lerp(tt,Ve)}else st.copy(_t);const be=xS(ct.attackPhase,ct.attackPhaseTimer,Z.config.dummies.attackWindup);be.active?(st.lerp(Ut,.5*be.urgency),Jt.mesh.position.set(ct.position.x,ct.position.y+.031,ct.position.z),Jt.set(be.ratio,S.warnOpacity*(.65+.35*be.urgency),Ut,ye)):Jt.set(0,0,Ut,ye);const Qt=oe?1:0,Vt=Qt>C[et]?S.haloFadeInSec:S.haloFadeOutSec;C[et]=yd(C[et],Qt,yt,Vt);const Ce=C[et],ae=1+.02*Ce*Math.sin(Z.time*2.2+ct.id),Ee=S.arcDeg+(S.selectedArcDeg-S.arcDeg)*Ce;vt.mesh.position.set(ct.position.x,ct.position.y+.022,ct.position.z),vt.update(Ee*Math.PI/180,S.opacity+(S.selectedOpacity-S.opacity)*Ce,1+(S.selectedScale-1)*Ce*ae,st,ye,1+(S.selectedThicknessScale-1)*Ce),X[et]=yd(X[et],Qt,yt,Qt>X[et]?S.haloFadeInSec:S.haloFadeOutSec);const vn=X[et];Gt.mesh.position.set(ct.position.x,ct.position.y+.019,ct.position.z),Gt.update(Ee*Math.PI/180,S.haloOpacity*vn*(.88+.12*Math.sin(Z.time*2.2+ct.id)),S.selectedScale*(.94+.06*vn)*ae,st,ye)}if(Dt.position.set(Et.position.x,Et.position.y,Et.position.z),Dt.rotation.y=qt.phase!=="idle"?qt.attackFacing:Et.bodyYaw,Z.dash.id!==ce){ce=Z.dash.id;const et=Z.dash;jt=et.kind,et.kind==="blink"?(St(et.fromX,et.fromZ,Et.position.y,Ht.blinkColor,.9),St(et.toX,et.toZ,Et.position.y,Ht.blinkColor,1.35)):St(et.fromX,et.fromZ,Et.position.y,Ht.rollColor,1.1)}for(const et of z){if(et.life<=0)continue;et.life-=yt;const ct=Math.max(0,et.life/Ht.fxDuration);et.mat.opacity=.9*ct,et.mesh.scale.setScalar(et.base*(.6+(1-ct)*1.2)),et.life<=0&&(et.mesh.visible=!1)}const pt=Z.playerLink;pt.id!==Xt&&(Xt=pt.id,Kt=pt.hitIds.length,wt(Et.position.x,Et.position.z,Et.position.y,1)),pt.hitIds.length>Kt?(Kt=pt.hitIds.length,wt(Et.position.x,Et.position.z,Et.position.y,1.35)):pt.hitIds.length<Kt&&(Kt=pt.hitIds.length);for(const et of bt){if(et.life<=0)continue;et.life-=yt;const ct=Math.max(0,et.life/Math.max(K.fxDuration,1e-6));et.mat.opacity=.85*ct,et.mesh.scale.setScalar(et.base*(.55+(1-ct)*1.1)),et.life<=0&&(et.mesh.visible=!1)}const Tt=qt.phase==="active"&&qt.comboIndex>0;Ft.opacity=Tt?.9:0,Nt.opacity=Tt?Mt.slashGlowOpacity:0,Tt&&(D.rotation.z=-1.2+qt.attackProgress*3.2,D.scale.setScalar(.9+qt.comboIndex*.13));for(let et=0;et<ut.length;et++){const ct=Z.abilities.projectiles[et],vt=ut[et];vt.group.visible=!!ct,ct&&(vt.group.position.set(ct.x,ct.y,ct.z),vt.group.scale.setScalar(ct.radius),vt.group.rotation.y=Math.atan2(ct.dirX,ct.dirZ),vt.core.rotation.y+=yt*6)}for(let et=0;et<Ot.length;et++){const ct=Z.abilities.rings[et],vt=Ot[et];if(!ct){vt.group.visible=!1;continue}const Gt=Math.max(0,Math.min(1,ct.life/Math.max(ct.duration,1e-6))),Jt=yS(Math.max(0,ct.duration-ct.life),S.areaExpandSec);vt.set(ct.x,ct.z,.045,ct.radius*Jt.scale,S.areaOpacity*(.35+.65*Gt)*Jt.alpha,Z.time)}for(let et=0;et<Q.length;et++){const ct=Z.arrows[et],vt=Q[et];if(vt.group.visible=!!ct,!ct)continue;vt.group.position.set(ct.x,ct.y,ct.z),vt.group.rotation.set(ct.pitch,ct.yaw,0,"YXZ");const Gt=ct.stuck?Math.min(1,ct.rest/.6):1;vt.shaftMat.opacity=Gt,vt.tipMat.opacity=Gt,vt.glowMat.opacity=(ct.stuck?.28:.85)*Gt,vt.trailMat.opacity=ct.stuck?0:Mt.trailOpacity*Gt,vt.trail.visible=!ct.stuck}ie.update(Et.position.x,Et.position.y,Et.position.z,yt,Z.camera),r.render(o,ie.camera)},resize(){const Z=Math.max(1,n.clientWidth),yt=Math.max(1,n.clientHeight);r.setSize(Z,yt,!1),ie.resize(Z/yt)},getGroundBasis(){return ie.getGroundBasis()},setCollidersVisible(Z){for(const yt of h)yt.opacity=Z?.3:1,yt.wireframe=Z,yt.needsUpdate=!0},setGridVisible(Z){u.visible=Z},setLabVisible(Z){p.setVisible(Z)},setLabLabelsVisible(Z){p.setLabelsVisible(Z)},snapCamera(Z,yt,Et){ie.snap(Z,yt,Et)},setZoom(Z){ie.setZoom(Z)},pickDummy:Ge,projectToScreen:Fe,diagnostics(){const Z=Yu(e.camera.pitchDeg),yt=bS(Z,Dt.rotation.y);return{lean:v.lean(),slashNormal:yt,arrowForward:v.arrowDirection(),gait:{hipYaw:v.hipYaw(),gaitYaw:v.gaitYaw()},attackBlend:v.attackBlend(),attackWeights:v.attackWeights(),landing:v.landing(),hurt:v.hurt(),ik:v.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:x.rotation.x,activeRings:z.filter(Et=>Et.life>0).length,lastKind:jt},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...ie.smart()}}},dispose(){v.dispose(),p.dispose();for(const Z of _)Z.dispose();F.dispose();for(const Z of B)Z.dispose();for(const Z of L)Z.dispose();H.dispose();for(const Z of q)Z.dispose();j.dispose(),It.dispose(),Ft.dispose(),Nt.dispose(),xt.dispose(),nt.dispose(),At.dispose(),O.dispose(),at.dispose();for(const Z of Ot)Z.dispose();lt.dispose(),ht.dispose(),rt.dispose(),zt.dispose();for(const Z of Q)Z.shaftMat.dispose(),Z.tipMat.dispose(),Z.glowMat.dispose(),Z.trailMat.dispose();G.dispose(),te.dispose();for(const Z of z)Z.mat.dispose();$t.dispose();for(const Z of bt)Z.mat.dispose();ot.dispose(),f.traverse(Z=>{Z instanceof re&&Z.geometry.dispose()}),r.dispose(),r.domElement.remove()}}}async function DS(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function IS(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function kS(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),s=i("diag-status"),a=i("diag-text"),r=i("diag-copy"),o=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,p=0;function v(){const x=n.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=x.enabled?"暂停记录":"继续记录"}function g(x){d=x,e.hidden=!x,x?v():a.hidden=!0}function m(x){r.textContent=x,window.clearTimeout(p),p=window.setTimeout(()=>{r.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),r.addEventListener("click",()=>{const x=n.summary();DS(x).then(_=>{_?(m("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),m("请长按全选复制"))})}),o.addEventListener("click",()=>{const x=n.dump(),_=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);IS(`harness-${x.meta.version}-${_}.json`,JSON.stringify(x)),m("已导出")}),c.addEventListener("click",()=>{n.clear(),a.hidden=!0,v(),m("已清空")}),l.addEventListener("click",()=>{u=!u,n.setEnabled(u),v()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),d&&v()},isOpen:()=>d,close:()=>g(!1)}}const US={intents:{...Md},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function FS(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Cp(lm,ra),i=LS(n,e,rn,ra.stations),s=Lp(e),a=Gm(t),r=Vm(t),o=document.getElementById("version-badge");o&&(o.textContent="v0.9.38 · 11-07 19:09 · 诊断");const c=U=>String(U).padStart(2,"0"),l=new Date,h=sm({meta:{version:"v0.9.38",buildTime:"11-07 19:09",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=kS(h,o),d=Om({deadZone:()=>rn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:rn.showColliders,showGrid:rn.showGrid,showLab:rn.lab.enabled,showLabLabels:rn.lab.showLabels};let p=1;const v=Yp({maxRadiusPx:()=>rn.joystick.maxRadiusPx,deadZone:rn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>rn.zoom}),g=Array.from(document.querySelectorAll(".wp[data-weapon]"));let m=e.combat.weapon;function x(U){if(U===m)return;m=U;const F=Pi.indexOf(U)+1;for(const B of g)B.classList.toggle("is-active",Number(B.dataset.weapon)===F);S.refreshWeapon()}let _=US,y=0;const P=()=>{p=1,i.setZoom(1)},S=Sm(e,rn,u,{singleStep:()=>s.singleStep(_.intents),reset:()=>{p=1,s.singleStep({...Md,resetPressed:!0})},resetZoom:P,onToggleColliders:U=>i.setCollidersVisible(U),onToggleGrid:U=>i.setGridVisible(U),onToggleLab:U=>i.setLabVisible(U),onToggleLabLabels:U=>i.setLabLabelsVisible(U)}),w=wm({stations:ra.stations??[],world:e,view:i,onResetZoom:P});r.register({motion:d,debug:S.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:v,viewConfig:rn,debug:u,getUserZoom:()=>p,getGestures:()=>_.gestures,getLastGesture:()=>_.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),lab:{stations:ra.stations??[],goto:U=>w.goto(U),current:()=>w.current(),recall:()=>w.recall()}};let A=performance.now(),E=60,M=0;function R(U){const F=Math.min((U-A)/1e3,.1);A=U,F>0&&(E=E*.9+1/F*.1);const B=v.sample();B.intents.resetPressed&&(p=1),p=Np(p,B.zoomScale,rn.zoom.min,rn.zoom.max),i.setZoom(p);let L=B.intents.dummyClickId;if(B.tap){const H=i.pickDummy(B.tap.x,B.tap.y);H>0&&(L=H)}L>0&&(y=L),_={...B,intents:{...B.intents,dummyClickId:y}};const C=s.frame(F,_.intents,u.timeScale,u.paused,()=>{const H=e.events;for(let q=0;q<H.length;q++)h.event(H[q],e.time)});C>0&&(y=0),h.sample(e,_,F*1e3,C);for(const H of _.gestures)h.gesture(H);U-M>250&&(M=U,f.tick()),x(e.combat.weapon),i.render(e,F),w.tick(),d.update(e,_,i.getGroundBasis());const X=i.diagnostics();a.update(e,E,C,_,u,{attackBlend:X.attackBlend,attackWeights:X.attackWeights,landing:X.landing,hurt:X.hurt,ik:X.ik,zoom:X.camera.zoom},r.hudCompact()),requestAnimationFrame(R)}requestAnimationFrame(R)}FS();

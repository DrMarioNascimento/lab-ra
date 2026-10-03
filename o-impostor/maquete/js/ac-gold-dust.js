(function(global){
'use strict';
global.createACGoldDust=function(parent,{reduced=false,capacity=192}={}){
 const positions=new Float32Array(capacity*3),lives=new Float32Array(capacity),velocities=new Float32Array(capacity*3),ages=new Float32Array(capacity),durations=new Float32Array(capacity);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geometry.setAttribute('life',new THREE.BufferAttribute(lives,1).setUsage(THREE.DynamicDrawUsage));
 const material=new THREE.ShaderMaterial({uniforms:{height:{value:800}},transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,
 vertexShader:`attribute float life; varying float glow; uniform float height;
 void main(){glow=life;vec4 p=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*p;gl_PointSize=life>0.0?clamp(.012*length(modelViewMatrix[0].xyz)*height/max(.02,-p.z),1.0,18.0):0.0;}`,
 fragmentShader:`varying float glow; void main(){float r=length(gl_PointCoord-.5)*2.0;float a=pow(max(0.0,1.0-r),2.0)*glow;if(a<.005)discard;gl_FragColor=vec4(mix(vec3(1.0,.46,.05),vec3(1.0,.93,.55),a),a);}`});
 const points=new THREE.Points(geometry,material);points.frustumCulled=false;points.userData.exportExclude=true;points.raycast=()=>{};parent.add(points);
 let cursor=0,previous=null;
 function emit(position,burst=false){const i=cursor++%capacity,j=i*3;positions[j]=position.x;positions[j+1]=position.y;positions[j+2]=position.z;ages[i]=0;durations[i]=reduced?.25:.45+Math.random()*.4;lives[i]=1;const speed=burst?.12:.035;velocities[j]=(Math.random()-.5)*speed;velocities[j+1]=(Math.random()-.25)*speed;velocities[j+2]=(Math.random()-.5)*speed;}
 function burst(position){for(let i=0;i<(reduced?5:36);i++)emit(position,true);}
 function trace(position){
  if(!position||reduced){previous=null;return;}
  if(!previous){previous=position.clone();return;}
  const distance=previous.distanceTo(position),steps=Math.floor(distance/.006),count=Math.min(28,steps);
  if(!count)return;
  const end=steps>28?position.clone():previous.clone().lerp(position,count*.006/distance);
  for(let i=1;i<=count;i++)emit(previous.clone().lerp(end,i/count));
  previous=end;
 }
 function update(dt,position,height){material.uniforms.height.value=height;trace(position);
  for(let i=0;i<capacity;i++){if(!lives[i])continue;ages[i]+=dt;lives[i]=Math.max(0,1-ages[i]/durations[i]);const j=i*3;positions[j]+=velocities[j]*dt;positions[j+1]+=velocities[j+1]*dt;positions[j+2]+=velocities[j+2]*dt;}
  geometry.attributes.position.needsUpdate=true;geometry.attributes.life.needsUpdate=true;
 }
 return {burst,update,trace,resetTrail(){previous=null;},dispose(){parent.remove(points);geometry.dispose();material.dispose();}};
};
})(window);

"use strict";
/* Q-SIM terrain extension: elevations are queried only on explicit click.
   The hydraulic grade line assumes steady flow and distributed head losses. */
const Terrain=(function(){
 let profile=[],source="",pending=false,token=0,probeIndex=0,inspectionMarker=null;
 const fmt=(n,d=1)=>Number(n).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
 const msg=(s)=>{document.getElementById("terrainStatus").textContent=s};
 function cumulative(points){let total=0;return points.map((p,i)=>{if(i)total+=distance(points[i-1],p);return {...p,s:total}})}
 function sample(points,count=80){
  const path=cumulative(points),total=path.at(-1).s;
  if(!(total>0))throw Error("O caminho não possui comprimento válido.");
  let j=1;return Array.from({length:count},(_,i)=>{const s=total*i/(count-1);
   while(j<path.length-1&&path[j].s<s)j++;
   const a=path[j-1],b=path[j],t=b.s>a.s?(s-a.s)/(b.s-a.s):0;
   return {lat:a.lat+(b.lat-a.lat)*t,lon:a.lon+(b.lon-a.lon)*t,s};
  });
 }
 function clear(announce=true){token++;profile=[];source="";probeIndex=0;document.getElementById("profileSummary").textContent="Aguardando cotas topográficas.";document.getElementById("pressureSummary").textContent="A linha piezométrica depende de um perfil com altitudes válidas.";document.getElementById("hydraulicAlerts").textContent="Alertas aguardando dados topográficos e parâmetros hidráulicos.";document.getElementById("probeReadout").textContent="Selecione um ponto pelo gráfico ou controle deslizante.";if(inspectionMarker&&map){map.removeLayer(inspectionMarker);inspectionMarker=null;}if(announce)msg("Importe um KML e clique em Obter altitudes.");}
 function initialKML(){
  clear(false);
  if(route.length<2){msg("Nenhum percurso carregado.");return;}
  const valid=route.every(p=>Number.isFinite(p.z))&&route.some(p=>Math.abs(p.z)>0);
  if(valid){profile=cumulative(route);source="Cotas declaradas no arquivo KML";msg("Cotas do KML disponíveis. Use Obter altitudes para consultar um MDE público e comparar.");render();}
  else msg("KML sem cotas úteis. Clique em Obter altitudes para gerar o perfil automaticamente.");
 }
 async function retrieve(){
  if(pending)return;
  if(route.length<2){msg("Importe um arquivo KML com um caminho antes de consultar as altitudes.");return;}
  pending=true;const button=document.getElementById("fetchTerrain");button.disabled=true;
  const thisToken=++token;
  try{
   const sampled=sample(route,80);
   msg("Consultando elevação do terreno (Copernicus GLO-90, 80 amostras)…");
   const latitudes=sampled.map(p=>p.lat.toFixed(6)).join(",");
   const longitudes=sampled.map(p=>p.lon.toFixed(6)).join(",");
   const url="https://api.open-meteo.com/v1/elevation?latitude="+encodeURIComponent(latitudes)+"&longitude="+encodeURIComponent(longitudes);
   const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),20000);
   let response;try{response=await fetch(url,{signal:ctl.signal,mode:"cors"});}finally{clearTimeout(timer)}
   if(!response.ok)throw Error("Serviço Open-Meteo indisponível (HTTP "+response.status+").");
   const data=await response.json();
   if(!Array.isArray(data.elevation)||data.elevation.length!==sampled.length||data.elevation.some(z=>!Number.isFinite(z)))throw Error("O serviço não retornou cotas válidas para todo o percurso.");
   if(thisToken!==token)return;
   profile=sampled.map((p,i)=>({...p,z:data.elevation[i]}));
   source="Copernicus DEM GLO-90 · Open-Meteo";
   const dz=profile.at(-1).z-profile[0].z;
   document.getElementById("rise").value=dz.toFixed(2);
   msg("Perfil obtido: 80 amostras do Copernicus GLO-90 (90 m). Desnível geométrico atualizado automaticamente. Confirme datum, direção e resolução do modelo.");
   calculate();render();
  }catch(e){if(thisToken===token){msg("Consulta de altitudes falhou: "+(e.name==="AbortError"?"tempo limite de 20 segundos":e.message)+". Verifique conexão, bloqueadores e disponibilidade da Open-Meteo; ou use cotas do KML/desnível manual.");if(!profile.length){render();}}}
  finally{pending=false;button.disabled=false}
 }

 // Profiles are indexed by increasing distance from the selected CAPTAÇÃO.
 function reverse(){
  if(route.length<2){msg("Importe um KML antes de inverter o sentido.");return}
  if(pending){msg("Aguarde a consulta de elevações terminar antes de inverter.");return}
  route.reverse();probeIndex=0;
  if(profile.length){profile=cumulative(profile.slice().reverse());}
  else if(route.every(p=>Number.isFinite(p.z))&&route.some(p=>p.z!==0)){profile=cumulative(route);source="Cotas declaradas no arquivo KML";}
  if(profile.length>=2){document.getElementById("rise").value=(profile.at(-1).z-profile[0].z).toFixed(2)}
  else {document.getElementById("rise").value=(-Number(document.getElementById("rise").value)).toFixed(2)}
  document.getElementById("directionStatus").textContent="Sentido invertido: o primeiro ponto agora é captação (verde) e o último é pivô (laranja). Confira as posições.";
  repaintMap();calculate();render();msg(profile.length?"Sentido invertido mantendo as cotas disponíveis; cálculos atualizados.":"Sentido invertido; desnível manual teve o sinal alterado. Verifique se a captação foi corretamente definida.");
 }
 function hydraulics(p,total){
  if(!last||!(Number(document.getElementById("pressure").value)>0))return null;
  const head=profile.at(-1).z+last.residual+(last.hf+last.hm)*(1-p.s/total)-p.z;
  return {head,hgl:p.z+head,bar:head/10.19716213};
 }
 function plot(){
  const svg=document.getElementById("profile");svg.replaceChildren();
  const ns="http://www.w3.org/2000/svg";
  function add(tag,props,label){const el=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(props))el.setAttribute(k,v);if(label!==undefined)el.textContent=label;svg.appendChild(el);return el}
  if(profile.length<2){add("text",{x:25,y:115,fill:"#bad1d7"},"Sem altitudes válidas para este trajeto.");return}
  const total=profile.at(-1).s||1,zmin=Math.min(...profile.map(p=>p.z)),zmax=Math.max(...profile.map(p=>p.z));
  const hydraulic=profile.map(p=>hydraulics(p,total)),hasHGL=hydraulic.every(Boolean);
  const lo=Math.min(zmin,...(hasHGL?hydraulic.map(p=>p.hgl):[])),hi=Math.max(zmax,...(hasHGL?hydraulic.map(p=>p.hgl):[]));
  const span=Math.max(hi-lo,1),coord=(p,z)=>[54+p.s/total*766,200-(z-lo)/span*160];
  for(let i=0;i<=4;i++){const v=lo+i*span/4,y=200-40*i;add("line",{x1:54,y1:y,x2:820,y2:y,stroke:"#325866"});add("text",{x:5,y:y+4,fill:"#b7d4db","font-size":11},fmt(v,0))}
  add("polyline",{points:profile.map(p=>coord(p,p.z).join(",")).join(" "),stroke:"#42d5a7",fill:"none","stroke-width":3});
  if(hasHGL)add("polyline",{points:profile.map((p,i)=>coord(p,hydraulic[i].hgl).join(",")).join(" "),stroke:"#ffcb73",fill:"none","stroke-width":2.5,"stroke-dasharray":"7 4"});
  add("text",{x:54,y:19,fill:"#42d5a7","font-size":13},"Terreno");
  add("text",{x:148,y:19,fill:hasHGL?"#ffcb73":"#eac88a","font-size":12},hasHGL?"Linha piezométrica estimada":"Informe pressão do pivô (>0 bar) para simular a linha");
  add("text",{x:720,y:233,fill:"#cde0e3","font-size":12},fmt(total,0)+" m");
  // Highlight the sample selected with mouse, touch or keyboard range input.
  probeIndex=Math.max(0,Math.min(profile.length-1,probeIndex));
  const p=profile[probeIndex],xy=coord(p,p.z);
  add("line",{x1:xy[0],x2:xy[0],y1:36,y2:204,stroke:"#c0e7f2","stroke-dasharray":"3 3","stroke-width":1.5});
  add("circle",{cx:xy[0],cy:xy[1],r:5,fill:"#f7fbff",stroke:"#42d5a7","stroke-width":2});
  if(hasHGL){const h=coord(p,hydraulic[probeIndex].hgl);add("circle",{cx:h[0],cy:h[1],r:4,fill:"#ffcb73"});}
  const hit=add("rect",{x:54,y:35,width:766,height:172,fill:"transparent",style:"cursor:crosshair"});
  const handle=event=>{const bounds=svg.getBoundingClientRect(),x=(event.clientX-bounds.left)*850/bounds.width;const idx=profile.reduce((best,p,i)=>Math.abs(54+p.s/total*766-x)<Math.abs(54+profile[best].s/total*766-x)?i:best,0);inspect(idx)};
  hit.addEventListener("pointermove",event=>{if(event.pointerType==="mouse")handle(event)});
  hit.addEventListener("click",handle);
 }
 function inspect(i){
  if(profile.length<2)return;
  probeIndex=Math.max(0,Math.min(profile.length-1,Number(i)||0));
  const p=profile[probeIndex],total=profile.at(-1).s,fluid=hydraulics(p,total);
  document.getElementById("profileProbe").max=String(profile.length-1);
  document.getElementById("profileProbe").value=String(probeIndex);
  document.getElementById("probeReadout").textContent="Distância "+fmt(p.s,0)+" m · Terreno "+fmt(p.z)+" m"+(fluid?" · Piezométrica "+fmt(fluid.hgl)+" m · Pressão "+fmt(fluid.head)+" mca ("+fmt(fluid.bar,2)+" bar)":" · Pressão: informar valor exigido no pivô.");
  if(map&&window.L){if(inspectionMarker)map.removeLayer(inspectionMarker);inspectionMarker=L.circleMarker([p.lat,p.lon],{radius:6,color:"#fff",weight:2,fillColor:"#ffcb73",fillOpacity:1,interactive:false}).addTo(map);}
  plot();
 }
 function peaks(){
  // Peaks are preliminary candidates, not definitive air-valve installation locations.
  if(profile.length<3)return[];
  const candidates=[];
  for(let i=1;i<profile.length-1;i++){
   const p=profile[i],left=profile[Math.max(0,i-3)],right=profile[Math.min(profile.length-1,i+3)];
   const prominence=p.z-Math.max(left.z,right.z);
   if(p.z>=profile[i-1].z&&p.z>profile[i+1].z&&prominence>=2)candidates.push(p);
  }
  const max=profile.reduce((a,b)=>a.z>b.z?a:b);
  if(max.s>50&&max.s<profile.at(-1).s-50&&!candidates.some(p=>Math.abs(p.s-max.s)<75))candidates.push(max);
  return candidates.slice(0,8);
 }
 function render(){
  plot();
  if(profile.length<2){document.getElementById("profileSummary").textContent="Sem perfil disponível.";document.getElementById("pressureSummary").textContent="Cálculos de pressão distribuída indisponíveis.";document.getElementById("hydraulicAlerts").textContent="Alertas aguardando dados topográficos e parâmetros hidráulicos.";return}
  const low=profile.reduce((a,b)=>a.z<b.z?a:b),high=profile.reduce((a,b)=>a.z>b.z?a:b),dz=profile.at(-1).z-profile[0].z,total=profile.at(-1).s;
  document.getElementById("profileStatus").textContent="Perfil altimétrico: "+source+". Cotas do terreno, não necessariamente do eixo da tubulação.";
  document.getElementById("profileSummary").textContent=source+" · Captação "+fmt(profile[0].z)+" m · Pivô "+fmt(profile.at(-1).z)+" m · Mín. "+fmt(low.z)+" m em "+fmt(low.s,0)+" m · Máx. "+fmt(high.z)+" m em "+fmt(high.s,0)+" m · Δz "+fmt(dz)+" m.";
  const candidates=peaks(),alerts=[];
  if(candidates.length)alerts.push("PONTOS ALTOS: "+candidates.map(p=>fmt(p.s,0)+" m ("+fmt(p.z)+" m)").join(", ")+". Avaliar risco de ar acumulado e necessidade de ventosas em projeto.");
  const pressureKnown=Number(document.getElementById("pressure").value)>0;
  if(!last||!pressureKnown){
   document.getElementById("pressureSummary").textContent="Pressão de entrada do pivô não informada: não é possível avaliar pressão local.";
   alerts.push("ALERTAS DE PRESSÃO INDISPONÍVEIS: informe a pressão de entrada do pivô (>0 bar).");
  }else{
   const pressure=profile.map(p=>({p,...hydraulics(p,total)}));
   const pmin=pressure.reduce((a,b)=>a.head<b.head?a:b),pmax=pressure.reduce((a,b)=>a.head>b.head?a:b);
   document.getElementById("pressureSummary").textContent="Pressão mínima estimada "+fmt(pmin.head)+" mca ("+fmt(pmin.bar,2)+" bar) em "+fmt(pmin.p.s,0)+" m; máxima "+fmt(pmax.head)+" mca ("+fmt(pmax.bar,2)+" bar) em "+fmt(pmax.p.s,0)+" m.";
   const negative=pressure.filter(x=>x.head<0);
   if(negative.length)alerts.push("PRESSÃO NEGATIVA: "+negative.length+" de "+profile.length+" amostras, mínima "+fmt(pmin.head)+" mca a "+fmt(pmin.p.s,0)+" m.");
   const limit=Number(document.getElementById("maxPressure").value);
   if(limit>0){
    const excessive=pressure.filter(x=>x.bar>limit);
    if(excessive.length)alerts.push("PRESSÃO ACIMA DO LIMITE INFORMADO ("+fmt(limit,1)+" bar): "+excessive.length+" amostras, máximo "+fmt(pmax.bar,2)+" bar em "+fmt(pmax.p.s,0)+" m.");
   }else alerts.push("Pressão excessiva não avaliada: limite admissível da tubulação não informado.");
  }
  const block=document.getElementById("hydraulicAlerts");
  block.textContent=alerts.length?alerts.join(" "):"Nenhum alerta nos critérios simplificados informados.";
  block.className=alerts.some(s=>s.includes("PRESSÃO NEGATIVA")||s.includes("PRESSÃO ACIMA DO LIMITE"))?"warning":"hint";
  inspect(probeIndex);
 }

 return {clear,initialKML,retrieve,render,reverse,inspect,getProfile:()=>profile};
})();
document.getElementById("fetchTerrain").addEventListener("click",Terrain.retrieve);

document.getElementById("profileProbe").addEventListener("input",e=>Terrain.inspect(Number(e.target.value)));

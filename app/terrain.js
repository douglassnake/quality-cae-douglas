"use strict";
/* Q-SIM terrain extension: elevations are queried only on explicit click.
   The hydraulic grade line assumes steady flow and distributed head losses. */
const Terrain=(function(){
 let profile=[],source="",pending=false,token=0;
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
 function clear(announce=true){token++;profile=[];source="";document.getElementById("profileSummary").textContent="Aguardando cotas topográficas.";document.getElementById("pressureSummary").textContent="A linha piezométrica depende de um perfil com altitudes válidas.";if(announce)msg("Importe um KML e clique em Obter altitudes.");}
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
 function graph(data){
  const svg=document.getElementById("profile");
  svg.replaceChildren();
  const ns="http://www.w3.org/2000/svg",add=(tag,props,label)=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(props))e.setAttribute(k,v);if(label!==undefined)e.textContent=label;svg.appendChild(e);return e};
  if(data.length<2){add("text",{x:25,y:115,fill:"#bad1d7"},"Sem altitudes válidas para este trajeto.");return}
  const total=data.at(-1).s||1,lo=Math.min(...data.map(p=>p.z)),hi=Math.max(...data.map(p=>p.z));
  const pressureKnown=Number(document.getElementById("pressure").value)>0;
  const hydraulic=(last&&Number.isFinite(last.hf)&&Number.isFinite(last.hm)&&Number.isFinite(last.residual)&&pressureKnown);
  const L=Number(document.getElementById("length").value);
  const zEnd=data.at(-1).z;
  const hgl=hydraulic?data.map(p=>zEnd+last.residual+(last.hf+last.hm)*(1-p.s/total)):null;
  const min=Math.min(lo,...(hgl||[])),max=Math.max(hi,...(hgl||[])),span=Math.max(max-min,1);
  const xy=(p,z)=>[54+p.s/total*766,200-(z-min)/span*160];
  for(let i=0;i<=4;i++){const v=min+i*span/4,y=200-i*40;add("line",{x1:54,y1:y,x2:820,y2:y,stroke:"#325866","stroke-width":1});add("text",{x:5,y:y+3,fill:"#b7d4db","font-size":11},fmt(v,0))}
  add("polyline",{points:data.map(p=>xy(p,p.z).join(",")).join(" "),fill:"none",stroke:"#42d5a7","stroke-width":3});
  if(hgl)add("polyline",{points:data.map((p,i)=>xy(p,hgl[i]).join(",")).join(" "),fill:"none",stroke:"#ffcb73","stroke-width":2.5,"stroke-dasharray":"7 4"});
  add("text",{x:54,y:19,fill:"#42d5a7","font-size":13},"Terreno");
  if(hgl)add("text",{x:148,y:19,fill:"#ffcb73","font-size":13},"Linha piezométrica (estimada)");
  else add("text",{x:148,y:19,fill:"#eac88a","font-size":12},"Informe pressão do pivô (>0 bar) para simular a linha");
  add("text",{x:685,y:233,fill:"#cde0e3","font-size":12},fmt(total,0)+" m");
 }
 function render(){
  graph(profile);
  if(profile.length>=2)document.getElementById("profileStatus").textContent="Perfil altimétrico: "+source+". Cotas do terreno, não necessariamente do eixo da tubulação.";
  if(profile.length<2){document.getElementById("profileSummary").textContent="Sem perfil disponível.";document.getElementById("pressureSummary").textContent="Cálculos de pressão distribuída indisponíveis.";return}
  const min=profile.reduce((a,b)=>a.z<b.z?a:b),max=profile.reduce((a,b)=>a.z>b.z?a:b),dz=profile.at(-1).z-profile[0].z;
  document.getElementById("profileSummary").textContent=source+" · Captação "+fmt(profile[0].z)+" m · Destino "+fmt(profile.at(-1).z)+" m · Mín. "+fmt(min.z)+" m em "+fmt(min.s,0)+" m · Máx. "+fmt(max.z)+" m em "+fmt(max.s,0)+" m · Δz "+fmt(dz)+" m.";
  if(!last||!(Number(document.getElementById("pressure").value)>0)){document.getElementById("pressureSummary").textContent="Pressão na entrada do pivô não informada: linha piezométrica e alertas de pressão indisponíveis.";return}
  const total=profile.at(-1).s,zEnd=profile.at(-1).z,loss=last.hf+last.hm;
  const pres=profile.map(p=>({p,head:zEnd+last.residual+loss*(1-p.s/total)-p.z}));
  const low=pres.reduce((a,b)=>a.head<b.head?a:b),high=pres.reduce((a,b)=>a.head>b.head?a:b);
  const negatives=pres.filter(x=>x.head<0);
  const caution=negatives.length?"ALERTA: pressão manométrica negativa estimada em "+negatives.length+" pontos amostrados. ":"";
  document.getElementById("pressureSummary").textContent=caution+"Pressão mínima estimada "+fmt(low.head)+" mca ("+fmt(low.head/10.19716)+" bar), a "+fmt(low.p.s,0)+" m · máxima "+fmt(high.head)+" mca ("+fmt(high.head/10.19716)+" bar). Modelo permanente: perdas locais distribuídas uniformemente, sem transientes, NPSH ou sucção.";
  document.getElementById("pressureSummary").className=negatives.length?"warning":"hint";
 }
 return {clear,initialKML,retrieve,render,getProfile:()=>profile};
})();
document.getElementById("fetchTerrain").addEventListener("click",Terrain.retrieve);

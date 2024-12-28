async function fetchSolarWindData(){try{const[a,t]=await Promise.all([fetch("https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json"),fetch("https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json")]),e=await a.json();return{plasmaData:e,magneticData:await t.json()}}catch(a){return null}}function processData(a,t=!0){const e=t?1:0;return{timestamps:a.slice(e).map((a=>new Date(a[0]))),values:a.slice(e)}}function createSolarWindChart(a,t){const e=document.getElementById("solarWindChart"),r=processData(a),s=processData(t);return e.height=800,new Chart(e,{type:"line",data:{labels:r.timestamps,datasets:[{label:"Bx (nT)",data:s.values.map((a=>({x:new Date(a[0]),y:a[1]}))),borderColor:"rgb(75, 192, 192)",segment:{borderColor:a=>(a.p0.parsed.y,"rgb(75, 192, 192)")}},{label:"By (nT)",data:s.values.map((a=>({x:new Date(a[0]),y:a[2]}))),borderColor:"rgb(255, 99, 132)",segment:{borderColor:a=>(a.p0.parsed.y,"rgb(255, 99, 132)")}},{label:"Bz (nT)",data:s.values.map((a=>({x:new Date(a[0]),y:a[3]}))),borderColor:"rgb(255, 205, 86)",segment:{borderColor:a=>(a.p0.parsed.y,"rgb(255, 205, 86)")}}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"nearest",axis:"x",intersect:!1},plugins:{title:{display:!0,text:"Solar Wind Parameters"}},scales:{x:{type:"time",time:{unit:"hour",displayFormats:{hour:"HH:mm"},tooltipFormat:"MM/dd HH:mm"},title:{display:!0,text:"UTC"},ticks:{maxRotation:0,autoSkip:!0,maxTicksLimit:12}},y:{title:{display:!0,text:"Value"},beginAtZero:!1}}}})}async function initializeChart(){const a=await fetchSolarWindData();if(a){createSolarWindChart(a.plasmaData,a.magneticData)}}document.addEventListener("DOMContentLoaded",(()=>{initializeChart()})),setInterval(initializeChart,3e5);
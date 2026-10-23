const DEMO = [
 {name:"Demo Fighter A",wins:18,losses:4,draws:0,sig_strikes_landed_per_min:5.2,sig_strikes_absorbed_per_min:3.7,striking_accuracy:.48,striking_defense:.58,takedown_avg_per_15:1.8,takedown_accuracy:.42,takedown_defense:.72,submission_avg_per_15:.5,reach_in:72,age:29,recent_form:0.72,promotion:"Demo",source:"Illustrative demo data"},
 {name:"Demo Fighter B",wins:15,losses:3,draws:1,sig_strikes_landed_per_min:4.1,sig_strikes_absorbed_per_min:2.9,striking_accuracy:.44,striking_defense:.63,takedown_avg_per_15:2.4,takedown_accuracy:.38,takedown_defense:.81,submission_avg_per_15:1.1,reach_in:74,age:31,recent_form:0.66,promotion:"Demo",source:"Illustrative demo data"},
 {name:"Demo Fighter C",wins:12,losses:6,draws:0,sig_strikes_landed_per_min:6.0,sig_strikes_absorbed_per_min:5.1,striking_accuracy:.51,striking_defense:.49,takedown_avg_per_15:.6,takedown_accuracy:.31,takedown_defense:.64,submission_avg_per_15:.2,reach_in:70,age:27,recent_form:0.55,promotion:"Demo",source:"Illustrative demo data"}
];
const KEYS=["fighters","predictions"];
let fighters=load("fighters",DEMO), predictions=load("predictions",[]);
const $=id=>document.getElementById(id);
function load(k,fallback){try{return JSON.parse(localStorage.getItem("oe_"+k))||fallback}catch{return fallback}}
function persist(){localStorage.setItem("oe_fighters",JSON.stringify(fighters));localStorage.setItem("oe_predictions",JSON.stringify(predictions))}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function percent(v){if(v==null||v==="")return "—";let n=Number(v);if(n>1)n/=100;return Math.round(n*100)+"%"}
function num(v,d=1){return v==null||v===""?"—":Number(v).toFixed(d)}
function options(){let a=$("fighterA"),b=$("fighterB"),oldA=a.value,oldB=b.value;a.innerHTML="";b.innerHTML="";fighters.forEach((f,i)=>{a.add(new Option(f.name,String(i)));b.add(new Option(f.name,String(i)))});a.value=fighters[Number(oldA)]?oldA:"0";b.value=fighters[Number(oldB)]?oldB:String(Math.min(1,fighters.length-1));if(a.value===b.value&&fighters.length>1)b.value=String((Number(a.value)+1)%fighters.length);render()}
function current(){let ai=Number($("fighterA").value),bi=Number($("fighterB").value);if(ai===bi&&fighters.length>1){bi=(ai+1)%fighters.length;$("fighterB").value=String(bi)}return [fighters[ai],fighters[bi]]}
function score(f){let record=(Number(f.wins||0)+Number(f.losses||0)+Number(f.draws||0));let win=record?Number(f.wins||0)/record:.5;let age=Number(f.age||30);let ageScore=Math.max(-.5,Math.min(.5,(30-age)/12));let reach=Number(f.reach_in||70);return (win-.5)*1.25+(Number(f.sig_strikes_landed_per_min||0)-Number(f.sig_strikes_absorbed_per_min||0))*.055+(Number(f.striking_accuracy||0)-Number(f.striking_defense||0))*.25+(Number(f.takedown_avg_per_15||0))*.075+(Number(f.takedown_defense||0)-.65)*.25+(Number(f.submission_avg_per_15||0))*.06+(reach-70)*.018+ageScore*.12+(Number(f.recent_form||.5)-.5)*.55}
function predict(a,b){let x=score(a)-score(b);return 1/(1+Math.exp(-x*1.7))}
function render(){if(!fighters.length)return;let [a,b]=current();$("recordA").textContent=`${a.wins??0}-${a.losses??0}-${a.draws??0} · ${a.promotion||"Promotion unknown"}`;$("recordB").textContent=`${b.wins??0}-${b.losses??0}-${b.draws??0} · ${b.promotion||"Promotion unknown"}`;$("nameA").textContent=a.name;$("nameB").textContent=b.name;let p=predict(a,b);$("probA").textContent=Math.round(p*100)+"%";$("probB").textContent=Math.round((1-p)*100)+"%";$("barA").style.width=(p*100)+"%";$("barB").style.width=((1-p)*100)+"%";$("confidence").textContent=(a.source==="Illustrative demo data"||b.source==="Illustrative demo data")?"Demo data":"Imported data";$("modelNote").textContent=(a.source==="Illustrative demo data"||b.source==="Illustrative demo data")?"Illustrative demo profiles only. This simple baseline is not trained or validated; import verified stats before use.":"Baseline model v0.1. Not yet calibrated against a historical holdout set.";
let rows=[["Record",`${a.wins}-${a.losses}-${a.draws}`,`${b.wins}-${b.losses}-${b.draws}`],["Sig. strikes landed/min",num(a.sig_strikes_landed_per_min),num(b.sig_strikes_landed_per_min)],["Sig. strikes absorbed/min",num(a.sig_strikes_absorbed_per_min),num(b.sig_strikes_absorbed_per_min)],["Striking accuracy",percent(a.striking_accuracy),percent(b.striking_accuracy)],["Striking defense",percent(a.striking_defense),percent(b.striking_defense)],["Takedowns / 15 min",num(a.takedown_avg_per_15),num(b.takedown_avg_per_15)],["Takedown accuracy",percent(a.takedown_accuracy),percent(b.takedown_accuracy)],["Takedown defense",percent(a.takedown_defense),percent(b.takedown_defense)],["Subs / 15 min",num(a.submission_avg_per_15),num(b.submission_avg_per_15)],["Reach",a.reach_in?num(a.reach_in,0)+'"':"—",b.reach_in?num(b.reach_in,0)+'"':"—"],["Age",a.age||"—",b.age||"—"]];$("statsTable").innerHTML=rows.map(r=>`<div class="stat-row"><span class="value a">${esc(r[1])}</span><span class="label">${esc(r[0])}</span><span class="value b">${esc(r[2])}</span></div>`).join("");renderOdds(a,b,p);renderHistory()}
function americanProb(o){o=Number(o);if(!o)return null;return o>0?100/(o+100):(-o)/((-o)+100)}
function renderOdds(a,b,p){let oa=Number($("oddsA").value),ob=Number($("oddsB").value);if(!oa||!ob){$("oddsResult").innerHTML='<p class="muted">Enter both moneylines to compare market-implied probability with the model.</p>';return}let pa=americanProb(oa),pb=americanProb(ob),over=pa+pb,na=pa/over,nb=pb/over,edgeA=p-na,edgeB=(1-p)-nb;$("oddsResult").innerHTML=`<div>Market no-vig estimate: <b>${a.name} ${Math.round(na*100)}%</b> · <b>${b.name} ${Math.round(nb*100)}%</b></div><div>Model difference: <strong>${a.name} ${edgeA>=0?"+":""}${(edgeA*100).toFixed(1)} pp</strong> · <strong>${b.name} ${edgeB>=0?"+":""}${(edgeB*100).toFixed(1)} pp</strong></div><p class="muted small">Market probabilities are normalized to remove the two-way overround. Positive difference means the model is higher than the normalized market estimate; it does not establish value.</p>`}
function renderHistory(){let graded=predictions.filter(p=>p.result);let correct=graded.filter(p=>p.result===p.pick).length;$("countSaved").textContent=predictions.length;$("countGraded").textContent=graded.length;$("accuracy").textContent=graded.length?Math.round(correct/graded.length*100)+"%":"—";$("predictionList").innerHTML=predictions.length?predictions.slice().reverse().map(p=>`<article class="prediction-item"><div class="prediction-top"><strong>${esc(p.a)} vs ${esc(p.b)}</strong><span class="pill">${p.pa}% / ${p.pb}%</span></div><p>Picked: ${esc(p.pick)} · ${esc(p.date)}${p.oddsA!==null&&p.oddsB!==null?`<br>Odds: ${p.oddsA>0?"+":""}${p.oddsA} / ${p.oddsB>0?"+":""}${p.oddsB}`:""}<br>Status: ${p.result?`Graded — winner: ${esc(p.result)}${p.result===p.pick?" (correct)":" (incorrect)"}`:"Unresolved"}</p>${!p.result?`<label>Grade result<select data-grade="${p.id}"><option value="">Choose winner…</option><option>${esc(p.a)}</option><option>${esc(p.b)}</option><option>Draw / No Contest</option></select></label>`:""}<button class="secondary small-btn" data-delete="${p.id}">Delete</button></article>`).join(""):'<div class="card"><p class="muted">No saved predictions yet. Run a matchup and tap “Save prediction”.</p></div>'}
function parseCSV(text){let lines=text.replace(/\r/g,"").split("\n").filter(x=>x.trim());if(lines.length<2)throw Error("CSV needs a header row and at least one fighter.");function parse(line){let out=[],s="",q=false;for(let i=0;i<line.length;i++){let c=line[i];if(c==='"'&&line[i+1]==='"'){s+='"';i++}else if(c==='"')q=!q;else if(c===","&&!q){out.push(s.trim());s=""}else s+=c}out.push(s.trim());return out}let headers=parse(lines[0]).map(x=>x.toLowerCase());return lines.slice(1).map(line=>{let vals=parse(line),f={};headers.forEach((h,i)=>{if(vals[i]!==undefined&&vals[i]!==""){let v=vals[i];f[h]=["name","recent_form","source","promotion"].includes(h)?v:Number(v)}});["striking_accuracy","striking_defense","takedown_accuracy","takedown_defense"].forEach(k=>{if(f[k]>1)f[k]/=100});if(!f.name)throw Error("Every row needs a name.");f.source="Imported CSV";return f})}
$("fighterA").addEventListener("change",render);$("fighterB").addEventListener("change",render);$("oddsA").addEventListener("input",render);$("oddsB").addEventListener("input",render);
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));btn.classList.add("active");$(btn.dataset.tab).classList.add("active");if(btn.dataset.tab==="history")renderHistory()}));
$("savePrediction").addEventListener("click",()=>{let [a,b]=current(),p=predict(a,b),oa=Number($("oddsA").value),ob=Number($("oddsB").value);predictions.push({id:Date.now(),a:a.name,b:b.name,pa:Math.round(p*100),pb:Math.round((1-p)*100),pick:p>=.5?a.name:b.name,date:new Date().toLocaleDateString(),oddsA:oa||null,oddsB:ob||null,result:null,model:"baseline-v0.1"});persist();renderHistory();alert("Prediction saved on this device.")});
$("predictionList").addEventListener("change",e=>{let id=Number(e.target.dataset.grade);if(!id)return;let p=predictions.find(x=>x.id===id);if(p&&e.target.value){p.result=e.target.value;persist();renderHistory()}});
$("predictionList").addEventListener("click",e=>{let id=Number(e.target.dataset.delete);if(id){predictions=predictions.filter(p=>p.id!==id);persist();renderHistory()}});
$("fighterFile").addEventListener("change",async e=>{let file=e.target.files[0];if(!file)return;try{let imported=parseCSV(await file.text());let map=new Map(fighters.map(f=>[f.name.toLowerCase(),f]));imported.forEach(f=>map.set(f.name.toLowerCase(),f));fighters=[...map.values()];persist();options();$("importStatus").textContent=`Imported ${imported.length} fighter profile(s).`; }catch(err){$("importStatus").textContent="Import failed: "+err.message}});
$("downloadTemplate").addEventListener("click",()=>{let csv="name,wins,losses,draws,sig_strikes_landed_per_min,sig_strikes_absorbed_per_min,striking_accuracy,striking_defense,takedown_avg_per_15,takedown_accuracy,takedown_defense,submission_avg_per_15,reach_in,age,recent_form\nExample Fighter,12,3,0,4.5,3.2,48,57,2.1,40,70,0.4,72,29,0.7\n";download("octagon-edge-fighter-template.csv",csv,"text/csv")});
$("exportHistory").addEventListener("click",()=>{let rows=[["date","fighter_a","fighter_b","probability_a_pct","probability_b_pct","model_pick","odds_a_american","odds_b_american","actual_result"],...predictions.map(p=>[p.date,p.a,p.b,p.pa,p.pb,p.pick,p.oddsA??"",p.oddsB??"",p.result??""])];download("octagon-edge-predictions.csv",rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n"),"text/csv")});
$("resetDemo").addEventListener("click",()=>{if(confirm("Reset fighter profiles to demo data? Saved predictions will be kept.")){fighters=DEMO.map(x=>({...x}));persist();options();$("importStatus").textContent="Demo profiles restored."}});
function download(name,content,type){let blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url)}
options();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));


// Free community API integration (best-effort; no key required according to repository docs).
const FREE_API = "https://ufcapi.aristotle.me";
const FF_API = "https://fightforensics.com/api/v1";
function unwrapList(data){
  if(Array.isArray(data)) return data;
  for(const k of ["fighters","results","items","data"]) if(Array.isArray(data?.[k])) return data[k];
  if(Array.isArray(data?.results?.fighters)) return data.results.fighters;
  return [];
}
function normalizeApiFighter(raw, source="Community UFC API"){
  const recordRaw=raw.record;
  const recordText=typeof recordRaw==="string"?recordRaw:(recordRaw?.pro_mma?.value||recordRaw?.pro?.value||raw.pro_record||raw.record_text||"");
  const rec=String(recordText).match(/(\d+)\s*[-–]\s*(\d+)\s*[-–]\s*(\d+)/);
  const n=(...keys)=>{for(const k of keys){if(raw[k]!==undefined&&raw[k]!==null&&raw[k]!==""){const v=Number(raw[k]);if(Number.isFinite(v))return v}}return undefined};
  const pct=(...keys)=>{let v=n(...keys);return v===undefined?undefined:(v>1?v/100:v)};
  const fights=Array.isArray(raw.fights)?raw.fights:(Array.isArray(raw.bouts)?raw.bouts:[]);
  const promotions=[...new Set([raw.promotion,raw.organization,raw.org,...fights.map(x=>x.promotion||x.organization||x.org)].filter(Boolean).map(String))];
  const name=raw.name||raw.full_name||raw.fighter_name||raw.fullName;
  const recordWins=n("wins")??(rec?Number(rec[1]):undefined);
  return {
    id:raw.id??raw.fighter_id??raw.slug,
    name,
    wins:recordWins??n("record_wins")??(recordRaw&&typeof recordRaw==="object"?Number.parseInt(recordRaw.pro_mma?.value||"",10):undefined)??(rec?Number(rec[1]):0),
    losses:n("losses")??(rec?Number(rec[2]):0),
    draws:n("draws")??(rec?Number(rec[3]):0),
    sig_strikes_landed_per_min:n("slpm","sig_strikes_landed_per_min","strikes_landed_per_min"),
    sig_strikes_absorbed_per_min:n("sapm","sig_strikes_absorbed_per_min","strikes_absorbed_per_min"),
    striking_accuracy:pct("str_acc","striking_accuracy","sig_strike_accuracy"),
    striking_defense:pct("str_def","striking_defense"),
    takedown_avg_per_15:n("td_avg","takedown_avg_per_15","takedowns_per_15"),
    takedown_accuracy:pct("td_acc","takedown_accuracy"),
    takedown_defense:pct("td_def","takedown_defense"),
    submission_avg_per_15:n("sub_avg","submission_avg_per_15"),
    reach_in:n("reach_in")??(typeof raw.reach==="string"?Number.parseFloat(raw.reach):n("reach")),
    age:n("age"), recent_form:0.5,
    promotion:promotions.length?promotions.slice(0,3).join(", "):(raw.organization_name||raw.org_name||"Promotion not listed"),
    source, sourceUrl:raw.url||raw.profile_url||raw.source_url||"",
    recordHistory:fights.map(x=>({opponent:x.opponent||x.opponent_name||x.fighter_name||"Opponent unknown",result:x.result||x.outcome||"Unknown",date:x.date||x.event_date||"",promotion:x.promotion||x.organization||x.org||""})).slice(0,30)
  };
}

async function searchFreeApi(){
  const q=$("apiSearch").value.trim();
  if(!q){$("apiStatus").textContent="Enter a fighter name first.";return}
  $("apiSearchButton").disabled=true;$("apiStatus").textContent="Searching multi-promotion and UFC data sources…";$("apiResults").innerHTML="";
  const all=[];const errors=[];
  try{
    const key=$("ffApiKey").value.trim();
    if(key){
      try{
        const r=await fetch(`${FF_API}/fighters?q=${encodeURIComponent(q)}&limit=15`,{headers:{Accept:"application/json","X-Api-Key":key}});
        if(!r.ok)throw new Error(`Fight Forensics HTTP ${r.status}`);
        const d=await r.json();let list=unwrapList(d);
        if(!list.length&&Array.isArray(d?.fighters))list=d.fighters;
        list.forEach(f=>all.push({...f,__source:"Fight Forensics multi-promotion"}));
      }catch(e){errors.push(e.message)}
    } else {errors.push("Add a free Fight Forensics key to enable broad multi-promotion search.")}
    try{
      const r=await fetch(`${FREE_API}/api/fighters?search=${encodeURIComponent(q)}&limit=15`,{headers:{Accept:"application/json"}});
      if(!r.ok)throw new Error(`UFC community API HTTP ${r.status}`);
      const d=await r.json();let list=unwrapList(d);
      if(!list.length&&d&&typeof d==="object"&&(d.name||d.full_name))list=[d];
      list.filter(f=>f&&(f.name||f.full_name||f.fighter_name)).forEach(f=>all.push({...f,__source:"Community UFC API"}));
    }catch(e){errors.push(e.message)}
    const seen=new Set();const list=all.filter(f=>{const key=String(f.id??f.fighter_id??f.name??f.full_name).toLowerCase();if(seen.has(key))return false;seen.add(key);return true});
    if(!list.length){$("apiStatus").textContent="No results returned. "+errors.join(" · ");return}
    $("apiStatus").textContent=`Found ${list.length} result(s). Add a profile to compare it. Source coverage and available stats vary.`;
    $("apiResults").innerHTML=list.map((f,i)=>{
      const rec=f.record||f.record_text||`${f.wins??"?"}-${f.losses??"?"}-${f.draws??"?"}`;
      const org=f.promotion||f.organization||f.org||f.organization_name||f.org_name|| (f.__source.includes("UFC")?"UFC-focused source":"Multi-promotion record");
      return `<div class="api-result"><div><strong>${esc(f.name||f.full_name||f.fighter_name)}</strong><small>Record ${esc(rec)} · ${esc(org)}<br>${esc(f.__source)}</small></div><button class="secondary" data-api-add="${i}">Add fighter</button></div>`;
    }).join("");
    $("apiResults")._fighters=list;
  }catch(err){$("apiStatus").textContent=`Search failed: ${err.message}`}
  finally{$("apiSearchButton").disabled=false}
}
$("apiSearchButton")?.addEventListener("click",searchFreeApi);
$("apiSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")searchFreeApi()});
$("apiResults")?.addEventListener("click",e=>{
  const idx=e.target.dataset.apiAdd;if(idx===undefined)return;
  const raw=$("apiResults")._fighters?.[Number(idx)];if(!raw)return;
  const source=raw.__source||"Imported MMA data";const f=normalizeApiFighter(raw,source);
  if(!f.name){$("apiStatus").textContent="This result did not include a usable fighter name.";return}
  const at=fighters.findIndex(x=>x.name.toLowerCase()===f.name.toLowerCase());
  if(at>=0) fighters[at]={...fighters[at],...Object.fromEntries(Object.entries(f).filter(([k,v])=>v!==undefined))};
  else fighters.push(f);
  persist();options();
  $("apiStatus").textContent=`Added ${f.name} (${f.promotion}). Select them in Compare. Missing stats remain unavailable; the prediction baseline is not validated.`;
});

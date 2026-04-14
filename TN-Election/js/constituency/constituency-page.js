// ============================================
// js/constituency/constituency-page.js
// Reads selectedConstId from localStorage and
// renders all sections of constituency.html
// ============================================
var PARTY_COLORS = {
  DMK:'#1D4ED8',ADMK:'#C8282A',BJP:'#F97316',INC:'#16A34A',
  CPM:'#DC2626',CPI:'#EF4444',VCK:'#7C3AED',PMK:'#0891B2',
  NTK:'#C2410C',TVK:'#0F766E',OTHERS:'#94A3B8'
};
var PARTY_ICONS = {
  DMK:'../assets/icons/dmk.svg',ADMK:'../assets/icons/admk.svg',
  NTK:'../assets/icons/ntk.svg',TVK:'../assets/icons/tvk.svg'
};
function getPartyColor(p){return PARTY_COLORS[p]||PARTY_COLORS.OTHERS;}
function goHome(){window.location.href='index.html';}
function fmt(n){return Number(n).toLocaleString('en-IN');}

function renderHeader(c){
  document.title=c.name+' | TN Election 2026';
  var bc=document.getElementById('const-breadcrumb');
  if(bc) bc.textContent=c.name;
  var desc=document.getElementById('const-description-text');
  if(desc){
    desc.innerHTML='<strong>'+c.name+'</strong> State Assembly constituency is one of the 234 state legislative assemblies in Tamil Nadu, India. Its State Assembly Constituency number is '+c.id+'. It is located in <strong>'+c.district+'</strong> district. Parliament constituency: <strong>'+(c.pc_name||'—')+'</strong>.';
  }
}

function getMLAImagePath(constituencyId){
  return '../assets/images/candidates/mla/2021/'+constituencyId+'.jpg';
}

function renderMinister(c){
  var container=document.getElementById('minister-cards');
  if(!container)return;

  var mlaInit=(c.current_mla||c.mla_2021||'MLA').split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();
  var mpInit=(c.mp_name||'MP').split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();

  var mlaImgPath=getMLAImagePath(c.id);
  var base='../assets/images/candidates/mp/';
  var mpCon=c.mp_constituency||'';
  var noSpace=mpCon.replace(/\s*\(/,'(');
  var noSuffix=mpCon.replace(/\s*\([^)]*\)/g,'').trim();

  var mlaAvatar=
    '<div class="minister-avatar" style="background:'+getPartyColor(c.current_mla_party||c.mla_party_2021||'')+';color:#fff;padding:0;">'+
      '<img src="'+mlaImgPath+'" alt="'+mlaInit+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" '+
        'onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'">'+
      '<span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:11px;font-weight:800;">'+mlaInit+'</span>'+
    '</div>';

  var mpAvatar=
    '<div class="minister-avatar" style="background:'+getPartyColor(c.mp_party||'')+';color:#fff;padding:0;">'+
      '<img src="'+base+mpCon+'.jpg" alt="'+mpInit+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" '+
        'onerror="this.src=\''+base+noSpace+'.jpg\';this.onerror=function(){this.src=\''+base+noSuffix+'.jpg\';this.onerror=function(){this.style.display=\'none\';this.nextSibling.style.display=\'flex\';};};"> '+
      '<span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:11px;font-weight:800;">'+mpInit+'</span>'+
    '</div>';

  container.innerHTML=
    '<div class="minister-card">'+
      mlaAvatar+
      '<div class="minister-info">'+
        '<div class="m-role">MLA</div>'+
        '<div class="m-name">'+(c.current_mla||c.mla_2021||'—')+'</div>'+
        '<div class="m-party">'+(c.current_mla_party||c.mla_party_2021||'')+'</div>'+
      '</div>'+
    '</div>'+
    (c.mp_name?
      '<div class="minister-card">'+
        mpAvatar+
        '<div class="minister-info">'+
          '<div class="m-role">MP'+(c.mp_constituency?' · '+c.mp_constituency:'')+'</div>'+
          '<div class="m-name">'+c.mp_name+'</div>'+
          '<div class="m-party">'+(c.mp_party||'')+'</div>'+
        '</div>'+
      '</div>':''
    );
}

function renderCandidates(constId){
  var container=document.getElementById('candidates-scroll');
  if(!container)return;

  var candidates=(typeof candidates2026Data!=='undefined'&&candidates2026Data[constId])||[];

  if(candidates.length===0){
    container.innerHTML='<div style="padding:20px;color:#6B7280;font-size:13px;font-style:italic">2026 candidates data coming soon…</div>';
    return;
  }

  container.innerHTML=candidates.map(function(cand){

    var pc=getPartyColor(cand.party);

    var ico=PARTY_ICONS[cand.party]
      ?'<img src="'+PARTY_ICONS[cand.party]+'" alt="'+cand.party+'" onerror="this.style.display=\'none\'">'
      :'<div style="width:100%;height:100%;background:#E2E8F0;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#475569">'+cand.party.slice(0,2)+'</div>';

    var ph=cand.photo
      ?'<img src="'+cand.photo+'" alt="'+cand.name+'" onerror="this.parentElement.style.background=\'#F1F5F9\'">'
      :'<div style="width:100%;height:100%;background:#E2E8F0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#CBD5E1">'+cand.name[0]+'</div>';

    return `
      <div class="cand-card party-${cand.party.toLowerCase()}">
        <div class="cand-photo-wrap">${ph}</div>
        <div class="cand-icon-wrap">${ico}</div>
        <div class="cand-name">${cand.name}</div>
        <span class="cand-party-badge" style="background:${pc}">${cand.party}</span>
      </div>
    `;
  }).join('');
}

function renderHistory(constId){
  var container=document.getElementById('history-cards');
  if(!container)return;
  var hist=typeof historyData!=='undefined'&&historyData[constId];
  if(!hist){
    container.innerHTML='<div class="history-card" style="color:#6B7280;font-size:13px">Historical data not available.</div>';
    return;
  }
  var html='';
  ['2021','2016','2011'].forEach(function(yr){
    if(!hist[yr]||!hist[yr].length)return;
    var w=hist[yr].find(function(c){return c.winner;});
    var ru=hist[yr].find(function(c){return c.position===2;});
    if(!w)return;
    html+=
      '<div class="history-card">'+
        '<div class="history-year-tag">'+yr+' Assembly Election</div>'+
        '<div class="history-winner-name" style="color:'+getPartyColor(w.party)+'">'+w.candidate+'</div>'+
        '<div class="history-winner-party">'+w.party+'</div>'+
        '<div class="history-stat">Votes gained : <span>'+fmt(w.votes)+'</span></div>'+
        '<div class="history-margin">Margin: '+fmt(w.margin)+'</div>'+
        (ru?
          '<div class="history-runnerup">'+
            '<div class="history-ru-name">'+ru.candidate+'</div>'+
            '<div class="history-ru-detail">'+ru.party+'</div>'+
            '<div class="history-stat" style="margin-top:4px">Votes gained : <span>'+fmt(ru.votes)+'</span></div>'+
          '</div>':'')+''+
      '</div>';
  });
  container.innerHTML=html||'<div class="history-card" style="color:#6B7280;font-size:13px">No historical data available.</div>';
}

function drawPie(canvasId, segments){
  var canvas=document.getElementById(canvasId);
  if(!canvas||!canvas.getContext)return;
  var ctx=canvas.getContext('2d');
  var dpr=window.devicePixelRatio||1;
  var size=120;
  canvas.width=size*dpr;
  canvas.height=size*dpr;
  canvas.style.width=size+'px';
  canvas.style.height=size+'px';
  ctx.scale(dpr,dpr);
  var cx=size/2,cy=size/2,r=Math.min(cx,cy)-5;
  var total=segments.reduce(function(s,seg){return s+(seg.value||0);},0);
  if(!total){
    ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);
    ctx.fillStyle='#E2E8F0';ctx.fill();
    return;
  }
  var start=-Math.PI/2;
  segments.forEach(function(seg){
    var angle=((seg.value||0)/total)*2*Math.PI;
    if(angle<0.001)return;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,start,start+angle);
    ctx.closePath();
    ctx.fillStyle=seg.color;
    ctx.fill();
    ctx.strokeStyle='#fff';
    ctx.lineWidth=2;
    ctx.stroke();
    start+=angle;
  });
}

function renderCensus(c){
  // Voters pie — blue for male, pink for female, gray for others
  var cTotal=c.total_voters||0;
  var cMale=c.male_voters||0;
  var cFemale=c.female_voters||0;
  var cOthers=c.other_voters||0;

  document.getElementById('census-total').textContent=fmt(cTotal);
  document.getElementById('census-male').textContent=fmt(cMale);
  document.getElementById('census-female').textContent=fmt(cFemale);
  document.getElementById('census-others').textContent=fmt(cOthers);
  drawPie('voter-pie',[
    {value:cMale,color:'#3B82F6'},
    {value:cFemale,color:'#EC4899'},
    {value:cOthers,color:'#94A3B8'}
  ]);

  // Population pie — teal for male, purple for female, gray for others
  var popTotal=c.total_population||0;
  var popMale=c.male_population||0;
  var popFemale=c.female_population||0;
  var popOthers=c.other_population||0;

  if(popTotal){
    document.getElementById('census-population').textContent=fmt(popTotal);
    document.getElementById('pop-male').textContent=fmt(popMale);
    document.getElementById('pop-female').textContent=fmt(popFemale);
    document.getElementById('pop-others').textContent=fmt(popOthers);
    drawPie('population-pie',[
      {value:popMale,color:'#34D399'},
      {value:popFemale,color:'#818CF8'},
      {value:popOthers,color:'#94A3B8'}
    ]);
  } else {
    document.getElementById('census-population').textContent='Data unavailable';
    document.getElementById('pop-male').textContent='—';
    document.getElementById('pop-female').textContent='—';
    document.getElementById('pop-others').textContent='—';
    drawPie('population-pie',[{value:1,color:'#E2E8F0'}]);
  }
}

function renderAssemblyDetails(c){
  var container=document.getElementById('assembly-cards');
  if(!container)return;
  var rows=[
    {label:'Assembly No.',value:c.id||'—'},
    {label:'Assembly Name',value:c.name||'—'},
    {label:'Category',value:c.reserved_status||'—'},
    {label:'Parliament Name',value:c.pc_name||'—'},
    {label:'District',value:c.district||'—'},
    {label:'District Code',value:c.district_code||'Data unavailable'}
  ];
  container.innerHTML=rows.map(function(item){
    return '<div class="assembly-cell">'+
      '<div class="assembly-cell-label">'+item.label+'</div>'+
      '<div class="assembly-cell-value">'+item.value+'</div>'+
    '</div>';
  }).join('');
}

function renderMiniMap(constId){
  if(typeof d3==='undefined'||typeof topojson==='undefined'||typeof tnMapTopo==='undefined')return;
  var svgEl=document.getElementById('const-mini-svg');if(!svgEl)return;
  var topoKey=Object.keys(tnMapTopo.objects)[0];
  var features=topojson.feature(tnMapTopo,tnMapTopo.objects[topoKey]).features;
  var w=svgEl.clientWidth||260,h=220;
  var svg=d3.select('#const-mini-svg').attr('viewBox','0 0 '+w+' '+h);
  svg.selectAll('*').remove();
  var proj=d3.geoMercator().fitSize([w,h],{type:'FeatureCollection',features:features});
  var path=d3.geoPath().projection(proj);
  // all constituencies — light gray
  svg.selectAll('.bp').data(features).enter().append('path')
    .attr('d',path)
    .attr('fill','#D1D5DB')
    .attr('stroke','#fff')
    .attr('stroke-width',0.4);
  // highlighted constituency — accent red
  var target=features.find(function(f){return String(f.properties.AC_NO)===String(constId);});
  if(target){
    svg.append('path').datum(target)
      .attr('d',path)
      .attr('fill','#E05A46')
      .attr('stroke','#fff')
      .attr('stroke-width',1.5);
  }
}

document.addEventListener('DOMContentLoaded',function(){
  var constId=localStorage.getItem('selectedConstId')||'13';
  var c=constituenciesData[constId];
  if(!c){
    document.body.innerHTML='<div style="padding:40px;text-align:center">Not found. <a href="index.html">Go Home</a></div>';
    return;
  }
  renderHeader(c);
  renderMinister(c);
  renderCandidates(constId);
  renderHistory(constId);
  renderCensus(c);
  renderAssemblyDetails(c);
  renderMiniMap(constId);
});

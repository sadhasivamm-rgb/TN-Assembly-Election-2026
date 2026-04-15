// Global Configuration
// Global Configuration
var PARTY_COLORS = {
    DMK: '#EF4444', ADMK: '#22C55E', NTK: '#16A34A', 
    TVK: '#F59E0B', INC: '#1D4ED8', BJP: '#F97316', OTHERS: '#94A3B8'
    // DMK: '#EF4444', ADMK: '#22C55E', NTK: '#16A34A', 
    // TVK: '#F59E0B', INC: '#1D4ED8', BJP: '#F97316', OTHERS: '#94A3B8'
};


var PARTY_ICONS = {
    DMK: '../assets/icons/dmk.svg', ADMK: '../assets/icons/admk.svg',
    NTK: '../assets/icons/ntk.svg', TVK: '../assets/icons/tvk.svg'
    // DMK: '../assets/icons/dmk.svg', ADMK: '../assets/icons/admk.svg',
    // NTK: '../assets/icons/ntk.svg', TVK: '../assets/icons/tvk.svg'
};

function getPartyColor(p) { return PARTY_COLORS[p] || PARTY_COLORS.OTHERS; }
function goHome() { window.location.href = 'index.html'; }
function fmt(n) { return Number(n).toLocaleString('en-IN'); }

// 1. Render Candidates with Constituency ID Image Mapping
function renderCandidates(constId) {
    var container = document.getElementById('candidates-scroll');
    if (!container) return;

    var candidates = (typeof candidates2026Data !== 'undefined' && candidates2026Data[constId]) || [];

    if (candidates.length === 0) {
        container.innerHTML = '<div style="padding:20px;color:#6B7280;font-style:italic">Data coming soon…</div>';
        return;
    }

    container.innerHTML = candidates.map(function(cand, index) {
        var pc = getPartyColor(cand.party);
        
        // Image Mapping: assets/images/candidates/mla/2026/{ID}.jpg
        var imagePath = (index === 0) 
            ? `../assets/images/candidates/mla/2026/${constId}.jpg`
            : `../assets/images/candidates/mla/2026/${constId}_${cand.party.toLowerCase()}.jpg`;

        var ico = PARTY_ICONS[cand.party]
            ? `<img src="${PARTY_ICONS[cand.party]}" alt="${cand.party}">`
            : `<div class="party-fallback">${cand.party.slice(0,2)}</div>`;

        return `
            <div class="cand-card party-${cand.party.toLowerCase()}">
                <div class="cand-photo-wrap">
                    <img src="${imagePath}" alt="${cand.name}" onerror="this.src='../assets/images/candidates/placeholder.jpg';">
                </div>
                <div class="cand-icon-wrap">${ico}</div>
                <div class="cand-name">${cand.name}</div>
                <span class="cand-party-badge" style="background:${pc}">${cand.party}</span>
            </div>`;
    }).join('');
}

// 2. Render Historical Trajectory
function renderHistory(constId) {
    var container = document.getElementById('history-cards');
    var hist = typeof historyData !== 'undefined' && historyData[constId];
    if (!hist) { container.innerHTML = "Not available"; return; }

    var html = '';
    ['2021', '2016'].forEach(yr => {
        if (!hist[yr]) return;
        var w = hist[yr].find(c => c.winner);
        var ru = hist[yr].find(c => c.position === 2);
        html += `
            <div class="history-card">
                <div class="history-year-tag">${yr} Election</div>
                <div class="history-winner-name" style="color:${getPartyColor(w.party)}">${w.candidate}</div>
                <div class="history-winner-party">${w.party}</div>
                <div class="history-stat">Votes: <span>${fmt(w.votes)}</span></div>
                <div class="history-margin">Margin: ${fmt(w.margin)}</div>
                ${ru ? `<div class="history-runnerup"><div class="history-ru-name">${ru.candidate}</div><div class="history-ru-detail">${ru.party}</div></div>` : ''}
            </div>`;
    });
    container.innerHTML = html;
}

function getPartyOrder(p){
  var key=(p||'').toUpperCase();
  if(key==='DMK') return 1;
  if(key==='ADMK') return 2;
  if(key==='NTK') return 3;
  if(key==='TVK') return 4;
  if(key==='IND' || key==='INDEPENDENT') return 5;
  return 6;
}

function sortCandidatesByParty(list){
  return list.slice().sort(function(a,b){
    var orderA=getPartyOrder(a.party);
    var orderB=getPartyOrder(b.party);
    if(orderA!==orderB) return orderA-orderB;
    return String(a.name||'').localeCompare(String(b.name||''), 'en', {sensitivity:'base'});
  });
}

function normalizePartyKey(p){
  return (p||'').toString().trim().toUpperCase();
}

function normalizeCandidateName(name){
  return (name||'').toString()
    .trim()
    .replace(/[\.\,\'\"\`]/g,'')
    .replace(/&/g,' AND ')
    .replace(/[^A-Z0-9 ]+/gi,' ')
    .replace(/\s+/g,' ')
    .trim()
    .toUpperCase();
}

function candidateNameKey(name){
  var normalized=normalizeCandidateName(name);
  var tokens=normalized.split(' ').filter(Boolean);
  var filtered=tokens.filter(function(token){return token.length>1;});
  if(filtered.length>1) return filtered.join(' ');
  return tokens.join(' ');
}

function candidateTailKey(name){
  var tokens=normalizeCandidateName(name).split(' ').filter(Boolean);
  if(tokens.length>=2){
    return tokens.slice(-2).join(' ');
  }
  return tokens.join(' ');
}

function findMatchingCandidate(cand, candidateList){
  if(!cand || !candidateList || !candidateList.length) return null;
  var candName=normalizeCandidateName(cand.name||cand.candidate||'');
  var candParty=normalizePartyKey(cand.party||cand.party_short||cand.party_full||'');
  if(!candName) return null;

  var exactMatch=candidateList.find(function(item){
    if(!item.name) return false;
    var itemName=normalizeCandidateName(item.name);
    var itemParty=normalizePartyKey(item.party_short||item.party||item.party_full||'');
    return itemName===candName && (!candParty || !itemParty || itemParty===candParty);
  });
  if(exactMatch) return exactMatch;

  var candidateKey=candidateNameKey(candName);
  var candidateTail=candidateTailKey(candName);

  var fuzzyMatch=candidateList.find(function(item){
    if(!item.name) return false;
    var itemName=normalizeCandidateName(item.name);
    var itemKey=candidateNameKey(itemName);
    var itemTail=candidateTailKey(itemName);
    var itemParty=normalizePartyKey(item.party_short||item.party||item.party_full||'');

    if(itemKey && candidateKey && itemKey===candidateKey) {
      return !candParty || !itemParty || itemParty===candParty;
    }
    if(itemTail && candidateTail && itemTail===candidateTail) {
      return !candParty || !itemParty || itemParty===candParty;
    }
    return false;
  });
  return fuzzyMatch || null;
}

function buildCandidateEntry(cand, allInConst){
  var name=cand.name||cand.candidate||'';
  var party=cand.party||cand.party_short||cand.party_full||'IND';
  var photo=cand.photo||'';
  var id=cand.id||'';

  var matchedCandidate = (!photo || !id) ? findMatchingCandidate(cand, allInConst) : null;
  if(matchedCandidate){
    if(!photo && matchedCandidate.photo){
      photo=matchedCandidate.photo;
    }
    if(!id && matchedCandidate.id){
      id=matchedCandidate.id;
    }
  }

  if(!photo && id){
    photo='../assets/images/candidates/mla/2026/'+id+'.jpg';
  }

  return { name:name, party:party, photo:photo, id:id || '' };
}

function renderMinister(c){
  var container=document.getElementById('minister-cards');
  if(!container)return;
// 3. Mini Map using D3
function renderMiniMap(constId) {
    if (typeof d3 === 'undefined' || !window.tnMapTopo) return;
    var svgEl = d3.select('#const-mini-svg');
    var topoKey = Object.keys(tnMapTopo.objects)[0];
    var features = topojson.feature(tnMapTopo, tnMapTopo.objects[topoKey]).features;
    
    var proj = d3.geoMercator().fitSize([260, 220], {type: 'FeatureCollection', features: features});
    var path = d3.geoPath().projection(proj);

    svgEl.selectAll('path').data(features).enter().append('path')
        .attr('d', path)
        .attr('fill', f => String(f.properties.AC_NO) === String(constId) ? '#E05A46' : '#D1D5DB')
        .attr('stroke', '#fff').attr('stroke-width', 0.5);
}

function getConstituencyCandidates(constId){
  var constMeta=constituenciesData[constId]||{};
  var allInConst=(typeof allCandidatesByConstituency!=='undefined'&&allCandidatesByConstituency[(constMeta.name||'').toUpperCase()])||[];

  var candidates=(typeof candidates2026Data!=='undefined'&&candidates2026Data[constId])||[];
  if(candidates.length){
    return candidates.map(function(c){
      return buildCandidateEntry(c, allInConst);
    });
  }

  if(typeof constituenciesWithCandidates!=='undefined'&&constituenciesWithCandidates[constId]){
    var histData=constituenciesWithCandidates[constId].candidates||[];
    if(histData.length){
      return histData.map(function(c){
        return buildCandidateEntry(c, allInConst);
      });
    }
  }

  if(allInConst.length){
    return allInConst.map(function(c){
      return buildCandidateEntry(c, allInConst);
    });
  }

  return [];
}

function renderCandidates(constId){
  var container=document.getElementById('candidates-scroll');
  if(!container)return;

  var candidates=getConstituencyCandidates(constId);

  candidates=sortCandidatesByParty(candidates);
  if(candidates.length>5){
    var topFive=candidates.slice(0,5);
    var fifth=topFive[4];
    if(fifth && getPartyOrder(fifth.party)===5){
      var replacement=candidates.slice(5).find(function(c){
        return getPartyOrder(c.party)===6;
      });
      if(replacement){
        topFive[4]=replacement;
      }
    }
    candidates=topFive;
  }

  if(candidates.length===0){
    container.innerHTML='<div style="padding:20px;color:#6B7280;font-size:13px;font-style:italic">Candidates data not available</div>';
    return;
  }

    container.innerHTML = candidates.map(function(cand, index) {
        var pc = getPartyColor(cand.party);
        
        // Image Mapping: assets/images/candidates/mla/2026/{ID}.jpg
        var imagePath = (index === 0) 
            ? `../assets/images/candidates/mla/2026/${constId}.jpg`
            : `../assets/images/candidates/mla/2026/${constId}_${cand.party.toLowerCase()}.jpg`;

        var ico = PARTY_ICONS[cand.party]
            ? `<img src="${PARTY_ICONS[cand.party]}" alt="${cand.party}">`
            : `<div class="party-fallback">${cand.party.slice(0,2)}</div>`;

        return `
            <div class="cand-card party-${cand.party.toLowerCase()}">
                <div class="cand-photo-wrap">
                    <img src="${imagePath}" alt="${cand.name}" onerror="this.src='../assets/images/candidates/placeholder.jpg';">
                </div>
                <div class="cand-icon-wrap">${ico}</div>
                <div class="cand-name">${cand.name}</div>
                <span class="cand-party-badge" style="background:${pc}">${cand.party}</span>
            </div>`;
    }).join('');
}

// 2. Render Historical Trajectory
function renderHistory(constId) {
    var container = document.getElementById('history-cards');
    var hist = typeof historyData !== 'undefined' && historyData[constId];
    if (!hist) { container.innerHTML = "Not available"; return; }

    var html = '';
    ['2021', '2016'].forEach(yr => {
        if (!hist[yr]) return;
        var w = hist[yr].find(c => c.winner);
        var ru = hist[yr].find(c => c.position === 2);
        html += `
            <div class="history-card">
                <div class="history-year-tag">${yr} Election</div>
                <div class="history-winner-name" style="color:${getPartyColor(w.party)}">${w.candidate}</div>
                <div class="history-winner-party">${w.party}</div>
                <div class="history-stat">Votes: <span>${fmt(w.votes)}</span></div>
                <div class="history-margin">Margin: ${fmt(w.margin)}</div>
                ${ru ? `<div class="history-runnerup"><div class="history-ru-name">${ru.candidate}</div><div class="history-ru-detail">${ru.party}</div></div>` : ''}
            </div>`;
    });
    container.innerHTML = html;
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

function getSelectedConstituencyId(){
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || localStorage.getItem('selectedConstId');
  return id ? String(id) : null;
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

function viewAllCandidates(constId){
  var constMeta=constituenciesData[constId]||{};
  var allInConst=(typeof allCandidatesByConstituency!=='undefined'&&allCandidatesByConstituency[(constMeta.name||'').toUpperCase()])||[];
  var allCandidates=(typeof candidates2026Data!=='undefined'&&candidates2026Data[constId])||[];
  
  if(allCandidates.length){
    allCandidates=allCandidates.map(function(c){
      return buildCandidateEntry(c, allInConst);
    });
  }

  if(allCandidates.length===0&&typeof constituenciesWithCandidates!=='undefined'&&constituenciesWithCandidates[constId]){
    var histData=constituenciesWithCandidates[constId].candidates||[];
    if(histData.length){
      allCandidates=histData.map(function(c){
        var entry=buildCandidateEntry(c, allInConst);
        return {
          name: entry.name,
          party: entry.party,
          photo: entry.photo,
          age: c.age||'',
          address: c.address||''
        };
      });
    }
  }

  if(allCandidates.length===0 && allInConst.length){
    allCandidates=allInConst.map(function(c){
      var entry=buildCandidateEntry(c, allInConst);
      return {
        name: entry.name,
        party: entry.party,
        photo: entry.photo,
        age: c.age||'',
        address: c.address||''
      };
    });
  }

  allCandidates=sortCandidatesByParty(allCandidates);

  if(allCandidates.length===0){
    alert('No candidates data available.');
    return;
  }

  var lines=allCandidates.map(function(c,idx){
    return '<tr>'+
      '<td style="padding:12px;text-align:center;font-weight:600;color:#475569">'+(idx+1)+'</td>'+
      '<td style="padding:12px;color:#1F2937;font-weight:500">'+c.name+'</td>'+
      '<td style="padding:12px;"><span style="background:'+getPartyColor(c.party)+';color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600">'+c.party+'</span></td>'+
      '<td style="padding:12px;color:#6B7280;font-size:13px">'+(c.age||'—')+'</td>'+
    '</tr>';
  }).join('');

  var modal=document.createElement('div');
  modal.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(2px)';
  modal.innerHTML=
    '<div style="background:#fff;border-radius:12px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 25px rgba(0,0,0,0.15)">'+
      '<div style="padding:20px;border-bottom:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff">'+
        '<h3 style="margin:0;color:#1F2937;font-size:16px;font-weight:700">All Contesting Candidates</h3>'+
        '<button onclick="this.closest(\'[data-modal]\').remove()" style="background:none;border:none;font-size:24px;color:#6B7280;cursor:pointer;padding:0;width:30px;height:30px;display:flex;align-items:center;justify-content:center">×</button>'+
      '</div>'+
      '<div style="padding:20px">'+
        '<table style="width:100%;border-collapse:collapse">'+
          '<thead>'+
            '<tr style="border-bottom:2px solid #E5E7EB;background:#F9FAFB">'+
              '<th style="padding:12px;text-align:left;font-weight:600;color:#6B7280;font-size:12px;text-transform:uppercase">S.No</th>'+
              '<th style="padding:12px;text-align:left;font-weight:600;color:#6B7280;font-size:12px;text-transform:uppercase">Name</th>'+
              '<th style="padding:12px;text-align:left;font-weight:600;color:#6B7280;font-size:12px;text-transform:uppercase">Party</th>'+
              '<th style="padding:12px;text-align:left;font-weight:600;color:#6B7280;font-size:12px;text-transform:uppercase">Age</th>'+
            '</tr>'+
          '</thead>'+
          '<tbody>'+lines+'</tbody>'+
        '</table>'+
      '</div>'+
    '</div>';
  modal.setAttribute('data-modal','true');
  modal.addEventListener('click',function(e){if(e.target===modal)modal.remove();});
  document.body.appendChild(modal);
}

document.addEventListener('DOMContentLoaded',function(){
  var constId=getSelectedConstituencyId();
  if(!constId){
    document.body.innerHTML='<div style="padding:40px;text-align:center">No constituency selected. <a href="index.html">Go Home</a></div>';
    return;
  }
  var c=constituenciesData[constId];
  if(!c){
    document.body.innerHTML='<div style="padding:40px;text-align:center">Constituency not found. <a href="index.html">Go Home</a></div>';
    return;
  }
  renderHeader(c);
  renderMinister(c);
  renderCandidates(constId);
  renderHistory(constId);
  renderCensus(c);
  renderAssemblyDetails(c);
  renderMiniMap(constId);
  
  // Attach view-all button handler
  var viewAllBtn=document.getElementById('view-all-btn');
  if(viewAllBtn){
    viewAllBtn.addEventListener('click',function(){
      viewAllCandidates(constId);
    });
  }
});
}
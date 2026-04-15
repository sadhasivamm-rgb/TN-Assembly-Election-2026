// Global Configuration
var PARTY_COLORS = {
    DMK: '#EF4444', ADMK: '#22C55E', NTK: '#16A34A', 
    TVK: '#F59E0B', INC: '#1D4ED8', BJP: '#F97316', OTHERS: '#94A3B8'
};

var PARTY_ICONS = {
    DMK: '../assets/icons/dmk.svg', ADMK: '../assets/icons/admk.svg',
    NTK: '../assets/icons/ntk.svg', TVK: '../assets/icons/tvk.svg'
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

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    var constId = localStorage.getItem('selectedConstId') || '13';
    var c = constituenciesData[constId];
    
    if (c) {
        document.getElementById('const-breadcrumb').textContent = c.name;
        document.getElementById('const-description-text').innerHTML = `<strong>${c.name}</strong> is constituency #${c.id} in ${c.district}.`;
        
        renderCandidates(constId);
        renderHistory(constId);
        renderMiniMap(constId);
        // Add your renderCensus and renderAssembly functions here...
    }
});
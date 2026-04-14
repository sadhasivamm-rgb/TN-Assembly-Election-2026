// // ============================================
// // js/candidates/candidate-popup.js
// //
// // Handles the candidate detail popup:
// //   - Opens on card click
// //   - Shows competitors in same constituency (scrollable)
// //   - Shows personal + political details
// // ============================================

// // -----------------------------------------------
// // Build silhouette for popup competitor cards
// // -----------------------------------------------
// function buildPopupSilhouette() {
//   return (
//     '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">' +
//       '<rect width="80" height="80" fill="#e2e8f0"/>' +
//       '<circle cx="40" cy="28" r="16" fill="#b0bec5"/>' +
//       '<ellipse cx="40" cy="75" rx="26" ry="20" fill="#b0bec5"/>' +
//     '</svg>'
//   );
// }

// // -----------------------------------------------
// // Build one competitor mini-card (horizontal scroll)
// // -----------------------------------------------
// function buildCompetitorCard(candidate, isSelected) {
//   var hasPhoto = candidate.photo && candidate.photo.length > 0;
//   var photoHTML = hasPhoto
//     ? '<img src="' + candidate.photo + '" alt="' + candidate.name + '" style="width:100%;height:100%;object-fit:cover;object-position:top" />'
//     : buildPopupSilhouette();

//   var iconPath = PARTY_ICONS[candidate.party_short];
//   var badgeHTML = iconPath
//     ? '<div class="popup-competitor__badge"><img src="' + iconPath + '" alt="' + candidate.party_short + '"/></div>'
//     : '<div class="popup-competitor__badge" style="background:' + candidate.accent + '"><span>' + (candidate.party_short || '').slice(0,3) + '</span></div>';

//   var selectedClass = isSelected ? ' popup-competitor--selected' : '';

//   return (
//     '<div class="popup-competitor' + selectedClass + '" style="border-color:' + (isSelected ? candidate.accent : 'transparent') + '">' +
//       '<div class="popup-competitor__photo" style="background:' + candidate.bg + '">' +
//         photoHTML +
//         badgeHTML +
//       '</div>' +
//       '<div class="popup-competitor__name">' + candidate.name + '</div>' +
//       '<div class="popup-competitor__constituency">' + candidate.constituency + '</div>' +
//       '<div class="popup-competitor__party" style="background:' + candidate.bg + ';color:' + candidate.accent + '">' + candidate.party_short + '</div>' +
//     '</div>'
//   );
// }

// // -----------------------------------------------
// // Build full popup HTML for a candidate
// // -----------------------------------------------
// function buildPopupHTML(candidate) {
//   // Find competitors in same constituency from allCandidatesByConstituency
//   var constKey = (candidate.constituency || '').toUpperCase();
//   var allInConst = (allCandidatesByConstituency && allCandidatesByConstituency[constKey]) || [];

//   // Build competitors HTML (all candidates in constituency, mark selected)
//   var competitorsHTML = '';
//   if (allInConst.length > 0) {
//     competitorsHTML = allInConst.map(function(comp) {
//       var isSelf = String(comp.id) === String(candidate.id);
//       // Merge photo from candidates.js data if available
//       if (isSelf && candidate.photo) comp.photo = candidate.photo;
//       return buildCompetitorCard(comp, isSelf);
//     }).join('');
//   } else {
//     competitorsHTML = '<div class="popup-competitors__empty">No competitor data available</div>';
//   }

//   // Photo for selected candidate
//   var hasPhoto = candidate.photo && candidate.photo.length > 0;
//   var mainPhotoHTML = hasPhoto
//     ? '<img src="' + candidate.photo + '" alt="' + candidate.name + '" class="popup-main__photo-img" />'
//     : '<div class="popup-main__photo-placeholder">' + buildPopupSilhouette() + '</div>';

//   // Personal details rows
//   var personalRows = [
//     { label: 'Full Name',    value: candidate.name || '—' },
//     { label: 'Age',         value: candidate.age ? candidate.age + ' Years' : '—' },
//     { label: 'Gender',      value: candidate.gender ? (candidate.gender.charAt(0).toUpperCase() + candidate.gender.slice(1)) : '—' },
//     { label: 'Address',     value: candidate.address || '—' },
//   ];

//   var personalHTML = personalRows.map(function(row) {
//     return (
//       '<div class="popup-details__row">' +
//         '<span class="popup-details__label">' + row.label + '</span>' +
//         '<span class="popup-details__value">: ' + row.value + '</span>' +
//       '</div>'
//     );
//   }).join('');

//   // Political details rows
//   var politicalRows = [
//     { label: 'Party',            value: candidate.party_full || candidate.party_short || '—' },
//     { label: 'Constituency',     value: candidate.constituency || '—' },
//     { label: 'State',            value: 'Tamil Nadu' },
//     { label: 'Total Competitors',value: allInConst.length > 0 ? (allInConst.length - 1) + ' Candidates' : '—' },
//   ];

//   var politicalHTML = politicalRows.map(function(row) {
//     return (
//       '<div class="popup-details__row">' +
//         '<span class="popup-details__label">' + row.label + '</span>' +
//         '<span class="popup-details__value">: ' + row.value + '</span>' +
//       '</div>'
//     );
//   }).join('');

//   return (
//     '<div class="popup-overlay" id="candidate-popup-overlay">' +
//       '<div class="popup-modal" role="dialog" aria-modal="true">' +

//         // Header
//         '<div class="popup-header">' +
//           '<button class="popup-header__back" id="popup-close-btn" aria-label="Close">' +
//             '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
//           '</button>' +
//           '<span class="popup-header__title">Candidate Details</span>' +
//           '<button class="popup-header__close" id="popup-close-x" aria-label="Close">' +
//             '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
//           '</button>' +
//         '</div>' +

//         // Scrollable body
//         '<div class="popup-body">' +

//           // Main candidate section
//           '<div class="popup-main">' +
//             '<div class="popup-main__photo-wrap" style="background:' + candidate.bg + '">' +
//               mainPhotoHTML +
//             '</div>' +
//             '<div class="popup-main__info">' +
//               '<h2 class="popup-main__name">' + candidate.name + '</h2>' +
//               '<div class="popup-main__constituency-pill" style="background:' + candidate.bg + ';color:' + candidate.accent + '">' + candidate.constituency + '</div>' +
//               '<div class="popup-main__party">' + (candidate.party_full || candidate.party_short) + '</div>' +
//             '</div>' +
//           '</div>' +

//           // 2026 Competitors section
//           '<div class="popup-competitors">' +
//             '<div class="popup-competitors__title">2026 Competitors</div>' +
//             '<div class="popup-competitors__scroll">' +
//               competitorsHTML +
//             '</div>' +
//           '</div>' +

//           // Details grid
//           '<div class="popup-details-grid">' +
//             '<div class="popup-details-col">' +
//               '<div class="popup-details__heading">Personal Details</div>' +
//               personalHTML +
//             '</div>' +
//             '<div class="popup-details-col">' +
//               '<div class="popup-details__heading">Political Details</div>' +
//               politicalHTML +
//             '</div>' +
//           '</div>' +

//         '</div>' + // popup-body

//       '</div>' + // popup-modal
//     '</div>'    // popup-overlay
//   );
// }

// // -----------------------------------------------
// // Open popup
// // -----------------------------------------------
// function openCandidatePopup(candidate) {
//   // Remove existing popup if any
//   var existing = document.getElementById('candidate-popup-overlay');
//   if (existing) existing.remove();

//   // Inject popup
//   var div = document.createElement('div');
//   div.innerHTML = buildPopupHTML(candidate);
//   document.body.appendChild(div.firstChild);

//   // Prevent body scroll
//   document.body.style.overflow = 'hidden';

//   // Close handlers
//   function closePopup() {
//     var overlay = document.getElementById('candidate-popup-overlay');
//     if (overlay) {
//       overlay.classList.add('popup-overlay--closing');
//       setTimeout(function() { overlay.remove(); }, 220);
//     }
//     document.body.style.overflow = '';
//   }

//   document.getElementById('popup-close-btn').addEventListener('click', closePopup);
//   document.getElementById('popup-close-x').addEventListener('click', closePopup);

//   // Close on overlay click (outside modal)
//   document.getElementById('candidate-popup-overlay').addEventListener('click', function(e) {
//     if (e.target === this) closePopup();
//   });

//   // Close on Escape key
//   function onKeyDown(e) {
//     if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', onKeyDown); }
//   }
//   document.addEventListener('keydown', onKeyDown);
// }

// // -----------------------------------------------
// // Wire up card clicks — called after cards render
// // -----------------------------------------------
// function initCandidatePopupClicks() {
//   document.getElementById('candidates-grid').addEventListener('click', function(e) {
//     var card = e.target.closest('.candidate-card');
//     if (!card) return;

//     var candidateId = card.dataset.candidateId;
//     if (!candidateId) return;

//     // Find candidate in all tab arrays
//     var allArrays = [
//       typeof popularCandidates !== 'undefined'      ? popularCandidates      : [],
//       typeof celebrityCandidates !== 'undefined'    ? celebrityCandidates    : [],
//       typeof experiencedCandidates !== 'undefined'  ? experiencedCandidates  : [],
//       typeof professionalCandidates !== 'undefined' ? professionalCandidates : [],
//     ];
//     var candidate = null;
//     for (var i = 0; i < allArrays.length; i++) {
//       candidate = allArrays[i].find(function(c) { return String(c.id) === String(candidateId); });
//       if (candidate) break;
//     }

//     if (candidate) openCandidatePopup(candidate);
//   });
// }

// document.addEventListener('DOMContentLoaded', initCandidatePopupClicks);

// ============================================
// js/candidates/candidate-popup.js
// Candidate detail popup — matches Figma design
// ============================================

function buildPopupSilhouette() {
  return (
    '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">' +
      '<rect width="80" height="80" fill="#e2e8f0"/>' +
      '<circle cx="40" cy="28" r="16" fill="#b0bec5"/>' +
      '<ellipse cx="40" cy="75" rx="26" ry="20" fill="#b0bec5"/>' +
    '</svg>'
  );
}

var POPUP_ALLIANCE_PARTIES = {
  NDA: ['ADMK','AIADMK','BJP','PMK','AMMK','TMC','IJK','PBK','PNK','STMK','TM-BSP','SIFB','TMMK'],
  SPA: ['DMK','INC','CPI','CPI(M)','CPM','VCK','MDMK','DMDK','IUML','KMDK','MMK','MJK','MPP','SDPI','TDK'],
  TVK: ['TVK'],
  NTK: ['NTK']
};
var POPUP_ALLIANCE_COLOURS = {
  NDA: { bg: '#F97256', bar: '#FDA29B', text: '#7A1200' },
  SPA: { bg: '#6172F3', bar: '#A4BCFD', text: '#1a237e' },
  TVK: { bg: '#FEDF89', bar: '#FDB022', text: '#7A4500' },
  NTK: { bg: '#D1FADF', bar: '#039855', text: '#14532d' }
};

function getPopupColours(partyShort) {
  var p = (partyShort || '').trim();
  for (var a in POPUP_ALLIANCE_PARTIES) {
    if (POPUP_ALLIANCE_PARTIES[a].indexOf(p) !== -1) return POPUP_ALLIANCE_COLOURS[a];
  }
  return { bg: '#e2e8f0', bar: '#94a3b8', text: '#1a1a2e' };
}

// -----------------------------------------------
// Competitor mini-card (floating photo + coloured body)
// -----------------------------------------------
function buildCompetitorCard(comp, isSelf) {
  var partyKey = (comp.party_short || '').trim();
  var colours  = getPopupColours(partyKey);
  var iconPath = PARTY_ICONS[partyKey];

  var badgeHTML = iconPath
    ? '<img src="' + iconPath + '" alt="' + partyKey + '" style="width:100%;height:100%;object-fit:contain"/>'
    : '<span style="font-size:6px;font-weight:900;color:#fff;line-height:1">' + partyKey.slice(0,3) + '</span>';

  var hasPhoto = comp.photo && comp.photo.length > 0;
  var photoHTML = hasPhoto
    ? '<img src="' + comp.photo + '" alt="' + comp.name + '" style="width:100%;height:100%;object-fit:cover;object-position:top center;display:block"/>'
    : buildPopupSilhouette();

  var selfRing = isSelf ? 'outline:2.5px solid ' + colours.bg + ';outline-offset:2px;' : '';

  return (
    '<div class="pcomp-card" style="' + selfRing + '">' +
      '<div class="pcomp-card__photo-wrap">' + photoHTML + '</div>' +
      '<div class="pcomp-card__body" style="background:' + colours.bg + '">' +
        '<p class="pcomp-card__name" style="color:' + colours.text + '">' + (comp.name || '').trim() + '</p>' +
        '<p class="pcomp-card__const" style="color:' + colours.text + '">' + (comp.constituency || '').trim() + '</p>' +
        '<div class="pcomp-card__logo">' + badgeHTML + '</div>' +
        '<div class="pcomp-card__bar" style="background:' + colours.bar + '">' +
          '<span style="color:#fff;font-size:10px;font-weight:800;letter-spacing:.03em">' + partyKey + '</span>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

// -----------------------------------------------
// Wins / Losses bar
// -----------------------------------------------
function buildWinsBar(wins, losses) {
  if (wins === undefined || wins === null) return '';
  var w = parseInt(wins) || 0;
  var l = parseInt(losses) || 0;
  var total = w + l;
  var pct = total > 0 ? Math.round((w / total) * 100) : 0;
  return (
    '<div class="popup-wins-wrap">' +
      '<div class="popup-wins-label">History of Elections</div>' +
      '<div class="popup-wins-counts">' +
        '<span class="popup-wins-w">' + w + ' Wins</span>' +
        '<span class="popup-wins-l">' + l + ' Losses</span>' +
      '</div>' +
      '<div class="popup-wins-bar"><div class="popup-wins-bar__fill" style="width:' + pct + '%"></div></div>' +
    '</div>'
  );
}

// -----------------------------------------------
// Build full popup HTML
// -----------------------------------------------
function buildPopupHTML(candidate) {
  var partyKey = (candidate.party_short || '').trim();
  var colours  = getPopupColours(partyKey);

  var constKey   = (candidate.constituency || '').toUpperCase();
  var allInConst = (typeof allCandidatesByConstituency !== 'undefined' && allCandidatesByConstituency[constKey]) || [];

  var competitorsHTML = allInConst.length > 0
    ? allInConst.map(function(comp) {
        var isSelf = String(comp.id) === String(candidate.id);
        if (isSelf && candidate.photo) comp.photo = candidate.photo;
        return buildCompetitorCard(comp, isSelf);
      }).join('')
    : '<div class="popup-competitors__empty">No competitor data available</div>';

  var hasPhoto = candidate.photo && candidate.photo.length > 0;
  var mainPhotoHTML = hasPhoto
    ? '<img src="' + candidate.photo + '" alt="' + candidate.name + '" class="popup-main__photo-img"/>'
    : '<div class="popup-main__photo-placeholder">' + buildPopupSilhouette() + '</div>';

  var contestingHTML = candidate.contesting
    ? '<div class="popup-main__contesting" style="color:' + colours.bg + '">Contesting ' + candidate.contesting + '</div>'
    : '';

  var winsHTML = buildWinsBar(candidate.wins, candidate.losses);

  function rows(arr) {
    return arr.map(function(r) {
      return '<div class="popup-details__row"><span class="popup-details__label">' + r.label + '</span><span class="popup-details__value">: ' + r.value + '</span></div>';
    }).join('');
  }

  var personalRows = [
    { label: 'Full Name',    value: (candidate.full_name  || candidate.name || '—').trim() },
    { label: 'Date of Birth',value: candidate.dob        || '—' },
    { label: 'Birth Place',  value: candidate.birth_place || '—' },
    { label: 'Father',       value: candidate.father      || '—' },
    { label: 'Children',     value: candidate.children    || '—' },
  ];
  var politicalRows = [
    { label: 'Party',              value: candidate.party_full || partyKey || '—' },
    { label: 'Constituency',       value: candidate.constituency || '—' },
    { label: 'Current Position',   value: candidate.position    || '—' },
    { label: 'First Elected as MLA',value: candidate.first_elected || '—' },
    { label: 'Political Experience',value: candidate.experience  || '—' },
  ];

  return (
    '<div class="popup-overlay" id="candidate-popup-overlay">' +
      '<div class="popup-modal" role="dialog" aria-modal="true">' +

        '<div class="popup-header">' +
          '<button class="popup-header__back" id="popup-close-btn" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
          '</button>' +
          '<span class="popup-header__title">Candidate Details</span>' +
          '<button class="popup-header__close" id="popup-close-x" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>' +
        '</div>' +

        '<div class="popup-body">' +

          '<div class="popup-top-row">' +

            '<div class="popup-left">' +
              '<div class="popup-main__photo-wrap">' + mainPhotoHTML + '</div>' +
              '<div class="popup-main__info">' +
                '<h2 class="popup-main__name" style="color:' + colours.bg + '">' + (candidate.name || '').trim() + '</h2>' +
                '<div class="popup-main__constituency-pill" style="background:' + colours.bg + ';color:#fff">' + (candidate.constituency || '').toUpperCase() + '</div>' +
                '<div class="popup-main__party">' + (candidate.party_full || partyKey) + '</div>' +
                contestingHTML +
                winsHTML +
              '</div>' +
            '</div>' +

            '<div class="popup-right">' +
              '<div class="popup-competitors__title">2026 Competitors</div>' +
              '<div class="popup-competitors__scroll">' + competitorsHTML + '</div>' +
            '</div>' +

          '</div>' +

          '<div class="popup-details-grid">' +
            '<div class="popup-details-col">' +
              '<div class="popup-details__heading">Personal Details</div>' +
              rows(personalRows) +
            '</div>' +
            '<div class="popup-details-col">' +
              '<div class="popup-details__heading">Political Details</div>' +
              rows(politicalRows) +
            '</div>' +
          '</div>' +

        '</div>' +
      '</div>' +
    '</div>'
  );
}

// -----------------------------------------------
// Open / Close
// -----------------------------------------------
function openCandidatePopup(candidate) {
  var existing = document.getElementById('candidate-popup-overlay');
  if (existing) existing.remove();

  var div = document.createElement('div');
  div.innerHTML = buildPopupHTML(candidate);
  document.body.appendChild(div.firstChild);
  document.body.style.overflow = 'hidden';

  function closePopup() {
    var overlay = document.getElementById('candidate-popup-overlay');
    if (overlay) { overlay.classList.add('popup-overlay--closing'); setTimeout(function() { overlay.remove(); }, 220); }
    document.body.style.overflow = '';
  }

  document.getElementById('popup-close-btn').addEventListener('click', closePopup);
  document.getElementById('popup-close-x').addEventListener('click', closePopup);
  document.getElementById('candidate-popup-overlay').addEventListener('click', function(e) { if (e.target === this) closePopup(); });
  function onKey(e) { if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', onKey); } }
  document.addEventListener('keydown', onKey);
}

function initCandidatePopupClicks() {
  var grid = document.getElementById('candidates-grid');
  if (!grid) return;
  grid.addEventListener('click', function(e) {
    var card = e.target.closest('.candidate-card');
    if (!card || !card.dataset.candidateId) return;
    var id = card.dataset.candidateId;
    var allArrays = [
      typeof popularCandidates      !== 'undefined' ? popularCandidates      : [],
      typeof celebrityCandidates    !== 'undefined' ? celebrityCandidates    : [],
      typeof experiencedCandidates  !== 'undefined' ? experiencedCandidates  : [],
      typeof professionalCandidates !== 'undefined' ? professionalCandidates : [],
    ];
    var found = null;
    for (var i = 0; i < allArrays.length; i++) {
      found = allArrays[i].find(function(c) { return String(c.id) === String(id); });
      if (found) break;
    }
    if (found) openCandidatePopup(found);
  });
}

document.addEventListener('DOMContentLoaded', initCandidatePopupClicks);

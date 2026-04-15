// // // ============================================
// // // js/candidates/candidate-popup.js
// // //
// // // Handles the candidate detail popup:
// // //   - Opens on card click
// // //   - Shows competitors in same constituency (scrollable)
// // //   - Shows personal + political details
// // // ============================================

// // // -----------------------------------------------
// // // Build silhouette for popup competitor cards
// // // -----------------------------------------------
// // function buildPopupSilhouette() {
// //   return (
// //     '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">' +
// //       '<rect width="80" height="80" fill="#e2e8f0"/>' +
// //       '<circle cx="40" cy="28" r="16" fill="#b0bec5"/>' +
// //       '<ellipse cx="40" cy="75" rx="26" ry="20" fill="#b0bec5"/>' +
// //     '</svg>'
// //   );
// // }

// // // -----------------------------------------------
// // // Build one competitor mini-card (horizontal scroll)
// // // -----------------------------------------------
// // function buildCompetitorCard(candidate, isSelected) {
// //   var hasPhoto = candidate.photo && candidate.photo.length > 0;
// //   var photoHTML = hasPhoto
// //     ? '<img src="' + candidate.photo + '" alt="' + candidate.name + '" style="width:100%;height:100%;object-fit:cover;object-position:top" />'
// //     : buildPopupSilhouette();

// //   var iconPath = PARTY_ICONS[candidate.party_short];
// //   var badgeHTML = iconPath
// //     ? '<div class="popup-competitor__badge"><img src="' + iconPath + '" alt="' + candidate.party_short + '"/></div>'
// //     : '<div class="popup-competitor__badge" style="background:' + candidate.accent + '"><span>' + (candidate.party_short || '').slice(0,3) + '</span></div>';

// //   var selectedClass = isSelected ? ' popup-competitor--selected' : '';

// //   return (
// //     '<div class="popup-competitor' + selectedClass + '" style="border-color:' + (isSelected ? candidate.accent : 'transparent') + '">' +
// //       '<div class="popup-competitor__photo" style="background:' + candidate.bg + '">' +
// //         photoHTML +
// //         badgeHTML +
// //       '</div>' +
// //       '<div class="popup-competitor__name">' + candidate.name + '</div>' +
// //       '<div class="popup-competitor__constituency">' + candidate.constituency + '</div>' +
// //       '<div class="popup-competitor__party" style="background:' + candidate.bg + ';color:' + candidate.accent + '">' + candidate.party_short + '</div>' +
// //     '</div>'
// //   );
// // }

// // // -----------------------------------------------
// // // Build full popup HTML for a candidate
// // // -----------------------------------------------
// // function buildPopupHTML(candidate) {
// //   // Find competitors in same constituency from allCandidatesByConstituency
// //   var constKey = (candidate.constituency || '').toUpperCase();
// //   var allInConst = (allCandidatesByConstituency && allCandidatesByConstituency[constKey]) || [];

// //   // Build competitors HTML (all candidates in constituency, mark selected)
// //   var competitorsHTML = '';
// //   if (allInConst.length > 0) {
// //     competitorsHTML = allInConst.map(function(comp) {
// //       var isSelf = String(comp.id) === String(candidate.id);
// //       // Merge photo from candidates.js data if available
// //       if (isSelf && candidate.photo) comp.photo = candidate.photo;
// //       return buildCompetitorCard(comp, isSelf);
// //     }).join('');
// //   } else {
// //     competitorsHTML = '<div class="popup-competitors__empty">No competitor data available</div>';
// //   }

// //   // Photo for selected candidate
// //   var hasPhoto = candidate.photo && candidate.photo.length > 0;
// //   var mainPhotoHTML = hasPhoto
// //     ? '<img src="' + candidate.photo + '" alt="' + candidate.name + '" class="popup-main__photo-img" />'
// //     : '<div class="popup-main__photo-placeholder">' + buildPopupSilhouette() + '</div>';

// //   // Personal details rows
// //   var personalRows = [
// //     { label: 'Full Name',    value: candidate.name || '—' },
// //     { label: 'Age',         value: candidate.age ? candidate.age + ' Years' : '—' },
// //     { label: 'Gender',      value: candidate.gender ? (candidate.gender.charAt(0).toUpperCase() + candidate.gender.slice(1)) : '—' },
// //     { label: 'Address',     value: candidate.address || '—' },
// //   ];

// //   var personalHTML = personalRows.map(function(row) {
// //     return (
// //       '<div class="popup-details__row">' +
// //         '<span class="popup-details__label">' + row.label + '</span>' +
// //         '<span class="popup-details__value">: ' + row.value + '</span>' +
// //       '</div>'
// //     );
// //   }).join('');

// //   // Political details rows
// //   var politicalRows = [
// //     { label: 'Party',            value: candidate.party_full || candidate.party_short || '—' },
// //     { label: 'Constituency',     value: candidate.constituency || '—' },
// //     { label: 'State',            value: 'Tamil Nadu' },
// //     { label: 'Total Competitors',value: allInConst.length > 0 ? (allInConst.length - 1) + ' Candidates' : '—' },
// //   ];

// //   var politicalHTML = politicalRows.map(function(row) {
// //     return (
// //       '<div class="popup-details__row">' +
// //         '<span class="popup-details__label">' + row.label + '</span>' +
// //         '<span class="popup-details__value">: ' + row.value + '</span>' +
// //       '</div>'
// //     );
// //   }).join('');

// //   return (
// //     '<div class="popup-overlay" id="candidate-popup-overlay">' +
// //       '<div class="popup-modal" role="dialog" aria-modal="true">' +

// //         // Header
// //         '<div class="popup-header">' +
// //           '<button class="popup-header__back" id="popup-close-btn" aria-label="Close">' +
// //             '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
// //           '</button>' +
// //           '<span class="popup-header__title">Candidate Details</span>' +
// //           '<button class="popup-header__close" id="popup-close-x" aria-label="Close">' +
// //             '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
// //           '</button>' +
// //         '</div>' +

// //         // Scrollable body
// //         '<div class="popup-body">' +

// //           // Main candidate section
// //           '<div class="popup-main">' +
// //             '<div class="popup-main__photo-wrap" style="background:' + candidate.bg + '">' +
// //               mainPhotoHTML +
// //             '</div>' +
// //             '<div class="popup-main__info">' +
// //               '<h2 class="popup-main__name">' + candidate.name + '</h2>' +
// //               '<div class="popup-main__constituency-pill" style="background:' + candidate.bg + ';color:' + candidate.accent + '">' + candidate.constituency + '</div>' +
// //               '<div class="popup-main__party">' + (candidate.party_full || candidate.party_short) + '</div>' +
// //             '</div>' +
// //           '</div>' +

// //           // 2026 Competitors section
// //           '<div class="popup-competitors">' +
// //             '<div class="popup-competitors__title">2026 Competitors</div>' +
// //             '<div class="popup-competitors__scroll">' +
// //               competitorsHTML +
// //             '</div>' +
// //           '</div>' +

// //           // Details grid
// //           '<div class="popup-details-grid">' +
// //             '<div class="popup-details-col">' +
// //               '<div class="popup-details__heading">Personal Details</div>' +
// //               personalHTML +
// //             '</div>' +
// //             '<div class="popup-details-col">' +
// //               '<div class="popup-details__heading">Political Details</div>' +
// //               politicalHTML +
// //             '</div>' +
// //           '</div>' +

// //         '</div>' + // popup-body

// //       '</div>' + // popup-modal
// //     '</div>'    // popup-overlay
// //   );
// // }

// // // -----------------------------------------------
// // // Open popup
// // // -----------------------------------------------
// // function openCandidatePopup(candidate) {
// //   // Remove existing popup if any
// //   var existing = document.getElementById('candidate-popup-overlay');
// //   if (existing) existing.remove();

// //   // Inject popup
// //   var div = document.createElement('div');
// //   div.innerHTML = buildPopupHTML(candidate);
// //   document.body.appendChild(div.firstChild);

// //   // Prevent body scroll
// //   document.body.style.overflow = 'hidden';

// //   // Close handlers
// //   function closePopup() {
// //     var overlay = document.getElementById('candidate-popup-overlay');
// //     if (overlay) {
// //       overlay.classList.add('popup-overlay--closing');
// //       setTimeout(function() { overlay.remove(); }, 220);
// //     }
// //     document.body.style.overflow = '';
// //   }

// //   document.getElementById('popup-close-btn').addEventListener('click', closePopup);
// //   document.getElementById('popup-close-x').addEventListener('click', closePopup);

// //   // Close on overlay click (outside modal)
// //   document.getElementById('candidate-popup-overlay').addEventListener('click', function(e) {
// //     if (e.target === this) closePopup();
// //   });

// //   // Close on Escape key
// //   function onKeyDown(e) {
// //     if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', onKeyDown); }
// //   }
// //   document.addEventListener('keydown', onKeyDown);
// // }

// // // -----------------------------------------------
// // // Wire up card clicks — called after cards render
// // // -----------------------------------------------
// // function initCandidatePopupClicks() {
// //   document.getElementById('candidates-grid').addEventListener('click', function(e) {
// //     var card = e.target.closest('.candidate-card');
// //     if (!card) return;

// //     var candidateId = card.dataset.candidateId;
// //     if (!candidateId) return;

// //     // Find candidate in all tab arrays
// //     var allArrays = [
// //       typeof popularCandidates !== 'undefined'      ? popularCandidates      : [],
// //       typeof celebrityCandidates !== 'undefined'    ? celebrityCandidates    : [],
// //       typeof experiencedCandidates !== 'undefined'  ? experiencedCandidates  : [],
// //       typeof professionalCandidates !== 'undefined' ? professionalCandidates : [],
// //     ];
// //     var candidate = null;
// //     for (var i = 0; i < allArrays.length; i++) {
// //       candidate = allArrays[i].find(function(c) { return String(c.id) === String(candidateId); });
// //       if (candidate) break;
// //     }

// //     if (candidate) openCandidatePopup(candidate);
// //   });
// // }

// // document.addEventListener('DOMContentLoaded', initCandidatePopupClicks);

// // ============================================
// // js/candidates/candidate-popup.js
// // Candidate detail popup — matches Figma design
// // ============================================

// // ============================================
// // js/candidates/candidate-popup.js
// // Candidate detail popup — matches Figma design
// // ============================================

// // -----------------------------------------------
// // Silhouette SVG for missing photos
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
// // Alliance colour lookup
// // -----------------------------------------------
// var POPUP_ALLIANCE_PARTIES = {
//   NDA: ['ADMK','AIADMK','BJP','PMK','AMMK','TMC','IJK','PBK','PNK','STMK','TM-BSP','SIFB','TMMK'],
//   SPA: ['DMK','INC','CPI','CPI(M)','CPM','VCK','MDMK','DMDK','IUML','KMDK','MMK','MJK','MPP','SDPI','TDK'],
//   TVK: ['TVK'],
//   NTK: ['NTK']
// };
// var POPUP_ALLIANCE_COLOURS = {
//   NDA: { bg: '#F97256', bar: '#FDA29B', text: '#000000' },
//   SPA: { bg: '#6172F3', bar: '#A4BCFD', text: '#000000' },
//   TVK: { bg: '#FEDF89', bar: '#FDB022', text: '#000000' },
//   NTK: { bg: '#D1FADF', bar: '#039855', text: '#000000' }
// };

// function getPopupColours(partyShort) {
//   var p = (partyShort || '').trim();
//   for (var a in POPUP_ALLIANCE_PARTIES) {
//     if (POPUP_ALLIANCE_PARTIES[a].indexOf(p) !== -1) return POPUP_ALLIANCE_COLOURS[a];
//   }
//   return { bg: '#e2e8f0', bar: '#94a3b8', text: '#1a1a2e' };
// }

// // -----------------------------------------------
// // SORT competitors — major parties first, IND last
// //
// // Order logic:
// //   1. Selected candidate always FIRST
// //   2. Major rival parties in fixed priority order
// //   3. Other named parties (alliance members / small)
// //   4. IND (independent) always LAST
// //
// // Major party priority list (the 4 big ones):
// //   ADMK > DMK > NTK > TVK > BJP > INC > PMK
// // When selected party is one of these, it is skipped
// // (already placed first) and the rest follow in order.
// // -----------------------------------------------
// var MAJOR_PARTY_ORDER = ['ADMK','AIADMK','DMK','NTK','TVK','BJP','INC','PMK'];

// function getAllianceOf(partyShort) {
//   var p = (partyShort || '').trim();
//   for (var a in POPUP_ALLIANCE_PARTIES) {
//     if (POPUP_ALLIANCE_PARTIES[a].indexOf(p) !== -1) return a;
//   }
//   return 'OTHER';
// }

// function sortCompetitors(candidates, selectedId) {
//   var selected   = null;
//   var majors     = [];   // major party candidates (not selected, not IND)
//   var others     = [];   // small party / unlisted alliance
//   var independents = []; // IND

//   candidates.forEach(function(c) {
//     var isSelf   = String(c.id) === String(selectedId);
//     var partyKey = (c.party_short || '').trim();

//     if (isSelf) {
//       selected = c;
//       return;
//     }

//     if (partyKey === 'IND') {
//       independents.push(c);
//       return;
//     }

//     var isMajor = MAJOR_PARTY_ORDER.indexOf(partyKey) !== -1;
//     if (isMajor) {
//       majors.push(c);
//     } else {
//       others.push(c);
//     }
//   });

//   // Sort major candidates by MAJOR_PARTY_ORDER priority
//   majors.sort(function(a, b) {
//     var ai = MAJOR_PARTY_ORDER.indexOf((a.party_short || '').trim());
//     var bi = MAJOR_PARTY_ORDER.indexOf((b.party_short || '').trim());
//     return ai - bi;
//   });

//   // Sort small parties alphabetically by party name for consistency
//   others.sort(function(a, b) {
//     return (a.party_short || '').localeCompare(b.party_short || '');
//   });

//   // Final order: selected → majors → others → IND
//   var result = [];
//   if (selected) result.push(selected);
//   result = result.concat(majors).concat(others).concat(independents);
//   return result;
// }

// // -----------------------------------------------
// // Build one competitor mini-card
// // (floating photo above coloured body, like candidate cards)
// // -----------------------------------------------
// function buildCompetitorCard(comp, isSelf) {
//   var partyKey = (comp.party_short || '').trim();
//   var colours  = getPopupColours(partyKey);

//   // Party logo badge — use icon if available, else party short name text
//   var iconPath = typeof PARTY_ICONS !== 'undefined' ? PARTY_ICONS[partyKey] : null;
//   var badgeInner;
//   if (iconPath) {
//     badgeInner = '<img src="' + iconPath + '" alt="' + partyKey + '" style="width:100%;height:100%;object-fit:contain"/>';
//   } else {
//     // Show party short name as text (max 4 chars to fit)
//     var label = partyKey === 'IND' ? 'IND' : partyKey.slice(0, 4);
//     badgeInner = '<span style="font-size:5px;font-weight:900;color:#fff;line-height:1;text-align:center;display:block;padding:1px">' + label + '</span>';
//   }

//   var hasPhoto = comp.photo && comp.photo.length > 0;
//   var photoHTML = hasPhoto
//     ? '<img src="' + comp.photo + '" alt="' + comp.name + '" style="width:100%;height:100%;object-fit:cover;object-position:top center;display:block"/>'
//     : buildPopupSilhouette();

//   // Self gets a highlight ring
//   var selfRing = isSelf
//     ? 'outline:2.5px solid ' + colours.bg + ';outline-offset:2px;border-radius:var(--radius-md);'
//     : '';

//   // Party bar label — use short name, capped at 6 chars for tiny parties
//   var barLabel = partyKey.length > 6 ? partyKey.slice(0, 6) : partyKey;

//   return (
//     '<div class="pcomp-card" style="' + selfRing + '">' +

//       // Floating oval photo
//       '<div class="pcomp-card__photo-wrap">' + photoHTML + '</div>' +

//       // Coloured body
//       '<div class="pcomp-card__body" style="background:' + colours.bg + '">' +
//         '<p class="pcomp-card__name" style="color:' + colours.text + '">' + (comp.name || '').trim() + '</p>' +
//         '<p class="pcomp-card__const" style="color:' + colours.text + '">' + (comp.constituency || '').trim() + '</p>' +

//         // Party logo / initials circle — bottom-left
//         '<div class="pcomp-card__logo" style="background:' + (iconPath ? '#fff' : colours.bar) + '">' +
//           badgeInner +
//         '</div>' +

//         // Party name bar — bottom
//         '<div class="pcomp-card__bar" style="background:' + colours.bar + '">' +
//           '<span style="color:#fff;font-size:9px;font-weight:800;letter-spacing:.02em">' + barLabel + '</span>' +
//         '</div>' +
//       '</div>' +

//     '</div>'
//   );
// }

// // -----------------------------------------------
// // Wins / Losses progress bar
// // -----------------------------------------------
// function buildWinsBar(wins, losses) {
//   if (wins === undefined || wins === null) return '';
//   var w     = parseInt(wins)   || 0;
//   var l     = parseInt(losses) || 0;
//   var total = w + l;
//   var pct   = total > 0 ? Math.round((w / total) * 100) : 0;
//   return (
//     '<div class="popup-wins-wrap">' +
//       '<div class="popup-wins-label">History of Elections</div>' +
//       '<div class="popup-wins-counts">' +
//         '<span class="popup-wins-w">' + w + ' Wins</span>' +
//         '<span class="popup-wins-l">' + l + ' Losses</span>' +
//       '</div>' +
//       '<div class="popup-wins-bar">' +
//         '<div class="popup-wins-bar__fill" style="width:' + pct + '%"></div>' +
//       '</div>' +
//     '</div>'
//   );
// }

// // -----------------------------------------------
// // Build full popup HTML
// // -----------------------------------------------
// function buildPopupHTML(candidate) {
//   var partyKey = (candidate.party_short || '').trim();
//   var colours  = getPopupColours(partyKey);

//   // --- Fetch all candidates in same constituency ---
//   var constKey   = (candidate.constituency || '').toUpperCase();
//   var allInConst = (typeof allCandidatesByConstituency !== 'undefined' && allCandidatesByConstituency[constKey]) || [];

//   // Merge real photo onto self entry from constituency list
//   var merged = allInConst.map(function(comp) {
//     if (String(comp.id) === String(candidate.id) && candidate.photo) {
//       return Object.assign({}, comp, { photo: candidate.photo });
//     }
//     return comp;
//   });

//   // Sort: selected first → major parties → small parties → IND
//   var competitors = allInConst.filter(function(comp) {
//     return String(comp.id) !== String(candidate.id);
//   });
 
//   var sorted = sortCompetitors(competitors);

//   var competitorsHTML = sorted.length > 0
//     ? sorted.map(function(comp) {
//         return buildCompetitorCard(comp, String(comp.id) === String(candidate.id));
//       }).join('')
//     : '<div class="popup-competitors__empty">No competitor data available</div>';

//   // --- Main candidate photo ---
//   var hasPhoto = candidate.photo && candidate.photo.length > 0;
//   var mainPhotoHTML = hasPhoto
//     ? '<img src="' + candidate.photo + '" alt="' + candidate.name + '" class="popup-main__photo-img"/>'
//     : '<div class="popup-main__photo-placeholder">' + buildPopupSilhouette() + '</div>';

//   // --- Optional fields ---
//   var contestingHTML = candidate.contesting
//     ? '<div class="popup-main__contesting" style="color:' + colours.bg + '">Contesting ' + candidate.contesting + '</div>'
//     : '';

//   var winsHTML = buildWinsBar(candidate.wins, candidate.losses);

//   // --- Detail rows builder ---
//   function rows(arr) {
//     return arr.map(function(r) {
//       return (
//         '<div class="popup-details__row">' +
//           '<span class="popup-details__label">' + r.label + '</span>' +
//           '<span class="popup-details__value">: ' + r.value + '</span>' +
//         '</div>'
//       );
//     }).join('');
//   }

//  var personalRows = [
//   { label: 'Full Name',     value: (candidate.full_name  || candidate.name || '—').trim() },
//   { label: 'Date of Birth', value: candidate.date_of_birth || '—' },
//   { label: 'Birth Place',   value: candidate.birth_place   || '—' },
//   { label: 'Father',        value: candidate.father        || '—' },
//   { label: 'Children',      value: candidate.children      || '—' },
// ];

// var politicalRows = [
//   { label: 'Party',                value: candidate.party_short            || '—' },
//   { label: 'Constituency',         value: candidate.constituency     || '—' },
//   { label: 'Current Position',     value: candidate.current_position || '—' },
//   { label: 'First Elected as MLA', value: candidate.first_elected_as_mla || '—' },
//   { label: 'Political Experience', value: candidate.political_experience  || '—' },
// ];

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

//           // Top row: left info + right competitors
//           '<div class="popup-top-row">' +

//             '<div class="popup-left">' +
//               '<div class="popup-main__photo-wrap">' + mainPhotoHTML + '</div>' +
//               '<div class="popup-main__info">' +
//                 '<h2 class="popup-main__name" style="color:' + colours.bg + '">' + (candidate.name || '').trim() + '</h2>' +
//                 '<div class="popup-main__constituency-pill" style="background:' + colours.bg + ';color:#fff">' +
//                   (candidate.constituency || '').toUpperCase() +
//                 '</div>' +
//                 '<div class="popup-main__party">' + (candidate.party_full || partyKey) + '</div>' +
//                 contestingHTML +
//                 winsHTML +
//               '</div>' +
//             '</div>' +

//             '<div class="popup-right">' +
//               '<div class="popup-competitors__title">2026 Competitors</div>' +
//               '<div class="popup-competitors__scroll">' + competitorsHTML + '</div>' +
//             '</div>' +

//           '</div>' +

//           // Details grid (bottom)
//           '<div class="popup-details-grid">' +
//             '<div class="popup-details-col">' +
//               '<div class="popup-details__heading">Personal Details</div>' +
//               rows(personalRows) +
//             '</div>' +
//             '<div class="popup-details-col">' +
//               '<div class="popup-details__heading">Political Details</div>' +
//               rows(politicalRows) +
//             '</div>' +
//           '</div>' +
//           '<div>'+

//         '</div>' +
//       '</div>' +
//     '</div>'
//   );
// }

// // -----------------------------------------------
// // Open popup
// // -----------------------------------------------
// function openCandidatePopup(candidate) {
//   var existing = document.getElementById('candidate-popup-overlay');
//   if (existing) existing.remove();

//   var div = document.createElement('div');
//   div.innerHTML = buildPopupHTML(candidate);
//   document.body.appendChild(div.firstChild);
//   document.body.style.overflow = 'hidden';

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
//   document.getElementById('candidate-popup-overlay').addEventListener('click', function(e) {
//     if (e.target === this) closePopup();
//   });
//   function onKey(e) {
//     if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', onKey); }
//   }
//   document.addEventListener('keydown', onKey);
// }

// // -----------------------------------------------
// // Wire up card clicks
// // -----------------------------------------------
// function initCandidatePopupClicks() {
//   var grid = document.getElementById('candidates-grid');
//   if (!grid) return;

//   grid.addEventListener('click', function(e) {
//     var card = e.target.closest('.candidate-card');
//     if (!card || !card.dataset.candidateId) return;

//     var id = card.dataset.candidateId;
//     var allArrays = [
//       typeof popularCandidates      !== 'undefined' ? popularCandidates      : [],
//       typeof celebrityCandidates    !== 'undefined' ? celebrityCandidates    : [],
//       typeof experiencedCandidates  !== 'undefined' ? experiencedCandidates  : [],
//       typeof professionalCandidates !== 'undefined' ? professionalCandidates : [],
//     ];
//     var found = null;
//     for (var i = 0; i < allArrays.length; i++) {
//       found = allArrays[i].find(function(c) { return String(c.id) === String(id); });
//       if (found) break;
//     }
//     if (found) openCandidatePopup(found);
//   });
// }

// document.addEventListener('DOMContentLoaded', initCandidatePopupClicks);
// function attachCardClickHandlers() {
//   var grid = document.getElementById('candidates-grid');
//   if (!grid) return;
 
//   grid.addEventListener('click', function(e) {
//     var card = e.target.closest('.candidate-card');
//     if (!card) return;
 
//     var candidateId = card.dataset.candidateId;
//     if (!candidateId) return;
 
//     var allArrays = [
//       typeof popularCandidates      !== 'undefined' ? popularCandidates      : [],
//       typeof celebrityCandidates    !== 'undefined' ? celebrityCandidates    : [],
//       typeof experiencedCandidates  !== 'undefined' ? experiencedCandidates  : [],
//       typeof professionalCandidates !== 'undefined' ? professionalCandidates : []
//     ];
 
//     var found = null;
//     for (var i = 0; i < allArrays.length && !found; i++) {
//       for (var j = 0; j < allArrays[i].length; j++) {
//         if (String(allArrays[i][j].id) === String(candidateId)) {
//           found = allArrays[i][j];
//           break;
//         }
//       }
//     }
 
//     if (found) openPopup(found);
//   });
// }
 
// document.addEventListener('DOMContentLoaded', function() {
//   ensurePopupDOM();
//   attachCardClickHandlers();
// });
 // ============================================
// js/candidates/candidate-popup.js
// Candidate detail popup — matches Figma design (Image 1)
//
// Sections:
//   1. Header (back + title + close)
//   2. Top row: LEFT = photo + name + constituency + party + wins/losses
//               RIGHT = 2026 Competitors (horizontal scroll)
//   3. Personal Details + Political Details (2-col grid)
//   4. About section
//   5. Additional Details: contested constituencies pills,
//      Cases count, Social media links
//   6. Election History table: Constituency | Year | Party | Result
// ============================================

// -----------------------------------------------
// Silhouette SVG
// -----------------------------------------------
function buildPopupSilhouette() {
  return (
    '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">' +
      '<rect width="80" height="80" fill="#e2e8f0"/>' +
      '<circle cx="40" cy="28" r="16" fill="#b0bec5"/>' +
      '<ellipse cx="40" cy="75" rx="26" ry="20" fill="#b0bec5"/>' +
    '</svg>'
  );
}

// -----------------------------------------------
// Alliance colour lookup
// -----------------------------------------------
var POPUP_ALLIANCE_PARTIES = {
  NDA:  ['ADMK','AIADMK','BJP','PMK','AMMK','TMC','IJK','PBK','PNK','STMK','TM-BSP','SIFB','TMMK'],
  SPA:  ['DMK','INC','CPI','CPI(M)','CPM','VCK','MDMK','DMDK','IUML','KMDK','MMK','MJK','MPP','SDPI','TDK'],
  TVK:  ['TVK'],
  NTK:  ['NTK']
};
var POPUP_ALLIANCE_COLOURS = {
  NDA:  { bg: '#F97256', bar: '#FDA29B', text: '#000' },
  SPA:  { bg: '#6172F3', bar: '#A4BCFD', text: '#000' },
  TVK:  { bg: '#FEDF89', bar: '#FDB022', text: '#000' },
  NTK:  { bg: '#D1FADF', bar: '#039855', text: '#000' }
};

function getPopupColours(partyShort) {
  var p = (partyShort || '').trim();
  for (var a in POPUP_ALLIANCE_PARTIES) {
    if (POPUP_ALLIANCE_PARTIES[a].indexOf(p) !== -1) return POPUP_ALLIANCE_COLOURS[a];
  }
  return { bg: '#94a3b8', bar: '#cbd5e1', text: '#1a1a2e' };
}

// -----------------------------------------------
// Fetch rich data for a candidate from starCandidatesRich
// -----------------------------------------------
function getRichData(candidateId) {
  if (typeof starCandidatesRich !== 'undefined') {
    return starCandidatesRich[String(candidateId)] || starCandidatesRich[candidateId] || null;
  }
  return null;
}

// -----------------------------------------------
// Build competitor mini-card
// -----------------------------------------------
function buildCompetitorCard(comp) {
  var partyKey  = (comp.party_short || '').trim();
  var colours   = getPopupColours(partyKey);
  var iconPath  = (typeof PARTY_ICONS !== 'undefined') ? PARTY_ICONS[partyKey] : null;

  var badgeInner = iconPath
    ? '<img src="' + iconPath + '" alt="' + partyKey + '" style="width:100%;height:100%;object-fit:contain"/>'
    : '<span style="font-size:5px;font-weight:900;color:#fff;line-height:1;text-align:center;display:block;padding:1px">' + partyKey.slice(0,4) + '</span>';

  var hasPhoto = comp.photo && comp.photo.length > 0;
  var photoHTML = hasPhoto
    ? '<img src="' + comp.photo + '" alt="' + comp.name + '" style="width:100%;height:100%;object-fit:cover;object-position:top center;display:block"/>'
    : buildPopupSilhouette();

  return (
    '<div class="pcomp-card">' +
      '<div class="pcomp-card__photo-wrap">' + photoHTML + '</div>' +
      '<div class="pcomp-card__body" style="background:' + colours.bg + '">' +
        '<p class="pcomp-card__name" style="color:' + colours.text + '">' + (comp.name || '').trim() + '</p>' +
        '<p class="pcomp-card__const" style="color:' + colours.text + '">' + (comp.constituency || '').trim() + '</p>' +
        '<div class="pcomp-card__logo" style="background:' + (iconPath ? '#fff' : colours.bar) + '">' + badgeInner + '</div>' +
        '<div class="pcomp-card__bar" style="background:' + colours.bar + '">' +
          '<span style="color:#fff;font-size:9px;font-weight:800;letter-spacing:.02em">' + partyKey.slice(0,6) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

// -----------------------------------------------
// Wins / Losses bar
// -----------------------------------------------
function buildWinsBar(wins, losses) {
  var w     = parseInt(wins)   || 0;
  var l     = parseInt(losses) || 0;
  var total = w + l;
  var pct   = total > 0 ? Math.round((w / total) * 100) : 0;
  return (
    '<div class="popup-wins-wrap">' +
      '<div class="popup-wins-label">History of Elections</div>' +
      '<div class="popup-wins-counts">' +
        '<span class="popup-wins-w">' + w + ' Wins</span>' +
        '<span class="popup-wins-l">' + l + ' Losses</span>' +
      '</div>' +
      '<div class="popup-wins-bar">' +
        '<div class="popup-wins-bar__fill" style="width:' + pct + '%"></div>' +
      '</div>' +
    '</div>'
  );
}

// -----------------------------------------------
// Social media icons SVGs
// -----------------------------------------------
var SOCIAL_ICONS = {
  twitter:   '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
  facebook:  '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
};

// -----------------------------------------------
// Build Additional Details section (Image 1 style)
// -----------------------------------------------
function buildAdditionalDetails(rich, colours) {
  if (!rich) return '';

  // Contested Constituencies pills
  var constPills = (rich.contested_constituencies || []).map(function(c) {
    return '<span class="popup-add__const-pill">' + c + '</span>';
  }).join('');

  var constHTML = constPills
    ? '<div class="popup-add__const-wrap">' + constPills + '</div>'
    : '';

  // Cases
  var casesHTML = (rich.cases !== undefined && rich.cases !== null)
    ? '<div class="popup-add__stat"><span class="popup-add__stat-label">Cases</span><span class="popup-add__stat-val">' + (String(rich.cases).padStart(2,'0')) + '</span></div>'
    : '';

  // Social media
  var smLinks = '';
  if (rich.social_twitter)   smLinks += '<a href="' + rich.social_twitter   + '" target="_blank" class="popup-add__social popup-add__social--tw">'  + SOCIAL_ICONS.twitter   + '</a>';
  if (rich.social_instagram) smLinks += '<a href="' + rich.social_instagram + '" target="_blank" class="popup-add__social popup-add__social--ig">'  + SOCIAL_ICONS.instagram + '</a>';
  if (rich.social_facebook)  smLinks += '<a href="' + rich.social_facebook  + '" target="_blank" class="popup-add__social popup-add__social--fb">'  + SOCIAL_ICONS.facebook  + '</a>';

  var smHTML = smLinks
    ? '<div class="popup-add__sm-wrap">' + smLinks + '</div>'
    : '';

  return (
    '<div class="popup-add-row">' +
      constHTML +
      casesHTML +
      smHTML +
    '</div>'
  );
}

// -----------------------------------------------
// Build Election History table
// -----------------------------------------------
function buildHistoryTable(history) {
  if (!history || history.length === 0) return '';

  var rows = history.map(function(h) {
    var isWon  = (h.result || '').toLowerCase().indexOf('won')  !== -1;
    var isLost = (h.result || '').toLowerCase().indexOf('lost') !== -1;
    var resultClass = isWon ? 'popup-hist__won' : (isLost ? 'popup-hist__lost' : 'popup-hist__other');
    return (
      '<tr>' +
        '<td class="popup-hist__td">' + (h.constituency || '') + '</td>' +
        '<td class="popup-hist__td">' + (h.year || '') + '</td>' +
        '<td class="popup-hist__td">' + (h.party || '') + '</td>' +
        '<td class="popup-hist__td"><span class="popup-hist__result ' + resultClass + '">' + (h.result || '') + '</span></td>' +
      '</tr>'
    );
  }).join('');

  return (
    '<div class="popup-hist-wrap">' +
      '<div class="popup-section-title">Election History</div>' +
      '<div class="popup-hist-scroll">' +
        '<table class="popup-hist-table">' +
          '<thead>' +
            '<tr>' +
              '<th class="popup-hist__th">Constituency</th>' +
              '<th class="popup-hist__th">Year</th>' +
              '<th class="popup-hist__th">Party</th>' +
              '<th class="popup-hist__th">Result</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>'
  );
}

// -----------------------------------------------
// Build full popup HTML
// -----------------------------------------------
function buildPopupHTML(candidate) {
  var partyKey  = (candidate.party_short || '').trim();
  var colours   = getPopupColours(partyKey);

  // Rich data from starCandidatesRich
  var rich = getRichData(candidate.id);

  // Merge rich data fields into candidate for display
  var displayName     = (rich && rich.full_name)     || candidate.name     || '';
  var dob             = (rich && rich.date_of_birth) || candidate.dob      || '—';
  var birthPlace      = (rich && rich.birth_place)   || '—';
  var father          = (rich && rich.father)        || '—';
  var children        = (rich && rich.children)      || '—';
  var currentPos      = (rich && rich.current_position)    || '—';
  var firstElected    = (rich && rich.first_elected_as_mla) || '—';
  var polExp          = (rich && rich.political_experience) || '—';
  var aboutText       = (rich && rich.about)         || '';
  var wins            = (rich && rich.wins  != null) ? rich.wins   : (candidate.wins   || 0);
  var losses          = (rich && rich.losses != null) ? rich.losses : (candidate.losses || 0);

  // Competitors
  var constKey   = (candidate.constituency || '').toUpperCase();
  var allInConst = (typeof allCandidatesByConstituency !== 'undefined' && allCandidatesByConstituency[constKey]) || [];
  var rivals = allInConst
  .filter(function(c) { 
    return String(c.id) !== String(candidate.id); 
  })
  .sort(function(a, b) {
    var order = ['DMK', 'ADMK', 'NTK', 'TVK'];

    var aIndex = order.indexOf((a.party_short || '').trim());
    var bIndex = order.indexOf((b.party_short || '').trim());

    // If party not found, push to end
    if (aIndex === -1) aIndex = 999;
    if (bIndex === -1) bIndex = 999;

    return aIndex - bIndex;
  });

  var competitorsHTML = rivals.length > 0
    ? rivals.map(function(comp) { return buildCompetitorCard(comp); }).join('')
    : '<div class="popup-competitors__empty">No competitor data available</div>';

  // Main photo
  var hasPhoto = candidate.photo && candidate.photo.length > 0;
  var mainPhotoHTML = hasPhoto
    ? '<img src="' + candidate.photo + '" alt="' + candidate.name + '" class="popup-main__photo-img"/>'
    : '<div class="popup-main__photo-placeholder">' + buildPopupSilhouette() + '</div>';

  // Detail rows helper
  function detailRows(arr) {
    return arr.map(function(r) {
      return (
        '<div class="popup-details__row">' +
          '<span class="popup-details__label">' + r.label + '</span>' +
          '<span class="popup-details__value">: ' + r.value + '</span>' +
        '</div>'
      );
    }).join('');
  }

  var personalRows = [
    { label: 'Full Name',     value: displayName },
    { label: 'Date of Birth', value: dob },
    { label: 'Birth Place',   value: birthPlace },
    { label: 'Father',        value: father },
    { label: 'Children',      value: children },
  ];

  var politicalRows = [
    { label: 'Party',                value: candidate.party_full || partyKey || '—' },
    { label: 'Constituency',         value: candidate.constituency || '—' },
    { label: 'Current Position',     value: currentPos },
    { label: 'First Elected as MLA', value: firstElected },
    { label: 'Political Experience', value: polExp },
  ];

  // Additional details section
  var additionalHTML = buildAdditionalDetails(rich, colours);

  // About section
  var aboutHTML = aboutText
    ? '<div class="popup-about-wrap"><div class="popup-section-title">About</div><p class="popup-about-text">' + aboutText + '</p></div>'
    : '';

  // History table
  var historyHTML = rich ? buildHistoryTable(rich.history) : '';

  return (
    '<div class="popup-overlay" id="candidate-popup-overlay">' +
      '<div class="popup-modal" role="dialog" aria-modal="true">' +

        // ── HEADER ──
        '<div class="popup-header">' +
          '<button class="popup-header__back" id="popup-close-btn" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
          '</button>' +
          '<span class="popup-header__title">Candidate Details</span>' +
          '<button class="popup-header__close" id="popup-close-x" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>' +
        '</div>' +

        // ── SCROLLABLE BODY ──
        '<div class="popup-body">' +

          // TOP ROW: left info + right competitors
          '<div class="popup-top-row">' +

            '<div class="popup-left">' +
              '<div class="popup-main__photo-wrap">' + mainPhotoHTML + '</div>' +
              '<div class="popup-main__info">' +
                '<h2 class="popup-main__name" style="color:' + colours.bg + '">' + (candidate.name || '').trim() + '</h2>' +
                '<div class="popup-main__constituency-pill" style="background:' + colours.bg + ';color:#fff">' + (candidate.constituency || '').toUpperCase() + '</div>' +
                '<div class="popup-main__party">' + (candidate.party_full || partyKey) + '</div>' +
                buildWinsBar(wins, losses) +
              '</div>' +
            '</div>' +

            '<div class="popup-right">' +
              '<div class="popup-competitors__title">2026 Competitors</div>' +
              '<div class="popup-competitors__scroll">' + competitorsHTML + '</div>' +
            '</div>' +

          '</div>' +

          // PERSONAL + POLITICAL DETAILS
          '<div class="popup-details-grid">' +
            '<div class="popup-details-col">' +
              '<div class="popup-details__heading">Personal Details</div>' +
              detailRows(personalRows) +
            '</div>' +
            '<div class="popup-details-col">' +
              '<div class="popup-details__heading">Political Details</div>' +
              detailRows(politicalRows) +
            '</div>' +
          '</div>' +

          // ABOUT
          aboutHTML +

          // ADDITIONAL DETAILS (constituencies, cases, social)
          (additionalHTML
            ? '<div class="popup-additional-section">' +
                '<div class="popup-section-title">Additional Details</div>' +
                '<div class="popup-additional-box">' + additionalHTML + '</div>' +
              '</div>'
            : '') +

          // ELECTION HISTORY TABLE
          historyHTML +

        '</div>' + // popup-body
      '</div>' +   // popup-modal
    '</div>'       // popup-overlay
  );
}

// -----------------------------------------------
// Open popup
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
    if (overlay) {
      overlay.classList.add('popup-overlay--closing');
      setTimeout(function() { overlay.remove(); }, 220);
    }
    document.body.style.overflow = '';
  }

  document.getElementById('popup-close-btn').addEventListener('click', closePopup);
  document.getElementById('popup-close-x').addEventListener('click', closePopup);
  document.getElementById('candidate-popup-overlay').addEventListener('click', function(e) {
    if (e.target === this) closePopup();
  });
  function onKey(e) {
    if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', onKey); }
  }
  document.addEventListener('keydown', onKey);
}

// -----------------------------------------------
// Wire up card clicks
// -----------------------------------------------
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
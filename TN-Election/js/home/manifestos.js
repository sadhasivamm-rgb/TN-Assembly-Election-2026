// /**
//  * manifestos.js
//  * Renders the Manifestos section with hover View / Download
//  * and an inline PDF viewer modal.
//  */

// // ── DATA ──────────────────────────────────────────────────────────────────────
// window.MANIFESTOS_DATA = [
//   {
//     id: "dmk",
//     label: "DMK Manifesto",
//     image: "../assets/manifesto/dmk.png",
//     pdf: "../assets/manifesto/pdf/dmk-manifesto.pdf",
//   },
//   {
//     id: "admk",
//     label: "ADMK Manifesto",
//     image: "../assets/manifesto/aiadmk.jpg",
//     pdf: "../assets/manifesto/pdf/admk-manifesto.pdf",
//   },
//   {
//     id: "tvk",
//     label: "TVK Manifesto",
//     image: "../assets/manifesto/tvk.jpg",
//     pdf: "../assets/manifesto/pdf/tvk-manifesto.pdf",
//   },
//   {
//     id: "ntk",
//     label: "NTK Manifesto",
//     image: "../assets/manifesto/ntk.png",
//     pdf: "../assets/manifesto/pdf/ntk-manifesto.pdf",
//   },
//   {
//     id: "inc",
//     label: "INC Manifesto",
//     image: "../assets/manifesto/inc.png",
//     pdf: "../assets/manifesto/pdf/inc-manifesto.pdf",
//   },
// ];

// // ── RENDER ────────────────────────────────────────────────────────────────────
// (function renderManifestos() {
//   const container = document.getElementById("manifestos-container");
//   console.log(container);
//   if (!container) return;

//   // const cards = window.MANIFESTOS_DATA.map((m) => `
//   //   <div class="manifesto-card" data-id="${m.id}">
//   //     <img
//   //       class="manifesto-card__img"
//   //       src="${m.image}"
//   //       alt="${m.label}"
//   //     />
//   //     <div class="manifesto-card__overlay">
//   //       <button
//   //         class="manifesto-btn manifesto-btn--view"
//   //         onclick="openManifestoPdf('${m.id}')"
//   //       >
//   //         <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//   //           stroke="currentColor" stroke-width="2.5"
//   //           stroke-linecap="round" stroke-linejoin="round">
//   //           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//   //           <circle cx="12" cy="12" r="3"/>
//   //         </svg>
//   //         View
//   //       </button>
//   //       <a
//   //         class="manifesto-btn manifesto-btn--download"
//   //         href="${m.pdf}"
//   //         download="${m.label}.pdf"
//   //       >
//   //         <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//   //           stroke="currentColor" stroke-width="2.5"
//   //           stroke-linecap="round" stroke-linejoin="round">
//   //           <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
//   //           <polyline points="7 10 12 15 17 10"/>
//   //           <line x1="12" y1="15" x2="12" y2="3"/>
//   //         </svg>
//   //         Download
//   //       </a>
//   //     </div>
//   //   </div>
//   // `).join("");

//   // container.innerHTML = cards;

//  const cards = window.MANIFESTOS_DATA.map((m, i) => `
//     <div class="manifesto-card" data-id="${m.id}">
//       <img class="manifesto-card__img" src="${m.image}" alt="${m.label}" />
//       <div class="manifesto-card__overlay">
//         <div class="manifesto-card__overlay-title">${m.label}</div>
//         <button class="manifesto-btn manifesto-btn--view" onclick="openManifestoPdf('${m.id}')">
//           <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//             stroke="currentColor" stroke-width="2.5"
//             stroke-linecap="round" stroke-linejoin="round">
//             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//             <circle cx="12" cy="12" r="3"/>
//           </svg>
//           View
//         </button>
//         <a class="manifesto-btn manifesto-btn--download" href="${m.pdf}" download="${m.label}.pdf">
//           <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//             stroke="currentColor" stroke-width="2.5"
//             stroke-linecap="round" stroke-linejoin="round">
//             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
//             <polyline points="7 10 12 15 17 10"/>
//             <line x1="12" y1="15" x2="12" y2="3"/>
//           </svg>
//           Download
//         </a>
//       </div>
//     </div>
//   `).join("");

//   container.innerHTML = cards;
// })();

// // ── PDF VIEWER MODAL ──────────────────────────────────────────────────────────
// function openManifestoPdf(id) {
//   const m = window.MANIFESTOS_DATA.find((x) => x.id === id);
//   if (!m) return;

//   let overlay = document.getElementById("manifesto-pdf-overlay");

//   if (!overlay) {
//     overlay = document.createElement("div");
//     overlay.id = "manifesto-pdf-overlay";
//     overlay.className = "manifesto-pdf-overlay";
//     overlay.innerHTML = `
//       <div class="manifesto-pdf-modal">
//         <div class="manifesto-pdf-modal__header">
//           <span class="manifesto-pdf-modal__title" id="manifesto-pdf-modal-title"></span>
//           <div class="manifesto-pdf-modal__actions">
//             <a class="manifesto-pdf-modal__download-btn" id="manifesto-pdf-download-btn" download>
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="2.5"
//                 stroke-linecap="round" stroke-linejoin="round">
//                 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
//                 <polyline points="7 10 12 15 17 10"/>
//                 <line x1="12" y1="15" x2="12" y2="3"/>
//               </svg>
//               Download
//             </a>
//             <button class="manifesto-pdf-modal__close" onclick="closeManifestoPdf()" aria-label="Close">×</button>
//           </div>
//         </div>
//         <div class="manifesto-pdf-modal__body">
//           <iframe id="manifesto-pdf-iframe" class="manifesto-pdf-modal__iframe" title="Manifesto PDF"></iframe>
//         </div>
//       </div>
//     `;
//     document.body.appendChild(overlay);

//     overlay.addEventListener("click", (e) => {
//       if (e.target === overlay) closeManifestoPdf();
//     });

//     document.addEventListener("keydown", (e) => {
//       if (e.key === "Escape") closeManifestoPdf();
//     });
//   }

//   document.getElementById("manifesto-pdf-modal-title").textContent = m.label;
//   document.getElementById("manifesto-pdf-iframe").src = m.pdf;
//   const dlBtn = document.getElementById("manifesto-pdf-download-btn");
//   dlBtn.href = m.pdf;
//   dlBtn.download = `${m.label}.pdf`;

//   overlay.classList.add("active");
//   document.body.style.overflow = "hidden";
// }

// function closeManifestoPdf() {
//   const overlay = document.getElementById("manifesto-pdf-overlay");
//   if (!overlay) return;
//   overlay.classList.remove("active");
//   document.getElementById("manifesto-pdf-iframe").src = "";
//   document.body.style.overflow = "";
// }
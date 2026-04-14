// renderStats.js
import topCandidatesByAssets from "../../data/richest-candidate.js";
import topWinnersData from "../../data/high-margin-winner.js";

function getPartyFlag(pn) {
  const flags = {
    DMK: `<span class="flag dmk-flag"></span>`,
    AIADMK: `<span class="flag admk-flag"></span>`,
    TVK: `<span class="flag tvk-flag"></span>`,
  };
  return flags[pn] || `<span class="flag"></span>`;
}

function renderStats() {
  const container = document.getElementById("richest-candidates-container");
  if (!container) return;

  const richest = topCandidatesByAssets.top_candidates;
  const winners = topWinnersData.top_5_winners;

  const styles = `
    <style>
      .stats-card { display: flex; gap: 16px; font-size: 13px; font-family: sans-serif; }
      .stats-col { background: #fff; border: 0.5px solid #e0e0e0; border-radius: 12px; padding: 16px 18px; flex: 1; min-width: 0; }
      .stats-title { font-size: 15px; font-weight: 500; margin: 0 0 3px; }
      .stats-subtitle { font-size: 12px; color: #888; margin: 0 0 14px; line-height: 1.4; }
      .stats-table { width: 100%; border-collapse: collapse; }
      .stats-table th { font-size: 12px; font-weight: 500; color: #888; text-align: left; padding: 7px 8px; border-bottom: 0.5px solid #e5e5e5; }
      .stats-table td { padding: 9px 8px; border-bottom: 0.5px solid #e5e5e5; vertical-align: middle; }
      .stats-table tr:last-child td { border-bottom: none; }
      .highlight-header { background: #e8f5e9; color: #2e7d32 !important; border-radius: 6px 6px 0 0; text-align: right; }
      .highlight-cell { text-align: right; }
      .highlight-badge { background: #e8f5e9; color: #2e7d32; font-weight: 500; border-radius: 4px; padding: 4px 8px; white-space: nowrap; }
      .candidate-name { font-weight: 500; font-size: 13px; line-height: 1.3; }
      .party-row { display: flex; align-items: center; gap: 5px; margin-top: 3px; }
      .party-label { font-size: 11px; color: #888; }
      .flag { width: 16px; height: 11px; display: inline-block; border-radius: 1px; flex-shrink: 0; }
      .dmk-flag { background: linear-gradient(to bottom, #000 50%, #e00 50%); }
      .admk-flag { background: linear-gradient(to bottom, #e00 33%, #000 33%, #000 66%, #fff 66%); }
      .tvk-flag { background: linear-gradient(to bottom, #e00 33%, #000 33%, #000 66%, #e00 66%); }
    </style>
  `;

  container.innerHTML = styles + `
    <div class="stats-card">

      <!-- Left Table: Richest Candidates -->
      <div class="stats-col">
        <div class="stats-title">Richest Candidates</div>
        <div class="stats-subtitle">Candidates with highest assets declared as per the Affidavit</div>
        <table class="stats-table">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Constituency</th>
              <th class="highlight-header">Asset (in Rs)</th>
            </tr>
          </thead>
          <tbody>
            ${richest.map(c => {
              const cons = Array.isArray(c.cn) ? c.cn.join(" & ") : c.cn;
              return `
                <tr>
                  <td>
                    <div class="candidate-name">${c.name}</div>
                    <div class="party-row">
                      ${getPartyFlag(c.pn)}
                      <span class="party-label">${c.pn}</span>
                    </div>
                  </td>
                  <td>${cons}</td>
                  <td class="highlight-cell">
                    <span class="highlight-badge">${c.crores.toLocaleString("en-IN")} Cr</span>
                  </td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>

      <!-- Right Table: High Margin Winners -->
      <div class="stats-col">
        <div class="stats-title">2021 Elections High Margin Winner</div>
        <div class="stats-subtitle">Candidates with the highest winning/Leading votes</div>
        <table class="stats-table">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Constituency</th>
              <th class="highlight-header">Margin</th>
            </tr>
          </thead>
          <tbody>
            ${winners.map(w => `
              <tr>
                <td>
                  <div class="candidate-name">${w.cn}</div>
                  <div class="party-row">
                    ${getPartyFlag(w.pn)}
                    <span class="party-label">${w.pn}</span>
                  </div>
                </td>
                <td>${w.cons}</td>
                <td class="highlight-cell">
                  <span class="highlight-badge">~${w.margin.toLocaleString("en-IN")}+</span>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>

    </div>
  `;
}

renderStats();
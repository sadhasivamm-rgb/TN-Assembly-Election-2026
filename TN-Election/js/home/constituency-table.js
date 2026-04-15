/**
 * constituency-table.js
 * Default view: Tiruchirappalli
 * Search: Filters by District OR Constituency name
 */

function initializeTableStructure() {
    const container = document.getElementById('constituency-container');
    if (!container) return;

    container.innerHTML = `
        <div class="table-container">
            <div class="table-header">
                <h2>Constituency Details</h2>
                <div class="search-wrapper">
                    <input type="text" id="districtSearch" placeholder="Search District or Constituency...">
                </div>
            </div>
            <table class="constituency-table">
                <thead>
                    <tr>
                        <th style="width: 35%;">Name of the District</th>
                        <th style="width: 30%;">Name of the Constituency</th>
                        <th style="width: 35%;">Sitting MLA/Party</th>
                    </tr>
                </thead>
                <tbody id="tableBody"></tbody>
            </table>
        </div>
    `;
}

function renderTableRows(searchTerm = "") {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;

    const dataArray = Object.values(constituenciesData);
    let filtered;
    
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
        // DEFAULT: Show only Tiruchirappalli
        filtered = dataArray.filter(item => 
            item.district.toLowerCase() === "tiruchirappalli"
        );
    } else {
        // SEARCH: Match against District OR Constituency Name
        filtered = dataArray.filter(item => 
            item.district.toLowerCase().includes(term) || 
            item.name.toLowerCase().includes(term)
        );
    }

    const grouped = filtered.reduce((acc, curr) => {
        if (!acc[curr.district]) acc[curr.district] = [];
        acc[curr.district].push(curr);
        return acc;
    }, {});

    let html = "";
    const sortedDistricts = Object.keys(grouped).sort();

    for (const district of sortedDistricts) {
        const items = grouped[district];
        items.forEach((item, index) => {
            html += `<tr>`;
            if (index === 0) {
                html += `<td class="district-name" rowspan="${items.length}">${district}</td>`;
            }
            html += `
                <td>${item.name}</td>
                <td>${item.current_mla || 'Vacant'} / <span class="party-bold">${item.current_mla_party || '-'}</span></td>
            </tr>`;
        });
    }

    if (sortedDistricts.length === 0) {
        html = `<tr><td colspan="3" style="text-align:center; padding: 40px; color: #999;">No results found matching your search.</td></tr>`;
    }

    tableBody.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTableStructure();
    renderTableRows(); // Loads Tiruchirappalli by default

    const searchInput = document.getElementById('districtSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderTableRows(e.target.value);
        });
    }
});
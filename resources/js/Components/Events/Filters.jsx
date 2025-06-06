import React from 'react';

function Filters({ filterCity, setFilterCity, sortOrder, setSortOrder }) {
    return (
        <div className="filter-sort">
            <label>
                Filter by City:
                <input type="text" value={filterCity} onChange={(e) => setFilterCity(e.target.value)} placeholder="Enter city" />
            </label>
            <label>
                Sort by Date:
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </label>
        </div>
    );
}

export default Filters;

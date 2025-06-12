import React from 'react';
import "../../styles/Filters.css";

function Filters({ filterCity, setFilterCity, sortOrder, setSortOrder, filterDate,setFilterDate }) {
    return (
        <div className="filter-sort">
            <div>
            <label>
                Filter by City:
                <input type="text" value={filterCity} onChange={(e) => setFilterCity(e.target.value)} placeholder="Enter city" />
            </label>
            <label>
                Filter by Date:
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </label>
            </div>
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

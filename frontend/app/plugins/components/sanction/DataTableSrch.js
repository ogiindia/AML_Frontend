
import React from 'react'

export default function DataTableSrch({ rows }) {
    return (
        <div className="table">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Matched Name</th>
                        <th>Score</th>
                        <th>Sanction Name</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{r.searchStr || '-'}</td>
                            <td>{r.listMatchStr || '-'}</td>
                            <td>{(r.matchScore ?? 0)}</td>
                            <td>{r.sanctionName || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

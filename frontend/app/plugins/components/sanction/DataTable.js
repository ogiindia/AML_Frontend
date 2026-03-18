
import React from 'react'

export default function DataTable({ rows }) {
    return (
        <div className="table">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Customer Name</th>
                        <th>Sanction Name</th>
                        <th>Country</th>
                        <th>Confidence</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{r.customername || '-'}</td>
                            <td>{r.sanction_name || '-'}</td>
                            <td>{r.countryname || '-'}</td>
                            <td>{(r.confidence_percentage ?? 0)}</td>
                            <td>{r.status || 'Pending'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

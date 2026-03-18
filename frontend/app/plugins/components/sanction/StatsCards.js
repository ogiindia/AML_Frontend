
import React from 'react'

export default function StatsCards({ screened, hits, avgConf, updatedAt }) {
    return (
        <div className="kpi">
            <div className="card"><div className="badge">Screened</div><div style={{ fontSize: 28, fontWeight: 700 }}>{screened}</div></div>
            <div className="card"><div className="badge">Potential Hits</div><div style={{ fontSize: 28, fontWeight: 700 }}>{hits}</div></div>
            <div className="card"><div className="badge">Avg Confidence</div><div style={{ fontSize: 28, fontWeight: 700 }}>{avgConf.toFixed(2)}</div></div>
            <div className="card"><div className="badge">Updated</div><div style={{ fontSize: 18, fontWeight: 700 }}>{updatedAt}</div></div>
        </div>
    )
}

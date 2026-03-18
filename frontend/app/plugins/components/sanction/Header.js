import React from 'react'

export default function Header({ theme, setTheme, onExport, onClear, onUpload }) {
    return (
        <div className="header">
            <div>
                <div className="h-title">AML Sanction Screening</div>
                <div className="badge">Real-time checks · Multi-list · Investigator-ready</div>
            </div>
            <div className="actions">
                <button className="btn" onClick={onUpload}>Upload</button>
                <button className="btn" onClick={onExport}>Export</button>
                {/* <button className="btn danger">Clear</button> */}
            </div>
        </div>
    )
}

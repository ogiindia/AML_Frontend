
import React, { useRef } from 'react'
import Papa from 'papaparse'

export default function UploadCsv({ onRows }) {
    const ref = useRef()
    const handleFile = (file) => {
        Papa.parse(file, { header: true, skipEmptyLines: true, complete: (res) => onRows(res.data) })
    }
    return (
        <div>
            <input ref={ref} className="hidden" type="file" accept=".csv" onChange={e => handleFile(e.target.files[0])} />
            <button className="btn" onClick={() => ref.current.click()}>Upload CSV</button>
        </div>
    )
}

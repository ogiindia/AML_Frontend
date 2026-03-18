import React from 'react'

const ALL_LISTS = []

// Added onAdd prop
export default function SanctionSingleSelect({ selected, setSelected, options = [] }) {
    const listToRender = options.length > 0 ? options : ALL_LISTS;

    const toggle = (name) => {
        const s = new Set(selected)
        if (s.has(name)) s.delete(name); else s.add(name)
        setSelected([...s])
    }
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10 }}>
                <div style={{ fontWeight: 600 }}>Sanction List</div>

            </div>
            <div className="chips">
                {listToRender.map(name => (
                    <label key={name} className="chip">
                        <input type="checkbox" checked={selected.includes(name)} onChange={() => toggle(name)} />
                        <span>{name}</span>
                    </label>
                ))}
            </div>

        </div>
    )
}

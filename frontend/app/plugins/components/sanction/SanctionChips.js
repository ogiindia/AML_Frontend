import React from 'react'

const ALL_LISTS = []

// Added onAdd prop
export default function SanctionChips({ selected, setSelected, options = [], onAdd, onDelete }) {
    const listToRender = options.length > 0 ? options : ALL_LISTS;

    const toggle = (name) => {
        const s = new Set(selected)
        if (s.has(name)) s.delete(name); else s.add(name)
        setSelected([...s])
    }
    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 600 }}>CHOOSE SANCTIONS LISTS</div>

                <div style={{ width: "70%", alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', float: "right" }}

                    >
                        <input
                            type="checkbox"
                            checked={Array.isArray(options) && options.length > 0 && Array.isArray(selected) && selected.length === options.length}
                            onChange={(e) => {
                                if (!Array.isArray(options)) return;
                                setSelected(e.target.checked ? [...options] : []);
                            }}
                        />
                        <span style={{ fontWeight: 600 }}>All</span>
                    </label>
                </div>

                {/* Minus Button */}
                <button
                    onClick={onDelete}
                    style={{
                        background: 'oklch(0.5 0.23 28.62)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    -
                </button>

                {/* Plus Button */}
                <button
                    onClick={onAdd}
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    +
                </button>


            </div>
            <div className="chips">
                {listToRender.map(name => (
                    <label key={name} className="chip">
                        <input type="checkbox" checked={selected.includes(name)} onChange={() => toggle(name)} />
                        <span>{name}</span>
                    </label>
                ))}
            </div>
            <div className="footer"><span>{selected.length} selected</span></div>
        </div>
    )
}

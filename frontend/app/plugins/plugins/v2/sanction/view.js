import api from "@ais/api";
import {
    Col,
    CustomInput,
    CustomSelect,
    H1,
    H3,
    MutedBgLayout,
    NewButton,
    Row,
    toast,
    Button,
    SimpleCard
} from '@ais/components';

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../../../components/sanction/Header.js'
import SanctionChips from '../../../components/sanction/SanctionChips.js'
import SanctionSingleSelect from '../../../components/sanction/SanctionSingleSelect.js'
// import UploadCsv from '../../../components/sanction/UploadCsv.js'
import StatsCards from '../../../components/sanction/StatsCards.js'
import DataTable from '../../../components/sanction/DataTable.js'
import { fuzzyIncludes, confidenceFromScore } from '../../../components/sanction/matching.js'
import '../../../components/sanction/app.css'

import useRoleBasedNavigate from 'useRoleBasedNavigate';
const SUGGEST = 'ACME Trading FZ'



function View() {

    const [theme, setTheme] = useState('light')
    const [lists, setLists] = useState([])
    const [query, setQuery] = useState('')
    const [threshold, setThreshold] = useState(0.85)
    const [onboard, setOnboard] = useState(false)
    const [rawRows, setRawRows] = useState([])
    const [rows, setRows] = useState([])
    const [availableLists, setAvailableLists] = useState([])

    // dynamic colors for sanction chips (repeats palette for any number of lists)
    const chipColors = useMemo(() => {
        const palette = [
            '#ff9800', // orange
            '#8bc34a', // green
            '#1e88e5', // blue
            '#7b1fa2', // purple
            '#2196f3', // bright blue
            '#d32f2f', // red
            '#43a047', // dark green
            '#00acc1', // teal
            '#ff5722', // deep orange
            '#9c27b0', // violet
            '#4caf50', // mid green
            '#3f51b5', // indigo
        ];
        if (!Array.isArray(availableLists)) return [];
        const result = [];
        for (let i = 0; i < availableLists.length; i += 1) {
            result.push(palette[i % palette.length]);
        }
        return result;
    }, [availableLists]);

    const [showModal, setShowModal] = useState(false);
    const [deleteShowModal, setDeleteShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newSanctionName, setNewSanctionName] = useState('');
    const [newCountry, setNewCountry] = useState('');
    const { roleBasedNavigate } = useRoleBasedNavigate();
    const [confAverage, setConfAverage] = useState('');
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const [showUploadModal, setShowUploadModal] = useState(false);

    const [fileType, setFileType] = useState('CSV');

    const [selectedSanction, setSelectedSanction] = useState('');
    const [selectedDeleteSanction, setSelectedDeleteSanction] = useState('');


    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    useEffect(() => {
        fetchLists();
        fetchMatchedLists([]);
    }, [])

    const fetchLists = async () => {
        try {
            api.get('/app/rest/v1/getSanctionDetails', {
                sanctionName: ''
            }).then((res) => {

                const data = Array.isArray(res) ? res : (res && res.data) || [];

                if (Array.isArray(data)) {
                    const sanctionNames = data.map(item => item.sanction_name);

                    //setLists([sanctionNames]);
                    setAvailableLists(sanctionNames);
                    setSelectedSanction(prev => prev || (sanctionNames[0] || ''));
                    setSelectedDeleteSanction(prev => prev || (sanctionNames[0] || ''));

                    console.info("Sanction List Loaded: ", sanctionNames);
                } else {
                    console.warn("Unexpected API response format:", res);
                }
            });

        } catch (error) {
            console.error("Failed to fetch sanction lists", error);
            const defaults = ['OFAC (US)', 'EU', 'UN'];
            setLists(defaults);
            setAvailableLists(defaults);
        }
    };

    const handleSaveNewSanction = async () => {
        if (!newSanctionName || !newCountry) {
            //alert("Please fill in both fields");
            toast({ title: 'Please fill in both fields', variant: 'validaton' });
            return;
        }

        try {
            await api.post('/app/rest/v1/setSanctionDetails', {
                sanction_name: newSanctionName,
                country: newCountry,
                list_type: listType
            });

            console.log('Saved Successfully');
            toast({ title: 'Sanction saved successfully', variant: 'success' });
            //alert('Sanction saved successfully!');
            setShowModal(false);
            setNewSanctionName('');
            setNewCountry('');
            fetchLists();

        } catch (error) {

            console.error("Save failed", error);
            toast({ title: 'Failed to save sanction!', description: err?.message || '', variant: 'error' });
            //alert('Failed to save sanction!');

        }
    };

    const deleteSanction = async () => {

        try {
            await api.post('/app/rest/v1/deleteSanctionDetails', {
                sanction_name: selectedDeleteSanction
            });

            console.log('Deleted Successfully');
            toast({ title: 'Sanction deleted successfully', variant: 'success' });
            setDeleteShowModal(false);
            fetchLists();
        } catch (error) {

            console.error("Delete failed", error);
            toast({ title: 'Failed to delete sanction!', description: error?.message || '', variant: 'error' });
            //alert('Failed to delete sanction!');

        }
    };

    const handleClearPopup = () => {
        setNewSanctionName('');
        setNewCountry('');
    }
    const handleUploadSanctionList = async () => {

        if (!selectedSanction) {
            alert('Please select a sanction list to upload into');
            //toast({ title: 'Please select a sanction list to upload into', variant: 'validaton' });
            return;
        }
        if (!files || files.length === 0) {
            //toast({ title: 'Please select a file', variant: 'validaton' });
            alert('Please select a file');
            return;
        }

        const file = files[0];
        const formData = new FormData();
        formData.append('sanctionName', selectedSanction);
        formData.append('fileType', fileType);
        formData.append('file', file);


        try {
            const res = await api.postUpload('/app/rest/v1/uploadSanctionList', formData);
            console.debug('Upload response', res);
            toast({ title: 'Uploaded successfully', variant: 'success' });
            setShowUploadModal(false);
            setFiles([]);
        } catch (err) {
            console.error('Upload error', err);
            toast({ title: 'Upload failed', description: err?.message || '', variant: 'error' });
        }
    };

    const fetchMatchedLists = async (selectedLists) => {

        console.log("Selected Lists: ", selectedLists.length);


        const sanctionName = Array.isArray(selectedLists) ? selectedLists.join(',') : '';

        const processType = onboard ? "O" : "T";

        //alert(sanctionName);
        //alert(`Fetching matched lists for: ${sanctionName}`);

        console.log("Fetching matched lists for: ", sanctionName, " with threshold: ", threshold);
        try {
            api.get('/app/rest/v1/getSanctionMatchedList', {
                sanctionName: sanctionName,
                threshold: threshold,
                processType: processType
            }).then((res) => {
                setRawRows(res);

                if (res && res.length > 0) {

                    const total = res.reduce((sum, item) => {
                        return sum + Number(item.confidence_percentage);
                    }, 0);

                    const average = total / res.length;
                    setConfAverage(average);

                    //console.log("Average Confidence:", average.toFixed(2));
                }
            });

        } catch (error) {
            setRawRows([]);
        }
    };

    const screened = rawRows.length

    const enriched = useMemo(() => {
        return rawRows.map(r => {
            const name = r.customername || r.customer || r.entity || '';

            const hit = fuzzyIncludes(name, query)
            const conf = hit ? confidenceFromScore(threshold) : 0.12
            const which = hit ? (lists[0] || 'OFAC (US)') : '-'
            return {
                ...r,
                matched: hit ? name : '',
                list: which,
                //confidence: conf,
                //status: hit && conf >= threshold ? 'Review' : 'Clear'
            }
        })
    }, [rawRows, query, threshold, lists])


    const hits = enriched.filter(r => r.status === 'HIGH').length
    const avgConf = confAverage || 0
    //alert(enriched.length);

    const generateFormattedId = () => {
        const now = new Date();

        const datePart =
            now.getFullYear() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0');

        const random = Math.floor(Math.random() * 1000);

        return `SANCTION-${datePart}-${random}`;
    };


    const onExport = () => {
        const csv = [
            ['Customer Name', 'Sanction Name', 'Country', 'Confidence', 'Status'].join(','),
            ...enriched.map(r => [
                JSON.stringify(r.customername || ''),
                JSON.stringify(r.sanction_name || ''),
                JSON.stringify(r.countryname || ''),
                (r.confidence_percentage || 0),
                JSON.stringify(r.status || '')
            ].join(','))
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${generateFormattedId()}.csv`
        a.click()
    };

    const onClear = () => {
        setThreshold(0.85);
        setConfAverage('');
        setRawRows([]);
        setLists([]);
        // setRows([]);
        //fetchMatchedLists([]);

    };

    const updatedAt = new Date().toLocaleString()

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // base data (API rows or enriched fallback)
    const baseRows = rows && rows.length ? rows : enriched;

    // apply search filter before paginating
    const filteredRows = query
        ? baseRows.filter(r =>
            fuzzyIncludes(
                r.customername || r.customer || r.entity || '',
                query,
            ),
        )
        : baseRows;

    const totalRows = filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
    );

    // keep current page valid when data/pageSize changes
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);


    return (
        <MutedBgLayout>
            <Row>
                <Col span="12">
                    <H1>Sanction Screening</H1>
                </Col>
                <Col>
                    <Header
                        theme={theme}
                        setTheme={setTheme}
                        onExport={onExport}
                        onClear={onClear}
                        onUpload={() => setShowUploadModal(true)}
                    />


                    <div className="chips-palette">
                        <style>{`
                           
                            ${chipColors
                                .map((color, idx) =>
                                    `.chips-palette .chip:nth-child(${idx + 1}) { background: ${color}; }`,
                                )
                                .join('\n')}
                        `}</style>

                        <SanctionChips
                            selected={lists}
                            setSelected={setLists}
                            options={availableLists}
                            onAdd={() => setShowModal(true)}
                            onDelete={() => setDeleteShowModal(true)}
                        />
                    </div>

                    <div className="toolbar">
                        <div className="input">
                            <span style={{ color: 'var(--muted)' }}>🔎</span>
                            <input placeholder={`Search customer or entity name...`} value={query} onChange={e => setQuery(e.target.value)} />
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card)', border: '1px solid rgba(148, 163, 184, .35)', borderRadius: 12, padding: '10px 12px' }}>
                            <input type="checkbox" checked={onboard} onChange={e => setOnboard(e.target.checked)} />
                            <span>Onboard</span>
                        </label>



                        <div className="slider">
                            <span className="badge">Match ≥ {threshold.toFixed(2)}</span>
                            <input type="range" min={0} max={1} step={0.01} value={threshold} onChange={e => setThreshold(parseFloat(e.target.value))} />
                        </div>
                        <button className="btn primary" onClick={() => fetchMatchedLists(lists)} >Submit</button>
                        <button className="btn" onClick={() => onClear()}>Clear</button>
                    </div>
                    <StatsCards screened={screened} hits={hits} avgConf={avgConf} updatedAt={updatedAt} />

                    {/* Pagination controls (replaced) */}
                    {totalPages > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{
                                        width: 36, height: 36, borderRadius: 10, border: '1px solid #e6e9ee', background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    ‹
                                </button>

                                {/** build page list with ellipsis */}
                                {(() => {
                                    const delta = 1; // pages shown around current
                                    const range = [];
                                    for (let i = 1; i <= totalPages; i++) {
                                        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                                            range.push(i);
                                        } else if (range[range.length - 1] !== '...') {
                                            range.push('...');
                                        }
                                    }
                                    return range.map((p, idx) => {
                                        if (p === '...') {
                                            return <div key={'e' + idx} style={{ width: 36, textAlign: 'center', color: '#9aa3b2' }}>…</div>;
                                        }
                                        const isActive = p === currentPage;
                                        return (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setCurrentPage(p)}
                                                style={{
                                                    minWidth: 36,
                                                    height: 36,
                                                    padding: '0 10px',
                                                    borderRadius: 10,
                                                    border: isActive ? 'none' : '1px solid #e6e9ee',
                                                    background: isActive ? '#1070d8' : '#fff',
                                                    color: isActive ? '#fff' : '#1f2d3d',
                                                    fontWeight: isActive ? 700 : 500,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {p}
                                            </button>
                                        );
                                    });
                                })()}

                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        width: 36, height: 36, borderRadius: 10, border: '1px solid #e6e9ee', background: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    ›
                                </button>
                            </div>

                            {/* <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <label style={{ marginRight: 6 }}>Rows</label>
                                <select
                                    value={pageSize}
                                    onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                                    style={{ height: 36, borderRadius: 8, padding: '0 8px', border: '1px solid #e6e9ee' }}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div> */}
                        </div>
                    )}
                    <DataTable rows={paginatedRows} />


                </Col>
            </Row>

            {showUploadModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--card)', padding: '20px', borderRadius: '8px',
                        width: '850px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, fontWeight: 'bold' }}>Upload Sanction List</h3>

                        <Col span='12'>

                            <Row align='center'>

                                <div
                                    style={{
                                        marginBottom: 8,
                                        marginTop: 20,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    {/* color-only styling for Sanction List chips (functionality unchanged) */}
                                    <style>{`
                                      
                                        ${chipColors
                                            .map(
                                                (color, idx) =>
                                                    `.sanction-modal-chips .chip:nth-child(${idx + 1}) { background: ${color}; }`,
                                            )
                                            .join('\n')}
                                    `}</style>

                                    <div
                                        style={{
                                            fontWeight: 600,
                                            marginBottom: 8,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        <span>Sanction List</span>


                                    </div>
                                    <div className="sanction-modal-chips">
                                        <div className="chips">
                                            {availableLists.map(name => (
                                                <label key={name} className="chip" style={{ cursor: 'pointer' }}>
                                                    <input
                                                        type="radio"
                                                        name="listSanction"
                                                        value={name}
                                                        checked={selectedSanction === name}
                                                        onChange={() => setSelectedSanction(name)}
                                                    />
                                                    <span>{name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            <Row align='center'>
                                <Col span='12'>
                                    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <div style={{ marginBottom: 10, fontWeight: 'bold' }}>File Type</div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <input type="radio" name="setFileType" value="CSV" checked={fileType === 'CSV'} onChange={e => setFileType(e.target.value)} />
                                                <span>CSV</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <input type="radio" name="setFileType" value="EXCEL" checked={fileType === 'EXCEL'} onChange={e => setFileType(e.target.value)} />
                                                <span>EXCEL</span>
                                            </label>

                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row align='center'>
                                <Col span='12'>
                                    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <div style={{ marginBottom: 10, fontWeight: 'bold' }}>File Upload</div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <input
                                                id="sanctionList"
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                accept=".csv,.xls,.xlsx"
                                                onChange={e => {
                                                    const selected = e.target.files ? Array.from(e.target.files) : [];
                                                    const allowed = [];
                                                    const invalid = [];

                                                    selected.forEach(f => {
                                                        const t = f.type || '';
                                                        const ext = (f.name.split('.').pop() || '').toLowerCase();

                                                        const isCsv =
                                                            t === 'text/csv' ||
                                                            ext === 'csv';

                                                        const isExcel =
                                                            t === 'application/vnd.ms-excel' || // .xls
                                                            t === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
                                                            ['xls', 'xlsx'].includes(ext);

                                                        if (isCsv || isExcel) allowed.push(f);
                                                        else invalid.push(f.name);
                                                    });

                                                    if (invalid.length > 0) {
                                                        toast({
                                                            title: `Only Excel and CSV files allowed`,
                                                            description: invalid.join(', '),
                                                            variant: 'warning',
                                                        });
                                                    }

                                                    setFiles(allowed);
                                                }}
                                            />
                                            <Button label="Choose files" onClick={() => fileInputRef.current && fileInputRef.current.click()} />
                                            {files.length === 0 ? (
                                                <span className="ml-3 text-muted-foreground">No file chosen</span>
                                            ) : (
                                                <div className="ml-3">
                                                    {files.map((f, idx) => (
                                                        <div key={idx} className="text-sm">
                                                            <strong>{f.name}</strong> ({(f.size / 1024).toFixed(1)} KB)
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>




                        </Col>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 16 }}>

                            <button className="btn primary" onClick={handleUploadSanctionList}>Save</button>
                            <button className="btn" onClick={() => setShowUploadModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* MODAL POPUP */}
            {
                showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            background: 'var(--card)', padding: '20px', borderRadius: '8px',
                            width: '400px', display: 'flex', flexDirection: 'column', gap: '15px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: 0, fontWeight: 'bold' }}>Add New Sanction</h3>


                            <div>
                                <label>Sanction Name</label>
                                <input
                                    className="input"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    value={newSanctionName}
                                    onChange={e => setNewSanctionName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Country</label>
                                <input
                                    className="input"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    value={newCountry}
                                    onChange={e => setNewCountry(e.target.value)}
                                />
                            </div>


                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button className="btn" onClick={handleClearPopup}>Clear</button>
                                <button className="btn primary" onClick={handleSaveNewSanction}>Save</button>
                                <button className="btn danger" onClick={() => setShowModal(false)}>Close</button>
                            </div>

                        </div>
                    </div>
                )
            }


            {deleteShowModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--card)', padding: '20px', borderRadius: '8px',
                        width: '870px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, fontWeight: 'bold' }}>Delete Sanction List</h3>

                        <Col span='12'>

                            <Row align='center'>

                                <div
                                    style={{
                                        marginBottom: 8,
                                        marginTop: 20,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    {/* color-only styling for Sanction List chips (functionality unchanged) */}
                                    <style>{`
                                      
                                        ${chipColors
                                            .map(
                                                (color, idx) =>
                                                    `.sanction-modal-chips .chip:nth-child(${idx + 1}) { background: ${color}; }`,
                                            )
                                            .join('\n')}
                                    `}</style>

                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Sanction List</div>
                                    <div className="sanction-modal-chips">
                                        <div className="chips">
                                            {availableLists.map(name => (
                                                <label key={name} className="chip" style={{ cursor: 'pointer' }}>
                                                    <input
                                                        type="radio"
                                                        name="uploadSanction"
                                                        value={name}
                                                        checked={selectedDeleteSanction === name}
                                                        onChange={() => setSelectedDeleteSanction(name)}
                                                    />
                                                    <span>{name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Row>


                        </Col>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 16 }}>
                            <button
                                type="button"
                                className="btn danger"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Delete
                            </button>
                            <button type="button" className="btn" onClick={() => setDeleteShowModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
                }}>
                    <div style={{
                        width: 420, background: 'var(--card)', padding: 18, borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
                    }}
                        onClick={e => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <h4 style={{ margin: 0, marginBottom: 10, fontWeight: 700 }}>Confirm delete</h4>
                        <div style={{ marginBottom: 16, color: 'oklch(0.16 0 0)' }}>
                            Are you sure you want to delete the selected sanction list(s)?
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                            <button type="button" className="btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button
                                type="button"
                                className="btn danger"
                                onClick={async () => {
                                    try {
                                        await deleteSanction();
                                    } finally {
                                        setShowDeleteConfirm(false);
                                        setDeleteShowModal(false);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </MutedBgLayout >
    );
}

export default View;
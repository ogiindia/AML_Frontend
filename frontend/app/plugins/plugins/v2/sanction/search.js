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
import DataTableSrch from '../../../components/sanction/DataTableSrch.js'
import { fuzzyIncludes, confidenceFromScore } from '../../../components/sanction/matching.js'
import '../../../components/sanction/app.css'

import useRoleBasedNavigate from 'useRoleBasedNavigate';
const SUGGEST = 'ACME Trading FZ'



function Search() {

    const [query, setQuery] = useState('')
    const [rawRows, setRawRows] = useState([])
    const [rows, setRows] = useState([])


    const { roleBasedNavigate } = useRoleBasedNavigate();


    const fetchMatchedLists = async () => {
        const sanctionName = query || '';

        console.log("Fetching matched lists for:", sanctionName);

        try {

            api.get('/app/rest/v1/getMatchedLists', {
                name: sanctionName
            }).then((res) => {
                const data = Array.isArray(res) ? res[0] : res;

                const formatted = (data?.matchedList || []).map(item => ({
                    sanctionName: data.sanctionName,
                    searchStr: item.searchStr,
                    listMatchStr: item.listMatchStr,
                    matchScore: item.matchScore
                }));

                setRawRows(formatted);
            });



        } catch (error) {
            console.error("API Error:", error);
            setRawRows([]);
        }
    };


    // const enriched = useMemo(() => {
    //     alert(1);

    //     return rawRows.map(r => {
    //         const name = r.listMatchStr || '';

    //         const hit = fuzzyIncludes(name, query)
    //         return {
    //             ...r,
    //             matched: hit ? name : ''
    //         }
    //     })
    // }, [rawRows, query])



    const onClear = () => {
        setQuery('');

    };

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);



    const totalRows = rawRows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    const paginatedRows = rawRows.slice(
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
                    <H1>Name Search</H1>
                </Col>
                <Col>





                    <div className="toolbar">
                        <div className="input">
                            <span style={{ color: 'var(--muted)' }}>🔎</span>
                            <input placeholder={`Search customer or entity name...`} value={query} onChange={e => setQuery(e.target.value)} />
                        </div>

                        <button className="btn primary" onClick={() => fetchMatchedLists()} >Submit</button>
                        <button className="btn" onClick={() => onClear()}>Clear</button>
                    </div>

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


                        </div>
                    )}
                    <DataTableSrch rows={paginatedRows} />


                </Col>
            </Row>


        </MutedBgLayout >
    );
}

export default Search;
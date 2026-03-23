import api from '@ais/api';
import {
    Button,
    Col,
    Row,
    H1,
    H3,
    IconButton,
    LoadingComponent,
    MutedBgLayout,
    PageCenterLayout,
    SimpleCard,
    PaginationControlled,
    NGPBar,
    Pagination,
    toast
} from '@ais/components';
import { SimpleTable2, TableV2 } from '@ais/datatable';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import React, { useEffect, useState, useMemo } from 'react';
import useModalHost from 'useModalHost';
import useRoleBasedNavigate from 'useRoleBasedNavigate';
import WithSession from 'WithSession';

function DashboardList({ username, groupId }) {

    const [showModal, setshowModal] = useState(false);

    const { showPluginModal } = useModalHost();
    const [loading, setLoading] = React.useState(false);

    const [error, setError] = useState(null);

    const [totalSummaryAlertsData, settotalSummaryAlertsData] = useState([]);
    const [totalAlertsData, setTotalAlertsData] = useState([]);
    const [openedAlertsData, setOpenedAlertsData] = useState([]);
    const [closedAlertsData, setClosedAlertsData] = useState([]);

    const [summaryRange, setSummaryRange] = useState("today");
    const [totalRange, setTotalRange] = useState("today");
    const [openedRange, setOpenedRange] = useState("today");
    const [closedRange, setClosedRange] = useState("today");

    const [showSummaryRangePopup, setShowSummaryRangePopup] = useState(false);
    const [showTotalRangePopup, setShowTotalRangePopup] = useState(false);
    const [showOpenedRangePopup, setShowOpenedRangePopup] = useState(false);
    const [showClosedRangePopup, setShowClosedRangePopup] = useState(false);
    const { roleBasedNavigate } = useRoleBasedNavigate();

    const [alertList, setAlertList] = useState([]);

    const [selectedParentIds, setSelectedParentIds] = useState([]);
    const [allSelectedMine, setAllSelectedMine] = useState(false);
    const [tableRefreshKey, setTableRefreshKey] = useState(0);

    const [assigneeOptions, setAssigneeOptions] = useState([]);
    const [selectedAssignee, setSelectedAssignee] = useState('');


    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'search'

    const [searchCustomerId, setSearchCustomerId] = useState('');
    const [searchTransactionId, setSearchTransactionId] = useState('');
    const [searchStatus, setSearchStatus] = useState('');

    const [appliedCustomerId, setAppliedCustomerId] = useState('');
    const [appliedTransactionId, setAppliedTransactionId] = useState('');
    const [appliedStatus, setAppliedStatus] = useState('');

    const RANGE_OPTIONS = [
        { label: "Today", value: "today" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "6 Month", value: "6months" },
    ];

    const onSummaryRangeChange = (nextRange) => {
        setSummaryRange(nextRange);
        setShowSummaryRangePopup(false);
        fetchAlertsDashboard(nextRange);
    };

    const onTotalRangeChange = (nextRange) => {
        setTotalRange(nextRange);
        setShowTotalRangePopup(false);
        fetchTotalAlerts(nextRange);
    };

    const onOpenedRangeChange = (nextRange) => {
        setOpenedRange(nextRange);
        setShowOpenedRangePopup(false);
        fetchOpenedAlertsCount(nextRange);
    };

    const onClosedRangeChange = (nextRange) => {
        setClosedRange(nextRange);
        setShowClosedRangePopup(false);
        fetchClosedAlertsCount(nextRange);
    };

    useEffect(() => {
        onSummaryRangeChange("today");
        onTotalRangeChange("today");
        onOpenedRangeChange("today");
        onClosedRangeChange("today");
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        let graph = {
            query: {
                __variables: {
                    id: 'Long!',
                },

                findGroupEntitybyId: {
                    __args: {
                        id: new VariableType('id'),
                    },
                    users: {
                        username: true,
                        id: true,
                    },
                },
            },
        };

        const gql = jsonToGraphQLQuery(graph);
        console.log(gql);
        api.graphql(gql, { id: groupId }).then((res) => {
            const { loading, data, error } = res;
            const users = res.data.findGroupEntitybyId.users;

            const options = users.map(user => ({
                id: user.id,
                username: user.username
            }));

            setAssigneeOptions(options);


            setLoading(loading);
            setError(error);
            console.log(res);
            if (data) {

            }
        });

        setLoading(false);
    };


    const fetchAlertsDashboard = async (range) => {
        try {
            setLoading(true);


            const res = await api.get("/app/rest/v1/getAlertRangeCount", {
                range: range,
                username: username
            });

            settotalSummaryAlertsData([
                { name: "Total", total: res.total, fill: "#1f4e79" },
                { name: "Opened", total: res.opened, fill: "#17a2b8" },
                { name: "Closed", total: res.closed, fill: "#ffc107" },
            ]);



        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalAlerts = async (range) => {
        try {
            setLoading(true);

            const res = await api.get("/app/rest/v1/getAlertRangeCount", {
                range: range,
                username: username
            });

            setTotalAlertsData([
                { name: "Total Alerts", total: res.total, fill: "#1f4e79" },

            ]);

        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOpenedAlertsCount = async (range) => {
        try {
            setLoading(true);

            const res = await api.get("/app/rest/v1/getAlertRangeCount", {
                range: range,
                username: username
            });


            setOpenedAlertsData([
                { name: "Opened", total: res.opened, fill: "#17a2b8" },
            ]);

        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClosedAlertsCount = async (range) => {
        try {
            setLoading(true);

            const res = await api.get("/app/rest/v1/getAlertRangeCount", {
                range: range,
                username: username

            });

            setClosedAlertsData([
                { name: "Closed", total: res.closed, fill: "#ffc107" },
            ]);

        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    // const dataStructure = {
    //     queryType: 'findEntitiesPendingForApprovalByPaging',
    //     columns: [
    //         { key: 'entityId', type: 'string' },
    //         { key: 'id', type: 'Long' },
    //         {
    //             key: 'currentLevel',
    //             type: 'number',
    //         },
    //         { key: 'user_assignee', type: 'string' },
    //         { key: 'createdAt', type: 'date' },
    //         { key: 'pendingData.payload', type: 'string' },

    //         { key: 'status', type: 'string' },
    //     ],
    //     paging: { pageNo: 1, size: 10 },
    //     sorting: { field: 'entityId', direction: 'DESC' },
    //     //"filters": [{ field: "user_assignee", operator: "EQUAL", value: username }]
    //     //    "filters": [{ field: "username", operator: "EQUAL", value: "admin" }]
    // };

    const columns = {

        entityId: {
            show: true,
            label: 'Parent ID'
        },

        id: {
            show: false
        },

        currentLevel: {
            show: false,
            label: 'Current Level'
        },
        "pendingData.payload": {
            show: false
        },
        alertId: {
            label: "Alert Count",
            render: (row) => {
                try {
                    const payload = row["pendingData.payload"] ? JSON.parse(row["pendingData.payload"]) : {};
                    return <>{payload.alertId || '-'}</>;
                } catch (e) {
                    return <>-</>;
                }
            }
        },

        createdAt: {
            show: true,
            label: 'Created At',
            type: 'date'
        },
        customerId: {
            label: "Customer Id",
            render: (row) => {
                try {
                    console.log(row)
                    const payload = row["pendingData.payload"] ? JSON.parse(row["pendingData.payload"]) : {};
                    return <>{payload.customerId || '-'}</>;
                } catch (e) {
                    return <>-</>;
                }
            }
        },
        transactionId: {
            label: "Transaction Id",
            render: (row) => {
                try {
                    const payload = row["pendingData.payload"] ? JSON.parse(row["pendingData.payload"]) : {};
                    return <>{payload.transactionId || '-'}</>;
                } catch (e) {
                    return <>-</>;
                }
            }
        },
        user_assignee: {
            show: true,
            label: "Assigneed User",
            render: (row) => {
                try {
                    return <>{row.user_assignee || '-'}</>;
                } catch (e) {
                    return <>-</>;
                }
            }
        },
        status: {
            label: "Status",
            render: (row) => {
                let status = 'UNKNOWN';
                let bg = '#ccc';

                try {
                    status = row.status || 'UNKNOWN';
                } catch (e) {
                    status = row.status || 'UNKNOWN';
                }

                if (status === 'PENDING') {
                    status = 'OPEN';
                    bg = '#2e7d32';
                } else if (status === 'REJECTED' || status === 'APPROVED') {
                    status = 'CLOSED';
                    bg = '#5c7ea3';
                } else if (status === 'REVIEW') {
                    bg = '#f39c12';
                }

                const isMine = row.user_assignee === username;
                const isClosed = status === 'CLOSED';
                const isEnabled = isMine && !isClosed;

                return (
                    <button
                        disabled={!isEnabled}
                        style={{
                            backgroundColor: isEnabled ? bg : '#d3d3d3',
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'inline-block',
                            textAlign: 'center',
                            minWidth: '90px',
                            height: '30px',
                            cursor: isEnabled ? 'pointer' : 'not-allowed',
                            opacity: isEnabled ? 1 : 0.6,
                        }}
                        onClick={() => {
                            if (!isEnabled) return;
                            const payload = row['pendingData.payload']
                                ? JSON.parse(row['pendingData.payload'])
                                : {};
                            roleBasedNavigate('/mkc/alert/view', true, {
                                size: 'pg',
                                ...payload,
                                ...row,
                            });
                        }}
                    >
                        {status.replace('_', ' ')}
                    </button>
                );
            }
        },
        actions: {
            show: false,
            label: 'Actions',
            render: (row) => (
                <IconButton
                    icon={'Eye'}
                    size={20}
                    className={`cursor-pointer`}
                    onClick={() => {
                        const payload = row["pendingData.payload"] ? JSON.parse(row["pendingData.payload"]) : {};
                        roleBasedNavigate('/mkc/alert/view', true, { size: 'pg', ...payload, ...row });
                    }}
                ></IconButton>
            ),
        },

    }

    const handleAssignMe = () => {
        if (!selectedParentIds.length) return;

        setLoading(true);

        const gjson = {
            mutation: {
                __variables: {
                    entityIds: '[String!]!',
                    userAssignee: 'String!',
                },
                updateUserAssignProcess: {
                    __args: {
                        alert: {
                            entityIds: new VariableType('entityIds'),
                            userAssignee: new VariableType('userAssignee'),
                        }
                    },
                }
            }
        }

        const graphqlQuery = jsonToGraphQLQuery(gjson);

        api.graphql(graphqlQuery, {
            entityIds: selectedParentIds,
            userAssignee: username,
        }).then((res) => {
            const { loading, error, data } = res;
            setLoading(false);

            if (error || !data.updateUserAssignProcess) {
                toast({ title: "Error task assigned", variant: "error" });
                return;
            }

            toast({ title: "Task Done", variant: "success" });
            setSelectedParentIds([]);                // hide button
            setTableRefreshKey((prev) => prev + 1);  // reload SimpleTable2
        });
    };

    const handleAssignToAnotherUser = (targetUser) => {
        if (!selectedParentIds.length || !targetUser) return;

        setLoading(true);

        const gjson = {
            mutation: {
                __variables: {
                    entityIds: '[String!]!',
                    userAssignee: 'String!',
                },
                updateUserAssignProcess: {
                    __args: {
                        alert: {
                            entityIds: new VariableType('entityIds'),
                            userAssignee: new VariableType('userAssignee'),
                        }
                    },
                }
            }
        }

        const graphqlQuery = jsonToGraphQLQuery(gjson);

        api.graphql(graphqlQuery, {
            entityIds: selectedParentIds,
            userAssignee: targetUser,   // <- use dropdown value
        }).then((res) => {
            const { error, data } = res;
            setLoading(false);

            if (error || !data.updateUserAssignProcess) {
                toast({ title: "Error task assigned", variant: "error" });
                return;
            }

            toast({ title: "Task Done", variant: "success" });
            setSelectedParentIds([]);
            setSelectedAssignee('');
            setTableRefreshKey((prev) => prev + 1);
        });
    };

    const handleSearch = () => {
        setAppliedCustomerId(searchCustomerId.trim());
        setAppliedTransactionId(searchTransactionId.trim());
        setAppliedStatus(searchStatus);
        setTableRefreshKey((prev) => prev + 1); // force SimpleTable2 remount / reload
    };

    const handleClearSearch = () => {
        setSearchCustomerId('');
        setSearchTransactionId('');
        setSearchStatus('');

        setAppliedCustomerId('');
        setAppliedTransactionId('');
        setAppliedStatus('');

        setTableRefreshKey((prev) => prev + 1); // reload unfiltered data
    };

    const dataStructure = useMemo(() => {
        const filters = [];

        if (appliedCustomerId) {
            filters.push({
                field: 'customerId',
                operator: 'EQUAL',
                value: appliedCustomerId,
            });
        }

        if (appliedTransactionId) {
            filters.push({
                field: 'transactionId',
                operator: 'EQUAL',
                value: appliedTransactionId,
            });
        }

        if (appliedStatus) {
            // map UI status → backend values as needed
            if (appliedStatus === 'CLOSED') {
                // if your backend supports IN; otherwise adapt
                filters.push({
                    field: 'status',
                    operator: 'IN',
                    value: 'APPROVED,REJECTED',
                });
            } else {
                filters.push({
                    field: 'status',
                    operator: 'EQUAL',
                    value: appliedStatus, // e.g. PENDING or REVIEW
                });
            }
        }

        return {
            queryType: 'findEntitiesPendingForApprovalByPaging',
            columns: [
                { key: 'entityId', type: 'string' },
                { key: 'id', type: 'Long' },
                { key: 'currentLevel', type: 'number' },
                { key: 'user_assignee', type: 'string' },
                { key: 'createdAt', type: 'date' },
                { key: 'pendingData.payload', type: 'string' },
                { key: 'status', type: 'string' },
            ],
            paging: { pageNo: 1, size: 10 },
            sorting: { field: 'user_assignee', direction: 'ASC' },
            filters,
        };
    }, [appliedCustomerId, appliedTransactionId, appliedStatus]);

    return (
        <>
            <MutedBgLayout>
                <Row align="center" justify="start">
                    <Col span="auto">
                        <H1>Alert List</H1>
                    </Col>
                    <Col span="auto" className="flex gap-2">
                        <IconButton
                            icon="LayoutDashboard"      // pick any icon name your lib supports
                            size={20}
                            title="Dashboard View"
                            className={activeView === 'dashboard' ? 'text-primary' : ''}
                            onClick={() => setActiveView('dashboard')}
                        />

                        <IconButton
                            icon="Search"
                            size={20}
                            title="Search Alerts"
                            className={activeView === 'search' ? 'text-primary' : ''}
                            onClick={() => setActiveView('search')}
                        />
                    </Col>
                </Row>

                {activeView === 'dashboard' && (
                    <Row>

                        <div
                            style={{
                                display: "flex",
                                gap: 20,
                                flexWrap: "wrap", // keep wrap, or use "nowrap" for single row
                            }}
                        >
                            <div
                                title="Summary Alerts"
                                style={{
                                    flex: "0 0 350px", // fixed width
                                    width: 350,
                                    minWidth: 350,
                                    maxWidth: 350,
                                }}
                            >
                                <SimpleCard
                                    align="start"
                                    title="Summary Alerts"
                                    subtitle={`Last ${RANGE_OPTIONS.find(opt => opt.value === summaryRange)?.label || summaryRange} Alerts`}
                                    customHeaderComponents={(
                                        <div style={{ position: "relative" }}>
                                            <button
                                                type="button"
                                                title="View range options"
                                                onClick={() => setShowSummaryRangePopup((prev) => !prev)}
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    borderRadius: 6,
                                                    background: "#fff",
                                                    cursor: "pointer",
                                                    width: 30,
                                                    height: 30,
                                                    fontSize: 16
                                                }}
                                            >
                                                ✅
                                            </button>

                                            {showSummaryRangePopup && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: 36,
                                                        right: 0,
                                                        zIndex: 20,
                                                        background: "#fff",
                                                        border: "1px solid #e5e5e5",
                                                        borderRadius: 8,
                                                        padding: 8,
                                                        minWidth: 140,
                                                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
                                                    }}
                                                >
                                                    {RANGE_OPTIONS.map((opt) => (
                                                        <div key={opt.value} style={{ marginBottom: 6 }}>
                                                            <Button
                                                                label={`${opt.label}${summaryRange === opt.value ? " ✓" : ""}`}
                                                                onClick={() => onSummaryRangeChange(opt.value)}
                                                                style={{
                                                                    backgroundColor: '#ffffff',
                                                                    color: '#000000',
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                >
                                    <NGPBar barData={totalSummaryAlertsData} />
                                </SimpleCard>
                            </div>

                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 20,
                                flexWrap: "wrap", // keep wrap, or use "nowrap" for single row
                            }}
                        >
                            <div
                                title="Summary Alerts"
                                style={{
                                    flex: "0 0 270px", // fixed width
                                    width: 270,
                                    minWidth: 270,
                                    maxWidth: 270,
                                }}
                            >
                                <SimpleCard
                                    align="start"
                                    title="Total Alerts"
                                    subtitle={`Last ${RANGE_OPTIONS.find(opt => opt.value === totalRange)?.label || totalRange} Alerts`}
                                    customHeaderComponents={(
                                        <div style={{ position: "relative" }}>
                                            <button
                                                type="button"
                                                title="View range options"
                                                onClick={() => setShowTotalRangePopup((prev) => !prev)}
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    borderRadius: 6,
                                                    background: "#fff",
                                                    cursor: "pointer",
                                                    width: 30,
                                                    height: 30,
                                                    fontSize: 16
                                                }}
                                            >
                                                ✅
                                            </button>

                                            {showTotalRangePopup && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: 36,
                                                        right: 0,
                                                        zIndex: 20,
                                                        background: "#fff",
                                                        border: "1px solid #e5e5e5",
                                                        borderRadius: 8,
                                                        padding: 8,
                                                        minWidth: 140,
                                                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
                                                    }}
                                                >
                                                    {RANGE_OPTIONS.map((opt) => (
                                                        <div key={opt.value} style={{ marginBottom: 6 }}>
                                                            <Button
                                                                label={`${opt.label}${totalRange === opt.value ? " ✓" : ""}`}
                                                                onClick={() => onTotalRangeChange(opt.value)}
                                                                style={{
                                                                    backgroundColor: '#ffffff',
                                                                    color: '#000000',
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                >
                                    <NGPBar barData={totalAlertsData} />
                                </SimpleCard>
                            </div>

                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 20,
                                flexWrap: "wrap", // keep wrap, or use "nowrap" for single row
                            }}
                        >
                            <div
                                key={'Opened Alerts'}
                                style={{
                                    flex: "0 0 270px", // fixed width
                                    width: 270,
                                    minWidth: 270,
                                    maxWidth: 270,
                                }}
                            >

                                <SimpleCard
                                    align="start"
                                    title="Opened Alerts"
                                    subtitle={`Last ${RANGE_OPTIONS.find(opt => opt.value === openedRange)?.label || openedRange} Alerts`}
                                    customHeaderComponents={(
                                        <div style={{ position: "relative" }}>
                                            <button
                                                type="button"
                                                title="View range options"
                                                onClick={() => setShowOpenedRangePopup((prev) => !prev)}
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    borderRadius: 6,
                                                    background: "#fff",
                                                    cursor: "pointer",
                                                    width: 30,
                                                    height: 30,
                                                    fontSize: 16
                                                }}
                                            >
                                                ✅
                                            </button>

                                            {showOpenedRangePopup && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: 36,
                                                        right: 0,
                                                        zIndex: 20,
                                                        background: "#fff",
                                                        border: "1px solid #e5e5e5",
                                                        borderRadius: 8,
                                                        padding: 8,
                                                        minWidth: 140,
                                                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
                                                    }}
                                                >
                                                    {RANGE_OPTIONS.map((opt) => (
                                                        <div key={opt.value} style={{ marginBottom: 6 }}>
                                                            <Button
                                                                label={`${opt.label}${openedRange === opt.value ? " ✓" : ""}`}
                                                                onClick={() => onOpenedRangeChange(opt.value)}
                                                                style={{
                                                                    backgroundColor: '#ffffff',
                                                                    color: '#000000',
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                >
                                    <NGPBar barData={openedAlertsData} />
                                </SimpleCard>
                            </div>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: 20,
                                flexWrap: "wrap", // keep wrap, or use "nowrap" for single row
                            }}
                        >
                            <div
                                style={{
                                    flex: "0 0 270px", // fixed width
                                    width: 270,
                                    minWidth: 270,
                                    maxWidth: 270,
                                }}
                            >
                                <SimpleCard
                                    align="start"
                                    title="Closed Alerts"
                                    subtitle={`Last ${RANGE_OPTIONS.find(opt => opt.value === closedRange)?.label || closedRange} Alerts`}
                                    customHeaderComponents={(
                                        <div style={{ position: "relative" }}>
                                            <button
                                                type="button"
                                                title="View range options"
                                                onClick={() => setShowClosedRangePopup((prev) => !prev)}
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    borderRadius: 6,
                                                    background: "#fff",
                                                    cursor: "pointer",
                                                    width: 30,
                                                    height: 30,
                                                    fontSize: 16
                                                }}
                                            >
                                                ✅
                                            </button>

                                            {showClosedRangePopup && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: 36,
                                                        right: 0,
                                                        zIndex: 20,
                                                        background: "#fff",
                                                        border: "1px solid #e5e5e5",
                                                        borderRadius: 8,
                                                        padding: 8,
                                                        minWidth: 140,
                                                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
                                                    }}
                                                >
                                                    {RANGE_OPTIONS.map((opt) => (
                                                        <div key={opt.value} style={{ marginBottom: 6 }}>
                                                            <Button
                                                                label={`${opt.label}${closedRange === opt.value ? " ✓" : ""}`}
                                                                onClick={() => onClosedRangeChange(opt.value)}
                                                                style={{
                                                                    backgroundColor: '#ffffff',
                                                                    color: '#000000',
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                >
                                    <NGPBar barData={closedAlertsData} />
                                </SimpleCard>
                            </div>

                        </div>



                    </Row>
                )}

                {activeView === 'search' && (
                    <Row>
                        <Col span="12" className="p-2">
                            <fieldset
                                style={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 12,
                                    padding: "14px 18px 18px",
                                    background: "#fff",
                                    margin: 0,
                                }}
                            >
                                <legend
                                    style={{
                                        padding: "0 8px",
                                        fontWeight: 600,
                                        fontSize: 16,
                                    }}
                                >
                                    Alert Search
                                </legend>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: 20,
                                        alignItems: "flex-end",
                                        flexWrap: "wrap",
                                        justifyContent: "space-between",
                                    }}
                                >


                                    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 220 }}>
                                        <label style={{ marginBottom: 6, fontWeight: 500 }}>
                                            Customer Id
                                        </label>
                                        <input
                                            type="text"
                                            id="customerId"
                                            label="Customer ID"
                                            value={searchCustomerId}
                                            onChange={(e) => setSearchCustomerId(e.target.value)}
                                            style={{
                                                padding: 8,
                                                borderRadius: 6,
                                                border: "1px solid #ccc",
                                                backgroundColor: "#fff",
                                                width: "100%",
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 220 }}>
                                        <label style={{ marginBottom: 6, fontWeight: 500 }}>
                                            Transaction Id
                                        </label>
                                        <input
                                            type="text"
                                            id="transctionId"
                                            label="Transaction ID"
                                            value={searchTransactionId}
                                            onChange={(e) => setSearchTransactionId(e.target.value)}
                                            style={{
                                                padding: 8,
                                                borderRadius: 6,
                                                border: "1px solid #ccc",
                                                backgroundColor: "#fff",
                                                width: "100%",
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 220 }}>
                                        <label style={{ marginBottom: 6, fontWeight: 500 }}>
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            value={searchStatus}
                                            onChange={(e) => setSearchStatus(e.target.value)}
                                            style={{
                                                padding: 8,
                                                borderRadius: 6,
                                                border: "1px solid #ccc",
                                                backgroundColor: "#fff",
                                                width: "100%",
                                            }}
                                        >
                                            <option value="">All</option>
                                            <option value="PENDING">OPEN</option>
                                            <option value="CLOSED">CLOSED</option>
                                            <option value="REVIEW">REVIEW</option>
                                        </select>
                                    </div>

                                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                        <Button className="btn primary" onClick={handleSearch}>
                                            Search
                                        </Button>
                                        <Button className="btn primary" onClick={handleClearSearch}>
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            </fieldset>
                        </Col>
                    </Row>
                )}
                <SimpleCard>
                    <SimpleTable2
                        key={tableRefreshKey}
                        title="Alerts Data"
                        tableStructure={dataStructure}
                        columns={columns}
                        selectKey="entityId"                 // what identifies the row
                        selectType="checkbox"               // show checkbox column (first)
                        priorityAssignee={username}
                        selectedRowCallback={(ids, rows) => {
                            setSelectedParentIds(ids || []);
                            if (!rows || rows.length === 0) {
                                setAllSelectedMine(false);
                            } else {
                                setAllSelectedMine(rows.every((r) => r.user_assignee === username));
                            }
                        }}
                        customHeaderComponents={
                            selectedParentIds.length > 0 && (
                                <>
                                    {allSelectedMine && (
                                        <select
                                            value={selectedAssignee}
                                            onChange={(e) => setSelectedAssignee(e.target.value)}
                                            style={{
                                                marginRight: 8,
                                                minWidth: 180,
                                                height: 32,
                                                border: '1px solid #d9d9d9',
                                                borderRadius: 4,
                                                backgroundColor: '#ffffff',
                                                visibility: selectedParentIds.length > 0 ? 'visible' : 'hidden',
                                            }}
                                        >
                                            <option value="">Select user</option>
                                            {assigneeOptions.map((u) => (
                                                <option key={u.id} value={u.username}>
                                                    {u.username}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    <Button
                                        icon={allSelectedMine ? "UserMinus" : "UserCheck"}
                                        label={allSelectedMine ? `Assign To ${selectedAssignee}` : "Assign To Me"}
                                        variant="outline"
                                        style={{
                                            visibility: selectedParentIds.length > 0 ? 'visible' : 'hidden',
                                        }}
                                        disabled={
                                            selectedParentIds.length === 0 ||
                                            (allSelectedMine && !selectedAssignee)
                                        }
                                        onClick={
                                            allSelectedMine
                                                ? () => handleAssignToAnotherUser(selectedAssignee)
                                                : handleAssignMe
                                        }
                                    />
                                </>
                            )
                        }
                        filterCallback={(e) => console.warn(e.target.value)}
                        filterLabel="stx"
                    ></SimpleTable2>

                </SimpleCard>



            </MutedBgLayout>
        </>
    );
}

export default WithSession(DashboardList);

/* eslint-disable no-unused-vars */

import api from "@ais/api";
import {
    Button,
    Col,
    H1,
    MutedBgLayout,
    Row,
    SimpleCard,
    UnderlinedTabs,
    PaginationControlled,
    NGPBar
} from '@ais/components';
import { SimpleTable } from "@ais/datatable";
import React, { useEffect, useState } from "react";
import { R } from "../../../../core/build/assets/Range-CZNrBk8u";

function Alerts() {

    React.useEffect(() => {
        console.log('into schemaList');
    }, []);
    const [loading, setLoading] = React.useState(false);

    const [cddAlertsList, setCDDAlertsList] = useState([]);
    const [eddAlertsList, setEDDAlertsList] = useState([]);
    const [kycAlertsList, setKYCAlertsList] = useState([]);

    const [kycAlertsData, setKycAlertsData] = useState([]);
    const [totalAlertsData, settotalAlertsData] = useState([]);
    const [autoManualCDDAlertsData, setautoManualCDDAlertsData] = useState([]);
    const [autoManualEDDAlertsData, setautoManualEDDAlertsData] = useState([]);
    const [kycRange, setKycRange] = useState("today");
    const [totalRange, setTotalRange] = useState("today");
    const [cddRange, setCDDRange] = useState("today");
    const [eddRange, setEDDRange] = useState("today");
    const [showKycRangePopup, setShowKycRangePopup] = useState(false);
    const [showTotalRangePopup, setShowTotalRangePopup] = useState(false);
    const [showCDDRangePopup, setShowCDDRangePopup] = useState(false);
    const [showEDDRangePopup, setShowEDDRangePopup] = useState(false);

    const [searchCDDCustomerId, setSearchCDDCustomerId] = useState('');
    const [searchCDDAccountNumber, setSearchCDDAccountNumber] = useState('');

    const [searchEDDCustomerId, setSearchEDDCustomerId] = useState('');
    const [searchEDDAccountNumber, setSearchEDDAccountNumber] = useState('');

    const [searchKYCCustomerId, setSearchKYCCustomerId] = useState('');
    const [searchKYCAccountNumber, setSearchKYCAccountNumber] = useState('');


    const RANGE_OPTIONS = [
        { label: "Today", value: "today" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
        { label: "6 Month", value: "6months" },
    ];

    const onKycRangeChange = (nextRange) => {
        setKycRange(nextRange);
        setShowKycRangePopup(false);
        fetchKycDashboard(nextRange);
    };

    const onTotalRangeChange = (nextRange) => {
        setTotalRange(nextRange);
        setShowTotalRangePopup(false);
        fetchAlertsTotal(nextRange);
    };

    const onCDDRangeChange = (nextRange) => {
        setCDDRange(nextRange);
        setShowCDDRangePopup(false);
        fetchAutoManualCddCount(nextRange);
    };

    const onEDDRangeChange = (nextRange) => {
        setEDDRange(nextRange);
        setShowEDDRangePopup(false);
        fetchAutoManualEddCount(nextRange);
    };

    const fetchCDDdetails = (customerId, accountNumber) => {
        api.get('/app/rest/v1/getKycAlertsDetails', {
            riskCategory: 'CDD',
            cust_id: customerId,
            accno: accountNumber
        }).then((res) => {
            setCDDAlertsList(res);
        }).catch((err) => {
            console.error("Error fetching KYC alerts:", err);
        });

    }

    const fetchEDDdetails = (customerId, accountNumber) => {
        api.get('/app/rest/v1/getKycAlertsDetails', {
            riskCategory: 'EDD',
            cust_id: customerId,
            accno: accountNumber
        }).then((res) => {
            setEDDAlertsList(res);
        });
    }

    const fetchKYCdetails = (customerId, accountNumber) => {
        api.get('/app/rest/v1/getKycAlerts', {
            source: 'K',
            cust_id: customerId,
            accno: accountNumber
        }).then((res) => {
            setKYCAlertsList(res);
        }).catch((err) => {
            console.error("Error fetching KYC alerts:", err);
        });
    }

    useEffect(() => {

        onTotalRangeChange("today");
        onCDDRangeChange("today");
        onEDDRangeChange("today");
        onKycRangeChange("today");

        fetchCDDdetails("", "");
        fetchEDDdetails("", "");
        fetchKYCdetails("", "");
    }, []);


    const fetchKycDashboard = async (range) => {
        try {
            setLoading(true);


            const res = await api.get("/app/rest/v1/getKycAlertRangeCount", {
                range: range
            });

            setKycAlertsData([
                { name: "KYC Alerts", total: res.kyc, fill: "#edac09" },
            ]);



        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchAlertsTotal = async (range) => {
        try {
            setLoading(true);

            const res = await api.get("/app/rest/v1/getKycAlertRangeCount", {
                range: range
            });

            settotalAlertsData([
                { name: "Total Alerts", total: res.total, fill: "#1f4e79" },

            ]);

        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAutoManualCddCount = async (range) => {
        try {
            setLoading(true);

            const res = await api.get("/app/rest/v1/getKycAlertRangeCount", {
                range: range
            });


            setautoManualCDDAlertsData([
                { name: "Auto. CDD", total: res.autoCDD, fill: "#17a2b8" },
                { name: "Manual CDD", total: res.manualCDD, fill: "#6f42c1" },
            ]);

        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAutoManualEddCount = async (range) => {
        try {
            setLoading(true);

            const res = await api.get("/app/rest/v1/getKycAlertRangeCount", {
                range: range
            });

            setautoManualEDDAlertsData([
                { name: "Auto. EDD", total: res.autoEDD, fill: "#ffc107" },
                { name: "Manual EDD", total: res.manualEDD, fill: "#28a745" },
            ]);

        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const getAlertStatusStyle = (status) => {
        const s = String(status || "").toLowerCase();
        if (s === "unverified") return { color: "#ff4d4f", fontWeight: 600 }; // red
        return { color: "#595959" };
    };

    const handleCDDSearch = () => {
        fetchCDDdetails(searchCDDCustomerId, searchCDDAccountNumber);
    };

    const handleCDDClearSearch = () => {
        setSearchCDDCustomerId("");
        setSearchCDDAccountNumber("");
        fetchCDDdetails("", "");
    };

    const handleEDDSearch = () => {

        fetchEDDdetails(searchEDDCustomerId, searchEDDAccountNumber);
    };

    const handleEDDClearSearch = () => {
        setSearchEDDCustomerId("");
        setSearchEDDAccountNumber("");
        fetchEDDdetails("", "");
    };

    const handleKYCSearch = () => {
        fetchKYCdetails(searchKYCCustomerId, searchKYCAccountNumber);
    };

    const handleKYCClearSearch = () => {
        setSearchKYCCustomerId("");
        setSearchKYCAccountNumber("");
        fetchKYCdetails("", "");
    };


    const tabs = [
        {
            name: 'Customer Due Diligence',
            value: 'general',
            content: (
                <Row>
                    <Col>
                        <fieldset
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 12,
                                padding: "14px 18px 18px",
                                background: "#fff",
                                margin: "0 10px 0 5px",
                            }}
                        >
                            <legend
                                style={{
                                    padding: "0 8px",
                                    fontWeight: 600,
                                    fontSize: 16,
                                    color: "black",
                                }}
                            >
                                Cust. Due Diligence Search
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

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: "0 0 40%",   // same width
                                        minWidth: 220,
                                    }}
                                >
                                    <label style={{ marginBottom: 6, fontWeight: 500, color: "black" }}>
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        label="Account Number"
                                        value={searchCDDAccountNumber}
                                        onChange={(e) => setSearchCDDAccountNumber(e.target.value)}
                                        style={{
                                            padding: 8,
                                            borderRadius: 6,
                                            border: "1px solid #ccc",
                                            backgroundColor: "#fff",
                                            width: "100%",
                                            color: "black",
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: "0 0 40%",   // same width
                                        minWidth: 220,
                                    }}
                                >
                                    <label style={{ marginBottom: 6, fontWeight: 500, color: "black" }}>
                                        Customer Id
                                    </label>
                                    <input
                                        type="text"
                                        id="customerId"
                                        label="Customer ID"
                                        value={searchCDDCustomerId}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (/^\d*$/.test(v)) setSearchCDDCustomerId(v);  // only digits
                                        }}
                                        style={{
                                            padding: 8,
                                            borderRadius: 6,
                                            border: "1px solid #ccc",
                                            backgroundColor: "#fff",
                                            width: "100%",
                                            color: "black",
                                        }}
                                    />
                                </div>

                                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                    <Button className="btn primary" onClick={handleCDDSearch}>
                                        Search
                                    </Button>
                                    <Button className="btn primary" onClick={handleCDDClearSearch}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </fieldset>
                    </Col>
                    <Col>

                        {cddAlertsList && cddAlertsList.length > 0 && (
                            <Col>
                                <SimpleCard title="Alerts" >
                                    <SimpleTable
                                        data={cddAlertsList}
                                        columns={{
                                            modified_dt: { hidden: true },
                                            alert_dt: { hidden: true },
                                            risk_category: { hidden: true },
                                            alert_status: { hidden: true },
                                            Action: {
                                                render: (row) => {
                                                    const name = (typeof row === 'string') ? row :
                                                        row.cust_id || row.cust_id || row.cust_id || row.cust_id || row.cust_id || '';
                                                    if (!name) return '-';
                                                    return (

                                                        <Button
                                                            label="Reminder Email"
                                                            className={`cursor-pointer`}
                                                        ></Button>

                                                    );
                                                },
                                            },
                                        }}
                                    />
                                </SimpleCard>
                            </Col>
                        )}
                    </Col>
                </Row>
            ),
        },
        {
            name: 'Extended Due Diligence',
            value: 'str',
            content: (
                <Row gap="0">
                    <Col>
                        <fieldset
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 12,
                                padding: "14px 18px 18px",
                                background: "#fff",
                                margin: "0 10px 0 5px",
                            }}
                        >
                            <legend
                                style={{
                                    padding: "0 8px",
                                    fontWeight: 600,
                                    fontSize: 16,
                                    color: "black",
                                }}
                            >
                                Extended Due Diligence Search
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

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: "0 0 40%",   // same width
                                        minWidth: 220,
                                    }}
                                >
                                    <label style={{ marginBottom: 6, fontWeight: 500, color: "black" }}>
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        label="Account Number"
                                        value={searchEDDAccountNumber}
                                        onChange={(e) => setSearchEDDAccountNumber(e.target.value)}
                                        style={{
                                            padding: 8,
                                            borderRadius: 6,
                                            border: "1px solid #ccc",
                                            backgroundColor: "#fff",
                                            width: "100%",
                                            color: "black"
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: "0 0 40%",   // same width
                                        minWidth: 220,
                                    }}
                                >
                                    <label style={{ marginBottom: 6, fontWeight: 500, color: "black" }}>
                                        Customer Id
                                    </label>
                                    <input
                                        type="text"
                                        id="customerId"
                                        label="Customer ID"
                                        value={searchEDDCustomerId}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (/^\d*$/.test(v)) setSearchEDDCustomerId(v);
                                        }}
                                        style={{
                                            padding: 8,
                                            borderRadius: 6,
                                            border: "1px solid #ccc",
                                            backgroundColor: "#fff",
                                            width: "100%",
                                            color: "black"
                                        }}
                                    />
                                </div>

                                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                    <Button className="btn primary" onClick={handleEDDSearch}>
                                        Search
                                    </Button>
                                    <Button className="btn primary" onClick={handleEDDClearSearch}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </fieldset>
                    </Col>
                    <Col>
                        {eddAlertsList && eddAlertsList.length > 0 && (
                            <Col span="12" className="p-2">
                                <SimpleCard title="Alerts">
                                    <SimpleTable
                                        data={eddAlertsList}
                                        columns={{

                                            modified_dt: { hidden: true },
                                            alert_dt: { hidden: true },
                                            risk_category: { hidden: true },
                                            alert_status: { hidden: true },
                                            // if rows are plain strings, normalize in render

                                            Action: {
                                                render: (row) => {
                                                    const name = (typeof row === 'string') ? row :
                                                        row.cust_id || row.cust_id || row.cust_id || row.cust_id || row.cust_id || '';
                                                    if (!name) return '-';
                                                    return (

                                                        <Button
                                                            label="Reminder Email"
                                                            className={`cursor-pointer`}
                                                        ></Button>

                                                    );
                                                },
                                            },
                                        }}
                                    />
                                </SimpleCard>
                            </Col>

                        )}
                    </Col>
                </Row>
            ),
        },
        {
            name: 'KYC Alerts',
            value: 'kyc',
            content: (
                <Row gap="0">
                    <Col>
                        <fieldset
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 12,
                                padding: "14px 18px 18px",
                                background: "#fff",
                                margin: "0 10px 0 5px",
                            }}
                        >
                            <legend
                                style={{
                                    padding: "0 8px",
                                    fontWeight: 600,
                                    fontSize: 16,
                                    color: "black",
                                }}
                            >
                                KYC Search
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

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: "0 0 40%",   // same width
                                        minWidth: 220,
                                    }}
                                >
                                    <label style={{ marginBottom: 6, fontWeight: 500, color: "black" }}>
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        label="Account Number"
                                        value={searchKYCAccountNumber}
                                        onChange={(e) => setSearchKYCAccountNumber(e.target.value)}
                                        style={{
                                            padding: 8,
                                            borderRadius: 6,
                                            border: "1px solid #ccc",
                                            backgroundColor: "#fff",
                                            width: "100%",
                                            color: "black"
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        flex: "0 0 40%",   // same width
                                        minWidth: 220,
                                    }}
                                >
                                    <label style={{ marginBottom: 6, fontWeight: 500, color: "black" }}>
                                        Customer Id
                                    </label>
                                    <input
                                        type="text"
                                        id="customerId"
                                        label="Customer ID"
                                        value={searchKYCCustomerId}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (/^\d*$/.test(v)) setSearchKYCCustomerId(v);
                                        }}
                                        style={{
                                            padding: 8,
                                            borderRadius: 6,
                                            border: "1px solid #ccc",
                                            backgroundColor: "#fff",
                                            width: "100%",
                                            color: "black"
                                        }}
                                    />
                                </div>

                                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                    <Button className="btn primary" onClick={handleKYCSearch}>
                                        Search
                                    </Button>
                                    <Button className="btn primary" onClick={handleKYCClearSearch}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </fieldset>

                    </Col>

                    <Col>
                        {kycAlertsList && kycAlertsList.length > 0 && (
                            <Col span="12" className="p-2">
                                <SimpleCard title="Alerts">
                                    <SimpleTable
                                        data={kycAlertsList}
                                        columns={{

                                            modified_dt: { hidden: true },
                                            alert_dt: { hidden: true },
                                            risk_category: { hidden: true },
                                            alert_status: {
                                                render: (row) => (
                                                    <span style={getAlertStatusStyle(row.alert_status)}>
                                                        {row.alert_status || "-"}
                                                    </span>
                                                ),
                                            },
                                            // if rows are plain strings, normalize in render


                                        }}
                                    />
                                </SimpleCard>
                            </Col>

                        )}
                    </Col>
                </Row>
            ),
        },



    ];



    return (
        <>
            <MutedBgLayout>

                <Row>
                    <Col span="24">
                        <H1>Periodical Alerts</H1>
                    </Col>
                </Row>
                <Row>
                    <div
                        style={{
                            display: "flex",
                            gap: 20,
                            flexWrap: "wrap", // keep wrap, or use "nowrap" for single row
                        }}
                    >
                        <div
                            key={'Total Alerts'}
                            style={{
                                flex: "0 0 260px", // fixed width
                                width: 260,
                                minWidth: 260,
                                maxWidth: 260,
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
                            style={{
                                flex: "0 0 305px", // fixed width
                                width: 305,
                                minWidth: 305,
                                maxWidth: 305,
                            }}
                        >
                            <SimpleCard
                                align="start"
                                title="Cust. Due Diligence"
                                subtitle={`Last ${RANGE_OPTIONS.find(opt => opt.value === cddRange)?.label || cddRange} Alerts`}
                                customHeaderComponents={(
                                    <div style={{ position: "relative" }}>
                                        <button
                                            type="button"
                                            title="View range options"
                                            onClick={() => setShowCDDRangePopup((prev) => !prev)}
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

                                        {showCDDRangePopup && (
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
                                                            label={`${opt.label}${cddRange === opt.value ? " ✓" : ""}`}
                                                            onClick={() => onCDDRangeChange(opt.value)}
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
                                <NGPBar barData={autoManualCDDAlertsData} />
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
                                flex: "0 0 300px", // fixed width
                                width: 300,
                                minWidth: 300,
                                maxWidth: 300,
                            }}
                        >
                            <SimpleCard
                                align="start"
                                title="Ext. Due Diligence"
                                subtitle={`Last ${RANGE_OPTIONS.find(opt => opt.value === eddRange)?.label || eddRange} Alerts`}
                                customHeaderComponents={(
                                    <div style={{ position: "relative" }}>
                                        <button
                                            type="button"
                                            title="View range options"
                                            onClick={() => setShowEDDRangePopup((prev) => !prev)}
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

                                        {showEDDRangePopup && (
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
                                                            label={`${opt.label}${eddRange === opt.value ? " ✓" : ""}`}
                                                            onClick={() => onEDDRangeChange(opt.value)}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            >
                                <NGPBar barData={autoManualEDDAlertsData} />
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
                                flex: "0 0 315px", // fixed width
                                width: 315,
                                minWidth: 315,
                                maxWidth: 315,
                            }}
                        >
                            <SimpleCard
                                align="start"
                                title="KYC Alerts"
                                subtitle={`Last ${RANGE_OPTIONS.find(opt => opt.value === kycRange)?.label || kycRange} Alerts`}
                                customHeaderComponents={(
                                    <div style={{ position: "relative" }}>
                                        <button
                                            type="button"
                                            title="View range options"
                                            onClick={() => setShowKycRangePopup((prev) => !prev)}
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

                                        {showKycRangePopup && (
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
                                                            label={`${opt.label}${kycRange === opt.value ? " ✓" : ""}`}
                                                            onClick={() => onKycRangeChange(opt.value)}
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
                                <NGPBar barData={kycAlertsData} />
                            </SimpleCard>
                        </div>

                    </div>
                </Row>
                <Row>
                    <Col span="24">
                        <UnderlinedTabs tabData={tabs} defaultValue={`general`} />
                    </Col>
                </Row>



            </MutedBgLayout >


        </>
    );
}

export default Alerts;
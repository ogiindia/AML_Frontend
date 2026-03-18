/* eslint-disable no-unused-vars */
import { Badge, Button, Col, IconButton, Row, TableLayout, toast, SimpleCard } from '@ais/components';
import api from 'api';
import { SimpleTable } from "@ais/datatable";
import React, { useState, useMemo } from 'react';
import usePageContext from 'usePageContext';
import useRoleBasedNavigate from 'useRoleBasedNavigate';
import useModalHost from 'useModalHost';

function EventsList() {


  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const reportOptions = [
    { name: 'Suspicious Report', value: 'STR' },
    { name: 'Cash Report', value: 'CTR' },
    { name: 'Non-Profit Organization Report', value: 'NTR' },
    { name: 'Cross Border Wire Report', value: 'CBWTR' },
    { name: 'Counterfeit Report', value: 'CFTR' }
  ];

  const [availableLists, setAvailableLists] = useState(reportOptions);
  const [selectedReport, setSelectedReport] = useState('STR');
  const [reportDetails, setReportDetails] = useState([]);
  const [showExport, setShowExport] = useState(false);

  const chipColors = useMemo(() => {
    const palette = [
      '#ff9800', // orange
      '#8bc34a', // green
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

    return `${datePart}-${random}`;
  };

  const hiddenColumns = ["transactionid", "parentid", "customerid"];

  const handleGenerateReports = async () => {

    try {



      if (!reportDetails || reportDetails.length === 0) {
        toast({ title: 'No report details available', variant: 'error' });
        return;
      }
      const visibleColumns = Object.keys(reportDetails[0]).filter(
        key => !hiddenColumns.includes(key)
      );

      const headers = visibleColumns.join(",");
      const rows = reportDetails.map(obj =>
        Object.values(obj)
          .map(val => `"${val ?? ""}"`)
          .join(",")
      );

      const csvContent = [headers, ...rows].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${selectedReport + "-" + generateFormattedId()}.csv`
      a.click()

    } catch (error) {

    }
  }

  const handleReportTypeChange = (value) => {
    setSelectedReport(value);
    setReportDetails([]);   // clear table rows
    setShowExport(false);   // hide Export until submit again
    setCurrentPage(1);      // reset paging
  };

  // paging state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = useMemo(
    () => (reportDetails && reportDetails.length
      ? Math.max(1, Math.ceil(reportDetails.length / pageSize))
      : 1),
    [reportDetails]
  );

  const paginatedReportDetails = useMemo(() => {
    if (!reportDetails || reportDetails.length === 0) return [];
    const start = (currentPage - 1) * pageSize;
    return reportDetails.slice(start, start + pageSize);
  }, [reportDetails, currentPage]);

  // numbers for pager: 1 2 3 4 5 ... 13
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);



  const handleSubmitReports = async () => {

    if (!selectedReport || !fromDate || !toDate) {
      toast({ title: 'Please fill all the required fields', variant: 'error' });
      return; // add proper validation
    }


    try {


      const res = await api.get("/app/rest/v1/getFinalReport", {
        fromDate: fromDate,
        toDate: toDate,
        reportType: selectedReport
      });



      const response = res;

      if (response.message !== undefined && response.data.length === 0) {
        toast({ title: response.message, variant: 'error' });
        setReportDetails([]);
        setShowExport(false);
      } else {
        setReportDetails(response);
        setShowExport(true);
        setCurrentPage(1);
      }


    } catch (error) {
      console.error("Report fetch error", error);
    }
  }

  const { roleBasedNavigate, loading } = useRoleBasedNavigate();
  const { showPluginModal } = useModalHost();


  const triggerTxnView = (row) => {
    // use replace=false so browser Back returns to this list page
    roleBasedNavigate("/txn/view", false, { mkc: false, ...row });
    //showPluginModal('v2-txnreports-view', { size: "pg", ...row });
  }



  const columnsConfig = {
    Action: {
      render: (row) => {
        const name =
          typeof row === "string"
            ? row
            : row.transactionid || "";

        if (!name) return "-";

        return (
          <IconButton
            icon={"Eye"}
            size={20}
            className="cursor-pointer"
            onClick={() => triggerTxnView(row)}
          //onClick={() => showPluginModal("v2-txnreports-view", { size: 'lg', mkc: false, ...row })}
          />
        );
      },
    },
    suspicion_indicator: {
      label: "Suspicion_indicator",
      render: (row) => {
        const full = row.suspicion_indicator || "";
        if (!full) return "-";

        const short =
          full.length > 30 ? full.slice(0, 30) + "..." : full;

        // title shows full text on mouse over
        return <span title={full}>{short}</span>;
      },
    },

  };

  // Conditionally hide fields
  if (selectedReport === "STR") {
    columnsConfig.parentid = { hidden: true };
    columnsConfig.customerid = { hidden: true };
    columnsConfig.report_type = { hidden: true };
    columnsConfig.entity_id = { hidden: true };
    columnsConfig.pan = { hidden: true };
    columnsConfig.currency = { hidden: true };
    columnsConfig.transaction_type = { hidden: true };
    columnsConfig.narrative_remarks = { hidden: true };
  }
  else if (selectedReport === "CTR") {
    columnsConfig.parentid = { hidden: true };
    columnsConfig.customerid = { hidden: true };
    columnsConfig.report_type = { hidden: true };
    columnsConfig.entity_id = { hidden: true };
    columnsConfig.pan = { hidden: true };
    columnsConfig.currency = { hidden: true };
    columnsConfig.transaction_type = { hidden: true };
    columnsConfig.reamarks = { hidden: true };
  }
  else if (selectedReport === "NTR") {
    columnsConfig.parentid = { hidden: true };
    columnsConfig.customerid = { hidden: true };
    columnsConfig.report_type = { hidden: true };
    columnsConfig.entity_id = { hidden: true };
    columnsConfig.currency = { hidden: true };
    columnsConfig.purpose_of_funds = { hidden: true };
    columnsConfig.remarks = { hidden: true };
  }
  else if (selectedReport === "CBWTR") {
    columnsConfig.parentid = { hidden: true };
    columnsConfig.customerid = { hidden: true };
    columnsConfig.report_type = { hidden: true };
    columnsConfig.entity_id = { hidden: true };
    columnsConfig.currency = { hidden: true };
    columnsConfig.swift_purpose_code = { hidden: true };
    columnsConfig.remarks = { hidden: true };
  }
  else if (selectedReport === "CFTR") {
    columnsConfig.parentid = { hidden: true };
    columnsConfig.customerid = { hidden: true };
    columnsConfig.report_type = { hidden: true };
    columnsConfig.entity_id = { hidden: true };
    columnsConfig.pan = { hidden: true };
    columnsConfig.quantity = { hidden: true };
    columnsConfig.remarks = { hidden: true };
  }



  return (
    <>
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
              Final Reort
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

              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center", marginLeft: 45 }}>
                {availableLists.map((item, index) => (
                  <label
                    key={item.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      backgroundColor: chipColors[index],
                      color: "#fff",
                      transition: "0.2s ease"
                    }}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={item.value}
                      checked={selectedReport === item.value}
                      onChange={() => handleReportTypeChange(item.value)}
                      style={{ cursor: "pointer" }}
                    />
                    {item.name}
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 220 }}>
                <label style={{ marginBottom: 6, fontWeight: 500 }}>
                  From Date <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
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
                  To Date <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                    width: "100%",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Button className="btn primary" onClick={handleSubmitReports}>
                  Submit
                </Button>
                <Button className="btn primary" onClick={handleGenerateReports} disabled={!showExport}>
                  Export
                </Button>
              </div>
            </div>
          </fieldset>
        </Col>
      </Row>

      {reportDetails && reportDetails.length > 0 && (
        <Row gap="0">

          {/* pager */}
          {totalPages > 1 && (
            <div
              style={{
                margin: '12px 0',
                display: 'flex',
                justifyContent: 'flex-end',   // right-align
                alignItems: 'center',
                gap: 8,
                width: '100%',
              }}
            >
              {/* Previous */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ‹
              </button>

              {/* Page numbers + ellipsis */}
              {pageNumbers.map((item, idx) =>
                item === '...' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    style={{ padding: '0 4px', color: '#6b7280' }}
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrentPage(item)}
                    style={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: 12,
                      border:
                        item === currentPage
                          ? 'none'
                          : '1px solid #e2e8f0',
                      background:
                        item === currentPage ? '#0d6efd' : '#fff',
                      color: item === currentPage ? '#fff' : '#111827',
                      fontWeight: item === currentPage ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {item}
                  </button>
                )
              )}

              {/* Next */}
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  cursor:
                    currentPage === totalPages
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                ›
              </button>
            </div>
          )}


          <Col span="12" className="p-2">
            <SimpleCard
              title={`Final Report Details :  (${reportDetails.length} Records)`}
              padding={false} // add top margin (Tailwind) or your own class
            >   <SimpleTable
                data={paginatedReportDetails}
                className={`bg-white`}
                columns={columnsConfig}
              />
            </SimpleCard>
          </Col>
        </Row>
      )}

    </>
  );
}

export default EventsList;

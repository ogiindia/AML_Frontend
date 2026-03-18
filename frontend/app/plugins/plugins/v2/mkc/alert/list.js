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
  Pagination
} from '@ais/components';
import { SimpleTable, TableV2 } from '@ais/datatable';
import { jsonToGraphQLQuery } from '@ais/graphql';
import React, { useEffect, useState } from 'react';
import useModalHost from 'useModalHost';
import useRoleBasedNavigate from 'useRoleBasedNavigate';


function AlertList() {
  const [showModal, setshowModal] = useState(false);
  const [tableData, settableData] = useState([]);
  const [page, setPage] = useState(1);

  const { showPluginModal } = useModalHost();
  const [loading, setLoading] = React.useState(false);

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
  }, []);



  const fetchAlertsDashboard = async (range) => {
    try {
      setLoading(true);


      const res = await api.get("/app/rest/v1/getAlertRangeCount", {
        range: range
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
        range: range
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
        range: range
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
        range: range
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


  const dataStructure = {
    queryType: 'findEntitiesPendingForApprovalByPaging',
    columns: [
      { key: 'entityId', type: 'string' },
      { key: 'id', type: 'Long' },
      {
        key: 'currentLevel',
        type: 'number',
      },
      { key: 'createdAt', type: 'date' },
      { key: 'pendingData.payload', type: 'string' },

    ],
    paging: { pageNo: 1, size: 10 },
    sorting: { field: 'entityId', direction: 'DESC' },
    // "filters": [{ field: "entityId", operator: "EQUAL", value: "REVIEW" }    ]
    //    "filters": [{ field: "username", operator: "EQUAL", value: "admin" }]
  };

  const columns = {
    entityId: {
      show: true,
      label: 'Parent ID'
    },

    id: {
      show: false
    },

    currentLevel: {
      show: true,
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
          const alertId = payload.alertId || row.alertId || '0';
          return <Button label={alertId} variant='link' onClick={() => roleBasedNavigate('/mkc/alert/view', true, { size: 'pg', ...row, ...payload })} />;
        } catch (e) {
          return <Button label={row.alertId || '0'} variant='link' onClick={() => roleBasedNavigate('/mkc/alert/view', true, { size: 'pg', ...row })} />;
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
          console.log(payload);
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

    actions: {
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

  // if (loading) return <PageCenterLayout><LoadingComponent></LoadingComponent></PageCenterLayout>

  return (
    <>
      <MutedBgLayout>
        <H1>Alert List</H1>

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

        {/* <SimpleCard title={'Screening Data'}>
          <SimpleTable
            data={dataStructure}
            className={`bg-white`}
            columns={columns}
          />
        </SimpleCard> */}


        <TableV2
          title={'Screening Data'}
          // subTitle={'Events available in the system'}
          tableStructure={dataStructure}
          // tableData={tableData}
          // suffix={'stx'}
          // selectType={'radio'}
          selectKey={'id'}
          columns={columns}
          // selectedRowCallback={(e) => setstoreSelectedRows(e)}
          filterCallback={(e) => console.warn(e.target.value)}
          filterLabel={'stx'}
          //            refreshCallback={() => ld()}
          // newEntryCallback={() => triggernewRegistration()}
          // deleteCallback={(e) => triggerDelete(e)}
          //    editCallback={(e) => triggerEditIns(e)}
          customHeaderComponents={
            <></>
          }
        ></TableV2>


        {/* <SimpleModal
          isOpen={showModal}
          handleClose={() => setshowModal(false)}
          title={`Alert Details : 100`}
          size="pg"
        >
          <AlertView />
        </SimpleModal> */}
      </MutedBgLayout>
    </>
  );
}

export default AlertList;

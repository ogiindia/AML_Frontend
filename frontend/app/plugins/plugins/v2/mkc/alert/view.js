import api from "@ais/api";
import { Button, Col, CustomCheckbox, CustomTextArea, FilterBadge, H1, IconButton, MutedBgLayout, ReadOnlyField, RiskBadge, RiskScoreSlider, Row, SectionCard, SimpleCard, toast, UnderlinedTabs } from "@ais/components";
import { SimpleTable } from "@ais/datatable";
import { jsonToGraphQLQuery, VariableType } from "@ais/graphql";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import useRoleBasedNavigate from 'useRoleBasedNavigate';



export default function View({ parentId, instanceId, customerId, entityId, transactionId }) {

    const [loading, setloading] = React.useState();
    const [buttonloading, setbuttonloading] = useState(false);
    const [comments, setcomments] = useState("");
    const [issuspicious, setissuspicious] = useState(false);

    const [commentsList, setcommentsList] = useState([]);
    const [currentTransaction, setcurrentTransaction] = useState({});
    const [alertList, setalertList] = useState([]);
    const [customerDetails, setcustomerDetails] = useState({});

    const [israisecdd, setisraisecdd] = useState(false);
    const [israiseedd, setisraiseedd] = useState(false);
    const [kycStatus, setKycStatus] = useState('NOT_REQUIRED'); // 'VERIFIED' | 'UN_VERIFIED' | 'NOT_REQUIRED'

    const [files, setFiles] = useState([]);
    const [evidenceList, setEvidenceList] = useState([]);
    const [evidenceFileList, setEvidenceFileList] = useState([]);

    const [custScore, setCustScore] = useState(0);
    const [transScore, setTransScore] = useState(0);

    const fileInputRef = useRef(null);

    const [custRuleCount, setCustRuleCount] = useState([]);
    // {"parentId":"8","customerId":"1","alertId":1,"customerAccountType":"-","instanceId":null,"comments":null,"approved":false}
    const { state } = useLocation();


    const { roleBasedNavigate } = useRoleBasedNavigate();

    const [selectedBadge, setselectedBadge] = useState("STR");

    const [openedAlert, setOpenedAlert] = useState([]);
    const [closedAlert, setClosedAlert] = useState([]);
    const [triggeredAlert, setTriggeredAlert] = useState([]);
    const [previousTransList, setPreviousTransList] = useState([]);


    const [openedAlertCount, setOpenedAlertCount] = useState(0);
    const [closedAlertCount, setClosedAlertCount] = useState(0);
    const [triggeredAlertCount, setTriggeredAlertCount] = useState(0);
    const [previousTransListCount, setPreviousTransListCount] = useState(0);





    const [kycScoreDate, setKycScoreDate] = useState([]);
    const [sanctionScore, setSanctionScore] = useState([]);



    const riskData = [
        { category: "LOAN", percentage: 60 },
        { category: "PPF", percentage: 25 },
        { category: "ACCOUNT", percentage: 15 }
    ];

    const [showRiskScoreModal, setShowRiskScoreModal] = useState(false);

    // animated percentage state
    const [animatedPercents, setAnimatedPercents] = useState(riskData.map(() => 0));

    // animate percentages when modal opens
    useEffect(() => {
        if (!showRiskScoreModal) {
            setAnimatedPercents(riskData.map(() => 0));
            return;
        }

        const duration = 800; // animation duration in ms
        const targets = riskData.map(r => r.percentage);
        const start = performance.now();

        let rafId;
        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            setAnimatedPercents(targets.map(p => Math.round(p * t)));
            if (t < 1) rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [showRiskScoreModal, /* keep riskData stable if defined inline change accordingly */]);

    const openRiskModal = () => setShowRiskScoreModal(true);
    const closeRiskModal = () => setShowRiskScoreModal(false);

    useEffect(() => {
        console.log("State in view page", state);
    }, [state]);

    useEffect(() => {

        const gjson = {
            query: {
                __variables: {
                    parentId: 'String!',
                    // instanceId: 'String!',
                    customerId: 'String!',
                    txnId: 'String!'
                }, getWorflowHistoryByParentId: {
                    __args: {
                        id: new VariableType('parentId')
                    },
                    levelNumber: true,
                    approverName: true,
                    action: true,
                    comment: true,
                    createdAt: true
                },

                findTransactionEntitybyId: {
                    __args: {
                        id: new VariableType('txnId')
                    },
                    transactionid: true,
                    customerid: true,
                    accountno: true,
                    branchcode: true,
                    transactiontype: true,
                    channeltype: true,
                    transactiondate: true,
                    transactiontime: true,
                    amount: true,
                    depositorwithdrawal: true,
                    narration: true
                },
                findAlertsByParentId: {
                    __args: {
                        parentId: new VariableType('parentId'),
                    },
                    alertParentId: true,
                    alertId: true,
                    alertName: true,
                    alertDesc: true,
                    alertStatus: true,
                    accNo: true,
                    custId: true,
                    transactionId: true,
                    riskCategory: true,
                }, findCustomerEntitybyId: {
                    __args: {
                        id: new VariableType('customerId')
                    },

                    customerid: true,
                    customername: true,
                    customertype: true,
                    customercategory: true,
                    bankcode: true,
                    branchcode: true,
                    natureofbusiness: true,
                    creditrating: true,
                    createddatetime: true,

                    dateofbirth: true,
                    nationality: true,
                    age: true,
                    sex: true,

                    occupation: true,
                    addressline1: true,
                    phoneno: true,
                    mobileno: true,

                    // introducercategory: true,
                    // introducercustomerid: true,
                    // estimatedincomefrombusiness: true,
                    // checked: true,
                    // net_worth: true,
                    // customerempcode: true,
                    // minor: true,
                    // fatfncct: true,
                    // otherincome: true,
                    // annualincome: true,
                    // wblist: true,
                    // drugtrafficking: true,
                    // introducername: true,
                    // intercountry: true,
                }
            }
        }


        const gql = jsonToGraphQLQuery(gjson);
        console.log(gql);
        api.graphql(gql, { parentId: state?.parentId || parentId, instanceId: state?.instanceId || instanceId, customerId: state?.customerId || customerId, txnId: state?.transactionId || transactionId }).then((res) => {
            const { error, data } = res;

            if (data && "getWorflowHistoryByParentId" in data) {
                setcommentsList(data['getWorflowHistoryByParentId']);
            }

            if (data && "findTransactionEntitybyId" in data) {
                setcurrentTransaction(data['findTransactionEntitybyId']);
            }

            if (data && "findCustomerEntitybyId" in data) {
                setcustomerDetails(data['findCustomerEntitybyId']);
            }

        });



        api.get('/app/rest/v1/getDiligenceDetails', {
            customerId: state ? state.customerId || customerId : customerId
        }).then((res) => {
            setEvidenceList(res);
        }).catch((err) => {
            console.error("Error fetching diligence details", err);
        });


        api.get('/app/rest/v1/getCustomerRuleCount', {
            customerId: state ? state.customerId || customerId : customerId,
            parentId: state?.parentId || parentId
        }).then((res) => {
            setCustRuleCount(res);
        }).catch((err) => {
            console.error("Error fetching customer rule count", err);
        });



        api.get('/app/rest/v1/getCustomerScore', {
            customerId: state ? state.customerId || customerId : customerId,
            transactionId: state?.transactionId || transactionId
        }).then((res) => {

            const payload = Array.isArray(res) ? res[0] || {} : res || {};

            const cust = Number(payload.custRiskScore ?? 0);
            const trans = Number(payload.tranRiskScore ?? 0);

            setCustScore(Number.isFinite(cust) ? cust : 0);
            setTransScore(Number.isFinite(trans) ? trans : 0);



        });


        handleFilterClick('STR');


        try {

            api.get('/app/rest/v1/getOpenedAlerts', {
                customerId: state ? state.customerId || customerId : customerId,
                ruleType: '',
                parentId: state?.parentId || parentId
            }).then((res) => {

                setOpenedAlertCount(res.length || 0);
                setOpenedAlert(res);
            });

        } catch (err) {
            console.error("Error fetching opened alerts:", err);
            setOpenedAlertCount(0);
            setOpenedAlert([]);
        }

        try {
            api.get('/app/rest/v1/getClosedAlerts', {
                customerId: state ? state.customerId || customerId : customerId,
                ruleType: '',
                parentId: state?.parentId || parentId
            }).then((res) => {
                setClosedAlertCount(res.length || 0);
                setClosedAlert(res);
            });
        } catch (err) {
            console.error("Error fetching closed alerts:", err);
            setClosedAlertCount(0);
            setClosedAlert([]);
        }

        try {
            api.get('/app/rest/v1/getTriggedAlerts', {
                customerId: state ? state.customerId || customerId : customerId,
                ruleType: '',
                parentId: state?.parentId || parentId
            }).then((res) => {
                setTriggeredAlertCount(res.length || 0);
                setTriggeredAlert(res);
            });

        } catch (err) {
            console.error("Error fetching triggered alerts:", err);
            setTriggeredAlertCount(0);
            setTriggeredAlert([]);
        }

        try {
            api.get('/app/rest/v1/getPreviousTransactions', {
                customerId: state ? state.customerId || customerId : customerId
            }).then((res) => {
                setPreviousTransListCount(res.length || 0);
                setPreviousTransList(res);
            });

        } catch (err) {
            console.error("Error fetching previous transactions:", err);
            setPreviousTransListCount(0);
            setPreviousTransList([]);
        }


        try {
            api.get('/app/rest/v1/getKycScoreAndDate', {
                customerId: state ? state.customerId || customerId : customerId
            }).then((res) => {
                setKycScoreDate(res);

                if (res[0]?.risk_category === 'CDD') {
                    setisraisecdd(true);
                }
                else if (res[0]?.risk_category === 'EDD') {
                    setisraiseedd(true);
                }


                if (res[0]?.alert_status === 'verified') {
                    setKycStatus('VERIFIED');
                }
                else if (res[0]?.alert_status === 'unverified') {
                    setKycStatus('UN_VERIFIED');
                }
                else {
                    setKycStatus('NOT_REQUIRED');
                }
            });
        } catch (err) {
            console.error("Error fetching KYC score and date:", err);
            setKycScoreDate([]);
        }

        try {
            api.get('/app/rest/v1/getSanctionScore', {
                customerId: state ? state.customerId || customerId : customerId
            }).then((res) => {
                setSanctionScore(res);
            });
        } catch (err) {
            console.error("Error fetching sanction score:", err);
            setSanctionScore([]);
        }


    }, []);

    const handleFilterClick = async (selectedValue) => {
        try {
            setselectedBadge(selectedValue);

            const res = await api.get('/app/rest/v1/getCustomerRuleDetails', {
                customerId: state ? state.customerId || customerId : customerId,
                ruleType: selectedValue,
                parentId: state?.parentId || parentId
            });

            setalertList(res);

        } catch (err) {
            console.error("Error fetching customer rule details:", err);
            setalertList([]);
        }
    };



    const updateKYCDetails = async () => {
        try {
            const response = await api.post('/app/rest/v1/setKYCAlertGenerated', {
                cust_id: state ? state.customerId || customerId : customerId,
                transactionId: currentTransaction.transactionid.toString(),
                cdd_edd: (israisecdd ? 'CDD' : israiseedd ? 'EDD' : 'NONE'),
                alert_status: kycStatus
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            if (response === "SUCCESS") {
                roleBasedNavigate("/mkc/alert/dashboard");
                console.log('Update KYC Saved Successfully');
                toast({ title: 'Update KYC Saved Successfully', variant: 'success' });
            } else {
                alert("Something went wrong");
                console.log("Test Data " + response.data);
            }

            //alert('Sanction saved successfully!');


        } catch (error) {

            console.error("Save failed", error);
            toast({ title: 'Failed to save KYC!', description: error?.message || '', variant: 'error' });
            //alert('Failed to save KYC!');

        }
    };


    const updateCaregoryWiseTransaction = async () => {
        try {
            const response = await api.post(
                '/app/rest/v1/setCaregoryWiseTransaction',
                {
                    cust_id: state ? state.customerId || customerId : customerId,
                    transactionId: currentTransaction.transactionid?.toString(),
                    cdd_edd: israisecdd ? 'CDD' : israiseedd ? 'EDD' : 'NONE',
                    alert_status: kycStatus,
                    parentId: state?.parentId || parentId
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response === "SUCCESS") {
                console.log('Category Wise Transaction Updated Successfully');
                //alert("Category Wise Transaction Updated Successfully");
            } else {
                console.error('Category Wise Transaction Update Failed');
                //alert("Something went wrong");
            }
            //toast({ title: 'Category Wise Transaction Updated Successfully', variant: 'success' });
            //alert('Sanction saved successfully!');
        } catch (error) {
            console.error("Update failed", error);
            //toast({ title: 'Failed to update Category Wise Transaction!', description: error?.message || '', variant: 'error' });
            //alert('Failed to update Category Wise Transaction!');
        }
    };


    const updateDelicansDetails = async () => {
        const formData = new FormData();
        formData.append("parentId", state.parentId.toString());
        formData.append("TransactionId", currentTransaction.transactionid.toString());
        formData.append("customerId", state.customerId.toString());
        formData.append("CDD_EDD", israisecdd ? 'CDD' : israiseedd ? 'EDD' : 'NONE');

        console.log("parentId" + state.parentId.toString());
        console.log("TransactionId" + currentTransaction.transactionid.toString());
        console.log("customerId" + state.customerId);
        console.log("CDD_EDD" + (israisecdd ? 'CDD' : israiseedd ? 'EDD' : 'NONE'));
        // send file names
        for (let i = 0; i < files.length; i++) {
            formData.append("fileNames", files[i].name);
            formData.append("files", files[i]);
        }

        try {
            const res = await api.postUpload('/app/rest/v1/uploadEvidence', formData);
            if (res.data === "SUCCESS") {
                console.debug('Upload response', res);
                console.log("Category Wise Transaction Updated Successfully");
            } else {
                console.log("Something went wrong");
            }
            //alert('Uploaded successfully');
        } catch (err) {
            console.error('Upload error', err);
            //alert('Upload failed');
        }


    };

    const viewEvidence = async (name) => {
        try {
            const res = await api.get('/app/rest/v1/getDiligenceFileDetails', {
                customerId: state ? state.customerId || customerId : customerId,
                transId: name
            });
            console.log(res);
            // api.get returns the parsed response (response.data). Normalize to an array.
            setEvidenceFileList(res);

        } catch (err) {
            console.error('Failed to fetch evidence files', err);
            setEvidenceFileList([]);
        }
    };

    const openEvidence = async (name) => {
        try {
            const customer = state?.customerId || customerId || '';
            const transId = currentTransaction?.transactionid || currentTransaction?.transactionId || '';

            const endpoint = '/app/rest/v1/getDocumentFiles';

            // call api.download with params (do NOT put responseType inside params)
            const { blob, contentType } = await api.download(endpoint, {
                params: { customerId: customer, transactionId: transId, filename: name },
                responseType: 'arraybuffer' // server returns bytes
            });

            // Construct typed blob (use server content-type if present)
            const mime = contentType || (name.endsWith('.pdf') ? 'application/pdf' : '');
            const fileBlob = new Blob([blob], { type: mime });

            const url = URL.createObjectURL(fileBlob);
            window.open(url, '_blank', 'noopener,noreferrer');

            // cleanup later
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (err) {
            console.error('Failed to open evidence file', err);
        }
    };


    const triggerSuspiousButton = () => {
        if (israisecdd || israiseedd) return;

        setbuttonloading(true);

        const gjson = {
            mutation: {
                __variables: {
                    parentId: 'String!',
                    instanceId: 'String!',
                    isApproved: 'Boolean!',
                    comments: 'String!'
                },
                updateAlertsViaReview: {
                    __args: {
                        alert: {
                            parentId: new VariableType('parentId'),
                            instanceId: new VariableType('instanceId'),
                            isApproved: new VariableType('isApproved'),
                            comments: new VariableType('comments')
                        }
                    },
                }
            }
        }

        const graphqlQuery = jsonToGraphQLQuery(gjson);

        api.graphql(graphqlQuery, {
            isApproved: issuspicious,
            instanceId: instanceId || state.id,
            parentId: parentId || state.parentId,
            comments: comments,

        }).then((res) => {




            const { loading, error, data } = res;
            setbuttonloading(loading);



            if (error) {
                toast({
                    title: "Error Approving alert",
                    variant: "error"
                });
            }

            if (data) {

                updateDelicansDetails();

                updateCaregoryWiseTransaction();

                toast({
                    title: "Alert Authorized successfully",
                    variant: "success"
                });

                roleBasedNavigate("/mkc/alert/dashboard");
            }
        });


    }

    function GeneralTabView() {

        return (

            <>
                <Row>
                    <Col span="12">
                        <Row>
                            <Col span="12">
                                <SimpleCard title={`Customer Details`}
                                    customHeaderComponents={(<>
                                        <div class="flex items-center space-x-2">
                                            <span className={`text-muted-foreground`} >Risk Score</span>
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => setShowRiskScoreModal(true)}
                                            >
                                                <RiskBadge score={custScore} />
                                            </span>


                                            {/* <RiskBadge score={custScore} />   */}
                                        </div>
                                    </>)}
                                >
                                    <Row>
                                        {customerDetails && Object.keys(customerDetails).map((cust, index) => {
                                            if (customerDetails[cust] != null) {
                                                return (
                                                    <Col span='auto' key={cust}>
                                                        <ReadOnlyField title={cust}>
                                                            <span>{customerDetails[cust]}</span>
                                                        </ReadOnlyField>
                                                    </Col>
                                                );
                                            }
                                        })}
                                    </Row>
                                </SimpleCard>
                            </Col>

                            <Col span="12">
                                <SimpleCard title={`Transaction Details`}>
                                    <Row>
                                        {currentTransaction && Object.keys(currentTransaction).map((cust, index) => {
                                            return (
                                                <Col span='auto' key={cust}>
                                                    <ReadOnlyField title={cust}>
                                                        <span>{currentTransaction[cust]}</span>
                                                    </ReadOnlyField>
                                                </Col>
                                            );
                                        })}
                                    </Row>

                                </SimpleCard>
                            </Col>
                        </Row>
                    </Col>

                    <Col span="12">
                        <Col span="12">
                            <Row gap="0" className="p-2">
                                <Col span="auto">
                                    <FilterBadge onClick={() => handleFilterClick("STR")} active={selectedBadge === `STR`} label={`STR`} count={custRuleCount.find(item => item.name === "STR")?.value || 0} />
                                </Col>
                                <Col span="auto">
                                    <FilterBadge onClick={() => handleFilterClick("CTR")} active={selectedBadge === `CTR`} label={`CTR`} count={custRuleCount.find(item => item.name === "CTR")?.value || 0} />
                                </Col>
                                <Col span="auto">
                                    <FilterBadge onClick={() => handleFilterClick("NTR")} active={selectedBadge === `NTR`} label={`NTR`} count={custRuleCount.find(item => item.name === "NTR")?.value || 0} />
                                </Col>
                                <Col span="auto">
                                    <FilterBadge onClick={() => handleFilterClick("CBWT")} active={selectedBadge === `CBWT`} label={`CBWT`} count={custRuleCount.find(item => item.name === "CBWT")?.value || 0} />
                                </Col>

                            </Row>
                        </Col>
                        <SimpleCard>
                            <SimpleTable data={alertList} />
                        </SimpleCard>
                    </Col>

                    <Col span="12">
                        <SimpleCard title={`Alert Comments`}>
                            <SimpleTable data={commentsList} />
                        </SimpleCard>
                    </Col>


                    <Col span="12">
                        <SimpleTable title={`Customer Accounts`} />
                    </Col>

                    <Col span='12'>

                        <SimpleCard>
                            <Row>

                                <Col span='6'>
                                    <Row align='center'>
                                        <Col span='flex'>
                                            <CustomTextArea key={`comments`} id={`comments`} name={`comments`} onChange={e => setcomments(e.target.value)} placeholder="Comments" />
                                        </Col>
                                        <Col span='auto'>
                                            <CustomCheckbox
                                                name="isSuspious"
                                                label="suspicious"
                                                value={issuspicious}
                                                disabled={israisecdd || israiseedd}
                                                onChange={(e) => {
                                                    if (israisecdd || israiseedd) return;
                                                    setissuspicious(e.target.value);
                                                }}
                                            />  </Col>
                                    </Row>
                                </Col>



                                <Col span='12'>

                                    <Row align='center'>

                                        <Col span='auto'>
                                            <CustomCheckbox
                                                name={`isCDD`}
                                                label={"Raise CDD"}
                                                value={israisecdd}
                                                disabled={kycStatus === 'VERIFIED'}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setisraisecdd(v);
                                                    if (v) setisraiseedd(false);
                                                }}
                                            />
                                        </Col>

                                        <Col span='auto'>
                                            <CustomCheckbox
                                                name={`isEDD`}
                                                label={"Raise EDD"}
                                                value={israiseedd}
                                                disabled={kycStatus === 'VERIFIED'}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setisraiseedd(v);
                                                    if (v) setisraisecdd(false);
                                                }}
                                            />
                                        </Col>

                                        <Col span='auto'>
                                            <div style={{ marginBottom: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <div style={{ marginBottom: 10 }}>KYC Status</div>
                                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <input type="radio" name="kycStatus" value="VERIFIED" checked={kycStatus === 'VERIFIED'} onChange={e => {
                                                            setKycStatus(e.target.value);
                                                            if (e.target.value === 'VERIFIED') {
                                                                setisraisecdd(false);
                                                                setisraiseedd(false);
                                                            }
                                                        }} />
                                                        <span>Verified</span>
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <input type="radio" name="kycStatus" value="UN_VERIFIED" checked={kycStatus === 'UN_VERIFIED'} onChange={e => setKycStatus(e.target.value)} />
                                                        <span>Un-Verified</span>
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <input type="radio" name="kycStatus" value="NOT_REQUIRED" checked={kycStatus === 'NOT_REQUIRED'} onChange={e => setKycStatus(e.target.value)} />
                                                        <span>Not Required</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </Col>

                                    </Row>

                                </Col>


                                {/* {evidenceList && evidenceList.length == 0 && ( */}
                                <Col span='12'>

                                    <Row align='center'>

                                        <Col span='auto'>
                                            <label htmlFor="evidence" className="mr-2">Upload Evidences</label>
                                        </Col>

                                        <Col span='auto' className="flex items-center">
                                            <input
                                                id="evidence"
                                                type="file"
                                                ref={fileInputRef}
                                                multiple
                                                style={{ display: 'none' }}
                                                accept=".pdf,.doc,.docx,image/*"
                                                onChange={e => {
                                                    const selected = e.target.files ? Array.from(e.target.files) : [];
                                                    const allowed = [];
                                                    const invalid = [];

                                                    selected.forEach(f => {
                                                        const t = f.type || '';
                                                        const ext = (f.name.split('.').pop() || '').toLowerCase();
                                                        const isImage = t.startsWith('image/');
                                                        const isPdf = t === 'application/pdf' || ext === 'pdf';
                                                        const isDoc =
                                                            t === 'application/msword' ||
                                                            t === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                                                            ['doc', 'docx'].includes(ext);

                                                        if (isImage || isPdf || isDoc) allowed.push(f);
                                                        else invalid.push(f.name);
                                                    });

                                                    if (invalid.length > 0) {
                                                        toast({
                                                            title: `Some files were ignored`,
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
                                        </Col>
                                    </Row>

                                </Col>

                                {/* )} */}



                            </Row >
                        </SimpleCard >
                    </Col >
                    {evidenceList && evidenceList.length > 0 && (
                        <Col>
                            <SimpleCard title="Uploaded Evidences">
                                <SimpleTable
                                    data={evidenceList}
                                    columns={{
                                        // hide lowercase/raw key if present
                                        fileNames: { hidden: true },
                                        // show a single linked filename column (supports either case)
                                        FileNames: {
                                            render: (row) => {
                                                const name = row.FileNames || row.fileNames || row.filename || row.FileName || '';
                                                if (!name) return '-';
                                                const customer = state?.customerId || customerId || '';
                                                //const url = `http://localhost:8080/app/rest/v1/downloadFile/${encodeURIComponent(customer)}/${encodeURIComponent(name)}`; // adjust if needed
                                                return (
                                                    <a href="#" onClick={e => { e.preventDefault(); viewEvidence(name); }} className="text-primary underline">{name}</a>
                                                );
                                            },
                                        },
                                    }}
                                />
                            </SimpleCard>
                        </Col>
                    )}


                    {evidenceFileList && evidenceFileList.length > 0 && (
                        <Col>
                            <SimpleCard title="Evidences File Lists">
                                <SimpleTable
                                    data={evidenceFileList}
                                    columns={{
                                        // if rows are plain strings, normalize in render

                                        Action: {
                                            render: (row) => {
                                                const name = (typeof row === 'string') ? row :
                                                    row.FileName || row.fileName || row.FileNames || row.fileNames || row.filename || '';
                                                if (!name) return '-';
                                                return (

                                                    <IconButton
                                                        icon={'Eye'}
                                                        size={20}
                                                        className={`cursor-pointer`}
                                                        onClick={(e) => { e.preventDefault(); openEvidence(name); }}
                                                    ></IconButton>

                                                );
                                            },
                                        },
                                    }}
                                />
                            </SimpleCard>
                        </Col>
                    )}
                    <Col span='auto'>
                        <Button
                            loading={buttonloading}
                            label={`${issuspicious ? 'Mark as suspicious' : 'Mark as not suspicious'}`}
                            onClick={() => triggerSuspiousButton()}
                            disabled={israisecdd || israiseedd}
                        />  </Col>
                    {(israisecdd || israiseedd) && (
                        <Col span='auto'>
                            <Button loading={buttonloading} label="Save" onClick={updateKYCDetails} />
                        </Col>
                    )}
                </Row >

                {showRiskScoreModal && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.45)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999
                        }}
                        onClick={closeRiskModal}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            style={{
                                width: 520,
                                maxWidth: "92vw",
                                background: "#fff",
                                borderRadius: 8,
                                padding: 16,
                                boxShadow: "0 6px 18px rgba(0,0,0,0.12)"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 700 }}>Risk Category Details</h3>

                            <div style={{ borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                                {riskData.map((item, idx) => (
                                    <div
                                        key={item.category}
                                        style={{
                                            padding: "10px 0",
                                            borderBottom: idx < riskData.length - 1 ? "1px solid #eee" : "none"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                            <div style={{ fontSize: 14 }}>{item.category}</div>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{animatedPercents[idx]}%</div>
                                        </div>
                                        <div style={{ height: 10, borderRadius: 6, background: "#f1f5f9", overflow: "hidden" }}>
                                            <div
                                                style={{
                                                    width: `${animatedPercents[idx]}%`,
                                                    height: "100%",
                                                    background: "#0ea5e9",
                                                    transition: "width 120ms linear"
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 14, textAlign: "right" }}>


                                <Button loading={buttonloading} label="CLOSE" style={{ float: "inline-end" }} onClick={closeRiskModal} >
                                </Button>
                            </div>
                        </div>
                    </div>
                )
                }

            </>
        )
    };

    const tabs = [
        {
            name: 'Alert Details',
            value: 'general',
            content: (
                <Row>
                    <Col span="12">
                        <Row>
                            <Col span="flex">
                                <SectionCard padding={false}>
                                    <div className={`py-5`}>
                                        <RiskScoreSlider label="FINSEC Score" score={transScore} />
                                    </div>
                                </SectionCard>
                            </Col>
                            <Col span="flex">
                                <SectionCard>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            KYC Risk Score
                                        </span>
                                        <span className="text-sm font-semibold text-warning">{kycScoreDate[0]?.risk_score}</span>
                                    </div>
                                </SectionCard>
                            </Col>
                            <Col span="flex">
                                <SectionCard>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            KYC Update
                                        </span>
                                        <span className="text-sm font-semibold text-warning" style={{ marginRight: '-5px' }}>{kycScoreDate[0]?.modified_dt}</span>

                                    </div>

                                </SectionCard>
                            </Col>
                            <Col span="flex">
                                <SectionCard>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Sanction Score
                                        </span>
                                        <span className="text-sm font-semibold text-info">{sanctionScore[0]?.confidence_score}</span>
                                    </div>
                                </SectionCard>
                            </Col>

                            {/* <Col span="flex">
                                <SectionCard>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Reported In I4c
                                        </span>
                                        <span className="text-sm font-semibold text-warning">0</span>
                                    </div>
                                </SectionCard>
                            </Col>
                            <Col span="flex">
                                <SectionCard>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Reported in FRI
                                        </span>
                                        <span className="text-sm font-semibold text-destructive">100</span>
                                    </div>

                                </SectionCard>
                            </Col>
                            <Col span="flex">
                                <SectionCard>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Reported in MNRL
                                        </span>
                                        <span className="text-sm font-semibold text-info">5</span>
                                    </div>
                                </SectionCard>
                            </Col> */}
                            <Col span="flex">
                                <SectionCard>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Is Mule Account
                                        </span>
                                        <span className="text-sm font-semibold text-info">Yes</span>
                                    </div>
                                </SectionCard>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        {GeneralTabView()}
                    </Col>
                </Row>
            ),
        },
        {
            name: 'Opened Alerts',
            value: 'str',
            badge: openedAlertCount,
            content: (
                <Row gap="0">
                    <Col span="12" className="p-2">
                        <SimpleCard title={`Opened Alerts`}>
                            <SimpleTable
                                data={openedAlert}
                                className={`bg-white`}
                            />
                        </SimpleCard>
                    </Col>
                </Row>
            ),
        },
        {
            name: 'Previously Closed Alerts',
            value: 'pca',
            badge: closedAlertCount,
            content: (
                <Row gap="0">
                    <Col span="12" className="p-2">
                        <SimpleCard title={`Previously Closed Alerts`}>
                            <SimpleTable
                                data={closedAlert}
                                className={`bg-white`}
                            />
                        </SimpleCard>
                    </Col>
                </Row>
            ),
        },

        {
            name: 'Previously Triggered Alerts',
            value: 'pct',
            badge: triggeredAlertCount,
            content: (
                <Row gap="0">
                    <Col span="12" className="p-2">
                        <SimpleCard title={`Previously Triggered Alerts`}
                        >
                            <SimpleTable
                                data={triggeredAlert}
                                className={`bg-white`}
                            />
                        </SimpleCard>
                    </Col>
                </Row>
            ),
        },

        {
            name: 'Last 6 months Transactions',
            value: 'lmt',
            badge: previousTransListCount,
            content: (
                <Row gap="0">
                    <Col span="12" className="p-2">
                        <SimpleCard
                            title={`Last 6 months Transactions`}
                        >
                            <SimpleTable
                                data={previousTransList}
                                className={`bg-white`}
                            />
                        </SimpleCard>
                    </Col>
                </Row>
            ),
        },


    ];

    return (
        <MutedBgLayout>
            <Row gap="2">
                <Col span="12">
                    <Row>
                        <Col span="flex">
                            <H1>
                                Transaction Authorization </H1>
                            <span>
                                FINSEC Status : <span className={`${state?.alertStatus === 'APPROVED' ? 'text-primary' : state?.alertStatus === "REJECTED" ? 'text-destructive' : 'text-info'}`}>
                                    {state?.alertStatus}
                                </span>
                            </span>
                        </Col>
                    </Row>

                </Col>

                <Col span="12">
                    <UnderlinedTabs tabData={tabs} defaultValue={`general`} />
                </Col>



                <Col padding={false} span={'12'}>
                    {/* {GeneralTabView()} */}
                </Col>
            </Row>
        </MutedBgLayout>



    );



}
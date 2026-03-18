import api from "@ais/api";
import { Button, Col, CustomCheckbox, CustomTextArea, FilterBadge, H1, MutedBgLayout, ReadOnlyField, RiskBadge, Row, SimpleCard, toast, UnderlinedTabs } from "@ais/components";
import { SimpleTable } from "@ais/datatable";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
export default function View() {

    const [issuspicious, setissuspicious] = useState(false);


    const [israisecdd, setisraisecdd] = useState(false);
    const [israiseedd, setisraiseedd] = useState(false);
    const [files, setFiles] = useState([]);
    const [evidenceList, setEvidenceList] = useState([]);


    const fileInputRef = useRef(null);

    const [selectedBadge, setselectedBadge] = useState("STR");

    const { state } = useLocation();






    useEffect(() => {


        api.get('/app/rest/v1/getDiligenceDetails', {
            customerId: state ? state.customerId || customerId : customerId
        }).then((res) => {
            setEvidenceList(res);
        });



    }, []);




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
                                            <RiskBadge score={`75`} />
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
                                    <FilterBadge onClick={() => setselectedBadge("STR")} active={selectedBadge === `STR`} label={`STR`} count={2} />
                                </Col>
                                <Col span="auto">
                                    <FilterBadge onClick={() => setselectedBadge("CTR")} active={selectedBadge === "CTR"} label={`CTR`} count={2} />
                                </Col>
                                <Col span="auto">
                                    <FilterBadge onClick={() => setselectedBadge("CBWT")} active={selectedBadge === "CBWT"} label={`CBWT`} count={2} />
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
                                            <CustomCheckbox name={`isSuspious`} label={"suspicous"} value={issuspicious} onChange={(e) => setissuspicious(e.target.value)} />
                                        </Col>
                                    </Row>
                                </Col>



                                <Col span='12'>

                                    <Row align='center'>

                                        <Col span='auto'>
                                            <CustomCheckbox
                                                name={`isCDD`}
                                                label={"Raise CDD"}
                                                value={israisecdd}
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
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setisraiseedd(v);
                                                    if (v) setisraisecdd(false);
                                                }}
                                            />
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

                </Row >
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
            badge: '0',
            content: (
                <Row gap="0">
                    <Col span="12" className="p-2">
                        <SimpleCard title={`Opened Alerts`}>
                            <SimpleTable
                                data={[]}
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
                                Periodical Alerts </H1>
                        </Col>
                    </Row>

                </Col>

                <Col span="12">
                    <UnderlinedTabs tabData={tabs} defaultValue={`general`} />
                </Col>


            </Row>
        </MutedBgLayout>
    );

}
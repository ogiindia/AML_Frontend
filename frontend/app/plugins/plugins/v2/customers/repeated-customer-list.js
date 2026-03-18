import { Col, H3, Row } from "@ais/components";
import { SimpleTable } from "@ais/datatable";
import React from "react";

function RepeatedCustomerList() {

    const [loading, setloading] = React.useState(false);

    const data = [
        {
            customerId: "customer15",
            customerBranch: 'branch 1',
            customerType: "NRI",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 10,
            ClosedAlerts: 100,
            ClutchedAlerts: 0
        },
        {
            customerId: "customer46",
            customerBranch: 'branch 1',
            customerType: "INDIVIDUAL",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 20,
            ClosedAlerts: 160,
            ClutchedAlerts: 0
        },
        {
            customerId: "customer234",
            customerBranch: 'branch 10',
            customerType: "NGO",
            riskScore: 80,
            kycStatus: true,
            OpenAlerts: 0,
            ClosedAlerts: 75,
            ClutchedAlerts: 5
        },
        , {
            customerId: "customer26",
            customerBranch: 'branch 50',
            customerType: "COMPANY",
            riskScore: 95,
            kycStatus: false,
            OpenAlerts: 30,
            ClosedAlerts: 200,
            ClutchedAlerts: 15
        }
        , {
            customerId: "customer65",
            customerBranch: 'branch 1',
            customerType: "HUF",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 10,
            ClosedAlerts: 75,
            ClutchedAlerts: 0
        }
        , {
            customerId: "customer89",
            customerBranch: 'branch 1',
            customerType: "MINOR",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 10,
            ClosedAlerts: 200,
            ClutchedAlerts: 50
        }
        , {
            customerId: "customer153",
            customerBranch: 'branch 123',
            customerType: "PA",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 10,
            ClosedAlerts: 30,
            ClutchedAlerts: 0
        }
        , {
            customerId: "customer1",
            customerBranch: 'branch 1',
            customerType: "NRI",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 10,
            ClosedAlerts: 150,
            ClutchedAlerts: 0
        }
        , {
            customerId: "customer1",
            customerBranch: 'branch 1',
            customerType: "NRI",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 10,
            ClosedAlerts: 150,
            ClutchedAlerts: 0
        }
        , {
            customerId: "customer1",
            customerBranch: 'branch 1',
            customerType: "NRI",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 10,
            ClosedAlerts: 150,
            ClutchedAlerts: 0
        }
        , {
            customerId: "customer1",
            customerBranch: 'branch 1',
            customerType: "NRI",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 10,
            ClosedAlerts: 150,
            ClutchedAlerts: 0
        }
        , {
            customerId: "customer1",
            customerBranch: 'branch 1',
            customerType: "NRI",
            riskScore: 100,
            kycStatus: true,
            OpenAlerts: 10,
            ClosedAlerts: 150,
            ClutchedAlerts: 0
        }
    ]

    return (<>
        <Row>
            <Col>
                <H3>
                    Suspicious Customer With History Pattern
                </H3>
                <SimpleTable data={data} columns={{
                    customerId: {
                        label: "Customer Id"
                    }, customerBranch: {
                        label: "Customer Branch"
                    },
                    customerType: {
                        label: "Customer Type"
                    },
                    riskScore: {
                        label: "Risk Score"
                    },
                    kycStatus: {
                        label: "KYC status"
                    },
                    OpenAlerts: {
                        label: "Open Alerts"
                    },
                    ClosedAlerts: {
                        label: "Closed Alerts"
                    }, ClutchedAlerts: {
                        label: "Clutched Alerts"
                    }
                }} />
            </Col>
        </Row>
    </>);
}

export default RepeatedCustomerList;
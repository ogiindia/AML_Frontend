/* eslint-disable no-unused-vars */

import {
    Col,
    CustomInput,
    CustomSelect,
    H1,
    H3,
    MutedBgLayout,
    NewButton,
    Row,
    SimpleCard
} from '@ais/components';
import { VariableType } from '@ais/graphql';
import React, { useEffect, useState } from 'react';

import GaugeChart from '../../../components/charts/GaugeChart';


function KYCView() {
    React.useEffect(() => {
        console.log('into schemaList');
    }, []);

    const [schemaMaster, setschemaMaster] = useState([]);


    useEffect(() => {
        let glJson = {
            query: {
                __variables: {
                    type: 'String!'
                },
                listCatalogTypes: {
                    id: true,
                    name: true
                },
                listSchemaMasterByType: {
                    __args: {
                        type: new VariableType('type')
                    },
                    id: true,
                    schemaName: true
                }
            }
        }


        const data = [
            { name: "US Passport", value: 'US Passport' },
            { name: "Generic Passport", value: "Generic Passport" },
            { name: "Emirates ID", value: "Emirates ID" },
            { name: "US Driving Licence", value: "US Driving Licence" },
            { name: "Singapore UEN", value: "Singapore UEN" },
            { name: "Global Verification", value: "Global Verification" },
            { name: "Qatar ID", value: "Qatar ID" },
        ];
        setschemaMaster(data);



    }, []);



    const [isVisible, setIsVisible] = useState(false);



    return (
        <>
            <MutedBgLayout>
                <Row>
                    <Col span="12">
                        <H1>KYC</H1>
                    </Col>

                    <Col span={'12'}>
                        <SimpleCard>
                            <Row>
                                <Col span="6" padding={false}>
                                    <H3>Document Type</H3>
                                    <CustomSelect
                                        name="schema"
                                        data={schemaMaster}
                                        placeholder={'Please select the doument type'}
                                    ></CustomSelect>
                                </Col>
                                <Col span="5" padding={false}>
                                    <H3>Upload KYC Document</H3>
                                    <Row className="flex-1" align="center" justify="between">
                                        <Col span="8" padding={false}>
                                            <CustomInput gap={0} type="file" className="cursor-pointer" />

                                        </Col>
                                        <Col span="3" padding={false}>
                                            <NewButton onClick={() => setIsVisible(!isVisible)}>Submit</NewButton>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        </SimpleCard>
                    </Col>
                </Row>
                <Col span={'12'}>
                    {isVisible && (
                        <div>
                            <SimpleCard>
                                <Row>
                                    <Col span="2" padding={false}>
                                        <span style={{ color: 'green', fontSize: '30px', fontWeight: 'bold' }}>Success !!!</span>


                                    </Col>
                                    <Col span="8">
                                        <GaugeChart label={"Generic Passport"} value={95} maxValue={100}></GaugeChart>

                                    </Col>
                                </Row>
                            </SimpleCard>
                        </div>
                    )}
                </Col>


            </MutedBgLayout>
        </>
    );
}

export default KYCView;

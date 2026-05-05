/* eslint-disable no-unused-vars */

import api from '@ais/api';
import {
    Col,
    CustomInput,
    CustomSelect,
    H1,
    H3,
    MutedBgLayout,
    NewButton,
    Row,
    SimpleCard,
    toast,
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
        const data = [
            { name: "US Passport", value: 'US Passport' },
            { name: "Generic Passport", value: "Generic Passport" },
            { name: "Emirates ID", value: "Emirates ID" },
            { name: "US Driving Licence", value: "US Driving Licence" },
            { name: "Singapore UEN", value: "Singapore UEN" },
            { name: "Global Verification", value: "Global Verification" },
            { name: "Qatar ID", value: "Qatar ID" },
            { name: "CPR", value: "Central Population Register" },
        ];
        setschemaMaster(data);



    }, []);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedDocType, setSelectedDocType] = useState('');
    const [fileInputKey, setFileInputKey] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleClear = () => {
        setSelectedDocType('');
        setFileInputKey((prev) => prev + 1); // reset file input
        setSelectedFile(null);
        setIsVisible(false);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file); // includes prefix like data:...;base64,

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUploadNIDVDocument = async () => {

        if (!selectedDocType) {
            toast({ title: 'Please select a document type', variant: 'error' });
            return;
        }

        if (!selectedFile) {
            toast({ title: 'Please upload a file', variant: 'error' });
            return;
        }

        const file = selectedFile;

        try {
            const base64 = await convertToBase64(file);
            const pureBase64 = base64.split(',')[1];

            const payload = {
                documentType: selectedDocType,
                fileName: file.name,
                contentType: file.type,
                fileData: pureBase64   // or use base64 if backend needs prefix
            };

            const res = await api.post('/app/rest/v1/uploadNIDVDocument', payload);

            console.debug('Upload response', res);

            toast({
                title: 'Upload successful',
                variant: 'success',
            });

            setIsVisible(true);

        } catch (err) {
            console.error('Upload error', err);
            toast({
                title: 'Upload failed',
                description: err?.message || '',
                variant: 'error'
            });
        }
    };

    return (
        <>
            <MutedBgLayout>
                <Row>
                    <Col span="12">
                        <H1>National ID Verification</H1>
                    </Col>

                    <Col span={'12'}>
                        <SimpleCard>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    gap: 24,
                                }}
                            >
                                <div style={{ flex: '0 0 40%' }}>
                                    <H3 style={{ marginBottom: '5px !important', marginLeft: '8px' }}>Document Type</H3>
                                    <CustomSelect
                                        name="schema"
                                        data={schemaMaster}
                                        value={selectedDocType}
                                        onChange={(e) => setSelectedDocType(e.target.value)}
                                        placeholder={'Please select the doument type'}
                                    ></CustomSelect>
                                </div>
                                <div style={{ flex: '0 0 40%' }}>
                                    <H3 style={{ marginBottom: '5px', marginLeft: '8px' }}>Document</H3>
                                    <CustomInput
                                        key={fileInputKey}
                                        gap={0}
                                        type="file"
                                        className="cursor-pointer"
                                        accept="image/*,application/pdf"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (!file) {
                                                setSelectedFile(null);
                                                return;
                                            }
                                            const ok =
                                                file.type.startsWith('image/') || file.type === 'application/pdf';
                                            if (!ok) {
                                                toast({
                                                    title: 'Only image and PDF files are allowed',
                                                    variant: 'error',
                                                });
                                                e.target.value = '';
                                                setSelectedFile(null);
                                                return;
                                            }
                                            setSelectedFile(file);
                                        }}
                                    />
                                </div>
                                <div style={{ flex: '0 0 auto', marginLeft: 'auto', display: 'flex', gap: 8 }}>
                                    {/* <NewButton onClick={() => setIsVisible(true)}>Submit</NewButton> */}
                                    <NewButton onClick={handleUploadNIDVDocument}>Submit</NewButton>
                                    <NewButton onClick={handleClear}>Clear</NewButton>
                                </div>
                            </div>
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


            </MutedBgLayout >
        </>
    );
}

export default KYCView;

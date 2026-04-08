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
    toast
} from '@ais/components';
import { VariableType } from '@ais/graphql';
import React, { useEffect, useState } from 'react';

import GaugeChart from '../../../components/charts/GaugeChart';


function BlockList() {
    React.useEffect(() => {
        console.log('into schemaList');
    }, []);

    const [schemaMaster, setschemaMaster] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleClear = () => {
        setFileInputKey((prev) => prev + 1); // reset file input
        setSelectedFile(null);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file); // includes prefix like data:...;base64,

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    const handleUploadDocument = async () => {



        if (!selectedFile) {
            toast({ title: 'Please upload a file', variant: 'error' });
            return;
        }

        const file = selectedFile;

        try {
            const base64 = await convertToBase64(file);
            const pureBase64 = base64.split(',')[1];

            const payload = {
                documentType: "bl",
                fileName: file.name,
                contentType: file.type,
                fileData: pureBase64   // or use base64 if backend needs prefix
            };

            const res = await api.post('/app/rest/v1/uploadAccessListDocument', payload);

            console.debug('Upload response', res);

            toast({
                title: 'Upload successful',
                variant: 'success',
            });

            handleClear(); // Clear the file input and selected file after successful upload
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
                        <H1>Block List</H1>
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
                                    <H3 style={{ marginBottom: '5px', marginLeft: '8px' }}>Document</H3>
                                    <CustomInput
                                        key={fileInputKey}
                                        gap={0}
                                        type="file"
                                        className="cursor-pointer"
                                        accept=".csv,.xls,.xlsx"
                                        onChange={e => {
                                            const file = e.target.files?.[0];

                                            if (!file) {
                                                setSelectedFile(null);
                                                return;
                                            }

                                            const allowedTypes = [
                                                "text/csv",
                                                "application/vnd.ms-excel", // .xls
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
                                            ];

                                            const isValid = allowedTypes.includes(file.type);

                                            if (!isValid) {
                                                toast({
                                                    title: "Only CSV, and Excel files are allowed",
                                                    variant: "error",
                                                });
                                                e.target.value = "";
                                                setSelectedFile(null);
                                                return;
                                            }

                                            setSelectedFile(file);
                                        }}
                                    />
                                </div>
                                <div style={{ flex: '0 0 auto', display: 'flex', gap: 8 }}>
                                    {/* <NewButton onClick={() => setIsVisible(true)}>Submit</NewButton> */}
                                    <NewButton onClick={handleUploadDocument}>Submit</NewButton>
                                    <NewButton onClick={handleClear}>Clear</NewButton>
                                </div>
                            </div>
                        </SimpleCard>
                    </Col>
                </Row>


            </MutedBgLayout>
        </>
    );
}

export default BlockList;

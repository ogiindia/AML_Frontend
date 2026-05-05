import {
    Col,
    H1,
    MutedBgLayout,
    Row,
} from '@ais/components';
import React from 'react';


function MuleView() {


    return (
        <>
            <MutedBgLayout>
                <Row>
                    <Col span="12">
                        <H1>Mule Detection</H1>
                        <iframe
                            title="Mule Detection"
                            src="http://localhost:5175/"
                            style={{
                                width: '100%',
                                height: '80vh',
                                border: '0',
                                borderRadius: '8px',
                                background: '#fff',
                            }}
                        />
                    </Col>
                </Row>
            </MutedBgLayout >
        </>
    );
}

export default MuleView;

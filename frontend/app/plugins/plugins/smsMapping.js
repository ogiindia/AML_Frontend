import React from 'react';
import RenderFlow from 'RenderFlow';
import Heading from 'Heading';
import FlowBar from '../components/FlowBar';
import Row from 'Row';
import Col from 'Col';
import Card from 'Card';

const initialNodes = [
  {
    id: 'start',
    sourcePosition: 'right',
    type: 'input',
    data: { label: 'Input' },
    position: { x: 0, y: 80 },
  },
];

const initialEdges = [];

const draggableNodes = {
  'SMS Template': [
    {
      className: 'primary',
      label: 'sms template 1',
      key: 1,
    },
    {
      className: 'primary',
      label: 'sms template 2',
      key: 2,
    },
    {
      className: 'primary',
      label: 'sms template 3',
      key: 3,
    },
  ],
  'SMS header ID': [
    {
      className: 'secondary',
      label: 'header 1',
    },
    {
      className: 'secondary',
      label: 'header 2',
    },
    {
      className: 'secondary',
      label: 'header 3',
    },
  ],

  'DLT template ID': [
    {
      className: 'info',
      label: 'DLT ID',
      form: [
        {
          type: 'text',
          name: 'dltID',
          label: 'DLT ID',
          id: 'dltID',
          value: '',
          placeholder: 'Enter the  DLT ID',
          validationType: 'string',
          validations: [],
        },
      ],
    },
  ],
};

function Flow() {
  return (
    <>
      <Heading title="Sms Mapping" subTitle="map the sms flow in this page" />
      <Row>
        <Col sm={8} md={8} lg={8}>
          <Card
            title="Workflow Builder"
            subTitle="Press the lock button to lock the node from dragging and press backspace to delete the selected node"
          >
            <RenderFlow
              initialNodes={initialNodes}
              intialEdges={initialEdges}
            ></RenderFlow>
          </Card>
        </Col>
        <Col sm={4} md={4} lg={4}>
          <Card
            title="draggable nodes"
            subTitle="You can drag these nodes to the pane on the right"
            className="disable-padding"
            cardBodyClassName="height-500"
          >
            <FlowBar draggableNodes={draggableNodes} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Flow;

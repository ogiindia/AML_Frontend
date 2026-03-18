import api from '@ais/api';
import {
  Col,
  CustomCheckbox,
  CustomInput,
  CustomSelect,
  IconButton,
  MutedBgLayout,
  Row,
  SpeedoMeter,
} from '@ais/components';
import { jsonToGraphQLQuery } from '@ais/graphql';
import moment from 'moment';
import { useState } from 'react';
import { dateFormats } from '../config';

function Dummy() {
  const rowOnclick = ({ row }) => {
    alert('row clicked');
  };

  const [selectedSchema, setselectedSchema] = useState(null);

  const [showModal, setshowModal] = useState(false);

  //simple table
  //   const data = [
  //     {
  //       name: 'Hello',
  //       value: 'World',
  //       name1: 'Hello',
  //       value1: 'World',
  //       name2: 'Hello',
  //       value2: 'World',
  //     },
  //   ];

  const [folders, setfolders] = useState([]);

  // useEffect(() => {
  //   const query = {
  //     query: {
  //       getFolderHierarchy: {
  //         id: true,
  //         folderName: true,
  //         children: {
  //           id: true,
  //           folderName: true,
  //         },
  //       },
  //     },
  //   };

  //   const gql = jsonToGraphQLQuery(query);
  //   console.log(gql);
  //   api.graphql(gql).then((res) => {
  //     const { data } = res;
  //     // setfolders(res);
  //     console.log(data['getFolderHierarchy']);
  //     setfolders(data['getFolderHierarchy']);
  //   });
  // }, []);

  const columns = {
    createdAt: {
      label: 'Created AT',
      render: (row) => (
        <span>{moment(row.createdAt).format(dateFormats.shortDate)}</span>
      ),
      sortable: true,
    },
    actions: {
      key: 'actions',
      label: 'Custom Actions',
      render: (row) => (
        <Row>
          <IconButton icon={'Edit'} onClick={rowOnclick}>
            edit
          </IconButton>

          <IconButton icon={'Trash2'} onClick={rowOnclick}>
            edit
          </IconButton>
        </Row>
      ),
    },
    id: {
      show: false,
    },
    priority: {
      sortable: true,
    },
    ruleName: {
      sortable: true,
    },
  };

  //data table
  const dataStructure = {
    queryType: 'listRuleEntityByPaging',
    columns: [
      { key: 'id', type: 'uuid' },
      { key: 'ruleName', type: 'string' },
      // { key: 'groups', type: 'string' },
      { key: 'priority', type: 'Int' },
      { key: 'createdAt', type: 'date' },
    ],
    paging: { pageNo: 1, size: 10 },
    sorting: { field: 'priority', direction: 'ASC' },
    // filters: [{ field: 'username', operator: 'EQUAL', value: 'admin' }],
  };

  const loadTableData = () => {
    const query = {
      query: {
        __variables: {
          id: 'UUID!',
        },
        deleteInstitutionEntity: {
          __args: {
            id: new VariableType('id'),
          },
        },
      },
    };

    const gql = jsonToGraphQLQuery(query);
    console.log(gql);
    api.graphql(gql, { id: id }).then((res) => {
      console.log(res);
    });
  };

  const selectOnclick = (e) => {
    console.log(e);
  };

  const auditLog = [
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
    {
      ruleName: 'Rule 1',
      ruleDesc: 'Rule Narration',
    },
  ];

  const MLFeatures = [
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
    {
      featureName: 'point1',
      score: '1.0',
      details: 'point 123',
    },
  ];

  function FieldRow({ fieldName, fieldType, alias, active }) {
    const isCustomFunction = fieldType === 'CUSTOM_FUNCTION';

    return (
      <Row gap={`0`} className={`bg-white p-2 m-2 border-b`} align={`center`}>
        <Col padding={false} span={'2'}>
          <CustomInput
            value={fieldName}
            gap={'0'}
            defaultValue={fieldName}
            placeholder="Field name"
          />
        </Col>
        <Col padding={false} span={`2`}>
          <CustomSelect
            value={fieldType}
            data={[
              {
                name: 'STRING',
                value: 'String',
              },
              {
                name: 'NUMBER',
                value: 'Number',
              },
              {
                name: 'BOOLEAN',
                value: 'Boolean',
              },
              {
                name: 'CUSTOM_FUNCTION',
                value: 'Custom Function',
              },
            ]}
            placeholder={`Select a type`}
          />
        </Col>

        <Col padding={false} span={`2`}>
          <CustomInput
            defaultValue={alias}
            placeholder="Alias name"
            gap={'0'}
            padding={false}
          />
        </Col>

        <Col padding={false} span={`2`} className={`justify-center flex`}>
          <CustomCheckbox value={active} />
        </Col>

        <Col padding={false} span={`1`} className={`justify-center flex`}>
          <IconButton
            icon={`Trash2`}
            className={`text-destructive`}
          ></IconButton>
        </Col>

        {isCustomFunction && (
          <Col
            span={`12`}
            padding={false}
            className="bg-muted border-b last:border-none mt-2"
          >
            {/* <CustomFunctionEditor /> */}

            <div className={`p-2`}>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                Custom Function for{' '}
                <span className="text-primary font-semibold">{fieldName}</span>
              </label>
              <textarea
                width={100}
                placeholder="e.g., (firstName, lastName) => `${firstName} ${lastName}`"
                className="text-sm"
              />
            </div>
          </Col>
        )}
      </Row>
    );
  }

  const custDetails = {
    customerId: 'XXXXXX31',
    FullName: 'John Doe',
    customerStatus: 'UNVERIFED',
    deviceId: '12345ASASGDGGDS123',
    lastAccessed: '2025-04-12 12:00:00 PM',
    SessionDuration: '2mins',
    deviceType: 'IOS',
    AISTrustScore: '40',
  };

  const filterForm = [
    {
      data: [
        {
          type: 'date',
          name: 'fromDate',
          label: 'From Date',
          id: 'fromDate',
          value: '',
          grid: '6',
          hidden: false,
          gqlType: 'date!',
          // placeholder: 'Enter an id to search',
          validationType: 'string',
          validations: [],
        },

        {
          type: 'date',
          name: 'fromDate',
          label: 'From Date',
          id: 'fromDate',
          value: '',
          grid: '6',
          hidden: false,
          gqlType: 'date!',
          // placeholder: 'Enter an id to search',
          validationType: 'string',
          validations: [],
        },
      ],
    },
  ];

  const timeline = [
    {
      title: 'Scheduled For Review',
      // company: 'TechCorp Solutions',
      period: '2025-Nov-12 12:00 AM',
      description:
        'The Transaction matched in 10 rules and scheduled for review',
      // technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
    },
    {
      title: 'Reviewed By John',
      // company: 'Digital Innovations Inc',
      period: '2025-Nov-12 12:30 AM',
      description: 'comments : the transaction looks suspicious',
      // technologies: ['React', 'Express.js', 'PostgreSQL', 'Docker', 'Redis'],
    },
    {
      title: 'Commented By Doe',
      // company: 'WebTech Studios',
      period: '2025-Nov-12 12:45 PM',
      description: 'Added Comments : the transaction was done in odd hours ',
      // technologies: ['React', 'JavaScript', 'SASS', 'Webpack', 'Jest'],
    },
  ];

  return (
    <MutedBgLayout>
      {/* <Button
        label={`Generate Reports`}
        icon={`Folder`}
        onClick={() => {
          setshowModal(true);
        }}
      />

      <DateRangePicker
        onUpdate={(values) => console.log(values)}
        initialDateFrom="2023-01-01"
        initialDateTo="2023-12-31"
        align="start"
        locale="en-GB"
        showCompare={false}
      />

      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>

      <SimpleModal
        isOpen={showModal}
        handleClose={() => setshowModal(false)}
        size={'lg'}
        title={`Reports`}
      >
        <UnderlinedTabs tabData={tabs} defaultValue={'txn_details'} />
      </SimpleModal> */}
      <Row>
        <Col span={`3`}>
          <SpeedoMeter></SpeedoMeter>
        </Col>
      </Row>
    </MutedBgLayout>
  );
}

export default Dummy;

//  <Row gap="2">
//         <Col span="12">
//           <H1>Dummy Heading</H1>
//         </Col>
//         <Col span="8" className="tab-layout">
//           <UnderlinedTabs tabData={tabs} defaultValue={'txn_details'} />
//         </Col>

//         <Col span="3">
//           <Row>
//             <Col span="12">
//               <SimpleCard>
//                 <Row>
//                   <Col span="12">
//                     <H3>Actions</H3>
//                   </Col>

//                   <Col span="12">
//                     <FullWidthSubmitButton
//                       label={'Approve'}
//                       variant={`default`}
//                       icon={`CircleCheck`}
//                     />
//                   </Col>
//                   <Col span="12">
//                     <FullWidthSubmitButton
//                       label={'Reject'}
//                       variant={`destructive`}
//                       icon={`CircleX`}
//                     />
//                   </Col>
//                   <Col>
//                     <Label>Comments (Optional)</Label>
//                     <textarea
//                       style={{ width: '100%', height: '100px' }}
//                       placeholder="Enter your Comments"
//                     />
//                   </Col>
//                   <Col>
//                     <FullWidthSubmitButton
//                       label={`Submit Comment`}
//                       variant={`outline`}
//                     />
//                   </Col>
//                 </Row>
//               </SimpleCard>
//             </Col>

//             <Col span="12">
//               <Timeline data={timeline} />
//             </Col>
//           </Row>
//         </Col>
//       </Row>

// <Row>
//         <Col span="12">
//           <H1>Schema Manager</H1>
//           <Subheading>
//             Create new schema or select an existing one to edit.
//           </Subheading>
//         </Col>
//         <Col span={'12'}>
//           <SimpleCard>
//             <Row>
//               <Col span="6" padding={false}>
//                 <H3>Create new Schema</H3>
//                 <Row className="flex-1" align="center" justify="between">
//                   <Col span="8" padding={false}>
//                     <CustomInput
//                       gap={0}
//                       placeholder="Enter a schema name"
//                     ></CustomInput>
//                   </Col>
//                   <Col span="3" padding={false}>
//                     <NewButton>Create</NewButton>
//                   </Col>
//                 </Row>
//               </Col>

//               <Col span="5" padding={false}>
//                 <H3>Choose Existing Schema</H3>
//                 <CustomSelect
//                   url="listCatalogEntity"
//                   name="schema"
//                   dataMap={{
//                     schemaName: true,
//                   }}
//                   placeholder={'Select a schema'}
//                   onChange={(e) => selectOnclick(e)}
//                 ></CustomSelect>
//               </Col>
//             </Row>
//           </SimpleCard>
//         </Col>
//       </Row>

//       <Row>
//         <Col span={'12'}>
//           <SimpleCard padding={false}>
//             {/* Header Row */}
//             <Row>
//               <Col>
//                 <H3>
//                   Schema Fields :{' '}
//                   <span className={`bold`}>{selectedSchema}</span>
//                 </H3>
//               </Col>
//             </Row>

//             <Row
//               padding={false}
//               gap={'0'}
//               className={`bg-muted border-b p-2 m-2`}
//             >
//               <Col span={'2'} className={`justify-center flex p-2`}>
//                 Field Name
//               </Col>
//               <Col span={'2'} className={`justify-center flex p-2`}>
//                 Field Type
//               </Col>
//               <Col span={'2'} className={`justify-center flex p-2`}>
//                 Alias
//               </Col>
//               <Col span={'2'} className={`justify-center flex p-2`}>
//                 Active
//               </Col>
//               <Col span={'1'} className={`justify-center flex p-2`}>
//                 Actions
//               </Col>

//               <Col span={`12`} padding={false}>
//                 <FieldRow
//                   fieldName={`firstName`}
//                   fieldType={`STRING`}
//                   alias={`First Name`}
//                   active={true}
//                 />
//               </Col>
//               <Col span={`12`} padding={false}>
//                 <FieldRow
//                   fieldName={`name`}
//                   fieldType={`CUSTOM_FUNCTION`}
//                   alias={`Full Name`}
//                   active={true}
//                 />
//               </Col>
//               <Col span={`12`} padding={false}>
//                 <FieldRow
//                   fieldName={`age`}
//                   fieldType={`NUMBER`}
//                   alias={`Age`}
//                   active={true}
//                 />
//               </Col>
//             </Row>

//             <Row justify="between" className={`bg-muted p-2 m-2`}>
//               <Col span={'auto'}>
//                 <Button label={`Add Field`} icon={`Plus`} />
//               </Col>

//               <Col span={'auto'}>
//                 <Button label={`Save Schema`} />
//               </Col>
//             </Row>
//           </SimpleCard>
//         </Col>
//       </Row>

//       <Row>
//         <Col span={'12'}>
//           <SimpleCard>
//             <Row align="center">
//               <Col span={'12'} padding={false}>
//                 <H3>Upload static Data</H3>
//                 <Subheading>
//                   Upload a CSV or JSON file to associate static data with this
//                   schema. This can be used for populating dropdowns or
//                   providing default values.
//                 </Subheading>
//               </Col>
//               <Col span={'auto'}>
//                 <CustomInput gap={0} type="file" className="cursor-pointer" />
//               </Col>
//               <Col span={`auto`}>
//                 <Button label={`upload`}>Upload</Button>
//               </Col>
//             </Row>
//           </SimpleCard>
//         </Col>
//       </Row>

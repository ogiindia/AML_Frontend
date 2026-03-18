import {
  CancelButton,
  Col,
  CustomInput,
  EditButton,
  NewButton,
  Row,
  SectionCard,
  SimpleSelect,
  SubmitButton,
} from '@ais/components';
import React, { useState } from 'react';

const initialData = [
  { id: 1, name: 'Arun Pandian', email: 'arun@example.com' },
  { id: 2, name: 'Prakash Kumar', email: 'prakash@example.com' },
];

const filterConfig = [
  { name: 'name', value: 'Name' },
  { name: 'email', value: 'Email' },
];

export default function EditableTable() {
  const [data, setData] = React.useState(initialData);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState(null);
  const [filterKey, setFilterKey] = useState('name');
  const [filterValue, setFilterValue] = useState('');

  const filteredData = data.filter((row) =>
    row[filterKey].toLowerCase().includes(filterValue.toLowerCase()),
  );

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormState({ ...row });
  };

  const handleSave = () => {
    if (formState) {
      setData((prev) =>
        prev.map((row) => (row.id === formState.id ? formState : row)),
      );
      setEditingId(null);
      setFormState(null);
    }
  };

  const handleCancel = () => {
    const isNew = !data.find((d) => d.id === formState?.id);
    if (isNew) {
      setData((prev) => prev.filter((d) => d.id !== formState.id));
    }
    setEditingId(null);
    setFormState(null);
  };

  const handleCreate = () => {
    const newRecord = {
      id: Date.now(),
      name: '',
      email: '',
    };
    setEditingId(newRecord.id);
    setFormState(newRecord);
    setData((prev) => [...prev, newRecord]);
  };

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="flex gap-2 items-center">
        <SimpleSelect
          value={filterKey}
          data={filterConfig}
          onValueChange={setFilterKey}
        ></SimpleSelect>
        <CustomInput
          placeholder="Filter value"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <NewButton onClick={handleCreate}>Create New</NewButton>
      </div>

      {/* Table Rows */}
      {filteredData.map((row) => (
        <SectionCard gap={2} key={row.id}>
          {editingId === row.id ? (
            <>
              <CustomInput
                value={formState?.name || ''}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Name"
              />
              <CustomInput
                value={formState?.email || ''}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Email"
              />
              <div className="flex gap-2">
                <SubmitButton onClick={handleSave}>Save</SubmitButton>
                <CancelButton variant="outline" onClick={handleCancel}>
                  Cancel
                </CancelButton>
              </div>
            </>
          ) : (
            <Row justify="around">
              <Col span={'auto'}>{row.name}</Col>
              <Col span={'auto'}>{row.email}</Col>
              <Col span={'auto'}>
                <EditButton onClick={() => handleEdit(row)}>Edit</EditButton>
              </Col>
            </Row>
          )}
        </SectionCard>
      ))}
    </div>
  );
}

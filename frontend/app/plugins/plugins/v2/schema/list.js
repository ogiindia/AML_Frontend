/* eslint-disable no-unused-vars */
import api from '@ais/api';
import {
  Button,
  Col,
  CustomInput,
  CustomSelect,
  H1,
  H3,
  MutedBgLayout,
  NewButton,
  Row,
  SimpleCard,
  Subheading,
  toast
} from '@ais/components';
import { jsonToGraphQLQuery, VariableType } from '@ais/graphql';
import React, { useEffect, useState } from 'react';
import FieldRow from '../../../components/FieldRow';


function SchemaList() {
  React.useEffect(() => {
    console.log('into schemaList');
  }, []);
  const [showConfirm, setShowConfirm] = useState(false);


  useEffect(() => {

  }, []);

  const handleSyncMappingList = async () => {
    try {
      const res = await api.post('/app/rest/v1/setMappingList');

      console.log("Full response:", res);

      if (!res) {
        toast({ title: 'No response from server', variant: 'validaton' });
        return;
      }
      toast({ title: res, variant: 'success' });

    } catch (err) {
      console.error("Error in Sync Mapping List:", err);
      toast({ title: 'Failed to sync mapping list', description: err?.message || '', variant: 'error' });

    }
  };

  return (
    <>
      <MutedBgLayout>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 16 }}>
          <Button className="btn primary" onClick={() => setShowConfirm(true)}>Sync Mapping List</Button>
        </div>


        {showConfirm && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
          }}>
            <div style={{
              width: 420, background: 'var(--card)', padding: 18, borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
            }}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <h4 style={{ margin: 0, marginBottom: 10, fontWeight: 700 }}>Confirm Sync</h4>
              <div style={{ marginBottom: 16, color: 'oklch(0.16 0 0)' }}>
                Are you sure you want to Sync the mapping list(s)?
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn" onClick={() => setShowConfirm(false)}>Cancel</button>
                <Button
                  type="button"
                  className="btn danger"
                  onClick={async () => {
                    try {
                      await handleSyncMappingList();
                    } finally {
                      setShowConfirm(false);
                    }
                  }}
                >
                  Sync
                </Button>
              </div>
            </div>
          </div>
        )}
      </MutedBgLayout>
    </>
  )
}

export default SchemaList;

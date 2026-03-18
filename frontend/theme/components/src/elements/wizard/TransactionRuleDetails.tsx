import React from 'react';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Action } from './types';
import { setRuleAction} from '../../../../../app/core/src/redux/RuleSlice';
import { useDispatch ,useSelector} from 'react-redux';
// import { setRuleData,getRuleData } from '../../../../../app/plugins/plugins/v2/rule/config';
import { Table, Modal } from 'react-bootstrap';
import { SimpleModal } from '../Modal';
import { ButtonBoilerplate } from '../Button/ButtonBoilerplate';
import {
 Icons
} from '@ais/components';


interface Props {
  actions: Action[];
  onChange: (updated: Action[]) => void;
}

export const TransactionRuleDetails: React.FC<Props> = ({ actions, onChange }) => {

    
const [approverss, setApproverss] = useState([]);
const [newApprover, setNewApprover] = useState("");
const [selectedLevel, setSelectedLevel] = useState(1);

const handleAddApprover = () => {
  if (newApprover.trim()) {
    setApproverss([...approverss, { name: newApprover, level: selectedLevel }]);
    setNewApprover("");
    setSelectedLevel(1);
  }
};


  const [selectedType, setSelectedType] = React.useState('');
const [inputName, setInputName] = React.useState('');
const [approvers, setApprovers] = React.useState<string[]>([]);

const addApprover = () => {
  const name = inputName.trim();
  if (name && !approvers.includes(name)) {
    setApprovers([...approvers, name]);
    setInputName('');
  }
};

const removeApprover = (name: string) => {
  setApprovers(approvers.filter((a) => a !== name));
};

const handleDeleteApprover = (indexToDelete) => {
  setApproverss(approverss.filter((_, index) => index !== indexToDelete));
};


   const [showModal, setShowModal] = React.useState(false);
  const [selectedTxn, setSelectedTxn] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const transactions = [
    {
      id: 1,
      transactionId: '1234566780092',
      accountName:'Jerin',
      accountNo: '123456',
      amount: '₹100000',
       Receiver: 'jerin@odtestbank',
      Rulename: 'Account Monitoring',
      RuleCategory:'High value cash deposits in a day'
    },
    {
      id: 2,
      transactionId: '838463535555',
      accountName: 'Arun',
      accountNo: '456789',
      amount: '₹250000',
      Receiver: 'Arun@odtestbank',
      Rulename: 'Account Monitoring',
      RuleCategory:'High value cash deposits in a month'
    },
  ];

  const handleView = (txn: any) => {
    setSelectedTxn(txn);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedTxn(null);
  };

  const handleDelete = () => {
    setLoading(true);
    // Simulate delete logic
    setTimeout(() => {
      console.log('Deleted:', selectedTxn?.id);
      setLoading(false);
      handleClose();
    }, 1000);
  };

  const handleApprove = () => {
    console.log('Approved:', selectedTxn?.id);
    handleClose();
  };
  


  const dispatch = useDispatch();
  const updateAction = (index: number, field: keyof Action, value: string) => {
    const updated = [...actions];
    updated[index][field] = value;
    onChange(updated); 
    // dispatch(setRuleAction(actions));
    // setRuleData({
    //    ruleAction: actions,
    //   });
  };
//  const ruleName = useSelector((state)=>
//     {console.log("state",state)
//       state['rule'].ruleName  })
//   console.log("ruleName",ruleName)

  //  const ruleData = getRuleData();
  // console.log("ruleData",ruleData)


  const removeAction = (index: number) => {
    const updated = actions.filter((_, i) => i !== index);
    onChange(updated);
  };

  const approveTransaction = (id) => {
  console.log(`Approved transaction with ID: ${id}`);
};

const deleteTransaction = (id) => {
  console.log(`Deleted transaction with ID: ${id}`);
};

  return (
    <>

{selectedTxn && (
  <>
   
 <Card className="w-full mt-6">
  <CardHeader>
    <CardTitle>Transaction Details</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-4 gap-6 text-center">
      <div>
        <div className="text-lg font-medium">{selectedTxn.id}</div>
        <div className="text-sm text-gray-500">ID</div>
      </div>
       <div>
        <div className="text-lg font-medium">{selectedTxn.transactionId}</div>
        <div className="text-sm text-gray-500">Transaction Id</div>
      </div>
      <div>
        <div className="text-lg font-medium">{selectedTxn.accountName}</div>
        <div className="text-sm text-gray-500">Account Name</div>
      </div>
      <div>
        <div className="text-lg font-medium">{selectedTxn.accountNo}</div>
        <div className="text-sm text-gray-500">Account No</div>
      </div>
      
    </div>

    <hr className="my-4" />

    <div className="grid grid-cols-4 gap-6 text-center">
      <div>
        <div className="text-lg font-medium">{selectedTxn.amount}</div>
        <div className="text-sm text-gray-500">Amount</div>
      </div>
      <div>
        <div className="text-lg font-medium">{selectedTxn.Receiver}</div>
        <div className="text-sm text-gray-500">Receiver</div>
      </div>
      <div>
        <div className="text-lg font-medium">{selectedTxn.Rulename}</div>
        <div className="text-sm text-gray-500">Rule Name</div>
      </div>
     
      <div>
        <div className="text-lg font-medium">{selectedTxn.RuleCategory}</div>
        <div className="text-sm text-gray-500">Rule Category</div>
      </div>
    </div>

    <hr className="my-4" />

    <div className="flex gap-2 justify-center">
      <ButtonBoilerplate variant="secondary" onClick={() => setSelectedTxn(null)}>
        Cancel
      </ButtonBoilerplate>
      <ButtonBoilerplate variant="default" onClick={handleApprove}>
        Approve
      </ButtonBoilerplate>
      <ButtonBoilerplate variant="destructive" loading={loading} onClick={handleDelete}>
        Reject
      </ButtonBoilerplate>
    </div>
  </CardContent>
</Card>
  
  </>
)}

      </>

  );
};

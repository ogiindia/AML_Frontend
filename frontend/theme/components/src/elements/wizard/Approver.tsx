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

export const Approver: React.FC<Props> = ({ actions, onChange }) => {

    
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
      RuleCategory:'High value cash deposits in a day',
      transactionDate:'12 oct 2025',
      status: 'send'
    },
    {
      id: 2,
      transactionId: '838463535555',
      accountName: 'Arun',
      accountNo: '456789',
      amount: '₹250000',
      Receiver: 'Arun@odtestbank',
      Rulename: 'Account Monitoring',
      RuleCategory:'High value cash deposits in a month',
      transactionDate:'12 sep 2025',
      status: 'send'
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
    <div className="p-10">
   {/* <Card className="w-full">
  <CardHeader>
    <CardTitle>Approve</CardTitle>
  </CardHeader>

  <CardContent className="space-y-2">
  
    <div className="grid grid-cols-5 font-semibold bg-gray-100 p-3 rounded">
      <div>ID</div>
      <div>Transaction ID</div>
      <div>Account No</div>
      <div>Amount</div>
      <div>Action</div>
    </div>

   
    {transactions.map((txn) => (
      <div
        key={txn.id}
        className="grid grid-cols-5 items-center border p-3 rounded shadow-sm"
      >
        <div>{txn.id}</div>
        <div>{txn.transactionId}</div>
        <div>{txn.accountNo}</div>
        <div>{txn.amount}</div>
        <div>
          <button
            onClick={() => setSelectedTxn(txn)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            View
          </button>
        </div>
      </div>
    ))}
  </CardContent>
</Card>

{selectedTxn && (
  <>
   
 <Card className="w-full mt-8">
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
   
      <div className="grid grid-cols-4 gap-6 text-center">
      <div>
        <div className="text-lg font-medium">{selectedTxn.transactionDate}</div>
        <div className="text-sm text-gray-500">Transaction Date</div>
      </div>
      <div>
        <div className="text-lg font-medium">{selectedTxn.status}</div>
        <div className="text-sm text-gray-500">Status</div>
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
)} */}

       <Card className="w-full mt-10">
  <CardHeader>
    <CardTitle>Approver Configuration</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
   
<div className="flex flex-wrap gap-2 items-center">

  <div className="flex flex-col w-full sm:w-1/3">
    <Label className="mb-1">Transaction Type</Label>
    <Select
      value={selectedType}
      onValueChange={(value) => setSelectedType(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select transaction type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="suspense">Suspense Transaction</SelectItem>
        <SelectItem value="refund">Refund Transaction</SelectItem>
        <SelectItem value="regular">Regular Transaction</SelectItem>
      </SelectContent>
    </Select>
  </div>


  <div className="flex flex-col w-full sm:w-1/2">
    <Label className="mb-1 invisible">Approver</Label> 
    <input
      type="text"
      value={inputName}
      onChange={(e) => setInputName(e.target.value)}
      placeholder="Search or enter approver name"
      className="border px-3 py-2 rounded w-full"
    />
  </div>

 
  <div className="flex flex-col w-full sm:w-auto">
    <Label className="mb-1 invisible">Add</Label> 
    <button
  onClick={addApprover}
  className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto flex items-center gap-2 justify-center"
>
  <Icons name="CirclePlus" size={15} />
  <span>Add</span>
</button>
  </div>
</div>

   
<div className="flex flex-wrap gap-2 border rounded p-3">
  {approvers.length === 0 ? (
    <p className="text-gray-500">No approvers added yet.</p>
  ) : (
    approvers.map((name, index) => (
      <div
        key={index}
        className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full"
      >
        <span className="mr-2">{name}</span>
        <button
          onClick={() => removeApprover(name)}
          className="text-red-500 hover:text-red-700"
        >
          <Icons name="X" size={16} />
        </button>
      </div>
    ))
  )}
</div>
  </CardContent>
</Card>
      
<Card className="w-full mt-6">
  <CardHeader>
    <CardTitle>Approver Configuration</CardTitle>
  </CardHeader>

  <CardContent className="space-y-6">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">🔢</span>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i} value={i + 1}>
              Level {i + 1}
            </option>
          ))}
        </select>
      </div>

     
      <input
        type="text"
        value={newApprover}
        onChange={(e) => setNewApprover(e.target.value)}
        placeholder="Enter approver name"
        className="border rounded px-4 py-2 w-full"
      />

     
      <button
  onClick={handleAddApprover}
  className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto flex items-center gap-2 justify-center"
>
  <Icons name="CirclePlus" size={15} />
  <span>Add</span>
</button>

    </div>

   
  <div className="flex flex-wrap gap-4">
  {approverss.map((approver, index) => (
    <div
      key={index}
      className="flex items-center border p-4 rounded shadow-sm gap-4 bg-white"
    >
      {/* Level Label + Number */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 font-medium">Level</span>
        <div className="bg-blue-600 text-white font-bold text-sm px-3 py-1 rounded-full">
          {approver.level}
        </div>
      </div>

      {/* Approver Name */}
      <div className="text-gray-800 text-sm font-medium">{approver.name}</div>

      {/* Delete Icon */}
      <button
        className="text-red-500 ml-auto"
        onClick={() => handleDeleteApprover(index)}
        title="Delete Approver"
      >
        <Icons name="Trash2" size={20} />
      </button>
    </div>
  ))}
</div>
  </CardContent>
</Card>
</div>
      </>
  );
};

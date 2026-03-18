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

export const RulesAdded: React.FC<Props> = ({ actions, onChange }) => {

    
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

const deleteRules = (id) => {
  const updatedTransactions = transactions.filter(txn => txn.id !== id);
  setTransactions(updatedTransactions);
};
const handleStatusChange = (newStatus) => {
    setSelectedTxn((prev) => ({
      ...prev,
      ruleStatus: newStatus,
    }));
  };



   const [showModal, setShowModal] = React.useState(false);
  const [selectedTxn, setSelectedTxn] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

   const [transactions, setTransactions] = useState([
    {
      id: 1,
      ruleName: 'High value cash deposit in a day',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits greater than INR [X1] for individuals and greater than INR [X2] for non individuals in a month.',
      individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 2,
      ruleName: 'High value cash withdrawals in a day',
      ruleStatus:'Active',
      RuleDescription: 'Cash withdrawal(s) aggregating to INR [X1] or more for individuals and INR [X2] or more for non individuals in a day.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 3,
      ruleName: 'High value non-cash deposits in a day',
      ruleStatus:'Active',
      RuleDescription: 'Non-Cash deposits greater than INR [X1] for individuals and greater than INR [X2] for non individuals in a day.',
      individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 4,
      ruleName: 'High value non-cash withdrawals in a day',
      ruleStatus:'Active',
      RuleDescription: 'Non-Cash withdrawals greater than INR [X1] for individuals and greater than INR [X2] for non individuals in a day.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 5,
      ruleName: 'High value cash deposits in a month',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits greater than INR [X1] for individuals and greater than INR [X2] for non individuals in a month.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 6,
      ruleName: 'High value cash withdrawals in a month',
      ruleStatus:'Active',
      RuleDescription: 'Cash withdrawals greater than INR [X1] for individuals and greater than INR [X2] for non individuals in a month.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 7,
      ruleName: 'High value non-cash deposits in a month',
      ruleStatus:'Active',
      RuleDescription: 'Non-Cash deposits greater than INR [X1] for individuals and greater than INR [X2] for non individuals in a month.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 8,
      ruleName: 'High value non-cash withdrawals in a month',
      ruleStatus:'Active',
      RuleDescription: 'Non-Cash withdrawals greater than INR [X1] for individuals and greater than INR [X2] for non individuals in a month.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 9,
      ruleName: 'Sudden high value transaction for the client',
      ruleStatus:'Active',
      RuleDescription: 'Value of transaction more than [X] is more than [Z] percent of the previous largest transaction for the client in previous [Y] months',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 10,
      ruleName: 'Sudden increase in value of transactions in a month for the client',
      ruleStatus:'Active',
      RuleDescription: 'Customers monthly account turnover (total value of debit and credit transactions) more than INR [X] exceeds the monthly average of account turnover for the preceding quarter by [Z] percent or more.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 11,
      ruleName: 'Sudden increase in number of transactions in a month for the client',
      ruleStatus:'Active',
      RuleDescription: 'Customers monthly account activity (total number [N] of debit and credit transactions in a month) aggregating to more than INR [X] exceeds the monthly average of account activity of the preceding quarter by [Z] percent or more',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 12,
      ruleName: 'High value transactions in a new account',
      ruleStatus:'Active',
      RuleDescription: 'Transactions greater than INR [X] in newly opened account within [Y] months',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 13,
      ruleName: 'High activity in a new account',
      ruleStatus:'Active',
      RuleDescription: 'Number of transactions more than [N] in newly opened account within [Y] months',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 14,
      ruleName: 'High value transactions in a dormant account',
      ruleStatus:'Active',
      RuleDescription: 'Transactions greater than INR [X] in a dormant account within [Y] days of reactivation.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 15,
      ruleName: 'Sudden activity in a dormant account',
      ruleStatus:'Active',
      RuleDescription: 'Number of transactions greater than INR [X] more than [N] times in a dormant account within [Y] days of reactivation.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 16,
      ruleName: 'High value cash transactions inconsistent with profile',
      ruleStatus:'Active',
      RuleDescription: 'Cash transactions greater than INR [X] in a month by customer with low cash requirements such as Students, Housewife, Pensioners, Wages and Salary Person and Minor Accounts.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 17,
      ruleName: 'High cash activity inconsistent with profile',
      ruleStatus:'Active',
      RuleDescription: 'Number of cash transactions greater than [N] with aggregate value greater than INR [X] in a month by customer with low cash requirements such as Students, Housewife, Pensioners, Wages and Salary Person and Minor Accounts',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 18,
      ruleName: 'Splitting of cash deposits just below INR 10,00,000 in a single/ multiple accounts in a month',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits in amounts ranging between INR 9,XX,000/- to INR 10,00,000/- in single/multiple accounts of the customer greater than [N] times in a month',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 19,
      ruleName: 'Splitting of cash deposits just below INR 50,000 by a customer in a month',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits in the account in amounts ranging between INR 4X,X00/- to INR 49,999/- in single/multiple accounts of the customer greater than [N] times in a month',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 20,
      ruleName: 'Frequent cash deposits just below INR 10,00,000',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits in amounts ranging between INR 9,XX,000/- to INR 10,00,000/- in single or multiple accounts of the customer greater than [N] times in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 21,
      ruleName: 'Frequent low cash deposits',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits in amounts ranging between INR [X1] to [X2] in single or multiple accounts of the customer greater than [N] times in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 22,
      ruleName: 'Frequent low cash withdrawals',
      ruleStatus:'Active',
      RuleDescription: 'Cash withdrawals in amounts ranging between INR [X1] to [X2] in single or multiple accounts of the customer greater than [N] times in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 23,
      ruleName: 'Many to one fund transfer',
      ruleStatus:'Active',
      RuleDescription: 'Funds sent by more than [N] remitters to one recipient in a month both for domestic and cross border transactions',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 24,
      ruleName: 'One to many fund transfer',
      ruleStatus:'Active',
      RuleDescription: 'Funds sent by one remitter to more than [N] recipients in a month both for domestic and cross border transactions.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 25,
      ruleName: 'Repeated small value cash deposits followed by immediate cash withdrawals from different locations',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits in amounts ranging between INR [X1] to [X2] greater than [N] times in [Y] days followed by immediate cash withdrawals of [Z] percent or more of total cash deposits from different locations.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 26,
      ruleName: 'Repeated small value transfers from multiple parties followed by immediate cash/ non-cash withdrawals (through ATMs or other modes)',
      ruleStatus:'Active',
      RuleDescription: 'Receipt of account to account transfer (RTGS/NEFT/IMPS/ transfer, etc) from multiple parties in amounts ranging between INR [X1] to [X2] greater than [N] times in [Y] days followed by immediate cash / non-cash withdrawals of [Z] percent or more of such deposits.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 27,
      ruleName: 'Repeated small value inward remittance from unrelated parties followed by immediate cash withdrawals (through ATMs or other modes)',
      ruleStatus:'Active',
      RuleDescription: 'Inward foreign remittances in amounts ranging between INR [X1] to [X2] greater than [N] times in [Y] days followed by immediate cash withdrawals {through ATM (especially other banks ATMs) or other modes} of [Z] percent or more of such remittances.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 28,
      ruleName: 'Repeated small value foreign inward remittance from unrelated parties followed by expenditure on specified activities such as purchase of tickets, hotel bookings etc',
      ruleStatus:'Active',
      RuleDescription: 'Inward foreign remittances in amounts ranging between INR [X1] to INR [X2] greater than [N] times in a month followed by expenditure on specified activities such as purchase of tickets, hotel booking etc.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 29,
      ruleName: 'Repeated small value transfers to a single Indian party',
      ruleStatus:'Active',
      RuleDescription: 'A single customer or set of customers send multiple account to account transfers (RTGS/NEFT/IMPS/transfer, etc.) in amounts ranging between INR [X1] to [X2] greater than [N] times in [Y] days, to a single Indian beneficiary/party.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 30,
      ruleName: 'High value cash transactions in NPOs',
      ruleStatus:'Active',
      RuleDescription: 'Cash transactions (deposits and withdrawals) greater than INR [X] in Trust/NGO/NPO in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 31,
      ruleName: 'NPOs or charities receiving funds from India or abroad, and transferring the same to a number of domestic and foreign beneficiaries',
      ruleStatus:'Active',
      RuleDescription: 'Single large value deposit greater than INR [X] for NPOs or charities followed by debits/transfers to more than [N] beneficiaries within 30 days.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 32,
      ruleName: 'High value cash transactions pertaining to accounts of real estate agents and dealers',
      ruleStatus:'Active',
      RuleDescription: 'Cash transactions (deposits and withdrawals) greater than INR [X] pertaining to accounts of real estate agents and dealers, in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 33,
      ruleName: 'High value cash transactions by dealer in precious metal or stone',
      ruleStatus:'Active',
      RuleDescription: 'Cash transactions (deposits and withdrawals) greater than INR [X] by dealer in precious metal, precious stone and gems & jewellery, in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 34,
      ruleName: 'High value foreign inward remittance',
      ruleStatus:'Active',
      RuleDescription: 'Inward foreign remittance greater than [X] value aggregated in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 35,
      ruleName: 'Inward foreign remittance in a new account',
      ruleStatus:'Active',
      RuleDescription: 'Inward foreign remittance greater than [X] value in a new account within [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 36,
      ruleName: 'Inward foreign remittance inconsistent with client profile',
      ruleStatus:'Active',
      RuleDescription: 'Inward foreign remittance greater than [X] value in [Y] days in account of students, housewife, pensioners, wages and salary person, minor accounts',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 37,
      ruleName: 'High value cross border transactions with a country or location with high ML risk/ tax havens.',
      ruleStatus:'Active',
      RuleDescription: 'Cross border transaction greater than value [X] involving a high risk country or jurisdiction',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 38,
      ruleName: 'Cross border transaction involving a country with high TF risk',
      ruleStatus:'Active',
      RuleDescription: 'Transaction involving a country considered to be high risk from the terrorist financing perspective',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 39,
      ruleName: 'Inward remittance followed by immediate withdrawal/transfer to other accounts',
      ruleStatus:'Active',
      RuleDescription: 'Foreign Inward remittances greater than [X] value followed by cash/non-cash withdrawals of [Z] percent or more within [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 40,
      ruleName: 'Sudden increase in cash deposits of customers',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits in client accounts aggregating to more than INR [X] in a month exceeds the monthly average of cash deposits in the preceding quarter by [Z] percent or more.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
      {
      id: 41,
      ruleName: 'Sudden increase in cash withdrawals of customers',
      ruleStatus:'Active',
      RuleDescription: 'Cash withdrawals in client accounts aggregating to more than INR [X] in a month exceeds the monthly average of cash withdrawals in the preceding quarter by [Z] percent or more.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 42,
      ruleName: 'Multiple cash deposits in one country followed by immediate ATM withdrawal in another country',
      ruleStatus:'Active',
      RuleDescription: 'Multiple instances [more than N times] of cash deposits in India of amount greater than INR [X] followed by ATM withdrawals outside India of [Z] percent or more in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 43,
      ruleName: 'Amounts of money transfer carried out by natural persons and legal entities are in multiples of 100/1,000/10,000/100,000 USD/EUR/National currency',
      ruleStatus:'Active',
      RuleDescription: 'Money transfers carried out by natural persons and legal entities in round foreign currency amounts',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 44,
      ruleName: 'Structuring of cross border transactions to avoid reporting in Cross Border Wire Transfer Report (CBWTR)',
      ruleStatus:'Active',
      RuleDescription: 'Cross-border remittances in amounts (equivalent to) ranging between INR 4XX,000 to INR 5,00,000 in single/multiple accounts of the customer greater than [N] times in a month',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 45,
      ruleName: 'Repeated small value withdrawals in sensitive locations',
      ruleStatus:'Active',
      RuleDescription: 'Cash withdrawals in amounts ranging between INR [X1] to [X2] greater than [N] times in [Y] days in locations with known terrorist incidents.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 46,
      ruleName: 'High value transactions in accounts opened and closed in a short duration',
      ruleStatus:'Active',
      RuleDescription: 'Account turnover (sum of credits and debits) of more than INR [X] in operative accounts closed within [N] days of opening',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 47,
      ruleName: 'Non-cash deposits followed by immediate outward remittance transactions',
      ruleStatus:'Active',
      RuleDescription: 'Non-cash deposits greater than [X] value followed by immediate outward foreign remittance of [Z] percent or more within [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 48,
      ruleName: 'High value transactions in new accounts followed by period of inactivity',
      ruleStatus:'Active',
      RuleDescription: 'Monthly Account turnover (sum of credits and debits) of more than INR [X] in newly opened operative account followed by period of inactivity in the account (no customer induced transactions for [N] days following the last transaction)',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 49,
      ruleName: 'Outward foreign remittances in newly opened accounts',
      ruleStatus:'Active',
      RuleDescription: 'Outward foreign remittance greater than [X] value aggregated in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 50,
      ruleName: 'High value outward remittances in accounts',
      ruleStatus:'Active',
      RuleDescription: 'Outward foreign remittance greater than [X] value aggregated in [Y] days.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 51,
      ruleName: 'Cash deposits followed by immediate outward remittance transactions',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits greater than [X] value followed by immediate outward foreign remittance of [Z] percent or more within [Y] days.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 52,
      ruleName: 'High value transactions in accounts without PAN',
      ruleStatus:'Active',
      RuleDescription: 'High value cash transactions above INR (X) in a month for accounts without PAN',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 53,
      ruleName: 'High value transactions in accounts without PAN',
      ruleStatus:'Active',
      RuleDescription: 'High value non-cash transactions above INR (X) in a month for accounts without PAN.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 54,
      ruleName: 'Unusually high activity in Current Account (CA)',
      ruleStatus:'Active',
      RuleDescription: 'Number of transactions exceeding [N] in CA (excluding public limited companies) in a month',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 55,
      ruleName: 'GST Refund Fraud',
      ruleStatus:'Active',
      RuleDescription: 'GST refund credits more than INR [X] and more than [Z] percent of total account credits during [Y] days.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 56,
      ruleName: 'Person getting cash deposits below threshold reporting limits are being followed by immediate ATM withdrawal in Afghanistan/Pakistan',
      ruleStatus:'Active',
      RuleDescription: 'Deposit of cash in the account in amounts ranging between INR 4X,000 to INR 49,999 greater than [N] times in [Y] days followed by immediate ATM withdrawal in Afghanistan or Pakistan',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 57,
      ruleName: 'The accounts of persons show seasonal fluctuations in outbound transactions i.e. October - December and April - June coinciding with opium cultivation and harvesting',
      ruleStatus:'Active',
      RuleDescription: 'Customers forex turnover (total value of foreign inward and foreign outward remittances in a quarter) above [X] value, exceeds its previous quarters turnover by [Z] percent or more.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 58,
      ruleName: 'Non residents remit funds to offshore companies and natural persons having offshore accounts',
      ruleStatus:'Active',
      RuleDescription: 'Non residents remitting funds for amounts greater than INR [X] to accounts located in high risk countries',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 59,
      ruleName: 'Majority of credit card repayments in cash',
      ruleStatus:'Active',
      RuleDescription: 'Credit Card repayments greater than INR [X] in cash in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 60,
      ruleName: 'Majority of credit card repayments in cash',
      ruleStatus:'Active',
      RuleDescription: 'Credit Card repayment in cash is greater than [Z] percent of repayments totalling to INR [X] or more in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 61,
      ruleName: 'Large credit balance in credit card',
      ruleStatus:'Active',
      RuleDescription: 'Credit balance in credit card is more than [Z] percent of the credit card limit with a minimum credit balance of INR [X]',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 62,
      ruleName: 'Large value credit card transactions for purchase of high value goods',
      ruleStatus:'Active',
      RuleDescription: 'Credit Card usage greater than INR [X] for merchant category code (MCC 5944) for e.g. jewellery etc. in [Y] days.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 63,
      ruleName: 'Large repetitive credit card usage at the same merchant',
      ruleStatus:'Active',
      RuleDescription: 'More than [N] count of credit card transactions at same merchant aggregating to more than INR [X] in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 64,
      ruleName: 'Cash deposits made in home bank accounts located on Indo-Nepal border areas in Bihar (mainly, in districts East & West Champaran) with quick ATM withdrawals (within 2 days) in Malda (West Bengal) area or cash withdrawal from branches.',
      ruleStatus:'Active',
      RuleDescription: 'Cash deposits made in home bank accounts located on Indo-Nepal border areas in Bihar (mainly, in districts East & West Champaran) with quick ATM or cash withdrawals from branches (within 2 days) in Malda (West Bengal) area',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 65,
      ruleName: 'Frequent cash deposits made in bank accounts located in Malda if the cash is deposited in various different locations of the country e.g. Delhi/NCR, Karnataka, Gujarat, Tamil Nadu, Maharashtra etc. and withdrawn simultaneously at Malda.',
      ruleStatus:'Active',
      RuleDescription: 'Frequent cash deposits made in Malda (West Bengal) based bank accounts with cash being deposited in various different locations of the country e.g. Delhi/NCR, Karnataka, Gujarat, Tamil Nadu, Maharashtra etc. and being withdrawn simultaneously at Malda.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 66,
      ruleName: 'Repayment of loan in cash',
      ruleStatus:'Active',
      RuleDescription: 'Loan repayments in cash greater than INR [X] in [Y] months with a minimum loan disbursement value of INR [X1]',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 67,
      ruleName: 'Repayment of loan in cash',
      ruleStatus:'Active',
      RuleDescription: 'Loan repayments in cash greater than [Z] percent of total repayments in [Y] months with a minimum loan disbursement value of INR [X1]',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 68,
      ruleName: 'Match with UN List',
      ruleStatus:'Active',
      RuleDescription: 'Exact match of customer details with individuals/entities on various UNSCR Lists',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 69,
      ruleName: 'Match with UAPA List',
      ruleStatus:'Active',
      RuleDescription: 'Exact match of customer details with designated individuals/entities under UAPA',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 70,
      ruleName: 'Match with other TF List',
      ruleStatus:'Active',
      RuleDescription: 'Exact match of customer details with TF suspects on lists of Interpol, EU, OFAC, Commercial lists (e.g. World-Check, Factiva, LexisNexis, Dun & Bradstreet etc.) and other sources',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
      {
      id: 71,
      ruleName: 'Match with other criminal lists',
      ruleStatus:'Active',
      RuleDescription: 'Exact match of customer details with criminals on lists of Interpol, EU, OFAC, Commercial lists (e.g. World-Check, Factiva, LexisNexis, Dun & Bradstreet etc.) and other sources',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 72,
      ruleName: 'Match with FIU-IND alerts/ lists/ requests',
      ruleStatus:'Active',
      RuleDescription: 'Exact match of customer details with the details provided by FIU-IND in its alerts/lists/requests. May be kept under observation for a period of 2 years from date of request/alert or as directed.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 73,
      ruleName: 'Large value cash withdrawals against international card',
      ruleStatus:'Active',
      RuleDescription: 'Cash withdrawals greater than INR [X] against international card in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 74,
      ruleName: 'Repeated small value cash withdrawals against international card',
      ruleStatus:'Active',
      RuleDescription: 'Cash withdrawals against international card in amounts ranging between INR [X1] to [X2] greater than [N] times in [Y] days in locations with known terrorist incidents',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 75,
      ruleName: 'Foreign exchange transactions for non-account holder transactions',
      ruleStatus:'Active',
      RuleDescription: 'Foreign currency transactions more than INR [X] conducted for non-account holders in a month',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 76,
      ruleName: 'Foreign exchange transactions for non-account holder transactions',
      ruleStatus:'Active',
      RuleDescription: 'Foreign remittance transactions more than INR [X] conducted for non-account holders in a month',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 77,
      ruleName: 'Frequent transactions with entities located at high risk countries/ jurisdiction,',
      ruleStatus:'Active',
      RuleDescription: 'Inward/Outward remittances from high risk countries/jurisdiction in amounts greater than INR [X] more than [N] times in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 78,
      ruleName: 'Frequent transactions with entities located at, off shore financial centres',
      ruleStatus:'Active',
      RuleDescription: 'Inward/Outward remittances from Offshore financial centres in amounts greater than INR [X] more than [N] times in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 79,
      ruleName: 'Immediate transfer of funds and very low minimum balance maintained in account',
      ruleStatus:'Active',
      RuleDescription: 'Cash/Non-cash deposits in non-individual accounts greater than INR [X1] followed by non-cash withdrawals of [Z] percent or more within [Y] days and Minimum Account Balance less than INR [X2]',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 80,
      ruleName: 'Regarding Maoist Insurgency',
      ruleStatus:'Active',
      RuleDescription: 'Bank accounts where one ATM card is used in a city of Chattisgarh, Jharkhand, South Orissa at more than 6 locations within 72 hours duration where amount is less than INR 20,000.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 81,
      ruleName: 'Regarding Maoist Insurgency',
      ruleStatus:'Active',
      RuleDescription: 'Account funded in cash outside Maoist area, followed by immediate swiping of Debit card in Maoist area for less than INR [X] transactions.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 82,
      ruleName: 'Reg North East Insurgency (for Nagaland, Assam & Manipur)',
      ruleStatus:'Active',
      RuleDescription: 'Bank accounts with cash deposits in small amounts i.e. less than INR [X] for [N] times in [Y] days, followed by immediate ATM withdrawals from different locations',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 83,
      ruleName: 'Reg North East Insurgency (for Nagaland, Assam & Manipur)',
      ruleStatus:'Active',
      RuleDescription: 'Bank accounts with cash deposits in small amounts i.e. less than INR [X] for [N] times in [Y] days, followed by conversion of the deposited money into Fixed Deposits within [Y] days.',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 84,
      ruleName: 'Reg North East Insurgency (for Nagaland, Assam & Manipur)',
      ruleStatus:'Active',
      RuleDescription: 'Bank accounts in which large amounts of money is deposited and the same is either transferred to other accounts or withdrawn as cash/ by cheque instantly',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 85,
      ruleName: 'Wash sales or round trip sales - Accounts debited and then immediately credited or vice versa for related purchase/sale',
      ruleStatus:'Active',
      RuleDescription: 'Foreign Inward remittances greater than [X] value followed by Foreign Outward remittances of [Z] percent or more within [Y] days and vice-versa',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 86,
      ruleName: 'High value technical/ professional charges paid on account of consultancy',
      ruleStatus:'Active',
      RuleDescription: 'Foreign remittances of amount more than [X] value with SWIFT purpose Consultancy received from or being sent to high risk countries',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 87,
      ruleName: 'Multiple advance remittances to single or multiple entities by the same entity within permissible ceiling',
      ruleStatus:'Active',
      RuleDescription: 'Advance import remittances just below the limit of USD 200,000 (or equivalent) sent by one remitter to single/multiple recipients during [Y] months',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 88,
      ruleName: 'Initial import remittances by customers',
      ruleStatus:'Active',
      RuleDescription: 'First time import remittance above [X] value',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 89,
      ruleName: 'EDPMS-Exports done but payment not received',
      ruleStatus:'Active',
      RuleDescription: 'Review of outstanding data of all exporters beyond 270 days from the EDPMS system on a quarterly basis beyond the value of USD [X] or equivalent for own AD bank code',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 90,
      ruleName: 'EDPMS- Export advance received but goods not shipped',
      ruleStatus:'Active',
      RuleDescription: 'Review of all inward remittances received as export advance and outstanding beyond 365 days for submission of shipping bill either from banks own system/ EDPMS system on a quarterly basis beyond the value of USD [X] or equivalent',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 91,
      ruleName: 'IDPMS- Import done but payment not sent',
      ruleStatus:'Active',
      RuleDescription: 'Review of outstanding data of all importers beyond 180 days from the IDPMS system on a quarterly basis beyond the value of USD [X] or equivalent for own AD bank code',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 92,
      ruleName: 'IDPMS- Import advance sent but goods not received',
      ruleStatus:'Active',
      RuleDescription: 'Review of all outward remittances sent as import advance and outstanding beyond 180 days for submission of bill of entry either from banks own system/ IDPMS system on a quarterly basis beyond the value USD [X] or equivalent',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 93,
      ruleName: 'Outward remittance of same value from single customer. More than x transactions on last y days',
      ruleStatus:'Active',
      RuleDescription: 'Outward remittance of same or similar value of INR [X] from the same customer more than [N] times in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 94,
      ruleName: 'Established Fraud Cases',
      ruleStatus:'Active',
      RuleDescription: 'Reporting established fraud cases: All fraud cases including cyber fraud cases by the banks customer/third party who is established to be involved in the fraud of value exceeding INR [X].',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 95,
      ruleName: 'Routing of funds through multiple accounts',
      ruleStatus:'Active',
      RuleDescription: 'Transactions greater than INR [X1] between more than [N] accounts in the same bank aggregating to more than [X2] on the same day',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 96,
      ruleName: 'Inward remittance of same value from same remitter',
      ruleStatus:'Active',
      RuleDescription: 'Inward foreign remittance of same value from the same remitter (more than [N] transactions in last [Y] days) with a minimum transaction value of each transaction above [X]',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 97,
      ruleName: 'Reg. NGOs',
      ruleStatus:'Active',
      RuleDescription: 'a) Any person receiving foreign contribution in its account (not designated as FCRA account) or without obtaining prior permission from MHA. [Banks to update this list as per Orders issued by RBI (as advised by MHA) from time to time',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 99,
      ruleName: 'Large funds are received from or sent to Afghanistan as advances for export/ import without goods being exported/ imported',
      ruleStatus:'Active',
      RuleDescription: 'Round large value wire transfers (more than X amount) received from/sent to Afghanistan as advance for export/import without goods being exported/ imported',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 100,
      ruleName: 'Students from other countries (having Afghan nationality) staying in India, maintaining more than one account and generating cash more than INR 10 lakh in a year',
      ruleStatus:'Active',
      RuleDescription: 'Students from other countries (having Afghan nationality) staying in India, maintaining more than one account and generating cash more than INR 10 lakh in a year',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 101,
      ruleName: 'Persons of Afghan nationality staying in India and sending multiple maximum permissible amounts to Afghanistan',
      ruleStatus:'Active',
      RuleDescription: 'Persons of Afghan nationality staying in India and sending multiple maximum permissible amounts to Afghanistan',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 102,
      ruleName: 'Frequent Locker operations',
      ruleStatus:'Active',
      RuleDescription: 'Number of locker operations greater than [N] times in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 103,
      ruleName: 'Transaction involving a location with terrorist incident',
      ruleStatus:'Active',
      RuleDescription: 'Transaction involving a location prior to or immediately after a terrorist incident',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 104,
      ruleName: 'Advance for supply of goods or services is a major part/percentage of the total value of goods or services',
      ruleStatus:'Active',
      RuleDescription: 'Advance for supply of goods or services is a major part/percentage of the total value of goods or services',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 105,
      ruleName: 'Over/under invoicing of goods or services',
      ruleStatus:'Active',
      RuleDescription: 'Over/under invoicing of goods or services',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 106,
      ruleName: 'Submission/ payment of round figure bills',
      ruleStatus:'Active',
      RuleDescription: 'Submission/ payment of round figure bills',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
     {
      id: 107,
      ruleName: 'Outward remittance to same overseas party',
      ruleStatus:'Active',
      RuleDescription: 'Outward foreign remittances to a single unrelated overseas party in amounts ranging between INR [X1] to [X2] greater than [N] times in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
    {
      id: 108,
      ruleName: 'Originator/beneficiary information missing in wire transfers',
      ruleStatus:'Active',
      RuleDescription: 'Originator/beneficiary information missing in wire transfers received by a customer for more than [N] times in [Y] days',
     individually: '1lakh',
      nonIndividually : '50lakh'
    },
  ]);
 

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
  {!selectedTxn ? (
    // Rules Table View
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rules Added</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-5 font-semibold bg-gray-100 p-3 rounded">
          <div>ID</div>
          <div>Rule Name</div>
          <div>Rule Status</div>
          <div>Action</div>
          <div>Delete</div>
        </div>

        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="grid grid-cols-5 items-center border p-3 rounded shadow-sm"
          >
            <div>{txn.id}</div>
            <div>{txn.ruleName}</div>
            <div>{txn.ruleStatus}</div>
            <div>
              <button
                onClick={() => setSelectedTxn(txn)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View
              </button>
            </div>
            <div>
              <button
                className="text-red-500"
                onClick={() => deleteRules(txn.id)}
              >
                <Icons name="Trash2" size={20} />
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  ) : (
    // Rule Details View
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Rule Details</CardTitle>
      </CardHeader>
      <CardContent>
        <button
          onClick={() => setSelectedTxn(null)}
          className="mb-4 text-blue-500 underline"
        >
          ← Back to Rules
        </button>

     <div className="space-y-2">
      <div className="grid grid-cols-2">
        <div className="text-sm text-gray-500">ID:</div>
        <div className="text-sm font-medium">{selectedTxn.id}</div>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-2">
        <div className="text-sm text-gray-500">Rule Name:</div>
        <div className="text-sm font-medium">{selectedTxn.ruleName}</div>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-2 items-center">
        <div className="text-sm text-gray-500">Rule Status:</div>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="ruleStatus"
              value="active"
              checked={selectedTxn.ruleStatus === 'active'}
              onChange={() => handleStatusChange('active')}
            />
            <span>Active</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="ruleStatus"
              value="inactive"
              checked={selectedTxn.ruleStatus === 'inactive'}
              onChange={() => handleStatusChange('inactive')}
            />
            <span>Inactive</span>
          </label>
        </div>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-2">
        <div className="text-sm text-gray-500">Rule Description:</div>
        <div className="text-sm font-medium">{selectedTxn.RuleDescription}</div>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-2">
        <div className="text-sm text-gray-500">Individually:</div>
        <div className="text-sm font-medium">{selectedTxn.individually}</div>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-2">
        <div className="text-sm text-gray-500">Non-Individually:</div>
        <div className="text-sm font-medium">{selectedTxn.nonIndividually}</div>
      </div>
    </div>
       <div className="flex justify-end space-x-4 mt-4">
  <button
    // onClick={() => setSelectedTxn(null)}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Test
  </button>
  <button
    // onClick={() => setSelectedTxn(null)}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Confirm
  </button>
</div>
      </CardContent>
    </Card>
  )}
</div>
      </>
  );
};

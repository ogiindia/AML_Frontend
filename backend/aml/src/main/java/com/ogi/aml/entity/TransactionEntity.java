package com.ogi.aml.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_TRN")
public class TransactionEntity {
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "TRANSACTIONID")
	private String transactionid;
	
	@Column(name = "TRANSACTIONBATCHID")
	private String transactionbatchid;
	
	@Column(name = "CUSTOMERID")
	private Long customerid;
	
	@Column(name = "ACCOUNTNO")
	private Long accountno;
	
	@Column(name = "BRANCHCODE")
	private String branchcode;
	
	@Column(name = "TRANSACTIONTYPE")
	private String transactiontype;
	
	@Column(name = "CHANNELTYPE")
	private String channeltype;
	
	@Column(name = "CHANNELID")
	private String channelid;
	
	@Column(name = "TRANSACTIONDATE")
	private String transactiondate;
	
	@Column(name = "TRANSACTIONTIME")
	private String transactiontime;
	
	@Column(name = "AMOUNT")
	private Double amount;
	
	@Column(name = "DEPOSITORWITHDRAWAL")
	private String depositorwithdrawal;

	@Column(name = "INSTRUMENTCODE")
	private String instrumentcode;
	
	@Column(name = "INSTRUMENTNO")
	private String instrumentno;
	
	@Column(name = "INSTRUMENTDATE")
	private String instrumentdate;
	
	@Column(name = "MICRCODE")
	private String micrcode;
	
	@Column(name = "ACCTCURRENCYCODE")
	private String acctcurrencycode;
	
	@Column(name = "CURRENCYCODE")
	private String currencycode;
	
	@Column(name = "NARRATION")
	private String narration;
	
	@Column(name = "FOREXREMITTANCE")
	private String forexremittance;
	
	@Column(name = "COUNTERPARTYID")
	private String counterpartyid;
	
	@Column(name = "COUNTERPARTYNAME")
	private String counterpartyname;
	
	@Column(name = "COUNTERPARTYACCOUNTNO")
	private Long counterpartyaccountno;
	
	@Column(name = "COUNTERPARTYTYPE")
	private String counterpartytype;
	
	@Column(name = "COUNTERBANKCODE")
	private String counterbankcode;
	
	@Column(name = "COUNTERBRANCHCODE")
	private String counterbranchcode;
	
	@Column(name = "COUNTERPARTYADDRESS")
	private String counterpartyaddress;
	
	@Column(name = "COUNTERCOUNTRYCODE")
	private String countercountrycode;
	
	@Column(name = "ACCOUNTCURRENCYTRNAMT")
	private Long accountcurrencytrnamt;
	
	@Column(name = "BALANCEAMOUNT")
	private Long balanceamount;
	
	@Column(name = "MERCHANTCATEGORYCODE")
	private String merchantcategorycode;

	public String getTransactionid() {
		return transactionid;
	}

	public void setTransactionid(String transactionid) {
		this.transactionid = transactionid;
	}

	public String getTransactionbatchid() {
		return transactionbatchid;
	}

	public void setTransactionbatchid(String transactionbatchid) {
		this.transactionbatchid = transactionbatchid;
	}

	public Long getCustomerid() {
		return customerid;
	}

	public void setCustomerid(Long customerid) {
		this.customerid = customerid;
	}

	public Long getAccountno() {
		return accountno;
	}

	public void setAccountno(Long accountno) {
		this.accountno = accountno;
	}

	public String getBranchcode() {
		return branchcode;
	}

	public void setBranchcode(String branchcode) {
		this.branchcode = branchcode;
	}

	public String getTransactiontype() {
		return transactiontype;
	}

	public void setTransactiontype(String transactiontype) {
		this.transactiontype = transactiontype;
	}

	public String getChanneltype() {
		return channeltype;
	}

	public void setChanneltype(String channeltype) {
		this.channeltype = channeltype;
	}

	public String getChannelid() {
		return channelid;
	}

	public void setChannelid(String channelid) {
		this.channelid = channelid;
	}

	public String getTransactiondate() {
		return transactiondate;
	}

	public void setTransactiondate(String transactiondate) {
		this.transactiondate = transactiondate;
	}

	public String getTransactiontime() {
		return transactiontime;
	}

	public void setTransactiontime(String transactiontime) {
		this.transactiontime = transactiontime;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getDepositorwithdrawal() {
		return depositorwithdrawal;
	}

	public void setDepositorwithdrawal(String depositorwithdrawal) {
		this.depositorwithdrawal = depositorwithdrawal;
	}
	public String getInstrumentcode() {
		return instrumentcode;
	}

	public void setInstrumentcode(String instrumentcode) {
		this.instrumentcode = instrumentcode;
	}

	public String getInstrumentno() {
		return instrumentno;
	}

	public void setInstrumentno(String instrumentno) {
		this.instrumentno = instrumentno;
	}

	public String getInstrumentdate() {
		return instrumentdate;
	}

	public void setInstrumentdate(String instrumentdate) {
		this.instrumentdate = instrumentdate;
	}

	public String getMicrcode() {
		return micrcode;
	}

	public void setMicrcode(String micrcode) {
		this.micrcode = micrcode;
	}

	public String getAcctcurrencycode() {
		return acctcurrencycode;
	}

	public void setAcctcurrencycode(String acctcurrencycode) {
		this.acctcurrencycode = acctcurrencycode;
	}

	public String getCurrencycode() {
		return currencycode;
	}

	public void setCurrencycode(String currencycode) {
		this.currencycode = currencycode;
	}

	public String getNarration() {
		return narration;
	}

	public void setNarration(String narration) {
		this.narration = narration;
	}

	public String getForexremittance() {
		return forexremittance;
	}

	public void setForexremittance(String forexremittance) {
		this.forexremittance = forexremittance;
	}

	public String getCounterpartyid() {
		return counterpartyid;
	}

	public void setCounterpartyid(String counterpartyid) {
		this.counterpartyid = counterpartyid;
	}

	public String getCounterpartyname() {
		return counterpartyname;
	}

	public void setCounterpartyname(String counterpartyname) {
		this.counterpartyname = counterpartyname;
	}

	public Long getCounterpartyaccountno() {
		return counterpartyaccountno;
	}

	public void setCounterpartyaccountno(Long counterpartyaccountno) {
		this.counterpartyaccountno = counterpartyaccountno;
	}

	public String getCounterpartytype() {
		return counterpartytype;
	}

	public void setCounterpartytype(String counterpartytype) {
		this.counterpartytype = counterpartytype;
	}

	public String getCounterbankcode() {
		return counterbankcode;
	}

	public void setCounterbankcode(String counterbankcode) {
		this.counterbankcode = counterbankcode;
	}

	public String getCounterbranchcode() {
		return counterbranchcode;
	}

	public void setCounterbranchcode(String counterbranchcode) {
		this.counterbranchcode = counterbranchcode;
	}

	public String getCounterpartyaddress() {
		return counterpartyaddress;
	}

	public void setCounterpartyaddress(String counterpartyaddress) {
		this.counterpartyaddress = counterpartyaddress;
	}

	public String getCountercountrycode() {
		return countercountrycode;
	}

	public void setCountercountrycode(String countercountrycode) {
		this.countercountrycode = countercountrycode;
	}

	public Long getAccountcurrencytrnamt() {
		return accountcurrencytrnamt;
	}

	public void setAccountcurrencytrnamt(Long accountcurrencytrnamt) {
		this.accountcurrencytrnamt = accountcurrencytrnamt;
	}

	public Long getBalanceamount() {
		return balanceamount;
	}

	public void setBalanceamount(Long balanceamount) {
		this.balanceamount = balanceamount;
	}

	public String getMerchantcategorycode() {
		return merchantcategorycode;
	}

	public void setMerchantcategorycode(String merchantcategorycode) {
		this.merchantcategorycode = merchantcategorycode;
	}

	


}

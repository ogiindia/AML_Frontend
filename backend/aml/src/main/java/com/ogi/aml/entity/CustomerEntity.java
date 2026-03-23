package com.ogi.aml.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

@Entity
@Table(name = "FS_CUST")
public class CustomerEntity {
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "CUSTOMERID")
	private String customerid;
	
	@Column(name = "CUSTOMERNAME")
	private String customername;	
	
	@Column(name = "customertype")
	private String customertype;
	
	@Column(name = "CUSTOMERCATEGORY")
	private String customercategory;
	
	@Column(name = "BRANCHCODE")
	private String branchcode;
	
	@Column(name = "NATUREOFBUSINESS")
	private String natureofbusiness;
	
	@Column(name = "CREDITRATING")
	private String creditrating;
	
	@Column(name = "CREATEDDATETIME")
	private String createddatetime;
	
	@Column(name = "FIRSTNAME")
	private String firstname;
	
	@Column(name = "LASTNAME")
	private String lastname;
	
	@Column(name = "DATEOFBIRTH")
	private String dateofbirth;
	
	@Column(name = "PLACEOFBIRTH")
	private String placeofbirth;
	
	@Column(name = "NATIONALITY")
	private String nationality;
	
	@Column(name = "SEX")
	private String sex;
	
	@Column(name = "PANNO")
	private String panno;
	
	@Column(name = "OCCUPATION")
	private String occupation;
	
	@Column(name = "CITY")
	private String city;
	
	@Column(name = "COUNTRY")
	private String country;
	
	@Column(name = "PHONENO")
	private String phoneno;
	
	@Column(name = "MOBILENO")
	private String mobileno;
	
	@Column(name = "EMAILID")
	private String emailid;
	
	public String getCustomerid() {
		return customerid;
	}
	public void setCustomerid(String customerid) {
		this.customerid = customerid;
	}
	public String getCustomername() {
		return customername;
	}
	public void setCustomername(String customername) {
		this.customername = customername;
	}
	public String getCustomertype() {
		return customertype;
	}
	public void setCustomertype(String customertype) {
		this.customertype = customertype;
	}
	public String getCustomercategory() {
		return customercategory;
	}
	public void setCustomercategory(String customercategory) {
		this.customercategory = customercategory;
	}
	
	public String getBranchcode() {
		return branchcode;
	}
	public void setBranchcode(String branchcode) {
		this.branchcode = branchcode;
	}
	public String getNatureofbusiness() {
		return natureofbusiness;
	}
	public void setNatureofbusiness(String natureofbusiness) {
		this.natureofbusiness = natureofbusiness;
	}
	public String getCreditrating() {
		return creditrating;
	}
	public void setCreditrating(String creditrating) {
		this.creditrating = creditrating;
	}
	public String getCreateddatetime() {
		return createddatetime;
	}
	public void setCreateddatetime(String createddatetime) {
		this.createddatetime = createddatetime;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getDateofbirth() {
		return dateofbirth;
	}
	public void setDateofbirth(String dateofbirth) {
		this.dateofbirth = dateofbirth;
	}
	public String getPlaceofbirth() {
		return placeofbirth;
	}
	public void setPlaceofbirth(String placeofbirth) {
		this.placeofbirth = placeofbirth;
	}
	public String getNationality() {
		return nationality;
	}
	public void setNationality(String nationality) {
		this.nationality = nationality;
	}
	
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getPanno() {
		return panno;
	}
	public void setPanno(String panno) {
		this.panno = panno;
	}
	public String getOccupation() {
		return occupation;
	}
	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}
	
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	
	public String getPhoneno() {
		return phoneno;
	}
	public void setPhoneno(String phoneno) {
		this.phoneno = phoneno;
	}
	public String getMobileno() {
		return mobileno;
	}
	public void setMobileno(String mobileno) {
		this.mobileno = mobileno;
	}
	public String getEmailid() {
		return emailid;
	}
	public void setEmailid(String emailid) {
		this.emailid = emailid;
	}
	

}

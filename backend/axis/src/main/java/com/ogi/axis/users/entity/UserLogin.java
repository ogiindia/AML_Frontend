package com.ogi.axis.users.entity;

import java.time.LocalDateTime;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.BaseEntity;
import com.ogi.factory.pojo.LongBaseEntity;
import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "NGP_USER_LOGIN")
public class UserLogin extends LongBaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String username; // it can be email or username used for login unique one
	private String password;
	private LocalDateTime ltSuccessLogin;
	private LocalDateTime ltFailureLogin;
	private Boolean userStatus = true;
	private String userType; // systemuser / admin / maker /checker
	private LocalDateTime pwdExpDt;
	private LocalDateTime ltPwdChgdDt;
	private String pwdStatus;
	private Integer PwdFailedCnt;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "profileId", referencedColumnName = "profile_id")
	private UserProfile userProfile; // creates UserId column and add foriegn key to the referencedColumnName

	public UserProfile getUserProfile() {
		return userProfile;
	}

	public void setUserProfile(UserProfile userProfile) {
		this.userProfile = userProfile;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public LocalDateTime getLtSuccessLogin() {
		return ltSuccessLogin;
	}

	public void setLtSuccessLogin(LocalDateTime ltSuccessLogin) {
		this.ltSuccessLogin = ltSuccessLogin;
	}

	public LocalDateTime getLtFailureLogin() {
		return ltFailureLogin;
	}

	public void setLtFailureLogin(LocalDateTime ltFailureLogin) {
		this.ltFailureLogin = ltFailureLogin;
	}

	public Boolean getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(Boolean userStatus) {
		this.userStatus = userStatus;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public LocalDateTime getPwdExpDt() {
		return pwdExpDt;
	}

	public void setPwdExpDt(LocalDateTime pwdExpDt) {
		this.pwdExpDt = pwdExpDt;
	}

	public LocalDateTime getLtPwdChgdDt() {
		return ltPwdChgdDt;
	}

	public void setLtPwdChgdDt(LocalDateTime ltPwdChgdDt) {
		this.ltPwdChgdDt = ltPwdChgdDt;
	}

	public Integer getPwdFailedCnt() {
		return PwdFailedCnt;
	}

	public void setPwdFailedCnt(Integer pwdFailedCnt) {
		PwdFailedCnt = pwdFailedCnt;
	}

	public String getPwdStatus() {
		return pwdStatus;
	}

	public void setPwdStatus(String pwdStatus) {
		this.pwdStatus = pwdStatus;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}

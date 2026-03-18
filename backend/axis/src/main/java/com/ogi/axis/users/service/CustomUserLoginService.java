package com.ogi.axis.users.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.axis.users.entity.UserLogin;

public class CustomUserLoginService extends UserLogin implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String username;
	private String keyword;
	private String givenName;
	Collection<? extends GrantedAuthority> authorities;

	private String dn;

	private String insId;

	@Autowired
	ObjectMapper obj;

	public CustomUserLoginService(UserLogin login) {
		this.username = login.getUsername();
		this.keyword = login.getPassword();
		this.givenName = login.getUsername();
		this.insId = login.getUserProfile().getInsId();
		List<GrantedAuthority> auths = new ArrayList<>();
		this.authorities = auths;
	}

	public CustomUserLoginService(String username2, String password,
			Collection<? extends GrantedAuthority> authorities2, String dn) {
		// TODO Auto-generated constructor stub

		this.username = username2;
		this.keyword = password;
		this.authorities = authorities2;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return keyword;
	}

	public String getGivenName() {
		return givenName;
	}

	public String getDn() {
		return dn;
	}

	public void setDn(String dn) {
		this.dn = dn;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getInsId() {
		return insId;
	}

	public void setInsId(String insId) {
		this.insId = insId;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}

	public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

}

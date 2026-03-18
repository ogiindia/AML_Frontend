package com.ogi.security.filter;

import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5842375450526056303L;
	private final String provider;
	private final String givenName;

	public CustomAuthenticationToken(Object principal, Object credentials, String provider, String givenName) {
		super(principal, credentials);
		this.givenName = givenName;
		this.provider = provider;
		// TODO Auto-generated constructor stub
	}

	public CustomAuthenticationToken(Object principal, Object credentials,
			Collection<? extends GrantedAuthority> authorities, String provider, String givenName) {
		super(principal, credentials, authorities);
		this.givenName = givenName;
		this.provider = provider;
	}

	public String getProvider() {
		return provider;
	}

	public String getGivenName() {
		return givenName;
	}

}

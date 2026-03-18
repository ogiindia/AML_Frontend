package com.ogi.security.provider;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ogi.security.filter.CustomAuthenticationToken;

@Component
public class CustomUserDetailsAuthenticationProvider implements AuthenticationProvider {

	private final PasswordEncoder passwordEncoder;

	private final UserDetailsService userDetailsService;

	public CustomUserDetailsAuthenticationProvider(UserDetailsService userDetailService,
			PasswordEncoder passwordEncoder) {
		this.userDetailsService = userDetailService;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String username = authentication.getName();
		String keyword = authentication.getCredentials().toString();

		UserDetails user = userDetailsService.loadUserByUsername(username);

		if (this.matches(keyword, user.getPassword())) {
			return new CustomAuthenticationToken(username, keyword, user.getAuthorities(), "JDBC", null);
		} else {
			throw new BadCredentialsException("Authentication Failed");
		}
	}

	@Override
	public boolean supports(Class<?> authentication) {
		// TODO Auto-generated method stub
		return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
	}


	private boolean matches(String rawPassword, String encodedPassword) {
		return passwordEncoder.matches(rawPassword, encodedPassword);
	}

}

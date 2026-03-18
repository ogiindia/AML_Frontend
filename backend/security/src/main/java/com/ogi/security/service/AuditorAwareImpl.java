package com.ogi.security.service;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuditorAwareImpl implements AuditorAware<String> {

	@Override
	public Optional<String> getCurrentAuditor() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//		System.out.println("into audit aware input ");

		if (authentication != null && authentication.isAuthenticated()) {
			return Optional.of(authentication.getName());
		}

		// TODO Auto-generated method stub
		return Optional.of("System");
	}

}

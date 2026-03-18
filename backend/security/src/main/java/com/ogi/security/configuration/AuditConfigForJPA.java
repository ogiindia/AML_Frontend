package com.ogi.security.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import com.ogi.security.service.AuditorAwareImpl;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class AuditConfigForJPA {

	@Bean
	AuditorAware<String> auditorAware() {
		System.out.println("jpa configuration");
		return new AuditorAwareImpl();
	}

}

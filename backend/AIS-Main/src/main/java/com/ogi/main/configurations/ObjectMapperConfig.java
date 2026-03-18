package com.ogi.main.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class ObjectMapperConfig {

	@Bean
	ObjectMapper objectMapper() {
		ObjectMapper mapper = new ObjectMapper();

		// register Java Time/Date for LocalDate Convertions
		mapper.registerModule(new JavaTimeModule());

		// incase if Timstamp needs to be disabled

		mapper.disable(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS);

		return mapper;
	}

}

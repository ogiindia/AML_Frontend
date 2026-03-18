package com.ogi.main;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan("com.ogi")
@EntityScan("com.ogi")
@EnableJpaRepositories("com.ogi")
@EnableScheduling
public class AISMainApplication {

	
	
	public static void main(String[] args) {

		SpringApplication.run(AISMainApplication.class, args);

	}

}

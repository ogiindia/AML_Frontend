package com.ogi.axis.configuration.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.axis.configuration.modal.Configuration;

@Repository
public interface ConfigurationRepository extends JpaRepository<Configuration, UUID> {

	
	
}

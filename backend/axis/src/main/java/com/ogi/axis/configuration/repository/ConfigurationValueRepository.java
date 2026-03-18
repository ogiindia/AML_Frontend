package com.ogi.axis.configuration.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.axis.configuration.modal.Configuration;
import com.ogi.axis.configuration.modal.ConfigurationValue;

@Repository
public interface ConfigurationValueRepository extends JpaRepository<ConfigurationValue, UUID> {

	 Optional<ConfigurationValue> findByConfigKey(String key);

}

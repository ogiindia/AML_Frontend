package com.ogi.axis.configuration.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.interfaces.AppConfigurations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.axis.configuration.modal.ConfigCriteria;
import com.ogi.axis.configuration.modal.Configuration;
import com.ogi.axis.configuration.modal.ConfigurationValue;
import com.ogi.axis.configuration.repository.ConfigurationRepository;
import com.ogi.axis.configuration.repository.ConfigurationValueRepository;

@Service
public class ConfigurationValueService extends BaseResolver<ConfigurationValue, UUID> implements AppConfigurations {

	private final ConfigurationRepository configurationRepository;

	@Autowired
	ObjectMapper obj;

	@Autowired
	ConfigurationValueRepository configValueRepo;

	private static final String entityID = "CONFIG_VALUE";

	ConfigurationValueService(ConfigurationRepository configurationRepository) {
		this.configurationRepository = configurationRepository;
	}

	@Override
	public Object getConfigByName(String name) {
		// TODO Auto-generated method stub
		return null;
	}

	@GraphQLQuery
	public ConfigurationValue getConfigByKey(ConfigCriteria config) {
		System.out.println("into getConfig by key");
		// yet to update the query for institution and division
		Optional<ConfigurationValue> optConfigCriteria = configValueRepo.findByConfigKey(config.getField());

		if (optConfigCriteria.isPresent())
			return optConfigCriteria.get();

		return new ConfigurationValue();

	}

	@Transactional
	@GraphQLMutation(name = "SaveOrUpdateConfigurationValue")
	public List<ConfigurationValue> saveOrUpdate(List<ConfigCriteria> config) {

		System.out.println("into config value saveOrUpdate");

		List<ConfigurationValue> configValues = new ArrayList<>();

		for (ConfigCriteria configCrtieria : config) {

			ConfigurationValue configValue = new ConfigurationValue();

			Optional<ConfigurationValue> optionalValue = configValueRepo.findByConfigKey(configCrtieria.getField());

			System.out.println("into config value : " + configCrtieria.getField());

			if (optionalValue.isPresent()) {
				configValue = optionalValue.get();
			}

			configValue.setConfigKey(configCrtieria.getField());
			configValue.setValue(configCrtieria.getValue());
			configValues.add(configValue);
		}

		if (configValues.size() > 0) {
			System.out.println("into config value : " + configValues);
			return super.saveAll(configValues);
		}

		return configValues;

	}

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return entityID;
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ, Operations.READ_BY_ID, Operations.SAVE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return Commons.CORE.toString();
	}

}

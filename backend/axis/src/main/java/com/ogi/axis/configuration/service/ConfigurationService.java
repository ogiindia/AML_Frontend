package com.ogi.axis.configuration.service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.interfaces.AppConfigurations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.axis.configuration.modal.Configuration;

@Service
public class ConfigurationService extends BaseResolver<Configuration, UUID> implements AppConfigurations {

	private static final String entityID = "CONFIG";

	@GraphQLMutation(name = "saveOrUpdateConfig")
	public List<Configuration> addOrUpdateConfigurations(List<Configuration> configs) {
		System.out.println("Config List : " + configs.size());
		return configs;
	}

	@Override
	public Object getConfigByName(String name) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return entityID;
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ, Operations.READ_BY_ID, Operations.SAVE, Operations.DISABLE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return Commons.CORE.toString();
	}

}

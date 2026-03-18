package com.ogi.main.configurations.schemaConfigurations;

import java.util.Collections;
import java.util.List;

import org.hibernate.integrator.spi.Integrator;
import org.hibernate.jpa.boot.spi.IntegratorProvider;

public class CustomIntegratorProvider implements IntegratorProvider {

	@Override
	public List<Integrator> getIntegrators() {
		return Collections.singletonList(new MetadataIntegrator());
	}
}
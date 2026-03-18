package com.ogi.main.configurations.multiDatasource;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;

import com.ogi.factory.annotations.DataSource;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

public class EntityManagerForDomainFactoryBean implements FactoryBean<EntityManager>, InitializingBean {

	private final Class<?> domainType;
	private final ApplicationContext ctx;
	private EntityManager entityManager;

	public EntityManagerForDomainFactoryBean(Class<?> domainType, ApplicationContext ctx) {
		this.domainType = domainType;
		this.ctx = ctx;
	}

	@Override
	public EntityManager getObject() throws Exception {
		return this.entityManager;
	}

	@Override
	public Class<?> getObjectType() {
		return EntityManager.class;
	}

	@Override
	public boolean isSingleton() {
		return true; // single EntityManager per repository is okay here; repositories will manage
						// transactions
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		DataSource dsAnn = domainType.getAnnotation(DataSource.class);
		if (dsAnn == null) {
			throw new IllegalStateException("Domain " + domainType + " must be annotated with @DataSource");
		}
		String dsName = dsAnn.value();
		String emfBeanName = "emf__" + dsName;
		if (!ctx.containsBean(emfBeanName)) {
			throw new IllegalStateException("No EntityManagerFactory bean found for datasource '" + dsName
					+ "'. Add app.datasources." + dsName + ".* to configuration.");
		}
		EntityManagerFactory emf = ctx.getBean(emfBeanName, EntityManagerFactory.class);
		this.entityManager = emf.createEntityManager();
	}
}

package com.ogi.main.configurations.multiDatasource;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.RuntimeBeanReference;
import org.springframework.beans.factory.support.*;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import java.util.Properties;

/**
 * Registers canonical primary beans (dataSource, entityManagerFactory,
 * transactionManager) early in the lifecycle so Spring Boot's JPA autoconfig
 * will not create its own defaults.
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@Configuration
public class EarlyPrimaryRegistrar implements BeanDefinitionRegistryPostProcessor, EnvironmentAware {

	private Environment env;

	@Override
	public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
		String primaryUrl = env.getProperty("spring.datasource.url");
		if (primaryUrl == null)
			return; // nothing to register

		// 1) Register canonical dataSource
		if (!registry.containsBeanDefinition("dataSource")) {
			GenericBeanDefinition ds = new GenericBeanDefinition();
			ds.setBeanClass(DriverManagerDataSource.class);
			ds.getPropertyValues().add("url", primaryUrl);
			ds.getPropertyValues().add("username", env.getProperty("spring.datasource.username"));
			ds.getPropertyValues().add("password", env.getProperty("spring.datasource.password"));
			ds.getPropertyValues().add("driverClassName", env.getProperty("spring.datasource.driver-class-name"));
			ds.setPrimary(true);
			registry.registerBeanDefinition("dataSource", ds);
			// alias for internal ref
			if (!registry.isAlias("dataSource")) {
				registry.registerAlias("dataSource", "ds__primary");
			}
		} else {
			if (!registry.isAlias("dataSource"))
				registry.registerAlias("dataSource", "ds__primary");
			// ensure existing bean is primary
			BeanDefinition bd = registry.getBeanDefinition("dataSource");
			bd.setPrimary(true);
		}

		// 2) Register canonical entityManagerFactory
		if (!registry.containsBeanDefinition("entityManagerFactory")) {
			GenericBeanDefinition emf = new GenericBeanDefinition();
			emf.setBeanClass(LocalContainerEntityManagerFactoryBean.class);
			emf.getPropertyValues().add("dataSource", new RuntimeBeanReference("dataSource"));
			emf.getPropertyValues().add("persistenceUnitName", "primaryPU");
			emf.getPropertyValues().add("packagesToScan", new String[] {}); // will extend later
			emf.setPrimary(true);

			// minimal jpa properties
			Properties jpa = new Properties();
			String ddl = env.getProperty("spring.jpa.hibernate.ddl-auto");
			if (ddl != null)
				jpa.put("hibernate.hbm2ddl.auto", ddl);
			emf.getPropertyValues().add("jpaProperties", jpa);

			registry.registerBeanDefinition("entityManagerFactory", emf);
			if (!registry.isAlias("entityManagerFactory"))
				registry.registerAlias("entityManagerFactory", "emf__primary");
		} else {
			if (!registry.isAlias("entityManagerFactory"))
				registry.registerAlias("entityManagerFactory", "emf__primary");
			BeanDefinition existing = registry.getBeanDefinition("entityManagerFactory");
			existing.setPrimary(true);
		}

		// 3) Register canonical transactionManager
		if (!registry.containsBeanDefinition("transactionManager")) {
			GenericBeanDefinition tx = new GenericBeanDefinition();
			tx.setBeanClass(JpaTransactionManager.class);
			tx.getPropertyValues().add("entityManagerFactory", new RuntimeBeanReference("entityManagerFactory"));
			tx.setPrimary(true);
			registry.registerBeanDefinition("transactionManager", tx);
			if (!registry.isAlias("transactionManager"))
				registry.registerAlias("transactionManager", "tx__primary");
		} else {
			if (!registry.isAlias("transactionManager"))
				registry.registerAlias("transactionManager", "tx__primary");
			BeanDefinition existingTx = registry.getBeanDefinition("transactionManager");
			existingTx.setPrimary(true);
		}
	}

	@Override
	public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
		// no-op
	}

	@Override
	public void setEnvironment(Environment environment) {
		this.env = environment;
	}
}

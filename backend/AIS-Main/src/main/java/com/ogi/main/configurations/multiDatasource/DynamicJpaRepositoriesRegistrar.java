package com.ogi.main.configurations.multiDatasource;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.RuntimeBeanReference;
import org.springframework.beans.factory.support.*;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AssignableTypeFilter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

/**
 * This class is a BeanDefinitionRegistryPostProcessor (registered automatically
 * as bean) that scans for interfaces extending JpaRepository and registers a
 * bean definition for each using DynamicJpaRepositoryFactoryBean + a
 * corresponding EntityManagerForDomainFactoryBean.
 */
public class DynamicJpaRepositoriesRegistrar implements BeanDefinitionRegistryPostProcessor, ApplicationContextAware {

	private ApplicationContext ctx;

	@Override
	public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
		// scan for repository interfaces (simple approach: scan same base packages used
		// by auto-config)
		ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false,
				ctx.getEnvironment());
		scanner.addIncludeFilter(new AssignableTypeFilter(JpaRepository.class));

		String[] basePackages = ctx.getEnvironment().getProperty("app.multids.base-packages", String[].class);
		if (basePackages == null || basePackages.length == 0) {
			basePackages = new String[] { "" }; // full scan (heavy)
		}

		for (String base : basePackages) {
			Set<BeanDefinition> repos = scanner.findCandidateComponents(base);
			for (BeanDefinition bd : repos) {
				String repoInterfaceName = bd.getBeanClassName();
				try {
					Class<?> repoInterface = Class.forName(repoInterfaceName);
					// try to detect domain type from generics of the repo interface (best-effort)
					Class<?> domainType = RepositoryIntrospector.findDomainType(repoInterface);
					if (domainType == null)
						continue; // skip; can't resolve domain
					String beanName = repoInterface.getName();

					GenericBeanDefinition factoryBeanDef = new GenericBeanDefinition();
					factoryBeanDef.setBeanClass(
							org.springframework.data.jpa.repository.support.JpaRepositoryFactoryBean.class);
					factoryBeanDef.getConstructorArgumentValues().addIndexedArgumentValue(0, repoInterface);
					// create EntityManagerForDomainFactoryBean bean definition to supply
					// EntityManager
					GenericBeanDefinition emFb = new GenericBeanDefinition();
					emFb.setBeanClass(EntityManagerForDomainFactoryBean.class);
					emFb.getConstructorArgumentValues().addIndexedArgumentValue(0, domainType);
					emFb.getConstructorArgumentValues().addIndexedArgumentValue(1, ctx);

					String emBeanRefName = beanName + "__em";
					registry.registerBeanDefinition(emBeanRefName, emFb);

					// set property "entityManager" on repository factory
					factoryBeanDef.getPropertyValues().add("entityManager", new RuntimeBeanReference(emBeanRefName));
					factoryBeanDef.setAutowireMode(AbstractBeanDefinition.AUTOWIRE_BY_TYPE);
					registry.registerBeanDefinition(beanName, factoryBeanDef);

				} catch (ClassNotFoundException ex) {
					// ignore
				}
			}
		}
	}

	@Override
	public void postProcessBeanFactory(ConfigurableListableBeanFactory configurableListableBeanFactory)
			throws BeansException {
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.ctx = applicationContext;
	}
}

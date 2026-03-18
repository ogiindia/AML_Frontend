package com.ogi.graphql.utils;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.Metamodel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import com.ogi.factory.template.BaseResolver;

@Configuration
public class EntityScanner {

	@Autowired
	org.springframework.context.ApplicationContext context;

	@Autowired
	private LocalContainerEntityManagerFactoryBean entityManagerFactory;

	@Autowired
	EntityManager entityManager;

	public Set<Class<?>> getAllEntities() {

		return entityManagerFactory.getObject().getMetamodel().getEntities().stream()
				.peek(e -> System.out.println("entity : " + e.getName())).map(EntityType::getJavaType)
				.collect(Collectors.toSet());
	}

	public Set<EntityType<?>> getAllEntitiesByEntityTypes() {

		return entityManagerFactory.getObject().getMetamodel().getEntities();
	}

	public EntityType<?> getEntityTypeForEntity(Class<?> clazz) {

		EntityManagerFactory entityManagerFactory = entityManager.getEntityManagerFactory();

		Metamodel metaModal = entityManagerFactory.getMetamodel();

		return metaModal.entity(clazz);

	}

	@SuppressWarnings("rawtypes")
	public Map<String, BaseResolver> getAllBaseResolvers() {
		return context.getBeansOfType(BaseResolver.class);
	}

}

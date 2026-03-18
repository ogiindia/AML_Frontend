package com.ogi.graphql.utils;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
public class RepositoryProvider {

	@Autowired
	org.springframework.context.ApplicationContext context;

	@SuppressWarnings({ "unchecked" })
	public <T> Optional<JpaRepository<T, Long>> getRepoForEntity(String entityName) {

		return context.getBeansOfType(JpaRepository.class).values().stream().filter(repo -> {

			Class<?>[] interfaces = repo.getClass().getInterfaces();

			boolean ret = false;
			for (Class<?> iface : interfaces) {

				if (iface.getSimpleName().contains(entityName)) {
					ret = true;
				}
			}

			return ret;
		}).map(repo -> (JpaRepository<T, Long>) repo).findFirst();

	}

	@SuppressWarnings({ "unchecked" })
	public <T> Optional<JpaRepository<T, Long>> getRepoForEntity(Class<T> entityClass) {

		return context.getBeansOfType(JpaRepository.class).values().stream().filter(repo -> {

			Class<?>[] interfaces = repo.getClass().getInterfaces();

			boolean ret = false;
			for (Class<?> iface : interfaces) {

				if (iface.getSimpleName().contains(entityClass.getSimpleName())) {
					ret = true;
				}
			}

			return ret;
		}).map(repo -> (JpaRepository<T, Long>) repo).findFirst();

	}

}

package com.ogi.main.configurations.multiDatasource;

import org.springframework.data.repository.CrudRepository;

import java.lang.reflect.*;
import java.util.Arrays;

public class RepositoryIntrospector {
	public static Class<?> findDomainType(Class<?> repoInterface) {
		// traverse the generic interfaces to find a parameterized type that extends
		// CrudRepository or JpaRepository
		for (Type t : repoInterface.getGenericInterfaces()) {
			if (t instanceof ParameterizedType) {
				ParameterizedType pt = (ParameterizedType) t;
				Type raw = pt.getRawType();
				try {
					Class<?> rawClass = Class.forName(raw.getTypeName());
					if (CrudRepository.class.isAssignableFrom(rawClass)
							|| org.springframework.data.jpa.repository.JpaRepository.class.isAssignableFrom(rawClass)) {
						Type[] args = pt.getActualTypeArguments();
						if (args.length >= 1) {
							Type domain = args[0];
							if (domain instanceof Class<?>)
								return (Class<?>) domain;
							if (domain instanceof ParameterizedType)
								return (Class<?>) ((ParameterizedType) domain).getRawType();
						}
					}
				} catch (ClassNotFoundException ignored) {
				}
			}
		}
		// fallback: check superinterfaces
		for (Class<?> sup : repoInterface.getInterfaces()) {
			Class<?> res = findDomainType(sup);
			if (res != null)
				return res;
		}
		return null;
	}
}

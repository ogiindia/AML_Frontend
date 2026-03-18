package com.ogi.graphql.type.resolvers;

import java.lang.reflect.Parameter;
import java.lang.reflect.Type;
import java.util.List;

import com.ogi.graphql.interfaces.ArgumentResolver;

import graphql.schema.DataFetchingEnvironment;

public class ResolverManager {

	private final List<ArgumentResolver> resolvers;

	public ResolverManager(List<ArgumentResolver> resolvers) {
		this.resolvers = resolvers;
	}

	public Object resolve(Parameter parameter, DataFetchingEnvironment env) throws Exception {
		for (ArgumentResolver resolver : resolvers) {
//			System.out.println(resolver.getClass().getName() + " " + resolver.supports(parameter));
			if (resolver.supports(parameter)) {
				try {
//					System.out.println("into resolve : " + parameter.getName());
					return resolver.resolve(parameter, env, this);
				} catch (Exception e) {
					e.printStackTrace();
					throw e;
				} // pass manager for nested resolution
			}
		}
		throw new RuntimeException("No resolver found for parameter: " + parameter.getName());
	}

	public Object resolveType(Type type, Object rawValue) throws Exception {
		for (ArgumentResolver resolver : resolvers) {
			System.out.println("into resolver" + type);
			if (resolver.supportsType(type)) {
				System.out.println("supported by " + resolver.getClass().getName());
				return resolver.resolveType(type, rawValue, this);
			}
		}
		throw new RuntimeException("No resolver found for type: " + type.getTypeName());
	}
}

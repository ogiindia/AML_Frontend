package com.ogi.graphql.interfaces;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Parameter;
import java.lang.reflect.Type;

import com.ogi.graphql.type.resolvers.ResolverManager;

import graphql.schema.DataFetchingEnvironment;

public interface ArgumentResolver {
	boolean supports(Parameter parameter);

	boolean supportsType(Type type);

	Object resolveType(Type type, Object rawValue, ResolverManager manager) throws Exception;

	Object resolve(Parameter parameter, DataFetchingEnvironment env, ResolverManager manager)
			throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException,
			NoSuchMethodException, SecurityException, Exception;
}

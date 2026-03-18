package com.ogi.graphql.type.resolvers;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Parameter;
import java.lang.reflect.Type;

import com.ogi.factory.annotations.Param;
import com.ogi.graphql.interfaces.ArgumentResolver;
import com.ogi.graphql.utils.GraphQLUtils;

import graphql.schema.DataFetchingEnvironment;

public class PrimitiveResolver implements ArgumentResolver {

	private final GraphQLUtils utils;

	public PrimitiveResolver(GraphQLUtils utils) {
		this.utils = utils;
	}

	@Override
	public boolean supports(Parameter parameter) {
		System.out.println(parameter.getType().getCanonicalName());
		return utils.isprimitive(parameter.getType()) || parameter.getType().equals(Object.class);
	}

	@Override
	public Object resolve(Parameter parameter, DataFetchingEnvironment env, ResolverManager manager)
			throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException,
			NoSuchMethodException, SecurityException {
		// TODO Auto-generated method stub

		Object rawValue = null;

		Object convertedValue = null;

		if (parameter.isAnnotationPresent(Param.class)
				&& env.containsArgument(parameter.getAnnotation(Param.class).value())) {
			convertedValue = env.getArgument(parameter.getAnnotation(Param.class).value());
//			convertedValue = env.getArgument(parameter.getAnnotation(Param.class).value());
		}

		else if (env.containsArgument(parameter.getName())) {
			convertedValue = env.getArgument(parameter.getName());
		} else {
			convertedValue = utils.getDefaultValue(parameter.getType());
		}

		return convertedValue;

	}

	@Override
	public boolean supportsType(Type type) {
		// TODO Auto-generated method stub
		if (type instanceof Class<?>) {
			return utils.isprimitive((Class<?>) type) || type.equals(Object.class);
		} else {
			return false;
		}
	}

	@Override
	public Object resolveType(Type type, Object rawValue, ResolverManager manager) {
		System.out.println(rawValue);
		return rawValue;
	}

}

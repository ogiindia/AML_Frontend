package com.ogi.graphql.type.resolvers;

import java.lang.reflect.Parameter;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.management.RuntimeErrorException;

import com.ogi.factory.pojo.FilterCriteria;
import com.ogi.graphql.interfaces.ArgumentResolver;
import com.ogi.graphql.utils.GraphQLUtils;

import graphql.schema.DataFetchingEnvironment;

public class WrapperResolver implements ArgumentResolver {

	private final GraphQLUtils utils;

	public WrapperResolver(GraphQLUtils utils) {
		this.utils = utils;
	}

	@Override
	public boolean supports(Parameter parameter) {
		System.out.println(parameter.getName() + " " + parameter.getType());
		// TODO Auto-generated method stub
		return utils.isWrapper(parameter.getType()); // maps List , Set
	}

	@Override
	public Object resolve(Parameter parameter, DataFetchingEnvironment env, ResolverManager manager) throws Exception {

		Type type = parameter.getParameterizedType();
		Class<?> innerType = utils.unwrap(type); // e.g., extract T from List<T>

		if (env.containsArgument(parameter.getName())) {
			Object rawValue = env.getArgument(parameter.getName());

			return this.ResolveWrapper(rawValue, manager, innerType, type);

		} else {
			return utils.getDefaultValue(parameter.getType());
		}

	}

	@Override
	public boolean supportsType(Type type) {

		if (type instanceof Class<?>) {
			return utils.isWrapper((Class<?>) type);
		} else if (type instanceof ParameterizedType) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public Object resolveType(Type type, Object rawValue, ResolverManager manager) throws Exception {

		Class<?> innerType = utils.unwrap(type); // e.g., extract T from List<T>
		return this.ResolveWrapper(rawValue, manager, innerType, type);

	}

	public Object ResolveWrapper(Object rawValue, ResolverManager manager, Class<?> innerType, Type type)
			throws Exception {

		if (type instanceof List) {

			List<?> rawList = (List<?>) rawValue;
			List<Object> resolvedList = new ArrayList<>();

			for (Object item : rawList) {
				Object resolvedItem = manager.resolveType(innerType, item); // delegate to primitive or pojo // resolver
				resolvedList.add(resolvedItem);
			}
			return resolvedList;
		} else if (type instanceof Set) {
			System.out.println("into set extraction" + type.getTypeName());
			List<?> rawList = (List<?>) rawValue;
			Set<Object> resolvedList = new HashSet<Object>();

			for (Object item : rawList) {
				Object resolvedItem = manager.resolveType(innerType, item);
				resolvedList.add(resolvedItem);
			}

			return resolvedList;

		} else if (type instanceof ParameterizedType) {

			ParameterizedType pt = (ParameterizedType) type;
			Type rawType = pt.getRawType();

			if (rawType instanceof Class<?> && Set.class.isAssignableFrom((Class<?>) rawType)) {
				List<?> rawList = (List<?>) rawValue;
				Set<Object> resolvedList = new HashSet<Object>();

				for (Object item : rawList) {
					Object resolvedItem = manager.resolveType(innerType, item);
					resolvedList.add(resolvedItem);
				}

				return resolvedList;
			} else if (rawType instanceof Class<?> && List.class.isAssignableFrom((Class<?>) rawType)) {
				List<?> rawList = (List<?>) rawValue;

				List<Object> resolvedList = new ArrayList<Object>();

				for (Object item : rawList) {
					Object resolvedItem = manager.resolveType(innerType, item);
					resolvedList.add(resolvedItem);
				}

				return resolvedList;
			}

			else {
				throw new RuntimeException("No an valid type  found for parameter: " + rawType.getTypeName());
			}
		} else {
			throw new RuntimeException("No Wrapper type  found for parameter: " + type.getTypeName());
		}

	}

}

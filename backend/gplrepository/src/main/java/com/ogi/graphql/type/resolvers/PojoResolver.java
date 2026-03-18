package com.ogi.graphql.type.resolvers;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Parameter;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.Id;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.factory.components.SpringContext;
import com.ogi.graphql.interfaces.ArgumentResolver;
import com.ogi.graphql.utils.GraphQLUtils;

import graphql.schema.DataFetchingEnvironment;

public class PojoResolver implements ArgumentResolver {

	private final GraphQLUtils utils;

	ObjectMapper obj;

	private static final ThreadLocal<Map<String, Object>> referenceCache = ThreadLocal.withInitial(HashMap::new);

//	static {
//
//		obj.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
//		obj.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//		obj.enable(SerializationFeature.INDENT_OUTPUT);
//		obj.registerModule(new Hibernate)
//
//	}

	public PojoResolver(GraphQLUtils utils) {

		this.utils = utils;
		obj = SpringContext.getBean(ObjectMapper.class);
	}

	@Override
	public boolean supports(Parameter parameter) {
		// TODO Auto-generated method stub
		return utils.isPojoBean(parameter.getType());
	}

	@Override
	public boolean supportsType(Type type) {
		// TODO Auto-generated method stub
		if (type instanceof Class<?>) {
			return utils.isPojoBean((Class<?>) type);
		} else {
			return false;
		}
	}

	@Override
	public Object resolveType(Type type, Object rawValue, ResolverManager manager) {
		// TODO Auto-generated method stub

		if (type instanceof Class<?>) {
			return fromMap((Map<String, Object>) rawValue, (Class<?>) type, manager);

		}
		return null;

	}

	@Override
	public Object resolve(Parameter parameter, DataFetchingEnvironment env, ResolverManager manager)
			throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException,
			NoSuchMethodException, SecurityException {

//		System.out.println("into class " + parameter.getType().getTypeName());
//		System.out.println("into map " + env.getArgument(parameter.getName()).getClass().getCanonicalName());

		Object convertedValue = null;

		if (parameter.isAnnotationPresent(com.ogi.factory.annotations.Param.class)
				&& env.containsArgument(parameter.getAnnotation(com.ogi.factory.annotations.Param.class).value())) {
			convertedValue = fromMap(
					env.getArgument(parameter.getAnnotation(com.ogi.factory.annotations.Param.class).value()),
					parameter.getType(), manager);

		}
		if (env.containsArgument(parameter.getName())) {

			convertedValue = fromMap(env.getArgument(parameter.getName()), parameter.getType(), manager);

		} else {
			convertedValue = utils.getDefaultValue(parameter.getType());
		}

		return convertedValue;
	}

	public static <T> T fromMap(Map<String, Object> map, Class<T> clazz, ResolverManager manager) {
		return fromMap(map, clazz, referenceCache.get(), manager);
	}

	private static <T> T fromMap(Map<String, Object> map, Class<T> clazz, Map<String, Object> cache,
			ResolverManager manager) {
		try {

			// check if reference is worth building
			if(map.isEmpty()) return null; //no not build if child is empty

			
			// Try to find ID field firstz
			Object id = map.get("id");
			String key = clazz.getName() + ":" + id;

			// If already built, return it immediately
			if (id != null && cache.containsKey(key)) {
				return (T) cache.get(key);
			}

			T instance = clazz.getDeclaredConstructor().newInstance();
			if (id != null)
				cache.put(key, instance);

			while (clazz != null) {
				for (Field field : clazz.getDeclaredFields()) {
					field.setAccessible(true);
					Object value = map.get(field.getName());
//					System.out.println(field.getName() + " " + value);
					if (value == null)
						continue;

					Class<?> type = field.getType();
					Type genericType = field.getGenericType();

					Object data = manager.resolveType(genericType, value);
//					System.out.println(field.getName() + " " + data);
					field.set(instance, data);
				}

				clazz = (Class<T>) clazz.getSuperclass();
			}

//			for (Field field : clazz.getDeclaredFields()) {
//				field.setAccessible(true);
//				
//
//			}
			return instance;
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Error mapping to " + clazz.getSimpleName(), e);
		}
	}
}

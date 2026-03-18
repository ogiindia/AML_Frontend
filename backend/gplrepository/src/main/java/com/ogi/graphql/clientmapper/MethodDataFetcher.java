package com.ogi.graphql.clientmapper;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.graphql.interfaces.ArgumentResolver;
import com.ogi.graphql.type.resolvers.PojoResolver;
import com.ogi.graphql.type.resolvers.PrimitiveResolver;
import com.ogi.graphql.type.resolvers.ResolverManager;
import com.ogi.graphql.type.resolvers.WrapperResolver;
import com.ogi.graphql.utils.GraphQLUtils;

import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;

public class MethodDataFetcher implements DataFetcher<Object> {

	private final Object target;
	private final Method method;

	public MethodDataFetcher(Object target, Method method) {
		this.target = target;
		this.method = method;

	}

	@Override
	public Object get(DataFetchingEnvironment environment) throws Exception {
		GraphQLUtils utils = new GraphQLUtils();

//
		List<ArgumentResolver> resolvers = List.of(new PrimitiveResolver(utils), new WrapperResolver(utils),
				new PojoResolver(utils));

		ResolverManager manager = new ResolverManager(resolvers);

		Object[] args = extractArguments(environment, method, manager);
//
//		Object[] targs = Arrays.stream(method.getParameters()).map(param -> {
//			for (ArgumentResolver resolver : resolvers)
//				try {
//
//					if (resolver.supports(param)) {
//						Object res;
//						res = resolver.resolve(param, environment);
//					}
//
//				} catch (Exception e) {
//					e.printStackTrace();
//				}
//			throw new RuntimeException("No resolver for parameter: " + param.getName());
//		}).toArray();
//
//		for (Object object : targs) {
//			System.out.println("obj class" + object.getClass().getName());
//		}

		System.out.println("method name :" + method.getName());
		return method.invoke(target, args);
	}

	private Object[] extractArguments(DataFetchingEnvironment environment, Method method, ResolverManager manager)
			throws Exception {
		Parameter[] parameters = method.getParameters();
		Object[] args = new Object[parameters.length];

		GraphQLUtils utils = new GraphQLUtils();

		for (int i = 0; i < parameters.length; i++) {
			if (utils.isIgnorable(parameters[i]))
				continue;

//			System.out.println(parameters[i].getType().getName());
//			System.out.println("isObject " + parameters[i].getType().equals(Object.class));

			// generic type from baseResolver
			if (parameters[i].getType().equals(Object.class) && !parameters[i].getName().equals("id")) {
				Class<?> entityType = inferEntity(0);
				Parameter param = parameters[i];
				if (environment.containsArgument(param.getName())) {
					Object rawValue = environment.getArgument(param.getName());
					args[i] = manager.resolveType(entityType, rawValue);
				}
			} else {
				args[i] = manager.resolve(parameters[i], environment);

			}

		}

		return args;
	}

	private Object[] extractArguments(DataFetchingEnvironment environment, Method method, GraphQLUtils utils) {

		return extractArgumentsV2(environment, method, utils);
//		return Arrays.stream(method.getParameters()).peek(p -> System.out.println("paramters : " + p))
//				.map(param -> environment.getArgument(param.getName())).toArray();
	}

	private Object[] extractArgumentsV2(DataFetchingEnvironment environment, Method method, GraphQLUtils utils) {

		Object[] args = new Object[method.getParameterCount()];

		for (int i = 0; i < method.getParameterCount(); i++) {

			Parameter parameter = method.getParameters()[i];

			// for generic Types Entity Bean and the Primary ID
			if (parameter.getType().equals(Object.class)) {

				try {
					Class<?> entityType = inferEntity(0);
//					System.out.println("entity class Type : " + entityType.getName());
//					System.out.println("parameter name : " + parameter.getName());

					Map<String, Object> maps = new HashMap<>();

					if (environment.containsArgument(parameter.getName())) {
						if (environment.getArgument(parameter.getName()) instanceof Map) {
							maps = environment.getArgument(parameter.getName());
							args[i] = utils.mapToBean(maps, entityType);

						} else {
							args[i] = environment.getArgument(parameter.getName());
						}
					} else {
						maps = environment.getArguments();
						args[i] = utils.mapToBean(maps, entityType);

					}

					// args[i] = utils.mapToBean(maps, entityType);
					continue;
				} catch (Exception e) {
					e.printStackTrace();
				}

			}

			if (utils.isPojoBean(parameter.getType())) {
				System.out.println("it is a pojo class");
				System.out.println(parameter.getName() + " Type " + parameter.getType());
				System.out.println("parameter name : " + parameter.getName());

				try {

					Map<String, Object> maps = new HashMap<>();

					if (environment.containsArgument(parameter.getName())) {
						if (environment.getArgument(parameter.getName()) instanceof Map) {
							maps = environment.getArgument(parameter.getName());
						} else {
							args[i] = environment.getArgument(parameter.getName());
						}
					} else {
						maps = environment.getArguments();
					}

					args[i] = utils.mapToBean(maps, parameter.getType());
				} catch (Exception e) {
					e.printStackTrace();
				}

				// have to work on it how to create new object and send it to the method.
			} else if (utils.isWrapper(parameter.getType())) {
				try {
					System.out.println("into wrapper class");
					Class<?> ListparamType = utils.unwrap(parameter.getParameterizedType());
					System.out.println("inner object " + ListparamType);

					System.out.println(environment.getArguments());

					Map<String, Object> maps = new HashMap<>();
					List<Map<String, Object>> arry = new ArrayList<>();

					System.out.println("searching for parameter : " + parameter.getName());
					if (environment.containsArgument(parameter.getName())) {
						if (utils.isArray(environment.getArgument(parameter.getName()))) {
							arry = environment.getArgument(parameter.getName());
						} else {
							if (environment.getArgument(parameter.getName()) instanceof Map) {
								maps = environment.getArgument(parameter.getName());
							} else {
								args[i] = environment.getArgument(parameter.getName());
							}
						}
					} else {
						if (environment.getArgument(parameter.getName()) instanceof Map) {
							maps = environment.getArgument(parameter.getName());
						} else {
							args[i] = environment.getArgument(parameter.getName());
						}
					}

					if (maps != null && !maps.isEmpty()) {
						args[i] = utils.mapToBean(maps, parameter.getType());
					} else {
						System.out.println("process via array : " + arry.size());

						List<Object> list = new ArrayList<>();
						for (Map<String, Object> map : arry) {
							list.add(utils.mapToBean(map, ListparamType));
						}

						args[i] = list;

					}

				} catch (Exception e) {
					e.printStackTrace();
				}

// have to work for list input processing 
			} else {
				System.out.println("it is not a pojoclass");
				System.out.println(parameter.getName() + " Type " + parameter.getType());
				args[i] = environment.getArgument(parameter.getName());
			}

		}
		return args;
	}

	private Class<?> inferEntity(int i) {
		Type GenericSuperClass = target.getClass().getSuperclass().getGenericSuperclass();

		if (GenericSuperClass instanceof ParameterizedType) {
			Type[] typeArguments = ((ParameterizedType) GenericSuperClass).getActualTypeArguments();
			System.out.println(typeArguments.length);

			if (typeArguments.length > 0 && typeArguments[0] instanceof Class) {
				return (Class<?>) typeArguments[i];
			}

		}
		throw new IllegalArgumentException("Cannot find the superclass entity");
	}
}

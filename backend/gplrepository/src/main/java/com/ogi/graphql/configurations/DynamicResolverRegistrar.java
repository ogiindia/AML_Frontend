package com.ogi.graphql.configurations;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.springframework.aop.framework.AopProxyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLOverride;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.pojo.PagedResult;
import com.ogi.graphql.clientmapper.MethodDataFetcher;
import com.ogi.graphql.type.GraphqlTypeManager;
import com.ogi.graphql.utils.EntityScanner;
import com.ogi.graphql.utils.GraphQLUtils;

import graphql.schema.DataFetcher;
import graphql.schema.GraphQLArgument;
import graphql.schema.GraphQLFieldDefinition;
import graphql.schema.GraphQLList;
import graphql.schema.GraphQLNonNull;
import graphql.schema.GraphQLObjectType;
import graphql.schema.GraphQLObjectType.Builder;
import graphql.schema.GraphQLOutputType;
import graphql.schema.GraphQLTypeReference;

@Component
public class DynamicResolverRegistrar {

	private final GraphQLUtils graphQLUtils;

	@Autowired
	EntityScanner entityScanner;

	@Autowired
	GraphqlTypeManager typeManager;

	DynamicResolverRegistrar(GraphQLUtils graphQLUtils) {
		this.graphQLUtils = graphQLUtils;
	}

	public Builder createObjectTypeWithAnnotations(Builder queryBuilder, Object targetInstance, Class<?> entityClass,
			GraphQLObjectType entityType) {
		return createObjectTypeWithAnnotations(queryBuilder, targetInstance, entityClass, entityType, true, false);
	}

	public Builder createObjectTypeWithAnnotations(Builder queryBuilder, Object targetInstance, Class<?> entityClass,
			GraphQLObjectType entityType, boolean isQuery, boolean isEntityPresent) {

		Class<?> targetClass = AopProxyUtils.ultimateTargetClass(targetInstance);

		for (Method method : targetClass.getDeclaredMethods()) {
			if (isQuery(method, isQuery)) {
				// System.out.println("methods : " + method.getName());
				String fieldName = getFieldNameFromAnnotation(method);

				DataFetcher<Object> dataFetcher = new MethodDataFetcher(targetInstance, method);

				java.util.List<GraphQLArgument> arguments = typeManager.createGraphQLArguments(method);

				System.out.println("Method Name : " + method.getName());

				System.out.println("Method return Type : " + method.getReturnType());
				System.out.println("Method return Type generic : " + method.getGenericReturnType());
				System.out.println("entity type : " + entityType.getName());
				System.out.println("is return type is equal to entity : "
						+ method.getReturnType().getSimpleName().equals(entityType.getName()));

//				System.out.println("is primitive ? " + graphQLUtils.isprimitive(method.getReturnType()));

//				GraphQLOutputType outType = typeManager.getGraphqlReturnType(method.getReturnType(), entityType);

				System.out.println(
						"is the return is wrapper ? " + graphQLUtils.isPresenceWrapper(method.getReturnType()));

				if (graphQLUtils.isCollectionWrapper(method.getReturnType())
						|| graphQLUtils.isPresenceWrapper(method.getReturnType())) {

					System.out.println("inner type : " + graphQLUtils.unwrap(method.getGenericReturnType()));
					System.out.println("is inner type matching ? " + entityType.getName()
							.equals(graphQLUtils.unwrap(method.getGenericReturnType()).getSimpleName()));

					Class<?> clazz = graphQLUtils.unwrap(method.getGenericReturnType());

					if (entityType.getName().equals(clazz.getSimpleName())) {
						System.out.println("into entity exists");
						queryBuilder
								.field(registerResolver(fieldName, entityType.getName(), arguments, dataFetcher, true))
								.build();
					} else if (typeManager.getObjectRegistry().containsKey(clazz.getSimpleName())) {
						System.out.println("into object registry exists");
						queryBuilder
								.field(registerResolver(fieldName, clazz.getSimpleName(), arguments, dataFetcher, true))
								.build();

					} else if (graphQLUtils.isPojoBean(clazz)) {
						System.out.println("into inner pojo bean which not exists in any entry");

						GraphQLOutputType outType = typeManager.buildGraphqlType(clazz);
						queryBuilder.field(registerResolver(fieldName, outType, arguments, dataFetcher, true)).build();

					}

					else {
						System.out.println("into not matching any return type ");
						GraphQLOutputType outType = typeManager.getGraphqlReturnType(clazz, entityType, false);

						queryBuilder.field(registerResolver(fieldName, outType, arguments, dataFetcher, true)).build();
					}

//					}else if (typeManager.getObjectRegistry().containsKey(targetClass))
//					else if() //check inner object already exists in objectRegistry
				} else if (method.getReturnType().equals(PagedResult.class)) {
					System.out.println("into page type");
					Class<?> innerType = graphQLUtils.unwrap(method.getGenericReturnType());
					System.out.println("inner class : " + innerType.getCanonicalName());
					if (typeManager.getPagedregistry()
							.containsKey(PagedResult.class.getSimpleName() + innerType.getSimpleName())) {
						queryBuilder.field(registerResolver(fieldName,
								PagedResult.class.getSimpleName() + innerType.getSimpleName(), arguments, dataFetcher,
								false)).build();
					} else {

						// for now integrating it only for already available one.
						if (typeManager.getObjectRegistry().containsKey(innerType.getSimpleName())) {

							GraphQLObjectType entity = typeManager.getObjectRegistry().get(innerType.getSimpleName());

							GraphQLOutputType outType = GraphQLNonNull
									.nonNull(typeManager.buildGraphqlType(PagedResult.class, entity));
							queryBuilder.field(registerResolver(fieldName, outType, arguments, dataFetcher, false))
									.build();
						}
					}
				}

				else if (graphQLUtils.isprimitive(method.getReturnType())) {
					System.out.println("entity is primitive");
					GraphQLOutputType outType = typeManager.getGraphqlReturnType(method.getGenericReturnType(),
							entityType, false);

					queryBuilder.field(registerResolver(fieldName, outType, arguments, dataFetcher)).build();

				} else if (typeManager.getObjectRegistry().containsKey(method.getReturnType().getSimpleName())) {
					System.out.println("return type already exists");
					queryBuilder.field(
							registerResolver(fieldName, method.getReturnType().getSimpleName(), arguments, dataFetcher))
							.build();

				} else {
					System.out.println("into not matching any return type ");
					GraphQLOutputType outType = typeManager.getGraphqlReturnType(method.getGenericReturnType(),
							entityType, false);

					queryBuilder.field(registerResolver(fieldName, outType, arguments, dataFetcher)).build();

				}

			}
		}

		return queryBuilder;
	}

	private static boolean isQuery(Method method, boolean isQuery) {
		if (isQuery) {
			return method.isAnnotationPresent(GraphQLQuery.class);
		} else {
			return method.isAnnotationPresent(GraphQLMutation.class);
		}
	}

	private static String getFieldNameFromAnnotation(Method method) {
		if (method.isAnnotationPresent(GraphQLQuery.class)) {
			GraphQLQuery query = method.getAnnotation(GraphQLQuery.class);

			return query.name().isEmpty() ? method.getName() : query.name();
		} else if (method.isAnnotationPresent(GraphQLMutation.class)) {
			GraphQLMutation mutation = method.getAnnotation(GraphQLMutation.class);
			return mutation.name().isEmpty() ? method.getName() : mutation.name();
		}

		return method.getName();
	}

	public GraphQLFieldDefinition registerResolver(String name, GraphQLOutputType returnType,
			DataFetcher<?> dataFetcher) {
		return registerResolver(name, returnType, null, dataFetcher, false);
	}

	public GraphQLFieldDefinition registerResolver(String name, String returnType, DataFetcher<?> dataFetcher) {
		return registerResolver(name, returnType, null, dataFetcher);
	}

	public GraphQLFieldDefinition registerResolver(String name, GraphQLOutputType graphQLOutputType) {
		return registerResolver(name, graphQLOutputType, null, null, false);
	}

	public GraphQLFieldDefinition registerResolver(String name, GraphQLOutputType graphQLOutputType,
			java.util.List<GraphQLArgument> arguments, DataFetcher<?> dataFetcher) {
		return registerResolver(name, graphQLOutputType, arguments, dataFetcher, false);
	}

	public GraphQLFieldDefinition registerResolver(String name, GraphQLOutputType returnType,
			java.util.List<GraphQLArgument> arguments) {
		return registerResolver(name, returnType, arguments, null, false);
	}

	@SuppressWarnings("deprecation")
	public GraphQLFieldDefinition registerResolver(String name, GraphQLOutputType graphQLOutputType,
			java.util.List<GraphQLArgument> arguments, DataFetcher<?> dataFetcher, boolean isWrapper) {

//		graphql.schema.GraphQLFieldDefinition.Builder field = GraphQLFieldDefinition.newFieldDefinition().name(name)
//				.type(graphQLOutputType);

		graphql.schema.GraphQLFieldDefinition.Builder field = GraphQLFieldDefinition.newFieldDefinition().name(name)
				.type(isWrapper ? GraphQLList.list(graphQLOutputType) : graphQLOutputType);

		if (arguments != null && arguments.size() > 0)
			field = field.arguments(arguments);

		if (dataFetcher != null)
			field = field.dataFetcher(dataFetcher);

		return field.build();
	}

	public GraphQLFieldDefinition registerResolver(String name, String graphQLOutputType,
			java.util.List<GraphQLArgument> arguments, DataFetcher<?> dataFetcher) {

		graphql.schema.GraphQLFieldDefinition.Builder field = GraphQLFieldDefinition.newFieldDefinition().name(name)
				.type(GraphQLTypeReference.typeRef(graphQLOutputType));

		if (arguments != null && arguments.size() > 0)
			field = field.arguments(arguments);

		if (dataFetcher != null)
			field = field.dataFetcher(dataFetcher);

		return field.build();
	}

	public GraphQLFieldDefinition registerResolver(String name, String graphQLOutputType,
			java.util.List<GraphQLArgument> arguments, DataFetcher<?> dataFetcher, boolean wrapper) {

		graphql.schema.GraphQLFieldDefinition.Builder field = GraphQLFieldDefinition.newFieldDefinition().name(name)
				.type(wrapper ? GraphQLList.list(GraphQLTypeReference.typeRef(graphQLOutputType))
						: GraphQLTypeReference.typeRef(graphQLOutputType));

		if (arguments != null && arguments.size() > 0)
			field = field.arguments(arguments);

		if (dataFetcher != null)
			field = field.dataFetcher(dataFetcher);

		return field.build();
	}

	public Method getMethod(Object bean, String methodName) {

		Class<?> targetClass = AopProxyUtils.ultimateTargetClass(bean);

		List<Method> methods = new ArrayList<>();
		for (Method method : targetClass.getMethods()) {

			if (method.getName().trim().equals(methodName.trim()) && !method.isBridge() && !method.isSynthetic()) {
				methods.add(method);

			}
		}

		// debugging purpose
//		System.out.println("method size :" + methods.size());
//
//		for (Method method : methods) {
//			System.out.println(
//					"method name : " + method.getName() + "declared in " + method.getDeclaringClass().getName());
//			System.out.println("is bridge ? " + method.isBridge());
//			System.out.println("is synthetic ? " + method.isSynthetic());
//			for (Parameter pr : method.getParameters()) {
//				System.out.println("parameter name : " + pr.getName());
//
//			}
//		}

		if (methods.size() == 1)
			return methods.get(0);

		for (Method method : methods) {
//
//			for (Annotation ann : method.getAnnotations()) {
//				System.out.println(ann.annotationType().getSimpleName());
//			}

			// is it needed ?
			if (method.isAnnotationPresent(GraphQLOverride.class)) {
				return method;
			}
		}

		return (methods != null || !methods.isEmpty()) ? methods.get(0) : null;
	}

}

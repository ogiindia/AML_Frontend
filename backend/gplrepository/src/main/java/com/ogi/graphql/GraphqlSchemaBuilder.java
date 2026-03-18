package com.ogi.graphql;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ogi.factory.enums.Operations;
import com.ogi.factory.pojo.FilterCriteria;
import com.ogi.factory.pojo.SortCriteria;
import com.ogi.factory.template.BaseResolver;
import com.ogi.graphql.clientmapper.CommonMethodConstructor;
import com.ogi.graphql.clientmapper.MethodDataFetcher;
import com.ogi.graphql.configurations.DynamicResolverRegistrar;
import com.ogi.graphql.exception.GlobalGraphqlExceptionHandler;
import com.ogi.graphql.type.GraphqlTypeManager;
import com.ogi.graphql.utils.EntityScanner;
import com.ogi.graphql.utils.GraphQLUtils;
import com.ogi.graphql.utils.RepositoryProvider;

import graphql.GraphQL;
import graphql.Scalars;
import graphql.schema.DataFetcher;
import graphql.schema.GraphQLArgument;
import graphql.schema.GraphQLFieldDefinition;
import graphql.schema.GraphQLInputObjectType;
import graphql.schema.GraphQLNonNull;
import graphql.schema.GraphQLObjectType;
import graphql.schema.GraphQLObjectType.Builder;
import graphql.schema.GraphQLOutputType;
import graphql.schema.GraphQLSchema;
import graphql.schema.GraphQLType;
import graphql.schema.idl.SchemaPrinter;

@Configuration
public class GraphqlSchemaBuilder {

	private final GraphQLUtils graphQLUtils;

	@Autowired
	RepositoryProvider repoProvider;

	@Autowired
	EntityScanner entityScanner;

	@Autowired
	DynamicResolverRegistrar registry;

	private GraphQLSchema schema;

	@Autowired
	GraphqlTypeManager typeManager;

	@Autowired
	EntityManager entityManager;

	@Autowired
	CommonMethodConstructor methodMaps;

	@Autowired
	GlobalGraphqlExceptionHandler globalHandler;

	GraphqlSchemaBuilder(GraphQLUtils graphQLUtils) {
		this.graphQLUtils = graphQLUtils;
	}

	@SuppressWarnings("rawtypes")
	@PostConstruct
	public void buildSchema() {
		GraphQLObjectType.Builder queryBuilder = GraphQLObjectType.newObject().name("Query");
		GraphQLObjectType.Builder mutationBuilder = GraphQLObjectType.newObject().name("Mutation");

		Map<String, BaseResolver> services = entityScanner.getAllBaseResolvers();
		graphql.schema.GraphQLSchema.Builder builder = GraphQLSchema.newSchema();

		System.out.println("Total Services " + services.size());

		// commonInputTypes which can be recursively used by all services
		GraphQLInputObjectType sortCriteriaGQLType = typeManager.buildBeanInput(SortCriteria.class);
		GraphQLInputObjectType filterCriteriaGQLType = typeManager.buildBeanInput(FilterCriteria.class);

		for (Entry<String, BaseResolver> entry : services.entrySet()) {
			String serivceName = entry.getKey();
			System.out.println("Service Names  :" + serivceName);
			BaseResolver<?, ?> service = entry.getValue();

			EntityType<?> entityType = service.getEntityTypeMetaData();
			String entityName = entityType.getName();

			GraphQLObjectType graphQlType = null;
			// if already exists ? have to modify it again....
			// for entity input types

			Boolean isentityPresent = false;
			if (typeManager.getObjectRegistry().containsKey(entityName)) {
				isentityPresent = true;
			}

			graphQlType = typeManager.buildGraphqlType(entityType);
			System.out.println(graphQlType);

			// construct common methods for both query and mutations.
			constructCommonMethods(queryBuilder, graphQlType, entityName, service, isentityPresent);
			constructCommonMethods(mutationBuilder, graphQlType, entityName, service, isentityPresent);

			queryBuilder = registry.createObjectTypeWithAnnotations(queryBuilder, service, service.getEntityType(),
					graphQlType, true, isentityPresent);

			mutationBuilder = registry.createObjectTypeWithAnnotations(mutationBuilder, service,
					service.getEntityType(), graphQlType, false, isentityPresent);

			if (!isentityPresent) { // for safety adding it in case it is not included in the schema...
				builder.additionalType(graphQlType);
			}

		}

		if (queryBuilder.build().getFields().size() <= 0 && mutationBuilder.build().getFields().size() <= 0) {
			queryBuilder.field(GraphQLFieldDefinition.newFieldDefinition().name("demo")
					.type(GraphQLNonNull.nonNull(Scalars.GraphQLString)).build());
		}

		GraphQLObjectType query = queryBuilder.build();
		GraphQLObjectType mutation = mutationBuilder.build();

		builder.additionalType(sortCriteriaGQLType); // adding custom and recursive been as additional types
		builder.additionalType(filterCriteriaGQLType);

		if (query.getFields().size() > 0) {
			builder = builder.query(query);
		}

		if (mutation.getFields().size() > 0) {
			builder = builder.mutation(mutation);
		}

		schema = builder.build();

	}

//	@SuppressWarnings({ "unused" })
//	private void constructCommonMethods(Builder builder, GraphQLObjectType graphqlQLType, String entityName,
//			BaseResolver<?, ?> service) {
//
//		List<String> methodList = methodMaps.getMethodsList();
//
//		if (methodList.size() > 0) {
//
//			for (String key : methodList) {
//
//				if (builder.build().getName().equals("Query") && !methodMaps.isQuery(key))
//					continue;
//				if (builder.build().getName().equals("Mutation") && methodMaps.isQuery(key))
//					continue;
//
//				String name = key.replace("#entity#", entityName);
//
//				Class<?> returnType = methodMaps.getReturnType(key);
//				GraphQLOutputType outType = typeManager.getGraphqlReturnType(returnType, graphqlQLType);
//
//				String methodName = methodMaps.getMethodName(key);
//
//				Method method = registry.getMethod(service, methodMaps.getMethodName(key));
//				List<GraphQLArgument> arguments = typeManager.createCustomGraphQLArgumentsForCommonMethods(method,
//						service.getEntityType(), methodMaps.getArguments(key), methodMaps.isQuery(key));
//
//				DataFetcher<Object> dataFetcher = null;
//				if (method != null) {
//					dataFetcher = new MethodDataFetcher(service, method);
//				}
//
//				arguments.stream().peek(e -> System.out.println("args :" + e.getName()));
//
//				if (arguments.size() > 0) {
//					builder.field(registry.registerResolver(name, outType, arguments, dataFetcher));
//				} else {
//					builder.field(registry.registerResolver(name, outType, dataFetcher));
//				}
//			}
//
//		}
//
//	}

	@SuppressWarnings({ "unused" })
	private void constructCommonMethods(Builder builder, GraphQLObjectType graphqlQLType, String entityName,
			BaseResolver<?, ?> service, boolean isEntitypresent) {

		Set<Operations> methodList = service.getSupportedOperations();

		if (methodList != null && methodList.size() > 0) {

			for (Operations key : methodList) {

				if (builder.build().getName().equals("Query") && !methodMaps.isQuery(key))
					continue;
				if (builder.build().getName().equals("Mutation") && methodMaps.isQuery(key))
					continue;

				String name = methodMaps.getKeyName(key).replace("#entity#", entityName);

				Class<?> returnType = methodMaps.getReturnType(key);

				String methodName = methodMaps.getMethodName(key);

				Method method = registry.getMethod(service, methodMaps.getMethodName(key));
				System.out.println(method.getParameterCount());

				List<GraphQLArgument> arguments = typeManager.createCustomGraphQLArgumentsForCommonMethods(method,
						service.getEntityType(), methodMaps.getArguments(key), methodMaps.isQuery(key));

				DataFetcher<Object> dataFetcher = null;
				if (method != null) {
					dataFetcher = new MethodDataFetcher(service, method);
				}

//				arguments.stream().peek(e -> System.out.println("args :" + e.getName()));

				System.out.println("Method name : " + method.getName());
				System.out.println("return Type : " + returnType.getSimpleName());
				System.out.println("return type : " + returnType.getSimpleName().equals("Object"));
				System.out.println("entity is present : " + isEntitypresent);

				if (isEntitypresent && !graphQLUtils.isprimitive(returnType)
						&& returnType.getSimpleName().equals("Object")) {

//					System.out.println("into wrapper type : " + graphQLUtils.isWrapper(returnType));

//					if (graphQLUtils.isWrapper(returnType)) {
//						builder.field(registry.registerResolver(name, entityName, arguments, dataFetcher,
//								graphQLUtils.isWrapper(returnType)));
//					} else
					if (arguments.size() > 0) {
						builder.field(registry.registerResolver(name, entityName, arguments, dataFetcher));
					} else {
						builder.field(registry.registerResolver(name, entityName, dataFetcher));
					}
				} else {
					GraphQLOutputType outType = typeManager.getGraphqlReturnType(returnType, graphqlQLType,
							isEntitypresent);

					if (arguments.size() > 0) {
						builder.field(registry.registerResolver(name, outType, arguments, dataFetcher));
					} else {
						builder.field(registry.registerResolver(name, outType, dataFetcher));
					}
				}
			}

		} else {

		}

	}

	@Bean
	GraphQL graphql(GraphQLSchema graphqlschema) {
		return GraphQL.newGraphQL(graphqlschema).defaultDataFetcherExceptionHandler(globalHandler).build();
	}

	@Bean
	GraphQLSchema getSchema() {

		String sch = new SchemaPrinter().print(schema);
		System.out.println(sch);
		return schema;
	}

}

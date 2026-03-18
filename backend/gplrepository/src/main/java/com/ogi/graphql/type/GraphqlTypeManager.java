package com.ogi.graphql.type;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.persistence.Id;
import javax.persistence.metamodel.Attribute;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.PluralAttribute;

import org.hibernate.mapping.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ogi.factory.annotations.GraphQLIgnore;
import com.ogi.factory.annotations.Param;
import com.ogi.factory.annotations.Required;
import com.ogi.factory.pojo.PagedResult;
import com.ogi.graphql.configurations.scalars.CustomScalar;
import com.ogi.graphql.utils.EntityScanner;
import com.ogi.graphql.utils.GraphQLUtils;
import com.ogi.utils.functions.BeanUtils;
import com.sun.xml.bind.v2.model.core.ID;

import graphql.Scalars;
import graphql.schema.GraphQLArgument;
import graphql.schema.GraphQLFieldDefinition;
import graphql.schema.GraphQLInputObjectField;
import graphql.schema.GraphQLInputObjectType;
import graphql.schema.GraphQLInputType;
import graphql.schema.GraphQLList;
import graphql.schema.GraphQLNonNull;
import graphql.schema.GraphQLObjectType;
import graphql.schema.GraphQLOutputType;
import graphql.schema.GraphQLScalarType;
import graphql.schema.GraphQLTypeReference;

@Component
public class GraphqlTypeManager {

	private final EntityScanner entityScanner;

	@Autowired
	GraphQLUtils utils;

	Map<String, GraphQLInputObjectType> inputRegistry = new HashMap<>();

	Map<String, GraphQLObjectType> objectRegistry = new HashMap<>();

	Map<String, GraphQLArgument> argRegistry = new HashMap<>();

	Map<String, String> pagedRegistry = new HashMap<String, String>();

	GraphqlTypeManager(EntityScanner entityScanner) {
		this.entityScanner = entityScanner;
	}

	public Map<String, GraphQLInputObjectType> getinputRegistry() {
		return inputRegistry;
	}

	public Map<String, GraphQLObjectType> getObjectRegistry() {
		return objectRegistry;
	}

	public Map<String, String> getPagedregistry() {
		return pagedRegistry;
	}

	public java.util.List<GraphQLArgument> createCustomGraphQLArgumentsForCommonMethods(Method method, Class<?> entity,
			Map<String, Class<?>> optionalType, Boolean isQuery) {
		java.util.List<GraphQLArgument> arguments = new ArrayList<>();

		GraphQLUtils utils = new GraphQLUtils();

		System.out.println("into generate arguments");

		System.out.println("Method name : " + method.getName());
		for (Parameter paramter : method.getParameters()) {

			if (utils.isIgnorable(paramter))
				continue;

			Class<?> paramType = paramter.getType();
			String name = paramter.getName();

			System.out.println("available annotations for param : " + paramter.getAnnotations().length);

			if (paramter.isAnnotationPresent(Param.class)) {
				name = paramter.getAnnotation(Param.class).value();
			}

			System.out.println(name + " of Type " + paramType);

			// if generic class map it with the statically mentioned class from commonMethod
			// contructors
			if (paramter.getType().equals(Object.class)) {

				if (!optionalType.isEmpty() && optionalType.containsKey(name)) {
					System.out.println(paramter.getType().getName());
					System.out.println(optionalType.get(name).getName());
					if (optionalType.get(name).equals(Object.class)) {
						System.out.println("into object resolver");
						paramType = entity;
					} else if (optionalType.get(name).equals(Field.class)) {
						System.out.println("into Field Type");
						// map dynamic parameter based on entity name
						paramType = utils.getFieldFromObj(entity, name);

						if (paramType == null) {
							paramType = utils.getFieldByID(entity);
						}

					} else
						paramType = (Class<?>) optionalType.get(name);
				}
				System.out.println(name + " of Type " + paramType);
			}

			boolean isWrapper = false;

			if (utils.isWrapper(paramType)) {
				Class<?> innerClass = utils.unwrap(paramter.getParameterizedType());

//				System.out.println(paramter.getParameterizedType().getTypeName());

				System.out.println(innerClass);

				paramType = innerClass;

				isWrapper = true;

			}

			if (utils.isPojoBean(paramType)) {
				System.out.println("into pojo bean" + paramType.getSimpleName());
				System.out.println(
						"input registry is present " + checkinInputRegistry(paramType.getSimpleName() + "input"));
				System.out
						.println("object registry is present " + objectRegistry.containsKey(paramType.getSimpleName()));

				if (checkinInputRegistry(paramType.getSimpleName() + "input")) {

//						GraphQLArgument tempArg = createArugment(paramter.getName(),
//								getObjectFromInputRegistry(paramType.getSimpleName() + "input"));
					if (isWrapper) {
						arguments.add(createArgumentWithList(name, paramType.getSimpleName() + "input"));

					} else {
						arguments.add(createArugment(name, paramType.getSimpleName() + "input"));

					}

				} else if (objectRegistry.containsKey(paramType.getSimpleName())) {
					System.out.println("parameter present :" + paramType.getSimpleName());

					if (isWrapper) {
						GraphQLArgument tempArg = createArgumentWithList(name,
								convertGraphQLObjectToInput(objectRegistry.get(paramType.getSimpleName())));
						arguments.add(tempArg);
					} else {
						GraphQLArgument tempArg = createArugment(name,
								convertGraphQLObjectToInput(objectRegistry.get(paramType.getSimpleName())));
						arguments.add(tempArg);
					}

					// argRegistry.put(paramter.getName(), tempArg);

					// for custom or recursive beans
				} else if (checkinInputRegistry(paramType.getSimpleName())) {
					if (isWrapper) {
						arguments.add(createArgumentWithList(name, paramType.getSimpleName()));
					} else {
						arguments.add(createArugment(name, paramType.getSimpleName()));
					}
				} else {

					arguments.addAll(createArgFromBeans(paramType, isQuery));
				}
			} else {
				System.out.println("into non-pojo bean");
				if (isWrapper) {
					arguments.add(paramter.getType().equals(paramType) ? createArgumentWithList(paramter)
							: createArugment(paramter, paramType));
				} else {
					arguments.add(paramter.getType().equals(paramType) ? createArugment(paramter)
							: createArugment(paramter, paramType));
				}
			}

		}

		return arguments;
	}

	private GraphQLArgument createArugment(GraphQLArgument graphQLArgument) {
		return GraphQLArgument.newArgument(graphQLArgument).build();
	}

	public java.util.List<GraphQLArgument> createGraphQLArguments(Method method) {
		java.util.List<GraphQLArgument> arguments = new ArrayList<>();

		GraphQLUtils utils = new GraphQLUtils();

		for (Parameter paramter : method.getParameters()) {
			Class<?> paramType = paramter.getType();

			String name = paramter.getName();

			if (paramter.isAnnotationPresent(Param.class)) {
				name = paramter.getAnnotation(Param.class).value();
			}

			if (utils.isIgnorable(paramter))
				continue;

			System.out.println("createGQLArguments : " + name);
			System.out.println("createGQLArgument type : " + paramter.getType());
			if (utils.isPojoBean(paramType)) {

				if (checkinInputRegistry(paramter.getType().getSimpleName() + "input"))
					arguments.add(createArugment(name, paramter.getType().getSimpleName() + "input"));
				else
					arguments.add(createArugment(name, buildBeanInput(paramType)));
			} else if (utils.isWrapper(paramType)) {
				Class<?> ListparamType = utils.unwrap(paramter.getParameterizedType());
				if (utils.isPojoBean(ListparamType)) {
					System.out.println("into list child pojo bean : " + ListparamType.getSimpleName());
//list processor
					if (checkinInputRegistry(ListparamType.getSimpleName() + "input")) {
						System.out.println("it seems an the entry exists in inputRegistry : "
								+ ListparamType.getSimpleName() + "input");
//						arguments.add(createArugment(paramter.getName(),
//								GraphQLList.list(getObjectFromInputRegistry(ListparamType.getSimpleName()))));

						System.out.println("into parameter name : " + name);
						System.out.println("into listParam name : " + ListparamType.getSimpleName());

						arguments.add(createArgumentWithList(name, ListparamType.getSimpleName() + "input"));
					} else
//						if (objectRegistry.containsKey(ListparamType.getSimpleName())) {
//						arguments.add(createArgumentWithList(name, ListparamType.getSimpleName()));
//
//					} else
					{
						System.out.println("does not exist in inputRegistry child pojo bean");
						arguments.add(createArugment(name,
								GraphQLList.list(convertGraphQLObjectToInput(buildGraphqlType(ListparamType)))));
					}
				} else {

					System.out.println("primitive type of List");
					arguments.add(createArgumentWithList(name, ListparamType));
				}
			} else {
				arguments.add(createArugment(paramter));
			}

		}

		return arguments;
	}

	public GraphQLArgument createArugment(Parameter param, Class<?> paramType) {
		return GraphQLArgument.newArgument().name(param.getName()).type(typeCaster(param, paramType)).build();
	}

	private GraphQLArgument createArugment(String typeName, GraphQLList list) {
		return GraphQLArgument.newArgument().name(typeName).type(list).build();
	}

	public GraphQLArgument createArugment(Parameter param) {
		return GraphQLArgument.newArgument().name(param.getName()).type(typeCaster(param)).build();
	}

	public GraphQLArgument createArgumentWithList(Parameter param) {
		return GraphQLArgument.newArgument().name(param.getName()).type(GraphQLList.list(typeCaster(param))).build();
	}

	public GraphQLArgument createArgumentWithList(String name, Class<?> param) {
		return GraphQLArgument.newArgument().name(name).type(GraphQLList.list(typeCaster(param))).build();
	}

	public GraphQLArgument createArgumentWithList(String name, GraphQLInputObjectType param) {
		return GraphQLArgument.newArgument().name(name).type(GraphQLList.list((param))).build();
	}

	public GraphQLArgument createArgumentWithList(String name, String param) {
		return GraphQLArgument.newArgument().name(name).type(GraphQLList.list(GraphQLTypeReference.typeRef(param)))
				.build();
	}

	@SuppressWarnings("unused")
	private GraphQLArgument createArugment(Field field) {
		return this.createArugment(field, true);
	}

	public GraphQLArgument createArugment(Field field, Boolean isQuery) {
		return GraphQLArgument.newArgument().name(field.getName()).type(typeCaster(field, isQuery)).build();
	}

	public GraphQLArgument createArugment(String paramName, EntityType<?> entity) {
		return GraphQLArgument.newArgument().name(paramName).type((buildBeanInput(entity))).build();
	}

	public GraphQLArgument createArugment(String paramName, GraphQLInputObjectType paramType) {
		return GraphQLArgument.newArgument().name(paramName).type((paramType)).build();
	}

	public GraphQLArgument createArugment(String paramName, String ref) {
		return GraphQLArgument.newArgument().name(paramName).type(GraphQLTypeReference.typeRef(ref)).build();
	}

	public java.util.List<GraphQLArgument> createArgFromBeans(Class<?> entityClass) {
		return this.createArgFromBeans(entityClass, true);
	}

	public java.util.List<GraphQLArgument> createArgFromBeans(Class<?> entityClass, Boolean isQuery) {
		java.util.List<GraphQLArgument> arguments = new ArrayList<>();

		List<Field> fields = BeanUtils.getAllFields(entityClass);

		for (Field field : fields) {

			if (utils.isIgnorable(field))
				continue;

			System.out.println("into read Fields : " + field.getName());

			if (utils.isPojoBean(field.getType())) {
				System.out.println("it is ia pojoBean" + field.getType().getSimpleName());
				System.out.println(checkinInputRegistry(field.getType().getSimpleName() + "input"));
				System.out.println(objectRegistry.containsKey(field.getType().getSimpleName()));

				if (checkinInputRegistry(field.getType().getSimpleName() + "input"))
					arguments.add(createArugment(field.getName(),
							getObjectFromInputRegistry(field.getType().getSimpleName() + "input")));
				else if (objectRegistry.containsKey(field.getType().getSimpleName())) {
					System.out.println("into objectType match");
					arguments.add(createArugment(field.getName(),
							convertGraphQLObjectToInput(objectRegistry.get(field.getType().getSimpleName()))));
				} else {
					arguments.addAll(createArgFromBeans(field.getType(), isQuery));
				}
			} else {
				arguments.add(createArugment(field, isQuery));
			}
		}

		System.out.println(arguments.size());

		return arguments;
	}

	private boolean checkinInputRegistry(String name) {
		System.out.println("Searching input Registry  (" + name + ") is exists : " + inputRegistry.containsKey(name));

		if (inputRegistry.containsKey(name))
			return true;
		return false;

	}

	private GraphQLInputObjectType getObjectFromInputRegistry(String name) {
		System.out.println("Fetching input for : " + name);
		if (inputRegistry.containsKey(name))
			return inputRegistry.get(name);
		return null;

	}

	public GraphQLInputObjectType buildBeanInput(Class<?> entityType) {

//		if (checkinInputRegistry(entityType.getSimpleName()))
//			return getObjectFromInputRegistry(entityType.getSimpleName());

		graphql.schema.GraphQLInputObjectType.Builder typeBuilder = GraphQLInputObjectType.newInputObject()
				.name(entityType.getSimpleName() + "input");

		// create dummy entry to override repeated reference
		inputRegistry.put(entityType.getSimpleName() + "input", typeBuilder.build());

		java.util.List<GraphQLInputObjectField> fields = new ArrayList<>();

		for (Field field : BeanUtils.getAllFields(entityType)) {

			if (utils.isIgnorable(field))
				continue;

			// new type included for custom bean at 18/11/25
			if (utils.isWrapper(field.getType())) {
				Class<?> ListparamType = utils.unwrap(field.getGenericType());
				System.out.println(ListparamType);

				if (utils.isPojoBean(ListparamType)) {

					if (inputRegistry.containsKey(ListparamType.getSimpleName() + "input")) {
						fields.add(GraphQLInputObjectField.newInputObjectField().name(field.getName())
								.type(GraphQLList
										.list(GraphQLTypeReference.typeRef(ListparamType.getSimpleName() + "input")))
								.build());
					} else {
						// not matching into any
						fields.add(GraphQLInputObjectField.newInputObjectField().name(field.getName())
								.type(GraphQLList.list(buildBeanInput(ListparamType))).build());
					}

				} else {
					// primitive list
					fields.add(GraphQLInputObjectField.newInputObjectField().name(field.getName())
							.type(GraphQLList.list(typeCaster(field, field.getType()))).build());
				}

			} else if (utils.isPojoBean(field.getType())) {

				if (inputRegistry.containsKey(field.getType().getSimpleName() + "input")) {
					fields.add(GraphQLInputObjectField.newInputObjectField().name(field.getName())
							.type(GraphQLTypeReference.typeRef(field.getType().getSimpleName() + "input")).build());
				} else {
					fields.add(GraphQLInputObjectField.newInputObjectField().name(field.getName())
							.type(buildBeanInput(field.getType())).build());
				}

			} else {

				fields.add(GraphQLInputObjectField.newInputObjectField().name(field.getName())

						.type(typeCaster(field, field.getType())).build());
			}

		}

		typeBuilder.fields(fields);

		inputRegistry.put(entityType.getSimpleName() + "input", typeBuilder.build());
		return typeBuilder.build();
	}

	public GraphQLInputObjectType buildBeanInput(EntityType<?> entityType) {
		java.util.List<GraphQLInputObjectField> fields = new ArrayList<>();

		if (checkinInputRegistry(entityType.getName()))
			return getObjectFromInputRegistry(entityType.getName());

		entityType.getAttributes().forEach(attr -> {

			fields.add(GraphQLInputObjectField.newInputObjectField().name(attr.getName())

					.type(typeCaster(attr, entityType.getJavaType())).build());

		});
		GraphQLInputObjectType inputType = GraphQLInputObjectType.newInputObject().name(entityType.getName())
				.fields(fields).build();

		inputRegistry.put(entityType.getName(), inputType);

		return inputType;

	}

	public GraphQLOutputType getGraphqlReturnType(Type returnType, GraphQLObjectType entity, boolean isEntitypresent) {

		System.out.println("into graphqlReturnType");
		System.out.println(returnType.getTypeName());
		Class<?> clazz = returnType.getClass();

		if (returnType instanceof Class<?>) {
			clazz = (Class<?>) returnType;
			if (!entity.getName().equals(clazz.getSimpleName())) {
				System.out.println("return type is not entity");
				entity = buildGraphqlType(clazz);
			}
		} else if (returnType instanceof ParameterizedType) {
			ParameterizedType parameterizedType = (ParameterizedType) returnType;
			Type rawType = parameterizedType.getRawType();
			Class<?> ListparamType = utils.unwrap(parameterizedType);
			System.out.println("raw Type : " + rawType.getTypeName());

			System.out.println("inner class : " + ListparamType);
			if (rawType instanceof Class) {
				clazz = (Class<?>) rawType;
			}

			System.out.println(entity.getName());
			System.out.println(ListparamType.getSimpleName());
			System.out.println(entity.getName().equals(ListparamType.getSimpleName()));

			if (!entity.getName().equals(ListparamType.getSimpleName()))
				entity = buildGraphqlType(ListparamType);
		}
		return getGraphqlReturnType(clazz, entity, isEntitypresent);
	}

	public GraphQLOutputType getGraphqlReturnType(Class<?> returnType, GraphQLObjectType entity,
			boolean isEntitypresent) {

		GraphQLUtils utils = new GraphQLUtils();
		System.out.println("return Type " + returnType.getName() + " " + returnType.getTypeName());
		System.out.println("for entity name " + entity.getName());
		switch (returnType.getTypeName()) {
		case "java.util.Optional":
			if (isEntitypresent)
				return (GraphQLTypeReference.typeRef(entity.getName()));
			return (entity);
		case "java.util.List":
			if (isEntitypresent) {
				System.out.println("using reference instead of entity");
				return GraphQLList.list(GraphQLTypeReference.typeRef(entity.getName()));
			}
			return GraphQLList.list(entity);
		case "java.lang.Object":
			if (isEntitypresent)
				return (GraphQLTypeReference.typeRef(entity.getName()));
			return (entity);
			

		case "com.ogi.factory.pojo.PagedResult":
			return GraphQLNonNull.nonNull(buildGraphqlType(PagedResult.class, entity));
		default:
			System.out.println("into default");
			if (utils.isprimitive(returnType)) {
				System.out.println("is primitive");
				return (utils.getGraphqlType(returnType));
			} else if (!utils.isPojoBean(returnType)) {
				System.out.println("into not pojo bean " + returnType.getTypeName());
				return GraphQLNonNull.nonNull(utils.getGraphqlType(returnType));
			} else {
				System.out.println("not matching any type");
				if (objectRegistry.containsKey(returnType.getName())) {
					System.out.println("into obj reg");
					return GraphQLNonNull.nonNull(GraphQLTypeReference.typeRef(returnType.getName()));
//					return GraphQLNonNull.nonNull(objectRegistry.get(returnType.getName()));
				} else {
					System.out.println("not having registry " + returnType.getSimpleName());
					return (entity);
				}
			}

		}

	}



	// have to work on the duplicate object Types
	public GraphQLObjectType getExistingObjectViareference(String inputName) {
		System.out.println("Creating duplicate reference for " + inputName);
		return GraphQLObjectType.newObject(objectRegistry.get(inputName)).name(inputName + "1").build();
	}

	public GraphQLInputObjectType convertGraphQLObjectToInput(GraphQLObjectType objectType) {
//
//		if (checkinInputRegistry(objectType.getName() + "input")) {
//			return getExistingInputViareference(objectType.getName() + "input");
//		}

		graphql.schema.GraphQLInputObjectType.Builder typeBuilder = GraphQLInputObjectType.newInputObject()
				.name(objectType.getName() + "input");

		inputRegistry.put(objectType.getName() + "input", typeBuilder.build()); // temp reference for avoiding inner
																				// loops

		// create an input type from the objectType
		typeBuilder = typeBuilder.fields(objectType.getFieldDefinitions().stream().map(this::convertFieldToInputField)
				.collect(Collectors.toList()));

		System.out.println("object Object Name  :" + objectType.getName() + "input");
		inputRegistry.put(objectType.getName() + "input", typeBuilder.build());

		return typeBuilder.build();
	}

	private GraphQLInputObjectField convertFieldToInputField(GraphQLFieldDefinition field) {
		System.out.println("field name : " + field.getName());
		return GraphQLInputObjectField.newInputObjectField().name(field.getName())
				.type(convertTypeToInputType(field.getType())).build();
	}

	public GraphQLInputType convertTypeToInputType(GraphQLOutputType outType) {

		if (outType instanceof GraphQLList) {
			System.out.println("into GraphqlList");
			return GraphQLList
					.list(convertTypeToInputType((GraphQLOutputType) ((GraphQLList) outType).getWrappedType()));
		} else if (outType instanceof GraphQLScalarType) {
			System.out.println("into GraphqlscalarType");
			return (GraphQLScalarType) outType;
		} else if (outType instanceof GraphQLObjectType) {
			System.out.println("into GraphQLObjectType");
			return convertGraphQLObjectToInput((GraphQLObjectType) outType);
		} else if (outType instanceof GraphQLNonNull) {
			System.out.println("into GraphQLNonNull");
			return GraphQLNonNull
					.nonNull(convertTypeToInputType((GraphQLOutputType) ((GraphQLNonNull) outType).getWrappedType()));
		} else if (outType instanceof GraphQLTypeReference) {
			System.out.println("into GraphQLTypeReference");
			System.out.println(((GraphQLTypeReference) outType).getName() + " is present in objectregistry ? "
					+ objectRegistry.containsKey(((GraphQLTypeReference) outType).getName()));
			if (checkinInputRegistry(((GraphQLTypeReference) outType).getName() + "input")) {
				return GraphQLTypeReference.typeRef(((GraphQLTypeReference) outType).getName() + "input");
			} else if (objectRegistry.containsKey(((GraphQLTypeReference) outType).getName())) {
				return convertGraphQLObjectToInput(objectRegistry.get(((GraphQLTypeReference) outType).getName()));
			} else {
				return convertGraphQLObjectToInput(objectRegistry.get(((GraphQLTypeReference) outType).getName()));
			}

		}

		else {
			return null;
		}
	}

	@SuppressWarnings("unlikely-arg-type")
	public GraphQLObjectType buildGraphqlType(Class<?> entityType) {
		GraphQLObjectType.Builder typeBuilder = GraphQLObjectType.newObject().name(entityType.getSimpleName());

		objectRegistry.put(entityType.getSimpleName(), typeBuilder.build()); // temporary reference

		for (Field field : BeanUtils.getAllFields(entityType)) {

			if (field.isAnnotationPresent(GraphQLIgnore.class) || field.getName().equals("serialVersionUID"))
				continue; // explictity removing serialVersionUID from gql bean

			System.out.println("into read fields : " + field.getName());
			GraphQLFieldDefinition.Builder fieldDefinition = GraphQLFieldDefinition.newFieldDefinition()
					.name(field.getName());
			System.out.println("field Type " + field.getType().getSimpleName());
			System.out.println(field.getType() + "object is list : " + utils.isWrapper(field.getType()));
			if (utils.isWrapper(field.getType())) {
				System.out.println("into list definition : " + field.getName());
				Class<?> ListparamType = utils.unwrap(field.getGenericType());
				System.out.println("in bean : " + ListparamType.getName());
				if (utils.isPojoBean(ListparamType)) {
					System.out.println(
							"into pojo class & parent is list ? : " + List.class.isAssignableFrom(field.getType()));

					if (objectRegistry.containsKey(ListparamType.getSimpleName())) {
						fieldDefinition
								.type(GraphQLList.list(GraphQLTypeReference.typeRef(ListparamType.getSimpleName())))
								.build();
					} else {
						fieldDefinition.type(GraphQLList.list(buildGraphqlType(ListparamType))).build();
					}

				} else {
					System.out.println("into non-pojo bean" + ListparamType.getName());
					fieldDefinition.type(GraphQLList.list(utils.getGraphqlType(ListparamType))).build();
				}

			} else if (utils.isPojoBean(field.getType())) {
				System.out.println("is present in objectRegistry : "
						+ objectRegistry.containsKey(field.getType().getSimpleName()));
				if (objectRegistry.containsKey(field.getType().getSimpleName())) {
					fieldDefinition.type(GraphQLTypeReference.typeRef(field.getType().getSimpleName())).build();
				} else {
					fieldDefinition.type(buildGraphqlType(field.getType())).build();
				}
			} else {
				System.out.println("into non-pojo bean " + field.getType());
				fieldDefinition.type((utils.getGraphqlType(field.getType()))).build();

			}

			typeBuilder.field(fieldDefinition);

		}

		objectRegistry.put(entityType.getSimpleName(), typeBuilder.build());

		return typeBuilder.build();
	}

	@SuppressWarnings("unlikely-arg-type")
	public GraphQLObjectType buildGraphqlType(Class<?> entityType, GraphQLObjectType entity) {
		GraphQLObjectType.Builder typeBuilder = GraphQLObjectType.newObject()
				.name(entityType.getSimpleName() + entity.getName());

		System.out.println("making type for custom " + entityType.getSimpleName() + entity.getName());

		pagedRegistry.put(entityType.getSimpleName() + entity.getName(), entityType.getSimpleName() + entity.getName());

		for (Field field : BeanUtils.getAllFields(entityType)) {

			GraphQLFieldDefinition.Builder fieldDefinition = GraphQLFieldDefinition.newFieldDefinition()
					.name(field.getName());

			System.out.println("into name : " + field.getName());
			System.out.println("into type : " + field.getType());

			// for entity in the pojo bean
			if (utils.isPojoBean(field.getType())) {

				if (objectRegistry.containsKey(field.getType())) {
					fieldDefinition.type(GraphQLTypeReference.typeRef(field.getName()));
				} else {
					fieldDefinition.type(buildGraphqlType(field.getType())).build();
				}
				// for list of entity
			} else if (field.getType().equals(List.class)) {

				System.out.println("into list");

				Type fieldType = field.getGenericType();

				if (fieldType instanceof ParameterizedType) {
					ParameterizedType paramType = (ParameterizedType) fieldType;
					Type[] typeArguments = paramType.getActualTypeArguments();
					Type typearg = typeArguments[0];
					System.out.println(typearg.getTypeName());
					if (typearg.getTypeName().equals("T")) {
						if (objectRegistry.containsKey(entity.getName())) {
							fieldDefinition.type(GraphQLList.list(GraphQLTypeReference.typeRef(entity.getName())))
									.build();
						} else {
							fieldDefinition.type(GraphQLList.list((entity))).build();
						}
					} else {
						if (objectRegistry.containsKey(typearg.getTypeName())) {
							fieldDefinition.type(GraphQLList.list(GraphQLTypeReference.typeRef(typearg.getTypeName())))
									.build();
						} else {
							fieldDefinition.type(GraphQLList.list((buildGraphqlType(typearg.getClass())))).build();
						}

					}
				}

			} else {

				fieldDefinition.type((utils.getGraphqlType(field.getType()))).build();
			}

			objectRegistry.put(entityType.getSimpleName(), typeBuilder.build());

			typeBuilder.field(fieldDefinition);
		}

		return typeBuilder.build();
	}

	public GraphQLObjectType buildGraphqlType(EntityType<?> entityType) {

		System.out.println("entityType " + entityType.getName() + objectRegistry.containsKey(entityType.getName()));

		// not able to use it due to this the object is duplicating...
		if (objectRegistry.containsKey(entityType.getName())) {
//			return getExistingObjectViareference(entityType.getName());
			return objectRegistry.get(entityType.getName());
		}

		GraphQLObjectType.Builder typeBuilder = GraphQLObjectType.newObject().name(entityType.getName());
		objectRegistry.put(entityType.getName(), typeBuilder.build()); // storing temporary to avoid duplicates when
																		// transversing inner classes.

		entityType.getAttributes().forEach(attr -> {

			if (attr.getJavaType().isAnnotationPresent(GraphQLIgnore.class)
					|| attr.getName().equals("serialVersionUID"))
				return;

			GraphQLFieldDefinition.Builder fieldDefinition = GraphQLFieldDefinition.newFieldDefinition()
					.name(attr.getName());

			if (attr instanceof PluralAttribute) {
				PluralAttribute<?, ?, ?> plurAttr = (PluralAttribute<?, ?, ?>) attr;
				Class<?> eleType = plurAttr.getElementType().getJavaType();

				System.out.println("type Builder into collection  " + eleType.getSimpleName() + " : " + eleType);
				System.out.println("is exist in registry : " + objectRegistry.containsKey(eleType.getSimpleName()));

				if (objectRegistry.containsKey(eleType.getSimpleName())) {
					fieldDefinition.type(GraphQLList.list(GraphQLTypeReference.typeRef(eleType.getSimpleName())));
				} else if (utils.isPojoBean(eleType)) {
					if (objectRegistry.containsKey(eleType.getName())) {
						fieldDefinition.type(GraphQLList.list(GraphQLTypeReference.typeRef(eleType.getName()))).build();
					} else {
						fieldDefinition.type(GraphQLList.list(buildGraphqlType(eleType))).build();

					}
				} else {
					fieldDefinition.type((utils.getGraphqlType(eleType))).build();
				}
			} else if (utils.isPojoBean(attr.getJavaType())) {
				System.out.println("type Builder into Pojo  " + attr.getJavaType().getSimpleName());
				System.out.println(
						"is exist in registry : " + objectRegistry.containsKey(attr.getJavaType().getSimpleName()));

				// possibly the error belongs here... when including one Type to another Type
				if (objectRegistry.containsKey(attr.getJavaType().getSimpleName())) {
					fieldDefinition.type(GraphQLTypeReference.typeRef(attr.getJavaType().getSimpleName()));
				} else {
					fieldDefinition.type(buildGraphqlType(attr.getJavaType())).build();
				}
			} else {
				fieldDefinition.type((utils.getGraphqlType(attr.getJavaType()))).build();

			}

			typeBuilder.field(fieldDefinition);
		});

		System.out.println("adding to objectRegistry : " + entityType.getName());
		objectRegistry.put(entityType.getName(), typeBuilder.build());

		return typeBuilder.build();
	}

	// annotation present in entity / field.
	private GraphQLInputType typeCaster(Field field, Boolean isQuery) {
		if (field.isAnnotationPresent(Required.class) && !isQuery) {
			return GraphQLNonNull.nonNull(utils.getGraphqlType(field.getType()));
		}
		return (utils.getGraphqlType(field.getType()));

	}

	private GraphQLInputType typeCaster(Field paramter, Class<?> type) {
		try {
			if (paramter.isAnnotationPresent(Required.class)) {
				return GraphQLNonNull.nonNull(utils.getGraphqlType(type != null ? type : paramter.getType()));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return (utils.getGraphqlType(paramter.getType()));
	}

	// annotation present in entity
	private GraphQLInputType typeCaster(Attribute<?, ?> attr, Class<?> entityClass) {

		try {
			Field field = entityClass.getDeclaredField(attr.getName());
			if (field.isAnnotationPresent(Required.class)) {
				return GraphQLNonNull.nonNull(utils.getGraphqlType(attr.getJavaType()));
			} else {
				return (utils.getGraphqlType(attr.getJavaType()));

			}

		} catch (NoSuchFieldException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;

	}

	// if annotation present in method
	private GraphQLInputType typeCaster(Parameter paramter, Class<?> type) {
		try {
			if (paramter.isAnnotationPresent(Required.class)) {
				return GraphQLNonNull.nonNull(utils.getGraphqlType(type != null ? type : paramter.getType()));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return (utils.getGraphqlType(paramter.getType()));
	}

	// if annotation present in method.
	private GraphQLInputType typeCaster(Parameter paramter) {
		try {
			if (paramter.isAnnotationPresent(Required.class)) {
				return GraphQLNonNull.nonNull(utils.getGraphqlType(paramter.getType()));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return (utils.getGraphqlType(paramter.getType()));
	}

	private GraphQLInputType typeCaster(Class<?> paramter) {
		try {
			if (paramter.isAnnotationPresent(Required.class)) {
				return GraphQLNonNull.nonNull(utils.getGraphqlType(paramter));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return (utils.getGraphqlType(paramter));
	}

}

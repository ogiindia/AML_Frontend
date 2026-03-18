package com.ogi.graphql.utils;

import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.invoke.MethodType;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Parameter;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Map.Entry;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.apache.commons.lang3.ClassUtils;
import org.apache.el.stream.Optional;
import org.springframework.stereotype.Component;

import com.ogi.factory.annotations.GraphQLIgnore;
import com.ogi.graphql.configurations.scalars.CustomScalar;
import com.ogi.utils.functions.BeanUtils;

import graphql.Scalars;
import graphql.schema.GraphQLObjectType;
import graphql.schema.GraphQLScalarType;

@Component
public class GraphQLUtils {

	public Class<?> getFieldFromObj(Class<?> entity, String fieldName) {

		for (Field field : BeanUtils.getAllFields(entity)) {
			if (field.getName().equals(fieldName))
				return field.getType();
		}

		return null;
	}

	public Class<?> getFieldByID(Class<?> entity) {
		for (Field field : entity.getDeclaredFields()) {
			if (field.isAnnotationPresent(Id.class)) {
				field.setAccessible(true);
				try {
					return field.getType();
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
			}
		}

		return null;

	}

	public boolean isArray(Object obj) {
		if (List.class.isAssignableFrom(obj.getClass()))
			return true;

		if (obj instanceof List)
			return true;

		return obj != null && obj.getClass().isArray();
	}

	public GraphQLScalarType getGraphqlType(Class<?> javaType) {
		if (javaType.equals(Integer.class)) {
			return Scalars.GraphQLInt;
		} else if (javaType.equals(String.class)) {
			return Scalars.GraphQLString;
		} else if (javaType.equals(Boolean.class) || javaType.equals(boolean.class)) {
			return Scalars.GraphQLBoolean;
		} else if (javaType.equals(Long.class)) {
			return com.ogi.graphql.configurations.scalars.CustomScalar.LONG;
		} else if (javaType.equals(UUID.class)) {
			return com.ogi.graphql.configurations.scalars.CustomScalar.UUID;
		} else if (javaType.equals(LocalDateTime.class) || javaType.equals(Timestamp.class)) {
			return CustomScalar.LOCALDATETIME;
		} else if (javaType.equals(Void.class) || javaType.getName().equals("void")
				|| javaType.getSimpleName().equals("void")) {
			return CustomScalar.VOID;
		}

//		return GraphQLScalarType.newScalar().name("String").build();

		return Scalars.GraphQLString;
	}

	private static final Class<?>[] STANDARD_TYPES = { boolean.class, Boolean.class, Character.class, Byte.class,
			Short.class, Integer.class, Long.class, Float.class, Double.class, String.class, Void.class, UUID.class };

	public Object createAndInitializePojo(Class<?> clazz) {
		try {
			Object instance = clazz.getDeclaredConstructor().newInstance();

			for (Field field : clazz.getDeclaredFields()) {
				field.setAccessible(true);
				Class<?> type = field.getType();

				field.set(instance, this.getDefaultValue(type));
//
//	            if (type == int.class) field.set(instance, 0);
//	            else if (type == long.class) field.set(instance, 0L);
//	            else if (type == double.class) field.set(instance, 0.0);
//	            else if (type == boolean.class) field.set(instance, false);
//	            else if (type == String.class) field.set(instance, "");
				// Add more types as needed
			}

			return instance;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public Object getDefaultValue(Class<?> type) throws InstantiationException, IllegalAccessException,
			IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {
		if (type == int.class || type == Integer.class)
			return 0;
		if (type == long.class)
			return 0L;
		if (type == double.class || type == Float.class)
			return 0.0;
		if (type == boolean.class || type == Boolean.class)
			return false;
		if (type == String.class)
			return "";
		if (type == List.class)
			return new ArrayList<>();
		if (type == Set.class)
			return new HashSet<>();
		if (type == Map.class)
			return new HashMap<>();
		if (type == UUID.class)
			return UUID.randomUUID();
		if (this.isPojoBean(type)) {
			return type.getDeclaredConstructor().newInstance();
		}
		return null;
	}

	public boolean isPrimitiveOrWrapper(Class<?> clazz) {
		return ClassUtils.isPrimitiveOrWrapper(clazz) || clazz.equals(String.class);
	}

	public java.util.List<Field> getAllFields(Class<?> clazz) {
		java.util.List<Field> fields = new ArrayList<>();

		while (clazz != null && clazz != Object.class) {
			for (Field field : clazz.getDeclaredFields()) {
				fields.add(field);
			}
			clazz = clazz.getSuperclass();
		}
		return fields;
	}

	public <T> T mapToBean(Map<String, Object> map, Class<T> beanClass)
			throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException,
			NoSuchMethodException, SecurityException {
		return this.mapToBean(map, beanClass, 0);
	}

	@SuppressWarnings("unchecked")
	public <T> T mapToBean(Map<String, Object> map, Class<T> beanClass, int level)
			throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException,
			NoSuchMethodException, SecurityException {
		T bean = beanClass.getDeclaredConstructor().newInstance();

		System.out.println("maps");
		System.out.println(map);

		// sub-beans are not getting populated after modifing the mutations specs
		for (Field field : getAllFields(beanClass)) {
			if (isPojoBean(field.getType()) && !field.isAnnotationPresent(GraphQLIgnore.class)) {
				if (!Modifier.isStatic(field.getModifiers()) && !Modifier.isFinal(field.getModifiers())) {
					level = level++;
					field.setAccessible(true);
					Map<String, Object> subMaps = new HashMap<>();
					System.out.println(field.getName() + "submap exists : " + MapContainsSubMap(map, field.getName()));
					if (MapContainsSubMap(map, field.getName())) {
						subMaps = (Map<String, Object>) getValue(map, field.getName());
					} else {
						subMaps = map;
					}
					field.set(bean, mapToBean(subMaps, field.getType(), level));
				}
			} else {
				if (field.getName().contains("id")) {
					System.out.println(field.getName() + " " + level);
				}

				if (!field.isAnnotationPresent(GraphQLIgnore.class)) {
					if (!Modifier.isStatic(field.getModifiers()) && !Modifier.isFinal(field.getModifiers())) {
						field.setAccessible(true);
						Object object = getValue(map, field.getName());
						if (field.getName().contains("id")) {
							System.out.println(field.getName() + "" + object);
						}
						field.set(bean, object);
					}
				}
			}

		}

		return bean;

	}

	@SuppressWarnings("unchecked")
	private Boolean MapContainsSubMap(Map<String, Object> map, String name) {
		if (map.containsKey(name)) {
			if (map.get(name) instanceof Map)
				return true;
		} else {
			for (Entry<String, Object> entry : map.entrySet()) {
				if (entry.getValue() instanceof Map)
					return MapContainsSubMap((Map<String, Object>) entry.getValue(), name);
			}
		}

		return false;
	}

	private Object getValue(Map<String, Object> map, String name) {
		if (name != null) {
			if (map.containsKey(name))
				return map.get(name);

			// reworked instead of finding all the values and populate it it will match only
			// on the same level
//			for (Entry<String, Object> entry : map.entrySet()) {
//				if (entry.getValue() instanceof Map) {
//					return getValue((Map<String, Object>) entry.getValue(), name);
//				}
//			}

		}

		System.out.println("going to be null : " + name);
		return null;
	}

	public boolean isPresenceWrapper(Class<?> clazz) {
		System.out.println(clazz.getName());

		if (clazz.getName().equals("java.util.Optional")) {
			return true;
		}

		if (clazz.equals(Optional.class)) {
			return true;
		}

		if (Optional.class.isAssignableFrom(clazz)) {
			return true;
		}

		if (clazz.isInstance(Optional.class)) {
			return true;
		}

		return false;
	}

	public boolean isCollectionWrapper(Class<?> clazz) {

		if (List.class.isAssignableFrom(clazz)) {
			System.out.println("into list assignable");
			return true;
		}

		if (Set.class.isAssignableFrom(clazz)) {
			System.out.println("into set assignable");
			return true;
		}

		if (this.isArray(clazz)) {
			System.out.println("into array");
			return true;
		}

		if (clazz.equals(Object.class))
			return false;

		if (clazz.isInstance(java.util.List.class)) {
			System.out.println("into list instance");
			return true;
		}

		// if it is set
		if (clazz.isInstance(java.util.Set.class)) {
			System.out.println("into set instance");
			return true;
		}

		return false;
	}

	public boolean isWrapper(Class<?> clazz) {
		return isCollectionWrapper(clazz);
	}

	public boolean isprimitive(Class<?> clazz) {

		if (Arrays.asList(STANDARD_TYPES).contains(clazz))
			return true;

		if (clazz.getName().contains("void"))
			return true;

		return false;
	}

	public boolean isPojoBean(Class<?> clazz) {

		if (clazz.isAnnotationPresent(Entity.class)) {
			return true;
		}

		if (clazz.isInterface() || clazz.isEnum() || clazz.isPrimitive()
				|| Arrays.asList(STANDARD_TYPES).contains(clazz) || Modifier.isAbstract(clazz.getModifiers())) {
			return false;
		}

		if (clazz.getPackageName().startsWith("java.") || clazz.getPackageName().startsWith("jakarta.")) {
			return false;
		}

		// commmenting out so that normal bean can also be included..

//		System.out.println("constructor isExists : " + clazz.getDeclaredConstructors().length);
//		try {
//			clazz.getDeclaredConstructor();
//		} catch (NoSuchMethodException e) {
//			return false;
//		}

		boolean hasGetter = false;
		boolean hasSetter = false;

		for (Method method : clazz.getDeclaredMethods()) {

			if (Modifier.isPublic(method.getModifiers())) {
				String name = method.getName();

				if (name.startsWith("get") && method.getParameterCount() == 0) {
					hasGetter = true;
				} else if (name.startsWith("set") && method.getParameterCount() == 1) {
					hasSetter = true;
				}

				if (hasGetter && hasSetter) {
					return true;
				}
			}
		}

		return false;

	}

	public boolean isBean(Class<?> clazz) {
		if (isPrimitiveOrWrapper(clazz)) {
			return false;
		}

		System.out.println("not a primitive");
		try {
			PropertyDescriptor[] propertyDescriptor = Introspector.getBeanInfo(clazz, Object.class)
					.getPropertyDescriptors();

			System.out.println(propertyDescriptor);
			return propertyDescriptor.length > 0;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean isDataType(Class<?> clazz) {

		if (isPrimitiveOrWrapper(clazz)) {
			return true;
		} else if (isBean(clazz)) {
			return false;
		}

		return true;
	}

	@SuppressWarnings("unchecked")
	public <T> Class<T> wrap(Class<T> c) {
		return (Class<T>) MethodType.methodType(c).wrap().returnType();
	}

	public Class<?> convertTypetoClass(Type t) {
		System.out.println("ttoclass " + t);
		if (t instanceof Class) {
			Class<?> typeclass = (Class<?>) t;
			return typeclass;
		}
		return t.getClass();

	}

	public Class<?> unwrap(Type type) {
		if (type instanceof ParameterizedType) {
			ParameterizedType paramType = (ParameterizedType) type;
			for (Type ty : paramType.getActualTypeArguments()) {

				System.out.println(ty.getTypeName());

			}
			Type actualType = paramType.getActualTypeArguments()[0];
			System.out.println(actualType.getTypeName());
			if (actualType instanceof Class<?>) {
				return (Class<?>) actualType;
			} else if (actualType instanceof ParameterizedType) {
				return (Class<?>) ((ParameterizedType) actualType).getRawType();
			}
		}
		return null;
	}

	public boolean isIgnorable(Parameter type) {

		if (type.getType().getName().contains("org.springframework")) {
			return true;
		}

		if (type.getType().getName().contains("java.security")) {
			return true;
		}

		if (type.isAnnotationPresent(GraphQLIgnore.class) || type.getName().equals("serialVersionUID"))
			return true;

		return false;
	}

	public boolean isIgnorable(Field type) {

		if (type.getType().getName().contains("org.springframework")) {
			return true;
		}

		if (type.getType().getName().contains("java.security")) {
			return true;
		}

		if (type.isAnnotationPresent(GraphQLIgnore.class) || type.getName().equals("serialVersionUID"))
			return true;

		return false;
	}

//	public Class<?> unwrap(Object c) {
//		if (c instanceof ParameterizedType) {
//			ParameterizedType paramType = (ParameterizedType) c;
//			Type actualType = paramType.getActualTypeArguments()[0];
//
//			if (actualType instanceof Class) {
//				Class<?> typeclass = (Class<?>) actualType;
//				return typeclass;
//			}
//
//		}
//		return null;
//	}

}

package com.ogi.utils.functions;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class BeanUtils {

	public static <T> T mapToBean(Map<String, Object> map, Class<T> beanClass)
			throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException,
			NoSuchMethodException, SecurityException {
		T bean = beanClass.getDeclaredConstructor().newInstance();

		for (Entry<String, Object> entry : map.entrySet()) {

			String fieldName = entry.getKey();
			Object fieldValue = entry.getValue();
			try {
				Field field = beanClass.getDeclaredField(fieldName);
				field.setAccessible(true);
				field.set(bean, fieldValue);
			} catch (Exception e) {

			}
		}

		return bean;
	}

	public static List<Field> getAllFields(Class<?> clazz) {
		List<Field> fields = new ArrayList<>();

		while (clazz != null) {
			for (Field field : clazz.getDeclaredFields()) {
				fields.add(field);
			}

			clazz = clazz.getSuperclass();
		}

		return fields;

	}

}

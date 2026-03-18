package com.ogi.factory.annotations.services;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.StringJoiner;

import com.ogi.factory.annotations.ToString;

public class ToStringGenerator implements InvocationHandler {

	private final Object target;

	public ToStringGenerator(Object target) {
		// TODO Auto-generated constructor stub
		this.target = target;
	}

	@Override
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		if (method.getName().equals("toString") && method.getParameterCount() == 0) {
			return generateToString();
		}
		return method.invoke(target, args);
	}

	private String generateToString() {
		Class<?> clazz = target.getClass();

		StringJoiner joiner = new StringJoiner(", ", clazz.getSimpleName() + "{", "}");

		try {
			for (Method method : clazz.getDeclaredMethods()) {
				if (method.getName().startsWith("get") && method.getParameterCount() == 0) {
					String fieldName = method.getName().substring(3);
					Object value = method.invoke(target);
					joiner.add(fieldName + "=" + value);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return joiner.toString();
	}

	@SuppressWarnings("unchecked")
	public static <T> T createProxy(T Target) {
		if (!Target.getClass().isAnnotationPresent(ToString.class)) {
			throw new IllegalArgumentException();
		}
		return (T) Proxy.newProxyInstance(Target.getClass().getClassLoader(), Target.getClass().getInterfaces(),
				new ToStringGenerator(Target));
	}

}

package com.ogi.graphql.clientmapper;

import java.awt.Window.Type;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.ogi.factory.enums.Operations;
import com.ogi.factory.pojo.PagedResult;
import com.sun.xml.bind.v2.model.core.ID;

@Component
public class CommonMethodConstructor {

	public CommonMethodConstructor() {
		// TODO Auto-generated constructor stub

		addMethod("list#entity#", null, List.class, "findAll", true);
		addMethod("list#entity#ByPaging", Map.of("entity", Object.class), PagedResult.class, "listByPaging", true);
		addMethod("find#entity#byId", Map.of("id", Field.class), Optional.class, "findById", true);
		addMethod("save#entity#", Map.of("entity", Object.class), Object.class, "save", false);
		addMethod("update#entity#", Map.of("entity", Object.class, "id", Field.class), Object.class, "update", false);
		addMethod("delete#entity#", Map.of("id", Field.class), Void.class, "delete", false);
		addMethod("toggle#entity#", Map.of("id", Field.class, "status", Boolean.class), void.class, "toggle", false);

	}

	private static Map<String, Map<String, Class<?>>> argumentsMap = new HashMap<>();
	private static Map<String, Class<?>> returnMap = new HashMap<>();
	private static Map<String, Boolean> isQueryMap = new HashMap<>();
	private static Map<String, String> methodNames = new HashMap<>();

	private static void addMethod(String type, Map<String, Class<?>> list, Class<?> outType, String methodName,
			boolean isQuery) {

		argumentsMap.put(type, list);
		returnMap.put(type, outType);
		isQueryMap.put(type, isQuery);
		methodNames.put(type, methodName);
	}

	public String getMethodName(String type) {
		return methodNames.get(type);
	}

	public List<String> getMethodsList() {
		List<String> methods = new ArrayList<>();
		for (Entry<String, Boolean> entry : isQueryMap.entrySet()) {
			methods.add(entry.getKey());
		}
		return methods;
	}

	public Boolean isQuery(String type) {
		return isQueryMap.get(type);
	}

	public Class<?> getReturnType(String type) {
		return returnMap.get(type);
	}

	public Map<String, Class<?>> getArguments(String type) {
		return argumentsMap.get(type);
	}

	public Boolean isQuery(Operations type) {
		return isQueryMap.get(checkType(type));
	}

	public Class<?> getReturnType(Operations type) {
		return returnMap.get(checkType(type));
	}

	public Map<String, Class<?>> getArguments(Operations type) {
		return argumentsMap.get(checkType(type));
	}

	public String getMethodName(Operations type) {
		return methodNames.get(checkType(type));
	}

	public String getKeyName(Operations type) {
		return checkType(type);
	}

	@SuppressWarnings("unchecked")
	public static List<HashMap<String, Object>> getMaps() {

		List<HashMap<String, Object>> resultSet = new ArrayList<>();

		for (Entry<String, Class<?>> entry : returnMap.entrySet()) {
			HashMap<String, Object> type = new HashMap<>();

			Map<String, Class<?>> argMap = new HashMap<>();
			if (argumentsMap.containsKey(entry.getKey())) {
				argMap = argumentsMap.get(entry.getKey());
				if (argMap == null || argMap.equals(null))
					argMap = new HashMap<>();
			}

			System.out.println(entry.getKey());
			System.out.println(entry.getValue());

			Map<Class<?>, Map<String, Class<?>>> map = Map.of(entry.getValue(), argMap);

			resultSet.add((HashMap<String, Object>) type.put(entry.getKey(), map));
		}

		return resultSet;

	}

	private String checkType(Operations op) {

//		System.out.println(op.name());

		if (op != null) {

			switch (op) {
			case SAVE:
				return "save#entity#";
			case DELETE:
				return "delete#entity#";
			case UPDATE:
				return "update#entity#";
			case READ:
				return "list#entity#";
			case READ_BY_PAGING:
				return "list#entity#ByPaging";
			case READ_BY_ID:
				return "find#entity#byId";
			case DISABLE:
				return "toggle#entity#";

			default:
				return null;
			}
		}

		return null;
	}

}

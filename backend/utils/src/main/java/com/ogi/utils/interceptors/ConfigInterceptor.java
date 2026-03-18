package com.ogi.utils.interceptors;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.HandlerInterceptor;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ConfigInterceptor implements HandlerInterceptor {

	private Properties configProperties;

	public ConfigInterceptor() {
		// TODO Auto-generated constructor stub
		this.configProperties = new Properties();
	}

	public void setConfigProperties(Properties configProperties) {
		this.configProperties = configProperties;
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws IOException {

		CustomHttpServletRequestWrapper wrappedRequest = new CustomHttpServletRequestWrapper(request, null);

		String body = new String(wrappedRequest.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

		if (body != null && !body.isEmpty()) {
			ObjectMapper obj = new ObjectMapper();
			Map<String, Object> requestData = obj.readValue(body, Map.class);
			Map<String, String> keyMapping = getkeyMappingFromConfig();
			Map<String, Object> transformedData = transformKeys(requestData, keyMapping);
			String transformedBody = obj.writeValueAsString(transformedData);
			System.out.println("transformed Body :" + transformedBody);
			request.setAttribute("cachedRequest", transformedBody);
			request.setAttribute("wrappedRequest", transformedBody);
			RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(wrappedRequest));
		}

		return true;

	}

	private String getBody(HttpServletRequest request) throws IOException {
		StringBuilder stringBuilder = new StringBuilder();
		try (BufferedReader reader = request.getReader()) {
			String line;
			while ((line = reader.readLine()) != null) {
				stringBuilder.append(line);
			}
		}

		return stringBuilder.toString();
	}

	private Map<String, String> getkeyMappingFromConfig() {

		return configProperties.entrySet().stream()
				.collect(Collectors.toMap(entry -> entry.getKey().toString(), entry -> entry.getValue().toString()));
	}

	@SuppressWarnings({ "unused", "unchecked" })
	private Map<String, Object> transformKeys(Map<String, Object> requestData, Map<String, String> keyMapping) {

		for (Map.Entry<String, Object> entry : requestData.entrySet()) {
			String oldKey = entry.getKey();
			String newKey = keyMapping.get(oldKey);

			if (newKey != null) {
				requestData.put(newKey, entry.getValue());
				requestData.remove(oldKey);
				oldKey = newKey;
			}

			if (entry.getValue() instanceof Map) {
				transformKeys((Map<String, Object>) entry.getValue(), keyMapping);
			}

		}

		return requestData;
	}

}

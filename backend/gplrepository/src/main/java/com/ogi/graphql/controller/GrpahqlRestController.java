package com.ogi.graphql.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ogi.graphql.service.GraphqlRestService;

@RestController
public class GrpahqlRestController {

	@Autowired
	GraphqlRestService service;

	@SuppressWarnings({ "unchecked", "deprecation" })
	@PostMapping(value = "/graphql")
	public Map<String, Object> execute(@RequestBody Map<String, Object> request, HttpServletRequest req) {
		String query = (String) request.get("query");

		Map<String, Object> variables = (Map<String, Object>) request.getOrDefault("variables", new HashMap<>());
		Map<String, Object> extensions = (Map<String, Object>) request.getOrDefault("extensions", new HashMap<>());

		return service.execute(query, variables);

	}

}

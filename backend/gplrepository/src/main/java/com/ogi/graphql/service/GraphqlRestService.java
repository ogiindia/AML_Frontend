package com.ogi.graphql.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import graphql.ExecutionInput;
import graphql.GraphQL;

@Service
public class GraphqlRestService {

	private final GraphQL graphQL;

	public GraphqlRestService(GraphQL graphql) {
		// TODO Auto-generated constructor stub
		this.graphQL = graphql;
	}

	public Map<String, Object> execute(String query, Map<String, Object> variables) {
		System.out.println(query);
		System.out.println(variables);
		ExecutionInput executionInput = ExecutionInput.newExecutionInput().query(query).variables(variables).build();
		return graphQL.execute(executionInput).toSpecification();
	}

}

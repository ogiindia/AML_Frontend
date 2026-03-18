package com.ogi.graphql.configurations;

import java.util.Map;

import org.springframework.graphql.execution.ErrorType;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ogi.factory.errors.RecordNotFoundException;
import com.ogi.factory.errors.UserAlreadyExistsException;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.stereotype.Component;

@Component
public class GraphqlExceptionHandler extends DataFetcherExceptionResolverAdapter {

	@Override
	protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
		if (ex instanceof UserAlreadyExistsException) {
			return GraphqlErrorBuilder.newError(env).message(ex.getMessage()).errorType(ErrorType.BAD_REQUEST)
					.extensions(Map.of("code", "USER_ALREADY_EXISTS")).build();
		}

		if (ex instanceof RecordNotFoundException) {
			return GraphqlErrorBuilder.newError(env).message(ex.getMessage()).errorType(ErrorType.NOT_FOUND)
					.extensions(Map.of("code", "RECORD_NOT_FOUND")).build();
		}

		return null; // Let Spring handle other exceptions
	}
}

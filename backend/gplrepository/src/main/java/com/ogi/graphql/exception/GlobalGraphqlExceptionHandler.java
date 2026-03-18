package com.ogi.graphql.exception;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Component;

import com.ogi.factory.errors.GenericErrorException;
import com.ogi.factory.errors.RecordNotFoundException;
import com.ogi.factory.errors.UserAlreadyExistsException;
import com.ogi.factory.errors.ValidationErrorException;
import com.ogi.graphql.clientmapper.CommonMethodConstructor;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.execution.DataFetcherExceptionHandler;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import graphql.execution.DataFetcherExceptionHandlerResult;

@Component
public class GlobalGraphqlExceptionHandler implements DataFetcherExceptionHandler {

	@Override
	public CompletableFuture<DataFetcherExceptionHandlerResult> handleException(
			DataFetcherExceptionHandlerParameters handlerParameters) {
		Throwable exception = handlerParameters.getException();

		String errorCode = "400";

//		System.out.println("into exception");
//		System.out.println(exception.getCause());
//		System.out.println(exception.getMessage());
//		System.out.println(exception.getClass());

		if (exception.getCause() != null) {
			exception = exception.getCause();

			if (exception instanceof GenericErrorException) {
				errorCode = ((GenericErrorException) exception).getErrorCode();
			} else if (exception instanceof UserAlreadyExistsException) {
				errorCode = "101";
			} else if (exception instanceof RecordNotFoundException) {
				errorCode = "201";
			} else if (exception instanceof ValidationErrorException) {
				errorCode = "301";
			}

		}

		System.out.println(exception.getLocalizedMessage());

		GraphQLError error = GraphqlErrorBuilder.newError()
				.message(exception != null && exception.getMessage() != null ? exception.getMessage() : "unknown error")
				.path(handlerParameters.getPath()).location(handlerParameters.getSourceLocation())
				.extensions(Map.of("code", errorCode, "message",
						exception != null && exception.getMessage() != null ? exception.getMessage() : "unknown error"))
				.build();

		DataFetcherExceptionHandlerResult result = DataFetcherExceptionHandlerResult.newResult().error(error).build();

		return CompletableFuture.completedFuture(result);
	}

}

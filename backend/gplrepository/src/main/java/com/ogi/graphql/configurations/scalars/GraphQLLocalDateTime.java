package com.ogi.graphql.configurations.scalars;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.jetbrains.annotations.NotNull;

import graphql.language.StringValue;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import graphql.schema.GraphQLScalarType;

public class GraphQLLocalDateTime {

	static GraphQLScalarType INSTANCE;
	
	static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

	static {
		Coercing<LocalDateTime, String> coercing = new Coercing<LocalDateTime, String>() {

			@Override
			public @NotNull LocalDateTime parseLiteral(@NotNull Object input) throws CoercingParseLiteralException {
				if (input instanceof StringValue) {
					try {
						return LocalDateTime.parse(((StringValue) input).getValue(),ISO_FORMATTER);
					} catch (DateTimeParseException e) {
						throw new CoercingParseLiteralException("Invalid ISO-8601 DateTime literal: " + input, e);
					}
				}
				throw new CoercingParseLiteralException("Expected an StringValue literal for Datetime");
			}

			@Override
			public @NotNull LocalDateTime parseValue(@NotNull Object input) throws CoercingParseValueException {

				if (input instanceof String) {
					try {
						return LocalDateTime.parse((String) input,ISO_FORMATTER);
					} catch (DateTimeParseException e) {
						throw new CoercingParseValueException("Invalid LocalDateTime String : " + input, e);
					}
				}
				throw new CoercingParseValueException("Expected an LocalDateTime Object");

			}

			@Override
			public String serialize(@NotNull Object dataFetcherResult) throws CoercingSerializeException {
				if (dataFetcherResult instanceof LocalDateTime) {
					return ((LocalDateTime) dataFetcherResult).format(ISO_FORMATTER);
				}

				throw new CoercingSerializeException("Expected an LocalDateTime Object");
			}

		};

		INSTANCE = GraphQLScalarType.newScalar().name("LocalDateTime")
				.description("A universally unique identifier compliant LocalDateTIme Scalar").coercing(coercing).build();

	}

}

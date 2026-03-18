package com.ogi.graphql.configurations.scalars;

import java.time.Instant;
import java.time.format.DateTimeParseException;

import org.jetbrains.annotations.NotNull;

import graphql.language.StringValue;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import graphql.schema.GraphQLScalarType;

public class GraphQLDateTime {

	static GraphQLScalarType INSTANCE;

	static {
		Coercing<Instant, String> coercing = new Coercing<Instant, String>() {

			@Override
			public @NotNull Instant parseLiteral(@NotNull Object input) throws CoercingParseLiteralException {
				if (input instanceof StringValue) {
					try {
						return Instant.parse(((StringValue) input).getValue());
					} catch (DateTimeParseException e) {
						throw new CoercingParseLiteralException("Invalid ISO-8601 DateTime literal: " + input, e);
					}
				}
				throw new CoercingParseLiteralException("Expected an StringValue literal for Datetime");
			}

			@Override
			public @NotNull Instant parseValue(@NotNull Object input) throws CoercingParseValueException {

				if (input instanceof String) {
					try {
						return Instant.parse((String) input);
					} catch (DateTimeParseException e) {
						throw new CoercingParseValueException("Invalid ISO-8601 DateTime String : " + input, e);
					}
				}
				throw new CoercingParseValueException("Expected an Instant Object");

			}

			@Override
			public String serialize(@NotNull Object dataFetcherResult) throws CoercingSerializeException {
				if (dataFetcherResult instanceof Instant) {
					return ((Instant) dataFetcherResult).toString();
				}

				throw new CoercingSerializeException("Expected an Instant Object");
			}

		};

		INSTANCE = GraphQLScalarType.newScalar().name("DateTime")
				.description("A universally unique identifier compliant DateTIme Scalar").coercing(coercing).build();

	}

}

package com.ogi.graphql.configurations.scalars;

import java.util.UUID;

import graphql.language.StringValue;
import graphql.language.Value;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import graphql.schema.GraphQLScalarType;

public class GraphQLVoidScalar {

	static GraphQLScalarType INSTANCE;

	static {
		Coercing<Void, String> coercing = new Coercing<Void, String>() {

			@Override
			public String serialize(Object input) throws CoercingSerializeException {
				return null;
			}

			@Override
			public Void parseValue(Object input) throws CoercingParseValueException {
				return null;
			}

			@Override
			public Void parseLiteral(Object input) throws CoercingParseLiteralException {
				return null;
			}

			@Override
			public Value<?> valueToLiteral(Object input) {
				return null;
			}
		};

		INSTANCE = GraphQLScalarType.newScalar().name("Void")
				.description("A universally unique identifier compliant Void Scalar").coercing(coercing).build();
	}

}

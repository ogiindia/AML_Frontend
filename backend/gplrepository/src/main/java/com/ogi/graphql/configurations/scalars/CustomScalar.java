package com.ogi.graphql.configurations.scalars;

import graphql.schema.GraphQLScalarType;

public class CustomScalar {

	public static GraphQLScalarType UUID = GraphQLUUIDScalar.INSTANCE;
	public static GraphQLScalarType LONG = GraphQLLongScalar.INSTANCE;
	public static GraphQLScalarType DATETIME = GraphQLDateTime.INSTANCE;
	public static GraphQLScalarType LOCALDATETIME = GraphQLLocalDateTime.INSTANCE;
	public static GraphQLScalarType VOID = GraphQLVoidScalar.INSTANCE;

}

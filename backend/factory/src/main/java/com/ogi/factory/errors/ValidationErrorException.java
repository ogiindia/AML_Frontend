package com.ogi.factory.errors;

public class ValidationErrorException extends RuntimeException {

	public ValidationErrorException(String message) {
		super(message);
	}

}

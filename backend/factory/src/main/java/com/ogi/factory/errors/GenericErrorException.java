package com.ogi.factory.errors;

public class GenericErrorException extends RuntimeException {

	private final String errorCode;

	private final String userMessage;

	public GenericErrorException(String errorCode, String message) {
		super(message);
		this.errorCode = errorCode;
		this.userMessage = message;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public String getUserMessage() {
		return userMessage;
	}

}

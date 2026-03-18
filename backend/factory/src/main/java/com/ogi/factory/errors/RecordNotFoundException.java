package com.ogi.factory.errors;

public class RecordNotFoundException extends RuntimeException {

	public RecordNotFoundException(String message) {
		super(message);
	}
}

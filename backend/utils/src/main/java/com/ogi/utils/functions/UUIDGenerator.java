package com.ogi.utils.functions;

import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class UUIDGenerator {

	public static String createUUIDasString() {
		return UUID.randomUUID().toString().replace("-", "");
	}

	public static UUID createUUID() {
		return UUID.randomUUID();
	}

}

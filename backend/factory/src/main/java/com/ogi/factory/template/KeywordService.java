package com.ogi.factory.template;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class KeywordService {

	private final PasswordEncoder keywordEncoder;

	public KeywordService(PasswordEncoder keywordEncoder) {
		// TODO Auto-generated constructor stub
		this.keywordEncoder = keywordEncoder;
	}

	public String encode(String keyword) {
		return keywordEncoder.encode(keyword);
	}

	public boolean matches(String rawKeyword, String encodedKeyword) {
		return keywordEncoder.matches(rawKeyword, encodedKeyword);
	}

}

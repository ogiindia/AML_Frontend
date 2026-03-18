package com.ogi.factory.interfaces;

import java.util.HashMap;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtServiceInterface {

	String GenerateToken(String username, HashMap<String, Object> hs);

	String GenerateToken(String username);

	String extractUsername(String token);

	String extractprovider(String token);

	boolean validateToken(String token, UserDetails userDetails);

}

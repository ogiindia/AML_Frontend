package com.ogi.aml.Common;

public class RandomIdGenerate {
	
	public static String RandomDigit(String Key) {
		try {
			long number = (long) (Math.random() * 9000000000L) + 1000000000L;
			String randomNumberString = Key + String.valueOf(number);
			return randomNumberString;
		} catch (Exception ex) {
			return "";
		}
	}
	
	
}

package com.ogi.utils.ciphers;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map.Entry;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import com.fasterxml.jackson.databind.ObjectMapper;

public class AESEncryption {

	private static final String SECRET_KEY = "s+Uj6hsgZQkDkdgHmUi+blAvQiozx+iudjpsrknwasi=";
	private static final String CIPHER_TYPE = "AES/CBC/PKCS5Padding"; // PKCS5 = PKCS7 for AES
	private static final String ENC_TYPE = "AES";

	public static byte[] getKey() {

		byte[] key = Base64.getDecoder().decode(SECRET_KEY);

		if (key.length != 32) {
			throw new IllegalArgumentException("invalid key length : " + key.length + " bytes");
		}

		return key;
	}

	public static byte[] generateIV() {
		byte[] iv = new byte[16]; // 16 zero's as default IV
		new SecureRandom().nextBytes(iv);
		return iv;
	}

	public static String encrypt(String text)
			throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException,
			InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, IOException {
		Cipher cipher = Cipher.getInstance(CIPHER_TYPE);
		SecretKeySpec keySpec = new SecretKeySpec(getKey(), ENC_TYPE);
		byte[] iv = generateIV();
		IvParameterSpec ivSpec = new IvParameterSpec(iv);
		cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
		byte[] encryptedBytes = cipher.doFinal(text.getBytes("UTF-8"));

		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		outputStream.write(iv);
		outputStream.write(encryptedBytes);

		// add iv into the request
		encryptedBytes = outputStream.toByteArray();

		return Base64.getEncoder().encodeToString(encryptedBytes);
	}

	public static byte[] encrypttoBytes(String text)
			throws InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException,
			BadPaddingException, UnsupportedEncodingException, NoSuchAlgorithmException, NoSuchPaddingException {
		Cipher cipher = Cipher.getInstance(CIPHER_TYPE);
		SecretKeySpec keySpec = new SecretKeySpec(getKey(), ENC_TYPE);
		IvParameterSpec ivSpec = new IvParameterSpec(generateIV());
		cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
		byte[] encryptedBytes = cipher.doFinal(text.getBytes("UTF-8"));
		return encryptedBytes;
	}

	public static byte[] getKeyWithParam(String pramSECRET_KEY) {

		byte[] key = Base64.getDecoder().decode(pramSECRET_KEY);

		if (key.length != 32) {
			throw new IllegalArgumentException("invalid key length : " + key.length + " bytes");
		}

		return key;
	}

	public static String decryptwithKey(String encryptedText, String decKey) throws NoSuchAlgorithmException,
			NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException,
			BadPaddingException, UnsupportedEncodingException {

		Cipher cipher = Cipher.getInstance(CIPHER_TYPE);

		SecretKeySpec keySpec = new SecretKeySpec(getKeyWithParam(decKey), ENC_TYPE);

		byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);

		byte[] iv = Arrays.copyOf(decodedBytes, 16);

		System.out.println("decoded bytes count : " + decodedBytes.length);

		decodedBytes = Arrays.copyOfRange(decodedBytes, 16, decodedBytes.length);

		System.out.println("iv count : " + iv.length + "decode Bytes count : " + decodedBytes.length);
		cipher.init(Cipher.DECRYPT_MODE, keySpec, new IvParameterSpec(iv));

		byte[] decryptedBytes = cipher.doFinal(decodedBytes);

		return new String(decryptedBytes, "UTF-8");

	}

	private static String decrypt(String encryptedText) throws NoSuchAlgorithmException, NoSuchPaddingException,
			InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException,
			UnsupportedEncodingException {

		Cipher cipher = Cipher.getInstance(CIPHER_TYPE);

		SecretKeySpec keySpec = new SecretKeySpec(getKey(), ENC_TYPE);
		IvParameterSpec ivSpec = new IvParameterSpec(generateIV());

		cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);

		byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);

		byte[] decryptedBytes = cipher.doFinal(decodedBytes);

		return new String(decryptedBytes, "UTF-8");

	}

	public static void main(String args[]) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException,
			InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException,
			IOException {

		ObjectMapper obj = new ObjectMapper();

//		String plainText = "Hello world";
//		System.out.println("Text to encrypt : " + plainText);
//		String encryptedText = encrypt(plainText);
//		System.out.println("Encrypted Text : " + encryptedText);
		// String plainText =
		// "b32dykPjNcw2CB/7KAg/PzOHUj8ldGXnEE/D8Xiffhq12kA+iQu0Pu5xqOxT9n8/vBpQItlNSjfAQRJzui/RDjwys+f5dq13WWV8TvbjKyC6M2aAOVb8/c0w3GQbkyrmcFJTTHDi3LLGpukhrAetfN+QSYAHbqnoqHXJfhprCiMy/bPWyFKw/ytfRHYmrRVgxlmxvmG61oHyMPBea//fTTde2HK15v9s/U4GCLDx2/WuWNZcwJq9Zmd4yywmKZSIUFqaI63eb1NZDo35LUQjTRetutmLaDYUSxQ1gApUNng3YybP/3S/brRw5VvkFcTBsQ73WXVjPftwIunIVCUHOhOt2crUFZ2qWuoiK7xiaMDi+VaRNo2tQqZqL/JYkBbWOeDd6ZYuyfLnFRiaNa4pPRKr7gfS473F08CeRQibhfJkZjS7v76/1qfErW3ypgrHXkIkeKk3fJOB+pqyuevtuA==";
		String plainText = "{\r\n" + "  \"acknowledgement_no\": \"22909240073155\",\r\n"
				+ "  \"job_id\": \"IND-cf149277-650e-45d3-a297-876543757912\",\r\n" + "  \"transactions\": [\r\n"
				+ "    {\r\n" + "      \"rrn\": \"465499418386\",\r\n" + "      \"amount\": \"42030.34\",\r\n"
				+ "      \"transaction_datetime\": \"2024-10-14 00:00:00\",\r\n"
				+ "      \"disputed_amount\": \"14000\",\r\n" + "      \"txn_type\": \"CR\",\r\n"
				+ "      \"root_account_number\": \"50143287556\",\r\n" + "      \"root_bankid\": \"19\",\r\n"
				+ "      \"status_code\": \"00\",\r\n" + "      \"remarks\":\"Success\",\r\n"
				+ "      \"root_rrn_transaction_id\":\"465499418386\",\r\n"
				+ "      \"pos_transaction_id\": \"465499418386\"\r\n" + "    }\r\n" + "  ]\r\n" + "}";

		String encrypedBytes = encrypt(plainText);
		System.out.println(encrypedBytes);
//		HashMap<String, Object> hs = new HashMap<>();
//		hs.put("fraud_system", encrypedBytes);
//
//		byte[] encryptedBytes = obj.writeValueAsString(hs).getBytes(StandardCharsets.UTF_8);
//
//		String encryptedText = Base64.getEncoder().encodeToString(encryptedBytes);

		String decryptedText = decryptwithKey(encrypedBytes, SECRET_KEY);
		System.out.println("Decrypted Text : " + decryptedText);
	}

}

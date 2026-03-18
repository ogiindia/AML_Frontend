package com.ogi.utils.interceptors;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class CustomHttpServletRequestWrapper extends HttpServletRequestWrapper {
	private final byte[] body;

	public CustomHttpServletRequestWrapper(HttpServletRequest request) throws IOException {
		// TODO Auto-generated constructor stub
		super(request);
		this.body = request.getInputStream().readAllBytes();
	}

	public CustomHttpServletRequestWrapper(HttpServletRequest request, String transformedBody) throws IOException {
		super(request);
		// TODO Auto-generated constructor stub
		if (transformedBody == null || transformedBody.equals(null) || transformedBody.isBlank()) {
			this.body = request.getInputStream().readAllBytes();
		} else {
			this.body = transformedBody.getBytes();
		}
		System.out.println(body.toString());
	}

	@Override
	public ServletInputStream getInputStream() {
		ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(body);
		return new ServletInputStream() {

			@Override
			public int read() throws IOException {
				// TODO Auto-generated method stub
				return byteArrayInputStream.read();
			}

			@Override
			public void setReadListener(ReadListener arg0) {
				// TODO Auto-generated method stub

			}

			@Override
			public boolean isReady() {
				// TODO Auto-generated method stub
				return true;
			}

			@Override
			public boolean isFinished() {
				// TODO Auto-generated method stub
				return byteArrayInputStream.available() == 0;
			}
		};
	}

	public byte[] getBody() {
		return this.body;
	}

	@Override
	public BufferedReader getReader() {
		return new BufferedReader(new InputStreamReader(getInputStream(), StandardCharsets.UTF_8));
	}

}

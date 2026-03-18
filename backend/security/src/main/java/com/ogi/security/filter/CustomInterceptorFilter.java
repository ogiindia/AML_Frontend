package com.ogi.security.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

import com.ogi.utils.interceptors.ConfigInterceptor;

public class CustomInterceptorFilter extends OncePerRequestFilter {

	private final ConfigInterceptor interceptor;

	public CustomInterceptorFilter(ConfigInterceptor interceptor) {
		// TODO Auto-generated constructor stub
		this.interceptor = interceptor;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub

		try {

			interceptor.preHandle(request, response, null);
		} catch (Exception e) {
			throw new ServletException("Failed to process Interceptor ", e);
		}

		filterChain.doFilter(request, response);

	}

}

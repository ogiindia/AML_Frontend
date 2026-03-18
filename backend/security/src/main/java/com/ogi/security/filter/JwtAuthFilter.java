package com.ogi.security.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ogi.factory.interfaces.JwtServiceInterface;

@org.springframework.stereotype.Component
public class JwtAuthFilter extends OncePerRequestFilter {

	@Autowired
	private JwtServiceInterface jwtService;

	@Autowired
	UserDetailsService us;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub

		String authHeader = request.getHeader("Authorization");
		String token = null;
		String username = null;
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7);
			username = jwtService.extractUsername(token);
		}

		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

			UserDetails userDetails =  us.loadUserByUsername(username);

//			switch (provider.toUpperCase().trim()) {
//			case "JDBC":
//			case "LDAP":
//				userDetails =
//				break;
//			default:
//				break;
//			}

			if (userDetails != null && jwtService.validateToken(token, userDetails)) {
				// have to change dynamically to manage authorities
				UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities());
				authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authenticationToken);
			}

		}

		filterChain.doFilter(request, response);

	}

	public boolean isValidToken(String jwtToken) {

		String token = null;
		String username = null;
		if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
			token = jwtToken.substring(7);
			username = jwtService.extractUsername(token);
		} else {
			return false;
		}

		if (username != null) {
			UserDetails userDetails = us.loadUserByUsername(username);
			if (jwtService.validateToken(token, userDetails)) {
				return true;
			}

		}
		return false;

	}

	public String getUserNamefromToken(String jwtToken) {
		String token = null;
		if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
			token = jwtToken.substring(7);
		} else {
			token = jwtToken;
		}

		return token != null ? jwtService.extractUsername(token) : null;

	}

}

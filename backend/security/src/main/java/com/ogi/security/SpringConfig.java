package com.ogi.security;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ogi.security.filter.AuthEntryPoint;
import com.ogi.security.filter.JwtAuthFilter;
import com.ogi.security.provider.CustomUserDetailsAuthenticationProvider;
import com.ogi.utils.interceptors.ConfigInterceptor;

@SuppressWarnings("deprecation")
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SpringConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	JwtAuthFilter jwtAuthFilter;

	@Autowired
	UserDetailsService userDetailsService;

	@Autowired
	AuthEntryPoint authEntryPoint;

	@Autowired
	ConfigInterceptor configInterceptor;

	public SpringConfig() {
		// TODO Auto-generated constructor stub

		this.configInterceptor = new ConfigInterceptor();

		Properties configProperties = new Properties();

		try {
			configProperties.put("keyword", "password");
		} catch (Exception e) {
			e.printStackTrace();
		}

		configInterceptor.setConfigProperties(configProperties);

	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {

//		auth.authenticationProvider(customLdapAuthenticator);
		auth.authenticationProvider(new CustomUserDetailsAuthenticationProvider(userDetailsService, passwordEncoder()));

	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService((UserDetailsService) userDetailsService());
		authenticationProvider.setPasswordEncoder(passwordEncoder());
		return authenticationProvider;

	}

//	@Override
//	public void configure(WebSecurity web) throws Exception {
//		web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
//	}

	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		httpSecurity.csrf(csrf -> csrf.disable()).cors(cors -> cors.disable())
				.authorizeRequests(requests -> requests.antMatchers(HttpMethod.OPTIONS).permitAll())
				.authorizeRequests(requests -> requests
						.antMatchers("/", "/graphiql", "/graphql", "/static/**", "/app/v1/login", "/actuator/**")
						.permitAll().anyRequest().authenticated())
				.exceptionHandling(handling -> handling.authenticationEntryPoint(authEntryPoint))
				.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		// authenticationFilter
		httpSecurity.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
		// encryption filter

		// configMapFilter
//		httpSecurity.addFilterAfter(new CustomInterceptorFilter(configInterceptor),
//				UsernamePasswordAuthenticationFilter.class);

//		httpSecurity.httpBasic(basic -> basic.authenticationEntryPoint(authEntryPoint));

		httpSecurity.headers(headers -> headers.frameOptions().disable());
	}

}

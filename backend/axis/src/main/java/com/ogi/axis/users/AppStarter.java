package com.ogi.axis.users;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import com.ogi.axis.users.service.UserLoginService;

@Component
public class AppStarter implements ApplicationListener<ContextRefreshedEvent> {

	@Autowired
	UserLoginService userImpl;

	@Autowired
	ApplicationContext context;

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		// TODO Auto-generated method stub

		System.out.println("======================");
		System.out.println("App Started to Serve");
		System.out.println("======================");

		String[] names = context.getBeanDefinitionNames();
		Arrays.stream(names)
				.filter(n -> n.startsWith("ds__") || n.startsWith("emf__") || n.startsWith("tx__")
						|| n.equals("dataSource") || n.equals("entityManagerFactory") || n.equals("transactionManager"))
				.sorted()
				.forEach(n -> System.out.println("BEAN: " + n + " -> " + context.getBean(n).getClass().getName()));

		try {
			userImpl.createSystemUser("sysadmin", "Pass12!@");
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}

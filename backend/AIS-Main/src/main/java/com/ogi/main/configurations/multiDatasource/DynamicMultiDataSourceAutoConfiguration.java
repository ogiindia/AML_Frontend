package com.ogi.main.configurations.multiDatasource;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.RuntimeBeanReference;
import org.springframework.beans.factory.support.*;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.util.StringUtils;

import com.ogi.factory.annotations.DataSource;

import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;

import javax.annotation.PostConstruct;
import java.util.*;

/**
 * Registers named datasources (spring.datasource.<name>.*) discovered
 * from @DataSource on entities. Does NOT register primary canonical beans
 * (EarlyPrimaryRegistrar does that).
 */
@Configuration
public class DynamicMultiDataSourceAutoConfiguration implements ApplicationContextAware, EnvironmentAware {

	private ApplicationContext ctx;
	private Environment env;
	private ResourceLoader resourceLoader = new DefaultResourceLoader();

	@Override
	public void setEnvironment(Environment environment) {
		this.env = environment;
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.ctx = applicationContext;
	}

	@PostConstruct
	public void scanAndRegisterNamedDatasources() {
		// determine base packages
		List<String> basePackages = determineBasePackages();

		// scan for entities annotated with @DataSource
		ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false,
				ctx.getEnvironment());
		scanner.setResourceLoader(this.resourceLoader);
		scanner.addIncludeFilter(new AnnotationTypeFilter(DataSource.class));

		Map<String, Set<String>> dsToPackages = new HashMap<>();
		Set<String> entitiesWithoutAnnotation = new HashSet<>();

		for (String base : basePackages) {
			Set<BeanDefinition> candidates = scanner.findCandidateComponents(base);
			for (BeanDefinition bd : candidates) {
				String className = bd.getBeanClassName();
				if (className == null)
					continue;
				try {
					Class<?> cls = Class.forName(className);
					DataSource ann = cls.getAnnotation(DataSource.class);
					if (ann == null || !StringUtils.hasText(ann.value())) {
						entitiesWithoutAnnotation.add(cls.getName());
						continue;
					}
					String dsName = ann.value();
					String pkg = cls.getPackage().getName();
					dsToPackages.computeIfAbsent(dsName, k -> new HashSet<>()).add(pkg);
				} catch (ClassNotFoundException e) {
					throw new IllegalStateException("Failed loading class: " + className, e);
				}
			}
		}

		DefaultListableBeanFactory bf = (DefaultListableBeanFactory) ctx.getAutowireCapableBeanFactory();

		// register each named datasource (excluding primary)
		for (Map.Entry<String, Set<String>> e : dsToPackages.entrySet()) {
			String name = e.getKey();
			if ("primary".equalsIgnoreCase(name))
				continue; // primary already handled by EarlyPrimaryRegistrar
			registerOneDataSourceSet(bf, name, e.getValue());
		}

		// extend primary EMF packagesToScan if there are no-annotation entities
		if (!entitiesWithoutAnnotation.isEmpty()) {
			extendPrimaryEmfPackages(bf, entitiesWithoutAnnotation);
		}

		// ensure dynamic repositories registrar is registered
		if (!bf.containsBeanDefinition("dynamicJpaRepositoriesRegistrar")) {
			GenericBeanDefinition reg = new GenericBeanDefinition();
			reg.setBeanClass(DynamicJpaRepositoriesRegistrar.class);
			bf.registerBeanDefinition("dynamicJpaRepositoriesRegistrar", reg);
		}
	}

	private List<String> determineBasePackages() {
		String[] configured = env.getProperty("app.multids.base-packages", String[].class);
		if (configured != null && configured.length > 0)
			return Arrays.asList(configured);
		// best-effort via sun.java.command
		List<String> pkgs = new ArrayList<>();
		String main = System.getProperty("sun.java.command");
		if (StringUtils.hasText(main)) {
			String[] tokens = main.split(" ");
			String mainClass = tokens[0];
			int lastDot = mainClass.lastIndexOf('.');
			if (lastDot > 0)
				pkgs.add(mainClass.substring(0, lastDot));
		}
		if (pkgs.isEmpty())
			pkgs.add("");
		return pkgs;
	}

	private void registerOneDataSourceSet(DefaultListableBeanFactory bf, String name, Set<String> packages) {
		String dsPrefix = "spring.datasource." + name + ".";

		String jpaPrefix = "spring.jpa." + name + ".";

		String url = env.getProperty(dsPrefix + "url");
		if (!StringUtils.hasText(url)) {
			throw new IllegalStateException("Missing config for spring.datasource." + name + ".url");
		}
		String username = env.getProperty(dsPrefix + "username");
		String password = env.getProperty(dsPrefix + "password");
		String driver = env.getProperty(dsPrefix + "driver-class-name");

		String dsBeanName = "ds__" + name;
		if (!bf.containsBeanDefinition(dsBeanName)) {
			GenericBeanDefinition dsDef = new GenericBeanDefinition();
			dsDef.setBeanClass(DriverManagerDataSource.class);
			dsDef.getPropertyValues().add("driverClassName", driver);
			dsDef.getPropertyValues().add("url", url);
			dsDef.getPropertyValues().add("username", username);
			dsDef.getPropertyValues().add("password", password);
			bf.registerBeanDefinition(dsBeanName, dsDef);
		}

		String emfBeanName = "emf__" + name;
		System.out.println("abcd" + String.join(",", packages));
		if (!bf.containsBeanDefinition(emfBeanName)) {
			GenericBeanDefinition emfDef = new GenericBeanDefinition();
			emfDef.setBeanClass(LocalContainerEntityManagerFactoryBean.class);
			emfDef.getPropertyValues().add("dataSource", new RuntimeBeanReference(dsBeanName));
			emfDef.getPropertyValues().add("persistenceUnitName", name + "PU");
			emfDef.getPropertyValues().add("packagesToScan", String.join(",", packages));

			HibernateJpaVendorAdapter vendor = new HibernateJpaVendorAdapter();
			String dialect = env.getProperty(jpaPrefix + "properties.hibernate.dialect");
			if (StringUtils.hasText(dialect))
				vendor.setDatabasePlatform(dialect);
			emfDef.getPropertyValues().add("jpaVendorAdapter", vendor);

			Properties jpa = new Properties();
			String ddl = env.getProperty(jpaPrefix + "hibernate.ddl-auto");
			if (StringUtils.hasText(ddl))
				jpa.put("hibernate.hbm2ddl.auto", ddl);
			String showSql = env.getProperty(jpaPrefix + "show-sql");
			if (StringUtils.hasText(showSql))
				jpa.put("hibernate.show_sql", showSql);

			String defaultSchema = env.getProperty(jpaPrefix + "properties.hibernate.default_schema");

			if (StringUtils.hasText(defaultSchema)) {
				jpa.put("hibernate.default_schema", defaultSchema);
			}

			emfDef.getPropertyValues().add("jpaProperties", jpa);

			bf.registerBeanDefinition(emfBeanName, emfDef);
		}

		String txBeanName = "tx__" + name;
		if (!bf.containsBeanDefinition(txBeanName)) {
			GenericBeanDefinition txDef = new GenericBeanDefinition();
			txDef.setBeanClass(JpaTransactionManager.class);
			txDef.getPropertyValues().add("entityManagerFactory", new RuntimeBeanReference(emfBeanName));
			bf.registerBeanDefinition(txBeanName, txDef);
		}
	}

	/**
	 * Merge packages of entities without @DataSource into primary EMF's
	 * packagesToScan.
	 */
	private void extendPrimaryEmfPackages(DefaultListableBeanFactory bf, Set<String> entitiesWithoutAnnotation) {
		Set<String> pkgs = new HashSet<>();
		try {
			for (String cn : entitiesWithoutAnnotation) {
				Class<?> cls = Class.forName(cn);
				pkgs.add(cls.getPackage().getName());
			}
		} catch (ClassNotFoundException e) {
			throw new IllegalStateException("Failed to inspect entity classes", e);
		}

		String emfName = "entityManagerFactory";
		if (!bf.containsBeanDefinition(emfName)) {
			throw new IllegalStateException(
					"Primary entityManagerFactory not found. Ensure EarlyPrimaryRegistrar is active.");
		}

		BeanDefinition bd = bf.getBeanDefinition(emfName);
		Object existing = bd.getPropertyValues().get("packagesToScan");
		Set<String> merged = new LinkedHashSet<>();
		if (existing instanceof String) {
			String s = (String) existing;
			if (StringUtils.hasText(s))
				merged.addAll(Arrays.asList(s.split(",")));
		} else if (existing instanceof String[]) {
			merged.addAll(Arrays.asList((String[]) existing));
		} else if (existing != null) {
			merged.add(String.valueOf(existing));
		}
		merged.addAll(pkgs);
		bd.getPropertyValues().add("packagesToScan", String.join(",", merged));
	}
}

package com.ogi.factory.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataSource {
	/**
     * Logical datasource name. Must match a configured datasource in application.yml
     * under "app.datasources.<name>.*".
     */
	  String value();

}

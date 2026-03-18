package com.ogi.factory.interfaces;

import java.util.Set;

import com.ogi.factory.enums.Operations;

public interface BaseEntityManagerInterface {

	String getEntityID();

	Set<Operations> getSupportedOperations();

	String getAppID();

}

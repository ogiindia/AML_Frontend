package com.ogi.factory.interfaces;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public interface EntityInterface {
	Set<?> getEntities();

	List<?> getEntitiesByGroup(String groupname);

	boolean isEntityexists(String module, String action);

	Long getEntityById(String module, String action);

}

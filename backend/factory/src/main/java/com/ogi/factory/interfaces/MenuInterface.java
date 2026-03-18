package com.ogi.factory.interfaces;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;



@Service
public interface MenuInterface {
	List<?> getEntitiesByUserId(String userId);

	Set<?> getEntitiesIn(Set<?> en);

	List<?> getActiveapps();
}

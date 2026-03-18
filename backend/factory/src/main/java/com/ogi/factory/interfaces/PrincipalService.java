package com.ogi.factory.interfaces;

import java.util.List;

import com.ogi.factory.pojo.LoginResponseEntity;

public interface PrincipalService {

	public String getLoginUser();

	public LoginResponseEntity getSessionData();

	public boolean checkEntityisPresent(Long id);
	
	public List<?> getGroups();

	public Object getUserProfile();

	List<Long> getGroupsIds();

	Long getuserId();

}

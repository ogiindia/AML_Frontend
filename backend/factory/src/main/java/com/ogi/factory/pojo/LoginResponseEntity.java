package com.ogi.factory.pojo;

import java.util.List;

public class LoginResponseEntity {

	private String accessToken;
	private String status;
	private String userName;
	private String insId;
	private String divId;
	private List<?> role;
	private String provider;
	private List<?> menu;

	private String groupName;
	private String groupId;
	private List<?> activeApps;

	public LoginResponseEntity() {
		// TODO Auto-generated constructor stub
	}

	public LoginResponseEntity(String status, String accessToken) {
		// TODO Auto-generated constructor stub

		this.status = status;
		this.accessToken = accessToken;

	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public List<?> getRole() {
		return role;
	}

	public String getProvider() {
		return provider;
	}

	public void setProvider(String provider) {
		this.provider = provider;
	}

	public String getInsId() {
		return insId;
	}

	public void setInsId(String insId) {
		this.insId = insId;
	}

	public String getDivId() {
		return divId;
	}

	public void setDivId(String divId) {
		this.divId = divId;
	}

	public List<?> getMenu() {
		return menu;
	}

	public void setMenu(List<?> menu) {
		this.menu = menu;
	}

	public void setRole(List<?> role) {
		this.role = role;
	}

	public List<?> getActiveApps() {
		return activeApps;
	}

	public void setActiveApps(List<?> activeApps) {
		this.activeApps = activeApps;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

}

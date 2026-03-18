package com.ogi.axis.configuration.modal;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.ogi.factory.pojo.BaseEntity;
import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "AIS_CONFIG_VALUE_TB", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "configKey", "insId", "divId" }) })
public class ConfigurationValue extends UUIDBaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String module;
	private String configKey;
	private String value;
	private String scope = "default";
	private UUID insId;
	private UUID divId;
	private int ord;

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public String getConfigKey() {
		return configKey;
	}

	public void setConfigKey(String configKey) {
		this.configKey = configKey;
	}

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public UUID getInsId() {
		return insId;
	}

	public void setInsId(UUID insId) {
		this.insId = insId;
	}

	public UUID getDivId() {
		return divId;
	}

	public void setDivId(UUID divId) {
		this.divId = divId;
	}

	public int getOrder() {
		return ord;
	}

	public void setOrder(int order) {
		this.ord = order;
	}
	
	

}

package com.ogi.axis.configuration.modal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import com.ogi.factory.pojo.BaseEntity;
import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "AIS_CONFIG_TEMPLATE_TB")
public class Configuration extends UUIDBaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String module;
	private String configKey;
	private String defaultValue;
	private String grp;
	private String name;
	private String description;
	private String fieldType;

	@Column(length = 2048)
	private String optionData;
	private String scope = "default";
	private Integer ord;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getFieldType() {
		return fieldType;
	}

	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
	}


	public String getOptionData() {
		return optionData;
	}

	public void setOptionData(String optionData) {
		this.optionData = optionData;
	}

	public void setOrd(Integer ord) {
		this.ord = ord;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public String getGrp() {
		return grp;
	}

	public void setGrp(String grp) {
		this.grp = grp;
	}

	public String getConfigKey() {
		return configKey;
	}

	public void setConfigKey(String configKey) {
		this.configKey = configKey;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public int getOrd() {
		return ord;
	}

	public void setOrd(int ord) {
		this.ord = ord;
	}

}

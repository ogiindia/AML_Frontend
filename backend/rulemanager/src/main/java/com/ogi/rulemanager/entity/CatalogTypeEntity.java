package com.ogi.rulemanager.entity;

import java.util.List;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "AIS_RULE_CATALOG_TYPES")
@AttributeOverride(name = "id", column = @Column(name = "type_id"))
public class CatalogTypeEntity extends LongBaseEntity {

	private String name;

	private String fieldType;

	private String fieldData;

	@ManyToMany
	@JoinTable(name = "NGP_CATALOG_TYPES_EXPRESSION", joinColumns = @JoinColumn(name = "type_id"), inverseJoinColumns = @JoinColumn(name = "exp_id"))
//	@JsonManagedReference("group-users")
	private List<CatalogExpressionsEntity> allowedExpressions;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<CatalogExpressionsEntity> getAllowedExpressions() {
		return allowedExpressions;
	}

	public void setAllowedExpressions(List<CatalogExpressionsEntity> allowedExpressions) {
		this.allowedExpressions = allowedExpressions;
	}

	public String getFieldType() {
		return fieldType;
	}

	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
	}

	public String getFieldData() {
		return fieldData;
	}

	public void setFieldData(String fieldData) {
		this.fieldData = fieldData;
	}
	

}

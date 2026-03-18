package com.ogi.rulemanager.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "AIS_RULE_CATALOG_FIELDS")
public class CatalogEntity extends LongBaseEntity {

	private String name;

	private String alias;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "type_id")
	private CatalogTypeEntity type;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "schema_id")
	private SchemaMaster schema;

	private String mappingName;

	private String expression;

	private String customField1;

	private String customField2;

	private String customField3;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getMappingName() {
		return mappingName;
	}

	public void setMappingName(String mappingName) {
		this.mappingName = mappingName;
	}

	public String getExpression() {
		return expression;
	}

	public void setExpression(String expression) {
		this.expression = expression;
	}

	public String getCustomField1() {
		return customField1;
	}

	public void setCustomField1(String customField1) {
		this.customField1 = customField1;
	}

	public String getCustomField2() {
		return customField2;
	}

	public void setCustomField2(String customField2) {
		this.customField2 = customField2;
	}

	public String getCustomField3() {
		return customField3;
	}

	public void setCustomField3(String customField3) {
		this.customField3 = customField3;
	}

	public CatalogTypeEntity getType() {
		return type;
	}

	public void setType(CatalogTypeEntity type) {
		this.type = type;
	}

	public SchemaMaster getSchema() {
		return schema;
	}

	public void setSchema(SchemaMaster schema) {
		this.schema = schema;
	}

}

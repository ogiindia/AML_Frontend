package com.ogi.rulemanager.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name="NGP_SCHEMA_MASTER")
public class SchemaMaster extends LongBaseEntity {

	
	private String schemaName;
	
	private String schemaType = "SCHEMA";

	public String getSchemaName() {
		return schemaName;
	}

	public void setSchemaName(String schemaName) {
		this.schemaName = schemaName;
	}

	public String getSchemaType() {
		return schemaType;
	}

	public void setSchemaType(String schemaType) {
		this.schemaType = schemaType;
	}
	
	
	
	
}

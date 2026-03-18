package com.ogi.rulemanager.entity;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_CATALOG_EXPRESSION")
@AttributeOverride(name = "id", column = @Column(name = "exp_id"))
public class CatalogExpressionsEntity extends LongBaseEntity {

	private String name;

	private String exp;

	private String alias;

	private int inputfieldCount = 1;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getExp() {
		return exp;
	}

	public void setExp(String exp) {
		this.exp = exp;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public int getInputfieldCount() {
		return inputfieldCount;
	}

	public void setInputfieldCount(int inputfieldCount) {
		this.inputfieldCount = inputfieldCount;
	}

}

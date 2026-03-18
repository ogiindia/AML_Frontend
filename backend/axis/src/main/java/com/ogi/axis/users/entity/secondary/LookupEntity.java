package com.ogi.axis.users.entity.secondary;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.ogi.factory.annotations.DataSource;
import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_LOOKUP_TB")
public class LookupEntity extends LongBaseEntity {
	private String category;
	private String name;
	private String value;
	private int corder;

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public int getCorder() {
		return corder;
	}

	public void setCorder(int corder) {
		this.corder = corder;
	}

}

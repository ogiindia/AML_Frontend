package com.ogi.rulemanager.entity;

import java.util.List;
import java.util.UUID;

public class GroupInputDTO {

	private UUID id;
	private String type; // AND, OR
	private List<GroupOrConditionDTO> conditions;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<GroupOrConditionDTO> getConditions() {
		return conditions;
	}

	public void setConditions(List<GroupOrConditionDTO> conditions) {
		this.conditions = conditions;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

}

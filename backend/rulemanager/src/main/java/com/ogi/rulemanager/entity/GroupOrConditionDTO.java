package com.ogi.rulemanager.entity;

public class GroupOrConditionDTO {

	private GroupConditionDTO condition;
	private GroupInputDTO group;

	public GroupConditionDTO getCondition() {
		return condition;
	}

	public void setCondition(GroupConditionDTO condition) {
		this.condition = condition;
	}

	public GroupInputDTO getGroup() {
		return group;
	}

	public void setGroup(GroupInputDTO group) {
		this.group = group;
	}

}

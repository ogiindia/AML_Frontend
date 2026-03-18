package com.ogi.axis.users.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityManager;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.ogi.entityHub.entity.EntityMaster;
import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_GROUP_TB")
@AttributeOverride(name = "id", column = @Column(name = "grp_id"))
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class GroupEntity extends LongBaseEntity {

	private String groupName;

	private String groupDesc;

	@ManyToMany
	@JoinTable(name = "NGP_GROUP_USERS", joinColumns = @JoinColumn(name = "grp_id"), inverseJoinColumns = @JoinColumn(name = "profile_id"))
	@JsonManagedReference("group-users")
	private Set<UserProfile> users = new HashSet<UserProfile>();

	@ManyToMany
	@JoinTable(name = "NGP_ENT_GROUP", joinColumns = @JoinColumn(name = "grp_id"), inverseJoinColumns = @JoinColumn(name = "id"))
	@JsonManagedReference("group-entity")
	private Set<EntityMaster> entities = new HashSet<EntityMaster>();

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getGroupDesc() {
		return groupDesc;
	}

	public void setGroupDesc(String groupDesc) {
		this.groupDesc = groupDesc;
	}

	public Set<UserProfile> getUsers() {
		return users;
	}

	public Set<EntityMaster> getEntities() {
		return entities;
	}

	public void setEntities(Set<EntityMaster> entities) {
		this.entities = entities;
	}

	public void setUsers(Set<UserProfile> users) {
		this.users = users;
	}

}

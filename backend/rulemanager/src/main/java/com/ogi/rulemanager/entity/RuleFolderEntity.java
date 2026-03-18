package com.ogi.rulemanager.entity;

import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.ogi.factory.pojo.BaseEntity;
import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "AIS_RULE_FOLDERS")
public class RuleFolderEntity extends UUIDBaseEntity {

	private String folderName;

	private String description;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	private RuleFolderEntity parent;

	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<RuleFolderEntity> children;

	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public RuleFolderEntity getParent() {
		return parent;
	}

	public void setParent(RuleFolderEntity parent) {
		this.parent = parent;
	}

	public List<RuleFolderEntity> getChildren() {
		return children;
	}

	public void setChildren(List<RuleFolderEntity> children) {
		this.children = children;
	}

}

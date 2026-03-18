package com.ogi.entityHub.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_ENT_MASTER_TB")
public class EntityMaster extends LongBaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String entityAction;
	private String entityName;
	private String entityDesc;
	private String tid;
	private Boolean isMenu = false;
	private String module;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "appId", referencedColumnName = "id")
	private AppEntity app;

	
	public String getEntityName() {
		return entityName;
	}

	public void setEntityName(String entityName) {
		this.entityName = entityName;
	}

	public String getTid() {
		return tid;
	}

	public void setTid(String tid) {
		this.tid = tid;
	}

	public Boolean getIsMenu() {
		return isMenu;
	}

	public void setIsMenu(Boolean isMenu) {
		this.isMenu = isMenu;
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

	public AppEntity getApp() {
		return app;
	}

	public void setApp(AppEntity app) {
		this.app = app;
	}

	public String getEntityAction() {
		return entityAction;
	}

	public void setEntityAction(String entityAction) {
		this.entityAction = entityAction;
	}

	public String getEntityDesc() {
		return entityDesc;
	}

	public void setEntityDesc(String entityDesc) {
		this.entityDesc = entityDesc;
	}



}

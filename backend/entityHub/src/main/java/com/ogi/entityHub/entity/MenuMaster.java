package com.ogi.entityHub.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ogi.factory.pojo.LongBaseEntity;


@Entity
@Table(name = "NGP_MENU_MASTER")
public class MenuMaster extends LongBaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String menuName;

	private String sid;

	private String path;

	private String page;

	private Boolean subMenu;

	private String parentMenuID;

	@JsonIgnore
	private String makerID;

	@JsonIgnore
	private String checkerID;

	private String module;

	private Boolean showInMenu = true;

	private String icons;

	private Integer MenuOrder;
	
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "entityId", referencedColumnName = "id")
	private EntityMaster ent;


	public String getMenuName() {
		return menuName;
	}

	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}

	public String getSid() {
		return sid;
	}

	public void setSid(String sid) {
		this.sid = sid;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getPage() {
		return page;
	}

	public void setPage(String page) {
		this.page = page;
	}

	public Boolean getSubMenu() {
		return subMenu;
	}

	public void setSubMenu(Boolean subMenu) {
		this.subMenu = subMenu;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public String getParentMenuID() {
		return parentMenuID;
	}

	public void setParentMenuID(String parentMenuID) {
		this.parentMenuID = parentMenuID;
	}

	public String getMakerID() {
		return makerID;
	}

	public void setMakerID(String makerID) {
		this.makerID = makerID;
	}

	public String getCheckerID() {
		return checkerID;
	}

	public void setCheckerID(String checkerID) {
		this.checkerID = checkerID;
	}

	public String getIcons() {
		return icons;
	}

	public void setIcons(String icons) {
		this.icons = icons;
	}

	public Boolean getShowInMenu() {
		return showInMenu;
	}

	public void setShowInMenu(Boolean showInMenu) {
		this.showInMenu = showInMenu;
	}

	public Integer getMenuOrder() {
		return MenuOrder;
	}

	public void setMenuOrder(Integer menuOrder) {
		MenuOrder = menuOrder;
	}

	public EntityMaster getEnt() {
		return ent;
	}

	public void setEnt(EntityMaster ent) {
		this.ent = ent;
	}
	
	

}

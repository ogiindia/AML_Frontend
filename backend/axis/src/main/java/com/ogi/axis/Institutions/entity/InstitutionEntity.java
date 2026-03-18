package com.ogi.axis.Institutions.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "AIS_INS_TB")
public class InstitutionEntity extends UUIDBaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String institutionId;

	private String institutionName;


	public String getInstitutionId() {
		return institutionId;
	}

	public void setInstitutionId(String institutionId) {
		this.institutionId = institutionId;
	}

	public String getInstitutionName() {
		return institutionName;
	}

	public void setInstitutionName(String institutionName) {
		this.institutionName = institutionName;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}


}

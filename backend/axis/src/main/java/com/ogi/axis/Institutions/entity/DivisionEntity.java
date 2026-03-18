package com.ogi.axis.Institutions.entity;

import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.BaseEntity;
import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_INS_DIV_TB")
public class DivisionEntity extends LongBaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String divisionId;

	private String divisionName;

//	private UUID institutionId;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "insId", referencedColumnName = "id")
	private InstitutionEntity institution;

	public String getDivisionId() {
		return divisionId;
	}

	public void setDivisionId(String divisionId) {
		this.divisionId = divisionId;
	}

	public String getDivisionName() {
		return divisionName;
	}

	public void setDivisionName(String divisionName) {
		this.divisionName = divisionName;
	}

	public InstitutionEntity getInstitution() {
		return institution;
	}

	public void setInstitution(InstitutionEntity institution) {
		this.institution = institution;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}

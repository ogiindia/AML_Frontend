package com.ogi.axis.Institutions.entity;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_EVENTS_META_TB")
public class EventsMeta extends LongBaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String metaName;
	private String metaType;
	private String metaValue;
	private String customField1;
	private String customField2;
	private String customField3;
	private String customField4;
	private String customField5;

	@ManyToOne
	@JoinColumn(name = "eventId", nullable = false)
	private EventsEntity event;

	public String getMetaName() {
		return metaName;
	}

	public void setMetaName(String metaName) {
		this.metaName = metaName;
	}

	public String getMetaValue() {
		return metaValue;
	}

	public void setMetaValue(String metaValue) {
		this.metaValue = metaValue;
	}

	public EventsEntity getEvent() {
		return event;
	}

	public void setEvent(EventsEntity event) {
		this.event = event;
	}

	public String getMetaType() {
		return metaType;
	}

	public void setMetaType(String metaType) {
		this.metaType = metaType;
	}

	public String getCustomField1() {
		return customField1;
	}

	public void setCustomField1(String customField1) {
		this.customField1 = customField1;
	}

	public String getCustomField2() {
		return customField2;
	}

	public void setCustomField2(String customField2) {
		this.customField2 = customField2;
	}

	public String getCustomField3() {
		return customField3;
	}

	public void setCustomField3(String customField3) {
		this.customField3 = customField3;
	}

	public String getCustomField4() {
		return customField4;
	}

	public void setCustomField4(String customField4) {
		this.customField4 = customField4;
	}

	public String getCustomField5() {
		return customField5;
	}

	public void setCustomField5(String customField5) {
		this.customField5 = customField5;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	

}

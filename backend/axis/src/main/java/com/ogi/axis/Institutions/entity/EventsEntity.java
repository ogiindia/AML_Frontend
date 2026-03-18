package com.ogi.axis.Institutions.entity;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.CascadeType;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_EVENT_MASTER_TB")
public class EventsEntity extends LongBaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String eventName;
	private Boolean isEnabled;

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public boolean isEnabled() {
		return isEnabled;
	}

	public void setEnabled(boolean isEnabled) {
		this.isEnabled = isEnabled;
	}
}

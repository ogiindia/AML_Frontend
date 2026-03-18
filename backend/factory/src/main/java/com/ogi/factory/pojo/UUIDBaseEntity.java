package com.ogi.factory.pojo;

import java.util.UUID;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;

import com.ogi.utils.functions.UUIDGenerator;

@MappedSuperclass
public abstract class UUIDBaseEntity extends BaseEntity {

	@Id
	private UUID id;

	@PrePersist
	protected void onUUIDPrePersist() {

		if (this.id == null) {
			this.id = UUIDGenerator.createUUID();
		}
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

}

package com.ogi.factory.pojo;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class LongBaseEntity extends BaseEntity {


	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
	private Long id;


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}
	
	
	

}

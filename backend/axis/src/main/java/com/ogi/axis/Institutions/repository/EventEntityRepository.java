package com.ogi.axis.Institutions.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.axis.Institutions.entity.EventsEntity;

@Repository
public interface EventEntityRepository extends JpaRepository<EventsEntity, Long> {
	
	

}

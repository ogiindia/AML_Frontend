package com.ogi.axis.Institutions.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.axis.Institutions.entity.EventsMeta;

public interface EventMetaRepository extends JpaRepository<EventsMeta, Long> {

	List<EventsMeta> findByMetaType(String type);
	
	Optional<EventsMeta> findByMetaTypeAndMetaNameAndEvent_id(String metaType,String metaName,Long eventId);

}

package com.ogi.axis.Institutions.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ogi.axis.Institutions.entity.DivisionEntity;

@Repository
public interface DivisionEntityRepository extends JpaRepository<DivisionEntity, Long> {

	List<DivisionEntity> findByInstitution_Id(@Param("insId") UUID id);

}

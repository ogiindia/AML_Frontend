package com.ogi.axis.Institutions.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.axis.Institutions.entity.InstitutionEntity;

@Repository
public interface InstituitionEntityRepository extends JpaRepository<InstitutionEntity, UUID> {

}

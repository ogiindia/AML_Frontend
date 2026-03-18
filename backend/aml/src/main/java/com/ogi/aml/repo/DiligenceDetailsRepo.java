package com.ogi.aml.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.aml.entity.DiligenceDetailsEntity;


@Repository
public interface DiligenceDetailsRepo extends JpaRepository<DiligenceDetailsEntity, String>{

}

package com.ogi.aml.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.aml.entity.SanctionConfigEntity;
@Repository
public interface SanctionConfigRepo extends JpaRepository<SanctionConfigEntity, String> {
	
}

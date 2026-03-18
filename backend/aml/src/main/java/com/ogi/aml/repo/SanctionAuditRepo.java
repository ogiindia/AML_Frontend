package com.ogi.aml.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.aml.entity.SanctionAuditEntity;

public interface SanctionAuditRepo  extends JpaRepository<SanctionAuditEntity, String> {

}

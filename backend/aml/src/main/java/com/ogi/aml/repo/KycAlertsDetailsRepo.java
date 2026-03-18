package com.ogi.aml.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.aml.entity.CustomerEntity;
import com.ogi.aml.entity.KycAlertsEntity;

public interface KycAlertsDetailsRepo extends JpaRepository<KycAlertsEntity, Long> {

}

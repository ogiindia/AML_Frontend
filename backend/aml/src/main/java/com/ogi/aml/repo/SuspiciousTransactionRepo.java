package com.ogi.aml.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.aml.entity.SuspiciousTransactionEntity;

public interface SuspiciousTransactionRepo extends JpaRepository<SuspiciousTransactionEntity, String>{

}


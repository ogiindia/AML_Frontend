package com.ogi.aml.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.aml.entity.TransactionEntity;

public interface TransactionRepo extends JpaRepository<TransactionEntity, String>,TransactionCustomRepo {

}

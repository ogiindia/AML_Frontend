package com.ogi.aml.repo;

import java.util.Optional;

import com.ogi.aml.entity.CustomerEntity;

public interface CustomerCustomRepo {
    Optional<CustomerEntity> findByIdFromParquet(String customerId);
}

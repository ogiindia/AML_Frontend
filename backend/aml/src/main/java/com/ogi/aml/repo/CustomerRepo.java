package com.ogi.aml.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.aml.entity.CustomerEntity;


public interface CustomerRepo extends JpaRepository<CustomerEntity, String>, CustomerCustomRepo {

}

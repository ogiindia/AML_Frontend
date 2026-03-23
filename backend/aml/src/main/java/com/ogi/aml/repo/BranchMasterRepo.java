package com.ogi.aml.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.aml.entity.BranchMaster;
import com.ogi.aml.entity.BranchMasterEntity;

public interface BranchMasterRepo extends JpaRepository<BranchMasterEntity, String>, BranchCustomRepo {

}

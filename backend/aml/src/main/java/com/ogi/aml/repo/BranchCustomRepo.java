package com.ogi.aml.repo;

import java.util.Optional;

import com.ogi.aml.entity.BranchMasterEntity;

public interface BranchCustomRepo {
	Optional<BranchMasterEntity> findByBranchFromParquet(String branchCode);

}

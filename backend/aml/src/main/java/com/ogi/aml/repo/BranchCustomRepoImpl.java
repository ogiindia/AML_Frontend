package com.ogi.aml.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ogi.aml.entity.BranchMasterEntity;
import com.ogi.aml.parquet.ParquetService;
import com.ogi.aml.parquet.SearchFieldsDTO;

@Repository
public class BranchCustomRepoImpl implements BranchCustomRepo{
	@Autowired
	private ParquetService parquetService;

	@Override
	public Optional<BranchMasterEntity> findByBranchFromParquet(String branchCode) {

		SearchFieldsDTO srcField = new SearchFieldsDTO(null, null, null, null, null,branchCode);

		List<BranchMasterEntity> list = parquetService.executeQueryReturnEntity("BRANCH", BranchMasterEntity.class,
				srcField);

		if (list != null && !list.isEmpty()) {
			return Optional.of(list.get(0));
		}

		return Optional.empty();
	}
}

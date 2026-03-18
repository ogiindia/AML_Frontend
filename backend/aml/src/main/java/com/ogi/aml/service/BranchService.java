package com.ogi.aml.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.aml.entity.BranchMaster;

@Service
public class BranchService extends BaseResolver<BranchMaster, Long> {

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "BRANCH";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ_BY_ID, Operations.READ_BY_PAGING, Operations.UPDATE, Operations.DISABLE,
				Operations.DELETE, Operations.SAVE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "AML";
	}

}

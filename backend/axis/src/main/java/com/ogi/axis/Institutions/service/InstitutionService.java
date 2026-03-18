package com.ogi.axis.Institutions.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.axis.Institutions.entity.InstitutionEntity;

@Service
public class InstitutionService extends BaseResolver<InstitutionEntity, UUID> {
	private static final String entityID = "INS";

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return entityID;
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ, Operations.SAVE, Operations.READ_BY_PAGING, Operations.DISABLE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return Commons.CORE.toString();
	}

}

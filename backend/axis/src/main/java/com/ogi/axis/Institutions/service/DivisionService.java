package com.ogi.axis.Institutions.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.factory.annotations.GraphQLOverride;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.annotations.Param;
import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.axis.Institutions.entity.DivisionEntity;
import com.ogi.axis.Institutions.repository.DivisionEntityRepository;
import com.ogi.axis.Institutions.repository.InstituitionEntityRepository;

@Service
public class DivisionService extends BaseResolver<DivisionEntity, UUID> {

	@Autowired
	InstituitionEntityRepository institutionRepo;

	@Autowired
	DivisionEntityRepository divisionRepo;

	private static final String entityID = "DIVISION";

	@GraphQLQuery
	public String demo() {
		return "demo";
	}

	@GraphQLQuery
	public List<DivisionEntity> findDivisionByInstituionId(UUID id) {
		if (id != null) {
			return divisionRepo.findByInstitution_Id(id);
		} else {
			return null;
		}
	}

	@Override
	@Transactional
	public DivisionEntity save(@Param(value = "div") DivisionEntity entity) {
		if (entity.getInstitution() != null && entity.getInstitution().getId() != null)
			entity.setInstitution(institutionRepo.findById(entity.getInstitution().getId()).get());

		return super.save(entity);
	}

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return entityID;
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ, Operations.READ_BY_PAGING, Operations.SAVE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return Commons.CORE.toString();
	}

}

package com.ogi.axis.users.service;

import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.annotations.Required;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.axis.users.entity.secondary.LookupEntity;
import com.ogi.axis.users.repository.LookupCategoryEntityRepo;

@Service
public class LookupCategoryService extends BaseResolver<LookupEntity, Long> {

	@Autowired
	LookupCategoryEntityRepo lookupRep;

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "LOOKUP";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of();
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "CORE";
	}

	@GraphQLQuery
	public List<LookupEntity> lookupCategory(@Required String category) {
		return lookupRep.findByCategoryOrderByCorderAsc(category);
	}

	@GraphQLMutation
	@Transactional
	public List<LookupEntity> savelookupService(List<LookupEntity> entity) {
		return super.saveAll(entity);
	}

}

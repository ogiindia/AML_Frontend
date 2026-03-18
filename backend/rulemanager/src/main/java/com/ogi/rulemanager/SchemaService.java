package com.ogi.rulemanager;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.rulemanager.entity.SchemaMaster;
import com.ogi.rulemanager.repo.SchemaMasterEntityRepo;

@Service
public class SchemaService extends BaseResolver<SchemaMaster, Long> {

	@Autowired
	SchemaMasterEntityRepo schemaRepo;

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "SCHEMA";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.SAVE, Operations.UPDATE, Operations.READ);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "RULE";
	}

	@GraphQLQuery
	public List<SchemaMaster> listSchemaMasterByType(String type) {
		return schemaRepo.findByschemaType(type);
	}

}

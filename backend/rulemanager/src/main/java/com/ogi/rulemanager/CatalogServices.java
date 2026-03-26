package com.ogi.rulemanager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.transaction.Transactional;
import javax.xml.catalog.CatalogException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.rulemanager.entity.CatalogEntity;
import com.ogi.rulemanager.entity.CatalogExpressionsEntity;
import com.ogi.rulemanager.entity.CatalogTypeEntity;
import com.ogi.rulemanager.entity.FactConditionEntity;
import com.ogi.rulemanager.entity.FactsEntity;
import com.ogi.rulemanager.entity.SchemaMaster;
import com.ogi.rulemanager.repo.FactConditionRepo;
import com.ogi.rulemanager.repo.RuleCatalogEntityRepository;
import com.ogi.rulemanager.repo.RuleCatalogExpressionRepo;
import com.ogi.rulemanager.repo.RuleCatalogTypesRespository;
import com.ogi.rulemanager.repo.RuleFactRepository;

@Service
public class CatalogServices extends BaseResolver<CatalogEntity, Long> {

	@Autowired
	RuleCatalogTypesRespository catalogTypeRepo;

	@Autowired
	RuleCatalogEntityRepository catalogRepo;

	@Autowired
	RuleCatalogExpressionRepo expressionRepo;

	@Autowired
	RuleFactRepository factRepo;

	@Autowired
	FactConditionRepo factCondRepo;

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "CATALOG";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ, Operations.SAVE, Operations.DISABLE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "RULE_ENGINE";
	}

	@GraphQLQuery
	public List<FactsEntity> getFacts() {
		return factRepo.findAll();
	}

	@GraphQLQuery
	public List<FactConditionEntity> getFactsConditions() {
		return factCondRepo.findByStatus("1");
	}

	@GraphQLMutation
	@Transactional
	public List<CatalogEntity> saveCatalogs(List<CatalogEntity> entities, Long schemaId) {
		List<CatalogEntity> catalogs = catalogRepo.findBySchema_Id(schemaId);

		// cannot delete it as it is referenced in rule...
//		for (CatalogEntity catalogEntity : catalogs) {
//			super.delete(catalogEntity.getId());
//		}

		for (CatalogEntity catalogEntity : entities) {

			SchemaMaster schemaMaster = new SchemaMaster();
			schemaMaster.setId(schemaId);

			catalogEntity.setSchema(schemaMaster);
		}

		return super.saveAll(entities);
	}
	@Transactional
	public List<CatalogEntity> saveAllCatalogs(List<CatalogEntity> entities, Long schemaId) {
		

		for (CatalogEntity catalogEntity : entities) {

			SchemaMaster schemaMaster = new SchemaMaster();
			schemaMaster.setId(schemaId);

			catalogEntity.setSchema(schemaMaster);
		}

		return super.saveAll(entities);
	}
	

	private CatalogTypeEntity findByType(String type) {
		return catalogTypeRepo.findByName(type).orElseThrow();
	}

	public void createinitalTypes() {

		Map<String, String> allowedTypes = new HashMap<>();

		allowedTypes.put("STRING", "==,");
		allowedTypes.put("NUMBER", "==,>,<,>=,<=");
		allowedTypes.put("DATE", "==,>,<,>=,<=");
		allowedTypes.put("BOOLEAN", "==");
		allowedTypes.put("FUNCTION", "");

		for (String str : allowedTypes.keySet()) {

			Optional<CatalogTypeEntity> optionalType = catalogTypeRepo.findByName(str);

			if (optionalType.isEmpty()) {
				CatalogTypeEntity cataType = new CatalogTypeEntity();

				cataType.setName(str);
//				cataType.setAllowedExpressions(allowedTypes.get(str));

				catalogTypeRepo.save(cataType);
			}

		}

	}

	@GraphQLQuery
	public List<CatalogEntity> findCatalogBySchemaMaster(Long schemaId) {
		List<CatalogEntity> catalog = catalogRepo.findBySchema_Id(schemaId);

		return catalog;
	}

	@GraphQLQuery
	public List<CatalogTypeEntity> listCatalogTypes() {
		return catalogTypeRepo.findAll();
	}

	public CatalogExpressionsEntity findByExpressionId(Long id) {
		return expressionRepo.findById(id).orElseThrow(() -> new RuntimeException("No EXP found"));
	}

//	public CatalogEntity createCatalog(String name, String alias, String schemaname, String mappingName,
//			String expression, String type) {
//
//		Optional<CatalogEntity> optionalCatalog = catalogRepo.findByNameAndSchemaName(name, schemaname);
//
//		if (optionalCatalog.isEmpty()) {
//			CatalogEntity catalog = new CatalogEntity();
//
//			catalog.setAlias(alias);
//			catalog.setName(name);
//			catalog.setExpression(expression);
//			catalog.setMappingName(mappingName);
//			catalog.setType(this.findByType(type));
//			return catalogRepo.save(catalog);
//		}
//
//		return optionalCatalog.get();
//	}

}

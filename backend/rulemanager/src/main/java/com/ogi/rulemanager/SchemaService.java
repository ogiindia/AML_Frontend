package com.ogi.rulemanager;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.file.pro.core.efrmsrv.startup.config.ColumnMapping;
import com.aml.file.pro.core.efrmsrv.startup.config.TransactionMapping;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.interfaces.RuleManagerInterface;
import com.ogi.factory.template.BaseResolver;
import com.ogi.rulemanager.entity.CatalogEntity;
import com.ogi.rulemanager.entity.CatalogTypeEntity;
import com.ogi.rulemanager.entity.SchemaMaster;
import com.ogi.rulemanager.repo.RuleCatalogEntityRepository;
import com.ogi.rulemanager.repo.RuleCatalogTypesRespository;
import com.ogi.rulemanager.repo.SchemaMasterEntityRepo;

@Service
public class SchemaService extends BaseResolver<SchemaMaster, Long> implements RuleManagerInterface {

	@Autowired
	SchemaMasterEntityRepo schemaRepo;

	@Autowired
	RuleCatalogEntityRepository catalogRepo;
	
	@Autowired
	RuleCatalogTypesRespository catalogTypeRepo;
	
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

	public String setMappingList(List<TransactionMapping> lstMap) {

		int totalInsertedSchemas = 0;
		int totalNewColumns = 0;

		for (TransactionMapping config : lstMap) {

			if (config.getShortName() == null || config.getShortName().trim().isEmpty()) {
				continue;
			}

			String shortName = config.getShortName().trim();

			// ✅ 1. Check schema
			Optional<SchemaMaster> schemaOpt = schemaRepo.findByschemaName(shortName);

			SchemaMaster schema;

			if (schemaOpt.isEmpty()) {

				// 🔥 New schema
				schema = new SchemaMaster();
				schema.setSchemaName(shortName);

				schema = schemaRepo.save(schema);
				totalInsertedSchemas++;

			} else {
				schema = schemaOpt.get();
			}

			// ✅ 2. Existing columns
			List<CatalogEntity> existingFields = catalogRepo.findBySchema_Id(schema.getId());

			Set<String> existingCols = existingFields.stream().map(f -> f.getName().toLowerCase().trim())
					.collect(Collectors.toSet());

			List<CatalogEntity> newFields = new ArrayList<>();

			// ✅ 3. Insert only new columns
			if (config.getColumns() != null) {

				for (ColumnMapping col : config.getColumns()) {

					if (col.getTo() == null)
						continue;

					String colName = col.getTo().toLowerCase().trim();

					if (!existingCols.contains(colName)) {

						CatalogEntity field = new CatalogEntity();
						
						CatalogTypeEntity typ=findByType(col.getType());
						

						field.setSchema(schema);
						field.setName(col.getTo());
						field.setAlias(col.getTo());

						newFields.add(field);
					}
				}
			}

			// ✅ 4. Save only new fields
			if (!newFields.isEmpty()) {
				catalogRepo.saveAll(newFields);
				totalNewColumns += newFields.size();
			}
		}

		return "Schemas added: " + totalInsertedSchemas + ", New columns added: " + totalNewColumns;
	}
	
	
	private CatalogTypeEntity findByType(String type) {
		return catalogTypeRepo.findByName(type).orElseThrow();
	}


}

package com.ogi.rulemanager;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.spi.ResourceBundleControlProvider;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.annotations.Required;
import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.rulemanager.entity.CatalogEntity;
import com.ogi.rulemanager.entity.CatalogExpressionsEntity;
import com.ogi.rulemanager.entity.GroupConditionDTO;
import com.ogi.rulemanager.entity.GroupInputDTO;
import com.ogi.rulemanager.entity.GroupOrConditionDTO;
import com.ogi.rulemanager.entity.NormalizedRuleEntity;
import com.ogi.rulemanager.entity.RuleConditionsEntity;
import com.ogi.rulemanager.entity.RuleDTO;
import com.ogi.rulemanager.entity.RuleEntity;
import com.ogi.rulemanager.entity.RuleFolderEntity;
import com.ogi.rulemanager.entity.RuleGroupsEntity;
import com.ogi.rulemanager.entity.dto.NormalizedRule;
import com.ogi.rulemanager.repo.NormalizedRuleEntityRepo;
import com.ogi.rulemanager.repo.RuleConditionRepository;
import com.ogi.rulemanager.repo.RuleFolderRepository;
import com.ogi.rulemanager.repo.RuleGroupRepository;
import com.ogi.rulemanager.repo.RuleRepository;

@Service
@Transactional
public class RuleServices extends BaseResolver<RuleEntity, UUID> {

	@Autowired
	RuleRepository ruleRepo;

	@Autowired
	RuleFolderRepository ruleFolderRepo;

	@Autowired
	RuleGroupRepository ruleGroupRepo;

	@Autowired
	RuleConditionRepository ruleCondRepository;

	@Autowired
	ObjectMapper obj;

	@Autowired
	RuleConverterService ruleConverter;

	@Autowired
	NormalizedRuleEntityRepo normalizedRuleRepo;

	@Autowired
	CatalogServices catalogService;

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "RULE";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		return Set.of(Operations.READ, Operations.READ_BY_ID, Operations.READ_BY_PAGING, Operations.UPDATE,
				Operations.SAVE, Operations.DELETE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "RULE_ENGINE";
	}

	@Override
	public void delete(UUID id) {

		RuleEntity ruleEntity = ruleRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Rule not found: " + id));

		// find by ruleEntity

		Optional<NormalizedRuleEntity> nre = normalizedRuleRepo.findByRuleName(ruleEntity.getRuleName());

		if (nre.isPresent()) {
			normalizedRuleRepo.delete(nre.get());
		}

		super.delete(id);

	}

	@GraphQLQuery
	public RuleEntity findByRuleName(String ruleName) {
		RuleEntity rule = ruleRepo.findByRuleName(ruleName).orElseThrow();

		NormalizedRule convertedRule = ruleConverter.convert(rule);

		try {
			System.out.println(obj.writeValueAsString(convertedRule));
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return ruleRepo.findByRuleName(ruleName).orElseThrow();
	}

	@GraphQLMutation
	public RuleEntity saveRule(RuleDTO rule) {
		RuleEntity ruleEntity = new RuleEntity();
		if (rule.getRuleId() != null) {

			Optional<RuleEntity> optionalRuleEntity = ruleRepo.findById(rule.getRuleId());
			if (optionalRuleEntity.isPresent()) {
				ruleEntity = optionalRuleEntity.get();
			}
		} else {
			// new entry check rule name exists

			Optional<RuleEntity> optionalRuleEntity = ruleRepo.findByRuleName(rule.getRuleName());

			if (optionalRuleEntity.isPresent())
				throw new RuntimeException("Rule name already exists !!!");

		}

		RuleGroupsEntity ruleGroups = mapGroupInput(rule.getGroup(), ruleEntity);
		ruleEntity.setRuleName(rule.getRuleName());
		ruleEntity.setPriority(Integer.parseInt(rule.getPriority()));
		ruleEntity.setDescription(rule.getDescription());
		ruleEntity.setOffsetUnit(rule.getOffsetUnit());
		ruleEntity.setOffsetValue(rule.getOffsetValue());
		ruleEntity.setAlertCategory(rule.getAlertCategory());
		ruleEntity.setTxnMode(rule.getTxnMode());
		ruleEntity.setStatus(rule.getRuleMode().equals("PROD") ? true : false);

		Optional<RuleFolderEntity> folderEntity = ruleFolderRepo.findById(rule.getFolderId());
		if (folderEntity.isPresent()) {
			ruleEntity.setFolder(folderEntity.get());
		}

		ruleEntity.setGroups(ruleGroups);

		ruleEntity = ruleRepo.save(ruleEntity);

		// normalize and store it in different table for easy processing..
		NormalizedRuleEntity nme = new NormalizedRuleEntity();

		Optional<NormalizedRuleEntity> optionalRuleEntity = normalizedRuleRepo.findByRuleName(ruleEntity.getRuleName());

		if (optionalRuleEntity.isPresent()) {
			nme = optionalRuleEntity.get();
		}

		try {
			nme.setActive(ruleEntity.getStatus());
			nme.setPriority(ruleEntity.getPriority());
			nme.setRuleDescription(ruleEntity.getDescription());
			nme.setOffsetUnit(ruleEntity.getOffsetUnit());
			nme.setOffsetValue(ruleEntity.getOffsetValue());
			nme.setAlertCategory(ruleEntity.getAlertCategory());
			nme.setPayload(obj.writeValueAsString(ruleConverter.convert(ruleEntity)));
			nme.setRuleName(ruleEntity.getRuleName());
			nme.setTxnMode(ruleEntity.getTxnMode());
			normalizedRuleRepo.save(nme);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return ruleEntity;

	}

	@GraphQLQuery
	public RuleDTO getRuleById(UUID id) {
		RuleEntity rule = ruleRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Rule not found: " + id));

		return mapToRuleDTO(rule);
	}

	private RuleDTO mapToRuleDTO(RuleEntity rule) {
		RuleDTO dto = new RuleDTO();

		dto.setRuleId(rule.getId());
		dto.setRuleName(rule.getRuleName());
		dto.setDescription(rule.getDescription());
		dto.setPriority(rule.getPriority() != null ? String.valueOf(rule.getPriority()) : null);
		dto.setAlertCategory(rule.getAlertCategory());
		dto.setOffsetUnit(rule.getOffsetUnit());
		dto.setOffsetValue(rule.getOffsetValue());
		dto.setTxnMode(rule.getTxnMode());
		dto.setRuleMode(rule.getStatus() ? "PROD" : "TEST");

		if (rule.getFolder() != null) {
			dto.setFolderId(rule.getFolder().getId());
		}

		// map root group
		if (rule.getGroups() != null) {
			dto.setGroup(mapGroupToDTO(rule.getGroups()));
		}

		return dto;
	}

	private GroupInputDTO mapGroupToDTO(RuleGroupsEntity group) {
		GroupInputDTO dto = new GroupInputDTO();
		dto.setId(group.getId());
		dto.setType(group.getLogicalOperator());

		List<GroupOrConditionDTO> items = new ArrayList<>();

		// Add conditions
		for (RuleConditionsEntity c : group.getConditions()) {
			GroupOrConditionDTO item = new GroupOrConditionDTO();
			item.setCondition(mapConditionToDTO(c));
			items.add(item);
		}

		// Add subgroups
		for (RuleGroupsEntity sub : group.getSubGroups()) {
			GroupOrConditionDTO item = new GroupOrConditionDTO();
			item.setGroup(mapGroupToDTO(sub));
			items.add(item);
		}

		dto.setConditions(items);
		return dto;
	}

	private GroupConditionDTO mapConditionToDTO(RuleConditionsEntity c) {
		GroupConditionDTO dto = new GroupConditionDTO();
		dto.setId(c.getId());
		dto.setFieldName(c.getField().getId().toString());
		dto.setOperator(c.getOperator().getId().toString());
		dto.setValueType(c.getValueType());
		dto.setValue(c.getValue());
		dto.setConditionType(c.getConditionType());
		dto.setFact(c.getFact());
//		dto.setOffsetUnit(c.getOffsetUnit());
//		dto.setOffsetValue(c.getOffsetValue());
		dto.setListType(c.getListType());
		dto.setListField(c.getListField());
		dto.setCondition(c.getCondition());
		dto.setRange(c.getRange());
		return dto;
	}

	private RuleGroupsEntity mapGroupInput(GroupInputDTO input, RuleEntity parent) {
		RuleGroupsEntity group = new RuleGroupsEntity();
		group.setLogicalOperator(input.getType());
		group.setRule(parent);

		for (GroupOrConditionDTO item : input.getConditions()) {
			if (item.getCondition() != null) {
				RuleConditionsEntity c = new RuleConditionsEntity();

				if (item.getCondition().getOperator() != null) {

					CatalogExpressionsEntity catalogExpression = catalogService
							.findByExpressionId(Long.valueOf(item.getCondition().getOperator()));
					c.setOperator(catalogExpression);

				}
//				catalogExpression.setId(Long.valueOf(item.getCondition().getOperator()));
				if (item.getCondition().getFieldName() != null) {

					CatalogEntity field = catalogService.findById(Long.valueOf(item.getCondition().getFieldName()));
//				field.setId(Long.valueOf(item.getCondition().getFieldName()));
					c.setField(field);
				}
				c.setValueType(item.getCondition().getValueType());
				c.setValue(item.getCondition().getValue());
				c.setConditionType(item.getCondition().getConditionType());

				c.setFact(item.getCondition().getFact());
				c.setListType(item.getCondition().getListType());
				c.setListField(item.getCondition().getListField());
				c.setRange(item.getCondition().getRange());
				c.setCondition(item.getCondition().getCondition()); // may cause problem...
				c.setGroup(group);
				group.getConditions().add(c);
			} else if (item.getGroup() != null) {
				RuleGroupsEntity sub = mapGroupInput(item.getGroup(), null); // only set in tthe first reference
				group.getSubGroups().add(sub);
			}
		}
		return group;
	}

	public void syncRule() throws JsonProcessingException {
		List<RuleEntity> rules = ruleRepo.findAll();

		System.out.println("rules size : " + rules.size());

		for (RuleEntity ruleEntity : rules) {

			NormalizedRuleEntity nre = new NormalizedRuleEntity();
			if (ruleEntity.getRuleName() != null) {
				Optional<NormalizedRuleEntity> optNormalizedRule = normalizedRuleRepo
						.findByRuleName(ruleEntity.getRuleName());
				if (optNormalizedRule.isPresent()) {
					nre = optNormalizedRule.get();
				}

				nre.setActive(ruleEntity.getStatus());
				nre.setPriority(ruleEntity.getPriority());
				nre.setRuleDescription(ruleEntity.getDescription());
				nre.setOffsetUnit(ruleEntity.getOffsetUnit());
				nre.setOffsetValue(ruleEntity.getOffsetValue());
				nre.setAlertCategory(ruleEntity.getAlertCategory());
				nre.setPayload(obj.writeValueAsString(ruleConverter.convert(ruleEntity)));
				nre.setRuleName(ruleEntity.getRuleName());
				nre.setTxnMode(ruleEntity.getTxnMode() == null || ruleEntity.getTxnMode().equals("") ? "BOTH"
						: ruleEntity.getTxnMode());
				normalizedRuleRepo.save(nre);

			}

		}
	}

//
//	public void CreateDummyRule(String ruleName) {
//		Optional<RuleEntity> optionalRuleEntity = ruleRepo.findByRuleName(ruleName);
//
//		if (optionalRuleEntity.isEmpty()) {
//			RuleEntity ruleEntity = new RuleEntity();
//			ruleEntity.setRuleName(ruleName);
//			ruleEntity.setPriority(1);
//
//			RuleFolderEntity ruleFolder = new RuleFolderEntity();
//
//			Optional<RuleFolderEntity> optionalRulefolderEntity = ruleFolderRepo.findByFolderName("root");
//
//			if (optionalRulefolderEntity.isPresent()) {
//				ruleFolder = optionalRulefolderEntity.get();
//			}
//			ruleFolder.setFolderName("root");
//
//			RuleGroupsEntity ruleGroup1 = new RuleGroupsEntity();
//
//			ruleGroup1.setLogicalOperator("AND");
//			ruleGroup1.setOrderNo(1);
//			ruleGroup1.setRule(ruleEntity);
//
//			// ruleGroup1 = ruleGroupRepo.save(ruleGroup1);
//
//			RuleConditionsEntity ruleCondition1 = new RuleConditionsEntity();
//			ruleCondition1.setFieldName("age");
//			ruleCondition1.setOperator(">");
//			ruleCondition1.setValue("30");
//			ruleCondition1.setGroup(ruleGroup1);
//
//			// ruleCondition1 = ruleCondRepository.save(ruleCondition1);
//
//			RuleConditionsEntity ruleCondition2 = new RuleConditionsEntity();
//
//			ruleCondition2.setFieldName("firstName");
//			ruleCondition2.setOperator("==");
//			ruleCondition2.setValueType("expression");
//			ruleCondition2.setParserExpression("UPPER(firstName)");
//			ruleCondition2.setGroup(ruleGroup1);
//
//			// ruleCondition2 = ruleCondRepository.save(ruleCondition2);
//			ruleGroup1.setConditions(List.of(ruleCondition1, ruleCondition2));
//
//			ruleEntity.setFolder(ruleFolder);
////			ruleEntity.setGroups( (ruleGroup1));
////			ruleEntity.setGroups(List.of(ruleGroup1));
////
//			RuleEntity rule = ruleRepo.save(ruleEntity);
//
//			try {
//				System.out.println(obj.writeValueAsString(rule));
//			} catch (JsonProcessingException e) {
//				e.printStackTrace();
//			}
//
//		} else {
//			System.out.println("sample rule already exists");
//
//			try {
//
////				List<RuleGroupsEntity> entity = optionalRuleEntity.get().getGroups();
//
////				System.out.println(entity.size());
//
//				System.out.println(obj.writeValueAsString(optionalRuleEntity.get()));
//			} catch (JsonProcessingException e) {
//				e.printStackTrace();
//			}
//		}
//	}

}

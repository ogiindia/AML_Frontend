package com.ogi.rulemanager;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.ogi.rulemanager.entity.RuleConditionsEntity;
import com.ogi.rulemanager.entity.RuleEntity;
import com.ogi.rulemanager.entity.RuleGroupsEntity;
import com.ogi.rulemanager.entity.dto.NormalizedRule;

@Service
public class RuleConverterService {

	public NormalizedRule convert(RuleEntity rule) {

		NormalizedRule normalized = new NormalizedRule();
		normalized.setSchema(new ArrayList<>());
		normalized.setFunc(new ArrayList<>());

		processGroup(rule.getGroups(), normalized);

		return normalized;
	}

	private void processGroup(RuleGroupsEntity group, NormalizedRule normalized) {

		// Convert CONDITIONS
		group.getConditions().forEach(c -> {
			if (c.getFact() == null) { // schema side
				normalized.getSchema().add(convertConditionToSchema(c, group.getLogicalOperator()));
			} else { // func side
				normalized.getFunc().add(convertConditionToFunc(c, group.getLogicalOperator()));
			}
		});

		// Process nested groups
		if (group.getSubGroups() != null) {
			group.getSubGroups().forEach(sub -> {
				processGroup(sub, normalized);
			});
		}
	}

	private NormalizedRule.SchemaEntry convertConditionToSchema(RuleConditionsEntity c, String joiner) {

		NormalizedRule.SchemaEntry s = new NormalizedRule.SchemaEntry();
		s.setTag((c.getField().getName()));
		s.setValue((String) c.getValue());
		s.setCondition(c.getOperator().getName());
		s.setType(c.getField().getType().getName().toLowerCase());
		s.setJoinexpression(joiner);

		return s;
	}

	private NormalizedRule.FuncEntry convertConditionToFunc(RuleConditionsEntity c, String joiner) {

		NormalizedRule.FuncEntry f = new NormalizedRule.FuncEntry();
		f.setFact(c.getFact());
		f.setTag(c.getField().getName());
		f.setValue((String) c.getValue());
		f.setOperator(c.getOperator().getName());
		f.setCondition(c.getCondition() == null || c.getCondition().equals("") ? null : c.getCondition());
		f.setRange(c.getRange() == null || c.getRange().equals("") ? null : c.getRange());

//		f.setLookback(Integer.parseInt(c.getOffsetValue()));
//		f.setUnits(c.getOffsetUnit().toLowerCase());
		f.setJoinexpression(joiner);

		return f;
	}

}

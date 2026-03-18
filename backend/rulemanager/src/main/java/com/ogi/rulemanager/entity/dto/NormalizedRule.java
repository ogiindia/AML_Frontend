package com.ogi.rulemanager.entity.dto;

import java.util.List;

public class NormalizedRule {

	private List<SchemaEntry> schema;
	private List<FuncEntry> func;

	public List<SchemaEntry> getSchema() {
		return schema;
	}

	public void setSchema(List<SchemaEntry> schema) {
		this.schema = schema;
	}

	public List<FuncEntry> getFunc() {
		return func;
	}

	public void setFunc(List<FuncEntry> func) {
		this.func = func;
	}

	public static class SchemaEntry {
		private String tag;
		private String value;
		private String condition;
		private String type;
		private String joinexpression;

		public String getTag() {
			return tag;
		}

		public void setTag(String tag) {
			this.tag = tag;
		}

		public String getValue() {
			return value;
		}

		public void setValue(String value) {
			this.value = value;
		}

		public String getCondition() {
			return condition;
		}

		public void setCondition(String condition) {
			this.condition = condition;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public String getJoinexpression() {
			return joinexpression;
		}

		public void setJoinexpression(String joinexpression) {
			this.joinexpression = joinexpression;
		}

	}

	public static class FuncEntry {
		private String fact;
		private String tag;
		private String value;
		private int lookback;
		private String condition;
		private String units;
		private String joinexpression;
		private String operator;
		private String range;

		public String getFact() {
			return fact;
		}

		public void setFact(String fact) {
			this.fact = fact;
		}

		public String getValue() {
			return value;
		}

		public void setValue(String value) {
			this.value = value;
		}

		public int getLookback() {
			return lookback;
		}

		public void setLookback(int lookback) {
			this.lookback = lookback;
		}

		public String getUnits() {
			return units;
		}

		public void setUnits(String units) {
			this.units = units;
		}

		public String getJoinexpression() {
			return joinexpression;
		}

		public void setJoinexpression(String joinexpression) {
			this.joinexpression = joinexpression;
		}

		public String getCondition() {
			return condition;
		}

		public void setCondition(String condition) {
			this.condition = condition;
		}

		public String getTag() {
			return tag;
		}

		public void setTag(String tag) {
			this.tag = tag;
		}

		public String getOperator() {
			return operator;
		}

		public void setOperator(String operator) {
			this.operator = operator;
		}

		public String getRange() {
			return range;
		}

		public void setRange(String range) {
			this.range = range;
		}
		
		

	}
}

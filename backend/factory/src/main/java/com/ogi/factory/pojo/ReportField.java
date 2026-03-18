package com.ogi.factory.pojo;

import java.util.List;

public class ReportField {

	private String name;
	private String label;
	private String type; // "text","boolean","number","select","checkbox"
	private List<Option> options;

	public ReportField(String name, String label, String type) {
		this.name = name;
		this.label = label;
		this.type = type;
	}

	public ReportField(String name, String label, String type, List<Option> options) {
		this.name = name;
		this.label = label;
		this.type = type;
		this.options = options;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<Option> getOptions() {
		return options;
	}

	public void setOptions(List<Option> options) {
		this.options = options;
	}

}

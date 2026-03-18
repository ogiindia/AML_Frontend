package com.ogi.factory.interfaces;

import java.util.List;
import java.util.Map;

import com.ogi.factory.enums.ReportType;
import com.ogi.factory.pojo.ReportField;

public interface ReportPlugin {

	String getPluginId();

	String getPluginName();

	List<ReportField> getReportFields(); // Define ReportFields

	byte[] generateReport(Map<String, Object> fieldValues);

	ReportType getReportType();

}

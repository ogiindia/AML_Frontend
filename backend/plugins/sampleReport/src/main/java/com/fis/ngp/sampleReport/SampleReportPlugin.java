package com.fis.ngp.sampleReport;

import java.util.List;
import java.util.Map;

import com.fis.ngp.factory.enums.ReportType;
import com.fis.ngp.factory.interfaces.ReportPlugin;
import com.fis.ngp.factory.pojo.ReportField;

public class SampleReportPlugin implements ReportPlugin {

	public String getPluginId() {
		// TODO Auto-generated method stub
		return "example-report";
	}

	public String getPluginName() {
		// TODO Auto-generated method stub
		return "Example Report";
	}

	public List<ReportField> getReportFields() {
		// TODO Auto-generated method stub
		return null;
	}

	public byte[] generateReport(Map<String, Object> fieldValues) {
		// TODO Auto-generated method stub
		return "Report generated".getBytes();
	}

	public ReportType getReportType() {
		// TODO Auto-generated method stub
		return ReportType.TXT;
	}

}

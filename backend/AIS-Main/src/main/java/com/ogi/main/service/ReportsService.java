package com.ogi.main.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import com.ogi.factory.enums.ReportType;
import com.ogi.factory.pojo.ReportField;
import com.ogi.main.configurations.PluginManager;

@Service
public class ReportsService {

	@Autowired
	private PluginManager pluginManager;

	public HttpHeaders getHttpHeaders(ReportType reportType) {
		HttpHeaders headers = new org.springframework.http.HttpHeaders();

		if (reportType == ReportType.PDF) {
			headers.setContentType(MediaType.APPLICATION_PDF);
		} else if (reportType == ReportType.XLSX) {
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		} else if (reportType == ReportType.CSV) {
			headers.setContentType(MediaType.valueOf("text/csv"));
		} else {
			headers.setContentType(MediaType.TEXT_PLAIN);
		}

		return headers;
	}

	public List<ReportField> getReportFields(String pluginId) {
		return pluginManager.getReportFields(pluginId);
	}

	public String getReportName(String pluginId) {
		return pluginManager.getReportName(pluginId);
	}

	public byte[] generateReport(UUID id, String pluginId, Map<String, Object> fields) {
		byte[] reportData = pluginManager.generateReport(id, pluginId, fields);
		return reportData;
	}

	public String savereport(UUID reportId, String pluginId, byte[] reportData) {
		String reportPath = pluginManager.saveReport(reportId, pluginId, reportData);
		return reportPath;
	}

}

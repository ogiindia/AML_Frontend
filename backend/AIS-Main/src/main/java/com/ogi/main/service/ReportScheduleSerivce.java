package com.ogi.main.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.enums.ReportType;
import com.ogi.factory.pojo.ReportField;
import com.ogi.factory.template.BaseResolver;
import com.ogi.main.entity.ReportSchedule;
import com.ogi.main.repository.ReportScheduleRepo;

@Service
public class ReportScheduleSerivce extends BaseResolver<ReportSchedule, UUID> {

	@Autowired
	ReportScheduleRepo reportRepo;

	@Autowired
	ReportsService reportService;

	@Autowired
	ObjectMapper obj;

	private static final String entityID = "REPORTS";

	@Transactional
	public ReportSchedule scheduleReport(String pluginId, String reportName, Map<String, Object> fieldValues)
			throws JsonProcessingException {
		ReportSchedule reportSchedule = new ReportSchedule();

		reportSchedule.setPluginId(pluginId);
		reportSchedule.setReportName(reportName);
		reportSchedule.setStatus("SCHEDULED");
		reportSchedule.setFieldValues(obj.writeValueAsString(fieldValues));

		return super.save(reportSchedule);

	}

	@GraphQLQuery(name = "getPluginReportFields")
	public List<ReportField> getReportFields(String pluginId) {
		return reportService.getReportFields(pluginId);
	}

	@GraphQLMutation
	@Transactional
	public String generateReport(String pluginId, String fieldValues)
			throws JsonMappingException, JsonProcessingException {

		String reportName = reportService.getReportName(pluginId);

		@SuppressWarnings("unchecked")
		Map<String, Object> inputValues = obj.readValue(fieldValues, Map.class);
		ReportSchedule reportschdule = scheduleReport(pluginId, reportName, inputValues);

		byte[] generateReport = reportService.generateReport(reportschdule.getId(), pluginId, inputValues);

		String reportPath = reportService.savereport(reportschdule.getId(), pluginId, generateReport);

		return reportPath;
	}

	public ResponseEntity<byte[]> downloadReport(UUID id, ReportType reportType) {
//		ReportSchedule reportschdule = reportsc

		// yet to work on it....
		org.springframework.http.HttpHeaders headers = reportService.getHttpHeaders(reportType);

		return ResponseEntity.ok().headers(headers).body(null);
	}

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return entityID;
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "REPORT";
	}

}

package com.ogi.main.entity;

import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "AIS_REPORT_SCHEDULE")
public class ReportSchedule extends UUIDBaseEntity {

	private String pluginId;
	private String reportName;
	private String fieldValues;
	private String reportPath;
	private LocalDateTime generatedAt;
	private LocalDateTime StartDate;
	private LocalDateTime endDate;
	private String status;
	public ReportSchedule() {
		// TODO Auto-generated constructor stub
	}

	public String getPluginId() {
		return pluginId;
	}

	public void setPluginId(String pluginId) {
		this.pluginId = pluginId;
	}

	public String getReportName() {
		return reportName;
	}

	public void setReportName(String reportName) {
		this.reportName = reportName;
	}

	public String getFieldValues() {
		return fieldValues;
	}

	public void setFieldValues(String fieldValues) {
		this.fieldValues = fieldValues;
	}

	public String getReportPath() {
		return reportPath;
	}

	public void setReportPath(String reportPath) {
		this.reportPath = reportPath;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getGeneratedAt() {
		return generatedAt;
	}

	public void setGeneratedAt(LocalDateTime generatedAt) {
		this.generatedAt = generatedAt;
	}

	public LocalDateTime getStartDate() {
		return StartDate;
	}

	public void setStartDate(LocalDateTime startDate) {
		StartDate = startDate;
	}

	public LocalDateTime getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDateTime endDate) {
		this.endDate = endDate;
	}

}

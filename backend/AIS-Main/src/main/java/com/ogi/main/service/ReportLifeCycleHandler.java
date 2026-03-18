package com.ogi.main.service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ogi.factory.interfaces.ReportLifecycleListener;
import com.ogi.main.entity.ReportSchedule;
import com.ogi.main.repository.ReportScheduleRepo;

@Component
public class ReportLifeCycleHandler implements ReportLifecycleListener {

	@Autowired
	ReportScheduleRepo repo;

	// to avoid circular dependency
	public void updateStatus(UUID id, String status) {
		Optional<ReportSchedule> reportSchdule = repo.findById(id);

		if (reportSchdule.isPresent()) {
			reportSchdule.get().setStatus(status);
			repo.save(reportSchdule.get());
		}

	}

	// to avoid circular dependency
	public void updateReportStatus(UUID id, String status, String reportPath) {
		Optional<ReportSchedule> reportSchdule = repo.findById(id);

		if (reportSchdule.isPresent()) {
			reportSchdule.get().setReportPath(reportPath);
			reportSchdule.get().setStatus(status);
			repo.save(reportSchdule.get());
		}

	}

	@Override
	public void onReportInitiated(UUID reportId, String pluginId, Map<String, Object> fieldValues) {
		// TODO Auto-generated method stub

		updateStatus(reportId, "IN_PROGRESS");
	}

	@Override
	public void onReportGenerated(UUID reportId, String pluginId, byte[] reportData) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onReportFinished(UUID reportId, String pluginId, String reportPath) {
		// TODO Auto-generated method stub

		updateReportStatus(reportId, "FINISHED", reportPath);

	}

	@Override
	public void onReportFailed(UUID reportId, String pluginId, Throwable throwable) {
		// TODO Auto-generated method stub
		updateStatus(reportId, "FAILED");
	}

}

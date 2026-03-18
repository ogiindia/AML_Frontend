package com.ogi.factory.interfaces;

import java.util.Map;
import java.util.UUID;

public interface ReportLifecycleListener {

	void onReportInitiated(UUID reportId, String pluginId, Map<String, Object> fieldValues);

	void onReportGenerated(UUID reportId, String pluginId, byte[] reportData);

	void onReportFinished(UUID reportId, String pluginId, String reportPath);

	void onReportFailed(UUID reportId, String pluginId, Throwable throwable);

}

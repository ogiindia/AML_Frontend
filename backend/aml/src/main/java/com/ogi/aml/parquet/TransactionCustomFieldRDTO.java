package com.ogi.aml.parquet;

import java.util.List;

import com.aml.file.pro.core.efrmsrv.startup.config.ColumnMapping;

public record TransactionCustomFieldRDTO(String destFileType, String destLocation, String sourceFileName, String source, String shortName, List<ColumnMapping> columnMappLstObj) {

}

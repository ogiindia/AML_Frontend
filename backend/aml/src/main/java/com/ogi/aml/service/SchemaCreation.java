package com.ogi.aml.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aml.file.pro.core.efrmsrv.startup.config.TransactionMapping;
import com.ogi.aml.parquet.ParquetService;
import com.ogi.factory.interfaces.RuleManagerInterface;

@Service
public class SchemaCreation {

	private Logger LOGGER = LoggerFactory.getLogger(SchemaCreation.class);

	@Autowired
	private ParquetService parquetService;

	@Autowired
	private RuleManagerInterface rulemanagerinterface;

	public String setMappingList() {
		try {

			LOGGER.debug("Mapping alert entities to response | recordCount={}");

			String resp = "";

			List<TransactionMapping> configList = parquetService.getAllConfig();
			resp = rulemanagerinterface.setMappingList(configList);

			return resp;

		} catch (Exception ex) {

			LOGGER.error("Error mapping customer rule details", ex);
		}

		return "";

	}
}

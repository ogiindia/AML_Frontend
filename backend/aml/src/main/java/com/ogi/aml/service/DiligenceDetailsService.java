package com.ogi.aml.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.entity.DiligenceDetailsEntity;
import com.ogi.aml.repo.DiligenceDetailsImplRepo;
import com.ogi.aml.repo.DiligenceDetailsRepo;
import com.ogi.aml.response.ResponseDiligenceDetailsData;

@Service
public class DiligenceDetailsService {

	private Logger LOGGER = LoggerFactory.getLogger(DiligenceDetailsService.class);

	@Autowired
	DiligenceDetailsRepo diligencedetailsrepo;

	@Autowired
	DiligenceDetailsImplRepo diligencedetailsimplrepo;

	public String setDiligenceDetails(String parentId, String transactionId, String customerId, String cddEdd) {
		try {

			LOGGER.info("Service setDiligenceDetails called | parentId={} | transactionId={} | customerId={} | type={}",
					parentId, transactionId, customerId, cddEdd);

			DiligenceDetailsEntity entity = setDiligenceDetailsToEntity(parentId, customerId, cddEdd, transactionId);

			diligencedetailsrepo.save(entity);

			LOGGER.info("Diligence details saved successfully | parentId={} | transactionId={}", parentId,
					transactionId);

			return Constants.SUCCESS;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in setDiligenceDetails | parentId={} | transactionId={}", parentId,
					transactionId, ex);

			return Constants.FAILURE;
		}
	}

	public DiligenceDetailsEntity setDiligenceDetailsToEntity(String parentId, String customerId, String cddEdd,
			String fileNames) {
		LOGGER.debug("Mapping DiligenceDetailsEntity | parentId={} | customerId={} | type={}", parentId, customerId,
				cddEdd);

		DiligenceDetailsEntity entity = new DiligenceDetailsEntity();

		entity.setRefid(UUID.randomUUID().toString());
		entity.setParentId(parentId);
		entity.setCustomerId(customerId);

		entity.setCdd("CDD".equalsIgnoreCase(cddEdd) ? "Y" : "N");
		entity.setEdd("EDD".equalsIgnoreCase(cddEdd) ? "Y" : "N");

		entity.setFileNames(fileNames);
		entity.setCreatedTime(new Timestamp(System.currentTimeMillis()));

		return entity;
	}

	public List<ResponseDiligenceDetailsData> getDiligenceDetails(String parentId) {
		try {

			LOGGER.info("Service getDiligenceDetails called | parentId={}", parentId);

			List<DiligenceDetailsEntity> entities = diligencedetailsimplrepo.getDiligenceDetails(parentId);

			if (entities == null || entities.isEmpty()) {

				LOGGER.warn("No diligence details found | parentId={}", parentId);
				return Collections.emptyList();
			}

			LOGGER.info("Diligence records fetched | parentId={} | recordCount={}", parentId, entities.size());

			return getDiligenceDetailsResult(entities);

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getDiligenceDetails | parentId={}", parentId, ex);

			return Collections.emptyList();
		}
	}

	public List<ResponseDiligenceDetailsData> getDiligenceDetailsResult(List<DiligenceDetailsEntity> resp) {
		
		LOGGER.debug("Mapping diligence entities | recordCount={}", resp != null ? resp.size() : 0);

		List<ResponseDiligenceDetailsData> listData = new ArrayList<>();

		for (DiligenceDetailsEntity entity : resp) {

			ResponseDiligenceDetailsData res = new ResponseDiligenceDetailsData();

			res.setRefid(entity.getRefid());
			res.setParentId(entity.getParentId());
			res.setCustomerId(entity.getCustomerId());
			res.setCdd("Y".equalsIgnoreCase(entity.getCdd()) ? "Yes" : "No");
			res.setEdd("Y".equalsIgnoreCase(entity.getEdd()) ? "Yes" : "No");
			res.setFileNames(entity.getFileNames());
			res.setCreatedTime(entity.getCreatedTime());

			listData.add(res);

			LOGGER.debug("Mapped diligence record | parentId={}", entity.getParentId());
		}

		return listData;
	}

}

package com.ogi.aml.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.Common.RandomIdGenerate;
import com.ogi.aml.entity.DiligenceDetailsEntity;
import com.ogi.aml.entity.KycAlertsEntity;
import com.ogi.aml.entity.SanctionAuditEntity;
import com.ogi.aml.entity.SanctionConfigEntity;
import com.ogi.aml.entity.SanctionMatchedListEntity;
import com.ogi.aml.repo.SanctionAuditRepo;
import com.ogi.aml.repo.SanctionConfigImplRepo;
import com.ogi.aml.repo.SanctionConfigRepo;
import com.ogi.aml.repo.SanctionMatchedListImplRepo;
import com.ogi.aml.response.ResponseKycAlertsDetailsData;
import com.ogi.aml.response.ResponseSanctionConfigData;
import com.ogi.aml.response.ResponseSanctionMatchedListData;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;

@Service
public class SanctionScreeningService extends BaseResolver<SanctionMatchedListEntity, Long> {

	private Logger LOGGER = LoggerFactory.getLogger(SanctionScreeningService.class);

	@Autowired
	SanctionConfigImplRepo sanctionconfigimplrepo;

	@Autowired
	SanctionConfigRepo sanctionconfigrepo;

	@Autowired
	SanctionAuditRepo sanctionauditrepo;

	@Autowired
	SanctionMatchedListImplRepo sanctionmatchedlistimplrepo;

	public String setSanctionDetails(String sanctionName, String country) {
		try {

			LOGGER.info("Saving sanction details | sanctionName={} country={}", sanctionName, country);

			SanctionConfigEntity entity = setSanctionDetailsToEntity(sanctionName, country);

			sanctionconfigrepo.save(entity);

			LOGGER.info("Sanction details saved successfully | sanctionName={}", sanctionName);

			return Constants.SUCCESS;

		} catch (Exception ex) {

			LOGGER.error("Error saving sanction details | sanctionName={} country={} ", sanctionName, country, ex);
		}

		return Constants.FAILURE;
	}

	public String deleteSanctionDetails(String sanction_name) {
		try {

			LOGGER.info("Deleting sanction details | sanctionName={}", sanction_name);

			String sanctionCode = "";

			List<ResponseSanctionConfigData> resp = getSanctionDetails(sanction_name);

			if (resp != null && !resp.isEmpty()) {
				sanctionCode = resp.get(0).getSanction_code();
			} else {
				LOGGER.warn("Sanction details not found | sanctionName={}", sanction_name);
				return "NOT_FOUND";
			}

			Optional<SanctionConfigEntity> entity = sanctionconfigrepo.findById(sanctionCode);

			if (entity.isPresent()) {

				sanctionconfigrepo.delete(entity.get());

				LOGGER.info("Sanction deleted successfully | sanctionCode={}", sanctionCode);

				return Constants.SUCCESS;

			} else {

				LOGGER.warn("Sanction code not found in repository | sanctionCode={}", sanctionCode);

				return "NOT_FOUND";
			}

		} catch (Exception ex) {

			LOGGER.error("Error deleting sanction details | sanctionName={}", sanction_name, ex);

			return "ERROR";
		}
	}

	public SanctionConfigEntity setSanctionDetailsToEntity(String sanctionName, String country) {
		try {

			LOGGER.debug("Creating sanction entity | sanctionName={} country={} listType={}", sanctionName, country);

			SanctionConfigEntity entity = new SanctionConfigEntity();

			String guid = RandomIdGenerate.RandomDigit("SAN");

			entity.setSanction_code(guid);
			entity.setSanction_name(sanctionName);
			entity.setCountry(country);
			entity.setStatus("Y");
			entity.setCreated_date(new Timestamp(System.currentTimeMillis()));

			LOGGER.debug("Sanction entity created successfully | sanctionCode={}", guid);

			return entity;

		} catch (Exception ex) {

			LOGGER.error("Error creating sanction entity | sanctionName={} country={} ", sanctionName, country,  ex);
		}

		return null;
	}

	public List<ResponseSanctionConfigData> getSanctionDetails(String sanctionName) {
		try {

			LOGGER.info("Fetching sanction details | sanctionName={}", sanctionName);

			List<ResponseSanctionConfigData> resp = new ArrayList<>();

			List<String> statusList = Arrays.asList(sanctionName.split(","));

			List<SanctionConfigEntity> respSanctionMapping = sanctionconfigimplrepo
					.getSanctionListImplRepo(sanctionName, statusList);

			if (respSanctionMapping != null && !respSanctionMapping.isEmpty()) {

				LOGGER.info("Sanction records found | count={}", respSanctionMapping.size());

				resp = getSanctionDetailsResult(respSanctionMapping);

			} else {

				LOGGER.warn("No sanction records found | sanctionName={}", sanctionName);
			}

			return resp;

		} catch (Exception ex) {

			LOGGER.error("Error fetching sanction details | sanctionName={}", sanctionName, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseSanctionConfigData> getSanctionDetailsResult(List<SanctionConfigEntity> resp) {
		try {

			LOGGER.debug("Mapping sanction entity to response | recordCount={}", resp.size());

			List<ResponseSanctionConfigData> listData = new ArrayList<>();

			for (SanctionConfigEntity entity : resp) {

				ResponseSanctionConfigData res = new ResponseSanctionConfigData();

				res.setSanction_code(entity.getSanction_code());
				res.setSanction_name(entity.getSanction_name());

				listData.add(res);

				LOGGER.debug("Mapped sanctionCode={}", entity.getSanction_code());
			}

			LOGGER.info("Sanction mapping completed | totalMapped={}", listData.size());

			return listData;

		} catch (Exception ex) {

			LOGGER.error("Error mapping sanction details", ex);
		}

		return Collections.emptyList();
	}
	
	
	
	

	public String uploadSanctionList(String sanctionName, String fileType, String fileName) {
		try {

			LOGGER.info("Uploading sanction list | sanctionName={} fileType={} fileName={}", sanctionName, fileType,
					fileName);

			SanctionAuditEntity entity = uploadSanctionListToEntity(sanctionName, fileType, fileName);

			sanctionauditrepo.save(entity);

			LOGGER.info("Sanction list uploaded successfully | sanctionName={} fileName={}", sanctionName, fileName);

			return Constants.SUCCESS;

		} catch (Exception ex) {

			LOGGER.error("Error uploading sanction list | sanctionName={} fileName={}", sanctionName, fileName, ex);
		}

		return Constants.FAILURE;
	}

	public SanctionAuditEntity uploadSanctionListToEntity(String sanctionName, String fileType, String fileName) {
		try {

			LOGGER.debug("Creating sanction audit entity | sanctionName={} fileType={} fileName={}", sanctionName,
					fileType, fileName);

			SanctionAuditEntity entity = new SanctionAuditEntity();

			entity.setSancation_name(sanctionName);
			entity.setUpload_file_name(fileName);
			entity.setFile_type(fileType);
			entity.setCreated_date(new Timestamp(System.currentTimeMillis()));

			LOGGER.debug("Sanction audit entity created successfully | fileName={}", fileName);

			return entity;

		} catch (Exception ex) {

			LOGGER.error("Error creating sanction audit entity | sanctionName={} fileName={}", sanctionName, fileName,
					ex);
		}

		return null;
	}

	public List<ResponseSanctionMatchedListData> getSanctionMatchedList(String sanctionName, String threshold,
			String processType) {
		try {

			LOGGER.info("Fetching sanction matched list | sanctionName={} threshold={} | processType={}", sanctionName,
					threshold, processType);

			List<ResponseSanctionMatchedListData> resp = new ArrayList<>();
			List<String> statusList = null;

			if (sanctionName != null && !sanctionName.isEmpty()) {
				statusList = Arrays.asList(sanctionName.split(","));
			}

			List<SanctionMatchedListEntity> respSanctionMatched = sanctionmatchedlistimplrepo
					.getSanctionMatchedListImplRepo(statusList, threshold, "", processType);

			if (respSanctionMatched != null && !respSanctionMatched.isEmpty()) {

				LOGGER.info("Sanction matched records found | count={}", respSanctionMatched.size());

				resp = getSanctionMatchedDetailsResult(respSanctionMatched);

			} else {

				LOGGER.warn("No sanction matched records found | sanctionName={} threshold={}| processType={}",
						sanctionName, threshold, processType);
			}

			return resp;

		} catch (Exception ex) {

			LOGGER.error("Error fetching sanction matched list | sanctionName={} threshold={}| processType={}",
					sanctionName, threshold, processType, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseSanctionMatchedListData> getSanctionMatchedDetailsResult(List<SanctionMatchedListEntity> resp) {
		try {

			LOGGER.debug("Mapping sanction matched entities | recordCount={}", resp.size());

			List<ResponseSanctionMatchedListData> listData = new ArrayList<>();

			for (SanctionMatchedListEntity entity : resp) {

				ResponseSanctionMatchedListData res = new ResponseSanctionMatchedListData();

				res.setCustomername(entity.getCustomername());
				res.setSanction_name(entity.getSanction_name());
				res.setCountryname(entity.getCountryname());
				res.setConfidence_percentage(entity.getConfidence_percentage());
				res.setCreated_date(entity.getCreated_date());
				res.setStatus(entity.getStatus());

				listData.add(res);

				LOGGER.debug("Mapped sanction match | customerName={}", entity.getCustomername());
			}

			LOGGER.info("Sanction matched mapping completed | totalMapped={}", listData.size());

			return listData;

		} catch (Exception ex) {

			LOGGER.error("Error mapping sanction matched details", ex);
		}

		return Collections.emptyList();
	}

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ_BY_PAGING);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "AML";
	}

}

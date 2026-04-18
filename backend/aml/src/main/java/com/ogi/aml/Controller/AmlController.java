package com.ogi.aml.Controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.entity.DTO.AlertParentDTO;
import com.ogi.aml.entity.DTO.FileInfoDTO;
import com.ogi.aml.request.RequestKycAlertsDetailsData;
import com.ogi.aml.request.RequestSanctionConfigData;
import com.ogi.aml.response.ResponseAccountDetailsData;
import com.ogi.aml.response.ResponseAlertDetailsData;
import com.ogi.aml.response.ResponseCustomerDetailsData;
import com.ogi.aml.response.ResponseDiligenceDetailsData;
import com.ogi.aml.response.ResponseKycAlertsDetailsData;
import com.ogi.aml.response.ResponseSanctionConfigData;
import com.ogi.aml.response.ResponseSanctionListWeightage;
import com.ogi.aml.response.ResponseSanctionMatchedListData;
import com.ogi.aml.response.ResponseTransactionDetailsData;
import com.ogi.aml.service.AccountDetailsService;
import com.ogi.aml.service.AlertService;
import com.ogi.aml.service.CustomerDetailsService;
import com.ogi.aml.service.DashboardService;
import com.ogi.aml.service.DiligenceDetailsService;
import com.ogi.aml.service.FinalReportService;
import com.ogi.aml.service.KYCAlertsService;
import com.ogi.aml.service.SanctionScreeningService;
import com.ogi.aml.service.SchemaCreation;
import com.ogi.aml.service.ScreeningService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/app/rest/v1")
public class AmlController {

	private Logger LOGGER = LoggerFactory.getLogger(AmlController.class);

	@Autowired
	DiligenceDetailsService diligencedetailsservice;

	@Autowired
	KYCAlertsService kycalertsservice;

	@Autowired
	CustomerDetailsService customerdetailsservice;

	@Autowired
	AccountDetailsService accountdetailsservice;

	@Autowired
	DashboardService dashboardservice;

	@Autowired
	ScreeningService screeningservice;

	@Autowired
	SanctionScreeningService sanctionscreeningservice;

	@Autowired
	FinalReportService finalreportservice;

	@Autowired
	AlertService alertservice;

	@Autowired
	SchemaCreation schemacreation;

	@Value("${file.path:C:/Users/FIS/Source/AML/Document/SampleFiles/}")
	public String path;
	
	@Value("${accessfile.path:C:/Users/FIS/Source/AML/Document/}")
	public String accessListPath;
	
	@Value("${nameMatched.url:https://finsecrt.aisworld.space/api/v1/rtengine/getscore}")
	public String nameMatchedUrl;


	@PostMapping("/uploadEvidence")
	public ResponseEntity<String> uploadAlertFiles(@RequestParam String parentId, @RequestParam String TransactionId,
			@RequestParam String customerId, @RequestParam String CDD_EDD,
			@RequestParam("fileNames") List<String> fileNames, @RequestParam("files") MultipartFile[] files) {

		try {

			LOGGER.info("UploadEvidence API started for parentId={}, customerId={}, transactionId={}", parentId,
					customerId, TransactionId);

			Path uploadPath = Paths.get(path + "/" + customerId + "/" + TransactionId);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
				LOGGER.info("Created upload directory: {}", uploadPath);
			}

			// Save all files in same path
			for (MultipartFile file : files) {
				Path filePath = uploadPath.resolve(file.getOriginalFilename());
				Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
				LOGGER.info("File uploaded successfully: {}", file.getOriginalFilename());
			}

			// Logs / DB insert ready
			LOGGER.info("CDD_EDD Type: {}", CDD_EDD);
			LOGGER.info("File names received: {}", fileNames);
			LOGGER.info("Saved Path: {}", uploadPath);

			diligencedetailsservice.setDiligenceDetails(parentId, TransactionId, customerId, CDD_EDD);

			LOGGER.info("Diligence details saved successfully for parentId={}", parentId);

			return ResponseEntity.ok(Constants.SUCCESS);

		} catch (Exception e) {
			LOGGER.error("Exception occurred in uploadAlertFiles API for parentId={}, error={}", parentId,
					e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
		}
	}

	@RequestMapping(value = "/getDiligenceDetails")
	public ResponseEntity<?> getDiligenceDetails(@RequestParam String parentId) {

		try {

			LOGGER.info("GetDiligenceDetails API called for parentId={}", parentId);

			List<ResponseDiligenceDetailsData> resp = diligencedetailsservice.getDiligenceDetails(parentId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No diligence details found for parentId={}", parentId);
			} else {
				LOGGER.info("Diligence details fetched successfully for parentId={}, recordCount={}", parentId,
						resp.size());
			}

			return new ResponseEntity<>(resp, HttpStatus.OK);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getDiligenceDetails API for parentId={}, error={}", parentId,
					e.getMessage(), e);

			return new ResponseEntity<>("Failed to fetch diligence details", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "/getDiligenceFileDetails")
	public List<FileInfoDTO> getDiligenceFileDetails(@RequestParam String customerId, @RequestParam String transId)
			throws IOException {

		LOGGER.info("API getDiligenceFileDetails called | customerId={} | transId={}", customerId, transId);

		Path folder = Paths.get(path + "/" + customerId + "/" + transId + "/");

		LOGGER.debug("Reading files from path: {}", folder);

		if (!Files.exists(folder)) {
			LOGGER.warn("Folder does not exist for customerId={} transId={} path={}", customerId, transId, folder);
			return Collections.emptyList();
		}

		List<FileInfoDTO> files = Files.list(folder).filter(Files::isRegularFile)
				.map(filePath -> new FileInfoDTO(filePath.getFileName().toString())).collect(Collectors.toList());

		LOGGER.info("Files fetched successfully | customerId={} | transId={} | fileCount={}", customerId, transId,
				files.size());

		return files;
	}

	@RequestMapping(value = "/getDocumentFiles")
	public ResponseEntity<byte[]> getDocumentFiles(@RequestParam String customerId, @RequestParam String transactionId,
			@RequestParam String filename) {

		LOGGER.info("API getDocumentFiles called | customerId={} | transactionId={} | filename={}", customerId,
				transactionId, filename);

		File file = new File(path + customerId + "/" + transactionId + "/" + filename);

		try {

			if (!file.exists()) {
				LOGGER.warn("Requested file not found | path={}", file.getAbsolutePath());
				return ResponseEntity.notFound().build();
			}

			LOGGER.debug("Reading file from path: {}", file.getAbsolutePath());

			byte[] bytes = Files.readAllBytes(file.toPath());

			LOGGER.info("File served successfully | filename={} | size={} bytes", filename, bytes.length);

			return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, getContentType(filename))
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"").body(bytes);

		} catch (IOException ex) {

			LOGGER.error("Error reading file | customerId={} | transactionId={} | filename={}", customerId,
					transactionId, filename, ex);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	private String getContentType(String fileName) {

		LOGGER.debug("Determining content type for file: {}", fileName);

		if (fileName == null) {
			LOGGER.warn("Filename is null, returning default content type");
			return "application/octet-stream";
		}

		String lowerFileName = fileName.toLowerCase();

		if (lowerFileName.endsWith(".pdf"))
			return "application/pdf";

		if (lowerFileName.endsWith(".jpg") || lowerFileName.endsWith(".jpeg"))
			return "image/jpeg";

		if (lowerFileName.endsWith(".png"))
			return "image/png";

		if (lowerFileName.endsWith(".doc"))
			return "application/msword";

		if (lowerFileName.endsWith(".docx"))
			return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

		LOGGER.warn("Unknown file type for file: {}", fileName);

		return "application/octet-stream";
	}

	@RequestMapping(value = "/getKycAlertsDetails")
	public ResponseEntity<?> getKycAlertsDetails(@RequestParam String riskCategory, @RequestParam String cust_id,
			@RequestParam String accno) {

		try {

			LOGGER.info("API getKycAlertsDetails called | riskCategory={} | cust_id={} | accno={}", riskCategory,
					cust_id, accno);

			List<ResponseKycAlertsDetailsData> resp = kycalertsservice.getKycAlertsDetails(riskCategory, cust_id,
					accno);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No KYC alerts found | cust_id={} | accno={}", cust_id, accno);
			} else {
				LOGGER.info("KYC alerts fetched successfully | cust_id={} | accno={} | recordCount={}", cust_id, accno,
						resp.size());
			}

			return new ResponseEntity<>(resp, HttpStatus.OK);

		} catch (Exception e) {

			LOGGER.error("Exception in getKycAlertsDetails | riskCategory={} | cust_id={} | accno={}", riskCategory,
					cust_id, accno, e);

			return new ResponseEntity<>("Failed to fetch KYC alerts", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "/getKycAlerts")
	public ResponseEntity<?> getKycAlerts(@RequestParam String source, @RequestParam String cust_id,
			@RequestParam String accno) {
		try {

			LOGGER.info("API getKycAlerts called | source={} | cust_id={} | accno={}", source, cust_id, accno);

			List<ResponseKycAlertsDetailsData> resp = kycalertsservice.getKycAlerts(source, cust_id, accno);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No KYC alerts found | source={} | cust_id={} | accno={}", source, cust_id, accno);
			} else {
				LOGGER.info("KYC alerts fetched successfully | source={} | cust_id={} | accno={} | recordCount={}",
						source, cust_id, accno, resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception in getKycAlerts | source={} | cust_id={} | accno={}", source, cust_id, accno, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch KYC alerts");
		}
	}

	@RequestMapping(value = "/getCustomerDetails")
	public ResponseEntity<?> getCustomerDetails(@RequestParam String customerId) {
		try {

			LOGGER.info("API getCustomerDetails called | customerId={}", customerId);

			ResponseCustomerDetailsData resp = customerdetailsservice.getCustomerDetails(customerId);

			if (resp == null) {
				LOGGER.warn("Customer details not found | customerId={}", customerId);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer details not found");
			}

			LOGGER.info("Customer details fetched successfully | customerId={}", customerId);

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception in getCustomerDetails | customerId={}", customerId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch customer details");
		}
	}

	@RequestMapping(value = "/getAccountDetails")
	public ResponseEntity<?> getAccountDetails(@RequestParam String customerId) {

		try {

			LOGGER.info("API getAccountDetails called | customerId={}", customerId);

			List<ResponseAccountDetailsData> resp = accountdetailsservice.getAccountDetails(customerId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No account details found | customerId={}", customerId);
			} else {
				LOGGER.info("Account details fetched successfully | customerId={} | recordCount={}", customerId,
						resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception in getAccountDetails | customerId={}", customerId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch account details");
		}
	}

	@RequestMapping(value = "/getTransactionDetails")
	public ResponseEntity<?> getTransactionDetails(@RequestParam String customerId) {
		try {

			LOGGER.info("API getTransactionDetails called | customerId={}", customerId);

			List<Map<String, Object>> resp = accountdetailsservice.getTransactionDetails(customerId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No transaction details found | customerId={}", customerId);
			} else {
				LOGGER.info("Transaction details fetched successfully | customerId={} | recordCount={}", customerId,
						resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception in getTransactionDetails | customerId={}", customerId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch transaction details");
		}
	}

	@RequestMapping(value = "/getDashboardRuleCount")
	public ResponseEntity<?> getDashboardRuleCount() {
		try {

			LOGGER.info("API getDashboardRuleCount called");

			List<Map<String, Object>> resp = dashboardservice.getDashboardRuleCount();

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No dashboard rule count data found");
			} else {
				LOGGER.info("Dashboard rule count fetched successfully | recordCount={}", resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getDashboardRuleCount API", e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch dashboard rule count");
		}
	}

	@RequestMapping(value = "/getRecurringCustomerCount")
	public ResponseEntity<?> getRecurringCustomerCount() {
		try {

			LOGGER.info("API getRecurringCustomerCount called");

			List<Map<String, Object>> resp = dashboardservice.getRecurringCustomerCount();

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No recurring customer data found");
			} else {
				LOGGER.info("Recurring customer count fetched successfully | recordCount={}", resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getRecurringCustomerCount API", e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch recurring customer count");
		}
	}

	@RequestMapping(value = "/getRepeatedCustomerCount")
	public ResponseEntity<?> getRepeatedCustomerCount() {
		try {

			LOGGER.info("API getRepeatedCustomerCount called");

			List<Map<String, Object>> resp = dashboardservice.getRepeatedCustomerCount();

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No repeated customer data found");
			} else {
				LOGGER.info("Repeated customer count fetched successfully | recordCount={}", resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getRepeatedCustomerCount API", e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch repeated customer count");
		}
	}

	@RequestMapping(value = "/getSuspiciousTxnCount")
	public ResponseEntity<?> getSuspiciousTxnCount() {
		try {

			LOGGER.info("API getSuspiciousTxnCount called");

			List<Map<String, Object>> resp = dashboardservice.getSuspiciousTxnCount();

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No suspicious transaction data found");
			} else {
				LOGGER.info("Suspicious transaction count fetched successfully | recordCount={}", resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getSuspiciousTxnCount API", e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch suspicious transaction count");
		}
	}

	@RequestMapping(value = "/getTopBranchCount")
	public ResponseEntity<?> getTopBranchCount() {
		try {

			LOGGER.info("API getTopBranchCount called");

			List<Map<String, Object>> resp = dashboardservice.getTopBranchCount();

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No top branch data found");
			} else {
				LOGGER.info("Top branch count fetched successfully | recordCount={}", resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getTopBranchCount API", e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch top branch count");
		}
	}

	@RequestMapping(value = "/getRuleVsTransaction")
	public ResponseEntity<?> getRuleVsTransaction() {
		try {

			LOGGER.info("API getRuleVsTransaction called");

			List<Map<String, Object>> resp = dashboardservice.getRuleVsTransaction();

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No Rule vs Transaction data found");
			} else {
				LOGGER.info("Rule vs Transaction data fetched successfully | recordCount={}", resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getRuleVsTransaction API", e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch Rule vs Transaction data");
		}
	}

	@RequestMapping(value = "/getCustomerRuleCount")
	public ResponseEntity<?> getCustomerRuleCount(@RequestParam String customerId, @RequestParam String parentId) {
		try {

			LOGGER.info("API getCustomerRuleCount called | customerId={} | parentId={}", customerId, parentId);

			List<Map<String, Object>> resp = screeningservice.getCustomerRuleCount(customerId, parentId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No customer rule count data found | customerId={} | parentId={}", customerId, parentId);
			} else {
				LOGGER.info("Customer rule count fetched successfully | customerId={} | parentId={} | recordCount={}",
						customerId, parentId, resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getCustomerRuleCount API | customerId={} | parentId={}", customerId,
					parentId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch customer rule count");
		}
	}

	@RequestMapping(value = "/getCustomerScore")
	public ResponseEntity<?> getCustomerScore(@RequestParam String customerId, String transactionId) {

		try {

			LOGGER.info("API getCustomerScore called | customerId={} | transactionId={}", customerId, transactionId);

			Map<String, String> score = screeningservice.getCustomerScore(customerId, transactionId);

			if (score == null || score.isEmpty()) {
				LOGGER.warn("Customer score not found | customerId={} | transactionId={}", customerId, transactionId);
			} else {
				LOGGER.info("Customer score fetched successfully | customerId={} | transactionId={}", customerId,
						transactionId);
			}

			return ResponseEntity.ok(score);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getCustomerScore API | customerId={} | transactionId={}", customerId,
					transactionId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch customer score");
		}
	}

	@RequestMapping("/setSanctionDetails")
	public ResponseEntity<?> setSanctionDetails(@RequestBody RequestSanctionConfigData request) {
		try {

			LOGGER.info("API setSanctionDetails called | sanctionName={} | country={}", request.getSanction_name(),
					request.getCountry());

			sanctionscreeningservice.setSanctionDetails(request.getSanction_name(), request.getCountry());

			LOGGER.info("Sanction details saved successfully | sanctionName={} | country={}",
					request.getSanction_name(), request.getCountry());

			return ResponseEntity.ok("Sanction Saved Successfully");

		} catch (Exception e) {

			LOGGER.error("Exception occurred in setSanctionDetails API | sanctionName={} | country={}",
					request.getSanction_name(), request.getCountry(), e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save sanction details");
		}
	}

	@RequestMapping(value = "/getSanctionDetails")
	public ResponseEntity<?> getSanctionDetails(@RequestParam String sanctionName) {
		try {

			LOGGER.info("API getSanctionDetails called | sanctionName={}", sanctionName);

			List<ResponseSanctionConfigData> resp = sanctionscreeningservice.getSanctionDetails(sanctionName);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No sanction details found | sanctionName={}", sanctionName);
			} else {
				LOGGER.info("Sanction details fetched successfully | sanctionName={} | recordCount={}", sanctionName,
						resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getSanctionDetails API | sanctionName={}", sanctionName, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch sanction details");
		}
	}
	
	

	@PostMapping("/uploadSanctionList")
	public ResponseEntity<String> uploadSanctionList(@RequestParam String sanctionName, @RequestParam String fileType,
			@RequestParam("file") MultipartFile file) {

		try {

			LOGGER.info("API uploadSanctionList called | sanctionName={} | fileType={}", sanctionName, fileType);

			String sanctionCode = "";

			Path uploadPath = Paths.get(path);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
				LOGGER.info("Upload directory created | path={}", uploadPath);
			}

			List<ResponseSanctionConfigData> resp = sanctionscreeningservice.getSanctionDetails(sanctionName);

			if (resp != null && !resp.isEmpty()) {
				sanctionCode = resp.get(0).getSanction_code();
			}

			String fileName = file.getOriginalFilename();
			String lowerFileName = fileName.toLowerCase();

			Path filePath = uploadPath.resolve(sanctionCode + "_" + fileName);

			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

			LOGGER.info("File uploaded successfully | sanctionName={} | fileName={} | path={}", sanctionName, fileName,
					filePath);

			sanctionscreeningservice.uploadSanctionList(sanctionName, fileType, lowerFileName);

			LOGGER.info("Sanction list data saved successfully | sanctionName={} | fileType={}", sanctionName,
					fileType);

			return ResponseEntity.ok("Alert data and files saved");

		} catch (Exception e) {

			LOGGER.error("Exception occurred in uploadSanctionList API | sanctionName={} | fileType={}", sanctionName,
					fileType, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
		}
	}

	@RequestMapping(value = "/getSanctionMatchedList")
	public ResponseEntity<?> getSanctionMatchedList(@RequestParam String sanctionName, @RequestParam String threshold,@RequestParam String processType) {
		try {

			LOGGER.info("API getSanctionMatchedList called | sanctionName={} | threshold={} | processType={}", sanctionName, threshold,processType);

			List<ResponseSanctionMatchedListData> resp = sanctionscreeningservice.getSanctionMatchedList(sanctionName,
					threshold,processType);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No sanction matched records found | sanctionName={} | threshold={} | processType={}", sanctionName,
						threshold,processType);
			} else {
				LOGGER.info(
						"Sanction matched list fetched successfully | sanctionName={} | threshold={}  | processType={} | recordCount={}",
						sanctionName, threshold,processType, resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getSanctionMatchedList API | sanctionName={} | threshold={} | processType={}",
					sanctionName, threshold,processType, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch sanction matched list");
		}
	}

	@RequestMapping(value = "/getCustomerRuleDetails")
	public ResponseEntity<?> getCustomerRuleDetails(@RequestParam String customerId, @RequestParam String ruleType,
			@RequestParam String parentId) {
		try {

			LOGGER.info("API getCustomerRuleDetails called | customerId={} | ruleType={} | parentId={}", customerId,
					ruleType, parentId);

			List<ResponseAlertDetailsData> resp = screeningservice.getCustomerRuleDetails(customerId, ruleType,
					parentId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No customer rule details found | customerId={} | ruleType={} | parentId={}", customerId,
						ruleType, parentId);
			} else {
				LOGGER.info(
						"Customer rule details fetched successfully | customerId={} | ruleType={} | parentId={} | recordCount={}",
						customerId, ruleType, parentId, resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getCustomerRuleDetails API | customerId={} | ruleType={} | parentId={}",
					customerId, ruleType, parentId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch customer rule details");
		}
	}

	@RequestMapping(value = "/getOpenedAlerts")
	public ResponseEntity<?> getOpenedAlerts(@RequestParam String customerId, @RequestParam String ruleType,
			@RequestParam String parentId) {
		try {

			LOGGER.info("API getOpenedAlerts called | customerId={} | ruleType={} | parentId={}", customerId, ruleType,
					parentId);

			List<ResponseAlertDetailsData> resp = screeningservice.getOpenedAlerts(customerId, ruleType, parentId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No opened alerts found | customerId={} | ruleType={} | parentId={}", customerId, ruleType,
						parentId);
			} else {
				LOGGER.info(
						"Opened alerts fetched successfully | customerId={} | ruleType={} | parentId={} | recordCount={}",
						customerId, ruleType, parentId, resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getOpenedAlerts API | customerId={} | ruleType={} | parentId={}",
					customerId, ruleType, parentId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch opened alerts");
		}
	}

	@RequestMapping(value = "/getClosedAlerts")
	public ResponseEntity<?> getClosedAlerts(@RequestParam String customerId, @RequestParam String ruleType,
			@RequestParam String parentId) {
		try {

			LOGGER.info("API getClosedAlerts called | customerId={} | ruleType={} | parentId={}", customerId, ruleType,
					parentId);

			List<ResponseAlertDetailsData> resp = screeningservice.getClosedAlerts(customerId, ruleType, parentId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No closed alerts found | customerId={} | ruleType={} | parentId={}", customerId, ruleType,
						parentId);
			} else {
				LOGGER.info(
						"Closed alerts fetched successfully | customerId={} | ruleType={} | parentId={} | recordCount={}",
						customerId, ruleType, parentId, resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getClosedAlerts API | customerId={} | ruleType={} | parentId={}",
					customerId, ruleType, parentId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch closed alerts");
		}
	}

	@RequestMapping(value = "/getTriggedAlerts")
	public ResponseEntity<?> getTriggedAlerts(@RequestParam String customerId, @RequestParam String ruleType,
			@RequestParam String parentId) {
		try {

			LOGGER.info("API getTriggedAlerts called | customerId={} | ruleType={} | parentId={}", customerId, ruleType,
					parentId);

			List<ResponseAlertDetailsData> resp = screeningservice.getTriggedAlerts(customerId, ruleType, parentId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No triggered alerts found | customerId={} | ruleType={} | parentId={}", customerId,
						ruleType, parentId);
			} else {
				LOGGER.info(
						"Triggered alerts fetched successfully | customerId={} | ruleType={} | parentId={} | recordCount={}",
						customerId, ruleType, parentId, resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getTriggedAlerts API | customerId={} | ruleType={} | parentId={}",
					customerId, ruleType, parentId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch triggered alerts");
		}
	}

	@RequestMapping(value = "/getPreviousTransactions")
	public ResponseEntity<?> getPreviousTransactions(@RequestParam String customerId) {
		try {

			LOGGER.info("API getPreviousTransactions called | customerId={}", customerId);

			List<ResponseTransactionDetailsData> resp = screeningservice.getPreviousTransactions(customerId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No previous transactions found | customerId={}", customerId);
			} else {
				LOGGER.info("Previous transactions fetched successfully | customerId={} | recordCount={}", customerId,
						resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getPreviousTransactions API | customerId={}", customerId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch previous transactions");
		}
	}

	@RequestMapping(value = "/getKycScoreAndDate")
	public ResponseEntity<?> getKycScoreAndDate(@RequestParam String customerId) {
		try {

			LOGGER.info("API getKycScoreAndDate called | customerId={}", customerId);

			List<ResponseKycAlertsDetailsData> resp = screeningservice.getKycScoreAndDate(customerId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No KYC score data found | customerId={}", customerId);
			} else {
				LOGGER.info("KYC score data fetched successfully | customerId={} | recordCount={}", customerId,
						resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getKycScoreAndDate API | customerId={}", customerId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch KYC score and date");
		}
	}

	@RequestMapping(value = "/getSanctionScore")
	public ResponseEntity<?> getSanctionScore(@RequestParam String customerId) {
		try {

			LOGGER.info("API getSanctionScore called | customerId={}", customerId);

			List<ResponseSanctionMatchedListData> resp = screeningservice.getSanctionScore(customerId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No sanction score found | customerId={}", customerId);
			} else {
				LOGGER.info("Sanction score fetched successfully | customerId={} | recordCount={}", customerId,
						resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getSanctionScore API | customerId={}", customerId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch sanction score");
		}
	}
	
	@RequestMapping(value = "/getSanctionDetailsScore")
	public ResponseEntity<?> getSanctionDetailsScore(@RequestParam String customerId) {
		try {

			LOGGER.info("API getSanctionDetailsScore called | customerId={}", customerId);

			List<ResponseSanctionListWeightage> resp = screeningservice.getSanctionDetailsScore(customerId);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No sanction score found | customerId={}", customerId);
			} else {
				LOGGER.info("Sanction Details score fetched successfully | customerId={} | recordCount={}", customerId,
						resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getSanctionScore API | customerId={}", customerId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch sanction score");
		}
	}

	@PostMapping("/setKYCAlertGenerated")
	public ResponseEntity<?> setKYCAlertGenerated(@RequestBody RequestKycAlertsDetailsData request) {
		try {

			LOGGER.info("API setKYCAlertGenerated called | custId={} | transactionId={} | cddEdd={} | alertStatus={}",
					request.getCust_id(), request.getTransactionId(), request.getCdd_edd(), request.getAlert_status());

			screeningservice.setKYCAlertGenerated(request.getCust_id(), request.getTransactionId(),
					request.getCdd_edd(), request.getAlert_status());

			LOGGER.info("KYC alert generated successfully | custId={} | transactionId={}", request.getCust_id(),
					request.getTransactionId());

			return ResponseEntity.ok(Constants.SUCCESS);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in setKYCAlertGenerated API | custId={} | transactionId={}",
					request.getCust_id(), request.getTransactionId(), e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate KYC alert");
		}
	}

	@PostMapping("/setCaregoryWiseTransaction")
	public ResponseEntity<?> setCaregoryWiseTransaction(@RequestBody RequestKycAlertsDetailsData request) {
		try {

			LOGGER.info("API setCaregoryWiseTransaction called | custId={} | transactionId={} | cddEdd={}",
					request.getCust_id(), request.getTransactionId(), request.getCdd_edd());

			screeningservice.setCaregoryWiseTransaction(request);

			LOGGER.info("Category wise transaction saved successfully | custId={} | transactionId={}",
					request.getCust_id(), request.getTransactionId());

			return ResponseEntity.ok(Constants.SUCCESS);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in setCaregoryWiseTransaction API | custId={} | transactionId={}",
					request.getCust_id(), request.getTransactionId(), e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to save category wise transaction");
		}
	}

	@RequestMapping("/deleteSanctionDetails")
	public ResponseEntity<?> deleteSanctionDetails(@RequestBody RequestSanctionConfigData request) {
		try {

			LOGGER.info("API deleteSanctionDetails called | sanctionName={}", request.getSanction_name());

			sanctionscreeningservice.deleteSanctionDetails(request.getSanction_name());

			LOGGER.info("Sanction deleted successfully | sanctionName={}", request.getSanction_name());

			return ResponseEntity.ok("Sanction deleted Successfully");

		} catch (Exception e) {

			LOGGER.error("Exception occurred in deleteSanctionDetails API | sanctionName={}",
					request.getSanction_name(), e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete sanction details");
		}
	}

	@RequestMapping(value = "/getFinalReport")
	public ResponseEntity<?> getFinalReport(@RequestParam String fromDate, @RequestParam String toDate,
			@RequestParam String reportType) {
		try {

			LOGGER.info("API getFinalReport called | reportType={} | fromDate={} | toDate={}", reportType, fromDate,
					toDate);

			List<?> result;

			switch (reportType.toUpperCase()) {

			case "STR":
				result = finalreportservice.getFinalStrReport(fromDate, toDate, reportType);
				break;

			case "CTR":
				result = finalreportservice.getFinalCtrReport(fromDate, toDate, reportType);
				break;

			case "NTR":
				result = finalreportservice.getFinalNtrReport(fromDate, toDate, reportType);
				break;

			case "CBWTR":
				result = finalreportservice.getFinalCbwtrReport(fromDate, toDate, reportType);
				break;

			case "CFTR":
				result = finalreportservice.getFinalCftrReport(fromDate, toDate, reportType);
				break;

			default:
				LOGGER.warn("Invalid reportType received | reportType={}", reportType);
				return ResponseEntity.badRequest().body("Invalid report type");
			}

			if (result == null || result.isEmpty()) {

				LOGGER.warn("No report data found | reportType={} | fromDate={} | toDate={}", reportType, fromDate,
						toDate);

				return ResponseEntity.ok(Map.of("message", "No Record Found", "data", Collections.emptyList()));
			}

			LOGGER.info("Final report fetched successfully | reportType={} | recordCount={}", reportType,
					result.size());

			return ResponseEntity.ok(result);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getFinalReport API | reportType={} | fromDate={} | toDate={}",
					reportType, fromDate, toDate, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch final report");
		}
	}

	@RequestMapping(value = "/getKycAlertRangeCount")
	public ResponseEntity<?> getKycAlertRangeCount(@RequestParam String range) {
		try {

			LOGGER.info("API getKycAlertRangeCount called | range={}", range);

			Map<String, Long> resp = kycalertsservice.getKycAlertRangeCount(range);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No KYC alert range data found | range={}", range);
			} else {
				LOGGER.info("KYC alert range count fetched successfully | range={} | recordCount={}", range,
						resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getKycAlertRangeCount API | range={}", range, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch KYC alert range count");
		}
	}

	@RequestMapping(value = "/getAlertRangeCount")
	public ResponseEntity<?> getAlertRangeCount(@RequestParam String range, @RequestParam String username) {
		try {

			LOGGER.info("API getAlertRangeCount called | range={}", range);

			Map<String, Long> resp = screeningservice.getAlertRangeCount(range, username);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No alert range data found | range={} | level=levelone", range);
			} else {
				LOGGER.info("Alert range count fetched successfully | range={} | level=levelone | recordCount={}",
						range, resp.size());
			}

			return ResponseEntity.ok(resp);

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getAlertRangeCount API | range={}", range, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch alert range count");
		}
	}

	@RequestMapping(value = "/getAlertDetails")
	public Page<AlertParentDTO> getAlertDetails(@RequestParam int page, @RequestParam int size,
			@RequestParam String userId) {

		try {

			LOGGER.info("API getAlertDetails called | userId={} | page={} | size={}", userId, page, size);

			Page<AlertParentDTO> result = screeningservice.getAlertDetails(userId, page, size);

			LOGGER.info("Alert details fetched successfully | userId={} | totalRecords={}", userId,
					result.getTotalElements());

			return result;

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getAlertDetails API | userId={} | page={} | size={}", userId, page,
					size, e);

			throw e;
		}
	}

	@RequestMapping(value = "/setMappingList")
	public ResponseEntity<?> setMappingList() {
		try {
			LOGGER.info("API setMappingList called");

			String resp = schemacreation.setMappingList();

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No mapping data found");
			} else {
				LOGGER.info("Mapping successfully");
			}

			return new ResponseEntity<>(resp, HttpStatus.OK);

		} catch (Exception e) {
			LOGGER.error("Exception in setMappingList", e);
			return new ResponseEntity<>("Failed to fetch Mapping List alerts", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@PostMapping("/uploadNIDVDocument")
	public ResponseEntity<String> uploadNIDVDocument(@RequestBody Map<String, String> request) {

	    try {
	        String documentType = request.get("documentType");
	        String fileName = request.get("fileName");
	        String base64Data = request.get("fileData");

	        byte[] fileBytes = Base64.getDecoder().decode(base64Data);

	        Path filePath = Paths.get(path, fileName);
	        Files.write(filePath, fileBytes);

	        return ResponseEntity.ok("File saved");

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
	    }
	}

	
	@PostMapping("/uploadAccessListDocument")
	public ResponseEntity<String> uploadAccessListDocument(@RequestBody Map<String, String> request) {

	    try {
	        String documentType = request.get("documentType");
	        String fileName = request.get("fileName");
	        String base64Data = request.get("fileData");
	        	        
	    	Path uploadPath = Paths.get(accessListPath + "/" + documentType + "/" );
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
				LOGGER.info("Created upload directory: {}", uploadPath);
			}

	        byte[] fileBytes = Base64.getDecoder().decode(base64Data);
	        Path filePath = uploadPath.resolve(fileName);
	        Files.write(filePath, fileBytes);
	        return ResponseEntity.ok("File saved");

	    } catch (Exception e) {
	    	 e.printStackTrace(); 
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
	    }
	}
	
	@RequestMapping(value = "/getMatchedLists")
	public ResponseEntity<?> getMatchedLists(@RequestParam String name) {
		try {

			LOGGER.info("API getMatchedLists called | url={}, name={}", nameMatchedUrl, name);

			String url = nameMatchedUrl;

			Map<String, String> request = new HashMap<>();
			request.put("name", name);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

			RestTemplate restTemplate = new RestTemplate();

			// ✅ FIX: use List instead of Map
			ResponseEntity<List> response = restTemplate.postForEntity(url, entity, List.class);

			return ResponseEntity.ok(response.getBody());

		} catch (Exception e) {

			LOGGER.error("Exception occurred in getMatchedLists API | name={}", name, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to fetch sanction matched list");
		}
	}


}

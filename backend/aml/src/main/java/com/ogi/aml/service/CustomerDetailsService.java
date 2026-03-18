package com.ogi.aml.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.aml.Controller.AmlController;
import com.ogi.aml.entity.CustomerEntity;
import com.ogi.aml.entity.KycAlertsEntity;
import com.ogi.aml.repo.CustomerRepo;
import com.ogi.aml.repo.KycAlertsDetailsImplRepo;
import com.ogi.aml.response.ResponseCustomerDetailsData;
import com.ogi.aml.response.ResponseKycAlertsDetailsData;

@Service
public class CustomerDetailsService {
	private Logger LOGGER = LoggerFactory.getLogger(CustomerDetailsService.class);

	@Autowired
	CustomerRepo customerrepo;

	@Autowired
	KycAlertsDetailsImplRepo kycalertsdetailsimplrepo;

	public ResponseCustomerDetailsData getCustomerDetails(String custId) {
		try {

			LOGGER.info("Service getCustomerDetails called | customerId={}", custId);

			Optional<CustomerEntity> respCustDetails = customerrepo.findById(custId);

			if (respCustDetails.isPresent()) {

				LOGGER.info("Customer record found | customerId={}", custId);

				return getCustomerDetailsResult(respCustDetails);

			} else {

				LOGGER.warn("Customer record not found | customerId={}", custId);

				return new ResponseCustomerDetailsData();
			}

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getCustomerDetails | customerId={}", custId, ex);

			return new ResponseCustomerDetailsData();
		}
	}

	public ResponseCustomerDetailsData getCustomerDetailsResult(Optional<CustomerEntity> resp) {
		try {

			if (resp.isEmpty()) {
				LOGGER.warn("Customer entity optional is empty");
				return new ResponseCustomerDetailsData();
			}

			CustomerEntity entity = resp.get();

			LOGGER.info("Mapping customer details | customerId={}", entity.getCustomerid());

			String kycStatus = "";

			List<KycAlertsEntity> lstUpdateAlert = kycalertsdetailsimplrepo.getKycAlertsDetails("", "", "",
					entity.getCustomerid(), "");

			if (lstUpdateAlert != null && !lstUpdateAlert.isEmpty()) {

				kycStatus = lstUpdateAlert.get(lstUpdateAlert.size() - 1).getAlert_status();

				LOGGER.debug("KYC status found | customerId={} | status={}", entity.getCustomerid(), kycStatus);
			}

			ResponseCustomerDetailsData res = new ResponseCustomerDetailsData();

			res.setCustomerid(entity.getCustomerid());
			res.setCustomername(entity.getCustomername());
			res.setCustomertype(entity.getCustomertype());
			res.setKycStatus(kycStatus);
			res.setBranchcode(entity.getBranchcode());
			res.setFirstname(entity.getFirstname());
			res.setLastname(entity.getLastname());
			res.setDateofbirth(entity.getDateofbirth());
			res.setPlaceofbirth(entity.getPlaceofbirth());
			res.setNationality(entity.getNationality());
			res.setAge(entity.getAge());
			res.setSex(entity.getSex());
			res.setPanno(entity.getPanno());
			res.setOccupation(entity.getOccupation());
			res.setAddressline1(entity.getAddressline1());
			res.setCity(entity.getCity());
			res.setState(entity.getState());
			res.setCountry(entity.getCountry());
			res.setPincode(entity.getPincode());
			res.setPhoneno(entity.getPhoneno());
			res.setMobileno(entity.getMobileno());
			res.setEmailid(entity.getEmailid());

			LOGGER.info("Customer details mapped successfully | customerId={}", entity.getCustomerid());

			return res;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getCustomerDetailsResult", ex);

			return new ResponseCustomerDetailsData();
		}
	}

}

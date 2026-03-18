package com.ogi.entityHub.services;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.entityHub.entity.AppEntity;
import com.ogi.entityHub.repo.AppEntityRepository;

@Service
public class AppService extends BaseResolver<AppEntity, Long> {

	@Autowired
	AppEntityRepository appRepo;

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ_BY_ID, Operations.UPDATE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return null;
	}

	public List<AppEntity> findAllApps() {
		return appRepo.findAll();
	}

	public AppEntity findById(long id) {
		Optional<AppEntity> optionalEntity = appRepo.findById(id);
		if (optionalEntity.isPresent()) {
			return optionalEntity.get();
		}

		return new AppEntity();
	}
	
	
	public List<AppEntity> findActiveApps(){
		return appRepo.findByActiveTrue();
	}

}

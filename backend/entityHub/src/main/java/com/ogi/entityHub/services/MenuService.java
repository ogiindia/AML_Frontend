package com.ogi.entityHub.services;

import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.interfaces.MenuInterface;
import com.ogi.factory.template.BaseResolver;
import com.ogi.entityHub.entity.EntityMaster;
import com.ogi.entityHub.entity.MenuMaster;
import com.ogi.entityHub.repo.MenuMasterRepository;

@Service
public class MenuService extends BaseResolver<MenuMaster, Long> implements MenuInterface {

	@Autowired
	MenuMasterRepository menuRepo;

	@Autowired
	EntityService entService;

	@Autowired
	ObjectMapper obj;

	@Autowired
	AppService apService;

	private static final String entityID = "MENU";

	@Override
	public List<?> getEntitiesByUserId(String userId) {

		// at original implementation it has to readed from session and set the
		// username.
		return entService.getMyEntities(userId);
	}

	@Override
	public List<?> getActiveapps() {
		return apService.findActiveApps();
	}

	@Override
	public Set<?> getEntitiesIn(Set<?> en) {

		return menuRepo.findByEntIn((Set<EntityMaster>) en);

	}

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return entityID;
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.SAVE, Operations.READ);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return Commons.CORE.toString();
	}

}

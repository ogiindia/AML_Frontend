package com.ogi.entityHub.services;

import java.security.Principal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.factory.annotations.GraphQLIgnore;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.annotations.Required;
import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.errors.InvalidAccessException;
import com.ogi.factory.interfaces.EntityInterface;
import com.ogi.factory.interfaces.PrincipalService;
import com.ogi.factory.template.BaseResolver;
import com.ogi.entityHub.entity.EntityMaster;
import com.ogi.entityHub.entity.MenuMaster;
import com.ogi.entityHub.repo.AppEntityRepository;
import com.ogi.entityHub.repo.EntityMasterRepository;
import com.ogi.entityHub.repo.MenuMasterRepository;

@Service
public class EntityService extends BaseResolver<EntityMaster, Long> implements EntityInterface {

	@Autowired
	EntityMasterRepository entityRepo;

	@Autowired
	MenuMasterRepository menuRepo;

	@Autowired
	AppEntityRepository appRepo;

	@Autowired
	ObjectMapper obj;

	@Autowired
	PrincipalService ps;

	private static final String entityID = "ENTITY";

	@GraphQLQuery
	public MenuMaster entityIsValid(@Required String tId) {

		Optional<MenuMaster> optionalEntity = menuRepo.findByPath(tId);
		System.out.println("is optionalEntity present : " + optionalEntity.isPresent());
		if (optionalEntity.isPresent()) {
			// check user has the necessary role ?

			if (ps.checkEntityisPresent(optionalEntity.get().getEnt().getId())) {
				return optionalEntity.get();
			} else {
				throw new InvalidAccessException("Permission Denied");
			}

		}

		throw new InvalidAccessException("given path " + tId + " not found ");
	}

	@Override
	public boolean isEntityexists(String module, String action) {
		EntityMaster optionalEntity = entityRepo.findByEntityActionAndModule(action, module);
		if (optionalEntity.getId() != null && optionalEntity.getId() > 0)
			return true;

		return false;
	}

	@Override
	public Long getEntityById(String module, String action) {
		return entityRepo.findByEntityActionAndModule(action, module).getId();
	}

	public List<EntityMaster> getMyEntities(String username) {
		return entityRepo.findAll();
	}

//	public List<EntityMaster> getUnMappedEntities() {
//		return entityRepo.findByMenuIsNull();
//	}

	@Transactional
	public EntityMaster save(EntityMaster entity) {

//		if (entity.getApp().getId() == null) {
//			entity.setApp(appRepo.findByAppId(entity.getApp().getAppId()));
//		}
//		
//		

		// check entry already exists

		EntityMaster en = entityRepo.findByEntityActionAndModule(entity.getEntityAction(), entity.getModule());

		if (en != null && en.getId() != null) {
//			entity.setId(en.getId());
//			entity.setCreatedBy(en.getCreatedBy());
//			entity.setCreatedAt(en.getCreatedAt());
			return en;
		}

		return super.save(entity);
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

	@Override
	public Set<?> getEntities() {
		// TODO Auto-generated method stub
		return new HashSet<EntityMaster>(entityRepo.findAll());
	}

	@Override
	public List<?> getEntitiesByGroup(String groupname) {
		// TODO Auto-generated method stub
		return null;
	}

}

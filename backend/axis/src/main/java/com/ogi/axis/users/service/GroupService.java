package com.ogi.axis.users.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.entityHub.entity.EntityMaster;
import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.axis.users.entity.GroupEntity;
import com.ogi.axis.users.repository.GroupRepository;

@Service
public class GroupService extends BaseResolver<GroupEntity, Long> {

	@Autowired
	GroupRepository grpRepo;

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "GRP";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ, Operations.READ_BY_ID, Operations.READ_BY_PAGING, Operations.DISABLE,
				Operations.UPDATE, Operations.SAVE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return Commons.CORE.name();
	}

	public List<EntityMaster> findByGroupId(Long grpId) {
		return grpRepo.findAllByGroupId(grpId);
	}

}

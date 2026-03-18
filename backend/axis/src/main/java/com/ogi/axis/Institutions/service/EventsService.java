package com.ogi.axis.Institutions.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.axis.Institutions.entity.EventsEntity;

@Service
public class EventsService extends BaseResolver<EventsEntity, UUID> {
	private static final String entityID = "EVENT";

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ, Operations.SAVE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return Commons.CORE.toString();
	}

}

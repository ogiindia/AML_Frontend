package com.ogi.axis.Institutions.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Commons;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.axis.Institutions.entity.EventsEntity;
import com.ogi.axis.Institutions.entity.EventsMeta;
import com.ogi.axis.Institutions.repository.EventEntityRepository;
import com.ogi.axis.Institutions.repository.EventMetaRepository;

@Service
public class EventMetaService extends BaseResolver<EventsMeta, Long> {

	@Autowired
	EventEntityRepository eventRepo;

	@Autowired
	EventMetaRepository eventMetaRepo;

	private static final String entityID = "EVENT_META";

	@GraphQLMutation
	@Transactional
	public List<EventsMeta> saveAllEntityMeta(List<EventsMeta> metaData) {

		if (metaData.size() > 0) {
			for (EventsMeta eventsMeta : metaData) {
				if (eventsMeta.getEvent() != null && eventsMeta.getEvent().getId() != null) {

					Optional<EventsMeta> optionalEventMeta = eventMetaRepo.findByMetaTypeAndMetaNameAndEvent_id(
							eventsMeta.getMetaType(), eventsMeta.getMetaName(), eventsMeta.getEvent().getId());

					if (optionalEventMeta.isPresent()) {
						eventsMeta.setId(optionalEventMeta.get().getId());
					}

					Optional<EventsEntity> OptionaleventEntity = eventRepo.findById(eventsMeta.getEvent().getId());

					if (OptionaleventEntity.isPresent()) {
						EventsEntity eventEntity = OptionaleventEntity.get();
						eventsMeta.setEvent(eventEntity);
					}
				}

			}
		}

		return super.saveAll(metaData);
	}

	@GraphQLQuery
	public List<EventsMeta> findEventMetaByMetaType(String metaType) {
		return eventMetaRepo.findByMetaType(metaType);
	}

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return entityID;
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

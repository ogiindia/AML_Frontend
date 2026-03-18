package com.ogi.entityHub;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.entityHub.entity.AppEntity;
import com.ogi.entityHub.entity.EntityMaster;
import com.ogi.entityHub.services.AppService;
import com.ogi.entityHub.services.EntityService;

@Component
public class EntityBuilder {

	@Autowired
	ApplicationContext context;

	@Autowired
	AppService appService;

	@Autowired
	EntityService entityService;

	private static List<String> appList = new ArrayList<String>();

	private static Map<String, Set<Operations>> entityList = new HashMap<String, Set<Operations>>();

	private static Map<String, AppEntity> appStorage = new HashMap<String, AppEntity>();

	@SuppressWarnings({ "rawtypes", "unlikely-arg-type" })
	@PostConstruct
	public void registerEntities() {

		System.out.println("into register Entities");

		this.getApps();
		this.getentityList();

		Map<String, BaseResolver> services = context.getBeansOfType(BaseResolver.class);

//		System.out.println("Entity Builder services matching : " + services);

		// load previous appDatas ,
		// load previous supportedOperations

		for (Entry<String, BaseResolver> entry : services.entrySet()) {

			System.out.println("service Name : " + entry.getKey());

			String appId = entry.getValue().getAppID();

			String module = entry.getValue().getEntityID();

			if (appId != null && !appList.contains(appId)) {
				AppEntity ap = new AppEntity();
				ap.setAppId(appId);
				ap = appService.save(ap);
				appList.add(appId);
				appStorage.put(appId, ap);
			}

			Set<Operations> supportedOperations = entry.getValue().getSupportedOperations();

			if (module != null && appId != null && supportedOperations != null && !supportedOperations.isEmpty()) {

				Set<Operations> extras = supportedOperations.stream().collect(Collectors.toCollection(HashSet::new));
//
//				System.out.println("operations : " + extras);

				if (entityList.containsKey(module) && entityList.get(module) != null) {
					extras.removeIf(item -> {
						return entityList.get(module).stream()
								.anyMatch(filter -> ((String) item.name()).contains(filter.name()));
					});
				}
//
//				System.out.println("extras" + extras);

				for (Operations operation : extras) {
					// goes to db
					// ALLOWED ACTIONS ? READ, CREATE , UPDATE , DELETE
					System.out.println("Operation to insert :" + operation.name());
					EntityMaster en = new EntityMaster();
					en.setModule(entry.getValue().getEntityID());
					if (operation.name().contains("READ")) {
						en.setEntityAction(Operations.READ.name());
					} else if (operation.name().contains("SAVE")) {
						en.setEntityAction(Operations.SAVE.name());
					} else if (operation.name().contains("UPDATE")) {
						en.setEntityAction(Operations.UPDATE.name());
					} else if (operation.name().contains("DELETE")) {
						en.setEntityAction(Operations.DELETE.name());
					} else if (operation.name().contains("DISABLE")) {
						en.setEntityAction(Operations.DISABLE.name());
					} else {
						en.setEntityAction(operation.name());
					}

					en.setApp(appStorage.get(appId));
					en.setEntityName(en.getModule() + "_" + en.getEntityAction());
					en = entityService.save(en);

					Set<Operations> operations = new HashSet<Operations>();

					if (entityList.containsKey(en.getModule())) {
						operations = entityList.get(en.getModule());
					}

					operations.add(Operations.valueOf(en.getEntityAction()));

					entityList.put(en.getModule(), operations);

				}

			}

		}

	}

	private void getentityList() {
		List<EntityMaster> es = entityService.findAll();

		if (es.isEmpty())
			return;

		for (EntityMaster entityMaster : es) {
			Set<Operations> operations = new HashSet<Operations>();
			if (entityMaster.getModule() != null && entityList.containsKey(entityMaster.getModule())) {
				operations = entityList.get(entityMaster.getModule());

			}

//			System.out.println("..." + entityMaster.getEntityAction());
			operations.add(Operations.valueOf(entityMaster.getEntityAction()));

			entityList.put(entityMaster.getModule(), operations);
		}
	}

	private void getApps() {
		List<AppEntity> ls = appService.findAllApps();

		if (ls.isEmpty())
			return;

		for (AppEntity appEntity : ls) {
			appList.add(appEntity.getAppId());
			appStorage.put(appEntity.getAppId(), appEntity);
		}

	}

}

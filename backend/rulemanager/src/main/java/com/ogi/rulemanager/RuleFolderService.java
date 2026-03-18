package com.ogi.rulemanager;

import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.rulemanager.entity.RuleFolderEntity;
import com.ogi.rulemanager.repo.RuleFolderRepository;

@Service
public class RuleFolderService extends BaseResolver<RuleFolderEntity, UUID> {

	@Autowired
	RuleFolderRepository folderRepo;

	@GraphQLQuery
	public List<RuleFolderEntity> getFolderHierarchy() {
		List<RuleFolderEntity> roots = folderRepo.findByParentIsNull();

		for (RuleFolderEntity ruleFolderEntity : roots) {
			buildFolderTree(ruleFolderEntity);
		}

		return roots;

	}

	public RuleFolderEntity buildFolderTree(RuleFolderEntity folder) {
		List<RuleFolderEntity> children = folderRepo.findByParentId(folder.getId());
		folder.setChildren(children);
		for (RuleFolderEntity ruleFolderEntity : children) {
			buildFolderTree(ruleFolderEntity);
		}

		return folder;
	}

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "RULE_FOLDER";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ, Operations.SAVE, Operations.DELETE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "RULE";
	}

}

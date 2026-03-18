package com.ogi.axis.users.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.zip.DataFormatException;

import javax.transaction.Transactional;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.axis.users.controller.UserController;
import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLOverride;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.annotations.Required;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.errors.GenericErrorException;
import com.ogi.factory.errors.RecordNotFoundException;
import com.ogi.factory.errors.UserAlreadyExistsException;
import com.ogi.factory.interfaces.PrincipalService;
import com.ogi.factory.pojo.LoginResponseEntity;
import com.ogi.factory.template.BaseResolver;
import com.ogi.factory.template.KeywordService;
import com.ogi.axis.users.entity.GroupEntity;
import com.ogi.axis.users.entity.UserLogin;
import com.ogi.axis.users.entity.UserProfile;
import com.ogi.axis.users.repository.GroupRepository;
import com.ogi.axis.users.repository.UserLoginRepository;
import com.ogi.axis.users.repository.UserProfileRepository;
import com.ogi.entityHub.entity.EntityMaster;

@Service
public class UserProfileService extends BaseResolver<UserProfile, Long> implements PrincipalService {

	@Autowired
	UserProfileRepository repo;

	@Autowired
	UserLoginRepository loginRepository;

	@Autowired
	GroupRepository grpRepository;

	@Autowired
	ObjectMapper obj;

	private final KeywordService ks;

	public UserProfileService(@Lazy KeywordService keywordService) {
		this.ks = keywordService;
	}

	@Transactional
	@GraphQLMutation
	public UserProfile saveUserProfileWithLogin(UserProfile userProfile, String password) {
		boolean isexistinguser = false;
		if (userProfile.getId() > 0) {

			isexistinguser = true;
			UserProfile up = repo.findById(userProfile.getId()).orElse(userProfile);

			for (GroupEntity group : new HashSet<>(up.getGroups())) {
				group.getUsers().remove(up);
				grpRepository.save(group);
			}

			if (up.getCreatedAt() != null)
				userProfile.setCreatedAt(up.getCreatedAt());

			if (up.getCreatedBy() != null)
				userProfile.setCreatedBy(up.getCreatedBy());

			if (userProfile.getGroups() != null && userProfile.getGroups().size() > 0) {

				Set<Long> userGroupIds = userProfile.getGroups().stream().map(GroupEntity::getId)
						.collect(Collectors.toSet());
				// remove user from all groups
				List<GroupEntity> existingGroups = grpRepository.findAll();

				userProfile.getGroups().clear();

				System.out.println(userGroupIds);
				List<GroupEntity> matchedGroups = existingGroups.stream().filter(g -> userGroupIds.contains(g.getId()))
						.toList();

				System.out.println("matchedGroups : " + matchedGroups.size());
				for (GroupEntity groupEntity : matchedGroups) {
					groupEntity.getUsers().add(userProfile);
					userProfile.getGroups().add(groupEntity);
				}
			}
			try {
				System.out.println(obj.writeValueAsString(userProfile.getGroups()));
			} catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			UserProfile u = super.save(userProfile);
			if (password != null && isexistinguser) {
				UserLogin ul = loginRepository.findByUsername(userProfile.getUsername()).orElse(new UserLogin());

				ul.setUsername(userProfile.getUsername());
				ul.setPassword(ks.encode(password));
				ul.setPwdStatus("A");

				ul.setUserProfile(u);

				loginRepository.save(ul);
			}

			return u;

		} else {
			UserLogin us = new UserLogin();
			UserProfile up = new UserProfile();

			Optional<UserLogin> pous = loginRepository.findByUsername(userProfile.getUsername());

			if (pous.isPresent()) {

				throw new UserAlreadyExistsException(
						"User " + userProfile.getUsername() + " already bound to different user");
			}

			us.setPassword(ks.encode(password));
			us.setUsername(userProfile.getUsername());
			us.setUserStatus(true);
			us.setPwdStatus("I");

			up.setFirstName(userProfile.getFirstName());
			up.setLastName(userProfile.getLastName());

			up.setUsername(userProfile.getUsername());

			us.setLtPwdChgdDt(LocalDateTime.now());
			us.setPwdFailedCnt(0);
			up.setRole(userProfile.getRole());
			up.setBankName(userProfile.getBankName());
			up.setDeptName(userProfile.getDeptName());
			up.setEmail(userProfile.getEmail());
			up.setInsId(userProfile.getInsId());

			us.setUserProfile(up);
			us = loginRepository.save(us);
			UserProfile u = super.save(up);

			if (!userProfile.getGroups().isEmpty()) {
				for (GroupEntity grpEntity : userProfile.getGroups()) {
					Optional<GroupEntity> gp = grpRepository.findById(grpEntity.getId());
					if (gp.isPresent()) {
						u.getGroups().add(gp.get());
						gp.get().getUsers().add(u);
						grpRepository.save(gp.get());
					}
				}
			}
			return u;
		}

	}

	public List<UserProfile> findByGroupByUserID(UUID profileId) {
		return repo.findGroupsById(profileId);
	}

	@GraphQLMutation
	@Transactional
	@GraphQLOverride
	@Override
	public void delete(Long id) {
		UserProfile up = repo.findById(id).orElseThrow(() -> new RecordNotFoundException("Record not found: " + id));
		List<GroupEntity> grps = grpRepository.findByUsers_Id(id);
		for (GroupEntity groupEntity : grps) {
			groupEntity.getUsers().remove(up);
			grpRepository.save(groupEntity);
		}
		Optional<UserLogin> optu = loginRepository.findByUsername(up.getUsername());
		if (optu.isPresent()) {
			loginRepository.deleteById(optu.get().getId());
		}

		super.delete(id);
	}

	@GraphQLQuery
	public String hello(Integer v1, String v2, Long v3, Boolean v4, List<String> lt, UserLogin us) {

		System.out.println(v1 + v2 + v3 + v4);

		for (String string : lt) {
			System.out.println(string);
		}

		try {
			System.out.println(obj.writeValueAsString(us));
			us.getUserProfile().getGroups().forEach(e -> {
				System.out.println("into groups : " + e.getGroupName());
			});
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		throw new GenericErrorException("1001", "Failed to process contact administrator");
//		System.out.println(principalService.getLoginUser());
//		return "success";
	}

	@GraphQLQuery
	public Optional<UserProfile> findByUserName(@Required String username) {

		return repo.findByUsernameAndActive(username, true);

	}
	
	
	@Override
	public String getEntityID() {
		return "USER";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		return Set.of(Operations.READ, Operations.READ_BY_PAGING, Operations.UPDATE, Operations.DISABLE,
				Operations.READ_BY_ID, Operations.DELETE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "CORE";
	}

	@Override
	public String getLoginUser() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		if (principal instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) principal;
			return userDetails.getUsername();
		}

		return null;
	}

	@Override
	public List<GroupEntity> getGroups() {
		if (getLoginUser() != null) {
			Optional<UserProfile> optionalUserProfile = repo.findByUsernameAndActive(getLoginUser(), true);

			if (optionalUserProfile.isPresent()) {
				UserProfile up = optionalUserProfile.get();
				return new ArrayList<GroupEntity>(up.getGroups());
			}
		}
		return null;
	}

	@Override
	public List<Long> getGroupsIds() {
		List<Long> ids = new ArrayList<Long>();
		if (getLoginUser() != null) {
			Optional<UserProfile> optionalUserProfile = repo.findByUsernameAndActive(getLoginUser(), true);

			if (optionalUserProfile.isPresent()) {
				UserProfile up = optionalUserProfile.get();

				for (GroupEntity grp : up.getGroups()) {
					ids.add(grp.getId());
				}
			}
		}
		return ids;
	}

	@Override
	public UserProfile getUserProfile() {
		if (getLoginUser() != null) {
			Optional<UserProfile> optionalUserProfile = repo.findByUsernameAndActive(getLoginUser(), true);

			if (optionalUserProfile.isPresent()) {
				UserProfile up = optionalUserProfile.get();
				return up;
			}
		}
		return new UserProfile();
	}

	@Override
	public Long getuserId() {
		return this.getUserProfile().getId();
	}

	@Override
	public boolean checkEntityisPresent(Long entityId) {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		if (principal instanceof UserDetails) {
			UserDetails userDetails = (UserDetails) principal;

			Optional<UserProfile> optionalUserProfile = repo.findByUsernameAndActive(userDetails.getUsername(), true);

			if (optionalUserProfile.isPresent()) {
				UserProfile up = optionalUserProfile.get();
				Set<GroupEntity> groupList = up.getGroups();

				for (GroupEntity groupEntity : groupList) {
					Set<EntityMaster> entities = groupEntity.getEntities();
					for (EntityMaster ent : entities) {

						if (ent.getId().equals(entityId))
							return true;
					}
				}
			}

		}

		return false;
	}

	@Override
	public LoginResponseEntity getSessionData() {
		LoginResponseEntity requestentity = new LoginResponseEntity();
		String username = this.getLoginUser();

		if (username == null)
			return requestentity;

		Optional<UserLogin> OptUserLogin = loginRepository.findByUsername(username);

		if (OptUserLogin.isPresent()) {
			UserLogin userlogin = OptUserLogin.get();

			requestentity.setUserName(username);
			requestentity.setStatus(userlogin.getPwdStatus());
			requestentity.setInsId(userlogin.getUserProfile().getInsId());
			return requestentity;
		}

		return requestentity;
	}

}

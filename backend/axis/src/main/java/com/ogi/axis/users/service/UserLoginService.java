package com.ogi.axis.users.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.factory.interfaces.EntityInterface;
import com.ogi.factory.interfaces.JwtServiceInterface;
import com.ogi.factory.interfaces.PrincipalService;
import com.ogi.factory.template.KeywordService;
import com.ogi.axis.users.entity.GroupEntity;
import com.ogi.axis.users.entity.UserLogin;
import com.ogi.axis.users.entity.UserProfile;
import com.ogi.axis.users.repository.GroupRepository;
import com.ogi.axis.users.repository.UserLoginRepository;
import com.ogi.axis.users.repository.UserProfileRepository;
import com.ogi.factory.pojo.LoginResponseEntity;
import com.ogi.entityHub.entity.EntityMaster;

@Service
public class UserLoginService implements UserDetailsService {

	@Autowired
	UserLoginRepository loginRepository;

	@Autowired
	JwtServiceInterface jwtService;

	@Autowired
	GroupRepository grpRepo;

	@Autowired
	ObjectMapper obj;

	@Autowired
	EntityInterface et;

	private final KeywordService keywordService;

	public UserLoginService(@Lazy KeywordService keywordService) {
		this.keywordService = keywordService;
	}

	@Override
	public UserDetails loadUserByUsername(String username) {
		Optional<UserLogin> Optuser = loginRepository.findByUsernameAndUserStatus(username, true);

		if (Optuser.isPresent()) {

			try {
				System.out.println(obj.writeValueAsString(Optuser.get()));
			} catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			System.out.println(Optuser.get());
			return new CustomUserLoginService(Optuser.get());

		}
		throw new UsernameNotFoundException("could not found user..!!");

	}

	public UserLogin findByUserName(String username) {
		Optional<UserLogin> Optuser = loginRepository.findByUsernameAndUserStatus(username, true);

		if (Optuser.isPresent()) {

			return Optuser.get();
		}
		return null;
	}

	public boolean changePassword(String keyword, String username) {
		Optional<UserLogin> oUinfo = loginRepository.findByUsername(username);

		if (oUinfo.isPresent()) {
			UserLogin uinfo = oUinfo.get();
			uinfo.setPassword(keywordService.encode(keyword));
			uinfo.setPwdStatus("A");
			loginRepository.save(uinfo);
			return true;
		}
		return false;
	}

	public LoginResponseEntity updatePassword(String currentKeyword, String keyword, String username) {
		Optional<UserLogin> puinfo = loginRepository.findByUsername(username);

		if (puinfo.isPresent()) {
			UserLogin uinfo = puinfo.get();
			if (currentKeyword.trim().equals(keyword.trim())) {
				return new LoginResponseEntity("2", null);
			}

			if (keywordService.matches(currentKeyword, uinfo.getPassword())) {

				uinfo.setPassword(keywordService.encode(keyword));
				uinfo.setPwdStatus("A");
				loginRepository.save(uinfo);

				LoginResponseEntity lr = new LoginResponseEntity("0", jwtService.GenerateToken(uinfo.getUsername()));

				lr.setUserName(uinfo.getUsername());

				List<String> roles = new ArrayList<>();
//
//				for (UserRole role : uinfo.getRoles()) {
//					roles.add(role.getName());
//				}

				lr.setRole(roles);

				return lr;
			}
		}
		return new LoginResponseEntity("1", null);

	}

	public void createSystemUser(String username, String password) {

		System.out.println("Intializing System users !!! " + username);
		UserLogin us = new UserLogin();
		UserProfile up = new UserProfile();

		Optional<UserLogin> pous = loginRepository.findByUsername(username);

		if (pous.isPresent()) {

			return;
		}

		us.setPassword(keywordService.encode(password));
		us.setUsername(username);
		us.setUserStatus(true);
		us.setPwdStatus("I");

		up.setFirstName("System");
		up.setLastName("admin");

		up.setUsername(username);

		us.setLtPwdChgdDt(LocalDateTime.now());
		us.setPwdFailedCnt(0);

//		Set<UserRole> userRoles = new HashSet();
//
//		userRoles.add(userRoleRepository.findByName("ADMIN"));
//
//		us.setRoles(userRoles);

		us.setUserProfile(up);
		us = loginRepository.save(us);

		if (us.getUserProfile().getGroups().isEmpty()) {
			Optional<GroupEntity> gp = grpRepo.findByGroupName("sys");
			if (gp.isPresent()) {
				us.getUserProfile().setGroups(Set.of(gp.get()));
			} else {
				GroupEntity ge = new GroupEntity();

				ge.setGroupName("sys");
				ge.setGroupDesc("sys");
				ge.setUsers(Set.of(us.getUserProfile()));

				ge.setEntities((Set<EntityMaster>) et.getEntities());

				ge.getUsers().forEach(e -> System.out.println(e.getId()));
				us.getUserProfile().setGroups(Set.of(ge));
				grpRepo.save(ge);

			}
		}

		// create group
//		GroupEntity ge = new GroupEntity();
//
//		ge.setGroupName("sys");
//		ge.setGroupDesc("sys");
//		ge.setUsers(Set.of(pous.get().getUserProfile()));
//
//		ge.getUsers().forEach(e -> System.out.println(e.getId()));
//
//		grpRepo.save(ge);

	}



}

package com.ogi.axis.users.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ogi.factory.interfaces.JwtServiceInterface;
import com.ogi.factory.interfaces.MenuInterface;
import com.ogi.factory.pojo.CommonRequestEntity;
import com.ogi.factory.pojo.LoginRequestEntity;
import com.ogi.factory.pojo.LoginResponseEntity;
import com.ogi.axis.users.entity.GroupEntity;
import com.ogi.axis.users.entity.UserLogin;
import com.ogi.axis.users.entity.UserProfile;
import com.ogi.axis.users.service.GroupService;
import com.ogi.axis.users.service.UserLoginService;
import com.ogi.axis.users.service.UserProfileService;
import com.ogi.entityHub.entity.EntityMaster;

@RestController
@RequestMapping("/app/v1")
public class UserController {

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserLoginService ul;

	@Autowired
	UserProfileService up;

	@Autowired
	GroupService gservice;

	@Autowired
	JwtServiceInterface jwtService;

	@Autowired
	MenuInterface menuService;

	@PostMapping("/login")
	public ResponseEntity<LoginResponseEntity> AuthenticateAndGetToken(@RequestBody LoginRequestEntity authRequestDTO)
			throws BadCredentialsException {
		try {

			Authentication authentication1 = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getKeyword()));

			if (authentication1.isAuthenticated() && authentication1 instanceof UsernamePasswordAuthenticationToken) {

				UserLogin us = ul.findByUserName(authRequestDTO.getUsername());

				HashMap<String, Object> hs = new HashMap<>();

				List<String> roles = new ArrayList<>();
//
//				for (GrantedAuthority grantedAuthority : authentication1.getAuthorities()) {
//					// roles.add(ul.checkRoles(grantedAuthority.getAuthority()));
//				}

				hs.put("roles", roles);

				LoginResponseEntity lr = new LoginResponseEntity("0",
						jwtService.GenerateToken(authRequestDTO.getUsername()));
				lr.setUserName(authRequestDTO.getUsername());

				lr.setRole(roles);

//				lr.setMenu(menuService.getEntitiesByUserId(us.getUsername()));

				// getlist of groups the user is present

				Set<GroupEntity> groups = us.getUserProfile().getGroups();

				lr.setGroupName(groups.stream().map(GroupEntity::getGroupName).collect(Collectors.joining(",")));
				// lr.setGroupId(groups.stream().map(GroupEntity::getId).collect(Collectors.joining(",")));
				lr.setGroupId(groups.stream().map(g -> String.valueOf(g.getId())).collect(Collectors.joining(",")));
				
				Set<EntityMaster> entities = us.getUserProfile().getGroups().stream()
						.flatMap(group -> group.getEntities().stream()).collect(Collectors.toSet());

				if (entities.size() > 0) {

					lr.setMenu(new ArrayList<>(menuService.getEntitiesIn(entities)));
				}

				lr.setActiveApps(menuService.getActiveapps());

				// map roles - done
				// not working at run-time
				// save authtype - done
				// define ordering

				if (us != null) {

					if (us.getPwdStatus() == null || us.getPwdStatus().trim().equals("I")) {
						lr.setStatus("3");
					}

				}

				return new ResponseEntity<LoginResponseEntity>(lr, HttpStatus.ACCEPTED);

			} else {
				throw new UsernameNotFoundException("invalid user request..!!");
			}

		} catch (BadCredentialsException b) {
			return new ResponseEntity<LoginResponseEntity>(new LoginResponseEntity("1", null), HttpStatus.ACCEPTED);
		} catch (AuthenticationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return new ResponseEntity<LoginResponseEntity>(new LoginResponseEntity("2", null), HttpStatus.ACCEPTED);
	}

	@PostMapping("/users/update-password")
	public ResponseEntity<LoginResponseEntity> updatePassword(@RequestBody CommonRequestEntity requestEntity,
			Principal principal) {

		if (requestEntity.getKeyword() != null) {
			return new ResponseEntity<LoginResponseEntity>(ul.updatePassword(requestEntity.getCurrentkeyword(),
					requestEntity.getKeyword(), principal.getName()), HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<LoginResponseEntity>(HttpStatus.BAD_REQUEST);
	}

	@PostMapping("/users/change-password")
	public ResponseEntity<Boolean> changePassword(@RequestBody CommonRequestEntity requestEntity, Principal principal) {

		if (requestEntity.getKeyword() != null) {
			return new ResponseEntity<Boolean>(ul.changePassword(requestEntity.getKeyword(), principal.getName()),
					HttpStatus.ACCEPTED);
		}
		return new ResponseEntity<Boolean>(HttpStatus.BAD_REQUEST);
	}

}

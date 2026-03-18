package com.ogi.axis.users.repository;

import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.ogi.axis.users.entity.UserLogin;
import com.ogi.axis.users.entity.UserProfile;

@Repository
public interface UserLoginRepository extends JpaRepository<UserLogin, Long> {

	Optional<UserLogin> findByUsername(String username);

	Optional<UserLogin> findByUsernameAndUserStatus(String username, Boolean status);



}

package com.ogi.axis.users.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.axis.users.entity.GroupEntity;
import com.ogi.axis.users.entity.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

	Optional<UserProfile> findByUsernameAndActive(String username,boolean active);

	List<UserProfile> findGroupsById(UUID profileId);

}

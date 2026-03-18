package com.ogi.axis.users.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.axis.users.entity.secondary.LookupEntity;

@Repository
public interface LookupCategoryEntityRepo  extends JpaRepository<LookupEntity, Long>{
	
	List<LookupEntity> findByCategoryOrderByCorderAsc(String category);

}



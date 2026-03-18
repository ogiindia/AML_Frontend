package com.ogi.main.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.main.entity.ReportSchedule;

@Repository
public interface ReportScheduleRepo extends JpaRepository<ReportSchedule, UUID> {

}

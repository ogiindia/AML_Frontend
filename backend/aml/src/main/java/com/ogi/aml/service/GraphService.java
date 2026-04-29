package com.ogi.aml.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ogi.aml.entity.TransactionEntity;

@Service
public class GraphService {

	private Logger LOGGER = LoggerFactory.getLogger(GraphService.class);

	public Map<String, Object> computeNetwork(List<TransactionEntity> transactions) {

		LOGGER.info("computeNetwork started | totalTransactions={}", transactions != null ? transactions.size() : 0);

		Map<String, Integer> transactionCount = new HashMap<>();
		List<Map<String, String>> edges = new ArrayList<>();

		int skipped = 0;

		try {

			for (TransactionEntity t : transactions) {

				// 🔹 Null safety check (FIXED)
				if (t.getAccountno() == null || t.getCounterpartyaccountno() == null) {
					skipped++;
					continue;
				}

				String u = String.valueOf(t.getAccountno());
				String v = String.valueOf(t.getCounterpartyaccountno());

				transactionCount.merge(u, 1, Integer::sum);
				transactionCount.merge(v, 1, Integer::sum);

				Map<String, String> edge = new HashMap<>();
				edge.put("source", u);
				edge.put("target", v);

				edges.add(edge);
			}

			LOGGER.info("Graph build completed | edges={} skippedRecords={}", edges.size(), skipped);

			// 🔹 Top accounts (>60)
			Set<String> topAccounts = transactionCount.entrySet().stream().filter(e -> e.getValue() > 60)
					.map(Map.Entry::getKey).collect(Collectors.toSet());

			LOGGER.info("Top accounts computed | count={}", topAccounts.size());

			Map<String, Object> result = new HashMap<>();
			result.put("transactionCount", transactionCount);
			result.put("edges", edges);
			result.put("topAccounts", topAccounts);

			LOGGER.info("computeNetwork completed successfully");

			return result;

		} catch (Exception e) {

			LOGGER.error("Error in computeNetwork", e);
			throw e;
		}
	}
}

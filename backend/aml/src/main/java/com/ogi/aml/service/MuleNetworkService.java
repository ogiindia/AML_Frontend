package com.ogi.aml.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Queue;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.entity.TransactionEntity;
import com.ogi.aml.repo.TransactionImplRepo;

import smile.clustering.KMeans;
import smile.feature.transform.Standardizer;

@Service
public class MuleNetworkService {

	private Logger LOGGER = LoggerFactory.getLogger(MuleNetworkService.class);

	@Autowired
	private GraphService graphService;

	@Autowired
	TransactionImplRepo transactionimplrepo;

	public Map<String, Object> getNetwork() {

		LOGGER.info("getNetwork started");

		try {
			// 🔹 Step 1: Fetch transactions
			List<TransactionEntity> txs = transactionimplrepo.getTransactionDetailsImplRepo("", "", "", "");

			LOGGER.info("Transactions fetched | count={}", txs != null ? txs.size() : 0);

			// 🔹 Step 2: Compute graph
			Map<String, Object> graph = graphService.computeNetwork(txs);

			LOGGER.debug("Graph computed successfully");

			Map<String, Integer> counts = (Map<String, Integer>) graph.getOrDefault("transactionCount",
					new HashMap<>());

			List<Map<String, String>> edges = (List<Map<String, String>>) graph.getOrDefault("edges",
					new ArrayList<>());

			Set<String> topAccounts = (Set<String>) graph.getOrDefault("topAccounts", new HashSet<>());

			LOGGER.info("Graph stats | nodes={} edges={} topAccounts={}", counts.size(), edges.size(),
					topAccounts.size());

			// 🔹 Step 3: Classify edges
			List<Map<String, Object>> classifiedEdges = edges.stream().map(e -> {
				Map<String, Object> map = new HashMap<>();
				map.put("source", e.get("source"));
				map.put("target", e.get("target"));
				map.put("type", classifyEdge(e.get("source"), e.get("target"), topAccounts));
				return map;
			}).collect(Collectors.toList());

			LOGGER.debug("Edge classification completed | classifiedEdges={}", classifiedEdges.size());

			// 🔹 Step 4: Build node_info
			Map<String, Map<String, Object>> nodeInfo = new HashMap<>();

			for (String node : counts.keySet()) {

				int connections = (int) classifiedEdges.stream()
						.filter(e -> node.equals(e.get("source")) || node.equals(e.get("target"))).count();

				Map<String, Object> info = new HashMap<>();
				info.put("transaction_count", counts.get(node));
				info.put("is_top", topAccounts.contains(node));
				info.put("connections", connections);

				nodeInfo.put(node, info);
			}

			LOGGER.info("Node info built | totalNodes={}", nodeInfo.size());

			// 🔹 Step 5: Final response
			Map<String, Object> result = new HashMap<>();
			result.put("nodes", new ArrayList<>(counts.keySet()));
			result.put("edges", classifiedEdges);
			result.put("node_info", nodeInfo);

			LOGGER.info("getNetwork completed successfully");

			return result;

		} catch (Exception e) {

			LOGGER.error("Error in getNetwork", e);
			throw e;
		}
	}

	String classifyEdge(String u, String v, Set<String> topAccounts) {

		// 🔹 Null safety check
		if (u == null || v == null) {
			LOGGER.warn("Null edge encountered | u={} v={}", u, v);
			return "indirect";
		}

		String type;

		if (topAccounts.contains(u) && topAccounts.contains(v)) {
			type = "high-volume";
		} else if (topAccounts.contains(u)) {
			type = "outgoing";
		} else if (topAccounts.contains(v)) {
			type = "incoming";
		} else {
			type = "indirect";
		}

		// 🔹 Debug log (only enabled when DEBUG level is ON)
		if (LOGGER.isDebugEnabled()) {
			LOGGER.debug("Edge classified | source={} target={} type={}", u, v, type);
		}

		return type;
	}

	public Map<String, Object> getNetworkTable(int page, int size) {

		LOGGER.info("getNetworkTable started | page={} size={}", page, size);

		try {
			// 🔹 Step 1: Get graph
			Map<String, Object> graph = getNetwork();

			List<String> nodes = (List<String>) graph.getOrDefault("nodes", new ArrayList<>());
			List<Map<String, Object>> edges = (List<Map<String, Object>>) graph.getOrDefault("edges",
					new ArrayList<>());

			Map<String, Map<String, Object>> nodeInfo = (Map<String, Map<String, Object>>) graph
					.getOrDefault("node_info", new HashMap<>());

			LOGGER.info("Graph loaded | totalNodes={} totalEdges={}", nodes.size(), edges.size());

			// 🔹 Step 2: Sort nodes
			List<String> sorted = new ArrayList<>(nodes);
			Collections.sort(sorted);

			int total = sorted.size();

			// 🔹 Step 3: Pagination
			int start = Math.max(0, (page - 1) * size);
			int end = Math.min(start + size, total);

			LOGGER.debug("Pagination computed | start={} end={} total={}", start, end, total);

			if (start >= total) {
				LOGGER.warn("Pagination out of range | page={} size={} total={}", page, size, total);

				Map<String, Object> empty = new HashMap<>();
				empty.put("data", Map.of("nodes", Collections.emptyList(), "edges", Collections.emptyList(),
						"node_info", Collections.emptyMap()));
				empty.put("total", total);
				empty.put("page", page);
				empty.put("page_size", size);

				return empty;
			}

			List<String> paged = sorted.subList(start, end);

			// 🔹 Step 4: Filter edges
			List<Map<String, Object>> pageEdges = edges.stream()
					.filter(e -> paged.contains(e.get("source")) || paged.contains(e.get("target"))).toList();

			LOGGER.info("Filtered results | returnedNodes={} returnedEdges={}", paged.size(), pageEdges.size());

			if (LOGGER.isDebugEnabled()) {
				LOGGER.debug("Sample nodes: {}", paged.stream().limit(5).toList());
			}

			// 🔹 Step 5: Build response
			Map<String, Object> result = new HashMap<>();
			result.put("data", Map.of("nodes", paged, "edges", pageEdges, "node_info", nodeInfo));
			result.put("total", total);
			result.put("page", page);
			result.put("page_size", size);

			LOGGER.info("getNetworkTable completed successfully");

			return result;

		} catch (Exception e) {

			LOGGER.error("Error in getNetworkTable | page={} size={}", page, size, e);
			throw e;
		}
	}

	public Map<String, Object> getFilteredGraph(String nodeId) {

		LOGGER.info("getFilteredGraph started | nodeId={}", nodeId);

		try {
			Map<String, Object> graph = getNetwork();

			List<Map<String, Object>> edges = (List<Map<String, Object>>) graph.getOrDefault("edges",
					new ArrayList<>());

			Map<String, Map<String, Object>> nodeInfo = (Map<String, Map<String, Object>>) graph
					.getOrDefault("node_info", new HashMap<>());

			LOGGER.info("Graph loaded | edges={} nodes={}", edges.size(), nodeInfo.size());

			Set<String> connected = new HashSet<>();
			Queue<String> queue = new LinkedList<>();

			// 🔹 Step 1: BFS / Full selection
			if ("all".equalsIgnoreCase(nodeId)) {

				connected.addAll(nodeInfo.keySet());

				LOGGER.info("All nodes selected | total={}", connected.size());

			} else {

				if (!nodeInfo.containsKey(nodeId)) {
					LOGGER.warn("Node not found | nodeId={}", nodeId);

					return Map.of("nodes", Collections.emptySet(), "edges", Collections.emptyList(), "node_info",
							Collections.emptyMap());
				}

				queue.add(nodeId);
				connected.add(nodeId);

				while (!queue.isEmpty()) {

					String current = queue.poll();

					for (Map<String, Object> e : edges) {

						String u = (String) e.get("source");
						String v = (String) e.get("target");

						if (u.equals(current) && connected.add(v))
							queue.add(v);
						if (v.equals(current) && connected.add(u))
							queue.add(u);
					}
				}

				LOGGER.info("BFS completed | connectedNodes={}", connected.size());
			}

			// 🔹 Step 2: Filter edges
			List<Map<String, Object>> filteredEdges = edges.stream()
					.filter(e -> connected.contains(e.get("source")) && connected.contains(e.get("target"))).toList();

			LOGGER.info("Filtered edges | count={}", filteredEdges.size());

			if (LOGGER.isDebugEnabled()) {
				LOGGER.debug("Sample nodes: {}", connected.stream().limit(5).toList());
			}

			// 🔹 Step 3: Response
			Map<String, Object> result = new HashMap<>();
			result.put("nodes", connected);
			result.put("edges", filteredEdges);
			result.put("node_info", nodeInfo);

			LOGGER.info("getFilteredGraph completed successfully");

			return result;

		} catch (Exception e) {

			LOGGER.error("Error in getFilteredGraph | nodeId={}", nodeId, e);
			throw e;
		}
	}

	public Map<String, Object> cluster() {

	    LOGGER.info("cluster started");

	    try {
	        List<TransactionEntity> txs =
	                transactionimplrepo.getTransactionDetailsImplRepo("", "", "", "");

	        LOGGER.info("Transactions fetched | count={}", txs != null ? txs.size() : 0);

	        if (txs == null || txs.size() < 2) {
	            return Map.of("error", "Not enough data");
	        }

	        // 🔹 Sort safely
	        txs.sort(Comparator
	                .comparing((TransactionEntity t) -> String.valueOf(t.getAccountno()),
	                        Comparator.nullsLast(String::compareTo))
	        );

	        Map<String, LocalDateTime> lastTime = new HashMap<>();
	        Map<String, Set<String>> counterparties = new HashMap<>();
	        Map<String, Set<String>> locations = new HashMap<>();

	        List<Map<String, Object>> featureRows = new ArrayList<>();
	        List<double[]> featureMatrix = new ArrayList<>();

	        int skipped = 0;
	        int invalidDateCount = 0;

	        // 🔹 LOOP
	        for (TransactionEntity tx : txs) {

	            if (tx.getAmount() == null || tx.getAccountno() == null) {
	                skipped++;
	                continue;
	            }

	            String cust = String.valueOf(tx.getAccountno());

	            // 🔹 SAFE DATE PARSING
	            LocalDateTime ts = null;

	            try {
	                ts = parseDate(tx.getTransactiondate());
	            } catch (Exception e) {
	                invalidDateCount++;
	                LOGGER.warn("Date parsing failed | value={}", tx.getTransactiondate());
	            }

	            // fallback instead of skip (IMPORTANT)
	            if (ts == null) {
	                ts = LocalDateTime.now();
	            }

	            double timeOfDay = ts.getHour() + ts.getMinute() / 60.0;

	            double timeGap = 0.0;
	            if (lastTime.containsKey(cust)) {
	                timeGap = Math.max(0,
	                        Duration.between(lastTime.get(cust), ts).toMinutes());
	            }

	            lastTime.put(cust, ts);

	            counterparties.computeIfAbsent(cust, k -> new HashSet<>());
	            locations.computeIfAbsent(cust, k -> new HashSet<>());

	            if (tx.getCounterpartyaccountno() != null)
	                counterparties.get(cust).add(String.valueOf(tx.getCounterpartyaccountno()));

	            if (tx.getCountercountrycode() != null)
	                locations.get(cust).add(tx.getCountercountrycode());

	            Map<String, Object> row = new HashMap<>();
	            row.put("amount", tx.getAmount());
	            row.put("time_of_day", timeOfDay);
	            row.put("time_since_last_tx", timeGap);
	            row.put("unique_counterparty_count", counterparties.get(cust).size());
	            row.put("location_switch_count", locations.get(cust).size());
	            row.put("accountId1", cust);
	            row.put("accountId2", tx.getCounterpartyaccountno());
	            row.put("timestamp", ts.toString());
	            row.put("terminalId", tx.getCountercountrycode());
	            row.put("merchantName", tx.getCountercountrycode());

	            featureRows.add(row);

	            featureMatrix.add(new double[]{
	                    tx.getAmount(),
	                    timeOfDay,
	                    timeGap,
	                    counterparties.get(cust).size(),
	                    locations.get(cust).size()
	            });
	        }

	        LOGGER.info("Processing summary | total={} valid={} skipped={} invalidDates={}",
	                txs.size(), featureMatrix.size(), skipped, invalidDateCount);

	        // 🔴 SAFETY: avoid crash
	        if (featureMatrix.size() < 2) {

	            LOGGER.warn("Not enough valid rows for clustering");

	            Map<String, Object> fallback = new HashMap<>();
	            fallback.put("clusterGroups", Collections.emptyMap());
	            fallback.put("centers", Collections.emptyList());
	            fallback.put("summary", Collections.emptyList());
	            fallback.put("error", "Insufficient data after filtering");

	            return fallback;
	        }

	        double[][] X = featureMatrix.toArray(new double[0][]);

	        int n = X.length;
	        int m = X[0].length;

	        // 🔹 Manual StandardScaler
	        double[] mean = new double[m];
	        double[] std = new double[m];

	        for (double[] row : X)
	            for (int j = 0; j < m; j++)
	                mean[j] += row[j];

	        for (int j = 0; j < m; j++)
	            mean[j] /= n;

	        for (double[] row : X)
	            for (int j = 0; j < m; j++)
	                std[j] += Math.pow(row[j] - mean[j], 2);

	        for (int j = 0; j < m; j++)
	            std[j] = Math.sqrt(std[j] / n);

	        double[][] scaled = new double[n][m];

	        for (int i = 0; i < n; i++)
	            for (int j = 0; j < m; j++)
	                scaled[i][j] = (X[i][j] - mean[j]) / (std[j] == 0 ? 1 : std[j]);

	        int k = Math.min(5, n);

	        LOGGER.info("Running KMeans | k={}", k);

	        KMeans kmeans = KMeans.fit(scaled, k);
	        int[] labels = kmeans.y;

	        // 🔹 Cluster groups
	        Map<Integer, List<Map<String, Object>>> clusterGroups = new HashMap<>();

	        for (int i = 0; i < labels.length; i++) {
	            Map<String, Object> row = new HashMap<>(featureRows.get(i));
	            row.put("cluster", labels[i]);

	            clusterGroups.computeIfAbsent(labels[i], x -> new ArrayList<>()).add(row);
	        }

	        // 🔹 Centers (inverse)
	        double[][] centers = new double[kmeans.centroids.length][m];

	        for (int i = 0; i < kmeans.centroids.length; i++)
	            for (int j = 0; j < m; j++)
	                centers[i][j] = kmeans.centroids[i][j] * std[j] + mean[j];

	        List<Map<String, Object>> clusterCenters = new ArrayList<>();

	        for (int i = 0; i < centers.length; i++) {

	            Map<String, Object> c = new HashMap<>();

	            c.put("cluster", i);
	            c.put("amount", centers[i][0]);
	            c.put("timeOfDay", centers[i][1]);
	            c.put("avgTimeGap", centers[i][2]);
	            c.put("avgCounterparties", centers[i][3]);
	            c.put("avgLocationSwitch", centers[i][4]);
	            c.put("count", clusterGroups.getOrDefault(i, List.of()).size());

	            clusterCenters.add(c);
	        }

	        // 🔹 Summary
	        List<Map<String, Object>> summary = new ArrayList<>();

	        for (Map.Entry<Integer, List<Map<String, Object>>> entry : clusterGroups.entrySet()) {

	            int cid = entry.getKey();
	            List<Map<String, Object>> rows = entry.getValue();

	            double avgAmount = rows.stream()
	                    .mapToDouble(r -> (double) r.get("amount")).average().orElse(0);

	            double avgGap = rows.stream()
	                    .mapToDouble(r -> (double) r.get("time_since_last_tx")).average().orElse(0);

	            long uniqueCustomers = rows.stream()
	                    .map(r -> r.get("accountId1"))
	                    .distinct()
	                    .count();

	            Map<String, Object> s = new HashMap<>();
	            s.put("cluster", cid);
	            s.put("count", rows.size());
	            s.put("avgAmount", avgAmount);
	            s.put("avgTimeGap", avgGap);
	            s.put("uniqueCustomers", uniqueCustomers);

	            summary.add(s);
	        }

	        Map<String, Object> result = new HashMap<>();
	        result.put("clusterGroups", clusterGroups);
	        result.put("centers", clusterCenters);
	        result.put("summary", summary);
	        result.put("error", null);

	        LOGGER.info("cluster completed successfully");

	        return result;

	    } catch (Exception e) {

	        LOGGER.error("Error in cluster", e);

	        return Map.of("error", "Clustering failed: " + e.getMessage());
	    }
	}

	private LocalDateTime parseDate(Object value) {

	    if (value == null) return null;

	    if (value instanceof LocalDateTime) {
	        return (LocalDateTime) value;
	    }

	    String str = value.toString().trim();

	    // normalize month (important)
	    str = str.toUpperCase();

	    // ✅ 1. ISO format
	    try {
	        return LocalDateTime.parse(str);
	    } catch (Exception ignored) {}

	    // ✅ 2. dd-MMM-yyyy (19-APR-2026)
	    try {
	        DateTimeFormatter formatter =
	                new DateTimeFormatterBuilder()
	                        .parseCaseInsensitive()
	                        .appendPattern("dd-MMM-yyyy")
	                        .toFormatter(Locale.ENGLISH);

	        return LocalDate.parse(str, formatter).atStartOfDay();
	    } catch (Exception ignored) {}

	    // ✅ 3. dd-MMM-yyyy HH:mm:ss
	    try {
	        DateTimeFormatter formatter =
	                new DateTimeFormatterBuilder()
	                        .parseCaseInsensitive()
	                        .appendPattern("dd-MMM-yyyy HH:mm:ss")
	                        .toFormatter(Locale.ENGLISH);

	        return LocalDateTime.parse(str, formatter);
	    } catch (Exception ignored) {}

	    // 🔴 LOG EXACT VALUE
	    LOGGER.error("Unsupported date format: [{}]", str);

	    return null; // ❗ DO NOT throw exception
	}
}

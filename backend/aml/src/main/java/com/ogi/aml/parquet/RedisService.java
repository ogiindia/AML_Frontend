package com.ogi.aml.parquet;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisService {

	@Autowired
	private LettuceConnectionFactory connectionFactory;

	private static final Logger Logger = LoggerFactory.getLogger(RedisService.class);
	private final ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

	@Value("${spring.data.redis.host:Test}")
	public String redisIP;

	@Value("${spring.data.redis.port:6379}")
	public String redisPort;

	@PostConstruct
	public void startJob() {

		executor.scheduleAtFixedRate(() -> {
			try {
				// Example: read/write to Redis
				setValue("heartbeat", System.currentTimeMillis());
				var cfg = connectionFactory.getStandaloneConfiguration();
				

				Logger.info("Redis IP : " + redisIP + " - Redis Port : " + redisPort);

				if (cfg != null) {
					Logger.info("Redis host = " + cfg.getHostName() + ", port = " + cfg.getPort());
				}
				Logger.info("Redis heartbeat updated");
			} catch (Exception e) {
				// Handle gracefully if Redis is unavailable
				Logger.error("Redis job failed: " + e.getMessage());
			}
		}, 0, 60, TimeUnit.SECONDS);
	}

	private RedisTemplate<String, Object> redisTemplate;

	public RedisService(RedisTemplate<String, Object> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

	public Object toPullObjectFrmRedis(String keyName) {
		try {
			return (Object) redisTemplate.opsForValue().get(keyName);
		} catch (Exception e) {
			Logger.error("Exception found in RedisService@toPullObjectFrmRedis : {}", e);
			return null;
		} finally {

		}
	}

	public Object getValue(String key) {
		return redisTemplate.opsForValue().get(key);
	}

	public void setValue(String key, Object value) {
		redisTemplate.opsForValue().set(key, value);
	}

	public String toPushListIntoRedis(String keyName, Object objParam) {
		try {

			redisTemplate.opsForValue().set(keyName, objParam);

		} catch (Exception e) {
			Logger.error("Exception found in RedisService@toPushListIntoRedis : {}", e);
		} finally {

		}
		return "SUCCESS";
	}
}

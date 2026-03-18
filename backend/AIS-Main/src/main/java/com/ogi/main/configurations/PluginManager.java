package com.ogi.main.configurations;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.ogi.factory.enums.ReportType;
import com.ogi.factory.interfaces.ReportLifecycleListener;
import com.ogi.factory.interfaces.ReportPlugin;
import com.ogi.factory.pojo.ReportField;

@Component
public class PluginManager {

	@Value("${plugins.directory:plugins}")
	private String pluginDirectory;

	@Value("${reports.directory:reports}")
	private String reportDirectory;

	@Autowired
	private ReportLifecycleListener reportLifeCycleListener;

	private final Map<String, ReportPlugin> plugins = new HashMap<>();
	private final Map<String, ClassLoader> classLoaders = new HashMap<>();

	@EventListener(ContextRefreshedEvent.class)
	public void loadPlugins() {

		File pluginsDir = new File(pluginDirectory);

		if (!pluginsDir.exists() || !pluginsDir.isDirectory()) {

			System.out.println("plugin directory not found or not a directory :" + pluginDirectory);

			return;
		}

		File[] jarFiles = pluginsDir.listFiles((dir, name) -> name.toLowerCase().endsWith(".jar"));

		if (jarFiles == null || jarFiles.length == 0) {

			System.out.println("No plugins found in plugins directory " + pluginDirectory);

			return;
		}

		Arrays.stream(jarFiles).forEach(jarFile -> {
			try {
				loadPlugin(jarFile);
			} catch (Exception e) {
				System.out.println("Error loading plugin : " + jarFile.getName() + e);
			}
		});

		System.out.println("loaded all plugins");
	}

	private void loadPlugin(File jarFile) throws Exception {
		JarFile jar = new JarFile(jarFile);
		Enumeration<JarEntry> entires = jar.entries();

		URL[] urls = { new URL("jar:file:" + jarFile.getAbsolutePath() + "!/") };
//		URLClassLoader classLoader = URLClassLoader.newInstance(urls, null);

		URLClassLoader classLoader = URLClassLoader.newInstance(urls, getClass().getClassLoader());

		String pluginClassName = null;

		while (entires.hasMoreElements()) {

			JarEntry entry = entires.nextElement();

			if (entry.isDirectory() || !entry.getName().endsWith(".class")) {
				continue;
			}

			System.out.println("jar entry name : " + entry.getName());

			// convert class to package
			String className = (entry.getName().substring(0, entry.getName().length() - 6)).replaceAll("/", ".");
			System.out.println("ClassName : " + className);
			try {
				Class<?> clazz = classLoader.loadClass(className);

				if (ReportPlugin.class.isAssignableFrom(clazz) && !clazz.isInterface()) {
					pluginClassName = className;
					System.out.println("Found report plugin class : " + className);
					break;
				}

			} catch (Exception e) {
				System.out.println("Error loading class : " + className + e);
			}

		}

		if (pluginClassName != null) {
			Object pluginObject = classLoader.loadClass(pluginClassName).getDeclaredConstructor().newInstance();

			ReportPlugin reportPlugin = (ReportPlugin) pluginObject;

			String pluginId = reportPlugin.getPluginId();

			plugins.put(pluginId, reportPlugin);
			classLoaders.put(pluginId, classLoader);
			System.out.println("plugin loaded : " + jarFile.getName() + pluginId);

		}

		jar.close();

	}

	public List<String> getAllPluginIds() {
		return plugins.values().stream().map(ReportPlugin::getPluginId).collect(Collectors.toList());
	}

	public List<String> getAllPluginNames() {
		return plugins.values().stream().map(ReportPlugin::getPluginName).collect(Collectors.toList());
	}

	public List<ReportType> getAllPluginTypes() {
		return plugins.values().stream().map(ReportPlugin::getReportType).collect(Collectors.toList());
	}

	public List<ReportField> getReportFields(String pluginId) {
		ReportPlugin plugin = plugins.get(pluginId);
		if (plugin != null) {
			return plugin.getReportFields();
		}
		return null;
	}

	public ReportType getReportType(String pluginId) {
		ReportPlugin plugin = plugins.get(pluginId);
		if (plugin == null) {
			return null;
		}

		return plugin.getReportType();
	}

	public String getReportName(String pluginId) {
		ReportPlugin plugin = plugins.get(pluginId);
		if (plugin == null) {
			return null;
		}

		return plugin.getPluginName();
	}

	public byte[] generateReport(UUID reportId, String pluginId, Map<String, Object> fieldValues) {

		ReportPlugin plugin = plugins.get(pluginId);

		if (plugin == null) {
			reportLifeCycleListener.onReportFailed(reportId, pluginId,
					new IllegalArgumentException("Plugin not found"));
			return null;
		}

		try {
			reportLifeCycleListener.onReportInitiated(reportId, pluginId, fieldValues);
			byte[] reportData = plugin.generateReport(fieldValues);
			reportLifeCycleListener.onReportGenerated(reportId, pluginId, reportData);
			return reportData;
		} catch (Exception e) {

			reportLifeCycleListener.onReportFailed(reportId, pluginId, e);
			return null;
		}

	}

	public String saveReport(UUID reportId, String pluginId, byte[] reportData) {

		if (reportData != null) {
			try {
				Path reportPath = Paths.get(reportDirectory + File.separator + pluginId,
						reportId + "." + getReportType(pluginId));
				Files.createDirectories(reportPath.getParent());
				Files.write(reportPath, reportData);

				reportLifeCycleListener.onReportFinished(reportId, pluginId, reportPath.toAbsolutePath().toString());

				return reportPath.toAbsolutePath().toString();

			} catch (IOException e) {
				reportLifeCycleListener.onReportFailed(reportId, pluginId, e);
			}
		}

		return null;

	}

	public void shutdown() {
		for (ClassLoader classLoader : classLoaders.values()) {
			try {
				if (classLoader instanceof URLClassLoader) {
					((URLClassLoader) classLoader).close();
				}
			} catch (Exception e) {
				System.out.println("Error closing classLoader : " + e);
			}
		}
	}

}

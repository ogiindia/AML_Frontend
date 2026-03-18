package com.ogi.main.configurations.schemaConfigurations;

import java.util.Collection;

import org.hibernate.boot.Metadata;
import org.hibernate.mapping.PersistentClass;

public class MetadataHolder {

	private static Metadata metadata;

	private static Collection<PersistentClass> entityBindings;

	public static void setMetadata(Metadata m) {
		metadata = m;
	}

	public static Metadata getMetadata() {
		return metadata;
	}

	public static void setEntityBindings(Collection<PersistentClass> e) {
		entityBindings = e;
	}

	public static Collection<PersistentClass> getEntityBindings() {
		return entityBindings;
	}

}

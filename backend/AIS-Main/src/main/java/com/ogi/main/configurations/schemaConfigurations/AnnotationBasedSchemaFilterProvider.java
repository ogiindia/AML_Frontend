package com.ogi.main.configurations.schemaConfigurations;

import java.util.Collection;

import javax.persistence.Table;

import org.hibernate.boot.Metadata;
import org.hibernate.boot.model.relational.Namespace;
import org.hibernate.boot.model.relational.Sequence;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.tool.schema.spi.SchemaFilter;
import org.hibernate.tool.schema.spi.SchemaFilterProvider;

import com.ogi.factory.annotations.SharedTable;

public class AnnotationBasedSchemaFilterProvider implements SchemaFilterProvider {

	private final SchemaFilter filter = new SchemaFilter() {

		@Override
		public boolean includeNamespace(Namespace namespace) {
			return true; // namespaces unaffected
		}

		@Override
		public boolean includeSequence(Sequence sequence) {
			return true;
		}

		@SuppressWarnings("unchecked")
		@Override
		public boolean includeTable(org.hibernate.mapping.Table table) {

//			Metadata metadata = MetadataHolder.getMetadata();
//			System.out.println("metadata : " + table.getName());
//			System.out.println(metadata);
//
//			Collection<PersistentClass> pk = MetadataHolder.getEntityBindings();
//
//			System.out.println("received bindings : " + pk.size());
//
//			for (PersistentClass pc : metadata == null ? MetadataHolder.getEntityBindings()
//					: metadata.getEntityBindings()) {
//				if (pc.getTable().equals(table)) {
//					// If entity has @IgnoreDdl → skip table creation
//					System.out.println("into include table :" + table);
//					if (pc.getMappedClass().isAnnotationPresent(SharedTable.class)) {
//						return false;
//					}
//				}
//			}

			//not working yet to work on this to skip the table creation for shared tables...
			return true;
		}
	};

	@Override
	public SchemaFilter getCreateFilter() {
		// TODO Auto-generated method stub
		return filter;
	}

	@Override
	public SchemaFilter getDropFilter() {
		// TODO Auto-generated method stub
		return filter;
	}

	@Override
	public SchemaFilter getMigrateFilter() {
		// TODO Auto-generated method stub
		return filter;
	}

	@Override
	public SchemaFilter getValidateFilter() {
		// TODO Auto-generated method stub
		return filter;
	}

}

package com.ogi.factory.template;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityNotFoundException;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.Metamodel;
import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.factory.annotations.Required;
import com.ogi.factory.interfaces.BaseEntityManagerInterface;
import com.ogi.factory.pojo.FilterCriteria;
import com.ogi.factory.pojo.PagedResult;
import com.ogi.factory.pojo.SortCriteria;

//should maintain unique name across the entire project otherwise it will throw error 
public abstract class BaseResolver<T, ID> implements BaseEntityManagerInterface {

	@PersistenceContext
	protected EntityManager entityManager;

	@SuppressWarnings("unchecked")
	public BaseResolver() {
		this.entityType = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass())
				.getActualTypeArguments()[0];
	}

	private final Class<T> entityType;

	public BaseResolver(Class<T> entityType) {
		this.entityType = entityType;
	}

	public Class<T> getEntityType() {
		return entityType;
	}

	public EntityType<T> getEntityTypeMetaData() {
		EntityManagerFactory entityManagerFactory = entityManager.getEntityManagerFactory();
		Metamodel metaModal = entityManagerFactory.getMetamodel();
		return metaModal.entity(entityType);
	}

	public T findById(@Required ID id) {
		System.out.println(id + "..." + id.getClass().getTypeName());
		System.out.println(id);
		try {
			return entityManager.find(entityType, id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public String baseDemo(String name) {
		System.out.println("demo : " + name);
		return name;
	}

	@Transactional
	public List<T> saveAll(List<T> entities) {
		if (entities == null) {
			throw new IllegalArgumentException("The given Iterable of entities not be null!");
		}

		List<T> resultList = new ArrayList<>();

		for (T entity : entities) {
			resultList.add(this.save(entity));
		}

		return resultList;
	}

	public List<T> findAll() {
		String query = "SELECT e FROM " + entityType.getSimpleName() + " e";
		return entityManager.createQuery(query, entityType).getResultList();
	}

	@Transactional
	public T save(T entity) {

		try {

			reattachReferences(entity);
			Object id = getEntityId(entity);
			System.out.println("id : " + id);
			if (id == null) {
				System.out.println("into create");
				entityManager.persist(entity);
			} else {
				// update
				System.out.println("into update");
				entityManager.merge(entity);
			}
			return entity;

		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;

	}

	@SuppressWarnings({ "unchecked", "hiding" })
	public <T> PagedResult<T> listByPaging(@Required Integer pageNo, @Required Integer pageSize, SortCriteria sort,
			List<FilterCriteria> filter) {

		StringBuilder baseQuery = new StringBuilder("FROM " + entityType.getSimpleName() + " e" + " WhERE 1=1");

		StringBuilder groupByQuery = new StringBuilder();

		StringBuilder sortByQuery = new StringBuilder();
//		
//		StringBuilder queryString = new StringBuilder(
//				"SELECT e FROM " + entityType.getSimpleName() + " e" + " WhERE 1=1");

		Map<String, Object> params = new HashMap<String, Object>();

		// filter implementation for paging..

		// System.out.println(filter.size());

//		StringBuilder groupByQuery = new StringBuilder(" GROUP BY");
		if (filter.size() > 0) {

			for (FilterCriteria filterCriteria : filter) {
//				System.out.println(filterCriteria.getValue());
				if (filterCriteria.getValue() == null)
					continue;

				String field = filterCriteria.getField();

				Object value = filterCriteria.getValue();

				String paramName = field.replace(".", "_");

				if (value instanceof String) {
					baseQuery.append(" AND LOWER(").append("e.").append(field).append(") LIKE :").append(paramName);
					params.put(paramName, "%" + ((String) value).toLowerCase() + "%");
//					groupByQuery.append(" ").append(paramName).append(",");
				} else if (value instanceof Number) {
					baseQuery.append(" AND ").append("e.").append(field).append(" = :").append(paramName);
					params.put(paramName, (Number) value);
//					groupByQuery.append(" ").append(paramName).append(",");
				} else if (value instanceof List<?> && !((List<?>) value).isEmpty()) {
					handleListFilter(baseQuery, params, "e", field, paramName, (List<?>) value);
//					groupByQuery.append(" ").append(paramName).append(",");
				} else {
					baseQuery.append(" AND ").append("e.").append(field).append(" = :").append(paramName);
					params.put(paramName, value);
//					groupByQuery.append(" ").append(paramName).append(",");
				}
			}

//			if (groupByQuery.length() > 0) {
//				groupByQuery.deleteCharAt(groupByQuery.length() - 1);
//			}

		} else {
		}

		groupByQuery.append(" GROUP BY e");

		// sorting implementations for paging..
		if (sort != null && sort.getField() != null) {
			sortByQuery.append(" ORDER BY e.").append(sort.getField()).append(" ").append(sort.getDirection());
		}

		TypedQuery<T> query = (TypedQuery<T>) entityManager
				.createQuery("SELECT e " + baseQuery.toString() + groupByQuery + sortByQuery, entityType);

		String countQueryString = "";

		// normal case (old behavior stays same!)
		countQueryString = "SELECT COUNT(e) " + baseQuery.toString();

		TypedQuery<Number> typedCount = entityManager.createQuery(countQueryString, Number.class);

		params.forEach((k, v) -> {
			query.setParameter(k, v);
			typedCount.setParameter(k, v);
		});

		query.setFirstResult((pageNo - 1) * pageSize);
		query.setMaxResults(pageSize);

		List<T> items = query.getResultList();
		System.out.println(items.size());
		Long totalElements = (long) 0;
		if (items.size() > 0) {
			totalElements = (Long) typedCount.getSingleResult();
		}

		System.out.println(totalElements);

		int totalPages = (int) Math.ceil(totalElements / pageSize) + (totalElements % pageSize == 0 ? 0 : 1);
		boolean isFirstPage = pageNo == 1;
		boolean isLastPage = (pageNo == (totalPages) || totalElements < pageSize);
		return new PagedResult<>(items, totalElements, totalPages, pageNo, isFirstPage, isLastPage);
	}

	public T saveViaMap(Map<String, Object> hs) {

		T entity = null;
		try {
			entity = entityType.getDeclaredConstructor().newInstance();
			BeanUtils.copyProperties(hs, entity);
			entityManager.persist(entity);
			return entity;
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return entity;

	}

	@Transactional
	public T update(@Required ID id, T entity) {

		try {
			reattachReferences(entity);
			Object eid = getEntityId(entity);

			if (id.equals(eid)) {

				// update
				System.out.println("into update");
				entityManager.merge(entity);
				return entity;
			}

		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;

//		return entityManager.merge(entity);
	}

	@Transactional
	public void delete(@Required ID id) {
		T entity = findById(id);
		if (entity != null) {
			entityManager.remove(entity);
			entityManager.flush();
			entityManager.clear();
		}
	}

	public void toggle(@Required ID id, @Required Boolean status) {
		T entity = findById(id);
		if (entity == null) {
			throw new EntityNotFoundException("Entity not found with id : " + id);
		}

		try {
			Field activeField = entity.getClass().getDeclaredField("active");
			activeField.setAccessible(true);
			activeField.set(entity, status);
			entityManager.merge(entity);
		} catch (NoSuchFieldException | IllegalArgumentException | IllegalAccessException e) {
			throw new IllegalStateException("Entity does not have an 'active' field ", e);
		}
	}

	@SuppressWarnings("unchecked")
	private void reattachReferences(T entity) {

		for (Field field : entity.getClass().getDeclaredFields()) {

			try {
				if (field.isAnnotationPresent(ManyToOne.class) || field.isAnnotationPresent(OneToOne.class)
						|| field.isAnnotationPresent(JoinColumn.class)) {
					field.setAccessible(true);
					Object ref = field.get(entity);
					if (ref != null && entityManager.contains(ref) == false) { // it will throw error if it is not an
																				// entity
						Object id = this.getEntityId(ref);
						if (id != null) {
							Object managedRef = entityManager.getReference(ref.getClass(), id);
							field.set(entity, managedRef);
						}
					}
				} else if (field.isAnnotationPresent(ManyToMany.class) || field.isAnnotationPresent(OneToMany.class)) {
					field.setAccessible(true);
					Object value = field.get(entity);

					if (value instanceof Collection<?>) {

						Collection<Object> collection = (Collection<Object>) value;
						Collection<Object> managedCollection = new ArrayList<>();

						for (Object ref : collection) {

							if (ref != null && !entityManager.contains(ref)) {

								Object id = this.getEntityId(ref);
								if (id != null) {
									Object managedRef = entityManager.getReference(ref.getClass(), id);
									managedCollection.add(managedRef);
								}
							} else {
								managedCollection.add(ref);
							}
						}
						collection.clear();
						collection.addAll(managedCollection);

						

						field.set(entity, collection);
					}
				}
			} catch (Exception e) {
				System.out.println(e.getMessage());
//					e.printStackTrace();
//					throw new RuntimeException(e);
			}
		}

	}

	private Object getEntityId(Object ref) {
		if (ref == null)
			return null;

		Class<?> clazz = ref.getClass();

		while (clazz != null) {
			for (Field field : clazz.getDeclaredFields()) {
				if (field.isAnnotationPresent(Id.class)) {
					field.setAccessible(true);
					try {
						return field.get(ref);
					} catch (IllegalAccessException e) {
						e.printStackTrace();
						throw new RuntimeException(e);
					}
				}
			}

			clazz = clazz.getSuperclass();
		}

		return null;
	}

	private void handleListFilter(StringBuilder query, Map<String, Object> params, String alias, String field,
			String paramName, List<?> values) {

		Object first = values.size() > 0 ? values.get(0) : null;
		Object second = values.size() > 1 ? values.get(1) : null;

		boolean isDate = looksLikeDate(first) || looksLikeDate(second);
		boolean bothPresent = first != null && second != null;

		if (isDate) {
			LocalDate from = first != null ? LocalDate.parse(first.toString()) : null;
			LocalDate to = second != null ? LocalDate.parse(second.toString()) : null;

			if (bothPresent) {
				query.append(" AND ").append(alias).append(".").append(field).append(" BETWEEN :").append(paramName)
						.append("_from AND :").append(paramName).append("_to");
				params.put(paramName + "_from", from);
				params.put(paramName + "_to", to);
			} else if (from != null) {
				query.append(" AND ").append(alias).append(".").append(field).append(" >= :").append(paramName)
						.append("_from");
				params.put(paramName + "_from", from);
			} else if (to != null) {
				query.append(" AND ").append(alias).append(".").append(field).append(" <= :").append(paramName)
						.append("_to");
				params.put(paramName + "_to", to);
			}
		} else if (values.size() == 2 && values.get(0) instanceof Number && values.get(1) instanceof Number) {
			query.append(" AND ").append(alias).append(".").append(field).append(" BETWEEN :").append(paramName)
					.append("_min AND :").append(paramName).append("_max");
			params.put(paramName + "_min", values.get(0));
			params.put(paramName + "_max", values.get(1));
		} else if (values.size() == 1) {
// equality
			query.append(" AND ").append(alias).append(".").append(field).append(" = :").append(paramName);
			params.put(paramName, values.get(0));
		}
	}

	private boolean looksLikeDate(Object value) {
		if (value == null)
			return false;
		String s = value.toString();
		return s.matches("\\d{4}-\\d{2}-\\d{2}");
	}

}

package com.ogi.main.configurations.multiDatasource;

import java.io.Serializable;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactoryBean;
import org.springframework.data.repository.core.support.RepositoryFactorySupport;

public class DynamicJpaRepositoryFactoryBean<R extends org.springframework.data.repository.Repository<T, I>, T, I extends Serializable>
		extends JpaRepositoryFactoryBean<R, T, I> implements BeanFactoryAware {

	private BeanFactory beanFactory;

	public DynamicJpaRepositoryFactoryBean(Class<? extends R> repositoryInterface) {
		super(repositoryInterface);
	}

	@Override
	public void setBeanFactory(BeanFactory beanFactory) {
		this.beanFactory = beanFactory;
		super.setBeanFactory(beanFactory);
	}

//	@Override
//	protected org.springframework.data.jpa.repository.support.JpaRepositoryFactory createRepositoryFactory(
//			EntityManagerFactory emf) {
//		// not used; override later; keep default for safety
//		return super.createRepositoryFactory(emf);
//	}
	
	@Override
	    protected RepositoryFactorySupport createRepositoryFactory(EntityManager entityManager) {
		// TODO Auto-generated method stub
		return super.createRepositoryFactory(entityManager);
	    }

	@Override
	public void afterPropertiesSet() {
		// We delay wiring EntityManagerFactory; instead, set a lazy
		// EntityManagerFactory resolver into super
		// JpaRepositoryFactoryBean expects an EntityManager injected via
		// setEntityManager, but we will override that bean
		// creation in registrar to pass a proxy EntityManagerFactory which resolves to
		// the right factory per repository domain class.
		super.afterPropertiesSet();
	}
}

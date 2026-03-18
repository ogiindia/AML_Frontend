package com.ogi.factory.pojo;

import java.util.List;

public class PagedResult<T> {

	private List<T> items;

	private Long totalElements;

	private Integer totalPages;

	private Integer currentPage;

	private Boolean isFirstPage;

	private Boolean isLastPage;

	public PagedResult(List<T> items, Long totalElements, Integer totalPages, Integer currentPages, Boolean isfirstPage,
			Boolean isLastPage) {

		this.items = items;
		this.totalElements = totalElements;
		this.totalPages = totalPages;
		this.currentPage = currentPages;
		this.isFirstPage = isfirstPage;
		this.isLastPage = isLastPage;

	}

	public List<T> getItems() {
		return items;
	}

	public void setItems(List<T> items) {
		this.items = items;
	}

	public Long getTotalElements() {
		return totalElements;
	}

	public void setTotalElements(Long totalElements) {
		this.totalElements = totalElements;
	}

	public Integer getTotalPages() {
		return totalPages;
	}

	public void setTotalPages(Integer totalPages) {
		this.totalPages = totalPages;
	}

	public Integer getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(Integer currentPage) {
		this.currentPage = currentPage;
	}

	public Boolean getIsFirstPage() {
		return isFirstPage;
	}

	public void setIsFirstPage(Boolean isFirstPage) {
		this.isFirstPage = isFirstPage;
	}

	public Boolean getIsLastPage() {
		return isLastPage;
	}

	public void setIsLastPage(Boolean isLastPage) {
		this.isLastPage = isLastPage;
	}

}

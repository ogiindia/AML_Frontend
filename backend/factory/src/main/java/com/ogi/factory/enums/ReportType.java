package com.ogi.factory.enums;

public enum ReportType {

	PDF("pdf"), XLSX("xlsx"), CSV("csv"), TXT("txt");

	private final String fileExtension;

	private ReportType(String fileExtension) {
		// TODO Auto-generated constructor stub

		this.fileExtension = fileExtension;
	}

	public String getFileExtension() {
		return fileExtension;
	}

	public static ReportType fromFileExtension(String fileExtension) {
		for (ReportType type : values()) {
			if (type.fileExtension.equalsIgnoreCase(fileExtension)) {
				return type;
			}
		}

		throw new IllegalArgumentException("Invalid Report Type : " + fileExtension);
	}

}

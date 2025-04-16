package com.e1.nexacro.model;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

import lombok.Data;

	@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
	@Data
	public class testModel {
		private int EMPLOYEE_ID;
		private String FIRST_NAME;
		private String LAST_NAME;
		private String EMAIL;
		private String PHONE;
		private String HIRE_DATE;
		private int MANAGER_ID;
		private String JOB_TITLE;
	}

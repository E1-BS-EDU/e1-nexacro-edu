package com.e1.nexacro.service;

import java.util.List;
import java.util.Map;

import com.e1.nexacro.model.testModel;

public interface testService {
	
	public List<Map<String, Object>> searchList(Map<String, String> ds_cond) throws Exception;
	
}

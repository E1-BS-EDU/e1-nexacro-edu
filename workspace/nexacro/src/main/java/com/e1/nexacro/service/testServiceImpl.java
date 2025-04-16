package com.e1.nexacro.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.e1.nexacro.mapper.testMapper;
import com.e1.nexacro.model.testModel;

@Service
public class testServiceImpl implements testService{
	
	@Autowired
	testMapper testMapper;
	
	@Override
    public List<Map<String, Object>> searchList(Map<String, String> ds_cond) throws Exception {
      return testMapper.searchList(ds_cond);
    }
}

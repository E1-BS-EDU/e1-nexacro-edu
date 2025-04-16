package com.e1.nexacro.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.e1.nexacro.model.testModel;
import com.e1.nexacro.service.testService;
import com.nexacro.uiadapter.spring.core.annotation.ParamDataSet;
import com.nexacro.uiadapter.spring.core.data.NexacroResult;

@Controller
public class HomeController {

	@Autowired
	testService testService;

	@RequestMapping(value = "/searchList.do")
	public NexacroResult searchList(@ParamDataSet(name = "ds_cond") Map<String,String> ds_cond) throws Exception {
		List<Map<String, Object>> searchList = null;
		searchList = testService.searchList(ds_cond);
		
		NexacroResult result = new NexacroResult();
		result.addDataSet("ds_list", searchList);
		return result;
	}
}

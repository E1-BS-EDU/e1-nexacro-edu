package com.e1.nexacro.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.e1.nexacro.model.testModel;

@Mapper
public interface testMapper {
    List<Map<String,Object>> searchList(Map<String, String> ds_cond) throws Exception;

}

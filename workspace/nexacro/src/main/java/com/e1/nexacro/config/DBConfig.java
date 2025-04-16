package com.e1.nexacro.config;

import javax.sql.DataSource; 
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

@Configuration
public class DBConfig {
  @Bean
  public SqlSessionFactory sqlSessionFactory(DataSource datasource) throws Exception{
      SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
      sqlSessionFactory.setDataSource(datasource);

      Resource configLocation = new PathMatchingResourcePatternResolver().getResource("classpath:mybatis-config.xml");
      Resource[] mapperLocations = new PathMatchingResourcePatternResolver().getResources("classpath:mappers/*.xml");

      sqlSessionFactory.setTypeAliasesPackage("com.e1");
      sqlSessionFactory.setConfigLocation(configLocation);
      sqlSessionFactory.setMapperLocations(mapperLocations);

      return sqlSessionFactory.getObject();
  }
  
  @Bean("sqlSession")
  SqlSessionTemplate sqlSession(SqlSessionFactory sqlSessionFactory) throws Exception {
      return new SqlSessionTemplate(sqlSessionFactory);
  }
}
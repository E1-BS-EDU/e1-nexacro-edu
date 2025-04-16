package com.e1.nexacro.config;

import java.util.List;

import org.springframework.boot.autoconfigure.web.servlet.WebMvcRegistrations;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

import com.nexacro.java.xapi.tx.PlatformType;
import com.nexacro.uiadapter.spring.core.context.ApplicationContextProvider;
import com.nexacro.uiadapter.spring.core.resolve.NexacroHandlerMethodReturnValueHandler;
import com.nexacro.uiadapter.spring.core.resolve.NexacroMappingExceptionResolver;
import com.nexacro.uiadapter.spring.core.resolve.NexacroMethodArgumentResolver;
import com.nexacro.uiadapter.spring.core.resolve.NexacroRequestMappingHandlerAdapter;
import com.nexacro.uiadapter.spring.core.view.NexacroFileView;
import com.nexacro.uiadapter.spring.core.view.NexacroView;

import org.springframework.web.method.support.HandlerMethodArgumentResolver;

@Configuration
public class NexacroConfig extends WebAppConfig implements WebMvcRegistrations {
  
  /**
   * Spring의 ApplicationContext를 제공한다.
   * @return
   */
  @Bean
  @Lazy(false)
  public ApplicationContextProvider applicationContextProvider() {
    return new ApplicationContextProvider();
  }
  
  /**
   * 넥사크로플랫폼 RequestMappingHandlerAdapter 구현체 등록
   */
  @Override
  public RequestMappingHandlerAdapter getRequestMappingHandlerAdapter() {
      return new NexacroRequestMappingHandlerAdapter();
  }
    
  /**
   * 넥사크로플랫폼 ArgumentResolver 등록
   */
  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
     
      NexacroMethodArgumentResolver nexacroResolver = new NexacroMethodArgumentResolver();
      resolvers.add(nexacroResolver);
      
      super.addArgumentResolvers(resolvers);
  }

  /**
   * 넥사크로플랫폼 ReturnValueHandler 등록
   */
  @Override
  public void addReturnValueHandlers(List<HandlerMethodReturnValueHandler> handlers) {
        
      NexacroHandlerMethodReturnValueHandler returnValueHandler = new NexacroHandlerMethodReturnValueHandler();
        
      NexacroFileView nexacroFileView = new NexacroFileView();        
      NexacroView     nexacroView     = new NexacroView();
      nexacroView.setDefaultContentType(PlatformType.CONTENT_TYPE_XML);
      nexacroView.setDefaultCharset("UTF-8");
        
      returnValueHandler.setView(nexacroView);
      returnValueHandler.setFileView(nexacroFileView);
        
      handlers.add(returnValueHandler);
        
      super.addReturnValueHandlers(handlers);
  }
    
  /**
   * 넥사크로플랫폼 에러 처리 ExceptionResolver 등록
   */
  @Override
  public void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
        
      NexacroView nexacroView = new NexacroView();
      nexacroView.setDefaultContentType(PlatformType.CONTENT_TYPE_XML);
      nexacroView.setDefaultCharset("UTF-8");
        
      NexacroMappingExceptionResolver nexacroException = new NexacroMappingExceptionResolver();
        
      nexacroException.setView(nexacroView);
      nexacroException.setShouldLogStackTrace(true);
      nexacroException.setShouldSendStackTrace(true);
      nexacroException.setDefaultErrorMsg("fail.common.msg");
      nexacroException.setMessageSource(messageSource());
      nexacroException.setOrder(1);
      resolvers.add(nexacroException);
        
      super.configureHandlerExceptionResolvers(resolvers);
  }

}
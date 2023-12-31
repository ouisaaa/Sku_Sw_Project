package org.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://ec2-3-38-45-235.ap-northeast-2.compute.amazonaws.com:8080"
                        ,"http://20ths.skuservice.net.s3-website.ap-northeast-2.amazonaws.com/"
                        ,"http://localhost:8080","http://localhost:3002","http://d1fyji3zkv8dc3.cloudfront.net/"
                        ,"https://d1fyji3zkv8dc3.cloudfront.net/","http://20ths.skuservice.net/"
                )//cors 링크 설정
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // 허용할 HTTP 메서드를 지정
                .allowedHeaders("Authorization", "Content-Type")
                .exposedHeaders("Custom-Header")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

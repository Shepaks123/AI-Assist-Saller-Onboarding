package com.example.selleronboarding.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * HTTP client for the Gemini API. The API key is read from the server environment
 * (GEMINI_API_KEY in backend/.env) and is sent only from here – never to the browser.
 */
@Configuration
public class GeminiConfig {

    @Bean("geminiRestClient")
    RestClient geminiRestClient(@Value("${gemini.base-url}") String baseUrl,
                                @Value("${gemini.api-key}") String apiKey) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);
        factory.setReadTimeout(30_000);
        return RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("x-goog-api-key", apiKey)
                .build();
    }
}

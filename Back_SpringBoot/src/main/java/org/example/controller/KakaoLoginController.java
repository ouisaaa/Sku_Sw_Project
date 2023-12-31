//package org.example.controller;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//
//@RequiredArgsConstructor
//@Controller
//public class KakaoLoginController {
//    private final KakaoLoginService kakaoLoginService;
//
//    @GetMapping("/login")
//    public String login(Model model) {
//        // 카카오 로그인 url
//        model.addAttribute("kakaoUrl", kakaoLoginService.getKakaoLogin());
//
//        return "login"; // view 이름
//    }
//}

//
//package org.example.controller;
//
//import org.example.domain.Member;
//import org.example.dto.KakaoLoginDTO;
//import org.example.repository.MemberRepository;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class KakaoAuthController {
//    private final MemberRepository memberRepository;
//
//    public KakaoAuthController(MemberRepository memberRepository) {
//        this.memberRepository = memberRepository;
//    }
//
//    @PostMapping("/kakao/login")
//    public void kakaoLogin(@RequestBody KakaoLoginDTO kakaoLoginDto) {
//        // Kakao 로그인 처리 및 회원 정보 저장
//        // kakaoLoginDto에서 필요한 정보 추출
//        String kakaoUserId = kakaoLoginDto.getKakaoUserId();
//        String nickname = kakaoLoginDto.getNickname();
//        String email = kakaoLoginDto.getEmail();
//        String mPw = kakaoLoginDto.getMPw();
//
//        // Member 엔터티에 저장
//        Member newMember = Member.builder()
//                .mId(kakaoUserId) // 예시로 가정한 필드 이름
//                .mNickname(nickname)
//                .mEmail(email)
//                // 추가로 필요한 정보가 있다면 여기에 추가
//                .mPw(mPw) // 새로 추가된 필드
//                .build();
//
//        memberRepository.save(newMember);
//    }
//}
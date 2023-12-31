package org.example.controller;

import org.example.domain.Member;
import org.example.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/code")
    public Optional<Member> getMemberByCode(@RequestParam int mCode) {
        return memberService.getMemberByCode(mCode);
    }

    @GetMapping("/login")
    public ResponseEntity<Member> getMemberById(@RequestParam String id, @RequestParam String password) {
        Member member = memberService.getMemberByIdAndPw(id,password);

        if(member ==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
       return ResponseEntity.ok().body(member);
    }

    @GetMapping("/all")
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // 다른 필요한 엔드포인트들 추가 가능
}
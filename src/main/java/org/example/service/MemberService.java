package org.example.service;

import org.example.domain.Member;
import org.example.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    @Autowired
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // mCode 로 멤버 조회
    public Optional<Member> getMemberByCode(int mCode) {
        return memberRepository.findByMCode(mCode);
    }

    // mId 로 멤버 조회
    public Member getMemberByIdAndPw(String mId,String mPw) {
        return memberRepository.findByMIdAndMPw(mId,mPw);
    }

    // 모든 멤버 조회
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // 다른 필요한 메서드들 추가 가능
}

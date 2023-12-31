package org.example.repository;

import org.example.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    // mCode로 회원 찾기
    Optional<Member> findByMCode(int mCode);

    // mId로 회원 찾기
    Optional<Member> findByMId(String mId);

    Member findByMIdAndMPw(String mId,String mPw);



    // 필요에 따라 추가적인 쿼리 메소드 작성 가능
}
//@Repository
//public interface MemberRepository extends JpaRepository<Member,Long> {

//}

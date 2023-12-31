package org.example.repository;

import org.example.domain.Member;
import org.example.domain.OrderInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderInfoRepository extends JpaRepository<OrderInfo, Integer> {
    // oCode 로 주문 목록 조회
    Optional<OrderInfo> findByOCode(int oCode);

    // 회원별 주문 목록 조회
    List<OrderInfo> findByMember_MCode(Member member);

    // 주문일자 별 목록 조회
    List<OrderInfo> findByODate(String oDate); // 여러 주문이 존재할 수 있기에 List를 써주는게 좋을거 같다

    // oCode 로 주문 목록 검색 - findBy로도 가능하니까 굳이 안만들어도 된다
    // Order searchByoCode(int oCode);

    // 필요에 따라 추가적인 쿼리 메소드 작성 가능
    long count();
    void deleteByOCode(int OCode);


}

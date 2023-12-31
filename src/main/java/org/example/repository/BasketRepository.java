package org.example.repository;

import org.example.domain.Basket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BasketRepository extends JpaRepository<Basket, Integer> {
    // bCode 로 장바구니 찾기
    Optional<Basket> findByBCode(int bCode);

    // pCode 로 장바구니 안에 있는 물품 삭제
    //void deleteByProductInfo_PCode(int pCode);

    // mCode 로 회원별 장바구니 찾기
    List<Basket> findByMember_MCode(int mCode);
}
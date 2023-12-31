package org.example.repository;

import org.example.domain.OrderInfo;
import org.example.domain.OrderDetail;
import org.example.domain.ProductInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, String> {
    // odCode로 조회
    Optional<OrderDetail> findByOdCode(OrderDetail orderDetail);

    // 주문에 해당하는 상세 주문 목록 조회
    List<OrderDetail> findByOrder_OCode(OrderInfo orderInfo);

    // 상품 정보에 해당하는 상세 주문 목록 조회
    List<OrderDetail> findByProductInfo_PCode(ProductInfo productInfo);

    // 필요에 따라 추가적인 쿼리 메소드 작성 가능

    long count();
}
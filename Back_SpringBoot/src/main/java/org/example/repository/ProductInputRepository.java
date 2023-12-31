package org.example.repository;

import org.example.domain.ProductInput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductInputRepository extends JpaRepository<ProductInput, Integer> {
    // iCode 로 상품 찾기
    Optional<ProductInput> findByICode(int iCode);

//    // 상품 아이템명으로 아이템 조회
//    ProductInput findByIName(String iName);
//
//    // iName 으로 상품 검색
//    ProductInput searchByIName(String iName);

//    // pCode, cCategoryName 로 상품 조회 // 이건 두개의 인자로 ㄱㄱ
//    ProductItem findByProductInfo(ProductInfo productInfo);
//
//    // pCode, cCategoryName 로 상품 검색 //이것도 두개의 인자로 ㄱㄱ
//    ProductItem searchByProductInfo(ProductInfo productInfo);

    // iCode 로 상품 삭제
    void deleteByICode(int iCode);

    // 필요에 따라 추가적인 쿼리 메소드 작성 가능
}
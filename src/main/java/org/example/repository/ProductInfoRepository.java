package org.example.repository;

import jakarta.persistence.PersistenceContext;
import org.example.domain.Category;
import org.example.domain.ProductInfo;
import org.hibernate.type.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.parser.Entity;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductInfoRepository extends JpaRepository<ProductInfo, Integer> { // entity의 Id 타입을 따라가야 한다
    // pCode 로 상품 조회
    Optional<ProductInfo> findByPCode(int pCode);

    // 카테고리별 상품 목록 조회
    List<ProductInfo> findByCategory_CCategoryName(String categoryName);

    // pCode 로 상품 삭제
    void deleteByPCode(int pCode);

    // pName 으로 상품 검색
    List<ProductInfo> searchByPNameContaining(String pName); // search 할때는 굳이 optional 안써도 된다는데요?
    //연관된 상품이 여러개 존재할수있음으로 리스트로 바꿔줌
    //검색을 한 단어가 포함되어있는 상품의 정보들을 다 검색하는 쿼리문(Like)을 생성

    //오토인크리먼트가 실행하기 위해서는 jpa의 특정 메소드가 실행이 자동적으로 되지만
    //sqlite에서는 그 메소드가 지원하지 않으므로
    //테이블에 데이터가 얼마나 몇개의 데이터가 존재하는지 알수있는 count()변수를 통해 오토인크리먼트의 기능을 직접 구현하여 실행
    long count();

    ProductInfo findFirstByOrderByPCodeDesc();
    // 필요에 따라 추가적인 쿼리 메소드 작성 가능
}

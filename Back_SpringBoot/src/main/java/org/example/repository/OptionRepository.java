package org.example.repository;

import org.example.domain.Option;
import org.example.domain.ProductInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OptionRepository extends JpaRepository<Option, Integer> {
//    // oCode로 옵션 조회
//    Optional<Option> findByOpCode(int opCode);
//
//    // 상위 옵션에 해당하는 하위 옵션 목록 조회
//    List<Option> findByOpOptionName(String opOptionName);

    // pCode 를 기반으로 해당하는 옵션 목록 조회
    List<Option> findByProductInfo_PCode(int PCode);

//    // 상위 옵션과 pCode 또는 하위 옵션과 pCode 를 기반으로 특정 옵션 조회 // 일단 보류
//    Option findByOpUpOptionAndProductInfo_PCodeOrOpOptionNameAndpCode(Option option, String opOptionName, ProductInfo productInfo);

    // 필요에 따라 추가적인 쿼리 메소드 작성 가능
    long count();

    Optional<Option> findByopCode(int op_code);

}

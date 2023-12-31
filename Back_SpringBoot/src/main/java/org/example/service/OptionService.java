package org.example.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.example.domain.Option;
import org.example.domain.ProductInfo;
import org.example.dto.OptionDTO;
import org.example.repository.OptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OptionService {

    private final OptionRepository optionRepository;

    @Autowired
    public OptionService(OptionRepository optionRepository) {
        this.optionRepository = optionRepository;
    }

//    // opCode 로 옵션 조회
//    public Optional<Option> getOptionByCode(int opCode) {
//        return optionRepository.findByOpCode(opCode);
//    }

//    // 상위 옵션에 속한 모든 하위 옵션 조회
//    public List<Option> getSubOptionsByUpOption(String opOptionName) {
//        return optionRepository.findByOpOptionName(opOptionName);
//    }

    public List<Option> optionFindAll(){
        return optionRepository.findAll();
    }
    // pCode 에 해당하는 옵션들 조회
    public List<Option> getOptionsByProductCode(int pCode) {
        return optionRepository.findByProductInfo_PCode(pCode);
    }

    public List<Option> getAllOptions() {
        return optionRepository.findAll();
    }


    @PersistenceContext
    private EntityManager entityManager; //임의의 쿼리문 추가

    //새로운 상품 등록시 옵션 등록
    @Transactional
    public int save(OptionDTO optionDTO){
        long countOption = optionRepository.count();

        optionDTO.setOp_code((int)countOption+1);

        int flag = entityManager.createNativeQuery("INSERT INTO option(op_option_name,op_quantity,p_code) VALUES (?,?,?)")
                .setParameter(1,optionDTO.getOp_option_name())
                .setParameter(2,optionDTO.getOp_quantity()).setParameter(3,optionDTO.getProductInfo().getPCode()).executeUpdate();
        return flag;
    }
    //상품 입고 시 재고량 +
    @Transactional
    public int plusUpdateQuantity(int opCode,int plusCount){
        //Option option = optionRepository.findByopCode(opCode).orElseThrow(() -> new IllegalArgumentException("not found : " + opCode));

        int flag = entityManager.createNativeQuery("UPDATE option SET op_quantity=? WHERE op_code=?")
                .setParameter(1,plusCount).setParameter(2,opCode).executeUpdate();
        return flag;
    }
    //상품 입고 시 재고량 -
    @Transactional
    public int minusUpdateQuantity(int opCode,int minusCount){
        System.out.println("Service:"+opCode);
        Option option = optionRepository.findByopCode(opCode).orElseThrow(() -> new IllegalArgumentException("not found : " + opCode));

        int flag = entityManager.createNativeQuery("UPDATE option SET op_quantity=? WHERE op_code=?")
                .setParameter(1,option.getOpQuantity()-minusCount).setParameter(2,opCode).executeUpdate();
        return flag;
    }
    @Transactional
    public int optionDelete(int pcode){
        int flag=entityManager.createNativeQuery("DELETE FROM option WHERE p_code=?")
                .setParameter(1,pcode).executeUpdate();
        return flag;
    }
    @Transactional
    public int modifyOption(OptionDTO optionDTO){
        int flag=entityManager.createNativeQuery("UPDATE option SET op_option_name=?,op_quantity=?, p_code=? where op_code=?")
                .setParameter(1,optionDTO.getOp_option_name()).setParameter(2,optionDTO.getOp_quantity())
                .setParameter(3,optionDTO.getPCode()).setParameter(4,optionDTO.getOp_code()).executeUpdate();
        return flag;
    }
    // 다른 필요한 메서드들 추가 가능
}

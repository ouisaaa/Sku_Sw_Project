package org.example.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.example.domain.Basket;
import org.example.dto.BasketDTO;
import org.example.repository.BasketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BasketService {

    private final BasketRepository basketRepository; // 인스턴스 선언, 외부에서 주입됨

    @Autowired // 의존성 주입을 수행
    public BasketService(BasketRepository basketRepository) { // 생성자 파라미터로 주입되는 BasketRepository 빈(bean)
        this.basketRepository = basketRepository; // 주입받은 빈을 BasketService 클래스의 멤버변수인 basketRepository에 할당
    }


    // bCode 로 장바구니 조회
    public List<Basket> basketFindAll() {
        return basketRepository.findAll();
    }

//    // pCode 로 장바구니에서 상품 삭제


    // 장바구니 목록 조회
    public List<Basket> getAllBaskets() {
        return basketRepository.findAll();
    }


    public List<Basket> getMemberBaskets(int mCode) {
        // 특정 회원의 장바구니 목록을 조회하는 로직
        return basketRepository.findByMember_MCode(mCode);
    }


    @PersistenceContext
    private EntityManager entityManager; //임의의 쿼리문 추가

    @Transactional
    public int addProductToBasket(BasketDTO basket) {
        // 장바구니에 상품을 추가하는 로직
//        basketRepository.save(basket);
        int flag = entityManager.createNativeQuery("INSERT INTO basket(b_count,m_code,op_code) VALUES(?,?,?) ")
                .setParameter(1,basket.getBCount()).setParameter(2,basket.getMember().getMCode())
                .setParameter(3,basket.getOption().getOpCode()).executeUpdate();

        return flag;
    }
    @Transactional
    public int deleteProductInBasketByCode(int bcode) {
        int flag = entityManager.createNativeQuery("Delete From basket where b_code=?")
                .setParameter(1,bcode).executeUpdate();

        return flag;
    }

    // 다른 필요한 메서드들 추가 가능
}
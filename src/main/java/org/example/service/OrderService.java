package org.example.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.example.domain.OrderDetail;
import org.example.domain.OrderInfo;
import org.example.dto.OrderInfoDTO;
import org.example.dto.OrderDetailDTO;
import org.example.repository.OrderDetailRepository;
import org.example.repository.OrderInfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderService {
    private final OrderInfoRepository orderInfoRepository;
    private final OrderDetailRepository orderDetailRepository;

//    public boolean orderSave(OrderDTO newOrder, List<OrderDetailDTO> newOrderDetail){
//        int flag = saveNewOrder(newOrder);
//        if(flag==0){
//            return false;
//        }
//        else {
//            for(int i=0;i<newOrderDetail.size();i++){
//                int flag2 = saveNewOrderDetail(newOrderDetail.get(i));
//                if (flag2 == 0) {
//                    if (flag != 0) {
//                        long count = orderRepository.count();
//                        orderRepository.deleteByOCode((int) count);
//                    }
//                    return false;
//                }
//            }
//        }
//        return true;
//    }
    public List<OrderInfo> findAll(){
        return orderInfoRepository.findAll();
    }
    public List<OrderDetail>findAllDetail(){
        return orderDetailRepository.findAll();
    }

    @PersistenceContext
    private EntityManager entityManager; //임의의 쿼리문 추가

    //주문 정보 insert
    @Transactional
    public int saveNewOrder(OrderInfoDTO newOrder){

        int flag=entityManager.createNativeQuery("INSERT INTO order_info(o_total_price,o_zip_code,o_address,o_phone_num,o_request,o_date,m_code)VALUES (?,?,?,?,?,?,?)")
                .setParameter(1,newOrder.getOTotalprice())
                .setParameter(2,newOrder.getOZipcode()).setParameter(3,newOrder.getOAddress())
                .setParameter(4,newOrder.getOPhoneNum()).setParameter(5,newOrder.getORequest())
                .setParameter(6,newOrder.getODate()).setParameter(7,newOrder.getMember().getMCode()).executeUpdate();


        return flag;
    }
    @Transactional
    public int selectMax(){
        String queryString ="select Max(OCode) from OrderInfo";
        TypedQuery<Integer> oCode= entityManager.createQuery(queryString, Integer.class);
        //System.out.println(oCode.getSingleResult());
        return oCode.getSingleResult();
    }
    //orderDetail 정보 insert
    @Transactional
    public int saveNewOrderDetail(OrderDetailDTO newOrderDetail){
        long countOrder= orderInfoRepository.count(); //한번 이상의 주문에 의해 해당 트랜젝션이 실행됨으로 그 한번의 orderCode를 저장

        newOrderDetail.setOrder(selectMax());
       // System.out.println(countOrderDetail);

        int flag=entityManager.createNativeQuery("INSERT INTO order_detail(o_code,p_code,od_count,op_option_name,op_code)VALUES (?,?,?,?,?)")
                .setParameter(1,newOrderDetail.getOrder().getOCode())
                .setParameter(2,newOrderDetail.getProductInfo().getPCode()).setParameter(3,newOrderDetail.getOdCount())
                .setParameter(4,newOrderDetail.getOption().getOpOptionName()).setParameter(5,newOrderDetail.getOption().getOpCode()).executeUpdate();
        return flag;
    }
}

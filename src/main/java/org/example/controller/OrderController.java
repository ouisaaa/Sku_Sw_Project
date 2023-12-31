package org.example.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.domain.OrderDetail;
import org.example.domain.OrderInfo;
import org.example.dto.MemberDTO;
import org.example.dto.OrderInfoDTO;
import org.example.dto.OrderDetailDTO;
import org.example.service.OptionService;
import org.example.service.OrderService;
import org.example.telegram.Telegram;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/order")
@Slf4j
public class OrderController {
    private final OrderService orderService;
    private final OptionService optionService;
    private Telegram telegram = new Telegram();
    @PostMapping("/newOrder")
    public ResponseEntity<OrderInfo> addNewOrder(@RequestBody HashMap<String , Object> request){
        //ResponseEntity<Order>
        //주문하는 상품 및 상품 갯수
        List<HashMap<String,Object>> productMap = (List<HashMap<String, Object>>) request.get("product");
        //주문하는 회원 정보
        HashMap<String,Object> memberMap = (HashMap<String, Object>) request.get("member");

        //현재 시간을 문자열로 파싱해서 저장 할수있도록 문자열 생성
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDateTime = now.format(formatter);

        OrderInfoDTO orderInfoDTO = new OrderInfoDTO();
        orderInfoDTO.setOTotalprice((int)request.get("o_total_price"));
        orderInfoDTO.setOAddress((String) request.get("o_address"));
        orderInfoDTO.setOZipcode((String)request.get("o_zip_code"));
        orderInfoDTO.setOPhoneNum((String)request.get("o_phone_num"));
        orderInfoDTO.setORequest((String)request.get("o_request"));
        orderInfoDTO.setODate(formattedDateTime);

        //m_code 필드 채우기 위한 맴버 정보 변환
        orderInfoDTO.setMember((int)memberMap.get("m_code"));

            int flag=orderService.saveNewOrder(orderInfoDTO);
            if(flag == 0){ //db 연산 오류시 예외 발생시켜 잘못된 정보 전달이라고 리스판스
                log.error("order/newOrder saveNewOrder Error");
                telegram.sendMessage("order/newOrder saveNewOrder Error: 로그를 확인해주세요");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            //여러 상품 주문 시 주문 디테일에 하나씩 추가
            for (int i = 0; i < productMap.size(); i++) {
                OrderDetailDTO orderDetailDTO =
                        new OrderDetailDTO((String) productMap.get(i).get("op_option_name"), (int) productMap.get(i).get("p_code"));
                //orderService.saveNewOrderDetail();
                orderDetailDTO.setOdCount((int) productMap.get(i).get("od_count"));
                orderDetailDTO.setOption((int)productMap.get(i).get("op_code"));

                 flag=orderService.saveNewOrderDetail(orderDetailDTO);
                if(flag ==0) {
                    log.error("order/newOrder saveNewOrderDetail Error");
                    telegram.sendMessage("order/newOrder saveNewOrderDetail Error: 로그를 확인해주세요");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
                }

                flag=optionService.minusUpdateQuantity(orderDetailDTO.getOption().getOpCode(),orderDetailDTO.getOdCount());

                if(flag ==0) {
                    log.error("order/newOrder minusUpdateQuantity Error");
                    telegram.sendMessage("order/newOrder minusUpdateQuantity Error: 로그를 확인해주세요");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
                }
            }
            //System.out.println("     "+productMap);

        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/")
    public ResponseEntity<List<OrderInfo>> getOrderInfo(){
        List<OrderInfo> orderInfos = orderService.findAll();

        return ResponseEntity.ok().body(orderInfos);
    }
    @GetMapping("/detail")
    public ResponseEntity<List<OrderDetail>> getOrderDetail(){
        List<OrderDetail> orderDetails = orderService.findAllDetail();

        return ResponseEntity.ok().body(orderDetails);
    }

    @GetMapping("/testtest")
    public void teste(){
        orderService.selectMax();
    }
}

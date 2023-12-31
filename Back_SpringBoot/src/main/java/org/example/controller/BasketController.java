package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.domain.Basket;
import org.example.dto.BasketDTO;
import org.example.service.BasketService;
import org.example.telegram.Telegram;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/basket")
@Slf4j
public class BasketController {

    private final BasketService basketService;
    private Telegram telegram = new Telegram();

    @Autowired
    public BasketController(BasketService basketService) {
        this.basketService = basketService;
    }



    @DeleteMapping("/productDelete")
    public ResponseEntity<Void> deleteProductInBasketByCode(@RequestParam int bcode) {
        int flag=basketService.deleteProductInBasketByCode(bcode);

        if(flag==0){
            log.error("product/productDelete Error");
            telegram.sendMessage("product/productDelete Error: 로그를 확인해주세요");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    return ResponseEntity.ok().body(null);
    }
    @DeleteMapping("/productsDelete")
    public ResponseEntity<Void> deleteProductsInBasketByCode(@RequestParam List<Integer> bcode) {
        for(int i=0;i<bcode.size();i++) {
            int flag = basketService.deleteProductInBasketByCode(bcode.get(i));

            if (flag == 0) {
                log.error("product/productsDelete Error");
                telegram.sendMessage("product/productDelete Error: 로그를 확인해주세요");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }
        return ResponseEntity.ok().body(null);
    }
    @GetMapping("/")
    public ResponseEntity<List<Basket>> basketProduct(){
        List<Basket> baskets = basketService.basketFindAll();

        return ResponseEntity.ok().body(baskets);
    }

    @PostMapping("/add")
    public ResponseEntity<BasketDTO> addProductToBasket(@RequestBody HashMap<String , Object>request) {
        BasketDTO basket = new BasketDTO();
        basket.setBCount((int) request.get("bcount"));
        basket.setMember((int) request.get("mcode"));
        basket.setOption((int) request.get("opcode"));

        System.out.println(basket.toEntity());
        int flag=basketService.addProductToBasket(basket);
        if(flag == 0) {
            log.error("product/add Error");
            telegram.sendMessage("product/add Error: 로그를 확인해주세요");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    @GetMapping("/member/mCode")
    public List<Basket> getMemberBaskets(@RequestParam int mCode) {
        return basketService.getMemberBaskets(mCode);
    }

    // 다른 필요한 엔드포인트들 추가 가능
}
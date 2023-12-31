package org.example.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.domain.Option;
import org.example.dto.OptionDTO;
import org.example.service.OptionService;
import org.example.service.ProductService;
import org.example.telegram.Telegram;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/option")
@Slf4j
public class OptionController {
    private final ProductService productService;
    private final OptionService optionService;
    private Telegram telegram = new Telegram();


//    @GetMapping("/code")
//    public Optional<Option> getOptionByCode(@RequestParam int opCode) {
//        return optionService.getOptionByCode(opCode);
//    }

    @GetMapping("/")
    public ResponseEntity<List<Option>> optionProduct(){
        List<Option> options = optionService.optionFindAll();

        return ResponseEntity.ok().body(options);
    }
    //p_code로 옵션 확인
    @GetMapping("/product")
    public List<Option> getOptionsByProductCode(@RequestParam int pCode) {
        return optionService.getOptionsByProductCode(pCode);
    }
//
//    @GetMapping("/all")
//    public List<Option> getAllOptions() {
//        return optionService.getAllOptions();
//    }

    @PostMapping("/newProduct")
    public ResponseEntity<Option> addNewProductOption(@RequestBody List<HashMap<String, Object>>newProductOption){
        for(int i=0;i<newProductOption.size();i++){
            OptionDTO optionDTO = new OptionDTO();
            optionDTO.setOp_option_name((String)newProductOption.get(i).get("op_option_name"));
            optionDTO.setOp_quantity((int)newProductOption.get(i).get("op_quantity"));
            optionDTO.setProductInfo(productService.getNewPcodeOption());

            int flag =optionService.save(optionDTO);
            if(flag==0){
                log.error("option/newProduct Error");
                telegram.sendMessage("option/newProduct Error: 로그를 확인해주세요");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }
    @PutMapping("/modifyOption")
    public ResponseEntity<Option> modifyProductOption(@RequestBody List<HashMap<String, Object>>request){
        for(int i=0;i<request.size();i++){
            OptionDTO optionDTO = new OptionDTO();
            optionDTO.setOp_code((int)request.get(i).get("opCode"));
            optionDTO.setOp_quantity((int)request.get(i).get("opQuantity"));
            optionDTO.setOp_option_name((String)request.get(i).get("opOptionName"));
            optionDTO.setProductInfo((int)request.get(i).get("pcode"));

            int flag = optionService.modifyOption(optionDTO);
            if(flag==0) {
                log.error("option/modifyOption Error");
                telegram.sendMessage("option/modifyOption Error: 로그를 확인해주세요");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }
    // 다른 필요한 엔드포인트들 추가 가능
}

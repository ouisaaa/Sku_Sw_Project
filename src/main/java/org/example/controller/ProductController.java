package org.example.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.domain.ProductInfo;
import org.example.domain.ProductInput;
import org.example.dto.CategoryDTO;
import org.example.dto.OptionDTO;
import org.example.dto.product.ProductInputDTO;
import org.example.dto.product.RegisterProductRequest;
import org.example.service.OptionService;
import org.example.service.ProductService;
import org.example.telegram.Telegram;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/product")
@Slf4j
public class ProductController {
    private final ProductService productService;
    private final OptionService optionService;
   // private static final String UPLOAD_DIR = "./src/main/resources/productImage"; // 이미지를 저장할 디렉토리

    private Telegram telegram = new Telegram();

    //람다로 서버가 죽었는지 확인 하는 코드
    @GetMapping("/liveTest")
    public ResponseEntity<Void>LambdaTest(){
        //List<ProductInfo> productInfos = productService.findAll();

        return ResponseEntity.ok().body(null);
    }
    @GetMapping("/all")
    public ResponseEntity<List<ProductInfo>>findAll(){
        List<ProductInfo> productInfos = productService.findAll();

        //log.error("testertestsersetsetsersetsteststestestserestsetserer");

        return ResponseEntity.ok().body(productInfos);
    }
    @GetMapping("/input")
    public ResponseEntity<List<ProductInput>>findInput(){
        List<ProductInput> productInputs = productService.findAllInput();

        return ResponseEntity.ok().body(productInputs);
    }

    //카테고리 선택시 해당 카테고리안에 있는 모든 제품 출력
    @GetMapping("/product")
    public ResponseEntity<List<ProductInfo>> findAllProducts(@RequestParam String p_category){
        List<ProductInfo> products = productService.findAllByCategoryName(p_category);

        return ResponseEntity.ok().body(products);
    }
    //상품 클릭시 p_code를 통해서 상품 상세정보 가져오기
    @GetMapping("/productInfo") //링크가 같은데 같은 요청을 보내면 꼬일수있어서 구분할수있게 링크를 임의로 줘서 수정
    public ResponseEntity<ProductInfo>findProductInformation(@RequestParam int p_code){
        ProductInfo productInfo = productService.findByProductInformation(p_code);

        return ResponseEntity.ok().body(productInfo);
    }//링크 수정을 한다면 명세서에 수정 표시 ㄱㄱ

    //상품명 검색하는 코드
    @GetMapping("/productSearch")
    public ResponseEntity<List<ProductInfo>>searchProductByName(@RequestParam String pName){
        List<ProductInfo> searchResult = productService.searchProductInfomation(pName);

        return ResponseEntity.ok().body(searchResult);
    }
    @DeleteMapping("/product")
    public ResponseEntity<Void> delecteProduct(@RequestParam int pcode){
//           if(image != null) {
//               File imageFile = new File(image);
//
//               if (imageFile.exists()) {
//                   if (imageFile.delete()) {
//                       System.out.println("이미지 삭제 성공");
//                   } else {
//                       System.out.println("이미지 삭제 실패");
//                   }
//               } else {
//                   System.out.println("해당 경로의 이미지가 존재하지 않습니다.");
//               }
//           }
        int flag=productService.delete(pcode);

        if(flag ==0){
            log.error("product/product productDelete Error");
            telegram.sendMessage("product/product productDelete Error: 로그를 확인해주세요");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

       flag= optionService.optionDelete(pcode);

       if(flag ==0){

           log.error("product/product optionDelete Error");
           telegram.sendMessage("product/product optionDelete Error: 로그를 확인해주세요");
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
       }
        return ResponseEntity.ok().build();
    }
    //수정 요청 => 다량으로 수정을 요청 할 경우
    @PutMapping("/modifyProduct")
    public ResponseEntity<ProductInfo> updateProduct(@RequestBody List<HashMap<String , Object>> request){
        for(int i=0 ; i<request.size();i++) {
            HashMap<String, Object> categoryMap = (HashMap<String, Object>) request.get(i).get("category");
            RegisterProductRequest productRequest = new RegisterProductRequest();

            productRequest.setP_code((int) request.get(i).get("pcode"));
            productRequest.setP_name((String) request.get(i).get("pname"));
            productRequest.setP_price((int) request.get(i).get("pprice"));
            productRequest.setP_salePrice((int) request.get(i).get("psalePrice"));
            productRequest.setP_image_name((String) request.get(i).get("pimageName"));
            productRequest.setP_content((String) request.get(i).get("pcontent"));
            CategoryDTO categoryDTO = new CategoryDTO((int) categoryMap.get("ccode"), (String) categoryMap.get("ccategoryName"), (String) categoryMap.get("cupCategory"));

            productRequest.setCategory(categoryDTO.toEntity());

            int flag = productService.updateProductInfo(productRequest);

            if (flag == 0) {
                log.error("product/modifyProduct Error");
                telegram.sendMessage("product/modifyProduct Error: 로그를 확인해주세요");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }
//    //한개씩 수정할 경우
//    @PutMapping("/modifyProduct")
//    public ResponseEntity<ProductInfo> updateProduct(@RequestBody HashMap<String , Object> request){
//        for(int i=0 ; i<request.size();i++) {
//            HashMap<String, Object> categoryMap = (HashMap<String, Object>) request.get("category");
//            RegisterProductRequest productRequest = new RegisterProductRequest();
//
//            productRequest.setP_code((int) request.get("p_code"));
//            productRequest.setP_name((String) request.get("p_name"));
//            productRequest.setP_price((int) request.get("p_price"));
//            productRequest.setP_salePrice((int) request.get("p_salePrice"));
//            productRequest.setP_image_name((String) request.get("p_image_name"));
//            productRequest.setP_content((String) request.get("p_content"));
//            CategoryDTO categoryDTO = new CategoryDTO((int) categoryMap.get("CCode"), (String) categoryMap.get("CCategoryName"), (int) categoryMap.get("CUpCategory"));
//
//            productRequest.setCategory(categoryDTO.toEntity());
//
//            int flag = productService.updateProductInfo(productRequest);
//
//            if (flag == 0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
//        }
//        return ResponseEntity.status(HttpStatus.CREATED).body(null);
//    }
//
//    Path filePath;
//    //    //상품 등록
//    //일단 임시로 이미지 파일 저장하는 파일 생성
//    @PostMapping("/newProductImage")
//    public ResponseEntity<ProductInfo> addNewProductImage(@RequestPart("image") MultipartFile imageFile){
//
//        if(imageFile.isEmpty()){
//            log.error("product/newProductImg ImageFile Null Error");
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
//        }
//
//        try {
//            // 이미지를 저장할 디렉토리가 없으면 생성
//            Path directory = Paths.get(UPLOAD_DIR);
//            if (!Files.exists(directory)) {
//                Files.createDirectories(directory);
//            }
//
//            // 이미지 파일을 저장할 경로 설정
//            filePath = Paths.get(UPLOAD_DIR, String.valueOf(productService.getNewPcode())+".jpg");
//
//
//            // 이미지 파일을 지정된 경로에 저장
//            imageFile.transferTo(filePath);
//
//        }catch (Exception e) {
//            log.error("product/newProductImg Post Error");
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//        return ResponseEntity.ok().body(null);
//    }

    //    //상품 등록 정보들
    @PostMapping("/newProduct")
    public ResponseEntity<ProductInfo> addNewProduct(@RequestBody HashMap<String , Object> request){
        HashMap<String,Object> categoryMap = (HashMap<String, Object>) request.get("category");

        RegisterProductRequest productRequest = new RegisterProductRequest();

        productRequest.setP_name((String) request.get("p_name"));
        productRequest.setP_price((int)request.get("p_price"));
        productRequest.setP_salePrice((int)request.get("p_salePrice"));
        productRequest.setP_content((String) request.get("p_content"));
        productRequest.setP_image_name((String)request.get("p_image_name"));

        CategoryDTO categoryDTO =new CategoryDTO((int)categoryMap.get("CCode"),(String)categoryMap.get("CCategoryName"),(String)categoryMap.get("CUpCategory"));
        productRequest.setCategory(categoryDTO.toEntity());


        int flag=productService.saveNewProduct2(productRequest);

        if(flag == 0){
            log.error("product/newProduct Post Error");
            telegram.sendMessage("product/newProduct Post Error: 로그를 확인해주세요");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok().body(null);
    }

    //상품 입고 기록 등록
    @PostMapping("/productInput")
    public ResponseEntity<ProductInput> addInputReport(@RequestBody HashMap<String,Object>request){
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDateTime = now.format(formatter);

            ProductInputDTO productInputDTO = new ProductInputDTO();
            productInputDTO.setIQuantity((int) request.get("i_quantity"));
            productInputDTO.setIReceivedDate(formattedDateTime);
            productInputDTO.setProductInfo((String)request.get("p_name"),(String)request.get("c_category_name"));
            productInputDTO.setOption((int)request.get("op_code"),(String)request.get("op_option_name"));

            int flag=productService.productInputQuantity(productInputDTO);
            if(flag == 0){
                log.error("product/productInput productInput Post Error");
                telegram.sendMessage("product/productInput productInput Post Error: 로그를 확인해주세요");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }


            flag=optionService.plusUpdateQuantity(productInputDTO.getOption().getOpCode(),productInputDTO.getIQuantity());
            if(flag == 0){
                log.error("product/productInput plusUpdateQuantity Post Error");
                telegram.sendMessage("product/productInput plusUpdateQuantity Post Error: 로그를 확인해주세요");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    @PatchMapping("/inputProduct")
    public ResponseEntity<ProductInfo> Input(@RequestBody HashMap<String , Object> request){

                OptionDTO optionDTO = new OptionDTO();
                optionDTO.setOp_code((int)request.get("opCode"));
                optionDTO.setOp_option_name((String)request.get("opOptionName"));
                optionDTO.setOp_quantity((int)request.get("opQuantity"));

                int flag = optionService.plusUpdateQuantity((int)request.get("opCode"),(int)request.get("opQuantity"));
                if(flag == 0){
                    log.error("product/inputProduct Post Error");
                    telegram.sendMessage("product/inputProduct Post Error: 로그를 확인해주세요");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
                }

        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }
//    @GetMapping("/productImage")
//    public ResponseEntity<Resource> sendImage(@RequestParam String image) throws IOException {
//       Path imagePath = Paths.get(image);
//        Resource resource = new UrlResource(imagePath.toUri());
//
//        if (resource.exists() && resource.isReadable()) {
//            return ResponseEntity.ok()
//                    .contentType(MediaType.IMAGE_JPEG) // 이미지 파일 형식에 맞게 Content-Type 설정
//                    .body(resource);
//        } else {
//            log.error("product/productImage Get Error: Failed to read the image file");
//
//            throw new IOException("Failed to read the image file");
//        }
//    }
    @GetMapping("/logTest")
    public void ttsetset(){
        //productService.checkingTest();
        log.error("testertestsersetsetsersetsteststestestserestsetserer");
        telegram.sendMessage("ttestset: 로그파일을 확인해주세여");
    }
}

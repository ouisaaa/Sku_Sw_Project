package org.example.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.example.domain.ProductInfo;
import org.example.domain.ProductInput;
import org.example.dto.product.ProductInputDTO;
import org.example.dto.product.RegisterProductRequest;
import org.example.repository.CategoryRepository;
import org.example.repository.ProductInfoRepository;
import org.example.repository.ProductInputRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductService {
    private final ProductInfoRepository productInfoRepository;
    private final ProductInputRepository productInputRepository;

    public List<ProductInfo> findAll(){
        return productInfoRepository.findAll();
    }
    public List<ProductInput> findAllInput(){
        return productInputRepository.findAll();
    }
    //카테고리 이름으로 해당 카테고리인 물품들 검색
    public List<ProductInfo> findAllByCategoryName(String categoryName){
        System.out.println(categoryName);
        return productInfoRepository.findByCategory_CCategoryName(categoryName);
    }
    //상품 상세정보 가져오기
    public ProductInfo findByProductInformation(int pCode){
        return productInfoRepository.findByPCode(pCode)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + pCode));
    }
    //상품 검색
    public List<ProductInfo> searchProductInfomation(String pName){
        return productInfoRepository.searchByPNameContaining(pName);
    }

    public int getNewPcodeOption(){
        ProductInfo productInfo = productInfoRepository.findFirstByOrderByPCodeDesc();

        return productInfo.getPCode();
    }


    //새로운 상품 등록
    @PersistenceContext
    private EntityManager entityManager; //임의의 쿼리문 추가

    //상품 삭제

    @Transactional
    public int delete(int p_code){
        int flag=entityManager.createNativeQuery("DELETE FROM product_info WHERE p_code=?")
                .setParameter(1,p_code).executeUpdate();
        //productItemRepository.deleteByICode();
        return flag;
    }
    @Transactional
    public int saveNewProduct2(RegisterProductRequest newProductInfo){

        int flag=entityManager.createNativeQuery("INSERT INTO product_info (p_name,p_price,p_content,p_image_name,c_category_name,p_sale_price) " +
                "VALUES (?,?,?,?,?,?)").setParameter(1,newProductInfo.getP_name()).setParameter(2,newProductInfo.getP_price())
                .setParameter(3,newProductInfo.getP_content()).setParameter(4,newProductInfo.getP_image_name()).setParameter(5,newProductInfo.getCategory().getCCategoryName())
                .setParameter(6,newProductInfo.getP_salePrice()).executeUpdate();

        return flag;
    }
    //상품 정보 수정 요청
    @Transactional
    public int updateProductInfo(RegisterProductRequest updateProductInfo){
        int flag= entityManager.createNativeQuery("UPDATE product_info SET p_name=?,p_price=?,p_sale_price=?,p_content=?,p_image_name=?,c_category_name=? WHERE p_code=?")
                .setParameter(1,updateProductInfo.getP_name()).setParameter(2,updateProductInfo.getP_price())
                .setParameter(3,updateProductInfo.getP_salePrice()).setParameter(4,updateProductInfo.getP_content())
                .setParameter(5,updateProductInfo.getP_image_name()).setParameter(6,updateProductInfo.getCategory().getCCategoryName())
                .setParameter(7,updateProductInfo.getP_code()).executeUpdate();
        return flag;
    }
    //상품 입고
    @Transactional
    public int productInputQuantity(ProductInputDTO productInputDTO){

        int flag=entityManager.createNativeQuery("INSERT INTO product_input(i_quantity,i_received_date,p_name,c_category_name,op_option_name,op_code) " +
                        "VALUES (?,?,?,?,?,?)")
                .setParameter(1,productInputDTO.getIQuantity())
                .setParameter(2,productInputDTO.getIReceivedDate()).setParameter(3,productInputDTO.getProductInfo().getP_name())
                .setParameter(4,productInputDTO.getProductInfo().getCategory().getCCategoryName())
                .setParameter(5,productInputDTO.getOption().getOpOptionName())
                .setParameter(6,productInputDTO.getOption().getOpCode()).executeUpdate();
        return flag;
    }
}

//package org.example.dto.product;
//
//import lombok.Getter;
//import org.example.domain.Product;
//
///**
// *
// *제품 정보를 받아오는
// *
// * **/
//
//@Getter
//public class ProductResponse {
//    private final String p_code;
//    private final String p_name;
//    private final String p_content;
//    private final String p_image;
//    private final int p_price;
//    private final int p_stock;
//    private final String p_category;
//
//    public ProductResponse(Product product) {
//        this.p_code = product.getP_code();
//        this.p_name = product.getP_name();
//        this.p_content = product.getP_content();
//        this.p_image = product.getP_image();
//        this.p_price = product.getP_price();
//        this.p_stock = product.getP_stock();
//        this.p_category = product.getP_category();
//    }
//}

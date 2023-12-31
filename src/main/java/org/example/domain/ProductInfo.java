package org.example.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@Data
@Entity
public class ProductInfo {
    @Id

    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "p_code", columnDefinition = "integer", nullable = false)
    private int PCode; // primary key

    @Column(name = "p_name", columnDefinition = "text", nullable = false)
    private String PName; // 상품명

    @Column(name = "p_price", columnDefinition = "integer", nullable = false)
    private int PPrice; // 상품 원가

    @Column(name = "p_salePrice", columnDefinition = "integer", nullable = false)
    private int PSalePrice; // 상품 원가

    @Column(name = "p_image_name", columnDefinition = "text", nullable = false)
    private String PImageName; // 상품 이미지 파일 이름

    @Column(name = "p_content", columnDefinition = "text", nullable = false)
    private String PContent; // 상품 이미지 파일 이름

    @OneToOne
    @JoinColumn(name = "c_category_name", referencedColumnName = "c_category_name")
    private Category category; // Foreign key

    @Builder
    public ProductInfo(int pCode,String pName, int pPrice,String pContent,String pImageName,int pSalePrice,Category category) {
        this.PCode=pCode;
        this.PName = pName;
        this.PPrice = pPrice;
        this.PSalePrice=pSalePrice;
        this.PContent = pContent;
        this.PImageName = pImageName;
        this.category =category;
    }
}
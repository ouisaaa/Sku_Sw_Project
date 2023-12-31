package org.example.dto.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.domain.Category;
import org.example.domain.ProductInfo;
//import org.example.dto.CategoryDTO;

/*

* 제품을 등록 요청 전달 할 데이터

**/

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RegisterProductRequest {
    private int p_code;
    private String p_name;
    private String p_content;
    private int p_price;
    private int p_salePrice;
    private String p_image_name;
    private Category category=new Category();

    //빌더 패턴은 객체 생성과 속성 설정을 명시적으로 제어하는 디자인패턴
    //빌더 패턴을 생성안하면 생성자를 직접 활용하여 객체를 생성할수있으나 문제가 생성자의 매개변수가 길어지고
    //명시적으로 어떤 필드가 생성되는지 알수가 없다
    public void setCategoryName(String name){
        this.category.setCCategoryName(name);
    }
    public ProductInfo toEntity(){
        System.out.println("c:    "+category);
        return ProductInfo.builder()
                .pCode(p_code)
                .pName(p_name)
                .pContent(p_content)
                .pImageName(p_image_name)
                .pPrice(p_price)
                .pSalePrice(p_salePrice)
                .category(category)
                .build();
    }

}
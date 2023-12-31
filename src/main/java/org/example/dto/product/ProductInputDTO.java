package org.example.dto.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.domain.Option;
import org.example.domain.ProductInfo;
import org.example.domain.ProductInput;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductInputDTO {
    private int ICode; // primary key
    private int IQuantity; // 입고한 재고
    private String IReceivedDate; //입고 날짜
    private RegisterProductRequest productInfo=new RegisterProductRequest();
    private Option option =new Option();

    public void setProductInfo(String p_name,String c_category_name){
        this.productInfo.setP_name(p_name);
        this.productInfo.setCategoryName(c_category_name);
    }
    public void setOption(int opCode,String option_name){
        this.option.setOpOptionName(option_name);
        this.option.setOpCode(opCode);
    }

    public ProductInput toEntity(){
        return ProductInput.builder()
                .iCode(ICode)
                .iQuantity(IQuantity)
                .iReceivedDate(IReceivedDate)
                .productInfo(productInfo.toEntity())
                .option(option)
                .build();
    }
}

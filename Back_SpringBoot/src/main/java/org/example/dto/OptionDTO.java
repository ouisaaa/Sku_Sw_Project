package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.domain.Option;
import org.example.domain.ProductInfo;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OptionDTO {
    private int op_code;
    private String op_option_name;
    private int op_quantity;
    private ProductInfo productInfo=new ProductInfo();

    public void setProductInfo(int p_code){
        this.productInfo.setPCode(p_code);
    }
    public int getPCode(){return productInfo.getPCode();}
    public Option toEntity(){
        return Option.builder()
                .opCode(op_code)
                .opOptionName(op_option_name)
                .opQuantity(op_quantity)
                .productInfo(productInfo)
                .build();
    }
}

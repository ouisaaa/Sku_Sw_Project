package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.domain.Option;
import org.example.domain.OrderInfo;
import org.example.domain.OrderDetail;
import org.example.domain.ProductInfo;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDetailDTO {
    private int odCode; // Primary key
    private int OdCount; // 개수
    private OrderInfo order =new OrderInfo(); // Foreign Key 1
    private ProductInfo productInfo=new ProductInfo(); // Foreign Key 2
    private Option option=new Option(); // Foreign Key 3

    public OrderDetailDTO(String optionName,int pCode){
        this.option.setOpOptionName(optionName);
        this.productInfo.setPCode(pCode);
    }
    public void setOrder(int order){
        this.order.setOCode(order);
    }
    public void setOption(int opCode){
        option.setOpCode(opCode);
    }
    public OrderDetail toEntity(){
        return OrderDetail.builder()
                .odCode(odCode)
                .odCount(OdCount)
                .orderInfo(order)
                .productInfo(productInfo)
                .option(option)
                .build();
    }
}

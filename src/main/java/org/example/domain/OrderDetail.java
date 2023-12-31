package org.example.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
public class OrderDetail {
    @Id
    @Column(name = "od_code", columnDefinition = "integer", nullable = false)
    private int odCode; // Primary key

    @Column(name = "od_count", columnDefinition = "integer", nullable = false)
    private int OdCount; // 개수

    @Column(name="op_option_name", columnDefinition = "text", nullable = false)
    private String op_option_name;

    @ManyToOne
    @JoinColumn(name = "oCode", referencedColumnName = "o_code", nullable = false)
    private OrderInfo order; // Foreign Key 1

    @ManyToOne
    @JoinColumn(name = "pCode", referencedColumnName = "p_code", nullable = false)
    private ProductInfo productInfo; // Foreign Key 2

    @ManyToOne
    @JoinColumn(name="opCode",referencedColumnName = "op_code",nullable = false)
    private Option option;


    @Builder
    public OrderDetail(int odCode, int odCount, OrderInfo orderInfo, ProductInfo productInfo, Option option) {
        this.odCode = odCode;
        this.OdCount = odCount;
        this.order = orderInfo;
        this.productInfo = productInfo;
        this.option = option;
        this.op_option_name = option.getOpOptionName();
    }
}

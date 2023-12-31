package org.example.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
public class Option {
    @Id
    @Column(name = "op_code", insertable=false, updatable=false, columnDefinition = "integer", nullable = false)
    private int opCode; // Primary Key

    @Column(name = "op_option_name", columnDefinition = "text", nullable = false)
    private String opOptionName; // 옵션이름

    @Column(name="op_quantity", columnDefinition = "integer", nullable = false , insertable=false, updatable=false)
    private int opQuantity; //재고량

    @ManyToOne
    @JoinColumn(name = "pCode", referencedColumnName = "p_code", nullable = false )
    private ProductInfo productInfo; // Foreign Key

    @Builder
    public Option(int opCode, String opOptionName,int opQuantity, ProductInfo productInfo) {
        this.opCode = opCode;
        this.opOptionName = opOptionName;
        this.opQuantity = opQuantity;
        this.productInfo = productInfo;
    }
}

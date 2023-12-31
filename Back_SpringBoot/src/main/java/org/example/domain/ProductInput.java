package org.example.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
public class ProductInput {
    @Id
    @Column(name = "i_code", columnDefinition = "integer", nullable = false)
    private int ICode; // primary key

    @Column(name = "i_quantity", columnDefinition = "integer", nullable = false)
    private int IQuantity; // 입고한 재고

    @Column(name = "i_received_date",columnDefinition = "text", nullable = false)
    private String IReceivedDate;

    @Column(name = "c_category_name", columnDefinition = "text", nullable = false)
    private String CCategoryName;

    @Column(name = "op_option_name", columnDefinition = "text", nullable = false)
    private String opOptionName; // 옵션이름

    @ManyToOne
    @JoinColumn(name = "pName", referencedColumnName = "p_name")
    private ProductInfo productInfo;

    @ManyToOne
    @JoinColumn( name="opCode",referencedColumnName = "op_code")
    private Option option;

//    @OneToOne
//    @JoinColumn(name = "pCode", referencedColumnName = "pCode")
//    @JoinColumn(name = "cCategory", referencedColumnName = "cCategory")
//    private ProductInfo productInfo; // Foreign key

    @Builder
    public ProductInput(int iCode, int iQuantity,
                        String iReceivedDate,
                        ProductInfo productInfo,
                        Option option) {
        this.ICode = iCode;
        this.IQuantity = iQuantity;
        this.IReceivedDate = iReceivedDate;
        this.productInfo = productInfo;
        this.option=option;
        this.CCategoryName= productInfo.getCategory().getCCategoryName();
        this.opOptionName=option.getOpOptionName();
    }
}

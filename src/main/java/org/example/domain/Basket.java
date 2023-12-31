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
@Data //@Getter
@Entity
public class Basket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "b_code", columnDefinition = "integer", nullable = false)
    private int BCode;

    @Column(name = "b_count", columnDefinition = "integer", nullable = false)
    private int BCount; // 장바구니 상품 개수

    @ManyToOne
    @JoinColumn(name = "mCode", referencedColumnName = "m_code", nullable = false)
    private Member member; // Foreign Key(1) 회원 코드

//    @ManyToOne
//    @JoinColumn(name = "pCode", referencedColumnName = "p_code", nullable = false)
//    private ProductInfo productInfo; // Foreign Key(2) 상품 코드

    @ManyToOne
    @JoinColumn(name="opCode",referencedColumnName = "op_code",nullable = false)
    private Option option;

    @Builder
    public Basket(int bCode, int bCount, Member member,Option option) {
//        ProductInfo productInfo
        this.BCode = bCode;
        this.BCount = bCount;
        this.member = member;
//        this.productInfo = productInfo;
        this.option=option;
    }
}

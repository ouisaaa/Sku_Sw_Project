/*
package org.example.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
public class Seller { // 판매자 테이블
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "text", nullable = false)
    private String sCode; // Primary Key

    @Column(columnDefinition = "text", nullable = false)
    private String sName; // 판매자 상호명

    @Column(columnDefinition = "text", nullable = false)
    private String sBank; // 판매자 통장 번호

    @Builder
    public Seller(String sCode, String sName, String sBank) {
        this.sCode = sCode;
        this.sName = sName;
        this.sBank = sBank;
    }
}
*/

/*
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
public class Delivery { // 회원 주소 테이블
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "text", nullable = false)
    private String mCode; // Primary key, Foreign Key

    @Column(columnDefinition = "text", nullable = false)
    private String dAddname; // 배송지명 (ex 우리집..)

    @Column(columnDefinition = "text", nullable = false)
    private String dAddress; // 배송지 주소

    @Column(columnDefinition = "text", nullable = false)
    private String dAdddetail; // 배송지 상세주소 (동, 호수)

    @Column(columnDefinition = "text", nullable = false)
    private String dPhoneNum; // 전화번호

    @ManyToOne
    @JoinColumn(name = "mCode", referencedColumnName = "mCode", nullable = false)
    private Member member; // Foreign Key

    @Builder
    public Delivery(String mCode, String dAddname, String dAddress, String dAdddetail, String dPhoneNum, Member member) {
        this.mCode = mCode;
        this.dAddname = dAddname;
        this.dAddress = dAddress;
        this.dAdddetail = dAdddetail;
        this.dPhoneNum = dPhoneNum;
        this.member = member;
    }
}
*/

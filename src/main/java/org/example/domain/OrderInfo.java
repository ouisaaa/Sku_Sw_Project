package org.example.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
public class OrderInfo { // 주문 테이블
    @Id
    @Column(name = "o_code", columnDefinition = "integer", nullable = false)
    private int OCode; // Primary Key

    @Column(name = "o_total_price", columnDefinition = "integer", nullable = false)
    private int OTotalprice; // 총 가격

    @Column(name = "o_zip_code", columnDefinition = "text", nullable = false)
    private String OZipcode; // 우편번호

    @Column(name = "o_address", columnDefinition = "text", nullable = false)
    private String OAddress; // 배송지

    @Column(name = "o_phone_num", columnDefinition = "text", nullable = false)
    private String OPhoneNum; // 전화번호(멤버에도 있지만 또 있는 이유 : 내가 아닌 다른분이 받아야 할 경우)

    @Column(name = "o_request", columnDefinition = "text", nullable = false)
    private String ORequest; // 요청사항

    @Column(name = "o_date", columnDefinition = "text", nullable = false)
    private String ODate; // 주문 일자

    @OneToOne
    @JoinColumn(name = "mCode", referencedColumnName = "m_code")
    private Member member; // Foreign key

    @Builder
    public OrderInfo(int oCode, int oTotalprice, String oZipcode, String oAddress, String oPhoneNum, String oRequest, String oDate, Member member) {
        this.OCode = oCode;
        this.OTotalprice = oTotalprice;
        this.OZipcode = oZipcode;
        this.OAddress = oAddress;
        this.OPhoneNum = oPhoneNum;
        this.ORequest = oRequest;
        this.ODate = oDate;
        this.member = member;
    }
}

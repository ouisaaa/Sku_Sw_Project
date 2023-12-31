package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.domain.Member;
import org.example.domain.OrderInfo;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderInfoDTO {
    private int OCode; // Primary Key
    private int OTotalprice; // 총 가격
    private String OZipcode; // 우편번호
    private String OAddress; // 배송지
    private String OPhoneNum; // 전화번호(멤버에도 있지만 또 있는 이유 : 내가 아닌 다른분이 받아야 할 경우)
    private String ORequest; // 요청사항
    private String ODate; // 주문 일자
    private Member member=new Member(); // Foreign key

    public void setMember(int mcode) {
        member.setMCode(mcode);
    }
    public OrderInfo toEntity(){
        return OrderInfo.builder()
                .oCode(OCode)
                .oTotalprice(OTotalprice)
                .oZipcode(OZipcode)
                .oAddress(OAddress)
                .oPhoneNum(OPhoneNum)
                .oRequest(ORequest)
                .oDate(ODate)
                .member(member)
                .build();
    }
}

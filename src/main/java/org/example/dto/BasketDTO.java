package org.example.dto;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.domain.Basket;
import org.example.domain.Member;
import org.example.domain.Option;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BasketDTO {
    private int BCode;
    private int BCount; // 장바구니 상품 개수
    private Member member=new Member(); // Foreign Key(1) 회원 코드
    private Option option= new Option();

    public void setMember(int mCode){
        member.setMCode(mCode);
    }
    public void setOption(int opCode){
        option.setOpCode(opCode);
    }

    public Basket toEntity(){
        return Basket.builder()
                .bCode(BCode)
                .bCount(BCount)
                .member(member)
                .option(option)
                .build();
    }
}

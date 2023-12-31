package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.domain.Member;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MemberDTO {
    private int m_code; // Primary key - mCode > MCode 바꾼 이유 : 이래야 repository가 And, Or 같은 연산 할 때 읽더라
    private String m_id; // 회원 ID

    public Member toEntitry(){
        return Member.builder()
                .mCode(m_code)
                .mId(m_id)
                .build();
    }
}

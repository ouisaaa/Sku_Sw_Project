package org.example.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data // getter, setter 를 다 포함
@Entity
public class Member { // 회원 테이블
    //@GeneratedValue(strategy = GenerationType.IDENTITY) -> 자동 생성태그 auto_increment
    @Id
    @Column(name = "m_code", columnDefinition = "integer", nullable = false)
    // hibernate 가 스네이크 방식으로 읽어오기 때문에 name = "" 에다가 스네이크 방식으로 다시 선언 해줘야함
    private int MCode; // Primary key - mCode > MCode 바꾼 이유 : 이래야 repository가 And, Or 같은 연산 할 때 읽더라

    @Column(name = "m_id", columnDefinition = "text", nullable = false)
    private String MId; // 회원 ID

    @Column(name = "m_pw", columnDefinition = "text", nullable = false)
    private String MPw; // 회원 PW

    @Column(name = "m_name", columnDefinition = "text", nullable = false)
    private String MName; // 회원 이름

    @Builder
    public Member(int mCode, String mId) {
        this.MCode = mCode;
        this.MId = mId;
    }

}

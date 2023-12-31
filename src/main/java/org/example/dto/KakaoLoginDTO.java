package org.example.dto;

public class KakaoLoginDTO {
    private String kakaoUserId; // Kakao에서 제공하는 유저 고유 식별자
    private String nickname; // Kakao 로그인 사용자의 닉네임
    private String email; // Kakao 로그인 사용자의 이메일
    private String mPw; // Kakao 사용자의 비밀번호

    // 생성자, Getter, Setter, toString 등 필요한 메소드 추가
    public KakaoLoginDTO() {
        // 기본 생성자
    }

    public KakaoLoginDTO(String kakaoUserId, String nickname, String email, String mPw) {
        this.kakaoUserId = kakaoUserId;
        this.nickname = nickname;
        this.email = email;
        this.mPw = mPw;
    }

    public String getKakaoUserId() {
        return kakaoUserId;
    }
    public void setKakaoUserId(String kakaoUserId) {
        this.kakaoUserId = kakaoUserId;
    }

    public String getNickname() {
        return nickname;
    }
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getMPw() {
        return mPw;
    }
    public void setMPw(String mPw) {
        this.mPw = mPw;
    }

    @Override
    public String toString() {
        return "KakaoLoginDTO{" +
                "kakaoUserId='" + kakaoUserId + '\'' +
                ", nickname='" + nickname + '\'' +
                ", email='" + email + '\'' +
                ", mPw='" + mPw + '\'' +
                '}';
    }
}
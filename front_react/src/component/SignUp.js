import styles from '../public/css/Login.module.css';
import { useState, useRef } from 'react';

import { dataDomain } from "./common";


export default function SignUp() {
    /**분류 true: 일반 고객 false: 판매자 고객*/
    const [classification, setClassification] = useState(true);

    function changeClassification(event) {
        event.target.textContent === "일반고객" ? setClassification(true) : setClassification(false);
        console.log(changeClassification)
    }

    /**회원 가입 정보란 */
    const idRef = useRef(null);             // id 
    const passwordRef = useRef(null);       // password
    const passwordCheckRef = useRef(null);  // passwordCheck
    const emailRef = useRef(null);          // email
    const nameRef = useRef(null);           // name
    const SellerNumberRef = useRef(null);   // seller
    const phoneRef = useRef(null);          // phone
    const genderRef = useRef(null);         // gender
    const snameRef = useRef(null);          // sname
    const bankNumberRef = useRef(null);     // 계좌번호
    /**아이디 검색 */
    const [searchResult, setSearchResult] = useState(""); // 아이디 중복 검색 결과

    function idChecking() {
        const checkID = idRef.current.value;

        fetch(`${dataDomain}/member?m_id=${checkID}`)
            .then(res => {
                return res.json();
            }).then(data => {
                if (data.length === 0) {
                    alert("생성 가능")
                    setSearchResult("생성 가능");
                } else {
                    alert("생성 불가능")
                    setSearchResult("생성 불가능");
                }
            });
    }
    /**사업자 번호 검색 */
    function scodeChecking() {
        const checkScode = SellerNumberRef.current.value;

        fetch(`${dataDomain}/seller?s_code=${checkScode}`)
            .then(res => {
                return res.json();
            }).then(data => {
                if (data.length === 0) {
                    alert("생성 가능")
                } else {
                    alert("생성 불가능")
                }
            });
    }
    /**비밀번호 확인 */
    const [passwordCheckingMessage, setPasswordCheckingMessage] = useState("");
    function checkingPassword() {
        const str = passwordRef.current.value === passwordCheckRef.current.value ? "같습니다." : "다릅니다."
        console.log(str);
        setPasswordCheckingMessage(str);
    }

    /**회원 가입 요청 */
    function signUpRequest() {

        const memberInformation = classification === true ? {
            "id"        : "fkaenlkaaef",
            "m_code"    : "",
            "m_name"    : nameRef.current.value,
            "m_id"      : idRef.current.value,
            "m_pw"      : passwordRef.current.value,
            "m_gender"  : genderRef.current.value,
            "m_email"   : emailRef.current.value,
            "m_phoneNum": phoneRef.current.value
        } : [{
            "m_code"    : "",
            "m_name"    : nameRef.current.value,
            "m_id"      : idRef.current.value,
            "m_pw"      : passwordRef.current.value,
            "m_gender"  : genderRef.current.value,
            "m_email"   : emailRef.current.value,
            "m_phoneNum": phoneRef.current.value
        }, {
            "s_code": SellerNumberRef.current.value,
            "s_name": snameRef.current.value,
            "s_bank": bankNumberRef.current.value
        }]
        classification === true ?
            fetch(`${dataDomain}/member?m_name=${memberInformation.m_name}}`,
                {
                    method: "Post",
                    headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(memberInformation)
                }
            )
                .then(res => {
                    if (res.ok) {
                        alert("등록");
                        window.location.reload();
                    }
                })
            :
            fetch(`${dataDomain}/member?m_name=${memberInformation[0].m_name}}`,
                {
                    method: "Post",
                    headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(memberInformation)
                }
            )
                .then(res => {
                    if (res.ok) {
                        alert("등록");
                        window.location.reload();
                    }
                })
    }

    return (
        <>
            <div className={styles.background}>
                <div className={styles.box}>
                    <h1>SignUp</h1>
                    {classification === true ? (
                        <>
                            <span>
                                <button onClick={changeClassification}>일반고객</button>
                                <button onClick={changeClassification}>사업자고객</button>
                            </span>
                            <div>
                                <p>아이디</p>
                                <span>
                                    <input type="text" ref={idRef} />
                                    <input type="button" value="중복확인" onClick={idChecking} />
                                    <p>{searchResult}</p>
                                </span>
                            </div>
                            <div>
                                <p>비밀번호</p>
                                <input type="password" ref={passwordRef} onChange={checkingPassword} />
                            </div>
                            <div>
                                <p>비밀번호 확인</p>
                                <input type="password" ref={passwordCheckRef} onChange={checkingPassword} />
                                <p>{passwordCheckingMessage}</p>
                            </div>
                            <div>
                                <p>이름</p>
                                <input type="text" ref={nameRef} />
                            </div>
                            <div>
                                <p>이메일</p>
                                <input type="text" ref={emailRef} />
                            </div>
                            <div>
                                <p>전화번호</p>
                                <input type="tel" pattern="[0-9+-()]*" ref={phoneRef} />
                            </div>
                            <div>
                                <p>성별</p>
                                <label>남자</label><input type="radio" name={"gender"} value={"남자"} ref={genderRef} />
                                <label>여자</label><input type="radio" name={"gender"} value={"여자"} ref={genderRef} />
                            </div>
                        </>
                    ) : (
                        <>
                            <span>
                                <button onClick={changeClassification}>일반고객</button>
                                <button onClick={changeClassification}>사업자고객</button>
                            </span>
                            <div>
                                <p>사업자 번호</p>
                                <input type='text' ref={SellerNumberRef}></input>
                                <input type="button" value="중복확인" onClick={scodeChecking} />
                            </div>
                            <div>
                                <p>아이디</p>
                                <span>
                                    <input type="text" ref={idRef} />
                                    <input type="button" value="중복확인" onClick={idChecking} />
                                </span>
                            </div>
                            <div>
                                <p>비밀번호</p>
                                <input type="password" ref={passwordRef} onChange={checkingPassword} />
                            </div>
                            <div>
                                <p>비밀번호 확인</p>
                                <span>
                                    <input type="password" ref={passwordCheckRef} onChange={checkingPassword} />
                                    <p>{passwordCheckingMessage}</p>
                                </span>
                            </div>
                            <div>
                                <p>대표자명</p>
                                <input type="text" ref={nameRef} />
                            </div>
                            <div>
                                <p>상호명</p>
                                <input type="text" ref={snameRef} />
                            </div>
                            <div>
                                <p>이메일</p>
                                <input type="text" ref={emailRef} />
                            </div>
                            <div>
                                <p>전화번호</p>
                                <input type="tel" pattern="[0-9+-()]*" ref={phoneRef} />
                            </div>
                            <div>
                                <p>성별</p>
                                <label>남자</label><input type="radio" name={"gender"} value={"남자"} ref={genderRef} />
                                <label>여자</label><input type="radio" name={"gender"} value={"여자"} ref={genderRef} />
                            </div>
                            <div>
                                <p>계좌</p>
                                <input type="text" ref={bankNumberRef} value={"미구현"} />
                            </div>
                        </>
                    )
                    }
                    <hr></hr>
                    <div>
                        <span>
                            <input type="button" value="GGG" />
                            <input type="button" value="KKK" />
                        </span>
                    </div>
                    <br></br>
                    <div>
                        <div>
                            <input type="button" value="회원가입" onClick={signUpRequest} />
                        </div>
                        <div>
                            <input type="button" value="취소" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
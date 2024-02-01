import { useNavigate } from 'react-router-dom';
import styles from '../public/css/Login.module.css';
import { useRef, useState, } from 'react';
import { dataDomain } from "./common";

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

export default function Login() {

    /**로그인 시도 */
    const idRef = useRef(null);
    const passwordRef = useRef(null);

    const navigate = useNavigate();

    function access_login() {
        // fetch(`${dataDomain}/login?id=${idRef.current.value}&password=${passwordRef.current.value}`)
        fetch(`${dataDomain}/member/login?id=${idRef.current.value}&password=${passwordRef.current.value}`)
            .then(res => {
                console.log(res);
                if (res.status == 400) {
                    return 0;
                }
                return res.json()
            })
            .then(data => {
                //console.log(data)
                if (data == 0) {
                    alert("로그인 실패")
                    window.location.reload();
                } else {
                    //로그인 성공시 간단한 인증들을 보여주기 위해 jwt대신 쿠키에 회원 아이디를 저장하여 로그인이 필요한 정보들을 접근시
                    //쿠키를 이용하여 인증
                    console.log(data);
                    const cookieId = data.mcode;
                    document.cookie = `m_code=${cookieId};path=/`;
                    if (cookieId == 0) {
                        navigate('/seller');
                    } else {
                        navigate('/'); //navigate('/main/후드티');
                    }

                }

            })
    }
    return (
        <>
            <div className={styles.background}>
                <div className={styles.box}>
                    <h1>login</h1>
                    <div>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="ID"
                            className="mb-3"
                        ><Form.Control type="text" ref={idRef} /> </FloatingLabel>
                    </div>
                    <div>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control type="password" ref={passwordRef} />
                        </FloatingLabel>
                    </div>
                    <hr></hr>
                    <div>
                        <div>
                            <Button onClick={access_login}>로그인</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
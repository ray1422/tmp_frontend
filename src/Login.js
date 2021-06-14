import Cookies from 'js-cookie';
import { useState } from 'react';
import { Navbar, Nav, Card, Button, Modal, Form } from 'react-bootstrap'

let jwt_access = Cookies.get('jwt_access')
let jwt_refresh = Cookies.get("jwt_refresh")
export function getAccess() {
    if (!jwt_access) return null
    return jwt_access
}
export async function refreshJWT() {
    let p = await fetch("/api/token/refresh/", {
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            refresh: jwt_refresh
        })
    })
    if (p.ok == true) {
        let obj = await p.json()
        jwt_access = obj.access
        Cookies.set("jwt_access", jwt_access)
        return jwt_access

    } else {
        return null;
    }
}

export async function login(username, password) {
    let p = await fetch("/api/token/", {
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    if (p.ok == true) {
        let obj = await p.json()
        console.log(obj)
        jwt_access = obj.access
        jwt_refresh = obj.refresh
        Cookies.set("jwt_access", jwt_access)
        Cookies.set("jwt_refresh", jwt_refresh)
        return jwt_access

    } else {
        console.log(p)
        return null;
    }
}

function LoginModal(props) {
    const [show, setShow] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <>
            <Button type="button" onClick={
                (e) => {
                    setShow(true)
                }
            }>登入</Button>
            <Modal show={show} onHide={() => { setShow(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>登入</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        value={username}
                        as="input"
                        type="text"
                        placeholder="username"
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                    />
                    <Form.Control
                        value={password}
                        as="input"
                        type="password"
                        placeholder="password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShow(false) }}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={() => {
                        // login
                        login(username, password).then((result) => {
                            if (!result) {
                                alert("login fail!")
                            } else {
                                props.setLoggedIn(true)
                                setShow(false)
                            }
                        })
                    }}>
                        送出
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default LoginModal
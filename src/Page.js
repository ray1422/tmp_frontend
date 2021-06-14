import React, { useState, useEffect } from 'react'
import Comments from "./Comments"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav, Card, Button, Modal, Form } from 'react-bootstrap'
import LoginModal from "./Login"
import { getAccess, refreshJWT } from './Login'

function Page(porps) {
    const [loggedIn, setLoggedIn] = useState(-1)
    const [createCmtShow, setCreateCmtShow] = useState(false);
    const [inpCmt, setInpCmt] = useState("")
    const [comments, setComments] = useState([{
        author: { id: -2, username: "admin" },
        content: "載入中，請稍後...",
        created_at: "",
        id: -2
    }])
    const fetch_comments = () => {
        fetch("/api/comment/").then((e) => {
            return e.json()
        }).then((data) => {
            setComments(data)
            console.log(data)
        })
    }
    useEffect(() => {
        // 判斷登入
        if (!getAccess()) {
            setLoggedIn(false)
        } else {
            refreshJWT().then((access) => {
                if (access == null) {
                    setLoggedIn(false)
                } else {
                    setLoggedIn(true)
                }
            })
        }
        fetch_comments()
    }, [])
    let btn;
    console.log(loggedIn)
    switch (loggedIn) {
        case -1:
            btn = <></>
            break
        case true:
            btn = (<Button type="button" onClick={
                (e) => {
                    setCreateCmtShow(true)
                }
            }>新增留言</Button>)
            break
        case false:
            btn = <LoginModal setLoggedIn={setLoggedIn} />
            break
    }
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Nav className="mr-auto">
                    <Navbar.Brand href="#home">
                        Yet Another Homepage
                    </Navbar.Brand>
                </Nav>
                {btn}
            </Navbar>
            <Comments comments={comments} />
            <Modal show={createCmtShow} onHide={() => { setCreateCmtShow(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>新增留言</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        value={inpCmt}
                        as="textarea"
                        placeholder="寫點什麼..."
                        style={{ height: '200px' }}
                        onChange={(e) => {
                            setInpCmt(e.target.value)
                        }}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setCreateCmtShow(false) }}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={() => {
                        fetch("/api/comment/", {
                            method: "POST",
                            headers: {
                                'user-agent': 'Mozilla/4.0 MDN Example',
                                'content-type': 'application/json',
                                'Authorization': `Bearer ${getAccess()}`
                            },
                            body: JSON.stringify({
                                "content": inpCmt
                            })
                        }).then((p) => {
                            if (p.ok) {
                                setCreateCmtShow(false)
                                fetch_comments()
                            } else {
                                alert("something went wrong!")
                                console.log(p)
                            }
                            return p.json()
                        }).then((p) => {
                        })
                    }}>
                        送出
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    )
}
export default Page
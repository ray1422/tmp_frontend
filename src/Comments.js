import React, {useEffect, useState} from 'react'

import { Navbar, Card, Button } from 'react-bootstrap'

function Comments(props) {
    const comments = props.comments
    return (<>
        {comments.map((u, key) => (
            <Card key={key}>
                <Card.Body>{u.content}</Card.Body>
            </Card>
        ))}
    </>)
}
export default Comments
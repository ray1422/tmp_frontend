import react from 'react'
export let a = 100
let b = 30
function Input(props) {
    return <input type="text" onChange={props.onChange} />
}
export default Input
import react, {useState} from 'react'
import Input from "./Input"
function Echo(props) {
    const [txt, setTxt] = useState("")
    const inpChange = (event) => {
        console.log(event.target.value)
        setTxt(event.target.value)
    }
    return (
    <>
        <div> {txt} </div>
        <Input onChange={inpChange} />
    </>)
}
export default Echo
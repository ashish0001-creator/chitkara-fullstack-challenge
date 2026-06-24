
import {useState} from 'react';
import axios from 'axios';
export default function App(){
 const [txt,setTxt]=useState("A->B,A->C,B->D");
 const [res,setRes]=useState(null);
 const submit=async()=>{
   const r=await axios.post('http://localhost:3000/bfhl',{data:txt.split(',')});
   setRes(r.data);
 };
 return <div style={{padding:20}}>
 <h1>BFHL Challenge</h1>
 <textarea rows="6" cols="50" value={txt} onChange={e=>setTxt(e.target.value)}/><br/>
 <button onClick={submit}>Submit</button>
 <pre>{JSON.stringify(res,null,2)}</pre>
 </div>
}

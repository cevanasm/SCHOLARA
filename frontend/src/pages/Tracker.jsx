import { useState } from "react";
export default function Tracker(){
  const [items,setItems]=useState(()=>JSON.parse(localStorage.getItem("tracker")||"[]"));
  const [title,setTitle]=useState("");
  function add(e){e.preventDefault();if(!title.trim())return;const next=[...items,{title,status:"Applied"}];setItems(next);localStorage.setItem("tracker",JSON.stringify(next));setTitle("")}
  return <main className="page narrow"><div className="page-head"><span className="eyebrow">APPLICATION TRACKER</span><h1>Track your applications.</h1></div><form className="search" onSubmit={add}><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Opportunity name"/><button className="btn primary">Add</button></form><div className="tracker">{items.map((x,i)=><div className="tracker-row" key={i}><strong>{x.title}</strong><span>{x.status}</span></div>)}</div></main>
}

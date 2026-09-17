import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOpportunity } from "../api";

export default function Saved() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("saved") || "[]");
    Promise.all(ids.map(id => getOpportunity(id).catch(() => null))).then(x => setItems(x.filter(Boolean)));
  }, []);
  function remove(id) {
    const ids = JSON.parse(localStorage.getItem("saved") || "[]").filter(x => x !== id);
    localStorage.setItem("saved", JSON.stringify(ids));
    setItems(items.filter(x => x.id !== id));
  }
  return <main className="page">
    <div className="page-head"><span className="eyebrow">YOUR LIST</span><h1>Saved opportunities</h1><p>Keep opportunities you want to revisit in one place.</p></div>
    {items.length ? <div className="cards">{items.map(item => <article className="op-card" key={item.id}>
      <div className="card-top"><span className="pill">{item.kind}</span>{item.verified && <span className="verified">✓ Verified source</span>}</div>
      <h3>{item.title}</h3><p className="org">{item.organization}</p><p className="deadline">Deadline: {item.deadline || "See official source"}</p>
      <div className="card-actions"><Link className="btn small primary" to={`/opportunity/${item.id}`}>View details</Link><button className="btn small ghost" onClick={() => remove(item.id)}>Remove</button></div>
    </article>)}</div>
    : <div className="empty"><h2>No saved opportunities yet</h2><p>Open an internship or scholarship and tap Save.</p><Link className="btn primary" to="/discover?kind=internship">Browse internships →</Link></div>}
  </main>;
}

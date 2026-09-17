import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initial = JSON.parse(localStorage.getItem("student") || "null") || {
  name:"", email:"", degree:"B.Tech", department:"", year:"", graduation_year:"",
  cgpa:"", skills:"", interests:"", state:"", country:"India", annual_income:"", category:""
};

export default function Profile() {
  const [form, setForm] = useState(initial);
  const nav = useNavigate();
  function update(k,v){ setForm({...form,[k]:v}); }
  function submit(e){
    e.preventDefault();
    localStorage.setItem("student", JSON.stringify(form));
    alert("Profile saved. SCHOLARA can now match opportunities to you.");
    nav("/discover?kind=internship");
  }
  return (
    <main className="page narrow">
      <div className="page-head"><span className="eyebrow">STUDENT PROFILE</span><h1>Tell SCHOLARA about you.</h1><p>This information is stored locally in this MVP and is used for matching.</p></div>
      <form className="form-grid" onSubmit={submit}>
        {[
          ["name","Full name","text"],["email","Email","email"],["degree","Degree","text"],["department","Department / Branch","text"],
          ["year","Current year","number"],["graduation_year","Graduation year","number"],["cgpa","CGPA","number"],["state","State / UT","text"],
          ["country","Country","text"],["annual_income","Annual family income (₹)","number"],["category","Category (optional)","text"]
        ].map(([k,l,t]) => <label key={k}>{l}<input type={t} value={form[k] || ""} onChange={e=>update(k,e.target.value)} /></label>)}
        <label className="full">Skills<input value={form.skills} onChange={e=>update("skills",e.target.value)} placeholder="Python, C, Java, HTML, CSS" /></label>
        <label className="full">Interests<input value={form.interests} onChange={e=>update("interests",e.target.value)} placeholder="Software development, AI, data science" /></label>
        <button className="btn primary full">Save Profile & Find Matches →</button>
      </form>
    </main>
  );
}

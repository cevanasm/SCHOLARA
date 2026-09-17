import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOpportunity, matchOpportunities } from "../api";

export default function OpportunityDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    getOpportunity(id).then(setItem).catch(() => setItem({error:true}));
    const student = JSON.parse(localStorage.getItem("student") || "null");
    if (student) matchOpportunities(student, "internship").then(list => {
      const found = list.find(x => String(x.id) === String(id));
      if (found) setMatch(found);
    }).catch(() => {});
  }, [id]);

  if (!item) return <main className="page"><div className="loading">Loading opportunity...</div></main>;
  if (item.error) return <main className="page"><div className="empty"><h2>Opportunity not found</h2><Link className="btn primary" to="/discover?kind=internship">Back to opportunities</Link></div></main>;

  return <main className="page narrow">
    <Link to={`/discover?kind=${item.kind}`} className="back">← Back to {item.kind}s</Link>
    <article className="detail">
      <div className="card-top"><span className="pill">{item.kind}</span>{item.verified && <span className="verified">✓ Verified source</span>}</div>
      <h1>{item.title}</h1><p className="org">{item.organization}</p>
      <div className="meta large">
        {item.location && <span>⌖ {item.location}</span>}
        {item.remote && <span>⌁ Remote</span>}
        {item.duration && <span>◷ {item.duration}</span>}
        {item.amount_or_stipend && <span>◆ {item.amount_or_stipend}</span>}
      </div>
      {match && <div className="match"><strong>{match.score}% profile match</strong>{match.eligible ? <span className="good">Currently eligible based on the information you entered.</span> : <span className="warn">Some requirements still need attention.</span>}{match.gaps?.length > 0 && <span>Skill/eligibility gaps: {match.gaps.join(", ")}</span>}</div>}
      <h3>About this opportunity</h3><p>{item.description}</p>
      <h3>Eligibility</h3><p>{item.eligibility || "See the official source for the current eligibility rules."}</p>
      {item.required_skills && <><h3>Required skills</h3><p>{item.required_skills}</p></>}
      {item.documents && <><h3>Documents</h3><p>{item.documents}</p></>}
      <h3>Deadline</h3><p>{item.deadline || "See official source"}</p>
      <div className="source-box"><strong>Source:</strong> {item.source}<br/><small>Requirements, deadlines and availability may change. Check the official source immediately before applying.</small></div>
      <a className="btn primary" href={item.official_url} target="_blank" rel="noopener noreferrer">Open Official Source →</a>
    </article>
  </main>;
}

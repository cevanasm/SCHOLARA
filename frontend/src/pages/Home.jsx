import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="eyebrow">AI-POWERED OPPORTUNITY DISCOVERY</div>
          <h1>Find opportunities<br /><em>made for you.</em></h1>
          <p>
            Discover internships and scholarships, understand your eligibility,
            see your skill gaps, and apply through official sources.
          </p>
          <div className="actions">
            <Link className="btn primary" to="/discover?kind=internship">Find an Internship →</Link>
            <Link className="btn ghost" to="/discover?kind=scholarship">Find a Scholarship</Link>
          </div>
          <div className="trust-row">
            <span>✓ Verified-source records</span>
            <span>✓ Eligibility matching</span>
            <span>✓ Mobile friendly</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div><span className="eyebrow">ONE STUDENT DASHBOARD</span><h2>Everything in one place.</h2></div>
        </div>
        <div className="feature-grid">
          {[
            ["01","PERSONAL MATCHING","Compare your degree, CGPA, skills and profile against opportunity requirements."],
            ["02","SKILL GAP","See missing skills and what to learn before applying."],
            ["03","OFFICIAL LINKS","Open the original opportunity source instead of relying on copied application pages."],
            ["04","APPLICATION TRACKER","Keep your saved and applied opportunities organized."]
          ].map(x => (
            <article className="feature" key={x[0]}>
              <span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta">
        <span className="eyebrow">START WITH YOUR PROFILE</span>
        <h2>The better your profile, the better the matching.</h2>
        <Link className="btn primary" to="/profile">Create My Student Profile →</Link>
      </section>
    </main>
  );
}

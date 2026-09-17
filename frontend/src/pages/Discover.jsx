import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { matchOpportunities } from "../api";

export default function Discover() {
  const [searchParams] = useSearchParams();

  const [kind, setKind] = useState(
    searchParams.get("kind") || "internship"
  );

  const [student, setStudent] = useState({
    name: "",
    degree: "",
    department: "",
    year: "",
    graduation_year: "",
    cgpa: "",
    annual_income: "",
    category: "",
    state: "",
    country: "India",
    skills: "",
    interests: "",
    preferred_location: "",
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("scholara_student_profile");

    if (saved) {
      try {
        setStudent(JSON.parse(saved));
      } catch {
        localStorage.removeItem("scholara_student_profile");
      }
    }
  }, []);

  useEffect(() => {
    const currentKind = searchParams.get("kind") || "internship";
    setKind(currentKind);
    setResults(null);
  }, [searchParams]);

  const updateField = (field, value) => {
    setStudent((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const findMatches = async () => {
    setError("");
    setLoading(true);

    localStorage.setItem(
      "scholara_student_profile",
      JSON.stringify(student)
    );

    try {
      const response = await matchOpportunities(student, kind);
      setResults(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to SCHOLARA backend. Make sure the backend is running on port 8000."
      );

      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page discover-page">

      <section className="page-header">
        <span className="eyebrow">SCHOLARA AI MATCH</span>

        <h1>Find opportunities that actually match you.</h1>

        <p>
          Enter your academic details, skills and preferences.
          SCHOLARA compares your profile with opportunity
          requirements and explains why each opportunity matches.
        </p>
      </section>

      <div className="switcher">

        <button
          type="button"
          className={kind === "internship" ? "active" : ""}
          onClick={() => {
            setKind("internship");
            setResults(null);
          }}
        >
          💼 Internships
        </button>

        <button
          type="button"
          className={kind === "scholarship" ? "active" : ""}
          onClick={() => {
            setKind("scholarship");
            setResults(null);
          }}
        >
          🎓 Scholarships
        </button>

      </div>

      <section className="profile-card">

        <div className="profile-card-heading">

          <span className="eyebrow">YOUR PROFILE</span>

          <h2>Tell SCHOLARA about you</h2>

          <p>
            The more information you provide, the more useful
            your matching results will be.
          </p>

        </div>

        <div className="form-grid">

          <label>
            Full name
            <input
              type="text"
              placeholder="e.g. Aniska K"
              value={student.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
            />
          </label>

          <label>
            Degree
            <input
              type="text"
              placeholder="e.g. BTech IT"
              value={student.degree}
              onChange={(e) =>
                updateField("degree", e.target.value)
              }
            />
          </label>

          <label>
            Department
            <input
              type="text"
              placeholder="e.g. Information Technology"
              value={student.department}
              onChange={(e) =>
                updateField("department", e.target.value)
              }
            />
          </label>

          <label>
            Current year
            <input
              type="text"
              placeholder="e.g. 2"
              value={student.year}
              onChange={(e) =>
                updateField("year", e.target.value)
              }
            />
          </label>

          <label>
            Graduation year
            <input
              type="text"
              placeholder="e.g. 2028"
              value={student.graduation_year}
              onChange={(e) =>
                updateField("graduation_year", e.target.value)
              }
            />
          </label>

          <label>
            CGPA
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g. 9.2"
              value={student.cgpa}
              onChange={(e) =>
                updateField("cgpa", e.target.value)
              }
            />
          </label>

          <label>
            Annual family income ₹
            <input
              type="number"
              min="0"
              placeholder="e.g. 300000"
              value={student.annual_income}
              onChange={(e) =>
                updateField("annual_income", e.target.value)
              }
            />
          </label>

          <label>
            Category
            <input
              type="text"
              placeholder="General / OBC / SC / ST"
              value={student.category}
              onChange={(e) =>
                updateField("category", e.target.value)
              }
            />
          </label>

          <label>
            State / UT
            <input
              type="text"
              placeholder="e.g. Tamil Nadu"
              value={student.state}
              onChange={(e) =>
                updateField("state", e.target.value)
              }
            />
          </label>

          <label>
            Country
            <input
              type="text"
              placeholder="India"
              value={student.country}
              onChange={(e) =>
                updateField("country", e.target.value)
              }
            />
          </label>

          <label className="wide">
            Skills
            <input
              type="text"
              placeholder="e.g. Python, C, C++, Java, HTML, CSS"
              value={student.skills}
              onChange={(e) =>
                updateField("skills", e.target.value)
              }
            />
          </label>

          <label className="wide">
            Interests
            <input
              type="text"
              placeholder="e.g. AI, Web Development, Data Science"
              value={student.interests}
              onChange={(e) =>
                updateField("interests", e.target.value)
              }
            />
          </label>

          <label className="wide">
            Preferred location
            <input
              type="text"
              placeholder="e.g. Chennai / Remote / India"
              value={student.preferred_location}
              onChange={(e) =>
                updateField("preferred_location", e.target.value)
              }
            />
          </label>

        </div>

        {error && (
          <div className="discover-error">
            ⚠️ {error}
          </div>
        )}

        <button
          type="button"
          className="primary-btn discover-btn"
          onClick={findMatches}
          disabled={loading}
        >
          {loading
            ? "🔎 Analysing your profile..."
            : `✨ Find My ${
                kind === "internship"
                  ? "Internships"
                  : "Scholarships"
              }`}
        </button>

      </section>

      {results && (
        <section className="results">

          <div className="results-heading">

            <div>
              <span className="eyebrow">
                PERSONALIZED RESULTS
              </span>

              <h2>Opportunities matched to you</h2>

              <p>
                SCHOLARA analysed your profile against the
                available {kind} opportunities.
              </p>
            </div>

            <div className="result-count">
              {results.total || 0} opportunities analysed
            </div>

          </div>

          <ResultSection
            title="🟢 Eligible for"
            description="Your profile currently satisfies the known requirements."
            items={results.eligible}
          />

          <ResultSection
            title="🟡 Close matches"
            description="You may become eligible after meeting the missing requirements."
            items={results.close_matches}
          />

          <ResultSection
            title="🔴 Not currently eligible"
            description="These opportunities have one or more known eligibility gaps."
            items={results.not_currently_eligible}
          />

        </section>
      )}

    </main>
  );
}

function ResultSection({ title, description, items = [] }) {
  return (
    <section className="result-section">

      <h3>{title}</h3>

      <p>{description}</p>

      {items.length === 0 ? (
        <div className="empty-result">
          No opportunities in this category.
        </div>
      ) : (
        <div className="opportunity-table-wrapper">

          <table className="opportunity-table">

            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Organization</th>
                <th>Match</th>
                <th>Status</th>
                <th>Why you match</th>
                <th>Requirements / gaps</th>
                <th>Deadline</th>
                <th>Find opportunity</th>
              </tr>
            </thead>

            <tbody>

              {items.map((item) => {

                const opportunity = item.opportunity;
                const match = item.match;

                return (
                  <tr key={opportunity.id}>

                    <td>
                      <Link
                        to={`/opportunity/${opportunity.id}`}
                        className="opportunity-title"
                      >
                        <strong>
                          {opportunity.title}
                        </strong>
                      </Link>

                      <small>
                        {opportunity.field || opportunity.kind}
                      </small>
                    </td>

                    <td>
                      {opportunity.organization}
                    </td>

                    <td>
                      <span className="match-score">
                        {match.score}%
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={match.status} />
                    </td>

                    <td>
                      {match.reasons?.length ? (
                        <ul>
                          {match.reasons
                            .slice(0, 4)
                            .map((reason, index) => (
                              <li key={index}>
                                {reason}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <span>
                          No matching reasons listed.
                        </span>
                      )}
                    </td>

                    <td>

                      {match.hard_failures?.length > 0 && (
                        <ul className="gap-list">
                          {match.hard_failures.map(
                            (gap, index) => (
                              <li key={index}>
                                {gap}
                              </li>
                            )
                          )}
                        </ul>
                      )}

                      {match.gaps?.length > 0 && (
                        <ul className="gap-list">
                          {match.gaps.map(
                            (gap, index) => (
                              <li key={index}>
                                {gap}
                              </li>
                            )
                          )}
                        </ul>
                      )}

                      {!match.gaps?.length &&
                        !match.hard_failures?.length && (
                          <span>
                            No major gap detected.
                          </span>
                        )}

                    </td>

                    <td>
                      {opportunity.deadline || "Not specified"}
                    </td>

                    <td>
                      {opportunity.official_url ? (
                      
                        <a
  href={`https://www.google.com/search?q=${encodeURIComponent(
    `${opportunity.title} ${opportunity.organization}`
  )}`}
  target="_blank"
  rel="noreferrer"
  className="official-link"
>
  Search on Google →
</a>
                      ) : (
                        <span>
                          Source unavailable
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}

function StatusBadge({ status }) {

  let className = "status not";

  if (status === "Eligible") {
    className = "status eligible";
  }

  if (status === "Close match") {
    className = "status close";
  }

  return (
    <span className={className}>
      {status}
    </span>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getOpportunity } from "../api";

const STORAGE_KEY = "scholara_applications";

const STATUS_OPTIONS = [
  "Planning",
  "Ready to Apply",
  "Applied",
  "Under Review",
  "Interview",
  "Selected",
  "Rejected",
  "Withdrawn",
];

const EMPTY_FORM = {
  title: "",
  organization: "",
  kind: "internship",
  status: "Planning",
  appliedDate: "",
  deadline: "",
  nextAction: "",
  followUpDate: "",
  officialUrl: "",
  notes: "",
};

export default function Tracker() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [savedOpportunities, setSavedOpportunities] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setApplications(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(applications)
    );
  }, [applications]);

  useEffect(() => {
    const savedIds = JSON.parse(
      localStorage.getItem("saved") || "[]"
    );

    Promise.all(
      savedIds.map((id) =>
        getOpportunity(id).catch(() => null)
      )
    ).then((items) => {
      setSavedOpportunities(items.filter(Boolean));
    });
  }, []);

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (application) => {
    setEditingId(application.id);

    setForm({
      title: application.title || "",
      organization: application.organization || "",
      kind: application.kind || "internship",
      status: application.status || "Planning",
      appliedDate: application.appliedDate || "",
      deadline: application.deadline || "",
      nextAction: application.nextAction || "",
      followUpDate: application.followUpDate || "",
      officialUrl: application.officialUrl || "",
      notes: application.notes || "",
    });

    setShowForm(true);
  };

  const saveApplication = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    if (editingId) {
      setApplications((previous) =>
        previous.map((application) =>
          application.id === editingId
            ? {
                ...application,
                ...form,
                updatedAt: new Date().toISOString(),
              }
            : application
        )
      );
    } else {
      const newApplication = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        ...form,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setApplications((previous) => [
        newApplication,
        ...previous,
      ]);
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const deleteApplication = (id) => {
    const confirmed = window.confirm(
      "Remove this application from your tracker?"
    );

    if (!confirmed) return;

    setApplications((previous) =>
      previous.filter(
        (application) => application.id !== id
      )
    );
  };

  const changeStatus = (id, status) => {
    setApplications((previous) =>
      previous.map((application) =>
        application.id === id
          ? {
              ...application,
              status,
              updatedAt: new Date().toISOString(),
            }
          : application
      )
    );
  };

  const addSavedOpportunity = (opportunity) => {
    const alreadyTracked = applications.some(
      (application) =>
        application.opportunityId === opportunity.id
    );

    if (alreadyTracked) {
      alert("This opportunity is already in your tracker.");
      return;
    }

    const newApplication = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      opportunityId: opportunity.id,
      title: opportunity.title || "",
      organization: opportunity.organization || "",
      kind: opportunity.kind || "internship",
      status: "Planning",
      appliedDate: "",
      deadline: opportunity.deadline || "",
      nextAction: "Review eligibility and application requirements",
      followUpDate: "",
      officialUrl: opportunity.official_url || "",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications((previous) => [
      newApplication,
      ...previous,
    ]);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        application.title
          ?.toLowerCase()
          .includes(searchText) ||
        application.organization
          ?.toLowerCase()
          .includes(searchText) ||
        application.nextAction
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        application.kind === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    applications,
    search,
    statusFilter,
    typeFilter,
  ]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter(
        (x) => x.status === "Applied"
      ).length,
      active: applications.filter((x) =>
        [
          "Applied",
          "Under Review",
          "Interview",
        ].includes(x.status)
      ).length,
      selected: applications.filter(
        (x) => x.status === "Selected"
      ).length,
    };
  }, [applications]);

  const today = new Date().toISOString().split("T")[0];

  const overdue = applications.filter(
    (application) =>
      application.followUpDate &&
      application.followUpDate < today &&
      !["Rejected", "Withdrawn", "Selected"].includes(
        application.status
      )
  );

  return (
    <main className="page tracker-page">

      <section className="tracker-hero">
        <div>
          <span className="eyebrow">
            APPLICATION MANAGEMENT
          </span>

          <h1>Track every application in one place.</h1>

          <p>
            Keep your applications, deadlines, follow-ups,
            status updates and notes organized so you always
            know what to do next.
          </p>
        </div>

        <button
          type="button"
          className="tracker-add-button"
          onClick={openAddForm}
        >
          + Add Application
        </button>
      </section>

      <section className="tracker-stats">

        <div className="tracker-stat">
          <span>Total Applications</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="tracker-stat">
          <span>Applied</span>
          <strong>{stats.applied}</strong>
        </div>

        <div className="tracker-stat">
          <span>Active</span>
          <strong>{stats.active}</strong>
        </div>

        <div className="tracker-stat">
          <span>Selected</span>
          <strong>{stats.selected}</strong>
        </div>

      </section>

      {overdue.length > 0 && (
        <section className="tracker-alert">

          <div className="tracker-alert-icon">
            !
          </div>

          <div>
            <strong>
              {overdue.length} follow-up
              {overdue.length > 1 ? "s" : ""} overdue
            </strong>

            <p>
              Check the applications below and follow up
              where necessary.
            </p>
          </div>

        </section>
      )}

      {showForm && (
        <section className="tracker-form-card">

          <div className="tracker-form-header">
            <div>
              <span className="eyebrow">
                {editingId
                  ? "UPDATE APPLICATION"
                  : "NEW APPLICATION"}
              </span>

              <h2>
                {editingId
                  ? "Update application"
                  : "Add an application"}
              </h2>
            </div>

            <button
              type="button"
              className="tracker-close"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
          </div>

          <form
            className="tracker-form"
            onSubmit={saveApplication}
          >

            <label>
              Opportunity name
              <input
                type="text"
                placeholder="e.g. Google Summer Internship"
                value={form.title}
                onChange={(e) =>
                  updateForm("title", e.target.value)
                }
                required
              />
            </label>

            <label>
              Organization
              <input
                type="text"
                placeholder="e.g. Google"
                value={form.organization}
                onChange={(e) =>
                  updateForm(
                    "organization",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Type
              <select
                value={form.kind}
                onChange={(e) =>
                  updateForm("kind", e.target.value)
                }
              >
                <option value="internship">
                  Internship
                </option>
                <option value="scholarship">
                  Scholarship
                </option>
              </select>
            </label>

            <label>
              Current status
              <select
                value={form.status}
                onChange={(e) =>
                  updateForm("status", e.target.value)
                }
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Applied date
              <input
                type="date"
                value={form.appliedDate}
                onChange={(e) =>
                  updateForm(
                    "appliedDate",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Application deadline
              <input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  updateForm(
                    "deadline",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Next action
              <input
                type="text"
                placeholder="e.g. Prepare resume"
                value={form.nextAction}
                onChange={(e) =>
                  updateForm(
                    "nextAction",
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Follow-up date
              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) =>
                  updateForm(
                    "followUpDate",
                    e.target.value
                  )
                }
              />
            </label>

            <label className="tracker-wide">
              Official application link
              <input
                type="url"
                placeholder="https://..."
                value={form.officialUrl}
                onChange={(e) =>
                  updateForm(
                    "officialUrl",
                    e.target.value
                  )
                }
              />
            </label>

            <label className="tracker-wide">
              Personal notes
              <textarea
                rows="4"
                placeholder="Interview details, documents needed, contact person, things to remember..."
                value={form.notes}
                onChange={(e) =>
                  updateForm("notes", e.target.value)
                }
              />
            </label>

            <div className="tracker-form-actions">

              <button
                type="button"
                className="tracker-secondary-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="tracker-primary-button"
              >
                {editingId
                  ? "Save Changes"
                  : "Add Application"}
              </button>

            </div>

          </form>
        </section>
      )}
      <section className="tracker-tools">

        <div className="tracker-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All statuses
          </option>

          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
        >
          <option value="All">
            All types
          </option>

          <option value="internship">
            Internships
          </option>

          <option value="scholarship">
            Scholarships
          </option>
        </select>

      </section>

      {savedOpportunities.length > 0 && (
        <section className="tracker-saved-section">

          <div className="tracker-section-heading">

            <div>
              <span className="eyebrow">
                FROM YOUR SAVED LIST
              </span>

              <h2>Turn saved opportunities into applications</h2>

              <p>
                Add an opportunity here when you actually
                plan to apply for it.
              </p>
            </div>

          </div>

          <div className="tracker-saved-row">

            {savedOpportunities.slice(0, 6).map(
              (opportunity) => {

                const tracked = applications.some(
                  (application) =>
                    application.opportunityId ===
                    opportunity.id
                );

                return (
                  <article
                    className="tracker-saved-card"
                    key={opportunity.id}
                  >

                    <span className="tracker-type-pill">
                      {opportunity.kind}
                    </span>

                    <h3>
                      {opportunity.title}
                    </h3>

                    <p>
                      {opportunity.organization}
                    </p>

                    <button
                      type="button"
                      disabled={tracked}
                      onClick={() =>
                        addSavedOpportunity(
                          opportunity
                        )
                      }
                    >
                      {tracked
                        ? "✓ Already Tracking"
                        : "+ Track Application"}
                    </button>

                  </article>
                );
              }
            )}

          </div>

        </section>
      )}

      <section className="tracker-list-section">

        <div className="tracker-section-heading">

          <div>
            <span className="eyebrow">
              MY APPLICATIONS
            </span>

            <h2>
              {filteredApplications.length} application
              {filteredApplications.length !== 1
                ? "s"
                : ""}
            </h2>

            <p>
              Update your status whenever something changes.
            </p>
          </div>

        </div>

        {filteredApplications.length === 0 ? (

          <div className="tracker-empty">

            <div className="tracker-empty-icon">
              ✓
            </div>

            <h2>
              No applications yet
            </h2>

            <p>
              Start tracking an internship or scholarship
              you are planning to apply for.
            </p>

            <button
              type="button"
              className="tracker-primary-button"
              onClick={openAddForm}
            >
              + Add Your First Application
            </button>

          </div>

        ) : (

          <div className="tracker-list">

            {filteredApplications.map(
              (application) => {

                const isOverdue =
                  application.followUpDate &&
                  application.followUpDate < today &&
                  ![
                    "Rejected",
                    "Withdrawn",
                    "Selected",
                  ].includes(application.status);

                return (
                  <article
                    className={`application-card ${
                      isOverdue
                        ? "application-overdue"
                        : ""
                    }`}
                    key={application.id}
                  >

                    <div className="application-main">

                      <div className="application-heading">

                        <div>
                          <div className="application-badges">

                            <span className="tracker-type-pill">
                              {application.kind}
                            </span>

                            {isOverdue && (
                              <span className="overdue-pill">
                                Follow-up overdue
                              </span>
                            )}

                          </div>

                          <h3>
                            {application.title}
                          </h3>

                          <p className="application-org">
                            {application.organization ||
                              "Organization not specified"}
                          </p>
                        </div>

                        <span
                          className={`application-status status-${application.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {application.status}
                        </span>

                      </div>

                      <div className="application-details">

                        <div>
                          <span>Applied</span>
                          <strong>
                            {application.appliedDate ||
                              "Not yet applied"}
                          </strong>
                        </div>

                        <div>
                          <span>Deadline</span>
                          <strong>
                            {application.deadline ||
                              "Not specified"}
                          </strong>
                        </div>

                        <div>
                          <span>Next action</span>
                          <strong>
                            {application.nextAction ||
                              "No next action added"}
                          </strong>
                        </div>

                        <div>
                          <span>Follow-up</span>
                          <strong
                            className={
                              isOverdue
                                ? "text-overdue"
                                : ""
                            }
                          >
                            {application.followUpDate ||
                              "Not scheduled"}
                          </strong>
                        </div>

                      </div>

                      {application.notes && (
                        <div className="application-notes">
                          <strong>Notes</strong>
                          <p>
                            {application.notes}
                          </p>
                        </div>
                      )}

                    </div>

                    <div className="application-actions">

                      <label>
                        Update status

                        <select
                          value={application.status}
                          onChange={(e) =>
                            changeStatus(
                              application.id,
                              e.target.value
                            )
                          }
                        >
                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>
                      </label>

                      <div className="application-buttons">

                        {application.opportunityId && (
                          <Link
                            className="tracker-action-link"
                            to={`/opportunity/${application.opportunityId}`}
                          >
                            View opportunity
                          </Link>
                        )}

                        {application.officialUrl && (
                          <a
                            className="tracker-action-link"
                            href={application.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Official source ↗️
                          </a>
                        )}

                        <button
                          type="button"
                          className="tracker-edit-button"
                          onClick={() =>
                            openEditForm(application)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="tracker-delete-button"
                          onClick={() =>
                            deleteApplication(
                              application.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </section>

    </main>
  );
}
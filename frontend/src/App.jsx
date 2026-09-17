import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import OpportunityDetails from "./pages/OpportunityDetails";
import Saved from "./pages/Saved";
import Tracker from "./pages/Tracker";

function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const go = (path) => {
    setOpen(false);
    return path;
  };

  return (
    <>
      <header className="topbar">
        <button className="menu-button" aria-label="Open menu" onClick={() => setOpen(true)}>☰</button>
        <Link to="/" className="brand">SCHOLARA<span>•</span></Link>
        <nav className="desktop-nav">
          <Link className={location.pathname === "/discover" ? "active" : ""} to="/discover?kind=internship">Internships</Link>
          <Link to="/discover?kind=scholarship">Scholarships</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/tracker">Tracker</Link>
        </nav>
      </header>

      {open && (
        <>
          <div className="overlay" onClick={() => setOpen(false)} />
          <aside className="sidebar" aria-label="Navigation">
            <button className="close" onClick={() => setOpen(false)}>×</button>
            <h2>SCHOLARA</h2>
            <Link to={go("/")}>⌂ Home</Link>
            <Link to={go("/discover?kind=internship")}>💼 Find Internship</Link>
            <Link to={go("/discover?kind=scholarship")}>🎓 Find Scholarship</Link>
            <Link to={go("/profile")}>◉ My Profile</Link>
            <Link to={go("/saved")}>♡ Saved Opportunities</Link>
            <Link to={go("/tracker")}>✓ Application Tracker</Link>
          </aside>
        </>
      )}
      {children}
      <footer><strong>SCHOLARA</strong><span>Find. Match. Grow.</span></footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/opportunity/:id" element={<OpportunityDetails />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

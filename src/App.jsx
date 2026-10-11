
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import PropertyDetails from "./pages/PropertyDetails";

const API_URL = `${import.meta.env.VITE_API_URL}/properties`;

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load properties.");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // Filter properties by title or location.
  const filteredProperties = properties.filter((property) => {
    const query = searchTerm.trim().toLowerCase();

    const title = String(property.title ?? "").toLowerCase();
    const location = String(property.location ?? "").toLowerCase();

    return title.includes(query) || location.includes(query);
  });

  return (
    <main className="page">
      <header className="page-header">
        <nav className="site-nav">
          <Link to="/" className="brand">
            <span className="brand-mark">B</span>
            <span>BrickChain</span>
          </Link>

          <span className="nav-label">
            Real estate marketplace
          </span>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">REAL ESTATE, REIMAGINED</p>

          <h1>
            Discover properties.
            <br />
            <span>Explore what's possible.</span>
          </h1>

          <p className="subtitle">
            Explore property opportunities and discover the
            details behind every listing, all in one place.
          </p>
        </div>
      </header>

      {loading && <p>Loading properties...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && properties.length === 0 && (
        <p>No properties found.</p>
      )}

      {!loading && !error && properties.length > 0 && (
        <section className="listings-section">
          <div className="listings-heading">
            <div>
              <p className="eyebrow">THE COLLECTION</p>
              <h2>Explore properties</h2>
            </div>

            <span className="listing-count">
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1
                ? "property"
                : "properties"}
            </span>
          </div>

          <div className="property-filters">
            <input
              type="search"
              className="property-search"
              placeholder="Search properties by name or location..."
              aria-label="Search properties by name or location"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="property-grid">
            {filteredProperties.map((property) => (
              <Link
                to={`/properties/${property.id}`}
                className="property-card"
                key={property.id}
              >
                <div className="property-top">
                  <span className="property-label">
                    Real estate
                  </span>

                  <span
                    className={`status ${property.status}`}
                  >
                    {property.status}
                  </span>
                </div>

                <h2>{property.title}</h2>

                <p className="location">
                  {property.location}
                </p>

                <p className="description">
                  {property.description}
                </p>

                <div className="property-value">
                  <span>Property value</span>

                  <strong>
                    {Number(
                      property.property_value
                    ).toLocaleString()}
                  </strong>
                </div>

                <div className="property-stats">
                  <div>
                    <span>Total units</span>
                    <strong>
                      {Number(
                        property.total_units
                      ).toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Available units</span>
                    <strong>
                      {Number(
                        property.available_units
                      ).toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Price per unit</span>
                    <strong>
                      {Number(
                        property.unit_price
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </Link>
            ))}

            {filteredProperties.length === 0 && (
              <p className="empty-results">
                No properties match your search.
                Try another name or location.
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PropertyList />} />
      <Route
        path="/properties/:id"
        element={<PropertyDetails />}
      />
    </Routes>
  );
}

export default App;

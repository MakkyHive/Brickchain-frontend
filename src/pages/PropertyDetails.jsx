import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/properties";

const formatNumber = (value) => Number(value).toLocaleString();

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Property not found."
              : "Failed to load property.",
          );
        }

        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <main className="page details-page">
        <p className="details-message">Loading property...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page details-page">
        <p className="error">{error}</p>
        <Link className="back-link" to="/">
          ← Back to properties
        </Link>
      </main>
    );
  }

  if (!property) {
    return null;
  }

  const totalUnits = Number(property.total_units);
  const availableUnits = Number(property.available_units);

  const availability =
    totalUnits > 0
      ? Math.min(100, Math.max(0, (availableUnits / totalUnits) * 100))
      : 0;

  return (
    <main className="page details-page">
      <Link to="/" className="back-link">
        <span aria-hidden="true">←</span>
        Back to properties
      </Link>

      <section className="details-hero">
        <div className="details-hero-glow" />

        <div className="details-hero-content">
          <div className="details-badges">
            <span className="property-label">REAL ESTATE</span>

            <span
              className={`details-status ${
                property.status === "active" ? "is-active" : ""
              }`}
            >
              <span className="status-dot" />
              {property.status}
            </span>
          </div>

          <p className="details-eyebrow">PROPERTY OVERVIEW</p>

          <h1 className="details-title">{property.title}</h1>

          <p className="details-location">
            <span aria-hidden="true">⌖</span>
            {property.location}
          </p>

          <p className="details-description">{property.description}</p>
        </div>

        <div className="details-hero-mark" aria-hidden="true">
          <span>BC</span>
          <div />
        </div>
      </section>

      <section className="valuation-card">
        <div>
          <p className="section-eyebrow">TOTAL PROPERTY VALUE</p>
          <h2 className="valuation-amount">
            {formatNumber(property.property_value)}
          </h2>
          <p className="muted-note">
            Currency is not specified in the current property data.
          </p>
        </div>

        <div className="valuation-icon" aria-hidden="true">
          ◈
        </div>
      </section>

      <section className="details-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">PROPERTY BREAKDOWN</p>
            <h2>Units and availability</h2>
          </div>
          <span className="details-count">ID #{property.id}</span>
        </div>

        <div className="details-stats-grid">
          <article className="details-stat">
            <span className="stat-icon">▦</span>
            <p>Total units</p>
            <strong>{formatNumber(property.total_units)}</strong>
            <span className="stat-caption">All property units</span>
          </article>

          <article className="details-stat">
            <span className="stat-icon">◷</span>
            <p>Available units</p>
            <strong>{formatNumber(property.available_units)}</strong>
            <span className="stat-caption">Units currently listed as available</span>
          </article>

          <article className="details-stat">
            <span className="stat-icon">◇</span>
            <p>Price per unit</p>
            <strong>{formatNumber(property.unit_price)}</strong>
            <span className="stat-caption">Currency not specified</span>
          </article>
        </div>
      </section>

      <section className="availability-card">
        <div className="availability-heading">
          <div>
            <p className="section-eyebrow">UNIT AVAILABILITY</p>
            <h2>Available inventory</h2>
          </div>

          <strong>{availability.toFixed(0)}%</strong>
        </div>

        <div
          className="availability-track"
          role="progressbar"
          aria-label="Available property units"
          aria-valuenow={Math.round(availability)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="availability-fill"
            style={{ width: `${availability}%` }}
          />
        </div>

        <p className="availability-caption">
          {formatNumber(availableUnits)} of {formatNumber(totalUnits)} units
          are listed as available.
        </p>
      </section>
    </main>
  );
}

export default PropertyDetails;
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/properties";

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
    return <main className="page"><p>Loading property...</p></main>;
  }

  if (error) {
    return (
      <main className="page">
        <p className="error">{error}</p>
        <Link to="/">← Back to properties</Link>
      </main>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <main className="page">
      <Link to="/">← Back to properties</Link>

      <article className="property-card" style={{ marginTop: "24px" }}>
        <div className="property-top">
          <span className="property-label">Real estate</span>
          <span className={`status ${property.status}`}>
            {property.status}
          </span>
        </div>

        <h1>{property.title}</h1>
        <p className="location">{property.location}</p>
        <p className="description">{property.description}</p>

        <div className="property-value">
          <span>Property value</span>
          <strong>
            {Number(property.property_value).toLocaleString()}
          </strong>
        </div>

        <div className="property-stats">
          <div>
            <span>Total units</span>
            <strong>{Number(property.total_units).toLocaleString()}</strong>
          </div>

          <div>
            <span>Available units</span>
            <strong>
              {Number(property.available_units).toLocaleString()}
            </strong>
          </div>

          <div>
            <span>Price per unit</span>
            <strong>{Number(property.unit_price).toLocaleString()}</strong>
          </div>
        </div>
      </article>
    </main>
  );
}

export default PropertyDetails;
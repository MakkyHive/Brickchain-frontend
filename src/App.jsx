import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import PropertyDetails from "./pages/PropertyDetails";
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'


const API_URL = `${import.meta.env.VITE_API_URL}/properties`;

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">BRICKCHAIN</p>
        <h1>Explore properties</h1>
        <p className="subtitle">
          Discover properties available on the platform.
        </p>
      </header>

      {loading && <p>Loading properties...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && properties.length === 0 && (
        <p>No properties found.</p>
      )}

      {!loading && !error && properties.length > 0 && (
        <section className="property-grid">
          {properties.map((property) => (
          <Link
            to={`/properties/${property.id}`}
            className="property-card"
            key={property.id}
          >     
          <div className="property-top">
                <span className="property-label">Real estate</span>
                <span className={`status ${property.status}`}>
                  {property.status}
                </span>
              </div>

              <h2>{property.title}</h2>
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
                  <strong>
                    {Number(property.total_units).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Available units</span>
                  <strong>
                    {Number(property.available_units).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Price per unit</span>
                  <strong>
                    {Number(property.unit_price).toLocaleString()}
                  </strong>
                </div>
              </div>
            </Link>
          ))}
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





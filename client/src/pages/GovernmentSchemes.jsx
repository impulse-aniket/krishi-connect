import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GovernmentSchemes() {
  const navigate = useNavigate();

  const [schemes] = useState([
    {
      name: "PM-KISAN",
      description:
        "Financial support scheme for eligible farmer families.",
      eligibility:
        "Eligible landholding farmer families.",
      benefits:
        "Financial assistance provided through direct benefit transfer.",
      link: "https://pmkisan.gov.in/",
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      description:
        "Crop insurance scheme providing financial protection against crop losses.",
      eligibility:
        "Eligible farmers growing notified crops.",
      benefits:
        "Insurance coverage against specified crop losses.",
      link: "https://pmfby.gov.in/",
    },
    {
      name: "Kisan Credit Card",
      description:
        "Credit facility designed to provide farmers access to agricultural credit.",
      eligibility:
        "Eligible farmers and agricultural borrowers.",
      benefits:
        "Access to credit for agricultural and related activities.",
      link: "https://www.myscheme.gov.in/",
    },
    {
      name: "Soil Health Card Scheme",
      description:
        "Provides information about soil health and suitable nutrient management.",
      eligibility:
        "Farmers requiring soil testing and recommendations.",
      benefits:
        "Soil nutrient information and fertilizer recommendations.",
      link: "https://soilhealth.dac.gov.in/",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredSchemes = schemes.filter((scheme) =>
    scheme.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-green-50">

      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <h1
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-bold cursor-pointer"
          >
            Krishi-Connect
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50"
          >
            Dashboard
          </button>

        </div>
      </nav>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-3xl font-bold text-green-700">
            Government Schemes
          </h2>

          <p className="text-gray-600 mt-2 mb-8">
            Explore government schemes and support programs
            useful for farmers.
          </p>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search schemes..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Schemes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {filteredSchemes.map((scheme, index) => (
              <div
                key={index}
                className="border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >

                <h3 className="text-2xl font-bold text-green-700">
                  {scheme.name}
                </h3>

                <p className="text-gray-600 mt-3">
                  {scheme.description}
                </p>

                <div className="mt-5">

                  <p className="font-semibold text-gray-800">
                    Eligibility
                  </p>

                  <p className="text-gray-600 mt-1">
                    {scheme.eligibility}
                  </p>

                </div>

                <div className="mt-4">

                  <p className="font-semibold text-gray-800">
                    Benefits
                  </p>

                  <p className="text-gray-600 mt-1">
                    {scheme.benefits}
                  </p>

                </div>

                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Official Website
                </a>

              </div>
            ))}

          </div>

          {filteredSchemes.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              No schemes found.
            </p>
          )}

        </div>

      </main>
    </div>
  );
}

export default GovernmentSchemes;
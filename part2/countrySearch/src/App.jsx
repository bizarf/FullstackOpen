import { useEffect } from "react";
import { useState } from "react";
import countryService from "./services/countries";
import CountryInfo from "./components/CountryInfo";

function App() {
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredCountry, setFilterCountry] = useState([]);

    useEffect(() => {
        countryService.getAll().then((initialData) => {
            setCountries(initialData);
        });
    }, []);

    useEffect(() => {
        const result = search
            ? countries.filter(({ name }) =>
                  name.common.toLowerCase().startsWith(search.toLowerCase())
              )
            : "";
        setFilterCountry(result);
    }, [search, countries]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <>
            <div>
                find countries{" "}
                <input value={search} onChange={handleSearchChange} />
                <div>
                    {filteredCountry.length > 10 && (
                        <>Too many matches, specify another filter</>
                    )}
                    {filteredCountry.length < 10 &&
                        filteredCountry.length > 1 &&
                        filteredCountry.map((country) => (
                            <li key={country.area}>
                                {country.name.common}{" "}
                                <button
                                    onClick={() => setFilterCountry([country])}
                                >
                                    show
                                </button>
                            </li>
                        ))}
                    {filteredCountry.length === 1 && (
                        <CountryInfo countryData={filteredCountry} />
                    )}
                </div>
            </div>
        </>
    );
}

export default App;

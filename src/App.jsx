import { useEffect, useState } from "react";

import axios from "axios";

function App() {
    const [climaData, setClimaData] = useState(null);
    const [climaToday, setClimaToday] = useState(null);
    const [geo, setGeo] = useState(null);
    const [location, setLocation] = useState("");

    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        if (geo && geo.length > 0) {
            getToday(geo[0].lat, geo[0].lon);
            forecastData(geo[0].lat, geo[0].lon);
        }
    }, [geo]);

    const getToday = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_TODAY}lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );

            console.log(response.data);

            setClimaToday(response.data);
        } catch (error) {
            console.error("Houve um erro:", error);
        }
    };

    const forecastData = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );

            console.log(response.data);

            setClimaData(response.data);
        } catch (error) {
            console.error(
                "Ocorreu um erro ao buscar a previsão do tempo:",
                error
            );
        }
    };

    const handleSubmitClima = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_GEO}q=${location}&limit=1&appid=${apiKey}`
            );

            console.log(response.data);

            setGeo(response.data);
        } catch (error) {
            console.error("Houve um erro na GEO:", error);
        }
    };

    const formatData = (timestamp) => {
        const data = new Date(timestamp * 1000);
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return data.toLocaleDateString("pt-br", options);
    };

    const formatHours = (timestamp) => {
        const data = new Date(timestamp * 1000);
        const hora = data.getHours().toString().padStart(2, "0");
        const minuto = data.getMinutes().toString().padStart(2, "0");
        return `${hora}h${minuto}min`;
    };

    return (
        <div className="bg-[url('/public/sky.jpg')] bg-cover h-screen w-screen">
            <div className="container mx-auto border flex flex-col items-center h-full justify-center">
                <h1 className="text-4xl mb-5">Clima</h1>
                <form onSubmit={handleSubmitClima} className="">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border border-solid border-black rounded px-1 py-0.5 "
                    />
                    <button
                        type="submit"
                        className="bg-sky-500 text-white px-2 py-0.5 m-1 rounded hover:bg-sky-300"
                    >
                        Obter Clima
                    </button>
                </form>
                {climaToday && (
                    <div className="border bg-sky-500 w-5/6">
                        <h2>Today:</h2>
                        <p>Temperatura atual: {climaToday.main.temp}°C</p>
                        <p>Temperatura Máxima: {climaToday.main.temp_max}°C</p>
                        <p>Temperatura Mínima: {climaToday.main.temp_min}°C</p>
                    </div>
                )}
                {climaData && (
                    <div>
                        <h2 className="text-3xl font-bold underline">
                            Resultados encontrados:
                        </h2>
                        <ul>
                            {climaData.list.map((item, index) => (
                                <li key={index}>
                                    <p>
                                        Data: {formatData(item.dt)}, Hora:{" "}
                                        {formatHours(item.dt)}, Temperatura Máx:{" "}
                                        {item.main.temp_max}°C, Temperatura mín:{" "}
                                        {item.main.temp_min}°C, Umidade:{" "}
                                        {item.main.humidity}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;

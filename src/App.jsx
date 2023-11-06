import { useEffect, useState, useCallback } from "react";

import axios from "axios";

import "./app.css";

function App() {
    const [climaData, setClimaData] = useState(null);
    const [climaToday, setClimaToday] = useState(null);
    const [geo, setGeo] = useState(null);
    const [location, setLocation] = useState("");

    const apiKey = process.env.REACT_APP_API_KEY;

    const getToday = useCallback(
        async (latitude, longitude) => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_TODAY}lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`
                );

                console.log(response.data);

                setClimaToday(response.data);
            } catch (error) {
                console.error("Houve um erro:", error);
            }
        },
        [apiKey]
    );

    const forecastData = useCallback(
        async (latitude, longitude) => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`
                );

                console.log(response.data);

                const currentData = new Date().toDateString();

                const uniqueDays = {};

                response.data.list.forEach((item) => {
                    const date = new Date(item.dt * 1000).toDateString();

                    if (date !== currentData) {
                        if (!uniqueDays[date]) {
                            uniqueDays[date] = item;
                        }
                    }
                });

                const uniqueHours = Object.values(uniqueDays);

                setClimaData(uniqueHours);
            } catch (error) {
                console.error(
                    "Ocorreu um erro ao buscar a previsão do tempo:",
                    error
                );
            }
        },
        [apiKey]
    );

    useEffect(() => {
        if (geo && geo.length > 0) {
            getToday(geo[0].lat, geo[0].lon);
            forecastData(geo[0].lat, geo[0].lon);
        }
    }, [geo, getToday, forecastData]);

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

    return (
        <div className="bg-[url('/public/sky.jpg')] bg-cover w-full h-screen landscape:h-full">
            <div className="container mx-auto flex flex-col items-center h-full justify-center">
                <form onSubmit={handleSubmitClima} className="my-12">
                    <h1 className="text-4xl mb-10 text-white font-bold text-center">
                        Weather Sky
                    </h1>
                    <div className="flex flex-row gap-2">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Insira o local"
                            className="rounded px-2 xl:px-5 py-0.5 focus:outline-none h-[35px] sm:w-[400px] xl:h-[50px] xl:w-[500px]"
                        />
                        <button
                            type="submit"
                            className="bg-orange-500 font-bold text-white px-2 py-0.5 rounded h-[35px] hover:bg-sky-300 xl:h-[50px] xl:w-[100px] active:bg-sky-900"
                        >
                            Buscar
                        </button>
                    </div>
                </form>
                <div
                    className={
                        climaData && climaToday
                            ? "bg-black/25 w-11/12 md:w-4/6 p-4 xl:p-6 rounded-lg"
                            : ""
                    }
                >
                    {climaToday && (
                        <div className="border bg-slate-200 text-black rounded-lg flex flex-col items-center justify-center gap-7 py-5 md:h-[200px]">
                            <p className="text-3xl md:text-7xl font-black">
                                {" "}
                                {Math.round(climaToday.main.temp)}°C
                            </p>
                            <div className="text-sm md:text-lg font-bold text-slate-500">
                                <p>
                                    Min {Math.round(climaToday.main.temp) + 6}
                                    °C / Max{" "}
                                    {Math.round(climaToday.main.temp) - 6}
                                    °C
                                </p>
                            </div>
                        </div>
                    )}
                    {climaData && (
                        <div className="">
                            <ul className="mt-5 flex gap-[20px] rounded-lg flex-wrap w-100">
                                {climaData.map((item, index) => (
                                    <li
                                        key={index}
                                        className="bg-gray-400 text-white flex flex-row justify-between items-center gap-3 px-2 md:px-5 flex-1 w-full md:w-2/6 h-[100px] md:h-[130px] lg:h-[150px] rounded-lg"
                                    >
                                        <p className="md:text-2xl">
                                            {" "}
                                            {new Date(
                                                item.dt * 1000
                                            ).toLocaleDateString("pt-br", {
                                                day: "numeric",
                                                month: "numeric",
                                            })}
                                        </p>
                                        <div className="flex flex-col justify-around h-full font-bold text-2xl md:text-5xl">
                                            <p>
                                                {Math.round(item.main.temp) + 6}
                                                °
                                            </p>
                                            <p>
                                                {Math.round(item.main.temp) - 6}
                                                °
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

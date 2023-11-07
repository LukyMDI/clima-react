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
        <div className="bg-[url('/public/sky.jpg')] bg-cover w-full h-screen">
            <div className="flex flex-col items-center h-full justify-center">
                <form onSubmit={handleSubmitClima} className="my-12 ldxs:my-10">
                    <h1 className="text-4xl mb-10 text-white font-bold text-center 5xl:text-8xl">
                        Weather Sky
                    </h1>
                    <div className="flex flex-row gap-2">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Insira o local"
                            className="rounded px-2 xl:px-5 py-0.5 focus:outline-none h-[35px] sm:w-[400px] xl:h-[50px] 5xl:h-[100px] xl:w-[500px] 5xl:w-[900px] 5xl:text-4xl"
                        />
                        <button
                            type="submit"
                            className="bg-orange-500 font-bold text-white px-2 py-0.5 rounded h-[35px] hover:bg-orange-300 xl:h-[50px] 5xl:h-[100px] xl:w-[100px] 5xl:w-[200px] active:bg-orange-700 5xl:text-4xl"
                        >
                            Buscar
                        </button>
                    </div>
                </form>
                <div
                    className={
                        climaData && climaToday
                            ? "efeito-vidro  w-11/12 md:w-4/6 ldxs:w-full p-4 xl:p-6 rounded-lg ldxs:flex ldxs:flex-row ldxs:gap-[10px]"
                            : ""
                    }
                >
                    {climaToday && (
                        <div className="bg-slate-200 text-black rounded-lg flex flex-col items-center justify-center gap-7 ldxs:gap-2 py-5 md:h-[200px] ldxs:h-[80px] 5xl:h-[300px] ldxs:basis-1/5">
                            <p className="text-3xl md:text-7xl ldxs:text-4xl 5xl:text-9xl font-black">
                                {" "}
                                {Math.round(climaToday.main.temp)}°C
                            </p>
                            <div className="text-sm md:text-lg 5xl:text-3xl ldxs:text-xs lg font-bold text-slate-500">
                                <p>
                                    Min {Math.round(climaToday.main.temp) - 6}
                                    °C / Max{" "}
                                    {Math.round(climaToday.main.temp) + 6}
                                    °C
                                </p>
                            </div>
                        </div>
                    )}
                    {climaData && (
                        <div className="">
                            <ul className="mt-5 ldxs:mt-0 flex gap-[10px] rounded-lg flex-wrap w-100">
                                {climaData.map((item, index) => (
                                    <li
                                        key={index}
                                        className="bg-gray-400 text-white flex flex-row justify-between items-center gap-3 px-2 md:px-5 flex-1 w-full md:w-2/6 ldxs:w-1/6 h-[100px] md:h-[130px] lg:h-[150px] 5xl:h-[250px] ldxs:h-[80px] rounded-lg"
                                    >
                                        <p className="md:text-2xl 5xl:text-4xl ldxs:text-sm">
                                            {" "}
                                            {new Date(
                                                item.dt * 1000
                                            ).toLocaleDateString("pt-br", {
                                                day: "numeric",
                                                month: "numeric",
                                            })}
                                        </p>
                                        <div className="flex flex-col justify-around h-full font-bold text-2xl md:text-5xl 5xl:text-7xl ldxs:text-xl">
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

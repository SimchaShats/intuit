import React, { useEffect, useState } from "react";
import "./app.css";
import FetcherMachine, { useFetcherMachine } from "./machines/fetcher";
import { Carousel } from "antd";
import { Drink } from "./app.types";
import DrinkerMachine, { useDrinkerMachine } from "./machines/drinker";
import Controls from "./components/controls";

const fetcherDrinks = FetcherMachine({
  url: "https://api.sampleapis.com/coffee/hot",
  loading: false,
  data: [],
});

const drinkerBar = DrinkerMachine({
  title: "Coffee",
  type: "coffee",
  subtype: "hot",
  index: 0,
});

function App() {
  const { data, loading, error } = useFetcherMachine<Drink>(fetcherDrinks);
  const { drinkData } = useDrinkerMachine(drinkerBar);
  const [drinkSubtype, setDrinkSubtype] = useState(drinkData.subtype);

  useEffect(() => {
    setDrinkSubtype(drinkData.subtype);
  }, [drinkData.subtype]);

  return (
    <div className="app">
      Current Bar: {drinkData.title}
      <Controls
        drinkSubtype={drinkSubtype}
        drinkData={drinkData}
        drinkerBar={drinkerBar}
        setDrinkSubtype={setDrinkSubtype}
        fetcherDrinks={fetcherDrinks}
      />
      <div className="app-area">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="app-wrapper">
            {error ? (
              error
            ) : (
              <Carousel arrows>
                {data.map((item) => (
                  <div key={item.id}>
                    <div className="carousel-item">
                      {item.title}
                      <img src={item.image} alt={item.title} height="200" />
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

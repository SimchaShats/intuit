import React, { useEffect, useState } from "react";
import "./app.css";
import FetcherMachine, { useFetcherMachine } from "./machines/fetcher";
import { Carousel, Button, Select } from "antd";
import { Coffee } from "./app.types";
import DrinkerMachine, { useDrinkerMachine } from "./machines/drinker";

const drinkFetcher = FetcherMachine({
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

const drinkOptions = {
  coffee: [
    { value: "hot", label: "Hot" },
    { value: "iced", label: "Iced" },
  ],
  wines: [
    { value: "reds", label: "Reds" },
    { value: "whites", label: "Whites" },
  ],
  beers: [
    { value: "ale", label: "Ale" },
    { value: "stouts", label: "Stouts" },
  ],
};
const bars = ["coffee", "beers", "wines"] as const;

function App() {
  const { data, loading, error } = useFetcherMachine<Coffee>(drinkFetcher);
  const { drinkData } = useDrinkerMachine(drinkerBar);
  const [drinkSubtype, setDrinkSubtype] = useState(drinkData.subtype);
  useEffect(() => {
    setDrinkSubtype(drinkData.subtype);
  }, [drinkData.subtype]);
  return (
    <div className="app">
      Current Drinks to load: {drinkData.title}
      <div className="panel">
        <Select
          defaultValue={drinkData.subtype}
          value={drinkData.subtype}
          style={{ width: 120 }}
          onChange={(value) => setDrinkSubtype(value)}
          options={drinkOptions[drinkData.type as keyof typeof drinkOptions]}
        />
        <Button
          onClick={() =>
            drinkFetcher.dispatch("init", {
              url: `https://api.sampleapis.com/${drinkData.type}/${drinkSubtype}`,
              loading: false,
              data: [],
            })
          }
        >
          Refetch
        </Button>
        <Button
          onClick={() => {
            const newDrinkData = drinkerBar.dispatch(
              bars[(drinkData.index + 1) % bars.length]
            );
            drinkFetcher.dispatch("init", {
              url: `https://api.sampleapis.com/${newDrinkData.type}/${newDrinkData.subtype}`,
              loading: false,
              data: [],
            });
          }}
        >
          Next Bar &gt;
        </Button>
      </div>
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

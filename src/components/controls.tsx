import { Button, Select } from "antd";
import React, { FC } from "react";
import DrinkerMachine from "../machines/drinker";
import FetcherMachine from "../machines/fetcher";

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

type DrinkReturnType = ReturnType<typeof DrinkerMachine>;

type ControlsProps = {
  fetcherDrinks: ReturnType<typeof FetcherMachine>;
  drinkSubtype: DrinkReturnType["state"]["subtype"];
  drinkData: DrinkReturnType["state"];
  drinkerBar: DrinkReturnType;
  setDrinkSubtype: (value: DrinkReturnType["state"]["subtype"]) => void;
};

const Controls: FC<ControlsProps> = ({
  drinkSubtype,
  drinkData,
  drinkerBar,
  setDrinkSubtype,
  fetcherDrinks,
}) => {
  return (
    <div className="panel">
      <Select
        defaultValue={drinkData.subtype}
        value={drinkSubtype}
        style={{ width: 120 }}
        onChange={(value) => setDrinkSubtype(value)}
        options={drinkOptions[drinkData.type as keyof typeof drinkOptions]}
      />
      <Button
        onClick={() =>
          fetcherDrinks.dispatch("init", {
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
          fetcherDrinks.dispatch("init", {
            url: `https://api.sampleapis.com/${newDrinkData.type}/${newDrinkData.subtype}`,
            loading: false,
            data: [],
          });
        }}
      >
        Next Bar &gt;
      </Button>
    </div>
  );
};

export default Controls;

import Machine from "../machine";
import React, { useEffect, useState } from "react";

type DrinkerState = {
  type: "coffee" | "wines" | "beers";
  title: string;
  subtype: string;
  index: number;
};

const DrinkerMachine = (initialState: DrinkerState) => {
  const drinker = Machine<DrinkerState, "coffee" | "wines" | "beers">(
    {
      beers: (state) => {
        return {
          ...state,
          title: "Beers",
          type: "beers",
          subtype: "ale",
          index: 1,
        };
      },
      wines: (state) => {
        return {
          ...state,
          title: "Wines",
          type: "wines",
          subtype: "reds",
          index: 2,
        };
      },
      coffee: (state) => {
        return {
          ...state,
          title: "Coffee",
          type: "coffee",
          subtype: "hot",
          index: 0,
        };
      },
    },
    initialState
  );
  return drinker;
};

export function useDrinkerMachine(drinker: ReturnType<typeof DrinkerMachine>) {
  const [drinkData, setDrinkData] = useState<DrinkerState>({
    title: "Coffee",
    type: "coffee",
    subtype: "hot",
    index: 0,
  });

  useEffect(() => {
    drinker.dispatch("coffee");
    drinker.subscribe("*", (state) => {
      setDrinkData(state);
    });
  }, []);

  return { drinkData };
}

export default DrinkerMachine;

import DrinkerMachine from "./machines/drinker";

test("Drinker Bars Flow: Coffee -> Beers -> Wines", () => {
  let state;
  const drinkerBar = DrinkerMachine({
    title: "Coffee",
    type: "coffee",
    subtype: "hot",
    index: 0,
  });
  expect(drinkerBar.state).toMatchSnapshot("Coffee Bar");

  state = drinkerBar.dispatch("beers");
  expect(state).toMatchSnapshot("Beers Bar");

  state = drinkerBar.dispatch("wines");
  expect(state).toMatchSnapshot("Wines Bar");
});

import { subscribe, unsubscribe } from "diagnostics_channel";
import internal from "stream";

type Setup<State, T extends string> = {
  [K in T]: (state: State) => void | State;
};
type SetupKeys<State, T extends string> = keyof Setup<State, T>;

function Machine<State, T extends string>(
  setup: Setup<State, T>,
  initialState: State
) {
  let internalState: State = initialState;
  const subscribers = {} as { [K in T]: ((state: State) => void)[] };
  return {
    state: initialState,
    subscribe: (step: SetupKeys<State, T>, action: (state: State) => void) => {
      if (!subscribers[step]) {
        subscribers[step] = [];
      }
      subscribers[step].push(action);
    },
    unsubscribe: (
      step: SetupKeys<State, T>,
      action: (state: State) => void
    ) => {
      subscribers[step]?.filter((item) => item !== action);
    },
    dispatch: (step: SetupKeys<State, T>, state?: State): State => {
      if (!setup[step]) {
        throw new Error("You called wrong step!");
      }
      if (state) {
        internalState = state;
      }
      const newState = setup[step](internalState);
      if (newState) {
        internalState = newState;
      }
      subscribers[step]?.forEach((subscriber) => subscriber(internalState));
      return newState ?? internalState;
    },
  };
}

export default Machine;

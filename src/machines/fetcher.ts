import Machine from "../machine";
import React, { useEffect, useState } from "react";

type FetcherState = {
  url: string;
  loading: boolean;
  response?: Promise<any>;
  data: any[];
  error?: string;
};

const FetcherMachine = (initialState: FetcherState) => {
  const fetcher = Machine<
    FetcherState,
    "init" | "loading" | "success" | "error"
  >(
    {
      init: (state) => {
        const response = fetch(state.url);
        fetcher.dispatch("loading", { ...state, loading: true, response });
      },
      loading: (state) => {
        state.response
          ?.then((result) => result.json())
          .then((data) => {
            fetcher.dispatch("success", { ...state, data, loading: false });
          })
          .catch((error) => {
            fetcher.dispatch("error", { ...state, error, loading: false });
          });
      },
      success: (state) => {},
      error: (state) => {},
    },
    initialState
  );
  return fetcher;
};

export function useFetcherMachine<T>(
  fetcher: ReturnType<typeof FetcherMachine>
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<undefined | string>();

  useEffect(() => {
    fetcher.dispatch("init");
    fetcher.subscribe("loading", (state) => {
      setLoading(state.loading);
    });
    fetcher.subscribe("success", (state) => {
      setData(state.data);
      setLoading(state.loading);
    });
    fetcher.subscribe("error", (state) => {
      setError(state.error);
      setLoading(state.loading);
    });
  }, []);

  return {
    loading,
    data,
    error,
  };
}

export default FetcherMachine;

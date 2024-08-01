import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./config";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app.route";
import { Suspense } from "preact/compat";
import Loading from "./components/Loading";
import mainStore from '@store/index';
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

const { persistor, store } = mainStore;


export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ReactQueryDevtools initialIsOpen={false} />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </Suspense>
  );
}

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";

// contexts
import SettingsContextProvider from "./contexts/SettingsContext";
import { store } from "./redux/store";

import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(
	<React.StrictMode>
		<HelmetProvider>
			<ReduxProvider store={store}>
				<SettingsContextProvider>
					<BrowserRouter>
						<QueryClientProvider client={queryClient}>
							<App />
						</QueryClientProvider>
					</BrowserRouter>
				</SettingsContextProvider>
			</ReduxProvider>
		</HelmetProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);

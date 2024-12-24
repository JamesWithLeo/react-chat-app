import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { IViewUser } from "../redux/slices/auth";
import { IConversation } from "./ConvoContext";
import { useQuery } from "@tanstack/react-query";
import { FetchSearch } from "../services/fetch";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/store";
import { debounce } from "lodash";
import { setSearchRoute } from "../redux/slices/app";

export type SearchScope = "all" | "people" | "chats" | "groups";
interface ISearchContext {
	searchData: { ok: 1 | 0; users: IViewUser[]; chats: IConversation[] };
	scope: SearchScope;
	searchQuery: string;
	isLoading: boolean;
	isSuccess: boolean;
	setScope: (newScope: SearchScope) => void;
	setSearchQuery: (newSearchQuery: string) => void;
}
export default function useSearchContext() {
	const context = useContext(searchContext);
	if (!context) {
		throw new Error(
			"useSearchContext must be used within a SearchContextProvider",
		);
	}
	return context;
}

const defaultContextValue: ISearchContext = {
	searchData: { ok: 1, users: [], chats: [] },
	scope: "all",
	searchQuery: "",
	isLoading: true,
	isSuccess: false,
	setScope: () => {},
	setSearchQuery: () => {},
};
const searchContext = createContext<ISearchContext>(defaultContextValue);

export const SearchContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const id = useSelector((state: AppState) => state.auth.user?.id);
	const dispatch = useDispatch();
	const searchScope = useSelector((state: AppState) => state.app.search);

	const [scope, setScope] = useState<SearchScope>(searchScope ?? "all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

	const handleSetScope = (newScope: SearchScope) => {
		setScope(newScope);
		dispatch(setSearchRoute(newScope));
	};
	const handleSetSearchQuery = (newSearchQuery: string) => {
		setSearchQuery(newSearchQuery);
	};

	const {
		data: searchData,
		isLoading,
		isSuccess,
	} = useQuery(
		["search", scope, debouncedSearchTerm],
		() => {
			console.log("Searching with the scope of:", scope);
			return FetchSearch(id!, debouncedSearchTerm, scope);
		},
		{ enabled: true },
	);

	useEffect(() => {
		const handler = debounce(() => {
			setDebouncedSearchTerm(searchQuery);
		}, 800);
		handler();
		return () => {
			handler.cancel();
		};
	}, [searchQuery]);
	return (
		<searchContext.Provider
			value={{
				searchData,
				scope,
				searchQuery,
				isLoading,
				isSuccess,
				setScope: handleSetScope,
				setSearchQuery: handleSetSearchQuery,
			}}
		>
			{children}
		</searchContext.Provider>
	);
};

import {
	Box,
	IconButton,
	Stack,
	Theme,
	ToggleButton,
	ToggleButtonGroup,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import SearchBase from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { CaretLeft, Spinner } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchRoute } from "../../redux/slices/app";
import { AppState } from "../../redux/store";
import { debounce } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { FetchPeople } from "../../services/fetch";
import PeopleCard from "../../components/PeopleCard";
import { IViewUser } from "../../redux/slices/auth";
import { useQuery } from "@tanstack/react-query";

export default function Search() {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const id = useSelector((state: AppState) => state.auth.user?.id);
	const searchRoute = useSelector((state: AppState) => state.app.search);

	const isSmallScreen = useMediaQuery((state: Theme) =>
		state.breakpoints.down("sm"),
	);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

	const HandleSearch = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { value } = event.target;
		setSearchQuery(value);
	};

	useEffect(() => {
		const handler = debounce(() => {
			setDebouncedSearchTerm(searchQuery);
		}, 800);
		handler();
		return () => {
			handler.cancel();
		};
	}, [searchQuery]);

	const query = useQuery(
		["people", debouncedSearchTerm],
		() => {
			return FetchPeople(id!, debouncedSearchTerm);
		},
		{ enabled: true },
	);

	const { isLoading, isSuccess, data: searchData } = query;

	return (
		<>
			<Box
				sx={{
					height: "100dvh",
					maxHeight: "100dvh",
					width: "100%",
					backgroundColor:
						theme.palette.mode === "light"
							? "#F8FAFF"
							: theme.palette.background.default,
				}}
			>
				<Stack p={isSmallScreen ? 2 : 3} spacing={2}>
					<Stack direction={"row"} spacing={1}>
						{isSmallScreen ? (
							<IconButton
								onClick={() => {
									navigate("/");
									dispatch(setSearchRoute(null));
								}}
							>
								<CaretLeft size={20} color="#4B4B4B" />
							</IconButton>
						) : null}
						<SearchBase>
							<SearchIconWrapper>
								<MagnifyingGlass
									color={theme.palette.primary.main}
								/>
							</SearchIconWrapper>
							<StyledInputBase
								id="searchBox"
								onChange={HandleSearch}
								autoFocus
								placeholder="Search..."
								inputProps={{ "aria-label": "search" }}
							/>
						</SearchBase>
					</Stack>

					<ToggleButtonGroup
						value={searchRoute ?? "search/all"}
						size="small"
						exclusive
						sx={{
							borderStyle: "none",
							backgroundColor: "transparent",
						}}
					>
						<ToggleButton
							value={"search/all"}
							onClick={() => {
								dispatch(setSearchRoute("search/all"));
								navigate("all");
							}}
						>
							all
						</ToggleButton>
						<ToggleButton
							value={"search/people"}
							onClick={() => {
								dispatch(setSearchRoute("search/people"));
								navigate("people");
							}}
						>
							people
						</ToggleButton>
						<ToggleButton
							value={"search/chats"}
							onClick={() => {
								dispatch(setSearchRoute("search/chats"));
								navigate("chats");
							}}
						>
							chats
						</ToggleButton>
					</ToggleButtonGroup>
				</Stack>
				<Box p={isSmallScreen ? 2 : 3}>
					{isSuccess && searchData && searchData.data ? (
						<>
							{searchData.data.map((user: IViewUser) => {
								return <PeopleCard user={user} key={user.id} />;
							})}
						</>
					) : (
						<Spinner />
					)}
				</Box>
			</Box>
		</>
	);
}

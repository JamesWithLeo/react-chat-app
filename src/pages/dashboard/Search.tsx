import {
	Box,
	Divider,
	IconButton,
	Stack,
	Theme,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
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
import { SearchScope, setSearchRoute } from "../../redux/slices/app";
import { AppState } from "../../redux/store";
import { debounce } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { FetchSearch } from "../../services/fetch";
import PeopleCard from "../../components/PeopleCard";
import { IViewUser } from "../../redux/slices/auth";
import { useQuery } from "@tanstack/react-query";

export default function Search() {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const id = useSelector((state: AppState) => state.auth.user?.id);
	const searchScope = useSelector((state: AppState) => state.app.search);

	const isSmallScreen = useMediaQuery((state: Theme) =>
		state.breakpoints.down("sm"),
	);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
	const [scope, setScope] = useState<SearchScope>(searchScope ?? "all");

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
		["people", debouncedSearchTerm, scope],
		() => {
			console.log("searching! scope:", scope);
			return FetchSearch(id!, debouncedSearchTerm, scope);
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
									dispatch(setSearchRoute("all"));
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
						value={searchScope ?? scope}
						size="small"
						exclusive
						sx={{
							borderStyle: "none",
							backgroundColor: "transparent",
						}}
					>
						<ToggleButton
							value={"all"}
							onClick={() => {
								dispatch(setSearchRoute("all"));
								setScope("all");
							}}
						>
							all
						</ToggleButton>
						<ToggleButton
							value={"people"}
							onClick={() => {
								dispatch(setSearchRoute("people"));
								setScope("people");
							}}
						>
							people
						</ToggleButton>
						<ToggleButton
							value={"chats"}
							onClick={() => {
								dispatch(setSearchRoute("chats"));
								setScope("chats");
							}}
						>
							chats
						</ToggleButton>
					</ToggleButtonGroup>
				</Stack>
				<Box p={isSmallScreen ? 2 : 3}>
					{isLoading ? (
						<Spinner />
					) : (
						<>
							{isSuccess && searchData && searchData.users ? (
								<>
									{searchData.users.map((user: IViewUser) => {
										return (
											<PeopleCard
												// Todo: Include the block id
												readOnly={[id].includes(
													user.id,
												)}
												user={user}
												key={user.id}
											/>
										);
									})}
								</>
							) : (
								<Typography>No result</Typography>
							)}
						</>
					)}
				</Box>
			</Box>
		</>
	);
}

import {
	Box,
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
import { setSearchRoute } from "../../redux/slices/app";
import { AppState } from "../../redux/store";
import { ChangeEvent } from "react";
import PeopleCard from "../../components/card/search/PeopleCard";
import { IViewUser } from "../../redux/slices/auth";
import ChatCard from "../../components/card/search/ChatCard";
import { IConversation } from "../../contexts/ConvoContext";
import useSearchContext from "../../contexts/SearchContext";

export default function Search() {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const id = useSelector((state: AppState) => state.auth.user?.id);

	const isSmallScreen = useMediaQuery((state: Theme) =>
		state.breakpoints.down("sm"),
	);
	const {
		setSearchQuery,
		isLoading,
		isSuccess,
		searchData,
		scope,
		setScope,
		searchQuery,
	} = useSearchContext();

	const HandleSearch = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { value } = event.target;
		setSearchQuery(value);
	};

	return (
		<>
			<Box
				sx={{
					overflowY: "hidden",
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
						value={scope}
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
								setScope("all");
							}}
						>
							all
						</ToggleButton>
						<ToggleButton
							value={"people"}
							onClick={() => {
								setScope("people");
							}}
						>
							people
						</ToggleButton>
						<ToggleButton
							value={"chats"}
							onClick={() => {
								setScope("chats");
							}}
						>
							chats
						</ToggleButton>

						<ToggleButton
							value={"groups"}
							onClick={() => {
								setScope("groups");
							}}
						>
							groups
						</ToggleButton>
					</ToggleButtonGroup>
				</Stack>

				{isLoading && !isSuccess && (
					<Stack
						direction={"row"}
						sx={{
							justifyContent: "center",
							alignItems: "center",
							mt: "8rem",
							gap: "1rem",
						}}
					>
						{searchQuery ? (
							<Typography>
								Searching for "{searchQuery}"
							</Typography>
						) : (
							<Spinner size={"1.4rem"} />
						)}
					</Stack>
				)}

				<>
					{isSuccess && searchData ? (
						<>
							<Box p={isSmallScreen ? 2 : 3} height={"100%"}>
								{scope === "all" || scope === "people" ? (
									<Typography py={2}>User</Typography>
								) : null}

								{searchData.users &&
									searchData.users.map((user: IViewUser) => {
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

								{scope === "all" || scope === "chats" ? (
									<Typography py={2}>Chats</Typography>
								) : null}

								{searchData.chats &&
									searchData.chats.map(
										(chat: IConversation) => {
											if (!chat.last_message) return null;
											return (
												<ChatCard
													convo={chat}
													key={chat.conversation_id}
												/>
											);
										},
									)}
							</Box>
						</>
					) : (
						<Typography>No result</Typography>
					)}
				</>
			</Box>
		</>
	);
}

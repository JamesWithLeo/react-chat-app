import {
	Box,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { CircleDashed, MagnifyingGlass } from "phosphor-react";
import { Theme, useTheme } from "@mui/material/styles";
import React from "react";
// import {ChatList} from '../../data';
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { List } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { ToggleSidebarOn } from "../../redux/slices/app";
import { useConvoContext } from "../../contexts/ConvoContext";
import ChatElement from "../../components/ConvoCard";

const Chats = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { conversation, isSuccess } = useConvoContext();

	return (
		<>
			<Box
				sx={{
					position: "relative",
					width: "100dvw",
					backgroundColor:
						theme.palette.mode === "light"
							? "#F8FAFF"
							: theme.palette.background.default,
					boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
				}}
			>
				<Stack
					p={isSmallScreen ? 2 : 3}
					pb={0}
					spacing={2}
					sx={{ height: "100vh" }}
				>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Stack
							spacing={2}
							direction={"row"}
							alignItems={"center"}
						>
							{isSmallScreen ? (
								<IconButton
									onClick={() => {
										dispatch(ToggleSidebarOn("NAVBAR"));
									}}
								>
									<List />
								</IconButton>
							) : null}
							<Typography variant="h5">Chats</Typography>
						</Stack>
						<IconButton>
							<CircleDashed />
						</IconButton>
					</Stack>

					<Stack sx={{ width: "100%" }}>
						<Search
							onClick={() => {
								navigate("/search");
							}}
						>
							<SearchIconWrapper>
								<MagnifyingGlass color="#709CE6" />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Search..."
								inputProps={{ "aria-label": "search" }}
							/>
						</Search>
					</Stack>

					<Stack spacing={2.4}>
						<Typography
							variant="subtitle2"
							sx={{ color: "#676767" }}
						>
							Pinned
						</Typography>

						<>
							{isSuccess ? (
								<>
									{conversation.map((convo) => {
										if (!convo.is_pinned) return null;
										return (
											<ChatElement
												convo={convo}
												key={convo.conversation_id}
											/>
										);
									})}
								</>
							) : null}
						</>
					</Stack>

					<Box
						className="scrollbar"
						component={"div"}
						sx={{
							flexGrow: 1,
							overflowY: "scroll",
							height: "100%",
							width: "100%",
						}}
					>
						<Typography
							variant="subtitle2"
							sx={{ color: "#676767" }}
						>
							All Chats
						</Typography>
						<Stack spacing={1} pb={2}>
							{isSuccess ? (
								<>
									{conversation.map((convo) => {
										if (
											convo.is_pinned ||
											!convo.last_message
										)
											return null;
										return (
											<>
												<ChatElement
													convo={convo}
													key={convo.conversation_id}
												/>
											</>
										);
									})}
								</>
							) : null}
						</Stack>
					</Box>
				</Stack>
			</Box>
		</>
	);
};

export default Chats;

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
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { CloudX, List } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { ToggleSidebarOn } from "../../redux/slices/app";
import { useConvoContext } from "../../contexts/ConvoContext";
import ChatElement from "../../components/ConvoCard";
import ConvoCardSkeleton from "../../components/skeletons/ConvoCardSkeleton";

const Chats = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { conversation, isSuccess, isError, isLoading } = useConvoContext();

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
								<MagnifyingGlass
									color={theme.palette.primary.main}
								/>
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Search..."
								inputProps={{ "aria-label": "search" }}
							/>
						</Search>
					</Stack>

					{isSuccess ? (
						<Stack spacing={2.4}>
							<>
								{conversation.some((c) => c.is_pinned) ? (
									<Typography
										variant="subtitle2"
										sx={{ color: "#676767" }}
									>
										Pinned
									</Typography>
								) : null}

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
						</Stack>
					) : null}

					{isError && !isSuccess ? (
						<>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									height: "100%",
								}}
							>
								<CloudX
									fontSize={"4rem"}
									weight="duotone"
									color={theme.palette.grey[400]}
								/>
								<Typography
									pb={4}
									textAlign={"center"}
									variant="caption"
									fontSize={"12px"}
									color={theme.palette.grey[600]}
								>
									Sorry, We're having a problem <br />
									with the database.
								</Typography>
							</Box>
						</>
					) : null}

					{isLoading && !isSuccess ? (
						<>
							<Stack spacing={2} pb={2} height={"100%"}>
								<Typography
									variant="subtitle2"
									sx={{ color: "#676767" }}
								>
									All Chat
								</Typography>
								<ConvoCardSkeleton opacity={1} />
								<ConvoCardSkeleton opacity={0.8} />
								<ConvoCardSkeleton opacity={0.4} />
								<ConvoCardSkeleton opacity={0.3} />
							</Stack>
						</>
					) : null}

					{isSuccess ? (
						<>
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
								<Stack spacing={2} pb={2}>
									<Typography
										variant="subtitle2"
										sx={{ color: "#676767" }}
									>
										All Chat
									</Typography>

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
								</Stack>
							</Box>
						</>
					) : null}
				</Stack>
			</Box>
		</>
	);
};

export default Chats;

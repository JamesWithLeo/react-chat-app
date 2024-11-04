import {
	Box,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { CircleDashed, MagnifyingGlass } from "phosphor-react";
import { Theme, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
// import {ChatList} from '../../data';
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { List } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { ToggleSidebarOn } from "../../redux/slices/app";
import socket from "../../services/sockets";
import { useConvoContext } from "../../contexts/ConvoContext";
import ChatElement from "../../components/ConvoCard";
import ConvoSkeleton from "../../components/skeletons/skeleton";
import { ArchiveConvoRequest, PinConvoRequest } from "../../services/fetch";

const Chats = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [skeletonCount, setSkeletonCount] = useState<number>(0);
	const { conversation, isSuccess } = useConvoContext();

	const id = useSelector((state: AppState) => state.auth.user?.id);
	const { sidebar, conversation: ConversationSlice } = useSelector(
		(store: AppState) => store.app,
	);

	useEffect(() => {
		console.log(
			"socket is:",
			socket.connected ? "connected" : "not connected",
		);
		socket.emit("hello");
		socket.on("connect", () => {
			console.log("socket id:", socket.id);
		});

		socket.on("connect_error", (err) => {
			console.log(err.stack);
		});

		return () => {
			socket.off("connect", () => {
				console.log("connection is off");
			});
		};
	}, []);

	useEffect(() => {
		function setSkeleton() {
			if (isSuccess && conversation.length) {
				setSkeletonCount(conversation.length);
				setTimeout(() => {
					setSkeletonCount(0);
				}, 3000);
			} else return;
		}
		setSkeleton();
	}, [isSuccess, conversation]);

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

					<Stack
						height={"100%"}
						spacing={2}
						direction="column"
						sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}
					>
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

						<Stack spacing={2.4}>
							<Typography
								variant="subtitle2"
								sx={{ color: "#676767" }}
							>
								All Chats
							</Typography>

							{skeletonCount ? (
								<>
									{Array.from({ length: skeletonCount }).map(
										(_, index) => {
											return (
												<ConvoSkeleton key={index} />
											);
										},
									)}
								</>
							) : (
								<>
									{isSuccess ? (
										<>
											{conversation.map((convo) => {
												if (convo.is_pinned)
													return null;
												return (
													<ChatElement
														convo={convo}
														key={
															convo.conversation_id
														}
													/>
												);
											})}
										</>
									) : null}
								</>
							)}
						</Stack>
					</Stack>
				</Stack>
			</Box>
		</>
	);
};

export default Chats;

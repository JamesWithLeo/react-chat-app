import {
	Box,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
	List as MuiList,
	Backdrop,
	Dialog,
	DialogContent,
	ListItem,
	ListItemButton,
	Paper,
	ListItemText,
	ListItemIcon,
} from "@mui/material";
import {
	Archive,
	CircleDashed,
	MagnifyingGlass,
	PushPin,
} from "phosphor-react";
import { Theme, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
// import {ChatList} from '../../data';
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { List, Trash } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { ToggleSidebarOff, ToggleSidebarOn } from "../../redux/slices/app";
import socket from "../../services/sockets";
import { useConvoContext } from "../../contexts/ConvoContext";
import ChatElement from "../../components/ConvoCard";
import ConvoSkeleton from "../../components/skeletons/skeleton";
import { PinConvoRequest } from "../../services/fetch";

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

	const HandleArchiveConvo = () => {
		console.log("Archiving Convo!", ConversationSlice?.id);
	};

	const HandleDeleteConvo = () => {
		console.log("Deleting Convo!", ConversationSlice?.id);
	};

	const HandlePinConvo = async () => {
		if (!id || !ConversationSlice) return;
		console.log("Pinning Convo!", ConversationSlice);
		const pinResponse = await PinConvoRequest(
			id,
			ConversationSlice.id,
			!ConversationSlice.is_pinned,
		);
		console.log(pinResponse);
	};

	return (
		<>
			{sidebar.type === "CONVO_MINI_SETTING" && sidebar.isOpen ? (
				<>
					<Box
						component={"div"}
						onClick={() => dispatch(ToggleSidebarOff())}
						sx={{
							width: "100%",
							position: "fixed",
							height: "100%",
							backgroundColor: "rgba(0, 0, 0, 0.5)", // 50% transparent black
							zIndex: theme.zIndex.modal + 1,
						}}
					/>
					<Box
						sx={{
							borderTopLeftRadius: 6,
							borderTopRightRadius: 6,
							bgcolor: theme.palette.background.default,
							zIndex: theme.zIndex.modal + 1,
							width: "100%",
							position: "absolute",
							bottom: 0,
						}}
					>
						<Box
							sx={{
								zIndex: theme.zIndex.drawer + 2,
								width: "100%",
							}}
						>
							<MuiList>
								<ListItem>
									<ListItemButton
										disableGutters
										onClick={HandleArchiveConvo}
									>
										<ListItemIcon>
											<Archive />
										</ListItemIcon>
										<ListItemText secondary="Archive" />
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										disableGutters
										onClick={HandlePinConvo}
									>
										<ListItemIcon>
											<PushPin />
										</ListItemIcon>
										<ListItemText
											secondary={`${ConversationSlice?.is_pinned ? "unpin" : "pin"} conversation`}
										/>
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										disableGutters
										onClick={HandleDeleteConvo}
									>
										<ListItemIcon>
											<Trash />
										</ListItemIcon>
										<ListItemText secondary="Delete conversation" />
									</ListItemButton>
								</ListItem>
							</MuiList>
						</Box>
					</Box>
				</>
			) : null}

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

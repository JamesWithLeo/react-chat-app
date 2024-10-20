import {
	Box,
	IconButton,
	Stack,
	Typography,
	Button,
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

const Chats = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const user = useSelector((state: AppState) => state.auth.user);
	const { conversation, isLoading, isSuccess, fetchConversation } =
		useConvoContext();
	console.log(conversation);

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
	return (
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
					<Stack spacing={2} direction={"row"} alignItems={"center"}>
						{isSmallScreen ? (
							<IconButton
								onClick={() => {
									dispatch(ToggleSidebarOn("NAVBAR"));
									// dispatch(ToggleSidebarOff());
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

				{!user ? (
					<Box
						width={"100%"}
						height={"100%"}
						display={"flex"}
						flexDirection={"column"}
						alignItems={"center"}
						justifyContent={"center"}
					>
						<Stack direction={"row"} spacing={2}>
							<Button
								onClick={() => {
									navigate("/auth/login");
								}}
								variant="contained"
								sx={{
									":hover": {
										backgroundColor:
											theme.palette.primary.main,
									},
								}}
							>
								Sign in
							</Button>
							<Button
								variant="outlined"
								onClick={() => {
									navigate("/auth/register");
								}}
							>
								Sign up
							</Button>
						</Stack>
					</Box>
				) : (
					<Stack
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
							{/* {ChatList.filter((el) => el.pinned).map((el) => {
              return <ChatElement  {...el} />
            })} */}
						</Stack>

						<Stack spacing={2.4}>
							<Typography
								variant="subtitle2"
								sx={{ color: "#676767" }}
							>
								All Chats
							</Typography>
							{isLoading ? (
								<Typography>...Loading</Typography>
							) : (
								<>
									{conversation.map((convo) => {
										return (
											<ChatElement
												convo={convo}
												key={convo.conversation_id}
											/>
										);
									})}
									{/* {ChatList.filter((el) => !el.pinned).map((el) => {
              return <ChatElement {...el} />
              })} */}
								</>
							)}
						</Stack>
					</Stack>
				)}
			</Stack>
		</Box>
	);
};

export default Chats;

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
import { useConvoContext } from "../../contexts/ConvoContext";
import ChatElement from "../../components/ConvoCard";
import socket from "../../services/sockets";

const Chats = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const id = useSelector((state: AppState) => state.auth.user?.id);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { conversation, isSuccess } = useConvoContext();

	useEffect(() => {
		if (id)
			socket.emit("peersStatus", {
				sender_id: id,
				isOnline: true,
			});

		return () => {
			if (id) {
				socket.emit("peersStatus", {
					sender_id: id,
					isOnline: true,
				});
				socket.disconnect();
			}
		};
	}, [isSuccess, conversation, id]);
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

							<>
								{isSuccess ? (
									<>
										{conversation.map((convo) => {
											if (convo.is_pinned) return null;
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
					</Stack>
				</Stack>
			</Box>
		</>
	);
};

export default Chats;

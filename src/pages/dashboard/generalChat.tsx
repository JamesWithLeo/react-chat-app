import {
	Box,
	IconButton,
	Stack,
	Typography,
	Button,
	Divider,
	useMediaQuery,
} from "@mui/material";
import { ArchiveBox, CircleDashed, MagnifyingGlass } from "phosphor-react";
import { Theme, useTheme } from "@mui/material/styles";
import React, { useState } from "react";
// import {ChatList} from '../../data';
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { List } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
// import ChatElement from "../../components/ConvoCard";

const Chats = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const user = useSelector((state: AppState) => state.auth.user);
	const [chats, setChats] = useState<string[]>([]);
	const navigate = useNavigate();
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
							<IconButton>
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
					<Search>
						<SearchIconWrapper>
							<MagnifyingGlass color="#709CE6" />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search..."
							inputProps={{ "aria-label": "search" }}
						/>
					</Search>
				</Stack>

				<Stack spacing={1}>
					<Stack direction="row" alignItems="center" spacing={1.5}>
						<ArchiveBox size={24} />
						<Button>Archive</Button>
					</Stack>
					<Divider />
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
							{/* {ChatList.filter((el) => !el.pinned).map((el) => {
              return <ChatElement {...el} />
              })} */}
						</Stack>
					</Stack>
				)}
			</Stack>
		</Box>
	);
};

export default Chats;

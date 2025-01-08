import {
	Box,
	Stack,
	Typography,
	Link,
	IconButton,
	Divider,
	useMediaQuery,
	Theme,
} from "@mui/material";
import React, { useState } from "react";
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import "../../css/global.css";

import CreateGroup from "../../sections/main/CreateGroup";
import { useNavigate } from "react-router-dom";
import HamburgerNavbarButton from "../../components/Buttons/HamburgerNavbarButton";
import useSearchContext from "../../contexts/SearchContext";
import { useConvoContext } from "../../contexts/ConvoContext";
import ConvoCard from "../../components/card/ConvoCard";

const Group = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { setScope } = useSearchContext();
	const [openDialog, setOpenDialog] = useState(false);
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const { conversation, isSuccess } = useConvoContext();
	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	return (
		<>
			<Stack direction={"row"} sx={{ width: "100%", height: "100dvh" }}>
				<Box
					sx={{
						height: "100%",
						width: "100%",
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? "#F8FAFF"
								: theme.palette.background.default,
					}}
				>
					<Stack
						p={isSmallScreen ? 2 : 3}
						spacing={2}
						sx={{ maxHeight: "100vh" }}
					>
						<Stack
							spacing={2}
							direction={"row"}
							alignItems={"center"}
						>
							{isSmallScreen && <HamburgerNavbarButton />}
							<Typography variant="h5">Group</Typography>
						</Stack>

						<Stack sx={{ width: "100%" }}>
							<Search
								onClick={() => {
									setScope("groups");
									navigate("/search");
								}}
							>
								<SearchIconWrapper>
									<MagnifyingGlass
										color="#709CE6"
										focusable={false}
									/>
								</SearchIconWrapper>
								<StyledInputBase
									placeholder="Search..."
									inputProps={{ "aria-label": "search" }}
								/>
							</Search>
						</Stack>
						<Stack
							direction={"row"}
							alignItems={"center"}
							justifyContent={"space-between"}
						>
							<Typography variant="subtitle2" component={Link}>
								Create New Group
							</Typography>
							<IconButton
								onClick={() => {
									setOpenDialog(true);
								}}
							>
								<Plus
									style={{
										color: theme.palette.primary.main,
									}}
								/>
							</IconButton>
						</Stack>
						<Divider />
						<Stack
							spacing={3}
							className="scrollbar"
							sx={{
								flexGrow: 1,
								overflowY: "scroll",
								height: "100%",
							}}
						>
							<SimpleBarStyle timeout={500} clickOnTrack={false}>
								<Stack spacing={2.5}>
									{/*  */}
									<Typography
										variant="subtitle2"
										sx={{ color: "#676667" }}
									>
										Pinned
									</Typography>
									{/* Pinned */}
									{/* {ChatList.filter((el) => el.pinned).map((el) => {
                                        return <ChatElement  {...el} />
                                    })} */}

									{/*  */}
									<Typography
										variant="subtitle2"
										sx={{ color: "#676667" }}
									>
										All Groups
									</Typography>
									{isSuccess ? (
										<>
											{conversation
												.filter(
													(c) =>
														c.conversation_type ===
														"group",
												)
												.map((c) => {
													return (
														<ConvoCard
															key={
																c.conversation_id
															}
															convo={c}
														/>
													);
												})}
										</>
									) : null}
									{/* Chat List */}
									{/* {ChatList.filter((el) => !el.pinned).map((el) => {
                                        return <ChatElement  {...el} />
                                    })} */}
								</Stack>
							</SimpleBarStyle>
						</Stack>
					</Stack>
				</Box>
			</Stack>

			{openDialog && (
				<>
					<CreateGroup
						open={openDialog}
						handleClose={handleCloseDialog}
					/>
				</>
			)}
		</>
	);
};

export default Group;

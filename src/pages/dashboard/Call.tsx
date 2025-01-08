import {
	Box,
	Stack,
	Typography,
	Link,
	IconButton,
	Divider,
} from "@mui/material";
import React, { useState } from "react";
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";

import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import "../../css/global.css";
// import { CallLogs, ChatList } from '../../data';
import ConvoCard from "../../components/card/ConvoCard";
import CreateGroup from "../../sections/main/CreateGroup";
import { CallLogElement } from "../../components/CallElement";
import StartCall from "../../sections/main/StartCall";

const Call = () => {
	const theme = useTheme();

	const [openDialog, setOpenDialog] = useState(false);

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};
	return (
		<>
			<Stack direction={"row"} sx={{ width: "100%" }}>
				{/* Left */}
				<Box
					sx={{
						height: "100vh",
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? "#F8FAFF"
								: theme.palette.background.default,
						width: 320,
						boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
					}}
				>
					<Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
						<Stack>
							<Typography variant="h5">Call Log</Typography>
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
						<Stack
							direction={"row"}
							alignItems={"center"}
							justifyContent={"space-between"}
						>
							<Typography variant="subtitle2" component={Link}>
								Start Conversation
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
									{/* Call Logs */}
									{/* {CallLogs.map((el) => <CallLogElement {...el} />)} */}
									<CallLogElement
										incoming={false}
										missed={false}
										online={true}
									/>
								</Stack>
							</SimpleBarStyle>
						</Stack>
					</Stack>
				</Box>

				{/* Right */}
			</Stack>
			{openDialog && (
				<StartCall open={openDialog} handleClose={handleCloseDialog} />
			)}
		</>
	);
};

export default Call;

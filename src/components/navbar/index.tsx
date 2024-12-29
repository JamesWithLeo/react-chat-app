import { Avatar, Backdrop, Button, Divider, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../redux/store";
import { AnimatePresence, m } from "framer-motion";
import { Stack } from "@mui/system";
import cssStyles from "../../utils/cssStyles";
import { NAVBAR } from "../../config";
import { ToggleSidebarOff } from "../../redux/slices/app";
import { ChatCircleDots } from "@phosphor-icons/react";
import { ArchiveBox, Gear } from "phosphor-react";
import { useNavigate } from "react-router-dom";

const Rootstyle = styled(m.div)(({ theme }) => ({
	...cssStyles(theme).bgBlur({
		color: theme.palette.background.paper,
		opacity: 0.92,
	}),
	boxShadow: `-24px 12px 32px -4px ${alpha(
		theme.palette.mode === "light"
			? theme.palette.grey[500]
			: theme.palette.common.black,
		0.16,
	)}`,
	width: NAVBAR.BASE_WIDTH,
	top: 0,
	left: 0,
	bottom: 0,
	display: "flex",
	position: "fixed",
	overflow: "hidden",
	borderRight: "1px",
	borderLeft: 0,
	borderTop: 0,
	borderBottom: 0,
	borderStyle: "solid",
	borderColor: theme.palette.divider,
	zIndex: theme.zIndex.drawer + 3,
	flexDirection: "column",
	backgroundColor: theme.palette.background.paper,
}));

export default function SlideBar() {
	const isOpen = useSelector((state: AppState) => state.app.navbar.isOpen);
	const user = useSelector((state: AppState) => state.auth.user);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	return (
		<>
			<Backdrop
				open={isOpen}
				onClick={() => {
					dispatch(ToggleSidebarOff());
				}}
				sx={{
					background: "transparent",
					zIndex: (theme) => theme.zIndex.drawer,
				}}
			/>

			<AnimatePresence>
				<Rootstyle>
					<Stack
						direction="row"
						spacing={3}
						component={"div"}
						onClick={() => {
							navigate("/profile");
							dispatch(ToggleSidebarOff());
						}}
						alignItems={"center"}
						sx={{ py: 2, px: 2.5 }}
					>
						{user?.photoUrl ? (
							<Avatar src={user.photoUrl} />
						) : (
							<Avatar />
						)}

						{user ? (
							<Typography
								sx={{ userSelect: "none" }}
								variant="caption"
								fontSize={{ sm: 16, md: 18 }}
							>
								{user.firstName || user.lastName
									? `${user.firstName} ${user.lastName}`
									: user.email}
							</Typography>
						) : null}
					</Stack>
					<Divider sx={{ borderStyle: "dashed" }} />

					<Stack
						height={"100%"}
						spacing={2}
						sx={{
							width: "100%",
							flexGrow: 1,
							py: 2,
							px: 2.5,
						}}
					>
						<Button
							onClick={() => {
								navigate("/chats");
								dispatch(ToggleSidebarOff());
							}}
							startIcon={<ChatCircleDots />}
							sx={{ width: "100%" }}
						>
							Chats
						</Button>

						<Button
							onClick={() => {
								navigate("/archived");
							}}
							startIcon={<ArchiveBox />}
							sx={{ width: "100%" }}
						>
							Archive
						</Button>

						<Button
							onClick={() => {
								navigate("/settings");
								dispatch(ToggleSidebarOff());
							}}
							sx={{ width: "100%" }}
							startIcon={<Gear />}
						>
							Settings
						</Button>
					</Stack>
				</Rootstyle>
			</AnimatePresence>
		</>
	);
}

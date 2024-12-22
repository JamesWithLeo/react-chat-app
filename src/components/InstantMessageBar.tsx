import {
	Avatar,
	Box,
	Divider,
	Fab,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/store";
import { ToggleSidebarOff } from "../redux/slices/app";
import { useState } from "react";
import {
	LinkSimple,
	PaperPlaneTilt,
	Smiley,
	Camera,
	File,
	Image,
	Sticker,
	User,
	Phone,
	VideoCamera,
} from "phosphor-react";
import { CaretLeft, Info } from "@phosphor-icons/react";
import StyledBadge from "./StyledBadge";
import { SendInitialMessage } from "../services/fetch";
import { useChatContext } from "../contexts/ChatContext";
import { useNavigate } from "react-router-dom";

const Actions = [
	{
		color: "#4da5fe",
		icon: <Image size={24} />,
		y: 102,
		title: "Photo/Video",
	},
	{
		color: "#1b8cfe",
		icon: <Sticker size={24} />,
		y: 172,
		title: "Stickers",
	},
	{
		color: "#0172e4",
		icon: <Camera size={24} />,
		y: 242,
		title: "Image",
	},
	{
		color: "#0159b2",
		icon: <File size={24} />,
		y: 312,
		title: "Document",
	},
	{
		color: "#013f7f",
		icon: <User size={24} />,
		y: 382,
		title: "Contact",
	},
];

export default function InstantMessageBar() {
	const theme = useTheme();
	const [openPicker, setOpenPicker] = useState(false);
	const [openAction, setOpenAction] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const peer = useSelector((state: AppState) => state.app.instantMessagePeer);
	const id = useSelector((state: AppState) => state.auth.user?.id);
	const { setChat } = useChatContext();

	const HandleSend = async () => {
		if (!peer || !id) return;
		const textField = document.getElementById(
			"textField",
		) as HTMLInputElement;

		if (!textField.value) return;

		const response = await SendInitialMessage({
			userId: id,
			message: textField.value,
			messageType: "text",
			recipientId: peer.id,
		});
		textField.value = "";

		if (response.message.conversation_id) {
			const { conversation_id } = response.message;
			sessionStorage.setItem("conversationId", conversation_id);
			setChat({
				initialConvoId: conversation_id,
				conversationType: "direct",
				thumbnail: peer.photoUrl,
				InitialPeersData: [peer],
			});
			navigate("/chat");
			dispatch(ToggleSidebarOff());
		}
	};

	return (
		<>
			<Box
				component={"div"}
				onClick={() => {
					dispatch(ToggleSidebarOff());
				}}
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
					bgcolor: theme.palette.background.paper,
					zIndex: theme.zIndex.modal + 1,
					position: "absolute",
					bottom: 0,
					width: "100%",
					borderTopLeftRadius: 6,
					borderTopRightRadius: 6,
					display: "grid",
					gap: "0rem",
				}}
			>
				<Box
					p={1}
					sx={{ display: "flex", gap: "1rem", alignItems: "center" }}
				>
					<IconButton
						onClick={() => {
							dispatch(ToggleSidebarOff());
						}}
					>
						<CaretLeft fontSize={"large"} />
					</IconButton>

					<Stack
						direction="row"
						alignItems="center"
						sx={{
							flexGrow: 1,
							gap: ".5rem",
							display: "flex",
						}}
						justifyContent={"flex-end"}
					>
						<IconButton sx={{ fontSize: 20 }}>
							<Phone fontSize={"large"} />
						</IconButton>
						<IconButton
							sx={{ fontSize: 20 }} // Adjust the size based on screen size
						>
							<VideoCamera fontSize={"large"} />
						</IconButton>
						<Divider orientation="vertical" flexItem />
						<IconButton sx={{ fontSize: 20 }}>
							<Info fontSize={"large"} />
						</IconButton>
					</Stack>
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						py: "4rem",
					}}
				>
					<Stack sx={{ gap: "1rem" }}>
						{peer?.isOnline ? (
							<StyledBadge
								overlap="circular"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								variant="dot"
								sx={{
									"& .MuiBadge-dot": {
										backgroundColor: "#44b700",
										color: "#44b700",
									},
								}}
							>
								<Avatar
									src={peer?.photoUrl}
									sx={{ height: 128, width: 128 }}
								/>
							</StyledBadge>
						) : (
							<StyledBadge
								onClick={() => {}}
								overlap="circular"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								variant="dot"
							>
								<Avatar
									src={peer?.photoUrl}
									sx={{ height: 128, width: 128 }}
								/>
							</StyledBadge>
						)}

						<Stack
							spacing={0.2}
							sx={{ display: "flex", alignItems: "center" }}
						>
							<Typography
								sx={{
									flexGrow: 1,
									fontWeight: 800,
									fontSize: "16px",
								}}
								variant="caption"
							>
								{peer?.firstName} {peer?.lastName}
							</Typography>
						</Stack>
					</Stack>
				</Box>

				<Box
					p={2}
					sx={{
						alignItems: "center",
						display: "flex",
						width: "100%",
						gap: "1rem",
						backgroundColor:
							theme.palette.mode === "light"
								? "#F8FAFF"
								: theme.palette.background.paper,
						boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
					}}
				>
					<TextField
						id="textField"
						variant="standard"
						sx={{ flexGrow: 1 }}
						placeholder="Write a message..."
						InputProps={{
							disableUnderline: true,
							startAdornment: (
								<Stack sx={{ width: "max-content" }}>
									<Stack
										sx={{
											position: "relative",
											display: openAction
												? "inline-block"
												: "none",
										}}
									>
										{Actions.map((el) => (
											<Tooltip
												key={el.title}
												placement="right"
												title={el.title}
											>
												<Fab
													sx={{
														position: "absolute",
														top: -el.y,
														backgroundColor:
															el.color,
													}}
												>
													{el.icon}
												</Fab>
											</Tooltip>
										))}
									</Stack>
									<InputAdornment position="end">
										<IconButton
											onClick={() =>
												setOpenAction((prev) => !prev)
											}
										>
											<LinkSimple />
										</IconButton>
									</InputAdornment>
								</Stack>
							),

							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() =>
											setOpenPicker(
												(prev: boolean) => !prev,
											)
										}
									>
										<Smiley />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<Box
						sx={{
							height: 48,
							width: 48,
							backgroundColor: theme.palette.primary.main,
							borderRadius: 1.5,
						}}
					>
						<Stack
							sx={{
								height: "100%",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<IconButton onClick={HandleSend}>
								<PaperPlaneTilt color="#fff" />
							</IconButton>
						</Stack>
					</Box>
				</Box>
			</Box>
		</>
	);
}

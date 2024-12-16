import {
	Box,
	Fab,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Tooltip,
} from "@mui/material";
import React, { forwardRef, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
	LinkSimple,
	PaperPlaneTilt,
	Smiley,
	Camera,
	File,
	Image,
	Sticker,
	User,
} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useChatContext } from "../../contexts/ChatContext";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import socket from "../../services/sockets";
// import { useConvoContext } from "../../contexts/ConvoContext";

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
const ChatInput = forwardRef<
	HTMLInputElement,
	{
		setOpenPicker: React.Dispatch<React.SetStateAction<boolean>>;
		onFocusTyping: () => void;
		onBlur: () => void;
	}
>(({ setOpenPicker, onFocusTyping, onBlur }, ref) => {
	const [openAction, setOpenAction] = useState(false);

	return (
		<TextField
			inputRef={ref}
			onFocus={onFocusTyping}
			onBlur={onBlur}
			fullWidth
			placeholder="Write a message..."
			variant="standard"
			InputProps={{
				disableUnderline: true,
				startAdornment: (
					<Stack sx={{ width: "max-content" }}>
						<Stack
							sx={{
								position: "relative",
								display: openAction ? "inline-block" : "none",
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
											backgroundColor: el.color,
										}}
									>
										{el.icon}
									</Fab>
								</Tooltip>
							))}
						</Stack>
						<InputAdornment position="end">
							<IconButton
								onClick={() => setOpenAction((prev) => !prev)}
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
								setOpenPicker((prev: boolean) => !prev)
							}
						>
							<Smiley />
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);
});

const Footer = () => {
	const theme = useTheme();
	const { conversation_id, isTyping, messagePeer, setIsTyping } =
		useChatContext();
	const id = useSelector((state: AppState) => state.auth.user?.id);

	const messageInputRef = useRef<HTMLInputElement>(null);
	const [openPicker, setOpenPicker] = useState(false);

	async function HandleSendMessage() {
		if (!messageInputRef.current || !id) {
			return;
		}
		const message = messageInputRef.current.value;
		messageInputRef.current.value = "";
		messagePeer(message, id, "text");
	}

	async function HandleFocusTyping() {
		if (!id || isTyping) {
			return;
		}
		socket.emit("handleTyping", {
			conversation_id,
			sender_id: id,
			isTyping: true,
		});
		setIsTyping(true);
	}
	async function HandleBlurTyping() {
		if (!id || !isTyping) return;

		socket.emit("handleTyping", {
			conversation_id,
			sender_id: id,
			isTyping: false,
		});
		setIsTyping(false);
	}
	return (
		<Box
			p={2}
			sx={{
				width: "100%",
				backgroundColor:
					theme.palette.mode === "light"
						? "#F8FAFF"
						: theme.palette.background.paper,
				boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
			}}
		>
			<Stack direction="row" alignItems={"center"} spacing={3}>
				<Stack sx={{ width: "100%" }}>
					{/* Chat Input */}
					<Box
						sx={{
							display: openPicker ? "inline" : "none",
							zIndex: 10,
							position: "fixed",
							bottom: 81,
							right: 100,
						}}
					>
						<Picker
							theme={theme.palette.mode}
							data={data}
							onEmojiSelect={console.log}
						/>
					</Box>
					<ChatInput
						onFocusTyping={HandleFocusTyping}
						onBlur={HandleBlurTyping}
						setOpenPicker={setOpenPicker}
						ref={messageInputRef}
					/>
				</Stack>

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
						<IconButton onClick={HandleSendMessage}>
							<PaperPlaneTilt color="#fff" />
						</IconButton>
					</Stack>
				</Box>
			</Stack>
		</Box>
	);
};

export default Footer;

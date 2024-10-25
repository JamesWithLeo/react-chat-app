import {
	Box,
	Divider,
	IconButton,
	Stack,
	Typography,
	Menu,
	MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import React, { MouseEvent } from "react";
import { IMessages, useChatContext } from "../../contexts/ChatContext";

interface IMessageBase {
	type: "msg" | "divider";
	incoming?: boolean;
	outgoing?: boolean;
}

export interface IChatMessage extends IMessageBase {
	subtype?: "text" | "doc" | "link" | "img" | "reply";
	message?: string;
	img?: string;
	preview?: string;
	reply?: string;
	text?: string;
}

const DocMsg = ({
	message,
	isOptionOpen,
	isFromUser,
}: {
	message: IMessages;
	isOptionOpen: boolean;
	isFromUser: boolean;
}) => {
	const theme = useTheme();
	return (
		<Stack direction="row" justifyContent={!isFromUser ? "start" : "end"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: !isFromUser
						? theme.palette.background.default
						: theme.palette.primary.main,
					borderRadius: 1.5,
					width: "max-content",
				}}
			>
				<Stack spacing={2}>
					<Stack
						p={2}
						spacing={3}
						direction="row"
						alignItems="center"
						sx={{
							backgroundColor: theme.palette.background.paper,
							borderRadius: 1,
						}}
					>
						<Image size={48} />
						<Typography variant="caption">Abstract.png</Typography>
						<IconButton>
							<DownloadSimple />
						</IconButton>
					</Stack>
					<Typography
						variant="body2"
						sx={{
							color: true ? theme.palette.text.primary : "#fff",
						}}
					>
						{message.content}
					</Typography>
				</Stack>
			</Box>
			{isOptionOpen && (
				<MessageOptions messageId={message.message_id} isFromOther />
			)}
		</Stack>
	);
};

const LinkMsg = ({
	message,
	isOptionOpen,
	isFromUser,
}: {
	message: IMessages;
	isOptionOpen: boolean;
	isFromUser: boolean;
}) => {
	const theme = useTheme();
	return (
		<Stack direction="row" justifyContent={!isFromUser ? "start" : "end"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: !isFromUser
						? theme.palette.background.default
						: theme.palette.primary.main,
					borderRadius: 1.5,
					width: "max-content",
				}}
			>
				<Stack spacing={2}>
					<Stack
						p={2}
						spacing={3}
						alignItems="start"
						sx={{
							backgroundColor: theme.palette.background.paper,
							borderRadius: 1,
						}}
					>
						<img
							src={message.content}
							alt={message.content}
							style={{ maxHeight: 210, borderRadius: "10px" }}
						/>
						<Stack spacing={2}>
							<Typography variant="subtitle1">
								Creating Chat App
							</Typography>
							<Typography
								variant="subtitle2"
								sx={{ color: theme.palette.primary.main }}
							>
								www.youtube.com
							</Typography>
						</Stack>
						<Typography
							variant="body2"
							color={
								!isFromUser
									? theme.palette.text.primary
									: "#fff"
							}
						>
							{message.content}
						</Typography>
					</Stack>
				</Stack>
			</Box>
			{isOptionOpen && (
				<MessageOptions messageId={message.message_id} isFromOther />
			)}
		</Stack>
	);
};

const ReplyMsg = ({
	message,
	isOptionOpen,
	isFromUser,
}: {
	message: IMessages;
	isOptionOpen: boolean;
	isFromUser: boolean;
}) => {
	const theme = useTheme();
	return (
		<Stack direction="row" justifyContent={!isFromUser ? "start" : "end"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: !isFromUser
						? theme.palette.background.default
						: theme.palette.primary.main,
					borderRadius: 1.5,
					width: "max-content",
				}}
			>
				<Stack spacing={2}>
					<Stack
						p={2}
						direction="column"
						spacing={3}
						alignItems="center"
						sx={{
							backgroundColor: theme.palette.background.paper,
							borderRadius: 1,
						}}
					>
						<Typography
							variant="body2"
							color={theme.palette.text.primary}
						>
							{message.content}
						</Typography>
					</Stack>
					<Typography
						variant="body2"
						color={
							!isFromUser ? theme.palette.text.primary : "#fff"
						}
					>
						{/* TODO: add reply */}
						{/* {el.reply} */}
					</Typography>
				</Stack>
			</Box>
			{isOptionOpen && (
				<MessageOptions messageId={message.message_id} isFromOther />
			)}
		</Stack>
	);
};

const MediaMsg = ({
	message,
	isOptionOpen,
	isFromUser,
}: {
	message: IMessages;
	isOptionOpen: boolean;
	isFromUser: boolean;
}) => {
	const theme = useTheme();
	const Message_options = [
		{
			title: "Reply",
			fn: () => {},
		},
		{
			title: "React to message",
			fn: () => {},
		},
		{
			title: "Forward message",
			fn: () => {},
		},
		{
			title: "Star message",
			fn: () => {},
		},
		{
			title: "Report",
			fn: () => {},
		},
		{
			title: "Delete Message",
			fn: () => {},
		},
	];
	return (
		<Stack direction="row" justifyContent={!isFromUser ? "start" : "end"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: !isFromUser
						? theme.palette.background.default
						: theme.palette.primary.main,
					borderRadius: 1.5,
					width: "max-content",
				}}
			>
				<Stack spacing={1}>
					<img
						src={message.content}
						alt={message.content}
						style={{ maxHeight: 210, borderRadius: "10px" }}
					/>
					<Typography
						variant="body2"
						color={
							!isFromUser ? theme.palette.text.primary : "#fff"
						}
					>
						{message.content}
					</Typography>
				</Stack>
			</Box>
			{isOptionOpen && (
				<MessageOptions messageId={message.message_id} isFromOther />
			)}
		</Stack>
	);
};

const TextMsg = ({
	message,
	isFromOther,
	isOptionOpen,
}: {
	message: IMessages;
	isFromOther: boolean;
	isOptionOpen: boolean;
}) => {
	const theme = useTheme();
	return (
		<Stack direction="row" justifyContent={!isFromOther ? "end" : "start"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: !isFromOther
						? theme.palette.primary.main
						: theme.palette.background.default,
					borderRadius: 1.5,
					width: "max-content",
				}}
			>
				<Typography
					variant="body2"
					color={!isFromOther ? "#fff" : theme.palette.text.primary}
				>
					{message.content}
				</Typography>
			</Box>
			{isOptionOpen && (
				<MessageOptions
					messageId={message.message_id}
					isFromOther={isFromOther}
				/>
			)}
		</Stack>
	);
};

const TimeLine = ({ el }: { el: IChatMessage }) => {
	const theme = useTheme();
	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="space-between"
		>
			<Divider />
			<Typography
				variant="caption"
				sx={{ color: theme.palette.text.primary }}
			>
				{el.text}
			</Typography>
			<Divider />
		</Stack>
	);
};

type UserOption = "reply" | "react" | "star" | "report" | "delete" | "forward";

interface IMessage_option {
	key: UserOption;
	title: string;
	fn: () => void;
}

const MessageOptions = ({
	messageId,
	isFromOther,
}: {
	messageId: string;
	isFromOther: boolean;
}) => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);
	const { removeMessage } = useChatContext();

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const Message_options: IMessage_option[] = [
		{
			key: "reply",
			title: "Reply",
			fn: () => {},
		},
		{
			key: "react",
			title: "React to message",
			fn: () => {},
		},
		{
			key: "forward",
			title: "Forward message",
			fn: () => {},
		},
		{
			key: "star",
			title: "Star message",
			fn: () => {},
		},
		{
			key: "report",
			title: "Report",
			fn: () => {},
		},
		{
			key: "delete",
			title: "Delete Message",
			fn: async () => {
				removeMessage(messageId);
			},
		},
	];

	return (
		<>
			<IconButton onClick={handleClick}>
				<DotsThreeVertical
					aria-controls={open ? "basic-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
					size={20}
				/>
			</IconButton>

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<Stack spacing={1} px={1}>
					{Message_options.map((option) => {
						if (isFromOther && option.key === "delete") {
							return null;
						} else if (!isFromOther && option.key === "report") {
							return null;
						} else {
							return (
								<MenuItem
									key={option.title}
									onClick={option.fn}
								>
									{option.title}
								</MenuItem>
							);
						}
					})}
				</Stack>
			</Menu>
		</>
	);
};

export { TimeLine, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };

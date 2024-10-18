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

interface IMessageBase {
	type: "msg" | "divider"; // Common property for all message types
	incoming?: boolean; // Indicates if the message is incoming
	outgoing?: boolean; // Indicates if the message is outgoing
}

export interface IChatMessage extends IMessageBase {
	subtype?: "text" | "doc" | "link" | "img" | "reply"; // Optional subtype for messages
	message?: string; // Text of the message
	img?: string; // Optional image URL
	preview?: string; // Optional link preview image
	reply?: string; // Optional reply text
	text?: string;
}

const Message_options = [
	{
		title: "Reply",
	},
	{
		title: "React to message",
	},
	{
		title: "Forward message",
	},
	{
		title: "Star message",
	},
	{
		title: "Report",
	},
	{
		title: "Delete Message",
	},
];

const DocMsg = ({
	el,
	isOptionOpen,
}: {
	el: IChatMessage;
	isOptionOpen: boolean;
}) => {
	const theme = useTheme();
	return (
		<Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: el.incoming
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
							color: el.incoming
								? theme.palette.text.primary
								: "#fff",
						}}
					>
						{el.message}
					</Typography>
				</Stack>
			</Box>
			{isOptionOpen && <MessageOptions />}
		</Stack>
	);
};

const LinkMsg = ({
	el,
	isOptionOpen,
}: {
	el: IChatMessage;
	isOptionOpen: boolean;
}) => {
	const theme = useTheme();
	return (
		<Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: el.incoming
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
							src={el.preview}
							alt={el.message}
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
								el.incoming
									? theme.palette.text.primary
									: "#fff"
							}
						>
							{el.message}
						</Typography>
					</Stack>
				</Stack>
			</Box>
			{isOptionOpen && <MessageOptions />}
		</Stack>
	);
};

const ReplyMsg = ({
	el,
	isOptionOpen,
}: {
	el: IChatMessage;
	isOptionOpen: boolean;
}) => {
	const theme = useTheme();
	return (
		<Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: el.incoming
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
							{el.message}
						</Typography>
					</Stack>
					<Typography
						variant="body2"
						color={
							el.incoming ? theme.palette.text.primary : "#fff"
						}
					>
						{el.reply}
					</Typography>
				</Stack>
			</Box>
			{isOptionOpen && <MessageOptions />}
		</Stack>
	);
};

const MediaMsg = ({
	el,
	isOptionOpen,
}: {
	el: IChatMessage;
	isOptionOpen: boolean;
}) => {
	const theme = useTheme();
	return (
		<Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: el.incoming
						? theme.palette.background.default
						: theme.palette.primary.main,
					borderRadius: 1.5,
					width: "max-content",
				}}
			>
				<Stack spacing={1}>
					<img
						src={el.img}
						alt={el.message}
						style={{ maxHeight: 210, borderRadius: "10px" }}
					/>
					<Typography
						variant="body2"
						color={
							el.incoming ? theme.palette.text.primary : "#fff"
						}
					>
						{el.message}
					</Typography>
				</Stack>
			</Box>
			{isOptionOpen && <MessageOptions />}
		</Stack>
	);
};

const TextMsg = ({
	el,
	isOptionOpen,
}: {
	el: IChatMessage;
	isOptionOpen: boolean;
}) => {
	const theme = useTheme();
	return (
		<Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
			<Box
				p={1.5}
				sx={{
					backgroundColor: el.incoming
						? theme.palette.background.default
						: theme.palette.primary.main,
					borderRadius: 1.5,
					width: "max-content",
				}}
			>
				<Typography
					variant="body2"
					color={el.incoming ? theme.palette.text.primary : "#fff"}
				>
					{el.message}
				</Typography>
			</Box>
			{isOptionOpen && <MessageOptions />}
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

const MessageOptions = () => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

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
					{Message_options.map((el) => (
						<MenuItem>{el.title}</MenuItem>
					))}
				</Stack>
			</Menu>
		</>
	);
};

export { TimeLine, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };

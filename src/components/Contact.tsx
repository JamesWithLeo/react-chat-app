import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	IconButton,
	Slide,
	Stack,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
	Bell,
	CaretRight,
	Phone,
	Prohibit,
	Star,
	Trash,
	VideoCamera,
	X,
} from "phosphor-react";
import { useDispatch } from "react-redux";
import { faker } from "@faker-js/faker";
import AntSwitch from "./AntSwitch";
import "../css/global.css";

import { SlideProps } from "@mui/material";
import { AppDispatch } from "../redux/store";
// import { ToggleConvobar } from "../redux/slices/app";
import { useChatContext } from "../contexts/ChatContext";
import StyledBadge from "./StyledBadge";
import { ToggleSidebarOff } from "../redux/slices/app";

// Define the ref and props types for the Transition component using forwardRef
const Transition = React.forwardRef<unknown, SlideProps>(
	function Transition(props, ref) {
		return <Slide direction="up" ref={ref} {...props} />;
	},
);

const BlockDialog = ({
	isOpen,
	handleClose,
}: {
	isOpen: boolean;
	handleClose: () => void;
}) => {
	return (
		<Dialog
			open={isOpen}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			aria-describedby="alert-dialog-slide-description"
		>
			<DialogTitle>Block this contact</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description">
					Are you sure you want to block this contact?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleClose}>Yes</Button>
			</DialogActions>
		</Dialog>
	);
};

const DeleteDialog = ({
	isOpen,
	handleClose,
}: {
	isOpen: boolean;
	handleClose: () => void;
}) => {
	return (
		<Dialog
			open={isOpen}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			aria-describedby="alert-dialog-slide-description"
		>
			<DialogTitle>Delete this chat</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description">
					Are you sure you want to delete this chat?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleClose}>Yes</Button>
			</DialogActions>
		</Dialog>
	);
};

const Contact = () => {
	const theme = useTheme();
	const {
		peers,
		conversation_type,
		conversation_thumbnail,
		conversation_id,
		// isOtherOnline,
	} = useChatContext();
	const dispatch = useDispatch<AppDispatch>();

	const [openBlock, setOpenBlock] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const handleCloseBlock = () => {
		setOpenBlock(false);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
	};

	return (
		<Box sx={{ width: "100%", height: "100vh" }}>
			<Stack sx={{ height: "100%" }}>
				{/* Header */}
				<Box
					sx={{
						boxShadow: "0px 0px 2px rgba(0.25)",
						width: "100%",
						backgroundColor:
							theme.palette.mode === "light"
								? "#F8FAFF"
								: theme.palette.background.default,
					}}
				>
					<Stack
						sx={{ height: "100%", p: 2 }}
						direction="row"
						alignItems="center"
						justifyContent="space-between"
						spacing={3}
					>
						<Typography variant="subtitle2">
							Contact Info
						</Typography>
						<IconButton
							onClick={() => {
								dispatch(ToggleSidebarOff());
							}}
						>
							<X />
						</IconButton>
					</Stack>
				</Box>
				{/* Body */}
				<Stack
					className="scrollbar"
					sx={{
						height: "100%",
						position: "relative",
						flexGrow: 1,
						overflowY: "scroll",
					}}
					p={3}
					spacing={3}
				>
					<Stack alignItems={"center"} direction="row" spacing={2}>
						{peers?.some((p) => p.isOnline) ? (
							<StyledBadge
								// onClick={() => {
								// 	dispatch(ToggleConvobar());
								// }}
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
									height: 64,
									width: 64,
								}}
							>
								{peers?.length ? (
									// to do : apply default theme
									<Avatar
										sx={{ height: 64, width: 64 }}
										src={
											conversation_type === "group"
												? (conversation_thumbnail ?? "")
												: peers[0].photoUrl
										}
									/>
								) : (
									<Avatar />
								)}
							</StyledBadge>
						) : (
							<StyledBadge
								// onClick={() => {
								// 	dispatch(ToggleConvobar());
								// }}
								overlap="circular"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								variant="dot"
							>
								{peers?.length ? (
									// to do : apply default theme
									<Avatar
										sx={{ height: 64, width: 64 }}
										src={
											conversation_type === "group"
												? (conversation_thumbnail ?? "")
												: peers[0].photoUrl
										}
									/>
								) : (
									<Avatar />
								)}
							</StyledBadge>
						)}
						<Stack spacing={0.5}>
							<Typography variant="caption" fontWeight={600}>
								{conversation_type === "group" ? (
									<>
										{peers
											?.map((p) => p.firstName)
											.join(", ")}
									</>
								) : (
									<>
										{peers?.length
											? `${peers[0].firstName} ${peers[0].lastName}`
											: conversation_id}
									</>
								)}
							</Typography>
							{peers ? (
								<Typography variant="caption" fontWeight={500}>
									{/* {peers?.phone_number} */}
								</Typography>
							) : null}
						</Stack>
					</Stack>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-evenly"
					>
						<Stack spacing={1} alignItems="center">
							<IconButton>
								<Phone />
							</IconButton>
							<Typography variant="overline">Voice</Typography>
						</Stack>
						<Stack spacing={1} alignItems="center">
							<IconButton>
								<VideoCamera />
							</IconButton>
							<Typography variant="overline">Video</Typography>
						</Stack>
					</Stack>
					<Divider />
					<Stack spacing={0.5}>
						<Typography variant="caption">About</Typography>
						<Typography variant="caption">
							Hi I'm working
						</Typography>
					</Stack>
					<Divider />
					<Stack
						direction="row"
						alignItems={"center"}
						justifyContent="space-between"
					>
						<Typography variant="subtitle2">
							Media, Links & Docs
						</Typography>
						<Button
							onClick={() => {
								// dispatch(UpdateSidebarType('SHARED'))
							}}
							endIcon={<CaretRight />}
						>
							401
						</Button>
					</Stack>
					<Stack direction="row" spacing={2} alignItems={"center"}>
						{[1, 2, 3].map((el) => (
							<Box>
								<img
									src={faker.image.food()}
									alt={faker.name.fullName()}
								/>
							</Box>
						))}
					</Stack>
					<Divider />
					<Stack
						direction="row"
						alignItems={"center"}
						justifyContent="space-between"
					>
						<Stack
							direction="row"
							spacing={2}
							alignItems={"center"}
						>
							<Star size={21} />
							<Typography variant="subtitle2">
								Starred Messages
							</Typography>
						</Stack>
						<IconButton
							onClick={() => {
								// dispatch(UpdateSidebarType('STARRED'))
							}}
						>
							<CaretRight />
						</IconButton>
					</Stack>
					<Divider />
					<Stack
						direction="row"
						alignItems={"center"}
						justifyContent="space-between"
					>
						<Stack
							direction="row"
							spacing={2}
							alignItems={"center"}
						>
							<Bell size={21} />
							<Typography variant="subtitle2">
								Mute Notifications
							</Typography>
						</Stack>
						<AntSwitch />
					</Stack>
					<Divider />
					<Typography>1 group in common</Typography>
					<Stack direction="row" spacing={2} alignItems={"center"}>
						<Avatar
							src={faker.image.avatar()}
							alt={faker.name.fullName()}
						/>
						<Stack spacing={0.5}>
							<Typography variant="subtitle2">
								React Developers
							</Typography>
							<Typography variant="caption">
								Kaveena, Pavithra, Ayesha, James,You
							</Typography>
						</Stack>
					</Stack>
					<Stack direction="row" alignItems={"center"} spacing={2}>
						<Button
							onClick={() => {
								setOpenBlock(true);
							}}
							startIcon={<Prohibit />}
							fullWidth
							variant="outlined"
						>
							Block
						</Button>
						<Button
							onClick={() => {
								setOpenDelete(true);
							}}
							startIcon={<Trash />}
							fullWidth
							variant="outlined"
						>
							Delete
						</Button>
					</Stack>
				</Stack>
			</Stack>
			{openBlock && (
				<BlockDialog
					isOpen={openBlock}
					handleClose={handleCloseBlock}
				/>
			)}
			{openDelete && (
				<DeleteDialog
					isOpen={openDelete}
					handleClose={handleCloseDelete}
				/>
			)}
		</Box>
	);
};

export default Contact;

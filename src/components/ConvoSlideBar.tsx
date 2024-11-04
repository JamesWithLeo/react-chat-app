import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ToggleSidebarOff } from "../redux/slices/app";
import { PushPin, Archive, Trash } from "@phosphor-icons/react";
import { AppState } from "../redux/store";

import { PinConvoRequest, ArchiveConvoRequest } from "../services/fetch";

export default function ConvoSlideBar() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const id = useSelector((state: AppState) => state.auth.user?.id);

	const { conversation: conversationSlice } = useSelector(
		(store: AppState) => store.app,
	);

	const HandleDeleteConvo = () => {
		console.log("Deleting Convo!");
	};

	const HandlePinConvo = async () => {
		if (!id || !conversationSlice) return;
		console.log("Pinning Convo!", conversationSlice);
		const pinResponse = await PinConvoRequest(
			id,
			conversationSlice.id,
			!conversationSlice.is_pinned,
		);
		console.log(pinResponse);
	};

	const HandleArchiveConvo = async () => {
		if (!id || !conversationSlice) return;
		console.log("Archiving Convo!", conversationSlice.id);

		const archiveResponse = await ArchiveConvoRequest(
			id,
			conversationSlice.id,
			!conversationSlice.is_archived,
		);
		console.log(archiveResponse);
	};

	return (
		<>
			<>
				<Box
					component={"div"}
					onClick={() => dispatch(ToggleSidebarOff())}
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
						borderTopLeftRadius: 6,
						borderTopRightRadius: 6,
						bgcolor: theme.palette.background.default,
						zIndex: theme.zIndex.modal + 1,
						width: "100%",
						position: "absolute",
						bottom: 0,
					}}
				>
					<Box
						sx={{
							zIndex: theme.zIndex.drawer + 2,
							width: "100%",
						}}
					>
						<List>
							<ListItem>
								<ListItemButton
									disableGutters
									onClick={HandleArchiveConvo}
								>
									<ListItemIcon>
										<Archive />
									</ListItemIcon>
									<ListItemText
										secondary={`${conversationSlice?.is_archived ? "Unarchive" : "Archive"}`}
									/>
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									disableGutters
									onClick={HandlePinConvo}
								>
									<ListItemIcon>
										<PushPin />
									</ListItemIcon>
									<ListItemText
										secondary={`${conversationSlice?.is_pinned ? "unpin" : "pin"} conversation`}
									/>
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									disableGutters
									onClick={HandleDeleteConvo}
								>
									<ListItemIcon>
										<Trash />
									</ListItemIcon>
									<ListItemText secondary="Delete conversation" />
								</ListItemButton>
							</ListItem>
						</List>
					</Box>
				</Box>
			</>
		</>
	);
}

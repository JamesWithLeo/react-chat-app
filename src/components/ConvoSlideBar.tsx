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
import { useConvoContext } from "../contexts/ConvoContext";

export default function ConvoSlideBar() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const id = useSelector((state: AppState) => state.auth.user?.id);

	const { archivedConversation, pinConversation, selectedConvo } =
		useConvoContext();

	const HandleDeleteConvo = () => {
		console.log("Deleting Convo!");
	};

	const HandlePinConvo = async () => {
		if (!id || !selectedConvo) return;
		console.log("Pinning Convo!", selectedConvo);
		const pinResponse = await PinConvoRequest(
			id,
			selectedConvo.conversation_id,
			!selectedConvo.is_pinned,
		);
		console.log(pinResponse);
		if (
			pinResponse.ok &&
			pinResponse.conversation_id &&
			"is_pinned" in pinResponse
		) {
			pinConversation(pinResponse.is_pinned);
			// dispatch(ToggleSidebarOff());
		}
	};

	const HandleArchiveConvo = async () => {
		if (!id || !selectedConvo) return;
		console.log("Archiving Convo!", selectedConvo);

		const archiveResponse = await ArchiveConvoRequest(
			id,
			selectedConvo.conversation_id,
			selectedConvo.is_archived,
		);
		console.log(archiveResponse);
		if (
			archiveResponse.ok &&
			archiveResponse.conversation_id &&
			"is_archived" in archiveResponse
		) {
			archivedConversation(archiveResponse.is_archived);
			dispatch(ToggleSidebarOff());
		}
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
								{selectedConvo ? (
									<ListItemButton
										disableGutters
										onClick={HandleArchiveConvo}
									>
										<ListItemIcon>
											<Archive />
										</ListItemIcon>
										<ListItemText
											secondary={`${selectedConvo.is_archived ? "Unarchive" : "Archive"}`}
										/>
									</ListItemButton>
								) : null}
							</ListItem>
							<ListItem>
								{selectedConvo ? (
									<ListItemButton
										disableGutters
										onClick={HandlePinConvo}
									>
										<ListItemIcon>
											<PushPin />
										</ListItemIcon>
										<ListItemText
											secondary={`${selectedConvo.is_pinned ? "unpin" : "pin"} conversation`}
										/>
									</ListItemButton>
								) : null}
							</ListItem>
							<ListItem>
								{selectedConvo ? (
									<ListItemButton
										disableGutters
										onClick={HandleDeleteConvo}
									>
										<ListItemIcon>
											<Trash />
										</ListItemIcon>
										<ListItemText secondary="Delete conversation" />
									</ListItemButton>
								) : null}
							</ListItem>
						</List>
					</Box>
				</Box>
			</>
		</>
	);
}

import {
	Box,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Theme } from "@mui/material";
import { useDispatch } from "react-redux";
import { ToggleSidebarOn } from "../../redux/slices/app";
import { List } from "@phosphor-icons/react";
import { useConvoContext } from "../../contexts/ConvoContext";
import ChatElement from "../../components/ConvoCard";
import ConvoCardSkeleton from "../../components/skeletons/ConvoCardSkeleton";

export default function ArchivePage() {
	const theme = useTheme();
	const dispatch = useDispatch();

	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const { conversation, isSuccess, isLoading } = useConvoContext();

	return (
		<Box
			sx={{
				position: "relative",
				width: "100dvw",
				backgroundColor:
					theme.palette.mode === "light"
						? "#F8FAFF"
						: theme.palette.background.default,
				boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
			}}
		>
			<Stack
				p={isSmallScreen ? 2 : 3}
				spacing={2}
				sx={{ height: "100vh" }}
			>
				<Stack spacing={2} direction={"row"} alignItems={"center"}>
					{isSmallScreen ? (
						<IconButton
							onClick={() => {
								dispatch(ToggleSidebarOn("NAVBAR"));
							}}
						>
							<List />
						</IconButton>
					) : null}
					<Typography variant="h5">Archived</Typography>
				</Stack>

				<Stack spacing={2.4}>
					{isLoading && !isSuccess ? (
						<>
							<ConvoCardSkeleton opacity={1} />
							<ConvoCardSkeleton opacity={0.8} />
							<ConvoCardSkeleton opacity={0.4} />
							<ConvoCardSkeleton opacity={0.3} />
						</>
					) : null}

					{isSuccess ? (
						<>
							{conversation.map((convo) => {
								if (!convo.is_archived) return null;
								return (
									<ChatElement
										convo={convo}
										key={convo.conversation_id}
									/>
								);
							})}
						</>
					) : null}
				</Stack>
			</Stack>
		</Box>
	);
}

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
import { useState, useEffect } from "react";
import ConvoSkeleton from "../../components/skeletons/skeleton";

export default function ArchivePage() {
	const theme = useTheme();
	const dispatch = useDispatch();

	const [skeletonCount, setSkeletonCount] = useState<number>(0);

	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const { conversation, isSuccess } = useConvoContext();

	useEffect(() => {
		function setSkeleton() {
			if (isSuccess && conversation.length) {
				const archivedConvo = conversation.filter(
					(convo) => convo.is_archived,
				);

				setSkeletonCount(archivedConvo.length);
				setTimeout(() => {
					setSkeletonCount(0);
				}, 3000);
			} else return;
		}
		setSkeleton();
	}, [isSuccess, conversation]);

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
					{skeletonCount ? (
						<>
							{Array.from({ length: skeletonCount }).map(
								(_, index) => {
									return <ConvoSkeleton key={index} />;
								},
							)}
						</>
					) : (
						<>
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
						</>
					)}
				</Stack>
			</Stack>
		</Box>
	);
}

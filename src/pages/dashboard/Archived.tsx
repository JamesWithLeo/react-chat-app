import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Theme } from "@mui/material";
import { useConvoContext } from "../../contexts/ConvoContext";
import ConvoCard from "../../components/card/ConvoCard";
import ConvoCardSkeleton from "../../components/skeletons/ConvoCardSkeleton";
import HamburgerNavbarButton from "../../components/Buttons/HamburgerNavbarButton";

export default function ArchivePage() {
	const theme = useTheme();

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
					{isSmallScreen && <HamburgerNavbarButton />}
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
									<ConvoCard
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

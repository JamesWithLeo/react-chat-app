import {
	Box,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { CircleDashed, MagnifyingGlass } from "phosphor-react";
import { Theme, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { CloudX } from "@phosphor-icons/react";

import { useNavigate } from "react-router-dom";
import { IConversation, useConvoContext } from "../../contexts/ConvoContext";
import ConvoCard from "../../components/card/ConvoCard";
import ConvoCardSkeleton from "../../components/skeletons/ConvoCardSkeleton";
import HamburgerNavbarButton from "../../components/Buttons/HamburgerNavbarButton";
import useSearchContext from "../../contexts/SearchContext";

const Chats = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	const navigate = useNavigate();
	const { conversation, isSuccess, isError, isLoading } = useConvoContext();
	const { setScope } = useSearchContext();
	const [sortedConversation, setSortedConversation] = useState<
		IConversation[]
	>([]);
	useEffect(() => {
		if (conversation && Array.isArray(conversation)) {
			setSortedConversation(
				conversation.sort((a, b) => {
					if (
						a.last_message?.created_at &&
						b.last_message?.created_at
					) {
						return (
							new Date(b.last_message.created_at).getTime() -
							new Date(a.last_message.created_at).getTime()
						);
					} else {
						return 0;
					}
				}),
			);
		}
	}, [conversation]);

	return (
		<>
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
					pb={0}
					spacing={2}
					sx={{ height: "100vh" }}
				>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Stack
							spacing={2}
							direction={"row"}
							alignItems={"center"}
						>
							{isSmallScreen && <HamburgerNavbarButton />}
							<Typography variant="h5">Chats</Typography>
						</Stack>
						<IconButton>
							<CircleDashed />
						</IconButton>
					</Stack>

					<Stack sx={{ width: "100%" }}>
						<Search
							onClick={() => {
								setScope("people");
								navigate("/search");
							}}
						>
							<SearchIconWrapper>
								<MagnifyingGlass
									color={theme.palette.primary.main}
								/>
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Search..."
								inputProps={{ "aria-label": "search" }}
							/>
						</Search>
					</Stack>

					{isSuccess ? (
						<Stack spacing={2.4}>
							<>
								{conversation.some((c) => c.is_pinned) ? (
									<Typography
										variant="subtitle2"
										sx={{ color: "#676767" }}
									>
										Pinned
									</Typography>
								) : null}

								{conversation.map((convo) => {
									if (!convo.is_pinned) return null;
									return (
										<ConvoCard
											convo={convo}
											key={convo.conversation_id}
										/>
									);
								})}
							</>
						</Stack>
					) : null}

					{isError && !isSuccess ? (
						<>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									height: "100%",
								}}
							>
								<CloudX
									fontSize={"4rem"}
									weight="duotone"
									color={theme.palette.grey[400]}
								/>
								<Typography
									pb={4}
									textAlign={"center"}
									variant="caption"
									fontSize={"12px"}
									color={theme.palette.grey[600]}
								>
									Sorry, We're having a problem <br />
									with the database.
								</Typography>
							</Box>
						</>
					) : null}

					{isLoading && !isSuccess ? (
						<>
							<Stack spacing={2} pb={2} height={"100%"}>
								<Typography
									variant="subtitle2"
									sx={{ color: "#676767" }}
								>
									All Chat
								</Typography>
								<ConvoCardSkeleton opacity={1} />
								<ConvoCardSkeleton opacity={0.8} />
								<ConvoCardSkeleton opacity={0.4} />
								<ConvoCardSkeleton opacity={0.3} />
							</Stack>
						</>
					) : null}

					{isSuccess ? (
						<Box
							className="scrollbar"
							sx={{
								flexGrow: 1,
								overflowY: "scroll",
								height: "100%",
								width: "100%",
							}}
						>
							<Stack spacing={2} pb={2}>
								<Typography
									variant="subtitle2"
									sx={{ color: "#676767" }}
								>
									All Chat
								</Typography>

								{sortedConversation.map((convo) => {
									if (convo.is_pinned || !convo.last_message)
										return null;
									return (
										<>
											<ConvoCard
												convo={convo}
												key={convo.conversation_id}
											/>
										</>
									);
								})}
							</Stack>
						</Box>
					) : null}
				</Stack>
			</Box>
		</>
	);
};

export default Chats;

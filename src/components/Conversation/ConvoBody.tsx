import { Box, Stack, Theme, useMediaQuery } from "@mui/material";
import React from "react";
import { faker } from "@faker-js/faker";
import {
	DocMsg,
	IChatMessage,
	LinkMsg,
	MediaMsg,
	ReplyMsg,
	TextMsg,
	TimeLine,
} from "./MsgTypes";

const Chat_History: IChatMessage[] = [
	{
		type: "msg",
		message: "Hi 👋🏻, How are ya ?",
		incoming: true,
		outgoing: false,
	},
	{
		type: "divider",
		text: "Today",
	},
	{
		type: "msg",
		message: "Hi 👋 Panda, not bad, u ?",
		incoming: false,
		outgoing: true,
	},
	{
		type: "msg",
		message: "Can you send me an abstarct image?",
		incoming: false,
		outgoing: true,
	},
	{
		type: "msg",
		message: "Ya sure, sending you a pic",
		incoming: true,
		outgoing: false,
	},

	{
		type: "msg",
		subtype: "img",
		message: "Here You Go",
		img: faker.image.abstract(),
		incoming: true,
		outgoing: false,
	},
	{
		type: "msg",
		message: "Can you please send this in file format?",
		incoming: false,
		outgoing: true,
	},

	{
		type: "msg",
		subtype: "doc",
		message: "Yes sure, here you go.",
		incoming: true,
		outgoing: false,
	},
	{
		type: "msg",
		subtype: "link",
		preview: faker.image.cats(),
		message: "Yep, I can also do that",
		incoming: true,
		outgoing: false,
	},
	{
		type: "msg",
		subtype: "reply",
		reply: "This is a reply",
		message: "Yep, I can also do that",
		incoming: false,
		outgoing: true,
	},
];

const ConvoBody = ({ isOptionOpen }: { isOptionOpen: boolean }) => {
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	return (
		<Box p={isSmallScreen ? 1 : 3}>
			<Stack spacing={3}>
				{Chat_History.map((el) => {
					switch (el.type) {
						case "divider":
							return <TimeLine el={el} />;

						case "msg":
							switch (el.subtype) {
								case "img":
									return (
										<MediaMsg
											el={el}
											isOptionOpen={isOptionOpen}
										/>
									);
								case "doc":
									return (
										<DocMsg
											el={el}
											isOptionOpen={isOptionOpen}
										/>
									);

								case "link":
									return (
										<LinkMsg
											el={el}
											isOptionOpen={isOptionOpen}
										/>
									);
								case "reply":
									return (
										<ReplyMsg
											el={el}
											isOptionOpen={isOptionOpen}
										/>
									);

								default:
									return (
										<TextMsg
											el={el}
											isOptionOpen={isOptionOpen}
										/>
									);
							}
						default:
							return <></>;
					}
				})}
			</Stack>
		</Box>
	);
};

export default ConvoBody;

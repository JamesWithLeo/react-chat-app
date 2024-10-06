import { Box, Stack } from '@mui/material'
import React from 'react';
import { faker } from '@faker-js/faker';
import {  DocMsg, IChatMessage, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from './MsgTypes';


const Chat_History:IChatMessage[] = [
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


const Message = ({ menu }:{menu:any}) => {
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((el) => {
          switch (el.type) {
            case 'divider':
              return <TimeLine el={el} />

            case 'msg':
              switch (el.subtype) {
                case 'img':
                  return <MediaMsg el={el} menu={menu} />
                case 'doc':
                  return <DocMsg el={el} menu={menu} />

                case 'link':
                  return <LinkMsg el={el} menu={menu} />
                case 'reply':
                  return <ReplyMsg el={el} menu={menu} />

                default:
                  return <TextMsg el={el} menu={menu} />
              }
            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  )
}

export default Message
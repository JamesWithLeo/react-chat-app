import {  Box, Stack} from '@mui/material';
import React from 'react';
import { useTheme } from "@mui/material/styles";
import Header from './Header';
import Footer from './Footer';

const Conversation = () => {
    const theme = useTheme();
  return (
    <Stack height={'100%'} maxHeight={'100vh'} width={'auto'}>

        {/* Chat header */}
        <Header/>
        {/* Msg */}
        <Box width={"100%"} sx={{flexGrow:1}}>
        
        </Box>
        {/* Chat footer */}
       <Footer/>
    </Stack>
  )
}

export default Conversation
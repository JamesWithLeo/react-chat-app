import { createSlice } from "@reduxjs/toolkit";

// define initial state
interface ISiderBar {
    open: boolean,
    type: string
}
interface IApp {
    sidebar: ISiderBar
}
const initialState: IApp = {
    sidebar:{
        open:false,
        type: "CONTACT",// can be CONTACT, STARRED,SHARED
    }
}

// create slice
const appSlice = createSlice({
    name:'app',
    initialState,
    reducers:{
        //Toggle sidebar
        ToggleSidebar(state,action){
            state.sidebar.open = !state.sidebar.open
        },
        UpdateSidebarType(state, action){
            state.sidebar.type = action.payload.type;
        }
    },
    extraReducers: {

    }
});

// export reducer
export default appSlice.reducer;

export const {ToggleSidebar, UpdateSidebarType} = appSlice.actions

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITypist } from "../../contexts/ChatContext";

const typistInit: ITypist[] = [];
const typistSlice = createSlice({
	name: "typist",
	initialState: typistInit,
	reducers: {
		addTypist: (state, action: PayloadAction<ITypist>) => {
			const payload = action.payload;
			return {
				...state,
				payload,
			};
		},
	},
});

export const { addTypist } = typistSlice.actions;
export default typistSlice.reducer;

import {
	Dialog,
	DialogContent,
	DialogTitle,
	Slide,
	Stack,
} from "@mui/material";
import React from "react";
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";

import { MagnifyingGlass } from "phosphor-react";
import { CallElement } from "../../components/CallElement";
// import { MembersList } from '../../data';

const Transition = React.forwardRef(function Transition(
	props: React.PropsWithChildren<{
		direction?: "up" | "down" | "left" | "right";
	}>,
	ref: React.Ref<unknown>,
) {
	const { children, direction = "up", ...otherProps } = props;
	return React.isValidElement(children) ? (
		<Slide direction={direction} ref={ref} {...otherProps}>
			{children}
		</Slide>
	) : null;
});

const StartCall = ({
	open,
	handleClose,
}: {
	open: boolean;
	handleClose: () => void;
}) => {
	return (
		<Dialog
			fullWidth
			maxWidth="xs"
			open={open}
			TransitionComponent={Transition}
			keepMounted
			sx={{ p: 4 }}
			onClose={handleClose}
		>
			<DialogTitle sx={{ mb: 3 }}>Start Call</DialogTitle>
			<DialogContent>
				{/* Form */}
				<Stack spacing={3}>
					<Stack sx={{ width: "100%" }}>
						<Search>
							<SearchIconWrapper>
								<MagnifyingGlass color="#709CE6" />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Search..."
								inputProps={{ "aria-label": "search" }}
							/>
						</Search>
					</Stack>
				</Stack>

				{/* Call List */}
				{/* {MembersList.map((el) => <CallElement {...el} />)} */}
			</DialogContent>
		</Dialog>
	);
};

export default StartCall;

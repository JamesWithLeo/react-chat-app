import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { ToggleSidebarOn } from "../../redux/slices/app";
import { List } from "@phosphor-icons/react";

export default function HamburgerNavbarButton() {
	const dispatch = useDispatch();
	return (
		<IconButton
			onClick={() => {
				dispatch(ToggleSidebarOn("NAVBAR"));
			}}
		>
			<List />
		</IconButton>
	);
}

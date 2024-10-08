import PropTypes from "prop-types";
// icons
import { Icon, IconifyIcon } from "@iconify/react";
// @mui
import { Box } from "@mui/material";
import { SystemStyleObject } from "@mui/system";
// ----------------------------------------------------------------------
Iconify.propTypes = {
	icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
	sx: PropTypes.object,
};

export default function Iconify({
	icon,
	sx,
}: {
	icon: IconifyIcon | string;
	sx: SystemStyleObject;
}) {
	return <Box component={Icon} icon={icon} sx={{ ...sx }} />;
}

import PropTypes from "prop-types";
//
import SettingsDrawer from "./drawer";
//
import ThemeContrast from "./ThemeContrast";
import ThemeRtlLayout from "./ThemeRtlLayout";
import ThemeColorPresets from "./ThemeColorPresets";
import ThemeLocalization from "./ThemeLocalization";
import { ReactNode } from "react";

// ----------------------------------------------------------------------

ThemeSettings.propTypes = {
	children: PropTypes.node.isRequired,
};

export default function ThemeSettings({ children }: { children: ReactNode }) {
	return (
		<ThemeColorPresets>
			<ThemeContrast>
				<ThemeLocalization>
					<ThemeRtlLayout>
						{children}
						<SettingsDrawer />
					</ThemeRtlLayout>
				</ThemeLocalization>
			</ThemeContrast>
		</ThemeColorPresets>
	);
}

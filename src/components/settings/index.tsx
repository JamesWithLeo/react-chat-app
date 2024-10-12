import SettingsDrawer from "./drawer";
import ThemeContrast from "./ThemeContrast";
import ThemeRtlLayout from "./ThemeRtlLayout";
import ThemeColorPresets from "./ThemeColorPresets";
import ThemeLocalization from "./ThemeLocalization";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";

export default function ThemeSettings({ children }: { children: ReactNode }) {
	const user = useSelector((state: AppState) => state.auth.user);
	return (
		<ThemeColorPresets>
			<ThemeContrast>
				<ThemeLocalization>
					<ThemeRtlLayout>
						{children}
						{user && user.email && user.uid && user.id ? (
							<SettingsDrawer />
						) : null}
					</ThemeRtlLayout>
				</ThemeLocalization>
			</ThemeContrast>
		</ThemeColorPresets>
	);
}

import { ReactNode, useEffect } from "react";
// rtl
import rtlPlugin from "stylis-plugin-rtl";
// emotion
import createCache, { StylisPlugin } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
// @mui
import { useTheme } from "@mui/material/styles";

export default function ThemeRtlLayout({ children }: { children: ReactNode }) {
	const theme = useTheme();

	useEffect(() => {
		document.dir = theme.direction;
	}, [theme.direction]);

	const cacheRtl = createCache({
		key: theme.direction === "rtl" ? "rtl" : "css",
		// Use type assertion to avoid type error
		stylisPlugins:
			theme.direction === "rtl"
				? [rtlPlugin as unknown as StylisPlugin]
				: undefined,
	});

	return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}

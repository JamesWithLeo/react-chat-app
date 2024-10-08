import { alpha, Theme } from "@mui/material/styles";

function getDirection(value = "bottom") {
	return {
		top: "to top",
		right: "to right",
		bottom: "to bottom",
		left: "to left",
	}[value];
}
interface IBgBlur {
	color?: string; // Optional: Background color (e.g., 'rgba(255,255,255,0.5)', '#ffffff', etc.)
	blur?: number; // Optional: Amount of blur to apply (default is 6)
	opacity?: number; // Optional: Opacity level (0 to 1) (default is 0.8)
}
interface IBgGradient {
	direction?: "top" | "right" | "bottom" | "left"; // Optional: Direction of the gradient (default is 'bottom')
	startColor?: string; // Optional: Start color of the gradient, can include percentage (e.g., '#ff0000 0%')
	endColor?: string; // Optional: End color of the gradient, can include percentage (e.g., '#000000 75%')
}
interface IBgImage {
	url?: string; // Optional: URL of the background image (default is '/assets/bg_gradient.jpg')
	direction?: "top" | "right" | "bottom" | "left"; // Optional: Direction of the gradient (default is 'bottom')
	startColor?: string; // Optional: Start color of the overlay gradient (default uses `theme.palette.grey[900]`)
	endColor?: string; // Optional: End color of the overlay gradient (default uses `theme.palette.grey[900]`)
}

export default function cssStyles(theme: Theme) {
	return {
		bgBlur: (props: IBgBlur) => {
			const color =
				props?.color || theme?.palette.background.default || "#000000";
			const blur = props?.blur || 6;
			const opacity = props?.opacity || 0.8;

			return {
				backdropFilter: `blur(${blur}px)`,
				WebkitBackdropFilter: `blur(${blur}px)`, // Fix on Mobile
				backgroundColor: alpha(color, opacity),
			};
		},
		bgGradient: (props: IBgGradient) => {
			const direction = getDirection(props?.direction);
			const startColor = props?.startColor || `${alpha("#000000", 0)} 0%`;
			const endColor = props?.endColor || "#000000 75%";

			return {
				background: `linear-gradient(${direction}, ${startColor}, ${endColor});`,
			};
		},
		bgImage: (props: IBgImage) => {
			const url = props?.url || "/assets/bg_gradient.jpg";
			const direction = getDirection(props?.direction);
			const startColor =
				props?.startColor ||
				alpha(theme?.palette.grey[900] || "#000000", 0.88);
			const endColor =
				props?.endColor ||
				alpha(theme?.palette.grey[900] || "#000000", 0.88);

			return {
				background: `linear-gradient(${direction}, ${startColor}, ${endColor}), url(${url})`,
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center center",
			};
		},
	};
}

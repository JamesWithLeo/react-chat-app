// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
	return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = "/";

export const PATH_DASHBOARD = {
	root: ROOTS_DASHBOARD,
	general: {
		app: path(ROOTS_DASHBOARD, "chats"),
	},
};

// PATH_DASHBOARD.general.app => "/"+"app" => /app

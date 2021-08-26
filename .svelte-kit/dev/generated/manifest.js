const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/userNotFound/[username].svelte"),
	() => import("../../../src/routes/register.svelte"),
	() => import("../../../src/routes/profile/[username].svelte"),
	() => import("../../../src/routes/login.svelte"),
	() => import("../../../src/routes/home.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/userNotFound/[username].svelte
	[/^\/userNotFound\/([^/]+?)\/?$/, [c[0], c[3]], [c[1]], (m) => ({ username: d(m[1])})],

	// src/routes/register.svelte
	[/^\/register\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/profile/[username].svelte
	[/^\/profile\/([^/]+?)\/?$/, [c[0], c[5]], [c[1]], (m) => ({ username: d(m[1])})],

	// src/routes/login.svelte
	[/^\/login\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/home.svelte
	[/^\/home\/?$/, [c[0], c[7]], [c[1]]]
];

export const fallback = [c[0](), c[1]()];
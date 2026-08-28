import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	name: "@datamate/cache",
	entries: ["./src/drizzle.ts"],
	externals: ["drizzle-orm"],
	declaration: true,
});

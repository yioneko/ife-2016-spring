import reactRefresh from "@vitejs/plugin-react-refresh";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

const rootDir = "./src";
const subPagesInput: string[] = [];
for (const part of fs.readdirSync(rootDir)) {
    const partDir = path.resolve(rootDir, part);
    if (fs.statSync(partDir).isDirectory()) {
        for (const task of fs.readdirSync(partDir)) {
            const taskDir = path.resolve(partDir, task);
            if (fs.statSync(taskDir).isDirectory())
                subPagesInput.push(path.resolve(taskDir, "index.html"));
        }
    }
}

export default defineConfig({
    root: rootDir,
    base: "/ife-2016-spring/",
    plugins: [reactRefresh()],
    build: {
        outDir: "../dist",
        rollupOptions: {
            input: [path.resolve(rootDir, "index.html"), ...subPagesInput],
        },
    },
});

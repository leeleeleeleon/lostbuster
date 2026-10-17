import { execSync } from "node:child_process";
import type { NextConfig } from "next";

// 푸터에 띄울 빌드 정보. Vercel 에서는 배포한 커밋을, 내 컴퓨터에서는 git 의 현재 커밋을 쓴다
const git = (cmd: string) => {
  try {
    return execSync(`git ${cmd}`, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};

const sha = process.env.VERCEL_GIT_COMMIT_SHA || git("rev-parse HEAD") || "local";
const message = (process.env.VERCEL_GIT_COMMIT_MESSAGE || git("log -1 --format=%s")).split("\n")[0];
const builtAt = new Date().toLocaleString("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const nextConfig: NextConfig = {
  env: {
    BUILD_SHA: sha.slice(0, 7),
    BUILD_MESSAGE: message,
    BUILD_TIME: builtAt,
  },
};

export default nextConfig;

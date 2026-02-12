export const GITHUB_USERNAME = "pranta-barua007"
export const GITHUB_REPO_NAME = "pb-ui-registry"
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}`
const LOCAL_URL = "http://localhost:4321"
const DEPLOYED_URL = `https://${GITHUB_USERNAME}.github.io/${GITHUB_REPO_NAME}`
export const SERVER_URL = process.env.NODE_ENV === "production"
    ? DEPLOYED_URL
    : LOCAL_URL
export const SERVER_URL_CLIENT_SIDE = import.meta.env.PROD
    ? DEPLOYED_URL
    : LOCAL_URL

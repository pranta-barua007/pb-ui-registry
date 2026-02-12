export const GITHUB_REPO_URL = "https://github.com/pranta-barua007/pb-ui-registry"
const LOCAL_URL = "http://localhost:4321"
const DEPLOYED_URL = "https://pranta-barua007.github.io/pb-ui-registry"
export const SERVER_URL = process.env.NODE_ENV === "production"
    ? DEPLOYED_URL
    : LOCAL_URL
export const SERVER_URL_CLIENT_SIDE = import.meta.env.PROD
    ? DEPLOYED_URL
    : LOCAL_URL

import { chatGPTSignInPath, getChatGPTUser } from "./chatgpt-auth";
import Storefront from "./storefront";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getChatGPTUser();
  return <Storefront user={user ? { name: user.displayName, email: user.email } : null} signInPath={chatGPTSignInPath("/")} />;
}

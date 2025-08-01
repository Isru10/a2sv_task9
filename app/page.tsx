import WelcomePage from "./components/WelcomPage";
import Landing from "./LandingPage/page";
import {getServerSession} from "next-auth";


export default async function Home() {
  const session = await getServerSession();

  return (
    <div>
      {session ? <Landing /> : <WelcomePage />}
    </div>
  );
}
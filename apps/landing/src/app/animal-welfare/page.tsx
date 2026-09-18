import CommonQuestions from "./components/CommonQuestions";
import FollowAnimalWelfare from "./components/FollowAnimalWelfare";
import Hero from "./components/Hero";
import NewsFeed from "./components/NewsFeed";
import { C } from "./components/theme";
import WelfareBrief from "./components/WelfareBrief";

export default function AnimalWelfareNewsPage() {
  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor: C.page,
      }}
    >
      <Hero />
      <WelfareBrief />
      
      <NewsFeed />

       {/* Follow Animal Welfare */}
      <section
        className="w-full"
        style={{
          backgroundColor: C.page,
        }}
      >
        <div className="mx-auto w-full max-w-[1232px] px-4 sm:px-6 lg:px-0">
          <div className="w-[720px] max-w-full">
            <FollowAnimalWelfare />
          </div>
        </div>
      </section>

      <CommonQuestions />
    </main>
  );
}
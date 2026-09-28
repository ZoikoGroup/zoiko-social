import CommonQuestions from "./components/CommonQuestions";
import FollowAnimalWelfare from "./components/FollowAnimalWelfare";
import LatestNewsHeader from "./components/LatestNewsHeader";
import NewsFeed from "./components/NewsFeed";
import { C } from "./components/theme";

export default function LatestAnimalNewsPage() {
  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor: C.page,
      }}
    >
      <LatestNewsHeader />

      <NewsFeed />

      {/* Follow Animal Welfare - same size as News Feed left column */}
      <section
        className="w-full"
        style={{
          backgroundColor: C.page,
        }}
      >
        <div className="mx-auto w-full max-w-[1032px] px-4 sm:px-6 lg:px-0">
          <div className="w-[720px] max-w-full">
            <FollowAnimalWelfare />
          </div>
        </div>
      </section>

      <CommonQuestions />
    </main>
  );
}
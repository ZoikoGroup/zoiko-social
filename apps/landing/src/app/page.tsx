import { redirect } from "next/navigation";

export default function LandingPage(): never {
  // The landing content lives at /home, which is also where the header's
  // "Home" link points. Redirect until a distinct root page is built.
  redirect("/home");
}

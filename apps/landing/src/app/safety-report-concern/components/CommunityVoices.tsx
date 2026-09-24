import Image from "next/image";
import { C } from "./theme";

/** Portraits and quotes for community voices. */
const VOICES: readonly {
  quote: string;
  name: string;
  role: string;
  photo: string;
}[] = [
  {
    quote:
      "“Zoiko’s reporting system helped my community stay safe. The team responds quickly and takes concerns seriously.”",
    name: "Sarah Chen",
    role: "Community Founder",
    photo: "/safety-report-concern/Sarah.png",
  },
  {
    quote:
      "“Being able to report concerns without an account is great. It makes it easy to help keep the platform safe for everyone.”",
    name: "Marcus Rodriguez",
    role: "Active Member",
    photo: "/safety-report-concern/Marcus.png",
  },
  {
    quote:
      "“Clear, straightforward reporting process. I felt confident that my concerns would be reviewed fairly and taken seriously.”",
    name: "Jordan Williams",
    role: "Volunteer Moderator",
    photo: "/safety-report-concern/Jordan.png",
  },
];

export default function CommunityVoices() {
  return (
    <section style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-12">
          <h2
            className="text-3xl font-extrabold leading-10"
            style={{ color: C.ink }}
          >
            What community members say
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {VOICES.map((v) => (
              <figure
                key={v.name}
                className="flex flex-col justify-between gap-6 rounded-[20px] p-6 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
                style={{ background: C.white, border: `1px solid ${C.line}` }}
              >
                <div className="flex flex-col gap-4">
                  <div
                    className="text-sm tracking-wide"
                    style={{ color: C.orange }}
                    aria-label="5 out of 5 stars"
                  >
                    ★★★★★
                  </div>
                  <blockquote
                    className="text-base leading-6 italic"
                    style={{ color: C.ink }}
                  >
                    {v.quote}
                  </blockquote>
                </div>

                <figcaption className="flex items-center gap-3 pt-2">
                  <Image
                    src={v.photo}
                    alt={`Portrait of ${v.name}`}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <div
                      className="text-sm font-bold leading-5"
                      style={{ color: C.ink }}
                    >
                      {v.name}
                    </div>
                    <div
                      className="text-xs leading-5"
                      style={{ color: C.muted }}
                    >
                      {v.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
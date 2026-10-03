import Image from "next/image";

const PLATFORMS = [
  {
    title: "iPhone & iPad",
    note: "iOS 13+",
    image: "/platform-apps-downloads-production/image 138.png",
  },
  {
    title: "Android",
    note: "Android 8.0+",
    image: "/platform-apps-downloads-production/image 139.png",
  },
  {
    title: "Web Browser",
    note: "Always Available",
    image: "/platform-apps-downloads-production/image 140.png",
  },
  {
    title: "Desktop Apps",
    note: "Coming Soon",
    image: "/platform-apps-downloads-production/image 141.png",
  },
] as const;

/**
 * "Choose Your Platform" — white rounded-3xl panel on a grey-97 band with
 * four outlined cards, per the Figma frame. Each card shows a 36px icon
 * (image 138–141 exports in the frame's card order: Apple, smartphone,
 * globe, desktop), a semibold title, and a muted note.
 */
export default function ChoosePlatform() {
  return (
    <section id="choose-platform" className="w-full bg-[#f1f4f5] px-6 py-14 lg:px-28">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 rounded-3xl border border-[#dce5e8] bg-white p-8">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center font-jakarta text-xl font-bold text-[#0f3d46]">Choose Your Platform</h2>
          <p className="text-center font-jakarta text-sm font-normal leading-6 text-[#55707c]">
            Select your device type to see recommended options. You can explore all supported platforms below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-px sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.title}
              className="flex flex-1 flex-col items-center gap-2 rounded-[20px] border-2 border-[#dce5e8] p-6"
            >
              <Image src={platform.image} alt="" width={36} height={36} className="size-9" />
              <p className="pt-2 text-center font-jakarta text-sm font-semibold text-[#0f3d46]">{platform.title}</p>
              <p className="text-center font-jakarta text-xs font-normal text-[#55707c]">{platform.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

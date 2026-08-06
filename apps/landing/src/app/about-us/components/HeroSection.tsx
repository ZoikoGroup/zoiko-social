export default function HeroSection() {
  return (
    <section className="relative h-[349px] overflow-hidden bg-gradient-to-br from-blue-600 to-teal-500">
      {/* Radial Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.10),transparent_50%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <div className="mb-2 rounded-full bg-white/20 px-5 py-1.5 backdrop-blur-md">
          <span className="font-inter text-[11px] font-bold uppercase tracking-widest text-white">
            About Zoikosocial
          </span>
        </div>

        <h1 className="font-montserrat text-3xl mt-10 font-bold text-white md:text-[42px] md:leading-[60px]">
          A Global Social Infrastructure for Animal
          <br className="hidden md:block" />
          Life, Community, and Trust
        </h1>

        <p className="mt-10 font-inter text-sm font-medium text-white/90 md:text-base">
          A trading name and division of Zoiko Media Corp
        </p>
      </div>
    </section>
  );
}
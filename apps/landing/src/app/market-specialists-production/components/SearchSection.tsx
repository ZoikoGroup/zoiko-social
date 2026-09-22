import SearchForm from "./SearchForm";
import SpecialistList from "./SpecialistList";
import SpecialtyFilterList from "./SpecialtyFilterList";

/**
 * Figma: desktop 584:23448 ("Search Section (UNIQUE: Sidebar + Form)") —
 * sidebar + form side by side above the results; mobile 584:23868 — the
 * same three blocks stacked in a single column.
 */
export default function SearchSection() {
  return (
    <section className="w-full bg-[#f7f9fa] py-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 lg:flex-row lg:items-start lg:px-[105px]">
        <SpecialtyFilterList />
        <div className="flex w-full flex-1 flex-col gap-12">
          <SearchForm />
          <SpecialistList />
        </div>
      </div>
    </section>
  );
}

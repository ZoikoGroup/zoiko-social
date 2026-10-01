"use client"
import React, { useState } from "react";
import { Code, Search, ChevronDown } from "lucide-react";

interface SoftwarePackage {
  id: string;
  name: string;
  version: string;
  product: string;
  license: string;
}

const softwarePackages: SoftwarePackage[] = [
  {
    id: "react",
    name: "React",
    version: "Web · version 18.3.1",
    product: "Web",
    license: "MIT License",
  },
  {
    id: "lodash",
    name: "Lodash",
    version: "Web · version 4.17.21",
    product: "Web",
    license: "MIT License",
  },
  {
    id: "chartjs",
    name: "Chart.js",
    version: "Web · version 4.4.1",
    product: "Web",
    license: "MIT License",
  },
  {
    id: "date-fns",
    name: "date-fns",
    version: "Web · version 3.6.0",
    product: "Web",
    license: "MIT License",
  },
  {
    id: "alamofire",
    name: "Alamofire",
    version: "iOS app · version 5.9.1",
    product: "iOS app",
    license: "MIT License",
  },
  {
    id: "kingfisher",
    name: "Kingfisher",
    version: "iOS app · version 7.11.0",
    product: "iOS app",
    license: "MIT License",
  },
  {
    id: "okhttp",
    name: "OkHttp",
    version: "Android app · version 4.12.0",
    product: "Android app",
    license: "Apache License 2.0",
  },
  {
    id: "retrofit",
    name: "Retrofit",
    version: "Android app · version 2.11.0",
    product: "Android app",
    license: "Apache License 2.0",
  },
  {
    id: "glide",
    name: "Glide",
    version: "Android app · version 4.16.0",
    product: "Android app",
    license: "BSD, part MIT and Apache 2.0",
  },
  {
    id: "ffmpeg",
    name: "FFmpeg",
    version: "iOS app · version 6.1",
    product: "iOS app",
    license: "LGPL 2.1",
  },
  {
    id: "sqlite",
    name: "SQLite",
    version: "Android app · version 3.45.1",
    product: "Android app",
    license: "Public domain",
  },
  {
    id: "noto-sans",
    name: "Noto Sans",
    version: "Web · version 2.013",
    product: "Web",
    license: "SIL Open Font License 1.1",
  },
];

export default function OpenSourceAndSoftwareNotices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("All products");

  const filteredPackages = softwarePackages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.license.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.version.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProduct =
      selectedProduct === "All products" || pkg.product === selectedProduct;

    return matchesSearch && matchesProduct;
  });

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Open-source and software notices
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Third-party software used in Zoiko Social, and its licenses.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-9 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">
              Search components
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Component or license"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors shadow-2xs"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">
              Product
            </label>
            <div className="relative">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors appearance-none shadow-2xs cursor-pointer"
              >
                <option value="All products">All products</option>
                <option value="Web">Web</option>
                <option value="iOS app">iOS app</option>
                <option value="Android app">Android app</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Software Packages List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col divide-y divide-gray-100">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                    <Code className="w-4 h-4 text-[#0A5C6F]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs md:text-sm font-bold text-[#111827]">
                      {pkg.name}
                    </span>
                    <span className="text-xs text-gray-400 font-normal">
                      {pkg.version}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-2xs">
                    {pkg.license}
                  </span>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-sm text-gray-500">
              No components found matching your search.
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-xs text-gray-400 font-normal px-2">
          Showing {filteredPackages.length} of {softwarePackages.length}{" "}
          packages &middot; sample list
        </div>
      </div>
    </section>
  );
}

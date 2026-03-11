"use client";
import { useState, useEffect } from "react";
import {
  getContent,
  saveContent,
  getStates,
  getDistricts,
  getTehsils,
  getVillages,
} from "@/utils/common";

const TABS = ["Home", "State", "District", "Tehsil", "Village"];

const initialFormState = {
  title: "",
  description: "",
  top_content: "",
  bottom_content: "",
  blog_content: "",
};

type FormField = keyof typeof initialFormState;

type State = { _id: string; state: string; state_slug: string };
type District = { _id: string; district: string; district_slug: string };
type Tehsil = { _id: string; tehsil: string; tehsil_slug: string };
type Village = { _id: string; village: string; village_slug: string };

const FIELDS: { name: FormField; label: string; type: string }[] = [
  { name: "title", label: "Title", type: "input" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "top_content", label: "Top Content", type: "textarea" },
  { name: "bottom_content", label: "Bottom Content", type: "textarea" },
  { name: "blog_content", label: "Blog Content", type: "textarea" },
];

function parseFormData(data: any) {
  return {
    title: data.title ?? "",
    description: data.description ?? "",
    top_content: data.top_content ?? "",
    bottom_content: data.bottom_content ?? "",
    blog_content:
      typeof data.blog_content === "object" && data.blog_content !== null
        ? JSON.stringify(data.blog_content, null, 2)
        : (data.blog_content ?? ""),
  };
}

function ContentPage() {
  const [activeTab, setActiveTab] = useState("Home");
  const [forms, setForms] = useState(
    Object.fromEntries(TABS.map((tab) => [tab, { ...initialFormState }])),
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState("");

  // ── selection state ──
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [tehsils, setTehsils] = useState<Tehsil[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );
  const [selectedTehsil, setSelectedTehsil] = useState<Tehsil | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  const [statesLoading, setStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [tehsilsLoading, setTehsilsLoading] = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(false);

  // ── reset only deeper selections on tab change ──
  useEffect(() => {
    if (activeTab === "Home") {
      setSelectedState(null);
      setSelectedDistrict(null);
      setSelectedTehsil(null);
      setSelectedVillage(null);
      setDistricts([]);
      setTehsils([]);
      setVillages([]);
    } else if (activeTab === "State") {
      setSelectedDistrict(null);
      setSelectedTehsil(null);
      setSelectedVillage(null);
      setDistricts([]);
      setTehsils([]);
      setVillages([]);
    } else if (activeTab === "District") {
      setSelectedTehsil(null);
      setSelectedVillage(null);
      setTehsils([]);
      setVillages([]);
    } else if (activeTab === "Tehsil") {
      setSelectedVillage(null);
      setVillages([]);
    }
    // Village — keep all selections intact
    setSuccess("");
  }, [activeTab]);

  // ── fetch states list ──
  useEffect(() => {
    if (!["State", "District", "Tehsil", "Village"].includes(activeTab)) return;
    setStatesLoading(true);
    getStates()
      .then((data) => setStates(Array.isArray(data) ? data : []))
      .catch(() => setStates([]))
      .finally(() => setStatesLoading(false));
  }, [activeTab]);

  // ── fetch districts when state selected ──
  useEffect(() => {
    if (
      !selectedState ||
      !["District", "Tehsil", "Village"].includes(activeTab)
    )
      return;
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedVillage(null);
    setDistricts([]);
    setTehsils([]);
    setVillages([]);
    setDistrictsLoading(true);
    getDistricts({ state_slug: selectedState.state_slug })
      .then((data) => setDistricts(Array.isArray(data) ? data : []))
      .catch(() => setDistricts([]))
      .finally(() => setDistrictsLoading(false));
  }, [selectedState, activeTab]);

  // ── fetch tehsils when district selected ──
  useEffect(() => {
    if (
      !selectedState ||
      !selectedDistrict ||
      !["Tehsil", "Village"].includes(activeTab)
    )
      return;
    setSelectedTehsil(null);
    setSelectedVillage(null);
    setTehsils([]);
    setVillages([]);
    setTehsilsLoading(true);
    getTehsils({
      state_slug: selectedState.state_slug,
      district_slug: selectedDistrict.district_slug,
    })
      .then((data) => setTehsils(Array.isArray(data) ? data : []))
      .catch(() => setTehsils([]))
      .finally(() => setTehsilsLoading(false));
  }, [selectedDistrict, activeTab]);

  // ── fetch villages when tehsil selected ──
  useEffect(() => {
    if (
      !selectedState ||
      !selectedDistrict ||
      !selectedTehsil ||
      activeTab !== "Village"
    )
      return;
    setSelectedVillage(null);
    setVillages([]);
    setVillagesLoading(true);
    getVillages({
      state_slug: selectedState.state_slug,
      district_slug: selectedDistrict.district_slug,
      tehsil_slug: selectedTehsil.tehsil_slug,
    })
      .then((data) => setVillages(Array.isArray(data) ? data : []))
      .catch(() => setVillages([]))
      .finally(() => setVillagesLoading(false));
  }, [selectedTehsil, activeTab]);

  // ── fetch Home content ──
  useEffect(() => {
    if (activeTab !== "Home") return;
    fetchAndSetContent("Home", {});
  }, [activeTab]);

  // ── fetch State content when state selected ──
  useEffect(() => {
    if (activeTab !== "State" || !selectedState) return;
    fetchAndSetContent("State", { state_slug: selectedState.state_slug });
  }, [selectedState, activeTab]);

  // ── fetch District content when district selected ──
  useEffect(() => {
    if (activeTab !== "District" || !selectedState || !selectedDistrict) return;
    fetchAndSetContent("District", {
      state_slug: selectedState.state_slug,
      district_slug: selectedDistrict.district_slug,
    });
  }, [selectedDistrict, activeTab]);

  // ── fetch Tehsil content when tehsil selected ──
  useEffect(() => {
    if (
      activeTab !== "Tehsil" ||
      !selectedState ||
      !selectedDistrict ||
      !selectedTehsil
    )
      return;
    fetchAndSetContent("Tehsil", {
      state_slug: selectedState.state_slug,
      district_slug: selectedDistrict.district_slug,
      tehsil_slug: selectedTehsil.tehsil_slug,
    });
  }, [selectedTehsil, activeTab]);

  // ── fetch Village content when village selected ──
  useEffect(() => {
    if (
      activeTab !== "Village" ||
      !selectedState ||
      !selectedDistrict ||
      !selectedTehsil ||
      !selectedVillage
    )
      return;
    fetchAndSetContent("Village", {
      state_slug: selectedState.state_slug,
      district_slug: selectedDistrict.district_slug,
      tehsil_slug: selectedTehsil.tehsil_slug,
      village_slug: selectedVillage.village_slug,
    });
  }, [selectedVillage, activeTab]);

  async function fetchAndSetContent(
    tab: string,
    params: Record<string, string>,
  ) {
    setFetching(true);
    setSuccess("");
    try {
      const data = await getContent(tab, params);
      if (data?.error) {
        setForms((prev) => ({ ...prev, [tab]: { ...initialFormState } }));
        return;
      }
      setForms((prev) => ({ ...prev, [tab]: parseFormData(data) }));
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setFetching(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForms((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [name]: value },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const slugParams: Record<string, string> = {};
      if (selectedState) slugParams.state_slug = selectedState.state_slug;
      if (selectedDistrict)
        slugParams.district_slug = selectedDistrict.district_slug;
      if (selectedTehsil) slugParams.tehsil_slug = selectedTehsil.tehsil_slug;
      if (selectedVillage)
        slugParams.village_slug = selectedVillage.village_slug;

      const result = await saveContent(activeTab, forms[activeTab], slugParams);

      if (result?.error) {
        setSuccess(`Failed to save: ${result.error}`);
        return;
      }
      setSuccess("Saved successfully!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to save.";
      setSuccess(`Failed to save: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  const editingLabel =
    activeTab === "Village"
      ? selectedVillage?.village
      : activeTab === "Tehsil"
        ? selectedTehsil?.tehsil
        : activeTab === "District"
          ? selectedDistrict?.district
          : activeTab === "State"
            ? selectedState?.state
            : "Home";

  const showForm =
    activeTab === "Home" ||
    (activeTab === "State" && !!selectedState) ||
    (activeTab === "District" && !!selectedDistrict) ||
    (activeTab === "Tehsil" && !!selectedTehsil) ||
    (activeTab === "Village" && !!selectedVillage);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Content Manager</h1>

      {/* Tabs */}
      <div className="mb-6 flex border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cascading selectors */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* State */}
        {["State", "District", "Tehsil", "Village"].includes(activeTab) && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">State</label>
            {statesLoading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <select
                className="w-52 rounded border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={selectedState?.state_slug ?? ""}
                onChange={(e) => {
                  setSelectedState(
                    states.find((s) => s.state_slug === e.target.value) ?? null,
                  );
                  setSuccess("");
                }}
              >
                <option value="">-- Select State --</option>
                {states.map((s) => (
                  <option key={s._id} value={s.state_slug}>
                    {s.state}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* District */}
        {["District", "Tehsil", "Village"].includes(activeTab) &&
          selectedState && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                District
              </label>
              {districtsLoading ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : (
                <select
                  className="w-52 rounded border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={selectedDistrict?.district_slug ?? ""}
                  onChange={(e) => {
                    setSelectedDistrict(
                      districts.find(
                        (d) => d.district_slug === e.target.value,
                      ) ?? null,
                    );
                    setSuccess("");
                  }}
                >
                  <option value="">-- Select District --</option>
                  {districts.map((d) => (
                    <option key={d._id} value={d.district_slug}>
                      {d.district}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

        {/* Tehsil */}
        {["Tehsil", "Village"].includes(activeTab) && selectedDistrict && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Tehsil</label>
            {tehsilsLoading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <select
                className="w-52 rounded border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={selectedTehsil?.tehsil_slug ?? ""}
                onChange={(e) => {
                  setSelectedTehsil(
                    tehsils.find((t) => t.tehsil_slug === e.target.value) ??
                      null,
                  );
                  setSuccess("");
                }}
              >
                <option value="">-- Select Tehsil --</option>
                {tehsils.map((t) => (
                  <option key={t._id} value={t.tehsil_slug}>
                    {t.tehsil}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Village */}
        {activeTab === "Village" && selectedTehsil && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Village</label>
            {villagesLoading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <select
                className="w-52 rounded border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={selectedVillage?.village_slug ?? ""}
                onChange={(e) => {
                  setSelectedVillage(
                    villages.find((v) => v.village_slug === e.target.value) ??
                      null,
                  );
                  setSuccess("");
                }}
              >
                <option value="">-- Select Village --</option>
                {villages.map((v) => (
                  <option key={v._id} value={v.village_slug}>
                    {v.village}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fetching ? (
            <p className="text-sm text-gray-400">Loading content...</p>
          ) : (
            <>
              {activeTab !== "Home" && (
                <p className="text-sm font-medium text-blue-600">
                  Editing: {editingLabel}
                </p>
              )}

              {FIELDS.map(({ name, label, type }) => (
                <div key={name} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    {label}
                    {name === "blog_content" && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        (JSON)
                      </span>
                    )}
                    {(name === "top_content" || name === "bottom_content") && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        (HTML)
                      </span>
                    )}
                  </label>
                  {type === "input" ? (
                    <input
                      name={name}
                      value={forms[activeTab][name]}
                      onChange={handleChange}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="rounded border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ) : (
                    <textarea
                      name={name}
                      value={forms[activeTab][name]}
                      onChange={handleChange}
                      rows={name === "blog_content" ? 6 : 4}
                      placeholder={
                        name === "blog_content"
                          ? `{ "key": "value" }`
                          : name === "top_content" || name === "bottom_content"
                            ? `<p>Enter HTML content</p>`
                            : `Enter ${label.toLowerCase()}`
                      }
                      className="resize-y rounded border p-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}

              {success && (
                <p
                  className={`text-sm ${
                    success.includes("Failed") || success.includes("Invalid")
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || fetching}
                className="w-fit rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : `Save ${editingLabel} Content`}
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}

export default ContentPage;

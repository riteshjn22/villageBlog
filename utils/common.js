import { REVALIDATE_TIME, HOST } from "@/lib/constants/constants";

export async function getStates(params = {}) {
  try {
    const url = new URL(`${HOST}/api/states`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME, tags: ["states"] }, // revalidate every 24 hours
    });

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    if (data?.allStates) {
      return data.allStates;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getStates error:", error);
    return [];
  }
}

export async function getDistricts(params = {}) {
  try {
    const url = new URL(`${HOST}/api/districts`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME, tags: ["districts"] }, // revalidate every 24 hours
    });

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    // If allDistricts array exists, return it (multiple districts)
    // Otherwise return the single district object
    if (data?.allDistricts) {
      return data.allDistricts;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getDistricts error:", error);
    return [];
  }
}

export async function getTehsils(params = {}) {
  try {
    const url = new URL(`${HOST}/api/tehsil`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME, tags: ["tehsils"] }, // revalidate every 24 hours
    });

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    // If allTehsils array exists, return it (multiple tehsils)
    // Otherwise return the single tehsil object
    if (data?.allTehsils) {
      return data.allTehsils;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getTehsils error:", error);
    return [];
  }
}

export async function getVillages(params = {}) {
  try {
    const url = new URL(`${HOST}/api/village`);

    // Add query parameters if provided
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME, tags: ["villages"] }, // revalidate every 24 hours
    });

    if (!res.ok)
      return {
        error: `Failed to fetch states: ${res.status}`,
        status: res.status,
      };

    const data = await res.json();

    // If allVillages array exists, return it (multiple villages)
    // Otherwise return the single village object
    if (data?.allVillages) {
      return data.allVillages;
    } else {
      return data;
    }
  } catch (error) {
    console.error("getVillages error:", error);
    return [];
  }
}

// GET /api/content?page_id=home
// GET /api/content?page_id=home
export async function getContent(page_id, params = {}) {
  try {
    const url = new URL(`${HOST}/api/content`);

    url.searchParams.append("page_id", page_id.toLowerCase());

    // Append any slugs or extra params (state_slug, district_slug, tehsil_slug, village_slug)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_TIME, tags: ["content", page_id] },
    });

    if (!res.ok)
      return {
        error: `Failed to fetch content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("getContent error:", error);
    return null;
  }
}

// POST /api/content
export async function saveContent(page_id, data = {}, params = {}) {
  try {
    const url = new URL(`${HOST}/api/content`);

    // Parse blog_content string → JSON if needed
    let blog_content = data.blog_content ?? null;
    if (typeof blog_content === "string" && blog_content.trim()) {
      try {
        blog_content = JSON.parse(blog_content);
      } catch {
        return { error: "Invalid JSON in blog_content" };
      }
    }

    // Resolve slug based on page_id or passed params
    // Priority: explicit params > page_id inference
    const slugs = {
      ...(params.state_slug && { state_slug: params.state_slug }),
      ...(params.district_slug && { district_slug: params.district_slug }),
      ...(params.tehsil_slug && { tehsil_slug: params.tehsil_slug }),
      ...(params.village_slug && { village_slug: params.village_slug }),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: page_id.toLowerCase(),
        ...slugs,
        ...data,
        blog_content,
      }),
    });

    if (!res.ok)
      return {
        error: `Failed to save content: ${res.status}`,
        status: res.status,
      };

    return await res.json();
  } catch (error) {
    console.error("saveContent error:", error);
    return { error: "Unexpected error while saving content" };
  }
}

// Formate Date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

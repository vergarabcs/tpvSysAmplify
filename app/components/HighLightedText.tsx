import React from "react";

interface HighLightedTextProps {
  searchString: string;
  children: string;
}

export function HighLightedText({ searchString, children }: HighLightedTextProps) {
  if (!searchString.trim()) return <>{children}</>;

  // Split search string into words, ignore case
  const words = searchString.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return <>{children}</>;

  // Build a regex to match any word, case-insensitive
  const regex = new RegExp(`(${words.map(w => escapeRegExp(w)).join("|")})`, "gi");

  // Split the string into parts, highlighting matches
  const parts = children.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} style={{ background: "#ffe066", color: "#222", fontWeight: "bold" }}>{part}</span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

// Escape regex special characters in a string
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

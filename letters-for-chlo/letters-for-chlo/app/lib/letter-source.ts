// Removes one letter object from the raw text of app/data/letters.ts,
// used by /api/consume-letter to auto-delete a letter from the actual
// GitHub repo right after Chlo reads it.
//
// This deliberately does simple text-splicing rather than pulling in a
// full TypeScript parser — it relies on the exact shape the hidden Letter
// Builder panel always generates:
//
//   {
//     id: "some-id",
//     moodKey: "somemood",
//     text: `...`,
//     signOff: `...`, (optional line)
//   },
//
// i.e. a 2-space-indented `{` ... `},` block inside the `letters` array,
// with the id given as a plain quoted string. If a letter was added by
// hand in a different shape, this safely does nothing (returns
// removed: false) rather than risking mangling the file — the caller
// still sends Noah his notification either way.
export function removeLetterFromSource(
  source: string,
  letterId: string
): { updated: string; removed: boolean } {
  const idMarker = `id: "${letterId}",`;
  const idIndex = source.indexOf(idMarker);
  if (idIndex === -1) return { updated: source, removed: false };

  // Walk back to the "{" that opens this object (2-space indented, on its
  // own line — exactly what the Letter Builder generates).
  const objectStart = source.lastIndexOf("\n  {", idIndex);
  if (objectStart === -1) return { updated: source, removed: false };

  // Walk forward to the "}," that closes this object.
  const closeMarker = "\n  },";
  const closeIndex = source.indexOf(closeMarker, idIndex);
  if (closeIndex === -1) return { updated: source, removed: false };
  const objectEnd = closeIndex + closeMarker.length;

  const updated = source.slice(0, objectStart) + source.slice(objectEnd);
  return { updated, removed: true };
}

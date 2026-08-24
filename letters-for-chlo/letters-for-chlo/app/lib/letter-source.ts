// Text-splicing helpers for editing the raw content of app/data/letters.ts
// as a plain string — used by the server routes that talk to the GitHub
// API directly (/api/consume-letter removes a letter after Chlo reads it,
// /api/add-letter publishes a new one straight from the hidden panel) so
// letters can be added and removed without Noah ever hand-editing code.
//
// Deliberately simple string splicing rather than a full TypeScript
// parser — both functions rely on the exact shape every letter is always
// written in:
//
//   {
//     id: "some-id",
//     moodKey: "somemood",
//     text: `...`,
//     signOff: `...`, (optional line)
//   },
//
// i.e. a 2-space-indented `{` ... `},` block inside the `letters` array,
// with the id given as a plain quoted string.

// Escapes text so it's safe to drop straight into a `${...}`-style
// template literal in the generated source — handles backslashes,
// backticks, and `${` sequences that would otherwise break the literal
// or (worse) get evaluated as code.
export function escapeForTemplateLiteral(raw: string): string {
  return raw
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

// Removes one letter object from the file. If a letter was added by hand
// in a different shape, this safely does nothing (returns removed: false)
// rather than risking mangling the file.
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

// Adds one new letter object into the file, inserted right before the
// array's closing `];` — so it lands inside `letters: Letter[] = [ ... ]`
// no matter whether the array is currently empty or already has entries
// in it. If the closing `];` can't be found (file was hand-edited into a
// very different shape), safely does nothing.
export function addLetterToSource(
  source: string,
  letter: { id: string; moodKey: string; text: string; signOff?: string }
): { updated: string; added: boolean } {
  const closeIndex = source.lastIndexOf("\n];");
  if (closeIndex === -1) return { updated: source, added: false };

  const signOffLine = letter.signOff
    ? `\n    signOff: \`${escapeForTemplateLiteral(letter.signOff)}\`,`
    : "";
  const block = `\n  {
    id: "${letter.id}",
    moodKey: "${letter.moodKey}",
    text: \`${escapeForTemplateLiteral(letter.text)}\`,${signOffLine}
  },`;

  const updated = source.slice(0, closeIndex) + block + source.slice(closeIndex);
  return { updated, added: true };
}

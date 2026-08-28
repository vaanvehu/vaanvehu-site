// Cart line keys mirror the design's merge logic exactly: lines are keyed by
// product + chosen upgrades + Pitam choice + note, so identical configurations
// merge and increment instead of creating separate lines.

export function setLineKey(setId: string, upgradeIds: string[], pitamChoice: string | null, note: string) {
  return `set:${setId}:${[...upgradeIds].sort().join(",")}|${pitamChoice ?? ""}|${note.trim()}`;
}

export function etrogLineKey(typeId: string, gradeId: string, pitamChoice: string | null, note: string) {
  return `etrog:${typeId}:${gradeId}|${pitamChoice ?? ""}|${note.trim()}`;
}

export function etrogGradePrefix(typeId: string, gradeId: string) {
  return `etrog:${typeId}:${gradeId}|`;
}

export function flatLineKey(category: string, productKey: string) {
  return `${category}:${productKey}`;
}

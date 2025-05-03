export function cleanData(data = []) {
  // Remove nulls and duplicates based on ID or combination
  const seen = new Set();
  return data.filter((item) => {
    if (!item) return false;
    const key = JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function formatTooltip(value, name, props) {
  if (typeof value === "number") {
    return [`$${value.toLocaleString()}`, name];
  }
  return [value, name];
}

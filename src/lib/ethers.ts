export function hasMetamask() {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
}

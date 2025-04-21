// if not file.d.ts, typescriupt will not recognize this file as a type definition file, and throw errors in ethers.js for example
interface Window {
  ethereum?: any;
}

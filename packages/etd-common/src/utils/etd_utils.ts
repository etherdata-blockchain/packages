import Web3 from "web3";

type Value = string | number | { high: any };

/**
 * Convert wei to etd
 * @param value
 */
export function weiToETD(value: Value) {
  try {
    let etdValue = "0";
    if (typeof value === "string" || typeof value === "number") {
      //@ts-ignore
      etdValue = value.toLocaleString("fullwide", { useGrouping: false });
    } else {
      etdValue = value.high.toString();
    }
    return Web3.utils.fromWei(etdValue, "ether");
  } catch (e) {
    console.log(value, e);
    return 0;
  }
}

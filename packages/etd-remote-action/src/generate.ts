import { SchemaGenerator } from "@etherdata-blockchain/etd-schema-generator";

(async () => {
  const generator = new SchemaGenerator();
  await generator.getSchema("src/config/interface.ts", "src/schemas");
})();

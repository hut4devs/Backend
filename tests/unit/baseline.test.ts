import { describe, expect, it } from "vitest";
import { backendName } from "../../src/index.js";

describe("backend baseline", () => {
  it("exposes the expected application identity", () => {
    expect(backendName).toBe("Hut4Devs Backend");
  });
});

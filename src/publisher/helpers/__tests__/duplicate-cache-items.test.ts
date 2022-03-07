import { getClientCacheDuplicates } from "../duplicate-cache-items";

describe(".getClientCacheDuplicates", () => {
  it("detecting duplicate keys in specific category (part of the cache item key before ':')", () => {
    expect(
      getClientCacheDuplicates({
        ROOT_QUERY: { test: 123 },
        "car:123": { testProperty: "test" },
        "car:456": { testProperty: "test" },
        "car:756": { testProperty2: "test2" },
        "car:856": { testProperty: "test", anotherProperty: 2 },
        "car:556": { testProperty: "test" },
        "car:656": { testProperty: "test2" },
        "ship:123": { testProperty: "test" },
        "ship:456": { testProperty: { nestedProperty: "test" } },
        "ship:556": { testProperty: { nestedProperty: "test" } },
      })
    ).toMatchObject([
      [
        { "car:123": { testProperty: "test" } },
        { "car:456": { testProperty: "test" } },
        { "car:556": { testProperty: "test" } },
      ],
      [
        { "ship:456": { testProperty: { nestedProperty: "test" } } },
        { "ship:556": { testProperty: { nestedProperty: "test" } } },
      ],
    ]);
  });
});

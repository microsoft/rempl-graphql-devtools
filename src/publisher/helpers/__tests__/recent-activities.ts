import { getRecentActivities, DATA_CHANGES } from "../recent-activities";

describe(".getRecentActivities", () => {
  it("get list of recent activities", () => {
    expect(
      getRecentActivities(
        ["test1", "test3", "test4", "test5"],
        ["test3", "test5", "test6"]
      )
    ).toEqual([
      { change: DATA_CHANGES.ADDED, data: "test1" },
      { change: DATA_CHANGES.ADDED, data: "test4" },
      { change: DATA_CHANGES.REMOVED, data: "test6" },
    ]);
    expect(getRecentActivities(["test1", "test3"], ["test3", "test5"])).toEqual(
      [
        { change: DATA_CHANGES.ADDED, data: "test1" },
        { change: DATA_CHANGES.REMOVED, data: "test5" },
      ]
    );

    expect(getRecentActivities(["test1", "test5"], ["test1", "test5"])).toEqual(
      []
    );

    expect(getRecentActivities(["test1"], ["test1", "test5"])).toEqual([
      { change: DATA_CHANGES.REMOVED, data: "test5" },
    ]);

    expect(getRecentActivities(["test1", "test5"], ["test1"])).toEqual([
      { change: DATA_CHANGES.ADDED, data: "test5" },
    ]);

    expect(getRecentActivities(["test1"], ["test3"])).toEqual([
      { change: DATA_CHANGES.ADDED, data: "test1" },
      { change: DATA_CHANGES.REMOVED, data: "test3" },
    ]);
  });
});

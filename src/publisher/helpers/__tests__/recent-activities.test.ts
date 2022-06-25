import { getRecentActivities, getRecentCacheActivities } from "../recent-activities";
import { RECENT_DATA_CHANGES_TYPES } from "../../../consts";

jest.mock("uuid", () => ({ v4: () => "test" }));

describe(".getRecentActivities", () => {
  test("get list of recent activities", () => {
    expect(
      getRecentActivities(
        ["test1", "test3", "test4", "test5"],
        ["test3", "test5", "test6"],
      ),
    ).toEqual([
      { change: RECENT_DATA_CHANGES_TYPES.ADDED, data: "test1", id: "test" },
      { change: RECENT_DATA_CHANGES_TYPES.ADDED, data: "test4", id: "test" },
      { change: RECENT_DATA_CHANGES_TYPES.REMOVED, data: "test6", id: "test" },
    ]);
    expect(
      getRecentActivities(
        ["test2", "test3", "test4"],
        ["test1", "test2", "test3", "test4"],
      ),
    ).toEqual([
      { change: RECENT_DATA_CHANGES_TYPES.REMOVED, data: "test1", id: "test" },
    ]);
    expect(getRecentActivities(["test1", "test3"], ["test3", "test5"])).toEqual(
      [
        { change: RECENT_DATA_CHANGES_TYPES.ADDED, data: "test1", id: "test" },
        {
          change: RECENT_DATA_CHANGES_TYPES.REMOVED,
          data: "test5",
          id: "test",
        },
      ],
    );

    expect(getRecentActivities(["test1", "test5"], ["test1", "test5"])).toEqual(
      [],
    );

    expect(getRecentActivities(["test1"], ["test1", "test5"])).toEqual([
      { change: RECENT_DATA_CHANGES_TYPES.REMOVED, data: "test5", id: "test" },
    ]);

    expect(getRecentActivities(["test1", "test5"], ["test1"])).toEqual([
      { change: RECENT_DATA_CHANGES_TYPES.ADDED, data: "test5", id: "test" },
    ]);

    expect(getRecentActivities(["test1"], ["test3"])).toEqual([
      { change: RECENT_DATA_CHANGES_TYPES.ADDED, data: "test1", id: "test" },
      { change: RECENT_DATA_CHANGES_TYPES.REMOVED, data: "test3", id: "test" },
    ]);
  });
});


describe(".getRecentCacheActivities", () => {
  test("when caches are the same the result should be empty", () => {
    const cache = {
      "car:123": {id:123, name: "mercedes"}
    }
    expect(getRecentCacheActivities(cache, cache)).toEqual([])
  });
  test("when caches are the same the result should be empty", () => {
    const cache = {
      "car:123": {id:123, name: "mercedes"}
    }
    const oldCache = {
      "car:789": {id:789, name: "audi"}
    }
    expect(getRecentCacheActivities(cache, oldCache)).toEqual(
        [
            {
             "change": "added",
               "data":  {
               "cacheValue":  {
                 "id": 123,
                 "name": "mercedes",
               },
               "key": "car:123",
             },
             "id": "test",
           },
            {
             "change": "removed",
             "data":  {
               "cacheValue":  {
                 "id": 789,
                 "name": "audi",
               },
               "key": "car:789",
             },
             "id": "test",
           },
         ]
    )

    expect(getRecentCacheActivities({...cache,...oldCache}, oldCache)).toEqual(
      [
          {
           "change": "added",
             "data":  {
             "cacheValue":  {
               "id": 123,
               "name": "mercedes",
             },
             "key": "car:123",
           },
           "id": "test",
         },
       ]
  )
  });
});


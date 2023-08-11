import * as Lib from "./lib";
import { describe, expect, test } from "@jest/globals";
import { Board, Column } from "./domain";

describe("reposition", () => {
  const testItems: Column.T[] = [
    {
      id: "test",
      boardId: "test-board",
      editing: false,
      position: 0,
      title: "This is a board"
    },
    {
      id: "test-2",
      boardId: "test-board",
      editing: false,
      position: 1,
      title: "This is a board"
    },
    {
      id: "test-3",
      boardId: "test-board",
      editing: false,
      position: 2,
      title: "This is a board"
    },
    {
      id: "test-4",
      boardId: "test-board",
      editing: false,
      position: 3,
      title: "This is a board"
    },
    {
      id: "test-5",
      boardId: "test-board-2",
      editing: false,
      position: 0,
      title: "This is a board"
    }
  ];


  test("returns a list of the same size", () => {
    const output = Lib.reposition(
      testItems as Lib.Repositionable<Board.Id>[],
      "test" as Column.Id,
      "test-board" as Board.Id,
      "boardId",
      2
    );

    expect(output.length).toBe(testItems.length);
  });

  test("properly reorders the items", () => {
    const output = Lib.reposition(
      testItems as Lib.Repositionable<Board.Id>[],
      "test" as Column.Id,
      "test-board" as Board.Id,
      "boardId",
      2
    );

    const expectedMap = {
      "test": 2,
      "test-2": 0,
      "test-3": 1,
      "test-4": 3
    }

    output.forEach(item => {
      if(item.id in expectedMap) {
        expect(item.position).toBe(expectedMap[item.id]);
      }
    });
  });

  test("moves items between containers when expected", () => {
    const output = Lib.reposition(
      testItems as Lib.Repositionable<Board.Id>[],
      "test" as Column.Id,
      "test-board-2" as Board.Id,
      "boardId",
      2
    );

    output.forEach(item => {
      if(item.id === "test") {
        expect((item as Column.T).boardId).toBe("test-board-2");
      }
    });
  });
  test("does not mutate original list", () => {
    const items = [...testItems];

    const output = Lib.reposition(
      items as Lib.Repositionable<Board.Id>[],
      "test" as Column.Id,
      "test-board-2" as Board.Id,
      "boardId",
      2
    );

    items[0].position = 11;

    expect(output.filter(item => item.position === 11)).toEqual([]);

    // Prove mutability of original list
    expect(items.filter(item => item.position === 11)).toEqual([items[0]]);
  });
});

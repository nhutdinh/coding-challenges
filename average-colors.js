/**
 * A dummy implementation of the design backend. Returns a promise which
 * resolves with the requested design.
 */
function fetchDesign(id) {
  return Promise.resolve({
    designId: id,
    shapes: [
      { shapeId: "basic-shape", color: { r: 55, g: 40, b: 255 }, children: [] },
      {
        shapeId: "person",
        color: { r: 255, g: 255, b: 252 },
        children: [
          {
            shapeId: "person-head",
            color: { r: 255, g: 255, b: 255 },
            children: [],
          },
          {
            shapeId: "person-body",
            color: { r: 205, g: 255, b: 252 },
            children: [],
          },
          {
            shapeId: "person-legs",
            color: { r: 100, g: 255, b: 252 },
            children: [],
          },
        ],
      },
      {
        shapeId: "zigzag-polygon",
        color: { r: 205, g: 255, b: 252 },
        children: [],
      },
      {
        shapeId: "fish",
        color: { r: 205, g: 255, b: 252 },
        children: [
          {
            shapeId: "fish-eyes",
            color: { r: 255, g: 255, b: 255 },
            children: [],
          },
          {
            shapeId: "fish-fin",
            color: { r: 100, g: 66, b: 74 },
            children: [
              {
                shapeId: "fish-fin-part-1",
                color: { r: 93, g: 54, b: 55 },
                children: [],
              },
              {
                shapeId: "fish-fin-part-2",
                color: { r: 33, g: 255, b: 255 },
                children: [],
              },
              {
                shapeId: "fish-fin-part-3",
                color: { r: 128, g: 53, b: 255 },
                children: [],
              },
            ],
          },
          {
            shapeId: "fish-tail",
            color: { r: 255, g: 5, b: 255 },
            children: [],
          },
        ],
      },
      {
        shapeId: "person",
        color: { r: 255, g: 255, b: 252 },
        children: [
          {
            shapeId: "person-head",
            color: { r: 255, g: 255, b: 255 },
            children: [],
          },
          {
            shapeId: "person-body",
            color: { r: 205, g: 255, b: 252 },
            children: [],
          },
          {
            shapeId: "person-legs",
            color: { r: 100, g: 255, b: 252 },
            children: [],
          },
        ],
      },
    ],
  });
}

function fetch(url) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`dummy data for ${url}`), Math.random() * 4000);
  });
}
function round(number) {
  return Math.round(10 * number) / 10;
}
function averageColor(shape) {
  if (shape.children.length === 0) return { ...shape.color };
  const nChildren = shape.children.length;

  let color = shape.children.reduce(
    (memo, childShape) => {
      const childSum = averageColor(childShape);
      return {
        r: memo.r + childSum.r,
        b: memo.b + childSum.b,
        g: memo.g + childSum.g,
      };
    },
    { r: 0, g: 0, b: 0 }
  );
  /** Assume average color of a shape will be average color of itself and its children */
  color = {
    r: round((color.r / nChildren + shape.color.r) / 2),
    g: round((color.g / nChildren + shape.color.g) / 2),
    b: round((color.b / nChildren + shape.color.b) / 2),
  };
  return color;
}
function solution() {
  let a = [];
  for (let i = 0; i < 10; i++) {
    a.push(fetchDesign(i + 1));
  }
  Promise.all(a).then((responses) => {
    responses.forEach((response) => {
      let sumColor = response.shapes.reduce(
        (memo, item) => {
          let color = averageColor(item);
          return {
            r: memo.r + color.r,
            b: memo.b + color.b,
            g: memo.g + color.g,
          };
        },
        { r: 0, g: 0, b: 0 }
      );
      const nShapes = response.shapes.length;
      console.log(`Design ${response.designId}`, {
        r: round(sumColor.r / nShapes),
        g: round(sumColor.g / nShapes),
        b: round(sumColor.b / nShapes),
      });
    });
  });
}
solution();

///////////////////////////////// UNIT TEST /////////////

function test(testName, testFn, expectedResult) {
  console.log(testName);
  const actualResult = testFn();
  const passed = isEqual(actualResult, expectedResult);
  const result = passed ? ["\x1b[32m", "PASS"] : ["\x1b[31m", "FAIL"];
  console.log.apply(null, result);
  if (!passed) {
    console.log("EXPECTED RESULT", expectedResult);
    console.log("ACTUAL RESULT ", actualResult);
  }
  console.log("\x1b[0m");
}
function isEqual(a, b) {
  if (a === b) return true;

  if (typeof a != typeof b) return false;

  if (typeof a == "number" && isNaN(a) && isNaN(b)) return true;

  if (typeof a == "number") {
    if (a != b) return false;
  }

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);

  if (aKeys.length != bKeys.length) return false;

  if (
    !aKeys.every(function (key) {
      return b.hasOwnProperty(key);
    })
  )
    return false;

  const isAllSame = aKeys.every(function (key) {
    return isEqual(a[key], b[key]);
  });
  if (!isAllSame) return false;
  return true;
}
test(
  "if doesn't have children, should return its color",
  () => {
    let color = averageColor({
      shapeId: "basic-shape",
      color: { r: 1, g: 2, b: 3 },
      children: [],
    });
    return color;
  },
  { r: 1, g: 2, b: 3 }
);
test(
  "if have children, should return average color of its color and average color of its children",
  () => {
    let color = averageColor({
      shapeId: "person",
      color: { r: 1, g: 2, b: 3 },
      children: [
        {
          shapeId: "person-head",
          color: { r: 2, g: 3, b: 5 },
          children: [],
        },
        {
          shapeId: "person-body",
          color: { r: 4, g: 5, b: 1 },
          children: [],
        },
        {
          shapeId: "person-legs",
          color: { r: 6, g: 2, b: 3 },
          children: [
            {
              shapeId: "person-legs-1",
              color: { r: 2, g: 3, b: 5 },
              children: [],
            },
            {
              shapeId: "person-legs-2",
              color: { r: 4, g: 5, b: 1 },
              children: [],
            },
            {
              shapeId: "person-legs-3",
              color: { r: 6, g: 2, b: 3 },
              children: [],
            },
          ],
        },
      ],
    });
    return color;
  },
  { r: 2.3, g: 2.8, b: 3 }
);

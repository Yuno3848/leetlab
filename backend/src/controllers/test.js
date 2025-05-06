const arr = [
  {
    testCases: 1,
    isPassed: true,
    stdout: "300",
    expected: ["300", "-1100", "0"],
    stderr: null,
    compile_output: null,
    status: undefined,
    memory: "7000KB",
    time: "0.026 s",
  },
  {
    testCases: 2,
    isPassed: true,
    stdout: "-1100",
    expected: ["300", "-1100", "0"],
    stderr: null,
    compile_output: null,
    status: undefined,
    memory: "6820KB",
    time: "0.025 s",
  },
];

const arr1 = arr.map((r) => r.stdout);
console.log(arr1);
console.log(typeof JSON.stringify(arr1));

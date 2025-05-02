import axios from "axios";
export const getJudge0LanguageId = (Language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[Language.toUpperCase()] || null; //lanugageMap[PYTHON] = 71
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","), // [token1,token2,token3] = token1,token2,token3
          base64_encoded: false,
        },
      }
    );
    /*
    data:{
    submission:{
    },
    testcase2 =3
    }
    */
    const results = data.submissions;
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );
   
    if (isAllDone) return results;

    await sleep(1000);
  }
};
export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions }
  );

  return data; // [{token},{token},{token}]
};

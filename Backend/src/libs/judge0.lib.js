import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const getJudge0LanguageId = (language) => {
  const LanguageMap = {
    JAVA: 62,
    JAVASCRIPT: 63,
    PYTHON: 71,
  };
  return LanguageMap[language.toUpperCase()];
};

// const sleep = (time) =>
//   new Promise((resolve) => {
//     setTimeout(resolve, time);
//   });

// const submitBatch = async (submissions) => {
//   const { data } = await axios.post(
//     `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
//     { submissions },
//   );

//   console.log("Submission Batch:", data);
//   return data; //[{token},{token},{token}]
// };

const submitBatch = async (submissions) => {
  try {
    const { data } = await axios.post(
      `${process.env.SULU_API_URL}/submissions/batch`,
      { submissions },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.SULU_API_KEY}`,
        },
      },
    );

    console.log("Submission Batch:", data);
    return data; // [{token}, {token}, ...]
  } catch (error) {
    console.error(
      "Sulu Submit Batch Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

// on first submission we get array of tokens from judge0

// const pollBatchResults = async (Tokens) => {
//   while (true) {
//     const { data } = await axios.get(
//       `${process.env.JUDGE0_API_URL}/submissions/batch`,
//       {
//         params: {
//           tokens: Tokens.join(","),
//           base64_encoded: false,
//         },
//       },
//     );

//     const results = data.submissions;

//     const isAllSubmitted = results.every(
//       (result) => result.status.id !== 1 && result.status.id !== 2,
//     );

//     if (isAllSubmitted) return results;
//     await sleep(1000);
//   }
// };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pollBatchResults = async (tokens) => {
  while (true) {
    try {
      const { data } = await axios.get(
        `${process.env.SULU_API_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(","),
            base64_encoded: false,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.SULU_API_KEY}`,
          },
        },
      );

      const results = data.submissions;

      const isAllSubmitted = results.every(
        (result) => result.status.id !== 1 && result.status.id !== 2,
      );

      if (isAllSubmitted) return results;

      await sleep(1000);
    } catch (error) {
      console.error("Polling Error:", error?.response?.data || error.message);
      throw error;
    }
  }
};

const getLanguageName = (languageId) => {
  const LanguageMap = {
    62: "JAVA",
    63: "JAVASCRIPT",
    71: "PYTHON",
  };
  return LanguageMap[languageId];
};

export { getJudge0LanguageId, submitBatch, pollBatchResults, getLanguageName };

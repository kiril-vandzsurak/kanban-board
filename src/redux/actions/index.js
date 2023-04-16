import { Octokit } from "octokit";
import axios from "axios";
export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";

export const fetchDataRequest = () => {
  return {
    type: FETCH_DATA_REQUEST,
  };
};

export const fetchDataSuccess = (data) => {
  return {
    type: FETCH_DATA_SUCCESS,
    payload: data,
  };
};

export const fetchDataFailure = (error) => {
  return {
    type: FETCH_DATA_FAILURE,
    payload: error,
  };
};

function extractOwnerAndRepoFromUrl(url) {
  const regex = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(regex);
  if (!match) {
    throw new Error("Invalid GitHub URL");
  }
  const owner = match[1];
  const repo = match[2];
  return { owner, repo };
}

export const fetchData = (url) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  return async (dispatch) => {
    dispatch(fetchDataRequest());

    try {
      const { owner, repo } = extractOwnerAndRepoFromUrl(url);
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/issues",
        {
          owner,
          repo,
        }
      );

      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }

      const processedData = [
        {
          id: "todo",
          title: "To do",
          tasks: data.map((task) => ({
            id: task.id.toString(),
            title: task.title,
            updates: [
              {
                date: task.updated_at,
                editor: task.user.login,
              },
            ],
          })),
        },
        {
          id: "in-progress",
          title: "In Progress",
          tasks: [],
        },
        {
          id: "done",
          title: "Done",
          tasks: [],
        },
      ];

      dispatch(fetchDataSuccess(processedData));
    } catch (error) {
      dispatch(fetchDataFailure(error.message));
    }
  };
};

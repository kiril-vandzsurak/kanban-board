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

export const fetchData = (url) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());

    try {
      const result = await axios.get(`${url}`);

      if (!Array.isArray(result.data)) {
        throw new Error("Data is not an array");
      }

      const data = [
        {
          id: "todo",
          title: "To do",
          tasks: result.data.map((task) => ({
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

      dispatch(fetchDataSuccess(data));
    } catch (error) {
      dispatch(fetchDataFailure(error.message));
    }
  };
};

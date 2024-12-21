import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const BASE_URL = "http://127.0.0.1:8000/api/";
  const ADD_TODOS = `${BASE_URL}create/`;
  const REMOVE_TODOS = `${BASE_URL}delete/`;
  const UPDATE_TODOS = `${BASE_URL}update/`;
  const LOGIN_URL = `${BASE_URL}token/`;
  const UPDATE_TOKEN = `${BASE_URL}token/refresh/`;

  // () => arrow function will set them only first time
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      update_token();
    }
    const fourMinutes = 1000 * 60 * 4;
    const interval = setInterval(() => {
      if (authTokens) {
        update_token();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);


  const login_user = async (username, password) => {
    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        const data = response.data
        console.log("Login successfully");
        localStorage.setItem("authTokens", JSON.stringify(data));
        setUser(jwtDecode(data.access))
        setAuthTokens(JSON.parse(localStorage.getItem('authTokens')))
        return response.data;
      } else {
        console.log("Error occur during login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
  };

  const update_token = async () => {
    try {
      console.log("update token called tokens are: ", authTokens);
      // Post request to refresh the token
      const response = await axios.post(UPDATE_TOKEN, {
        "refresh": authTokens?.refresh,
      });

      console.log(response)
      if (response.status == 200) {
        const data = response.data;
        // Update authentication tokens and user info
        localStorage.setItem("authTokens", JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
      } else {
        // If response is not successful, log out
        console.error("Failed to refresh token: Invalid response");
        logout();
      }
    } catch (error) {
      // Catch and log any errors
      console.error("Error refreshing token:", error);

      // Log out if token refresh fails
      logout();
    } finally {
      // Ensure loading state is reset
      if (loading) {
        setLoading(false);
      }
    }
  };

  const add_todo = async (todoName) => {
    const response = await axios.post(
      ADD_TODOS,
      {
        todo_name: todoName,
      },
      {
        headers: {
          Authorization: "Bearer " + authTokens.access,
        },
      }
    );
    return response.data;
  };

  const remove_todo = async (todoId) => {
    const response = await axios.delete(REMOVE_TODOS + todoId, {
      headers: {
        Authorization: "Bearer " + authTokens.access,
      },
    });
    return response.data;
  };

  const update_todo = async (todoId, data) => {
    const response = await axios.put(UPDATE_TODOS + todoId, (data = data), {
      headers: {
        Authorization: "Bearer " + authTokens.access,
      },
    });
    return response.data;
  };

  const contextData = {
    user: user,
    setUser: setUser,
    authTokens: authTokens,
    add_todo: add_todo,
    update_todo: update_todo,
    remove_todo: remove_todo,
    login_user: login_user,
    logout: logout,
    update_token: update_token,
  };

  console.log("Loading value", loading)

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

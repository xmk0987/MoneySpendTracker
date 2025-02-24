"use server"
import axios, { AxiosInstance } from "axios";
import { parse, serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import spankkiHttpAgent from "@/lib/spankki/spankkiHttpAgent";

const SPANKKI_API_BASE_URL =
  "https://s-pankki-api-sandbox.crosskey.io/open-banking/v3.1.6/aisp/";

export async function createSpankkiApi(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AxiosInstance> {
  let cookies = parse(req.headers.cookie || "");
  let accessToken = cookies.access_token;

  if (!accessToken && cookies.refresh_token) {
    try {
      const refreshResponse = await axios.post(
        "http://localhost:3000/api/spankki/auth/refresh",
        { refresh_token: cookies.refresh_token }
      );
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in,
      } = refreshResponse.data;

      res.setHeader("Set-Cookie", [
        serialize("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: expires_in,
          path: "/",
        }),
        serialize("refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        }),
      ]);

      accessToken = newAccessToken;
      cookies = {
        ...cookies,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      console.error("Immediate token refresh failed:", error);
    }
  }

  const instance = axios.create({
    baseURL: SPANKKI_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-API-Key": process.env.SPANKKI_API_KEY,
    },
    httpsAgent: spankkiHttpAgent,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        console.log("401 intercepted, attempting token refresh.");
        originalRequest._retry = true;
        const cookies = parse(req.headers.cookie || "");
        const refreshToken = cookies.refresh_token;
        if (!refreshToken) {
          console.error("No refresh token available.");
          return Promise.reject(error);
        }
        try {
          const refreshResponse = await axios.post(
            "http://localhost:3000/api/spankki/auth/refresh",
            { refresh_token: refreshToken }
          );
          const {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            expires_in,
          } = refreshResponse.data;

          res.setHeader("Set-Cookie", [
            serialize("access_token", newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: expires_in,
              path: "/",
            }),
            serialize("refresh_token", newRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 30,
              path: "/",
            }),
          ]);

          instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          await new Promise((resolve) => setTimeout(resolve, 200));
          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh in interceptor failed:", refreshError);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

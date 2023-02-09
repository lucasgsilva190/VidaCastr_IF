import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";
import { auth } from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { initializeFirebaseAdmin } from "./fbAdmin";

type PageAuthRequiredOptions = {
  returnTo?: string;
  routeAllowedTo?: string[];
};

export async function validateToken(token: string) {
  const app = initializeFirebaseAdmin();

  return new Promise<DecodedIdToken>((resolve, reject) => {
    auth(app).verifyIdToken(token, false).then(resolve).catch(reject);
  });
}

export function pageAuthRequired<T extends { [key: string]: any }>(
  fn: GetServerSideProps<T>,
  options?: PageAuthRequiredOptions
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    try {
      const { token } = parseCookies(context);
      await validateToken(token);

      return await fn(context);
    } catch (error) {
      return {
        redirect: {
          destination: options?.returnTo || "/login",
          permanent: false,
        },
      };
    }
  };
}

export function pageGuestRequired<T extends { [key: string]: any }>(
  fn: GetServerSideProps<T>,
  options?: PageAuthRequiredOptions
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    try {
      const { token } = parseCookies(context);
      await validateToken(token);

      return {
        redirect: {
          destination: options?.returnTo || "/",
          permanent: false,
        },
      };
    } catch (error) {
      return await fn(context);
    }
  };
}

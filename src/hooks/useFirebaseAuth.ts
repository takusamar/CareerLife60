import { useSigninCheck } from "reactfire";

export function useAuthUser() {
  const { data, status, error } = useSigninCheck();
  if (status === "loading") {
    return undefined;
  }
  if (error) {
    console.error(error);
    return undefined;
  }
  return data.user;
}

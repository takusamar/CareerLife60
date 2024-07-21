import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import {
  Auth,
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { setUser } from "../services/Firebase";

export const Route = createLazyFileRoute("/signup-form")({
  component: SignUpFormPage,
});

// 過去100年分の配列
const today = dayjs();
const yearList = [...Array(100)].map((_, i) => today.year() - 99 + i);
// 12ヶ月分の月の配列
const monthList = [...Array(12)].map((_, i) => i + 1);

interface SignUpFormInput {
  displayName: string;
  birthYear: string;
  birthMonth: string;
  name: string;
  password: string;
  confirmedPassword: string;
}

function SignUpFormPage() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    trigger,
  } = useForm<SignUpFormInput>();
  const navigate = useNavigate();
  const toast = useToast();

  const email = window.localStorage.getItem("emailForSignIn");

  async function signIn(auth: Auth, email: string) {
    if (!auth.currentUser || auth.currentUser.email != email) {
      // 未ログインまたは異なるユーザーの場合、再度ログイン
      const credential = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );
      return credential.user;
    } else {
      return auth.currentUser;
    }
  }

  const _handleSubmit = async (data: SignUpFormInput) => {
    const email = data.name;
    try {
      if (!email) {
        toast({
          title: "不正なURLです",
          status: "error",
          duration: 3000,
        });
        return;
      }

      const auth = getAuth();
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        toast({
          title: "不正なURLです",
          status: "error",
          duration: 3000,
        });
        return;
      }

      // 1. メールアドレスに送った登録情報と同じであること
      const user = await signIn(auth, email);

      // 2. 登録完了後のメールアドレスにパスワード付与
      await updatePassword(user, data.password);

      // 3. ユーザー情報をDBに登録
      const birth = dayjs()
        .year(Number(data.birthYear))
        .month(Number(data.birthMonth) - 1)
        .startOf("month");
      await setUser(user.uid, {
        name: data.displayName,
        birth: birth.toDate(),
      });

      toast({
        title: "ユーザー情報を登録しました",
        status: "success",
        duration: 3000,
      });
      navigate({ to: "/$userId", params: { userId: user.uid } });
    } catch (error) {
      console.error(error);
      toast({
        title: "エラーが発生しました",
        status: "error",
        duration: 3000,
      });
    }
  };

  if (email === null) {
    return <div>不正なURLです</div>;
  }

  return (
    <Box py={8} w="full">
      <Text textStyle="h6">アカウント情報の入力</Text>
      <form onSubmit={handleSubmit(_handleSubmit)}>
        <VStack w="full" pt={4} alignItems="start">
          <FormControl isRequired>
            <FormLabel htmlFor="name" textStyle="subtitle1">
              メールアドレス
            </FormLabel>
            <Input
              {...register("name", { required: true })}
              value={email ?? undefined}
              isReadOnly
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="displayName" textStyle="subtitle1">
              ユーザーネーム
            </FormLabel>
            <Input
              {...register("displayName", { required: true })}
              placeholder="ユーザーネーム"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="start" textStyle="subtitle1">
              生年月
            </FormLabel>
            <HStack>
              <Select
                width={24}
                {...register("birthYear", { required: true })}
                placeholder="----"
                defaultValue={today.year()}
              >
                {yearList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <Text>年</Text>
              <Select
                width={20}
                {...register("birthMonth", { required: true })}
                placeholder="--"
                defaultValue={today.month() + 1}
              >
                {monthList.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </Select>
              <Text>月</Text>
            </HStack>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="password" textStyle="subtitle1">
              パスワード
            </FormLabel>
            <Input
              type="password"
              placeholder="パスワード"
              {...register("password", {
                required: true,
                minLength: {
                  value: 8,
                  message: "パスワードは8文字以上が必要です",
                },
                onBlur: () => {
                  if (getValues("confirmedPassword")) {
                    trigger("confirmedPassword");
                  }
                },
              })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="confirmedPassword" textStyle="subtitle1">
              パスワード確認
            </FormLabel>
            <Input
              type="password"
              placeholder="パスワード確認"
              {...register("confirmedPassword", {
                required: true,
                validate: (value) =>
                  value === getValues("password") || "パスワードが一致しません",
              })}
            />
          </FormControl>
        </VStack>
        <Box w="full" pt={8} px={8}>
          <Button
            type="submit"
            isDisabled={!isValid}
            w="full"
            borderRadius={100}
          >
            登録
          </Button>
        </Box>
      </form>
    </Box>
  );
}

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { validateEmail } from "../utils/utils";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

export const Route = createLazyFileRoute("/signup")({
  component: SignUpPage,
});

const notes = `
本サービスでは年齢に合わせて年表を作成するため、あなたの生年月をお聞きします。
（誕生日は不要です）
`;

interface SignUpInput {
  email: string;
  checked: boolean;
}

function SignUpPage() {
  const auth = getAuth();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpInput>();
  const navigate = useNavigate();
  const toast = useToast();

  const _handleSubmit = async (data: SignUpInput) => {
    // メールアドレスのバリデーション
    if (!validateEmail(data.email)) {
      toast({
        title: "不正なメールアドレスです",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // メールアドレスを送信
    const baseUrl = window.location.origin;
    await sendSignInLinkToEmail(auth, data.email, {
      url: `${baseUrl}/signup-form`,
      handleCodeInApp: true,
    });
    window.localStorage.setItem("emailForSignIn", data.email);

    toast({
      title: "招待メールを送信しました。ご確認ください",
      status: "success",
      duration: 3000,
    });
    navigate({ to: `/` });
  };

  return (
    <Box py={8}>
      <Text textStyle="h6">アカウント登録</Text>
      <form onSubmit={handleSubmit(_handleSubmit)}>
        <VStack pt={4} alignItems="start" spacing={8}>
          <FormControl isRequired>
            <FormLabel htmlFor="email" textStyle="subtitle1">
              メールアドレス
            </FormLabel>
            <Input
              type="email"
              {...register("email", { required: true })}
              placeholder="メールアドレス"
            />
          </FormControl>
          <VStack spacing={4} px={8}>
            <Text textStyle="caption" whiteSpace="pre-wrap">
              {notes}
            </Text>
            <Checkbox
              {...register("checked", { required: true })}
              // isChecked={isChecked}
              // onChange={(e) => setIsChecked(e.target.checked)}
            >
              <Text textStyle="caption">同意する</Text>
            </Checkbox>
            <Box w="full" px={8}>
              <Button
                borderRadius={100}
                w="full"
                type="submit"
                isDisabled={!isValid}
              >
                メールアドレスを送信
              </Button>
            </Box>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
}

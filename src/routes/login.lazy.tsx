import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createLazyFileRoute("/login")({
  component: LoginPage,
});

interface LoginInput {
  email: string;
  password: string;
}

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginInput>();
  const navigate = useNavigate();
  const toast = useToast();

  const _handleSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      // ログイン処理
      const credential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      toast({
        title: "ログインしました",
        status: "success",
        duration: 3000,
      });
      navigate({ to: "/$userId", params: { userId: credential.user.uid } });
    } catch (error) {
      toast({
        title: "ログインに失敗しました",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box py={8}>
      <Text textStyle="h6">ログイン</Text>
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
          <FormControl isRequired>
            <FormLabel htmlFor="password" textStyle="subtitle1">
              パスワード
            </FormLabel>
            <Input
              type="password"
              placeholder="パスワード"
              {...register("password", { required: true })}
            />
          </FormControl>
          <Box w="full" px={16}>
            <Button
              borderRadius={100}
              px={8}
              w="full"
              type="submit"
              isDisabled={!isValid}
              isLoading={isLoading}
            >
              ログイン
            </Button>
          </Box>
        </VStack>
      </form>
    </Box>
  );
}

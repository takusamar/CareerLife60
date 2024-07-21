import { Box, Button, CircularProgress, Text, VStack } from "@chakra-ui/react";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuthUser } from "../hooks/useFirebaseAuth";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/")({
  component: IndexPage,
});

const message = `
限りある人生を
豊かなものにするために

自分の人生を図形的に俯瞰し
次の準備を始める
心の状態をつくりましょう
`;

function IndexPage() {
  const authUser = useAuthUser();
  const navigate = useNavigate();

  // ログイン済みの場合はユーザーページにリダイレクト
  useEffect(() => {
    if (authUser) {
      navigate({
        to: "/$userId",
        params: { userId: authUser.uid },
        replace: true,
      });
    }
  }, [authUser, navigate]);

  if (authUser === undefined) {
    return <CircularProgress isIndeterminate />;
  }

  return (
    <VStack w="full" p={8} spacing={16}>
      <Box w="full">
        <Text whiteSpace="pre-wrap" textAlign="center" textStyle="subtitle1">
          {message}
        </Text>
      </Box>

      <Box w="full">
        <Text textAlign="center" textStyle="body1">
          新規アカウント登録はこちら
        </Text>
        <Box w="full" px={8}>
          <Link to={"/signup"} style={{ width: "100%" }}>
            <Button borderRadius={100} w="full" colorScheme="secondary">
              アカウント登録
            </Button>
          </Link>
        </Box>
      </Box>
    </VStack>
  );
}

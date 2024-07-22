import { Text, Box, useToast, Button, VStack } from "@chakra-ui/react";
import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { createHistory } from "../../../services/Firebase";
import { useUser } from "../../../hooks/useFirestore";
import { HistoryForm, HistoryInput } from "../../../components/HistoryForm";
import { useAuthUser } from "../../../hooks/useFirebaseAuth";

export const Route = createLazyFileRoute("/$userId/history/add")({
  component: AddHistoryPage,
});

function AddHistoryPage() {
  const { userId } = Route.useParams();
  const authUser = useAuthUser();
  const { data: user } = useUser(userId, true);

  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (data: HistoryInput) => {
    // DBに経歴を追加
    await createHistory(userId, {
      title: data.title,
      start: dayjs()
        .year(Number(data.startYear))
        .month(Number(data.startMonth) - 1)
        .toDate(),
      end:
        data.endYear !== "" && data.endMonth !== ""
          ? dayjs()
              .year(Number(data.endYear))
              .month(Number(data.endMonth) - 1)
              .toDate()
          : undefined,
    });

    toast({
      title: "経歴を追加しました",
      status: "success",
      duration: 3000,
    });
  };

  const onClose = () => {
    navigate({ to: `/${userId}`, params: { userId } });
  };

  // ログインユーザーとページのユーザーが異なる場合は権限がない旨を表示
  if (!authUser || authUser.uid !== userId) {
    return (
      <VStack py={8} spacing={10}>
        <Text textStyle="body1">権限がありません</Text>
        <Link to={"/$userId"} params={{ userId }}>
          <Button colorScheme="red">戻る</Button>
        </Link>
      </VStack>
    );
  }

  return (
    <Box py={8}>
      <Text textStyle="h6">経歴を追加</Text>
      {user && (
        <HistoryForm
          birthYear={user.birth.getFullYear()}
          submitLabel="登録"
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Box>
  );
}

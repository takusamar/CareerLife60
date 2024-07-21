import { Text, Box, useToast } from "@chakra-ui/react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { createHistory } from "../../../services/Firebase";
import { useUser } from "../../../hooks/useFirestore";
import { HistoryForm, HistoryInput } from "../../../components/HistoryForm";

export const Route = createLazyFileRoute("/$userId/history/add")({
  component: AddHistoryPage,
});

function AddHistoryPage() {
  const { userId } = Route.useParams();
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
      end: dayjs()
        .year(Number(data.endYear))
        .month(Number(data.endMonth) - 1)
        .toDate(),
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

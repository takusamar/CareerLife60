import { Box, Text, useToast } from "@chakra-ui/react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useHistory, useUser } from "../../../hooks/useFirestore";
import { HistoryForm, HistoryInput } from "../../../components/HistoryForm";
import { updateHistory } from "../../../services/Firebase";
import dayjs from "dayjs";

export const Route = createLazyFileRoute("/$userId/history/$historyId")({
  component: HistoryPage,
});

function HistoryPage() {
  const { userId, historyId } = Route.useParams();
  const { data: user, status: userStatus } = useUser(userId, true);
  const { data: history, status: historyStatus } = useHistory(
    userId,
    historyId,
    true
  );

  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (data: HistoryInput) => {
    // DBに経歴を更新
    await updateHistory(userId, historyId, {
      title: data.title,
      start: dayjs()
        .year(Number(data.startYear))
        .month(Number(data.startMonth) - 1)
        .toDate(),
      end: dayjs()
        .year(Number(data.endYear))
        .month(Number(data.endMonth) - 1)
        .toDate(),
      createdAt: history.createdAt,
    });

    toast({
      title: "経歴を更新しました",
      status: "success",
      duration: 3000,
    });
  };

  const onClose = () => {
    navigate({ to: `/${userId}`, params: { userId } });
  };

  if (userStatus === "loading" || historyStatus === "loading") {
    return <div>読み込み中...</div>;
  }
  if (userStatus === "error" || historyStatus === "error") {
    return <div>エラーが発生しました</div>;
  }

  return (
    <Box py={8}>
      <Text textStyle="h6">経歴の詳細</Text>
      {user && history && (
        <HistoryForm
          birthYear={user.birthYear}
          history={history}
          submitLabel="更新"
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Box>
  );
}

import { createLazyFileRoute } from "@tanstack/react-router";
import { useHistories, useUser } from "../hooks/useFirestore";
import { calcAge } from "../utils/utils";
import { Timeline } from "../components/Timeline";
import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";

export const Route = createLazyFileRoute("/$userId")({
  component: UserPage,
});

function UserPage() {
  const { userId } = Route.useParams();
  const { data: user, status: userStatus } = useUser(userId, true);
  const { data: histories, status: historiesStatus } = useHistories(
    userId,
    true
  );

  if (userStatus === "loading" || historiesStatus === "loading") {
    return <div>読み込み中...</div>;
  }
  if (userStatus === "error" || historiesStatus === "error") {
    return <div>エラーが発生しました</div>;
  }

  return (
    <Box py={2}>
      <div>Hello {user.name}さん</div>
      <div>
        {user.birthYear}年{user.birthMonth}月
      </div>
      {histories.map((history) => {
        const start = dayjs(history.start);
        const end = dayjs(history.end);
        return (
          <div key={history.id}>
            <div>{history.title}</div>
            <div>
              {start.format("YYYY年MM月")}〜{end.format("YYYY年MM月")}
            </div>
            <div>
              {calcAge(user.birthYear, start.year())}歳〜
              {calcAge(user.birthYear, end.year())}歳
            </div>
          </div>
        );
      })}
      <Timeline user={user} histories={histories} />
    </Box>
  );
}

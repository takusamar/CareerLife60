import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useHistories, useUser } from "../../hooks/useFirestore";
import { Timeline } from "../../components/Timeline";
import { Button, HStack, Spacer, VStack } from "@chakra-ui/react";

export const Route = createLazyFileRoute("/$userId/")({
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
    <VStack pt={4} pb={8} w="full" spacing={4}>
      <HStack w="full">
        <Spacer />
        <Link to={`/${userId}/history/add`}>
          <Button size="sm">経歴追加</Button>
        </Link>
      </HStack>
      <Timeline user={user} histories={histories} />
    </VStack>
  );
}

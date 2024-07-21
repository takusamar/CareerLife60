import { createFileRoute, Link } from "@tanstack/react-router";
import { useHistories, useUser } from "../../hooks/useFirestore";
import { Timeline } from "../../components/Timeline";
import { Button, Text, HStack, Spacer, VStack } from "@chakra-ui/react";
import { useAuthUser } from "../../hooks/useFirebaseAuth";

export const Route = createFileRoute("/$userId/")({
  component: UserPage,
});

function UserPage() {
  const { userId } = Route.useParams();
  const authUser = useAuthUser();
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
        <Text textStyle="subtitle1">{user.name}の年表</Text>
        <Spacer />
        {authUser?.uid === userId && (
          <Link to={`/${userId}/history/add`}>
            <Button size="sm">経歴追加</Button>
          </Link>
        )}
      </HStack>
      <Timeline user={user} histories={histories} />
    </VStack>
  );
}

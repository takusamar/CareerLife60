import { Button, HStack, Spacer, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useAuthUser } from "../hooks/useFirebaseAuth";
import { UserAvatar } from "./UserAvatar";

export const AppBar = () => {
  const user = useAuthUser();

  return (
    <HStack w="full" py={2} px={4} bgColor={"primary.600"}>
      <Link to={"/"}>
        <Text color="white" textStyle="h2">
          仕事人生60年表
        </Text>
      </Link>
      <Spacer />
      {user ? (
        <UserAvatar uid={user.uid} />
      ) : (
        <Link to={"/login"}>
          <Button size="sm">ログイン</Button>
        </Link>
      )}
    </HStack>
  );
};

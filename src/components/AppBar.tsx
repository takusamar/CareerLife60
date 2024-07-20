import { HStack, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

export const AppBar = () => {
  return (
    <HStack w="full" py={2} px={4} bgColor={"primary.600"}>
      <Link to={"/"}>
        <Text color="white" textStyle="h2">
          仕事人生60年表
        </Text>
      </Link>
    </HStack>
  );
};

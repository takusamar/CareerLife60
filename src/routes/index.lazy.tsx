import { Box, Text } from "@chakra-ui/react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const userId = "A0dddbJCdJQseeuBqIeO";
  return (
    <Box w="full">
      <h3>Welcome Home!</h3>
      <Link to={"/$userId"} params={{ userId }}>
        <Text>A0dddbJCdJQseeuBqIeO</Text>
      </Link>
    </Box>
  );
}

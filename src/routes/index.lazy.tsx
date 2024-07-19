import { Box } from '@chakra-ui/react'
import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <Box w="full">
      <h3>Welcome Home!</h3>
      <Link to={"/A0dddbJCdJQseeuBqIeO"}>A0dddbJCdJQseeuBqIeO</Link>
    </Box>
  )
}

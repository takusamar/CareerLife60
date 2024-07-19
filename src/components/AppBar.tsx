import { HStack, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

export const AppBar = () => {
  return (
    <HStack w="full" py={2} px={4} bgColor={"#0D9488"}>
      <Link to={"/"}>
        <Text color="white">仕事人生60年表</Text>
      </Link>
    </HStack>
  )
}

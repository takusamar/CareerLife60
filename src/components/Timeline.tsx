import { User } from "../models/User";
import { History } from "../models/History";
import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { getBackgroundColor } from "../utils/utils";

interface Props {
  user: User;
  histories: History[];
}
export const Timeline = ({ user, histories }: Props) => {
  const maxAge = 60;
  const maxMonth = 12;
  const borderColor = "divider";
  const borderWidth = 1;

  return (
    <VStack spacing={0} w="full">
      <HStack spacing={0} w="full">
        <Box w={6} h={4} />
        {[...Array(maxMonth)].map((_, index) => {
          const month = index + 1;
          return (
            <Box
              key={index}
              w={6}
              h={4}
              borderBottom="solid"
              borderBottomWidth={borderWidth}
              borderBottomColor={borderColor}
            >
              <Text textAlign={"center"} textStyle="overline">
                {month}
              </Text>
            </Box>
          );
        })}
        <Box w={8} h={4} />
      </HStack>
      {[...Array(maxAge)].map((_, age) => {
        // 年の表示は5年ごとに行う
        const labelYear = age % 5 === 0 ? user.birthYear + age : "";
        const labelAge = age % 5 === 0 ? age : "";
        // 10年ごとに下線を太くする
        const bottomWidth = age % 10 === 9 ? borderWidth + 1 : borderWidth;
        return (
          <HStack key={age} spacing={0} w="full">
            <Box
              w={6}
              h={4}
              pr={1}
              borderRight="solid"
              borderRightWidth={borderWidth}
              borderRightColor={borderColor}
            >
              <Text textAlign={"end"} textStyle="overline">
                {labelAge}
              </Text>
            </Box>
            {[...Array(maxMonth)].map((_, index) => {
              // 背景色を決定する
              const year = user.birthYear + age;
              const month = index + 1;
              const bgColor = getBackgroundColor(user, histories, year, month);

              return (
                <Box
                  key={index}
                  w={6}
                  h={4}
                  bgColor={bgColor}
                  borderRight="solid"
                  borderBottom="solid"
                  borderRightWidth={borderWidth}
                  borderBottomWidth={bottomWidth}
                  borderRightColor={borderColor}
                  borderBottomColor={borderColor}
                ></Box>
              );
            })}
            <Box w={8} h={4} pl={1}>
              <Text textAlign={"start"} textStyle="overline">
                {labelYear}
              </Text>
            </Box>
          </HStack>
        );
      })}
    </VStack>
  );
};

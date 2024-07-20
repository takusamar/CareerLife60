import { User } from "../models/User";
import { History } from "../models/History";
import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { findHistoryIndex, getBackgroundColor } from "../utils/utils";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";

interface Props {
  user: User;
  histories: History[];
}
export const Timeline = ({ user, histories }: Props) => {
  const birthYearMonth = dayjs()
    .year(user.birthYear)
    .month(user.birthMonth - 1);
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
        const bottomColor = age % 10 === 9 ? "red.400" : borderColor;
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
              const target = birthYearMonth.add(age, "year").month(index);
              const bgColor = getBackgroundColor(
                histories,
                birthYearMonth,
                target
              );
              const historyIndex = findHistoryIndex(histories, target);
              const path =
                historyIndex >= 0
                  ? `/${user.id}/history/${histories[historyIndex].id}`
                  : undefined;

              return (
                <Link to={path} key={index}>
                  <Box
                    w={6}
                    h={4}
                    bgColor={bgColor}
                    borderRight="solid"
                    borderBottom="solid"
                    borderRightWidth={borderWidth}
                    borderBottomWidth={bottomWidth}
                    borderRightColor={borderColor}
                    borderBottomColor={bottomColor}
                  />
                </Link>
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

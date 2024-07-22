import { User } from "../models/User";
import { History } from "../models/History";
import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { TimelineCell } from "./TimelineCell";
import { HistoryTitle } from "./HistoryTitle";

interface Props {
  user: User;
  histories: History[];
}
export const Timeline = ({ user, histories }: Props) => {
  const birth = dayjs(user.birth);
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
        const year = birth.year() + age;
        const labelYear = age % 5 === 0 ? year : "";
        const labelAge = age % 5 === 0 ? age : "";
        return (
          <HStack key={age} spacing={0} w="full" position="relative">
            <HistoryTitle userId={user.id} histories={histories} year={year} />
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
            {[...Array(maxMonth)].map((_, index) => (
              <TimelineCell
                key={index}
                birth={birth}
                age={age}
                month={index + 1}
                histories={histories}
              />
            ))}
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

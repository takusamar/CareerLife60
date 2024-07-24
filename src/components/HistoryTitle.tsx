import { Link } from "@tanstack/react-router";
import { History } from "../models/History";
import { findHistoriesByYear } from "../utils/utils";
import { Box, HStack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

interface Props {
  userId: string;
  histories: History[];
  year: number;
}
export const HistoryTitle = ({ userId, histories, year }: Props) => {
  // 経歴の重心がある場合はタイトルとリンクを表示
  const result = findHistoriesByYear(histories, year);

  return (
    <Box w="full" position="absolute">
      <HStack w="full" justifyContent={"center"}>
        {result.map((history, index) => {
          const path = history ? `/${userId}/history/${history.id}` : undefined;
          // 開始年月または終了年月が同じ年にあれば、オフセットを調整
          const historyStart = dayjs(history.start);
          const historyEnd = dayjs(history.end);
          const startM =
            historyStart.year() === year ? historyStart.month() : 0;
          const endM = historyEnd.year() === year ? 11 - historyEnd.month() : 0;
          const pl = startM > endM ? startM * 4 : 0;
          const pr = startM < endM ? endM * 4 : 0;

          return (
            <Box key={index} pl={pl} pr={pr}>
              <Link to={path}>
                <Text textStyle="caption">{history.title}</Text>
              </Link>
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
};

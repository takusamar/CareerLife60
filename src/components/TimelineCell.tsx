import { Box } from "@chakra-ui/react";
import { getBackgroundColor } from "../utils/utils";
import { Dayjs } from "dayjs";
import { History } from "../models/History";

interface Props {
  birth: Dayjs;
  age: number;
  month: number;
  histories: History[];
}

export const TimelineCell = ({ birth, age, month, histories }: Props) => {
  // 10年ごとに下線を太くする
  const bottomWidth = age % 10 === 9 ? 2 : 1;
  const bottomColor = age % 10 === 9 ? "red.400" : "divider";
  const rightWidth = 1;
  const rightColor = "divider";

  // 背景色を決定する
  const target = birth.add(age, "year").month(month - 1);
  const bgColor = getBackgroundColor(histories, birth, target);

  return (
    <Box
      w={6}
      h={4}
      bgColor={bgColor}
      borderBottom="solid"
      borderBottomWidth={bottomWidth}
      borderBottomColor={bottomColor}
      borderRight="solid"
      borderRightWidth={rightWidth}
      borderRightColor={rightColor}
    />
  );
};

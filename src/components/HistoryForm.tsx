import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { History } from "../models/History";

// 12ヶ月分の月の配列
const monthList = [...Array(12)].map((_, i) => i + 1);

export interface HistoryInput {
  title: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
}

interface Props {
  birthYear: number;
  submitLabel: string;
  history?: History;
  onClose: () => void;
  onSubmit: (data: HistoryInput) => Promise<void>;
}
export const HistoryForm = ({
  birthYear,
  submitLabel,
  history,
  onClose,
  onSubmit,
}: Props) => {
  // 生年〜現在年のリストを作成
  const yearList = [...Array(dayjs().year() - birthYear + 1)].map(
    (_, i) => birthYear + i
  );

  // 開始年、終了年を動的に変更するため
  const [startYears, setStartYears] = useState<number[]>(yearList);
  const [endYears, setEndYears] = useState<number[]>(yearList);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<HistoryInput>();
  const toast = useToast();

  const formValues = watch();

  // 開始年の変更に応じて終了年のリストを更新
  useEffect(() => {
    // 生年または開始年〜現在までの年リストを作成
    const startYear = formValues.startYear
      ? Number(formValues.startYear)
      : birthYear;
    const yearList = [...Array(dayjs().year() - startYear + 1)].map(
      (_, i) => startYear + i
    );
    setEndYears(yearList);
  }, [birthYear, formValues.startYear]);

  // 終了年の変更に応じて開始年のリストを更新
  useEffect(() => {
    // 生年〜現在または終了年までのリストを作成
    const endYear = formValues.endYear
      ? Number(formValues.endYear)
      : dayjs().year();
    const yearList = [...Array(endYear - birthYear + 1)].map(
      (_, i) => birthYear + i
    );
    setStartYears(yearList);
  }, [birthYear, formValues.endYear]);

  const onCancel = () => {
    reset();
    onClose();
  };

  const _handleSubmit = async (data: HistoryInput) => {
    if (
      data.startYear > data.endYear ||
      (data.startYear == data.endYear && data.startMonth > data.endMonth)
    ) {
      toast({
        title: "開始年月が終了年月よりも後になっています",
        status: "error",
        duration: 3000,
      });
      return;
    }

    await onSubmit(data);

    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(_handleSubmit)}>
      <VStack pt={4} alignItems="start" spacing={8}>
        <FormControl isRequired>
          <FormLabel htmlFor="title" textStyle="subtitle1">
            タイトル
          </FormLabel>
          <Input
            {...register("title", { required: true })}
            placeholder="タイトル"
            defaultValue={history?.title}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="start" textStyle="subtitle1">
            開始
          </FormLabel>
          <HStack>
            <Select
              width={24}
              {...register("startYear", { required: true })}
              placeholder="----"
              defaultValue={history?.start.getFullYear()}
            >
              {startYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            <Text>年</Text>
            <Select
              width={20}
              {...register("startMonth", { required: true })}
              placeholder="--"
              defaultValue={history ? history.start.getMonth() + 1 : undefined}
            >
              {monthList.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Select>
            <Text>月</Text>
          </HStack>
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="end" textStyle="subtitle1">
            終了
          </FormLabel>
          <HStack>
            <Select
              width={24}
              {...register("endYear", { required: true })}
              placeholder="----"
              defaultValue={history?.end.getFullYear()}
            >
              {endYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            <Text>年</Text>
            <Select
              width={20}
              {...register("endMonth", { required: true })}
              placeholder="--"
              defaultValue={history ? history.end.getMonth() + 1 : undefined}
            >
              {monthList.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Select>
            <Text>月</Text>
          </HStack>
        </FormControl>
        <HStack pt={4} w="full" justifyContent="center">
          <Button
            variant="outlined"
            borderWidth={1}
            color="button"
            onClick={onCancel}
          >
            キャンセル
          </Button>
          <Box w={2} />
          <Button type="submit" isDisabled={!isValid}>
            {submitLabel}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

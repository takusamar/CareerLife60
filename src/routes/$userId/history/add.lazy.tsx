import {
  useToast,
  VStack,
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Button,
  Select,
} from "@chakra-ui/react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { createHistory } from "../../../services/Firebase";
import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/useFirestore";

export const Route = createLazyFileRoute("/$userId/history/add")({
  component: AddHistoryPage,
});

// 12ヶ月分の月の配列
const monthList = [...Array(12)].map((_, i) => i + 1);

interface InputForm {
  title: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
}

function AddHistoryPage() {
  const { userId } = Route.useParams();
  const { data: user } = useUser(userId, true);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<InputForm>();
  const toast = useToast();

  // 開始年、終了年を動的に変更するため
  const [startYears, setStartYears] = useState<number[]>([]);
  const [endYears, setEndYears] = useState<number[]>([]);

  const formValues = watch();

  // 開始年の変更に応じて終了年のリストを更新
  useEffect(() => {
    if (!user || !user.birthYear) return;

    // 生年または開始年〜現在までの年リストを作成
    const startYear = formValues.startYear
      ? Number(formValues.startYear)
      : user.birthYear;
    const yearList = [...Array(dayjs().year() - startYear + 1)].map(
      (_, i) => startYear + i
    );
    setEndYears(yearList);
  }, [user, user.birthYear, formValues.startYear]);

  // 終了年の変更に応じて開始年のリストを更新
  useEffect(() => {
    if (!user || !user.birthYear) return;

    // 生年〜現在または終了年までのリストを作成
    const endYear = formValues.endYear
      ? Number(formValues.endYear)
      : dayjs().year();
    const yearList = [...Array(endYear - user.birthYear + 1)].map(
      (_, i) => user.birthYear + i
    );
    setStartYears(yearList);
  }, [user, user.birthYear, formValues.endYear]);

  console.log("startYears", startYears);
  console.log("endYears", endYears);

  const onSubmit = async (data: InputForm) => {
    console.log(data);
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

    // DBに経歴を追加
    await createHistory(userId, {
      title: data.title,
      start: dayjs()
        .year(Number(data.startYear))
        .month(Number(data.startMonth) - 1)
        .toDate(),
      end: dayjs()
        .year(Number(data.endYear))
        .month(Number(data.endMonth) - 1)
        .toDate(),
    });

    toast({
      title: "経歴を追加しました",
      status: "success",
      duration: 3000,
    });
    reset();
    navigate({ to: `/${userId}`, params: { userId } });
  };

  const onCancel = () => {
    reset();
    navigate({ to: `/${userId}`, params: { userId } });
  };

  return (
    <Box py={8}>
      <Text textStyle="h6">経歴を追加</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack pt={4} alignItems="start" spacing={8}>
          <FormControl isRequired>
            <FormLabel htmlFor="title" textStyle="subtitle1">
              タイトル
            </FormLabel>
            <Input
              {...register("title", { required: true })}
              placeholder="タイトル"
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
              >
                {startYears.map((year, i) => (
                  <option key={i} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <Text>年</Text>
              <Select
                width={20}
                {...register("startMonth", { required: true })}
                placeholder="--"
              >
                {monthList.map((month, i) => (
                  <option key={i} value={month}>
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
              >
                {endYears.map((year, i) => (
                  <option key={i} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <Text>年</Text>
              <Select
                width={20}
                {...register("endMonth", { required: true })}
                placeholder="--"
              >
                {monthList.map((month, i) => (
                  <option key={i} value={month}>
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
              登録
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}

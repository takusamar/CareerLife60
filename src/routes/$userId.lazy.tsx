import { createLazyFileRoute } from '@tanstack/react-router'
import { useHistories, useUser } from '../hooks/useFirestore';
import { calcAge } from '../utils/utils';

export const Route = createLazyFileRoute('/$userId')({
  component: UserPage,
})

function UserPage() {
  const { userId } = Route.useParams();
  const { data: user, status: userStatus } = useUser(userId, true);
  const { data: histories, status: historiesStatus } = useHistories(userId, true);

  if (userStatus === 'loading' || historiesStatus === 'loading') {
    return <div>読み込み中...</div>
  }
  if (userStatus === 'error' || historiesStatus === 'error') {
    return <div>エラーが発生しました</div>
  }

  return (
    <>
      <div>Hello {user.name}さん</div>
      <div>{user.birthYear}年{user.birthMonth}月</div>
      {histories.map((history) =>
        <div key={history.id}>
          <div>
            {history.title}
          </div>
          <div>{history.startYear}年{history.startMonth}月〜{history.endYear}年{history.endMonth}月</div>
          <div>{calcAge(user.birthYear, history.startYear)}歳〜{calcAge(user.birthYear, history.endYear)}歳</div>
        </div>
      )}
    </>
  )
}

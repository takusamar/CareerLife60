import { createLazyFileRoute } from '@tanstack/react-router'
import { useUser } from '../hooks/useFirestore';

export const Route = createLazyFileRoute('/$userId')({
  component: UserPage,
})

function UserPage() {
  const { userId } = Route.useParams();
  const { data: user, status } = useUser(userId, true);

  if (status === 'loading') {
    return <div>読み込み中...</div>
  }
  if (status === 'error') {
    return <div>エラーが発生しました</div>
  }

  return (
    <>
      <div>Hello {user.name}さん</div>
      <div>{user.birthYear}年{user.birthMonth}月</div>
    </>
  )
}

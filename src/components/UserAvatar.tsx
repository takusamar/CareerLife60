import { Button, CircularProgress, useDisclosure } from "@chakra-ui/react";
import { useUser } from "../hooks/useFirestore";
import { ConfirmDialog } from "./ConfirmDialog";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  uid: string;
}
export const UserAvatar = ({ uid }: Props) => {
  const { data: user, status } = useUser(uid, true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const onSubmit = async () => {
    // ログアウト処理
    const auth = getAuth();
    await signOut(auth);
    onClose();
    navigate({ to: "/" });
  };

  if (status === "loading") {
    return <CircularProgress isIndeterminate />;
  }
  if (status === "error") {
    return <div>ERROR</div>;
  }
  return (
    <>
      <Button size="sm" onClick={onOpen}>
        {user?.name}
      </Button>
      <ConfirmDialog
        title="ログアウト"
        message="ログアウトしますか？"
        cancelLabel="キャンセル"
        submitLabel="ログアウト"
        isOpen={isOpen}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </>
  );
};

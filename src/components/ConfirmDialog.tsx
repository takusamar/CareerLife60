import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface Props {
  title: string;
  message: string;
  isOpen: boolean;
  isLoading?: boolean;
  cancelLabel?: string;
  submitLabel?: string;
  onClose?: () => void;
  onSubmit?: () => void;
}

export const ConfirmDialog = ({
  title,
  message,
  isOpen,
  isLoading = false,
  cancelLabel = "Cancel",
  submitLabel = "OK",
  onClose,
  onSubmit,
}: Props) => {
  const cancelRef = useRef(null);
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => onClose?.()}
    >
      <AlertDialogOverlay>
        <AlertDialogContent m={8}>
          <AlertDialogHeader textStyle="subtitle2">{title}</AlertDialogHeader>

          <AlertDialogBody textStyle="body2">{message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              {cancelLabel}
            </Button>
            <Button
              colorScheme="red"
              onClick={onSubmit}
              ml={3}
              isLoading={isLoading}
              size="sm"
            >
              {submitLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

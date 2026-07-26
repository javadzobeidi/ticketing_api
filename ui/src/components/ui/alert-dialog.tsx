import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';

interface AlertDialogButton {
  text: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  disabled?: boolean;
}

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  buttons: AlertDialogButton[];
  isLoading?: boolean;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  buttons,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-base">{description}</p>
        </div>
        <DialogFooter className="flex gap-3">
          {buttons.map((button, index) => (
            <Button
              key={index}
              type="button"
              onClick={button.onClick}
              disabled={isLoading || button.disabled}
              variant={button.variant || "default"}
              className={button.className}
            >
              {button.text}
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
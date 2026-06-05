import { InfoIcon, CheckIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./alert";

import z from "zod";

export const NotificationSchema = z.object({
  type: z.literal(["success", "error"]),
  message: z.string(),
  title: z.string(),
  isOpen: z.boolean(),
});

export type CooksterNotification = z.infer<typeof NotificationSchema>;

export const NotificationHidden: CooksterNotification = {
  isOpen: false,
  message: "",
  type: "success",
  title: "",
};

export default function NotificationAlert({
  type,
  message,
  title,
  isOpen,
}: CooksterNotification) {
  const icon = type === "success" ? <CheckIcon /> : <InfoIcon />;
  const variant = type === "success" ? "default" : "destructive";

  if (!isOpen) {
    return null;
  }
  return (
    <Alert
      variant={variant}
      className="absolute top-2.5 left-1/2 w-1/3 flex items-center gap-4.5 shadow-md"
    >
      {icon}
      <div>
        {title.length && <AlertTitle>{title}</AlertTitle>}
        {message.length && <AlertDescription>{message}</AlertDescription>}
      </div>
    </Alert>
  );
}

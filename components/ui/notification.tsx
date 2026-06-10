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
      className="absolute top-2.5 sm:left-1/2 w-full sm:w-1/3 flex items-center gap-4.5 shadow-md z-1300"
    >
      {icon}
      <div>
        {title.length > 0 && <AlertTitle>{title}</AlertTitle>}
        {message.length > 0 && <AlertDescription>{message}</AlertDescription>}
      </div>
    </Alert>
  );
}

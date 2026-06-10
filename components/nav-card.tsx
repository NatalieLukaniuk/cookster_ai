import z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./ui/card";
import Link from "next/link";
import clsx from "clsx";
import { CircleArrowOutUpRight, TriangleAlert } from "lucide-react";

export const NavCardSchema = z.object({
  title: z.string(),
  link: z.string(),
  description: z.string().optional(),
  isExternal: z.boolean().default(false),
  isExperimental: z.boolean().default(true),
});

export type NavCardItem = z.infer<typeof NavCardSchema>;

export interface NavCardProps {
  navCard: NavCardItem;
}

export default function NavCard({ navCard }: NavCardProps) {
  const cardContent = (
    <Card
      className={clsx(
        "w-full md:h-full",
        navCard.isExperimental ? "bg-orange-50" : "bg-green-50",
      )}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2.5">
          <span>{navCard.title}</span>
          {navCard.isExternal && (
            <CircleArrowOutUpRight size={16} strokeWidth={2} />
          )}
        </CardTitle>
        {!!navCard.description?.length && (
          <CardDescription>{navCard.description}</CardDescription>
        )}
      </CardHeader>
      {navCard.isExperimental && (
        <CardFooter className="gap-3">
          <TriangleAlert
            size={16}
            color="var(--color-orange-400)"
            strokeWidth={3}
          />
          <p className="text-xs font-bold text-orange-400">
            This app is experimental and may work not as expected
          </p>
        </CardFooter>
      )}
    </Card>
  );
  return (
    <>
      <div className="flex flex-col w-full md:w-60 md:mb-0">
        {navCard.isExternal ? (
          <a href={navCard.link} className="w-full md:flex-1" target="_blank">
            {cardContent}
          </a>
        ) : (
          <Link href={navCard.link} className="w-full md:flex-1">
            {cardContent}
          </Link>
        )}
      </div>
    </>
  );
}

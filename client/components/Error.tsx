import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function Error({ children }: Props) {
  return <span className="font-semibold text-sm text-red-600">{children}</span>;
}

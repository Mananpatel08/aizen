import { Info } from "lucide-react";

type Props = {
  error: string;
};

export const ErrorBox = ({ error }: Props) => {
  return (
    <div
      role="alert"
      className="flex items-center gap-2.5 px-4 py-3 mt-2 bg-red-500/10 border border-red-500/30 rounded-[8px] text-red-400 text-[13.5px] animate-msg-in"
    >
      <Info className="w-4 h-4 rotate-180" />
      {error}
    </div>
  );
};

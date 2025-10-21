import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface ButtonLoadingProps {
  type?: "button" | "submit" | "reset";
  text: string;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export function ButtonLoading({
  type,
  text,
  loading,
  onClick,
  className,
  ...props
}: ButtonLoadingProps) {
  return (
    <Button
      disabled={loading}
      type={type}
      onClick={onClick}
      className={cn("", className)}
      {...props}
    >
      {loading && <Spinner />}
      {text}
    </Button>
  );
}

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

interface LoginCustomFormFieldProps {
  form: UseFormReturn<any, any, FieldValues | undefined>; // eslint-disable-line @typescript-eslint/no-explicit-any
  label: string;
  name: string;
  render: (
    field: ControllerRenderProps<FieldValues, string>,
  ) => React.ReactNode;
  displayError?: boolean;
}

const LoginCustomFormFieldInternal = ({
  form,
  label,
  name,
  render,
  displayError,
}: LoginCustomFormFieldProps) => {
  return (
    <Suspense
      fallback={
        <>
          <Skeleton className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70" />
          <Skeleton
            className={`bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border-none px-3 py-2 text-sm transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[2px] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--color-neutral-700)]`}
          />
        </>
      }
    >
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="grid gap-2">
            <FormLabel>{label}</FormLabel>
            <FormControl>{render(field)}</FormControl>
            {displayError && <FormMessage />}
          </FormItem>
        )}
      />
    </Suspense>
  );
};

export const LoginCustomFormField = ({
  ...props
}: LoginCustomFormFieldProps) => {
  return (
    <Suspense
      fallback={
        <>
          <Skeleton className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70" />
          <Skeleton
            className={`bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border-none px-3 py-2 text-sm transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[2px] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--color-neutral-700)]`}
          />
        </>
      }
    >
      <LoginCustomFormFieldInternal {...props} />
    </Suspense>
  );
};

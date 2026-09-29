import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const controlBase =
  "w-full rounded-xl border bg-surface text-foreground placeholder:text-subtle transition-colors outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60";

function controlState(error?: string) {
  return error ? "border-danger focus-visible:border-danger focus-visible:ring-danger/20" : "border-border-strong hover:border-subtle";
}

interface FieldChromeProps {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

function FieldChrome({ id, label, hint, error, hideLabel, className, children }: FieldChromeProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-sm font-medium text-foreground", hideLabel && "sr-only")}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export type InputFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  hideLabel?: boolean;
  containerClassName?: string;
  id?: string;
};

export function InputField({
  label,
  hint,
  error,
  prefix,
  suffix,
  hideLabel,
  containerClassName,
  className,
  id: idProp,
  ...props
}: InputFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldChrome id={id} label={label} hint={hint} error={error} hideLabel={hideLabel} className={containerClassName}>
      <div className="relative flex items-center">
        {prefix ? (
          <span className="pointer-events-none absolute left-3.5 text-sm text-subtle">{prefix}</span>
        ) : null}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(
            controlBase,
            controlState(error),
            "h-11 px-3.5 text-base sm:text-sm",
            prefix ? "pl-8" : undefined,
            suffix ? "pr-14" : undefined,
            className,
          )}
          {...props}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3.5 text-sm text-subtle">{suffix}</span>
        ) : null}
      </div>
    </FieldChrome>
  );
}

/** Numeric text input: shows the decimal keypad on mobile and never coerces to NaN. */
export function NumberField(props: Omit<InputFieldProps, "type">) {
  return <InputField type="text" inputMode="decimal" autoComplete="off" spellCheck={false} {...props} />;
}

export type SelectFieldProps = Omit<ComponentProps<"select">, "id"> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  hideLabel?: boolean;
  options: readonly { value: string; label: string }[];
  containerClassName?: string;
  id?: string;
};

export function SelectField({
  label,
  hint,
  error,
  hideLabel,
  options,
  containerClassName,
  className,
  id: idProp,
  ...props
}: SelectFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldChrome id={id} label={label} hint={hint} error={error} hideLabel={hideLabel} className={containerClassName}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(
            controlBase,
            controlState(error),
            "h-11 appearance-none pr-10 pl-3.5 text-base sm:text-sm",
            className,
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-subtle"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" />
        </svg>
      </div>
    </FieldChrome>
  );
}

export type TextareaFieldProps = Omit<ComponentProps<"textarea">, "id"> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  hideLabel?: boolean;
  containerClassName?: string;
  id?: string;
};

export function TextareaField({
  label,
  hint,
  error,
  hideLabel,
  containerClassName,
  className,
  id: idProp,
  ...props
}: TextareaFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldChrome id={id} label={label} hint={hint} error={error} hideLabel={hideLabel} className={containerClassName}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlBase, controlState(error), "min-h-40 resize-y px-3.5 py-3 text-base leading-relaxed sm:text-sm", className)}
        {...props}
      />
    </FieldChrome>
  );
}

export function CheckboxField({
  label,
  description,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type"> & { label: ReactNode; description?: ReactNode }) {
  const id = useId();
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded border-border-strong accent-primary"
        aria-describedby={description ? `${id}-desc` : undefined}
        {...props}
      />
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-foreground">
          {label}
        </label>
        {description ? (
          <p id={`${id}-desc`} className="text-xs text-subtle">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function RangeField({
  label,
  valueLabel,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type"> & { label: ReactNode; valueLabel: ReactNode }) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="tabular rounded-lg bg-surface-muted px-2 py-0.5 text-sm font-medium text-foreground">
          {valueLabel}
        </span>
      </div>
      <input id={id} type="range" className="w-full cursor-pointer accent-primary" {...props} />
    </div>
  );
}

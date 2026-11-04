"use client";

import {
  type ComponentProps,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FosGlassMaterial } from "@/components/ui/fos-glass-material";
import { cn } from "@/lib/utils";
import "./glass-select.css";

export type GlassSelectAppearance = "current" | "matte";
const selectOptics = {
  current: { strength: 0.62, blur: 3, dome: 0.08 },
  matte: { strength: 0.08, blur: 10, dome: 0 },
} as const;

interface SelectCtx {
  appearance: GlassSelectAppearance;
  value?: string;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  triggerId: string;
  contentId: string;
  valueId: string;
  register: (value: string, label: string) => void;
  labelOf: (value?: string) => string | undefined;
}
const SelectContext = createContext<SelectCtx | null>(null);
const useSelect = () => {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("GlassSelect parts must be used within <GlassSelect>");
  return ctx;
};

function focusOption(option: HTMLButtonElement | null | undefined) {
  option?.focus({ preventScroll: true });
  option?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

export function GlassSelect({
  value: controlled,
  defaultValue,
  onValueChange,
  children,
  appearance = "current",
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children?: ReactNode;
  appearance?: GlassSelectAppearance;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled !== undefined ? controlled : internal;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectId = useId();
  const triggerId = `${selectId}-trigger`;
  const contentId = `${selectId}-content`;
  const valueId = `${selectId}-value`;
  // Reactive label registry so the trigger re-renders once items report labels.
  const [labels, setLabels] = useState<Record<string, string>>({});

  const setValue = useCallback(
    (v: string) => {
      if (controlled === undefined) setInternal(v);
      onValueChange?.(v);
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    },
    [controlled, onValueChange],
  );

  const register = useCallback((v: string, label: string) => {
    setLabels((prev) => (prev[v] === label ? prev : { ...prev, [v]: label }));
  }, []);
  const labelOf = useCallback((v?: string) => (v ? labels[v] : undefined), [labels]);

  const ctx = useMemo(
    () => ({ appearance, value, setValue, open, setOpen, triggerRef, triggerId, contentId, valueId, register, labelOf }),
    [appearance, value, setValue, open, triggerId, contentId, valueId, register, labelOf],
  );
  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}

export function GlassSelectTrigger({
  className,
  placeholder = "Select…",
  onClick,
  onKeyDown,
  ...props
}: ComponentProps<"button"> & { placeholder?: string }) {
  const { appearance, open, setOpen, triggerRef, triggerId, contentId, valueId, value, labelOf } = useSelect();
  const label = labelOf(value);
  return (
    <button
      {...props}
      ref={triggerRef}
      id={props.id ?? triggerId}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={contentId}
      aria-labelledby={props["aria-labelledby"] ? `${props["aria-labelledby"]} ${valueId}` : props["aria-label"] ? undefined : valueId}
      data-glass-select-trigger=""
      data-appearance={appearance}
      data-placeholder={!label ? "" : undefined}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(!open);
      }}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
          event.preventDefault();
          setOpen(true);
        }
      }}
      className={cn(
        "flex h-10 w-56 items-center justify-between gap-2 rounded-xl border px-3.5 text-sm outline-none backdrop-blur-md transition-colors",
        className,
      )}
    >
      <span id={valueId} className="truncate">{label ?? placeholder}</span>
      <svg viewBox="0 0 16 16" fill="none" className="size-4 shrink-0" aria-hidden>
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function GlassSelectContent({ tint = 0.6, className, children, onKeyDown, ...props }: ComponentProps<"div"> & { tint?: number }) {
  const { appearance, open, setOpen, triggerRef, triggerId, contentId } = useSelect();
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [rect, setRect] = useState({ top: 0, left: 0, width: 224 });

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    const place = () => {
      const t = triggerRef.current?.getBoundingClientRect();
      if (!t) return;
      setRect({ top: t.bottom + 6, left: t.left, width: t.width });
    };
    place();
    const selected = ref.current?.querySelector<HTMLButtonElement>('[role="option"][aria-selected="true"]:not(:disabled)')
      ?? ref.current?.querySelector<HTMLButtonElement>('[role="option"]:not(:disabled)');
    focusOption(selected);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, mounted, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const n = e.target as Node;
      if (ref.current && !ref.current.contains(n) && !triggerRef.current?.contains(n)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen, triggerRef]);

  if (!mounted) return null;

  return createPortal(
    <div
      {...props}
      ref={ref}
      id={contentId}
      role="listbox"
      aria-labelledby={props["aria-labelledby"] ?? (props["aria-label"] ? undefined : triggerRef.current?.id ?? triggerId)}
      aria-hidden={!open}
      inert={!open}
      data-glass-select-content=""
      data-appearance={appearance}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "Tab") {
          setOpen(false);
          triggerRef.current?.focus({ preventScroll: true });
          return;
        }
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const items = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="option"]:not(:disabled)') ?? []);
        if (!items.length) return;
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
          : event.key === "ArrowDown" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
        focusOption(items[next]);
      }}
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        opacity: open ? 1 : 0,
        transform: `scale(${open ? 1 : 0.97})`,
        pointerEvents: open ? "auto" : "none",
        zIndex: 1000,
        transformOrigin: "top center",
        transition: "opacity 0.16s, transform 0.18s cubic-bezier(0.22,1.15,0.36,1.06)",
        ...props.style,
      }}
      className={cn(className)}
    >
      <FosGlassMaterial
        radius={16}
        {...selectOptics[appearance]}
        centerOpacity={`clamp(0, calc(var(--gs-material-opacity) * ${Number.isFinite(tint) ? Math.max(0, tint) / .6 : 1}), 1)`}
        centerColor="var(--gs-material-rgb)"
        rimWidth="var(--gs-material-rim-width)"
        shadow="menu"
        className="glass-select-material"
        contentClassName="glass-select-viewport max-h-64 overflow-auto rounded-[inherit] py-1.5"
      >
        {children}
      </FosGlassMaterial>
    </div>,
    document.body,
  );
}

export function GlassSelectItem({
  value,
  className,
  children,
  onClick,
  ...props
}: ComponentProps<"button"> & { value: string }) {
  const { setValue, value: selected, register } = useSelect();
  const selectedNow = selected === value;

  useEffect(() => {
    if (typeof children === "string") register(value, children);
  }, [value, children, register]);

  return (
    <button
      {...props}
      type="button"
      role="option"
      aria-selected={selectedNow}
      tabIndex={-1}
      data-glass-select-item=""
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) setValue(value);
      }}
      className={cn(
        "flex w-full items-center justify-between gap-2 px-3.5 py-2 text-sm outline-none transition-colors",
        className,
      )}
    >
      <span className="truncate">{children}</span>
      {selectedNow && (
        <svg viewBox="0 0 16 16" fill="none" className="size-4 shrink-0" aria-hidden>
          <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

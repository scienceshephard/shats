"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Selection groups.
 *
 * The screens draw their own options — this owns only which one is chosen and
 * hands back `on` so the markup can style itself. Keeping the two apart means a
 * page's appearance still lives in the page, and this file never has to know
 * what a symptom or a time slot looks like.
 *
 * These are client components by necessity: selection is state. The pages that
 * use them stay server components by rendering the group as a small island,
 * the same way `dialogs/triggers.tsx` isolates dialog state.
 *
 * Motion lives in `.selectable` in globals.css rather than here, so it is one
 * declaration shared by every group and switches off under reduced motion in
 * one place.
 */

export type Option = { id: string; disabled?: boolean };

/* -------------------------------------------------------------------------- */
/* Single choice                                                               */
/* -------------------------------------------------------------------------- */

/**
 * One of many — a language, a doctor, a day, a time.
 *
 * `onChange` is optional and fires alongside the internal update, so a page can
 * mirror the choice into the URL without having to own the state itself.
 */
export function SelectGroup<T extends Option>({
  items,
  initial,
  onChange,
  className = "",
  children,
}: {
  items: T[];
  /** Defaults to the first enabled option, so a group is never blank. */
  initial?: string;
  onChange?: (id: string, item: T) => void;
  className?: string;
  children: (item: T, on: boolean, choose: () => void) => ReactNode;
}) {
  const [chosen, setChosen] = useState<string>(
    initial ?? items.find((i) => !i.disabled)?.id ?? "",
  );

  return (
    <div className={className}>
      {items.map((item) => (
        <ChildOf
          key={item.id}
          render={children}
          item={item}
          on={item.id === chosen}
          choose={() => {
            if (item.disabled) return;
            setChosen(item.id);
            onChange?.(item.id, item);
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Multiple choice                                                             */
/* -------------------------------------------------------------------------- */

/** Any number of many — the symptoms screen says "choose more than one". */
export function ToggleGroup<T extends Option>({
  items,
  initial = [],
  onChange,
  className = "",
  children,
}: {
  items: T[];
  initial?: string[];
  onChange?: (ids: string[]) => void;
  className?: string;
  children: (item: T, on: boolean, toggle: () => void) => ReactNode;
}) {
  const [chosen, setChosen] = useState<string[]>(initial);

  // Reported after the state settles, not from inside the updater. Calling
  // `onChange` in there passes the value React is *about to* discard when two
  // clicks land in one batch, so the parent ends up a selection behind.
  const notify = useRef(onChange);
  useEffect(() => {
    notify.current = onChange;
  });
  useEffect(() => {
    notify.current?.(chosen);
  }, [chosen]);

  return (
    <div className={className}>
      {items.map((item) => (
        <ChildOf
          key={item.id}
          render={children}
          item={item}
          on={chosen.includes(item.id)}
          choose={() => {
            if (item.disabled) return;
            setChosen((prev) =>
              prev.includes(item.id)
                ? prev.filter((id) => id !== item.id)
                : [...prev, item.id],
            );
          }}
        />
      ))}
    </div>
  );
}

/**
 * Renders one option. A component rather than a bare call so React sees a
 * stable element per item and keeps its identity across re-renders — calling
 * the render prop inline would remount the subtree on every selection and cut
 * the CSS transition off halfway.
 */
function ChildOf<T>({
  render,
  item,
  on,
  choose,
}: {
  render: (item: T, on: boolean, choose: () => void) => ReactNode;
  item: T;
  on: boolean;
  choose: () => void;
}) {
  return <>{render(item, on, choose)}</>;
}

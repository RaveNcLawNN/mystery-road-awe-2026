import { createContext, useContext, useState, type ReactNode } from "react";
import { readStoredBookmarks, writeStoredBookmarks } from "../../storage.ts";
import { toggleId } from "./toggleId.ts";

interface BookmarksContextValue {
  // readonly: push/splice are a type error, so it can only be replaced
  bookmarks: readonly string[];
  toggleBookmark: (evidenceId: string) => void;
}

// null = used outside of <BookmarksProvider> (a programming error, see useBookmarks)
const BookmarksContext = createContext<BookmarksContextValue | null>(null);

// Owns the bookmark state (the single source of truth) and makes it available
// to every component below it, without passing it through the ones in between.
export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<readonly string[]>(readStoredBookmarks);

  function toggleBookmark(evidenceId: string) {
    const nextBookmarks = toggleId(bookmarks, evidenceId);
    setBookmarks(nextBookmarks);
    writeStoredBookmarks(nextBookmarks);
  }

  // React 19: the context itself is the provider component (<BookmarksContext.Provider> before)
  return <BookmarksContext value={{ bookmarks, toggleBookmark }}>{children}</BookmarksContext>;
}

// Reads the bookmarks in any component below <BookmarksProvider>.
export function useBookmarks(): BookmarksContextValue {
  const value = useContext(BookmarksContext);
  if (value === null) {
    throw new Error("useBookmarks() must be used inside <BookmarksProvider>");
  }
  return value;
}

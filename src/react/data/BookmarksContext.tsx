import { createContext, useContext, useState, type ReactNode } from "react";
import { readStoredBookmarks, writeStoredBookmarks } from "../../storage.ts";
import { toggleId } from "./toggleId.ts";

interface BookmarksContextValue {
  // readonly: can only be replaced, not changed
  bookmarks: readonly string[];
  toggleBookmark: (evidenceId: string) => void;
}

// null = used outside of <BookmarksProvider>
const BookmarksContext = createContext<BookmarksContextValue | null>(null);

// Holds the bookmarks and gives them to every component below it.
export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<readonly string[]>(readStoredBookmarks);

  function toggleBookmark(evidenceId: string) {
    const nextBookmarks = toggleId(bookmarks, evidenceId);
    setBookmarks(nextBookmarks);
    writeStoredBookmarks(nextBookmarks);
  }

  // React 19: no .Provider needed
  return <BookmarksContext value={{ bookmarks, toggleBookmark }}>{children}</BookmarksContext>;
}

export function useBookmarks(): BookmarksContextValue {
  const value = useContext(BookmarksContext);
  if (value === null) {
    throw new Error("useBookmarks() must be used inside <BookmarksProvider>");
  }
  return value;
}

/**
 * Remembers which members are known to have a live thread with the assistant.
 *
 * The inbox provisions that thread lazily, and checking for it cost a database
 * round-trip on every first-page load — 150 ms or more depending on how far the
 * database is. This is only a hint: a miss costs one query, so it is per-process
 * and unshared, and a restart simply re-checks.
 *
 * It has to be forgotten whenever a member's side of a conversation is removed,
 * because "you have this thread" stops being true at that moment. Deleting a
 * conversation soft-deletes the member row, so ContactService clears the hint and
 * the next inbox load restores the thread.
 */
class AiThreadHint {
  private readonly known = new Set<string>()

  has(userId: string): boolean {
    return this.known.has(userId)
  }

  add(userId: string): void {
    this.known.add(userId)
  }

  forget(userId: string): void {
    this.known.delete(userId)
  }
}

export const aiThreadHint = new AiThreadHint()

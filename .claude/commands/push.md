Stage all changes, write a concise commit message in Russian (imperative mood, max 72 chars), commit, and push to the current branch.

Follow this sequence:
1. Run `git status` to see what changed
2. Run `git diff --stat` for a summary
3. Stage: `git add -A`
4. Compose a commit message: one line in Russian, imperative mood, describing *what* changed and *why* (if clear from context). Format: `тип: описание` where тип is one of: feat / fix / docs / style / refactor / chore
5. Commit with that message + co-author trailer
6. Push to the current branch
7. Show the final `git log --oneline -3`

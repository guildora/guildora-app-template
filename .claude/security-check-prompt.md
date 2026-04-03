# Security Audit — Automated Weekly Check

You are running a security audit on this repository inside GitHub Actions.
Your goal: identify real security issues and write a structured JSON report.
Be thorough but precise — no false positives, but don't miss anything critical.

Note: This is a template repository. Pay special attention to example configs and placeholder values that could leak into real projects.

## 1. Dependency Audit (if available)

- Try running `pnpm audit --json` — if it fails, skip this section
- If `package.json` exists but no lockfile, note this as an info-level finding

## 2. Hardcoded Secrets & Credentials

- Scan all source files for patterns: API keys, tokens, passwords, private keys, connection strings
- Check if `.env` files are committed to the repo (should be in `.gitignore`)
- Verify example/template configs don't contain real credentials
- Check `.env.example` for values that look like real secrets instead of placeholders

## 3. Code Security Patterns

- **Injection:** SQL injection, command injection, NoSQL injection
- **XSS:** Unescaped user input in templates, `innerHTML` usage
- **SSRF:** User-controlled URLs in fetch/request calls without validation
- **Path Traversal:** Unsanitized file path construction from user input
- **eval() / Function():** Dynamic code execution from user-controlled input
- **Prototype Pollution:** Unsafe object merging with user input

## 4. Configuration & Infrastructure

- Check for debug/development settings that should not be in production
- Verify `.gitignore` properly excludes sensitive files
- Check that template scaffolding doesn't include insecure defaults

## 5. TypeScript-Specific

- Look for excessive `any` types in security-critical code
- Verify `strict` mode is enabled in `tsconfig.json`

## 6. Output

Write a file named `security-report.json` in the repository root with this exact JSON schema:

```json
{
  "repo": "repository-name",
  "scan_date": "2024-01-01T00:00:00Z",
  "summary": "Human-readable 1-3 sentence summary of findings",
  "risk_level": "clean|low|medium|high|critical",
  "issues": [
    {
      "id": "SEC-001",
      "category": "dependency|secret|code|config|typescript",
      "severity": "critical|high|medium|low|info",
      "title": "Short descriptive title",
      "description": "Detailed description of the issue and its impact",
      "file": "path/to/file.ts",
      "line": 42,
      "recommendation": "Specific steps to fix this issue",
      "references": ["https://cve.mitre.org/..."]
    }
  ],
  "dependency_audit": {
    "ran": true,
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "files_scanned": 0
}
```

## Rules

- Only report real, verifiable issues. Do not speculate or invent problems.
- If no issues are found, return an empty `issues` array and set `risk_level` to `"clean"`.
- The JSON must be valid and parseable. No markdown, no comments in the JSON file.
- Focus on actionable findings. Informational notes should use severity `"info"`.
- Set `risk_level` based on the highest severity found.
- Number issues sequentially: SEC-001, SEC-002, etc.

# How to Import Skills into VS Code Custom Agents Panel

## Mục tiêu

Bạn vừa tạo các skill trong thư mục `.agen/skills/`. Tài liệu này hướng dẫn cách import chúng vào VS Code extension (Custom Agents / Skills Panel) để Victor, Lucky, và team có thể dùng.

---

## Prerequisites

1. **VS Code installed** (v1.85+).
2. **GitHub Copilot extension** (extension ID: `GitHub.copilot`) installed.
3. **Custom Agents extension** (if you're using a dedicated extension for skills).
4. **Workspace folder open**: `worldmonitor-aff` (open the root folder in VS Code).

---

## Step 1: Verify Skill Files Exist

In VS Code, open the Explorer and navigate to `.agen/skills/`. You should see:

```
.agen/
  skills/
    api-helper/
      SKILL.md
      prompt.md
      instructions.md
    WORLDMONITOR/
      SKILL.md
    AFFILIATE/
      AFFILIATE_SKILL.md
    LUCKY/
      LUCKY_SKILL.md
    LUCKY_UX/
      LUCKY_UX_SKILL.md
```

All files are in place.

---

## Step 2: Import Skills via Custom Agents UI

### Option A: Using GitHub Copilot Chat Sidebar

1. **Open VS Code Copilot Chat Sidebar**:
   - Keyboard: `Ctrl+Shift+I` (Windows) or `Cmd+Shift+I` (Mac).
   - Or: Click Copilot icon in left gutter.

2. **Open Custom Agents / Skills Panel**:
   - Look for a dropdown or tab labeled **"Agents"** or **"Skills"** in the Chat panel.
   - Click to expand.

3. **Add Skill Button**:
   - Look for **"+"** icon or **"Add Skill"** button.
   - Click it.

4. **Select Skill Folder**:
   - A file picker should appear.
   - Navigate to `.agen/skills/api-helper/` (for first skill) and select the folder.
   - The extension will read `SKILL.md`, `prompt.md`, `instructions.md` and register the skill.

5. **Repeat for Other Skills**:
   - Click "Add Skill" again.
   - Select `.agen/skills/WORLDMONITOR/` and confirm.
   - Repeat for `AFFILIATE/`, `LUCKY/`, `LUCKY_UX/`.

### Option B: Manual Import via Extension Settings

1. **Open VS Code Settings**:
   - `Ctrl+,` (Windows) or `Cmd+,` (Mac).

2. **Search for "Skills" or "Custom Agents"**:
   - Type `skills` in search box.
   - Find setting like `"customAgents.skillPaths"` or similar.

3. **Add Skill Directory Paths**:
   - Edit the setting to include:
     ```json
     {
       "customAgents.skillPaths": [
         ".agen/skills/api-helper/",
         ".agen/skills/WORLDMONITOR/",
         ".agen/skills/AFFILIATE/",
         ".agen/skills/LUCKY/",
         ".agen/skills/LUCKY_UX/"
       ]
     }
     ```

4. **Save**. Extension auto-reloads skills.

### Option C: Workspace Settings (Recommended for Team)

Instead of user settings, commit skill paths to workspace settings:

1. **Create `.vscode/settings.json`** (if not exists):
   - In project root, create directory `.vscode/`.
   - Create file `settings.json`.

2. **Add skill config**:
   ```json
   {
     "customAgents.skillPaths": [
       ".agen/skills/api-helper/",
       ".agen/skills/WORLDMONITOR/",
       ".agen/skills/AFFILIATE/",
       ".agen/skills/LUCKY/",
       ".agen/skills/LUCKY_UX/"
     ],
     "[python]": {
       "editor.defaultFormatter": "ms-python.python"
     }
   }
   ```

3. **Commit to repo**:
   ```bash
   git add .vscode/settings.json
   git commit -m "feat: add skill paths to workspace settings"
   ```

4. **Team members pull** and skills auto-load.

---

## Step 3: Verify Skills Are Loaded

1. **Open Copilot Chat** (Ctrl+Shift+I).

2. **Click "Agents" or "Skills" dropdown** in the panel.

3. **Verify all 5 skills appear**:
   - ✅ `api-helper`
   - ✅ `WORLDMONITOR`
   - ✅ `AFFILIATE`
   - ✅ `LUCKY`
   - ✅ `LUCKY_UX`

4. **Check skill details**:
   - Hover over skill name → should show description from `SKILL.md`.

---

## Step 4: Test Skills in Chat

1. **Select a skill** from the list (e.g., WORLDMONITOR).
   - Skill is now active in this chat session.

2. **Ask a question matching the skill scope**:
   - Example (using WORLDMONITOR skill):
     ```
     Explain the file structure of worldmonitor-aff and the responsibilities of Victor.
     ```

3. **Observe response**:
   - Should reference SKILL content.
   - Should mention `/api/`, `/src/config/`, Victor's role, etc.

4. **Test other skills**:
   - Switch to AFFILIATE skill: "What is the SubID format for affiliate tracking?"
   - Switch to LUCKY skill: "What are the UX rules for CTA buttons?"
   - Switch to LUCKY_UX skill: "Explain DestinationPage structure."

---

## Step 5: Advanced — Custom Skill Configuration

### If Using Custom Skill Format

Some extensions expect a `skill.json` or `SKILL.yaml` in addition to `.md` files. Check your extension's documentation.

For GitHub Copilot, `.md` format should be sufficient, but if you want structured metadata:

Create `.agen/skills/WORLDMONITOR/skill.json`:

```json
{
  "name": "WORLDMONITOR",
  "version": "1.0",
  "description": "Core WorldMonitor app structure, API endpoints, and Victor's responsibilities.",
  "author": "Victor (Backend Engineer)",
  "keywords": ["worldmonitor", "api", "backend", "architecture", "victor"],
  "files": {
    "skill": "SKILL.md",
    "prompt": "prompt.md",
    "instructions": "instructions.md"
  },
  "scope": [
    "api-endpoints",
    "backend-services",
    "data-pipelines",
    "env-configuration",
    "deployment-rules"
  ]
}
```

Repeat for other skills if your extension supports it.

---

## Step 6: Troubleshooting

### Skills don't appear in the list

**Cause**: Extension not recognizing skill folder.

**Solution**:
1. Check folder structure:
   - Must have `.md` files (`SKILL.md`, `prompt.md`, or `instructions.md`).
   - Folder must be directly under `.agen/skills/`.
2. Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window".
3. Check extension logs: View → Output → select "Custom Agents" or "Copilot" from dropdown.

### Skill loads but content is missing or incorrect

**Cause**: `.md` files have syntax errors or are not readable.

**Solution**:
1. Verify files are `.md` (Markdown) format, not `.txt`.
2. Check file encoding: UTF-8 (not ASCII or other).
3. Validate Markdown syntax (e.g., no unclosed code blocks).
4. Re-read file: `Ctrl+Shift+P` → "Extension: Reload All".

### Chat doesn't reference skill content

**Cause**: Skill selected but LLM not using it.

**Solution**:
1. Skill is a *suggestion*, not a guarantee. Always mention the skill scope explicitly in your query.
2. Example good query: "Using the WORLDMONITOR skill, explain the API structure."
3. Example bad query: "What is WorldMonitor?"

### Can't edit skill content after import

**Cause**: Skills files are read-only in the chat context.

**Solution**:
1. Edit files in VS Code editor (File Explorer).
2. Save files (Ctrl+S).
3. Reload extension to reflect changes (Ctrl+Shift+P → "Reload Extensions").

---

## Step 7: Share with Team

Once skills are imported & working:

1. **Commit `.vscode/settings.json`** to repo:
   ```bash
   git add .vscode/settings.json
   git commit -m "chore: add AI skill configuration for team"
   git push
   ```

2. **Update README or CONTRIBUTING.md**:
   ```markdown
   ## Setting Up AI Skills (for Victor & Lucky)
   
   Skills are auto-loaded from `.agen/skills/` when you open the workspace.
   See [full guide](docs/dev/SKILLS_IMPORT.md) for manual setup.
   
   Available skills:
   - **WORLDMONITOR**: Backend architecture, API, Victor's role.
   - **AFFILIATE**: Monetization, SubID format, affiliate links.
   - **LUCKY**: UX/UI engineer responsibilities.
   - **LUCKY_UX**: DestinationPage, tab structure, CTA rules.
   - **api-helper**: Quick API reference & command generation.
   ```

3. **Announce in team Slack**:
   ```
   🤖 AI Skills now live!
   
   Updated .agen/skills/ with Victor, Lucky, WorldMonitor, Affiliate, and more.
   All skills auto-load in VS Code Copilot Chat.
   
   Try: Open Chat → Select WORLDMONITOR skill → ask "Explain API architecture"
   ```

---

## Future: Automating Skill Updates

Once team is familiar with skills, consider:

1. **CI/CD check**: Validate skill `.md` files on each PR:
   ```bash
   # Simple linter: check no broken markdown
   find .agen/skills -name "*.md" | xargs markdown-lint
   ```

2. **Skill versioning**: Add version field to `SKILL.md` header:
   ```markdown
   # SKILL — WorldMonitor Core App
   **Version**: 1.0 (2026-03-07)
   **Last Updated**: 2026-03-07
   **Owner**: Victor
   ```

3. **Auto-docs**: Generate skill index from all `SKILL.md` files in `.agen/skills/`:
   ```bash
   ./scripts/generate-skill-index.sh > docs/SKILLS_INDEX.md
   ```

---

## Summary

✅ **Skills are ready to use!**

1. Verify file structure in `.agen/skills/`.
2. Import via VS Code Custom Agents UI or `.vscode/settings.json`.
3. Test in Copilot Chat.
4. Share `.vscode/settings.json` with team.
5. Team pulls repo → skills auto-load.

---

**Last updated**: 2026-03-07 (Victor agent)  
**Related docs**:
- `CONTRIBUTING.md` — team workflow.
- `docs/dev/LOCK_UNLOCK_PROTOCOL.md` — shared file coordination.
- `.agen/skills/*/SKILL.md` — individual skill documentation.

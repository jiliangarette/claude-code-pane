#!/usr/bin/env bash
# CCP help — centered, scannable cheatsheet. Closes on any key (the tab exits).
source ~/.config/ccp/ui.sh

term_size
hide_cursor
clear

items=(
"LAUNCH"
"  1..9  or  0        open N panes, or 0 = pick projects"
"  Ctrl+A then O      pick projects from a list (new tab)"
""
"PANES"
"  Ctrl + 1..9        reshape current tab into N panes"
"  Ctrl + Arrows      move between panes"
"  Alt + 1..9         jump to a pane by number"
"  Ctrl+Shift + Z     zoom a pane fullscreen (toggle)"
""
"CLAUDE"
"  (auto-launches in grid panes — toggle in settings.lua)"
"  Ctrl+A then C      launch Claude in the focused pane"
"  Ctrl+Shift + B     broadcast a line to ALL panes"
""
"TABS  &  WORKSPACES"
"  Ctrl + T           new tab (opens the chooser)"
"  Ctrl + Tab         next tab    Ctrl+Shift+Tab  prev tab"
"  Ctrl + X           close current tab (asks first)"
"  Ctrl+A then R      rename tab"
"  Ctrl+A then W      workspaces    F jump-pane    P open project"
""
"  mouse: click a pane to focus     Ctrl+Space: free for Whisper"
)

maxw=0
for it in "${items[@]}"; do (( ${#it} > maxw )) && maxw=${#it}; done
margin=$(( (COLS - maxw) / 2 )); (( margin < 0 )) && margin=0

vpad $(( ${#items[@]} + 4 ))
hcenter "${AC}${BD}CCP  //  Claude Code Pane${RS}"
hcenter "${DM}────────────────────────────────${RS}"
echo
for it in "${items[@]}"; do
  case "$it" in
    PANES|CLAUDE|"TABS  &  WORKSPACES")
      printf '%*s%s%s%s\n' "$margin" '' "${AC}${BD}" "$it" "$RS" ;;
    "") printf '\n' ;;
    *) printf '%*s%s%s%s\n' "$margin" '' "$FG" "$it" "$RS" ;;
  esac
done
echo
hcenter "${DM}press any key to close${RS}"

read -rsn1
show_cursor
exit 0

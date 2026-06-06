#!/usr/bin/env bash
# Panes first-run onboarding — ask for the projects folder, save it to roots.txt,
# then hand off to the project picker.
source ~/.config/ccp/ui.sh
ERR=$(printf '\033[38;2;204;102;102m')
GR=$(printf '\033[38;2;126;231;135m')

ask() {
  term_size
  hide_cursor
  clear
  vpad 10
  hcenter "${AC}${BD}Welcome to Panes${RS}"
  hcenter "${DM}let's point it at your code${RS}"
  echo
  echo
  hcenter "${FG}Which folder holds your projects?${RS}"
  hcenter "${DM}each subfolder becomes a pane you can open${RS}"
  echo
  hcenter "${DM}examples:   ~/code     C:/Users/you/dev${RS}"
  echo
  echo
  show_cursor
  local pad=$(( (COLS - 46) / 2 )); (( pad < 0 )) && pad=0
  printf '%*s%s>%s ' "$pad" '' "$AC" "$RS"
  IFS= read -r REPLY_PATH
}

while true; do
  ask
  p="${REPLY_PATH%$'\r'}"
  p="${p/#\~/$HOME}"
  p="${p//\\//}"
  p="${p%/}"
  if [ -n "$p" ] && [ -d "$p" ]; then break; fi
  hide_cursor; clear; vpad 8
  hcenter "${ERR}can't find that folder:${RS}"
  hcenter "${DM}${p:-(nothing entered)}${RS}"
  echo
  hcenter "${DM}press any key to try again${RS}"
  read -rsn1
done

mkdir -p ~/.config/ccp
printf '%s\n' "$p" > ~/.config/ccp/roots.txt

hide_cursor; clear; vpad 8
hcenter "${GR}saved${RS}   ${DM}$p${RS}"
echo
hcenter "${DM}opening your projects...${RS}"
sleep 0.3
printf "${ESC}]1337;SetUserVar=ccp_pick=%s\007" "$(printf 1 | base64 | tr -d '\n')"

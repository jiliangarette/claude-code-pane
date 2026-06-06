#!/usr/bin/env bash
# CCP launcher — centered grid-size chooser.
#   1-9 -> open that many panes (emits ccp_panes)
#   0   -> pick specific projects from a list (emits ccp_pick)
source ~/.config/ccp/ui.sh

term_size
hide_cursor
clear

nums=(1 2 4 6 8 9)
top=""; mid=""; bot=""
for n in "${nums[@]}"; do top+="┌───┐ "; mid+="│ $n │ "; bot+="└───┘ "; done

vpad 10
hcenter "${AC}${BD}P A N E S${RS}"
echo
hcenter "${AC}${top}${RS}"
hcenter "${AC}${mid}${RS}"
hcenter "${AC}${bot}${RS}"
echo
hcenter "${DM}press a number for that many panes${RS}"
hcenter "${AC}0${RS}${DM}  ·  pick specific projects from a list${RS}"

key=""
while true; do
  IFS= read -rsn1 k
  case "$k" in
    0) key="0"; break ;;
    [1-9]) key="$k"; break ;;
    ""|$'\r'|$'\n') key="4"; break ;;
    q|Q|$'\033') show_cursor; clear; exec "${SHELL:-bash}" -i ;;
  esac
done

show_cursor
clear
if [ "$key" = "0" ]; then
  printf "${ESC}]1337;SetUserVar=ccp_pick=%s\007" "$(printf 1 | base64 | tr -d '\n')"
else
  b64=$(printf '%s' "$key" | base64 | tr -d '\n')
  printf "${ESC}]1337;SetUserVar=ccp_panes=%s\007" "$b64"
fi

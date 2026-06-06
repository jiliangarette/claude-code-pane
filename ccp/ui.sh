#!/usr/bin/env bash
# CCP shared UI helpers (sourced by launch.sh and help.sh)

ESC=$(printf '\033')
FG="${ESC}[38;2;194;194;194m"   # foreground
AC="${ESC}[38;2;86;182;194m"    # teal accent
DM="${ESC}[38;2;107;114;128m"   # dim
BD="${ESC}[1m"
RS="${ESC}[0m"

# Sets ROWS / COLS. Queries the emulator (CPR) because tput/$COLUMNS are often
# stale at pane launch under WezTerm + Git Bash; falls back to tput.
term_size() {
  local old r c
  old=$(stty -g 2>/dev/null)
  stty raw -echo min 0 time 1 2>/dev/null
  printf '\033[999;999H\033[6n' > /dev/tty 2>/dev/null
  IFS='[;R' read -r _ r c _ < /dev/tty 2>/dev/null
  [ -n "$old" ] && stty "$old" 2>/dev/null
  if [ -z "$c" ] || [ -z "$r" ]; then c=$(tput cols 2>/dev/null); r=$(tput lines 2>/dev/null); fi
  [ -z "$c" ] && c=80
  [ -z "$r" ] && r=24
  (( c < 40 )) && c=40
  (( r < 10 )) && r=10
  ROWS=$r; COLS=$c
}

strip() {
  local s="$1"
  while [[ $s == *$'\033['* ]]; do
    local pre=${s%%$'\033['*} rest=${s#*$'\033['}
    s="$pre${rest#*m}"
  done
  printf '%s' "$s"
}

hcenter() {
  local s="$1" plain pad
  plain=$(strip "$s")
  pad=$(( (COLS - ${#plain}) / 2 )); (( pad < 0 )) && pad=0
  printf '%*s%s\n' "$pad" '' "$s"
}

vpad() { local n=$1 i; for ((i=0; i<(ROWS-n)/2; i++)); do printf '\n'; done; }

hide_cursor() { printf '%s' "${ESC}[?25l"; }
show_cursor() { printf '%s' "${ESC}[?25h"; }

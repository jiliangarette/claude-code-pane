#!/usr/bin/env bash
# CCP project picker — centered grid of project cards, toggle with letters.
# Args:  --order <name...>  --roots <path...>
# Emits: ccp_picked = newline-joined absolute paths (in selection order).
source ~/.config/ccp/ui.sh

order=(); roots=(); mode=""
for a in "$@"; do
  case "$a" in
    --order) mode=order ;;
    --roots) mode=roots ;;
    *) [ "$mode" = order ] && order+=("$a"); [ "$mode" = roots ] && roots+=("$a") ;;
  esac
done

declare -A seen
names=(); paths=()
addp() {
  local p="$1" b key
  [ -d "$p" ] || return
  b=$(basename "$p")
  key=$(printf '%s' "$b" | tr '[:upper:]' '[:lower:]')
  [ -n "${seen[$key]}" ] && return
  seen[$key]=1; names+=("$b"); paths+=("$p")
}

# priority order first (case-insensitive basename match), then the rest A-Z.
for o in "${order[@]}"; do
  for r in "${roots[@]}"; do
    for p in "$r"/*/; do
      [ -d "${p%/}" ] || continue
      [ "$(basename "${p%/}" | tr '[:upper:]' '[:lower:]')" = "$(printf '%s' "$o" | tr '[:upper:]' '[:lower:]')" ] && addp "${p%/}"
    done
  done
done
rest=()
for r in "${roots[@]}"; do
  for p in "$r"/*/; do [ -d "${p%/}" ] && rest+=("${p%/}"); done
done
if [ ${#rest[@]} -gt 0 ]; then
  while IFS= read -r line; do addp "$line"; done < <(printf '%s\n' "${rest[@]}" | sort -f)
fi

total=${#names[@]}
n=$total
if [ "$n" -eq 0 ]; then printf 'no projects found\n'; sleep 1; exit 0; fi
[ "$n" -gt 24 ] && n=24

letters=(a b c d e f g h i j k l m n o p q r s t u v w x)
declare -A sel
selorder=()
is_bal() { case " 1 2 4 6 8 9 " in *" $1 "*) return 0 ;; *) return 1 ;; esac; }

render() {
  term_size
  hide_cursor; printf '%s' "${ESC}[H"
  local i maxw=0
  for ((i=0; i<n; i++)); do (( ${#names[i]} > maxw )) && maxw=${#names[i]}; done
  local cellw=$(( maxw + 7 ))
  local cols=$(( COLS / cellw )); (( cols < 1 )) && cols=1; (( cols > 4 )) && cols=4
  local rows=$(( (n + cols - 1) / cols ))
  local left=$(( (COLS - cols * cellw) / 2 )); (( left < 0 )) && left=0
  vpad $(( rows + 6 ))
  hcenter "${AC}${BD}P A N E S${RS}   ${DM}select projects — press a letter to toggle${RS}"
  echo
  local r c idx lt name mark
  for ((r=0; r<rows; r++)); do
    printf '%*s' "$left" ''
    for ((c=0; c<cols; c++)); do
      idx=$(( c * rows + r ))
      if (( idx < n )); then
        lt=${letters[idx]}; name="${names[idx]}"
        if [ -n "${sel[$lt]}" ]; then mark="${AC}●${RS}"; else mark="${DM}○${RS}"; fi
        printf '%s %s%s%s %s%-*s%s   ' "$mark" "$AC" "$lt" "$RS" "$FG" "$maxw" "$name" "$RS"
      fi
    done
    printf '\n'
  done
  echo
  local cnt=${#selorder[@]}
  if is_bal "$cnt"; then
    local gc=1; while (( gc * gc < cnt )); do ((gc++)); done
    local gr=$(( (cnt + gc - 1) / gc ))
    hcenter "${AC}${BD}${cnt} selected → ${gr}×${gc} grid — ENTER to deploy${RS}"
  else
    hcenter "${DM}${cnt} selected — choose a balanced count: 1 2 4 6 8 9${RS}"
  fi
  if [ "${total:-$n}" -gt "$n" ]; then
    hcenter "${DM}showing ${n} of ${total} — refine project_order in settings.lua${RS}"
  fi
  hcenter "${DM}esc to cancel${RS}"
  printf '%s' "${ESC}[J"
}

clear
while true; do
  render
  IFS= read -rsn1 k
  if [ "$k" = $'\033' ]; then show_cursor; clear; exit 0; fi
  if [ -z "$k" ] || [ "$k" = $'\r' ] || [ "$k" = $'\n' ]; then
    is_bal "${#selorder[@]}" && break
    continue
  fi
  for ((i=0; i<n; i++)); do
    if [ "${letters[i]}" = "$k" ]; then
      if [ -n "${sel[$k]}" ]; then
        unset 'sel[$k]'
        tmp=(); for x in "${selorder[@]}"; do [ "$x" != "$i" ] && tmp+=("$x"); done; selorder=("${tmp[@]}")
      else
        sel[$k]=1; selorder+=("$i")
      fi
      break
    fi
  done
done

show_cursor; clear
out=""
for idx in "${selorder[@]}"; do out+="${paths[idx]}"$'\n'; done
b64=$(printf '%s' "$out" | base64 | tr -d '\n')
printf "${ESC}]1337;SetUserVar=ccp_picked=%s\007" "$b64"

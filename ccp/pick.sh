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

# Gather every project dir ONCE (pure-builtin basename via ${p##*/}, no forks).
rawnames=(); rawpaths=()
for r in "${roots[@]}"; do
  for p in "$r"/*/; do
    d="${p%/}"
    [ -d "$d" ] || continue
    rawpaths+=("$d"); rawnames+=("${d##*/}")
  done
done
m=${#rawnames[@]}

# Lowercase names + order entries. On Windows/Linux a fork costs ~500ms here, so
# bash>=4 uses zero-fork builtin ${x,,}; bash 3.2 (macOS) falls back to one tr pass.
lname=(); lorder=()
if [ "${BASH_VERSINFO[0]:-0}" -ge 4 ]; then
  for ((i=0; i<m; i++)); do lname+=("${rawnames[i],,}"); done
  for o in "${order[@]}"; do lorder+=("${o,,}"); done
else
  [ "$m" -gt 0 ] && while IFS= read -r x; do lname+=("$x"); done < <(printf '%s\n' "${rawnames[@]}" | tr '[:upper:]' '[:lower:]')
  [ ${#order[@]} -gt 0 ] && while IFS= read -r x; do lorder+=("$x"); done < <(printf '%s\n' "${order[@]}" | tr '[:upper:]' '[:lower:]')
fi

seen="|"
names=(); paths=()
addidx() {
  local i="$1" key="${lname[$1]}"
  case "$seen" in *"|$key|"*) return ;; esac
  seen="$seen$key|"; names+=("${rawnames[i]}"); paths+=("${rawpaths[i]}")
}

# priority order first (case-insensitive name match), then the rest A-Z.
for o in "${lorder[@]}"; do
  for ((i=0; i<m; i++)); do [ "${lname[i]}" = "$o" ] && addidx "$i"; done
done
# remaining indices, insertion-sorted by lowercase name in pure bash (no sort fork).
rest=()
for ((i=0; i<m; i++)); do
  case "$seen" in *"|${lname[i]}|"*) continue ;; esac
  rest+=("$i")
done
for ((a=1; a<${#rest[@]}; a++)); do
  key=${rest[a]}; kk=${lname[key]}; b=$((a-1))
  while (( b>=0 )) && [[ ${lname[${rest[b]}]} > "$kk" ]]; do rest[b+1]=${rest[b]}; ((b--)); done
  rest[b+1]=$key
done
for i in "${rest[@]}"; do addidx "$i"; done

total=${#names[@]}
n=$total
if [ "$n" -eq 0 ]; then printf 'no projects found\n'; sleep 1; exit 0; fi
[ "$n" -gt 24 ] && n=24

letters=(a b c d e f g h i j k l m n o p q r s t u v w x)
sel=""
selorder=()
is_bal() { case " 1 2 4 6 8 9 " in *" $1 "*) return 0 ;; *) return 1 ;; esac; }
is_sel() { case "$sel" in *"|$1|"*) return 0 ;; *) return 1 ;; esac; }

render() {
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
        if is_sel "$lt"; then mark="${AC}●${RS}"; else mark="${DM}○${RS}"; fi
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

term_size
trap term_size WINCH
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
      if is_sel "$k"; then
        sel="${sel/|$k|/|}"
        tmp=(); for x in "${selorder[@]}"; do [ "$x" != "$i" ] && tmp+=("$x"); done; selorder=("${tmp[@]}")
      else
        sel="$sel|$k|"; selorder+=("$i")
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

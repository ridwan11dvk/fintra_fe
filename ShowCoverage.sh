#!/usr/bin/env bash
set -euo pipefail

# ── Defaults ──
COVERAGE_FILE=".output/tests/coverage/coverage-summary.json"
MODULE=""
GROUP_BY_MODULE=false
PCT_FILTER=""

# ── ANSI Colors ──
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
RED=$'\033[0;31m'
CYAN=$'\033[0;36m'
WHITE=$'\033[1;37m'
DARK_GRAY=$'\033[1;30m'
NC=$'\033[0m'

# ── Help ──
show_help() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Show code coverage from vitest coverage-summary.json.

Options:
  -m, --module <name>    Filter by module (exact path segment match)
  -p, --pct <op>:<val>   Filter by lines% (op: same|under|upper, val: number)
                         Examples: --pct under:80  --pct same:100  --pct upper:50
  -f, --file <path>      Path to coverage-summary.json
                         (default: $COVERAGE_FILE)
  -g, --group-by-module  Show per-module summary (no file details)
  -h, --help             Show this help message
EOF
    exit 0
}

# ── Parse arguments ──
while [[ $# -gt 0 ]]; do
    case "$1" in
        -m|--module) MODULE="$2"; shift 2 ;;
        -p|--pct) PCT_FILTER="$2"; shift 2 ;;
        -f|--file) COVERAGE_FILE="$2"; shift 2 ;;
        -g|--group-by-module) GROUP_BY_MODULE=true; shift ;;
        -h|--help) show_help ;;
        *) echo "Error: Unknown option: $1" >&2; show_help ;;
    esac
done

# ── Color helpers ──
pct_color() {
    local pct="$1"
    if (( $(echo "$pct >= 80" | bc -l) )); then printf "$GREEN"
    elif (( $(echo "$pct >= 50" | bc -l) )); then printf "$YELLOW"
    else printf "$RED"
    fi
}

write_pct() {
    local pct="$1"
    printf "$(pct_color "$pct")%6.2f%%${NC}" "$pct"
}

write_header() {
    echo ""
    printf "${CYAN}====================================================================================================${NC}\n"
    printf "${CYAN}  %s${NC}\n" "$1"
    printf "${CYAN}====================================================================================================${NC}\n"
}

write_col_header() {
    printf "${WHITE}%-60s %7s %7s %7s %7s${NC}\n" "File" "Lines%" "Stmts%" "Funcs%" "Branchs%"
    printf "${DARK_GRAY}----------------------------------------------------------------------------------------------------${NC}\n"
}

write_sep() {
    printf "${DARK_GRAY}----------------------------------------------------------------------------------------------------${NC}\n"
}

# ── Resolve file path ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
JSON_PATH="$SCRIPT_DIR/$COVERAGE_FILE"

if [[ ! -f "$JSON_PATH" ]]; then
    printf "${RED}Error: File not found: %s${NC}\n" "$JSON_PATH" >&2
    exit 1
fi

# ── Check dependencies ──
for cmd in jq bc; do
    if ! command -v "$cmd" &>/dev/null; then
        printf "${RED}Error: '%s' is required but not installed.${NC}\n" "$cmd" >&2
        exit 1
    fi
done

# ── Load total ──
TOTAL=$(jq '.total' "$JSON_PATH")

# ── Build file list (optionally filtered) ──
if [[ -n "$MODULE" ]]; then
    FILTER_LOWER=$(echo "$MODULE" | tr '[:upper:]' '[:lower:]')
    FILES_JSON=$(jq -c --arg filter "$FILTER_LOWER" '
        [ to_entries[] | select(.key != "total") |
          select(
            (.key | ascii_downcase | gsub("\\\\"; "/") | split("/")) | index($filter) != null
          )
        ]
    ' "$JSON_PATH")
    FILE_COUNT=$(echo "$FILES_JSON" | jq 'length')
    if [[ "$FILE_COUNT" -eq 0 ]]; then
        printf "${YELLOW}No files match module filter: '%s'${NC}\n" "$MODULE"
        exit 0
    fi
else
    FILES_JSON=$(jq -c '[ to_entries[] | select(.key != "total") ]' "$JSON_PATH")
    FILE_COUNT=$(echo "$FILES_JSON" | jq 'length')
fi

# ── Apply percentage filter ──
if [[ -n "$PCT_FILTER" ]]; then
    PCT_OP="${PCT_FILTER%%:*}"
    PCT_VAL="${PCT_FILTER#*:}"

    case "$PCT_OP" in
        same|under|upper) ;;
        *) printf "${RED}Error: invalid pct operator '%s'. Use same, under, or upper.${NC}\n" "$PCT_OP" >&2; exit 1 ;;
    esac

    if ! [[ "$PCT_VAL" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
        printf "${RED}Error: invalid pct value '%s'. Must be a number.${NC}\n" "$PCT_VAL" >&2
        exit 1
    fi

    PCT_VAL_NUM=$(echo "scale=2; $PCT_VAL / 1" | bc -l)
    PCT_VAL_JSON=$(printf "%.2f" "$PCT_VAL_NUM")

    case "$PCT_OP" in
        same)  JQ_SELECT='select(.value.lines.pct == $val)' ;;
        under) JQ_SELECT='select(.value.lines.pct < $val)' ;;
        upper) JQ_SELECT='select(.value.lines.pct >= $val)' ;;
    esac

    FILES_JSON=$(echo "$FILES_JSON" | jq -c --argjson val "$PCT_VAL_NUM" "[ .[] | $JQ_SELECT ]")

    FILE_COUNT=$(echo "$FILES_JSON" | jq 'length')
    if [[ "$FILE_COUNT" -eq 0 ]]; then
        printf "${YELLOW}No files match pct filter: '%s'${NC}\n" "$PCT_FILTER"
        exit 0
    fi
fi

# ── Build filter description for titles ──
FILTER_DESC=""
if [[ -n "$MODULE" ]]; then
    FILTER_DESC="module: '$MODULE'"
fi
if [[ -n "$PCT_FILTER" ]]; then
    if [[ -n "$FILTER_DESC" ]]; then FILTER_DESC+=", "; fi
    FILTER_DESC+="pct ${PCT_OP}:${PCT_VAL}"
fi

# ── Helper: compute pct from covered/total ──
compute_pct() {
    local covered="$1" total="$2"
    if [[ "$total" -gt 0 ]]; then
        echo "scale=2; $covered / $total * 100" | bc -l | awk '{printf "%.2f", $0}'
    else
        echo "100.00"
    fi
}

# ══════════════════════════════════════════════════════════════════════════════
# MODE: GROUP BY MODULE
# ══════════════════════════════════════════════════════════════════════════════
if [[ "$GROUP_BY_MODULE" == true ]]; then
    TITLE="Coverage Summary per Module"
    if [[ -n "$FILTER_DESC" ]]; then TITLE="$TITLE -- $FILTER_DESC"; fi
    write_header "$TITLE"

    MODULES=$(echo "$FILES_JSON" | jq -c '
        group_by(
            .key as $p |
            (($p | capture("^src[/\\\\]features[/\\\\](?<m>[^/\\\\]+)").m) //
             ($p | capture("^src[/\\\\](?<m>[^/\\\\]+)").m) // "other")
        ) | map({
            module: .[0].key as $p |
                (($p | capture("^src[/\\\\]features[/\\\\](?<m>[^/\\\\]+)").m) //
                 ($p | capture("^src[/\\\\](?<m>[^/\\\\]+)").m) // "other"),
            files: length,
            linesTot:   [.[].value.lines.total]       | add,
            linesCov:   [.[].value.lines.covered]     | add,
            stmtsTot:   [.[].value.statements.total]  | add,
            stmtsCov:   [.[].value.statements.covered]| add,
            funcsTot:   [.[].value.functions.total]   | add,
            funcsCov:   [.[].value.functions.covered] | add,
            brchsTot:   [.[].value.branches.total]    | add,
            brchsCov:   [.[].value.branches.covered]  | add
        }) | sort_by(.module) | .[]
    ')

    printf "${WHITE}%-30s %6s %7s %7s %7s %7s${NC}\n" "Module" "Files" "Lines%" "Stmts%" "Funcs%" "Branchs%"
    printf "${DARK_GRAY}--------------------------------------------------------------------------------${NC}\n"

    while IFS= read -r mod_entry; do
        [[ -z "$mod_entry" ]] && continue
        m=$(echo "$mod_entry" | jq -r '.module')
        fcount=$(echo "$mod_entry" | jq -r '.files')
        lt=$(echo "$mod_entry" | jq -r '.linesTot')
        lc=$(echo "$mod_entry" | jq -r '.linesCov')
        st=$(echo "$mod_entry" | jq -r '.stmtsTot')
        sc=$(echo "$mod_entry" | jq -r '.stmtsCov')
        ft=$(echo "$mod_entry" | jq -r '.funcsTot')
        fc=$(echo "$mod_entry" | jq -r '.funcsCov')
        bt=$(echo "$mod_entry" | jq -r '.brchsTot')
        bc=$(echo "$mod_entry" | jq -r '.brchsCov')

        lp=$(compute_pct "$lc" "$lt")
        sp=$(compute_pct "$sc" "$st")
        fp=$(compute_pct "$fc" "$ft")
        bp=$(compute_pct "$bc" "$bt")

        printf "%-30s %6d " "$m" "$fcount"
        write_pct "$lp"; printf " "
        write_pct "$sp"; printf " "
        write_pct "$fp"; printf " "
        write_pct "$bp"
        echo ""
    done <<< "$MODULES"

    write_sep
    printf "${WHITE}%-30s %6d${NC} " "TOTAL ($FILE_COUNT files)" "$FILE_COUNT"
    write_pct "$(echo "$TOTAL" | jq -r '.lines.pct')"; printf " "
    write_pct "$(echo "$TOTAL" | jq -r '.statements.pct')"; printf " "
    write_pct "$(echo "$TOTAL" | jq -r '.functions.pct')"; printf " "
    write_pct "$(echo "$TOTAL" | jq -r '.branches.pct')"
    echo ""
    exit 0
fi

# ══════════════════════════════════════════════════════════════════════════════
# MODE: DETAIL PER FILE
# ══════════════════════════════════════════════════════════════════════════════
TITLE="Coverage Detail"
if [[ -n "$FILTER_DESC" ]]; then
    TITLE="$TITLE -- $FILTER_DESC  ($FILE_COUNT files)"
else
    TITLE="$TITLE -- All Files ($FILE_COUNT files)"
fi
write_header "$TITLE"
write_col_header

SORTED_ENTRIES=$(echo "$FILES_JSON" | jq -c 'sort_by(.key) | .[]')

while IFS= read -r entry; do
    [[ -z "$entry" ]] && continue
    key=$(echo "$entry" | jq -r '.key')
    display="${key##*[/\\]}"

    lp=$(echo "$entry" | jq -r '.value.lines.pct')
    sp=$(echo "$entry" | jq -r '.value.statements.pct')
    fp=$(echo "$entry" | jq -r '.value.functions.pct')
    bp=$(echo "$entry" | jq -r '.value.branches.pct')

    printf "%-60s " "$display"
    write_pct "$lp"; printf " "
    write_pct "$sp"; printf " "
    write_pct "$fp"; printf " "
    write_pct "$bp"
    echo ""
done <<< "$SORTED_ENTRIES"

# ── Subtotal for filtered results ──
if [[ -n "$FILTER_DESC" ]]; then
    SUB=$(echo "$FILES_JSON" | jq -c '
        {
            linesTot:   [.[].value.lines.total]       | add,
            linesCov:   [.[].value.lines.covered]     | add,
            stmtsTot:   [.[].value.statements.total]  | add,
            stmtsCov:   [.[].value.statements.covered]| add,
            funcsTot:   [.[].value.functions.total]   | add,
            funcsCov:   [.[].value.functions.covered] | add,
            brchsTot:   [.[].value.branches.total]    | add,
            brchsCov:   [.[].value.branches.covered]  | add
        }
    ')

    lt=$(echo "$SUB" | jq -r '.linesTot')
    lc=$(echo "$SUB" | jq -r '.linesCov')
    st=$(echo "$SUB" | jq -r '.stmtsTot')
    sc=$(echo "$SUB" | jq -r '.stmtsCov')
    ft=$(echo "$SUB" | jq -r '.funcsTot')
    fc=$(echo "$SUB" | jq -r '.funcsCov')
    bt=$(echo "$SUB" | jq -r '.brchsTot')
    bc=$(echo "$SUB" | jq -r '.brchsCov')

    lp=$(compute_pct "$lc" "$lt")
    sp=$(compute_pct "$sc" "$st")
    fp=$(compute_pct "$fc" "$ft")
    bp=$(compute_pct "$bc" "$bt")

    write_sep
    printf "${WHITE}%-60s${NC} " "SUBTOTAL ($FILTER_DESC)"
    write_pct "$lp"; printf " "
    write_pct "$sp"; printf " "
    write_pct "$fp"; printf " "
    write_pct "$bp"
    echo ""
fi

# ── Grand Total ──
write_sep
printf "${WHITE}%-60s${NC} " "GRAND TOTAL (all files)"
write_pct "$(echo "$TOTAL" | jq -r '.lines.pct')"; printf " "
write_pct "$(echo "$TOTAL" | jq -r '.statements.pct')"; printf " "
write_pct "$(echo "$TOTAL" | jq -r '.functions.pct')"; printf " "
write_pct "$(echo "$TOTAL" | jq -r '.branches.pct')"
echo ""

# ── Legend ──
echo -n "Legend: "
echo -ne "${GREEN} >= 80% ${NC}"
echo -ne "${YELLOW} >= 50% ${NC}"
echo -e "${RED} < 50%  ${NC}"

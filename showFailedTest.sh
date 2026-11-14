#!/usr/bin/env bash

set -euo pipefail

INPUT_FILE=".output/tests/unit/test-results.json"
OUTPUT_JSON=".output/tests/unit/failed-tests.json"

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "Error: File not found: $INPUT_FILE"
  exit 1
fi

# Extract failed tests into a JSON file
jq '
[
  .testResults[]
  | . as $suite
  | $suite.assertionResults[]
  | select(.status == "failed")
  | {
      testFile: $suite.name,
      suite: .ancestorTitles,
      test: .title,
      fullName: .fullName,
      status: .status,
      duration: .duration,
      failureMessages: .failureMessages
    }
]
' "$INPUT_FILE" > "$OUTPUT_JSON"

# Print summary
COUNT=$(jq 'length' "$OUTPUT_JSON")
echo "Found $COUNT failed test(s)."
echo "Saved JSON report to: $OUTPUT_JSON"
echo

# Print readable output
jq -r '
.[] |
"Test File : \(.testFile)
Suite     : \(.suite | join(" > "))
Test      : \(.test)
Status    : \(.status)

Failure:
\(.failureMessages | join("\n"))

===================================================================="
' "$OUTPUT_JSON"
# Stop script on error
$ErrorActionPreference = "Stop"

# Load .env variables
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -match '^\s*$') {
            return
        }

        $key, $value = $_ -split '=', 2
        [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim())
    }
}
else {
    Write-Host ".env file not found!"
    exit 1
}

# Validate required variables
$requiredVars = @(
    "SONARQUBE_URL",
    "SONARQUBE_TOKEN",
    "SONARQUBE_PROJECT",
    "SONARQUBE_SOURCES"
)

foreach ($var in $requiredVars) {
    $value = [System.Environment]::GetEnvironmentVariable($var)

    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Host "Missing required variable: $var"
        exit 1
    }
}

$SONARQUBE_URL = [System.Environment]::GetEnvironmentVariable("SONARQUBE_URL")
$SONARQUBE_TOKEN = [System.Environment]::GetEnvironmentVariable("SONARQUBE_TOKEN")
$SONARQUBE_PROJECT = [System.Environment]::GetEnvironmentVariable("SONARQUBE_PROJECT")
$SONARQUBE_SOURCES = [System.Environment]::GetEnvironmentVariable("SONARQUBE_SOURCES")
$SONARQUBE_EXCLUSIONS = [System.Environment]::GetEnvironmentVariable("SONARQUBE_EXCLUSIONS")
$SONARQUBE_LCOV = [System.Environment]::GetEnvironmentVariable("SONARQUBE_LCOV")

Write-Host "Starting SonarQube scan for React project..."
Write-Host "Project : $SONARQUBE_PROJECT"
Write-Host "Sources : $SONARQUBE_SOURCES"
Write-Host "Server  : $SONARQUBE_URL"

# Write-Host "`nRunning vitest with coverage..."
# npx vitest run --coverage

# if ($LASTEXITCODE -ne 0) {
#     Write-Host "Vitest failed with exit code $LASTEXITCODE"
#     exit $LASTEXITCODE
# }

# Write-Host "Vitest completed successfully. Proceeding with SonarQube scan...`n"

# Build exclusions argument
$exclusions = if ($SONARQUBE_EXCLUSIONS) { $SONARQUBE_EXCLUSIONS } else { "node_modules/**,dist/**,build/**,coverage/**,**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/*.d.ts" }

# Build scanner arguments
$scannerArgs = @(
    "-Dsonar.projectKey=$SONARQUBE_PROJECT",
    "-Dsonar.sources=$SONARQUBE_SOURCES",
    "-Dsonar.exclusions=$exclusions",
    "-Dsonar.host.url=$SONARQUBE_URL",
    "-Dsonar.token=$SONARQUBE_TOKEN",
    "-Dsonar.sourceEncoding=UTF-8"
)

# Add LCOV coverage report if available
if ($SONARQUBE_LCOV) {
    $scannerArgs += "-Dsonar.javascript.lcov.reportPaths=$SONARQUBE_LCOV"
    Write-Host "Coverage : $SONARQUBE_LCOV"
} elseif (Test-Path "coverage/lcov.info") {
    $scannerArgs += "-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info"
    Write-Host "Coverage : coverage/lcov.info (auto-detected)"
}

sonar-scanner @scannerArgs

Write-Host "SonarQube scan completed successfully."
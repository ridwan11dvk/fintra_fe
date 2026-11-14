<#
.SYNOPSIS
    Menampilkan persentase coverage dari coverage-summary.json.

.PARAMETER Module
    Filter opsional. Hanya tampilkan file yang path-nya mengandung string ini.
    Contoh: "master-data", "bank", "auth", "treasury"

.PARAMETER CoverageFile
    Path ke file coverage-summary.json.
    Default: .output\tests\coverage\coverage-summary.json

.PARAMETER GroupByModule
    Tampilkan ringkasan per modul (folder fitur) tanpa detail per file.

.EXAMPLE
    .\Show-Coverage.ps1
    .\Show-Coverage.ps1 -Module "master-data"
    .\Show-Coverage.ps1 -Module "bank"
    .\Show-Coverage.ps1 -GroupByModule
#>

param(
    [string]$Module = "",
    [string]$CoverageFile = ".output\tests\coverage\coverage-summary.json",
    [switch]$GroupByModule
)

# ── Helpers ─────────────────────────────────────────────────────────────────

function Get-PctColor([double]$pct) {
    if ($pct -ge 80) { return "Green" }
    if ($pct -ge 50) { return "Yellow" }
    return "Red"
}

function Write-Pct([double]$pct, [int]$width = 7) {
    $text = ("{0,6:F2}%" -f $pct)
    Write-Host $text -ForegroundColor (Get-PctColor $pct) -NoNewline
}

function Write-Header([string]$title) {
    Write-Host ""
    Write-Host ("=" * 100) -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host ("=" * 100) -ForegroundColor Cyan
}

function Write-ColumnHeader {
    Write-Host ("{0,-60} {1,7} {2,7} {3,7} {4,7}" -f "File", "Lines%", "Stmts%", "Funcs%", "Branchs%") -ForegroundColor White
    Write-Host ("-" * 100) -ForegroundColor DarkGray
}

function Get-RelativePath([string]$fullPath) {
    # Ambil path relatif dari "src/" ke bawah
    if ($fullPath -match '\\src\\(.+)$') {
        return "src\" + $Matches[1]
    }
    return $fullPath
}

function Get-ModuleName([string]$relativePath) {
    # Ekstrak nama modul dari path: src\features\<module>\...
    if ($relativePath -match '^src[/\\]features[/\\]([^/\\]+)') {
        return $Matches[1]
    }
    if ($relativePath -match '^src[/\\]([^/\\]+)') {
        return $Matches[1]
    }
    return "other"
}

# ── Load JSON ────────────────────────────────────────────────────────────────

$jsonPath = Join-Path $PSScriptRoot $CoverageFile
if (-not (Test-Path $jsonPath)) {
    Write-Host "ERROR: File tidak ditemukan: $jsonPath" -ForegroundColor Red
    exit 1
}

$raw = Get-Content $jsonPath -Raw | ConvertFrom-Json

# Pisahkan "total" dari entri file
$totalEntry = $raw.total
$fileEntries = $raw.PSObject.Properties | Where-Object { $_.Name -ne "total" }

# ── Terapkan Filter ──────────────────────────────────────────────────────────

if ($Module -ne "") {
    $filterLower = $Module.ToLower()
    $fileEntries = $fileEntries | Where-Object {
        # Cocokkan per segmen path agar "bank" tidak ikut mencocokkan "house-bank"
        $segments = ($_.Name.ToLower() -replace '\\', '/') -split '/'
        $segments -contains $filterLower
    }

    if ($null -eq $fileEntries -or @($fileEntries).Count -eq 0) {
        Write-Host "Tidak ada file yang cocok dengan filter: '$Module'" -ForegroundColor Yellow
        exit 0
    }
}

$fileList = @($fileEntries)

# ── Mode: Group By Module ────────────────────────────────────────────────────

if ($GroupByModule) {
    $title = if ($Module) { "Coverage Ringkasan per Modul - filter: '$Module'" } else { "Coverage Ringkasan per Modul" }
    Write-Header $title

    # Kumpulkan data per modul
    $moduleMap = @{}

    foreach ($entry in $fileList) {
        $rel  = Get-RelativePath $entry.Name
        $mod  = Get-ModuleName $rel
        $data = $entry.Value

        if (-not $moduleMap.ContainsKey($mod)) {
            $moduleMap[$mod] = @{ linesTot=0; linesCov=0; stmtsTot=0; stmtsCov=0; funcsTot=0; funcsCov=0; brchsTot=0; brchsCov=0; files=0 }
        }
        $m = $moduleMap[$mod]
        $m.linesTot  += $data.lines.total
        $m.linesCov  += $data.lines.covered
        $m.stmtsTot  += $data.statements.total
        $m.stmtsCov  += $data.statements.covered
        $m.funcsTot  += $data.functions.total
        $m.funcsCov  += $data.functions.covered
        $m.brchsTot  += $data.branches.total
        $m.brchsCov  += $data.branches.covered
        $m.files     += 1
    }

    Write-Host ("{0,-30} {1,6} {2,7} {3,7} {4,7} {5,7}" -f "Module", "Files", "Lines%", "Stmts%", "Funcs%", "Branchs%") -ForegroundColor White
    Write-Host ("-" * 80) -ForegroundColor DarkGray

    $moduleMap.GetEnumerator() | Sort-Object Name | ForEach-Object {
        $mod = $_.Key
        $m   = $_.Value
        $lp  = if ($m.linesTot  -gt 0) { [math]::Round($m.linesCov  / $m.linesTot  * 100, 2) } else { 100.0 }
        $sp  = if ($m.stmtsTot  -gt 0) { [math]::Round($m.stmtsCov  / $m.stmtsTot  * 100, 2) } else { 100.0 }
        $fp  = if ($m.funcsTot  -gt 0) { [math]::Round($m.funcsCov  / $m.funcsTot  * 100, 2) } else { 100.0 }
        $bp  = if ($m.brchsTot  -gt 0) { [math]::Round($m.brchsCov  / $m.brchsTot  * 100, 2) } else { 100.0 }

        Write-Host ("{0,-30} {1,6}" -f $mod, $m.files) -NoNewline
        Write-Host " " -NoNewline
        Write-Pct $lp; Write-Host " " -NoNewline
        Write-Pct $sp; Write-Host " " -NoNewline
        Write-Pct $fp; Write-Host " " -NoNewline
        Write-Pct $bp
        Write-Host ""
    }

    Write-Host ("-" * 80) -ForegroundColor DarkGray
    $totFiles = @($fileList).Count
    Write-Host ("{0,-30} {1,6}" -f "TOTAL ($($totFiles) files)", $totFiles) -NoNewline -ForegroundColor White
    Write-Host " " -NoNewline
    Write-Pct $totalEntry.lines.pct; Write-Host " " -NoNewline
    Write-Pct $totalEntry.statements.pct; Write-Host " " -NoNewline
    Write-Pct $totalEntry.functions.pct; Write-Host " " -NoNewline
    Write-Pct $totalEntry.branches.pct
    Write-Host ""
    exit 0
}

# ── Mode: Detail per File ────────────────────────────────────────────────────

$title = if ($Module) { "Coverage Detail - filter: '$Module'  ($($fileList.Count) file)" } else { "Coverage Detail - Semua File ($($fileList.Count) file)" }
Write-Header $title
Write-ColumnHeader

foreach ($entry in ($fileList | Sort-Object Name)) {
    $rel  = Get-RelativePath $entry.Name
    $data = $entry.Value

    # Tampilkan nama file saja
    $display = [System.IO.Path]::GetFileName($rel)

    Write-Host ("{0,-60} " -f $display) -NoNewline
    Write-Pct $data.lines.pct;      Write-Host " " -NoNewline
    Write-Pct $data.statements.pct; Write-Host " " -NoNewline
    Write-Pct $data.functions.pct;  Write-Host " " -NoNewline
    Write-Pct $data.branches.pct
    Write-Host ""
}

# ── Ringkasan Agregat (untuk hasil filter) ────────────────────────────────────

if ($Module -ne "") {
    # Hitung ulang total dari file yang terfilter
    $linesTot = ($fileList | ForEach-Object { $_.Value.lines.total }     | Measure-Object -Sum).Sum
    $linesCov = ($fileList | ForEach-Object { $_.Value.lines.covered }   | Measure-Object -Sum).Sum
    $stmtsTot = ($fileList | ForEach-Object { $_.Value.statements.total } | Measure-Object -Sum).Sum
    $stmtsCov = ($fileList | ForEach-Object { $_.Value.statements.covered } | Measure-Object -Sum).Sum
    $funcsTot = ($fileList | ForEach-Object { $_.Value.functions.total } | Measure-Object -Sum).Sum
    $funcsCov = ($fileList | ForEach-Object { $_.Value.functions.covered } | Measure-Object -Sum).Sum
    $brchsTot = ($fileList | ForEach-Object { $_.Value.branches.total }  | Measure-Object -Sum).Sum
    $brchsCov = ($fileList | ForEach-Object { $_.Value.branches.covered } | Measure-Object -Sum).Sum

    $lp = if ($linesTot -gt 0) { [math]::Round($linesCov / $linesTot * 100, 2) } else { 100.0 }
    $sp = if ($stmtsTot -gt 0) { [math]::Round($stmtsCov / $stmtsTot * 100, 2) } else { 100.0 }
    $fp = if ($funcsTot -gt 0) { [math]::Round($funcsCov / $funcsTot * 100, 2) } else { 100.0 }
    $bp = if ($brchsTot -gt 0) { [math]::Round($brchsCov / $brchsTot * 100, 2) } else { 100.0 }

    Write-Host ("-" * 100) -ForegroundColor DarkGray
    Write-Host ("{0,-60} " -f "SUBTOTAL '$($Module)'") -NoNewline -ForegroundColor White
    Write-Pct $lp; Write-Host " " -NoNewline
    Write-Pct $sp; Write-Host " " -NoNewline
    Write-Pct $fp; Write-Host " " -NoNewline
    Write-Pct $bp
    Write-Host ""
}

# ── Grand Total ──────────────────────────────────────────────────────────────

Write-Host ("-" * 100) -ForegroundColor DarkGray
Write-Host ("{0,-60} " -f "GRAND TOTAL (all files)") -NoNewline -ForegroundColor White
Write-Pct $totalEntry.lines.pct;      Write-Host " " -NoNewline
Write-Pct $totalEntry.statements.pct; Write-Host " " -NoNewline
Write-Pct $totalEntry.functions.pct;  Write-Host " " -NoNewline
Write-Pct $totalEntry.branches.pct
Write-Host ""

# ── Legend ───────────────────────────────────────────────────────────────────
Write-Host "Legend: " -NoNewline
Write-Host " >= 80% " -ForegroundColor Green -NoNewline
Write-Host " >= 50% " -ForegroundColor Yellow -NoNewline
Write-Host " < 50%  " -ForegroundColor Red
Write-Host ""

[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $MavenArguments = @("spring-boot:run")
)

$backendDir = Split-Path -Parent $PSScriptRoot
$environmentFile = Join-Path $backendDir "env\local.env"
$wrapperPropertiesFile = Join-Path $backendDir ".mvn\wrapper\maven-wrapper.properties"

if (-not (Test-Path -LiteralPath $environmentFile)) {
    throw "No existe $environmentFile. Crea el archivo a partir de env\local.env.example."
}

# Bootstrap the wrapper before injecting DB variables. On this Windows setup,
# the generated wrapper fails while resolving Maven when custom variables exist.
$wrapperProperties = ConvertFrom-StringData (Get-Content -LiteralPath $wrapperPropertiesFile -Raw)
$mavenVersionDirectory = [System.IO.Path]::GetFileName($wrapperProperties.distributionUrl) -replace "-bin\.zip$", ""
$mavenCommands = @(Get-ChildItem -Path (Join-Path $HOME ".m2\wrapper\dists") -Filter "mvn.cmd" -File -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -like "*$mavenVersionDirectory*" })
if ($mavenCommands.Count -eq 0) {
    Push-Location $backendDir
    try {
        & (Join-Path $backendDir "mvnw.cmd") -q -DskipTests compile
        if ($LASTEXITCODE -ne 0) {
            exit $LASTEXITCODE
        }
    }
    finally {
        Pop-Location
    }
    $mavenCommands = @(Get-ChildItem -Path (Join-Path $HOME ".m2\wrapper\dists") -Filter "mvn.cmd" -File -Recurse -ErrorAction Stop |
        Where-Object { $_.FullName -like "*$mavenVersionDirectory*" })
}

foreach ($line in Get-Content -LiteralPath $environmentFile) {
    $trimmedLine = $line.Trim()
    if ($trimmedLine.Length -eq 0 -or $trimmedLine.StartsWith("#")) {
        continue
    }

    $parts = $trimmedLine.Split("=", 2)
    if ($parts.Count -ne 2 -or [string]::IsNullOrWhiteSpace($parts[0])) {
        throw "Linea invalida en $environmentFile`: $line"
    }

    Set-Item -Path ("Env:" + $parts[0].Trim()) -Value $parts[1].Trim()
}

$mavenCommand = $mavenCommands |
    Sort-Object -Property LastWriteTime -Descending |
    Select-Object -First 1 -ExpandProperty FullName

Push-Location $backendDir
try {
    & $mavenCommand @MavenArguments
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}

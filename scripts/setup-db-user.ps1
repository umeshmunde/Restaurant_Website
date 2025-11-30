<#
scripts/setup-db-user.ps1

Prompts for MySQL root password and a password for the `foodie` DB user,
creates the `restaurant_db` database, creates/updates the `foodie` user for
'localhost' and '%' and grants privileges, and imports `schema.sql` if present.

Security note: this script will convert secure strings to plain text in memory
only for the duration of the command. Avoid putting credentials into source.
#>

param()

function Read-PlainPassword([string]$prompt) {
    $secure = Read-Host -AsSecureString -Prompt $prompt
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    } finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
    return $plain
}

Write-Host "This script will create database 'restaurant_db' and a user 'foodie'."
$rootPass = Read-PlainPassword "Enter MySQL root password (will be hidden)"
$foodiePass = Read-PlainPassword "Enter password to set for 'foodie' user (will be hidden)"

# Build SQL statements
$sql = @"
CREATE DATABASE IF NOT EXISTS `restaurant_db`;
CREATE USER IF NOT EXISTS 'foodie'@'localhost' IDENTIFIED BY '$foodiePass';
GRANT ALL PRIVILEGES ON `restaurant_db`.* TO 'foodie'@'localhost';
CREATE USER IF NOT EXISTS 'foodie'@'%' IDENTIFIED BY '$foodiePass';
GRANT ALL PRIVILEGES ON `restaurant_db`.* TO 'foodie'@'%';
FLUSH PRIVILEGES;
"@

# Write temp sql file
$tmpFile = Join-Path $PSScriptRoot "tmp_setup.sql"
Set-Content -Path $tmpFile -Value $sql -Encoding UTF8

# locate mysql executable (assumes in PATH)
$mysqlExe = "mysql"

# Run the SQL using the root account
Write-Host "Running database/user setup as root..."
$argList = @("-u", "root", "-p$rootPass", "-e", "SOURCE $tmpFile;")
$proc = & $mysqlExe @argList 2>&1
$exit = $LASTEXITCODE
if ($exit -ne 0) {
    Write-Error "MySQL command failed. Output:`n$proc"
    Remove-Item -Path $tmpFile -ErrorAction SilentlyContinue
    exit $exit
}

Write-Host "User and database created/updated successfully."

# Import schema.sql if exists
$schemaPath = Join-Path $PSScriptRoot "..\schema.sql"
if (Test-Path $schemaPath) {
    Write-Host "Importing schema from $schemaPath..."
    $argList2 = @("-u", "root", "-p$rootPass", "restaurant_db", "-e", "SOURCE $schemaPath;")
    $proc2 = & $mysqlExe @argList2 2>&1
    $exit2 = $LASTEXITCODE
    if ($exit2 -ne 0) {
        Write-Error "Schema import failed. Output:`n$proc2"
        Remove-Item -Path $tmpFile -ErrorAction SilentlyContinue
        exit $exit2
    }
    Write-Host "Schema imported successfully."
} else {
    Write-Host "No schema.sql found at $schemaPath — skipping import."
}

# cleanup
Remove-Item -Path $tmpFile -ErrorAction SilentlyContinue

# Zero out secrets from variables
$rootPass = $null
$foodiePass = $null

Write-Host "Done. You can now connect using the 'foodie' user."

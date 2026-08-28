$ErrorActionPreference = "Continue"
$env:NODE_ENV = "production"
Set-Location "D:\add-project\Databuddy\apps\dashboard"
bunx dotenv -e ../../.env -- next start -p 3000
$ErrorActionPreference = "Continue"
$env:NODE_ENV = "production"
Set-Location "D:\add-project\Databuddy\apps\status"
bunx dotenv -e ../../.env -- next start -p 3002
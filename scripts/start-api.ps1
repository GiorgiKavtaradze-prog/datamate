$ErrorActionPreference = "Continue"
$env:NODE_ENV = "production"
Set-Location "D:\add-project\Databuddy\apps\api"
bunx dotenv -e ../../.env -- bun src/index.ts
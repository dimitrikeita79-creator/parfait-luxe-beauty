# Screenshot automation for Play Store
# Requires: adb in PATH, device/emulator connected
# Usage: .\capture-screenshots.ps1

$ErrorActionPreference = "Stop"

function Invoke-Adb {
    param([string]$cmd)
    adb $cmd
}

# Check device
$device = Invoke-Adb "devices" | Select-String "device$" | Select-Object -First 1
if (-not $device) {
    Write-Error "No Android device/emulator connected. Run 'adb devices' to check."
}

$serial = ($device.ToString().Split("`t"))[0]
Write-Host "Using device: $serial"

$screenshotDir = "C:\projects\parfait-luxe-beauty\android\play-store-screenshots"
New-Item -ItemType Directory -Path $screenshotDir -Force | Out-Null

$pages = @(
    @{ name = "01-home"; activity = "bf.parfaitdesign.desmohair/.MainActivity"; extras = @{} },
    @{ name = "02-services"; activity = "bf.parfaitdesign.desmohair/.MainActivity"; extras = @{ "url" = "file:///android_asset/app/services/index.html" } },
    @{ name = "03-catalog"; activity = "bf.parfaitdesign.desmohair/.MainActivity"; extras = @{ "url" = "file:///android_asset/app/catalog/index.html" } },
    @{ name = "04-cart"; activity = "bf.parfaitdesign.desmohair/.MainActivity"; extras = @{ "url" = "file:///android_asset/app/index.html#cart" } },
    @{ name = "05-profile"; activity = "bf.parfaitdesign.desmohair/.MainActivity"; extras = @{ "url" = "file:///android_asset/app/profile/index.html" } }
)

Write-Host "`nNavigate manually to each screen, then press Enter to capture..."
Write-Host "Screenshots will be saved to: $screenshotDir`n"

$i = 1
foreach ($page in $pages) {
    Write-Host "[$i/5] Prepare: $($page.name)"
    Write-Host "      Navigate to the screen, then press Enter to capture..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $localPath = "$screenshotDir\$($page.name).png"
    $devicePath = "/sdcard/desmohair_screenshot_$timestamp.png"
    
    Invoke-Adb "-s $serial shell screencap -p $devicePath"
    Invoke-Adb "-s $serial pull $devicePath $localPath"
    Invoke-Adb "-s $serial shell rm $devicePath"
    
    $img = [System.Drawing.Image]::FromFile($localPath)
    Write-Host "      Saved: $localPath ($($img.Width)x$($img.Height))"
    $img.Dispose()
    $i++
}

Write-Host "`nAll screenshots saved to: $screenshotDir"
Write-Host "Recommended: resize/crop to phone dimensions (e.g., 1080x2400) before uploading to Play Store."

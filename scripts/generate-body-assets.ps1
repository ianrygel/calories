Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

function New-BodyAsset {
  param(
    [string]$Gender,
    [int]$BodyFat,
    [string]$OutputPath
  )

  $width = 720
  $height = 900
  $bitmap = New-Object System.Drawing.Bitmap $width, $height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle 0, 0, $width, $height),
    [System.Drawing.Color]::FromArgb(28, 20, 184, 166),
    [System.Drawing.Color]::FromArgb(18, 249, 115, 22),
    90
  )
  $graphics.FillRectangle($bgBrush, 0, 0, $width, $height)

  $fatNorm = if ($Gender -eq "male") {
    ($BodyFat - 8) / 27
  } else {
    ($BodyFat - 18) / 27
  }
  $fatNorm = [Math]::Max(0, [Math]::Min(1, $fatNorm))

  $centerX = 360
  $skin = [System.Drawing.Color]::FromArgb(255, 196, 138, 100)
  $skinShadow = [System.Drawing.Color]::FromArgb(255, 145, 91, 65)
  $top = if ($Gender -eq "male") {
    [System.Drawing.Color]::FromArgb(255, 22, 163, 150)
  } else {
    [System.Drawing.Color]::FromArgb(255, 236, 99, 78)
  }
  $bottom = [System.Drawing.Color]::FromArgb(255, 28, 45, 63)
  $skinBrush = New-Object System.Drawing.SolidBrush $skin
  $skinShadowBrush = New-Object System.Drawing.SolidBrush $skinShadow
  $topBrush = New-Object System.Drawing.SolidBrush $top
  $bottomBrush = New-Object System.Drawing.SolidBrush $bottom
  $hiBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(48, 255, 255, 255))
  $shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(42, 0, 0, 0))

  $headW = if ($Gender -eq "male") { 88 } else { 82 }
  $graphics.FillEllipse($skinBrush, $centerX - $headW / 2, 70, $headW, 98)
  $graphics.FillEllipse($hiBrush, $centerX - $headW / 4, 86, 24, 22)

  $shoulder = if ($Gender -eq "male") { 210 - 22 * $fatNorm } else { 174 + 8 * $fatNorm }
  $waist = if ($Gender -eq "male") { 106 + 112 * $fatNorm } else { 114 + 86 * $fatNorm }
  $hip = if ($Gender -eq "male") { 138 + 70 * $fatNorm } else { 184 + 66 * $fatNorm }
  $chestY = 185
  $waistY = 420
  $hipY = 510

  $torso = New-Object System.Drawing.Drawing2D.GraphicsPath
  $torso.AddBezier(
    $centerX - $shoulder / 2, $chestY,
    $centerX - $shoulder / 2 - 14, 270,
    $centerX - $waist / 2 - 8, 350,
    $centerX - $waist / 2, $waistY
  )
  $torso.AddBezier(
    $centerX - $waist / 2, $waistY,
    $centerX - $hip / 2, 462,
    $centerX - $hip / 2, 488,
    $centerX - $hip / 2, $hipY
  )
  $torso.AddLine($centerX + $hip / 2, $hipY, $centerX + $waist / 2, $waistY)
  $torso.AddBezier(
    $centerX + $waist / 2, $waistY,
    $centerX + $waist / 2 + 8, 350,
    $centerX + $shoulder / 2 + 14, 270,
    $centerX + $shoulder / 2, $chestY
  )
  $torso.CloseFigure()
  $graphics.FillPath($topBrush, $torso)
  $graphics.FillPath($hiBrush, $torso)

  $armW = 34 + 32 * $fatNorm
  $graphics.FillEllipse($skinBrush, $centerX - $shoulder / 2 - $armW, 198, $armW, 260)
  $graphics.FillEllipse($skinBrush, $centerX + $shoulder / 2, 198, $armW, 260)
  $graphics.FillEllipse($skinShadowBrush, $centerX - $shoulder / 2 - $armW - 5, 432, $armW + 10, 52)
  $graphics.FillEllipse($skinShadowBrush, $centerX + $shoulder / 2 - 5, 432, $armW + 10, 52)

  $shorts = New-Object System.Drawing.Drawing2D.GraphicsPath
  $shorts.AddRectangle((New-Object System.Drawing.RectangleF ($centerX - $hip / 2), 500, $hip, 100))
  $graphics.FillPath($bottomBrush, $shorts)

  $legTop = if ($Gender -eq "male") { 58 + 48 * $fatNorm } else { 66 + 44 * $fatNorm }
  $ankle = if ($Gender -eq "male") { 32 + 14 * $fatNorm } else { 28 + 12 * $fatNorm }
  foreach ($side in @(-1, 1)) {
    $leg = New-Object System.Drawing.Drawing2D.GraphicsPath
    $inner = $centerX + $side * 18
    $outerTop = $centerX + $side * ($legTop + 16)
    $outerAnkle = $centerX + $side * ($ankle + 42)
    $leg.AddLine($inner, 594, $outerTop, 594)
    $leg.AddBezier($outerTop, 594, $outerTop + $side * 16, 682, $outerAnkle, 760, $outerAnkle, 820)
    $leg.AddLine($outerAnkle, 820, $centerX + $side * 22, 820)
    $leg.AddBezier($centerX + $side * 22, 820, $centerX + $side * 30, 732, $centerX + $side * 20, 662, $inner, 594)
    $leg.CloseFigure()
    $graphics.FillPath($skinBrush, $leg)
    $graphics.FillPath($hiBrush, $leg)
    $graphics.FillEllipse($bottomBrush, $centerX + $side * 18 - 54, 812, 108, 26)
  }

  $graphics.FillEllipse($shadowBrush, 186, 834, 348, 32)
  $font = New-Object System.Drawing.Font "Arial", 30, ([System.Drawing.FontStyle]::Bold)
  $graphics.DrawString("$BodyFat%", $font, $topBrush, 42, 42)

  $dir = Split-Path -Parent $OutputPath
  if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
  }

  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $font.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$sets = @{
  male = @(8, 10, 12, 15, 18, 22, 25, 30, 35)
  female = @(18, 20, 22, 25, 28, 32, 35, 40, 45)
}

foreach ($gender in $sets.Keys) {
  foreach ($bf in $sets[$gender]) {
    New-BodyAsset -Gender $gender -BodyFat $bf -OutputPath (Join-Path $root "public\$gender\$bf.png")
  }
}

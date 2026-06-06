# Generates CCP.ico — a minimalist asymmetric split-pane mark (rounded window,
# one tall pane + two stacked), teal on dark. Windows PowerShell 5.1.
Add-Type -AssemblyName System.Drawing

function New-CcpIcon {
  param(
    [string]$OutputIcoPath = "$PSScriptRoot\CCP.ico",
    [int[]]$Sizes = @(16, 24, 32, 48, 64, 128, 256)
  )

  $pngImages = foreach ($size in $Sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    # rounded-rect window
    $r = [int]($size * 0.20); if ($r -lt 2) { $r = 2 }
    $d = $r * 2
    $m = [Math]::Max(1, [int]($size * 0.06))  # outer margin so the round corners breathe
    $x0 = $m; $y0 = $m; $x1 = $size - $m; $y1 = $size - $m
    $w = $x1 - $x0
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc($x0, $y0, $d, $d, 180, 90)
    $path.AddArc($x1 - $d, $y0, $d, $d, 270, 90)
    $path.AddArc($x1 - $d, $y1 - $d, $d, $d, 0, 90)
    $path.AddArc($x0, $y1 - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    $bg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 27, 30, 36)) # #1b1e24
    $g.FillPath($bg, $path)

    $lw = [Math]::Max(1, [int]($size * 0.05))
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 86, 182, 194), $lw) # #56b6c2
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawPath($pen, $path)

    # inner panes: a tall left pane + two stacked right panes (asymmetric)
    $pad = [int]($size * 0.20)
    $vx = $x0 + [int]($w * 0.46)
    $cy = [int](($y0 + $y1) / 2)
    $g.DrawLine($pen, $vx, ($y0 + $pad), $vx, ($y1 - $pad))          # vertical split
    $g.DrawLine($pen, $vx, $cy, ($x1 - $pad), $cy)                    # horizontal split (right side)

    $bg.Dispose(); $pen.Dispose(); $path.Dispose(); $g.Dispose()

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    [pscustomobject]@{ Size = $size; Bytes = $ms.ToArray() }
  }

  $fs = [System.IO.File]::Create($OutputIcoPath)
  $bw = New-Object System.IO.BinaryWriter($fs)
  $bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]$pngImages.Count)
  $offset = 6 + (16 * $pngImages.Count)
  foreach ($img in $pngImages) {
    $dim = if ($img.Size -ge 256) { 0 } else { $img.Size }
    $bw.Write([byte]$dim); $bw.Write([byte]$dim); $bw.Write([byte]0); $bw.Write([byte]0)
    $bw.Write([uint16]1); $bw.Write([uint16]32)
    $bw.Write([uint32]$img.Bytes.Length); $bw.Write([uint32]$offset)
    $offset += $img.Bytes.Length
  }
  foreach ($img in $pngImages) { $bw.Write($img.Bytes) }
  $bw.Flush(); $bw.Close(); $fs.Close()
  Write-Host "Wrote $OutputIcoPath ($($pngImages.Count) sizes)"
}

New-CcpIcon

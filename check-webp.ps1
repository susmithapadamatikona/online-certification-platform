Add-Type -AssemblyName PresentationCore
$asm = [System.Windows.Media.Imaging.BitmapEncoder].Assembly
$asm.GetTypes() |
  Where-Object { $_.FullName -like '*Web*' } |
  Select-Object -ExpandProperty FullName

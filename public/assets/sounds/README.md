# Windows XP sounds (add your own)

To use the **real Windows XP sounds** for boot and login:

1. Add these two files to this folder (`public/assets/sounds/`):

   - **winxp-startup.wav** — plays when the boot screen appears  
     (From XP: `C:\Windows\Media\startup.wav`)

   - **winxp-logon.wav** — plays when you click OK on the login dialog  
     (From XP: `C:\Windows\Media\Windows Logon.wav`)

2. Keep the filenames exactly as above so the app can find them.

If the files are missing or fail to load, the site falls back to a short synthesized chime.

*You must obtain the sound files yourself (e.g. from a Windows XP install you own). They are not included in this repo.*

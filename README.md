# 🚀 IDM Activator Wrapper

A lightweight Go wrapper for the [Coporton IDM Activation Script](https://bitbucket.org/coporton/idm-activation-script/src/main/) – an open‑source tool to activate and reset the trial of Internet Download Manager.

> **⚠️ Educational & Fair Use Only** – This tool is intended for learning purposes. Using it to circumvent software licensing may violate the EULA of Internet Download Manager. Use at your own risk.

---

## ✨ Features

- ✅ **Clean terminal interface** – shows a stylish banner with the Myst‑25 logo
- ✅ **Admin detection** – warns you if not running as Administrator
- ✅ **Confirmation prompt** – prevents accidental execution
- ✅ **Quiet mode** (`-q`) – skip the prompt for automation
- ✅ **Dry‑run mode** (`--dry-run`) – preview the command without executing
- ✅ **One‑click build** – compiles to a single Windows `.exe`

---

## 📦 What This Wrapper Does

This wrapper downloads and executes the official Coporton IDM Activation Script (`IASL.cmd`) from:

```
https://coporton.com/ias
```

The original script provides a menu‑driven interface that lets you:

| Option | Description |
|--------|-------------|
| **1** | Download the latest IDM version |
| **2** | Activate Internet Download Manager |
| **3** | Add extra file‑type extensions |
| **4** | Do Everything (activation + extensions) |
| **5** | Completely remove IDM registry entries |
| **6** | Exit |

The wrapper simply downloads and runs that script – it does **not** modify or replace any of the original logic.

---

## 🙏 Credits

All credit for the activation logic goes to the **Coporton** team and the contributors of the [IDM-Activation-Script](https://bitbucket.org/coporton/idm-activation-script/src/main/) repository.

This wrapper is just a Go‑based launcher that provides:
- A clean, colorful terminal interface
- A dry‑run mode to preview the command
- A quiet mode to skip confirmation prompts
- Administrator privilege detection

**Original script repository:** [bitbucket.org/coporton/idm-activation-script](https://bitbucket.org/coporton/idm-activation-script/src/main/)

---

## 🛠️ How to Build

### Prerequisites
- [Go 1.22+](https://go.dev/dl/) installed on Windows

### Steps

1. **Clone or download** this repository.

2. **Open a Command Prompt** in the project folder.

3. **Build the executable:**
   ```cmd
   go build -ldflags="-s -w" -o IDM-Activator.exe main.go
   ```
   The `-ldflags="-s -w"` flag strips debug information, making the `.exe` smaller.

4. *(Optional)* – If you want a smaller file, you can also use [UPX](https://upx.github.io/):
   ```cmd
   upx --best --ultra-brute IDM-Activator.exe
   ```

---

## ▶️ How to Run

### Recommended (Admin)
**Right‑click** `IDM-Activator.exe` → select **"Run as administrator"**.  
Running as Administrator prevents the original script from opening a second terminal window for UAC elevation.

### Command‑Line Options

| Command | Effect |
|---------|--------|
| `IDM-Activator.exe` | Interactive mode – asks for confirmation before running |
| `IDM-Activator.exe -q` | **Quiet mode** – skips the confirmation prompt |
| `IDM-Activator.exe --dry-run` | **Dry‑run** – shows what would be executed without actually running it |

### Example
```cmd
IDM-Activator.exe -q
```
This will download and execute the activation script without any prompts.

---

## 📸 Screenshot

When you run the wrapper, you'll see a banner like this:

```
 /$$      /$$                       /$$              /$$$$$$  /$$$$$$$ 
| $$$    /$$$                      | $$             /$$__  $$| $$____/ 
| $$$$  /$$$$ /$$   /$$  /$$$$$$$ /$$$$$$          |__/  \ $$| $$      
| $$ $$/$$ $$| $$  | $$ /$$_____/|_  $$_/   /$$$$$$  /$$$$$$/| $$$$$$$ 
| $$  $$$| $$| $$  | $$|  $$$$$$   | $$    |______/ /$$____/ |_____  $$
| $$\  $ | $$| $$  | $$ \____  $$  | $$ /$$        | $$       /$$  \ $$
| $$ \/  | $$|  $$$$$$$ /$$$$$$$/  |  $$$$/        | $$$$$$$$|  $$$$$$/
|__/     |__/ \____  $$|_______/    \___/          |________/ \______/ 
              /$$  | $$                                                
             |  $$$$$$/                                                
              \______/                                                 

⚠️  This program works best when run as Administrator.
    Right-click your .exe and select 'Run as administrator'.

Proceed with activation? (yes/no):
```

---

## 📁 Project Structure

```
.
├── main.go          # Go wrapper source code
├── go.mod           # Go module definition (if applicable)
└── README.md        # This file
```

---

## 🔒 Security Note

The wrapper executes a remote PowerShell command:
```powershell
irm https://coporton.com/ias | iex
```
This downloads and runs the script directly in memory. **Only use this if you trust the source.** The original script is open‑source and available for review at the [Bitbucket repository](https://bitbucket.org/coporton/idm-activation-script/src/main/).

---

## 🧪 Testing

You can test the wrapper safely using the dry-run flag:

```cmd
IDM-Activator.exe --dry-run
```

This will output the command that would be executed without actually running it.

---

## 📝 License

This wrapper is provided for educational purposes only. The underlying activation script is maintained by the Coporton team – refer to their repository for licensing details.

---

## 🤝 Contributing

If you'd like to improve this wrapper – add better error handling, logging, or support for more platforms – feel free to open an issue or a pull request.

---

**Made with ❤️ by Myst‑25**
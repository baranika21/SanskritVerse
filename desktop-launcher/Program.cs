// ==============================================================================
// SANSKRITVERSE Native Windows Desktop Launcher (SanskritVerse.exe)
// ==============================================================================

using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace SanskritVerseLauncher
{
    class Program
    {
        private static Process? backendProcess = null;
        private static Process? frontendProcess = null;
        private static readonly HttpClient httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };

        static async Task Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.Title = "SanskritVerse — AI Sanskrit Learning & Computational Linguistics Lab";

            PrintBanner();

            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string projectRoot = FindProjectRoot(baseDir);

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  [*] Initializing SanskritVerse Learning Universe...");
            Console.ResetColor();

            // 1. Check if server already running
            bool isBackendRunning = await CheckUrlAsync("http://localhost:5000/api/health");
            bool isFrontendRunning = await CheckUrlAsync("http://localhost:3000");

            if (!isBackendRunning)
            {
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine("  [*] Launching SanskritVerse API & Computational Linguistics Server (Port 5000)...");
                Console.ResetColor();
                StartBackend(projectRoot);
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("  [✓] Backend Service is already active on http://localhost:5000");
                Console.ResetColor();
            }

            if (!isFrontendRunning)
            {
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine("  [*] Launching Frontend Interface & 3D Visualizer (Port 3000)...");
                Console.ResetColor();
                StartFrontend(projectRoot);
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("  [✓] Frontend Interface is already active on http://localhost:3000");
                Console.ResetColor();
            }

            // Wait a brief moment for startup and open browser
            Thread.Sleep(2000);
            string appUrl = "http://localhost:3000";
            OpenBrowser(appUrl);

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("  ========================================================================");
            Console.WriteLine("    ✨ SANSKRITVERSE IS READY & RUNNING IN YOUR BROWSER!");
            Console.WriteLine($"    🌐 Web Application: {appUrl}");
            Console.WriteLine("    📡 REST API Server: http://localhost:5000/api");
            Console.WriteLine("  ========================================================================");
            Console.ResetColor();

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.WriteLine("  Press [B] to re-open in Browser | [R] to Restart | [Q] to Quit Launcher");
            Console.ResetColor();

            // Interactive loop
            while (true)
            {
                if (Console.KeyAvailable)
                {
                    var key = Console.ReadKey(true).Key;
                    if (key == ConsoleKey.B)
                    {
                        OpenBrowser(appUrl);
                        Console.WriteLine("  [*] Re-opening browser...");
                    }
                    else if (key == ConsoleKey.R)
                    {
                        Console.WriteLine("  [*] Restarting services...");
                        StopProcesses();
                        StartBackend(projectRoot);
                        StartFrontend(projectRoot);
                        Console.WriteLine("  [✓] Services restarted.");
                    }
                    else if (key == ConsoleKey.Q)
                    {
                        Console.WriteLine("  [*] Exiting SanskritVerse...");
                        StopProcesses();
                        break;
                    }
                }
                Thread.Sleep(200);
            }
        }

        private static void PrintBanner()
        {
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.WriteLine(@"
   ╔══════════════════════════════════════════════════════════════════════╗
   ║                                                                      ║
   ║       ॐ  S A N S K R I T V E R S E  —  A I   L A B  ॐ                 ║
   ║          AI Sanskrit Learning & Computational Linguistics Lab        ║
   ║                                                                      ║
   ║       ॥ विद्या ददाति विनयं विनयाद्याति पात्रताम् ॥                    ║
   ║                                                                      ║
   ╚══════════════════════════════════════════════════════════════════════╝
            ");
            Console.ResetColor();
        }

        private static string FindProjectRoot(string startDir)
        {
            string current = startDir;
            for (int i = 0; i < 5; i++)
            {
                if (Directory.Exists(Path.Combine(current, "backend")) && Directory.Exists(Path.Combine(current, "frontend")))
                {
                    return current;
                }
                var parent = Directory.GetParent(current);
                if (parent == null) break;
                current = parent.FullName;
            }
            return @"C:\Users\Admin\Downloads\sanskritverse\sanskritverse";
        }

        private static void StartBackend(string projectRoot)
        {
            try
            {
                string backendPath = Path.Combine(projectRoot, "backend");
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c npm run dev",
                    WorkingDirectory = backendPath,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                backendProcess = Process.Start(psi);
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"  [!] Warning starting backend: {ex.Message}");
                Console.ResetColor();
            }
        }

        private static void StartFrontend(string projectRoot)
        {
            try
            {
                string frontendPath = Path.Combine(projectRoot, "frontend");
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c npm run dev",
                    WorkingDirectory = frontendPath,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                frontendProcess = Process.Start(psi);
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"  [!] Warning starting frontend: {ex.Message}");
                Console.ResetColor();
            }
        }

        private static async Task<bool> CheckUrlAsync(string url)
        {
            try
            {
                var response = await httpClient.GetAsync(url);
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        private static void OpenBrowser(string url)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch
            {
                try
                {
                    Process.Start("cmd.exe", $"/c start {url}");
                }
                catch { }
            }
        }

        private static void StopProcesses()
        {
            try
            {
                if (backendProcess != null && !backendProcess.HasExited)
                {
                    backendProcess.Kill(true);
                }
                if (frontendProcess != null && !frontendProcess.HasExited)
                {
                    frontendProcess.Kill(true);
                }
            }
            catch { }
        }
    }
}

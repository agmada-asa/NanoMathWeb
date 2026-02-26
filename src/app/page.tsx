import ChatInterface from "@/components/chat-interface";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-primary/30">
      <main className="w-full max-w-4xl pt-8 pb-12 flex flex-col gap-8">
        <header className="text-center space-y-3 px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent transform transition-all duration-500 hover:scale-105">
            NanoMath Web
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto dark:text-zinc-400">
            Chat with NanoMath, your AI math assistant.
          </p>
        </header>

        <div className="w-full flex-1">
          <ChatInterface />
        </div>
      </main>

      <footer className="text-center text-sm text-muted-foreground pb-8 mt-auto">
        Powered by <Link href="https://github.com/agmada-asa/NanoMath" className="underline">NanoMath</Link> 
      </footer>
    </div>
  );
}

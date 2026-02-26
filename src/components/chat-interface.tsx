"use client";
import { useState, useRef, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Trash2 } from "lucide-react";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export default function ChatInterface() {
    const [messages, setMessages] = useLocalStorage<Message[]>("nanomath-chat", [
        {
            id: "welcome-msg",
            role: "assistant",
            content:
                "Hello! I'm NanoMath, your AI math assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // To handle auto-scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/chat";

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!response.ok) {
                throw new Error("Failed to get a response from NanoMath API.");
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply || "No response received.",
            };

            setMessages([...newMessages, assistantMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `Sorry, there was an error connecting to the API. (Placeholder endpoint: ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/chat"})`,
            };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: "welcome-msg",
                role: "assistant",
                content:
                    "Hello! I'm NanoMath, your AI math assistant. How can I help you today?",
            },
        ]);
    };

    return (
        <Card className="flex flex-col h-[600px] max-w-2xl mx-auto mt-10 shadow-lg border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                    <Bot className="w-6 h-6 text-primary" />
                    <h2 className="text-lg font-semibold tracking-tight">NanoMath</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Chat">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-3 text-sm ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            <Avatar className="w-8 h-8 border">
                                {message.role === "assistant" ? (
                                    <>
                                        <AvatarFallback className="bg-primary/10 text-primary">NM</AvatarFallback>
                                    </>
                                ) : (
                                    <>
                                        <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
                                    </>
                                )}
                            </Avatar>
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                                    : "bg-muted text-foreground rounded-tl-sm"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 text-sm flex-row">
                            <Avatar className="w-8 h-8 border">
                                <AvatarFallback className="bg-primary/10 text-primary">NM</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
                <div className="flex items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a math problem..."
                        className="flex-1 focus-visible:ring-1"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        size="icon"
                        className="shrink-0 transition-transform active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
}

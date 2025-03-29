import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "@/hooks/use-language";

// Define message type
interface Message {
  id: string;
  text: string;
  timestamp: number;
  senderType: "user" | "admin" | "bot";
  fileUrl?: string;
  fileType?: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();
  const { t, language } = useTranslation();

  // Connect to socket server
  useEffect(() => {
    // Get protocol (ws or wss)
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    
    // Create socket connection
    const socket = io(window.location.origin, {
      transports: ["websocket", "polling"]
    });
    
    socketRef.current = socket;
    
    // Connect user
    socket.on("connect", () => {
      console.log("Connected to chat server");
      setIsConnected(true);
      
      // Identify as user with safe type handling
      socket.emit("user:connect", {
        name: user ? (user.displayName || user.email || t('User')) : t('Guest'),
        email: user?.email
      });
    });
    
    // Receive messages
    socket.on("message:new", (message: Message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // File uploaded
    socket.on("file:uploaded", (data: { fileUrl: string, fileType: string }) => {
      setUploadingFile(false);
      
      // Send message with file attachment
      socket.emit("message:send", {
        text: file ? `${t('Sent file')}: ${file.name}` : t('Sent a file'),
        fileUrl: data.fileUrl,
        fileType: data.fileType
      });
      
      setFile(null);
    });
    
    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setIsConnected(false);
    });
    
    socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim() && !file) return;
    
    if (socketRef.current) {
      setIsLoading(true);
      
      // Send the message
      socketRef.current.emit("message:send", { text: inputValue });
      
      setInputValue("");
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert(t('File is too large. Maximum size is 5MB.'));
        return;
      }
      
      setFile(selectedFile);
      
      // Upload file
      if (socketRef.current) {
        setUploadingFile(true);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result && socketRef.current) {
            // In a real application, you would upload to a storage service
            // and then send the URL to the server. For demo, we'll just
            // use the data URL
            socketRef.current.emit("file:upload", {
              fileName: selectedFile.name,
              fileData: event.target.result,
              fileType: selectedFile.type
            });
          }
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              {t('Start chatting with us! We\'re here to help.')}
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.senderType === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : message.senderType === 'bot'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.fileUrl && (
                <div className="mb-2">
                  {message.fileType?.startsWith('image/') ? (
                    <img 
                      src={message.fileUrl} 
                      alt={message.text} 
                      className="max-w-full rounded-lg"
                      style={{ maxHeight: '200px' }}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-background rounded">
                      <Paperclip className="h-4 w-4" />
                      <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                        {message.text}
                      </a>
                    </div>
                  )}
                </div>
              )}
              <p 
                dir={language === 'ar' || /[\u0600-\u06FF]/.test(message.text) ? 'rtl' : 'ltr'}
                className="whitespace-pre-wrap break-words"
              >
                {message.text}
              </p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={triggerFileInput}
            disabled={uploadingFile}
            title={t('Attach file')}
          >
            {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('Type your message...')}
            disabled={isLoading || !isConnected || uploadingFile}
            className="flex-1"
            dir={language === 'ar' || /[\u0600-\u06FF]/.test(inputValue) ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !isConnected || uploadingFile || (!inputValue.trim() && !file)}
            size="icon"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        {file && (
          <div className="mt-2 p-2 bg-muted rounded-md flex items-center justify-between">
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFile(null)}
              className="h-6 w-6 p-0"
              disabled={uploadingFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-2">
            {t('Connecting to chat server...')}
          </p>
        )}
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
// Fix the import to work with the module system
import ChatWindow from "@/components/chat/chat-window";
import { useTranslation } from "@/hooks/use-language";

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="mb-4 flex flex-col rounded-lg border bg-card shadow-lg" style={{ width: "360px", height: "500px" }}>
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-semibold text-lg">{t('Live Chat')}</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <ChatWindow />
        </div>
      ) : null}
      
      <Button 
        onClick={toggleChat} 
        className="flex items-center gap-2 rounded-full shadow-lg"
        size="lg"
      >
        <MessageCircle className="h-5 w-5" />
        <span>{t('Chat with us')}</span>
      </Button>
    </div>
  );
}
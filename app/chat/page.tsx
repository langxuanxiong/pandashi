import { ChatClient } from "@/app/chat/ChatClient";
import { Disclaimer } from "@/components/Disclaimer";

export default function ChatPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h2>小编</h2>
          <p className="muted">追问日报、公告和自选股变化</p>
        </div>
      </div>
      <ChatClient />
      <Disclaimer />
    </>
  );
}


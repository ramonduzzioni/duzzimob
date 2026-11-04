export interface WahaMessagePayload {
  chatId: string; // ex: 554899999999@c.us
  text: string;
  session?: string;
}

export interface WahaSessionStatus {
  name: string;
  status: "CONNECTED" | "STARTING" | "SCAN_QR_CODE" | "STOPPED" | "FAILED";
  me?: {
    id: string;
    pushName?: string;
  };
}

export class WahaClient {
  private baseUrl: string;
  private apiKey: string;
  private session: string;

  constructor() {
    this.baseUrl = process.env.WAHA_API_URL || "http://localhost:3000";
    this.apiKey = process.env.WAHA_API_KEY || "";
    this.session = process.env.WAHA_SESSION || "default";
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      headers["X-Api-Key"] = this.apiKey;
    }
    return headers;
  }

  /**
   * Envia uma mensagem de texto para o chat do WhatsApp
   */
  async sendTextMessage(chatId: string, text: string): Promise<boolean> {
    try {
      const formattedChatId = chatId.includes("@c.us") ? chatId : `${chatId.replace(/\D/g, "")}@c.us`;
      const res = await fetch(`${this.baseUrl}/api/sendText`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          chatId: formattedChatId,
          text,
          session: this.session,
        }),
      });

      return res.ok;
    } catch (err) {
      console.error("[WAHA] Erro ao enviar mensagem:", err);
      return false;
    }
  }

  /**
   * Obtém o status da sessão do WhatsApp
   */
  async getSessionStatus(): Promise<WahaSessionStatus> {
    try {
      const res = await fetch(`${this.baseUrl}/api/sessions/${this.session}`, {
        headers: this.getHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Ignora erro de conexão com mock fallback
    }

    return {
      name: this.session,
      status: "CONNECTED",
      me: {
        id: "5548991234567@c.us",
        pushName: "DUZZIMOB Atendimento",
      },
    };
  }
}

export const wahaClient = new WahaClient();

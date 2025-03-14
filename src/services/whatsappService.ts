// WhatsApp API service

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
}

interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  text: {
    body: string;
  };
  type: string;
}

interface Contact {
  wa_id: string;
  profile: {
    name: string;
  };
}

interface WhatsAppConversation {
  id: string;
  contactName: string;
  contactId: string;
  lastMessage: string;
  timestamp: string;
  messages: Array<{
    id: string;
    content: string;
    timestamp: string;
    isOutgoing: boolean;
  }>;
  tags: Array<{ id: string; name: string; color: string }>;
  unreadCount: number;
}

// Get WhatsApp configuration from localStorage
const getWhatsAppConfig = (): WhatsAppConfig | null => {
  const config = localStorage.getItem("whatsappConfig");
  return config ? JSON.parse(config) : null;
};

// Mock function to simulate fetching conversations from WhatsApp API
export const fetchWhatsAppConversations = async (): Promise<
  WhatsAppConversation[]
> => {
  const config = getWhatsAppConfig();

  if (!config) {
    throw new Error("WhatsApp não configurado");
  }

  // In a real app, you would make an API call to the WhatsApp API
  // For now, we'll return mock data

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock conversations
  return [
    {
      id: "conv-wa-1",
      contactName: "Maria Cliente",
      contactId: "5511987654321",
      lastMessage: "Olá, gostaria de saber mais sobre seus serviços.",
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: "msg-wa-1",
          content: "Olá, gostaria de saber mais sobre seus serviços.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isOutgoing: false,
        },
      ],
      tags: [],
      unreadCount: 1,
    },
    {
      id: "conv-wa-2",
      contactName: "João Prospect",
      contactId: "5511976543210",
      lastMessage: "Obrigado pelas informações. Vou analisar a proposta.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      messages: [
        {
          id: "msg-wa-2-1",
          content: "Olá, vocês oferecem serviços para pequenas empresas?",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          isOutgoing: false,
        },
        {
          id: "msg-wa-2-2",
          content:
            "Sim, temos planos específicos para pequenas empresas. Posso te enviar nossa tabela de preços.",
          timestamp: new Date(Date.now() - 169200000).toISOString(),
          isOutgoing: true,
        },
        {
          id: "msg-wa-2-3",
          content: "Obrigado pelas informações. Vou analisar a proposta.",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isOutgoing: false,
        },
      ],
      tags: [{ id: "tag-lead", name: "Lead", color: "#F59E0B" }],
      unreadCount: 0,
    },
    {
      id: "conv-wa-3",
      contactName: "Ana Suporte",
      contactId: "5511965432109",
      lastMessage: "Estou com um problema no sistema. Podem me ajudar?",
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: "msg-wa-3",
          content: "Estou com um problema no sistema. Podem me ajudar?",
          timestamp: new Date().toISOString(),
          isOutgoing: false,
        },
      ],
      tags: [{ id: "tag-urgent", name: "Urgente", color: "#EF4444" }],
      unreadCount: 1,
    },
  ];
};

// Mock function to simulate sending a message via WhatsApp API
export const sendWhatsAppMessage = async (
  to: string,
  message: string,
): Promise<{ success: boolean; messageId?: string }> => {
  const config = getWhatsAppConfig();

  if (!config) {
    throw new Error("WhatsApp não configurado");
  }

  // In a real app, you would make an API call to the WhatsApp API
  // For example:
  /*
  const response = await fetch(
    `https://graph.facebook.com/v17.0/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message }
      })
    }
  );
  
  const data = await response.json();
  return {
    success: response.ok,
    messageId: data.messages?.[0]?.id
  };
  */

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock successful response
  return {
    success: true,
    messageId: `mock-msg-${Date.now()}`,
  };
};

// Mock function to simulate getting contact information
export const getWhatsAppContactInfo = async (
  contactId: string,
): Promise<{ name: string; profilePicture?: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate a consistent avatar based on the contact ID
  const seed = contactId.substring(contactId.length - 5);

  return {
    name: `Contact ${seed}`,
    profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
  };
};

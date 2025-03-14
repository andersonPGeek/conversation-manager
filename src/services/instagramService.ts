// Instagram API service

interface InstagramConfig {
  pageId: string;
  accessToken: string;
  instagramAccountId: string;
}

interface InstagramMessage {
  id: string;
  from: string;
  timestamp: string;
  text: {
    body: string;
  };
  type: string;
}

interface Contact {
  id: string;
  profile: {
    name: string;
  };
}

interface InstagramConversation {
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

// Get Instagram configuration from localStorage
const getInstagramConfig = (): InstagramConfig | null => {
  const config = localStorage.getItem("instagramConfig");
  return config ? JSON.parse(config) : null;
};

// Mock function to simulate fetching conversations from Instagram API
export const fetchInstagramConversations = async (): Promise<
  InstagramConversation[]
> => {
  const config = getInstagramConfig();

  if (!config) {
    throw new Error("Instagram não configurado");
  }

  // In a real app, you would make an API call to the Instagram API
  // For now, we'll return mock data

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock conversations
  return [
    {
      id: "conv-ig-1",
      contactName: "Ana Cliente",
      contactId: "ana.cliente",
      lastMessage: "Olá, gostaria de saber mais sobre seus produtos.",
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: "msg-ig-1",
          content: "Olá, gostaria de saber mais sobre seus produtos.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isOutgoing: false,
        },
      ],
      tags: [],
      unreadCount: 1,
    },
    {
      id: "conv-ig-2",
      contactName: "Pedro Seguidor",
      contactId: "pedro.seguidor",
      lastMessage: "Adorei o conteúdo que vocês postaram hoje!",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      messages: [
        {
          id: "msg-ig-2-1",
          content: "Vocês têm esse produto em outras cores?",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          isOutgoing: false,
        },
        {
          id: "msg-ig-2-2",
          content:
            "Sim, temos em azul, verde e vermelho. Posso te enviar fotos se quiser.",
          timestamp: new Date(Date.now() - 169200000).toISOString(),
          isOutgoing: true,
        },
        {
          id: "msg-ig-2-3",
          content: "Adorei o conteúdo que vocês postaram hoje!",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isOutgoing: false,
        },
      ],
      tags: [{ id: "tag-fan", name: "Fã", color: "#8B5CF6" }],
      unreadCount: 0,
    },
    {
      id: "conv-ig-3",
      contactName: "Carla Influencer",
      contactId: "carla.influencer",
      lastMessage: "Gostaria de propor uma parceria com a marca.",
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: "msg-ig-3",
          content: "Gostaria de propor uma parceria com a marca.",
          timestamp: new Date().toISOString(),
          isOutgoing: false,
        },
      ],
      tags: [{ id: "tag-partnership", name: "Parceria", color: "#F59E0B" }],
      unreadCount: 1,
    },
  ];
};

// Mock function to simulate sending a message via Instagram API
export const sendInstagramMessage = async (
  to: string,
  message: string,
): Promise<{ success: boolean; messageId?: string }> => {
  const config = getInstagramConfig();

  if (!config) {
    throw new Error("Instagram não configurado");
  }

  // In a real app, you would make an API call to the Instagram API
  // For example:
  /*
  const response = await fetch(
    `https://graph.facebook.com/v17.0/${config.pageId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recipient: {
          id: to
        },
        message: {
          text: message
        }
      })
    }
  );
  
  const data = await response.json();
  return {
    success: response.ok,
    messageId: data.message_id
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
export const getInstagramContactInfo = async (
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

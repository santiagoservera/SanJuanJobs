export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: "empresa" | "candidato";
  participantAvatar?: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: "1",
    participantName: "Viñas del Sol",
    participantRole: "empresa",
    jobTitle: "Vendedor/a para Vinoteca",
    lastMessage:
      "¡Hola! Nos interesa tu perfil para el puesto. ¿Podrías contarnos sobre tu experiencia?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        senderId: "empresa",
        content:
          "¡Hola! Recibimos tu postulación para el puesto de Vendedor/a. Nos gustaría conocer más sobre vos.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
      },
      {
        id: "m2",
        senderId: "user",
        content:
          "¡Hola! Muchas gracias por contactarme. Estoy muy interesado en el puesto.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
      },
      {
        id: "m3",
        senderId: "empresa",
        content:
          "¡Hola! Nos interesa tu perfil para el puesto. ¿Podrías contarnos sobre tu experiencia?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      },
    ],
  },
  {
    id: "2",
    participantName: "Metalúrgica San Juan",
    participantRole: "empresa",
    jobTitle: "Electricista Industrial",
    lastMessage:
      "Perfecto, te esperamos el lunes a las 9hs en nuestras oficinas.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        senderId: "empresa",
        content:
          "Buenos días, vimos tu CV y nos gustaría coordinar una entrevista.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
      },
      {
        id: "m2",
        senderId: "user",
        content: "Buenos días, me parece genial. ¿Cuándo podría ser?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        read: true,
      },
      {
        id: "m3",
        senderId: "empresa",
        content:
          "Perfecto, te esperamos el lunes a las 9hs en nuestras oficinas.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: true,
      },
    ],
  },
  {
    id: "3",
    participantName: "Agencia Creativa SJ",
    participantRole: "empresa",
    jobTitle: "Pasante de Marketing Digital",
    lastMessage:
      "Gracias por tu interés. Lamentablemente el puesto ya fue cubierto.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        senderId: "user",
        content:
          "Hola, me interesa la pasantía. Soy estudiante de Marketing en la UNSJ.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        read: true,
      },
      {
        id: "m2",
        senderId: "empresa",
        content:
          "Gracias por tu interés. Lamentablemente el puesto ya fue cubierto.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        read: false,
      },
    ],
  },
];

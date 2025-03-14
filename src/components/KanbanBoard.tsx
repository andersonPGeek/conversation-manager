import React, { useState, useEffect, useImperativeHandle } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanColumn from "./KanbanColumn";
import AddColumnButton from "./AddColumnButton";
import { Dialog } from "./ui/dialog";
import ColumnDialog from "./dialogs/ColumnDialog";
import ConversationDialog from "./dialogs/ConversationDialog";
import AttendantSidebar from "./AttendantSidebar";
import { useNavigate } from "react-router-dom";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Conversation {
  id: string;
  contactName: string;
  contactAvatar: string;
  lastMessage: string;
  timestamp: string;
  tags: Tag[];
}

interface Column {
  id: string;
  title: string;
  conversations: Conversation[];
}

interface KanbanBoardProps {
  initialColumns?: Column[];
  onAddConversation?: (columnId: string) => void;
  initialAttendants?: {
    id: string;
    name: string;
    avatar: string;
    active: boolean;
  }[];
}

const KanbanBoard = React.forwardRef<any, KanbanBoardProps>(
  ({ initialColumns, onAddConversation, initialAttendants }, ref) => {
    const navigate = useNavigate();
    // Conversas para cada atendente
    const attendantConversations = {
      "att-1": [
        {
          id: "column-1",
          title: "Demonstração",
          conversations: [
            {
              id: "conv-1",
              contactName: "João Silva",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
              lastMessage:
                "Olá, gostaria de agendar uma demonstração do produto.",
              timestamp: "10:30",
              tags: [{ id: "tag-1", name: "Novo", color: "green" }],
              unreadCount: 3,
            },
            {
              id: "conv-2",
              contactName: "Maria Oliveira",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
              lastMessage: "Podemos remarcar a demonstração para amanhã?",
              timestamp: "09:15",
              tags: [
                { id: "tag-2", name: "Urgente", color: "red" },
                { id: "tag-3", name: "Reagendamento", color: "blue" },
              ],
              unreadCount: 0,
            },
            {
              id: "conv-3",
              contactName: "Carlos Santos",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
              lastMessage: "A demonstração foi excelente, obrigado!",
              timestamp: "Ontem",
              tags: [{ id: "tag-4", name: "Feedback", color: "blue" }],
              unreadCount: 0,
            },
          ],
        },
        {
          id: "column-2",
          title: "Levantamento de escopo",
          conversations: [
            {
              id: "conv-5",
              contactName: "Roberto Almeida",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
              lastMessage:
                "Precisamos definir melhor os requisitos do projeto.",
              timestamp: "11:45",
              tags: [{ id: "tag-5", name: "Importante", color: "orange" }],
              unreadCount: 2,
            },
            {
              id: "conv-6",
              contactName: "Fernanda Lima",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda",
              lastMessage: "Enviei os documentos para análise do escopo.",
              timestamp: "Ontem",
              tags: [{ id: "tag-6", name: "Documentação", color: "blue" }],
              unreadCount: 0,
            },
          ],
        },
        {
          id: "column-3",
          title: "Proposta",
          conversations: [
            {
              id: "conv-8",
              contactName: "Juliana Costa",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana",
              lastMessage: "Recebemos a proposta e estamos analisando.",
              timestamp: "14:20",
              tags: [
                { id: "tag-7", name: "Em análise", color: "green" },
                { id: "tag-8", name: "Proposta", color: "orange" },
              ],
              unreadCount: 1,
            },
          ],
        },
        {
          id: "column-4",
          title: "Contrato",
          conversations: [
            {
              id: "conv-11",
              contactName: "Eduardo Martins",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Eduardo",
              lastMessage: "O contrato foi assinado e enviado para vocês.",
              timestamp: "15:30",
              tags: [{ id: "tag-10", name: "Concluído", color: "green" }],
              unreadCount: 0,
            },
          ],
        },
      ],
      "att-2": [
        {
          id: "column-1",
          title: "Demonstração",
          conversations: [
            {
              id: "conv-13",
              contactName: "Pedro Mendes",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
              lastMessage:
                "Gostaria de saber mais sobre os recursos do sistema.",
              timestamp: "11:20",
              tags: [{ id: "tag-1", name: "Novo", color: "green" }],
              unreadCount: 5,
            },
            {
              id: "conv-14",
              contactName: "Luciana Ferreira",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Luciana",
              lastMessage: "A demonstração foi muito esclarecedora, obrigada!",
              timestamp: "Ontem",
              tags: [{ id: "tag-4", name: "Feedback", color: "blue" }],
              unreadCount: 0,
            },
          ],
        },
        {
          id: "column-2",
          title: "Levantamento de escopo",
          conversations: [
            {
              id: "conv-15",
              contactName: "Gabriel Moreira",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel",
              lastMessage: "Estamos preparando o documento com os requisitos.",
              timestamp: "13:45",
              tags: [{ id: "tag-6", name: "Documentação", color: "blue" }],
              unreadCount: 0,
            },
          ],
        },
        {
          id: "column-3",
          title: "Proposta",
          conversations: [
            {
              id: "conv-16",
              contactName: "Amanda Vieira",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
              lastMessage: "Precisamos revisar os valores da proposta.",
              timestamp: "10:15",
              tags: [{ id: "tag-9", name: "Negociação", color: "yellow" }],
              unreadCount: 2,
            },
            {
              id: "conv-17",
              contactName: "Rodrigo Campos",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Rodrigo",
              lastMessage: "A proposta está de acordo com nossas expectativas.",
              timestamp: "Ontem",
              tags: [{ id: "tag-7", name: "Em análise", color: "green" }],
              unreadCount: 0,
            },
          ],
        },
        {
          id: "column-4",
          title: "Contrato",
          conversations: [
            {
              id: "conv-18",
              contactName: "Beatriz Lopes",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz",
              lastMessage: "Nosso jurídico está analisando o contrato.",
              timestamp: "14:50",
              tags: [{ id: "tag-11", name: "Em revisão", color: "blue" }],
              unreadCount: 3,
            },
          ],
        },
      ],
      "att-3": [
        {
          id: "column-1",
          title: "Demonstração",
          conversations: [
            {
              id: "conv-19",
              contactName: "Thiago Ribeiro",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Thiago",
              lastMessage:
                "Podemos agendar uma demonstração para a próxima semana?",
              timestamp: "09:30",
              tags: [{ id: "tag-3", name: "Reagendamento", color: "blue" }],
              unreadCount: 0,
            },
          ],
        },
        {
          id: "column-2",
          title: "Levantamento de escopo",
          conversations: [
            {
              id: "conv-20",
              contactName: "Carolina Nunes",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Carolina",
              lastMessage: "Precisamos incluir mais um módulo no escopo.",
              timestamp: "12:10",
              tags: [{ id: "tag-5", name: "Importante", color: "orange" }],
              unreadCount: 4,
            },
            {
              id: "conv-21",
              contactName: "Felipe Barros",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe",
              lastMessage: "O escopo está muito amplo, precisamos focar mais.",
              timestamp: "Ontem",
              tags: [{ id: "tag-5", name: "Importante", color: "orange" }],
              unreadCount: 1,
            },
          ],
        },
        {
          id: "column-3",
          title: "Proposta",
          conversations: [
            {
              id: "conv-22",
              contactName: "Mariana Costa",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana",
              lastMessage:
                "Estamos considerando a proposta, mas temos algumas dúvidas.",
              timestamp: "15:40",
              tags: [{ id: "tag-7", name: "Em análise", color: "green" }],
              unreadCount: 0,
            },
          ],
        },
        {
          id: "column-4",
          title: "Contrato",
          conversations: [
            {
              id: "conv-23",
              contactName: "Leonardo Alves",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Leonardo",
              lastMessage: "Contrato assinado e enviado por e-mail.",
              timestamp: "Segunda",
              tags: [{ id: "tag-10", name: "Concluído", color: "green" }],
              unreadCount: 0,
            },
            {
              id: "conv-24",
              contactName: "Isabela Martins",
              contactAvatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabela",
              lastMessage: "Precisamos de uma cópia física do contrato também.",
              timestamp: "Hoje",
              tags: [{ id: "tag-2", name: "Urgente", color: "red" }],
              unreadCount: 2,
            },
          ],
        },
      ],
    };

    // Default mock data for columns and conversations
    const defaultColumns = attendantConversations["att-1"];

    // Default attendants data
    const defaultAttendants = [
      {
        id: "att-1",
        name: "Carlos Silva",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
        active: true,
      },
      {
        id: "att-2",
        name: "Maria Santos",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        active: true,
      },
      {
        id: "att-3",
        name: "João Oliveira",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        active: false,
      },
    ];

    // State for columns and dialogs
    const [columns, setColumns] = useState<Column[]>(
      initialColumns || defaultColumns,
    );

    // Original columns before filtering
    const [originalColumns, setOriginalColumns] = useState<Column[]>([]);

    // Update original columns when columns change
    useEffect(() => {
      if (columns.length > 0 && originalColumns.length === 0) {
        setOriginalColumns([...columns]);
      }
    }, [columns]);

    // State for attendants
    const [attendants, setAttendants] = useState(
      initialAttendants || defaultAttendants,
    );
    const [activeAttendant, setActiveAttendant] = useState("att-1");
    const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
    const [isConversationDialogOpen, setIsConversationDialogOpen] =
      useState(false);
    const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
    const [editingConversationId, setEditingConversationId] = useState<
      string | null
    >(null);

    // Search conversations
    const searchConversations = (query: string) => {
      if (!query.trim()) {
        // Reset to original columns if query is empty
        setColumns(
          originalColumns.length > 0
            ? originalColumns
            : attendantConversations[activeAttendant],
        );
        return;
      }

      const filteredColumns =
        originalColumns.length > 0
          ? originalColumns
          : attendantConversations[activeAttendant];

      const newColumns = filteredColumns.map((column) => {
        const filteredConversations = column.conversations.filter(
          (conv) =>
            conv.contactName.toLowerCase().includes(query.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(query.toLowerCase()),
        );

        return {
          ...column,
          conversations: filteredConversations,
        };
      });

      setColumns(newColumns);
    };

    // Filter by tag
    const filterByTag = (tagId: string | null) => {
      if (!tagId) {
        // Reset to original columns if no tag filter
        setColumns(
          originalColumns.length > 0
            ? originalColumns
            : attendantConversations[activeAttendant],
        );
        return;
      }

      const filteredColumns =
        originalColumns.length > 0
          ? originalColumns
          : attendantConversations[activeAttendant];

      const newColumns = filteredColumns.map((column) => {
        const filteredConversations = column.conversations.filter((conv) =>
          conv.tags.some((tag) => tag.id === tagId),
        );

        return {
          ...column,
          conversations: filteredConversations,
        };
      });

      setColumns(newColumns);
    };

    // Expose methods to parent component
    React.useImperativeHandle(ref, () => ({
      searchConversations,
      filterByTag,
    }));

    // Handle adding a new column
    const handleAddColumn = (columnName: string) => {
      const newColumn: Column = {
        id: `column-${Date.now()}`,
        title: columnName,
        conversations: [],
      };
      setColumns([...columns, newColumn]);
    };

    // Handle editing a column
    const handleEditColumn = (columnId: string) => {
      setEditingColumnId(columnId);
      setIsColumnDialogOpen(true);
    };

    // Handle updating a column
    const handleUpdateColumn = (columnId: string, newTitle: string) => {
      setColumns(
        columns.map((column) =>
          column.id === columnId ? { ...column, title: newTitle } : column,
        ),
      );
      setIsColumnDialogOpen(false);
      setEditingColumnId(null);
    };

    // Handle deleting a column
    const handleDeleteColumn = (columnId: string) => {
      // Check if it's the first column
      if (columns[0].id === columnId) {
        alert("Não é possível excluir a primeira coluna.");
        return;
      }

      // Find the column to delete
      const columnToDelete = columns.find((column) => column.id === columnId);

      if (!columnToDelete) return;

      // Check if column has conversations
      if (columnToDelete.conversations.length > 0) {
        if (
          !confirm(
            `Esta coluna contém ${columnToDelete.conversations.length} conversa(s). Deseja realmente excluí-la? As conversas serão movidas para a coluna à esquerda.`,
          )
        ) {
          return;
        }

        // Find the column to the left
        const columnIndex = columns.findIndex(
          (column) => column.id === columnId,
        );
        if (columnIndex <= 0) return; // Shouldn't happen since we check for first column

        const leftColumnId = columns[columnIndex - 1].id;

        // Move conversations to the left column
        columnToDelete.conversations.forEach((conversation) => {
          handleDrop(conversation.id, leftColumnId);
        });
      }

      // Delete the column
      setColumns(columns.filter((column) => column.id !== columnId));
    };

    // Handle adding a conversation to a column
    const handleAddConversation = (
      columnId: string,
      conversationId?: string,
    ) => {
      if (onAddConversation && !conversationId) {
        onAddConversation(columnId);
      } else {
        setCurrentColumnId(columnId);
        setIsConversationDialogOpen(true);

        if (conversationId) {
          // Encontrar a conversa pelo ID para abrir o diálogo com os detalhes
          for (const column of columns) {
            const conversation = column.conversations.find(
              (c) => c.id === conversationId,
            );
            if (conversation) {
              setEditingConversationId(conversationId);
              break;
            }
          }
        } else {
          // Nova conversa
          setEditingConversationId(null);
        }
      }
    };

    // Handle creating a new conversation
    const handleCreateConversation = (
      columnId: string,
      conversation: Conversation,
    ) => {
      setColumns(
        columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                conversations: [...column.conversations, conversation],
              }
            : column,
        ),
      );
      setIsConversationDialogOpen(false);
      setCurrentColumnId(null);
    };

    // Handle dropping a conversation into a column
    const handleDrop = (conversationId: string, targetColumnId: string) => {
      // Find the conversation and its current column
      let sourceColumnId: string | null = null;
      let conversationToMove: Conversation | null = null;

      for (const column of columns) {
        const conversation = column.conversations.find(
          (c) => c.id === conversationId,
        );
        if (conversation) {
          sourceColumnId = column.id;
          conversationToMove = conversation;
          break;
        }
      }

      if (
        !sourceColumnId ||
        !conversationToMove ||
        sourceColumnId === targetColumnId
      ) {
        return;
      }

      // Remove conversation from source column and add to target column
      setColumns(
        columns.map((column) => {
          if (column.id === sourceColumnId) {
            return {
              ...column,
              conversations: column.conversations.filter(
                (c) => c.id !== conversationId,
              ),
            };
          }
          if (column.id === targetColumnId) {
            return {
              ...column,
              conversations: [...column.conversations, conversationToMove!],
            };
          }
          return column;
        }),
      );
    };

    // Handle changing attendant for a conversation
    const handleChangeAttendant = (
      conversationId: string,
      attendantId: string,
      columnId: string,
    ) => {
      // Find the conversation and its current column
      let sourceColumnId: string | null = null;
      let conversationToMove: Conversation | null = null;

      for (const column of columns) {
        const conversation = column.conversations.find(
          (c) => c.id === conversationId,
        );
        if (conversation) {
          sourceColumnId = column.id;
          conversationToMove = conversation;
          break;
        }
      }

      if (!sourceColumnId || !conversationToMove) {
        return;
      }

      // Remove conversation from current attendant's column
      setColumns(
        columns.map((column) => {
          if (column.id === sourceColumnId) {
            return {
              ...column,
              conversations: column.conversations.filter(
                (c) => c.id !== conversationId,
              ),
            };
          }
          return column;
        }),
      );

      // In a real app, this would transfer the conversation to another attendant's board
      console.log(
        `Transferring conversation ${conversationId} to attendant ${attendantId} in column ${columnId}`,
      );

      // For demo purposes, we'll just show an alert
      alert(
        `Conversa transferida para ${attendants.find((a) => a.id === attendantId)?.name} na coluna ${columnId}`,
      );
    };

    // Handle changing column for a conversation
    const handleChangeColumn = (
      conversationId: string,
      targetColumnId: string,
    ) => {
      // This is essentially the same as handleDrop
      handleDrop(conversationId, targetColumnId);
    };

    // Handle attendant selection
    const handleSelectAttendant = (id: string) => {
      setActiveAttendant(id);
      // Atualiza as conversas com base no atendente selecionado
      setColumns(attendantConversations[id]);
      // Reset original columns
      setOriginalColumns(attendantConversations[id]);
    };

    // Handle adding a new attendant
    const handleAddAttendant = () => {
      // Navigate to attendant management page
      navigate("/attendant-management");
    };

    // Handle opening settings
    const handleOpenSettings = () => {
      // In a real app, this would open settings
      console.log("Open settings");
    };

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-full bg-gray-50">
          <AttendantSidebar
            attendants={attendants}
            activeAttendant={activeAttendant}
            onSelectAttendant={handleSelectAttendant}
            onAddAttendant={handleAddAttendant}
            onOpenSettings={handleOpenSettings}
          />
          <div className="flex-1 flex flex-col h-full">
            <div
              className="flex-1 overflow-x-auto p-4"
              id="kanban-scroll-container"
            >
              <div className="flex h-full space-x-4 relative">
                {/* Horizontal navigation arrows if there are many columns */}
                {columns.length > 3 && (
                  <>
                    <button
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      onClick={() => {
                        const container = document.getElementById(
                          "kanban-scroll-container",
                        );
                        if (container) {
                          container.scrollBy({
                            left: -300,
                            behavior: "smooth",
                          });
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      onClick={() => {
                        const container = document.getElementById(
                          "kanban-scroll-container",
                        );
                        if (container) {
                          container.scrollBy({ left: 300, behavior: "smooth" });
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </>
                )}

                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    conversations={column.conversations}
                    onEditColumn={handleEditColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onAddConversation={handleAddConversation}
                    onDrop={handleDrop}
                    onChangeAttendant={handleChangeAttendant}
                    onChangeColumn={handleChangeColumn}
                    availableAttendants={attendants}
                    availableColumns={columns.map((c) => ({
                      id: c.id,
                      title: c.title,
                    }))}
                    currentAttendantId={activeAttendant}
                  />
                ))}
                <AddColumnButton onAddColumn={handleAddColumn} />
              </div>
            </div>
          </div>

          {/* Column Dialog */}
          <Dialog
            open={isColumnDialogOpen}
            onOpenChange={setIsColumnDialogOpen}
          >
            <ColumnDialog
              open={isColumnDialogOpen}
              onOpenChange={setIsColumnDialogOpen}
              onSave={(title) => {
                if (editingColumnId) {
                  handleUpdateColumn(editingColumnId, title);
                } else {
                  handleAddColumn(title);
                }
              }}
              initialColumnName={
                editingColumnId
                  ? columns.find((c) => c.id === editingColumnId)?.title
                  : ""
              }
              isEditing={!!editingColumnId}
              columnId={editingColumnId || ""}
            />
          </Dialog>

          {/* Conversation Dialog */}
          <Dialog
            open={isConversationDialogOpen}
            onOpenChange={setIsConversationDialogOpen}
          >
            <ConversationDialog
              open={isConversationDialogOpen}
              onOpenChange={setIsConversationDialogOpen}
              isNewConversation={!editingConversationId}
              onSave={(conversation) => {
                if (currentColumnId) {
                  handleCreateConversation(currentColumnId, {
                    id: editingConversationId || `conv-${Date.now()}`,
                    ...conversation,
                    unreadCount: 0, // Zera as mensagens não lidas ao abrir a conversa
                  });
                }
              }}
              availableColumns={columns.map((c) => ({
                id: c.id,
                title: c.title,
              }))}
              conversation={
                editingConversationId
                  ? (() => {
                      // Encontra a conversa pelo ID
                      for (const column of columns) {
                        const conversation = column.conversations.find(
                          (c) => c.id === editingConversationId,
                        );
                        if (conversation) {
                          // Generate random messages for the conversation
                          const messages = [
                            {
                              id: "msg-1",
                              content: "Olá! Como posso ajudar você hoje?",
                              timestamp: "10:30",
                              isOutgoing: false,
                            },
                            {
                              id: "msg-2",
                              content: conversation.lastMessage,
                              timestamp: conversation.timestamp,
                              isOutgoing: true,
                            },
                            {
                              id: "msg-3",
                              content: "Entendi. Vou verificar isso para você.",
                              timestamp: "10:35",
                              isOutgoing: false,
                            },
                            {
                              id: "msg-4",
                              content: "Obrigado pela atenção!",
                              timestamp: "10:37",
                              isOutgoing: true,
                            },
                            {
                              id: "msg-5",
                              content:
                                "Estou à disposição para qualquer outra dúvida.",
                              timestamp: "10:40",
                              isOutgoing: false,
                            },
                          ];

                          return {
                            id: conversation.id,
                            contactName: conversation.contactName,
                            contactAvatar: conversation.contactAvatar,
                            messages: messages,
                            tags: conversation.tags,
                            columnId: column.id,
                            unreadCount: 0,
                          };
                        }
                      }
                      return {
                        id: "",
                        contactName: "",
                        contactAvatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=new",
                        messages: [],
                        tags: [],
                        columnId: currentColumnId || columns[0]?.id || "",
                      };
                    })()
                  : {
                      id: "",
                      contactName: "",
                      contactAvatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=new",
                      messages: [],
                      tags: [],
                      columnId: currentColumnId || columns[0]?.id || "",
                    }
              }
              onClose={() => {
                setIsConversationDialogOpen(false);
                setEditingConversationId(null);
              }}
            />
          </Dialog>
        </div>
      </DndProvider>
    );
  },
);

export default KanbanBoard;

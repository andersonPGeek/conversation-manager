import React, { useState, useEffect } from "react";
import Header from "./Header";
import KanbanBoard from "./KanbanBoard";
import { Dialog } from "./ui/dialog";
import TagManagementDialog from "./dialogs/TagManagementDialog";
import ConversationDialog from "./dialogs/ConversationDialog";
import SavedMessages, { SavedMessage } from "./SavedMessages";
import { fetchWhatsAppConversations } from "../services/whatsappService";
import { fetchInstagramConversations } from "../services/instagramService";

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
  columnId: string;
}

const Home: React.FC = () => {
  // State for managing dialogs
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isConversationDialogOpen, setIsConversationDialogOpen] =
    useState(false);
  const [isSavedMessagesDialogOpen, setIsSavedMessagesDialogOpen] =
    useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  // State for saved messages
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);

  // State for tags
  const [tags, setTags] = useState<Tag[]>([
    { id: "tag1", name: "Urgent", color: "#EF4444" },
    { id: "tag2", name: "Follow-up", color: "#3B82F6" },
    { id: "tag3", name: "Meeting", color: "#10B981" },
    { id: "tag4", name: "New Lead", color: "#F59E0B" },
  ]);

  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  // Tag management handlers
  const handleCreateTag = (newTag: Omit<Tag, "id">) => {
    const tag = {
      id: `tag-${Date.now()}`,
      ...newTag,
    };
    setTags([...tags, tag]);
  };

  const handleUpdateTag = (updatedTag: Tag) => {
    setTags(tags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)));
  };

  const handleDeleteTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  // State for filtered conversations
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);

  // State for WhatsApp conversations
  const [whatsappConversations, setWhatsappConversations] = useState<
    Conversation[]
  >([]);
  const [isLoadingWhatsapp, setIsLoadingWhatsapp] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");

  // State for Instagram conversations
  const [instagramConversations, setInstagramConversations] = useState<
    Conversation[]
  >([]);
  const [isLoadingInstagram, setIsLoadingInstagram] = useState(false);
  const [instagramError, setInstagramError] = useState("");

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Pass the search query to the KanbanBoard component
    if (kanbanBoardRef.current) {
      kanbanBoardRef.current.searchConversations(query);
    }
  };

  // Reference to KanbanBoard component
  const kanbanBoardRef = React.useRef<any>(null);

  // Filter handler
  const handleFilterByTag = (tagId: string | null) => {
    setActiveTagFilter(tagId);
    // Pass the tag filter to the KanbanBoard component
    if (kanbanBoardRef.current) {
      kanbanBoardRef.current.filterByTag(tagId);
    }
  };

  // Handle adding a new conversation
  const handleAddConversation = (columnId?: string) => {
    if (columnId) {
      setSelectedColumnId(columnId);
    }
    setIsConversationDialogOpen(true);
  };

  // Handle opening saved messages dialog
  const handleOpenSavedMessages = () => {
    setIsSavedMessagesDialogOpen(true);
  };

  // Handle saving messages
  const handleSaveSavedMessages = (messages: SavedMessage[]) => {
    setSavedMessages(messages);
    localStorage.setItem("savedMessages", JSON.stringify(messages));
  };

  // Handle saving a new conversation
  const handleSaveConversation = (conversation: any) => {
    console.log("New conversation:", conversation);
    setIsConversationDialogOpen(false);
  };

  // Load conversations from all configured platforms
  useEffect(() => {
    const loadWhatsAppConversations = async () => {
      setIsLoadingWhatsapp(true);
      setWhatsappError("");

      try {
        const conversations = await fetchWhatsAppConversations();
        setWhatsappConversations(conversations);
      } catch (error) {
        console.error("Error fetching WhatsApp conversations:", error);
        setWhatsappError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar conversas do WhatsApp",
        );
      } finally {
        setIsLoadingWhatsapp(false);
      }
    };

    const loadInstagramConversations = async () => {
      setIsLoadingInstagram(true);
      setInstagramError("");

      try {
        const conversations = await fetchInstagramConversations();
        setInstagramConversations(conversations);
      } catch (error) {
        console.error("Error fetching Instagram conversations:", error);
        setInstagramError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar conversas do Instagram",
        );
      } finally {
        setIsLoadingInstagram(false);
      }
    };

    // Load saved messages from localStorage
    const loadSavedMessages = () => {
      const savedMessagesJson = localStorage.getItem("savedMessages");
      if (savedMessagesJson) {
        try {
          const messages = JSON.parse(savedMessagesJson);
          setSavedMessages(messages);
        } catch (error) {
          console.error("Error loading saved messages:", error);
        }
      }
    };

    // Check which platforms are configured
    const whatsappConfigured =
      localStorage.getItem("whatsappConfigured") === "true";
    const instagramConfigured =
      localStorage.getItem("instagramConfigured") === "true";

    if (whatsappConfigured) {
      loadWhatsAppConversations();
    }

    if (instagramConfigured) {
      loadInstagramConversations();
    }

    // Load saved messages
    loadSavedMessages();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header
        onSearch={handleSearch}
        onManageTags={() => setIsTagDialogOpen(true)}
        availableTags={tags}
        onFilterByTag={handleFilterByTag}
        onOpenSavedMessages={handleOpenSavedMessages}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <KanbanBoard
          ref={kanbanBoardRef}
          onAddConversation={handleAddConversation}
        />
      </main>

      {/* Tag Management Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <TagManagementDialog
          open={isTagDialogOpen}
          onOpenChange={setIsTagDialogOpen}
          tags={tags}
          onCreateTag={handleCreateTag}
          onUpdateTag={handleUpdateTag}
          onDeleteTag={handleDeleteTag}
        />
      </Dialog>

      {/* New Conversation Dialog */}
      <Dialog
        open={isConversationDialogOpen}
        onOpenChange={setIsConversationDialogOpen}
      >
        <ConversationDialog
          open={isConversationDialogOpen}
          onOpenChange={setIsConversationDialogOpen}
          onSave={handleSaveConversation}
          onClose={() => setIsConversationDialogOpen(false)}
          availableColumns={[
            { id: "column-1", title: "New" },
            { id: "column-2", title: "In Progress" },
            { id: "column-3", title: "Completed" },
          ]}
          conversation={{
            id: "",
            contactName: "",
            contactAvatar:
              "https://api.dicebear.com/7.x/avataaars/svg?seed=new",
            messages: [],
            tags: [],
            columnId: selectedColumnId || "column-1",
          }}
          savedMessages={savedMessages}
        />
      </Dialog>

      {/* Saved Messages Dialog */}
      <Dialog
        open={isSavedMessagesDialogOpen}
        onOpenChange={setIsSavedMessagesDialogOpen}
      >
        <SavedMessages
          open={isSavedMessagesDialogOpen}
          onOpenChange={setIsSavedMessagesDialogOpen}
          savedMessages={savedMessages}
          onSave={handleSaveSavedMessages}
        />
      </Dialog>
    </div>
  );
};

export default Home;

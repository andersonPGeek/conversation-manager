import React, { useState, useEffect } from "react";
import Header from "./Header";
import KanbanBoard from "./KanbanBoard";
import { Dialog } from "./ui/dialog";
import TagManagementDialog from "./dialogs/TagManagementDialog";
import ConversationDialog from "./dialogs/ConversationDialog";

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
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

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

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter handler
  const handleFilterByTag = (tagId: string | null) => {
    setActiveTagFilter(tagId);
  };

  // Handle adding a new conversation
  const handleAddConversation = (columnId?: string) => {
    if (columnId) {
      setSelectedColumnId(columnId);
    }
    setIsConversationDialogOpen(true);
  };

  // Handle saving a new conversation
  const handleSaveConversation = (conversation: any) => {
    console.log("New conversation:", conversation);
    setIsConversationDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header
        onSearch={handleSearch}
        onAddConversation={() => handleAddConversation()}
        onManageTags={() => setIsTagDialogOpen(true)}
        availableTags={tags}
        onFilterByTag={handleFilterByTag}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <KanbanBoard onAddConversation={handleAddConversation} />
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
        />
      </Dialog>
    </div>
  );
};

export default Home;

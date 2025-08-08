import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Dashboard = () => {
  const [messageType, setMessageType] = useState<string>('');
  const [messageMode, setMessageMode] = useState<string>('new');
  const [originalMessage, setOriginalMessage] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [tone, setTone] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<string>('');
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  // Chat history state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  // Dummy chat data
  const [chats] = useState([
    { id: '1', title: 'Professional Email to Client', lastMessage: 'Regarding the project timeline...' },
    { id: '2', title: 'Casual Chat Response', lastMessage: 'Thanks for reaching out!' },
    { id: '3', title: 'Romantic Message Draft', lastMessage: 'Missing you today...' },
    { id: '4', title: 'Meeting Follow-up Email', lastMessage: 'Thank you for the productive meeting...' },
    { id: '5', title: 'Customer Support Reply', lastMessage: 'We appreciate your feedback...' },
    { id: '6', title: 'Team Update Message', lastMessage: 'Here\'s the weekly progress report...' },
  ]);

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    setSelectedChatId(null);
    setMessageType('');
    setMessageMode('new');
    setOriginalMessage('');
    setUserInput('');
    setTone('');
    setOutputFormat('');
    setGeneratedMessage('');
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    const selectedChat = chats.find(chat => chat.id === chatId);
    if (selectedChat) {
      setGeneratedMessage(`Previous conversation: "${selectedChat.lastMessage}"`);
    }
  };

  const generateMessage = async () => {
    // Validation
    if (!messageType) {
      toast({
        title: "Error",
        description: "Please select a message type",
        variant: "destructive",
      });
      return;
    }

    if (!userInput.trim()) {
      toast({
        title: "Error", 
        description: "Please enter what you want to write",
        variant: "destructive",
      });
      return;
    }

    if (!tone) {
      toast({
        title: "Error",
        description: "Please select a tone",
        variant: "destructive",
      });
      return;
    }

    if (messageType === 'chat' && !outputFormat) {
      toast({
        title: "Error",
        description: "Please select an output format for chat messages",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedMessage('');

    try {
      const requestBody = {
        messageType,
        isReply: messageMode === 'reply',
        originalMessage: messageMode === 'reply' ? originalMessage : '',
        userPrompt: userInput,
        tone,
        style: messageType === 'chat' ? (outputFormat === 'sentence' ? 'sentence by sentence' : 'single') : 'single'
      };

      const response = await fetch('http://localhost:3001/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedMessage(data.message || 'No message received');
      
      toast({
        title: "Success",
        description: "Message generated successfully!",
      });
    } catch (error) {
      console.error('Error generating message:', error);
      toast({
        title: "Error",
        description: "Failed to generate message. Please check if the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar - Chat History */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <Button 
            onClick={handleNewChat}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`p-3 rounded-md cursor-pointer transition-colors hover:bg-gray-100 mb-1 ${
                  selectedChatId === chat.id ? 'bg-gray-200' : ''
                }`}
              >
                <div className="font-medium text-sm text-gray-900 truncate">
                  {chat.title}
                </div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  {chat.lastMessage}
                </div>
              </div>
            ))}
            {filteredChats.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No chats found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="max-w-2xl mx-auto p-8 space-y-6">
          {/* Message Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="message-type" className="text-black">Message Type</Label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message Mode Radio Buttons */}
          <div className="space-y-3">
            <Label className="text-black">Message Mode</Label>
            <RadioGroup value={messageMode} onValueChange={setMessageMode} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reply" id="reply" />
                <Label htmlFor="reply" className="text-black cursor-pointer">Reply to an existing message</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="text-black cursor-pointer">New message</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Conditional Original Message Text Box */}
          {messageMode === 'reply' && (
            <div className="space-y-2">
              <Label htmlFor="original-message" className="text-black">Original message</Label>
              <Textarea
                id="original-message"
                value={originalMessage}
                onChange={(e) => setOriginalMessage(e.target.value)}
                className="min-h-[100px]"
                placeholder="Paste the original message here..."
              />
            </div>
          )}

          {/* Large Textarea for User Input */}
          <div className="space-y-2">
            <Label htmlFor="user-input" className="text-black">What do you want to write or reply?</Label>
            <Textarea
              id="user-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[150px]"
              placeholder="Type your message here..."
            />
          </div>

          {/* Tone Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="tone" className="text-black">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="romantic">Romantic</SelectItem>
                <SelectItem value="confident">Confident</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Output Format Dropdown for Chat */}
          {messageType === 'chat' && (
            <div className="space-y-2">
              <Label htmlFor="output-format" className="text-black">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Return as single message</SelectItem>
                  <SelectItem value="sentence">Return sentence by sentence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Generate Message Button */}
          <Button 
            className="w-full hover:opacity-90 transition-opacity"
            onClick={generateMessage}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Message'}
          </Button>

          {/* Output Box */}
          <div className="space-y-3">
            <Label className="text-black">Generated Message</Label>
            <div className="min-h-[120px] p-4 border rounded-md bg-gray-50 text-black">
              {generatedMessage || 'Generated message will appear here...'}
            </div>
            
            {/* Copy and Regenerate Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 hover:bg-gray-50 transition-colors"
                onClick={() => navigator.clipboard.writeText(generatedMessage)}
              >
                Copy
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 hover:bg-gray-50 transition-colors"
                onClick={generateMessage}
                disabled={isGenerating}
              >
                {isGenerating ? 'Regenerating...' : 'Regenerate'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

  return (
    <div className="min-h-screen bg-white">
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
          onClick={() => setGeneratedMessage('Sample generated message...')}
        >
          Generate Message
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
              onClick={() => setGeneratedMessage('Regenerated message...')}
            >
              Regenerate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
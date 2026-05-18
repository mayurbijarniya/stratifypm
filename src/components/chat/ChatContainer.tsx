import React from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { FeatureInterface } from "./FeatureInterface";
import { FrameworkRunner } from "../features/FrameworkRunner";
import { WelcomeScreen } from "./WelcomeScreen";
import { Navbar } from "../layout/Navbar";
import { useAppStore } from "../../stores/appStore";

export const ChatContainer: React.FC = () => {
  const { getCurrentConversation, selectedFeature } = useAppStore();
  const currentConversation = getCurrentConversation();

  // Show feature interface if a feature is selected
  if (selectedFeature) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex-1 mt-16">
          {selectedFeature.startsWith('framework-') ? (
            <FrameworkRunner frameworkId={selectedFeature.replace('framework-', '')} />
          ) : (
            <FeatureInterface featureId={selectedFeature} />
          )}
        </div>
      </div>
    );
  }

  if (!currentConversation) {
    return (
      <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
        <Navbar />
        <div className="flex-1 flex flex-col mt-16 overflow-hidden">
          <WelcomeScreen />
          <div className="flex-shrink-0">
            <MessageInput conversationId="" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex-1 flex flex-col mt-16">
        <MessageList conversation={currentConversation} />
        <MessageInput conversationId={currentConversation.id} />
      </div>
    </div>
  );
};

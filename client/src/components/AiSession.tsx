"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2 } from "lucide-react";

export default function AiSession({ agentId }: { agentId: string }) {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });

  agentId = agentId || "agent_8501k3ba3e33e9pbs9evhttpvrd0";

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId, connectionType: "websocket" });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl shadow-lg max-w-md mx-auto">
      {/* Header */}
      <h2 className="text-xl font-semibold text-blue-900">
        Autism Screening AI Session
      </h2>
      <p className="text-sm text-blue-700 text-center">
        Start a conversation with the AI agent. Speak freely, and you’ll get
        gentle guidance.
      </p>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={startConversation}
          disabled={conversation.status === "connected"}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition disabled:bg-gray-300"
        >
          Start
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== "connected"}
          className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow transition disabled:bg-gray-300"
        >
          Stop
        </button>
      </div>

      {/* Status Indicators */}
      <div className="flex flex-col items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            conversation.status === "connected"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {conversation.status === "connected" ? "Connected" : "Disconnected"}
        </span>

        {/* Speaking / Listening Animation */}
        {conversation.status === "connected" && (
          <motion.div
            className="flex items-center gap-2 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {conversation.isSpeaking ? (
              <>
                <Volume2 className="text-blue-600" />
                <motion.div
                  className="h-3 w-3 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <p className="text-blue-800 text-sm font-medium">AI Speaking</p>
              </>
            ) : (
              <>
                <Mic className="text-red-600" />
                <motion.div
                  className="h-3 w-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <p className="text-red-800 text-sm font-medium">Listening</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

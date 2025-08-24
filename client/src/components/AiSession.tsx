"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2 } from "lucide-react";

export default function AiSession({ agentId }: { agentId: string }) {
  const [transcript, setTranscript] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any | null>(null); // 🆕 analysis state
  const [loadingAnalysis, setLoadingAnalysis] = useState(false); // 🆕 loader state

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => {
      console.log("Message:", message);
      setTranscript((prev) => [...prev, message.message || ""]);
    },
    onError: (error) => console.error("Error:", error),
  });

  agentId = agentId || "agent_7101k3c4p9drenrtdr1n859cgb67";

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setTranscript([]);
      setAnalysis(null); // clear old analysis
      await conversation.startSession({ agentId });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, agentId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();

    // Run analysis when session stops
    setLoadingAnalysis(true);
    import("@/lib/processTranscript").then(async ({ processTranscript }) => {
      try {
        const result = await processTranscript(transcript);
        setAnalysis(result); // 🆕 store in state
        console.log("📊 Analysis:", result);
      } catch (err) {
        console.error("Analysis failed", err);
      } finally {
        setLoadingAnalysis(false);
      }
    });
  }, [conversation, transcript]);

  return (
    <div className="flex flex-col w-full items-center gap-6 p-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-lg">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900">
        Autism Screening AI Session
      </h2>
      <p className="text-sm text-gray-700 text-center">
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

      {/* 🗒 Transcript Display */}
      {transcript.length > 0 && (
        <div className="w-full mt-4 p-3 bg-white rounded-xl shadow-inner max-h-60 overflow-y-auto text-sm text-gray-800">
          <h3 className="font-semibold text-blue-700 mb-2">Transcript</h3>
          <ul className="space-y-1">
            {transcript.map((line, index) => (
              <li key={index} className="border-b pb-1 last:border-b-0">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📊 Analysis Display */}
      {loadingAnalysis && (
        <div className="w-full mt-4 p-3 bg-gray-100 rounded-xl text-center text-gray-600 text-sm">
          Running analysis...
        </div>
      )}

      {analysis && (
        <div className="w-full mt-4 p-4 bg-white rounded-xl shadow-inner text-sm text-gray-800">
          <h3 className="font-semibold text-green-700 mb-2">AI Analysis</h3>

          <p>
            <span className="font-medium">Summary:</span> {analysis.summary}
          </p>

          <div className="mt-2">
            <span className="font-medium">Possible Indicators:</span>
            {analysis.possible_indicators.length > 0 ? (
              <ul className="list-disc ml-5 text-gray-700">
                {analysis.possible_indicators.map(
                  (indicator: string, idx: number) => (
                    <li key={idx}>{indicator}</li>
                  )
                )}
              </ul>
            ) : (
              <p className="ml-5 text-gray-500">None</p>
            )}
          </div>

          <p className="mt-2">
            <span className="font-medium">Recommendation:</span>{" "}
            {analysis.recommendation}
          </p>

          <p className="mt-2">
            <span className="font-medium">Advice for Caregivers:</span>{" "}
            {analysis.advice_for_caregivers}
          </p>
        </div>
      )}
    </div>
  );
}

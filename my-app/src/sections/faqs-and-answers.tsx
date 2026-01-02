"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
const FaqsAndAnswers: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is EchoWithin and how does it work?",
      answer:
        "EchoWithin is a voice-based AI companion that helps you understand your emotions through natural conversation. You talk about your thoughts and feelings, and our AI analyzes your voice patterns to provide emotional insights after each conversation.",
    },
    {
      question: "How is EchoWithin different from therapy apps or chatbots?",
      answer:
        "EchoWithin focuses on emotional awareness and self-discovery, not therapy or problem-solving. We use voice-based emotional analysis and accent-adaptive AI to create natural conversations that help you recognize emotional patterns.",
    },
    {
      question: "Can I choose the accent of the AI voice?",
      answer:
        "Yes! EchoWithin offers multiple warm, human-like accents including Indian neutral, British calm, and American warm for a more natural conversation experience.",
    },
    {
      question: "What kind of emotional insights will I receive?",
      answer:
        "After each conversation, you'll receive insights about your emotional patterns, mood shifts, hidden themes (like stress, hope, or gratitude), and emotional balance to help you understand yourself better.",
    },
  ];

  return (
    <section
      className="flex flex-col items-start max-w-5xl mx-auto md:flex-row justify-center gap-8 px-4 md:px-0 mt-18"
      id="faqs"
    >
      <img
        className="max-w-sm w-full rounded-xl h-auto"
        src="https://images.unsplash.com/photo-1585507252242-11fe632c26e8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
      />
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-indigo-600 text-sm font-medium">FAQ's</p>
        <h1 className="text-3xl font-semibold text-white">
          Voice-Based Emotional Discovery
        </h1>
        <p className="text-sm text-gray-400 mt-2 pb-4">
          Understand your emotions through natural conversation. EchoWithin
          listens to your voice patterns to provide meaningful emotional
          insights.
        </p>
        {faqs.map((faq, index) => (
          <div
            className="border-b border-gray-700 py-4 cursor-pointer"
            key={index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-white">
                {faq.question}
              </h3>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${
                  openIndex === index ? "rotate-180" : ""
                } transition-all duration-500 ease-in-out`}
              >
                <path
                  d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                  stroke="#8B8DF8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              className={`text-sm text-gray-400 transition-all duration-500 ease-in-out max-w-md ${
                openIndex === index
                  ? "opacity-100 max-h-[300px] translate-y-0 pt-4"
                  : "opacity-0 max-h-0 -translate-y-2"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default FaqsAndAnswers;

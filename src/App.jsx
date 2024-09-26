import { useState, useEffect, useRef } from "react";
import { Box, Text, Input, Button, VStack, HStack, useColorMode } from "@chakra-ui/react";
import { io } from "socket.io-client";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import GoogleAd from  './GoogleAds'

let socket; // Initialize socket outside the component to connect after user joins

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  
  const messagesEndRef = useRef(null); // Reference for the end of the chat messages

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Listen for messages from the server
      socket.on("newMessage", (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom()
      });

      socket.on("joinChat", (message) => {
        setMessages((prev) => [...prev, { name: "System", message }]);
        scrollToBottom()
      });

      socket.on("userDisconnected", (message) => {
        setMessages((prev) => [...prev, { name: "System", message }]);
        scrollToBottom()
      });

      return () => {
        socket.off("newMessage");
        socket.off("joinChat");
        socket.off("userDisconnected");
      };
    }
  }, [isLoggedIn]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("newMessage", input);
      setMessages((prev) => [...prev, { name: "You", message: input }]);
      setInput("");
      scrollToBottom()
    }
  };

  const handleLogin = () => {
    if (name.trim()) {
      // Connect to the server only after the user joins
      socket = io("https://chat-backend-vys5.onrender.com");
      socket.emit("joinChat", name);
      setIsLoggedIn(true);
    }
  };

  return (
    <Box
      w="100vw"
      h="90vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={colorMode === "dark" ? "gray.900" : "gray.100"}
    >
      <GoogleAd />
      {!isLoggedIn ? (
        <VStack
          w="100%"
          maxW="400px"
          p={4}
          spacing={4}
          border="1px solid"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          borderRadius="md"
          bg={colorMode === "dark" ? "gray.800" : "white"}
          shadow="lg"
        >
          <Text fontSize="xl" fontWeight="bold">
            Enter Your Name
          </Text>
          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            bg={colorMode === "dark" ? "gray.700" : "gray.100"}
          />
          <Button colorScheme="blue" onClick={() => handleLogin()}>
            Join Chat
          </Button>
        </VStack>
      ) : (
        <VStack
          w="100%"
          maxW="500px"
          p={4}
          spacing={4}
          border="1px solid"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          borderRadius="md"
          bg={colorMode === "dark" ? "gray.800" : "white"}
          shadow="lg"
          height="100%"
        >
          <HStack w="100%" justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="bold">
              Chat Room
            </Text>
            <Button onClick={toggleColorMode}>
              {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
            </Button>
          </HStack>

          <VStack
            w="100%"
            h="100%"
            overflowY="auto"
            bg={colorMode === "dark" ? "gray.700" : "gray.100"}
            p={4}
            borderRadius="md"
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                alignSelf={msg.name === "You" ? "flex-end" : "flex-start"}
                bg={msg.name === "You" ? "blue.500" : "green.500"}
                color="white"
                p={2}
                borderRadius="md"
              >
                <Text fontWeight="bold">{msg.name}</Text>
                <Text>{msg.message}</Text>
              </Box>
            ))}
            <div ref={messagesEndRef} /> 
          </VStack>

          <HStack w="100%">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              bg={colorMode === "dark" ? "gray.600" : "white"}
            />
            <Button colorScheme="blue" onClick={sendMessage}>
              Send
            </Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
}

export default App;

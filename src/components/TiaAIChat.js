// components/TiaAIChat.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SendIconH from "../assets/Images/send_icon_h";
import MicIcon from "../assets/Images/mic_icon";
import { lightTheme, darkTheme } from "../theme/theme";
export default function TiaAIChat({
  visible,
  onClose,
  onMinimize,
  theme,
}) {
  if (!visible) return null;

const t = theme ?? lightTheme;
const isDark = t.mode === "dark";

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: t.aiBg,
            borderColor: t.aiBorder,
            borderWidth: t.mode === "dark" ? 1 : 0,
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require("../assets/Images/headerimg.png")}
            style={styles.headerImage}
            resizeMode="cover"
          />

          <View style={styles.headerContent}>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={onMinimize}>
                <MaterialIcons name="remove" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <Image
              source={require("../assets/Images/profileimg.png")}
              style={styles.avatar}
              resizeMode="contain"
            />

            <Text style={styles.title}>Hello I’m Tia</Text>
            <Text style={styles.subtitle}>
              How may I help you today?
            </Text>
          </View>
        </View>

        {/* BODY */}
        <View style={styles.body}>
          <View
            style={[
              styles.messageBox,
              { backgroundColor: t.aiMessageBg },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                { color: t.aiTextSecondary },
              ]}
            >
              I’m here to answer any questions you may have..
            </Text>
          </View>
        </View>

        {/* INPUT */}
        <View
          style={[
            styles.inputBar,
            { backgroundColor: t.aiInputBg },
          ]}
        >
          <MaterialIcons
            name="menu"
            size={20}
            color={t.aiAccent}
          />

          <TextInput
            placeholder="Ask me anything or use the mic"
            placeholderTextColor={t.aiPlaceholder}
            style={[
              styles.input,
              {
                backgroundColor: t.aiInputFieldBg,
                color: t.aiTextPrimary,
              },
            ]}
          />

          <MicIcon />
          <SendIconH />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  container: {
    position: "absolute",
    left: 100,
    top: 50,
    width: 420,
    height: 630,
    borderRadius: 20,
    overflow: "hidden",

    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  header: {
    height: 160,
    position: "relative",
    overflow: "hidden",
  },

  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  headerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  headerActions: {
    position: "absolute",
    right: 12,
    top: 10,
    flexDirection: "row",
    gap: 10,
  },

  avatar: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  subtitle: {
    color: "#E5E7EB",
    fontSize: 12,
  },

  body: {
    flex: 1,
    padding: 16,
  },

  messageBox: {
    borderRadius: 14,
    padding: 12,
    maxWidth: "80%",
  },

  messageText: {
    fontSize: 12,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },

  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
    fontSize: 10,
  },
});
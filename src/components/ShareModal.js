import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ShareModal = ({ visible, onClose, theme }) => {
  const [emails, setEmails] = useState("");

  if (!visible) return null;

  const styles = makeStyles(theme);

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Share template</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={20} color={theme.smCloseColor} />
            </TouchableOpacity>
          </View>

          {/* EMAIL INPUT */}
          <View style={styles.inputRow}>
            <MaterialIcons name="person" size={18} color={theme.smIconColor} />
            <TextInput
              placeholder="Add comma separated e-mails to share"
              placeholderTextColor={theme.smPlaceholderColor}
              value={emails}
              onChangeText={setEmails}
              style={styles.input}
            />
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* OR */}
          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* EVERYONE ACCESS */}
          <View style={styles.inputRow}>
            <MaterialIcons name="public" size={18} color={theme.smIconColor} />
            <Text style={styles.everyoneText}>Everyone has access</Text>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryText}>Save</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default ShareModal;

// ───────── DYNAMIC STYLES ─────────
const makeStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "center",
      alignItems: "center",
    },

    card: {
      width: 493,
      backgroundColor: theme.smCardBg,
      borderRadius: 16,
      padding: 16,
      height: 260,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
      marginTop: 20,
    },

    title: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.smTitleColor,
    },

    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.smInputRowBg,
      borderRadius: 10,
      paddingHorizontal: 10,
      height: 44,
      gap: 8,
    },

    input: {
      flex: 1,
      fontSize: 12,
      color: theme.smInputText,
    },

    primaryBtn: {
      backgroundColor: "#1D4ED8",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },

    primaryText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
    },

    orRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 14,
      gap: 8,
    },

    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.smDividerColor,
    },

    orText: {
      fontSize: 11,
      color: theme.smOrTextColor,
      fontWeight: "600",
    },

    everyoneText: {
      flex: 1,
      fontSize: 12,
      color: theme.smEveryoneText,
    },
  });
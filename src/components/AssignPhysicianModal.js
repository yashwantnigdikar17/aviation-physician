import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const DOCTORS = [
  { id: 1, name: "Dr. Ramesh Madhavan", available: "Available • 12 events today" },
  { id: 2, name: "Dr. Thomas Shelby", available: "Available" },
  { id: 3, name: "Dr. Caroline Jensen", available: "Available" },
  { id: 4, name: "Dr. Aaron Ross", available: "Available" },
  { id: 5, name: "Dr. Aaron Ross", available: "Available" },
];

const AssignPhysicianModal = ({ visible, onClose, onAssign, theme }) => {
  const [selectedId, setSelectedId] = useState(1);

  if (!visible) return null;

  const styles = makeStyles(theme);

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Assign to Provider</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={20} color={theme.apCloseColor} />
            </TouchableOpacity>
          </View>

          {/* DIVIDER */}
          <View style={styles.divider} />

          {/* SEARCH */}
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={18} color={theme.apSearchIconColor} />
            <TextInput
              placeholder="Search by name or specialty"
              style={styles.input}
              placeholderTextColor={theme.apPlaceholderColor}
            />
          </View>

          {/* LIST */}
          <FlatList
            data={DOCTORS}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => {
              const selected = item.id === selectedId;
              return (
                <TouchableOpacity
                  style={[
                    styles.doctorCard,
                    selected && styles.selectedCard,
                  ]}
                  onPress={() => setSelectedId(item.id)}
                >
                  <View>
                    <Text style={styles.docName}>{item.name}</Text>
                    <Text style={styles.available}>{item.available}</Text>
                  </View>
                  {selected && (
                    <MaterialIcons name="check" size={18} color={theme.apCheckColor} />
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {/* ASSIGN BUTTON */}
          <TouchableOpacity
            style={styles.assignBtn}
            onPress={() => {
              const selectedDoctor = DOCTORS.find((d) => d.id === selectedId);
              onAssign(selectedDoctor);
              onClose();
            }}
          >
            <Text style={styles.assignText}>Assign</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default AssignPhysicianModal;


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
      width: 500,
      maxHeight: "85%",
      backgroundColor: theme.apCardBg,
      borderRadius: 24,
      padding: 16,
      height: 650,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },

    title: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.apTitleColor,
    },

    divider: {
      height: 0.5,
      backgroundColor: theme.apDividerColor,
      marginHorizontal: -16,
      marginBottom: 16,
    },

    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.apSearchBg,
      borderRadius: 12,
      paddingHorizontal: 10,
      height: 40,
      marginBottom: 20,
      gap: 6,
    },

    input: {
      flex: 1,
      fontSize: 11,
      color: theme.apInputText,
    },

    doctorCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.apCardBorder,
      backgroundColor: theme.apCardItemBg,
    },

    selectedCard: {
      backgroundColor: theme.apSelectedCardBg,
      borderColor: theme.apSelectedCardBorder,
    },

    docName: {
      fontSize: 13,
      fontWeight: "400",
      color: theme.apDocNameColor,
    },

    available: {
      fontSize: 11,
      color: theme.apAvailableColor,
      marginTop: 2,
    },

    assignBtn: {
      marginTop: 14,
      backgroundColor: "#1D4ED8",
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
    },

    assignText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 13,
      
    },
  });
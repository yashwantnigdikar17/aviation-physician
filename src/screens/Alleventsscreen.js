import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

import Sidebar from "../components/Sidebar";

import CalendarIcon from "../assets/Images/calander.svg";
import UserIcon from "../assets/Images/person.svg";
import AssignIcon from "../assets/Images/patienttoassign.svg";
import CriticalIcon from "../assets/Images/plusnote.svg";
import SearchIcon from "../assets/Images/Search.svg";
import FilterIcon from "../assets/Images/filter.svg";
import ExportIcon from "../assets/Images/export.svg";
import EyeIcon from "../assets/Images/eyeicon.svg";
import MedicalIcon from "../assets/Images/medIcon.svg";
import HeartIcon from "../assets/Images/vitalheart.svg";
import AddIcon from "../assets/Images/videoicon.svg";
import MoreIcon from "../assets/Images/more.svg";

const DATA = new Array(10).fill({
  flight: "AA1234\nA15",
  name: "Lisha Cook\n45y (F)",
  mrn: "719471345\nID: NA",
  status: "Critical",
  route: "SYD → LAX",
  physician: "Alex Tobar",
  crew: "Julia R",
});

export default function EventsScreenTable({ navigation }) {
  return (
    <View style={styles.root}>

      {/* ✅ SIDEBAR FIX WIDTH */}
      <View style={styles.sidebarWrap}>
        <Sidebar navigation={navigation} activeKey="allEvents"  />
      </View>

      {/* ✅ MAIN CONTENT */}
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* TOP SECTION */}
          <View style={styles.topRow}>
            <View style={styles.welcomeCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JO</Text>
              </View>
              <View>
                <Text style={styles.goodMorning}>Good morning 🌤</Text>
                <Text style={styles.doctorName}>Dr. James Oktar</Text>
                <Text style={styles.doctorSpec}>MD - Neurology</Text>
              </View>
            </View>

            {[
              { icon: CalendarIcon, label: "Events today" },
              { icon: UserIcon, label: "Patients to see" },
              { icon: AssignIcon, label: "Patients to assign" },
              { icon: CriticalIcon, label: "Critical Cases" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <View key={i} style={styles.statCard}>
                  <Icon width={20} height={20} />
                  <Text style={styles.statValue}>XX</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              );
            })}
          </View>

          {/* SEARCH */}
          <View style={styles.searchRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>Jan 26</Text>
            </View>

            <View style={styles.searchBox}>
              <SearchIcon width={16} height={16} />
              <TextInput
                placeholder="Search flight route, patients by name or MRN..."
                style={styles.searchInput}
              />
            </View>

            <TouchableOpacity style={styles.filterBtn}>
              <FilterIcon width={16} height={16} />
              <Text style={styles.btnText}>Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.exportBtn}>
              <ExportIcon width={16} height={16} />
              <Text style={styles.btnText}>Export</Text>
            </TouchableOpacity>
          </View>

          {/* TABLE */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {[
                "Flight #\nSeat",
                "Name\nAge (Gender)",
                "MRN\n(Patient ID)",
                "Status",
                "Flight Route",
                "Physician",
                "Crew",
                "Actions",
              ].map((h, i) => (
                <Text key={i} style={styles.th}>{h}</Text>
              ))}
            </View>

            {DATA.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.td}>{item.flight}</Text>
                <Text style={styles.td}>{item.name}</Text>
                <Text style={styles.td}>{item.mrn}</Text>

                <Text style={styles.status}>{item.status}</Text>
                <Text style={styles.route}>{item.route}</Text>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.physician}</Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.crew}</Text>
                </View>

                <View style={styles.actions}>
                  <EyeIcon width={16} height={16} />
                  <MedicalIcon width={16} height={16} />
                  <HeartIcon width={16} height={16} />
                  <AddIcon width={16} height={16} />
                  <MoreIcon width={16} height={16} />
                </View>
              </View>
            ))}
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },

  sidebarWrap: {
    width: 80, // ⚠️ IMPORTANT FIX (adjust if needed)
    backgroundColor: "#fff",
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 16,
  },

  topRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  welcomeCard: {
    flex: 1.5,
    backgroundColor: "#2F80ED",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E5ED8",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },

  goodMorning: { color: "#fff", fontSize: 12 },
  doctorName: { color: "#fff", fontWeight: "700" },
  doctorSpec: { color: "#DCE6FF", fontSize: 11 },

  statCard: {
    flex: 1,
    backgroundColor: "#EAF1FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },

  statValue: { fontSize: 16, fontWeight: "700" },
  statLabel: { fontSize: 11, color: "#555" },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  dateBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    gap: 6,
  },

  searchInput: { flex: 1, fontSize: 12 },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1565C0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },

  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1565C0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },

  btnText: {
    color: "#1565C0",
    fontSize: 12,
    fontWeight: "600",
  },

  table: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#EEF2F7",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  th: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
  },

  td: {
    flex: 1,
    fontSize: 11,
  },

  status: {
    flex: 1,
    color: "#E53935",
    fontWeight: "700",
  },

  route: {
    flex: 1,
    fontWeight: "600",
  },

  badge: {
    flex: 1,
    backgroundColor: "#DCE9E7",
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center",
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },

  actions: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
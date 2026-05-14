// components/MedicineModules.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { lightTheme, darkTheme } from "../theme/theme";
import Dropdown from "../assets/Images/dropdown.svg";
// ─── Data ─────────────────────────────────────────────────────────────────────
export const MODULES = [
  {
    id: "A",
    title: "Module A (Essential):",
    emoji: "💊",
    description:
      "Essential emergency medicines and first-response supplies for immediate onboard care.",
    defaultOpen: true,
    items: [
      {
        name: "Atropine ampoule 600 mcg /ml",
        usage: "Slow heart rate / Cardiac arrest",
        outOfStock: false,
      },
      {
        name: "Adrenaline (Epinephrine) 1:1000 ampoule",
        usage: "Anaphylaxis",
        outOfStock: false,
      },
      { name: "Epipen OR NEFFY", usage: "Anaphylaxis", outOfStock: true },
      {
        name: "Midozalam ( Buccal or Intranasal )",
        usage: "Seizure",
        outOfStock: false,
      },
      {
        name: "Amiodarone Ampoule",
        usage: "Ventricular tachycardia / Fibrillation",
        outOfStock: false,
      },
      {
        name: "Hydrocortisone sodium succinate 250 mg",
        usage: "Asthma",
        outOfStock: false,
      },
      { name: "Diphenhydramine 50mgml", usage: "Allergy", outOfStock: false },
      {
        name: "Aspirin 300 mg tablets",
        usage: "Chest pain / Heart attack/ MI",
        outOfStock: false,
      },
      { name: "GTN SPRAY 400 mcg", usage: "Angina", outOfStock: false },
      {
        name: "Salbutamol (Albuterol) inhaler",
        usage: "Asthma",
        outOfStock: false,
      },
      {
        name: "Dextrose,50% injectable",
        usage: "Hypoglycemia / low blood sugar",
        outOfStock: false,
      },
      {
        name: "Glucose gel ( 2 x tubes supplied)",
        usage: "Hypoglycemia / low blood sugar",
        outOfStock: false,
      },
      { name: "TAB Paracetamol", usage: "Pain", outOfStock: false },
      { name: "TAB Loratidine", usage: "Allergy", outOfStock: false },
      {
        name: "Tab Ondesetron",
        usage: "Nausea and vomiting",
        outOfStock: false,
      },
    ],
  },
  {
    id: "B",
    title: "Module B (Medication):",
    emoji: "💊",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    defaultOpen: false,
    items: [
      {
        name: "Atropine Sulfate 600mcg /ml ampoule",
        usage: "",
        outOfStock: false,
      },
      {
        name: "Adrenaline (Epinephrine) 1:1000 ampoule - IM",
        usage: "",
        outOfStock: false,
      },
      {
        name: "Adrenaline (Epinephrine) 1:10,000 ampoule - IV",
        usage: "",
        outOfStock: false,
      },
      {
        name: "Lidocaine 50mg /5 ml ampoule - IV",
        usage: "",
        outOfStock: false,
      },
      {
        name: "Hydrocortisone Sodium succinate 250 gm",
        usage: "",
        outOfStock: false,
      },
      {
        name: "Sodium chloride (Saline) 0.9% 20 ml for injection",
        usage: "",
        outOfStock: false,
      },
      { name: "Aspirin 300 mg tablets", usage: "", outOfStock: false },
      { name: "GTN Spray 400mcg", usage: "", outOfStock: false },
      { name: "Salbutamol (Albuterol) inhaler", usage: "", outOfStock: false },
      { name: "Glucose gel - Glutose 15", usage: "", outOfStock: false },
      { name: "Paracetamol", usage: "", outOfStock: false },
      { name: "Antihistamine tablets", usage: "", outOfStock: false },
      {
        name: "Diphenhydramine injectable 50 mg/ml",
        usage: "",
        outOfStock: false,
      },
      { name: "SPACER DEVICE for Salbutamol", usage: "", outOfStock: false },
      { name: "180 Injection needle", usage: "", outOfStock: false },
      { name: "230 Injection needle", usage: "", outOfStock: false },
      { name: "Drawing needle blunt", usage: "", outOfStock: false },
      { name: "5ml Syringe", usage: "", outOfStock: false },
      { name: "Gauze Square", usage: "", outOfStock: false },
    ],
  },
  {
    id: "C",
    title: "Module C (Airway):",
    emoji: "💊",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    defaultOpen: false,
    items: [
      {
        name: "Oropharyngeal Airway Set Child 50mm",
        usage: "",
        outOfStock: false,
      },
      {
        name: "Oropharyngeal Airway Small Adult 70mm",
        usage: "",
        outOfStock: false,
      },
      {
        name: "Oropharyngeal Airway Set Adult 90mm",
        usage: "",
        outOfStock: false,
      },
      { name: "Bag-Valve-Mask (Adult)", usage: "", outOfStock: false },
      { name: "Pocket Mask with one-way valve", usage: "", outOfStock: false },
      { name: "Manual Suction Device", usage: "", outOfStock: false },
      { name: "Oxygen Mask with tubing (Adult)", usage: "", outOfStock: false },
    ],
  },
  {
    id: "D",
    title: "Module D (Circulation):",
    emoji: "💊",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    defaultOpen: false,
    items: [
      { name: "IV Cannula 22G / IV Wing", usage: "", outOfStock: false },
      { name: "IV Giving Set", usage: "", outOfStock: false },
      {
        name: "IV Bung / Reflux valve (safiste)",
        usage: "",
        outOfStock: false,
      },
      { name: "0.9% Normal Saline 500 ml", usage: "", outOfStock: false },
      { name: "Tagarderm film", usage: "", outOfStock: false },
      { name: "Tourniquet (Disposable)", usage: "", outOfStock: false },
      { name: "Gauze Square", usage: "", outOfStock: false },
      { name: "Documents folder", usage: "", outOfStock: false },
      { name: "Instructions manual", usage: "", outOfStock: false },
      { name: "Splint", usage: "", outOfStock: false },
      { name: "Sharps Container", usage: "", outOfStock: false },
    ],
  },
];

// ─── Checkbox component ───────────────────────────────────────────────────────
// FIX 1: Removed stray `onToggle={() => toggleMedicine(item.name)}` JSX prop
// that referenced `item` and `toggleMedicine` which are not in scope here.
const Checkbox = ({ checked, onToggle, isDark }) => (
  <TouchableOpacity
    onPress={onToggle}
    activeOpacity={0.7}
    style={[
      checkboxStyles.box,
      {
        borderColor: checked ? "#0A5FFF" : isDark ? "#4B5563" : "#CBD5E1",
        backgroundColor: checked ? "#0A5FFF" : isDark ? "#1F2937" : "#FFFFFF",
      },
    ]}
  >
    {checked && <Text style={checkboxStyles.tick}>✓</Text>}
  </TouchableOpacity>
);

const checkboxStyles = StyleSheet.create({
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "500",
    lineHeight: 14,

    textAlign: "center",
    position: "absolute",
    top: -2,
  },
});

// ─── Single Module accordion ──────────────────────────────────────────────────
const Module = ({
  title,
  emoji,
  description,
  items,
  isOpen,
  onToggle,
  searchQuery,
  COLORS,
  isDark,
  showCheckboxes = false,
  showUsageColumn = true,
  showAddButtons = false,
  selectedRows,
  onToggleRow,
  onAddRow,
  onAddAll,
  // FIX 2: onAddMedicine added to destructured props. Previously referenced
  // inside the per-row button's onPress without ever being received as a prop.

  onAddMedicine,
  onAddMedicines,
  onMedicinePress,
   moduleId,
  moduleTitle,
}) => {
  // FIX 3: Removed internal `selectedMedicines` state and `toggleMedicine`
  // helper entirely. They duplicated the external `selectedRows` (Set<index>)
  // controlled state passed down from MedicineModules, causing the Checkbox
  // `checked` prop to read from two conflicting sources simultaneously.
  // Checkbox visual state now derives solely from `selectedRows`.

  const filtered = searchQuery
    ? items
        .map((item, originalIdx) => ({ ...item, originalIdx }))
        .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items.map((item, originalIdx) => ({ ...item, originalIdx }));

  // Whether any rows in this module are currently checked
  const hasCheckedRows = selectedRows && selectedRows.size > 0;

  return (
    <View
      style={[
        moduleStyles.container,
        {
          backgroundColor: COLORS.moduleBg,
          borderColor: COLORS.border,
        },
      ]}
    >
      {/* ── Accordion header ── */}
      <TouchableOpacity
        style={moduleStyles.header}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={moduleStyles.headerLeft}>
          <Text style={moduleStyles.emoji}>{emoji}</Text>
          <Text style={[moduleStyles.title, { color: COLORS.primary }]}>
            {title}
          </Text>
        </View>
        <Text style={[moduleStyles.chevron, { color: COLORS.textSecondary }]}>
          {isOpen ? <Dropdown /> : "∧"}
        </Text>
      </TouchableOpacity>

      {/* ── Description ── */}
      <Text style={[moduleStyles.description, { color: COLORS.textTertiary }]}>
        {description}
      </Text>

      {/* ── Table ── */}
      {isOpen && filtered.length > 0 && (
        <View style={[moduleStyles.table, { borderColor: COLORS.border }]}>
          {/* Table header row */}
          <View
            style={[
              moduleStyles.tableHeaderRow,
              { backgroundColor: isDark ? "#1F2937" : "#F0F4FF" },
            ]}
          >
            {showCheckboxes && <View style={moduleStyles.checkboxCol} />}

            <Text
              style={[
                moduleStyles.tableHeaderCell,
                { flex: showUsageColumn ? 1.5 : 1, color: COLORS.textPrimary },
              ]}
            >
              Name
            </Text>

            {showUsageColumn && (
              <Text
                style={[
                  moduleStyles.tableHeaderCell,
                  { flex: 1, color: COLORS.textPrimary },
                ]}
              >
                Usage
              </Text>
            )}

            {/* FIX 4: "Add All" previously referenced `selectedMedicines`
                (removed internal state) and called `onAddAllMedicines`
                (undefined prop). Now uses `hasCheckedRows` (derived from the
                external `selectedRows` Set) and calls `onAddAll(filtered)`
                which is the correct prop forwarded from MedicineModules. */}
            {/* {showAddButtons && (
              <TouchableOpacity
                style={[
                  moduleStyles.addAllBtn,
                  {
                    backgroundColor: hasCheckedRows
                      ? "#0A5FFF"
                      : isDark
                        ? "#1E293B"
                        : "#E2E8F0",
                    opacity: hasCheckedRows ? 1 : 0.5,
                  },
                ]}
                activeOpacity={0.7}
                disabled={!hasCheckedRows}
                onPress={() => {
  if (!onAddAll) return;

  const checkedItems = filtered
    .filter((item) => selectedRows.has(item.originalIdx))
    .map((item) => ({
      ...item,
      moduleId,
      moduleTitle,
    }));

  onAddAll(checkedItems);
}}
              >
                <Text
                  style={[
                    moduleStyles.addAllText,
                    {
                      color: hasCheckedRows
                        ? "#FFFFFF"
                        : isDark
                          ? "#94A3B8"
                          : "#64748B",
                    },
                  ]}
                >
                  Add All
                </Text>
              </TouchableOpacity>
            )} */}
          </View>

          {/* Data rows */}
          {filtered.map((item, idx) => {
            // FIX 5: `isChecked` now reads solely from `selectedRows` (the
            // external controlled Set). The removed `selectedMedicines` array
            // is no longer referenced.
            const isChecked = selectedRows
              ? selectedRows.has(item.originalIdx)
              : false;

            return (
              <View
                key={idx}
                style={[
                  moduleStyles.tableRow,
                  { borderTopColor: isDark ? "#374151" : "#EEF1F6" },

                  { backgroundColor: isDark ? "#112339" : "#FAFBFF" },
                ]}
              >
                {showCheckboxes && (
                  <View style={moduleStyles.checkboxCol}>
                    {/* FIX 6: Checkbox `onToggle` now calls only `onToggleRow`.
                        The removed `toggleMedicine(item.name)` call is gone. */}
                    <Checkbox
                      checked={isChecked}
                      onToggle={() =>
                        onToggleRow && onToggleRow(item.originalIdx)
                      }
                      isDark={isDark}
                    />
                  </View>
                )}

                {/* Name + out-of-stock badge */}
                <View
                  style={[
                    moduleStyles.tableCell,
                    { flex: showUsageColumn ? 1.5 : 1 },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => onMedicinePress?.(item.name)}
                      style={{
                        flexShrink: 1,
                        marginRight: item.outOfStock ? 8 : 0,
                      }}
                    >
                      <Text
                        style={[
                          moduleStyles.tableCellText,
                          {
                            color: COLORS.textPrimary,
                            textDecorationLine: "underline",
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>

                    {item.outOfStock && (
                      <View
                        style={[
                          moduleStyles.outOfStockBadge,
                          {
                            backgroundColor: isDark ? "#451A1E" : "#FFEBEE",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            moduleStyles.outOfStockText,
                            {
                              color: isDark ? "#EF5350" : "#D32F2F",
                            },
                          ]}
                        >
                          Out of Stock
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {showUsageColumn && (
                  <View style={[moduleStyles.tableCell, { flex: 1 }]}>
                    <Text
                      style={[
                        moduleStyles.tableCellText,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      {item.usage}
                    </Text>
                  </View>
                )}

                {/* FIX 7: `onAddMedicine` is now a proper received prop (see
                    Module destructuring). Previously it was called inside
                    onPress without ever being in scope, causing a ReferenceError
                    at runtime. */}
                {showAddButtons && (
                  <View style={moduleStyles.addBtnCol}>
                    <TouchableOpacity
                      style={[
                        moduleStyles.addRowBtn,
                        {
                          backgroundColor: isDark ? "#0A3A8A" : "#EEF3FF",
                          borderColor: isDark ? "#1A5FCC" : "#C7D9FF",
                        },
                      ]}
                      onPress={() => {
  onAddRow &&
    onAddRow(
      {
        ...item,
        moduleId,
        moduleTitle,
      },
      item.originalIdx
    );
}}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          moduleStyles.addRowBtnText,
                          { color: isDark ? "#7EB3FF" : "#0A5FFF" },
                        ]}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

// ─── MedicineModules — public exported component ──────────────────────────────
/**
 * Props
 * ─────
 * searchQuery       {string}   — filters rows by name. Default: ""
 * showCheckboxes    {bool}     — renders checkbox column. Default: false
 * showUsageColumn   {bool}     — renders Usage column. Default: true
 * showAddButtons    {bool}     — renders "+" row buttons + "Add All". Default: false
 * onAddRow          {fn}       — (item, moduleId, rowIndex) => void
 * onAddAll          {fn}       — (filteredItems, moduleId) => void
 * onSelectionChange {fn}       — (selection: { [moduleId]: Set<rowIndex> }) => void
 * onAddMedicine     {fn}       — (name: string) => void  — e.g. push to chat input
 *
 * Usage examples:
 *
 * // SearchKitScreen
 * <MedicineModules searchQuery={q} showUsageColumn showCheckboxes={false} showAddButtons={false} />
 *
 * // EventSummaryScreen
 * <MedicineModules
 *   searchQuery={q}
 *   showUsageColumn={false}
 *   showCheckboxes
 *   showAddButtons
 *   onAddRow={(item, moduleId, idx) => handleAdd(item)}
 *   onAddAll={(items, moduleId) => handleAddAll(items)}
 *   onSelectionChange={(sel) => setSelected(sel)}
 *   onAddMedicine={(name) => setChatInput(name)}
 * />
 */
const MedicineModules = ({
  searchQuery = "",
  showCheckboxes = false,
  showUsageColumn = true,
  showAddButtons = false,
    showGlobalAddAll = false,
  onAddRow,
  onAddAll,
  onSelectionChange,
  onAddMedicine,
  onAddMedicines,
  onMedicinePress,
}) => {
  const themeCtx = useTheme();
  const isDark = themeCtx?.dark;
  const COLORS = isDark ? darkTheme : lightTheme;

  const [openModules, setOpenModules] = useState(() => {
    const init = {};
    MODULES.forEach((m) => {
      init[m.id] = m.defaultOpen;
    });
    return init;
  });

  const [selection, setSelection] = useState(() => {
    const init = {};
    MODULES.forEach((m) => {
      init[m.id] = new Set();
    });
    return init;
  });

  const toggleModule = (id) =>
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleToggleRow = (moduleId, rowIndex) => {
    setSelection((prev) => {
      const next = { ...prev };
      const moduleSet = new Set(next[moduleId]);
      if (moduleSet.has(rowIndex)) moduleSet.delete(rowIndex);
      else moduleSet.add(rowIndex);
      next[moduleId] = moduleSet;
      if (onSelectionChange) onSelectionChange(next);
      return next;
    });
  };

  const clearSelectedRows = (moduleId, rowIndexes = []) => {
    setSelection((prev) => {
      const next = { ...prev };

      const updatedSet = new Set(next[moduleId]);

      rowIndexes.forEach((idx) => {
        updatedSet.delete(idx);
      });

      next[moduleId] = updatedSet;

      if (onSelectionChange) {
        onSelectionChange(next);
      }

      return next;
    });
  };

  const handleAddRow = (moduleId, item, rowIndex) => {
    if (onAddRow) {
      onAddRow(item, moduleId, rowIndex);
    }

    // RESET CHECKBOX
    clearSelectedRows(moduleId, [rowIndex]);
  };

const handleAddAll = (moduleId, filteredItems) => {
  if (onAddAll) {
    onAddAll(filteredItems, moduleId);
  }

  if (onAddMedicines) {
    const medicinesWithModules = filteredItems.map((item) => ({
      moduleId: item.moduleId,
      moduleTitle: item.moduleTitle,
      medicineName: item.name,
      usage: item.usage,
    }));

    onAddMedicines(medicinesWithModules);
  }

  const indexesToClear = filteredItems.map((item) => item.originalIdx);

  clearSelectedRows(moduleId, indexesToClear);
  };
  
  const handleGlobalAddAll = () => {
  const selectedMedicines = [];

  MODULES.forEach((module) => {
    const selectedSet = selection[module.id];

    if (!selectedSet || selectedSet.size === 0) return;

    module.items.forEach((item, index) => {
      if (selectedSet.has(index)) {
        selectedMedicines.push({
          moduleId: module.id,
          moduleTitle: module.title,
          medicineName: item.name,
          usage: item.usage,
          outOfStock: item.outOfStock,
          originalIdx: index,
        });
      }
    });
  });

  if (selectedMedicines.length === 0) return;

  if (onAddMedicines) {
    onAddMedicines(selectedMedicines);
  }

  if (onAddAll) {
    onAddAll(selectedMedicines, "ALL_MODULES");
  }

  // Clear all selections after adding
  const clearedSelection = {};
  MODULES.forEach((module) => {
    clearedSelection[module.id] = new Set();
  });

  setSelection(clearedSelection);

  if (onSelectionChange) {
    onSelectionChange(clearedSelection);
  }
};

  const selectedCount = Object.values(selection).reduce(
  (total, set) => total + set.size,
  0
  );
  
  return (
    <>
          {showGlobalAddAll && showCheckboxes && showAddButtons && (
      <View
        style={[
          moduleStyles.globalAddAllWrap,
          {
            backgroundColor: isDark ? "#111827" : "#FFFFFF",
            borderColor: COLORS.border,
          },
        ]}
      >
        <Text
          style={[
            moduleStyles.globalAddAllText,
            { color: COLORS.textPrimary },
          ]}
        >
          Selected medicines: {selectedCount}
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          disabled={selectedCount === 0}
          onPress={handleGlobalAddAll}
          style={[
            moduleStyles.globalAddAllBtn,
            {
              backgroundColor:
                selectedCount > 0
                  ? "#0A5FFF"
                  : isDark
                  ? "#1E293B"
                  : "#E2E8F0",
              opacity: selectedCount > 0 ? 1 : 0.55,
            },
          ]}
        >
          <Text
            style={[
              moduleStyles.globalAddAllBtnText,
              {
                color:
                  selectedCount > 0
                    ? "#FFFFFF"
                    : isDark
                    ? "#94A3B8"
                    : "#64748B",
              },
            ]}
          >
            Add All
          </Text>
        </TouchableOpacity>
      </View>
    )}

    {MODULES.map((module) => (
<Module
  key={module.id}
  moduleId={module.id}
  moduleTitle={module.title}
  title={module.title}
  emoji={module.emoji}
  description={module.description}
  items={module.items}
  isOpen={openModules[module.id]}
  onToggle={() => toggleModule(module.id)}
  searchQuery={searchQuery}
  COLORS={COLORS}
  isDark={isDark}
  showCheckboxes={showCheckboxes}
  showUsageColumn={showUsageColumn}
  showAddButtons={showAddButtons}
  selectedRows={selection[module.id]}
  onToggleRow={(rowIndex) => handleToggleRow(module.id, rowIndex)}
onAddRow={(item, rowIndex) => {
  handleAddRow(module.id, item, rowIndex);

  if (onAddMedicine) {
    onAddMedicine({
      moduleId: item.moduleId,
      moduleTitle: item.moduleTitle,
      medicineName: item.name,
      usage: item.usage,
    });
  }
}}
  onAddAll={(filteredItems) => handleAddAll(module.id, filteredItems)}
  onAddMedicine={onAddMedicine}
  onAddMedicines={onAddMedicines}
  onMedicinePress={onMedicinePress}
/>
      ))}
    </>
  );
};

export default MedicineModules;

// ─── Styles ───────────────────────────────────────────────────────────────────
// FIX 9: The entire moduleStyles block was absent from the submitted file.
const moduleStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  emoji: { fontSize: 15 },
  title: { fontSize: 13, fontWeight: "700", flex: 1 },
  chevron: { fontSize: 13, marginLeft: 8 },
  description: {
    fontSize: 11,
    lineHeight: 15,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  //Add all global
  globalAddAllWrap: {
  borderWidth: 1,
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  marginBottom: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
},

globalAddAllText: {
  fontSize: 12,
  fontWeight: "700",
  flex: 1,
},

globalAddAllBtn: {
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 8,
},

globalAddAllBtnText: {
  fontSize: 12,
  fontWeight: "800",
},
  table: {
    marginHorizontal: 12,
    marginBottom: 14,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "700",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 10,
    minHeight: 38,
    borderTopWidth: 1,
  },
  tableCell: {
    justifyContent: "center",
    paddingRight: 8,
  },
  tableCellText: { fontSize: 12, lineHeight: 17, marginLeft: 10 },
  outOfStockBadge: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  outOfStockText: { fontSize: 9.5, fontWeight: "700" },
  checkboxCol: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: "auto",
  },
  addAllText: {
    fontSize: 11,
    fontWeight: "700",
  },
  addBtnCol: {
    width: 36,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  addRowBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  addRowBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
});

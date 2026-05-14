// components/ChatPanel.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Svg, { Path, Rect, Line, Circle } from "react-native-svg";
import { useTheme } from "../theme/ThemeContext";
import { lightTheme } from "../theme/theme";

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS — toolbar
// ─────────────────────────────────────────────────────────────────────────────

const MicIcon = ({ color = "#EBEDF0", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="9" y="2" width="6" height="12" rx="3"
      stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M5 10C5 14.418 8.134 18 12 18C15.866 18 19 14.418 19 10"
      stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
    <Line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="9"  y1="22" x2="15" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const AttachmentIcon = ({ color = "#64748B", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42975 14.0991 2.00836 15.16 2.00836C16.2209 2.00836 17.2394 2.42975 17.99 3.18C18.7403 3.93063 19.1617 4.94905 19.1617 6.01C19.1617 7.07095 18.7403 8.08937 17.99 8.84L9.41 17.41C9.03484 17.7852 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95516 17.7852 6.58 17.41C6.20484 17.0348 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20484 14.9552 6.58 14.58L15.07 6.1"
      stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const SendArrowIcon = ({ size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13"
      stroke="#FFFFFF" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M22 2L15 22L11 13L2 9L22 2Z"
      stroke="#FFFFFF" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      fill="#FFFFFF"
    />
  </Svg>
);

const PlayIcon = () => (
  <Svg width={52} height={52} viewBox="0 0 52 52" fill="none">
    <Circle cx="26" cy="26" r="25" fill="rgba(255,255,255,0.15)" />
    <Circle cx="26" cy="26" r="18" fill="rgba(0,120,255,0.88)" />
    <Path d="M22 19L35 26L22 33V19Z" fill="#FFFFFF" />
  </Svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR SVGs
//
//  DoctorAvatar — dark navy circle, grey silhouette  (LEFT side, received msgs)
//  UserAvatar   — dark purple circle, lilac silhouette (RIGHT side, sent / video)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Grey doctor avatar — matches the left-side icon in bubbles 1 & 3.
 * Background: #1E2E42  |  Silhouette: #7A96B4
 */
const DoctorAvatar = ({ size = 36 }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    {/* Outer circle */}
    <Circle cx="18" cy="18" r="18" fill="#1E2E42" />
    {/* Head */}
    <Circle cx="18" cy="13.5" r="5.5" fill="#7A96B4" />
    {/* Shoulders arc */}
    <Path
      d="M5.5 33C5.5 26.096 11.096 20.5 18 20.5C24.904 20.5 30.5 26.096 30.5 33"
      fill="#7A96B4"
    />
  </Svg>
);

/**
 * Purple user avatar — matches the right-side icon in bubble 2 (video).
 * Background: #4A3D7A  |  Silhouette: #C4B5FD
 */
const UserAvatar = ({ size = 36 }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    {/* Outer circle */}
    <Circle cx="18" cy="18" r="18" fill="#4A3D7A" />
    {/* Head */}
    <Circle cx="18" cy="13.5" r="5.5" fill="#C4B5FD" />
    {/* Shoulders arc */}
    <Path
      d="M5.5 33C5.5 26.096 11.096 20.5 18 20.5C24.904 20.5 30.5 26.096 30.5 33"
      fill="#C4B5FD"
    />
  </Svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// DEMO DATA
// showAvatar: true  → render the avatar SVG for that bubble
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_MESSAGES = [
  {
    id: "1",
    type: "text",
    text: "Drink adequate water throughout the day.\nNote down any unusual physical sensations and report them during the next visit.\nContinue light physical activity as comfortable.",
    sender: "Dr. Sarah Johnson",
    timestamp: "14/03/2026 • 14:28",
    isMine: false,
    showAvatar: true,
  },
  {
    id: "2",
    type: "video",
    sender: "Chief Purser",
    timestamp: "14/03/2026 • 14:30",
    isMine: true,
    showAvatar: true,
  },
  {
    id: "3",
    type: "text",
    text: "Record observations every 2 hours.\nTrack sleep duration and overall rest quality.\nMaintain a log of meals and hydration.\nContact support staff if any unexpected changes are noticed.",
    sender: "Dr. Sarah Johnson",
    timestamp: "14/03/2026 • 14:28",
    isMine: false,
    showAvatar: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO BUBBLE  — right-aligned, UserAvatar (purple) to the RIGHT
// ─────────────────────────────────────────────────────────────────────────────
function VideoBubble({ item, colors }) {
  return (
    <View style={[msgSt.row, msgSt.rowRight]}>
      {/* Video card */}
      <View style={[msgSt.videoBubble, { backgroundColor: colors.videoBubbleBg }]}>
        <View style={msgSt.videoThumb}>
          <Image
            source={require("../assets/Images/chatimg.png")}
            style={msgSt.videoImg}
            resizeMode="cover"
          />
          <View style={msgSt.playOverlay}>
            <PlayIcon />
          </View>
        </View>
        <Text
          style={[
            msgSt.metaText,
            { color: colors.metaText, paddingHorizontal: 10, paddingVertical: 8 },
          ]}
        >
          {item.sender} • {item.timestamp}
        </Text>
      </View>

      {/* Purple UserAvatar — to the right of the video card, sits near the bottom */}
      {item.showAvatar && (
        <View style={msgSt.avatarRight}>
          <UserAvatar size={36} />
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECEIVED TEXT BUBBLE — left-aligned, DoctorAvatar (grey) to the LEFT
// ─────────────────────────────────────────────────────────────────────────────
function ReceivedBubble({ item, colors }) {
  return (
    <View style={[msgSt.row, msgSt.rowLeft]}>
      {/*
       * Avatar slot: alignSelf:"stretch" makes it as tall as the bubble so
       * justifyContent:"flex-end" can pin the avatar to the bottom.
       * When showAvatar is false we render a same-size transparent placeholder
       * so bubble left-edges always align.
       */}
      <View style={msgSt.avatarSlotLeft}>
        {item.showAvatar
          ? <DoctorAvatar size={36} />
          : <View style={{ width: 36, height: 36 }} />}
      </View>

      {/* Bubble */}
      <View
        style={[
          msgSt.bubble,
          {
            backgroundColor:     colors.receivedBg,
            borderRadius:        14,
            borderTopLeftRadius: 4,
            flex: 1,
          },
        ]}
      >
        <Text style={[msgSt.bubbleText, { color: colors.receivedText }]}>
          {item.text}
        </Text>
        {!!item.sender && (
          <Text style={[msgSt.metaText, { color: colors.metaText }]}>
            {item.sender} • {item.timestamp}
          </Text>
        )}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SENT TEXT BUBBLE — right-aligned, UserAvatar (purple) to the RIGHT
// ─────────────────────────────────────────────────────────────────────────────
function SentBubble({ item, colors }) {
  return (
    <View style={[msgSt.row, msgSt.rowRight]}>
      <View
        style={[
          msgSt.bubble,
          {
            backgroundColor:    colors.sentBg,
            borderRadius:       14,
            borderTopRightRadius: 4,
            maxWidth: "78%",
          },
        ]}
      >
        <Text style={[msgSt.bubbleText, { color: colors.sentText }]}>
          {item.text}
        </Text>
        {!!item.sender && (
          <Text
            style={[msgSt.metaText, { color: colors.metaText, textAlign: "right" }]}
          >
            {item.sender} • {item.timestamp}
          </Text>
        )}
      </View>

      {/* Purple UserAvatar — to the right of sent bubble */}
      {item.showAvatar && (
        <View style={msgSt.avatarRight}>
          <UserAvatar size={36} />
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE ROUTER
// ─────────────────────────────────────────────────────────────────────────────
function MessageItem({ item, isDark, colors }) {
  if (item.type === "video") return <VideoBubble    item={item} colors={colors} />;
  if (item.isMine)            return <SentBubble    item={item} colors={colors} />;
  return                             <ReceivedBubble item={item} isDark={isDark} colors={colors} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT PANEL CONTENT
// ─────────────────────────────────────────────────────────────────────────────
function ChatPanelContent({
  messages,
  setMessages,
  draft,
  setDraft,
  listRef,
  chatTitle,
  isDark,
  colors,
  pendingMedicines = [],
  onSendMedicines,
}) {
  const send = () => {
    const trimmedDraft = draft.trim();
    if (!trimmedDraft && pendingMedicines.length === 0) return;

    if (trimmedDraft) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          type: "text",
          text: trimmedDraft,
          sender: "You",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMine: true,
          showAvatar: true,
        },
      ]);
    }

    if (onSendMedicines) {
      onSendMedicines();
    } else {
      setDraft("");
    }

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const hasSendContent = draft.trim().length > 0 || pendingMedicines.length > 0;

  return (
    <View
      style={[
        panelSt.card,
        {
          backgroundColor: colors.cardBg,
          borderRadius:    14,
          margin:          10,
          borderWidth:     1,
          borderColor:     colors.cardBorder,
          shadowColor:     "#000",
          shadowOffset:    { width: 0, height: 2 },
          shadowOpacity:   isDark ? 0.4 : 0.08,
          shadowRadius:    8,
          elevation:       4,
          flex:            1,
        },
      ]}
    >
      {/* ── TITLE BAR ── */}
      <View
        style={[
          panelSt.titleBar,
          {
            backgroundColor:   colors.titleBarBg,
            borderBottomColor: colors.divider,
            borderTopLeftRadius:  13,
            borderTopRightRadius: 13,
          },
        ]}
      >
        <Text style={[panelSt.titleText, { color: colors.titleText }]}>
          {chatTitle}
        </Text>
      </View>

      {/* ── MESSAGES LIST ── */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageItem item={item} isDark={isDark} colors={colors} />
        )}
        contentContainerStyle={[
          panelSt.msgList,
          { backgroundColor: colors.listBg },
        ]}
        style={{ flex: 1, backgroundColor: colors.listBg }}
        showsVerticalScrollIndicator={true}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: false })
        }
      />

      {/* ── INPUT BAR ── */}
      <View
        style={[
          panelSt.inputBar,
          {
            backgroundColor:      colors.inputBarBg,
            borderTopColor:       colors.divider,
            borderBottomLeftRadius:  13,
            borderBottomRightRadius: 13,
          },
        ]}
      >
        <TextInput
          style={[panelSt.textInput, { color: colors.inputText }]}
          placeholder="Click on the mic or type.."
          placeholderTextColor={colors.placeholder}
          value={draft}
          onChangeText={setDraft}
          multiline
          maxHeight={90}
          returnKeyType="default"
        />

        {/* Mic */}
        <TouchableOpacity
          style={[
            panelSt.iconCircle,
            { borderColor: colors.iconBorder, backgroundColor: colors.iconCircleBg },
          ]}
          activeOpacity={0.7}
        >
          <MicIcon color={colors.iconColor} size={18} />
        </TouchableOpacity>

        {/* Attachment */}
        <TouchableOpacity
          style={[
            panelSt.iconCircle,
            { borderColor: colors.iconBorder, backgroundColor: colors.iconCircleBg },
          ]}
          activeOpacity={0.7}
        >
          <AttachmentIcon color={colors.iconColor} size={18} />
        </TouchableOpacity>

        {/* Send */}
        <TouchableOpacity
          style={[panelSt.sendBtn, { opacity: hasSendContent ? 1 : 0.55 }]}
          onPress={send}
          activeOpacity={0.82}
          disabled={!hasSendContent}
        >
          <SendArrowIcon size={14} />
          <Text style={panelSt.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHATPANEL  (default export)
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatPanel({
  visible,
  onClose,
  chatTitle        = "Julia (Crew)",
  initialMessages,
  mode             = "inline",
  message,
  setMessage,
  pendingMedicines = [],
  onSendMedicines,
}) {
  const [messages, setMessages] = useState(initialMessages ?? INITIAL_MESSAGES);
  const listRef                 = useRef(null);

  const themeCtx = useTheme();
  const t        = themeCtx?.theme ?? lightTheme;
  const isDark   = themeCtx?.dark  ?? false;

  const draft    = message   || "";
  const setDraft = setMessage;

  // ── COLOR PALETTE ──────────────────────────────────────────────────────────
  const colors = isDark
    ? {
        cardBg:        "#0B1829",
        cardBorder:    "#1A2E4A",
        titleBarBg:    "#0D1F35",
        titleText:     "#B8D0EE",
        divider:       "#152E50",
        listBg:        "#0B1829",
        receivedBg:    "#112240",
        receivedText:  "#C8DCF2",
        sentBg:        "#112240",
        sentText:      "#C8DCF2",
        videoBubbleBg: "#0D1E34",
        metaText:      "#3D5A7A",
        inputBarBg:    "#0B1829",
        inputText:     "#C0D8F0",
        placeholder:   "#2A4060",
        iconCircleBg:  "transparent",
        iconBorder:    "#1E3A58",
        iconColor:     "#EBEDF0",
      }
    : {
        cardBg:        t.cdInstructionsBg       ?? "#FFFFFF",
        cardBorder:    t.cdChatInputBarBorder   ?? "#A8C0E8",
        titleBarBg:    t.cdCardSectionLabelBg   ?? "#EBF1FC",
        titleText:     t.cdCardSectionLabel     ?? "#1A3A6B",
        divider:       t.cdChatInputBarBorder   ?? "#D4E0F4",
        listBg:        t.cdInstructionsBg       ?? "#FFFFFF",
        receivedBg:    t.cdChatBubbleBg         ?? "#EFF4FF",
        receivedText:  t.cdChatText             ?? "#1A2A40",
        sentBg:        t.cdChatBubbleBg         ?? "#EFF4FF",
        sentText:      t.cdChatText             ?? "#1A2A40",
        videoBubbleBg: "#EFF4FF",
        metaText:      t.cdChatFooter           ?? "#7A90B0",
        inputBarBg:    t.cdChatInputBarBg       ?? "#FFFFFF",
        inputText:     t.cdChatInputText        ?? "#1A2A40",
        placeholder:   t.cdChatInputPlaceholder ?? "#9AAAC0",
        iconCircleBg:  "transparent",
        iconBorder:    t.cdIconCircleBtnBorder  ?? "#B8C8E4",
        iconColor:     "#607090",
      };

  const contentProps = {
    messages, setMessages, draft, setDraft,
    listRef, chatTitle, isDark, colors,
    pendingMedicines, onSendMedicines,
  };

  // ── INLINE MODE ──────────────────────────────────────────────────────────
  if (mode === "inline") {
    if (!visible) return null;
    return (
      <KeyboardAvoidingView
        style={panelSt.inlineOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ChatPanelContent {...contentProps} />
      </KeyboardAvoidingView>
    );
  }

  // ── MODAL MODE ───────────────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.cardBg }}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.cardBg}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ChatPanelContent {...contentProps} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL LAYOUT STYLES
// ─────────────────────────────────────────────────────────────────────────────
const panelSt = StyleSheet.create({
  inlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  card: {
    // Do NOT set overflow:"hidden" — it clips the left-side avatar on received bubbles
  },

  titleBar: {
    paddingHorizontal: 16,
    paddingVertical:   11,
    borderBottomWidth: 1,
  },
  titleText: {
    fontSize:      13,
    fontWeight:    "700",
    letterSpacing: 0.2,
  },

  msgList: {
    paddingLeft:   10,   // avatar slot is 44px wide — minimal left pad, card has no overflow:hidden now
    paddingRight:  10,
    paddingTop:    14,
    paddingBottom: 8,
    flexGrow:      1,
  },

  inputBar: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 10,
    paddingVertical:   10,
    borderTopWidth:    1,
    gap:               8,
  },
  textInput: {
    flex:              1,
    fontSize:          13,
    paddingVertical:   Platform.OS === "ios" ? 6 : 4,
    paddingHorizontal: 4,
    minHeight:         34,
  },

  iconCircle: {
    width:          38,
    height:         38,
    borderRadius:   19,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
  },

  sendBtn: {
    flexDirection:     "row",
    alignItems:        "center",
    backgroundColor:   "#0A5FFF",
    borderRadius:      10,
    paddingHorizontal: 14,
    paddingVertical:   9,
    gap:               6,
  },
  sendBtnText: {
    color:      "#FFFFFF",
    fontSize:   13,
    fontWeight: "600",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE STYLES
// ─────────────────────────────────────────────────────────────────────────────
const msgSt = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems:    "flex-end",
    marginBottom:  16,
    paddingRight:  4,
  },
  rowLeft: {
    justifyContent: "flex-start",
  },
  rowRight: {
    justifyContent: "flex-end",
  },

  // Fixed 44 px slot on the LEFT.
  // alignSelf:"stretch" → grows to the full height of the row (= bubble height)
  // justifyContent:"flex-end" → pins the avatar SVG to the bottom of the slot
  avatarSlotLeft: {
    width:          44,
    alignSelf:      "stretch",
    alignItems:     "center",
    justifyContent: "flex-end",
    marginRight:    6,
  },

  // Avatar to the RIGHT of video / sent bubbles.
  // Row alignItems:"flex-end" pins it to the bottom automatically.
  avatarRight: {
    marginLeft: 8,
  },

  bubble: {
    paddingHorizontal: 12,
    paddingVertical:   10,
  },
  bubbleText: {
    fontSize:   13,
    lineHeight: 20,
  },
  metaText: {
    marginTop:  6,
    fontSize:   11,
    lineHeight: 14,
  },

  videoBubble: {
    maxWidth:     "70%",
    borderRadius: 14,
    overflow:     "hidden",
  },
  videoThumb: {
    width:       "100%",
    aspectRatio: 16 / 10,
  },
  videoImg: {
    width:  "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems:      "center",
    justifyContent:  "center",
    backgroundColor: "rgba(0,0,0,0.28)",
  },
});
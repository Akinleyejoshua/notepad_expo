import React, { useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

export default function CustomRichEditor() {
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false); // Global spinner toggle for encoding states

  const editorHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        * { font-family: 'Bricolage Grotesque', sans-serif; box-sizing: border-box; }
        body {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          padding: 15px;
          margin: 0;
          color: #1c1c1e;
          background-color: transparent;
        }
        [contenteditable]:focus { outline: none; }
        img, video { max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; display: block; background-color: #f3f4f6; }
        audio { width: 100%; margin: 12px 0; display: block; }
        .media-block { display: block; margin: 10px 0; width: 100%; }
      </style>
    </head>
    <body>
      <div id="editor" contenteditable="true" placeholder="Start your note..."></div>
      
      <script>
        const editor = document.getElementById('editor');
        let mediaRecorder;
        let audioChunks = [];

        document.addEventListener('selectionchange', () => {
          const styles = [];
          if (document.queryCommandState('bold')) styles.push('bold');
          if (document.queryCommandState('italic')) styles.push('italic');
          if (document.queryCommandState('underline')) styles.push('underline');
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'STYLE_CHANGE', styles }));
        });

        // Safe DOM append layout injector
        window.insertMediaToDOM = function(htmlContent) {
          editor.focus();
          const selection = window.getSelection();
          
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (editor.contains(range.commonAncestorContainer)) {
              const node = range.createContextualFragment(htmlContent);
              range.insertNode(node);
              range.collapse(false);
              return;
            }
          }
          
          const container = document.createElement('div');
          container.className = 'media-block';
          container.innerHTML = htmlContent;
          editor.appendChild(container);
        };

        async function startWebAudioRecord() {
          try {
            audioChunks = [];
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType });
            
            mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: mimeType });
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = () => {
                const base64Audio = reader.result;
                const audioTag = '<audio src="' + base64Audio + '" controls></audio><br>';
                window.insertMediaToDOM(audioTag);
              };
            };

            mediaRecorder.start();
          } catch (err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: err.toString() }));
          }
        }

        function stopWebAudioRecord() {
          if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
          }
        }
      </script>
    </body>
    </html>
  `;

  const formatText = (command: string, value: string = "") => {
    const js = `document.execCommand('${command}', false, '${value}'); true;`;
    webViewRef.current?.injectJavaScript(js);
  };

  const triggerNativeMediaInsertion = (htmlTag: string) => {
    const js = `window.insertMediaToDOM('${htmlTag}'); true;`;
    webViewRef.current?.injectJavaScript(js);
  };

  // 3. Upgraded Media Picker Core (With Base64 Transcoding engine)
  const pickMedia = async (type: "image" | "video") => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission Denied", "Camera roll access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === "image" ? ['images'] : ['videos'],
      quality: 0.7, // Lower compression slightly to speed up string conversion processing timelines
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      
      try {
        setIsLoadingMedia(true);

        // Convert file layout addresses directly to embedded stream blocks
        const base64Data = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Grab clean layout formats, fallback smoothly if properties are blank
        const mimeType = asset.mimeType || (type === "image" ? "image/jpeg" : "video/mp4");
        const dataUri = `data:${mimeType};base64,${base64Data}`;

        if (type === "image") {
          triggerNativeMediaInsertion(`<img src="${dataUri}" alt="Embedded Image" />`);
        } else {
          triggerNativeMediaInsertion(`<video src="${dataUri}" controls playsinline preload="auto"></video>`);
        }
      } catch (error) {
        Alert.alert("Encoding Error", "Failed to compile file binaries into canvas viewport.");
      } finally {
        setIsLoadingMedia(false);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      webViewRef.current?.injectJavaScript(`stopWebAudioRecord(); true;`);
      setIsRecording(false);
    } else {
      webViewRef.current?.injectJavaScript(`startWebAudioRecord(); true;`);
      setIsRecording(true);
    }
  };

  return (
    <>
      <View style={styles.toolbarBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={[styles.iconButton, activeStyles.includes("bold") && styles.activeIconButton]} onPress={() => formatText("bold")}>
            <FontAwesome5 name="bold" size={16} color={activeStyles.includes("bold") ? "#ffffff" : "#4b5563"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconButton, activeStyles.includes("italic") && styles.activeIconButton]} onPress={() => formatText("italic")}>
            <FontAwesome5 name="italic" size={16} color={activeStyles.includes("italic") ? "#ffffff" : "#4b5563"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconButton, activeStyles.includes("underline") && styles.activeIconButton]} onPress={() => formatText("underline")}>
            <FontAwesome5 name="underline" size={16} color={activeStyles.includes("underline") ? "#ffffff" : "#4b5563"} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.iconButton} disabled={isLoadingMedia} onPress={() => pickMedia("image")}>
            <Ionicons name="image-outline" size={20} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} disabled={isLoadingMedia} onPress={() => pickMedia("video")}>
            <Ionicons name="videocam-outline" size={20} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconButton, isRecording && styles.recordingButton]} onPress={toggleRecording}>
            <Ionicons name={isRecording ? "stop-circle" : "mic-outline"} size={20} color={isRecording ? "#ef4444" : "#4b5563"} />
          </TouchableOpacity>

          {isLoadingMedia && <ActivityIndicator size="small" color="#2563eb" style={{ marginLeft: 6 }} />}
        </ScrollView>
      </View>

      <View style={styles.canvasContainer}>
        <WebView
          style={{ backgroundColor: 'transparent' }}
          ref={webViewRef}
          source={{ html: editorHTML }}
          onMessage={(e) => {
            try {
              const data = JSON.parse(e.nativeEvent.data);
              if (data.type === "STYLE_CHANGE") setActiveStyles(data.styles);
              if (data.type === "ERROR") {
                Alert.alert("Hardware Access Blocked", "Please verify microphone permissions are checked in your device System Settings app.");
              }
            } catch {}
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          dataDetectorTypes={Platform.OS === "ios" ? "none" : ["none"]}
          nestedScrollEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          
          // Sandboxing override parameters
          originWhitelist={['*']}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          
          {...(Platform.OS === 'android' ? {
            onPermissionRequest: (request: any) => {
              request.grant(request.resources);
            }
          } : {})}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  toolbarBar: { height: 52, backgroundColor: "#f9fafb18", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", justifyContent: "center" },
  scrollContainer: { alignItems: "center", paddingHorizontal: 12, gap: 10 },
  iconButton: { width: 38, height: 38, borderRadius: 8, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e5e7eb" },
  activeIconButton: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  recordingButton: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
  divider: { width: 1, height: 24, backgroundColor: "#d1d5db", marginHorizontal: 4 },
  canvasContainer: { flex: 1 },
});
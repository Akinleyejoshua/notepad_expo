import React, { useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator, PermissionsAndroid } from "react-native";
import { WebView } from "react-native-webview";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

export default function CustomRichEditor({placeholder, onChange}:any) {
  const webViewRef = useRef<WebView>(null);
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

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
        
        #recording-indicator {
          display: none;
          align-items: center;
          gap: 8px;
          color: #ef4444;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 10px;
          padding: 6px 12px;
          background-color: #fef2f2;
          border-radius: 20px;
          width: fit-content;
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }

        .media-container {
          position: relative;
          margin: 16px 0;
          padding: 12px;
          background-color: #f3f4f6;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
        }
        
        .media-container audio {
          flex: 1;
          margin-right: 8px;
        }

        .asset-delete-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 26px;
          height: 26px;
          border-radius: 13px;
          background-color: #ef4444;
          color: #ffffff;
          border: 2px solid #ffffff;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div id="recording-indicator"><div class="dot"></div><span>Recording live voice note...</span></div>

      <div id="editor" contenteditable="true" placeholder="Start your note..."></div>
      
      <script>
        const editor = document.getElementById('editor');
        const indicator = document.getElementById('recording-indicator');
        let mediaRecorder = null;
        let audioChunks = [];
        let currentStream = null;

        function logToNative(stage, detail = "") {
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: 'TRACKER', 
            message: stage + (detail ? ' -> ' + detail : '') 
          }));
        }

        document.addEventListener('selectionchange', () => {
          const styles = [];
          if (document.queryCommandState('bold')) styles.push('bold');
          if (document.queryCommandState('italic')) styles.push('italic');
          if (document.queryCommandState('underline')) styles.push('underline');
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'STYLE_CHANGE', styles }));
        });

        window.insertMediaToDOM = function(htmlContent) {
          editor.focus();
          const selection = window.getSelection();
          
          const fullyWrappedAsset = \`
            <div class="media-container" contenteditable="false">
              \${htmlContent}
              <button class="asset-delete-btn" onclick="this.parentElement.remove();" type="button">×</button>
            </div>
            <br />
          \`;
          
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (editor.contains(range.commonAncestorContainer)) {
              const node = range.createContextualFragment(fullyWrappedAsset);
              range.insertNode(node);
              range.collapse(false);
              return;
            }
          }
          
          const container = document.createElement('div');
          container.className = 'media-block';
          container.innerHTML = fullyWrappedAsset;
          editor.appendChild(container);
        };

        // Web Audio API Loop Engine
        async function startWebAudioRecord() {
          try {
            audioChunks = [];
            logToNative("Requesting browser mic stream");
            
            currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Fallback for container configurations
            let options = { mimeType: 'audio/webm' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options = { mimeType: 'audio/mp4' };
            }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options = { mimeType: '' }; 
            }

            mediaRecorder = new MediaRecorder(currentStream, options);
            
            mediaRecorder.ondataavailable = (event) => {
              if (event.data && event.data.size > 0) {
                audioChunks.push(event.data);
              }
            };

            mediaRecorder.onstop = () => {
              indicator.style.display = 'none';

              if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
                currentStream = null;
              }

              if (audioChunks.length === 0) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                  type: 'ERROR', 
                  message: 'Recording returned an empty buffer.' 
                }));
                return;
              }

              const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/mp4' });
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = () => {
                const base64Audio = reader.result;
                const audioTag = '<audio src="' + base64Audio + '" controls></audio>';
                window.insertMediaToDOM(audioTag);
              };
            };

            mediaRecorder.start(250); 
            indicator.style.display = 'flex';
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SYNC_REC_STATE', recording: true }));

          } catch (err) {
            indicator.style.display = 'none';
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: 'Mic Error: ' + err.toString() }));
          }
        }

        function stopWebAudioRecord() {
          try {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SYNC_REC_STATE', recording: false }));
            }
          } catch (err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: 'Stop Error: ' + err.toString() }));
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

  const pickMedia = async (type: "image" | "video") => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission Denied", "Camera roll access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === "image" ? ['images'] : ['videos'],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      try {
        setIsLoadingMedia(true);
        const base64Data = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const mimeType = asset.mimeType || (type === "image" ? "image/jpeg" : "video/mp4");
        const dataUri = `data:${mimeType};base64,${base64Data}`;

        if (type === "image") {
          triggerNativeMediaInsertion(`<img src="${dataUri}" alt="Embedded Image" />`);
        } else {
          triggerNativeMediaInsertion(`<video src="${dataUri}" controls playsinline preload="auto"></video>`);
        }
      } catch (error) {
        Alert.alert("Encoding Error", "Failed to compile file binaries.");
      } finally {
        setIsLoadingMedia(false);
      }
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      webViewRef.current?.injectJavaScript(`stopWebAudioRecord(); true;`);
    } else {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: "Microphone Access",
              message: "This notepad requires microphone access to insert voice notes.",
              buttonPositive: "OK",
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permission Denied", "System microphone access is required.");
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }
      webViewRef.current?.injectJavaScript(`startWebAudioRecord(); true;`);
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
          source={{ 
            html: editorHTML,
            baseUrl: Platform.OS === 'ios' ? 'https://localhost' : 'http://localhost'
          }}
          onMessage={(e) => {
            try {
              const data = JSON.parse(e.nativeEvent.data);
              if (data.type === "STYLE_CHANGE") setActiveStyles(data.styles);
              if (data.type === "SYNC_REC_STATE") setIsRecording(data.recording);
              if (data.type === "TRACKER") console.log("🎙️ [WEB_RECORDER_LOG]:", data.message);
              if (data.type === "ERROR") {
                setIsRecording(false);
                Alert.alert("Media Engine Error", data.message);
              }
            } catch {}
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          dataDetectorTypes={Platform.OS === "ios" ? "none" : ["none"]}
          nestedScrollEnabled={true}
          mediaPlaybackRequiresUserAction={false} // 🌟 CRITICAL FOR IOS WEB MIC ACCESS
          originWhitelist={['*']}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          mediaCapturePermissionGrantType="grant" // Force authorization approval pass

          {...(Platform.OS === 'android' ? {
            onPermissionRequest: (request: any) => {
              request.grant(request.resources); // 🌟 CRITICAL FOR ANDROID WEB MIC ACCESS
            }
          } : {})}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  toolbarBar: { height: 52, backgroundColor: "#f9fafb04", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", justifyContent: "center" },
  scrollContainer: { alignItems: "center", paddingHorizontal: 12, gap: 10 },
  iconButton: { width: 38, height: 38, borderRadius: 8, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e5e7eb" },
  activeIconButton: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  recordingButton: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
  divider: { width: 1, height: 24, backgroundColor: "#d1d5db", marginHorizontal: 4 },
  canvasContainer: { flex: 1 },
});
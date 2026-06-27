import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import {
  Menu,
  X,
  Home,
  BookOpen,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Globe,
  Layers,
  Settings,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

// ─── NAV LINK GROUPS ────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Main',
    links: [
      { icon: Home, title: 'Portfolio Home', path: '/', key: 'home' },
    ],
  },
  {
    label: 'Content',
    links: [
      { icon: BookOpen, title: 'Insights & Blog', path: '/blog', key: 'blog' },
    ],
  },
  {
    label: 'Management',
    links: [
      { icon: ShieldCheck, title: 'Admin Dashboard', path: '/admin', key: 'admin' },
    ],
  },
];

export default function PremiumPortfolioWrapper() {
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();
  const [currentUrl, setCurrentUrl] = useState('https://joshuapro.netlify.app');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Shared value for drawer position (0 = closed, 1 = fully open)
  const drawerProgress = useSharedValue(0);

  // CSS injection to hide ALL existing site navigation, headers, sidebars, and footers
  const injectedJavaScript = `
    (function() {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = [
        /* Generic element selectors */
        'header { display: none !important; height: 0 !important; overflow: hidden !important; }',
        'footer { display: none !important; height: 0 !important; overflow: hidden !important; }',
        'nav { display: none !important; }',
        'aside { display: none !important; }',

        /* Specific CSS-module class selectors from joshuapro.netlify.app */
        /* Main header bar */
        '[class*="header-module"] { display: none !important; height: 0 !important; max-height: 0 !important; overflow: hidden !important; padding: 0 !important; margin: 0 !important; }',
        /* Mobile sidebar / menu */
        '[class*="mobileMenu"] { display: none !important; }',
        '[class*="mobileNav"] { display: none !important; }',
        '[class*="sidebarHeader"] { display: none !important; }',
        '[class*="menuBtn"] { display: none !important; }',
        /* Overlay behind mobile menu */
        '[class*="header-module"][class*="overlay"] { display: none !important; }',
        /* Footer */
        '[class*="footer-module"] { display: none !important; height: 0 !important; overflow: hidden !important; }',
        /* Nav links */
        '[class*="nav-link-module"] { display: none !important; }',
        /* Generic fallbacks */
        '.sidebar, #header, .nav-container, .menu-btn, #nav, .navbar, .site-header, .site-footer, .site-nav { display: none !important; }',

        /* Reclaim space so content flows to the top */
        'main { padding-top: 0 !important; margin-top: 0 !important; }',
        'body { padding-top: 0 !important; margin-top: 0 !important; }'
      ].join(' ');
      document.head.appendChild(style);

      /* Continuously re-apply in case the site re-renders (Next.js SPA transitions) */
      var observer = new MutationObserver(function() {
        if (!document.head.contains(style)) {
          document.head.appendChild(style);
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });

      var lastUrl = location.href;
      setInterval(function() {
        if (location.href !== lastUrl) {
          lastUrl = location.href;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'URL_CHANGE', url: location.href }));
        }
      }, 500);
    })();
    true;
  `;

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'URL_CHANGE') {
        setCurrentUrl(data.url);
      }
    } catch (e) {}
  };

  const navigateToWebPath = (path: string) => {
    closeDrawer();
    const jsNavigation = `
      window.location.pathname = "${path}";
      true;
    `;
    webViewRef.current?.injectJavaScript(jsNavigation);
  };

  // ─── DRAWER ANIMATION (uses progress 0→1 instead of raw translateX) ───
  const openDrawer = () => {
    drawerProgress.value = withSpring(1, {
      damping: 20,
      stiffness: 200,
      mass: 0.8,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    drawerProgress.value = withSpring(0, {
      damping: 20,
      stiffness: 200,
      mass: 0.8,
    });
    setIsDrawerOpen(false);
  };

  // ─── PAN GESTURE ──────────────────────────────────────────
  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((event) => {
      const base = isDrawerOpen ? 1 : 0;
      const delta = event.translationX / DRAWER_WIDTH;
      let next = base + delta;
      // Clamp between 0 and 1
      if (next < 0) next = 0;
      if (next > 1) next = 1;
      drawerProgress.value = next;
    })
    .onEnd((event) => {
      if (event.translationX > 50 || event.velocityX > 500) {
        runOnJS(openDrawer)();
      } else if (event.translationX < -50 || event.velocityX < -500) {
        runOnJS(closeDrawer)();
      } else {
        if (isDrawerOpen) runOnJS(openDrawer)();
        else runOnJS(closeDrawer)();
      }
    });

  // ─── ANIMATED STYLES (interpolated from progress, no equality checks) ─
  const animatedDrawerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          drawerProgress.value,
          [0, 1],
          [-DRAWER_WIDTH, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      drawerProgress.value,
      [0, 1],
      [0, 0.55],
      Extrapolation.CLAMP
    ),
    // Use display to fully remove from interaction when closed
    pointerEvents: drawerProgress.value > 0.01 ? 'auto' : 'none',
  }));

  // Determine active route
  const isBlog = currentUrl.includes('/blog');
  const isAdmin = currentUrl.includes('/admin');
  const activeKey = isAdmin ? 'admin' : isBlog ? 'blog' : 'home';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {/* ─── PREMIUM HEADER BAR ─── */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={isDrawerOpen ? closeDrawer : openDrawer}
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            {isDrawerOpen ? (
              <X size={22} color="#ffffff" strokeWidth={2} />
            ) : (
              <Menu size={22} color="#ffffff" strokeWidth={2} />
            )}
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Sparkles size={16} color="#818cf8" />
            <Text style={styles.headerTitle}>JOSHUA PRO</Text>
          </View>

          <TouchableOpacity style={styles.headerAction} activeOpacity={0.7}>
            <Globe size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* ─── PRIMARY WEB VIEW ─── */}
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://joshuapro.netlify.app' }}
          injectedJavaScript={injectedJavaScript}
          onMessage={onMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          incognito={Platform.OS === 'ios'}
        />

        {/* ─── BACKDROP OVERLAY ─── */}
        <Animated.View
          style={[styles.overlay, animatedOverlayStyle]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={closeDrawer}
            activeOpacity={1}
          />
        </Animated.View>

        {/* ─── SIDE NAV DRAWER ─── */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.drawer,
              animatedDrawerStyle,
              { paddingTop: insets.top + 16 },
            ]}
          >
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.drawerBrandRow}>
                <View style={styles.brandIcon}>
                  <Layers size={20} color="#818cf8" />
                </View>
                <View>
                  <Text style={styles.drawerBrandTitle}>Joshua Pro</Text>
                  <Text style={styles.drawerBrandSub}>Portfolio Navigator</Text>
                </View>
              </View>
            </View>

            <View style={styles.drawerDivider} />

            {/* Grouped Nav Links */}
            {NAV_GROUPS.map((group, groupIndex) => (
              <View key={group.label} style={groupIndex > 0 ? styles.navGroupSpacing : undefined}>
                <Text style={styles.navGroupLabel}>{group.label.toUpperCase()}</Text>
                {group.links.map((link) => {
                  const isActive = activeKey === link.key;
                  const IconComponent = link.icon;
                  return (
                    <TouchableOpacity
                      key={link.key}
                      style={[
                        styles.drawerItem,
                        isActive && styles.drawerItemActive,
                      ]}
                      onPress={() => navigateToWebPath(link.path)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.drawerIconWrap,
                          isActive && styles.drawerIconWrapActive,
                        ]}
                      >
                        <IconComponent
                          size={18}
                          color={isActive ? '#818cf8' : '#6b7280'}
                          strokeWidth={isActive ? 2.2 : 1.8}
                        />
                      </View>
                      <Text
                        style={[
                          styles.drawerText,
                          isActive && styles.drawerTextActive,
                        ]}
                      >
                        {link.title}
                      </Text>
                      {isActive && (
                        <ChevronRight
                          size={16}
                          color="#818cf8"
                          style={{ marginLeft: 'auto' }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {/* Bottom section */}
            <View style={styles.drawerFooter}>
              <View style={styles.drawerDivider} />
              <TouchableOpacity style={styles.drawerItem} activeOpacity={0.7}>
                <View style={styles.drawerIconWrap}>
                  <Settings size={18} color="#6b7280" strokeWidth={1.8} />
                </View>
                <Text style={styles.drawerText}>Settings</Text>
              </TouchableOpacity>

              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v1.0.0</Text>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

// ─── STYLES ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },

  // ── Header ──
  headerBar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#111118',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1e1e2a',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1a1a24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#f1f1f4',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1a1a24',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Overlay ──
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    zIndex: 99,
  },

  // ── Drawer ──
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#111118',
    zIndex: 100,
    paddingHorizontal: 16,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#1e1e2a',
  },
  drawerHeader: {
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  drawerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1a1a28',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerBrandTitle: {
    color: '#f1f1f4',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  drawerBrandSub: {
    color: '#555568',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  drawerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#1e1e2a',
    marginVertical: 16,
  },

  // ── Nav Groups ──
  navGroupSpacing: {
    marginTop: 8,
  },
  navGroupLabel: {
    color: '#44445a',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  // ── Nav Items ──
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    gap: 12,
  },
  drawerItemActive: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#2a2a42',
  },
  drawerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#16161f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerIconWrapActive: {
    backgroundColor: '#1e1e35',
  },
  drawerText: {
    color: '#8b8ba0',
    fontSize: 14,
    fontWeight: '600',
  },
  drawerTextActive: {
    color: '#e0e0f0',
  },

  // ── Footer ──
  drawerFooter: {
    marginTop: 'auto',
    paddingBottom: 24,
  },
  versionBadge: {
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#14141e',
    borderWidth: 1,
    borderColor: '#1e1e2a',
  },
  versionText: {
    color: '#44445a',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { MINI_APP_LIST, type MiniAppConfig } from '../miniApps';

type Props = {
  onOpenMiniApp: (miniApp: MiniAppConfig) => void;
};

export function HomeScreen({ onOpenMiniApp }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.home}>
        <Text style={styles.brand}>HostApp</Text>
        <Text style={styles.headline}>Mini apps</Text>
        <Text style={styles.support}>
          Tap to download a MiniApp bundle and run it here.
        </Text>

        {MINI_APP_LIST.map((miniApp) => (
          <Pressable
            key={miniApp.id}
            onPress={() => onOpenMiniApp(miniApp)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>{miniApp.title}</Text>
              <Text style={styles.rowDescription}>{miniApp.description}</Text>
            </View>
            <Text style={styles.rowAction}>Open</Text>
          </Pressable>
        ))}
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#E8F1F4',
  },
  home: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  brand: {
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#0F6E56',
  },
  headline: {
    marginTop: 10,
    fontSize: 34,
    fontWeight: '700',
    color: '#123047',
  },
  support: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 16,
    lineHeight: 22,
    color: '#3A5163',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C5D4DC',
  },
  rowPressed: {
    opacity: 0.55,
  },
  rowCopy: {
    flex: 1,
    paddingRight: 16,
    gap: 4,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#123047',
  },
  rowDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3A5163',
  },
  rowAction: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F6E56',
  },
});
